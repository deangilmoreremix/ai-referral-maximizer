# AI Referral Maximizer

![AI Referral Maximizer](https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=400&dpr=1)

**AI Referral Maximizer** is a cutting-edge, AI-powered platform designed to revolutionize how businesses and professionals generate referrals. Leveraging advanced AI models, it helps users create personalized, professional referral scripts, strategies, and campaigns in seconds, eliminating writer's block and maximizing outreach effectiveness.

## ✨ Key Features

### 🤖 **AI-Powered Content Generation**
- Generate high-quality, tailored referral content using state-of-the-art **OpenAI models**, including the latest **GPT-5 series**
- Support for multiple AI models with different speed/quality trade-offs
- Intelligent content generation based on your specific business context

### 📚 **Comprehensive Referral Library**
- **50+ proven referral methods** across multiple categories:
  - **Direct Outreach**: Phone scripts, face-to-face meetings, WhatsApp campaigns
  - **Group Engagement**: Facebook groups, LinkedIn groups, community strategies
  - **Incentive Programs**: Reward systems, referral tracking, multi-level structures
  - **Follow-up Systems**: Systematic nurturing and conversion strategies
  - **Meeting Templates**: Zoom, video conferences, screen sharing presentations

### 🎯 **Advanced Personalization**
- **Industry-specific content** tailored to your business sector
- **Target audience customization** for maximum relevance
- **Document analysis technology** - upload business materials for deeper personalization
- **LinkedIn profile integration** - extract professional insights for enhanced context
- **Relationship type awareness** - adjust tone and approach based on your connection

### 📱 **Multi-Channel Communication Tools**
- **Voice Drop Creator** - Generate and schedule professional voice messages
- **SMS Template Builder** - Create personalized text message campaigns
- **WhatsApp Campaigns** - 14-day systematic messaging strategies
- **Social Media Integration** - Cross-platform messaging coordination

### 📄 **Professional Export Options**
- **PDF Documents** - Professional, ready-to-use documents with proper formatting
- **PowerPoint Presentations** - Slide decks with visual layouts and speaker notes
- **Word Documents** - Editable formats for easy customization
- **Excel Spreadsheets** - Data-focused content with calculations and tables

### 🏢 **Business Accelerators**
- **Consultant Business Accelerator** - 6-step program to build a profitable consulting practice
- **AI Agency Accelerator** - Transform freelance skills into a thriving AI-powered agency
- **Super Content Creator** - Generate multiple referral methods simultaneously

## 🚀 Quick Start

### 1. Prerequisites

Ensure you have the following installed:
- **Node.js 18.x or higher**
- **npm** or **yarn** package manager
- **OpenAI API account** for content generation
- **Supabase account** for backend services

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ai-referral-maximizer.git
cd ai-referral-maximizer

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env
```

### 3. Configure API Keys

Edit your `.env` file with your API credentials:

```env
# OpenAI API Key (REQUIRED)
OPENAI_API_KEY="sk-your-openai-api-key"
VITE_OPENAI_API_KEY="sk-your-openai-api-key"

# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 4. Start Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

## 🔑 Getting API Keys

### OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key and add it to your `.env` file
6. **Important**: Also add this key to your Supabase project's environment variables

### Supabase Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing one
3. Go to **Settings** → **API**
4. Copy your **Project URL** and **anon/public key**
5. Add them to your `.env` file

## 📖 User Guide

### Getting Started
1. **Personalize**: Start by clicking "Personalize" to configure your industry, target audience, and business details
2. **Upload Documents** (Optional): Upload business documents for enhanced AI personalization
3. **LinkedIn Integration** (Optional): Connect LinkedIn profiles for professional context
4. **Choose Referral Method**: Browse 50+ referral methods and select one that fits your needs
5. **Generate Content**: Click generate and let AI create professional, customized content
6. **Export & Use**: Download in your preferred format (PDF, PPTX, DOCX) and use immediately

### Key Workflows

#### **Standard Content Generation**
- Personalize → AI Settings → Content Generator → Export

#### **Comprehensive Campaign Creation**
- Personalize → Super Creator → Voice & SMS → Export

#### **Business Building**
- Consultant Accelerator → Agency Accelerator → Dashboard

## 🏗️ Architecture

### Frontend (React + TypeScript + Vite)
- **Modern React 18** with hooks and context for state management
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** for utility-first styling
- **Vite** for fast development and optimized production builds
- **React Router** for client-side routing

### Backend (Supabase)
- **PostgreSQL Database** for user data, content history, and analytics
- **Supabase Edge Functions** (Deno runtime) for:
  - OpenAI API integration (`openai-gpt5`)
  - Document analysis (`analyze-document`) 
  - LinkedIn scraping (`scrape-linkedin`)
  - Content management (`content-history`)
  - Usage analytics (`usage-analytics`)

### Key Technologies
- **OpenAI GPT Models** for content generation
- **Supabase** for backend services and database
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation
- **jsPDF** for PDF generation
- **PptxGenJS** for PowerPoint generation

## 🚀 Deployment

### Frontend Deployment

**Recommended: Vercel or Netlify**
```bash
# Build the project
npm run build

# Deploy to your preferred platform
# For Vercel: vercel --prod
# For Netlify: netlify deploy --prod --dir=dist
```

### Supabase Edge Functions

```bash
# Login to Supabase CLI
supabase login

# Link your local project to Supabase
supabase link --project-ref your-project-id

# Deploy all Edge Functions
supabase functions deploy --no-verify-jwt
```

### Environment Variables for Production

Ensure these environment variables are set in your production environment:

**Supabase Project Settings → Environment Variables:**
```env
OPENAI_API_KEY=your_openai_api_key
```

