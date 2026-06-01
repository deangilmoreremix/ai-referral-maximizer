import React, { useState } from 'react';
import { 
  Users, Calendar, Target, FileText, Plus, ChevronDown, ChevronUp, Edit, Trash2, 
  CheckCircle, MessageSquare, Phone, Mail, Globe, ArrowRight, Briefcase, AlertCircle, 
  Download, BarChart2, Clock, ImageIcon, X, Sparkles, RefreshCw
} from 'lucide-react';
import { generateContent } from '../../services/openAIService';
import ImageGenerator from '../ImageGenerator';

interface ClientCampaign {
  id: string;
  name: string;
  description: string;
  clientName: string;
  clientIndustry: string;
  targetAudience: string;
  channels: string[];
  startDate: string;
  endDate: string;
  goals: {
    referralCount: number;
    conversionRate: number;
  };
  status: 'draft' | 'active' | 'scheduled' | 'completed';
}

interface ContentTemplate {
  id: string;
  channel: string;
  title: string;
  content: string;
  timing: string;
}

const ClientCampaignBuilder: React.FC = () => {
  const [campaigns, setCampaigns] = useState<ClientCampaign[]>([
    {
      id: 'camp-1',
      name: 'Q2 Client Referral Drive',
      description: 'Comprehensive referral campaign for high-value clients',
      clientName: 'Acme Tech Solutions',
      clientIndustry: 'Technology',
      targetAudience: 'Small to medium business owners in the tech sector',
      channels: ['email', 'phone', 'whatsapp'],
      startDate: '2025-04-15',
      endDate: '2025-05-15',
      goals: {
        referralCount: 20,
        conversionRate: 35
      },
      status: 'active'
    },
    {
      id: 'camp-2',
      name: 'Summer Referral Boost',
      description: 'Short-term campaign focused on quick wins',
      clientName: 'Green Valley Consulting',
      clientIndustry: 'Financial Services',
      targetAudience: 'Executives at mid-sized financial firms',
      channels: ['email', 'linkedin', 'face-to-face'],
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      goals: {
        referralCount: 15,
        conversionRate: 30
      },
      status: 'scheduled'
    }
  ]);

  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [showTemplateCreator, setShowTemplateCreator] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string>('email');
  const [contentTemplates, setContentTemplates] = useState<ContentTemplate[]>([
    {
      id: 'template-1',
      channel: 'email',
      title: 'Initial Referral Request',
      content: 'Hello {{name}}, I hope this email finds you well. I\'m reaching out because my firm is helping {{client_name}} with a focused referral initiative this quarter. Given our excellent results with them, they suggested you might know other {{target_audience}} who could benefit from similar services. Would you be open to suggesting a few contacts who might be interested?',
      timing: 'Day 1'
    },
    {
      id: 'template-2',
      channel: 'email',
      title: 'Follow-up Email',
      content: 'Hi {{name}}, I wanted to follow up on my previous email about {{client_name}}\'s referral program. Have you had a chance to think about anyone who might benefit from their services? I\'d be happy to share more information or answer any questions you might have.',
      timing: 'Day 5'
    },
    {
      id: 'template-3',
      channel: 'whatsapp',
      title: 'WhatsApp Introduction',
      content: 'Hi {{name}}! 👋 I\'m working with {{client_name}} on their referral program. They mentioned you might know others in the {{industry}} industry who could benefit from their services. Would love to chat about this - let me know if you have a few minutes this week! 🙏',
      timing: 'Day 2'
    }
  ]);

  const [newTemplate, setNewTemplate] = useState({
    channel: 'email',
    title: '',
    content: '',
    timing: 'Day 1'
  });
  
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [campaignImages, setCampaignImages] = useState<Record<string, string[]>>({});

  // Handle selecting a campaign
  const handleSelectCampaign = (campaignId: string) => {
    setSelectedCampaign(selectedCampaign === campaignId ? null : campaignId);
  };

  // Generate campaign content
  const handleGenerateTemplate = async () => {
    if (!selectedChannel) return;
    
    setIsGenerating(true);
    
    try {
      const campaign = campaigns.find(c => c.id === selectedCampaign);
      
      if (!campaign) {
        throw new Error("No campaign selected");
      }
      
      // Build the prompt
      const prompt = `
Create a professional ${selectedChannel} template for a referral campaign with the following details:

Campaign Name: ${campaign.name}
Client: ${campaign.clientName} (${campaign.clientIndustry})
Target Audience: ${campaign.targetAudience}

This template should be designed to generate high-quality referrals. Make it persuasive but not pushy, professional, and include personalization variables like {{name}}, {{client_name}}, etc.

For ${selectedChannel} specifically, ensure the content follows best practices for this channel in terms of length, tone, and format.
      `;
      
      // Generate content
      const content = await generateContent({
        contentType: `${selectedChannel} Template`,
        specialRequirements: prompt
      });
      
      // Add the new template
      const newTemplateObj: ContentTemplate = {
        id: `template-${Date.now()}`,
        channel: selectedChannel,
        title: `${selectedChannel.charAt(0).toUpperCase() + selectedChannel.slice(1)} Template`,
        content: content,
        timing: 'Day 1'
      };
      
      setContentTemplates([...contentTemplates, newTemplateObj]);
      setNewTemplate({
        channel: selectedChannel,
        title: newTemplateObj.title,
        content: content,
        timing: 'Day 1'
      });
      
    } catch (error) {
      console.error("Error generating template:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Cancel new campaign creation
  const handleCancelNewCampaign = () => {
    setIsCreatingCampaign(false);
  };

  // Create new campaign
  const handleCreateCampaign = () => {
    const newCampaign: ClientCampaign = {
      id: `camp-${Date.now()}`,
      name: 'New Referral Campaign',
      description: 'Campaign description',
      clientName: '',
      clientIndustry: '',
      targetAudience: '',
      channels: ['email'],
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      goals: {
        referralCount: 10,
        conversionRate: 25
      },
      status: 'draft'
    };
    
    setCampaigns([...campaigns, newCampaign]);
    setSelectedCampaign(newCampaign.id);
    setIsCreatingCampaign(false);
  };
  
  // Generate campaign visuals
  const handleGenerateCampaignVisuals = async () => {
    if (!selectedCampaign) return;
    setShowImageGenerator(true);
  };

  const handleImageGenerated = (imageUrl: string) => {
    if (selectedCampaign) {
      setCampaignImages(prev => ({
        ...prev,
        [selectedCampaign]: [...(prev[selectedCampaign] || []), imageUrl]
      }));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Client Campaign Builder</h2>
          </div>
          
          <button 
            onClick={() => setIsCreatingCampaign(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm flex items-center text-sm font-medium transition-colors"
            disabled={isCreatingCampaign}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Campaign
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {isCreatingCampaign ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Campaign</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input 
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  placeholder="Enter campaign name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <input 
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  placeholder="Client name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm">
                  <option>Technology</option>
                  <option>Financial Services</option>
                  <option>Healthcare</option>
                  <option>Manufacturing</option>
                  <option>Retail</option>
                  <option>Professional Services</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                <input 
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  placeholder="e.g., SMB owners in manufacturing"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input 
                  type="date"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input 
                  type="date"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Description</label>
                <textarea 
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  placeholder="Describe the campaign purpose and goals"
                  rows={3}
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelNewCampaign}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCampaign}
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Create Campaign
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Client Campaigns</h3>
              
              {campaigns.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-1">No campaigns yet</h4>
                  <p className="text-gray-500 mb-4">Create your first client referral campaign to get started</p>
                  <button
                    onClick={() => setIsCreatingCampaign(true)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm inline-flex items-center text-sm font-medium"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Create Campaign
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {campaigns.map((campaign) => (
                    <div 
                      key={campaign.id}
                      className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                        selectedCampaign === campaign.id 
                          ? 'border-green-300 shadow-md ring-1 ring-green-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div 
                        className={`flex justify-between items-center p-4 cursor-pointer ${selectedCampaign === campaign.id ? 'bg-green-50' : 'bg-white'}`}
                        onClick={() => handleSelectCampaign(campaign.id)}
                      >
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                            campaign.status === 'active' ? 'bg-green-100' : 
                            campaign.status === 'scheduled' ? 'bg-blue-100' : 
                            campaign.status === 'completed' ? 'bg-gray-100' : 
                            'bg-amber-100'
                          }`}>
                            <Briefcase className={`h-5 w-5 ${
                              campaign.status === 'active' ? 'text-green-600' : 
                              campaign.status === 'scheduled' ? 'text-blue-600' : 
                              campaign.status === 'completed' ? 'text-gray-600' : 
                              'text-amber-600'
                            }`} />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                            <p className="text-sm text-gray-500">{campaign.clientName}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`mr-3 px-2 py-1 text-xs rounded-full ${
                            campaign.status === 'active' ? 'bg-green-100 text-green-800' : 
                            campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                            campaign.status === 'completed' ? 'bg-gray-100 text-gray-800' : 
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                          </span>
                          {selectedCampaign === campaign.id ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      
                      {selectedCampaign === campaign.id && (
                        <div className="border-t border-gray-200 p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                              <p className="text-sm text-gray-800">{campaign.description}</p>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Target Audience</label>
                              <p className="text-sm text-gray-800">{campaign.targetAudience}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                              <p className="text-sm text-gray-800">{new Date(campaign.startDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                              <p className="text-sm text-gray-800">{new Date(campaign.endDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Referral Goal</label>
                              <p className="text-sm text-gray-800">{campaign.goals.referralCount} referrals</p>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Conversion Target</label>
                              <p className="text-sm text-gray-800">{campaign.goals.conversionRate}%</p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <label className="block text-xs font-medium text-gray-500 mb-2">Channels</label>
                            <div className="flex flex-wrap gap-2">
                              {campaign.channels.map((channel) => (
                                <div key={channel} className="flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                    {channel === 'email' && <Mail size={14} className="mr-1.5 text-gray-500" />}
                                    {channel === 'phone' && <Phone size={14} className="mr-1.5 text-gray-500" />}
                                    {channel === 'whatsapp' && <MessageSquare size={14} className="mr-1.5 text-gray-500" />}
                                    {channel === 'linkedin' && <Globe size={14} className="mr-1.5 text-gray-500" />}
                                    {channel === 'face-to-face' && <Users size={14} className="mr-1.5 text-gray-500" />}
                                    {channel.charAt(0).toUpperCase() + channel.slice(1)}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mt-6 flex flex-wrap gap-3">
                              {showTemplateCreator ? (
                                <div className="w-full border border-gray-200 rounded-lg p-4 bg-gray-50">
                                  <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-900">Create Content Template</h4>
                                    <button 
                                      onClick={() => setShowTemplateCreator(false)}
                                      className="text-gray-400 hover:text-gray-600"
                                    >
                                      <X className="h-5 w-5" />
                                    </button>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
                                      <select 
                                        value={selectedChannel}
                                        onChange={(e) => setSelectedChannel(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                      >
                                        <option value="email">Email</option>
                                        <option value="phone">Phone Script</option>
                                        <option value="whatsapp">WhatsApp</option>
                                        <option value="linkedin">LinkedIn</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Timing</label>
                                      <select 
                                        value={newTemplate.timing}
                                        onChange={(e) => setNewTemplate({...newTemplate, timing: e.target.value})}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                      >
                                        <option value="Day 1">Day 1</option>
                                        <option value="Day 3">Day 3</option>
                                        <option value="Day 5">Day 5</option>
                                        <option value="Day 7">Day 7</option>
                                        <option value="Day 10">Day 10</option>
                                        <option value="Day 14">Day 14</option>
                                        <option value="Follow-up">Follow-up</option>
                                      </select>
                                    </div>
                                  </div>
                                  
                                  <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Template Title</label>
                                    <input
                                      type="text"
                                      value={newTemplate.title}
                                      onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
                                      placeholder="e.g., Initial Outreach"
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                    />
                                  </div>
                                  
                                  <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                    <textarea
                                      value={newTemplate.content}
                                      onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                                      rows={6}
                                      placeholder="Enter your template content here... Use {{name}}, {{client_name}}, etc. for personalization."
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                    ></textarea>
                                  </div>
                                  
                                  <div className="flex justify-between">
                                    <button
                                      onClick={handleGenerateTemplate}
                                      className="inline-flex items-center px-3 py-2 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                      {isGenerating ? (
                                        <>
                                          <RefreshCw className="animate-spin -ml-0.5 mr-2 h-4 w-4" />
                                          Generating...
                                        </>
                                      ) : (
                                        <>
                                          <Sparkles className="-ml-0.5 mr-2 h-4 w-4" />
                                          Generate with AI
                                        </>
                                      )}
                                    </button>
                                    
                                    <div>
                                      <button
                                        onClick={() => setShowTemplateCreator(false)}
                                        className="mr-2 px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (newTemplate.title && newTemplate.content) {
                                            setContentTemplates([...contentTemplates, {
                                              id: `template-${Date.now()}`,
                                              channel: selectedChannel,
                                              title: newTemplate.title,
                                              content: newTemplate.content,
                                              timing: newTemplate.timing
                                            }]);
                                            setNewTemplate({
                                              channel: 'email',
                                              title: '',
                                              content: '',
                                              timing: 'Day 1'
                                            });
                                            setShowTemplateCreator(false);
                                          }
                                        }}
                                        disabled={!newTemplate.title || !newTemplate.content}
                                        className="px-3 py-2 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                      >
                                        Save Template
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() => setShowTemplateCreator(true)}
                                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow-sm text-sm font-medium flex items-center"
                                  >
                                    <Plus className="h-4 w-4 mr-1.5" />
                                    Create Content Template
                                  </button>
                                  
                                  <button
                                    onClick={handleGenerateCampaignVisuals}
                                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded shadow-sm text-sm font-medium flex items-center"
                                  >
                                    <ImageIcon className="h-4 w-4 mr-1.5" />
                                    Generate Visuals
                                  </button>
                                </>
                              )}
                              
                              <button
                                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm text-sm font-medium flex items-center"
                              >
                                <BarChart2 className="h-4 w-4 mr-1.5" />
                                Campaign Analytics
                              </button>
                              
                              <button
                                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded shadow-sm text-sm font-medium flex items-center"
                              >
                                <Download className="h-4 w-4 mr-1.5" />
                                Export Campaign
                              </button>
                            </div>
                            
                            {/* Generated Visuals */}
                            {selectedCampaign && campaignImages[selectedCampaign]?.length > 0 && (
                              <div className="mt-6 border-t border-gray-200 pt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Campaign Visuals</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                  {campaignImages[selectedCampaign]?.map((imageUrl, idx) => (
                                    <div key={idx} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                      <img 
                                        src={imageUrl} 
                                        alt={`Campaign visual ${idx + 1}`}
                                        className="w-full h-auto object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Templates list */}
                            {contentTemplates.length > 0 && (
                              <div className="mt-6 border-t border-gray-200 pt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Campaign Templates</h4>
                                <div className="space-y-3">
                                  {contentTemplates.map(template => (
                                    <div key={template.id} className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow">
                                      <div className="flex justify-between items-start">
                                        <div className="flex items-start">
                                          <div className={`p-2 rounded-full flex-shrink-0 ${
                                            template.channel === 'email' ? 'bg-blue-100' : 
                                            template.channel === 'phone' ? 'bg-purple-100' :
                                            template.channel === 'whatsapp' ? 'bg-green-100' :
                                            'bg-indigo-100'
                                          }`}>
                                            {template.channel === 'email' && <Mail size={14} className="text-blue-600" />}
                                            {template.channel === 'phone' && <Phone size={14} className="text-purple-600" />}
                                            {template.channel === 'whatsapp' && <MessageSquare size={14} className="text-green-600" />}
                                            {template.channel === 'linkedin' && <Globe size={14} className="text-indigo-600" />}
                                          </div>
                                          <div className="ml-3">
                                            <h5 className="text-sm font-medium text-gray-900">{template.title}</h5>
                                            <div className="flex items-center mt-1">
                                              <span className="text-xs text-gray-500 mr-3">
                                                {template.channel.charAt(0).toUpperCase() + template.channel.slice(1)}
                                              </span>
                                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                                {template.timing}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex">
                                          <button className="text-gray-400 hover:text-gray-600 p-1">
                                            <Edit size={14} />
                                          </button>
                                          <button className="text-gray-400 hover:text-red-600 p-1">
                                            <Trash2 size={14} />
                                          </button>
                                        </div>
                                      </div>
                                      <div className="mt-3 pl-9">
                                        <p className="text-xs text-gray-600 line-clamp-2">{template.content}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          </div>
        )}
      </div>
      
      {/* Image Generator Modal */}
      {showImageGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">AI Campaign Visual Generator</h2>
              <button
                onClick={() => setShowImageGenerator(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <ImageGenerator
                contentType="presentation"
                contentTitle="Campaign Visuals"
                onImageGenerated={handleImageGenerated}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientCampaignBuilder;