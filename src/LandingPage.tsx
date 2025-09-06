import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, UserPlus, Sparkles, BarChart2, Clock, Zap, ChevronRight, Brain, Users, Target, Award, MessageSquare, CheckCircle, Shield, AlertCircle } from 'lucide-react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import InteractiveDemo from './components/InteractiveDemo';
import WorkflowTimeline from './components/WorkflowTimeline';
import TestimonialCarousel from './components/TestimonialCarousel';
import ComparisonSlider from './components/ComparisonSlider';
import StatisticsCounter from './components/StatisticsCounter';
import PricingSection from './components/PricingSection';
import SolutionsSection from './components/SolutionsSection';
import AnimatedHero from './components/AnimatedHero';
import BusinessCaseSection from './components/BusinessCaseSection';
import FeaturedMethodsSection from './components/FeaturedMethodsSection';

const LandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-animate]');
      
      sections.forEach((section) => {
        const sectionId = section.getAttribute('id');
        if (!sectionId) return;
        
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        // If section is in viewport
        if (sectionTop < windowHeight * 0.75) {
          setIsVisible(prev => ({ ...prev, [sectionId]: true }));
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initially
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const stats = [
    {
      id: 'contentTypes',
      value: 25,
      label: 'Referral Methods',
      suffix: '+',
      color: 'blue',
    },
    {
      id: 'timeReduction',
      value: 70,
      label: 'Time Saved',
      suffix: '%',
      color: 'green',
    },
    {
      id: 'users',
      value: 500,
      label: 'Active Users',
      suffix: '+',
      color: 'purple',
    },
    {
      id: 'satisfaction',
      value: 95,
      label: 'Satisfaction Rate',
      suffix: '%',
      color: 'amber',
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Header */}
      <Nav current="landing" />
      
      {/* Enhanced Hero Section with Animation */}
      <AnimatedHero />
      
      {/* Statistics counter */}
      <section className="py-12 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <StatisticsCounter stats={stats} startOnScroll={true} />
        </div>
      </section>
      
      {/* Business Case Section */}
      <BusinessCaseSection />
      
      {/* Featured Methods */}
      <FeaturedMethodsSection />
      
      {/* How it works */}
      <section id="how-it-works" data-animate className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4 inline-block">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Generate professional referral content in 4 simple steps. Our AI does the hard work so you can focus on growing your business.
            </p>
          </div>
          
          <WorkflowTimeline />
        </div>
      </section>
      
      {/* Solutions for every business need */}
      <SolutionsSection />
      
      {/* Interactive Demo */}
      <section id="interactive-demo" data-animate className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible['interactive-demo'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mb-4 inline-block">Try it Yourself</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">See It In Action</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how easily you can generate professional referral content for your business with our interactive demo.
            </p>
          </div>
          
          <div className={`transition-all duration-1000 transform ${isVisible['interactive-demo'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <InteractiveDemo />
          </div>
        </div>
      </section>
      
      {/* Before and After comparison */}
      <section id="comparison" data-animate className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible['comparison'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full mb-4 inline-block">See the Difference</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Before & After</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See the difference AI makes in creating professional, persuasive referral content that gets results.
            </p>
          </div>
          
          <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 transition-all duration-1000 transform ${isVisible['comparison'] ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}>
            <ComparisonSlider 
              beforeImage="https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?auto=format&fit=crop&w=800&q=80"
              afterImage="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=800&q=80"
              beforeLabel="Generic Referral Request"
              afterLabel="AI-Generated Content"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-5 transition-all duration-700 transform ${isVisible['comparison'] ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`} style={{transitionDelay: '200ms'}}>
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <MessageSquare size={18} className="text-blue-600" />
                </div>
                <h3 className="ml-3 font-semibold text-gray-900">Natural Communication</h3>
              </div>
              <p className="text-gray-600 text-sm">AI-generated content sounds natural and conversational, not robotic or salesy, leading to better response rates.</p>
            </div>
            
            <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-5 transition-all duration-700 transform ${isVisible['comparison'] ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`} style={{transitionDelay: '400ms'}}>
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-full bg-green-100">
                  <Target size={18} className="text-green-600" />
                </div>
                <h3 className="ml-3 font-semibold text-gray-900">Industry-Specific</h3>
              </div>
              <p className="text-gray-600 text-sm">Content is tailored to your specific industry with relevant terminology, examples, and approaches that resonate with your audience.</p>
            </div>
            
            <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-5 transition-all duration-700 transform ${isVisible['comparison'] ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`} style={{transitionDelay: '600ms'}}>
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-full bg-purple-100">
                  <Award size={18} className="text-purple-600" />
                </div>
                <h3 className="ml-3 font-semibold text-gray-900">Professionally Crafted</h3>
              </div>
              <p className="text-gray-600 text-sm">Every template follows best practices in persuasive communication and referral psychology for maximum effectiveness.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="testimonials" data-animate className="py-20 px-4 bg-gray-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 -z-10 opacity-5">
          <div className="w-96 h-96 rounded-full bg-blue-500 animate-pulse"></div>
        </div>
        <div className="absolute bottom-0 left-0 -z-10 opacity-5">
          <div className="w-80 h-80 rounded-full bg-green-500 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible['testimonials'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full mb-4 inline-block">Success Stories</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">From Our Customers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how businesses like yours are generating more referrals with our AI-powered platform.
            </p>
          </div>

          <div className={`transition-all duration-1000 transform ${isVisible['testimonials'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <TestimonialCarousel />
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section id="features" data-animate className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full mb-4 inline-block">Powerful Platform</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to generate effective referrals for your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-500 border border-gray-200 p-6 transform ${isVisible['features'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '200ms'}}>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Content</h3>
              <p className="text-gray-600">
                Our advanced AI generates personalized, professional referral content tailored to your specific business needs.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">50+ referral templates & methods</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Industry-specific terminology</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Customizable for your brand voice</span>
                </li>
              </ul>
            </div>
            
            <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-500 border border-gray-200 p-6 transform ${isVisible['features'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '400ms'}}>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Deep Personalization</h3>
              <p className="text-gray-600">
                Tailor content to your specific business context with our powerful personalization tools.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Document analysis technology</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">LinkedIn profile integration</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Custom industry & audience settings</span>
                </li>
              </ul>
            </div>
            
            <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-500 border border-gray-200 p-6 transform ${isVisible['features'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '600ms'}}>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-Channel Support</h3>
              <p className="text-gray-600">
                Generate referral content for all your communication channels in one platform.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Face-to-face meeting scripts</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Phone & voice drop templates</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">WhatsApp & SMS campaigns</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/app" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Explore All Features
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" data-animate className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible['pricing'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="bg-rose-100 text-rose-800 text-sm font-medium px-3 py-1 rounded-full mb-4 inline-block">Pricing Plans</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your referral generation needs. All plans include access to our AI-powered platform.
            </p>
          </div>
          
          <div className={`transition-all duration-1000 transform ${isVisible['pricing'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <PricingSection />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to maximize your referrals?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Join thousands of professionals using AI to generate more referrals with less effort. 
            Get started free today.
          </p>
          <Link
            to="/app"
            className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-green-700 rounded-lg text-lg font-medium shadow-xl hover:shadow-2xl transition-all"
          >
            Start Generating Referrals
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default LandingPage;