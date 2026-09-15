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
