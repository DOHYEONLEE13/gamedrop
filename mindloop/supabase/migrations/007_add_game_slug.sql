-- ============================================
-- 007: games 테이블에 SEO용 slug 컬럼 추가
-- 개별 게임 상세 페이지(/games/:slug)를 위한 canonical URL 식별자
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. slug 컬럼 추가 (NULL 허용 상태로 시작 → 백필 후 NOT NULL 설정)
ALTER TABLE games
  ADD COLUMN IF NOT EXISTS slug text;

-- 2. 슬러그 생성 헬퍼 함수
-- 한글/특수문자 제거, 공백/구두점을 하이픈으로, 소문자화, 최대 60자
-- 끝에 id 앞 8자를 붙여 유일성 보장 (충돌 방지)
CREATE OR REPLACE FUNCTION generate_game_slug(p_title text, p_id uuid)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  base text;
  suffix text;
BEGIN
  -- 소문자화
  base := lower(coalesce(p_title, 'game'));
  -- 한글 제거 (ASCII 영문+숫자+공백+하이픈만 남김)
  base := regexp_replace(base, '[^a-z0-9\s\-]+', '', 'g');
  -- 연속 공백/하이픈을 단일 하이픈으로
  base := regexp_replace(base, '[\s\-]+', '-', 'g');
  -- 선두/말미 하이픈 제거
  base := trim(both '-' from base);
  -- 빈 문자열이면 fallback
  IF base = '' OR base IS NULL THEN
    base := 'game';
  END IF;
  -- 최대 60자로 자름
  IF length(base) > 60 THEN
    base := substring(base from 1 for 60);
    base := trim(both '-' from base);
  END IF;
  -- id 앞 8자 접미사로 유일성 보장
  suffix := substring(p_id::text from 1 for 8);
  RETURN base || '-' || suffix;
END;
$$;

-- 3. 기존 게임 데이터 백필
UPDATE games
  SET slug = generate_game_slug(title, id)
  WHERE slug IS NULL;

-- 4. NOT NULL + UNIQUE 제약
ALTER TABLE games
  ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS games_slug_unique_idx ON games(slug);

-- 5. INSERT 시 slug 자동 생성 트리거 (관리자/업로더가 슬러그를 따로 넘기지 않아도 되게)
CREATE OR REPLACE FUNCTION auto_fill_game_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_game_slug(NEW.title, NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_fill_game_slug ON games;
CREATE TRIGGER trg_auto_fill_game_slug
  BEFORE INSERT ON games
  FOR EACH ROW EXECUTE FUNCTION auto_fill_game_slug();

-- 6. 기존 업로더 RPC 함수들도 slug를 자동으로 받도록 유지 (트리거가 처리)
-- 별도 변경 불필요 — trigger가 INSERT 시 빈 slug를 채움

-- ============================================
-- 검증용 쿼리 (실행 후 확인)
-- ============================================
-- SELECT id, title, slug FROM games LIMIT 10;
-- SELECT count(*) FROM games WHERE slug IS NULL;  -- 0이어야 함
