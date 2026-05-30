# Supabase Edge Function Setup

## ⚠️ IMPORTANT: Add Environment Variable to Supabase

Your edge functions need the OpenAI API key to work. Follow these steps:

## Step 1: Go to Supabase Dashboard

Open this URL in your browser:
```
https://app.supabase.com/project/bzxohkrxcwodllketcpz/settings/functions
```

## Step 2: Add the Secret

1. Click the **"Add new secret"** button
2. Fill in the form:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `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`
3. Click **"Add secret"** or **"Save"**

## Important Notes

- **DO NOT** include the `VITE_` prefix for edge function secrets
- The key is: `OPENAI_API_KEY` (not `VITE_OPENAI_API_KEY`)
- Edge functions that need this key:
  - `openai-gpt5` - Main content generation
  - `openai-images` - Image generation
  - `analyze-document` - Document analysis
  - `scrape-linkedin` - LinkedIn scraping

## Step 3: Verify It Works

After adding the secret:

1. Wait 10-30 seconds for the change to propagate
2. Test content generation in your app
3. Check edge function logs if there are issues:
   ```
   https://app.supabase.com/project/bzxohkrxcwodllketcpz/logs/edge-functions
   ```

## Troubleshooting

### Edge function returns "Missing OPENAI_API_KEY" error?
- Double-check the secret name is exactly: `OPENAI_API_KEY`
- Verify there are no extra spaces in the key value
- Wait 30 seconds after adding the secret

### Still not working?
- Check the logs at: https://app.supabase.com/project/bzxohkrxcwodllketcpz/logs/edge-functions
- The error message will tell you what's wrong

---

## ✅ Once Complete

Your edge functions will be fully functional and ready for production!

Next step: Deploy to Vercel with `vercel --prod`
