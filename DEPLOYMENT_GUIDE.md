# Production Deployment Guide

## Pre-Deployment Checklist

### 🔒 Security (CRITICAL)

- [ ] **API Keys Removed**: Verify no real API keys are in `.env` file
- [ ] **Keys Rotated**: If keys were previously committed, rotate ALL API keys:
  - OpenAI API Key (https://platform.openai.com/api-keys)
  - Gemini API Key (https://makersuite.google.com/app/apikey)
  - ElevenLabs API Key (https://elevenlabs.io/app/settings/api-keys)
  - Consider rotating Supabase project if anon key was exposed
- [ ] **Git History**: Ensure sensitive data is not in git history
- [ ] **Environment File**: Created `.env.local` with real values (not committed)

### 🗄️ Database Setup

- [ ] **Migrations Applied**: All Supabase migrations are applied
- [ ] **RLS Enabled**: Row Level Security is enabled on all tables
- [ ] **Policies Tested**: Test RLS policies work correctly
- [ ] **Edge Functions**: All edge functions deployed to Supabase

### 🔧 Supabase Edge Functions Configuration

Edge functions need environment variables set in Supabase Dashboard:

1. Go to: `https://app.supabase.com/project/YOUR_PROJECT/settings/functions`
2. Add the following environment variables:

```
OPENAI_API_KEY=sk-proj-...
```

**Important**: Do NOT use `VITE_` prefix for edge function environment variables.

---

## Deployment Options

### Option 1: Vercel (Recommended)

#### Quick Deploy
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy

#### Environment Variables in Vercel

Go to: Project Settings → Environment Variables

Add the following:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=sk-proj-...
VITE_OPENAI_MODEL=gpt-5-mini
VITE_GEMINI_API_KEY=your_gemini_key
VITE_GEMINI_MODEL=gemini-2.0-flash-exp
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
ENVIRONMENT=production
```

#### Deploy Command

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

### Option 2: Netlify

#### netlify.toml

Create this file in your project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### Environment Variables

Same as Vercel, add in: Site Settings → Build & Deploy → Environment

#### Deploy

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

---

### Option 3: Self-Hosted (Docker)

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Build and run:

```bash
docker build -t ai-sales-app .
docker run -p 80:80 ai-sales-app
```

---

## Post-Deployment Steps

### 1. Verify Core Functionality

Test these critical paths in production:

- [ ] User can sign up / log in
- [ ] Content generation works
- [ ] Content saves to database
- [ ] Content history loads correctly
- [ ] Dashboard displays analytics
- [ ] Export functions work

### 2. Set Up Monitoring

#### Recommended Services:

1. **Error Tracking**: Sentry (https://sentry.io)
   ```bash
   npm install @sentry/react
   ```

2. **Uptime Monitoring**:
   - UptimeRobot (free)
   - Better Uptime
   - Vercel Analytics (built-in)

3. **Application Performance**:
   - Vercel Analytics
   - Google Analytics 4
   - Plausible Analytics

#### Add Sentry (Optional)

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.ENVIRONMENT,
  tracesSampleRate: 1.0,
});
```

### 3. Database Backups

Supabase provides automatic backups, but verify:

1. Go to: Database → Backups
2. Ensure daily backups are enabled
3. Test restore process once

### 4. Set Up Alerts

Configure alerts for:
- Database errors
- Edge function failures
- API rate limit warnings
- High API costs
- Security issues

---

## Performance Optimization

### Current Bundle Size: 2.8MB

Consider these optimizations:

1. **Code Splitting**

Edit `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
          'ai-vendor': ['openai', '@google/generative-ai'],
        }
      }
    }
  }
});
```

2. **Lazy Loading Routes**

```typescript
// In App.tsx or router config
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ContentGeneratorPage = lazy(() => import('./pages/ContentGeneratorPage'));
```

3. **Image Optimization**
- Use WebP format
- Implement lazy loading for images
- Use appropriate image sizes

---

## Security Best Practices

### 1. Content Security Policy (CSP)

Add to your HTML or headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api.openai.com
```

### 2. Rate Limiting

Implement in Supabase Edge Functions:

```typescript
// Check rate limit before processing
const { count } = await supabase
  .from('usage_analytics')
  .select('*', { count: 'exact' })
  .eq('user_id', userId)
  .gte('created_at', new Date(Date.now() - 3600000).toISOString());

if (count && count > 100) {
  throw new Error('Rate limit exceeded');
}
```

### 3. Input Validation

Always validate user input on the server side (Edge Functions).

---

## Cost Management

### Estimated Monthly Costs (at scale)

- **Supabase**: $25/month (Pro plan recommended for production)
- **OpenAI API**: Variable ($0.002-0.03 per 1K tokens)
- **Gemini API**: Free tier, then $0.00025 per 1K tokens
- **Vercel**: Free tier for small apps, $20/month for Pro
- **Total Estimate**: $50-200/month depending on usage

### Cost Monitoring

1. Set up billing alerts in:
   - OpenAI Dashboard
   - Google AI Studio
   - Supabase Dashboard
   - Vercel Dashboard

2. Monitor usage in your analytics dashboard

3. Implement usage limits per user:
   ```typescript
   const USER_DAILY_LIMIT = 50; // generations per day
   ```

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Environment Variables Not Working

- Vite requires `VITE_` prefix for client-side variables
- Edge Functions do NOT use `VITE_` prefix
- Restart dev server after changing `.env`

### Edge Functions Failing

1. Check logs: `https://app.supabase.com/project/_/logs/edge-functions`
2. Verify `OPENAI_API_KEY` is set (without VITE_ prefix)
3. Check CORS headers are included

### Content Not Saving

1. Check browser console for errors
2. Verify user is authenticated
3. Check RLS policies in Supabase
4. Review database logs

---

## Rollback Plan

If issues arise in production:

1. **Immediate Rollback**:
   ```bash
   # Vercel
   vercel rollback

   # Netlify
   netlify rollback
   ```

2. **Database Rollback**:
   - Supabase provides point-in-time recovery
   - Contact support for assistance

3. **Communication**:
   - Update status page
   - Notify users via email
   - Post on social media

---

## Success Criteria

Your deployment is successful when:

- ✅ All core features work in production
- ✅ No API keys exposed in client code
- ✅ Database queries respond in < 500ms
- ✅ Page load time < 3 seconds
- ✅ Error rate < 1%
- ✅ Uptime > 99.9%
- ✅ Monitoring and alerts configured
- ✅ Backup strategy in place

---

## Support Resources

- **Supabase**: https://supabase.com/docs
- **Vercel**: https://vercel.com/docs
- **OpenAI**: https://platform.openai.com/docs
- **Vite**: https://vitejs.dev/guide/

---

## Next Steps After Launch

1. **Week 1**: Monitor errors and performance closely
2. **Week 2**: Optimize based on real user data
3. **Month 1**: Implement user feedback
4. **Month 2**: Add comprehensive testing
5. **Month 3**: Scale infrastructure as needed

---

## Emergency Contacts

Keep these handy:

- Supabase Support: support@supabase.io
- Vercel Support: https://vercel.com/support
- OpenAI Support: https://help.openai.com

---

**Remember**: Test everything in staging before deploying to production!
