/*
  # Basic schema for AI Sales Maximizer

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `content_types`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `category` (text)
      - `has_multiple_days` (boolean)
      - `total_days` (integer)
      - `export_options` (text[])
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables with UUID primary keys

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Content types table
CREATE TABLE IF NOT EXISTS content_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  category text NOT NULL,
  has_multiple_days boolean DEFAULT false,
  total_days integer DEFAULT 1,
  export_options text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_types ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Users policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can read own data'
  ) THEN
    CREATE POLICY "Users can read own data"
      ON users
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update own data'
  ) THEN
    CREATE POLICY "Users can update own data"
      ON users
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;

-- Content types policies (all authenticated users can read)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'content_types' AND policyname = 'Content types are readable by all authenticated users'
  ) THEN
    CREATE POLICY "Content types are readable by all authenticated users"
      ON content_types
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;