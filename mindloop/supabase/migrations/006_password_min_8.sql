-- 비밀번호 최소 길이를 8자로 강화
CREATE OR REPLACE FUNCTION auth_register(p_username text, p_password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  hashed text;
  new_id uuid;
  token text;
BEGIN
  IF length(p_username) < 3 THEN RAISE EXCEPTION 'username_too_short'; END IF;
  IF length(p_password) < 8 THEN RAISE EXCEPTION 'password_too_short'; END IF;
  IF EXISTS (SELECT 1 FROM app_users WHERE username = p_username) THEN
    RAISE EXCEPTION 'username_taken';
  END IF;
  hashed := crypt(p_password, gen_salt('bf'));
  INSERT INTO app_users (username, password_hash, role)
  VALUES (p_username, hashed, 'uploader')
  RETURNING id INTO new_id;
  token := _make_session_token(new_id);
  INSERT INTO sessions (user_id, token, expires_at)
  VALUES (new_id, token, now() + interval '7 days');
  RETURN token;
END;
$$;
