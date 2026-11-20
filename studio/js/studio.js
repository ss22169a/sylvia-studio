// Sylvia's Studio — language toggle (zh / en) + archive filter
(function () {
  var KEY = 'studio-lang';
  var nodes = document.querySelectorAll('[data-en]');
  var altNodes = document.querySelectorAll('[data-en-alt]');

  // Keep the original Chinese copy so we can switch back.
  nodes.forEach(function (el) { el.dataset.zh = el.innerHTML; });
  altNodes.forEach(function (el) { el.dataset.zhAlt = el.getAttribute('alt') || ''; });

  function getLang() {
    try { return localStorage.getItem(KEY) || 'zh'; } catch (e) { return 'zh'; }
  }

  function setLang(lang) {
    nodes.forEach(function (el) { el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.zh; });
    altNodes.forEach(function (el) { el.setAttribute('alt', lang === 'en' ? el.dataset.enAlt : el.dataset.zhAlt); });
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hant';
    var t = document.querySelector('title');
    if (t && t.dataset.en) document.title = lang === 'en' ? t.dataset.en : t.dataset.zh;
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false');
    });
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });

  setLang(getLang());

  // Archive filter
  var filters = document.querySelectorAll('.filters button');
  if (filters.length) {
    var cards = document.querySelectorAll('.card[data-cat]');
    var empty = document.querySelector('.empty');
    filters.forEach(function (f) {
      f.addEventListener('click', function () {
        var cat = f.dataset.cat;
        var shown = 0;
        filters.forEach(function (x) { x.setAttribute('aria-pressed', x === f ? 'true' : 'false'); });
        cards.forEach(function (c) {
          var on = cat === 'all' || c.dataset.cat === cat;
          c.hidden = !on;
          if (on) shown++;
        });
        if (empty) empty.hidden = shown > 0;
      });
    });
  }

  // Contact form (static site: no backend yet)
  var form = document.querySelector('form[data-static]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('.form-note');
      if (msg) msg.hidden = false;
    });
  }
})();

// ── Motion ─────────────────────────────────
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('motion')) return;
  var finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Hero photos: stagger index + pointer parallax (desktop only)
  var heroPics = document.querySelectorAll('.hero .pic');
  heroPics.forEach(function (p, i) { p.style.setProperty('--i', i); p.dataset.depth = (0.4 + (i % 3) * 0.35).toFixed(2); });
  var hero = document.querySelector('.hero');
  if (hero && finePointer && innerWidth > 760) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      heroPics.forEach(function (p) {
        var d = +p.dataset.depth;
        p.style.setProperty('--px', (-x * 36 * d).toFixed(1) + 'px');
        p.style.setProperty('--py', (-y * 28 * d).toFixed(1) + 'px');
      });
    });
    hero.addEventListener('pointerleave', function () {
      heroPics.forEach(function (p) { p.style.setProperty('--px', '0px'); p.style.setProperty('--py', '0px'); });
    });
  }

  // Scroll reveal: tag common blocks, stagger siblings
  var groups = [
    '.split > *', '.list-head', '.proj-row', '.step', '.p-hero > *', '.meta > div', '.kv .pic',
    '.mood .pic', '.table-box', '.schedule li', '.two > *', '.team > div', '.deliver > div',
    '.next', '.arc-head', '.card', '.contact > *', '.info > div', '.field', '.btn',
    'section > .label', '.section .wrap > .label', '.section .wrap > h2'
  ];
  var seen = new Set();
  groups.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      if (seen.has(el) || el.closest('.hero')) return;
      seen.add(el);
      var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.matches(sel); });
      el.style.setProperty('--d', Math.min(sibs.indexOf(el), 6));
      el.classList.add('reveal');
    });
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    seen.forEach(function (el) { io.observe(el); });
  } else {
    seen.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Key visual: zoom settles as it passes through the viewport
  var kv = document.querySelector('.kv .pic');
  if (kv) {
    var ticking = false;
    var update = function () {
      var r = kv.getBoundingClientRect();
      var t = Math.min(Math.max(1 - (r.top + r.height * 0.5) / (innerHeight + r.height * 0.5), 0), 1);
      kv.style.setProperty('--kv', (1.12 - t * 0.12).toFixed(4));
      ticking = false;
    };
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  // Archive: replay entrance on filter change
  document.querySelectorAll('.filters button').forEach(function (f) {
    f.addEventListener('click', function () {
      var i = 0;
      document.querySelectorAll('.card').forEach(function (c) {
        c.classList.remove('is-pop');
        if (!c.hidden) { c.style.setProperty('--d', i++); void c.offsetWidth; c.classList.add('is-pop'); }
      });
    });
  });

  // Page transition: fade out before following internal links
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
    var href = a.getAttribute('href');
    if (!/\.html(#.*)?$/.test(href) || /^[a-z]+:/i.test(href)) return;
    e.preventDefault();
    document.body.classList.add('is-leaving');
    setTimeout(function () { location.href = href; }, 320);
  });
  // Coming back via the back button: make sure the page is visible again
  addEventListener('pageshow', function (e) { if (e.persisted) document.body.classList.remove('is-leaving'); });
})();
