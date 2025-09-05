import React, { useState, useEffect } from 'react';
import { 
  Send, MessageSquare, RefreshCw, X, Search, CheckCircle, AlertCircle, 
  Upload, Save, Filter, Download, ExternalLink, Edit, Sparkles, Facebook,
  Instagram, Twitter, Linkedin, Globe, Calendar, ChevronDown, Image, Link, AtSign, Users
} from 'lucide-react';
import { format } from 'date-fns';
import { useCommunication } from '../contexts/CommunicationContext';
import ContentEnhancementModal from './ContentEnhancementModal';

// Define social media channel types
type SocialMediaChannel = 'facebook' | 'instagram' | 'twitter' | 'linkedin';

interface SocialMediaMessagingHubProps {
  initialContent?: string;
  onClose: () => void;
  onSuccess?: (result: any) => void;
}

const SocialMediaMessagingHub: React.FC<SocialMediaMessagingHubProps> = ({
  initialContent = '',
  onClose,
  onSuccess
}) => {
  // Communication context
  const {
    contacts,
    selectedContacts,
    setSelectedContacts,
    sendMessage,
    createCampaign
  } = useCommunication();

  // UI state for common messaging functionality
  const [content, setContent] = useState(initialContent);
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
  const [isEnhancerOpen, setIsEnhancerOpen] = useState(false);

  // Social media specific state
  const [selectedChannel, setSelectedChannel] = useState<SocialMediaChannel>('facebook');
  const [includeImage, setIncludeImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [includeLink, setIncludeLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState('');
  const [mentions, setMentions] = useState<string[]>([]);
  const [newMention, setNewMention] = useState('');

  // Audience selection state
  const [audienceType, setAudienceType] = useState<'followers' | 'public' | 'custom'>('followers');

  // Channel availability (would come from the API in a real implementation)
  const availableSocialChannels: Record<SocialMediaChannel, boolean> = {
    facebook: true,
    instagram: true,
    twitter: true,
    linkedin: true
  };

  // Get unique tags from all contacts
  const allTags = Array.from(
    new Set(
      contacts.flatMap(contact => contact.tags)
    )
  ).sort();

  // Filter contacts based on search query and selected tag
  const filteredContacts = contacts.filter(contact => {
    // Filter by search query
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
    
    // Filter by selected tag
    if (selectedTag && !contact.tags.includes(selectedTag)) {
      return false;
    }
    
    return true;
  });

  // Toggle tag filter
  const toggleTagFilter = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
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

  // Add a hashtag
  const addHashtag = () => {
    if (newHashtag.trim() && !hashtags.includes(newHashtag.trim())) {
      setHashtags([...hashtags, newHashtag.trim()]);
      setNewHashtag('');
    }
  };

  // Remove a hashtag
  const removeHashtag = (hashtag: string) => {
    setHashtags(hashtags.filter(h => h !== hashtag));
  };

  // Add a mention
  const addMention = () => {
    if (newMention.trim() && !mentions.includes(newMention.trim())) {
      setMentions([...mentions, newMention.trim()]);
      setNewMention('');
    }
  };

  // Remove a mention
  const removeMention = (mention: string) => {
    setMentions(mentions.filter(m => m !== mention));
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

  // Get color classes based on selected channel
  const getChannelColorClasses = (): {bg: string, text: string, border: string, gradient: string} => {
    switch (selectedChannel) {
      case 'facebook':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          gradient: 'from-blue-600 to-blue-500'
        };
      case 'instagram':
        return {
          bg: 'bg-pink-50',
          text: 'text-pink-700',
          border: 'border-pink-200',
          gradient: 'from-pink-600 via-purple-600 to-orange-600'
        };
      case 'twitter':
        return {
          bg: 'bg-sky-50',
          text: 'text-sky-700',
          border: 'border-sky-200',
          gradient: 'from-sky-500 to-sky-400'
        };
      case 'linkedin':
        return {
          bg: 'bg-indigo-50',
          text: 'text-indigo-700',
          border: 'border-indigo-200',
          gradient: 'from-indigo-600 to-blue-600'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          gradient: 'from-gray-500 to-gray-400'
        };
    }
  };

  // Get social media channel icon
  const getChannelIcon = (channel: SocialMediaChannel) => {
    switch (channel) {
      case 'facebook': return <Facebook size={18} className="text-blue-600" />;
      case 'instagram': return <Instagram size={18} className="text-pink-600" />;
      case 'twitter': return <Twitter size={18} className="text-sky-500" />;
      case 'linkedin': return <Linkedin size={18} className="text-indigo-600" />;
    }
  };

  // Format channel name for display
  const formatChannelName = (channel: SocialMediaChannel): string => {
    switch (channel) {
      case 'facebook': return 'Facebook';
      case 'instagram': return 'Instagram';
      case 'twitter': return 'Twitter';
      case 'linkedin': return 'LinkedIn';
      default: return channel;
    }
  };

  // Send post to social media 
  const sendSocialPost = async () => {
    if (!content.trim()) {
      setErrorMessage('Please enter post content');
      return;
    }
    
    try {
      setIsSending(true);
      setErrorMessage(null);
      
      // Prepare post data
      const postData = {
        content,
        channel: selectedChannel,
        imageUrl: includeImage ? imageUrl : undefined,
        linkUrl: includeLink ? linkUrl : undefined,
        linkTitle: includeLink ? linkTitle : undefined,
        hashtags: hashtags.length > 0 ? hashtags : undefined,
        mentions: mentions.length > 0 ? mentions : undefined,
        audienceType,
        scheduledTime: isScheduled ? scheduledTime.toISOString() : undefined
      };
      
      console.log('Sending social media post:', postData);
      
      // In a real implementation, this would call the Unipile API
      // For this example, we'll just simulate a successful post
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage(`Post ${isScheduled ? 'scheduled' : 'published'} to ${formatChannelName(selectedChannel)} successfully`);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess({ success: true, ...postData });
      }
      
      // Auto-close after success
      setTimeout(() => onClose(), 3000);
      
    } catch (error: any) {
      console.error('Error sending social media post:', error);
      setErrorMessage(`Error sending post: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };
  
  // Maximum character count by platform
  const getMaxCharacters = (): number => {
    switch (selectedChannel) {
      case 'twitter': return 280;
      case 'linkedin': return 3000;
      case 'facebook': return 63206;
      case 'instagram': return 2200;
      default: return 2000;
    }
  };
  
  // Get active channel color classes
  const activeColors = getChannelColorClasses();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className={`px-6 py-4 border-b ${activeColors.border} bg-gradient-to-r ${activeColors.gradient} flex justify-between items-center`}>
          <div className="flex items-center">
            <div className="p-2 bg-white/20 rounded-lg mr-3 shadow-sm">
              <Globe size={18} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Social Media Messaging</h2>
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
              {/* Channel selection and post configuration */}
              <div className="md:col-span-1">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Channel Selection</h3>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {(Object.entries(availableSocialChannels) as [SocialMediaChannel, boolean][]).map(([channel, isAvailable]) => {
                    // Get color classes for this channel
                    const colors = (channel === 'facebook') ? {
                      bg: 'bg-blue-50',
                      text: 'text-blue-700',
                      border: 'border-blue-200',
                      iconBg: 'bg-blue-500'
                    } : (channel === 'instagram') ? {
                      bg: 'bg-pink-50',
                      text: 'text-pink-700',
                      border: 'border-pink-200',
                      iconBg: 'bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500'
                    } : (channel === 'twitter') ? {
                      bg: 'bg-sky-50',
                      text: 'text-sky-700',
                      border: 'border-sky-200',
                      iconBg: 'bg-sky-400'
                    } : { // linkedin
                      bg: 'bg-indigo-50',
                      text: 'text-indigo-700',
                      border: 'border-indigo-200',
                      iconBg: 'bg-indigo-600'
                    };
                    
                    return (
                      <div
                        key={channel}
                        className={`
                          border p-2.5 rounded-lg flex items-center transition-all
                          ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}
                          ${selectedChannel === channel 
                            ? `${colors.border} ${colors.bg} shadow-sm` 
                            : 'border-gray-200 hover:bg-gray-50'}
                        `}
                        onClick={() => isAvailable && setSelectedChannel(channel)}
                      >
                        <div className={`
                          w-8 h-8 rounded-full mr-2 flex items-center justify-center text-white
                          ${selectedChannel === channel 
                            ? colors.iconBg
                            : 'bg-gray-200'}
                        `}>
                          {getChannelIcon(channel)}
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${selectedChannel === channel ? colors.text : 'text-gray-800'}`}>
                            {formatChannelName(channel)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {isAvailable ? 'Available' : 'Not available'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Post configuration */}
                <div className={`space-y-4 mb-6 ${activeColors.bg} p-4 rounded-lg border ${activeColors.border}`}>
                  <h3 className="text-sm font-medium text-gray-800 flex items-center">
                    <span className="p-1 bg-white/60 rounded mr-2">
                      <Edit size={14} className={activeColors.text} />
                    </span>
                    Post Configuration
                  </h3>
                  
                  {/* Media options */}
                  <div className="space-y-3">
                    {/* Image attachment */}
                    <div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="include-image"
                          checked={includeImage}
                          onChange={(e) => setIncludeImage(e.target.checked)}
                          className={`h-4 w-4 focus:ring-opacity-50 border-gray-300 rounded
                            ${selectedChannel === 'facebook' ? 'text-blue-600 focus:ring-blue-500' :
                            selectedChannel === 'instagram' ? 'text-pink-600 focus:ring-pink-500' :
                            selectedChannel === 'twitter' ? 'text-sky-600 focus:ring-sky-500' :
                            'text-indigo-600 focus:ring-indigo-500'}`}
                        />
                        <label htmlFor="include-image" className="text-sm text-gray-800">Include image</label>
                      </div>
                      
                      {includeImage && (
                        <div className="mt-2 pl-6">
                          <label className="block text-xs text-gray-700 mb-1">Image URL</label>
                          <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className={`border ${activeColors.border} rounded-md px-3 py-1.5 text-sm w-full shadow-sm focus:ring-2 focus:border-transparent 
                              ${selectedChannel === 'facebook' ? 'focus:ring-blue-500' :
                              selectedChannel === 'instagram' ? 'focus:ring-pink-500' :
                              selectedChannel === 'twitter' ? 'focus:ring-sky-500' :
                              'focus:ring-indigo-500'}`}
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Link attachment */}
                    <div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="include-link"
                          checked={includeLink}
                          onChange={(e) => setIncludeLink(e.target.checked)}
                          className={`h-4 w-4 focus:ring-opacity-50 border-gray-300 rounded
                            ${selectedChannel === 'facebook' ? 'text-blue-600 focus:ring-blue-500' :
                            selectedChannel === 'instagram' ? 'text-pink-600 focus:ring-pink-500' :
                            selectedChannel === 'twitter' ? 'text-sky-600 focus:ring-sky-500' :
                            'text-indigo-600 focus:ring-indigo-500'}`}
                        />
                        <label htmlFor="include-link" className="text-sm text-gray-800">Include link</label>
                      </div>
                      
                      {includeLink && (
                        <div className="mt-2 pl-6 space-y-2">
                          <div>
                            <label className="block text-xs text-gray-700 mb-1">URL</label>
                            <input
                              type="text"
                              value={linkUrl}
                              onChange={(e) => setLinkUrl(e.target.value)}
                              placeholder="https://example.com/page"
                              className={`border ${activeColors.border} rounded-md px-3 py-1.5 text-sm w-full shadow-sm focus:ring-2 focus:border-transparent 
                                ${selectedChannel === 'facebook' ? 'focus:ring-blue-500' :
                                selectedChannel === 'instagram' ? 'focus:ring-pink-500' :
                                selectedChannel === 'twitter' ? 'focus:ring-sky-500' :
                                'focus:ring-indigo-500'}`}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs text-gray-700 mb-1">Link Title (optional)</label>
                            <input
                              type="text"
                              value={linkTitle}
                              onChange={(e) => setLinkTitle(e.target.value)}
                              placeholder="Check out our latest post"
                              className={`border ${activeColors.border} rounded-md px-3 py-1.5 text-sm w-full shadow-sm focus:ring-2 focus:border-transparent 
                                ${selectedChannel === 'facebook' ? 'focus:ring-blue-500' :
                                selectedChannel === 'instagram' ? 'focus:ring-pink-500' :
                                selectedChannel === 'twitter' ? 'focus:ring-sky-500' :
                                'focus:ring-indigo-500'}`}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Hashtags */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-800 flex items-center">
                      <span className="p-1 bg-white/60 rounded mr-2">
                        <span className={`text-lg font-bold ${activeColors.text}`}>#</span>
                      </span>
                      Hashtags
                    </h4>
                    <div className="flex gap-1 mb-2 flex-wrap bg-white/70 p-2 rounded-lg">
                      {hashtags.map(hashtag => (
                        <div key={hashtag} className={`${activeColors.bg} ${activeColors.text} text-xs px-2 py-1 rounded-full flex items-center border ${activeColors.border} shadow-sm`}>
                          #{hashtag}
                          <button 
                            onClick={() => removeHashtag(hashtag)} 
                            className={`ml-1 ${activeColors.text} hover:opacity-80 bg-white/50 rounded-full p-0.5`}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      {hashtags.length === 0 && (
                        <div className="text-xs text-gray-500 py-1 px-2">No hashtags added</div>
                      )}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        value={newHashtag}
                        onChange={(e) => setNewHashtag(e.target.value.replace(/\s+/g, ''))}
                        placeholder="Add hashtag (without #)"
                        className={`border ${activeColors.border} rounded-l-md px-3 py-1.5 text-sm flex-1 focus:ring-2 focus:border-transparent shadow-sm
                          ${selectedChannel === 'facebook' ? 'focus:ring-blue-500' :
                          selectedChannel === 'instagram' ? 'focus:ring-pink-500' :
                          selectedChannel === 'twitter' ? 'focus:ring-sky-500' :
                          'focus:ring-indigo-500'}`}
                      />
                      <button
                        onClick={addHashtag}
                        disabled={!newHashtag.trim()}
                        className={`px-3 py-1.5 bg-gradient-to-r ${activeColors.gradient} text-white rounded-r-md disabled:opacity-50 shadow-sm`}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  
                  {/* Mentions */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-800 flex items-center">
                      <span className="p-1 bg-white/60 rounded mr-2">
                        <AtSign size={14} className={activeColors.text} />
                      </span>
                      Mentions
                    </h4>
                    <div className="flex gap-1 mb-2 flex-wrap bg-white/70 p-2 rounded-lg">
                      {mentions.map(mention => (
                        <div key={mention} className={`bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full flex items-center border border-green-200 shadow-sm`}>
                          @{mention}
                          <button 
                            onClick={() => removeMention(mention)} 
                            className="ml-1 text-green-600 hover:text-green-800 bg-white/50 rounded-full p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      {mentions.length === 0 && (
                        <div className="text-xs text-gray-500 py-1 px-2">No mentions added</div>
                      )}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        value={newMention}
                        onChange={(e) => setNewMention(e.target.value.replace(/\s+/g, ''))}
                        placeholder="Add mention (without @)"
                        className={`border border-green-200 rounded-l-md px-3 py-1.5 text-sm flex-1 focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm`}
                      />
                      <button
                        onClick={addMention}
                        disabled={!newMention.trim()}
                        className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-r-md disabled:opacity-50 shadow-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  
                  {/* Audience selection */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-800 flex items-center">
                      <span className="p-1 bg-white/60 rounded mr-2">
                        <Users size={14} className={activeColors.text} />
                      </span>
                      Audience
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'followers', label: 'Followers' },
                        { value: 'public', label: 'Public' },
                        { value: 'custom', label: 'Custom' }
                      ].map((option) => (
                        <div
                          key={option.value}
                          className={`border rounded-lg p-3 text-center cursor-pointer transition-all hover:shadow-sm
                            ${audienceType === option.value as any 
                              ? `${activeColors.border} ${activeColors.bg} shadow-sm` 
                              : 'border-gray-200 hover:border-gray-300'}
                          `}
                          onClick={() => setAudienceType(option.value as any)}
                        >
                          <div className={`text-sm font-medium ${audienceType === option.value as any ? activeColors.text : 'text-gray-700'}`}>
                            {option.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Scheduling */}
                  <div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="scheduled-post"
                        checked={isScheduled}
                        onChange={(e) => setIsScheduled(e.target.checked)}
                        className={`h-4 w-4 focus:ring-opacity-50 border-gray-300 rounded
                          ${selectedChannel === 'facebook' ? 'text-blue-600 focus:ring-blue-500' :
                          selectedChannel === 'instagram' ? 'text-pink-600 focus:ring-pink-500' :
                          selectedChannel === 'twitter' ? 'text-sky-600 focus:ring-sky-500' :
                          'text-indigo-600 focus:ring-indigo-500'}`}
                      />
                      <label htmlFor="scheduled-post" className="text-sm text-gray-800">Schedule for later</label>
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
                          className={`border ${activeColors.border} rounded-md px-2 py-1.5 text-sm w-full shadow-sm focus:ring-2 focus:border-transparent 
                            ${selectedChannel === 'facebook' ? 'focus:ring-blue-500' :
                            selectedChannel === 'instagram' ? 'focus:ring-pink-500' :
                            selectedChannel === 'twitter' ? 'focus:ring-sky-500' :
                            'focus:ring-indigo-500'}`}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Campaign name for scheduled posts */}
                  {isScheduled && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Campaign Name
                      </label>
                      <input
                        type="text"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="Enter campaign name..."
                        className={`border ${activeColors.border} rounded-md px-3 py-1.5 text-sm w-full shadow-sm focus:ring-2 focus:border-transparent 
                          ${selectedChannel === 'facebook' ? 'focus:ring-blue-500' :
                          selectedChannel === 'instagram' ? 'focus:ring-pink-500' :
                          selectedChannel === 'twitter' ? 'focus:ring-sky-500' :
                          'focus:ring-indigo-500'}`}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Post composer and recipients */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-gray-700">Post Composer</h3>
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
                    placeholder={`What would you like to share on ${formatChannelName(selectedChannel)}?`}
                    maxLength={getMaxCharacters()}
                    className={`w-full h-40 border ${activeColors.border} rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:border-transparent
                      ${selectedChannel === 'facebook' ? 'focus:ring-blue-500' :
                      selectedChannel === 'instagram' ? 'focus:ring-pink-500' :
                      selectedChannel === 'twitter' ? 'focus:ring-sky-500' :
                      'focus:ring-indigo-500'}`}
                    disabled={isSending}
                  ></textarea>
                  
                  <div className={`flex justify-between mt-2 text-xs ${activeColors.text}`}>
                    <div>
                      {content.length} / {getMaxCharacters()} characters
                    </div>
                    <div className="flex gap-2">
                      {hashtags.length > 0 && <div>Hashtags: {hashtags.length}</div>}
                      {mentions.length > 0 && <div>Mentions: {mentions.length}</div>}
                    </div>
                  </div>
                </div>
                
                {/* Post preview section */}
                {(includeImage || includeLink || hashtags.length > 0 || mentions.length > 0) && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <span className="p-1 bg-white/60 rounded mr-2 border border-gray-200">
                        <Globe size={14} className={activeColors.text} />
                      </span>
                      Post Preview
                    </h3>
                    <div className={`border border-gray-200 rounded-xl p-4 bg-white shadow-sm`}>
                      <div className="flex items-start">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white mr-3
                          ${selectedChannel === 'facebook' ? 'bg-blue-600' :
                          selectedChannel === 'instagram' ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500' :
                          selectedChannel === 'twitter' ? 'bg-sky-500' :
                          'bg-indigo-600'}`}
                        >
                          {getChannelIcon(selectedChannel)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">Your Page</div>
                          <div className="text-xs text-gray-500">
                            {isScheduled ? `Scheduled for ${format(scheduledTime, 'MMM d, yyyy h:mm a')}` : 'Now'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm">
                        {content || <span className="text-gray-400 italic">Your post content will appear here</span>}
                      </div>
                      
                      {includeImage && imageUrl && (
                        <div className="mt-3 border border-gray-200 rounded-lg bg-gray-100 h-40 flex items-center justify-center overflow-hidden">
                          {imageUrl ? (
                            <img 
                              src={imageUrl} 
                              alt="Post image" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // If image fails to load, show placeholder
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = `<div class="flex flex-col items-center justify-center text-gray-400">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                  <span class="text-sm">Image preview not available</span>
                                </div>`;
                              }}
                            />
                          ) : (
                            <div className="flex flex-col items-center text-gray-400">
                              <Image size={24} className="mb-2" />
                              <span className="text-sm">Image Preview</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {includeLink && linkUrl && (
                        <div className="mt-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <div className="flex items-center text-blue-600 text-sm">
                            <Link size={14} className="mr-2" />
                            {linkTitle || linkUrl}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{linkUrl}</div>
                        </div>
                      )}
                      
                      {(hashtags.length > 0 || mentions.length > 0) && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {hashtags.map(hashtag => (
                            <span key={hashtag} className="text-xs text-blue-600">#{hashtag}</span>
                          ))}
                          {mentions.map(mention => (
                            <span key={mention} className="text-xs text-green-600">@{mention}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Recipients section for custom audience */}
                {audienceType === 'custom' && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-700 flex items-center">
                        <span className="p-1 bg-white/60 rounded mr-2 border border-gray-200">
                          <Users size={14} className={activeColors.text} />
                        </span>
                        Select Recipients
                      </h3>
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
                            className={`text-xs px-2 py-1 rounded-full cursor-pointer transition-colors ${
                              selectedTag === tag
                                ? `${activeColors.text} bg-white shadow-sm border ${activeColors.border}`
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => toggleTagFilter(tag)}
                          >
                            {tag}
                            {selectedTag === tag && (
                              <CheckCircle size={12} className="inline ml-1" />
                            )}
                          </div>
                        ))}
                        {selectedTag && (
                          <button
                            onClick={() => setSelectedTag(null)}
                            className={`text-xs px-2 py-1 ${activeColors.text} hover:opacity-80`}
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
                        className={`w-full pl-9 pr-3 py-2 border ${activeColors.border} rounded-lg text-sm focus:ring-2 focus:border-transparent shadow-sm 
                          ${selectedChannel === 'facebook' ? 'focus:ring-blue-500' :
                          selectedChannel === 'instagram' ? 'focus:ring-pink-500' :
                          selectedChannel === 'twitter' ? 'focus:ring-sky-500' :
                          'focus:ring-indigo-500'}`}
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
                                className={`h-4 w-4 focus:ring-opacity-50 border-gray-300 rounded
                                  ${selectedChannel === 'facebook' ? 'text-blue-600 focus:ring-blue-500' :
                                  selectedChannel === 'instagram' ? 'text-pink-600 focus:ring-pink-500' :
                                  selectedChannel === 'twitter' ? 'text-sky-600 focus:ring-sky-500' :
                                  'text-indigo-600 focus:ring-indigo-500'}`}
                              />
                              <span className="ml-2 text-xs font-medium text-gray-700">Select All</span>
                            </div>
                            <span className="text-xs text-gray-500">{filteredContacts.length} contacts</span>
                          </div>
                        
                          <div className="divide-y divide-gray-200">
                            {filteredContacts.map((contact) => (
                              <div
                                key={contact.id}
                                className={`py-2 px-3 flex items-center hover:${activeColors.bg} transition-colors cursor-pointer ${
                                  selectedContacts.includes(contact.id) ? activeColors.bg : ''
                                }`}
                                onClick={() => toggleContact(contact.id)}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedContacts.includes(contact.id)}
                                  onChange={() => {}}
                                  className={`h-4 w-4 focus:ring-opacity-50 border-gray-300 rounded
                                    ${selectedChannel === 'facebook' ? 'text-blue-600 focus:ring-blue-500' :
                                    selectedChannel === 'instagram' ? 'text-pink-600 focus:ring-pink-500' :
                                    selectedChannel === 'twitter' ? 'text-sky-600 focus:ring-sky-500' :
                                    'text-indigo-600 focus:ring-indigo-500'}`}
                                />
                                <div className="ml-3 flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {contact.email || contact.phone}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="py-8 text-center text-gray-500 bg-gray-50">
                          <div className="bg-white mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-sm">
                            <AlertCircle size={20} className="text-gray-400" />
                          </div>
                          <p>{searchQuery || selectedTag 
                            ? "No contacts found matching your filters"
                            : "No contacts available for selection"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
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
        <div className={`px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-${
          selectedChannel === 'facebook' ? 'blue' : 
          selectedChannel === 'instagram' ? 'pink' :
          selectedChannel === 'twitter' ? 'sky' : 'indigo'}-50 flex justify-between items-center`}
        >
          <div className="flex items-center text-sm text-gray-600">
            <span className={`mr-2 ${activeColors.text}`}>
              {isScheduled 
                ? `Scheduled for ${format(scheduledTime, 'MMM d, yyyy h:mm a')}` 
                : `Posting to ${formatChannelName(selectedChannel)}`}
            </span>
            {audienceType === 'custom' && selectedContacts.length > 0 && (
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
              onClick={sendSocialPost}
              className={`px-4 py-2 bg-gradient-to-r ${activeColors.gradient} text-white rounded-lg hover:opacity-90 flex items-center shadow-sm transition-all duration-200 hover:shadow disabled:opacity-70 disabled:hover:shadow-none`}
              disabled={!content.trim() || isSending || (audienceType === 'custom' && selectedContacts.length === 0)}
            >
              {isSending ? (
                <>
                  <RefreshCw size={18} className="mr-1.5 animate-spin" />
                  {isScheduled ? 'Scheduling...' : 'Publishing...'}
                </>
              ) : (
                <>
                  <Send size={18} className="mr-1.5" />
                  {isScheduled ? 'Schedule Post' : 'Publish Now'}
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Content Enhancement Modal */}
        <ContentEnhancementModal
          isOpen={isEnhancerOpen}
          onClose={() => setIsEnhancerOpen(false)}
          initialContent={content}
          contentType="whatsapp" // Use whatsapp as it's closest to social media in tone
          onEnhanced={handleEnhancedContent}
        />
      </div>
    </div>
  );
};

export default SocialMediaMessagingHub;