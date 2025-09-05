import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Phone, Smartphone } from 'lucide-react';

interface ChatbotLinkProps {
  className?: string;
}

const ChatbotLink: React.FC<ChatbotLinkProps> = ({ className = '' }) => {
  return (
    <Link
      to="/chatbot"
      className={`relative group ${className}`}
    >
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white animate-pulse"></div>
      <div className="bg-white p-3 shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 flex items-center max-w-xs">
        <div className="bg-green-100 p-2 rounded-full mr-3">
          <div className="flex">
            <Phone size={20} className="text-green-600" />
            <Smartphone size={20} className="text-green-600 -ml-1" />
          </div>
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-900">Voice & SMS Chatbot</div>
          <div className="text-xs text-gray-500 mt-0.5">Create personalized voice drops and SMS templates</div>
        </div>
      </div>
    </Link>
  );
};

export default ChatbotLink;