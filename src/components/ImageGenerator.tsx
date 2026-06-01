import React, { useState } from 'react';
import { ImageIcon, Sparkles, Download, AlertCircle, CheckCircle, Video, Zap, Layers, Palette, Package, Building, Shirt, BookOpen } from 'lucide-react';
import { muapiService, VideoGenerationResult } from '../services/muapiService';

interface ImageGeneratorProps {
  contentType?: string;
  contentTitle?: string;
  tenantId?: string;
  onImageGenerated?: (imageUrl: string, prompt: string, type?: string) => void;
  onVideoGenerated?: (videoUrl: string, prompt: string) => void;
}

type ImageType = 'standard' | 'photorealistic' | 'illustration' | 'logo' | 'marketing' | 'product' | 'content-media' | 'ui-design' | 'educational' | 'real-estate' | 'fashion';

const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  contentType,
  contentTitle,
  tenantId,
  onImageGenerated,
  onVideoGenerated
}) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<VideoGenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageType, setImageType] = useState<ImageType>('standard');
  const [model, setModel] = useState<string>('gpt-image');
  const [size, setSize] = useState<string>('1024x1024');
  const [quality, setQuality] = useState<string>('medium');
  const [videoDuration, setVideoDuration] = useState<number>(5);
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [generatedType, setGeneratedType] = useState<string>('standard');

  // Auto-generate prompt suggestions based on content type and image type
  const getPromptSuggestions = () => {
    const suggestions: Record<string, Record<string, string[]>> = {
      standard: {
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
      },
      photorealistic: {
        'presentation': [
          'Photorealistic product showcase on modern desk, studio lighting',
          'Professional office interior with natural lighting',
          'Corporate team photo in modern workspace'
        ],
        'email': [
          'Photorealistic office desk setup with laptop and coffee',
          'Professional workspace with clean aesthetic',
          'Modern business environment with natural light'
        ],
        'social': [
          'Photorealistic lifestyle shot of business professional',
          'Modern workspace with team collaboration',
          'Corporate event with professional attendees'
        ]
      },
      illustration: {
        'presentation': [
          'Flat vector illustration of business growth charts',
          'Minimalist infographic with icons and data',
          'Isometric illustration of office workspace'
        ],
        'email': [
          'Hand-drawn illustration of email marketing concept',
          'Flat design icons for business communication',
          'Minimalist email newsletter illustration'
        ]
      },
      logo: {
        'presentation': [
          'Modern minimalist logo for tech startup',
          'Abstract geometric logo for corporate brand',
          'Elegant wordmark logo for professional services'
        ],
        'email': [
          'Professional lettermark logo for email signature',
          'Simple icon logo for email template',
          'Clean logo for newsletter header'
        ]
      },
      marketing: {
        'presentation': [
          'Eye-catching social media post for business announcement',
          'Professional advertisement for company services',
          'Promotional flyer for business event'
        ],
        'email': [
          'Social media post template for email campaign',
          'Call-to-action banner for newsletter',
          'Marketing graphic for email promotion'
        ],
        'social': [
          'Instagram story template with brand colors',
          'LinkedIn banner for company promotion',
          'Twitter card for product launch announcement'
        ]
      },
      product: {
        'presentation': [
          'E-commerce product mockup on white background',
          '3D render of tech gadget product',
          'Lifestyle shot of product in use'
        ],
        'email': [
          'Amazon product image with clean white background',
          'Shopify product photo with studio lighting',
          'E-commerce catalog image with zoom detail'
        ]
      },
      'content-media': {
        'presentation': [
          'YouTube thumbnail with bold text overlay',
          'Online course thumbnail for business topic',
          'Blog cover image for professional article'
        ],
        'email': [
          'Podcast cover art for business show',
          'Blog header image for newsletter',
          'Course thumbnail for educational content'
        ]
      },
      'ui-design': {
        'presentation': [
          'Modern website mockup for SaaS product',
          'Mobile app UI wireframe for dashboard',
          'Design system components for brand guidelines'
        ],
        'email': [
          'Email template mockup with clean design',
          'Newsletter layout wireframe',
          'Web dashboard UI design'
        ]
      },
      educational: {
        'presentation': [
          'Infographic showing business metrics and growth',
          'Flowchart of business process steps',
          'Technical diagram of system architecture'
        ],
        'email': [
          'Educational infographic for newsletter',
          'Data visualization chart for email content',
          'Process diagram for business explanation'
        ]
      },
      'real-estate': {
        'presentation': [
          'Interior render of modern office space',
          'Exterior view of commercial building',
          'Floor plan for office layout'
        ],
        'email': [
          'Staged meeting room photo',
          'Office workspace interior render',
          'Corporate building exterior view'
        ]
      },
      fashion: {
        'presentation': [
          'Professional business outfit for presentation',
          'Modern office wear fashion look',
          'Business casual style guide'
        ],
        'email': [
          'Professional attire for business email',
          'Corporate fashion lookbook spread',
          'Business formal outfit concept'
        ]
      }
    };

    const typeSuggestions = suggestions[imageType];
    if (typeSuggestions && contentType && typeSuggestions[contentType.toLowerCase()]) {
      return typeSuggestions[contentType.toLowerCase()];
    }

    // Default suggestions based on image type
    const defaults: Record<string, string[]> = {
      standard: ['Professional business graphic with clean design', 'Modern corporate visual with company branding', 'Business infographic with data visualization'],
      photorealistic: ['Photorealistic business scene with studio lighting', 'Professional environment with natural light', 'High-quality product shot with dramatic lighting'],
      illustration: ['Minimalist illustration for business concept', 'Flat vector design for corporate use', 'Isometric illustration of workspace'],
      logo: ['Modern minimalist logo design', 'Professional wordmark logo', 'Abstract geometric brand icon'],
      marketing: ['Social media post for brand promotion', 'Professional advertisement creative', 'Eye-catching marketing banner'],
      product: ['E-commerce product mockup', '3D render of product design', 'Lifestyle shot of product in use'],
      'content-media': ['YouTube thumbnail with bold text', 'Blog cover image with overlay', 'Podcast cover art design'],
      'ui-design': ['Website mockup for business', 'Mobile app UI wireframe', 'Dashboard design for analytics'],
      educational: ['Infographic for business data', 'Process flowchart diagram', 'Technical schematic illustration'],
      'real-estate': ['Interior office render', 'Modern workspace interior', 'Floor plan for office layout'],
      fashion: ['Professional business outfit', 'Modern office wear design', 'Corporate style lookbook']
    };

    return defaults[imageType] || defaults.standard;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedVideo(null);

    try {
      if (activeTab === 'video') {
        await handleGenerateVideo();
      } else {
        await handleGenerateImage();
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to generate media');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    let result;

    switch (imageType) {
      case 'photorealistic':
        result = await muapiService.generatePhotorealistic({ subject: prompt, model: model as 'gpt-image' | 'dall-e-3' | 'dall-e-2', size: size as '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048', quality: quality as 'low' | 'medium' | 'high' });
        break;
      case 'illustration':
        result = await muapiService.generateIllustration({ subject: prompt, model: model as 'gpt-image' | 'dall-e-3' | 'dall-e-2', size: size as '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048', quality: quality as 'low' | 'medium' | 'high' });
        break;
      case 'logo':
        result = await muapiService.generateLogo({ brandName: 'Brand', style: prompt, model: model as 'gpt-image' | 'dall-e-3' | 'dall-e-2', quality: quality as 'low' | 'medium' | 'high' });
        break;
      case 'marketing':
        result = await muapiService.generateSocialMediaPost({ headline: prompt, model: model as 'gpt-image' | 'dall-e-3' | 'dall-e-2', size: size as '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048', quality: quality as 'low' | 'medium' | 'high' });
        break;
      case 'product':
        result = await muapiService.generateProductMockup({ product: prompt, model: model as 'gpt-image' | 'dall-e-3' | 'dall-e-2', size: size as '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048', quality: quality as 'low' | 'medium' | 'high' });
        break;
      case 'content-media':
        result = await muapiService.generateYouTubeThumbnail({ title: prompt, model: model as 'gpt-image' | 'dall-e-3' | 'dall-e-2', size: size as '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048', quality: quality as 'low' | 'medium' | 'high' });
        break;
      case 'ui-design':
        result = await muapiService.generateWebsiteMockup({ industry: prompt, model: model as 'gpt-image' | 'dall-e-3' | 'dall-e-2', size: size as '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048', quality: quality as 'low' | 'medium' | 'high' });
        break;
      case 'educational':
        result = await muapiService.generateInfographic({ topic: prompt, model: model as 'gpt-image' | 'dall-e-3' | 'dall-e-2', size: size as '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048', quality: quality as 'low' | 'medium' | 'high' });
        break;
      case 'real-estate':
        result = await muapiService.generateInteriorRender({ style: prompt, model: model as 'gpt-image' | 'dall-e-3' | 'dall-e-2', size: size as '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048', quality: quality as 'low' | 'medium' | 'high' });
        break;
      case 'fashion':
        result = await muapiService.generateOutfit({ style: prompt, model: model as 'gpt-image' | 'dall-e-3' | 'dall-e-2', size: size as '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048', quality: quality as 'low' | 'medium' | 'high' });
        break;
      default:
        result = await muapiService.generateImage({ prompt, model: model as 'gpt-image' | 'dall-e-3' | 'dall-e-2', size: size as '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048', quality: quality as 'low' | 'medium' | 'high' });
    }

    setGeneratedImage(result.imageUrl);
    setGeneratedType(imageType);
    onImageGenerated?.(result.imageUrl, prompt, imageType);
  };

  const handleGenerateVideo = async () => {
    const result = await muapiService.generateVideo({
      prompt,
      duration: videoDuration,
      model: 'gpt-video',
      aspectRatio: '16:9'
    });

    setGeneratedVideo(result);
    onVideoGenerated?.(result.videoUrl, prompt);
  };

  const handleDownload = () => {
    if (activeTab === 'video' && generatedVideo) {
      const link = document.createElement('a');
      link.href = generatedVideo.videoUrl;
      link.download = `generated-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const applySuggestion = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const getImageTypeIcon = (type: ImageType) => {
    const icons: Record<string, React.ReactNode> = {
      standard: <ImageIcon className="h-4 w-4" />,
      photorealistic: <Sparkles className="h-4 w-4" />,
      illustration: <Palette className="h-4 w-4" />,
      logo: <Zap className="h-4 w-4" />,
      marketing: <Layers className="h-4 w-4" />,
      product: <Package className="h-4 w-4" />,
      'content-media': <Layers className="h-4 w-4" />,
      'ui-design': <Layers className="h-4 w-4" />,
      educational: <BookOpen className="h-4 w-4" />,
      'real-estate': <Building className="h-4 w-4" />,
      fashion: <Shirt className="h-4 w-4" />
    };
    return icons[type] || <ImageIcon className="h-4 w-4" />;
  };

  const getImageTypeLabel = (type: ImageType) => {
    const labels: Record<string, string> = {
      standard: 'Standard',
      photorealistic: 'Photorealistic',
      illustration: 'Illustration',
      logo: 'Logo/Branding',
      marketing: 'Marketing Assets',
      product: 'Product Mockup',
      'content-media': 'Content Media',
      'ui-design': 'UI/UX Design',
      educational: 'Educational',
      'real-estate': 'Real Estate',
      fashion: 'Fashion'
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ImageIcon className="h-5 w-5 text-blue-600 mr-2" />
          AI Media Generator
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Generate professional visuals and videos for your {contentTitle || 'content'}
        </p>
        {tenantId && (
          <p className="text-xs text-gray-500 mt-1">Tenant: {tenantId}</p>
        )}
      </div>

      {/* Image/Video Tabs */}
      <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => setActiveTab('image')}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'image' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ImageIcon className="h-4 w-4 inline mr-1" />
          Image
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'video' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Video className="h-4 w-4 inline mr-1" />
          Video
        </button>
      </div>

      {/* Image Type Selection */}
      {activeTab === 'image' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['standard', 'photorealistic', 'illustration', 'logo', 'marketing', 'product', 'content-media', 'ui-design', 'educational', 'real-estate', 'fashion'] as ImageType[]).map((type) => (
              <button
                key={type}
                onClick={() => setImageType(type)}
                className={`p-2 rounded-lg border text-xs font-medium transition-colors flex flex-col items-center gap-1 ${
                  imageType === type
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
                disabled={isGenerating}
              >
                {getImageTypeIcon(type)}
                <span className="truncate">{getImageTypeLabel(type)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

{/* Model and Size Selection */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isGenerating}
            >
              <option value="gpt-image">OpenAI GPT-Image (Default)</option>
              <option value="dall-e-3">DALL-E 3</option>
              <option value="dall-e-2">DALL-E 2</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isGenerating}
            >
              <option value="512x512">Small (512×512)</option>
              <option value="1024x1024">Square (1024×1024)</option>
              <option value="1792x1024">Landscape (1792×1024)</option>
              <option value="1024x1792">Portrait (1024×1792)</option>
              <option value="2048x2048">Large (2048×2048)</option>
            </select>
          </div>
        </div>

      {/* Quality Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quality
        </label>
        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={isGenerating}
        >
          <option value="low">Low (Fast)</option>
          <option value="medium">Medium (Balanced)</option>
          <option value="high">High (Best)</option>
        </select>
      </div>

      {/* Video Duration Selection */}
      {activeTab === 'video' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (seconds)
          </label>
          <select
            value={videoDuration}
            onChange={(e) => setVideoDuration(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isGenerating}
          >
            <option value={3}>3 seconds</option>
            <option value={5}>5 seconds</option>
            <option value={8}>8 seconds</option>
            <option value={10}>10 seconds</option>
          </select>
        </div>
      )}

      {/* Prompt Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {activeTab === 'video' ? 'Video Description' : 'Image Description'}
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={activeTab === 'video' ? 'Describe the video you want to generate...' : 'Describe the image you want to generate...'}
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
          onClick={handleGenerate}
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
              Generating {activeTab === 'video' ? 'Video' : 'Image'}...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate {activeTab === 'video' ? 'Video' : 'Image'}
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

      {/* Generated Media Display */}
      {activeTab === 'video' && generatedVideo ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center mb-3">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <p className="text-sm font-medium text-green-800">Video Generated Successfully!</p>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4">
            <video
              src={generatedVideo.videoUrl}
              controls
              className="w-full h-auto rounded-lg shadow-sm"
              poster={generatedImage || undefined}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium flex items-center justify-center"
            >
              <Download className="h-4 w-4 mr-1" />
              Download Video
            </button>
            <button
              onClick={() => {
                setGeneratedVideo(null);
                setPrompt('');
              }}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium"
            >
              Generate Another
            </button>
          </div>
        </div>
      ) : activeTab === 'image' && generatedImage ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center mb-3">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <p className="text-sm font-medium text-green-800">
              {generatedType !== 'standard' ? `${getImageTypeLabel(generatedType as ImageType)} Image` : 'Image'} Generated Successfully!
            </p>
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
              onClick={handleDownload}
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
      ) : null}
    </div>
  );
};

export default ImageGenerator;