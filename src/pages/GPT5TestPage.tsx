import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import GPT5TestInterface from '../components/GPT5TestInterface';

const GPT5TestPage: React.FC = () => {
  return (
    <AppLayout 
      title="GPT-5 Test Interface" 
      description="Test OpenAI's GPT-5 and other models" 
      navCurrent="app"
    >
      <div className="mb-6">
        <Link
          to="/app"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center w-fit"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Content Generator
        </Link>
      </div>
      
      <GPT5TestInterface />
      
      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
        <div className="flex">
          <Brain size={20} className="text-blue-600 flex-shrink-0 mt-1 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-blue-800 mb-2">About this Test Interface</h3>
            <p className="text-blue-700 mb-3">
              This interface allows you to directly test OpenAI's models, including GPT-5 and its variants. 
              Use this tool to experiment with different prompts and models.
            </p>
            <p className="text-blue-700">
              Use this tool to experiment with different prompts and models to understand their capabilities 
              before integrating them into your referral content generation workflows.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default GPT5TestPage;