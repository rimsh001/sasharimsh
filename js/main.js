/* ==========================================================
   sasharimsh.ru — main.js
   Минимальная интерактивность: мобильное меню + fade-in
   ========================================================== */

(function() {
  'use strict';

  // --- Мобильное меню ---
  const navToggle = document.querySelector('.site-nav__toggle');
  const nav = document.querySelector('.site-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function() {
      nav.classList.toggle('is-open');
      const isOpen = nav.classList.contains('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Закрыть меню при клике на ссылку
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Fade-in при скролле через IntersectionObserver ---
  const fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window && fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    // Fallback для старых браузеров
    fadeElements.forEach(el => el.classList.add('is-visible'));
  }

  // --- Плавный скролл по якорям внутри страницы ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });



  // --- Cookie-баннер ---
  const cookieKey = 'cookie_consent';

  function getCookieConsent() {
    try { return localStorage.getItem(cookieKey); } catch (error) { return null; }
  }

  function setCookieConsent(value) {
    try { localStorage.setItem(cookieKey, value); } catch (error) {}
  }

  function createCookieBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Уведомление об использовании cookies');

    banner.innerHTML = `
      <p class="cookie-banner__text">
        Мы используем cookie и сервисы аналитики, чтобы сайт работал корректно, анализировать посещаемость и улучшать материалы. Нажимая «Принять», вы соглашаетесь на обработку cookie в соответствии с <a href="cookies.html" class="cookie-banner__link">Политикой cookie</a>.
      </p>
      <div class="cookie-banner__actions">
        <button type="button" class="cookie-banner__button" data-consent="accepted">Принять</button>
        <button type="button" class="cookie-banner__button cookie-banner__button--ghost" data-consent="declined">Отклонить необязательные</button>
        <a href="cookies.html" class="cookie-banner__button cookie-banner__button--link">Подробнее</a>
      </div>
    `;

    banner.querySelectorAll('[data-consent]').forEach(btn => {
      btn.addEventListener('click', () => {
        setCookieConsent(btn.getAttribute('data-consent'));
        banner.classList.add('is-hidden');
        setTimeout(() => banner.remove(), 250);
      });
    });

    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add('is-visible'));
  }

  if (!getCookieConsent()) {
    createCookieBanner();
  }

// --- Текущий год в подвале ---
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
