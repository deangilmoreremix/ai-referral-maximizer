import axios from 'axios';
import { UniPile } from 'unipile-node-sdk';

// Message status types
type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

// Message channel types
export type MessageChannel = 'sms' | 'voice' | 'whatsapp' | 'messenger' | 'email' | 'facebook' | 'twitter' | 'instagram' | 'linkedin';

// Message configuration interface
interface MessageConfig {
  to: string;
  content: string;
  channel: MessageChannel;
  contactId: string;
  template?: string;
  mediaUrl?: string;
  scheduledTime?: Date;
  callbackUrl?: string;
  metadata?: Record<string, any>;
}

// Social post configuration
interface SocialPostConfig {
  content: string;
  channel: 'facebook' | 'twitter' | 'instagram' | 'linkedin';
  imageUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
  hashtags?: string[];
  mentions?: string[];
  audienceType: 'followers' | 'public' | 'custom';
  targetContactIds?: string[];
  scheduledTime?: Date;
}

// Contact interface
export interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  channels: MessageChannel[];
  tags: string[];
  metadata?: Record<string, any>;
}

// Contact list/group interface
interface ContactGroup {
  id: string;
  name: string;
  description?: string;
  contactCount: number;
  tags?: string[];
}

// Message template interface
export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  channel: MessageChannel;
  variables?: string[];
  created: Date;
  lastUsed?: Date;
}

// Campaign interface
interface MessageCampaign {
  id: string;
  name: string;
  channel: MessageChannel;
  scheduledTime?: Date;
  status: 'draft' | 'scheduled' | 'in-progress' | 'completed' | 'canceled';
  contactCount: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  responseCount: number;
}

// Social media account interface
interface SocialMediaAccount {
  id: string;
  platformId: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin';
  name: string;
  username: string;
  profilePictureUrl?: string;
  isConnected: boolean;
  pageId?: string; // For Facebook pages
  lastSynced?: Date;
}

// Enhanced mock implementation based on Unipile SDK
class UnipileService {
  private apiKey: string = '';
  private client: any | null = null;
  private isInitialized: boolean = false;
  private channels: Record<MessageChannel, boolean> = {
    sms: true,
    voice: true,
    whatsapp: true,
    messenger: false,
    email: true,
    facebook: true,
    twitter: true,
    instagram: true,
    linkedin: true
  };

  // Mock storage for demo purposes
  private contacts: Contact[] = [];
  private groups: ContactGroup[] = [];
  private templates: MessageTemplate[] = [];
  private campaigns: MessageCampaign[] = [];
  private socialAccounts: SocialMediaAccount[] = [];
  private messageHistory: Record<string, any[]> = {};

  /**
   * Initialize the service with API credentials
   */
  initialize(apiKey: string): void {
    this.apiKey = apiKey;
    // In a real implementation, we'd initialize the Unipile client:
    // this.client = new UniPile(apiKey);
    this.isInitialized = true;
    
    // Add some demo data
    this.initializeDemoData();
    
    console.log('Unipile service initialized');
  }

  /**
   * Check if the service is initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Send a message through the selected channel
   */
  async sendMessage(config: MessageConfig): Promise<MessageStatus> {
    this.checkInitialized();
    
    // Validate channel availability
    if (!this.channels[config.channel]) {
      throw new Error(`Channel ${config.channel} is not available`);
    }
    
    console.log(`Sending ${config.channel} message to ${config.to}:`, config.content.substring(0, 50) + (config.content.length > 50 ? '...' : ''));
    
    // In a real implementation, this would call the Unipile API
    // For demo purposes, we'll simulate the API call
    await this.simulateApiDelay();
    
    // Add to message history
    this.addToMessageHistory(config);
    
    // Simulate random success/failure (90% success rate)
    const isSuccess = Math.random() < 0.9;
    
    if (!isSuccess) {
      console.error(`Failed to send ${config.channel} message to:`, config.to);
      return 'failed';
    }
    
    console.log(`${config.channel} message sent successfully to:`, config.to);
    return 'sent';
  }

  /**
   * Send a social media post
   */
  async sendSocialPost(config: SocialPostConfig): Promise<{ success: boolean; postId?: string; error?: string }> {
    this.checkInitialized();
    
    // Validate channel availability
    if (!this.channels[config.channel]) {
      throw new Error(`Channel ${config.channel} is not available`);
    }
    
    console.log(`Sending ${config.channel} post:`, config.content.substring(0, 50) + (config.content.length > 50 ? '...' : ''));
    
    // In a real implementation, this would call the Unipile API
    // For demo purposes, we'll simulate the API call
    await this.simulateApiDelay();
    
    // Check if we have a connected account for this platform
    const hasConnectedAccount = this.socialAccounts.some(
      acc => acc.platform === config.channel && acc.isConnected
    );
    
    if (!hasConnectedAccount) {
      return {
        success: false,
        error: `No connected ${config.channel} account found`
      };
    }
    
    // Simulate random success/failure (90% success rate)
    const isSuccess = Math.random() < 0.9;
    
    if (!isSuccess) {
      console.error(`Failed to send ${config.channel} post`);
      return { 
        success: false,
        error: `Error posting to ${config.channel}: API rate limit exceeded`
      };
    }
    
    // Record in message history if it's targeted to specific people
    if (config.targetContactIds && config.targetContactIds.length > 0) {
      for (const contactId of config.targetContactIds) {
        this.addToMessageHistory({
          to: 'social-target',
          content: config.content,
          channel: config.channel,
          contactId,
          metadata: {
            postType: 'social',
            hashtags: config.hashtags,
            mentions: config.mentions,
            imageUrl: config.imageUrl,
            linkUrl: config.linkUrl
          }
        });
      }
    }
    
    console.log(`${config.channel} post sent successfully`);
    return { 
      success: true,
      postId: `post-${Date.now()}`
    };
  }

  /**
   * Connect a social media account
   */
  async connectSocialAccount(platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin', authCode: string): Promise<SocialMediaAccount> {
    this.checkInitialized();
    
    console.log(`Connecting ${platform} account with auth code: ${authCode}`);
    
    // In a real implementation, this would exchange the auth code for tokens
    // For demo purposes, we'll simulate the API call
    await this.simulateApiDelay();
    
    // Create a new social media account
    const newAccount: SocialMediaAccount = {
      id: `${platform}-${Date.now()}`,
      platformId: `platform-${Date.now()}`,
      platform,
      name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
      username: `user_${platform}`,
      isConnected: true,
      lastSynced: new Date()
    };
    
    // Add to social accounts
    this.socialAccounts.push(newAccount);
    
    return newAccount;
  }
  
  /**
   * Get connected social media accounts
   */
  async getSocialAccounts(): Promise<SocialMediaAccount[]> {
    this.checkInitialized();
    
    // In a real implementation, this would fetch from the API
    await this.simulateApiDelay();
    
    return this.socialAccounts;
  }

  /**
   * Disconnect a social media account
   */
  async disconnectSocialAccount(accountId: string): Promise<boolean> {
    this.checkInitialized();
    
    console.log(`Disconnecting social account: ${accountId}`);
    
    // In a real implementation, this would revoke access tokens
    await this.simulateApiDelay();
    
    // Remove or mark as disconnected
    this.socialAccounts = this.socialAccounts.filter(acc => acc.id !== accountId);
    
    return true;
  }

  /**
   * Send a batch of messages (bulk send)
   */
  async sendBatchMessages(configs: MessageConfig[]): Promise<Record<string, MessageStatus>> {
    this.checkInitialized();
    
    console.log(`Sending batch of ${configs.length} messages`);
    
    // In a real implementation, this would use the batch API
    await this.simulateApiDelay(configs.length * 100);
    
    // Process each message
    const results: Record<string, MessageStatus> = {};
    
    for (const config of configs) {
      // Add to message history
      this.addToMessageHistory(config);
      
      // Simulate random success/failure (95% success rate for batch)
      const isSuccess = Math.random() < 0.95;
      results[config.contactId] = isSuccess ? 'sent' : 'failed';
    }
    
    return results;
  }

  /**
   * Schedule a message for future delivery
   */
  async scheduleMessage(
    config: MessageConfig & { scheduledTime: Date }
  ): Promise<{ id: string; scheduledTime: Date }> {
    this.checkInitialized();
    
    console.log(`Scheduling ${config.channel} message for ${config.scheduledTime.toISOString()}`);
    
    // In a real implementation, this would call the scheduling API
    await this.simulateApiDelay();
    
    const scheduleId = `schedule-${Date.now()}`;
    
    // Create a campaign entry
    this.campaigns.push({
      id: scheduleId,
      name: `Scheduled Message: ${new Date().toLocaleDateString()}`,
      channel: config.channel,
      scheduledTime: config.scheduledTime,
      status: 'scheduled',
      contactCount: 1,
      sentCount: 0,
      deliveredCount: 0,
      failedCount: 0,
      responseCount: 0
    });
    
    return {
      id: scheduleId,
      scheduledTime: config.scheduledTime
    };
  }

  /**
   * Get available messaging channels
   */
  async getChannels(): Promise<Record<MessageChannel, boolean>> {
    this.checkInitialized();
    
    // In a real implementation, this would check the account capabilities
    await this.simulateApiDelay(800);
    
    return { ...this.channels };
  }

  /**
   * Get contacts
   */
  async getContacts(filter?: { tags?: string[]; search?: string }): Promise<Contact[]> {
    this.checkInitialized();
    
    // In a real implementation, this would fetch from the API
    await this.simulateApiDelay();
    
    // Filter contacts based on criteria
    let filteredContacts = [...this.contacts];
    
    if (filter?.tags && filter.tags.length > 0) {
      filteredContacts = filteredContacts.filter(contact => 
        contact.tags.some(tag => filter.tags!.includes(tag))
      );
    }
    
    if (filter?.search) {
      const searchLower = filter.search.toLowerCase();
      filteredContacts = filteredContacts.filter(contact => 
        contact.name.toLowerCase().includes(searchLower) ||
        contact.email?.toLowerCase().includes(searchLower) ||
        contact.phone?.includes(filter.search)
      );
    }
    
    return filteredContacts;
  }

  /**
   * Get contact groups
   */
  async getContactGroups(): Promise<ContactGroup[]> {
    this.checkInitialized();
    
    // In a real implementation, this would fetch from the API
    await this.simulateApiDelay();
    
    return this.groups;
  }

  /**
   * Save a message template
   */
  async saveTemplate(template: Omit<MessageTemplate, 'id' | 'created'>): Promise<MessageTemplate> {
    this.checkInitialized();
    
    // In a real implementation, this would call the API
    await this.simulateApiDelay();
    
    const newTemplate: MessageTemplate = {
      id: `template-${Date.now()}`,
      created: new Date(),
      ...template
    };
    
    this.templates.push(newTemplate);
    
    return newTemplate;
  }

  /**
   * Get message templates
   */
  async getTemplates(channel?: MessageChannel): Promise<MessageTemplate[]> {
    this.checkInitialized();
    
    // In a real implementation, this would fetch from the API
    await this.simulateApiDelay();
    
    if (channel) {
      return this.templates.filter(t => t.channel === channel);
    }
    
    return this.templates;
  }

  /**
   * Get message logs and history
   */
  async getMessageLogs(
    filter?: {
      startDate?: Date;
      endDate?: Date;
      channel?: MessageChannel;
      status?: MessageStatus[];
      contactId?: string;
    }
  ): Promise<any[]> {
    this.checkInitialized();
    
    // In a real implementation, this would fetch from the API
    await this.simulateApiDelay();
    
    // Extract message history
    let logs: any[] = [];
    for (const [contactId, messages] of Object.entries(this.messageHistory)) {
      logs = [...logs, ...messages];
    }
    
    // Apply filters
    if (filter) {
      if (filter.startDate) {
        logs = logs.filter(log => new Date(log.timestamp) >= filter.startDate!);
      }
      
      if (filter.endDate) {
        logs = logs.filter(log => new Date(log.timestamp) <= filter.endDate!);
      }
      
      if (filter.channel) {
        logs = logs.filter(log => log.channel === filter.channel);
      }
      
      if (filter.status && filter.status.length > 0) {
        logs = logs.filter(log => filter.status!.includes(log.status as MessageStatus));
      }
      
      if (filter.contactId) {
        logs = logs.filter(log => log.contactId === filter.contactId);
      }
    }
    
    // Sort by timestamp descending (most recent first)
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Import contacts from CSV string
   */
  async importContactsFromCsv(csvContent: string): Promise<{ imported: number; failed: number; errors: string[] }> {
    this.checkInitialized();
    
    console.log("Importing contacts from CSV");
    
    // In a real implementation, this would parse and import
    await this.simulateApiDelay(2000);
    
    // Simulate import results
    const lines = csvContent.split('\n').filter(line => line.trim());
    const importCount = lines.length > 1 ? lines.length - 1 : lines.length; // Account for header row
    
    // Add some randomly generated contacts
    for (let i = 0; i < Math.min(importCount, 10); i++) {
      this.contacts.push(this.generateRandomContact());
    }
    
    return {
      imported: importCount,
      failed: Math.floor(importCount * 0.05), // 5% failure rate for demo
      errors: []
    };
  }

  /**
   * Create a campaign
   */
  async createCampaign(
    name: string, 
    contactIds: string[], 
    content: string,
    scheduledTime?: Date
  ): Promise<MessageCampaign> {
    this.checkInitialized();
    
    console.log(`Creating campaign: ${name} for ${contactIds.length} contacts`);
    
    // In a real implementation, this would call the campaign API
    await this.simulateApiDelay(1500);
    
    // Determine channel based on content or other logic
    // For this example, we'll default to SMS
    const channel: MessageChannel = 'sms';
    
    const campaign: MessageCampaign = {
      id: `campaign-${Date.now()}`,
      name,
      channel,
      scheduledTime,
      status: scheduledTime ? 'scheduled' : 'draft',
      contactCount: contactIds.length,
      sentCount: 0,
      deliveredCount: 0,
      failedCount: 0,
      responseCount: 0
    };
    
    this.campaigns.push(campaign);
    
    return campaign;
  }

  // Helper methods

  /**
   * Check if service is initialized
   */
  private checkInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('Unipile service is not initialized. Call initialize() first.');
    }
  }

  /**
   * Simulate API delay
   */
  private async simulateApiDelay(ms = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Add message to history for the contact
   */
  private addToMessageHistory(message: MessageConfig): void {
    if (!this.messageHistory[message.contactId]) {
      this.messageHistory[message.contactId] = [];
    }
    
    this.messageHistory[message.contactId].push({
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      contactId: message.contactId,
      to: message.to,
      content: message.content,
      channel: message.channel,
      status: 'sent',
      timestamp: new Date().toISOString(),
      deliveryTimestamp: new Date(Date.now() + 2000).toISOString(),
      cost: message.channel === 'sms' ? 0.01 : message.channel === 'voice' ? 0.05 : 0.03
    });
  }

  /**
   * Initialize demo data for testing
   */
  private initializeDemoData(): void {
    // Generate demo contacts
    this.contacts = Array.from({ length: 20 }, () => this.generateRandomContact());
    
    // Generate demo groups
    this.groups = [
      { id: 'group-1', name: 'Clients', description: 'All current clients', contactCount: 12, tags: ['client'] },
      { id: 'group-2', name: 'Prospects', description: 'Potential clients', contactCount: 8, tags: ['prospect'] },
      { id: 'group-3', name: 'Priority', description: 'Priority contacts', contactCount: 5, tags: ['priority'] }
    ];
    
    // Generate demo templates
    this.templates = [
      {
        id: 'template-1',
        name: 'Basic SMS Referral Request',
        content: "Hi {{name}}, I'm focusing on growing my business through referrals this month. If you know anyone who might benefit from my services, I'd appreciate an introduction!",
        channel: 'sms',
        variables: ['name'],
        created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'template-2',
        name: 'Thank You Follow-up',
        content: "Hi {{name}}, just wanted to thank you for considering my referral request. If you think of someone who might need my services, I'd be grateful for the connection!",
        channel: 'sms',
        variables: ['name'],
        created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'template-3',
        name: 'Voice Drop Introduction',
        content: "Hello {{name}}, this is {{your_name}} from {{company}}. I'm reaching out because I'm currently accepting new clients through referrals. If you know anyone who needs {{service}}, please let me know. You can reach me at {{your_phone}}. Thanks and have a great day!",
        channel: 'voice',
        variables: ['name', 'your_name', 'company', 'service', 'your_phone'],
        created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'template-4',
        name: 'WhatsApp Initial Outreach',
        content: "Hi {{name}}! 👋 Hope you're doing well! I'm focusing on growing my business through referrals this month and would appreciate your help. If you know anyone who might benefit from {{service}}, I'd be grateful for an introduction! No pressure at all. 🙂",
        channel: 'whatsapp',
        variables: ['name', 'service'],
        created: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'template-5',
        name: 'Facebook Post',
        content: "I'm excited to announce that I'm expanding my {{service}} business and looking for referrals! If you know anyone who might benefit from professional {{service}} services, please tag them in the comments or send me a message. As a thank you, I'm offering {{incentive}} for every successful referral!",
        channel: 'facebook',
        variables: ['service', 'incentive'],
        created: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'template-6',
        name: 'LinkedIn Post',
        content: "I'm currently accepting new clients for my {{service}} business and would love to connect with individuals who need assistance with {{problem}}. If you know someone who might benefit from my services, please comment below or send me a direct message. #{{industry}} #Referrals #{{service}}",
        channel: 'linkedin',
        variables: ['service', 'problem', 'industry'],
        created: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];
    
    // Generate demo campaigns
    this.campaigns = [
      {
        id: 'campaign-1',
        name: 'April Referral Outreach',
        channel: 'sms',
        status: 'completed',
        contactCount: 15,
        sentCount: 15,
        deliveredCount: 13,
        failedCount: 2,
        responseCount: 5
      },
      {
        id: 'campaign-2',
        name: 'Follow-up Voice Campaign',
        channel: 'voice',
        status: 'in-progress',
        contactCount: 8,
        sentCount: 5,
        deliveredCount: 4,
        failedCount: 1,
        responseCount: 2
      },
      {
        id: 'campaign-3',
        name: 'May Referral Campaign',
        channel: 'whatsapp',
        scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'scheduled',
        contactCount: 20,
        sentCount: 0,
        deliveredCount: 0,
        failedCount: 0,
        responseCount: 0
      },
      {
        id: 'campaign-4',
        name: 'Social Media Referral Blast',
        channel: 'facebook',
        status: 'in-progress',
        contactCount: 0, // Public post
        sentCount: 1,
        deliveredCount: 1,
        failedCount: 0,
        responseCount: 0
      }
    ];
    
    // Generate demo social accounts
    this.socialAccounts = [
      {
        id: 'facebook-1',
        platformId: 'fb-123456789',
        platform: 'facebook',
        name: 'Business Page',
        username: 'yourbusinesspage',
        profilePictureUrl: 'https://via.placeholder.com/150',
        isConnected: true,
        pageId: '123456789',
        lastSynced: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      },
      {
        id: 'twitter-1',
        platformId: 'tw-987654321',
        platform: 'twitter',
        name: 'Twitter Account',
        username: 'yourbusiness',
        profilePictureUrl: 'https://via.placeholder.com/150',
        isConnected: true,
        lastSynced: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      }
    ];
  }

  /**
   * Generate a random contact for demo purposes
   */
  private generateRandomContact(): Contact {
    const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jennifer', 'Robert', 'Jessica', 'William', 'Amanda'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    
    // Generate a random US phone number
    const areaCode = Math.floor(Math.random() * 800) + 200; // 200-999
    const exchangeCode = Math.floor(Math.random() * 900) + 100; // 100-999
    const lineNumber = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    const phone = `+1${areaCode}${exchangeCode}${lineNumber}`;
    
    // Generate email
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    
    // Determine available channels
    const availableChannels: MessageChannel[] = ['sms'];
    if (Math.random() > 0.3) availableChannels.push('voice');
    if (Math.random() > 0.5) availableChannels.push('whatsapp');
    if (Math.random() > 0.7) availableChannels.push('email');
    if (Math.random() > 0.8) availableChannels.push('facebook');
    if (Math.random() > 0.85) availableChannels.push('twitter');
    if (Math.random() > 0.9) availableChannels.push('linkedin');
    
    // Assign tags
    const tags: string[] = [];
    if (Math.random() > 0.7) tags.push('priority');
    if (Math.random() > 0.5) tags.push(Math.random() > 0.5 ? 'client' : 'prospect');
    if (Math.random() > 0.8) tags.push('referral');
    
    return {
      id: `contact-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      name,
      phone,
      email,
      channels: availableChannels,
      tags
    };
  }
}

// Export a singleton instance
export const unipileService = new UnipileService();

// Re-export functions from service for backward compatibility
// This ensures existing code that uses the older function-based API
// continues to work without changes
const sendMessage = async (config: MessageConfig): Promise<MessageStatus> => {
  if (!unipileService.isReady()) {
    // Initialize with a demo key for convenience
    unipileService.initialize('demo-api-key');
  }
  
  return unipileService.sendMessage(config);
};

const sendSocialPost = async (config: SocialPostConfig): Promise<{ success: boolean; postId?: string; error?: string }> => {
  if (!unipileService.isReady()) {
    // Initialize with a demo key for convenience
    unipileService.initialize('demo-api-key');
  }
  
  return unipileService.sendSocialPost(config);
};

const getChannels = async (): Promise<Record<MessageChannel, boolean>> => {
  if (!unipileService.isReady()) {
    // Initialize with a demo key for convenience
    unipileService.initialize('demo-api-key');
  }
  
  return unipileService.getChannels();
};

const getSocialAccounts = async (): Promise<SocialMediaAccount[]> => {
  if (!unipileService.isReady()) {
    // Initialize with a demo key for convenience
    unipileService.initialize('demo-api-key');
  }
  
  return unipileService.getSocialAccounts();
};

const connectSocialAccount = async (
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin', 
  authCode: string
): Promise<SocialMediaAccount> => {
  if (!unipileService.isReady()) {
    // Initialize with a demo key for convenience
    unipileService.initialize('demo-api-key');
  }
  
  return unipileService.connectSocialAccount(platform, authCode);
};

const disconnectSocialAccount = async (accountId: string): Promise<boolean> => {
  if (!unipileService.isReady()) {
    // Initialize with a demo key for convenience
    unipileService.initialize('demo-api-key');
  }
  
  return unipileService.disconnectSocialAccount(accountId);
};

const generateVoiceDrop = async (
  script: string, 
  voiceId: string = 'female-1'
): Promise<string> => {
  // This function will hand off to the DropCowboy service
  // For compatibility, we'll return a string URL
  console.log('Legacy function called: generateVoiceDrop');
  
  // Ensure DropCowboy service is imported and used properly in the actual implementation
  
  // Return a sample audio URL for demo purposes
  return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
};

const importContacts = async (source: string): Promise<number> => {
  if (!unipileService.isReady()) {
    // Initialize with a demo key for convenience
    unipileService.initialize('demo-api-key');
  }
  
  const result = await unipileService.importContactsFromCsv(source);
  return result.imported;
};

const getMessageLogs = async (
  filters: {
    startDate?: Date;
    endDate?: Date;
    channels?: MessageChannel[];
    status?: MessageStatus[];
  } = {}
): Promise<any[]> => {
  if (!unipileService.isReady()) {
    // Initialize with a demo key for convenience
    unipileService.initialize('demo-api-key');
  }
  
  return unipileService.getMessageLogs(filters);
};

const scheduleMessage = async (
  config: MessageConfig & { scheduledTime: Date }
): Promise<{ id: string; scheduledTime: Date }> => {
  if (!unipileService.isReady()) {
    // Initialize with a demo key for convenience
    unipileService.initialize('demo-api-key');
  }
  
  return unipileService.scheduleMessage(config);
};