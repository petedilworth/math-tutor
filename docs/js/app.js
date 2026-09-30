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
  const prose = item.prose, spot = item.mode === "spot";
  return '<div class="opts' + (prose ? " one" : "") + '">' + item.options.map((o, i) => {
    let cls = "opt" + (prose ? " prose" : "") + (spot ? " line" : "");
    const done = answeredIx !== undefined && answeredIx !== null;
    if (done) cls += o.ok ? " right" : i === answeredIx ? " wrong" : " faded";
    const mark = done && o.ok ? "✓" : done && i === answeredIx ? "✗" : spot ? String(i + 1) : String.fromCharCode(65 + i);
    return '<button type="button" class="' + cls + '" data-i="' + i + '"' + (done ? " disabled" : "") + '><span class="ok">' + mark + '</span><span class="ov">' + o.html + '</span></button>';
  }).join("") + '</div>';
}
function walkHtml(walk, title) { return '<p class="h4">' + (title || "How to get it") + '</p><div class="walk">' + walk.map(s => '<div class="w">' + s + '</div>').join("") + '</div>'; }

/* ---------- tiers ---------- */
const tierName = t => CP.TIERS[t] || "";
const modeLabel = it => it.mode === "spot" ? " · spot the error" : it.mode === "rev" ? " · work backwards" : "";
function tierBar(stepId, withNames) {
  const tp = CP.tierProgress(stepId), top = CP.TIERS.length - 1;
  const pips = CP.TIERS.map((n, i) => '<i class="' + (i < tp.tier ? "done" : i === tp.tier ? "cur" : i <= tp.best ? "best" : "") + '" title="' + n + '"></i>').join("");
  const runTxt = tp.run.length ? tp.right + " of the last " + tp.run.length + " right" : "No answers at this tier yet";
  const msg = tp.tier === top ? runTxt + ". This is the top tier." : runTxt + " · " + tp.need + " more right in a row moves you up to " + tierName(tp.tier + 1) + ".";
  return '<div class="tierbar">' + (withNames ? '<div class="tnames">' + CP.TIERS.map(n => '<span>' + n + '</span>').join("") + '</div>' : "") +
    '<div class="tpips">' + pips + '</div><div class="tlab"><b>' + tierName(tp.tier) + '</b> · ' + msg + (tp.best > tp.tier ? " Best reached: " + tierName(tp.best) + "." : "") + '</div></div>';
}
function eventBanner(ev) {
  if (!ev) return "";
  const st = CP.stepById(ev.step);
  if (ev.tierUp !== undefined) return '<div class="banner up"><b>Up to ' + tierName(ev.tierUp) + '</b> on ' + esc(st.name.toLowerCase()) + '. ' + CP.TIER_NOTE[ev.tierUp] + '</div>';
  return '<div class="banner down"><b>Back to ' + tierName(ev.tierDown) + '</b> on ' + esc(st.name.toLowerCase()) + ' for now. Two misses in a row. Four of the next five right climbs back up.</div>';
}
/* what went wrong, and for spot the error, where the mistake really was */
function explainHtml(it, chosenIx) {
  const chosen = it.options[chosenIx];
  let h = chosen && !chosen.ok ? '<div class="mistake"><span class="lbl">What went wrong</span>' + chosen.why + '</div>' : "";
  if (it.mode === "spot") { const b = it.options.findIndex(o => o.ok); h += '<div class="fixbox"><span class="lbl">The mistake is in line ' + (b + 1) + '</span>' + it.spotWhy + '<br>It should read: <span class="m">' + it.fix + '</span></div>'; }
  return h;
}
const walkTitle = it => it.mode === "spot" ? "The working, corrected" : it.mode === "rev" ? "How to work backwards" : "How to get it";

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
       '<div class="trapb" style="background:var(--miss-soft);padding:9px 10px;border-radius:2px"><b>Watch out</b>' + step.rule.trap + '</div></div></div>' + tierBar(step.id) + '</section>';
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
         '<div class="acts"><a class="btn" href="#practice">Keep practising ' + esc(step.name.toLowerCase()) + '</a><a class="btn ghost" href="#test">Take a test</a><a class="btn ghost" href="#progress">See progress</a></div></section>';
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

function renderItem(lesson, answeredIx, stepBackOffer, ev) {
  const card = $("#qcard"); if (!card) return;
  const it = lesson.items[lesson.ix];
  if (!it) { renderToday(lesson.date === CP.today() ? undefined : lesson.date); return; }
  const step = it.step ? CP.stepById(it.step) : null;
  const kindLabel = { demo: "Worked example", skill: step ? step.name : "", review: "Review · " + (step ? step.name : ""), stepback: "A step back · " + (step ? step.name : ""), why: "Why it works", practical: "In real life" }[it.kind];
  const tierLabel = (it.kind === "skill" || it.kind === "review" || it.kind === "stepback") && it.tier !== undefined ? " · " + tierName(it.tier).toLowerCase() + modeLabel(it) : "";
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
    if (answeredIx == null && step && !it.noHint) h += '<div style="margin-top:12px"><button class="link" id="hint" type="button">Remind me of the rule</button><div id="hintbox"></div></div>';
    else if (answeredIx == null && it.noHint) h += '<p class="note" style="margin-top:12px">Master tier: no rule reminder.</p>';
  }

  if (answeredIx != null) {
    const chosen = it.options[answeredIx], ok = chosen.ok;
    h += '<div class="fb">' + eventBanner(ev) + '<span class="verdict ' + (ok ? "y" : "n") + '">' + (ok ? "Correct" : "Not quite") + '</span>';
    if (it.kind === "why" || it.kind === "practical") { if (!ok) h += '<div class="mistake"><span class="lbl">What went wrong</span>' + chosen.why + '</div>'; }
    else h += explainHtml(it, answeredIx);
    if (it.kind === "why") h += '<p class="h4">The reason</p><p class="prose">' + it.explain + '</p>';
    else if (it.kind !== "practical") h += walkHtml(it.walk, walkTitle(it)) + ruleHtml(step);
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
    const res = CP.answerLesson(lesson, before, i, ms);
    lesson.ix = before; /* stay on this item to show feedback; advance on Next */
    const offer = it.kind === "skill" ? CP.shouldStepBack(lesson) : null;
    paintTally();
    renderItem(lesson, i, offer, res && res.ev);
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
  let item = CP.practiceProblem(step.id), answered = null, ev = null;
  const draw = () => {
    CP.currentPractice = item; /* the item on screen, for tests and debugging */
    let h = '<div class="stack"><section class="card lift"><div class="row"><p class="kicker">Practice · ' + esc(step.name) + ' · ' + tierName(item.tier).toLowerCase() + modeLabel(item) + '</p><span class="mono">' + step.code + '</span></div>' +
      '<p class="task">' + item.task + '</p><p class="expr">' + item.expr + '</p>' + optionsHtml(item, answered);
    if (answered == null) h += item.noHint ? '<p class="note" style="margin-top:12px">Master tier: no rule reminder.</p>' : '<div style="margin-top:12px"><button class="link" id="hint" type="button">Remind me of the rule</button><div id="hintbox"></div></div>';
    else { const c = item.options[answered]; h += '<div class="fb">' + eventBanner(ev) + '<span class="verdict ' + (c.ok ? "y" : "n") + '">' + (c.ok ? "Correct" : "Not quite") + '</span>' + explainHtml(item, answered) + walkHtml(item.walk, walkTitle(item)) + ruleHtml(step) + '<div class="acts"><button class="btn" id="next" type="button">Another</button><a class="btn ghost" href="#today">Back to today</a></div></div>'; }
    h += '</section><section class="card"><p class="kicker">Tier on this step</p>' + tierBar(step.id, true) + '</section></div>';
    view.innerHTML = h; started = Date.now();
    view.querySelectorAll(".opt").forEach(b => b.onclick = () => { if (answered != null) return; answered = Number(b.dataset.i); ev = CP.recordAnswer({ stepId: step.id, kind: "practice", ok: !!item.options[answered].ok, chosen: item.options[answered].html, ms: Date.now() - started, tier: item.tier }); paintTally(); draw(); });
    const hint = $("#hint"); if (hint) hint.onclick = () => { $("#hintbox").innerHTML = ruleHtml(step); hint.hidden = true; };
    const nx = $("#next"); if (nx) nx.onclick = () => { item = CP.practiceProblem(step.id); answered = null; ev = null; draw(); };
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
    return '<button type="button" class="st" data-s="' + s.id + '"><span class="pip ' + c + '">' + s.order + '</span><span class="nm">' + esc(s.short) + '</span></button>';
  }).join("") + '</div><div class="legend"><span><i style="background:var(--accent)"></i>mastered</span><span><i style="background:var(--accent-soft);border:1.5px dashed var(--accent)"></i>due for review</span><span><i style="background:var(--surface);border:1.5px solid var(--accent)"></i>working on</span></div><p class="note" style="margin-top:8px">Tap a step to practise it.</p></section>';
  h += tiersCard(steps, cur);
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
  const canShare = CP.sync.signedIn() && CP.sync.profile && CP.sync.profile.shareOn;
  h += '<button class="btn ghost block" type="button" id="share">' + (canShare ? "Copy my read-only progress link" : "Share a read-only link to this page") + '</button>' +
       (canShare ? "" : '<p class="note" style="text-align:center">' + (CP.sync.enabled ? "Sign in on the Me screen and switch sharing on." : "Sharing needs the shared record; see the setup guide.") + '</p>') + '</div>';
  view.innerHTML = h;
  view.querySelectorAll(".st").forEach(b => b.onclick = () => { location.hash = "#practice/" + b.dataset.s; });
  $("#share").onclick = () => { if (!canShare) { location.hash = "#me"; return; } navigator.clipboard.writeText(CP.sync.shareUrl()).then(() => { $("#share").textContent = "Copied"; }).catch(() => { $("#share").textContent = CP.sync.shareUrl(); }); };
}

function tiersCard(steps, cur) {
  const seen = steps.filter(s => { const x = S().steps[s.id]; return x && x.attempts > 0; });
  if (!seen.length) return "";
  const rows = seen.map(s => {
    const tp = CP.tierProgress(s.id);
    const pips = CP.TIERS.map((n, i) => '<i class="' + (i < tp.tier ? "done" : i === tp.tier ? "cur" : "") + '"></i>').join("");
    return '<button type="button" class="trow st" data-s="' + s.id + '" style="background:none;border-left:0;border-right:0;border-bottom:0;width:100%;text-align:left;font:inherit;color:inherit;cursor:pointer">' +
      '<span class="nm2">' + esc(s.short) + '<small>' + tierName(tp.tier) + (tp.best > tp.tier ? " · best " + tierName(tp.best) : "") + '</small></span>' +
      '<span class="tp">' + pips + '</span><span class="ac">' + (tp.answered ? Math.round(tp.acc * 100) + "% of " + tp.answered : "new") + '</span></button>';
  }).join("");
  const log = (S().tierLog || []).slice(-5).reverse();
  return '<section class="card"><div class="row"><p class="kicker">Tiers</p><span class="mono">' + CP.TIERS.join(" · ").toLowerCase() + '</span></div>' +
    '<p class="note" style="margin:-2px 0 8px">The number on the right is your accuracy at the current tier. Four of five right moves a step up; two misses in a row moves it down. Tap a step to practise it.</p>' + rows +
    (log.length ? '<p class="h4" style="margin-top:12px">Recent changes</p><div class="list">' + log.map(e => '<div class="li"><span class="k">' + esc((CP.stepById(e.step) || {}).short || e.step) + ' ' + (e.dir > 0 ? "up to" : "down to") + ' ' + tierName(e.tier) + '</span><span class="v">' + new Date(e.t).toLocaleDateString("en-CA", { month: "short", day: "numeric" }) + '</span></div>').join("") + '</div>' : "") + '</section>';
}

/* ---------- Test ---------- */
let testTimer = null, testScope = null, testLen = null, testStarted = null;
const clockTxt = ms => { const s = Math.round(ms / 1000); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
function renderTest(arg) {
  const T = S().activeTest;
  if (arg === "result" && S().lastTest) return renderTestResult();
  if (T) return renderTestQuestion();
  const cur = CP.currentStep(S().profile.tracks[0]), hasMastered = !!CP.testSteps("mastered");
  if (testScope === null) { const last = (S().tests || []).slice(-1)[0]; testScope = last ? last.scope : "step"; testLen = last ? last.n : 8; } /* start from the last test's choices */
  if (testScope === "mastered" && !hasMastered) testScope = "step";
  const best = CP.testBest(testScope, cur.id, testLen);
  const scopes = [["step", "This step: " + cur.short], ["mastered", "Everything I’ve mastered"], ["course", "Whole course"]];
  let h = '<h1 style="font-size:24px">Test</h1><div class="stack"><section class="card lift"><p class="kicker">A test, on your own terms</p>' +
    '<p class="small">No hints and no answers until the end. Each step comes at its current tier. The clock is for you, not a limit. Close the app mid-test and it waits.</p>' +
    '<div class="field" style="margin-top:12px"><label>What to cover</label><div class="chips">' + scopes.map(([k, n]) => '<button type="button" class="chip" data-scope="' + k + '" aria-pressed="' + (testScope === k) + '"' + (k === "mastered" && !hasMastered ? " disabled" : "") + '>' + esc(n) + (k === "mastered" && !hasMastered ? " · none yet" : "") + '</button>').join("") + '</div>' +
    (testScope === "course" ? '<p class="note" style="margin-top:6px">Includes steps you have not reached yet, at the easy tier.</p>' : "") + '</div>' +
    '<div class="field"><label>How many questions</label><div class="chips">' + CP.TEST_SIZES.map(n => '<button type="button" class="chip" data-len="' + n + '" aria-pressed="' + (testLen === n) + '">' + n + '</button>').join("") + '</div></div>' +
    '<p class="small">' + (best ? "Your best here: " + best.right + " of " + best.n + " in " + clockTxt(best.ms) + "." : "No test like this yet. The first one sets your best.") + (" A perfect score earns 25 bonus points.") + '</p>' +
    '<div class="acts"><button class="btn" id="tstart" type="button">Start the test</button></div></section>';
  const hist = (S().tests || []).slice(-8).reverse();
  if (hist.length) h += '<section class="card"><p class="kicker">Recent tests</p><div class="list">' + hist.map(t => '<div class="li"><span class="k">' + new Date(t.id).toLocaleDateString("en-CA", { month: "short", day: "numeric" }) + ' · ' + esc(CP.testLabel(t.scope, t.stepId)) + (t.best ? '<span class="tagb">best</span>' : "") + '</span><span class="v">' + t.right + '/' + t.n + ' · ' + clockTxt(t.ms) + '</span></div>').join("") + '</div>' +
    (S().lastTest ? '<div class="acts"><a class="btn ghost" href="#test/result">Review the last test</a></div>' : "") + '</section>';
  h += '</div>';
  view.innerHTML = h;
  view.querySelectorAll("[data-scope]").forEach(b => b.onclick = () => { testScope = b.dataset.scope; renderTest(); });
  view.querySelectorAll("[data-len]").forEach(b => b.onclick = () => { testLen = Number(b.dataset.len); renderTest(); });
  $("#tstart").onclick = () => { if (CP.startTest(testScope, testLen, cur.id)) renderTest(); };
}
function renderTestQuestion() {
  const T = S().activeTest, i = T.answers.length, it = T.items[i];
  const step = CP.stepById(it.step), done = T.answers.reduce((s, a) => s + a.ms, 0);
  testStarted = Date.now();
  let h = '<div class="stack"><section class="card lift"><div class="row"><p class="kicker">Test · ' + esc(CP.testLabel(T.scope, T.stepId)) + ' · ' + (i + 1) + ' of ' + T.items.length + '</p><span class="clock" id="clock">' + clockTxt(done) + '</span></div>' +
    '<div class="dots">' + T.items.map((x, k) => '<i class="' + (k < i ? "y" : k === i ? "cur" : "") + '"></i>').join("") + '</div>' +
    '<p class="small" style="margin:6px 0 0">' + esc(step.name) + ' · ' + tierName(it.tier).toLowerCase() + modeLabel(it) + '</p>' +
    '<p class="task">' + it.task + '</p><p class="expr">' + it.expr + '</p>' + optionsHtml(it, null) + '</section>' +
    '<p class="small" style="text-align:center"><button class="link" id="tquit" type="button">Stop this test</button></p></div>';
  view.innerHTML = h;
  clearInterval(testTimer);
  testTimer = setInterval(() => { const c = $("#clock"); if (!c) { clearInterval(testTimer); return; } c.textContent = clockTxt(done + Math.min(Date.now() - testStarted, CP.TEST_CAP_MS)); }, 1000);
  view.querySelectorAll(".opt").forEach(b => b.onclick = () => {
    const r = CP.answerTest(Number(b.dataset.i), Date.now() - testStarted);
    paintTally();
    if (r && r.done) { clearInterval(testTimer); CP.finishTest(); if (location.hash === "#test/result") route(); else location.hash = "#test/result"; }
    else renderTestQuestion();
  });
  $("#tquit").onclick = () => { const q = $("#tquit"); if (!q.dataset.armed) { q.dataset.armed = "1"; q.textContent = "Tap again to stop. Answers so far still count toward your practice."; return; } clearInterval(testTimer); CP.abandonTest(); renderTest(); };
}
function renderTestResult() {
  const L = S().lastTest, r = L.rec, best = CP.testBest(r.scope, r.stepId, r.n);
  const msg = r.right === r.n ? "Perfect. 25 bonus points." : r.best && !r.first ? "A new best for this test." : r.first ? "Your first test like this. It is the one to beat." : "Your best here is " + best.right + " of " + best.n + " in " + clockTxt(best.ms) + ".";
  let h = '<h1 style="font-size:24px">Test result</h1><div class="stack"><section class="card lift"><p class="kicker">' + esc(CP.testLabel(r.scope, r.stepId)) + ' · ' + r.n + ' questions</p>' +
    '<div class="row" style="align-items:flex-end"><span class="score">' + r.right + ' of ' + r.n + '</span><span class="clock">' + clockTxt(r.ms) + '</span></div>' +
    '<p class="prose" style="margin-top:8px">' + msg + '</p><div class="acts"><a class="btn" href="#test">Take another</a><a class="btn ghost" href="#today">Back to today</a></div></section>' +
    '<section class="card"><p class="kicker">Question by question</p><p class="note" style="margin:-2px 0 6px">Tap one to see the working.</p>' +
    L.items.map((it, k) => {
      const a = L.answers[k], st = CP.stepById(it.step);
      return '<details class="rq"><summary><span class="mk ' + (a.ok ? "y" : "n") + '">' + (a.ok ? "✓" : "✗") + '</span><span>' + (k + 1) + '. ' + esc(st.short) + ' · ' + tierName(it.tier).toLowerCase() + modeLabel(it) + ' <span class="mono" style="color:var(--ink-3)">' + clockTxt(a.ms) + '</span></span></summary>' +
        '<div class="body"><p class="task">' + it.task + '</p><p class="expr">' + it.expr + '</p>' + optionsHtml(it, a.chosen) + '<div class="fb">' + explainHtml(it, a.chosen) + walkHtml(it.walk, walkTitle(it)) + '</div></div></details>';
    }).join("") + '</section></div>';
  view.innerHTML = h;
}

/* ---------- Household ---------- */
function summarize(state) {
  const steps = state.steps || {}, days = state.days || {}, frozen = state.frozen || {};
  const mastered = Object.values(steps).filter(x => x && x.mastered).length;
  /* current step: first never-mastered in MCV4U order */
  const cur = CP.trackSteps("mcv4u").find(st => !(steps[st.id] && steps[st.id].mastered)) || CP.trackSteps("mcv4u").slice(-1)[0];
  /* streak from days + frozen */
  const D = 86400000, dn = iso => Math.floor(Date.parse(iso + "T00:00:00Z") / D), fromN = n => new Date(n * D).toISOString().slice(0, 10);
  const covered = iso => ((days[iso] || {}).q > 0) || !!frozen[iso];
  let n = 0, c = dn(CP.today()); if (!covered(CP.today())) c--; while (n < 4000 && covered(fromN(c))) { n++; c--; }
  /* this week's questions */
  let week = 0; for (let i = 0; i < 7; i++) week += ((days[fromN(dn(CP.today()) - i)] || {}).q || 0);
  let weak = null; for (const id in steps) { const x = steps[id]; if (!x || x.attempts < 3) continue; const acc = x.correct / x.attempts; if (!weak || acc < weak.acc) weak = { acc, name: CP.stepById(id).name }; }
  return { mastered, cur, tier: (steps[cur.id] && steps[cur.id].tier) || 0, streak: n, freezes: state.freezes || 0, week, weak, points: state.points || 0 };
}
function renderHousehold() {
  if (!CP.sync.enabled) {
    view.innerHTML = '<h1 style="font-size:24px">Household</h1><div class="stack"><section class="card"><p class="kicker">Needs the shared record</p><p class="prose" style="color:var(--ink)">A small group, joined by an invite code, sees each other’s step, streak and weakest topic. A table, not a leaderboard. It switches on once the site is connected to its database; see the setup guide in the repository.</p></section></div>';
    return;
  }
  if (!CP.sync.signedIn()) {
    view.innerHTML = '<h1 style="font-size:24px">Household</h1><div class="stack"><section class="card"><p class="kicker">Sign in first</p><p class="prose" style="color:var(--ink)">Households need a profile so the others can see you. Sign in on the <a href="#me">Me</a> screen with a name and a PIN.</p></section></div>';
    return;
  }
  view.innerHTML = '<h1 style="font-size:24px">Household</h1><p class="small">Loading…</p>';
  CP.sync.household().then(r => {
    let h = '<h1 style="font-size:24px">Household</h1><div class="stack">';
    if (!r.household) {
      h += '<section class="card"><p class="kicker">Not in a household yet</p><p class="small">Make one and share its code, or join with a code someone gave you. Nothing is searchable; the code is the only way in.</p>' +
           '<div class="field" style="margin-top:12px"><label for="hn">Make a household</label><input type="text" id="hn" placeholder="e.g. The Thursday crew"></div><div class="acts"><button class="btn" id="hcreate" type="button">Create</button></div>' +
           '<div class="field" style="margin-top:16px"><label for="hc">Join with a code</label><input type="text" id="hc" placeholder="ABC-123" autocapitalize="characters"></div><div class="acts"><button class="btn ghost" id="hjoin" type="button">Join</button></div><p class="note" id="herr"></p></section></div>';
      view.innerHTML = h;
      $("#hcreate").onclick = async () => { try { await CP.sync.householdCreate($("#hn").value.trim() || "Household"); renderHousehold(); } catch (e) { $("#herr").textContent = CP.sync.errorText(e); } };
      $("#hjoin").onclick = async () => { try { await CP.sync.householdJoin($("#hc").value.trim()); renderHousehold(); } catch (e) { $("#herr").textContent = CP.sync.errorText(e); } };
      return;
    }
    const rows = r.members.map(m => Object.assign({ name: m.name, me: m.me }, summarize(m.state || {})));
    const tot = rows.reduce((a, x) => ({ week: a.week + x.week, mastered: a.mastered + x.mastered }), { week: 0, mastered: 0 });
    h += '<div class="row" style="margin-bottom:4px"><p class="kicker" style="margin:0">' + esc(r.household.name) + '</p><span class="mono">invite code ' + esc(r.household.code) + '</span></div>' +
         '<p class="kicker muted" style="padding:6px 2px 0">This week · no leaderboard, just a table</p>';
    for (const x of rows) {
      h += '<section class="card" style="display:grid;grid-template-columns:38px minmax(0,1fr) auto;gap:4px 12px;align-items:center">' +
           '<span style="grid-row:span 2;width:38px;height:38px;border-radius:50%;background:var(--accent-soft);color:var(--accent);display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:18px;font-weight:600">' + esc(x.name.slice(0, 1).toUpperCase()) + '</span>' +
           '<span style="font-size:15px;font-weight:600">' + esc(x.name) + (x.me ? ' <span style="font-size:11px;font-weight:400;color:var(--ink-3)">you</span>' : '') + '</span>' +
           '<span class="mono" style="text-align:right;color:var(--ink-2)">streak ' + x.streak + ' · ❄ ' + x.freezes + '</span>' +
           '<span class="small">Step ' + x.cur.order + ', ' + esc(x.cur.name.toLowerCase()) + ' · ' + tierName(x.tier) + ' · ' + x.week + ' questions this week</span>' +
           '<span class="mono" style="text-align:right;color:var(--miss)">' + (x.weak ? 'weakest: ' + esc(x.weak.name.toLowerCase()) : '') + '</span></section>';
    }
    h += '<section class="card"><p class="kicker">Household this week</p><div class="tiles" style="grid-template-columns:repeat(3,minmax(0,1fr))">' +
         '<div><span class="tile v" style="font-family:var(--serif);font-size:24px;font-weight:600;display:block">' + tot.week + '</span><span class="small">questions</span></div>' +
         '<div><span style="font-family:var(--serif);font-size:24px;font-weight:600;display:block">' + rows.length + '</span><span class="small">people</span></div>' +
         '<div><span style="font-family:var(--serif);font-size:24px;font-weight:600;display:block">' + tot.mastered + '</span><span class="small">steps mastered</span></div></div></section>' +
         '<div class="acts"><button class="btn ghost" id="hleave" type="button">Leave this household</button></div></div>';
    view.innerHTML = h;
    $("#hleave").onclick = async () => { if (!$("#hleave").dataset.armed) { $("#hleave").dataset.armed = "1"; $("#hleave").textContent = "Tap again to leave"; return; } await CP.sync.householdLeave(); renderHousehold(); };
  }).catch(e => { view.innerHTML = '<h1 style="font-size:24px">Household</h1><p class="small">' + esc(CP.sync.errorText(e)) + '</p>'; });
}

/* ---------- Me ---------- */
function accountCard() {
  if (!CP.sync.enabled) return '<section class="card"><p class="kicker muted">This device only</p><p class="small">The site is not connected to its shared record yet, so there is no sign-in. Everything is saved on this phone. The setup guide in the repository connects it.</p></section>';
  if (CP.sync.signedIn()) {
    const st = { ok: "Synced", offline: "Saved here, will sync when there is signal", auth: "PIN no longer matches: sign out and in again", off: "" }[CP.sync.status] || "";
    const pr = CP.sync.profile || {};
    return '<section class="card"><div class="row"><p class="kicker">Signed in as ' + esc(CP.sync.auth.name) + '</p><span class="mono">' + esc(st) + '</span></div>' +
      '<label class="check" style="margin-top:6px"><input type="checkbox" id="shareOn"' + (pr.shareOn ? " checked" : "") + '> Share a read-only progress page</label>' +
      (pr.shareOn && CP.sync.shareUrl() ? '<p class="small" style="margin-top:8px;word-break:break-all">Your link: <a href="' + esc(CP.sync.shareUrl()) + '" target="_blank" rel="noopener">' + esc(CP.sync.shareUrl()) + '</a></p><div class="acts"><button class="btn ghost" id="copyShare" type="button">Copy link</button></div>' : '') +
      '<div class="field" style="margin-top:14px"><label for="npin">Change PIN</label><input type="text" id="npin" inputmode="numeric" maxlength="8" placeholder="new PIN"></div><div class="acts"><button class="btn ghost" id="chpin" type="button">Change</button><button class="btn ghost" id="signout" type="button">Sign out</button></div><p class="note" id="aerr"></p></section>';
  }
  return '<section class="card"><p class="kicker">Sign in</p><p class="small">A name and a PIN. Add the invite code the first time to make your profile. Then your progress follows you to any device.</p>' +
    '<div class="field" style="margin-top:10px"><label for="sn">Name</label><input type="text" id="sn" autocomplete="username" placeholder="Pete"></div>' +
    '<div class="field"><label for="sp">PIN</label><input type="text" id="sp" inputmode="numeric" maxlength="8" autocomplete="current-password" placeholder="4 digits"></div>' +
    '<div class="field"><label for="si">Invite code, first time only</label><input type="text" id="si" placeholder="from whoever invited you"></div>' +
    '<div class="acts"><button class="btn" id="signin" type="button">Sign in</button></div><p class="note" id="aerr"></p></section>';
}
function wireAccount() {
  const err = m => { const e = $("#aerr"); if (e) e.textContent = m; };
  const si = $("#signin"); if (si) si.onclick = async () => { si.disabled = true; err("Signing in…"); try { await CP.sync.signIn($("#sn").value, $("#sp").value, $("#si").value); renderMe(); } catch (e) { err(CP.sync.errorText(e)); si.disabled = false; } };
  const so = $("#signout"); if (so) so.onclick = () => { CP.sync.signOut(); renderMe(); };
  const sh = $("#shareOn"); if (sh) sh.onchange = async () => { await CP.sync.setShare(sh.checked); renderMe(); };
  const cp = $("#copyShare"); if (cp) cp.onclick = () => { navigator.clipboard.writeText(CP.sync.shareUrl()).then(() => { cp.textContent = "Copied"; }).catch(() => { cp.textContent = "Long-press the link to copy it"; }); };
  const ch = $("#chpin"); if (ch) ch.onclick = async () => { try { await CP.sync.changePin($("#npin").value); err("PIN changed."); } catch (e) { err(CP.sync.errorText(e)); } };
}
function renderMe() {
  const p = S().profile;
  view.innerHTML = '<h1 style="font-size:24px">Me</h1><div class="stack">' + accountCard() + '<section class="card">' +
    '<div class="field"><label for="nm">Your name</label><input type="text" id="nm" value="' + esc(p.name) + '" placeholder="So the welcome-back knows who you are" autocomplete="given-name"></div>' +
    '<div class="field"><label>Daily lesson size</label><div class="chips">' + [3, 5, 8].map(n => '<button type="button" class="chip" data-n="' + n + '" aria-pressed="' + (p.size === n) + '">' + n + ' questions</button>').join("") + '</div></div>' +
    '<div class="field"><label>Tracks</label><div class="chips">' + CP.TRACKS.map(t => '<button type="button" class="chip" aria-pressed="' + p.tracks.includes(t.id) + '"' + (t.available ? "" : " disabled") + '>' + esc(t.name) + (t.available ? "" : " · coming") + '</button>').join("") + '</div></div></section>' +
    '<section class="card"><p class="kicker">The morning email</p><p class="small">' + (CP.sync.signedIn() ? "One email each morning with the day\u2019s rule, the real-life number and a link. It starts once the sending job is switched on." : "Sign in first, so the morning job knows whose lesson to send.") + '</p>' +
    '<div class="field" style="margin-top:10px"><label for="em">Email</label><input type="email" id="em" value="' + esc(p.email) + '" placeholder="you@example.com" autocomplete="email"></div>' +
    '<label class="check"><input type="checkbox" id="opt"' + (p.emailOptIn ? " checked" : "") + '> Send me the lesson each morning</label></section>' +
    '<section class="card"><p class="kicker">On your phone</p><p class="small">Open this page in Safari or Chrome, use the share or menu button, and choose <strong>Add to Home Screen</strong>. It then opens full-screen like an app and works without signal.</p></section>' +
    '<section class="card"><p class="kicker muted">Data</p><p class="small">Everything is saved on this device the moment you tap' + (CP.sync.signedIn() ? ", then synced to your profile a moment later." : ".") + '</p><div class="acts"><button class="btn ghost" id="reset" type="button">Start over</button></div></section></div>' +
    '<footer>Chalk and Paper · built to the Ontario MCV4U expectations</footer>';
  wireAccount();
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
  clearInterval(testTimer);
  paintTally();
  if (name === "today") renderToday();
  else if (name === "lesson") renderToday(arg);
  else if (name === "practice") renderPractice(arg);
  else if (name === "progress") renderProgress();
  else if (name === "test") renderTest(arg);
  else if (name === "household") renderHousehold();
  else if (name === "me") renderMe();
  else renderToday();
  window.scrollTo({ top: 0 });
}
window.addEventListener("hashchange", route);

/* ---------- boot ---------- */
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
loadLive().then(() => { CP.settleFreezes(); route(); if (CP.sync.signedIn()) CP.sync.pull().then(() => { CP.settleFreezes(); route(); }); });
CP.sync.onChange = () => { if ((location.hash || "#today") === "#me") paintTally(); };
document.addEventListener("keydown", e => {
  if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
  const opts = Array.from(view.querySelectorAll(".opt:not(:disabled)"));
  const k = e.key.toUpperCase(), ix = "ABCD".indexOf(k) >= 0 ? "ABCD".indexOf(k) : "1234".indexOf(e.key);
  if (opts.length && ix >= 0 && ix < opts.length) { e.preventDefault(); opts[ix].click(); }
  else if (e.key === "Enter" && $("#next") && document.activeElement !== $("#next")) { e.preventDefault(); $("#next").click(); }
});
})();
