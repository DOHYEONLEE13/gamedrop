# GameDrop SEO Audit — Phase 1 (Before 상태)

**Audit Date:** 2026-04-17
**Target Domain:** https://gamedrop.win
**Stack:** React 19 + Vite 8 + TypeScript (pure CSR SPA), Cloudflare Pages, Supabase
**Goal:** Lighthouse SEO 100 · "Good" Core Web Vitals · Google/Naver 완전 색인

---

## 1. 렌더링 & 빌드 현황

| 항목 | 현재 상태 | SEO 영향 |
|---|---|---|
| 렌더링 방식 | **순수 CSR** (Vite SPA) | ⚠️ Googlebot JS 렌더링에 의존. Naverbot/Bingbot는 부분 색인 위험 |
| 초기 HTML | `<div id="root"></div>`만 존재 | ⚠️ First paint 전까지 콘텐츠 없음 |
| 프리렌더링 | 없음 | ⚠️ 동적 라우트(`/games`, `/shorts`)의 본문이 HTML에 없음 |
| 404 처리 | `_redirects`의 catch-all로 `index.html` 반환 | ✅ soft-404 위험은 낮음 |

---

## 2. SEO 인프라 (index.html / 정적 파일)

| 항목 | 상태 | 비고 |
|---|---|---|
| `<title>` | ✅ | "GameDrop - HTML 게임 업로드 & 플레이 플랫폼" |
| `meta description` | ✅ | 한국어, 155자 이내 |
| `meta keywords` | ✅ | 참고용 |
| `canonical` | ⚠️ | `https://gamedrop.win/` **홈 고정** — 모든 라우트가 같은 canonical 가리킴 |
| Open Graph | ✅ | `og:image` 포함 |
| Twitter Card | ✅ | `summary_large_image` |
| `naver-site-verification` | ✅ | `c27017b2...` |
| `theme-color` / manifest | ✅ | |
| JSON-LD | ⚠️ | `WebApplication`만 존재, `Organization`/`VideoGame`/`BreadcrumbList` 없음 |
| `robots.txt` | ✅ | public/에 존재 |
| `sitemap.xml` | ✅ | 9개 URL, 정적 파일 ( `_redirects`로 정상 제공) |
| `og-image.png` | 확인 필요 | 1200×630 권장 |

---

## 3. URL 구조 & 라우팅 (🚨 CRITICAL)

### 현재 라우트
- `/` · `/shorts` · `/games` · `/search` · `/upload` · `/about` · `/privacy` · `/terms` · `/contact` · `/my-games`

### 🚨 P0 — 개별 게임 페이지가 **존재하지 않음**
- 게임은 오직 `GamePlayModal` 내에서만 열림
- 공유 URL은 `?game={uuid}` 쿼리 파라미터 (비표준, 색인 불가)
- `/games/{slug}` 또는 `/games/{id}` 라우트 부재 → **수천 개 잠재 랜딩 페이지 전부 상실**
- DB `games` 테이블에 `slug` 컬럼 없음 (UUID만)

### 영향
- Google 검색 결과에 개별 게임이 노출될 수 없음
- "○○ 게임 무료" 같은 롱테일 키워드 유입 0
- 소셜 공유 시 모든 링크가 홈으로 리다이렉트

---

## 4. 콘텐츠 품질

| 페이지 | H1 | H2+ 구조 | 본문량 | 평가 |
|---|---|---|---|---|
| `/` (HomePage) | ✅ Hero h1 | ✅ Mission/Solution/SearchChanged 섹션 | 충분 | ✅ |
| `/shorts` | ❌ 누락 | ⚠️ 비가시 | 게임 카드만 | ⚠️ |
| `/games` | ❌ 누락 | ⚠️ | 카드 그리드 | ⚠️ |
| `/search` | ❌ | - | 동적 | ⚠️ |
| `/about` `/privacy` `/terms` | ✅ | ✅ | 충분 | ✅ |
| Mission 컴포넌트 | - | `<p>`로 작성 (h2 아님) | - | ⚠️ P1 |

---

## 5. 이미지 & 성능

| 항목 | 상태 |
|---|---|
| `<img>` `width`/`height` 속성 | ❌ 대부분 누락 → **CLS 리스크** |
| `loading="lazy"` | ⚠️ 부분 적용 |
| 썸네일 포맷 | Supabase Storage 원본 (WebP 변환 X) |
| 비디오 poster | ❌ 없음 |
| 폰트 | `@fontsource` 자가 호스팅 ✅ |
| 오로라 배경 `will-change` | ✅ |

---

## 6. 구조화 데이터 (JSON-LD)

