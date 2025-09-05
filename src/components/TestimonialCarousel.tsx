import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, ArrowUp, Building, Briefcase, MapPin, Calendar, Gift, Award, CheckCircle, Clock, BarChart2, Shield, Timer, UserPlus, DollarSign, Mail, Users } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  industry: string;
  avatar: string;
  quote: string;
  timeReduction: number;
  qualityImprovement: number;
  rating: number;
  verified?: boolean;
  joinedDate?: string;
  location?: string;
  additionalMetrics?: {
    label: string;
    value: string;
    icon: React.ReactNode;
  }[];
}

const TestimonialCarousel: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechNova Solutions",
      industry: "Technology",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      quote: "The AI Sales Maximizer transformed our marketing output. We created an entire rebrand campaign in days instead of weeks. The quality of content was exceptional and required minimal editing. We've seen a 42% increase in proposal win rate since implementation.",
      timeReduction: 70,
      qualityImprovement: 2.4,
      rating: 5,
      verified: true,
      joinedDate: "March 2023",
      location: "San Francisco, CA",
      additionalMetrics: [
        {
          label: "Client Capacity",
          value: "+40%",
          icon: <Users size={14} className="text-green-500" />
        },
        {
          label: "Revenue Growth",
          value: "$180K",
          icon: <DollarSign size={14} className="text-green-500" />
        }
      ]
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "CEO",
      company: "Horizon Health",
      industry: "Healthcare",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      quote: "As a healthcare company, we needed content that was both compliant and compelling. This platform delivered on both fronts. The personalization features helped tailor content to our specific regulatory environment. Our marketing team is now 3x more productive, and our compliance approvals are faster.",
      timeReduction: 65,
      qualityImprovement: 1.8,
      rating: 4,
      verified: true,
      joinedDate: "May 2023",
      location: "Boston, MA",
      additionalMetrics: [
        {
          label: "Compliance Approval",
          value: "-40% time",
          icon: <Shield size={14} className="text-green-500" />
        },
        {
          label: "Marketing Output",
          value: "3x increase",
          icon: <BarChart2 size={14} className="text-green-500" />
        }
      ]
    },
    {
      id: 3,
      name: "Alicia Rodriguez",
      role: "Brand Strategist",
      company: "Spark Creative Agency",
      industry: "Marketing Agency",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80",
      quote: "Our agency has been able to take on 40% more clients without increasing staff. The platform's ability to generate comprehensive content packages across multiple formats is game-changing for our rebranding projects. We've turned AI Sales Maximizer into a revenue driver by offering premium content packages to clients.",
      timeReduction: 80,
      qualityImprovement: 3.2,
      rating: 5,
      verified: true,
      joinedDate: "January 2023",
      location: "Chicago, IL",
      additionalMetrics: [
        {
          label: "New Service Revenue",
          value: "$15K/mo",
          icon: <DollarSign size={14} className="text-green-500" />
        },
        {
          label: "Time to Delivery",
          value: "-75%",
          icon: <Clock size={14} className="text-green-500" />
        }
      ]
    },
    {
      id: 4,
      name: "David Wilson",
      role: "Sales Director",
      company: "Pinnacle Financial",
      industry: "Financial Services",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80",
      quote: "The sales presentation decks this tool creates are remarkable. They've helped us close 28% more deals since implementation. The AI understands financial language and creates content that resonates with our high-net-worth clients. Within 3 months, we've generated over $450K in new business directly attributable to these improved presentations.",
      timeReduction: 60,
      qualityImprovement: 2.1,
      rating: 5,
      verified: true,
      joinedDate: "April 2023",
      location: "New York, NY",
      additionalMetrics: [
        {
          label: "Sales Cycle",
          value: "-35% time",
          icon: <Timer size={14} className="text-green-500" />
        },
        {
          label: "Proposal Wins",
          value: "+28%",
          icon: <CheckCircle size={14} className="text-green-500" />
        }
      ]
    },
    {
      id: 5,
      name: "Emma Thompson",
      role: "Content Manager",
      company: "EduLearn Systems",
      industry: "Education",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=150&h=150&q=80",
      quote: "We've used this platform to create educational content that engages students while maintaining academic standards. The email sequences have improved our student onboarding process significantly. Our email open rates increased from 22% to 37%, and our program enrollment is up 18% year-over-year since implementation.",
      timeReduction: 55,
      qualityImprovement: 1.9,
      rating: 4,
      verified: true,
      joinedDate: "June 2023",
      location: "Austin, TX",
      additionalMetrics: [
        {
          label: "Email Open Rates",
          value: "+15%",
          icon: <Mail size={14} className="text-green-500" />
        },
        {
          label: "Enrollment",
          value: "+18%",
          icon: <UserPlus size={14} className="text-green-500" />
        }
      ]
    },
    {
      id: 6,
      name: "James Peterson",
      role: "Founder & CEO",
      company: "GreenLife Organics",
      industry: "Food & Beverage",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&h=150&q=80",
      quote: "The referral generation tools helped us completely revamp how we get new wholesale customers. The face-to-face meeting guides transformed our sales team's approach. We now have a structured system for asking existing customers for referrals that feels natural and gets results. Our referral rate jumped from 5% to 32% in less than two months.",
      timeReduction: 75,
      qualityImprovement: 2.8,
      rating: 5,
      verified: true,
      joinedDate: "July 2023",
      location: "Portland, OR",
      additionalMetrics: [
        {
          label: "Referral Rate",
          value: "+27%",
          icon: <UserPlus size={14} className="text-green-500" />
        },
        {
          label: "Customer Lifetime Value",
          value: "+45%",
          icon: <Users size={14} className="text-green-500" />
        }
      ]
    },
    {
      id: 7,
      name: "Jennifer Lee",
      role: "Principal Broker",
      company: "Premier Properties",
      industry: "Real Estate",
      avatar: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=150&h=150&q=80",
      quote: "The WhatsApp campaign templates revolutionized how our agents follow up with past clients. Instead of generic check-ins, we're now sending personalized messages that naturally lead to referral conversations. In our industry, it's all about relationships, and this tool has made our communication both more efficient and more effective. Our agent referrals are up 62%.",
      timeReduction: 68,
      qualityImprovement: 2.6,
      rating: 5,
      verified: true,
      joinedDate: "August 2023",
      location: "Miami, FL",
      additionalMetrics: [
        {
          label: "Agent Productivity",
          value: "+42%",
          icon: <Clock size={14} className="text-green-500" />
        },
        {
          label: "Referral Listings",
          value: "+62%",
          icon: <Building size={14} className="text-green-500" />
        }
      ]
    },
    {
      id: 8,
      name: "Robert Martinez",
      role: "Senior Consultant",
      company: "DigitalEdge Consulting",
      industry: "IT Consulting",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
      quote: "As a consultant, referrals are my lifeblood, but asking for them always felt awkward. The scripts and templates from this platform completely changed that dynamic. I particularly love the Phone Call Scripts and LinkedIn Group Engagement methods. My consulting practice is now 85% referral-based, up from about 40% before using this system.",
      timeReduction: 72,
      qualityImprovement: 2.5,
      rating: 5,
      verified: true,
      joinedDate: "September 2023",
      location: "Seattle, WA",
      additionalMetrics: [
        {
          label: "Referral Business",
          value: "85% of revenue",
          icon: <DollarSign size={14} className="text-green-500" />
        },
        {
          label: "Client Acquisition Cost",
          value: "-65%",
          icon: <BarChart2 size={14} className="text-green-500" />
        }
      ]
    },
    {
      id: 9,
      name: "Lisa Washington",
      role: "Head of Growth",
      company: "CloudSync Solutions",
      industry: "SaaS",
      avatar: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=150&h=150&q=80",
      quote: "Implementing the Referral Reward Programs generated through this platform helped us scale our customer acquisition strategy. The AI-generated materials explained the program clearly and persuasively to our existing customers. We've seen a 217% increase in customer referrals with minimal additional costs to our marketing budget. This has become our highest ROI channel.",
      timeReduction: 63,
      qualityImprovement: 2.2,
      rating: 4,
      verified: true,
      joinedDate: "October 2023",
      location: "Denver, CO",
      additionalMetrics: [
        {
          label: "Referral Increase",
          value: "+217%",
          icon: <ArrowUp size={14} className="text-green-500" />
        },
        {
          label: "Marketing ROI",
          value: "840%",
          icon: <BarChart2 size={14} className="text-green-500" />
        }
      ]
    },
    {
      id: 10,
      name: "Andrew Parker",
      role: "Managing Director",
      company: "Parker Consulting",
      industry: "Management Consulting",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
      quote: "We've completely transformed how we ask for introductions from our network. The multi-channel approach suggested by the platform ensures our referral requests are coordinated and consistent. The Face-to-Face Meeting Guides are particularly effective for our executive-level clients. Our practice has grown 36% year over year, largely through the referral systems we've implemented.",
      timeReduction: 58,
      qualityImprovement: 2.3,
      rating: 5,
      verified: true,
      joinedDate: "November 2023",
      location: "Chicago, IL",
      additionalMetrics: [
        {
          label: "YoY Growth",
          value: "36%",
          icon: <TrendingUpIcon size={14} className="text-green-500" />
        },
        {
          label: "Executive Referrals",
          value: "+125%",
          icon: <Briefcase size={14} className="text-green-500" />
        }
      ]
    },
    {
      id: 11,
      name: "Olivia Santos",
      role: "Product Director",
      company: "Fintech Innovations",
      industry: "Financial Technology",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
      quote: "The AI-generated content perfectly balances technical detail with clear explanations, which is crucial in fintech. We've implemented the Phone Scripts and LinkedIn Group Engagement strategies to build our B2B pipeline. The most surprising success came from the Client Appreciation Events template, which has generated over $400K in new business. Cannot recommend this platform enough!",
      timeReduction: 70,
      qualityImprovement: 2.7,
      rating: 5,
      verified: true,
      joinedDate: "December 2023",
      location: "San Jose, CA",
      additionalMetrics: [
        {
          label: "Event ROI",
          value: "1140%",
          icon: <Calendar size={14} className="text-green-500" />
        },
        {
          label: "Pipeline Growth",
          value: "$1.2M",
          icon: <DollarSign size={14} className="text-green-500" />
        }
      ]
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      if (!animating) {
        goToNext();
      }
    }, 7000);
    
    return () => clearInterval(interval);
  }, [activeSlide, animating]);
  
  const goToPrev = () => {
    if (animating) return;
    setAnimating(true);
    setActiveSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setTimeout(() => setAnimating(false), 500);
  };
  
  const goToNext = () => {
    if (animating) return;
    setAnimating(true);
    setActiveSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setTimeout(() => setAnimating(false), 500);
  };
  
  const goToSlide = (index: number) => {
    if (animating || index === activeSlide) return;
    setAnimating(true);
    setActiveSlide(index);
    setTimeout(() => setAnimating(false), 500);
  };
  
  const testimonial = testimonials[activeSlide];
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="relative">
        {/* Controls */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
          <button
            onClick={goToPrev}
            className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
          <button
            onClick={goToNext}
            className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Testimonial Slide */}
        <div className="p-6 md:p-10">
          <div className={`transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              {/* Left column - Avatar and info */}
              <div className="flex flex-col items-center md:items-start">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-md mb-4 relative">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                  {testimonial.verified && (
                    <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 border-2 border-white">
                      <CheckCircle size={12} className="text-white" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900">{testimonial.name}</h3>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Building size={14} className="mr-1" />
                  <span>{testimonial.company}</span>
                </div>
                
                <div className="flex mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      size={16} 
                      className={i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"} 
                    />
                  ))}
                </div>
                
                <span className="mt-2 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {testimonial.industry}
                </span>
                
                <div className="space-y-2 mt-4 text-xs text-gray-500">
                  {testimonial.location && (
                    <div className="flex items-center">
                      <MapPin size={12} className="mr-1" />
                      <span>{testimonial.location}</span>
                    </div>
                  )}
                  {testimonial.joinedDate && (
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-1" />
                      <span>Customer since {testimonial.joinedDate}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right column - Quote and metrics */}
              <div className="flex-1">
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 mb-6">
                  <blockquote className="text-gray-700 italic mb-3 relative">
                    <div className="absolute -top-2 -left-2 text-blue-200 transform scale-150">
                      "
                    </div>
                    <p className="relative z-10 text-lg">{testimonial.quote}</p>
                    <div className="absolute -bottom-4 -right-2 text-blue-200 transform scale-150">
                      "
                    </div>
                  </blockquote>
                  
                  {testimonial.verified && (
                    <div className="flex items-center justify-end text-xs">
                      <CheckCircle size={12} className="text-green-500 mr-1" />
                      <span className="text-gray-500">Verified Customer</span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <span className="text-2xl font-bold text-blue-600">{testimonial.timeReduction}%</span>
                      <ArrowUp size={16} className="ml-1 text-green-500" />
                    </div>
                    <p className="text-sm text-blue-800">Time Saved</p>
                    <p className="text-xs text-blue-600 mt-1">vs. traditional methods</p>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <span className="text-2xl font-bold text-indigo-600">{testimonial.qualityImprovement}x</span>
                      <ArrowUp size={16} className="ml-1 text-green-500" />
                    </div>
                    <p className="text-sm text-indigo-800">Quality Improvement</p>
                    <p className="text-xs text-indigo-600 mt-1">reported by clients</p>
                  </div>
                </div>
                
                {testimonial.additionalMetrics && (
                  <div className="grid grid-cols-2 gap-4">
                    {testimonial.additionalMetrics.map((metric, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200 shadow-sm">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            {metric.icon}
                          </div>
                          <div>
                            <div className="text-gray-900 font-bold">{metric.value}</div>
                            <div className="text-xs text-gray-500">{metric.label}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 flex justify-end">
                  <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    <Award size={12} className="mr-1" />
                    <span>Success Story</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dots navigation */}
      <div className="flex justify-center pb-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 mx-1 rounded-full transition-all duration-300 ${
              index === activeSlide ? 'bg-blue-600 w-4' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// TrendingUpIcon for use in testimonials
const TrendingUpIcon = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 24, ...rest } = props;
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...rest}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
};

export default TestimonialCarousel;