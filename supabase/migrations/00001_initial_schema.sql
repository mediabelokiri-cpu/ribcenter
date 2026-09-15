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
