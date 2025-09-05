import React, { useState } from 'react';
import { X, BookOpen, HelpCircle, Upload, Target, Download, Layers, Sparkles, User, Mail, Share2, Video, Info, LifeBuoy, BookMarked, CheckCircle, Search, ChevronRight, Building2, FileType, TableProperties, Lightbulb, Heart, Phone, UserCheck, Calendar, VideoIcon, Laptop, Facebook, Linkedin, UsersRound, MessageCircle, Smartphone } from 'lucide-react';

interface AppDocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppDocumentationModal: React.FC<AppDocumentationModalProps> = ({ 
  isOpen, 
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!isOpen) return null;
  
  const sections = {
    overview: {
      title: 'Overview',
      icon: <BookOpen size={20} className="text-green-600" />,
      content: (
        <div className="space-y-4">
          <p>
            The AI Referral Maximizer is a powerful AI-driven platform designed to help you create professional referral-generating content using various communication methods. Using advanced AI technology, the platform generates tailored content that meets your specific business needs.
          </p>
          
          <h4 className="text-lg font-medium text-gray-900 mt-4">Key Benefits</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Time-saving automation</strong> - Generate professional referral scripts and strategies in seconds instead of hours</li>
            <li><strong>Personalized to your business</strong> - Content that reflects your industry, audience, and specific needs</li>
            <li><strong>Comprehensive referral library</strong> - Choose from multiple referral methods for all your business needs</li>
            <li><strong>Easy editing and refinement</strong> - Revise and regenerate content until it's perfect</li>
            <li><strong>Export-ready documents</strong> - Download professional PDFs and presentations ready to use</li>
          </ul>
          
          <h4 className="text-lg font-medium text-gray-900 mt-4">Getting Started</h4>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Complete the personalization process to customize content to your business</li>
            <li>Browse referral methods by category to find what you need</li>
            <li>Select a referral method to generate with AI</li>
            <li>Review the generated content in the preview modal</li>
            <li>Use the revision tools to refine the content if needed</li>
            <li>Download the finished content in your preferred format</li>
          </ol>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100 mt-4">
            <div className="flex">
              <CheckCircle size={18} className="text-green-600 mt-1 mr-2 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-green-800">Interactive Guided Tour</h5>
                <p className="text-sm text-green-700 mt-1">
                  New users will automatically see a guided tour of the platform. You can reset the onboarding process by pressing <kbd className="px-1.5 py-0.5 bg-gray-200 rounded border border-gray-300 text-xs">Alt+Shift+A</kbd> to access admin controls, then clicking "Reset Onboarding."
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    personalization: {
      title: 'Personalization',
      icon: <User size={20} className="text-green-600" />,
      content: (
        <div className="space-y-4">
          <p>
            The personalization feature allows you to customize all generated content to match your specific business needs, industry, and target audience.
          </p>
          
          <h4 className="text-lg font-medium text-gray-900 mt-4">Document Upload Analysis</h4>
          <div className="flex items-start">
            <Upload size={18} className="text-green-600 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Upload Client Documents</p>
              <p className="text-sm text-gray-600">
                Upload client briefs, requirement documents, or any business materials for AI analysis. The system will extract key information and use it to personalize your referral content.
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Supported formats:</strong> PDF, DOCX, TXT, JSON
              </p>
            </div>
          </div>
          
          <h4 className="text-lg font-medium text-gray-900 mt-4">LinkedIn Integration</h4>
          <div className="flex items-start">
            <User size={18} className="text-green-600 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">LinkedIn Profile Analysis</p>
              <p className="text-sm text-gray-600">
                Enter a LinkedIn profile URL to extract professional information such as industry, job title, skills, and company details. This information is used to better tailor your referral content.
              </p>
              <div className="bg-green-50 rounded p-2 mt-1">
                <p className="text-xs text-green-700">
                  <strong>Note:</strong> For best results, use public LinkedIn profiles.
                </p>
              </div>
            </div>
          </div>
          
          <h4 className="text-lg font-medium text-gray-900 mt-4">Manual Settings</h4>
          <div className="space-y-3">
            <div className="flex items-start">
              <Building2 size={18} className="text-green-600 mt-1 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Industry Selection</p>
                <p className="text-sm text-gray-600">
                  Choose your specific industry to ensure content uses appropriate terminology and addresses industry-specific challenges.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <User size={18} className="text-green-600 mt-1 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Target Audience</p>
                <p className="text-sm text-gray-600">
                  Specify who your content is aimed at (e.g., "B2B decision makers," "retail customers") to tailor the messaging appropriately.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Target size={18} className="text-green-600 mt-1 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Special Requirements</p>
                <p className="text-sm text-gray-600">
                  Add specific points, requirements, or themes you want included in all generated content.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border-l-4 border-green-400 p-3 mt-4">
            <p className="text-sm text-green-700">
              <strong>Pro Tip:</strong> For best results, upload a client brief or requirements document first. The AI will analyze it and suggest personalization settings automatically.
            </p>
          </div>
        </div>
      )
    },
    contentTypes: {
      title: 'Referral Methods',
      icon: <BookMarked size={20} className="text-green-600" />,
      content: (
        <div className="space-y-4">
          <p>
            The platform offers multiple referral methods organized by category to support your business growth. Each type is designed for a specific outreach purpose.
          </p>
          
          <h4 className="text-lg font-medium text-gray-900 mt-4">Content Categories</h4>
          <p className="text-sm text-gray-600 mb-3">
            Referral methods are organized into categories for easier navigation:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-3">
              <h5 className="font-medium text-green-800 border-b border-green-100 pb-1 mb-2">Direct Outreach</h5>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Friends & Family Campaign</li>
                <li>• Phone Call Scripts</li>
                <li>• Client Appreciation Events</li>
                <li>• WhatsApp Outreach Campaigns</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-3">
              <h5 className="font-medium text-green-800 border-b border-green-100 pb-1 mb-2">Meetings & Calls</h5>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• In-Person Meetings</li>
                <li>• Zoom Meetings</li>
                <li>• Video Conferences</li>
                <li>• Skype Meetings</li>
                <li>• Screen Sharing</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-3">
              <h5 className="font-medium text-green-800 border-b border-green-100 pb-1 mb-2">Group Engagement</h5>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Facebook Groups</li>
                <li>• LinkedIn Groups</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-3">
              <h5 className="font-medium text-green-800 border-b border-green-100 pb-1 mb-2">Referral Programs</h5>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Reward Programs</li>
                <li>• Lead Magnets</li>
                <li>• Tracking Systems</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-3">
              <h5 className="font-medium text-green-800 border-b border-green-100 pb-1 mb-2">Incentive Structures</h5>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• MLM Structures</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-3">
              <h5 className="font-medium text-green-800 border-b border-green-100 pb-1 mb-2">Follow-up Strategies</h5>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Follow-up Systems</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> WhatsApp Campaigns and Facebook Group Strategies are structured as 14-day plans. Use the day selector to navigate between different days of content.
            </p>
          </div>
          
          <h4 className="text-lg font-medium text-gray-900 mt-4">Multi-Format Export</h4>
          <p className="text-sm text-gray-600 mb-3">
            Each referral method supports specific export formats:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center p-2 bg-gray-50 rounded">
              <FileType size={16} className="text-red-500 mr-2" />
              <span className="font-medium">PDF</span>
              <span className="ml-auto text-xs text-gray-500">All referral methods</span>
            </div>
            
            <div className="flex items-center p-2 bg-gray-50 rounded">
              <FileType size={16} className="text-orange-500 mr-2" />
              <span className="font-medium">PowerPoint (PPTX)</span>
              <span className="ml-auto text-xs text-gray-500">Most referral methods</span>
            </div>
            
            <div className="flex items-center p-2 bg-gray-50 rounded">
              <FileType size={16} className="text-blue-500 mr-2" />
              <span className="font-medium">Word (DOCX)</span>
              <span className="ml-auto text-xs text-gray-500">Script-based content</span>
            </div>
            
            <div className="flex items-center p-2 bg-gray-50 rounded">
              <TableProperties size={16} className="text-green-500 mr-2" />
              <span className="font-medium">Excel (XLSX)</span>
              <span className="ml-auto text-xs text-gray-500">Data-focused content</span>
            </div>
          </div>
        </div>
      )
    },
    features: {
      title: 'Features',
      icon: <Sparkles size={20} className="text-amber-600" />,
      content: (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Document Analysis</h4>
          <p>
            Upload client documents and business materials for AI analysis. The system extracts key information about your industry, audience, and business requirements to personalize content generation.
          </p>
          
          <h4 className="text-lg font-medium text-gray-900 mt-4">Content Revision</h4>
          <div className="flex items-start">
            <Target size={18} className="text-green-600 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Revise Generated Content</p>
              <p className="text-sm text-gray-600">
                Use the "Revise" button to provide specific instructions for improving your content. You can make it more persuasive, simplify language, add examples, or focus on specific aspects.
              </p>
            </div>
          </div>
          
          <h4 className="text-lg font-medium text-gray-900 mt-4">Multi-Day Content Plans</h4>
          <p>
            WhatsApp Outreach Campaigns and Facebook Group Strategies include 14 days of content. Use the day selector to navigate between different days of content.
          </p>
          
          <h4 className="text-lg font-medium text-gray-900 mt-4">Multiple Export Formats</h4>
          <div className="flex items-start">
            <Download size={18} className="text-green-600 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Export in Various Formats</p>
              <p className="text-sm text-gray-600">
                Export any generated content as professionally formatted documents in various formats including PDF, PowerPoint (PPTX), Word (DOCX), and Excel (XLSX) depending on the content type.
              </p>
            </div>
          </div>
          
          <h4 className="text-lg font-medium text-gray-900 mt-4">Content History</h4>
          <p>
            All generated content is automatically saved in your content history. Access previously created documents anytime without regenerating them.
          </p>
          
          <h4 className="text-lg font-medium text-gray-900 mt-4">LinkedIn Integration</h4>
          <div className="flex items-start mt-2">
            <User size={18} className="text-green-600 mt-1 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              Analyze LinkedIn profiles to extract professional details for enhanced personalization. This feature helps tailor content to specific professional contexts.
            </p>
          </div>
          
          <h4 className="text-lg font-medium text-gray-900 mt-4">Voice & SMS Assistant</h4>
          <div className="flex items-start">
            <MessageCircle size={18} className="text-green-600 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Conversational AI Assistant</p>
              <p className="text-sm text-gray-600">
                Access our Voice & SMS Assistant to create personalized voice drops and text message templates for your referral campaigns through a natural conversation interface.
              </p>
            </div>
          </div>
        </div>
      )
    },
    tips: {
      title: 'Tips & Best Practices',
      icon: <Lightbulb size={20} className="text-indigo-600" />,
      content: (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Getting the Best Results</h4>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h5 className="font-medium text-green-800 mb-2">Personalization Tips</h5>
            <ul className="list-disc pl-5 space-y-1 text-sm text-green-700">
              <li>Upload real client documents for the most accurate personalization</li>
              <li>Be specific about your target audience (e.g., "HR directors at mid-size manufacturing companies")</li>
              <li>Include industry-specific terminology in your special requirements</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mt-4">
            <h5 className="font-medium text-blue-800 mb-2">Effective Referral Generation</h5>
            <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
              <li>Focus on value for the referrer first – why should they refer others to you?</li>
              <li>Make the referral process as simple as possible for your contacts</li>
              <li>Combine multiple referral methods for best results (e.g., in-person requests followed by digital reminders)</li>
              <li>Always personalize your referral requests – generic asks get generic results</li>
            </ul>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 mt-4">
            <h5 className="font-medium text-amber-800 mb-2">Communication Channel Selection</h5>
            <ul className="list-disc pl-5 space-y-1 text-sm text-amber-700">
              <li>For high-value contacts, prioritize face-to-face meetings or video calls</li>
              <li>Use group strategies for broader reach with lower-touch interactions</li>
              <li>Phone calls work best for warm contacts who already know your work</li>
              <li>WhatsApp campaigns are ideal for keeping your referral request visible over time</li>
              <li>Screen sharing presentations are perfect for showcasing tangible results</li>
            </ul>
          </div>
        </div>
      )
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <HelpCircle size={22} className="text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Interactive Help Guide</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-72 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <nav className="space-y-1">
              {Object.entries(sections).map(([key, section]) => (
                <button
                  key={key}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-left transition-colors ${
                    activeTab === key
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab(key)}
                >
                  <span className="mr-3">{section.icon}</span>
                  <span className="font-medium">{section.title}</span>
                  <ChevronRight size={16} className="ml-auto" />
                </button>
              ))}
            </nav>
            
            <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-100">
              <h3 className="font-medium text-green-800 flex items-center mb-2">
                <Video size={16} className="mr-2" />
                Video Tutorial
              </h3>
              <p className="text-sm text-green-700 mb-2">
                Watch our comprehensive video tutorial for a visual guide to using the platform.
              </p>
              <button className="w-full bg-green-600 text-white rounded py-1.5 text-sm font-medium hover:bg-green-700 transition-colors">
                Watch Tutorial
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {sections[activeTab as keyof typeof sections].content}
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Close Help
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppDocumentationModal;