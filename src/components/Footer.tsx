import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Home, FileText, MessageSquare, LayoutDashboard, Sparkles, Building2, Briefcase, User, Brain } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 py-3">
      <div className="max-w-7xl mx-auto px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-3">
          <UserPlus className="h-5 w-5 text-green-500" />
          <span className="ml-2 text-base font-bold text-white">AI Referral Maximizer</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">Navigation</h3>
            <ul className="space-y-1">
              <li><Link to="/" className="text-xs text-gray-300 hover:text-white flex items-center"><Home size={12} className="mr-1" />Home</Link></li>
              <li><Link to="/personalize" className="text-xs text-gray-300 hover:text-white flex items-center"><User size={12} className="mr-1" />Personalize</Link></li>
              <li><Link to="/ai-settings" className="text-xs text-gray-300 hover:text-white flex items-center"><Brain size={12} className="mr-1" />AI Settings</Link></li>
              <li><Link to="/content-generator" className="text-xs text-gray-300 hover:text-white flex items-center"><FileText size={12} className="mr-1" />Content Generator</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">Tools</h3>
            <ul className="space-y-1">
              <li><Link to="/super-creator" className="text-xs text-gray-300 hover:text-white flex items-center"><Sparkles size={12} className="mr-1" />Super Creator</Link></li>
              <li><Link to="/consultant" className="text-xs text-gray-300 hover:text-white flex items-center"><Briefcase size={12} className="mr-1" />Consultant</Link></li>
              <li><Link to="/agency" className="text-xs text-gray-300 hover:text-white flex items-center"><Building2 size={12} className="mr-1" />Agency</Link></li>
              <li><Link to="/dashboard" className="text-xs text-gray-300 hover:text-white flex items-center"><LayoutDashboard size={12} className="mr-1" />Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">Resources</h3>
            <ul className="space-y-1">
              <li><Link to="/resources/guide" className="text-xs text-gray-300 hover:text-white">Guide</Link></li>
              <li><Link to="/resources/api" className="text-xs text-gray-300 hover:text-white">API</Link></li>
              <li><Link to="/resources/documentation" className="text-xs text-gray-300 hover:text-white">Documentation</Link></li>
              <li><Link to="/resources/templates" className="text-xs text-gray-300 hover:text-white">Templates</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">Company</h3>
            <ul className="space-y-1">
              <li><Link to="/about" className="text-xs text-gray-300 hover:text-white">About</Link></li>
              <li><Link to="/pricing" className="text-xs text-gray-300 hover:text-white">Pricing</Link></li>
              <li><Link to="/contact" className="text-xs text-gray-300 hover:text-white">Contact</Link></li>
              <li><Link to="/privacy" className="text-xs text-gray-300 hover:text-white">Privacy</Link></li>
              <li><Link to="/terms" className="text-xs text-gray-300 hover:text-white">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} AI Referral Maximizer
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;