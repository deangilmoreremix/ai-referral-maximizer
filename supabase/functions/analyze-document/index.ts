import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface AnalyzeDocumentRequest {
  fileName: string;
  fileType: string;
  fileData: string; // base64 encoded file content
  userId?: string; // Optional, will be extracted from auth if not provided
}

interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  entities: {
    people: string[];
    organizations: string[];
    locations: string[];
  };
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  extractedText?: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authorization header for user context
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const request: AnalyzeDocumentRequest = await req.json();

    if (!request.fileName || !request.fileType || !request.fileData) {
      return new Response(
        JSON.stringify({ error: 'fileName, fileType, and fileData are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate file type
    const allowedTypes = ['pdf', 'docx', 'doc', 'txt', 'rtf'];
    if (!allowedTypes.includes(request.fileType.toLowerCase())) {
      return new Response(
        JSON.stringify({ error: 'Unsupported file type. Supported: pdf, docx, doc, txt, rtf' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Analyzing document: ${request.fileName} (${request.fileType})`);

    const startTime = Date.now();

    // Extract text from the file
    let extractedText: string;
    try {
      extractedText = await extractTextFromFile(request.fileData, request.fileType);
    } catch (error) {
      console.error('Error extracting text:', error);
      throw new Error('Failed to extract text from document');
    }

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text content found in document');
    }

    // Analyze the extracted text using AI
    const analysisResult = await analyzeTextWithAI(extractedText);

    const processingTime = Date.now() - startTime;

    // Get user ID from JWT token
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid authentication token');
    }

    // Store analysis results in database
    const { data: storedResult, error: dbError } = await supabase
      .from('analyzed_documents')
      .insert({
        user_id: user.id,
        file_name: request.fileName,
        file_type: request.fileType,
        file_size: Math.ceil(request.fileData.length * 0.75), // Approximate size from base64
        analysis_results: analysisResult,
        extraction_method: 'edge_function',
        processing_time_ms: processingTime,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store analysis results');
    }

    console.log(`Document analysis completed successfully in ${processingTime}ms`);

    return new Response(
      JSON.stringify({
        success: true,
        analysis: analysisResult,
        documentId: storedResult.id,
        processingTime,
        extractedTextLength: extractedText.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in analyze-document function:', error);

    let statusCode = 500;
    if (error.message?.includes('authentication') || error.message?.includes('authorization')) {
      statusCode = 401;
    } else if (error.message?.includes('required') || error.message?.includes('Unsupported')) {
      statusCode = 400;
    }

    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
      }),
      {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function extractTextFromFile(fileData: string, fileType: string): Promise<string> {
  // Decode base64 file data
  const fileBuffer = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));

  if (fileType.toLowerCase() === 'txt') {
    // For text files, decode directly
    return new TextDecoder().decode(fileBuffer);
  }

  // For PDF and DOCX, we'll use a simple extraction approach
  // In a real implementation, you'd use libraries like pdf-parse or mammoth.js
  // For now, we'll simulate text extraction

  if (fileType.toLowerCase() === 'pdf') {
    // Simulate PDF text extraction
    // In production, use: https://deno.land/x/pdf_parse/mod.ts or similar
    return simulatePDFTextExtraction(fileBuffer);
  }

  if (fileType.toLowerCase() === 'docx') {
    // Simulate DOCX text extraction
    // In production, use: https://deno.land/x/mammoth/mod.ts or similar
    return simulateDOCXTextExtraction(fileBuffer);
  }

  if (fileType.toLowerCase() === 'doc') {
    // For older .doc files, treat as binary and extract what we can
    return simulateDOCXTextExtraction(fileBuffer);
  }

  if (fileType.toLowerCase() === 'rtf') {
    // For RTF files, try to extract text content
    return simulateRTFTextExtraction(fileBuffer);
  }

  throw new Error(`Unsupported file type: ${fileType}`);
}

async function analyzeTextWithAI(text: string): Promise<AnalysisResult> {
  // Get OpenAI API key
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    throw new Error('Missing OpenAI API key');
  }

  // Truncate text if too long (keep first 8000 characters for analysis)
  const truncatedText = text.length > 8000 ? text.substring(0, 8000) + '...' : text;

  const prompt = `Analyze the following document text and provide a structured analysis:

DOCUMENT TEXT:
${truncatedText}

Please provide a JSON response with the following structure:
{
  "summary": "Brief summary of the document (2-3 sentences)",
  "keyPoints": ["Array of 3-5 key points from the document"],
  "entities": {
    "people": ["Array of people mentioned"],
    "organizations": ["Array of organizations mentioned"],
    "locations": ["Array of locations mentioned"]
  },
  "sentiment": "positive|negative|neutral",
  "confidence": 0.0-1.0
}

Focus on extracting actionable insights and key information. Be specific and accurate.`;

  try {
    const { OpenAI } = await import('npm:openai@latest');
    const openai = new OpenAI({ apiKey: openaiApiKey });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use cost-effective model for analysis
      messages: [
        { role: 'system', content: 'You are a document analysis expert. Provide structured, accurate analysis in JSON format.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    // Parse the JSON response
    const analysisResult: AnalysisResult = JSON.parse(content);

    // Validate the response structure
    if (!analysisResult.summary || !analysisResult.keyPoints || !analysisResult.entities) {
      throw new Error('Invalid analysis response structure');
    }

    return analysisResult;

  } catch (error) {
    console.error('Error analyzing text with AI:', error);

    // Fallback analysis if AI fails
    return {
      summary: 'Document analysis completed with limited processing.',
      keyPoints: ['Document contains text content', 'Analysis may be incomplete due to processing error'],
      entities: {
        people: [],
        organizations: [],
        locations: []
      },
      sentiment: 'neutral',
      confidence: 0.5,
      extractedText: text
    };
  }
}

// Simulation functions for text extraction (replace with real libraries in production)
function simulatePDFTextExtraction(buffer: Uint8Array): string {
  // This is a placeholder - in production use pdf-parse or similar
  const text = new TextDecoder().decode(buffer);
  // Remove binary artifacts and extract readable text
  return text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
}

function simulateDOCXTextExtraction(buffer: Uint8Array): string {
  // This is a placeholder - in production use mammoth.js or similar
  const text = new TextDecoder().decode(buffer);
  // Extract text between XML tags (simplified)
  const textMatches = text.match(/>([^<]+)</g);
  if (textMatches) {
    return textMatches.map(match => match.slice(1, -1)).join(' ').replace(/\s+/g, ' ').trim();
  }
  return text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
}

function simulateRTFTextExtraction(buffer: Uint8Array): string {
  // This is a placeholder - in production use a proper RTF parser
  const text = new TextDecoder().decode(buffer);
  // Remove RTF control codes and extract text
  return text.replace(/\\[a-z]+\d*\s?/g, '').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();
}