# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Claude Code + OMC 명령어 가이드 — 개발자가 아닌 사용자도 쉽게 이해할 수 있도록 만든 단일 HTML 정적 페이지.

## 파일 구조

```
claude-code-guide/
├── index.html    # HTML 구조 (CSS·JS는 외부 파일)
├── style.css     # 전체 스타일시트
└── script.js     # 인터랙션 로직
```

빌드 과정 없음. `index.html`을 브라우저에서 직접 열면 동작한다.

## 아키텍처

### 3파일 구조
`index.html`(HTML) + `style.css`(스타일) + `script.js`(로직)으로 분리되어 있다.

외부 의존성은 Google Fonts CDN(`Noto Sans KR`, `JetBrains Mono`, `Syne`)뿐이며, 오프라인에서는 시스템 폰트로 자동 폴백된다.

### HTML 레이아웃 구조 (중요)

```
<navbar>         ← position: fixed, z-index: 100
<nav-mobile-menu>← 모바일 슬라이드 메뉴
<div.hero>       ← 히어로 섹션 (**.main 바깥**)
<div.main>
  <div.search-wrap> ← position: sticky, top: 56px (navbar 높이)
  섹션들...
</div.main>
<footer.footer>  ← 푸터 (**.main 바깥**)
<div#curriculum-page class="page-view"> ← 커리큘럼 페이지 컨테이너
<script src="script.js">
```

`.hero`와 `.footer`가 `.main` **바깥**에 있다. 페이지 전환 시 이 세 요소를 모두 숨겨야 한다.

### 페이지 전환 시스템 (커리큘럼)

`showPage(pageId)` / `hidePage()`로 단일 페이지 내 뷰 전환을 구현한다.

- `showPage()`: `.main`, `.hero`, `.footer`, `.search-wrap` 숨김 → `.page-view` 활성화
- `hidePage()`: 역순 복구
- 커리큘럼 HTML은 `buildCurriculum()` 함수가 JS 템플릿으로 동적 생성 (index.html 줄 수 절약)
- 새 페이지 추가 시: `<div id="XXX-page" class="page-view"></div>` 1줄 + `buildXXX()` 함수

### CSS 변수 시스템
`:root`에 모든 색상·반경 변수가 선언된다.

```css
--accent-primary: #7c6af7   /* 퍼플 — 주 강조 */
--accent-secondary: #4ecdc4  /* 틸 — 보조 강조 */
--accent-warm: #f7b731       /* 노랑 — 경고/업데이트 */
--accent-danger: #ff6b6b     /* 빨강 — 위험/보안 경고 */
```

### 섹션 ID 규칙 (5단계 구조)

| 단계 | ID | 섹션 |
|------|-----|------|
| 입문 | `#about-claude` | Claude·Claude Code·OMC 소개 |
| 입문 | `#preparation` | 교육 사전 준비 체크리스트 |
| 입문 | `#getting-started` | 시작하기 |
| 입문 | `#app-vs-terminal` | 앱 vs 터미널 비교 |
| 입문 | `#quick` | 상황별 빠른 선택 |
| 활용 | `#dept-guide` | 부서별 활용 가이드 |
| 활용 | `#workflow` | 워크플로우 레시피 + 플로우맵 |
| 명령어 | `#s1` ~ `#s10` | 명령어 카테고리 섹션 |
| 심화 | `#skills-agents` | 스킬 & 에이전트 운영 |
| 심화 | `#agent-team` | 에이전트 팀 구성 & 운영 |
| 심화 | `#s11` | 초보자 팁 |
| 심화 | `#troubleshoot` | 트러블슈팅 FAQ |
| 참고 | `#resources` | 스킬·플러그인 리소스 |
| 참고 | `#cheatsheet` | 치트시트 |
| 참고 | `#glossary` | 용어사전 |

새 섹션 추가 시 navbar(데스크탑 드롭다운 4개 + 모바일 메뉴) `<a>` 링크도 함께 추가해야 한다.

## 파일 사이즈 한도

`index.html`은 **2,000줄** 한도. CSS·JS는 외부 파일이므로 제한 없음.
콘텐츠가 많을 경우 JS 템플릿(`buildXXX()`)으로 동적 생성하면 줄 수를 절약할 수 있다.

## 카드 구조 및 검색 연동

### 명령어 카드
```html
<div class="cmd-card" onclick="copyCmd('/명령어')"
  data-cmd="/명령어"
  data-desc="설명"
  data-when="사용 상황">
```
`data-cmd`, `data-desc`, `data-when` 세 속성 모두 필수 — 실시간 검색 필터 대상.

### 기타 카드 패턴
| 클래스 | 검색 대상 속성 |
|--------|--------------|
| `.workflow-card` | `data-desc` |
| `.faq-item` | `data-desc` |
| `.glossary-item` | `data-desc` |
| `.quick-item` | `textContent` |

### 워크플로우 플로우맵 (`.flow-map`)
`#workflow` 섹션 최상단에 위치. 6단계(아이디어→요구사항→계획→실행→검증→완성) 시각화.
`.flow-node.active` 클래스가 보라색 강조 스타일을 적용한다.

## JS 기능 목록

- `copyCmd(cmd)` — 클립보드 복사 + 토스트 알림
- `doSearch()` — 실시간 필터 (카드 숨김/복원 + 하이라이트)
- `toggleDropdown(id)` — 데스크탑 nav 드롭다운 토글
- `toggleMobileMenu()` / `closeMobileMenu()` — 모바일 메뉴
- `showPage(pageId)` / `hidePage()` — 페이지 전환 (커리큘럼 등)
- `buildCurriculum()` — 커리큘럼 HTML 동적 생성
- IntersectionObserver — 스크롤 위치에 따른 navbar active 링크 추적

## 콘텐츠 추가 규칙

### 명령어 카드 추가
1. 해당 `<div id="sN">` 내 `.cmd-grid` 안에 `.cmd-card` 추가
2. 섹션 헤더 `<span class="section-count">N개</span>` 업데이트

### FAQ 항목 추가
1. `#troubleshoot` 내 `.faq-item` 추가 (`data-desc` 속성 필수)
2. section-count 숫자 업데이트

### 보안/경고 카드
```html
<div class="perm-card warning">  <!-- 빨간 왼쪽 보더 -->
<div class="perm-card info">     <!-- 틸 왼쪽 보더 -->
```

## 버전 정보 위치

파일 내 두 곳에 하드코딩:
1. 히어로 배지 (index.html ~line 117): `oh-my-claudecode v4.9.0`
2. 푸터 업데이트 배너 (index.html ~line 123): `v4.9.1 업데이트 가능`

OMC 업데이트 후 두 곳 모두 수정해야 한다.
