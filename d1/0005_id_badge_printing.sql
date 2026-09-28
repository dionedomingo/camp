-- Migration 0005: ID Badge Printing Queue and Reprint Tracking

-- Add print tracking columns to event_registrations
ALTER TABLE event_registrations ADD COLUMN print_count INTEGER DEFAULT 0;
ALTER TABLE event_registrations ADD COLUMN last_printed_at DATETIME;
ALTER TABLE event_registrations ADD COLUMN last_printed_by TEXT;
ALTER TABLE event_registrations ADD COLUMN reprint_reason TEXT;

-- Add print tracking columns to campers for backward compatibility and fast access
ALTER TABLE campers ADD COLUMN print_count INTEGER DEFAULT 0;
ALTER TABLE campers ADD COLUMN last_printed_at DATETIME;
ALTER TABLE campers ADD COLUMN last_printed_by TEXT;
ALTER TABLE campers ADD COLUMN reprint_reason TEXT;

-- Indexes for queue filtering by event and print status
CREATE INDEX IF NOT EXISTS idx_event_reg_print_count ON event_registrations(event_id, print_count);
CREATE INDEX IF NOT EXISTS idx_campers_print_count ON campers(print_count);
