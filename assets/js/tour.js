/* Visite guidée de l'accueil : le visiteur choisit son profil, puis découvre
   les projets clés dans un panneau, sans quitter la page.
   Clavier : flèches gauche/droite, Échap pour fermer. Balayage sur mobile. */
(function () {
  var V = 'assets/images/videos/', P = 'assets/images/projets/';
  var PATHS = {
    data: { name: 'Data et IA', desc: 'NLP, deep learning, machine learning et BI.', items: [
      { img: V + 'ag-news-distilbert.jpg', kpi: '92,3 %', kl: 'd’accuracy', title: 'Classer l’actualité avec un Transformer', text: 'DistilBERT fine-tuné sur 4 rubriques de presse, comparé à une baseline TF-IDF (90,6 %).', page: 'projets/Classification-NLP-AG-News.html', video: 'video.html#ag-news-distilbert' },
      { img: P + 'churn/logistic_regression_roc.png', kpi: 'AUC 0,89', kl: 'régression logistique', title: 'Prédire le départ des clients', text: '2,3 millions d’abonnés télécom, classes déséquilibrées : KNN et régression logistique comparés.', page: 'projets/Prediction-churn-telecom.html', video: 'video.html#churn-prediction-telecom' },
      { img: P + 'sentiment/final_analysis.png', kpi: '88,5 %', kl: 'd’accuracy', title: 'Analyse de sentiments', text: '50 000 critiques de films, prétraitement NLTK, TF-IDF et trois modèles comparés.', page: 'projets/Analyse-de-sentiments-IMDb.html' },
      { img: P + 'powerbi/ventes.png', kpi: '+3,7 %', kl: 'de chiffre d’affaires', title: 'Tableau de bord Power BI', text: 'Deux ans de ventes, 13 fichiers reliés dans un modèle en étoile, mesures DAX.', page: 'projets/Analyse-ventes-Power-BI.html' }
    ]},
    cyber: { name: 'Cybersécurité et infra', desc: 'Audit réseau, durcissement, annuaire, CI.', items: [
      { term: '$ nmap -sV -O 192.168.1.0/24\n<i>PORT   STATE SERVICE VERSION</i>\n22/tcp open  ssh     OpenSSH\n80/tcp open  http    nginx', title: 'Audit réseau avec Nmap', text: 'Découverte d’hôtes, ports et services, détection du système d’exploitation et techniques face à un pare-feu.', page: 'projets/SCANNER-UN-RESEAU-AVEC-NMAP.html' },
      { term: '$ docker run --read-only \\\n    --cap-drop ALL \\\n    --security-opt no-new-privileges \\\n    --user 1000 app', title: 'Sécuriser des conteneurs Docker', text: 'Mécanismes d’isolation, commandes pratiques et recommandations de durcissement.', page: 'projets/Bonne-pratique-Sécurité-Dockers.html' },
      { term: 'PS> Install-ADDSForest `\n    -DomainName "lab.local"\nPS> New-ADUser -Name "a.dupont"', title: 'Active Directory', text: 'Contrôleur de domaine en interface graphique puis en PowerShell, nouvelle forêt et gestion des objets.', page: 'projets/Windows-Servers-Adds.html' },
      { term: 'on: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps: [checkout, tests]', title: 'Intégration continue', text: 'Pipeline GitHub Actions : tests automatiques à chaque push, rôles répartis dans l’équipe.', page: 'projets/Pipeline-Ci-GithubActions.html' }
    ]},
    web: { name: 'Web et applications', desc: 'Applications complètes, du front à la base.', items: [
      { img: V + 'cyclecare.jpg', title: 'CycleCare', text: 'Application de suivi de cycle, web et mobile, avec synchronisation Supabase.', video: 'video.html#cyclecare' },
      { img: V + 'taskhub-pro.jpg', title: 'TaskHub Pro', text: 'Gestion de tâches en équipe : Flask, React, MySQL, Kanban, authentification JWT et rôles.', video: 'video.html#taskhub-pro' },
      { img: V + 'neontube.jpg', title: 'NeonTube', text: 'Application de bureau, de l’interface jusqu’au packaging.', video: 'video.html#neontube' },
      { img: V + 'gestion-bibliotheque.jpg', title: 'Gestion de bibliothèque', text: 'Application PHP et MySQL conçue avec la méthode MERISE : emprunts, adhérents, tableau de bord.', page: 'projets/Gestion-Bibliotheque.html', video: 'video.html#gestion-bibliotheque-demo' }
    ]}
  };
  var KEY = 'tour-vu';
  var ov, path = null, i = 0, opener = null, tx = null, busy = false;

  var css =
    '.tv{position:fixed;inset:0;z-index:70;display:grid;place-items:center;padding:16px;background:rgba(4,8,12,.8);backdrop-filter:blur(4px);opacity:0;transition:opacity .3s}' +
    '.tv.show{opacity:1}' +
    '.tv .pn{position:relative;width:min(860px,100%);max-height:calc(100vh - 32px);overflow:auto;background:var(--bg2,#0c1219);border:1px solid var(--line2,#2c4a55);border-radius:16px;box-shadow:0 30px 90px rgba(0,0,0,.6);font:15px/1.55 var(--f-b,system-ui);color:var(--fg,#d7e3ee);transform:translateY(14px) scale(.98);transition:transform .35s cubic-bezier(.2,.8,.2,1)}' +
    '.tv.show .pn{transform:none}' +
    '.tv .x{position:absolute;top:10px;right:12px;z-index:2;width:34px;height:34px;border-radius:50%;border:1px solid var(--line2,#2c4a55);background:var(--bg2,#0c1219);color:var(--fg,#d7e3ee);font-size:18px;cursor:pointer}' +
    '.tv .x:hover{border-color:var(--acc,#5fd0c4)}' +
    '.tv .st{padding:28px 28px 24px;transition:opacity .22s,transform .22s}' +
    '.tv .st.out{opacity:0;transform:translateX(var(--dx,-16px))}' +
    '.tv .lab{font:500 12px var(--f-m,monospace);color:var(--acc,#5fd0c4);letter-spacing:.08em;text-transform:uppercase}' +
    '.tv h2{font:700 24px/1.2 var(--f-d,system-ui);color:var(--fg-strong,#fff);margin:6px 0 6px}' +
    '.tv .sub{color:var(--mute,#8aa0b3);margin:0 0 20px}' +
    '.tv .opts{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}' +
    '.tv .opt{text-align:left;cursor:pointer;background:transparent;border:1px solid var(--line2,#2c4a55);border-radius:12px;padding:18px;color:var(--fg,#d7e3ee);font:14px/1.45 var(--f-b,system-ui);transition:border-color .2s,transform .2s,background .2s}' +
    '.tv .opt:hover,.tv .opt:focus-visible{border-color:var(--acc,#5fd0c4);background:rgba(95,208,196,.06);transform:translateY(-2px);outline:none}' +
    '.tv .opt b{display:block;font:700 17px var(--f-d,system-ui);color:var(--fg-strong,#fff);margin-bottom:6px}' +
    '.tv .opt small{display:block;margin-top:12px;font:500 12px var(--f-m,monospace);color:var(--acc,#5fd0c4)}' +
    '.tv .card{display:grid;grid-template-columns:1.15fr 1fr;gap:26px;align-items:center}' +
    '.tv .med{aspect-ratio:16/10;border-radius:10px;overflow:hidden;background:#fff;border:1px solid var(--line2,#2c4a55)}' +
    '.tv .med img{width:100%;height:100%;object-fit:cover;display:block}' +
    '.tv .med.fig img{object-fit:contain;padding:8px;box-sizing:border-box}' +
    '.tv .med pre{margin:0;height:100%;box-sizing:border-box;background:#070b10;color:#c4d2e0;font:400 14px/1.7 var(--f-m,monospace);padding:20px;white-space:pre-wrap;overflow:hidden}' +
    '.tv .med pre i{font-style:normal;color:var(--acc,#5fd0c4)}' +
    '.tv .kpi{font:800 38px/1 var(--f-d,system-ui);color:var(--acc,#5fd0c4);margin:10px 0 2px}' +
    '.tv .kl{font:500 12px var(--f-m,monospace);color:var(--mute,#8aa0b3)}' +
    '.tv .txt h2{margin-top:12px}' +
    '.tv .lnk{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}' +
    '.tv .lnk a{font:600 13px var(--f-b,system-ui);padding:8px 12px;border-radius:8px;border:1px solid var(--line2,#2c4a55);color:var(--fg-strong,#fff);text-decoration:none}' +
    '.tv .lnk a:hover{border-color:var(--acc,#5fd0c4)}' +
    '.tv .lnk a.p{background:var(--acc,#5fd0c4);border-color:var(--acc,#5fd0c4);color:var(--acc-ink,#061014)}' +
    '.tv .tvnav{display:flex;align-items:center;gap:10px;padding:14px 28px 20px;border-top:1px solid var(--line,#1c2a36);position:sticky;bottom:0;background:var(--bg2,#0c1219);height:auto;width:auto}' +
    '.tv .dots{display:flex;gap:6px;flex:1}' +
    '.tv .dots i{width:22px;height:4px;border-radius:2px;background:var(--line2,#2c4a55);transition:background .3s}' +
    '.tv .dots i.on{background:var(--acc,#5fd0c4)}' +
    '.tv .tvnav button{font:600 14px var(--f-b,system-ui);border-radius:8px;padding:9px 16px;cursor:pointer;border:1px solid var(--line2,#2c4a55);background:transparent;color:var(--fg,#d7e3ee);white-space:nowrap}' +
    '.tv .tvnav button.p{background:var(--acc,#5fd0c4);border-color:var(--acc,#5fd0c4);color:var(--acc-ink,#061014)}' +
    '.tv .tvnav button.ghost{border:0;color:var(--mute,#8aa0b3);padding:9px 4px}' +
    '.tv .end{text-align:center;padding:12px 0 4px}.tv .end .lnk{justify-content:center}' +
    '@media (max-width:700px){.tv .opts,.tv .card{grid-template-columns:1fr}.tv .st{padding:22px 18px 18px}.tv .tvnav{padding:12px 18px 16px;flex-wrap:wrap}.tv .dots{flex-basis:100%}.tv h2{font-size:21px}.tv .kpi{font-size:32px}.tv .card{gap:16px}}' +
    '.tour-launch{position:fixed;right:16px;bottom:58px;z-index:30;font:600 14px var(--f-b,system-ui);padding:10px 16px;border-radius:999px;border:1px solid var(--line2,#2c4a55);background:var(--bg2,#0c1219);color:var(--fg,#d7e3ee);cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.4)}' +
    '.tour-launch:hover{border-color:var(--acc,#5fd0c4);color:var(--fg-strong,#fff)}.tour-launch b{color:var(--acc,#5fd0c4)}' +
    '.tour-hello{position:fixed;right:16px;bottom:58px;z-index:31;width:min(320px,calc(100vw - 32px));background:var(--bg2,#0c1219);border:1px solid var(--line2,#2c4a55);border-radius:12px;padding:16px 18px;box-shadow:0 20px 50px rgba(0,0,0,.5);font:15px/1.5 var(--f-b,system-ui);animation:tvIn .5s ease both}' +
    '.tour-hello b{display:block;font:700 17px var(--f-d,system-ui);color:var(--fg-strong,#fff);margin-bottom:4px}.tour-hello p{margin:0 0 12px;color:var(--fg,#d7e3ee)}.tour-hello .row{display:flex;gap:8px;justify-content:flex-end}' +
    '.tour-hello button{font:600 14px var(--f-b,system-ui);border-radius:8px;padding:8px 14px;cursor:pointer;border:1px solid var(--line2,#2c4a55);background:transparent;color:var(--fg,#d7e3ee)}.tour-hello button.p{background:var(--acc,#5fd0c4);border-color:var(--acc,#5fd0c4);color:var(--acc-ink,#061014)}' +
    'body.tour-hi .tour-launch,body.tour-on .tour-launch{display:none}body.tour-on{overflow:hidden}' +
    '@keyframes tvIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}' +
    '@media (prefers-reduced-motion:reduce){.tv,.tv .pn,.tv .st{transition:none}.tour-hello{animation:none}}';

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }
  function seen() { try { localStorage.setItem(KEY, '1'); } catch (e) {} }

  function pickHtml() {
    return '<div class="lab">Visite guidée</div><h2 id="tv-t">Qu’est-ce qui vous intéresse ?</h2>' +
      '<p class="sub">Choisissez un profil : je vous montre les projets qui comptent, avec leurs résultats.</p><div class="opts">' +
      Object.keys(PATHS).map(function (k) { var p = PATHS[k];
        return '<button type="button" class="opt" data-p="' + k + '"><b>' + p.name + '</b>' + p.desc + '<small>' + p.items.length + ' projets · 1 min</small></button>'; }).join('') + '</div>';
  }
  function itemHtml(it, n, tot) {
    var med = it.term ? '<div class="med"><pre>' + it.term + '</pre></div>'
      : '<div class="med' + (it.img.indexOf('/projets/') > 0 ? ' fig' : '') + '"><img src="' + it.img + '" alt=""></div>';
    return '<div class="card">' + med + '<div class="txt"><div class="lab">' + PATHS[path].name + ' · ' + n + ' / ' + tot + '</div>' +
      (it.kpi ? '<div class="kpi">' + it.kpi + '</div><div class="kl">' + it.kl + '</div>' : '') +
      '<h2 id="tv-t">' + it.title + '</h2><p style="margin:0">' + it.text + '</p><div class="lnk">' +
      (it.page ? '<a class="p" href="' + encodeURI(it.page) + '">Voir le projet</a>' : '') +
      (it.video ? '<a' + (it.page ? '' : ' class="p"') + ' href="' + it.video + '">Voir la vidéo</a>' : '') + '</div></div></div>';
  }
  function endHtml() {
    return '<div class="end"><div class="lab">Merci de votre visite</div><h2 id="tv-t">On en parle ?</h2>' +
      '<p class="sub">Une question sur un projet ou une proposition : je réponds rapidement.</p><div class="lnk">' +
      '<a class="p" href="contact.html">Me contacter</a><a href="assets/pdf/CV_DOWOU-Issa.pdf" download>CV en PDF</a>' +
      '<a href="https://www.linkedin.com/in/issa-dowou-4abbaa3a1" target="_blank" rel="noopener">LinkedIn</a></div></div>';
  }

  function render(dir) {
    var st = ov.querySelector('.st'), bar = ov.querySelector('.tvnav');
    var fill = function () {
      if (!ov) return;
      var html, items = path ? PATHS[path].items : null, tot = items ? items.length + 1 : 0;
      if (!path) html = pickHtml();
      else if (i < items.length) html = itemHtml(items[i], i + 1, items.length);
      else html = endHtml();
      st.innerHTML = html;
      if (!path) { bar.style.display = 'none'; }
      else {
        bar.style.display = '';
        bar.innerHTML = '<div class="dots">' + Array.apply(null, Array(tot)).map(function (_, k) { return '<i' + (k <= i ? ' class="on"' : '') + '></i>'; }).join('') + '</div>' +
          '<button type="button" class="ghost" data-a="back">Changer de profil</button>' +
          (i > 0 ? '<button type="button" data-a="prev">Précédent</button>' : '') +
          '<button type="button" class="p" data-a="next">' + (i === tot - 1 ? 'Fermer' : 'Suivant') + '</button>';
      }
      st.style.setProperty('--dx', (dir < 0 ? -16 : 16) + 'px');
      requestAnimationFrame(function () { st.classList.remove('out'); });
      var f = ov.querySelector(path ? '.tvnav button.p' : '.opt'); if (f) f.focus({ preventScroll: true });
      busy = false;
    };
    if (!dir) return fill();
    busy = true;
    st.style.setProperty('--dx', (dir > 0 ? -16 : 16) + 'px');
    st.classList.add('out');
    setTimeout(fill, 200);
  }
  function go(d) {
    if (busy || !path) return;
    var tot = PATHS[path].items.length + 1, k = i + d;
    if (k < 0) return;
    if (k >= tot) return close();
    i = k; render(d);
  }
  function open() {
    var h = document.querySelector('.tour-hello'); if (h) { h.remove(); document.body.classList.remove('tour-hi'); }
    if (ov) return;
    opener = document.activeElement; path = null; i = 0;
    ov = el('div', 'tv'); ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-labelledby', 'tv-t');
    ov.innerHTML = '<div class="pn"><button type="button" class="x" data-a="close" aria-label="Fermer">×</button><div class="st"></div><div class="tvnav"></div></div>';
    ov.addEventListener('click', function (e) {
      if (e.target === ov) return close();
      var o = e.target.closest('.opt'); if (o) { path = o.getAttribute('data-p'); i = 0; return render(1); }
      var b = e.target.closest('[data-a]'); if (!b) return;
      var a = b.getAttribute('data-a');
      if (a === 'close') close(); else if (a === 'next') go(1); else if (a === 'prev') go(-1);
      else if (a === 'back') { path = null; i = 0; render(-1); }
    });
    ov.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    ov.addEventListener('touchend', function (e) { if (tx === null) return; var d = e.changedTouches[0].clientX - tx; tx = null; if (d < -50) go(1); else if (d > 50) go(-1); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(ov); document.body.classList.add('tour-on');
    render(0);
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (ov) ov.classList.add('show'); }); });
  }
  function close() {
    if (!ov) return;
    var o = ov; ov = null; seen();
    o.classList.remove('show'); document.removeEventListener('keydown', onKey);
    setTimeout(function () { o.remove(); document.body.classList.remove('tour-on'); }, 300);
    if (opener && opener.focus) opener.focus();
  }
  function onKey(e) {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'Tab' && ov) {
      var f = ov.querySelectorAll('button,a[href]'), a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!/(\/|index\.html)$/.test(location.pathname)) return;
    var s = el('style'); s.textContent = css; document.head.appendChild(s);
    window.startTour = open;
    var b = el('button', 'tour-launch', '<b>▸</b> Visite guidée · 1 min');
    b.type = 'button'; b.addEventListener('click', open);
    document.body.appendChild(b);
    var vu = true; try { vu = localStorage.getItem(KEY) === '1'; } catch (e) {}
    if (!vu) setTimeout(function () {
      if (ov) return;
      var h = el('div', 'tour-hello'); h.setAttribute('role', 'dialog'); h.setAttribute('aria-label', 'Visite guidée');
      h.innerHTML = '<b>Première visite ?</b><p>Choisissez votre profil, je vous montre les projets qui vous concernent en une minute.</p><div class="row"><button type="button" data-h="no">Plus tard</button><button type="button" class="p" data-h="go">Commencer</button></div>';
      document.body.appendChild(h); document.body.classList.add('tour-hi');
      h.addEventListener('click', function (e) { var a = e.target.getAttribute('data-h'); if (!a) return;
        h.remove(); document.body.classList.remove('tour-hi');
        if (a === 'go') open(); else seen(); });
    }, 1500);
  });
})();
