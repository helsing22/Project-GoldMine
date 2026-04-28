Ekisde Menu

1. Preparar repo
- Coloca QR en public/qrs/ con nombres que coincidan en src/data/shifts.json
- Completa src/data/menu.js con todos los ítems reales

2. Variables de entorno en Render
- NODE_ENV=production
- TWILIO_ACCOUNT_SID (opcional)
- TWILIO_AUTH_TOKEN (opcional)
- TWILIO_FROM (opcional)

3. Deploy en Render
- Conecta repo a Render
- New Web Service -> selecciona repo
- Build Command: npm install
- Start Command: npm start

4. Opcional Postgres
- Crea servicio Postgres en Render
- Ejecuta sql/create_tables.sql
- Modifica server.js para leer shifts desde la DB en vez de shifts.json

5. Notas
- Si Twilio no está configurado, el backend registrará pedidos pero no enviará SMS.
- orders.json se crea automáticamente para registro simple.


ekisde-menu/
├─ public/
│  ├─ qrs/
│  │  └─ (coloca aquí tus imágenes QR: YYYY-MM-DD-nombre.png)
│  ├─ favicon.ico
│  └─ logo.png
├─ src/
│  ├─ data/
│  │  ├─ menu.js
│  │  └─ shifts.json
│  ├─ css/
│  │  └─ styles.css
│  └─ js/
│     └─ app.js
├─ index.html
├─ server.js
├─ package.json
├─ README.md
├─ .gitignore
└─ sql/
   └─ create_tables.sql
