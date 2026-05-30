import { corsHeaders } from '../_shared/cors.ts';

interface FileInput {
  url?: string;
  filename?: string;
  file_data?: string;
  type?: string;
}

interface Tool {
  type: 'function';
  name?: string;
  parameters?: Record<string, unknown>;
}

interface WebSearchTool extends Tool {
  type: 'web_search';
  filters?: {
    type?: 'exact' | 'substring';
  };
}

interface ImageGenerationTool extends Tool {
  type: 'image_generation';
  model?: string;
  quality?: 'low' | 'medium' | 'high' | 'auto';
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | 'auto';
  style?: 'vivid' | 'natural';
}

type ReasoningEffort = 'low' | 'medium' | 'high';

interface GPT5RequestPayload {
  messages?: Array<{ role: string; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }>;
  input?: string;
  model?: "gpt-5" | "gpt-5-mini" | "gpt-5-nano" | "gpt-4o" | "gpt-4o-mini" | "gpt-4-turbo" | "gpt-3.5-turbo" | "o1" | "o1-mini" | "o3" | "o3-mini";
  reasoning_effort?: ReasoningEffort;
  tools?: Array<WebSearchTool | ImageGenerationTool>;
  tool_choice?: 'auto' | 'required' | 'none' | { type: 'specific'; name: string };
  temperature?: number;
  max_output_tokens?: number;
  top_p?: number;
  stream?: boolean;
  instructions?: string;
  previous_response_id?: string;
  store?: boolean;
  metadata?: Record<string, string>;
  files?: FileInput[];
  tenant_id?: string;
  user_id?: string;
  session_id?: string;
  save_response?: boolean;
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

async function saveToSupabase(
  tableName: string,
  data: Record<string, unknown>
): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('Supabase credentials not configured, skipping database save');
    return;
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.error(`Failed to save to Supabase: ${response.status} ${response.statusText}`);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY') || '';
    
    const payload: GPT5RequestPayload = await req.json();
    const {
      messages,
      input,
      model,
      reasoning_effort,
      tools,
      tool_choice,
      temperature,
      max_output_tokens,
      top_p,
      stream,
      instructions,
      previous_response_id,
      store,
      metadata,
      files,
      tenant_id,
      user_id,
      session_id,
      save_response,
    } = payload;

    const selectedModel = model || 'gpt-5-mini';

    let openaiInput: any;
    if (messages && Array.isArray(messages)) {
      openaiInput = messages.map((msg: any) => {
        if (typeof msg.content === 'string') {
          return msg;
        }
        return msg;
      });
    } else if (input) {
      openaiInput = [{ role: "user", content: input }];
    } else if (files && Array.isArray(files)) {
      openaiInput = files.map((file: FileInput) => {
        if (file.url) {
          return {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: file.url },
              },
              {
                type: 'text',
                text: `Analyze this image: ${file.filename || 'uploaded image'}`,
              },
            ],
          };
        }
        return {
          role: 'user',
          content: [
            {
              type: 'file',
              file: {
                filename: file.filename,
                file_data: file.file_data,
              },
            },
            {
              type: 'text',
              text: `Analyze this file: ${file.filename || 'uploaded file'}`,
            },
          ],
        };
      });
    } else {
      return new Response(
        JSON.stringify({ error: 'Either messages, input, or files must be provided' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Calling OpenAI Responses API with model: ${selectedModel}`);

    const { OpenAI } = await import('npm:openai@latest');
    const openai = new OpenAI({ apiKey: openaiApiKey });

    const requestParams: any = {
      model: selectedModel,
      input: openaiInput,
    };

    if (reasoning_effort) {
      requestParams.reasoning = { effort: reasoning_effort };
    }

    if (tools && Array.isArray(tools) && tools.length > 0) {
      requestParams.tools = tools;
    }

    if (tool_choice) {
      requestParams.tool_choice = tool_choice;
    }

    if (temperature !== undefined) {
      requestParams.temperature = temperature;
    }

    if (max_output_tokens) {
      requestParams.max_output_tokens = max_output_tokens;
    }

    if (top_p !== undefined) {
      requestParams.top_p = top_p;
    }

    if (instructions) {
      requestParams.instructions = instructions;
    }

    if (previous_response_id) {
      requestParams.previous_response_id = previous_response_id;
    }

    if (store !== undefined) {
      requestParams.store = store;
    }

    if (metadata) {
      requestParams.metadata = metadata;
    }

    let actualModelUsed = selectedModel;
    let fallbackNote: string | undefined;
    let apiResponse: any;

    try {
      if (stream) {
        return new Response(
          new ReadableStream({
            async start(controller) {
              try {
                const streamResponse = await openai.responses.stream(requestParams);
                
                for await (const chunk of streamResponse) {
                  controller.enqueue(new TextEncoder().encode(JSON.stringify(chunk) + '\n'));
                }
                
                controller.close();
              } catch (streamError: any) {
                controller.error(streamError);
                controller.close();
              }
            },
          }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
            },
          }
        );
      }

      apiResponse = await openai.responses.create(requestParams);

      if (!apiResponse || !apiResponse.output_text && !apiResponse.output) {
        throw new Error('Empty response from OpenAI Responses API');
      }

    } catch (responsesError: any) {
      console.log(`Responses API error: ${responsesError.message}. Trying Chat Completions API...`);

      const fallbackMap: Record<string, string> = {
        'gpt-5': 'gpt-4o',
        'gpt-5-mini': 'gpt-4o-mini',
        'gpt-5-nano': 'gpt-4o-mini',
        'o1': 'gpt-4o',
        'o1-mini': 'gpt-4o-mini',
        'o3': 'gpt-4-turbo',
        'o3-mini': 'gpt-4o-mini',
      };

      actualModelUsed = fallbackMap[selectedModel] || selectedModel;
      fallbackNote = `Requested ${selectedModel} not available, using ${actualModelUsed}`;

      const chatPayload: any = {
        model: actualModelUsed,
        messages: openaiInput,
      };

      if (temperature !== undefined) {
        chatPayload.temperature = temperature;
      }

      if (max_output_tokens) {
        chatPayload.max_tokens = max_output_tokens;
      }

      if (top_p !== undefined) {
        chatPayload.top_p = top_p;
      }

      const chatResponse = await openai.chat.completions.create(chatPayload);

      if (!chatResponse || !chatResponse.choices || chatResponse.choices.length === 0) {
        throw new Error('Empty response from OpenAI Chat Completions API');
      }

      apiResponse = {
        output_text: chatResponse.choices[0].message.content || '',
        id: chatResponse.id,
        model: actualModelUsed,
        output: [{
          type: 'message',
          content: [{
            type: 'text',
            text: chatResponse.choices[0].message.content || '',
          }],
        }],
      };
    }

    if (save_response && tenant_id && user_id) {
      const responseData = {
        tenant_id,
        user_id,
        session_id,
        model: actualModelUsed,
        input: openaiInput,
        output: apiResponse,
        created_at: new Date().toISOString(),
        metadata: metadata || {},
      };

      try {
        await saveToSupabase('openai_responses', responseData);
      } catch (saveError) {
        console.error('Failed to save response to Supabase:', saveError);
      }
    }

    const responseText = apiResponse.output_text || 
      (apiResponse.output?.find((o: any) => o.type === 'text' || o.type === 'message')?.content?.[0]?.text) ||
      JSON.stringify(apiResponse.output || []);

    return new Response(
      JSON.stringify({
        model: actualModelUsed,
        text: responseText,
        output: apiResponse.output,
        id: apiResponse.id,
        usage: apiResponse.usage,
        fallback_note: fallbackNote,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

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