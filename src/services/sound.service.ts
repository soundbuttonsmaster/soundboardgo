import { api, buildApiPath, buildAudioUrl } from './api';
import type { SoundButton, Category, ApiError } from '@/types';

class SoundService {
  /**
   * Get all sounds with optional filtering
   * @param params - Query parameters: tag, search, category (category_id as integer), page, page_size
   * @returns Array of sounds
   */
  async getSounds(params?: {
    tag?: string;
    search?: string;
    category?: number | string;
    page?: number;
    page_size?: number;
  }): Promise<SoundButton[]> {
    try {
      const apiPath = buildApiPath('sounds');
      
      // Prepare query parameters
      const queryParams: Record<string, any> = {};
      
      // Handle category - ensure it's an integer
      if (params?.category !== undefined) {
        const categoryId = typeof params.category === 'string' 
          ? parseInt(params.category, 10) 
          : params.category;
        if (!isNaN(categoryId)) {
          queryParams.category = categoryId;
        }
      }
      
      // Handle other parameters
      if (params?.tag) {
        queryParams.tag = params.tag;
      }
      if (params?.search) {
        queryParams.search = params.search;
      }
      if (params?.page !== undefined) {
        queryParams.page = params.page;
      }
      if (params?.page_size !== undefined) {
        // Ensure page_size doesn't exceed max of 100
        queryParams.page_size = Math.min(params.page_size, 100);
      }
      
      const response = await api.get(apiPath, { params: queryParams });
      
      // Handle different response formats:
      // 1. New format: { status: 200, data: { count, next, previous, results: [...] } }
      // 2. Old format: { results: [...] } or directly [...]
      let sounds: any[] = [];
      
      if (response.data?.data?.results) {
        // New format with nested data.results
        sounds = response.data.data.results;
      } else if (response.data?.results) {
        // Format with results property
        sounds = response.data.results;
      } else if (Array.isArray(response.data)) {
        // Direct array format
        sounds = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Nested data array
        sounds = response.data.data;
      }
      
      // Map backend response to UI-compatible format
      const mappedSounds = sounds.map(this.mapSoundToUI);
      
      return mappedSounds;
    } catch (error: any) {
      console.error('📦 SoundService.getSounds - Error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get all sounds with optional filtering and pagination info
   * @param params - Query parameters: tag, search, category (category_id as integer), page, page_size
   * @returns Object with sounds array and pagination info
   */
  async getSoundsWithPagination(params?: {
    tag?: string;
    search?: string;
    category?: number | string;
    page?: number;
    page_size?: number;
  }): Promise<{
    sounds: SoundButton[];
    hasMore: boolean;
    next: string | null;
    count?: number;
  }> {
    try {
      const apiPath = buildApiPath('sounds');
      
      // Prepare query parameters
      const queryParams: Record<string, any> = {};
      
      // Handle category - ensure it's an integer
      if (params?.category !== undefined) {
        const categoryId = typeof params.category === 'string' 
          ? parseInt(params.category, 10) 
          : params.category;
        if (!isNaN(categoryId)) {
          queryParams.category = categoryId;
        }
      }
      
      // Handle other parameters
      if (params?.tag) {
        queryParams.tag = params.tag;
      }
      if (params?.search) {
        queryParams.search = params.search;
      }
      if (params?.page !== undefined) {
        queryParams.page = params.page;
      }
      if (params?.page_size !== undefined) {
        // Ensure page_size doesn't exceed max of 100
        queryParams.page_size = Math.min(params.page_size, 100);
      }
      
      const response = await api.get(apiPath, { params: queryParams });
      
      // Handle different response formats:
      // 1. New format: { status: 200, data: { count, next, previous, results: [...] } }
      // 2. Old format: { results: [...] } or directly [...]
      let sounds: any[] = [];
      let hasMore = false;
      let next: string | null = null;
      let count: number | undefined = undefined;
      
      if (response.data?.data?.results) {
        // New format with nested data.results and pagination
        sounds = response.data.data.results;
        hasMore = !!response.data.data.next;
        next = response.data.data.next || null;
        count = response.data.data.count;
      } else if (response.data?.results) {
        // Format with results property and pagination
        sounds = response.data.results;
        hasMore = !!response.data.next;
        next = response.data.next || null;
        count = response.data.count;
      } else if (Array.isArray(response.data)) {
        // Direct array format (no pagination info)
        sounds = response.data;
        // If using pagination, check if we got fewer results than requested
        if (params?.page_size !== undefined) {
          hasMore = sounds.length === params.page_size;
        }
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Nested data array
        sounds = response.data.data;
        if (params?.page_size !== undefined) {
          hasMore = sounds.length === params.page_size;
        }
      }
      
      // Map backend response to UI-compatible format
      const mappedSounds = sounds.map(this.mapSoundToUI);
      
      // If using pagination, check if we got fewer results than requested
      if (params?.page_size !== undefined && hasMore === false && next === null) {
        hasMore = mappedSounds.length === params.page_size;
      }
      
      return {
        sounds: mappedSounds,
        hasMore,
        next,
        count,
      };
    } catch (error: any) {
      console.error('📦 SoundService.getSoundsWithPagination - Error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get a specific sound by ID
   * @param id - Sound ID
   * @returns Sound object
   */
  async getSoundById(id: number): Promise<SoundButton> {
    try {
      const apiPath = buildApiPath(`sounds/${id}`);
      
      const response = await api.get(apiPath);
      
      const mappedSound = this.mapSoundToUI(response.data);
      
      return mappedSound;
    } catch (error: any) {
      console.error('🔊 SoundService.getSoundById - Error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get related sounds for a specific sound
   * @param id - Sound ID
   * @param limit - Maximum number of related sounds to return (optional, default: 10, max: 50)
   * @param page - Page number for pagination (optional)
   * @param page_size - Items per page (optional, max 100)
   * @returns Object with sounds array and pagination info
   */
  async getRelatedSounds(
    id: number,
    limit?: number,
    page?: number,
    page_size?: number
  ): Promise<{
    sounds: SoundButton[];
    hasMore: boolean;
    next: string | null;
    count?: number;
  }> {
    try {
      const apiPath = buildApiPath(`sounds/${id}/related`);
      
      // Prepare query parameters
      const queryParams: Record<string, any> = {};
      if (limit !== undefined) {
        queryParams.limit = Math.min(limit, 50); // Max 50
      }
      if (page !== undefined) {
        queryParams.page = page;
      }
      if (page_size !== undefined) {
        queryParams.page_size = Math.min(page_size, 100); // Max 100
      }
      
      const response = await api.get(apiPath, { params: queryParams });
      
      // Handle response format: { status: 200, data: { count, next, previous, results: [...] } }
      let sounds: any[] = [];
      let hasMore = false;
      let next: string | null = null;
      let count: number | undefined = undefined;
      
      if (response.data?.data?.results) {
        // New format with nested data.results
        sounds = response.data.data.results;
        count = response.data.data.count;
        next = response.data.data.next;
        hasMore = !!next;
      } else if (response.data?.results) {
        // Format with results property
        sounds = response.data.results;
        count = response.data.count;
        next = response.data.next;
        hasMore = !!next;
      } else if (Array.isArray(response.data)) {
        // Direct array format
        sounds = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Nested data array
        sounds = response.data.data;
      }
      
      // Map backend response to UI-compatible format
      const mappedSounds = sounds.map(this.mapSoundToUI);
      
      // Filter out the current sound from related sounds
      const filteredSounds = mappedSounds.filter(s => s.id !== id);
      
      return {
        sounds: filteredSounds,
        hasMore,
        next,
        count,
      };
    } catch (error: any) {
      console.error('🔗 SoundService.getRelatedSounds - Error:', error);
      // Return empty result instead of throwing to prevent breaking the page
      return {
        sounds: [],
        hasMore: false,
        next: null,
        count: 0,
      };
    }
  }

  /**
   * Get new sounds (sorted by created_at descending)
   * @param limit - Maximum number of sounds to return (for backward compatibility)
   * @param page - Page number for pagination
   * @param page_size - Number of sounds per page
   * @returns Object with sounds array and pagination info
   */
  async getNewSounds(
    limit?: number,
    page?: number,
    page_size?: number
  ): Promise<{
    sounds: SoundButton[];
    hasMore: boolean;
    next: string | null;
    count?: number;
  }> {
    try {
      const apiPath = buildApiPath('sounds/new');
      
      // Prepare query parameters
      const queryParams: Record<string, any> = {};
      if (page !== undefined) {
        queryParams.page = page;
      }
      if (page_size !== undefined) {
        queryParams.page_size = Math.min(page_size, 100);
      } else if (limit !== undefined) {
        // Use limit as page_size if provided for backward compatibility
        queryParams.page_size = Math.min(limit, 100);
      }
      
      // Use the dedicated endpoint for new sounds
      const response = await api.get(apiPath, { params: queryParams });
      
      // Handle different response formats
      let sounds: any[] = [];
      let hasMore = false;
      let next: string | null = null;
      let count: number | undefined = undefined;
      
      if (response.data?.data?.results) {
        // New format with nested data.results and pagination
        sounds = response.data.data.results;
        hasMore = !!response.data.data.next;
        next = response.data.data.next || null;
        count = response.data.data.count;
      } else if (response.data?.results) {
        // Format with results property and pagination
        sounds = response.data.results;
        hasMore = !!response.data.next;
        next = response.data.next || null;
        count = response.data.count;
      } else if (Array.isArray(response.data)) {
        // Direct array format (no pagination info)
        sounds = response.data;
      } else if (response.data?.sounds) {
        sounds = response.data.sounds;
        hasMore = !!response.data.next;
        next = response.data.next || null;
        count = response.data.count;
      }
      
      // Map backend response to UI-compatible format
      const mappedSounds = sounds.map(this.mapSoundToUI);
      
      // Apply limit if provided (for backward compatibility when not using pagination)
      let finalSounds = mappedSounds;
      if (limit !== undefined && page === undefined && page_size === undefined) {
        finalSounds = mappedSounds.slice(0, limit);
        hasMore = mappedSounds.length > limit;
      } else {
        // If using pagination, check if we got fewer results than requested
        hasMore = mappedSounds.length === (page_size || limit || 20);
      }
      
      return {
        sounds: finalSounds,
        hasMore,
        next,
        count,
      };
    } catch (error: any) {
      console.error('🆕 SoundService.getNewSounds - Error, trying fallback:', error);
      // Fallback to getting all sounds and sorting
      try {
        const sounds = await this.getSounds();
        const sortedSounds = sounds
          .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        
        // Apply pagination if provided
        let finalSounds = sortedSounds;
        let hasMore = false;
        
        if (page !== undefined && page_size !== undefined) {
          const start = (page - 1) * page_size;
          const end = start + page_size;
          finalSounds = sortedSounds.slice(start, end);
          hasMore = end < sortedSounds.length;
        } else if (limit !== undefined) {
          finalSounds = sortedSounds.slice(0, limit);
          hasMore = sortedSounds.length > limit;
        }
        
        return {
          sounds: finalSounds,
          hasMore,
          next: null,
          count: sortedSounds.length,
        };
      } catch (fallbackError: any) {
        console.error('🆕 SoundService.getNewSounds - Fallback also failed:', fallbackError);
        throw this.handleError(error);
      }
    }
  }

  /**
   * Get trending sounds from dedicated trending endpoint
   * @param limit - Maximum number of sounds to return (for backward compatibility)
   * @param page - Page number for pagination
   * @param page_size - Number of sounds per page
   * @returns Object with sounds array and pagination info
   */
  async getTrendingSounds(
    limit?: number,
    page?: number,
    page_size?: number
  ): Promise<{
    sounds: SoundButton[];
    hasMore: boolean;
    next: string | null;
    count?: number;
  }> {
    try {
      const apiPath = buildApiPath('sounds/trending');
      
      // Prepare query parameters
      const queryParams: Record<string, any> = {};
      if (page !== undefined) {
        queryParams.page = page;
      }
      if (page_size !== undefined) {
        queryParams.page_size = Math.min(page_size, 100);
      } else if (limit !== undefined) {
        // Use limit as page_size if provided for backward compatibility
        queryParams.page_size = Math.min(limit, 100);
      }
      
      const response = await api.get(apiPath, { params: queryParams });
      
      // Handle different response formats
      let sounds: any[] = [];
      let hasMore = false;
      let next: string | null = null;
      let count: number | undefined = undefined;
      
      if (response.data?.data?.results) {
        // New format with nested data.results and pagination
        sounds = response.data.data.results;
        hasMore = !!response.data.data.next;
        next = response.data.data.next || null;
        count = response.data.data.count;
      } else if (response.data?.results) {
        // Format with results property and pagination
        sounds = response.data.results;
        hasMore = !!response.data.next;
        next = response.data.next || null;
        count = response.data.count;
      } else if (Array.isArray(response.data)) {
        // Direct array format (no pagination info)
        sounds = response.data;
      } else if (response.data?.sounds) {
        sounds = response.data.sounds;
        hasMore = !!response.data.next;
        next = response.data.next || null;
        count = response.data.count;
      }
      
      // Map backend response to UI-compatible format
      const mappedSounds = sounds.map(this.mapSoundToUI);
      
      // Apply limit if provided (for backward compatibility when not using pagination)
      let finalSounds = mappedSounds;
      if (limit !== undefined && page === undefined && page_size === undefined) {
        finalSounds = mappedSounds.slice(0, limit);
        hasMore = mappedSounds.length > limit;
      } else {
        // If using pagination, check if we got fewer results than requested
        hasMore = mappedSounds.length === (page_size || limit || 20);
      }
      
      return {
        sounds: finalSounds,
        hasMore,
        next,
        count,
      };
    } catch (error: any) {
      console.error('📈 SoundService.getTrendingSounds - Error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get user favorite sounds
   * @param page - Page number for pagination
   * @param page_size - Number of sounds per page
   * @returns Object with sounds array and pagination info
   */
  async getUserFavorites(
    page?: number,
    page_size?: number
  ): Promise<{
    sounds: SoundButton[];
    hasMore: boolean;
    next: string | null;
    count?: number;
  }> {
    try {
      const apiPath = buildApiPath('sounds/user/favorites');
      
      // Prepare query parameters
      const queryParams: Record<string, any> = {};
      if (page !== undefined) {
        queryParams.page = page;
      }
      if (page_size !== undefined) {
        queryParams.page_size = Math.min(page_size, 100);
      }
      
      const response = await api.get(apiPath, { params: queryParams });
      
      // Handle different response formats
      let sounds: any[] = [];
      let hasMore = false;
      let next: string | null = null;
      let count: number | undefined = undefined;
      
      if (response.data?.data?.results) {
        // New format with nested data.results and pagination
        sounds = response.data.data.results;
        hasMore = !!response.data.data.next;
        next = response.data.data.next || null;
        count = response.data.data.count;
      } else if (response.data?.results) {
        // Format with results property and pagination
        sounds = response.data.results;
        hasMore = !!response.data.next;
        next = response.data.next || null;
        count = response.data.count;
      } else if (Array.isArray(response.data)) {
        // Direct array format (no pagination info)
        sounds = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Nested data array
        sounds = response.data.data;
      }
      
      // Map backend response to UI-compatible format
      const mappedSounds = sounds.map(this.mapSoundToUI);

      // Filter only sounds that are marked as favorited by the API
      const favoriteSounds = mappedSounds.filter((sound) => sound.is_favorited);

      // If using pagination, check if we got fewer results than requested
      if (page_size !== undefined) {
        hasMore = favoriteSounds.length === page_size;
      }
      
      return {
        sounds: favoriteSounds,
        hasMore,
        next,
        count,
      };
    } catch (error: any) {
      console.error('❤️ SoundService.getUserFavorites - Error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get sounds by tag/category
   * @param tag - Tag to filter by
   * @param limit - Maximum number of sounds to return
   * @returns Array of sounds
   */
  async getSoundsByTag(tag: string, limit?: number): Promise<SoundButton[]> {
    try {
      const sounds = await this.getSounds({ tag });
      if (limit) {
        return sounds.slice(0, limit);
      }
      return sounds;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Search sounds by name or tag
   * @param search - Search query
   * @param limit - Maximum number of sounds to return
   * @returns Array of sounds
   */
  async searchSounds(search: string, limit?: number): Promise<SoundButton[]> {
    try {
      const sounds = await this.getSounds({ search });
      if (limit) {
        return sounds.slice(0, limit);
      }
      return sounds;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Search sounds by name using the dedicated search endpoint
   * @param name - Sound name to search for (required)
   * @param page - Page number for pagination (optional)
   * @param page_size - Items per page (optional, max 100)
   * @returns Object with sounds array and pagination info
   */
  async searchSoundsByName(
    name: string,
    page?: number,
    page_size?: number
  ): Promise<{
    sounds: SoundButton[];
    hasMore: boolean;
    next: string | null;
    count?: number;
  }> {
    try {
      const apiPath = buildApiPath('sounds/search');
      
      // Prepare query parameters
      const queryParams: Record<string, any> = {
        name: name, // Required parameter
      };
      
      if (page !== undefined) {
        queryParams.page = page;
      }
      if (page_size !== undefined) {
        queryParams.page_size = Math.min(page_size, 100);
      }
      
      const response = await api.get(apiPath, { params: queryParams });
      
      // Handle response format: { status: 200, data: { count, next, previous, results: [...] } }
      let sounds: any[] = [];
      let hasMore = false;
      let next: string | null = null;
      let count: number | undefined = undefined;
      
      if (response.data?.data?.results) {
        // New format with nested data.results and pagination
        sounds = response.data.data.results;
        hasMore = !!response.data.data.next;
        next = response.data.data.next || null;
        count = response.data.data.count;
      } else if (response.data?.results) {
        // Format with results property and pagination
        sounds = response.data.results;
        hasMore = !!response.data.next;
        next = response.data.next || null;
        count = response.data.count;
      } else if (Array.isArray(response.data)) {
        // Direct array format (no pagination info)
        sounds = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Nested data array
        sounds = response.data.data;
      }
      
      // Map backend response to UI-compatible format
      const mappedSounds = sounds.map(this.mapSoundToUI);
      
      // If using pagination, check if we got fewer results than requested
      if (page_size !== undefined) {
        hasMore = mappedSounds.length === page_size;
      }
      
      return {
        sounds: mappedSounds,
        hasMore,
        next,
        count,
      };
    } catch (error: any) {
      console.error('🔍 SoundService.searchSoundsByName - Error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get sounds by category (for backward compatibility)
   * Maps category to tag
   * @param category - Category/tag to filter by
   * @param page - Page number (not used, kept for compatibility)
   * @param limit - Maximum number of sounds to return
   * @returns Object with results array
   */
  async getSoundsByCategory(category: string, page: number = 1, limit: number = 12): Promise<{
    results: SoundButton[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    try {
      const sounds = await this.getSoundsByTag(category, limit);
      return {
        results: sounds,
        count: sounds.length,
        next: null, // Backend doesn't support pagination
        previous: null,
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Map backend sound response to UI-compatible format
   * @param sound - Backend sound object
   * @returns UI-compatible sound object
   */
  private mapSoundToUI(sound: any): SoundButton {
    // Use API endpoint for audio URL to avoid CORS issues
    // Format: http://192.168.1.96:8051/api/soundboardgo.com/sounds/{id}/audio
    const apiAudioUrl = buildAudioUrl(sound.id);
    
    // Keep original S3 URL for reference (sound_file_url)
    const soundFileUrl = sound.sound_file_url || sound.sound_file;
    
    return {
      ...sound,
      title: sound.name, // Alias for UI compatibility
      sound_file_url: soundFileUrl, // Keep original S3 URL for reference
      audio_url: apiAudioUrl, // Use API endpoint URL (avoids CORS issues)
      category: sound.tag || sound.category_name || '', // Alias for UI compatibility
      tags: sound.tag ? [sound.tag] : [], // Convert single tag to array
      // Preserve new API fields
      category_id: sound.category_id,
      category_name: sound.category_name,
      views: sound.views,
      is_liked: sound.is_liked,
      is_favorited: sound.is_favorited,
      likes_count: sound.likes_count,
      favorites_count: sound.favorites_count,
      play_count: sound.views || sound.play_count, // Map views to play_count if available
    };
  }

  /**
   * Generate a slug from a category name (fallback if slug is missing)
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Check if a slug is in proper URL-safe format
   */
  private isSlugValid(slug: string): boolean {
    // Slug should be lowercase, contain only letters, numbers, and hyphens
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  }

  /**
   * Normalize category to ensure it has required fields
   */
  private normalizeCategory(category: any): Category {
    // Ensure slug exists and is valid, generate from name if missing or invalid
    const existingSlug = category.slug;
    const hasValidSlug = existingSlug && 
                        typeof existingSlug === 'string' && 
                        existingSlug !== 'undefined' && 
                        existingSlug !== 'null' && 
                        existingSlug.trim() !== '' &&
                        this.isSlugValid(existingSlug.toLowerCase().trim());
    
    // Generate slug if missing or invalid (including if it's just the category name)
    if (!hasValidSlug && category.name) {
      const generatedSlug = this.generateSlug(category.name);
      category.slug = generatedSlug;
    }
    
    // Recursively normalize children if they exist
    if (category.children && Array.isArray(category.children) && category.children.length > 0) {
      category.children = category.children.map((child: any) => this.normalizeCategory(child));
    }
    
    return category as Category;
  }

  async getCategories(): Promise<Category[]> {
    try {
      const apiPath = buildApiPath('user/categories');
      
      const response = await api.get(apiPath);
      
      const categories = response.data.results || response.data;
      
      // Normalize all categories to ensure they have slugs
      const normalizedCategories = Array.isArray(categories)
        ? categories.map(cat => this.normalizeCategory(cat))
        : [];
      
      return normalizedCategories;
    } catch (error: any) {
      console.error('📂 SoundService.getCategories - Error:', error);
      throw this.handleError(error);
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    try {
      const apiPath = buildApiPath(`categories/${slug}`);
      
      const response = await api.get(apiPath);
      
      // Normalize category to ensure it has required fields
      const category = this.normalizeCategory(response.data);
      
      return category;
    } catch (error: any) {
      console.error('📁 SoundService.getCategoryBySlug - Error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Upload/create a new sound
   * @param data - Sound data: name (required), sound_file (optional file), sound_file_url (optional string), tag (optional string), category (optional integer)
   * @returns Created sound object
   */
  async uploadSound(data: {
    name: string;
    sound_file?: File;
    sound_file_url?: string;
    tag?: string;
    category?: number;
  }): Promise<SoundButton> {
    try {
      const apiPath = buildApiPath('sounds');
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', data.name);
      
      if (data.sound_file) {
        formData.append('sound_file', data.sound_file);
      }
      
      if (data.sound_file_url) {
        formData.append('sound_file_url', data.sound_file_url);
      }
      
      if (data.tag) {
        formData.append('tag', data.tag);
      }
      
      if (data.category !== undefined) {
        formData.append('category', data.category.toString());
      }
      
      const response = await api.post(apiPath, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Handle response format: { status: 201, data: {...} } or direct {...}
      const soundData = response.data?.data || response.data;
      const mappedSound = this.mapSoundToUI(soundData);
      
      return mappedSound;
    } catch (error: any) {
      console.error('📤 SoundService.uploadSound - Error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Add sound to favorites
   * @param soundId - Sound ID to add to favorites
   * @returns Updated sound data with favorite status
   */
  async addToFavorites(soundId: number): Promise<SoundButton> {
    try {
      const apiPath = buildApiPath(`sounds/${soundId}/favorite`);
      const response = await api.post(apiPath);
      
      // Handle response format: { status: 201, data: { message, sound: {...} } }
      let soundData: any;
      if (response.data?.data?.sound) {
        soundData = response.data.data.sound;
      } else if (response.data?.sound) {
        soundData = response.data.sound;
      } else {
        soundData = response.data?.data || response.data;
      }
      
      const mappedSound = this.mapSoundToUI(soundData);
      return mappedSound;
    } catch (error: any) {
      console.error('❤️ SoundService.addToFavorites - Error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Remove sound from favorites
   * @param soundId - Sound ID to remove from favorites
   * @returns Updated sound data with favorite status
   */
  async removeFromFavorites(soundId: number): Promise<SoundButton> {
    try {
      const apiPath = buildApiPath(`sounds/${soundId}/favorite`);
      const response = await api.delete(apiPath);
      
      // Handle response format: { status: 200, data: { message, sound: {...} } }
      let soundData: any;
      if (response.data?.data?.sound) {
        soundData = response.data.data.sound;
      } else if (response.data?.sound) {
        soundData = response.data.sound;
      } else {
        soundData = response.data?.data || response.data;
      }
      
      const mappedSound = this.mapSoundToUI(soundData);
      return mappedSound;
    } catch (error: any) {
      console.error('❤️ SoundService.removeFromFavorites - Error:', error);
      throw this.handleError(error);
    }
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

export const soundService = new SoundService();

