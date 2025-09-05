import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ContentCategorySelectorProps {
  categories: Record<string, string>;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const ContentCategorySelector: React.FC<ContentCategorySelectorProps> = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 gap-2">
      <label className="text-sm font-medium text-gray-700">
        Filter by category:
      </label>
      <div className="relative categories-selector">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          {Object.entries(categories).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default ContentCategorySelector;