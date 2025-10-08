# Enhanced Voice & SMS System - Usage Guide

## Quick Start

All enhancements work automatically - just use the system as normal! The AI will automatically detect when to use web search, code execution, or image generation based on your messages.

## Feature Details

### 1. Web Search Integration 🔍

#### Automatic Activation
Web search automatically triggers when your message includes keywords like:
- "latest"
- "current"
- "recent"
- "news"
- "what is"
- "search for"
- "information about"

#### Example Usage
```
User: "What are the latest trends in referral marketing?"
```
The system will:
1. Detect the keyword "latest"
2. Perform a web search
3. Include search results in the AI response
4. Display a "Web Search Used" badge

#### Manual Usage
```typescript
// In code
await enhancedConversationService.processEnhancedMessage({
  contextId: 'your-context-id',
  userMessage: 'your message',
  enableWebSearch: true  // Force web search
});
```

---

### 2. Code Interpreter 🧮

#### Automatic Activation
Code execution triggers when you:
- Include code blocks with backticks
- Ask to calculate/compute/evaluate
- Include mathematical expressions

#### Example Usage

**Simple Math:**
```
User: "Calculate 234 * 567 + 89"
```
Result: The system executes the math and returns 132,767

**Math with Explanation:**
```
User: "What's 15% of 2500?"
```
Result: 375

**Code Blocks:**
````
User: "Execute this code:
```javascript
const total = [100, 200, 300].reduce((sum, num) => sum + num, 0);
console.log('Total:', total);
```
````
Result: Executes the code safely and returns output

#### Supported Languages
- `javascript` - Basic JavaScript (no dangerous operations)
- `math` - Mathematical expressions

#### Security
- No access to file system
- No network operations
- No dangerous functions (eval, etc.)
- Sandboxed execution

---

### 3. Image Generation 🎨

#### Automatic Activation
Image generation triggers when you say:
- "generate image of..."
- "create image of..."
- "draw..."
- "visualize..."
- "show me a picture of..."

#### Example Usage
```
User: "Generate image of a modern office workspace with plants"
```
The system will:
1. Extract the image prompt
2. Generate the image using AI
3. Display the image
4. Show an "Image Generated" badge

```
User: "Show me a picture of a sunset over mountains"
```
Result: Generates and displays the requested image

---

### 4. File Upload 📎

#### How to Upload
1. Click the "Attach File" button
2. Select a file (PDF, DOC, TXT, CSV, JSON)
3. Wait for upload confirmation
4. File is now attached to the conversation

#### Supported File Types
- **Documents:** .pdf, .doc, .docx, .txt
- **Data:** .csv, .json
- **Images:** .png, .jpg, .jpeg
- **Max Size:** 10MB (configurable)

#### Example Usage in UI
```typescript
<FileUploadButton
  onFileSelect={async (file) => {
    await conversationService.uploadAttachment(
      contextId,
      file,
      messageId  // optional
    );
  }}
  maxSize={10}  // MB
  accept=".pdf,.doc,.docx,.txt"
/>
```

#### Viewing Attachments
```typescript
// Get all attachments for a conversation
const attachments = await conversationService.getAttachments(contextId);

// Get download URL
const url = await conversationService.getAttachmentUrl(attachment.storage_path);
```

---

### 5. Reasoning Display 🧠

#### What It Shows
Every AI response includes:
- **Reasoning Process:** How the AI arrived at the answer
- **Context Used:** What information was considered
- **Enhancement Usage:** Which features were used

#### How to View
1. Look for the "AI Reasoning Process" section below any AI message
2. Click to expand/collapse
3. Read the detailed reasoning

#### Example
```
User Message: "What's the best time to send referral requests?"

AI Response: "The best time to send referral requests is..."

Reasoning Display:
"I considered multiple factors including:
1. Business context from web search
2. Common business hours
3. Psychology of requests
4. Your specific industry
5. Best practices from research

This recommendation balances professional timing with
psychological receptiveness to ensure maximum response rates."
```

---

### 6. Quality Scoring ⭐

#### Automatic Scoring
Every AI response receives a quality score (0-100) based on:
- **Response Length:** Completeness of answer
- **Enhancement Usage:** Use of search, code, images
- **Structure:** Well-organized content
- **Specificity:** Detailed vs vague answers

#### Score Meanings
- **90-100:** 🟢 Excellent - Comprehensive, well-researched
- **75-89:** 🔵 Good - Solid response with context
- **60-74:** 🟡 Fair - Adequate but could be better
- **0-59:** 🟠 Needs Improvement - Basic response

#### Visual Display
```
[⭐ Excellent (95%)]  [🔍 Web Search Used]  [💻 Code Executed]
```

#### Manual Adjustment
You can adjust quality scores if you disagree:
```typescript
await conversationService.updateMessageQualityScore(
  messageId,
  85  // New score 0-100
);
```

---

## Integration Examples

### Example 1: Voice Drop with Web Search
```
User: "Create a voice drop script about the latest trends in real estate"
```
System:
1. Detects "latest" keyword → Performs web search
2. Finds current real estate trends
3. Generates voice script incorporating trends
4. Displays: [🔍 Web Search Used] [⭐ Excellent (92%)]

### Example 2: SMS with Calculation
```
User: "Create an SMS offering 15% discount on our $500 service"
```
System:
1. Detects calculation → Executes: 500 * 0.15
2. Result: $75 discount
3. Generates SMS: "Special offer: Get $75 off our $500 service!"
4. Displays: [💻 Code Executed] [⭐ Good (88%)]

