import { createClient } from '@supabase/supabase-js';

// Environment variables from .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined in your .env file.');
}

// Create a single instance of the Supabase client to be used throughout the app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
type User = {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
};

type ContentType = {
  id: string;
  name: string;
  description?: string;
  category: string;
  has_multiple_days: boolean;
  total_days: number;
  export_options: string[];
  created_at: string;
  updated_at: string;
};

type GeneratedContent = {
  id: string;
  user_id: string;
  content_type_id: string;
  content: string;
  revision_count: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

type PersonalizationSettings = {
  id: string;
  user_id: string;
  industry?: string;
  target_audience?: string;
  business_size?: string;
  special_requirements?: string;
  created_at: string;
  updated_at: string;
};

type AnalyzedDocument = {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size?: number;
  analysis_results: Record<string, unknown>;
  created_at: string;
};

type LinkedInProfile = {
  id: string;
  user_id: string;
  linkedin_url: string;
  profile_data: Record<string, unknown>;
  last_scraped_at: string;
  created_at: string;
  updated_at: string;
};

type UserPreferences = {
  id: string;
  user_id: string;
  theme?: string;
  dismissed_tooltips?: string[];
  onboarding_completed: boolean;
  has_completed_tour: boolean;
  default_export_format?: string;
  default_category?: string;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

type UsageLog = {
  id: string;
  user_id: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  details: Record<string, unknown>;
  created_at: string;
};

// Helper functions for database operations

/**
 * Get current user data
 * @returns User data or null if not authenticated
 */
async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Get user profile data
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error || !data) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data as User;
}

/**
 * Get all content types
 * @returns Array of content types
 */
async function getContentTypes(): Promise<ContentType[]> {
  const { data, error } = await supabase
    .from('content_types')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching content types:', error);
    return [];
  }
  
  return data as ContentType[];
}

/**
 * Get user's generated content history
 * @returns Array of user's generated content
 */
async function getUserContent(): Promise<GeneratedContent[]> {
  const { data, error } = await supabase
    .from('generated_content')
    .select('*, content_types(*)')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user content:', error);
    return [];
  }
  
  return data as GeneratedContent[];
}

/**
 * Save generated content
 * @param contentTypeId ID of the content type
 * @param content The generated content
 * @param metadata Additional metadata
 * @returns The saved content or null if failed
 */
