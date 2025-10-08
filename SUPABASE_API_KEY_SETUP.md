# Supabase Edge Function API Key Setup

## Problem
The `openai-gpt5` edge function needs the `OPENAI_API_KEY` environment variable to be set in Supabase. Currently, it's using an invalid/expired key, which causes API calls to fail.

## Current Status
- ✅ Edge function code is deployed and functional
- ✅ Client-side fallback is working (app generates content using browser API)
- ❌ Edge function environment variable `OPENAI_API_KEY` is invalid/expired
- ✅ Your `.env` file has the correct API key

## Solution: Set the Environment Variable in Supabase

### Method 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/gadedbrnqzpfqtsdfzcg

2. **Navigate to Edge Functions Settings**
   - Click on "Settings" (gear icon in left sidebar)
   - Click on "Edge Functions"
   - Click on "Secrets" tab

3. **Add the API Key**
   - Click "Add new secret" button
   - **Secret Name:** `OPENAI_API_KEY`
   - **Secret Value:** `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`
   - Click "Save"

4. **The change takes effect immediately** - no need to redeploy the function

### Method 2: Using Supabase CLI (If you have CLI access)

```bash
npx supabase secrets set OPENAI_API_KEY="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"
```

## Verification

After setting the environment variable, test the edge function:

```bash
curl -X POST 'https://gadedbrnqzpfqtsdfzcg.supabase.co/functions/v1/openai-gpt5' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhZGVkYnJucXpwZnF0c2RmemNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NjYxMTUsImV4cCI6MjA1ODE0MjExNX0.bpsk8yRpwQQnYaY4qY3hsW5ExrQe_8JA3UZ51mlQ1e4' \
  -H 'Content-Type: application/json' \
  -d '{"input": "Say hello", "model": "gpt-5-mini"}'
```

Expected successful response:
```json
{
  "model": "gpt-5-mini",
  "text": "Hello! How can I assist you today?",
  "fallback_note": null
}
```

## Benefits of Using Edge Function

Once the API key is set correctly:

1. **Security**: API key is stored securely server-side, not exposed in browser
2. **Better performance**: Edge functions run closer to users globally
3. **Rate limiting**: Better control over API usage
4. **Cost tracking**: Easier to monitor API costs from server-side logs

## Current Fallback Behavior

Your app is currently working because:
- The `openAIService.ts` tries the edge function first
- When it fails (401 error due to invalid API key), it automatically falls back to client-side OpenAI API
- The client-side uses `import.meta.env.VITE_OPENAI_API_KEY` from your `.env` file
- Users can still generate content, but with less security

## Files Modified

- ✅ `src/services/openAIService.ts` - Already configured to use edge function with fallback
- ✅ `supabase/functions/openai-gpt5/index.ts` - Edge function code is ready
- ❌ Supabase environment variable - Needs to be set in dashboard

## Next Steps

1. Set the `OPENAI_API_KEY` in Supabase dashboard (Method 1 above)
2. Test the edge function with the curl command
3. Verify in your app that content generation now uses the edge function (check browser console logs)
