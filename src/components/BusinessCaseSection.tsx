import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, DollarSign, Target, Award, BarChart2, TrendingUp, MessageSquare, Users, Shield, Database, Zap, Layers, Globe, CheckCircle, Star, Video, FileText, Sparkles, User, ArrowRight, Briefcase, Smartphone, Mail, UserPlus, Link as Line, LineChart, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const BusinessCaseSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState({
    time: 0,
    revenue: 0,
    conversion: 0,
    personalization: 0,
    consistency: 0,
    scaling: 0,
    multichannel: 0,
    datadriven: 0,
    automation: 0,
    trust: 0,
    retention: 0,
    compliance: 0
  });
  
  // Set up animation when the component is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById('business-case-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  // Animate counter values when visible
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCounterValues(prev => ({
          time: prev.time < 85 ? prev.time + 1 : 85,
          revenue: prev.revenue < 40 ? prev.revenue + 1 : 40,
          conversion: prev.conversion < 30 ? prev.conversion + 1 : 30,
          personalization: prev.personalization < 95 ? prev.personalization + 1 : 95,
          consistency: prev.consistency < 89 ? prev.consistency + 1 : 89,
          scaling: prev.scaling < 70 ? prev.scaling + 1 : 70,
          multichannel: prev.multichannel < 65 ? prev.multichannel + 1 : 65,
          datadriven: prev.datadriven < 78 ? prev.datadriven + 1 : 78,
          automation: prev.automation < 92 ? prev.automation + 1 : 92,
          trust: prev.trust < 75 ? prev.trust + 1 : 75,
          retention: prev.retention < 58 ? prev.retention + 1 : 58,
          compliance: prev.compliance < 84 ? prev.compliance + 1 : 84
        }));
      }, 30);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  // Auto-rotate tabs
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveTab(prev => (prev % 12) + 1);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  // Expanded set of benefits
  const benefits = [
    {
      id: 1,
      title: "Save Time & Effort",
      description: "Generate professional referral content in seconds instead of hours. No more staring at a blank screen or awkward messaging.",
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      stats: [
        { label: "Time Saved", value: `${counterValues.time}%`, icon: <Clock size={16} className="text-blue-500 mr-1.5" /> },
        { label: "Average Creation", value: "< 60 seconds", icon: <TrendingUp size={16} className="text-blue-500 mr-1.5" /> }
      ],
      color: "blue"
    },
    {
      id: 2,
      title: "Increase Revenue",
      description: "Convert more referrals with professional, persuasive messaging that resonates with your specific audience.",
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
      stats: [
        { label: "Revenue Increase", value: `${counterValues.revenue}%`, icon: <BarChart2 size={16} className="text-green-500 mr-1.5" /> },
        { label: "ROI", value: "12x", icon: <TrendingUp size={16} className="text-green-500 mr-1.5" /> }
      ],
      color: "green"
    },
    {
      id: 3,
      title: "Higher Conversion Rates",
      description: "Turn more conversations into actual referrals with proven templates and strategies for any situation.",
      icon: <Target className="h-6 w-6 text-purple-600" />,
      stats: [
        { label: "Conversion Rate", value: `${counterValues.conversion}%`, icon: <Target size={16} className="text-purple-500 mr-1.5" /> },
        { label: "Response Rate", value: "4x higher", icon: <TrendingUp size={16} className="text-purple-500 mr-1.5" /> }
      ],
      color: "purple"
    },
    {
      id: 4,
      title: "Personalized Messaging",
      description: "Create highly personalized referral requests that consider the specific relationship and context for maximum effectiveness.",
      icon: <MessageSquare className="h-6 w-6 text-amber-600" />,
      stats: [
        { label: "Personalization", value: `${counterValues.personalization}%`, icon: <CheckCircle size={16} className="text-amber-500 mr-1.5" /> },
        { label: "Engagement Rate", value: "3.2x higher", icon: <TrendingUp size={16} className="text-amber-500 mr-1.5" /> }
      ],
      color: "amber"
    },
    {
      id: 5,
      title: "Consistent Branding",
      description: "Maintain perfect consistency in your referral messaging across all channels while adhering to your brand voice guidelines.",
      icon: <Layers className="h-6 w-6 text-indigo-600" />,
      stats: [
        { label: "Brand Consistency", value: `${counterValues.consistency}%`, icon: <Layers size={16} className="text-indigo-500 mr-1.5" /> },
        { label: "Brand Recognition", value: "2.4x better", icon: <TrendingUp size={16} className="text-indigo-500 mr-1.5" /> }
      ],
      color: "indigo"
    },
    {
      id: 6,
      title: "Multi-Channel Approach",
      description: "Coordinate referral generation across email, SMS, voice, social media, and in-person meetings - all from one platform.",
      icon: <Globe className="h-6 w-6 text-teal-600" />,
      stats: [
        { label: "Channel Coverage", value: `${counterValues.multichannel}%`, icon: <Globe size={16} className="text-teal-500 mr-1.5" /> },
        { label: "Cross-channel Lift", value: "2.7x increase", icon: <TrendingUp size={16} className="text-teal-500 mr-1.5" /> }
      ],
      color: "teal"
    },
    {
      id: 7,
      title: "Data-Driven Optimization",
      description: "Continuously improve your referral strategies with AI-driven insights and analytics that identify what works best.",
      icon: <Database className="h-6 w-6 text-rose-600" />,
      stats: [
        { label: "Improvement Rate", value: `${counterValues.datadriven}%`, icon: <Database size={16} className="text-rose-500 mr-1.5" /> },
        { label: "Optimization Cycles", value: "5x faster", icon: <TrendingUp size={16} className="text-rose-500 mr-1.5" /> }
      ],
      color: "rose"
    },
    {
      id: 8,
      title: "Scalable Referral Programs",
      description: "Easily scale your referral generation from a handful to hundreds or thousands of contacts without additional effort.",
      icon: <Zap className="h-6 w-6 text-orange-600" />,
      stats: [
        { label: "Scaling Capacity", value: `${counterValues.scaling}%`, icon: <Users size={16} className="text-orange-500 mr-1.5" /> },
        { label: "Effort Reduction", value: "80% less", icon: <TrendingUp size={16} className="text-orange-500 mr-1.5" /> }
      ],
      color: "orange"
    },
    {
      id: 9,
      title: "Workflow Automation",
      description: "Automate your entire referral workflow including follow-ups, thank yous, and tracking without manual intervention.",
      icon: <Sparkles className="h-6 w-6 text-sky-600" />,
      stats: [
        { label: "Process Automation", value: `${counterValues.automation}%`, icon: <Sparkles size={16} className="text-sky-500 mr-1.5" /> },
        { label: "Time Savings", value: "22 hours/month", icon: <Clock size={16} className="text-sky-500 mr-1.5" /> }
      ],
      color: "sky"
    },
    {
      id: 10,
      title: "Increased Trust & Credibility",
      description: "Build stronger relationships through professional, well-timed, and appropriate referral requests that build trust.",
      icon: <Shield className="h-6 w-6 text-emerald-600" />,
      stats: [
        { label: "Trust Rating", value: `${counterValues.trust}%`, icon: <Shield size={16} className="text-emerald-500 mr-1.5" /> },
        { label: "Relationship Score", value: "3.5x higher", icon: <Users size={16} className="text-emerald-500 mr-1.5" /> }
      ],
      color: "emerald"
    },
    {
      id: 11,
      title: "Customer Retention",
      description: "Improve client relationships and retention through strategic referral programs that increase engagement and loyalty.",
      icon: <UserPlus className="h-6 w-6 text-fuchsia-600" />,
      stats: [
        { label: "Retention Lift", value: `${counterValues.retention}%`, icon: <UserPlus size={16} className="text-fuchsia-500 mr-1.5" /> },
        { label: "Client Lifetime", value: "2.3x longer", icon: <TrendingUp size={16} className="text-fuchsia-500 mr-1.5" /> }
      ],
      color: "fuchsia"
    },
    {
      id: 12,
      title: "Regulatory Compliance",
      description: "Ensure all referral communications remain compliant with regulations while still being persuasive and effective.",
      icon: <FileText className="h-6 w-6 text-cyan-600" />,
      stats: [
        { label: "Compliance Rate", value: `${counterValues.compliance}%`, icon: <CheckCircle size={16} className="text-cyan-500 mr-1.5" /> },
        { label: "Risk Reduction", value: "90% lower", icon: <Shield size={16} className="text-cyan-500 mr-1.5" /> }
      ],
      color: "cyan"
    }
  ];

  const getActiveTab = () => benefits.find(b => b.id === activeTab) || benefits[0];

  return (
    <section id="business-case-section" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Use AI for Referral Generation?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform delivers measurable business results by transforming how you generate and convert referrals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column - Benefit tabs with visual meter */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <Star size={18} className="text-amber-500 mr-2" />
                  Key Business Benefits
                </h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      activeTab === benefit.id 
                        ? `bg-${benefit.color}-50 border-l-4 border-${benefit.color}-500` 
                        : 'border-l-4 border-transparent hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab(benefit.id)}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg bg-${benefit.color}-100 mr-3`}>
                            {benefit.icon}
                          </div>
                          <div>
                            <h3 className={`font-medium text-gray-900 text-sm ${activeTab === benefit.id ? `text-${benefit.color}-700` : ''}`}>
                              {benefit.title}
                            </h3>
                          </div>
                        </div>
                        
                        {/* Add a small visual indicator of the benefit impact */}
                        <div className="flex items-center">
                          {/* Draw a mini chart bar */}
                          <div className="w-16 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-${benefit.color}-500 rounded-full`} 
                              style={{ 
                                width: counterValues[benefit.id === 1 ? 'time' : 
                                                     benefit.id === 2 ? 'revenue' : 
                                                     benefit.id === 3 ? 'conversion' :
                                                     benefit.id === 4 ? 'personalization' :
                                                     benefit.id === 5 ? 'consistency' :
                                                     benefit.id === 6 ? 'multichannel' :
                                                     benefit.id === 7 ? 'datadriven' :
                                                     benefit.id === 8 ? 'scaling' :
                                                     benefit.id === 9 ? 'automation' :
                                                     benefit.id === 10 ? 'trust' :
                                                     benefit.id === 11 ? 'retention' : 'compliance'] + '%'
                              }}
                            ></div>
                          </div>
                          
                          <ChevronRight size={16} className={`ml-2 text-${benefit.color}-500 transition-transform ${activeTab === benefit.id ? 'rotate-90' : ''}`} />
                        </div>
                      </div>
                      
                      {/* Collapsible description */}
                      <div className={`pl-11 mt-1 overflow-hidden transition-all ${
                        activeTab === benefit.id ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <p className="text-xs text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 hidden lg:block">
              <Link
                to="/app"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300"
              >
                See It In Action
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
          
          {/* Right column - Main benefit highlight with animated infographics */}
          <div className="lg:col-span-3 space-y-6">
            <div 
              className={`bg-white rounded-xl shadow-lg border border-${getActiveTab().color}-100 overflow-hidden transition-all duration-300 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className={`bg-gradient-to-r from-${getActiveTab().color}-500 to-${getActiveTab().color}-600 px-6 py-4`}>
                <h3 className="text-white text-xl font-bold">{getActiveTab().title}</h3>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-6">{getActiveTab().description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {getActiveTab().stats.map((stat, idx) => (
                    <div key={idx} className={`bg-${getActiveTab().color}-50 rounded-lg p-4 border border-${getActiveTab().color}-100`}>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        {stat.icon}
                        {stat.label}
                      </div>
                      <div className={`text-2xl font-bold text-${getActiveTab().color}-600`}>{stat.value}</div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h4 className="text-gray-900 font-medium mb-3 flex items-center">
                    <Award className={`h-5 w-5 text-${getActiveTab().color}-500 mr-2`} />
                    Business Impact
                  </h4>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="grid grid-cols-1 gap-y-6 md:w-1/2">
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex flex-col">
                          <h5 className="font-medium text-gray-700 mb-3">Business Integration</h5>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-blue-50 p-2 rounded">
                              <div className="font-medium text-blue-700">Implementation Time</div>
                              <div className="text-blue-800 mt-1">5-10 minutes</div>
                            </div>
                            <div className="bg-green-50 p-2 rounded">
                              <div className="font-medium text-green-700">Learning Curve</div>
                              <div className="text-green-800 mt-1">Minimal</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex flex-col">
                          <h5 className="font-medium text-gray-700 mb-3">Business Impact</h5>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-amber-50 p-2 rounded">
                              <div className="font-medium text-amber-700">Immediate</div>
                              <div className="text-amber-800 mt-1">Same-day results</div>
                            </div>
                            <div className="bg-purple-50 p-2 rounded">
                              <div className="font-medium text-purple-700">Success Metrics</div>
                              <div className="text-purple-800 mt-1">42% increase</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm md:w-1/2">
                      <h5 className="font-medium text-gray-700 mb-3">Client Success</h5>
                      <div className="flex items-center gap-8 mt-3">
                        <div className="text-center">
                          <div className="inline-block relative">
                            <svg className="w-20 h-20">
                              <circle
                                className="text-gray-200"
                                strokeWidth="5"
                                stroke="currentColor"
                                fill="transparent"
                                r="30"
                                cx="40"
                                cy="40"
                              />
                              <circle
                                className="text-green-500"
                                strokeWidth="5"
                                stroke="currentColor"
                                fill="transparent"
                                r="30"
                                cx="40"
                                cy="40"
                                strokeDasharray="188.5"
                                strokeDashoffset="13.2"
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xl font-bold text-green-700">93%</span>
                            </div>
                          </div>
                          <p className="text-sm font-medium mt-1">Success rate</p>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center">
                            <Users size={16} className="mr-2 text-blue-600" />
                            <span className="text-sm">15,000+ users</span>
                          </div>
                          <div className="flex items-center">
                            <Target size={16} className="mr-2 text-green-600" />
                            <span className="text-sm">Response +65%</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle size={16} className="mr-2 text-purple-600" />
                            <span className="text-sm">Referrals +42%</span>
                          </div>
                          <div className="flex items-center">
                            <Globe size={16} className="mr-2 text-indigo-600" />
                            <span className="text-sm">Reach +3.8x</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessCaseSection;