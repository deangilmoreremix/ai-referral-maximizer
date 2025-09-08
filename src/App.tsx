import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen, FileCode, Tag, Mail, Sparkles, Share2, FileBarChart, Award, FileText,
  Users, Clock, Calendar, UserPlus, Settings, ChevronUp, Zap, Heart, Phone,
  UserCheck, MessageSquare, Video, Target, ArrowRight, Star, Gift, FileCheck,
  Smartphone, Briefcase, Presentation, Linkedin, Facebook, Database, CheckCircle,
  AlertCircle, Bell, MessageCircle, PieChart, ListChecks, Check, Volume2, ImageIcon, Edit3
} from 'lucide-react';
import { generateContent as generateContentOpenAI } from './services/openAIService';
import { OpenAIModel } from './types/openai';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ContentTypeShowcase from './components/ContentTypeShowcase';
import SavedContentHistory from './components/SavedContentHistory';
import StatisticsCounter from './components/StatisticsCounter';
import ContentRevisionModal from './components/ContentRevisionModal';
import ContentPreviewModal from './components/ContentPreviewModal';
import ContentCategorySelector from './components/ContentCategorySelector';
import DocumentModal from './components/DocumentModal';
import PersonalizerModal from './components/PersonalizerModal';
import AppDocumentationModal from './components/AppDocumentationModal';
import ModelSettingsModal from './components/ModelSettingsModal';
import ChatbotLink from './components/ChatbotLink';
import AdminControls from './components/AdminControls';
import ConsultantAccelerator from './components/ConsultantAccelerator';
import AgencyAccelerator from './components/AgencyAccelerator';
import DaySelector from './components/DaySelector';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';
import { supabase } from './services/supabaseClient';
import { useOnboarding } from './components/OnboardingProvider';
import { generatePdf } from './utils/pdfGenerator';
import { generatePptx } from './utils/pptxGenerator';
import { generateDocx, downloadDocx } from './utils/docxGenerator';

// Define content types and their configurations
interface ContentTypeConfig {
  type: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
  hasMultipleDays?: boolean;
  totalDays?: number;
  exportOptions?: string[];
  lastGenerated?: string;
}

interface ContentStorage {
  content: string;
  timestamp: number;
}

type RelationshipType = string | null;

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetOnboarding } = useOnboarding();

  // State for content generation
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State for UI controls
  const [activeCategory, setActiveCategory] = useState('all');
  const [showPersonalizer, setShowPersonalizer] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [showModelSettings, setShowModelSettings] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showContentPreview, setShowContentPreview] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [scrolledPast, setScrolledPast] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [visibleCards, setVisibleCards] = useState<string[]>([]);

  // State for personalization
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [businessSize, setBusinessSize] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [profileData, setProfileData] = useState<any>(null);

  // Advanced settings
  const [relationshipType, setRelationshipType] = useState<RelationshipType>(null);

  // Cost-optimized model selection based on content type
  const getOptimalModelForContent = (contentType: string): OpenAIModel => {
    // Low complexity - simple scripts and basic templates
    const lowComplexity = [
      'Phone Call Scripts',
      'Voice Drop Scripts',
      'Referral Email Templates',
      'Direct Mail Templates',
      'Gift Selection Guide'
    ];

    // Medium complexity - multi-day campaigns and standard content
    const mediumComplexity = [
      'Friends and Family Campaign',
      'WhatsApp Outreach Campaigns',
      'Facebook Group Strategies',
      'Referral Reminder Sequences',
      'Referral Conversation Guide',
      'Referral Thank You System',
      'Referral Nurturing Campaigns',
      'Client Appreciation Events',
      'Networking Event Strategy',
      'Business Meeting Scripts',
      'Referral Interview Process',
      'Referral Reward Programs',
      'Milestone Reward System',
      'LinkedIn Group Engagement',
      'Digital Community Building',
      'Workshop & Webinar Scripts',
      'Referral Process Documentation',
      'Referral Lead Qualification'
    ];

    // High complexity - frameworks, strategies, and advanced content
    const highComplexity = [
      'Face-to-Face Meeting Guides',
      'Zoom Meeting Templates',
      'Screen Sharing Presentations',
      'Tiered Incentive Structures',
      'Multi-Level Commission Structures',
      'Referral Tracking Systems',
      'Client Referral Program',
      'Partner Referral Program',
      'Agency Service Description',
      'Agency Pricing Structure',
      'Client Proposal Template',
      'Client Case Study',
      'Client Onboarding Guide',
      'Expertise Positioning',
      'Service Framework',
      'Consultant Business Model',
      'Client Acquisition System',
      'Delivery Process System',
      'Follow-up System Builder',
      'Community Leadership Positioning'
    ];

    if (lowComplexity.includes(contentType)) {
      return 'gpt-5-nano'; // Cheapest for simple content
    } else if (mediumComplexity.includes(contentType)) {
      return 'gpt-5-mini'; // Balanced for standard content
    } else if (highComplexity.includes(contentType)) {
      return 'gpt-5'; // Full power for complex content
    } else {
      return 'gpt-5-mini'; // Default fallback
    }
  };

  // Local storage
  const [contentStorage, setContentStorage] = useState<Record<string, ContentStorage>>({});

  // Additional state
  const [isEdgeFunction, setIsEdgeFunction] = useState(false);
  const [isSavingToDatabase, setIsSavingToDatabase] = useState(false);
  const [savedToDatabase, setSavedToDatabase] = useState(false);

  // Refs
  const contentTypesContainerRef = useRef<HTMLDivElement>(null);

  // Content categories
  const contentCategories: Record<string, string> = {
    'all': 'All Categories',
    'direct-outreach': 'Direct Outreach',
    'meetings': 'Meetings & Calls',
    'incentives': 'Incentives & Rewards',
    'group-engagement': 'Group & Community',
    'referral-programs': 'Referral Programs',
    'followup': 'Follow-up Strategies',
    'agency': 'Agency Services',
    'consultant': 'Consultant Tools'
  };

  // Define content types
  const contentTypes: Record<string, ContentTypeConfig> = {
    // DIRECT OUTREACH METHODS
    'Friends and Family Campaign': {
      type: 'Friends and Family Campaign',
      icon: <Heart size={24} className="text-pink-500" />,
      title: 'Friends & Family Campaign',
      description: '14-day personalized outreach campaign for friends and family to get referrals without being pushy.',
      category: 'direct-outreach',
      hasMultipleDays: true,
      totalDays: 14,
      exportOptions: ['pdf', 'docx']
    },
    'Phone Call Scripts': {
      type: 'Phone Call Scripts',
      icon: <Phone size={24} className="text-blue-600" />,
      title: 'Phone Call Scripts',
      description: 'Natural, effective phone scripts for requesting referrals from various contact types.',
      category: 'direct-outreach',
      exportOptions: ['pdf', 'docx']
    },
    'WhatsApp Outreach Campaigns': {
      type: 'WhatsApp Outreach Campaigns',
      icon: <MessageSquare size={24} className="text-green-500" />,
      title: 'WhatsApp Campaigns',
      description: 'Comprehensive 14-day WhatsApp campaign with follow-ups to generate quality referrals.',
      category: 'direct-outreach',
      hasMultipleDays: true,
      totalDays: 14,
      exportOptions: ['pdf', 'docx']
    },
    'Client Appreciation Events': {
      type: 'Client Appreciation Events',
      icon: <Calendar size={24} className="text-green-600" />,
      title: 'Client Appreciation Events',
      description: 'Plan and execute events that strengthen client relationships and generate referrals.',
      category: 'direct-outreach',
      exportOptions: ['pdf', 'docx', 'pptx']
    },
    'Referral Email Templates': {
      type: 'Referral Email Templates',
      icon: <Mail size={24} className="text-red-500" />,
      title: 'Referral Email Templates',
      description: 'Professional email templates for requesting and following up on referrals.',
      category: 'direct-outreach',
      exportOptions: ['pdf', 'docx']
    },
    'Voice Drop Scripts': {
      type: 'Voice Drop Scripts',
      icon: <Volume2 size={24} className="text-indigo-500" />,
      title: 'Voice Drop Scripts',
      description: 'Professional voice message scripts for leaving engaging referral requests via voicemail.',
      category: 'direct-outreach',
      exportOptions: ['pdf', 'docx']
    },
    'Direct Mail Templates': {
      type: 'Direct Mail Templates',
      icon: <FileText size={24} className="text-orange-500" />,
      title: 'Direct Mail Templates',
      description: 'Physical mail templates for sending personalized referral requests with high engagement.',
      category: 'direct-outreach',
      exportOptions: ['pdf', 'docx']
    },
    
    // MEETINGS METHODS
    'Face-to-Face Meeting Guides': {
      type: 'Face-to-Face Meeting Guides',
      icon: <UserCheck size={24} className="text-purple-600" />,
      title: 'Face-to-Face Meetings',
      description: 'Guides for requesting referrals during in-person meetings and conversations.',
      category: 'meetings',
      exportOptions: ['pdf', 'pptx', 'docx']
    },
    'Zoom Meeting Templates': {
      type: 'Zoom Meeting Templates',
      icon: <Video size={24} className="text-blue-500" />,
      title: 'Zoom Meeting Templates',
      description: 'Scripts and visual aids for generating referrals during virtual meetings.',
      category: 'meetings',
      exportOptions: ['pdf', 'pptx', 'docx']
    },
    'Networking Event Strategy': {
      type: 'Networking Event Strategy',
      icon: <Users size={24} className="text-emerald-600" />,
      title: 'Networking Event Strategy',
      description: 'Strategic approaches for maximizing referral opportunities at networking events.',
      category: 'meetings',
      exportOptions: ['pdf', 'docx']
    },
    'Business Meeting Scripts': {
      type: 'Business Meeting Scripts',
      icon: <Briefcase size={24} className="text-gray-700" />,
      title: 'Business Meeting Scripts',
      description: 'Professional scripts for incorporating referral requests into business meetings.',
      category: 'meetings',
      exportOptions: ['pdf', 'docx']
    },
    'Screen Sharing Presentations': {
      type: 'Screen Sharing Presentations',
      icon: <Presentation size={24} className="text-indigo-600" />,
      title: 'Screen Sharing Presentations',
      description: 'Visual presentation templates designed specifically for screen sharing sessions.',
      category: 'meetings',
      exportOptions: ['pdf', 'pptx']
    },
    'Client Review Meeting Guide': {
      type: 'Client Review Meeting Guide',
      icon: <FileCheck size={24} className="text-teal-600" />,
      title: 'Client Review Meetings',
      description: 'Structured guides for transitioning client review meetings into referral opportunities.',
      category: 'meetings',
      exportOptions: ['pdf', 'docx', 'pptx']
    },
    'Referral Interview Process': {
      type: 'Referral Interview Process',
      icon: <Users size={24} className="text-amber-600" />,
      title: 'Referral Interview Process',
      description: 'Step-by-step process for interviewing clients about potential referrals.',
      category: 'meetings',
      exportOptions: ['pdf', 'docx']
    },
    
    // INCENTIVES & REWARDS
    'Referral Reward Programs': {
      type: 'Referral Reward Programs',
      icon: <Award size={24} className="text-amber-500" />,
      title: 'Referral Reward Programs',
      description: 'Structured incentive programs to motivate contacts to provide ongoing referrals.',
      category: 'incentives',
      exportOptions: ['pdf', 'docx']
    },
    'Tiered Incentive Structures': {
      type: 'Tiered Incentive Structures',
      icon: <PieChart size={24} className="text-purple-500" />,
      title: 'Tiered Incentive Structures',
      description: 'Multi-level incentive frameworks that reward higher quality and quantity of referrals.',
      category: 'incentives',
      exportOptions: ['pdf', 'xlsx']
    },
    'Gift Selection Guide': {
      type: 'Gift Selection Guide',
      icon: <Gift size={24} className="text-red-500" />,
      title: 'Gift Selection Guide',
      description: 'Strategic guide for selecting appropriate referral gifts for different relationship types.',
      category: 'incentives',
      exportOptions: ['pdf', 'docx']
    },
    'Referral Leaderboard System': {
      type: 'Referral Leaderboard System',
      icon: <CheckCircle size={24} className="text-blue-500" />,
      title: 'Referral Leaderboards',
      description: 'Gamified system that creates friendly competition among referrers with rewards.',
      category: 'incentives',
      exportOptions: ['pdf', 'docx', 'xlsx']
    },
    'Multi-Level Commission Structures': {
      type: 'Multi-Level Commission Structures',
      icon: <Users size={24} className="text-green-600" />,
      title: 'Multi-Level Commissions',
      description: 'Advanced commission frameworks that incentivize ongoing referral generation.',
      category: 'incentives',
      exportOptions: ['pdf', 'xlsx']
    },
    'Milestone Reward System': {
      type: 'Milestone Reward System',
      icon: <Target size={24} className="text-orange-500" />,
      title: 'Milestone Rewards',
      description: 'Progressive reward system based on referral milestones and achievements.',
      category: 'incentives',
      exportOptions: ['pdf', 'docx', 'xlsx']
    },
    
    // GROUP & COMMUNITY METHODS
    'LinkedIn Group Engagement': {
      type: 'LinkedIn Group Engagement',
      icon: <Linkedin size={24} className="text-blue-700" />,
      title: 'LinkedIn Group Strategies',
      description: 'Develop authority and generate referrals through strategic LinkedIn group participation.',
      category: 'group-engagement',
      exportOptions: ['pdf', 'docx']
    },
    'Facebook Group Strategies': {
      type: 'Facebook Group Strategies',
      icon: <Facebook size={24} className="text-blue-500" />,
      title: 'Facebook Group Strategies',
      description: '14-day plan for generating referrals through Facebook Groups without being promotional.',
      category: 'group-engagement',
      hasMultipleDays: true,
      totalDays: 14,
      exportOptions: ['pdf', 'docx']
    },
    'Community Leadership Positioning': {
      type: 'Community Leadership Positioning',
      icon: <Users size={24} className="text-purple-500" />,
      title: 'Community Leadership',
      description: 'Framework for establishing yourself as a community leader to generate organic referrals.',
      category: 'group-engagement',
      exportOptions: ['pdf', 'docx', 'pptx']
    },
    'Workshop & Webinar Scripts': {
      type: 'Workshop & Webinar Scripts',
      icon: <Presentation size={24} className="text-amber-600" />,
      title: 'Workshop & Webinar Scripts',
      description: 'Educational event scripts with strategic referral generation components built in.',
      category: 'group-engagement',
      exportOptions: ['pdf', 'docx', 'pptx']
    },
    'Digital Community Building': {
      type: 'Digital Community Building',
      icon: <Share2 size={24} className="text-emerald-600" />,
      title: 'Digital Community Building',
      description: 'Build and nurture your own community to create a reliable referral ecosystem.',
      category: 'group-engagement',
      exportOptions: ['pdf', 'docx']
    },
    
    // REFERRAL PROGRAMS
    'Referral Tracking Systems': {
      type: 'Referral Tracking Systems',
      icon: <FileBarChart size={24} className="text-orange-500" />,
      title: 'Referral Tracking Systems',
      description: 'Complete systems and documentation for tracking and optimizing your referral process.',
      category: 'referral-programs',
      exportOptions: ['pdf', 'xlsx']
    },
    'Client Referral Program': {
      type: 'Client Referral Program',
      icon: <Users size={24} className="text-blue-600" />,
      title: 'Client Referral Program',
      description: 'Comprehensive program framework for turning clients into referral sources.',
      category: 'referral-programs',
      exportOptions: ['pdf', 'docx', 'pptx']
    },
    'Partner Referral Program': {
      type: 'Partner Referral Program',
      icon: <Briefcase size={24} className="text-green-600" />,
      title: 'Partner Referral Program',
      description: 'Strategic partnership program for consistent B2B referrals with aligned businesses.',
      category: 'referral-programs',
      exportOptions: ['pdf', 'docx']
    },
    'Referral Process Documentation': {
      type: 'Referral Process Documentation',
      icon: <ListChecks size={24} className="text-gray-700" />,
      title: 'Referral Process Documentation',
      description: 'Step-by-step documentation for your entire referral generation and management process.',
      category: 'referral-programs',
      exportOptions: ['pdf', 'docx']
    },
    'Referral Lead Qualification': {
      type: 'Referral Lead Qualification',
      icon: <CheckCircle size={24} className="text-purple-600" />,
      title: 'Referral Lead Qualification',
      description: 'Systems for qualifying and prioritizing referral leads for maximum conversion.',
      category: 'referral-programs',
      exportOptions: ['pdf', 'docx', 'xlsx']
    },
    
    // FOLLOW-UP STRATEGY
    'Follow-up System Builder': {
      type: 'Follow-up System Builder',
      icon: <Clock size={24} className="text-indigo-500" />,
      title: 'Follow-up Systems',
      description: 'Create systematic follow-up processes to nurture and convert referral leads.',
      category: 'followup',
      exportOptions: ['pdf', 'docx']
    },
    'Referral Reminder Sequences': {
      type: 'Referral Reminder Sequences',
      icon: <Bell size={24} className="text-amber-500" />,
      title: 'Reminder Sequences',
      description: 'Multi-touch reminder sequences for referral requests without being pushy.',
      category: 'followup',
      hasMultipleDays: true,
      totalDays: 5,
      exportOptions: ['pdf', 'docx']
    },
    'Referral Conversation Guide': {
      type: 'Referral Conversation Guide',
      icon: <MessageCircle size={24} className="text-green-600" />,
      title: 'Conversation Guides',
      description: 'Flexible conversation frameworks for discussing referrals in various situations.',
      category: 'followup',
      exportOptions: ['pdf', 'docx']
    },
    'Referral Thank You System': {
      type: 'Referral Thank You System',
      icon: <Heart size={24} className="text-red-500" />,
      title: 'Thank You System',
      description: 'Comprehensive system for thanking referral sources to encourage repeat referrals.',
      category: 'followup',
      exportOptions: ['pdf', 'docx']
    },
    'Referral Nurturing Campaigns': {
      type: 'Referral Nurturing Campaigns',
      icon: <Users size={24} className="text-blue-500" />,
      title: 'Nurturing Campaigns',
      description: '30-day campaign to nurture potential referrers before making specific requests.',
      category: 'followup',
      hasMultipleDays: true,
      totalDays: 30,
      exportOptions: ['pdf', 'docx']
    },
    
    // AGENCY SERVICES
    'Agency Service Description': {
      type: 'Agency Service Description',
      icon: <FileText size={24} className="text-gray-600" />,
      title: 'Agency Service Description',
      description: 'Professional service descriptions for your AI referral generation agency.',
      category: 'agency',
      exportOptions: ['pdf', 'docx']
    },
    'Agency Pricing Structure': {
      type: 'Agency Pricing Structure',
      icon: <Tag size={24} className="text-green-600" />,
      title: 'Agency Pricing Structure',
      description: 'Strategic pricing models for AI referral generation services with tiered options.',
      category: 'agency',
      exportOptions: ['pdf', 'docx', 'xlsx']
    },
    'Client Proposal Template': {
      type: 'Client Proposal Template',
      icon: <FileCheck size={24} className="text-purple-600" />,
      title: 'Client Proposal Template',
      description: 'Comprehensive proposal template for selling referral generation services.',
      category: 'agency',
      exportOptions: ['pdf', 'docx', 'pptx']
    },
    'Client Case Study': {
      type: 'Client Case Study',
      icon: <FileCode size={24} className="text-blue-600" />,
      title: 'Client Case Study',
      description: 'Case study templates to showcase your referral generation results for clients.',
      category: 'agency',
      exportOptions: ['pdf', 'docx', 'pptx']
    },
    'Client Onboarding Guide': {
      type: 'Client Onboarding Guide',
      icon: <UserPlus size={24} className="text-amber-600" />,
      title: 'Client Onboarding Guide',
      description: 'Comprehensive onboarding process for new referral generation clients.',
      category: 'agency',
      exportOptions: ['pdf', 'docx']
    },
    
    // CONSULTANT TOOLS
    'Expertise Positioning': {
      type: 'Expertise Positioning',
      icon: <Target size={24} className="text-blue-600" />,
      title: 'Expertise Positioning',
      description: 'Define your consulting expertise and market positioning for maximum impact.',
      category: 'consultant',
      exportOptions: ['pdf', 'docx']
    },
    'Service Framework': {
      type: 'Service Framework',
      icon: <Briefcase size={24} className="text-purple-600" />,
      title: 'Service Framework',
      description: 'Structured framework for your consulting services to attract more referrals.',
      category: 'consultant',
      exportOptions: ['pdf', 'docx', 'pptx']
    },
    'Consultant Business Model': {
      type: 'Consultant Business Model',
      icon: <Database size={24} className="text-green-600" />,
      title: 'Business Model',
      description: 'Revenue model and business structure for a sustainable consulting practice.',
      category: 'consultant',
      exportOptions: ['pdf', 'docx', 'xlsx']
    },
    'Client Acquisition System': {
      type: 'Client Acquisition System',
      icon: <Users size={24} className="text-amber-600" />,
      title: 'Client Acquisition System',
      description: 'Comprehensive system for acquiring clients through strategic referrals.',
      category: 'consultant',
      exportOptions: ['pdf', 'docx']
    },
    'Delivery Process System': {
      type: 'Delivery Process System',
      icon: <ListChecks size={24} className="text-indigo-600" />,
      title: 'Delivery Process System',
      description: 'Structured delivery process framework for consistent client results.',
      category: 'consultant',
      exportOptions: ['pdf', 'docx']
    }
  };

  // Effect to check URL params for selected content
  useEffect(() => {
    const locationState = location.state as any;
    if (locationState?.selectedContentType) {
      console.log("Setting selected content type from navigation:", locationState.selectedContentType);
      setSelectedContentType(locationState.selectedContentType);
      
      // Scroll content types into view if on mobile
      setTimeout(() => {
        if (contentTypesContainerRef.current && window.innerWidth < 768) {
          contentTypesContainerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);
  
  // Load saved content from localStorage
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('generatedContent');
      if (savedContent) {
        setContentStorage(JSON.parse(savedContent));
      }
    } catch (e) {
      console.error("Error loading saved content:", e);
    }
  }, []);
  
  // Load personalization settings from localStorage
  useEffect(() => {
    try {
      const savedPersonalization = localStorage.getItem('personalization');
      if (savedPersonalization) {
        const data = JSON.parse(savedPersonalization);
        setIndustry(data.industry || '');
        setTargetAudience(data.targetAudience || '');
        setBusinessSize(data.businessSize || '');
        setSpecialRequirements(data.specialRequirements || '');
        setRelationshipType(data.relationshipType || null);
        
        if (data.profileData) {
          setProfileData(data.profileData);
        }
      }
    } catch (e) {
      console.error("Error loading personalization:", e);
    }
  }, []);
  
  // Save content to localStorage when it changes
  useEffect(() => {
    if (selectedContentType && generatedContent) {
      const updatedStorage = {
        ...contentStorage,
        [selectedContentType]: {
          content: generatedContent,
          timestamp: Date.now()
        }
      };
      setContentStorage(updatedStorage);
      localStorage.setItem('generatedContent', JSON.stringify(updatedStorage));
    }
  }, [selectedContentType, generatedContent]);
  
  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolledPast(true);
      } else {
        setScrolledPast(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Animation for cards
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => [...prev, entry.target.id]);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const cards = document.querySelectorAll('.content-type-card');
    cards.forEach(card => observer.observe(card));
    
    return () => observer.disconnect();
  }, [activeCategory]);

  // Handle content type selection
  const handleSelectContentType = (contentType: string) => {
    setSelectedContentType(contentType);
    setSelectedDay(1);
    
    // If we already have generated content, show the preview
    if (contentStorage[contentType]) {
      setGeneratedContent(contentStorage[contentType].content);
      setShowContentPreview(true);
    } else {
      // Otherwise generate new content
      handleGenerateContent(contentType);
    }
  };

  // Generate content
  const handleGenerateContent = async (contentType: string) => {
    setIsGenerating(true);
    setErrorMessage(null);
    setSelectedContentType(contentType);
    
    try {
      console.log(`Generating content for ${contentType}`);
      
      // Generate content using OpenAI with optimal model selection
      const optimalModel = getOptimalModelForContent(contentType);
      const content = await generateContentOpenAI({
        contentType,
        industry,
        targetAudience,
        businessSize,
        specialRequirements,
        model: optimalModel,
        relationshipType
      });
      
      setGeneratedContent(content);
      setShowContentPreview(true);
      setSavedToDatabase(false);
      
      // Optionally save to database
      const shouldSaveToDb = true;
      if (shouldSaveToDb) {
        setIsSavingToDatabase(true);
        try {
          // Here you would call your database save function
          // For example: await saveToDatabase(contentType, content);
          
          // Simulating a database save operation
          await new Promise(resolve => setTimeout(resolve, 1500));
          setSavedToDatabase(true);
        } catch (error) {
          console.error("Error saving to database:", error);
        } finally {
          setIsSavingToDatabase(false);
        }
      }
      
    } catch (error) {
      console.error("Error generating content:", error);
      setErrorMessage("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle content revision
  const handleReviseContent = () => {
    setShowRevisionModal(true);
  };
  
  // Submit revision
  const handleSubmitRevision = async (revisionInstructions: string) => {
    setShowRevisionModal(false);
    setIsGenerating(true);
    setErrorMessage(null);
    
    try {
      if (!selectedContentType || !generatedContent) {
        throw new Error("No content to revise");
      }
      
      const optimalModel = getOptimalModelForContent(selectedContentType);
      const revisedContent = await generateContentOpenAI({
        contentType: selectedContentType,
        industry,
        targetAudience,
        businessSize,
        specialRequirements,
        originalContent: generatedContent,
        revisionInstructions,
        isRevision: true,
        model: optimalModel,
        relationshipType
      });
      
      setGeneratedContent(revisedContent);
      
    } catch (error) {
      console.error("Error revising content:", error);
      setErrorMessage("Failed to revise content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle document export
  const handleExportDocument = () => {
    if (!selectedContentType || !generatedContent) return;
    
    setShowDocumentModal(true);
  };
  
  // Download document
  const handleDownloadDocument = async () => {
    if (!selectedContentType || !generatedContent) return;
    
    const config = contentTypes[selectedContentType];
    const title = config?.title || selectedContentType;
    const docTitle = `${title}${config?.hasMultipleDays ? ` - Day ${selectedDay}` : ''}`;
    
    // Get content for the specific day if multi-day content
    let contentToExport = generatedContent;
    if (config?.hasMultipleDays) {
      const dayPattern = new RegExp(`### DAY ${selectedDay}[^#]*(?=### DAY ${selectedDay + 1}|$)`, 'is');
      const match = generatedContent.match(dayPattern);
      if (match) {
        contentToExport = match[0];
      }
    }
    
    let fileName = `${title.toLowerCase().replace(/\s+/g, '-')}`;
    if (config?.hasMultipleDays) {
      fileName += `-day-${selectedDay}`;
    }
    
    switch (exportFormat) {
      case 'pdf':
        const pdf = generatePdf(docTitle, selectedContentType, contentToExport);
        pdf.save(`${fileName}.pdf`);
        break;
      case 'pptx':
        const pptx = generatePptx(docTitle, selectedContentType, contentToExport);
        pptx.writeFile({ fileName: `${fileName}.pptx` });
        break;
      case 'docx':
        // Generate real DOCX file
        const docxBuffer = await generateDocx(docTitle, selectedContentType, contentToExport);
        downloadDocx(docxBuffer, `${fileName}.docx`);
        break;
      case 'xlsx':
        // In a real implementation, this would use an xlsx generation library
        // For this demo, we'll just fake it with a PDF
        const pdfForXlsx = generatePdf(docTitle, selectedContentType, contentToExport);
        pdfForXlsx.save(`${fileName}.pdf`);
        break;
    }
    
    setShowDocumentModal(false);
  };
  
  // Handle personalization settings
  const handlePersonalizationApply = (
    newIndustry: string, 
    newTargetAudience: string, 
    newBusinessSize: string, 
    newSpecialRequirements: string, 
    newProfileData?: any
  ) => {
    setIndustry(newIndustry);
    setTargetAudience(newTargetAudience);
    setBusinessSize(newBusinessSize);
    setSpecialRequirements(newSpecialRequirements);
    
    if (newProfileData) {
      setProfileData(newProfileData);
    }
    
    // Save to localStorage
    localStorage.setItem('personalization', JSON.stringify({
      industry: newIndustry,
      targetAudience: newTargetAudience,
      businessSize: newBusinessSize,
      specialRequirements: newSpecialRequirements,
      relationshipType,
      profileData: newProfileData || profileData
    }));
  };
  
  // Update model settings
  const handleUpdateModelSettings = (settings: { model: OpenAIModel; relationshipType: RelationshipType }) => {
    // Models are now automatically selected based on content type for cost optimization
    setRelationshipType(settings.relationshipType);
    
    // Update personalization settings in localStorage to include relationship type
    localStorage.setItem('personalization', JSON.stringify({
      industry,
      targetAudience,
      businessSize,
      specialRequirements,
      relationshipType: settings.relationshipType,
      profileData
    }));
  };
  
  // Filter content types by category
  const filteredContentTypes = Object.entries(contentTypes).filter(([_, config]) => {
    return activeCategory === 'all' || config.category === activeCategory;
  });
  
  // Check if selected content has multiple days
  const selectedContentConfig = selectedContentType ? contentTypes[selectedContentType] : null;
  const hasMultipleDays = selectedContentConfig?.hasMultipleDays || false;
  const totalDays = selectedContentConfig?.totalDays || 1;
  
  // Get export options for selected content
  const exportOptions = selectedContentConfig?.exportOptions || ['pdf'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Page header */}
      <div className="mb-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <UserPlus className="h-7 w-7 text-green-600 mr-2" />
          Content Generator
        </h1>
        
        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 personalize-button-container"
            onClick={() => setShowPersonalizer(true)}
            title="Personalize content generation"
          >
            <Settings className="h-4 w-4 mr-1 text-gray-500" />
            Personalize
          </button>
          
          <button
            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 help-docs-button-container"
            onClick={() => setShowDocumentation(true)}
            title="View help documentation"
          >
            <BookOpen className="h-4 w-4 mr-1 text-gray-500" />
            Documentation
          </button>
          
          <button
            className="inline-flex items-center px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md shadow-sm text-sm font-medium text-blue-700 hover:bg-blue-100"
            onClick={() => setShowModelSettings(true)}
            title="AI model and relationship settings"
          >
            <Zap className="h-4 w-4 mr-1 text-blue-500" />
            AI Settings
          </button>
        </div>
      </div>

      {/* Categories selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6 categories-selector-container">
        <ContentCategorySelector 
          categories={contentCategories}
          selectedCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        {/* Statistics cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 mt-4">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center text-gray-700 text-xs font-medium">
              <FileText className="h-3.5 w-3.5 text-gray-500 mr-1" />
              Methods
            </div>
            <p className="text-lg font-bold text-gray-900">50+</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center text-gray-700 text-xs font-medium">
              <Clock className="h-3.5 w-3.5 text-gray-500 mr-1" />
              Generation Time
            </div>
            <p className="text-lg font-bold text-gray-900">30-60s</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center text-blue-700 text-xs font-medium">
              <Zap className="h-3.5 w-3.5 text-blue-500 mr-1" />
              AI Model
            </div>
            <p className="text-lg font-bold text-blue-700">
              {selectedContentType ? getOptimalModelForContent(selectedContentType).replace('gpt-', 'GPT-') : 'GPT-5'}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center text-gray-700 text-xs font-medium">
              <Users className="h-3.5 w-3.5 text-gray-500 mr-1" />
              Active Users
            </div>
            <p className="text-lg font-bold text-gray-900">15,000+</p>
          </div>
        </div>

        {/* Method Grid */}
        {selectedContentType && !showContentPreview ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center mb-4">
              {contentTypes[selectedContentType]?.icon}
              <h2 className="text-xl font-semibold text-gray-900 ml-3">
                {contentTypes[selectedContentType]?.title}
              </h2>
            </div>
            
            <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              {isGenerating ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-t-transparent border-green-600 rounded-full mx-auto mb-4 animate-spin"></div>
                  <h3 className="text-lg font-medium text-gray-900">Generating Content...</h3>
                  <p className="text-sm text-gray-500 mt-2">This may take up to 60 seconds</p>
                </div>
              ) : (
                <div className="text-center">
                  <Sparkles size={48} className="text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">Ready to Generate Content</h3>
                  <p className="text-sm text-gray-500 mt-2">Click "Generate" to create your customized content</p>
                  
                  <button
                    onClick={() => handleGenerateContent(selectedContentType)}
                    className="mt-6 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm hover:shadow text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center mx-auto"
                  >
                    <Zap size={18} className="mr-1.5" />
                    Generate {contentTypes[selectedContentType]?.title}
                  </button>
                </div>
              )}
            </div>
            
            {/* Cost-optimized model selection - automatic */}
            <div className="mt-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Cost-Optimized AI Selection</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Automatically selects the most cost-effective GPT-5 model for each content type:</p>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        <li><strong>GPT-5 Nano:</strong> Simple scripts and basic templates</li>
                        <li><strong>GPT-5 Mini:</strong> Standard content and multi-day campaigns</li>
                        <li><strong>GPT-5:</strong> Complex frameworks and advanced strategies</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Error message */}
            {errorMessage && (
              <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : !selectedContentType ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-types-container" ref={contentTypesContainerRef}>
            {filteredContentTypes.map(([type, config], index) => (
              <div 
                key={type}
                id={`content-card-${type}`}
                className={`content-type-card group relative overflow-hidden border rounded-lg shadow-sm hover:shadow-lg transition-all duration-500 transform cursor-pointer ${
                  visibleCards.includes(`content-card-${type}`)
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-10 opacity-0'
                } ${
                  selectedContentType === type && showContentPreview
                    ? 'ring-2 ring-green-500 border-green-200 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => handleSelectContentType(type)}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="h-36 bg-gradient-to-r from-gray-50 to-white relative overflow-hidden">
                  {/* Badge for multi-day content */}
                  {config.hasMultipleDays && (
                    <div className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded z-10 shadow-sm">
                      {config.totalDays}-DAY PLAN
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
                        {config.icon}
                      </div>
                      <h3 className="ml-3 font-semibold text-gray-900 group-hover:text-gray-700">{config.title}</h3>
                    </div>
                    
                    <p className="text-gray-600 text-sm">{config.description}</p>
                  </div>
                  
                  {/* Hover overlay with animation */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-gray-900/70 flex flex-col justify-center items-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Star size={24} className="text-yellow-400 mb-3 animate-pulse" />
                    <h3 className="text-white font-bold text-lg mb-2">{config.title}</h3>
                    <p className="text-white/80 text-sm text-center mb-4">{config.description}</p>
                    <span className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium inline-flex items-center">
                      Generate Now
                      <ArrowRight size={14} className="ml-1.5" />
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 py-2 px-4 border-t border-gray-200 flex justify-between items-center">
                  {contentStorage[type] ? (
                    <span className="text-xs text-gray-500">
                      Last generated: {new Date(contentStorage[type].timestamp).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
                      })}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">
                      {isGenerating && selectedContentType === type ? 'Generating...' : 'Click to generate'}
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {filteredContentTypes.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200 col-span-full">
                <p className="text-gray-500">No content types found in this category.</p>
                <button 
                  onClick={() => setActiveCategory('all')}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Show all categories
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Additional Tools Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Saved Content History */}
        <div className="md:col-span-2">
          <SavedContentHistory 
            contentStorage={contentStorage}
            contentTypes={contentTypes}
            onSelectContent={handleSelectContentType}
          />
        </div>
            
        {/* Tools */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Special Tools</h2>
          <div className="space-y-3">
            <ChatbotLink className="w-full" />

            <button
              onClick={() => setShowImageGenerator(true)}
              className="w-full block border border-gray-200 hover:border-gray-300 rounded-lg p-3.5 shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <ImageIcon size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">AI Image Generator</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Create professional visuals with DALL-E</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setShowImageEditor(true)}
              className="w-full block border border-gray-200 hover:border-gray-300 rounded-lg p-3.5 shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Edit3 size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Nano Banana Image Editor</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Edit images with Gemini AI prompts</p>
                </div>
              </div>
            </button>

            <a
              href="/csv-import"
              className="block border border-gray-200 hover:border-gray-300 rounded-lg p-3.5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <FileText size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">CSV Batch Processing</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Generate personalized content for multiple leads</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      
      {/* Back to Top Button */}
      {scrolledPast && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-white p-2 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-shadow z-10"
          aria-label="Back to top"
        >
          <ChevronUp size={24} className="text-gray-600" />
        </button>
      )}

      {/* Modals */}
      {selectedContentType && (
        <ContentPreviewModal
          isOpen={showContentPreview}
          onClose={() => setShowContentPreview(false)}
          selectedContent={selectedContentType}
          contentConfig={contentTypes[selectedContentType]}
          generatedContent={generatedContent}
          loading={isGenerating}
          onRevise={handleReviseContent}
          onRegenerate={() => handleGenerateContent(selectedContentType)}
          onExport={handleExportDocument}
          hasMultipleDays={hasMultipleDays}
          selectedDay={selectedDay}
          onDayChange={setSelectedDay}
          totalDays={totalDays}
          errorMessage={errorMessage}
          profileData={profileData}
          industry={industry}
          targetAudience={targetAudience}
          exportFormat={exportFormat}
          exportOptions={exportOptions}
          contentCategories={contentCategories}
          isSaving={isSavingToDatabase}
          savedToDatabase={savedToDatabase}
        />
      )}
      
      <ContentRevisionModal
        isOpen={showRevisionModal}
        onClose={() => setShowRevisionModal(false)}
        onSubmit={handleSubmitRevision}
        contentType={selectedContentType || ''}
      />
      
      <DocumentModal
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        title={selectedContentType ? contentTypes[selectedContentType]?.title || selectedContentType : ''}
        fileName={
          selectedContentType 
            ? `${contentTypes[selectedContentType]?.title.replace(/\s+/g, '-').toLowerCase() || 'document'}.${exportFormat}`
            : 'document.pdf'
        }
        onDownload={handleDownloadDocument}
        hasMultipleDays={hasMultipleDays}
        day={selectedDay}
        exportFormat={exportFormat}
        exportOptions={exportOptions}
        onFormatChange={setExportFormat}
      />
      
      <PersonalizerModal
        isOpen={showPersonalizer}
        onClose={() => setShowPersonalizer(false)}
        onApply={handlePersonalizationApply}
      />
      
      <AppDocumentationModal
        isOpen={showDocumentation}
        onClose={() => setShowDocumentation(false)}
      />
      
      <ModelSettingsModal
        isOpen={showModelSettings}
        onClose={() => setShowModelSettings(false)}
        selectedModel={selectedContentType ? getOptimalModelForContent(selectedContentType) : 'gpt-5'}
        relationshipType={relationshipType}
        onUpdateSettings={handleUpdateModelSettings}
      />

      {/* Image Generator Modal */}
      {showImageGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">AI Image Generator</h2>
              <button
                onClick={() => setShowImageGenerator(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <ImageGenerator
                contentType={selectedContentType || undefined}
                contentTitle={selectedContentType ? contentTypes[selectedContentType]?.title : undefined}
              />
            </div>
          </div>
        </div>
      )}

      {/* Image Editor Modal */}
      {showImageEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Nano Banana Image Editor</h2>
              <button
                onClick={() => setShowImageEditor(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <ImageEditor />
            </div>
          </div>
        </div>
      )}

      {/* Admin controls - hidden in production */}
      <AdminControls isVisible={process.env.NODE_ENV !== 'production'} />
    </div>
  );
};

// Export statement
export default App;