import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import { ConsultantProvider } from '../contexts/ConsultantContext';
import ConsultantAccelerator from '../components/ConsultantAccelerator';
import StepProgress from '../components/StepProgress';

const ConsultantAcceleratorPage: React.FC = () => {
  return (
    <AppLayout 
      title="Consultant Business Accelerator" 
      description="Build, launch, and scale a profitable consulting practice" 
      navCurrent="consultant"
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
          to="/agency"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          Next: AI Agency Accelerator
          <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
      
      <ConsultantProvider>
        <ConsultantAccelerator />
      </ConsultantProvider>
      
      <div className="mt-6 flex justify-end">
        <Link
          to="/agency"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          Next: AI Agency Accelerator
          <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
    </AppLayout>
  );
};

export default ConsultantAcceleratorPage;