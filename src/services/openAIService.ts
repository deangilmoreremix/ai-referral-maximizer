import { OpenAIModel, GPT5RequestPayload } from '../types/openai';

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
    const modelId = request.model || "gpt-5";
    
    console.log("Generating content with OpenAI request:", {
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
    return getFallbackContent(request.contentType);
  }
}

async function generateWithClientAPI(request: ContentRequest, modelId: OpenAIModel): Promise<string> {
  // Validate API key
  if (!API_KEY || API_KEY === "YOUR_OPENAI_API_KEY") {
    console.warn("No valid OpenAI API key found. Using fallback content.");
    return getFallbackContent(request.contentType);
  }
  
  const prompt = request.isRevision 
    ? createRevisionPrompt(request)
    : createPrompt(request);
  
  console.log("Prompt created, sending to OpenAI API...");
  
  try {
    // Direct OpenAI API call using Responses API
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelId,
        input: prompt
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'API request failed');
    }
    
    const data = await response.json();
    // @ts-ignore - output_text is a Responses API convenience
    const text = data.output_text || '';
    
    if (!text) {
      throw new Error('Empty response from OpenAI API');
    }
    
    return text;
  } catch (apiError) {
    console.error("OpenAI API error:", apiError);
    return getFallbackContent(request.contentType);
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

function getFallbackContent(contentType: string): string {
  return `[DEMO ${contentType.toUpperCase()} CONTENT]

This is demonstration content created when the OpenAI API service is unavailable.

In a real implementation with a working API key, this would contain professionally generated ${contentType} based on your specifications.

To generate real content:
1. Ensure you have a valid OpenAI API key configured in your environment variables
2. Check your network connection
3. Try again or contact support if the issue persists

[END OF DEMO CONTENT]`;
}