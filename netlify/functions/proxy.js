export async function handler(event, context) {
  const { httpMethod, headers, queryStringParameters, body, path } = event;

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'SUPABASE_URL not configured' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  const functionName = path.replace('/.netlify/functions/proxy/', '');
  const url = `${supabaseUrl}/functions/v1/${functionName}${queryStringParameters ? '?' + new URLSearchParams(queryStringParameters).toString() : ''}`;

  try {
    const response = await fetch(url, {
      method: httpMethod,
      headers: {
        ...headers,
        'Authorization': headers.authorization || `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
        'apikey': process.env.VITE_SUPABASE_ANON_KEY,
      },
      body: body
    });

    const responseBody = await response.text();

    return {
      statusCode: response.status,
      body: responseBody,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        ...Object.fromEntries(response.headers.entries())
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
}