import { GoogleGenerativeAI } from "@google/generative-ai";

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY"; 

// Define supported models
const MODELS = {
  "gemini-2.5-pro": "gemini-1.5-pro",
  "gemini-2.0-flash": "gemini-1.5-flash",
  "gemini-2.0-flash-light": "gemini-1.5-flash-8b",
  "gemini-2.0-flash-exp": "gemini-2.0-flash-exp"
};

interface ContentRequest {
  contentType: string;
  industry?: string;
  targetAudience?: string;
  businessSize?: string;
  specialRequirements?: string;
  analysisData?: any; // Document analysis data
  originalContent?: string; // For revisions
  revisionInstructions?: string; // For revisions
  isRevision?: boolean; // Indicates if this is a revision request
  model?: string; // The model to use
  relationshipType?: string; // The relationship type for context
}

export async function generateContent(request: ContentRequest): Promise<string> {
  try {
    // Set default model if not specified
    const modelId = request.model || "gemini-2.0-flash-exp";
    
    console.log("Generating content with request:", {
      contentType: request.contentType,
      hasIndustry: !!request.industry,
      hasTargetAudience: !!request.targetAudience,
      hasAnalysisData: !!request.analysisData,
      isRevision: !!request.isRevision,
      model: modelId,
      hasRelationshipType: !!request.relationshipType
    });
    
    // Check if we should use edge function or client-side API
    const useEdgeFunction = true; // Default to edge function for security
    
    if (useEdgeFunction) {
      return await generateWithEdgeFunction(request, modelId);
    } else {
      return await generateWithClientAPI(request, modelId);
    }
  } catch (error: any) {
    console.error("Error generating content:", error);
    throw new Error(`Failed to generate content: ${error?.message || 'Unknown error'}`);
  }
}

async function generateWithClientAPI(request: ContentRequest, modelId: string): Promise<string> {
  // Validate API key
  if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY") {
    throw new Error("Gemini API key not configured");
  }
  
  const prompt = request.isRevision 
    ? createRevisionPrompt(request)
    : createPrompt(request);
  
  console.log("Prompt created, sending to Gemini API...");
  
  // Initialize the Google Generative AI with your API key
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  // Map the model ID to the actual model name
  const modelName = MODELS[modelId as keyof typeof MODELS] || "gemini-2.0-flash-exp";
  console.log(`Using Gemini model: ${modelName}`);
  
  const model = genAI.getGenerativeModel({ model: modelName });
    
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Received response from Gemini API, length:", text.length);
    
    // Verify we got a valid response
    if (!text || text.trim() === '') {
      console.error("Empty response from Gemini API");
      throw new Error("Empty response from Gemini API");
    }
    
    return text;
  } catch (apiError: any) {
    console.error("Gemini API error:", apiError);
    throw new Error(`Gemini API error: ${apiError?.message || 'Unknown error'}`);
  }
}

async function generateWithEdgeFunction(request: ContentRequest, modelId: string): Promise<string> {
  try {
    console.log("Generating content using Edge Function");
    
    // Check if Supabase URL is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    // Improved validation to check for actual valid Supabase URL pattern
    const validSupabaseUrlPattern = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i;
    
    if (!supabaseUrl || !validSupabaseUrlPattern.test(supabaseUrl)) {
      console.error('Invalid Supabase URL:', supabaseUrl);
      throw new Error('Supabase URL is not properly configured');
    }
    
    // Check if Supabase anon key is available
    if (!supabaseAnonKey) {
      throw new Error('Supabase anonymous key is not defined in environment variables');
    }
    
    // Check if API key is available
    if (!API_KEY) {
      throw new Error('Gemini API key is not defined in environment variables');
    }
    
    console.log('SUPABASE_URL:', supabaseUrl);
    console.log('Supabase anon key available:', !!supabaseAnonKey);
    console.log('Gemini API Key available:', !!API_KEY);
    console.log('Selected model:', modelId);
    
    // Updated to use the generate-content endpoint instead of save-content
    const apiUrl = `${supabaseUrl}/functions/v1/generate-content`;
    console.log('Calling Edge Function with URL:', apiUrl);
    
    // Add relationshipType to the request headers
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'x-gemini-api-key': API_KEY,
      'x-model-id': modelId
    };
    
    // Add relationship type to headers if present
    if (request.relationshipType) {
      headers['x-relationship-type'] = request.relationshipType;
    }
    
    // Set timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    console.log('Sending request to edge function');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Edge function error (${response.status}):`, errorText);
      throw new Error(`Edge function error: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Edge function response received, length:', result.content?.length || 0);
    
    if (!result.content) {
      throw new Error('Edge function returned empty content');
    }
    
    return result.content;
  } catch (error: any) {
    console.error('Edge function error:', error);
    if (error?.name === 'AbortError') {
      throw new Error("Request timed out. The content generation is taking longer than expected. Please try again later or choose a different model.");
    }

    // Extract more useful error information
    let errorMessage = error?.message || 'Unknown error';

    // Check if this is a fetch error
    if (errorMessage.includes('fetch')) {
      errorMessage = 'Unable to connect to the content generation service. Please check your internet connection.';
    } else if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      errorMessage = 'The AI model is not available. Please try selecting a different model from the settings.';
    } else if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
      errorMessage = 'Invalid API key. Please check your Gemini API key in the settings.';
    } else if (errorMessage.includes('429')) {
      errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
    }

    throw new Error(errorMessage);
  }
}

function createPrompt(request: ContentRequest): string {
  const { contentType, industry, targetAudience, businessSize, specialRequirements, analysisData } = request;
  
  let prompt = `Generate a professional, well-structured ${contentType}.\n\n`;
  
  // Add personalization if available
  if (industry) {
    prompt += `Industry: ${industry}\n`;
  }
  
  if (targetAudience) {
    prompt += `Target Audience: ${targetAudience}\n`;
  }
  
  if (businessSize) {
    prompt += `Business Size: ${businessSize}\n`;
  }
  
  if (specialRequirements) {
    prompt += `Special Requirements/Details: ${specialRequirements}\n\n`;
  }
  
  // Add analysis data for context if available
  if (analysisData) {
    prompt += `Use the following analysis data for context:\n${JSON.stringify(analysisData, null, 2)}\n\n`;
  }
  
  // Add relationship context if available
  if (request.relationshipType) {
    prompt += `Relationship Context: ${request.relationshipType}\n\n`;
  }
  
  // Additional instructions for quality
  prompt += `The content should be:\n- Professional and polished\n- Specific and actionable\n- Using best practices for this type of content\n- Ready to use without further editing`;
  
  return prompt;
}

function createRevisionPrompt(request: ContentRequest): string {
  const { contentType, revisionInstructions, originalContent } = request;
  
  if (!originalContent || !revisionInstructions) {
    return createPrompt(request);
  }
  
  let prompt = `Revise the following ${contentType} according to these instructions:\n\n`;
  prompt += `Revision Instructions: ${revisionInstructions}\n\n`;
  prompt += `Original Content:\n${originalContent}\n\n`;
  prompt += `Make specific improvements based on the instructions while maintaining the original intent and structure where appropriate. Return only the revised content without explanations or notes.`;
  
  return prompt;
}
