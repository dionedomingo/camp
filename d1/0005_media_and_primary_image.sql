-- Migration 0005: Cloudflare R2 Media Catalog & Event Primary Image
-- Storing images and videos in R2 with D1 cataloging

-- 1. Add primary_image_url column to events
ALTER TABLE events ADD COLUMN primary_image_url TEXT;

-- 2. Create media_items table for cataloging images and videos stored on Cloudflare R2
CREATE TABLE IF NOT EXISTS media_items (
    id TEXT PRIMARY KEY,
    r2_key TEXT UNIQUE NOT NULL,
    url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK(media_type IN ('image', 'video')),
    file_size INTEGER NOT NULL,
    event_id TEXT DEFAULT 'vlc-2027',
    title TEXT,
    description TEXT,
    is_primary INTEGER DEFAULT 0,
    uploaded_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_media_items_event ON media_items(event_id);
CREATE INDEX IF NOT EXISTS idx_media_items_type ON media_items(media_type);
CREATE INDEX IF NOT EXISTS idx_media_items_created ON media_items(created_at DESC);
