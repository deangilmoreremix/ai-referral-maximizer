import React, { useState, useRef, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  RefreshCw, 
  ChevronRight, 
  X, 
  Download, 
  Settings, 
  Database, 
  CheckSquare, 
  Info,
  User,
  Building,
  Briefcase
} from 'lucide-react';
import { generateContent } from '../services/geminiService';
import { generatePdf } from '../utils/pdfGenerator';
import CSVColumnMapper from './CSVColumnMapper';
import CSVBatchPreview from './CSVBatchPreview';

interface CSVColumn {
  name: string;
  index: number;
  mappedTo: string | null;
}

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

interface CSVImporterProps {
  onClose?: () => void;
}

const CSVImporter: React.FC<CSVImporterProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for the import process
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [csvColumns, setCsvColumns] = useState<CSVColumn[]>([]);
  const [mappedLeads, setMappedLeads] = useState<MappedLead[]>([]);
  const [selectedReferralMethod, setSelectedReferralMethod] = useState<string>('');
  const [processingResults, setProcessingResults] = useState<ProcessingResult[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [savedMapping, setSavedMapping] = useState<Record<string, string>>({});
  const [personalizationSettings, setPersonalizationSettings] = useState({
    industry: '',
    targetAudience: '',
    businessSize: 'medium',
    specialRequirements: ''
  });
  
  // Available personalization fields for mapping
  const personalizationFields = [
    { id: 'name', name: 'Name', description: 'Lead\'s full name', required: true },
    { id: 'company', name: 'Company', description: 'Company or organization name' },
    { id: 'title', name: 'Job Title', description: 'Professional title or position' },
    { id: 'email', name: 'Email', description: 'Contact email address' },
    { id: 'phone', name: 'Phone', description: 'Contact phone number' },
    { id: 'relationship', name: 'Relationship', description: 'Your relationship with the lead' },
    { id: 'industry', name: 'Industry', description: 'Lead\'s industry or sector' },
    { id: 'notes', name: 'Notes', description: 'Additional notes about the lead' }
  ];
  
  // Define referral method options (simplified list for this example)
  const referralMethods = [
    { id: 'Phone Call Scripts', name: 'Phone Call Scripts' },
    { id: 'Face-to-Face Meeting Guides', name: 'Face-to-Face Meeting Guides' },
    { id: 'WhatsApp Outreach Campaigns', name: 'WhatsApp Campaigns' },
    { id: 'Email Followup', name: 'Email Follow-up Sequences' },
    { id: 'LinkedIn Outreach', name: 'LinkedIn Outreach Messages' }
  ];
  
  // Function to handle file upload
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Reset states
      setCsvFile(file);
      setCsvData([]);
      setCsvColumns([]);
      setMappedLeads([]);
      setErrorMessage(null);
      
      // Parse the CSV file
      parseCSV(file);
    }
  };
  
  // Function to parse CSV
  const parseCSV = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r\n|\n/);
        
        // Parse CSV lines
        const parsedData: string[][] = lines
          .filter(line => line.trim() !== '')
          .map(line => {
            // Handle quoted values with commas
            const regex = /(?:^|,)(?:"([^"]*(?:""[^"]*)*)"|([^,]*))/g;
            const row: string[] = [];
            let match;
            
            while ((match = regex.exec(line + ',')) !== null) {
              const value = match[1] || match[2] || '';
              row.push(value.trim().replace(/""/g, '"'));
            }
            
            return row;
          });
        
        if (parsedData.length > 1) {
          // Successfully parsed data
          setCsvData(parsedData);
          
          // Extract column headers
          const headers = parsedData[0];
          const cols: CSVColumn[] = headers.map((name, index) => ({
            name,
            index,
            mappedTo: null
          }));
          
          setCsvColumns(cols);
          
          // Try to auto-map columns based on names
          const autoMappedColumns = cols.map(col => {
            const lowerColName = col.name.toLowerCase();
            
            // Check saved mappings first
            if (savedMapping[col.name]) {
              return {
                ...col,
                mappedTo: savedMapping[col.name]
              };
            }
            
            // Auto-map based on column name similarity
            if (/name|contact|person/i.test(lowerColName)) {
              return { ...col, mappedTo: 'name' };
            } else if (/company|organization|business/i.test(lowerColName)) {
              return { ...col, mappedTo: 'company' };
            } else if (/job|title|position|role/i.test(lowerColName)) {
              return { ...col, mappedTo: 'title' };
            } else if (/email|e-mail/i.test(lowerColName)) {
              return { ...col, mappedTo: 'email' };
            } else if (/phone|mobile|cell/i.test(lowerColName)) {
              return { ...col, mappedTo: 'phone' };
            } else if (/relation|connection/i.test(lowerColName)) {
              return { ...col, mappedTo: 'relationship' };
            } else if (/industry|sector/i.test(lowerColName)) {
              return { ...col, mappedTo: 'industry' };
            } else if (/note|comment|remark/i.test(lowerColName)) {
              return { ...col, mappedTo: 'notes' };
            } else {
              return col; // Leave unmapped
            }
          });
          
          setCsvColumns(autoMappedColumns);
          
          // Move to the next step
          setCurrentStep(2);
          setSuccessMessage(`CSV file parsed successfully. ${parsedData.length - 1} leads found.`);
        } else {
          setErrorMessage('The CSV file appears to be empty or invalid.');
        }
      } catch (error) {
        console.error('Error parsing CSV:', error);
        setErrorMessage('Error parsing the CSV file. Please check the format and try again.');
      }
    };
    
    reader.onerror = () => {
      setErrorMessage('Error reading the file. Please try again.');
    };
    
    reader.readAsText(file);
  };
  
  // Handle column mapping
  const handleColumnMappingChange = (columnIndex: number, mappedTo: string | null) => {
    setCsvColumns(prevColumns => 
      prevColumns.map((column, index) => 
        index === columnIndex ? { ...column, mappedTo } : column
      )
    );
  };
  
  // Save current mapping for future use
  const saveCurrentMapping = () => {
    const mapping: Record<string, string> = {};
    csvColumns.forEach(col => {
      if (col.mappedTo) {
        mapping[col.name] = col.mappedTo;
      }
    });
    setSavedMapping(mapping);
    localStorage.setItem('csvColumnMapping', JSON.stringify(mapping));
    setSuccessMessage('Column mapping saved for future imports.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };
  
  // Process the mapped columns and create lead objects
  const processMapping = () => {
    // Check if required fields are mapped
    const nameColumn = csvColumns.find(col => col.mappedTo === 'name');
    if (!nameColumn) {
      setErrorMessage('You must map a column to the "Name" field.');
      return;
    }
    
    try {
      // Transform CSV data into lead objects based on mapping
      const leads: MappedLead[] = [];
      
      // Skip the header row (index 0)
      for (let i = 1; i < csvData.length; i++) {
        const rowData = csvData[i];
        if (rowData.length === 0) continue; // Skip empty rows
        
        const lead: MappedLead = {
          id: `lead-${i}`,
          name: '' // Will be filled below
        };
        
        // Map each column to the corresponding field
        csvColumns.forEach(column => {
          if (column.mappedTo && rowData[column.index] !== undefined) {
            lead[column.mappedTo] = rowData[column.index];
          }
        });
        
        // Check if the lead has a name
        if (lead.name && lead.name.trim() !== '') {
          leads.push(lead);
        }
      }
      
      if (leads.length === 0) {
        setErrorMessage('No valid leads found after mapping.');
        return;
      }
      
      // Set the mapped leads
      setMappedLeads(leads);
      
      // Go to next step
      setCurrentStep(3);
      setSuccessMessage(`${leads.length} leads processed successfully.`);
    } catch (error) {
      console.error('Error processing mapping:', error);
      setErrorMessage('Error processing the mapping. Please check your data and try again.');
    }
  };
  
  // Process batch of leads
  const processBatch = async () => {
    if (!selectedReferralMethod) {
      setErrorMessage('Please select a referral method before proceeding.');
      return;
    }
    
    if (mappedLeads.length === 0) {
      setErrorMessage('No leads found to process.');
      return;
    }
    
    // Initialize processing results
    const initialResults: ProcessingResult[] = mappedLeads.map(lead => ({
      id: lead.id,
      lead,
      content: '',
      status: 'pending'
    }));
    setProcessingResults(initialResults);
    
    // Start processing
    setIsProcessing(true);
    setErrorMessage(null);
    setCurrentStep(4);
    
    // Process leads sequentially to avoid overwhelming the API
    for (let i = 0; i < mappedLeads.length; i++) {
      const lead = mappedLeads[i];
      
      setProcessingResults(prev => 
        prev.map(result => 
          result.id === lead.id 
            ? { ...result, status: 'processing' }
            : result
        )
      );
      
      try {
        // Combine global personalization settings with lead-specific data
        const leadSpecificRequirements = [
          lead.company ? `Works at ${lead.company}` : '',
          lead.title ? `Position: ${lead.title}` : '',
          lead.relationship ? `Relationship: ${lead.relationship}` : '',
          lead.notes ? `Notes: ${lead.notes}` : ''
        ].filter(Boolean).join('. ');
        
        const combinedRequirements = [
          personalizationSettings.specialRequirements,
          leadSpecificRequirements,
          `Personalize this content specifically for ${lead.name}.`
        ].filter(Boolean).join('\n\n');
        
        // Generate personalized content for this lead
        const content = await generateContent({
          contentType: selectedReferralMethod,
          industry: lead.industry || personalizationSettings.industry,
          targetAudience: personalizationSettings.targetAudience,
          businessSize: personalizationSettings.businessSize,
          specialRequirements: combinedRequirements
        });
        
        // Update result
        setProcessingResults(prev => 
          prev.map(result => 
            result.id === lead.id 
              ? { ...result, content, status: 'success' }
              : result
          )
        );
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error generating content for ${lead.name}:`, error);
        
        setProcessingResults(prev => 
          prev.map(result => 
            result.id === lead.id 
              ? { 
                  ...result, 
                  status: 'error',
                  error: error instanceof Error ? error.message : 'Unknown error'
                }
              : result
          )
        );
      }
    }
    
    setIsProcessing(false);
    setSuccessMessage(`Batch processing completed for ${mappedLeads.length} leads.`);
  };
  
  // Export all content
  const exportAllContent = () => {
    // Create a zip file or multi-page PDF with all content
    const successfulResults = processingResults.filter(result => result.status === 'success');
    
    if (successfulResults.length === 0) {
      setErrorMessage('No successfully processed content to export.');
      return;
    }
    
    // For simplicity, we'll just create a single PDF with all content
    const doc = generatePdf(
      `Batch Referral Content - ${selectedReferralMethod}`, 
      selectedReferralMethod, 
      successfulResults.map(result => 
        `## Content for ${result.lead.name}${
          result.lead.company ? ` (${result.lead.company})` : ''
        }\n\n${result.content}\n\n---\n\n`
      ).join('\n')
    );
    
    // Download the PDF
    doc.save(`batch-referral-content-${new Date().toISOString().slice(0, 10)}.pdf`);
    setSuccessMessage('Exported all content as PDF.');
  };
  
  // Reset the import process
  const resetImport = () => {
    setCsvFile(null);
    setCsvData([]);
    setCsvColumns([]);
    setMappedLeads([]);
    setProcessingResults([]);
    setSelectedReferralMethod('');
    setCurrentStep(1);
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsProcessing(false);
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Database className="h-6 w-6 text-green-600 mr-2" />
          CSV Lead Import
        </h1>
        
        <div className="flex space-x-3">
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-sm"
            >
              Close
            </button>
          )}
          <Link 
            to="/app"
            className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-sm"
          >
            Back to App
          </Link>
        </div>
      </div>
      
      {/* Step progress bar */}
      <div className="relative mb-10">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div 
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600 transition-all duration-500"
            style={{ width: `${(currentStep - 1) * 100 / 3}%` }}
          ></div>
        </div>
        <div className="flex justify-between">
          <div className={`text-xs font-medium ${currentStep >= 1 ? 'text-green-600' : 'text-gray-500'}`}>
            Upload CSV
          </div>
          <div className={`text-xs font-medium ${currentStep >= 2 ? 'text-green-600' : 'text-gray-500'}`}>
            Map Columns
          </div>
          <div className={`text-xs font-medium ${currentStep >= 3 ? 'text-green-600' : 'text-gray-500'}`}>
            Select Content
          </div>
          <div className={`text-xs font-medium ${currentStep >= 4 ? 'text-green-600' : 'text-gray-500'}`}>
            Generate & Export
          </div>
        </div>
      </div>
      
      {/* Error and success messages */}
      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
            <button 
              className="ml-auto"
              onClick={() => setErrorMessage(null)}
            >
              <X className="h-5 w-5 text-red-400" />
            </button>
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
            <button 
              className="ml-auto"
              onClick={() => setSuccessMessage(null)}
            >
              <X className="h-5 w-5 text-green-400" />
            </button>
          </div>
        </div>
      )}
      
      {/* Step 1: Upload CSV */}
      {currentStep === 1 && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center mb-6">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h2 className="text-xl font-medium text-gray-900">Upload CSV File</h2>
            <p className="mt-1 text-sm text-gray-600 mb-4">
              Upload a CSV file containing your leads. We'll help you map the columns to generate personalized referral content for each lead.
            </p>
          </div>
          
          <div className="mb-8">
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <div
              className="rounded-md border-2 border-dashed border-gray-300 p-12 text-center cursor-pointer hover:border-green-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Upload className="mx-auto h-12 w-12" />
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900">
                  Click to upload or drag and drop
                </p>
                <p className="mt-1 text-xs text-gray-500">CSV file up to 10MB</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">CSV Format Tips</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Include a header row with column names</li>
                    <li>Include at least a column for contact name</li>
                    <li>Additional useful columns: company, title, email, phone, relationship, industry</li>
                    <li>Make sure your CSV is UTF-8 encoded</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Step 2: Map Columns */}
      {currentStep === 2 && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-900">Map CSV Columns</h2>
            <p className="mt-1 text-sm text-gray-600">
              Map your CSV columns to the appropriate fields. This helps us personalize the content for each lead.
            </p>
          </div>
          
          <CSVColumnMapper 
            columns={csvColumns}
            personalizationFields={personalizationFields}
            onMappingChange={handleColumnMappingChange}
            csvData={csvData}
          />
          
          <div className="mt-6 flex justify-between">
            <button
              onClick={saveCurrentMapping}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Save Mapping
            </button>
            <div>
              <button
                onClick={() => setCurrentStep(1)}
                className="mr-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Back
              </button>
              <button
                onClick={processMapping}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Continue
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Step 3: Select Content Type & Personalization */}
      {currentStep === 3 && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-900">Select Content Settings</h2>
            <p className="mt-1 text-sm text-gray-600">
              Choose the referral method and customize personalization settings for your leads.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">Select Referral Method</h3>
              <select
                className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                value={selectedReferralMethod}
                onChange={(e) => setSelectedReferralMethod(e.target.value)}
              >
                <option value="">Select a referral method...</option>
                {referralMethods.map(method => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
              
              {/* Preview of mapped leads */}
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                  <User className="mr-2 h-5 w-5 text-gray-500" />
                  Mapped Leads Preview
                </h3>
                <div className="bg-gray-50 rounded-md border border-gray-200 p-3 max-h-64 overflow-y-auto">
                  {mappedLeads.length > 0 ? (
                    <div className="space-y-2">
                      {mappedLeads.slice(0, 5).map((lead, index) => (
                        <div key={index} className="border-b border-gray-200 pb-2 last:border-b-0">
                          <p className="font-medium text-gray-800">{lead.name}</p>
                          <div className="flex flex-wrap gap-x-3 text-xs text-gray-600">
                            {lead.company && (
                              <span className="flex items-center">
                                <Building className="mr-1 h-3 w-3" />
                                {lead.company}
                              </span>
                            )}
                            {lead.title && (
                              <span className="flex items-center">
                                <Briefcase className="mr-1 h-3 w-3" />
                                {lead.title}
                              </span>
                            )}
                            {lead.relationship && (
                              <span>Relationship: {lead.relationship}</span>
                            )}
                          </div>
                        </div>
                      ))}
                      {mappedLeads.length > 5 && (
                        <div className="text-center text-xs text-gray-500">
                          +{mappedLeads.length - 5} more leads
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">No leads available</div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">
                <Settings className="inline mr-2 h-5 w-5 text-gray-500" />
                Global Personalization Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={personalizationSettings.industry}
                    onChange={(e) => setPersonalizationSettings({...personalizationSettings, industry: e.target.value})}
                    placeholder="e.g., Technology, Healthcare, Finance"
                    className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    This will be used if a lead's industry is not specified.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={personalizationSettings.targetAudience}
                    onChange={(e) => setPersonalizationSettings({...personalizationSettings, targetAudience: e.target.value})}
                    placeholder="e.g., Small business owners, IT managers"
                    className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Business Size
                  </label>
                  <select
                    value={personalizationSettings.businessSize}
                    onChange={(e) => setPersonalizationSettings({...personalizationSettings, businessSize: e.target.value})}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  >
                    <option value="small">Small Business</option>
                    <option value="medium">Medium Business</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Special Requirements
                  </label>
                  <textarea
                    value={personalizationSettings.specialRequirements}
                    onChange={(e) => setPersonalizationSettings({...personalizationSettings, specialRequirements: e.target.value})}
                    placeholder="Any specific requirements for all content"
                    rows={3}
                    className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    These requirements will apply to all generated content, in addition to lead-specific personalization.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Back
            </button>
            <button
              onClick={processBatch}
              disabled={!selectedReferralMethod}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                !selectedReferralMethod 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              }`}
            >
              Generate Personalized Content
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Step 4: Process and Export */}
      {currentStep === 4 && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-900">Batch Processing</h2>
            <p className="mt-1 text-sm text-gray-600">
              Generating personalized {selectedReferralMethod} for {mappedLeads.length} leads.
            </p>
          </div>
          
          <CSVBatchPreview 
            results={processingResults}
            isProcessing={isProcessing}
            referralMethod={selectedReferralMethod}
          />
          
          <div className="mt-8 border-t border-gray-200 pt-6 flex justify-between">
            <div className="flex items-center">
              {isProcessing ? (
                <div className="flex items-center text-blue-600">
                  <RefreshCw className="animate-spin mr-2 h-5 w-5" />
                  <span>Processing leads...</span>
                </div>
              ) : (
                <div className="text-gray-700">
                  {processingResults.filter(r => r.status === 'success').length} of {processingResults.length} successful
                </div>
              )}
            </div>
            
            <div>
              <button
                onClick={resetImport}
                className="mr-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Start Over
              </button>
              <button
                onClick={exportAllContent}
                disabled={isProcessing || processingResults.filter(r => r.status === 'success').length === 0}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  isProcessing || processingResults.filter(r => r.status === 'success').length === 0
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                }`}
              >
                <Download className="mr-1.5 h-4 w-4" />
                Export All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVImporter;