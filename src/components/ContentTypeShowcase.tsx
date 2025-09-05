import React, { useState, useEffect } from 'react';
import { Heart, Phone, UserCheck, Tag, VideoIcon, Sparkles, Facebook, Linkedin, FileBarChart, MessageSquare, ExternalLink, Trash2, CheckCircle, ChevronDown, ChevronUp, Calendar, Clock, Download, X, Info, TableProperties, Gift, Share2, Smartphone, Users, UsersRound, Volume2, Laptop, Target } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface ContentType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  sampleImageUrl: string;
  category: string;
  formats: string[];
  popularity?: string;
  creationTime?: string;
  features?: string[];
  usage?: string;
  successRate?: string;
  implementation?: string;
  conversionRate?: string;
  appContentType?: string; // The exact content type key used in the app
}

const ContentTypeShowcase: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const contentTypes: ContentType[] = [
    {
      id: 'friends-family',
      title: 'Friends & Family Campaign',
      description: 'A 14-day messaging campaign to offer your services to friends and family, asking only for referrals.',
      icon: <Heart size={20} className="text-pink-500" />,
      sampleImageUrl: "https://images.unsplash.com/photo-1506836467174-27f1042aa48c?auto=format&fit=crop&w=800&q=80",
      category: 'direct-outreach',
      formats: ['pdf', 'docx'],
      popularity: 'High',
      creationTime: '45 seconds',
      successRate: '42%',
      implementation: 'Easy',
      features: [
        'Day-by-day messaging plan',
        'Multi-channel approach (text, messaging apps, calls)',
        'Built-in relationship nurturing sequence',
        'Non-pushy, natural conversation templates'
      ],
      usage: 'Perfect for new businesses looking to build an initial client base through trusted relationships. The campaign gradually builds to referral requests over 14 days without pressuring your personal connections.',
      appContentType: 'Friends and Family Campaign'
    },
    {
      id: 'phone-scripts',
      title: 'Phone Call Scripts',
      description: 'Professional scripts for phone calls and voicemails that effectively request referrals.',
      icon: <Phone size={20} className="text-blue-600" />,
      sampleImageUrl: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=800&q=80",
      category: 'direct-outreach',
      formats: ['pdf', 'docx'],
      popularity: 'Very High',
      creationTime: '30 seconds',
      conversionRate: '35%',
      implementation: 'Easy',
      features: [
        'Multiple script variations for different relationship types',
        'Voicemail-specific templates',
        'Follow-up call scripts',
        'Objection handling guides'
      ],
      usage: 'Use these scripts when making calls to past clients, colleagues, or network connections. The natural-sounding, conversational approach makes asking for referrals comfortable and effective.',
      appContentType: 'Phone Call Scripts'
    },
    {
      id: 'face-to-face',
      title: 'Face-to-Face Meeting Guides',
      description: 'Comprehensive guides for requesting referrals during in-person meetings.',
      icon: <UserCheck size={20} className="text-purple-600" />,
      sampleImageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
      category: 'meetings',
      formats: ['pdf', 'pptx', 'docx'],
      popularity: 'High',
      creationTime: '60 seconds',
      successRate: '67%',
      implementation: 'Medium',
      features: [
        'Natural conversation transitions to referrals',
        'Timing guidance for optimal moments',
        'Body language and delivery tips',
        'Response handling frameworks'
      ],
      usage: 'The highest-converting referral approach when implemented correctly. Perfect for client review meetings, networking events, and business lunches where you can naturally introduce referral requests.',
      appContentType: 'Face-to-Face Meeting Guides'
    },
    {
      id: 'whatsapp-campaigns',
      title: 'WhatsApp Outreach Campaigns',
      description: '14-day WhatsApp messaging campaigns to systematically generate referrals.',
      icon: <Smartphone size={20} className="text-green-500" />,
      sampleImageUrl: "https://images.unsplash.com/photo-1556305078-869a53def3f4?auto=format&fit=crop&w=800&q=80",
      category: 'direct-outreach',
      formats: ['pdf', 'docx'],
      popularity: 'Very High',
      creationTime: '45 seconds',
      conversionRate: '29%',
      implementation: 'Easy',
      features: [
        '14-day campaign sequences',
        'Short, conversational messaging',
        'Strategic emoji placement',
        'Follow-up templates for different response types'
      ],
      usage: 'Leverage the 98% open rate of WhatsApp messages with our 14-day systematic referral generation campaign. Great for staying top-of-mind with contacts and providing value before making referral requests.',
      appContentType: 'WhatsApp Outreach Campaigns'
    },
    {
      id: 'zoom-meetings',
      title: 'Video Conference Templates',
      description: 'Templates for generating referrals during Zoom and other video calls.',
      icon: <VideoIcon size={20} className="text-blue-500" />,
      sampleImageUrl: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=800&q=80",
      category: 'meetings',
      formats: ['pdf', 'pptx', 'docx'],
      popularity: 'High',
      creationTime: '50 seconds',
      successRate: '38%',
      implementation: 'Medium',
      features: [
        'Meeting agendas with referral opportunities',
        'Screen sharing presentation templates',
        'Visual aids that increase referral conversions',
        'Post-meeting follow-up sequences'
      ],
      usage: 'Perfect for client review meetings, educational webinars, and virtual networking. These templates make requesting referrals during video calls feel natural and professional.',
      appContentType: 'Zoom Meeting Templates'
    },
    {
      id: 'referral-lead-magnets',
      title: 'Referral Lead Magnets',
      description: 'Generate valuable lead magnets that encourage people to refer others to your business.',
      icon: <Sparkles size={20} className="text-amber-600" />,
      sampleImageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
      category: 'referral-programs',
      formats: ['pdf', 'pptx'],
      popularity: 'Medium',
      creationTime: '40 seconds',
      conversionRate: '45%',
      implementation: 'Medium',
      features: [
        'Referrable guides and resources',
        'Assessment or quiz tools',
        'Referral challenges or programs',
        'Exclusive content access'
      ],
      usage: 'Create valuable resources that naturally encourage sharing and referrals. These lead magnets serve double-duty: providing value to recipients while encouraging them to share with others who could benefit.',
      appContentType: 'Referral Lead Magnets'
    },
    {
      id: 'facebook-groups',
      title: 'Facebook Group Strategies',
      description: '14-day engagement plans for generating referrals through Facebook Groups.',
      icon: <Facebook size={20} className="text-blue-500" />,
      sampleImageUrl: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=800&q=80",
      category: 'group-engagement',
      formats: ['pdf', 'docx'],
      popularity: 'Medium',
      creationTime: '55 seconds',
      conversionRate: '22%',
      implementation: 'Medium',
      features: [
        '14-day engagement plans',
        'Value-first approach',
        'Content templates for different platforms',
        'Engagement tracking frameworks'
      ],
      usage: 'Generate engagement plans for social media groups that build credibility, provide value, and naturally lead to referral opportunities without appearing promotional.',
      appContentType: 'Facebook Group Strategies'
    },
    {
      id: 'linkedin-groups',
      title: 'LinkedIn Group Engagement',
      description: 'Strategies for generating referrals through LinkedIn Groups.',
      icon: <Linkedin size={20} className="text-blue-700" />,
      sampleImageUrl: "https://images.unsplash.com/photo-1591084728795-1149f32d9866?auto=format&fit=crop&w=800&q=80",
      category: 'group-engagement',
      formats: ['pdf', 'docx'],
      popularity: 'Medium',
      creationTime: '50 seconds',
      conversionRate: '25%',
      implementation: 'Medium',
      features: [
        'Engagement strategy for professional groups',
        'Content contribution templates',
        'Direct outreach frameworks',
        'Thought leadership positioning'
      ],
      usage: 'Build professional credibility in LinkedIn Groups with strategic engagement that positions you as an expert and creates natural referral opportunities.',
      appContentType: 'LinkedIn Group Engagement'
    },
    {
      id: 'reward-programs',
      title: 'Referral Reward Programs',
      description: 'Incentive structures and reward programs that motivate contacts to provide referrals.',
      icon: <Gift size={20} className="text-green-600" />,
      sampleImageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
      category: 'incentives',
      formats: ['pdf', 'xlsx', 'docx'],
      popularity: 'High',
      creationTime: '40 seconds',
      conversionRate: '45%',
      implementation: 'Medium',
      features: [
        'Multiple reward structure templates',
        'Implementation guides for different business types',
        'Compliance and legal considerations',
        'Tracking and fulfillment frameworks'
      ],
      usage: 'Design referral reward programs that incentivize contacts to refer business to you. From simple thank-you gifts to structured commission systems that can increase referral generation by 240%.',
      appContentType: 'Referral Reward Programs'
    },
    {
      id: 'mlm-structures',
      title: 'Multi-Level Commission Structures',
      description: 'Advanced referral program structures with multi-tiered incentives.',
      icon: <UsersRound size={20} className="text-indigo-600" />,
      sampleImageUrl: "https://images.unsplash.com/photo-1559523182-a284c3fb7cff?auto=format&fit=crop&w=800&q=80",
      category: 'incentives',
      formats: ['pdf', 'xlsx'],
      popularity: 'Medium',
      creationTime: '70 seconds',
      successRate: '320%',
      implementation: 'Advanced',
      features: [
        'Clear commission structures',
        'Multi-tier reward systems',
        'Qualification frameworks',
        'Compliance guidance'
      ],
      usage: 'Create comprehensive multi-level referral programs with fair commission structures, clear qualification criteria, and effective tracking systems. Perfect for businesses looking to build large referral networks.',
      appContentType: 'Multi-Level Commission Structures'
    },
    {
      id: 'tracking-systems',
      title: 'Referral Tracking Systems',
      description: 'Comprehensive systems to track and optimize your referral campaigns.',
      icon: <FileBarChart size={20} className="text-orange-600" />,
      sampleImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      category: 'analytics',
      formats: ['pdf', 'xlsx'],
      popularity: 'Medium',
      creationTime: '60 seconds',
      implementation: 'Advanced',
      features: [
        'Multi-channel tracking',
        'Performance analytics',
        'Referral source attribution',
        'Optimization frameworks'
      ],
      usage: 'Build comprehensive referral tracking systems that monitor, measure, and help you optimize your referral generation efforts across all channels. Increase accountability by 280% with proper tracking.',
      appContentType: 'Referral Tracking Systems'
    },
    {
      id: 'screen-sharing',
      title: 'Screen Sharing Presentations',
      description: 'Powerful presentations designed for screen sharing sessions to drive referrals.',
      icon: <Laptop size={20} className="text-indigo-600" />,
      sampleImageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
      category: 'meetings',
      formats: ['pptx', 'pdf'],
      popularity: 'Medium',
      creationTime: '45 seconds',
      conversionRate: '33%',
      implementation: 'Medium',
      features: [
        'Service results showcase templates',
        'Process visualization slides',
        'Educational content frameworks',
        'Call-to-action formulations'
      ],
      usage: 'Create compelling visual presentations specifically designed for screen sharing in virtual meetings that naturally lead to referral requests.',
      appContentType: 'Screen Sharing Presentations'
    }
  ];
  
  const categories = {
    'all': 'All Categories',
    'direct-outreach': 'Direct Outreach',
    'meetings': 'Meetings & Calls',
    'group-engagement': 'Group Engagement',
    'incentives': 'Incentive Structures',
    'analytics': 'Tracking & Analytics'
  };

  useEffect(() => {
    // Close expanded view when changing categories
    setExpandedType(null);
  }, [activeCategory]);
  
  const filteredTypes = activeCategory === 'all' 
    ? contentTypes 
    : contentTypes.filter(type => type.category === activeCategory);
  
  const handleTypeClick = (typeId: string) => {
    if (expandedType === typeId) {
      setExpandedType(null);
    } else {
      setExpandedType(typeId);
      setActiveTab('features');
    }
  };

  // Navigate to the app with the selected content type
  const handleGoToApp = (contentType: string) => {
    navigate('/app', { state: { selectedContentType: contentType } });
  };
  
  return (
    <div>
      <div className="flex flex-wrap justify-center space-x-2 space-y-2 mb-8">
        <div className="w-full md:w-auto"></div> {/* Spacer for flex wrap */}
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === key
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTypes.map((type) => (
          <div 
            key={type.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 ${
              expandedType === type.id ? 'col-span-1 sm:col-span-2 lg:col-span-3' : ''
            }`}
            onClick={() => handleTypeClick(type.id)}
          >
            {expandedType !== type.id ? (
              // Collapsed view
              <>
                <div className="h-40 bg-gray-200 relative overflow-hidden">
                  <img 
                    src={type.sampleImageUrl} 
                    alt={type.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    onError={(e) => {
                      // Handle image loading errors - set a default color background
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.style.backgroundColor = '#e5e7eb';
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
                    {type.icon}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{type.title}</h3>
                    {type.popularity === 'Very High' && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Popular</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{type.description}</p>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-1">
                      {type.successRate && (
                        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded font-medium">
                          {type.successRate} success
                        </span>
                      )}
                      {type.conversionRate && (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-medium">
                          {type.conversionRate} conv.
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {categories[type.category as keyof typeof categories]}
                    </span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTypeClick(type.id);
                    }}
                    className="mt-4 w-full flex items-center justify-center py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                  >
                    View Details
                    <ExternalLink size={14} className="ml-1" />
                  </button>
                </div>
              </>
            ) : (
              // Expanded view
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  {/* Left side - preview image */}
                  <div className="relative h-full max-h-96 lg:max-h-none overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-200">
                    <img 
                      src={type.sampleImageUrl} 
                      alt={type.title} 
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        // Handle image loading errors
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.style.backgroundColor = '#f3f4f6';
                      }}
                    />
                    <div className="absolute top-4 right-4 flex flex-col space-y-2">
                      <div className="bg-black bg-opacity-70 text-white rounded-lg px-3 py-1.5 text-sm font-medium">
                        {type.title}
                      </div>
                      <div className="bg-green-600 text-white rounded-lg px-3 py-1.5 text-sm">
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1.5" />
                          {type.creationTime}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - content details */}
                  <div className="lg:col-span-2 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center">
                          {type.icon}
                          <h3 className="text-xl font-bold text-gray-900 ml-2">{type.title}</h3>
                          {type.popularity === 'Very High' && (
                            <span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">Most Popular</span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">{type.description}</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedType(null);
                        }}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    {/* Tabs navigation */}
                    <div className="border-b border-gray-200 mb-4">
                      <nav className="flex space-x-6">
                        <button
                          className={`py-2 px-1 border-b-2 text-sm font-medium ${
                            activeTab === 'features' 
                              ? 'border-green-600 text-green-600' 
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab('features');
                          }}
                        >
                          Features
                        </button>
                        <button
                          className={`py-2 px-1 border-b-2 text-sm font-medium ${
                            activeTab === 'usage' 
                              ? 'border-green-600 text-green-600' 
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab('usage');
                          }}
                        >
                          Use Cases
                        </button>
                        <button
                          className={`py-2 px-1 border-b-2 text-sm font-medium ${
                            activeTab === 'exports' 
                              ? 'border-green-600 text-green-600' 
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab('exports');
                          }}
                        >
                          Export Options
                        </button>
                      </nav>
                    </div>
                    
                    {/* Tab content */}
                    <div>
                      {activeTab === 'features' && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Key Features</h4>
                          <ul className="space-y-2 mb-4">
                            {type.features?.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle size={16} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                <span className="text-gray-700 text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <div className="flex flex-col sm:flex-row gap-4 mt-6">
                            <div className="sm:w-1/2">
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center text-sm font-medium text-gray-800 mb-1">
                                  <Clock size={16} className="text-blue-600 mr-1.5" />
                                  Average Creation Time
                                </div>
                                <div className="text-lg font-bold text-gray-900">
                                  {type.creationTime}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Full document generation time
                                </div>
                              </div>
                            </div>
                            <div className="sm:w-1/2">
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                {type.successRate && (
                                  <>
                                    <div className="flex items-center text-sm font-medium text-gray-800 mb-1">
                                      <CheckCircle size={16} className="text-green-600 mr-1.5" />
                                      Success Rate
                                    </div>
                                    <div className="text-lg font-bold text-gray-900">
                                      {type.successRate}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      Network growth potential
                                    </div>
                                  </>
                                )}
                                {type.conversionRate && (
                                  <>
                                    <div className="flex items-center text-sm font-medium text-gray-800 mb-1">
                                      <Target size={16} className="text-blue-600 mr-1.5" />
                                      Conversion Rate
                                    </div>
                                    <div className="text-lg font-bold text-gray-900">
                                      {type.conversionRate}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      Outreach to referral percentage
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Go to App Button */}
                          <div className="mt-6">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (type.appContentType) {
                                  handleGoToApp(type.appContentType);
                                }
                              }}
                              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-md shadow flex items-center justify-center font-medium transition-colors"
                            >
                              Generate This Content
                              <ExternalLink size={18} className="ml-2" />
                            </button>
                            <p className="text-xs text-gray-500 text-center mt-2">
                              Go to the generator to create personalized content
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {activeTab === 'usage' && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Recommended Usage</h4>
                          <p className="text-gray-600 text-sm mb-4">{type.usage}</p>
                          
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                            <div className="flex items-start">
                              <Info size={16} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                              <div>
                                <h5 className="text-sm font-medium text-blue-800">Pro Tip</h5>
                                <p className="text-sm text-blue-700 mt-1">
                                  {type.id === 'friends-family' && "Personalize each message with specific details about your relationship and why you thought of them specifically."}
                                  {type.id === 'phone-scripts' && "Practice the script several times before making calls to ensure your delivery sounds natural and conversational."}
                                  {type.id === 'face-to-face' && "Pay close attention to body language and receptiveness - only proceed with your referral request when the atmosphere feels positive."}
                                  {type.id === 'zoom-meetings' && "Ensure your screen sharing and visual materials are prepared in advance to maintain a professional flow during your referral request."}
                                  {type.id === 'whatsapp-campaigns' && "Use emojis strategically to make messages feel friendly and use WhatsApp's 'starred messages' feature to save your best-performing templates."}
                                  {type.id !== 'friends-family' && 
                                   type.id !== 'phone-scripts' && 
                                   type.id !== 'face-to-face' && 
                                   type.id !== 'zoom-meetings' && 
                                   type.id !== 'whatsapp-campaigns' && 
                                   "Customize all templates with industry-specific terminology and examples relevant to your target audience for best results."}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <h4 className="font-medium text-gray-900 mb-2 mt-6">When to Use</h4>
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="space-y-3">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                                  <span className="font-semibold text-green-700">1</span>
                                </div>
                                <span className="text-sm text-gray-700">
                                  {type.id === 'friends-family' && "When building a new business or entering a new market"}
                                  {type.id === 'phone-scripts' && "When you have a list of warm contacts who already know and trust you"}
                                  {type.id === 'face-to-face' && "During scheduled client meetings or networking events"}
                                  {type.id === 'whatsapp-campaigns' && "When you want to reach contacts where they're most responsive"}
                                  {type.id === 'zoom-meetings' && "For virtual client meetings and educational webinars"}
                                  {type.id === 'client-events' && "When you want to strengthen relationships with existing clients"}
                                  {type.id === 'facebook-groups' && "When your target audience is active in social communities"}
                                  {type.id === 'reward-programs' && "When you want to incentivize ongoing referrals"}
                                  {type.id === 'tracking-systems' && "Once your referral efforts reach a scale that needs tracking"}
                                  {type.id === 'screen-sharing' && "During product demos or portfolio presentations"}
                                  {type.id === 'mlm-structures' && "When building a large, sustainable referral network is your goal"}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                                  <span className="font-semibold text-green-700">2</span>
                                </div>
                                <span className="text-sm text-gray-700">
                                  {type.id === 'friends-family' && "When you want to leverage existing trust relationships"}
                                  {type.id === 'phone-scripts' && "For follow-up after providing services to satisfied clients"}
                                  {type.id === 'face-to-face' && "In casual social situations where business naturally comes up"}
                                  {type.id === 'whatsapp-campaigns' && "To nurture relationships over time with value-based messaging"}
                                  {type.id === 'zoom-meetings' && "When giving presentations or educational content online"}
                                  {type.id === 'client-events' && "To create networking opportunities among your existing clients"}
                                  {type.id === 'facebook-groups' && "When you can provide genuine value to group discussions"}
                                  {type.id === 'reward-programs' && "When your clients are motivated by incentives"}
                                  {type.id === 'tracking-systems' && "When you want to optimize your referral strategy with data"}
                                  {type.id === 'screen-sharing' && "When visuals will help demonstrate your value proposition"}
                                  {type.id === 'mlm-structures' && "When your business model supports referral tiers"}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Go to App Button */}
                          <div className="mt-6">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (type.appContentType) {
                                  handleGoToApp(type.appContentType);
                                }
                              }}
                              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-md shadow flex items-center justify-center font-medium transition-colors"
                            >
                              Generate This Content
                              <ExternalLink size={18} className="ml-2" />
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {activeTab === 'exports' && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Available Export Formats</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {type.formats.includes('pdf') && (
                              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start">
                                <Download size={20} className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                                <div>
                                  <h5 className="font-medium text-gray-900">PDF Document</h5>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Professional, ready-to-use document with proper formatting and layout.
                                  </p>
                                  <div className="mt-2 flex items-center">
                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Recommended</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {type.formats.includes('docx') && (
                              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start">
                                <Download size={20} className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                                <div>
                                  <h5 className="font-medium text-gray-900">Word Document (DOCX)</h5>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Editable document format for easy customization in Microsoft Word.
                                  </p>
                                  <div className="mt-2 flex items-center">
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Easy Editing</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {type.formats.includes('pptx') && (
                              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start">
                                <Download size={20} className="text-orange-500 mt-1 mr-3 flex-shrink-0" />
                                <div>
                                  <h5 className="font-medium text-gray-900">PowerPoint (PPTX)</h5>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Slide presentation with visual layout and speaker notes.
                                  </p>
                                  <div className="mt-2 flex items-center">
                                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">Presentation Ready</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {type.formats.includes('xlsx') && (
                              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start">
                                <Download size={20} className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                                <div>
                                  <h5 className="font-medium text-gray-900">Excel Spreadsheet (XLSX)</h5>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Data-focused format with calculations and tables.
                                  </p>
                                  <div className="mt-2 flex items-center">
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Data Analysis</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-start">
                              <Info size={16} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                              <div>
                                <h5 className="font-medium text-blue-800">Export Features</h5>
                                <p className="text-sm text-blue-700 mt-1">
                                  All exports include proper formatting, styles, and layout. Premium plans include the ability to add your logo and brand colors to exports.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Go to App Button */}
                          <div className="mt-6">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (type.appContentType) {
                                  handleGoToApp(type.appContentType);
                                }
                              }}
                              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-md shadow flex items-center justify-center font-medium transition-colors"
                            >
                              Generate This Content
                              <ExternalLink size={18} className="ml-2" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Link
          to="/app"
          className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition-colors"
        >
          Try All Referral Methods
          <ExternalLink size={18} className="ml-2" />
        </Link>
        <p className="text-sm text-gray-500 mt-2">
          No credit card required. Generate your first referral campaign in seconds.
        </p>
      </div>
    </div>
  );
};

export default ContentTypeShowcase;