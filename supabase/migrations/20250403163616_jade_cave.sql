/*
  # Content storage and personalization schema

  1. New Tables
    - `generated_content`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `content_type_id` (uuid, references content_types.id)
      - `content` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `personalization_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `industry` (text)
      - `target_audience` (text)
      - `business_size` (text)
      - `special_requirements` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Generated content table
CREATE TABLE IF NOT EXISTS generated_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content_type_id uuid REFERENCES content_types(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  revision_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add index on user_id for faster queries
CREATE INDEX IF NOT EXISTS generated_content_user_id_idx ON generated_content(user_id);

-- Personalization settings table
CREATE TABLE IF NOT EXISTS personalization_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  industry text,
  target_audience text,
  business_size text,
  special_requirements text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalization_settings ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Generated content policies
CREATE POLICY "Users can manage their own content"
  ON generated_content
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Personalization settings policies
CREATE POLICY "Users can manage their own personalization settings"
  ON personalization_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);