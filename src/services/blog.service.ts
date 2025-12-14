import { api, buildApiPath, buildImageUrl } from './api';
import type { Blog, BlogsResponse, ApiError } from '@/types';

class BlogService {
  /**
   * Get all published blogs
   * @param params - Query parameters: search, page, page_size
   * @returns Object with blogs array and pagination info
   */
  async getBlogs(params?: {
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<{
    blogs: Blog[];
    hasMore: boolean;
    next: string | null;
    count?: number;
  }> {
    try {
      const apiPath = buildApiPath('user/blogs');
      
      // Prepare query parameters
      const queryParams: Record<string, any> = {};
      
      if (params?.search) {
        queryParams.search = params.search;
      }
      if (params?.page !== undefined) {
        queryParams.page = params.page;
      }
      if (params?.page_size !== undefined) {
        queryParams.page_size = Math.min(params.page_size, 100);
      }
      
      const response = await api.get(apiPath, { params: queryParams });
      
      // Handle response format: { status: 200, data: { count, next, previous, results: [...] } }
      let blogs: Blog[] = [];
      let hasMore = false;
      let next: string | null = null;
      let count: number | undefined = undefined;
      
      if (response.data?.data?.results) {
        // New format with nested data.results and pagination
        blogs = response.data.data.results;
        hasMore = !!response.data.data.next;
        next = response.data.data.next || null;
        count = response.data.data.count;
      } else if (response.data?.results) {
        // Format with results property and pagination
        blogs = response.data.results;
        hasMore = !!response.data.next;
        next = response.data.next || null;
        count = response.data.count;
      } else if (Array.isArray(response.data)) {
        // Direct array format (no pagination info)
        blogs = response.data;
      } else       if (response.data?.data && Array.isArray(response.data.data)) {
        // Nested data array
        blogs = response.data.data;
      }
      
      // Map featured_image to full URL for each blog
      const blogsWithFullImageUrls = blogs.map((blog) => ({
        ...blog,
        featured_image: buildImageUrl(blog.featured_image) || blog.featured_image,
      }));
      
      return {
        blogs: blogsWithFullImageUrls,
        hasMore,
        next,
        count,
      };
    } catch (error: any) {
      console.error('📝 BlogService.getBlogs - Error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get a specific blog by ID
   * @param id - Blog ID
   * @returns Blog object with full content
   */
  async getBlogById(id: number): Promise<Blog & { content?: string; metadata?: any }> {
    try {
      const apiPath = buildApiPath(`user/blogs/${id}`);
      
      const response = await api.get(apiPath);
      
      // Handle response format: { status: 200, data: {...} }
      let blogData: any;
      if (response.data?.data) {
        blogData = response.data.data;
      } else {
        blogData = response.data;
      }
      
      // Map featured_image to full URL
      if (blogData.featured_image) {
        blogData.featured_image = buildImageUrl(blogData.featured_image) || blogData.featured_image;
      }
      
      return blogData;
    } catch (error: any) {
      console.error('📝 BlogService.getBlogById - Error:', error);
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

export const blogService = new BlogService();

