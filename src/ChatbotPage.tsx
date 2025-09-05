import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, ArrowLeft, MessageSquare, Phone, Calendar, Target, Smartphone, BarChart2, Shield, Laptop, Users, Send, Globe, Link2 } from 'lucide-react';
import { CommunicationProvider } from './contexts/CommunicationContext';
import ErrorBoundary from './contexts/ErrorBoundary';
import VoiceDropManager from './components/VoiceDropManager';
import ChannelMessagingHub from './components/ChannelMessagingHub';
import CommunicationAnalytics from './components/CommunicationAnalytics';
import EnhancedVoiceSmsAgent from './components/EnhancedVoiceSmsAgent';
import ServiceSelectorModal from './components/ServiceSelectorModal';
import SocialMediaMessagingHub from './components/SocialMediaMessagingHub';
import UnipileAPIIntegration from './components/UnipileAPIIntegration';
import { Service } from './components/ServiceSelectorModal';

// Enum for different action modes
enum ActionMode {
  None,
  VoiceDrop,
  Messaging,
  Analytics,
  Agent,
  SocialMedia,
  APISetup
}

const ChatbotPage: React.FC = () => {
  // State to track which component should be shown
  const [activeMode, setActiveMode] = useState<ActionMode>(ActionMode.None);
  // State for service selector modal
  const [showServiceSelector, setShowServiceSelector] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionMode>(ActionMode.None);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // Handle selecting a service from the modal
  const handleServiceSelect = (service: Service) => {
    console.log(`Selected service: ${service.name}`);
    setSelectedService(service);
    // Activate the previously selected action mode with the selected service
    setActiveMode(selectedAction);
    setShowServiceSelector(false);
  };

  // Handle clicking a tile to show the service selector first
  const handleTileClick = (mode: ActionMode) => {
    setSelectedAction(mode);
    setShowServiceSelector(true);
  };

  // Handle direct click on AI assistant or Social Media
  const handleDirectComponentOpen = (mode: ActionMode) => {
    // For some components, go directly without service selection
    setActiveMode(mode);
  };
  
  // Handle component close (return to the main menu)
  const handleComponentClose = () => {
    setActiveMode(ActionMode.None);
    setSelectedService(null);
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
            
            <div className="flex space-x-3">
              <Link
                to="/referral-methods"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Browse Referral Methods
              </Link>
              <Link
                to="/app"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Content Generator
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Page title */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-green-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">Voice & SMS Tools</h1>
          </div>
          <p className="mt-2 text-sm text-gray-600 max-w-3xl">
            Create personalized voice drops and SMS templates for your referral outreach. Choose from the tools below to get started.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error boundary to prevent entire page from crashing */}
        <ErrorBoundary
          fallback={
            <div className="p-6 flex flex-col items-center justify-center">
              <div className="p-6 bg-amber-50 rounded-lg border border-amber-200 max-w-lg text-center">
                <h2 className="text-lg font-semibold text-amber-800 mb-2">Component Error</h2>
                <p className="text-amber-700 mb-4">
                  We encountered an issue loading this component. It may require additional configuration.
                </p>
                <p className="text-sm text-amber-600">
                  You can still use other features of the application. For urgent assistance, please contact support.
                </p>
              </div>
            </div>
          }
        >
          <CommunicationProvider>
            {/* Action cards */}
            {activeMode === ActionMode.None && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Voice Drop Tool */}
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <Phone size={24} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Voice Drops</h3>
                    <p className="text-gray-600 mb-4">
                      Create professional voice messages to leave for contacts. Perfect for initial outreach or follow-ups with referral contacts.
                    </p>
                    <button 
                      className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center justify-center transition-colors"
                      onClick={() => handleTileClick(ActionMode.VoiceDrop)}
                    >
                      Create Voice Drop
                    </button>
                  </div>
                  <div className="bg-green-50 px-6 py-3 border-t border-green-100">
                    <div className="flex items-center text-sm text-green-700">
                      <Target size={16} className="mr-1.5" />
                      <span>42% higher response rate than emails</span>
                    </div>
                  </div>
                </div>

                {/* SMS & Messaging */}
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Smartphone size={24} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">SMS & Messaging</h3>
                    <p className="text-gray-600 mb-4">
                      Create and send personalized text messages, WhatsApp messages, and other messaging templates for referral outreach.
                    </p>
                    <button 
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center transition-colors"
                      onClick={() => handleTileClick(ActionMode.Messaging)}
                    >
                      Create Messages
                    </button>
                  </div>
                  <div className="bg-blue-50 px-6 py-3 border-t border-blue-100">
                    <div className="flex items-center text-sm text-blue-700">
                      <MessageSquare size={16} className="mr-1.5" />
                      <span>98% open rate on text messages</span>
                    </div>
                  </div>
                </div>

                {/* Social Media Posts */}
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                      <Globe size={24} className="text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Social Media</h3>
                    <p className="text-gray-600 mb-4">
                      Create and schedule social media posts across multiple platforms to generate referrals through your social networks.
                    </p>
                    <button 
                      className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded flex items-center justify-center transition-colors"
                      onClick={() => handleDirectComponentOpen(ActionMode.SocialMedia)}
                    >
                      Create Social Posts
                    </button>
                  </div>
                  <div className="bg-indigo-50 px-6 py-3 border-t border-indigo-100">
                    <div className="flex items-center text-sm text-indigo-700">
                      <Users size={16} className="mr-1.5" />
                      <span>Reach your entire network efficiently</span>
                    </div>
                  </div>
                </div>

                {/* Analytics Dashboard */}
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <BarChart2 size={24} className="text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                    <p className="text-gray-600 mb-4">
                      Track the performance of your voice drops and messaging campaigns with detailed analytics and insights.
                    </p>
                    <button 
                      className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded flex items-center justify-center transition-colors"
                      onClick={() => handleTileClick(ActionMode.Analytics)}
                    >
                      View Analytics
                    </button>
                  </div>
                  <div className="bg-purple-50 px-6 py-3 border-t border-purple-100">
                    <div className="flex items-center text-sm text-purple-700">
                      <Calendar size={16} className="mr-1.5" />
                      <span>Campaign performance tracking</span>
                    </div>
                  </div>
                </div>

                {/* API Configuration */}
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                      <Link2 size={24} className="text-amber-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">API Integrations</h3>
                    <p className="text-gray-600 mb-4">
                      Configure API integrations with Unipile to connect social media accounts and messaging platforms for seamless communication.
                    </p>
                    <button 
                      className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded flex items-center justify-center transition-colors"
                      onClick={() => handleDirectComponentOpen(ActionMode.APISetup)}
                    >
                      Configure APIs
                    </button>
                  </div>
                  <div className="bg-amber-50 px-6 py-3 border-t border-amber-100">
                    <div className="flex items-center text-sm text-amber-700">
                      <Shield size={16} className="mr-1.5" />
                      <span>Secure multi-channel messaging</span>
                    </div>
                  </div>
                </div>

                {/* AI Voice & SMS Agent Card */}
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                      <MessageSquare size={24} className="text-teal-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Assistant</h3>
                    <p className="text-gray-600 mb-4">
                      Use our conversational AI assistant to help create personalized voice drops, SMS templates, and social posts through natural dialogue.
                    </p>
                    <button 
                      className="w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded flex items-center justify-center transition-colors"
                      onClick={() => handleDirectComponentOpen(ActionMode.Agent)}
                    >
                      Chat with AI Assistant
                    </button>
                  </div>
                  <div className="bg-teal-50 px-6 py-3 border-t border-teal-100">
                    <div className="flex items-center text-sm text-teal-700">
                      <Laptop size={16} className="mr-1.5" />
                      <span>Smart templates and suggestions</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Service Selector Modal */}
            <ServiceSelectorModal
              isOpen={showServiceSelector}
              onClose={() => setShowServiceSelector(false)}
              onSelectService={handleServiceSelect}
              initialCategory={selectedAction === ActionMode.VoiceDrop ? 'voice' : 
                              selectedAction === ActionMode.Messaging ? 'text' : 
                              selectedAction === ActionMode.Analytics ? 'multi-channel' : 'voice'}
            />

            {/* Render the appropriate component based on active mode */}
            {activeMode === ActionMode.VoiceDrop && (
              <VoiceDropManager 
                onClose={handleComponentClose}
                onSuccess={(result) => {
                  console.log('Voice drop created:', result);
                  handleComponentClose();
                }}
              />
            )}
            
            {activeMode === ActionMode.Messaging && (
              <ChannelMessagingHub
                onClose={handleComponentClose}
                onSuccess={(result) => {
                  console.log('Messages sent:', result);
                  handleComponentClose();
                }}
              />
            )}
            
            {activeMode === ActionMode.SocialMedia && (
              <SocialMediaMessagingHub
                onClose={handleComponentClose}
                onSuccess={(result) => {
                  console.log('Social media post created:', result);
                  handleComponentClose();
                }}
              />
            )}
            
            {activeMode === ActionMode.Analytics && (
              <CommunicationAnalytics
                onClose={handleComponentClose}
              />
            )}
            
            {activeMode === ActionMode.APISetup && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-amber-500 to-amber-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Link2 className="text-white mr-2 h-6 w-6" />
                      <h2 className="text-xl font-semibold text-white">API Integration Settings</h2>
                    </div>
                    <button 
                      onClick={handleComponentClose}
                      className="p-1 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-colors"
                    >
                      <ArrowLeft size={18} />
                    </button>
                  </div>
                </div>
                <UnipileAPIIntegration 
                  onIntegrationComplete={() => {
                    // After successful integration, we could redirect or show success
                    setTimeout(() => handleComponentClose(), 2000);
                  }}
                />
              </div>
            )}
            
            {activeMode === ActionMode.Agent && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-green-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MessageSquare className="text-white mr-2 h-6 w-6" />
                      <h2 className="text-xl font-semibold text-white">AI Voice & SMS Assistant</h2>
                    </div>
                    <button 
                      onClick={handleComponentClose}
                      className="p-1 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-colors"
                    >
                      <ArrowLeft size={18} />
                    </button>
                  </div>
                </div>
                <EnhancedVoiceSmsAgent />
              </div>
            )}
          </CommunicationProvider>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default ChatbotPage;