-- Migration: Event Entity, Event Schedules, and Password Reset Tokens

-- 1. Events Table
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
    status TEXT DEFAULT 'active', -- 'active', 'upcoming', 'completed', 'archived'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- 2. Event Schedules Table
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

CREATE INDEX IF NOT EXISTS idx_event_schedules_event ON event_schedules(event_id);
CREATE INDEX IF NOT EXISTS idx_event_schedules_day ON event_schedules(event_id, day_number, sort_order);

-- 3. Add Event Link & Password Reset Columns to Campers
ALTER TABLE campers ADD COLUMN event_id TEXT DEFAULT 'vlc-2027';
ALTER TABLE campers ADD COLUMN reset_token TEXT;
ALTER TABLE campers ADD COLUMN reset_token_expires_at DATETIME;

CREATE INDEX IF NOT EXISTS idx_campers_event ON campers(event_id);
CREATE INDEX IF NOT EXISTS idx_campers_reset_token ON campers(reset_token);

-- 4. Seed Primary Event: Vision & Leadership Camp 2027 (VLC 2027)
INSERT OR REPLACE INTO events (
    id, slug, name, theme, tagline, description,
    start_date, end_date, venue_name, venue_address,
    city, province, country, target_capacity, status
) VALUES (
    'vlc-2027',
    'vlc-2027',
    'Vision & Leadership Camp 2027',
    'Arise & Shine (Isaiah 60:1)',
    'National Youth & Workers Leadership Gathering',
    'Annual national gathering of youth delegates, church workers, worship ministers, and pastors across Pentecostal Churches of Christ, Inc. (PCCI) for spiritual renewal and kingdom empowerment.',
    '2027-07-21',
    '2027-07-24',
    'PCCI National Headquarters (Buag Campus)',
    'National Highway, Barangay Buag',
    'Bambang',
    'Nueva Vizcaya',
    'Philippines',
    600,
    'active'
);

-- 5. Seed Full 4-Day Event Schedule for VLC 2027
-- Day 1
INSERT OR REPLACE INTO event_schedules (id, event_id, day_number, day_title, date, time_start, time_end, time_display, title, description, location, speaker, session_type, sort_order) VALUES
('sch_d1_01', 'vlc-2027', 1, 'Day 1 • Arrival & Opening Rally', '2027-07-21', '12:00', '16:00', '12:00 PM – 4:00 PM', 'Arrival Desk & Badge Verification', 'Gate arrival, barcode scanning, official kit & lanyard distribution, and dorm check-in.', 'Main Secretariat Gate', 'Arrival Desk Team', 'general', 1),
('sch_d1_02', 'vlc-2027', 1, 'Day 1 • Arrival & Opening Rally', '2027-07-21', '16:00', '17:30', '4:00 PM – 5:30 PM', 'Delegation Orientation & Cabin Fellowship', 'Meet your cabin leader, review camp house rules, and settle into dorm assignments.', 'Dormitory Pavilions', 'Camp Counselors', 'fellowship', 2),
('sch_d1_03', 'vlc-2027', 1, 'Day 1 • Arrival & Opening Rally', '2027-07-21', '17:30', '18:45', '5:30 PM – 6:45 PM', 'Welcome Fellowship Dinner', 'Community meal with all participating PCCI church delegations.', 'Dining Hall', 'Kitchen Committee', 'meal', 3),
('sch_d1_04', 'vlc-2027', 1, 'Day 1 • Arrival & Opening Rally', '2027-07-21', '19:00', '21:30', '7:00 PM – 9:30 PM', 'Opening Night Rally: "Arise & Shine"', 'Keynote assembly on Isaiah 60:1, high-energy worship, and banner presentation.', 'Main Sanctuary & Auditorium', 'Bishop & Keynote Speakers', 'rally', 4);

-- Day 2
INSERT OR REPLACE INTO event_schedules (id, event_id, day_number, day_title, date, time_start, time_end, time_display, title, description, location, speaker, session_type, sort_order) VALUES
('sch_d2_01', 'vlc-2027', 2, 'Day 2 • Leadership Tracks & Holy Fire', '2027-07-22', '06:30', '07:30', '6:30 AM – 7:30 AM', 'Morning Devotion & Prayer Walk', 'Quiet time with scripture and sunrise intercession for the nation.', 'Camp Prayer Grounds', 'Pastoral Elders', 'fellowship', 1),
('sch_d2_02', 'vlc-2027', 2, 'Day 2 • Leadership Tracks & Holy Fire', '2027-07-22', '07:30', '08:30', '7:30 AM – 8:30 AM', 'Camp Breakfast', 'Nutritious breakfast to fuel the day of training and rallies.', 'Dining Hall', 'Kitchen Committee', 'meal', 2),
('sch_d2_03', 'vlc-2027', 2, 'Day 2 • Leadership Tracks & Holy Fire', '2027-07-22', '09:00', '11:30', '9:00 AM – 11:30 AM', 'Plenary 1: Kingdom Leadership in a Changing World', 'Building resilient Christian character, integrity, and biblical leadership acumen.', 'Main Sanctuary', 'Guest Speaker', 'plenary', 3),
('sch_d2_04', 'vlc-2027', 2, 'Day 2 • Leadership Tracks & Holy Fire', '2027-07-22', '11:45', '13:15', '11:45 AM – 1:15 PM', 'Fellowship Lunch & Delegation Discussions', 'Group meal and reflection on plenary insights.', 'Dining Hall', 'Delegation Leaders', 'meal', 4),
('sch_d2_05', 'vlc-2027', 2, 'Day 2 • Leadership Tracks & Holy Fire', '2027-07-22', '13:30', '16:00', '1:30 PM – 4:00 PM', 'Specialized Ministry Workshop Tracks', 'Concurrent breakout sessions: Praise & Worship, Media/Tech, Youth Ministry, Children Church.', 'Workshops Rooms A, B, C & D', 'Ministry Department Heads', 'workshop', 5),
('sch_d2_06', 'vlc-2027', 2, 'Day 2 • Leadership Tracks & Holy Fire', '2027-07-22', '16:15', '17:45', '4:15 PM – 5:45 PM', 'Camp Team Challenges & Active Games', 'Fun, high-energy delegation team building challenges.', 'Camp Sports Field', 'Activities Committee', 'sports', 6),
('sch_d2_07', 'vlc-2027', 2, 'Day 2 • Leadership Tracks & Holy Fire', '2027-07-22', '19:00', '22:00', '7:00 PM – 10:00 PM', 'Night of Praise, Worship & Altar Encounter', 'Extended worship, baptism of the Holy Spirit, and personal ministry prayer lines.', 'Main Sanctuary', 'VLC Worship Team', 'rally', 7);

-- Day 3
INSERT OR REPLACE INTO event_schedules (id, event_id, day_number, day_title, date, time_start, time_end, time_display, title, description, location, speaker, session_type, sort_order) VALUES
('sch_d3_01', 'vlc-2027', 3, 'Day 3 • Empowerment & Fellowship Night', '2027-07-23', '06:30', '07:30', '6:30 AM – 7:30 AM', 'Dawn Watch Prayer & Worship', 'Corporate prayer for local churches and communities.', 'Prayer Pavilions', 'Youth Leaders', 'fellowship', 1),
('sch_d3_02', 'vlc-2027', 3, 'Day 3 • Empowerment & Fellowship Night', '2027-07-23', '07:30', '08:30', '7:30 AM – 8:30 AM', 'Breakfast', 'Morning fellowship breakfast.', 'Dining Hall', 'Kitchen Committee', 'meal', 2),
('sch_d3_03', 'vlc-2027', 3, 'Day 3 • Empowerment & Fellowship Night', '2027-07-23', '09:00', '11:30', '9:00 AM – 11:30 AM', 'Plenary 2: The Empowered Generation', 'Evangelism, campus ministry strategy, and community impact.', 'Main Sanctuary', 'National Youth Director', 'plenary', 3),
('sch_d3_04', 'vlc-2027', 3, 'Day 3 • Empowerment & Fellowship Night', '2027-07-23', '11:45', '13:15', '11:45 AM – 1:15 PM', 'Lunch & Regional Delegation Meeting', 'Provincial delegation coordination and regional fellowship.', 'Dining Hall', 'Pastors & Coordinators', 'meal', 4),
('sch_d3_05', 'vlc-2027', 3, 'Day 3 • Empowerment & Fellowship Night', '2027-07-23', '14:00', '16:30', '2:00 PM – 4:30 PM', 'National Bible Bowl & Scripture Showcase', 'Inter-church scripture memory quiz, creative presentations, and awards.', 'Auditorium', 'Academic & Education Committee', 'workshop', 5),
('sch_d3_06', 'vlc-2027', 3, 'Day 3 • Empowerment & Fellowship Night', '2027-07-23', '19:00', '22:00', '7:00 PM – 10:00 PM', 'Campfire Acoustic Night & Testimony Rally', 'Outdoor praise around the campfire, delegate testimonies, and celebration of grace.', 'Open Campfire Grounds', 'All Delegations', 'rally', 6);

-- Day 4
INSERT OR REPLACE INTO event_schedules (id, event_id, day_number, day_title, date, time_start, time_end, time_display, title, description, location, speaker, session_type, sort_order) VALUES
('sch_d4_01', 'vlc-2027', 4, 'Day 4 • Commissioning & Send-Off', '2027-07-24', '07:00', '08:00', '7:00 AM – 8:00 AM', 'Final Camp Breakfast', 'Final morning meal together with friends and mentors.', 'Dining Hall', 'Kitchen Committee', 'meal', 1),
('sch_d4_02', 'vlc-2027', 4, 'Day 4 • Commissioning & Send-Off', '2027-07-24', '08:30', '11:30', '8:30 AM – 11:30 AM', 'Grand Commissioning Service & Holy Communion', 'Anointing of delegates, Holy Communion, certificate distribution, and send-off charge.', 'Main Sanctuary', 'PCCI General Presbytery', 'rally', 2),
('sch_d4_03', 'vlc-2027', 4, 'Day 4 • Commissioning & Send-Off', '2027-07-24', '11:45', '13:00', '11:45 AM – 1:00 PM', 'Victory Luncheon & Delegation Photos', 'Official camp photo shoot per church and farewell banquet.', 'Courtyard & Grounds', 'Media Secretariat', 'meal', 3),
('sch_d4_04', 'vlc-2027', 4, 'Day 4 • Commissioning & Send-Off', '2027-07-24', '13:00', '15:00', '1:00 PM – 3:00 PM', 'Delegation Departure & Travel Mercies', 'Cabin checkout and safe homeward journey across the provinces.', 'Gate Departure Terminal', 'Transport Committee', 'general', 4);
