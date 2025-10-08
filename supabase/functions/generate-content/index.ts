import { corsHeaders } from '../_shared/cors.ts';

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
  model?: string;
  relationshipType?: string;
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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const geminiApiKey = req.headers.get('x-gemini-api-key');
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing Gemini API key in headers' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const request: ContentRequest = await req.json();

    if (!request.contentType) {
      return new Response(
        JSON.stringify({ error: 'contentType is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const modelId = req.headers.get('x-model-id') || 'gemini-2.0-flash-exp';

    const modelMapping: Record<string, string> = {
      'gemini-2.5-pro': 'gemini-1.5-pro',
      'gemini-2.0-flash': 'gemini-1.5-flash',
      'gemini-2.0-flash-light': 'gemini-1.5-flash-8b',
      'gemini-2.0-flash-exp': 'gemini-2.0-flash-exp'
    };

    const modelName = modelMapping[modelId] || 'gemini-2.0-flash-exp';

    console.log(`Generating content with Gemini model: ${modelName}`);

    const prompt = request.isRevision
      ? createRevisionPrompt(request)
      : createPrompt(request);

    const { GoogleGenerativeAI } = await import('npm:@google/generative-ai@latest');
    const genAI = new GoogleGenerativeAI(geminiApiKey);

    const model = genAI.getGenerativeModel({ model: modelName });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text || text.trim() === '') {
      throw new Error('Empty response from Gemini API');
    }

    console.log(`Generated content successfully, length: ${text.length}`);

    return new Response(
      JSON.stringify({
        content: text,
        model: modelName,
        contentType: request.contentType
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in generate-content function:', error);

    let statusCode = 500;
    let errorMessage = error.message || 'Internal server error';
    
    if (error.message?.includes('API_KEY') || error.message?.includes('API key')) {
      statusCode = 401;
      errorMessage = 'Invalid or missing Gemini API key. Please check your API key configuration.';
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      statusCode = 429;
      errorMessage = 'API rate limit exceeded. Please try again later.';
    } else if (error.message?.includes('not found') || error.message?.includes('404')) {
      statusCode = 400;
      errorMessage = 'The requested AI model is not available. Please try a different model.';
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: error.message
      }),
      {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});