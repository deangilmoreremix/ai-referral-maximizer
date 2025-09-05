import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import { AgencyProvider } from '../contexts/AgencyContext';
import AgencyAccelerator from '../components/AgencyAccelerator';
import StepProgress from '../components/StepProgress';

const AgencyAcceleratorPage: React.FC = () => {
  return (
    <AppLayout 
      title="AI Agency Accelerator" 
      description="Transform your freelance business into a thriving AI agency" 
      navCurrent="agency"
    >
      {/* Step Progress indicator */}
      <StepProgress currentStep={7} />
      
      <div className="mb-6 flex justify-between">
        <Link
          to="/consultant"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Consultant Business Accelerator
        </Link>
        
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          Next: Dashboard
          <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
      
      <AgencyProvider>
        <AgencyAccelerator />
      </AgencyProvider>
      
      <div className="mt-6 flex justify-end">
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          Next: Dashboard
          <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
    </AppLayout>
  );
};

export default AgencyAcceleratorPage;