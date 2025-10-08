import { generateContent } from "./openAIService";

// Define our tone options
export type ContentTone = 
  | 'professional' 
  | 'conversational' 
  | 'friendly' 
  | 'persuasive' 
  | 'urgent' 
  | 'reassuring'
  | 'authoritative'
  | 'empathetic';

// Define our length options
export type ContentLength = 
  | 'concise' 
  | 'standard' 
  | 'detailed';

// Generic enhancement request
interface ContentEnhancementRequest {
  content: string;           // The original content to enhance
  tone?: ContentTone;        // The desired tone
  length?: ContentLength;    // The desired length
  model: string;             // "gpt-4o" | "gpt-4o-mini" | "gpt-3.5-turbo"
  context?: {                // Optional context about the recipient/situation
    industry?: string;
    audienceType?: string;
    relationshipType?: string;
    objective?: string;
    specialInstructions?: string;
  };
}

// Specialized voice drop enhancement request
interface VoiceDropEnhancementRequest extends ContentEnhancementRequest {
  callType?: 'cold' | 'warm' | 'follow-up' | 'client';
  includeScriptNotes?: boolean;
  duration?: 'short' | 'medium' | 'long'; // Target duration for voice drop 
}

// Specialized SMS enhancement request
interface SmsEnhancementRequest extends ContentEnhancementRequest {
  messageType?: 'direct-request' | 'follow-up' | 'value-add' | 'reminder';
  includeEmojis?: boolean;
  characterLimit?: number; // Optional character limit (standard SMS = 160)
}

/**
 * Enhance voice drop script content 
 */
export async function enhanceVoiceDropScript(request: VoiceDropEnhancementRequest): Promise<string> {
  // Build model-specific prompts
  let prompt: string;
  
  const toneDescription = request.tone 
    ? `The tone should be ${request.tone}.` 
    : '';
  
  const lengthDescription = request.length
    ? `The script should be ${request.length === 'concise' 
        ? 'brief and to the point (15-20 seconds when spoken)' 
        : request.length === 'detailed' 
        ? 'comprehensive and thorough (40-60 seconds when spoken)'
        : 'standard length (25-35 seconds when spoken)'}.`
    : '';
  
  const durationDescription = request.duration
    ? `The voice drop should be ${request.duration === 'short' 
        ? 'very short (under 20 seconds when spoken)' 
        : request.duration === 'long' 
        ? 'more detailed (40-60 seconds when spoken)'
        : 'average length (25-35 seconds when spoken)'}.`
    : '';
  
  const callTypeDescription = request.callType
    ? `This is a ${request.callType} call.`
    : '';
    
  const contextDescription = request.context ? `
    Industry: ${request.context.industry || 'Not specified'}
    Audience: ${request.context.audienceType || 'Not specified'}
    Relationship: ${request.context.relationshipType || 'Not specified'}
    Objective: ${request.context.objective || 'To generate referrals'}
    Special instructions: ${request.context.specialInstructions || 'None'}
  ` : '';

  // Model-specific prompts
  if (request.model === 'gpt-4o') {
    // More detailed prompt for the most capable model
    prompt = `You are an expert in creating professional voice drop scripts that generate referrals. Please enhance the following voice drop script.

ORIGINAL SCRIPT:
${request.content}

ENHANCEMENT DIRECTIONS:
${toneDescription}
${lengthDescription || durationDescription}
${callTypeDescription}
- The script should sound natural when spoken, not like written text.
- Include appropriate pauses and verbal transitions.
- Focus on clearly asking for referrals in a way that respects the relationship.
- Create a script that flows conversationally and is easy to deliver.
- Use straightforward language that's easy to understand over the phone.
${request.includeScriptNotes ? '- Include [PAUSE], [EMPHASIS], or [SMILE] cues in brackets where appropriate.' : ''}

CONTEXT:
${contextDescription}

Provide ONLY the enhanced script without explanations, introductions, or additional notes.`;
  } 
  else if (request.model === 'gpt-4o-mini') {
    // More streamlined prompt for the balanced model
    prompt = `Enhance this voice drop script for generating referrals.

Original: ${request.content}

Make it:
- ${request.tone || 'Professional'} in tone
- ${request.length || request.duration || 'Standard'} length
- Natural sounding when spoken
- Clear with simple language
${request.includeScriptNotes ? '- Include [PAUSE] or [EMPHASIS] cues' : ''}

${callTypeDescription}
${contextDescription.trim()}

Return only the enhanced script.`;
  }
  else {
    // Minimal prompt for the lightweight model
    prompt = `Make this voice script better:
${request.content}

Tone: ${request.tone || 'Professional'}
Length: ${request.length || 'Standard'}
Purpose: Referral request

Return only the improved script.`;
  }

  try {
    const enhancedContent = await generateContent({
      contentType: "Voice Drop Script",
      specialRequirements: prompt
    });
    
    return enhancedContent;
  } catch (error) {
    console.error("Error enhancing voice drop script:", error);
    return request.content; // Return original content if enhancement fails
  }
}

/**
 * Enhance SMS/text message content
 */
export async function enhanceSmsMessage(request: SmsEnhancementRequest): Promise<string> {
  // Build model-specific prompts
  let prompt: string;
  
  const toneDescription = request.tone 
    ? `The tone should be ${request.tone}.` 
    : '';
  
  const lengthDescription = request.length
    ? `The message should be ${request.length === 'concise' 
        ? 'brief and to the point (50-80 characters)' 
        : request.length === 'detailed' 
        ? 'more comprehensive while still fitting SMS constraints (120-160 characters)'
        : 'standard length (80-120 characters)'}.`
    : '';
  
  const characterLimitDesc = request.characterLimit 
    ? `The message must be under ${request.characterLimit} characters.` 
    : 'Keep the message under 160 characters if possible to fit within standard SMS limits.';
    
  const emojiDesc = request.includeEmojis 
    ? 'Include 1-3 appropriate emojis to make the message more engaging.' 
    : 'Do not use emojis.';
    
  const messageTypeDesc = request.messageType
    ? `This is a ${request.messageType.replace('-', ' ')} message.`
    : '';
    
  const contextDescription = request.context ? `
    Industry: ${request.context.industry || 'Not specified'}
    Audience: ${request.context.audienceType || 'Not specified'}
    Relationship: ${request.context.relationshipType || 'Not specified'}
    Objective: ${request.context.objective || 'To generate referrals'}
    Special instructions: ${request.context.specialInstructions || 'None'}
  ` : '';

  // Model-specific prompts
  if (request.model === 'gpt-4o') {
    // More detailed prompt for the most capable model
    prompt = `You are an expert in creating high-converting SMS messages for referral generation. Please enhance the following SMS message.

ORIGINAL MESSAGE:
${request.content}

ENHANCEMENT DIRECTIONS:
${toneDescription}
${lengthDescription}
${characterLimitDesc}
${emojiDesc}
${messageTypeDesc}
- The message should be personal and direct.
- Use natural, conversational language.
- Include a clear call to action related to providing referrals.
- Ensure the message creates a sense of connection.
- Make every word count - no filler text.

CONTEXT:
${contextDescription}

Provide ONLY the enhanced SMS message without explanations, introductions, or character counts.`;
  } 
  else if (request.model === 'gpt-4o-mini') {
    // More streamlined prompt for the balanced model
    prompt = `Enhance this SMS message for referral generation.

Original: ${request.content}

Requirements:
- ${request.tone || 'Professional'} tone
- ${request.length || 'Standard'} length
- ${characterLimitDesc}
- ${emojiDesc}
- Clear call to action
- Conversational style

${messageTypeDesc}
${contextDescription.trim()}

Return only the enhanced message.`;
  }
  else {
    // Minimal prompt for the lightweight model
    prompt = `Improve this SMS message:
${request.content}

Tone: ${request.tone || 'Friendly'}
${request.characterLimit ? `Max ${request.characterLimit} characters` : 'Keep it short'}
${request.includeEmojis ? 'Add 1-2 emojis' : ''}
Purpose: Ask for referrals

Message only.`;
  }

  try {
    const enhancedContent = await generateContent({
      contentType: "SMS Templates",
      specialRequirements: prompt
    });
    
    return enhancedContent;
  } catch (error) {
    console.error("Error enhancing SMS message:", error);
    return request.content; // Return original content if enhancement fails
  }
}

/**
 * Enhance WhatsApp/Messenger content
 */
export async function enhanceMessagingAppContent(request: SmsEnhancementRequest): Promise<string> {
  // Build model-specific prompts for WhatsApp/Messenger
  let prompt: string;
  
  const toneDescription = request.tone 
    ? `The tone should be ${request.tone}.` 
    : '';
  
  const lengthDescription = request.length
    ? `The message should be ${request.length === 'concise' 
        ? 'brief and to the point' 
        : request.length === 'detailed' 
        ? 'more comprehensive with good detail'
        : 'standard length'}.`
    : '';
  
  // WhatsApp/Messenger can be longer than SMS
  const characterLimitDesc = request.characterLimit 
    ? `The message must be under ${request.characterLimit} characters.` 
    : '';
    
  // WhatsApp/Messenger are more emoji-friendly
  const emojiDesc = request.includeEmojis === false
    ? 'Do not use emojis.' 
    : 'Include 2-4 appropriate emojis to make the message more engaging and personal.';
    
  const messageTypeDesc = request.messageType
    ? `This is a ${request.messageType.replace('-', ' ')} message.`
    : '';
    
  const contextDescription = request.context ? `
    Industry: ${request.context.industry || 'Not specified'}
    Audience: ${request.context.audienceType || 'Not specified'}
    Relationship: ${request.context.relationshipType || 'Not specified'}
    Objective: ${request.context.objective || 'To generate referrals'}
    Special instructions: ${request.context.specialInstructions || 'None'}
  ` : '';

  // Model-specific prompts
  if (request.model === 'gpt-4o') {
    // More detailed prompt for the most capable model
    prompt = `You are an expert in creating high-converting WhatsApp and Messenger messages for referral generation. Please enhance the following messaging app message.

ORIGINAL MESSAGE:
${request.content}

ENHANCEMENT DIRECTIONS:
${toneDescription}
${lengthDescription}
${characterLimitDesc}
${emojiDesc}
${messageTypeDesc}
- The message should feel personal and conversational.
- Use casual, friendly language appropriate for messaging apps.
- Break longer messages into 2-3 smaller paragraphs for readability.
- Include a clear call to action related to providing referrals.
- The message should sound like it was typed naturally by a person, not formally written.

CONTEXT:
${contextDescription}

Provide ONLY the enhanced messaging app message without explanations, introductions, or character counts.`;
  } 
  else if (request.model === 'gpt-4o-mini') {
    // More streamlined prompt for the balanced model
    prompt = `Enhance this WhatsApp/Messenger message for referral generation.

Original: ${request.content}

Requirements:
- ${request.tone || 'Friendly'} tone
- ${request.length || 'Standard'} length
- ${characterLimitDesc || 'Appropriate length for messaging apps'}
- ${emojiDesc}
- Conversational style
- Clear referral request

${messageTypeDesc}
${contextDescription.trim()}

Return only the enhanced message.`;
  }
  else {
    // Minimal prompt for the lightweight model
    prompt = `Improve this WhatsApp message:
${request.content}

Tone: ${request.tone || 'Casual'}
${request.characterLimit ? `Max ${request.characterLimit} characters` : ''}
Add emojis
Purpose: Get referrals

Message only.`;
  }

  try {
    const enhancedContent = await generateContent({
      contentType: "WhatsApp Template",
      specialRequirements: prompt
    });
    
    return enhancedContent;
  } catch (error) {
    console.error("Error enhancing WhatsApp/Messenger message:", error);
    return request.content; // Return original content if enhancement fails
  }
}

/**
 * General content enhancement for any communication channel
 * @param request The enhancement request
 * @returns Enhanced content
 */
