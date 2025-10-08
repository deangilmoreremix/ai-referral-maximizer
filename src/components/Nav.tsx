import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, MessageSquare, FileText, LayoutDashboard, LinkIcon, Sparkles, Home, DollarSign, Settings, User, Brain, Building2, Briefcase } from 'lucide-react';

interface NavProps {
  current: 'app' | 'methods' | 'chatbot' | 'dashboard' | 'super' | 'landing' | 'pricing' | 'consultant' | 'agency' | 'personalize' | 'ai-settings';
}

const Nav: React.FC<NavProps> = ({ current }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <UserPlus className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform duration-200" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">AI Referral Maximizer</h1>
            </Link>
          </div>
          <div className="flex space-x-2 md:space-x-4">
            <Link
              to="/"
              className={`flex items-center px-2 py-1 md:px-3 md:py-2 text-sm font-medium rounded-md transition-colors ${
                current === 'landing'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title="Home"
            >
              <Home size={16} className="mr-0 md:mr-2" />
              <span className="hidden md:inline">Home</span>
            </Link>
            
            <Link
              to="/personalize"
              className={`flex items-center px-2 py-1 md:px-3 md:py-2 text-sm font-medium rounded-md transition-colors ${
                current === 'personalize'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title="Personalize"
            >
              <User size={16} className="mr-0 md:mr-2" />
              <span className="hidden md:inline">Personalize</span>
            </Link>
            
            <Link
              to="/ai-settings"
              className={`flex items-center px-2 py-1 md:px-3 md:py-2 text-sm font-medium rounded-md transition-colors ${
                current === 'ai-settings'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title="AI Settings"
            >
              <Brain size={16} className="mr-0 md:mr-2" />
              <span className="hidden md:inline">AI Settings</span>
            </Link>
            
            <Link
              to="/content-generator"
              className={`flex items-center px-2 py-1 md:px-3 md:py-2 text-sm font-medium rounded-md transition-colors ${
                current === 'app'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title="Content Generator"
            >
              <FileText size={16} className="mr-0 md:mr-2" />
              <span className="hidden md:inline">Content</span>
            </Link>
            
            <Link
              to="/super-creator"
              className={`flex items-center px-2 py-1 md:px-3 md:py-2 text-sm font-medium rounded-md transition-colors ${
                current === 'super'
                  ? 'bg-green-600 text-white'
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }`}
              title="Super Creator"
            >
              <Sparkles size={16} className="mr-0 md:mr-2" />
              <span className="hidden md:inline">Super Creator</span>
            </Link>

            <Link
              to="/consultant"
              className={`flex items-center px-2 py-1 md:px-3 md:py-2 text-sm font-medium rounded-md transition-colors ${
                current === 'consultant'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title="Consultant"
            >
              <Briefcase size={16} className="mr-0 md:mr-2" />
              <span className="hidden md:inline">Consultant</span>
            </Link>
            
            <Link
              to="/agency"
              className={`flex items-center px-2 py-1 md:px-3 md:py-2 text-sm font-medium rounded-md transition-colors ${
                current === 'agency'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title="Agency"
            >
              <Building2 size={16} className="mr-0 md:mr-2" />
              <span className="hidden md:inline">Agency</span>
            </Link>
            
            <Link
              to="/dashboard"
              className={`flex items-center px-2 py-1 md:px-3 md:py-2 text-sm font-medium rounded-md transition-colors ${
                current === 'dashboard'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title="Dashboard"
            >
              <LayoutDashboard size={16} className="mr-0 md:mr-2" />
              <span className="hidden md:inline">Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;