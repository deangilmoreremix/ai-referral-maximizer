/**
 * Web Search Service
 * Provides web search functionality for enriching conversations with real-time data
 */

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
  /**
   * Perform a web search using the query
   * Note: This is a mock implementation. In production, integrate with a real search API
   */
  async search(query: string): Promise<WebSearchResponse> {
    console.log(`Performing web search for: ${query}`);

    // Simulate API delay
    await this.delay(1000);

    // Mock search results
    const mockResults: SearchResult[] = [
      {
        title: `Latest information about ${query}`,
        url: `https://example.com/search?q=${encodeURIComponent(query)}`,
        snippet: `Recent developments and insights about ${query}. This information is current and relevant to your query.`,
        source: 'Example Source'
      },
      {
        title: `${query} - Comprehensive Guide`,
        url: `https://guide.example.com/${query.toLowerCase().replace(/\s+/g, '-')}`,
        snippet: `A detailed guide covering all aspects of ${query}, including best practices and recent trends.`,
        source: 'Guide Portal'
      },
      {
        title: `Top Resources for ${query}`,
        url: `https://resources.example.com/${query}`,
        snippet: `Curated collection of the best resources, tools, and information related to ${query}.`,
        source: 'Resource Hub'
      }
    ];

    return {
      query,
      results: mockResults,
      timestamp: new Date().toISOString()
    };
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
      summary += `   Source: ${result.url}\n\n`;
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
      'search for'
    ];

    const lowerQuery = query.toLowerCase();
    return webSearchKeywords.some(keyword => lowerQuery.includes(keyword));
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const webSearchService = new WebSearchService();