### Example 3: Multi-Enhancement Message
```
User: "Research current SMS marketing statistics, calculate the ROI if we get 5% response rate on 1000 messages at $2 each, and show me a visual representation"
```
System:
1. Web search for SMS marketing stats
2. Calculates: 1000 * 0.05 * $2 = $100 ROI
3. Generates image showing ROI visualization
4. Displays: [🔍] [💻] [🎨] [⭐ Excellent (95%)]

### Example 4: File-Based Conversation
```
1. User uploads "client_list.csv"
2. User: "Analyze this list and suggest segmentation"
3. System reads file, analyzes data, provides insights
4. Displays: [📎 Attachments] [⭐ Good (86%)]
```

---

## API Reference

### EnhancedConversationService

```typescript
import { enhancedConversationService } from './services/enhancedConversationService';

// Process a message with all enhancements
const result = await enhancedConversationService.processEnhancedMessage({
  contextId: 'conversation-uuid',
  userMessage: 'Your message here',
  enableWebSearch: true,      // Optional: force web search
  enableCodeExecution: true,   // Optional: force code execution
  enableImageGeneration: false // Optional: disable image generation
});

// Result includes:
// - result.message: The saved message
// - result.webSearchResults: Search data (if used)
// - result.codeExecutionResults: Code output (if used)
// - result.generatedImages: Generated images (if used)
```

### ConversationService

```typescript
import { conversationService } from './services/conversationService';

// Add a message
const message = await conversationService.addMessage(
  contextId,
  'user',
  'Message content',
  {
    reasoning: 'Optional reasoning',
    quality_score: 85,
    has_web_search: true
  }
);

// Upload a file
const attachment = await conversationService.uploadAttachment(
  contextId,
  file,
  messageId  // optional
);

// Get attachments
const attachments = await conversationService.getAttachments(contextId);
```

### WebSearchService

```typescript
import { webSearchService } from './services/webSearchService';

// Perform search
const results = await webSearchService.search('your query');

// Check if search should be performed
if (webSearchService.shouldPerformWebSearch(userMessage)) {
  // Perform search
}

// Summarize results
const summary = webSearchService.summarizeResults(searchResponse);
```

### CodeInterpreterService

```typescript
import { codeInterpreterService } from './services/codeInterpreterService';

// Execute code
const result = await codeInterpreterService.executeCode(
  'console.log(2 + 2)',
  'javascript'
);

// Execute math
const answer = await codeInterpreterService.calculate('15 * 23 + 45');

// Format numbers
const formatted = codeInterpreterService.formatNumber(3.14159, 2); // "3.14"
```

### ImageGenerationService

```typescript
import { imageGenerationService } from './services/imageGenerationService';

// Generate image
const result = await imageGenerationService.generateImage({
  prompt: 'A beautiful sunset',
  model: 'gemini'
});

// Check if image should be generated
if (imageGenerationService.shouldGenerateImage(userMessage)) {
  // Generate image
}

// Extract prompt
const prompt = imageGenerationService.extractImagePrompt(userMessage);
```

---

## UI Components

### MessageEnhancements Component
```typescript
import { MessageEnhancements } from './components/MessageEnhancements';

<MessageEnhancements
  reasoning="AI reasoning text"
  qualityScore={92}
  hasWebSearch={true}
  hasCodeExecution={true}
  hasImageGeneration={false}
  hasFileAttachment={false}
  onShowDetails={(type) => {
    // Handle showing details for search, code, images, or files
  }}
/>
```

### FileUploadButton Component
```typescript
import { FileUploadButton } from './components/FileUploadButton';

<FileUploadButton
  onFileSelect={async (file) => {
    await handleFileUpload(file);
  }}
  accept=".pdf,.doc,.docx"
  maxSize={10}
  disabled={false}
/>
```

### AttachmentDisplay Component
```typescript
import { AttachmentDisplay } from './components/FileUploadButton';

<AttachmentDisplay
  fileName="document.pdf"
  fileSize={1024000}
  fileType="application/pdf"
  downloadUrl="https://..."
  onRemove={() => handleRemove()}
/>
```

---

## Best Practices

### 1. Web Search
- Use for current/recent information
- Great for market research
- Helpful for statistics and data
- Adds credibility to responses

### 2. Code Execution
- Perfect for calculations
- ROI computations
- Data analysis
- Number validation

### 3. Image Generation
- Visual explanations
- Marketing materials
- Concept illustrations
- Workflow diagrams

### 4. File Uploads
- Reference documents
- Client lists
- Data files for analysis
- Templates to customize

### 5. Quality Scoring
- Monitor response quality
- Identify areas for improvement
- Track enhancement effectiveness
- Compare different approaches

---

## Troubleshooting

### Web Search Not Working
- Check if query contains trigger keywords
- Try explicit "search for..." command
- Verify API keys (if using real search API)

### Code Execution Failing
- Ensure code doesn't contain dangerous operations
- Use simple, safe operations
- Check for syntax errors
- Try wrapping in try-catch

### Image Generation Issues
- Use clear, descriptive prompts
- Verify Gemini API key is set
- Check prompt length (not too long)
- Try simpler descriptions

### File Upload Problems
- Check file size (<10MB default)
- Verify file type is supported
- Ensure storage bucket is configured
- Check user permissions

---

## Need Help?

Refer to:
- `ENHANCEMENTS_SUMMARY.md` - Technical implementation details
- `VOICE_SMS_COMPONENTS_EXPORT.md` - Complete code export
- Component source code for detailed examples

All features are designed to work automatically with minimal configuration!
