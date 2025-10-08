import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star, Brain, TrendingUp, Code, Search, Image, Paperclip } from 'lucide-react';

interface MessageEnhancementsProps {
  reasoning?: string;
  qualityScore?: number;
  hasWebSearch?: boolean;
  hasFileAttachment?: boolean;
  hasImageGeneration?: boolean;
  hasCodeExecution?: boolean;
  onShowDetails?: (type: string) => void;
}

export const MessageEnhancements: React.FC<MessageEnhancementsProps> = ({
  reasoning,
  qualityScore,
  hasWebSearch,
  hasFileAttachment,
  hasImageGeneration,
  hasCodeExecution,
  onShowDetails
}) => {
  const [showReasoning, setShowReasoning] = useState(false);

  const getQualityColor = (score?: number): string => {
    if (!score) return 'text-gray-400';
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getQualityLabel = (score?: number): string => {
    if (!score) return 'Not rated';
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs improvement';
  };

  const hasAnyEnhancements = reasoning || qualityScore || hasWebSearch || hasFileAttachment || hasImageGeneration || hasCodeExecution;

  if (!hasAnyEnhancements) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Enhancement Badges */}
      <div className="flex flex-wrap gap-2">
        {qualityScore !== undefined && (
          <div
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 ${getQualityColor(
              qualityScore
            )}`}
          >
            <Star size={12} className="mr-1" />
            {getQualityLabel(qualityScore)} ({qualityScore.toFixed(0)}%)
          </div>
        )}

        {hasWebSearch && (
          <button
            onClick={() => onShowDetails?.('search')}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
          >
            <Search size={12} className="mr-1" />
            Web Search Used
          </button>
        )}

        {hasFileAttachment && (
          <button
            onClick={() => onShowDetails?.('attachments')}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
          >
            <Paperclip size={12} className="mr-1" />
            Attachments
          </button>
        )}

        {hasImageGeneration && (
          <button
            onClick={() => onShowDetails?.('images')}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors"
          >
            <Image size={12} className="mr-1" />
            Image Generated
          </button>
        )}

        {hasCodeExecution && (
          <button
            onClick={() => onShowDetails?.('code')}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
          >
            <Code size={12} className="mr-1" />
            Code Executed
          </button>
        )}
      </div>

      {/* Reasoning Section */}
      {reasoning && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowReasoning(!showReasoning)}
            className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-sm font-medium text-gray-700"
          >
            <span className="flex items-center">
              <Brain size={14} className="mr-2 text-indigo-600" />
              AI Reasoning Process
            </span>
            {showReasoning ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showReasoning && (
            <div className="p-3 bg-white border-t border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{reasoning}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface QualityScoringPanelProps {
  score: number;
  onChange: (score: number) => void;
  disabled?: boolean;
}

export const QualityScoringPanel: React.FC<QualityScoringPanelProps> = ({
  score,
  onChange,
  disabled
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-gray-700 flex items-center">
          <TrendingUp size={16} className="mr-2 text-indigo-600" />
          Response Quality Score
        </label>
        <span className="text-lg font-semibold text-indigo-600">{score.toFixed(0)}%</span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={score}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${score}%, #e5e7eb ${score}%, #e5e7eb 100%)`
        }}
      />

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Poor</span>
        <span>Fair</span>
        <span>Good</span>
        <span>Excellent</span>
      </div>
    </div>
  );
};

export default MessageEnhancements;
