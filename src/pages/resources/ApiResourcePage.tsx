import React, { useState } from 'react';
import { Code, ExternalLink, ChevronDown, ChevronUp, Copy, Check, Info } from 'lucide-react';
import { ResourceHeader } from '../../components/ResourceHeader';
import Footer from '../../components/Footer';

interface EndpointExample {
  title: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  request?: string;
  response: string;
}

const ApiResourcePage: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('authentication');
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (section === expandedSection) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedExample(id);
    setTimeout(() => setCopiedExample(null), 2000);
  };

  const endpoints: EndpointExample[] = [
    {
      title: 'Generate Content',
      description: 'Generate referral content based on specified parameters',
      endpoint: '/v1/content/generate',
      method: 'POST',
      request: `{
  "contentType": "Phone Call Scripts",
  "industry": "Financial Services",
  "targetAudience": "High-net-worth individuals",
  "businessSize": "medium",
  "specialRequirements": "Focus on wealth preservation"
}`,
      response: `{
  "id": "cont_abc123xyz",
  "contentType": "Phone Call Scripts",
  "content": "Hello {{name}}, this is {{your_name}} from XYZ Wealth Management...",
  "metadata": {
    "contentType": "Phone Call Scripts",
    "industry": "Financial Services",
    "generatedAt": "2025-04-03T13:45:22Z"
  }
}`
    },
    {
      title: 'List Referral Methods',
      description: 'Retrieve available referral methods with optional filtering',
      endpoint: '/v1/referral-methods',
      method: 'GET',
      response: `{
  "methods": [
    {
      "id": "phone-call-scripts",
      "name": "Phone Call Scripts",
      "description": "Effective scripts for requesting referrals during phone conversations",
      "category": "direct-outreach",
      "hasMultipleDays": false
    },
    {
      "id": "whatsapp-outreach-campaigns",
      "name": "WhatsApp Outreach Campaigns",
      "description": "14-day WhatsApp messaging campaign to generate referrals",
      "category": "digital-communication",
      "hasMultipleDays": true,
      "totalDays": 14
    }
  ]
}`
    },
    {
      title: 'Analyze Document',
      description: 'Extract key information from a document for personalization',
      endpoint: '/v1/documents/analyze',
      method: 'POST',
      request: `// Multipart form data with file upload`,
      response: `{
  "industry": "Technology",
  "targetAudience": "Enterprise IT Departments",
  "businessSize": "enterprise",
  "keyPoints": [
    "Cloud migration expertise",
    "24/7 support offering",
    "Compliance focus"
  ],
  "topics": ["Cloud Security", "Digital Transformation", "IT Support"]
}`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ResourceHeader 
        title="API Documentation"
        subtitle="Integrate AI Referral Maximizer into your applications with our comprehensive API"
        type="api"
      />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-72 flex-shrink-0">
              <div className="sticky top-6 space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h2 className="text-lg font-medium text-gray-900 mb-3">API Reference</h2>
                  <nav className="space-y-1">
                    <a
                      href="#authentication"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSection('authentication');
                      }}
                      className={`block px-3 py-2 rounded-md text-sm font-medium ${
                        expandedSection === 'authentication'
                          ? 'bg-purple-50 text-purple-700 border border-purple-100'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      Authentication
                    </a>
                    <a
                      href="#endpoints"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSection('endpoints');
                      }}
                      className={`block px-3 py-2 rounded-md text-sm font-medium ${
                        expandedSection === 'endpoints'
                          ? 'bg-purple-50 text-purple-700 border border-purple-100'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      Endpoints
                    </a>
                    <a
                      href="#rate-limits"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSection('rate-limits');
                      }}
                      className={`block px-3 py-2 rounded-md text-sm font-medium ${
                        expandedSection === 'rate-limits'
                          ? 'bg-purple-50 text-purple-700 border border-purple-100'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      Rate Limits
                    </a>
                    <a
                      href="#errors"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSection('errors');
                      }}
                      className={`block px-3 py-2 rounded-md text-sm font-medium ${
                        expandedSection === 'errors'
                          ? 'bg-purple-50 text-purple-700 border border-purple-100'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      Error Handling
                    </a>
                    <a
                      href="#webhooks"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSection('webhooks');
                      }}
                      className={`block px-3 py-2 rounded-md text-sm font-medium ${
                        expandedSection === 'webhooks'
                          ? 'bg-purple-50 text-purple-700 border border-purple-100'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      Webhooks
                    </a>
                  </nav>
                </div>
                
                <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-100 p-4">
                  <h3 className="font-medium text-blue-800 flex items-center">
                    <Info size={16} className="mr-2" />
                    API Access
                  </h3>
                  <p className="mt-2 text-sm text-blue-700">
                    API access is available on Business tier plans. Contact sales for more information.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="prose max-w-none">
                  <h1>AI Referral Maximizer API</h1>
                  <p>
                    Welcome to the AI Referral Maximizer API documentation. Our API allows you to programmatically 
                    generate and manage referral content, personalize your experience, and integrate with your existing systems.
                  </p>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Info size={20} className="text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">API Access Required</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            API access is available with our Business plan. To request API access, please contact our 
                            sales team or upgrade your plan to Business.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div id="authentication" className={`my-8 ${expandedSection === 'authentication' ? '' : 'opacity-50'}`}>
                    <div 
                      className="flex justify-between items-center cursor-pointer" 
                      onClick={() => toggleSection('authentication')}
                    >
                      <h2 className="text-2xl font-bold">Authentication</h2>
                      {expandedSection === 'authentication' ? (
                        <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </div>
                    
                    {expandedSection === 'authentication' && (
                      <div className="mt-4">
                        <p>
                          The AI Referral Maximizer API uses API keys for authentication. You can find your API key in the 
                          dashboard under Settings &gt; API.
                        </p>
                        
                        <h3 className="text-xl font-semibold mt-4 mb-2">Authentication Header</h3>
                        <p>Include your API key in the <code>Authorization</code> header of your requests:</p>
                        
                        <div className="bg-gray-800 text-white p-4 rounded-md my-4 relative">
                          <button 
                            className="absolute right-2 top-2 text-gray-400 hover:text-white"
                            onClick={() => copyToClipboard(
                              'Authorization: Bearer your_api_key_here',
                              'auth-header'
                            )}
                          >
                            {copiedExample === 'auth-header' ? (
                              <Check size={18} className="text-green-500" />
                            ) : (
                              <Copy size={18} />
                            )}
                          </button>
                          <code>Authorization: Bearer your_api_key_here</code>
                        </div>
                        
                        <h3 className="text-xl font-semibold mt-4 mb-2">API Key Security</h3>
                        <p>
                          Your API key carries many privileges, so be sure to keep it secure! Do not share your API key 
                          in publicly accessible areas such as GitHub, client-side code, or in your frontend application.
                        </p>
                        
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
                          <p className="text-blue-700">
                            <strong>Best Practice:</strong> All API requests should be made from your server, not directly from the client/browser.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div id="endpoints" className={`my-8 ${expandedSection === 'endpoints' ? '' : 'opacity-50'}`}>
                    <div 
                      className="flex justify-between items-center cursor-pointer" 
                      onClick={() => toggleSection('endpoints')}
                    >
                      <h2 className="text-2xl font-bold">API Endpoints</h2>
                      {expandedSection === 'endpoints' ? (
                        <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </div>
                    
                    {expandedSection === 'endpoints' && (
                      <div className="mt-4">
                        <p>
                          The base URL for all API requests is:
                        </p>
                        
                        <div className="bg-gray-800 text-white p-4 rounded-md my-4">
                          <code>https://api.aireferralmaximizer.com</code>
                        </div>
                        
                        <h3 className="text-xl font-semibold mt-6 mb-4">Available Endpoints</h3>
                        
                        {endpoints.map((endpoint, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg mb-6 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                  <h4 className="text-lg font-medium text-gray-900">{endpoint.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{endpoint.description}</p>
                                </div>
                                <div className="mt-2 md:mt-0">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 
                                    endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                                    endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {endpoint.method}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="px-6 py-4">
                              <div className="bg-gray-100 p-3 rounded-md flex items-center mb-4">
                                <span className={`text-sm font-mono ${
                                  endpoint.method === 'GET' ? 'text-green-700' : 
                                  endpoint.method === 'POST' ? 'text-blue-700' :
                                  endpoint.method === 'PUT' ? 'text-yellow-700' :
                                  'text-red-700'
                                } mr-2`}>
                                  {endpoint.method}
                                </span>
                                <code className="text-sm font-mono text-gray-800">{endpoint.endpoint}</code>
                              </div>
                              
                              {endpoint.request && (
                                <>
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">Request</h5>
                                  <div className="bg-gray-800 text-white p-4 rounded-md mb-4 relative">
                                    <button 
                                      className="absolute right-2 top-2 text-gray-400 hover:text-white"
                                      onClick={() => copyToClipboard(endpoint.request!, `request-${index}`)}
                                    >
                                      {copiedExample === `request-${index}` ? (
                                        <Check size={18} className="text-green-500" />
                                      ) : (
                                        <Copy size={18} />
                                      )}
                                    </button>
                                    <pre className="text-sm overflow-auto">{endpoint.request}</pre>
                                  </div>
                                </>
                              )}
                              
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Response</h5>
                              <div className="bg-gray-800 text-white p-4 rounded-md relative">
                                <button 
                                  className="absolute right-2 top-2 text-gray-400 hover:text-white"
                                  onClick={() => copyToClipboard(endpoint.response, `response-${index}`)}
                                >
                                  {copiedExample === `response-${index}` ? (
                                    <Check size={18} className="text-green-500" />
                                  ) : (
                                    <Copy size={18} />
                                  )}
                                </button>
                                <pre className="text-sm overflow-auto">{endpoint.response}</pre>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
                          <h3 className="text-lg font-medium text-blue-800 mb-2 flex items-center">
                            <Code size={18} className="text-blue-600 mr-2" />
                            Full API Reference
                          </h3>
                          <p className="text-blue-700 mb-4">
                            This is a simplified overview of our API. For the complete API reference, including all 
                            endpoints, parameters, and response schemas, view our detailed documentation.
                          </p>
                          <a 
                            href="#"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                          >
                            View Complete API Reference
                            <ExternalLink size={16} className="ml-2" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div id="rate-limits" className={`my-8 ${expandedSection === 'rate-limits' ? '' : 'opacity-50'}`}>
                    <div 
                      className="flex justify-between items-center cursor-pointer" 
                      onClick={() => toggleSection('rate-limits')}
                    >
                      <h2 className="text-2xl font-bold">Rate Limits</h2>
                      {expandedSection === 'rate-limits' ? (
                        <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </div>
                    
                    {expandedSection === 'rate-limits' && (
                      <div className="mt-4">
                        <p>
                          To ensure a consistent and reliable service for all users, we implement rate limiting on our API. 
                          Rate limits are applied on a per-API key basis.
                        </p>
                        
                        <div className="mt-4 overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Endpoint
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Rate Limit
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Window
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  Content Generation
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  100 requests
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  1 hour
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  Document Analysis
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  50 requests
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  1 hour
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  All Other Endpoints
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  500 requests
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  1 hour
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        <h3 className="text-xl font-semibold mt-6 mb-2">Rate Limit Headers</h3>
                        <p>
                          We include rate limit information in the response headers:
                        </p>
                        
                        <div className="bg-gray-800 text-white p-4 rounded-md my-4">
                          <code>X-RateLimit-Limit: 100</code><br />
                          <code>X-RateLimit-Remaining: 98</code><br />
                          <code>X-RateLimit-Reset: 1619864400</code>
                        </div>
                        
                        <p>
                          If you exceed the rate limit, you'll receive a <code>429 Too Many Requests</code> response with 
                          information about when you can retry.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div id="errors" className={`my-8 ${expandedSection === 'errors' ? '' : 'opacity-50'}`}>
                    <div 
                      className="flex justify-between items-center cursor-pointer" 
                      onClick={() => toggleSection('errors')}
                    >
                      <h2 className="text-2xl font-bold">Error Handling</h2>
                      {expandedSection === 'errors' ? (
                        <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </div>
                    
                    {expandedSection === 'errors' && (
                      <div className="mt-4">
                        <p>
                          The API uses conventional HTTP response codes to indicate the success or failure of an API request.
                        </p>
                        
                        <div className="mt-4 overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Code
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Description
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  200 - OK
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  The request was successful.
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  400 - Bad Request
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  The request was invalid or missing required parameters.
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  401 - Unauthorized
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  No valid API key provided.
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  403 - Forbidden
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  The API key doesn't have permissions to perform the request.
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  404 - Not Found
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  The requested resource doesn't exist.
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  429 - Too Many Requests
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  Rate limit exceeded.
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  500, 502, 503, 504 - Server Errors
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  Something went wrong on our end.
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        <h3 className="text-xl font-semibold mt-6 mb-2">Error Response Format</h3>
                        <p>
                          Error responses include a JSON object with details about the error:
                        </p>
                        
                        <div className="bg-gray-800 text-white p-4 rounded-md my-4 relative">
                          <button 
                            className="absolute right-2 top-2 text-gray-400 hover:text-white"
                            onClick={() => copyToClipboard(
                              `{
  "error": {
    "type": "invalid_request_error",
    "message": "Missing required field: contentType",
    "param": "contentType",
    "code": "missing_field"
  }
}`,
                              'error-format'
                            )}
                          >
                            {copiedExample === 'error-format' ? (
                              <Check size={18} className="text-green-500" />
                            ) : (
                              <Copy size={18} />
                            )}
                          </button>
                          <pre className="text-sm overflow-auto">{`{
  "error": {
    "type": "invalid_request_error",
    "message": "Missing required field: contentType",
    "param": "contentType",
    "code": "missing_field"
  }
}`}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div id="webhooks" className={`my-8 ${expandedSection === 'webhooks' ? '' : 'opacity-50'}`}>
                    <div 
                      className="flex justify-between items-center cursor-pointer" 
                      onClick={() => toggleSection('webhooks')}
                    >
                      <h2 className="text-2xl font-bold">Webhooks</h2>
                      {expandedSection === 'webhooks' ? (
                        <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </div>
                    
                    {expandedSection === 'webhooks' && (
                      <div className="mt-4">
                        <p>
                          Webhooks allow you to receive real-time notifications when certain events happen in your account. 
                          This is especially useful for long-running processes like content generation or document analysis.
                        </p>
                        
                        <h3 className="text-xl font-semibold mt-6 mb-2">Available Events</h3>
                        <div className="mt-4 overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Event
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Description
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  content.generated
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  Fired when content generation is completed
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  document.analyzed
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  Fired when document analysis is completed
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  profile.analyzed
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  Fired when LinkedIn profile analysis is completed
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  export.completed
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  Fired when content export is completed
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        <h3 className="text-xl font-semibold mt-6 mb-2">Webhook Format</h3>
                        <p>
                          Webhooks are sent as HTTP POST requests to your specified endpoint. The payload includes 
                          information about the event and related resources.
                        </p>
                        
                        <div className="bg-gray-800 text-white p-4 rounded-md my-4 relative">
                          <button 
                            className="absolute right-2 top-2 text-gray-400 hover:text-white"
                            onClick={() => copyToClipboard(
                              `{
  "id": "evt_123456789",
  "type": "content.generated",
  "created": 1619864400,
  "data": {
    "content_id": "cont_abc123xyz",
    "content_type": "Phone Call Scripts",
    "status": "completed"
  }
}`,
                              'webhook-format'
                            )}
                          >
                            {copiedExample === 'webhook-format' ? (
                              <Check size={18} className="text-green-500" />
                            ) : (
                              <Copy size={18} />
                            )}
                          </button>
                          <pre className="text-sm overflow-auto">{`{
  "id": "evt_123456789",
  "type": "content.generated",
  "created": 1619864400,
  "data": {
    "content_id": "cont_abc123xyz",
    "content_type": "Phone Call Scripts",
    "status": "completed"
  }
}`}</pre>
                        </div>
                        
                        <h3 className="text-xl font-semibold mt-6 mb-2">Security</h3>
                        <p>
                          All webhook requests include a signature in the <code>X-Signature</code> header. You should 
                          verify this signature to ensure the webhook came from AI Referral Maximizer.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ApiResourcePage;