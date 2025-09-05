# AI Referral Maximizer

AI-powered referral content generation platform that helps businesses create professional referral scripts, strategies, and campaigns.

## Features

- 50+ referral methods across multiple categories
- AI-powered content generation using OpenAI models (including GPT-5 when available)
- Advanced personalization with document analysis
- LinkedIn profile integration
- Voice & SMS tools for direct outreach
- Multi-format exports (PDF, PPTX, DOCX)
- Content management dashboard

## Setup

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- OpenAI API account
- Supabase account (for user data and edge functions)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables file:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:
   ```bash
   # OpenAI API Key (required)
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### Getting API Keys

#### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

#### Supabase Configuration
1. Go to [Supabase](https://supabase.com/)
2. Create a new project or use existing one
3. Go to Settings > API
4. Copy the Project URL and anon/public key
5. Add them to your `.env` file

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

## OpenAI Model Support

The application supports multiple OpenAI models:

### Available Now
- **GPT-5**: Flagship next-generation model
- **GPT-5 Mini**: Faster and cheaper GPT-5 variant
- **GPT-5 Nano**: Lowest latency GPT-5 variant
- **GPT-4o**: Current best available model
- **GPT-4o Mini**: Efficient and capable
- **GPT-4 Turbo**: Powerful and versatile  
- **GPT-3.5 Turbo**: Fast and cost-effective

The application uses OpenAI's new Responses API, which is the recommended approach for new builds and provides access to the latest features.

## Usage

1. **Personalize Your Settings**: Start by configuring your industry, target audience, and business details
2. **Select a Referral Method**: Choose from 50+ available referral methods
3. **Generate Content**: Use AI to create professional, customized content
4. **Export & Use**: Download your content in multiple formats

## Development

### Adding New Referral Methods

1. Update the `contentTypes` object in `src/App.tsx`
2. Add appropriate prompts and configuration
3. Test content generation with different models

### Extending AI Capabilities

1. Modify `src/services/openAIService.ts` to add new functionality
2. Update the Edge Function in `supabase/functions/openai-gpt5/` if needed
3. Add new model types in `src/types/openai.ts`

## Deployment

The application can be deployed to various platforms:

1. **Vercel/Netlify**: For frontend deployment
2. **Supabase**: For backend services and edge functions
3. **Custom hosting**: Any platform supporting Node.js applications

## API Usage Verification

To verify your app is using live APIs instead of demo content:

1. **Check Network Tab**: Open browser dev tools and monitor requests to `api.openai.com`
2. **Verify API Key**: Ensure `OPENAI_API_KEY` is valid in your environment
3. **Check Logs**: Monitor console logs for API call information
4. **Test Generation**: Generated content should be unique and relevant to your inputs

If you see `[DEMO ... CONTENT]` in the output, it means the API call failed and fallback content was used.

## Support

For issues or questions:
- Check the console logs for detailed error messages
- Ensure API keys are correctly configured
- Verify network connectivity to OpenAI services

## License

[Your License Here]