import React, { useState } from 'react';
import { Brain, Zap, Sparkles, CheckCircle, Info, ArrowRight, Clock, Database, BarChart2, Shield } from 'lucide-react';

interface ModelFeature {
  name: string;
  supportLevel: {
    pro: 'full' | 'partial' | 'none';
    flash: 'full' | 'partial' | 'none';
    flashLite: 'full' | 'partial' | 'none';
  };
  description: string;
}

const AIModelExplorer: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<'pro' | 'flash' | 'flashLite'>('pro');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  
  // Model definitions
  const models = [
    {
      id: 'pro',
      name: 'Gemini 2.35 Pro',
      apiName: 'gemini-1.5-pro',
      icon: <Brain className="h-6 w-6 text-indigo-600" />,
      description: 'Our most capable model for high quality, detailed content generation with strong reasoning capabilities.',
      capabilities: 'Advanced reasoning, nuanced understanding, and highly detailed content generation',
      useCase: 'Complex, high-value referral content requiring deep personalization',
      responseTime: '~30 seconds',
      costLevel: 'High',
      advantages: [
        'Most detailed and personalized content',
        'Advanced understanding of relationship context',
        'Extensive industry knowledge',
        'Sophisticated reasoning about business needs',
        'High-quality, publication-ready output'
      ]
    },
    {
      id: 'flash',
      name: 'Gemini 2.0 Flash',
      apiName: 'gemini-1.0-pro',
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      description: 'Balanced model offering good quality content with reasonable speed for standard referral content needs.',
      capabilities: 'Balanced quality and speed for standard referral content',
      useCase: 'Everyday referral content with moderate customization needs',
      responseTime: '~15 seconds',
      costLevel: 'Medium',
      advantages: [
        'Good balance of quality and generation speed',
        'Strong personalization capabilities',
        'Effective for most referral scenarios',
        'Reliable format adherence',
        'Good industry context understanding'
      ]
    },
    {
      id: 'flashLite',
      name: 'Gemini 2.0 Flash Lite',
      apiName: 'gemini-1.0-pro-vision',
      icon: <Sparkles className="h-6 w-6 text-blue-500" />,
      description: 'Our fastest model optimized for speed, providing concise referral content with minimal latency.',
      capabilities: 'Quick, concise content generation with basic personalization',
      useCase: 'Simple referral templates and rapid content generation',
      responseTime: '~5 seconds',
      costLevel: 'Low',
      advantages: [
        'Fastest response times',
        'Most cost-effective option',
        'Good for basic templating',
        'Ideal for high-volume needs',
        'Excellent for initial drafts'
      ]
    }
  ];

  // Model comparison features
  const features: ModelFeature[] = [
    {
      name: 'Content Quality',
      supportLevel: { pro: 'full', flash: 'partial', flashLite: 'partial' },
      description: 'Overall quality of generated content including coherence, relevance, and persuasiveness.'
    },
    {
      name: 'Personalization Depth',
      supportLevel: { pro: 'full', flash: 'partial', flashLite: 'none' },
      description: 'Ability to deeply customize content based on industry, audience, and relationship context.'
    },
    {
      name: 'Content Length',
      supportLevel: { pro: 'full', flash: 'full', flashLite: 'partial' },
      description: 'Capability to generate lengthy, comprehensive content when needed.'
    },
    {
      name: 'Response Speed',
      supportLevel: { pro: 'none', flash: 'partial', flashLite: 'full' },
      description: 'Time taken to generate content, with faster speeds enabling more real-time applications.'
    },
    {
      name: 'Cost Efficiency',
      supportLevel: { pro: 'none', flash: 'partial', flashLite: 'full' },
      description: 'API costs per generation, affecting overall operational expenses.'
    },
    {
      name: 'Multi-day Campaign Support',
      supportLevel: { pro: 'full', flash: 'full', flashLite: 'partial' },
      description: 'Ability to create coherent sequences across multi-day campaigns.'
    },
    {
      name: 'Industry Knowledge',
      supportLevel: { pro: 'full', flash: 'partial', flashLite: 'partial' },
      description: 'Depth of understanding about specific industries and their referral nuances.'
    },
    {
      name: 'Format Adherence',
      supportLevel: { pro: 'full', flash: 'full', flashLite: 'partial' },
      description: 'Capability to follow specific formats, templates and structural requirements.'
    }
  ];
  
  // Function to render support level indicator
  const renderSupportLevel = (level: 'full' | 'partial' | 'none') => {
    if (level === 'full') {
      return <span className="text-green-500 flex items-center"><CheckCircle size={16} className="mr-1" /> Full</span>;
    } else if (level === 'partial') {
      return <span className="text-amber-500 flex items-center"><CheckCircle size={16} className="mr-1" /> Partial</span>;
    } else {
      return <span className="text-gray-400 flex items-center"><Info size={16} className="mr-1" /> Limited</span>;
    }
  };

  // Get the currently selected model
  const currentModel = models.find(m => m.id === selectedModel);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Brain className="h-6 w-6 text-indigo-600 mr-2" />
          AI Model Explorer
        </h2>
        <p className="text-gray-600 mt-1">
          Compare Gemini models to choose the right option for your agency's referral content generation needs
        </p>
      </div>
      
      {/* Model Selection Tabs */}
      <div className="flex border-b border-gray-200">
        {models.map(model => (
          <div 
            key={model.id}
            onClick={() => setSelectedModel(model.id as 'pro' | 'flash' | 'flashLite')}
            className={`cursor-pointer px-6 py-3 text-center flex-1 transition-colors relative ${
              selectedModel === model.id 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="mb-1">{model.icon}</div>
              <h3 className="font-medium text-sm">{model.name}</h3>
              <p className="text-xs text-gray-500">
                {model.id === 'pro' ? 'Premium Quality' : model.id === 'flash' ? 'Balanced' : 'Fast & Efficient'}
              </p>
            </div>
            {selectedModel === model.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Selected Model Details */}
      <div className="p-6 border-b border-gray-200">
        {currentModel && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-start">
                <div className={`rounded-full p-2 mr-3 ${
                  currentModel.id === 'pro' ? 'bg-indigo-100' : 
                  currentModel.id === 'flash' ? 'bg-amber-100' : 'bg-blue-100'
                }`}>
                  {currentModel.icon}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-800">{currentModel.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{currentModel.description}</p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-2" />
                    <h4 className="font-medium text-gray-700">Response Time</h4>
                  </div>
                  <p className="ml-7 text-sm text-gray-600">{currentModel.responseTime}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center">
                    <Database className="h-5 w-5 text-gray-500 mr-2" />
                    <h4 className="font-medium text-gray-700">API Name</h4>
                  </div>
                  <p className="ml-7 text-sm text-gray-600 font-mono">{currentModel.apiName}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center">
                    <BarChart2 className="h-5 w-5 text-gray-500 mr-2" />
                    <h4 className="font-medium text-gray-700">Cost Level</h4>
                  </div>
                  <p className="ml-7 text-sm text-gray-600">{currentModel.costLevel}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-500 mr-2" />
                    <h4 className="font-medium text-gray-700">Best Use Case</h4>
                  </div>
                  <p className="ml-7 text-sm text-gray-600">{currentModel.useCase}</p>
                </div>
              </div>
              
              <div className="mt-5">
                <h4 className="font-medium text-gray-700 mb-2">Key Advantages</h4>
                <ul className="space-y-1">
                  {currentModel.advantages.map((advantage, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-5 border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-3">Implementation Guide</h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700">1. API Configuration</h5>
                  <p className="text-xs text-gray-600 mt-1">
                    Set up your Gemini API credentials and configure the {currentModel.name} model in your agency dashboard.
                  </p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700">2. Content Templates</h5>
                  <p className="text-xs text-gray-600 mt-1">
                    Create base templates optimized for this model's strengths in the template editor.
                  </p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700">3. Parameter Tuning</h5>
                  <p className="text-xs text-gray-600 mt-1">
                    Adjust temperature, response length, and other parameters to optimize output quality.
                  </p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700">4. Integration Testing</h5>
                  <p className="text-xs text-gray-600 mt-1">
                    Test model performance with your specific referral content scenarios.
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm flex items-center justify-center">
                  <span>Set Up With {currentModel.name}</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
                <p className="text-xs text-center text-gray-500 mt-2">
                  Full documentation available in setup guide
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Feature Comparison Table */}
      <div className="p-6">
        <h3 className="font-bold text-gray-800 mb-4">Feature Comparison</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700 w-1/3">Feature</th>
                <th className="border border-gray-200 px-4 py-2 text-center text-sm font-medium text-indigo-700">
                  <div className="flex flex-col items-center">
                    <Brain className="h-5 w-5 mb-1" />
                    <span>Gemini 2.35 Pro</span>
                  </div>
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center text-sm font-medium text-amber-600">
                  <div className="flex flex-col items-center">
                    <Zap className="h-5 w-5 mb-1" />
                    <span>Gemini 2.0 Flash</span>
                  </div>
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center text-sm font-medium text-blue-600">
                  <div className="flex flex-col items-center">
                    <Sparkles className="h-5 w-5 mb-1" />
                    <span>Gemini 2.0 Flash Lite</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => (
                <tr 
                  key={idx} 
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                    selectedFeature === feature.name ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedFeature(selectedFeature === feature.name ? null : feature.name)}
                >
                  <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-800">
                    {feature.name}
                    {selectedFeature === feature.name && (
                      <p className="font-normal text-xs text-gray-600 mt-1">{feature.description}</p>
                    )}
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-sm text-center">
                    {renderSupportLevel(feature.supportLevel.pro)}
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-sm text-center">
                    {renderSupportLevel(feature.supportLevel.flash)}
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-sm text-center">
                    {renderSupportLevel(feature.supportLevel.flashLite)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 bg-indigo-50 rounded-lg p-4 border border-indigo-100">
          <div className="flex">
            <div>
              <Info className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="ml-3">
              <h4 className="font-medium text-indigo-800 text-sm">Choosing the Right Model for Your Agency</h4>
              <p className="text-xs text-indigo-600 mt-1">
                For agencies just starting out, we recommend using Gemini 2.0 Flash for a good balance of quality and cost.
                As your agency grows, you can upgrade to Gemini 2.35 Pro for premium clients or specialized content needs.
                For high-volume, time-sensitive work, Gemini 2.0 Flash Lite offers the fastest turnaround times.
              </p>
              <p className="text-xs text-indigo-600 mt-2">
                You can also use different models for different service tiers - offering premium content with 
                Gemini 2.35 Pro at higher price points while using Flash models for standard service tiers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModelExplorer;