-- ==============================================================================
-- PHASE 1: DATABASE INITIAL SCHEMA
-- Project: Rahmat Ichwan Bahtiar Website
-- Architecture: Personal Public Information & Accountability Platform
-- Principle: Flexible Content, Fixed System
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. SITE SETTINGS
-- Global structured configuration (general, contact, social, seo, legal)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_public BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);

-- ------------------------------------------------------------------------------
-- 2. HOMEPAGE SECTIONS
-- Section ordering, active status, and custom configuration
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.homepage_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    order_index INTEGER NOT NULL DEFAULT 0,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_homepage_sections_order ON public.homepage_sections(is_active, order_index ASC);

-- ------------------------------------------------------------------------------
-- 3. PROFILE
-- Primary biography, vision, mission, and education
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    title TEXT NOT NULL,
    photo_url TEXT,
    biography TEXT,
    education JSONB NOT NULL DEFAULT '[]'::jsonb,
    vision TEXT,
    mission TEXT,
    social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 4. TIMELINE
-- Milestones, political journey, and career chronology
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_start INTEGER NOT NULL,
    year_end INTEGER,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('PENDIDIKAN', 'KARIER', 'ORGANISASI', 'POLITIK', 'LAINNYA')),
    image_url TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_timeline_published ON public.timeline(is_published, year_start DESC, order_index ASC);

-- ------------------------------------------------------------------------------
-- 5. ORGANIZATIONS
-- Organizational history and roles
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_name TEXT NOT NULL,
    role TEXT NOT NULL,
    description TEXT,
    period_start TEXT NOT NULL,
    period_end TEXT,
    logo_url TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_organizations_published ON public.organizations(is_published, order_index ASC);

-- ------------------------------------------------------------------------------
-- 6. ACTIVITY CATEGORIES
-- Category taxonomy for Rekam Kerja / Activities
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_categories_slug ON public.activity_categories(slug);
CREATE INDEX IF NOT EXISTS idx_activity_categories_active ON public.activity_categories(is_active, order_index ASC);

-- ------------------------------------------------------------------------------
-- 7. ACTIVITIES (Rekam Kerja)
-- Unified system supporting: REKAM_KERJA, PROGRAM, KEGIATAN, RESES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('REKAM_KERJA', 'PROGRAM', 'KEGIATAN', 'RESES')),
    category_id UUID REFERENCES public.activity_categories(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    location TEXT,
    regency TEXT,
    district TEXT,
    summary TEXT,
    description TEXT NOT NULL,
    beneficiaries INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    featured BOOLEAN NOT NULL DEFAULT false,
    cover_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activities_slug ON public.activities(slug);
CREATE INDEX IF NOT EXISTS idx_activities_public ON public.activities(status, date DESC);
CREATE INDEX IF NOT EXISTS idx_activities_type ON public.activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_featured ON public.activities(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_activities_category ON public.activities(category_id);
CREATE INDEX IF NOT EXISTS idx_activities_location ON public.activities(regency, district);

-- ------------------------------------------------------------------------------
-- 8. ARTICLES (Kabar)
-- Unified article system supporting: BERITA and GAGASAN
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('BERITA', 'GAGASAN')),
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    category TEXT,
    author TEXT NOT NULL DEFAULT 'Rahmat Ichwan Bahtiar',
    published_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    featured BOOLEAN NOT NULL DEFAULT false,
    related_activity_id UUID REFERENCES public.activities(id) ON DELETE SET NULL,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_public ON public.articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_type ON public.articles(type);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON public.articles(featured) WHERE featured = true;

-- ------------------------------------------------------------------------------
-- 9. ALBUMS
-- Photo/Video Albums
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    order_index INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_albums_slug ON public.albums(slug);
CREATE INDEX IF NOT EXISTS idx_albums_public ON public.albums(status, order_index ASC);

-- ------------------------------------------------------------------------------
-- 10. MEDIA
-- Individual media assets associated with albums or standalone
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID REFERENCES public.albums(id) ON DELETE SET NULL,
    file_url TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('IMAGE', 'VIDEO', 'DOCUMENT')),
    title TEXT,
    alt_text TEXT,
    caption TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_album ON public.media(album_id);
CREATE INDEX IF NOT EXISTS idx_media_type ON public.media(media_type);

-- ------------------------------------------------------------------------------
-- 11. ASPIRATIONS (Public Interaction)
-- Internal note is strictly confidential. No public account required.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.aspirations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    regency TEXT,
    district TEXT,
    category TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    attachment_url TEXT,
    status TEXT NOT NULL DEFAULT 'BARU' CHECK (status IN ('BARU', 'DITINJAU', 'DALAM_TINDAK_LANJUT', 'SELESAI', 'INFORMASI_DIBERIKAN')),
    internal_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_aspirations_status ON public.aspirations(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_aspirations_category ON public.aspirations(category);

-- ------------------------------------------------------------------------------
-- 12. ADMIN USERS (Internal Administration)
-- Links to Supabase Auth auth.users table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'ADMIN' CHECK (role IN ('ADMIN')),
    full_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- ------------------------------------------------------------------------------
-- 13. AUDIT LOGS (Optional / Administrative Trail)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    target_id TEXT,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);
-- ==============================================================================
-- PHASE 1: ROW LEVEL SECURITY (RLS) POLICIES
-- Project: Rahmat Ichwan Bahtiar Website
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- HELPER FUNCTION: Check if the current authenticated user is an Admin
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
$$;

