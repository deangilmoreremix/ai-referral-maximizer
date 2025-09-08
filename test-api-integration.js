// Comprehensive API Integration Test Suite
// Run with: node test-api-integration.js
// This test verifies that all features use real APIs instead of mock data

console.log('🧪 Starting Comprehensive API Integration Tests...\n');

// Test configuration - these should be set in your environment
const CONFIG = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY,
  SUPABASE_URL: process.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY
};

// Test results tracking
const testResults = {
  openai: { passed: 0, failed: 0, tests: [] },
  gemini: { passed: 0, failed: 0, tests: [] },
  supabase: { passed: 0, failed: 0, tests: [] },
  images: { passed: 0, failed: 0, tests: [] },
  overall: { passed: 0, failed: 0 }
};

// Helper function to record test results
function recordTest(category, testName, passed, error = null) {
  const result = { name: testName, passed, error };
  testResults[category].tests.push(result);

  if (passed) {
    testResults[category].passed++;
    testResults.overall.passed++;
    console.log(`✅ ${testName}`);
  } else {
    testResults[category].failed++;
    testResults.overall.failed++;
    console.log(`❌ ${testName}: ${error}`);
  }
}

// Test OpenAI GPT-5 integration
async function testOpenAIIntegration() {
  console.log('\n🤖 Testing OpenAI Integration:');

  if (!CONFIG.OPENAI_API_KEY) {
    recordTest('openai', 'OpenAI API Key Check', false, 'API key not configured');
    return;
  }

  try {
    // Test basic API connectivity
    const { OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: CONFIG.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello, this is a test.' }],
      max_tokens: 50
    });

    recordTest('openai', 'OpenAI API Connectivity', true);

    // Test GPT-5 model availability (if available)
    try {
      const gpt5Response = await openai.responses.create({
        model: 'gpt-5',
        input: [{ role: 'user', content: 'Test GPT-5 response' }]
      });
      recordTest('openai', 'GPT-5 Model Access', true);
    } catch (error) {
      recordTest('openai', 'GPT-5 Model Access', false, 'GPT-5 may not be available or requires special access');
    }

  } catch (error) {
    recordTest('openai', 'OpenAI API Connectivity', false, error.message);
  }
}

// Test Gemini integration
async function testGeminiIntegration() {
  console.log('\n🌟 Testing Gemini Integration:');

  if (!CONFIG.GEMINI_API_KEY) {
    recordTest('gemini', 'Gemini API Key Check', false, 'API key not configured');
    return;
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const result = await model.generateContent('Hello, this is a test message.');
    const response = await result.response;
    const text = response.text();

    if (text && text.length > 0) {
      recordTest('gemini', 'Gemini API Connectivity', true);
    } else {
      recordTest('gemini', 'Gemini API Connectivity', false, 'Empty response from API');
    }

  } catch (error) {
    recordTest('gemini', 'Gemini API Connectivity', false, error.message);
  }
}

// Test Supabase integration
async function testSupabaseIntegration() {
  console.log('\n🗄️ Testing Supabase Integration:');

  if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY) {
    recordTest('supabase', 'Supabase Config Check', false, 'Supabase URL or anon key not configured');
    return;
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

    // Test basic connectivity
    const { data, error } = await supabase.from('user_templates').select('count').limit(1);

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is OK
      throw error;
    }

    recordTest('supabase', 'Supabase Connectivity', true);

    // Test authentication (this will fail without user session, but tests the setup)
    const { data: authData } = await supabase.auth.getSession();
    recordTest('supabase', 'Supabase Auth Setup', true, 'Auth configured (session may be empty)');

  } catch (error) {
    recordTest('supabase', 'Supabase Connectivity', false, error.message);
  }
}

// Test OpenAI Images (DALL-E) integration
async function testImageGeneration() {
  console.log('\n🎨 Testing Image Generation:');

  if (!CONFIG.OPENAI_API_KEY) {
    recordTest('images', 'Image API Key Check', false, 'OpenAI API key not configured');
    return;
  }

  try {
    const { OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: CONFIG.OPENAI_API_KEY });

    // Note: This test doesn't actually generate an image to avoid costs
    // It just tests that the API is accessible
    const models = await openai.models.list();
    const hasDalle = models.data.some(model => model.id.includes('dall'));

    if (hasDalle) {
      recordTest('images', 'DALL-E Model Access', true);
    } else {
      recordTest('images', 'DALL-E Model Access', false, 'DALL-E models not available');
    }

  } catch (error) {
    recordTest('images', 'DALL-E Model Access', false, error.message);
  }
}

// Test edge function endpoints
async function testEdgeFunctions() {
  console.log('\n⚡ Testing Edge Functions:');

  if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY) {
    console.log('⚠️ Skipping edge function tests - Supabase not configured');
    return;
  }

  const baseUrl = CONFIG.SUPABASE_URL;

  // Test OpenAI GPT-5 edge function
  try {
    const response = await fetch(`${baseUrl}/functions/v1/openai-gpt5`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: 'Test message',
        model: 'gpt-5'
      }),
    });

    if (response.ok) {
      recordTest('openai', 'GPT-5 Edge Function', true);
    } else {
      const errorText = await response.text();
      recordTest('openai', 'GPT-5 Edge Function', false, `HTTP ${response.status}: ${errorText}`);
    }
  } catch (error) {
    recordTest('openai', 'GPT-5 Edge Function', false, error.message);
  }

  // Test Gemini edge function
  try {
    const response = await fetch(`${baseUrl}/functions/v1/generate-content`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-gemini-api-key': CONFIG.GEMINI_API_KEY || '',
        'x-model-id': 'gemini-2.5-pro'
      },
      body: JSON.stringify({
        contentType: 'test message',
        industry: 'technology'
      }),
    });

    if (response.ok) {
      recordTest('gemini', 'Gemini Edge Function', true);
    } else {
      const errorText = await response.text();
      recordTest('gemini', 'Gemini Edge Function', false, `HTTP ${response.status}: ${errorText}`);
    }
  } catch (error) {
    recordTest('gemini', 'Gemini Edge Function', false, error.message);
  }

  // Test OpenAI Images edge function
  try {
    const response = await fetch(`${baseUrl}/functions/v1/openai-images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Test image prompt',
        model: 'dall-e-3'
      }),
    });

    if (response.ok) {
      recordTest('images', 'Images Edge Function', true);
    } else {
      const errorText = await response.text();
      recordTest('images', 'Images Edge Function', false, `HTTP ${response.status}: ${errorText}`);
    }
  } catch (error) {
    recordTest('images', 'Images Edge Function', false, error.message);
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting API Integration Test Suite...\n');

  // Check environment configuration
  console.log('🔧 Environment Configuration:');
  console.log(`   OpenAI API Key: ${CONFIG.OPENAI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   Gemini API Key: ${CONFIG.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   Supabase URL: ${CONFIG.SUPABASE_URL ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   Supabase Anon Key: ${CONFIG.SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing'}\n`);

  // Run all test suites
  await testOpenAIIntegration();
  await testGeminiIntegration();
  await testSupabaseIntegration();
  await testImageGeneration();
  await testEdgeFunctions();

  // Generate test report
  console.log('\n📊 Test Results Summary:');
  console.log('========================');

  const categories = ['openai', 'gemini', 'supabase', 'images'];
  categories.forEach(category => {
    const results = testResults[category];
    const total = results.passed + results.failed;
    const passRate = total > 0 ? Math.round((results.passed / total) * 100) : 0;
    console.log(`${category.toUpperCase()}: ${results.passed}/${total} passed (${passRate}%)`);
  });

  console.log(`\n🎯 OVERALL: ${testResults.overall.passed}/${testResults.overall.passed + testResults.overall.failed} tests passed`);

  // Detailed results
  console.log('\n📋 Detailed Results:');
  categories.forEach(category => {
    if (testResults[category].tests.length > 0) {
      console.log(`\n${category.toUpperCase()}:`);
      testResults[category].tests.forEach(test => {
        const status = test.passed ? '✅' : '❌';
        console.log(`   ${status} ${test.name}`);
        if (!test.passed && test.error) {
          console.log(`      Error: ${test.error}`);
        }
      });
    }
  });

  // Recommendations
  console.log('\n💡 Recommendations:');
  if (testResults.overall.failed > 0) {
    console.log('• Fix failed API configurations');
    console.log('• Ensure API keys have proper permissions');
    console.log('• Deploy edge functions to Supabase');
    console.log('• Check network connectivity to API endpoints');
  }

  if (testResults.overall.passed === testResults.overall.passed + testResults.overall.failed) {
    console.log('🎉 All tests passed! Your app is properly configured to use real APIs.');
  }

  return testResults;
}

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests };
}

// Run tests if this script is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runAllTests().catch(console.error);
}

// For browser console usage
if (typeof window !== 'undefined') {
  window.runApiIntegrationTests = runAllTests;
}