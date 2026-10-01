/* En-tête 3D du projet « Précipitations 1982–2024 ».
   Relief réel : cumuls mensuels (mm) calculés à partir des 15 695 relevés journaliers du fichier Excel.
   Axe x = mois, axe z = année (1982 au fond, 2024 devant), hauteur = cumul du mois. */
(function () {
  var THREE_URL = (document.currentScript && document.currentScript.src ? new URL("vendor/three.min.js", document.currentScript.src).href : "assets/js/vendor/three.min.js");
  var MOIS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
  var Y0 = 1982, DATA = [[0, 159, 140, 304, 243, 266, 321, 645, 318, 146, 37, 13], [0, 0, 168, 185, 368, 757, 624, 444, 196, 79, 21, 43], [0, 0, 180, 351, 684, 532, 736, 522, 598, 225, 24, 0], [100, 0, 189, 305, 313, 568, 796, 912, 663, 76, 10, 0], [0, 99, 218, 274, 263, 474, 811, 880, 610, 267, 168, 0], [121, 145, 90, 40, 547, 320, 568, 1043, 813, 177, 0, 13], [35, 126, 165, 344, 263, 563, 647, 934, 650, 69, 29, 73], [0, 6, 148, 168, 364, 590, 589, 1113, 882, 227, 0, 0], [0, 21, 6, 316, 263, 602, 589, 366, 461, 280, 10, 199], [0, 182, 177, 374, 778, 579, 476, 1203, 441, 262, 0, 0], [0, 0, 37, 247, 403, 502, 660, 643, 634, 266, 159, 0], [0, 9, 183, 257, 340, 285, 1042, 1172, 637, 171, 9, 9], [0, 0, 29, 494, 786, 273, 350, 563, 690, 527, 21, 0], [0, 1, 146, 654, 313, 494, 729, 897, 1127, 323, 37, 95], [0, 141, 75, 484, 250, 816, 448, 866, 768, 403, 0, 0], [14, 12, 273, 378, 344, 481, 665, 398, 779, 324, 112, 0], [30, 145, 94, 177, 318, 571, 592, 842, 835, 503, 0, 6], [0, 104, 62, 216, 638, 403, 612, 652, 750, 664, 69, 0], [1, 0, 53, 550, 384, 739, 442, 1015, 524, 293, 2, 0], [0, 0, 29, 294, 561, 426, 285, 544, 877, 0, 0, 0], [0, 0, 218, 259, 385, 773, 640, 706, 856, 580, 71, 3], [7, 239, 14, 511, 356, 671, 862, 917, 725, 540, 144, 0], [53, 1, 61, 268, 400, 541, 462, 774, 585, 283, 170, 0], [0, 54, 519, 275, 460, 568, 603, 645, 642, 364, 8, 0], [147, 32, 51, 259, 631, 205, 572, 1215, 623, 221, 4, 0], [0, 22, 149, 277, 434, 402, 920, 491, 650, 162, 16, 149], [0, 0, 194, 82, 237, 308, 1020, 928, 883, 211, 3, 42], [0, 14, 311, 427, 363, 656, 576, 1040, 667, 344, 118, 31], [0, 31, 413, 371, 506, 401, 440, 998, 817, 406, 181, 0], [0, 70, 176, 412, 488, 340, 744, 670, 695, 403, 0, 0], [0, 77, 40, 395, 478, 579, 400, 329, 625, 207, 0, 63], [7, 0, 359, 554, 447, 540, 442, 243, 512, 428, 8, 0], [42, 54, 384, 89, 417, 224, 463, 718, 850, 346, 75, 0], [33, 161, 246, 28, 199, 344, 470, 592, 553, 314, 10, 0], [0, 0, 80, 116, 275, 486, 1115, 863, 636, 262, 1, 0], [0, 0, 28, 423, 298, 829, 500, 1012, 544, 169, 0, 0], [0, 40, 185, 138, 347, 374, 810, 776, 380, 219, 0, 0], [101, 0, 7, 319, 294, 606, 583, 384, 1122, 879, 5, 0], [0, 0, 366, 509, 361, 545, 554, 549, 624, 233, 0, 0], [0, 0, 368, 202, 224, 853, 603, 1058, 481, 102, 61, 0], [0, 0, 71, 521, 553, 760, 600, 513, 635, 452, 0, 0], [6, 76, 199, 209, 501, 343, 373, 814, 792, 501, 104, 0], [0, 0, 85, 240, 311, 584, 533, 452, 690, 627, 0, 0]];
  var MAX = 0; DATA.forEach(function (r) { r.forEach(function (v) { if (v > MAX) MAX = v; }); });
  var NY = DATA.length, H = 3.4;

  var css = "" +
    ".dw-hero{position:relative;height:clamp(360px,56vh,500px);background:#070b10;border-bottom:1px solid #1c2a36;overflow:hidden;font-family:'JetBrains Mono',ui-monospace,Consolas,monospace}" +
    ".dw-hero canvas{position:absolute;inset:0;width:100%;height:100%;display:block}" +
    ".dw-hero .dw-txt{position:relative;z-index:2;max-width:1120px;margin:0 auto;padding:36px clamp(16px,4vw,32px);pointer-events:none}" +
    ".dw-hero .dw-path{font-size:12px;color:#5fd0c4;margin:0 0 12px}.dw-hero .dw-path span{color:#5d7184}" +
    ".dw-hero h2{font:800 clamp(30px,5vw,56px)/1 'Bricolage Grotesque',system-ui,sans-serif;letter-spacing:-.02em;color:#fff;margin:0 0 12px;max-width:14ch}" +
    ".dw-hero h2 em{font-style:normal;color:#5fd0c4}" +
    ".dw-hero p{font:400 15px/1.55 'Instrument Sans',system-ui,sans-serif;color:#a5b6c6;max-width:44ch;margin:0}" +
    ".dw-hero .dw-leg{position:absolute;z-index:2;right:clamp(16px,4vw,32px);bottom:16px;font-size:11px;line-height:1.7;color:#8aa0b3;text-align:right}" +
    ".dw-hero .dw-leg b{color:#e8b86a;font-weight:500}" +
    ".dw-tip{position:absolute;z-index:3;pointer-events:none;background:#070b10;border:1px solid #5fd0c4;padding:6px 9px;font-size:11px;color:#fff;white-space:nowrap}" +
    "@media (max-width:700px){.dw-hero .dw-leg{display:none}.dw-hero{height:500px}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var hero = document.createElement("section"); hero.className = "dw-hero"; hero.setAttribute("aria-label", "Relief 3D des précipitations mensuelles de 1982 à 2024");
  hero.innerHTML = '<div class="dw-txt"><p class="dw-path">~/projets/<span>precipitations-1982-2024</span></p>' +
    '<h2>43 ans de <em>pluie</em>, mois par mois.</h2>' +
    '<p>Chaque crête est un mois, chaque rangée une année : 516 cumuls mensuels calculés à partir de 15 695 relevés journaliers. Survolez le relief pour lire une valeur.</p></div>' +
    '<div class="dw-leg">x = mois · profondeur = année (1982 → 2024) · hauteur = cumul mensuel<br><b>record : ' + (function () { var b = [0, 0, 0]; DATA.forEach(function (r, y) { r.forEach(function (v, m) { if (v > b[0]) b = [v, y, m]; }); }); return MOIS[b[2]] + " " + (Y0 + b[1]) + ", " + b[0] + " mm"; })() + '</b></div>';
  var bar = document.querySelector(".dw-bar");
  if (bar && bar.nextSibling) bar.parentNode.insertBefore(hero, bar.nextSibling); else document.body.prepend(hero);

  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function hasGL() { try { var c = document.createElement("canvas"); return !!(c.getContext("webgl") || c.getContext("experimental-webgl")); } catch (e) { return false; } }
  if (!hasGL()) return;
  function load(cb) { if (window.THREE) return cb(); var s = document.createElement("script"); s.src = THREE_URL; s.onload = cb; document.head.appendChild(s); }

  load(function () {
    var r = new THREE.WebGLRenderer({ antialias: true, alpha: true }); r.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    hero.prepend(r.domElement);
    var scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    var W = 11, D = 10;
    var geo = new THREE.PlaneGeometry(W, D, 11, NY - 1); geo.rotateX(-Math.PI / 2);
    var pos = geo.attributes.position, col = [];
    for (var y = 0; y < NY; y++) for (var m = 0; m < 12; m++) {
      var v = DATA[y][m], k = v / MAX; pos.setY(y * 12 + m, k * H);
      col.push(0.12 + 0.25 * k, 0.25 + 0.57 * k, 0.3 + 0.47 * k);
    }
    geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); geo.computeVertexNormals();
    var g = new THREE.Group(); scene.add(g);
    var fill = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x070b10, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1, side: THREE.DoubleSide }));
    g.add(fill);
    g.add(new THREE.LineSegments(new THREE.WireframeGeometry(geo), new THREE.LineBasicMaterial({ color: 0x5fd0c4, transparent: true, opacity: 0.6 })));
    var dot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), new THREE.MeshBasicMaterial({ color: 0xe8b86a })); dot.visible = false; g.add(dot);
    var tip = document.createElement("div"); tip.className = "dw-tip"; tip.hidden = true; hero.appendChild(tip);
    var ray = new THREE.Raycaster(), v2 = new THREE.Vector2(), mx = 0, my = 0;
    function size() {
      var w = hero.clientWidth, h = hero.clientHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
      var narrow = w < 700; g.position.set(narrow ? 0 : 3.2, narrow ? -1.8 : -1.2, 0); g.scale.setScalar(narrow ? 0.62 : 0.85);
    }
    size(); addEventListener("resize", size);
    r.domElement.addEventListener("pointermove", function (e) {
      var b = r.domElement.getBoundingClientRect();
      mx = (e.clientX - b.left) / b.width - 0.5; my = (e.clientY - b.top) / b.height - 0.5;
      v2.set(mx * 2, -my * 2); ray.setFromCamera(v2, cam);
      var hit = ray.intersectObject(fill)[0];
      if (!hit) { tip.hidden = true; dot.visible = false; return; }
      var loc = g.worldToLocal(hit.point.clone());
      var m = Math.max(0, Math.min(11, Math.round((loc.x + W / 2) / W * 11)));
      var y = Math.max(0, Math.min(NY - 1, Math.round((loc.z + D / 2) / D * (NY - 1))));
      var v = DATA[y][m];
      dot.position.set(-W / 2 + m * W / 11, v / MAX * H, -D / 2 + y * D / (NY - 1)); dot.visible = true;
      tip.hidden = false; tip.textContent = MOIS[m] + " " + (Y0 + y) + " · " + v.toLocaleString("fr-FR") + " mm";
      tip.style.left = Math.min(e.clientX - b.left + 14, b.width - 170) + "px"; tip.style.top = (e.clientY - b.top - 12) + "px";
    });
    r.domElement.addEventListener("pointerleave", function () { tip.hidden = true; dot.visible = false; });
    (function loop(t) {
      g.rotation.y = -0.55 + (reduce ? 0 : Math.sin(t * 0.00018) * 0.12) + mx * 0.35;
      cam.position.set(0, 6.5 - my * 2, 12.5); cam.lookAt(0, 0.4, 0);
      r.render(scene, cam); requestAnimationFrame(loop);
    })(0);
  });
})();
