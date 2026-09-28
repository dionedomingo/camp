-- Migration: Outbound Email Deliveries & Strict Idempotency Table
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

CREATE INDEX IF NOT EXISTS idx_email_deliveries_camper ON email_deliveries(camper_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_deliveries_key ON email_deliveries(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_email_deliveries_status ON email_deliveries(status);
