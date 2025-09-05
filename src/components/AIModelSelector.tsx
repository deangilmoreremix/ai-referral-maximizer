import React from 'react';
import { Brain, Zap, Sparkles, Info } from 'lucide-react';

export type AIModel = 'gemini-2.5-pro' | 'gemini-2.0-flash' | 'gemini-2.0-flash-light';

interface AIModelSelectorProps {
  selectedModel: AIModel;
  onChange: (model: AIModel) => void;
  showInfo?: boolean;
  className?: string;
}

const AIModelSelector: React.FC<AIModelSelectorProps> = ({ 
  selectedModel, 
  onChange,
  showInfo = true,
  className = ''
}) => {
  
  // Model options with metadata
  const models = [
    {
      id: 'gemini-2.5-pro',
      name: 'Gemini 2.5 Pro',
      description: 'Highest quality, comprehensive content with nuanced details',
      icon: <Brain className="h-5 w-5 text-purple-600" />,
      capabilities: ['Most detailed content', 'Complex personalization', 'Nuanced relationship understanding']
    },
    {
      id: 'gemini-2.0-flash',
      name: 'Gemini 2.0 Flash',
      description: 'Balanced model with good quality and reasonable speed',
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      capabilities: ['Good balance of quality and speed', 'Standard personalization', 'Fast generation']
    },
    {
      id: 'gemini-2.0-flash-light',
      name: 'Gemini 2.0 Flash Light',
      description: 'Fastest generation with concise outputs',
      icon: <Sparkles className="h-5 w-5 text-blue-500" />,
      capabilities: ['Fastest response times', 'Basic personalization', 'Concise outputs']
    }
  ];
  
  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        AI Model
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {models.map((model) => (
          <div 
            key={model.id}
            className={`border rounded-lg p-3 cursor-pointer transition-all ${
              selectedModel === model.id 
                ? 'border-green-500 bg-green-50 shadow-sm' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onChange(model.id as AIModel)}
          >
            <div className="flex items-center mb-1">
              {model.icon}
              <span className="ml-2 font-medium">{model.name}</span>
            </div>
            <p className="text-xs text-gray-600">{model.description}</p>
          </div>
        ))}
      </div>

      {showInfo && (
        <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">About AI Models</h4>
              <p className="mt-1 text-xs text-blue-700">
                Different models offer trade-offs between quality and speed. Gemini 2.5 Pro provides the highest quality content but may take slightly longer, while Flash Light is optimized for speed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIModelSelector;