-- Migration: Add camper activation and on-arrival check-in fields
ALTER TABLE campers ADD COLUMN activation_code TEXT;
ALTER TABLE campers ADD COLUMN activation_token TEXT;
ALTER TABLE campers ADD COLUMN password_hash TEXT;
ALTER TABLE campers ADD COLUMN status TEXT DEFAULT 'registered';
ALTER TABLE campers ADD COLUMN checked_in_at DATETIME;
ALTER TABLE campers ADD COLUMN checked_in_by TEXT;
ALTER TABLE campers ADD COLUMN kit_claimed INTEGER DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS idx_campers_activation_code ON campers(activation_code);
CREATE UNIQUE INDEX IF NOT EXISTS idx_campers_activation_token ON campers(activation_token);
CREATE INDEX IF NOT EXISTS idx_campers_status ON campers(status);
