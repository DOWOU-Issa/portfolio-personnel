/* Visite guidée de l'accueil : met en lumière une zone à la fois.
   Clavier : flèches gauche/droite, Échap pour quitter. */
(function () {
  var STEPS = [
    { sel: '.home h1', title: 'Bienvenue', text: "Je suis Dowou Issa, diplômé d'une Licence IT en IA et Big Data. Cette visite d'une minute vous montre l'essentiel du site." },
    { sel: '.home .stats', title: 'En chiffres', text: 'Des projets documentés, chacun avec sa démonstration vidéo.' },
    { sel: '.home-links a[href="projets/projets.html"]', title: 'Les rapports techniques', text: 'Réseaux, virtualisation, CI/CD et analyse de données : la démarche et les résultats de chaque projet.' },
    { sel: '.home-links a[href="github.html"]', title: 'Les applications', text: 'Le code source sur GitHub et la démo en ligne de chaque application.' },
    { sel: '.home-links a[href="video.html"]', title: 'Les démonstrations', text: "De courtes vidéos commentées, de l'interface jusqu'au code." },
    { sel: '.home .btns', title: 'Le CV', text: 'Lisible en ligne ou à télécharger en PDF, avec le lien vers LinkedIn.' },
    { sel: '.site-nav a[href="contact.html"]', title: 'Me contacter', text: 'Une question ou une proposition ? Écrivez-moi, je réponds rapidement. Merci de votre visite.', cta: true }
  ];
  var KEY = 'tour-vu';
  var i = 0, box, tip, lastFocus, auto = false, timer = null, tx = null;

  var css = '.tour-tip button{white-space:nowrap}' + '' +
    '.tour-spot{position:fixed;z-index:60;border-radius:12px;box-shadow:0 0 0 9999px rgba(4,8,12,.72),0 0 0 2px var(--acc,#5fd0c4);pointer-events:none;transition:all .35s cubic-bezier(.2,.8,.2,1)}' +
    '.tour-tip{position:fixed;z-index:61;width:min(360px,calc(100vw - 32px));background:var(--bg2,#0c1219);border:1px solid var(--line2,#2c4a55);border-radius:12px;padding:18px 20px 16px;box-shadow:0 20px 50px rgba(0,0,0,.5);transition:top .35s,left .35s;font:15px/1.55 var(--f-b,system-ui)}' +
    '.tour-tip .n{font:500 12px var(--f-m,monospace);color:var(--acc,#5fd0c4);letter-spacing:.06em}' +
    '.tour-tip h2{font:700 20px var(--f-d,system-ui);color:var(--fg-strong,#fff);margin:6px 0 6px}' +
    '.tour-tip p{margin:0 0 14px;color:var(--fg,#d7e3ee)}' +
    '.tour-tip .row{display:flex;gap:8px;align-items:center}' +
    '.tour-tip .row .sp{flex:1}' +
    '.tour-tip button{font:600 14px var(--f-b,system-ui);border-radius:8px;padding:8px 14px;cursor:pointer;border:1px solid var(--line2,#2c4a55);background:transparent;color:var(--fg,#d7e3ee)}' +
    '.tour-tip button.p{background:var(--acc,#5fd0c4);border-color:var(--acc,#5fd0c4);color:var(--acc-ink,#061014)}' +
    '.tour-tip button.tour-skip{border:0;padding:8px 4px;color:var(--mute,#8aa0b3)}' +
    '.tour-dots{display:flex;gap:5px;margin-bottom:12px}.tour-dots i{width:18px;height:3px;border-radius:2px;background:var(--line2,#2c4a55)}.tour-dots i.on{background:var(--acc,#5fd0c4)}' +
    '.tour-launch{position:fixed;right:16px;bottom:58px;z-index:30;font:600 14px var(--f-b,system-ui);padding:10px 16px;border-radius:999px;border:1px solid var(--line2,#2c4a55);background:var(--bg2,#0c1219);color:var(--fg,#d7e3ee);cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.4)}' +
    '.tour-launch:hover{border-color:var(--acc,#5fd0c4);color:var(--fg-strong,#fff)}' +
    '.tour-launch b{color:var(--acc,#5fd0c4);font-weight:600}' +
    'body.tour-on .tour-launch{display:none}' +
    '.tour-spot{animation:tourPulse 2.4s ease-in-out infinite}' +
    '@keyframes tourPulse{0%,100%{box-shadow:0 0 0 9999px rgba(4,8,12,.72),0 0 0 2px var(--acc,#5fd0c4)}50%{box-shadow:0 0 0 9999px rgba(4,8,12,.72),0 0 0 6px rgba(95,208,196,.35)}}' +
    '.tour-tip .body{animation:tourIn .35s ease both}@keyframes tourIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}' +
    '.tour-dots i{position:relative;overflow:hidden}.tour-dots i.on.auto::after{content:"";position:absolute;inset:0;background:var(--fg-strong,#fff);transform-origin:left;animation:tourBar 6s linear forwards}@keyframes tourBar{from{transform:scaleX(0)}to{transform:scaleX(1)}}' +
    '.tour-tip .cta{display:flex;flex-wrap:wrap;gap:8px;margin:-4px 0 14px}.tour-tip .cta a{font:600 13px var(--f-b,system-ui);padding:7px 12px;border-radius:8px;border:1px solid var(--line2,#2c4a55);color:var(--fg-strong,#fff)}.tour-tip .cta a:hover{border-color:var(--acc,#5fd0c4)}' +
    '.tour-tip button.auto{padding:8px 10px;font-size:13px}.tour-tip button.auto[aria-pressed=true]{border-color:var(--acc,#5fd0c4);color:var(--acc,#5fd0c4)}' +
    '.tour-hello{position:fixed;right:16px;bottom:58px;z-index:31;width:min(320px,calc(100vw - 32px));background:var(--bg2,#0c1219);border:1px solid var(--line2,#2c4a55);border-radius:12px;padding:16px 18px;box-shadow:0 20px 50px rgba(0,0,0,.5);font:15px/1.5 var(--f-b,system-ui);animation:tourIn .5s ease both}' +
    '.tour-hello b{display:block;font:700 17px var(--f-d,system-ui);color:var(--fg-strong,#fff);margin-bottom:4px}.tour-hello p{margin:0 0 12px;color:var(--fg,#d7e3ee)}.tour-hello .row{display:flex;gap:8px;justify-content:flex-end}' +
    '.tour-hello button{font:600 14px var(--f-b,system-ui);border-radius:8px;padding:8px 14px;cursor:pointer;border:1px solid var(--line2,#2c4a55);background:transparent;color:var(--fg,#d7e3ee)}.tour-hello button.p{background:var(--acc,#5fd0c4);border-color:var(--acc,#5fd0c4);color:var(--acc-ink,#061014)}' +
    'body.tour-hi .tour-launch{display:none}' +
    '@media (prefers-reduced-motion:reduce){.tour-spot,.tour-tip{transition:none}}';

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }

  function place() {
    var s = STEPS[i], t = document.querySelector(s.sel);
    if (!t) { return next(); }
    t.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    setTimeout(function () {
      if (!box) return;
      var r = t.getBoundingClientRect(), pad = 10;
      box.style.left = (r.left - pad) + 'px'; box.style.top = (r.top - pad) + 'px';
      box.style.width = (r.width + pad * 2) + 'px'; box.style.height = (r.height + pad * 2) + 'px';
      tip.innerHTML = '<div class="tour-dots">' + STEPS.map(function (_, k) { return '<i' + (k === i ? ' class="on' + (auto ? ' auto' : '') + '"' : '') + '></i>'; }).join('') + '</div>' +
        '<div class="body"><div class="n">ÉTAPE ' + (i + 1) + ' / ' + STEPS.length + '</div><h2 id="tour-t">' + s.title + '</h2><p>' + s.text + '</p>' +
        (s.cta ? '<div class="cta"><a href="contact.html">Formulaire de contact</a><a href="assets/pdf/CV_DOWOU-Issa.pdf" download>CV en PDF</a><a href="https://www.linkedin.com/in/issa-dowou-4abbaa3a1" target="_blank" rel="noopener">LinkedIn</a></div>' : '') + '</div>' +
        '<div class="row"><button type="button" class="tour-skip" data-a="end">Passer</button>' +
        '<button type="button" class="auto" data-a="auto" aria-pressed="' + auto + '" title="Lecture automatique">' + (auto ? '❚❚ Pause' : '▶ Auto') + '</button><span class="sp"></span>' +
        (i > 0 ? '<button type="button" data-a="prev">Précédent</button>' : '') +
        '<button type="button" class="p" data-a="next">' + (i === STEPS.length - 1 ? 'Terminer' : 'Suivant') + '</button></div>';
      var w = tip.offsetWidth, h = tip.offsetHeight, vw = innerWidth, vh = innerHeight;
      var top = r.bottom + pad + 14;
      if (top + h > vh - 12) top = r.top - pad - 14 - h;
      if (top < 12) top = Math.min(vh - h - 12, r.bottom + pad + 14);
      var left = Math.max(12, Math.min(vw - w - 12, r.left + r.width / 2 - w / 2));
      tip.style.top = top + 'px'; tip.style.left = left + 'px';
      tip.querySelector('button.p').focus();
      clearTimeout(timer); if (auto && i < STEPS.length - 1) timer = setTimeout(next, 6000);
    }, 380);
  }
  function next() { if (i < STEPS.length - 1) { i++; place(); } else end(); }
  function prev() { if (i > 0) { i--; place(); } }
  function end() {
    clearTimeout(timer); auto = false;
    if (box) box.remove(); if (tip) tip.remove(); box = tip = null; document.body.classList.remove('tour-on');
    document.removeEventListener('keydown', onKey); removeEventListener('resize', place);
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    if (lastFocus) lastFocus.focus();
  }
  function onKey(e) {
    if (e.key === 'Escape') end();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  }
  function start() {
    if (box) return;
    var hh = document.querySelector('.tour-hello'); if (hh) { hh.remove(); document.body.classList.remove('tour-hi'); }
    lastFocus = document.activeElement; i = 0;
    box = el('div', 'tour-spot'); tip = el('div', 'tour-tip');
    tip.setAttribute('role', 'dialog'); tip.setAttribute('aria-modal', 'true'); tip.setAttribute('aria-labelledby', 'tour-t');
    tip.addEventListener('click', function (e) { var a = e.target.getAttribute('data-a'); if (a === 'next') next(); else if (a === 'prev') prev(); else if (a === 'end') end(); else if (a === 'auto') { auto = !auto; place(); } });
    tip.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    tip.addEventListener('touchend', function (e) { if (tx === null) return; var d = e.changedTouches[0].clientX - tx; tx = null; if (d < -50) next(); else if (d > 50) prev(); });
    document.body.append(box, tip); document.body.classList.add('tour-on');
    document.addEventListener('keydown', onKey); addEventListener('resize', place);
    place();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var st = el('style'); st.textContent = css; document.head.appendChild(st);
    var b = el('button', 'tour-launch', '<b>▸</b> Visite guidée · 1 min');
    b.type = 'button'; b.addEventListener('click', start);
    document.body.appendChild(b);
    window.startTour = start;
    var seen = true; try { seen = localStorage.getItem(KEY) === '1'; } catch (e) {}
    if (!seen) setTimeout(function () {
      if (box) return;
      var h = el('div', 'tour-hello'); h.setAttribute('role', 'dialog'); h.setAttribute('aria-label', 'Visite guidée');
      h.innerHTML = '<b>Première visite ?</b><p>Je vous fais faire le tour du site en une minute.</p><div class="row"><button type="button" data-h="no">Plus tard</button><button type="button" class="p" data-h="go">Commencer</button></div>';
      document.body.appendChild(h); document.body.classList.add('tour-hi');
      h.addEventListener('click', function (e) { var a = e.target.getAttribute('data-h'); if (!a) return;
        h.remove(); document.body.classList.remove('tour-hi');
        if (a === 'go') start(); else { try { localStorage.setItem(KEY, '1'); } catch (er) {} } });
    }, 1500);
  });
})();
