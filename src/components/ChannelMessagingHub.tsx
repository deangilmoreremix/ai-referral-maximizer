import React, { useState, useEffect } from 'react';
import { 
  Send, MessageSquare, Phone, Smartphone, Calendar, ChevronDown, RefreshCw, 
  X, ListFilter, Download, File, CheckCircle, AlertCircle, Search, Check, 
  Users, UserPlus, ExternalLink, BarChart, Filter, Save, Upload, Sparkles, Zap,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';
import { useCommunication } from '../contexts/CommunicationContext';
import ContentEnhancementModal from './ContentEnhancementModal';
import { 
  generateSmsTemplate, 
  generateMessagingAppTemplate, 
  ContentTone 
} from '../services/aiEnhancementService';

interface ChannelMessagingHubProps {
  initialContent?: string;
  onClose: () => void;
  onSuccess?: (result: any) => void;
}

const ChannelMessagingHub: React.FC<ChannelMessagingHubProps> = ({
  initialContent = '',
  onClose,
  onSuccess
}) => {
  // Communication context
  const {
    availableChannels,
    selectedChannel,
    setSelectedChannel,
    contacts,
    selectedContacts,
    setSelectedContacts,
    contactGroups,
    messageTemplates,
    selectedTemplate,
    setSelectedTemplate,
    sendMessage,
    scheduleMessage,
    createCampaign
  } = useCommunication();

  // UI state
  const [content, setContent] = useState(initialContent);
  const [isSequential, setIsSequential] = useState(false);
  const [sequenceInterval, setSequenceInterval] = useState(60); // seconds
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<Date>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    return tomorrow;
  });
  const [personalize, setPersonalize] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [campaignName, setCampaignName] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [isEnhancerOpen, setIsEnhancerOpen] = useState(false);
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-pro');
  const [messageType, setMessageType] = useState('direct-request');
  const [selectedTone, setSelectedTone] = useState<ContentTone>('friendly');

  // Filter templates based on selected channel
  const channelTemplates = messageTemplates.filter(template => 
    template.channel === selectedChannel
  );

  // Unique tags from all contacts
  const allTags = Array.from(
    new Set(
      contacts.flatMap(contact => contact.tags)
    )
  ).sort();

  // Filter contacts based on search query and selected tag
  const filteredContacts = contacts.filter(contact => {
    // First filter by channel availability
    if (!contact.channels.includes(selectedChannel)) return false;
    
    // Then filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !contact.name.toLowerCase().includes(query) &&
        !contact.phone?.toLowerCase().includes(query) &&
        !contact.email?.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    
    // Finally filter by selected tag
    if (selectedTag && !contact.tags.includes(selectedTag)) {
      return false;
    }
    
    return true;
  });

  // Handle channel change
  const handleChannelChange = (channel: string) => {
    if (availableChannels[channel as keyof typeof availableChannels]) {
      setSelectedChannel(channel as any);
      // Clear selected template when changing channel
      setSelectedTemplate(null);
    }
  };

  // Apply template to content
  const applyTemplate = (templateId: string) => {
    const template = channelTemplates.find(t => t.id === templateId);
    if (template) {
      setContent(template.content);
      setSelectedTemplate(templateId);
    }
  };

  // Toggle contact selection
  const toggleContact = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  // Toggle tag filter
  const toggleTagFilter = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };

  // Save as template
  const saveAsTemplate = async () => {
    if (!content.trim()) {
      setErrorMessage('Please enter message content first');
      return;
    }
    
    setShowTemplateModal(true);
  };

  // Generate a new template with AI
  const handleGenerateTemplate = async () => {
    try {
      setIsGeneratingTemplate(true);
      setErrorMessage(null);
      
      let generatedContent: string;
      
      // Generate content based on channel type
      if (selectedChannel === 'sms') {
        generatedContent = await generateSmsTemplate(
          selectedModel,
          messageType,
          selectedTone,
          true // includeEmojis
        );
      } else if (selectedChannel === 'whatsapp' || selectedChannel === 'messenger') {
        generatedContent = await generateMessagingAppTemplate(
          selectedModel,
          messageType,
          selectedTone,
          true // includeEmojis
        );
      } else {
        // For other channels, use a generic template
        generatedContent = await generateSmsTemplate(
          selectedModel,
          messageType,
          selectedTone,
          selectedChannel !== 'email'
        );
      }
      
      // Set the new content
      setContent(generatedContent);
      
      // Show success message
      setSuccessMessage("New message template generated successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (error: any) {
      console.error('Error generating template:', error);
      setErrorMessage(`Failed to generate template: ${error.message}`);
    } finally {
      setIsGeneratingTemplate(false);
    }
  };

  // Confirm template save
  const confirmSaveTemplate = async () => {
    try {
      if (!newTemplateName.trim()) {
        setErrorMessage('Please enter a template name');
        return;
      }
      
      // Extract variables from content
      const variablePattern = /{{([^}]+)}}/g;
      const matches = content.matchAll(variablePattern);
      const variables = Array.from(matches).map(match => match[1]);
      
      // Save template using communication context
      await useCommunication().saveTemplate({
        name: newTemplateName,
        content,
        channel: selectedChannel,
        variables: [...new Set(variables)]
      });
      
      setShowTemplateModal(false);
      setNewTemplateName('');
      setSuccessMessage(`Template "${newTemplateName}" saved successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(`Error saving template: ${err.message}`);
    }
  };

  // Open the content enhancer
  const openEnhancer = () => {
    if (content.trim()) {
      setIsEnhancerOpen(true);
    } else {
      setErrorMessage('Please enter content first before enhancing');
    }
  };
  
  // Handle enhanced content
  const handleEnhancedContent = (enhanced: string) => {
    setContent(enhanced);
  };

  // Send messages
  const sendMessages = async () => {
    if (!content.trim()) {
      setErrorMessage('Please enter message content');
      return;
    }
    
    if (selectedContacts.length === 0) {
      setErrorMessage('Please select at least one recipient');
      return;
    }
    
    try {
      setIsSending(true);
      setErrorMessage(null);
      
      // Get selected contact details
      const recipientContacts = contacts.filter(contact => selectedContacts.includes(contact.id));
      
      // Determine if this is a campaign or immediate send
      if (isScheduled || isSequential) {
        // Create a campaign name if not provided
        const defaultName = `${selectedChannel.charAt(0).toUpperCase() + selectedChannel.slice(1)} Campaign ${format(new Date(), 'MMM d, yyyy')}`;
        const finalCampaignName = campaignName || defaultName;
        
        // Create campaign
        const campaign = await createCampaign(
          finalCampaignName,
          selectedContacts,
          content,
          isScheduled ? scheduledTime : undefined
        );
        
        setSuccessMessage(`Campaign "${finalCampaignName}" created with ${selectedContacts.length} recipient(s)`);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(campaign);
        }
      } else {
        // Send messages immediately
        const results: Record<string, any> = {};
        const totalContacts = recipientContacts.length;
        let successCount = 0;
        
        // Process each recipient - could be batched in a real implementation
        for (let i = 0; i < recipientContacts.length; i++) {
          const contact = recipientContacts[i];
          
          try {
            // Personalize content if enabled
            let personalizedContent = content;
            
            if (personalize) {
              // Extract first name from full name if available
              const firstName = contact.name.split(' ')[0];
              
              personalizedContent = content
                .replace(/{{name}}/g, contact.name)
                .replace(/{{first_name}}/g, firstName); // Fixed: Use firstName variable
            }
            
            // Send message
            const result = await sendMessage({
              to: contact.phone || '',
              content: personalizedContent,
              contactId: contact.id
            });
            
            results[contact.id] = result;
            
            if (result.success) {
              successCount++;
            }
          } catch (error) {
            console.error(`Error sending to ${contact.name}:`, error);
            results[contact.id] = { success: false, error: 'Failed to send' };
          }
        }
        
        // Build success message
        setSuccessMessage(`Sent messages to ${successCount} of ${totalContacts} recipient(s)`);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(results);
        }
      }
      
      setTimeout(() => onClose(), 3000); // Auto-close after success
    } catch (error: any) {
      console.error('Error sending messages:', error);
      setErrorMessage(`Error sending messages: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  // Format the channel name for display
  const formatChannelName = (channel: string): string => {
    switch (channel) {
      case 'sms': return 'SMS Text';
      case 'whatsapp': return 'WhatsApp';
      case 'messenger': return 'Messenger';
      case 'voice': return 'Voice Call';
      case 'email': return 'Email';
      default: return channel.charAt(0).toUpperCase() + channel.slice(1);
    }
  };

  // Get channel icon
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return <Smartphone size={16} />;
      case 'whatsapp': return <MessageSquare size={16} className="text-green-600" />;
      case 'messenger': return <MessageSquare size={16} className="text-blue-600" />;
      case 'voice': return <Phone size={16} />;
      case 'email': return <Mail size={16} />;
      default: return <MessageSquare size={16} />;
    }
  };

  // Get channel color classes
  const getChannelColorClasses = (channel: string): {bg: string, text: string, border: string, gradient: string} => {
    switch (channel) {
      case 'sms':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          gradient: 'from-blue-600 to-blue-500'
        };
      case 'whatsapp':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
          gradient: 'from-green-600 to-green-500'
        };
      case 'messenger':
        return {
          bg: 'bg-indigo-50',
          text: 'text-indigo-700',
          border: 'border-indigo-200',
          gradient: 'from-indigo-600 to-blue-600'
        };
      case 'voice':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          border: 'border-purple-200',
          gradient: 'from-purple-600 to-purple-500'
        };
      case 'email':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          gradient: 'from-amber-600 to-amber-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          gradient: 'from-gray-600 to-gray-500'
        };
    }
  };

  // Get active channel colors
  const activeColors = getChannelColorClasses(selectedChannel);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className={`px-6 py-4 border-b ${activeColors.border} bg-gradient-to-r ${activeColors.gradient} flex justify-between items-center`}>
          <div className="flex items-center">
            <div className="p-2 bg-white/20 rounded-lg mr-3">
              {getChannelIcon(selectedChannel)}
            </div>
            <h2 className="text-xl font-semibold text-white">Channel Messaging</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Main content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Channel selection */}
              <div className="md:col-span-1">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Channel Selection</h3>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {Object.entries(availableChannels).map(([channel, isAvailable]) => {
                    const colors = getChannelColorClasses(channel);
                    return (
                      <div
                        key={channel}
                        className={`
                          border p-2.5 rounded-lg flex items-center transition-all
                          ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                          ${selectedChannel === channel 
                            ? `${colors.border} ${colors.bg} shadow-sm` 
                            : 'border-gray-200 hover:bg-gray-50'}
                        `}
                        onClick={() => isAvailable && handleChannelChange(channel)}
                      >
                        <div className={`
                          w-8 h-8 rounded-full mr-2 flex items-center justify-center 
                          ${selectedChannel === channel 
                            ? `bg-gradient-to-r ${colors.gradient} text-white shadow-sm` 
                            : 'bg-gray-100 text-gray-500'}
                        `}>
                          {getChannelIcon(channel)}
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${selectedChannel === channel ? colors.text : 'text-gray-800'}`}>{formatChannelName(channel)}</div>
                          <div className="text-xs text-gray-500">
                            {isAvailable ? 'Available' : 'Not available'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Template selection */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-700">Message Templates</h3>
                    <button 
                      onClick={handleGenerateTemplate}
                      className={`px-2 py-1 ${activeColors.bg} ${activeColors.text} rounded text-xs flex items-center hover:bg-opacity-80 border ${activeColors.border}`}
                      disabled={isGeneratingTemplate}
                    >
                      {isGeneratingTemplate ? (
                        <>
                          <RefreshCw size={12} className="mr-1 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Zap size={12} className="mr-1" />
                          Generate New
                        </>
                      )}
                    </button>
                  </div>
                  
                  {channelTemplates.length > 0 ? (
                    <select
                      value={selectedTemplate || ''}
                      onChange={(e) => {
                        if (e.target.value) applyTemplate(e.target.value);
                      }}
                      className={`w-full border ${activeColors.border} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:border-transparent shadow-sm ${
                        selectedChannel === 'whatsapp' ? 'focus:ring-green-500' :
                        selectedChannel === 'messenger' ? 'focus:ring-indigo-500' :
                        selectedChannel === 'sms' ? 'focus:ring-blue-500' :
                        selectedChannel === 'voice' ? 'focus:ring-purple-500' :
                        'focus:ring-gray-500'
                      }`}
                    >
                      <option value="">Select a template...</option>
                      {channelTemplates.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className={`text-sm ${activeColors.text} ${activeColors.bg} p-3 rounded-lg border ${activeColors.border}`}>
                      No templates for {formatChannelName(selectedChannel)} yet
                    </div>
                  )}
                  <div className="flex justify-end mt-1">
                    <button 
                      onClick={saveAsTemplate}
                      disabled={!content.trim()}
                      className={`text-xs ${activeColors.text} hover:text-opacity-80 flex items-center`}
                    >
                      <Save size={12} className="mr-1" />
                      Save current as template
                    </button>
                  </div>
                </div>
                
                {/* Message Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message Type
                  </label>
                  <select
                    value={messageType}
                    onChange={(e) => setMessageType(e.target.value)}
                    className={`w-full border ${activeColors.border} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:border-transparent shadow-sm ${
                      selectedChannel === 'whatsapp' ? 'focus:ring-green-500' :
                      selectedChannel === 'messenger' ? 'focus:ring-indigo-500' :
                      selectedChannel === 'sms' ? 'focus:ring-blue-500' :
                      selectedChannel === 'voice' ? 'focus:ring-purple-500' :
                      'focus:ring-gray-500'
                    }`}
                  >
                    <option value="direct-request">Direct Referral Request</option>
                    <option value="follow-up">Follow-up Message</option>
                    <option value="value-add">Value-Add Content</option>
                    <option value="reminder">Reminder Message</option>
                    <option value="thank-you">Thank You Message</option>
                  </select>
                </div>
                
                {/* Tone Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message Tone
                  </label>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value as ContentTone)}
                    className={`w-full border ${activeColors.border} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:border-transparent shadow-sm ${
                      selectedChannel === 'whatsapp' ? 'focus:ring-green-500' :
                      selectedChannel === 'messenger' ? 'focus:ring-indigo-500' :
                      selectedChannel === 'sms' ? 'focus:ring-blue-500' :
                      selectedChannel === 'voice' ? 'focus:ring-purple-500' :
                      'focus:ring-gray-500'
                    }`}
                  >
                    <option value="friendly">Friendly</option>
                    <option value="professional">Professional</option>
                    <option value="conversational">Conversational</option>
                    <option value="persuasive">Persuasive</option>
                    <option value="urgent">Urgent</option>
                    <option value="empathetic">Empathetic</option>
                  </select>
                </div>
                
                {/* Campaign settings */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Campaign Settings</h3>
                  
                  <div className={`space-y-3 ${activeColors.bg} p-4 rounded-lg border ${activeColors.border}`}>
                    {/* Sequential delivery */}
                    <div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="sequential"
                          checked={isSequential}
                          onChange={(e) => setIsSequential(e.target.checked)}
                          className={`h-4 w-4 focus:ring-opacity-50 border-gray-300 rounded ${
                            selectedChannel === 'whatsapp' ? 'text-green-600 focus:ring-green-500' :
                            selectedChannel === 'messenger' ? 'text-indigo-600 focus:ring-indigo-500' :
                            selectedChannel === 'sms' ? 'text-blue-600 focus:ring-blue-500' :
                            selectedChannel === 'voice' ? 'text-purple-600 focus:ring-purple-500' :
                            'text-gray-600 focus:ring-gray-500'
                          }`}
                        />
                        <label htmlFor="sequential" className="text-sm text-gray-800">Sequential delivery</label>
                      </div>
                      
                      {isSequential && (
                        <div className="mt-2 pl-6">
                          <label className="block text-xs text-gray-700 mb-1">Interval between messages</label>
                          <select
                            value={sequenceInterval}
                            onChange={(e) => setSequenceInterval(parseInt(e.target.value))}
                            className={`border ${activeColors.border} rounded-lg px-2 py-1 text-xs ${activeColors.bg} ${
                              selectedChannel === 'whatsapp' ? 'focus:ring-green-500' :
                              selectedChannel === 'messenger' ? 'focus:ring-indigo-500' :
                              selectedChannel === 'sms' ? 'focus:ring-blue-500' :
                              selectedChannel === 'voice' ? 'focus:ring-purple-500' :
                              'focus:ring-gray-500'
                            } focus:border-transparent`}
                          >
                            <option value="30">30 seconds</option>
                            <option value="60">1 minute</option>
                            <option value="300">5 minutes</option>
                            <option value="600">10 minutes</option>
                          </select>
                        </div>
                      )}
                    </div>
                    
                    {/* Scheduled delivery */}
                    <div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="scheduled"
                          checked={isScheduled}
                          onChange={(e) => setIsScheduled(e.target.checked)}
                          className={`h-4 w-4 focus:ring-opacity-50 border-gray-300 rounded ${
                            selectedChannel === 'whatsapp' ? 'text-green-600 focus:ring-green-500' :
                            selectedChannel === 'messenger' ? 'text-indigo-600 focus:ring-indigo-500' :
                            selectedChannel === 'sms' ? 'text-blue-600 focus:ring-blue-500' :
                            selectedChannel === 'voice' ? 'text-purple-600 focus:ring-purple-500' :
                            'text-gray-600 focus:ring-gray-500'
                          }`}
                        />
                        <label htmlFor="scheduled" className="text-sm text-gray-800">Schedule for later</label>
                      </div>
                      
                      {isScheduled && (
                        <div className="mt-2 pl-6">
                          <input
                            type="datetime-local"
                            value={scheduledTime.toISOString().slice(0, 16)}
                            onChange={(e) => {
                              const date = new Date(e.target.value);
                              setScheduledTime(date);
                            }}
                            className={`border ${activeColors.border} rounded-md px-2 py-1.5 text-xs bg-white focus:ring-2 focus:border-transparent ${
                              selectedChannel === 'whatsapp' ? 'focus:ring-green-500' :
                              selectedChannel === 'messenger' ? 'focus:ring-indigo-500' :
                              selectedChannel === 'sms' ? 'focus:ring-blue-500' :
                              selectedChannel === 'voice' ? 'focus:ring-purple-500' :
                              'focus:ring-gray-500'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Personalization */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="personalize"
                        checked={personalize}
                        onChange={(e) => setPersonalize(e.target.checked)}
                        className={`h-4 w-4 focus:ring-opacity-50 border-gray-300 rounded ${
                          selectedChannel === 'whatsapp' ? 'text-green-600 focus:ring-green-500' :
                          selectedChannel === 'messenger' ? 'text-indigo-600 focus:ring-indigo-500' :
                          selectedChannel === 'sms' ? 'text-blue-600 focus:ring-blue-500' :
                          selectedChannel === 'voice' ? 'text-purple-600 focus:ring-purple-500' :
                          'text-gray-600 focus:ring-gray-500'
                        }`}
                      />
                      <label htmlFor="personalize" className="text-sm text-gray-800">Personalize messages</label>
                    </div>
                    
                    {/* Campaign name (only if scheduled or sequential) */}
                    {(isScheduled || isSequential) && (
                      <div>
                        <label htmlFor="campaign-name" className="block text-xs text-gray-700 mb-1">
                          Campaign Name
                        </label>
                        <input
                          type="text"
                          id="campaign-name"
                          value={campaignName}
                          onChange={(e) => setCampaignName(e.target.value)}
                          placeholder="Enter campaign name..."
                          className={`border ${activeColors.border} rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:border-transparent shadow-sm ${
                            selectedChannel === 'whatsapp' ? 'focus:ring-green-500' :
                            selectedChannel === 'messenger' ? 'focus:ring-indigo-500' :
                            selectedChannel === 'sms' ? 'focus:ring-blue-500' :
                            selectedChannel === 'voice' ? 'focus:ring-purple-500' :
                            'focus:ring-gray-500'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Message composer */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-gray-700">Message Composer</h3>
                  <button 
                    onClick={openEnhancer}
                    className={`px-2 py-1 ${activeColors.bg} ${activeColors.text} rounded text-xs flex items-center border ${activeColors.border} shadow-sm`}
                    disabled={!content.trim()}
                  >
                    <Sparkles size={12} className="mr-1" />
                    Enhance
                  </button>
                </div>
                
                <div className="mb-4">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`Enter your ${selectedChannel} message here...`}
                    className={`w-full h-32 border ${activeColors.border} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:border-transparent shadow-sm ${
                      selectedChannel === 'whatsapp' ? 'focus:ring-green-500' :
                      selectedChannel === 'messenger' ? 'focus:ring-indigo-500' :
                      selectedChannel === 'sms' ? 'focus:ring-blue-500' :
                      selectedChannel === 'voice' ? 'focus:ring-purple-500' :
                      'focus:ring-gray-500'
                    }`}
                    disabled={isSending}
                  ></textarea>
                  
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <div className={activeColors.text}>
                      {content.length} characters
                      {selectedChannel === 'sms' && (
                        <> (messages: {Math.ceil(content.length / 160)})</>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {/* Add buttons for emoji, attachments, etc. */}
                      <button className="text-gray-500 hover:text-gray-700 px-2 py-0.5 rounded hover:bg-gray-100">
                        Emoji
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 px-2 py-0.5 rounded hover:bg-gray-100">
                        Attach
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Variable reference */}
                <div className="mb-6">
                  <h4 className="text-xs font-medium text-gray-700 mb-1 flex items-center">
                    <span>Available Variables</span>
                    <span className={`ml-1 ${activeColors.bg} ${activeColors.text} text-xs px-1.5 py-0.5 rounded border ${activeColors.border}`}>
                      Click to insert
                    </span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 rounded-lg border border-gray-200">
                    {[
                      { key: 'name', desc: 'Full name of the recipient' },
                      { key: 'first_name', desc: 'First name of the recipient' },
                      { key: 'your_name', desc: 'Your name' },
                      { key: 'company', desc: 'Your company name' },
                      { key: 'service', desc: 'Your service name' }
                    ].map(variable => (
                      <div 
                        key={variable.key}
                        className={`${activeColors.bg} text-xs ${activeColors.text} px-2 py-1 rounded hover:bg-opacity-80 cursor-pointer border ${activeColors.border} shadow-sm transition-all`}
                        onClick={() => {
                          const insertion = `{{${variable.key}}}`;
                          const textarea = document.querySelector('textarea');
                          if (textarea) {
                            const start = textarea.selectionStart || 0;
                            const end = textarea.selectionEnd || 0;
                            const newContent = content.substring(0, start) + insertion + content.substring(end);
                            setContent(newContent);
                            setTimeout(() => {
                              textarea.focus();
                              textarea.selectionStart = start + insertion.length;
                              textarea.selectionEnd = start + insertion.length;
                            }, 0);
                          } else {
                            setContent(content + ' ' + insertion);
                          }
                        }}
                        title={variable.desc}
                      >
                        {`{{${variable.key}}}`}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Recipients */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Recipients</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{selectedContacts.length} selected</span>
                    </div>
                  </div>
                  
                  {/* Tag filters */}
                  {allTags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {allTags.map(tag => (
                        <div
                          key={tag}
                          className={`text-xs px-2 py-1 rounded cursor-pointer transition-all ${
                            selectedTag === tag
                              ? `${activeColors.text} bg-white border ${activeColors.border} shadow-sm`
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => toggleTagFilter(tag)}
                        >
                          {tag}
                          {selectedTag === tag && (
                            <Check size={12} className="inline ml-1" />
                          )}
                        </div>
                      ))}
                      {selectedTag && (
                        <button
                          onClick={() => setSelectedTag(null)}
                          className={`text-xs px-2 py-1 ${activeColors.text} hover:text-opacity-80`}
                        >
                          Clear filter
                        </button>
                      )}
                    </div>
                  )}
                  
                  {/* Search box */}
                  <div className="relative mb-3">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search contacts..."
                      className={`w-full pl-9 pr-3 py-2 border ${activeColors.border} rounded-lg text-sm focus:ring-2 focus:border-transparent shadow-sm ${
                        selectedChannel === 'whatsapp' ? 'focus:ring-green-500' :
                        selectedChannel === 'messenger' ? 'focus:ring-indigo-500' :
                        selectedChannel === 'sms' ? 'focus:ring-blue-500' :
                        selectedChannel === 'voice' ? 'focus:ring-purple-500' :
                        'focus:ring-gray-500'
                      }`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={16} className={activeColors.text} />
                    </div>
                  </div>
                  
                  {/* Contact list */}
                  <div className={`border ${activeColors.border} rounded-lg overflow-y-auto max-h-64 mb-4 shadow-sm`}>
                    {filteredContacts.length > 0 ? (
                      <>
                        <div className={`p-2 border-b ${activeColors.border} ${activeColors.bg} flex justify-between`}>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedContacts.length > 0 && selectedContacts.length === filteredContacts.length}
                              onChange={() => {
                                if (selectedContacts.length === filteredContacts.length) {
                                  setSelectedContacts([]);
                                } else {
                                  setSelectedContacts(filteredContacts.map(c => c.id));
                                }
                              }}
                              className={`h-4 w-4 focus:ring-opacity-50 border-gray-300 rounded ${
                                selectedChannel === 'whatsapp' ? 'text-green-600 focus:ring-green-500' :
                                selectedChannel === 'messenger' ? 'text-indigo-600 focus:ring-indigo-500' :
                                selectedChannel === 'sms' ? 'text-blue-600 focus:ring-blue-500' :
                                selectedChannel === 'voice' ? 'text-purple-600 focus:ring-purple-500' :
                                'text-gray-600 focus:ring-gray-500'
                              }`}
                            />
                            <span className="ml-2 text-xs font-medium text-gray-700">Select All</span>
                          </div>
                          <span className="text-xs text-gray-500">{filteredContacts.length} contacts</span>
                        </div>
                      
                        <div className="divide-y divide-gray-200">
                          {filteredContacts.map((contact) => (
                            <div
                              key={contact.id}
                              className={`py-2 px-3 flex items-center hover:${activeColors.bg} transition-all cursor-pointer ${
                                selectedContacts.includes(contact.id) ? activeColors.bg : ''
                              }`}
                              onClick={() => toggleContact(contact.id)}
                            >
                              <input
                                type="checkbox"
                                checked={selectedContacts.includes(contact.id)}
                                onChange={() => {}}
                                className={`h-4 w-4 focus:ring-opacity-50 border-gray-300 rounded ${
                                  selectedChannel === 'whatsapp' ? 'text-green-600 focus:ring-green-500' :
                                  selectedChannel === 'messenger' ? 'text-indigo-600 focus:ring-indigo-500' :
                                  selectedChannel === 'sms' ? 'text-blue-600 focus:ring-blue-500' :
                                  selectedChannel === 'voice' ? 'text-purple-600 focus:ring-purple-500' :
                                  'text-gray-600 focus:ring-gray-500'
                                }`}
                              />
                              <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                                <p className="text-xs text-gray-500 truncate">
                                  {contact.phone || contact.email}
                                </p>
                              </div>
                              <div className="ml-2 flex space-x-1">
                                {contact.channels.includes(selectedChannel) ? (
                                  <div className={`
                                    text-xs px-1.5 py-0.5 rounded-full 
                                    ${selectedChannel === 'sms' ? 'bg-blue-100 text-blue-700' : 
                                      selectedChannel === 'whatsapp' ? 'bg-green-100 text-green-700' : 
                                      selectedChannel === 'voice' ? 'bg-indigo-100 text-indigo-700' : 
                                      'bg-gray-100 text-gray-700'}
                                  `}>
                                    {selectedChannel}
                                  </div>
                                ) : (
                                  <div className="text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                                    No {selectedChannel}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : searchQuery || selectedTag ? (
                      <div className="py-8 text-center text-gray-500 bg-gray-50">
                        <div className="bg-white mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-sm">
                          <AlertCircle size={20} className="text-gray-400" />
                        </div>
                        <p>No contacts found matching your filters</p>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-gray-500 bg-gray-50">
                        <div className="bg-white mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-sm">
                          <Users size={20} className="text-gray-400" />
                        </div>
                        <p>No contacts available for {selectedChannel}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Contact upload option */}
                  <div className="flex justify-center">
                    <button
                      className={`text-xs ${activeColors.text} hover:text-opacity-80 flex items-center`}
                    >
                      <Upload size={12} className="mr-1" />
                      Import contacts from CSV
                    </button>
                  </div>
                </div>
                
                {/* Error/Success Messages */}
                {errorMessage && (
                  <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md shadow-sm animate-fadeIn">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{errorMessage}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {successMessage && (
                  <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-3 rounded-r-md shadow-sm animate-fadeIn">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">{successMessage}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer with action buttons */}
        <div className={`px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-${selectedChannel === 'whatsapp' ? 'green' : 
                         selectedChannel === 'messenger' ? 'indigo' : 
                         selectedChannel === 'sms' ? 'blue' : 
                         selectedChannel === 'voice' ? 'purple' : 'gray'}-50 flex justify-between items-center`}>
          <div className="flex items-center text-sm text-gray-600">
            <span className={`mr-2 ${activeColors.text}`}>
              {isScheduled 
                ? `Scheduled for ${format(scheduledTime, 'MMM d, yyyy h:mm a')}` 
                : isSequential
                  ? `Sequential delivery (${sequenceInterval}s interval)`
                  : 'Immediate delivery'}
            </span>
            {selectedContacts.length > 0 && (
              <span className={`${activeColors.bg} ${activeColors.text} text-xs font-medium px-2 py-0.5 rounded-full shadow-sm`}>
                {selectedContacts.length} recipient{selectedContacts.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 shadow-sm transition-all duration-200"
              disabled={isSending}
            >
              Cancel
            </button>
            
            <button
              onClick={sendMessages}
              className={`px-4 py-2 bg-gradient-to-r ${activeColors.gradient} text-white rounded-lg hover:opacity-90 flex items-center disabled:opacity-70 shadow-sm transition-all duration-200 hover:shadow`}
              disabled={!content.trim() || selectedContacts.length === 0 || isSending}
            >
              {isSending ? (
                <>
                  <RefreshCw size={18} className="mr-1.5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} className="mr-1.5" />
                  {isScheduled ? 'Schedule Messages' : isSequential ? 'Create Campaign' : 'Send Messages'}
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Template Save Modal */}
        {showTemplateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <Save size={18} className={activeColors.text} />
                <span className="ml-2">Save as Template</span>
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="Enter template name..."
                  className={`w-full border ${activeColors.border} rounded-lg px-3 py-2 focus:ring-2 focus:border-transparent shadow-sm ${
                    selectedChannel === 'whatsapp' ? 'focus:ring-green-500' :
                    selectedChannel === 'messenger' ? 'focus:ring-indigo-500' :
                    selectedChannel === 'sms' ? 'focus:ring-blue-500' :
                    selectedChannel === 'voice' ? 'focus:ring-purple-500' :
                    'focus:ring-gray-500'
                  }`}
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 shadow-sm"
                >
                  Cancel
                </button>
                
                <button
                  onClick={confirmSaveTemplate}
                  className={`px-4 py-2 bg-gradient-to-r ${activeColors.gradient} text-white rounded-lg hover:opacity-90 shadow-sm`}
                  disabled={!newTemplateName.trim()}
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Content Enhancement Modal */}
        <ContentEnhancementModal
          isOpen={isEnhancerOpen}
          onClose={() => setIsEnhancerOpen(false)}
          initialContent={content}
          contentType={selectedChannel === 'whatsapp' || selectedChannel === 'messenger' ? 'whatsapp' : 'sms'}
          onEnhanced={handleEnhancedContent}
        />
      </div>
    </div>
  );
};

export default ChannelMessagingHub;