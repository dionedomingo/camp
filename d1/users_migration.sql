-- Create admin_users table for VLC 2027 admin portal
CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'staff', -- 'admin', 'staff', 'coordinator'
    church_id TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login_at DATETIME,
    FOREIGN KEY (church_id) REFERENCES churches(id)
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Seed initial admin user: Alexius
INSERT OR IGNORE INTO admin_users (id, name, email, password_hash, role, is_active, created_at)
VALUES (
    'usr_admin_alexius',
    'Alexius',
    'alexius@pcci.ph',
    'pcci2027',
    'admin',
    1,
    CURRENT_TIMESTAMP
);
