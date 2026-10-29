/* Chiffres de l'accueil calculés à partir du contenu réel du site :
   - projets : la liste de projets/projets.html (#projets-data)
   - vidéos : le nombre de cartes .video-card de video.html
   Le chiffre écrit dans le HTML sert de secours si le calcul échoue. */
(function () {
  var calme = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function page(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw r.status; return r.text(); })
      .then(function (t) { return new DOMParser().parseFromString(t, 'text/html'); });
  }
  var SOURCES = {
    projets: function () { return page('projets/projets.html').then(function (d) { return JSON.parse(d.getElementById('projets-data').textContent).length; }); },
    videos: function () { return page('video.html').then(function (d) { return d.querySelectorAll('.video-card').length; }); }
  };

  function anime(el, cible) {
    if (calme) { el.textContent = cible; return; }
    var t0 = null, dur = 1200;
    function pas(t) {
      if (t0 === null) t0 = t;
      var k = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(cible * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(pas);
    }
    requestAnimationFrame(pas);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-compte]').forEach(function (el) {
      var src = SOURCES[el.getAttribute('data-compte')];
      if (!src) return;
      var secours = parseInt(el.textContent, 10);
      src().then(function (n) { if (n > 0) anime(el, n); })
        .catch(function () { if (!isNaN(secours)) anime(el, secours); });
    });
  });
})();
