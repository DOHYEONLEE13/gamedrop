# PLAYWAVE — 프로젝트 가이드

## 프로젝트 개요

"PLAYWAVE"는 HTML 게임 업로드·배포·플레이 플랫폼이다.
누구나 만든 HTML 게임을 업로드하면 즉시 등록되고, 방문자가 브라우저에서 바로 플레이할 수 있다.

### 핵심 차별점

- TikTok처럼 세로 스와이프로 게임을 넘기는 **숏폼 모드** (플레이타임 5분 이하)
- YouTube처럼 카테고리별로 탐색하는 **롱폼 모드** (플레이타임 5분 이상)
- HTML 파일 드래그앤드롭으로 즉시 게시되는 **초간편 업로드**

### 기술 스택

- React + TypeScript + Tailwind CSS
- Supabase (Auth + DB + Storage)

---

## 사용자 역할

### 1. 관리자 (Admin)

- 전용 비밀번호로 로그인 (초기값: `playwave2026`)
- 비밀번호 검증은 Supabase Edge Function 또는 RPC로 서버사이드 처리
- 검증 성공 시 localStorage에 토큰 저장 (만료: 24시간)
- 게임 업로드, 수정, 삭제, 게시/숨김 토글
- 대시보드에서 전체 통계 확인 (등록 게임 수, 총 조회수, 숏폼/롱폼 수)

### 2. 플레이어 (Player)

- 이메일 + 비밀번호로 회원가입/로그인
- 게임 플레이, 좋아요(토글), 나중에 플레이 저장(북마크)
- 플레이 기록 자동 저장
- "내 게임" 페이지에서 저장한 게임 / 플레이 기록 / 좋아요 목록 확인
- 로그아웃 가능

### 3. 비회원 (Guest)

- 게임 탐색 및 플레이 자유롭게 가능
- 좋아요/저장 누르면 로그인 모달 표시

---

## 페이지 구조

### 페이지 1: 숏폼 (메인, 기본 랜딩)

- 화면 전체를 차지하는 게임 카드가 세로로 나열
- scroll-snap으로 한 번에 하나씩 넘김 (TikTok UX)
- 각 게임은 iframe(sandbox) 안에서 실행
- 우측 세로: 좋아요 버튼 + 카운트, 저장 버튼, 전체화면 버튼
- 하단 오버레이: 게임 제목, 카테고리, 플레이타임, 조회수
- 첫 번째 게임 하단에 "↓ 스와이프하여 더 보기" 힌트
- **iframe 가상화 필수**: IntersectionObserver로 현재 뷰포트 ±1칸만 활성화, 나머지는 srcdoc 제거

### 페이지 2: 롱폼

- 상단 섹션 타이틀: "롱폼 게임"
- 카테고리 필터 칩: 전체 / RPG / 퍼즐 / 액션 / 시뮬레이션 / 전략 / 캐주얼
- 반응형 카드 그리드 (PC: 3~4열, 태블릿: 2열, 모바일: 2열 작은 카드)
- 각 카드: 썸네일 영역 + 플레이타임 뱃지 + 저장 버튼 + 제목 + 설명(2줄 말줄임) + 조회수/좋아요 + 카테고리 태그
- 카드 클릭 시 전체화면 모달에서 게임 실행

### 페이지 3: 내 게임 (로그인 필요)

- 3개 서브 탭: 저장한 게임 / 플레이 기록 / 좋아요
- "저장한 게임" 탭: 카드 그리드 형태
- "플레이 기록" 탭: 리스트 형태 (게임 아이콘 + 제목 + 카테고리 + 플레이타임 + 상대 시간 + 숏폼/롱폼 뱃지)
- "좋아요" 탭: 카드 그리드 형태

### 페이지 4: 관리자 대시보드 (관리자 로그인 필요)

- 통계 카드 4개: 등록 게임 수, 총 조회수, 숏폼 수, 롱폼 수
- 게임 업로드 폼
- 등록된 게임 테이블 (제목, 유형, 카테고리, 조회수, 상태, 관리 버튼)

---

## 게임 업로드 폼 상세

### 입력 필드

- 게임 제목 (필수, 텍스트)
- 카테고리 (필수, 셀렉트: 액션/퍼즐/RPG/시뮬레이션/전략/캐주얼)
- 게임 유형 (필수, 셀렉트: 숏폼/롱폼)
- 예상 플레이 타임 (선택, 텍스트, 예: "3분", "30분+")
- 게임 설명 (선택, 텍스트에어리어)
- 태그 (선택, 쉼표로 구분)
- HTML 파일 업로드 영역 (드래그앤드롭 + 클릭)
- 허용 확장자: `.html`, `.htm`, `.js`, `.css`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.mp3`, `.wav`, `.ogg`, `.json`
- 업로드된 파일 목록 표시 (파일명 + 용량 + 삭제 버튼)

### 업로드 처리

- HTML 파일 필수 확인
- 파일 크기 제한: 50MB
- 기본 보안 스캔 (`document.cookie`, `eval()`, 외부 리다이렉트 감지 시 경고, `window.location.hash` 제외)
- Supabase Storage에 `games/{game_id}/` 경로로 저장
- 진입점 결정: `index.html` 자동 감지 → 없으면 첫 번째 `.html` 파일 사용
- games 테이블에 메타데이터 저장

---

## 게임 실행 방식

### iframe 실행

```html
<iframe
  srcdoc="{게임 HTML 콘텐츠}"
  sandbox="allow-scripts"
  style="width:100%; height:100%; border:none;"
/>
```

- `allow-same-origin` 사용 금지 (부모 페이지 DOM/Storage/Cookie 접근 차단)
- 게임 내 저장 기능이 필요한 경우 `postMessage` API로 부모와 통신

### 전체화면 모달

- 화면 전체를 덮는 모달
- 상단 바: 게임 제목 + 좋아요 버튼 + 저장 버튼 + 닫기(X) 버튼
- 중앙: iframe으로 게임 실행
- ESC 키로도 닫기 가능

---

## 데이터 모델 (Supabase)

### games 테이블

| 컬럼 | 타입 | 비고 |
|---|---|---|
| id | uuid | PK |
| title | text | NOT NULL |
| description | text | |
| category | text | 'action' / 'puzzle' / 'rpg' / 'simulation' / 'strategy' / 'casual' |
| type | text | 'shortform' / 'longform' |
| playtime | text | |
| tags | text[] | 배열 |
| views | integer | default 0 |
| likes | integer | default 0 |
| status | text | 'live' / 'draft', default 'live' |
| html_url | text | Supabase Storage URL |
| thumbnail_url | text | 썸네일 이미지 URL |
| file_paths | text[] | 업로드된 전체 파일 목록 |
| entry_file | text | 진입점 HTML 파일 경로 |
| created_at | timestamptz | |

### profiles 테이블

| 컬럼 | 타입 | 비고 |
|---|---|---|
| id | uuid | PK, auth.users.id 참조 |
| nickname | text | |
| email | text | |
| avatar_url | text | 아바타 이미지 URL |
| created_at | timestamptz | |

### user_likes 테이블

| 컬럼 | 타입 | 비고 |
|---|---|---|
| user_id | uuid | FK → profiles |
| game_id | uuid | FK → games |
| created_at | timestamptz | |

PK: (user_id, game_id)

### user_saves 테이블

| 컬럼 | 타입 | 비고 |
|---|---|---|
| user_id | uuid | FK → profiles |
| game_id | uuid | FK → games |
| created_at | timestamptz | |

PK: (user_id, game_id)

### play_history 테이블

| 컬럼 | 타입 | 비고 |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles |
| game_id | uuid | FK → games |
| played_at | timestamptz | default now() |

### RLS 정책

모든 테이블에 Row Level Security 활성화 필수.

```sql
-- games: 누구나 live 게임 읽기 가능
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "게임 공개 읽기" ON games FOR SELECT USING (status = 'live');

-- user_likes: 본인 데이터만 조작
ALTER TABLE user_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "본인 좋아요만 관리" ON user_likes FOR ALL USING (auth.uid() = user_id);

-- user_saves: 본인 데이터만 조작
ALTER TABLE user_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "본인 저장만 관리" ON user_saves FOR ALL USING (auth.uid() = user_id);

-- play_history: 본인 기록만 읽기/쓰기
ALTER TABLE play_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "본인 기록만 관리" ON play_history FOR ALL USING (auth.uid() = user_id);

-- profiles: 본인 프로필만 수정, 읽기는 공개
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "프로필 공개 읽기" ON profiles FOR SELECT USING (true);
CREATE POLICY "본인 프로필만 수정" ON profiles FOR UPDATE USING (auth.uid() = id);
```

---

## 인증 시스템

### 플레이어 인증 (Supabase Auth)

- 회원가입: 닉네임 + 이메일 + 비밀번호 (6자 이상)
- 로그인: 이메일 + 비밀번호
- 로그아웃
- 세션 유지 (새로고침해도 유지)
- 우측 상단에 로그인 버튼 또는 아바타 드롭다운

### 관리자 인증

- 비밀번호 검증을 Supabase Edge Function 또는 RPC로 서버사이드 처리
- 검증 성공 시 localStorage에 토큰 저장 (만료: 24시간)
- 로그인 모달에서 "관리자 로그인" 탭으로 접근
- 관리자는 플레이어 계정과 별개

### 인증 모달

- 로그인 폼 / 회원가입 폼 / 관리자 로그인 폼을 탭으로 전환
- 유효성 에러 메시지 표시
- Enter 키로 제출 가능

---

## 네비게이션

### PC (769px 이상)

- 상단 고정 네비게이션 바
- 왼쪽: 로고 "PLAYWAVE" (클릭 시 숏폼으로 이동)
- 중앙: 탭 버튼 (숏폼 / 롱폼 / 저장 / 관리)
- 오른쪽: 로그인 버튼 또는 유저 아바타

### 모바일 (768px 이하)

- 상단 바: 로고 + 유저 아바타만
- 하단 고정 탭 바: 숏폼 / 롱폼 / 저장 / 관리 (아이콘 + 라벨)
- 활성 탭은 accent 컬러로 강조

---

## 핵심 기능 동작 정의

### 좋아요 토글

- 로그인 필요 (비로그인 시 로그인 모달)
- 한 번 누르면 좋아요 (+1), 다시 누르면 취소 (-1)
- user_likes 테이블로 중복 방지
- 즉시 UI 반영 (낙관적 업데이트)

### 나중에 플레이 (저장/북마크)

- 로그인 필요
- 저장/해제 토글
- "내 게임 → 저장한 게임"에서 확인

### 플레이 기록

- 로그인된 유저가 게임 모달을 열면 자동 기록
- 같은 게임 재플레이 시 기존 기록을 최신으로 갱신
- "내 게임 → 플레이 기록"에서 시간순 리스트로 확인
- 시간 표시: "방금 전", "3분 전", "2시간 전", "5일 전"

### 조회수

- 비로그인: sessionStorage에 `viewed_{game_id}` 플래그 저장, 세션당 1회만 카운트
- 로그인: play_history 기준 최근 5분 내 중복 조회 무시
- 숏폼: 스크롤 노출이 아닌 2초 이상 체류 시에만 카운트

---

## 토스트 알림

| 상황 | 메시지 |
|---|---|
| 로그인 성공 | "{닉네임}님 환영합니다!" |
| 회원가입 성공 | "{닉네임}님 환영합니다!" |
| 로그아웃 | "로그아웃 완료" |
| 게임 저장 | "나중에 플레이에 저장!" |
| 저장 취소 | "저장 취소" |
| 게임 업로드 | "{제목} 업로드 완료!" |
| 게임 삭제 | "삭제 완료" |
| 보안 경고 | "보안 경고: {내용}" |
| 입력 오류 | 해당 오류 메시지 |

- 3초 후 자동 사라짐 (슬라이드 아웃)

---

## 기술 요구사항

### 좌우 스크롤 방지

```css
html, body { overflow-x: hidden; overscroll-behavior-x: none; }
body { touch-action: pan-y; }
```

### 모바일 최적화

- viewport: `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no`
- 높이 계산: `100dvh` 사용 (100vh는 모바일 Safari 주소창 포함 문제)
- 숏폼: `height: calc(100dvh - 64px - 60px)` (네비게이션 높이 고려)
- 터치 영역 최소 44px

### 성능

- 게임 iframe에 `loading="lazy"` 적용
- 숏폼 iframe 가상화 (IntersectionObserver로 ±1칸만 활성화)
- 이미지/에셋은 Supabase Storage CDN 활용
- 오로라 배경에 `will-change: transform` 적용
- `@media (prefers-reduced-motion)` 지원
- 모바일에서 배경 효과 축소

### 데이터 영속성

- Supabase DB를 1차 저장소로 사용
- 오프라인/로컬 테스트 시 localStorage 폴백

---

## 개발 우선순위

1. Supabase 연동 (Auth + DB + Storage + RLS)
2. 관리자 로그인 + 게임 업로드 기능
3. 숏폼 뷰 (스와이프 + iframe 게임 실행 + iframe 가상화)
4. 롱폼 뷰 (카드 그리드 + 카테고리 필터)
5. 플레이어 회원가입/로그인/로그아웃
6. 좋아요/저장/플레이기록
7. 내 게임 페이지
8. 디자인 폴리싱 (애니메이션, 글래스모피즘, 오로라 배경)