async function enhanceContent(request: ContentEnhancementRequest): Promise<string> {
  // Determine what kind of content we're enhancing based on context clues
  if (request.content.includes("voice") || 
      request.content.toLowerCase().includes("call") || 
      request.content.toLowerCase().includes("voicemail")) {
    return enhanceVoiceDropScript(request as VoiceDropEnhancementRequest);
  } 
  else if (request.content.includes("WhatsApp") || 
          request.content.includes("Messenger") || 
          request.content.includes("👋") || 
          request.content.includes("🙂")) {
    return enhanceMessagingAppContent(request as SmsEnhancementRequest);
  } 
  else {
    return enhanceSmsMessage(request as SmsEnhancementRequest);
  }
}

/**
 * Generate voice drop script from scratch
 */
export async function generateVoiceDropScript(
  model: string,
  referralType: string,
  tone: ContentTone = 'professional',
  length: ContentLength = 'standard',
  context?: {
    industry?: string;
    audience?: string;
    relationship?: string;
    specialInstructions?: string;
  }
): Promise<string> {
  let prompt: string;
  
  const contextInfo = context ? `
    Industry: ${context.industry || 'Not specified'}
    Target Audience: ${context.audience || 'Not specified'}
    Relationship Type: ${context.relationship || 'Not specified'}
    Special Instructions: ${context.specialInstructions || 'None'}
  ` : '';

  if (model === 'gpt-4o') {
    prompt = `Create a professional voice drop script for requesting referrals.

SCRIPT TYPE:
${referralType} referral request

PARAMETERS:
- Tone: ${tone}
- Length: ${length === 'concise' ? 'Brief (15-20 seconds when spoken)' 
  : length === 'detailed' ? 'Comprehensive (40-60 seconds when spoken)' 
  : 'Standard (25-35 seconds when spoken)'}
- Purpose: Generate high-quality referrals for my business
- Must include: Clear introduction, value proposition, specific referral request, and contact information variables

FORMATTING:
- Write in natural, conversational language that sounds good when spoken
- Use variables like {{name}}, {{your_name}}, {{company}}, {{your_phone}}, etc. for personalization
- Include appropriate pauses and emphasis for voice delivery

CONTEXT:
${contextInfo}

Create only the voice drop script with no additional explanation or notes.`;
  }
  else if (model === 'gpt-4o-mini') {
    prompt = `Create a ${tone} voice drop script for ${referralType} referrals.
    
Length: ${length}
Purpose: Request referrals

Include:
- Introduction with {{name}} and {{your_name}}
- Clear value proposition
- Specific referral request
- Contact info with {{your_phone}}

${contextInfo}

Write conversational script only.`;
  }
  else { // gpt-3.5-turbo (cheapest)
    prompt = `Write ${tone} voice script for ${referralType} referrals.
${length} length.
Use {{name}}, {{your_name}}, {{company}}.
Ask for referrals clearly.
${context?.specialInstructions || ''}`;
  }

  try {
    const scriptContent = await generateContent({
      contentType: "Voice Drop Script",
      specialRequirements: prompt
    });
    
    return scriptContent;
  } catch (error) {
    console.error("Error generating voice drop script:", error);
    return "Error generating voice drop script. Please try again.";
  }
}

/**
 * Generate SMS template from scratch
 */
