/**
 * Image Generation Service
 * Integrates with existing image generation functionality
 */

import { generateImage as geminiGenerateImage } from './geminiService';

export interface ImageGenerationRequest {
  prompt: string;
  model?: 'gemini' | 'openai';
  size?: string;
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
   * Generate an image from a text prompt
   */
  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
    const { prompt, model = 'gemini' } = request;

    try {
      let imageUrl: string;

      if (model === 'gemini') {
        // Use existing Gemini image generation
        imageUrl = await geminiGenerateImage(prompt);
      } else {
        // Placeholder for other models
        imageUrl = await this.generatePlaceholderImage(prompt);
      }

      return {
        imageUrl,
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
   * Generate a placeholder image (for development/testing)
   */
  private async generatePlaceholderImage(prompt: string): Promise<string> {
    // Return a placeholder image URL based on the prompt
    const encodedPrompt = encodeURIComponent(prompt.substring(0, 50));
    return `https://via.placeholder.com/512x512.png?text=${encodedPrompt}`;
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
