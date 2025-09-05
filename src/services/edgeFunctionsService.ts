/**
 * Edge Functions Service
 * 
 * This service provides a centralized interface to all Supabase Edge Functions
 */

import { analyzeDocument } from '../utils/documentAnalyzerService';
import { scrapeLinkedInProfile } from '../utils/linkedInScraper';
import { generateContentWithEdgeFunction } from './edgeFunctionService';
import { supabase } from './supabaseClient';

// Service for document analysis
const DocumentAnalysisService = {
  /**
   * Analyze a document using the edge function
   * 
   * @param file File to analyze
   * @returns Analysis results
   */
  analyzeDocument: async (file: File) => {
    console.log(`Analyzing document: ${file.name} (${file.type})`);
    try {
      return await analyzeDocument(file);
    } catch (error) {
      console.error("Error in document analysis edge function:", error);
      throw error;
    }
  }
};

// Service for LinkedIn profile analysis
const LinkedInService = {
  /**
   * Scrape a LinkedIn profile using the edge function
   * 
   * @param url LinkedIn profile URL
   * @returns Profile data
   */
  scrapeProfile: async (url: string) => {
    console.log(`Scraping LinkedIn profile: ${url}`);
    try {
      return await scrapeLinkedInProfile(url);
    } catch (error) {
      console.error("Error in LinkedIn scraping edge function:", error);
      throw error;
    }
  },

  /**
   * Scrape detailed LinkedIn profile data (enhanced)
   * 
   * @param url LinkedIn profile URL
   * @returns Enhanced profile data
   */
  scrapeDetailedProfile: async (url: string) => {
    console.log(`Scraping detailed LinkedIn profile: ${url}`);
    try {
      // In a real implementation, this would be a separate edge function
      // For now, just reuse scrapeLinkedInProfile with isEnhanced flag
      return await scrapeLinkedInProfile(url, true);
    } catch (error) {
      console.error("Error in LinkedIn detailed scraping edge function:", error);
      throw error;
    }
  },

  /**
   * Get industry insights and trends
   * 
   * @param industry The industry to get insights for
   * @returns Industry insights, trends, and competitive landscape
   */
  getIndustryInsights: async (industry: string) => {
    console.log(`Getting industry insights for: ${industry}`);
    try {
      // In a real implementation, this would call a specific edge function
      // For this example, we'll return mock insights
      
      const insights = {
        insights: [
          `${industry} is showing strong growth in 2025.`,
          `Professionals in ${industry} are increasingly focusing on digital transformation.`,
          `Remote work has dramatically changed how ${industry} companies operate.`
        ],
        trends: [
          'Increased adoption of AI and machine learning',
          'Remote and hybrid work models',
          'Focus on sustainability and ESG'
        ],
        competitors: [
          'Leading companies include established tech giants',
          'Emerging startups are disrupting traditional business models',
          'International expansion is a key growth strategy'
        ]
      };
      
      return insights;
    } catch (error) {
      console.error(`Error getting industry insights for ${industry}:`, error);
      throw error;
    }
  }
};

// Service for content generation
const ContentGenerationService = {
  /**
   * Generate content using the edge function
   * 
   * @param request Content generation request
   * @returns Generated content
   */
  generateContent: async (request: any) => {
    console.log(`Generating content via edge function for: ${request.contentType}`);
    try {
      return await generateContentWithEdgeFunction({
        ...request,
        model: request.model || "gemini-2.5-pro" // Default to highest quality model
      });
    } catch (error) {
      console.error("Error in content generation edge function:", error);
      throw error;
    }
  }
};

// Service for user preferences
const UserPreferencesService = {
  /**
   * Get user preferences
   * 
   * @returns User preferences
   */
  getPreferences: async () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const session = supabase.auth.getSession();
      
      if (!supabaseUrl) {
        throw new Error('Supabase configuration missing');
      }
      
      // Get the user's session token
      const sessionData = await session;
      const accessToken = sessionData?.data?.session?.access_token;
      
      if (!accessToken) {
        throw new Error('User not authenticated');
      }
      
      const response = await fetch(`${supabaseUrl}/functions/v1/user-preferences`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get preferences: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting user preferences:', error);
      throw error;
    }
  },
  
  /**
   * Update user preferences
   * 
   * @param preferences Preferences to update
   * @returns Updated preferences
   */
  updatePreferences: async (preferences: any) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const session = supabase.auth.getSession();
      
      if (!supabaseUrl) {
        throw new Error('Supabase configuration missing');
      }
      
      // Get the user's session token
      const sessionData = await session;
      const accessToken = sessionData?.data?.session?.access_token;
      
      if (!accessToken) {
        throw new Error('User not authenticated');
      }
      
      const response = await fetch(`${supabaseUrl}/functions/v1/user-preferences`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update preferences: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }
};

// Service for content history
const ContentHistoryService = {
  /**
   * Get user's content history
   * 
   * @param params Optional query parameters
   * @returns Content history items
   */
  getHistory: async (params: {
    limit?: number;
    contentTypeId?: string;
    orderBy?: string;
    order?: 'asc' | 'desc';
  } = {}) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const session = supabase.auth.getSession();
      
      if (!supabaseUrl) {
        throw new Error('Supabase configuration missing');
      }
      
      // Get the user's session token
      const sessionData = await session;
      const accessToken = sessionData?.data?.session?.access_token;
      
      if (!accessToken) {
        throw new Error('User not authenticated');
      }
      
      // Build query string
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.contentTypeId) queryParams.append('contentTypeId', params.contentTypeId);
      if (params.orderBy) queryParams.append('orderBy', params.orderBy);
      if (params.order) queryParams.append('order', params.order);
      
      const queryString = queryParams.toString();
      const url = `${supabaseUrl}/functions/v1/content-history${queryString ? `?${queryString}` : ''}`;
      
      console.log(`Fetching content history from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get content history: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting content history:', error);
      throw error;
    }
  },
  
  /**
   * Delete content from history
   * 
   * @param contentId ID of the content to delete
   * @returns Success message
   */
  deleteContent: async (contentId: string) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const session = supabase.auth.getSession();
      
      if (!supabaseUrl) {
        throw new Error('Supabase configuration missing');
      }
      
      // Get the user's session token
      const sessionData = await session;
      const accessToken = sessionData?.data?.session?.access_token;
      
      if (!accessToken) {
        throw new Error('User not authenticated');
      }
      
      const response = await fetch(`${supabaseUrl}/functions/v1/content-history?id=${contentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete content: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  }
};

// Service for user analytics
const AnalyticsService = {
  /**
   * Get user analytics data
   * 
   * @param params Query parameters
   * @returns Analytics data
   */
  getAnalytics: async (params: {
    timeframe?: 'day' | 'week' | 'month' | 'all';
    groupBy?: string;
    limit?: number;
  } = {}) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const session = supabase.auth.getSession();
      
      if (!supabaseUrl) {
        throw new Error('Supabase configuration missing');
      }
      
      // Get the user's session token
      const sessionData = await session;
      const accessToken = sessionData?.data?.session?.access_token;
      
      if (!accessToken) {
        throw new Error('User not authenticated');
      }
      
      // Build query string
      const queryParams = new URLSearchParams();
      if (params.timeframe) queryParams.append('timeframe', params.timeframe);
      if (params.groupBy) queryParams.append('groupBy', params.groupBy);
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      const queryString = queryParams.toString();
      const url = `${supabaseUrl}/functions/v1/usage-analytics${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get analytics: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  }
};

// Export all services as a single object
export const EdgeFunctions = {
  DocumentAnalysis: DocumentAnalysisService,
  LinkedIn: LinkedInService,
  ContentGeneration: ContentGenerationService,
  UserPreferences: UserPreferencesService,
  ContentHistory: ContentHistoryService,
  Analytics: AnalyticsService
};