/* global window, document */
// Floating Quick Language Switcher for Englow
(function () {
  function initFloatingLangSwitcher() {
    if (document.getElementById('englow-floating-lang-btn')) return;

    const path = window.location.pathname;
    const isUk = path.startsWith('/uk/') || path === '/uk';

    // Calculate target URL preserving current page slug
    let targetUrl;
    let buttonText;
    let flagEmoji;

    if (isUk) {
      targetUrl = path.replace(/^\/uk(\/|$)/, '$1') || '/';
      buttonText = 'English';
      flagEmoji = '🇺🇸';
    } else {
      targetUrl = '/uk' + (path.startsWith('/') ? path : '/' + path);
      buttonText = 'Українська';
      flagEmoji = '🇺🇦';
    }

    const btn = document.createElement('a');
    btn.id = 'englow-floating-lang-btn';
    btn.href = targetUrl;
    btn.className = 'englow-floating-lang-pill';
    btn.setAttribute(
      'aria-label',
      isUk ? 'Switch to English' : 'Перейти на українську',
    );
    btn.innerHTML = `
      <span class="englow-floating-flag">${flagEmoji}</span>
      <span class="englow-floating-text">${buttonText}</span>
      <svg class="englow-floating-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M7 16l-4-4m0 0l4-4m-4 4h18m-4 4l4-4m0 0l-4-4"></path>
      </svg>
    `;

    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFloatingLangSwitcher);
  } else {
    initFloatingLangSwitcher();
  }

  // Support navigation / Astro page-load events
  window.addEventListener('astro:page-load', initFloatingLangSwitcher);
  window.addEventListener('pageshow', initFloatingLangSwitcher);
})();
