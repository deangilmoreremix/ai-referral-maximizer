import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, UserPlus, FileText, MessageSquare, Users, Sparkles, Star, Phone, Heart, AlignLeft, Calendar, Mail, Bell } from 'lucide-react';

const AnimatedHero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showCard1, setShowCard1] = useState(false);
  const [showCard2, setShowCard2] = useState(false);
  const [showCard3, setShowCard3] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const timer1 = setTimeout(() => setShowCard1(true), 400);
    const timer2 = setTimeout(() => setShowCard2(true), 800);
    const timer3 = setTimeout(() => setShowCard3(true), 1200);
    const timer4 = setTimeout(() => setTypingComplete(true), 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <section className="bg-gradient-to-br from-white to-gray-100 pt-20 pb-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        {/* Animated background elements */}
        <div className="absolute top-10 right-20 -z-10 opacity-20">
          <div className="w-64 h-64 rounded-full bg-green-300 animate-pulse" style={{ animationDuration: '4s' }}></div>
        </div>
        <div className="absolute bottom-10 left-20 -z-10 opacity-20">
          <div className="w-40 h-40 rounded-full bg-blue-300 animate-pulse" style={{ animationDuration: '6s' }}></div>
        </div>
        <div className="absolute top-40 left-0 -z-10 opacity-10">
          <div className="w-32 h-32 rounded-full bg-purple-300 animate-pulse" style={{ animationDuration: '5s' }}></div>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text content - takes 5/12 columns on medium+ screens */}
          <div className={`md:col-span-5 space-y-8 transition-all duration-1000 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Generate <span className="text-green-600 relative inline-block">
                Referrals
                <span className="absolute -bottom-2 left-0 right-0 h-2 bg-green-200 -z-10 transform -rotate-1"></span>
              </span> with AI-Powered Content
            </h1>
            
            <p className="text-xl text-gray-600 max-w-lg">
              Create professional referral scripts, strategies, and campaigns in seconds with our AI generator. No more writer's block or awkward requests.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/app"
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
              >
                Get Started Free
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              
              <Link
                to="/referral-methods"
                className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-800 rounded-lg text-lg font-medium border border-gray-300 hover:border-gray-400 transition-all flex items-center justify-center"
              >
                Browse Referral Methods
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 text-gray-600">
              <div className="flex items-center">
                <Check size={20} className={`text-green-500 mr-2 ${isLoaded ? 'animate-bounce' : ''}`} style={{ animationDuration: '1s', animationDelay: '0.5s', animationIterationCount: '2' }} />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <Check size={20} className={`text-green-500 mr-2 ${isLoaded ? 'animate-bounce' : ''}`} style={{ animationDuration: '1s', animationDelay: '0.7s', animationIterationCount: '2' }} />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center">
                <Check size={20} className={`text-green-500 mr-2 ${isLoaded ? 'animate-bounce' : ''}`} style={{ animationDuration: '1s', animationDelay: '0.9s', animationIterationCount: '2' }} />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
          
          {/* Animation side - takes 7/12 columns on medium+ screens */}
          <div className="md:col-span-7 relative">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Main example card - spans 3 columns */}
              <div className="md:col-span-3 md:row-span-2">
                <div 
                  className={`bg-white p-6 rounded-2xl shadow-2xl transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} hover:-translate-y-2`}
                >
                  <div className="mb-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <UserPlus className="h-6 w-6 text-green-600" />
                      <h3 className="ml-2 text-lg font-semibold">AI Referral Generator</h3>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Preview</span>
                  </div>
                  
                  <div className="space-y-4 mb-4">
                    <div className={`bg-gray-50 rounded-lg p-4 border border-gray-100 transition-all duration-500 ${showCard1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Phone Call Script</h4>
                      <p className="text-sm text-gray-600 italic">
                        "Hi [Name], it's [Your Name]. I've been thinking about how I might expand my business, and I immediately thought of you. I've really enjoyed working with clients like you, and I was wondering if you know anyone who might benefit from the [service/solution] I provide...
                      </p>
                    </div>
                    
                    <div className={`bg-green-50 rounded-lg p-4 border border-green-100 transition-all duration-500 ${showCard2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                      <h4 className="text-sm font-medium text-green-700 mb-2">WhatsApp Message Template</h4>
                      <p className="text-sm text-green-600 italic">
                        "Hey [Name]! 👋 Hope you're doing well! I'm reaching out because I'm focusing on growing my business through referrals this month. I'm not looking to sell you anything - just wondering if you might know anyone who could benefit from [service]? Would love your help! 🙏"
                      </p>
                    </div>
                    
                    <div className={`bg-blue-50 rounded-lg p-4 border border-blue-100 transition-all duration-500 ${showCard3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                      <h4 className="text-sm font-medium text-blue-700 mb-2">Email Follow-up Template</h4>
                      <p className="text-sm text-blue-600 italic">
                        "Hi [Name], I wanted to follow up on our conversation about potential referrals. As I mentioned, I'm focused on helping [target audience] with [specific problem]. If you know anyone who might benefit from this service, I'd be grateful for an introduction. I've attached a brief overview that you can share. Thanks!"
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Generated in 22 seconds</span>
                    <button className={`text-green-600 hover:text-green-700 text-sm font-medium flex items-center transition-all ${typingComplete ? 'opacity-100' : 'opacity-0'}`}>
                      Export PDF
                      <ArrowRight size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Side smaller cards */}
              <div className="hidden md:block md:col-span-2">
                {/* Top side card */}
                <div className={`bg-white p-4 rounded-xl shadow-lg border border-gray-200 transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} hover:-translate-y-1`} style={{transitionDelay: '300ms'}}>
                  <div className="flex items-center mb-2">
                    <Heart className="h-5 w-5 text-pink-500 mr-2" />
                    <h3 className="font-medium text-gray-900">Friends & Family</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    14-day outreach campaign for your personal network
                  </p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-green-600 font-medium">94% trust factor</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">14-day plan</span>
                  </div>
                </div>

                {/* Bottom side card */}
                <div className={`bg-white p-4 rounded-xl shadow-lg border border-gray-200 mt-4 transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} hover:-translate-y-1`} style={{transitionDelay: '500ms'}}>
                  <div className="flex items-center mb-2">
                    <Phone className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-medium text-gray-900">Phone Scripts</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Professional scripts for referral calls
                  </p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-blue-600 font-medium">35% conversion rate</span>
                    <Star className="h-3 w-3 text-yellow-500" />
                  </div>
                </div>
              </div>

              {/* Bottom row cards */}
              <div className="hidden md:block md:col-span-2">
                <div className={`bg-white p-4 rounded-xl shadow-lg border border-gray-200 transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} hover:-translate-y-1`} style={{transitionDelay: '700ms'}}>
                  <div className="flex items-center mb-2">
                    <AlignLeft className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="font-medium text-gray-900">Face-to-Face</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    In-person referral conversation guides
                  </p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-purple-600 font-medium">42% success rate</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Top method</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:block md:col-span-3">
                <div className={`bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl shadow-lg border border-blue-100 transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} hover:-translate-y-1`} style={{transitionDelay: '900ms'}}>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <MessageSquare className="h-5 w-5 text-green-500" />
                    <Calendar className="h-5 w-5 text-purple-500" />
                    <Bell className="h-5 w-5 text-amber-500" />
                    <span className="text-xs font-medium text-gray-700">50+ referral methods available</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 -z-10 bg-gradient-to-tl from-green-200 to-blue-200 w-full h-full rounded-2xl animate-pulse" style={{ animationDuration: '3s' }}></div>
              <div className="absolute -top-6 -left-6 -z-10 bg-gradient-to-br from-purple-200 to-pink-200 w-full h-full rounded-2xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
              
              {/* Floating elements - increased number and varied positions */}
              <div className="absolute -top-10 right-10 transform rotate-12 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="bg-white p-2 rounded-lg shadow-lg">
                  <Sparkles size={20} className="text-yellow-500" />
                </div>
              </div>
              <div className="absolute -bottom-8 left-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                <div className="bg-white p-2 rounded-lg shadow-lg">
                  <MessageSquare size={20} className="text-blue-500" />
                </div>
              </div>
              <div className="absolute top-1/2 -right-12 animate-bounce" style={{ animationDuration: '5s', animationDelay: '0.5s' }}>
                <div className="bg-white p-2 rounded-lg shadow-lg">
                  <FileText size={20} className="text-green-500" />
                </div>
              </div>
              <div className="absolute top-1/3 left-1/4 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.7s' }}>
                <div className="bg-white p-2 rounded-lg shadow-lg">
                  <Star size={20} className="text-amber-500" />
                </div>
              </div>
              <div className="absolute bottom-1/4 right-1/3 animate-bounce" style={{ animationDuration: '4.2s', animationDelay: '1.3s' }}>
                <div className="bg-white p-2 rounded-lg shadow-lg">
                  <Heart size={20} className="text-pink-500" />
                </div>
              </div>
            </div>

            {/* Mobile view small cards */}
            <div className="grid grid-cols-2 gap-3 mt-4 md:hidden">
              <div className={`bg-white p-3 rounded-lg shadow border border-gray-200 transition-all duration-500 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '300ms'}}>
                <div className="flex items-center mb-1">
                  <Heart size={16} className="text-pink-500 mr-1.5" />
                  <h3 className="text-sm font-medium">Friends & Family</h3>
                </div>
                <p className="text-xs text-gray-600">14-day campaign</p>
              </div>
              
              <div className={`bg-white p-3 rounded-lg shadow border border-gray-200 transition-all duration-500 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '400ms'}}>
                <div className="flex items-center mb-1">
                  <Phone size={16} className="text-blue-500 mr-1.5" />
                  <h3 className="text-sm font-medium">Phone Scripts</h3>
                </div>
                <p className="text-xs text-gray-600">35% conversion</p>
              </div>
              
              <div className={`bg-white p-3 rounded-lg shadow border border-gray-200 transition-all duration-500 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '500ms'}}>
                <div className="flex items-center mb-1">
                  <MessageSquare size={16} className="text-green-500 mr-1.5" />
                  <h3 className="text-sm font-medium">WhatsApp</h3>
                </div>
                <p className="text-xs text-gray-600">98% open rate</p>
              </div>
              
              <div className={`bg-white p-3 rounded-lg shadow border border-gray-200 transition-all duration-500 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '600ms'}}>
                <div className="flex items-center mb-1">
                  <Users size={16} className="text-purple-500 mr-1.5" />
                  <h3 className="text-sm font-medium">Meetings</h3>
                </div>
                <p className="text-xs text-gray-600">42% success rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedHero;