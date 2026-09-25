/* Chalk and Paper – the app
   Renders what engine.js decides. Views: today, progress, household, me. Hash routing, no framework. */
(function () {
const $ = (sel, root) => (root || document).querySelector(sel);
const view = $("#view");
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const S = () => CP.state();
let started = null; /* timestamp when the current question was shown */

/* ---------- live data ---------- */
async function loadLive() {
  try {
    const r = await fetch("data/live.json", { cache: "no-store" });
    if (!r.ok) return;
    const j = await r.json();
    if (j && j.asOf) {
      const age = (Date.now() - Date.parse(j.asOf)) / 86400000;
      if (age <= 4) CP.liveData = j;
    }
  } catch (e) {}
}

/* ---------- tally ---------- */
function paintTally() {
  const st = CP.streak(), lv = CP.level();
  $("#tally").innerHTML = "streak " + st.days + " · ❄ " + st.freezesBanked + " · lvl " + lv.n;
}

/* ---------- shared pieces ---------- */
function ruleHtml(step) {
  return '<div class="rule"><p class="kicker">The rule</p><p class="rr">' + step.rule.r + '</p>' +
    '<div class="rx"><div class="tipb"><b>Memory tip</b>' + step.rule.tip + '</div><div class="trapb"><b>Watch out</b>' + step.rule.trap + '</div></div></div>';
}
function optionsHtml(item, answeredIx) {
  const prose = item.prose;
  return '<div class="opts' + (prose ? " one" : "") + '">' + item.options.map((o, i) => {
    let cls = "opt" + (prose ? " prose" : "");
    const done = answeredIx !== undefined && answeredIx !== null;
    if (done) cls += o.ok ? " right" : i === answeredIx ? " wrong" : " faded";
    const mark = done && o.ok ? "✓" : done && i === answeredIx ? "✗" : String.fromCharCode(65 + i);
    return '<button type="button" class="' + cls + '" data-i="' + i + '"' + (done ? " disabled" : "") + '><span class="ok">' + mark + '</span><span class="ov">' + o.html + '</span></button>';
  }).join("") + '</div>';
}
function walkHtml(walk) { return '<p class="h4">How to get it</p><div class="walk">' + walk.map(s => '<div class="w">' + s + '</div>').join("") + '</div>'; }

/* ---------- Today ---------- */
function renderToday(dateOverride) {
  const gap = CP.gapDays();
  if (gap > 3 && !sessionStorage.getItem("cp-welcomed")) { renderWelcome(gap); return; }
  const lesson = dateOverride ? S().lessons[dateOverride] : CP.todayLesson();
  if (!lesson) { location.hash = "#today"; return; }
  const step = CP.stepById(lesson.stepId);
  const isToday = lesson.date === CP.today();
  const dateLabel = isToday ? "Today" : new Date(lesson.date + "T12:00:00").toLocaleDateString("en-CA", { weekday: "long", month: "short", day: "numeric" });
  const prog = CP.lessonProgress(lesson);
  const shortened = S().easeUntil && S().easeUntil >= CP.today();

  let h = '<div class="stack">';
  /* briefing */
  h += '<section class="card"><div class="row"><p class="kicker">' + dateLabel + ' · lesson ' + (Object.keys(S().lessons).length) + '</p>' +
       '<span class="mono">' + prog.total + ' questions' + (shortened ? " · eased" : "") + '</span></div>' +
       '<h2>' + step.name + '</h2><p class="lede" style="margin:6px 0 0;font-size:16px">' + step.rule.r + '</p>' +
       '<div class="rule" style="margin-top:12px;padding:0;border:0;background:none"><div class="rx"><div class="tipb" style="background:var(--tip-soft);padding:9px 10px;border-radius:2px"><b>Memory tip</b>' + step.rule.tip + '</div>' +
       '<div class="trapb" style="background:var(--miss-soft);padding:9px 10px;border-radius:2px"><b>Watch out</b>' + step.rule.trap + '</div></div></div></section>';
  /* dots */
  const qItems = lesson.items.map((it, i) => ({ it, i })).filter(x => x.it.kind !== "demo");
  h += '<div class="dots">' + qItems.map(({ it, i }) => {
    const a = lesson.answers.find(x => x.i === i);
    let c = a ? (a.ok ? "y" : "n") : (i === lesson.ix ? "cur" : "");
    if (it.kind === "review" || it.kind === "stepback") c += " rev";
    return '<i class="' + c + '" title="' + it.kind + '"></i>';
  }).join("") + '<span>' + prog.done + ' of ' + prog.total + '</span></div>';

  if (lesson.done) {
    const right = lesson.answers.filter(a => a.ok).length;
    h += '<section class="card lift"><p class="kicker">Done</p><h2>' + right + ' of ' + lesson.answers.length + ' right</h2>' +
         '<p class="prose" style="margin-top:8px">' + (right === lesson.answers.length ? "Clean sweep. Tomorrow's lesson is already waiting for the morning." : "Every miss moved that step's next look closer. That is all a miss does here.") + '</p>' +
         '<div class="acts"><a class="btn" href="#practice">Keep practising ' + esc(step.name.toLowerCase()) + '</a><a class="btn ghost" href="#progress">See progress</a></div></section>';
  } else {
    h += '<section class="card lift" id="qcard"></section>';
  }
  /* waiting */
  const open = CP.openLessons().filter(l => l.date !== lesson.date);
  if (open.length) {
    h += '<div><p class="kicker muted" style="padding:4px 2px 6px">Waiting</p><div class="wait">' + open.map(l => {
      const p = CP.lessonProgress(l);
      return '<a href="#lesson/' + l.date + '"><span>' + new Date(l.date + "T12:00:00").toLocaleDateString("en-CA", { weekday: "long" }) + ' · ' + esc(l.stepName) + '</span><span>' + (p.done ? (p.total - p.done) + " left" : "not started") + '</span></a>';
    }).join("") + '</div></div>';
  }
  if (!isToday) h += '<p class="small" style="text-align:center"><a href="#today">Back to today</a></p>';
  h += '</div>';
  view.innerHTML = h;
  if (!lesson.done) renderItem(lesson);
}

function renderItem(lesson, answeredIx, stepBackOffer) {
  const card = $("#qcard"); if (!card) return;
  const it = lesson.items[lesson.ix];
  if (!it) { renderToday(lesson.date === CP.today() ? undefined : lesson.date); return; }
  const step = it.step ? CP.stepById(it.step) : null;
  const kindLabel = { demo: "Worked example", skill: step ? step.name : "", review: "Review · " + (step ? step.name : ""), stepback: "A step back · " + (step ? step.name : ""), why: "Why it works", practical: "In real life" }[it.kind];
  const tierLabel = it.kind === "skill" || it.kind === "review" ? [" · easy", " · medium", " · hard"][it.tier] : "";
  let h = '<div class="row"><p class="kicker">' + kindLabel + tierLabel + '</p><span class="mono">' + (step ? step.code : "reasons, not rules") + '</span></div>';

  if (it.kind === "demo") {
    const c = it.options.findIndex(o => o.ok);
    h += '<p class="task">First one on this step is done for you. Read it, then the next ones are yours.</p><p class="expr">' + it.expr + '</p>' + optionsHtml(it, c) +
         '<div class="fb">' + walkHtml(it.walk) + ruleHtml(step) + '<div class="acts"><button class="btn" id="next" type="button">Got it, my turn</button></div></div>';
    card.innerHTML = h; $("#next").onclick = () => { CP.answerLesson(lesson, lesson.ix, 0); renderToday(lesson.date === CP.today() ? undefined : lesson.date); };
    return;
  }

  if (it.kind === "practical") {
    h += '<div class="live"><span class="tag' + (it.live ? "" : " off") + '">' + (it.live ? "live" : "fixed example") + '</span><span>' + esc(it.source) + '</span></div>' +
         '<p class="prose" style="color:var(--ink)">' + it.setup + '</p>' +
         '<div class="calc">' + it.lines.map((l, i, arr) => { const last = i === arr.length - 1 ? " last" : ""; return '<span class="l' + last + '">' + l[0] + '</span><span class="' + last.trim() + '">' + l[1] + '</span><span class="r' + last + '">' + (l[2] || "") + '</span>'; }).join("") + '</div>' +
         '<p class="prose" style="color:var(--ink)">' + it.answer + '</p>' +
         '<p class="prose"><strong>Why this is ' + esc(step.name.toLowerCase()) + '.</strong> ' + it.why + '</p>' +
         '<div style="border-top:1px dashed var(--line);padding-top:12px;margin-top:4px"><p class="task">Try it. ' + it.task + '</p>' + optionsHtml(it, answeredIx) + '</div>';
  } else {
    h += '<p class="task">' + it.task + '</p><p class="expr' + (it.kind === "why" ? " q" : "") + '">' + it.expr + '</p>' + optionsHtml(it, answeredIx);
    if (answeredIx == null && step) h += '<div style="margin-top:12px"><button class="link" id="hint" type="button">Remind me of the rule</button><div id="hintbox"></div></div>';
  }

  if (answeredIx != null) {
    const chosen = it.options[answeredIx], ok = chosen.ok;
    h += '<div class="fb"><span class="verdict ' + (ok ? "y" : "n") + '">' + (ok ? "Correct" : "Not quite") + '</span>';
    if (!ok) h += '<div class="mistake"><span class="lbl">What went wrong</span>' + chosen.why + '</div>';
    if (it.kind === "why") h += '<p class="h4">The reason</p><p class="prose">' + it.explain + '</p>';
    else if (it.kind !== "practical") h += walkHtml(it.walk) + ruleHtml(step);
    if (stepBackOffer) {
      h += '<div class="card tip" style="margin-top:14px"><p class="kicker tipc">Take a step back?</p><p class="prose" style="color:var(--ink)">That is two in a row. ' + esc(step.name) + ' leans on ' + esc(stepBackOffer.name.toLowerCase()) + '. Three easy ones there take about a minute, then you come straight back.</p>' +
           '<div class="acts"><button class="btn" id="stepback" type="button">Yes, three easy ones</button><button class="btn ghost" id="next" type="button">Keep going</button></div></div>';
    } else {
      h += '<div class="acts"><button class="btn" id="next" type="button">Next</button></div>';
    }
    h += '</div>';
  }
  card.innerHTML = h;
  started = Date.now();
  card.querySelectorAll(".opt").forEach(b => b.onclick = () => {
    if (answeredIx != null) return;
    const i = Number(b.dataset.i), ms = Date.now() - started;
    const before = lesson.ix;
    CP.answerLesson(lesson, before, i, ms);
    lesson.ix = before; /* stay on this item to show feedback; advance on Next */
    const offer = it.kind === "skill" ? CP.shouldStepBack(lesson) : null;
    paintTally();
    renderItem(lesson, i, offer);
  });
  const hint = $("#hint"); if (hint) hint.onclick = () => { $("#hintbox").innerHTML = ruleHtml(step); hint.hidden = true; };
  const nx = $("#next"); if (nx) nx.onclick = () => { lesson.ix++; CP.save(); renderToday(lesson.date === CP.today() ? undefined : lesson.date); };
  const sb = $("#stepback"); if (sb) sb.onclick = () => { lesson.ix++; CP.insertStepBack(lesson, stepBackOffer); renderToday(lesson.date === CP.today() ? undefined : lesson.date); };
  if (nx) nx.focus({ preventScroll: true });
}

/* ---------- Welcome back ---------- */
function renderWelcome(gap) {
  CP.settleFreezes();
  const st = CP.streak(), lv = CP.level(), mastered = CP.STEPS.filter(s => CP.mastered(s.id)).length, due = CP.STEPS.filter(s => CP.due(s.id)).length;
  const name = S().profile.name;
  view.innerHTML = '<h1>Welcome back' + (name ? ", " + esc(name) : "") + '.</h1>' +
    '<p class="lede">It has been ' + gap + ' days. Everything you mastered is still mastered. Your points, your map and your bests are exactly where you left them.</p>' +
    '<div class="stack"><section class="card"><div class="row"><p class="kicker">Still yours</p><span class="mono">level ' + lv.n + ' · ' + S().points.toLocaleString("en-CA") + ' points</span></div>' +
    '<p class="small">' + mastered + ' steps mastered.' + (due ? " " + due + " due for a look, which is normal after a break, and takes a minute each." : "") + '</p></section>' +
    '<section class="card"><p class="kicker muted">Streak</p><p class="prose" style="color:var(--ink)">' + (st.days > 0 ? "Your streak is still going: freezes covered the gap." : "Your streak ended while you were away. That is all it is: a number that starts again. The calendar keeps every day you did.") + '</p></section>' +
    '<section class="card lift"><p class="kicker">Today’s lesson is smaller for a few days</p><p class="small">Three questions instead of ' + (S().profile.size || 5) + '. It grows back on its own.</p><div class="acts"><button class="btn" id="go" type="button">Start</button></div></section></div>' +
    '<p class="note" style="text-align:center;margin-top:20px">No lecture. Nothing to catch up. Just the next question.</p>';
  $("#go").onclick = () => { sessionStorage.setItem("cp-welcomed", "1"); renderToday(); };
}

/* ---------- Free practice ---------- */
function renderPractice(stepId) {
  const step = CP.stepById(stepId) || CP.currentStep(S().profile.tracks[0]);
  let item = CP.practiceProblem(step.id), answered = null;
  const draw = () => {
    const ss = CP.stepState(step.id);
    let h = '<div class="stack"><section class="card lift"><div class="row"><p class="kicker">Practice · ' + esc(step.name) + [" · easy", " · medium", " · hard"][item.tier] + '</p><span class="mono">' + step.code + '</span></div>' +
      '<p class="task">' + item.task + '</p><p class="expr">' + item.expr + '</p>' + optionsHtml(item, answered);
    if (answered == null) h += '<div style="margin-top:12px"><button class="link" id="hint" type="button">Remind me of the rule</button><div id="hintbox"></div></div>';
    else { const c = item.options[answered]; h += '<div class="fb"><span class="verdict ' + (c.ok ? "y" : "n") + '">' + (c.ok ? "Correct" : "Not quite") + '</span>' + (c.ok ? "" : '<div class="mistake"><span class="lbl">What went wrong</span>' + c.why + '</div>') + walkHtml(item.walk) + ruleHtml(step) + '<div class="acts"><button class="btn" id="next" type="button">Another</button><a class="btn ghost" href="#today">Back to today</a></div></div>'; }
    h += '</section><p class="small">Last five on this step: ' + (ss.hist.slice(-5).map(b => b ? "✓" : "✗").join(" ") || "none yet") + ' · get four of five right and the difficulty rises.</p></div>';
    view.innerHTML = h; started = Date.now();
    view.querySelectorAll(".opt").forEach(b => b.onclick = () => { if (answered != null) return; answered = Number(b.dataset.i); CP.recordAnswer({ stepId: step.id, kind: "practice", ok: !!item.options[answered].ok, chosen: item.options[answered].html, ms: Date.now() - started }); paintTally(); draw(); });
    const hint = $("#hint"); if (hint) hint.onclick = () => { $("#hintbox").innerHTML = ruleHtml(step); hint.hidden = true; };
    const nx = $("#next"); if (nx) nx.onclick = () => { item = CP.practiceProblem(step.id); answered = null; draw(); };
  };
  draw();
}

/* ---------- Progress ---------- */
function renderProgress() {
  const st = CP.streak(), lv = CP.level(), steps = CP.trackSteps(S().profile.tracks[0]), cur = CP.currentStep(S().profile.tracks[0]);
  const mastered = steps.filter(s => CP.mastered(s.id)).length, b = CP.bests(), weak = CP.weakest(), mis = CP.mistakes();
  const cal = CP.calendar(8), practised = cal.filter(d => d.q > 0).length;
  const q = n => n === 0 ? "" : n < 4 ? "q1" : n < 8 ? "q2" : "q3";
  let h = '<h1 style="font-size:24px">Progress</h1><div class="stack">';
  h += '<div class="tiles"><div class="tile"><span class="k">Streak</span><span class="v">' + st.days + '</span><span class="s">days · ' + st.freezesBanked + ' freeze' + (st.freezesBanked === 1 ? "" : "s") + ' ❄</span></div>' +
       '<div class="tile"><span class="k">Level ' + lv.n + ' · ' + esc(lv.title) + '</span><span class="v">' + S().points.toLocaleString("en-CA") + '</span><span class="s">points · ' + lv.toNext + ' to next</span></div>' +
       '<div class="tile"><span class="k">Mastered</span><span class="v">' + mastered + '</span><span class="s">of ' + steps.length + ' steps</span></div></div>';
  h += '<section class="card"><div class="row"><p class="kicker">Calculus and Vectors</p><span class="mono">MCV4U</span></div><div class="map">' + steps.map(s => {
    const c = CP.mastered(s.id) ? (CP.due(s.id) ? "due" : "done") : s.id === cur.id ? "cur" : "";
    return '<button type="button" class="st" data-s="' + s.id + '"><span class="pip ' + c + '">' + s.order + '</span><span class="nm">' + esc(s.name.replace(/,.*$/, "").replace("Fraction and negative exponents", "Fraction exp.").replace("Slope and rate of change", "Slope").replace("Power rule", "Power rule").replace("Slope of a tangent at a point", "Tangent").replace("Sine, cosine and eˣ", "sin, cos, eˣ").replace("Maximums and minimums", "Max and min").replace("Dot product and right angles", "Dot product").replace("Lines in space", "Lines")) + '</span></button>';
  }).join("") + '</div><div class="legend"><span><i style="background:var(--accent)"></i>mastered</span><span><i style="background:var(--accent-soft);border:1.5px dashed var(--accent)"></i>due for review</span><span><i style="background:var(--surface);border:1.5px solid var(--accent)"></i>working on</span></div><p class="note" style="margin-top:8px">Tap a step to practise it.</p></section>';
  h += '<section class="card"><div class="row"><p class="kicker">Days practised</p><span class="mono">last 8 weeks · ' + practised + ' days</span></div><div class="cal">' + cal.map(d => '<span class="' + q(d.q) + (d.today ? " today" : "") + '" title="' + d.date + ": " + d.q + '"></span>').join("") + '</div><p class="note" style="margin-top:8px">Darker means more questions. No red squares, ever.</p></section>';
  h += '<section class="card"><p class="kicker">Personal bests</p><div class="list">' +
       '<div class="li"><span class="k">Longest run of right answers</span><span class="v">' + b.bestRun + '</span></div>' +
       '<div class="li"><span class="k">Fastest correct' + (b.fastest ? ", " + esc(b.fastest.name.toLowerCase()) : "") + '</span><span class="v">' + (b.fastest ? (b.fastest.ms / 1000).toFixed(1) + " s" : "—") + '</span></div>' +
       '<div class="li"><span class="k">Best accuracy on a step</span><span class="v">' + (b.bestAcc ? esc(b.bestAcc.name) + " · " + Math.round(b.bestAcc.acc * 100) + "%" : "—") + '</span></div>' +
       '<div class="li"><span class="k">Longest streak</span><span class="v">' + b.longestStreak + ' days</span></div></div></section>';
  if (weak || mis.length) {
    h += '<section class="card"><p class="kicker">What to work on</p>' + (weak ? '<p class="small">Weakest step: <strong>' + esc(weak.name) + '</strong> at ' + Math.round(weak.acc * 100) + '%.</p>' : "") +
         (mis.length ? '<p class="h4" style="margin-top:10px">Mistakes you keep making</p><div class="list">' + mis.slice(0, 5).map(m => '<div class="li"><span class="k">' + esc(CP.stepById(m.step).name) + ': chose <span class="m" style="font-size:.95em">' + m.chosen + '</span></span><span class="v">' + m.n + '×</span></div>').join("") + '</div>' : "") + '</section>';
  }
  h += '<button class="btn ghost block" type="button" id="share">Share a read-only link to this page</button><p class="note" style="text-align:center">Sharing and syncing between devices arrive with profiles, in the next phase.</p></div>';
  view.innerHTML = h;
  view.querySelectorAll(".st").forEach(b => b.onclick = () => { location.hash = "#practice/" + b.dataset.s; });
  $("#share").onclick = () => alert("Not yet. Profiles and sharing are the next phase.");
}

/* ---------- Household ---------- */
function renderHousehold() {
  view.innerHTML = '<h1 style="font-size:24px">Household</h1><div class="stack"><section class="card"><p class="kicker">Coming with profiles</p>' +
    '<p class="prose" style="color:var(--ink)">This is where a small group, joined by an invite code, sees each other’s step, streak and weakest topic. A table, not a leaderboard. It needs progress to live somewhere shared, which is the next phase.</p>' +
    '<p class="small">Until then, everything you do here stays on this phone.</p></section></div>';
}

/* ---------- Me ---------- */
function renderMe() {
  const p = S().profile;
  view.innerHTML = '<h1 style="font-size:24px">Me</h1><div class="stack"><section class="card">' +
    '<div class="field"><label for="nm">Your name</label><input type="text" id="nm" value="' + esc(p.name) + '" placeholder="So the welcome-back knows who you are" autocomplete="given-name"></div>' +
    '<div class="field"><label>Daily lesson size</label><div class="chips">' + [3, 5, 8].map(n => '<button type="button" class="chip" data-n="' + n + '" aria-pressed="' + (p.size === n) + '">' + n + ' questions</button>').join("") + '</div></div>' +
    '<div class="field"><label>Tracks</label><div class="chips">' + CP.TRACKS.map(t => '<button type="button" class="chip" aria-pressed="' + p.tracks.includes(t.id) + '"' + (t.available ? "" : " disabled") + '>' + esc(t.name) + (t.available ? "" : " · coming") + '</button>').join("") + '</div></div></section>' +
    '<section class="card"><p class="kicker">The morning email</p><p class="small">Not sending yet: it is the phase after profiles. Leave your address now and it starts the day that switches on.</p>' +
    '<div class="field" style="margin-top:10px"><label for="em">Email</label><input type="email" id="em" value="' + esc(p.email) + '" placeholder="you@example.com" autocomplete="email"></div>' +
    '<label class="check"><input type="checkbox" id="opt"' + (p.emailOptIn ? " checked" : "") + '> Send me the lesson each morning</label></section>' +
    '<section class="card"><p class="kicker">On your phone</p><p class="small">Open this page in Safari or Chrome, use the share or menu button, and choose <strong>Add to Home Screen</strong>. It then opens full-screen like an app and works without signal.</p></section>' +
    '<section class="card"><p class="kicker muted">Data</p><p class="small">Everything is saved on this device the moment you tap. Nothing leaves it yet.</p><div class="acts"><button class="btn ghost" id="reset" type="button">Start over</button></div></section></div>' +
    '<footer>Chalk and Paper · built to the Ontario MCV4U expectations</footer>';
  $("#nm").onchange = e => { p.name = e.target.value.trim(); CP.save(); };
  $("#em").onchange = e => { p.email = e.target.value.trim(); CP.save(); };
  $("#opt").onchange = e => { p.emailOptIn = e.target.checked; CP.save(); };
  view.querySelectorAll(".chip[data-n]").forEach(b => b.onclick = () => { p.size = Number(b.dataset.n); CP.save(); renderMe(); });
  $("#reset").onclick = () => { if (!$("#reset").dataset.armed) { $("#reset").dataset.armed = "1"; $("#reset").textContent = "Tap again to erase everything on this device"; return; } CP.reset(); sessionStorage.removeItem("cp-welcomed"); location.hash = "#today"; route(); };
}

/* ---------- routing ---------- */
function route() {
  const hash = location.hash.replace(/^#/, "") || "today";
  const [name, arg] = hash.split("/");
  document.querySelectorAll("#nav a").forEach(a => a.classList.toggle("on", a.dataset.v === (name === "lesson" || name === "practice" ? "today" : name)));
  paintTally();
  if (name === "today") renderToday();
  else if (name === "lesson") renderToday(arg);
  else if (name === "practice") renderPractice(arg);
  else if (name === "progress") renderProgress();
  else if (name === "household") renderHousehold();
  else if (name === "me") renderMe();
  else renderToday();
  window.scrollTo({ top: 0 });
}
window.addEventListener("hashchange", route);

/* ---------- boot ---------- */
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
loadLive().then(() => { CP.settleFreezes(); route(); });
document.addEventListener("keydown", e => {
  if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
  const opts = Array.from(view.querySelectorAll(".opt:not(:disabled)"));
  const k = e.key.toUpperCase(), ix = "ABCD".indexOf(k) >= 0 ? "ABCD".indexOf(k) : "1234".indexOf(e.key);
  if (opts.length && ix >= 0 && ix < opts.length) { e.preventDefault(); opts[ix].click(); }
  else if (e.key === "Enter" && $("#next") && document.activeElement !== $("#next")) { e.preventDefault(); $("#next").click(); }
});
})();
