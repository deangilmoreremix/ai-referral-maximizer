/*
  # Referral Methods Schema

  1. New Tables
    - `referral_methods`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `category` (text)
      - `implementation_steps` (text[])
      - `templates` (jsonb)
      - `best_practices` (text[])
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Referral methods table
CREATE TABLE IF NOT EXISTS referral_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  category text NOT NULL,
  implementation_steps text[],
  templates jsonb DEFAULT '{}'::jsonb,
  best_practices text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE referral_methods ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Referral methods are readable by all authenticated users"
  ON referral_methods
  FOR SELECT
  TO authenticated
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_referral_methods_timestamp
BEFORE UPDATE ON referral_methods
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- Insert initial data
INSERT INTO referral_methods (name, description, category, implementation_steps, templates, best_practices)
VALUES
(
  'Friends and Family Campaign',
  'A 14-day messaging campaign to request referrals from friends and family',
  'direct-outreach',
  ARRAY[
    'Segment your friends and family contacts into categories',
    'Personalize messages for each segment',
    'Schedule your messages across the 14-day campaign',
    'Track responses and follow up appropriately',
    'Document referrals received and send thank-you messages'
  ],
  '{
    "whatsapp": "Hi [Name]! I hope you''re doing well. I''m reaching out because I''m working on growing my [business type] through referrals. I''m not looking to sell you anything, but I''d love your help connecting me with anyone you know who might need [your service]. Would you be open to referring me? I''d really appreciate it!",
    "sms": "Hey [Name]! Quick question - do you know anyone who might need help with [your service]? I''m focusing on growing through referrals and would appreciate any connections. No pressure at all!",
    "face_to_face": "So [Name], I wanted to mention that I''m looking to grow my business through referrals right now. I''m wondering if you know anyone who might benefit from [your service]? I''d really appreciate an introduction if someone comes to mind."
  }'::jsonb,
  ARRAY[
    'Keep messages friendly and never pushy',
    'Express genuine appreciation for any help',
    'Make it clear you''re not trying to sell to them directly',
    'Follow up only once if you don''t get a response',
    'Send personalized thank-you messages for any referrals received'
  ]
),
(
  'Phone Call Scripts',
  'Effective scripts for requesting referrals during phone conversations',
  'direct-outreach',
  ARRAY[
    'Identify which contacts to call and categorize by relationship',
    'Schedule calls during appropriate times',
    'Practice the scripts before making calls',
    'Take notes during calls to track responses',
    'Follow up with promised information or materials',
    'Track results and refine your approach'
  ],
  '{
    "warm_contact": "Hi [Name], it''s [Your Name]. How are you doing? [Wait for response] That''s great to hear. I''m calling because I''ve really enjoyed working with clients like you, and I''m looking to expand my business through referrals. Do you know anyone who might benefit from [your service]? [Wait for response] That''s fantastic! Would you be comfortable making an introduction for us?",
    "client_follow_up": "Hello [Name], I wanted to check in and see how everything is going with [recent service you provided]. [Wait for response] I''m so glad to hear that. Since you''ve had a positive experience, I was wondering if you know anyone else who might benefit from similar services? I''m currently accepting new clients and would appreciate any referrals.",
    "voicemail": "Hi [Name], this is [Your Name] from [Your Business]. I''m calling to touch base and also to ask for your help with something quick. I''m working on growing my business through referrals, and I thought you might know someone who could benefit from [your service]. Please give me a call back at [your number] when you have a moment. I''d really appreciate your thoughts. Thanks, and have a great day!"
  }'::jsonb,
  ARRAY[
    'Always start by building rapport, not asking for the referral immediately',
    'Be specific about what type of referrals you''re looking for',
    'Explain how the referral process works to make it easy',
    'Express genuine appreciation regardless of the outcome',
    'Follow up with an email or text to remind them of your conversation'
  ]
),
(
  'WhatsApp Outreach Campaigns',
  '14-day WhatsApp messaging campaigns for referral generation',
  'direct-outreach',
  ARRAY[
    'Segment your contacts into categories',
    'Create message templates for each day and segment',
    'Schedule messages or set reminders to send them',
    'Prepare any images or media files to include',
    'Set up a system to track responses',
    'Create follow-up templates for different response types'
  ],
  '{
    "day_one": "Hi [Name]! 👋 Hope you''ve been doing well! I''m reaching out because I''m focusing on growing my [business type] through referrals this month. I''m not looking to sell you anything - just wondering if you might know anyone who could benefit from [your service]? Would love your help if someone comes to mind! 🙏",
    "day_five": "Hey [Name]! Just checking in on my message from earlier this week about referrals for my [business type]. No pressure at all, but if you do think of someone who might need help with [problem you solve], I''d be so grateful for an introduction! Hope you''re having a great week! 😊",
    "day_ten": "Hi [Name]! I wanted to share a quick tip about [relevant topic] that might be helpful: [brief valuable tip]. This is the kind of insight I provide to my clients. If you know anyone who''s struggling with [related problem], I''d love to help them too. Let me know if someone comes to mind!"
  }'::jsonb,
  ARRAY[
    'Use emoji and conversational language to keep messages friendly',
    'Respond quickly to any replies (WhatsApp users expect fast responses)',
    'Provide genuine value throughout your campaign',
    'Use media content strategically (images, short voice notes, brief videos)',
    'Personalize every message with specific details',
    'Keep messages concise - aim for under 200 characters when possible'
  ]
);