-- Create conversation_messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS conversation_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  context_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  reasoning TEXT,
  quality_score DECIMAL(5,2) CHECK (quality_score >= 0 AND quality_score <= 100),
  has_web_search BOOLEAN DEFAULT false,
  has_file_attachment BOOLEAN DEFAULT false,
  has_image_generation BOOLEAN DEFAULT false,
  has_code_execution BOOLEAN DEFAULT false,
  has_video_generation BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversation_attachments table if it doesn't exist
CREATE TABLE IF NOT EXISTS conversation_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID,
  context_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create web_search_results table if it doesn't exist
CREATE TABLE IF NOT EXISTS web_search_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL,
  query TEXT NOT NULL,
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create generated_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS generated_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  model TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create code_executions table if it doesn't exist
CREATE TABLE IF NOT EXISTS code_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  output TEXT,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create generated_videos table if it doesn't exist
CREATE TABLE IF NOT EXISTS generated_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES conversation_messages(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  video_url TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'gpt-video',
  duration INTEGER NOT NULL DEFAULT 5,
  aspect_ratio TEXT NOT NULL DEFAULT '16:9',
  status TEXT CHECK (status IN ('processing', 'completed', 'failed', 'not_supported')) DEFAULT 'completed',
  generation_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversation_messages_context_id ON conversation_messages(context_id);
CREATE INDEX IF NOT EXISTS idx_conversation_attachments_context_id ON conversation_attachments(context_id);
CREATE INDEX IF NOT EXISTS idx_web_search_results_message_id ON web_search_results(message_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_message_id ON generated_images(message_id);
CREATE INDEX IF NOT EXISTS idx_code_executions_message_id ON code_executions(message_id);
CREATE INDEX IF NOT EXISTS idx_generated_videos_message_id ON generated_videos(message_id);

-- Enable Row Level Security
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_search_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY IF NOT EXISTS "Users can manage their conversation messages" ON conversation_messages
  FOR ALL USING (true);

CREATE POLICY IF NOT EXISTS "Users can manage their conversation attachments" ON conversation_attachments
  FOR ALL USING (true);

CREATE POLICY IF NOT EXISTS "Users can manage their web search results" ON web_search_results
  FOR ALL USING (true);

CREATE POLICY IF NOT EXISTS "Users can manage their generated images" ON generated_images
  FOR ALL USING (true);

CREATE POLICY IF NOT EXISTS "Users can manage their code executions" ON code_executions
  FOR ALL USING (true);

CREATE POLICY IF NOT EXISTS "Users can manage their generated videos" ON generated_videos
  FOR ALL USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER IF NOT EXISTS update_conversation_messages_updated_at
  BEFORE UPDATE ON conversation_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();