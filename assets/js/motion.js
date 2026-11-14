/* Couche de motion design du portfolio.
   Principe : chaque animation guide l'attention, signale un état ou garde la continuité
   entre les pages. Uniquement transform et opacity. Tout est coupé si l'utilisateur
   demande moins d'animations. Sans JavaScript, le contenu reste visible normalement. */
(function () {
  var calme = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (calme) return;

  // Jetons de mouvement (durées et courbes communes à tout le site)
  var T = { fast: '.18s', normal: '.45s', slow: '.7s', ease: 'cubic-bezier(.22,1,.36,1)', press: '.97', lift: '-3px', dist: '18px' };

  var css =
    ':root{--mv-fast:' + T.fast + ';--mv-normal:' + T.normal + ';--mv-slow:' + T.slow + ';--mv-ease:' + T.ease + ';--mv-dist:' + T.dist + '}' +
    /* Apparition au défilement */
    'html.mv .mv-r{opacity:0;transform:translateY(var(--mv-dist));transition:opacity var(--mv-slow) var(--mv-ease),transform var(--mv-slow) var(--mv-ease);transition-delay:calc(var(--i,0) * 60ms)}' +
    'html.mv .mv-r.mv-in{opacity:1;transform:none}' +
    /* Cartes : légère élévation au survol */
    '.proj-list a,.home-links a,.video-card,.project-card,.gal a{transition:background .25s,border-color .25s,transform var(--mv-normal) var(--mv-ease),box-shadow var(--mv-normal) var(--mv-ease)}' +
    '@media (hover:hover){.proj-list a:hover,.home-links a:hover,.video-card:hover,.project-card:hover,.gal a:hover{transform:translateY(' + T.lift + ');box-shadow:0 14px 30px -18px rgba(95,208,196,.45)}}' +
    /* Boutons : retour tactile à l'appui */
    '.btn,.video-link,.drive-link,.filters button{transition:border-color .2s,background .2s,color .2s,transform var(--mv-fast) var(--mv-ease)}' +
    '.btn:active,.video-link:active,.drive-link:active,.filters button:active{transform:scale(' + T.press + ')}' +
    /* Menu : soulignement qui se déploie */
    '.site-nav a{position:relative;border-bottom-color:transparent!important}' +
    '.site-nav a::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;background:var(--acc,#5fd0c4);transform:scaleX(0);transform-origin:left;transition:transform var(--mv-normal) var(--mv-ease)}' +
    '.site-nav a:hover::after,.site-nav a[aria-current=page]::after{transform:scaleX(1)}' +
    /* Barre de progression de lecture */
    '#mv-progress{position:fixed;top:0;left:0;right:0;height:2px;background:var(--acc,#5fd0c4);transform:scaleX(0);transform-origin:left;z-index:80;pointer-events:none}' +
    /* Vignettes vidéo : léger zoom */
    '@media (hover:hover){.video-card:hover .vthumb{transform:scale(1.04);opacity:.85}}' +
    /* Titres : dévoilement doux par le bas, comme un rideau */
    'html.mv .mv-t{clip-path:inset(0 0 100% 0);transform:translateY(.35em);transition:clip-path .55s cubic-bezier(.22,1,.36,1),transform .55s cubic-bezier(.22,1,.36,1)}' +
    'html.mv .mv-t.mv-in{clip-path:inset(-10% -5% -15% -5%);transform:none}' +
    /* Carte vers page projet : morphing partagé */
    'main h1.title,.dw-fiche h1{view-transition-name:vt-hero}' +
    'html.vt-leaving main h1.title,html.vt-leaving .dw-fiche h1{view-transition-name:none}' +
    '::view-transition-group(vt-hero){animation-duration:.55s;animation-timing-function:cubic-bezier(.22,1,.36,1)}' +
    '::view-transition-old(vt-hero),::view-transition-new(vt-hero){height:100%;object-fit:cover}' +
    /* Lumière qui suit la souris + inclinaison 3D */
    '.mv-tilt{background-image:radial-gradient(260px circle at var(--mx,50%) var(--my,50%),rgba(95,208,196,var(--mg,0)),transparent 65%);transform-style:preserve-3d;will-change:transform}' +
    /* Accueil cinématique */
    'html.mv .home .portrait img{clip-path:circle(0% at 50% 50%);animation:mv-iris 1.1s .35s cubic-bezier(.22,1,.36,1) forwards}' +
    '@keyframes mv-iris{to{clip-path:circle(50% at 50% 50%)}}' +
    'html.mv .home .portrait .tag{opacity:0;animation:mv-tag .6s cubic-bezier(.22,1,.36,1) forwards}' +
    'html.mv .home .portrait .tag:nth-of-type(1){animation-delay:1s}html.mv .home .portrait .tag:nth-of-type(2){animation-delay:1.15s}html.mv .home .portrait .tag:nth-of-type(3){animation-delay:1.3s}' +
    '@keyframes mv-tag{from{opacity:0;transform:translateY(8px) scale(.9)}to{opacity:1;transform:none}}' +
    '.home .portrait{will-change:transform}';


  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  document.documentElement.classList.add('mv');

  // Éléments révélés au défilement, avec un léger décalage entre voisins
  var SEL = [
    'main h2', '.cv-section', '.proj-list > li', '.home-links > a', '.video-card', '.project-card',
    '.tldr > div', '.kpis > *', '.gal > a', '.stats > div', '.contact-info', '.contact-form',
    '#labs-console', 'main figure', 'main .tbl'
  ].join(',');

  var io = new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('mv-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  function prepare(root) {
    (root || document).querySelectorAll(SEL).forEach(function (el) {
      if (el.classList.contains('mv-r') || el.closest('.reveal') || el.closest('[role=dialog]')) return;
      var sibs = el.parentElement ? Array.prototype.filter.call(el.parentElement.children, function (c) { return c.matches(SEL); }) : [];
      el.style.setProperty('--i', Math.min(Math.max(sibs.indexOf(el), 0), 6));
      el.classList.add('mv-r');
      io.observe(el);
    });
  }


  /* 2. Carte → page projet : la carte cliquée devient le titre de la page suivante */
  function shareOnClick(e) {
    var a = e.target.closest('.proj-list a, .stage .card, .home-links a, .video-card a.video-link');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    var card = a.closest('.video-card') || a;
    document.documentElement.classList.add('vt-leaving');
    card.style.viewTransitionName = 'vt-hero';
  }
  addEventListener('pageshow', function () {
    document.documentElement.classList.remove('vt-leaving');
    document.querySelectorAll('[style*="view-transition-name"]').forEach(function (x) { x.style.viewTransitionName = ''; });
  });

  /* 3. Lumière + inclinaison sur les cartes (ordinateur uniquement) */
  function tilt() {
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    var CARDS = '.proj-list a, .home-links a, .video-card, .project-card, .gal a';
    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest && e.target.closest(CARDS); if (!c) return;
      c.classList.add('mv-tilt');
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--mx', (x * 100) + '%'); c.style.setProperty('--my', (y * 100) + '%'); c.style.setProperty('--mg', '.13');
      c.style.transform = 'perspective(900px) rotateX(' + ((.5 - y) * 5).toFixed(2) + 'deg) rotateY(' + ((x - .5) * 6).toFixed(2) + 'deg) translateY(-3px)';
    }, { passive: true });
    document.addEventListener('pointerout', function (e) {
      var c = e.target.closest && e.target.closest(CARDS);
      if (!c || (e.relatedTarget && c.contains(e.relatedTarget))) return;
      c.style.transform = ''; c.style.setProperty('--mg', '0');
    }, { passive: true });
  }

  /* 4. Accueil cinématique : titre décodé, photo en iris, profondeur au défilement */
  function cinema() {
    var home = document.querySelector('.home'); if (!home) return;
    var pic = home.querySelector('.portrait');
    if (pic) {
      var tick = false;
      addEventListener('scroll', function () {
        if (tick) return; tick = true;
        requestAnimationFrame(function () { pic.style.transform = 'translateY(' + Math.min(scrollY * 0.18, 120).toFixed(1) + 'px)'; tick = false; });
      }, { passive: true });
    }
  }

  function boot() {
    prepare();
    cinema(); tilt();
    document.addEventListener('click', shareOnClick, true);
    // Titres : dévoilement en rideau à leur arrivée à l'écran
    // (le titre masqué n'est pas observable lui-même : on observe un repère invisible placé juste avant)
    var tio = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target._mvTitle.classList.add('mv-in'); tio.unobserve(e.target); } }); }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('main h2').forEach(function (h) {
      h.classList.remove('mv-r'); h.classList.add('mv-t');
      var m = document.createElement('span'); m.setAttribute('aria-hidden', 'true'); m.style.cssText = 'display:block;height:1px;margin-bottom:-1px';
      m._mvTitle = h; h.parentNode.insertBefore(m, h); tio.observe(m);
    });
    // Les listes construites par script (page Projets, recherche) sont révélées aussi
    var list = document.getElementById('projectList');
    if (list && 'MutationObserver' in window) new MutationObserver(function () { prepare(list); }).observe(list, { childList: true });

    // Barre de progression, seulement sur les pages longues
    if (document.documentElement.scrollHeight > innerHeight * 2) {
      var bar = document.createElement('div'); bar.id = 'mv-progress'; bar.setAttribute('aria-hidden', 'true');
      document.body.appendChild(bar);
      var tick = false;
      addEventListener('scroll', function () {
        if (tick) return; tick = true;
        requestAnimationFrame(function () {
          var max = document.documentElement.scrollHeight - innerHeight;
          bar.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
          tick = false;
        });
      }, { passive: true });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