async function saveGeneratedContent(
  contentTypeId: string, 
  content: string, 
  metadata: Record<string, unknown> = {}
): Promise<GeneratedContent | null> {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('generated_content')
    .insert([
      { 
        user_id: user.id, 
        content_type_id: contentTypeId, 
        content, 
        metadata 
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error saving generated content:', error);
    return null;
  }
  
  // Log usage
  await logUserAction('generate_content', 'generated_content', data.id, {
    content_type_id: contentTypeId
  });
  
  return data as GeneratedContent;
}

/**
 * Update generated content (e.g., after revision)
 * @param contentId ID of the content to update
 * @param newContent Updated content
 * @returns The updated content or null if failed
 */
async function updateGeneratedContent(
  contentId: string,
  newContent: string
): Promise<GeneratedContent | null> {
  const { data, error } = await supabase
    .from('generated_content')
    .update({ 
      content: newContent,
      revision_count: supabase.rpc('increment_revision_count', { row_id: contentId }),
      updated_at: new Date().toISOString()
    })
    .eq('id', contentId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating generated content:', error);
    return null;
  }
  
  // Log usage
  await logUserAction('revise_content', 'generated_content', contentId);
  
  return data as GeneratedContent;
}

/**
 * Get user's personalization settings
 * @returns User's personalization settings or null if not set
 */
async function getPersonalizationSettings(): Promise<PersonalizationSettings | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('personalization_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is fine
    console.error('Error fetching personalization settings:', error);
  }
  
  return data as PersonalizationSettings || null;
}

/**
 * Save or update personalization settings
 * @param settings Personalization settings to save
 * @returns The saved settings or null if failed
 */
async function savePersonalizationSettings(
  settings: Omit<PersonalizationSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<PersonalizationSettings | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  // Check if settings already exist
  const { data: existingSettings } = await supabase
    .from('personalization_settings')
    .select('id')
    .eq('user_id', user.id)
    .single();
  
  let result;
  
  if (existingSettings) {
    // Update existing settings
    result = await supabase
      .from('personalization_settings')
      .update({ 
        ...settings, 
        updated_at: new Date().toISOString() 
      })
      .eq('user_id', user.id)
      .select()
      .single();
  } else {
    // Insert new settings
    result = await supabase
      .from('personalization_settings')
      .insert([{ 
        user_id: user.id, 
        ...settings 
      }])
      .select()
      .single();
  }
  
  if (result.error) {
    console.error('Error saving personalization settings:', result.error);
    return null;
  }
  
  // Log usage
  await logUserAction('update_personalization', 'personalization_settings', result.data.id);
  
  return result.data as PersonalizationSettings;
}

/**
 * Save document analysis results
 * @param fileName Name of the analyzed file
 * @param fileType MIME type of the file
 * @param fileSize Size of the file in bytes (optional)
 * @param analysisResults Results of the document analysis
 * @returns The saved analysis record or null if failed
 */
async function saveDocumentAnalysis(
  fileName: string,
  fileType: string,
  fileSize: number | undefined,
  analysisResults: Record<string, unknown>
): Promise<AnalyzedDocument | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('analyzed_documents')
    .insert([{
      user_id: user.id,
      file_name: fileName,
      file_type: fileType,
      file_size: fileSize,
      analysis_results: analysisResults
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error saving document analysis:', error);
    return null;
  }
  
  // Log usage
  await logUserAction('analyze_document', 'analyzed_documents', data.id);
  
  return data as AnalyzedDocument;
}

/**
 * Get user's recent document analyses
 * @param limit Number of records to return
 * @returns Array of recent document analyses
 */
async function getRecentDocumentAnalyses(limit = 5): Promise<AnalyzedDocument[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('analyzed_documents')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching document analyses:', error);
    return [];
  }
  
  return data as AnalyzedDocument[];
}

/**
 * Save LinkedIn profile data
 * @param linkedinUrl URL of the LinkedIn profile
 * @param profileData Scraped profile data
 * @returns The saved profile record or null if failed
 */
async function saveLinkedInProfile(
  linkedinUrl: string,
  profileData: Record<string, unknown>
): Promise<LinkedInProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  // Check if this profile has been saved before
  const { data: existingProfile } = await supabase
    .from('linkedin_profiles')
    .select('id')
    .eq('user_id', user.id)
    .eq('linkedin_url', linkedinUrl)
    .single();
  
  let result;
  
  if (existingProfile) {
    // Update existing profile
    result = await supabase
      .from('linkedin_profiles')
      .update({ 
        profile_data: profileData,
        last_scraped_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', existingProfile.id)
      .select()
      .single();
  } else {
    // Insert new profile
    result = await supabase
      .from('linkedin_profiles')
      .insert([{
        user_id: user.id,
        linkedin_url: linkedinUrl,
        profile_data: profileData
      }])
      .select()
      .single();
  }
  
  if (result.error) {
    console.error('Error saving LinkedIn profile:', result.error);
    return null;
  }
  
  // Log usage
  await logUserAction('analyze_linkedin', 'linkedin_profiles', result.data.id);
  
  return result.data as LinkedInProfile;
}

/**
 * Get user's recent LinkedIn profiles
 * @param limit Number of records to return
 * @returns Array of recent LinkedIn profiles
 */
async function getRecentLinkedInProfiles(limit = 5): Promise<LinkedInProfile[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('linkedin_profiles')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching LinkedIn profiles:', error);
    return [];
  }
  
  return data as LinkedInProfile[];
}

/**
 * Get user preferences
 * @returns User preferences or null if not set
 */
async function getUserPreferences(): Promise<UserPreferences | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  if (error && error.code !== 'PGRST116') { // No rows returned is ok
    console.error('Error fetching user preferences:', error);
  }
  
  return data as UserPreferences || null;
}

/**
 * Save or update user preferences
 * @param preferences Preferences to update
 * @returns Updated preferences or null if failed
 */
async function saveUserPreferences(
  preferences: Partial<Omit<UserPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<UserPreferences | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  // Check if preferences exist
  const { data: existingPrefs } = await supabase
    .from('user_preferences')
    .select('id')
    .eq('user_id', user.id)
    .single();
  
  let result;
  
  if (existingPrefs) {
    // Update existing preferences
    result = await supabase
      .from('user_preferences')
      .update({ 
        ...preferences,
        updated_at: new Date().toISOString() 
      })
      .eq('id', existingPrefs.id)
      .select()
      .single();
  } else {
    // Insert new preferences
    result = await supabase
      .from('user_preferences')
      .insert([{ 
        user_id: user.id,
        ...preferences
      }])
      .select()
      .single();
  }
  
  if (result.error) {
    console.error('Error saving user preferences:', result.error);
    return null;
  }
  
  return result.data as UserPreferences;
}

/**
 * Log user action for analytics
 * @param action Action performed
 * @param resourceType Type of resource (table name)
 * @param resourceId ID of the resource
 * @param details Additional details about the action
 */
async function logUserAction(
  action: string,
  resourceType?: string,
  resourceId?: string,
  details: Record<string, unknown> = {}
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  
  const { error } = await supabase
    .from('usage_logs')
    .insert([{
      user_id: user.id,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details
    }]);
  
  if (error) {
    console.error('Error logging user action:', error);
  }
}

/**
 * Initialize database with default content types if they don't exist
 */
async function initializeDatabase(): Promise<void> {
  // Check if content types already exist
  const { count, error } = await supabase
    .from('content_types')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error checking content types:', error);
    return;
  }
  
  // If content types already exist, don't add defaults
  if (count && count > 0) return;
  
  // Default content types
  const defaultContentTypes = [
    {
      name: 'Service Brochures',
      description: 'Generate professional service descriptions to showcase your rebranding expertise.',
      category: 'branding',
      has_multiple_days: false,
      total_days: 1,
      export_options: ['pdf', 'pptx', 'docx']
    },
    {
      name: 'Detailed Case Studies',
      description: 'Create persuasive case studies highlighting successful rebranding projects.',
      category: 'sales',
      has_multiple_days: false,
      total_days: 1,
      export_options: ['pdf', 'pptx', 'docx']
    },
    {
      name: 'Comprehensive Pricing Sheets',
      description: 'Build comprehensive pricing documents with packages and value propositions.',
      category: 'sales',
      has_multiple_days: false,
      total_days: 1,
      export_options: ['pdf', 'xlsx']
    },
    {
      name: 'Complete Email Sequences',
      description: 'Create 14-day email sequences to nurture leads and drive conversions.',
      category: 'marketing',
      has_multiple_days: true,
      total_days: 14,
      export_options: ['pdf', 'docx']
    },
    {
      name: 'Interactive Lead Magnets',
      description: 'Generate valuable lead magnets to attract and capture potential clients.',
      category: 'marketing',
      has_multiple_days: false,
      total_days: 1,
      export_options: ['pdf', 'pptx']
    },
    {
      name: 'Social Media Marketing Kits',
      description: 'Create 14 days of social media content for multiple platforms.',
      category: 'digital',
      has_multiple_days: true,
      total_days: 14,
      export_options: ['pdf', 'docx']
    },
    {
      name: 'Detailed Strategic Roadmaps',
      description: 'Build detailed project roadmaps to guide clients through the rebranding process.',
      category: 'strategy',
      has_multiple_days: false,
      total_days: 1,
      export_options: ['pdf', 'pptx']
    },
    {
      name: 'Brand Audit Reports',
      description: 'Create comprehensive brand audit templates to analyze brand performance.',
      category: 'research',
      has_multiple_days: false,
      total_days: 1,
      export_options: ['pdf', 'docx']
    },
    {
      name: 'Competitor Analysis Frameworks',
      description: 'Develop frameworks to analyze competitors and identify market opportunities.',
      category: 'research',
      has_multiple_days: false,
      total_days: 1,
      export_options: ['pdf', 'pptx', 'xlsx']
    },
    {
      name: 'Video Script Templates',
      description: 'Create professional scripts for explainer videos, testimonials, and brand stories.',
      category: 'digital',
      has_multiple_days: false,
      total_days: 1,
      export_options: ['pdf', 'docx']
    },
    {
      name: 'Sales Presentation Decks',
      description: 'Generate compelling sales presentation slides with key talking points.',
      category: 'sales',
      has_multiple_days: false,
      total_days: 1,
      export_options: ['pptx', 'pdf']
    },
    {
      name: 'Client Onboarding Guides',
      description: 'Create comprehensive guides to smoothly transition new clients into your services.',
      category: 'strategy',
      has_multiple_days: false,
      total_days: 1,
      export_options: ['pdf', 'docx']
    },
    {
      name: 'Brand Messaging Frameworks',
      description: 'Develop strategic messaging frameworks including mission, vision and value propositions.',
      category: 'branding',
      has_multiple_days: false,
      total_days: 1,
      export_options: ['pdf', 'pptx']
    },
    {
      name: 'SEO Content Plans',
      description: 'Build comprehensive SEO-optimized content strategies with topics and keywords.',
      category: 'digital',
      has_multiple_days: false,
      total_days: 1,
      export_options: ['pdf', 'xlsx']
    },
    {
      name: 'PR Campaign Materials',
      description: 'Create press releases, media kits, and campaign briefs for public relations.',
      category: 'marketing',
      has_multiple_days: false,
      total_days: 1,
      export_options: ['pdf', 'docx']
    }
  ];
  
  // Insert default content types
  const { error: insertError } = await supabase
    .from('content_types')
    .insert(defaultContentTypes);
  
  if (insertError) {
    console.error('Error inserting default content types:', insertError);
  } else {
    console.log('Default content types initialized successfully');
  }
}