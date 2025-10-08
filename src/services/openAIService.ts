import { OpenAIModel, GPT5RequestPayload } from '../types/openai';
import { getOptimalModelForContent } from '../../lib/openai';

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "YOUR_OPENAI_API_KEY";

interface ContentRequest {
  contentType: string;
  industry?: string;
  targetAudience?: string;
  businessSize?: string;
  specialRequirements?: string;
  analysisData?: any;
  originalContent?: string;
  revisionInstructions?: string;
  isRevision?: boolean;
  model?: OpenAIModel;
  relationshipType?: string;
}

export async function generateContent(request: ContentRequest): Promise<string> {
  try {
    // Use cost-optimized model selection if no specific model requested
    const modelId = request.model || getOptimalModelForContent(request.contentType, 'medium');
    
    console.log("Generating content with OpenAI request:", {
      contentType: request.contentType,
      hasIndustry: !!request.industry,
      hasTargetAudience: !!request.targetAudience,
      hasAnalysisData: !!request.analysisData,
      isRevision: !!request.isRevision,
      model: modelId,
      hasRelationshipType: !!request.relationshipType
    });
    
    // Try Edge Function first, fall back to client-side if it fails
    try {
      return await generateWithEdgeFunction(request, modelId);
    } catch (edgeError: any) {
      console.warn('Edge Function failed, trying client-side API:', edgeError.message);
      return await generateWithClientAPI(request, modelId);
    }
  } catch (error) {
    console.error("Error generating content:", error);
    // Always return some content, never throw - this prevents UI breaking
    return "Failed to generate content. Please try again later.\n\nIf this problem persists, check your OpenAI API key configuration or network connection.";
  }
}

async function generateWithEdgeFunction(request: ContentRequest, modelId: OpenAIModel): Promise<string> {
  try {
    console.log("Generating content using Edge Function");
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration is missing');
    }
    
    const prompt = request.isRevision 
      ? createRevisionPrompt(request)
      : createPrompt(request);
    
    const apiUrl = `${supabaseUrl}/functions/v1/openai-gpt5`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: prompt,
        model: modelId
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.text) {
      throw new Error('No content returned from API');
    }
    
    // Log any fallback information
    if (data.fallback_note) {
      console.warn('Model fallback:', data.fallback_note);
    }
    
    return data.text;
  } catch (error: any) {
    console.error("Edge function error:", error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}

async function generateWithClientAPI(request: ContentRequest, modelId: OpenAIModel): Promise<string> {
  // Validate API key
  if (!API_KEY || API_KEY === "YOUR_OPENAI_API_KEY") {
    throw new Error("OpenAI API key not configured");
  }

  const prompt = request.isRevision
    ? createRevisionPrompt(request)
    : createPrompt(request);

  console.log("Prompt created, sending to OpenAI Responses API...");

  try {
    // Import OpenAI client dynamically for client-side
    const { OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

    // Use the Responses API for GPT-5 models
    const response = await openai.responses.create({
      model: modelId,
      input: [{ role: "user", content: prompt }]
    });

    if (!response || !response.output_text) {
      throw new Error('Empty response from OpenAI');
    }

    const text = response.output_text;

    if (!text) {
      throw new Error('No text generated from OpenAI Responses API');
    }

    console.log(`Content generated successfully using ${response.model || modelId}`);

    return text;
  } catch (apiError: any) {
    console.error("OpenAI API error:", apiError);

    // Provide helpful error messages
    let errorMessage = apiError?.message || 'Unknown error';
    if (apiError?.status === 401) {
      errorMessage = 'Invalid OpenAI API key. Please check your configuration.';
    } else if (apiError?.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again in a moment.';
    } else if (apiError?.status === 404) {
      errorMessage = 'Model not available. The API endpoint or model may not exist.';
    }

    throw new Error(`OpenAI API error: ${errorMessage}`);
  }
}

function createPrompt(request: ContentRequest): string {
  const { contentType, industry, targetAudience, businessSize, specialRequirements, analysisData } = request;
  
  let prompt = `Generate a professional, well-structured ${contentType}.\n\n`;
  
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
  
  if (analysisData) {
    prompt += `Use the following analysis data for context:\n${JSON.stringify(analysisData, null, 2)}\n\n`;
  }
  
  if (request.relationshipType) {
    prompt += `Relationship Context: ${request.relationshipType}\n\n`;
  }
  
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
