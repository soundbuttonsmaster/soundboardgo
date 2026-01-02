-- Create soundboards table
CREATE TABLE IF NOT EXISTS soundboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sounds table
CREATE TABLE IF NOT EXISTS sounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  soundboard_id UUID NOT NULL REFERENCES soundboards(id) ON DELETE CASCADE,
  audio_url TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'sky',
  tags TEXT[] DEFAULT '{}',
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_favorites table (for public users to favorite sounds)
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- anonymous user ID stored in localStorage
  sound_id UUID NOT NULL REFERENCES sounds(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, sound_id)
);

-- Create user_soundboards table (for public users to create their own soundboards)
CREATE TABLE IF NOT EXISTS user_soundboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- anonymous user ID stored in localStorage
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, slug)
);

-- Create user_soundboard_sounds table (junction table for user soundboards)
CREATE TABLE IF NOT EXISTS user_soundboard_sounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_soundboard_id UUID NOT NULL REFERENCES user_soundboards(id) ON DELETE CASCADE,
  sound_id UUID NOT NULL REFERENCES sounds(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_soundboard_id, sound_id)
);

-- Create admin_users table for role management
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE soundboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE sounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_soundboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_soundboard_sounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Soundboards policies (public read, admin write)
CREATE POLICY "soundboards_select_all" ON soundboards FOR SELECT USING (true);
CREATE POLICY "soundboards_insert_admin" ON soundboards FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "soundboards_update_admin" ON soundboards FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "soundboards_delete_admin" ON soundboards FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- Sounds policies (public read, admin write)
CREATE POLICY "sounds_select_all" ON sounds FOR SELECT USING (true);
CREATE POLICY "sounds_insert_admin" ON sounds FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "sounds_update_admin" ON sounds FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "sounds_delete_admin" ON sounds FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- User favorites policies (anyone can manage their own favorites)
CREATE POLICY "user_favorites_select_all" ON user_favorites FOR SELECT USING (true);
CREATE POLICY "user_favorites_insert_all" ON user_favorites FOR INSERT WITH CHECK (true);
CREATE POLICY "user_favorites_delete_own" ON user_favorites FOR DELETE USING (true);

-- User soundboards policies
CREATE POLICY "user_soundboards_select_all" ON user_soundboards FOR SELECT USING (true);
CREATE POLICY "user_soundboards_insert_all" ON user_soundboards FOR INSERT WITH CHECK (true);
CREATE POLICY "user_soundboards_update_own" ON user_soundboards FOR UPDATE USING (true);
CREATE POLICY "user_soundboards_delete_own" ON user_soundboards FOR DELETE USING (true);

-- User soundboard sounds policies
CREATE POLICY "user_soundboard_sounds_select_all" ON user_soundboard_sounds FOR SELECT USING (true);
CREATE POLICY "user_soundboard_sounds_insert_all" ON user_soundboard_sounds FOR INSERT WITH CHECK (true);
CREATE POLICY "user_soundboard_sounds_delete_own" ON user_soundboard_sounds FOR DELETE USING (true);

-- Admin users policies
CREATE POLICY "admin_users_select_self" ON admin_users FOR SELECT USING (auth.uid() = id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sounds_soundboard_id ON sounds(soundboard_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_sound_id ON user_favorites(sound_id);
CREATE INDEX IF NOT EXISTS idx_user_soundboards_user_id ON user_soundboards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_soundboard_sounds_soundboard_id ON user_soundboard_sounds(user_soundboard_id);

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('sounds', 'sounds', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for sounds bucket
CREATE POLICY "sounds_bucket_select" ON storage.objects FOR SELECT USING (bucket_id = 'sounds');
CREATE POLICY "sounds_bucket_insert" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'sounds' AND EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "sounds_bucket_delete" ON storage.objects FOR DELETE USING (
  bucket_id = 'sounds' AND EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
