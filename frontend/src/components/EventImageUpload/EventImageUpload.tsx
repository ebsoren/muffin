import { useState, useRef, useCallback, useEffect } from 'react';
import DelayedLoadingSpinner from '../DelayedLoadingSpinner';
import { supabase } from '../../utils/supabaseClient';
import { SUPABASE_URL } from '../../utils/constants';
import { resizeImageToFitSize } from '../../api';

interface EventImageUploadProps {
  onImageUploaded: (filename: string) => void;
  currentImage?: string | null;
  className?: string;
  eventId?: number | null; // ID of the event being edited
}

export default function EventImageUpload({ onImageUploaded, currentImage, className = ''}: EventImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = useCallback(async (file: File) => {
    // Clear previous errors
    setUploadError(null);

    // Validate file type - only allow PNG, JPEG, and JPG
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please select a valid image file (PNG, JPEG, or JPG only)');
      return;
    }
    
    // Validate file size (200KB limit) and resize if needed
    let fileToUpload = file;
    if (file.size > 200 * 1024) {
      try {
        fileToUpload = await resizeImageToFitSize(file, 200 * 1024);
      } catch (error) {
        setUploadError(`Failed to resize image: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return;
      }
    }

    // Generate preview from the file to upload (either original or resized)
    const url = URL.createObjectURL(fileToUpload);
    setPreviewUrl(url);

    // Start upload
    setIsUploading(true);
    try {
      const BUCKET = 'events';

      // 1) Delete the current event image if it exists
      if (currentImage) {
        const { error: deleteError } = await supabase.storage
          .from(BUCKET)
          .remove([currentImage]);
        
        if (deleteError) {
        }
      }

      // 2) Generate UUID for the new image
      const imageUuid = crypto.randomUUID();
      const fileExtension = fileToUpload.name.split('.').pop() || 'jpg';
      const objectName = `${imageUuid}.${fileExtension}`;
      
      // 3) Upload the new image (use fileToUpload which may be resized)
      const {error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(objectName, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }
      
      // Call the callback with the uploaded file name (UUID)
      onImageUploaded(objectName);
      setUploadError(null);
      
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      // Clean up preview if upload failed
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } finally {
      setIsUploading(false);
    }
  }, [onImageUploaded, currentImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onImageUploaded('');
    setUploadError(null);
  };

  return (
    <div className={`relative ${className}`}>
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-flat-gold transition-colors"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <DelayedLoadingSpinner size="sm" isLoading={isUploading} />
            <span className="text-sm text-gray-500 dark:text-gray-400">Uploading...</span>
          </div>
        ) : previewUrl ? (
          <div className="space-y-3">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg mx-auto border border-gray-300 dark:border-gray-600"
            />
            <div className="flex justify-center space-x-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearImage();
                }}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ) : currentImage ? (
          <div className="space-y-3">
            <img
              src={`${SUPABASE_URL}/storage/v1/object/public/event-images/${currentImage}`}
              alt="Current"
              className="w-24 h-24 object-cover rounded-lg mx-auto border border-gray-300 dark:border-gray-600"
            />
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Click to change image
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium text-flat-gold hover:text-flat-gold-hover">
                Click to upload
              </span>{' '}
              or drag and drop
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              PNG, JPEG, JPG up to 200KB
            </p>
          </div>
        )}
      </div>

      {/* Error Display */}
      {uploadError && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400">
          {uploadError}
        </div>
      )}
    </div>
  );
} 