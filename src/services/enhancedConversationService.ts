/**
 * Enhanced Conversation Service
 * Integrates all new features: web search, file upload, code execution, image generation, reasoning, and quality scoring
 */

import { conversationService, ConversationMessage } from './conversationService';
import { webSearchService, WebSearchResponse } from './webSearchService';
import { codeInterpreterService, CodeExecutionResult } from './codeInterpreterService';
import { imageGenerationService, ImageGenerationResult } from './imageGenerationService';
import { muapiService, VideoGenerationResult, MuapiImageResult, AgencyCreativePackage, CreativeAgencyParams } from './muapiService';
import { generateContent } from './openAIService';

export interface ToolCall {
  tool: 'web_search' | 'code_execution' | 'image_generation' | 'video_generation' | 'image_edit' | 'batch_generation' | 'ab_test';
  reason: string;
  parameters: Record<string, unknown>;
}

export interface FileContext {
  id: string;
  name: string;
  type: string;
  url: string;
  content?: string;
}

export interface EnhancedMessageOptions {
  contextId: string;
  userMessage: string;
  enableWebSearch?: boolean;
  enableCodeExecution?: boolean;
  enableImageGeneration?: boolean;
  enableVideoGeneration?: boolean;
  attachments?: File[];
  attachmentUrls?: string[];
  fileContexts?: FileContext[];
  tenantId?: string;
  toolChoice?: 'auto' | 'required' | 'none';
  sessionId?: string;
  previousResponseId?: string;
}

export interface WorkflowStep {
  stepId: string;
  stepType: 'generate' | 'refine' | 'create_assets' | 'edit' | 'batch' | 'ab_test';
  prompt: string;
  toolCalls: ToolCall[];
  output?: any;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
}

export interface WorkflowResult {
  workflowId: string;
  sessionId: string;
  steps: WorkflowStep[];
  finalOutput?: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface EnhancedMessageResult {
  message: ConversationMessage;
  webSearchResults?: WebSearchResponse;
  codeExecutionResults?: CodeExecutionResult[];
  generatedImages?: ImageGenerationResult[];
  generatedVideos?: VideoGenerationResult[];
  attachmentIds?: string[];
  responseId?: string;
  workflow?: WorkflowResult;
  toolCalls?: ToolCall[];
  batchResults?: BatchGenerationResult;
  fileContexts?: FileContext[];
}

export interface BatchGenerationResult {
  images: MuapiImageResult[];
  batchId: string;
  campaignId?: string;
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
    const { contextId, userMessage, enableWebSearch, enableCodeExecution, enableImageGeneration, enableVideoGeneration, toolChoice = 'auto', fileContexts, sessionId } = options;

    const userMsg = await conversationService.addMessage(contextId, 'user', userMessage);

    const toolCalls: ToolCall[] = [];
    let batchResults: BatchGenerationResult | undefined;

    if (toolChoice === 'required' || toolChoice === 'auto') {
      const determinedCalls = await this.determineToolCalls(userMessage, fileContexts);
      toolCalls.push(...determinedCalls);
    }

    const shouldSearch = enableWebSearch || toolCalls.some(c => c.tool === 'web_search') || webSearchService.shouldPerformWebSearch(userMessage);
    const shouldExecuteCode = enableCodeExecution || toolCalls.some(c => c.tool === 'code_execution') || this.containsCodeOrMath(userMessage);
    const shouldGenerateImage = enableImageGeneration || toolCalls.some(c => c.tool === 'image_generation') || imageGenerationService.shouldGenerateImage(userMessage);
    const shouldGenerateVideo = enableVideoGeneration || toolCalls.some(c => c.tool === 'video_generation') || this.shouldGenerateVideo(userMessage);

    let webSearchResults: WebSearchResponse | undefined;
    const codeExecutionResults: CodeExecutionResult[] = [];
    const generatedImages: ImageGenerationResult[] = [];
    const generatedVideos: VideoGenerationResult[] = [];

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
            videoResult.duration,
            videoResult.aspectRatio
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
      generatedVideos,
      fileContexts
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
      generatedVideos: generatedVideos.length > 0 ? generatedVideos : undefined,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      batchResults,
      responseId: assistantMsg.id,
      workflow: sessionId ? await this.createWorkflowFromSteps(sessionId, options.contextId, userMessage, toolCalls) : undefined
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
    videos?: VideoGenerationResult[],
    fileContexts?: FileContext[]
  ): Promise<{ content: string; reasoning: string }> {
    let context = '';

    if (fileContexts && fileContexts.length > 0) {
      context += '\n\n[Uploaded Files]\n';
      fileContexts.forEach((file, index) => {
        context += `File ${index + 1}: ${file.name} (${file.type})\n`;
        if (file.content) {
          context += `Content: ${file.content.substring(0, 200)}...\n`;
        }
        context += `URL: ${file.url}\n\n`;
      });
    }

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

  // ============ PROMPT CHAINING / WORKFLOW SUPPORT ============

  private async determineToolCalls(
    userMessage: string,
    fileContexts?: FileContext[],
    attachmentUrls?: string[]
  ): Promise<ToolCall[]> {
    const calls: ToolCall[] = [];
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('search') || lowerMessage.includes('look up') || lowerMessage.includes('find')) {
      calls.push({
        tool: 'web_search',
        reason: 'User requested information lookup',
        parameters: { query: userMessage }
      });
    }

    if (lowerMessage.includes('calculate') || lowerMessage.includes('solve') || lowerMessage.includes('code') || /```[\s\S]*?```/.test(userMessage)) {
      calls.push({
        tool: 'code_execution',
        reason: 'User requested code execution or mathematical calculation',
        parameters: { code: userMessage }
      });
    }

    if (lowerMessage.includes('generate image') || lowerMessage.includes('create image') || lowerMessage.includes('draw') || lowerMessage.includes('design')) {
      const prompt = this.extractImagePrompt(userMessage) || userMessage;
      const imageType = this.extractImageType(userMessage);
      calls.push({
        tool: 'image_generation',
        reason: 'User requested image generation',
        parameters: { prompt, imageType }
      });
    }

    if (lowerMessage.includes('generate video') || lowerMessage.includes('create video') || lowerMessage.includes('animate')) {
      const prompt = this.extractVideoPrompt(userMessage) || userMessage;
      calls.push({
        tool: 'video_generation',
        reason: 'User requested video generation',
        parameters: { prompt }
      });
    }

    if (fileContexts && fileContexts.some(f => f.type.startsWith('image/'))) {
      calls.push({
        tool: 'image_edit',
        reason: 'Image file uploaded for editing',
        parameters: { imageUrl: fileContexts.find(f => f.type.startsWith('image/'))?.url }
      });
    }

    return calls;
  }

  private async createWorkflowFromSteps(
    sessionId: string,
    contextId: string,
    userMessage: string,
    toolCalls: ToolCall[]
  ): Promise<WorkflowResult> {
    const steps: WorkflowStep[] = [];

    if (toolCalls.some(c => c.tool === 'image_generation')) {
      const step = toolCalls.find(c => c.tool === 'image_generation');
      steps.push({
        stepId: `step_${Date.now()}_1`,
        stepType: 'generate',
        prompt: (step?.parameters.prompt as string) || userMessage,
        toolCalls: [step!],
        status: 'completed'
      });
    }

    if (toolCalls.some(c => c.tool === 'image_edit')) {
      const step = toolCalls.find(c => c.tool === 'image_edit');
      steps.push({
        stepId: `step_${Date.now()}_2`,
        stepType: 'edit',
        prompt: userMessage,
        toolCalls: [step!],
        status: 'completed'
      });
    }

    if (toolCalls.some(c => c.tool === 'batch_generation' || c.tool === 'ab_test')) {
      const step = toolCalls.find(c => c.tool === 'batch_generation' || c.tool === 'ab_test');
      steps.push({
        stepId: `step_${Date.now()}_3`,
        stepType: step?.tool === 'ab_test' ? 'ab_test' : 'batch',
        prompt: (step?.parameters.prompt as string) || userMessage,
        toolCalls: [step!],
        status: 'completed'
      });
    }

    return {
      workflowId: `workflow_${Date.now()}`,
      sessionId,
      steps,
      status: 'completed'
    };
  }

  // ============ MULTI-STEP WORKFLOW METHODS ============

  async executeWorkflow(
    sessionId: string,
    contextId: string,
    workflow: {
      generate?: { prompt: string; imageType?: ImageType };
      refine?: { instruction: string; referenceImage?: string };
      createAssets?: { assetTypes: string[]; baseContent?: string };
    }
  ): Promise<WorkflowResult> {
    const steps: WorkflowStep[] = [];

    if (workflow.generate) {
      const step1: WorkflowStep = {
        stepId: `step_${Date.now()}_1`,
        stepType: 'generate',
        prompt: workflow.generate.prompt,
        toolCalls: [{
          tool: 'image_generation',
          reason: 'Initial content generation',
          parameters: workflow.generate
        }],
        status: 'pending'
      };

      try {
        const imageResult = await this.generateMuapiImage(workflow.generate);
        step1.output = imageResult;
        step1.status = 'completed';
      } catch (error: unknown) {
        step1.status = 'failed';
        step1.error = (error as Error).message;
      }
      steps.push(step1);
    }

    if (workflow.refine && steps[steps.length - 1]?.output) {
      const lastOutput = steps[steps.length - 1].output as ImageGenerationResult;
      const step2: WorkflowStep = {
        stepId: `step_${Date.now()}_2`,
        stepType: 'refine',
        prompt: workflow.refine.instruction,
        toolCalls: [{
          tool: 'image_edit',
          reason: 'Refining generated content',
          parameters: {
            imageUrl: workflow.refine.referenceImage || lastOutput.imageUrl,
            prompt: workflow.refine.instruction
          }
        }],
        status: 'pending'
      };

      try {
        const edited = await muapiService.editImage({
          imageUrl: workflow.refine.referenceImage || lastOutput.imageUrl,
          type: 'object-removal',
          prompt: workflow.refine.instruction
        });
        step2.output = edited;
        step2.status = 'completed';
      } catch (error: unknown) {
        step2.status = 'failed';
        step2.error = (error as Error).message;
      }
      steps.push(step2);
    }

    if (workflow.createAssets) {
      const step3: WorkflowStep = {
        stepId: `step_${Date.now()}_3`,
        stepType: 'create_assets',
        prompt: workflow.createAssets.baseContent || '',
        toolCalls: workflow.createAssets.assetTypes.map(type => ({
          tool: 'image_generation',
          reason: `Creating ${type} asset`,
          parameters: { prompt: workflow.createAssets!.baseContent, imageType: type as ImageType }
        })),
        status: 'pending'
      };

      try {
        const assets = await this.createMarketingKit(workflow.createAssets.assetTypes, workflow.createAssets.baseContent || '');
        step3.output = assets;
        step3.status = 'completed';
      } catch (error: unknown) {
        step3.status = 'failed';
        step3.error = (error as Error).message;
      }
      steps.push(step3);
    }

    return {
      workflowId: `workflow_${Date.now()}`,
      sessionId,
      steps,
      status: steps.every(s => s.status === 'completed') ? 'completed' : 'failed'
    };
  }

  // ============ FILE CONTEXT INTEGRATION ============

  async processFileWithContext(
    contextId: string,
    file: File,
    userInstruction: string
  ): Promise<EnhancedMessageResult> {
    const attachment = await conversationService.uploadAttachment(contextId, file);
    const attachmentUrl = await conversationService.getAttachmentUrl(attachment.storage_path);

    const isImage = file.type.startsWith('image/');
    const fileContexts: FileContext[] = [{
      id: attachment.id,
      name: file.name,
      type: file.type,
      url: attachmentUrl,
      content: isImage ? `Image file ready for processing: ${file.type}` : undefined
    }];

    return this.processEnhancedMessage({
      contextId,
      userMessage: userInstruction,
      fileContexts,
      toolChoice: 'required'
    });
  }

  async editExistingImage(
    contextId: string,
    imageUrl: string,
    editInstruction: string
  ): Promise<EnhancedMessageResult> {
    await conversationService.addMessage(contextId, 'user', editInstruction);

    const fileContexts: FileContext[] = [{
      id: `img_${Date.now()}`,
      name: 'existing-image.png',
      type: 'image/png',
      url: imageUrl,
      content: `Existing image to edit: ${imageUrl}`
    }];

    const editedImage = await muapiService.editImage({
      imageUrl,
      type: 'object-removal',
      prompt: editInstruction
    });

    const assistantMsg = await conversationService.addMessage(contextId, 'assistant', 
      `I've edited your image. Here's the result: ${editedImage.imageUrl}`, {
        has_image_generation: true
      });

    return {
      message: assistantMsg,
      generatedImages: [{
        imageUrl: editedImage.imageUrl,
        prompt: editInstruction,
        model: editedImage.model,
        timestamp: editedImage.timestamp
      }],
      fileContexts,
      responseId: assistantMsg.id
    };
  }

  // ============ BATCH ENHANCEMENT PIPELINES ============

  async generateCampaign(
    contextId: string,
    baseContent: string,
    platforms: string[],
    variations?: number
  ): Promise<BatchGenerationResult> {
    const result = await this.createCreativePackage(
      'Campaign',
      baseContent,
      platforms
    );

    return {
      images: result.brandAssets,
      batchId: `campaign_${Date.now()}`,
      campaignId: result.packageId
    };
  }

  async createMarketingKit(
    platforms: string[],
    content: string,
    branding?: string
  ): Promise<MuapiImageResult[]> {
    const images: MuapiImageResult[] = [];
    const platformPrompts = {
      instagram: `Instagram post for ${content}, square format, vibrant`,
      facebook: `Facebook cover for ${content}, wide format, professional`,
      twitter: `Twitter header for ${content}, clean, modern`,
      linkedin: `LinkedIn post for ${content}, professional, corporate`,
      tiktok: `TikTok video thumbnail for ${content}, dynamic, engaging`,
      youtube: `YouTube thumbnail for ${content}, bold text, eye-catching`,
      general: `General marketing graphic for ${content}`
    };

    for (const platform of platforms) {
      const prompt = platformPrompts[platform as keyof typeof platformPrompts] || platformPrompts.general;
      try {
        const result = await muapiService.generateSocialMediaPost({
          headline: content,
          platform: platform as any,
          style: branding,
          model: 'gpt-image'
        });
        images.push(result);
      } catch (error) {
        console.error(`Failed to generate ${platform} asset:`, error);
      }
    }

    return images;
  }

  async generateABTestVariants(
    contextId: string,
    prompt: string,
    variantsCount: number = 4,
    styleVariations?: string[]
  ): Promise<MuapiImageResult[]> {
    try {
      const variants = await muapiService.generateABTestVariants({
        prompt,
        variantsCount,
        styleVariations,
        model: 'gpt-image'
      });

      await conversationService.addMessage(contextId, 'assistant',
        `Generated ${variants.length} A/B test variants for: ${prompt}`);

      return variants;
    } catch (error: unknown) {
      console.error('A/B test variant generation failed:', error);
      return [];
    }
  }

  // ============ ADVANCED BATCH GENERATION ============

  async batchGenerateAssets(
    params: {
      basePrompt: string;
      variations?: number;
      platforms?: string[];
      styles?: string[];
      seedImages?: string[];
    }
  ): Promise<BatchGenerationResult> {
    const { basePrompt, variations = 5, platforms, styles } = params;

    try {
      if (platforms && platforms.length > 0) {
        const allImages: MuapiImageResult[] = [];
        for (const platform of platforms) {
          const result = await muapiService.generateSocialMediaPost({
            headline: basePrompt,
            platform: platform as any,
            model: 'gpt-image'
          });
          allImages.push(result);
        }
        return {
          images: allImages,
          batchId: `batch_${Date.now()}`,
          campaignId: `campaign_${Date.now()}`
        };
      }

      const batchResult = await muapiService.batchGenerate({
        basePrompt,
        variations,
        model: 'gpt-image'
      });

      return {
        images: batchResult.images,
        batchId: batchResult.batchId,
        campaignId: `campaign_${Date.now()}`
      };
    } catch (error: unknown) {
      console.error('Batch generation failed:', error);
      return {
        images: [],
        batchId: `batch_${Date.now()}`
      };
    }
  }

  // ============ CREATIVE AGENCY PACKAGE ============

  async createCreativePackage(
    clientName: string,
    projectBrief: string,
    deliverables: string[] = ['logo', 'social', 'web']
  ): Promise<AgencyCreativePackage> {
    const packageParams: CreativeAgencyParams = {
      clientName,
      projectType: 'marketing-kit',
      deliverables,
      brandGuidelines: projectBrief,
      model: 'gpt-image'
    };

    try {
      const result = await muapiService.createCreativeAgencyPackage(packageParams);
      return result;
    } catch (error: unknown) {
      console.error('Creative package generation failed:', error);
      return {
        brandAssets: [],
        marketingAssets: [],
        productAssets: [],
        styleGuide: {
          colors: ['#000000', '#FFFFFF'],
          fonts: ['Inter', 'Roboto'],
          mood: 'professional'
        },
        packageId: `pkg_${Date.now()}`
      };
    }
  }

  // ============ REFINING WORKFLOWS ============

  async refineContent(
    contextId: string,
    originalContent: string,
    refinementInstruction: string,
    referenceAssets?: ImageGenerationResult[]
  ): Promise<EnhancedMessageResult> {
    await conversationService.addMessage(contextId, 'user', refinementInstruction);

    let contextInfo = `Original content: ${originalContent}`;
    if (referenceAssets && referenceAssets.length > 0) {
      contextInfo += '\n\nReference images: ';
      referenceAssets.forEach(img => {
        contextInfo += `\n- ${img.imageUrl}`;
      });
    }

    const aiResponse = await this.generateAIResponse(
      `Refine: ${refinementInstruction}\n\n${contextInfo}`,
      undefined,
      undefined,
      referenceAssets
    );

    const assistantMsg = await conversationService.addMessage(contextId, 'assistant', aiResponse.content, {
      reasoning: aiResponse.reasoning,
      quality_score: this.calculateQualityScore(aiResponse.content, {
        hasWebSearch: false,
        hasCodeExecution: false,
        hasImageGeneration: !!referenceAssets?.length,
        hasVideoGeneration: false
      })
    });

    return {
      message: assistantMsg,
      generatedImages: referenceAssets,
      responseId: assistantMsg.id
    };
  }

  // ============ HELPER METHODS ============

  private extractImagePrompt(message: string): string | null {
    const patterns = [
      /generate image of (.+)/i,
      /create image of (.+)/i,
      /draw (.+)/i,
      /design (.+)/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return null;
  }

  async getConversationHistory(
    contextId: string,
    options?: {
      includeAttachments?: boolean;
      includeGeneratedImages?: boolean;
      includeWebResults?: boolean;
    }
  ): Promise<{
    messages: ConversationMessage[];
    attachments: FileContext[];
    images: MuapiImageResult[];
  }> {
    const messages = await conversationService.getMessages(contextId);
    const attachments: FileContext[] = [];
    const images: MuapiImageResult[] = [];

    if (options?.includeAttachments) {
      for (const message of messages) {
        const atts = await conversationService.getAttachments(contextId, message.id);
        for (const att of atts) {
          const url = await conversationService.getAttachmentUrl(att.storage_path);
          attachments.push({
            id: att.id,
            name: att.file_name,
            type: att.file_type,
            url
          });
        }
      }
    }

    if (options?.includeGeneratedImages) {
      for (const message of messages) {
        const imgs = await conversationService.getGeneratedImages(message.id);
        images.push(...imgs.map(img => ({
          imageUrl: img.image_url,
          prompt: img.prompt,
          model: img.model,
          timestamp: img.created_at || new Date().toISOString()
        })));
      }
    }

    return { messages, attachments, images };
  }

  // ============ TOOL ORCHESTRATION WITH RESPONSE CHAINING ============

  async continueConversation(
    contextId: string,
    message: string,
    previousResponseId?: string
  ): Promise<EnhancedMessageResult> {
    const result = await this.processEnhancedMessage({
      contextId,
      userMessage: message,
      sessionId: contextId,
      previousResponseId
    });

    return result;
  }

  async selectBestTool(
    userIntent: string,
    availableTools: ('web_search' | 'code_execution' | 'image_generation' | 'video_generation')[] = ['web_search', 'code_execution', 'image_generation', 'video_generation']
  ): Promise<ToolCall | null> {
    const toolPrompts: Record<string, string> = {
      web_search: 'User needs factual, current, or researched information',
      code_execution: 'User needs calculations, data processing, or code execution',
      image_generation: 'User needs visual content, graphics, or designs',
      video_generation: 'User needs motion graphics or animated content'
    };

    const intent = userIntent.toLowerCase();

    if (intent.match(/price|stock|weather|news|latest|current|update|search/) && availableTools.includes('web_search')) {
      return { tool: 'web_search', reason: toolPrompts.web_search, parameters: { query: userIntent } };
    }

    if (intent.match(/calculate|compute|solve|math|code|script/) && availableTools.includes('code_execution')) {
      return { tool: 'code_execution', reason: toolPrompts.code_execution, parameters: { code: userIntent } };
    }

    if (intent.match(/image|picture|photo|drawing|design|graphic|logo|thumbnail/) && availableTools.includes('image_generation')) {
      return { tool: 'image_generation', reason: toolPrompts.image_generation, parameters: { prompt: userIntent } };
    }

    if (intent.match(/video|animation|animate|motion|clip/) && availableTools.includes('video_generation')) {
      return { tool: 'video_generation', reason: toolPrompts.video_generation, parameters: { prompt: userIntent } };
    }

    return null;
  }
}

export const enhancedConversationService = new EnhancedConversationService();