import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Linkedin, Building2, User, Info, FileType, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import ProfilePreview from './ProfilePreview';
import { analyzeFileContent } from '../utils/fileAnalyzer';
import { scrapeLinkedInProfile } from '../utils/linkedInScraper';
import RelationshipTypeSelector, { RelationshipType } from './RelationshipTypeSelector';

interface PersonalizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (industry: string, targetAudience: string, businessSize: string, specialRequirements: string, profileData?: any) => void;
}

const PersonalizerModal: React.FC<PersonalizerModalProps> = ({ isOpen, onClose, onApply }) => {
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [businessSize, setBusinessSize] = useState('medium');
  const [specialRequirements, setSpecialRequirements] = useState('');
  
  // Relationship type
  const [relationshipType, setRelationshipType] = useState<RelationshipType | null>(null);
  
  // File upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileUploadComplete, setFileUploadComplete] = useState(false);
  const [fileData, setFileData] = useState<any>(null);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  
  // LinkedIn
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [isScrapingLinkedIn, setIsScrapingLinkedIn] = useState(false);
  const [linkedInData, setLinkedInData] = useState<any>(null);
  const [linkedInError, setLinkedInError] = useState('');
  
  // Choose which tab is active
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'document', 'linkedin'
  
  // Store the last selected tab in local storage
  useEffect(() => {
    if (isOpen) {
      const lastTab = localStorage.getItem('personalizerLastTab');
      if (lastTab) {
        setActiveTab(lastTab);
      }
      
      // Load saved data if available
      const savedPersonalization = localStorage.getItem('personalization');
      if (savedPersonalization) {
        try {
          const data = JSON.parse(savedPersonalization);
          setIndustry(data.industry || '');
          setTargetAudience(data.targetAudience || '');
          setBusinessSize(data.businessSize || 'medium');
          setSpecialRequirements(data.specialRequirements || '');
          setRelationshipType(data.relationshipType || null);
          
          if (data.fileData) {
            setFileData(data.fileData);
            setFileName(data.fileName || 'Uploaded document');
            setFileUploadComplete(true);
          }
          
          if (data.linkedInData) {
            setLinkedInData(data.linkedInData);
            setLinkedInUrl(data.linkedInUrl || '');
          }
        } catch (error) {
          console.error("Error parsing saved personalization data:", error);
        }
      }
    }
  }, [isOpen]);
  
  // Save the active tab when it changes
  useEffect(() => {
    localStorage.setItem('personalizerLastTab', activeTab);
  }, [activeTab]);
  
  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Reset state
    setIsAnalyzing(true);
    setFileUploadComplete(false);
    setFileData(null);
    setFileError('');
    setFileName(file.name);
    
    try {
      // Check file size
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size exceeds the 10MB limit');
      }
      
      // Check file type
      const supportedTypes = ['application/json', 'text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!supportedTypes.includes(file.type) && !file.name.endsWith('.docx') && !file.name.endsWith('.json') && !file.name.endsWith('.txt') && !file.name.endsWith('.pdf')) {
        throw new Error('Unsupported file type. Please upload a JSON, TXT, PDF, or DOCX file.');
      }
      
      // Analyze the file
      const fileContent = await file.text();
      const analysisResults = await analyzeFileContent(fileContent, file.type);
      
      if (analysisResults.error) {
        throw new Error(analysisResults.error);
      }
      
      // Update our form with the analysis results
      if (analysisResults.industry) {
        setIndustry(analysisResults.industry);
      }
      
      if (analysisResults.targetAudience) {
        setTargetAudience(analysisResults.targetAudience);
      }
      
      if (analysisResults.businessSize) {
        setBusinessSize(analysisResults.businessSize);
      }
      
      // Store the full analysis for content generation
      analysisResults.fileName = file.name;
      setFileData(analysisResults);
      setFileUploadComplete(true);
    } catch (error) {
      console.error('Error analyzing file:', error);
      setFileError(error instanceof Error ? error.message : 'Error analyzing file');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Handle LinkedIn URL scraping
  const handleLinkedInScrape = async () => {
    if (!linkedInUrl) {
      setLinkedInError('Please enter a LinkedIn URL');
      return;
    }
    
    // Basic URL validation
    const linkedInPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
    if (!linkedInPattern.test(linkedInUrl)) {
      setLinkedInError('Please enter a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username)');
      return;
    }
    
    setIsScrapingLinkedIn(true);
    setLinkedInError('');
    setLinkedInData(null);
    
    try {
      const profileData = await scrapeLinkedInProfile(linkedInUrl);
      
      if (profileData.error) {
        throw new Error(profileData.error);
      }
      
      // Update our form with the LinkedIn data
      if (profileData.industry) {
        setIndustry(profileData.industry);
      }
      
      // Store the full profile data for content generation
      setLinkedInData(profileData);
    } catch (error) {
      console.error('Error scraping LinkedIn profile:', error);
      setLinkedInError(error instanceof Error ? error.message : 'Error scraping LinkedIn profile');
    } finally {
      setIsScrapingLinkedIn(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Get the analysis data from either LinkedIn or file upload, prioritize LinkedIn
    const analysisData = linkedInData || fileData;
    
    // If we have a relationship type, add it to the special requirements
    let requirements = specialRequirements;
    if (relationshipType) {
      const relationshipInfo = `Relationship Type: ${relationshipType}`;
      requirements = requirements ? `${requirements}\n\n${relationshipInfo}` : relationshipInfo;
    }
    
    // Call the onApply function with the data
    onApply(industry, targetAudience, businessSize, requirements, analysisData);
    
    // Save the data to localStorage for future use
    localStorage.setItem('personalization', JSON.stringify({
      industry,
      targetAudience,
      businessSize,
      specialRequirements: requirements,
      relationshipType,
      fileData,
      fileName,
      linkedInData,
      linkedInUrl
    }));
    
    // Close the modal
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center pb-3 border-b mb-4">
          <h3 className="text-xl font-medium text-gray-900">Personalize Content Generation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div 
            className={`bg-white border p-4 rounded-md cursor-pointer transition-all ${activeTab === 'basic' ? 'border-green-500 shadow-md' : 'border-gray-200 hover:border-green-300'}`}
            onClick={() => setActiveTab('basic')}
          >
            <div className="flex items-center mb-2">
              <User className="h-5 w-5 text-green-500 mr-2" />
              <h4 className="text-md font-medium">Basic Settings</h4>
            </div>
            <p className="text-sm text-gray-600">Set up essential personalization settings manually.</p>
          </div>
          
          <div 
            className={`bg-white border p-4 rounded-md cursor-pointer transition-all ${activeTab === 'document' ? 'border-green-500 shadow-md' : 'border-gray-200 hover:border-green-300'}`}
            onClick={() => setActiveTab('document')}
          >
            <div className="flex items-center mb-2">
              <Upload className="h-5 w-5 text-green-500 mr-2" />
              <h4 className="text-md font-medium">Document Analysis</h4>
            </div>
            <p className="text-sm text-gray-600">Upload company documents for enhanced personalization.</p>
          </div>
          
          <div 
            className={`bg-white border p-4 rounded-md cursor-pointer transition-all ${activeTab === 'linkedin' ? 'border-green-500 shadow-md' : 'border-gray-200 hover:border-green-300'}`}
            onClick={() => setActiveTab('linkedin')}
          >
            <div className="flex items-center mb-2">
              <Linkedin className="h-5 w-5 text-green-500 mr-2" />
              <h4 className="text-md font-medium">LinkedIn Integration</h4>
            </div>
            <p className="text-sm text-gray-600">Import professional context from a LinkedIn profile.</p>
          </div>
        </div>
        
        <div className="mb-6">
          {activeTab === 'basic' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry</label>
                  <input
                    type="text"
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., Technology, Healthcare, Finance"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">Target Audience</label>
                  <input
                    type="text"
                    id="targetAudience"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., Small business owners, IT managers"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="businessSize" className="block text-sm font-medium text-gray-700">Business Size</label>
                  <select
                    id="businessSize"
                    value={businessSize}
                    onChange={(e) => setBusinessSize(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  >
                    <option value="small">Small Business</option>
                    <option value="medium">Medium Business</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                
                <RelationshipTypeSelector
                  selectedRelationship={relationshipType}
                  onChange={setRelationshipType}
                />
              </div>
              
              <div>
                <label htmlFor="specialRequirements" className="block text-sm font-medium text-gray-700">Special Requirements</label>
                <textarea
                  id="specialRequirements"
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  placeholder="Any specific requirements or industry-specific terminology to include"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
              </div>
            </div>
          )}
          
          {activeTab === 'document' && (
            <div>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Upload business materials like brand guidelines, marketing briefs, or client requirements.
                      Our system will analyze them to better tailor your referral content.
                    </p>
                  </div>
                </div>
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json,.txt,.pdf,.docx"
                onChange={handleFileUpload}
              />
              
              {!fileUploadComplete ? (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                      >
                        <span onClick={() => fileInputRef.current?.click()}>Upload a file</span>
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      JSON, TXT, PDF, DOCX up to 10MB
                    </p>
                    
                    {isAnalyzing && (
                      <div className="flex items-center justify-center text-blue-600">
                        <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                        <span>Analyzing document...</span>
                      </div>
                    )}
                    
                    {fileError && (
                      <div className="mt-2 text-sm text-red-600">
                        <AlertCircle className="inline-block h-4 w-4 mr-1" />
                        {fileError}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-1 flex justify-between items-center p-4 border border-green-200 rounded-md bg-green-50">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileType className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-2 flex-1 min-w-0">
                      <p className="text-sm font-medium text-green-700 truncate">
                        {fileName}
                      </p>
                      <p className="text-xs text-green-600">
                        Analysis complete
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      type="button"
                      onClick={() => {
                        setFileUploadComplete(false);
                        setFileData(null);
                        setFileName('');
                      }}
                      className="bg-green-50 rounded-md text-green-700 hover:text-green-500 focus:outline-none focus:bg-green-100 focus:text-green-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
              
              {fileData && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Document Analysis Preview</h4>
                  <div className="overflow-auto max-h-60 border border-gray-200 rounded-md bg-gray-50 p-4">
                    <ProfilePreview profileData={fileData} />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'linkedin' && (
            <div>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Enter a LinkedIn profile URL to extract professional details. This helps tailor the referral content to your specific industry and professional context.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-stretch space-x-2">
                <div className="flex-grow">
                  <label htmlFor="linkedInUrl" className="block text-sm font-medium text-gray-700">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    id="linkedInUrl"
                    value={linkedInUrl}
                    onChange={(e) => setLinkedInUrl(e.target.value)}
                    placeholder="https://www.linkedin.com/in/username"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    disabled={isScrapingLinkedIn}
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleLinkedInScrape}
                    disabled={isScrapingLinkedIn || !linkedInUrl}
                    className={`inline-flex items-center mt-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                      isScrapingLinkedIn || !linkedInUrl 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                  >
                    {isScrapingLinkedIn ? (
                      <>
                        <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze'
                    )}
                  </button>
                </div>
              </div>
              
              {linkedInError && (
                <div className="mt-2 text-sm text-red-600">
                  <AlertCircle className="inline-block h-4 w-4 mr-1" />
                  {linkedInError}
                </div>
              )}
              
              {linkedInData && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">LinkedIn Profile Preview</h4>
                  <div className="overflow-auto max-h-60 border border-gray-200 rounded-md bg-gray-50 p-4">
                    <ProfilePreview profileData={linkedInData} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Summary of current settings */}
        <div className="px-4 py-3 bg-gray-50 border rounded-md mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Current Personalization Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="block text-gray-500">Industry</span>
              <span className="block font-medium text-gray-900">{industry || 'Not set'}</span>
            </div>
            <div>
              <span className="block text-gray-500">Target Audience</span>
              <span className="block font-medium text-gray-900">{targetAudience || 'Not set'}</span>
            </div>
            <div>
              <span className="block text-gray-500">Business Size</span>
              <span className="block font-medium text-gray-900 capitalize">{businessSize}</span>
            </div>
            {relationshipType && (
              <div>
                <span className="block text-gray-500">Relationship Type</span>
                <span className="block font-medium text-gray-900">{RELATIONSHIP_TYPES[relationshipType]?.name || relationshipType}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-3"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizerModal;