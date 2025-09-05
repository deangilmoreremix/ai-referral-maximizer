import React, { useState, useEffect } from 'react';
import { X, FileEdit, Sparkles, CheckCircle, Lightbulb } from 'lucide-react';

interface ContentRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (revisionInstructions: string) => void;
  contentType: string;
}

const ContentRevisionModal: React.FC<ContentRevisionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  contentType
}) => {
  const [revisionInstructions, setRevisionInstructions] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  
  // Reset the form when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setRevisionInstructions('');
      setSelectedSuggestion(null);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const suggestions = [
    "Make it more persuasive and emphasize the benefits more clearly",
    "Use a more conversational tone throughout the content",
    "Add more specific examples and case studies",
    "Make it more technical with industry-specific terminology",
    "Simplify the language for a broader audience",
    "Add more data points and statistics to support the claims",
    "Focus more on the ROI and value proposition",
    "Add a clear call-to-action at the end of each section"
  ];
  
  const handleSelectSuggestion = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    setRevisionInstructions(suggestion);
  };
  
  const handleSubmit = () => {
    if (revisionInstructions.trim() === '') return;
    onSubmit(revisionInstructions);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <FileEdit size={22} className="text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-800">Revise Content</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">
          Tell us how you'd like to improve the generated {contentType}. Be specific about what changes you want to see.
        </p>
        
        {/* Revision Instructions */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Revision Instructions
          </label>
          <textarea
            value={revisionInstructions}
            onChange={(e) => setRevisionInstructions(e.target.value)}
            placeholder="Enter your revision instructions here..."
            rows={5}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        
        {/* Suggestions */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <Lightbulb size={16} className="text-amber-500 mr-2" />
            <h4 className="text-gray-700 font-medium">Revision Suggestions</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className={`p-2 border rounded-lg cursor-pointer text-sm ${
                  selectedSuggestion === suggestion 
                    ? 'bg-blue-50 border-blue-300' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {selectedSuggestion === suggestion && (
                  <CheckCircle size={14} className="inline-block text-blue-600 mr-2" />
                )}
                {suggestion}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={revisionInstructions.trim() === ''}
            className={`px-4 py-2 flex items-center rounded transition-colors ${
              revisionInstructions.trim() === ''
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Sparkles size={16} className="mr-2" />
            Apply Revision
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentRevisionModal;