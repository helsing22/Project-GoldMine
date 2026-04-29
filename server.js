// server.js - servidor Express simple (sin Twilio)
// Sirve archivos estáticos y endpoints /api/shift y /api/qr
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

function readShifts() {
  const shiftsPath = path.join(__dirname, 'src', 'data', 'shifts.json');
  if (!fs.existsSync(shiftsPath)) return null;
  try {
    const raw = fs.readFileSync(shiftsPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error leyendo shifts.json', err);
    return null;
  }
}

function getShiftForDate(dateStr) {
  const shifts = readShifts();
  if (!shifts) return null;
  return shifts[dateStr] || shifts['default'] || null;
}

// Endpoint para obtener info del turno (links y staff)
app.get('/api/shift', (req, res) => {
  const today = new Date().toISOString().slice(0,10);
  const shift = getShiftForDate(today);
  if (!shift) return res.status(404).json({ error: 'No hay turno configurado' });
  // Construir URL pública del QR
  const qrUrl = `${req.protocol}://${req.get('host')}/public/qrs/${shift.qr}`;
  res.json({ ...shift, qrUrl });
});

// Endpoint para devolver QR Transfermóvil del día
app.get('/api/qr', (req, res) => {
  const today = new Date().toISOString().slice(0,10);
  const shift = getShiftForDate(today) || { qr: 'default-transfer.png', staff: 'turno' };
  const qrUrl = `${req.protocol}://${req.get('host')}/public/qrs/${shift.qr}`;
  res.json({ qrUrl, staff: shift.staff || 'turno' });
});

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
