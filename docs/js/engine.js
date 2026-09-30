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
    steps: {},        /* id -> { box, due, tier, hist:[bool], seenDemo, bestMs, attempts, correct, mastered, tierRun:[bool], bestTier, tierStats:[{a,c}]x5, tierReached:{tier:date} } */
    lessons: {},      /* date -> lesson */
    days: {},         /* date -> { q:n, right:n } */
    answers: [],      /* { t, step, kind, ok, chosen, ms } capped at 2000 */
    points: 0,
    freezes: 0, freezeEarnedAt: 0,
    run: 0, bestRun: 0,
    lastActive: null,
    frozen: {},
    easeUntil: null,  /* date until which lessons are shortened after a break */
    tierLog: [],      /* { t, step, tier, dir } newest last, capped at 50 */
    tests: [],        /* finished tests: { id, scope, stepId, n, right, ms, date, best, bonus } */
    testBests: {},    /* scope key -> { pct, right, n, ms, date } */
    activeTest: null, /* the test in progress, saved on every tap */
    lastTest: null,   /* the last finished test with its questions, for the review screen */
    noteIx: {}        /* step -> next "where this shows up" note to show */
  };
}
let S = fresh();
CP.state = () => S;

/* The read-only share page sets CP.readOnly so a shared record never touches this device's own saved progress. */
const RO = () => !!CP.readOnly;
function load() {
  if (RO()) return;
  try { const r = JSON.parse(localStorage.getItem(KEY) || "null"); if (r && r.v === 1) S = Object.assign(fresh(), r); } catch (e) {}
}
function save() { if (RO()) return; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} if (CP.afterSave) CP.afterSave(); }
CP.save = save;
CP.replaceState = function (next) { S = Object.assign(fresh(), next); if (RO()) return; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
CP.reset = () => { S = fresh(); save(); };
load();

/* ---------- steps ---------- */
const INTERVALS = [0, 1, 3, 7, 14, 30, 60]; /* days until next review, by box */
CP.MASTER_BOX = 3;
function stepState(id) {
  const s = S.steps[id] || (S.steps[id] = { box: 0, due: null, tier: 0, hist: [], seenDemo: false, bestMs: null, attempts: 0, correct: 0, mastered: false });
  /* records from before five tiers: keep the tier, start its run fresh */
  if (!s.tierRun) { s.tierRun = []; s.bestTier = s.tier || 0; s.tierStats = [0, 1, 2, 3, 4].map(() => ({ a: 0, c: 0 })); s.tierReached = {}; }
  return s;
}
CP.TOP_TIER = 4;
/* Answers at the step's current tier count toward moving: 4 of the last 5 right moves up, 2 wrong in a row moves down.
   Tests record accuracy but never move a tier; a test should measure, not change, what it measures. */
const TIER_MOVES = { skill: 1, practice: 1, review: 1 };
function moveTier(id, ss, dir) {
  ss.tier += dir; ss.tierRun = [];
  if (ss.tier > ss.bestTier) ss.bestTier = ss.tier;
  if (dir > 0 && !ss.tierReached[ss.tier]) ss.tierReached[ss.tier] = today();
  S.tierLog = (S.tierLog || []).concat([{ t: Date.now(), step: id, tier: ss.tier, dir }]).slice(-50);
  return dir > 0 ? { tierUp: ss.tier, step: id } : { tierDown: ss.tier, step: id };
}
/* where a step stands on its tier ladder, for the progress bar */
CP.tierProgress = function (id) {
  const ss = stepState(id), run = ss.tierRun.slice(-5);
  let need = null;
  if (ss.tier < CP.TOP_TIER) for (let k = 0; k <= 5; k++) { const r = ss.tierRun.concat(Array(k).fill(true)).slice(-5); if (r.length >= 5 && r.filter(Boolean).length >= 4) { need = k; break; } }
  const st = ss.tierStats[ss.tier];
  return { tier: ss.tier, best: ss.bestTier, run, right: run.filter(Boolean).length, need, acc: st.a ? st.c / st.a : null, answered: st.a, reached: ss.tierReached };
};
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

/* ---------- where this shows up ---------- */
/* Each question carries the index of one real-life note for its step. The index rotates, so notes rarely repeat back to back. */
CP.nextNote = function (stepId) {
  const pool = (CP.NOTES || {})[stepId]; if (!pool || !pool.length) return null;
  S.noteIx = S.noteIx || {};
  const i = (S.noteIx[stepId] || 0) % pool.length; S.noteIx[stepId] = i + 1;
  return i;
};
CP.noteFor = (stepId, ix) => stepId && ix != null ? ((CP.NOTES || {})[stepId] || [])[ix] || null : null;
const withNote = it => { if (it.step && it.kind !== "practical" && it.kind !== "why") it.noteIx = CP.nextNote(it.step); return it; };

/* ---------- recording an answer ---------- */
function bumpDay(ok) {
  const d = S.days[today()] || (S.days[today()] = { q: 0, right: 0 });
  d.q++; if (ok) d.right++;
}
CP.recordAnswer = function ({ stepId, kind, ok, chosen, ms, tier }) {
  let ev = null;
  const tr = typeof tier === "number" ? tier : 0;
  const t = today();
  S.answers.push({ t: Date.now(), step: stepId, kind, ok, chosen, ms: ms || null });
  if (S.answers.length > 2000) S.answers = S.answers.slice(-2000);
  bumpDay(ok);
  S.lastActive = t;
  /* points: never deducted */
  const st = stepId ? CP.stepById(stepId) : null;
  if (ok) {
    S.points += kind === "why" || kind === "practical" || kind === "scenario" ? 15 : kind === "review" ? 15 + 5 * tr : 10 * (st ? st.weight : 1) + 5 * tr;
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
    } else if (ss.mastered) { ss.box = Math.max(1, ss.box - 1); ss.due = isoFromDayNum(dayNum(t) + 1); }
    /* tier ladder: stats at every tier; movement only from answers at the current tier */
    if (typeof tier === "number" && tier >= 0 && tier <= CP.TOP_TIER) {
      const ts = ss.tierStats[tier]; ts.a++; if (ok) ts.c++;
      if (TIER_MOVES[kind] && tier === ss.tier) {
        ss.tierRun.push(ok); if (ss.tierRun.length > 10) ss.tierRun = ss.tierRun.slice(-10);
        const r5 = ss.tierRun.slice(-5), r2 = ss.tierRun.slice(-2);
        if (r5.length >= 5 && r5.filter(Boolean).length >= 4 && ss.tier < CP.TOP_TIER) ev = moveTier(stepId, ss, 1);
        else if (r2.length === 2 && !r2[0] && !r2[1] && ss.tier > 0) ev = moveTier(stepId, ss, -1);
      }
    }
  }
  freezesEarned();
  save();
  return ev;
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
  const onStep = Object.values(S.lessons).filter(l => l.stepId === step.id).length;
  const lessonNote = CP.nextNote(step.id);
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
  /* the real-life slot: the step's worked calculation on its first lesson and every third after; otherwise a fresh real situation */
  if (onStep % 3 === 0 || !CP.buildCtx || !(CP.CTX || {})[step.id]) {
    const L = Object.assign({}, CP.LIVE_FALLBACK, CP.liveData || {});
    const pr = step.practical.build(L);
    items.push({ kind: "practical", step: step.id, live: !!(CP.liveData && step.practical.live), source: pr.source, setup: pr.setup, lines: pr.lines,
      answer: pr.answer, why: pr.why, task: pr.q, expr: "", prose: true,
      options: CP.gutil.shuffle(pr.options.map(o => ({ html: o.html, ok: !!o.ok, why: o.why || "" }))) });
  } else {
    const sc = Object.assign(CP.freeze(CP.buildCtx(step.id), step.id, 2), { kind: "scenario" });
    delete sc.tier; /* a real situation is not a tier question: it never moves the tier */
    items.push(sc);
  }
  items.forEach(withNote);
  const lesson = { date, stepId: step.id, stepName: step.name, items, ix: 0, answers: [], done: false, created: Date.now(), noteIx: lessonNote };
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
  const ev = CP.recordAnswer({ stepId: it.step, kind: it.kind, ok, chosen: it.options[chosenIx].html, ms, tier: it.tier });
  lesson.ix = itemIx + 1;
  if (lesson.ix >= lesson.items.length) lesson.done = true;
  save();
  return { ok, ev };
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
  for (let i = 0; i < 3; i++) { const p = CP.build(prereqStep.id, 0); ins.push(withNote(Object.assign(CP.freeze(p, prereqStep.id, 0), { kind: "stepback" }))); }
  lesson.items.splice(lesson.ix, 0, ...ins);
  lesson.steppedBack = true;
  save();
};

