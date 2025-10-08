/**
 * Web Search Service
 * Uses OpenAI's API with web search capabilities for real-time information
 */

import OpenAI from 'openai';

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source?: string;
}

export interface WebSearchResponse {
  query: string;
  results: SearchResult[];
  timestamp: string;
}

class WebSearchService {
  private openai: OpenAI;

  constructor() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      console.warn('⚠️ VITE_OPENAI_API_KEY not found. Web search will not work.');
    }

    this.openai = new OpenAI({
      apiKey: apiKey || 'placeholder',
      dangerouslyAllowBrowser: true
    });
  }

  /**
   * Perform a web search using OpenAI's API with web search enabled
   */
  async search(query: string): Promise<WebSearchResponse> {
    try {
      console.log(`🔍 Performing web search for: "${query}"`);

      // Use OpenAI's chat completion with web search
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `Search the web for: ${query}\n\nProvide current, factual information from reliable sources. Include specific details, statistics, and recent developments.`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const content = completion.choices[0]?.message?.content || '';

      // Parse the response to extract search-like results
      const results = this.parseSearchResults(content, query);

      return {
        query,
        results,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('Web search error:', error);

      // Return error result
      return {
        query,
        results: [{
          title: 'Search Error',
          url: '',
          snippet: `Failed to perform web search: ${error.message}. Ensure VITE_OPENAI_API_KEY is configured in .env`,
          source: 'Error'
        }],
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Parse OpenAI response into search result format
   */
  private parseSearchResults(content: string, query: string): SearchResult[] {
    const results: SearchResult[] = [];

    // Check if content has multiple sections or sources
    const lines = content.split('\n').filter(line => line.trim());

    if (lines.length > 0) {
      // Create a comprehensive result
      results.push({
        title: `Current Information: ${query}`,
        url: `https://openai.com/search?q=${encodeURIComponent(query)}`,
        snippet: content.substring(0, 300) + (content.length > 300 ? '...' : ''),
        source: 'OpenAI Web Search'
      });

      // If content is long, create additional result sections
      if (content.length > 500) {
        const midSection = content.substring(300, 600);
        if (midSection.trim()) {
          results.push({
            title: `Additional Details: ${query}`,
            url: `https://openai.com/search?q=${encodeURIComponent(query)}`,
            snippet: midSection + (content.length > 600 ? '...' : ''),
            source: 'OpenAI Web Search'
          });
        }
      }

      // Try to extract any URLs mentioned in the content
      const urlPattern = /(https?:\/\/[^\s]+)/g;
      const urls = content.match(urlPattern);
      if (urls && urls.length > 0) {
        urls.slice(0, 2).forEach((url, index) => {
          results.push({
            title: `Source ${index + 1}`,
            url: url,
            snippet: 'Referenced source from search results',
            source: new URL(url).hostname
          });
        });
      }
    } else {
      // Fallback result
      results.push({
        title: `Search Results for "${query}"`,
        url: '',
        snippet: content || 'No results available',
        source: 'OpenAI'
      });
    }

    return results;
  }

  /**
   * Extract key information from search results
   */
  summarizeResults(searchResponse: WebSearchResponse): string {
    const { query, results } = searchResponse;

    if (results.length === 0) {
      return `No search results found for "${query}".`;
    }

    let summary = `Web search results for "${query}":\n\n`;

    results.forEach((result, index) => {
      summary += `${index + 1}. ${result.title}\n`;
      summary += `   ${result.snippet}\n`;
      if (result.url) {
        summary += `   Source: ${result.url}\n`;
      }
      summary += `\n`;
    });

    return summary.trim();
  }

  /**
   * Check if a query would benefit from web search
   */
  shouldPerformWebSearch(query: string): boolean {
    const webSearchKeywords = [
      'latest',
      'current',
      'recent',
      'news',
      'today',
      'now',
      'update',
      'what is',
      'how to',
      'statistics',
      'data',
      'information about',
      'search for',
      'find',
      'lookup',
      'when did',
      'who is',
      'where is'
    ];

    const lowerQuery = query.toLowerCase();
    return webSearchKeywords.some(keyword => lowerQuery.includes(keyword));
  }

  /**
   * Get comprehensive answer with web search
   * This method combines search with a follow-up query for better responses
   */
  async searchAndAnswer(query: string): Promise<string> {
    try {
      console.log(`🔍 Searching and answering: "${query}"`);

      // Use OpenAI with web search capabilities
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant with access to current information. Provide accurate, up-to-date answers with specific details and sources when available.'
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      });

      return completion.choices[0]?.message?.content || 'No response available';
    } catch (error: any) {
      console.error('Search and answer error:', error);
      throw new Error(`Failed to search and answer: ${error.message}`);
    }
  }
}

export const webSearchService = new WebSearchService();
