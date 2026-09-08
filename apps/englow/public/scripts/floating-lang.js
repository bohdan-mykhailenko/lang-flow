/* global window, document, localStorage */
// Movable / Draggable Quick Language Switcher for Englow
(function () {
  function initFloatingLangSwitcher() {
    let btn = document.getElementById('englow-floating-lang-btn');
    if (btn) return;

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

    // Restore saved position if available
    try {
      const savedPos = localStorage.getItem('englow-lang-btn-pos');
      if (savedPos) {
        const { left, top } = JSON.parse(savedPos);
        const maxL = window.innerWidth - 80;
        const maxT = window.innerHeight - 60;
        if (left >= 0 && left <= maxL && top >= 0 && top <= maxT) {
          btn.style.left = `${left}px`;
          btn.style.top = `${top}px`;
          btn.style.right = 'auto';
          btn.style.bottom = 'auto';
        }
      }
    } catch {
      // Ignore storage errors
    }

    // Draggable / Movable interaction
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;
    let moved = false;

    function onPointerDown(e) {
      // Only primary mouse button or single touch
      if (e.button !== undefined && e.button !== 0) return;

      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      const clientY = e.clientY ?? e.touches?.[0]?.clientY;
      if (clientX === undefined || clientY === undefined) return;

      isDragging = true;
      moved = false;
      startX = clientX;
      startY = clientY;

      const rect = btn.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      btn.classList.add('is-dragging');

      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
    }

    function handleMove(clientX, clientY, e) {
      if (!isDragging) return;

      const dx = clientX - startX;
      const dy = clientY - startY;

      if (!moved && Math.hypot(dx, dy) > 4) {
        moved = true;
      }

      if (moved) {
        if (e && e.cancelable) e.preventDefault();

        const maxLeft = window.innerWidth - btn.offsetWidth - 12;
        const maxTop = window.innerHeight - btn.offsetHeight - 12;

        const newLeft = Math.max(12, Math.min(maxLeft, initialLeft + dx));
        const newTop = Math.max(12, Math.min(maxTop, initialTop + dy));

        btn.style.left = `${newLeft}px`;
        btn.style.top = `${newTop}px`;
        btn.style.right = 'auto';
        btn.style.bottom = 'auto';
      }
    }

    function onPointerMove(e) {
      handleMove(e.clientX, e.clientY, e);
    }

    function onTouchMove(e) {
      if (!e.touches?.[0]) return;
      handleMove(e.touches[0].clientX, e.touches[0].clientY, e);
    }

    function onDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      btn.classList.remove('is-dragging');

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      if (moved) {
        try {
          const rect = btn.getBoundingClientRect();
          localStorage.setItem(
            'englow-lang-btn-pos',
            JSON.stringify({
              left: Math.round(rect.left),
              top: Math.round(rect.top),
            }),
          );
        } catch {
          // Ignore
        }
      }
    }

    function onPointerUp(e) {
      onDragEnd();
      if (moved && e) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    function onTouchEnd(e) {
      onDragEnd();
      if (moved && e) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    btn.addEventListener('click', function (e) {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    });

    btn.addEventListener('pointerdown', onPointerDown);
    btn.addEventListener('touchstart', onPointerDown, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFloatingLangSwitcher);
  } else {
    initFloatingLangSwitcher();
  }

  window.addEventListener('astro:page-load', initFloatingLangSwitcher);
  window.addEventListener('pageshow', initFloatingLangSwitcher);
})();
