import React, { useState } from 'react';
import { Search, Download, Tag, Clock, ChevronDown, Check, ExternalLink, FileText, Copy, Link2 } from 'lucide-react';
import ResourceHeader from '../../components/ResourceHeader';
import Footer from '../../components/Footer';

interface TemplateCard {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string;
  popularity: number;
  dateAdded: string;
  isPremium: boolean;
}

const TemplatesResourcePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  // Categories and formats
  const categories = {
    'all': 'All Categories',
    'direct-outreach': 'Direct Outreach',
    'meetings': 'Meetings & Calls',
    'group-engagement': 'Group Engagement',
    'referral-programs': 'Referral Programs',
    'incentives': 'Incentives',
    'follow-up': 'Follow-up'
  };

  const formats = {
    'all': 'All Formats',
    'docx': 'Word Documents',
    'pdf': 'PDF Documents',
    'pptx': 'PowerPoint',
    'email': 'Email Templates',
    'text': 'Text/SMS'
  };

  // Sample templates data
  const templates: TemplateCard[] = [
    {
      id: 'phone-call-1',
      title: 'Warm Contact Phone Script',
      description: 'Professional script for requesting referrals from warm contacts during phone calls.',
      category: 'direct-outreach',
      format: 'docx',
      popularity: 98,
      dateAdded: '2025-03-15',
      isPremium: false
    },
    {
      id: 'client-meeting-1',
      title: 'Client Review Meeting Guide',
      description: 'Guide for requesting referrals during client review meetings.',
      category: 'meetings',
      format: 'pdf',
      popularity: 87,
      dateAdded: '2025-03-18',
      isPremium: false
    },
    {
      id: 'fb-group-1',
      title: 'Facebook Group Engagement Plan',
      description: '14-day engagement plan for generating referrals through Facebook Groups.',
      category: 'group-engagement',
      format: 'docx',
      popularity: 76,
      dateAdded: '2025-03-10',
      isPremium: true
    },
    {
      id: 'reward-program-1',
      title: 'Tiered Reward Program',
      description: 'Comprehensive tiered reward structure for referral incentives.',
      category: 'referral-programs',
      format: 'pdf',
      popularity: 82,
      dateAdded: '2025-03-05',
      isPremium: true
    },
    {
      id: 'zoom-1',
      title: 'Zoom Meeting Template',
      description: 'Template for generating referrals during Zoom meetings.',
      category: 'meetings',
      format: 'pptx',
      popularity: 91,
      dateAdded: '2025-03-20',
      isPremium: false
    },
    {
      id: 'followup-1',
      title: 'Referral Follow-up System',
      description: 'Systematic approach to following up on referral requests.',
      category: 'follow-up',
      format: 'docx',
      popularity: 79,
      dateAdded: '2025-03-12',
      isPremium: false
    }
  ];

  // Filter templates based on search, category, and format
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesFormat = selectedFormat === 'all' || template.format === selectedFormat;
    
    return matchesSearch && matchesCategory && matchesFormat;
  });

  // Sort templates
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.popularity - a.popularity;
      case 'date':
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Copy template link
  const copyTemplateLink = (id: string) => {
    navigator.clipboard.writeText(`https://aireferralmaximizer.com/templates/${id}`);
    setCopiedTemplate(id);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ResourceHeader 
        title="Templates Library"
        subtitle="Browse and download ready-to-use referral templates"
        type="templates"
      />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="col-span-1 md:col-span-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search templates..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {Object.entries(categories).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Format
                </label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                >
                  {Object.entries(formats).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popularity">Most Popular</option>
                  <option value="date">Newest First</option>
                  <option value="title">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Results count */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {filteredTemplates.length} {filteredTemplates.length === 1 ? 'Template' : 'Templates'}
            </h2>
          </div>
          
          {/* Templates grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{template.title}</h3>
                    {template.isPremium && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-200 to-yellow-200 text-amber-800">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {categories[template.category as keyof typeof categories]}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {template.format.toUpperCase()}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <span className="sr-only">Popularity</span>
                      <span className="flex items-center">
                        {template.popularity}% <ChevronDown className={`ml-0.5 h-3 w-3 ${template.popularity < 80 ? 'text-red-500 rotate-180' : 'text-green-500'}`} />
                      </span>
                    </span>
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    Added {new Date(template.dateAdded).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      className="text-gray-500 hover:text-gray-700 p-1"
                      title="Copy template link"
                      onClick={() => copyTemplateLink(template.id)}
                    >
                      {copiedTemplate === template.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Link2 className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      className="text-gray-500 hover:text-gray-700 p-1"
                      title="Download template"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty state */}
          {filteredTemplates.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any templates matching your search criteria.
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedFormat('all');
                }}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear filters
              </button>
            </div>
          )}
          
          <div className="mt-12 flex justify-center">
            <div className="bg-blue-50 rounded-lg border border-blue-100 p-6 max-w-2xl">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Need custom templates?</h3>
              <p className="text-blue-700 mb-4">
                Our Business plan includes custom template creation for your specific needs. Our team will work with you to create templates tailored to your brand and business requirements.
              </p>
              <a
                href="/pricing"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Learn more about Business plans
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TemplatesResourcePage;