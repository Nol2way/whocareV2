-- ============================================================
-- Create bookings table (base schema)
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  user_type VARCHAR(20) NOT NULL DEFAULT 'thai',
  service_id INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  booking_time VARCHAR(10) NOT NULL,
  branch VARCHAR(255),
  contact_name VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  contact_email VARCHAR(255),
  note TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  deposit_amount DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint: prevent double booking same slot (except cancelled)
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_unique_slot
  ON bookings (service_id, booking_date, booking_time)
  WHERE status NOT IN ('cancelled');

CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings (user_id, user_type);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
