export const MUAPI_API_KEY = 'd370ae6ecc87e99654ed2220fba0d1511224f41623867aedc2c2a0a06f15b208';
export const MUAPI_BASE_URL = 'https://api.muapi.ai/v1';

export interface MuapiImageRequest {
  prompt: string;
  model?: 'stable-diffusion' | 'dall-e-3' | 'dall-e-2' | 'midjourney';
  size?: '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048';
  quality?: 'low' | 'medium' | 'high';
  style?: string;
  n?: number;
}

export interface MuapiVideoRequest {
  prompt: string;
  model?: 'runway-gen-2' | 'runway-gen-3' | 'stable-video' | 'luma-video';
  duration?: number;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  style?: 'cinematic' | 'anime' | 'photographic' | 'illustration' | '3d-render';
}

export interface MuapiImageResult {
  imageUrl: string;
  prompt: string;
  model: string;
  timestamp: string;
}

export interface VideoGenerationResult {
  videoUrl: string;
  prompt: string;
  model: string;
  duration: number;
  aspectRatio: string;
  timestamp: string;
  status?: 'processing' | 'completed' | 'failed';
  generationId?: string;
}

export interface MuapiError {
  error: string;
  code?: string;
  details?: string;
}

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

export interface CoreImageCreationParams {
  subject: string;
  style?: string;
  lighting?: string;
  composition?: string;
  colorPalette?: string;
  mood?: string;
  details?: string;
  model?: 'stable-diffusion' | 'dall-e-3' | 'dall-e-2' | 'midjourney';
  size?: '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048';
  quality?: 'low' | 'medium' | 'high';
  n?: number;
}

export interface MarketingAssetParams {
  type?: 'social-media-post' | 'ad-creative' | 'poster' | 'flyer' | 'banner' | 'carousel' | 'story';
  platform?: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube' | 'general';
  headline?: string;
  callToAction?: string;
  brandColors?: string;
  style?: string;
  targetAudience?: string;
  product?: string;
  colorScheme?: string;
  model?: 'stable-diffusion' | 'dall-e-3' | 'dall-e-2' | 'midjourney';
  size?: '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048';
  quality?: 'low' | 'medium' | 'high';
  n?: number;
}

export interface BrandingParams {
  type?: 'logo' | 'brand-visual' | 'color-palette' | 'icon' | 'identity-system';
  category?: 'tech' | 'food' | 'fashion' | 'finance' | 'healthcare' | 'education' | 'entertainment' | 'other';
  brandName?: string;
  industry?: string;
  colors?: string;
  style?: string;
  targetAudience?: string;
  model?: 'stable-diffusion' | 'dall-e-3' | 'dall-e-2' | 'midjourney';
  size?: '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048';
  quality?: 'low' | 'medium' | 'high';
  n?: number;
}

export interface ProductEcommerceParams {
  type?: 'product-mockup' | 'amazon-image' | 'shopify-image' | '3d-render' | 'lifestyle-shot' | 'catalog-image';
  product: string;
  background?: 'white' | 'transparent' | 'lifestyle' | 'studio' | 'custom';
  angle?: 'front' | 'side' | 'back' | '360' | 'close-up' | 'hero';
  lighting?: 'studio' | 'natural' | 'dramatic' | 'soft' | 'studio-softbox';
  platform?: 'amazon' | 'shopify' | 'ecommerce' | 'general';
  style?: string;
  lifestyle?: boolean;
  model?: 'stable-diffusion' | 'dall-e-3' | 'dall-e-2' | 'midjourney';
  size?: '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048';
  quality?: 'low' | 'medium' | 'high';
  n?: number;
}

export interface ContentMediaParams {
  type?: 'youtube-thumbnail' | 'blog-cover' | 'podcast-art' | 'course-thumbnail' | 'social-thumbnail';
  title?: string;
  topics?: string[];
  platform?: string;
  style?: string;
  colorScheme?: string;
  targetAudience?: string;
  model?: 'stable-diffusion' | 'dall-e-3' | 'dall-e-2' | 'midjourney';
  size?: '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048';
  quality?: 'low' | 'medium' | 'high';
  n?: number;
}

export interface EditingTransformationParams {
  type?: 'background-removal' | 'background-replacement' | 'object-removal' | 'style-transfer' | 'upscale' | 'color-adjustment';
  imageUrl: string;
  mask?: string;
  newBackground?: string;
  targetStyle?: string;
  objectsToRemove?: string[];
  scaleFactor?: number;
  adjustments?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    hue?: number;
  };
}

export interface AdvancedCompositionParams {
  type?: 'inpainting' | 'outpainting' | 'scene-expansion';
  imageUrl: string;
  mask?: string;
  prompt: string;
  expansionDirection?: 'top' | 'bottom' | 'left' | 'right' | 'all';
  expansionScale?: number;
  contextPrompt?: string;
}

export interface ConsistencyParams {
  type?: 'character-consistency' | 'brand-consistency' | 'campaign-series';
  baseImage?: string;
  characterDescription?: string;
  brandElements?: string;
  variations?: number;
  styleReference?: string;
  consistencyStrength?: number;
}

export interface UIMediaParams {
  type?: 'website-mockup' | 'app-ui' | 'wireframe' | 'design-system' | 'dashboard' | 'landing-page';
  platform?: 'web' | 'mobile-ios' | 'mobile-android' | 'tablet';
  style?: string;
  industry?: string;
  components?: string[];
  colorScheme?: string;
  model?: 'stable-diffusion' | 'dall-e-3' | 'dall-e-2' | 'midjourney';
  size?: '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048';
  quality?: 'low' | 'medium' | 'high';
  n?: number;
}

export interface EducationalGraphicParams {
  type?: 'infographic' | 'diagram' | 'technical-schematic' | 'flowchart' | 'chart' | 'educational-image';
  topic: string;
  dataPoints?: string[];
  style?: string;
  colorScheme?: string;
  audience?: 'beginner' | 'intermediate' | 'advanced';
  model?: 'stable-diffusion' | 'dall-e-3' | 'dall-e-2' | 'midjourney';
  size?: '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048';
  quality?: 'low' | 'medium' | 'high';
  n?: number;
}

export interface StorytellingParams {
  type?: 'storyboard' | 'comic-panel' | 'animation-concept' | 'character-sheet' | 'scene-layout';
  story?: string;
  characters?: string[];
  scenes?: number;
  style?: string;
  frameCount?: number;
  panelLayout?: 'single' | 'grid' | 'vertical-strip' | 'horizontal-strip';
  model?: 'stable-diffusion' | 'dall-e-3' | 'dall-e-2' | 'midjourney';
  size?: '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048';
  quality?: 'low' | 'medium' | 'high';
  n?: number;
}

export interface RealEstateParams {
  type?: 'interior-render' | 'exterior-render' | 'floor-plan' | 'staging' | 'virtual-tour-frame';
  propertyType?: 'house' | 'apartment' | 'office' | 'retail' | 'warehouse';
  style?: string;
  rooms?: string[];
  architecturalStyle?: string;
  lighting?: 'day' | 'evening' | 'night' | 'dawn';
  model?: 'stable-diffusion' | 'dall-e-3' | 'dall-e-2' | 'midjourney';
  size?: '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048';
  quality?: 'low' | 'medium' | 'high';
  n?: number;
}

export interface FashionLifestyleParams {
  type?: 'outfit-generation' | 'lookbook' | 'beauty-campaign' | 'fashion-illustration';
  category?: 'casual' | 'formal' | 'sport' | 'streetwear' | 'luxury' | 'vintage';
  gender?: 'male' | 'female' | 'unisex';
  style?: string;
  season?: 'spring' | 'summer' | 'fall' | 'winter';
  model?: 'stable-diffusion' | 'dall-e-3' | 'dall-e-2' | 'midjourney';
  size?: '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | '2048x2048';
  quality?: 'low' | 'medium' | 'high';
  n?: number;
}

export interface AIEditingWorkflowParams {
  type?: 'batch-generation' | 'ab-testing-variants';
  basePrompt: string;
  variations?: number;
  styles?: string[];
  seeds?: number[];
  variationsPerSeed?: number;
  model?: 'stable-diffusion' | 'dall-e-3' | 'dall-e-2' | 'midjourney';
}

export interface BatchGenerationResult {
  images: MuapiImageResult[];
  batchId: string;
}

export interface ABBatchParams {
  prompt: string;
  variantsCount?: number;
  styleVariations?: string[];
  model?: 'stable-diffusion' | 'dall-e-3' | 'dall-e-2' | 'midjourney';
}

export interface CreativeAgencyParams {
  clientName?: string;
  projectType?: 'brand-launch' | 'product-campaign' | 'social-media' | 'marketing-kit' | 'full-identity';
  deliverables?: string[];
  brandGuidelines?: string;
  targetAudience?: string;
  budget?: 'low' | 'medium' | 'high';
  timeline?: string;
  stylePreferences?: string[];
  model?: 'stable-diffusion' | 'dall-e-3' | 'dall-e-2' | 'midjourney';
}

export interface AgencyCreativePackage {
  brandAssets: MuapiImageResult[];
  marketingAssets: MuapiImageResult[];
  productAssets: MuapiImageResult[];
  styleGuide: {
    colors: string[];
    fonts: string[];
    mood: string;
  };
  packageId: string;
}

export class MuapiService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string = MUAPI_API_KEY, baseUrl: string = MUAPI_BASE_URL) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  private handleApiError(error: unknown, context: string): never {
    console.error(`Muapi ${context} error:`, error);
    const message = error && typeof error === 'object' && 'message' in error
      ? (error as { message?: string }).message
      : error && typeof error === 'object' && 'error' in error
        ? (error as { error?: string }).error
        : 'Unknown error';
    throw new Error(`Muapi ${context} failed: ${message}`);
  }

  async generateImage(request: MuapiImageRequest): Promise<MuapiImageResult> {
    const { prompt, model = 'stable-diffusion', size = '1024x1024', quality = 'medium' } = request;

    try {
      const response = await fetch(`${this.baseUrl}/images/generate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          prompt: prompt.trim(),
          model,
          size,
          quality,
          n: request.n || 1,
        }),
      });

      if (!response.ok) {
        const errorData: MuapiError = await response.json().catch(() => ({ error: 'Unknown API error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data?.url) {
        throw new Error('No image URL returned from Muapi');
      }

      return {
        imageUrl: data.url,
        prompt,
        model,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.handleApiError(error, 'image generation');
    }
  }

  async generateImageCompatible(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
    const result = await this.generateImage({
      prompt: request.prompt,
      model: request.model === 'dall-e-3' || request.model === 'dall-e-2'
        ? request.model
        : 'stable-diffusion',
      size: request.size as '512x512' | '1024x1024' | '1024x1792' | '1792x1024' | '2048x2048' | undefined,
      quality: request.quality as 'low' | 'medium' | 'high' | undefined,
    });

    return {
      imageUrl: result.imageUrl,
      prompt: result.prompt,
      model: result.model,
      timestamp: result.timestamp,
    };
  }

  async generateVideo(request: MuapiVideoRequest): Promise<VideoGenerationResult> {
    const { prompt, model = 'runway-gen-3', duration = 5, aspectRatio = '16:9' } = request;

    try {
      const response = await fetch(`${this.baseUrl}/videos/generate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          prompt: prompt.trim(),
          model,
          duration,
          aspect_ratio: aspectRatio,
          style: request.style || 'cinematic',
        }),
      });

      if (!response.ok) {
        const errorData: MuapiError = await response.json().catch(() => ({ error: 'Unknown API error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data?.video_url && !data?.url) {
        throw new Error('No video URL returned from Muapi');
      }

      return {
        videoUrl: data.video_url || data.url,
        prompt,
        model,
        duration,
        aspectRatio,
        timestamp: new Date().toISOString(),
        status: data.status || 'processing',
        generationId: data.id,
      };
    } catch (error) {
      this.handleApiError(error, 'video generation');
    }
  }

  async checkVideoStatus(generationId: string): Promise<VideoGenerationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/videos/${generationId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData: MuapiError = await response.json().catch(() => ({ error: 'Unknown API error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      return {
        videoUrl: data.video_url || data.url || '',
        prompt: data.prompt || '',
        model: data.model || '',
        duration: data.duration || 5,
        aspectRatio: data.aspect_ratio || '16:9',
        timestamp: data.completed_at || new Date().toISOString(),
        status: data.status || 'processing',
        generationId: data.id,
      };
    } catch (error) {
      this.handleApiError(error, 'video status check');
    }
  }

  async listAvailableModels(): Promise<{ images: string[]; videos: string[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        images: data?.images || [],
        videos: data?.videos || [],
      };
    } catch (error) {
      this.handleApiError(error, 'models list');
    }
  }

  // 1. Core Image Creation
  async generatePhotorealistic(params: CoreImageCreationParams): Promise<MuapiImageResult> {
    const prompt = `photorealistic ${params.subject}${params.lighting ? `, ${params.lighting} lighting` : ''}${params.composition ? `, ${params.composition} composition` : ''}${params.colorPalette ? `, ${params.colorPalette} color palette` : ''}${params.mood ? `, ${params.mood} mood` : ''}${params.details ? `, ${params.details}` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  async generateIllustration(params: CoreImageCreationParams): Promise<MuapiImageResult> {
    const prompt = `illustration of ${params.subject}${params.style ? `, ${params.style} style` : ''}${params.colorPalette ? `, ${params.colorPalette} colors` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  async generateConceptArt(params: CoreImageCreationParams): Promise<MuapiImageResult> {
    const prompt = `concept art: ${params.subject}${params.style ? `, ${params.style}` : ''}${params.mood ? `, ${params.mood}` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  async generateDigitalArt(params: CoreImageCreationParams): Promise<MuapiImageResult> {
    const prompt = `digital art, ${params.subject}${params.style ? `, ${params.style}` : ''}${params.lighting ? `, ${params.lighting} lighting` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  async generateOilPainting(params: CoreImageCreationParams): Promise<MuapiImageResult> {
    const prompt = `oil painting of ${params.subject}${params.style ? `, ${params.style}` : ''}${params.lighting ? `, ${params.lighting}` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  async generateWatercolor(params: CoreImageCreationParams): Promise<MuapiImageResult> {
    const prompt = `watercolor painting of ${params.subject}${params.style ? `, ${params.style}` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  async generateSketch(params: CoreImageCreationParams): Promise<MuapiImageResult> {
    const prompt = `sketch of ${params.subject}${params.style ? `, ${params.style}` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  // 2. Marketing & Advertising Assets
  async generateSocialMediaPost(params: MarketingAssetParams): Promise<MuapiImageResult> {
    const platformText = params.platform ? ` for ${params.platform}` : '';
    const headlineText = params.headline ? `, headline: ${params.headline}` : '';
    const ctaText = params.callToAction ? `, call to action: ${params.callToAction}` : '';
    const prompt = `social media post${platformText}${headlineText}${ctaText}${params.brandColors ? `, brand colors: ${params.brandColors}` : ''}${params.style ? `, ${params.style} style` : ''}${params.targetAudience ? `, targeting ${params.targetAudience}` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size || '1024x1024', quality: params.quality, n: params.n });
  }

  async generateAdCreative(params: MarketingAssetParams): Promise<MuapiImageResult> {
    const platformText = params.platform ? ` for ${params.platform}` : '';
    const prompt = `advertisement creative${platformText}${params.headline ? `, headline: ${params.headline}` : ''}${params.product ? `, featuring ${params.product}` : ''}${params.style ? `, ${params.style} style` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  async generatePoster(params: MarketingAssetParams): Promise<MuapiImageResult> {
    const prompt = `poster design${params.headline ? `, featuring: ${params.headline}` : ''}${params.style ? `, ${params.style} style` : ''}${params.colorScheme ? ` in ${params.colorScheme}` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size || '1024x1792', quality: params.quality, n: params.n });
  }

  async generateFlyer(params: MarketingAssetParams): Promise<MuapiImageResult> {
    const prompt = `flyer design${params.headline ? `, featuring: ${params.headline}` : ''}${params.callToAction ? `, ${params.callToAction}` : ''}${params.style ? `, ${params.style} style` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size || '1024x1792', quality: params.quality, n: params.n });
  }

  // 3. Branding & Identity
  async generateLogo(params: BrandingParams): Promise<MuapiImageResult> {
    const prompt = `logo design for ${params.brandName || params.industry || 'brand'}${params.style ? `, ${params.style} style` : ''}${params.colors ? `, using ${params.colors}` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: '1024x1024', quality: params.quality, n: params.n });
  }

  async generateBrandVisuals(params: BrandingParams): Promise<MuapiImageResult> {
    const prompt = `brand visual for ${params.brandName || params.industry}${params.style ? `, ${params.style}` : ''}${params.colors ? `, colors: ${params.colors}` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  async generateColorPalette(params: BrandingParams): Promise<MuapiImageResult> {
    const prompt = `color palette for ${params.brandName || params.industry}${params.style ? `, ${params.style} aesthetic` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: '512x512', quality: params.quality, n: params.n });
  }

  // 4. Product & Ecommerce
  async generateProductMockup(params: ProductEcommerceParams): Promise<MuapiImageResult> {
    const angleText = params.angle ? ` viewed from ${params.angle}` : '';
    const prompt = `product mockup of ${params.product}${angleText}${params.lighting ? `, ${params.lighting} lighting` : ''}${params.style ? `, ${params.style}` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  async generateAmazonImage(params: ProductEcommerceParams): Promise<MuapiImageResult> {
    const prompt = `Amazon product image for ${params.product}${params.background ? `, ${params.background} background` : ''}, clean, professional, white background`;
    return this.generateImage({ prompt, model: params.model, size: '1024x1024', quality: params.quality, n: params.n });
  }

  async generateShopifyImage(params: ProductEcommerceParams): Promise<MuapiImageResult> {
    const prompt = `Shopify product photo of ${params.product}${params.lifestyle || params.background ? `, ${params.background || 'lifestyle'} setting` : ''}, ecommerce ready`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  async generate3DRender(params: ProductEcommerceParams): Promise<MuapiImageResult> {
    const prompt = `3D render of ${params.product}${params.lighting ? `, ${params.lighting} lighting` : ''}${params.style ? `, ${params.style}` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  // 5. Content Creation & Media
  async generateYouTubeThumbnail(params: ContentMediaParams): Promise<MuapiImageResult> {
    const prompt = `YouTube thumbnail${params.title ? `, "${params.title}"` : ''}${params.style ? `, ${params.style} style` : ''}, bold, eye-catching, 16:9`;
    return this.generateImage({ prompt, model: params.model, size: '1792x1024', quality: params.quality, n: params.n });
  }

  async generateBlogCover(params: ContentMediaParams): Promise<MuapiImageResult> {
    const topicsText = params.topics ? params.topics.join(', ') : '';
    const prompt = `blog cover image for ${params.title || topicsText}${params.style ? `, ${params.style} style` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: '1792x1024', quality: params.quality, n: params.n });
  }

  async generatePodcastArt(params: ContentMediaParams): Promise<MuapiImageResult> {
    const prompt = `podcast cover art${params.title ? `, "${params.title}"` : ''}${params.style ? `, ${params.style} style` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  async generateCourseThumbnail(params: ContentMediaParams): Promise<MuapiImageResult> {
    const topicsText = params.topics ? ` about ${params.topics.join(', ')}` : '';
    const prompt = `online course thumbnail${topicsText}${params.style ? `, ${params.style} style` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: '1792x1024', quality: params.quality, n: params.n });
  }

  // 6. Editing & Transformation
  async editImage(request: EditingTransformationParams): Promise<MuapiImageResult> {
    try {
      const response = await fetch(`${this.baseUrl}/images/edit`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          image_url: request.imageUrl,
          type: request.type,
          prompt: request.newBackground || request.targetStyle || '',
          mask: request.mask,
          adjustments: request.adjustments,
        }),
      });

      if (!response.ok) {
        const errorData: MuapiError = await response.json().catch(() => ({ error: 'Unknown API error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        imageUrl: data.url,
        prompt: request.imageUrl,
        model: 'image-edit',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.handleApiError(error, 'image editing');
    }
  }

  async removeBackground(imageUrl: string): Promise<MuapiImageResult> {
    return this.editImage({ type: 'background-removal', imageUrl });
  }

  async replaceBackground(imageUrl: string, newBackground: string): Promise<MuapiImageResult> {
    return this.editImage({ type: 'background-replacement', imageUrl, newBackground });
  }

  async removeObject(imageUrl: string, objects: string[]): Promise<MuapiImageResult> {
    return this.editImage({ type: 'object-removal', imageUrl, objectsToRemove: objects });
  }

  async transferStyle(imageUrl: string, targetStyle: string): Promise<MuapiImageResult> {
    return this.editImage({ type: 'style-transfer', imageUrl, targetStyle });
  }

  async upscaleImage(imageUrl: string, scaleFactor: number = 2): Promise<MuapiImageResult> {
    return this.editImage({ type: 'upscale', imageUrl, scaleFactor });
  }

  async colorAdjustment(imageUrl: string, adjustments: { brightness?: number; contrast?: number; saturation?: number; hue?: number }): Promise<MuapiImageResult> {
    return this.editImage({ type: 'color-adjustment', imageUrl, adjustments });
  }

  // 7. Advanced Composition Editing
  async editComposition(request: AdvancedCompositionParams): Promise<MuapiImageResult> {
    try {
      const response = await fetch(`${this.baseUrl}/images/composition`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          image_url: request.imageUrl,
          type: request.type,
          prompt: request.prompt,
          mask: request.mask,
          expansion_direction: request.expansionDirection,
          expansion_scale: request.expansionScale,
        }),
      });

      if (!response.ok) {
        const errorData: MuapiError = await response.json().catch(() => ({ error: 'Unknown API error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        imageUrl: data.url,
        prompt: request.prompt,
        model: 'composition-edit',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.handleApiError(error, 'composition editing');
    }
  }

  async inpaintImage(imageUrl: string, mask: string, prompt: string): Promise<MuapiImageResult> {
    return this.editComposition({ type: 'inpainting', imageUrl, mask, prompt });
  }

  async outpaintImage(imageUrl: string, prompt: string, direction: 'top' | 'bottom' | 'left' | 'right' | 'all' = 'all'): Promise<MuapiImageResult> {
    return this.editComposition({ type: 'outpainting', imageUrl, prompt, expansionDirection: direction });
  }

  async expandScene(imageUrl: string, prompt: string, scale: number = 1.5): Promise<MuapiImageResult> {
    return this.editComposition({ type: 'scene-expansion', imageUrl, prompt, expansionScale: scale });
  }

  // 8. Consistency-Based Generation
  async generateWithConsistency(request: ConsistencyParams): Promise<MuapiImageResult[]> {
    try {
      const response = await fetch(`${this.baseUrl}/images/consistent`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          type: request.type,
          base_image: request.baseImage,
          prompt: request.characterDescription || request.brandElements || '',
          variations: request.variations || 1,
          style_reference: request.styleReference,
        }),
      });

      if (!response.ok) {
        const errorData: MuapiError = await response.json().catch(() => ({ error: 'Unknown API error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return (data.images || []).map((img: { url: string }) => ({
        imageUrl: img.url,
        prompt: request.characterDescription || request.brandElements || '',
        model: 'consistency',
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      this.handleApiError(error, 'consistency generation');
    }
  }

  async generateCharacterSeries(baseImage: string, characterDescription: string, variations: number = 5): Promise<MuapiImageResult[]> {
    return this.generateWithConsistency({ type: 'character-consistency', baseImage, characterDescription, variations });
  }

  async generateBrandSeries(baseImage: string, brandElements: string, variations: number = 5): Promise<MuapiImageResult[]> {
    return this.generateWithConsistency({ type: 'brand-consistency', baseImage, brandElements, variations });
  }

  // 9. UI/UX & Digital Design
  async generateWebsiteMockup(params: UIMediaParams): Promise<MuapiImageResult> {
    const prompt = `website mockup for ${params.industry || 'general'} website${params.style ? `, ${params.style} style` : ''}${params.components ? `, sections: ${params.components.join(', ')}` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size || '1792x1024', quality: params.quality, n: params.n });
  }

  async generateAppUI(params: UIMediaParams): Promise<MuapiImageResult> {
    const platformText = params.platform ? ` mobile app ${params.platform}` : '';
    const prompt = `mobile app UI${platformText}${params.style ? `, ${params.style} design` : ''}${params.components ? `, features: ${params.components.join(', ')}` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size || '1024x1792', quality: params.quality, n: params.n });
  }

  async generateWireframe(params: UIMediaParams): Promise<MuapiImageResult> {
    const prompt = `wireframe for ${params.industry || 'app'} UI${params.platform ? ` ${params.platform}` : ''}, clean, minimal, blueprint style`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  async generateDesignSystem(params: UIMediaParams): Promise<MuapiImageResult> {
    const prompt = `design system components${params.industry ? ` for ${params.industry}` : ''}${params.colorScheme ? `, ${params.colorScheme} theme` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size || '1024x1024', quality: params.quality, n: params.n });
  }

  // 10. Educational & Informational Graphics
  async generateInfographic(params: EducationalGraphicParams): Promise<MuapiImageResult> {
    const topicsText = params.dataPoints ? ` covering ${params.dataPoints.join(', ')}` : '';
    const prompt = `infographic about ${params.topic}${topicsText}${params.style ? `, ${params.style} style` : ''}${params.audience ? `, for ${params.audience} level` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size || '1792x1024', quality: params.quality, n: params.n });
  }

  async generateDiagram(params: EducationalGraphicParams): Promise<MuapiImageResult> {
    const prompt = `diagram showing ${params.topic}${params.style ? `, ${params.style} style` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  async generateTechnicalSchematic(params: EducationalGraphicParams): Promise<MuapiImageResult> {
    const prompt = `technical schematic for ${params.topic}${params.style ? `, ${params.style} style` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  // 11. Storytelling & Entertainment
  async generateStoryboard(params: StorytellingParams): Promise<MuapiImageResult[]> {
    const prompt = `storyboard${params.story ? ` for "${params.story}"` : ''}${params.style ? `, ${params.style}` : ''}${params.characters ? `, characters: ${params.characters.join(', ')}` : ''}`;
    return this.generateImageMultiple({ prompt, n: params.scenes || params.frameCount || 4, model: params.model, size: params.size, quality: params.quality });
  }

  async generateComicPanel(params: StorytellingParams): Promise<MuapiImageResult> {
    const prompt = `comic panel${params.characters ? ` featuring ${params.characters.join(', ')}` : ''}${params.style ? `, ${params.style}` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  async generateAnimationConcept(params: StorytellingParams): Promise<MuapiImageResult> {
    const prompt = `animation concept${params.story ? ` for "${params.story}"` : ''}${params.style ? `, ${params.style}` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  // 12. Real Estate & Architecture
  async generateInteriorRender(params: RealEstateParams): Promise<MuapiImageResult> {
    const roomsText = params.rooms ? ` featuring ${params.rooms.join(', ')}` : '';
    const prompt = `interior render${roomsText}${params.style ? `, ${params.style} style` : ''}${params.lighting ? `, ${params.lighting} lighting` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size || '1792x1024', quality: params.quality, n: params.n });
  }

  async generateExteriorRender(params: RealEstateParams): Promise<MuapiImageResult> {
    const prompt = `exterior render of ${params.propertyType || 'building'}${params.style ? `, ${params.style} architecture` : ''}${params.lighting ? `, ${params.lighting} time` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: '1792x1024', quality: params.quality, n: params.n });
  }

  async generateFloorPlan(params: RealEstateParams): Promise<MuapiImageResult> {
    const prompt = `floor plan for ${params.propertyType || 'property'}${params.style ? `, ${params.style} style` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  async generateStagedRoom(params: RealEstateParams): Promise<MuapiImageResult> {
    const prompt = `staged room${params.rooms ? ` (${params.rooms.join(', ')})` : ''}${params.style ? `, ${params.style} decor` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  // 13. Fashion & Lifestyle
  async generateOutfit(params: FashionLifestyleParams): Promise<MuapiImageResult> {
    const prompt = `outfit design${params.category ? `, ${params.category}` : ''}${params.gender ? `, ${params.gender}` : ''}${params.style ? `, ${params.style}` : ''}${params.season ? `, ${params.season}` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  async generateLookbook(params: FashionLifestyleParams): Promise<MuapiImageResult[]> {
    const prompt = `fashion lookbook${params.category ? `, ${params.category}` : ''}${params.style ? `, ${params.style}` : ''}${params.gender ? `, ${params.gender}` : ''}`;
    return this.generateImageMultiple({ prompt, n: params.n || 6, model: params.model, size: params.size, quality: params.quality });
  }

  async generateBeautyCampaign(params: FashionLifestyleParams): Promise<MuapiImageResult> {
    const prompt = `beauty campaign${params.style ? `, ${params.style}` : ''}${params.season ? `, ${params.season}` : ''}`;
    return this.generateImage({ prompt, model: params.model, size: params.size, quality: params.quality, n: params.n });
  }

  // 14. AI Editing Automation Workflows
  async batchGenerate(params: AIEditingWorkflowParams): Promise<BatchGenerationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/images/batch-generate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          prompt: params.basePrompt,
          variations: params.variations || 5,
          styles: params.styles,
          seeds: params.seeds,
          variations_per_seed: params.variationsPerSeed,
        }),
      });

      if (!response.ok) {
        const errorData: MuapiError = await response.json().catch(() => ({ error: 'Unknown API error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        images: (data.images || []).map((img: { url: string }) => ({
          imageUrl: img.url,
          prompt: params.basePrompt,
          model: 'batch',
          timestamp: new Date().toISOString(),
        })),
        batchId: data.batch_id || '',
      };
    } catch (error) {
      this.handleApiError(error, 'batch generation');
    }
  }

  async generateABTestVariants(params: ABBatchParams): Promise<MuapiImageResult[]> {
    try {
      const response = await fetch(`${this.baseUrl}/images/ab-test`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          prompt: params.prompt,
          variants: params.variantsCount || 4,
        }),
      });

      if (!response.ok) {
        const errorData: MuapiError = await response.json().catch(() => ({ error: 'Unknown API error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return (data.variants || []).map((img: { url: string }) => ({
        imageUrl: img.url,
        prompt: params.prompt,
        model: 'ab-test',
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      this.handleApiError(error, 'A/B test variants');
    }
  }

  // 15. High-Level SaaS Product methods
  async createCreativeAgencyPackage(params: CreativeAgencyParams): Promise<AgencyCreativePackage> {
    try {
      const logoResult = await this.generateLogo({ brandName: params.clientName, colors: params.stylePreferences?.join(', '), model: params.model });
      const socialResult = await this.generateSocialMediaPost({ headline: `${params.clientName} Campaign`, style: params.stylePreferences?.[0], model: params.model });
      const productResult = await this.generateProductMockup({ product: params.clientName || 'Product', style: params.stylePreferences?.[0], model: params.model });

      return {
        brandAssets: [logoResult],
        marketingAssets: [socialResult],
        productAssets: [productResult],
        styleGuide: {
          colors: params.stylePreferences || ['#000000', '#FFFFFF'],
          fonts: ['Modern Sans', 'Bold Display'],
          mood: params.stylePreferences?.join(' ') || 'professional',
        },
        packageId: `pkg_${Date.now()}`,
      };
    } catch (error) {
      this.handleApiError(error, 'creative agency package');
    }
  }

  async launchBrandCampaign(clientName: string, industry: string, styles: string[]): Promise<MuapiImageResult[]> {
    const prompt = `complete brand campaign for ${clientName}, ${industry} industry, ${styles.join(', ')}`;
    return this.generateImageMultiple({ prompt, n: 6, model: 'dall-e-3' });
  }

  async generateMarketingKit(platforms: string[], branding: string): Promise<MuapiImageResult[]> {
    const prompt = `marketing kit for ${platforms.join(', ')} with ${branding} branding`;
    return this.generateImageMultiple({ prompt, n: platforms.length });
  }

  // Helper method
  private async generateImageMultiple(params: { prompt: string; n: number; model?: string; size?: string; quality?: string }): Promise<MuapiImageResult[]> {
    const response = await fetch(`${this.baseUrl}/images/generate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        prompt: params.prompt,
        model: params.model || 'stable-diffusion',
        n: params.n,
      }),
    });

    if (!response.ok) {
      const errorData: MuapiError = await response.json().catch(() => ({ error: 'Unknown API error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return (data.images || []).map((img: { url: string }) => ({
      imageUrl: img.url,
      prompt: params.prompt,
      model: params.model || 'stable-diffusion',
      timestamp: new Date().toISOString(),
    }));
  }
}

export const muapiService = new MuapiService();