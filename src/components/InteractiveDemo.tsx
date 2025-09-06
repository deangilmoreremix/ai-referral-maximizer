import React, { useState, useEffect } from 'react';
import { FileText, MessageSquare, Presentation, Sparkles, Tag, FileBarChart, Send, CheckCircle } from 'lucide-react';
import { generateContent } from '../services/openAIService';

interface DemoTab {
  id: string;
  name: string;
  icon: React.ReactNode;
  inputPlaceholder: string;
}

const InteractiveDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('email');
  const [inputValue, setInputValue] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [activeTabContent, setActiveTabContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const tabs: DemoTab[] = [
    {
      id: 'email',
      name: 'Email Sequence',
      icon: <MessageSquare size={18} className="text-blue-600" />,
      inputPlaceholder: 'Technology industry, targeting marketing executives at enterprise companies...'
    },
    {
      id: 'case',
      name: 'Case Study',
      icon: <FileText size={18} className="text-purple-600" />,
      inputPlaceholder: 'Healthcare industry, rebranding project for medical technology company...'
    },
    {
      id: 'presentation',
      name: 'Presentation',
      icon: <Presentation size={18} className="text-green-600" />,
      inputPlaceholder: 'Financial services, targeting potential investors and partners...'
    },
    {
      id: 'pricing',
      name: 'Pricing Sheet',
      icon: <Tag size={18} className="text-amber-600" />,
      inputPlaceholder: 'Marketing agency, offering rebranding services...'
    },
    {
      id: 'strategy',
      name: 'Strategic Roadmap',
      icon: <FileBarChart size={18} className="text-indigo-600" />,
      inputPlaceholder: 'Retail business, planning digital transformation...'
    }
  ];

  // Clear content when tab changes
  useEffect(() => {
    setActiveTabContent('');
    setGenerated(false);
    setInputValue('');
  }, [activeTab]);
  
  const handleGenerate = async () => {
    if (!inputValue.trim()) return;

    setGenerating(true);
    setError(null);

    try {
      // Call the real API
      const result = await generateContent({
        contentType: tabs.find(tab => tab.id === activeTab)?.name || 'Content',
        industry: 'Technology', // Default industry for demo
        targetAudience: inputValue,
        specialRequirements: 'Professional, engaging, and ready to use'
      });

      // Clear existing content first
      setActiveTabContent('');

      // Display content with progressive appearance for better UX
      const contentLines = result.split('\n');

      let lineIndex = 0;
      const contentInterval = setInterval(() => {
        if (lineIndex < contentLines.length) {
          setActiveTabContent(prev => {
            return prev + contentLines[lineIndex] + '\n';
          });
          lineIndex++;
        } else {
          clearInterval(contentInterval);
          setGenerating(false);
          setGenerated(true);
        }
      }, 30); // Faster for real content

    } catch (error) {
      console.error('Demo generation error:', error);
      setError('Failed to generate content. Please try again.');
      setGenerating(false);
    }
  };
  
  const handleTabChange = (tabId: string) => {
    if (generating) return; // Prevent tab changes during generation
    
    setActiveTab(tabId);
    setGenerated(false);
    setInputValue('');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-3 text-sm font-medium flex items-center transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.icon}
            <span className="ml-2">{tab.name}</span>
          </button>
        ))}
      </div>
      
      <div className="p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="mb-3">
              <label htmlFor="demoInput" className="block text-sm font-medium text-gray-700 mb-1">
                Describe your content needs
              </label>
              <textarea 
                id="demoInput"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder={tabs.find(tab => tab.id === activeTab)?.inputPlaceholder || ''}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={generating}
              ></textarea>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={generating || !inputValue.trim()}
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                generating || !inputValue.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {generating ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Sparkles size={16} className="mr-2" />
                  Generate Content
                </span>
              )}
            </button>
            
            {generated && !generating && (
              <div className="mt-2 flex items-center justify-center p-1.5 bg-green-50 rounded border border-green-100">
                <CheckCircle size={14} className="text-green-600 mr-1.5" />
                <span className="text-xs text-green-700">Content successfully generated!</span>
              </div>
            )}

            {error && (
              <div className="mt-2 flex items-center justify-center p-1.5 bg-red-50 rounded border border-red-100">
                <span className="text-xs text-red-700">{error}</span>
              </div>
            )}
          </div>
          
          <div className="hidden lg:flex items-center justify-center w-10">
            <Send size={20} className="text-gray-400 transform rotate-90" />
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
              <span>AI-Generated Output</span>
              {generated && !generating && (
                <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded flex items-center">
                  <CheckCircle size={10} className="mr-1" />
                  Complete
                </span>
              )}
            </label>
            <div className="border border-gray-300 rounded-lg p-3 h-[256px] overflow-y-auto bg-gray-50 relative">
              {generating ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-blue-700 text-sm">AI is generating content...</p>
                  </div>
                </div>
              ) : generated ? (
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-xs font-mono text-gray-800 overflow-x-auto">
                    {activeTabContent}
                  </pre>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  <p>Fill in the form and click Generate to see AI-generated content</p>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;