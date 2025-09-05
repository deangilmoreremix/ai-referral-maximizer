import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Brain, Zap, Sparkles, Info } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import AIModelSelector, { AIModel } from '../components/AIModelSelector';
import RelationshipTypeSelector, { RelationshipType } from '../components/RelationshipTypeSelector';
import StepProgress from '../components/StepProgress';

const AISettingsPage: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<AIModel>('gemini-2.5-pro');
  const [relationshipType, setRelationshipType] = useState<RelationshipType | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('aiSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.model) setSelectedModel(settings.model);
        if (settings.relationshipType) setRelationshipType(settings.relationshipType);
      }
    } catch (e) {
      console.error("Error loading saved AI settings:", e);
    }
  }, []);

  const handleSaveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem('aiSettings', JSON.stringify({
      model: selectedModel,
      relationshipType
    }));
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <AppLayout 
      title="AI Model Settings" 
      description="Configure the AI models and parameters for content generation" 
      navCurrent="ai-settings"
    >
      {/* Step Progress indicator */}
      <StepProgress currentStep={2} />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Brain size={24} className="text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">AI Model Configuration</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            Select the AI model that best fits your content generation needs. Different models offer various trade-offs between quality, detail, and generation speed.
          </p>
          
          <AIModelSelector 
            selectedModel={selectedModel}
            onChange={setSelectedModel}
            className="mb-8"
          />
          
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Zap size={24} className="text-amber-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Relationship Context</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Specify the relationship context to help the AI generate more appropriate content for your specific relationship with the recipient.
            </p>
            
            <RelationshipTypeSelector 
              selectedRelationship={relationshipType}
              onChange={setRelationshipType}
              label="Relationship Type"
            />
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-6">
            <div className="flex">
              <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5 mr-3" />
              <div>
                <h3 className="font-medium text-blue-800 mb-1">About AI Settings</h3>
                <p className="text-sm text-blue-700">
                  These settings will be applied to all content generation until you change them. The AI model selection affects generation quality and speed, while the relationship context helps tailor the content to specific connection types.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
          >
            <Sparkles size={16} className="mr-2" />
            Save Settings
          </button>
          
          {saveSuccess && (
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md flex items-center">
              Settings saved successfully!
            </div>
          )}
          
          <div className="flex space-x-3">
            <Link
              to="/personalize"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Personalization
            </Link>
            
            <Link
              to="/content-generator"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              Next: Content Generator
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AISettingsPage;