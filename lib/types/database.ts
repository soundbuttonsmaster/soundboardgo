export interface Soundboard {
  id: string
  numeric_id: number // Added numeric_id for SEO-friendly URLs
  name: string
  slug: string
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface Sound {
  id: string
  numeric_id: number
  name: string
  soundboard_id: string
  audio_url: string
  color: string
  tags: string[]
  play_count: number
  view_count: number
  like_count: number
  created_at: string
  updated_at: string
  soundboard?: Soundboard
}

export interface UserFavorite {
  id: string
  user_id: string
  sound_id: string
  created_at: string
  sound?: Sound
}

export interface UserSoundboard {
  id: string
  user_id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  role: string
  created_at: string
}

// Legacy types - kept for backward compatibility
// New code should use types from @/lib/api/client

export interface User {
  id: string | number
  email: string
  user_metadata?: {
    username?: string
    avatar_url?: string
  }
}
