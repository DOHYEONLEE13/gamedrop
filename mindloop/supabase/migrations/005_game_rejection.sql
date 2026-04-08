-- 거절 사유 컬럼 + 거절 RPC

ALTER TABLE games ADD COLUMN IF NOT EXISTS rejection_reason text;

-- 관리자가 게임을 거절 (status=rejected, 사유 저장)
CREATE OR REPLACE FUNCTION admin_reject_game(p_token text, p_game_id uuid, p_reason text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM _require_admin(p_token);
  UPDATE games
  SET status = 'rejected',
      rejection_reason = p_reason
  WHERE id = p_game_id;
END; $$;

-- 업로더가 거절 사유를 확인한 뒤 닫을 수 있게
CREATE OR REPLACE FUNCTION uploader_dismiss_rejection(p_token text, p_game_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  s record;
  owner uuid;
BEGIN
  SELECT * INTO s FROM _parse_session_token(p_token);
  IF s.user_id IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;
  SELECT uploader_id INTO owner FROM games WHERE id = p_game_id;
  IF owner <> s.user_id THEN RAISE EXCEPTION 'forbidden'; END IF;
  UPDATE games SET rejection_reason = NULL WHERE id = p_game_id;
END; $$;

-- admin_list_games 재정의 (rejection_reason 포함)
DROP FUNCTION IF EXISTS admin_list_games(text);
CREATE OR REPLACE FUNCTION admin_list_games(p_token text)
RETURNS TABLE (
  id uuid, title text, description text, category text, type text,
  playtime text, tags text[], views integer, likes integer, status text,
  html_url text, thumbnail_url text, file_paths text[], entry_file text,
  uploader_id uuid, uploader_username text, rejection_reason text, created_at timestamptz
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM _require_admin(p_token);
  RETURN QUERY
  SELECT g.id, g.title, g.description, g.category, g.type, g.playtime, g.tags,
         g.views, g.likes, g.status, g.html_url, g.thumbnail_url, g.file_paths,
         g.entry_file, g.uploader_id, u.username, g.rejection_reason, g.created_at
  FROM games g
  LEFT JOIN app_users u ON u.id = g.uploader_id
  ORDER BY g.created_at DESC;
END; $$;
