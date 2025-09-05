// Edge Function service for content generation

interface ContentRequest {
  contentType: string;
  industry?: string;
  targetAudience?: string;
  businessSize?: string;
  specialRequirements?: string;
  model: "gemini-2.5-pro" | "gemini-2.0-flash" | "gemini-2.0-flash-light";
  analysisData?: any; // Document analysis data
  originalContent?: string; // For revisions
  revisionInstructions?: string; // For revisions
  isRevision?: boolean; // Indicates if this is a revision request
}

interface ContentResponse {
  content: string;
  model: string;
}

/**
 * Generate content using Supabase Edge Function
 */
export async function generateContentWithEdgeFunction(
  request: ContentRequest
): Promise<ContentResponse> {
  try {
    console.log(`Generating content using Edge Function for: ${request.contentType}`);
    
    // Check if Supabase URL is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    // Improved validation to check for actual valid Supabase URL pattern
    // Look for the pattern: https://{project-id}.supabase.co
    const validSupabaseUrlPattern = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i;
    
    if (!supabaseUrl || !validSupabaseUrlPattern.test(supabaseUrl)) {
      console.error('Invalid Supabase URL:', supabaseUrl);
      throw new Error('Supabase URL is not properly configured. URL must match pattern: https://{project-id}.supabase.co');
    }
    
    // Check if Supabase anon key is available
    if (!supabaseAnonKey) {
      throw new Error('Supabase anonymous key is not defined in environment variables');
    }
    
    // Check if API key is available
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key is not defined in environment variables');
    }
    
    console.log('SUPABASE_URL:', supabaseUrl);
    console.log('Supabase anon key available:', !!supabaseAnonKey);
    console.log('Gemini API Key available:', !!import.meta.env.VITE_GEMINI_API_KEY);
    console.log('Selected model:', request.model);
    
    const apiUrl = `${supabaseUrl}/functions/v1/generate-content`;
    console.log('Calling Edge Function with URL:', apiUrl);
    
    // IMPORTANT: Use the Supabase anon key for the Authorization header
    // The Gemini API key will be sent in the request body or passed in headers
    const headers = {
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'x-gemini-api-key': import.meta.env.VITE_GEMINI_API_KEY // Pass API key in a custom header
    };
    
    // Debug: Log the headers being sent (without showing the actual API keys)
    console.log('Headers being sent:', {
      'Authorization': 'Bearer ****' + (supabaseAnonKey?.slice(-4) || ''),
      'Content-Type': headers['Content-Type'],
      'x-gemini-api-key': '****' + (import.meta.env.VITE_GEMINI_API_KEY?.slice(-4) || '')
    });
    
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    console.log('Sending request to generate-content edge function...');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('Edge Function response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = `Server responded with ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
        console.error('Error data from server:', errorData);
      } catch (e) {
        console.error('Could not parse error response as JSON');
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Content generation successful, content length:', data?.content?.length || 0);
    
    // Validate the response content
    if (!data || !data.content) {
      throw new Error('Invalid response from server: content is missing');
    }
    
    return data;
  } catch (error: any) {
    console.error("Error generating content with edge function:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
    // Return a fallback response with the error message
    return {
      content: `${request.isRevision ? "We couldn't revise your content." : "We couldn't generate the content."} Please try again. If this persists, try using the Client API option instead.`,
      model: request.model
    };
  }
}

/**
 * Get available Gemini models
 */
function getAvailableModels() {
  return [
    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", description: "Most powerful model with advanced reasoning" },
    { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", description: "Fast and efficient for most content needs" },
    { id: "gemini-2.0-flash-light", name: "Gemini 2.0 Flash Light", description: "Lightweight model for simple content" }
  ];
}