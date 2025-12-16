-- Schema for Láminas y Cortes - Quote Management System
-- Database: PostgreSQL (Supabase)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users (se integra con Supabase Auth)
-- Supabase ya maneja esta tabla automáticamente con auth.users

-- Table: quotes
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number VARCHAR(20) UNIQUE NOT NULL, -- COT-001, COT-002, etc.
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Client information
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255),
  client_phone VARCHAR(50),

  -- Product information
  product_description TEXT NOT NULL,
  product_quantity INTEGER NOT NULL CHECK (product_quantity > 0),
  product_unit_price DECIMAL(10, 2) NOT NULL CHECK (product_unit_price >= 0),
  product_subtotal DECIMAL(10, 2) NOT NULL,
  product_iva DECIMAL(10, 2) NOT NULL,
  product_total DECIMAL(10, 2) NOT NULL,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Indexes
  CONSTRAINT quotes_number_check CHECK (number ~ '^COT-[0-9]+$')
);

-- Create index for faster queries
CREATE INDEX idx_quotes_user_id ON quotes(user_id);
CREATE INDEX idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX idx_quotes_number ON quotes(number);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Habilitar RLS en la tabla quotes
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Policy: Los usuarios solo pueden ver sus propias cotizaciones
CREATE POLICY "Users can view their own quotes"
  ON quotes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Los usuarios solo pueden crear sus propias cotizaciones
CREATE POLICY "Users can create their own quotes"
  ON quotes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Los usuarios solo pueden actualizar sus propias cotizaciones
CREATE POLICY "Users can update their own quotes"
  ON quotes
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Los usuarios solo pueden eliminar sus propias cotizaciones
CREATE POLICY "Users can delete their own quotes"
  ON quotes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to generate next quote number
CREATE OR REPLACE FUNCTION get_next_quote_number()
RETURNS VARCHAR(20) AS $$
DECLARE
  next_number INTEGER;
  quote_number VARCHAR(20);
BEGIN
  -- Get the highest quote number
  SELECT COALESCE(
    MAX(
      CAST(
        SUBSTRING(number FROM 5) AS INTEGER
      )
    ), 0
  ) + 1
  INTO next_number
  FROM quotes;

  -- Format as COT-XXX (zero-padded to 3 digits)
  quote_number := 'COT-' || LPAD(next_number::TEXT, 3, '0');

  RETURN quote_number;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE quotes IS 'Stores all customer quotes with product and pricing details';
COMMENT ON COLUMN quotes.number IS 'Unique sequential quote number (COT-001, COT-002, etc.)';
COMMENT ON COLUMN quotes.product_subtotal IS 'Calculated as quantity * unit_price';
COMMENT ON COLUMN quotes.product_iva IS 'Calculated as subtotal * 0.16 (16% IVA)';
COMMENT ON COLUMN quotes.product_total IS 'Calculated as subtotal * 1.16 (subtotal + IVA)';
