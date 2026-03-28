<!-- Generated: 2026-03-28 | Updated: 2026-03-28 -->

# Claude Code 완전 가이드

## Purpose
비개발자를 위한 Claude Code + OMC(oh-my-claudecode) 명령어 가이드. 단일 HTML 정적 페이지로 빌드 없이 브라우저에서 바로 열어 사용한다.

## Key Files

| File | Description |
|------|-------------|
| `index.html` | HTML 구조 전체 (1,800줄 한도). 섹션 ID 기반 5단계 구조 |
| `style.css` | 전체 스타일시트. CSS 변수 시스템(`:root`), 반응형, 카드·FAQ·용어사전 스타일 |
| `script.js` | 인터랙션 로직: 실시간 검색, 클립보드 복사, 드롭다운, 모바일 메뉴, 스크롤 추적 |
| `CLAUDE.md` | 프로젝트 규칙: 섹션 ID 테이블, 카드 구조, 콘텐츠 추가 규칙, 버전 정보 위치 |

## For AI Agents

### Working In This Directory
- `index.html`은 **1,800줄 한도**. 줄 수를 항상 확인할 것
- CSS/JS는 외부 파일(`style.css`, `script.js`)로 분리됨. HTML에 인라인 CSS/JS 추가 금지
- 외부 의존성은 Google Fonts CDN뿐. 새 CDN 추가 시 사전 확인 필요
- 카드 추가 시 `data-cmd`, `data-desc`, `data-when`(명령어 카드) 또는 `data-desc`(FAQ) 속성 필수
- 섹션 추가 시 navbar(데스크탑 드롭다운 + 모바일 메뉴) 링크도 함께 추가

### 5단계 섹션 구조
1. **입문**: #about-claude, #preparation, #getting-started, #app-vs-terminal, #quick
2. **활용**: #dept-guide, #workflow
3. **명령어**: #s1 ~ #s10
4. **심화**: #skills-agents, #s11, #troubleshoot
5. **참고**: #resources, #cheatsheet, #glossary

### Navbar 구조
- **데스크탑**: 4개 드롭다운 (입문, 활용, 명령어, 심화·참고)
- **모바일**: 5단계 divider로 구분된 링크 목록

### CSS 변수
```css
--accent-primary: #7c6af7   /* 퍼플 — 주 강조 */
--accent-secondary: #4ecdc4  /* 틸 — 보조 강조 */
--accent-warm: #f7b731       /* 노랑 — 경고/업데이트 */
--accent-danger: #ff6b6b     /* 빨강 — 위험/보안 경고 */
```

### 카드 패턴
| 클래스 | 용도 | 필수 속성 |
|--------|------|-----------|
| `.cmd-card` | 명령어 카드 | `data-cmd`, `data-desc`, `data-when` |
| `.workflow-card` | 워크플로우/부서별/스킬 카드 | `data-desc` |
| `.faq-item` | FAQ 항목 | `data-desc` |
| `.glossary-item` | 용어사전 항목 | `data-desc` |
| `.quick-item` | 빠른 선택 카드 | — |

### Testing Requirements
- 브라우저에서 `index.html`을 직접 열어 확인
- 검색 필터: 명령어·워크플로우·FAQ·용어사전·빠른선택 모두 동작하는지 확인
- 모바일 반응형: 375px 이하에서 레이아웃 깨짐 확인
- 모든 navbar 링크가 올바른 섹션으로 스크롤되는지 확인
- `section-count` 숫자가 실제 카드/항목 수와 일치하는지 확인

### 버전 정보 위치
1. 히어로 배지: `oh-my-claudecode vX.X.X`
2. 푸터 업데이트 배너: `vX.X.X 업데이트 가능`

OMC 업데이트 후 두 곳 모두 수정 필요.

## Dependencies

### External
- Google Fonts CDN: `Noto Sans KR`, `JetBrains Mono`, `Syne` (오프라인 시 시스템 폰트 폴백)

<!-- MANUAL: -->
