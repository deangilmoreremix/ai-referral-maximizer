import React, { useState } from 'react';
import { Zap, Send, AlertCircle, CheckCircle } from 'lucide-react';

interface GPT5Request {
  input?: string;
  messages?: Array<{ role: string; content: string }>;
  model?: "gpt-5" | "gpt-5-mini" | "gpt-5-nano";
}

interface GPT5Response {
  model: string;
  text: string;
}

const GPT5TestInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<"gpt-5" | "gpt-5-mini" | "gpt-5-nano">('gpt-5');
  const [response, setResponse] = useState<GPT5Response | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const requestBody: GPT5Request = {
        input: input.trim(),
        model: selectedModel
      };

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration is missing');
      }

      const apiUrl = `${supabaseUrl}/functions/v1/openai-gpt5`;

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data: GPT5Response = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Zap className="h-8 w-8 text-green-600 mr-3" />
          GPT-5 Test Interface
        </h1>
        <p className="text-gray-600 mt-2">
          Test the OpenAI GPT-5 models using the Responses API
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Model Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select GPT-5 Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as "gpt-5" | "gpt-5-mini" | "gpt-5-nano")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="gpt-5">GPT-5 (Full Model)</option>
              <option value="gpt-5-mini">GPT-5 Mini (Faster)</option>
              <option value="gpt-5-nano">GPT-5 Nano (Fastest)</option>
            </select>
          </div>

          {/* Input Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input Text
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your prompt here..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 resize-vertical"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`px-6 py-2 rounded-md text-white font-medium flex items-center ${
                !input.trim() || isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Run with GPT-5
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center">
              <AlertCircle size={20} className="text-red-500 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center mb-3">
              <CheckCircle size={20} className="text-green-500 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Response from {response.model}</h3>
              </div>
            </div>
            <div className="bg-white rounded-md p-4 border border-green-100">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">{response.text}</pre>
            </div>
          </div>
        )}
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Usage Instructions</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Select your preferred GPT-5 model from the dropdown</li>
          <li>• Enter your prompt in the textarea</li>
          <li>• Click "Run with GPT-5" to get a response</li>
          <li>• Responses use the OpenAI Responses API (not deprecated Chat Completions)</li>
        </ul>
      </div>
    </div>
  );
};

export default GPT5TestInterface;