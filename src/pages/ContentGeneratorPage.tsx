import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import App from '../App';
import StepProgress from '../components/StepProgress';

const ContentGeneratorPage: React.FC = () => {
  return (
    <AppLayout 
      title="Content Generator" 
      description="Generate professional referral content with AI" 
      navCurrent="app"
    >
      {/* Step Progress indicator */}
      <StepProgress currentStep={3} />
      
      <div className="mb-6 flex justify-between">
        <Link
          to="/ai-settings"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to AI Settings
        </Link>
        
        <Link
          to="/super-creator"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          Next: Super Content Creator
          <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
      
      {/* Embed the existing App component */}
      <App />
      
      <div className="mt-6 flex justify-end">
        <Link
          to="/super-creator"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          Next: Super Content Creator
          <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
    </AppLayout>
  );
};

export default ContentGeneratorPage;