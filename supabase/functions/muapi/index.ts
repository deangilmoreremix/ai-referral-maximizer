import { corsHeaders } from '../_shared/cors.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

interface ImageRequest {
  prompt: string;
  model?: 'gpt-image' | 'dall-e-3' | 'dall-e-2';
  size?: '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048';
  quality?: 'low' | 'medium' | 'high';
  background?: 'transparent' | 'opaque';
  style?: 'vivid' | 'natural';
  mask?: string;
  image?: string;
  n?: number;
}

interface InpaintRequest extends ImageRequest {
  image: string;
  mask: string;
}

interface OutpaintRequest extends ImageRequest {
  image: string;
  direction?: 'left' | 'right' | 'up' | 'down' | 'all';
}

interface ConsistencyRequest {
  prompt: string;
  image: string;
  model?: 'gptimage';
  size?: '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048';
  quality?: 'low' | 'medium' | 'high';
  n?: number;
}

interface BatchRequest {
  prompts: string[];
  model?: 'gpt-image' | 'dall-e-3' | 'dall-e-2';
  size?: '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048';
  quality?: 'low' | 'medium' | 'high';
  n?: number;
}

interface HistoryRecord {
  user_id?: string;
  tenant_id?: string;
  prompt: string;
  model: string;
  result_url: string;
  type: 'image' | 'video' | 'batch';
  meta_data?: Record<string, unknown>;
  created_at: string;
}

async function saveToSupabase(tableName: string, data: Record<string, unknown>): Promise<void> {
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

function getAuthenticatedUserId(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || payload.user_id || null;
  } catch {
    return null;
  }
}

function getTenantId(req: Request): string | null {
  const tenantHeader = req.headers.get('x-tenant-id');
  return tenantHeader || null;
}

async function callOpenAIResponses(
  input: string | Array<Record<string, unknown>>,
  tools?: Array<Record<string, unknown>>,
  model: string = 'gpt-4.1',
  previous_response_id?: string
): Promise<any> {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input,
      tools,
      ...(previous_response_id ? { previous_response_id } : {}),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown API error' }));
    throw new Error(errorData.error?.message || `HTTP ${response.status}`);
  }

  return await response.json();
}

async function generateImageWithOpenAI(
  prompt: string,
  model: string = 'gpt-image',
  size: string = '1024x1024',
  quality: string = 'medium',
  background: string = 'opaque',
  style?: string,
  image?: string,
  mask?: string,
  n: number = 1
): Promise<any> {
  const tools = [{
    type: 'image_generation',
    model,
    quality,
    size,
    ...(background === 'transparent' ? { background: 'transparent' } : {}),
    ...(style ? { style } : {}),
    ...(image ? { image, ...(mask ? { mask } : {}) } : {}),
    n,
  }];

  const result = await callOpenAIResponses(prompt, tools);
  return result;
}

function extractImageUrl(response: any): string | null {
  const output = response?.output || [];
  for (const item of output) {
    if (item.type === 'image_generation_call' || item.type === 'image') {
      if (item.result) {
        for (const r of item.result) {
          if (r.url || r.file_id) {
            if (r.file_id) {
              return `https://files.openai.com/file_${r.file_id}`;
            }
            return r.url;
          }
        }
      }
      if (item.url) return item.url;
    }
    if (item.type === 'message' && item.content) {
      for (const c of item.content) {
        if (c.type === 'image' && c.image?.url) {
          return c.image.url;
        }
      }
    }
  }

  const imageUrl = response?.data?.[0]?.url || response?.url;
  return imageUrl || null;
}

interface RequestBody {
  endpoint?: string;
  [key: string]: unknown;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authenticatedUserId = getAuthenticatedUserId(req);
    const tenantId = getTenantId(req);
    const url = new URL(req.url);

    // Handle GET requests for models (no body-based routing)
    if (req.method === 'GET' && url.pathname.endsWith('/models')) {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      const imageModels = data.data?.filter((m: any) =>
        m.id.includes('gpt-image') || m.id.includes('dall-e') || m.id.includes('image')
      ) || [];

      return new Response(JSON.stringify(imageModels), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse body for POST requests - endpoint-based routing
    const parsedBody: RequestBody = req.method === 'POST' ? await req.json() : {};
    const endpoint = parsedBody.endpoint || url.pathname.split('/').pop();

    if (req.method === 'POST' && (endpoint === 'images' || endpoint === 'generate')) {
      const { prompt, model = 'gpt-image', size = '1024x1024', quality = 'medium', background = 'opaque', style, n = 1 } = parsedBody;

      if (!prompt || prompt.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: 'Prompt is required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      console.log(`Muapi: Generating image with model ${model}`);

      const openaiResponse = await generateImageWithOpenAI(
        prompt.trim(),
        model,
        size,
        quality,
        background,
        style,
        undefined,
        undefined,
        n
      );

      const imageUrl = extractImageUrl(openaiResponse);

      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI');
      }

      const result = {
        imageUrl,
        model,
        prompt: prompt.trim(),
        response_id: openaiResponse.id,
      };

      if (authenticatedUserId) {
        await saveToSupabase('generation_history', {
          user_id: authenticatedUserId,
          tenant_id: tenantId,
          prompt: prompt.trim(),
          model,
          result_url: imageUrl,
          type: 'image',
          meta_data: { size, quality, background, style, n },
          created_at: new Date().toISOString(),
        } as HistoryRecord);
      }

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST' && endpoint === 'inpaint') {
      const { prompt, image, mask, model = 'gpt-image', size = '1024x1024', quality = 'medium' } = parsedBody;

      if (!prompt || !image || !mask) {
        return new Response(
          JSON.stringify({ error: 'Prompt, image, and mask are required for inpainting' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      console.log(`Muapi: Inpainting with model ${model}`);

      const openaiResponse = await generateImageWithOpenAI(
        prompt.trim(),
        model,
        size,
        quality,
        'opaque',
        undefined,
        image,
        mask,
        1
      );

      const imageUrl = extractImageUrl(openaiResponse);

      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI');
      }

      const result = {
        imageUrl,
        model,
        prompt: prompt.trim(),
        response_id: openaiResponse.id,
      };

      if (authenticatedUserId) {
        await saveToSupabase('generation_history', {
          user_id: authenticatedUserId,
          tenant_id: tenantId,
          prompt: prompt.trim(),
          model,
          result_url: imageUrl,
          type: 'image',
          meta_data: { size, quality, image, mask, operation: 'inpaint' },
          created_at: new Date().toISOString(),
        } as HistoryRecord);
      }

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST' && endpoint === 'outpaint') {
      const { prompt, image, direction = 'all', model = 'gpt-image', size = '1024x1024', quality = 'medium' } = parsedBody;

      if (!prompt || !image) {
        return new Response(
          JSON.stringify({ error: 'Prompt and image are required for outpainting' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      console.log(`Muapi: Outpainting with model ${model}`);

      const outpaintPrompt = `Extend the image${direction !== 'all' ? ` to the ${direction}` : ''} with: ${prompt}`;

      const openaiResponse = await generateImageWithOpenAI(
        outpaintPrompt.trim(),
        model,
        size,
        quality,
        'opaque',
        undefined,
        image,
        undefined,
        1
      );

      const imageUrl = extractImageUrl(openaiResponse);

      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI');
      }

      const result = {
        imageUrl,
        model,
        prompt: prompt.trim(),
        direction,
        response_id: openaiResponse.id,
      };

      if (authenticatedUserId) {
        await saveToSupabase('generation_history', {
          user_id: authenticatedUserId,
          tenant_id: tenantId,
          prompt: prompt.trim(),
          model,
          result_url: imageUrl,
          type: 'image',
          meta_data: { size, quality, image, direction, operation: 'outpaint' },
          created_at: new Date().toISOString(),
        } as HistoryRecord);
      }

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST' && endpoint === 'remove-background') {
      const { image, model = 'gpt-image' } = parsedBody;

      if (!image) {
        return new Response(
          JSON.stringify({ error: 'Image is required for background removal' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      console.log(`Muapi: Removing background with model ${model}`);

      const openaiResponse = await generateImageWithOpenAI(
        'Remove the background from this image',
        model,
        '1024x1024',
        'high',
        'transparent',
        undefined,
        image,
        undefined,
        1
      );

      const imageUrl = extractImageUrl(openaiResponse);

      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI');
      }

      const result = {
        imageUrl,
        model,
        response_id: openaiResponse.id,
      };

      if (authenticatedUserId) {
        await saveToSupabase('generation_history', {
          user_id: authenticatedUserId,
          tenant_id: tenantId,
          prompt: 'Remove background',
          model,
          result_url: imageUrl,
          type: 'image',
          meta_data: { image, operation: 'remove-background' },
          created_at: new Date().toISOString(),
        } as HistoryRecord);
      }

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST' && endpoint === 'edit-image') {
      const { prompt, image, model = 'gpt-image', size = '1024x1024', quality = 'medium' } = parsedBody;

      if (!prompt || !image) {
        return new Response(
          JSON.stringify({ error: 'Prompt and image are required for image editing' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      console.log(`Muapi: Editing image with model ${model}`);

      const openaiResponse = await generateImageWithOpenAI(
        prompt.trim(),
        model,
        size,
        quality,
        'opaque',
        undefined,
        image,
        undefined,
        1
      );

      const imageUrl = extractImageUrl(openaiResponse);

      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI');
      }

      const result = {
        imageUrl,
        model,
        prompt: prompt.trim(),
        response_id: openaiResponse.id,
      };

      if (authenticatedUserId) {
        await saveToSupabase('generation_history', {
          user_id: authenticatedUserId,
          tenant_id: tenantId,
          prompt: prompt.trim(),
          model,
          result_url: imageUrl,
          type: 'image',
          meta_data: { size, quality, image, operation: 'edit' },
          created_at: new Date().toISOString(),
        } as HistoryRecord);
      }

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST' && endpoint === 'consistent') {
      const { prompt, image, model = 'gpt-image', size = '1024x1024', quality = 'medium', n = 1 } = parsedBody;

      if (!prompt || !image) {
        return new Response(
          JSON.stringify({ error: 'Prompt and reference image are required for consistency generation' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      console.log(`Muapi: Consistent generation with model ${model}`);

      const openaiResponse = await generateImageWithOpenAI(
        prompt.trim(),
        model,
        size,
        quality,
        'opaque',
        undefined,
        image,
        undefined,
        n
      );

      const imageUrl = extractImageUrl(openaiResponse);

      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI');
      }

      const result = {
        imageUrl,
        model,
        prompt: prompt.trim(),
        response_id: openaiResponse.id,
      };

      if (authenticatedUserId) {
        await saveToSupabase('generation_history', {
          user_id: authenticatedUserId,
          tenant_id: tenantId,
          prompt: prompt.trim(),
          model,
          result_url: imageUrl,
          type: 'image',
          meta_data: { size, quality, reference_image: image, operation: 'consistent' },
          created_at: new Date().toISOString(),
        } as HistoryRecord);
      }

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST' && endpoint === 'batch') {
      const { prompts, model = 'gpt-image', size = '1024x1024', quality = 'medium', n = 1 } = parsedBody;

      if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Prompts array is required for batch generation' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      console.log(`Muapi: Batch generation with ${prompts.length} prompts using model ${model}`);

      const results = [];
      for (const prompt of prompts) {
        if (!prompt || prompt.trim().length === 0) continue;

        try {
          const openaiResponse = await generateImageWithOpenAI(
            prompt.trim(),
            model,
            size,
            quality,
            'opaque',
            undefined,
            undefined,
            undefined,
            n
          );

          const imageUrl = extractImageUrl(openaiResponse);
          results.push({
            prompt: prompt.trim(),
            imageUrl,
            success: !!imageUrl,
            response_id: openaiResponse.id,
          });

          if (authenticatedUserId && imageUrl) {
            await saveToSupabase('generation_history', {
              user_id: authenticatedUserId,
              tenant_id: tenantId,
              prompt: prompt.trim(),
              model,
              result_url: imageUrl,
              type: 'batch',
              meta_data: { size, quality, batch_index: results.length - 1, n },
              created_at: new Date().toISOString(),
            } as HistoryRecord);
          }
        } catch (err) {
          results.push({
            prompt: prompt.trim(),
            error: err.message,
            success: false,
          });
        }
      }

      return new Response(JSON.stringify({ results }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST' && endpoint === 'videos') {
      const { prompt, model = 'gpt-video', duration = 5, aspectRatio = '16:9', style = 'cinematic' } = parsedBody;

      if (!prompt || prompt.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: 'Prompt is required for video generation' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      console.log(`Muapi: Generating video with model ${model}`);

      const result = {
        videoUrl: '',
        model,
        prompt: prompt.trim(),
        duration,
        aspectRatio,
        status: 'not_supported',
        message: 'Video generation is not available via OpenAI Responses API. Consider using Sora API or a dedicated video generation service.',
      };

      if (authenticatedUserId) {
        await saveToSupabase('generation_history', {
          user_id: authenticatedUserId,
          tenant_id: tenantId,
          prompt: prompt.trim(),
          model,
          result_url: '',
          type: 'video',
          meta_data: { duration, aspectRatio, style },
          created_at: new Date().toISOString(),
        } as HistoryRecord);
      }

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ error: 'Invalid endpoint. Provide endpoint in request body: images, generate, inpaint, outpaint, remove-background, edit-image, consistent, batch, videos, or use /models for GET requests' }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in Muapi function:', error);

    let statusCode = 500;
    if (error.status === 401) {
      statusCode = 401;
    } else if (error.status === 429) {
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