import React, { useState } from 'react';
import { ImageIcon, Sparkles, Download, AlertCircle, CheckCircle, Zap } from 'lucide-react';

interface ImageGeneratorProps {
  contentType?: string;
  contentTitle?: string;
  onImageGenerated?: (imageUrl: string, prompt: string) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  contentType,
  contentTitle,
  onImageGenerated
}) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<'dall-e-3' | 'dall-e-2'>('dall-e-3');
  const [size, setSize] = useState<'1024x1024' | '1792x1024' | '1024x1792'>('1024x1024');

  // Auto-generate prompt suggestions based on content type
  const getPromptSuggestions = () => {
    if (!contentType) return [];

    const suggestions: Record<string, string[]> = {
      'presentation': [
        'Professional business presentation slide with clean design',
        'Modern infographic for business strategy presentation',
        'Corporate presentation template with charts and graphs'
      ],
      'email': [
        'Professional email header design with company branding',
        'Business email template with clean typography',
        'Corporate newsletter design with modern layout'
      ],
      'social': [
        'Professional LinkedIn post graphic with engaging visuals',
        'Social media banner for business networking',
        'Company branding graphic for social media'
      ],
      'meeting': [
        'Professional meeting room setup with presentation screen',
        'Business meeting with team collaboration',
        'Conference room with modern business equipment'
      ],
      'campaign': [
        'Multi-step campaign timeline visualization',
        'Referral campaign funnel graphic',
        'Business growth chart with upward trend'
      ]
    };

    return suggestions[contentType.toLowerCase()] || [
      'Professional business graphic with clean design',
      'Modern corporate visual with company branding',
      'Business infographic with data visualization'
    ];
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration is missing');
      }

      const apiUrl = `${supabaseUrl}/functions/v1/openai-images`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model,
          size
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        onImageGenerated?.(data.imageUrl, prompt);
      } else {
        throw new Error('No image URL returned');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const applySuggestion = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ImageIcon className="h-5 w-5 text-blue-600 mr-2" />
          AI Image Generator
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Generate professional visuals for your {contentTitle || 'content'}
        </p>
      </div>

      {/* Model and Size Selection */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as 'dall-e-3' | 'dall-e-2')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="dall-e-3">DALL-E 3 (Higher Quality)</option>
            <option value="dall-e-2">DALL-E 2 (Faster)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Size
          </label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value as '1024x1024' | '1792x1024' | '1024x1792')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1024x1024">Square (1024×1024)</option>
            <option value="1792x1024">Landscape (1792×1024)</option>
            <option value="1024x1792">Portrait (1024×1792)</option>
          </select>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image Description
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-vertical"
          disabled={isGenerating}
        />
      </div>

      {/* Prompt Suggestions */}
      {getPromptSuggestions().length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Quick Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {getPromptSuggestions().map((suggestion, index) => (
              <button
                key={index}
                onClick={() => applySuggestion(suggestion)}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors"
                disabled={isGenerating}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="mb-4">
        <button
          onClick={handleGenerateImage}
          disabled={!prompt.trim() || isGenerating}
          className={`w-full px-4 py-2 rounded-md text-white font-medium flex items-center justify-center ${
            !prompt.trim() || isGenerating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Generating Image...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Image
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Generated Image Display */}
      {generatedImage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center mb-3">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <p className="text-sm font-medium text-green-800">Image Generated Successfully!</p>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4">
            <img
              src={generatedImage}
              alt="Generated"
              className="w-full h-auto rounded-lg shadow-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadImage}
              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium flex items-center justify-center"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </button>
            <button
              onClick={() => {
                setGeneratedImage(null);
                setPrompt('');
              }}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium"
            >
              Generate Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;