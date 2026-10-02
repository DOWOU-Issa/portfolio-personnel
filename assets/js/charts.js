/* Petits graphiques SVG pour les pages projet, construits à partir des vraies données.
   Usage : <figure class="chart" data-chart='{"type":"line"|"dumbbell"|"hbar", ...}'></figure>
   Palette validée (fond sombre #070b10) : série A #6b8fd6, série B #b8862a, série unique #33a99b. */
(function () {
  var A = "#6b8fd6", B = "#b8862a", ONE = "#33a99b";
  var INK = "#d7e3ee", MUTE = "#8aa0b3", GRID = "#1c2a36";
  var NS = "http://www.w3.org/2000/svg";
  function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function txt(p, x, y, s, o) { var t = el("text", Object.assign({ x: x, y: y, fill: MUTE, "font-size": 11, "font-family": "JetBrains Mono, monospace" }, o || {}), p); t.textContent = s; return t; }
  function fmt(v, u) { return (u === "%" ? (v * 100).toFixed(1).replace(".", ",") + " %" : u === "€" || u === "$" ? Math.round(v).toLocaleString("fr-FR") + " " + u : String(v).replace(".", ",")); }
  function tip(fig) { var t = document.createElement("div"); t.className = "ch-tip"; t.hidden = true; fig.appendChild(t); return t; }
  function place(t, fig, e, html) { var b = fig.getBoundingClientRect(); t.innerHTML = html; t.hidden = false; t.style.left = Math.min(e.clientX - b.left + 12, b.width - 220) + "px"; t.style.top = (e.clientY - b.top - 10) + "px"; }
  function legend(fig, items) {
    var l = document.createElement("div"); l.className = "ch-legend";
    l.innerHTML = items.map(function (i) { return '<span><i style="background:' + i[1] + '"></i>' + i[0] + "</span>"; }).join("");
    fig.insertBefore(l, fig.firstChild);
  }

  function line(fig, d) {
    var W = 640, H = 260, m = { l: 64, r: 16, t: 14, b: 30 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
    var all = []; d.series.forEach(function (s) { all = all.concat(s.values); });
    var step = d.step || 50000, max = Math.ceil(Math.max.apply(null, all) * 1.04 / step) * step, n = d.labels.length;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": d.aria || "" }, fig);
    var x = function (i) { return m.l + i * iw / (n - 1); }, y = function (v) { return m.t + ih - v / max * ih; };
    for (var v = 0; v <= max + 1; v += step) { var yy = y(v); el("line", { x1: m.l, x2: W - m.r, y1: yy, y2: yy, stroke: GRID }, svg); txt(svg, m.l - 8, yy + 4, Math.round(v / 1000) + " k", { "text-anchor": "end" }); }
    d.labels.forEach(function (lb, i) { txt(svg, x(i), H - 10, lb, { "text-anchor": "middle" }); });
    var cols = [A, B];
    d.series.forEach(function (s, si) {
      el("polyline", { points: s.values.map(function (v, i) { return x(i) + "," + y(v); }).join(" "), fill: "none", stroke: cols[si], "stroke-width": 2, "stroke-linejoin": "round" }, svg);
      var last = s.values.length - 1; el("circle", { cx: x(last), cy: y(s.values[last]), r: 4, fill: cols[si], stroke: "#070b10", "stroke-width": 2 }, svg);
    });
    var cross = el("line", { y1: m.t, y2: m.t + ih, stroke: MUTE, "stroke-dasharray": "3 3", visibility: "hidden" }, svg);
    var dots = d.series.map(function (s, si) { return el("circle", { r: 4, fill: cols[si], stroke: "#070b10", "stroke-width": 2, visibility: "hidden" }, svg); });
    var hit = el("rect", { x: m.l, y: m.t, width: iw, height: ih, fill: "transparent" }, svg), t = tip(fig);
    hit.addEventListener("pointermove", function (e) {
      var r = svg.getBoundingClientRect(), px = (e.clientX - r.left) * W / r.width, i = Math.max(0, Math.min(n - 1, Math.round((px - m.l) / iw * (n - 1))));
      cross.setAttribute("x1", x(i)); cross.setAttribute("x2", x(i)); cross.setAttribute("visibility", "visible");
      dots.forEach(function (c, si) { c.setAttribute("cx", x(i)); c.setAttribute("cy", y(d.series[si].values[i])); c.setAttribute("visibility", "visible"); });
      place(t, fig, e, "<b>" + d.labels[i] + "</b>" + d.series.map(function (s, si) { return '<span><i style="background:' + cols[si] + '"></i>' + s.name + " : " + fmt(s.values[i], d.unit) + "</span>"; }).join(""));
    });
    hit.addEventListener("pointerleave", function () { t.hidden = true; cross.setAttribute("visibility", "hidden"); dots.forEach(function (c) { c.setAttribute("visibility", "hidden"); }); });
    legend(fig, d.series.map(function (s, si) { return [s.name, cols[si]]; }));
  }

  function dumbbell(fig, d) {
    var rowH = 34, W = 640, m = { l: 150, r: 70, t: 10, b: 28 }, H = m.t + d.rows.length * rowH + m.b, iw = W - m.l - m.r;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": d.aria || "" }, fig);
    var lo = d.min, hi = d.max, x = function (v) { return m.l + (v - lo) / (hi - lo) * iw; };
    var nt = d.ticks || 3; for (var k = 0; k <= nt; k++) { var v = lo + (hi - lo) * k / nt, xx = x(v); el("line", { x1: xx, x2: xx, y1: m.t, y2: H - m.b, stroke: GRID }, svg); txt(svg, xx, H - 8, (Math.round(v * 100) / 100 + "").replace(".", ","), { "text-anchor": "middle" }); }
    var t = tip(fig);
    d.rows.forEach(function (r, i) {
      var cy = m.t + i * rowH + rowH / 2;
      txt(svg, m.l - 12, cy + 4, r.label, { "text-anchor": "end", fill: INK, "font-family": "Instrument Sans, sans-serif", "font-size": 13 });
      el("line", { x1: x(r.a), x2: x(r.b), y1: cy, y2: cy, stroke: MUTE, "stroke-width": 2 }, svg);
      el("circle", { cx: x(r.a), cy: cy, r: 6, fill: A, stroke: "#070b10", "stroke-width": 2 }, svg);
      el("circle", { cx: x(r.b), cy: cy, r: 6, fill: B, stroke: "#070b10", "stroke-width": 2 }, svg);
      var best = Math.max(r.a, r.b); txt(svg, x(best) + 12, cy + 4, fmt(best, d.unit), { fill: INK });
      var h = el("rect", { x: 0, y: cy - rowH / 2, width: W, height: rowH, fill: "transparent" }, svg);
      h.addEventListener("pointermove", function (e) { place(t, fig, e, "<b>" + r.label + "</b>" + '<span><i style="background:' + A + '"></i>' + d.names[0] + " : " + fmt(r.a, d.unit) + "</span>" + '<span><i style="background:' + B + '"></i>' + d.names[1] + " : " + fmt(r.b, d.unit) + "</span>"); });
      h.addEventListener("pointerleave", function () { t.hidden = true; });
    });
    legend(fig, [[d.names[0], A], [d.names[1], B]]);
  }

  function hbar(fig, d) {
    var rowH = 30, W = 640, m = { l: 230, r: 90, t: 6, b: 6 }, H = m.t + d.rows.length * rowH + m.b, iw = W - m.l - m.r;
    var max = Math.max.apply(null, d.rows.map(function (r) { return r[1]; }));
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": d.aria || "" }, fig), t = tip(fig);
    d.rows.forEach(function (r, i) {
      var y0 = m.t + i * rowH, w = r[1] / max * iw;
      txt(svg, m.l - 12, y0 + rowH / 2 + 4, r[0], { "text-anchor": "end", fill: INK, "font-family": "Instrument Sans, sans-serif", "font-size": 13 });
      el("rect", { x: m.l, y: y0 + 7, width: Math.max(2, w), height: rowH - 14, rx: 3, fill: ONE }, svg);
      txt(svg, m.l + w + 8, y0 + rowH / 2 + 4, fmt(r[1], d.unit), { fill: INK });
      var h = el("rect", { x: 0, y: y0, width: W, height: rowH, fill: "transparent" }, svg);
      h.addEventListener("pointermove", function (e) { place(t, fig, e, "<b>" + r[0] + "</b><span>" + fmt(r[1], d.unit) + "</span>"); });
      h.addEventListener("pointerleave", function () { t.hidden = true; });
    });
  }

  var css = ".chart{position:relative;margin:0;border:1px solid #1c2a36;background:#070b10;padding:14px 14px 8px}" +
    ".chart svg{display:block;width:100%;height:auto;overflow:visible}" +
    ".ch-legend{display:flex;gap:16px;flex-wrap:wrap;font:500 11.5px 'JetBrains Mono',monospace;color:#c4d2e0;margin-bottom:8px}" +
    ".ch-legend i,.ch-tip i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:6px;vertical-align:-1px}" +
    ".ch-tip[hidden]{display:none}.ch-tip{position:absolute;z-index:3;pointer-events:none;background:#0c1219;border:1px solid #2c4a55;padding:7px 10px;font:500 11.5px 'JetBrains Mono',monospace;color:#d7e3ee;display:grid;gap:3px;white-space:nowrap}" +
    ".chart figcaption{font:400 12px 'JetBrains Mono',monospace;color:#8aa0b3;margin-top:8px}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  document.querySelectorAll("figure.chart[data-chart]").forEach(function (fig) {
    try {
      var d = JSON.parse(fig.getAttribute("data-chart")), cap = fig.querySelector("figcaption");
      ({ line: line, dumbbell: dumbbell, hbar: hbar })[d.type](fig, d);
      if (cap) fig.appendChild(cap);
    } catch (e) { /* le tableau de la page reste disponible */ }
  });
})();
