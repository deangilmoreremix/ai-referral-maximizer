import { corsHeaders } from '../_shared/cors.ts';

interface GPT5RequestPayload {
  messages?: Array<{ role: string; content: string }>;
  input?: string;
  model?: "gpt-5" | "gpt-5-mini" | "gpt-5-nano" | "gpt-4o" | "gpt-4o-mini" | "gpt-4-turbo" | "gpt-3.5-turbo";
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
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

    const { messages, input, model }: GPT5RequestPayload = await req.json();
    const selectedModel = model || 'gpt-5-mini';

    let openaiInput: any;
    if (messages && Array.isArray(messages)) {
      openaiInput = messages;
    } else if (input) {
      openaiInput = [{ role: "user", content: input }];
    } else {
      return new Response(
        JSON.stringify({ error: 'Either messages or input must be provided' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Calling OpenAI Responses API with model: ${selectedModel}`);

    const { OpenAI } = await import('npm:openai@latest');
    const openai = new OpenAI({ apiKey: openaiApiKey });

    let actualModelUsed = selectedModel;
    let fallbackNote;

    try {
      const response = await openai.responses.create({
        model: selectedModel,
        input: openaiInput
      });

      if (!response || !response.output_text) {
        throw new Error('Empty response from OpenAI Responses API');
      }

      return new Response(
        JSON.stringify({
          model: actualModelUsed,
          text: response.output_text,
          fallback_note: fallbackNote
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );

    } catch (responsesError: any) {
      console.log(`Responses API error: ${responsesError.message}. Trying Chat Completions API...`);

      const fallbackMap: Record<string, string> = {
        'gpt-5': 'gpt-4o',
        'gpt-5-mini': 'gpt-4o-mini',
        'gpt-5-nano': 'gpt-4o-mini'
      };

      actualModelUsed = fallbackMap[selectedModel] || selectedModel;
      fallbackNote = `Requested ${selectedModel} not available, using ${actualModelUsed}`;

      const chatResponse = await openai.chat.completions.create({
        model: actualModelUsed,
        messages: openaiInput,
        temperature: 0.7,
        max_tokens: 4000
      });

      if (!chatResponse || !chatResponse.choices || chatResponse.choices.length === 0) {
        throw new Error('Empty response from OpenAI Chat Completions API');
      }

      const text = chatResponse.choices[0].message.content || '';

      return new Response(
        JSON.stringify({
          model: actualModelUsed,
          text: text,
          fallback_note: fallbackNote
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

  } catch (error: any) {
    console.error('Error in OpenAI GPT-5 function:', error);

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