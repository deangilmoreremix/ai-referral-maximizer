import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface ContentHistoryRequest {
  page?: number;
  limit?: number;
  contentType?: string;
  searchQuery?: string;
  sortBy?: 'created_at' | 'updated_at' | 'generation_time_ms';
  sortOrder?: 'asc' | 'desc';
  isFavorite?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

interface ContentHistoryResponse {
  content: Array<{
    id: string;
    content_type_id: string;
    content: string;
    ai_model: string;
    generation_time_ms: number;
    revision_count: number;
    personalization_data: any;
    metadata: any;
    is_favorite: boolean;
    created_at: string;
    updated_at: string;
    content_type?: {
      name: string;
      category: string;
    };
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authorization header for user context
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get user ID from JWT token
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid authentication token');
    }

    // Parse request body for POST requests, or use query params for GET
    let requestParams: ContentHistoryRequest = {};

    if (req.method === 'POST') {
      requestParams = await req.json();
    } else if (req.method === 'GET') {
      const url = new URL(req.url);
      requestParams = {
        page: parseInt(url.searchParams.get('page') || '1'),
        limit: parseInt(url.searchParams.get('limit') || '20'),
        contentType: url.searchParams.get('contentType') || undefined,
        searchQuery: url.searchParams.get('searchQuery') || undefined,
        sortBy: (url.searchParams.get('sortBy') as ContentHistoryRequest['sortBy']) || 'created_at',
        sortOrder: (url.searchParams.get('sortOrder') as ContentHistoryRequest['sortOrder']) || 'desc',
        isFavorite: url.searchParams.get('isFavorite') === 'true' ? true : undefined,
        dateFrom: url.searchParams.get('dateFrom') || undefined,
        dateTo: url.searchParams.get('dateTo') || undefined,
      };
    }

    // Validate and set defaults
    const page = Math.max(1, requestParams.page || 1);
    const limit = Math.min(100, Math.max(1, requestParams.limit || 20));
    const offset = (page - 1) * limit;

    console.log(`Fetching content history for user ${user.id}, page ${page}, limit ${limit}`);

    // Build the query
    let query = supabase
      .from('generated_content')
      .select(`
        id,
        content_type_id,
        content,
        ai_model,
        generation_time_ms,
        revision_count,
        personalization_data,
        metadata,
        is_favorite,
        created_at,
        updated_at,
        content_types (
          name,
          category
        )
      `, { count: 'exact' })
      .eq('user_id', user.id);

    // Apply filters
    if (requestParams.contentType) {
      // First get content type IDs that match the category or name
      const { data: contentTypeIds } = await supabase
        .from('content_types')
        .select('id')
        .or(`category.eq.${requestParams.contentType},name.ilike.%${requestParams.contentType}%`);

      if (contentTypeIds && contentTypeIds.length > 0) {
        query = query.in('content_type_id', contentTypeIds.map(ct => ct.id));
      }
    }

    if (requestParams.isFavorite !== undefined) {
      query = query.eq('is_favorite', requestParams.isFavorite);
    }

    if (requestParams.dateFrom) {
      query = query.gte('created_at', requestParams.dateFrom);
    }

    if (requestParams.dateTo) {
      query = query.lte('created_at', requestParams.dateTo);
    }

    // Apply search if provided
    if (requestParams.searchQuery) {
      query = query.ilike('content', `%${requestParams.searchQuery}%`);
    }

    // Apply sorting
    const sortBy = requestParams.sortBy || 'created_at';
    const sortOrder = requestParams.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Execute the query
    const { data: content, error: queryError, count } = await query;

    if (queryError) {
      console.error('Database query error:', queryError);
      throw new Error('Failed to fetch content history');
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    const response: ContentHistoryResponse = {
      content: content || [],
      total,
      page,
      limit,
      totalPages,
    };

    console.log(`Retrieved ${content?.length || 0} content items out of ${total} total`);

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in content-history function:', error);

    let statusCode = 500;
    if (error.message?.includes('authentication') || error.message?.includes('authorization')) {
      statusCode = 401;
    } else if (error.message?.includes('Invalid')) {
      statusCode = 400;
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