-- ------------------------------------------------------------------------------
-- ENABLE RLS ON ALL TABLES
-- ------------------------------------------------------------------------------
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aspirations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 1. SITE SETTINGS
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view public site settings"
ON public.site_settings FOR SELECT
TO anon, authenticated
USING (is_public = true);

CREATE POLICY "Admins have full access to site settings"
ON public.site_settings FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 2. HOMEPAGE SECTIONS
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view active homepage sections"
ON public.homepage_sections FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Admins have full access to homepage sections"
ON public.homepage_sections FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 3. PROFILE
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published profile"
ON public.profile FOR SELECT
TO anon, authenticated
USING (is_published = true);

CREATE POLICY "Admins have full access to profile"
ON public.profile FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 4. TIMELINE
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published timeline"
ON public.timeline FOR SELECT
TO anon, authenticated
USING (is_published = true);

CREATE POLICY "Admins have full access to timeline"
ON public.timeline FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. ORGANIZATIONS
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published organizations"
ON public.organizations FOR SELECT
TO anon, authenticated
USING (is_published = true);

CREATE POLICY "Admins have full access to organizations"
ON public.organizations FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 6. ACTIVITY CATEGORIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view active activity categories"
ON public.activity_categories FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Admins have full access to activity categories"
ON public.activity_categories FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 7. ACTIVITIES (Rekam Kerja)
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published activities"
ON public.activities FOR SELECT
TO anon, authenticated
USING (status = 'PUBLISHED');

CREATE POLICY "Admins have full access to activities"
ON public.activities FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 8. ARTICLES (Kabar: Berita & Gagasan)
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published articles"
ON public.articles FOR SELECT
TO anon, authenticated
USING (status = 'PUBLISHED');

CREATE POLICY "Admins have full access to articles"
ON public.articles FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 9. ALBUMS
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published albums"
ON public.albums FOR SELECT
TO anon, authenticated
USING (status = 'PUBLISHED');

CREATE POLICY "Admins have full access to albums"
ON public.albums FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 10. MEDIA
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view media of published albums or standalone"
ON public.media FOR SELECT
TO anon, authenticated
USING (
    album_id IS NULL 
    OR EXISTS (
        SELECT 1 FROM public.albums 
        WHERE albums.id = media.album_id AND albums.status = 'PUBLISHED'
    )
);

CREATE POLICY "Admins have full access to media"
ON public.media FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 11. ASPIRATIONS (Public Interaction & Internal Privacy)
-- Public can submit aspirations (INSERT only), but NEVER read or update.
-- internal_note and citizen contact are strictly protected.
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can submit aspirations"
ON public.aspirations FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins have full access to aspirations"
ON public.aspirations FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 12. ADMIN USERS
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins can view and manage admin users"
ON public.admin_users FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 13. AUDIT LOGS
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins can view and insert audit logs"
ON public.audit_logs FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
-- ------------------------------------------------------------------------------
-- Migration 00003: Add video_url to activities
-- Purpose: Support optional external video embeds (e.g. YouTube, Vimeo) for accountability documentation
-- ------------------------------------------------------------------------------

ALTER TABLE public.activities 
ADD COLUMN IF NOT EXISTS video_url TEXT;

COMMENT ON COLUMN public.activities.video_url IS 'Optional external video link (e.g. YouTube or Vimeo embed/watch URL)';
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
  ('general', '{"site_name": "RIB CENTER", "site_tagline": "Platform Informasi & Akuntabilitas Publik Rahmat Ichwan Bahtiar", "description": "Platform resmi transparansi rekam kerja, publikasi gagasan, dan saluran aspirasi masyarakat Rahmat Ichwan Bahtiar."}'::jsonb, true),
  ('contact', '{"email": "kontak@kawanrib.id", "whatsapp": "081155667788", "address": "Jl. Pahlawan No. 45, Kab. Polewali Mandar, Provinsi Sulawesi Barat 91311"}'::jsonb, true),
  ('social', '{"instagram": "https://instagram.com/rahmatichwanbahtiar", "facebook": "https://facebook.com/kawan.rahmatichwanbahtiar", "tiktok": "https://tiktok.com/@rahmatichwanbahtiar", "youtube": "https://youtube.com/@kawanrib"}'::jsonb, true),
  ('seo', '{"meta_title": "RIB CENTER", "meta_description": "Platform Informasi & Akuntabilitas Publik Rahmat Ichwan Bahtiar", "og_image": "/rahmat-hero.png"}'::jsonb, true)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

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

-- ==============================================================================
-- AUTOMATIC ADMIN PROVISIONING TRIGGER & STORAGE
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.admin_users (id, email, role, full_name)
  VALUES (new.id, new.email, 'ADMIN', COALESCE(new.raw_user_meta_data->>'full_name', 'Admin RIB'))
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();

-- Supabase Storage Bucket: media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public media access" ON storage.objects;
CREATE POLICY "Public media access" ON storage.objects FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Admins can upload media" ON storage.objects;
CREATE POLICY "Admins can upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update media" ON storage.objects;
CREATE POLICY "Admins can update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete media" ON storage.objects;
CREATE POLICY "Admins can delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_admin());

