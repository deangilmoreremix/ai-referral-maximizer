import React from 'react';
import { Brain, Zap, Sparkles, Clock, Info, AlertCircle } from 'lucide-react';
import { OpenAIModel, MODEL_INFO } from '../types/openai';

interface OpenAIModelSelectorProps {
  selectedModel: OpenAIModel;
  onChange: (model: OpenAIModel) => void;
  showInfo?: boolean;
  className?: string;
}

const OpenAIModelSelector: React.FC<OpenAIModelSelectorProps> = ({ 
  selectedModel, 
  onChange,
  showInfo = true,
  className = ''
}) => {
  
  // Group models by GPT generation
  const gpt5Models = Object.entries(MODEL_INFO).filter(([model]) => model.startsWith('gpt-5'));
  const otherModels = Object.entries(MODEL_INFO).filter(([model]) => !model.startsWith('gpt-5'));
  
  // Get icon for model
  const getModelIcon = (model: OpenAIModel) => {
    if (model.startsWith('gpt-5')) {
      return <Brain className="h-5 w-5 text-purple-600" />;
    } else if (model.includes('mini') || model.includes('nano')) {
      return <Sparkles className="h-5 w-5 text-blue-500" />;
    } else if (model.includes('turbo')) {
      return <Zap className="h-5 w-5 text-yellow-500" />;
    }
    return <Brain className="h-5 w-5 text-gray-600" />;
  };
  
  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        OpenAI Model
      </label>
      
      {/* GPT-5 Models */}
      <div className="space-y-3 mb-4">
        <h4 className="text-sm font-medium text-gray-800">GPT-5 Models</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {gpt5Models.map(([modelId, info]) => (
            <div 
              key={modelId}
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                selectedModel === modelId 
                  ? 'border-purple-500 bg-purple-50 shadow-sm' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => onChange(modelId as OpenAIModel)}
            >
              <div className="flex items-center mb-1">
                {getModelIcon(modelId as OpenAIModel)}
                <span className="ml-2 font-medium">{info.name}</span>
                <span className="ml-auto text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                  New
                </span>
              </div>
              <p className="text-xs text-gray-600">{info.description}</p>
              <div className="flex items-center mt-2 space-x-3 text-xs">
                <span className={`flex items-center ${
                  info.speed === 'fast' ? 'text-green-600' : 
                  info.speed === 'medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  <Clock size={12} className="mr-1" />
                  {info.speed}
                </span>
                <span className="text-purple-600">
                  {info.quality} quality
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other Models */}
      <div className="space-y-3 mb-4">
        <h4 className="text-sm font-medium text-gray-800">Previous Generation Models</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {otherModels.map(([modelId, info]) => (
            <div 
              key={modelId}
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                selectedModel === modelId 
                  ? 'border-green-500 bg-green-50 shadow-sm' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => onChange(modelId as OpenAIModel)}
            >
              <div className="flex items-center mb-1">
                {getModelIcon(modelId as OpenAIModel)}
                <span className="ml-2 font-medium">{info.name}</span>
              </div>
              <p className="text-xs text-gray-600">{info.description}</p>
            </div>
          ))}
        </div>
      </div>

      {showInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">About GPT-5 Models</h4>
              <p className="mt-1 text-xs text-blue-700">
                GPT-5 is OpenAI's latest generation of models, offering improved reasoning, faster responses, and better quality output. GPT-5 Mini and GPT-5 Nano provide cost and speed optimizations while maintaining high quality.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenAIModelSelector;