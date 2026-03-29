  // ---- COPY COMMAND ----
  function copyCmd(cmd) {
    navigator.clipboard.writeText(cmd).then(() => {
      showToast(cmd + ' 복사됨!');
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = cmd;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(cmd + ' 복사됨!');
    });
  }

  function showToast(msg) {
    const el = document.getElementById('copiedFlash');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 2000);
  }

  // ---- SEARCH ----
  const searchInput = document.getElementById('searchInput');
  const searchCount = document.getElementById('searchCount');
  const noResults = document.getElementById('noResults');

  function highlight(text, query) {
    if (!query) return text;
    const re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return text.replace(re, '<mark class="highlight">$1</mark>');
  }

  function doSearch() {
    const q = searchInput.value.trim().toLowerCase();
    let visible = 0;

    // 명령어 카드 검색
    document.querySelectorAll('.cmd-card').forEach(card => {
      const cmd = (card.dataset.cmd || '').toLowerCase();
      const desc = (card.dataset.desc || '').toLowerCase();
      const when = (card.dataset.when || '').toLowerCase();
      const match = !q || cmd.includes(q) || desc.includes(q) || when.includes(q);
      card.classList.toggle('hidden', !match);
      if (match) {
        visible++;
        if (q) {
          const nameEl = card.querySelector('.cmd-name');
          const descEl = card.querySelector('.cmd-desc');
          const whenEl = card.querySelector('.cmd-when');
          if (nameEl) nameEl.innerHTML = highlight(card.dataset.cmd, searchInput.value.trim());
          if (descEl) descEl.innerHTML = highlight(card.dataset.desc, searchInput.value.trim());
          if (whenEl) whenEl.innerHTML = highlight(card.dataset.when, searchInput.value.trim());
        } else {
          const nameEl = card.querySelector('.cmd-name');
          const descEl = card.querySelector('.cmd-desc');
          const whenEl = card.querySelector('.cmd-when');
          if (nameEl) nameEl.textContent = card.dataset.cmd;
          if (descEl) descEl.textContent = card.dataset.desc;
          if (whenEl) whenEl.textContent = card.dataset.when;
        }
      }
    });

    // 워크플로우 카드 검색
    document.querySelectorAll('.workflow-card').forEach(item => {
      const desc = (item.dataset.desc || item.textContent || '').toLowerCase();
      const match = !q || desc.includes(q);
      item.classList.toggle('hidden', !match);
      if (match) visible++;
    });

    // FAQ 아이템 검색
    document.querySelectorAll('.faq-item').forEach(item => {
      const desc = (item.dataset.desc || item.textContent || '').toLowerCase();
      const match = !q || desc.includes(q);
      item.classList.toggle('hidden', !match);
      if (match) visible++;
    });

    // 용어사전 아이템 검색
    document.querySelectorAll('.glossary-item').forEach(item => {
      const desc = (item.dataset.desc || item.textContent || '').toLowerCase();
      const match = !q || desc.includes(q);
      item.classList.toggle('hidden', !match);
      if (match) visible++;
    });

    // 빠른 선택 아이템 검색
    let quickVisible = 0;
    document.querySelectorAll('.quick-item').forEach(item => {
      const text = (item.textContent || '').toLowerCase();
      const match = !q || text.includes(q);
      item.classList.toggle('hidden', !match);
      if (match) { visible++; quickVisible++; }
    });
    const quickSection = document.querySelector('.quick-section');
    if (quickSection) quickSection.classList.toggle('hidden', q && quickVisible === 0);

    // 섹션 가시성 업데이트
    document.querySelectorAll('.section[data-section]').forEach(section => {
      const hasVisible = section.querySelectorAll(
        '.cmd-card:not(.hidden), .workflow-card:not(.hidden), .faq-item:not(.hidden), .glossary-item:not(.hidden)'
      ).length > 0;
      section.classList.toggle('hidden', q && !hasVisible);
    });

    searchCount.textContent = q ? visible + '개' : '';
    noResults.style.display = (q && visible === 0) ? 'block' : 'none';
  }

  searchInput.addEventListener('input', doSearch);

  // ---- DROPDOWN ----
  function toggleDropdown(id) {
    const el = document.getElementById(id);
    const isOpen = el.classList.contains('open');
    document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
    if (!isOpen) el.classList.add('open');
  }

  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
    }
  });

  // Dropdown nav-links close dropdown and keep active state
  document.querySelectorAll('.nav-dropdown-menu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
    });
  });

  // ---- MOBILE MENU ----
  function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.getElementById('hamburgerBtn');
    const isOpen = menu.classList.contains('open');
    menu.classList.toggle('open', !isOpen);
    btn.textContent = isOpen ? '☰' : '✕';
    btn.setAttribute('aria-label', isOpen ? '메뉴 열기' : '메뉴 닫기');
  }

  function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.getElementById('hamburgerBtn');
    menu.classList.remove('open');
    btn.textContent = '☰';
    btn.setAttribute('aria-label', '메뉴 열기');
  }

  // ---- SCROLL TO TOP ----
  const scrollTopBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // ---- ACTIVE NAV LINK ----
  const sectionIds = [...document.querySelectorAll('.nav-link')]
    .map(l => l.getAttribute('href')?.slice(1))
    .filter(Boolean);
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));

  // ---- CURRICULUM PAGE ----
  const _pageHideEls = () => ['.main', '.hero', '.footer'].map(s => document.querySelector(s)).filter(Boolean);

  function showPage(pageId) {
    _pageHideEls().forEach(el => el.style.display = 'none');
    document.querySelector('.search-wrap').style.display = 'none';
    const page = document.getElementById(pageId + '-page');
    if (!page.innerHTML.trim()) buildCurriculum();
    page.classList.add('active');
    window.scrollTo(0, 0);
  }

  function hidePage() {
    document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
    _pageHideEls().forEach(el => el.style.display = '');
    document.querySelector('.search-wrap').style.display = '';
  }

  function buildCurriculum() {
    const bc = { '실습': 'lab', '강의': 'lec', '토론': 'disc', '공유': 'disc', '발표': 'disc', '안내': 'disc' };
    const weeks = [
      { num: '1주차', title: 'Claude가 뭔지, 어떻게 시작하나', hw: '업무 중 Claude에게 시킬 만한 일 3가지 메모해오기',
        rows: [['18:00~18:15','오리엔테이션 + 사전준비 확인 (설치 완료 여부)','점검'],['18:15~18:40','Claude란 무엇인가 (Claude → Claude Code → OMC 소개)','강의'],['18:40~19:10','앱 vs 터미널 비교 + 첫 실행 해보기','실습'],['19:10~19:40','빠른 선택 카드로 "내 상황에 맞는 명령어" 찾기','실습'],['19:40~20:10','부서별 활용 가이드 (각자 직무에 대입해보기)','토론'],['20:10~20:30','Q&A + 과제 안내','-']] },
      { num: '2주차', title: '핵심 명령어 직접 써보기', hw: '메모해온 업무 3가지 중 1가지를 /autopilot으로 실제로 시켜보기',
        rows: [['18:00~18:15','과제 공유 + 지난주 복습','공유'],['18:15~18:50','자동실행 명령어 (/autopilot, /ralph) 개념 + 실습','실습'],['18:50~19:20','계획·디버그 명령어 (/plan, /trace) 실습','실습'],['19:20~19:50','워크플로우 플로우맵 해설 + 레시피 5개 살펴보기','강의'],['19:50~20:20','실전 예시 1~2개 따라하기 (랜딩 페이지 / 보고서)','실습'],['20:20~20:30','Q&A + 과제 안내','-']] },
      { num: '3주차', title: '팀으로 쓰고, 자동화까지', hw: null,
        rows: [['18:00~18:15','과제 발표 + 실패 경험 공유 (트러블슈팅 연결)','공유'],['18:15~18:45','에이전트 팀 구성 방법 + 실전 예시 3가지','강의'],['18:45~19:20','인플루언서 조사 / Chrome 확장 예시 따라하기','실습'],['19:20~19:45','자주 겪는 문제 해결 (트러블슈팅 FAQ)','강의'],['19:45~20:10','치트시트 + 용어사전 활용법 안내','안내'],['20:10~20:30','개인별 활용 계획 발표 + 마무리','발표']] },
    ];
    document.getElementById('curriculum-page').innerHTML = `
      <button class="curriculum-back" onclick="hidePage()">← 가이드로 돌아가기</button>
      <h1 style="font-size:26px;font-weight:800;color:var(--text-primary);margin-bottom:6px;">🎓 교육 커리큘럼</h1>
      <p style="color:var(--text-secondary);font-size:14px;margin-bottom:28px;">Claude Code 완전 가이드 · 주 1회 × 2.5시간 × 3주 과정 · 매주 오후 6시 시작</p>
      ${weeks.map(w => `<div class="curriculum-week">
        <div class="curriculum-week-title">${w.num} — ${w.title}</div>
        <div class="curriculum-week-sub">⏰ 매주 18:00~20:30</div>
        <table class="curriculum-table"><thead><tr><th>시간</th><th>내용</th><th>방식</th></tr></thead><tbody>
        ${w.rows.map(([t,c,m])=>`<tr><td>${t}</td><td>${c}</td><td><span class="cbadge ${bc[m]||''}">${m}</span></td></tr>`).join('')}
        </tbody></table>
        ${w.hw ? `<div class="curriculum-hw">📌 <strong>과제:</strong> ${w.hw}</div>` : ''}
      </div>`).join('')}
      <div style="padding:16px 20px;background:var(--bg-elevated);border-radius:10px;font-size:13px;color:var(--text-secondary);line-height:1.9;">
        <strong style="color:var(--text-primary);">💡 운영 팁</strong><br>
        • 실습은 개인 노트북에서 직접 진행 (화면 미러링 병행)<br>
        • 치트시트를 프린트해서 참고용으로 배포<br>
        • 2주차 과제가 핵심 — 실제 업무에 써본 경험이 3주차 몰입도를 결정함
      </div>`;
  }
