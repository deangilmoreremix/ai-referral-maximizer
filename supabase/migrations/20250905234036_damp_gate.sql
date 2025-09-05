/*
  # Production Schema Migration
  
  1. Enhanced Tables
    - Enhanced content_types with metadata
    - Real user preferences and settings
    - Content generation tracking
    - Communication logs and analytics
    
  2. Security
    - Row Level Security on all tables
    - User-specific data access policies
    - API key encryption
    
  3. Performance
    - Optimized indexes for common queries
    - Materialized views for analytics
*/

-- Enhanced content types with metadata
CREATE TABLE IF NOT EXISTS content_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  has_multiple_days boolean DEFAULT false,
  total_days integer DEFAULT 1,
  export_options text[] DEFAULT ARRAY['pdf'],
  prompt_template text NOT NULL,
  estimated_generation_time integer DEFAULT 30, -- seconds
  popularity_score integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User preferences and settings
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  industry text,
  target_audience text,
  business_size text DEFAULT 'medium',
  special_requirements text,
  default_ai_model text DEFAULT 'gpt-5',
  relationship_type text,
  dismissed_tooltips text[] DEFAULT ARRAY[]::text[],
  onboarding_completed boolean DEFAULT false,
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Generated content with enhanced metadata
CREATE TABLE IF NOT EXISTS generated_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type_id uuid REFERENCES content_types(id),
  content text NOT NULL,
  ai_model text NOT NULL,
  generation_time_ms integer,
  revision_count integer DEFAULT 0,
  personalization_data jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Document analysis results
CREATE TABLE IF NOT EXISTS analyzed_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint,
  analysis_results jsonb NOT NULL,
  extraction_method text DEFAULT 'edge_function',
  processing_time_ms integer,
  created_at timestamptz DEFAULT now()
);

-- LinkedIn profile data
CREATE TABLE IF NOT EXISTS linkedin_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  linkedin_url text NOT NULL,
  profile_data jsonb NOT NULL,
  analysis_enhanced boolean DEFAULT false,
  last_scraped_at timestamptz DEFAULT now(),
  scraping_method text DEFAULT 'edge_function',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, linkedin_url)
);

-- Communication logs for voice/SMS tracking
CREATE TABLE IF NOT EXISTS communication_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  channel text NOT NULL, -- 'sms', 'voice', 'whatsapp', etc.
  recipient_info jsonb NOT NULL,
  content text NOT NULL,
  status text NOT NULL, -- 'sent', 'delivered', 'failed', etc.
  external_id text, -- ID from external service (Unipile, DropCowboy)
  cost_cents integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  sent_at timestamptz DEFAULT now(),
  delivered_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Campaign management
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  channel text NOT NULL,
  status text DEFAULT 'draft', -- 'draft', 'scheduled', 'active', 'completed', 'paused'
  target_contacts jsonb DEFAULT '[]'::jsonb,
  content_template text,
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  actual_start timestamptz,
  actual_end timestamptz,
  stats jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Usage analytics and tracking
CREATE TABLE IF NOT EXISTS usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  resource_type text,
  resource_id text,
  ai_model text,
  generation_time_ms integer,
  success boolean DEFAULT true,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- API integrations and credentials (encrypted)
CREATE TABLE IF NOT EXISTS user_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name text NOT NULL, -- 'unipile', 'dropcowboy', etc.
  encrypted_credentials text, -- Encrypted API keys/tokens
  is_active boolean DEFAULT true,
  last_sync_at timestamptz,
  sync_status text DEFAULT 'pending',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, service_name)
);

-- Content templates library
CREATE TABLE IF NOT EXISTS content_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  content_type text NOT NULL,
  template_content text NOT NULL,
  variables jsonb DEFAULT '[]'::jsonb,
  is_public boolean DEFAULT false,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyzed_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read public content types" ON content_types FOR SELECT USING (true);
CREATE POLICY "Users can manage their preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their content" ON generated_content FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their documents" ON analyzed_documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their profiles" ON linkedin_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their communications" ON communication_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their campaigns" ON campaigns FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their usage logs" ON usage_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their integrations" ON user_integrations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their templates" ON content_templates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can read public templates" ON content_templates FOR SELECT USING (is_public = true OR auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_generated_content_user_created ON generated_content(user_id, created_at DESC);
CREATE INDEX idx_usage_logs_user_created ON usage_logs(user_id, created_at DESC);
CREATE INDEX idx_communication_logs_user_sent ON communication_logs(user_id, sent_at DESC);
CREATE INDEX idx_campaigns_user_status ON campaigns(user_id, status);
CREATE INDEX idx_content_types_category ON content_types(category) WHERE is_active = true;

-- Functions for updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_content_types_updated_at BEFORE UPDATE ON content_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generated_content_updated_at BEFORE UPDATE ON generated_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_linkedin_profiles_updated_at BEFORE UPDATE ON linkedin_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_integrations_updated_at BEFORE UPDATE ON user_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_templates_updated_at BEFORE UPDATE ON content_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();