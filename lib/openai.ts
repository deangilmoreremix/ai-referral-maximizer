import { OpenAI } from "openai";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";
const openai = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });

// Available models - will be updated when GPT-5 is released
export const AVAILABLE_MODELS = {
  // GPT-5 models (now available)
  'gpt-5': 'GPT-5',
  'gpt-5-mini': 'GPT-5 Mini', 
  'gpt-5-nano': 'GPT-5 Nano',
  
  // Current available models as fallback
  'gpt-4o': 'GPT-4o',
  'gpt-4o-mini': 'GPT-4o Mini',
  'gpt-4-turbo': 'GPT-4 Turbo',
  'gpt-3.5-turbo': 'GPT-3.5 Turbo'
} as const;

export type OpenAIModel = keyof typeof AVAILABLE_MODELS;

// Type for API payload
export interface GPT5RequestPayload {
  messages?: Array<{ role: string; content: string }>;
  input?: string;
  model?: OpenAIModel;
}

// Utility function to check if GPT-5 models are available
export async function checkGPT5Availability(): Promise<boolean> {
  try {
    const models = await openai.models.list();
    return models.data.some(model => model.id.startsWith('gpt-5'));
  } catch {
    return false;
  }
}

// Function to get the best available model
export async function getBestAvailableModel(preferredModel: OpenAIModel): Promise<string> {
  // Since GPT-5 is now available, return the preferred model directly
  return preferredModel;
}

// Cost-optimized model selection based on content type and complexity
export function getOptimalModelForContent(contentType: string, complexity: 'low' | 'medium' | 'high' = 'medium'): OpenAIModel {
  // Content type mappings for optimal model selection
  const modelMappings: Record<string, { low: OpenAIModel; medium: OpenAIModel; high: OpenAIModel }> = {
    // Simple templates and scripts
    'Phone Call Scripts': { low: 'gpt-5-nano', medium: 'gpt-5-mini', high: 'gpt-5' },
    'SMS Templates': { low: 'gpt-5-nano', medium: 'gpt-5-nano', high: 'gpt-5-mini' },
    'Voice Drop Scripts': { low: 'gpt-5-nano', medium: 'gpt-5-mini', high: 'gpt-5' },
    'Referral Email Templates': { low: 'gpt-5-nano', medium: 'gpt-5-mini', high: 'gpt-5' },
    'Direct Mail Templates': { low: 'gpt-5-nano', medium: 'gpt-5-mini', high: 'gpt-5' },

    // Multi-day campaigns (require more planning and structure)
    'Friends and Family Campaign': { low: 'gpt-5-mini', medium: 'gpt-5', high: 'gpt-5' },
    'WhatsApp Outreach Campaigns': { low: 'gpt-5-mini', medium: 'gpt-5', high: 'gpt-5' },
    'Facebook Group Strategies': { low: 'gpt-5-mini', medium: 'gpt-5', high: 'gpt-5' },
    'Referral Nurturing Campaigns': { low: 'gpt-5-mini', medium: 'gpt-5', high: 'gpt-5' },

    // Complex business strategies and frameworks
    'Referral Reward Programs': { low: 'gpt-5-mini', medium: 'gpt-5', high: 'gpt-5' },
    'Tiered Incentive Structures': { low: 'gpt-5-mini', medium: 'gpt-5', high: 'gpt-5' },
    'Multi-Level Commission Structures': { low: 'gpt-5-mini', medium: 'gpt-5', high: 'gpt-5' },
    'Referral Tracking Systems': { low: 'gpt-5-mini', medium: 'gpt-5', high: 'gpt-5' },
    'Client Referral Program': { low: 'gpt-5-mini', medium: 'gpt-5', high: 'gpt-5' },

    // Agency and consulting content (high complexity)
    'Agency Service Description': { low: 'gpt-5-mini', medium: 'gpt-5', high: 'gpt-5' },
    'Agency Pricing Structure': { low: 'gpt-5-mini', medium: 'gpt-5', high: 'gpt-5' },
    'Client Proposal Template': { low: 'gpt-5-mini', medium: 'gpt-5', high: 'gpt-5' },
    'Client Case Study': { low: 'gpt-5-mini', medium: 'gpt-5', high: 'gpt-5' },
    'Expertise Positioning': { low: 'gpt-5-mini', medium: 'gpt-5', high: 'gpt-5' },
    'Service Framework': { low: 'gpt-5-mini', medium: 'gpt-5', high: 'gpt-5' },
    'Consultant Business Model': { low: 'gpt-5-mini', medium: 'gpt-5', high: 'gpt-5' },

    // Content enhancement (variable complexity)
    'Voice Drop Enhancement': { low: 'gpt-5-nano', medium: 'gpt-5-mini', high: 'gpt-5' },
    'SMS Enhancement': { low: 'gpt-5-nano', medium: 'gpt-5-nano', high: 'gpt-5-mini' },
    'WhatsApp Enhancement': { low: 'gpt-5-nano', medium: 'gpt-5-mini', high: 'gpt-5' },

    // Default fallback
    'default': { low: 'gpt-5-nano', medium: 'gpt-5-mini', high: 'gpt-5' }
  };

  const mapping = modelMappings[contentType] || modelMappings['default'];
  return mapping[complexity];
}

// Get model cost estimate for a given content type
export function getEstimatedCost(contentType: string, complexity: 'low' | 'medium' | 'high' = 'medium', tokenCount: number = 1000): number {
  const model = getOptimalModelForContent(contentType, complexity);

  // Estimated costs per 1K tokens (approximate)
  const costs: Record<OpenAIModel, { input: number; output: number }> = {
    'gpt-5': { input: 0.01, output: 0.03 },
    'gpt-5-mini': { input: 0.0015, output: 0.002 },
    'gpt-5-nano': { input: 0.0005, output: 0.001 },
    'gpt-4o': { input: 0.005, output: 0.015 },
    'gpt-4o-mini': { input: 0.0015, output: 0.002 },
    'gpt-4-turbo': { input: 0.01, output: 0.03 },
    'gpt-3.5-turbo': { input: 0.0015, output: 0.002 }
  };

  const modelCost = costs[model];
  // Assume 70% input tokens, 30% output tokens
  const inputCost = (tokenCount * 0.7) * modelCost.input / 1000;
  const outputCost = (tokenCount * 0.3) * modelCost.output / 1000;

  return inputCost + outputCost;
}

// Prompt Polisher for DALL·E integration
export async function polishImagePrompt(rawPrompt: string, model: OpenAIModel = 'gpt-5'): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "user",
          content: `Improve this image prompt for DALL·E 3. Make it more descriptive, specific, and optimized for better image generation. Keep it concise but add relevant details about style, lighting, composition, and mood. Original prompt: """${rawPrompt}"""`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const polishedPrompt = response.choices[0]?.message?.content || rawPrompt;

    return polishedPrompt.trim();
  } catch (error) {
    console.error('Error polishing prompt:', error);
    return rawPrompt; // Return original prompt if polishing fails
  }
}

// DALL·E image generation function
export async function generateImage(prompt: string, model: 'dall-e-3' | 'dall-e-2' = 'dall-e-3', size: '1024x1024' | '1792x1024' | '1024x1792' = '1024x1024') {
  try {
    const response = await openai.images.generate({
      model: model,
      prompt: prompt,
      size: size,
      quality: 'standard',
      n: 1,
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No image data returned from DALL·E');
    }

    return response.data[0];
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}