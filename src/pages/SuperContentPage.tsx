import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import SuperContentCreator from '../components/SuperContentCreator';
import StepProgress from '../components/StepProgress';

const SuperContentPage: React.FC = () => {
  return (
    <AppLayout 
      title="Super Content Creator" 
      description="Create comprehensive referral content across multiple methods" 
      navCurrent="super"
    >
      {/* Step Progress indicator */}
      <StepProgress currentStep={4} />
      
      <div className="mb-6 flex justify-between">
        <Link
          to="/content-generator"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Content Generator
        </Link>

        <Link
          to="/consultant"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          Next: Consultant Business Accelerator
          <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>

      <SuperContentCreator />

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

export default SuperContentPage;