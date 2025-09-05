import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface CSVColumn {
  name: string;
  index: number;
  mappedTo: string | null;
}

interface PersonalizationField {
  id: string;
  name: string;
  description: string;
  required?: boolean;
}

interface CSVColumnMapperProps {
  columns: CSVColumn[];
  personalizationFields: PersonalizationField[];
  onMappingChange: (columnIndex: number, mappedTo: string | null) => void;
  csvData: string[][];
}

const CSVColumnMapper: React.FC<CSVColumnMapperProps> = ({ 
  columns, 
  personalizationFields,
  onMappingChange,
  csvData
}) => {
  const [previewCount, setPreviewCount] = useState(3);
  
  // Get preview data (excluding header row)
  const previewData = csvData.slice(1, previewCount + 1);
  
  return (
    <div>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Map your CSV columns to the appropriate fields. Drag columns from your CSV to the corresponding field, or select from the dropdown. <strong>Name</strong> field is required.
            </p>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                CSV Column
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                Sample Data
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Map To Field
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {columns.map((column, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm border-r">
                  <span className="font-medium text-gray-900">{column.name}</span>
                </td>
                <td className="px-4 py-3 text-sm border-r">
                  <div className="space-y-1">
                    {previewData.map((row, rowIdx) => (
                      <div key={rowIdx} className="text-gray-500 truncate max-w-xs">
                        {row[column.index]}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <select
                    value={column.mappedTo || ''}
                    onChange={(e) => onMappingChange(idx, e.target.value || null)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  >
                    <option value="">Do not use</option>
                    {personalizationFields.map((field) => (
                      <option key={field.id} value={field.id}>
                        {field.name} {field.required ? '(Required)' : ''}
                      </option>
                    ))}
                  </select>
                  {column.mappedTo && (
                    <p className="mt-1 text-xs text-gray-500">
                      {personalizationFields.find(f => f.id === column.mappedTo)?.description}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {csvData.length > previewCount + 1 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setPreviewCount(prev => Math.min(prev + 3, csvData.length - 1))}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Show more preview rows
          </button>
        </div>
      )}
    </div>
  );
};

export default CSVColumnMapper;