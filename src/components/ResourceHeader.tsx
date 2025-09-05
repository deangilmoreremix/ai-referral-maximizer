import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code, FileText, Layers, ArrowLeft, UserPlus } from 'lucide-react';
import Nav from './Nav';

interface ResourceHeaderProps {
  title: string;
  subtitle?: string;
  type: 'guide' | 'api' | 'documentation' | 'templates';
}

const ResourceHeader: React.FC<ResourceHeaderProps> = ({ title, subtitle, type }) => {
  // Get the icon based on resource type
  const getIcon = () => {
    switch (type) {
      case 'guide':
        return <BookOpen size={24} className="text-green-600" />;
      case 'api':
        return <Code size={24} className="text-purple-600" />;
      case 'documentation':
        return <FileText size={24} className="text-blue-600" />;
      case 'templates':
        return <Layers size={24} className="text-orange-600" />;
    }
  };

  return (
    <>
      <Nav current="landing" />
      
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <Link 
                to="/"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Home
              </Link>
              <div className="flex items-center">
                {getIcon()}
                <h1 className="ml-3 text-2xl font-bold leading-tight text-gray-900">{title}</h1>
              </div>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500 max-w-2xl">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3 flex space-x-8 overflow-x-auto">
            <Link 
              to="/resources/guide" 
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                type === 'guide' 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Getting Started Guide
            </Link>
            <Link 
              to="/resources/api" 
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                type === 'api' 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              API Documentation
            </Link>
            <Link 
              to="/resources/documentation" 
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                type === 'documentation' 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Full Documentation
            </Link>
            <Link 
              to="/resources/templates" 
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                type === 'templates' 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Templates Library
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

// Add named export alongside default export
export { ResourceHeader };
export default ResourceHeader;