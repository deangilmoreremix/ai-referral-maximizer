import { corsHeaders } from '../_shared/cors.ts';

interface ImageEditRequest {
  prompt: string;
  imageUrl?: string;
  imageBase64?: string;
  model?: string;
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
    // Get Gemini API key from headers
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

    // Parse request body
    const { prompt, imageUrl, imageBase64, model = 'gemini-2.0-flash-exp' }: ImageEditRequest = await req.json();

    if (!prompt || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Editing image with Gemini model: ${model}`);

    // Import Google Generative AI
    const { GoogleGenerativeAI } = await import('npm:@google/generative-ai@latest');
    const genAI = new GoogleGenerativeAI(geminiApiKey);

    const modelInstance = genAI.getGenerativeModel({ model: model });

    let imagePart;

    if (imageUrl) {
      // Fetch image from URL
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error('Failed to fetch image from URL');
      }
      const imageBuffer = await imageResponse.arrayBuffer();
      const imageBase64Data = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
      const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

      imagePart = {
        inlineData: {
          data: imageBase64Data,
          mimeType: mimeType,
        },
      };
    } else if (imageBase64) {
      // Use provided base64
      imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/jpeg', // Assume JPEG, could be detected
        },
      };
    }

    // Create the content parts
    const parts: any[] = [];
    if (imagePart) {
      parts.push(imagePart);
    }
    parts.push({ text: prompt.trim() });

    // Generate edited image
    const result = await modelInstance.generateContent({
      contents: [{ role: 'user', parts }],
    });

    const response = await result.response;
    const text = response.text();

    // For image generation, Gemini returns a description, not the actual image
    // We need to handle this differently - perhaps return the description
    // or use a different approach for actual image generation

    if (!text || text.trim() === '') {
      throw new Error('Empty response from Gemini API');
    }

    return new Response(
      JSON.stringify({
        description: text,
        model,
        prompt: prompt.trim(),
        hasImage: !!imagePart
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in Gemini Images function:', error);

    let statusCode = 500;
    if (error.message?.includes('API_KEY')) {
      statusCode = 401;
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      statusCode = 429;
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