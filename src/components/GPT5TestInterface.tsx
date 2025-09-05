import React, { useState } from 'react';
import { Send, RefreshCw, Copy, Download, AlertCircle, CheckCircle, Brain } from 'lucide-react';
import { OpenAIModel, MODEL_INFO } from '../types/openai';

const GPT5TestInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<OpenAIModel>('gpt-5');
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fallbackNote, setFallbackNote] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setFallbackNote(null);
    setResponse('');
    
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration is missing');
      }
      
      const apiResponse = await fetch(`${supabaseUrl}/functions/v1/openai-gpt5`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: input,
          model: selectedModel
        }),
      });
      
      const data = await apiResponse.json();
      
      if (!apiResponse.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }
      
      setResponse(data.text || '');
      
      if (data.fallback_note) {
        setFallbackNote(data.fallback_note);
      }
      
    } catch (err: any) {
      console.error('Error generating content:', err);
      setError(err.message || 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([response], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gpt5-response-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center">
            <Brain size={24} className="mr-3" />
            <div>
              <h1 className="text-2xl font-bold">GPT-5 Test Interface</h1>
              <p className="text-purple-100 text-sm mt-1">
                Test OpenAI's GPT-5 and other models using the Responses API
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Model
              </label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as OpenAIModel)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                {Object.entries(MODEL_INFO).map(([model, info]) => (
                  <option key={model} value={model}>
                    {info.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {MODEL_INFO[selectedModel].description}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model Info
              </label>
              <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Speed:</span>
                    <span className="capitalize">{MODEL_INFO[selectedModel].speed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality:</span>
                    <span className="capitalize">{MODEL_INFO[selectedModel].quality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available:</span>
                    <span className={MODEL_INFO[selectedModel].available ? 'text-green-600' : 'text-amber-600'}>
                      {MODEL_INFO[selectedModel].available ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="input-textarea" className="block text-sm font-medium text-gray-700 mb-2">
              Your Prompt
            </label>
            <textarea
              id="input-textarea"
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter your prompt here... (Cmd/Ctrl + Enter to generate)"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500 shadow-sm"
              disabled={isGenerating}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                Press Cmd/Ctrl + Enter to generate, or use the button below
              </p>
              <span className="text-xs text-gray-500">
                {input.length} characters
              </span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!input.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-md hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={18} className="mr-2 animate-spin" />
                Running with {MODEL_INFO[selectedModel].name}...
              </>
            ) : (
              <>
                <Send size={18} className="mr-2" />
                Run with {MODEL_INFO[selectedModel].name}
              </>
            )}
          </button>
        </div>

        {/* Response Area */}
        <div className="p-6">
          {fallbackNote && (
            <div className="mb-4 bg-amber-50 border-l-4 border-amber-400 p-3">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm text-amber-700">
                    <strong>Fallback Model Used:</strong> {fallbackNote}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-3">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-gray-900">Response</h3>
            {response && (
              <div className="flex space-x-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {copied ? (
                    <>
                      <CheckCircle size={16} className="mr-1 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="mr-1" />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download size={16} className="mr-1" />
                  Download
                </button>
              </div>
            )}
          </div>

          <div className="border border-gray-300 rounded-md bg-gray-50 min-h-[300px] p-4">
            {isGenerating ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
                  <p className="text-gray-600">Generating response...</p>
                  <p className="text-sm text-gray-500 mt-1">Using {MODEL_INFO[selectedModel].name}</p>
                </div>
              </div>
            ) : response ? (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                  {response}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <Brain size={48} className="mx-auto mb-3" />
                  <p>Enter a prompt and click "Run" to generate content</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPT5TestInterface;