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
  const cookieKey = 'cookieConsentAccepted';

  function setCookieConsentAccepted() {
    try {
      localStorage.setItem(cookieKey, 'true');
    } catch (error) {
      // Игнорируем ошибки доступа к localStorage
    }
  }

  function hasCookieConsentAccepted() {
    try {
      return localStorage.getItem(cookieKey) === 'true';
    } catch (error) {
      return false;
    }
  }

  function createCookieBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Уведомление об использовании cookies');

    banner.innerHTML = `
      <p class="cookie-banner__text">
        Мы используем cookies для корректной работы сайта.
        <a href="privacy.html" class="cookie-banner__link">Подробнее</a>
      </p>
      <button type="button" class="cookie-banner__button">Понятно</button>
    `;

    const acceptButton = banner.querySelector('.cookie-banner__button');
    if (acceptButton) {
      acceptButton.addEventListener('click', () => {
        setCookieConsentAccepted();
        banner.classList.add('is-hidden');
        setTimeout(() => banner.remove(), 250);
      });
    }

    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add('is-visible'));
  }

  if (!hasCookieConsentAccepted()) {
    createCookieBanner();
  }

  // --- Текущий год в подвале ---
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
