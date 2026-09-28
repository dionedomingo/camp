-- Migration 0006: Event Registration Allowed Dates (Lead-up to Event)
-- Adds registration window columns leading up to the actual camp event

-- 1. Add registration allowed date columns to events table
ALTER TABLE events ADD COLUMN registration_start_date DATE;
ALTER TABLE events ADD COLUMN registration_end_date DATE;

-- 2. Seed / Update registration dates for primary events leading up to the actual event
-- VLC 2027: Event is 2027-07-21 to 2027-07-24. Registration open from 2026-09-01 until 2027-07-14 (1 week prior to camp)
UPDATE events 
SET registration_start_date = '2026-09-01',
    registration_end_date = '2027-07-14'
WHERE id = 'vlc-2027';

-- VLC 2029: Event is 2029-07-25 to 2029-07-28. Registration open from 2028-09-01 until 2029-07-18 (1 week prior to camp)
UPDATE events 
SET registration_start_date = '2028-09-01',
    registration_end_date = '2029-07-18'
WHERE id = 'vlc-2029';
