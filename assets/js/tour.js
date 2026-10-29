/* Visite guidée par profil : le visiteur choisit Data/IA, Cybersécurité ou Web,
   puis la visite traverse les pages et montre les preuves qui comptent pour ce profil.
   Clavier : flèches gauche/droite, Échap pour quitter. */
(function () {
  var ME = document.currentScript && document.currentScript.src;
  var ROOT = ME ? ME.replace(/assets\/js\/tour\.js.*$/, '') : '';
  var DATA = 'projets/Classification-NLP-AG-News.html';
  var PATHS = {
    data: { name: 'Data et IA', desc: 'NLP, deep learning, machine learning et BI, avec les résultats chiffrés.', stops: [
      { page: DATA, sel: '.tldr .res', kpi: '92,3 %', title: 'Classer l’actualité avec un Transformer', text: 'DistilBERT fine-tuné sur 4 rubriques de presse, comparé à une baseline TF-IDF (90,6 %). Problème, méthode et résultat sont résumés ici.' },
      { page: 'projets/Prediction-churn-telecom.html', sel: '.tldr .res', kpi: 'AUC 0,89', title: 'Prédire le départ des clients', text: '2,3 millions d’abonnés télécom, classes déséquilibrées : KNN et régression logistique régularisée comparés.' },
      { page: 'projets/Analyse-de-sentiments-IMDb.html', sel: '.tldr .res', kpi: '88,5 %', title: 'Analyse de sentiments', text: '50 000 critiques de films, nettoyage NLTK et TF-IDF, trois modèles comparés.' },
      { page: 'projets/Analyse-ventes-Power-BI.html', sel: '.tldr .res', kpi: '+3,7 %', title: 'Tableau de bord Power BI', text: 'Deux ans de ventes, 13 fichiers reliés dans un modèle en étoile, mesures DAX.' },
      { page: 'video.html', sel: '#ag-news-distilbert', title: 'La démo commentée', text: 'Chaque projet a sa vidéo de 2 minutes : une figure de résultat à la fois, expliquée.' }
    ]},
    cyber: { name: 'Cybersécurité et infra', desc: 'Audit réseau, durcissement, annuaire et automatisation.', stops: [
      { page: 'projets/SCANNER-UN-RESEAU-AVEC-NMAP.html', sel: 'h1', title: 'Audit réseau avec Nmap', text: 'Découverte d’hôtes, ports et services, détection du système d’exploitation et techniques face à un pare-feu.' },
      { page: 'projets/Bonne-pratique-Sécurité-Dockers.html', sel: 'h1', title: 'Sécuriser des conteneurs Docker', text: 'Mécanismes d’isolation, commandes pratiques et recommandations de durcissement.' },
      { page: 'projets/Windows-Servers-Adds.html', sel: 'h1', title: 'Active Directory', text: 'Contrôleur de domaine installé en interface graphique puis en PowerShell, nouvelle forêt et gestion des objets.' },
      { page: 'projets/Pipeline-Ci-GithubActions.html', sel: 'h1', title: 'Intégration continue', text: 'Pipeline GitHub Actions : tests automatiques à chaque push, rôles répartis dans l’équipe.' }
    ]},
    web: { name: 'Web et applications', desc: 'Applications complètes, du front-end à la base de données.', stops: [
      { page: 'video.html', sel: '#cyclecare', title: 'CycleCare', text: 'Application de suivi de cycle : web et mobile, données synchronisées avec Supabase.' },
      { page: 'video.html', sel: '#taskhub-pro', title: 'TaskHub Pro', text: 'Gestion de tâches en équipe : Flask, React, MySQL, Kanban, authentification JWT et rôles.' },
      { page: 'video.html', sel: '#neontube', title: 'NeonTube', text: 'Application de bureau, de l’interface jusqu’au packaging.' },
      { page: 'video.html', sel: '#gestion-bibliotheque-demo', title: 'Gestion de bibliothèque', text: 'Application PHP et MySQL conçue avec la méthode MERISE : emprunts, adhérents, tableau de bord.' },
      { page: 'github.html', sel: '#contenu', title: 'Tout le code', text: 'Chaque application avec son dépôt GitHub et sa démo. La recherche filtre par technologie.' }
    ]}
  };
  var KEY = 'tour-vu', SKEY = 'tour-etat';
  var st = null, box, tip, lastFocus, tx = null;

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
    '.tour-pick{position:fixed;inset:0;z-index:62;display:grid;place-items:center;background:rgba(4,8,12,.78);padding:16px;animation:tourIn .3s ease both}' +
    '.tour-pick .in{width:min(720px,100%);background:var(--bg2,#0c1219);border:1px solid var(--line2,#2c4a55);border-radius:14px;padding:24px;box-shadow:0 30px 80px rgba(0,0,0,.6);font:15px/1.5 var(--f-b,system-ui)}' +
    '.tour-pick h2{font:700 24px var(--f-d,system-ui);color:var(--fg-strong,#fff);margin:4px 0 4px}.tour-pick .sub{color:var(--mute,#8aa0b3);margin:0 0 18px}' +
    '.tour-pick .opts{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}@media(max-width:640px){.tour-pick .opts{grid-template-columns:1fr}}' +
    '.tour-pick .opt{text-align:left;cursor:pointer;background:transparent;border:1px solid var(--line2,#2c4a55);border-radius:10px;padding:16px;color:var(--fg,#d7e3ee);font:14px/1.45 var(--f-b,system-ui);transition:border-color .2s,transform .2s}' +
    '.tour-pick .opt:hover,.tour-pick .opt:focus-visible{border-color:var(--acc,#5fd0c4);transform:translateY(-2px)}' +
    '.tour-pick .opt b{display:block;font:700 17px var(--f-d,system-ui);color:var(--fg-strong,#fff);margin-bottom:6px}.tour-pick .opt small{display:block;margin-top:10px;font:500 12px var(--f-m,monospace);color:var(--acc,#5fd0c4)}' +
    '.tour-pick .x{margin-top:16px;background:none;border:0;color:var(--mute,#8aa0b3);cursor:pointer;font:600 14px var(--f-b,system-ui)}' +
    '.tour-tip .kpi{display:block;font:800 30px var(--f-d,system-ui);color:var(--acc,#5fd0c4);margin:2px 0 4px}' +
    '@media (prefers-reduced-motion:reduce){.tour-spot,.tour-tip{transition:none}}';


  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }
  function save() { try { if (st) sessionStorage.setItem(SKEY, JSON.stringify(st)); else sessionStorage.removeItem(SKEY); } catch (e) {} }
  function here(page) {
    var p = decodeURIComponent(location.pathname);
    if (page === 'index.html' && /\/$/.test(p)) return true;
    return p.slice(-page.length - 1) === '/' + page || p === page;
  }
  function stops() { return PATHS[st.path].stops; }

  function go(k) {
    var all = stops(); if (k < 0) return; if (k >= all.length) return end();
    st.i = k; save();
    if (here(all[k].page)) place(); else location.href = ROOT + encodeURI(all[k].page);
  }
  function place() {
    var all = stops(), s = all[st.i], t = document.querySelector(s.sel);
    if (!t) return go(st.i + 1);
    if (!box) mount();
    t.style.scrollMarginTop = '90px';
    var tall = t.offsetHeight > innerHeight * 0.45;
    t.scrollIntoView({ block: tall ? 'start' : 'center', behavior: 'instant' });
    setTimeout(function () {
      if (!box) return;
      var r0 = t.getBoundingClientRect(), pad = 10, cap = innerHeight * (innerWidth < 700 ? 0.42 : 0.6), last = st.i === all.length - 1;
      var top0 = Math.max(r0.top, 8 + pad), r = { left: r0.left, width: r0.width, top: top0, height: Math.min(r0.bottom - top0, cap) };
      box.style.left = (r.left - pad) + 'px'; box.style.top = (r.top - pad) + 'px';
      box.style.width = (r.width + pad * 2) + 'px'; box.style.height = (r.height + pad * 2) + 'px';
      tip.innerHTML = '<div class="tour-dots">' + all.map(function (_, k) { return '<i' + (k <= st.i ? ' class="on"' : '') + '></i>'; }).join('') + '</div>' +
        '<div class="body"><div class="n">' + PATHS[st.path].name.toUpperCase() + ' · ' + (st.i + 1) + ' / ' + all.length + '</div>' +
        '<h2 id="tour-t">' + s.title + '</h2><p>' + s.text + '</p>' +
        (last ? '<div class="cta"><a href="' + ROOT + 'contact.html">Me contacter</a><a href="' + ROOT + 'assets/pdf/CV_DOWOU-Issa.pdf" download>CV en PDF</a><a href="https://www.linkedin.com/in/issa-dowou-4abbaa3a1" target="_blank" rel="noopener">LinkedIn</a></div>' : '') + '</div>' +
        '<div class="row"><button type="button" class="tour-skip" data-a="end">' + (last ? 'Fermer' : 'Rester ici') + '</button><span class="sp"></span>' +
        (st.i > 0 ? '<button type="button" data-a="prev">Précédent</button>' : '') +
        '<button type="button" class="p" data-a="next">' + (last ? 'Terminer' : 'Suivant') + '</button></div>';
      var w = tip.offsetWidth, h = tip.offsetHeight, vw = innerWidth, vh = innerHeight, rb = r.top - pad + parseFloat(box.style.height);
      var top = rb + 14;
      if (top + h > vh - 12) top = r.top - pad - 14 - h;
      top = Math.max(12, Math.min(top, vh - h - 12));
      tip.style.top = top + 'px'; tip.style.left = Math.max(12, Math.min(vw - w - 12, r.left + r.width / 2 - w / 2)) + 'px';
      tip.querySelector('button.p').focus();
    }, 120);
  }
  function mount() {
    lastFocus = document.activeElement;
    box = el('div', 'tour-spot'); tip = el('div', 'tour-tip');
    tip.setAttribute('role', 'dialog'); tip.setAttribute('aria-labelledby', 'tour-t');
    tip.addEventListener('click', function (e) { var a = e.target.getAttribute('data-a'); if (a === 'next') go(st.i + 1); else if (a === 'prev') go(st.i - 1); else if (a === 'end') end(); });
    tip.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    tip.addEventListener('touchend', function (e) { if (tx === null) return; var d = e.changedTouches[0].clientX - tx; tx = null; if (d < -50) go(st.i + 1); else if (d > 50) go(st.i - 1); });
    document.body.append(box, tip); document.body.classList.add('tour-on');
    document.addEventListener('keydown', onKey); addEventListener('resize', place);
  }
  function end() {
    st = null; save();
    if (box) box.remove(); if (tip) tip.remove(); box = tip = null; document.body.classList.remove('tour-on');
    document.removeEventListener('keydown', onKey); removeEventListener('resize', place);
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onKey(e) {
    if (e.key === 'Escape') end();
    else if (e.key === 'ArrowRight') go(st.i + 1);
    else if (e.key === 'ArrowLeft') go(st.i - 1);
  }
  function pick() {
    var hh = document.querySelector('.tour-hello'); if (hh) { hh.remove(); document.body.classList.remove('tour-hi'); }
    if (document.querySelector('.tour-pick')) return;
    var opener = document.activeElement;
    var m = el('div', 'tour-pick'); m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'tour-pt');
    m.innerHTML = '<div class="in"><div class="tour-tip" style="all:unset"><span class="n" style="font:500 12px var(--f-m,monospace);color:var(--acc,#5fd0c4);letter-spacing:.06em">VISITE GUIDÉE</span></div>' +
      '<h2 id="tour-pt">Qu’est-ce qui vous intéresse ?</h2><p class="sub">Je vous montre les projets qui comptent pour votre profil, page par page, avec leurs résultats.</p><div class="opts">' +
      Object.keys(PATHS).map(function (k) { var p = PATHS[k]; return '<button type="button" class="opt" data-p="' + k + '"><b>' + p.name + '</b>' + p.desc + '<small>' + p.stops.length + ' arrêts · 1 min</small></button>'; }).join('') +
      '</div><button type="button" class="x" data-p="x">Non merci</button></div>';
    function close() { m.remove(); document.removeEventListener('keydown', esc); if (opener && opener.focus) opener.focus(); }
    function esc(e) { if (e.key === 'Escape') { close(); try { localStorage.setItem(KEY, '1'); } catch (er) {} } }
    m.addEventListener('click', function (e) { var b = e.target.closest('[data-p]'); if (!b && e.target !== m) return;
      var k = b ? b.getAttribute('data-p') : 'x'; close();
      if (k === 'x') { try { localStorage.setItem(KEY, '1'); } catch (er) {} return; }
      st = { path: k, i: 0 }; go(0); });
    document.addEventListener('keydown', esc);
    document.body.appendChild(m); m.querySelector('.opt').focus();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var sty = el('style'); sty.textContent = css; document.head.appendChild(sty);
    window.startTour = pick;
    try { st = JSON.parse(sessionStorage.getItem(SKEY) || 'null'); } catch (e) { st = null; }
    if (st && PATHS[st.path] && stops()[st.i] && here(stops()[st.i].page)) { setTimeout(place, 300); return; }
    st = null; save();
    if (!here('index.html')) return;
    var b = el('button', 'tour-launch', '<b>▸</b> Visite guidée · 1 min');
    b.type = 'button'; b.addEventListener('click', pick);
    document.body.appendChild(b);
    var seen = true; try { seen = localStorage.getItem(KEY) === '1'; } catch (e) {}
    if (!seen) setTimeout(function () {
      if (box || document.querySelector('.tour-pick')) return;
      var h = el('div', 'tour-hello'); h.setAttribute('role', 'dialog'); h.setAttribute('aria-label', 'Visite guidée');
      h.innerHTML = '<b>Première visite ?</b><p>Choisissez votre profil, je vous montre les projets qui vous concernent en une minute.</p><div class="row"><button type="button" data-h="no">Plus tard</button><button type="button" class="p" data-h="go">Commencer</button></div>';
      document.body.appendChild(h); document.body.classList.add('tour-hi');
      h.addEventListener('click', function (e) { var a = e.target.getAttribute('data-h'); if (!a) return;
        h.remove(); document.body.classList.remove('tour-hi');
        if (a === 'go') pick(); else { try { localStorage.setItem(KEY, '1'); } catch (er) {} } });
    }, 1500);
  });
})();
