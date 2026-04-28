-- Tabla shifts para administrar turnos y QR
CREATE TABLE IF NOT EXISTS shifts (
  id SERIAL PRIMARY KEY,
  shift_date DATE UNIQUE,
  staff VARCHAR(100) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  qr_filename VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla orders para registrar pedidos
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  items JSONB NOT NULL,
  total NUMERIC(12,2) NOT NULL,
  payment_method VARCHAR(32) NOT NULL,
  delivery BOOLEAN NOT NULL,
  shift_id INTEGER REFERENCES shifts(id),
  notes TEXT
);

-- Ejemplo inserts
INSERT INTO shifts (shift_date, staff, phone, qr_filename)
VALUES
  ('2026-04-28', 'Carlos', '+53500123456', '2026-04-28-carlos.png'),
  ('2026-04-29', 'María', '+53500987654', '2026-04-29-maria.png')
ON CONFLICT (shift_date) DO NOTHING;
