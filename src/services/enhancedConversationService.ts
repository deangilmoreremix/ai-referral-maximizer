/**
 * Enhanced Conversation Service
 * Integrates all new features: web search, file upload, code execution, image generation, reasoning, and quality scoring
 */

import { conversationService, ConversationMessage } from './conversationService';
import { webSearchService, WebSearchResponse } from './webSearchService';
import { codeInterpreterService, CodeExecutionResult } from './codeInterpreterService';
import { imageGenerationService, ImageGenerationResult } from './imageGenerationService';
import { generateContent } from './geminiService';

export interface EnhancedMessageOptions {
  contextId: string;
  userMessage: string;
  enableWebSearch?: boolean;
  enableCodeExecution?: boolean;
  enableImageGeneration?: boolean;
  attachments?: File[];
}

export interface EnhancedMessageResult {
  message: ConversationMessage;
  webSearchResults?: WebSearchResponse;
  codeExecutionResults?: CodeExecutionResult[];
  generatedImages?: ImageGenerationResult[];
  attachmentIds?: string[];
}

class EnhancedConversationService {
  /**
   * Process a user message with all enhancements
   */
  async processEnhancedMessage(options: EnhancedMessageOptions): Promise<EnhancedMessageResult> {
    const { contextId, userMessage, enableWebSearch, enableCodeExecution, enableImageGeneration } = options;

    // Add user message
    const userMsg = await conversationService.addMessage(contextId, 'user', userMessage);

    // Determine what enhancements to apply
    const shouldSearch = enableWebSearch || webSearchService.shouldPerformWebSearch(userMessage);
    const shouldExecuteCode = enableCodeExecution || this.containsCodeOrMath(userMessage);
    const shouldGenerateImage =
      enableImageGeneration || imageGenerationService.shouldGenerateImage(userMessage);

    let webSearchResults: WebSearchResponse | undefined;
    let codeExecutionResults: CodeExecutionResult[] = [];
    let generatedImages: ImageGenerationResult[] = [];

    // Perform web search if needed
    if (shouldSearch) {
      try {
        const searchQuery = this.extractSearchQuery(userMessage) || userMessage;
        webSearchResults = await webSearchService.search(searchQuery);

        // Save search results to database
        await conversationService.addWebSearchResult(
          userMsg.id,
          webSearchResults.query,
          webSearchResults.results
        );
      } catch (error) {
        console.error('Web search failed:', error);
      }
    }

    // Execute code if needed
    if (shouldExecuteCode) {
      try {
        const codeSnippets = this.extractCodeSnippets(userMessage);
        for (const snippet of codeSnippets) {
          const result = await codeInterpreterService.executeCode(snippet.code, snippet.language);
          codeExecutionResults.push(result);

          // Save code execution to database
          await conversationService.saveCodeExecution(
            userMsg.id,
            snippet.code,
            snippet.language,
            result.output,
            result.error
          );
        }
      } catch (error) {
        console.error('Code execution failed:', error);
      }
    }

    // Generate image if needed
    if (shouldGenerateImage) {
      try {
        const imagePrompt = imageGenerationService.extractImagePrompt(userMessage);
        if (imagePrompt) {
          const imageResult = await imageGenerationService.generateImage({
            prompt: imagePrompt,
            model: 'dall-e-3'
          });
          generatedImages.push(imageResult);

          // Save generated image to database
          await conversationService.saveGeneratedImage(
            userMsg.id,
            imageResult.prompt,
            imageResult.imageUrl,
            imageResult.model
          );
        }
      } catch (error) {
        console.error('Image generation failed:', error);
      }
    }

    // Generate AI response with context
    const aiResponse = await this.generateAIResponse(
      userMessage,
      webSearchResults,
      codeExecutionResults,
      generatedImages
    );

    // Calculate quality score
    const qualityScore = this.calculateQualityScore(aiResponse.content, {
      hasWebSearch: !!webSearchResults,
      hasCodeExecution: codeExecutionResults.length > 0,
      hasImageGeneration: generatedImages.length > 0
    });

    // Add assistant message with reasoning and quality score
    const assistantMsg = await conversationService.addMessage(contextId, 'assistant', aiResponse.content, {
      reasoning: aiResponse.reasoning,
      quality_score: qualityScore,
      has_web_search: !!webSearchResults,
      has_code_execution: codeExecutionResults.length > 0,
      has_image_generation: generatedImages.length > 0
    });

    return {
      message: assistantMsg,
      webSearchResults,
      codeExecutionResults: codeExecutionResults.length > 0 ? codeExecutionResults : undefined,
      generatedImages: generatedImages.length > 0 ? generatedImages : undefined
    };
  }

  /**
   * Generate AI response with all context
   */
  private async generateAIResponse(
    userMessage: string,
    webSearchResults?: WebSearchResponse,
    codeResults?: CodeExecutionResult[],
    images?: ImageGenerationResult[]
  ): Promise<{ content: string; reasoning: string }> {
    // Build context from enhancements
    let context = '';

    if (webSearchResults) {
      context += `\n\n[Web Search Results]\n${webSearchService.summarizeResults(webSearchResults)}\n`;
    }

    if (codeResults && codeResults.length > 0) {
      context += '\n\n[Code Execution Results]\n';
      codeResults.forEach((result, index) => {
        if (result.output) {
          context += `Result ${index + 1}: ${result.output}\n`;
        }
        if (result.error) {
          context += `Error ${index + 1}: ${result.error}\n`;
        }
      });
    }

    if (images && images.length > 0) {
      context += '\n\n[Generated Images]\n';
      images.forEach((image, index) => {
        context += `Image ${index + 1}: ${image.imageUrl} (Prompt: ${image.prompt})\n`;
      });
    }

    // Generate response with reasoning
    const prompt = `${userMessage}${context}

Please provide a helpful response. Also explain your reasoning process briefly.

Format your response as:
RESPONSE: [your main response here]
REASONING: [brief explanation of how you arrived at this response]`;

    const fullResponse = await generateContent({
      contentType: 'General Response',
      specialRequirements: prompt
    });

    // Parse response and reasoning
    const responseMatch = fullResponse.match(/RESPONSE:([\s\S]*?)(?:REASONING:|$)/);
    const reasoningMatch = fullResponse.match(/REASONING:([\s\S]*)/);

    const content = responseMatch ? responseMatch[1].trim() : fullResponse;
    const reasoning = reasoningMatch ? reasoningMatch[1].trim() : 'Generated response based on user query and available context.';

    return { content, reasoning };
  }

  /**
   * Calculate quality score based on response characteristics
   */
  private calculateQualityScore(
    response: string,
    context: { hasWebSearch: boolean; hasCodeExecution: boolean; hasImageGeneration: boolean }
  ): number {
    let score = 70; // Base score

    // Length and completeness
    if (response.length > 200) score += 5;
    if (response.length > 500) score += 5;

    // Context enrichment
    if (context.hasWebSearch) score += 5;
    if (context.hasCodeExecution) score += 5;
    if (context.hasImageGeneration) score += 5;

    // Response quality indicators
    if (response.includes('?')) score -= 2; // Questions might indicate uncertainty
    if (response.includes('specifically') || response.includes('exactly')) score += 3;
    if (response.split('\n\n').length >= 3) score += 3; // Well-structured

    // Cap at 100
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Check if message contains code or math
   */
  private containsCodeOrMath(message: string): boolean {
    const codePatterns = [
      /```[\s\S]*?```/,
      /`[^`]+`/,
      /\d+\s*[\+\-\*\/\^]\s*\d+/,
      /calculate|compute|evaluate|solve/i
    ];

    return codePatterns.some(pattern => pattern.test(message));
  }

  /**
   * Extract code snippets from message
   */
  private extractCodeSnippets(message: string): Array<{ code: string; language: string }> {
    const snippets: Array<{ code: string; language: string }> = [];

    // Extract code blocks
    const codeBlockPattern = /```(\w+)?\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockPattern.exec(message)) !== null) {
      snippets.push({
        language: match[1] || 'javascript',
        code: match[2].trim()
      });
    }

    // Extract inline code for math
    const mathPattern = /(?:calculate|compute|evaluate|solve)\s+(.+?)(?:\.|$)/i;
    const mathMatch = message.match(mathPattern);
    if (mathMatch && !snippets.length) {
      snippets.push({
        language: 'math',
        code: mathMatch[1].trim()
      });
    }

    // Extract simple math expressions
    if (!snippets.length) {
      const simpleM ath = /(\d+\s*[\+\-\*\/\^]\s*\d+(?:\s*[\+\-\*\/\^]\s*\d+)*)/;
      const simpleMathMatch = message.match(simpleMath);
      if (simpleMathMatch) {
        snippets.push({
          language: 'math',
          code: simpleMathMatch[1].trim()
        });
      }
    }

    return snippets;
  }

  /**
   * Extract search query from message
   */
  private extractSearchQuery(message: string): string | null {
    const patterns = [
      /search for (.+)/i,
      /look up (.+)/i,
      /find information about (.+)/i,
      /what (?:is|are) (.+)/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return null;
  }
}

export const enhancedConversationService = new EnhancedConversationService();
