-- Create function to increment play count
CREATE OR REPLACE FUNCTION increment_play_count(sound_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE sounds
  SET play_count = play_count + 1
  WHERE id = sound_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
