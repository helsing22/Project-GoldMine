# Mary - Menú de mesa

## Qué hace
Menú móvil para mesas: el cliente escanea QR de la mesa, selecciona productos, copia el monto al portapapeles y elige método de pago (Zelle, PayPal, Visa, Transfermóvil). Transfermóvil muestra un QR por turno del día.

## Estructura
- `public/qrs/` → coloca aquí las imágenes QR.
- `src/data/menu.js` → datos del menú.
- `src/data/shifts.json` → mapeo fecha -> staff, phone, qr, links.
- `src/js/app.js` → lógica frontend.
- `server.js` → servidor Express con endpoints `/api/shift` y `/api/qr`.

## Deploy (ejemplo en Render)
1. Subir repo a GitHub.
2. Crear Web Service en Render apuntando al repo.
3. Build: `npm install`
4. Start: `npm start`

## Notas
- Actualiza `src/data/shifts.json` con tus enlaces y nombres de QR.
- Coloca los archivos QR en `public/qrs/`.
- Si quieres persistencia real, conecta una base de datos y usa `sql/create_tables.sql`.
