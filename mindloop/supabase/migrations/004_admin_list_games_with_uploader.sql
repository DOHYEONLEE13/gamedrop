-- 관리자 게임 목록에 업로더 username을 포함해서 반환
DROP FUNCTION IF EXISTS admin_list_games(text);

CREATE OR REPLACE FUNCTION admin_list_games(p_token text)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  category text,
  type text,
  playtime text,
  tags text[],
  views integer,
  likes integer,
  status text,
  html_url text,
  thumbnail_url text,
  file_paths text[],
  entry_file text,
  uploader_id uuid,
  uploader_username text,
  created_at timestamptz
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM _require_admin(p_token);
  RETURN QUERY
  SELECT
    g.id, g.title, g.description, g.category, g.type, g.playtime, g.tags,
    g.views, g.likes, g.status, g.html_url, g.thumbnail_url, g.file_paths,
    g.entry_file, g.uploader_id, u.username AS uploader_username, g.created_at
  FROM games g
  LEFT JOIN app_users u ON u.id = g.uploader_id
  ORDER BY g.created_at DESC;
END; $$;
