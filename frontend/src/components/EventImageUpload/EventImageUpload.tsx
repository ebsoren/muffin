import { useState, useRef, useCallback, useEffect } from 'react';
import { uploadImageToSupabase, validateImageFile, generatePreviewUrl, revokePreviewUrl} from '../../utils/supabaseUpload';
import { getEventImageUrl } from '../../utils/supabase';

interface EventImageUploadProps {
  onImageUploaded: (filename: string) => void;
  currentImage?: string | null;
  className?: string;
  ID?: number | null;
}

export default function EventImageUpload({ onImageUploaded, currentImage, className = '', ID }: EventImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);



  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        revokePreviewUrl(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = useCallback(async (file: File) => {
    // Clear previous errors
    setUploadError(null);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      return;
    }

    // Generate preview
    const preview = generatePreviewUrl(file);
    setPreviewUrl(preview);

    // Start upload
    setIsUploading(true);
    try {
      const result = await uploadImageToSupabase(file, "event", ID?.toString() || null);
      
      if (result.success && result.filename) {
        onImageUploaded(result.filename);
        setUploadError(null);
      } else {
        setUploadError(result.error || 'Upload failed');
        // Clean up preview if upload failed
        if (preview) {
          revokePreviewUrl(preview);
          setPreviewUrl(null);
        }
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      // Clean up preview if upload failed
      if (preview) {
        revokePreviewUrl(preview);
        setPreviewUrl(null);
      }
    } finally {
      setIsUploading(false);
    }
  }, [onImageUploaded, ID]);

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
      revokePreviewUrl(previewUrl);
      setPreviewUrl(null);
    }
    onImageUploaded('');
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get the current image URL
  const currentImageUrl = currentImage ? getEventImageUrl(currentImage, 400, 250) : null;

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Event Image
      </label>
      
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isUploading
            ? 'border-flat-gold bg-yellow-50 dark:bg-yellow-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-flat-gold dark:hover:border-flat-gold'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-flat-gold mx-auto"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
          </div>
        ) : previewUrl || currentImageUrl ? (
          <div className="space-y-2">
            <div className="relative inline-block">
              <img
                src={previewUrl || currentImageUrl || '/default-event-image.svg'}
                alt="Preview"
                className="w-48 h-32 rounded-lg object-cover mx-auto border-2 border-gray-200 dark:border-gray-600"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                x
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {previewUrl ? 'New image selected' : 'Current image'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <button
                type="button"
                onClick={handleClick}
                className="font-medium text-flat-gold hover:text-flat-gold-hover transition-colors"
              >
                Click to upload
              </button>
              <span className="mx-2">or drag and drop</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, WebP up to 5MB (Recommended: 16:9 aspect ratio)
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="text-red-600 dark:text-red-400 text-sm">
          {uploadError}
        </div>
      )}
    </div>
  );
} 