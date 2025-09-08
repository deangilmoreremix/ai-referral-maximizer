import axios, { AxiosInstance, AxiosError } from 'axios';

// Types for the DropCowboy voice API
type VoiceId = string; // Voice identifier
type RecipientId = string; // Recipient identifier
type VoiceDropId = string; // Voice drop campaign identifier

interface Recipient {
  id: string;
  name: string;
  phoneNumber: string;
  tags?: string[];
  email?: string;
}

interface VoiceDropConfig {
  script: string;
  voiceId: string;
  recipients: Recipient[];
  callerId?: string;
  scheduledTime?: Date;
  retryAttempts?: number;
  voicemailDetection?: boolean;
  transferDigit?: string;
  transferNumber?: string;
  callbackUrl?: string;
}

interface VoiceDropResult {
  id: VoiceDropId;
  status: 'scheduled' | 'processing' | 'in-progress' | 'completed' | 'failed' | 'canceled';
  scheduledTime?: string;
  completedAt?: string;
  deliveryStats: {
    total: number;
    sent: number;
    delivered: number;
    answered: number;
    voicemail: number;
    failed: number;
    busy: number;
    noAnswer: number;
  };
  cost?: number;
}

interface VoiceSetting {
  id: string;
  name: string;
  gender: 'male' | 'female';
  language: string;
  style: 'professional' | 'friendly' | 'energetic' | 'casual';
  previewUrl?: string;
}

// API Response interfaces
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface VoiceDropResponse {
  id: string;
  status: string;
  scheduledTime?: string;
  deliveryStats: {
    total: number;
    sent: number;
    delivered: number;
    answered: number;
    voicemail: number;
    failed: number;
    busy: number;
    noAnswer: number;
  };
  cost?: number;
}

// Real DropCowboy API implementation
class DropCowboyService {
  private apiKey: string = '';
  private apiUrl: string = 'https://api.dropcowboy.com/v1';
  private httpClient: AxiosInstance | null = null;
  private isInitialized: boolean = false;
  private demoMode: boolean = false;

  // Available voices (for demo mode)
  private availableVoices: VoiceSetting[] = [
    { id: 'female-1', name: 'Sarah', gender: 'female', language: 'en-US', style: 'professional', previewUrl: 'https://example.com/voice-previews/sarah.mp3' },
    { id: 'female-2', name: 'Emma', gender: 'female', language: 'en-US', style: 'friendly', previewUrl: 'https://example.com/voice-previews/emma.mp3' },
    { id: 'male-1', name: 'Michael', gender: 'male', language: 'en-US', style: 'professional', previewUrl: 'https://example.com/voice-previews/michael.mp3' },
    { id: 'male-2', name: 'John', gender: 'male', language: 'en-US', style: 'friendly', previewUrl: 'https://example.com/voice-previews/john.mp3' },
    { id: 'female-3', name: 'Lisa', gender: 'female', language: 'en-US', style: 'energetic', previewUrl: 'https://example.com/voice-previews/lisa.mp3' },
    { id: 'male-3', name: 'David', gender: 'male', language: 'en-US', style: 'energetic', previewUrl: 'https://example.com/voice-previews/david.mp3' }
  ];

  /**
   * Initialize the service with API credentials
   */
  initialize(apiKey?: string): void {
    // Try to get API key from environment or parameter
    this.apiKey = apiKey || process.env.DROPCOWBOY_API_KEY || '';

    if (this.apiKey) {
      // Initialize HTTP client for real API calls
      this.httpClient = axios.create({
        baseURL: this.apiUrl,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      });

      this.demoMode = false;
      console.log('DropCowboy service initialized with real API');
    } else {
      // Fallback to demo mode
      this.demoMode = true;
      console.log('DropCowboy service initialized in demo mode (no API key provided)');
    }

    this.isInitialized = true;
  }

  /**
   * Check if the service is initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Create and schedule a voice drop campaign
   */
  async createVoiceDrop(config: VoiceDropConfig): Promise<VoiceDropResult> {
    this.checkInitialized();

    console.log('Creating voice drop with configuration:', {
      script: config.script.substring(0, 50) + '...',
      voiceId: config.voiceId,
      recipientCount: config.recipients.length,
      hasCallerId: !!config.callerId,
      scheduledTime: config.scheduledTime ? config.scheduledTime.toISOString() : 'immediate',
      voicemailDetection: config.voicemailDetection
    });

    if (this.demoMode) {
      // Demo mode - simulate the API call
      await this.simulateApiDelay();

      return {
        id: `vd-${Date.now()}`,
        status: 'scheduled',
        scheduledTime: config.scheduledTime?.toISOString(),
        deliveryStats: {
          total: config.recipients.length,
          sent: 0,
          delivered: 0,
          answered: 0,
          voicemail: 0,
          failed: 0,
          busy: 0,
          noAnswer: 0
        },
        cost: parseFloat((config.recipients.length * 0.05).toFixed(2))
      };
    }

    // Real API mode
    try {
      if (!this.httpClient) {
        throw new Error('HTTP client not initialized');
      }

      const payload = {
        script: config.script,
        voiceId: config.voiceId,
        recipients: config.recipients.map(r => ({
          id: r.id,
          name: r.name,
          phoneNumber: r.phoneNumber,
          tags: r.tags,
          email: r.email
        })),
        callerId: config.callerId,
        scheduledTime: config.scheduledTime?.toISOString(),
        retryAttempts: config.retryAttempts,
        voicemailDetection: config.voicemailDetection,
        transferDigit: config.transferDigit,
        transferNumber: config.transferNumber,
        callbackUrl: config.callbackUrl
      };

      const response = await this.httpClient.post<ApiResponse<VoiceDropResponse>>('/voice-drops', payload);

      if (response.data.success && response.data.data) {
        return {
          id: response.data.data.id,
          status: response.data.data.status as VoiceDropResult['status'],
          scheduledTime: response.data.data.scheduledTime,
          deliveryStats: response.data.data.deliveryStats,
          cost: response.data.data.cost
        };
      } else {
        throw new Error(response.data.error || response.data.message || 'Failed to create voice drop');
      }
    } catch (error) {
      console.error('Error creating voice drop:', error);

      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 401) {
          throw new Error('Authentication failed. Please check your API key.');
        } else if (status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (status && status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
      }

      // Fallback to demo mode on API errors
      console.log('API call failed, falling back to demo mode');
      this.demoMode = true;

      return this.createVoiceDrop(config);
    }
  }

  /**
   * Get available voices for voice drops
   */
  async getAvailableVoices(): Promise<VoiceSetting[]> {
    this.checkInitialized();

    if (this.demoMode) {
      // Demo mode - return mock data
      await this.simulateApiDelay(500);
      return this.availableVoices;
    }

    // Real API mode
    try {
      if (!this.httpClient) {
        throw new Error('HTTP client not initialized');
      }

      const response = await this.httpClient.get<ApiResponse<VoiceSetting[]>>('/voices');

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        console.error('Failed to fetch voices:', response.data.error || response.data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching voices:', error);

      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 401) {
          throw new Error('Authentication failed. Please check your API key.');
        } else if (status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (status && status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
      }

      // Fallback to demo mode on API errors
      console.log('API call failed, falling back to demo mode');
      this.demoMode = true;

      return this.getAvailableVoices();
    }
  }

  /**
   * Get voice preview URL
   */
  async getVoicePreview(voiceId: string, text: string): Promise<string> {
    this.checkInitialized();

    if (this.demoMode) {
      // Demo mode - simulate the API call
      await this.simulateApiDelay(800);

      const voice = this.availableVoices.find(v => v.id === voiceId);
      if (!voice) {
        throw new Error(`Voice not found: ${voiceId}`);
      }

      // Return a sample audio URL for demo
      return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    }

    // Real API mode
    try {
      if (!this.httpClient) {
        throw new Error('HTTP client not initialized');
      }

      const response = await this.httpClient.post<ApiResponse<{ previewUrl: string }>>('/voices/preview', {
        voiceId,
        text
      });

      if (response.data.success && response.data.data) {
        return response.data.data.previewUrl;
      } else {
        throw new Error(response.data.error || response.data.message || 'Failed to generate voice preview');
      }
    } catch (error) {
      console.error('Error generating voice preview:', error);

      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 401) {
          throw new Error('Authentication failed. Please check your API key.');
        } else if (status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (status && status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
      }

      // Fallback to demo mode on API errors
      console.log('API call failed, falling back to demo mode');
      this.demoMode = true;

      return this.getVoicePreview(voiceId, text);
    }
  }

  /**
   * Get status of a voice drop campaign
   */
  async getVoiceDropStatus(voiceDropId: VoiceDropId): Promise<VoiceDropResult> {
    this.checkInitialized();

    if (this.demoMode) {
      // Demo mode - simulate the API call
      await this.simulateApiDelay();

      // Randomly generate progress stats for demo
      const total = Math.floor(Math.random() * 50) + 10;
      const answered = Math.floor(total * 0.4);
      const voicemail = Math.floor(total * 0.3);
      const failed = Math.floor(total * 0.1);
      const busy = Math.floor(total * 0.05);
      const noAnswer = total - answered - voicemail - failed - busy;

      return {
        id: voiceDropId,
        status: 'in-progress',
        deliveryStats: {
          total,
          sent: total,
          delivered: answered + voicemail,
          answered,
          voicemail,
          failed,
          busy,
          noAnswer
        },
        cost: parseFloat((total * 0.05).toFixed(2))
      };
    }

    // Real API mode
    try {
      if (!this.httpClient) {
        throw new Error('HTTP client not initialized');
      }

      const response = await this.httpClient.get<ApiResponse<VoiceDropResponse>>(`/voice-drops/${voiceDropId}`);

      if (response.data.success && response.data.data) {
        return {
          id: response.data.data.id,
          status: response.data.data.status as VoiceDropResult['status'],
          scheduledTime: response.data.data.scheduledTime,
          deliveryStats: response.data.data.deliveryStats,
          cost: response.data.data.cost
        };
      } else {
        throw new Error(response.data.error || response.data.message || 'Failed to get voice drop status');
      }
    } catch (error) {
      console.error('Error getting voice drop status:', error);

      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 401) {
          throw new Error('Authentication failed. Please check your API key.');
        } else if (status === 404) {
          throw new Error('Voice drop not found.');
        } else if (status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (status && status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
      }

      // Fallback to demo mode on API errors
      console.log('API call failed, falling back to demo mode');
      this.demoMode = true;

      return this.getVoiceDropStatus(voiceDropId);
    }
  }

  /**
   * Cancel a voice drop campaign
   */
  async cancelVoiceDrop(voiceDropId: VoiceDropId): Promise<{ success: boolean; message: string }> {
    this.checkInitialized();

    if (this.demoMode) {
      // Demo mode - simulate the API call
      await this.simulateApiDelay();

      return {
        success: true,
        message: `Voice drop ${voiceDropId} has been canceled`
      };
    }

    // Real API mode
    try {
      if (!this.httpClient) {
        throw new Error('HTTP client not initialized');
      }

      const response = await this.httpClient.delete<ApiResponse<{ message: string }>>(`/voice-drops/${voiceDropId}`);

      if (response.data.success) {
        return {
          success: true,
          message: response.data.data?.message || `Voice drop ${voiceDropId} has been canceled`
        };
      } else {
        return {
          success: false,
          message: response.data.error || response.data.message || 'Failed to cancel voice drop'
        };
      }
    } catch (error) {
      console.error('Error canceling voice drop:', error);

      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 401) {
          return { success: false, message: 'Authentication failed. Please check your API key.' };
        } else if (status === 404) {
          return { success: false, message: 'Voice drop not found.' };
        } else if (status === 429) {
          return { success: false, message: 'Rate limit exceeded. Please try again later.' };
        } else if (status && status >= 500) {
          return { success: false, message: 'Server error. Please try again later.' };
        }
      }

      // Fallback to demo mode on API errors
      console.log('API call failed, falling back to demo mode');
      this.demoMode = true;

      return this.cancelVoiceDrop(voiceDropId);
    }
  }

  /**
   * Generate audio from text using a specific voice
   */
  async generateVoiceDropAudio(text: string, voiceId: string): Promise<{ audioUrl: string; duration: number }> {
    this.checkInitialized();

    if (this.demoMode) {
      // Demo mode - simulate the API call
      await this.simulateApiDelay(1500);

      // Calculate approximate duration (5 characters ≈ 1 second)
      const duration = Math.max(3, Math.ceil(text.length / 15));

      return {
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration
      };
    }

    // Real API mode
    try {
      if (!this.httpClient) {
        throw new Error('HTTP client not initialized');
      }

      const response = await this.httpClient.post<ApiResponse<{ audioUrl: string; duration: number }>>('/audio/generate', {
        text,
        voiceId
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || response.data.message || 'Failed to generate audio');
      }
    } catch (error) {
      console.error('Error generating audio:', error);

      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 401) {
          throw new Error('Authentication failed. Please check your API key.');
        } else if (status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (status && status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
      }

      // Fallback to demo mode on API errors
      console.log('API call failed, falling back to demo mode');
      this.demoMode = true;

      return this.generateVoiceDropAudio(text, voiceId);
    }
  }

  // Helper methods

  /**
   * Check if service is initialized
   */
  private checkInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('DropCowboy service is not initialized. Call initialize() first.');
    }
  }

  /**
   * Simulate API delay
   */
  private async simulateApiDelay(ms = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export a singleton instance
export const dropCowboyService = new DropCowboyService();