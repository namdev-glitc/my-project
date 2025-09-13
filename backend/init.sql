-- Initialize database for Guest Management System

-- Create database if not exists
-- This is handled by POSTGRES_DB environment variable

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'Asia/Ho_Chi_Minh';

-- Create initial admin user (password: admin123)
-- Note: In production, change this password immediately
INSERT INTO users (id, username, email, full_name, password_hash, is_active, is_admin, created_at, updated_at) 
VALUES (
    uuid_generate_v4(),
    'admin',
    'admin@guestmanagement.com',
    'System Administrator',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4sKX.3tK9C', -- admin123
    true,
    true,
    NOW(),
    NOW()
) ON CONFLICT (username) DO NOTHING;

-- Create default event
INSERT INTO events (id, name, description, event_date, location, max_guests, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'Lễ kỷ niệm 15 năm',
    'Sự kiện kỷ niệm 15 năm thành lập công ty',
    '2024-12-31 18:00:00+07',
    'Hội trường lớn - Tầng 10',
    500,
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;


