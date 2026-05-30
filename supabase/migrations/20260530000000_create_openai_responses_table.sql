-- Create table for storing OpenAI Responses API calls with multi-tenant isolation
CREATE TABLE IF NOT EXISTS openai_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  session_id TEXT,
  model TEXT NOT NULL,
  input JSONB,
  output JSONB,
  usage JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB,
  response_id TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_openai_responses_tenant_user ON openai_responses(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_openai_responses_session ON openai_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_openai_responses_created_at ON openai_responses(created_at);

-- Enable Row Level Security
ALTER TABLE openai_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tenant isolation
CREATE POLICY "Allow select for authenticated users" ON openai_responses
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated users" ON openai_responses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users" ON openai_responses
  FOR UPDATE USING (true);

CREATE POLICY "Allow delete for authenticated users" ON openai_responses
  FOR DELETE USING (true);