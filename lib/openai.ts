import { OpenAI } from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // set in project settings
});

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