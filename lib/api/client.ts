const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://play.soundboard.cloud/api/soundboardgo"

// Fallback flag to disable API calls if needed
const DISABLE_API = process.env.NEXT_PUBLIC_DISABLE_API === "true"

export interface ApiResponse<T> {
  status: number
  data: T
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface Sound {
  image_file: string
  id: number
  name: string
  sound_file: string
  tag?: string
  tags?: string[]
  category?: number | null
  category_id?: number | null
  category_name?: string | null
  views: number
  is_liked?: boolean
  is_favorited?: boolean
  likes_count: number
  favorites_count: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  order: number
  is_active: boolean
  children: Category[]
  parent?: number | null
  parent_id?: number | null
  parent_name?: string | null
  children_count?: number
  full_path?: string
  depth?: number
  created_at?: string
  updated_at?: string
  created_by?: number
  created_by_name?: string
  created_by_email?: string
}

export interface User {
  id: number
  username: string
  email: string
  full_name?: string
  first_name?: string
  last_name?: string
  role?: number
  role_name?: string
  role_code?: string
  is_active?: boolean
  is_verified?: boolean
  phone_number?: string
  site?: number
  site_id?: number
  site_name?: string
  date_joined?: string
  created_at?: string
  last_login?: string
}

export interface Blog {
  id: number
  title: string
  slug: string
  content?: string
  excerpt?: string
  featured_image?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at?: string
  published_at?: string
}

export interface LoginResponse {
  user: User
  token: string
  message: string
}

export interface RegisterResponse {
  user: User
  token: string
  message: string
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    // Load token from localStorage on client side
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("api_token")
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("api_token", token)
      } else {
        localStorage.removeItem("api_token")
      }
    }
  }

  getToken(): string | null {
    return this.token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Skip API calls if disabled
    if (DISABLE_API) {
      console.warn("API calls are disabled, returning empty response")
      return {
        status: 200,
        data: [] as T
      }
    }

    const url = `${this.baseUrl}${endpoint}`
    console.log("Server-side API Request URL:", url)
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers["Authorization"] = `Token ${this.token}`
    }

    let response: Response
    try {
      response = await fetch(url, {
        ...options,
        headers,
        // Add timeout and other options for better error handling
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })
    } catch (fetchError) {
      console.error(`Network Error: Failed to fetch ${url}`, fetchError)
      throw new Error(`Network error: Unable to connect to API server`)
    }

    let data: any
    try {
      data = await response.json()
    } catch (error) {
      // If response is not valid JSON, create a fallback error object
      data = {
        message: `HTTP error! status: ${response.status}`,
        error: `Failed to parse response as JSON`,
      }
    }

    if (!response.ok) {
      console.error(`API Error: ${response.status} for ${url}`, data)
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`)
    }

    return {
      status: response.status,
      data: data.data || data,
    }
  }

  // ==================== Authentication ====================

  async register(data: {
    username: string
    email: string
    password: string
    full_name?: string
  }): Promise<ApiResponse<RegisterResponse>> {
    const response = await this.request<RegisterResponse>("/user/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
    if (response.data.token) {
      this.setToken(response.data.token)
    }
    return response
  }

  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>("/user/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    if (response.data.token) {
      this.setToken(response.data.token)
    }
    return response
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>("/user/profile")
  }

  async updateProfile(data: {
    first_name?: string
    last_name?: string
    phone_number?: string
  }): Promise<ApiResponse<{ user: User; message: string }>> {
    return this.request<{ user: User; message: string }>("/user/profile", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>("/user/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  async resetPassword(data: {
    uid: string
    token: string
    password: string
  }): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>("/user/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  logout() {
    this.setToken(null)
  }

  // ==================== Sounds ====================

  async getSounds(params?: {
    category?: number
    tag?: string
    search?: string
    page?: number
    page_size?: number
  }): Promise<ApiResponse<PaginatedResponse<Sound>>> {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append("category", params.category.toString())
    if (params?.tag) queryParams.append("tag", params.tag)
    if (params?.search) queryParams.append("search", params.search)
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.page_size) queryParams.append("page_size", params.page_size.toString())

    const query = queryParams.toString()
    return this.request<PaginatedResponse<Sound>>(`/sounds${query ? `?${query}` : ""}`)
  }

  async getSound(id: number): Promise<ApiResponse<Sound>> {
    return this.request<Sound>(`/sounds/${id}`)
  }

  async searchSounds(name: string, params?: {
    page?: number
    page_size?: number
  }): Promise<ApiResponse<PaginatedResponse<Sound>>> {
    const queryParams = new URLSearchParams({ name })
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.page_size) queryParams.append("page_size", params.page_size.toString())

    return this.request<PaginatedResponse<Sound>>(`/sounds/search?${queryParams.toString()}`)
  }

  async getRelatedSounds(id: number, params?: {
    limit?: number
    page?: number
    page_size?: number
  }): Promise<ApiResponse<PaginatedResponse<Sound>>> {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append("limit", params.limit.toString())
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.page_size) queryParams.append("page_size", params.page_size.toString())

    const query = queryParams.toString()
    return this.request<PaginatedResponse<Sound>>(`/sounds/${id}/related${query ? `?${query}` : ""}`)
  }

  async getNewSounds(params?: {
    page?: number
    page_size?: number
  }): Promise<ApiResponse<PaginatedResponse<Sound>>> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.page_size) queryParams.append("page_size", params.page_size.toString())

    const query = queryParams.toString()
    return this.request<PaginatedResponse<Sound>>(`/sounds/new${query ? `?${query}` : ""}`)
  }

  async getTrendingSounds(params?: {
    page?: number
    page_size?: number
  }): Promise<ApiResponse<PaginatedResponse<Sound>>> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.page_size) queryParams.append("page_size", params.page_size.toString())

    const query = queryParams.toString()
    return this.request<PaginatedResponse<Sound>>(`/sounds/trending${query ? `?${query}` : ""}`)
  }

  async getUserFavorites(params?: {
    page?: number
    page_size?: number
  }): Promise<ApiResponse<PaginatedResponse<Sound>>> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.page_size) queryParams.append("page_size", params.page_size.toString())

    const query = queryParams.toString()
    return this.request<PaginatedResponse<Sound>>(`/sounds/user/favorites${query ? `?${query}` : ""}`)
  }

  async getUserLikes(params?: {
    page?: number
    page_size?: number
  }): Promise<ApiResponse<PaginatedResponse<Sound>>> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.page_size) queryParams.append("page_size", params.page_size.toString())

    const query = queryParams.toString()
    return this.request<PaginatedResponse<Sound>>(`/sounds/user/likes${query ? `?${query}` : ""}`)
  }

  async getUserUploadedSounds(params?: {
    user_id?: number
    page?: number
    page_size?: number
  }): Promise<ApiResponse<PaginatedResponse<Sound>>> {
    const queryParams = new URLSearchParams()
    if (params?.user_id) queryParams.append("user_id", params.user_id.toString())
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.page_size) queryParams.append("page_size", params.page_size.toString())

    const query = queryParams.toString()
    return this.request<PaginatedResponse<Sound>>(`/sounds/user/uploaded${query ? `?${query}` : ""}`)
  }

  async createSound(data: {
    name: string
    sound_file?: File
    sound_file_url?: string
    tag?: string
    category?: number
  }): Promise<ApiResponse<Sound>> {
    const formData = new FormData()
    formData.append("name", data.name)
    if (data.sound_file) {
      formData.append("sound_file", data.sound_file)
    }
    if (data.sound_file_url) {
      formData.append("sound_file_url", data.sound_file_url)
    }
    if (data.tag) {
      formData.append("tag", data.tag)
    }
    if (data.category) {
      formData.append("category", data.category.toString())
    }

    const url = `${this.baseUrl}/sounds`
    const headers: Record<string, string> = {}
    if (this.token) {
      headers["Authorization"] = `Token ${this.token}`
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || result.error || `HTTP error! status: ${response.status}`)
    }

    return {
      status: response.status,
      data: result.data || result,
    }
  }

  async likeSound(id: number): Promise<ApiResponse<{ message: string; sound: Partial<Sound> }>> {
    return this.request<{ message: string; sound: Partial<Sound> }>(`/sounds/${id}/like`, {
      method: "POST",
    })
  }

  async unlikeSound(id: number): Promise<ApiResponse<{ message: string; sound: Partial<Sound> }>> {
    return this.request<{ message: string; sound: Partial<Sound> }>(`/sounds/${id}/like`, {
      method: "DELETE",
    })
  }

  async favoriteSound(id: number): Promise<ApiResponse<{ message: string; sound: Partial<Sound> }>> {
    return this.request<{ message: string; sound: Partial<Sound> }>(`/sounds/${id}/favorite`, {
      method: "POST",
    })
  }

  async unfavoriteSound(id: number): Promise<ApiResponse<{ message: string; sound: Partial<Sound> }>> {
    return this.request<{ message: string; sound: Partial<Sound> }>(`/sounds/${id}/favorite`, {
      method: "DELETE",
    })
  }

  async updateViews(soundId: number): Promise<ApiResponse<Sound>> {
    return this.request<Sound>("/sounds/views", {
      method: "POST",
      body: JSON.stringify({ sound_id: soundId }),
    })
  }

  getSoundAudioUrl(id: number): string {
    return `${this.baseUrl}/sounds/${id}/audio`
  }

  getSoundDownloadUrl(id: number): string {
    return `${this.baseUrl}/sounds/${id}/audio?download=true`
  }

  // ==================== Categories ====================

  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>("/user/categories")
  }

  async getCategory(id: number): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/user/categories/${id}`)
  }

  // ==================== Blogs ====================

  async getBlogs(params?: {
    search?: string
    page?: number
    page_size?: number
  }): Promise<ApiResponse<PaginatedResponse<Blog>>> {
    const queryParams = new URLSearchParams()
    if (params?.search) queryParams.append("search", params.search)
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.page_size) queryParams.append("page_size", params.page_size.toString())

    const query = queryParams.toString()
    return this.request<PaginatedResponse<Blog>>(`/user/blogs${query ? `?${query}` : ""}`)
  }

  async getBlog(id: number): Promise<ApiResponse<Blog>> {
    return this.request<Blog>(`/user/blogs/${id}`)
  }

  getBlogImageUrl(id: number): string {
    return `${this.baseUrl}/user/blogs/${id}/image`
  }

  getBlogImageDownloadUrl(id: number): string {
    return `${this.baseUrl}/user/blogs/${id}/image?download=true`
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export class for server-side usage
export default ApiClient