**Frontend Hosting Platform:**
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Start Storybook (component development)
npm run storybook

# Build Storybook
npm run build-storybook
```

## 🔍 Verification & Testing

### Verifying Live API Usage

To ensure your app is using live APIs instead of demo content:

1. **Check Console Logs**: Look for messages like "Calling OpenAI with model: gpt-5"
2. **Network Tab**: Monitor requests to `api.openai.com` and your Supabase functions
3. **Content Quality**: Live API content will be unique and contextually relevant
4. **No Demo Tags**: If you see `[DEMO CONTENT]` in outputs, API calls are failing

### Testing Edge Functions Locally

```bash
# Start Supabase local development
supabase start

# Test a specific function
supabase functions serve openai-gpt5 --env-file .env

# Make a test request
curl -X POST 'http://localhost:54321/functions/v1/openai-gpt5' \
  -H 'Authorization: Bearer your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{"input": "Generate a professional referral email", "model": "gpt-5"}'
```

## 🎨 UI Components (Storybook)

This project includes a comprehensive Storybook setup for developing and testing UI components in isolation:

```bash
# Start Storybook
npm run storybook
```

Available component stories:
- `ContentCard` - Content type selection cards
- `DaySelector` - Multi-day content navigation
- `DocumentModal` - Download modals
- `AIModelSelector` - AI model selection interface
- `PersonalizerModal` - Personalization settings
- And many more...

## 🗄️ Database Schema

The application uses a comprehensive PostgreSQL schema with tables for:

- **Users & Authentication** - User accounts and preferences
- **Content Management** - Generated content and history
- **Analytics** - Usage tracking and performance metrics
- **Personalization** - User settings and analyzed data
- **Templates** - Saved content templates and configurations

Key tables:
- `users` - User accounts and profiles
- `generated_content` - All AI-generated content with metadata
- `personalization_settings` - User personalization preferences
- `analyzed_documents` - Document analysis results
- `linkedin_profiles` - LinkedIn profile data
- `usage_logs` - User activity tracking

## 🔐 Security & Privacy

- **API Key Security**: Sensitive API keys are handled server-side through Supabase Edge Functions
- **Data Encryption**: All data is encrypted in transit and at rest
- **Privacy Compliance**: User data handling complies with privacy regulations
- **Secure Document Processing**: Documents are processed securely and can be deleted at any time
- **LinkedIn Data**: Only public profile information is analyzed, and data is stored securely

## 🧪 Advanced Features

### Document Analysis
- **Supported Formats**: PDF, DOCX, TXT, JSON
- **Extraction Capabilities**: Industry detection, audience identification, key points, topics, competitor analysis
- **Use Cases**: Client briefs, brand guidelines, requirement documents, marketing materials

### LinkedIn Integration
- **Profile Analysis**: Professional details, skills, experience, education
- **Industry Insights**: Contextual information for content personalization
- **Privacy Compliant**: Only analyzes public profile information

### Multi-Channel Campaigns
- **Voice Drops**: Professional voice messages with scheduling
- **SMS Templates**: Character-optimized text messages
- **WhatsApp Campaigns**: Rich media messaging with emojis
- **Email Sequences**: Multi-day nurturing campaigns

## 📊 Analytics & Insights

The platform provides comprehensive analytics:
- **Content Generation Metrics**: Track what content types you generate most
- **Usage Patterns**: Monitor your activity over time
- **Export Statistics**: See which formats you use most frequently
- **Performance Tracking**: Measure the effectiveness of your referral campaigns

## 🛠️ Troubleshooting

### Common Issues

**Content Generation Fails**
- Verify your OpenAI API key is valid and has sufficient credits
- Check that Edge Functions are deployed correctly
- Monitor console logs for specific error messages

**Supabase Connection Issues**
- Ensure your Supabase URL and anon key are correct
- Verify your Supabase project is active and not paused
- Check that Edge Functions have the required environment variables

**Document Analysis Not Working**
- Ensure uploaded files are in supported formats (PDF, DOCX, TXT, JSON)
- Check file size limits (typically 10MB)
- Verify the `analyze-document` Edge Function is deployed

### Performance Optimization

- **Model Selection**: Use GPT-5 Nano for fastest responses, GPT-5 for highest quality
- **Content Caching**: Generated content is automatically saved to avoid regeneration
- **Batch Processing**: Use Super Creator for generating multiple referral methods efficiently

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and TypeScript patterns
- Add appropriate error handling for all API calls
- Include JSDoc comments for complex functions
- Test new features thoroughly with different AI models
- Update documentation for any new features or API changes

## 📝 Changelog

### Version 2.0.0 (Latest)
- **NEW**: GPT-5 model support with OpenAI Responses API
- **NEW**: Enhanced consultant and agency accelerator programs
- **IMPROVED**: Better personalization with relationship type awareness
- **IMPROVED**: Enhanced voice and SMS tools
- **FIXED**: Various UI improvements and bug fixes

### Version 1.5.0
- Added Super Content Creator for batch generation
- Implemented LinkedIn profile analysis
- Enhanced document analysis capabilities
- Added comprehensive dashboard and analytics

### Version 1.0.0
- Initial release with core referral generation features
- Basic AI content generation with Gemini models
- Document upload and analysis
- Multi-format export capabilities

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing cutting-edge AI models
- **Supabase** for backend infrastructure and Edge Functions
- **Vercel** for hosting and deployment platform
- **Tailwind CSS** for utility-first CSS framework
- **Lucide** for beautiful, consistent icons
- **React community** for excellent libraries and tools

---

**Built with ❤️ for professionals who want to maximize their referral potential through AI.**

For support, questions, or feature requests, please open an issue or contact us at support@aireferralmaximizer.com