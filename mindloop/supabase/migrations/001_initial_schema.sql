-- ============================================
-- PLAYWAVE: 초기 스키마
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. games 테이블
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('action','puzzle','rpg','simulation','strategy','casual')),
  type text NOT NULL CHECK (type IN ('shortform','longform')),
  playtime text,
  tags text[],
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  status text DEFAULT 'live' CHECK (status IN ('live','draft')),
  html_url text,
  thumbnail_url text,
  file_paths text[],
  entry_file text,
  created_at timestamptz DEFAULT now()
);

-- 2. profiles 테이블
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname text,
  email text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- 3. user_likes 테이블
CREATE TABLE IF NOT EXISTS user_likes (
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, game_id)
);

-- 4. user_saves 테이블
CREATE TABLE IF NOT EXISTS user_saves (
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, game_id)
);

-- 5. play_history 테이블
CREATE TABLE IF NOT EXISTS play_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  played_at timestamptz DEFAULT now()
);

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================

-- games: 누구나 live 게임 읽기 가능
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "games_public_read" ON games FOR SELECT USING (status = 'live');
CREATE POLICY "games_admin_all" ON games FOR ALL USING (true) WITH CHECK (true);

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_own_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_own_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- user_likes
ALTER TABLE user_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "likes_own_read" ON user_likes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "likes_own_insert" ON user_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_own_delete" ON user_likes FOR DELETE USING (auth.uid() = user_id);

-- user_saves
ALTER TABLE user_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "saves_own_read" ON user_saves FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saves_own_insert" ON user_saves FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saves_own_delete" ON user_saves FOR DELETE USING (auth.uid() = user_id);

-- play_history
ALTER TABLE play_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "history_own_read" ON play_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "history_own_insert" ON play_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "history_own_update" ON play_history FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- RPC 함수들
-- ============================================

-- 관리자 비밀번호 검증
CREATE OR REPLACE FUNCTION verify_admin_password(password_input text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN password_input = 'playwave2026';
END;
$$;

-- 조회수 증가
CREATE OR REPLACE FUNCTION increment_views(game_id_input uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE games SET views = views + 1 WHERE id = game_id_input;
END;
$$;

-- 좋아요 수 동기화 (트리거)
CREATE OR REPLACE FUNCTION sync_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE games SET likes = likes + 1 WHERE id = NEW.game_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE games SET likes = likes - 1 WHERE id = OLD.game_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON user_likes
  FOR EACH ROW EXECUTE FUNCTION sync_likes_count();

-- 회원가입 시 자동 프로필 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO profiles (id, nickname, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Storage 버킷
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('games', 'games', true)
ON CONFLICT (id) DO NOTHING;

-- Storage 정책: 누구나 읽기, 인증된 사용자만 업로드
CREATE POLICY "games_storage_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'games');

CREATE POLICY "games_storage_auth_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'games');
