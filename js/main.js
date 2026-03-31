// =============================================
// Sylvia Studio - Main JavaScript
// =============================================

document.addEventListener('DOMContentLoaded', function () {

  // --- Navigation scroll effect ---
  const nav = document.querySelector('.nav');
  const SCROLL_THRESHOLD = 80;

  function handleNavScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // --- Mobile menu ---
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-menu__close');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Close mobile menu when clicking a link
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Scroll reveal animations ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Page transition ---
  const pageLinks = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto"]):not([href^="http"]):not([target="_blank"])');
  const overlay = document.querySelector('.page-transition');

  if (overlay) {
    pageLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        e.preventDefault();
        overlay.classList.add('active');

        setTimeout(() => {
          window.location.href = href;
        }, 400);
      });
    });

    // Fade in on page load
    overlay.classList.remove('active');
  }

  // --- Flip card touch support ---
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', function () {
      const inner = this.querySelector('.flip-card__inner');
      if (inner) {
        const isFlipped = inner.style.transform === 'rotateY(180deg)';
        inner.style.transform = isFlipped ? '' : 'rotateY(180deg)';
      }
    });
  });

  // --- Theme Toggle ---
  document.querySelectorAll('.theme-toggle').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  });

  // --- Analytics Accordion ---
  document.querySelectorAll('.acc-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.acc-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.acc-header').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --- Active nav link ---
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav__link, .dropdown__item').forEach(link => {
    if (link.getAttribute('href') === currentPath ||
        link.getAttribute('href') === currentPath.replace('/index.html', '/')) {
      link.style.opacity = '0.5';
    }
  });

});
