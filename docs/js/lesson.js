/* Chalk and Paper – the full lesson for each step.
   lesson.html#stepId shows one lesson; lesson.html on its own lists all of them.
   Lesson text lives in js/lessons/*.js as CP.LESSONS[stepId]; the pictures come from js/widgets.js;
   "check yourself" questions are made fresh by the same generators the daily lesson uses. */
(function () {
const $ = s => document.querySelector(s);
const view = $("#view");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const ORDER = CP.UNITS.reduce((a, u) => a.concat(u.steps), []);
const L = () => CP.LESSONS || {};
let teach = false; try { teach = localStorage.getItem("cp-teach") === "1"; } catch (e) {}
const live = [];
function stopAll() { while (live.length) { const w = live.pop(); if (w && w.stop) w.stop(); } }

async function loadLive() {
  try {
    const r = await fetch("data/live.json", { cache: "no-store" }); if (!r.ok) return;
    const j = await r.json(); if (j && j.asOf && (Date.now() - Date.parse(j.asOf)) / 86400000 <= 4) CP.liveData = j;
  } catch (e) {}
}

function status(id) {
  const ss = CP.stepState(id), rec = CP.lessonRecord(id);
  const st = ss.mastered ? ["done", "Mastered"] : (ss.attempts || 0) > 0 ? ["prog", CP.TIERS[ss.tier || 0] + " tier"] : ["new", "Not started"];
  return { cls: st[0], label: st[1], read: rec };
}
const ago = t => { const d = Math.floor((Date.now() - t) / 86400000); return d <= 0 ? "today" : d === 1 ? "yesterday" : d + " days ago"; };

/* ---------------- the list of all lessons ---------------- */
function renderIndex() {
  stopAll();
  document.title = "Full lessons · Chalk and Paper";
  const nRead = ORDER.filter(id => CP.lessonRecord(id)).length;
  let h = '<section class="lhero"><p class="kicker">Full lessons</p><h1>Every rule, explained properly</h1><p class="lede">One lesson per step: a picture you can move, the rule, why it is true, worked examples, the usual mistakes, and three fresh questions. ' + nRead + ' of ' + ORDER.length + ' opened so far.</p></section>';
  for (const u of CP.UNITS) {
    h += '<section class="lunit"><p class="kicker muted">' + esc(u.name) + '</p><div class="llist">';
    for (const id of u.steps) {
      const st = CP.stepById(id), les = L()[id], s = status(id);
      h += '<a class="lrow" href="#' + id + '"><span class="ldot ' + s.cls + '" title="' + s.label + '"></span><span class="lname"><b>' + esc(st.name) + '</b>' +
        (les ? '<span class="lbigs">' + les.big + '</span>' : '<span class="lbigs muted">Coming soon</span>') + '</span>' +
        '<span class="lmeta">' + (s.read ? "read" + (s.read.best != null ? " · " + s.read.best + "/3" : "") : "") + '</span></a>';
    }
    h += '</div></section>';
  }
  view.innerHTML = h;
  window.scrollTo(0, 0);
}

/* ---------------- one lesson ---------------- */
function ruleCard(step) {
  return '<div class="rule"><p class="kicker">The rule</p><p class="rr">' + step.rule.r + '</p>' +
    '<div class="rx"><div class="tipb"><b>Memory tip</b>' + step.rule.tip + '</div><div class="trapb"><b>Watch out</b>' + step.rule.trap + '</div></div></div>';
}
function stepsHtml(steps) { return '<div class="lsteps">' + steps.map(s => '<div class="lstep"><span class="m">' + s[0] + '</span>' + (s[1] ? '<span class="lw">' + s[1] + '</span>' : "") + '</div>').join("") + '</div>'; }
function teachHtml(t) {
  if (!t) return "";
  return '<section class="lsec lteachc card tip" id="teach"><p class="kicker tipc">Teaching it · about two minutes</p>' +
    '<p class="h4">Say this</p><ol class="lscript">' + t.script.map(s => '<li>' + s + '</li>').join("") + '</ol>' +
    (t.board ? '<p class="h4">Draw this</p><p class="lp">' + t.board + '</p>' : "") +
    '<p class="h4">Ask these</p><div class="lask">' + t.ask.map(a => '<div><b>' + a.q + '</b><span>Listen for: ' + a.listen + '</span></div>').join("") + '</div>' +
    '<p class="h4">Where it goes wrong</p><p class="lp">' + t.confusion + '</p></section>';
}
function noteCard(id, n) {
  const pool = (CP.NOTES || {})[id]; if (!pool || !pool.length || !CP.workNote) return "";
  let w; try { w = CP.workNote(pool[n % pool.length]); } catch (e) { return ""; }
  const lines = w.lines.map((l, i, a) => { const last = i === a.length - 1 ? " last" : ""; return '<span class="l' + last + '">' + l[0] + '</span><span class="' + last.trim() + '">' + l[1] + '</span><span class="r' + last + '">' + (l[2] || "") + '</span>'; }).join("");
  return '<div class="rl"><span class="lbl">Where this shows up · ' + esc(w.k) + '</span><b class="rl-t">' + w.t + '</b><p class="rl-setup">' + w.setup + '</p><div class="calc">' + lines + '</div><p class="rl-take">' + w.take + '</p>' +
    (w.source ? '<p class="rl-src"><span class="tag' + (w.live ? "" : " off") + '">' + (w.live ? "live" : "fixed example") + '</span> ' + esc(w.source) + '</p>' : "") + '</div>';
}

function renderLesson(id, quiet) {
  stopAll();
  const step = CP.stepById(id), les = L()[id];
  if (!step) { location.hash = ""; return; }
  const unit = CP.unitOf(id), ix = ORDER.indexOf(id), prev = ORDER[ix - 1], next = ORDER[ix + 1];
  const rec = quiet ? (CP.lessonRecord(id) || { n: 1 }) : CP.markRead(id), s = status(id), pre = step.prereq && CP.stepById(step.prereq);
  document.title = step.name + " · Full lesson";
  let h = '<section class="lhero"><p class="kicker">' + esc(unit.name) + ' · lesson ' + (ix + 1) + ' of ' + ORDER.length + '</p><h1>' + esc(step.name) + '</h1>';
  if (!les) {
    view.innerHTML = h + '<p class="lede">This full lesson is still being written.</p>' + ruleCard(step) + navHtml(prev, next, id) + '</section>';
    return;
  }
  h += '<p class="lbig">' + les.big + '</p><div class="lstatus"><span class="lchip ' + s.cls + '">' + s.label + '</span><span class="lchip">' + esc(step.code) + '</span>' +
    (rec.n > 1 ? '<span class="lchip">opened ' + rec.n + ' times</span>' : "") + (pre ? '<a class="lchip link" href="#' + pre.id + '">Builds on: ' + esc(pre.name) + '</a>' : "") + '</div></section>';
  const toc = [["see", "See it"], ["rule", "The rule"], ["why", "Why it’s true"], ["examples", "Examples"], ["mistakes", "Mistakes"], ["check", "Check yourself"]];
  if (teach && les.teach) toc.unshift(["teach", "Teaching it"]);
  h += '<nav class="ltoc">' + toc.map(t => '<a href="#' + id + '/' + t[0] + '">' + t[1] + '</a>').join("") + '</nav>';
  if (teach) h += teachHtml(les.teach);
  h += '<section class="lsec">' + les.intro.map(p => '<p class="lp">' + p + '</p>').join("") + '</section>';
  h += '<section class="lsec" id="see"><h2>See it</h2>' + les.see.map((b, i) =>
    '<div class="lsee"><h3>' + b.h + '</h3>' + (b.text ? '<p class="lp">' + b.text + '</p>' : "") + '<div class="lw" data-w="' + i + '"></div>' +
    (b.tasks && b.tasks.length ? '<p class="h4 ltry">Try this</p><ol class="ltasks" data-t="' + i + '">' + b.tasks.map((t, j) => '<li class="' + (j ? "todo" : "cur") + '"><span class="ltick">' + (j + 1) + '</span><span><span class="lask1">' + t.ask + '</span><span class="lgot" hidden>' + t.got + '</span></span></li>').join("") + '</ol>' : "") +
    (b.after ? '<div class="lafter" data-a="' + i + '"' + (b.tasks && b.tasks.length ? " hidden" : "") + '>' + b.after + '</div>' + (b.tasks && b.tasks.length ? '<button type="button" class="link lskip" data-s="' + i + '">Skip ahead and show what this means</button>' : "") : "") +
    '</div>').join("") + '</section>';
  h += '<section class="lsec" id="rule"><h2>The rule</h2>' + ruleCard(step) + '</section>';
  h += '<section class="lsec" id="why"><h2>Why it’s true</h2>' + (les.why.lead ? '<p class="lp">' + les.why.lead + '</p>' : "") +
    '<details class="lproof"><summary>Show the reasoning, step by step</summary>' + stepsHtml(les.why.steps) + (les.why.end ? '<p class="lp lend">' + les.why.end + '</p>' : "") + '</details></section>';
  h += '<section class="lsec" id="examples"><h2>Worked examples</h2>' + les.examples.map((e, i) =>
    '<div class="lex card" data-e="' + i + '"><p class="kicker muted">' + ["Warm-up", "Standard", "Stretch"][i] + '</p><p class="lq">' + e.q + '</p>' +
    '<div class="lsteps">' + e.steps.map((s2, j) => '<div class="lstep" data-j="' + j + '" hidden><span class="m">' + s2[0] + '</span>' + (s2[1] ? '<span class="lw">' + s2[1] + '</span>' : "") + '</div>').join("") + '</div>' +
    '<p class="lans" hidden><b>Answer</b> <span class="m">' + e.a + '</span></p>' +
    '<div class="acts"><button type="button" class="btn ghost lnext">Show the first step</button><button type="button" class="link lall">Show all</button></div></div>').join("") + '</section>';
  h += '<section class="lsec" id="mistakes"><h2>The usual mistakes</h2>' + les.mistakes.map(m =>
    '<div class="lmis"><p class="lwrong"><span>✗</span> ' + m.wrong + '</p><p class="lp">' + m.why + '</p><p class="lfix"><span>✓</span> ' + m.fix + '</p></div>').join("") + '</section>';
  h += '<section class="lsec" id="check"><h2>Check yourself</h2><p class="lp">Three fresh questions, easy to hard. They don’t count toward your tiers, so guess freely.</p><div id="qs"></div>' +
    '<div class="acts"><button type="button" class="btn ghost" id="moreq">Three new questions</button></div></section>';
  h += '<section class="lsec">' + noteCard(id, rec.n - 1) + '</section>';
  h += '<section class="lsec lrecap card rail"><p class="kicker">Remember</p><ul>' + les.recap.map(r => '<li>' + r + '</li>').join("") + '</ul></section>';
  if (!teach && les.teach) h += '<p class="lteachhint">Teaching this to someone? Turn on <b>Teaching notes</b> at the top for a two-minute script and questions to ask.</p>';
  h += navHtml(prev, next, id);
  view.innerHTML = h;

  /* pictures and their challenges */
  les.see.forEach((b, i) => {
    const host = view.querySelector('[data-w="' + i + '"]'), list = view.querySelector('[data-t="' + i + '"]'), after = view.querySelector('[data-a="' + i + '"]');
    const done = new Set();
    const onChange = st => {
      if (!b.tasks || !list) return;
      const cur = b.tasks.findIndex((t, j) => !done.has(j));
      if (cur < 0) return;
      let ok = false; try { ok = !!b.tasks[cur].check(st); } catch (e) {}
      if (!ok) return;
      done.add(cur);
      const lis = list.children; lis[cur].className = "done"; lis[cur].querySelector(".ltick").textContent = "✓"; lis[cur].querySelector(".lgot").hidden = false;
      if (lis[cur + 1]) lis[cur + 1].className = "cur";
      if (done.size === b.tasks.length && after) { after.hidden = false; const sk = view.querySelector('[data-s="' + i + '"]'); if (sk) sk.remove(); }
    };
    try { live.push(CP.W.mount(host, b.widget, onChange)); } catch (e) { host.innerHTML = '<p class="lp muted">This picture could not load.</p>'; console.error(e); }
  });
  view.querySelectorAll(".lskip").forEach(b => b.onclick = () => { const a = view.querySelector('[data-a="' + b.dataset.s + '"]'); if (a) a.hidden = false; b.remove(); });
  /* examples revealed a step at a time */
  view.querySelectorAll(".lex").forEach(card => {
    const steps = card.querySelectorAll(".lstep"), ans = card.querySelector(".lans"), nb = card.querySelector(".lnext"), all = card.querySelector(".lall");
    let k = 0;
    const show = n => { for (let j = 0; j < n && j < steps.length; j++) steps[j].hidden = false; k = n; if (k >= steps.length) { ans.hidden = false; nb.remove(); all.remove(); } else nb.textContent = "Show the next step"; };
    nb.onclick = () => show(k + 1); all.onclick = () => show(steps.length);
  });
  makeQs(id);
  $("#moreq").onclick = () => makeQs(id);
  view.querySelectorAll(".ltoc a").forEach(a => a.onclick = e => { e.preventDefault(); const t = document.getElementById(a.getAttribute("href").split("/")[1]); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); });
}
function navHtml(prev, next, id) {
  const p = prev && CP.stepById(prev), n = next && CP.stepById(next);
  return '<nav class="lnav">' + (p ? '<a href="#' + p.id + '"><span>← Previous</span><b>' + esc(p.name) + '</b></a>' : "<span></span>") +
    (n ? '<a class="r" href="#' + n.id + '"><span>Next →</span><b>' + esc(n.name) + '</b></a>' : "<span></span>") + '</nav>' +
    '<div class="acts lpract"><a class="btn" href="index.html#practice/' + id + '">Practise this step</a><a class="btn ghost" href="#">All lessons</a></div>';
}

/* ---------------- check yourself ---------------- */
function makeQs(id) {
  const box = $("#qs"); if (!box) return;
  const qs = [];
  for (const tier of [0, 1, 2]) { try { qs.push(Object.assign(CP.freeze(CP.build(id, tier), id, tier))); } catch (e) {} }
  let right = 0, answered = 0;
  box.innerHTML = qs.map((q, i) => '<div class="lq card" data-q="' + i + '"><p class="kicker muted">' + CP.TIERS[q.tier] + '</p><p class="task">' + q.task + '</p><p class="expr' + (q.prose ? " q" : "") + '">' + q.expr + '</p>' + opts(q) + '<div class="lfb"></div></div>').join("") + '<p class="lscore" hidden></p>';
  box.querySelectorAll(".lq").forEach(card => {
    const q = qs[+card.dataset.q];
    card.querySelectorAll(".opt").forEach(b => b.onclick = () => {
      const i = +b.dataset.i, o = q.options[i];
      card.querySelector(".opts").outerHTML = opts(q, i);
      answered++; if (o.ok) right++;
      card.querySelector(".lfb").innerHTML = '<span class="verdict ' + (o.ok ? "y" : "n") + '">' + (o.ok ? "Correct" : "Not quite") + '</span>' +
        (!o.ok && o.why ? '<div class="mistake"><span class="lbl">What went wrong</span>' + o.why + '</div>' : "") +
        '<p class="h4">How to get it</p><div class="walk">' + q.walk.map(w => '<div class="w">' + w + '</div>').join("") + '</div>';
      if (CP.graph) CP.graph.hydrate(card);
      if (answered === qs.length) {
        CP.markCheck(id, right);
        const sc = box.querySelector(".lscore"); sc.hidden = false;
        sc.innerHTML = '<b>' + right + ' of ' + qs.length + '.</b> ' + (right === qs.length ? "That rule is yours. The daily lesson will keep it fresh." : right === 2 ? "Close. Read the mistake above, then try three new ones." : "Go back to the picture and the examples, then try three new ones.");
      }
    });
  });
  if (CP.graph) CP.graph.hydrate(box);
}
function opts(q, answered) {
  const done = answered != null;
  return '<div class="opts' + (q.prose ? " one" : "") + '">' + q.options.map((o, i) => {
    let cls = "opt" + (q.prose ? " prose" : "");
    if (done) cls += o.ok ? " right" : i === answered ? " wrong" : " faded";
    const mark = done && o.ok ? "✓" : done && i === answered ? "✗" : String.fromCharCode(65 + i);
    return '<button type="button" class="' + cls + '" data-i="' + i + '"' + (done ? " disabled" : "") + '><span class="ok">' + mark + '</span><span class="ov">' + o.html + '</span></button>';
  }).join("") + '</div>';
}

/* ---------------- top bar and routing ---------------- */
function paintTeach() { const t = $("#teach-on"); if (t) t.checked = teach; }
$("#teach-on").onchange = e => { teach = e.target.checked; try { localStorage.setItem("cp-teach", teach ? "1" : "0"); } catch (x) {} if (lastId) renderLesson(lastId, true); };
let lastId = null;
function route() {
  const [id, sec] = location.hash.replace(/^#/, "").split("/");
  if (!id) { lastId = null; renderIndex(); return; }
  if (id !== lastId || !sec) { lastId = id; renderLesson(id); window.scrollTo(0, 0); }
  if (sec) { const t = document.getElementById(sec); if (t) setTimeout(() => t.scrollIntoView({ block: "start" }), 30); }
}
window.addEventListener("hashchange", route);
paintTeach();
loadLive().then(route);
CP.lessonPage = { route };
})();
