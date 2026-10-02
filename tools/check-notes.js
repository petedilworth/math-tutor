/* Checks the worked "where this shows up" notes in docs/js/notes/*.js.
   Every note must build against three sets of live data, show 3 to 5 lines of working, have no broken numbers,
   and a live note must actually change with the data. Each step needs 8 notes: at least 3 finance, 3 other.
   Run: node tools/check-notes.js            (all files)
        node tools/check-notes.js --print exp (also prints that step's notes as text)
        node tools/check-notes.js --only u2a.js --print pow1 (one file only) */
const fs = require("fs"), path = require("path"), vm = require("vm");
const docs = path.join(__dirname, "..", "docs", "js");
const ctx = { window: {}, console }; ctx.window.CP = {}; ctx.CP = ctx.window.CP; vm.createContext(ctx);
for (const f of ["content.js", "content-more.js", "content-full.js", "notes-kit.js"]) vm.runInContext(fs.readFileSync(path.join(docs, f), "utf8"), ctx, { filename: f });
const only = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;
const files = only ? [only] : fs.readdirSync(path.join(docs, "notes")).filter(f => f.endsWith(".js")).sort();
for (const f of files) vm.runInContext(fs.readFileSync(path.join(docs, "notes", f), "utf8"), ctx, { filename: "notes/" + f });
const CP = ctx.CP, F = CP.LIVE_FALLBACK;
const LIVES = [F, Object.assign({}, F, { usdcad: 1.41, usdcad30: 1.33, policy: 5.0, bond5: 4.2, bond10: 4.6, eurcad: 1.52, gbpcad: 1.69 }),
               Object.assign({}, F, { usdcad: 1.2512, usdcad30: 1.2611, policy: 0.25, bond5: 0.9, bond10: 1.4, eurcad: 1.45, gbpcad: 1.75 })];
let fails = 0; const bad = m => { if (fails < 60) console.log("FAIL", m); fails++; };
const junk = /NaN|undefined|Infinity|null|\[object/;
const strip = s => String(s).replace(/<sup>(.*?)<\/sup>/g, "^$1").replace(/<[^>]+>/g, "");
const want = process.argv.includes("--print") ? process.argv[process.argv.indexOf("--print") + 1] : null;
let notes = 0;
for (const id of Object.keys(CP.NOTES)) {
  if (!CP.stepById(id)) bad("notes for unknown step " + id);
  const pool = CP.NOTES[id];
  if (pool.length !== 8) bad(id + " has " + pool.length + " notes, needs 8");
  const fin = pool.filter(n => n.k === "Finance").length;
  if (fin < 3 || pool.length - fin < 3) bad(id + " needs at least 3 finance and 3 other notes; has " + fin + " finance");
  if (new Set(pool.map(n => n.t)).size !== pool.length) bad(id + " repeats a title");
  pool.forEach((n, i) => {
    const tag = id + "#" + (i + 1) + " " + n.t;
    if (!n.k || !n.t || typeof n.build !== "function") { bad(tag + " missing k, t or build"); return; }
    if (n.live && !CP.LIVE_NAMES[n.live]) bad(tag + " unknown live key " + n.live);
    const outs = [];
    for (const L of LIVES) {
      let w; try { w = n.build(L); } catch (e) { bad(tag + " threw: " + e.message); return; }
      if (!w || !w.setup || !w.take || !Array.isArray(w.lines)) { bad(tag + " needs setup, lines, take"); return; }
      if (w.lines.length < 3 || w.lines.length > 5) bad(tag + " has " + w.lines.length + " lines; needs 3 to 5");
      if (w.lines.some(l => !Array.isArray(l) || l.length !== 3 || l.some(x => typeof x !== "string"))) bad(tag + " each line must be [label, calculation, result] strings");
      if (!w.lines[w.lines.length - 1][2]) bad(tag + " last line needs a result");
      const text = [w.setup, w.take, w.source || ""].concat(w.lines.flat()).join(" | ");
      if (junk.test(text)) bad(tag + " broken text: " + strip(text).slice(0, 200));
      if (w.setup.length > 260) bad(tag + " setup too long (" + w.setup.length + ")");
      if (w.take.length > 300) bad(tag + " take too long (" + w.take.length + ")");
      outs.push(JSON.stringify(w));
    }
    if (n.live && outs[0] === outs[1] && outs[1] === outs[2]) bad(tag + " is marked live but ignores the data");
    notes++;
    if (want === id) {
      const w = n.build(F);
      console.log("\n[" + n.k + "] " + n.t + (n.live ? "  (live: " + n.live + ")" : "") + "\n  " + strip(w.setup));
      for (const l of w.lines) console.log("    " + strip(l[0]).padEnd(18) + strip(l[1]).padEnd(52) + strip(l[2]));
      console.log("  → " + strip(w.take));
    }
  });
}
const missing = CP.STEPS.filter(s => !CP.NOTES[s.id]).map(s => s.id);
if (process.argv.includes("--all") && missing.length) bad("steps without worked notes: " + missing.join(", "));
console.log(fails ? fails + " FAILURES" : "NOTES OK: " + notes + " worked notes across " + Object.keys(CP.NOTES).length + " steps" + (missing.length ? " (" + missing.length + " steps still to do)" : ""));
process.exit(fails ? 1 : 0);
