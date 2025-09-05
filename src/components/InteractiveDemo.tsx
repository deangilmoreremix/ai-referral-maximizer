import React, { useState, useEffect } from 'react';
import { FileText, MessageSquare, Presentation, Sparkles, Tag, FileBarChart, Send, CheckCircle } from 'lucide-react';

interface DemoTab {
  id: string;
  name: string;
  icon: React.ReactNode;
  inputPlaceholder: string;
  outputExample: string;
}

const InteractiveDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('email');
  const [inputValue, setInputValue] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [activeTabContent, setActiveTabContent] = useState<string>('');
  
  const tabs: DemoTab[] = [
    {
      id: 'email',
      name: 'Email Sequence',
      icon: <MessageSquare size={18} className="text-blue-600" />,
      inputPlaceholder: 'Technology industry, targeting marketing executives at enterprise companies...',
      outputExample: `### DAY 1: The Changing Face of Digital Identity

Subject: [First Name], Is Your Brand Ready for the Digital Evolution?

Hello [First Name],

In today's rapidly evolving digital landscape, your brand identity is more than just a logo—it's the complete digital experience you provide to your customers.

Our data shows that technology companies that underwent strategic rebranding saw an average of:
• 34% increase in website engagement
• 27% improvement in qualified lead generation
• 22% higher customer retention rates

Would you be interested in seeing how these numbers could apply to [Company Name]?

I'll follow up in a few days with some specific insights for technology firms like yours.

Best regards,
[Your Name]
[Your Company]`
    },
    {
      id: 'case',
      name: 'Case Study',
      icon: <FileText size={18} className="text-purple-600" />,
      inputPlaceholder: 'Healthcare industry, rebranding project for medical technology company...',
      outputExample: `# MediTech Solutions: Brand Transformation Case Study

## Client Challenge
MediTech Solutions, a growing medical technology provider with 10+ years in the industry, faced significant challenges with their brand identity:

- Brand perception lagged behind their innovative product offerings
- Inconsistent messaging across different product lines
- Difficulty differentiating from competitors in a crowded market
- Limited appeal to younger healthcare professionals

## Our Approach

### Discovery & Analysis
We conducted comprehensive stakeholder interviews, market research, and competitive analysis to understand MediTech's unique position in the healthcare technology space.

### Strategy Development
Working closely with leadership, we crafted a new brand strategy that highlighted MediTech's commitment to both cutting-edge innovation and proven reliability.

### Implementation
We delivered a complete brand transformation package including:
- Modernized visual identity system
- Consolidated messaging framework
- Digital presence overhaul
- Employee brand ambassador program

## Results

The rebranding initiative delivered measurable business impact within the first 12 months:

- **42% increase** in qualified sales leads
- **38% improvement** in website engagement metrics
- **27% growth** in social media following
- **3 major partnerships** with leading healthcare networks
- **Reduced sales cycle** from 8 months to 5.5 months`
    },
    {
      id: 'presentation',
      name: 'Presentation',
      icon: <Presentation size={18} className="text-green-600" />,
      inputPlaceholder: 'Financial services, targeting potential investors and partners...',
      outputExample: `# FinCore Partners: Investment Opportunity

## About Us
- Industry-leading financial technology solutions
- 12 years of market experience
- Proprietary trading algorithms with proven success
- Team of 35+ financial and technology experts

## Market Opportunity
- $4.2 billion market for specialized trading solutions
- Growing at 16% CAGR through 2026
- Increased demand for AI-powered trading tools
- Regulatory changes favoring our technology approach

## Our Solution
- Comprehensive trading platform with proprietary algorithms
- White-label solutions for financial institutions
- Enterprise-grade security and compliance features
- Scalable infrastructure with 99.99% uptime

## Investment Highlights
- 42% YoY revenue growth
- 68% gross margins
- $5.7M ARR with 94% retention rate
- Clear path to $25M ARR within 36 months`
    },
    {
      id: 'pricing',
      name: 'Pricing Sheet',
      icon: <Tag size={18} className="text-amber-600" />,
      inputPlaceholder: 'Marketing agency, offering rebranding services...',
      outputExample: `# Rebranding Service Packages

## Essential Refresh

**Investment: $15,000-$25,000**

Perfect for businesses seeking to update their existing brand with a refreshed look and feel while maintaining brand recognition.

### Deliverables
- Brand audit and competitive analysis
- Logo refinement and modernization
- Color palette and typography update
- Basic style guide development
- Essential marketing material updates
- 30 days of implementation support

**Timeline:** 6-8 weeks

## Complete Transformation

**Investment: $35,000-$55,000**

Ideal for businesses requiring a comprehensive rebrand to reflect significant changes in business direction, offerings, or market position.

### Deliverables
- All Essential Refresh deliverables
- In-depth market research and positioning strategy
- Complete visual identity redesign
- Comprehensive messaging platform
- Extended brand guidelines
- Website redesign consultation
- Digital presence strategy
- 3 months of implementation support

**Timeline:** 12-16 weeks`
    },
    {
      id: 'strategy',
      name: 'Strategic Roadmap',
      icon: <FileBarChart size={18} className="text-indigo-600" />,
      inputPlaceholder: 'Retail business, planning digital transformation...',
      outputExample: `# Digital Transformation Roadmap for Retail Excellence

## Phase 1: Assessment & Foundation (Months 1-2)
- Comprehensive digital maturity assessment
- Current-state technology inventory
- Customer journey mapping
- Digital talent assessment
- Preliminary gap analysis
- Quick win identification
- Establishment of digital governance team

## Phase 2: Strategy & Planning (Months 2-4)
- Digital vision and objectives alignment
- Prioritized opportunity roadmap
- Technology architecture blueprint
- Data strategy development
- Digital skills development plan
- Change management strategy
- Budget and resource allocation

## Phase 3: Pilot Implementation (Months 4-7)
- E-commerce platform enhancement
- Mobile app development/optimization
- Customer data platform integration
- Initial AI/ML implementation for product recommendations
- Employee digital skills training initiation
- Metrics framework establishment

## Phase 4: Scaled Deployment (Months 7-12)
- Full omnichannel experience implementation
- Advanced analytics deployment
- Complete digital marketing transformation
- Supply chain digitization
- Digital workplace transformation
- Continuous feedback loops establishment

## Phase 5: Optimization & Innovation (Months 12+)
- Performance analysis and optimization
- Advanced AI implementation
- Innovation lab establishment
- Digital ecosystem expansion
- Continuous improvement framework`
    }
  ];

  // Set active tab content on initial load and tab change
  useEffect(() => {
    const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];
    setActiveTabContent(activeTabData.outputExample);
  }, [activeTab]);
  
  const handleGenerate = () => {
    if (!inputValue.trim()) return;
    
    setGenerating(true);
    
    // Simulate generation delay with progressive content appearance
    const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];
    const finalContent = activeTabData.outputExample;
    const contentLines = finalContent.split('\n');
    
    // Clear existing content first
    setActiveTabContent('');
    
    // Generate content line by line for a more realistic effect
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
    }, 50); // Adjust speed as needed
    
    return () => clearInterval(contentInterval);
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
              {generating || generated ? (
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-xs font-mono text-gray-800 overflow-x-auto">
                    {activeTabContent}
                  </pre>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  <p>Fill in the form and click Generate to see an example</p>
                </div>
              )}
              
              {/* Generation overlay */}
              {generating && (
                <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-blue-700 text-sm">AI is generating content...</p>
                  </div>
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