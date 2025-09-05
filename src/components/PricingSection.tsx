import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Shield, Zap, MessageSquare, ArrowRight } from 'lucide-react';

const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  
  // Pricing data
  const pricing = {
    basic: {
      monthly: 39,
      yearly: 29 // Monthly price when billed yearly
    },
    pro: {
      monthly: 99,
      yearly: 79
    },
    business: {
      monthly: 249,
      yearly: 199
    }
  };

  // Calculate yearly savings
  const yearlySavingsPercent = Math.round(((pricing.pro.monthly * 12) - (pricing.pro.yearly * 12)) / (pricing.pro.monthly * 12) * 100);
  
  return (
    <div className="mx-auto">
      {/* Pricing Toggle */}
      <div className="flex justify-center mb-10">
        <div className="bg-gray-100 p-1 rounded-lg inline-flex items-center">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              billingCycle !== 'monthly' 
                ? 'border border-transparent text-gray-500 hover:text-gray-700' 
                : 'bg-white text-green-600 shadow-sm border border-green-100'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              billingCycle !== 'yearly' 
                ? 'border border-transparent text-gray-500 hover:text-gray-700' 
                : 'bg-white text-green-600 shadow-sm border border-green-100'
            }`}
          >
            Annual
            <span className="ml-1 bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full">Save {yearlySavingsPercent}%</span>
          </button>
        </div>
      </div>
      
      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Basic Plan */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Basic</h3>
                <p className="text-gray-500 text-sm">For individuals</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
            </div>
            <div className="flex items-baseline mt-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">${pricing.basic[billingCycle]}</span>
              <span className="text-gray-500 ml-1">/mo</span>
              
              {billingCycle === 'yearly' && (
                <span className="ml-2 text-xs text-green-600">
                  ${pricing.basic.monthly * 12 - pricing.basic.yearly * 12} saved per year
                </span>
              )}
            </div>
            
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>10 referral methods</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>20 AI generations/month</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>PDF exports</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>Email support</span>
              </li>
            </ul>
          </div>
          
          <div className="px-6 pb-6">
            <Link
              to="/pricing"
              className="block w-full text-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Learn More
            </Link>
          </div>
        </div>
        
        {/* Pro Plan */}
        <div className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden transform scale-105 z-10 hover:shadow-xl transition-all duration-300">
          <div className="bg-green-500 text-white text-xs text-center font-semibold uppercase py-1">
            Most Popular
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
                <p className="text-gray-500 text-sm">For small teams</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
            </div>
            <div className="flex items-baseline mt-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">${pricing.pro[billingCycle]}</span>
              <span className="text-gray-500 ml-1">/mo</span>
              
              {billingCycle === 'yearly' && (
                <span className="ml-2 text-xs text-green-600">
                  ${pricing.pro.monthly * 12 - pricing.pro.yearly * 12} saved per year
                </span>
              )}
            </div>
            
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>All 50 referral methods</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>100 AI generations/month</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>All export formats</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>Document analysis</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>LinkedIn integration</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>Up to 5 team members</span>
              </li>
            </ul>
          </div>
          
          <div className="px-6 pb-6">
            <Link
              to="/pricing"
              className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Get Started
            </Link>
          </div>
        </div>
        
        {/* Business Plan */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Business</h3>
                <p className="text-gray-500 text-sm">For organizations</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </div>
            </div>
            <div className="flex items-baseline mt-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">${pricing.business[billingCycle]}</span>
              <span className="text-gray-500 ml-1">/mo</span>
              
              {billingCycle === 'yearly' && (
                <span className="ml-2 text-xs text-green-600">
                  ${pricing.business.monthly * 12 - pricing.business.yearly * 12} saved per year
                </span>
              )}
            </div>
            
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>All 50 referral methods</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>Unlimited AI generations</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>All export formats with branding</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>Advanced integrations</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>Unlimited team members</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span>API access</span>
              </li>
            </ul>
          </div>
          
          <div className="px-6 pb-6">
            <Link
              to="/pricing"
              className="block w-full text-center px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
      
      {/* Bottom banner */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center">
          <Shield size={20} className="text-blue-600 mr-2" />
          <span className="text-blue-800 font-medium">30-Day Money-Back Guarantee</span>
        </div>
        <div className="hidden md:block w-px h-6 bg-blue-200"></div>
        <div className="flex items-center">
          <Zap size={20} className="text-blue-600 mr-2" />
          <span className="text-blue-800 font-medium">No Credit Card Required for Trial</span>
        </div>
        <div className="hidden md:block w-px h-6 bg-blue-200"></div>
        <div className="flex items-center">
          <MessageSquare size={20} className="text-blue-600 mr-2" />
          <span className="text-blue-800 font-medium">Dedicated Support</span>
        </div>
      </div>
      
      {/* View full pricing button */}
      <div className="mt-10 text-center">
        <Link to="/pricing" className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800">
          View full pricing details and feature comparison
          <ArrowRight size={16} className="ml-1.5" />
        </Link>
      </div>
    </div>
  );
};

export default PricingSection;