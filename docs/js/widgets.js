/* Chalk and Paper – interactive pictures for the full lessons.
   CP.W.mount(el, cfg, onChange) draws one widget into el and calls onChange(state) whenever it moves.
   Every widget is plain SVG, works with a finger or a mouse, and has sliders as well as dragging.
   Types: tracer, limit, blocks, area, chain, motion, optim, sign, vec2, vec3. See docs/README.md for each config. */

window.CP = window.CP || {};
(function () {
const NS = "http://www.w3.org/2000/svg";
const M = x => String(x).replace(/-/g, "−");
function fmt(x, d) {
  if (x == null || !isFinite(x)) return "undefined";
  d = d == null ? 2 : d;
  let s = (+x).toFixed(d);
  if (s.indexOf(".") >= 0) s = s.replace(/0+$/, "").replace(/\.$/, "");
  if (s === "-0") s = "0";
  return M(s);
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const PI = Math.PI;
function piLabel(x) {
  const q = x / (PI / 4), r = Math.round(q);
  if (Math.abs(q - r) > 1e-6) return null;
  if (r === 0) return "0";
  const n = r, g = (a, b) => b ? g(b, a % b) : a, k = g(Math.abs(n), 4), num = n / k, den = 4 / k;
  const top = (num === 1 ? "" : num === -1 ? "−" : M(num)) + "π";
  return den === 1 ? top : top + "/" + den;
}
const fx = (x, ticks) => { if (ticks === "pi") { const p = piLabel(x); return fmt(x, 2) + (p && p !== "0" && p !== fmt(x, 2) ? " (" + p + ")" : ""); } return fmt(x, 2); };
function numD(f, x, p) { const h = 1e-4; return (f(x + h, p) - f(x - h, p)) / (2 * h); }
function numD2(f, x, p, hh) { const h = hh || 1e-3; return (f(x + h, p) - 2 * f(x, p) + f(x - h, p)) / (h * h); }
function autoRange(f, x0, x1, p, pad) {
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i <= 200; i++) { const y = f(x0 + (x1 - x0) * i / 200, p); if (isFinite(y)) { lo = Math.min(lo, y); hi = Math.max(hi, y); } }
  if (!isFinite(lo)) return [-1, 1];
  if (hi - lo < 1e-6 * Math.max(1, Math.abs(hi), Math.abs(lo))) { const c = (hi + lo) / 2; lo = c - Math.max(1, Math.abs(c) * 0.5); hi = c + Math.max(1, Math.abs(c) * 0.5); }
  const m = (hi - lo) * (pad == null ? 0.12 : pad); return [lo - m, hi + m];
}
/* a niceish tick step for a range */
function niceStep(span, want) { const raw = span / (want || 6), p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }

/* ---------- small DOM helpers ---------- */
function h(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
function svgEl(w, hgt, cls) { const s = document.createElementNS(NS, "svg"); s.setAttribute("viewBox", "0 0 " + w + " " + hgt); s.setAttribute("class", "wsvg " + (cls || "")); s.setAttribute("role", "img"); return s; }
function slider(label, min, max, step, val, onInput, show) {
  const wrap = h("label", "wsl");
  const lab = h("span", "wsl-l", label), out = h("span", "wsl-v", show ? show(val) : fmt(val, 3));
  const r = document.createElement("input"); r.type = "range"; r.min = min; r.max = max; r.step = step; r.value = val;
  r.oninput = () => { const v = +r.value; out.innerHTML = show ? show(v) : fmt(v, 3); onInput(v); };
  wrap.append(lab, r, out);
  wrap.set = v => { r.value = v; out.innerHTML = show ? show(+r.value) : fmt(+r.value, 3); };
  return wrap;
}
function btn(label, onClick, cls) { const b = h("button", "wbtn" + (cls ? " " + cls : ""), label); b.type = "button"; b.onclick = onClick; return b; }
function readouts(box, list) { box.innerHTML = list.filter(Boolean).map(r => '<span class="wro"><i>' + r[0] + '</i><b>' + r[1] + '</b></span>').join(""); }
/* pointer x/y inside an svg, in viewBox units */
function svgPt(svg, ev) { const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal; return [(ev.clientX - r.left) * vb.width / r.width, (ev.clientY - r.top) * vb.height / r.height]; }
function dragOn(svg, start, move, end) {
  let on = false;
  svg.addEventListener("pointerdown", e => { const ok = start(svgPt(svg, e), e); if (ok === false) return; on = true; try { svg.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); });
  svg.addEventListener("pointermove", e => { if (on) move(svgPt(svg, e), e); });
  const stop = () => { if (on) { on = false; if (end) end(); } };
  svg.addEventListener("pointerup", stop); svg.addEventListener("pointercancel", stop);
}
/* a plotting frame: maps data to viewBox units */
function frame(x0, y0, w, hgt, xr, yr) {
  const sx = x => x0 + (x - xr[0]) / (xr[1] - xr[0]) * w, sy = y => y0 + hgt - (y - yr[0]) / (yr[1] - yr[0]) * hgt;
  const ix = px => xr[0] + (px - x0) / w * (xr[1] - xr[0]);
  return { x0, y0, w, h: hgt, xr, yr, sx, sy, ix };
}
function pathOf(F, f, p, x0, x1, n) {
  n = n || 240; let d = "", pen = false, prev = null;
  const yspan = F.yr[1] - F.yr[0];
  for (let i = 0; i <= n; i++) {
    const x = x0 + (x1 - x0) * i / n, y = f(x, p);
    if (!isFinite(y) || Math.abs(y - (F.yr[0] + F.yr[1]) / 2) > yspan * 4 || (prev != null && Math.abs(y - prev) > yspan * 1.5)) { pen = false; prev = isFinite(y) ? y : null; continue; }
    const Y = clamp(F.sy(y), F.y0 - 40, F.y0 + F.h + 40);
    d += (pen ? "L" : "M") + F.sx(x).toFixed(1) + " " + Y.toFixed(1); pen = true; prev = y;
  }
  return d;
}
function axes(F, ticks, opt) {
  opt = opt || {};
  let s = '<rect x="' + F.x0 + '" y="' + F.y0 + '" width="' + F.w + '" height="' + F.h + '" class="wbg"/>';
  const [a, b] = F.xr, [c, d] = F.yr;
  /* vertical grid */
  if (ticks === "pi") {
    for (let k = Math.ceil(a / (PI / 2)); k * PI / 2 <= b + 1e-9; k++) { const x = k * PI / 2, X = F.sx(x); s += '<line x1="' + X + '" x2="' + X + '" y1="' + F.y0 + '" y2="' + (F.y0 + F.h) + '" class="wgrid"/>'; if (k && !opt.noXLabels) s += '<text x="' + X + '" y="' + (F.y0 + F.h + 11) + '" class="wtick" text-anchor="middle">' + piLabel(x) + '</text>'; }
  } else {
    const st = typeof ticks === "number" ? ticks : niceStep(b - a);
    for (let x = Math.ceil(a / st) * st; x <= b + 1e-9; x += st) { const X = F.sx(x); s += '<line x1="' + X + '" x2="' + X + '" y1="' + F.y0 + '" y2="' + (F.y0 + F.h) + '" class="wgrid"/>'; if (Math.abs(x) > st / 2 && !opt.noXLabels) s += '<text x="' + X + '" y="' + (F.y0 + F.h + 11) + '" class="wtick" text-anchor="middle">' + fmt(x, 2) + '</text>'; }
  }
  const ys = opt.ystep || niceStep(d - c, opt.ywant || 4);
  for (let y = Math.ceil(c / ys) * ys; y <= d + 1e-9; y += ys) { const Y = F.sy(y); s += '<line x1="' + F.x0 + '" x2="' + (F.x0 + F.w) + '" y1="' + Y + '" y2="' + Y + '" class="wgrid"/>'; if (Math.abs(y) > ys / 2) s += '<text x="' + (F.x0 - 4) + '" y="' + (Y + 3) + '" class="wtick" text-anchor="end">' + fmt(y, 2) + '</text>'; }
  if (c <= 0 && d >= 0) s += '<line x1="' + F.x0 + '" x2="' + (F.x0 + F.w) + '" y1="' + F.sy(0) + '" y2="' + F.sy(0) + '" class="waxis"/>';
  if (a <= 0 && b >= 0) s += '<line x1="' + F.sx(0) + '" x2="' + F.sx(0) + '" y1="' + F.y0 + '" y2="' + (F.y0 + F.h) + '" class="waxis"/>';
  return s;
}
const clipId = (() => { let n = 0; return () => "wc" + (++n); })();
function clipRect(F) { const id = clipId(); return { id, def: '<clipPath id="' + id + '"><rect x="' + F.x0 + '" y="' + F.y0 + '" width="' + F.w + '" height="' + F.h + '"/></clipPath>' }; }
const dot = (X, Y, cls, r) => '<circle cx="' + X.toFixed(1) + '" cy="' + Y.toFixed(1) + '" r="' + (r || 4.5) + '" class="' + cls + '"/>';
const ln = (a, b, c, d, cls) => '<line x1="' + a.toFixed(1) + '" y1="' + b.toFixed(1) + '" x2="' + c.toFixed(1) + '" y2="' + d.toFixed(1) + '" class="' + cls + '"/>';
/* SVG text cannot hold <sup>, so raise those parts with tspans */
const supT = s => String(s).replace(/<sup>(.*?)<\/sup>/g, '<tspan dy="-4" font-size="75%">$1</tspan><tspan dy="4">\u200b</tspan>');
const tx = (X, Y, s, cls, anchor) => '<text x="' + X.toFixed(1) + '" y="' + Y.toFixed(1) + '" class="' + (cls || "wlab") + '"' + (anchor ? ' text-anchor="' + anchor + '"' : "") + '>' + supT(s) + '</text>';
function arrow(X1, Y1, X2, Y2, cls, head) {
  head = head || 8; const a = Math.atan2(Y2 - Y1, X2 - X1), L = Math.hypot(X2 - X1, Y2 - Y1);
  if (L < 0.5) return "";
  const hl = Math.min(head, L * 0.45), b1 = a + 2.7, b2 = a - 2.7;
  return '<line x1="' + X1.toFixed(1) + '" y1="' + Y1.toFixed(1) + '" x2="' + (X2 - Math.cos(a) * hl * 0.6).toFixed(1) + '" y2="' + (Y2 - Math.sin(a) * hl * 0.6).toFixed(1) + '" class="' + cls + '"/>' +
    '<path d="M' + X2.toFixed(1) + ' ' + Y2.toFixed(1) + 'L' + (X2 + Math.cos(b1) * hl).toFixed(1) + ' ' + (Y2 + Math.sin(b1) * hl).toFixed(1) + 'L' + (X2 + Math.cos(b2) * hl).toFixed(1) + ' ' + (Y2 + Math.sin(b2) * hl).toFixed(1) + 'Z" class="' + cls.replace(/\bs(\d)/, "f$1") + ' whead"/>';
}
/* a label that stays inside a picture W wide */
const lbl = (X, Y, s, cls, W) => X > (W || 320) - 46 ? tx(X - 12, Y, s, cls, "end") : tx(X, Y, s, cls);
function shell(el, cfg) {
  const box = h("div", "wg wg-" + cfg.type);
  if (cfg.title) box.append(h("p", "wg-t", cfg.title));
  el.append(box); return box;
}

/* ================= what each widget reports =================
   Pure functions, so tools/check-lessons.js can prove every "try this" challenge can be met. */
const SIGN_STEPS = ["Start with f′ and f″.", "Where is f′ zero? Those are the flat points.", "Sign of f′ on each piece: rising or falling.", "Where is f″ zero? Candidates for inflection.", "Sign of f″: cupped up or cupped down.", "Now draw it."];
const bearingVec = (b, d) => [d * Math.sin(b * PI / 180), d * Math.cos(b * PI / 180)];
const bearingOf = a => { let b = Math.atan2(a[0], a[1]) * 180 / PI; if (b < 0) b += 360; return b; };
const optBest = cfg => {
  if (cfg._best) return cfg._best;
  const xr = cfg.x, sign = cfg.min ? -1 : 1; let xb = xr[0], vb = cfg.obj(xr[0]);
  for (let i = 0; i <= 4000; i++) { const t = xr[0] + (xr[1] - xr[0]) * i / 4000, val = cfg.obj(t); if (isFinite(val) && (!isFinite(vb) || sign * val > sign * vb)) { vb = val; xb = t; } }
  Object.defineProperty(cfg, "_best", { value: [xb, vb], enumerable: false }); return cfg._best;
};
const ST = {
  tracer(cfg, o) {
    const f = cfg.f, df = cfg.df || ((x, p) => numD(f, x, p)), x = o.x, p = o.p;
    const y = f(x, p), m = df(x, p);
    const s = { x, y, m, p, h: o.h, covered: Math.min(1, o.covered || 0), ghost: !!o.ghost, d2: numD2(f, x, p) };
    if (cfg.secant) s.ms = (f(x + o.h, p) - y) / o.h;
    return s;
  },
  limit(cfg, k) { const hh = Math.pow(10, -k), f = cfg.f, a = cfg.a; return { h: hh, k, left: f(a - hh), right: f(a + hh), at: f(a) }; },
  blocks(cfg, mode, m, n) { return { mode, m, n, e: mode === "mul" ? m + n : mode === "div" ? m - n : m * n }; },
  area(cfg, x, dx) {
    const u = cfg.u, v = cfg.v, du = cfg.du || (t => numD(u, t)), dv = cfg.dv || (t => numD(v, t));
    const U = u(x), Vv = v(x), U2 = u(x + dx), V2 = v(x + dx);
    return { x, dx, u: U, v: Vv, du: U2 - U, dv: V2 - Vv, grow: U2 * V2 - U * Vv, strips: U * (V2 - Vv) + Vv * (U2 - U), corner: (U2 - U) * (V2 - Vv), rule: du(x) * Vv + U * dv(x) };
  },
  chain(cfg, x, dx) {
    const g = cfg.inner, f = cfg.outer, dg = cfg.dinner || (t => numD(g, t)), df = cfg.douter || (u => numD(f, u));
    const u0 = g(x), u1 = g(x + dx), y0 = f(u0), y1 = f(u1);
    return { x, dx, u: u0, du: u1 - u0, y: y0, dy: y1 - y0, gx: dg(x), fu: df(u0), ratio: (y1 - y0) / dx, rule: dg(x) * df(u0) };
  },
  motion(cfg, t) { const s = cfg.s, v = cfg.v || (q => numD(s, q)), a = cfg.a || (cfg.v ? (q => numD(cfg.v, q)) : (q => +numD2(s, q, undefined, 1e-2).toPrecision(6))); return { t, s: s(t), v: v(t), a: a(t), speeding: v(t) * a(t) > 0 }; },
  optim(cfg, x, best) { const val = cfg.obj(x), [xb, vb] = optBest(cfg); return { x, val, best: best ? best[0] : null, bestVal: best ? best[1] : null, xBest: xb, vBest: vb, atBest: Math.abs(x - xb) <= (cfg.x[1] - cfg.x[0]) * 0.02 }; },
  sign(cfg, step) { const c = cfg.c, xr = cfg.x || [-4, 4], d1 = pDer(c); return { step, last: step === SIGN_STEPS.length - 1, crit: roots(d1, xr[0], xr[1]), infl: roots(pDer(d1), xr[0], xr[1]) }; },
  vec2(cfg, u, v, k, t, legs) {
    const mode = cfg.mode || "add", o = { mode, u: u.slice(), v: v.slice(), k, t };
    o.dot = V.dot(u, v); o.nu = V.norm(u); o.nv = V.norm(v);
    o.angle = o.nu && o.nv ? Math.acos(clamp(o.dot / (o.nu * o.nv), -1, 1)) * 180 / PI : NaN;
    o.sum = V.add(u, v); o.diff = V.sub(u, v); o.ku = V.scale(u, k);
    o.dir = Math.atan2(u[1], u[0]) * 180 / PI;
    if (mode === "bearing") { const r = legs.reduce((s, l) => V.add(s, bearingVec(l[0], l[1])), [0, 0]); o.res = r; o.resD = V.norm(r); o.resB = bearingOf(r); o.legs = legs.map(l => l.slice()); }
    if (mode === "line") { o.pt = V.add(u, V.scale(v, t)); o.n = [v[1], -v[0]]; o.c = -V.dot(o.n, u); }
    return o;
  },
  vec3(cfg, p, yaw, pitch) { return Object.assign({ yaw, pitch }, p); }
};
/* every state a widget can reach, sampled: used by the lesson checker */
function* sample(cfg) {
  const grid = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => a + (b - a) * i / n);
  const t = cfg.type;
  if (t === "tracer") {
    const xr = cfg.x || [-5, 5], ps = cfg.param ? grid(cfg.param.min, cfg.param.max, Math.min(2000, Math.round((cfg.param.max - cfg.param.min) / (cfg.param.step || 0.01)))) : [undefined];
    const hs = cfg.secant ? grid(cfg.secant.min != null ? cfg.secant.min : 0.01, cfg.secant.max || 2, 40) : [0];
    for (const p of ps) for (const x of grid(xr[0], xr[1], ps.length > 1 ? 60 : 1200)) for (const hh of hs) for (const g of [false, true]) yield ST.tracer(cfg, { x, p, h: hh, covered: 1, ghost: g });
    if (ps.length > 1) for (const p of ps) yield ST.tracer(cfg, { x: cfg.x0 != null ? cfg.x0 : (xr[0] + xr[1]) / 2, p, h: hs[0], covered: 1, ghost: true });
  } else if (t === "limit") { for (const k of grid(0, cfg.kmax || 4, 80)) yield ST.limit(cfg, k); }
  else if (t === "blocks") { for (const md of (cfg.modes || ["mul", "div", "pow"])) for (let m = 0; m <= (cfg.max || 6); m++) for (let n = 0; n <= (cfg.max || 6); n++) yield ST.blocks(cfg, md, m, n); }
  else if (t === "area") { const xr = cfg.x || [0.5, 3]; for (const x of grid(xr[0], xr[1], 120)) for (const dx of grid(0.01, cfg.dxmax || 0.8, 40)) yield ST.area(cfg, x, dx); }
  else if (t === "chain") { const xr = cfg.x || [0, 3]; for (const x of grid(xr[0], xr[1], 150)) for (const dx of grid(0.001, cfg.dxmax || 0.5, 60)) yield ST.chain(cfg, x, dx); }
  else if (t === "motion") { const tr = cfg.t || [0, 5]; for (const q of grid(tr[0], tr[1], 400)) yield ST.motion(cfg, q); }
  else if (t === "optim") { for (const x of grid(cfg.x[0], cfg.x[1], 400)) yield ST.optim(cfg, x, [x, cfg.obj(x)]); }
  else if (t === "sign") { for (let k = 0; k < SIGN_STEPS.length; k++) yield ST.sign(cfg, k); }
  else if (t === "vec2") {
    const R = cfg.range || 6, sn = cfg.snap == null ? 0.5 : cfg.snap || 0.5, mode = cfg.mode || "add";
    const vals = grid(-R, R, Math.round(2 * R / sn)), u0 = cfg.u || [3, 1], v0 = cfg.v || [1, 3];
    const ks = mode === "scale" ? grid(cfg.kmin != null ? cfg.kmin : -3, cfg.kmax || 3, 60) : [cfg.k != null ? cfg.k : 2];
    const ts = mode === "line" ? grid(cfg.tmin != null ? cfg.tmin : -3, cfg.tmax || 3, 120) : [cfg.t0 != null ? cfg.t0 : 1];
    if (mode === "bearing") {
      const legs = (cfg.legs || [[60, 5], [150, 3]]);
      const bs = grid(0, 359, 359), ds = grid(0, cfg.dmax || 6, 30);
      /* one leg at a time, then both together on a coarse grid */
      for (let i = 0; i < legs.length; i++) for (const b of bs) for (const d of ds) { const L2 = legs.map(l => l.slice()); L2[i] = [b, d]; yield ST.vec2(cfg, u0, v0, 0, 0, L2); }
      if (legs.length === 2) for (const b1 of grid(0, 355, 71)) for (const b2 of grid(0, 355, 71)) for (const d1 of grid(0, cfg.dmax || 6, 6)) for (const d2 of grid(0, cfg.dmax || 6, 6)) yield ST.vec2(cfg, u0, v0, 0, 0, [[b1, d1], [b2, d2]]);
      return;
    }
    const pts = []; for (const a of vals) for (const b of vals) pts.push([a, b]);
    /* move one vector at a time, from the starting picture */
    for (const q of pts) for (const k of ks) for (const tt of ts) { yield ST.vec2(cfg, q, v0, k, tt, []); yield ST.vec2(cfg, u0, q, k, tt, []); }
    /* and a sweep of both */
    for (let i = 0; i < 40000; i++) { const a = pts[(i * 7919) % pts.length], b = pts[(i * 104729 + 13) % pts.length]; yield ST.vec2(cfg, a, b, ks[i % ks.length], ts[i % ts.length], []); }
  } else if (t === "vec3") {
    const ps = cfg.params || [];
    const axes = ps.map(q => grid(q.min, q.max, ps.length > 2 ? 12 : ps.length === 2 ? 40 : 400));
    const rec = function* (i, acc) { if (i === ps.length) { yield ST.vec3(cfg, Object.assign({}, acc), 0, 0); return; } for (const v of axes[i]) { acc[ps[i].name] = v; yield* rec(i + 1, acc); } };
    yield* rec(0, {});
  }
}

/* ================= tracer: drag along a curve, watch the slope ================= */
function tracer(el, cfg, emit) {
  const box = shell(el, cfg);
  const f = cfg.f, df = cfg.df || ((x, p) => numD(f, x, p));
  const xr = cfg.x || [-5, 5], ticks = cfg.ticks;
  let p = cfg.param ? cfg.param.val : undefined;
  let x = cfg.x0 != null ? cfg.x0 : (xr[0] + xr[1]) / 2, hsec = cfg.secant ? (cfg.secant.h0 || 1) : 0, ghost = !!cfg.ghostOn;
  const panel2 = cfg.panel2 !== false, W = 340, H1 = 190, H2 = panel2 ? 120 : 0, GAP = panel2 ? 26 : 0, H = 14 + H1 + GAP + H2 + 18;
  const svg = svgEl(W, H, "wdrag"); svg.setAttribute("tabindex", "0"); svg.setAttribute("aria-label", (cfg.label || "graph") + ". Drag sideways or use the arrow keys.");
  box.append(svg);
  const ro = h("div", "wros"); box.append(ro);
  const ctr = h("div", "wctl"); box.append(ctr);
  const seen = new Map(); /* traced slopes, keyed by pixel column */
  const span = xr[1] - xr[0];
  let yr, dyr;
  function ranges() {
    yr = cfg.y ? cfg.y.slice() : autoRange(f, xr[0], xr[1], p);
    dyr = cfg.dy ? cfg.dy.slice() : autoRange(df, xr[0], xr[1], p);
  }
  ranges();
  let playing = null;
  const state = () => ST.tracer(cfg, { x, p, h: hsec, covered: seen.size / 120, ghost });
  function draw() {
    const F = frame(30, 14, W - 40, H1, xr, yr);
    const c1 = clipRect(F);
    let s = '<defs>' + c1.def;
    let G;
    if (panel2) { G = frame(30, 14 + H1 + GAP, W - 40, H2, xr, dyr); var c2 = clipRect(G); s += c2.def; }
    s += '</defs>' + axes(F, ticks, { ywant: 4 });
    s += '<g clip-path="url(#' + c1.id + ')">';
    if (cfg.extra) for (const e of cfg.extra) s += '<path d="' + pathOf(F, e.f, p, xr[0], xr[1]) + '" class="wcurve ' + (e.cls || "s5") + '"/>';
    s += '<path d="' + pathOf(F, f, p, xr[0], xr[1]) + '" class="wcurve s1"/>';
    const y = f(x, p), m = df(x, p);
    if (isFinite(y)) {
      if (cfg.secant) {
        const x2 = x + hsec, y2 = f(x2, p), ms = (y2 - y) / hsec;
        s += ln(F.sx(xr[0]), F.sy(y + ms * (xr[0] - x)), F.sx(xr[1]), F.sy(y + ms * (xr[1] - x)), "wtan s3");
        if (isFinite(y2)) s += ln(F.sx(x), F.sy(y), F.sx(x2), F.sy(y), "wguide") + ln(F.sx(x2), F.sy(y), F.sx(x2), F.sy(y2), "wguide") + dot(F.sx(x2), F.sy(y2), "f3", 4);
      }
      if (cfg.tangent !== false && isFinite(m)) { const L = span * 0.22; s += ln(F.sx(x - L), F.sy(y - m * L), F.sx(x + L), F.sy(y + m * L), "wtan s2"); }
    }
    for (const mk of (cfg.marks || [])) { const my = f(mk.x, p); if (isFinite(my)) s += dot(F.sx(mk.x), F.sy(my), "wmark", 3.5) + tx(F.sx(mk.x), F.sy(my) - 8, mk.label, "wlab sm", "middle"); }
    s += '</g>';
    if (isFinite(y)) s += dot(F.sx(x), F.sy(clamp(y, yr[0], yr[1])), "f1 wknob", 6);
    s += tx(F.x0 + 6, F.y0 + 14, cfg.label || "", "wlab s1t");
    if (panel2) {
      s += axes(G, ticks, { ywant: 3, noXLabels: false });
      s += '<g clip-path="url(#' + c2.id + ')">';
      if (cfg.ghost && ghost) s += '<path d="' + pathOf(G, cfg.ghost, p, xr[0], xr[1]) + '" class="wcurve ' + (cfg.ghostWrong ? "s3" : "s4") + ' wghost"/>';
      const pts = Array.from(seen.entries()).sort((a, b) => a[0] - b[0]);
      for (const [, v] of pts) if (isFinite(v[1])) s += dot(G.sx(v[0]), G.sy(v[1]), "f2 wtr", 2.2);
      if (isFinite(m)) s += ln(G.sx(x), G.sy(0 > dyr[0] && 0 < dyr[1] ? 0 : dyr[0]), G.sx(x), G.sy(m), "wguide") + dot(G.sx(x), G.sy(clamp(m, dyr[0], dyr[1])), "f2", 5);
      s += '</g>' + tx(G.x0 + 6, G.y0 + 13, cfg.dlabel || "slope", "wlab s2t");
      if (cfg.ghost && ghost) s += tx(G.x0 + G.w - 6, G.y0 + 13, cfg.ghostLabel || "", "wlab " + (cfg.ghostWrong ? "s3t" : "s4t"), "end");
    }
    svg.innerHTML = s;
    const st = state();
    readouts(ro, [[cfg.xname || "x", fx(x, ticks)], [cfg.ylabel || "height", fmt(st.y, 3)], cfg.mlabel === false ? null : [cfg.mlabel || "slope", fmt(st.m, 3)],
      cfg.secant ? ["secant slope", fmt(st.ms, 4)] : null].concat((cfg.readouts || []).map(r => [r.label, r.value(st)])));
    if (!quiet) emit(st);
  }
  let quiet = false; /* a sweep should not tick "drag to here" challenges on the way past */
  function setX(nx) {
    x = clamp(nx, xr[0], xr[1]);
    if (panel2) { const col = Math.round((x - xr[0]) / span * 120); seen.set(col, [x, df(x, p)]); }
    draw();
  }
  dragOn(svg, pt => { const F = frame(30, 14, W - 40, H1, xr, yr); stop(); setX(F.ix(pt[0])); }, pt => { const F = frame(30, 14, W - 40, H1, xr, yr); setX(F.ix(pt[0])); });
  svg.addEventListener("keydown", e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); stop(); setX(x + (e.key === "ArrowRight" ? 1 : -1) * span / 100); } });
  function stop() { if (playing) { clearInterval(playing); playing = null; playB.textContent = "▶ Sweep"; quiet = false; emit(state()); } }
  const playB = btn("▶ Sweep", () => {
    if (playing) { stop(); return; }
    x = xr[0]; playB.textContent = "■ Stop"; quiet = true;
    playing = setInterval(() => { if (x >= xr[1]) { stop(); return; } setX(x + span / 120); }, 22);
  });
  if (panel2 || cfg.sweep) ctr.append(playB);
  if (cfg.ghost) { const gb = btn(ghost ? "Hide " + (cfg.ghostLabel || "") : "Show " + (cfg.ghostLabel || ""), () => { ghost = !ghost; gb.textContent = (ghost ? "Hide " : "Show ") + (cfg.ghostLabel || ""); draw(); }, "ghost"); ctr.append(gb); }
  if (panel2) ctr.append(btn("Clear trace", () => { seen.clear(); draw(); }, "ghost"));
  if (cfg.secant) ctr.append(slider("h, the gap", cfg.secant.min != null ? cfg.secant.min : 0.01, cfg.secant.max || 2, 0.01, hsec, v => { hsec = Math.max(v, 1e-3); draw(); }, v => fmt(v, 2)));
  if (cfg.param) { const P = cfg.param; ctr.append(slider(P.label || P.name, P.min, P.max, P.step || 0.01, p, v => { p = v; seen.clear(); ranges(); draw(); }, P.show)); }
  setX(x);
  return { state, stop };
}

/* ================= limit: close in on a hole ================= */
function limit(el, cfg, emit) {
  const box = shell(el, cfg);
  const f = cfg.f, a = cfg.a, xr = cfg.x || [a - 3, a + 3], yr = cfg.y || autoRange(f, xr[0], xr[1]);
  let k = 0; /* h = 10^-k */
  const W = 340, H = 220, svg = svgEl(W, H); box.append(svg);
  const ro = h("div", "wros"); box.append(ro);
  const ctr = h("div", "wctl"); box.append(ctr);
  const tbl = h("div", "wtbl"); box.append(tbl);
  const hist = [];
  const st = () => ST.limit(cfg, k);
  function draw() {
    const F = frame(30, 12, W - 40, H - 34, xr, yr), c = clipRect(F), S = st();
    let s = '<defs>' + c.def + '</defs>' + axes(F, cfg.ticks, { ywant: 4 }) + '<g clip-path="url(#' + c.id + ')">';
    s += '<path d="' + pathOf(F, (x) => (Math.abs(x - a) < 1e-9 ? NaN : f(x)), undefined, xr[0], xr[1], 400) + '" class="wcurve s1"/>';
    if (cfg.L != null && isFinite(cfg.L)) s += '<circle cx="' + F.sx(a) + '" cy="' + F.sy(cfg.L) + '" r="5" class="whole"/>';
    for (const [xx, yy] of [[a - S.h, S.left], [a + S.h, S.right]]) if (isFinite(yy)) s += ln(F.sx(xx), F.sy(0 > yr[0] && 0 < yr[1] ? 0 : yr[0]), F.sx(xx), F.sy(yy), "wguide") + ln(F.x0, F.sy(yy), F.sx(xx), F.sy(yy), "wguide") + dot(F.sx(xx), F.sy(yy), xx < a ? "f2" : "f3", 5);
    s += '</g>' + tx(F.x0 + 6, F.y0 + 14, cfg.label || "", "wlab s1t");
    svg.innerHTML = s;
    readouts(ro, [["h", fmt(S.h, 5)], ["from the left", fmt(S.left, 5)], ["from the right", fmt(S.right, 5)], ["at x = " + fmt(a, 3), isFinite(S.at) ? fmt(S.at, 4) : "undefined"]]);
    if (!hist.length || hist[hist.length - 1][0] !== S.h) { hist.push([S.h, S.left, S.right]); if (hist.length > 5) hist.shift(); }
    tbl.innerHTML = '<table><tr><th>h</th><th>f(' + M(fmt(a, 3)) + ' − h)</th><th>f(' + fmt(a, 3) + ' + h)</th></tr>' + hist.map(r => '<tr><td>' + fmt(r[0], 5) + '</td><td>' + fmt(r[1], 6) + '</td><td>' + fmt(r[2], 6) + '</td></tr>').join("") + '</table>';
    emit(S);
  }
  ctr.append(slider("How close", 0, cfg.kmax || 4, 0.05, 0, v => { k = v; draw(); }, v => "h = " + fmt(Math.pow(10, -v), 5)));
  draw();
  return { state: st };
}

/* ================= blocks: exponent laws by counting ================= */
function blocks(el, cfg, emit) {
  const box = shell(el, cfg);
  const modes = cfg.modes || ["mul", "div", "pow"], base = cfg.base || "x";
  let mode = cfg.mode || modes[0], m = cfg.m != null ? cfg.m : 3, n = cfg.n != null ? cfg.n : 2;
  const tabs = h("div", "wtabs"); box.append(tabs);
  const vis = h("div", "wblocks"); box.append(vis);
  const ro = h("div", "wros"); box.append(ro);
  const ctr = h("div", "wctl"); box.append(ctr);
  const names = { mul: "Multiply", div: "Divide", pow: "Power of a power" };
  const tabBtns = modes.map(md => { const b = btn(names[md], () => { mode = md; draw(); }, "tab"); b.dataset.m = md; tabs.append(b); return b; });
  const tile = (cls, struck) => '<span class="wtile ' + cls + (struck ? " gone" : "") + '">' + base + '</span>';
  const sup = v => '<sup>' + M(v) + '</sup>';
  const st = () => ST.blocks(cfg, mode, m, n);
  function draw() {
    tabBtns.forEach(b => b.classList.toggle("on", b.dataset.m === mode));
    const S = st(); let hh = "", res;
    if (mode === "mul") {
      hh = '<div class="wrow"><span class="wex">' + base + sup(m) + ' · ' + base + sup(n) + '</span></div><div class="wrow">' + Array(m).fill(tile("t1")).join("") + '<span class="wop">·</span>' + Array(n).fill(tile("t2")).join("") + '</div>';
      res = base + sup(m + n);
      hh += '<p class="wcount">' + m + ' + ' + n + ' = ' + (m + n) + ' ' + base + "'s in a row</p>";
    } else if (mode === "div") {
      const cancel = Math.min(m, n);
      hh = '<div class="wfrac"><div class="wrow">' + (m ? Array.from({ length: m }, (_, i) => tile("t1", i < cancel)).join("") : '<span class="wone">1</span>') + '</div><div class="wbar"></div><div class="wrow">' + (n ? Array.from({ length: n }, (_, i) => tile("t2", i < cancel)).join("") : '<span class="wone">1</span>') + '</div></div>';
      res = m === n ? "1 = " + base + sup(0) : m > n ? base + sup(m - n) : "1 ÷ " + base + sup(n - m) + " = " + base + sup(m - n);
      hh += '<p class="wcount">' + cancel + ' pair' + (cancel === 1 ? "" : "s") + ' cancel. ' + (m > n ? (m - n) + " left on top." : m < n ? (n - m) + " left on the bottom, so the exponent goes negative." : "Nothing is left: that is why " + base + "⁰ = 1.") + '</p>';
    } else {
      hh = '<div class="wrow wwrap">' + Array.from({ length: n }, () => '<span class="wgrp">' + Array(m).fill(tile("t1")).join("") + '</span>').join("") + '</div>';
      res = base + sup(m * n);
      hh += '<p class="wcount">' + n + ' group' + (n === 1 ? "" : "s") + ' of ' + m + ' = ' + (m * n) + " " + base + "'s</p>";
    }
    const lhs = mode === "mul" ? base + sup(m) + " · " + base + sup(n) : mode === "div" ? base + sup(m) + " ÷ " + base + sup(n) : "(" + base + sup(m) + ")" + sup(n);
    vis.innerHTML = hh;
    readouts(ro, [["you wrote", lhs], ["count them", res]]);
    s1.querySelector(".wsl-l").textContent = mode === "pow" ? "inside power" : mode === "div" ? "power on top" : "first power";
    s2.querySelector(".wsl-l").textContent = mode === "pow" ? "outside power" : mode === "div" ? "power below" : "second power";
    emit(S);
  }
  const s1 = slider(mode === "pow" ? "inside power" : "first power", 0, cfg.max || 6, 1, m, v => { m = v; draw(); }, v => String(v));
  const s2 = slider("second power", 0, cfg.max || 6, 1, n, v => { n = v; draw(); }, v => String(v));
  ctr.append(s1, s2);
  draw();
  return { state: st };
}

/* ================= area: the product rule as a growing rectangle ================= */
function area(el, cfg, emit) {
  const box = shell(el, cfg);
  const u = cfg.u, v = cfg.v, du = cfg.du || (x => numD(u, x)), dv = cfg.dv || (x => numD(v, x));
  const xr = cfg.x || [0.5, 3];
  let x = cfg.x0 != null ? cfg.x0 : (xr[0] + xr[1]) / 2, dx = cfg.dx0 || 0.3;
  const W = 340, H = 240, svg = svgEl(W, H); box.append(svg);
  const ro = h("div", "wros"); box.append(ro);
  const ctr = h("div", "wctl"); box.append(ctr);
  let umax = 0, vmax = 0; for (let i = 0; i <= 80; i++) { const t = xr[0] + (xr[1] + (cfg.dxmax || 0.8) - xr[0]) * i / 80; umax = Math.max(umax, u(t)); vmax = Math.max(vmax, v(t)); }
  const st = () => ST.area(cfg, x, dx);
  function draw() {
    const S = st(), ku = (W - 60) / umax, kv = (H - 40) / vmax, X0 = 40, Y0 = H - 24;
    const U = S.u * ku, V = S.v * kv, dU = S.du * ku, dV = S.dv * kv;
    let s = '<rect x="' + X0 + '" y="' + (Y0 - V) + '" width="' + U + '" height="' + V + '" class="wa0"/>';
    s += '<rect x="' + (X0 + U) + '" y="' + (Y0 - V) + '" width="' + Math.max(dU, 0) + '" height="' + V + '" class="wa1"/>';
    s += '<rect x="' + X0 + '" y="' + (Y0 - V - Math.max(dV, 0)) + '" width="' + U + '" height="' + Math.max(dV, 0) + '" class="wa2"/>';
    s += '<rect x="' + (X0 + U) + '" y="' + (Y0 - V - Math.max(dV, 0)) + '" width="' + Math.max(dU, 0) + '" height="' + Math.max(dV, 0) + '" class="wa3"/>';
    s += tx(X0 + U / 2, Y0 + 15, (cfg.ulabel || "u") + " = " + fmt(S.u, 2), "wlab s1t", "middle");
    s += '<text x="' + (X0 - 8) + '" y="' + (Y0 - V / 2) + '" class="wlab s1t" text-anchor="middle" transform="rotate(-90 ' + (X0 - 8) + ' ' + (Y0 - V / 2) + ')">' + (cfg.vlabel || "v") + ' = ' + fmt(S.v, 2) + '</text>';
    s += tx(X0 + U / 2, Y0 - V / 2 + 4, (cfg.ulabel || "u") + " × " + (cfg.vlabel || "v"), "wlab", "middle");
    if (dU > 14) s += '<text x="' + (X0 + U + dU / 2) + '" y="' + (Y0 - V / 2) + '" class="wlab sm" text-anchor="middle" transform="rotate(-90 ' + (X0 + U + dU / 2) + ' ' + (Y0 - V / 2) + ')">' + (cfg.vlabel || "v") + ' · Δ' + (cfg.ulabel || "u") + '</text>';
    if (dV > 12) s += tx(X0 + U / 2, Y0 - V - dV / 2 + 4, (cfg.ulabel || "u") + " · Δ" + (cfg.vlabel || "v"), "wlab sm", "middle");
    svg.innerHTML = s;
    readouts(ro, [["Δx", fmt(dx, 3)], ["real growth", fmt(S.grow, 4)], ["two strips", fmt(S.strips, 4)], ["corner", fmt(S.corner, 4)]]);
    emit(S);
  }
  ctr.append(slider("x", xr[0], xr[1], 0.01, x, t => { x = t; draw(); }, t => fmt(t, 2)));
  ctr.append(slider("Δx, the nudge", 0.01, cfg.dxmax || 0.8, 0.01, dx, t => { dx = t; draw(); }, t => fmt(t, 2)));
  draw();
  return { state: st };
}

/* ================= chain: a nudge passes through two machines ================= */
function chain(el, cfg, emit) {
  const box = shell(el, cfg);
  const g = cfg.inner, f = cfg.outer, dg = cfg.dinner || (x => numD(g, x)), df = cfg.douter || (u => numD(f, u));
  const xr = cfg.x || [0, 3];
  let x = cfg.x0 != null ? cfg.x0 : (xr[0] + xr[1]) / 2, dx = cfg.dx0 || 0.1;
  const W = 340, H = 210, svg = svgEl(W, H); box.append(svg);
  const ro = h("div", "wros"); box.append(ro);
  const ctr = h("div", "wctl"); box.append(ctr);
  const st = () => ST.chain(cfg, x, dx);
  function draw() {
    const S = st(), rows = [[cfg.xlabel || "x", x, x + dx, "s1"], [cfg.ulabel || "u = inside", S.u, S.u + S.du, "s2"], [cfg.ylabel || "y = outside", S.y, S.y + S.dy, "s3"]];
    let s = "";
    rows.forEach((r, i) => {
      const Y = 34 + i * 70, lo = Math.min(r[1], r[2]), hi = Math.max(r[1], r[2]), mid = (lo + hi) / 2;
      /* each line is centred on its own interval; a fixed zoom shows the stretch */
      const zoom = (W - 80) / (Math.max(Math.abs(dx), 1e-9) * Math.max(8, Math.abs(S.gx * S.fu) * 1.6, Math.abs(S.gx) * 1.6));
      const X = v => W / 2 + (v - mid) * zoom;
      s += ln(30, Y, W - 10, Y, "waxis") + tx(30, Y - 12, r[0], "wlab " + r[3] + "t");
      s += '<rect x="' + Math.max(30, X(lo)).toFixed(1) + '" y="' + (Y - 5) + '" width="' + Math.max(2, Math.min(W - 40, X(hi) - X(lo))).toFixed(1) + '" height="10" class="wband ' + r[3].replace("s", "f") + '"/>';
      s += tx(W - 10, Y - 12, "width " + fmt(hi - lo, 4), "wlab sm", "end");
      if (i < 2) s += tx(W / 2, Y + 40, "× " + fmt(i === 0 ? S.gx : S.fu, 3) + (i === 0 ? "  (inside′)" : "  (outside′)"), "wlab", "middle") + ln(W / 2 - 60, Y + 12, W / 2 - 60, Y + 54, "wguide");
    });
    svg.innerHTML = s;
    readouts(ro, [["Δy ÷ Δx", fmt(S.ratio, 4)], ["inside′ × outside′", fmt(S.rule, 4)]]);
    emit(S);
  }
  ctr.append(slider(cfg.xlabel || "x", xr[0], xr[1], 0.01, x, t => { x = t; draw(); }, t => fmt(t, 2)));
  ctr.append(slider("Δx, the nudge", 0.001, cfg.dxmax || 0.5, 0.001, dx, t => { dx = t; draw(); }, t => fmt(t, 3)));
  draw();
  return { state: st };
}

/* ================= motion: position, velocity, acceleration together ================= */
function motion(el, cfg, emit) {
  const box = shell(el, cfg);
  const s = cfg.s, v = cfg.v || (t => numD(s, t)), a = cfg.a || (cfg.v ? (t => numD(cfg.v, t)) : (t => +numD2(s, t, undefined, 1e-2).toPrecision(6)));
  const tr = cfg.t || [0, 5]; let t = cfg.t0 != null ? cfg.t0 : tr[0], playing = null;
  const W = 340, track = 46, ph = 82, H = track + 3 * (ph + 22) + 8, svg = svgEl(W, H, "wdrag"); box.append(svg);
  const ro = h("div", "wros"); box.append(ro);
  const ctr = h("div", "wctl"); box.append(ctr);
  const sr = cfg.sr || autoRange(s, tr[0], tr[1]), vr = cfg.vr || autoRange(v, tr[0], tr[1]), ar = cfg.ar || autoRange(a, tr[0], tr[1]);
  const u = cfg.units || ["m", "m/s", "m/s²"];
  const st = () => ST.motion(cfg, t);
  function frames() { return [frame(34, track + 14, W - 44, ph, tr, sr), frame(34, track + 14 + ph + 22, W - 44, ph, tr, vr), frame(34, track + 14 + 2 * (ph + 22), W - 44, ph, tr, ar)]; }
  function draw() {
    const S = st(), Fs = frames();
    /* the track */
    const T = frame(34, 8, W - 44, 20, sr, [0, 1]);
    let o = ln(T.x0, 30, T.x0 + T.w, 30, "waxis") + tx(T.x0, 22, (cfg.trackLabel || "position"), "wlab sm");
    const X = T.sx(S.s); o += dot(X, 30, "f1 wknob", 7);
    if (Math.abs(S.v) > 1e-9) o += arrow(X, 30, X + clamp(S.v / (Math.abs(vr[1] - vr[0]) || 1) * 80, -80, 80), 30, "s2 wvec", 7);
    const names = [["s(t) " + u[0], s, "s1"], ["v(t) = s′(t) " + u[1], v, "s2"], ["a(t) = v′(t) " + u[2], a, "s3"]];
    names.forEach((n, i) => {
      const F = Fs[i], c = clipRect(F);
      o += '<defs>' + c.def + '</defs>' + axes(F, cfg.ticks, { ywant: 3, noXLabels: i < 2 }) + '<g clip-path="url(#' + c.id + ')"><path d="' + pathOf(F, n[1], undefined, tr[0], tr[1]) + '" class="wcurve ' + n[2] + '"/></g>';
      o += ln(F.sx(t), F.y0, F.sx(t), F.y0 + F.h, "wguide") + dot(F.sx(t), F.sy(clamp(n[1](t), F.yr[0], F.yr[1])), n[2].replace("s", "f"), 4.5) + tx(F.x0 + 6, F.y0 + 12, n[0], "wlab " + n[2] + "t");
    });
    svg.innerHTML = o;
    readouts(ro, [["t", fmt(t, 2) + " " + (cfg.tunit || "s")], ["position", fmt(S.s, 2)], ["velocity", fmt(S.v, 2)], ["acceleration", fmt(S.a, 2)], ["speed is", Math.abs(S.v) < 1e-6 ? "zero" : S.speeding ? "rising" : Math.abs(S.a) < 1e-6 ? "steady" : "falling"]]);
    emit(S);
  }
  const sl = slider("t", tr[0], tr[1], (tr[1] - tr[0]) / 400, t, nt => { t = nt; stop(); draw(); }, nt => fmt(nt, 2));
  function stop() { if (playing) { clearInterval(playing); playing = null; pb.textContent = "▶ Play"; } }
  const pb = btn("▶ Play", () => { if (playing) { stop(); return; } if (t >= tr[1]) t = tr[0]; pb.textContent = "■ Stop"; playing = setInterval(() => { t = Math.min(tr[1], t + (tr[1] - tr[0]) / 200); sl.set(t); draw(); if (t >= tr[1]) stop(); }, 25); });
  ctr.append(pb, sl);
  dragOn(svg, pt => { const F = frames()[0]; t = clamp(F.ix(pt[0]), tr[0], tr[1]); stop(); sl.set(t); draw(); }, pt => { const F = frames()[0]; t = clamp(F.ix(pt[0]), tr[0], tr[1]); sl.set(t); draw(); });
  draw();
  return { state: st, stop };
}

/* ================= optim: change a shape, watch the quantity ================= */
function optim(el, cfg, emit) {
  const box = shell(el, cfg);
  const xr = cfg.x, obj = cfg.obj; let x = cfg.x0 != null ? cfg.x0 : (xr[0] + xr[1]) / 2;
  let best = null;
  /* the true best, found by brute force so the lesson can say when you hit it */
  const sign = cfg.min ? -1 : 1;
  const W = 340, H = 330, svg = svgEl(W, H); box.append(svg);
  const ro = h("div", "wros"); box.append(ro);
  const ctr = h("div", "wctl"); box.append(ctr);
  const yr = cfg.y || autoRange(obj, xr[0], xr[1]);
  const st = () => ST.optim(cfg, x, best);
  function draw() {
    const val = obj(x);
    if (isFinite(val) && (!best || sign * val > sign * best[1])) best = [x, val];
    let s = '<g transform="translate(70,6)">' + cfg.draw(x) + '</g>';
    const F = frame(40, 140, W - 50, 160, xr, yr), c = clipRect(F);
    s += '<defs>' + c.def + '</defs>' + axes(F, cfg.ticks, { ywant: 4 }) + '<g clip-path="url(#' + c.id + ')"><path d="' + pathOf(F, obj, undefined, xr[0], xr[1]) + '" class="wcurve s1"/>';
    if (best) s += ln(F.x0, F.sy(best[1]), F.x0 + F.w, F.sy(best[1]), "wguide");
    s += '</g>' + dot(F.sx(x), F.sy(clamp(val, yr[0], yr[1])), "f2 wknob", 6) + tx(F.x0 + 6, F.y0 + 13, cfg.objLabel || "", "wlab s1t") + tx(F.x0 + F.w, F.y0 + F.h + 22, cfg.xLabel || "x", "wlab sm", "end");
    svg.innerHTML = s;
    const S = st();
    readouts(ro, [[cfg.xLabel || "x", fmt(x, 2)], [cfg.objLabel || "value", (cfg.fmtVal || (v => fmt(v, 2)))(val)], ["best so far", best ? (cfg.fmtVal || (v => fmt(v, 2)))(best[1]) : "–"]]);
    emit(S);
  }
  ctr.append(slider(cfg.xLabel || "x", xr[0], xr[1], cfg.step || (xr[1] - xr[0]) / 400, x, t => { x = t; draw(); }, t => fmt(t, 2)));
  draw();
  return { state: st };
}

/* ================= sign: sketch a polynomial from its sign charts ================= */
function polyStr(c, v) {
  v = v || "x"; const t = [];
  for (let i = c.length - 1; i >= 0; i--) { const a = +c[i].toFixed(6); if (!a) continue; const ab = Math.abs(a), co = (ab === 1 && i ? "" : fmt(ab, 3)), pw = i === 0 ? "" : i === 1 ? v : v + "<sup>" + i + "</sup>"; t.push([a < 0 ? "−" : "+", co + pw]); }
  if (!t.length) return "0";
  return t.map((p, i) => i === 0 ? (p[0] === "−" ? "−" : "") + p[1] : " " + p[0] + " " + p[1]).join("");
}
const pEval = (c, x) => c.reduce((s, a, i) => s + a * Math.pow(x, i), 0);
const pDer = c => c.slice(1).map((a, i) => a * (i + 1));
function roots(c, a, b) {
  const r = [], N = 2000; let px = a, py = pEval(c, a);
  if (Math.abs(py) < 1e-9) r.push(a);
  for (let i = 1; i <= N; i++) {
    const x = a + (b - a) * i / N, y = pEval(c, x);
    if (Math.abs(y) < 1e-12 || py * y < 0) { let lo = px, hi = x; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (pEval(c, lo) * pEval(c, m) <= 0) hi = m; else lo = m; } const z = (lo + hi) / 2; if (!r.length || Math.abs(r[r.length - 1] - z) > (b - a) / 400) r.push(z); }
    px = x; py = y;
  }
  /* a root where the curve only touches the axis (like x² at 0) has no sign change: find it as a flat point that sits on the axis */
  const d = pDer(c);
  if (d.length > 1) {
    const scale = 1e-7 * (1 + c.reduce((m, a) => Math.max(m, Math.abs(a)), 0));
    let qx = a, qy = pEval(d, a);
    for (let i = 1; i <= N; i++) {
      const x = a + (b - a) * i / N, y = pEval(d, x);
      if (qy * y < 0 || y === 0) { let lo = qx, hi = x; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (pEval(d, lo) * pEval(d, m) <= 0) hi = m; else lo = m; } const z = (lo + hi) / 2; if (Math.abs(pEval(c, z)) < scale && !r.some(w => Math.abs(w - z) < (b - a) / 400)) r.push(z); }
      qx = x; qy = y;
    }
    r.sort((p, q) => p - q);
  }
  return r.map(z => Math.abs(z - Math.round(z)) < 1e-6 ? Math.round(z) : z);
}
function sign(el, cfg, emit) {
  const box = shell(el, cfg);
  const c = cfg.c, d1 = pDer(c), d2 = pDer(d1), xr = cfg.x || [-4, 4];
  const r1 = roots(d1, xr[0], xr[1]).filter(z => Math.abs(pEval(d2, z)) > 1e-9 || pDer(d2).length === 0 || true), r2 = roots(d2, xr[0], xr[1]);
  const steps = SIGN_STEPS;
  let step = 0;
  const top = h("p", "wstep"); box.append(top);
  const forms = h("div", "wforms"); box.append(forms);
  const W = 340, H = 300, svg = svgEl(W, H); box.append(svg);
  const ctr = h("div", "wctl"); box.append(ctr);
  const yr = cfg.y || autoRange(x => pEval(c, x), xr[0], xr[1]);
  const st = () => ST.sign(cfg, step);
  function row(Y, rts, cp, label, symP, symN, known) {
    const F = frame(30, Y, W - 40, 22, xr, [0, 1]);
    let s = ln(F.x0, Y + 11, F.x0 + F.w, Y + 11, "waxis") + tx(4, Y + 15, label, "wlab sm");
    if (!known) { for (const z of rts) s += ln(F.sx(z), Y, F.sx(z), Y + 22, "wcut") + tx(F.sx(z), Y + 34, fmt(z, 2), "wtick", "middle"); return s + tx(F.x0 + F.w / 2, Y + 15, "sign: next step", "wlab sm", "middle"); }
    const cuts = [xr[0]].concat(rts).concat([xr[1]]);
    for (let i = 0; i < cuts.length - 1; i++) {
      const m = (cuts[i] + cuts[i + 1]) / 2, v = pEval(cp, m), X = (F.sx(cuts[i]) + F.sx(cuts[i + 1])) / 2;
      s += '<rect x="' + F.sx(cuts[i]).toFixed(1) + '" y="' + (Y + 2) + '" width="' + (F.sx(cuts[i + 1]) - F.sx(cuts[i])).toFixed(1) + '" height="18" class="' + (v > 0 ? "wpos" : "wneg") + '"/>' + tx(X, Y + 15, v > 0 ? symP : symN, "wlab", "middle");
    }
    for (const z of rts) s += ln(F.sx(z), Y, F.sx(z), Y + 22, "wcut") + tx(F.sx(z), Y + 34, fmt(z, 2), "wtick", "middle");
    return s;
  }
  function draw() {
    top.innerHTML = '<b>Step ' + (step + 1) + ' of ' + steps.length + '.</b> ' + steps[step];
    forms.innerHTML = '<span>f(x) = ' + polyStr(c) + '</span><span>f′(x) = ' + polyStr(d1) + '</span><span>f″(x) = ' + polyStr(d2) + '</span>';
    const F = frame(30, 8, W - 40, 170, xr, yr), cl = clipRect(F);
    let s = '<defs>' + cl.def + '</defs>' + axes(F, cfg.ticks, { ywant: 4 });
    s += '<g clip-path="url(#' + cl.id + ')">';
    if (step >= 1) for (const z of r1) s += ln(F.sx(z), F.y0, F.sx(z), F.y0 + F.h, "wcut");
    if (step >= 3) for (const z of r2) s += ln(F.sx(z), F.y0, F.sx(z), F.y0 + F.h, "wcut s3");
    if (step >= 5) s += '<path d="' + pathOf(F, x => pEval(c, x), undefined, xr[0], xr[1]) + '" class="wcurve s1 wdrawin"/>';
    if (step >= 2) for (const z of r1) { const y = pEval(c, z); s += dot(F.sx(z), F.sy(y), "f2", 4.5); if (step >= 5) { const k = pEval(d2, z); s += tx(F.sx(z), F.sy(y) + (k < 0 ? -9 : 16), k < 0 ? "max" : k > 0 ? "min" : "flat", "wlab sm", "middle"); } }
    if (step >= 4) for (const z of r2) s += dot(F.sx(z), F.sy(pEval(c, z)), "f3", 4);
    s += '</g>';
    if (step >= 1) s += row(196, r1, d1, "f′", "↗ +", "↘ −", step >= 2);
    if (step >= 3) s += row(250, r2, d2, "f″", "∪ +", "∩ −", step >= 4);
    svg.innerHTML = s;
    nb.disabled = step === steps.length - 1;
    emit(st());
  }
  const nb = btn("Next step", () => { step = Math.min(steps.length - 1, step + 1); draw(); });
  ctr.append(nb, btn("Start over", () => { step = 0; draw(); }, "ghost"));
  draw();
  return { state: st };
}

/* ================= 2D vectors ================= */
const V = {
  add: (a, b) => a.map((x, i) => x + b[i]), sub: (a, b) => a.map((x, i) => x - b[i]), scale: (a, k) => a.map(x => x * k),
  dot: (a, b) => a.reduce((s, x, i) => s + x * b[i], 0), norm: a => Math.hypot.apply(null, a),
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  unit: a => { const n = Math.hypot.apply(null, a) || 1; return a.map(x => x / n); },
  fmt: (a, d) => "(" + a.map(x => fmt(x, d == null ? 2 : d)).join(", ") + ")"
};
const deg = r => r * 180 / PI;
function vec2(el, cfg, emit) {
  const box = shell(el, cfg);
  const mode = cfg.mode || "add", R = cfg.range || 6, snap = cfg.snap == null ? 0.5 : cfg.snap;
  let u = (cfg.u || [3, 1]).slice(), v = (cfg.v || [1, 3]).slice(), k = cfg.k != null ? cfg.k : 2, t = cfg.t0 != null ? cfg.t0 : 1;
  let legs = (cfg.legs || [[60, 5], [150, 3]]).map(l => l.slice());
  const W = 320, H = 320, svg = svgEl(W, H, "wdrag2"); box.append(svg);
  const ro = h("div", "wros"); box.append(ro);
  const ctr = h("div", "wctl"); box.append(ctr);
  const S0 = 20, F = frame(S0, S0, W - 2 * S0, H - 2 * S0, [-R, R], [-R, R]);
  const P = a => [F.sx(a[0]), F.sy(a[1])];
  const st = () => ST.vec2(cfg, u, v, k, t, legs);
  const grid = () => {
    let s = '<rect x="' + F.x0 + '" y="' + F.y0 + '" width="' + F.w + '" height="' + F.h + '" class="wbg"/>';
    for (let i = -R; i <= R; i++) { s += ln(F.sx(i), F.y0, F.sx(i), F.y0 + F.h, i ? "wgrid" : "waxis") + ln(F.x0, F.sy(i), F.x0 + F.w, F.sy(i), i ? "wgrid" : "waxis"); }
    return s;
  };
  const cid = clipId(), gid = clipId(), clipDef = '<defs><clipPath id="' + cid + '"><rect x="0" y="0" width="' + W + '" height="' + H + '"/></clipPath><clipPath id="' + gid + '"><rect x="' + F.x0 + '" y="' + F.y0 + '" width="' + F.w + '" height="' + F.h + '"/></clipPath></defs>';
  const inGrid = el => '<g clip-path="url(#' + gid + ')">' + el + '</g>';
  function draw() {
    const S = st(); let s = grid();
    const O = P([0, 0]);
    if (mode === "add" || mode === "sub") {
      const U = P(u), Vv = P(v), Sm = P(mode === "add" ? S.sum : S.diff);
      if (mode === "add") { s += '<path d="M' + O.join(" ") + 'L' + U.join(" ") + 'L' + Sm.join(" ") + 'L' + Vv.join(" ") + 'Z" class="wpar"/>'; s += arrow(U[0], U[1], Sm[0], Sm[1], "s2 wvec wdash"); s += arrow(O[0], O[1], Sm[0], Sm[1], "s3 wvec") + lbl(Sm[0] + 6, Sm[1] - 6, "u + v", "wlab s3t"); }
      else { s += arrow(Vv[0], Vv[1], U[0], U[1], "s3 wvec") + tx((U[0] + Vv[0]) / 2 + 6, (U[1] + Vv[1]) / 2 - 6, "u − v", "wlab s3t"); }
      s += arrow(O[0], O[1], U[0], U[1], "s1 wvec") + arrow(O[0], O[1], Vv[0], Vv[1], "s2 wvec");
      s += lbl(U[0] + 6, U[1] + 14, "u", "wlab s1t") + lbl(Vv[0] + 6, Vv[1] - 6, "v", "wlab s2t");
      s += dot(U[0], U[1], "f1 wknob", 7) + dot(Vv[0], Vv[1], "f2 wknob", 7);
      readouts(ro, [["u", V.fmt(u)], ["v", V.fmt(v)], [mode === "add" ? "u + v" : "u − v", V.fmt(mode === "add" ? S.sum : S.diff)], ["length", fmt(V.norm(mode === "add" ? S.sum : S.diff), 3)]]);
    } else if (mode === "scale") {
      const U = P(u), K = P(V.scale(u, k));
      s += arrow(O[0], O[1], K[0], K[1], "s3 wvec") + lbl(K[0] + 6, K[1] - 6, fmt(k, 2) + "u", "wlab s3t") + arrow(O[0], O[1], U[0], U[1], "s1 wvec") + dot(U[0], U[1], "f1 wknob", 7) + tx(U[0] + 6, U[1] + 14, "u", "wlab s1t");
      readouts(ro, [["u", V.fmt(u)], ["k", fmt(k, 2)], ["ku", V.fmt(V.scale(u, k))], ["|ku| ÷ |u|", S.nu ? fmt(Math.abs(k), 2) : "–"]]);
    } else if (mode === "comp") {
      const U = P(u), Ux = P([u[0], 0]);
      s += ln(O[0], O[1], Ux[0], Ux[1], "s2 wthick wdash") + ln(Ux[0], Ux[1], U[0], U[1], "s3 wthick wdash");
      const ang = Math.atan2(u[1], u[0]), r = 24; s += '<path d="M' + (O[0] + r) + ' ' + O[1] + ' A' + r + ' ' + r + ' 0 ' + (Math.abs(ang) > PI ? 1 : 0) + ' ' + (ang > 0 ? 0 : 1) + ' ' + (O[0] + r * Math.cos(ang)).toFixed(1) + ' ' + (O[1] - r * Math.sin(ang)).toFixed(1) + '" class="warc"/>';
      s += arrow(O[0], O[1], U[0], U[1], "s1 wvec") + dot(U[0], U[1], "f1 wknob", 7) + tx(U[0] + 6, U[1] - 6, "u", "wlab s1t") + tx((O[0] + Ux[0]) / 2, O[1] + (u[1] >= 0 ? 14 : -6), "x: " + fmt(u[0], 2), "wlab s2t", "middle") + tx(Ux[0] + 6, (Ux[1] + U[1]) / 2, "y: " + fmt(u[1], 2), "wlab s3t");
      readouts(ro, [["u", V.fmt(u)], ["|u|", fmt(S.nu, 3)], ["angle from +x", fmt(S.dir, 1) + "°"]]);
    } else if (mode === "dot") {
      const U = P(u), Vv = P(v), nv2 = V.dot(v, v) || 1, pr = V.scale(v, S.dot / nv2), Pp = P(pr);
      const cls = Math.abs(S.dot) < 1e-9 ? "s5" : S.dot > 0 ? "s4" : "s3";
      s += inGrid(ln(F.sx(-v[0] * R), F.sy(-v[1] * R), F.sx(v[0] * R), F.sy(v[1] * R), "wguide"));
      s += ln(U[0], U[1], Pp[0], Pp[1], "wguide wdash") + arrow(O[0], O[1], Pp[0], Pp[1], cls + " wvec wthick");
      s += arrow(O[0], O[1], U[0], U[1], "s1 wvec") + arrow(O[0], O[1], Vv[0], Vv[1], "s2 wvec");
      const a1 = Math.atan2(u[1], u[0]), a2 = Math.atan2(v[1], v[0]); let da = a2 - a1; while (da > PI) da -= 2 * PI; while (da < -PI) da += 2 * PI; const r = 22;
      s += '<path d="M' + (O[0] + r * Math.cos(a1)).toFixed(1) + ' ' + (O[1] - r * Math.sin(a1)).toFixed(1) + ' A' + r + ' ' + r + ' 0 0 ' + (da > 0 ? 0 : 1) + ' ' + (O[0] + r * Math.cos(a2)).toFixed(1) + ' ' + (O[1] - r * Math.sin(a2)).toFixed(1) + '" class="warc"/>';
      s += dot(U[0], U[1], "f1 wknob", 7) + dot(Vv[0], Vv[1], "f2 wknob", 7) + lbl(U[0] + 6, U[1] - 6, "u", "wlab s1t") + lbl(Vv[0] + 6, Vv[1] - 6, "v", "wlab s2t");
      readouts(ro, [["u", V.fmt(u)], ["v", V.fmt(v)], ["u · v", fmt(S.dot, 3)], ["angle", fmt(S.angle, 1) + "°"], ["shadow of u on v", fmt(S.dot / (S.nv || 1), 3)]]);
    } else if (mode === "bearing") {
      /* compass: north is up */
      s += tx(F.sx(0), F.y0 - 5, "N", "wlab", "middle") + tx(F.x0 + F.w + 2, F.sy(0) + 4, "E", "wlab");
      let at = [0, 0];
      legs.forEach((l, i) => {
        const d = bearingVec(l[0], l[1]), A = P(at), B = P(V.add(at, d));
        s += ln(A[0], A[1], A[0], A[1] - 30, "wguide wdash");
        const r = 18, a0 = -PI / 2, a1 = -PI / 2 + l[0] * PI / 180;
        s += '<path d="M' + A[0].toFixed(1) + ' ' + (A[1] - r).toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + (l[0] > 180 ? 1 : 0) + ' 1 ' + (A[0] + r * Math.cos(a1)).toFixed(1) + ' ' + (A[1] + r * Math.sin(a1)).toFixed(1) + '" class="warc"/>';
        s += arrow(A[0], A[1], B[0], B[1], (i ? "s2" : "s1") + " wvec") + tx((A[0] + B[0]) / 2 + 6, (A[1] + B[1]) / 2, "leg " + (i + 1), "wlab sm " + (i ? "s2t" : "s1t"));
        at = V.add(at, d);
      });
      const E = P(at); s += arrow(O[0], O[1], E[0], E[1], "s3 wvec wthick") + lbl(E[0] + 6, E[1] + 14, "result", "wlab s3t");
      readouts(ro, [["east", fmt(S.res[0], 2)], ["north", fmt(S.res[1], 2)], ["distance", fmt(S.resD, 2)], ["bearing", S.resD < 1e-9 ? "none" : String(Math.round(S.resB) % 360).padStart(3, "0") + "°"]]);
    } else if (mode === "line") {
      const A = P(u), D = P(V.add(u, v)), pt = P(S.pt);
      s += inGrid(ln(F.sx(u[0] - v[0] * 3 * R), F.sy(u[1] - v[1] * 3 * R), F.sx(u[0] + v[0] * 3 * R), F.sy(u[1] + v[1] * 3 * R), "s1 wthin"));
      const nE = P(V.add(u, V.scale(V.unit(S.n), 2)));
      if (cfg.showNormal !== false) s += arrow(A[0], A[1], nE[0], nE[1], "s4 wvec") + tx(nE[0] + 4, nE[1] - 4, "normal", "wlab sm s4t");
      s += arrow(A[0], A[1], D[0], D[1], "s2 wvec") + tx(D[0] + 6, D[1] - 6, "d", "wlab s2t");
      s += dot(pt[0], pt[1], "f3", 6) + tx(pt[0] + 7, pt[1] + 14, "t = " + fmt(t, 2), "wlab sm s3t");
      s += dot(A[0], A[1], "f1 wknob", 7) + dot(D[0], D[1], "f2 wknob", 7) + tx(A[0] - 14, A[1] + 14, "P", "wlab s1t");
      const n = S.n;
      readouts(ro, [["r = P + td", V.fmt(u) + " + t" + V.fmt(v)], ["point", V.fmt(S.pt)], ["scalar form", fmt(n[0], 2) + "x " + (n[1] < 0 ? "− " : "+ ") + fmt(Math.abs(n[1]), 2) + "y " + (S.c < 0 ? "− " : "+ ") + fmt(Math.abs(S.c), 2) + " = 0"]]);
    }
    svg.innerHTML = clipDef + '<g clip-path="url(#' + cid + ')">' + s + '</g>';
    emit(S);
  }
  const knobs = () => mode === "add" || mode === "sub" || mode === "dot" ? [["u", u], ["v", v]] : mode === "line" ? [["u", u], ["d", null]] : mode === "scale" || mode === "comp" ? [["u", u]] : [];
  let grab = null;
  const sn = a => snap ? a.map(z => clamp(Math.round(z / snap) * snap, -R, R)) : a.map(z => clamp(z, -R, R));
  if (mode !== "bearing") dragOn(svg, pt => {
    const p = [F.ix(pt[0]), R - (pt[1] - F.y0) / F.h * 2 * R];
    const cands = knobs().map(kk => [kk[0], kk[0] === "d" ? V.add(u, v) : kk[1]]);
    let bestD = 1e9; grab = null;
    for (const c of cands) { const d = V.norm(V.sub(c[1], p)); if (d < bestD) { bestD = d; grab = c[0]; } }
    if (bestD > R * 0.25) { grab = null; return false; }
  }, pt => {
    if (!grab) return; const p = sn([F.ix(pt[0]), R - (pt[1] - F.y0) / F.h * 2 * R]);
    if (grab === "u") { u = p; } else if (grab === "v") { v = p; } else if (grab === "d") { const d = V.sub(p, u); if (V.norm(d) > 0.1) v = d; }
    draw();
  }, () => { grab = null; });
  if (mode === "scale") ctr.append(slider("k", cfg.kmin != null ? cfg.kmin : -3, cfg.kmax || 3, 0.1, k, z => { k = z; draw(); }, z => fmt(z, 1)));
  if (mode === "line") ctr.append(slider("t", cfg.tmin != null ? cfg.tmin : -3, cfg.tmax || 3, 0.05, t, z => { t = z; draw(); }, z => fmt(z, 2)));
  if (mode === "bearing") legs.forEach((l, i) => {
    ctr.append(slider("leg " + (i + 1) + " bearing", 0, 359, 1, l[0], z => { legs[i][0] = z; draw(); }, z => String(Math.round(z)).padStart(3, "0") + "°"));
    ctr.append(slider("leg " + (i + 1) + " distance", 0, cfg.dmax || 6, 0.1, l[1], z => { legs[i][1] = z; draw(); }, z => fmt(z, 1)));
  });
  if (knobs().length) box.insertBefore(h("p", "whint", "Drag the dots."), ro);
  draw();
  return { state: st };
}

/* ================= 3D scenes ================= */
function vec3(el, cfg, emit) {
  const box = shell(el, cfg);
  const R = cfg.range || 5;
  const p = {}; (cfg.params || []).forEach(q => p[q.name] = q.val);
  let yaw = cfg.yaw != null ? cfg.yaw : -0.6, pitch = cfg.pitch != null ? cfg.pitch : 0.42, spin = null;
  const W = 330, H = 300, svg = svgEl(W, H, "wdrag2"); box.append(svg);
  const ro = h("div", "wros"); box.append(ro);
  const ctr = h("div", "wctl"); box.append(ctr);
  const sc = Math.min(W, H) / (R * 3.1);
  /* z is up. Turn about z by yaw, then tip by pitch. */
  function proj(a) {
    const [x, y, z] = a, cy = Math.cos(yaw), sy = Math.sin(yaw);
    const X = x * cy - y * sy, Y = x * sy + y * cy; /* Y points into the screen before tipping */
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const Z2 = z * cp - Y * sp, D = Y * cp + z * sp;
    return [W / 2 + X * sc, H / 2 - Z2 * sc, D];
  }
  const state = () => ST.vec3(cfg, p, yaw, pitch);
  function planePoly(n, d, size) {
    const nn = V.norm(n) || 1, c = V.scale(n, d / (nn * nn));
    let a = Math.abs(n[0]) < 0.9 * nn ? [1, 0, 0] : [0, 1, 0];
    const e1 = V.unit(V.cross(n, a)), e2 = V.unit(V.cross(n, e1)), s = size || R * 0.9;
    return [V.add(c, V.add(V.scale(e1, s), V.scale(e2, s))), V.add(c, V.add(V.scale(e1, -s), V.scale(e2, s))), V.add(c, V.add(V.scale(e1, -s), V.scale(e2, -s))), V.add(c, V.add(V.scale(e1, s), V.scale(e2, -s)))];
  }
  function lineClip(P0, d, rng) {
    if (rng) return [V.add(P0, V.scale(d, rng[0])), V.add(P0, V.scale(d, rng[1]))];
    let t0 = -1e9, t1 = 1e9; const L = R * 1.2;
    for (let i = 0; i < 3; i++) {
      if (Math.abs(d[i]) < 1e-12) { if (Math.abs(P0[i]) > L) return null; continue; }
      let a = (-L - P0[i]) / d[i], b = (L - P0[i]) / d[i]; if (a > b) [a, b] = [b, a]; t0 = Math.max(t0, a); t1 = Math.min(t1, b);
    }
    return t0 < t1 ? [V.add(P0, V.scale(d, t0)), V.add(P0, V.scale(d, t1))] : null;
  }
  const C = c => "s" + (c || 1), Fc = c => "f" + (c || 1);
  function draw() {
    const items = [];
    /* axes and floor grid */
    let base = "";
    if (cfg.grid !== false) for (let i = -R; i <= R; i++) {
      const a = proj([i, -R, 0]), b = proj([i, R, 0]), c = proj([-R, i, 0]), d = proj([R, i, 0]);
      base += ln(a[0], a[1], b[0], b[1], "wgrid") + ln(c[0], c[1], d[0], d[1], "wgrid");
    }
    [["x", [R + 0.6, 0, 0]], ["y", [0, R + 0.6, 0]], ["z", [0, 0, R + 0.6]]].forEach(([n, e]) => {
      const a = proj(V.scale(e, -1)), b = proj(e); base += ln(a[0], a[1], b[0], b[1], "waxis") + tx(b[0] + 3, b[1] + 4, n, "wlab sm");
    });
    const objs = cfg.scene(p, V) || [];
    for (const o of objs) {
      if (o.t === "plane" || o.t === "poly") {
        const pts = o.t === "plane" ? planePoly(o.n, o.d, o.size) : o.pts;
        const pr = pts.map(proj), depth = pr.reduce((s, q) => s + q[2], 0) / pr.length;
        items.push([depth + 100, '<path d="M' + pr.map(q => q[0].toFixed(1) + " " + q[1].toFixed(1)).join("L") + 'Z" class="wpoly ' + Fc(o.c) + " " + C(o.c) + '"' + (o.op != null ? ' fill-opacity="' + o.op + '"' : "") + '/>' + (o.label ? tx(pr[0][0], pr[0][1], o.label, "wlab sm " + C(o.c) + "t") : "")]);
      } else if (o.t === "line" || o.t === "seg") {
        const ends = o.t === "seg" ? [o.a, o.b] : lineClip(o.p, o.d, o.range); if (!ends) continue;
        const a = proj(ends[0]), b = proj(ends[1]);
        items.push([(a[2] + b[2]) / 2, ln(a[0], a[1], b[0], b[1], C(o.c) + (o.t === "line" ? " wthin" : " wseg") + (o.dash ? " wdash" : "")) + (o.label ? lbl(b[0] + 4, b[1] - 4, o.label, "wlab sm " + C(o.c) + "t", W) : "")]);
      } else if (o.t === "vec") {
        const a = proj(o.from || [0, 0, 0]), b = proj(V.add(o.from || [0, 0, 0], o.to));
        items.push([(a[2] + b[2]) / 2 - 50, arrow(a[0], a[1], b[0], b[1], C(o.c) + " wvec" + (o.dash ? " wdash" : "")) + (o.label ? lbl(b[0] + 5, b[1] - 5, o.label, "wlab " + C(o.c) + "t", W) : "")]);
      } else if (o.t === "pt") {
        const a = proj(o.at); items.push([a[2] - 200, dot(a[0], a[1], Fc(o.c), o.r || 4.5) + (o.label ? lbl(a[0] + 6, a[1] - 6, o.label, "wlab sm " + C(o.c) + "t", W) : "")]);
      }
    }
    items.sort((a, b) => b[0] - a[0]);
    svg.innerHTML = base + items.map(i => i[1]).join("");
    const S = state();
    readouts(ro, (cfg.readouts || []).map(r => [r.label, r.value(p, V)]));
    emit(S);
  }
  let last = null;
  dragOn(svg, pt => { last = pt; stopSpin(); }, pt => { yaw += (pt[0] - last[0]) * 0.012; pitch = clamp(pitch + (pt[1] - last[1]) * 0.01, -1.4, 1.4); last = pt; draw(); });
  function stopSpin() { if (spin) { clearInterval(spin); spin = null; sb.textContent = "↻ Spin"; } }
  const sb = btn("↻ Spin", () => { if (spin) { stopSpin(); return; } sb.textContent = "■ Stop"; spin = setInterval(() => { yaw += 0.02; draw(); }, 30); }, "ghost");
  ctr.append(sb, btn("Reset view", () => { stopSpin(); yaw = cfg.yaw != null ? cfg.yaw : -0.6; pitch = cfg.pitch != null ? cfg.pitch : 0.42; draw(); }, "ghost"));
  (cfg.params || []).forEach(q => ctr.append(slider(q.label || q.name, q.min, q.max, q.step || 0.1, q.val, v => { p[q.name] = v; draw(); }, q.show || (v => fmt(v, 2)))));
  box.insertBefore(h("p", "whint", "Drag the picture to turn it."), ro);
  draw();
  return { state, stop: stopSpin };
}

const TYPES = { tracer, limit, blocks, area, chain, motion, optim, sign, vec2, vec3 };
const isW = typeof document !== "undefined";
CP.V = V;
CP.W = {
  TYPES: Object.keys(TYPES), fmt, piLabel, polyStr, ST, sample, numD, roots, pEval, pDer,
  mount(el, cfg, onChange) {
    const f = TYPES[cfg.type]; if (!f) throw new Error("no widget type " + cfg.type);
    return f(el, cfg, onChange || (() => {}));
  }
};
})();
