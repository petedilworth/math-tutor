/* Chalk and Paper – engine
   Storage (saved on every tap), spaced review, the daily lesson, the safety net, and the game.
   No UI here. app.js renders what this decides. */

window.CP = window.CP || {};
(function () {
const KEY = "chalk-paper-site-v1";
const DAY = 86400000;
const today = () => new Date().toISOString().slice(0, 10);
const dayNum = iso => Math.floor(Date.parse(iso + "T00:00:00Z") / DAY);
const isoFromDayNum = n => new Date(n * DAY).toISOString().slice(0, 10);

/* ---------- state ---------- */
function fresh() {
  return {
    v: 1,
    profile: { name: "", tracks: ["mcv4u"], size: 5, email: "", emailOptIn: false, created: today() },
    steps: {},        /* id -> { box, due, tier, hist:[bool], seenDemo:bool, bestMs, attempts, correct } */
    lessons: {},      /* date -> lesson */
    days: {},         /* date -> { q:n, right:n } */
    answers: [],      /* { t, step, kind, ok, chosen, ms } capped at 2000 */
    points: 0,
    freezes: 0, freezeEarnedAt: 0,
    run: 0, bestRun: 0,
    lastActive: null,
    frozen: {},
    easeUntil: null   /* date until which lessons are shortened after a break */
  };
}
let S = fresh();
CP.state = () => S;

function load() {
  try { const r = JSON.parse(localStorage.getItem(KEY) || "null"); if (r && r.v === 1) S = Object.assign(fresh(), r); } catch (e) {}
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
CP.save = save;
CP.reset = () => { S = fresh(); save(); };
load();

/* ---------- steps ---------- */
const INTERVALS = [0, 1, 3, 7, 14, 30, 60]; /* days until next review, by box */
CP.MASTER_BOX = 3;
function stepState(id) {
  return S.steps[id] || (S.steps[id] = { box: 0, due: null, tier: 0, hist: [], seenDemo: false, bestMs: null, attempts: 0, correct: 0, mastered: false });
}
CP.stepState = stepState;
CP.mastered = id => !!stepState(id).mastered;
CP.due = id => { const s = stepState(id); return !!s.mastered && !!s.due && s.due <= today(); };

function trackSteps(trackId) { return CP.STEPS.filter(s => s.track === trackId).sort((a, b) => a.order - b.order); }
CP.trackSteps = trackSteps;

/* the step a person is working on: first unmastered step whose prerequisite is mastered (or has none) */
CP.currentStep = function (trackId) {
  const steps = trackSteps(trackId);
  for (const st of steps) if (!CP.mastered(st.id)) return st;
  return steps[steps.length - 1];
};

/* ---------- recording an answer ---------- */
function bumpDay(ok) {
  const d = S.days[today()] || (S.days[today()] = { q: 0, right: 0 });
  d.q++; if (ok) d.right++;
}
CP.recordAnswer = function ({ stepId, kind, ok, chosen, ms }) {
  const t = today();
  S.answers.push({ t: Date.now(), step: stepId, kind, ok, chosen, ms: ms || null });
  if (S.answers.length > 2000) S.answers = S.answers.slice(-2000);
  bumpDay(ok);
  S.lastActive = t;
  /* points: never deducted */
  const st = stepId ? CP.stepById(stepId) : null;
  if (ok) {
    S.points += kind === "why" ? 15 : kind === "practical" ? 15 : kind === "review" ? 15 : 10 * (st ? st.weight : 1);
    S.run++; if (S.run > S.bestRun) S.bestRun = S.run;
  } else S.run = 0;
  if (stepId && kind !== "why") {
    const ss = stepState(stepId);
    ss.attempts++; if (ok) ss.correct++;
    ss.hist.push(ok); if (ss.hist.length > 20) ss.hist = ss.hist.slice(-20);
    if (ok && ms && (ss.bestMs === null || ms < ss.bestMs)) ss.bestMs = ms;
    /* spaced review: right moves the box up and pushes the date out; wrong pulls it back */
    if (ok) {
      if (!ss.mastered) {
        const last5 = ss.hist.slice(-5);
        if (last5.length >= 4 && last5.filter(Boolean).length >= 4) { ss.mastered = true; ss.box = CP.MASTER_BOX; ss.due = isoFromDayNum(dayNum(t) + INTERVALS[ss.box]); }
      } else if (kind === "review") {
        ss.box = Math.min(ss.box + 1, INTERVALS.length - 1); ss.due = isoFromDayNum(dayNum(t) + INTERVALS[ss.box]);
      }
      /* difficulty rises after 4 of the last 5 right at this tier */
      const l5 = ss.hist.slice(-5);
      if (l5.length >= 5 && l5.filter(Boolean).length >= 4 && ss.tier < 2) { ss.tier++; ss.hist = []; }
    } else {
      if (ss.mastered) { ss.box = Math.max(1, ss.box - 1); ss.due = isoFromDayNum(dayNum(t) + 1); }
      /* two wrong in a row drops the tier */
      const l2 = ss.hist.slice(-2);
      if (l2.length === 2 && !l2[0] && !l2[1] && ss.tier > 0) { ss.tier--; }
    }
  }
  freezesEarned();
  save();
};

/* ---------- streak and freezes ---------- */
function practisedDays() { return Object.keys(S.days).filter(d => S.days[d].q > 0).sort(); }
function freezesEarned() {
  const n = practisedDays().length;
  const earned = Math.floor(n / 5);
  if (earned > S.freezeEarnedAt) { S.freezes = Math.min(3, S.freezes + (earned - S.freezeEarnedAt)); S.freezeEarnedAt = earned; }
}
/* A day counts toward the streak if practised, or if a banked freeze covered it. Today, not yet practised, breaks nothing. */
CP.streak = function () {
  const covered = iso => ((S.days[iso] || {}).q > 0) || !!(S.frozen && S.frozen[iso]);
  let n = 0, cur = dayNum(today());
  if (!covered(today())) cur--;
  while (n < 4000 && covered(isoFromDayNum(cur))) { n++; cur--; }
  return { days: n, freezesBanked: S.freezes };
};
/* On open: each missed day since last active consumes a banked freeze, once. A long gap eases the next few lessons. */
CP.settleFreezes = function () {
  if (!S.lastActive) return;
  S.frozen = S.frozen || {};
  const start = dayNum(S.lastActive) + 1, end = dayNum(today()) - 1;
  for (let d = start; d <= end; d++) {
    const iso = isoFromDayNum(d);
    if ((S.days[iso] || {}).q > 0 || S.frozen[iso]) continue;
    if (S.freezes > 0) { S.freezes--; S.frozen[iso] = true; }
  }
  if (end - start + 1 > 3 && !(S.easeUntil && S.easeUntil >= today())) S.easeUntil = isoFromDayNum(dayNum(today()) + 3);
  save();
};
CP.gapDays = () => S.lastActive ? dayNum(today()) - dayNum(S.lastActive) : 0;

/* ---------- points and levels ---------- */
CP.LEVEL_STEP = 500;
CP.level = () => { const n = Math.floor(S.points / CP.LEVEL_STEP); return { n: n + 1, title: CP.LEVELS[Math.min(n, CP.LEVELS.length - 1)], toNext: CP.LEVEL_STEP - (S.points % CP.LEVEL_STEP) }; };

/* ---------- the daily lesson ---------- */
function lessonSize() {
  let n = S.profile.size || 5;
  if (S.easeUntil && S.easeUntil >= today()) n = Math.min(n, 3);
  return n;
}
CP.liveData = null; /* set by app.js after fetching data/live.json */

CP.makeLesson = function (date) {
  const trackId = S.profile.tracks[0] || "mcv4u";
  const step = CP.currentStep(trackId);
  const ss = stepState(step.id);
  const n = lessonSize();
  const items = [];
  /* worked example first time on a step */
  if (!ss.seenDemo) { const p = CP.build(step.id, 0); items.push(Object.assign(CP.freeze(p, step.id, 0), { kind: "demo" })); }
  for (let i = 0; i < n; i++) { const p = CP.build(step.id, ss.tier); items.push(Object.assign(CP.freeze(p, step.id, ss.tier), { kind: "skill" })); }
  /* review: due steps, at most two, highest box first */
  const dueSteps = trackSteps(trackId).filter(s => s.id !== step.id && CP.due(s.id)).sort((a, b) => stepState(b.id).box - stepState(a.id).box).slice(0, 2);
  for (const d of dueSteps) { const p = CP.build(d.id, stepState(d.id).tier); items.push(Object.assign(CP.freeze(p, d.id, stepState(d.id).tier), { kind: "review" })); }
  /* one why-question, rotating */
  const whyIx = Object.keys(S.lessons).length % CP.WHY.length;
  const w = CP.WHY[whyIx];
  items.push({ kind: "why", step: null, task: "Pick the best reason.", expr: w.q, prose: true, explain: w.explain,
    options: CP.gutil.shuffle([{ html: w.right, ok: true, why: "" }].concat(w.wrong.map(x => ({ html: x[0], ok: false, why: x[1] })))) });
  /* the real-life calculation, with a question */
  const L = Object.assign({}, CP.LIVE_FALLBACK, CP.liveData || {});
  const pr = step.practical.build(L);
  items.push({ kind: "practical", step: step.id, live: !!(CP.liveData && step.practical.live), source: pr.source, setup: pr.setup, lines: pr.lines,
    answer: pr.answer, why: pr.why, task: pr.q, expr: "", prose: true,
    options: CP.gutil.shuffle(pr.options.map(o => ({ html: o.html, ok: !!o.ok, why: o.why || "" }))) });
  const lesson = { date, stepId: step.id, stepName: step.name, items, ix: 0, answers: [], done: false, created: Date.now() };
  S.lessons[date] = lesson;
  save();
  return lesson;
};

CP.todayLesson = function () {
  const t = today();
  return S.lessons[t] || CP.makeLesson(t);
};
/* open lessons: not done, within 14 days, newest first; older ones fold away */
CP.openLessons = function () {
  const cutoff = dayNum(today()) - 14;
  return Object.values(S.lessons).filter(l => !l.done && dayNum(l.date) >= cutoff).sort((a, b) => b.date.localeCompare(a.date));
};
CP.lessonProgress = l => ({ done: l.answers.length, total: l.items.filter(i => i.kind !== "demo").length });

/* answer an item in a lesson; records everything; returns {ok} */
CP.answerLesson = function (lesson, itemIx, chosenIx, ms) {
  const it = lesson.items[itemIx];
  if (it.kind === "demo") { lesson.ix = itemIx + 1; stepState(it.step).seenDemo = true; save(); return { demo: true }; }
  const ok = !!it.options[chosenIx].ok;
  lesson.answers.push({ i: itemIx, chosen: chosenIx, ok, t: Date.now() });
  CP.recordAnswer({ stepId: it.step, kind: it.kind, ok, chosen: it.options[chosenIx].html, ms });
  lesson.ix = itemIx + 1;
  if (lesson.ix >= lesson.items.length) lesson.done = true;
  save();
  return { ok };
};
/* two wrong in a row on the lesson's main step? offer a step back */
CP.shouldStepBack = function (lesson) {
  const recent = lesson.answers.filter(a => lesson.items[a.i].kind === "skill").slice(-2);
  if (recent.length < 2 || recent.some(a => a.ok)) return null;
  const st = CP.stepById(lesson.stepId);
  if (!st || !st.prereq || lesson.steppedBack) return null;
  return CP.stepById(st.prereq);
};
/* three easy questions on the prerequisite, inserted after the current item */
CP.insertStepBack = function (lesson, prereqStep) {
  const ins = [];
  for (let i = 0; i < 3; i++) { const p = CP.build(prereqStep.id, 0); ins.push(Object.assign(CP.freeze(p, prereqStep.id, 0), { kind: "stepback" })); }
  lesson.items.splice(lesson.ix, 0, ...ins);
  lesson.steppedBack = true;
  save();
};

/* free practice outside a lesson */
CP.practiceProblem = function (stepId) {
  const ss = stepState(stepId);
  const p = CP.build(stepId, ss.tier);
  return Object.assign(CP.freeze(p, stepId, ss.tier), { kind: "practice" });
};

/* ---------- progress views ---------- */
CP.calendar = function (weeks = 8) {
  const out = [], end = dayNum(today());
  for (let i = weeks * 7 - 1; i >= 0; i--) { const iso = isoFromDayNum(end - i); out.push({ date: iso, q: (S.days[iso] || {}).q || 0, today: iso === today() }); }
  return out;
};
CP.bests = function () {
  const b = { bestRun: S.bestRun, fastest: null, bestAcc: null, longestStreak: 0 };
  for (const st of CP.STEPS) {
    const s = S.steps[st.id]; if (!s) continue;
    if (s.bestMs && (!b.fastest || s.bestMs < b.fastest.ms)) b.fastest = { ms: s.bestMs, name: st.name };
    if (s.attempts >= 5) { const acc = s.correct / s.attempts; if (!b.bestAcc || acc > b.bestAcc.acc) b.bestAcc = { acc, name: st.name }; }
  }
  /* longest streak ever: scan practised days */
  const days = practisedDays().map(dayNum); let run = 0, prev = null;
  for (const d of days) { run = prev !== null && d === prev + 1 ? run + 1 : 1; prev = d; if (run > b.longestStreak) b.longestStreak = run; }
  return b;
};
CP.weakest = function () {
  let w = null;
  for (const st of CP.STEPS) { const s = S.steps[st.id]; if (!s || s.attempts < 3) continue; const acc = s.correct / s.attempts; if (!w || acc < w.acc) w = { acc, name: st.name, id: st.id }; }
  return w;
};
CP.mistakes = function () {
  /* which wrong option was chosen most, per step, from stored answers */
  const by = {};
  for (const a of S.answers) { if (a.ok || !a.step) continue; const k = a.step + "|" + a.chosen; by[k] = (by[k] || 0) + 1; }
  return Object.entries(by).map(([k, n]) => { const [step, chosen] = k.split("|"); return { step, chosen, n }; }).sort((a, b) => b.n - a.n).slice(0, 8);
};
CP.today = today;
})();
