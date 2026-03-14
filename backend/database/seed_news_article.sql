-- ============================================================
-- Seed: Sample news_articles (articles + news) with tags
-- Run in psql:  psql -d yourdb -f backend/database/seed_news_article.sql
-- Or paste into Supabase SQL editor and click Run.
-- ============================================================

DO $$
DECLARE
  v_author_id  INT;
  v_cat_health      INT;
  v_cat_disease     INT;
  v_cat_surgery     INT;
  v_cat_skin        INT;
  v_cat_event       INT;
  v_cat_promo       INT;

  v_article_id INT;

  v_tag_health     INT;
  v_tag_self_care  INT;
  v_tag_cancer     INT;
  v_tag_skin       INT;
  v_tag_heart      INT;
  v_tag_eye        INT;
  v_tag_promo      INT;
  v_tag_event      INT;
  v_tag_news       INT;
BEGIN

  -- ── find first available user (author) ──────────────────────
  SELECT id INTO v_author_id FROM users ORDER BY id LIMIT 1;
  IF v_author_id IS NULL THEN
    RAISE EXCEPTION 'No users found. Please create at least one user first.';
  END IF;

  -- ── category ids ────────────────────────────────────────────
  SELECT id INTO v_cat_health   FROM news_categories WHERE slug = 'health'           LIMIT 1;
  SELECT id INTO v_cat_disease  FROM news_categories WHERE slug = 'disease-treatment' LIMIT 1;
  SELECT id INTO v_cat_surgery  FROM news_categories WHERE slug = 'surgery'           LIMIT 1;
  SELECT id INTO v_cat_skin     FROM news_categories WHERE slug = 'dermatology'       LIMIT 1;
  SELECT id INTO v_cat_event    FROM news_categories WHERE slug = 'events'            LIMIT 1;
  SELECT id INTO v_cat_promo    FROM news_categories WHERE slug = 'promotions'        LIMIT 1;

  -- ── upsert tags ─────────────────────────────────────────────
  INSERT INTO news_tags (name, slug) VALUES ('สุขภาพ', 'sukkhaphap')
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_tag_health;
  IF v_tag_health IS NULL THEN SELECT id INTO v_tag_health FROM news_tags WHERE slug = 'sukkhaphap'; END IF;

  INSERT INTO news_tags (name, slug) VALUES ('ดูแลตัวเอง', 'duu-lae-tua-eng')
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_tag_self_care;
  IF v_tag_self_care IS NULL THEN SELECT id INTO v_tag_self_care FROM news_tags WHERE slug = 'duu-lae-tua-eng'; END IF;

  INSERT INTO news_tags (name, slug) VALUES ('มะเร็ง', 'mah-reng')
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_tag_cancer;
  IF v_tag_cancer IS NULL THEN SELECT id INTO v_tag_cancer FROM news_tags WHERE slug = 'mah-reng'; END IF;

  INSERT INTO news_tags (name, slug) VALUES ('ผิวพรรณ', 'phiu-phan')
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_tag_skin;
  IF v_tag_skin IS NULL THEN SELECT id INTO v_tag_skin FROM news_tags WHERE slug = 'phiu-phan'; END IF;

  INSERT INTO news_tags (name, slug) VALUES ('หัวใจ', 'hua-jai')
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_tag_heart;
  IF v_tag_heart IS NULL THEN SELECT id INTO v_tag_heart FROM news_tags WHERE slug = 'hua-jai'; END IF;

  INSERT INTO news_tags (name, slug) VALUES ('ตา', 'ta')
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_tag_eye;
  IF v_tag_eye IS NULL THEN SELECT id INTO v_tag_eye FROM news_tags WHERE slug = 'ta'; END IF;

  INSERT INTO news_tags (name, slug) VALUES ('โปรโมชั่น', 'promotion')
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_tag_promo;
  IF v_tag_promo IS NULL THEN SELECT id INTO v_tag_promo FROM news_tags WHERE slug = 'promotion'; END IF;

  INSERT INTO news_tags (name, slug) VALUES ('กิจกรรม', 'activity')
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_tag_event;
  IF v_tag_event IS NULL THEN SELECT id INTO v_tag_event FROM news_tags WHERE slug = 'activity'; END IF;

  INSERT INTO news_tags (name, slug) VALUES ('ข่าว', 'news')
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_tag_news;
  IF v_tag_news IS NULL THEN SELECT id INTO v_tag_news FROM news_tags WHERE slug = 'news'; END IF;

  -- ════════════════════════════════════════════════════════════
  -- ARTICLES (content_type = 'article')
  -- ════════════════════════════════════════════════════════════

  -- 1. Featured health article
  IF NOT EXISTS (SELECT 1 FROM news_articles WHERE slug = 'tips-daily-health-care-2026') THEN
    INSERT INTO news_articles
      (title, slug, excerpt, content, cover_image, category_id, author_id,
       content_type, is_featured, is_pinned, status, published_at, seo_title, seo_description)
    VALUES (
      '10 วิธีดูแลสุขภาพประจำวันที่ทุกคนควรรู้',
      'tips-daily-health-care-2026',
      'สุขภาพดีเริ่มต้นจากนิสัยเล็กๆ ที่ทำซ้ำทุกวัน มาดูกันว่ามีอะไรบ้างที่คุณทำได้ตั้งแต่วันนี้',
      '<h2>1. ดื่มน้ำให้เพียงพอ</h2><p>ร่างกายต้องการน้ำอย่างน้อย 8 แก้วต่อวัน...</p><h2>2. นอนหลับให้ครบ 7-8 ชั่วโมง</h2><p>การนอนเป็นการซ่อมแซมร่างกายที่ดีที่สุด...</p><h2>3. ออกกำลังกายสม่ำเสมอ</h2><p>ไม่ต้องหนักมาก แค่เดิน 30 นาทีต่อวันก็ช่วยได้มาก...</p>',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80',
      v_cat_health, v_author_id,
      'article', TRUE, FALSE, 'published', NOW(),
      '10 วิธีดูแลสุขภาพประจำวัน', 'รวม 10 วิธีดูแลสุขภาพประจำวันที่ทุกคนทำได้'
    ) RETURNING id INTO v_article_id;
    INSERT INTO news_tags_map (article_id, tag_id) VALUES (v_article_id, v_tag_health), (v_article_id, v_tag_self_care) ON CONFLICT DO NOTHING;
  END IF;

  -- 2. Disease & Treatment article
  IF NOT EXISTS (SELECT 1 FROM news_articles WHERE slug = 'cancer-early-signs-2026') THEN
    INSERT INTO news_articles
      (title, slug, excerpt, content, cover_image, category_id, author_id,
       content_type, is_featured, is_pinned, status, published_at, seo_title, seo_description)
    VALUES (
      'สัญญาณเตือน 5 อย่างของโรคมะเร็งที่ไม่ควรมองข้าม',
      'cancer-early-signs-2026',
      'ค้นพบโรคมะเร็งตั้งแต่ระยะแรกเพิ่มโอกาสรักษาได้สูงถึง 90% รู้จักสัญญาณเตือนเหล่านี้ไว้ก่อน',
      '<p>โรคมะเร็งหากพบเร็วสามารถรักษาได้อย่างมีประสิทธิภาพ สัญญาณที่ควรระวัง ได้แก่...</p><ul><li>น้ำหนักลดผิดปกติโดยไม่มีสาเหตุ</li><li>เหนื่อยล้าเรื้อรัง</li><li>มีก้อนเนื้อที่ผิดปกติ</li><li>ไอหรือเสียงแหบเรื้อรัง</li><li>เลือดออกผิดปกติ</li></ul>',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
      v_cat_disease, v_author_id,
      'article', TRUE, FALSE, 'published', NOW() - INTERVAL '1 day',
      'สัญญาณเตือนโรคมะเร็ง', '5 สัญญาณเตือนโรคมะเร็งที่ไม่ควรมองข้าม'
    ) RETURNING id INTO v_article_id;
    INSERT INTO news_tags_map (article_id, tag_id) VALUES (v_article_id, v_tag_cancer), (v_article_id, v_tag_health) ON CONFLICT DO NOTHING;
  END IF;

  -- 3. Skin care article
  IF NOT EXISTS (SELECT 1 FROM news_articles WHERE slug = 'skin-care-summer-2026') THEN
    INSERT INTO news_articles
      (title, slug, excerpt, content, cover_image, category_id, author_id,
       content_type, is_featured, is_pinned, status, published_at, seo_title, seo_description)
    VALUES (
      'ดูแลผิวอย่างไรให้สุขภาพดีในหน้าร้อน',
      'skin-care-summer-2026',
      'หน้าร้อนเป็นศัตรูตัวฉกาจของผิว มาเรียนรู้วิธีดูแลผิวให้ชุ่มชื้นและสดใสตลอดวัน',
      '<p>ในช่วงหน้าร้อน ผิวสัมผัสกับรังสี UV และความร้อนจัดส่งผลให้...</p><h3>สิ่งที่ต้องทำทุกวัน</h3><p>1. ทาครีมกันแดด SPF 50+ ก่อนออกจากบ้าน<br>2. ดื่มน้ำให้เพียงพอ<br>3. หลีกเลี่ยงแสงแดดจัดช่วง 10.00-14.00 น.</p>',
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=80',
      v_cat_skin, v_author_id,
      'article', FALSE, FALSE, 'published', NOW() - INTERVAL '2 days',
      'ดูแลผิวหน้าร้อน', 'วิธีดูแลผิวให้สุขภาพดีในหน้าร้อน'
    ) RETURNING id INTO v_article_id;
    INSERT INTO news_tags_map (article_id, tag_id) VALUES (v_article_id, v_tag_skin), (v_article_id, v_tag_self_care) ON CONFLICT DO NOTHING;
  END IF;

  -- 4. Heart health article
  IF NOT EXISTS (SELECT 1 FROM news_articles WHERE slug = 'heart-health-guide-2026') THEN
    INSERT INTO news_articles
      (title, slug, excerpt, content, cover_image, category_id, author_id,
       content_type, is_featured, is_pinned, status, published_at, seo_title, seo_description)
    VALUES (
      'คู่มือดูแลหัวใจ: สิ่งที่ควรรู้เพื่อหัวใจแข็งแรง',
      'heart-health-guide-2026',
      'โรคหัวใจเป็นสาเหตุการเสียชีวิตอันดับหนึ่งของโลก เริ่มดูแลหัวใจตั้งแต่วันนี้ก่อนสายเกินแก้',
      '<p>หัวใจเป็นอวัยวะสำคัญที่ทำงานตลอด 24 ชั่วโมง การดูแลใส่ใจหัวใจจึงเป็นเรื่องที่ไม่ควรมองข้าม</p><h3>วิธีดูแลหัวใจ</h3><ul><li>ลดการบริโภคไขมันอิ่มตัว</li><li>ออกกำลังกายสม่ำเสมอ</li><li>หยุดสูบบุหรี่</li><li>ตรวจสุขภาพประจำปี</li></ul>',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80',
      v_cat_disease, v_author_id,
      'article', FALSE, TRUE, 'published', NOW() - INTERVAL '3 days',
      'คู่มือดูแลหัวใจ', 'วิธีดูแลหัวใจให้แข็งแรงและห่างไกลโรค'
    ) RETURNING id INTO v_article_id;
    INSERT INTO news_tags_map (article_id, tag_id) VALUES (v_article_id, v_tag_heart), (v_article_id, v_tag_health) ON CONFLICT DO NOTHING;
  END IF;

  -- 5. Surgery article
  IF NOT EXISTS (SELECT 1 FROM news_articles WHERE slug = 'lasik-eye-surgery-guide-2026') THEN
    INSERT INTO news_articles
      (title, slug, excerpt, content, cover_image, category_id, author_id,
       content_type, is_featured, is_pinned, status, published_at, seo_title, seo_description)
    VALUES (
      'LASIK ผ่าตาดีไหม? ทุกคำตอบที่คุณต้องรู้ก่อนตัดสินใจ',
      'lasik-eye-surgery-guide-2026',
      'การผ่าตาด้วยเลเซอร์ LASIK เป็นทางเลือกยอดนิยมสำหรับผู้ที่ต้องการลดการพึ่งพาแว่นตา',
      '<p>LASIK (Laser-Assisted In Situ Keratomileusis) เป็นการผ่าตัดด้วยเลเซอร์เพื่อแก้ไขสายตา...</p><h3>ใครเหมาะกับ LASIK</h3><ul><li>อายุ 20 ปีขึ้นไป</li><li>สายตาคงที่อย่างน้อย 1 ปี</li><li>กระจกตาหนาพอ</li><li>ไม่มีโรคตาเรื้อรัง</li></ul>',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1200&q=80',
      v_cat_surgery, v_author_id,
      'article', FALSE, FALSE, 'published', NOW() - INTERVAL '4 days',
      'LASIK ผ่าตาดีไหม', 'ข้อมูลครบถ้วนเกี่ยวกับการผ่าตา LASIK'
    ) RETURNING id INTO v_article_id;
    INSERT INTO news_tags_map (article_id, tag_id) VALUES (v_article_id, v_tag_eye), (v_article_id, v_tag_health) ON CONFLICT DO NOTHING;
  END IF;

  -- ════════════════════════════════════════════════════════════
  -- NEWS (content_type = 'news')
  -- ════════════════════════════════════════════════════════════

  -- 6. Featured news
  IF NOT EXISTS (SELECT 1 FROM news_articles WHERE slug = 'whocare-open-new-wing-2026') THEN
    INSERT INTO news_articles
      (title, slug, excerpt, content, cover_image, category_id, author_id,
       content_type, is_featured, is_pinned, status, published_at, seo_title, seo_description)
    VALUES (
      'Whocare Hospital เปิดตึกผู้ป่วยใหม่ รองรับผู้ป่วยเพิ่มอีก 200 เตียง',
      'whocare-open-new-wing-2026',
      'โรงพยาบาล Whocare ขยายพื้นที่บริการ เปิดตึกผู้ป่วยใหม่ 10 ชั้น พร้อมเทคโนโลยีทางการแพทย์ล้ำสมัย',
      '<p>เมื่อวันที่ 1 มีนาคม 2026 โรงพยาบาล Whocare ได้ทำพิธีเปิดตึกผู้ป่วยใหม่อย่างเป็นทางการ...</p><p>ตึกใหม่นี้มีความจุ 200 เตียง พร้อมห้องปฏิบัติการทันสมัย ห้อง ICU ขยายเพิ่ม และระบบ Smart Hospital ครบครัน</p>',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80',
      v_cat_event, v_author_id,
      'news', TRUE, TRUE, 'published', NOW(),
      'Whocare เปิดตึกใหม่', 'Whocare Hospital เปิดตึกผู้ป่วยใหม่ รองรับ 200 เตียง'
    ) RETURNING id INTO v_article_id;
    INSERT INTO news_tags_map (article_id, tag_id) VALUES (v_article_id, v_tag_news), (v_article_id, v_tag_event) ON CONFLICT DO NOTHING;
  END IF;

  -- 7. Promotion news
  IF NOT EXISTS (SELECT 1 FROM news_articles WHERE slug = 'health-checkup-promo-march-2026') THEN
    INSERT INTO news_articles
      (title, slug, excerpt, content, cover_image, category_id, author_id,
       content_type, is_featured, is_pinned, status, published_at, seo_title, seo_description)
    VALUES (
      'โปรโมชั่นตรวจสุขภาพประจำปี มีนาคม 2026 ลด 30%',
      'health-checkup-promo-march-2026',
      'ตรวจสุขภาพประจำปีแพ็กเกจพรีเมียม ลดราคาพิเศษ 30% ตลอดเดือนมีนาคม 2026 บอกต่อได้เลย',
      '<p>โรงพยาบาล Whocare จัดโปรโมชั่นพิเศษ ตรวจสุขภาพแพ็กเกจมาตรฐานและพรีเมียม ลด 30% สำหรับผู้ที่จองภายในเดือนมีนาคม 2026</p><h3>แพ็กเกจที่ร่วมรายการ</h3><ul><li>Basic Health Check - ราคาพิเศษ 1,400 บาท (ปกติ 2,000 บาท)</li><li>Premium Health Check - ราคาพิเศษ 3,500 บาท (ปกติ 5,000 บาท)</li></ul>',
      'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1200&q=80',
      v_cat_promo, v_author_id,
      'news', TRUE, FALSE, 'published', NOW() - INTERVAL '1 day',
      'โปรโมชั่นตรวจสุขภาพ มีนาคม 2026', 'ตรวจสุขภาพแพ็กเกจพรีเมียม ลด 30% มีนาคม 2026'
    ) RETURNING id INTO v_article_id;
    INSERT INTO news_tags_map (article_id, tag_id) VALUES (v_article_id, v_tag_promo), (v_article_id, v_tag_health) ON CONFLICT DO NOTHING;
  END IF;

  -- 8. Event news
  IF NOT EXISTS (SELECT 1 FROM news_articles WHERE slug = 'free-health-camp-april-2026') THEN
    INSERT INTO news_articles
      (title, slug, excerpt, content, cover_image, category_id, author_id,
       content_type, is_featured, is_pinned, status, published_at, seo_title, seo_description)
    VALUES (
      'กิจกรรม Health Camp ฟรี! ตรวจสุขภาพเบื้องต้นไม่มีค่าใช้จ่าย',
      'free-health-camp-april-2026',
      'ขอเชิญชวนทุกท่านร่วมกิจกรรม Health Camp ตรวจสุขภาพเบื้องต้นฟรี วันที่ 5 เมษายน 2026',
      '<p>โรงพยาบาล Whocare ร่วมกับหน่วยงานสาธารณสุข จัดกิจกรรม Health Camp ให้บริการตรวจสุขภาพเบื้องต้น ฟรี ไม่มีค่าใช้จ่าย</p><h3>บริการที่ให้ในงาน</h3><ul><li>วัดความดันโลหิต</li><li>ตรวจระดับน้ำตาลในเลือด</li><li>ปรึกษาแพทย์เฉพาะทาง</li><li>รับวิตามินฟรี</li></ul><p>สถานที่: ลานจอดรถชั้น 1 โรงพยาบาล Whocare<br>วันเวลา: 5 เมษายน 2569 เวลา 08.00-16.00 น.</p>',
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80',
      v_cat_event, v_author_id,
      'news', FALSE, FALSE, 'published', NOW() - INTERVAL '2 days',
      'Health Camp ฟรี เมษายน 2026', 'กิจกรรมตรวจสุขภาพเบื้องต้นฟรี 5 เมษายน 2026'
    ) RETURNING id INTO v_article_id;
    INSERT INTO news_tags_map (article_id, tag_id) VALUES (v_article_id, v_tag_event), (v_article_id, v_tag_news) ON CONFLICT DO NOTHING;
  END IF;

  RAISE NOTICE 'Seed completed successfully.';
END $$;

-- ── Verify ──────────────────────────────────────────────────
SELECT
  a.id, a.title, a.slug, a.content_type, a.status,
  a.is_featured, a.is_pinned, a.published_at,
  c.name_th AS category
FROM news_articles a
LEFT JOIN news_categories c ON c.id = a.category_id
ORDER BY a.id DESC;
