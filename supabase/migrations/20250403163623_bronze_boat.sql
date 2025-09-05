/*
  # Document and LinkedIn analysis schema

  1. New Tables
    - `analyzed_documents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `file_name` (text)
      - `file_type` (text)
      - `analysis_results` (jsonb)
      - `created_at` (timestamp)
    - `linkedin_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `linkedin_url` (text)
      - `profile_data` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Analyzed documents table
CREATE TABLE IF NOT EXISTS analyzed_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size integer,
  analysis_results jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add index on user_id for faster queries
CREATE INDEX IF NOT EXISTS analyzed_documents_user_id_idx ON analyzed_documents(user_id);

-- LinkedIn profiles table
CREATE TABLE IF NOT EXISTS linkedin_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  linkedin_url text NOT NULL,
  profile_data jsonb NOT NULL,
  last_scraped_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add index on user_id and linkedin_url for faster queries
CREATE INDEX IF NOT EXISTS linkedin_profiles_user_id_idx ON linkedin_profiles(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS linkedin_profiles_user_id_url_idx ON linkedin_profiles(user_id, linkedin_url);

-- Enable Row Level Security
ALTER TABLE analyzed_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Analyzed documents policies
CREATE POLICY "Users can manage their own document analyses"
  ON analyzed_documents
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- LinkedIn profiles policies
CREATE POLICY "Users can manage their own LinkedIn profile data"
  ON linkedin_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);