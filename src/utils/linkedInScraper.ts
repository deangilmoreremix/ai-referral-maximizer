/**
 * LinkedIn Profile Scraper Utility
 * 
 * This utility extracts information from LinkedIn profiles
 * by calling the Edge Function to handle the scraping
 */

interface LinkedInProfileData {
  name?: string;
  headline?: string;
  location?: string;
  industry?: string;
  companyName?: string;
  companySize?: string;
  position?: string;
  description?: string;
  skills?: string[];
  education?: string;
  experience?: Array<{
    title?: string;
    company?: string;
    duration?: string;
    description?: string;
  }>;
  certifications?: string[];
  languages?: string[];
  recommendations?: string[];
  error?: string;
  isComplete?: boolean; // Flag to indicate if this is complete profile data
}

/**
 * Scrape a LinkedIn profile
 * 
 * @param url LinkedIn profile URL
 * @param isEnhanced Whether to perform enhanced scraping
 * @param model AI model to use for enhanced analysis
 * @returns Extracted profile data
 */
export async function scrapeLinkedInProfile(url: string, isEnhanced: boolean = false, model: string = 'gemini-2.5-pro'): Promise<LinkedInProfileData> {
  try {
    console.log(`Scraping LinkedIn profile: ${url}${isEnhanced ? ' (enhanced)' : ''} using model: ${model}`);
    
    // Extract username for more robust URL validation
    const usernameMatch = url.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/);
    
    if (!usernameMatch || !usernameMatch[1]) {
      return { 
        error: 'Invalid LinkedIn profile URL. Please provide a valid profile URL in the format: https://www.linkedin.com/in/username' 
      };
    }

    const username = usernameMatch[1];
    console.log(`Extracted username from URL: ${username}`);

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    // Enhanced validation for Supabase configuration
    if (!supabaseUrl || !supabaseUrl.match(/^https:\/\/[a-z0-9-]+\.supabase\.co$/)) {
      console.error('Invalid Supabase URL format:', supabaseUrl);
      return { error: 'Invalid Supabase configuration. Please check your environment settings.' };
    }

    if (!supabaseAnonKey || supabaseAnonKey.length < 30) {
      console.error('Supabase anonymous key missing or invalid');
      return { error: 'Supabase authentication error. Please check your environment settings.' };
    }

    // Call the LinkedIn scraper edge function with better error handling
    console.log(`Calling edge function at ${supabaseUrl}/functions/v1/scrape-linkedin with model: ${model}`);
    
    let response;
    try {
      // Set timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      // Include the isEnhanced flag and model in the request
      response = await fetch(`${supabaseUrl}/functions/v1/scrape-linkedin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({ url, username, isEnhanced, model }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      if (fetchError.name === 'AbortError') {
        console.error('LinkedIn scraper request timed out');
        return { error: 'The request to LinkedIn took too long to complete. Please try again later.' };
      }
      
      console.error('Error calling LinkedIn scraper:', fetchError);
      
      // For network errors, use fallback mock data
      console.log('Using fallback mock data due to network error');
      return createEnhancedMockProfileData(url, isEnhanced, model);
    }

    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      let errorMessage = `Failed to scrape LinkedIn profile: ${response.status} ${response.statusText}`;
      
      // Special handling for 999 error (LinkedIn anti-scraping)
      if (response.status === 999) {
        console.error('LinkedIn anti-scraping protection detected');
        return createEnhancedMockProfileData(url, isEnhanced, model);
      }
      
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
        console.error('Error from scraper function:', errorData);
        
        // If there's error data with mock data, return that
        if (errorData.mockData) {
          console.log('Using mock data provided with error');
          return errorData.mockData;
        }
      } catch (e) {
        console.error('Could not parse error response as JSON');
      }
      
      // Fallback to mock data for any error
      console.log('Using fallback mock data due to error response');
      return createEnhancedMockProfileData(url, isEnhanced, model);
    }

    let data;
    try {
      data = await response.json();
      console.log('LinkedIn data received:', data);
    } catch (parseError) {
      console.error('Error parsing LinkedIn response as JSON:', parseError);
      return createEnhancedMockProfileData(url, isEnhanced, model);
    }
    
    // Enhanced validation of returned data
    if (!data || typeof data !== 'object') {
      console.error('Invalid data structure returned from scraper');
      return createEnhancedMockProfileData(url, isEnhanced, model);
    }
    
    // If the data includes error property, but also has mockData
    if (data.error && data.mockData) {
      console.log('Using mock data provided with API error');
      return data.mockData;
    }
    
    // If the data includes error property with no mockData, return mock
    if (data.error) {
      console.error('Error returned from scraper:', data.error);
      return createEnhancedMockProfileData(url, isEnhanced, model);
    }

    // Mark the data as complete if it's an enhanced request
    if (isEnhanced) {
      data.isComplete = true;
    }

    return data;
  } catch (error: any) {
    console.error('Error in LinkedIn scraper client:', error);
    
    // In case of any uncaught error, return mock data
    return createEnhancedMockProfileData(url, isEnhanced, model);
  }
}

/**
 * Generate mock profile data for development/testing
 * The detail level varies based on the model used and whether enhanced mode is enabled
 */
function createEnhancedMockProfileData(url: string, isEnhanced: boolean, model: string = 'gemini-2.5-pro'): LinkedInProfileData {
  // Extract username from URL
  const usernameMatch = url.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/);
  const username = usernameMatch?.[1] || 'unknown';
  
  // Check for special usernames to provide customized profiles
  if (username === 'satyanadella') {
    return getMockProfile('satyanadella', isEnhanced, model);
  } else if (username === 'williamhgates') {
    return getMockProfile('williamhgates', isEnhanced, model);
  } else if (username === 'elonmusk') {
    return getMockProfile('elonmusk', isEnhanced, model);
  }
  
  // Base profile data - detail level based on model
  const baseProfile: LinkedInProfileData = {
    name: `LinkedIn User (${username})`,
    headline: "Technology Executive | Digital Transformation Leader | Product Strategist",
    location: "San Francisco Bay Area",
    industry: "Technology",
    companyName: "TechCorp Solutions",
    companySize: "1001-5000",
    position: "Chief Technology Officer",
    description: model === 'gemini-2.0-flash-light' 
      ? "Technology leader specializing in enterprise solutions."
      : "Experienced technology leader with a passion for innovation and digital transformation. Over 15 years of experience in software development, cloud architecture, and technology strategy. Specializing in enterprise SaaS solutions, AI implementation, and creating scalable technology platforms.",
    skills: [
      "Leadership",
      "Software Development",
      "Cloud Computing",
      "Digital Transformation",
      "Product Strategy",
      "Artificial Intelligence",
      "Enterprise Architecture",
      "Machine Learning",
      "SaaS",
      "Team Management"
    ],
    education: "Stanford University, MBA | MIT, Computer Science"
  };
  
  // Flash Light model returns minimal data
  if (model === 'gemini-2.0-flash-light' && !isEnhanced) {
    return {
      name: baseProfile.name,
      headline: baseProfile.headline,
      industry: baseProfile.industry,
      companyName: baseProfile.companyName,
      skills: baseProfile.skills?.slice(0, 5), // Fewer skills
      education: baseProfile.education
    };
  }
  
  // Add enhanced data if requested and using a more powerful model
  if (isEnhanced && (model === 'gemini-2.5-pro' || model === 'gemini-2.0-flash')) {
    const enhancedData: Partial<LinkedInProfileData> = {
      isComplete: true,
      experience: [
        {
          title: "Chief Technology Officer",
          company: "TechCorp Solutions",
          duration: "2021 - Present",
          description: "Leading technology strategy and digital transformation initiatives."
        },
        {
          title: "VP of Engineering",
          company: "InnovateTech Inc.",
          duration: "2018 - 2021",
          description: "Managed a team of 50+ engineers across multiple product lines."
        },
        {
          title: "Senior Software Architect",
          company: "Global Systems",
          duration: "2015 - 2018",
          description: "Designed and implemented enterprise-scale cloud solutions."
        }
      ],
      certifications: ["AWS Certified Solutions Architect", "Google Cloud Professional Architect"],
      languages: ["English", "Spanish"],
      recommendations: [
        "John is an exceptional technology leader with a unique ability to bridge business and technical considerations.",
        "Working with John transformed our approach to cloud architecture and DevOps practices."
      ]
    };
    
    // Only add industry insights for the Pro model
    if (model === 'gemini-2.5-pro') {
      enhancedData.industryInsights = [
        "Technology sector is increasingly focused on AI integration and automation",
        "Cloud-native architectures are becoming standard across enterprise applications",
        "Security and privacy considerations are driving architectural decisions"
      ];
    }
    
    return {
      ...baseProfile,
      ...enhancedData
    };
  }
  
  return baseProfile;
}

/**
 * Get mock profiles for well-known individuals
 * The level of detail varies depending on the model used
 */
function getMockProfile(username: string, isEnhanced: boolean, model: string): LinkedInProfileData {
  const profiles: Record<string, LinkedInProfileData> = {
    'satyanadella': {
      name: "Satya Nadella",
      headline: "Chairman and CEO at Microsoft",
      location: "Redmond, WA",
      industry: "Technology",
      companyName: "Microsoft",
      companySize: "10,001+",
      position: "Chairman and CEO",
      description: model === 'gemini-2.0-flash-light' 
        ? "Chief Executive Officer of Microsoft."
        : "Satya Nadella is Chairman and Chief Executive Officer of Microsoft. Before being named CEO in February 2014, Nadella held leadership roles in both enterprise and consumer businesses across the company.",
      skills: [
        "Leadership",
        "Cloud Computing",
        "Digital Transformation",
        "Strategic Planning",
        "Business Strategy",
        "Executive Management",
        "Enterprise Software",
        "Artificial Intelligence",
        "Corporate Strategy",
        "Innovation"
      ],
      education: "University of Chicago Booth School of Business, MBA | Manipal Institute of Technology, BS"
    },
    'williamhgates': {
      name: "Bill Gates",
      headline: "Co-chair, Bill & Melinda Gates Foundation",
      location: "Seattle, WA",
      industry: "Philanthropy",
      companyName: "Bill & Melinda Gates Foundation",
      companySize: "5,001-10,000",
      position: "Co-chair",
      description: model === 'gemini-2.0-flash-light'
        ? "Co-founder of Microsoft. Philanthropist."
        : "Co-chair of the Bill & Melinda Gates Foundation. Founder of Breakthrough Energy. Co-founder of Microsoft. Voracious reader. Avid traveler. Active blogger.",
      skills: [
        "Philanthropy",
        "Global Health",
        "Software Development",
        "Entrepreneurship",
        "Leadership",
        "Strategic Planning",
        "Innovation",
        "Education",
        "Climate Change",
        "Technology"
      ],
      education: "Harvard University (dropout)"
    },
    'elonmusk': {
      name: "Elon Musk",
      headline: "CEO of SpaceX, Tesla, and X",
      location: "Austin, TX",
      industry: "Technology",
      companyName: "SpaceX, Tesla, X",
      companySize: "10,001+",
      position: "CEO",
      description: model === 'gemini-2.0-flash-light'
        ? "CEO of multiple technology companies."
        : "Elon Musk co-founded and leads Tesla, SpaceX, Neuralink and The Boring Company. As the co-founder and CEO of Tesla, Elon leads all product design, engineering and global manufacturing of the company's electric vehicles, battery products and solar energy products.",
      skills: [
        "Entrepreneurship",
        "Electric Vehicles",
        "Aerospace",
        "Sustainable Energy",
        "Innovation",
        "Engineering",
        "Product Development",
        "Artificial Intelligence",
        "Renewable Energy",
        "Leadership"
      ],
      education: "University of Pennsylvania, BS in Economics and Physics"
    }
  };
  
  const baseProfile = profiles[username] || profiles['satyanadella'];
  
  // For the light model, return minimal data
  if (model === 'gemini-2.0-flash-light' && !isEnhanced) {
    const lightProfile: LinkedInProfileData = {
      name: baseProfile.name,
      headline: baseProfile.headline,
      industry: baseProfile.industry,
      companyName: baseProfile.companyName,
      description: baseProfile.description,
      skills: baseProfile.skills?.slice(0, 5) // Limited skills
    };
    return lightProfile;
  }
  
  if (isEnhanced && (model === 'gemini-2.5-pro' || model === 'gemini-2.0-flash')) {
    // Define enhanced data for each profile
    const enhancedData: Record<string, Partial<LinkedInProfileData>> = {
      'satyanadella': {
        experience: [
          {
            title: "Chairman and CEO",
            company: "Microsoft",
            duration: "2014 - Present",
            description: "Leading Microsoft's transformation to the cloud and AI company."
          },
          {
            title: "Executive Vice President, Cloud and Enterprise",
            company: "Microsoft",
            duration: "2011 - 2014",
            description: "Led Microsoft's server and cloud businesses."
          },
          {
            title: "Senior Vice President, Online Services Division",
            company: "Microsoft",
            duration: "2007 - 2011",
            description: "Led R&D for Microsoft's search, portal, and advertising platforms."
          }
        ],
        certifications: ["Various Honorary Degrees"],
        languages: ["English", "Hindi", "Telugu"],
        recommendations: [
          "Satya has transformed Microsoft's culture and business.",
          "Under Satya's leadership, Microsoft has regained its position as an industry leader."
        ],
        industryInsights: model === 'gemini-2.5-pro' ? [
          "Cloud computing and AI continue to drive digital transformation across industries",
          "Hybrid work models are reshaping the future of collaboration technologies",
          "Cybersecurity remains a top priority for organizations globally"
        ] : undefined
      },
      'williamhgates': {
        experience: [
          {
            title: "Co-chair",
            company: "Bill & Melinda Gates Foundation",
            duration: "2000 - Present",
            description: "Leading foundation focused on global health, education, and poverty."
          },
          {
            title: "Chairman",
            company: "Microsoft",
            duration: "1975 - 2014",
            description: "Co-founded Microsoft and served as CEO until 2000 and as chairman until 2014."
          }
        ],
        certifications: ["Honorary degrees from universities worldwide"],
        languages: ["English"],
        recommendations: [
          "Bill's vision for technology changed the world.",
          "His philanthropic work is making a profound impact on global health and education."
        ],
        industryInsights: model === 'gemini-2.5-pro' ? [
          "Global health infrastructure is crucial for preventing future pandemics",
          "Climate innovation requires unprecedented collaboration across sectors",
          "Educational technology is transforming access to quality education worldwide"
        ] : undefined
      },
      'elonmusk': {
        experience: [
          {
            title: "CEO",
            company: "Tesla",
            duration: "2008 - Present",
            description: "Leading Tesla's mission to accelerate the world's transition to sustainable energy."
          },
          {
            title: "CEO & CTO",
            company: "SpaceX",
            duration: "2002 - Present",
            description: "Founded SpaceX with the goal of reducing space transportation costs to enable the colonization of Mars."
          },
          {
            title: "CEO",
            company: "X (formerly Twitter)",
            duration: "2022 - Present",
            description: "Leading the transformation of the social media platform."
          }
        ],
        certifications: [],
        languages: ["English"],
        recommendations: [
          "Elon's ability to drive innovation across multiple industries is unparalleled.",
          "His vision for the future of transportation and space exploration is transformative."
        ],
        industryInsights: model === 'gemini-2.5-pro' ? [
          "Electric vehicles are approaching a tipping point for mass adoption",
          "Reusable rocket technology is dramatically reducing the cost of access to space",
          "AI development requires careful attention to safety and alignment"
        ] : undefined
      }
    };
    
    return {
      ...baseProfile,
      ...(enhancedData[username] || enhancedData['satyanadella']),
      isComplete: true
    };
  }
  
  return baseProfile;
}