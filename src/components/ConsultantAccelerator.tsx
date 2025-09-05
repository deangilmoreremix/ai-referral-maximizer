import React, { useState, useEffect, useCallback } from 'react';
import { 
  Brain, Award, ArrowRight, ChevronRight, Target, Briefcase, BarChart2, Users, Zap,
  CheckCircle, Calendar, MessageSquare, FileText, PenTool, User, Mail, Phone, Globe2, Building2
} from 'lucide-react';
import { generateContent } from '../services/geminiService';
import { useConsultant } from '../contexts/ConsultantContext';
import ConsultantPreview from './consultant/ConsultantPreview';

interface AcceleratorStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  subSteps: { title: string; description: string }[];
  contentPrompt: string;
}

const ConsultantAccelerator: React.FC = () => {
  const { consultantInfo, updateConsultantInfo, activeStep, setActiveStep, saveContent, generatedContent } = useConsultant();
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<'gemini-2.5-pro' | 'gemini-2.0-flash' | 'gemini-2.0-flash-light'>('gemini-2.0-flash');

  // Define steps for the consultant accelerator
  const steps: AcceleratorStep[] = [
    {
      id: 1,
      title: "Expertise Positioning",
      description: "Define your consulting expertise and market positioning",
      icon: <Target className="h-5 w-5" />,
      color: "blue",
      contentPrompt: "Create a detailed guide on defining and positioning consulting expertise in the referral generation space. Include: 1) How to assess current expertise and skills, 2) How to identify profitable niches in the referral market, 3) How to create a unique value proposition for a consultant, and 4) How to test market positioning. Format with clear headings, subheadings, and actionable steps.",
      subSteps: [
        { title: "Expertise Assessment", description: "Identify your core consulting skills and knowledge areas" },
        { title: "Niche Selection", description: "Choose a profitable, focused market segment to serve" },
        { title: "Positioning Strategy", description: "Create a unique value proposition that stands out" }
      ]
    },
    {
      id: 2,
      title: "Service Framework",
      description: "Structure your consulting services and methodologies",
      icon: <Briefcase className="h-5 w-5" />,
      color: "indigo",
      contentPrompt: "Create a detailed guide on developing a service framework for referral generation consulting. Include: 1) How to define clear, valuable consulting offerings for referral generation, 2) How to create repeatable methodologies for client results, 3) How to structure service delivery processes, and 4) How to communicate the value of these services to prospects. Format with clear headings, subheadings, and actionable steps.",
      subSteps: [
        { title: "Service Definition", description: "Define clear, valuable consulting offerings" },
        { title: "Methodology Development", description: "Create repeatable processes for consistent results" },
        { title: "Client Outcomes", description: "Define measurable results clients will achieve" }
      ]
    },
    {
      id: 3,
      title: "Business Model",
      description: "Define your consulting business model and pricing",
      icon: <BarChart2 className="h-5 w-5" />,
      color: "purple",
      contentPrompt: "Create a detailed guide on establishing a consulting business model for referral generation services. Include: 1) Different revenue models suitable for referral consulting (retainer, project-based, performance-based), 2) Pricing strategies that reflect the value of referral generation, 3) How to package services for different client segments, and 4) How to ensure profitability and sustainable growth. Format with clear headings, subheadings, and actionable steps.",
      subSteps: [
        { title: "Revenue Model", description: "Select the optimal revenue approach for stability and growth" },
        { title: "Consulting Pricing", description: "Set strategic prices that reflect your value" },
        { title: "Service Packages", description: "Bundle services for increased value and profitability" }
      ]
    },
    {
      id: 4,
      title: "Client Acquisition",
      description: "Set up your client acquisition system",
      icon: <User className="h-5 w-5" />,
      color: "green",
      contentPrompt: "Create a detailed guide on client acquisition for a referral generation consultant. Include: 1) How to identify and define the ideal client profile, 2) Effective outreach strategies specifically for referral generation expertise, 3) How to build authority in the referral space, and 4) How to convert prospects into clients. Format with clear headings, subheadings, and actionable steps.",
      subSteps: [
        { title: "Ideal Client Profile", description: "Define exactly who your best clients are" },
        { title: "Outreach Strategy", description: "Create a reliable system for finding new clients" },
        { title: "Authority Building", description: "Establish yourself as a trusted expert in your field" }
      ]
    },
    {
      id: 5,
      title: "Delivery Systems",
      description: "Create your consulting delivery infrastructure",
      icon: <Layers className="h-5 w-5" />,
      color: "amber",
      contentPrompt: "Create a detailed guide on building consulting delivery systems for referral generation services. Include: 1) How to create a seamless client onboarding process, 2) Systems for delivering referral generation consulting effectively, 3) How to measure and track results for clients, and 4) How to continuously improve service delivery based on feedback. Format with clear headings, subheadings, and actionable steps.",
      subSteps: [
        { title: "Client Onboarding", description: "Create a seamless experience for new clients" },
        { title: "Delivery Process", description: "Structure your engagement process for success" },
        { title: "Results Measurement", description: "Implement systems to track and demonstrate value" }
      ]
    },
    {
      id: 6,
      title: "Scaling Strategy",
      description: "Plan for scaling your consulting practice",
      icon: <Zap className="h-5 w-5" />,
      color: "red",
      contentPrompt: "Create a detailed guide on scaling a referral generation consulting practice. Include: 1) How to leverage your expertise without working more hours, 2) Creating systems and processes for growth, 3) Building recurring revenue streams, and 4) Potentially growing a team or partner network. Format with clear headings, subheadings, and actionable steps.",
      subSteps: [
        { title: "Leverage Model", description: "Multiply your impact without multiplying your time" },
        { title: "Growth Roadmap", description: "Chart your path to sustainable business growth" },
        { title: "Recurring Revenue", description: "Create predictable, ongoing revenue streams" }
      ]
    }
  ];
  
  // Benefits of using the accelerator
  const benefits = [
    { icon: <Calendar />, title: "Start in 30 Days", description: "Launch your consulting business in just one month" },
    { icon: <DollarSign />, title: "Premium Pricing", description: "Package and price your expertise for maximum value" },
    { icon: <MessageSquare />, title: "Client Attraction", description: "Proven systems to attract ideal clients" },
    { icon: <LineChart />, title: "Predictable Growth", description: "Reliable systems for sustainable business growth" }
  ];

  // Try to load saved consultant info from localStorage on mount
  useEffect(() => {
    try {
      const savedInfo = localStorage.getItem('consultantInfo');
      if (savedInfo) {
        updateConsultantInfo(JSON.parse(savedInfo));
      }
    } catch (e) {
      console.error("Error loading saved consultant info:", e);
    }
  }, [updateConsultantInfo]);

  // Save consultant info to localStorage when it changes
  useEffect(() => {
    if (consultantInfo.name || consultantInfo.email || consultantInfo.expertise) {
      localStorage.setItem('consultantInfo', JSON.stringify(consultantInfo));
    }
  }, [consultantInfo]);

  // Generate content for the current step
  const generateStepContent = useCallback(async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setErrorMessage(null);
    
    try {
      const currentStep = steps[activeStep-1];
      let prompt = currentStep.contentPrompt;
      
      // Add consultant information to the prompt if available
      if (consultantInfo.name) {
        prompt += `\n\nPlease tailor this guidance for ${consultantInfo.name}`;
        
        if (consultantInfo.expertise) {
          prompt += ` who specializes in ${consultantInfo.expertise}`;
        }
        
        if (consultantInfo.targetClient) {
          prompt += ` and targets ${consultantInfo.targetClient} as clients`;
        }
        
        prompt += '.';
      }
      
      console.log(`Generating consultant content for step ${activeStep} using ${selectedModel}`);
      
      const content = await generateContent({
        contentType: `Consultant Accelerator - Step ${activeStep}: ${steps[activeStep-1].title}`,
        specialRequirements: prompt,
        model: selectedModel
      });
      
      // Save the generated content to consultant context
      saveContent(`step-${activeStep}`, content);
      
    } catch (err: any) {
      console.error("Error generating content:", err);
      setErrorMessage("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [activeStep, isGenerating, consultantInfo, selectedModel, steps, saveContent]);

  return (
    <div className="mt-12 mb-8 rounded-xl overflow-hidden border border-gray-200 shadow-md bg-white">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <div className="flex items-center">
              <Brain className="h-6 w-6 mr-2" />
              <h2 className="text-2xl font-bold">Consultant Business Accelerator</h2>
            </div>
            <p className="mt-2 text-indigo-100">
              The proven system to build, launch, and scale a profitable consulting practice
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Consultant Information Section */}
        <div className="mb-6 bg-purple-50 rounded-xl p-4 border border-purple-100">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-purple-900">Consultant Information</h3>
            <button 
              onClick={() => {
                document.getElementById('consultant-info-form')?.classList.toggle('hidden');
              }}
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              Edit Details
            </button>
          </div>

          <div id="consultant-info-form" className="mt-3 hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-purple-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={consultantInfo.name}
                  onChange={(e) => updateConsultantInfo({ name: e.target.value })}
                  placeholder="Your Full Name"
                  className="w-full border border-purple-200 rounded-md px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-purple-700 mb-1">
                  Primary Expertise
                </label>
                <input
                  type="text"
                  value={consultantInfo.expertise}
                  onChange={(e) => updateConsultantInfo({ expertise: e.target.value })}
                  placeholder="e.g., Referral Strategy, LinkedIn Growth"
                  className="w-full border border-purple-200 rounded-md px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-purple-700 mb-1">
                  Target Client
                </label>
                <input
                  type="text"
                  value={consultantInfo.targetClient}
                  onChange={(e) => updateConsultantInfo({ targetClient: e.target.value })}
                  placeholder="e.g., Financial Advisors, Tech Startups"
                  className="w-full border border-purple-200 rounded-md px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-purple-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={consultantInfo.email}
                  onChange={(e) => updateConsultantInfo({ email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full border border-purple-200 rounded-md px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-purple-700 mb-1">
                  Phone Number (optional)
                </label>
                <input
                  type="tel"
                  value={consultantInfo.phone}
                  onChange={(e) => updateConsultantInfo({ phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="w-full border border-purple-200 rounded-md px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-purple-700 mb-1">
                  Website (optional)
                </label>
                <input
                  type="url"
                  value={consultantInfo.website}
                  onChange={(e) => updateConsultantInfo({ website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                  className="w-full border border-purple-200 rounded-md px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-3">
            {consultantInfo.name && (
              <div className="bg-white px-3 py-1.5 rounded-md text-xs border border-purple-200 shadow-sm">
                <User size={12} className="text-purple-600 mr-1 inline-block" />
                {consultantInfo.name}
              </div>
            )}
            {consultantInfo.expertise && (
              <div className="bg-white px-3 py-1.5 rounded-md text-xs border border-purple-200 shadow-sm">
                <span className="font-medium text-purple-800">Expertise:</span> {consultantInfo.expertise}
              </div>
            )}
            {consultantInfo.email && (
              <div className="bg-white px-3 py-1.5 rounded-md text-xs border border-purple-200 shadow-sm flex items-center">
                <Mail size={12} className="text-purple-600 mr-1" />
                {consultantInfo.email}
              </div>
            )}
            {consultantInfo.targetClient && (
              <div className="bg-white px-3 py-1.5 rounded-md text-xs border border-purple-200 shadow-sm">
                <Target size={12} className="text-purple-600 mr-1 inline-block" />
                {consultantInfo.targetClient}
              </div>
            )}
            {!consultantInfo.name && !consultantInfo.email && !consultantInfo.expertise && (
              <p className="text-sm text-purple-600">
                Add your consultant information to personalize the accelerator
              </p>
            )}
          </div>
        </div>
        
        {/* Progress Timeline */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Build Your Consulting Business in 6 Steps</h3>
          
          <div className="relative">
            {/* Timeline track */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200"></div>
            
            {/* Progress bar */}
            <div 
              className="absolute top-5 left-0 h-1 bg-indigo-600 transition-all duration-500" 
              style={{ width: `${(activeStep / steps.length) * 100}%` }}
            ></div>
            
            {/* Step indicators */}
            <div className="relative flex justify-between">
              {steps.map((step) => (
                <div 
                  key={step.id}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => setActiveStep(step.id)}
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                      step.id === activeStep 
                        ? `${getColorClass(step.color, 'bg')} ${getColorClass(step.color, 'text')} border-2 ${getColorClass(step.color, 'border')} shadow-md scale-110` 
                        : step.id < activeStep
                          ? 'bg-indigo-100 text-indigo-600 border border-indigo-300'
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}
                  >
                    {step.id < activeStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <span 
                    className={`mt-2 text-xs font-medium hidden md:block ${
                      step.id === activeStep ? getColorClass(step.color, 'text') : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Step Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Step Content */}
          <div className="md:col-span-2">
            <div className={`p-5 rounded-xl border ${getColorClass(steps[activeStep-1].color, 'border')} ${getColorClass(steps[activeStep-1].color, 'bg')}`}>
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center ${getColorClass(steps[activeStep-1].color, 'text')} mr-4 shadow-sm`}>
                  {steps[activeStep-1].icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {activeStep}. {steps[activeStep-1].title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {steps[activeStep-1].description}
                  </p>
                </div>
              </div>
              
              <div className="space-y-6 mt-6">
                {steps[activeStep-1].subSteps.map((subStep, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`w-8 h-8 rounded-full ${getColorClass(steps[activeStep-1].color, 'bg')} flex items-center justify-center text-sm font-medium ${getColorClass(steps[activeStep-1].color, 'text')} mr-3 flex-shrink-0`}>
                      {index + 1}
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 flex-1 shadow-sm">
                      <h4 className="font-medium text-gray-900">{subStep.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{subStep.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                {/* AI Model Selection */}
                <div className="w-full max-w-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    AI Model
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value as 'gemini-2.5-pro' | 'gemini-2.0-flash' | 'gemini-2.0-flash-light')}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="gemini-2.0-flash-light">Gemini 2.0 Flash Lite (Fastest)</option>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash (Balanced)</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro (Highest Quality)</option>
                  </select>
                </div>
                
                {/* Generate button */}
                <button
                  onClick={generateStepContent}
                  disabled={isGenerating}
                  className="mt-4 px-4 py-2 rounded-md text-white font-medium flex items-center bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Generate Guide
                    </>
                  )}
                </button>
              </div>
              
              {/* Generated Content Display */}
              {(generatedContent[`step-${activeStep}`] || isGenerating) && (
                <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Generated Content</h4>
                    <div className="flex space-x-2">
                      {generatedContent[`step-${activeStep}`] && !isGenerating && (
                        <>
                          <button 
                            onClick={() => navigator.clipboard.writeText(generatedContent[`step-${activeStep}`])}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Copy to clipboard"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                            </svg>
                          </button>
                          <button 
                            onClick={() => {
                              const blob = new Blob([generatedContent[`step-${activeStep}`]], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `consultant-${steps[activeStep-1].title.toLowerCase().replace(/\s+/g, '-')}.txt`;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Download as text file"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <svg className="animate-spin h-8 w-8 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-gray-600">Generating your consultant guide...</p>
                      <p className="text-sm text-gray-500 mt-1">This may take 20-40 seconds</p>
                    </div>
                  ) : errorMessage ? (
                    <div className="bg-red-50 p-4 rounded-md text-red-800">
                      <div className="flex">
                        <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p>{errorMessage}</p>
                          <button 
                            onClick={generateStepContent}
                            className="mt-2 text-sm text-red-600 hover:text-red-500"
                          >
                            Try Again
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : generatedContent[`step-${activeStep}`] ? (
                    <div className="prose max-w-none">
                      {generatedContent[`step-${activeStep}`].split('\n').map((line, i) => {
                        // Handle markdown-like formatting
                        if (line.startsWith('# ')) {
                          return <h1 key={i} className="text-xl font-bold">{line.substring(2)}</h1>;
                        } else if (line.startsWith('## ')) {
                          return <h2 key={i} className="text-lg font-semibold mt-4">{line.substring(3)}</h2>;
                        } else if (line.startsWith('### ')) {
                          return <h3 key={i} className="text-md font-medium mt-3">{line.substring(4)}</h3>;
                        } else if (line.startsWith('- ')) {
                          return <li key={i} className="ml-4">{line.substring(2)}</li>;
                        } else if (line.trim() === '') {
                          return <br key={i} />;
                        } else {
                          return <p key={i}>{line}</p>;
                        }
                      })}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <FileText className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                      <p>Click "Generate Guide" to create personalized content for this step</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-between items-center mt-6">
                <button 
                  onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                  className={`flex items-center text-sm px-3 py-1.5 rounded border ${
                    activeStep === 1 
                    ? 'text-gray-400 border-gray-200 cursor-not-allowed' 
                    : `${getColorClass(steps[activeStep-1].color, 'text')} ${getColorClass(steps[activeStep-1].color, 'border')} hover:bg-white`
                  }`}
                  disabled={activeStep === 1}
                >
                  Previous
                </button>
                <button 
                  onClick={() => setActiveStep(Math.min(steps.length, activeStep + 1))}
                  className={`flex items-center text-sm px-3 py-1.5 rounded border ${
                    activeStep === steps.length 
                    ? 'text-gray-400 border-gray-200 cursor-not-allowed' 
                    : `${getColorClass(steps[activeStep-1].color, 'text')} ${getColorClass(steps[activeStep-1].color, 'border')} hover:bg-white`
                  }`}
                  disabled={activeStep === steps.length}
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Sidebar - Program Benefits */}
          <div className="space-y-6">
            {/* Profile Preview */}
            <ConsultantPreview 
              consultantName={consultantInfo.name || "Your Name"} 
              consultantExpertise={consultantInfo.expertise || "Consultant"}
              consultantTarget={consultantInfo.targetClient || "Business Professionals"}
              activeStep={activeStep}
              onSelectStep={(step) => setActiveStep(step)}
            />
            
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
              <h4 className="font-semibold text-indigo-900 mb-3 flex items-center">
                <Award className="w-5 h-5 mr-2 text-indigo-600" />
                Why Use the Accelerator
              </h4>
              
              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="mt-0.5 mr-3 bg-white p-1.5 rounded-lg shadow-sm text-indigo-600">
                      {benefit.icon}
                    </div>
                    <div>
                      <h5 className="font-medium text-indigo-900">{benefit.title}</h5>
                      <p className="text-sm text-indigo-700">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-indigo-200">
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="font-medium text-indigo-800">Launch Discount:</span>
                  <span className="font-bold text-indigo-800">40% OFF</span>
                </div>
                <div className="text-xs text-center text-indigo-500 mt-2">
                  Be the first to use our consultant accelerator
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Get color class for a step
const getColorClass = (color: string, element: 'bg' | 'text' | 'border'): string => {
  const colorMap: Record<string, Record<string, string>> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
    green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' },
    red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' }
  };
  
  return colorMap[color]?.[element] || colorMap.blue[element];
};

// DollarSign component for use in benefits
const DollarSign = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 24, ...rest } = props;
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...rest}
    >
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
};

// LineChart component for use in benefits
const LineChart = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 24, ...rest } = props;
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...rest}
    >
      <path d="M3 3v18h18"></path>
      <path d="m19 9-5 5-4-4-3 3"></path>
    </svg>
  );
};

// Layers component for use in Step
const Layers = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 24, ...rest } = props;
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...rest}
    >
      <path d="m12.83 2.18 7.96 4.6a1.78 1.78 0 0 1 0 3.08l-7.96 4.6a1.95 1.95 0 0 1-1.95 0l-7.96-4.6a1.78 1.78 0 0 1 0-3.08l7.96-4.6a1.95 1.95 0 0 1 1.95 0Z"></path>
      <path d="m4.87 12.18 7.96 4.6c.61.35 1.35.35 1.95 0l7.96-4.6"></path>
      <path d="m4.87 16.18 7.96 4.6c.61.35 1.35.35 1.95 0l7.96-4.6"></path>
    </svg>
  );
};

export default ConsultantAccelerator;