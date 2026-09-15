-- ------------------------------------------------------------------------------
-- Migration 00003: Add video_url to activities
-- Purpose: Support optional external video embeds (e.g. YouTube, Vimeo) for accountability documentation
-- ------------------------------------------------------------------------------

ALTER TABLE public.activities 
ADD COLUMN IF NOT EXISTS video_url TEXT;

COMMENT ON COLUMN public.activities.video_url IS 'Optional external video link (e.g. YouTube or Vimeo embed/watch URL)';
