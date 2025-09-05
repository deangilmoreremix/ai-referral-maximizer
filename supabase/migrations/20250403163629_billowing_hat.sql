/*
  # Usage tracking and analytics schema

  1. New Tables
    - `usage_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `action` (text)
      - `details` (jsonb)
      - `created_at` (timestamp)
    - `user_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `preferences` (jsonb)
      - `onboarding_completed` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Usage logs table
CREATE TABLE IF NOT EXISTS usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  action text NOT NULL,
  resource_type text,
  resource_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Add index on user_id for faster queries
CREATE INDEX IF NOT EXISTS usage_logs_user_id_idx ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS usage_logs_action_idx ON usage_logs(action);
CREATE INDEX IF NOT EXISTS usage_logs_created_at_idx ON usage_logs(created_at);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  theme text DEFAULT 'light',
  dismissed_tooltips text[] DEFAULT '{}'::text[],
  onboarding_completed boolean DEFAULT false,
  has_completed_tour boolean DEFAULT false,
  default_export_format text DEFAULT 'pdf',
  default_category text DEFAULT 'all',
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Usage logs policies
CREATE POLICY "Users can view their own usage logs"
  ON usage_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- System/app can insert usage logs for any user
CREATE POLICY "System can insert usage logs"
  ON usage_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- User preferences policies
CREATE POLICY "Users can manage their own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);