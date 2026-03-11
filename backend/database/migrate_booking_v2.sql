-- ============================================================
-- Booking V2 migration: locks, deposit, unique constraint
-- ============================================================

-- Add deposit_amount column
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS deposit_amount DECIMAL(10,2) DEFAULT 0;

-- Add unique constraint to prevent double booking same slot
-- Only for non-cancelled bookings
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_unique_slot
  ON bookings (service_id, booking_date, booking_time)
  WHERE status NOT IN ('cancelled');

-- ============================================================
-- Booking locks table (temporary hold while user is booking)
-- ============================================================
CREATE TABLE IF NOT EXISTS booking_locks (
  id SERIAL PRIMARY KEY,
  service_id INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  booking_time VARCHAR(10) NOT NULL,
  user_id INT NOT NULL,
  user_type VARCHAR(20) NOT NULL DEFAULT 'thai',
  locked_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  UNIQUE (service_id, booking_date, booking_time)
);

CREATE INDEX IF NOT EXISTS idx_booking_locks_expires ON booking_locks (expires_at);
CREATE INDEX IF NOT EXISTS idx_booking_locks_lookup ON booking_locks (service_id, booking_date);
