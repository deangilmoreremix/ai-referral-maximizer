# Production Checklist

## 🚀 API Endpoints Status

### Supabase Edge Functions

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/functions/v1/openai-gpt5` | POST | ✅ Ready | GPT-5 content generation via OpenAI Responses API |
| `/functions/v1/muapi` | POST/GET | ✅ Ready | Image generation via OpenAI (images, inpaint, outpaint, batch) |
| `/functions/v1/gemini-images` | POST | ✅ Ready | Gemini-based image generation |
| `/functions/v1/generate-content` | POST | ✅ Ready | Content generation orchestration |
| `/functions/v1/content-history` | POST | ✅ Ready | Save and retrieve content history |
| `/functions/v1/analyze-document` | POST | ✅ Ready | Document analysis and parsing |
| `/functions/v1/scrape-linkedin` | POST | ✅ Ready | LinkedIn profile scraping |
| `/functions/v1/usage-analytics` | POST | ✅ Ready | Usage tracking and analytics |

### External API Dependencies

| Service | Endpoint | Status | Required For |
|---------|----------|--------|--------------|
| OpenAI API | api.openai.com/v1 | ⚠️ Needs Key | Content & image generation |
| Gemini API | generativelanguage.googleapis.com | ⚠️ Needs Key | Gemini models |
| Zep API | api.getzep.com | ⚠️ Needs Key | Conversational memory |
| Unipile API | api.unipile.com | ⚠️ Needs Key | Multi-channel messaging |
| ElevenLabs | api.elevenlabs.io | ⚠️ Needs Key | Voice generation |
| DropCowboy | api.dropcowboy.com | ⚠️ Needs Key | Voice/SMS campaigns |

---

## 🔑 Required Environment Variables

### Client-Side (VITE_ prefix)

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://bzxohkrxcwodllketcpz.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Gemini Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Zep Configuration
VITE_ZEP_API_KEY=your_zep_api_key_here

# Unipile Configuration
VITE_UNIPILE_API_KEY=your_unipile_api_key_here

# ElevenLabs Configuration
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### Server-Side (Edge Functions)

```bash
# Supabase Edge Function Secrets
SUPABASE_URL=https://bzxohkrxcwodllketcpz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

OPENAI_API_KEY=your_openai_api_key_here
```

---

## 📦 Supabase Edge Function Deployment

### Prerequisites
- Supabase CLI installed (`npm install -g supabase`)
- Logged in to Supabase (`supabase login`)
- Project linked (`supabase link --project-ref bzxohkrxcwodllketcpz`)

### Deployment Steps

1. **Link to Supabase Project**
   ```bash
   supabase login
   supabase link --project-ref bzxohkrxcwodllketcpz
   ```

2. **Set Environment Secrets**
   ```bash
   supabase secrets set OPENAI_API_KEY=your_openai_key_here
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Deploy All Functions**
   ```bash
   supabase functions deploy openai-gpt5
   supabase functions deploy muapi
   supabase functions deploy gemini-images
   supabase functions deploy generate-content
   supabase functions deploy content-history
   supabase functions deploy analyze-document
   supabase functions deploy scrape-linkedin
   supabase functions deploy usage-analytics
   ```

4. **Verify Deployment**
   ```bash
   supabase functions list
   ```

---

## 🔷 Netlify Deployment Steps

### Prerequisites
- Netlify CLI installed (`npm install -g netlify-cli`)
- Netlify account authenticated (`netlify login`)

### Environment Variables Setup
- Go to Site Settings → Build & Deploy → Environment
- Add all client-side variables (VITE_ prefixed)

### Deployment Process

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   netlify deploy --dir=dist --prod
   ```

---

## 🏢 Multi-Tenant Architecture Setup

### Database Schema

| Table | Tenant ID Column | Notes |
|-------|-----------------|-------|
| users | - | Users can belong to tenants via user_tenants join table |
| generated_content | tenant_id | Optional multi-tenant support |
| analyzed_documents | user_id | Single-tenant (user-scoped) |
| linkedin_profiles | user_id | Single-tenant (user-scoped) |
| openai_responses | tenant_id | Multi-tenant aware |
| generation_history | tenant_id | Multi-tenant aware |

---

## 🔒 Security Considerations

- [x] No hardcoded API keys in client code
- [x] Environment variables in `.env.example` template
- [x] Row Level Security (RLS) enabled on all tables
- [x] CORS headers configured in edge functions
- [x] Security headers in deployment config

---

## 🧪 Pre-Launch Testing

- [ ] User authentication (signup/login/logout)
- [ ] Content generation flow
- [ ] Content history retrieval
- [ ] Document upload and analysis
- [ ] LinkedIn profile scraping
- [ ] Image generation
- [ ] Export to PDF/DOCX/PPTX

---

## 📊 Monitoring & Alerts

1. **Error Monitoring** - Sentry.io
2. **Cost Monitoring** - OpenAI usage alerts
3. **Uptime Monitoring** - UptimeRobot

---

## 📞 Support Contacts

- Supabase Support: https://supabase.com/support
- OpenAI Help: https://help.openai.com
- Netlify Support: https://netlify.com/support