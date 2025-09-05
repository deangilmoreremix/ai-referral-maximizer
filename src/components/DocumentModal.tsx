import React, { useState } from 'react';
import { X, Download, FileCheck, CalendarDays, FileType } from 'lucide-react';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onDownload: () => void;
  fileName: string;
  day?: number;
  hasMultipleDays?: boolean;
  exportFormat?: string;
  exportOptions?: string[];
  onFormatChange?: (format: string) => void;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  onDownload,
  fileName,
  day,
  hasMultipleDays = false,
  exportFormat = 'pdf',
  exportOptions = ['pdf'],
  onFormatChange
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  
  if (!isOpen) return null;
  
  const handleDownload = () => {
    setIsDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      onDownload();
      setIsDownloading(false);
      setIsDownloaded(true);
      
      // Reset download status after showing success
      setTimeout(() => {
        setIsDownloaded(false);
      }, 3000);
    }, 1000);
  };
  
  // Get format icon
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <FileType size={16} className="text-red-500" />;
      case 'pptx':
        return <FileType size={16} className="text-orange-500" />;
      case 'docx':
        return <FileType size={16} className="text-blue-500" />;
      case 'xlsx':
        return <FileType size={16} className="text-green-500" />;
      default:
        return <FileType size={16} className="text-gray-500" />;
    }
  };
  
  // Get format label
  const getFormatLabel = (format: string) => {
    switch (format) {
      case 'pdf':
        return 'PDF Document';
      case 'pptx':
        return 'PowerPoint Presentation';
      case 'docx':
        return 'Word Document';
      case 'xlsx':
        return 'Excel Spreadsheet';
      default:
        return format.toUpperCase();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Document Ready</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-blue-800 font-medium">{title}</p>
            <p className="text-blue-600 text-sm mt-1">File: {fileName}</p>
            
            {hasMultipleDays && day && (
              <div className="flex items-center mt-2 text-blue-600 text-sm">
                <CalendarDays size={16} className="mr-1" />
                <span>Content for Day {day}</span>
              </div>
            )}
          </div>
          
          {/* Export Format Selector */}
          {exportOptions && exportOptions.length > 1 && onFormatChange && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Export Format:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {exportOptions.map((format) => (
                  <div 
                    key={format}
                    onClick={() => onFormatChange(format)}
                    className={`flex items-center p-3 border rounded-md cursor-pointer ${
                      exportFormat === format
                        ? 'bg-blue-50 border-blue-300'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {getFormatIcon(format)}
                    <span className="ml-2 text-sm">{getFormatLabel(format)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <p className="text-gray-600">
            Your document has been prepared and is ready to download. Click the button below to save it to your device.
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleDownload}
            disabled={isDownloading || isDownloaded}
            className={`flex items-center px-4 py-2 rounded-lg font-medium ${
              isDownloaded 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } transition-colors`}
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Preparing...
              </>
            ) : isDownloaded ? (
              <>
                <FileCheck size={18} className="mr-2" />
                Downloaded
              </>
            ) : (
              <>
                <Download size={18} className="mr-2" />
                Download {exportFormat.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;