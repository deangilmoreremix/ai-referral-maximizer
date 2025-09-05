import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

interface StoredContent {
  content: string;
  timestamp: number;
}

interface SavedContentHistoryProps {
  contentStorage: Record<string, StoredContent>;
  contentTypes: Record<string, any>;
  onSelectContent: (contentType: string) => void;
}

const SavedContentHistory: React.FC<SavedContentHistoryProps> = ({
  contentStorage,
  contentTypes,
  onSelectContent
}) => {
  // Sort content by timestamp (most recent first)
  const sortedContent = Object.entries(contentStorage)
    .sort(([, a], [, b]) => b.timestamp - a.timestamp);
  
  if (sortedContent.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Clock size={20} className="text-blue-600 mr-2" />
          Content History
        </h2>
        <div className="text-center py-6 text-gray-500">
          <p>No content has been generated yet.</p>
          <p className="text-sm mt-2">Generated content will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <Clock size={20} className="text-blue-600 mr-2" />
        Saved Content History
      </h2>
      <div className="space-y-3">
        {sortedContent.map(([contentType, data]) => {
          const config = contentTypes[contentType];
          if (!config) return null;
          
          const date = new Date(data.timestamp);
          const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
          
          return (
            <div 
              key={contentType} 
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onSelectContent(contentType)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {config.icon}
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-800">{config.title}</h3>
                    <p className="text-sm text-gray-500">Generated: {formattedDate}</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-blue-600" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedContentHistory;