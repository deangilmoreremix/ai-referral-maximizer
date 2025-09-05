/**
 * Profile Analyzer Utility
 * Helper functions for analyzing LinkedIn profiles and skills
 */

// Skill categories with common keywords
const SKILL_CATEGORIES: Record<string, string[]> = {
  technical: ['programming', 'development', 'software', 'engineering', 'code', 'data', 'analytics', 'architecture', 'infrastructure', 'technology', 'systems', 'developer', 'technical'],
  marketing: ['marketing', 'seo', 'content', 'social media', 'advertising', 'brand', 'digital', 'growth', 'acquisition', 'retention', 'communication', 'pr'],
  management: ['management', 'leadership', 'strategy', 'business', 'operations', 'planning', 'team', 'project', 'product', 'organization'],
  design: ['design', 'ux', 'ui', 'user experience', 'graphic', 'visual', 'creative', 'art', 'interface'],
  sales: ['sales', 'business development', 'account', 'client', 'revenue', 'negotiation', 'relationship', 'customer'],
  finance: ['finance', 'accounting', 'budget', 'financial', 'investment', 'tax', 'banking', 'monetary'],
  other: []
};

// High demand marketable skills
const HIGH_DEMAND_SKILLS = [
  'react', 'javascript', 'typescript', 'python', 'machine learning', 'data science', 'cloud',
  'aws', 'azure', 'product management', 'ux design', 'digital marketing', 'content strategy',
  'blockchain', 'ai', 'artificial intelligence', 'cyber security', 'devops', 'automation',
  'data analytics', 'full stack', 'node.js', 'agile', 'scrum'
];

// Map of industry keywords to standardized industry names
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  'Technology': ['software', 'tech', 'it', 'computer', 'digital', 'informationtechnology', 'saas', 'cloud', 'web', 'app'],
  'Healthcare': ['health', 'medical', 'pharma', 'biotech', 'hospital', 'clinic', 'patient', 'healthcare', 'medicine'],
  'Financial Services': ['finance', 'banking', 'insurance', 'investment', 'wealth', 'financial', 'fintech', 'bank', 'credit'],
  'Marketing & Advertising': ['marketing', 'advertising', 'media', 'digital marketing', 'agency', 'creative', 'brand'],
  'Education': ['education', 'academic', 'school', 'university', 'college', 'teaching', 'elearning', 'learn', 'student'],
  'Retail': ['retail', 'ecommerce', 'consumer goods', 'shopping', 'merchandise', 'store', 'shop'],
  'Manufacturing': ['manufacturing', 'production', 'factory', 'industrial', 'assembly', 'fabrication'],
  'Consulting': ['consulting', 'professional services', 'advisor', 'consultant'],
  'Real Estate': ['real estate', 'property', 'realty', 'construction', 'building', 'housing', 'commercial'],
  'Energy': ['energy', 'oil', 'gas', 'utilities', 'renewable', 'solar', 'wind', 'power']
};

/**
 * Categorize and enhance skills 
 */
export const categorizeAndEnhanceSkills = (skills: string[] = []) => {
  // Categorize each skill
  const categorizedSkills: Record<string, string[]> = {};
  const enhancedSkills: {
    name: string;
    category: string;
    endorsements: number;
    isMarketable: boolean;
  }[] = [];
  
  skills.forEach(skill => {
    // Handle both string and object skills
    let skillName = typeof skill === 'string' ? skill : (skill as any).name || skill;
    if (typeof skillName !== 'string') return;
    
    let assignedCategory = 'other';
    const lowerSkill = skillName.toLowerCase();
    
    // Determine category
    for (const [category, keywords] of Object.entries(SKILL_CATEGORIES)) {
      if (category === 'other') continue;
      
      if (keywords.some(keyword => lowerSkill.includes(keyword))) {
        assignedCategory = category;
        break;
      }
    }
    
    // Add to category array
    if (!categorizedSkills[assignedCategory]) {
      categorizedSkills[assignedCategory] = [];
    }
    categorizedSkills[assignedCategory].push(skillName);
    
    // Create enhanced skill object
    enhancedSkills.push({
      name: skillName,
      category: assignedCategory,
      endorsements: typeof skill === 'object' && (skill as any).endorsements ? (skill as any).endorsements : 0,
      isMarketable: isMarketableSkill(skillName)
    });
  });
  
  return {
    categorizedSkills,
    enhancedSkills,
    primaryCategory: determinePrimarySkillCategory(categorizedSkills)
  };
};

