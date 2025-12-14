import { api, buildApiPath } from './api';
import type { AuthResponse, LoginRequest, RegisterRequest, User, ApiError, LoginApiResponse, RegisterApiResponse } from '@/types';

class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<RegisterApiResponse>(buildApiPath('/user/register'), data);
      
      // Handle nested response structure: { status: 201, data: { user, token, message } }
      let authData: AuthResponse;
      if (response.data?.data && response.data.status === 201) {
        // Nested structure with status and data wrapper (expected format)
        authData = response.data.data;
      } else {
        // Check for direct structure (backward compatibility)
        const directData = response.data as any;
        if (directData?.user && directData?.token) {
          authData = directData as AuthResponse;
        } else {
          throw new Error('Invalid response format from register endpoint');
        }
      }

      if (authData.token && authData.user) {
        this.setAuthData(authData.token, authData.user);
      }
      return authData;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<LoginApiResponse>(buildApiPath('/user/login'), data);
      
      // Handle nested response structure: { status: 200, data: { user, token, message } }
      let authData: AuthResponse;
      if (response.data?.data && response.data.status === 200) {
        // Nested structure with status and data wrapper
        authData = response.data.data;
      } else if (response.data?.user && response.data?.token) {
        // Direct structure (backward compatibility)
        authData = response.data as AuthResponse;
      } else {
        throw new Error('Invalid response format from login endpoint');
      }

      if (authData.token && authData.user) {
        this.setAuthData(authData.token, authData.user);
      }
      return authData;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>('/auth/users/me');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  logout(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!sessionStorage.getItem('authToken');
  }

  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = sessionStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('authToken');
  }

  private setAuthData(token: string, user: User): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  private handleError(error: any): ApiError {
    if (error.response?.data) {
      return error.response.data as ApiError;
    }
    return {
      error: 'An unexpected error occurred',
      details: { error: error.message || 'Network error' },
      status_code: error.response?.status || 500,
    };
  }
}

export const authService = new AuthService();

