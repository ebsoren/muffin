// API Response Types
export interface ApiResponse<T = any> {
  success?: boolean;
  error?: string;
  data?: T;
}

// Health Check
export interface HealthCheckResponse {
  status: string;
}

// Image Upload
export interface ImageUploadRequest {
  file: File;
  bucket_type: 'media' | 'profile' | 'event';
  file_id?: string;
}

export interface ImageUploadResponse {
  success: boolean;
  filename: string;
  url: string;
  bucket: string;
}

// Admin Status
export interface AdminStatusResponse {
  is_admin: boolean;
}

// Member Status
export interface MemberStatusResponse {
  is_member: boolean;
  email: string;
  id: string;
  is_admin: boolean;
}

// Profile Update
export interface ProfileUpdateRequest {
  email: string;
  name: string;
  linkedIn?: string;
  title?: string;
  image?: File;
}

export interface ProfileUpdateResponse {
  success: boolean;
  member: Member;
}

// Member Types
export interface Member {
  id: string;
  name: string;
  linkedIn: string | null;
  title: string | null;
  board: boolean;
  image: string | null;
}

export interface MemberCreateRequest {
  name: string;
  linkedIn?: string;
  title?: string;
  board?: boolean;
  image?: string;
  id?: number;
}

export interface MemberUpdateRequest extends Partial<MemberCreateRequest> {
  id: number;
}

// Event Types
export interface Event {
  id: number;
  title: string | null;
  description: string | null;
  date: string | null;
  location: string | null;
  event_type: 'club' | 'recruiting' | 'featured';
  image: string | null;
}

export interface EventCreateRequest {
  title: string;
  description?: string;
  date?: string;
  location?: string;
  event_type: 'club' | 'recruiting' | 'featured';
  image?: string;
  id?: number;
}

export interface EventUpdateRequest extends Partial<EventCreateRequest> {
  id: number;
}

// Allowed Email Types
export interface AllowedEmail {
  email: string;
}

export interface AllowedEmailCreateRequest {
  email: string;
}


