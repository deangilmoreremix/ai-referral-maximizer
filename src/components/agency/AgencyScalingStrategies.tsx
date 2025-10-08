import React, { useState } from 'react';
import { 
  TrendingUp, BarChart2, Users, DollarSign, FileText, 
  ChevronDown, ChevronUp, ArrowRight, CheckCircle, AlertCircle,
  Clock, Target, UserPlus, Zap, Award, Share2, Briefcase, RefreshCw,
  Building2
} from 'lucide-react';
import { generateContent } from '../../services/openAIService';

interface ScalingStrategy {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  timelines: {
    implementation: string;
    firstResults: string;
  };
  isExpanded: boolean;
  content?: string;
}

interface AgencyMetric {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  icon: React.ReactNode;
}

const AgencyScalingStrategies: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Agency scaling strategies
  const [strategies, setStrategies] = useState<ScalingStrategy[]>([
    {
      id: 'service-expansion',
      title: 'Service Package Expansion',
      description: 'Expand your service offerings beyond basic referral content to include implementation, training, and ongoing management',
      icon: <Briefcase size={20} className="text-blue-600" />,
      benefits: [
        'Increase average client value by 3-5x',
        'Create recurring revenue streams',
        'Reduce client churn through deeper integration',
        'Establish competitive differentiation'
      ],
      timelines: {
        implementation: '1-2 months',
        firstResults: '2-3 months'
      },
      isExpanded: true
    },
    {
      id: 'team-building',
      title: 'Team Building Strategy',
      description: 'Grow from solo operation to agency model with specialized roles for content, client management, and sales',
      icon: <Users size={20} className="text-purple-600" />,
      benefits: [
        'Scale beyond your personal capacity',
        'Specialize roles for greater efficiency',
        'Maintain quality while increasing volume',
        'Develop consistent, repeatable processes'
      ],
      timelines: {
        implementation: '3-6 months',
        firstResults: '1-3 months'
      },
      isExpanded: false
    },
    {
      id: 'white-label-services',
      title: 'White-Label Services',
      description: 'Offer your AI referral services to other agencies and consultants under their own branding',
      icon: <Share2 size={20} className="text-green-600" />,
      benefits: [
        'Access new market segments through partners',
        'Increase volume without direct marketing costs',
        'Create strategic partnerships',
        'Build industry credibility'
      ],
      timelines: {
        implementation: '2-3 months',
        firstResults: '3-6 months'
      },
      isExpanded: false
    },
    {
      id: 'premium-pricing',
      title: 'Premium Pricing Strategy',
      description: 'Develop a premium service tier with high-touch, done-for-you implementation and advanced features',
      icon: <Award size={20} className="text-amber-600" />,
      benefits: [
        'Increase profit margins substantially',
        'Attract higher-value clients',
        'Create clear differentiation from competitors',
        'Reduce client price sensitivity'
      ],
      timelines: {
        implementation: '1 month',
        firstResults: '1-2 months'
      },
      isExpanded: false
    },
    {
      id: 'strategic-partnerships',
      title: 'Strategic Partnerships',
      description: 'Form alliances with complementary service providers to create referral networks and bundled offerings',
      icon: <UserPlus size={20} className="text-indigo-600" />,
      benefits: [
        'Access established customer bases',
        'Share marketing and acquisition costs',
        'Create more comprehensive solutions',
        'Build credibility through association'
      ],
      timelines: {
        implementation: '2-4 months',
        firstResults: '3-6 months'
      },
      isExpanded: false
    }
  ]);

  // Agency metrics for growth tracking
  const [metrics, setMetrics] = useState<AgencyMetric[]>([
    {
      id: 'monthly-revenue',
      name: 'Monthly Revenue',
      currentValue: 5000,
      targetValue: 20000,
      unit: '$',
      icon: <DollarSign size={16} className="text-green-600" />
    },
    {
      id: 'active-clients',
      name: 'Active Clients',
      currentValue: 8,
      targetValue: 25,
      unit: '',
      icon: <Users size={16} className="text-blue-600" />
    },
    {
      id: 'team-members',
      name: 'Team Members',
      currentValue: 1,
      targetValue: 5,
      unit: '',
      icon: <Users size={16} className="text-purple-600" />
    },
    {
      id: 'project-value',
      name: 'Avg. Project Value',
      currentValue: 625,
      targetValue: 2500,
      unit: '$',
      icon: <BarChart2 size={16} className="text-amber-600" />
    }
  ]);

  // Toggle strategy expansion
  const toggleStrategyExpansion = (id: string) => {
    setStrategies(strategies.map(strategy => 
      strategy.id === id 
        ? { ...strategy, isExpanded: !strategy.isExpanded }
        : strategy
    ));
    
    if (selectedStrategy !== id) {
      setSelectedStrategy(id);
    }
  };

  // Generate strategy content
  const generateStrategyContent = async (strategy: ScalingStrategy) => {
    setIsGenerating(true);
    setErrorMessage(null);
    
    try {
      // Build the prompt
      const prompt = `
Create a detailed implementation plan for the following agency scaling strategy:

Strategy: ${strategy.title}
Description: ${strategy.description}

Benefits:
${strategy.benefits.map(benefit => `- ${benefit}`).join('\n')}

This is for an AI referral generation agency looking to scale their business. Please provide:

1. A step-by-step implementation guide
2. Timeline with milestones
3. Key metrics to track
4. Common challenges and solutions
5. Required resources and investments
6. Examples of successful implementation

Format the response with clear headings, actionable steps, and practical advice that can be implemented immediately.
      `;
      
      // Generate content
      const content = await generateContent({
        contentType: "Agency Scaling Strategy",
        specialRequirements: prompt
      });
      
      // Update strategy with generated content
      setStrategies(strategies.map(s => 
        s.id === strategy.id 
          ? { ...s, content }
          : s
      ));
      
      setGeneratedContent(content);
      
    } catch (error) {
      console.error("Error generating strategy content:", error);
      setErrorMessage("Failed to generate strategy content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Calculate progress percentage
  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <div className="bg-white rounded-xl border border-indigo-200 p-6">
      <div className="flex items-center mb-5">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Agency Scaling Strategies</h3>
          <p className="text-sm text-gray-500">Grow your AI referral agency with proven scaling models</p>
        </div>
      </div>
      
      {/* Growth metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {metrics.map(metric => (
          <div key={metric.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-800 flex items-center">
                {metric.icon}
                <span className="ml-1.5">{metric.name}</span>
              </h4>
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                Goal: {metric.unit}{metric.targetValue.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-gray-900">
                {metric.unit}{metric.currentValue.toLocaleString()}
              </span>
              <span className="text-green-600 text-xs">
                {calculateProgress(metric.currentValue, metric.targetValue)}%
              </span>
            </div>
            
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full" 
                style={{ width: `${calculateProgress(metric.currentValue, metric.targetValue)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Scaling Strategies */}
      <div className="space-y-4 mb-6">
        <h4 className="text-base font-medium text-gray-800 mb-2">Choose a Scaling Strategy</h4>
        
        {strategies.map(strategy => (
          <div key={strategy.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Strategy Header */}
            <div 
              className={`flex justify-between items-center p-4 cursor-pointer ${
                strategy.isExpanded ? 'bg-indigo-50 border-b border-indigo-100' : 'bg-white'
              }`}
              onClick={() => toggleStrategyExpansion(strategy.id)}
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${
                  strategy.id === selectedStrategy ? 'bg-indigo-100' : 'bg-gray-100'
                }`}>
                  {strategy.icon}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">{strategy.title}</h3>
                  <p className="text-sm text-gray-500">{strategy.description}</p>
                </div>
              </div>
              <div>
                {strategy.isExpanded ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </div>
            </div>
            
            {/* Expanded Content */}
            {strategy.isExpanded && (
              <div className="bg-white p-4">
                {/* Benefits and Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Benefits */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">Key Benefits</h4>
                    <ul className="space-y-1">
                      {strategy.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle size={14} className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Timeline */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">Implementation Timeline</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Clock size={14} className="text-indigo-600 mr-2" />
                        <span className="text-sm text-gray-700 font-medium w-36">Implementation:</span>
                        <span className="text-sm text-gray-600">{strategy.timelines.implementation}</span>
                      </div>
                      <div className="flex items-center">
                        <Target size={14} className="text-green-600 mr-2" />
                        <span className="text-sm text-gray-700 font-medium w-36">First Results:</span>
                        <span className="text-sm text-gray-600">{strategy.timelines.firstResults}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Generated Content or Generate Button */}
                {strategy.content ? (
                  <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-white">
                    <h4 className="font-medium text-gray-800 mb-3">Implementation Plan</h4>
                    <div className="prose prose-sm max-w-none">
                      {strategy.content.split('\n').map((paragraph, i) => {
                        // Handle markdown-like formatting
                        if (paragraph.startsWith('# ')) {
                          return <h2 key={i} className="text-xl font-bold mb-3 text-indigo-900">{paragraph.substring(2)}</h2>;
                        } else if (paragraph.startsWith('## ')) {
                          return <h3 key={i} className="text-lg font-semibold mb-2 mt-4 text-indigo-800">{paragraph.substring(3)}</h3>;
                        } else if (paragraph.startsWith('### ')) {
                          return <h4 key={i} className="text-base font-medium mb-1 mt-3 text-indigo-700">{paragraph.substring(4)}</h4>;
                        } else if (paragraph.startsWith('- ')) {
                          return <li key={i} className="ml-4 text-gray-700">{paragraph.substring(2)}</li>;
                        } else if (paragraph === '') {
                          return <br key={i} />;
                        } else {
                          return <p key={i} className="mb-2 text-gray-600">{paragraph}</p>;
                        }
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => generateStrategyContent(strategy)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center space-x-2 shadow-sm"
                      disabled={isGenerating}
                    >
                      {isGenerating && strategy.id === selectedStrategy ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-1.5" />
                          <span>Generate Implementation Plan</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Growth Resources */}
      <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-100 mt-8">
        <h4 className="font-medium text-indigo-900 mb-3 flex items-center">
          <Building2 size={18} className="mr-2 text-indigo-600" />
          Agency Growth Resources
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-indigo-200 shadow-sm">
            <h5 className="font-medium text-indigo-800 mb-2">Pricing Strategy Guide</h5>
            <p className="text-sm text-gray-600 mb-3">Learn how to structure premium pricing tiers for your agency services.</p>
            <a href="#" className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center">
              Download Guide
              <ArrowRight size={12} className="ml-1" />
            </a>
          </div>
          <div className="bg-white p-4 rounded-lg border border-indigo-200 shadow-sm">
            <h5 className="font-medium text-indigo-800 mb-2">Team Structure Templates</h5>
            <p className="text-sm text-gray-600 mb-3">Role descriptions, hiring guides, and team organization templates.</p>
            <a href="#" className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center">
              View Templates
              <ArrowRight size={12} className="ml-1" />
            </a>
          </div>
          <div className="bg-white p-4 rounded-lg border border-indigo-200 shadow-sm">
            <h5 className="font-medium text-indigo-800 mb-2">Partnership Agreement</h5>
            <p className="text-sm text-gray-600 mb-3">Legal templates for establishing strategic partnerships and referral agreements.</p>
            <a href="#" className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center">
              Download Template
              <ArrowRight size={12} className="ml-1" />
            </a>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-200 shadow-sm">
          <div className="flex items-center">
            <AlertCircle size={16} className="text-indigo-600 mr-2" />
            <p className="text-sm text-indigo-800">
              <span className="font-medium">Pro Tip:</span> Begin with one scaling strategy and master it before adding additional strategies. Most successful agencies focus on service expansion first, then team building.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyScalingStrategies;