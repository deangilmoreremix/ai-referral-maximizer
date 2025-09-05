import React, { useState } from 'react';
import { FileText, Clock, ChevronDown, ChevronUp, FileCheck, CheckCircle, RefreshCw, Zap, Briefcase, ClipboardList, User, UserCheck, Settings, X, Layers, ListChecks } from 'lucide-react';

interface ConsultantPreviewProps {
  consultantName: string;
  consultantExpertise: string;
  consultantTarget: string;
  activeStep?: number;
  onSelectStep?: (step: number) => void;
}

interface StepInfo {
  id: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  status: 'completed' | 'active' | 'upcoming';
}

interface MetricInfo {
  label: string;
  value: string;
  change?: string;
  direction?: 'up' | 'down';
}

const ConsultantPreview: React.FC<ConsultantPreviewProps> = ({
  consultantName,
  consultantExpertise = 'Consultant',
  consultantTarget = 'Business Professionals',
  activeStep = 1,
  onSelectStep
}) => {
  const [previewMode, setPreviewMode] = useState<'dashboard' | 'profile'>('dashboard');
  
  // Consultant info
  const expertiseParts = consultantExpertise.split(' ');
  const firstName = consultantName.split(' ')[0] || 'Jane';
  const lastName = consultantName.split(' ').slice(1).join(' ') || 'Doe';
  const email = `${firstName.toLowerCase()}@${lastName.toLowerCase()}.com`;
  
  // Steps for guided tour
  const steps: StepInfo[] = [
    {
      id: 1,
      title: "Expertise Positioning",
      icon: <Target className="h-5 w-5" />,
      color: "blue",
      status: activeStep > 1 ? 'completed' : activeStep === 1 ? 'active' : 'upcoming'
    },
    {
      id: 2,
      title: "Service Framework",
      icon: <FileText className="h-5 w-5" />,
      color: "indigo",
      status: activeStep > 2 ? 'completed' : activeStep === 2 ? 'active' : 'upcoming'
    },
    {
      id: 3,
      title: "Business Model",
      icon: <BarChart2 className="h-5 w-5" />,
      color: "purple",
      status: activeStep > 3 ? 'completed' : activeStep === 3 ? 'active' : 'upcoming'
    },
    {
      id: 4,
      title: "Client Acquisition",
      icon: <User className="h-5 w-5" />,
      color: "green",
      status: activeStep > 4 ? 'completed' : activeStep === 4 ? 'active' : 'upcoming'
    },
    {
      id: 5,
      title: "Delivery Systems",
      icon: <ClipboardList className="h-5 w-5" />,
      color: "amber",
      status: activeStep > 5 ? 'completed' : activeStep === 5 ? 'active' : 'upcoming'
    },
    {
      id: 6,
      title: "Scaling Strategy",
      icon: <Zap className="h-5 w-5" />,
      color: "red",
      status: activeStep > 6 ? 'completed' : activeStep === 6 ? 'active' : 'upcoming'
    }
  ];
  
  // Metrics data for preview dashboard
  const previewMetrics: MetricInfo[] = [
    {
      label: 'Revenue',
      value: '$24,500',
      change: '+12%',
      direction: 'up'
    },
    {
      label: 'Clients',
      value: '7',
      change: '+2',
      direction: 'up'
    },
    {
      label: 'Projects',
      value: '5',
      change: '-1',
      direction: 'down'
    },
    {
      label: 'Utilization',
      value: '85%',
      change: '+5%',
      direction: 'up'
    }
  ];
  
  // Upcoming activities
  const upcomingActivities = [
    {
      title: 'Client Meeting: ABC Corp',
      date: 'Tomorrow, 10:00 AM',
      type: 'meeting'
    },
    {
      title: 'Proposal Due: XYZ Technologies',
      date: 'Friday, 5:00 PM',
      type: 'deadline'
    },
    {
      title: 'Follow-up: Referral from Johnson',
      date: 'Monday, 2:00 PM',
      type: 'follow-up'
    }
  ];
  
  // Toggle preview mode
  const togglePreviewMode = () => {
    setPreviewMode(prevMode => prevMode === 'dashboard' ? 'profile' : 'dashboard');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Top navigation */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
            <User size={16} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">{consultantName}</span>
            <span className="text-xs opacity-90">{consultantExpertise}</span>
          </div>
        </div>
        
        <div className="flex">
          <button
            className={`px-3 py-1 text-xs rounded-l-md ${
              previewMode === 'dashboard' ? 'bg-white text-indigo-600 font-medium' : 'bg-indigo-700 text-white'
            }`}
            onClick={() => setPreviewMode('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-r-md ${
              previewMode === 'profile' ? 'bg-white text-indigo-600 font-medium' : 'bg-indigo-700 text-white'
            }`}
            onClick={() => setPreviewMode('profile')}
          >
            Profile
          </button>
        </div>
      </div>
      
      {previewMode === 'dashboard' && (
        <div className="p-4">
          {/* Greeting */}
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">Welcome back, {firstName}!</h2>
            <p className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {previewMetrics.map((metric, index) => (
              <div key={index} className="border rounded-md p-3 bg-gray-50">
                <div className="text-xs font-medium text-gray-500 mb-1">{metric.label}</div>
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    {metric.value}
                  </span>
                  <span className={`text-xs ${metric.direction === 'up' ? 'text-green-600' : 'text-red-500'} flex items-center ml-1.5`}>
                    {metric.direction === 'up' ? '↑' : '↓'} {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Upcoming activities */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Upcoming Activities</h3>
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
              {upcomingActivities.map((activity, index) => (
                <div key={index} className="p-3 flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                    <div className="text-xs text-gray-500">{activity.date}</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-800 text-xs">
                    Details
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Business progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Business Building Progress</h3>
              <span className="text-xs text-indigo-600">{Math.max(1, Math.min(activeStep, 6))}/6 completed</span>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="relative mb-4">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                    style={{ width: `${(activeStep / 6) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-3">
                {steps.map((step) => (
                  <div 
                    key={step.id}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                      step.status === 'active'
                        ? `bg-${step.color}-50 border border-${step.color}-200`
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onSelectStep ? onSelectStep(step.id) : null}
                  >
                    <div className="flex items-center">
                      {step.status === 'completed' ? (
                        <div className={`w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3`}>
                          <Check size={14} className="text-green-600" />
                        </div>
                      ) : (
                        <div className={`w-6 h-6 rounded-full bg-${step.color}-100 flex items-center justify-center mr-3`}>
                          <span className={`text-xs font-medium text-${step.color}-600`}>{step.id}</span>
                        </div>
                      )}
                      <span className={`text-sm ${step.status === 'active' ? 'font-medium' : ''}`}>
                        {step.title}
                      </span>
                    </div>
                    
                    {step.status === 'active' && (
                      <button className={`text-xs text-${step.color}-600 flex items-center`}>
                        Work on this
                        <ArrowRight size={12} className="ml-1" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {previewMode === 'profile' && (
        <div className="p-4">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-indigo-100 mx-auto rounded-full flex items-center justify-center mb-4 border-2 border-indigo-200">
              <span className="text-2xl font-bold text-indigo-700">
                {firstName[0]}{lastName[0]}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{consultantName}</h2>
            <p className="text-indigo-600 font-medium">{consultantExpertise}</p>
            <div className="flex justify-center space-x-4 mt-3">
              <div className="flex items-center text-xs text-gray-500">
                <Phone size={12} className="mr-1" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Mail size={12} className="mr-1" />
                <span>{email}</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Globe2 size={12} className="mr-1" />
                <span>website.com</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-4">
            <h3 className="text-md font-medium text-gray-900 mb-2">Professional Summary</h3>
            <p className="text-sm text-gray-600">
              Experienced {consultantExpertise} specializing in helping {consultantTarget} achieve their business goals. 
              Offering strategic consulting services focused on delivering measurable results and long-term success.
            </p>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-4">
            <h3 className="text-md font-medium text-gray-900 mb-2">Target Clients</h3>
            <div className="bg-green-50 rounded-lg p-3 border border-green-100">
              <div className="flex items-center">
                <Target size={16} className="text-green-600 mr-2 flex-shrink-0" />
                <p className="text-sm text-green-800">{consultantTarget}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-md font-medium text-gray-900 mb-3">Service Packages</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex items-center">
                  <Award size={16} className="text-blue-600 mr-2 flex-shrink-0" />
                  <h4 className="font-medium text-gray-900">Discovery Package</h4>
                </div>
                <div className="text-sm font-medium text-indigo-600 mt-1">$1,500</div>
              </div>
              
              <div className="bg-indigo-50 rounded-lg border border-indigo-200 p-3">
                <div className="flex items-center">
                  <Briefcase size={16} className="text-indigo-600 mr-2 flex-shrink-0" />
                  <h4 className="font-medium text-gray-900">Implementation Program</h4>
                </div>
                <div className="text-sm font-medium text-indigo-600 mt-1">$5,000</div>
                <div className="mt-2 text-xs font-medium text-indigo-800 bg-indigo-100 inline-block px-2 py-0.5 rounded">
                  Most Popular
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex items-center">
                  <Handshake size={16} className="text-purple-600 mr-2 flex-shrink-0" />
                  <h4 className="font-medium text-gray-900">Retainer Partnership</h4>
                </div>
                <div className="text-sm font-medium text-indigo-600 mt-1">$3,500/mo</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer with log out button */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <button className="text-xs text-gray-500" onClick={togglePreviewMode}>
            Switch to {previewMode === 'dashboard' ? 'Profile' : 'Dashboard'} View
          </button>
          <button className="text-xs text-gray-500">
            Preview Only
          </button>
        </div>
      </div>
    </div>
  );
};

// ArrowRight component
const ArrowRight = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 24, ...rest } = props;
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...rest}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
};

// Check component
const Check = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 24, ...rest } = props;
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...rest}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
};

// Phone component
const Phone = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 24, ...rest } = props;
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...rest}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
};

// Mail component
const Mail = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 24, ...rest } = props;
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...rest}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
};

// Target component
const Target = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 24, ...rest } = props;
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...rest}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
};

// Globe2 component
const Globe2 = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 24, ...rest } = props;
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...rest}
    >
      <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"></path>
      <path d="M7 3.34V5a2 2 0 0 0 2 2h0"></path>
      <path d="M11 21.95V18a2 2 0 0 0-2-2v0"></path>
      <path d="M12.55 7.05C12.55 7.05 15 6.5 16 7.5c1 1 2.5 1.5 2.5 1.5"></path>
      <path d="M18 2a10 10 0 1 0 4 13.22"></path>
    </svg>
  );
};

// Award component
const Award = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 24, ...rest } = props;
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...rest}
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M8 21a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2" />
      <path d="M18 10.7V11"></path>
      <path d="M6 10.7V11"></path>
    </svg>
  );
};

// Handshake component
const Handshake = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 24, ...rest } = props;
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...rest}
    >
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
    </svg>
  );
};

// BarChart2 component
const BarChart2 = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 24, ...rest } = props;
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...rest}
    >
      <path d="M18 20V10"></path>
      <path d="M12 20V4"></path>
      <path d="M6 20v-6"></path>
    </svg>
  );
};

export default ConsultantPreview;