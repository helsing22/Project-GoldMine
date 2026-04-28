const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Twilio opcional
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_FROM = process.env.TWILIO_FROM || '';
let twilioClient = null;
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  const twilio = require('twilio');
  twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // sirve public/, index.html, etc.

// Helper para leer shifts.json
function getShiftForDate(dateStr) {
  const shiftsPath = path.join(__dirname, 'src', 'data', 'shifts.json');
  if (!fs.existsSync(shiftsPath)) return null;
  const shifts = JSON.parse(fs.readFileSync(shiftsPath, 'utf8'));
  return shifts[dateStr] || shifts['default'] || null;
}

// Endpoint opcional para info del turno
app.get('/api/shift', (req, res) => {
  const today = new Date().toISOString().slice(0,10);
  const shift = getShiftForDate(today);
  if (!shift) return res.status(404).json({ error: 'No hay turno configurado' });
  const qrUrl = `${req.protocol}://${req.get('host')}/public/qrs/${shift.qr}`;
  res.json({ ...shift, qrUrl });
});

// Procesar orden
app.post('/api/order', async (req, res) => {
  try {
    const { items, total, paymentMethod, delivery } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Carrito vacío' });

    const today = new Date().toISOString().slice(0,10);
    const shift = getShiftForDate(today) || { phone: null, qr: 'default.png', staff: 'turno' };

    // Guardar pedido en orders.json
    const ordersPath = path.join(__dirname, 'orders.json');
    const order = { id: Date.now(), createdAt: new Date().toISOString(), items, total, paymentMethod, delivery, shift };
    let orders = [];
    if (fs.existsSync(ordersPath)) orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
    orders.push(order);
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));

    // Efectivo y NO domicilio -> enviar SMS al teléfono del turno
    if (paymentMethod === 'cash' && delivery === false) {
      const phone = shift.phone;
      const message = `Nuevo pedido para retiro:\nTotal: ${total} CUP\nItems:\n` + items.map(i => `- ${i.name} x${i.qty} (${i.price} CUP)`).join('\n');
      if (twilioClient && phone && TWILIO_FROM) {
        await twilioClient.messages.create({ body: message, from: TWILIO_FROM, to: phone });
        return res.json({ message: 'Pedido enviado por SMS al personal de turno', staff: shift.staff });
      } else {
        console.warn('Twilio no configurado. SMS no enviado. Mensaje:', message);
        return res.json({ message: 'Pedido registrado. Twilio no configurado: SMS no enviado.', staff: shift.staff });
      }
    }

    // Pago en línea -> devolver URL del QR
    if (paymentMethod === 'online') {
      const qrFile = shift.qr || 'default.png';
      const qrUrl = `${req.protocol}://${req.get('host')}/public/qrs/${qrFile}`;
      return res.json({ message: 'QR generado', qrUrl, staff: shift.staff });
    }

    // Otros casos
    return res.json({ message: 'Pedido registrado', staff: shift.staff });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Servir index
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
