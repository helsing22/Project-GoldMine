-- Tabla shifts para administrar turnos y QR
CREATE TABLE IF NOT EXISTS shifts (
  id SERIAL PRIMARY KEY,
  shift_date DATE UNIQUE,
  staff VARCHAR(100) NOT NULL,
  phone VARCHAR(32),
  qr_filename VARCHAR(255),
  zelle_link TEXT,
  paypal_link TEXT,
  visa_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla orders para registrar pedidos (opcional)
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  items JSONB NOT NULL,
  total NUMERIC(12,2) NOT NULL,
  payment_method VARCHAR(32) NOT NULL,
  shift_id INTEGER REFERENCES shifts(id),
  notes TEXT
);
