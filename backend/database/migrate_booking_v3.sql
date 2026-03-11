-- ============================================================
-- Booking V3: doctor selection, balance system, refund requests, reschedule limit
-- ============================================================

-- 1) Add doctor_id and reschedule_count to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS doctor_id INT DEFAULT NULL;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS doctor_type VARCHAR(20) DEFAULT 'thai';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS reschedule_count INT DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_method VARCHAR(30) DEFAULT 'balance';

-- 2) User balance table (wallet)
CREATE TABLE IF NOT EXISTS user_balances (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  user_type VARCHAR(20) NOT NULL DEFAULT 'thai',
  balance DECIMAL(12,2) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, user_type)
);

-- 3) Balance transactions ledger
CREATE TABLE IF NOT EXISTS balance_transactions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  user_type VARCHAR(20) NOT NULL DEFAULT 'thai',
  type VARCHAR(30) NOT NULL CHECK (type IN ('deposit','payment','refund','adjustment')),
  amount DECIMAL(12,2) NOT NULL,
  balance_after DECIMAL(12,2) DEFAULT 0,
  description TEXT,
  booking_id INT DEFAULT NULL REFERENCES bookings(id) ON DELETE SET NULL,
  created_by INT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_balance_tx_user ON balance_transactions (user_id, user_type);
CREATE INDEX IF NOT EXISTS idx_balance_tx_booking ON balance_transactions (booking_id);

-- 4) Refund requests (multi-role approval)
CREATE TABLE IF NOT EXISTS refund_requests (
  id SERIAL PRIMARY KEY,
  booking_id INT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id INT NOT NULL,
  user_type VARCHAR(20) NOT NULL DEFAULT 'thai',
  amount DECIMAL(12,2) NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  approved_by_accountant INT DEFAULT NULL,
  approved_at_accountant TIMESTAMPTZ DEFAULT NULL,
  approved_by_reception INT DEFAULT NULL,
  approved_at_reception TIMESTAMPTZ DEFAULT NULL,
  approved_by_manager INT DEFAULT NULL,
  approved_at_manager TIMESTAMPTZ DEFAULT NULL,
  completed_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refund_requests_booking ON refund_requests (booking_id);
CREATE INDEX IF NOT EXISTS idx_refund_requests_user ON refund_requests (user_id, user_type);
CREATE INDEX IF NOT EXISTS idx_refund_requests_status ON refund_requests (status);
