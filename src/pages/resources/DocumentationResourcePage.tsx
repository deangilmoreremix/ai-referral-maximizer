import React, { useState } from 'react';
import { FileText, Search, ChevronDown, ChevronRight, CheckCircle, ExternalLink, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResourceHeader from '../../components/ResourceHeader';
import Footer from '../../components/Footer';

const DocumentationResourcePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'introduction': true,
    'getting-started': true
  });

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Documentation sections structure
  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      subsections: [
        { id: 'overview', title: 'Platform Overview' },
        { id: 'features', title: 'Key Features' },
        { id: 'use-cases', title: 'Use Cases' }
      ]
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      subsections: [
        { id: 'account-setup', title: 'Account Setup' },
        { id: 'personalization', title: 'Personalizing Your Account' },
        { id: 'first-content', title: 'Generating Your First Content' }
      ]
    },
    {
      id: 'referral-methods',
      title: 'Referral Methods',
      subsections: [
        { id: 'direct-outreach', title: 'Direct Outreach Methods' },
        { id: 'meetings', title: 'Meeting-Based Methods' },
        { id: 'group-engagement', title: 'Group Engagement Strategies' },
        { id: 'incentives', title: 'Incentive Programs' },
        { id: 'follow-up', title: 'Follow-up Systems' }
      ]
    },
    {
      id: 'document-analysis',
      title: 'Document Analysis',
      subsections: [
        { id: 'supported-formats', title: 'Supported Document Formats' },
        { id: 'analysis-features', title: 'Analysis Capabilities' },
        { id: 'best-practices', title: 'Best Practices' }
      ]
    },
    {
      id: 'linkedin-integration',
      title: 'LinkedIn Integration',
      subsections: [
        { id: 'profile-analysis', title: 'Profile Analysis' },
        { id: 'data-extraction', title: 'Data Extraction & Use' },
        { id: 'privacy', title: 'Privacy Considerations' }
      ]
    },
    {
      id: 'voice-sms',
      title: 'Voice & SMS Tools',
      subsections: [
        { id: 'voice-drops', title: 'Voice Drops' },
        { id: 'sms-templates', title: 'SMS Templates' },
        { id: 'campaigns', title: 'Multi-Channel Campaigns' }
      ]
    },
    {
      id: 'content-management',
      title: 'Content Management',
      subsections: [
        { id: 'dashboard', title: 'Dashboard Overview' },
        { id: 'history', title: 'Content History' },
        { id: 'revisions', title: 'Content Revisions' },
        { id: 'exports', title: 'Export Options' }
      ]
    },
    {
      id: 'advanced-features',
      title: 'Advanced Features',
      subsections: [
        { id: 'team-collaboration', title: 'Team Collaboration' },
        { id: 'api-access', title: 'API Access' },
        { id: 'white-labeling', title: 'White Labeling' },
        { id: 'custom-templates', title: 'Custom Templates' }
      ]
    }
  ];

  // Filter sections based on search query
  const filteredSections = searchQuery
    ? sections.map(section => ({
        ...section,
        subsections: section.subsections.filter(subsection => 
          subsection.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(section => section.subsections.length > 0)
    : sections;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ResourceHeader 
        title="Documentation"
        subtitle="Comprehensive documentation for the AI Referral Maximizer platform"
        type="documentation"
      />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-72 flex-shrink-0">
              <div className="sticky top-6 space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="relative mb-4">
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Search documentation..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    {searchQuery && (
                      <button 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setSearchQuery('')}
                      >
                        <span className="text-sm text-gray-500">Clear</span>
                      </button>
                    )}
                  </div>
                  
                  <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                    {filteredSections.map(section => (
                      <div key={section.id} className="mb-2">
                        <button
                          className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm font-medium rounded-md ${
                            expandedSections[section.id]
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                          onClick={() => toggleSection(section.id)}
                        >
                          {section.title}
                          {expandedSections[section.id] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        
                        {expandedSections[section.id] && (
                          <div className="ml-6 mt-1 space-y-1">
                            {section.subsections.map(subsection => (
                              <a
                                key={subsection.id}
                                href={`#${subsection.id}`}
                                className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                              >
                                {subsection.title}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>
                </div>
                
                {/* Quick Jump */}
                <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-100 p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Quick Jump</h3>
                  <div className="mt-3 space-y-2">
                    <a href="#referral-methods" className="block text-sm text-blue-600 hover:text-blue-800">
                      Referral Methods
                    </a>
                    <a href="#document-analysis" className="block text-sm text-blue-600 hover:text-blue-800">
                      Document Analysis
                    </a>
                    <a href="#voice-sms" className="block text-sm text-blue-600 hover:text-blue-800">
                      Voice & SMS Tools
                    </a>
                    <a href="#advanced-features" className="block text-sm text-blue-600 hover:text-blue-800">
                      Advanced Features
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 md:p-8">
                <div id="introduction" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Introduction</h2>
                  
                  <div id="overview" className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Platform Overview</h3>
                    <p className="text-gray-700 mb-4">
                      AI Referral Maximizer is a comprehensive platform designed to help businesses and professionals generate more referrals through AI-powered content creation. The platform offers a wide range of referral methods, personalization options, and export capabilities to suit different business needs.
                    </p>
                    <p className="text-gray-700 mb-4">
                      Whether you're looking to create phone scripts, messaging templates, or complete referral programs, our platform provides the tools you need to generate professional, effective content in seconds.
                    </p>
                  </div>
                  
                  <div id="features" className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>50+ referral methods across multiple categories</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Advanced personalization with industry-specific content</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Document analysis for deeper customization</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>LinkedIn integration for professional insights</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Voice and SMS tools for direct outreach</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Multiple export formats (PDF, PowerPoint, Word)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Content management dashboard</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div id="use-cases" className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Use Cases</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Sales Professionals</h4>
                        <p className="text-sm text-gray-700">Generate professional referral scripts and strategies to increase your client base through referrals.</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Service Providers</h4>
                        <p className="text-sm text-gray-700">Create systems to turn satisfied clients into referral sources with templates and follow-up strategies.</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Small Business Owners</h4>
                        <p className="text-sm text-gray-700">Implement comprehensive referral programs without the need for a marketing team or extensive resources.</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Marketing Teams</h4>
                        <p className="text-sm text-gray-700">Scale referral marketing initiatives with customizable templates and tracking systems.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <hr className="my-8 border-gray-200" />
                
                {/* Just a couple of sample detailed sections - in a real implementation, this would be much more comprehensive */}
                <div id="document-analysis" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Document Analysis</h2>
                  
                  <div id="supported-formats" className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Supported Document Formats</h3>
                    <p className="text-gray-700 mb-4">
                      The document analysis feature supports various file formats for extracting valuable information to personalize your content:
                    </p>
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg mb-6">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Format</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Extensions</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Features</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          <tr>
                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">Plain Text</td>
                            <td className="px-3 py-4 text-sm text-gray-500">.txt</td>
                            <td className="px-3 py-4 text-sm text-gray-500">Basic text extraction and analysis</td>
                          </tr>
                          <tr>
                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">PDF Documents</td>
                            <td className="px-3 py-4 text-sm text-gray-500">.pdf</td>
                            <td className="px-3 py-4 text-sm text-gray-500">Text extraction from PDF documents</td>
                          </tr>
                          <tr>
                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">Word Documents</td>
                            <td className="px-3 py-4 text-sm text-gray-500">.docx</td>
                            <td className="px-3 py-4 text-sm text-gray-500">Structured content extraction from Word files</td>
                          </tr>
                          <tr>
                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">JSON Data</td>
                            <td className="px-3 py-4 text-sm text-gray-500">.json</td>
                            <td className="px-3 py-4 text-sm text-gray-500">Structured data parsing and analysis</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div id="analysis-features" className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Analysis Capabilities</h3>
                    <p className="text-gray-700 mb-4">
                      Our document analysis system extracts key information from your documents to personalize your content:
                    </p>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-1">Industry Detection</h4>
                        <p className="text-sm text-gray-700">
                          Automatically identifies your industry based on terminology and context in your documents.
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-1">Target Audience Identification</h4>
                        <p className="text-sm text-gray-700">
                          Extracts information about your target audience to tailor referral content to specific demographics.
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-1">Key Points Extraction</h4>
                        <p className="text-sm text-gray-700">
                          Identifies and extracts key points, value propositions, and unique selling points from your materials.
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-1">Competitor Analysis</h4>
                        <p className="text-sm text-gray-700">
                          Identifies mentioned competitors to help position your referral messaging appropriately.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div id="best-practices" className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Best Practices</h3>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FileText className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-blue-800">Tips for Document Analysis</h4>
                          <ul className="mt-2 text-sm text-blue-700 space-y-1 list-disc pl-5">
                            <li>Use recent and relevant documents for the most accurate analysis</li>
                            <li>Include materials that clearly state your target audience and value proposition</li>
                            <li>Combine multiple document types for comprehensive analysis</li>
                            <li>Use client-facing materials rather than internal documents</li>
                            <li>Ensure documents are text-searchable (especially for PDFs)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <hr className="my-8 border-gray-200" />
                
                <div id="linkedin-integration" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">LinkedIn Integration</h2>
                  
                  <div id="profile-analysis" className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Profile Analysis</h3>
                    <p className="text-gray-700 mb-4">
                      The LinkedIn integration feature allows you to analyze LinkedIn profiles to extract professional information for content personalization:
                    </p>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-1">Professional Details</h4>
                        <p className="text-sm text-gray-700">
                          Extracts job titles, company information, and industry context from LinkedIn profiles.
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-1">Skills Analysis</h4>
                        <p className="text-sm text-gray-700">
                          Identifies professional skills and categorizes them for targeted content generation.
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-1">Industry Insights</h4>
                        <p className="text-sm text-gray-700">
                          Generates industry-specific insights based on profile information.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div id="data-extraction" className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Extraction & Use</h3>
                    <p className="text-gray-700 mb-4">
                      When you provide a LinkedIn profile URL, our system extracts the following information:
                    </p>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      <li>Name and professional headline</li>
                      <li>Current and past employment information</li>
                      <li>Industry and company size</li>
                      <li>Professional skills and endorsements</li>
                      <li>Education background</li>
                    </ul>
                    <p className="text-gray-700 mt-4">
                      This information is used to personalize your referral content, making it more relevant to your professional context and target audience.
                    </p>
                  </div>
                  
                  <div id="privacy" className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy Considerations</h3>
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Lock className="h-5 w-5 text-amber-400" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-amber-800">Privacy and Data Usage</h4>
                          <ul className="mt-2 text-sm text-amber-700 space-y-1 list-disc pl-5">
                            <li>Only analyze public LinkedIn profiles</li>
                            <li>Data is used solely for content personalization</li>
                            <li>Profile information is stored securely and can be deleted at any time</li>
                            <li>We comply with all applicable privacy regulations</li>
                            <li>Analysis is performed on our secure servers, not through browser extensions</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-12">
                  <p className="text-gray-600 mb-4">
                    Can't find what you're looking for? Contact our support team for assistance.
                  </p>
                  <a 
                    href="mailto:support@aireferralmaximizer.com" 
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Contact Support
                    <ExternalLink size={16} className="ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DocumentationResourcePage;