/**
 * Image Generation Service
 * Integrates with existing OpenAI DALL-E image generation
 */

import { generateImage as dalleGenerateImage } from '../../lib/openai';

export interface ImageGenerationRequest {
  prompt: string;
  model?: 'dall-e-3' | 'dall-e-2';
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: string;
}

export interface ImageGenerationResult {
  imageUrl: string;
  prompt: string;
  model: string;
  timestamp: string;
}

class ImageGenerationService {
  /**
   * Generate an image from a text prompt using OpenAI DALL-E
   */
  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
    const { prompt, model = 'dall-e-3', size = '1024x1024' } = request;

    try {
      // Use OpenAI DALL-E for real image generation
      const result = await dalleGenerateImage(prompt, model, size);

      if (!result.url) {
        throw new Error('No image URL returned from DALL-E');
      }

      return {
        imageUrl: result.url,
        prompt,
        model,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('Image generation error:', error);
      throw new Error(`Failed to generate image: ${error.message}`);
    }
  }

  /**
   * Check if a prompt is suitable for image generation
   */
  shouldGenerateImage(text: string): boolean {
    const imageKeywords = [
      'generate image',
      'create image',
      'draw',
      'visualize',
      'show me',
      'picture of',
      'illustration of',
      'design',
      'render',
      'make an image'
    ];

    const lowerText = text.toLowerCase();
    return imageKeywords.some(keyword => lowerText.includes(keyword));
  }

  /**
   * Extract image prompt from user message
   */
  extractImagePrompt(text: string): string | null {
    // Try to find the prompt after keywords
    const patterns = [
      /generate image of (.+)/i,
      /create image of (.+)/i,
      /draw (.+)/i,
      /visualize (.+)/i,
      /show me (.+)/i,
      /picture of (.+)/i,
      /illustration of (.+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    // If no pattern matches, return the full text if it's short enough
    if (text.length < 200 && this.shouldGenerateImage(text)) {
      return text;
    }

    return null;
  }
}

export const imageGenerationService = new ImageGenerationService();
