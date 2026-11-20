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
