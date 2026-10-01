/* Paysage 3D du réglage de la régression logistique (données réelles du notebook).
   Deux rangées de colonnes : pénalité L1 et L2, pour C de 0,001 à 100. Hauteur = F1 du churn.
   La meilleure configuration (L1, C = 0,1) est mise en avant. */
(function () {
  var THREE_URL = (document.currentScript && document.currentScript.src ? new URL("vendor/three.min.js", document.currentScript.src).href : "assets/js/vendor/three.min.js");
  var host = document.getElementById("tuning3d"); if (!host) return;
  var C = ["0,001", "0,01", "0,1", "1", "10", "100"];
  var F1 = { L1: [0.5434, 0.6144, 0.6149, 0.6096, 0.6074, 0.6074], L2: [0.4301, 0.6063, 0.6069, 0.6074, 0.6074, 0.6074] };
  var ACC = { L1: [0.8568, 0.8586, 0.8586, 0.8570, 0.8565, 0.8565], L2: [0.8474, 0.8569, 0.8568, 0.8564, 0.8564, 0.8564] };
  var BASE = 0.40, SCALE = 14; // hauteur = (F1 - 0,40) × 14
  function gl() { try { var c = document.createElement("canvas"); return !!(c.getContext("webgl") || c.getContext("experimental-webgl")); } catch (e) { return false; } }
  if (!gl()) { host.hidden = true; return; }
  function load(cb) { if (window.THREE) return cb(); var s = document.createElement("script"); s.src = THREE_URL; s.onload = cb; document.head.appendChild(s); }
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  load(function () {
    var r = new THREE.WebGLRenderer({ antialias: true, alpha: true }); r.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    host.prepend(r.domElement);
    var scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    var g = new THREE.Group(); scene.add(g);
    var bars = [], labels = [];
    ["L1", "L2"].forEach(function (pen, row) {
      F1[pen].forEach(function (f, i) {
        var h = Math.max(0.05, (f - BASE) * SCALE), best = pen === "L1" && i === 2;
        var geo = new THREE.BoxGeometry(0.7, h, 0.7); geo.translate(0, h / 2, 0);
        var mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: best ? 0x3a2c12 : (row ? 0x0d1d24 : 0x123a40), transparent: true, opacity: 0.92 }));
        var edge = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: best ? 0xe8b86a : (row ? 0x2c6f7a : 0x5fd0c4) }));
        var x = -3.75 + i * 1.5, z = row ? 1.1 : -1.1;
        mesh.position.set(x, 0, z); edge.position.set(x, 0, z);
        mesh.userData = { pen: pen, i: i }; g.add(mesh); g.add(edge); bars.push(mesh);
      });
    });
    g.add(new THREE.GridHelper(12, 12, 0x1c2a36, 0x131d27));
    function lab(text, cls) { var d = document.createElement("span"); d.className = "t3-lab " + (cls || ""); d.textContent = text; host.appendChild(d); return d; }
    C.forEach(function (c, i) { labels.push({ el: lab("C = " + c), p: new THREE.Vector3(-3.75 + i * 1.5, 0, 2.4) }); });
    labels.push({ el: lab("L1", "pen"), p: new THREE.Vector3(-5.2, 0, -1.1) });
    labels.push({ el: lab("L2", "pen"), p: new THREE.Vector3(-5.2, 0, 1.1) });
    labels.push({ el: lab("meilleur : F1 0,6149", "best"), p: new THREE.Vector3(-0.75, (0.6149 - BASE) * SCALE + 0.4, -1.1) });
    var tip = document.createElement("div"); tip.className = "t3-tip"; tip.hidden = true; host.appendChild(tip);
    var ray = new THREE.Raycaster(), v2 = new THREE.Vector2(), mx = 0, my = 0, v = new THREE.Vector3();
    function size() { var w = host.clientWidth, h = host.clientHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); g.scale.setScalar(w < 640 ? 0.75 : 1); }
    size(); new ResizeObserver(size).observe(host);
    r.domElement.addEventListener("pointermove", function (e) {
      var b = r.domElement.getBoundingClientRect(); mx = (e.clientX - b.left) / b.width - 0.5; my = (e.clientY - b.top) / b.height - 0.5;
      v2.set(mx * 2, -my * 2); ray.setFromCamera(v2, cam); var hit = ray.intersectObjects(bars)[0];
      if (!hit) { tip.hidden = true; return; }
      var d = hit.object.userData; tip.hidden = false;
      tip.textContent = d.pen + " · C = " + C[d.i] + " · F1 " + String(F1[d.pen][d.i]).replace(".", ",") + " · accuracy " + String(ACC[d.pen][d.i]).replace(".", ",");
      tip.style.left = Math.min(e.clientX - b.left + 14, b.width - 260) + "px"; tip.style.top = (e.clientY - b.top - 14) + "px";
    });
    r.domElement.addEventListener("pointerleave", function () { tip.hidden = true; mx = my = 0; });
    (function loop(t) {
      g.rotation.y = -0.55 + (reduce ? 0 : Math.sin(t * 0.0002) * 0.1) + mx * 0.5;
      cam.position.set(0, 6.5 - my * 2.5, 10.5); cam.lookAt(0, 0.9, 0);
      r.render(scene, cam);
      var w = host.clientWidth, h = host.clientHeight;
      labels.forEach(function (l) { v.copy(l.p).applyMatrix4(g.matrixWorld).project(cam); l.el.style.transform = "translate(" + ((v.x + 1) / 2 * w) + "px," + ((1 - v.y) / 2 * h) + "px) translate(-50%,-50%)"; });
      requestAnimationFrame(loop);
    })(0);
  });
})();
