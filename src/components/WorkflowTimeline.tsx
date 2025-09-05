import React, { useState, useEffect } from 'react';
import { Check, Clock, FileCheck, MessageCircle, Sparkles, Download, Files, ArrowRight, User, Upload, Gift, CheckCircle, ChevronDown, RefreshCw, FileType } from 'lucide-react';

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  imageSrc: string;
  detailedSteps?: {
    title: string;
    description: string;
  }[];
  timeRequired: string;
  benefits: string[];
}

const WorkflowTimeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isInView, setIsInView] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const steps: WorkflowStep[] = [
    {
      id: 1,
      title: "Personalize",
      description: "Customize your referral content by industry, audience, and business size. Upload documents or LinkedIn profiles for enhanced personalization.",
      icon: <User size={20} className="text-green-600" />,
      imageSrc: "https://images.unsplash.com/photo-1542621334-a254cf47733d?auto=format&fit=crop&w=600&q=80",
      detailedSteps: [
        {
          title: "Enter Basic Info",
          description: "Select your industry, target audience, and business size from dropdown menus."
        },
        {
          title: "Upload Documents (Optional)",
          description: "Upload business documents, briefs, or brand guidelines for enhanced personalization."
        },
        {
          title: "LinkedIn Integration (Optional)",
          description: "Analyze LinkedIn profiles to extract professional details and target audience information."
        }
      ],
      timeRequired: "30-60 seconds",
      benefits: [
        "Document analysis technology",
        "LinkedIn profile integration",
        "Industry-specific terminology"
      ]
    },
    {
      id: 2,
      title: "Select Referral Method",
      description: "Choose from various professionally designed referral methods including phone scripts, meeting guides, reward programs, and more.",
      icon: <FileCheck size={20} className="text-blue-600" />,
      imageSrc: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80",
      detailedSteps: [
        {
          title: "Browse Categories",
          description: "Navigate referral methods by category (direct outreach, meetings, etc.) to quickly find what you need."
        },
        {
          title: "View Details",
          description: "Click any referral method to see a preview, typical use cases, and available export formats."
        },
        {
          title: "Make Selection",
          description: "Click on your desired referral method to begin the generation process."
        }
      ],
      timeRequired: "10-20 seconds",
      benefits: [
        "15+ professional referral methods",
        "Organized by communication channel",
        "Previews of all formats"
      ]
    },
    {
      id: 3,
      title: "Generate Content",
      description: "Our AI creates professional, tailored referral content based on your specifications in seconds. No more writer's block or lengthy revisions.",
      icon: <Sparkles size={20} className="text-purple-600" />,
      imageSrc: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&w=600&q=80",
      detailedSteps: [
        {
          title: "Process Begins",
          description: "The AI analyzes your requirements and begins generating content tailored to your needs."
        },
        {
          title: "Content Creation",
          description: "Advanced AI algorithms create professional-quality referral scripts with proper structure and formatting."
        },
        {
          title: "Review Generated Content",
          description: "Preview the generated content directly in the browser with markdown formatting."
        }
      ],
      timeRequired: "15-90 seconds",
      benefits: [
        "State-of-the-art AI technology",
        "Industry-specific terminology",
        "Professional formatting"
      ]
    },
    {
      id: 4,
      title: "Export & Use",
      description: "Download your referral content in multiple formats including PDF, PowerPoint, or Word. Ready to share with clients or team members.",
      icon: <Download size={20} className="text-indigo-600" />,
      imageSrc: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80",
      detailedSteps: [
        {
          title: "Fine-tune (Optional)",
          description: "Use the revision feature to make specific changes or adjustments to the content."
        },
        {
          title: "Select Export Format",
          description: "Choose from PDF, PowerPoint, Word, or other format options depending on content type."
        },
        {
          title: "Download and Share",
          description: "Download your finished content in your preferred format, ready to use or further customize."
        }
      ],
      timeRequired: "5-10 seconds",
      benefits: [
        "Multiple export formats",
        "Ready-to-use documents",
        "Professional design and layout"
      ]
    }
  ];
  
  useEffect(() => {
    // Set up intersection observer for animation
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.2 }
    );
    
    const element = document.getElementById('workflow-timeline');
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);
  
  useEffect(() => {
    if (isInView && !shouldAnimate) {
      setShouldAnimate(true);
    }
  }, [isInView, shouldAnimate]);
  
  // Auto-cycle through the steps when in view
  useEffect(() => {
    if (!shouldAnimate) return;
    
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev % steps.length) + 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [shouldAnimate, steps.length]);
  
  const activeStepData = steps.find(step => step.id === activeStep) || steps[0];
  
  return (
    <div id="workflow-timeline" className="max-w-6xl mx-auto">
      {/* Timeline steps */}
      <div className="relative mb-12">
        {/* Progress bar */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded">
          <div 
            className="h-full bg-green-600 rounded transition-all duration-700 ease-in-out"
            style={{ width: `${(activeStep - 1) * 100 / (steps.length - 1)}%` }}
          ></div>
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between relative">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="z-10 flex flex-col items-center"
              onClick={() => setActiveStep(step.id)}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 ${
                  step.id === activeStep
                    ? 'bg-green-600 text-white shadow-lg scale-110'
                    : step.id < activeStep
                      ? 'bg-green-100 text-green-600 border-2 border-green-600'
                      : 'bg-gray-100 text-gray-500 border border-gray-300'
                }`}
              >
                {step.id < activeStep ? (
                  <Check size={20} className="text-green-600" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
              
              <div 
                className={`mt-2 text-center transition-all duration-500 ${
                  step.id === activeStep ? 'opacity-100 font-medium' : 'opacity-70'
                }`}
              >
                <p className={`text-sm ${step.id === activeStep ? 'text-green-600' : 'text-gray-600'}`}>
                  {step.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Active step details */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="flex flex-col md:flex-row">
          <div className={`md:w-1/2 p-6 flex flex-col justify-center ${showDetails ? 'border-b md:border-b-0 md:border-r border-gray-200' : ''}`}>
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                {activeStepData.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Step {activeStepData.id}: {activeStepData.title}
              </h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              {activeStepData.description}
            </p>
            
            {!showDetails ? (
              <>
                <div className="flex items-center text-sm text-green-600 mb-4">
                  <Clock size={16} className="mr-2" />
                  <span>Time required: {activeStepData.timeRequired}</span>
                </div>
                
                <button 
                  onClick={() => setShowDetails(true)}
                  className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center self-start"
                >
                  See detailed steps
                  <ArrowRight size={16} className="ml-1" />
                </button>
              </>
            ) : (
              <>
                <div className="mb-4 space-y-4">
                  {activeStepData.detailedSteps?.map((detail, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0 mt-1 mr-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium text-xs">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 text-sm">{detail.title}</h4>
                        <p className="text-sm text-gray-600">{detail.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => setShowDetails(false)}
                  className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center self-start"
                >
                  Hide details
                  <ChevronDown size={16} className="ml-1" />
                </button>
              </>
            )}
            
            {!showDetails && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-800 text-sm mb-2 flex items-center">
                  <Gift size={16} className="text-green-600 mr-1.5" />
                  Key Benefits
                </h4>
                <ul className="space-y-1">
                  {activeStepData.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle size={14} className="text-green-500 mr-1.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
            <img 
              src={activeStepData.imageSrc} 
              alt={activeStepData.title} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-900 to-transparent h-1/3 opacity-70"></div>
            <div className="absolute bottom-4 left-4 bg-green-600 text-white text-sm font-medium px-3 py-1 rounded">
              Step {activeStepData.id}
            </div>
            
            {/* Step-specific overlays */}
            {activeStep === 1 && (
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2 text-sm text-gray-800 max-w-[160px] transform -rotate-1">
                <div className="flex items-center text-green-600 font-medium mb-1">
                  <Upload size={14} className="mr-1" />
                  Personalization
                </div>
                <ul className="text-xs space-y-1">
                  <li className="flex items-center">
                    <CheckCircle size={10} className="text-green-500 mr-1" />
                    Industry: Technology
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={10} className="text-green-500 mr-1" />
                    Audience: CTOs
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={10} className="text-green-500 mr-1" />
                    Document uploaded
                  </li>
                </ul>
              </div>
            )}
            
            {activeStep === 2 && (
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2 text-sm text-gray-800 max-w-[160px] transform rotate-2">
                <div className="flex items-center text-green-600 font-medium mb-1">
                  <Files size={14} className="mr-1" />
                  Referral Methods
                </div>
                <ul className="text-xs space-y-1">
                  <li className="flex items-center">
                    <CheckCircle size={10} className="text-green-500 mr-1" />
                    Phone Scripts
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={10} className="text-green-500 mr-1" />
                    Face-to-Face Meetings
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={10} className="text-green-500 mr-1" />
                    WhatsApp Campaigns
                  </li>
                </ul>
              </div>
            )}
            
            {activeStep === 3 && (
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2 text-sm text-gray-800 max-w-[160px] transform rotate-1">
                <div className="flex items-center text-purple-600 font-medium mb-1">
                  <Sparkles size={14} className="mr-1" />
                  AI Generation
                </div>
                <div className="text-xs space-y-1">
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full animate-pulse" style={{ width: '75%' }}></div>
                  </div>
                  <p>Content being created...</p>
                </div>
              </div>
            )}
            
            {activeStep === 4 && (
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2 text-sm text-gray-800 max-w-[160px] transform -rotate-1">
                <div className="flex items-center text-indigo-600 font-medium mb-1">
                  <Download size={14} className="mr-1" />
                  Export Options
                </div>
                <ul className="text-xs space-y-1">
                  <li className="flex items-center">
                    <FileType size={10} className="text-red-500 mr-1" />
                    PDF Document
                  </li>
                  <li className="flex items-center">
                    <FileType size={10} className="text-blue-500 mr-1" />
                    Word Document (DOCX)
                  </li>
                  <li className="flex items-center">
                    <FileType size={10} className="text-orange-500 mr-1" />
                    PowerPoint (PPTX)
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Timeline Bottom Navigation */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center">
          <div className="text-xs text-gray-500 flex items-center">
            <Clock size={14} className="mr-1 text-green-600" />
            <span>Total process time: ~2 minutes</span>
          </div>
          
          <div className="flex space-x-3">
            {activeStep < 4 ? (
              <button 
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md flex items-center transition-colors"
              >
                Next Step
                <ArrowRight size={14} className="ml-1.5" />
              </button>
            ) : (
              <button 
                onClick={() => setActiveStep(1)}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md flex items-center transition-colors"
              >
                Start Over
                <RefreshCw size={14} className="ml-1.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowTimeline;