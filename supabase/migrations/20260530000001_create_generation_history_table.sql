-- Create table for storing AI generation history with multi-tenant isolation
CREATE TABLE IF NOT EXISTS generation_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  tenant_id TEXT,
  prompt TEXT NOT NULL,
  model TEXT NOT NULL,
  result_url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'batch')),
  meta_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_generation_history_user_id ON generation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_history_tenant_id ON generation_history(tenant_id);
CREATE INDEX IF NOT EXISTS idx_generation_history_type ON generation_history(type);
CREATE INDEX IF NOT EXISTS idx_generation_history_created_at ON generation_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generation_history_tenant_user ON generation_history(tenant_id, user_id);

-- Enable Row Level Security
ALTER TABLE generation_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for multi-tenant isolation
-- Users can view their own records
CREATE POLICY "Users can view their own generation history" ON generation_history
  FOR SELECT USING (
    user_id = auth.uid()::TEXT
    OR (tenant_id IS NOT NULL AND tenant_id = current_setting('request.jwt.claim.tenant_id', true))
  );

-- Users can insert their own records
CREATE POLICY "Users can insert their own generation history" ON generation_history
  FOR INSERT WITH CHECK (
    user_id = auth.uid()::TEXT
  );

-- Users can update their own records
CREATE POLICY "Users can update their own generation history" ON generation_history
  FOR UPDATE USING (
    user_id = auth.uid()::TEXT
  );

-- Users can delete their own records
CREATE POLICY "Users can delete their own generation history" ON generation_history
  FOR DELETE USING (
    user_id = auth.uid()::TEXT
  );

-- Service role can manage all records (for edge functions)
CREATE POLICY "Service role can manage all generation history" ON generation_history
  FOR ALL USING (
    current_setting('request.jwt.claim.role', true) = 'service_role'
  );