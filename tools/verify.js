/* Verifies every generator at every tier: the marked answer is right, no wrong option is secretly
   also right, every wrong option carries an explanation, every problem has a walk-through.
   Tiers 0–2: forward problems. Spot the error: exactly one line is false, the rest follow from the
   lines above. Work backwards: the condition holds for the right option and fails for every other.
   Also exercises every step's real-life calculation with fallback and with perturbed live data.
   Run: node tools/verify.js   (VERIFY_N=200 for a quicker pass) */
const fs = require("fs"), path = require("path"), vm = require("vm");
const docs = path.join(__dirname, "..", "docs", "js");
const ctx = { window: {}, Math, Number, String, Array, Object, Set, Error, console, isFinite, Infinity };
ctx.window.CP = {}; ctx.CP = ctx.window.CP; /* browser: window is the global object */
vm.createContext(ctx);
for (const f of ["content.js", "content-more.js", "content-full.js", "notes.js", "notes-full.js", "generators.js", "graphs.js", "generators-more.js", "generators-context.js", "generators-modes.js", "generators-full.js"]) vm.runInContext(fs.readFileSync(path.join(docs, f), "utf8"), ctx, { filename: f });
const CP = ctx.window.CP;
const N = Number(process.env.VERIFY_N || 1000);

const numd = (f, x) => { const h = 1e-5; return (f(x + h) - f(x - h)) / (2 * h); };
const numd2 = (f, x) => { const h = 1e-3; return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h); };
const close = (a, b, t = 1e-4) => Math.abs(a - b) <= t * Math.max(1, Math.abs(a), Math.abs(b));
const xs = [0.37, 1.21, -0.83, 2.05, -1.67], pxs = [0.37, 1.21, 2.05, 0.83, 1.67], hs = [0.3, 0.9, 1.7];
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const sub = (a, b) => a.map((x, i) => x - b[i]);
const isZero = v => v.every(x => x === 0);
const to3 = v => v.length === 2 ? [v[0], v[1], 0] : v;
const parallel = (a, b) => isZero(cross(to3(a), to3(b)));
const keyOf = CP.h.keyOf;
const same = CP.h.same;

let fails = 0, total = 0, spotN = 0, revN = 0, ctxN = 0;
const seenKinds = {};
const bad = m => { const k = m.split(" ").slice(0, 3).join(" "); seenKinds[k] = (seenKinds[k] || 0) + 1; if (seenKinds[k] <= 2 && Object.keys(seenKinds).length <= 40) console.log("FAIL", m); fails++; };

/* ---------- course structure ---------- */
const ids = CP.STEPS.map(s => s.id);
if (CP.STEPS.length !== 36) bad("expected 36 steps, got " + CP.STEPS.length);
if (!CP.UNITS || CP.UNITS.reduce((a, u) => a + u.steps.length, 0) !== 36 || CP.STEPS.some(s => !s.unit)) bad("every step needs exactly one unit");
CP.STEPS.forEach((s, i) => {
  if (s.order !== i + 1) bad("order gap at " + s.id);
  if (!s.short) bad("no short label " + s.id);
  if (s.prereq && (!ids.includes(s.prereq) || CP.stepById(s.prereq).order >= s.order)) bad("prereq after step: " + s.id);
  if (!s.rule || !s.rule.r || !s.rule.tip || !s.rule.trap) bad("rule card incomplete " + s.id);
  if (!CP.SPOT[s.id] || !CP.REV[s.id]) bad("missing spot/reverse generator " + s.id);
});
if (!CP.TIERS || CP.TIERS.length !== 5) bad("tiers");

/* ---------- forward problems ---------- */
function checkForward(p, tag) {
  if (p.options.length !== 4) bad(tag + " opts=" + p.options.length);
  if (p.options.filter(o => o.ok).length !== 1) bad(tag + " ok count");
  const keys = p.options.map(o => keyOf(o.html)); if (new Set(keys).size !== keys.length) bad(tag + " dup keys");
  if (p.options.some(o => !o.ok && !o.why)) bad(tag + " wrong option missing explanation");
  const c = p.options.find(o => o.ok), W = p.options.filter(o => !o.ok);
  const XS = p.posOnly ? pxs : xs;
  if (p.src && c.f) { for (const x of XS) if (!close(c.f(x), numd(p.src, x), 1e-3)) { bad(tag + " derivative wrong @" + x + " " + c.html); break; } }
  for (const w of W) { if (w.f && c.f && XS.every(x => close(w.f(x), c.f(x), 1e-9))) bad(tag + " distractor equals correct: " + w.html); }
  if (p.truthN !== undefined && Math.abs(c.n - p.truthN) > 1e-6 * Math.max(1, Math.abs(p.truthN))) bad(tag + " numeric wrong " + c.n + " vs " + p.truthN);
  for (const w of W) { if (typeof w.n === "number" && typeof c.n === "number" && !isNaN(w.n) && Math.abs(w.n - c.n) < 1e-12) bad(tag + " numeric distractor equals correct"); }
  if (p.truthV && c.v.join() !== p.truthV.join()) bad(tag + " vector wrong " + c.v + " vs " + p.truthV);
  for (const w of W) { if (w.v && c.v && w.v.join() === c.v.join()) bad(tag + " vector distractor equals correct"); }
  if (p.perpTo) { if (dot(c.v, p.perpTo) !== 0) bad(tag + " perp correct not perp"); for (const w of W) if (dot(w.v, p.perpTo) === 0) bad(tag + " perp distractor is perp"); }
  if (p.dirOf) { for (const w of W) if (isZero(w.v) || parallel(w.v, p.dirOf)) bad(tag + " direction distractor is valid: " + w.html); }
  if (p.onLine) { const on = v => isZero(cross(sub(v, p.onLine.P), p.onLine.d)); if (!on(c.v)) bad(tag + " line correct not on line"); for (const w of W) if (on(w.v)) bad(tag + " line distractor on line " + w.html); }
  /* difference quotient: compare with the real quotient at several (x, h) */
  if (p.dq) {
    const q = (x, h) => (p.dq(x + h) - p.dq(x)) / h, ok = fn => pxs.every(x => hs.every(h => close(fn(x, h), q(x, h), 1e-6)));
    if (!ok(c.fh)) bad(tag + " quotient wrong " + c.html);
    for (const w of W) if (ok(w.fh)) bad(tag + " quotient distractor is right " + w.html);
  }
  /* roots of the first or second derivative */
  if (p.rootsD) {
    const g = x => p.rootsD === 1 ? numd(p.src, x) : numd2(p.src, x);
    const right = set => set.length === p.nroots && new Set(set).size === set.length && set.every(r => Math.abs(g(r)) < 1e-3);
    if (!right(c.set)) bad(tag + " roots correct wrong " + c.html);
    for (const w of W) if (right(w.set)) bad(tag + " roots distractor right " + w.html);
  }
  /* sign of the second derivative on an interval */
  if (p.signD) {
    const g = x => p.signD === 1 ? numd(p.src, x) : numd2(p.src, x), grid = []; for (let x = -20; x <= 20; x += 0.25) if (Math.abs(g(x)) > 1e-6) grid.push(x);
    const inside = (iv, x) => x > iv[0] && x < iv[1], right = iv => grid.every(x => (p.signNeg ? g(x) < 0 : g(x) > 0) === inside(iv, x));
    if (!right(c.iv)) bad(tag + " interval correct wrong " + c.html);
    for (const w of W) if (right(w.iv)) bad(tag + " interval distractor right " + w.html);
  }
  /* optimization: grid search */
  if (p.maxOf) {
    const { f, lo, hi, want } = p.maxOf, n = 20000, st = (hi - lo) / n; let bx = lo, bv = -Infinity;
    for (let i = 0; i <= n; i++) { const x = lo + i * st, v = f(x); if (v > bv) { bv = v; bx = x; } }
    if (want === "val" ? !close(c.n, bv, 1e-6) : Math.abs(c.n - bx) > 2 * st) bad(tag + " optimum wrong " + c.html + " vs " + (want === "val" ? bv : bx));
  }
  if (p.normalOf) { if (!parallel(c.v, p.normalOf)) bad(tag + " normal wrong"); for (const w of W) if (isZero(w.v) || parallel(w.v, p.normalOf)) bad(tag + " normal distractor valid " + w.html); }
  if (p.plane) {
    const right = pl => { const n = pl.slice(0, 3); return !isZero(n) && (!p.plane.n || parallel(n, p.plane.n)) && p.plane.pts.every(P => dot(n, P) === pl[3]); };
    if (!right(c.pl)) bad(tag + " plane correct wrong " + c.html);
    for (const w of W) if (right(w.pl)) bad(tag + " plane distractor right " + w.html);
  }
  if (p.meet) {
    const { P, d, n, D } = p.meet, right = X => isZero(cross(sub(X, P), d)) && dot(n, X) === D;
    if (!right(c.v)) bad(tag + " meet correct wrong"); for (const w of W) if (right(w.v)) bad(tag + " meet distractor right " + w.html);
  }
  if (p.meetCase) {
    const { P, d, n, D } = p.meetCase, cs = dot(n, d) !== 0 ? "one" : dot(n, P) === D ? "all" : "none";
    if (c.cs !== cs) bad(tag + " meet case wrong " + c.cs + " vs " + cs);
  }
  /* graph choices: compare shapes using numeric derivatives, independent of graphs.js's own derivative */
  if (p.gq) {
    const ev = CP.graph.ev, W2 = p.gq.w, want = x => ev(p.gq.want, x), dn = sp => x => numd(y => ev(sp, y), x);
    const sgn = f => { const v = []; for (let i = 1; i < 97; i++) v.push(f(W2[0] + (W2[1] - W2[0]) * i / 97)); const m = Math.max(1e-12, ...v.map(Math.abs)); return v.map(y => Math.abs(y) < 0.04 * m ? 0 : Math.sign(y)); };
    const alike = (f, g) => { const a = sgn(f), b = sgn(g); return a.every((s1, i) => s1 === 0 || b[i] === 0 || s1 === b[i]); };
    const fits = sp => p.gq.comp === "f" ? alike(x => ev(sp, x), want) : p.gq.comp === "d" ? alike(dn(sp), want) : alike(x => ev(sp, x), want) && alike(dn(sp), dn(p.gq.want));
    if (!fits(c.g)) bad(tag + " graph correct doesn't fit " + c.g + " vs " + p.gq.want);
    if (p.gq.exact && !pxs.concat(xs).every(x => { const xx = W2[0] + (W2[1] - W2[0]) * ((x + 2) / 5); return close(ev(c.g, xx), want(xx), 1e-6); })) bad(tag + " graph correct not exact");
    for (const w of W) if (fits(w.g)) bad(tag + " graph distractor looks the same: " + w.g + " vs " + c.g);
    if (p.options.length !== 4) bad(tag + " graph opts");
  }
  if (p.laws) {
    const R3 = () => [0, 1, 2].map(() => Math.floor(Math.random() * 9) - 4), eq = (a, b) => Array.isArray(a) ? a.every((x, i) => Math.abs(x - b[i]) < 1e-9) : Math.abs(a - b) < 1e-9;
    const holds = law => { for (let i = 0; i < 40; i++) { const [l, r] = law(R3(), R3(), R3(), Math.floor(Math.random() * 7) - 3); if (!eq(l, r)) return false; } return true; };
    if (!holds(c.law)) bad(tag + " law marked true fails: " + c.html);
    for (const w of W) if (holds(w.law)) bad(tag + " law marked false holds: " + w.html);
  }
  if (p.line2d) {
    const { P, d } = p.line2d, ok = l => (l[0] || l[1]) && l[0] * d[0] + l[1] * d[1] === 0 && l[0] * P[0] + l[1] * P[1] + l[2] === 0;
    if (!ok(c.l)) bad(tag + " 2D line correct wrong"); for (const w of W) if (ok(w.l)) bad(tag + " 2D line distractor right " + w.html);
  }
  if (p.sys2) {
    const ok = v => p.sys2.every(e => e[0] * v[0] + e[1] * v[1] + e[2] === 0) && (!p.onLine2 || (v[0] - p.onLine2.P[0]) * p.onLine2.d[1] - (v[1] - p.onLine2.P[1]) * p.onLine2.d[0] === 0);
    if (!ok(c.v)) bad(tag + " 2D intersection correct wrong"); for (const w of W) if (ok(w.v)) bad(tag + " 2D intersection distractor right " + w.html);
  }
  if (p.sys || p.sysF) {
    const S2 = p.sys || p.sysF, ok = v => S2.every(e => Math.abs(e[0] * v[0] + e[1] * v[1] + e[2] * v[2] - e[3]) < 1e-6 * Math.max(1, Math.abs(e[3])));
    if (!ok(c.v)) bad(tag + " system correct wrong " + c.v); for (const w of W) if (ok(w.v)) bad(tag + " system distractor right " + w.html);
  }
  if (p.vecForm) {
    const { n, d } = p.vecForm, ok = ([Q, a, b]) => dot(n, Q) === d && dot(n, a) === 0 && dot(n, b) === 0 && !isZero(cross(a, b));
    if (!ok(c.vf)) bad(tag + " vector form correct wrong"); for (const w of W) if (ok(w.vf)) bad(tag + " vector form distractor right " + w.html);
  }
  const rank = Mx => { const A = Mx.map(r => r.slice()); let rk = 0; for (let col = 0; col < A[0].length && rk < A.length; col++) { let piv = rk; while (piv < A.length && Math.abs(A[piv][col]) < 1e-9) piv++; if (piv === A.length) continue; [A[rk], A[piv]] = [A[piv], A[rk]]; for (let r = 0; r < A.length; r++) if (r !== rk) { const f = A[r][col] / A[rk][col]; for (let k = col; k < A[0].length; k++) A[r][k] -= f * A[rk][k]; } rk++; } return rk; };
  if (p.planes) {
    const [a, b] = p.planes, rc = rank([a.slice(0, 3), b.slice(0, 3)]), ra = rank([a, b]);
    const cs = rc === 2 ? "line" : ra === 2 ? "par" : "same";
    if (c.cs !== cs) bad(tag + " two-plane case " + c.cs + " vs " + cs);
  }
  if (p.planes3) {
    const P3 = p.planes3, rc = rank(P3.map(r => r.slice(0, 3))), ra = rank(P3);
    const cs = ra > rc ? "none" : rc === 3 ? "point" : rc === 2 ? "line" : "same";
    if (c.cs !== cs) bad(tag + " three-plane case " + c.cs + " vs " + cs);
  }
  if (p.lines) {
    const [P, d1, Q, d2] = p.lines, par = isZero(cross(d1, d2));
    const cs = par ? (isZero(cross(sub(Q, P), d1)) ? "same" : "par") : (dot(sub(Q, P), cross(d1, d2)) === 0 ? "meet" : "skew");
    if (c.cs !== cs) bad(tag + " line case " + c.cs + " vs " + cs);
  }
  if (p.onBoth) {
    const [P, d1, Q, d2] = p.onBoth, on = (A, d, X) => isZero(cross(sub(X, A), d)), ok = X => on(P, d1, X) && on(Q, d2, X);
    if (!ok(c.v)) bad(tag + " meeting point wrong"); for (const w of W) if (ok(w.v)) bad(tag + " meeting distractor on both " + w.html);
  }
  if (p.bearing) {
    const [e, n] = p.bearing, th = Math.round(Math.atan(Math.abs(e) / Math.abs(n)) * 180 / Math.PI), b = (n >= 0 ? "N" : "S") + " " + th + "° " + (e >= 0 ? "E" : "W");
    if (c.b !== b) bad(tag + " bearing " + c.b + " vs " + b); for (const w of W) if (w.b === b) bad(tag + " bearing distractor right");
  }
  if (!p.walk || !p.walk.length) bad(tag + " no walkthrough");
}

for (const st of CP.STEPS) {
  for (const tier of [0, 1, 2]) {
    for (let i = 0; i < N; i++) {
      let p; try { p = CP.buildFwd(st.id, tier); } catch (e) { bad(st.id + "/" + tier + " build: " + e.message); break; }
      total++;
      checkForward(p, st.id + "/" + tier);
      const fz = CP.freeze(p, st.id, tier); if (JSON.stringify(fz).length < 50 || fz.mode !== "fwd") bad(st.id + "/" + tier + " freeze broken");
    }
  }

  /* real situations: every scenario, fresh numbers each time */
  const pool = CP.CTX[st.id] || [];
  if (pool.length < 2) bad(st.id + " needs at least 2 real-life scenarios, has " + pool.length);
  /* a scenario may reject its random numbers and return null, so sample each a few times */
  if (!pool.some(f => { for (let i = 0; i < 20; i++) { try { const p = f(); if (p) return p.k === "Finance"; } catch (e) { return false; } } return false; })) bad(st.id + " has no finance scenario");
  for (const fn of pool) for (let i = 0; i < Math.ceil(N / 3); i++) {
    const tag = st.id + "/ctx:" + fn.name; let p;
    try { p = CP.buildCtx(st.id, fn.name); } catch (e) { bad(tag + " build: " + e.message); break; }
    total++; ctxN++;
    if (p.sid === undefined || !p.k) bad(tag + " missing label");
    checkForward(p, tag);
    if (/NaN|undefined|Infinity/.test(p.task + p.expr + p.options.map(o => o.html + (o.ok ? "" : o.why)).join() + p.walk.join())) bad(tag + " junk in text: " + p.task);
    if (p.truthN === undefined && !p.truthV && !["rootsD", "maxOf", "signD", "sys", "sysF", "sys2", "gq", "lines", "planes", "planes3", "plane", "onBoth"].some(k => p[k])) bad(tag + " has no independent check");
    const fz = CP.freeze(p, st.id, 2); if (fz.mode !== "ctx" || !fz.ctx) bad(tag + " freeze");
  }
  /* where this shows up */
  const notes = CP.NOTES[st.id] || [];
  if (notes.length < 8) bad(st.id + " needs 8 notes, has " + notes.length);
  const fin = notes.filter(n => n.k === "Finance").length;
  if (fin < 3 || notes.length - fin < 3) bad(st.id + " notes should mix finance and other life: " + fin + " of " + notes.length);
  if (notes.some(n => !n.k || !n.t || !n.x) || new Set(notes.map(n => n.t)).size !== notes.length) bad(st.id + " notes incomplete or repeated");

  /* spot the error */
  for (let i = 0; i < Math.ceil(N * 0.8); i++) {
    const tag = st.id + "/spot"; let p;
    try { p = CP.buildMode(st.id, "spot", 3); } catch (e) { bad(tag + " build: " + e.message); break; }
    total++; spotN++;
    const wrongLines = p.lines.filter(l => !same(l.v, l.t)).length;
    if (wrongLines !== 1 || same(p.lines[p.bad].v, p.lines[p.bad].t)) bad(tag + " expected exactly one false line, got " + wrongLines);
    if (p.options.length !== p.lines.length || p.options.filter(o => o.ok).length !== 1 || !p.options[p.bad].ok) bad(tag + " options");
    if (!p.why || !p.fix || p.fix === p.lines[p.bad].html) bad(tag + " why/fix missing " + p.fix);
    if (p.options.some(o => !o.ok && !o.why)) bad(tag + " wrong pick missing why");
    if (!p.walk || p.walk.length !== p.lines.length) bad(tag + " walk");
    if (/NaN|undefined|Infinity/.test(p.lines.map(l => l.html).join() + p.why + p.fix + p.expr)) bad(tag + " junk in text: " + p.lines.map(l => l.html).join(" | "));
    const fz = CP.freeze(p, st.id, 4); if (fz.mode !== "spot" || !fz.spotWhy || !fz.fix || !fz.noHint) bad(tag + " freeze");
  }

  /* work backwards: raw generator, then the built problem */
  for (let i = 0; i < Math.ceil(N * 0.8); i++) {
    const tag = st.id + "/rev"; let raw, p;
    try { raw = CP.REV[st.id](3); } catch (e) { bad(tag + " raw threw: " + e.message); break; }
    if (raw && !raw.cond(raw.correct.test)) bad(tag + " correct option fails its own condition: " + raw.correct.html + " for " + raw.expr);
    try { p = CP.buildMode(st.id, "rev", 3); } catch (e) { bad(tag + " build: " + e.message); break; }
    total++; revN++;
    if (p.options.length !== 4 || p.options.filter(o => o.ok).length !== 1) bad(tag + " options");
    const keys = p.options.map(o => keyOf(o.html)); if (new Set(keys).size !== 4) bad(tag + " dup keys");
    for (const o of p.options) { if (!!o.ok !== !!p.cond(o.test)) bad(tag + " condition disagrees for " + o.html); if (!o.ok && !o.why) bad(tag + " missing why " + o.html); }
    if (/NaN|undefined|Infinity/.test(p.options.map(o => o.html + (o.ok ? "" : o.why)).join() + p.expr)) bad(tag + " junk in text: " + p.options.map(o => o.html + " / " + o.why).join(" | "));
    if (!p.walk || !p.walk.length) bad(tag + " no walk");
  }

  /* the dispatcher at Expert and Master */
  for (const tier of [2, 3, 4]) for (let i = 0; i < 40; i++) {
    let p; try { p = CP.build(st.id, tier); } catch (e) { bad(st.id + "/" + tier + " dispatch: " + e.message); break; }
    const fz = CP.freeze(p, st.id, tier);
    if (fz.tier !== tier || fz.options.filter(o => o.ok).length !== 1 || !!fz.noHint !== (tier === 4)) bad(st.id + "/" + tier + " dispatch freeze");
  }

  /* real-life calculation: fallback data and a few perturbed versions */
  const lives = [CP.LIVE_FALLBACK,
    Object.assign({}, CP.LIVE_FALLBACK, { usdcad: 1.41, usdcad30: 1.33, policy: 5.0, bond5: 4.2, bond10: 4.6, eurcad: 1.52, gbpcad: 1.69 }),
    Object.assign({}, CP.LIVE_FALLBACK, { usdcad: 1.2512, usdcad30: 1.2611, policy: 0.25, bond5: 0.9, bond10: 1.4 })];
  for (const L of lives) {
    let pr; try { pr = st.practical.build(L); } catch (e) { bad(st.id + " practical threw: " + e.message); continue; }
    if (!pr.setup || !pr.lines || !pr.lines.length || !pr.answer || !pr.why || !pr.q || !pr.options) bad(st.id + " practical incomplete");
    if (pr.options.length !== 4) bad(st.id + " practical opts=" + pr.options.length);
    if (pr.options.filter(o => o.ok).length !== 1) bad(st.id + " practical ok count");
    const ks = pr.options.map(o => keyOf(o.html)); if (new Set(ks).size !== ks.length) bad(st.id + " practical dup options: " + ks.join(" | "));
    if (pr.options.some(o => !o.ok && !o.why)) bad(st.id + " practical wrong option missing why");
  }
}
/* hand checks of the fixed practical arithmetic */
const chk = (name, cond) => { if (!cond) bad("practical arithmetic: " + name); };
chk("pow1 marginal at 1000 = 45", 0.04 * 1000 + 5 === 45);
chk("polyd MR zero at 2500", 50 - 0.02 * 2500 === 0);
chk("prod week 10 = -50", (-0.5) * (100 + 200) + (10 - 5) * 20 === -50);
chk("maxmin q=50", Math.abs(Math.sqrt(2500) - 50) < 1e-9 && Math.abs(Math.sqrt(5000) - 70.71) < 0.01);
chk("dotp 0.7%", Math.abs((0.2 * 0.04 + 0.3 * -0.02 + 0.5 * 0.01) - 0.007) < 1e-12);
chk("crossp (-2,3,-1)", cross([1, 1, 1], [1, 0, -2]).join() === "-2,3,-1" && dot([-4, 6, -2], [1, 1, 1]) === 0 && dot([-4, 6, -2], [1, 0, -2]) === 0);
chk("lines t=10", [70 - 20, 20 + 15, 10 + 5].join() === "50,35,15");
const s49 = t => 4.9 * t * t;
chk("firstp secants", close(s49(3) - s49(2), 24.5, 1e-9) && close((s49(2.1) - s49(2)) / 0.1, 20.09, 1e-9) && close((s49(2.01) - s49(2)) / 0.01, 19.649, 1e-9) && close(9.8 * 3, 29.4, 1e-12));
const V = t => (1000 + 50 * t) * 20 * Math.pow(1 + 0.01 * t, 2);
chk("combo V'(10)=1870, V'(0)=1400", Math.abs(numd(V, 10) - 1870) < 1e-3 && Math.abs(numd(V, 0) - 1400) < 1e-3);
chk("motion 62.5 and 31.25", 25 * 5 - 2.5 * 25 === 62.5 && 25 * 2.5 - 5 * 6.25 === 31.25);
chk("concav t=4 rate 68, t=6", -6 * 4 + 24 === 0 && -3 * 16 + 24 * 4 + 20 === 68 && -6 * 6 + 36 === 0 && -3 * 144 + 36 * 12 === 0);
chk("optim $25/$12,500, $30", 1000 - 40 * 25 === 0 && 25 * (1000 - 500) === 12500 && 1200 - 40 * 30 === 0);
chk("angle 0.9 and 0", dot([2, -1, 1, -2], [1, -1, 2, -2]) === 9 && dot([2, -1, 1, -2], [2, -1, 1, -2]) === 10 && dot([1, -1, 2, -2], [1, -1, 2, -2]) === 10 && dot([2, -1, 1, -2], [1, 2, -2, -1]) === 0);
const inc = v => Math.round(0.02 * v[0] + 0.04 * v[1] + 0.03 * v[2]);
chk("planes $300", inc([0, 3000, 6000]) === 300 && inc([3000, 3000, 3000]) === 270 && inc([10000, 0, 0]) === 200 && inc([2000, 4000, 2000]) === 260 && inc([5000, 5000, 0]) === 300);
const ret = t => 6 * (70 - 2 * t) + 3 * (20 + 1.5 * t) + (10 + 0.5 * t);
chk("lineplane t=10, t=12", ret(10) === 420 && ret(12) === 406);
chk("dist 4 m and 6 m", (2 * 3 + 6 + 2 * 15 - 30) / 3 === 4 && (2 * 3 + 6 + 2 * 18 - 30) / 3 === 6 && (30 - 6 - 6) / 2 === 9);
for (const w of CP.WHY) { if (w.wrong.length !== 3) bad("why count"); const k = [w.right, ...w.wrong.map(x => x[0])]; if (new Set(k).size !== 4) bad("why dup"); if (w.wrong.some(x => !x[1])) bad("why missing reason"); }

/* new practicals */
chk("limits 62/17/12.05", 5000 / 100 + 12 === 62 && 5000 / 1000 + 12 === 17 && Math.abs(5000 / 100000 + 12 - 12.05) < 1e-9);
chk("fracpow $30/$15/$10", 300 / Math.sqrt(100) === 30 && 300 / Math.sqrt(400) === 15 && 300 / Math.sqrt(900) === 10);
chk("ratrad q=300 → $18, q=400", Math.sqrt(1800 / 0.02) === 300 && Math.abs(1800 / 300 + 6 + 0.02 * 300 - 18) < 1e-9 && Math.abs(Math.sqrt(3200 / 0.02) - 400) < 1e-9);
chk("graphs R′ roots 2, 7", [2, 7].every(m => 6 * m * m - 54 * m + 84 === 0));
chk("sketch week 5, 10", 30 - 6 * 5 === 0 && 30 * 10 - 3 * 100 === 0);
chk("bearings 10 km, N53E", Math.hypot(8, 6) === 10 && Math.round(Math.atan(8 / 6) * 180 / Math.PI) === 53 && Math.hypot(5, 12) === 13);
chk("triple 24 and 36", dot([4, 0, 0], cross([1, 3, 0], [0, 1, 2])) === 24 && dot([4, 0, 0], cross([1, 3, 0], [0, 1, 3])) === 36);
chk("lines2d 300 and 200", Math.abs(30 + 0.1 * 300 - (45 + 0.05 * 300)) < 1e-9 && Math.abs(30 + 0.1 * 200 - (20 + 0.15 * 200)) < 1e-9);
chk("planeforms (5,10,20)", 4 * 5 + 6 * 10 + 2 * 20 === 120);
chk("planesys 15000/7500/7500 and 20000/0/10000", Math.abs(0.02 * 15000 + 0.04 * 7500 + 0.06 * 7500 - 1050) < 1e-9 && Math.abs(0.02 * 20000 + 0.06 * 10000 - 1000) < 1e-9);
chk("skew 30 and 15", dot([0, 50, 30], cross([1, 0, 0], [0, 1, 0])) === 30 && dot([0, 50, 15], cross([1, 0, 0], [0, 1, 0])) === 15);

console.log(fails === 0 ? "ALL CHECKS PASSED: " + total + " problems across " + CP.STEPS.length + " steps (" + (total - spotN - revN - ctxN) + " forward at 3 tiers, " + ctxN + " real situations, " + spotN + " spot the error, " + revN + " work backwards), " + CP.STEPS.length + " real-life calculations x 3 data sets, " + CP.WHY.length + " why-questions, " + Object.values(CP.NOTES).reduce((a, x) => a + x.length, 0) + " real-life notes" : fails + " FAILURES");
process.exit(fails ? 1 : 0);
