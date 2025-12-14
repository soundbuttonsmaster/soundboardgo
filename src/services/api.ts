import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types';

// Default API URL - can be overridden by setting PUBLIC_API_BASE_URL in .env (optional)
const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://192.168.1.96:8051/api';

// Site name - can be overridden by setting PUBLIC_SITE_NAME in .env (optional)
// If not provided, defaults to 'soundboardgo.com'
function getSiteName(): string {
  // Only use environment variable or default - never use window.location
  return import.meta.env.PUBLIC_SITE_NAME || 'soundboardgo.com';
}

// Helper function to build API path with site name
// This function works in both SSR and client-side contexts
export function buildApiPath(path: string): string {
  const siteName = getSiteName();
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Build path: /{sitename}/{endpoint}
  // Note: The base URL already includes /api, so we just need /{sitename}/{endpoint}
  const apiPath = `/${siteName}/${cleanPath}`;
  return apiPath;
}

// Helper function to build audio URL using API endpoint (avoids CORS issues)
// Format: http://192.168.1.96:8051/api/soundboardgo.com/sounds/{id}/audio
export function buildAudioUrl(soundId: number): string {
  const siteName = getSiteName();
  const audioPath = `/${siteName}/sounds/${soundId}/audio`;
  const fullAudioUrl = `${API_BASE_URL}${audioPath}`;
  return fullAudioUrl;
}

// Helper function to get media base URL from API base URL
// Extracts base URL and adds /media prefix
// Example: http://192.168.1.96:8051/api -> http://192.168.1.96:8051/media
function getMediaBaseUrl(): string {
  // Check if custom media URL is set
  if (import.meta.env.PUBLIC_MEDIA_BASE_URL) {
    return import.meta.env.PUBLIC_MEDIA_BASE_URL;
  }
  
  // Extract base URL from API_BASE_URL (remove /api suffix if present)
  let baseUrl = API_BASE_URL;
  if (baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.slice(0, -4); // Remove '/api'
  } else if (baseUrl.endsWith('/api/')) {
    baseUrl = baseUrl.slice(0, -5); // Remove '/api/'
  }
  
  // Add /media prefix
  return `${baseUrl}/media`;
}

// Helper function to build image/media URL from relative path
// Format: http://192.168.1.96:8051/media/blogs/image.jpg
// If path is already a full URL, returns it as-is
// Otherwise, constructs full URL using API media endpoint
export function buildImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  
  // If already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // Construct full URL using API media endpoint
  const mediaBaseUrl = getMediaBaseUrl();
  return `${mediaBaseUrl}/${cleanPath}`;
}

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth token and log requests
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Token ${token}`;
        }
        
        return config;
      },
      (error: AxiosError) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors and log responses
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError<ApiError>) => {
        // Debug: Log API error
        const fullUrl = error.config ? `${error.config.baseURL || API_BASE_URL}${error.config.url || ''}` : 'Unknown URL';
        console.error('🔴 API Error:', {
          url: fullUrl,
          status: error.response?.status,
          statusText: error.response?.statusText,
          error: error.response?.data || error.message,
          fullError: error,
        });
        
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearToken();
          // Redirect to login if not already there
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('authToken');
  }

  private clearToken(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
  }

  public setToken(token: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem('authToken', token);
  }

  public getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export const apiService = new ApiService();
export const api = apiService.getInstance();

