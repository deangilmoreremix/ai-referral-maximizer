import React, { useState, useEffect } from 'react';
import { FileText, Zap, ChevronDown, ChevronUp, MessageSquare, Copy, Check, Download, Brain, Clock, Info, AlertCircle, RefreshCw, LayoutDashboard, CheckCircle } from 'lucide-react';
import { generateContent } from '../../services/openAIService';

type AIModel = 'gemini-2.5-pro' | 'gemini-2.0-flash' | 'gemini-2.0-flash-light';

interface ContentTemplateProps {
  templateName: string;
  defaultModel?: AIModel;
}

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: React.ReactNode;
  estimatedLength: string;
  defaultModel?: AIModel;
}

const AgencyContentGenerator: React.FC<ContentTemplateProps> = ({ 
  templateName = 'agency-service-description',
  defaultModel = 'gemini-2.0-flash'
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(templateName);
  const [selectedModel, setSelectedModel] = useState<AIModel>(defaultModel);
  const [industry, setIndustry] = useState<string>('Technology');
  const [targetAudience, setTargetAudience] = useState<string>('Small business owners');
  const [businessSize, setBusinessSize] = useState<string>('Small to medium');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedTemplates, setSavedTemplates] = useState<string[]>([]);
  
  // Content templates for agencies to offer to clients
  const contentTemplates: Record<string, ContentTemplate> = {
    'agency-service-description': {
      id: 'agency-service-description',
      name: 'Agency Service Description',
      description: 'Professional service description for your AI referral generation agency',
      prompt: 'Create a professional service description for an AI-powered referral generation agency. The agency helps clients generate more referrals using AI technology. Include a compelling headline, overview of the service, key benefits, how the process works, and a strong call-to-action. Make it persuasive and professional.',
      icon: <LayoutDashboard size={16} className="mr-2 text-indigo-600" />,
      estimatedLength: '400-600 words',
      defaultModel: 'gemini-2.0-flash'
    },
    'client-proposal': {
      id: 'client-proposal',
      name: 'Client Proposal',
      description: 'Customizable proposal template for potential clients',
      prompt: 'Create a comprehensive client proposal template for an AI referral generation agency. Include sections for: 1) Executive Summary, 2) Client Challenges, 3) Proposed Solution with AI referral generation, 4) Implementation Process, 5) Pricing, 6) Expected Results, and 7) Next Steps. The proposal should be persuasive, professional, and highlight the benefits of AI-powered referral generation. Make it customizable with placeholders for client-specific information.',
      icon: <FileText size={16} className="mr-2 text-blue-600" />,
      estimatedLength: '800-1200 words',
      defaultModel: 'gemini-2.5-pro'
    },
    'marketing-email': {
      id: 'marketing-email',
      name: 'Marketing Email Sequence',
      description: '3-part email sequence to promote your referral agency',
      prompt: 'Create a 3-part email sequence for a marketing campaign promoting an AI-powered referral generation agency. The emails should be designed to educate prospects about the benefits of using AI for referral generation and persuade them to book a consultation. Include compelling subject lines for each email. Email 1 should introduce the concept and problem, Email 2 should explain the agency\'s solution, and Email 3 should include testimonials and a strong call to action. Make each email 200-300 words long and clearly label them as Email 1, Email 2, and Email 3.',
      icon: <MessageSquare size={16} className="mr-2 text-green-600" />,
      estimatedLength: '800-1000 words',
      defaultModel: 'gemini-2.0-flash'
    },
    'case-study': {
      id: 'case-study',
      name: 'Client Case Study',
      description: 'Template for showcasing client success stories',
      prompt: 'Create a detailed case study template for an AI referral generation agency to showcase client success stories. The case study should include sections for: 1) Client Background and Challenges, 2) Goals, 3) Solution Implementation, 4) Results and ROI, and 5) Client Testimonial. Include placeholders for metrics and specific results. The tone should be professional and data-driven while highlighting the effectiveness of AI-powered referral generation services.',
      icon: <CheckCircle size={16} className="mr-2 text-purple-600" />,
      estimatedLength: '700-900 words',
      defaultModel: 'gemini-2.0-flash'
    },
    'onboarding-checklist': {
      id: 'onboarding-checklist',
      name: 'Client Onboarding Checklist',
      description: 'Step-by-step process for bringing on new clients',
      prompt: 'Create a detailed client onboarding checklist for an AI referral generation agency. Include all necessary steps from initial contract signing to full implementation of referral systems. The checklist should cover: gathering client information, setting up accounts and permissions, configuring AI tools, establishing baseline metrics, training client team members, and launching the referral system. Format the checklist in a clear, sequential manner with sections and subsections. Add notes for internal agency use regarding best practices for each step.',
      icon: <Clock size={16} className="mr-2 text-amber-600" />,
      estimatedLength: '500-700 words',
      defaultModel: 'gemini-2.0-flash-light'
    }
  };
  
  // Set default template based on prop
  useEffect(() => {
    if (templateName && contentTemplates[templateName]) {
      setSelectedTemplate(templateName);
      if (contentTemplates[templateName].defaultModel) {
        setSelectedModel(contentTemplates[templateName].defaultModel!);
      }
    }
  }, [templateName]);
  
  // Get template details
  const getTemplate = () => {
    return contentTemplates[selectedTemplate] || contentTemplates['agency-service-description'];
  };
  
  // Generate content with selected model
  const handleGenerateContent = async () => {
    setIsGenerating(true);
    setError(null);
    
    const template = getTemplate();
    
    try {
      // Construct the prompt with additional context
      const enhancedPrompt = `
${template.prompt}

ADDITIONAL CONTEXT:
Industry: ${industry}
Target Audience: ${targetAudience}
Business Size: ${businessSize}
${specialInstructions ? `Special Instructions: ${specialInstructions}` : ''}

Please format with clear headings, paragraphs, and bullet points where appropriate for readability.
      `.trim();
      
      // Generate content using the selected model
      const content = await generateContent({
        contentType: template.name,
        specialRequirements: enhancedPrompt,
        model: selectedModel
      });
      
      setGeneratedContent(content);
      
    } catch (err) {
      console.error('Error generating content:', err);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Copy content to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Save template
  const handleSaveTemplate = () => {
    if (generatedContent) {
      setSavedTemplates([...savedTemplates, selectedTemplate]);
      // Could also save to localStorage or a database in a real implementation
      alert('Template saved for future use!');
    }
  };
  
  // Download content as text file
  const handleDownload = () => {
    if (!generatedContent) return;
    
    const template = getTemplate();
    const filename = `${template.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Get model name for display
  const getModelDisplayName = (model: AIModel): string => {
    switch (model) {
      case 'gemini-2.5-pro':
        return 'Gemini 2.5 Pro';
      case 'gemini-2.0-flash':
        return 'Gemini 2.0 Flash';
      case 'gemini-2.0-flash-light':
        return 'Gemini 2.0 Flash Lite';
      default:
        return model;
    }
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4">
        <div className="flex items-center">
          <Brain className="h-6 w-6 mr-2" />
          <h2 className="text-xl font-bold">AI Content Generator for Agencies</h2>
        </div>
        <p className="text-indigo-100 text-sm mt-1">
          Create professional agency content using Gemini AI models
        </p>
      </div>
      
      {/* Templates and Generation Options */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Template selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Template
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {Object.values(contentTemplates).map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500 flex items-center">
              {getTemplate().icon}
              {getTemplate().description}
            </p>
          </div>
          
          {/* AI model selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as AIModel)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="gemini-2.0-flash-light">Gemini 2.0 Flash Lite (Fastest)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Balanced)</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro (Highest Quality)</option>
            </select>
            <p className="mt-1 text-sm text-gray-500 flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-400" />
              {selectedModel === 'gemini-2.0-flash-light' && 'Fast generation (5-10 seconds)'}
              {selectedModel === 'gemini-2.0-flash' && 'Balanced speed and quality (10-20 seconds)'}
              {selectedModel === 'gemini-2.5-pro' && 'Highest quality output (20-40 seconds)'}
            </p>
          </div>
        </div>
        
        {/* Instructions toggle */}
        <div className="mt-4">
          <button
            type="button"
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
            onClick={() => setShowInstructions(!showInstructions)}
          >
            {showInstructions ? (
              <ChevronUp className="h-4 w-4 mr-1" />
            ) : (
              <ChevronDown className="h-4 w-4 mr-1" />
            )}
            {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
          </button>
          
          {showInstructions && (
            <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-100">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">
                    {getTemplate().name} Template
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    This template will generate {getTemplate().estimatedLength} of content. For best results, 
                    provide industry details and target audience information below.
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    Estimated generation time: {selectedModel === 'gemini-2.5-pro' ? '20-40' : 
                                              selectedModel === 'gemini-2.0-flash' ? '10-20' : '5-10'} seconds
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Basic customization options */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <input
              type="text"
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Technology, Finance, Healthcare"
            />
          </div>
          <div>
            <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-1">
              Target Audience
            </label>
            <input
              type="text"
              id="audience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Small business owners, Marketing directors"
            />
          </div>
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
              Business Size
            </label>
            <input
              type="text"
              id="size"
              value={businessSize}
              onChange={(e) => setBusinessSize(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Small, Medium, Enterprise"
            />
          </div>
        </div>
        
        {/* Advanced options toggle */}
        <div className="mt-4">
          <button
            type="button"
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          >
            {showAdvancedOptions ? (
              <ChevronUp className="h-4 w-4 mr-1" />
            ) : (
              <ChevronDown className="h-4 w-4 mr-1" />
            )}
            {showAdvancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </button>
          
          {showAdvancedOptions && (
            <div className="mt-2">
              <label htmlFor="special-instructions" className="block text-sm font-medium text-gray-700 mb-1">
                Special Instructions
              </label>
              <textarea
                id="special-instructions"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter any specific requirements or instructions for content generation..."
              ></textarea>
            </div>
          )}
        </div>
        
        {/* Generate button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGenerateContent}
            disabled={isGenerating}
            className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              isGenerating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Generating with {getModelDisplayName(selectedModel)}...
              </>
            ) : (
              <>
                <Zap className="-ml-1 mr-2 h-4 w-4" />
                Generate {getTemplate().name}
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Generated Content Display */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-gray-900">Generated Content</h3>
          {generatedContent && (
            <div className="flex space-x-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={handleSaveTemplate}
                disabled={!generatedContent}
                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FileText className="h-4 w-4 mr-1" />
                Save
              </button>
              <button
                onClick={handleDownload}
                disabled={!generatedContent}
                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
            </div>
          )}
        </div>
        
        <div className="border border-gray-300 rounded-md bg-gray-50 min-h-[300px] max-h-[500px] overflow-y-auto relative">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-64">
              <RefreshCw className="animate-spin h-8 w-8 text-indigo-500 mb-2" />
              <p className="text-sm text-gray-500">Generating with {getModelDisplayName(selectedModel)}...</p>
              <p className="text-xs text-gray-400 mt-1">This may take 5-40 seconds depending on the model</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="bg-red-50 text-red-800 p-4 rounded-md max-w-md">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium">Error generating content</h3>
                    <p className="mt-1 text-sm">{error}</p>
                    <button
                      className="mt-2 text-sm text-red-600 hover:text-red-500"
                      onClick={handleGenerateContent}
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : generatedContent ? (
            <div className="p-4">
              <div className="prose max-w-none">
                {generatedContent.split('\n').map((paragraph, i) => {
                  // Handle markdown-like formatting
                  if (paragraph.startsWith('# ')) {
                    return <h1 key={i} className="text-2xl font-bold mb-3">{paragraph.substring(2)}</h1>;
                  } else if (paragraph.startsWith('## ')) {
                    return <h2 key={i} className="text-xl font-bold mb-2 mt-4">{paragraph.substring(3)}</h2>;
                  } else if (paragraph.startsWith('### ')) {
                    return <h3 key={i} className="text-lg font-semibold mb-2 mt-3">{paragraph.substring(4)}</h3>;
                  } else if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                    return <li key={i} className="ml-4">{paragraph.substring(2)}</li>;
                  } else if (paragraph === '') {
                    return <br key={i} />;
                  } else {
                    return <p key={i} className="mb-2">{paragraph}</p>;
                  }
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <FileText className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500">Select a template and click "Generate" to create content</p>
              <p className="text-xs text-gray-400 mt-1">Powered by Gemini AI models</p>
            </div>
          )}
        </div>
        
        {generatedContent && (
          <div className="mt-3 p-3 bg-indigo-50 rounded-md text-xs text-indigo-700 flex items-start">
            <Info className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
            <p>
              This content was generated using {getModelDisplayName(selectedModel)}. Remember that AI-generated content should always be reviewed and edited before client use. You can iterate on this content by adjusting parameters and regenerating.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgencyContentGenerator;