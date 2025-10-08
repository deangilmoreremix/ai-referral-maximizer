import React, { useRef, useState } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadButtonProps {
  onFileSelect: (file: File) => Promise<void>;
  accept?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFileSelect,
  accept = '.pdf,.doc,.docx,.txt,.csv,.json',
  maxSize = 10,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    try {
      setUploading(true);
      await onFileSelect(file);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || uploading}
      />

      <button
        onClick={handleClick}
        disabled={disabled || uploading}
        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {uploading ? (
          <>
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full" />
            Uploading...
          </>
        ) : (
          <>
            <Upload size={16} className="mr-2" />
            Attach File
          </>
        )}
      </button>

      {error && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-red-50 border border-red-200 rounded-md p-2 flex items-start text-sm text-red-700">
          <AlertCircle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

interface AttachmentDisplayProps {
  fileName: string;
  fileSize: number;
  fileType: string;
  onRemove?: () => void;
  downloadUrl?: string;
}

export const AttachmentDisplay: React.FC<AttachmentDisplayProps> = ({
  fileName,
  fileSize,
  fileType,
  onRemove,
  downloadUrl
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('doc')) return '📝';
    if (type.includes('text')) return '📋';
    if (type.includes('image')) return '🖼️';
    if (type.includes('csv') || type.includes('excel')) return '📊';
    return '📎';
  };

  return (
    <div className="inline-flex items-center bg-gray-100 rounded-lg px-3 py-2 text-sm border border-gray-200">
      <span className="mr-2 text-lg">{getFileIcon(fileType)}</span>

      <div className="flex-1 min-w-0">
        {downloadUrl ? (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline truncate block"
          >
            {fileName}
          </a>
        ) : (
          <span className="font-medium text-gray-900 truncate block">{fileName}</span>
        )}
        <span className="text-xs text-gray-500">{formatFileSize(fileSize)}</span>
      </div>

      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-2 text-gray-400 hover:text-red-600 transition-colors"
          title="Remove attachment"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default FileUploadButton;
