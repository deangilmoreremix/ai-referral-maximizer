import React, { useState } from 'react';
import { Settings, RefreshCw, Info } from 'lucide-react';
import { useOnboarding } from './OnboardingProvider';

interface AdminControlsProps {
  isVisible: boolean;
}

const AdminControls: React.FC<AdminControlsProps> = ({ isVisible }) => {
  const { resetOnboarding } = useOnboarding();
  const [showPanel, setShowPanel] = useState(false);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="Admin Controls"
      >
        <Settings size={18} />
      </button>
      
      {showPanel && (
        <div className="absolute bottom-12 right-0 bg-white rounded-lg shadow-xl border border-gray-200 w-64 overflow-hidden">
          <div className="bg-gray-800 text-white px-4 py-2 flex items-center">
            <Settings size={16} className="mr-2" />
            <span className="font-medium">Admin Controls</span>
          </div>
          
          <div className="p-4">
            <div className="space-y-3">
              <p className="text-xs text-gray-500 flex items-center mb-2">
                <Info size={14} className="mr-1" />
                These controls are for demonstration purposes
              </p>
              
              <button
                onClick={resetOnboarding}
                className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                <RefreshCw size={14} className="mr-2" />
                Reset Onboarding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminControls;