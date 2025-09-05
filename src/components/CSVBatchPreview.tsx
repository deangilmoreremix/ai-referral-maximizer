import React, { useState } from 'react';
import { CheckCircle, X, AlertCircle, RefreshCw, Download, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { generatePdf } from '../utils/pdfGenerator';

interface MappedLead {
  id: string;
  name: string;
  company?: string;
  title?: string;
  email?: string;
  phone?: string;
  relationship?: string;
  industry?: string;
  notes?: string;
  [key: string]: string | undefined;
}

interface ProcessingResult {
  id: string;
  lead: MappedLead;
  content: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
}

interface CSVBatchPreviewProps {
  results: ProcessingResult[];
  isProcessing: boolean;
  referralMethod: string;
}

const CSVBatchPreview: React.FC<CSVBatchPreviewProps> = ({ 
  results, 
  isProcessing,
  referralMethod 
}) => {
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const [visibleResults, setVisibleResults] = useState<number>(10);
  
  // Toggle expanded view for a result
  const toggleExpanded = (id: string) => {
    setExpandedResult(expandedResult === id ? null : id);
  };
  
  // Download individual result
  const downloadResult = (result: ProcessingResult) => {
    if (result.status !== 'success') return;
    
    const doc = generatePdf(
      `${referralMethod} for ${result.lead.name}`,
      referralMethod,
      result.content
    );
    
    doc.save(`${result.lead.name.replace(/\s+/g, '-').toLowerCase()}-${referralMethod.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };
  
  // Show more results
  const showMoreResults = () => {
    setVisibleResults(prev => prev + 10);
  };
  
  // Calculate statistics
  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const pendingCount = results.filter(r => r.status === 'pending' || r.status === 'processing').length;
  const progressPercent = results.length > 0 
    ? ((successCount + errorCount) / results.length) * 100
    : 0;
  
  return (
    <div>
      {/* Progress bar */}
      {isProcessing && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Processing...</span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
            <div 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <RefreshCw className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-gray-700">Total</h3>
            <p className="text-2xl font-semibold text-gray-900">{results.length}</p>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 flex items-center">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-gray-700">Success</h3>
            <p className="text-2xl font-semibold text-green-600">{successCount}</p>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 flex items-center">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-gray-700">Failed</h3>
            <p className="text-2xl font-semibold text-red-600">{errorCount}</p>
          </div>
        </div>
      </div>
      
      {/* Results list */}
      <div className="space-y-3">
        {results.slice(0, visibleResults).map((result) => (
          <div 
            key={result.id} 
            className={`bg-white shadow-sm rounded-lg border ${
              result.status === 'success' ? 'border-green-200' :
              result.status === 'error' ? 'border-red-200' :
              'border-gray-200'
            } overflow-hidden transition-all duration-200`}
          >
            <div 
              className="px-4 py-4 sm:px-6 flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpanded(result.id)}
            >
              <div className="flex items-center">
                {result.status === 'pending' && (
                  <div className="bg-gray-100 p-1.5 rounded-full mr-3">
                    <RefreshCw className="h-5 w-5 text-gray-400" />
                  </div>
                )}
                {result.status === 'processing' && (
                  <div className="bg-blue-100 p-1.5 rounded-full mr-3">
                    <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                  </div>
                )}
                {result.status === 'success' && (
                  <div className="bg-green-100 p-1.5 rounded-full mr-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                )}
                {result.status === 'error' && (
                  <div className="bg-red-100 p-1.5 rounded-full mr-3">
                    <X className="h-5 w-5 text-red-600" />
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {result.lead.name}
                  </h3>
                  <div className="text-xs text-gray-500 flex flex-wrap gap-x-3">
                    {result.lead.company && <span>{result.lead.company}</span>}
                    {result.lead.title && <span>{result.lead.title}</span>}
                    {result.lead.email && <span>{result.lead.email}</span>}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                {result.status === 'success' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadResult(result);
                    }}
                    className="mr-3 p-1.5 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
                    title="Download"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                )}
                {expandedResult === result.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>
            
            {/* Expanded content */}
            {expandedResult === result.id && (
              <div className="px-4 py-4 sm:px-6 border-t border-gray-200 bg-gray-50">
                {result.status === 'success' && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Eye className="h-4 w-4 mr-1 text-gray-500" />
                      Content Preview
                    </h4>
                    <div className="bg-white p-3 rounded border border-gray-200 max-h-64 overflow-y-auto">
                      <div className="prose prose-sm max-w-none">
                        {result.content.split('\n').map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => downloadResult(result)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Download className="mr-1 h-3.5 w-3.5" />
                        Download PDF
                      </button>
                    </div>
                  </div>
                )}
                
                {result.status === 'error' && (
                  <div className="bg-red-50 p-3 rounded border border-red-200">
                    <h4 className="text-sm font-medium text-red-800 mb-1">Error</h4>
                    <p className="text-sm text-red-700">
                      {result.error || 'An unknown error occurred while processing this lead.'}
                    </p>
                  </div>
                )}
                
                {(result.status === 'pending' || result.status === 'processing') && (
                  <div className="bg-blue-50 p-3 rounded border border-blue-200 text-center">
                    <RefreshCw className="h-6 w-6 text-blue-500 mx-auto mb-2 animate-spin" />
                    <p className="text-sm text-blue-700">
                      {result.status === 'processing' 
                        ? 'Currently processing this lead...'
                        : 'Waiting to process this lead...'}
                    </p>
                  </div>
                )}
                
                {/* Lead details */}
                <div className="mt-4 bg-white p-3 rounded border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Lead Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(result.lead)
                      .filter(([key]) => key !== 'id')
                      .map(([key, value]) => value && (
                        <div key={key} className="flex">
                          <span className="font-medium text-gray-700 mr-1">{key}:</span>
                          <span className="text-gray-900">{value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Show more button */}
      {results.length > visibleResults && (
        <div className="mt-4 text-center">
          <button
            onClick={showMoreResults}
            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Show {Math.min(10, results.length - visibleResults)} more results
          </button>
        </div>
      )}
      
      {!isProcessing && results.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <RefreshCw className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No processing results yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start the batch processing to generate content for your leads.
          </p>
        </div>
      )}
    </div>
  );
};

export default CSVBatchPreview;