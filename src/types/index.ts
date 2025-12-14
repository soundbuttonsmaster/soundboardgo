export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: number;
  role_name: string;
  role_code: string;
  is_active: boolean;
  is_verified: boolean;
  phone_number: string | null;
  date_joined: string;
  created_at: string;
  last_login: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// API response wrapper for login endpoint
export interface LoginApiResponse {
  status: number;
  data: AuthResponse;
}

export interface LoginRequest {
  email: string; // Username or email (required, string)
  password: string; // Password (required, string)
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

// API response wrapper for register endpoint
export interface RegisterApiResponse {
  status: number;
  data: AuthResponse;
}

export interface SoundButton {
  id: number;
  name: string;
  sound_file: string;
  sound_file_url: string;
  tag: string | null;
  created_at: string;
  updated_at: string;
  created_by: number;
  created_by_name: string;
  created_by_email: string;
  // Optional fields for UI compatibility
  title?: string; // Alias for name
  audio_url?: string; // Alias for sound_file_url
  category?: string; // Alias for tag
  description?: string;
  image_url?: string;
  tags?: string[];
  play_count?: number;
  // New API fields
  category_id?: number;
  category_name?: string;
  views?: number;
  is_liked?: boolean;
  is_favorited?: boolean;
  likes_count?: number;
  favorites_count?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  sound_count?: number;
  order?: number;
  is_active?: boolean;
  children?: Category[];
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  created_at: string;
  published_at: string | null;
}

export interface BlogsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Blog[];
}

export interface ApiError {
  error: string;
  details: Record<string, string[] | string>;
  status_code?: number;
}

