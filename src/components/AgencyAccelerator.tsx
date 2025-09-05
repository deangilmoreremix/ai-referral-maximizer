import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Award, ArrowRight, ChevronRight, Target, Briefcase, BarChart2, Users, Zap, ChevronDown, ChevronUp, Mail, Building2, Globe2, FileDown } from 'lucide-react';
import AgencyServiceBuilder from './agency/AgencyServiceBuilder';
import AgencyContentGenerator from './agency/AgencyContentGenerator';
import AIModelExplorer from './agency/AIModelExplorer';
import ClientCampaignBuilder from './agency/ClientCampaignBuilder';
import AgencyFoundationBuilder from './agency/AgencyFoundationBuilder';
import AgencyScalingStrategies from './agency/AgencyScalingStrategies';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const AgencyAccelerator: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Define the steps for the agency accelerator
  const steps: Step[] = [
    {
      id: 1,
      title: "Define Agency Services",
      description: "Structure your AI-powered referral generation services",
      icon: <Target className="h-5 w-5" />,
      component: <AgencyServiceBuilder />
    },
    {
      id: 2,
      title: "Create Agency Content",
      description: "Generate marketing materials for your agency",
      icon: <Briefcase className="h-5 w-5" />,
      component: <AgencyContentGenerator templateName="agency-service-description" />
    },
    {
      id: 3,
      title: "AI Model Configuration",
      description: "Configure the AI models for your client offerings",
      icon: <Brain className="h-5 w-5" />,
      component: <AIModelExplorer />
    },
    {
      id: 4,
      title: "Client Campaign Builder",
      description: "Create client referral campaigns",
      icon: <Users className="h-5 w-5 text-green-600" />,
      component: <ClientCampaignBuilder />
    },
    {
      id: 5,
      title: "Agency Foundation",
      description: "Set up your agency systems and processes",
      icon: <Zap className="h-5 w-5 text-amber-600" />,
      component: <AgencyFoundationBuilder />
    },
    {
      id: 6,
      title: "Scaling Strategy",
      description: "Develop strategies to scale your agency",
      icon: <BarChart2 className="h-5 w-5 text-red-600" />,
      component: <AgencyScalingStrategies />
    }
  ];

  return (
    <div className={`mt-12 mb-8 rounded-xl overflow-hidden border border-gray-200 shadow-md bg-white transition-all duration-300 ${expanded ? 'expanded' : 'collapsed'}`}>
      {/* Header */}
      <header className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <Award className="h-8 w-8 mr-2" />
              AI Agency Accelerator
            </h2>
            <p className="mt-2 text-indigo-100">Transform your freelance business into a thriving AI agency</p>
          </div>
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
          >
            {expanded ? 'Minimize' : 'Expand'}
          </button>
        </div>
      </header>
      
      {expanded && (
        <div className="p-6">
          {/* Step Navigation */}
          <div className="mb-8">
            <div className="relative">
              {/* Timeline track */}
              <div className="absolute h-1 bg-gray-200 top-5 left-0 right-0"></div>
              
              {/* Progress bar */}
              <div 
                className="absolute h-1 bg-indigo-600 top-5 left-0" 
                style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%`, transition: 'width 0.5s ease-in-out' }}
              ></div>
              
              {/* Step indicators */}
              <div className="relative flex justify-between">
                {steps.map((step) => (
                  <div key={step.id} className="flex flex-col items-center" onClick={() => setActiveStep(step.id)}>
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 cursor-pointer ${
                        step.id === activeStep 
                          ? 'bg-indigo-600 text-white shadow-lg scale-110' 
                          : step.id < activeStep
                            ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-600'
                            : 'bg-gray-100 text-gray-500 border border-gray-300'
                      }`}
                    >
                      {step.icon}
                    </div>
                    <span className={`mt-2 text-sm font-medium text-center ${
                      step.id === activeStep ? 'text-indigo-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Step Content */}
          <div>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900">{steps[activeStep - 1].title}</h3>
              <p className="text-sm text-gray-600">{steps[activeStep - 1].description}</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              {steps[activeStep - 1].component}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button 
              onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
              className={`flex items-center text-sm px-3 py-1.5 rounded border ${
                activeStep === 1 
                ? 'text-gray-400 border-gray-200 cursor-not-allowed' 
                : 'text-indigo-600 border-indigo-200 hover:bg-indigo-50'
              }`}
              aria-label="Previous step"
            >
              Previous
            </button>
            <button 
              onClick={() => setActiveStep(prev => Math.min(steps.length, prev + 1))}
              disabled={activeStep === steps.length}
              className={`flex items-center text-sm px-3 py-1.5 rounded border ${
                activeStep === steps.length 
                ? 'text-gray-400 border-gray-200 cursor-not-allowed' 
                : 'text-indigo-600 border-indigo-200 hover:bg-indigo-50'
              }`}
              aria-label="Next step"
            >
              Next <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          
          {/* Info Box */}
          <div className="mt-8 bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <div className="flex">
              <div className="flex-shrink-0">
                <Award className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-indigo-800">AI Agency Accelerator Program</h3>
                <div className="mt-2 text-sm text-indigo-700">
                  <p>
                    This interactive tool helps you set up an AI referral generation agency from scratch. 
                    Follow each step to build your service offerings, marketing materials, and systems.
                  </p>
                  <p className="mt-2">
                    <span className="font-medium">Coming Soon: </span> 
                    Advanced client campaign builder, lead generation systems, and agency scaling tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyAccelerator;