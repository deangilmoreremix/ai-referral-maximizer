import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  path: string;
}

interface StepProgressProps {
  currentStep: number;
}

const StepProgress: React.FC<StepProgressProps> = ({ currentStep }) => {
  // Define the order of pages according to user requirements
  const steps: Step[] = [
    { id: 1, title: "Personalize", path: "/personalize" },
    { id: 2, title: "AI Settings", path: "/ai-settings" },
    { id: 3, title: "Content Generator", path: "/content-generator" },
    { id: 4, title: "Super Creator", path: "/super-creator" },
    { id: 5, title: "Voice & SMS", path: "/voice-sms" },
    { id: 6, title: "Consultant", path: "/consultant" },
    { id: 7, title: "Agency", path: "/agency" },
    { id: 8, title: "Dashboard", path: "/dashboard" }
  ];
  
  return (
    <div className="mb-8">
      <div className="relative">
        {/* Progress bar */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded"></div>
        <div 
          className="absolute top-5 left-0 h-1 bg-green-600 rounded transition-all duration-500" 
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {/* Step indicators */}
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <Link
              key={step.id}
              to={step.path}
              className="flex flex-col items-center"
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                  step.id === currentStep 
                    ? 'bg-green-600 text-white border-2 border-green-600 shadow-md' 
                    : step.id < currentStep
                      ? 'bg-green-100 text-green-800 border border-green-600'
                      : 'bg-white text-gray-400 border border-gray-300'
                }`}
              >
                {step.id < currentStep ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <span 
                className={`mt-2 text-xs font-medium text-center hidden md:block ${
                  step.id === currentStep ? 'text-green-600' : step.id < currentStep ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {step.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepProgress;