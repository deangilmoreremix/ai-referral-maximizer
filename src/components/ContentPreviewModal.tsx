import React, { useState } from 'react';
import { X, Download, Target, Sparkles, Building, FileType, Linkedin, PaintBucket, Check, ArrowRight, CheckCircle, Database } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DaySelector from './DaySelector';

interface ContentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedContent: string | null;
  contentConfig: any;
  generatedContent: string;
  loading: boolean;
  onRevise: () => void;
  onRegenerate: () => void;
  onExport: () => void;
  hasMultipleDays?: boolean;
  selectedDay?: number;
  onDayChange?: (day: number) => void;
  totalDays?: number;
  errorMessage: string | null;
  profileData?: any;
  industry?: string;
  targetAudience?: string;
  exportFormat?: string;
  exportOptions?: string[];
  contentCategories?: Record<string, string>;
  onServiceGeneration?: (service: "linkedin-monetization" | "rebranding") => void;
  isSaving?: boolean;
  savedToDatabase?: boolean;
}

const ContentPreviewModal: React.FC<ContentPreviewModalProps> = ({
  isOpen,
  onClose,
  selectedContent,
  contentConfig,
  generatedContent,
  loading,
  onRevise,
  onRegenerate,
  onExport,
  hasMultipleDays = false,
  selectedDay = 1,
  onDayChange = () => {},
  totalDays = 14,
  errorMessage,
  profileData,
  industry,
  targetAudience,
  exportFormat = 'pdf',
  exportOptions = ['pdf'],
  contentCategories = {},
  onServiceGeneration = () => {},
  isSaving = false,
  savedToDatabase = false
}) => {
  const [isGeneratingService, setIsGeneratingService] = useState<"linkedin-monetization" | "rebranding" | null>(null);
  const [selectedService, setSelectedService] = useState<"linkedin-monetization" | "rebranding" | null>(null);
  const [serviceSelectionVisible, setServiceSelectionVisible] = useState<boolean>(false);
  const [serviceGenerationSuccess, setServiceGenerationSuccess] = useState<boolean>(false);
  
  const extractContentForDay = (content: string, day: number): string => {
    const dayPattern = new RegExp(`### DAY ${day}[^#]*(?=### DAY ${day + 1}|$)`, 'is');
    const match = content.match(dayPattern);
    return match ? match[0] : content;
  };
  
  // Process content to fix common issues that cause unwanted formatting
  const processContent = (content: string): string => {
    if (!content) return '';
    
    return content
      // Replace triple backticks which cause code blocks
      .replace(/```/g, '')
      // Replace tab characters that might cause code blocks
      .replace(/\t/g, '    ')
      // Clean up consecutive backticks
      .replace(/``/g, '')
      // Fix unintended blockquotes (> at beginning of line)
      .replace(/^>/gm, '\\>')
      // Fix any leftover code styling artifacts
      .replace(/`([^`]+)`/g, '**$1**');
  };
  
  const handleServiceSelection = (service: "linkedin-monetization" | "rebranding") => {
    setSelectedService(service);
  };

  const handleServiceGeneration = () => {
    if (!selectedService) return;

    setIsGeneratingService(selectedService);
    setServiceGenerationSuccess(false);
    onServiceGeneration(selectedService);
    
    // Reset the isGeneratingService state after a delay to show the loading state
    setTimeout(() => {
      setIsGeneratingService(null);
      setServiceGenerationSuccess(true);
    }, 2500);
  };
  
  if (!isOpen) return null;

  // Get the correct content based on day selection if needed
  const displayContent = hasMultipleDays
    ? extractContentForDay(generatedContent, selectedDay)
    : generatedContent;
    
  // Process the content to prevent unwanted gray boxes
  const processedContent = processContent(displayContent);

  // Service descriptions
  const serviceDescriptions = {
    "linkedin-monetization": {
      title: "LinkedIn Profile & Resume Monetization",
      icon: <Linkedin size={24} className="text-blue-600" />,
      description: "Help people turn their LinkedIn profile experience and resume into monetizable skills for platforms like TaskRabbit. Offered completely free with payment being only a testimonial and case study permission.",
      benefits: [
        "Identification of marketable skills from professional experience",
        "Translation of corporate experience to gig economy services",
        "Pricing strategy development for TaskRabbit",
        "Profile optimization for maximum visibility",
        "Strategic positioning in the marketplace"
      ],
      color: "blue"
    },
    "rebranding": {
      title: "Business Rebranding Service",
      icon: <PaintBucket size={24} className="text-purple-600" />,
      description: "Offer a complete business rebranding service at no monetary cost, with the only payment being a testimonial and permission to use the results as a case study.",
      benefits: [
        "Complete visual identity refresh",
        "Messaging and positioning strategy",
        "Market differentiation analysis",
        "Implementation guidance across all channels",
        "Measurable impact on business perception"
      ],
      color: "purple"
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            {contentConfig?.icon}
            <h2 className="text-xl font-medium text-gray-900 ml-2">
              {contentConfig?.title}
            </h2>
            {contentConfig?.category && contentCategories[contentConfig.category] && (
              <div className="ml-2 bg-gray-100 text-gray-700 rounded-full text-xs px-2 py-0.5">
                {contentCategories[contentConfig.category]}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {/* Database status badge */}
            {(isSaving || savedToDatabase) && (
              <div className={`flex items-center text-xs ${isSaving ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'} px-2 py-1 rounded-full`}>
                {isSaving ? (
                  <>
                    <Database size={12} className="mr-1 animate-pulse" />
                    Saving...
                  </>
                ) : savedToDatabase ? (
                  <>
                    <CheckCircle size={12} className="mr-1" />
                    Saved to dashboard
                  </>
                ) : null}
              </div>
            )}
            
            {generatedContent && !loading && (
              <>
                <button
                  onClick={onRevise}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                  title="Revise this content with specific instructions"
                >
                  <Target size={16} className="mr-2" />
                  Revise
                </button>
                <button
                  onClick={onRegenerate}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                  disabled={loading}
                  title="Regenerate content with current settings"
                >
                  <Sparkles size={16} className="mr-2" />
                  Regenerate
                </button>
                {contentConfig?.exportOptions && contentConfig.exportOptions.length > 0 && (
                  <button
                    onClick={onExport}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                    title={`Export as ${exportFormat.toUpperCase()}`}
                  >
                    <Download size={16} className="mr-2" />
                    Export {exportFormat.toUpperCase()}
                  </button>
                )}
              </>
            )}
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Service Selection Section - Enhanced with animation */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <Sparkles size={20} className="mr-2 text-amber-500" />
              Create Referral Content for Our Free Services
            </h3>
            <button 
              onClick={() => setServiceSelectionVisible(!serviceSelectionVisible)} 
              className="text-sm px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full flex items-center font-medium hover:bg-indigo-200 transition-colors"
            >
              {serviceSelectionVisible ? "Hide Service Options" : "Choose Service"}
              {serviceSelectionVisible ? 
                <CheckCircle size={16} className="ml-2" /> : 
                <ArrowRight size={16} className="ml-2" />
              }
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            Select which free service you want to promote in your referral content. 
            These services are provided at no cost, with the only "payment" being a testimonial and permission to use as a case study.
          </p>
          
          {/* Service selection cards with animation */}
          {serviceSelectionVisible && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* LinkedIn Monetization Service */}
              <div 
                className={`p-4 border rounded-lg relative overflow-hidden transition-all duration-300 cursor-pointer 
                  ${selectedService === "linkedin-monetization" 
                    ? "ring-2 ring-blue-500 border-blue-200 bg-blue-50 scale-[1.02]" 
                    : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"}
                `}
                onClick={() => handleServiceSelection("linkedin-monetization")}
              >
                <div className="flex items-start space-x-4 relative z-10">
                  <div className={`p-3 rounded-full ${selectedService === "linkedin-monetization" ? "bg-blue-100" : "bg-gray-100"}`}>
                    <Linkedin size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-lg text-blue-800">LinkedIn Profile & Resume Monetization</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Help transform professional experience into gig economy opportunities.
                    </p>
                    
                    {/* Only show benefits when selected */}
                    {selectedService === "linkedin-monetization" && (
                      <ul className="mt-3 space-y-1 animate-fadeIn">
                        {serviceDescriptions["linkedin-monetization"].benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle size={14} className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                            <span className="text-sm text-blue-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  {/* Selected checkmark */}
                  {selectedService === "linkedin-monetization" && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 animate-fadeIn">
                      <Check size={16} />
                    </div>
                  )}
                </div>
                
                {/* Background animation */}
                {selectedService === "linkedin-monetization" && (
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 bg-blue-600/5 w-32 h-32 rounded-full -mr-16 -mt-16 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 bg-blue-600/5 w-24 h-24 rounded-full -ml-12 -mb-12 animate-pulse" style={{animationDelay: "300ms"}}></div>
                  </div>
                )}
              </div>
              
              {/* Rebranding Service */}
              <div 
                className={`p-4 border rounded-lg relative overflow-hidden transition-all duration-300 cursor-pointer
                  ${selectedService === "rebranding" 
                    ? "ring-2 ring-purple-500 border-purple-200 bg-purple-50 scale-[1.02]" 
                    : "border-gray-200 hover:border-purple-200 hover:bg-purple-50"}
                `}
                onClick={() => handleServiceSelection("rebranding")}
              >
                <div className="flex items-start space-x-4 relative z-10">
                  <div className={`p-3 rounded-full ${selectedService === "rebranding" ? "bg-purple-100" : "bg-gray-100"}`}>
                    <PaintBucket size={24} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-lg text-purple-800">Business Rebranding Service</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Complete visual identity and messaging transformation for businesses.
                    </p>
                    
                    {/* Only show benefits when selected */}
                    {selectedService === "rebranding" && (
                      <ul className="mt-3 space-y-1 animate-fadeIn">
                        {serviceDescriptions["rebranding"].benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle size={14} className="text-purple-600 mt-1 mr-2 flex-shrink-0" />
                            <span className="text-sm text-purple-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  {/* Selected checkmark */}
                  {selectedService === "rebranding" && (
                    <div className="absolute top-2 right-2 bg-purple-500 text-white rounded-full p-1 animate-fadeIn">
                      <Check size={16} />
                    </div>
                  )}
                </div>
                
                {/* Background animation */}
                {selectedService === "rebranding" && (
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 bg-purple-600/5 w-32 h-32 rounded-full -mr-16 -mt-16 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 bg-purple-600/5 w-24 h-24 rounded-full -ml-12 -mb-12 animate-pulse" style={{animationDelay: "300ms"}}></div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Generate button - only show when a service is selected */}
          {selectedService && serviceSelectionVisible && (
            <div className="flex justify-center mt-4 mb-2">
              <button
                onClick={handleServiceGeneration}
                disabled={isGeneratingService !== null || serviceGenerationSuccess}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center
                  ${isGeneratingService !== null 
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                    : serviceGenerationSuccess
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : selectedService === "linkedin-monetization"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                  }
                  ${serviceGenerationSuccess ? "animate-bounce" : ""}
                `}
              >
                {isGeneratingService !== null ? (
                  <>
                    <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mr-2" 
                      style={{
                        borderColor: isGeneratingService === "linkedin-monetization" ? "#3b82f6" : "#9333ea", 
                        borderTopColor: "transparent"
                      }}></div>
                    <span>Generating Content...</span>
                  </>
                ) : serviceGenerationSuccess ? (
                  <>
                    <CheckCircle size={18} className="mr-2 text-green-600" />
                    <span>Content Successfully Generated!</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="mr-2" />
                    <span>Generate {selectedService === "linkedin-monetization" ? "LinkedIn" : "Rebranding"} Content</span>
                  </>
                )}
              </button>
            </div>
          )}
          
          {/* Service selection guide text - show when no service is selected */}
          {!selectedService && serviceSelectionVisible && (
            <div className="text-center py-2 text-sm text-gray-500">
              Choose one of the options above to generate referral content for that service
            </div>
          )}
          
          {/* Show brief selected service info when selection is collapsed */}
          {!serviceSelectionVisible && selectedService && (
            <div className={`p-3 rounded-lg border ${selectedService === "linkedin-monetization" ? "border-blue-200 bg-blue-50" : "border-purple-200 bg-purple-50"} flex items-center`}>
              <div className={`p-2 rounded-full ${selectedService === "linkedin-monetization" ? "bg-blue-100" : "bg-purple-100"} mr-3`}>
                {selectedService === "linkedin-monetization" ? <Linkedin size={18} className="text-blue-600" /> : <PaintBucket size={18} className="text-purple-600" />}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${selectedService === "linkedin-monetization" ? "text-blue-800" : "text-purple-800"}`}>
                  Selected Service: {selectedService === "linkedin-monetization" ? "LinkedIn Monetization" : "Business Rebranding"}
                </p>
                <p className="text-xs mt-0.5 text-gray-600">
                  Content is optimized for this free service offering
                </p>
              </div>
              {serviceGenerationSuccess && (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center">
                  <CheckCircle size={12} className="mr-1" />
                  Generated
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Day selector for multi-day content */}
        {selectedContent && hasMultipleDays && (
          <DaySelector
            selectedDay={selectedDay}
            onDayChange={onDayChange}
            totalDays={totalDays}
          />
        )}
        
        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Personalization Active Alert */}
          {profileData && (industry || targetAudience) && (
            <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Personalization active: {industry && <span className="font-medium">{industry}</span>} 
                    {targetAudience && <span>{industry ? ', ' : ''}targeting <span className="font-medium">{targetAudience}</span></span>}
                    {profileData?.fileName && <span> • Using analysis from <span className="font-medium">{profileData.fileName}</span></span>}
                    {profileData?.name && <span> • Using LinkedIn data from <span className="font-medium">{profileData.name}</span></span>}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Error message */}
          {errorMessage && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
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
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Generating content...</p>
              <p className="text-gray-500 text-sm mt-2">This may take up to 30 seconds</p>
            </div>
          ) : generatedContent ? (
            <div className="prose max-w-none markdown-content">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Override code blocks to remove gray background
                  code: ({ node, inline, className, children, ...props }) => {
                    if (inline) {
                      return <span className="font-medium" {...props}>{children}</span>;
                    }
                    return (
                      <div className="p-2 my-2 border border-gray-200 rounded text-gray-800">
                        {children}
                      </div>
                    );
                  },
                  // Override blockquotes to have cleaner styling
                  blockquote: ({ children }) => (
                    <div className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-2">
                      {children}
                    </div>
                  )
                }}
              >
                {processedContent}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Waiting for content generation...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentPreviewModal;