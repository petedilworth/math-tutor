/* Chalk and Paper – drawn graphs
   A graph is stored as a short text spec, never as a picture, so saved lessons stay small:
     "p:c0,c1,c2,…"  polynomial c0 + c1·x + c2·x² + …
     "s:a,k"  a·sin(kx)      "c:a,k"  a·cos(kx)      "e:a,k,b"  a·e^(kx) + b
   Generators write <span class="gph" data-g="spec" data-w="xmin,xmax"></span> into question text;
   CP.graph.hydrate() swaps each one for an SVG drawing when it reaches the screen. */

window.CP = window.CP || {};
(function () {
function parse(spec) {
  const [t, rest] = String(spec).split(":");
  return { t, v: (rest || "").split(",").filter(s => s !== "").map(Number) };
}
function ev(spec, x) {
  const s = typeof spec === "string" ? parse(spec) : spec, v = s.v;
  if (s.t === "p") return v.reduce((acc, c, i) => acc + c * Math.pow(x, i), 0);
  if (s.t === "s") return v[0] * Math.sin(v[1] * x);
  if (s.t === "c") return v[0] * Math.cos(v[1] * x);
  if (s.t === "e") return v[0] * Math.exp(v[1] * x) + (v[2] || 0);
  return NaN;
}
const fmt = n => String(+n.toFixed(6));
function deriv(spec) {
  const s = typeof spec === "string" ? parse(spec) : spec, v = s.v;
  if (s.t === "p") { const d = v.slice(1).map((c, i) => c * (i + 1)); return "p:" + (d.length ? d : [0]).map(fmt).join(","); }
  if (s.t === "s") return "c:" + fmt(v[0] * v[1]) + "," + fmt(v[1]);
  if (s.t === "c") return "s:" + fmt(-v[0] * v[1]) + "," + fmt(v[1]);
  if (s.t === "e") return "e:" + fmt(v[0] * v[1]) + "," + fmt(v[1]) + ",0";
  return spec;
}
const poly = c => "p:" + c.map(fmt).join(",");
const fn = spec => x => ev(spec, x);

/* ---- drawing ---- */
const TRIG = w => Math.abs(w[1] - w[0]) > 9;
function svg(spec, w, opts) {
  opts = opts || {};
  const big = !!opts.big, W = big ? 320 : 160, Hh = big ? 180 : 104, pad = big ? 18 : 8;
  const [x0, x1] = w, N = 160, pts = [];
  let lo = 0, hi = 0;
  for (let i = 0; i <= N; i++) { const x = x0 + (x1 - x0) * i / N, y = ev(spec, x); pts.push([x, y]); if (isFinite(y)) { lo = Math.min(lo, y); hi = Math.max(hi, y); } }
  if (opts.y) { lo = opts.y[0]; hi = opts.y[1]; }
  if (hi - lo < 1e-9) { hi += 1; lo -= 1; }
  const span = hi - lo; lo -= span * 0.1; hi += span * 0.1;
  const X = x => pad + (x - x0) / (x1 - x0) * (W - 2 * pad), Y = y => pad + (hi - y) / (hi - lo) * (Hh - 2 * pad);
  let g = "";
  /* grid at integers, or at multiples of π/2 for trig windows */
  const step = TRIG(w) ? Math.PI / 2 : 1;
  for (let k = Math.ceil(x0 / step); k * step <= x1 + 1e-9; k++) {
    const x = k * step;
    g += '<line class="gr" x1="' + X(x).toFixed(1) + '" y1="' + pad + '" x2="' + X(x).toFixed(1) + '" y2="' + (Hh - pad) + '"/>';
    if (big && k !== 0) {
      const lab = TRIG(w) ? (k % 2 === 0 ? (k / 2 === 1 ? "π" : k / 2 === -1 ? "−π" : String(k / 2).replace("-", "−") + "π") : "") : String(k).replace("-", "−");
      if (lab) g += '<text class="tk" x="' + X(x).toFixed(1) + '" y="' + Math.min(Hh - 3, Y(0) + 13).toFixed(1) + '" text-anchor="middle">' + lab + '</text>';
    }
  }
  if (lo < 0 && hi > 0) g += '<line class="ax" x1="' + pad + '" y1="' + Y(0).toFixed(1) + '" x2="' + (W - pad) + '" y2="' + Y(0).toFixed(1) + '"/>';
  if (x0 < 0 && x1 > 0) g += '<line class="ax" x1="' + X(0).toFixed(1) + '" y1="' + pad + '" x2="' + X(0).toFixed(1) + '" y2="' + (Hh - pad) + '"/>';
  let d = "", pen = false;
  for (const [x, y] of pts) {
    if (!isFinite(y) || y > hi + span * 3 || y < lo - span * 3) { pen = false; continue; }
    const yy = Math.max(-Hh, Math.min(2 * Hh, Y(y)));
    d += (pen ? "L" : "M") + X(x).toFixed(1) + " " + yy.toFixed(1); pen = true;
  }
  g += '<path class="crv" d="' + d + '"/>';
  for (const m of (opts.marks || [])) g += '<circle class="mk" cx="' + X(m).toFixed(1) + '" cy="' + Y(ev(spec, m)).toFixed(1) + '" r="3"/>';
  return '<svg viewBox="0 0 ' + W + " " + Hh + '" role="img" aria-label="graph" preserveAspectRatio="xMidYMid meet"><defs><clipPath id="cl' + (svg.n = (svg.n || 0) + 1) + '"><rect x="0" y="0" width="' + W + '" height="' + Hh + '"/></clipPath></defs><g clip-path="url(#cl' + svg.n + ')">' + g + '</g></svg>';
}
/* the html a generator writes */
function tag(spec, w, opts) {
  opts = opts || {};
  return '<span class="gph' + (opts.big ? " big" : "") + '" data-g="' + spec + '" data-w="' + w.join(",") + '"' + (opts.marks ? ' data-m="' + opts.marks.join(",") + '"' : "") + '></span>';
}
function hydrate(root) {
  (root || document).querySelectorAll(".gph:not([data-done])").forEach(el => {
    const w = el.dataset.w.split(",").map(Number), marks = el.dataset.m ? el.dataset.m.split(",").map(Number) : null;
    el.innerHTML = svg(el.dataset.g, w, { big: el.classList.contains("big"), marks });
    el.dataset.done = "1";
  });
}
/* A curve's "shape" for checking: the sign of the values at many points, skipping points too close to zero to read.
   Two graphs that agree on every readable sign look alike on an auto-scaled plot; distractors must differ somewhere. */
function signs(f, w) {
  const xs = [], n = 97; for (let i = 1; i < n; i++) xs.push(w[0] + (w[1] - w[0]) * i / n);
  const ys = xs.map(f), m = Math.max(1e-12, ...ys.map(Math.abs));
  return ys.map(y => Math.abs(y) < 0.04 * m ? 0 : Math.sign(y));
}
function sameShape(f, g, w) {
  const a = signs(f, w), b = signs(g, w);
  return a.every((s, i) => s === 0 || b[i] === 0 || s === b[i]);
}
CP.graph = { parse, ev, deriv, poly, fn, svg, tag, hydrate, signs, sameShape };
})();
