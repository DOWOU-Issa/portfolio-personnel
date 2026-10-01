/* Fond réseau 3D partagé par toutes les pages.
   - Chargé après l'affichage de la page : le contenu reste lisible tout de suite.
   - Désactivé si l'utilisateur réduit les animations, active l'économie de données ou n'a pas WebGL.
   - <body data-net="home"> : réseau fort, à droite, autour de la photo.
     <body data-net="page"> : réseau discret, en retrait. */
(function () {
  var THREE_URL = (document.currentScript && document.currentScript.src ? new URL("vendor/three.min.js", document.currentScript.src).href : "assets/js/vendor/three.min.js");
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  if (reduce || saveData) return;
  try { var t = document.createElement("canvas"); if (!(t.getContext("webgl") || t.getContext("experimental-webgl"))) return; } catch (e) { return; }

  function load(cb) {
    if (window.THREE) return cb();
    var s = document.createElement("script"); s.src = THREE_URL; s.async = true; s.onload = cb; document.head.appendChild(s);
  }
  function start() {
    var mode = document.body.getAttribute("data-net") || "page";
    var canvas = document.createElement("canvas"); canvas.id = "net3d"; canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);
    var r = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    var scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100); cam.position.z = 10;
    var g = new THREE.Group(); scene.add(g);
    var small = innerWidth < 820, N = small ? 45 : 80, pts = [];
    for (var i = 0; i < N; i++) pts.push(new THREE.Vector3().setFromSphericalCoords(2.3 + Math.random() * 1.3, Math.acos(2 * Math.random() - 1), Math.random() * 6.283));
    // Les nœuds sont répartis en trois familles (data, infra, gestion) que la page Projets peut mettre en avant.
    var CATS = ["data", "infra", "gestion"], COL = { data: 0x5fd0c4, infra: 0x7fb8d8, gestion: 0xb8c7d6 }, groups = {}, focus = null;
    CATS.forEach(function (c, k) {
      var sub = pts.filter(function (_, i) { return i % 3 === k; });
      var mat = new THREE.PointsMaterial({ color: COL[c], size: 0.08, transparent: true, opacity: 1 });
      g.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(sub), mat));
      groups[c] = { mat: mat, size: 0.08, op: 1 };
    });
    window.net3d = { focus: function (c) { focus = groups[c] ? c : null; } };
    var seg = [];
    for (var a = 0; a < N; a++) for (var b = a + 1; b < N; b++) if (pts[a].distanceTo(pts[b]) < 1.45) seg.push(pts[a], pts[b]);
    var lm = new THREE.LineBasicMaterial({ color: 0x2c6f7a, transparent: true, opacity: 0.55 });
    g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(seg), lm));

    var strength = mode === "home" ? 1 : 0.32;
    lm.opacity = 0.55 * strength;
    function place() {
      var w = innerWidth, h = innerHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
      var narrow = w < 820;
      if (mode === "home") { g.position.set(narrow ? 0 : 3.4, narrow ? 2.6 : 0.2, 0); g.scale.setScalar(narrow ? 0.7 : 1); }
      else { g.position.set(narrow ? 1.5 : 4.6, 0, 0); g.scale.setScalar(1.5); }
    }
    place(); addEventListener("resize", place);
    var mx = 0, my = 0;
    addEventListener("pointermove", function (e) { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
    var visible = true; document.addEventListener("visibilitychange", function () { visible = !document.hidden; if (visible) requestAnimationFrame(loop); });
    function loop(t) {
      if (!visible) return;
      CATS.forEach(function (c) {
        var o = groups[c], on = !focus || focus === c;
        o.size += ((focus === c ? 0.16 : 0.08) - o.size) * 0.08;
        o.op += ((on ? 1 : 0.25) - o.op) * 0.08;
        o.mat.size = o.size; o.mat.opacity = o.op * strength;
        o.mat.color.setHex(focus === c ? 0xe8b86a : COL[c]);
      });
      g.rotation.y = t * 0.00012 + mx * 0.6; g.rotation.x = my * 0.4 + Math.min(scrollY / 3000, 0.4);
      r.render(scene, cam); requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    requestAnimationFrame(function () { canvas.classList.add("on"); });
  }
  var go = function () { load(start); };
  if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 1500 }); else setTimeout(go, 400);
})();
