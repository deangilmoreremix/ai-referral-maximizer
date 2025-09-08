import React, { useState } from 'react';
import { Edit3, Upload, Sparkles, AlertCircle, CheckCircle, Download } from 'lucide-react';

interface ImageEditorProps {
  onImageEdited?: (imageUrl: string, prompt: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ onImageEdited }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedResult, setEditedResult] = useState<string | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImage = async () => {
    if (!prompt.trim() || !selectedImage) return;

    setIsEditing(true);
    setError(null);
    setEditedResult(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!supabaseUrl || !supabaseAnonKey || !geminiApiKey) {
        throw new Error('Configuration is missing');
      }

      // Convert image to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedImage);
      });

      const base64Data = await base64Promise;
      const base64 = base64Data.split(',')[1]; // Remove data:image/jpeg;base64, prefix

      const apiUrl = `${supabaseUrl}/functions/v1/gemini-images`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'x-gemini-api-key': geminiApiKey,
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          imageBase64: base64,
          model: 'gemini-2.0-flash-exp'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.description) {
        setEditedResult(data.description);
        onImageEdited?.(data.description, prompt); // Note: This returns description, not image URL
      } else {
        throw new Error('No result returned');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to edit image');
    } finally {
      setIsEditing(false);
    }
  };

  const resetEditor = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setPrompt('');
    setEditedResult(null);
    setError(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Edit3 className="h-5 w-5 text-blue-600 mr-2" />
          Nano Banana Image Editor
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Edit images using Gemini AI with natural language prompts
        </p>
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Image to Edit
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          {imagePreview ? (
            <div className="space-y-4">
              <img
                src={imagePreview}
                alt="Selected"
                className="max-w-full h-auto max-h-64 mx-auto rounded-lg"
              />
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Remove Image
              </button>
            </div>
          ) : (
            <div>
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Click to upload an image</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer inline-block"
              >
                Choose File
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Edit Prompt */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Edit Instructions
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe how you want to edit the image (e.g., 'Make it brighter', 'Add a sunset background', 'Change to black and white')"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-vertical"
          disabled={isEditing}
        />
      </div>

      {/* Edit Button */}
      <div className="mb-4">
        <button
          onClick={handleEditImage}
          disabled={!prompt.trim() || !selectedImage || isEditing}
          className={`w-full px-4 py-2 rounded-md text-white font-medium flex items-center justify-center ${
            !prompt.trim() || !selectedImage || isEditing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isEditing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Editing Image...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Edit Image
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Edited Result Display */}
      {editedResult && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center mb-3">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <p className="text-sm font-medium text-green-800">Image Edited Successfully!</p>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Edit Result:</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{editedResult}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(editedResult)}
              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
            >
              Copy Result
            </button>
            <button
              onClick={resetEditor}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium"
            >
              Edit Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;