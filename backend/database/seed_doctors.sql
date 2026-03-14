-- ============================================================
-- Seed: Doctor accounts
-- Safe to re-run — skips existing emails.
-- Password for all: Doctor@1234  (bcrypt hash below)
-- ============================================================

DO $$
DECLARE
  -- bcrypt hash of "Doctor@1234"
  _pwd TEXT := '$2b$10$Zu3YQ2Fk3Kz5TrL1Q7gYMuEhVbGqXn8WwJpAoHcRe5SdNfIlPvzOu';
  _uid INT;
BEGIN

  -- ── Thai doctors ───────────────────────────────────────────

  -- 1
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'somchai.w@whocare.th') THEN
    INSERT INTO users (user_type, title_th, first_name_th, last_name_th, thai_id,
                       role, gender, phone, email, password_hash, is_active)
    VALUES ('thai', 'นพ.', 'สมชาย', 'วงศ์สุวรรณ', '1100200300401',
            'doctor', 'male', '081-111-0001', 'somchai.w@whocare.th', _pwd, TRUE);
  END IF;

  -- 2
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'nattaya.p@whocare.th') THEN
    INSERT INTO users (user_type, title_th, first_name_th, last_name_th, thai_id,
                       role, gender, phone, email, password_hash, is_active)
    VALUES ('thai', 'พญ.', 'ณัฐยา', 'ประสิทธิ์วงศ์', '1100200300402',
            'doctor', 'female', '081-111-0002', 'nattaya.p@whocare.th', _pwd, TRUE);
  END IF;

  -- 3
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'wichai.t@whocare.th') THEN
    INSERT INTO users (user_type, title_th, first_name_th, last_name_th, thai_id,
                       role, gender, phone, email, password_hash, is_active)
    VALUES ('thai', 'นพ.', 'วิชัย', 'ทองคำ', '1100200300403',
            'doctor', 'male', '081-111-0003', 'wichai.t@whocare.th', _pwd, TRUE);
  END IF;

  -- 4
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'supaporn.k@whocare.th') THEN
    INSERT INTO users (user_type, title_th, first_name_th, last_name_th, thai_id,
                       role, gender, phone, email, password_hash, is_active)
    VALUES ('thai', 'พญ.', 'สุภาพร', 'เกษมสุข', '1100200300404',
            'doctor', 'female', '081-111-0004', 'supaporn.k@whocare.th', _pwd, TRUE);
  END IF;

  -- 5
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'krit.c@whocare.th') THEN
    INSERT INTO users (user_type, title_th, first_name_th, last_name_th, thai_id,
                       role, gender, phone, email, password_hash, is_active)
    VALUES ('thai', 'นพ.', 'กฤต', 'จันทร์เพ็ญ', '1100200300405',
            'doctor', 'male', '081-111-0005', 'krit.c@whocare.th', _pwd, TRUE);
  END IF;

  -- 6
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'parichat.s@whocare.th') THEN
    INSERT INTO users (user_type, title_th, first_name_th, last_name_th, thai_id,
                       role, gender, phone, email, password_hash, is_active)
    VALUES ('thai', 'พญ.', 'ปาริชาต', 'สินธุ์วิริยะ', '1100200300406',
            'doctor', 'female', '081-111-0006', 'parichat.s@whocare.th', _pwd, TRUE);
  END IF;

  -- 7
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'thanawat.r@whocare.th') THEN
    INSERT INTO users (user_type, title_th, first_name_th, last_name_th, thai_id,
                       role, gender, phone, email, password_hash, is_active)
    VALUES ('thai', 'นพ.', 'ธนวัต', 'รักษาสุข', '1100200300407',
            'doctor', 'male', '081-111-0007', 'thanawat.r@whocare.th', _pwd, TRUE);
  END IF;

  -- 8
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'monthira.n@whocare.th') THEN
    INSERT INTO users (user_type, title_th, first_name_th, last_name_th, thai_id,
                       role, gender, phone, email, password_hash, is_active)
    VALUES ('thai', 'พญ.', 'มณฑิรา', 'นิลแก้ว', '1100200300408',
            'doctor', 'female', '081-111-0008', 'monthira.n@whocare.th', _pwd, TRUE);
  END IF;

  -- ── Foreign doctors ────────────────────────────────────────

  -- 9
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'james.smith@whocare.th') THEN
    INSERT INTO users (user_type, title_en, first_name_en, last_name_en, passport,
                       nationality, role, gender, phone, email, password_hash, is_active)
    VALUES ('foreign', 'Dr.', 'James', 'Smith', 'US12345001',
            'American', 'doctor', 'male', '081-222-0001', 'james.smith@whocare.th', _pwd, TRUE);
  END IF;

  -- 10
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'emily.chen@whocare.th') THEN
    INSERT INTO users (user_type, title_en, first_name_en, last_name_en, passport,
                       nationality, role, gender, phone, email, password_hash, is_active)
    VALUES ('foreign', 'Dr.', 'Emily', 'Chen', 'CN12345002',
            'Chinese', 'doctor', 'female', '081-222-0002', 'emily.chen@whocare.th', _pwd, TRUE);
  END IF;

  -- 11
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'michael.patel@whocare.th') THEN
    INSERT INTO users (user_type, title_en, first_name_en, last_name_en, passport,
                       nationality, role, gender, phone, email, password_hash, is_active)
    VALUES ('foreign', 'Dr.', 'Michael', 'Patel', 'IN12345003',
            'Indian', 'doctor', 'male', '081-222-0003', 'michael.patel@whocare.th', _pwd, TRUE);
  END IF;

  -- 12
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'sarah.yamamoto@whocare.th') THEN
    INSERT INTO users (user_type, title_en, first_name_en, last_name_en, passport,
                       nationality, role, gender, phone, email, password_hash, is_active)
    VALUES ('foreign', 'Dr.', 'Sarah', 'Yamamoto', 'JP12345004',
            'Japanese', 'doctor', 'female', '081-222-0004', 'sarah.yamamoto@whocare.th', _pwd, TRUE);
  END IF;

  -- 13
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'david.lee@whocare.th') THEN
    INSERT INTO users (user_type, title_en, first_name_en, last_name_en, passport,
                       nationality, role, gender, phone, email, password_hash, is_active)
    VALUES ('foreign', 'Dr.', 'David', 'Lee', 'KR12345005',
            'Korean', 'doctor', 'male', '081-222-0005', 'david.lee@whocare.th', _pwd, TRUE);
  END IF;

  RAISE NOTICE 'Doctor seed completed.';
END $$;
