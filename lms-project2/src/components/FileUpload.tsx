import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  maxSize?: number;
  className?: string;
}

export function FileUpload({ 
  onFileSelect, 
  acceptedTypes = ['application/pdf', 'video/*', 'image/*'],
  maxFiles = 5,
  maxSize = 50 * 1024 * 1024, // 50MB
  className = ''
}: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileSelect(acceptedFiles);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles,
    maxSize,
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        {isDragActive ? (
          <p className="text-blue-600 dark:text-blue-400">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports PDF, videos, and images up to {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </div>
        )}
      </div>

      {/* File list */}
      {acceptedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Files:</h4>
          {acceptedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({Math.round(file.size / 1024)} KB)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection errors */}
      {fileRejections.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-red-700 dark:text-red-400">Rejected Files:</h4>
          {fileRejections.map(({ file, errors }, index) => (
            <div key={index} className="p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
              <p className="text-sm text-red-700 dark:text-red-400">{file.name}</p>
              <ul className="text-xs text-red-600 dark:text-red-400 mt-1">
                {errors.map((error, i) => (
                  <li key={i}>• {error.message}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}