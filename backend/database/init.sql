-- ============================================================
-- Whocare Hospital — PostgreSQL / Supabase
-- ============================================================

-- ============================================================
-- Thai users table
-- ============================================================
CREATE TABLE IF NOT EXISTS users_th (
  id SERIAL PRIMARY KEY,
  title_th VARCHAR(20) NOT NULL,
  first_name_th VARCHAR(100) NOT NULL,
  last_name_th VARCHAR(100) NOT NULL,
  thai_id VARCHAR(13) NOT NULL UNIQUE,

  -- Common fields
  birth_date DATE DEFAULT NULL,
  gender VARCHAR(20) DEFAULT NULL,
  blood_type VARCHAR(10) DEFAULT NULL,
  allergies VARCHAR(255) DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,

  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_th_thai_id ON users_th (thai_id);
CREATE INDEX IF NOT EXISTS idx_users_th_email ON users_th (email);

-- ============================================================
-- Foreign users table
-- ============================================================
CREATE TABLE IF NOT EXISTS users_foreign (
  id SERIAL PRIMARY KEY,
  title_en VARCHAR(10) NOT NULL,
  first_name_en VARCHAR(100) NOT NULL,
  last_name_en VARCHAR(100) NOT NULL,
  passport VARCHAR(20) NOT NULL UNIQUE,
  nationality VARCHAR(100) DEFAULT NULL,

  -- Common fields
  birth_date DATE DEFAULT NULL,
  gender VARCHAR(20) DEFAULT NULL,
  blood_type VARCHAR(10) DEFAULT NULL,
  allergies VARCHAR(255) DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,

  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_foreign_passport ON users_foreign (passport);
CREATE INDEX IF NOT EXISTS idx_users_foreign_email ON users_foreign (email);

-- ============================================================
-- Refresh tokens table (user_type distinguishes which table)
-- ============================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('thai', 'foreign')),
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens (token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_type ON refresh_tokens (user_type);

-- ============================================================
-- Auto-update updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_th_updated_at ON users_th;
CREATE TRIGGER trg_users_th_updated_at
  BEFORE UPDATE ON users_th
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_users_foreign_updated_at ON users_foreign;
CREATE TRIGGER trg_users_foreign_updated_at
  BEFORE UPDATE ON users_foreign
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
