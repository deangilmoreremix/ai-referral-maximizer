import { corsHeaders } from '../_shared/cors.ts';

interface GPT5RequestPayload {
  messages?: Array<{ role: string; content: string }>;
  input?: string;
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
    const { messages, input, model }: GPT5RequestPayload = await req.json();
    const selectedModel = model || 'gpt-5'; // Default to gpt-5

    // Prepare the input for OpenAI
    let openaiInput: any;
    if (messages && Array.isArray(messages)) {
      openaiInput = messages.map(m => m.content).join('\n\n');
    } else if (input) {
      openaiInput = input;
    } else {
      return new Response(
        JSON.stringify({ error: 'Either messages or input must be provided' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Calling OpenAI with model: ${selectedModel}`);

    // Import OpenAI client dynamically for Deno environment
    const { OpenAI } = await import('npm:openai@latest');
    const openai = new OpenAI({ apiKey: openaiApiKey });

    // Use the Chat Completions API for GPT models
    const response = await openai.chat.completions.create({
      model: selectedModel,
      messages: [
        {
          role: "user",
          content: openaiInput
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    if (!response || !response.choices || response.choices.length === 0) {
      throw new Error('Empty response from OpenAI');
    }

    const text = response.choices[0].message.content || '';

    if (!text) {
      throw new Error('No text generated from OpenAI API');
    }

    return new Response(
      JSON.stringify({
        model: selectedModel,
        actual_model_used: selectedModel, // Now directly using the requested model
        text,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in OpenAI GPT-5 function:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});