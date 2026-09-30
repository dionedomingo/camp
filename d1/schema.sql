-- Cloudflare D1 Database Schema for VLC 2027

-- Churches table: contains unique invite links per church
CREATE TABLE IF NOT EXISTS churches (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    province TEXT NOT NULL,
    city TEXT NOT NULL,
    pastor_name TEXT,
    contact_email TEXT,
    target_quota INTEGER DEFAULT 50,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Events table: Camp events (VLC 2027, etc.)
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    theme TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    venue_name TEXT NOT NULL,
    venue_address TEXT,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    country TEXT DEFAULT 'Philippines',
    target_capacity INTEGER DEFAULT 600,
    banner_url TEXT,
    primary_image_url TEXT,
    registration_start_date DATE, -- Registration opening date leading up to the event
    registration_end_date DATE,   -- Registration cutoff / deadline date leading up to the event
    status TEXT DEFAULT 'active', -- 'active', 'upcoming', 'completed', 'archived'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Event Schedules table: Itinerary and session schedule items
CREATE TABLE IF NOT EXISTS event_schedules (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    day_number INTEGER NOT NULL,
    day_title TEXT NOT NULL,
    date DATE NOT NULL,
    time_start TEXT NOT NULL,
    time_end TEXT NOT NULL,
    time_display TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    speaker TEXT,
    session_type TEXT DEFAULT 'general', -- 'rally', 'workshop', 'plenary', 'meal', 'fellowship', 'sports'
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Campers table: all registrations
CREATE TABLE IF NOT EXISTS campers (
    id TEXT PRIMARY KEY,
    event_id TEXT DEFAULT 'vlc-2027',
    church_id TEXT NOT NULL,
    role TEXT NOT NULL, -- 'camper', 'first_timer', 'counselor', 'staff', 'pastor', 'worship', 'medical'
    full_name TEXT NOT NULL,
    nickname TEXT NOT NULL,
    gender TEXT NOT NULL, -- 'male', 'female'
    age INTEGER NOT NULL,
    birthdate TEXT, -- YYYY-MM-DD
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    province TEXT NOT NULL,
    city TEXT,
    t_shirt_size TEXT,
    dietary_needs TEXT,
    emergency_name TEXT NOT NULL,
    emergency_phone TEXT NOT NULL,
    emergency_relation TEXT NOT NULL,
    ministry_interests TEXT, -- JSON array string: '["Praise & Worship", "Media & Tech"]'
    favorite_verse TEXT,
    verse_reflection TEXT,
    selfie_url TEXT, -- Base64 or R2 URL
    activation_code TEXT UNIQUE,
    activation_token TEXT UNIQUE,
    password_hash TEXT,
    reset_token TEXT,
    reset_token_expires_at DATETIME,
    status TEXT DEFAULT 'registered', -- 'registered', 'activated', 'cancelled'
    is_active INTEGER DEFAULT 1,
    last_login_at DATETIME,
    checked_in_at DATETIME,
    checked_in_by TEXT,
    kit_claimed INTEGER DEFAULT 0,
    print_count INTEGER DEFAULT 0,
    last_printed_at DATETIME,
    last_printed_by TEXT,
    reprint_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (church_id) REFERENCES churches(id)
);

-- Invite and referral tracking
CREATE TABLE IF NOT EXISTS invite_shares (
    id TEXT PRIMARY KEY,
    camper_id TEXT,
    church_id TEXT NOT NULL,
    platform TEXT NOT NULL, -- 'whatsapp', 'facebook', 'telegram', 'sms', 'copy_link'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (church_id) REFERENCES churches(id)
);

-- Outbound Email Deliveries & Strict Idempotency Table
CREATE TABLE IF NOT EXISTS email_deliveries (
    id TEXT PRIMARY KEY,
    camper_id TEXT NOT NULL,
    idempotency_key TEXT UNIQUE NOT NULL,
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('pending', 'sent', 'failed')),
    provider TEXT NOT NULL, -- 'resend', 'postmark', 'cf_email', 'simulation'
    provider_message_id TEXT,
    error_message TEXT,
    attempts INTEGER DEFAULT 1,
    email_preview TEXT,
    sent_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (camper_id) REFERENCES campers(id)
);

-- Event Registrations table: Maps campers to multiple events (reusable single account across camps)
CREATE TABLE IF NOT EXISTS event_registrations (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    camper_id TEXT NOT NULL,
    church_id TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'camper',
    dietary_needs TEXT,
    ministry_interests TEXT,
    activation_code TEXT UNIQUE,
    activation_token TEXT UNIQUE,
    status TEXT DEFAULT 'registered', -- 'registered', 'activated', 'cancelled'
    checked_in_at DATETIME,
    checked_in_by TEXT,
    kit_claimed INTEGER DEFAULT 0,
    print_count INTEGER DEFAULT 0,
    last_printed_at DATETIME,
    last_printed_by TEXT,
    reprint_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (camper_id) REFERENCES campers(id) ON DELETE CASCADE,
    FOREIGN KEY (church_id) REFERENCES churches(id),
    UNIQUE(event_id, camper_id)
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_churches_slug ON churches(slug);
CREATE INDEX IF NOT EXISTS idx_campers_church ON campers(church_id);
CREATE INDEX IF NOT EXISTS idx_campers_province ON campers(province);
CREATE INDEX IF NOT EXISTS idx_campers_role ON campers(role);
CREATE INDEX IF NOT EXISTS idx_campers_activation_code ON campers(activation_code);
CREATE INDEX IF NOT EXISTS idx_campers_activation_token ON campers(activation_token);
CREATE INDEX IF NOT EXISTS idx_campers_status ON campers(status);
CREATE INDEX IF NOT EXISTS idx_campers_event ON campers(event_id);
CREATE INDEX IF NOT EXISTS idx_campers_reset_token ON campers(reset_token);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_event_schedules_event ON event_schedules(event_id);
CREATE INDEX IF NOT EXISTS idx_event_schedules_day ON event_schedules(event_id, day_number, sort_order);
CREATE INDEX IF NOT EXISTS idx_event_reg_camper ON event_registrations(camper_id);
CREATE INDEX IF NOT EXISTS idx_event_reg_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reg_code ON event_registrations(activation_code);
CREATE INDEX IF NOT EXISTS idx_email_deliveries_camper ON email_deliveries(camper_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_deliveries_key ON email_deliveries(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_email_deliveries_status ON email_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_event_reg_print_count ON event_registrations(event_id, print_count);
CREATE INDEX IF NOT EXISTS idx_campers_print_count ON campers(print_count);

-- Media items table: Catalog of images and videos stored on Cloudflare R2
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

-- Posts table: Permanent camper feed posts
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    camper_id TEXT NOT NULL,
    media_url TEXT NOT NULL,
    caption TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (camper_id) REFERENCES campers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_posts_camper_id ON posts(camper_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_camper_created ON posts(camper_id, created_at DESC);

-- Stories table: Permanent vertical highlight media (no expiration, chronological order)
CREATE TABLE IF NOT EXISTS stories (
    id TEXT PRIMARY KEY,
    camper_id TEXT NOT NULL,
    media_url TEXT NOT NULL,
    caption TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (camper_id) REFERENCES campers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_stories_camper_id ON stories(camper_id);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at ASC);
CREATE INDEX IF NOT EXISTS idx_stories_camper_created ON stories(camper_id, created_at ASC);

-- Post Comments table: Discussion comments on posts
CREATE TABLE IF NOT EXISTS post_comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    camper_id TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (camper_id) REFERENCES campers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_camper_id ON post_comments(camper_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_created ON post_comments(post_id, created_at ASC);

-- Reactions table: Polymorphic reactions for posts, stories, comments
CREATE TABLE IF NOT EXISTS reactions (
    id TEXT PRIMARY KEY,
    camper_id TEXT NOT NULL,
    reactable_type TEXT NOT NULL CHECK(reactable_type IN ('post', 'story', 'comment')),
    reactable_id TEXT NOT NULL,
    reaction_type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (camper_id) REFERENCES campers(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_reactions_unique ON reactions(camper_id, reactable_type, reactable_id);
CREATE INDEX IF NOT EXISTS idx_reactions_lookup ON reactions(reactable_type, reactable_id);
CREATE INDEX IF NOT EXISTS idx_reactions_camper ON reactions(camper_id);
CREATE INDEX IF NOT EXISTS idx_reactions_aggregate ON reactions(reactable_type, reactable_id, reaction_type);


