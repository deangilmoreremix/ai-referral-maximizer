import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, 
  X, 
  ChevronDown, 
  ArrowRight, 
  Shield, 
  Zap, 
  BarChart, 
  Clock, 
  FileText, 
  Users, 
  Sparkles, 
  MessageSquare, 
  User,
  Building2,
  Crown
} from 'lucide-react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly');
  const [showComparison, setShowComparison] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Pricing based on billing cycle
  const pricing = {
    basic: {
      monthly: 39,
      yearly: 29,  // Monthly price when billed yearly
      lifetime: 399  // One-time payment
    },
    pro: {
      monthly: 99,
      yearly: 79,
      lifetime: 799
    },
    business: {
      monthly: 249,
      yearly: 199,
      lifetime: 1899
    }
  };

  // Calculate savings
  const yearlySavingsPercent = Math.round(((pricing.pro.monthly * 12) - (pricing.pro.yearly * 12)) / (pricing.pro.monthly * 12) * 100);
  const lifetimeSavingsPercent = Math.round(((pricing.pro.monthly * 36) - pricing.pro.lifetime) / (pricing.pro.monthly * 36) * 100);
  
  // Helper to calculate yearly savings
  const calculateYearlySavings = (plan: 'basic' | 'pro' | 'business') => {
    return (pricing[plan].monthly * 12) - (pricing[plan].yearly * 12);
  };
  
  // Helper to format price
  const formatPrice = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Nav current="pricing" />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                Simple, Transparent Pricing
              </h1>
              <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
                Choose the plan that fits your referral generation needs. All plans include access to our AI-powered platform.
              </p>
            </div>
          </div>
        </div>
        
        {/* Pricing Toggle */}
        <div className="max-w-7xl mx-auto pt-12 px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <div className="relative bg-gray-100 p-0.5 rounded-lg flex self-center mt-8 sm:mt-0">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`relative py-2 px-6 md:w-1/3 rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-green-500 focus:z-10 sm:w-auto sm:px-8
                  ${billingCycle === 'monthly' 
                    ? 'bg-white border-gray-200 shadow-sm text-green-700' 
                    : 'border border-transparent text-gray-700'}`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`relative py-2 px-6 md:w-1/3 rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-green-500 focus:z-10 sm:w-auto sm:px-8
                  ${billingCycle === 'yearly' 
                    ? 'bg-white border-gray-200 shadow-sm text-green-700' 
                    : 'border border-transparent text-gray-700'}`}
              >
                Yearly
                <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  Save {yearlySavingsPercent}%
                </span>
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('lifetime')}
                className={`relative py-2 px-6 md:w-1/3 rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-green-500 focus:z-10 sm:w-auto sm:px-8
                  ${billingCycle === 'lifetime' 
                    ? 'bg-white border-gray-200 shadow-sm text-green-700' 
                    : 'border border-transparent text-gray-700'}`}
              >
                Lifetime
                <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  Save {lifetimeSavingsPercent}%
                </span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Basic Plan */}
            <div className={`relative rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
              selectedPlan === 'basic' ? 'ring-2 ring-green-500 transform scale-[1.02]' : 'border border-gray-200'
            }`}>
              {billingCycle === 'lifetime' && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 transform rotate-0 origin-top-right">
                  ONE-TIME PAYMENT
                </div>
              )}
              
              <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Basic</h3>
                    <p className="mt-2 text-gray-500 text-sm">For individuals and freelancers</p>
                  </div>
                  <div className="bg-gray-100 p-2 rounded-full">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div className="mt-6">
                  <p className="mt-2">
                    <span className="text-4xl font-bold text-gray-900">${pricing.basic[billingCycle]}</span>
                    <span className="text-base font-medium text-gray-500">
                      {billingCycle === 'lifetime' ? ' one-time' : billingCycle === 'yearly' ? '/mo billed annually' : '/month'}
                    </span>
                  </p>
                  {billingCycle === 'yearly' && (
                    <p className="mt-1 text-sm text-green-600">
                      Save ${calculateYearlySavings('basic')} per year
                    </p>
                  )}
                </div>
              </div>
              <div className="px-6 pt-6 pb-8 bg-white sm:p-10">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">10 referral method templates</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">20 AI generations per month</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">PDF exports</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">Basic personalization</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">Email support</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <X className="h-5 w-5 text-gray-300" />
                    </div>
                    <p className="ml-3 text-sm text-gray-500">Document analysis</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <X className="h-5 w-5 text-gray-300" />
                    </div>
                    <p className="ml-3 text-sm text-gray-500">LinkedIn integration</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <X className="h-5 w-5 text-gray-300" />
                    </div>
                    <p className="ml-3 text-sm text-gray-500">Multi-format exports</p>
                  </li>
                </ul>
                <div className="mt-8">
                  <button
                    onClick={() => setSelectedPlan(selectedPlan === 'basic' ? null : 'basic')}
                    className={`w-full ${
                      selectedPlan === 'basic'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-500'
                        : 'bg-green-600 text-white hover:bg-green-700 border border-transparent'
                    } rounded-md py-3 px-5 text-base font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200`}
                  >
                    {selectedPlan === 'basic' ? 'Selected' : 'Get Basic'}
                  </button>
                </div>
              </div>
            </div>

            {/* Pro Plan */}
            <div className={`relative rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform ${
              selectedPlan === 'pro' 
                ? 'ring-2 ring-green-500 scale-[1.02] z-10' 
                : 'border border-gray-200 md:scale-105 lg:scale-110 z-20'
            }`}>
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-400 to-green-600"></div>
              <div className="absolute top-0 right-0 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-bold uppercase px-3 py-1 transform translate-x-2 -translate-y-0 rotate-45 origin-bottom-left">
                Popular
              </div>
              
              {billingCycle === 'lifetime' && (
                <div className="absolute top-6 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 transform rotate-0 origin-top-right">
                  ONE-TIME PAYMENT
                </div>
              )}
              
              <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Pro</h3>
                    <p className="mt-2 text-gray-500 text-sm">For small teams and businesses</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-6">
                  <p>
                    <span className="text-4xl font-bold text-gray-900">${pricing.pro[billingCycle]}</span>
                    <span className="text-base font-medium text-gray-500">
                      {billingCycle === 'lifetime' ? ' one-time' : billingCycle === 'yearly' ? '/mo billed annually' : '/month'}
                    </span>
                  </p>
                  {billingCycle === 'yearly' && (
                    <p className="mt-1 text-sm text-green-600">
                      Save ${calculateYearlySavings('pro')} per year
                    </p>
                  )}
                </div>
              </div>
              <div className="px-6 pt-6 pb-8 bg-white sm:p-10">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">All 50 referral methods</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">100 AI generations per month</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">All export formats (PDF, PPTX, DOCX)</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">Advanced personalization</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">Document analysis</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">LinkedIn profile integration</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">Up to 5 team members</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">Priority email support</p>
                  </li>
                </ul>
                <div className="mt-8">
                  <button
                    onClick={() => setSelectedPlan(selectedPlan === 'pro' ? null : 'pro')}
                    className={`w-full ${
                      selectedPlan === 'pro'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-500'
                        : 'bg-green-600 text-white hover:bg-green-700 border border-transparent'
                    } rounded-md py-3 px-5 text-base font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200`}
                  >
                    {selectedPlan === 'pro' ? 'Selected' : 'Get Pro'}
                  </button>
                </div>
              </div>
            </div>

            {/* Business Plan */}
            <div className={`relative rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
              selectedPlan === 'business' ? 'ring-2 ring-green-500 transform scale-[1.02]' : 'border border-gray-200'
            }`}>
              {billingCycle === 'lifetime' && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 transform rotate-0 origin-top-right">
                  ONE-TIME PAYMENT
                </div>
              )}
              
              <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Business</h3>
                    <p className="mt-2 text-gray-500 text-sm">For larger organizations</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-6">
                  <p>
                    <span className="text-4xl font-bold text-gray-900">${pricing.business[billingCycle]}</span>
                    <span className="text-base font-medium text-gray-500">
                      {billingCycle === 'lifetime' ? ' one-time' : billingCycle === 'yearly' ? '/mo billed annually' : '/month'}
                    </span>
                  </p>
                  {billingCycle === 'yearly' && (
                    <p className="mt-1 text-sm text-green-600">
                      Save ${calculateYearlySavings('business')} per year
                    </p>
                  )}
                </div>
              </div>
              <div className="px-6 pt-6 pb-8 bg-white sm:p-10">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">All 50 referral methods</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">Unlimited AI generations</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">All export formats with branding</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">Enterprise personalization</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">Advanced document analysis</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">Enhanced LinkedIn integration</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">Unlimited team members</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">API access & custom integrations</p>
                  </li>
                </ul>
                <div className="mt-8">
                  <button
                    onClick={() => setSelectedPlan(selectedPlan === 'business' ? null : 'business')}
                    className={`w-full ${
                      selectedPlan === 'business'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-500'
                        : 'bg-green-600 text-white hover:bg-green-700 border border-transparent'
                    } rounded-md py-3 px-5 text-base font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200`}
                  >
                    {selectedPlan === 'business' ? 'Selected' : 'Get Business'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Proceed Button (only visible when a plan is selected) */}
          {selectedPlan && (
            <div className="mt-12 text-center">
              <Link
                to="/app"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                Proceed with {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <p className="mt-2 text-sm text-gray-500">30-day money-back guarantee</p>
            </div>
          )}
          
          {/* Special Offer Banner */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100 shadow-sm">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mr-8 mb-6 md:mb-0">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <Crown className="h-10 w-10 text-yellow-500" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Enterprise Solutions</h2>
                <p className="text-lg text-gray-600 mb-4">
                  Need a custom solution for your enterprise? We offer tailored packages with dedicated support, custom integrations, and advanced security features.
                </p>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                  Contact Sales
                  <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature Comparison */}
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Compare Features</h2>
            <button
              className="flex items-center text-green-600 hover:text-green-700"
              onClick={() => setShowComparison(!showComparison)}
            >
              {showComparison ? 'Hide' : 'Show'} detailed comparison
              {showComparison ? <ChevronUp className="ml-1 h-5 w-5" /> : <ChevronDown className="ml-1 h-5 w-5" />}
            </button>
          </div>
          
          {showComparison && (
            <div className="mt-8 overflow-x-auto border rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feature
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Basic
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider">
                      Pro
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="bg-gray-50">
                    <td className="px-6 py-3 text-sm font-semibold text-gray-900" colSpan={4}>
                      Content Features
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      Referral Methods
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      10 methods
                    </td>
                    <td className="px-6 py-3 text-center text-sm bg-green-50 font-medium text-green-900">
                      All 50 methods
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      All 50 methods + Custom
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      AI Content Generation
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      20/month
                    </td>
                    <td className="px-6 py-3 text-center text-sm bg-green-50 font-medium text-green-900">
                      100/month
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      Unlimited
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      Export Formats
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      PDF only
                    </td>
                    <td className="px-6 py-3 text-center text-sm bg-green-50 font-medium text-green-900">
                      PDF, PPTX, DOCX
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      All formats + Branded
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      Voice & SMS Features
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-3 text-center text-sm bg-green-50 font-medium text-green-900">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  
                  <tr className="bg-gray-50">
                    <td className="px-6 py-3 text-sm font-semibold text-gray-900" colSpan={4}>
                      Personalization Features
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      Basic Personalization
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-3 text-center text-sm bg-green-50 font-medium text-green-900">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      LinkedIn Profile Analysis
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
                    </td>
                    <td className="px-6 py-3 text-center text-sm bg-green-50 font-medium text-green-900">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      Document Analysis
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
                    </td>
                    <td className="px-6 py-3 text-center text-sm bg-green-50 font-medium text-green-900">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      Custom Branding in Exports
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
                    </td>
                    <td className="px-6 py-3 text-center text-sm bg-green-50 font-medium text-green-900">
                      Basic
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      Advanced
                    </td>
                  </tr>
                  
                  <tr className="bg-gray-50">
                    <td className="px-6 py-3 text-sm font-semibold text-gray-900" colSpan={4}>
                      Team & Support
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      Team Members
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      1
                    </td>
                    <td className="px-6 py-3 text-center text-sm bg-green-50 font-medium text-green-900">
                      Up to 5
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      Unlimited
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      Content History
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      30 days
                    </td>
                    <td className="px-6 py-3 text-center text-sm bg-green-50 font-medium text-green-900">
                      1 year
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      Unlimited
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      Support
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      Email
                    </td>
                    <td className="px-6 py-3 text-center text-sm bg-green-50 font-medium text-green-900">
                      Priority Email
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      24/7 Phone & Email
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      Onboarding
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      Self-serve
                    </td>
                    <td className="px-6 py-3 text-center text-sm bg-green-50 font-medium text-green-900">
                      Group session
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      Dedicated session
                    </td>
                  </tr>
                  
                  <tr className="bg-gray-50">
                    <td className="px-6 py-3 text-sm font-semibold text-gray-900" colSpan={4}>
                      Advanced Features
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      API Access
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
                    </td>
                    <td className="px-6 py-3 text-center text-sm bg-green-50 font-medium text-green-900">
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      Custom Templates
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
                    </td>
                    <td className="px-6 py-3 text-center text-sm bg-green-50 font-medium text-green-900">
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      White Labeling
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
                    </td>
                    <td className="px-6 py-3 text-center text-sm bg-green-50 font-medium text-green-900">
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      Dashboard & Analytics
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      Basic
                    </td>
                    <td className="px-6 py-3 text-center text-sm bg-green-50 font-medium text-green-900">
                      Advanced
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      Enterprise-grade
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* FAQ Section */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
            <dl className="space-y-6">
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <dt className="px-6 py-4">
                  <button
                    className="text-left w-full flex justify-between items-center focus:outline-none"
                    onClick={() => {}} // Toggle FAQ item state
                  >
                    <span className="text-lg font-medium text-gray-900">What's included in the free trial?</span>
                    <span className="ml-6 h-7 flex items-center">
                      <ChevronDown className="h-6 w-6 text-gray-500" aria-hidden="true" />
                    </span>
                  </button>
                </dt>
                <dd className="px-6 py-4 border-t border-gray-200">
                  <p className="text-base text-gray-700">
                    Our 14-day free trial includes all features of the Pro plan, allowing you to explore all 50 referral methods, export in various formats, and use our advanced personalization features without any commitment.
                  </p>
                </dd>
              </div>

              <div className="bg-white shadow overflow-hidden rounded-lg">
                <dt className="px-6 py-4">
                  <button
                    className="text-left w-full flex justify-between items-center focus:outline-none"
                    onClick={() => {}} // Toggle FAQ item state
                  >
                    <span className="text-lg font-medium text-gray-900">Can I upgrade or downgrade my plan?</span>
                    <span className="ml-6 h-7 flex items-center">
                      <ChevronDown className="h-6 w-6 text-gray-500" aria-hidden="true" />
                    </span>
                  </button>
                </dt>
                <dd className="px-6 py-4 border-t border-gray-200">
                  <p className="text-base text-gray-700">
                    Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated amount for the remainder of your billing cycle. When downgrading, the change will take effect at the end of your current billing cycle.
                  </p>
                </dd>
              </div>

              <div className="bg-white shadow overflow-hidden rounded-lg">
                <dt className="px-6 py-4">
                  <button
                    className="text-left w-full flex justify-between items-center focus:outline-none"
                    onClick={() => {}} // Toggle FAQ item state
                  >
                    <span className="text-lg font-medium text-gray-900">What happens if I exceed my monthly content generation limit?</span>
                    <span className="ml-6 h-7 flex items-center">
                      <ChevronDown className="h-6 w-6 text-gray-500" aria-hidden="true" />
                    </span>
                  </button>
                </dt>
                <dd className="px-6 py-4 border-t border-gray-200">
                  <p className="text-base text-gray-700">
                    If you reach your monthly content generation limit, you'll have the option to purchase additional generations as needed, or you can wait until your limit resets at the beginning of your next billing cycle. Alternatively, you can upgrade to a higher plan with more generations.
                  </p>
                </dd>
              </div>

              <div className="bg-white shadow overflow-hidden rounded-lg">
                <dt className="px-6 py-4">
                  <button
                    className="text-left w-full flex justify-between items-center focus:outline-none"
                    onClick={() => {}} // Toggle FAQ item state
                  >
                    <span className="text-lg font-medium text-gray-900">What's your refund policy?</span>
                    <span className="ml-6 h-7 flex items-center">
                      <ChevronDown className="h-6 w-6 text-gray-500" aria-hidden="true" />
                    </span>
                  </button>
                </dt>
                <dd className="px-6 py-4 border-t border-gray-200">
                  <p className="text-base text-gray-700">
                    We offer a 30-day money-back guarantee for all plans. If you're not satisfied with our service within the first 30 days, contact our support team for a full refund. For lifetime plans, we offer a 60-day money-back guarantee.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Trust Features */}
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">30-Day Money-Back Guarantee</h3>
                <p className="text-sm text-gray-600 text-center">Try our platform risk-free with our 30-day money-back guarantee.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Credit Card Required for Trial</h3>
                <p className="text-sm text-gray-600 text-center">Start your free 14-day trial without providing payment information.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-4">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Dedicated Support</h3>
                <p className="text-sm text-gray-600 text-center">Our team is here to help you succeed with your referral generation.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to get more referrals?</span>
              <span className="block text-green-100">Start your free trial today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/app"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50"
                >
                  Get started for free
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-700 hover:bg-green-800"
                >
                  Contact sales
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PricingPage;