export async function generateSmsTemplate(
  model: string,
  referralType: string,
  tone: ContentTone = 'friendly',
  includeEmojis: boolean = false,
  context?: {
    industry?: string;
    audience?: string;
    relationship?: string;
    specialInstructions?: string;
  }
): Promise<string> {
  let prompt: string;
  
  const contextInfo = context ? `
    Industry: ${context.industry || 'Not specified'}
    Target Audience: ${context.audience || 'Not specified'}
    Relationship Type: ${context.relationship || 'Not specified'}
    Special Instructions: ${context.specialInstructions || 'None'}
  ` : '';

  if (model === 'gpt-4o') {
    prompt = `Create an effective SMS template for requesting referrals.

SMS TYPE:
${referralType} referral request

PARAMETERS:
- Tone: ${tone}
- Character limit: Maximum 160 characters for standard SMS
- Emojis: ${includeEmojis ? 'Include 1-3 appropriate emojis' : 'Do not include emojis'}
- Purpose: Generate high-quality referrals for my business
- Must include: Clear, concise referral request and personalization variables

FORMATTING:
- Use variables like {{name}}, {{your_name}}, {{company}}, etc. for personalization
- Keep it conversational and natural
- Ensure it fits within standard SMS character limits

CONTEXT:
${contextInfo}

Create only the SMS text with no additional explanation or notes.`;
  }
  else if (model === 'gpt-4o-mini') {
    prompt = `Create a ${tone} SMS template for ${referralType} referrals.
    
Requirements:
- Under 160 characters
- ${includeEmojis ? 'Include emojis' : 'No emojis'}
- Use {{name}}, {{your_name}} variables
- Clear call to action

${contextInfo}

Write SMS text only.`;
  }
  else { // gpt-3.5-turbo (cheapest)
    prompt = `Write ${tone} SMS for ${referralType} referrals.
Under 160 characters.
${includeEmojis ? 'Use emojis.' : 'No emojis.'}
Use {{name}} variable.
${context?.specialInstructions || ''}`;
  }

  try {
    const smsContent = await generateContent({
      contentType: "SMS Templates",
      specialRequirements: prompt
    });
    
    return smsContent;
  } catch (error) {
    console.error("Error generating SMS template:", error);
    return "Error generating SMS template. Please try again.";
  }
}

/**
 * Generate WhatsApp/Messenger template from scratch
 */
export async function generateMessagingAppTemplate(
  model: string,
  referralType: string,
  tone: ContentTone = 'conversational',
  includeEmojis: boolean = true,
  context?: {
    industry?: string;
    audience?: string;
    relationship?: string;
    specialInstructions?: string;
  }
): Promise<string> {
  let prompt: string;
  
  const contextInfo = context ? `
    Industry: ${context.industry || 'Not specified'}
    Target Audience: ${context.audience || 'Not specified'}
    Relationship Type: ${context.relationship || 'Not specified'}
    Special Instructions: ${context.specialInstructions || 'None'}
  ` : '';

  if (model === 'gpt-4o') {
    prompt = `Create an effective WhatsApp/Messenger template for requesting referrals.

MESSAGE TYPE:
${referralType} referral request

PARAMETERS:
- Tone: ${tone}
- Emojis: ${includeEmojis ? 'Include 3-5 appropriate emojis strategically placed' : 'Do not include emojis'}
- Purpose: Generate high-quality referrals for my business
- Must include: Personalized greeting, value proposition, clear referral request, and easy way to respond

FORMATTING:
- Use variables like {{name}}, {{your_name}}, {{company}}, etc. for personalization
- Structure for mobile reading with short paragraphs
- Keep it conversational and casual as appropriate for messaging apps
- Can be longer than SMS but still concise and focused

CONTEXT:
${contextInfo}

Create only the WhatsApp/Messenger text with no additional explanation or notes.`;
  }
  else if (model === 'gpt-4o-mini') {
    prompt = `Create a ${tone} WhatsApp template for ${referralType} referrals.
    
Style:
- Conversational messaging app style
- ${includeEmojis ? 'Include several emojis' : 'No emojis'}
- Use {{name}}, {{your_name}} variables
- Short paragraphs for mobile reading
- Clear referral call to action

${contextInfo}

Write WhatsApp message only.`;
  }
  else { // gpt-3.5-turbo (cheapest)
    prompt = `Write ${tone} WhatsApp message for ${referralType} referrals.
${includeEmojis ? 'Use 2-3 emojis.' : 'No emojis.'}
Use {{name}} variable.
Short paragraphs.
Ask for referral.
${context?.specialInstructions || ''}`;
  }

  try {
    const messageContent = await generateContent({
      contentType: "WhatsApp Template",
      specialRequirements: prompt
    });
    
    return messageContent;
  } catch (error) {
    console.error("Error generating WhatsApp template:", error);
    return "Error generating WhatsApp template. Please try again.";
  }
}