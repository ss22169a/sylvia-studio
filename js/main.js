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

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        mobileMenu.classList.add('open');
        hamburger.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }

  // Close mobile menu when clicking a link
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
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

  // --- Works Showcase ---
  (function() {
    const DATA = [
      {
        href: 'work/blank-space.html',
        img: 'https://sylviaho.co/cdn/shop/files/Rectangle_1402_18969232-0d7d-49b4-bff0-c6675a72df53.jpg?v=1766763222&width=1400',
        overview: { zh: '共同創辦人。從零建立品牌，擴展至台灣五家實體門市，全程主導品牌定位、獲客策略與視覺識別。', en: 'Co-founded the brand from scratch, expanding to five physical stores across Taiwan — leading brand positioning, customer acquisition, and visual identity.' },
        tags: 'Brand Strategy · Go-to-Market · Omnichannel Growth · Team Leadership'
      },
      {
        href: 'work/vvis-studio.html',
        img: 'https://sylviaho.co/cdn/shop/files/Rectangle_158.jpg?v=1769794586&width=1400',
        overview: { zh: '為 B2B 翻譯服務公司建立數位公信力，透過 Shopify 架構、SEO 與 EDM 策略提升品牌能見度與潛在客戶轉換。', en: 'Built digital credibility for a B2B translation firm via Shopify architecture, SEO strategy, and EDM campaigns to grow brand visibility and lead conversion.' },
        tags: 'Shopify Development · SEO Strategy · Content Architecture · B2B Lead Generation'
      },
      {
        href: 'work/secux.html',
        img: 'https://sylviaho.co/cdn/shop/files/Group_92.jpg?v=1771613602&width=1400',
        overview: { zh: '主導 PUFido Clife Key 國際產品發布，從初始概念到 InnoVEX 2025 正式亮相，推動品牌認知與電商轉換率雙升。', en: 'Led international launch of PUFido Clife Key from concept to InnoVEX 2025 debut, driving brand awareness and e-commerce conversion.' },
        tags: 'Project Management · Go-to-Market · International Marketing · Performance Analytics'
      },
      {
        href: 'work/tellus-materials.html',
        img: 'https://sylviaho.co/cdn/shop/files/Rectangle_242_1d634d9e-13d7-458f-be9a-657231b3d070.jpg?v=1&width=1400',
        overview: { zh: '從零建立 B2B 材料科技公司的數位形象，整合網站架構、內容策略與自動化 EDM 系統。', en: 'Built digital presence from scratch for a B2B materials tech company, integrating website architecture, content strategy, and automated EDM.' },
        tags: 'Website Development · Content Strategy · UI/UX Design · SEO Optimization'
      },
      {
        href: 'work/oloo.html',
        img: 'https://sylviaho.co/cdn/shop/files/Group_91.jpg?v=1771625375&width=1400',
        overview: { zh: '在法規前期市場建立校園移動生態系統，透過社群活動與品牌敘事推動電動滑板車在大學的接受度。', en: 'Built a campus mobility ecosystem in a pre-regulatory market through community events and brand storytelling.' },
        tags: 'Market Development · Campus Partnerships · Brand Storytelling · Community Building'
      }
    ];

    const items = document.querySelectorAll('.ws-item');
    const preview = document.getElementById('wsPreview');
    const previewImg = document.getElementById('wsPreviewImg');
    const previewOverview = document.getElementById('wsPreviewOverview');
    const previewTags = document.getElementById('wsPreviewTags');
    const previewLink = document.getElementById('wsPreviewLink');

    if (!items.length || !preview) return;

    let activeIndex = 0;
    let busy = false;

    function getLang() { return localStorage.getItem('sylvia-lang') || 'zh'; }

    function updateLeft(index, instant) {
      const d = DATA[index];
      const lang = getLang();
      if (instant) {
        previewImg.src = d.img;
        if (previewLink) previewLink.href = d.href;
        if (previewOverview) previewOverview.textContent = d.overview[lang];
        if (previewTags) previewTags.textContent = d.tags;
        return;
      }
      if (busy) return;
      busy = true;
      preview.classList.add('fading');
      setTimeout(function() {
        previewImg.src = d.img;
        if (previewLink) previewLink.href = d.href;
        if (previewOverview) previewOverview.textContent = d.overview[lang];
        if (previewTags) previewTags.textContent = d.tags;
        preview.classList.remove('fading');
        busy = false;
      }, 220);
    }

    function setActive(index) {
      if (index === activeIndex && items[index].classList.contains('active')) return;
      activeIndex = index;
      items.forEach(function(el, i) { el.classList.toggle('active', i === index); });
      updateLeft(index, false);
    }

    updateLeft(0, true);

    items.forEach(function(item, i) {
      item.addEventListener('mouseenter', function() { setActive(i); });
      var link = item.querySelector('.ws-item__title');
      if (link) {
        link.addEventListener('click', function(e) {
          if (!item.classList.contains('active')) { e.preventDefault(); setActive(i); }
        });
      }
    });

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          setActive(parseInt(entry.target.dataset.index));
        }
      });
    }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });

    items.forEach(function(item) { observer.observe(item); });

    document.addEventListener('langChange', function() { updateLeft(activeIndex, true); });
  })();

  // --- Active nav link ---
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav__link, .dropdown__item').forEach(link => {
    if (link.getAttribute('href') === currentPath ||
        link.getAttribute('href') === currentPath.replace('/index.html', '/')) {
      link.style.opacity = '0.5';
    }
  });

});
