-- ==============================================================================
-- PHASE 1: DEVELOPMENT SEED / TEST DATA
-- CAUTION: For local development and testing only.
-- All records are clearly designated with [DUMMY / TEST] labels.
-- No real achievements, political positions, or beneficiary counts are fabricated.
-- Safe to wipe using: TRUNCATE TABLE ... CASCADE;
-- ==============================================================================

-- 1. Site Settings Initial Seed
INSERT INTO public.site_settings (key, value, is_public)
VALUES
  ('general', '{"site_name": "Rahmat Ichwan Bahtiar", "site_tagline": "Platform Informasi & Akuntabilitas Publik", "description": "Platform resmi informasi rekam kerja dan akuntabilitas publik."}'::jsonb, true),
  ('contact', '{"email": "kontak.test@example.com", "whatsapp": "080000000000", "address": "Indonesia (Data Uji Coba)"}'::jsonb, true),
  ('social', '{"instagram": "https://instagram.com", "facebook": "https://facebook.com", "tiktok": "https://tiktok.com", "youtube": "https://youtube.com"}'::jsonb, true),
  ('seo', '{"meta_title": "Rahmat Ichwan Bahtiar", "meta_description": "Platform Informasi dan Akuntabilitas Publik", "og_image": ""}'::jsonb, true)
ON CONFLICT (key) DO NOTHING;

-- 2. Homepage Sections Initial Seed
INSERT INTO public.homepage_sections (section_key, title, is_active, order_index, content)
VALUES
  ('hero', '[DUMMY] Hero Banner', true, 1, '{"headline": "Selamat Datang di Platform Informasi Publik", "subheadline": "Transparansi, akuntabilitas, dan keterbukaan informasi."}'::jsonb),
  ('profile_summary', '[DUMMY] Sekilas Profil', true, 2, '{"summary": "Ringkasan profil publik dan komitmen pelayanan."}'::jsonb),
  ('featured_activities', '[DUMMY] Rekam Kerja Pilihan', true, 3, '{"display_count": 3}'::jsonb),
  ('latest_articles', '[DUMMY] Kabar & Gagasan Terbaru', true, 4, '{"display_count": 3}'::jsonb),
  ('gallery_preview', '[DUMMY] Dokumentasi Kegiatan', true, 5, '{"display_count": 6}'::jsonb),
  ('aspirations_cta', '[DUMMY] Saluran Aspirasi Warga', true, 6, '{"cta_text": "Sampaikan Aspirasi Anda"}'::jsonb)
ON CONFLICT (section_key) DO NOTHING;

-- 3. Profile Initial Seed (Generic Test Profile)
INSERT INTO public.profile (id, name, display_name, title, biography, education, vision, mission, is_published)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Rahmat Ichwan Bahtiar',
  'Rahmat Ichwan Bahtiar',
  '[DUMMY] Tokoh Publik / Pelayan Masyarakat',
  '[DUMMY] Deskripsi profil pengembangan sistem. Digunakan untuk keperluan validasi teknis tata letak dan pengujian data.',
  '[{"institution": "Universitas Contoh (Data Uji)", "degree": "Sarjana", "field": "Ilmu Sosial", "year": "2010"}]'::jsonb,
  '[DUMMY] Mewujudkan transparansi informasi publik dan akuntabilitas kerja.',
  '[DUMMY] Menyediakan akses informasi terbuka, mendengar aspirasi rakyat secara langsung, dan menyajikan rekam kerja terverifikasi.',
  true
)
ON CONFLICT (id) DO NOTHING;

-- 4. Activity Categories Seed
INSERT INTO public.activity_categories (id, name, slug, description, order_index, is_active)
VALUES
  ('10000000-0000-0000-0000-000000000001', '[DUMMY] Pelayanan Masyarakat', 'pelayanan-masyarakat-test', 'Kategori pengujian pelayanan masyarakat', 1, true),
  ('10000000-0000-0000-0000-000000000002', '[DUMMY] Pembangunan Wilayah', 'pembangunan-wilayah-test', 'Kategori pengujian pembangunan wilayah', 2, true)
ON CONFLICT (id) DO NOTHING;

