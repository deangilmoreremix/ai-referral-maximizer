import React, { useState } from 'react';
import { 
  X,
  ChevronDown,
  ChevronUp,
  Phone,
  MessageSquare,
  FileAudio,
  Smartphone,
  Video,
  Calendar,
  Users,
  Megaphone,
  Share2,
  UserCheck,
  Heart,
  Globe,
  Sparkles,
  Tag,
  Mail,
  BookOpen,
  MessageCircle,
  ArrowRight
} from 'lucide-react';

interface ServiceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (service: Service) => void;
  initialCategory?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const ServiceSelectorModal: React.FC<ServiceSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
  initialCategory = 'voice'
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string>(initialCategory);

  // Categories with services
  const serviceCategories: Category[] = [
    {
      id: 'voice',
      name: 'Voice Communication',
      description: 'Reach out with professional voice messages and calls',
      icon: <Phone size={24} className="text-blue-600" />
    },
    {
      id: 'text',
      name: 'Text Messaging',
      description: 'Connect via SMS and text messaging campaigns',
      icon: <Smartphone size={24} className="text-green-600" />
    },
    {
      id: 'messaging',
      name: 'Messaging Apps',
      description: 'Engage through popular messaging platforms',
      icon: <MessageSquare size={24} className="text-purple-600" />
    },
    {
      id: 'multi-channel',
      name: 'Multi-Channel',
      description: 'Coordinate communication across multiple platforms',
      icon: <Share2 size={24} className="text-indigo-600" />
    },
    {
      id: 'specialized',
      name: 'Specialized Services',
      description: 'Purpose-driven communication for specific needs',
      icon: <Sparkles size={24} className="text-amber-600" />
    }
  ];

  // All services grouped by category
  const services: Service[] = [
    // Voice Communication category
    {
      id: 'professional-voice-drops',
      name: 'Professional Voice Drops',
      description: 'Leave polished, pre-recorded voice messages for potential referrers',
      icon: <Phone size={20} className="text-blue-600" />,
      category: 'voice'
    },
    {
      id: 'voicemail-scripts',
      name: 'Voicemail Scripts',
      description: 'Create compelling voicemail messages that drive referrals',
      icon: <FileAudio size={20} className="text-blue-600" />,
      category: 'voice'
    },
    {
      id: 'phone-call-sequences',
      name: 'Phone Call Sequences',
      description: 'Structured call sequences to nurture referral relationships',
      icon: <Phone size={20} className="text-blue-600" />,
      category: 'voice'
    },
    {
      id: 'ivr-menu-scripts',
      name: 'IVR Menu Scripts',
      description: 'Clear and efficient automated phone system scripts',
      icon: <Phone size={20} className="text-blue-600" />,
      category: 'voice'
    },
    {
      id: 'conference-call-templates',
      name: 'Conference Call Templates',
      description: 'Scripts for multi-person calls to encourage referrals',
      icon: <Users size={20} className="text-blue-600" />,
      category: 'voice'
    },
    
    // Text Messaging category
    {
      id: 'sms-campaigns',
      name: 'SMS Campaigns',
      description: 'Multi-message SMS sequences for consistent referral outreach',
      icon: <Smartphone size={20} className="text-green-600" />,
      category: 'text'
    },
    {
      id: 'text-referral-requests',
      name: 'Text Referral Requests',
      description: 'Direct, concise text messages asking for referrals',
      icon: <MessageCircle size={20} className="text-green-600" />,
      category: 'text'
    },
    {
      id: 'appointment-reminders',
      name: 'Appointment Reminders',
      description: 'Text reminders that also encourage referrals',
      icon: <Calendar size={20} className="text-green-600" />,
      category: 'text'
    },
    {
      id: 'sms-surveys',
      name: 'SMS Surveys',
      description: 'Text-based surveys that can lead to referral opportunities',
      icon: <Smartphone size={20} className="text-green-600" />,
      category: 'text'
    },
    {
      id: 'sms-drip-sequences',
      name: 'SMS Drip Sequences',
      description: 'Timed text message series to nurture referral relationships',
      icon: <Smartphone size={20} className="text-green-600" />,
      category: 'text'
    },
    
    // Messaging Apps category
    {
      id: 'whatsapp-templates',
      name: 'WhatsApp Templates',
      description: 'Rich media templates for WhatsApp business messaging',
      icon: <MessageSquare size={20} className="text-green-500" />,
      category: 'messaging'
    },
    {
      id: 'facebook-messenger-scripts',
      name: 'Facebook Messenger Scripts',
      description: 'Engaging Messenger content to generate referrals',
      icon: <MessageSquare size={20} className="text-blue-500" />,
      category: 'messaging'
    },
    {
      id: 'telegram-outreach',
      name: 'Telegram Outreach',
      description: 'Telegram-specific messaging strategies for referrals',
      icon: <MessageSquare size={20} className="text-blue-400" />,
      category: 'messaging'
    },
    {
      id: 'instagram-dm-templates',
      name: 'Instagram DM Templates',
      description: 'Visual and text templates for Instagram direct messages',
      icon: <MessageSquare size={20} className="text-pink-500" />,
      category: 'messaging'
    },
    {
      id: 'linkedin-messaging',
      name: 'LinkedIn Messaging',
      description: 'Professional messaging templates for LinkedIn outreach',
      icon: <MessageSquare size={20} className="text-blue-700" />,
      category: 'messaging'
    },
    
    // Multi-Channel category
    {
      id: 'voice-sms-campaigns',
      name: 'Voice + SMS Campaigns',
      description: 'Integrated campaigns using both voice and text messaging',
      icon: <Share2 size={20} className="text-indigo-600" />,
      category: 'multi-channel'
    },
    {
      id: 'cross-platform-sequences',
      name: 'Cross-Platform Sequences',
      description: 'Coordinated messaging across multiple communication channels',
      icon: <Share2 size={20} className="text-indigo-600" />,
      category: 'multi-channel'
    },
    {
      id: 'sequential-followups',
      name: 'Sequential Follow-ups',
      description: 'Timed follow-up sequences using different channels',
      icon: <Share2 size={20} className="text-indigo-600" />,
      category: 'multi-channel'
    },
    {
      id: 'timed-campaign-series',
      name: 'Timed Campaign Series',
      description: 'Scheduled multi-channel campaigns for maximum impact',
      icon: <Calendar size={20} className="text-indigo-600" />,
      category: 'multi-channel'
    },
    {
      id: 'event-triggered-messages',
      name: 'Event-triggered Messages',
      description: 'Messages sent automatically based on specific triggers',
      icon: <Share2 size={20} className="text-indigo-600" />,
      category: 'multi-channel'
    },
    
    // Specialized Services category
    {
      id: 'referral-reward-messages',
      name: 'Referral Reward Messages',
      description: 'Communications highlighting incentives for referrals',
      icon: <Tag size={20} className="text-amber-600" />,
      category: 'specialized'
    },
    {
      id: 'video-meeting-invitations',
      name: 'Video Meeting Invitations',
      description: 'Messages that invite contacts to video calls',
      icon: <Video size={20} className="text-amber-600" />,
      category: 'specialized'
    },
    {
      id: 'client-appreciation-outreach',
      name: 'Client Appreciation Outreach',
      description: 'Thank you messages that also encourage referrals',
      icon: <Heart size={20} className="text-amber-600" />,
      category: 'specialized'
    },
    {
      id: 'educational-content-delivery',
      name: 'Educational Content Delivery',
      description: 'Value-added content that promotes referrals',
      icon: <BookOpen size={20} className="text-amber-600" />,
      category: 'specialized'
    },
    {
      id: 'testimonial-request-templates',
      name: 'Testimonial Request Templates',
      description: 'Messages requesting testimonials that can lead to referrals',
      icon: <UserCheck size={20} className="text-amber-600" />,
      category: 'specialized'
    }
  ];

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? '' : categoryId);
  };

  // Filter services by category
  const getServicesForCategory = (categoryId: string) => {
    return services.filter(service => service.category === categoryId);
  };

  // Handle service selection
  const handleServiceSelect = (service: Service) => {
    onSelectService(service);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Sparkles size={22} className="text-blue-600 mr-2" />
            Select a Communication Service
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-gray-600 mb-6">
            Choose from our wide range of communication services to create the perfect referral outreach strategy.
          </p>
          
          {/* Service Categories Accordion */}
          <div className="space-y-4">
            {serviceCategories.map(category => (
              <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Category Header */}
                <div 
                  className={`flex justify-between items-center p-4 cursor-pointer ${
                    expandedCategory === category.id ? 'bg-blue-50 border-b border-gray-200' : 'bg-white'
                  }`}
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                  </div>
                  <div>
                    {expandedCategory === category.id ? (
                      <ChevronUp size={20} className="text-blue-600" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-400" />
                    )}
                  </div>
                </div>
                
                {/* Category Content */}
                {expandedCategory === category.id && (
                  <div className="p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getServicesForCategory(category.id).map(service => (
                        <div 
                          key={service.id} 
                          className="bg-white p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
                          onClick={() => handleServiceSelect(service)}
                        >
                          <div className="flex items-start">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                              {service.icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm">{service.name}</h4>
                              <p className="text-xs text-gray-500">{service.description}</p>
                              <div className="flex items-center mt-2 text-blue-600 hover:text-blue-800 text-xs">
                                <span>Select service</span>
                                <ArrowRight size={12} className="ml-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Select a service to continue
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelectorModal;