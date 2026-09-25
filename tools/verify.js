/* Verifies every generator at every tier: the marked answer is right, no wrong option is secretly
   also right, every wrong option carries an explanation, every problem has a walk-through.
   Also exercises every step's real-life calculation with fallback and with perturbed live data.
   Run: node tools/verify.js */
const fs = require("fs"), path = require("path"), vm = require("vm");
const docs = path.join(__dirname, "..", "docs", "js");
const ctx = { window: {}, Math, Number, String, Array, Object, Set, Error, console };
ctx.window.CP = {}; ctx.CP = ctx.window.CP; /* browser: window is the global object */
vm.createContext(ctx);
for (const f of ["content.js", "generators.js"]) vm.runInContext(fs.readFileSync(path.join(docs, f), "utf8"), ctx, { filename: f });
const CP = ctx.window.CP;

const numd = (f, x) => { const h = 1e-5; return (f(x + h) - f(x - h)) / (2 * h); };
const close = (a, b, t = 1e-4) => Math.abs(a - b) <= t * Math.max(1, Math.abs(a), Math.abs(b));
const xs = [0.37, 1.21, -0.83, 2.05, -1.67];
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const sub = (a, b) => a.map((x, i) => x - b[i]);
const isZero = v => v.every(x => x === 0);
const to3 = v => v.length === 2 ? [v[0], v[1], 0] : v;
const parallel = (a, b) => isZero(cross(to3(a), to3(b)));
const keyOf = h => String(h).replace(/<[^>]+>/g, "").replace(/\s+/g, "");

let fails = 0, total = 0;
const bad = m => { if (fails < 30) console.log("FAIL", m); fails++; };

for (const st of CP.STEPS) {
  for (const tier of [0, 1, 2]) {
    let n = 0;
    for (let i = 0; i < 1500; i++) {
      let p; try { p = CP.build(st.id, tier); } catch (e) { bad(st.id + "/" + tier + " build: " + e.message); continue; }
      n++; total++;
      const tag = st.id + "/" + tier;
      if (p.options.length !== 4) bad(tag + " opts=" + p.options.length);
      if (p.options.filter(o => o.ok).length !== 1) bad(tag + " ok count");
      const keys = p.options.map(o => keyOf(o.html)); if (new Set(keys).size !== keys.length) bad(tag + " dup keys");
      if (p.options.some(o => !o.ok && !o.why)) bad(tag + " wrong option missing explanation");
      const c = p.options.find(o => o.ok), W = p.options.filter(o => !o.ok);
      if (p.src && c.f) { for (const x of xs) if (!close(c.f(x), numd(p.src, x), 1e-3)) { bad(tag + " derivative wrong @" + x + " " + c.html); break; } }
      for (const w of W) { if (w.f && c.f && xs.every(x => close(w.f(x), c.f(x), 1e-9))) bad(tag + " distractor equals correct: " + w.html); }
      if (p.truthN !== undefined && Math.abs(c.n - p.truthN) > 1e-6) bad(tag + " numeric wrong " + c.n + " vs " + p.truthN);
      for (const w of W) { if (typeof w.n === "number" && !isNaN(w.n) && Math.abs(w.n - c.n) < 1e-12) bad(tag + " numeric distractor equals correct"); }
      if (p.truthV && c.v.join() !== p.truthV.join()) bad(tag + " vector wrong");
      for (const w of W) { if (w.v && c.v && w.v.join() === c.v.join()) bad(tag + " vector distractor equals correct"); }
      if (p.perpTo) { if (dot(c.v, p.perpTo) !== 0) bad(tag + " perp correct not perp"); for (const w of W) if (dot(w.v, p.perpTo) === 0) bad(tag + " perp distractor is perp"); }
      if (p.dirOf) { for (const w of W) if (isZero(w.v) || parallel(w.v, p.dirOf)) bad(tag + " direction distractor is valid: " + w.html); }
      if (p.onLine) { const on = v => isZero(cross(sub(v, p.onLine.P), p.onLine.d)); if (!on(c.v)) bad(tag + " line correct not on line"); for (const w of W) if (on(w.v)) bad(tag + " line distractor on line " + w.html); }
      if (!p.walk || !p.walk.length) bad(tag + " no walkthrough");
      const fz = CP.freeze(p, st.id, tier); if (JSON.stringify(fz).length < 50) bad(tag + " freeze broken");
    }
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
for (const w of CP.WHY) { if (w.wrong.length !== 3) bad("why count"); const k = [w.right, ...w.wrong.map(x => x[0])]; if (new Set(k).size !== 4) bad("why dup"); if (w.wrong.some(x => !x[1])) bad("why missing reason"); }

console.log(fails === 0 ? "ALL CHECKS PASSED: " + total + " problems across " + CP.STEPS.length + " steps x 3 tiers, 14 real-life calculations x 3 data sets, " + CP.WHY.length + " why-questions" : fails + " FAILURES");
process.exit(fails ? 1 : 0);
