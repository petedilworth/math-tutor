/* Checks the full lessons in docs/js/lessons/*.js.
   node tools/check-lessons.js            check every lesson file
   node tools/check-lessons.js --only u3a.js
   node tools/check-lessons.js --all      also require a lesson for every step
   node tools/check-lessons.js --print trigexp   print one lesson as text
   For every "try this" challenge it searches the states the picture can reach and fails if none meets it,
   or if the challenge is already met before the reader touches anything. */
const fs = require("fs"), path = require("path");
global.window = global; global.CP = {};
const D = path.join(__dirname, "..", "docs", "js");
const load = f => { (0, eval)(fs.readFileSync(path.join(D, f), "utf8")); };
["content.js", "content-more.js", "content-full.js", "widgets.js"].forEach(load);
const args = process.argv.slice(2), only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const files = fs.readdirSync(path.join(D, "lessons")).filter(f => f.endsWith(".js") && (!only || f === only)).sort();
for (const f of files) load("lessons/" + f);
const LES = CP.LESSONS || {};

if (args.includes("--print")) {
  const id = args[args.indexOf("--print") + 1], l = LES[id], strip = s => String(s).replace(/<sup>(.*?)<\/sup>/g, "^$1").replace(/<sub>(.*?)<\/sub>/g, "_$1").replace(/<[^>]+>/g, "");
  if (!l) { console.log("no lesson " + id); process.exit(1); }
  console.log("# " + CP.stepById(id).name + "\n" + strip(l.big) + "\n");
  l.intro.forEach(p => console.log(strip(p) + "\n"));
  l.see.forEach(b => { console.log("## " + strip(b.h) + "  [" + b.widget.type + (b.widget.mode ? ":" + b.widget.mode : "") + "]\n" + strip(b.text || "")); (b.tasks || []).forEach((t, i) => console.log("  " + (i + 1) + ". " + strip(t.ask) + "\n     → " + strip(t.got))); if (b.after) console.log("  AFTER: " + strip(b.after)); console.log(""); });
  console.log("## Why\n" + strip(l.why.lead)); l.why.steps.forEach(s => console.log("  " + strip(s[0]) + "   // " + strip(s[1] || ""))); if (l.why.end) console.log(strip(l.why.end));
  console.log("\n## Examples"); l.examples.forEach(e => { console.log("Q: " + strip(e.q)); e.steps.forEach(s => console.log("  " + strip(s[0]) + "   // " + strip(s[1] || ""))); console.log("  A: " + strip(e.a)); });
  console.log("\n## Mistakes"); l.mistakes.forEach(m => console.log("✗ " + strip(m.wrong) + "\n  " + strip(m.why) + "\n✓ " + strip(m.fix)));
  console.log("\n## Teaching"); l.teach.script.forEach((s, i) => console.log((i + 1) + ". " + strip(s))); console.log("Board: " + strip(l.teach.board || "")); l.teach.ask.forEach(a => console.log("? " + strip(a.q) + "\n  listen: " + strip(a.listen))); console.log("Confusion: " + strip(l.teach.confusion));
  console.log("\n## Recap"); l.recap.forEach(r => console.log("- " + strip(r)));
  process.exit(0);
}

const errs = [];
const bad = (id, m) => errs.push(id + ": " + m);
const str = (v, max) => typeof v === "string" && v.trim().length > 0 && (!max || v.replace(/<[^>]+>/g, "").length <= max);
const text = [];
const need = (cfg, keys, id, where) => keys.forEach(k => { if (cfg[k] == null) bad(id, where + " needs " + k); });
const isNum = x => typeof x === "number" && isFinite(x);
const fin = a => Array.isArray(a) && a.every(isNum);

function initial(cfg) {
  const W = CP.W, ST = W.ST, t = cfg.type;
  if (t === "tracer") { const xr = cfg.x || [-5, 5]; return ST.tracer(cfg, { x: cfg.x0 != null ? cfg.x0 : (xr[0] + xr[1]) / 2, p: cfg.param ? cfg.param.val : undefined, h: cfg.secant ? (cfg.secant.h0 || 1) : 0, covered: 1 / 120, ghost: !!cfg.ghostOn }); }
  if (t === "limit") return ST.limit(cfg, 0);
  if (t === "blocks") return ST.blocks(cfg, cfg.mode || (cfg.modes || ["mul"])[0], cfg.m != null ? cfg.m : 3, cfg.n != null ? cfg.n : 2);
  if (t === "area") { const xr = cfg.x || [0.5, 3]; return ST.area(cfg, cfg.x0 != null ? cfg.x0 : (xr[0] + xr[1]) / 2, cfg.dx0 || 0.3); }
  if (t === "chain") { const xr = cfg.x || [0, 3]; return ST.chain(cfg, cfg.x0 != null ? cfg.x0 : (xr[0] + xr[1]) / 2, cfg.dx0 || 0.1); }
  if (t === "motion") return ST.motion(cfg, cfg.t0 != null ? cfg.t0 : (cfg.t || [0, 5])[0]);
  if (t === "optim") { const x = cfg.x0 != null ? cfg.x0 : (cfg.x[0] + cfg.x[1]) / 2; return ST.optim(cfg, x, [x, cfg.obj(x)]); }
  if (t === "sign") return ST.sign(cfg, 0);
  if (t === "vec2") return ST.vec2(cfg, cfg.u || [3, 1], cfg.v || [1, 3], cfg.k != null ? cfg.k : 2, cfg.t0 != null ? cfg.t0 : 1, (cfg.legs || [[60, 5], [150, 3]]));
  if (t === "vec3") { const p = {}; (cfg.params || []).forEach(q => p[q.name] = q.val); return ST.vec3(cfg, p, 0, 0); }
}

function checkWidget(id, cfg, where) {
  if (!cfg || !CP.W.TYPES.includes(cfg.type)) { bad(id, where + " has an unknown widget type " + (cfg && cfg.type)); return false; }
  const t = cfg.type;
  try {
    if (t === "tracer") {
      need(cfg, ["f", "x", "label"], id, where);
      const ps = cfg.param ? [cfg.param.min, cfg.param.val, cfg.param.max] : [undefined];
      if (cfg.param) need(cfg.param, ["name", "min", "max", "val"], id, where + " param");
      for (const p of ps) { let ok = 0; for (let i = 0; i <= 200; i++) { const x = cfg.x[0] + (cfg.x[1] - cfg.x[0]) * i / 200; if (isFinite(cfg.f(x, p))) ok++; } if (ok < 140) bad(id, where + " curve is undefined across most of its x range (p = " + p + ")"); }
      if (cfg.ticks != null && cfg.ticks !== "pi" && !isNum(cfg.ticks)) bad(id, where + " ticks must be \"pi\" or a number");
      if (cfg.ghost && !cfg.ghostLabel) bad(id, where + " ghost needs ghostLabel");
    }
    if (t === "limit") { need(cfg, ["f", "a", "label"], id, where); }
    if (t === "area") { need(cfg, ["u", "v", "x"], id, where); }
    if (t === "chain") { need(cfg, ["inner", "outer", "x"], id, where); }
    if (t === "motion") { need(cfg, ["s", "t"], id, where); }
    if (t === "optim") {
      need(cfg, ["x", "obj", "draw", "objLabel", "xLabel"], id, where);
      for (let i = 0; i <= 20; i++) { const x = cfg.x[0] + (cfg.x[1] - cfg.x[0]) * i / 20, d = cfg.draw(x); if (typeof d !== "string" || /NaN|undefined|Infinity/.test(d)) { bad(id, where + " draw(" + x + ") gives bad SVG"); break; } }
    }
    if (t === "sign") { if (!fin(cfg.c) || cfg.c.length < 3) bad(id, where + " sign needs c, polynomial coefficients from the constant up"); }
    if (t === "vec2") { if (!["add", "sub", "scale", "comp", "dot", "bearing", "line"].includes(cfg.mode || "add")) bad(id, where + " unknown vec2 mode " + cfg.mode); }
    if (t === "vec3") {
      need(cfg, ["scene"], id, where);
      let n = 0;
      for (const st of CP.W.sample(cfg)) {
        if (n++ > 3000) break;
        const objs = cfg.scene(st, CP.V);
        if (!Array.isArray(objs) || !objs.length) { bad(id, where + " scene returns nothing"); break; }
        for (const o of objs) {
          const pts = o.t === "vec" ? [o.to].concat(o.from ? [o.from] : []) : o.t === "pt" ? [o.at] : o.t === "seg" ? [o.a, o.b] : o.t === "line" ? [o.p, o.d] : o.t === "plane" ? [o.n] : o.t === "poly" ? o.pts : null;
          if (!pts) { bad(id, where + " scene object has unknown t " + o.t); n = 1e9; break; }
          if (!pts.every(p => Array.isArray(p) && p.length === 3 && fin(p)) || (o.t === "plane" && !isNum(o.d))) { bad(id, where + " scene gives a bad " + o.t + " at " + JSON.stringify(st)); n = 1e9; break; }
        }
      }
      for (const r of (cfg.readouts || [])) { const p = initial(cfg); const v = r.value(p, CP.V); if (typeof v !== "string" || /NaN|undefined|Infinity/.test(v)) bad(id, where + " readout " + r.label + " gives " + v); }
    } else {
      for (const r of (cfg.readouts || [])) { const v = r.value(initial(cfg)); if (typeof v !== "string" || /NaN|Infinity/.test(v)) bad(id, where + " readout " + r.label + " gives " + v); }
    }
  } catch (e) { bad(id, where + " widget throws: " + e.message); return false; }
  return true;
}

const ids = Object.keys(LES);
for (const id of ids) {
  const l = LES[id], st = CP.stepById(id);
  if (!st) { bad(id, "no such step"); continue; }
  if (!str(l.big, 240)) bad(id, "big must be one idea in at most 240 characters");
  if (!Array.isArray(l.intro) || l.intro.length < 1 || l.intro.length > 3 || !l.intro.every(p => str(p, 520))) bad(id, "intro must be 1 to 3 paragraphs of at most 520 characters");
  if (!Array.isArray(l.see) || l.see.length < 1 || l.see.length > 3) bad(id, "see must have 1 to 3 pictures");
  let nTasks = 0;
  (l.see || []).forEach((b, i) => {
    const where = "picture " + (i + 1);
    if (!str(b.h, 70)) bad(id, where + " needs a heading h of at most 70 characters");
    if (b.text && !str(b.text, 420)) bad(id, where + " text is over 420 characters");
    if (b.after && !str(b.after, 480)) bad(id, where + " after is over 480 characters");
    if (!checkWidget(id, b.widget, where)) return;
    const tasks = b.tasks || [];
    nTasks += tasks.length;
    if (tasks.length > 6) bad(id, where + " has more than 6 challenges");
    tasks.forEach((t, j) => { if (!str(t.ask, 200) || !str(t.got, 260) || typeof t.check !== "function") bad(id, where + " challenge " + (j + 1) + " needs ask (≤200), got (≤260) and check()"); });
    if (!tasks.length) return;
    const st0 = initial(b.widget);
    try { if (tasks[0].check(st0)) bad(id, where + " challenge 1 is already met before the reader does anything"); } catch (e) {}
    const met = tasks.map(() => false); let n = 0;
    for (const s of CP.W.sample(b.widget)) { n++; tasks.forEach((t, j) => { if (!met[j]) { try { if (t.check(s)) met[j] = true; } catch (e) {} } }); if (met.every(Boolean)) break; }
    met.forEach((m, j) => { if (!m) bad(id, where + " challenge " + (j + 1) + " can never be met: “" + tasks[j].ask.replace(/<[^>]+>/g, "") + "”"); });
  });
  if (nTasks < 3) bad(id, "needs at least 3 try-this challenges across its pictures (has " + nTasks + ")");
  if (!l.why || !str(l.why.lead, 600) || !Array.isArray(l.why.steps) || l.why.steps.length < 3 || l.why.steps.length > 10) bad(id, "why needs a lead (≤600) and 3 to 10 steps");
  else l.why.steps.forEach((s, j) => { if (!Array.isArray(s) || !str(s[0], 160)) bad(id, "why step " + (j + 1) + " needs [maths, words] with maths ≤160"); });
  if (l.why && l.why.end && !str(l.why.end, 520)) bad(id, "why.end is over 520 characters");
  if (!Array.isArray(l.examples) || l.examples.length !== 3) bad(id, "needs exactly 3 examples, easy to hard");
  else l.examples.forEach((e, j) => { if (!str(e.q, 240) || !str(e.a, 200) || !Array.isArray(e.steps) || e.steps.length < 2 || e.steps.length > 7 || !e.steps.every(s => Array.isArray(s) && str(s[0], 160))) bad(id, "example " + (j + 1) + " needs q, a and 2 to 7 [maths, words] steps"); });
  if (!Array.isArray(l.mistakes) || l.mistakes.length < 3 || l.mistakes.length > 4 || !l.mistakes.every(m => str(m.wrong, 160) && str(m.why, 320) && str(m.fix, 200))) bad(id, "needs 3 or 4 mistakes with wrong, why and fix");
  const T = l.teach;
  if (!T || !Array.isArray(T.script) || T.script.length < 4 || T.script.length > 6 || !T.script.every(s => str(s, 260))) bad(id, "teach.script needs 4 to 6 lines of at most 260 characters");
  if (!T || !Array.isArray(T.ask) || T.ask.length !== 3 || !T.ask.every(a => str(a.q, 200) && str(a.listen, 260))) bad(id, "teach.ask needs exactly 3 {q, listen}");
  if (!T || !str(T.confusion, 520)) bad(id, "teach.confusion needed (≤520)");
  if (T && T.board != null && !str(T.board, 300)) bad(id, "teach.board is over 300 characters");
  if (!Array.isArray(l.recap) || l.recap.length !== 3 || !l.recap.every(r => str(r, 200))) bad(id, "recap needs exactly 3 lines of at most 200 characters");
  /* every piece of text, for the house style checks */
  const all = [l.big].concat(l.intro, (l.see || []).flatMap(b => [b.h, b.text, b.after].concat((b.tasks || []).flatMap(t => [t.ask, t.got]))),
    l.why ? [l.why.lead, l.why.end].concat((l.why.steps || []).flat()) : [], (l.examples || []).flatMap(e => [e.q, e.a].concat((e.steps || []).flat())),
    (l.mistakes || []).flatMap(m => [m.wrong, m.why, m.fix]), T ? [T.board, T.confusion].concat(T.script || [], (T.ask || []).flatMap(a => [a.q, a.listen])) : [], l.recap || []).filter(Boolean);
  for (const s of all) {
    if (/—/.test(s)) bad(id, "uses an em dash: “" + s.slice(0, 60) + "”");
    if (/\bNaN\b|\bundefined\b|\[object/.test(s)) bad(id, "broken text: “" + s.slice(0, 60) + "”");
    if (/(^|[^<])\/?(script|iframe)/i.test(s) && /<\s*(script|iframe)/i.test(s)) bad(id, "no scripts in lesson text");
    const open = (s.match(/<sup>/g) || []).length, close = (s.match(/<\/sup>/g) || []).length; if (open !== close) bad(id, "unbalanced <sup> in “" + s.slice(0, 60) + "”");
    text.push(s);
  }
}
if (args.includes("--all")) for (const s of CP.STEPS) if (!LES[s.id]) bad(s.id, "has no full lesson");
if (errs.length) { console.log(errs.join("\n")); console.log("\nLESSONS FAILED: " + errs.length + " problems"); process.exit(1); }
console.log("LESSONS OK: " + ids.length + " full lessons (" + (CP.STEPS.length - ids.length) + " steps still to do), " + ids.reduce((n, id) => n + LES[id].see.reduce((m, b) => m + (b.tasks || []).length, 0), 0) + " challenges all reachable");
