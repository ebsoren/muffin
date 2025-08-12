export interface UploadResult {
  success: boolean;
  filename?: string;
  error?: string;
  url?: string;
}
/**
 * Upload an image file to Supabase storage via backend endpoint
 * @param file - The file to upload
 * @param bucket - The bucket type ('media', 'profile', 'event')
 * @param ID - Optional ID for the file
 * @returns Promise with upload result
 */
export async function uploadImageToSupabase(file: File, bucket: string, ID: string | null): Promise<UploadResult> {
  if (!import.meta.env.VITE_SUPABASE_URL) {
    return {
      success: false,
      error: 'API URL not configured. Please check your environment variables.'
    };
  }

  try {
    console.log('Starting upload via backend:', {
      filename: file.name,
      bucket: bucket,
      fileSize: file.size,
      fileType: file.type
    });

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket_type', bucket);
    if (ID) {
      formData.append('file_id', ID);
    }

    // Upload via backend endpoint (which uses service role key securely)
    const response = await fetch(`${import.meta.env.VITE_API_URL}/upload-image/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Upload failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Backend upload successful:', data);

    return {
      success: true,
      filename: data.filename,
      url: data.url
    };

  } catch (error) {
    console.error('Backend upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

/**
 * Validate file before upload
 * @param file - The file to validate
 * @returns Validation result
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 5MB'
    };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, and WebP images are allowed'
    };
  }

  return { valid: true };
}

/**
 * Generate a preview URL for an uploaded file
 * @param file - The file to preview
 * @returns Preview URL
 */
export function generatePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Clean up preview URL to prevent memory leaks
 * @param url - The preview URL to revoke
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
} 