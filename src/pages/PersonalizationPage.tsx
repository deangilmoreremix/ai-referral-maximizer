import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import PersonalizerModal from '../components/PersonalizerModal';
import StepProgress from '../components/StepProgress';

const PersonalizationPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [personalizationData, setPersonalizationData] = useState({
    industry: '',
    targetAudience: '',
    businessSize: '',
    specialRequirements: '',
    profileData: null
  });

  const handleApplySettings = (
    industry: string, 
    targetAudience: string, 
    businessSize: string, 
    specialRequirements: string, 
    profileData?: any
  ) => {
    setPersonalizationData({
      industry,
      targetAudience,
      businessSize,
      specialRequirements,
      profileData: profileData || null
    });
    setIsModalOpen(false);
  };

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      const savedPersonalization = localStorage.getItem('personalization');
      if (savedPersonalization) {
        const data = JSON.parse(savedPersonalization);
        setPersonalizationData({
          industry: data.industry || '',
          targetAudience: data.targetAudience || '',
          businessSize: data.businessSize || '',
          specialRequirements: data.specialRequirements || '',
          profileData: data.profileData || null
        });
      }
    } catch (e) {
      console.error("Error loading saved personalization data:", e);
    }
  }, []);

  return (
    <AppLayout 
      title="Personalization Settings" 
      description="Customize your content generation experience" 
      navCurrent="personalize"
    >
      {/* Step Progress indicator */}
      <StepProgress currentStep={1} />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Personalization Settings</h2>
        
        {personalizationData.industry || personalizationData.targetAudience ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Industry</h3>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                {personalizationData.industry || 'Not specified'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Target Audience</h3>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                {personalizationData.targetAudience || 'Not specified'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Business Size</h3>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                {personalizationData.businessSize || 'Not specified'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Special Requirements</h3>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200 max-h-24 overflow-y-auto">
                {personalizationData.specialRequirements || 'None'}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  No personalization settings have been configured yet. Click "Edit Settings" to personalize your content generation.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {personalizationData.profileData && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Analyzed Data</h3>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-blue-700">
                {personalizationData.profileData.fileName ? 
                  `Document analysis from: ${personalizationData.profileData.fileName}` : 
                  personalizationData.profileData.name ? 
                  `LinkedIn profile analysis for: ${personalizationData.profileData.name}` : 
                  'Analysis data available'}
              </p>
            </div>
          </div>
        )}
        
        <div className="flex justify-between">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Settings
          </button>
          
          <div className="flex space-x-3">
            <Link
              to="/"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>
            
            <Link
              to="/ai-settings"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              Next: AI Settings
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
      
      <PersonalizerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApplySettings}
      />
    </AppLayout>
  );
};

export default PersonalizationPage;