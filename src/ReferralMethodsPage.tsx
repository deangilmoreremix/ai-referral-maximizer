import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, ArrowLeft, Book, Award, Star, CheckCircle, UserCheck, FileBarChart, MessageSquare, Sparkles, Target, Phone, Heart, Info, ChevronUp, ChevronDown, Video, Smartphone, Calendar } from 'lucide-react';
import AllReferralMethods from './components/AllReferralMethods';
import ReferralImplementationGuide from './components/ReferralImplementationGuide';

const ReferralMethodsPage: React.FC = () => {
  const [showImplementationGuide, setShowImplementationGuide] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('introduction');

  const handleSelectMethod = (method: string) => {
    setSelectedMethod(method);
    setShowImplementationGuide(true);
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="text-gray-500 hover:text-gray-700 mr-4">
                <ArrowLeft size={20} />
              </Link>
              <div className="flex items-center">
                <UserPlus className="h-8 w-8 text-green-600" />
                <h1 className="ml-2 text-2xl font-bold text-gray-900">AI Referral Maximizer</h1>
              </div>
            </div>
            <div>
              <Link
                to="/app"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Go to Generator
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction Section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('introduction')}>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Book size={24} className="text-green-600 mr-2" />
              Comprehensive Referral Generation Guide
            </h2>
            <div>
              {expandedSection === 'introduction' ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </div>
          </div>
          
          {expandedSection === 'introduction' && (
            <div className="mt-4">
              <p className="text-gray-600 mb-4">
                Welcome to our comprehensive guide to referral generation. This resource will help you implement effective referral strategies across multiple communication channels and methods.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-green-50 rounded-lg p-5 border border-green-100">
                  <div className="flex items-center mb-3">
                    <Award size={20} className="text-green-600 mr-2" />
                    <h3 className="font-semibold text-green-800">Why Referrals Matter</h3>
                  </div>
                  <ul className="space-y-2 text-green-700">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                      <span>92% higher trust than other lead sources</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Referred leads convert 4x faster</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                      <span>37% higher retention rate</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Cost of acquisition is 5x lower</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                  <div className="flex items-center mb-3">
                    <Target size={20} className="text-blue-600 mr-2" />
                    <h3 className="font-semibold text-blue-800">Implementation Principles</h3>
                  </div>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Focus on value for the referrer first</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Be extremely specific about who you want</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Make referring you incredibly easy</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Follow up consistently but respectfully</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-5 border border-purple-100">
                  <div className="flex items-center mb-3">
                    <Star size={20} className="text-purple-600 mr-2" />
                    <h3 className="font-semibold text-purple-800">Best Performing Methods</h3>
                  </div>
                  <ol className="space-y-2 text-purple-700 list-decimal ml-5">
                    <li>
                      <span className="font-medium">Face-to-face meetings</span>
                      <div className="text-xs mt-0.5">42% conversion rate</div>
                    </li>
                    <li>
                      <span className="font-medium">Zoom/video conferences</span>
                      <div className="text-xs mt-0.5">38% conversion rate</div>
                    </li>
                    <li>
                      <span className="font-medium">Phone call requests</span>
                      <div className="text-xs mt-0.5">35% conversion rate</div>
                    </li>
                    <li>
                      <span className="font-medium">WhatsApp campaigns</span>
                      <div className="text-xs mt-0.5">29% conversion rate</div>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-5 border border-amber-100 mt-6">
                <div className="flex items-start">
                  <Info size={20} className="text-amber-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-2">How to Use This Guide</h3>
                    <p className="text-amber-700 mb-2">
                      Browse the referral methods below and select the ones that best match your business and communication style. Each method includes:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-amber-700">
                      <li>Step-by-step implementation instructions</li>
                      <li>Ready-to-use templates and scripts</li>
                      <li>Best practices and common pitfalls to avoid</li>
                      <li>Tips for measuring and improving results</li>
                    </ul>
                    <p className="text-amber-700 mt-2">
                      For best results, implement 2-3 complementary methods simultaneously. For example, combine face-to-face requests with a follow-up WhatsApp campaign.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Featured Methods Section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('featured')}>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Award size={22} className="text-amber-500 mr-2" />
              Featured Referral Methods
            </h2>
            <div>
              {expandedSection === 'featured' ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </div>
          </div>

          {expandedSection === 'featured' && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Method 1: Face-to-Face Meetings */}
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <UserCheck size={22} className="text-purple-600" />
                    <h3 className="font-semibold text-gray-800 ml-2">Face-to-Face Meetings</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    The highest-converting referral approach with proven 40%+ success rates when implemented correctly.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                      42% conversion rate
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectMethod('Face-to-Face Meeting Guides');
                      }}
                      className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                    >
                      View Guide
                      <ArrowRight size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Method 2: WhatsApp Campaigns */}
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <Smartphone size={22} className="text-green-500" />
                    <h3 className="font-semibold text-gray-800 ml-2">WhatsApp Campaigns</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Leverage the 98% open rate of WhatsApp with our 14-day systematic referral generation campaign.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      29% conversion rate
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectMethod('WhatsApp Outreach Campaigns');
                      }}
                      className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                    >
                      View Guide
                      <ArrowRight size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Method 3: Friends & Family Campaign */}
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <Heart size={22} className="text-pink-500" />
                    <h3 className="font-semibold text-gray-800 ml-2">Friends & Family Campaign</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Our most popular approach for new businesses looking to build an initial client base through trusted relationships.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-medium px-2 py-1 bg-pink-100 text-pink-800 rounded-full">
                      High trust factor
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectMethod('Friends and Family Campaign');
                      }}
                      className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                    >
                      View Guide
                      <ArrowRight size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* All Referral Methods */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <FileBarChart size={24} className="text-green-600 mr-2" />
          Complete Referral Method Library
        </h2>
        
        <AllReferralMethods onSelectMethod={handleSelectMethod} />
      </main>

      {/* Implementation Guide Modal */}
      <ReferralImplementationGuide
        isOpen={showImplementationGuide}
        onClose={() => setShowImplementationGuide(false)}
        referralMethod={selectedMethod}
      />
    </div>
  );
};

export default ReferralMethodsPage;