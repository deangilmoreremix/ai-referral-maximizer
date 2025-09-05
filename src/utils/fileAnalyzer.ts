/**
 * Utility for analyzing uploaded files and extracting useful information
 * for content personalization.
 * 
 * NOTE: This is used as a fallback when the edge function is not available.
 */

// Simple industry keywords for identification
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  'Technology': ['software', 'tech', 'technology', 'digital', 'app', 'platform', 'saas', 'cloud', 'computing', 'IT', 'information technology', 'developer', 'programming', 'AI', 'artificial intelligence', 'machine learning'],
  'Healthcare': ['healthcare', 'health', 'medical', 'hospital', 'clinic', 'patient', 'doctor', 'physician', 'pharmaceutical', 'biotech', 'medicine', 'care', 'wellness', 'therapy'],
  'Financial Services': ['finance', 'financial', 'banking', 'bank', 'investment', 'insurance', 'loan', 'mortgage', 'capital', 'fintech', 'wealth', 'asset', 'portfolio', 'credit', 'payment'],
  'Retail': ['retail', 'store', 'shop', 'e-commerce', 'ecommerce', 'consumer', 'customer', 'product', 'merchandise', 'shopping', 'brand', 'marketplace'],
  'Manufacturing': ['manufacturing', 'factory', 'production', 'assembly', 'supply chain', 'operations', 'industrial', 'machinery', 'fabrication', 'materials', 'engineering'],
  'Education': ['education', 'school', 'university', 'college', 'learning', 'student', 'teaching', 'academic', 'classroom', 'course', 'training', 'edtech'],
  'Professional Services': ['consultancy', 'consulting', 'professional services', 'agency', 'law firm', 'accounting', 'service provider', 'advisor', 'consultant'],
  'Real Estate': ['real estate', 'property', 'housing', 'commercial property', 'residential', 'leasing', 'apartment', 'building', 'development', 'construction'],
};

// Business size indicators
const BUSINESS_SIZE_INDICATORS: Record<string, string[]> = {
  'small': ['small business', 'startup', 'small team', 'few employees', 'local business', 'family business'],
  'medium': ['medium business', 'growing company', 'medium-sized', 'regional business', 'mid-market'],
  'enterprise': ['enterprise', 'corporation', 'large organization', 'Fortune 500', 'multinational', 'global company', 'corporate', 'conglomerate'],
};

// Audience keywords
const AUDIENCE_KEYWORDS: Record<string, string[]> = {
  'B2B': ['B2B', 'business to business', 'business clients', 'other businesses', 'corporate clients', 'vendors', 'suppliers', 'enterprise customers'],
  'B2C': ['B2C', 'business to consumer', 'consumers', 'retail customers', 'individuals', 'customers', 'shoppers', 'end users'],
  'small business owners': ['small business owners', 'entrepreneurs', 'solopreneurs', 'startups', 'small enterprise'],
  'enterprise decision makers': ['C-level', 'executives', 'decision makers', 'management', 'leadership', 'board members', 'directors', 'executives'],
  'professionals': ['professionals', 'workers', 'employees', 'workforce', 'staff', 'team members'],
  'technical audience': ['developers', 'engineers', 'IT professionals', 'technical staff', 'system administrators', 'analysts'],
  'healthcare professionals': ['doctors', 'physicians', 'nurses', 'medical staff', 'healthcare providers', 'clinicians'],
  'students': ['students', 'learners', 'scholars', 'academics', 'faculty'],
};

// Common PDF artifacts and patterns to filter out
const PDF_ARTIFACT_PATTERNS = [
  /\/Type/i, /\/StructElem/i, /\/OBJR/i, /\/Pg/i, /\/P\s+/i,
  /\/MCID/i, /\/K\s+/i, /\/Font/i, /\/F\d+/i, /obj/i, 
  /endobj/i, /stream/i, /endstream/i, /\/Length/i, /\/S\s+\/\w+/i,
  /xref/i, /trailer/i, /startxref/i, /\/Root/i, /\/Info/i,
  /\/Contents/i, /\/Resources/i, /\/Annots/i, /\/Parent/i,
  /\/MediaBox/i, /\/CropBox/i, /\/Rotate/i, /\/BBox/i, 
  /\/Form/i, /\/XObject/i, /\/ExtGState/i, /endstream endobj/i,
  /^\d+\s+\d+\s+obj$/m, /^\d+\s+\d+\s+R$/m, /^\d+\s+\d+$/m
];

/**
 * Analyze file content to extract key information
 * 
 * @param content File content as string (or data URL)
 * @param fileType MIME type of the file
 * @returns Analysis results with extracted information
 */
export async function analyzeFileContent(
  content: string,
  fileType: string
): Promise<any> {
  // Skip analysis for data URLs (like images)
  if (content.startsWith('data:') && !fileType.includes('text/')) {
    return { error: 'Content is not analyzable (binary data)' };
  }

  console.log(`Analyzing file content (${content.length} chars, type: ${fileType})`);
  
  // Clean up PDF artifacts and binary data
  content = cleanupTextContent(content);
  
  // Extract text content for analysis
  let textContent = content;
  
  // If it's a JSON file, stringify it for text analysis
  if (fileType === 'application/json') {
    try {
      const jsonData = JSON.parse(content);
      textContent = JSON.stringify(jsonData, null, 2);
    } catch (e) {
      console.error('Error parsing JSON for analysis:', e);
    }
  }
  
  // Basic analysis results structure
  const results: any = {
    wordCount: 0,
    topKeywords: [],
    keyPoints: [],
    topics: [],
    industry: null,
    businessSize: null,
    targetAudience: null,
    tone: null,
    competitors: [],
  };
  
  // Skip empty content
  if (!textContent || textContent.trim() === '') {
    return { error: 'No content to analyze' };
  }
  
  // Clean and normalize text
  const cleanedText = textContent
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
  
  // Calculate word count
  const words = cleanedText.split(' ').filter(w => w.length > 2);
  results.wordCount = words.length;
  
  // Identify industry
  results.industry = identifyIndustry(cleanedText);
  
  // Identify business size
  results.businessSize = identifyBusinessSize(cleanedText);
  
  // Identify target audience
  results.targetAudience = identifyTargetAudience(cleanedText);
  
  // Extract topics (simple implementation - could be enhanced with actual NLP)
  results.topics = extractTopics(cleanedText);
  
  // Extract key points
  results.keyPoints = extractKeyPoints(textContent);
  
  // Identify tone
  results.tone = identifyTone(cleanedText);
  
  // Extract potential competitors
  results.competitors = extractCompetitors(textContent);
  
  // Do a final check and cleanup of results
  return sanitizeResults(results);
}

/**
 * Clean up text content from binary or structural artifacts
 */
function cleanupTextContent(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  let cleanedText = text
    // Remove binary data patterns
    .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\xFF]+/g, ' ')
    // Remove PDF structural markers
    .replace(/obj|endobj|stream|endstream|startxref|xref|trailer/g, ' ')
    // Remove PDF object references like "3 0 R"
    .replace(/\d+ \d+ R/g, ' ')
    // Remove strange unicode characters
    .replace(/[^\u0020-\u007E\u00A0-\u00FF\u0100-\u017F\u0180-\u024F\u0370-\u03FF\u0400-\u04FF]+/g, ' ')
    // Remove PDF structure elements
    .replace(/\/Type\s+\/\w+|\/StructElem|\/P\s+\/\w+|\/Pg\s+|\/OBJR|\/MCID|\/S\s+\/\w+|\/K\s+\[/g, ' ')
    // Collapse multiple spaces and non-standard whitespace
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleanedText;
}

/**
 * Sanitize results to remove any remaining PDF artifacts or garbage text
 */
function sanitizeResults(results: any): any {
  // Helper to clean an array of strings
  const cleanStringArray = (arr: string[]): string[] => {
    if (!Array.isArray(arr)) return [];
    
    return arr
      .filter(item => {
        if (!item || typeof item !== 'string') return false;
        
        // Skip items that match PDF artifact patterns
        for (const pattern of PDF_ARTIFACT_PATTERNS) {
          if (pattern.test(item)) return false;
        }
        
        // Check for reasonable character ratio
        const totalChars = item.length;
        if (totalChars < 10) return false;
        
        // Count alphabetic characters
        const alphaChars = (item.match(/[a-zA-Z]/g) || []).length;
        const alphaRatio = alphaChars / totalChars;
        
        // If less than 40% of characters are alphabetic, it's likely garbage
        if (alphaRatio < 0.4) return false;
        
        // If it contains too many special characters, it's likely garbage
        const specialChars = (item.match(/[^a-zA-Z0-9\s.,;:?!()'"]/g) || []).length;
        const specialRatio = specialChars / totalChars;
        if (specialRatio > 0.15) return false;
        
        return true;
      })
      .map(item => item.trim())
      .filter(item => item.length >= 10); // Ensure reasonable length
  };
  
  // Clean arrays in the results
  if (results.keyPoints) {
    results.keyPoints = cleanStringArray(results.keyPoints);
  }
  
  if (results.topics) {
    results.topics = cleanStringArray(results.topics);
  }
  
  if (results.competitors) {
    results.competitors = cleanStringArray(results.competitors);
  }
  
  if (results.topKeywords) {
    // For keywords, we'll be less strict since they're shorter
    results.topKeywords = results.topKeywords
      .filter((kw: string) => {
        if (!kw || typeof kw !== 'string') return false;
        if (kw.length < 3 || kw.length > 25) return false;
        for (const pattern of PDF_ARTIFACT_PATTERNS) {
          if (pattern.test(kw)) return false;
        }
        return true;
      });
  }
  
  return results;
}

/**
 * Identify the industry based on keyword frequency
 */
function identifyIndustry(text: string): string | null {
  const industryMatches: Record<string, number> = {};
  
  // Check for keywords from each industry
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    let matches = 0;
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const occurrences = (text.match(regex) || []).length;
      matches += occurrences;
    }
    
    if (matches > 0) {
      industryMatches[industry] = matches;
    }
  }
  
  // Find industry with most matches
  if (Object.keys(industryMatches).length === 0) {
    return null;
  }
  
  return Object.entries(industryMatches)
    .sort((a, b) => b[1] - a[1])[0][0];
}

/**
 * Identify business size based on indicators
 */
function identifyBusinessSize(text: string): string | null {
  const sizeMatches: Record<string, number> = {};
  
  // Check for keywords from each size category
  for (const [size, indicators] of Object.entries(BUSINESS_SIZE_INDICATORS)) {
    let matches = 0;
    for (const indicator of indicators) {
      const regex = new RegExp(`\\b${indicator}\\b`, 'gi');
      const occurrences = (text.match(regex) || []).length;
      matches += occurrences;
    }
    
    if (matches > 0) {
      sizeMatches[size] = matches;
    }
  }
  
  // Default to 'medium' if no strong indicators
  if (Object.keys(sizeMatches).length === 0) {
    return 'medium';
  }
  
  return Object.entries(sizeMatches)
    .sort((a, b) => b[1] - a[1])[0][0];
}

/**
 * Identify target audience based on keyword matches
 */
function identifyTargetAudience(text: string): string | null {
  const audienceMatches: Record<string, number> = {};
  
  // Check for keywords from each audience category
  for (const [audience, keywords] of Object.entries(AUDIENCE_KEYWORDS)) {
    let matches = 0;
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const occurrences = (text.match(regex) || []).length;
      matches += occurrences;
    }
    
    if (matches > 0) {
      audienceMatches[audience] = matches;
    }
  }
  
  // No strong audience signals found
  if (Object.keys(audienceMatches).length === 0) {
    return null;
  }
  
  return Object.entries(audienceMatches)
    .sort((a, b) => b[1] - a[1])[0][0];
}

/**
 * Extract main topics from the text
 */
function extractTopics(text: string): string[] {
  // This is a simplified implementation
  // In a real scenario, you would use NLP for topic modeling
  
  // Simple frequency-based approach
  const words = text.split(/\W+/).filter(w => w.length > 3);
  const stopWords = ['about', 'after', 'again', 'also', 'because', 'before', 'being', 'between', 'both', 'could', 'doing', 'during', 'each', 'either', 'every', 'from', 'having', 'here', 'into', 'itself', 'just', 'more', 'most', 'much', 'once', 'only', 'other', 'over', 'same', 'some', 'such', 'than', 'that', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'under', 'until', 'very', 'what', 'where', 'which', 'while', 'with', 'your'];
  
  // Count word frequencies, excluding stop words
  const wordCounts: Record<string, number> = {};
  for (const word of words) {
    if (!stopWords.includes(word)) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  }
  
  // Check if it's a reasonable word
  const isRealWord = (word: string): boolean => {
    // Reject words that are just numbers
    if (/^\d+$/.test(word)) return false;
    
    // Reject words that are hex-like
    if (/^[0-9a-f]{4,}$/i.test(word)) return false;
    
    // Reject words that have no vowels unless they're very common acronyms
    const commonAcronyms = ['pdf', 'html', 'css', 'seo', 'ui', 'ux'];
    if (!/[aeiouy]/i.test(word) && !commonAcronyms.includes(word.toLowerCase())) return false;
    
    // Reject words with weird character distributions
    const consonants = (word.match(/[bcdfghjklmnpqrstvwxz]/gi) || []).length;
    const vowels = (word.match(/[aeiouy]/gi) || []).length;
    
    // Words typically have a consonant-to-vowel ratio between 0.5 and 3
    const ratio = consonants / (vowels || 1); // Avoid division by zero
    if (ratio < 0.5 || ratio > 3.5) return false;
    
    return true;
  };
  
  // Get top words by frequency
  const topWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .filter(([word]) => isRealWord(word))
    .slice(0, 5)
    .map(([word]) => word);
  
  // If we don't have enough topics, try a different approach - find common phrases
  if (topWords.length < 3) {
    // Try to extract meaningful phrases from the text
    const phrases = extractMeaningfulPhrases(text);
    if (phrases.length > 0) {
      return phrases.slice(0, 5);
    }
  }
  
  return topWords;
}

/**
 * Extract meaningful phrases from text
 */
function extractMeaningfulPhrases(text: string): string[] {
  // Split into sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 15);
  
  // Apply some basic phrase extraction - look for noun phrases
  const nounPhrasePatterns = [
    /\b(the|a|an)\s+\w+\s+(of|for|in|with|by)\s+\w+\b/gi,    // "the process of development"
    /\b(our|your|their|his|her)\s+\w+\s+\w+\b/gi,            // "our company values"
    /\b\w+\s+(strategy|process|system|approach|method)\b/gi,  // "development strategy"
    /\b(business|market|industry|customer|client)\s+\w+\b/gi, // "business goals"
    /\b(digital|online|mobile|web)\s+\w+\b/gi                // "digital transformation"
  ];
  
  const phrases: string[] = [];
  
  // Extract phrases matching our patterns
  nounPhrasePatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    phrases.push(...matches.filter(m => m.length > 8 && m.length < 30));
  });
  
  // Get topic-like phrases by taking the first part of relevant sentences
  sentences.forEach(sentence => {
    sentence = sentence.trim();
    if (sentence.length > 30 && sentence.length < 100) {
      // Take the first half of the sentence
      const topicPhrase = sentence.split(/,|;/)[0].trim();
      if (topicPhrase.length > 15 && topicPhrase.length < 60) {
        phrases.push(topicPhrase);
      }
    }
  });
  
  // Deduplicate and filter
  return [...new Set(phrases)]
    .filter(phrase => {
      // Filter out phrases that look like PDF artifacts
      for (const pattern of PDF_ARTIFACT_PATTERNS) {
        if (pattern.test(phrase)) return false;
      }
      
      // Count alphabetic characters
      const alphaChars = (phrase.match(/[a-zA-Z]/g) || []).length;
      // Make sure it has enough meaningful text
      return alphaChars > 10;
    })
    .slice(0, 5);
}

/**
 * Extract key points from the text
 */
function extractKeyPoints(text: string): string[] {
  // Filter out PDF artifacts first
  text = cleanupTextContent(text);
  
  // Simple heuristic - look for sentences with "key" words or starting with bullets
  const keyIndicators = [
    'important', 'critical', 'essential', 'crucial', 'significant', 
    'main goal', 'objective', 'priority', 'focus', 'requirement',
    'key', 'primary', 'core', 'central', 'fundamental', 'major'
  ];
  
  // Split into sentences (simple split, not perfect)
  const sentences = text.replace(/([.!?])\s+/g, "$1|").split("|");
  
  // Filter out PDF artifact sentences
  const cleanSentences = sentences.filter(sentence => {
    const trimmedSentence = sentence.trim();
    // Skip empty or very short sentences
    if (trimmedSentence.length < 15) return false;
    
    // Filter out sentences that look like PDF artifacts
    for (const pattern of PDF_ARTIFACT_PATTERNS) {
      if (pattern.test(trimmedSentence)) return false;
    }
    
    // Make sure sentence has enough actual text
    const alphaCharCount = (trimmedSentence.match(/[a-zA-Z]/g) || []).length;
    return alphaCharCount > 10;
  });
  
  // Find sentences containing key indicators
  const keyPointSentences = cleanSentences.filter(sentence => {
    const lowerSentence = sentence.toLowerCase();
    return keyIndicators.some(indicator => lowerSentence.includes(indicator));
  });
  
  // If no key indicators found, collect bullet points or numbered items
  let bulletPoints: string[] = [];
  if (keyPointSentences.length < 3) {
    const lines = text.split('\n');
    bulletPoints = lines
      .filter(line => {
        const trimmedLine = line.trim();
        return (
          trimmedLine.startsWith('-') || 
          trimmedLine.startsWith('•') || 
          trimmedLine.startsWith('*') || 
          /^\d+\.\s/.test(trimmedLine)
        );
      })
      .map(line => line.replace(/^[-•*\d.]\s+/g, '').trim())
      .filter(line => {
        // Make sure line has enough actual text 
        const alphaCharCount = (line.match(/[a-zA-Z]/g) || []).length;
        return (
          line.length > 15 && 
          alphaCharCount > 10 &&
          // Check it doesn't look like a PDF artifact
          !PDF_ARTIFACT_PATTERNS.some(pattern => pattern.test(line))
        );
      });
  }
  
  // Combine found key points, bullet points, and maybe some top sentences
  let keyPoints = [...keyPointSentences, ...bulletPoints];
  
  // If still not enough, use some of the longest complete sentences
  if (keyPoints.length < 3) {
    const goodSentences = cleanSentences
      .filter(s => s.length > 30 && s.length < 150)
      .sort((a, b) => b.length - a.length) // Prioritize longer, more complete sentences
      .slice(0, 5 - keyPoints.length);
      
    keyPoints = [...keyPoints, ...goodSentences];
  }
  
  // Final cleanup and de-duplication
  return [...new Set(keyPoints)]
    .map(p => p.trim())
    .slice(0, 5);
}

/**
 * Identify the tone of the document
 */
function identifyTone(text: string): string {
  const toneIndicators = {
    'formal': ['formal', 'professional', 'official', 'corporate', 'business', 'respectful'],
    'conversational': ['conversational', 'friendly', 'casual', 'personal', 'approachable'],
    'technical': ['technical', 'specialized', 'detailed', 'precise', 'analytical'],
    'persuasive': ['persuasive', 'compelling', 'convincing', 'promotional', 'marketing'],
    'informative': ['informative', 'educational', 'helpful', 'instructional', 'explanatory']
  };
  
  const toneMatches: Record<string, number> = {};
  
  // Check for tone indicators
  for (const [tone, indicators] of Object.entries(toneIndicators)) {
    let matches = 0;
    for (const indicator of indicators) {
      const regex = new RegExp(`\\b${indicator}\\b`, 'gi');
      const occurrences = (text.match(regex) || []).length;
      matches += occurrences;
    }
    
    toneMatches[tone] = matches;
  }
  
  // Default to 'conversational' if no good matches
  if (Object.values(toneMatches).every(count => count === 0)) {
    return 'conversational';
  }
  
  // Find tone with most matches
  return Object.entries(toneMatches)
    .sort((a, b) => b[1] - a[1])[0][0];
}

/**
 * Extract potential competitors mentioned in the text
 */
function extractCompetitors(text: string): string[] {
  // Look for company names after competitor-indicating words
  const competitorIndicators = [
    'competitor', 'competition', 'rival', 
    'alternative to', 'compared to', 'versus', 'vs.', 
    'similar to', 'competes with', 'competing with', 
    'other vendors', 'competing products', 'market players'
  ];
  
  const potentialCompetitors: string[] = [];
  
  // Simple pattern matching for competitor mentions
  for (const indicator of competitorIndicators) {
    const regex = new RegExp(`${indicator}\\s+([A-Z][a-zA-Z0-9]*(?:\\s+[A-Z][a-zA-Z0-9]*)*)`, 'g');
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match[1] && match[1].length > 2) {
        potentialCompetitors.push(match[1]);
      }
    }
  }
  
  // Also look for company names followed by "is a competitor"
  const companyPattern = /([A-Z][a-zA-Z0-9]*(?:\s+[A-Z][a-zA-Z0-9]*)*)\s+is\s+(?:a\s+)?(?:competitor|rival)/g;
  let match;
  while ((match = companyPattern.exec(text)) !== null) {
    if (match[1] && match[1].length > 2) {
      potentialCompetitors.push(match[1]);
    }
  }
  
  // Remove duplicates and filter out garbage
  return [...new Set(potentialCompetitors)]
    .filter(name => {
      if (!name || typeof name !== 'string') return false;
      
      // Filter out PDF artifacts 
      for (const pattern of PDF_ARTIFACT_PATTERNS) {
        if (pattern.test(name)) return false;
      }
      
      // Filter out common non-company text that might be matched
      const nonCompanyNames = ['inc', 'corporation', 'company', 'the', 'our', 'their', 'ltd', 'llc', 'inc', 'itself'];
      if (nonCompanyNames.includes(name.toLowerCase())) return false;
      
      // Make sure it has enough alphabetic characters
      const alphaChars = (name.match(/[a-zA-Z]/g) || []).length;
      return alphaChars > 3;
    })
    .slice(0, 5);
}