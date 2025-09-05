import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import { CommunicationProvider } from '../contexts/CommunicationContext';
import ErrorBoundary from '../contexts/ErrorBoundary';
import ChatbotPage from '../ChatbotPage';
import StepProgress from '../components/StepProgress';

const VoiceSmsPage: React.FC = () => {
  return (
    <AppLayout 
      title="Voice & SMS Tools" 
      description="Create personalized voice drops and SMS templates for your referral outreach" 
      navCurrent="chatbot"
    >
      {/* Step Progress indicator */}
      <StepProgress currentStep={5} />
      
      <div className="mb-6 flex justify-between">
        <Link
          to="/super-creator"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Super Content Creator
        </Link>
        
        <Link
          to="/consultant"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          Next: Consultant Business Accelerator
          <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
      
      <ErrorBoundary>
        <CommunicationProvider>
          <ChatbotPage />
        </CommunicationProvider>
      </ErrorBoundary>
      
      <div className="mt-6 flex justify-end">
        <Link
          to="/consultant"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          Next: Consultant Business Accelerator
          <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
    </AppLayout>
  );
};

export default VoiceSmsPage;