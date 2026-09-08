/* global window, document, localStorage */
// Clean & Reliable Floating Quick Language Switcher for Englow
(function () {
  function initFloatingLangSwitcher() {
    let btn = document.getElementById('englow-floating-lang-btn');
    if (btn) return;

    // Clean up any legacy drag coordinates from storage
    try {
      localStorage.removeItem('englow-lang-btn-pos');
    } catch {
      // Ignore
    }

    const path = window.location.pathname;
    const isUk = path.startsWith('/uk/') || path === '/uk';

    // Target URL preserving current page slug
    const targetUrl = isUk
      ? path.replace(/^\/uk(\/|$)/, '$1') || '/'
      : '/uk' + (path.startsWith('/') ? path : '/' + path);

    const langCode = isUk ? 'UA' : 'EN';
    const langThemeClass = isUk ? 'theme-ua' : 'theme-us';
    const ariaLabel = isUk ? 'Switch to English' : 'Перейти на українську';

    btn = document.createElement('a');
    btn.id = 'englow-floating-lang-btn';
    btn.href = targetUrl;
    btn.className = `englow-floating-lang-pill ${langThemeClass}`;
    btn.setAttribute('aria-label', ariaLabel);
    btn.innerHTML = `
      <span class="englow-floating-code">${langCode}</span>
      <svg class="englow-floating-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
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

  window.addEventListener('astro:page-load', initFloatingLangSwitcher);
  window.addEventListener('pageshow', initFloatingLangSwitcher);
})();
