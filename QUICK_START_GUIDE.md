# Quick Start Guide - Production Deployment

## ✅ What's Already Done

- ✅ Supabase database configured and connected
- ✅ 11 database migrations applied with RLS policies
- ✅ 8 edge functions created (4 need OPENAI_API_KEY)
- ✅ API keys removed from repository
- ✅ Production build optimized
- ✅ Deployment configuration ready

---

## 🚀 3 Steps to Production

### Step 1: Set Up Environment Variables Locally (2 minutes)

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your real values
# (This file is ignored by git and won't be committed)
```

Required variables in `.env.local`:
```bash
VITE_SUPABASE_URL=https://bzxohkrxcwodllketcpz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_OPENAI_API_KEY=sk-proj-...
VITE_GEMINI_API_KEY=AIzaSyC-...
VITE_ELEVENLABS_API_KEY=Sk_1b1501ca... (optional)
```

### Step 2: Configure Supabase Edge Functions (1 minute)

Your edge functions need the OpenAI API key to work:

1. Go to: https://app.supabase.com/project/bzxohkrxcwodllketcpz/settings/functions
2. Click "Add new secret"
3. Add:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `sk-proj-...` (your OpenAI key, NO VITE_ prefix)

**Edge functions that need this**:
- `openai-gpt5` - Main content generation
- `openai-images` - Image generation
- `analyze-document` - Document analysis
- `scrape-linkedin` - LinkedIn scraping

### Step 3: Deploy to Vercel (5 minutes)

#### Option A: Quick Deploy (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

During deployment, Vercel will ask for environment variables. Copy them from your `.env.local`.

#### Option B: GitHub Integration

1. Push to GitHub
2. Import project on Vercel: https://vercel.com/new
3. Add environment variables in project settings
4. Deploy

---

## 🧪 Test Your Deployment

After deployment, test these critical features:

### Authentication
```
1. Sign up with a new email
2. Log in
3. Log out and log back in
```

### Content Generation
```
1. Go to content generator
2. Fill in personalization details
3. Generate content
4. Verify it saves to database
5. Check content history
```

### Edge Functions
```
1. Test content generation (uses openai-gpt5)
2. Try document analysis (uses analyze-document)
3. Check dashboard analytics
```

---

## 📊 Monitor Your Deployment

### Check Supabase Edge Function Logs
https://app.supabase.com/project/bzxohkrxcwodllketcpz/logs/edge-functions

### Check Database Activity
https://app.supabase.com/project/bzxohkrxcwodllketcpz/logs/postgres-logs

### Monitor API Costs
- OpenAI: https://platform.openai.com/usage
- Gemini: https://console.cloud.google.com/billing

---

## 🔧 Troubleshooting

### Edge Functions Failing?

**Check environment variable is set:**
```bash
# The edge function needs OPENAI_API_KEY (without VITE_ prefix)
# Set it in: Supabase Dashboard → Settings → Edge Functions → Secrets
```

**View error logs:**
https://app.supabase.com/project/bzxohkrxcwodllketcpz/logs/edge-functions

### Build Failing?

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Environment Variables Not Working?

- Client-side variables MUST have `VITE_` prefix
- Edge function variables must NOT have `VITE_` prefix
- Restart dev server after changing `.env.local`

---

## 💰 Cost Monitoring

### Set Up Billing Alerts

1. **OpenAI** (Most important):
   - Go to: https://platform.openai.com/settings/organization/billing/limits
   - Set monthly budget limit
   - Enable email notifications

2. **Supabase**:
   - Current plan: Free tier
   - Upgrade to Pro ($25/mo) when needed
   - Includes: 8GB database, 250GB bandwidth

3. **Vercel**:
   - Free tier includes: 100GB bandwidth, unlimited deployments
   - Pro plan ($20/mo) adds: Advanced analytics, better support

### Estimated Costs (First Month)

**Low usage (< 100 users):**
- Vercel: $0 (free tier)
- Supabase: $0 (free tier)
- OpenAI: $10-30
- **Total: $10-30**

**Medium usage (100-500 users):**
- Vercel: $20 (Pro)
- Supabase: $25 (Pro)
- OpenAI: $50-150
- **Total: $95-195**

---

## 📈 Next Steps After Launch

### Week 1
- [ ] Monitor error rates daily
- [ ] Check API costs daily
- [ ] Verify all features work
- [ ] Collect initial user feedback

### Week 2
- [ ] Add error tracking (Sentry)
- [ ] Set up uptime monitoring
- [ ] Optimize slow queries
- [ ] Implement user feedback

### Month 1
- [ ] Add rate limiting if needed
- [ ] Optimize bundle size further
- [ ] Add comprehensive testing
- [ ] Scale infrastructure as needed

---

## 🆘 Need Help?

### Documentation
- Full deployment guide: `DEPLOYMENT_GUIDE.md`
- Mock data audit: `MOCK_DATA_AUDIT_REPORT.md`
- Production status: `PRODUCTION_READINESS_SUMMARY.md`

### Support
- Supabase: https://supabase.com/support
- Vercel: https://vercel.com/support
- OpenAI: https://help.openai.com

---

## ✅ Production Checklist

Before launching:
- [ ] `.env.local` created with real API keys
- [ ] Supabase edge function secret added (`OPENAI_API_KEY`)
- [ ] Deployed to Vercel (or your chosen platform)
- [ ] Tested signup/login
- [ ] Tested content generation
- [ ] Tested content saving to database
- [ ] Verified edge functions work
- [ ] Set billing alerts on OpenAI
- [ ] Monitoring configured

After launching:
- [ ] Test all features in production
- [ ] Monitor error logs
- [ ] Check API costs
- [ ] Collect user feedback

---

**Time to Production: 8 minutes** ⏱️

Your app is ready - just add your keys and deploy! 🚀
