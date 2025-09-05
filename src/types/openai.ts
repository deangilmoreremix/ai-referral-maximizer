// OpenAI model types and interfaces

export type OpenAIModel = 
  | 'gpt-5'           // Flagship GPT-5 model
  | 'gpt-5-mini'      // Faster/cheaper GPT-5 model
  | 'gpt-5-nano'      // Lowest latency GPT-5 model
  | 'gpt-4o'          // Current best model
  | 'gpt-4o-mini'     // Current efficient model
  | 'gpt-4-turbo'     // Current powerful model
  | 'gpt-3.5-turbo';  // Current fast model

export interface GPT5RequestPayload {
  messages?: Array<{ role: string; content: string }>;
  input?: string;
  model?: OpenAIModel;
}

export interface GPT5Response {
  model: string;
  actual_model_used?: string;
  text: string;
  fallback_note?: string;
  error?: string;
}

// Model capabilities and descriptions
export const MODEL_INFO: Record<OpenAIModel, {
  name: string;
  description: string;
  available: boolean;
  speed: 'fast' | 'medium' | 'slow';
  quality: 'high' | 'medium' | 'basic';
  costLevel: 'low' | 'medium' | 'high';
}> = {
  'gpt-5': {
    name: 'GPT-5',
    description: 'Flagship GPT-5 model',
    available: true,
    speed: 'medium',
    quality: 'high',
    costLevel: 'high'
  },
  'gpt-5-mini': {
    name: 'GPT-5 Mini',
    description: 'Faster and cheaper GPT-5 model',
    available: true,
    speed: 'fast',
    quality: 'high',
    costLevel: 'medium'
  },
  'gpt-5-nano': {
    name: 'GPT-5 Nano',
    description: 'Lowest latency GPT-5 model',
    available: true,
    speed: 'fast',
    quality: 'medium',
    costLevel: 'low'
  },
  'gpt-4o': {
    name: 'GPT-4o',
    description: 'Current best available model',
    available: true,
    speed: 'medium',
    quality: 'high',
    costLevel: 'high'
  },
  'gpt-4o-mini': {
    name: 'GPT-4o Mini',
    description: 'Efficient and capable',
    available: true,
    speed: 'fast',
    quality: 'high',
    costLevel: 'medium'
  },
  'gpt-4-turbo': {
    name: 'GPT-4 Turbo',
    description: 'Powerful and versatile',
    available: true,
    speed: 'medium',
    quality: 'high',
    costLevel: 'high'
  },
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    description: 'Fast and cost-effective',
    available: true,
    speed: 'fast',
    quality: 'medium',
    costLevel: 'low'
  }
};