import React from 'react';
import { ArrowRight, Users, Briefcase, Target, User, Building2, FileText, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const SolutionsSection: React.FC = () => {
  const solutions = [
    {
      icon: <User size={24} className="text-blue-600" />,
      title: "Small Business Owners",
      description: "Generate referrals without a marketing team or budget. Our AI creates personalized referral requests that feel natural and get results.",
      link: "/app",
      color: "from-blue-500 to-blue-600",
      borderColor: "border-blue-200",
      hoverColor: "hover:bg-blue-50"
    },
    {
      icon: <Briefcase size={24} className="text-purple-600" />,
      title: "Consultants & Freelancers",
      description: "Build your client base through strategic referrals. Create professional outreach that reflects your expertise and personal brand.",
      link: "/app",
      color: "from-purple-500 to-purple-600",
      borderColor: "border-purple-200",
      hoverColor: "hover:bg-purple-50"
    },
    {
      icon: <Target size={24} className="text-green-600" />,
      title: "Sales Professionals",
      description: "Convert more prospects with personalized referral scripts. Our AI helps you create natural, effective outreach for multiple channels.",
      link: "/app",
      color: "from-green-500 to-green-600",
      borderColor: "border-green-200",
      hoverColor: "hover:bg-green-50"
    },
    {
      icon: <Users size={24} className="text-indigo-600" />,
      title: "Agency Teams",
      description: "Create referral systems for your clients and scale your own business. Our tools help your team deliver consistent referral content.",
      link: "/app",
      color: "from-indigo-500 to-indigo-600",
      borderColor: "border-indigo-200",
      hoverColor: "hover:bg-indigo-50"
    },
    {
      icon: <Building2 size={24} className="text-amber-600" />,
      title: "Service Providers",
      description: "Turn satisfied customers into ongoing referral sources. Our templates make asking for referrals easy and professional.",
      link: "/app",
      color: "from-amber-500 to-amber-600",
      borderColor: "border-amber-200",
      hoverColor: "hover:bg-amber-50"
    },
    {
      icon: <FileText size={24} className="text-red-600" />,
      title: "Enterprise Teams",
      description: "Scale referral programs across your organization with consistent, high-quality referral content that maintains your brand standards.",
      link: "/app",
      color: "from-red-500 to-red-600",
      borderColor: "border-red-200",
      hoverColor: "hover:bg-red-50"
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Solutions for Every Business Need</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            No matter your industry or role, our AI-powered platform helps you generate more referrals with personalized, professional content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div 
              key={index} 
              className={`border ${solution.borderColor} rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${solution.hoverColor}`}
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-4">
                  {solution.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{solution.title}</h3>
                <p className="text-gray-600 mb-4">{solution.description}</p>
                <Link
                  to={solution.link}
                  className={`inline-flex items-center text-sm font-medium bg-gradient-to-r ${solution.color} text-white px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all`}
                >
                  Get Started
                  <ArrowRight size={14} className="ml-1.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/app" className="inline-flex items-center text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors">
            Explore all solutions
            <Zap size={18} className="ml-2 text-yellow-500" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;