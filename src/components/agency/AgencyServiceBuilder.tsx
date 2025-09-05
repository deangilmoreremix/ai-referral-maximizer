import React, { useState, useEffect } from 'react';
import { 
  Tag, Clock, Upload, DollarSign, Lock, CheckCircle, CheckCircle2, 
  X, ArrowRight, Tag as TagIcon, Edit, Presentation, FileBarChart, Copy, Settings, Users, Zap,
  Mail, Building, Globe2, Phone as PhoneIcon, User, Sparkles, MessageSquare, Facebook, Linkedin,
  Calendar, Video, Target
} from 'lucide-react';

interface ServiceTier {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  recommended: boolean;
}

interface AgencyInfo {
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  website: string;
  specialty: string;
  foundedYear: string;
}

interface AgencyServiceBuilderProps {
  agencyInfo?: AgencyInfo;
}

const AgencyServiceBuilder: React.FC<AgencyServiceBuilderProps> = ({ 
  agencyInfo = {
    name: '',
    ownerName: '',
    email: '',
    phone: '',
    website: '',
    specialty: 'AI Referral Generation',
    foundedYear: new Date().getFullYear().toString()
  } 
}) => {
  // Agency information
  const [agency, setAgency] = useState({
    name: agencyInfo.name || 'Your Agency Name',
    tagline: 'AI-Powered Referral Generation Services',
    description: 'We help businesses grow through strategic AI-powered referral generation',
    contactEmail: agencyInfo.email || 'contact@youragency.com',
    contactPhone: agencyInfo.phone || '(555) 123-4567',
    website: agencyInfo.website || 'youragency.com',
    foundedYear: agencyInfo.foundedYear || new Date().getFullYear().toString()
  });
  
  const [serviceName, setServiceName] = useState('AI Referral Generation Service');
  const [serviceDescription, setServiceDescription] = useState('Automated referral content generation using advanced AI models');
  const [selectedReferralMethods, setSelectedReferralMethods] = useState<string[]>([
    'phone-scripts', 'friends-family', 'face-to-face', 'whatsapp'
  ]);
  const [selectedGeminiModels, setSelectedGeminiModels] = useState<string[]>([
    'gemini-2.0-flash', 'gemini-2.35-pro'
  ]);
  
  // Service tiers
  const [serviceTiers, setServiceTiers] = useState<ServiceTier[]>([
    {
      id: 'essential',
      name: 'Essential',
      description: 'Basic referral content for small businesses',
      price: 497,
      features: [
        'Gemini 2.0 Flash Lite model',
        '5 referral methods included',
        'Basic personalization',
        'PDF exports',
        '10 generations per month',
        'Email support'
      ],
      recommended: false
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Advanced referral content for growing businesses',
      price: 997,
      features: [
        'Gemini 2.0 Flash model',
        'All referral methods included',
        'Advanced personalization',
        'PDF, PPTX, DOCX exports',
        '50 generations per month',
        'Priority email support',
        'Document analysis',
        'LinkedIn profile analysis',
        'Multi-channel campaigns'
      ],
      recommended: true
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Premium AI-driven referral systems for agencies',
      price: 1997,
      features: [
        'Gemini 2.35 Pro model',
        'All referral methods included',
        'Deep personalization',
        'All export formats',
        'Unlimited generations',
        '24/7 priority support',
        'Advanced analytics',
        'Custom templates',
        'White-labeling',
        'API access',
        'Dedicated account manager'
      ],
      recommended: false
    }
  ]);
  
  // Referral methods
  const referralMethods = [
    { id: 'phone-scripts', name: 'Phone Call Scripts', icon: <PhoneIcon className="h-5 w-5 text-blue-600" /> },
    { id: 'friends-family', name: 'Friends & Family Campaign', icon: <Users className="h-5 w-5 text-pink-500" /> },
    { id: 'face-to-face', name: 'Face-to-Face Meetings', icon: <Users className="h-5 w-5 text-purple-600" /> },
    { id: 'whatsapp', name: 'WhatsApp Campaigns', icon: <MessageSquare className="h-5 w-5 text-green-600" /> },
    { id: 'facebook-groups', name: 'Facebook Group Strategies', icon: <Facebook className="h-5 w-5 text-blue-500" /> },
    { id: 'linkedin-groups', name: 'LinkedIn Group Engagement', icon: <Linkedin className="h-5 w-5 text-blue-700" /> },
    { id: 'client-events', name: 'Client Appreciation Events', icon: <Calendar className="h-5 w-5 text-emerald-600" /> },
    { id: 'video-conferences', name: 'Video Conference Templates', icon: <Video className="h-5 w-5 text-red-500" /> },
    { id: 'tracking-systems', name: 'Referral Tracking Systems', icon: <FileBarChart className="h-5 w-5 text-orange-600" /> },
    { id: 'screen-sharing', name: 'Screen Sharing Presentations', icon: <Presentation className="h-5 w-5 text-indigo-600" /> }
  ];
  
  // AI Models
  const aiModels = [
    { id: 'gemini-2.35-pro', name: 'Gemini 2.35 Pro', description: 'Premium quality', tier: 'premium' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Balanced quality/speed', tier: 'professional' },
    { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite', description: 'Fast & affordable', tier: 'essential' }
  ];

  // Update agency information
  useEffect(() => {
    if (agencyInfo.name) setAgency(prev => ({ ...prev, name: agencyInfo.name }));
    if (agencyInfo.email) setAgency(prev => ({ ...prev, contactEmail: agencyInfo.email }));
    if (agencyInfo.phone) setAgency(prev => ({ ...prev, contactPhone: agencyInfo.phone }));
    if (agencyInfo.website) setAgency(prev => ({ ...prev, website: agencyInfo.website }));
    if (agencyInfo.foundedYear) setAgency(prev => ({ ...prev, foundedYear: agencyInfo.foundedYear }));
  }, [agencyInfo]);

  // Toggle referral method selection
  const toggleReferralMethod = (methodId: string) => {
    if (selectedReferralMethods.includes(methodId)) {
      setSelectedReferralMethods(selectedReferralMethods.filter(id => id !== methodId));
    } else {
      setSelectedReferralMethods([...selectedReferralMethods, methodId]);
    }
  };
  
  // Toggle AI model selection
  const toggleAIModel = (modelId: string) => {
    if (selectedGeminiModels.includes(modelId)) {
      setSelectedGeminiModels(selectedGeminiModels.filter(id => id !== modelId));
    } else {
      setSelectedGeminiModels([...selectedGeminiModels, modelId]);
    }
  };
  
  // Update service tier
  const updateServiceTier = (tierId: string, field: keyof ServiceTier, value: any) => {
    setServiceTiers(prevTiers => 
      prevTiers.map(tier => 
        tier.id === tierId ? { ...tier, [field]: value } : tier
      )
    );
  };
  
  // Add feature to tier
  const addFeatureToTier = (tierId: string) => {
    setServiceTiers(prevTiers => 
      prevTiers.map(tier => {
        if (tier.id === tierId) {
          return {
            ...tier,
            features: [...tier.features, 'New feature']
          };
        }
        return tier;
      })
    );
  };
  
  // Remove feature from tier
  const removeFeatureFromTier = (tierId: string, featureIndex: number) => {
    setServiceTiers(prevTiers => 
      prevTiers.map(tier => {
        if (tier.id === tierId) {
          const newFeatures = [...tier.features];
          newFeatures.splice(featureIndex, 1);
          return {
            ...tier,
            features: newFeatures
          };
        }
        return tier;
      })
    );
  };
  
  // Update feature text
  const updateFeature = (tierId: string, featureIndex: number, value: string) => {
    setServiceTiers(prevTiers => 
      prevTiers.map(tier => {
        if (tier.id === tierId) {
          const newFeatures = [...tier.features];
          newFeatures[featureIndex] = value;
          return {
            ...tier,
            features: newFeatures
          };
        }
        return tier;
      })
    );
  };
  
  // Set tier as recommended
  const setRecommendedTier = (tierId: string) => {
    setServiceTiers(prevTiers => 
      prevTiers.map(tier => ({
        ...tier,
        recommended: tier.id === tierId
      }))
    );
  };
  
  // Find the appropriate tier icon based on tier ID
  const getTierIcon = (tierId: string) => {
    switch(tierId) {
      case 'essential': return <TagIcon className="h-5 w-5 text-blue-500" />;
      case 'professional': return <Zap className="h-5 w-5 text-amber-500" />;
      case 'premium': return <Target className="h-5 w-5 text-purple-600" />;
      default: return <TagIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">AI Referral Agency Service Builder</h2>
        <p className="text-blue-100">Configure your AI-powered referral service offerings using Gemini models</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Service Configuration */}
          <div className="md:col-span-2 space-y-6">
            {/* Agency Information */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
                <h3 className="font-medium text-blue-700">Agency Information</h3>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agency Name
                  </label>
                  <input 
                    type="text"
                    value={agency.name}
                    onChange={(e) => setAgency({...agency, name: e.target.value})}
                    placeholder="Your Agency Name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tagline
                  </label>
                  <input 
                    type="text"
                    value={agency.tagline}
                    onChange={(e) => setAgency({...agency, tagline: e.target.value})}
                    placeholder="AI-Powered Referral Generation Services"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agency Description
                  </label>
                  <textarea 
                    value={agency.description}
                    onChange={(e) => setAgency({...agency, description: e.target.value})}
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your agency's mission and services..."
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input 
                    type="email"
                    value={agency.contactEmail}
                    onChange={(e) => setAgency({...agency, contactEmail: e.target.value})}
                    placeholder="contact@youragency.com"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input 
                    type="tel"
                    value={agency.contactPhone}
                    onChange={(e) => setAgency({...agency, contactPhone: e.target.value})}
                    placeholder="(555) 123-4567"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input 
                    type="text"
                    value={agency.website}
                    onChange={(e) => setAgency({...agency, website: e.target.value})}
                    placeholder="youragency.com"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Founded Year
                  </label>
                  <input 
                    type="text"
                    value={agency.foundedYear}
                    onChange={(e) => setAgency({...agency, foundedYear: e.target.value})}
                    placeholder="2025"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            {/* Service Details */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-700">Service Details</h3>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Name
                  </label>
                  <input 
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Description
                  </label>
                  <textarea 
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Referral Method Selection */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-700">Included Referral Methods</h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Select the referral methods your agency will offer to clients
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {referralMethods.map((method) => (
                    <div 
                      key={method.id}
                      className={`border rounded-lg p-3 cursor-pointer flex items-center transition-colors ${
                        selectedReferralMethods.includes(method.id) 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                      }`}
                      onClick={() => toggleReferralMethod(method.id)}
                    >
                      <div className={`p-2 rounded-full ${
                        selectedReferralMethods.includes(method.id) ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {method.icon}
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-800">{method.name}</span>
                      {selectedReferralMethods.includes(method.id) && (
                        <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Gemini AI Model Selection */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-700">Gemini AI Models</h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Select which Gemini AI models your agency will use for content generation
                </p>
                
                <div className="space-y-3">
                  {aiModels.map((model) => (
                    <div 
                      key={model.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedGeminiModels.includes(model.id) 
                          ? 'bg-indigo-50 border-indigo-200' 
                          : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}
                      onClick={() => toggleAIModel(model.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {model.id.includes('pro') ? (
                            <div className="p-2 rounded-full bg-indigo-100">
                              <Zap className="h-5 w-5 text-indigo-600" />
                            </div>
                          ) : model.id.includes('flash-lite') ? (
                            <div className="p-2 rounded-full bg-blue-100">
                              <Sparkles className="h-5 w-5 text-blue-500" />
                            </div>
                          ) : (
                            <div className="p-2 rounded-full bg-amber-100">
                              <Zap className="h-5 w-5 text-amber-500" />
                            </div>
                          )}
                          <div className="ml-3">
                            <h4 className="font-medium text-sm">{model.name}</h4>
                            <p className="text-xs text-gray-500">{model.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                            model.tier === 'premium' 
                              ? 'bg-purple-100 text-purple-700' 
                              : model.tier === 'professional'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                          }`}>
                            {model.tier}
                          </span>
                          
                          <div className="ml-3">
                            {selectedGeminiModels.includes(model.id) ? (
                              <div className="h-5 w-5 bg-indigo-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-indigo-600" />
                              </div>
                            ) : (
                              <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Service Tier Builder */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-gray-700">Service Tiers</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                  <Zap className="h-4 w-4 mr-1" />
                  <span>Add Tier</span>
                </button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {serviceTiers.map((tier) => (
                  <div key={tier.id} className={`p-4 ${tier.recommended ? 'bg-blue-50' : ''}`}>
                    <div className="flex flex-wrap md:flex-nowrap items-start gap-4 mb-3">
                      <div className="w-full md:w-2/3">
                        <div className="flex items-center">
                          {getTierIcon(tier.id)}
                          <input
                            type="text"
                            value={tier.name}
                            onChange={(e) => updateServiceTier(tier.id, 'name', e.target.value)}
                            className="ml-2 font-medium text-lg border-none focus:ring-0 focus:outline-none bg-transparent"
                          />
                          {tier.recommended && (
                            <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        
                        <textarea
                          value={tier.description}
                          onChange={(e) => updateServiceTier(tier.id, 'description', e.target.value)}
                          className="w-full text-sm text-gray-600 mt-1 border-none focus:ring-0 focus:outline-none resize-none bg-transparent"
                          rows={2}
                        ></textarea>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 ml-auto">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <input
                            type="number"
                            value={tier.price}
                            onChange={(e) => updateServiceTier(tier.id, 'price', parseInt(e.target.value))}
                            className="w-24 border-none focus:ring-0 focus:outline-none bg-transparent font-bold"
                          />
                          <span className="text-gray-500">/mo</span>
                        </div>
                        
                        <div>
                          <button 
                            className={`px-2 py-1 text-xs rounded ${tier.recommended ? 'bg-gray-200 text-gray-700' : 'bg-blue-100 text-blue-700'}`}
                            onClick={() => setRecommendedTier(tier.id)}
                            disabled={tier.recommended}
                          >
                            {tier.recommended ? 'Recommended' : 'Set as Recommended'}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
                      <div className="space-y-2">
                        {tier.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => updateFeature(tier.id, idx, e.target.value)}
                              className="flex-1 text-sm text-gray-600 border-none focus:ring-0 focus:outline-none bg-transparent"
                            />
                            <button 
                              onClick={() => removeFeatureFromTier(tier.id, idx)}
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addFeatureToTier(tier.id)}
                          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center mt-1"
                        >
                          + Add Feature
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right column - Preview */}
          <div className="space-y-6">
            {/* Service Preview */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-700">Service Preview</h3>
              </div>
              <div className="p-4">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{serviceName}</h2>
                  <p className="text-gray-600 text-sm mt-1">{serviceDescription}</p>
                </div>
                
                {agency.name && (
                  <div className="mb-4 flex flex-col items-center">
                    <div className="text-sm font-medium text-blue-600">{agency.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {agency.website && <span className="flex items-center justify-center"><Globe2 size={12} className="mr-1" /> {agency.website}</span>}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2 mb-4">
                  <div className="text-sm font-medium text-gray-700">Selected Referral Methods:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedReferralMethods.map(methodId => {
                      const method = referralMethods.find(m => m.id === methodId);
                      return method ? (
                        <div key={methodId} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                          {method.icon}
                          <span className="ml-1">{method.name}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="text-sm font-medium text-gray-700">AI Models:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedGeminiModels.map(modelId => {
                      const model = aiModels.find(m => m.id === modelId);
                      return model ? (
                        <div key={modelId} className="flex items-center bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs">
                          {modelId.includes('pro') ? (
                            <Zap size={12} className="mr-1" />
                          ) : modelId.includes('flash-lite') ? (
                            <Sparkles size={12} className="mr-1" />
                          ) : (
                            <Zap size={12} className="mr-1" />
                          )}
                          <span>{model.name}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
                
                {(agency.contactEmail || agency.contactPhone) && (
                  <div className="border-t pt-2 mt-4 text-xs text-center text-gray-500">
                    <div className="flex justify-center space-x-3 mt-2">
                      {agency.contactEmail && (
                        <span className="flex items-center">
                          <Mail size={12} className="mr-1 text-gray-400" /> 
                          {agency.contactEmail}
                        </span>
                      )}
                      {agency.contactPhone && (
                        <span className="flex items-center">
                          <PhoneIcon size={12} className="mr-1 text-gray-400" /> 
                          {agency.contactPhone}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Pricing Preview */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-700">Pricing Tiers</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {serviceTiers.map((tier) => (
                    <div 
                      key={tier.id} 
                      className={`border rounded-lg overflow-hidden ${tier.recommended ? 'border-blue-300 shadow-md' : 'border-gray-200'}`}
                    >
                      {tier.recommended && (
                        <div className="bg-blue-600 text-white text-xs font-medium py-1 text-center">
                          RECOMMENDED
                        </div>
                      )}
                      
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-900">{tier.name}</h4>
                          <div className="text-2xl font-bold text-gray-900">${tier.price}</div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
                        
                        <ul className="space-y-2">
                          {tier.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Marketing Preview */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-100 p-4">
              <h3 className="font-medium text-indigo-900 mb-3">Marketing Points</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-indigo-800">
                    Comprehensive referral generation suite powered by advanced AI
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-indigo-800">
                    Multiple referral methods tailored to your clients' needs
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-indigo-800">
                    Deep personalization with industry-specific content
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-indigo-800">
                    Multiple export formats for professional delivery
                  </span>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <button className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors duration-200 font-medium">
                  Launch Agency Service
                </button>
                <p className="text-xs text-indigo-600 mt-2">
                  Set up your own white-label AI referral service in minutes
                </p>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-700">Contact Section Preview</h3>
              </div>
              <div className="p-4">
                <div className="text-center">
                  <h4 className="font-semibold text-lg text-gray-900">Contact {agency.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">Ready to boost your referral generation?</p>
                  
                  <div className="mt-4 space-y-2">
                    {agency.contactEmail && (
                      <div className="flex items-center justify-center text-sm">
                        <Mail className="h-4 w-4 text-blue-500 mr-2" />
                        <span>{agency.contactEmail}</span>
                      </div>
                    )}
                    {agency.contactPhone && (
                      <div className="flex items-center justify-center text-sm">
                        <PhoneIcon className="h-4 w-4 text-blue-500 mr-2" />
                        <span>{agency.contactPhone}</span>
                      </div>
                    )}
                    {agency.website && (
                      <div className="flex items-center justify-center text-sm">
                        <Globe2 className="h-4 w-4 text-blue-500 mr-2" />
                        <span>{agency.website}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      {agency.foundedYear && (
                        <div className="flex items-center justify-center">
                          <Building className="h-4 w-4 text-gray-400 mr-1" />
                          <span>Est. {agency.foundedYear}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyServiceBuilder;