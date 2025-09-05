import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Phone, UserCheck, MessageSquare, Heart, Smartphone, Calendar, Target } from 'lucide-react';

interface MethodCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  stats: {
    type: string;
    value: string;
  };
  badge?: string;
  appContentType: string;
}

const FeaturedMethodsSection: React.FC = () => {
  const navigate = useNavigate();
  const [visibleCards, setVisibleCards] = useState<string[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => [...prev, entry.target.id]);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const cards = document.querySelectorAll('.method-card');
    cards.forEach(card => observer.observe(card));
    
    return () => observer.disconnect();
  }, []);
  
  const methods: MethodCard[] = [
    {
      id: 'phone-scripts',
      title: 'Phone Call Scripts',
      icon: <Phone size={20} className="text-blue-600" />,
      description: 'Effective scripts for requesting referrals during phone conversations with clients and contacts.',
      stats: {
        type: 'Conversion Rate',
        value: '35%'
      },
      badge: 'Most Popular',
      appContentType: 'Phone Call Scripts'
    },
    {
      id: 'face-to-face',
      title: 'Face-to-Face Meeting Guides',
      icon: <UserCheck size={20} className="text-purple-600" />,
      description: 'Comprehensive guides for requesting referrals during in-person meetings.',
      stats: {
        type: 'Success Rate',
        value: '42%'
      },
      appContentType: 'Face-to-Face Meeting Guides'
    },
    {
      id: 'whatsapp-campaigns',
      title: 'WhatsApp Campaigns',
      icon: <Smartphone size={20} className="text-green-500" />,
      description: '14-day WhatsApp messaging campaigns to systematically generate referrals.',
      stats: {
        type: 'Open Rate',
        value: '98%'
      },
      appContentType: 'WhatsApp Outreach Campaigns'
    },
    {
      id: 'friends-family',
      title: 'Friends & Family Campaign',
      icon: <Heart size={20} className="text-pink-500" />,
      description: 'A 14-day messaging campaign to offer your services to friends and family, asking only for referrals.',
      stats: {
        type: 'Trust Factor',
        value: 'Very High'
      },
      appContentType: 'Friends and Family Campaign'
    },
    {
      id: 'client-events',
      title: 'Client Appreciation Events',
      icon: <Calendar size={20} className="text-amber-500" />,
      description: 'Plan and execute events that strengthen client relationships and generate referrals.',
      stats: {
        type: 'Referral Rate',
        value: '27%'
      },
      appContentType: 'Client Appreciation Events'
    },
    {
      id: 'reward-programs',
      title: 'Referral Reward Programs',
      icon: <Target size={20} className="text-indigo-600" />,
      description: 'Create structured reward programs to incentivize clients and contacts to provide referrals.',
      stats: {
        type: 'Participation',
        value: '45%'
      },
      appContentType: 'Referral Reward Programs'
    }
  ];
  
  const handleCardClick = (method: MethodCard) => {
    navigate('/app', { state: { selectedContentType: method.appContentType } });
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Most Effective Referral Methods</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our highest-converting referral generation techniques and start implementing them today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {methods.map((method, index) => (
            <div 
              id={method.id}
              key={method.id}
              className={`method-card group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-500 transform cursor-pointer ${
                visibleCards.includes(method.id)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => handleCardClick(method)}
            >
              <div className="relative overflow-hidden">
                {method.badge && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-yellow-500 text-white text-xs font-bold px-3 py-1 transform rotate-0 z-10">
                    {method.badge}
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
                      {method.icon}
                    </div>
                    <h3 className="text-lg font-semibold ml-3 text-gray-900 group-hover:text-gray-700">{method.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{method.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">{method.stats.type}</span>
                      <span className="text-sm font-bold text-gray-800">{method.stats.value}</span>
                    </div>
                    <div className="flex items-center text-green-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Try Now
                      <ArrowRight size={14} className="ml-1 group-hover:ml-2 transition-all" />
                    </div>
                  </div>
                </div>
                
                {/* Hover overlay with animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-gray-900/70 flex flex-col justify-center items-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Star size={24} className="text-yellow-400 mb-3 animate-pulse" />
                  <h3 className="text-white font-bold text-lg mb-2">{method.title}</h3>
                  <p className="text-white/80 text-sm text-center mb-4">{method.description}</p>
                  <span className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium inline-flex items-center">
                    Generate Now
                    <ArrowRight size={14} className="ml-1.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/referral-methods" className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Explore All Referral Methods
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMethodsSection;