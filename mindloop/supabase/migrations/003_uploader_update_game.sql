-- 업로더가 자신의 게임 메타데이터를 수정
-- 본인의 게임만 수정 가능 (uploader_id 일치 검사)
-- 수정 후 status를 pending으로 되돌려 재승인을 요구
CREATE OR REPLACE FUNCTION uploader_update_game(
  p_token text,
  p_game_id uuid,
  p_title text,
  p_description text,
  p_category text,
  p_type text,
  p_playtime text,
  p_tags text[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  s record;
  owner uuid;
BEGIN
  SELECT * INTO s FROM _parse_session_token(p_token);
  IF s.user_id IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;

  SELECT uploader_id INTO owner FROM games WHERE id = p_game_id;
  IF owner IS NULL THEN RAISE EXCEPTION 'game not found'; END IF;
  IF owner <> s.user_id AND s.role <> 'admin' THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  -- 업로더가 수정하면 재검수를 위해 status를 pending으로 되돌린다.
  -- 관리자가 직접 수정한 경우엔 status를 유지한다.
  UPDATE games
  SET title = p_title,
      description = p_description,
      category = p_category,
      type = p_type,
      playtime = p_playtime,
      tags = p_tags,
      status = CASE WHEN s.role = 'admin' THEN status ELSE 'pending' END
  WHERE id = p_game_id;
END;
$$;
