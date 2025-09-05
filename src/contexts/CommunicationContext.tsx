import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { unipileService, MessageChannel } from '../services/unipileService';
import { dropCowboyService } from '../services/dropCowboyService';

// Context interface
interface CommunicationContextType {
  // Initialization state
  isInitialized: boolean;
  isConfiguring: boolean;
  initializeServices: () => Promise<boolean>;
  
  // Voice features
  availableVoices: any[];
  selectedVoice: string;
  setSelectedVoice: (voiceId: string) => void;
  generateVoicePreview: (script: string) => Promise<string>;
  createVoiceDrop: (config: any) => Promise<any>;
  
  // Messaging features
  availableChannels: Record<string, boolean>;
  selectedChannel: string;
  setSelectedChannel: (channel: string) => void;
  sendMessage: (config: any) => Promise<any>;
  
  // Contacts management
  contacts: any[];
  selectedContacts: string[];
  contactGroups: any[];
  setSelectedContacts: (contactIds: string[]) => void;
  refreshContacts: () => Promise<void>;
  
  // Templates management
  messageTemplates: any[];
  selectedTemplate: string | null;
  setSelectedTemplate: (templateId: string | null) => void;
  saveTemplate: (template: any) => Promise<any>;
  
  // Campaigns
  campaigns: any[];
  createCampaign: (name: string, contactIds: string[], content: string, scheduledDate?: Date) => Promise<any>;
  refreshCampaigns: () => Promise<void>;
}

// Mock data for demos
const mockVoices = [
  { id: 'female-1', name: 'Sarah (Professional Female)', gender: 'female', language: 'en-US', style: 'professional' },
  { id: 'female-2', name: 'Emma (Friendly Female)', gender: 'female', language: 'en-US', style: 'friendly' },
  { id: 'male-1', name: 'Michael (Professional Male)', gender: 'male', language: 'en-US', style: 'professional' },
  { id: 'male-2', name: 'John (Friendly Male)', gender: 'male', language: 'en-US', style: 'friendly' },
  { id: 'female-3', name: 'Lisa (Energetic Female)', gender: 'female', language: 'en-US', style: 'energetic' },
  { id: 'male-3', name: 'David (Energetic Male)', gender: 'male', language: 'en-US', style: 'energetic' }
];

const mockChannels = {
  sms: true,
  voice: true,
  whatsapp: true,
  messenger: false,
  email: true
};

const mockContacts = [
  { id: '1', name: 'John Smith', phone: '+12345678901', email: 'john@example.com', channels: ['sms', 'voice', 'whatsapp'], tags: ['client', 'priority'] },
  { id: '2', name: 'Sarah Johnson', phone: '+19876543210', email: 'sarah@example.com', channels: ['sms', 'voice'], tags: ['prospect'] },
  { id: '3', name: 'Michael Brown', phone: '+15678901234', email: 'michael@example.com', channels: ['sms', 'whatsapp'], tags: ['client'] },
  { id: '4', name: 'Emily Davis', phone: '+16549873210', email: 'emily@example.com', channels: ['sms', 'voice', 'whatsapp'], tags: ['referral', 'priority'] },
  { id: '5', name: 'James Wilson', phone: '+13219876543', email: 'james@example.com', channels: ['sms', 'messenger'], tags: ['prospect'] }
];

const mockContactGroups = [
  { id: 'group-1', name: 'Clients', description: 'All current clients', contactCount: 12, tags: ['client'] },
  { id: 'group-2', name: 'Prospects', description: 'Potential clients', contactCount: 8, tags: ['prospect'] },
  { id: 'group-3', name: 'Priority', description: 'Priority contacts', contactCount: 5, tags: ['priority'] }
];

const mockTemplates = [
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
  }
];

const mockCampaigns = [
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
  }
];

// Create the context
const CommunicationContext = createContext<CommunicationContextType | undefined>(undefined);

// Provider component
export const CommunicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isConfiguring, setIsConfiguring] = useState<boolean>(false);
  
  // Voice state
  const [availableVoices, setAvailableVoices] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('female-1');
  
  // Messaging state
  const [availableChannels, setAvailableChannels] = useState<Record<string, boolean>>({
    sms: false,
    voice: false,
    whatsapp: false,
    messenger: false,
    email: false
  });
  const [selectedChannel, setSelectedChannel] = useState<string>('sms');
  
  // Contacts state
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [contactGroups, setContactGroups] = useState<any[]>([]);
  
  // Templates state
  const [messageTemplates, setMessageTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  // Campaigns state
  const [campaigns, setCampaigns] = useState<any[]>([]);

  // Initialize services with mock data on mount
  useEffect(() => {
    if (!isInitialized && !isConfiguring) {
      initializeServices();
    }
  }, [isInitialized, isConfiguring]);

  // Initialize services and load initial data
  const initializeServices = async (): Promise<boolean> => {
    try {
      setIsConfiguring(true);
      
      // Initialize Unipile service
      if (!unipileService.isReady()) {
        unipileService.initialize('demo-api-key');
      }
      
      // Initialize DropCowboy service
      if (!dropCowboyService.isReady()) {
        dropCowboyService.initialize('demo-api-key');
      }
      
      // Get available voices
      const voices = await dropCowboyService.getAvailableVoices();
      setAvailableVoices(voices.length > 0 ? voices : mockVoices);
      
      // Get available channels
      const channels = await unipileService.getChannels();
      setAvailableChannels(channels || mockChannels);
      
      // Get contacts
      const contactList = await unipileService.getContacts();
      setContacts(contactList.length > 0 ? contactList : mockContacts);
      
      // Get contact groups
      const groups = await unipileService.getContactGroups();
      setContactGroups(groups.length > 0 ? groups : mockContactGroups);
      
      // Get message templates
      const templates = await unipileService.getTemplates();
      setMessageTemplates(templates.length > 0 ? templates : mockTemplates);
      
      // Set mock campaigns for now
      setCampaigns(mockCampaigns);
      
      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error("Error initializing communication services:", error);
      return false;
    } finally {
      setIsConfiguring(false);
    }
  };

  // Generate voice preview
  const generateVoicePreview = async (script: string): Promise<string> => {
    try {
      const { audioUrl } = await dropCowboyService.generateVoiceDropAudio(script, selectedVoice);
      return audioUrl;
    } catch (error) {
      console.error("Error generating voice preview:", error);
      throw error;
    }
  };

  // Create voice drop
  const createVoiceDrop = async (config: any): Promise<any> => {
    try {
      const voiceDropConfig = {
        script: config.script,
        voiceId: selectedVoice,
        recipients: config.recipients,
        callerId: config.callerId,
        scheduledTime: config.scheduledTime,
        retryAttempts: config.retryAttempts || 0,
        voicemailDetection: config.voicemailDetection !== false
      };
      
      const result = await dropCowboyService.createVoiceDrop(voiceDropConfig);
      return result;
    } catch (error) {
      console.error("Error creating voice drop:", error);
      throw error;
    }
  };

  // Send message
  const sendMessage = async (config: any): Promise<any> => {
    try {
      const messageConfig = {
        to: config.to,
        content: config.content,
        channel: selectedChannel as MessageChannel,
        contactId: config.contactId,
        template: config.template,
        mediaUrl: config.mediaUrl
      };
      
      const status = await unipileService.sendMessage(messageConfig);
      return { success: status !== 'failed', status };
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  // Refresh contacts
  const refreshContacts = async (): Promise<void> => {
    try {
      const contactList = await unipileService.getContacts();
      setContacts(contactList.length > 0 ? contactList : mockContacts);
    } catch (error) {
      console.error("Error refreshing contacts:", error);
      throw error;
    }
  };

  // Save template
  const saveTemplate = async (template: any): Promise<any> => {
    try {
      const newTemplate = await unipileService.saveTemplate({
        name: template.name,
        content: template.content,
        channel: template.channel,
        variables: template.variables || []
      });
      
      // Update templates list
      const updatedTemplates = [...messageTemplates, newTemplate];
      setMessageTemplates(updatedTemplates);
      
      return newTemplate;
    } catch (error) {
      console.error("Error saving template:", error);
      throw error;
    }
  };

  // Create campaign
  const createCampaign = async (
    name: string, 
    contactIds: string[], 
    content: string, 
    scheduledDate?: Date
  ): Promise<any> => {
    try {
      // Find the contacts
      const recipientContacts = contacts.filter(contact => contactIds.includes(contact.id));
      
      // Create the campaign
      const campaign = await unipileService.createCampaign(
        name,
        selectedChannel as MessageChannel,
        contactIds,
        content,
        scheduledDate
      );
      
      // Update campaigns list
      const updatedCampaigns = [campaign, ...campaigns];
      setCampaigns(updatedCampaigns);
      
      return campaign;
    } catch (error) {
      console.error("Error creating campaign:", error);
      throw error;
    }
  };

  // Refresh campaigns
  const refreshCampaigns = async (): Promise<void> => {
    // In a real implementation, this would fetch from an API
    console.log("Refreshing campaigns (mock)");
    // We already have mock data, so do nothing
  };

  // Context value
  const contextValue: CommunicationContextType = {
    // Initialization
    isInitialized,
    isConfiguring,
    initializeServices,
    
    // Voice features
    availableVoices,
    selectedVoice,
    setSelectedVoice,
    generateVoicePreview,
    createVoiceDrop,
    
    // Messaging features
    availableChannels,
    selectedChannel,
    setSelectedChannel,
    sendMessage,
    
    // Contacts management
    contacts,
    selectedContacts,
    contactGroups,
    setSelectedContacts,
    refreshContacts,
    
    // Templates management
    messageTemplates,
    selectedTemplate,
    setSelectedTemplate,
    saveTemplate,
    
    // Campaigns
    campaigns,
    createCampaign,
    refreshCampaigns
  };

  return (
    <CommunicationContext.Provider value={contextValue}>
      {children}
    </CommunicationContext.Provider>
  );
};

// Custom hook for using the communication context
export const useCommunication = () => {
  const context = useContext(CommunicationContext);
  if (!context) {
    throw new Error('useCommunication must be used within a CommunicationProvider');
  }
  return context;
};