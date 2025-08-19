// Supabase configuration and utilities for image handling

import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_EVENT_BUCKET, SUPABASE_MEDIA_BUCKET, SUPABASE_PROFILE_BUCKET } from "./constants";



export interface SupabaseConfig {
  url: string;
  anonKey: string;
  mediaBucket: string;
  profileBucket: string;
  eventBucket: string;
}

export const supabaseConfig: SupabaseConfig = {
  url: SUPABASE_URL || '',
  anonKey: SUPABASE_ANON_KEY || '',
  mediaBucket: SUPABASE_MEDIA_BUCKET,
  profileBucket: SUPABASE_PROFILE_BUCKET,
  eventBucket: SUPABASE_EVENT_BUCKET,
};


/**
 * Generate a Supabase storage URL for an image
 * @param filename - The filename (e.g., "uuid.jpg")
 * @returns Full URL to the image in Supabase storage
 */
export function getImageUrl(filename: string | null, bucket: string): string | null {

  if (!filename || !supabaseConfig.url) {
    return null;
  }

  if (!bucket) { return null; }

  return `${supabaseConfig.url}/storage/v1/object/public/${bucket}/${filename}`;

}

/**
 * Generate a Supabase storage URL with transformations
 * @param filename - The filename (e.g., "uuid.jpg")
 * @param options - Image transformation options
 * @returns Full URL to the transformed image
 */
export function getTransformedImageUrl(
  filename: string | null,
  bucket: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): string | null {
  if (!filename || !supabaseConfig.url) {
    return null;
  }

  const baseUrl = getImageUrl(filename, bucket);
  if (!baseUrl) return null;

  const params = new URLSearchParams();
  if (options.width) params.append('width', options.width.toString());
  if (options.height) params.append('height', options.height.toString());
  if (options.quality) params.append('quality', options.quality.toString());
  if (options.format) params.append('format', options.format);
  return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
}

/**
 * Get a thumbnail URL for an image
 * @param filename - The filename
 * @param size - Thumbnail size (default: 150)
 * @returns Thumbnail URL
 */
export function getThumbnailUrl(filename: string | null, bucket: string, size: number = 150): string | null {
  return getTransformedImageUrl(filename, bucket, { width: size, height: size, quality: 80 });
}

/**
 * Get a profile image URL for members
 * @param filename - The filename
 * @param size - Image size (default: 300)
 * @returns Profile image URL
 */
export function getProfileImageUrl(filename: string | null,  size: number = 300): string | null {
  return getTransformedImageUrl(filename, supabaseConfig.profileBucket, { width: size, height: size, quality: 90 });
}

/**
 * Get an event image URL
 * @param filename - The filename
 * @param width - Image width (default: 400)
 * @param height - Image height (default: 250)
 * @returns Event image URL
 */
export function getEventImageUrl(
  filename: string | null,
  width: number = 400,
  height: number = 250
): string | null {
  // Use fallback bucket name if environment variable is not set
  const bucket = supabaseConfig.eventBucket;
  
  const result = getTransformedImageUrl(filename, bucket, { width, height, quality: 85 });
  
  return result;
} 