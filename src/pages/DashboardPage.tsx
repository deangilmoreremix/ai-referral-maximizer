import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import ContentDashboard from '../components/ContentDashboard';
import StepProgress from '../components/StepProgress';

const DashboardPage: React.FC = () => {
  return (
    <AppLayout 
      title="Dashboard" 
      description="Manage your content and track your usage" 
      navCurrent="dashboard"
    >
      {/* Step Progress indicator */}
      <StepProgress currentStep={8} />
      
      <div className="mb-6 flex justify-between">
        <Link
          to="/agency"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to AI Agency Accelerator
        </Link>
        
        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Home size={16} className="mr-2" />
          Back to Home
        </Link>
      </div>
      
      <ContentDashboard />
    </AppLayout>
  );
};

export default DashboardPage;