import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Phone, UserCheck, Tag, VideoIcon, Sparkles, Facebook, Linkedin, FileBarChart, MessageSquare, ArrowRight, Check, Target, Calendar, Book, Laptop, UsersRound, MessageCircle, Smartphone } from 'lucide-react';
import ReferralImplementationGuide from './ReferralImplementationGuide';

interface ReferralMethodProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  popularityLevel?: 'high' | 'medium' | 'low';
  implementation: {
    difficulty: 'easy' | 'medium' | 'advanced';
    timeToResults: 'immediate' | 'short' | 'medium' | 'long';
    technicalRequirements: 'none' | 'low' | 'moderate' | 'high';
  };
  appContentType?: string; // Key name of content type in the App component
}

interface AllReferralMethodsProps {
  onSelectMethod?: (method: string) => void;
}

const AllReferralMethods: React.FC<AllReferralMethodsProps> = ({ onSelectMethod }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showImplementationGuide, setShowImplementationGuide] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const navigate = useNavigate();

  const categories = {
    'all': 'All Methods',
    'direct-outreach': 'Direct Outreach',
    'meetings': 'Meetings & Calls',
    'group-engagement': 'Group Engagement',
    'referral-programs': 'Referral Programs',
    'incentives': 'Incentive Structures',
    'followup': 'Follow-up Strategies'
  };

  const referralMethods: ReferralMethodProps[] = [
    {
      id: 'friends-family',
      title: 'Friends & Family Campaign',
      description: 'A 14-day messaging campaign to offer your services to friends and family, asking only for referrals.',
      icon: <Heart size={24} className="text-pink-500" />,
      category: 'direct-outreach',
      popularityLevel: 'high',
      implementation: {
        difficulty: 'easy',
        timeToResults: 'short',
        technicalRequirements: 'none'
      },
      appContentType: 'Friends and Family Campaign'
    },
    {
      id: 'phone-scripts',
      title: 'Phone Call Scripts',
      description: 'Effective scripts for requesting referrals during phone conversations with clients and contacts.',
      icon: <Phone size={24} className="text-blue-600" />,
      category: 'direct-outreach',
      popularityLevel: 'high',
      implementation: {
        difficulty: 'easy',
        timeToResults: 'immediate',
        technicalRequirements: 'none'
      },
      appContentType: 'Phone Call Scripts'
    },
    {
      id: 'face-to-face',
      title: 'Face-to-Face Meeting Guides',
      description: 'Comprehensive guides for requesting referrals during in-person meetings.',
      icon: <UserCheck size={24} className="text-purple-600" />,
      category: 'meetings',
      popularityLevel: 'medium',
      implementation: {
        difficulty: 'medium',
        timeToResults: 'immediate',
        technicalRequirements: 'none'
      },
      appContentType: 'Face-to-Face Meeting Guides'
    },
    {
      id: 'reward-programs',
      title: 'Referral Reward Programs',
      description: 'Create structured reward programs to incentivize clients and contacts to provide referrals.',
      icon: <Tag size={24} className="text-green-600" />,
      category: 'referral-programs',
      popularityLevel: 'high',
      implementation: {
        difficulty: 'medium',
        timeToResults: 'medium',
        technicalRequirements: 'low'
      },
      appContentType: 'Referral Reward Programs'
    },
    {
      id: 'zoom-meetings',
      title: 'Zoom Meeting Templates',
      description: 'Templates for generating referrals during virtual Zoom meetings with clients and contacts.',
      icon: <VideoIcon size={24} className="text-blue-500" />,
      category: 'meetings',
      popularityLevel: 'high',
      implementation: {
        difficulty: 'medium',
        timeToResults: 'immediate',
        technicalRequirements: 'low'
      },
      appContentType: 'Zoom Meeting Templates'
    },
    {
      id: 'lead-magnets',
      title: 'Referral Lead Magnets',
      description: 'Create valuable resources designed specifically to encourage and facilitate referrals.',
      icon: <Sparkles size={24} className="text-amber-600" />,
      category: 'referral-programs',
      popularityLevel: 'medium',
      implementation: {
        difficulty: 'medium',
        timeToResults: 'medium',
        technicalRequirements: 'low'
      },
      appContentType: 'Referral Lead Magnets'
    },
    {
      id: 'facebook-groups',
      title: 'Facebook Group Strategies',
      description: '14-day strategy for generating referrals through engagement in Facebook Groups.',
      icon: <Facebook size={24} className="text-blue-500" />,
      category: 'group-engagement',
      popularityLevel: 'medium',
      implementation: {
        difficulty: 'medium',
        timeToResults: 'medium',
        technicalRequirements: 'low'
      },
      appContentType: 'Facebook Group Strategies'
    },
    {
      id: 'linkedin-groups',
      title: 'LinkedIn Group Engagement',
      description: 'Strategies for generating referrals through strategic participation in LinkedIn Groups.',
      icon: <Linkedin size={24} className="text-blue-700" />,
      category: 'group-engagement',
      popularityLevel: 'medium',
      implementation: {
        difficulty: 'medium',
        timeToResults: 'medium',
        technicalRequirements: 'low'
      },
      appContentType: 'LinkedIn Group Engagement'
    },
    {
      id: 'tracking-systems',
      title: 'Referral Tracking Systems',
      description: 'Comprehensive systems for tracking and optimizing your referral generation efforts.',
      icon: <FileBarChart size={24} className="text-orange-600" />,
      category: 'referral-programs',
      popularityLevel: 'medium',
      implementation: {
        difficulty: 'advanced',
        timeToResults: 'long',
        technicalRequirements: 'moderate'
      },
      appContentType: 'Referral Tracking Systems'
    },
    {
      id: 'client-events',
      title: 'Client Appreciation Events',
      description: 'Plan and execute events that strengthen client relationships and generate referrals.',
      icon: <Calendar size={24} className="text-emerald-600" />,
      category: 'direct-outreach',
      popularityLevel: 'low',
      implementation: {
        difficulty: 'advanced',
        timeToResults: 'medium',
        technicalRequirements: 'low'
      },
      appContentType: 'Client Appreciation Events'
    },
    {
      id: 'video-conferences',
      title: 'Video Conference Templates',
      description: 'Templates for various video conference platforms focused on generating referrals.',
      icon: <VideoIcon size={24} className="text-red-500" />,
      category: 'meetings',
      popularityLevel: 'medium',
      implementation: {
        difficulty: 'medium',
        timeToResults: 'immediate',
        technicalRequirements: 'moderate'
      },
      appContentType: 'Video Conference Templates'
    },
    {
      id: 'skype-scripts',
      title: 'Skype Meeting Scripts',
      description: 'Effective scripts for requesting referrals during Skype calls and meetings.',
      icon: <MessageCircle size={24} className="text-blue-400" />,
      category: 'meetings',
      popularityLevel: 'low',
      implementation: {
        difficulty: 'easy',
        timeToResults: 'immediate',
        technicalRequirements: 'low'
      },
      appContentType: 'Skype Meeting Scripts'
    },
    {
      id: 'screen-sharing',
      title: 'Screen Sharing Presentations',
      description: 'Powerful presentations designed for screen sharing sessions to drive referrals.',
      icon: <Laptop size={24} className="text-indigo-600" />,
      category: 'meetings',
      popularityLevel: 'medium',
      implementation: {
        difficulty: 'medium',
        timeToResults: 'immediate',
        technicalRequirements: 'moderate'
      },
      appContentType: 'Screen Sharing Presentations'
    },
    {
      id: 'mlm-structures',
      title: 'Multi-Level Commission Structures',
      description: 'Advanced commission frameworks that incentivize ongoing referral generation.',
      icon: <UsersRound size={24} className="text-green-600" />,
      category: 'incentives',
      popularityLevel: 'low',
      implementation: {
        difficulty: 'advanced',
        timeToResults: 'long',
        technicalRequirements: 'high'
      },
      appContentType: 'Multi-Level Commission Structures'
    },
    {
      id: 'whatsapp-campaigns',
      title: 'WhatsApp Outreach Campaigns',
      description: '14-day WhatsApp messaging campaigns to systematically generate referrals.',
      icon: <Smartphone size={24} className="text-green-500" />,
      category: 'direct-outreach',
      popularityLevel: 'high',
      implementation: {
        difficulty: 'easy',
        timeToResults: 'short',
        technicalRequirements: 'none'
      },
      appContentType: 'WhatsApp Outreach Campaigns'
    },
    {
      id: 'followup-systems',
      title: 'Follow-up System Builder',
      description: 'Create systematic follow-up processes to nurture and convert referral leads.',
      icon: <MessageSquare size={24} className="text-purple-500" />,
      category: 'followup',
      popularityLevel: 'medium',
      implementation: {
        difficulty: 'medium',
        timeToResults: 'medium',
        technicalRequirements: 'low'
      },
      appContentType: 'Follow-up System Builder'
    }
  ];

  const handleMethodClick = (method: ReferralMethodProps) => {
    setSelectedMethod(method.title);
    setShowImplementationGuide(true);
  };

  const handleGenerateContent = (method: ReferralMethodProps) => {
    if (method.appContentType && onSelectMethod) {
      onSelectMethod(method.appContentType);
    } else if (method.appContentType) {
      // Navigate to app with selected content type
      navigate('/app', { state: { selectedContentType: method.appContentType } });
    }
  };

  const filteredMethods = activeCategory === 'all' 
    ? referralMethods 
    : referralMethods.filter(method => method.category === activeCategory);

  const getDifficultyBadge = (level: string) => {
    switch (level) {
      case 'easy':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Easy</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">Medium</span>;
      case 'advanced':
        return <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">Advanced</span>;
      default:
        return null;
    }
  };

  const getTimeToResultsBadge = (timeframe: string) => {
    switch (timeframe) {
      case 'immediate':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Immediate</span>;
      case 'short':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Days</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">Weeks</span>;
      case 'long':
        return <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">Months</span>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === key
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveCategory(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMethods.map((method) => (
          <div key={method.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-3">
                {method.icon}
                <h3 className="text-lg font-semibold ml-2 text-gray-800">{method.title}</h3>
                {method.popularityLevel === 'high' && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Popular</span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{method.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center text-sm text-gray-700">
                  <Target size={14} className="mr-1 text-gray-500" />
                  <span>Difficulty:</span>
                  <span className="ml-1">{getDifficultyBadge(method.implementation.difficulty)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Calendar size={14} className="mr-1 text-gray-500" />
                  <span>Results:</span>
                  <span className="ml-1">{getTimeToResultsBadge(method.implementation.timeToResults)}</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleMethodClick(method)}
                  className="flex-1 py-2 px-3 bg-green-50 hover:bg-green-100 text-green-700 rounded text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Book size={16} className="mr-1" />
                  Implementation Guide
                </button>
                <button
                  onClick={() => handleGenerateContent(method)}
                  className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Sparkles size={16} className="mr-1" />
                  Generate Content
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Implementation Guide Modal */}
      <ReferralImplementationGuide
        isOpen={showImplementationGuide}
        onClose={() => setShowImplementationGuide(false)}
        referralMethod={selectedMethod || ''}
      />
    </div>
  );
};

export default AllReferralMethods;