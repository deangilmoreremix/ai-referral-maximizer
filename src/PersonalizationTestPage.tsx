import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, Linkedin, FileText, Check, AlertCircle, RefreshCw, User, Building2, MapPin, Briefcase, Award, GraduationCap, Clock, FileCheck, Sparkles, File, FileX, Clipboard, Target, MessageSquare, CreditCard, Send, Info } from 'lucide-react';
import { analyzeFileContent } from './utils/fileAnalyzer';
import { scrapeLinkedInProfile } from './utils/linkedInScraper';
import { generateContent } from './services/openAIService';

type TestMode = 'document' | 'linkedin';

interface TestResult {
  success: boolean;
  data: any;
  error?: string;
  startTime?: number;
  endTime?: number;
}

interface LogEntry {
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  timestamp: number;
}

const PersonalizationTestPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TestMode>('document');
  const [testFile, setTestFile] = useState<File | null>(null);
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add a log entry
  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    setLogs(prevLogs => [...prevLogs, { message, type, timestamp: Date.now() }]);
  };

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTestFile(file);
      addLog(`File selected: ${file.name} (${file.type})`, 'info');
    }
  };

  // Run document analysis test
  const runDocumentTest = async () => {
    if (!testFile) {
      addLog('No file selected for testing', 'error');
      return;
    }

    try {
      setIsProcessing(true);
      clearLogs();
      setTestResult(null);
      
      addLog(`Starting analysis of file: ${testFile.name}`, 'info');
      const startTime = Date.now();
      
      // Read the file content
      addLog('Reading file content...', 'info');
      const fileContent = await readFileAsText(testFile);
      addLog(`File content loaded (${fileContent.length} characters)`, 'success');
      
      // Analyze the content
      addLog('Beginning document analysis...', 'info');
      const analysisResults = await analyzeFileContent(fileContent, testFile.type);
      const endTime = Date.now();
      
      addLog('Analysis completed successfully', 'success');
      setTestResult({
        success: true,
        data: analysisResults,
        startTime,
        endTime
      });
      
      // Log key findings
      if (analysisResults.industry) {
        addLog(`Identified industry: ${analysisResults.industry}`, 'success');
      }
      
      if (analysisResults.targetAudience) {
        addLog(`Identified target audience: ${analysisResults.targetAudience}`, 'success');
      }
      
      if (analysisResults.businessSize) {
        addLog(`Identified business size: ${analysisResults.businessSize}`, 'success');
      }
      
      if (analysisResults.keyPoints && analysisResults.keyPoints.length > 0) {
        addLog(`Extracted ${analysisResults.keyPoints.length} key points`, 'success');
      }
      
    } catch (error) {
      console.error('Document analysis test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Analysis failed: ${errorMessage}`, 'error');

      setTestResult({
        success: false,
        data: null,
        error: errorMessage
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Run LinkedIn scraping test
  const runLinkedInTest = async () => {
    if (!linkedInUrl) {
      addLog('No LinkedIn URL provided for testing', 'error');
      return;
    }

    // Basic URL validation
    if (!linkedInUrl.includes('linkedin.com/in/')) {
      addLog('Invalid LinkedIn URL format. Must be a public profile URL (linkedin.com/in/...)', 'error');
      return;
    }

    try {
      setIsProcessing(true);
      clearLogs();
      setTestResult(null);
      
      addLog(`Starting LinkedIn profile scraping for URL: ${linkedInUrl}`, 'info');
      const startTime = Date.now();
      
      // Call the scraper
      addLog('Calling LinkedIn scraper edge function...', 'info');
      const scrapedData = await scrapeLinkedInProfile(linkedInUrl);
      const endTime = Date.now();
      
      if (scrapedData.error) {
        addLog(`Scraping encountered an issue: ${scrapedData.error}`, 'error');
        setTestResult({
          success: false,
          data: scrapedData,
          error: scrapedData.error,
          startTime,
          endTime
        });
        return;
      }
      
      addLog('LinkedIn profile scraped successfully', 'success');
      setTestResult({
        success: true,
        data: scrapedData,
        startTime,
        endTime
      });
      
      // Log key findings
      if (scrapedData.name) {
        addLog(`Profile name: ${scrapedData.name}`, 'success');
      }
      
      if (scrapedData.headline) {
        addLog(`Headline: ${scrapedData.headline}`, 'success');
      }
      
      if (scrapedData.companyName) {
        addLog(`Company: ${scrapedData.companyName}`, 'success');
      }
      
      if (scrapedData.skills && scrapedData.skills.length > 0) {
        addLog(`Extracted ${scrapedData.skills.length} skills`, 'success');
      }
      
    } catch (error) {
      console.error('LinkedIn scraping test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Scraping failed: ${errorMessage}`, 'error');

      setTestResult({
        success: false,
        data: null,
        error: errorMessage
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to read file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      
      reader.onerror = () => {
        reject(reader.error || new Error("Unknown error reading file"));
      };
      
      if (file.type === 'application/json' || file.type.includes('text/') || file.type.includes('application/vnd.openxmlformats-officedocument')) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  };

  // Trigger file dialog
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Reset test
  const resetTest = () => {
    setTestResult(null);
    setTestFile(null);
    setLinkedInUrl('');
    clearLogs();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Copy results to clipboard
  const copyResultsToClipboard = () => {
    if (!testResult) return;
    
    const textToCopy = JSON.stringify(testResult.data, null, 2);
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        addLog('Test results copied to clipboard', 'success');
      })
      .catch(err => {
        addLog(`Failed to copy results: ${err.message}`, 'error');
      });
  };

  // Format time for display
  const formatExecutionTime = (startTime?: number, endTime?: number) => {
    if (!startTime || !endTime) return 'N/A';
    return `${(endTime - startTime) / 1000} seconds`;
  };

  // Generate test document for testing using GPT-5 APIs
  const generateTestDocument = async (type: 'tech' | 'healthcare' | 'finance') => {
    try {
      setIsProcessing(true);
      addLog(`Generating ${type} industry document using GPT-5 API...`, 'info');

      // Define content type based on industry
      const contentTypeMap = {
        tech: 'Technical Requirements Document',
        healthcare: 'Healthcare Services Proposal',
        finance: 'Financial Services Overview'
      };

      const contentType = contentTypeMap[type];

      // Generate content using the OpenAI service
      const generatedContent = await generateContent({
        contentType,
        industry: type,
        targetAudience: type === 'tech' ? 'CTOs and IT Directors' :
                      type === 'healthcare' ? 'Healthcare administrators' :
                      'Financial advisors and executives',
        businessSize: 'medium',
        specialRequirements: `Create a comprehensive ${type} industry document with realistic details, key requirements, and industry-specific terminology.`,
        model: 'gpt-5'
      });

      addLog(`Successfully generated ${type} document (${generatedContent.length} characters)`, 'success');

      const blob = new Blob([generatedContent], { type: 'text/plain' });
      const file = Object.assign(blob, {
        name: `generated-${type}-document.txt`,
        lastModified: Date.now(),
      }) as File;

      setTestFile(file);
      addLog(`Created test file: generated-${type}-document.txt`, 'success');

    } catch (error) {
      console.error('Error generating test document:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Failed to generate ${type} document: ${errorMessage}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="text-gray-500 hover:text-gray-700 mr-4">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Personalization System Test</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Tab navigation */}
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'document'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('document')}
            >
              <FileText size={16} className="inline mr-2" />
              Document Analysis Test
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'linkedin'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('linkedin')}
            >
              <Linkedin size={16} className="inline mr-2" />
              LinkedIn Scraper Test
            </button>
          </div>

          {/* Content area */}
          <div className="p-6">
            {activeTab === 'document' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Document Analysis Testing</h2>
                <p className="text-gray-600 mb-4">
                  Upload a document to test the document analysis functionality, or generate sample documents using GPT-5 APIs. The system will extract industry, audience, key points, and other information.
                </p>

                <div className="mb-6">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json,.txt,.docx,.pdf,.doc"
                    className="hidden"
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <button
                      onClick={triggerFileUpload}
                      className="px-4 py-2 bg-white border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50 text-sm text-gray-600 focus:outline-none flex items-center justify-center flex-1"
                    >
                      <Upload size={18} className="mr-2 text-blue-600" />
                      {testFile ? testFile.name : "Click to upload document"}
                    </button>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => generateTestDocument('tech')}
                        disabled={isProcessing}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          isProcessing
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                        }`}
                      >
                        {isProcessing ? 'Generating...' : 'Tech Sample'}
                      </button>
                      <button
                        onClick={() => generateTestDocument('healthcare')}
                        disabled={isProcessing}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          isProcessing
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                      >
                        {isProcessing ? 'Generating...' : 'Healthcare Sample'}
                      </button>
                      <button
                        onClick={() => generateTestDocument('finance')}
                        disabled={isProcessing}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          isProcessing
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                      >
                        {isProcessing ? 'Generating...' : 'Finance Sample'}
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={runDocumentTest}
                    disabled={!testFile || isProcessing}
                    className={`w-full py-2 px-4 rounded-md text-white text-sm font-medium ${
                      !testFile || isProcessing
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Analyzing Document...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <FileCheck size={16} className="mr-2" />
                        Run Document Analysis
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'linkedin' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">LinkedIn Scraper Testing</h2>
                <p className="text-gray-600 mb-4">
                  Enter a public LinkedIn profile URL to test the profile scraping functionality. The system will extract profile information using the Supabase Edge Function.
                </p>

                <div className="mb-6">
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={linkedInUrl}
                      onChange={(e) => setLinkedInUrl(e.target.value)}
                      placeholder="https://www.linkedin.com/in/username"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      disabled={isProcessing}
                    />
                    
                    {/* Sample LinkedIn URLs */}
                    <button
                      onClick={() => setLinkedInUrl('https://www.linkedin.com/in/satyanadella/')}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-100"
                    >
                      Sample 1
                    </button>
                    <button
                      onClick={() => setLinkedInUrl('https://www.linkedin.com/in/williamhgates/')}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-100"
                    >
                      Sample 2
                    </button>
                  </div>
                  
                  <button
                    onClick={runLinkedInTest}
                    disabled={!linkedInUrl || isProcessing}
                    className={`w-full py-2 px-4 rounded-md text-white text-sm font-medium ${
                      !linkedInUrl || isProcessing
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Scraping Profile...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Linkedin size={16} className="mr-2" />
                        Run LinkedIn Scraper
                      </span>
                    )}
                  </button>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info size={18} className="text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        <span className="font-bold">Important Note:</span> LinkedIn scraping requires the Supabase Edge Function to be deployed and properly configured. This test will verify if the edge function is working correctly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Log section */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-medium text-gray-900">Process Log</h3>
                <button
                  onClick={clearLogs}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
              <div className="bg-gray-800 rounded-md text-white p-3 h-40 overflow-y-auto font-mono text-xs">
                {logs.length === 0 ? (
                  <div className="text-gray-400 italic">Log messages will appear here during testing</div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className={`mb-1 ${
                      log.type === 'success' ? 'text-green-400' : 
                      log.type === 'error' ? 'text-red-400' : 
                      log.type === 'warning' ? 'text-yellow-400' : 
                      'text-gray-300'
                    }`}>
                      [{new Date(log.timestamp).toLocaleTimeString()}] {log.message}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Results section */}
            {testResult && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-medium text-gray-900">Test Results</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={resetTest}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                    >
                      Reset
                    </button>
                    <button
                      onClick={copyResultsToClipboard}
                      className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded flex items-center"
                    >
                      <Clipboard size={12} className="mr-1" />
                      Copy
                    </button>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-md p-4">
                  <div className="flex items-center mb-4">
                    {testResult.success ? (
                      <div className="bg-green-100 text-green-700 rounded-full p-1">
                        <Check size={16} />
                      </div>
                    ) : (
                      <div className="bg-red-100 text-red-700 rounded-full p-1">
                        <AlertCircle size={16} />
                      </div>
                    )}
                    <div className="ml-2">
                      <span className={`font-medium ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                        {testResult.success ? 'Test Completed Successfully' : 'Test Failed'}
                      </span>
                      <span className="text-gray-500 text-xs ml-2">
                        Execution time: {formatExecutionTime(testResult.startTime, testResult.endTime)}
                      </span>
                    </div>
                  </div>

                  {activeTab === 'document' && testResult.data && (
                    <div className="space-y-4">
                      {/* Document Analysis Results */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="border rounded-md p-3 bg-gray-50">
                          <div className="text-xs font-medium text-gray-500 mb-1">Identified Industry</div>
                          <div className="flex items-center">
                            <Building2 size={14} className="text-blue-600 mr-1" />
                            <span className="text-sm font-medium">
                              {testResult.data.industry || 'Not detected'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="border rounded-md p-3 bg-gray-50">
                          <div className="text-xs font-medium text-gray-500 mb-1">Target Audience</div>
                          <div className="flex items-center">
                            <Target size={14} className="text-blue-600 mr-1" />
                            <span className="text-sm font-medium">
                              {testResult.data.targetAudience || 'Not detected'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="border rounded-md p-3 bg-gray-50">
                          <div className="text-xs font-medium text-gray-500 mb-1">Business Size</div>
                          <div className="flex items-center">
                            <Building2 size={14} className="text-blue-600 mr-1" />
                            <span className="text-sm font-medium">
                              {testResult.data.businessSize || 'Not detected'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {testResult.data.keyPoints && testResult.data.keyPoints.length > 0 && (
                          <div className="border rounded-md p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <FileCheck size={14} className="mr-1.5 text-blue-600" />
                              Key Points ({testResult.data.keyPoints.length})
                            </h4>
                            <ul className="list-disc pl-4 text-sm space-y-1">
                              {testResult.data.keyPoints.map((point: string, idx: number) => (
                                <li key={idx}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {testResult.data.topics && testResult.data.topics.length > 0 && (
                          <div className="border rounded-md p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <MessageSquare size={14} className="mr-1.5 text-blue-600" />
                              Topics ({testResult.data.topics.length})
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {testResult.data.topics.map((topic: string, idx: number) => (
                                <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Extracted Information</h4>
                        <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-auto max-h-60 border">
                          {JSON.stringify(testResult.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {activeTab === 'linkedin' && testResult.data && (
                    <div className="space-y-4">
                      {/* LinkedIn Profile Results */}
                      {testResult.data.name && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b pb-4">
                          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={24} className="text-gray-500" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold">{testResult.data.name}</h3>
                            {testResult.data.headline && (
                              <p className="text-gray-600">{testResult.data.headline}</p>
                            )}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                              {testResult.data.companyName && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Briefcase size={12} className="mr-1" />
                                  {testResult.data.companyName}
                                </div>
                              )}
                              {testResult.data.location && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <MapPin size={12} className="mr-1" />
                                  {testResult.data.location}
                                </div>
                              )}
                              {testResult.data.industry && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Building2 size={12} className="mr-1" />
                                  {testResult.data.industry}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {testResult.data.skills && testResult.data.skills.length > 0 && (
                          <div className="border rounded-md p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <Award size={14} className="mr-1.5 text-blue-600" />
                              Skills ({testResult.data.skills.length})
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {testResult.data.skills.map((skill: string, idx: number) => (
                                <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {testResult.data.education && (
                          <div className="border rounded-md p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <GraduationCap size={14} className="mr-1.5 text-blue-600" />
                              Education
                            </h4>
                            <p className="text-sm">{testResult.data.education}</p>
                          </div>
                        )}
                      </div>

                      {testResult.data.description && (
                        <div className="border rounded-md p-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">About / Description</h4>
                          <p className="text-sm text-gray-600">{testResult.data.description}</p>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Complete Profile Data</h4>
                        <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-auto max-h-60 border">
                          {JSON.stringify(testResult.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Integration with Content Generation */}
            {testResult && testResult.success && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-md font-medium text-gray-900 mb-2">Test Content Generation</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Use the extracted data to generate a sample piece of content and see how personalization affects the output.
                </p>
                
                <button className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium flex items-center justify-center">
                  <Sparkles size={16} className="mr-2" />
                  Generate Sample Content with This Data
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
          <h2 className="text-lg font-medium text-blue-800 mb-3">About This Test Page</h2>
          <p className="text-blue-700 mb-3">
            This page allows you to test the personalization systems that power the AI Sales Maximizer. You can test both document analysis and LinkedIn profile scraping to verify they're working correctly.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white p-4 rounded border border-blue-200">
              <h3 className="text-md font-medium text-gray-800 mb-2 flex items-center">
                <File size={16} className="mr-2 text-blue-600" />
                Document Analysis Testing
              </h3>
              <p className="text-sm text-gray-600">
                Upload business documents, briefs, or requirements to test how well the system extracts key information like industry, audience, and requirements.
              </p>
            </div>
            <div className="bg-white p-4 rounded border border-blue-200">
              <h3 className="text-md font-medium text-gray-800 mb-2 flex items-center">
                <Linkedin size={16} className="mr-2 text-blue-600" />
                LinkedIn Profile Testing
              </h3>
              <p className="text-sm text-gray-600">
                Enter LinkedIn profile URLs to test how the system scrapes and extracts professional information for content personalization.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalizationTestPage;