/* Observatoire des prix des denrées au Togo : lit assets/data/observatoire.json
   (mis à jour chaque mois par GitHub Actions) et dessine les graphiques en SVG, sans bibliothèque. */
(function () {
  var el = function (id) { return document.getElementById(id); };
  var NS = 'http://www.w3.org/2000/svg';
  var MOIS = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc'];
  var D, prod, reg;
  var fmt = function (n) { return Math.round(n).toLocaleString('fr-FR'); };

  function svg(w, h) { var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 ' + w + ' ' + h); s.setAttribute('role', 'img'); return s; }
  function add(p, tag, at, txt) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); if (txt != null) e.textContent = txt; p.appendChild(e); return e; }
  function lbl(m) { var p = m.split('-'); return MOIS[+p[1] - 1] + ' ' + p[0]; }

  /* Courbe des prix + prévision */
  function courbe() {
    var s = D.series[prod][reg] || {}, keys = Object.keys(s).sort();
    var prev = reg === 'National' ? (D.prevision[prod] || []) : [];
    var W = 760, H = 300, L = 46, R = 14, T = 14, B = 30, box = el('obs-courbe');
    box.innerHTML = '';
    if (!keys.length) { box.textContent = 'Pas de données pour cette région.'; return; }
    var all = keys.map(function (k) { return s[k]; }).concat(prev.map(function (p) { return p.haut; }));
    var max = Math.max.apply(null, all) * 1.08, min = 0, n = keys.length + prev.length;
    var x = function (i) { return L + i * (W - L - R) / (n - 1); }, y = function (v) { return T + (H - T - B) * (1 - (v - min) / (max - min)); };
    var g = svg(W, H); g.setAttribute('aria-label', 'Prix du ' + prod + ', ' + reg);
    for (var t = 0; t <= 4; t++) { var v = max * t / 4; add(g, 'line', { x1: L, x2: W - R, y1: y(v), y2: y(v), class: 'obs-grid' }); add(g, 'text', { x: L - 6, y: y(v) + 4, 'text-anchor': 'end', class: 'obs-ax' }, fmt(v)); }
    keys.forEach(function (k, i) { if (k.slice(5) === '01' && +k.slice(0, 4) % 2 === 0) add(g, 'text', { x: x(i), y: H - 8, 'text-anchor': 'middle', class: 'obs-ax' }, k.slice(0, 4)); });
    if (prev.length) {
      var i0 = keys.length - 1, band = 'M' + x(i0) + ',' + y(s[keys[i0]]);
      prev.forEach(function (p, j) { band += ' L' + x(i0 + 1 + j) + ',' + y(p.haut); });
      for (var j = prev.length - 1; j >= 0; j--) band += ' L' + x(i0 + 1 + j) + ',' + y(prev[j].bas);
      add(g, 'path', { d: band + ' Z', class: 'obs-band' });
      add(g, 'polyline', { points: [x(i0) + ',' + y(s[keys[i0]])].concat(prev.map(function (p, j) { return x(i0 + 1 + j) + ',' + y(p.prix); })).join(' '), class: 'obs-prev' });
    }
    add(g, 'polyline', { points: keys.map(function (k, i) { return x(i) + ',' + y(s[k]); }).join(' '), class: 'obs-line' });
    // survol : prix du mois sous la souris
    var tip = add(g, 'text', { class: 'obs-tip', x: L + 8, y: T + 12 }), dot = add(g, 'circle', { r: 4, class: 'obs-dot', cx: -10, cy: -10 });
    g.addEventListener('pointermove', function (e) {
      var r = g.getBoundingClientRect(), px = (e.clientX - r.left) * W / r.width, i = Math.round((px - L) / (W - L - R) * (n - 1));
      i = Math.max(0, Math.min(n - 1, i));
      var m, v, pr = i >= keys.length;
      if (pr) { m = prev[i - keys.length].mois; v = prev[i - keys.length].prix; } else { m = keys[i]; v = s[m]; }
      dot.setAttribute('cx', x(i)); dot.setAttribute('cy', y(v));
      tip.textContent = lbl(m) + ' : ' + fmt(v) + ' FCFA/kg' + (pr ? ' (prévision)' : '');
    });
    box.appendChild(g);
  }

  /* Saisonnalité */
  function saison() {
    var f = D.saison[prod], W = 760, H = 200, L = 40, B = 26, T = 10, box = el('obs-saison'); box.innerHTML = '';
    var m = Math.max(5, Math.max.apply(null, f.map(Math.abs))) * 1.15, g = svg(W, H), bw = (W - L - 10) / 12;
    var y = function (v) { return T + (H - T - B) / 2 * (1 - v / m); };
    add(g, 'line', { x1: L, x2: W - 10, y1: y(0), y2: y(0), class: 'obs-grid' });
    f.forEach(function (v, i) {
      var top = Math.min(y(0), y(v)), h = Math.abs(y(v) - y(0));
      add(g, 'rect', { x: L + i * bw + 6, y: top, width: bw - 12, height: Math.max(h, 1), class: v > 0 ? 'obs-up' : 'obs-down' });
      add(g, 'text', { x: L + i * bw + bw / 2, y: H - 6, 'text-anchor': 'middle', class: 'obs-ax' }, MOIS[i]);
      add(g, 'text', { x: L + i * bw + bw / 2, y: v > 0 ? top - 4 : top + h + 12, 'text-anchor': 'middle', class: 'obs-val' }, (v > 0 ? '+' : '') + v.toFixed(0) + ' %');
    });
    g.setAttribute('aria-label', 'Saisonnalité du ' + prod);
    box.appendChild(g);
  }

  /* Chiffres clés */
  function kpis() {
    var s = D.series[prod][reg] || {}, k = Object.keys(s).sort(), last = k[k.length - 1];
    var an = k.indexOf(last) >= 12 ? s[k[k.indexOf(last) - 12]] : null, a = D.pouvoir_achat[prod];
    el('obs-k1').textContent = last ? fmt(s[last]) : '–'; el('obs-k1l').textContent = 'FCFA/kg en ' + (last ? lbl(last) : '–');
    el('obs-k2').textContent = an ? ((s[last] / an - 1) * 100 > 0 ? '+' : '') + Math.round((s[last] / an - 1) * 100) + ' %' : '–';
    var ka = a[D.dernier_mois]; el('obs-k3').textContent = ka ? fmt(ka) + ' kg' : '–';
    var p = D.prevision[prod]; el('obs-k4').textContent = p ? fmt(p[p.length - 1].prix) : '–';
    el('obs-k4l').textContent = p ? 'FCFA/kg prévus en ' + lbl(p[p.length - 1].mois) + ' (national)' : '';
  }

  /* Alertes : carte des marchés + liste */
  function alertes() {
    var A = D.alertes.filter(function (a) { return a.produit === prod; }), box = el('obs-carte'), list = el('obs-alertes');
    box.innerHTML = ''; list.innerHTML = '';
    var W = 240, H = 420, g = svg(W, H), lo = [-0.2, 1.9], la = [6.0, 11.2];
    var x = function (v) { return 20 + (v - lo[0]) / (lo[1] - lo[0]) * (W - 40); }, y = function (v) { return 10 + (1 - (v - la[0]) / (la[1] - la[0])) * (H - 20); };
    add(g, 'rect', { x: 1, y: 1, width: W - 2, height: H - 2, class: 'obs-frame' });
    D.alertes.forEach(function (a) { add(g, 'circle', { cx: x(a.lon), cy: y(a.lat), r: 3, class: 'obs-faint' }); });
    A.forEach(function (a) {
      add(g, 'circle', { cx: x(a.lon), cy: y(a.lat), r: 5 + Math.min(Math.abs(a.ecart) / 10, 8), class: a.ecart > 0 ? 'obs-alert-up' : 'obs-alert-down' });
      var li = document.createElement('li');
      li.innerHTML = '<b>' + a.marche + '</b> <small>' + a.region + '</small><span class="' + (a.ecart > 0 ? 'up' : 'down') + '">' + (a.ecart > 0 ? '+' : '') + a.ecart + ' %</span><em>' + fmt(a.prix) + ' FCFA/kg, attendu ' + fmt(a.attendu) + '</em>';
      list.appendChild(li);
    });
    g.setAttribute('aria-label', A.length + ' marchés en alerte pour ' + prod);
    box.appendChild(g);
    if (!A.length) list.innerHTML = '<li class="none">Aucun marché ne s\'écarte de plus de 25 % de son prix de saison pour cette denrée.</li>';
  }

  function tout() { prod = el('obs-prod').value; reg = el('obs-reg').value; kpis(); courbe(); saison(); alertes(); }

  fetch(el('observatoire').dataset.src).then(function (r) { return r.json(); }).then(function (d) {
    D = d;
    d.produits.forEach(function (p) { el('obs-prod').add(new Option(p, p)); });
    d.regions.forEach(function (r) { el('obs-reg').add(new Option(r, r)); });
    el('obs-maj').textContent = 'Données jusqu\'à ' + lbl(d.dernier_mois) + ' · ' + d.marches_total + ' marchés · mise à jour automatique le ' + new Date(d.maj).toLocaleDateString('fr-FR');
    el('obs-prod').addEventListener('change', tout); el('obs-reg').addEventListener('change', tout);
    tout();
    el('observatoire').classList.add('ok');
  }).catch(function () { el('obs-maj').textContent = 'Les données n\'ont pas pu être chargées.'; });
})();
