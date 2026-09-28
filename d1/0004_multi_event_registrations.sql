-- Migration 0004: Multi-Event Registrations & Reusable Camper Accounts
-- Enables campers to keep a single persistent account across multiple camp events (VLC 2027, VLC 2029, etc.)

-- 1. Create Event Registrations Table
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (camper_id) REFERENCES campers(id) ON DELETE CASCADE,
    FOREIGN KEY (church_id) REFERENCES churches(id),
    UNIQUE(event_id, camper_id)
);

CREATE INDEX IF NOT EXISTS idx_event_reg_camper ON event_registrations(camper_id);
CREATE INDEX IF NOT EXISTS idx_event_reg_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reg_code ON event_registrations(activation_code);

-- 2. Seed Next Camp Event: Vision & Leadership Camp 2029 (VLC 2029)
INSERT OR REPLACE INTO events (
    id, slug, name, theme, tagline, description,
    start_date, end_date, venue_name, venue_address,
    city, province, country, target_capacity, status
) VALUES (
    'vlc-2029',
    'vlc-2029',
    'Vision & Leadership Camp 2029',
    'Greater Glory (Haggai 2:9)',
    'Biennial National Youth & Workers Leadership Gathering',
    'The next milestone national gathering of youth delegates, church workers, worship ministers, and pastors across Pentecostal Churches of Christ, Inc. (PCCI).',
    '2029-07-25',
    '2029-07-28',
    'PCCI National Headquarters (Buag Campus)',
    'National Highway, Barangay Buag',
    'Bambang',
    'Nueva Vizcaya',
    'Philippines',
    750,
    'upcoming'
);

-- 3. Backfill existing registrations from campers into event_registrations
INSERT OR IGNORE INTO event_registrations (
    id, event_id, camper_id, church_id, role, dietary_needs,
    ministry_interests, activation_code, activation_token,
    status, checked_in_at, checked_in_by, kit_claimed, created_at
)
SELECT 
    'reg_' || hex(randomblob(4)) || '_' || substr(id, 5),
    COALESCE(event_id, 'vlc-2027'),
    id,
    church_id,
    role,
    dietary_needs,
    ministry_interests,
    activation_code,
    activation_token,
    COALESCE(status, 'registered'),
    checked_in_at,
    checked_in_by,
    COALESCE(kit_claimed, 0),
    created_at
FROM campers;
