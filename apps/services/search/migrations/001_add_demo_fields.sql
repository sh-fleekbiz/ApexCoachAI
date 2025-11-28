-- Migration: Add demo user fields
-- Database: apexcoachai_db on pg-shared-apps-eastus2

-- Add demo fields to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS demo_role VARCHAR(50),
  ADD COLUMN IF NOT EXISTS demo_label TEXT;

-- Create indexes for efficient demo user queries
CREATE INDEX IF NOT EXISTS idx_users_is_demo_demo_role ON users(is_demo, demo_role) WHERE is_demo = TRUE;

-- Add comment for documentation
COMMENT ON COLUMN users.is_demo IS 'Indicates if this is a demo/test account';
COMMENT ON COLUMN users.demo_role IS 'Demo persona identifier (admin, coach, client)';
COMMENT ON COLUMN users.demo_label IS 'Human-readable label for demo user display';
