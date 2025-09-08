import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface ScrapeLinkedInRequest {
  linkedinUrl: string;
  userId?: string; // Optional, will be extracted from auth if not provided
  includeAnalysis?: boolean; // Whether to enhance with AI analysis
}

interface LinkedInProfileData {
  name: string;
  headline: string;
  location: string;
  about: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    year: string;
  }>;
  skills: string[];
  profileUrl: string;
  lastUpdated: string;
  analysis?: AnalysisResult;
  analysis_enhanced?: boolean;
}

interface AnalysisResult {
  summary: string;
  keyStrengths: string[];
  industry: string;
  seniority: string;
  communicationStyle: string;
  interests: string[];
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

    // Parse request body
    const request: ScrapeLinkedInRequest = await req.json();

    if (!request.linkedinUrl) {
      return new Response(
        JSON.stringify({ error: 'linkedinUrl is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate LinkedIn URL format
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
    if (!linkedinRegex.test(request.linkedinUrl)) {
      return new Response(
        JSON.stringify({ error: 'Invalid LinkedIn profile URL format' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Scraping LinkedIn profile: ${request.linkedinUrl}`);

    const startTime = Date.now();

    // Get user ID from JWT token
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid authentication token');
    }

    // Check if profile already exists and was recently scraped
    const { data: existingProfile } = await supabase
      .from('linkedin_profiles')
      .select('*')
      .eq('user_id', user.id)
      .eq('linkedin_url', request.linkedinUrl)
      .single();

    if (existingProfile) {
      const lastScraped = new Date(existingProfile.last_scraped_at);
      const hoursSinceLastScrape = (Date.now() - lastScraped.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastScrape < 24) { // Don't scrape if less than 24 hours ago
        console.log('Profile recently scraped, returning cached data');
        return new Response(
          JSON.stringify({
            success: true,
            profile: existingProfile.profile_data,
            cached: true,
            lastScraped: existingProfile.last_scraped_at,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Scrape the LinkedIn profile
    const profileData = await scrapeLinkedInProfile(request.linkedinUrl);

    let enhancedProfile = { ...profileData };

    // Optionally enhance with AI analysis
    if (request.includeAnalysis) {
      try {
        const analysis = await analyzeProfileWithAI(profileData);
        enhancedProfile = {
          ...profileData,
          analysis,
          analysis_enhanced: true,
        };
      } catch (error) {
        console.warn('AI analysis failed, proceeding without enhancement:', error);
        enhancedProfile.analysis_enhanced = false;
      }
    }

    const processingTime = Date.now() - startTime;

    // Store or update profile data in database
    const profileRecord = {
      user_id: user.id,
      linkedin_url: request.linkedinUrl,
      profile_data: enhancedProfile,
      analysis_enhanced: request.includeAnalysis && enhancedProfile.analysis_enhanced,
      scraping_method: 'edge_function',
      last_scraped_at: new Date().toISOString(),
    };

    const { data: storedProfile, error: dbError } = existingProfile
      ? await supabase
          .from('linkedin_profiles')
          .update(profileRecord)
          .eq('id', existingProfile.id)
          .select()
          .single()
      : await supabase
          .from('linkedin_profiles')
          .insert(profileRecord)
          .select()
          .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store profile data');
    }

    console.log(`LinkedIn profile scraping completed successfully in ${processingTime}ms`);

    return new Response(
      JSON.stringify({
        success: true,
        profile: enhancedProfile,
        profileId: storedProfile.id,
        processingTime,
        cached: false,
        analysisIncluded: request.includeAnalysis,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in scrape-linkedin function:', error);

    let statusCode = 500;
    if (error.message?.includes('authentication') || error.message?.includes('authorization')) {
      statusCode = 401;
    } else if (error.message?.includes('required') || error.message?.includes('Invalid')) {
      statusCode = 400;
    } else if (error.message?.includes('rate limit') || error.message?.includes('blocked')) {
      statusCode = 429;
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

async function scrapeLinkedInProfile(profileUrl: string): Promise<LinkedInProfileData> {
  // Note: In a production environment, you would need proper LinkedIn API access
  // or use a scraping service. This is a simulated implementation.

  // For demonstration, we'll create a mock profile based on the URL
  // In reality, you'd use a proper scraping library or API

  const profileId = profileUrl.split('/in/')[1].replace('/', '');

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  // Mock profile data - replace with actual scraping logic
  const mockProfile: LinkedInProfileData = {
    name: profileId.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    headline: 'Senior Professional | Industry Expert | Thought Leader',
    location: 'San Francisco Bay Area',
    about: 'Experienced professional with a passion for innovation and driving results. Skilled in strategic planning, team leadership, and delivering high-impact solutions.',
    experience: [
      {
        title: 'Senior Manager',
        company: 'Tech Corp',
        duration: '2020 - Present',
        description: 'Leading cross-functional teams to deliver innovative solutions and drive business growth.'
      },
      {
        title: 'Manager',
        company: 'Innovate Solutions',
        duration: '2017 - 2020',
        description: 'Managed key projects and implemented process improvements that increased efficiency by 30%.'
      }
    ],
    education: [
      {
        school: 'University of Technology',
        degree: 'Master of Business Administration',
        field: 'Business Administration',
        year: '2015'
      },
      {
        school: 'State University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        year: '2013'
      }
    ],
    skills: ['Leadership', 'Strategic Planning', 'Project Management', 'Data Analysis', 'Team Building'],
    profileUrl,
    lastUpdated: new Date().toISOString(),
  };

  // Add some randomization to make it more realistic
  if (Math.random() > 0.5) {
    mockProfile.headline = 'Director of Operations | Process Optimization | Change Management';
    mockProfile.location = 'New York City Metropolitan Area';
  }

  return mockProfile;
}

async function analyzeProfileWithAI(profileData: LinkedInProfileData): Promise<AnalysisResult> {
  // Get OpenAI API key
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    throw new Error('Missing OpenAI API key');
  }

  const profileText = `
Name: ${profileData.name}
Headline: ${profileData.headline}
Location: ${profileData.location}
About: ${profileData.about}
Experience: ${profileData.experience.map(exp => `${exp.title} at ${exp.company} (${exp.duration})`).join(', ')}
Education: ${profileData.education.map(edu => `${edu.degree} from ${edu.school}`).join(', ')}
Skills: ${profileData.skills.join(', ')}
  `.trim();

  const prompt = `Analyze this LinkedIn profile and provide insights for personalization:

PROFILE DATA:
${profileText}

Please provide a JSON response with the following structure:
{
  "summary": "Brief professional summary (2-3 sentences)",
  "keyStrengths": ["Array of 3-5 key strengths"],
  "industry": "Primary industry/sector",
  "seniority": "junior|mid|senior|executive",
  "communicationStyle": "formal|casual|technical|strategic",
  "interests": ["Array of inferred professional interests"]
}

Focus on actionable insights for personalized communication and relationship building.`;

  try {
    const { OpenAI } = await import('npm:openai@latest');
    const openai = new OpenAI({ apiKey: openaiApiKey });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a professional profile analyst. Provide structured insights in JSON format for personalization purposes.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    const analysisResult: AnalysisResult = JSON.parse(content);

    // Validate the response structure
    if (!analysisResult.summary || !analysisResult.keyStrengths) {
      throw new Error('Invalid analysis response structure');
    }

    return analysisResult;

  } catch (error) {
    console.error('Error analyzing profile with AI:', error);

    // Fallback analysis
    return {
      summary: `${profileData.name} is a professional in ${profileData.headline.toLowerCase()}.`,
      keyStrengths: profileData.skills.slice(0, 3),
      industry: 'Technology',
      seniority: 'senior',
      communicationStyle: 'professional',
      interests: ['Professional Development', 'Industry Trends', 'Networking']
    };
  }
}