import React, { useState } from 'react';
import { Building2, Users, FileText, Clock, ArrowRight, CheckCircle, AlertCircle, Briefcase, DollarSign, Briefcase as BriefcaseMedical, BookOpen, Settings, Camera, Shield, Grid, Package, Layers, Database, CreditCard, PenTool } from 'lucide-react';

interface SystemCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  systems: System[];
  isExpanded: boolean;
}

interface System {
  id: string;
  name: string;
  description: string;
  setupTime: string;
  cost: string;
  isImplemented: boolean;
}

const AgencyFoundationBuilder: React.FC = () => {
  // System categories with nested systems
  const [categories, setCategories] = useState<SystemCategory[]>([
    {
      id: 'client-management',
      name: 'Client Management',
      icon: <Users size={20} className="text-blue-600" />,
      description: 'Systems for managing client relationships, onboarding, and communication',
      isExpanded: true,
      systems: [
        {
          id: 'crm',
          name: 'CRM System',
          description: 'Client relationship management system to track all client interactions, projects, and referrals',
          setupTime: '1-3 days',
          cost: '$15-50/month',
          isImplemented: false
        },
        {
          id: 'client-onboarding',
          name: 'Client Onboarding Process',
          description: 'Standardized process for bringing on new clients smoothly and efficiently',
          setupTime: '1-2 days',
          cost: 'Free',
          isImplemented: true
        },
        {
          id: 'client-portal',
          name: 'Client Portal',
          description: 'Secure portal where clients can access their materials, communicate, and track progress',
          setupTime: '2-7 days',
          cost: '$20-100/month',
          isImplemented: false
        }
      ]
    },
    {
      id: 'operations',
      name: 'Agency Operations',
      icon: <Briefcase size={20} className="text-purple-600" />,
      description: 'Core operational systems for running your agency efficiently',
      isExpanded: false,
      systems: [
        {
          id: 'project-management',
          name: 'Project Management System',
          description: 'Tools and workflows to manage client projects, deadlines, and deliverables',
          setupTime: '1-3 days',
          cost: '$10-40/month',
          isImplemented: true
        },
        {
          id: 'sop-library',
          name: 'SOP Library',
          description: 'Standard operating procedures for all main agency functions',
          setupTime: '5-10 days',
          cost: 'Free',
          isImplemented: false
        },
        {
          id: 'time-tracking',
          name: 'Time Tracking System',
          description: 'Track time spent on client work and internal projects',
          setupTime: '1 day',
          cost: '$5-20/month',
          isImplemented: false
        }
      ]
    },
    {
      id: 'finance',
      name: 'Financial Systems',
      icon: <DollarSign size={20} className="text-green-600" />,
      description: 'Systems for billing, payment processing, and financial management',
      isExpanded: false,
      systems: [
        {
          id: 'invoicing',
          name: 'Invoicing & Billing',
          description: 'System for creating, sending, and tracking invoices and payments',
          setupTime: '1-2 days',
          cost: '$20-50/month',
          isImplemented: true
        },
        {
          id: 'expense-tracking',
          name: 'Expense Tracking',
          description: 'Track and categorize business expenses for tax and profit analysis',
          setupTime: '1 day',
          cost: '$10-30/month',
          isImplemented: false
        },
        {
          id: 'financial-reporting',
          name: 'Financial Reporting',
          description: 'Create regular reports on agency financial performance',
          setupTime: '2-3 days',
          cost: '$0-50/month',
          isImplemented: false
        }
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing & Lead Generation',
      icon: <PenTool size={20} className="text-amber-600" />,
      description: 'Systems for attracting and converting new agency clients',
      isExpanded: false,
      systems: [
        {
          id: 'website',
          name: 'Agency Website',
          description: 'Professional website showcasing your referral generation services',
          setupTime: '5-15 days',
          cost: '$0-100/month',
          isImplemented: true
        },
        {
          id: 'email-marketing',
          name: 'Email Marketing System',
          description: 'Tools for email campaigns, newsletters, and lead nurturing',
          setupTime: '2-3 days',
          cost: '$15-50/month',
          isImplemented: false
        },
        {
          id: 'social-media',
          name: 'Social Media Strategy',
          description: 'Plan for consistent, audience-building social media presence',
          setupTime: '2-5 days',
          cost: '$0-30/month',
          isImplemented: false
        }
      ]
    },
    {
      id: 'tech-stack',
      name: 'Technology & Tools',
      icon: <Settings size={20} className="text-indigo-600" />,
      description: 'Technical infrastructure and tools powering your agency',
      isExpanded: false,
      systems: [
        {
          id: 'ai-tools',
          name: 'AI Content Generation',
          description: 'AI tools and subscriptions for client content creation',
          setupTime: '1-2 days',
          cost: '$50-200/month',
          isImplemented: true
        },
        {
          id: 'data-security',
          name: 'Data Security & Storage',
          description: 'Secure systems for client data and content storage',
          setupTime: '1-3 days',
          cost: '$10-50/month',
          isImplemented: false
        },
        {
          id: 'analytics',
          name: 'Performance Analytics',
          description: 'Systems to track campaign performance and agency metrics',
          setupTime: '2-4 days',
          cost: '$0-50/month',
          isImplemented: false
        }
      ]
    }
  ]);

  const [implementationPlan, setImplementationPlan] = useState<string[]>([
    'Start with Client Management systems (1-2 weeks)',
    'Implement Financial Systems next (1 week)',
    'Set up basic Operations infrastructure (2 weeks)',
    'Develop Marketing systems once operational (2-3 weeks)',
    'Complete Technology stack (ongoing)'
  ]);

  const [resourceLinks, setResourceLinks] = useState<{name: string; url: string; description: string}[]>([
    {
      name: 'Agency Operations Toolkit',
      url: '#toolkit',
      description: 'Complete templates and guides for setting up agency systems'
    },
    {
      name: 'Client Onboarding Blueprint',
      url: '#onboarding',
      description: 'Step-by-step process for smooth client onboarding'
    },
    {
      name: 'Agency Tech Stack Guide',
      url: '#tech',
      description: 'Recommended tools and software for referral agencies'
    }
  ]);

  // Toggle category expanded state
  const toggleCategory = (categoryId: string) => {
    setCategories(categories.map(category => 
      category.id === categoryId 
        ? { ...category, isExpanded: !category.isExpanded }
        : category
    ));
  };

  // Toggle system implementation status
  const toggleSystemImplementation = (categoryId: string, systemId: string) => {
    setCategories(categories.map(category => 
      category.id === categoryId 
        ? {
            ...category,
            systems: category.systems.map(system => 
              system.id === systemId 
                ? { ...system, isImplemented: !system.isImplemented }
                : system
            )
          }
        : category
    ));
  };

  // Calculate implementation progress
  const calculateProgress = () => {
    const allSystems = categories.flatMap(category => category.systems);
    const implementedCount = allSystems.filter(system => system.isImplemented).length;
    return Math.round((implementedCount / allSystems.length) * 100);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg mr-3">
              <Building2 className="h-5 w-5 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Agency Foundation Builder</h2>
          </div>
          
          <div className="flex items-center">
            <div className="bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <span className="text-xs font-medium mr-2 text-gray-700">Progress</span>
                <span className="text-xs font-bold text-amber-700">{calculateProgress()}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left column: System categories */}
          <div className="lg:col-span-3 space-y-4">
            {categories.map(category => (
              <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div 
                  className={`flex justify-between items-center p-4 cursor-pointer ${category.isExpanded ? 'bg-gray-50' : 'bg-white'}`}
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-gray-100 mr-3">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {category.systems.filter(s => s.isImplemented).length} / {category.systems.length}
                    </span>
                    {category.isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {category.isExpanded && (
                  <div className="border-t border-gray-200 divide-y divide-gray-200">
                    {category.systems.map(system => (
                      <div key={system.id} className="p-4 bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <h4 className="font-medium text-gray-900">{system.name}</h4>
                              {system.isImplemented && (
                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full flex items-center">
                                  <CheckCircle size={12} className="mr-1" />
                                  Implemented
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{system.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center">
                                <Clock size={12} className="mr-1 text-gray-400" />
                                Setup: {system.setupTime}
                              </div>
                              <div className="flex items-center">
                                <DollarSign size={12} className="mr-1 text-gray-400" />
                                {system.cost}
                              </div>
                            </div>
                          </div>
                          
                          <div className="ml-4 flex flex-col items-end">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSystemImplementation(category.id, system.id);
                              }}
                              className={`px-3 py-1.5 rounded text-sm ${
                                system.isImplemented 
                                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  : 'bg-amber-600 text-white hover:bg-amber-700'
                              }`}
                            >
                              {system.isImplemented ? 'Mark Incomplete' : 'Mark Complete'}
                            </button>
                            
                            <button className="mt-2 text-xs text-amber-600 hover:text-amber-800">
                              View Setup Guide
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Right column: Resources & Implementation Plan */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3">Foundation Progress</h3>
              <div className="mb-2 flex justify-between items-center text-sm">
                <span className="text-gray-600">Overall completion</span>
                <span className="font-medium text-gray-900">{calculateProgress()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
              </div>
              
              <div className="mt-4 space-y-2">
                {categories.map(category => {
                  const categoryProgress = category.systems.filter(s => s.isImplemented).length / category.systems.length * 100;
                  return (
                    <div key={category.id} className="flex items-center text-sm">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ 
                        backgroundColor: category.id === 'client-management' ? '#2563eb' : 
                                         category.id === 'operations' ? '#9333ea' :
                                         category.id === 'finance' ? '#16a34a' :
                                         category.id === 'marketing' ? '#d97706' :
                                         '#4f46e5'
                      }}></div>
                      <span className="text-xs text-gray-700 mr-2">{category.name}</span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full">
                        <div className="h-1.5 rounded-full" style={{ 
                          width: `${categoryProgress}%`,
                          backgroundColor: category.id === 'client-management' ? '#2563eb' : 
                                         category.id === 'operations' ? '#9333ea' :
                                         category.id === 'finance' ? '#16a34a' :
                                         category.id === 'marketing' ? '#d97706' :
                                         '#4f46e5'
                        }}></div>
                      </div>
                      <span className="ml-2 text-xs font-medium text-gray-700">{Math.round(categoryProgress)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Implementation Plan */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3">Implementation Plan</h3>
              <ol className="space-y-2 text-sm">
                {implementationPlan.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mr-2 mt-0.5 text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            {/* Resources */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3">Resources</h3>
              <div className="space-y-2">
                {resourceLinks.map((resource, index) => (
                  <a key={index} href={resource.url} className="block p-2 hover:bg-gray-50 rounded transition-colors">
                    <h4 className="text-sm font-medium text-amber-700">{resource.name}</h4>
                    <p className="text-xs text-gray-600 mt-0.5">{resource.description}</p>
                  </a>
                ))}
              </div>
              <div className="mt-3 text-center">
                <button className="text-xs text-amber-600 hover:text-amber-800 font-medium">
                  View All Resources
                </button>
              </div>
            </div>
            
            {/* Download Templates */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg p-4 shadow-sm">
              <h3 className="font-medium mb-2">Agency Template Pack</h3>
              <p className="text-sm text-amber-100 mb-3">Download our complete agency template pack with all the documents you need to set up your systems.</p>
              <button className="w-full bg-white text-amber-800 hover:bg-amber-50 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center">
                <FileText className="h-4 w-4 mr-1.5" />
                Download Templates
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyFoundationBuilder;