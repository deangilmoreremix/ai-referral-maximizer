import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface UsageAnalyticsRequest {
  period?: 'day' | 'week' | 'month' | 'year';
  dateFrom?: string;
  dateTo?: string;
  groupBy?: 'action' | 'resource_type' | 'ai_model' | 'day' | 'week' | 'month';
  includeInsights?: boolean;
}

interface UsageStats {
  totalActions: number;
  uniqueUsers: number;
  totalGenerationTime: number;
  averageGenerationTime: number;
  successRate: number;
  topActions: Array<{
    action: string;
    count: number;
    percentage: number;
  }>;
  topModels: Array<{
    model: string;
    count: number;
    totalTime: number;
    averageTime: number;
  }>;
  dailyUsage: Array<{
    date: string;
    actions: number;
    generationTime: number;
    successRate: number;
  }>;
  errorBreakdown: Array<{
    errorType: string;
    count: number;
    percentage: number;
  }>;
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

    // Parse request body
    const request: UsageAnalyticsRequest = await req.json();

    // Set default date range (last 30 days)
    const now = new Date();
    const dateTo = request.dateTo ? new Date(request.dateTo) : now;
    const dateFrom = request.dateFrom
      ? new Date(request.dateFrom)
      : new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)); // 30 days ago

    console.log(`Generating usage analytics for user ${user.id} from ${dateFrom.toISOString()} to ${dateTo.toISOString()}`);

    // Fetch usage logs for the user within the date range
    const { data: usageLogs, error: logsError } = await supabase
      .from('usage_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', dateFrom.toISOString())
      .lte('created_at', dateTo.toISOString())
      .order('created_at', { ascending: true });

    if (logsError) {
      console.error('Database error fetching usage logs:', logsError);
      throw new Error('Failed to fetch usage data');
    }

    if (!usageLogs || usageLogs.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          stats: {
            totalActions: 0,
            uniqueUsers: 1,
            totalGenerationTime: 0,
            averageGenerationTime: 0,
            successRate: 0,
            topActions: [],
            topModels: [],
            dailyUsage: [],
            errorBreakdown: [],
          },
          insights: null,
          period: {
            from: dateFrom.toISOString(),
            to: dateTo.toISOString(),
          },
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Calculate basic statistics
    const totalActions = usageLogs.length;
    const successfulActions = usageLogs.filter(log => log.success).length;
    const successRate = (successfulActions / totalActions) * 100;

    const generationLogs = usageLogs.filter(log => log.generation_time_ms);
    const totalGenerationTime = generationLogs.reduce((sum, log) => sum + (log.generation_time_ms || 0), 0);
    const averageGenerationTime = generationLogs.length > 0 ? totalGenerationTime / generationLogs.length : 0;

    // Group by action
    const actionGroups: Record<string, number> = usageLogs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topActions = Object.entries(actionGroups)
      .map(([action, count]: [string, number]) => ({
        action,
        count,
        percentage: (count / totalActions) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Group by AI model
    const modelGroups: Record<string, { count: number; totalTime: number }> = usageLogs.reduce((acc, log) => {
      if (log.ai_model) {
        if (!acc[log.ai_model]) {
          acc[log.ai_model] = { count: 0, totalTime: 0 };
        }
        acc[log.ai_model].count++;
        acc[log.ai_model].totalTime += log.generation_time_ms || 0;
      }
      return acc;
    }, {} as Record<string, { count: number; totalTime: number }>);

    const topModels = Object.entries(modelGroups)
      .map(([model, data]) => ({
        model,
        count: data.count,
        totalTime: data.totalTime,
        averageTime: data.count > 0 ? data.totalTime / data.count : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Daily usage aggregation
    const dailyGroups = usageLogs.reduce((acc, log) => {
      const date = new Date(log.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { actions: 0, generationTime: 0, successful: 0, total: 0 };
      }
      acc[date].actions++;
      acc[date].generationTime += log.generation_time_ms || 0;
      acc[date].total++;
      if (log.success) {
        acc[date].successful++;
      }
      return acc;
    }, {} as Record<string, { actions: number; generationTime: number; successful: number; total: number }>);

    const dailyUsage = Object.entries(dailyGroups)
      .map(([date, data]) => ({
        date,
        actions: data.actions,
        generationTime: data.generationTime,
        successRate: data.total > 0 ? (data.successful / data.total) * 100 : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Error breakdown
    const errorLogs = usageLogs.filter(log => !log.success && log.error_message);
    const errorGroups: Record<string, number> = errorLogs.reduce((acc, log) => {
      const errorType = categorizeError(log.error_message);
      acc[errorType] = (acc[errorType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const errorBreakdown = Object.entries(errorGroups)
      .map(([errorType, count]) => ({
        errorType,
        count,
        percentage: errorLogs.length > 0 ? (count / errorLogs.length) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const stats: UsageStats = {
      totalActions,
      uniqueUsers: 1, // Since we're filtering by user
      totalGenerationTime,
      averageGenerationTime,
      successRate,
      topActions,
      topModels,
      dailyUsage,
      errorBreakdown,
    };

    console.log(`Analytics generated successfully for ${totalActions} actions`);

    return new Response(
      JSON.stringify({
        success: true,
        stats,
        insights: null, // AI insights can be added later if needed
        period: {
          from: dateFrom.toISOString(),
          to: dateTo.toISOString(),
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in usage-analytics function:', error);

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

function categorizeError(errorMessage: string): string {
  const message = errorMessage.toLowerCase();

  if (message.includes('rate limit') || message.includes('quota')) {
    return 'Rate Limit/API Quota';
  } else if (message.includes('network') || message.includes('timeout')) {
    return 'Network/Timeout';
  } else if (message.includes('authentication') || message.includes('unauthorized')) {
    return 'Authentication';
  } else if (message.includes('validation') || message.includes('invalid')) {
    return 'Validation';
  } else if (message.includes('database') || message.includes('sql')) {
    return 'Database';
  } else {
    return 'Other';
  }
}