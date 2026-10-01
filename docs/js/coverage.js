/* Chalk and Paper – the curriculum map
   The 51 MCV4U specific expectations, each tied to the steps that teach it.
   Rendered two ways: by the viewer's own progress (coverage.html), and by a shared person's progress (share.html).
   Needs content*.js and engine.js loaded first. */

window.CP = window.CP || {};
(function () {
const STRANDS = {
  A: { name: "Rate of change", groups: { A1: "Instantaneous rate of change at a point", A2: "The derivative function", A3: "Properties of derivatives" } },
  B: { name: "Derivatives and their applications", groups: { B1: "Graphs of functions and their derivatives", B2: "Problems using models and derivatives" } },
  C: { name: "Geometry and algebra of vectors", groups: { C1: "Representing vectors", C2: "Operating with vectors", C3: "Lines and planes as linear equations", C4: "Scalar, vector and parametric equations" } }
};
/* [code, how well the app covers it (c covered, p partly), what it asks, what the app does, steps that teach it] */
const EX = [
  ["A1.1", "p", "Real-world examples of rates of change", "Every question ends with a real example. Describing one in your own words is for paper.", ["slope", "firstp"]],
  ["A1.2", "c", "Average rate and secant; instantaneous rate and tangent", "Slope and Tangent steps.", ["slope", "tan"]],
  ["A1.3", "c", "Secants closing in on the tangent", "First principles, with the falling-phone secants.", ["firstp"]],
  ["A1.4", "c", "Limits by example: asymptotes, Fibonacci ratios", "Limits at infinity, holes, (bʰ − 1)/h and sequence ratios.", ["limits"]],
  ["A1.5", "c", "The difference quotient and its limit", "First principles, all tiers.", ["firstp"]],
  ["A1.6", "c", "Rates at a point, with and without simplifying first", "First principles: limit at a point, then simplified quotients.", ["firstp"]],
  ["A2.1", "c", "Where the rate is positive, negative or zero, from a graph", "'Where is f increasing?' read off drawn graphs.", ["graphs"]],
  ["A2.2", "c", "Building the derivative's graph from tangent slopes", "See f, pick the drawing of f′.", ["graphs"]],
  ["A2.3", "c", "Derivatives of polynomials by the limit definition", "First principles.", ["firstp"]],
  ["A2.4", "c", "The derivative of sin x and cos x, by graph", "Rules, plus drawn sine and cosine graphs.", ["trigexp", "graphs"]],
  ["A2.5", "p", "The derivative of aˣ, by graph", "The rule is drilled; exponential graphs are not drawn yet.", ["trigexp", "exprate"]],
  ["A2.6", "p", "Finding e as the base where f′ = f", "Explained in a why-question and notes, not investigated.", ["trigexp"]],
  ["A2.7", "c", "ln x as the inverse of eˣ", "Simplifying, solving e^(kt) = A, doubling time, carbon dating.", ["lnexp"]],
  ["A2.8", "c", "The derivative of aˣ is aˣ ln a", "Sine, cosine and eˣ; Growth rates.", ["trigexp", "exprate"]],
  ["A3.1", "c", "The power rule for whole-number powers", "Power rule step.", ["pow1"]],
  ["A3.2", "p", "Constant, multiple, sum and difference rules; reading their proofs", "Rules used throughout; proofs not practised.", ["polyd"]],
  ["A3.3", "c", "Polynomial derivatives; where a given rate happens", "Polynomials and Tangent, plus work-backwards questions.", ["polyd", "tan"]],
  ["A3.4", "c", "The power rule for fractional powers", "√x, x^(2/3), 1 ÷ √x and negative powers.", ["fracpow"]],
  ["A3.5", "c", "Product and chain rules on every kind of function", "Product, chain, combined, and rational and radical functions.", ["prod", "chain", "combo", "ratrad"]],
  ["B1.1", "c", "Sketching f′ from a graph of f", "Drawn options for f′.", ["graphs"]],
  ["B1.2", "c", "The second derivative as the rate of change of the rate", "Concavity, and picking the graph of f″.", ["concav", "sketch"]],
  ["B1.3", "p", "f″ of polynomial and simple rational functions", "Polynomials in full; f″ of rational functions not yet.", ["maxmin", "concav"]],
  ["B1.4", "c", "Features of f from information about f′ and f″", "Pick f from a graph of f′ or a sign chart.", ["sketch"]],
  ["B1.5", "c", "Sketching a polynomial from its equation", "Pick the graph of a cubic from its equation.", ["sketch"]],
  ["B2.1", "c", "Motion: position, velocity, acceleration", "Motion step and scenarios.", ["motion"]],
  ["B2.2", "c", "Derivatives in real settings: population, inflation, flow", "Growth rates step and scenarios.", ["exprate"]],
  ["B2.3", "c", "Instantaneous-rate problems from a given equation", "Daylight, outlet voltage, cooling coffee, balloons.", ["exprate", "trigexp"]],
  ["B2.4", "c", "Optimization with polynomial, rational and exponential models", "Optimization, plus rational models such as cheapest run size.", ["optim", "ratrad"]],
  ["B2.5", "p", "Modelling a real situation and communicating the result", "Scenarios model; written communication is for paper.", ["optim", "motion"]],
  ["C1.1", "c", "Vectors as magnitude and direction; real uses", "Vector basics and notes.", ["vbasic"]],
  ["C1.2", "c", "2D vectors with bearings like N 40° W", "Bearings step.", ["bearings"]],
  ["C1.3", "c", "Converting between bearings and coordinates with trig", "Components, bearings, crosswinds.", ["bearings"]],
  ["C1.4", "c", "3D points, distance and magnitude", "Vector basics.", ["vbasic"]],
  ["C2.1", "c", "Adding, subtracting and scaling vectors", "Vector basics.", ["vbasic"]],
  ["C2.2", "c", "Properties of vector addition and scaling", "Vector laws step.", ["triple"]],
  ["C2.3", "c", "Problems using vector addition", "Crosswind and portfolio-trade scenarios.", ["vbasic", "bearings"]],
  ["C2.4", "c", "The dot product and its uses", "Dot product and Angles.", ["dotp", "angle"]],
  ["C2.5", "c", "Properties of the dot product", "Vector laws, plus perpendicular means zero.", ["dotp", "triple"]],
  ["C2.6", "c", "The cross product and its magnitude", "Cross product.", ["crossp"]],
  ["C2.7", "c", "Properties of the cross product", "Order, distributing, not associative.", ["crossp", "triple"]],
  ["C2.8", "c", "Projections, area, volume, work, torque", "Angles, Cross product, Vector laws.", ["angle", "crossp", "triple"]],
  ["C3.1", "c", "Where two lines in 2D meet", "2D lines.", ["lines2d"]],
  ["C3.2", "c", "Planes; two planes meet in a line", "Planes meeting.", ["planesys"]],
  ["C3.3", "c", "Configurations of up to three lines and planes", "Line meets plane, planes meeting, skew lines.", ["lineplane", "planesys", "skew"]],
  ["C4.1", "c", "Lines in 2D: scalar, vector and parametric forms", "2D lines.", ["lines2d"]],
  ["C4.2", "c", "Lines in 3D: vector, parametric, and as two planes", "Lines, and the direction where two planes meet.", ["lines", "planeforms"]],
  ["C4.3", "c", "Normals to a plane", "Planes.", ["planes"]],
  ["C4.4", "c", "Scalar equation of a plane; three planes solved together", "Planes meeting, with three-fund and meal systems.", ["planes", "planesys"]],
  ["C4.5", "c", "A plane's scalar, vector and parametric equations", "Planes and Plane forms.", ["planes", "planeforms"]],
  ["C4.6", "c", "Converting a plane between forms", "Plane forms, both directions.", ["planeforms"]],
  ["C4.7", "c", "Distances and intersections of lines and planes", "Distance, line meets plane, skew lines.", ["dist", "lineplane", "skew"]]
];
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const id = c => "x-" + c.replace(".", "-");
const P_LAB = { m: "Mastered", w: "In progress", n: "Not started" }, A_LAB = { c: "Covered by the app", p: "Partly covered by the app" };

/* one expectation, from the viewer's (or shared person's) record */
function personal(e) {
  const S = CP.state(), steps = e[4].map(sid => {
    const st = CP.stepById(sid), raw = (S.steps || {})[sid];
    const ss = raw ? CP.stepState(sid) : null;
    return { st, mastered: !!(ss && ss.mastered), tier: ss ? ss.tier : 0, attempts: ss ? ss.attempts : 0, acc: ss && ss.attempts ? ss.correct / ss.attempts : null };
  });
  const status = steps.every(x => x.mastered) ? "m" : steps.some(x => x.mastered || x.attempts > 0) ? "w" : "n";
  return { status, steps };
}
function summary() {
  const rows = EX.map(e => ({ e, p: personal(e) }));
  const n = k => rows.filter(r => r.p.status === k).length;
  return { rows, m: n("m"), w: n("w"), n: n("n"), any: rows.some(r => r.p.status !== "n") };
}
/* the 51-square strip; mode "me" colours by progress, "app" by what the app covers */
function stripHtml(rows, mode, links) {
  return Object.keys(STRANDS).map(s => {
    const groups = Object.keys(STRANDS[s].groups);
    const cells = groups.map(g => rows.filter(r => r.e[0].startsWith(g + ".")).map(r => {
      const k = mode === "app" ? "a" + r.e[1] : r.p.status, t = r.e[0] + " · " + (mode === "app" ? A_LAB[r.e[1]] : P_LAB[r.p.status]) + " · " + r.e[2];
      const part = mode === "me" && r.e[1] === "p" ? " part" : "";
      return links ? '<a class="cov-cell ' + k + part + '" href="#' + id(r.e[0]) + '" title="' + esc(t) + '" aria-label="' + esc(t) + '">' + r.e[0].slice(1) + '</a>'
                   : '<span class="cov-cell ' + k + part + '" title="' + esc(t) + '">' + r.e[0].slice(1) + '</span>';
    }).join("")).join('<span class="cov-gap"></span>');
    return '<div class="cov-srow"><span class="cov-lab">' + s + '</span><div class="cov-cells">' + cells + '</div></div>';
  }).join("");
}
const LEGEND = {
  me: '<div class="cov-legend"><span><i class="m"></i>Mastered</span><span><i class="w"></i>In progress</span><span><i class="n"></i>Not started</span><span><i class="n part"></i>App covers part</span></div>',
  app: '<div class="cov-legend"><span><i class="ac"></i>Covered by the app</span><span><i class="ap"></i>Partly covered</span></div>'
};

/* compact block for the share page */
function compact(el) {
  const s = summary();
  el.innerHTML = '<div class="row"><p class="kicker">Against the Ontario curriculum</p><span class="mono">' + s.m + ' of 51 mastered</span></div>' +
    '<p class="small" style="margin-bottom:10px">' + s.m + ' expectations mastered, ' + s.w + ' in progress, ' + s.n + ' not started. Each square is one MCV4U specific expectation.</p>' +
    '<div class="cov-strip">' + stripHtml(s.rows, "me", false) + '</div>' + LEGEND.me;
}

/* the full page */
function page(el, opts) {
  opts = opts || {};
  let mode = "me", filter = "all";
  try { mode = localStorage.getItem("cp-cov-mode") || "me"; filter = localStorage.getItem("cp-cov-filter") || "all"; } catch (e) {}
  function draw() {
    const s = summary(), name = (CP.state().profile || {}).name;
    if (mode === "app" && !["all", "ap"].includes(filter)) filter = "all";
    if (mode === "me" && filter === "ap") filter = "all";
    const tots = mode === "me"
      ? [["m", s.m, "mastered"], ["w", s.w, "in progress"], ["n", s.n, "not started"]]
      : [["ac", EX.filter(e => e[1] === "c").length, "covered by the app"], ["ap", EX.filter(e => e[1] === "p").length, "partly covered"], ["n", 0, "not covered"]];
    const chips = mode === "me" ? [["all", "All 51"], ["n", "Not started"], ["w", "In progress"], ["m", "Mastered"]] : [["all", "All 51"], ["ap", "Partly covered"]];
    let h = '<div class="chips cov-mode" role="tablist"><button type="button" class="chip" data-mode="me" aria-pressed="' + (mode === "me") + '">' + (name ? esc(name) + "’s progress" : "My progress") + '</button><button type="button" class="chip" data-mode="app" aria-pressed="' + (mode === "app") + '">What the app covers</button></div>';
    if (mode === "me" && !s.any) h += '<section class="card tip"><p class="prose" style="color:var(--ink)">Nothing practised on this device yet. Do a lesson, or sign in on the <a href="./#me">Me</a> screen to bring your progress here.</p></section>';
    h += '<div class="cov-tots">' + tots.map(([k, n, w]) => '<div class="cov-tot ' + k + '"><span class="n">' + n + '</span><span class="k">of 51 ' + w + '</span></div>').join("") + '</div>';
    h += '<section class="card"><div class="cov-strip">' + stripHtml(s.rows, mode, true) + '</div>' + LEGEND[mode] + '</section>';
    h += '<div class="chips">' + chips.map(([k, w]) => '<button type="button" class="chip" data-f="' + k + '" aria-pressed="' + (filter === k) + '">' + w + '</button>').join("") + '</div>';
    for (const st of Object.keys(STRANDS)) {
      const mine = s.rows.filter(r => r.e[0][0] === st), cnt = k => mine.filter(r => r.p.status === k).length;
      h += '<section class="cov-strand"><div class="row"><h2>' + st + '. ' + STRANDS[st].name + '</h2><span class="mono">' + (mode === "me" ? cnt("m") + " of " + mine.length + " mastered" : mine.filter(r => r.e[1] === "c").length + " of " + mine.length + " covered") + '</span></div>';
      for (const g of Object.keys(STRANDS[st].groups)) {
        const rows = mine.filter(r => r.e[0].startsWith(g + ".")).filter(r => filter === "all" || (mode === "me" ? r.p.status === filter : r.e[1] === "p"));
        if (!rows.length) continue;
        h += '<p class="cov-group">' + g + ' · ' + STRANDS[st].groups[g] + '</p>';
        h += rows.map(r => {
          const steps = r.p.steps.map(x => {
            const cls = x.mastered ? "done" : x.attempts ? "cur" : "", lab = esc(x.st.short) + (x.attempts ? " · " + CP.TIERS[x.tier].toLowerCase() : "");
            return opts.links === false ? '<span class="uchip ' + cls + '">' + lab + '</span>' : '<a class="uchip ' + cls + '" href="./#practice/' + x.st.id + '">' + lab + '</a>';
          }).join("");
          const pill = mode === "me" ? '<span class="cov-pill ' + r.p.status + '">' + P_LAB[r.p.status] + '</span>' : '<span class="cov-pill a' + r.e[1] + '">' + A_LAB[r.e[1]] + '</span>';
          return '<div class="cov-ex" id="' + id(r.e[0]) + '"><span class="code">' + r.e[0] + '</span><div class="body"><span class="what">' + esc(r.e[2]) + '</span>' + pill +
            '<div class="uchips">' + steps + '</div><span class="note">' + (r.e[1] === "p" ? "The app covers part of this. " : "") + esc(r.e[3]) + '</span></div></div>';
        }).join("");
      }
      h += '</section>';
    }
    el.innerHTML = h;
    el.querySelectorAll("[data-mode]").forEach(b => b.onclick = () => { mode = b.dataset.mode; try { localStorage.setItem("cp-cov-mode", mode); } catch (e) {} draw(); });
    el.querySelectorAll("[data-f]").forEach(b => b.onclick = () => { filter = b.dataset.f; try { localStorage.setItem("cp-cov-filter", filter); } catch (e) {} draw(); });
    el.querySelectorAll(".cov-cell[href]").forEach(a => a.onclick = ev => {
      ev.preventDefault();
      let t = document.getElementById(a.getAttribute("href").slice(1));
      if (!t) { filter = "all"; draw(); t = document.getElementById(a.getAttribute("href").slice(1)); }
      if (!t) return;
      t.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
      t.classList.remove("flash"); void t.offsetWidth; t.classList.add("flash");
    });
  }
  draw();
}
CP.coverage = { EX, summary, personal, page, compact };
})();