/* free practice outside a lesson */
CP.practiceProblem = function (stepId) {
  const ss = stepState(stepId);
  const p = CP.build(stepId, ss.tier);
  const it = withNote(Object.assign(CP.freeze(p, stepId, ss.tier), { kind: "practice" }));
  save();
  return it;
};

/* ---------- test mode ---------- */
/* No hints, no feedback until the end, no step-backs. Each step is asked at its current tier. Saved on every tap. */
CP.TEST_SIZES = [5, 8, 12];
CP.TEST_CAP_MS = 600000; /* a question left open longer than 10 minutes counts as 10 minutes */
CP.testSteps = function (scope, stepId) {
  const trackId = S.profile.tracks[0] || "mcv4u", all = trackSteps(trackId);
  if (scope === "step") return [CP.stepById(stepId) || CP.currentStep(trackId)];
  if (scope === "mastered") { const m = all.filter(s => CP.mastered(s.id)); return m.length ? m : null; }
  return all;
};
CP.testLabel = (scope, stepId) => scope === "step" ? (CP.stepById(stepId) || CP.currentStep(S.profile.tracks[0] || "mcv4u")).name : scope === "mastered" ? "Everything mastered" : "Whole course";
const testKey = (scope, stepId, n) => (scope === "step" ? "step:" + stepId : scope) + ":" + n;
CP.testBest = (scope, stepId, n) => (S.testBests || {})[testKey(scope, stepId, n)] || null;
CP.startTest = function (scope, n, stepId) {
  const steps = CP.testSteps(scope, stepId);
  if (!steps) return null;
  const order = []; while (order.length < n) order.push(...CP.gutil.shuffle(steps.slice()));
  const items = order.slice(0, n).map(st => { const tier = stepState(st.id).tier; return withNote(Object.assign(CP.freeze(CP.build(st.id, tier), st.id, tier), { kind: "test", noHint: true })); });
  S.activeTest = { id: Date.now(), scope, stepId: scope === "step" ? steps[0].id : null, items, answers: [], started: Date.now() };
  save();
  return S.activeTest;
};
CP.answerTest = function (chosenIx, ms) {
  const T = S.activeTest; if (!T) return null;
  const i = T.answers.length, it = T.items[i]; if (!it) return null;
  const ok = !!it.options[chosenIx].ok, t = Math.max(0, Math.min(ms || 0, CP.TEST_CAP_MS));
  T.answers.push({ i, chosen: chosenIx, ok, ms: t });
  CP.recordAnswer({ stepId: it.step, kind: "test", ok, chosen: it.options[chosenIx].html, ms: t, tier: it.tier });
  return { ok, done: T.answers.length >= T.items.length };
};
CP.finishTest = function () {
  const T = S.activeTest; if (!T || T.answers.length < T.items.length) return null;
  const n = T.items.length, right = T.answers.filter(a => a.ok).length, ms = T.answers.reduce((s, a) => s + a.ms, 0), pct = right / n;
  const key = testKey(T.scope, T.stepId, n), prev = S.testBests[key];
  const best = !prev || pct > prev.pct || (pct === prev.pct && ms < prev.ms);
  if (best) S.testBests[key] = { pct, right, n, ms, date: today() };
  const bonus = right === n ? 25 : 0; S.points += bonus;
  const rec = { id: T.id, scope: T.scope, stepId: T.stepId, n, right, ms, date: today(), best, first: !prev, bonus };
  S.tests = (S.tests || []).concat([rec]).slice(-60);
  S.lastTest = { rec, items: T.items, answers: T.answers };
  S.activeTest = null;
  save();
  return rec;
};
CP.abandonTest = () => { S.activeTest = null; save(); };

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