-- 5. Activities Seed (Test Record for each type: REKAM_KERJA, PROGRAM, KEGIATAN, RESES)
INSERT INTO public.activities (id, title, slug, type, category_id, date, location, regency, district, summary, description, beneficiaries, status, featured)
VALUES
  ('20000000-0000-0000-0000-000000000001', '[DUMMY] Laporan Kegiatan Reses Wilayah Uji', 'laporan-reses-wilayah-uji', 'RESES', '10000000-0000-0000-0000-000000000001', '2026-01-15', 'Kecamatan Contoh', 'Kabupaten Contoh', 'Kecamatan Contoh', 'Ringkasan kegiatan reses dalam rangka pengujian teknis database.', 'Deskripsi lengkap pelaksanaan kegiatan reses uji coba.', 0, 'PUBLISHED', true),
  ('20000000-0000-0000-0000-000000000002', '[DUMMY] Program Bantuan Sosial Uji Coba', 'program-bansos-uji-coba', 'PROGRAM', '10000000-0000-0000-0000-000000000001', '2026-02-10', 'Desa Contoh', 'Kabupaten Contoh', 'Kecamatan Contoh', 'Ringkasan program uji coba sistem.', 'Deskripsi program uji coba sistem untuk validasi filter tipe PROGRAM.', 0, 'PUBLISHED', false),
  ('20000000-0000-0000-0000-000000000003', '[DUMMY] DRAFT Rekam Kerja Internal (Tidak Publik)', 'draft-rekam-kerja-internal', 'REKAM_KERJA', '10000000-0000-0000-0000-000000000002', '2026-03-01', 'Kantor', 'Kabupaten Contoh', 'Kecamatan Contoh', 'Data berstatus DRAFT untuk menguji RLS dan pemisahan data privat.', 'Konten ini tidak boleh tampil di endpoint publik.', 0, 'DRAFT', false)
ON CONFLICT (id) DO NOTHING;

-- 6. Articles Seed (Unified: BERITA & GAGASAN)
INSERT INTO public.articles (id, title, slug, type, excerpt, content, status, featured, published_at)
VALUES
  ('30000000-0000-0000-0000-000000000001', '[DUMMY] Berita Peluncuran Platform Akuntabilitas', 'peluncuran-platform-akuntabilitas-test', 'BERITA', 'Platform resmi Rahmat Ichwan Bahtiar disiapkan untuk keterbukaan informasi.', 'Isi lengkap berita uji coba mengenai peluncuran platform informasi publik.', 'PUBLISHED', true, now()),
  ('30000000-0000-0000-0000-000000000002', '[DUMMY] Gagasan: Pentingnya Transparansi Pelayanan Publik', 'pentingnya-transparansi-pelayanan-publik-test', 'GAGASAN', 'Opini dan catatan pemikiran mengenai integritas dalam melayani warga.', 'Isi lengkap artikel gagasan uji coba untuk validasi filter GAGASAN.', 'PUBLISHED', false, now()),
  ('30000000-0000-0000-0000-000000000003', '[DUMMY] DRAFT Artikel Belum Tayang', 'draft-artikel-belum-tayang-test', 'BERITA', 'Artikel berstatus draft untuk pengujian keamanan.', 'Konten privat berstatus draft yang dilarang bocor ke publik.', 'DRAFT', false, NULL)
ON CONFLICT (id) DO NOTHING;

-- 7. Albums & Media Seed
INSERT INTO public.albums (id, title, slug, description, status, featured, order_index)
VALUES
  ('40000000-0000-0000-0000-000000000001', '[DUMMY] Dokumentasi Kegiatan Uji Coba 2026', 'dokumentasi-uji-coba-2026', 'Album dokumentasi foto dan video untuk pengujian sistem.', 'PUBLISHED', true, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media (id, album_id, file_url, media_type, title, alt_text, caption)
VALUES
  ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'https://placehold.co/800x600/png?text=Test+Image+1', 'IMAGE', '[DUMMY] Foto Dokumentasi 1', 'Foto dokumentasi uji', 'Dokumentasi kegiatan uji coba.')
ON CONFLICT (id) DO NOTHING;

-- 8. Aspirations Seed (Test Public Aspirations)
INSERT INTO public.aspirations (id, name, contact, regency, district, category, subject, message, status, internal_note)
VALUES
  ('60000000-0000-0000-0000-000000000001', '[DUMMY] Warga Penguji 1', '081234567890', 'Kabupaten Contoh', 'Kecamatan Contoh', 'Infrastruktur', '[DUMMY] Usulan Perbaikan Lampu Jalan', 'Mohon perhatian terkait penerangan jalan di desa uji coba.', 'BARU', '[INTERNAL NOTE RAHASIA] Catatan tindak lanjut tim internal, tidak boleh terlihat oleh publik.'),
  ('60000000-0000-0000-0000-000000000002', '[DUMMY] Warga Penguji 2', '089876543210', 'Kabupaten Contoh', 'Kecamatan Contoh', 'Pendidikan', '[DUMMY] Usulan Sarana Baca', 'Usulan penambahan buku bacaan perpustakaan desa.', 'DITINJAU', '[INTERNAL NOTE RAHASIA] Telah diagendakan koordinasi dinas terkait.')
ON CONFLICT (id) DO NOTHING;
