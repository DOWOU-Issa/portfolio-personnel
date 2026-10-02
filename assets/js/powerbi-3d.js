/* Histogramme 3D des ventes (données réelles des CSV du projet Power BI).
   Une rangée par catégorie, une colonne par trimestre 2023–2024, hauteur = chiffre d'affaires HT. */
(function () {
  var THREE_URL = (document.currentScript && document.currentScript.src ? new URL("vendor/three.min.js", document.currentScript.src).href : "assets/js/vendor/three.min.js");
  var host = document.getElementById("ventes3d"); if (!host) return;
  var D = {"cats": ["TV & Vidéo", "Ordinateurs", "Électroménager", "Appareil Photo & Camescope", "Téléphones & Accessoires", "Audio", "Jeux Vidéo", "Accessoires"], "qs": ["2023-T1", "2023-T2", "2023-T3", "2023-T4", "2024-T1", "2024-T2", "2024-T3", "2024-T4"], "v": [[133184, 226413, 137164, 182453, 129229, 159019, 182518, 185258], [153847, 183018, 129588, 151267, 150384, 151915, 168289, 232880], [73138, 73289, 60581, 76088, 65558, 53169, 65634, 62846], [48494, 67724, 47339, 75184, 70419, 68989, 76199, 67034], [50164, 45079, 59109, 39669, 39704, 44164, 65749, 60624], [28388, 38015, 38512, 42532, 37402, 34515, 28828, 32000], [38186, 36883, 23783, 26691, 27351, 38032, 45182, 29403], [3027, 3577, 3284, 3289, 3154, 2638, 3247, 3787]]};
  var MAX = 0; D.v.forEach(function (r) { r.forEach(function (x) { if (x > MAX) MAX = x; }); });
  var NC = D.cats.length, NQ = D.qs.length, H = 3.6;
  function gl() { try { var c = document.createElement("canvas"); return !!(c.getContext("webgl") || c.getContext("experimental-webgl")); } catch (e) { return false; } }
  if (!gl()) { host.hidden = true; return; }
  function load(cb) { if (window.THREE) return cb(); var s = document.createElement("script"); s.src = THREE_URL; s.onload = cb; document.head.appendChild(s); }
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  load(function () {
    var r = new THREE.WebGLRenderer({ antialias: true, alpha: true }); r.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    host.prepend(r.domElement);
    var scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    var g = new THREE.Group(); scene.add(g);
    var bars = [], labels = [], sx = 1.0, sz = 0.95, x0 = -(NQ - 1) * sx / 2, z0 = -(NC - 1) * sz / 2;
    var best = [0, 0]; D.v.forEach(function (row, c) { row.forEach(function (x, q) { if (x > D.v[best[0]][best[1]]) best = [c, q]; }); });
    D.v.forEach(function (row, c) {
      row.forEach(function (x, q) {
        var h = Math.max(0.03, x / MAX * H), top = c === best[0] && q === best[1], y24 = q >= 4;
        var geo = new THREE.BoxGeometry(0.62, h, 0.62); geo.translate(0, h / 2, 0);
        var mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: top ? 0x3a2c12 : (y24 ? 0x123a40 : 0x0d1d24), transparent: true, opacity: 0.92 }));
        var edge = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: top ? 0xe8b86a : (y24 ? 0x5fd0c4 : 0x2c6f7a) }));
        var px = x0 + q * sx, pz = z0 + c * sz; mesh.position.set(px, 0, pz); edge.position.set(px, 0, pz);
        mesh.userData = { c: c, q: q }; g.add(mesh); g.add(edge); bars.push(mesh);
      });
    });
    g.add(new THREE.GridHelper(12, 12, 0x1c2a36, 0x131d27));
    function lab(t, cls) { var d = document.createElement("span"); d.className = "t3-lab " + (cls || ""); d.textContent = t; host.appendChild(d); return d; }
    D.qs.forEach(function (q, i) { labels.push({ el: lab(q.replace("-", " "), i >= 4 ? "pen" : ""), p: new THREE.Vector3(x0 + i * sx, 0, z0 + NC * sz + 0.2) }); });
    D.cats.forEach(function (c, i) { labels.push({ el: lab(c), p: new THREE.Vector3(x0 - 1.6, 0, z0 + i * sz) }); });
    var tip = document.createElement("div"); tip.className = "t3-tip"; tip.hidden = true; host.appendChild(tip);
    var ray = new THREE.Raycaster(), v2 = new THREE.Vector2(), mx = 0, my = 0, v = new THREE.Vector3();
    function size() { var w = host.clientWidth, h = host.clientHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); g.scale.setScalar(w < 640 ? 0.5 : 0.72); }
    size(); new ResizeObserver(size).observe(host);
    r.domElement.addEventListener("pointermove", function (e) {
      var b = r.domElement.getBoundingClientRect(); mx = (e.clientX - b.left) / b.width - 0.5; my = (e.clientY - b.top) / b.height - 0.5;
      v2.set(mx * 2, -my * 2); ray.setFromCamera(v2, cam); var hit = ray.intersectObjects(bars)[0];
      if (!hit) { tip.hidden = true; return; }
      var d = hit.object.userData; tip.hidden = false;
      tip.textContent = D.cats[d.c] + " · " + D.qs[d.q].replace("-", " ") + " · " + D.v[d.c][d.q].toLocaleString("fr-FR") + " $ HT";
      tip.style.left = Math.min(e.clientX - b.left + 14, b.width - 280) + "px"; tip.style.top = (e.clientY - b.top - 14) + "px";
    });
    r.domElement.addEventListener("pointerleave", function () { tip.hidden = true; mx = my = 0; });
    (function loop(t) {
      g.rotation.y = -0.35 + (reduce ? 0 : Math.sin(t * 0.0002) * 0.1) + mx * 0.5;
      cam.position.set(0, 7.5 - my * 2.5, 12.5); cam.lookAt(0, 0.4, 0);
      r.render(scene, cam);
      var w = host.clientWidth, h = host.clientHeight;
      labels.forEach(function (l) { v.copy(l.p).applyMatrix4(g.matrixWorld).project(cam); l.el.style.transform = "translate(" + ((v.x + 1) / 2 * w) + "px," + ((1 - v.y) / 2 * h) + "px) translate(-50%,-50%)"; });
      requestAnimationFrame(loop);
    })(0);
  });
})();
