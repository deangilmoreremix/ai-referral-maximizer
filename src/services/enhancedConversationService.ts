/**
 * Enhanced Conversation Service
 * Integrates all new features: web search, file upload, code execution, image generation, reasoning, and quality scoring
 */

import { conversationService, ConversationMessage } from './conversationService';
import { webSearchService, WebSearchResponse } from './webSearchService';
import { codeInterpreterService, CodeExecutionResult } from './codeInterpreterService';
import { imageGenerationService, ImageGenerationResult } from './imageGenerationService';
import { muapiService, VideoGenerationResult } from './muapiService';
import { generateContent } from './openAIService';

export interface EnhancedMessageOptions {
  contextId: string;
  userMessage: string;
  enableWebSearch?: boolean;
  enableCodeExecution?: boolean;
  enableImageGeneration?: boolean;
  enableVideoGeneration?: boolean;
  attachments?: File[];
  tenantId?: string;
}

export interface EnhancedMessageResult {
  message: ConversationMessage;
  webSearchResults?: WebSearchResponse;
  codeExecutionResults?: CodeExecutionResult[];
  generatedImages?: ImageGenerationResult[];
  generatedVideos?: VideoGenerationResult[];
  attachmentIds?: string[];
}

type ImageType = 'standard' | 'photorealistic' | 'illustration' | 'logo' | 'marketing' | 'product' | 'content-media' | 'ui-design' | 'educational' | 'real-estate' | 'fashion';

interface MuapiImageParams {
  prompt: string;
  imageType?: ImageType;
  model?: string;
  size?: string;
  quality?: string;
}

class EnhancedConversationService {
  async processEnhancedMessage(options: EnhancedMessageOptions): Promise<EnhancedMessageResult> {
    const { contextId, userMessage, enableWebSearch, enableCodeExecution, enableImageGeneration, enableVideoGeneration } = options;

    const userMsg = await conversationService.addMessage(contextId, 'user', userMessage);

    const shouldSearch = enableWebSearch || webSearchService.shouldPerformWebSearch(userMessage);
    const shouldExecuteCode = enableCodeExecution || this.containsCodeOrMath(userMessage);
    const shouldGenerateImage = enableImageGeneration || imageGenerationService.shouldGenerateImage(userMessage);
    const shouldGenerateVideo = enableVideoGeneration || this.shouldGenerateVideo(userMessage);

    let webSearchResults: WebSearchResponse | undefined;
    let codeExecutionResults: CodeExecutionResult[] = [];
    let generatedImages: ImageGenerationResult[] = [];
    let generatedVideos: VideoGenerationResult[] = [];

    if (shouldSearch) {
      try {
        const searchQuery = this.extractSearchQuery(userMessage) || userMessage;
        webSearchResults = await webSearchService.search(searchQuery);
        await conversationService.addWebSearchResult(
          userMsg.id,
          webSearchResults.query,
          webSearchResults.results
        );
      } catch (error) {
        console.error('Web search failed:', error);
      }
    }

    if (shouldExecuteCode) {
      try {
        const codeSnippets = this.extractCodeSnippets(userMessage);
        for (const snippet of codeSnippets) {
          const result = await codeInterpreterService.executeCode(snippet.code, snippet.language);
          codeExecutionResults.push(result);
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

    if (shouldGenerateImage) {
      try {
        const imagePrompt = imageGenerationService.extractImagePrompt(userMessage);
        if (imagePrompt) {
          const imageType = this.extractImageType(userMessage);
          const imageResult = await this.generateMuapiImage({
            prompt: imagePrompt,
            imageType,
            model: 'stable-diffusion'
          });
          generatedImages.push(imageResult);
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

    if (shouldGenerateVideo) {
      try {
        const videoPrompt = this.extractVideoPrompt(userMessage);
        if (videoPrompt) {
          const videoResult = await muapiService.generateVideo({
            prompt: videoPrompt,
            duration: 5,
            model: 'runway-gen-3',
            aspectRatio: '16:9'
          });
          generatedVideos.push(videoResult);
          await conversationService.saveGeneratedVideo(
            userMsg.id,
            videoResult.prompt,
            videoResult.videoUrl,
            videoResult.model,
            videoResult.duration
          );
        }
      } catch (error) {
        console.error('Video generation failed:', error);
      }
    }

    const aiResponse = await this.generateAIResponse(
      userMessage,
      webSearchResults,
      codeExecutionResults,
      generatedImages,
      generatedVideos
    );

    const qualityScore = this.calculateQualityScore(aiResponse.content, {
      hasWebSearch: !!webSearchResults,
      hasCodeExecution: codeExecutionResults.length > 0,
      hasImageGeneration: generatedImages.length > 0,
      hasVideoGeneration: generatedVideos.length > 0
    });

    const assistantMsg = await conversationService.addMessage(contextId, 'assistant', aiResponse.content, {
      reasoning: aiResponse.reasoning,
      quality_score: qualityScore,
      has_web_search: !!webSearchResults,
      has_code_execution: codeExecutionResults.length > 0,
      has_image_generation: generatedImages.length > 0,
      has_video_generation: generatedVideos.length > 0
    });

    return {
      message: assistantMsg,
      webSearchResults,
      codeExecutionResults: codeExecutionResults.length > 0 ? codeExecutionResults : undefined,
      generatedImages: generatedImages.length > 0 ? generatedImages : undefined,
      generatedVideos: generatedVideos.length > 0 ? generatedVideos : undefined
    };
  }

  private async generateMuapiImage(params: MuapiImageParams): Promise<ImageGenerationResult> {
    const { prompt, imageType = 'standard', model = 'stable-diffusion' } = params;

    try {
      let result;

      switch (imageType) {
        case 'photorealistic':
          result = await muapiService.generatePhotorealistic({
            subject: prompt,
            model: model as any,
            size: params.size as any,
            quality: params.quality as any
          });
          break;
        case 'illustration':
          result = await muapiService.generateIllustration({
            subject: prompt,
            model: model as any,
            size: params.size as any,
            quality: params.quality as any
          });
          break;
        case 'logo':
          result = await muapiService.generateLogo({
            brandName: 'Generated Brand',
            style: prompt,
            model: model as any,
            quality: params.quality as any
          });
          break;
        case 'marketing':
          result = await muapiService.generateSocialMediaPost({
            headline: prompt,
            model: model as any,
            size: params.size as any,
            quality: params.quality as any
          });
          break;
        case 'product':
          result = await muapiService.generateProductMockup({
            product: prompt,
            model: model as any,
            size: params.size as any,
            quality: params.quality as any
          });
          break;
        case 'content-media':
          result = await muapiService.generateYouTubeThumbnail({
            title: prompt,
            model: model as any,
            quality: params.quality as any
          });
          break;
        case 'ui-design':
          result = await muapiService.generateWebsiteMockup({
            industry: prompt,
            model: model as any,
            size: params.size as any,
            quality: params.quality as any
          });
          break;
        case 'educational':
          result = await muapiService.generateInfographic({
            topic: prompt,
            model: model as any,
            size: params.size as any,
            quality: params.quality as any
          });
          break;
        case 'real-estate':
          result = await muapiService.generateInteriorRender({
            style: prompt,
            model: model as any,
            size: params.size as any,
            quality: params.quality as any
          });
          break;
        case 'fashion':
          result = await muapiService.generateOutfit({
            style: prompt,
            model: model as any,
            size: params.size as any,
            quality: params.quality as any
          });
          break;
        default:
          result = await muapiService.generateImage({
            prompt,
            model: model as any,
            size: params.size as any,
            quality: params.quality as any
          });
      }

      return {
        imageUrl: result.imageUrl,
        prompt,
        model,
        timestamp: result.timestamp
      };
    } catch (error: unknown) {
      const err = error as Error;
      throw new Error(`Failed to generate image: ${err.message}`);
    }
  }

  private shouldGenerateVideo(message: string): boolean {
    const videoKeywords = [
      'generate video',
      'create video',
      'make a video',
      'animate',
      'video of',
      'short video'
    ];

    const lowerText = message.toLowerCase();
    return videoKeywords.some(keyword => lowerText.includes(keyword));
  }

  private extractImageType(message: string): ImageType | undefined {
    const lowerText = message.toLowerCase();

    if (lowerText.includes('logo') || lowerText.includes('brand')) return 'logo';
    if (lowerText.includes('photorealistic') || lowerText.includes('photo realistic')) return 'photorealistic';
    if (lowerText.includes('illustration') || lowerText.includes('illustrate')) return 'illustration';
    if (lowerText.includes('marketing') || lowerText.includes('social media') || lowerText.includes('advertisement')) return 'marketing';
    if (lowerText.includes('product') || lowerText.includes('mockup') || lowerText.includes('ecommerce')) return 'product';
    if (lowerText.includes('youtube') || lowerText.includes('thumbnail') || lowerText.includes('blog cover') || lowerText.includes('podcast')) return 'content-media';
    if (lowerText.includes('ui') || lowerText.includes('website') || lowerText.includes('app') || lowerText.includes('wireframe')) return 'ui-design';
    if (lowerText.includes('infographic') || lowerText.includes('diagram') || lowerText.includes('chart') || lowerText.includes('educational')) return 'educational';
    if (lowerText.includes('real estate') || lowerText.includes('interior') || lowerText.includes('exterior') || lowerText.includes('floor plan')) return 'real-estate';
    if (lowerText.includes('fashion') || lowerText.includes('outfit') || lowerText.includes('lookbook')) return 'fashion';

    return 'standard';
  }

  private extractVideoPrompt(message: string): string | null {
    const patterns = [
      /generate video of (.+)/i,
      /create video of (.+)/i,
      /make a video of (.+)/i,
      /animate (.+)/i,
      /video of (.+)/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    if (message.length < 200 && this.shouldGenerateVideo(message)) {
      return message;
    }

    return null;
  }

  private async generateAIResponse(
    userMessage: string,
    webSearchResults?: WebSearchResponse,
    codeResults?: CodeExecutionResult[],
    images?: ImageGenerationResult[],
    videos?: VideoGenerationResult[]
  ): Promise<{ content: string; reasoning: string }> {
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

    if (videos && videos.length > 0) {
      context += '\n\n[Generated Videos]\n';
      videos.forEach((video, index) => {
        context += `Video ${index + 1}: ${video.videoUrl} (Prompt: ${video.prompt}, Duration: ${video.duration}s)\n`;
      });
    }

    const prompt = `${userMessage}${context}
Please provide a helpful response. Also explain your reasoning process briefly.

Format your response as:
RESPONSE: [your main response here]
REASONING: [brief explanation of how you arrived at this response]`;

    const fullResponse = await generateContent({
      contentType: 'General Response',
      specialRequirements: prompt
    });

    const responseMatch = fullResponse.match(/RESPONSE:([\s\S]*?)(?:REASONING:|$)/);
    const reasoningMatch = fullResponse.match(/REASONING:([\s\S]*)/);

    const content = responseMatch ? responseMatch[1].trim() : fullResponse;
    const reasoning = reasoningMatch ? reasoningMatch[1].trim() : 'Generated response based on user query and available context.';

    return { content, reasoning };
  }

  private calculateQualityScore(
    response: string,
    context: { hasWebSearch: boolean; hasCodeExecution: boolean; hasImageGeneration: boolean; hasVideoGeneration: boolean }
  ): number {
    let score = 70;

    if (response.length > 200) score += 5;
    if (response.length > 500) score += 5;

    if (context.hasWebSearch) score += 5;
    if (context.hasCodeExecution) score += 5;
    if (context.hasImageGeneration) score += 5;
    if (context.hasVideoGeneration) score += 5;

    if (response.includes('?')) score -= 2;
    if (response.includes('specifically') || response.includes('exactly')) score += 3;
    if (response.split('\n\n').length >= 3) score += 3;

    return Math.min(100, Math.max(0, score));
  }

  private containsCodeOrMath(message: string): boolean {
    const codePatterns = [
      /```[\s\S]*?```/,
      /`[^`]+`/,
      /\d+\s*[\+\-\*\/\^]\s*\d+/,
      /calculate|compute|evaluate|solve/i
    ];

    return codePatterns.some(pattern => pattern.test(message));
  }

  private extractCodeSnippets(message: string): Array<{ code: string; language: string }> {
    const snippets: Array<{ code: string; language: string }> = [];

    const codeBlockPattern = /```(\w+)?\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockPattern.exec(message)) !== null) {
      snippets.push({
        language: match[1] || 'javascript',
        code: match[2].trim()
      });
    }

    const mathPattern = /(?:calculate|compute|evaluate|solve)\s+(.+?)(?:\.|$)/i;
    const mathMatch = message.match(mathPattern);
    if (mathMatch && !snippets.length) {
      snippets.push({
        language: 'math',
        code: mathMatch[1].trim()
      });
    }

    if (!snippets.length) {
      const simpleMath = /(\d+\s*[\+\-\*\/\^]\s*\d+(?:\s*[\+\-\*\/\^]\s*\d+)*)/;
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