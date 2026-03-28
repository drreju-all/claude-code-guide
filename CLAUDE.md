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

### CSS 변수 시스템
`:root`에 모든 색상·반경 변수가 선언된다. 색상 변경 시 변수만 수정하면 전체 반영된다.

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
| 입문 | `#getting-started` | 시작하기 |
| 입문 | `#preparation` | 교육 사전 준비 체크리스트 |
| 입문 | `#app-vs-terminal` | 앱 vs 터미널 비교 |
| 입문 | `#quick` | 상황별 빠른 선택 |
| 활용 | `#dept-guide` | 부서별 활용 가이드 |
| 활용 | `#workflow` | 워크플로우 레시피 |
| 명령어 | `#s1` ~ `#s8` | 명령어 카테고리 섹션 |
| 명령어 | `#s9` | 승인 & 권한 관리 |
| 명령어 | `#s10` | 외부 서비스 연동 |
| 심화 | `#skills-agents` | 스킬 & 에이전트 운영 |
| 심화 | `#agent-team` | 에이전트 팀 구성 & 운영 |
| 심화 | `#s11` | 초보자 팁 |
| 심화 | `#troubleshoot` | 트러블슈팅 FAQ |
| 참고 | `#resources` | 스킬·플러그인 리소스 |
| 참고 | `#cheatsheet` | 치트시트 |
| 참고 | `#glossary` | 용어사전 |

새 섹션 추가 시 navbar(데스크탑 + 모바일) `<a>` 링크도 함께 추가해야 한다.

## 파일 사이즈 한도

CSS와 JS는 외부 파일(`style.css`, `script.js`)로 분리되어 있다. `index.html`은 HTML만 포함하며 **2,000줄**을 초과하지 않는다.

### 명령어 카드 구조
```html
<div class="cmd-card" onclick="copyCmd('/명령어')"
  data-cmd="/명령어"
  data-desc="설명"
  data-when="사용 상황">
  ...
</div>
```
`data-cmd`, `data-desc`, `data-when` 세 속성이 실시간 검색 필터의 대상이다. 카드 추가 시 세 속성 모두 반드시 포함해야 한다.

### JS 기능 목록
- `copyCmd(cmd)` — 클립보드 복사 + 토스트 알림
- `doSearch()` — 실시간 필터 (카드 숨김/복원 + 하이라이트)
- IntersectionObserver — 스크롤 위치에 따른 navbar active 링크 추적
- 스크롤 맨 위로 버튼 (400px 이상 스크롤 시 등장)

## 콘텐츠 추가 규칙

### 명령어 섹션에 카드 추가할 때
1. 해당 `<div id="sN">` 블록 내 `.cmd-grid` 안에 `.cmd-card` 추가
2. 섹션 헤더의 `<span class="section-count">N개</span>` 숫자 업데이트

### 새 섹션 전체 추가할 때
1. 다음 ID(`s12`, `s13` …)로 섹션 div 생성
2. navbar에 `<a class="nav-link" href="#sN">이모지 <span>이름</span></a>` 추가

### 팁 카드 추가할 때
- `.tips-grid` 안에 `.tip-card` 추가
- `<div class="tip-number">N</div>` 번호 및 섹션 헤더 count 업데이트

### 보안/경고 카드 스타일
```html
<div class="perm-card warning">  <!-- 빨간 왼쪽 보더 -->
<div class="perm-card info">     <!-- 틸 왼쪽 보더 -->
```

## 현재 포함된 명령어 목록 (33개)

**자동실행**: `/autopilot` `/ralph` `/ultrawork` `/ultraqa`
**계획**: `/plan` `/ralplan` `/deep-interview` `/deep-dive`
**디버그**: `/trace` `/ai-slop-cleaner` `/simplify`
**멀티AI**: `/team` `/ccg` `/ask` `/sciomc` `/omc-teams`
**초기화**: `/init` `/deepinit` `/project-session-manager` `/external-context`
**워크플로우**: `/cancel` `/loop` `/schedule`
**학습**: `/learner` `/writer-memory`
**설정**: `/omc-setup` `/omc-doctor` `/mcp-setup` `/configure-notifications` `/update-config` `/keybindings-help` `/hud` `/skill`

## 버전 정보 업데이트

파일 내 두 곳에 버전이 하드코딩되어 있다:
1. 히어로 배지: `oh-my-claudecode v4.9.0` (현재 설치 버전)
2. 푸터 업데이트 배너: `v4.9.1 업데이트 가능`

OMC 업데이트 후 두 곳 모두 수정해야 한다.
