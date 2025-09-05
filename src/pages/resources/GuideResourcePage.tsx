import React, { useState } from 'react';
import { FileCheck, Code, Info, AlertCircle, Sparkles, CheckCircle, Tag, Phone, UserCheck, Facebook, Clock, Settings, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResourceHeader from '../../components/ResourceHeader';
import Footer from '../../components/Footer';

const GuideResourcePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('introduction');
  
  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'personalization', title: 'Personalization' },
    { id: 'referral-methods', title: 'Referral Methods' },
    { id: 'voice-sms', title: 'Voice & SMS' },
    { id: 'dashboard', title: 'Dashboard' },
    { id: 'templates', title: 'Templates' },
    { id: 'advanced', title: 'Advanced Features' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ResourceHeader 
        title="Getting Started Guide"
        subtitle="Learn how to use the AI Referral Maximizer platform to generate professional referral content"
        type="guide"
      />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-72 flex-shrink-0">
              <div className="sticky top-6 space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Guide Contents</h2>
                  <nav className="space-y-1">
                    {sections.map(section => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className={`block px-3 py-2 rounded-md text-sm font-medium ${
                          activeSection === section.id
                            ? 'bg-green-50 text-green-700 border border-green-100'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveSection(section.id);
                          document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        {section.title}
                      </a>
                    ))}
                  </nav>
                </div>
                
                <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-100 p-4">
                  <h3 className="font-medium text-blue-800 flex items-center">
                    <Info size={16} className="mr-2" />
                    Quick Links
                  </h3>
                  <div className="mt-3 space-y-2">
                    <Link to="/app" className="block text-sm text-blue-600 hover:text-blue-800">
                      → Launch App
                    </Link>
                    <Link to="/resources/documentation" className="block text-sm text-blue-600 hover:text-blue-800">
                      → Full Documentation
                    </Link>
                    <Link to="/resources/templates" className="block text-sm text-blue-600 hover:text-blue-800">
                      → Templates Library
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 md:p-8">
                <div id="introduction" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction to AI Referral Maximizer</h2>
                  <p className="text-gray-600 mb-4">
                    Welcome to the AI Referral Maximizer! This platform helps businesses and professionals boost their referral generation through AI-powered content creation. With our service, you can create personalized, professional referral content in seconds.
                  </p>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          <strong>Note:</strong> This guide provides an overview of the platform's key features. For detailed instructions, please refer to our <Link to="/resources/documentation" className="text-yellow-700 underline">full documentation</Link>.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">What You Can Do With AI Referral Maximizer</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <FileCheck className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">Generate Professional Content</h4>
                          <p className="mt-1 text-xs text-gray-500">Create professional referral scripts, strategies, and campaigns in seconds.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Settings className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">Personalize to Your Business</h4>
                          <p className="mt-1 text-xs text-gray-500">Customize content for your industry, audience, and specific business needs.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Tag className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">Use 50+ Referral Methods</h4>
                          <p className="mt-1 text-xs text-gray-500">Access a comprehensive library of referral strategies across multiple channels.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <FileText className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">Download & Share</h4>
                          <p className="mt-1 text-xs text-gray-500">Export generated content in multiple formats (PDF, PPTX, DOCX).</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div id="getting-started" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
                  <p className="text-gray-600 mb-4">
                    Follow these steps to start generating referral content with AI Referral Maximizer:
                  </p>
                  
                  <div className="space-y-6 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 font-semibold">1</div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Create Your Account</h3>
                        <p className="mt-1 text-gray-600">Sign up for a free account to access all basic features. You can start with a 14-day trial of the Pro plan to test advanced features.</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 font-semibold">2</div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Personalize Your Settings</h3>
                        <p className="mt-1 text-gray-600">Click the "Personalize" button to customize the AI to your specific industry, target audience, and business size.</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 font-semibold">3</div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Select a Referral Method</h3>
                        <p className="mt-1 text-gray-600">Browse the available referral methods and select one that fits your needs. You can filter by category or search for specific methods.</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 font-semibold">4</div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Generate & Export</h3>
                        <p className="mt-1 text-gray-600">Review the generated content, make any necessary revisions, and export it in your preferred format (PDF, PowerPoint, Word).</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <h3 className="flex items-center text-lg font-medium text-indigo-800">
                      <Sparkles className="h-5 w-5 mr-2 text-indigo-600" />
                      Pro Tip
                    </h3>
                    <p className="mt-2 text-indigo-700 text-sm">
                      For best results, take the time to complete your personalization settings thoroughly. The more specific information you provide about your business and target audience, the more relevant and effective your generated content will be.
                    </p>
                  </div>
                </div>
                
                <div id="personalization" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Personalization</h2>
                  <p className="text-gray-600 mb-4">
                    The personalization feature allows you to customize all AI-generated content to your specific business context.
                  </p>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Key Personalization Options</h3>
                    <div className="rounded-md border border-gray-200 overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Setting</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Example</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Industry</td>
                            <td className="px-6 py-4 text-sm text-gray-500">Your business industry or sector</td>
                            <td className="px-6 py-4 text-sm text-gray-500">"Technology", "Healthcare", "Financial Services"</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Target Audience</td>
                            <td className="px-6 py-4 text-sm text-gray-500">The specific audience you're targeting</td>
                            <td className="px-6 py-4 text-sm text-gray-500">"Small business owners", "Mid-level managers", "Healthcare providers"</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Business Size</td>
                            <td className="px-6 py-4 text-sm text-gray-500">The size of your company</td>
                            <td className="px-6 py-4 text-sm text-gray-500">"Small", "Medium", "Enterprise"</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Special Requirements</td>
                            <td className="px-6 py-4 text-sm text-gray-500">Any specific needs or constraints</td>
                            <td className="px-6 py-4 text-sm text-gray-500">"Compliance with financial regulations", "Focus on sustainability"</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mt-6">Advanced Personalization</h3>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 flex items-center">
                          <FileText size={16} className="text-green-600 mr-2" /> 
                          Document Analysis
                        </h4>
                        <p className="mt-1 text-sm text-gray-600">
                          Upload business documents, briefs, or requirements for the AI to analyze and incorporate into your content. This provides deeper personalization based on your specific materials.
                        </p>
                        <div className="mt-2">
                          <Link to="/resources/documentation#document-analysis" className="text-sm text-green-600 hover:text-green-800">
                            Learn more about document analysis →
                          </Link>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 flex items-center">
                          <Code size={16} className="text-green-600 mr-2" /> 
                          LinkedIn Profile Analysis
                        </h4>
                        <p className="mt-1 text-sm text-gray-600">
                          Connect your LinkedIn profile to extract professional details and enhance your content with industry-specific information.
                        </p>
                        <div className="mt-2">
                          <Link to="/resources/documentation#linkedin-integration" className="text-sm text-green-600 hover:text-green-800">
                            Learn more about LinkedIn integration →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div id="referral-methods" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Referral Methods</h2>
                  <p className="text-gray-600 mb-4">
                    The platform offers 50+ referral methods organized into categories to help you find the perfect approach for your business.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center mb-2">
                        <Phone size={20} className="text-blue-600 mr-2" />
                        <h3 className="font-medium text-gray-900">Direct Outreach</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Person-to-person referral strategies</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-center">
                          <CheckCircle size={12} className="text-green-500 mr-2" />
                          Friends & Family Campaign
                        </li>
                        <li className="flex items-center">
                          <CheckCircle size={12} className="text-green-500 mr-2" />
                          Phone Call Scripts
                        </li>
                        <li className="flex items-center">
                          <CheckCircle size={12} className="text-green-500 mr-2" />
                          Face-to-Face Meeting Guides
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center mb-2">
                        <Facebook size={20} className="text-blue-600 mr-2" />
                        <h3 className="font-medium text-gray-900">Group & Community</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Social and community-based strategies</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-center">
                          <CheckCircle size={12} className="text-green-500 mr-2" />
                          Facebook Group Strategies
                        </li>
                        <li className="flex items-center">
                          <CheckCircle size={12} className="text-green-500 mr-2" />
                          LinkedIn Group Engagement
                        </li>
                        <li className="flex items-center">
                          <CheckCircle size={12} className="text-green-500 mr-2" />
                          Industry Association Leadership
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 my-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          <strong>Pro Tip:</strong> For best results, combine multiple referral methods. For example, use face-to-face requests followed by a WhatsApp campaign for follow-up.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-6">
                    <Link 
                      to="/referral-methods" 
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      Browse All Referral Methods
                    </Link>
                  </div>
                </div>
                
                <div id="voice-sms" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Voice & SMS Features</h2>
                  <p className="text-gray-600 mb-4">
                    Create personalized voice drops and SMS templates for your referral outreach with our dedicated Voice & SMS tool.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-purple-50 rounded-lg border border-purple-100 p-5">
                      <h3 className="text-lg font-medium text-purple-900 mb-2">Voice Drop Creator</h3>
                      <p className="text-sm text-purple-700 mb-3">
                        Create professional voice messages to leave for referral sources, prospects, and clients.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle size={14} className="text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-purple-800">Generate AI-powered voice scripts</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle size={14} className="text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-purple-800">Record your own voice or use text-to-speech</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle size={14} className="text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-purple-800">Schedule automated voice drop delivery</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg border border-blue-100 p-5">
                      <h3 className="text-lg font-medium text-blue-900 mb-2">SMS Templates</h3>
                      <p className="text-sm text-blue-700 mb-3">
                        Create and send personalized text messages for referral outreach.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle size={14} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-blue-800">Generate AI-powered SMS templates</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle size={14} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-blue-800">Create multi-message campaigns</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle size={14} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-blue-800">Track message delivery and response rates</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="text-center mt-6">
                    <Link 
                      to="/chatbot" 
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Access Voice & SMS Tools
                    </Link>
                  </div>
                </div>
                
                <div id="dashboard" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard & Analytics</h2>
                  <p className="text-gray-600 mb-4">
                    The Dashboard provides insights into your referral content generation and usage patterns.
                  </p>
                  
                  <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Key Dashboard Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md bg-green-100 flex items-center justify-center">
                          <Clock size={20} className="text-green-600" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-base font-medium text-gray-900">Content History</h4>
                          <p className="mt-1 text-sm text-gray-500">Access all previously generated content from one central location.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                          <Settings size={20} className="text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-base font-medium text-gray-900">Usage Tracking</h4>
                          <p className="mt-1 text-sm text-gray-500">Monitor your content generation and export activity over time.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center">
                          <FileText size={20} className="text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-base font-medium text-gray-900">Content Management</h4>
                          <p className="mt-1 text-sm text-gray-500">Edit, update, and organize your generated referral content.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md bg-amber-100 flex items-center justify-center">
                          <UserCheck size={20} className="text-amber-600" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-base font-medium text-gray-900">Team Collaboration</h4>
                          <p className="mt-1 text-sm text-gray-500">Share and collaborate on referral content with team members (Pro & Business plans).</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-6">
                    <Link 
                      to="/dashboard" 
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                    >
                      Open Dashboard
                    </Link>
                  </div>
                </div>
                
                <div id="templates" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Templates Library</h2>
                  <p className="text-gray-600 mb-4">
                    Our Templates Library provides pre-made templates for various referral methods that you can customize to your needs.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <Phone size={18} className="text-blue-600" />
                          <h3 className="text-md font-medium text-gray-900 ml-2">Phone Call Scripts</h3>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">Professional scripts for referral calls.</p>
                        <div className="mt-3 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full inline-block">
                          Direct Outreach
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <UserCheck size={18} className="text-purple-600" />
                          <h3 className="text-md font-medium text-gray-900 ml-2">Face-to-Face Guides</h3>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">In-person referral request frameworks.</p>
                        <div className="mt-3 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full inline-block">
                          Meetings & Calls
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <Facebook size={18} className="text-blue-500" />
                          <h3 className="text-md font-medium text-gray-900 ml-2">Facebook Strategies</h3>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">Facebook group referral generation plans.</p>
                        <div className="mt-3 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full inline-block">
                          Group Engagement
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-6">
                    <Link 
                      to="/resources/templates" 
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
                    >
                      Browse Templates Library
                    </Link>
                  </div>
                </div>
                
                <div id="advanced" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Features</h2>
                  <p className="text-gray-600 mb-4">
                    Our Pro and Business plans include advanced features to enhance your referral generation.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4 py-2">
                      <h3 className="text-lg font-medium text-gray-900">AI Content Enhancements</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Use our advanced AI to enhance and polish your referral content for maximum impact.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-blue-500 pl-4 py-2">
                      <h3 className="text-lg font-medium text-gray-900">Custom Branding</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Add your logo and brand colors to exported documents for a professional appearance.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-purple-500 pl-4 py-2">
                      <h3 className="text-lg font-medium text-gray-900">API Access</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Integrate AI Referral Maximizer with your own applications using our API (Business plan only).
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Need More Help?</h3>
                    <p className="text-gray-600 mb-4">
                      If you have any questions or need assistance, our support team is here to help.
                    </p>
                    <div className="space-y-2">
                      <a href="mailto:support@aireferralmaximizer.com" className="text-green-600 hover:text-green-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-4 w-4 mr-2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        Email Support
                      </a>
                      <a href="#" className="text-green-600 hover:text-green-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-4 w-4 mr-2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        Live Chat (Pro & Business plans)
                      </a>
                    </div>
                  </div>
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

export default GuideResourcePage;