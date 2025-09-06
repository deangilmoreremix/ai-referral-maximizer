import { corsHeaders } from '../_shared/cors.ts';

interface ImageRequest {
  prompt: string;
  model?: 'dall-e-3' | 'dall-e-2';
  size?: '1024x1024' | '1792x1024' | '1024x1792';
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Check for OpenAI API key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing OPENAI_API_KEY environment variable' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const { prompt, model = 'dall-e-3', size = '1024x1024' }: ImageRequest = await req.json();

    if (!prompt || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Generating image with ${model}, size: ${size}`);

    // Import OpenAI client dynamically for Deno environment
    const { OpenAI } = await import('npm:openai@latest');
    const openai = new OpenAI({ apiKey: openaiApiKey });

    // Generate image using DALL-E
    const response = await openai.images.generate({
      model: model,
      prompt: prompt.trim(),
      size: size,
      quality: 'standard',
      n: 1,
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No image data returned from DALL-E');
    }

    const imageUrl = response.data[0].url;

    if (!imageUrl) {
      throw new Error('No image URL returned from DALL-E');
    }

    return new Response(
      JSON.stringify({
        imageUrl,
        model,
        size,
        prompt: prompt.trim()
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in OpenAI Images function:', error);

    // Handle specific error types
    let statusCode = 500;
    if (error.status === 401) {
      statusCode = 401;
    } else if (error.status === 429) {
      statusCode = 429;
    } else if (error.status >= 500) {
      statusCode = error.status;
    }

    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
      }),
      {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});