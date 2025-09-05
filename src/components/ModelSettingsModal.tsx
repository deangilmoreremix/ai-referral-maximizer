import React, { useState, useEffect } from 'react';
import { X, Settings, Info, AlertCircle } from 'lucide-react';
import AIModelSelector, { AIModel } from './AIModelSelector';
import RelationshipTypeSelector, { RelationshipType } from './RelationshipTypeSelector';

interface ModelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: AIModel;
  relationshipType: RelationshipType | null;
  onUpdateSettings: (settings: { model: AIModel; relationshipType: RelationshipType | null }) => void;
}

const ModelSettingsModal: React.FC<ModelSettingsModalProps> = ({
  isOpen,
  onClose,
  selectedModel,
  relationshipType,
  onUpdateSettings
}) => {
  const [model, setModel] = useState<AIModel>(selectedModel);
  const [relationship, setRelationship] = useState<RelationshipType | null>(relationshipType);

  // Update local state when props change
  useEffect(() => {
    setModel(selectedModel);
    setRelationship(relationshipType);
  }, [selectedModel, relationshipType]);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateSettings({
      model,
      relationshipType: relationship
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Settings className="h-6 w-6 text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Advanced Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <AIModelSelector 
              selectedModel={model}
              onChange={setModel}
            />
            
            <RelationshipTypeSelector 
              selectedRelationship={relationship}
              onChange={setRelationship}
              label="Relationship Context"
            />

            <div className="bg-amber-50 rounded-lg border border-amber-100 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-1 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-amber-800">Important Notes</h3>
                  <p className="mt-1 text-sm text-amber-700">
                    The AI model selection affects generation quality and speed. The relationship context helps tailor the content to specific connection types.
                  </p>
                  <p className="mt-2 text-sm text-amber-700">
                    These settings will be applied to all content generation until you change them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelSettingsModal;