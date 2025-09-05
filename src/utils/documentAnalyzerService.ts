/**
 * Document Analyzer Service
 * 
 * This service provides functionality to analyze documents using the Supabase Edge Function
 */

import { Buffer } from 'buffer';
import { TextDecoder } from 'text-encoding';

interface AnalysisResult {
  wordCount: number;
  topKeywords: string[];
  keyPoints: string[];
  topics: string[];
  industry: string | null;
  businessSize: string | null;
  targetAudience: string | null;
  tone: string | null;
  competitors: string[] | null;
  error?: string;
}

/**
 * Analyze a document using the Supabase Edge Function
 * 
 * @param file File to analyze
 * @returns Analysis results
 */
export async function analyzeDocument(file: File): Promise<AnalysisResult> {
  try {
    console.log(`Analyzing document: ${file.name} (${file.type})`);
    
    // Check if Supabase URL is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    // Improved validation to check for actual valid Supabase URL pattern
    // Look for the pattern: https://{project-id}.supabase.co
    const validSupabaseUrlPattern = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i;
    
    if (!supabaseUrl || !validSupabaseUrlPattern.test(supabaseUrl)) {
      console.error('Invalid Supabase URL:', supabaseUrl);
      throw new Error('Supabase URL is not properly configured. URL must match pattern: https://{project-id}.supabase.co');
    }
    
    // Check if Supabase anon key is available
    if (!supabaseAnonKey) {
      throw new Error('Supabase anonymous key is not defined in environment variables');
    }
    
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase anon key available:', !!supabaseAnonKey);
    
    const apiUrl = `${supabaseUrl}/functions/v1/analyze-document`;
    console.log('Calling Edge Function with URL:', apiUrl);
    
    // Create form data with the file
    const formData = new FormData();
    formData.append('file', file);
    
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    console.log('Making request to analyze-document edge function...');
    
    // Make the request to the edge function
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: formData,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('Edge Function response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = `Server responded with ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
        console.error('Error data from server:', errorData);
      } catch (e) {
        console.error('Could not parse error response as JSON');
      }
      
      // If the server is not available, fall back to client-side analysis
      if (response.status === 404 || response.status === 502 || response.status === 503) {
        console.log('Edge function unavailable, falling back to client-side analysis');
        return analyzeDocumentClientSide(file);
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Document analysis results:', data);
    
    // Validate the response and clean up potential PDF artifacts
    if (!data) {
      throw new Error('Invalid response from server: data is missing');
    }
    
    // Clean any PDF artifacts that might have made it through
    if (data.keyPoints && Array.isArray(data.keyPoints)) {
      data.keyPoints = filterPdfArtifacts(data.keyPoints);
    }
    
    if (data.topics && Array.isArray(data.topics)) {
      data.topics = filterPdfArtifacts(data.topics);
    }
    
    return data;
  } catch (error) {
    console.error("Error analyzing document with edge function:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
    // Fall back to client-side analysis
    console.log('Falling back to client-side document analysis');
    return analyzeDocumentClientSide(file);
  }
}

/**
 * Filter out PDF artifacts from text arrays
 */
function filterPdfArtifacts(items: string[]): string[] {
  if (!items || !Array.isArray(items)) return [];
  
  // Patterns that indicate PDF structure rather than content
  const pdfArtifactPatterns = [
    /\/Type\s+\/\w+/i,
    /\/StructElem/i,
    /\/P\s+\/\w+/i,
    /\/Pg\s+/i,
    /\/OBJR/i,
    /\/MCID/i,
    /^\d+\s+\d+\s+\w+$/,
    /^\d+\s+\d+\s+R$/,
    /^\d+\s+\d+\s+obj$/,
    /endobj/i,
    /stream/i,
    /endstream/i,
    /xref/i,
    /trailer/i,
    /startxref/i,
    /\/S\s+\/\w+/i,
    /\/K\s+\[/i,
    /^\d+\s+\d+$/
  ];
  
  // Patterns that indicate a string is likely just numbers or technical data
  const technicalDataPatterns = [
    /^[\d\s.]+$/,
    /^[a-f0-9\s]{10,}$/i,
    /^\d+\.\d+\.\d+\.\d+$/,
    /^[-\d\s.]+$/
  ];
  
  return items
    .filter(item => {
      // Skip items that are too short or empty
      if (!item || typeof item !== 'string' || item.trim().length < 10) {
        return false;
      }
      
      // Skip items that match PDF artifact patterns
      if (pdfArtifactPatterns.some(pattern => pattern.test(item))) {
        return false;
      }
      
      // Skip items that are just technical data
      if (technicalDataPatterns.some(pattern => pattern.test(item))) {
        return false;
      }
      
      // Skip items that have too many numbers or special characters
      const nonAlphaRatio = (item.replace(/[a-zA-Z\s]/g, '').length / item.length);
      if (nonAlphaRatio > 0.4) {
        return false;
      }
      
      return true;
    })
    .map(item => {
      // Further clean the item to remove any PDF artifacts
      return cleanupPdfItem(item);
    })
    .filter(Boolean);
}

/**
 * Clean up a PDF item to remove any artifacts
 */
function cleanupPdfItem(item: string): string {
  if (!item) return '';
  
  return item
    // Remove any PDF operators or markers
    .replace(/\/[A-Za-z0-9]+/g, '')
    // Remove numeric IDs and references
    .replace(/\d+\s\d+\s[R]/g, '')
    // Remove object markers
    .replace(/(endobj|obj|stream|endstream)/gi, '')
    // Clean up encoding references
    .replace(/encoding/gi, '')
    // Remove any sequences of spaces, line breaks, etc.
    .replace(/\s+/g, ' ')
    // Trim whitespace
    .trim();
}

/**
 * Analyze document client-side as a fallback when the edge function is unavailable
 * 
 * @param file File to analyze
 * @returns Analysis results
 */
async function analyzeDocumentClientSide(file: File): Promise<AnalysisResult> {
  try {
    console.log('Analyzing document client-side:', file.name);
    
    // Fallback to client-side analysis from fileAnalyzer
    const { analyzeFileContent } = await import('./fileAnalyzer');
    
    // Read file content - use appropriate method based on file type
    let fileContent: string;
    
    if (file.type === 'application/pdf') {
      fileContent = await extractTextFromPdf(file);
    } else if (file.type.includes('text/') || 
               file.type === 'application/json' || 
               file.type.includes('application/vnd.openxmlformats')) {
      fileContent = await file.text();
    } else {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
    
    if (!fileContent || fileContent.trim().length < 10) {
      return {
        wordCount: 0,
        topKeywords: [],
        keyPoints: ["File content could not be properly extracted"],
        topics: [],
        industry: null,
        businessSize: null,
        targetAudience: null,
        tone: null,
        competitors: [],
        error: "File content too short or empty"
      };
    }
    
    // Clean up any PDF artifacts or binary data
    fileContent = cleanupTextContent(fileContent);
    
    // Analyze the content
    const analysisResult = await analyzeFileContent(fileContent, file.type);
    
    // Clean up any PDF artifacts in the result
    if (analysisResult.keyPoints && Array.isArray(analysisResult.keyPoints)) {
      analysisResult.keyPoints = filterPdfArtifacts(analysisResult.keyPoints);
    }
    
    if (analysisResult.topics && Array.isArray(analysisResult.topics)) {
      analysisResult.topics = filterPdfArtifacts(analysisResult.topics);
    }
    
    return analysisResult;
  } catch (error) {
    console.error('Error in client-side document analysis:', error);
    return {
      wordCount: 0,
      topKeywords: [],
      keyPoints: ["Unable to analyze document content"],
      topics: [],
      industry: null,
      businessSize: null,
      targetAudience: null,
      tone: null,
      competitors: [],
      error: `Failed to analyze document: ${error.message}`
    };
  }
}

/**
 * Clean up text content from binary or structural artifacts
 */
function cleanupTextContent(text: string): string {
  if (!text) return '';
  
  return text
    // Remove binary data patterns
    .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\xFF]+/g, ' ')
    // Remove PDF structural markers
    .replace(/obj|endobj|stream|endstream|startxref|xref|trailer/g, ' ')
    // Remove PDF object references like "3 0 R"
    .replace(/\d+ \d+ R/g, ' ')
    // Remove strange unicode characters
    .replace(/[^\u0020-\u007E\u00A0-\u00FF\u0100-\u017F\u0180-\u024F\u0370-\u03FF\u0400-\u04FF]+/g, ' ')
    // Remove PDF structure elements
    .replace(/\/Type\s+\/\w+|\/StructElem|\/P\s+\/\w+|\/Pg\s+|\/OBJR|\/MCID|\/S\s+\/\w+|\/K\s+\[/g, ' ')
    // Collapse multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract text from a PDF file using a simplified approach
 */
async function extractTextFromPdf(file: File): Promise<string> {
  try {
    console.log('Extracting text from PDF:', file.name);
    
    // Get PDF as array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Convert to string using TextDecoder
    const decoder = new TextDecoder('utf-8', { fatal: false });
    let text = decoder.decode(new Uint8Array(arrayBuffer));
    
    // Extract text content using a more robust approach
    let extractedText = '';
    
    // Method 1: Look for text between BT and ET tags (Begin Text / End Text)
    const contentRegex = /BT\s*([^]*?)\s*ET/g;
    let match;
    
    while ((match = contentRegex.exec(text)) !== null) {
      if (match[1]) {
        // Extract text objects from the content stream
        const textObjects = match[1].match(/\([^)]*\)/g);
        if (textObjects) {
          textObjects.forEach(textObj => {
            // Remove parentheses and add to extracted text
            extractedText += textObj.substring(1, textObj.length - 1) + ' ';
          });
        }
      }
    }
    
    // Method 2: If the first method didn't yield much text, try extracting text between parentheses
    if (extractedText.trim().length < 50) {
      const textInParentheses = text.match(/\(([^)]+)\)/g);
      if (textInParentheses) {
        // Filter out short parenthesized content (likely not actual text)
        extractedText = textInParentheses
          .filter(item => item.length > 4) // Filter out very short items
          .map(item => item.substring(1, item.length - 1)) // Remove the parentheses
          .filter(item => !/^[\d.]+$/.test(item)) // Filter out items that are just numbers
          .join(' ');
      }
    }
    
    // Method 3: Look for TJ array notation which often contains text
    if (extractedText.trim().length < 50) {
      const tjRegex = /\[([^\]]+)\]\s*TJ/g;
      let tjMatch;
      while ((tjMatch = tjRegex.exec(text)) !== null) {
        if (tjMatch[1]) {
          // Extract text from TJ arrays
          const tjContent = tjMatch[1].replace(/[^()\w\s]/g, ' ');
          const textParts = tjContent.match(/\(([^)]+)\)/g);
          if (textParts) {
            extractedText += textParts
              .map(part => part.substring(1, part.length - 1))
              .join(' ') + ' ';
          }
        }
      }
    }
    
    // Method 4: Look for text in XML content if this is a PDF with XML
    if (extractedText.trim().length < 50 && text.includes('<xml') && text.includes('</xml>')) {
      const xmlRegex = /<xml[^>]*>([\s\S]*?)<\/xml>/gi;
      let xmlMatch;
      while ((xmlMatch = xmlRegex.exec(text)) !== null) {
        if (xmlMatch[1]) {
          // Remove XML tags to get just the text
          extractedText += xmlMatch[1].replace(/<[^>]+>/g, ' ') + ' ';
        }
      }
    }
    
    // If still no substantial text extracted, use basic text extraction
    if (extractedText.trim().length < 50) {
      // Try to extract any readable text by removing non-printable characters
      extractedText = text.replace(/[\x00-\x1F\x7F-\xFF]/g, ' ');
    }
    
    console.log('Extracted text length:', extractedText.length);
    
    // Clean up the extracted text
    return cleanupTextContent(extractedText);
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return '';
  }
}