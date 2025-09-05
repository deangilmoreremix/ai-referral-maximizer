import React, { useState, useEffect } from 'react';
import { X, Sparkles, RefreshCw, ArrowRight, ChevronDown, ChevronUp, FileText, Copy, CheckCircle, AlertCircle, FileCode } from 'lucide-react';
import { ContentTone, ContentLength, enhanceVoiceDropScript, enhanceSmsMessage, enhanceMessagingAppContent } from '../services/aiEnhancementService';

interface ContentEnhancementModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent: string;
  contentType: 'voice' | 'sms' | 'whatsapp';
  onEnhanced: (enhancedContent: string) => void;
}

const ContentEnhancementModal: React.FC<ContentEnhancementModalProps> = ({
  isOpen,
  onClose,
  initialContent,
  contentType,
  onEnhanced
}) => {
  const [enhancedContent, setEnhancedContent] = useState(initialContent);
  const [originalContent, setOriginalContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState<ContentTone>('professional');
  const [selectedLength, setSelectedLength] = useState<ContentLength>('standard');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-pro');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeEmojis, setIncludeEmojis] = useState(contentType !== 'voice');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Reset when content changes
  useEffect(() => {
    setOriginalContent(initialContent);
    setEnhancedContent(initialContent);
  }, [initialContent]);

  // Tone options by content type
  const getToneOptions = () => {
    const common: ContentTone[] = ['professional', 'conversational', 'friendly', 'persuasive'];
    
    if (contentType === 'voice') {
      return [...common, 'authoritative', 'reassuring'];
    } else if (contentType === 'sms') {
      return [...common, 'urgent', 'empathetic'];
    } else { // whatsapp
      return [...common, 'empathetic', 'friendly'];
    }
  };

  // Length options
  const getLengthOptions = () => {
    return ['concise', 'standard', 'detailed'] as ContentLength[];
  };

  // Enhance content
  const enhanceContent = async () => {
    setIsLoading(true);
    setError(null);
    setCopied(false);
    
    try {
      let enhanced: string;
      
      const commonParams = {
        content: originalContent,
        tone: selectedTone,
        length: selectedLength,
        model: selectedModel
      };
      
      // Call the appropriate enhancement function based on content type
      if (contentType === 'voice') {
        enhanced = await enhanceVoiceDropScript({
          ...commonParams,
          includeScriptNotes: true
        });
      } else if (contentType === 'sms') {
        enhanced = await enhanceSmsMessage({
          ...commonParams,
          includeEmojis,
          characterLimit: 160
        });
      } else { // whatsapp
        enhanced = await enhanceMessagingAppContent({
          ...commonParams,
          includeEmojis
        });
      }
      
      setEnhancedContent(enhanced);
    } catch (err: any) {
      console.error('Error enhancing content:', err);
      setError(err.message || 'Failed to enhance content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle apply enhanced content
  const handleApply = () => {
    onEnhanced(enhancedContent);
    onClose();
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(enhancedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset to original
  const handleReset = () => {
    setEnhancedContent(originalContent);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Sparkles size={22} className="text-indigo-600 mr-2" />
            AI Content Enhancement
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <p className="text-gray-600 mb-6">
            Use AI to enhance your {contentType === 'voice' ? 'voice drop script' : contentType === 'sms' ? 'SMS template' : 'WhatsApp message'} 
            with different tones and lengths.
          </p>
          
          {/* Enhancement Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Tone Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone
              </label>
              <div className="grid grid-cols-2 gap-2">
                {getToneOptions().map((tone) => (
                  <div
                    key={tone}
                    className={`
                      border p-2 rounded-md cursor-pointer text-center text-sm
                      ${selectedTone === tone ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 hover:bg-gray-50 text-gray-700'}
                    `}
                    onClick={() => setSelectedTone(tone)}
                  >
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Length Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Length
              </label>
              <div className="grid grid-cols-3 gap-2">
                {getLengthOptions().map((length) => (
                  <div
                    key={length}
                    className={`
                      border p-2 rounded-md cursor-pointer text-center text-sm
                      ${selectedLength === length ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 hover:bg-gray-50 text-gray-700'}
                    `}
                    onClick={() => setSelectedLength(length)}
                  >
                    {length.charAt(0).toUpperCase() + length.slice(1)}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Highest Quality)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Balanced)</option>
                <option value="gemini-2.0-flash-light">Gemini 2.0 Flash Light (Fastest)</option>
              </select>
            </div>
          </div>
          
          {/* Advanced Options Toggle */}
          <div className="mb-6">
            <button
              type="button"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? (
                <ChevronUp size={16} className="mr-1.5" />
              ) : (
                <ChevronDown size={16} className="mr-1.5" />
              )}
              Advanced Options
            </button>
            
            {showAdvanced && (
              <div className="mt-3 p-4 bg-gray-50 rounded-md border border-gray-200">
                {/* Content Type Specific Options */}
                {contentType !== 'voice' && (
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={includeEmojis}
                        onChange={(e) => setIncludeEmojis(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Include emojis</span>
                    </label>
                  </div>
                )}
                
                {/* Context Fields could go here */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Financial Services, Healthcare, Technology"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship Type (Optional)
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    defaultValue=""
                  >
                    <option value="">Select relationship</option>
                    <option value="client">Existing Client</option>
                    <option value="cold">Cold Contact</option>
                    <option value="warm">Warm Lead</option>
                    <option value="network">Network Connection</option>
                    <option value="referral">Previous Referrer</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          
          {/* Content Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Content
              </label>
              <div className="border border-gray-300 rounded-md p-4 bg-gray-50 h-64 overflow-y-auto">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                  {originalContent}
                </pre>
              </div>
            </div>
            
            {/* Enhanced Content */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Enhanced Content
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center p-1 border border-gray-300 rounded-md text-xs text-gray-700 bg-white hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    {copied ? (
                      <CheckCircle size={14} className="text-green-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center p-1 border border-gray-300 rounded-md text-xs text-gray-700 bg-white hover:bg-gray-50"
                    disabled={isLoading || enhancedContent === originalContent}
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>
              <div className="border border-gray-300 rounded-md p-4 bg-white h-64 overflow-y-auto relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                    <div className="flex flex-col items-center">
                      <RefreshCw size={24} className="text-indigo-600 animate-spin mb-2" />
                      <span className="text-sm text-indigo-700">Enhancing content...</span>
                    </div>
                  </div>
                ) : (
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                    {enhancedContent}
                  </pre>
                )}
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="text-sm text-gray-500 flex items-center">
            <FileCode size={16} className="mr-1.5 text-gray-400" />
            {selectedModel === 'gemini-2.5-pro' 
              ? 'Using Gemini 2.5 Pro (Highest Quality)' 
              : selectedModel === 'gemini-2.0-flash'
                ? 'Using Gemini 2.0 Flash (Balanced)'
                : 'Using Gemini 2.0 Flash Light (Fastest)'}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <button
              onClick={enhanceContent}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="mr-2" />
                  Enhance Content
                </>
              )}
            </button>
            
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              disabled={isLoading || enhancedContent === originalContent}
            >
              <ArrowRight size={16} className="mr-2" />
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEnhancementModal;