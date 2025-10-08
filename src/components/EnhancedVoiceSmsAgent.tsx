import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  User,
  Bot,
  Play,
  Pause,
  Download,
  Copy,
  Clock,
  MessageSquare,
  ExternalLink,
  Trash2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Loader,
  Volume2,
  Settings,
  Phone,
  FileAudio,
  Share2,
  Smartphone,
  List,
  RefreshCw,
  Calendar,
  PenTool,
  BookMarked,
  Target,
  Info,
  AlertCircle,
  FileText,
  Sparkles,
  Zap
} from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import { generateContent } from '../services/openAIService';
import { generateVoiceDropScript, generateSmsTemplate, generateMessagingAppTemplate } from '../services/aiEnhancementService';
import { loadAllDataFromSupabase, syncAllDataToSupabase, isUserAuthenticated } from '../services/dataSyncService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isAudio?: boolean;
  audioUrl?: string;
  isPending?: boolean;
  isGenerating?: boolean;
  template?: {
    name: string;
    type: 'sms' | 'voice' | 'whatsapp' | 'messenger';
  };
}

interface Template {
  id: string;
  name: string;
  content: string;
  type: 'sms' | 'voice' | 'whatsapp' | 'messenger';
  created: Date;
}

interface SavedCampaign {
  id: string;
  name: string;
  messages: Message[];
  created: Date;
  lastEdited: Date;
}

const EnhancedVoiceSmsAgent: React.FC = () => {
  // Messages state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! 👋 I'm your AI Voice & SMS Assistant. I can help you create personalized messages for your referral campaigns. What would you like to do today?\n\n1. Create personalized SMS templates\n2. Generate voice drops for calls\n3. Design WhatsApp campaign messages\n4. Build multi-channel outreach sequences\n\nYou can use commands like /voice, /sms, or /whatsapp followed by your requirements to quickly create specific content.",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  
  // UI state
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [savedCampaigns, setSavedCampaigns] = useState<SavedCampaign[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('female-1');
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-pro');
  
  // Sample voice options
  const voiceOptions = [
    { id: 'female-1', name: 'Sarah (Professional Female)' },
    { id: 'female-2', name: 'Emma (Friendly Female)' },
    { id: 'male-1', name: 'Michael (Professional Male)' },
    { id: 'male-2', name: 'John (Friendly Male)' },
    { id: 'female-3', name: 'Lisa (Energetic Female)' },
    { id: 'male-3', name: 'David (Energetic Male)' }
  ];
  
  // Load templates from localStorage or use demo templates as fallback
  const getStoredTemplates = (): Template[] => {
    try {
      const stored = localStorage.getItem('user_templates');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading templates from localStorage:', error);
      return [];
    }
  };

  const demoTemplates: Template[] = [
    {
      id: 'demo-t1',
      name: 'Follow-up SMS',
      content: "Hi {{name}}, this is {{your_name}} following up about our conversation. I appreciate your interest in referring people to my business. If anyone comes to mind who might need {{service}}, please let me know!",
      type: 'sms',
      created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'demo-t2',
      name: 'Voice Drop Introduction',
      content: "Hello {{name}}, this is {{your_name}} from {{company}}. I'm reaching out because I'm currently accepting new clients through referrals. If you know anyone who needs {{service}}, please let me know. You can reach me at {{your_phone}}. Thanks and have a great day!",
      type: 'voice',
      created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'demo-t3',
      name: 'WhatsApp Referral Request',
      content: "Hi {{name}}! 👋 Hope you're doing well! I'm reaching out because I'm focusing on growing my {{business}} through referrals this month. Do you know anyone who might benefit from {{service}}? I'd really appreciate an introduction! 🙏",
      type: 'whatsapp',
      created: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ];
  
  // Load campaigns from localStorage or use demo campaigns as fallback
  const getStoredCampaigns = (): SavedCampaign[] => {
    try {
      const stored = localStorage.getItem('user_campaigns');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading campaigns from localStorage:', error);
      return [];
    }
  };

  const demoCampaigns: SavedCampaign[] = [
    {
      id: 'demo-c1',
      name: 'Client Referral Follow-up',
      messages: [
        {
          id: 'demo-cm1',
          text: "Create a sequence of 3 SMS messages to follow up with existing clients for referrals",
          sender: 'user',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'demo-cm2',
          text: "Here's a 3-part SMS sequence for following up with existing clients for referrals:\n\nMessage 1 (Day 1):\nHi {{name}}, it's {{your_name}}. I enjoyed working with you on {{project/service}}! I'm reaching out because I'm currently accepting new clients and value referrals from satisfied clients like you. If anyone comes to mind who might benefit from my services, I'd be grateful for an introduction. Thanks!\n\nMessage 2 (Day 5):\nHi {{name}}, just a quick follow-up about referrals. I'm specifically looking for clients who need help with {{specific_service}}. If you know anyone facing challenges in this area, I'd appreciate your recommendation. As a thank you, I'm offering {{incentive}} for each successful referral!\n\nMessage 3 (Day 10):\nHi {{name}}, I wanted to thank you for considering my referral request. To make it easier, I've created a simple way for you to refer people: just share this link {{referral_link}} or have them mention your name when they contact me. As always, I appreciate your support!",
          sender: 'bot',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 1000),
          template: {
            name: 'SMS Sequence',
            type: 'sms'
          }
        }
      ],
      created: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      lastEdited: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 1000)
    },
    {
      id: 'demo-c2',
      name: 'Voice + SMS Campaign',
      messages: [
        {
          id: 'demo-cm3',
          text: "Create a voice drop script and follow-up SMS for cold referral outreach",
          sender: 'user',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'demo-cm4',
          text: "Here's your voice drop script for cold referral outreach:\n\nVoice Script:\nHello {{name}}, this is {{your_name}} from {{company}}. I received your contact information from {{referral_source}} who thought my {{service}} might be valuable for you. I specialize in helping {{target_audience}} with {{specific_problem}}. I'd love to chat briefly about how I might be able to help you too. Please call me back at {{your_number}} or expect a quick follow-up text from me. Thanks and have a great day!\n\nFollow-up SMS (send 2 hours after voice drop):\nHi {{name}}, this is {{your_name}} following up on the voicemail I left earlier. {{referral_source}} suggested we connect regarding {{service}}. I'd love to schedule a quick 15-minute call this week if you're interested. Would {{day}} at {{time}} work for you? If not, please suggest a better time.",
          sender: 'bot',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 1000),
          isAudio: true,
          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          template: {
            name: 'Voice + SMS',
            type: 'voice'
          }
        }
      ],
      created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      lastEdited: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 1000)
    }
  ];
  
  // Initialize data from localStorage and Supabase with demo fallbacks
  useEffect(() => {
    const initializeData = async () => {
      const storedTemplates = getStoredTemplates();
      const storedCampaigns = getStoredCampaigns();

      // Try to load from Supabase if user is authenticated
      const isAuthenticated = await isUserAuthenticated();
      if (isAuthenticated) {
        await loadAllDataFromSupabase();
        // Reload from localStorage after Supabase sync
        const updatedTemplates = getStoredTemplates();
        const updatedCampaigns = getStoredCampaigns();

        // Combine with demo templates (avoid duplicates)
        const allTemplates = [
          ...updatedTemplates,
          ...demoTemplates.filter(demo =>
            !updatedTemplates.some(stored => stored.name === demo.name)
          )
        ];

        const allCampaigns = [
          ...updatedCampaigns,
          ...demoCampaigns.filter(demo =>
            !updatedCampaigns.some(stored => stored.name === demo.name)
          )
        ];

        setTemplates(allTemplates);
        setSavedCampaigns(allCampaigns);
      } else {
        // Use localStorage only with demo fallbacks
        const allTemplates = [
          ...storedTemplates,
          ...demoTemplates.filter(demo =>
            !storedTemplates.some(stored => stored.name === demo.name)
          )
        ];

        const allCampaigns = [
          ...storedCampaigns,
          ...demoCampaigns.filter(demo =>
            !storedCampaigns.some(stored => stored.name === demo.name)
          )
        ];

        setTemplates(allTemplates);
        setSavedCampaigns(allCampaigns);
      }
    };

    initializeData();
  }, []);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Handle stopping audio when switching to a different one
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, [currentAudio]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Create a new user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Add user message to chat
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    
    // Create a pending bot message
    const pendingBotMessage: Message = {
      id: `pending-${Date.now().toString()}`,
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isPending: true
    };
    
    setMessages(prevMessages => [...prevMessages, pendingBotMessage]);
    
    // Handle special commands
    if (inputValue.toLowerCase().startsWith('/voice')) {
      // Generate a voice drop
      await handleVoiceGeneration(userMessage.id, pendingBotMessage.id, inputValue.substring(7));
      return;
    }

    if (inputValue.toLowerCase().startsWith('/sms')) {
      // Generate SMS templates
      await handleSmsGeneration(userMessage.id, pendingBotMessage.id, inputValue.substring(5));
      return;
    }

    if (inputValue.toLowerCase().startsWith('/whatsapp')) {
      // Generate WhatsApp templates
      await handleWhatsAppGeneration(userMessage.id, pendingBotMessage.id, inputValue.substring(10));
      return;
    }
    
    // Generate regular response
    try {
      const botResponse = await generateChatbotResponse(inputValue);

      // Replace the pending message with the actual response
      setMessages(prevMessages => prevMessages.map(msg => 
        msg.id === pendingBotMessage.id
          ? {
              ...msg,
              text: botResponse,
              isPending: false
            }
          : msg
      ));
    } catch (error) {
      console.error("Error generating response:", error);
      
      // Update the pending message with an error
      setMessages(prevMessages => prevMessages.map(msg => 
        msg.id === pendingBotMessage.id
          ? {
              ...msg,
              text: "I'm sorry, I encountered an error generating a response. Please try again.",
              isPending: false
            }
          : msg
      ));
    }
  };
  
  // Handle generating a voice drop
  const handleVoiceGeneration = async (userMessageId: string, pendingMessageId: string, prompt: string) => {
    try {
      setGeneratingAudio(true);
      
      // Generate voice script using the Gemini API
      let scriptContent: string;
      
      // Update the pending message to show it's generating
      setMessages(prevMessages => prevMessages.map(msg => 
        msg.id === pendingMessageId
          ? {
              ...msg,
              isGenerating: true,
              text: "Generating voice drop script..."
            }
          : msg
      ));
      
      try {
        // If prompt is too short or generic, generate a more detailed script
        if (!prompt || prompt.trim().length < 20) {
          scriptContent = await generateVoiceDropScript(selectedModel, 'warm', 'professional', 'standard');
        } else {
          // Generate based on specific prompt using the selected AI model
          scriptContent = await generateContent({
            contentType: "Voice Drop Script",
            specialRequirements: prompt
          });
        }
      } catch (error) {
        console.error("Error generating voice script:", error);
        scriptContent = "I'm sorry, I encountered an error generating the voice script. Please try again with a different prompt.";
      }
      
      // Update the pending message
      setMessages(prevMessages => prevMessages.map(msg => 
        msg.id === pendingMessageId
          ? {
              ...msg,
              text: `📞 **Voice Drop Script:**\n\n${scriptContent}\n\n_This script can be turned into an audio voice drop. Voice drops typically have higher response rates than emails or texts._`,
              isPending: false,
              isGenerating: false,
              isAudio: true,
              audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Demo audio URL
              template: {
                name: 'Voice Drop',
                type: 'voice'
              }
            }
          : msg
      ));
    } catch (error) {
      console.error("Error generating voice drop:", error);
      
      // Update the pending message with an error
      setMessages(prevMessages => prevMessages.map(msg => 
        msg.id === pendingMessageId
          ? {
              ...msg,
              text: "I'm sorry, I encountered an error generating the voice drop. Please try again.",
              isPending: false
            }
          : msg
      ));
    } finally {
      setGeneratingAudio(false);
    }
  };
  
  // Handle generating SMS templates
  const handleSmsGeneration = async (userMessageId: string, pendingMessageId: string, prompt: string) => {
    try {
      // Update the pending message to show it's generating
      setMessages(prevMessages => prevMessages.map(msg => 
        msg.id === pendingMessageId
          ? {
              ...msg,
              isGenerating: true,
              text: "Generating SMS templates..."
            }
          : msg
      ));
      
      // Generate SMS content using Gemini API
      let smsContent: string;
      
      try {
        // If prompt is too short or generic, generate default templates
        if (!prompt || prompt.trim().length < 20) {
          smsContent = await generateSmsTemplate(
            selectedModel,
            'direct-request',
            'friendly',
            true  // Include emojis
          );
        } else {
          // Generate based on specific prompt
          smsContent = await generateContent({
            contentType: "SMS Templates",
            specialRequirements: prompt
          });
        }
      } catch (error) {
        console.error("Error generating SMS templates:", error);
        smsContent = "I'm sorry, I encountered an error generating SMS templates. Please try again with a different prompt.";
      }
      
      // Update the pending message
      setMessages(prevMessages => prevMessages.map(msg => 
        msg.id === pendingMessageId
          ? {
              ...msg,
              text: `📱 **SMS Templates:**\n\n${smsContent}`,
              isPending: false,
              isGenerating: false,
              template: {
                name: 'SMS Template',
                type: 'sms'
              }
            }
          : msg
      ));
      
    } catch (error) {
      console.error("Error generating SMS templates:", error);
      
      // Update the pending message with an error
      setMessages(prevMessages => prevMessages.map(msg => 
        msg.id === pendingMessageId
          ? {
              ...msg,
              text: "I'm sorry, I encountered an error generating the SMS templates. Please try again.",
              isPending: false
            }
          : msg
      ));
    }
  };
  
  // Handle generating WhatsApp templates
  const handleWhatsAppGeneration = async (userMessageId: string, pendingMessageId: string, prompt: string) => {
    try {
      // Update the pending message to show it's generating
      setMessages(prevMessages => prevMessages.map(msg => 
        msg.id === pendingMessageId
          ? {
              ...msg,
              isGenerating: true,
              text: "Generating WhatsApp messaging templates..."
            }
          : msg
      ));
      
      // Generate WhatsApp content using Gemini API
      let whatsAppContent: string;
      
      try {
        // If prompt is too short or generic, generate default templates
        if (!prompt || prompt.trim().length < 20) {
          whatsAppContent = await generateMessagingAppTemplate(
            selectedModel,
            'direct-request',
            'friendly',
            true  // Include emojis
          );
        } else {
          // Generate based on specific prompt
          whatsAppContent = await generateContent({
            contentType: "WhatsApp Template",
            specialRequirements: prompt
          });
        }
      } catch (error) {
        console.error("Error generating WhatsApp templates:", error);
        whatsAppContent = "I'm sorry, I encountered an error generating WhatsApp templates. Please try again with a different prompt.";
      }
      
      // Update the pending message
      setMessages(prevMessages => prevMessages.map(msg => 
        msg.id === pendingMessageId
          ? {
              ...msg,
              text: `💬 **WhatsApp Messaging Templates:**\n\n${whatsAppContent}`,
              isPending: false,
              isGenerating: false,
              template: {
                name: 'WhatsApp Template',
                type: 'whatsapp'
              }
            }
          : msg
      ));
      
    } catch (error) {
      console.error("Error generating WhatsApp templates:", error);
      
      // Update the pending message with an error
      setMessages(prevMessages => prevMessages.map(msg => 
        msg.id === pendingMessageId
          ? {
              ...msg,
              text: "I'm sorry, I encountered an error generating the WhatsApp templates. Please try again.",
              isPending: false
            }
          : msg
      ));
    }
  };

  // Generate chatbot responses using Gemini API
  const generateChatbotResponse = async (userInput: string): Promise<string> => {
    try {
      // Create context from previous messages (limited to last 5 for brevity)
      const recentMessages = messages.slice(-5).map(msg => 
        `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`
      ).join('\n\n');
      
      // Prepare prompt for Gemini API
      const prompt = `You are an AI assistant specialized in helping users create Voice Drops, SMS messages, and WhatsApp messages for referral generation campaigns. You are extremely helpful, direct, and focus on providing specific, actionable responses.

Recent conversation:
${recentMessages}

User's new message: ${userInput}

Provide a helpful response that directly addresses the user's request. If they're asking about creating voice drops, SMS templates, or WhatsApp messages, explain that they can use the special commands:
- /voice [description] to create voice drop scripts
- /sms [description] to create SMS templates
- /whatsapp [description] to create WhatsApp templates

If the user is asking about the differences between communication channels, explain their pros and cons for referral generation.

Be conversational but concise. Include specific examples when relevant.`;

      // Call Gemini API
      const response = await generateContent({
        contentType: "AI Assistant Response",
        specialRequirements: prompt
      });
      
      return response;
    } catch (error) {
      console.error("Error generating chatbot response:", error);
      return "I apologize, but I'm having trouble generating a response right now. You can still use commands like /voice, /sms, or /whatsapp to create content directly.";
    }
  };
  
  // Function to play/pause audio
  const toggleAudio = (messageId: string, audioUrl: string) => {
    if (isPlaying === messageId) {
      // Pause currently playing audio
      if (currentAudio) {
        currentAudio.pause();
      }
      setIsPlaying(null);
    } else {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
      }
      
      // Play the new audio
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      
      audio.addEventListener('ended', () => {
        setIsPlaying(null);
      });
      
      audio.play().catch(err => {
        console.error("Error playing audio:", err);
        setIsPlaying(null);
      });
      
      setIsPlaying(messageId);
    }
  };
  
  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  // Start voice recording
  const startRecording = () => {
    setIsRecording(true);
    // In a real implementation, you would start recording here
    
    // Simulate recording for demo purposes
    setTimeout(() => {
      stopRecording();
    }, 3000);
  };
  
  // Stop voice recording
  const stopRecording = () => {
    setIsRecording(false);
    // In a real implementation, you would stop recording and process the audio here
    
    // Simulate sending the voice message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: "[Voice message]",
      sender: 'user',
      timestamp: new Date(),
      isAudio: true
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I've received your voice message. Would you like me to:\n\n1. Generate a similar voice drop script\n2. Create a text transcript\n3. Use this as a template for future voice drops\n\nPlease let me know how I can help!",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 1500);
  };
  
  // Save the current template
  const saveTemplate = async (content: string, type: 'sms' | 'voice' | 'whatsapp' | 'messenger') => {
    // Create a name based on content and type
    const defaultName = `${type.charAt(0).toUpperCase() + type.slice(1)} Template`;

    // Prompt for name
    const name = prompt("Name your template:", defaultName);

    if (!name) return; // User canceled

    const newTemplate: Template = {
      id: Date.now().toString(),
      name,
      content,
      type,
      created: new Date()
    };

    // Save to localStorage
    try {
      const storedTemplates = getStoredTemplates();
      const updatedTemplates = [newTemplate, ...storedTemplates];
      localStorage.setItem('user_templates', JSON.stringify(updatedTemplates));

      // Sync to Supabase if authenticated
      const isAuthenticated = await isUserAuthenticated();
      if (isAuthenticated) {
        await syncAllDataToSupabase();
      }
    } catch (error) {
      console.error('Error saving template:', error);
    }

    setTemplates(prev => [newTemplate, ...prev]);
  };
  
  // Save the current conversation as a campaign
  const saveConversation = async () => {
    // Prompt for campaign name
    const name = prompt("Name your campaign:", "New Referral Campaign");

    if (!name) return; // User canceled

    const newCampaign: SavedCampaign = {
      id: Date.now().toString(),
      name,
      messages: [...messages],
      created: new Date(),
      lastEdited: new Date()
    };

    // Save to localStorage
    try {
      const storedCampaigns = getStoredCampaigns();
      const updatedCampaigns = [newCampaign, ...storedCampaigns];
      localStorage.setItem('user_campaigns', JSON.stringify(updatedCampaigns));

      // Sync to Supabase if authenticated
      const isAuthenticated = await isUserAuthenticated();
      if (isAuthenticated) {
        await syncAllDataToSupabase();
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
    }

    setSavedCampaigns(prev => [newCampaign, ...prev]);
  };
  
  // Load a saved campaign
  const loadCampaign = (campaign: SavedCampaign) => {
    if (messages.length > 1 && !confirm("Loading a campaign will replace your current conversation. Continue?")) {
      return;
    }
    
    setMessages(campaign.messages);
    setShowCampaigns(false);
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get template/button color based on message type
  const getTemplateColors = (type: string): { bg: string, text: string, border: string, icon: JSX.Element } => {
    switch(type) {
      case 'sms':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          icon: <Smartphone size={14} className="text-blue-500" />
        };
      case 'voice':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          border: 'border-purple-200',
          icon: <Phone size={14} className="text-purple-600" />
        };
      case 'whatsapp':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
          icon: <MessageSquare size={14} className="text-green-500" />
        };
      case 'messenger':
        return {
          bg: 'bg-indigo-50',
          text: 'text-indigo-700',
          border: 'border-indigo-200',
          icon: <MessageSquare size={14} className="text-indigo-500" />
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: <MessageSquare size={14} className="text-gray-500" />
        };
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)]">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-gray-100 to-gray-50 border-r border-gray-200 flex flex-col hidden md:flex">
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-gray-700 font-medium transition-colors ${
                showTemplates 
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-sm' 
                  : 'bg-white shadow-sm hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <FileAudio size={16} className="mr-2" />
                <span>Templates</span>
              </div>
              {showTemplates ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {showTemplates && (
              <div className="mt-2 space-y-1 max-h-64 overflow-y-auto rounded-lg border border-indigo-100 bg-white shadow-inner p-1">
                {templates.map(template => {
                  const colors = getTemplateColors(template.type);
                  return (
                    <div 
                      key={template.id}
                      className={`flex items-center py-1.5 px-2 text-sm hover:bg-gray-50 rounded-md cursor-pointer transition-all`}
                      onClick={() => {
                        // Insert template content into input field
                        setInputValue(`/${template.type} ${template.content}`);
                      }}
                    >
                      <div className={`w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center mr-2 border ${colors.border} shadow-sm`}>
                        {colors.icon}
                      </div>
                      <div className="overflow-hidden">
                        <div className="truncate font-medium text-gray-800">{template.name}</div>
                        <div className="text-xs text-gray-500">{template.created.toLocaleDateString()}</div>
                      </div>
                    </div>
                  );
                })}
                {templates.length === 0 && (
                  <div className="p-3 text-center text-gray-500 text-sm">
                    No templates saved yet
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={() => setShowCampaigns(!showCampaigns)}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-gray-700 font-medium transition-colors mt-3 ${
                showCampaigns 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm' 
                  : 'bg-white shadow-sm hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>Saved Campaigns</span>
              </div>
              {showCampaigns ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {showCampaigns && (
              <div className="mt-2 space-y-1 max-h-64 overflow-y-auto rounded-lg border border-green-100 bg-white shadow-inner p-1">
                {savedCampaigns.map(campaign => (
                  <div 
                    key={campaign.id}
                    className="flex items-center py-1.5 px-2 text-sm hover:bg-gray-50 rounded-md cursor-pointer transition-all"
                    onClick={() => loadCampaign(campaign)}
                  >
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2 shadow-sm">
                      <List size={14} className="text-green-600" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="truncate font-medium text-gray-800">{campaign.name}</div>
                      <div className="text-xs text-gray-500">{campaign.created.toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
                {savedCampaigns.length === 0 && (
                  <div className="p-3 text-center text-gray-500 text-sm">
                    No campaigns saved yet
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                className="flex items-center w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-sm hover:shadow transition-all"
                onClick={() => {
                  setInputValue("/voice ");
                  document.querySelector('input')?.focus();
                }}
              >
                <Phone size={16} className="mr-2" />
                <span>New Voice Drop</span>
              </button>
              <button 
                className="flex items-center w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-sm hover:shadow transition-all"
                onClick={() => {
                  setInputValue("/sms ");
                  document.querySelector('input')?.focus();
                }}
              >
                <Smartphone size={16} className="mr-2" />
                <span>New SMS Template</span>
              </button>
              <button 
                className="flex items-center w-full px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-sm hover:shadow transition-all"
                onClick={() => {
                  setInputValue("/whatsapp ");
                  document.querySelector('input')?.focus();
                }}
              >
                <MessageSquare size={16} className="mr-2" />
                <span>WhatsApp Campaign</span>
              </button>
            </div>
          </div>
          
          <div className="mt-auto p-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">AI Model</h3>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 text-sm mb-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="gemini-2.5-pro">Gemini 2.5 Pro (Best Quality)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Balanced)</option>
              <option value="gemini-2.0-flash-light">Gemini 2.0 Flash Light (Fastest)</option>
            </select>
            
            <div className="text-xs text-gray-500 space-y-1 bg-indigo-50 p-2 rounded-lg border border-indigo-100 mt-2">
              <p className="flex items-center">
                <Zap size={12} className="mr-1 text-indigo-600" />
                Use /voice to create voice drops
              </p>
              <p className="flex items-center">
                <Zap size={12} className="mr-1 text-indigo-600" />
                Use /sms for text message templates
              </p>
              <p className="flex items-center">
                <Zap size={12} className="mr-1 text-indigo-600" />
                Use /whatsapp for messaging apps
              </p>
            </div>
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50 overflow-hidden">
          {/* Message area */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message) => {
              // Get colors based on template type if it exists
              const templateColors = message.template
                ? getTemplateColors(message.template.type)
                : { bg: '', text: '', border: '', icon: <></> };
              
              return (
                <div 
                  key={message.id}
                  className={`max-w-3xl mx-2 mb-4 ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}
                >
                  <div className="flex items-start">
                    <div 
                      className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-white mr-2 shadow-sm ${
                        message.sender === 'user' 
                          ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
                          : 'bg-gradient-to-br from-indigo-600 to-purple-600'
                      }`}
                    >
                      {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className="flex-1">
                      <div className={`rounded-2xl py-2 px-3 shadow-sm ${
                        message.sender === 'user' 
                          ? 'bg-gradient-to-r from-emerald-50 to-green-50 border border-green-100' 
                          : 'bg-white border border-gray-200'
                      }`}>
                        {message.isPending ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        ) : message.isGenerating ? (
                          <div className="flex items-center gap-2">
                            <Loader size={16} className="text-indigo-500 animate-spin" />
                            <TypeAnimation
                              sequence={[message.text]}
                              wrapper="span"
                              speed={50}
                              repeat={0}
                              cursor={false}
                            />
                          </div>
                        ) : (
                          <>
                            <div className="whitespace-pre-wrap mb-1" style={{overflowWrap: 'break-word'}}>
                              {/* Render markdown-like content */}
                              {message.text.split('\n').map((line, i) => {
                                // Handle bold text
                                const boldText = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                                
                                // Handle headers
                                if (line.startsWith('###')) {
                                  return <h3 key={i} className="text-sm font-bold mt-2 mb-1 text-indigo-700" dangerouslySetInnerHTML={{ __html: boldText.substring(3) }} />;
                                } else if (line.startsWith('##')) {
                                  return <h2 key={i} className="text-base font-bold mt-3 mb-2 text-indigo-700" dangerouslySetInnerHTML={{ __html: boldText.substring(2) }} />;
                                } else if (line.startsWith('#')) {
                                  return <h1 key={i} className="text-lg font-bold mt-3 mb-2 text-indigo-700" dangerouslySetInnerHTML={{ __html: boldText.substring(1) }} />;
                                }
                                
                                // Handle list items
                                if (line.startsWith('- ') || line.startsWith('* ')) {
                                  return <li key={i} className="ml-4 text-gray-700" dangerouslySetInnerHTML={{ __html: boldText.substring(2) }} />;
                                } else if (/^\d+\.\s/.test(line)) {
                                  return <li key={i} className="ml-4 text-gray-700" dangerouslySetInnerHTML={{ __html: boldText }} />;
                                }
                                
                                return <p key={i} className="mb-2 text-gray-800" dangerouslySetInnerHTML={{ __html: boldText }} />;
                              })}
                            </div>
                            
                            {/* Show audio controls for voice messages */}
                            {message.isAudio && message.audioUrl && (
                              <div className="mt-2 flex items-center bg-purple-50 rounded-lg border border-purple-100 p-2">
                                <button 
                                  onClick={() => toggleAudio(message.id, message.audioUrl!)}
                                  className={`p-2 rounded-full shadow-sm flex-shrink-0 transition-colors ${isPlaying === message.id ? 'bg-red-500 text-white' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'}`}
                                >
                                  {isPlaying === message.id ? <Pause size={16} /> : <Play size={16} />}
                                </button>
                                <div className="h-1 bg-gray-200 flex-1 rounded-full mx-2 overflow-hidden">
                                  <div className={`h-full rounded-full ${isPlaying === message.id ? 'bg-gradient-to-r from-purple-500 to-indigo-500 animate-pulse w-1/3' : 'w-0'}`}></div>
                                </div>
                                <button 
                                  className="p-2 rounded-full hover:bg-purple-100 text-purple-700 transition-colors flex-shrink-0"
                                  title="Download audio"
                                >
                                  <Download size={16} />
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center mt-1 gap-2">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {formatTime(message.timestamp)}
                        </span>
                        
                        {/* Template badge */}
                        {message.template && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${templateColors.bg} ${templateColors.text} border ${templateColors.border} flex items-center shadow-sm`}>
                            {templateColors.icon}
                            <span className="ml-1">{message.template.name}</span>
                          </span>
                        )}
                        
                        {/* Action buttons for bot messages */}
                        {message.sender === 'bot' && !message.isPending && !message.isGenerating && (
                          <div className="flex items-center space-x-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            {message.template && (
                              <button
                                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                                title="Save as template"
                                onClick={() => saveTemplate(message.text, message.template!.type)}
                              >
                                <PenTool size={14} />
                              </button>
                            )}
                            <button
                              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                              title="Copy to clipboard"
                              onClick={() => {
                                navigator.clipboard.writeText(message.text);
                                // Flash a "Copied!" indicator (could be implemented with state)
                              }}
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="border-t border-gray-200 p-4 bg-white shadow-lg">
            <div className="flex items-center bg-white rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent overflow-hidden shadow-sm">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type a message or use /voice, /sms, /whatsapp commands..."
                className="flex-1 px-4 py-2 border-none focus:outline-none focus:ring-0"
                disabled={generatingAudio}
              />
              <div className="flex">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={generatingAudio}
                  className={`px-3 py-2 ${
                    isRecording 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  } text-gray-700 transition-colors`}
                  title={isRecording ? "Stop recording" : "Start voice recording"}
                >
                  <Mic size={18} className={isRecording ? 'text-white animate-pulse' : ''} />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || generatingAudio}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-gray-500">
                {generatingAudio && (
                  <span className="flex items-center text-indigo-600">
                    <Loader size={12} className="animate-spin mr-1" />
                    Generating content...
                  </span>
                )}
              </div>
              <div className="flex md:hidden">
                <button 
                  className="mr-2 p-2 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-lg text-indigo-700 hover:from-indigo-200 hover:to-indigo-300 transition-colors"
                  onClick={() => saveConversation()}
                >
                  <BookMarked size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedVoiceSmsAgent;