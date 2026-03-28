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