/**
 * Check if a skill is in high demand
 */
const isMarketableSkill = (skill: string): boolean => {
  return HIGH_DEMAND_SKILLS.some(highDemandSkill => 
    skill.toLowerCase().includes(highDemandSkill)
  );
};

/**
 * Determine the primary skill category
 */
const determinePrimarySkillCategory = (categorizedSkills: Record<string, string[]>): string => {
  let maxCategory = 'other';
  let maxCount = 0;
  
  for (const [category, skills] of Object.entries(categorizedSkills)) {
    if (skills.length > maxCount) {
      maxCount = skills.length;
      maxCategory = category;
    }
  }
  
  return maxCategory;
};

/**
 * Helper function for getting category color
 */
export const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    technical: 'blue',
    marketing: 'purple',
    management: 'indigo',
    design: 'pink',
    sales: 'orange',
    finance: 'emerald',
    other: 'gray'
  };
  
  return colorMap[category] || 'gray';
};

/**
 * Calculate profile completeness
 */
export const calculateProfileCompleteness = (data: any): number => {
  const fields = [
    { name: 'fullName', weight: 10 },
    { name: 'name', weight: 10 },
    { name: 'title', weight: 10 },
    { name: 'headline', weight: 10 },
    { name: 'location', weight: 5 },
    { name: 'skills', weight: 20 },
    { name: 'experience', weight: 20 },
    { name: 'education', weight: 15 },
    { name: 'about', weight: 10 },
    { name: 'description', weight: 10 }
  ];
  
  let score = 0;
  let totalWeight = 0;
  
  fields.forEach(field => {
    // Consider either name or fullName, title or headline
    if ((field.name === 'name' && data.fullName) || 
        (field.name === 'fullName' && data.name) ||
        (field.name === 'title' && data.headline) ||
        (field.name === 'headline' && data.title) ||
        (field.name === 'about' && data.description) ||
        (field.name === 'description' && data.about)) {
      return;
    }
    
    totalWeight += field.weight;
    
    if (data[field.name]) {
      if (Array.isArray(data[field.name])) {
        score += data[field.name].length > 0 ? field.weight : 0;
      } else {
        score += data[field.name] ? field.weight : 0;
      }
    }
  });
  
  return Math.round((score / totalWeight) * 100);
};

/**
 * Extract industry from profile data
 */
const extractIndustryFromProfile = (profile: any): string => {
  if (!profile) return '';
  
  // Check the explicit industry field first
  if (profile.industry) {
    // See if this matches any of our standardized industries
    for (const [standardIndustry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
      if (standardIndustry.toLowerCase() === profile.industry.toLowerCase()) {
        return standardIndustry;
      }
    }
  }
  
  // Check company description, headline, position etc.
  const textToAnalyze = [
    profile.description,
    profile.about,
    profile.headline,
    profile.industry,
    profile.companyDescription,
    ...(profile.experience || []).map((exp: any) => `${exp.company || ''} ${exp.description || ''}`)
  ].filter(Boolean).join(' ').toLowerCase();
  
  // Find industry with the most keyword matches
  let bestMatch = '';
  let bestMatchCount = 0;
  
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    const matchCount = keywords.filter(keyword => 
      textToAnalyze.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > bestMatchCount) {
      bestMatchCount = matchCount;
      bestMatch = industry;
    }
  }
  
  return bestMatch;
};

/**
 * Infer business size from profile data
 */
const suggestBusinessSize = (profile: any): string => {
  if (!profile) return 'medium';
  
  // Try to infer business size
  if (profile.companySize) {
    const size = profile.companySize.toLowerCase();
    
    if (size.includes('1-10') || size.includes('small') || size.includes('self-employed')) {
      return 'small';
    } else if (size.includes('10,000+') || size.includes('large') || size.includes('enterprise')) {
      return 'enterprise';
    } else {
      return 'medium';
    }
  }
  
  // If we have company name but no size, try to infer from company name
  if (profile.companyName) {
    const name = profile.companyName.toLowerCase();
    // Check for enterprise keywords
    if (name.includes('global') || name.includes('international') || 
        name.includes('worldwide') || name.includes('inc') || 
        name.includes('corporation') || name.includes('corp')) {
      return 'enterprise';
    }
    // Check for small business keywords
    else if (name.includes('freelance') || name.includes('consulting') || 
             name.includes('studio') || name.includes('agency')) {
      return 'small';
    }
  }
  
  // Default
  return 'medium';
};

/**
 * Extract education from profile data
 */
const extractEducation = (profile: any): string => {
  if (!profile) return '';
  
  if (profile.education) {
    if (typeof profile.education === 'string') {
      return profile.education;
    } else if (Array.isArray(profile.education)) {
      return profile.education.map((edu: any) => {
        if (typeof edu === 'string') return edu;
        return `${edu.school || edu.institution || ''} ${edu.degree || edu.qualification || ''}`.trim();
      }).join(' | ');
    }
  }
  
  return '';
};

/**
 * Create a summary of experience from profile data
 */
const summarizeExperience = (profile: any): string => {
  if (!profile || !profile.experience || !Array.isArray(profile.experience)) return '';
  
  const latestExperience = profile.experience[0];
  if (!latestExperience) return '';
  
  const company = latestExperience.company || latestExperience.companyName || '';
  const position = latestExperience.position || latestExperience.title || '';
  
  if (!company && !position) return '';
  
  return `${position} at ${company}`;
};

/**
 * Extract target audience from profile data
 */
const inferTargetAudienceFromProfile = (profile: any): string => {
  if (!profile) return '';
  
  // Start with skills-based inference
  if (profile.skills && profile.skills.length > 0) {
    const skillsData = categorizeAndEnhanceSkills(profile.skills);
    
    if (skillsData.primaryCategory === 'technical') {
      return 'Technical professionals and engineering leaders';
    } else if (skillsData.primaryCategory === 'marketing') {
      return 'Marketing teams and CMOs';
    } else if (skillsData.primaryCategory === 'sales') {
      return 'Sales professionals and business development teams';
    } else if (skillsData.primaryCategory === 'design') {
      return 'Design teams and creative directors';
    } else if (skillsData.primaryCategory === 'finance') {
      return 'Financial professionals and CFOs';
    } else if (skillsData.primaryCategory === 'management') {
      return 'Business executives and team leaders';
    }
  }
  
  // Infer from industry if skills don't give a clear picture
  if (profile.industry) {
    if (profile.industry.toLowerCase().includes('tech')) {
      return 'Technology companies and IT departments';
    } else if (profile.industry.toLowerCase().includes('health')) {
      return 'Healthcare providers and medical professionals';
    } else if (profile.industry.toLowerCase().includes('financ')) {
      return 'Financial institutions and professionals';
    } else if (profile.industry.toLowerCase().includes('edu')) {
      return 'Educational institutions and professionals';
    } else if (profile.industry.toLowerCase().includes('market')) {
      return 'Marketing teams and agencies';
    }
  }
  
  // Default audience based on company size
  const size = suggestBusinessSize(profile);
  if (size === 'enterprise') {
    return 'Enterprise organizations and corporate decision-makers';
  } else if (size === 'small') {
    return 'Small business owners and entrepreneurs';
  }
  
  return 'Industry professionals';
};