| 스키마 | 존재 여부 | 우선순위 |
|---|---|---|
| `WebApplication` | ✅ (index.html) | - |
| `Organization` | ❌ | P1 |
| `VideoGame` / `CreativeWork` (게임별) | ❌ | P1 (게임 페이지 선결) |
| `BreadcrumbList` | ❌ | P1 |
| `SiteNavigationElement` | ❌ | P2 |
| `FAQPage` (About) | ❌ | P2 |

---

## 7. i18n SEO

| 항목 | 상태 |
|---|---|
| `<html lang>` | ⚠️ `"ko"` 정적 고정 (EN 전환 시에도 그대로) |
| `og:locale` | ✅ `SEO.tsx`에서 동적 (ko_KR / en_US) |
| `hreflang` 태그 | ❌ 없음 |
| 라우트 분리 (`/en/*`) | ❌ 없음 (같은 URL, 상태 기반 토글) |

---

## 8. 게임 데이터 모델

```ts
games {
  id: uuid (PK)
  title, description, category, type, playtime
  tags: text[]
  views, likes, status
  html_url, thumbnail_url
  file_paths, entry_file
  created_at
  // ❌ slug 없음
  // ❌ meta_description, seo_keywords 없음
  // ❌ published_at, updated_at 부재
}
```

---

## 🎯 우선순위 실행 계획

### 🔴 P0 — 반드시 선결 (색인 불능 해결)

| # | 작업 | 변경 범위 |
|---|---|---|
| P0-1 | `games.slug` 컬럼 추가 + 기존 데이터 백필 (title→kebab-case + id 접미사) | Supabase 마이그레이션 |
| P0-2 | `/games/:slug` 라우트 + `GameDetailPage` 신설 (iframe 포함 풀 페이지) | 신규 파일 |
| P0-3 | 공유/썸네일 링크를 `?game=` → `/games/:slug`로 전환 | `GameCard`, `GamePlayModal`, `ShareButton` |
| P0-4 | `SEO.tsx`로 게임별 title/description/canonical/og:image 동적 주입 | `GameDetailPage` |
| P0-5 | `sitemap.xml`을 Supabase RPC/Edge Function으로 **동적 생성** (전체 게임 포함) | 신규 함수 + `_redirects` |

### 🟡 P1 — 검색 품질 향상

| # | 작업 |
|---|---|
| P1-1 | 게임별 JSON-LD `VideoGame` 스키마 주입 |
| P1-2 | `Organization` + `WebSite`(SearchAction) 스키마 → `index.html` |
| P1-3 | `BreadcrumbList` 스키마 (게임 상세) |
| P1-4 | `/shorts` / `/games` / `/search`에 가시 `<h1>` 추가 |
| P1-5 | Mission 컴포넌트 `<p>` → `<h2>` 의미 태그 교정 |
| P1-6 | 모든 `<img>`에 `width`/`height` + `loading="lazy"` + `decoding="async"` |
| P1-7 | 썸네일 WebP 변환 (Supabase Image Transform 또는 프리셋) |
| P1-8 | `<html lang>` 동적 (react-helmet `htmlAttributes`) |

### 🟢 P2 — 장기 개선

| # | 작업 |
|---|---|
| P2-1 | `hreflang` 태그 + `/en` 경로 분리 검토 |
| P2-2 | 비디오 `poster` 이미지 추가 |
| P2-3 | `FAQPage` / `HowTo` 스키마 (About 페이지) |
| P2-4 | 프리렌더링 도입 검토 (`vite-plugin-prerender` / Cloudflare Pages Functions SSR) |
| P2-5 | Core Web Vitals 모니터링 (web-vitals → analytics) |

---

## 📋 검증 지표 (Phase 3에서 측정)

- Lighthouse SEO 100 / Performance 90+ / Accessibility 95+
- Core Web Vitals: LCP < 2.5s · CLS < 0.1 · INP < 200ms
- Google Rich Results Test 통과 (VideoGame, Breadcrumb)
- `site:gamedrop.win` 색인 URL 수 증가 (게임 개수 비례)
- Naver 웹마스터 색인 요청 성공률 100%

---

## ⏭️ 다음 단계

위 P0/P1/P2 우선순위에 대한 **승인**이 필요합니다.

- ✅ **그대로 진행**: Phase 2에서 P0 → P1 순으로 구현
- ✏️ **순서 조정**: 먼저 하고 싶은 작업 지정
- ⏸️ **범위 축소**: P0만 하고 P1/P2는 별도 세션

**추천:** P0만 이번 세션에서 완료 (4~6시간 작업량). P1/P2는 후속 세션. 이유: P0가 색인 불능 문제를 해결하므로 SEO 임팩트 80% 이상이고, 한 번에 너무 많이 바꾸면 회귀 리스크 큼.
