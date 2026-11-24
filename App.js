/* Dalmktg: no dependencies. Content lives in index.html so search engines can read it. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TITLES = {
    en: 'Dalal | Videographer, Video Editor & Brand Designer in Kuwait',
    ar: 'دلال | مصورة فيديو ومونتيرة ومصممة هوية بصرية في الكويت'
  };
  var DESCS = {
    en: 'Videographer, video editor and brand designer in Kuwait. Videography, editing, motion design, branding and web design for businesses that want to stand out.',
    ar: 'مصورة فيديو ومونتيرة ومصممة هوية بصرية في الكويت. تصوير فيديو ومونتاج وموشن جرافيك وهوية بصرية وتصميم مواقع للشركات التي تريد أن تتميز.'
  };
  var lang = root.lang === 'ar' ? 'ar' : 'en';
  var header = d.querySelector('.hdr'), menu = d.getElementById('menu'), langBtn = d.getElementById('lang');

  /* Language: static HTML holds both; CSS shows one. Links get a message in the chosen language. */
  function apply(l, save) {
    lang = l;
    root.lang = l;
    root.dir = l === 'ar' ? 'rtl' : 'ltr';
    if (save) { try { localStorage.setItem('selectedLanguage', l); } catch (e) {} }
    d.title = TITLES[l];
    var m = d.querySelector('meta[name="description"]');
    if (m) m.content = DESCS[l];
    langBtn.textContent = l === 'ar' ? 'EN' : 'العربية';
    langBtn.lang = l === 'ar' ? 'en' : 'ar';
    langBtn.setAttribute('aria-label', l === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    d.querySelectorAll('[data-wa]').forEach(function (a) {
      var t = a.dataset.wa.split('|')[l === 'ar' ? 1 : 0];
      a.href = 'https://wa.me/96551318282?text=' + encodeURIComponent(t);
    });
    update();
  }
  langBtn.addEventListener('click', function () { apply(lang === 'ar' ? 'en' : 'ar', true); });

  /* Mobile menu */
  function setMenu(open) { header.classList.toggle('open', open); menu.setAttribute('aria-expanded', open); }
  menu.addEventListener('click', function () { setMenu(!header.classList.contains('open')); });
  d.getElementById('nav').addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); } });

  /* Word-by-word reveal on the About text (text stays in the HTML; this only dims and lights words) */
  var rev = d.querySelector('.reveal');
  if (rev && !calm) {
    rev.querySelectorAll('.en,.ar').forEach(function (el) {
      el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    });
    rev.classList.add('on');
  }
  function reveal() {
    if (!rev || calm) return;
    var r = rev.getBoundingClientRect(), vh = innerHeight;
    var p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.3 + r.height)));
    var words = rev.querySelectorAll('.' + lang + ' .w'), n = Math.round(p * words.length);
    words.forEach(function (w, i) { w.classList.toggle('lit', i < n); });
  }

  var busy = false;
  function update() { header.classList.toggle('scrolled', scrollY > 8); reveal(); }
  addEventListener('scroll', function () {
    if (busy) return; busy = true;
    requestAnimationFrame(function () { busy = false; update(); });
  }, { passive: true });
  addEventListener('resize', update);

  /* Portrait follows the pointer a little (mouse only) */
  var photo = d.getElementById('photo');
  if (photo && !calm && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    addEventListener('pointermove', function (e) {
      var r = photo.getBoundingClientRect(),
        dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2),
        near = Math.hypot(dx, dy) < 260;
      photo.style.transform = near ? 'translate(' + dx * 0.12 + 'px,' + dy * 0.12 + 'px)' : '';
    });
  }

  /* Floating hearts: a few, decorative, in the brand colours */
  var box = d.getElementById('hearts');
  if (box && !calm) {
    var cols = ['#B600A8', '#7621B0', '#BE4C00'], path = '<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
    for (var i = 0; i < 9; i++) {
      var h = d.createElement('span');
      h.className = 'heart';
      h.style.cssText = '--x:' + (Math.random() * 94 + 2) + '%;--s:' + (14 + Math.random() * 18) + 'px;--d:' + (9 + Math.random() * 7) + 's;--w:' + (-Math.random() * 14) + 's;color:' + cols[i % 3];
      h.innerHTML = path;
      box.appendChild(h);
    }
  }

  var y = d.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  apply(lang, false);
})();
