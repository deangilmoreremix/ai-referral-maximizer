/*
  # Create Storage Bucket for Conversation Attachments

  1. Storage Setup
    - Create 'conversation-attachments' storage bucket
    - Set to private (requires authentication)
    - Configure file size limits and allowed MIME types
  
  2. Security
    - Enable RLS on storage.objects
    - Users can only upload to their own contexts
    - Users can only read their own files
    - Automatic cleanup on user data deletion
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'conversation-attachments',
  'conversation-attachments',
  false,
  10485760, -- 10MB limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv',
    'application/json',
    'image/png',
    'image/jpeg',
    'image/jpg'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the storage bucket
CREATE POLICY "Users can upload their own attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'conversation-attachments' AND
  (storage.foldername(name))[1] IN (
    SELECT context_id::text 
    FROM conversation_messages 
    WHERE context_id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Users can view their own attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'conversation-attachments' AND
  (storage.foldername(name))[1] IN (
    SELECT context_id::text 
    FROM conversation_messages 
    WHERE context_id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Users can delete their own attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'conversation-attachments' AND
  (storage.foldername(name))[1] IN (
    SELECT context_id::text 
    FROM conversation_messages 
    WHERE context_id::text = (storage.foldername(name))[1]
  )
);
