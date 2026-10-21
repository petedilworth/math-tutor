/* Chalk and Paper – one step's record: the tier ladder, accuracy by week, and every question ever answered on it.
   The app shows it at #step/<id>; the read-only share page shows the same thing for a shared record.
   Also the map square (CP.stepView.pip), so the app and the share page draw it the same way. */
window.CP = window.CP || {};
(function () {
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const tierName = t => CP.TIERS[t] || "";
const modeLabel = it => it.mode === "spot" ? " · spot the error" : it.mode === "rev" ? " · work backwards" : it.mode === "ctx" ? " · real life" : "";
const SRC = { skill: "Daily lesson", review: "Review", stepback: "Step back", practice: "Practice", test: "Test", scenario: "Real situation", practical: "Real life", demo: "Worked example" };
const fmtDate = t => new Date(t).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
const fmtDay = iso => new Date(iso + "T12:00:00").toLocaleDateString("en-CA", { month: "short", day: "numeric" });
const clockTxt = ms => ms == null ? "" : (ms / 1000).toFixed(ms < 10000 ? 1 : 0) + " s";

/* ---- the question, read back ---- */
function optionsHtml(it, answeredIx) {
  const prose = it.prose, spot = it.mode === "spot";
  return '<div class="opts' + (prose ? " one" : "") + '">' + it.options.map((o, i) => {
    let cls = "opt" + (prose ? " prose" : "") + (spot ? " line" : "") + (o.ok ? " right" : i === answeredIx ? " wrong" : " faded");
    const mark = o.ok ? "✓" : i === answeredIx ? "✗" : spot ? String(i + 1) : String.fromCharCode(65 + i);
    return '<button type="button" class="' + cls + '" disabled><span class="ok">' + mark + '</span><span class="ov">' + o.html + '</span></button>';
  }).join("") + '</div>';
}
function explainHtml(it, chosenIx) {
  const chosen = it.options[chosenIx];
  let h = chosen && !chosen.ok && chosen.why ? '<div class="mistake"><span class="lbl">What went wrong</span>' + chosen.why + '</div>' : "";
  if (it.mode === "spot" && it.fix) { const b = it.options.findIndex(o => o.ok); h += '<div class="fixbox"><span class="lbl">The mistake is in line ' + (b + 1) + '</span>' + (it.spotWhy || "") + '<br>It should read: <span class="m">' + it.fix + '</span></div>'; }
  return h;
}
const walkTitle = it => it.mode === "spot" ? "The working, corrected" : it.mode === "rev" ? "How to work backwards" : "How to get it";
function questionBody(q, c) {
  if (!q) return '<p class="note">The question text was dropped to keep the record small. The answer still counts.</p>';
  let h = (q.task ? '<p class="task">' + q.task + '</p>' : "") + (q.expr ? '<p class="expr' + (q.prose ? " q" : "") + '">' + q.expr + '</p>' : "");
  if (q.setup) h += '<p class="prose">' + q.setup + '</p>';
  h += optionsHtml(q, c) + '<div class="fb">' + explainHtml(q, c);
  if (q.walk) h += '<p class="h4">' + walkTitle(q) + '</p><div class="walk">' + q.walk.map(w => '<div class="w">' + w + '</div>').join("") + '</div>';
  else if (q.answer) h += '<p class="h4">The answer</p><p class="prose">' + q.answer + (q.why ? " " + q.why : "") + '</p>';
  return h + '</div>';
}

/* ---- the map square: the step number, five tier bars, tinted by recent accuracy. No other states: the bars and the tint say it all ---- */
CP.stepView = {};
CP.stepView.pip = function (step) {
  const ss = CP.stepState(step.id), acc = CP.recentAcc(step.id);
  const tint = acc == null ? "" : acc >= 0.8 ? " hi" : acc >= 0.5 ? " mid" : " lo";
  const lit = ss.attempts ? ss.tier + 1 : 0;
  const title = step.name + (ss.attempts ? " · " + tierName(ss.tier) + " · " + Math.round(acc * 100) + "% of the last " + Math.min(10, ss.attempts) : " · not started");
  return '<span class="pip' + tint + '" title="' + esc(title) + '"><b>' + step.order + '</b><span class="tb">' + [0, 1, 2, 3, 4].map(i => '<i class="' + (i < lit ? "on" : "") + '"></i>').join("") + '</span></span>';
};

/* ---- the tier ladder ---- */
function ladderHtml(id) {
  const ss = CP.stepState(id), tp = CP.tierProgress(id);
  const rows = CP.TIERS.map((n, i) => {
    const st = ss.tierStats[i], state = !ss.attempts ? "todo" : i < ss.tier ? "done" : i === ss.tier ? "cur" : i <= ss.bestTier ? "best" : "todo";
    const when = i === 0 ? null : ss.tierReached && ss.tierReached[i];
    return '<div class="lad ' + state + '"><span class="ln"><i></i>' + n + '</span><span class="lv">' + (st.a ? Math.round(100 * st.c / st.a) + '% of ' + st.a : state === "todo" ? "" : "no answers") + '</span><span class="ld">' + (when ? "reached " + fmtDay(when) : state === "cur" ? "now" : state === "best" ? "reached before" : "") + '</span></div>';
  }).join("");
  const next = !ss.attempts ? "Answer a question to start at Easy." : tp.tier >= CP.TOP_TIER ? "Top tier. Tests and reviews keep it sharp." : tp.need === 0 ? "Next right answer moves you up." : tp.need + " more right in a row moves you up to " + tierName(tp.tier + 1) + ". Two misses in a row moves down.";
  return '<div class="ladder">' + rows + '</div><p class="note" style="margin-top:8px">' + next + '</p>';
}

/* ---- accuracy by week: one series, so no legend; columns at most 24px, rounded at the top only ---- */
function weeksHtml(id) {
  const W = CP.stepWeeks(id, 10), any = W.some(w => w.a);
  if (!any) return '<p class="note">Nothing answered in the last ten weeks.</p>';
  const w = 340, h = 128, x0 = 8, y0 = 10, ph = 84, base = y0 + ph, slot = (w - x0 * 2) / W.length, bw = Math.min(24, slot - 6);
  let s = '<line x1="' + x0 + '" x2="' + (w - x0) + '" y1="' + base + '" y2="' + base + '" class="ax"/>';
  [0.5, 1].forEach(g => { const y = base - g * ph; s += '<line x1="' + x0 + '" x2="' + (w - x0) + '" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '" class="gr"/><text x="' + (w - x0) + '" y="' + (y - 3).toFixed(1) + '" class="gl" text-anchor="end">' + (g * 100) + '%</text>'; });
  W.forEach((wk, i) => {
    const cx = x0 + slot * i + slot / 2, x = cx - bw / 2;
    if (!wk.a) s += '<rect x="' + x.toFixed(1) + '" y="' + (base - 2) + '" width="' + bw + '" height="2" class="empty"/>';
    else {
      const acc = wk.c / wk.a, hh = Math.max(4, acc * ph), y = base - hh, r = Math.min(4, hh / 2);
      s += '<path d="M' + x.toFixed(1) + ' ' + base + 'V' + (y + r).toFixed(1) + 'a' + r + ' ' + r + ' 0 0 1 ' + r + ' -' + r + 'H' + (x + bw - r).toFixed(1) + 'a' + r + ' ' + r + ' 0 0 1 ' + r + ' ' + r + 'V' + base + 'Z" class="bar"><title>' + fmtDay(wk.from) + ' to ' + fmtDay(wk.to) + ': ' + wk.c + ' of ' + wk.a + ' right</title></path>';
      s += '<text x="' + cx.toFixed(1) + '" y="' + (y - 4).toFixed(1) + '" class="vl" text-anchor="middle">' + wk.c + '/' + wk.a + '</text>';
    }
    if (i % 3 === 0 || i === W.length - 1) s += '<text x="' + cx.toFixed(1) + '" y="' + (base + 14) + '" class="gl" text-anchor="middle">' + fmtDay(wk.from) + '</text>';
  });
  const table = '<details class="wtab"><summary>As a table</summary><table><tr><th>Week of</th><th>Answered</th><th>Right</th><th>Accuracy</th></tr>' + W.filter(x => x.a).map(x => '<tr><td>' + fmtDay(x.from) + '</td><td>' + x.a + '</td><td>' + x.c + '</td><td>' + Math.round(100 * x.c / x.a) + '%</td></tr>').join("") + '</table></details>';
  return '<svg class="wk" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Accuracy by week">' + s + '</svg>' + table;
}

/* ---- every answer ---- */
const FILTERS = [["all", "All"], ["wrong", "Wrong only"], ["lesson", "Lessons"], ["practice", "Practice"], ["test", "Tests"]];
const inFilter = (h, f) => f === "all" || (f === "wrong" ? !h.ok : f === "lesson" ? !["practice", "test"].includes(h.src) : h.src === f);
function listHtml(list, f, limit) {
  const rows = list.filter(h => inFilter(h, f));
  if (!rows.length) return '<p class="note" style="padding:8px 0">Nothing here yet.</p>';
  return rows.slice(0, limit).map(h => {
    const q = h.q;
    return '<details class="rq"><summary><span class="mk ' + (h.ok ? "y" : "n") + '">' + (h.ok ? "✓" : "✗") + '</span><span>' + fmtDate(h.t) + ' · ' + (SRC[h.src] || h.src) + (h.tier != null ? ' · ' + tierName(h.tier).toLowerCase() : "") + (q ? modeLabel(q) : "") +
      (q && q.expr && !q.prose ? ' <span class="m" style="font-size:.9em;color:var(--ink-3)">' + q.expr + '</span>' : "") + (h.ms ? ' <span class="mono">' + clockTxt(h.ms) + '</span>' : "") + '</span></summary><div class="body">' + questionBody(q, h.c) + '</div></details>';
  }).join("") + (rows.length > limit ? '<button type="button" class="btn ghost block hmore" data-n="' + (limit + 40) + '">Show ' + Math.min(40, rows.length - limit) + ' more of ' + rows.length + '</button>' : "");
}

/* ---- the whole page ---- */
CP.stepView.html = function (id, opts) {
  opts = opts || {};
  const step = CP.stepById(id); if (!step) return '<p class="small">No such step.</p>';
  const ss = CP.stepState(id), unit = CP.unitOf(id), list = CP.stepHistory(id), rec = CP.lessonRecord ? CP.lessonRecord(id) : null;
  const wrong = list.filter(h => !h.ok).length, acc = ss.attempts ? Math.round(100 * ss.correct / ss.attempts) : null;
  const status = CP.mastered(id) ? (CP.due(id) ? ["due", "Mastered · due for review"] : ["done", "Mastered"]) : ss.attempts ? ["prog", tierName(ss.tier) + " tier"] : ["new", "Not started"];
  const who = opts.name ? esc(opts.name) + "’s" : "your";
  let h = '<section class="lhero"><p class="kicker">' + esc(unit.name) + ' · step ' + step.order + ' of ' + CP.STEPS.length + ' · ' + esc(step.code) + '</p><h1 style="font-size:26px">' + esc(step.name) + '</h1>' +
    '<p class="lede" style="font-size:16px;margin-bottom:10px">' + step.rule.r + '</p><div class="lstatus"><span class="lchip ' + status[0] + '">' + status[1] + '</span>' +
    (ss.attempts ? '<span class="lchip">' + ss.attempts + ' answered · ' + acc + '%</span>' : "") + (wrong ? '<span class="lchip">' + wrong + ' wrong</span>' : "") +
    (ss.bestMs ? '<span class="lchip">fastest ' + clockTxt(ss.bestMs) + '</span>' : "") + (rec ? '<span class="lchip">full lesson read' + (rec.best != null ? " · check " + rec.best + "/3" : "") + '</span>' : "") + '</div></section>';
  if (!opts.readOnly) h += '<div class="acts" style="margin:12px 0 4px"><a class="btn" href="#practice/' + id + '">Practise this step</a><a class="btn ghost" href="lesson.html#' + id + '">Full lesson</a></div>';
  else h += '<div class="acts" style="margin:12px 0 4px"><a class="btn ghost" href="lesson.html#' + id + '">Read the full lesson</a></div>';
  h += '<div class="stack" style="margin-top:12px">';
  h += '<section class="card"><p class="kicker">Tier ladder</p>' + ladderHtml(id) + '</section>';
  h += '<section class="card"><div class="row"><p class="kicker">Accuracy by week</p><span class="mono">last 10 weeks</span></div>' + weeksHtml(id) + '</section>';
  h += '<section class="card" id="hist"><div class="row"><p class="kicker">Every question</p><span class="mono">' + list.length + ' answered</span></div>' +
    (list.length ? '<p class="note" style="margin:-2px 0 8px">Newest first. Tap one to see ' + who + ' answer and the working.</p><div class="chips hfilt">' + FILTERS.map(([k, n]) => '<button type="button" class="chip" data-f="' + k + '" aria-pressed="' + (k === "all") + '">' + n + '</button>').join("") + '</div><div class="hlist"></div>' : '<p class="note">No questions answered on this step yet.</p>') + '</section>';
  h += '</div>';
  return h;
};
/* wire the filters and show the list; call after the html is on the page */
CP.stepView.bind = function (root, id) {
  const list = CP.stepHistory(id), box = root.querySelector(".hlist"); if (!box) return;
  let f = "all", limit = 40;
  const paint = () => { box.innerHTML = listHtml(list, f, limit); if (CP.graph) CP.graph.hydrate(box); const m = box.querySelector(".hmore"); if (m) m.onclick = () => { limit = +m.dataset.n; paint(); }; };
  root.querySelectorAll(".hfilt .chip").forEach(c => c.onclick = () => { f = c.dataset.f; limit = 40; root.querySelectorAll(".hfilt .chip").forEach(x => x.setAttribute("aria-pressed", x === c)); paint(); });
  paint();
};
})();
