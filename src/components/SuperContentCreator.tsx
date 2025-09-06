import React, { useState, useEffect, useCallback } from 'react';
import {
  Heart, CheckCircle, FileText, Share2, Mail, MessageSquare,
  Users, Briefcase, Search, Filter, ChevronDown, Zap, Link,
  Target, Gift, Award, Calendar, Phone, UserCheck, Settings,
  ArrowRight, Plus, RefreshCw, AlertCircle, FileCheck, Download,
  Copy, X, ChevronUp, ImageIcon
} from 'lucide-react';
import { generateContent } from '../services/geminiService';
import ImageGenerator from './ImageGenerator';

interface ReferralMethod {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

interface GeneratedContent {
  methodId: string;
  methodTitle: string;
  content: string;
}

const SuperContentCreator: React.FC = () => {
  const [isMultiSelectEnabled, setIsMultiSelectEnabled] = useState(false);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContents, setGeneratedContents] = useState<GeneratedContent[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [businessSize, setBusinessSize] = useState('');

  // Categories
  const categoryOptions: Category[] = [
    { id: 'automation', name: 'Automation & Technology', count: 4 },
    { id: 'content-value', name: 'Content & Value-Based', count: 10 },
    { id: 'direct', name: 'Direct Outreach', count: 12 },
    { id: 'follow-up', name: 'Follow-up Systems', count: 4 },
    { id: 'group', name: 'Group & Community', count: 9 },
    { id: 'incentive', name: 'Incentive Programs', count: 8 },
    { id: 'professional', name: 'Professional Networking', count: 6 },
    { id: 'specialized', name: 'Specialized Applications', count: 6 },
    { id: 'virtual', name: 'Virtual Meetings', count: 11 }
  ];

  // Set categories on component mount
  useEffect(() => {
    setCategories(categoryOptions);
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
      }
    } catch (e) {
      console.error("Error loading personalization settings:", e);
    }
  }, []);

  // Referral methods
  const referralMethods: ReferralMethod[] = [
    {
      id: 'friends-family',
      title: 'Friends & Family Campaign',
      description: '14-day messaging campaign to close personal connections for referrals',
      icon: <Heart size={20} className="text-pink-500" />,
      category: 'direct'
    },
    {
      id: 'client-reviews',
      title: 'Client Success Reviews',
      description: 'Structured review meetings that transition to referral opportunities',
      icon: <FileText size={20} className="text-green-600" />,
      category: 'follow-up'
    },
    {
      id: 'service-provider',
      title: 'Service Provider Network',
      description: 'Targeting professionals who serve your same customer profile',
      icon: <Share2 size={20} className="text-blue-600" />,
      category: 'professional'
    },
    {
      id: 'strategic-introductions',
      title: 'Strategic Introductions',
      description: 'Facilitated introductions through mutual connections',
      icon: <Link size={20} className="text-purple-600" />,
      category: 'direct'
    },
    {
      id: 'gratitude-campaigns',
      title: 'Gratitude Campaigns',
      description: 'Appreciation-focused outreach that includes referral elements',
      icon: <Mail size={20} className="text-amber-600" />,
      category: 'content-value'
    },
    {
      id: 'centers-influence',
      title: 'Centers of Influence',
      description: 'Targeting well-connected individuals in your industry',
      icon: <Users size={20} className="text-indigo-600" />,
      category: 'professional'
    },
    {
      id: 'selective-networking',
      title: 'Selective Networking Events',
      description: 'Strategic attendance at high-value industry events',
      icon: <Briefcase size={20} className="text-gray-600" />,
      category: 'group'
    },
    {
      id: 'phone-scripts',
      title: 'Phone Call Scripts',
      description: 'Effective scripts for requesting referrals during phone conversations',
      icon: <Phone size={20} className="text-blue-600" />,
      category: 'direct'
    },
    {
      id: 'face-to-face',
      title: 'Face-to-Face Meeting Guides',
      description: 'Comprehensive guides for requesting referrals during in-person meetings',
      icon: <UserCheck size={20} className="text-purple-600" />,
      category: 'direct'
    },
    {
      id: 'whatsapp-campaigns',
      title: 'WhatsApp Outreach Campaigns',
      description: '14-day WhatsApp messaging campaigns to systematically generate referrals',
      icon: <MessageSquare size={20} className="text-green-600" />,
      category: 'direct'
    },
    {
      id: 'client-events',
      title: 'Client Appreciation Events',
      description: 'Plan and execute events that strengthen client relationships',
      icon: <Calendar size={20} className="text-green-600" />,
      category: 'direct'
    },
    {
      id: 'reward-programs',
      title: 'Referral Reward Programs',
      description: 'Structured incentive programs to motivate contacts for ongoing referrals',
      icon: <Award size={20} className="text-amber-600" />,
      category: 'incentive'
    }
  ];

  // Popular methods for quick access
  const popularMethods = [
    { id: 'phone-scripts', name: 'Phone Scripts', icon: <Phone size={20} className="text-blue-600" /> },
    { id: 'meeting-guides', name: 'Meeting Guides', icon: <UserCheck size={20} className="text-purple-600" /> },
    { id: 'whatsapp-campaigns', name: 'WhatsApp Campaigns', icon: <MessageSquare size={20} className="text-green-600" /> },
    { id: 'reward-programs', name: 'Reward Programs', icon: <Award size={20} className="text-amber-600" /> }
  ];

  // Handle method selection/deselection
  const toggleMethodSelection = (methodId: string) => {
    if (isMultiSelectEnabled) {
      if (selectedMethods.includes(methodId)) {
        setSelectedMethods(selectedMethods.filter(id => id !== methodId));
      } else {
        setSelectedMethods([...selectedMethods, methodId]);
      }
    } else {
      setSelectedMethods([methodId]);
    }
  };

  // Toggle multi-select mode
  const toggleMultiSelect = () => {
    setIsMultiSelectEnabled(!isMultiSelectEnabled);
    // If turning off multi-select, keep only the first selected method
    if (isMultiSelectEnabled && selectedMethods.length > 1) {
      setSelectedMethods([selectedMethods[0]]);
    }
  };

  // Filter methods based on search and category
  const filteredMethods = referralMethods.filter(method => {
    const matchesSearch = method.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          method.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || method.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Find method by ID
  const getMethodById = useCallback((methodId: string) => {
    return referralMethods.find(method => method.id === methodId);
  }, [referralMethods]);

  // Generate content for selected methods
  const handleGenerateContent = async () => {
    if (selectedMethods.length === 0) return;
    
    setIsGenerating(true);
    setError(null);
    setShowResults(false);
    setGeneratedContents([]);
    
    try {
      const contents: GeneratedContent[] = [];
      
      for (const methodId of selectedMethods) {
        const method = getMethodById(methodId);
        if (!method) continue;
        
        try {
          console.log(`Generating content for ${method.title}`);
          
          // Generate content using the AI service
          const content = await generateContent({
            contentType: method.title,
            industry,
            targetAudience,
            businessSize,
            specialRequirements: `This is being generated as part of a multi-method content creation in the Super Creator. 
            Create comprehensive, professional content for ${method.title}. ${method.description}`
          });
          
          contents.push({
            methodId: method.id,
            methodTitle: method.title,
            content
          });
        } catch (methodError) {
          console.error(`Error generating content for ${method.title}:`, methodError);
          // Continue with other methods even if one fails
        }
      }
      
      setGeneratedContents(contents);
      
      // Show success message
      if (contents.length > 0) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        setShowResults(true);
      } else {
        setError("Failed to generate content for any of the selected methods");
      }
      
    } catch (error) {
      console.error('Error generating content:', error);
      setError("An error occurred while generating content");
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy content to clipboard
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      // Could add a "copied!" indicator
      console.log('Content copied to clipboard');
    }).catch(err => {
      console.error('Error copying to clipboard:', err);
    });
  };

  return (
    <div>
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Zap className="h-7 w-7 text-green-600 mr-2" />
          Super Content Creator
        </h1>
        <p className="text-gray-600 mt-1">
          Generate professional referral content from all 82 referral methods in one place. Select methods, customize settings, and create high-quality content instantly.
        </p>
      </div>

      <div className="mt-4 mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isMultiSelectEnabled}
            onChange={toggleMultiSelect}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Enable Multi-Select</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Method Selection */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h2 className="text-lg font-medium text-gray-800">Referral Methods</h2>
              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                82 of 82 methods
              </div>
            </div>

            <div className="p-4">
              {/* Search bar */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:border-green-500 focus:ring-green-500 text-sm"
                  placeholder="Search referral methods..."
                />
              </div>

              {/* Categories */}
              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-800 mb-2">
                  <Filter size={16} className="mr-2 text-gray-500" />
                  <span>Categories</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div 
                    className={`flex justify-between items-center px-3 py-2 rounded-md cursor-pointer
                      ${activeCategory === 'all' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}
                    onClick={() => setActiveCategory('all')}
                  >
                    <span>All Categories</span>
                    <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                      82
                    </span>
                  </div>
                  
                  {categories.map(category => (
                    <div 
                      key={category.id}
                      className={`flex justify-between items-center px-3 py-2 rounded-md cursor-pointer
                        ${activeCategory === category.id 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <span>{category.name}</span>
                      <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                        {category.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Referral method list */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredMethods.map(method => (
                  <div 
                    key={method.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedMethods.includes(method.id) 
                        ? 'border-green-500 bg-green-50 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                    onClick={() => toggleMethodSelection(method.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {method.icon}
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{method.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{method.description}</p>
                      </div>
                      {selectedMethods.includes(method.id) && (
                        <CheckCircle size={18} className="text-green-500 ml-2 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredMethods.length === 0 && (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                    <AlertCircle size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">No matching referral methods found.</p>
                    <button 
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Personalization settings */}
            <div className="border-t border-gray-200 p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsPersonalizationOpen(!isPersonalizationOpen)}
              >
                <div className="flex items-center text-gray-700">
                  <Settings size={16} className="mr-2" />
                  <span className="font-medium text-sm">Personalization Settings</span>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-500 transition-transform ${isPersonalizationOpen ? 'transform rotate-180' : ''}`}
                />
              </div>
              
              {isPersonalizationOpen && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Industry</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="e.g., Technology"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Target Audience</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="e.g., Small business owners"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Business Size</label>
                    <select
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      value={businessSize}
                      onChange={(e) => setBusinessSize(e.target.value)}
                    >
                      <option value="small">Small Business</option>
                      <option value="medium">Medium Business</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  
                  <button
                    className="w-full py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-medium"
                    onClick={() => {
                      // Save personalization settings to localStorage
                      try {
                        const settings = {
                          industry,
                          targetAudience,
                          businessSize
                        };
                        
                        // Load existing personalization
                        const savedPersonalization = localStorage.getItem('personalization');
                        if (savedPersonalization) {
                          const existingSettings = JSON.parse(savedPersonalization);
                          localStorage.setItem('personalization', JSON.stringify({
                            ...existingSettings,
                            ...settings
                          }));
                        } else {
                          localStorage.setItem('personalization', JSON.stringify(settings));
                        }
                        
                        setIsPersonalizationOpen(false);
                      } catch (e) {
                        console.error("Error saving personalization settings:", e);
                      }
                    }}
                  >
                    Apply Settings
                  </button>
                </div>
              )}
            </div>

            {/* Generate button */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleGenerateContent}
                className={`w-full py-2 px-4 rounded-lg text-white font-medium flex items-center justify-center ${
                  selectedMethods.length > 0 && !isGenerating
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={selectedMethods.length === 0 || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={16} className="mr-1.5 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Zap size={16} className="mr-1.5" />
                    Generate Content for {selectedMethods.length} {selectedMethods.length === 1 ? 'Method' : 'Methods'}
                  </>
                )}
              </button>
              
              {error && (
                <div className="mt-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                  <AlertCircle size={14} className="inline-block mr-1" />
                  {error}
                </div>
              )}
              
              {success && !showResults && (
                <div className="mt-2 text-center py-1 bg-green-100 text-green-800 rounded-md text-sm">
                  <CheckCircle size={14} className="inline-block mr-1" />
                  Content generated successfully!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Preview/Results Area */}
        <div className="lg:col-span-7">
          {!showResults ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <div className="mb-4">
                  <Zap size={48} className="text-green-500 mx-auto" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Super Content Creator</h2>
                <p className="text-gray-600 mb-6">
                  Select one or more referral methods to begin generating professional content
                </p>

                {/* Tip box */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 w-full max-w-md mb-8">
                  <h3 className="font-medium text-blue-800 flex items-center justify-center mb-2">
                    <Zap size={16} className="mr-1.5 text-blue-600" />
                    Tip: Create Multiple Methods at Once
                  </h3>
                  <p className="text-sm text-blue-700 text-center mb-4">
                    Enable multi-select mode to generate content for up to 10 referral methods simultaneously.
                  </p>
                  <button 
                    className="mx-auto block px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium transition-colors"
                    onClick={toggleMultiSelect}
                  >
                    {isMultiSelectEnabled ? 'Disable' : 'Enable'} Multi-Select
                  </button>
                </div>

                {/* Popular methods */}
                <div className="w-full">
                  <h3 className="font-medium text-gray-800 flex items-center mb-4">
                    <Target size={18} className="mr-2 text-green-600" />
                    Popular Referral Methods
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {popularMethods.map(method => (
                      <div 
                        key={method.id}
                        className="border border-gray-200 rounded-lg p-4 flex flex-col items-center hover:border-green-500 hover:shadow-sm cursor-pointer transition-colors"
                        onClick={() => toggleMethodSelection(method.id)}
                      >
                        <div className="flex-shrink-0 mb-2">
                          {method.icon}
                        </div>
                        <span className="text-xs text-gray-700 text-center">{method.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All methods available */}
                <div className="w-full mt-8">
                  <h3 className="font-medium text-gray-800 flex items-center mb-4">
                    <Target size={18} className="mr-2 text-gray-600" />
                    All 82 Referral Methods Available
                  </h3>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle size={16} className="text-green-500 mr-2" />
                        <span className="text-gray-700">Browse all 82 professional referral methods</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle size={16} className="text-green-500 mr-2" />
                        <span className="text-gray-700">Filter by category or search by keyword</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle size={16} className="text-green-500 mr-2" />
                        <span className="text-gray-700">Create multiple referral methods at once</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle size={16} className="text-green-500 mr-2" />
                        <span className="text-gray-700">Export in multiple formats (PDF, PowerPoint, Word)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileCheck size={20} className="text-green-600 mr-2" />
                    <h2 className="text-xl font-medium text-gray-800">Generated Content</h2>
                  </div>
                  <button 
                    onClick={() => setShowResults(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <p className="text-green-700 bg-green-50 px-3 py-2 rounded-md flex items-center">
                    <CheckCircle size={16} className="mr-2" />
                    Successfully generated content for {generatedContents.length} method{generatedContents.length !== 1 ? 's' : ''}.
                  </p>
                </div>
                
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {generatedContents.map((item, index) => {
                    const method = getMethodById(item.methodId);
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                          <div className="flex items-center">
                            {method?.icon}
                            <h3 className="ml-2 font-medium text-gray-800">{item.methodTitle}</h3>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                              onClick={() => copyToClipboard(item.content)}
                              title="Copy to clipboard"
                            >
                              <Copy size={16} />
                            </button>
                            <button 
                              className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                              title="Download as text"
                            >
                              <Download size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div 
                            className="whitespace-pre-wrap text-sm text-gray-700 max-h-60 overflow-y-auto"
                          >
                            {item.content.split('\n').map((line, i) => {
                              if (line.startsWith('# ')) {
                                return <h1 key={i} className="text-xl font-bold mb-3 mt-4 text-gray-900">{line.substring(2)}</h1>;
                              } else if (line.startsWith('## ')) {
                                return <h2 key={i} className="text-lg font-bold mb-2 mt-4 text-gray-900">{line.substring(3)}</h2>;
                              } else if (line.startsWith('### ')) {
                                return <h3 key={i} className="text-md font-bold mb-2 mt-3 text-gray-800">{line.substring(4)}</h3>;
                              } else if (line.startsWith('- ')) {
                                return <p key={i} className="ml-4 mb-1">• {line.substring(2)}</p>;
                              } else if (line === '') {
                                return <br key={i} />;
                              } else {
                                return <p key={i} className="mb-2">{line}</p>;
                              }
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Generate more button */}
                <div className="mt-4 flex justify-center gap-3">
                  <button
                    onClick={() => setShowResults(false)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium flex items-center"
                  >
                    <Zap size={16} className="mr-1.5" />
                    Generate More Content
                  </button>
                  <button
                    onClick={() => setShowImageGenerator(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium flex items-center"
                  >
                    <ImageIcon size={16} className="mr-1.5" />
                    Generate Images
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
                contentType="presentation"
                contentTitle="Referral Campaign Visuals"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperContentCreator;