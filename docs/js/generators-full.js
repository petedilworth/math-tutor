/* Chalk and Paper – problem generators, part four
   Every kind of question for the twelve steps in content-full.js: forward (tiers 0–2), spot the error,
   work backwards, and real situations. Graph questions store a spec, drawn by graphs.js.
   Loaded after generators-modes.js. Checked by tools/verify.js. */

window.CP = window.CP || {};
(function () {
const { M, neg, ri, nz, pick, shuffle, gcd, sup, xp, poly, evalT, grp, frac, vec, dot, cross, sub, add, isZero, parallel, rv, m_, lin, eqn, pythVec, redV, len, rat, mkSpot, ask } = CP.h;
const Gr = CP.graph;
const numd = (f, x, h = 1e-6) => (f(x + h) - f(x - h)) / (2 * h);
const f3 = x => neg(+x.toFixed(3));
const fN = (x, d = 2) => neg(Number(x).toLocaleString("en-CA", { minimumFractionDigits: d, maximumFractionDigits: d }));
const money = (x, d = 2) => (x < 0 ? M : "") + "$" + Math.abs(x).toLocaleString("en-CA", { minimumFractionDigits: d, maximumFractionDigits: d });
const opt = (html, n, why) => ({ html, n, why });
const deg = r => r * 180 / Math.PI, rad = d => d * Math.PI / 180;
/* x to a rational power, and a coefficient times it */
const xpow = e => e === 0 ? "" : e === 1 ? "x" : "x<sup>" + rat(e) + "</sup>";
const mono = (c, e) => (e !== 0 && c === 1 ? "" : e !== 0 && c === -1 ? M : rat(c)) + xpow(e);
const pt = P => "(" + P.map(rat).join(", ") + ")";
const L2 = (A, B, C) => lin([{ c: A, s: "x" }, { c: B, s: "y" }, { c: C, s: "" }]) + " = 0";

/* ======================= LIMITS ======================= */
CP.G.limits = function (tier) {
  if (tier === 0) {
    const a = nz(-9, 9), c = ri(1, 6), b = nz(-9, 9), d = nz(-9, 9), f = x => (a * x + b) / (c * x + d), L = frac(a, c);
    const W = [[frac(b, d), "The constants only matter near x = 0. As x grows, the x terms swamp them."], [{ html: "0", val: 0 }, "Top and bottom both grow without limit. Their ratio settles at " + L.html + "."],
               [c + d !== 0 ? frac(a + b, c + d) : null, "That is the value at x = 1. The limit is about x growing without end."], [frac(c, a), "Upside down: it is the top's x coefficient over the bottom's."]];
    return { task: "Find the limit as x grows without bound.", expr: "lim<sub>x→∞</sub> " + grp([{ c: a, p: 1 }, { c: b, p: 0 }]) + " ÷ " + grp([{ c, p: 1 }, { c: d, p: 0 }]),
      correct: opt(L.html, L.val), truthN: f(1e10),
      wrong: W.filter(w => w[0] && isFinite(w[0].val)).map(w => opt(w[0].html, w[0].val, w[1])),
      walk: ["Divide top and bottom by x: (" + neg(a) + " + " + neg(b) + "/x) ÷ (" + c + " + " + neg(d) + "/x).", "As x grows, " + neg(b) + "/x and " + neg(d) + "/x shrink to 0.", "The limit is " + neg(a) + " ÷ " + c + " = " + m_(L.html) + "."] };
  }
  if (tier === 1) {
    let r, s; do { r = nz(-5, 5); s = nz(-6, 6); } while (r === s);
    const N = [{ c: 1, p: 2 }, { c: -(r + s), p: 1 }, { c: r * s, p: 0 }], f = x => evalT(N, x) / (x - r);
    return { task: "Find the limit.", expr: "lim<sub>x→" + neg(r) + "</sub> " + grp(N) + " ÷ " + grp([{ c: 1, p: 1 }, { c: -r, p: 0 }]),
      correct: opt(neg(r - s), r - s), truthN: (f(r + 1e-6) + f(r - 1e-6)) / 2,
      wrong: [opt("0", 0, "Putting x = " + neg(r) + " in gives 0 ÷ 0. That means factor and cancel, not that the answer is 0."),
              opt("Does not exist", NaN, "f has a hole at x = " + neg(r) + ", but the values on both sides close in on " + neg(r - s) + ". The limit exists even though f(" + neg(r) + ") does not."),
              opt(neg(s - r), s - r, "Sign slip. After cancelling, f(x) = x " + (s < 0 ? "+ " + (-s) : M + " " + s) + ", and at x = " + neg(r) + " that is " + neg(r - s) + "."),
              opt(neg(r + s), r + s, "Factor first: the top is (x " + (r < 0 ? "+ " + (-r) : M + " " + r) + ")(x " + (s < 0 ? "+ " + (-s) : M + " " + s) + ").")],
      walk: ["The top factors: " + grp([{ c: 1, p: 1 }, { c: -r, p: 0 }]) + grp([{ c: 1, p: 1 }, { c: -s, p: 0 }]) + ".", "Cancel the common factor. For x ≠ " + neg(r) + ", f(x) = " + poly([{ c: 1, p: 1 }, { c: -s, p: 0 }]) + ".", "Now put in x = " + neg(r) + ": " + m_(neg(r - s)) + "."] };
  }
  if (Math.random() < 0.5) {
    const b = pick([2, 3, 5, 10]), h = 1e-6;
    return { task: "Find the limit. It is the slope of " + b + "ˣ at x = 0.", expr: "lim<sub>h→0</sub> (" + b + "<sup>h</sup> − 1) ÷ h",
      correct: opt("≈ " + Math.log(b).toFixed(3), Math.log(b)), truthN: (Math.pow(b, h) - Math.pow(b, -h)) / (2 * h),
      wrong: [opt(String(b - 1), b - 1, "That uses h = 1. Let h shrink toward 0."), opt("1", 1, "Only for base e is this limit exactly 1. For base " + b + " it is ln " + b + "."),
              opt("≈ " + Math.log10(b).toFixed(3), Math.log10(b), "That is log base 10 of " + b + ". The limit is the natural log, ln " + b + "."), opt("0", 0, "Top and bottom both shrink to 0. Their ratio does not.")],
      walk: ["Try small h: h = 0.001 gives about " + ((Math.pow(b, 0.001) - 1) / 0.001).toFixed(4) + ".", "The values close in on ln " + b + " ≈ " + m_(Math.log(b).toFixed(3)) + ".", "This is why the derivative of " + b + "ˣ is " + b + "ˣ · ln " + b + "."] };
  }
  const k = pick([1, 2, 6, 12]), L = (1 + Math.sqrt(1 + 4 * k)) / 2;
  let a = 1, b = 1; for (let i = 0; i < 80; i++) { const c = b + k * a; a = b; b = c; }
  const show = x => Number.isInteger(x) ? String(x) : "≈ " + x.toFixed(3);
  return { task: "Each term is the previous term plus " + (k === 1 ? "" : k + " times ") + "the one before: 1, 1, " + (1 + k) + ", " + (1 + k + k) + ", … What does the ratio of one term to the one before close in on?", expr: "a<sub>n+1</sub> = a<sub>n</sub> + " + (k === 1 ? "" : k) + "a<sub>n−1</sub>",
    correct: opt(show(L), L), truthN: b / a, prose: false,
    wrong: [opt(show(k + 1), k + 1, "That is the ratio of the third term to the second, early on. Later ratios settle somewhere else."),
            opt(show(1 + k / 2), 1 + k / 2, "Find r with r² = r + " + k + ": the ratio that repeats forever. Its positive root is " + show(L) + "."),
            opt(show(k), k, "Find r with r² = r + " + k + ". Its positive root is " + show(L) + ", not " + k + "."), opt(show(2 * k + 1), 2 * k + 1, "Ratios of later terms settle down; they don't keep growing.")],
    walk: ["If the ratio settles at r, then a<sub>n+1</sub> ≈ r·a<sub>n</sub> and a<sub>n</sub> ≈ r·a<sub>n−1</sub>.", "Dividing the rule by a<sub>n−1</sub>: r² = r + " + k + ".", "The positive root is " + m_(show(L)) + (k === 1 ? ", the golden ratio." : ".")] };
};
CP.SPOT.limits = function () {
  let r, s; do { r = nz(-5, 5); s = nz(-6, 6); } while (r === s || r + s === 0);
  const N = [{ c: 1, p: 2 }, { c: -(r + s), p: 1 }, { c: r * s, p: 0 }], br = v => grp([{ c: 1, p: 1 }, { c: -v, p: 0 }]);
  return mkSpot(ask, "lim<sub>x→" + neg(r) + "</sub> " + grp(N) + " ÷ " + br(r), bad => {
    const L = [], s2 = bad === 0 ? -s : s;
    L.push({ html: "Factor the top: " + br(r) + br(s2), t: x => evalT(N, x), v: x => (x - r) * (x - s2), err: "Check by expanding: " + br(r) + br(s) + " gives " + poly(N) + "." });
    const keep = bad === 1 ? r : s2;
    L.push({ html: "Cancel: f(x) = " + poly([{ c: 1, p: 1 }, { c: -keep, p: 0 }]) + " for x ≠ " + neg(r), t: x => x - s2, v: x => x - keep, err: "Cancel the factor that matches the bottom, " + br(r) + ". What is left is " + br(s2) + "." });
    const val = bad === 2 ? 0 : r - keep;
    L.push({ html: "Put in x = " + neg(r) + ": the limit is " + neg(val), t: r - keep, v: val, err: "After cancelling there is no 0 ÷ 0 any more. Put x = " + neg(r) + " into " + poly([{ c: 1, p: 1 }, { c: -keep, p: 0 }]) + "." });
    return L;
  });
};
CP.REV.limits = function () {
  const c = ri(2, 5), Lm = nz(-4, 4), a = Lm * c, b = nz(-6, 6), d = nz(-6, 6);
  return { task: "What value of a makes this limit true?", expr: "lim<sub>x→∞</sub> (ax " + (b < 0 ? M + " " + (-b) : "+ " + b) + ") ÷ (" + c + "x " + (d < 0 ? M + " " + (-d) : "+ " + d) + ") = " + neg(Lm), cond: t => t / c === Lm,
    correct: { html: "a = " + neg(a), test: a }, wrong: [Lm, Lm + c, a + b, -a, c].map(t => ({ html: "a = " + neg(t), test: t })),
    whyOf: t => "Then the limit is " + neg(t) + " ÷ " + c + " = " + rat(t / c) + ", not " + neg(Lm) + ".",
    walk: ["As x grows, only the x terms matter: the limit is a ÷ " + c + ".", "a ÷ " + c + " = " + neg(Lm) + ", so a = " + neg(a) + "."] };
};
CP.CTX.limits = [
  function avgcost() {
    const F = pick([3000, 6000, 9000, 12000]), v = pick([4, 7, 12, 18]), f = q => (F + v * q) / q;
    return { k: "Finance", sid: "avgcost", task: "A studio pays " + money(F, 0) + " a month in fixed costs and " + money(v, 0) + " per print. As it sells more and more prints, what does the average cost per print close in on?", expr: "A(q) = (" + F + " + " + v + "q) ÷ q",
      correct: opt(money(v, 0), v), truthN: f(1e10),
      wrong: [opt(money(F + v, 0), F + v, "That is the cost of the very first print, A(1)."), opt(money(F / 1000 + v, 0), F / 1000 + v, "That is A(1000). Keep going: the fixed part keeps shrinking."),
              opt(money(0, 0), 0, "The fixed cost per print shrinks to 0, but each print still costs " + money(v, 0) + " to make.")],
      walk: ["A(q) = " + F + "/q + " + v + ".", "As q grows, " + F + "/q shrinks toward 0.", "The limit is " + m_(money(v, 0)) + " per print."] };
  },
  function drug() {
    const A = pick([20, 40, 60, 80]), k = pick([2, 4, 6]), f = t => A * t / (t + k);
    return { k: "Health", sid: "drug", task: "With a steady IV drip, a drug's level is C(t) = " + A + "t ÷ (t + " + k + ") mg/L after t hours. What level does it settle at?", expr: "lim<sub>t→∞</sub> " + A + "t ÷ (t + " + k + ")",
      correct: opt(A + " mg/L", A), truthN: f(1e10),
      wrong: [opt((A / 2) + " mg/L", A / 2, "That is the level at t = " + k + " hours, halfway there."), opt((A / k) + " mg/L", A / k, "Divide top and bottom by t: " + A + " ÷ (1 + " + k + "/t), which closes in on " + A + "."),
              opt("0 mg/L", 0, "With a steady drip the level climbs and levels off. It does not fade to 0 in this model.")],
      walk: ["Divide top and bottom by t: " + A + " ÷ (1 + " + k + "/t).", "As t grows, " + k + "/t → 0.", "The level settles at " + m_(A + " mg/L") + "."] };
  },
  function skydiver() {
    const V = pick([50, 55, 60]), k = pick([5, 6, 8]), f = t => V * t / (t + k);
    return { k: "Sport", sid: "skydive", task: "A skydiver's speed is modelled as v(t) = " + V + "t ÷ (t + " + k + ") m/s. What is her top speed, the terminal velocity?", expr: "lim<sub>t→∞</sub> v(t)",
      correct: opt(V + " m/s", V), truthN: f(1e10),
      wrong: [opt((V / 2) + " m/s", V / 2, "That is her speed at t = " + k + " s, halfway to the limit."), opt(fN(V * 10 / (10 + k), 1) + " m/s", V * 10 / (10 + k), "That is v(10). The limit is where the speed settles."),
              opt("No limit", NaN, "Air resistance caps the speed. Divide top and bottom by t to see it.")],
      walk: ["v(t) = " + V + " ÷ (1 + " + k + "/t).", "As t grows, the bottom closes in on 1.", "Terminal velocity: " + m_(V + " m/s") + ", about " + Math.round(V * 3.6) + " km/h."] };
  }
];

/* ======================= ROOTS AND NEGATIVE POWERS ======================= */
const FR = [[1, 2], [1, 3], [2, 3], [3, 2], [5, 2], [3, 4], [1, 4], [4, 3]];
function powerProblem(c, e, p, q) {
  const d = c * e, e1 = e - 1, top = p && q && q > 1 ? (p - 1) / q : null;
  return {
    correct: { html: mono(d, e1), f: x => d * Math.pow(x, e1) },
    wrong: [{ html: mono(d, e), f: x => d * Math.pow(x, e), why: "You multiplied by the power but did not lower it by one." },
            { html: mono(c, e1), f: x => c * Math.pow(x, e1), why: "You lowered the power but did not multiply by it first." },
            { html: mono(d, e + 1), f: x => d * Math.pow(x, e + 1), why: "The power goes down by one: " + rat(e) + " − 1 = " + rat(e1) + "." },
            top === null ? null : { html: mono(d, top), f: x => d * Math.pow(x, top), why: "Subtract a whole 1 from the power: " + rat(e) + " − 1 = " + rat(e1) + ". Taking 1 off the top of the fraction gives " + rat(top) + " instead." }].filter(Boolean)
  };
}
CP.G.fracpow = function (tier) {
  let c, e, shown, fp = null, fq = null;
  if (tier === 0) { c = pick([2, 4, 6, 8, 10]); e = 1 / 2; fp = 1; fq = 2; shown = (c === 1 ? "" : c) + "√x"; }
  else if (tier === 1) { const [p, q] = pick(FR); c = q * nz(1, 3); e = p / q; fp = p; fq = q; shown = mono(c, e); }
  else {
    const k = pick(["neg", "neg", "root"]);
    if (k === "neg") { const n = ri(1, 4); c = nz(-6, 6); e = -n; shown = neg(c) + " ÷ " + xp(n); }
    else { const [p, q] = pick([[1, 2], [1, 3], [2, 3]]); c = 2 * q * nz(1, 2); e = -p / q; shown = neg(c) + " ÷ " + (q === 2 ? "√x" : p === 1 ? "∛x" : "∛(x²)"); }
  }
  const P = powerProblem(c, e, fp, fq);
  return { task: "Find the derivative.", expr: "f(x) = " + shown, src: x => c * Math.pow(x, e), posOnly: true,
    correct: P.correct, wrong: P.wrong,
    walk: ["Rewrite as a power: f(x) = " + mono(c, e) + ".", "Multiply by the power, " + rat(e) + ": " + rat(c) + " × " + rat(e) + " = " + rat(c * e) + ".", "Lower the power by one: " + rat(e) + " − 1 = " + rat(e - 1) + ". f′(x) = " + m_(mono(c * e, e - 1)) + "."] };
};
CP.SPOT.fracpow = function () {
  const c = 2 * nz(1, 4), q = pick([2, 2, 3]), x0 = q === 2 ? 4 : 8;
  return mkSpot(ask, "f(x) = " + neg(c) + " ÷ " + (q === 2 ? "√x" : "∛x") + ". Find f′(" + x0 + ").", bad => {
    const L = [], e0 = bad === 0 ? 1 / q : -1 / q;
    L.push({ html: "f(x) = " + mono(c, e0), t: x => c * Math.pow(x, -1 / q), v: x => c * Math.pow(x, e0), err: "A root on the bottom is a negative power: 1 ÷ " + (q === 2 ? "√x" : "∛x") + " = x<sup>" + M + "1/" + q + "</sup>." });
    const d = c * e0, e1 = bad === 1 ? e0 + 1 : e0 - 1;
    L.push({ html: "f′(x) = " + mono(d, e1), t: x => d * Math.pow(x, e0 - 1), v: x => d * Math.pow(x, e1), err: "Lower the power by one: " + rat(e0) + " − 1 = " + rat(e0 - 1) + "." });
    const tv = d * Math.pow(x0, e1), vv = bad === 2 ? d * Math.pow(x0, -e1) : tv;
    L.push({ html: "f′(" + x0 + ") = " + rat(d) + " × " + x0 + "<sup>" + rat(e1) + "</sup> = " + rat(vv), t: tv, v: vv, err: x0 + "<sup>" + rat(e1) + "</sup> = " + rat(Math.pow(x0, e1)) + ". A negative power means one over." });
    return L;
  });
};
CP.REV.fracpow = function () {
  const [p, q] = pick(FR), e = p / q, c = q * nz(1, 3), K = c * e;
  const opt2 = (cc, ee) => ({ html: "f(x) = " + mono(cc, ee), test: [cc, ee] });
  return { task: "Which function has this derivative?", expr: "f′(x) = " + mono(K, e - 1), posOnly: true, cond: T => Math.abs(T[0] * T[1] - K) < 1e-9 && Math.abs(T[1] - e) < 1e-9,
    correct: opt2(c, e), wrong: [opt2(K, e), opt2(K, e - 1), opt2(c * e * e, e), opt2(c, e - 1), opt2(K / (e + 1), e + 1)],
    whyOf: T => "Differentiate it and you get " + mono(T[0] * T[1], T[1] - 1) + ".",
    walk: ["Undo the power rule: raise the power by one, from " + rat(e - 1) + " to " + rat(e) + ".", "Divide by the new power: " + rat(K) + " ÷ " + rat(e) + " = " + rat(c) + ".", "f(x) = " + m_(mono(c, e)) + ", plus any constant."] };
};
CP.CTX.fracpow = [
  function risk() {
    const s = pick([10, 12, 15, 16, 20]), n = pick([1, 4, 9, 16, 25]), ans = s / (2 * Math.sqrt(n));
    return { k: "Finance", sid: "risk", task: "A stock fund's typical yearly swing is " + s + "%. Over n years the typical range grows like " + s + "√n percentage points. At n = " + n + " years, how fast does the range widen per extra year?", expr: "R(n) = " + s + "n<sup>1/2</sup>",
      correct: opt(fN(ans, 2) + " points a year", ans), truthN: numd(x => s * Math.sqrt(x), n), posOnly: true,
      wrong: [opt(fN(s * Math.sqrt(n), 2) + " points a year", s * Math.sqrt(n), "That is the range itself, R(" + n + "). The rate is R′(" + n + ")."),
              opt(fN(s / Math.sqrt(n), 2) + " points a year", s / Math.sqrt(n), "You forgot the ½ from the power rule: R′ = " + s + " ÷ (2√n)."),
              opt(fN(s / (2 * n), 2) + " points a year", s / (2 * n), "Divide by 2√n, not 2n.")],
      walk: ["R′(n) = " + s + " × ½n<sup>−1/2</sup> = " + s + " ÷ (2√n).", "At n = " + n + ": " + s + " ÷ " + (2 * Math.sqrt(n)) + " = " + m_(fN(ans, 2)) + " points a year.", "Risk grows with time, but more slowly each year: the square-root rule behind long-term investing."] };
  },
  function pendulum() {
    const L0 = pick([0.25, 1, 4, 9]), ans = 1 / Math.sqrt(L0);
    return { k: "Science", sid: "pendulum", task: "A pendulum's period is about T = 2√L seconds for a length of L metres. At L = " + L0 + " m, how many extra seconds does each extra metre add?", expr: "T(L) = 2L<sup>1/2</sup>",
      correct: opt(fN(ans, 2) + " s per m", ans), truthN: numd(x => 2 * Math.sqrt(x), L0), posOnly: true,
      wrong: [opt(fN(2 * Math.sqrt(L0), 2) + " s per m", 2 * Math.sqrt(L0), "That is the period itself, T(" + L0 + ")."),
              opt(fN(2 / Math.sqrt(L0), 2) + " s per m", 2 / Math.sqrt(L0), "The ½ from the power rule cancels the 2: T′ = 1 ÷ √L."),
              opt(fN(1 / L0, 2) + " s per m", 1 / L0, "Divide by √L, not L.")],
      walk: ["T′(L) = 2 × ½L<sup>−1/2</sup> = 1 ÷ √L.", "At L = " + L0 + ": 1 ÷ " + Math.sqrt(L0) + " = " + m_(fN(ans, 2)) + " s per metre."] };
  },
  function kleiber() {
    const m = pick([16, 81, 256]), ans = 70 * 0.75 * Math.pow(m, -0.25);
    return { k: "Nature", sid: "kleiber", task: "An animal's energy use is about E = 70m<sup>3/4</sup> kcal a day for a mass of m kg. At m = " + m + " kg, how much more energy does each extra kilogram need?", expr: "E(m) = 70m<sup>3/4</sup>",
      correct: opt(fN(ans, 2) + " kcal", ans), truthN: numd(x => 70 * Math.pow(x, 0.75), m), posOnly: true,
      wrong: [opt(fN(70 * Math.pow(m, 0.75), 2) + " kcal", 70 * Math.pow(m, 0.75), "That is the total energy, E(" + m + ")."),
              opt(fN(52.5 * Math.pow(m, 0.75), 2) + " kcal", 52.5 * Math.pow(m, 0.75), "Lower the power by one: 3/4 − 1 = −1/4."),
              opt(fN(70 * Math.pow(m, -0.25), 2) + " kcal", 70 * Math.pow(m, -0.25), "Multiply by the power, 3/4, as well as lowering it.")],
      walk: ["E′(m) = 70 × ¾m<sup>−1/4</sup> = 52.5 ÷ m<sup>1/4</sup>.", "The 4th root of " + m + " is " + Math.pow(m, 0.25) + ".", "52.5 ÷ " + Math.pow(m, 0.25) + " = " + m_(fN(ans, 2) + " kcal") + " per extra kg. Bigger animals need less per kilogram."] };
  }
];

/* ======================= RATIONAL AND RADICAL ======================= */
CP.G.ratrad = function (tier) {
  if (tier === 0) {
    const a = ri(2, 9), b = ri(1, 4), B = "(x + " + b + ")";
    return { task: "Find the derivative.", expr: "f(x) = " + a + " ÷ " + B, src: x => a / (x + b), posOnly: true,
      correct: { html: M + a + " ÷ " + B + "²", f: x => -a / Math.pow(x + b, 2) },
      wrong: [{ html: a + " ÷ " + B + "²", f: x => a / Math.pow(x + b, 2), why: "Missing the minus. The power −1 comes down in front." },
              { html: M + a + " ÷ " + B, f: x => -a / (x + b), why: "Lower the power from −1 to −2: the bracket becomes squared on the bottom." },
              { html: M + "1 ÷ " + B + "²", f: x => -1 / Math.pow(x + b, 2), why: "The " + a + " in front stays." },
              { html: a + " ÷ " + B + "<sup>0</sup>", f: () => a, why: "Lowering −1 by one gives −2, not 0." }],
      walk: ["Rewrite: f(x) = " + a + B + "<sup>−1</sup>.", "Power rule with the chain rule: " + a + " × (−1)" + B + "<sup>−2</sup> × 1.", "f′(x) = " + m_(M + a + " ÷ " + B + "²") + "."] };
  }
  if (tier === 1) {
    const a = ri(1, 4), b = ri(1, 9), I = poly([{ c: a, p: 2 }, { c: b, p: 0 }]), r = x => Math.sqrt(a * x * x + b);
    return { task: "Find the derivative.", expr: "f(x) = √(" + I + ")", src: r, posOnly: true,
      correct: { html: (a === 1 ? "" : a) + "x ÷ √(" + I + ")", f: x => a * x / r(x) },
      wrong: [{ html: "1 ÷ (2√(" + I + "))", f: x => 1 / (2 * r(x)), why: "You forgot the chain rule: multiply by the inside's derivative, " + (2 * a) + "x." },
              { html: (2 * a) + "x ÷ √(" + I + ")", f: x => 2 * a * x / r(x), why: "The ½ from the power rule halves the " + (2 * a) + "x." },
              { html: (a === 1 ? "" : a) + "x√(" + I + ")", f: x => a * x * r(x), why: "Lower the power from ½ to −½: the root moves to the bottom." }],
      walk: ["Rewrite: f(x) = (" + I + ")<sup>1/2</sup>.", "Outside: ½(" + I + ")<sup>−1/2</sup>. Inside: " + (2 * a) + "x.", "Multiply: f′(x) = " + m_((a === 1 ? "" : a) + "x ÷ √(" + I + ")") + "."] };
  }
  const a = ri(1, 6), b = ri(1, 3), x0 = b + ri(1, 3), f = x => (x * x + a) / (x - b);
  const u = x0 * x0 + a, v = x0 - b, ans = (2 * x0 * v - u) / (v * v);
  return { task: "Find f′(" + x0 + ").", expr: "f(x) = (x² + " + a + ") ÷ (x − " + b + ")", src: f, posOnly: true,
    correct: opt(rat(ans), ans), truthN: numd(f, x0),
    wrong: [opt(rat(2 * x0 / v), 2 * x0 / v, "Only u′v. Write it as (x² + " + a + ")(x − " + b + ")<sup>−1</sup>; the second factor has a derivative too."),
            opt(rat((2 * x0 * v + u) / (v * v)), (2 * x0 * v + u) / (v * v), "Sign slip: the derivative of (x − " + b + ")<sup>−1</sup> is −(x − " + b + ")<sup>−2</sup>."),
            opt(rat(2 * x0), 2 * x0, "You divided the derivatives: 2x ÷ 1. A quotient is not differentiated piece by piece.")],
    walk: ["f(x) = (x² + " + a + ")(x − " + b + ")<sup>−1</sup>.", "f′(x) = 2x(x − " + b + ")<sup>−1</sup> − (x² + " + a + ")(x − " + b + ")<sup>−2</sup>.", "At x = " + x0 + ": " + rat(2 * x0) + " ÷ " + v + " − " + u + " ÷ " + (v * v) + " = " + m_(rat(ans)) + "."] };
};
CP.SPOT.ratrad = function () {
  const a = ri(1, 6), b = ri(1, 3), x0 = b + ri(1, 3), B = "(x − " + b + ")";
  return mkSpot(ask, "f(x) = (x² + " + a + ") ÷ " + B + ". Find f′(" + x0 + ").", bad => {
    const L = [], inv = bad !== 0;
    const V = inv ? x => 1 / (x - b) : x => x - b, dV = inv ? x => -1 / Math.pow(x - b, 2) : () => 1;
    L.push({ html: "f(x) = (x² + " + a + ")" + B + (inv ? "<sup>−1</sup>" : ""), t: x => (x * x + a) / (x - b), v: x => (x * x + a) * V(x), err: "Dividing by " + B + " means multiplying by " + B + "<sup>−1</sup>." });
    const A1 = bad === 1 ? x => 2 * x : x => 2 * x * V(x);
    L.push({ html: "u′v = 2x" + (bad === 1 ? "" : B + (inv ? "<sup>−1</sup>" : "")), t: x => 2 * x * V(x), v: A1, err: "u′v keeps v: 2x times " + B + "<sup>−1</sup>." });
    const sg = bad === 2 ? -1 : 1, A2 = x => sg * (x * x + a) * dV(x);
    L.push({ html: "uv′ = " + (inv ? (bad === 2 ? "" : M) + "(x² + " + a + ")" + B + "<sup>−2</sup>" : "(x² + " + a + ")"), t: x => (x * x + a) * dV(x), v: A2, err: "The derivative of " + B + "<sup>−1</sup> is −" + B + "<sup>−2</sup>: the minus sign comes down with the power." });
    const tv = A1(x0) + A2(x0), vv = bad === 3 ? A1(x0) - A2(x0) : tv;
    L.push({ html: "f′(" + x0 + ") = " + rat(vv), t: tv, v: vv, err: "Add the two halves: u′v + uv′ = " + rat(A1(x0)) + " + (" + rat(A2(x0)) + ")." });
    return L;
  });
};
CP.REV.ratrad = function () {
  const a = ri(2, 9), b = ri(1, 4), B = "(x + " + b + ")", target = x => -a / Math.pow(x + b, 2);
  const o = (html, f, d) => ({ html: "f(x) = " + html, test: f, d });
  const cond = f => [0.5, 1.3, 2.2, 3.1].every(x => Math.abs(numd(f, x) - target(x)) < 1e-5 * Math.max(1, Math.abs(target(x))));
  return { task: "Which function has this derivative?", expr: "f′(x) = " + M + a + " ÷ " + B + "²", cond,
    correct: o(a + " ÷ " + B, x => a / (x + b)),
    wrong: [o(M + a + " ÷ " + B, x => -a / (x + b), a + " ÷ " + B + "²"), o(a + " ÷ " + B + "²", x => a / Math.pow(x + b, 2), M + (2 * a) + " ÷ " + B + "³"),
            o(M + a + B, x => -a * (x + b), M + a), o(a + " ÷ " + B + " + " + a, x => a / (x + b) + a, null)].filter(w => w.d).map(w => Object.assign(w, { why: "Its derivative is " + w.d + "." })),
    walk: ["A derivative of −" + a + " ÷ " + B + "² comes from " + a + B + "<sup>−1</sup>.", "Check: " + a + " × (−1)" + B + "<sup>−2</sup> = −" + a + " ÷ " + B + "².", "So f(x) = " + m_(a + " ÷ " + B) + ", plus any constant."] };
};
CP.CTX.ratrad = [
  function avg() {
    const c = pick([0.01, 0.02, 0.05]), q = pick([100, 200, 300, 400, 500]), F = c * q * q, v = pick([3, 6, 9]);
    return { k: "Finance", sid: "avg", task: "A print shop's average cost per poster is A(q) = " + F.toLocaleString("en-CA") + " ÷ q + " + v + " + " + c + "q. Which run size is cheapest per poster?", expr: "A′(q) = −" + F + "q<sup>−2</sup> + " + c,
      correct: opt(q + " posters", q), maxOf: { f: x => -(F / x + v + c * x), lo: 1, hi: 4 * q, want: "x" },
      wrong: [opt((q * q).toLocaleString("en-CA") + " posters", q * q, "That is q². Take the square root."), opt(Math.round(Math.sqrt(F)) + " posters", Math.sqrt(F), "You forgot to divide by " + c + ": q² = " + F + " ÷ " + c + "."),
              opt((q / 2) + " posters", q / 2, "Check A′(" + (q / 2) + "): it is still negative, so bigger runs are cheaper.")],
      walk: ["A′(q) = −" + F + " ÷ q² + " + c + " = 0.", "q² = " + F + " ÷ " + c + " = " + (q * q).toLocaleString("en-CA") + ".", "q = " + m_(q + " posters") + ", costing " + money(F / q + v + c * q) + " each."] };
  },
  function dose() {
    const k = pick([2, 3, 4, 5]), A = pick([20, 50, 80]);
    return { k: "Health", sid: "dose", task: "After a pill, the drug in the blood is C(t) = " + A + "t ÷ (t² + " + (k * k) + ") mg/L at t hours. When does it peak?", expr: "C(t) = " + A + "t(t² + " + (k * k) + ")<sup>−1</sup>",
      correct: opt("t = " + k + " h", k), maxOf: { f: t => A * t / (t * t + k * k), lo: 0, hi: 10 * k, want: "x" },
      wrong: [opt("t = " + (k * k) + " h", k * k, "That is k², the number on the bottom. C′ = 0 when t² = " + (k * k) + "."), opt("t = " + (2 * k) + " h", 2 * k, "At t = " + (2 * k) + " the level is already falling: C′ < 0."),
              opt("t = " + (k / 2) + " h", k / 2, "At t = " + (k / 2) + " the level is still rising: C′ > 0.")],
      walk: ["Product rule: C′(t) = " + A + "(t² + " + (k * k) + ")<sup>−1</sup> − " + A + "t × 2t(t² + " + (k * k) + ")<sup>−2</sup>.", "Over a common bottom: " + A + "(" + (k * k) + " − t²) ÷ (t² + " + (k * k) + ")².", "Zero at t = " + m_(k + " hours") + ", with peak level " + rat(A / (2 * k)) + " mg/L."] };
  }
];

/* ======================= ln x AND e^x ======================= */
CP.G.lnexp = function (tier) {
  if (tier === 0) {
    const kind = pick(["eln", "lne", "e2ln", "lnsum"]);
    if (kind === "eln") { const a = ri(2, 15); return { task: "Simplify.", expr: "e<sup>ln " + a + "</sup>", correct: opt(String(a), a), truthN: Math.exp(Math.log(a)),
      wrong: [opt("≈ " + Math.log(a).toFixed(3), Math.log(a), "That is ln " + a + " alone. e and ln undo each other, leaving " + a + "."), opt("≈ " + Math.exp(a).toFixed(1), Math.exp(a), "That is e<sup>" + a + "</sup>. The ln inside undoes the e."), opt("1", 1, "e<sup>ln a</sup> = a for any positive a.")],
      walk: ["ln " + a + " is the power of e that gives " + a + ".", "So e to that power is " + m_(String(a)) + "."] }; }
    if (kind === "lne") { const k = nz(-6, 9); return { task: "Simplify.", expr: "ln(e<sup>" + neg(k) + "</sup>)", correct: opt(neg(k), k), truthN: Math.log(Math.exp(k)),
      wrong: [opt("≈ " + Math.exp(k).toFixed(3), Math.exp(k), "That is e<sup>" + neg(k) + "</sup>. The ln undoes it."), opt("1", 1, "ln e = 1, but here e is raised to " + neg(k) + "."), opt(neg(-k), -k, "Sign slip. ln(e<sup>k</sup>) = k.")],
      walk: ["ln asks: what power of e gives this?", "e<sup>" + neg(k) + "</sup> is e to the power " + neg(k) + ", so the answer is " + m_(neg(k)) + "."] }; }
    if (kind === "e2ln") { const a = ri(2, 9); return { task: "Simplify.", expr: "e<sup>2 ln " + a + "</sup>", correct: opt(String(a * a), a * a), truthN: Math.exp(2 * Math.log(a)),
      wrong: [opt(String(2 * a), 2 * a, "2 ln " + a + " = ln(" + a + "²), not ln(2 × " + a + ")."), opt(String(a), a, "The 2 stays: 2 ln " + a + " = ln " + (a * a) + "."), opt("≈ " + (2 * Math.log(a)).toFixed(3), 2 * Math.log(a), "That is just the exponent, 2 ln " + a + ".")],
      walk: ["2 ln " + a + " = ln(" + a + "²) = ln " + (a * a) + ".", "e<sup>ln " + (a * a) + "</sup> = " + m_(String(a * a)) + "."] }; }
    const a = ri(2, 6), b = ri(2, 6);
    return { task: "Simplify.", expr: "ln(e<sup>" + a + "</sup> · e<sup>" + b + "</sup>)", correct: opt(String(a + b), a + b), truthN: Math.log(Math.exp(a) * Math.exp(b)),
      wrong: [opt(String(a * b), a * b, "Multiplying powers adds the exponents: e<sup>" + a + "</sup> · e<sup>" + b + "</sup> = e<sup>" + (a + b) + "</sup>."), opt("≈ " + (Math.log(a) + Math.log(b)).toFixed(3), Math.log(a) + Math.log(b), "That is ln " + a + " + ln " + b + ". Here a and b are exponents of e."), opt(String(a + b + 1), a + b + 1, "e<sup>" + a + "</sup> · e<sup>" + b + "</sup> = e<sup>" + (a + b) + "</sup>, and ln undoes the e.")],
      walk: ["e<sup>" + a + "</sup> · e<sup>" + b + "</sup> = e<sup>" + (a + b) + "</sup>.", "ln(e<sup>" + (a + b) + "</sup>) = " + m_(String(a + b)) + "."] };
  }
  if (tier === 1) {
    const A = pick([3, 5, 10, 20, 50]), k = pick([2, 3, 4, 0.5]), x = Math.log(A) / k;
    return { task: "Solve for x.", expr: "e<sup>" + (k === 1 ? "" : k) + "x</sup> = " + A,
      correct: opt("x ≈ " + x.toFixed(3), x), truthN: Math.log(A) / k,
      wrong: [opt("x ≈ " + (A / k).toFixed(3), A / k, "You divided " + A + " by " + k + ". Take ln of both sides first: " + k + "x = ln " + A + "."),
              opt("x ≈ " + (Math.log(A) * k).toFixed(3), Math.log(A) * k, "From " + k + "x = ln " + A + ", divide by " + k + "; don't multiply."),
              opt("x ≈ " + (Math.log10(A) / k).toFixed(3), Math.log10(A) / k, "That uses log base 10. To undo e, use ln.")],
      walk: ["Take ln of both sides: " + k + "x = ln " + A + " ≈ " + Math.log(A).toFixed(4) + ".", "Divide by " + k + ": x ≈ " + m_(x.toFixed(3)) + ".", "Check: e<sup>" + (k * x).toFixed(4) + "</sup> ≈ " + A + "."] };
  }
  const c = pick([2, 3, 4, 5]), d = pick([1, 2, 3, 4]), k = pick([2, 3, 0.5]), A = c * pick([3, 5, 8, 10]) + d, x = Math.log((A - d) / c) / k;
  return { task: "Solve for x.", expr: c + "e<sup>" + k + "x</sup> + " + d + " = " + A,
    correct: opt("x ≈ " + x.toFixed(3), x), truthN: Math.log((A - d) / c) / k,
    wrong: [opt("x ≈ " + (Math.log(A / c - d) / k).toFixed(3), Math.log(A / c - d) / k, "Subtract " + d + " before dividing by " + c + ": e<sup>" + k + "x</sup> = (" + A + " − " + d + ") ÷ " + c + "."),
            opt("x ≈ " + (Math.log(A - d) / k).toFixed(3), Math.log(A - d) / k, "Divide by " + c + " before taking ln."),
            opt("x ≈ " + ((Math.log(A) - Math.log(c) - d) / k).toFixed(3), (Math.log(A) - Math.log(c) - d) / k, "ln does not split over subtraction. Isolate e<sup>" + k + "x</sup> first.")],
    walk: ["Subtract " + d + ": " + c + "e<sup>" + k + "x</sup> = " + (A - d) + ".", "Divide by " + c + ": e<sup>" + k + "x</sup> = " + rat((A - d) / c) + ".", "Take ln: " + k + "x = ln " + rat((A - d) / c) + ", so x ≈ " + m_(x.toFixed(3)) + "."] };
};
CP.SPOT.lnexp = function () {
  const c = pick([2, 4, 5]), A = c * pick([3, 6, 9, 12]), k = pick([2, 3, 4]);
  return mkSpot(ask, "Solve " + c + "e<sup>" + k + "x</sup> = " + A + ".", bad => {
    const L = [], q = bad === 0 ? A - c : A / c;
    L.push({ html: "e<sup>" + k + "x</sup> = " + rat(q), t: A / c, v: q, err: "Divide both sides by " + c + ": " + A + " ÷ " + c + " = " + rat(A / c) + "." });
    const lt = Math.log(q), lv = bad === 1 ? Math.log10(q) : lt;
    L.push({ html: k + "x = ln " + rat(q) + " ≈ " + lv.toFixed(4), t: lt, v: lv, err: "ln " + rat(q) + " ≈ " + lt.toFixed(4) + ". The value written is log base 10." });
    const xt = lv / k, xv = bad === 2 ? lv * k : xt;
    L.push({ html: "x ≈ " + xv.toFixed(4), t: xt, v: xv, err: "Divide by " + k + ": " + lv.toFixed(4) + " ÷ " + k + " ≈ " + xt.toFixed(4) + "." });
    return L;
  });
};
CP.REV.lnexp = function () {
  if (Math.random() < 0.5) {
    const A = pick([4, 7, 12, 20, 50]), t = Math.log(A);
    return { task: "What goes in the box?", expr: "e<sup><span class=\"blank\">?</span></sup> = " + A, cond: x => Math.abs(Math.exp(x) - A) < 1e-6 * A,
      correct: { html: "≈ " + t.toFixed(4), test: +t.toFixed(10) }, wrong: [Math.log10(A), A / Math.E, Math.sqrt(A), A - 1].map(x => ({ html: "≈ " + x.toFixed(4), test: x })),
      whyOf: x => "e<sup>" + x.toFixed(4) + "</sup> ≈ " + Math.exp(x).toFixed(3) + ", not " + A + ".",
      walk: ["The power of e that gives " + A + " is ln " + A + " by definition.", "ln " + A + " ≈ " + t.toFixed(4) + "."] };
  }
  const k = pick([1, 2, 3, 0.5]), t = Math.exp(k);
  return { task: "What goes in the box?", expr: "ln(<span class=\"blank\">?</span>) = " + k, cond: x => Math.abs(Math.log(x) - k) < 1e-6,
    correct: { html: "≈ " + t.toFixed(4), test: +t.toFixed(10) }, wrong: [Math.pow(10, k), k * Math.E, Math.E + k, Math.log(k + 1)].map(x => ({ html: "≈ " + x.toFixed(4), test: x })),
    whyOf: x => "ln " + x.toFixed(4) + " ≈ " + Math.log(x).toFixed(3) + ", not " + k + ".",
    walk: ["ln undoes e, so the box holds e<sup>" + k + "</sup>.", "e<sup>" + k + "</sup> ≈ " + t.toFixed(4) + "."] };
};
CP.CTX.lnexp = [
  function doubling() {
    const r = pick([0.03, 0.04, 0.05, 0.06, 0.08]), t = Math.log(2) / r;
    return { k: "Finance", sid: "double", task: "A TFSA grows continuously at " + (r * 100) + "% a year: B(t) = B₀e<sup>" + r + "t</sup>. How long until it doubles?", expr: "e<sup>" + r + "t</sup> = 2",
      correct: opt(fN(t, 1) + " years", t), truthN: Math.log(2) / r,
      wrong: [opt(fN(2 / r, 1) + " years", 2 / r, "You divided 2 by the rate. Take ln first: " + r + "t = ln 2 ≈ 0.693."), opt(fN(1 / r, 1) + " years", 1 / r, "That is 1 ÷ rate. Doubling needs ln 2 ≈ 0.693 ÷ rate."),
              opt(fN(72 / (r * 100) * 1.5, 1) + " years", 72 / (r * 100) * 1.5, "Solve e<sup>" + r + "t</sup> = 2 with ln.")],
      walk: ["Take ln: " + r + "t = ln 2 ≈ 0.6931.", "t = 0.6931 ÷ " + r + " ≈ " + m_(fN(t, 1) + " years") + ".", "The rule of 72 rounds this: 72 ÷ " + (r * 100) + " ≈ " + fN(72 / (r * 100), 1) + "."] };
  },
  function carbon() {
    const f = pick([0.5, 0.25, 0.125, 0.1]), k = 0.000121, t = Math.log(1 / f) / k;
    return { k: "Science", sid: "carbon", task: "Carbon-14 decays as N = N₀e<sup>−0.000121t</sup>, t in years. A bone has " + (f * 100) + "% of its carbon-14 left. How old is it?", expr: "e<sup>−0.000121t</sup> = " + f,
      correct: opt(Math.round(t).toLocaleString("en-CA") + " years", Math.round(t)), truthN: Math.round(Math.log(f) / -k),
      wrong: [opt(Math.round(f / k).toLocaleString("en-CA") + " years", Math.round(f / k), "Take ln of both sides first: −0.000121t = ln " + f + "."),
              opt(Math.round((1 - f) / k).toLocaleString("en-CA") + " years", Math.round((1 - f) / k), "Decay is not linear. Use ln: t = ln(1/" + f + ") ÷ 0.000121."),
              opt(Math.round(Math.log10(1 / f) / k).toLocaleString("en-CA") + " years", Math.round(Math.log10(1 / f) / k), "That uses log base 10. To undo e, use ln.")],
      walk: ["Take ln: −0.000121t = ln " + f + " ≈ " + Math.log(f).toFixed(4) + ".", "t ≈ " + m_(Math.round(t).toLocaleString("en-CA") + " years") + "."] };
  },
  function debt() {
    const r = pick([0.18, 0.2, 0.22, 0.25]), m = pick([2, 3, 4]), t = Math.log(m) / r;
    return { k: "Finance", sid: "debt", task: "An unpaid balance grows continuously at " + (r * 100) + "% a year. How long until it is " + m + " times as big?", expr: "e<sup>" + r + "t</sup> = " + m,
      correct: opt(fN(t, 1) + " years", t), truthN: Math.log(m) / r,
      wrong: [opt(fN(m / r, 1) + " years", m / r, "Take ln of " + m + " first: ln " + m + " ≈ " + Math.log(m).toFixed(3) + "."), opt(fN((m - 1) / r, 1) + " years", (m - 1) / r, "That treats the interest as simple. Compounding is faster."),
              opt(fN(Math.log(m) * r, 1) + " years", Math.log(m) * r, "Divide ln " + m + " by the rate; don't multiply.")],
      walk: ["e<sup>" + r + "t</sup> = " + m + ", so " + r + "t = ln " + m + ".", "t = " + Math.log(m).toFixed(4) + " ÷ " + r + " ≈ " + m_(fN(t, 1) + " years") + "."] };
  }
];

/* ======================= GRAPHS ======================= */
const TWO_PI = 2 * Math.PI, WT = [-TWO_PI, TWO_PI];
function cubicFrom(r1, r2, a, C) { return Gr.poly([C, 3 * a * r1 * r2, -1.5 * a * (r1 + r2), a]); }
function pickRoots() { let r1, r2; do { r1 = ri(-3, 1); r2 = r1 + pick([2, 4]); } while (r2 > 3); return [r1, r2]; }
const shapeOK = (spec, gq) => {
  const W = gq.w, want = Gr.fn(gq.want);
  const sf = Gr.sameShape(Gr.fn(spec), want, W), sd = Gr.sameShape(Gr.fn(Gr.deriv(spec)), want, W);
  if (gq.comp === "f") return sf;
  if (gq.comp === "d") return sd;
  return sf && Gr.sameShape(Gr.fn(Gr.deriv(spec)), Gr.fn(Gr.deriv(gq.want)), W);
};
/* a graph-choice problem: options are drawings; distractors that would look the same are dropped */
function graphChoice(task, expr, gq, correctSpec, wrongs, walk) {
  const ws = wrongs.filter(w => w && !shapeOK(w[0], gq));
  return { task, expr, gq, correct: { html: Gr.tag(correctSpec, gq.w), g: correctSpec }, wrong: ws.map(([s, why]) => ({ html: Gr.tag(s, gq.w), g: s, why })), walk, graphs: true };
}
const intv = (lo, hi) => lo === -Infinity ? "x < " + neg(hi) : hi === Infinity ? "x > " + neg(lo) : neg(lo) + " < x < " + neg(hi);
CP.G.graphs = function (tier) {
  if (tier === 0) {
    const a = pick([1, -1, 0.5, -0.5]), h = pick([-2, -1, 1, 2]), k = ri(-3, 3), f = Gr.poly([a * h * h + k, -2 * a * h, a]), W = [h - 3, h + 3];
    if (Math.random() < 0.5) {
      const up = a > 0 ? [h, Infinity] : [-Infinity, h], ivs = [[h, Infinity], [-Infinity, h], [-h, Infinity], [-Infinity, -h], [k, Infinity]].filter(iv => intv(...iv) !== intv(...up));
      return { task: "Where is f increasing?", expr: Gr.tag(f, W, { big: true }), src: Gr.fn(f), signD: 1, prose: true,
        correct: { html: intv(...up), iv: up }, wrong: ivs.slice(0, 4).map(iv => ({ html: intv(...iv), iv, why: iv[0] === k && k !== h ? "That reads the height of the turning point, " + neg(k) + ", as a position. The turn is at x = " + neg(h) + "." : "Read the graph left to right: f falls, turns at x = " + neg(h) + ", then rises." + (a < 0 ? " Here it rises first, then falls." : "") })),
        walk: ["f turns at x = " + neg(h) + ".", a > 0 ? "Left of the turn it falls; right of it, it rises." : "Left of the turn it rises; right of it, it falls.", "Increasing: " + m_(intv(...up)) + ", where f′ > 0."] };
    }
    const gq = { want: Gr.deriv(f), comp: "f", w: W, exact: true }, fp = Gr.deriv(f);
    return graphChoice("Here is f. Which graph is f′?", Gr.tag(f, W, { big: true }), gq, fp,
      [[Gr.poly([2 * a * h, -2 * a]), "That is upside down: where f rises, f′ must be above the axis."], [Gr.poly([2 * a * h, 2 * a]), "Its zero is at x = " + neg(-h) + ". f′ is zero where f turns, x = " + neg(h) + "."],
       [f, "That is f itself. f′ records slope, so a parabola's derivative is a straight line."], [Gr.poly([-2 * a * (h + 2), 2 * a]), "Its zero is in the wrong place. f′ = 0 exactly where f turns."]],
      ["f turns at x = " + neg(h) + ", so f′ = 0 there.", (a > 0 ? "f falls then rises, so f′ goes from below the axis to above it." : "f rises then falls, so f′ goes from above the axis to below it."), "A parabola's slope changes steadily, so f′ is a straight line."]);
  }
  if (tier === 1) {
    const [r1, r2] = pickRoots(), a = pick([1, -1]), C = ri(-2, 2), f = cubicFrom(r1, r2, a, C), fp = Gr.deriv(f), W = [r1 - 1.6, r2 + 1.6];
    if (Math.random() < 0.4) {
      const sh = x => "x = " + neg(x);
      return { task: "From the graph, where is f′(x) = 0?", expr: Gr.tag(f, W, { big: true }), src: Gr.fn(f), rootsD: 1, nroots: 2, prose: true,
        correct: { html: sh(r1) + " and " + sh(r2), set: [r1, r2] },
        wrong: [{ html: sh((r1 + r2) / 2) + " only", set: [(r1 + r2) / 2], why: "That is where f is steepest between the turns. f′ = 0 where the graph is flat." },
                { html: "Where the graph crosses the x-axis", set: [999], why: "Crossing the axis means f = 0. f′ = 0 means the graph is flat: at the two turning points." },
                { html: sh(r1) + " only", set: [r1], why: "There are two flat turning points: x = " + neg(r1) + " and x = " + neg(r2) + "." }],
        walk: ["f′(x) = 0 where the tangent is flat.", "The graph turns at " + m_(sh(r1) + " and " + sh(r2)) + "."] };
    }
    const gq = { want: fp, comp: "f", w: W, exact: true };
    return graphChoice("Here is f. Which graph is f′?", Gr.tag(f, W, { big: true }), gq, fp,
      [[Gr.poly(Gr.parse(fp).v.map(c => -c)), "Upside down. Where f rises, f′ is above the axis."], [Gr.deriv(cubicFrom(r1 + 1, r2 + 1, a, 0)), "Its zeros are at the wrong x values. f′ = 0 exactly where f turns, at " + neg(r1) + " and " + neg(r2) + "."],
       [Gr.deriv(fp), "That is f″, the slope of f′. f′ is a parabola with zeros at the turning points."], [f, "That is f itself."]],
      ["f turns at x = " + neg(r1) + " and x = " + neg(r2) + ", so f′ is zero at both.", a > 0 ? "f rises, falls, rises: f′ is above, below, then above the axis." : "f falls, rises, falls: f′ is below, above, then below the axis.", "So f′ is a parabola opening " + (a > 0 ? "up" : "down") + "."]);
  }
  if (Math.random() < 0.5) {
    const A = pick([1, 2]), k = pick([1, 2]), useSin = Math.random() < 0.5, f = (useSin ? "s:" : "c:") + A + "," + k, fp = Gr.deriv(f), W = WT;
    const gq = { want: fp, comp: "f", w: W, exact: true }, other = useSin ? "s:" : "c:", flip = useSin ? "c:" : "s:";
    return graphChoice("Here is f(x) = " + (A === 1 ? "" : A) + (useSin ? "sin" : "cos") + (k === 1 ? " x" : "(" + k + "x)") + ". Which graph is f′?", Gr.tag(f, W, { big: true }), gq, fp,
      [[flip + (-Gr.parse(fp).v[0]) + "," + k, "Right curve, wrong sign. " + (useSin ? "Sine climbs at x = 0, so f′(0) > 0." : "Just after 0, cosine falls, so f′ is negative there.")],
       [f, "That is f itself. Its slope at x = 0 is " + (useSin ? A * k : 0) + ", which this graph doesn't show."], [other + (-A) + "," + k, "That is −f. Check the slope at x = 0 instead."]],
      [useSin ? "At x = 0, sine climbs steepest, so f′ is at its peak there." : "At x = 0, cosine is at its peak and flat, so f′(0) = 0.", "Each peak and trough of f is a zero of f′.", "So f′ = " + (useSin ? "" : M) + (A * k === 1 ? "" : A * k) + (useSin ? "cos" : "sin") + (k === 1 ? " x" : "(" + k + "x)") + "."]);
  }
  const R = pick([[-2, 0, 2], [-3, 0, 3], [-1, 1, 3], [-3, -1, 1]]), a = pick([1, -1]), s1 = R[0] + R[1] + R[2], s2 = R[0] * R[1] + R[0] * R[2] + R[1] * R[2], s3 = R[0] * R[1] * R[2];
  const f = Gr.poly([ri(-2, 2), -4 * a * s3, 2 * a * s2, -4 / 3 * a * s1, a]), fp = Gr.deriv(f), W = [R[0] - 1.4, R[2] + 1.4];
  const gq = { want: fp, comp: "f", w: W, exact: true };
  return graphChoice("Here is f. Which graph is f′?", Gr.tag(f, W, { big: true }), gq, fp,
    [[Gr.poly(Gr.parse(fp).v.map(c => -c)), "Upside down: where f rises, f′ must be above the axis."], [Gr.deriv(fp), "That is f″. f′ has three zeros, one at each turning point of f."], [f, "That is f itself."],
     [Gr.poly([-4 * a * (R[0] + 1) * (R[1] + 1) * (R[2] + 1), 4 * a * ((R[0] + 1) * (R[1] + 1) + (R[0] + 1) * (R[2] + 1) + (R[1] + 1) * (R[2] + 1)), -4 * a * (s1 + 3), 4 * a]), "Its zeros are shifted. f′ = 0 exactly where f turns."]],
    ["f has three turning points, at x = " + R.map(neg).join(", ") + ".", "So f′ has three zeros there, and is a cubic.", "Between the zeros, f′ is above the axis where f rises and below where it falls."]);
};
CP.SPOT.graphs = function () {
  const [r1, r2] = pickRoots(), a = pick([1, -1]), f = cubicFrom(r1, r2, a, ri(-2, 2)), W = [r1 - 1.6, r2 + 1.6];
  const up = a > 0, s = v => v > 0 ? "f′ > 0" : "f′ < 0";
  return mkSpot("A student described f′ from this graph of f. One line has a mistake. Which line?", Gr.tag(f, W, { big: true, marks: [r1, r2] }), bad => {
    const L = [];
    const s0 = up ? 1 : -1, w0 = bad === 0 ? -s0 : s0;
    L.push({ html: "For x < " + neg(r1) + ", f " + (w0 > 0 ? "rises" : "falls") + ", so " + s(w0), t: s0, v: w0, err: "Read the graph left of x = " + neg(r1) + ": f " + (up ? "rises" : "falls") + " there, so " + s(s0) + "." });
    const w1 = bad === 1 ? "largest" : "zero";
    L.push({ html: "At x = " + neg(r1) + " the tangent is flat, so f′(" + neg(r1) + ") " + (w1 === "zero" ? "= 0" : "is at its largest"), t: "zero", v: w1, err: "A flat tangent means a slope of 0. f′(" + neg(r1) + ") = 0." });
    const s2 = -s0, w2 = bad === 2 ? -s2 : s2;
    L.push({ html: "Between x = " + neg(r1) + " and x = " + neg(r2) + ", " + s(w2), t: s2, v: w2, err: "Between the turns f " + (up ? "falls" : "rises") + ", so " + s(s2) + "." });
    const w3 = bad === 3 ? (up ? "down" : "up") : (up ? "up" : "down");
    L.push({ html: "So f′ is a parabola opening " + w3 + ", with zeros at " + neg(r1) + " and " + neg(r2), t: up ? "up" : "down", v: w3, err: "f′ is " + (up ? "positive, negative, positive" : "negative, positive, negative") + ": a parabola opening " + (up ? "up" : "down") + "." });
    return L;
  });
};
CP.REV.graphs = function () {
  const [r1, r2] = pickRoots(), a = pick([1, -1]), C = ri(-4, 4), f = cubicFrom(r1, r2, a, C), fp = Gr.deriv(f), W = [r1 - 1.6, r2 + 1.6];
  const ptxt = spec => "f(x) = " + poly(Gr.parse(spec).v.map((c, i) => ({ c, p: i })));
  const cond = spec => Gr.sameShape(Gr.fn(Gr.deriv(spec)), Gr.fn(fp), W) && !Gr.parse(Gr.deriv(spec)).v.every(c => c === 0);
  const o = spec => ({ html: ptxt(spec), test: spec });
  return { task: "This is the graph of f′. Which could be f?", expr: Gr.tag(fp, W, { big: true }), cond, prose: true,
    correct: o(f), wrong: [o(cubicFrom(r1, r2, -a, C)), o(cubicFrom(r1 + 1, r2 + 1, a, C)), o(Gr.poly(Gr.parse(fp).v)), o(cubicFrom(-r2, -r1, a, C))],
    whyOf: spec => "Its derivative is " + poly(Gr.parse(Gr.deriv(spec)).v.map((c, i) => ({ c, p: i }))) + ", which is zero at different places or has the opposite signs.",
    walk: ["The graph of f′ is zero at x = " + neg(r1) + " and " + neg(r2) + ", so f turns there.", "Differentiate each option and compare signs.", "f(x) = " + poly(Gr.parse(f).v.map((c, i) => ({ c, p: i }))) + " has f′ = " + poly(Gr.parse(fp).v.map((c, i) => ({ c, p: i }))) + ". It matches."] };
};
CP.CTX.graphs = [
  function revenue() {
    const r1 = ri(1, 3), r2 = r1 + ri(3, 5), R = Gr.poly([300, 6 * r1 * r2, -3 * (r1 + r2), 2]), W = [0, r2 + 2];
    return { k: "Finance", sid: "revenue", task: "This graph shows a shop's monthly revenue R(m), m months after opening. During which months was revenue falling?", expr: Gr.tag(R, W, { big: true }),
      src: Gr.fn(R), signD: 1, signNeg: true, prose: true,
      correct: { html: "Between month " + r1 + " and month " + r2, iv: [r1, r2] },
      wrong: [{ html: "Before month " + r1, iv: [-Infinity, r1], why: "The graph climbs before month " + r1 + ": R′ > 0." }, { html: "After month " + r2, iv: [r2, Infinity], why: "The graph climbs again after month " + r2 + "." },
              { html: "Between month 0 and month " + r2, iv: [0, r2], why: "Revenue rose until month " + r1 + ". It only fell between the two turning points." }],
      walk: ["Revenue falls where the graph goes down: R′ < 0.", "The graph turns at months " + r1 + " and " + r2 + ".", "It falls " + m_("between month " + r1 + " and month " + r2) + "."] };
  },
  function ball() {
    const m = pick([1, 1.5, 2]), h = Gr.poly([1.5, 9.8 * m, -4.9]), W = [0, 2 * m + 0.3];
    return { k: "Sport", sid: "ballg", task: "This graph shows a thrown ball's height. When is its vertical velocity zero?", expr: Gr.tag(h, W, { big: true, marks: [m] }), src: Gr.fn(h), rootsD: 1, nroots: 1,
      correct: { html: "t = " + m + " s", set: [m] },
      wrong: [{ html: "t = 0 s", set: [0], why: "At t = 0 the ball is moving up fast. Velocity is zero where the graph is flat: at the top." }, { html: "t = " + (2 * m) + " s", set: [2 * m], why: "That is near where it lands, moving down fast." },
              { html: "t = " + (m / 2) + " s", set: [m / 2], why: "Halfway up it is still rising. The graph is flat only at the top." }],
      walk: ["Velocity is the slope of the height graph.", "The slope is zero at the top of the arc, " + m_("t = " + m + " s") + "."] };
  }
];

/* ======================= SKETCHING ======================= */
const signChart = (r1, r2, up) => "f′ " + (up ? ">" : "<") + " 0 for x < " + neg(r1) + "; f′ " + (up ? "<" : ">") + " 0 for " + neg(r1) + " < x < " + neg(r2) + "; f′ " + (up ? ">" : "<") + " 0 for x > " + neg(r2);
CP.G.sketch = function (tier) {
  if (tier === 0) {
    const a = pick([2, -2, 1, -1]), h = pick([-2, -1, 1, 2]), fp = Gr.poly([-a * h, a]), W = [h - 3, h + 3], f = Gr.poly([a * h * h / 2 + ri(-2, 2), -a * h, a / 2]);
    const gq = { want: fp, comp: "d", w: W };
    return graphChoice("This is the graph of f′. Which graph could be f?", Gr.tag(fp, W, { big: true }), gq, f,
      [[Gr.poly(Gr.parse(f).v.map(c => -c)), "Upside down. Where f′ is above the axis, f must be rising."], [Gr.poly([a * h * h / 2, a * h, a / 2]), "It turns at the wrong x. f turns where f′ crosses zero, at x = " + neg(h) + "."],
       [fp, "That is f′ itself."], [Gr.poly([0, a]), "A straight line has a constant slope, but f′ changes sign at x = " + neg(h) + "."]],
      ["f′ crosses zero at x = " + neg(h) + ", so f turns there.", a > 0 ? "f′ goes from negative to positive: f falls, then rises. A valley." : "f′ goes from positive to negative: f rises, then falls. A hill.", "f is a parabola with its turn at x = " + neg(h) + ". Its height is not fixed by f′."]);
  }
  if (tier === 1) {
    const [r1, r2] = pickRoots(), a = pick([1, -1]), f = cubicFrom(r1, r2, a, ri(-2, 2)), fp = Gr.deriv(f), W = [r1 - 1.6, r2 + 1.6];
    const gq = { want: fp, comp: "d", w: W };
    return graphChoice("Which graph fits this sign chart?", signChart(r1, r2, a > 0), gq, f,
      [[cubicFrom(r1, r2, -a, 0), "Signs reversed: this one " + (a > 0 ? "falls" : "rises") + " first."], [cubicFrom(r1 + 1, r2 + 1, a, 0), "It turns at x = " + neg(r1 + 1) + " and " + neg(r2 + 1) + ". The chart says " + neg(r1) + " and " + neg(r2) + "."],
       [Gr.poly([0, a]), "A line never turns. The chart has two turning points."], [Gr.poly([0, 0, a]), "A parabola turns once. The chart has two turning points."]],
      [(a > 0 ? "Rising" : "Falling") + " until x = " + neg(r1) + ", then " + (a > 0 ? "falling" : "rising") + " until x = " + neg(r2) + ", then " + (a > 0 ? "rising" : "falling") + ".", "That is a cubic with a local " + (a > 0 ? "max" : "min") + " at " + neg(r1) + " and a local " + (a > 0 ? "min" : "max") + " at " + neg(r2) + "."]);
  }
  if (Math.random() < 0.5) {
    const p = pick([1, 2]), b = ri(-2, 2), f = Gr.poly([b, -3 * p * p, 0, 1]), W = [-p - 1.8, p + 1.8];
    const gq = { want: f, comp: "fd", w: W, exact: true };
    return graphChoice("Which graph is f(x) = " + poly([{ c: 1, p: 3 }, { c: -3 * p * p, p: 1 }, { c: b, p: 0 }]) + "?", "f′(x) = 3x² − " + (3 * p * p) + ", zero at x = ±" + p, gq, f,
      [[Gr.poly([-b, 3 * p * p, 0, -1]), "That is −f: it falls at the far right, but a positive x³ term makes f rise there."], [Gr.poly([b, 3 * p * p, 0, 1]), "That is x³ + " + (3 * p * p) + "x: it never turns. f′ = 3x² − " + (3 * p * p) + " is zero twice, so f turns twice."],
       [Gr.poly([b + 3, -3 * p * p, 0, 1]), "Right shape, wrong height: the y-intercept should be " + neg(b) + "."], [Gr.poly([b, -3 * p * p * 4, 0, 1]), "It turns at x = ±" + (2 * p) + ". f′ = 0 at x = ±" + p + "."]],
      ["f′(x) = 3x² − " + (3 * p * p) + " = 0 at x = ±" + p + ": a local max at x = −" + p + " and a min at x = " + p + ".", "f″(x) = 6x: inflection at x = 0.", "The y-intercept is f(0) = " + neg(b) + ", and f rises to the far right."]);
  }
  const [r1, r2] = pickRoots(), a = pick([1, -1]), f = cubicFrom(r1, r2, a, ri(-2, 2)), fpp = Gr.deriv(Gr.deriv(f)), W = [r1 - 1.6, r2 + 1.6];
  const gq = { want: fpp, comp: "f", w: W, exact: true };
  return graphChoice("Here is f. Which graph is f″?", Gr.tag(f, W, { big: true }), gq, fpp,
    [[Gr.poly(Gr.parse(fpp).v.map(c => -c)), "Upside down. Where f bends like a smile, f″ > 0."], [Gr.deriv(f), "That is f′, a parabola. f″ for a cubic is a straight line."], [Gr.poly([-6 * a * ((r1 + r2) / 2 + 1), 6 * a]), "Its zero is in the wrong place: f″ = 0 at the inflection point, halfway between the turns."]],
    ["f changes bend halfway between its turns, at x = " + neg((r1 + r2) / 2) + ": that is where f″ = 0.", a > 0 ? "Left of it f frowns (f″ < 0); right of it f smiles (f″ > 0)." : "Left of it f smiles (f″ > 0); right of it f frowns (f″ < 0).", "For a cubic, f″ is a straight line."]);
};
CP.SPOT.sketch = function () {
  const p = pick([1, 2, 3]), c = ri(-4, 4), F = [{ c: 1, p: 3 }, { c: -3 * p * p, p: 1 }, { c, p: 0 }];
  return mkSpot("A student sketched f(x) = " + poly(F) + ". One line has a mistake. Which line?", "f(x) = " + poly(F), bad => {
    const L = [], k = bad === 0 ? p * p : 3 * p * p;
    L.push({ html: "f′(x) = 3x² − " + k, t: x => 3 * x * x - 3 * p * p, v: x => 3 * x * x - k, err: "The derivative of −" + (3 * p * p) + "x is −" + (3 * p * p) + "." });
    const rt = Math.sqrt(k / 3), rv2 = bad === 1 ? 3 * rt : rt;
    L.push({ html: "f′ = 0 at x = ±" + rat(rv2), t: [-rt, rt], v: [-rv2, rv2], err: "3x² = " + k + " gives x² = " + rat(k / 3) + ", so x = ±" + rat(rt) + "." });
    const cu = bad === 2 ? "x < 0" : "x > 0";
    L.push({ html: "f″(x) = 6x, so f is concave up for " + cu, t: "x > 0", v: cu, err: "6x > 0 when x > 0: concave up on the right." });
    const kind = bad === 3 ? "minimum" : "maximum";
    L.push({ html: "So x = −" + rat(rv2) + " is a local " + kind, t: "maximum", v: kind, err: "At x = −" + rat(rv2) + ", f″ < 0: concave down, a hill, so a maximum." });
    return L;
  });
};
CP.REV.sketch = function () {
  const [r1, r2] = pickRoots(), a = pick([1, -1]), f = cubicFrom(r1, r2, a, ri(-2, 2)), W = [r1 - 1.6, r2 + 1.6], up = a > 0;
  const o = (q1, q2, u) => ({ html: signChart(q1, q2, u), test: [q1, q2, u] });
  return { task: "Here is f. Which sign chart for f′ matches it?", expr: Gr.tag(f, W, { big: true }), prose: true, cond: T => T[0] === r1 && T[1] === r2 && T[2] === up,
    correct: o(r1, r2, up), wrong: [o(r1, r2, !up), o(r1 + 1, r2 + 1, up), o(r1 - 1, r2, up), o(r1, r2 + 1, !up)],
    whyOf: T => T[2] !== up ? "The signs are reversed: f " + (up ? "rises" : "falls") + " first." : "The turning points are in the wrong places: f turns at " + neg(r1) + " and " + neg(r2) + ".",
    walk: ["Find where the graph turns: x = " + neg(r1) + " and " + neg(r2) + ".", "Rising means f′ > 0, falling means f′ < 0.", signChart(r1, r2, up) + "."] };
};
CP.CTX.sketch = [
  function sales() {
    const T = pick([6, 8, 10, 12]), a = pick([3, 6]), Sp = Gr.poly([0, a * T, -a]), W = [0, T + 3];
    return { k: "Finance", sid: "salesg", task: "This graph shows a game's weekly sales rate, S′(t), in thousands of copies. When are total sales S(t) at their highest?", expr: Gr.tag(Sp, W, { big: true }),
      correct: opt("Week " + T, T), maxOf: { f: t => a * T * t * t / 2 - a * t * t * t / 3, lo: 0, hi: T + 3, want: "x" },
      wrong: [opt("Week " + (T / 2), T / 2, "That is where the sales rate peaks: total sales grow fastest there, but are still growing."), opt("Week 0", 0, "At launch total sales are zero."),
              opt("Week " + (T + 3), T + 3, "By then S′ < 0: total sales have been falling since week " + T + ".")],
      walk: ["Total sales rise while S′ > 0 and fall once S′ < 0.", "S′ crosses zero at week " + T + ".", "So S peaks at " + m_("week " + T) + "."] };
  },
  function velocity() {
    const m = pick([1, 1.5, 2, 2.5]), v = Gr.poly([9.8 * m, -9.8]), W = [0, 2 * m + 0.5];
    return { k: "Sport", sid: "velg", task: "This graph shows a ball's vertical velocity, v(t) = h′(t). When is the ball highest?", expr: Gr.tag(v, W, { big: true }),
      correct: opt("t = " + m + " s", m), maxOf: { f: t => 9.8 * m * t - 4.9 * t * t, lo: 0, hi: 2 * m + 0.5, want: "x" },
      wrong: [opt("t = 0 s", 0, "Velocity is highest at t = 0, but height is not. Height peaks where velocity crosses zero."), opt("t = " + (2 * m) + " s", 2 * m, "By then it is falling fast: v < 0."),
              opt("t = " + (m / 2) + " s", m / 2, "At t = " + (m / 2) + " the velocity is still positive: it is still rising.")],
      walk: ["Height rises while v > 0 and falls once v < 0.", "v crosses zero at " + m_("t = " + m + " s") + ": the top of the throw."] };
  }
];

/* ======================= BEARINGS ======================= */
const comp = (r, th) => [+(r * Math.sin(rad(th))).toFixed(1), +(r * Math.cos(rad(th))).toFixed(1)];
const bearingOf = (e, n) => { const th = Math.round(deg(Math.atan2(Math.abs(e), Math.abs(n)))); return (n >= 0 ? "N" : "S") + " " + th + "° " + (e >= 0 ? "E" : "W"); };
CP.h.bearingOf = bearingOf;
const v1 = v => "(" + v.map(x => fN(x, 1)).join(", ") + ")";
const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
CP.G.bearings = function (tier) {
  if (tier === 0) {
    const r = pick([10, 20, 40, 100]), th = pick([30, 60, 40, 20]), ns = pick([1, -1]), ew = pick([1, -1]);
    const [e0, n0] = comp(r, th), c = [ew * e0, ns * n0], name = (ns > 0 ? "N" : "S") + " " + th + "° " + (ew > 0 ? "E" : "W");
    const W = [[[ew * n0, ns * e0], "You measured the angle from east instead of north. Bearings start at north (or south)."], [[-c[0], c[1]], (ew > 0 ? "E" : "W") + " means the east part is " + (ew > 0 ? "positive" : "negative") + "."], [[c[0], -c[1]], (ns > 0 ? "N" : "S") + " means the north part is " + (ns > 0 ? "positive" : "negative") + "."], [[ew * r / 2, ns * r / 2], "Components come from sine and cosine, not from splitting the distance in half."]];
    return { task: "A boat travels " + r + " km at " + name + ". What are its (east, north) components?", expr: r + " km, " + name,
      correct: { html: v1(c), v: c }, truthV: [+(ew * r * Math.cos(rad(90 - th))).toFixed(1), +(ns * r * Math.sin(rad(90 - th))).toFixed(1)],
      wrong: W.map(([v, why]) => ({ html: v1(v), v, why })),
      walk: ["Measured from " + (ns > 0 ? "north" : "south") + ", the east–west part uses sine: " + r + " sin " + th + "° ≈ " + fN(e0, 1) + ".", "The north–south part uses cosine: " + r + " cos " + th + "° ≈ " + fN(n0, 1) + ".", "With signs: " + m_(v1(c)) + "."] };
  }
  if (tier === 1) {
    const [a, b, h] = pick(TRI), s = pick([1, 2, 3]), swap = Math.random() < 0.5, e = (swap ? b : a) * s * pick([1, -1]), n = (swap ? a : b) * s * pick([1, -1]);
    const right = bearingOf(e, n), th = Math.round(deg(Math.atan2(Math.abs(e), Math.abs(n))));
    const alt = [(n >= 0 ? "N" : "S") + " " + (90 - th) + "° " + (e >= 0 ? "E" : "W"), (n >= 0 ? "S" : "N") + " " + th + "° " + (e >= 0 ? "W" : "E"), (n >= 0 ? "N" : "S") + " " + th + "° " + (e >= 0 ? "W" : "E"), (n >= 0 ? "S" : "N") + " " + th + "° " + (e >= 0 ? "E" : "W")];
    const whys = ["That angle is measured from east–west. Bearings measure from north or south.", "That points the opposite way.", "East and west are swapped.", "North and south are swapped."];
    return { task: "A hiker ends up " + Math.abs(e) + " km " + (e >= 0 ? "east" : "west") + " and " + Math.abs(n) + " km " + (n >= 0 ? "north" : "south") + " of camp. What is the bearing from camp?", expr: "(" + neg(e) + ", " + neg(n) + ")", bearing: [e, n], prose: true,
      correct: { html: right + ", " + (h * s) + " km", b: right }, wrong: alt.filter(x => x !== right).map((x, i) => ({ html: x + ", " + (h * s) + " km", b: x, why: whys[alt.indexOf(x)] })),
      walk: ["Distance: √(" + (e * e) + " + " + (n * n) + ") = " + (h * s) + " km.", "Angle from " + (n >= 0 ? "north" : "south") + ": tan⁻¹(" + Math.abs(e) + " ÷ " + Math.abs(n) + ") ≈ " + th + "°.", "Bearing: " + m_(right) + "."] };
  }
  const [a, b, h] = pick(TRI), s = pick([10, 20]), H = b * s, Wd = a * s, sp = h * s;
  return { task: "A plane heads due north at " + H + " km/h. A wind blows due east at " + Wd + " km/h. What is its ground speed?", expr: "(0, " + H + ") + (" + Wd + ", 0)",
    correct: opt(sp + " km/h", sp), truthN: len([Wd, H, 0]),
    wrong: [opt((H + Wd) + " km/h", H + Wd, "Speeds at right angles don't add. Add the vectors, then take the length."), opt((H - Wd) + " km/h", H - Wd, "A crosswind doesn't slow the plane straight down. Use Pythagoras."),
            opt(H + " km/h", H, "The wind adds a sideways part, so the ground speed grows.")],
    walk: ["Ground velocity = (" + Wd + ", " + H + ").", "Speed = √(" + Wd + "² + " + H + "²) = " + m_(sp + " km/h") + ".", "It drifts to a bearing of " + bearingOf(Wd, H) + "."] };
};
CP.SPOT.bearings = function () {
  const r = pick([10, 20, 40]), th = pick([30, 60, 20, 70]);
  return mkSpot(ask, "Find the components of " + r + " km at N " + th + "° E.", bad => {
    const L = [], et = r * Math.sin(rad(th)), ev = bad === 0 ? r * Math.cos(rad(th)) : et;
    L.push({ html: "East part = " + r + (bad === 0 ? " cos " : " sin ") + th + "° ≈ " + fN(ev, 2), t: et, v: ev, err: "Measured from north, the east part is opposite the angle: use sine." });
    const nt = r * Math.cos(rad(th)), nv = bad === 1 ? -nt : nt;
    L.push({ html: "North part ≈ " + fN(nv, 2), t: nt, v: nv, err: "N means the north part is positive: " + r + " cos " + th + "° ≈ " + fN(nt, 2) + "." });
    const ct = Math.hypot(ev, nv), cv = bad === 2 ? Math.abs(ev) + Math.abs(nv) : ct;
    L.push({ html: "Check: length ≈ " + fN(cv, 2) + " km", t: ct, v: cv, err: "Length is √(e² + n²), not e + n." });
    return L;
  });
};
CP.REV.bearings = function () {
  const [a, b, h] = pick(TRI), s = pick([1, 2]), e = a * s * pick([1, -1]), n = b * s * pick([1, -1]), right = bearingOf(e, n);
  const o = (d, br) => ({ html: d + " km at " + br, test: [d, br] });
  const th = Math.round(deg(Math.atan2(Math.abs(e), Math.abs(n))));
  return { task: "Which single trip takes you to the same place?", expr: Math.abs(e) + " km " + (e >= 0 ? "east" : "west") + ", then " + Math.abs(n) + " km " + (n >= 0 ? "north" : "south"), prose: true,
    cond: T => T[0] === h * s && T[1] === right,
    correct: o(h * s, right), wrong: [o((a + b) * s, right), o(h * s, (n >= 0 ? "N" : "S") + " " + (90 - th) + "° " + (e >= 0 ? "E" : "W")), o(h * s, (n >= 0 ? "S" : "N") + " " + th + "° " + (e >= 0 ? "E" : "W")), o(h * s, (n >= 0 ? "N" : "S") + " " + th + "° " + (e >= 0 ? "W" : "E"))],
    whyOf: T => T[0] !== h * s ? "The legs are at right angles: the straight distance is √(" + (a * s) + "² + " + (b * s) + "²) = " + (h * s) + " km." : "Wrong direction: the trip ends " + (e >= 0 ? "east" : "west") + " and " + (n >= 0 ? "north" : "south") + ", " + th + "° from " + (n >= 0 ? "north" : "south") + ".",
    walk: ["Straight distance: √(" + (e * e) + " + " + (n * n) + ") = " + (h * s) + " km.", "Angle from " + (n >= 0 ? "north" : "south") + ": tan⁻¹(" + Math.abs(e) + "/" + Math.abs(n) + ") ≈ " + th + "°.", "So " + (h * s) + " km at " + right + "."] };
};
CP.CTX.bearings = [
  function port() {
    const d = pick([60, 80, 120, 150]), th = pick([20, 30, 40, 60]), fee = pick([10, 12, 15]), south = d * Math.cos(rad(th)), cost = south * fee;
    return { k: "Finance", sid: "port", task: "A freighter sails " + d + " km at S " + th + "° E. A channel fee is charged at " + money(fee, 0) + " per km travelled south. What is the fee?", expr: d + " km, S " + th + "° E",
      correct: opt(money(cost), cost), truthN: d * Math.sin(rad(90 - th)) * fee,
      wrong: [opt(money(d * Math.sin(rad(th)) * fee), d * Math.sin(rad(th)) * fee, "That uses the east part. The south part is " + d + " cos " + th + "°."),
              opt(money(d * fee), d * fee, "That charges the whole distance. Only the southward part counts."), opt(money(south), south, "That is the distance south in km. Multiply by " + money(fee, 0) + ".")],
      walk: ["South part: " + d + " cos " + th + "° ≈ " + fN(south, 1) + " km.", "Fee: " + fN(south, 1) + " × " + money(fee, 0) + " ≈ " + m_(money(cost)) + "."] };
  },
  function crosswind() {
    const H = pick([300, 400, 500]), w = pick([40, 60, 75, 90]), ang = deg(Math.atan(w / H));
    return { k: "Science", sid: "xwind", task: "A pilot points the plane due north at " + H + " km/h. A " + w + " km/h wind blows from the west. What bearing does the plane actually fly?", expr: "(" + w + ", " + H + ")",
      correct: opt("N " + fN(ang, 1) + "° E", ang), truthN: 90 - deg(Math.atan2(H, w)),
      wrong: [opt("N " + fN(90 - ang, 1) + "° E", 90 - ang, "That angle is measured from east. Bearings start at north."), opt("N " + fN(ang, 1) + "° W", -ang, "A wind from the west pushes the plane east."),
              opt("N " + fN(w / H * 90, 1) + "° E", w / H * 90, "Use tan⁻¹(" + w + " ÷ " + H + "), not a share of 90°.")],
      walk: ["Ground velocity: (" + w + ", " + H + ") east and north.", "Angle from north: tan⁻¹(" + w + " ÷ " + H + ") ≈ " + fN(ang, 1) + "°.", "Bearing " + m_("N " + fN(ang, 1) + "° E") + ". The pilot must aim that much west of north to stay on course."] };
  }
];

/* ======================= TRIPLE PRODUCT AND LAWS ======================= */
const R3 = () => rv(-4, 4);
const LAWS_T = [
  ["u · v = v · u", (u, v) => [dot(u, v), dot(v, u)]], ["u × v = −(v × u)", (u, v) => [cross(u, v), cross(v, u).map(x => -x)]],
  ["u · (v + w) = u · v + u · w", (u, v, w) => [dot(u, add(v, w)), dot(u, v) + dot(u, w)]], ["k(u × v) = (ku) × v", (u, v, w, k) => [cross(u, v).map(x => k * x), cross(u.map(x => k * x), v)]],
  ["u · (u × v) = 0", (u, v) => [dot(u, cross(u, v)), 0]], ["u · u = |u|²", u => [dot(u, u), Math.pow(len(u), 2)]], ["u × u is the zero vector", u => [cross(u, u), [0, 0, 0]]],
  ["u × (v + w) = u × v + u × w", (u, v, w) => [cross(u, add(v, w)), add(cross(u, v), cross(u, w))]]];
const LAWS_F = [
  ["u × v = v × u", (u, v) => [cross(u, v), cross(v, u)], "Swapping the order flips the cross product: v × u = −(u × v)."],
  ["(u · v)w = u(v · w)", (u, v, w) => [w.map(x => x * dot(u, v)), u.map(x => x * dot(v, w))], "The left side points along w, the right along u. Dot products can't be regrouped like that."],
  ["u × (v × w) = (u × v) × w", (u, v, w) => [cross(u, cross(v, w)), cross(cross(u, v), w)], "The cross product is not associative. Try u = v = i, w = j: the left gives −j, the right gives 0."],
  ["|u + v| = |u| + |v|", (u, v) => [len(add(u, v)), len(u) + len(v)], "Only when u and v point the same way. In general |u + v| ≤ |u| + |v|."],
  ["|u × v| = |u||v|", (u, v) => [len(cross(u, v)), len(u) * len(v)], "|u × v| = |u||v| sin θ. It equals |u||v| only at right angles."],
  ["(u + v) · (u − v) = |u|² + |v|²", (u, v) => [dot(add(u, v), sub(u, v)), dot(u, u) + dot(v, v)], "Expand: u · u − v · v = |u|² − |v|². The middle terms cancel."],
  ["u · (v × w) = v · (u × w)", (u, v, w) => [dot(u, cross(v, w)), dot(v, cross(u, w))], "Swapping u and v flips the sign: v · (u × w) = −u · (v × w)."]];
const det3 = (u, v, w) => u[0] * (v[1] * w[2] - v[2] * w[1]) - u[1] * (v[0] * w[2] - v[2] * w[0]) + u[2] * (v[0] * w[1] - v[1] * w[0]);
CP.G.triple = function (tier) {
  if (tier === 0) {
    const [h, law] = pick(LAWS_T), fs = shuffle(LAWS_F.slice()).slice(0, 3);
    return { task: "Which is true for all vectors u, v, w and every number k?", expr: "Vector laws", prose: true, laws: true,
      correct: { html: h, law }, wrong: fs.map(([s, l, why]) => ({ html: s, law: l, why })),
      walk: ["Test each claim with simple vectors like i = (1, 0, 0) and j = (0, 1, 0).", "A single failure rules a claim out.", m_(h) + " holds every time."] };
  }
  if (tier === 1) {
    let u, v, w, T; do { u = rv(-3, 3); v = rv(-3, 3); w = rv(-3, 3); T = dot(u, cross(v, w)); } while (T === 0);
    const vw = cross(v, w), slip = [vw[0], -vw[1], vw[2]];
    return { task: "Find the volume of the box with edges u, v and w.", expr: "u = " + vec(u) + ", v = " + vec(v) + ", w = " + vec(w),
      correct: opt(String(Math.abs(T)), Math.abs(T)), truthN: Math.abs(det3(u, v, w)),
      wrong: [opt(String(Math.abs(dot(u, slip))), Math.abs(dot(u, slip)), "Sign slip in the middle component of v × w."), opt(fN(len(vw), 2), len(vw), "That is |v × w|, the area of the base. Dot with u to bring in the height."),
              opt(String(Math.abs(dot(u, v) + dot(v, w) + dot(u, w))), Math.abs(dot(u, v) + dot(v, w) + dot(u, w)), "Volume needs u · (v × w), a cross product inside a dot product."), opt(neg(T < 0 ? T : -T), T < 0 ? T : -T, "A volume is never negative. Take the absolute value.")],
      walk: ["v × w = " + vec(vw) + ".", "u · (v × w) = " + neg(T) + ".", "Volume = |" + neg(T) + "| = " + m_(String(Math.abs(T))) + " cubic units."] };
  }
  let u, v, a, b, k, D1, D0;
  do { u = rv(-3, 3); v = rv(-3, 3); a = nz(-4, 4); b = nz(-4, 4); D1 = u[0] * v[1] - u[1] * v[0]; D0 = det3(u, v, [a, b, 0]); } while (D1 === 0 || D0 % D1 !== 0);
  k = -D0 / D1;
  return { task: "For which k do u, v and w lie in one plane?", expr: "u = " + vec(u) + ", v = " + vec(v) + ", w = (" + neg(a) + ", " + neg(b) + ", k)",
    correct: opt("k = " + neg(k), k), truthN: -det3(u, v, [a, b, 0]) / det3(u, v, [0, 0, 1]),
    wrong: [opt("k = " + neg(-k), -k, "Sign slip. Then u · (v × w) = " + neg(det3(u, v, [a, b, -k])) + ", not 0."), opt("k = 0", 0, "With k = 0 the triple product is " + neg(D0) + ", not 0."),
            opt("k = " + neg(k + 1), k + 1, "Then u · (v × w) = " + neg(det3(u, v, [a, b, k + 1])) + ", not 0.")],
    walk: ["In one plane means the box is flat: u · (v × w) = 0.", "The triple product is " + neg(D0) + " + " + neg(D1) + "k.", "Set it to 0: k = " + m_(neg(k)) + "."] };
};
CP.SPOT.triple = function () {
  let u, v, w, T, vw; do { u = rv(-3, 3); v = rv(-3, 3); w = rv(-3, 3); vw = cross(v, w); T = dot(u, vw); } while (T === 0 || vw[1] === 0 || u[1] === 0);
  return mkSpot(ask, "Volume of the box with edges u = " + vec(u) + ", v = " + vec(v) + ", w = " + vec(w), bad => {
    const L = [], C = vw.slice(); if (bad === 0) C[1] = -C[1];
    L.push({ html: "v × w = " + vec(C), t: vw, v: C, err: "The middle component of v × w is v₃w₁ − v₁w₃ = " + neg(vw[1]) + "." });
    const tt = dot(u, C), j = [0, 1, 2].find(i => u[i] * C[i] !== 0), tv = bad === 1 ? tt - 2 * u[j] * C[j] : tt;
    L.push({ html: "u · (v × w) = " + neg(tv), t: tt, v: tv, err: "Sign slip in one product: (" + neg(u[j]) + ")(" + neg(C[j]) + ") = " + neg(u[j] * C[j]) + "." });
    const vt = Math.abs(tv), vv = bad === 2 ? (tv > 0 ? -tv : tv) : vt;
    L.push({ html: "Volume = " + neg(vv), t: vt, v: vv, err: "A volume can't be negative: take the absolute value, " + vt + "." });
    return L;
  });
};
CP.REV.triple = function () {
  let u, v; do { u = rv(-3, 3); v = rv(-3, 3); } while (parallel(u, v));
  const a = nz(-2, 2), b = nz(-2, 2), w = add(u.map(x => a * x), v.map(x => b * x)), off = j => { const x = w.slice(); x[j] += 1; return x; };
  return { task: "Which w lies in the same plane as u and v?", expr: "u = " + vec(u) + ", v = " + vec(v), cond: W => !isZero(W) && det3(u, v, W) === 0,
    correct: { html: vec(w), test: w }, wrong: [off(0), off(1), off(2), cross(u, v)].map(W => ({ html: vec(W), test: W })),
    whyOf: W => "u · (v × w) = " + neg(det3(u, v, W)) + ", not 0, so the three vectors make a box with volume.",
    walk: ["Three vectors lie in one plane when u · (v × w) = 0.", vec(w) + " = " + neg(a) + "u + " + neg(b) + "v, so it lies in their plane.", "The cross product u × v points straight out of that plane, so it never fits."] };
};
CP.CTX.triple = [
  function freight() {
    let u, v, w, T; do { u = [ri(2, 5), 0, 0]; v = [ri(0, 2), ri(2, 4), 0]; w = [0, ri(0, 2), ri(2, 3)]; T = Math.abs(dot(u, cross(v, w))); } while (!T);
    const p = pick([12, 15, 20]);
    return { k: "Finance", sid: "freight", task: "A slanted cargo bay has edges u = " + vec(u) + ", v = " + vec(v) + ", w = " + vec(w) + " in metres. Freight is billed at " + money(p, 0) + " per m³. What does a full bay cost?", expr: "|u · (v × w)| × " + p,
      correct: opt(money(T * p, 0), T * p), truthN: Math.abs(det3(u, v, w)) * p,
      wrong: [opt(money(len(u) * len(v) * len(w) * p, 0), len(u) * len(v) * len(w) * p, "Multiplying edge lengths only works for a box with right angles. The bay is slanted."),
              opt(money(T, 0), T, "That is the volume in m³. Multiply by " + money(p, 0) + "."), opt(money(len(cross(v, w)) * p, 0), len(cross(v, w)) * p, "That uses the area of one face. Dot with u to include the third edge.")],
      walk: ["v × w = " + vec(cross(v, w)) + ".", "u · (v × w) = " + T + " m³.", T + " × " + money(p, 0) + " = " + m_(money(T * p, 0)) + "."] };
  },
  function footing() {
    const a = pick([2, 3, 4]), b = pick([2, 3]), h = pick([1, 2]), s = pick([1, 2]), u = [a, 0, 0], v = [0, b, 0], w = [s, 0, h], V = a * b * h, price = pick([150, 180, 200]);
    return { k: "Home", sid: "footing", task: "A concrete footing leans: its edges are u = " + vec(u) + ", v = " + vec(v) + ", w = " + vec(w) + " m. Concrete costs " + money(price, 0) + " per m³. Cost?", expr: "|u · (v × w)|",
      correct: opt(money(V * price, 0), V * price), truthN: Math.abs(det3(u, v, w)) * price,
      wrong: [opt(money(a * b * len(w) * price, 0), a * b * len(w) * price, "That uses the slanted edge length. Volume uses the straight-up height, " + h + " m, which the triple product finds."),
              opt(money(V, 0), V, "That is the volume in m³. Multiply by the price."), opt(money(a * b * (h + s) * price, 0), a * b * (h + s) * price, "The lean doesn't add volume: a slanted box has the same volume as a straight one with the same height.")],
      walk: ["v × w = " + vec(cross(v, w)) + ".", "u · (v × w) = " + V + " m³.", "Cost: " + V + " × " + money(price, 0) + " = " + m_(money(V * price, 0)) + "."] };
  }
];

/* ======================= 2D LINES ======================= */
CP.G.lines2d = function (tier) {
  if (tier === 0) {
    let P, d; do { P = [ri(-5, 5), ri(-5, 5)]; d = [nz(-4, 4), nz(-4, 4)]; } while (gcd(d[0], d[1]) !== 1);
    const A = d[1], B = -d[0], C = -(A * P[0] + B * P[1]), o = (a, b, c, why) => ({ html: L2(a, b, c), l: [a, b, c], why });
    return { task: "Which scalar equation describes this line?", expr: "r = " + vec(P) + " + t" + vec(d), line2d: { P, d }, prose: true,
      correct: o(A, B, C), wrong: [o(d[0], d[1], -(d[0] * P[0] + d[1] * P[1]), "That uses the direction as the normal. The normal is at right angles to the direction: (" + neg(A) + ", " + neg(B) + ")."),
                                    o(A, B, -C, "Sign slip in C. Put the point in: " + neg(A) + "(" + neg(P[0]) + ") + " + neg(B) + "(" + neg(P[1]) + ") + C = 0."),
                                    o(d[1], d[0], -(d[1] * P[0] + d[0] * P[1]), "Swap the direction's components and change one sign: (" + neg(d[1]) + ", " + neg(-d[0]) + ")."), o(A, B, 0, "That line passes through the origin. Use the point to find C.")],
      walk: ["Direction " + vec(d) + " gives normal (" + neg(A) + ", " + neg(B) + "): swap and change one sign.", "So " + lin([{ c: A, s: "x" }, { c: B, s: "y" }]) + " + C = 0.", "Put in " + vec(P) + ": C = " + neg(C) + ". The line is " + m_(L2(A, B, C)) + "."] };
  }
  if (tier === 1) {
    let n1, n2; const X = [ri(-5, 5), ri(-5, 5)];
    do { n1 = [nz(-4, 4), nz(-4, 4)]; n2 = [nz(-4, 4), nz(-4, 4)]; } while (n1[0] * n2[1] - n1[1] * n2[0] === 0);
    const c1 = -(n1[0] * X[0] + n1[1] * X[1]), c2 = -(n2[0] * X[0] + n2[1] * X[1]), pts = [[X[1], X[0]], [-X[0], X[1]], [X[0] + n1[1], X[1] - n1[0]], [X[0], -X[1]]];
    return { task: "Where do these two lines cross?", expr: L2(n1[0], n1[1], c1) + "<br>" + L2(n2[0], n2[1], c2), sys2: [[n1[0], n1[1], c1], [n2[0], n2[1], c2]],
      correct: { html: vec(X), v: X }, wrong: pts.filter(p => p.join() !== X.join()).map(p => ({ html: vec(p), v: p, why: "Check it in both equations: line 1 gives " + neg(n1[0] * p[0] + n1[1] * p[1] + c1) + " and line 2 gives " + neg(n2[0] * p[0] + n2[1] * p[1] + c2) + ". Both must be 0." })),
      walk: ["Eliminate one variable: multiply the equations so the y terms match, then subtract.", "x = " + neg(X[0]) + ", and substituting back, y = " + neg(X[1]) + ".", "They cross at " + m_(vec(X)) + "."] };
  }
  let P, d, n, t0, X, C;
  do { P = [ri(-4, 4), ri(-4, 4)]; d = [nz(-3, 3), nz(-3, 3)]; n = [nz(-3, 3), nz(-3, 3)]; t0 = nz(-3, 3); X = [P[0] + t0 * d[0], P[1] + t0 * d[1]]; C = -(n[0] * X[0] + n[1] * X[1]); } while (n[0] * d[0] + n[1] * d[1] === 0);
  const Xm = [P[0] - t0 * d[0], P[1] - t0 * d[1]], X1 = [P[0] + (t0 + 1) * d[0], P[1] + (t0 + 1) * d[1]];
  return { task: "Where does the line x = " + lin([{ c: P[0], s: "" }, { c: d[0], s: "t" }]) + ", y = " + lin([{ c: P[1], s: "" }, { c: d[1], s: "t" }]) + " meet " + L2(n[0], n[1], C) + "?", expr: "parametric meets scalar", sys2: [[n[0], n[1], C]], onLine2: { P, d },
    correct: { html: vec(X), v: X }, wrong: [[Xm, "Sign slip in t: solving gives t = " + neg(t0) + "."], [P, "That is t = 0, the start of the line."], [X1, "That is t = " + neg(t0 + 1) + ". It is on the line but not on the other."], [[X[1], X[0]], "x and y swapped."]].filter(w => w[0].join() !== X.join()).map(([v, why]) => ({ html: vec(v), v, why })),
    walk: ["Substitute: " + neg(n[0]) + "(" + lin([{ c: P[0], s: "" }, { c: d[0], s: "t" }]) + ") + " + neg(n[1]) + "(" + lin([{ c: P[1], s: "" }, { c: d[1], s: "t" }]) + ") + " + neg(C) + " = 0.", "That gives t = " + neg(t0) + ".", "Point: " + m_(vec(X)) + "."] };
};
CP.SPOT.lines2d = function () {
  let P, d, n, t0, X, C;
  do { P = [ri(-4, 4), ri(-4, 4)]; d = [nz(-3, 3), nz(-3, 3)]; n = [nz(-3, 3), nz(-3, 3)]; t0 = nz(-3, 3); X = [P[0] + t0 * d[0], P[1] + t0 * d[1]]; C = -(n[0] * X[0] + n[1] * X[1]); } while (n[0] * d[0] + n[1] * d[1] === 0 || n[0] * P[0] + n[1] * P[1] + C === 0);
  const al = n[0] * P[0] + n[1] * P[1] + C, be = n[0] * d[0] + n[1] * d[1];
  return mkSpot(ask, "Where does r = " + vec(P) + " + t" + vec(d) + " meet " + L2(n[0], n[1], C) + "?", bad => {
    const L = [], bw = bad === 0 ? be - 2 * n[0] * d[0] : be;
    L.push({ html: "Substitute: " + lin([{ c: al, s: "" }, { c: bw, s: "t" }]) + " = 0", t: [al, be], v: [al, bw], err: "The t coefficient is n · d = " + neg(n[0] * d[0]) + " + " + neg(n[1] * d[1]) + " = " + neg(be) + "." });
    if (bw === 0) return L.concat([{ html: "?", t: 0, v: NaN }]);
    const tt = -al / bw, tv = bad === 1 ? al / bw : tt;
    L.push({ html: "t = " + rat(tv), t: tt, v: tv, err: "Move " + neg(al) + " across: t = " + neg(-al) + " ÷ " + neg(bw) + " = " + rat(tt) + "." });
    const Xt = [P[0] + tv * d[0], P[1] + tv * d[1]], Xw = bad === 2 ? [P[0] - tv * d[0], P[1] + tv * d[1]] : Xt;
    L.push({ html: "Point: " + pt(Xw), t: Xt, v: Xw, err: "Add t times the direction in both coordinates." });
    return L;
  });
};
CP.REV.lines2d = function () {
  let P, d; do { P = [ri(-5, 5), ri(-5, 5)]; d = [nz(-4, 4), nz(-4, 4)]; } while (gcd(d[0], d[1]) !== 1);
  const A = d[1], B = -d[0], C = -(A * P[0] + B * P[1]), on = Q => A * Q[0] + B * Q[1] + C === 0;
  const o = (Q, D) => ({ html: "r = " + vec(Q) + " + t" + vec(D), test: [Q, D] });
  const Q2 = [P[0] + 2 * d[0], P[1] + 2 * d[1]];
  return { task: "Which vector equation describes this line?", expr: L2(A, B, C), cond: T => (T[1][0] !== 0 || T[1][1] !== 0) && on(T[0]) && A * T[1][0] + B * T[1][1] === 0,
    correct: o(pick([P, Q2]), pick([d, d.map(x => -x), d.map(x => 2 * x)])), wrong: [o(P, [A, B]), o([P[0] + 1, P[1]], d), o(P, [d[1], d[0]]), o([P[1], P[0]], d)],
    whyOf: T => !on(T[0]) ? vec(T[0]) + " is not on the line: " + neg(A * T[0][0] + B * T[0][1] + C) + " ≠ 0." : "That direction is not along the line: its dot product with the normal (" + neg(A) + ", " + neg(B) + ") is " + neg(A * T[1][0] + B * T[1][1]) + ".",
    walk: ["The normal is (" + neg(A) + ", " + neg(B) + "). A direction along the line is at right angles to it: (" + neg(-B) + ", " + neg(A) + ").", "Find any point: " + vec(P) + " works.", "Any multiple of the direction, from any point on the line, works."] };
};
CP.CTX.lines2d = [
  function plans() {
    const r1 = pick([0.1, 0.15, 0.2]), r2 = +(r1 - pick([0.05, 0.1])).toFixed(2), m = pick([100, 200, 300, 400]), F1 = pick([20, 25, 30]), F2 = +(F1 + (r1 - r2) * m).toFixed(2);
    if (r2 <= 0) return null;
    return { k: "Finance", sid: "plans", task: "Plan A: " + money(F1, 0) + " a month + " + money(r1) + " a minute. Plan B: " + money(F2, 0) + " + " + money(r2) + " a minute. At how many minutes do they cost the same?", expr: F1 + " + " + r1 + "m = " + F2 + " + " + r2 + "m",
      correct: opt(m + " minutes", m), truthN: (F2 - F1) / (r1 - r2),
      wrong: [opt(Math.round((F2 - F1) / r1) + " minutes", (F2 - F1) / r1, "Divide the fee gap by the difference in rates, " + fN(r1 - r2, 2) + "."), opt(Math.round(F2 / r2) + " minutes", F2 / r2, "Set the two costs equal and solve."),
              opt(Math.round((F2 + F1) / (r1 - r2)) + " minutes", (F2 + F1) / (r1 - r2), "Subtract the fees: " + F2 + " − " + F1 + ".")],
      walk: ["Set equal: " + F1 + " + " + r1 + "m = " + F2 + " + " + r2 + "m.", fN(r1 - r2, 2) + "m = " + fN(F2 - F1, 2) + ".", "m = " + m_(m + " minutes") + ". Above that, plan B is cheaper."] };
  },
  function trails() {
    let n1, n2; const X = [ri(1, 9), ri(1, 9)];
    do { n1 = [nz(-3, 3), nz(-3, 3)]; n2 = [nz(-3, 3), nz(-3, 3)]; } while (n1[0] * n2[1] - n1[1] * n2[0] === 0);
    const c1 = n1[0] * X[0] + n1[1] * X[1], c2 = n2[0] * X[0] + n2[1] * X[1];
    return { k: "Sport", sid: "trails", task: "Two straight ski trails on a park map follow " + lin([{ c: n1[0], s: "x" }, { c: n1[1], s: "y" }]) + " = " + neg(c1) + " and " + lin([{ c: n2[0], s: "x" }, { c: n2[1], s: "y" }]) + " = " + neg(c2) + " (km). Where do they cross?", expr: "solve both", sys2: [[n1[0], n1[1], -c1], [n2[0], n2[1], -c2]],
      correct: { html: vec(X) + " km", v: X }, wrong: [[X[1], X[0]], [X[0] + 1, X[1]], [X[0], X[1] + 1]].filter(p => p.join() !== X.join()).map(p => ({ html: vec(p) + " km", v: p, why: "It fails at least one equation: " + neg(n1[0] * p[0] + n1[1] * p[1]) + " and " + neg(n2[0] * p[0] + n2[1] * p[1]) + "." })),
      walk: ["Eliminate one variable between the two equations.", "x = " + X[0] + ", y = " + X[1] + ".", "They cross at " + m_(vec(X) + " km") + "."] };
  }
];

/* ======================= PLANE FORMS ======================= */
CP.G.planeforms = function (tier) {
  if (tier === 0) {
    let P, u, v, n; do { P = rv(-3, 3); u = rv(-2, 2); v = rv(-2, 2); n = redV(cross(u, v)); } while (isZero(n) || parallel(u, v));
    const d = dot(n, P), pl = (m, e, why) => ({ html: eqn(m, e), pl: m.concat([e]), why });
    const s2 = redV([n[0], -n[1], n[2]]), uv = add(u, v);
    return { task: "Which scalar equation is this plane?", expr: "r = " + vec(P) + " + s" + vec(u) + " + t" + vec(v), plane: { pts: [P, add(P, u), add(P, v)] }, prose: true,
      correct: pl(n, d), wrong: [pl(n, -d, "Sign slip: d = n · P = " + neg(d) + "."), parallel(s2, n) ? null : pl(s2, dot(s2, P), "Middle component of u × v has the wrong sign."), parallel(uv, n) || isZero(uv) ? null : pl(uv, dot(uv, P), "u + v lies in the plane. The normal is u × v."), pl(n, 0, "That plane passes through the origin. Use P to find d.")].filter(Boolean),
      walk: ["Normal: u × v = " + vec(cross(u, v)) + (cross(u, v).join() !== n.join() ? ", or " + vec(n) : "") + ".", "d = n · P = " + neg(d) + ".", "So " + m_(eqn(n, d)) + "."] };
  }
  if (tier === 1) {
    let n; do { n = rv(-3, 3); } while (n.filter(Boolean).length < 3);
    const P = rv(-2, 2), d = dot(n, P);
    const u = redV(cross(n, [1, 0, 0])), v = redV(cross(n, [0, 1, 0]));
    const o = (Q, a, b, why) => ({ html: "r = " + vec(Q) + " + s" + vec(a) + " + t" + vec(b), vf: [Q, a, b], why });
    return { task: "Which vector equation is this plane?", expr: eqn(n, d), vecForm: { n, d }, prose: true,
      correct: o(P, u, v), wrong: [o(P, n, u, "The normal points out of the plane. Both directions must be at right angles to it."), o(add(P, [1, 0, 0]), u, v, vec(add(P, [1, 0, 0])) + " is not on the plane."), o(P, u, u.map(x => 2 * x), "The two directions are parallel: that only describes a line.")],
      walk: ["Find a point: " + vec(P) + " satisfies the equation.", "Find two directions at right angles to n = " + vec(n) + ": n × i and n × j work.", "r = " + vec(P) + " + s" + vec(u) + " + t" + vec(v) + "."] };
  }
  let n1, n2; do { n1 = rv(-3, 3); n2 = rv(-3, 3); } while (parallel(n1, n2));
  const D = redV(cross(n1, n2)), slip = redV([D[0], -D[1], D[2]]);
  return { task: "Two planes meet in a line. Which is a direction vector for that line?", expr: eqn(n1, ri(-6, 6)) + "<br>" + eqn(n2, ri(-6, 6)), normalOf: D,
    correct: { html: vec(D), v: D }, wrong: [[n1, "That is the first plane's normal, at right angles to the line."], [n2, "That is the second plane's normal."], [add(n1, n2), "Adding normals gives another normal-ish direction, not one along both planes."], [slip, "Middle component of n₁ × n₂ has the wrong sign."]]
      .filter(([v]) => !isZero(v) && !parallel(v, D)).map(([v, why]) => ({ html: vec(v), v, why })),
    walk: ["The line lies in both planes, so it is at right angles to both normals.", "n₁ × n₂ = " + vec(cross(n1, n2)) + ".", "Any multiple works, such as " + m_(vec(D)) + "."] };
};
CP.SPOT.planeforms = function () {
  let P, u, v, n; do { P = rv(-3, 3); u = rv(-2, 2); v = rv(-2, 2); n = cross(u, v); } while (isZero(n) || n[1] === 0 || dot(n, P) === 0);
  return mkSpot(ask, "Write r = " + vec(P) + " + s" + vec(u) + " + t" + vec(v) + " as a scalar equation.", bad => {
    const L = [], N = n.slice(); if (bad === 0) N[1] = -N[1];
    L.push({ html: "n = u × v = " + vec(N), t: n, v: N, err: "The middle component of u × v is u₃v₁ − u₁v₃ = " + neg(n[1]) + "." });
    const dt = dot(N, P), dv = bad === 1 ? -dt : dt;
    L.push({ html: "d = n · P = " + neg(dv), t: dt, v: dv, err: "Sign slip: n · P = " + N.map((x, i) => "(" + neg(x) + ")(" + neg(P[i]) + ")").join(" + ") + " = " + neg(dt) + "." });
    const Q = add(P, u), ct = dot(N, Q), cv = bad === 2 ? ct + 1 : ct;
    L.push({ html: "Check with P + u = " + vec(Q) + ": n · (P + u) = " + neg(cv), t: ct, v: cv, err: "Recompute: " + N.map((x, i) => "(" + neg(x) + ")(" + neg(Q[i]) + ")").join(" + ") + " = " + neg(ct) + "." });
    return L;
  });
};
CP.REV.planeforms = function () {
  let n; do { n = rv(-3, 3); } while (n.filter(Boolean).length < 2);
  const d = ri(-8, 8), good = redV(cross(n, rv(-2, 2)));
  if (isZero(good)) return null;
  const o = v => ({ html: vec(v), test: v });
  return { task: "Which direction lies in this plane?", expr: eqn(n, d), cond: v => !isZero(v) && dot(v, n) === 0,
    correct: o(good), wrong: [o(n), o(add(good, [1, 0, 0])), o(add(good, [0, 0, 1])), o(n.map(x => 2 * x))],
    whyOf: v => "Its dot product with the normal " + vec(n) + " is " + neg(dot(v, n)) + ", not 0, so it points out of the plane.",
    walk: ["A direction in the plane is at right angles to the normal " + vec(n) + ".", "Check: " + vec(good) + " · " + vec(n) + " = 0."] };
};
CP.CTX.planeforms = [
  function basket() {
    const pr = pick([[4, 6, 2], [3, 6, 2], [6, 4, 2], [5, 10, 5]]), T = pr[2] * pick([20, 30, 40]), z0 = T / pr[2];
    const u = [1, 0, -pr[0] / pr[2]], v = [0, 1, -pr[1] / pr[2]], s = ri(1, 5), t = ri(1, 4), X = [s, t, z0 + s * u[2] + t * v[2]];
    if (X[2] < 0 || !Number.isInteger(u[2]) || !Number.isInteger(v[2])) return null;
    return { k: "Finance", sid: "basket", task: "Items cost " + pr.map(p => money(p, 0)).join(", ") + ". Every basket costing exactly " + money(T, 0) + " is r = (0, 0, " + z0 + ") + s" + vec(u) + " + t" + vec(v) + ". Which basket is s = " + s + ", t = " + t + "?", expr: pr[0] + "x + " + pr[1] + "y + " + pr[2] + "z = " + T,
      correct: { html: vec(X), v: X }, truthV: [s, t, (T - pr[0] * s - pr[1] * t) / pr[2]],
      wrong: [{ html: vec([s, t, z0]), v: [s, t, z0], why: "You didn't move the third item: each swap takes some away." }, { html: vec([t, s, z0 + t * u[2] + s * v[2]]), v: [t, s, z0 + t * u[2] + s * v[2]], why: "s goes with the first direction." },
              { html: vec([s, t, z0 - s - t]), v: [s, t, z0 - s - t], why: "Each swap trades a different number of the third item: " + neg(-u[2]) + " and " + neg(-v[2]) + "." }],
      walk: ["(0, 0, " + z0 + ") + " + s + vec(u) + " + " + t + vec(v) + ".", "= " + m_(vec(X)) + ".", "Check: " + pr[0] + "(" + X[0] + ") + " + pr[1] + "(" + X[1] + ") + " + pr[2] + "(" + X[2] + ") = " + T + "."] };
  },
  function slope() {
    let P, u, v, n; do { P = [ri(0, 5), ri(0, 5), ri(10, 30)]; u = [1, 0, -nz(1, 2)]; v = [0, 1, -ri(0, 2)]; n = redV(cross(u, v)); } while (isZero(n));
    const d = dot(n, P), pl = (m, e, why) => ({ html: eqn(m, e), pl: m.concat([e]), why });
    return { k: "Sport", sid: "slope", task: "A ski slope passes through the lift top P = " + vec(P) + " with directions u = " + vec(u) + " and v = " + vec(v) + " (m). Which scalar equation is the slope?", expr: "r = P + su + tv", plane: { pts: [P, add(P, u), add(P, v)] }, prose: true,
      correct: pl(n, d), wrong: [pl(n, -d, "Sign slip in d = n · P."), pl(u, dot(u, P), "u lies in the slope; it can't be the normal."), pl(n, d + 1, "Right normal, but P doesn't satisfy it.")],
      walk: ["n = u × v = " + vec(cross(u, v)) + ".", "d = n · P = " + d + ".", m_(eqn(n, d)) + "."] };
  }
];

/* ======================= PLANES MEETING ======================= */
const PC_LAB = { line: "They meet in a line", par: "Parallel, never meeting", same: "They are the same plane", point: "They meet at one point" };
CP.G.planesys = function (tier) {
  if (tier === 0) {
    const n1 = rv(-3, 3), d1 = ri(-6, 6), cs = pick(["line", "par", "same"]), k = pick([2, -1, 3]);
    let n2, d2;
    if (cs === "line") { do { n2 = rv(-3, 3); } while (parallel(n1, n2)); d2 = ri(-6, 6); } else { n2 = n1.map(x => k * x); d2 = cs === "same" ? k * d1 : k * d1 + nz(-4, 4); }
    const why = { line: "The normals are not parallel, so the planes must cross.", par: parallel(n1, n2) ? "The normals are parallel, but the equations are not multiples of each other." : "The normals are not parallel: the planes cross in a line.", same: parallel(n1, n2) ? "Multiply the first equation by " + k + ": does it match the second exactly, including d?" : "The normals are not parallel.", point: "Two planes can never meet at just one point: they are infinite sheets." };
    return { task: "How do these two planes meet?", expr: eqn(n1, d1) + "<br>" + eqn(n2, d2), planes: [[...n1, d1], [...n2, d2]], prose: true,
      correct: { html: PC_LAB[cs], cs }, wrong: ["line", "par", "same", "point"].filter(c => c !== cs).map(c => ({ html: PC_LAB[c], cs: c, why: why[c] })),
      walk: ["Compare normals: " + vec(n1) + " and " + vec(n2) + (parallel(n1, n2) ? " are parallel." : " are not parallel."), parallel(n1, n2) ? "Parallel planes are either the same plane or never meet. Compare the equations scaled by " + k + "." : "Non-parallel planes always cross in a line.", "Answer: " + m_(PC_LAB[cs].toLowerCase()) + "."] };
  }
  if (tier === 1) {
    let N; do { N = [rv(-2, 2), rv(-2, 2), rv(-2, 2)]; } while (det3(...N) === 0);
    const X = rv(-4, 4), D = N.map(n => dot(n, X)), off = cross(N[0], N[1]);
    const cands = [[add(X, off), "It satisfies the first two equations but not the third."], [[X[1], X[0], X[2]], "x and y are swapped."], [X.map(x => -x), "Signs flipped."], [add(X, [0, 0, 1]), "z is off by one."]];
    return { task: "Where do these three planes meet?", expr: N.map((n, i) => eqn(n, D[i])).join("<br>"), sys: N.map((n, i) => [...n, D[i]]),
      correct: { html: vec(X), v: X }, wrong: cands.filter(([p]) => p.join() !== X.join()).map(([v, why]) => ({ html: vec(v), v, why })),
      walk: ["Eliminate one variable from two pairs of equations.", "Solve the two-variable system that is left, then substitute back.", "The planes meet at " + m_(vec(X)) + ". Check it in all three."] };
  }
  const n1 = rv(-3, 3); let n2; do { n2 = rv(-3, 3); } while (parallel(n1, n2));
  const d1 = ri(-5, 5), d2 = ri(-5, 5), cs = pick(["point", "line", "none", "none2"]);
  let n3, d3;
  if (cs === "point") { do { n3 = rv(-3, 3); } while (det3(n1, n2, n3) === 0); d3 = ri(-5, 5); }
  else if (cs === "line") { const a = nz(-2, 2), b = nz(-2, 2); n3 = add(n1.map(x => a * x), n2.map(x => b * x)); d3 = a * d1 + b * d2; }
  else if (cs === "none") { const a = nz(-2, 2), b = nz(-2, 2); n3 = add(n1.map(x => a * x), n2.map(x => b * x)); d3 = a * d1 + b * d2 + nz(-3, 3); }
  else { n3 = n1.map(x => 2 * x); d3 = 2 * d1 + nz(-3, 3); }
  if (isZero(n3)) return null;
  const C3 = { point: "One point", line: "A whole line of points", none: "No common point" }, key = cs === "none2" ? "none" : cs;
  return { task: "Do these three planes share any points?", expr: [[n1, d1], [n2, d2], [n3, d3]].map(([n, d]) => eqn(n, d)).join("<br>"), planes3: [[...n1, d1], [...n2, d2], [...n3, d3]], prose: true,
    correct: { html: C3[key], cs: key }, wrong: Object.keys(C3).filter(c => c !== key).map(c => ({ html: C3[c], cs: c, why: { point: "The third normal is a combination of the other two (or parallel to one), so the system can't pin down a single point.", line: "Eliminating gives a contradiction like 0 = " + neg(nz(1, 5)) + ", or else a single solution; check the constants.", none: key === "point" ? "The normals are independent, so there is exactly one solution." : "Eliminating gives 0 = 0: every point on the line of the first two works." }[c] })).concat([{ html: "Every point: they are one plane", cs: "same", why: "The first two planes are not parallel, so they can't be one plane." }]),
    walk: ["Check whether the third normal is a combination of the first two: " + (key === "point" ? "it isn't, so there is one point." : "it is."), key === "point" ? "Independent normals give a single solution." : key === "line" ? "The third equation is the same combination of the first two, constants included: 0 = 0, a line of solutions." : "The constants don't follow the same combination: 0 = nonzero, no solutions.", "Answer: " + m_(C3[key].toLowerCase()) + "."] };
};
CP.SPOT.planesys = function () {
  const X = [ri(-4, 4), ri(-4, 4), ri(-4, 4)], s = X[0] + X[1] + X[2], t = X[0] - X[1] + X[2], u = X[0] + X[1] - X[2];
  if (X[1] === 0 || X[2] === 0) return null;
  return mkSpot(ask, "x + y + z = " + neg(s) + " (1)<br>x − y + z = " + neg(t) + " (2)<br>x + y − z = " + neg(u) + " (3)", bad => {
    const L = [], yt = (s - t) / 2, yv = bad === 0 ? (t - s) / 2 : yt;
    L.push({ html: "(1) − (2): 2y = " + neg(s - t) + ", so y = " + rat(yv), t: yt, v: yv, err: "(1) − (2) = " + neg(s) + " − (" + neg(t) + ") = " + neg(s - t) + ", so y = " + rat(yt) + "." });
    const zt = (s - u) / 2, zv = bad === 1 ? (u - s) / 2 : zt;
    L.push({ html: "(1) − (3): 2z = " + neg(s - u) + ", so z = " + rat(zv), t: zt, v: zv, err: "(1) − (3) = " + neg(s) + " − (" + neg(u) + ") = " + neg(s - u) + ", so z = " + rat(zt) + "." });
    const xt = s - yv - zv, xv = bad === 2 ? s + yv + zv : xt;
    L.push({ html: "x = " + neg(s) + " − y − z = " + rat(xv), t: xt, v: xv, err: "Subtract y and z: " + neg(s) + " − (" + rat(yv) + ") − (" + rat(zv) + ") = " + rat(xt) + "." });
    const ct = xv - yv + zv, cv = bad === 3 ? ct + 2 : ct;
    L.push({ html: "Check in (2): x − y + z = " + rat(cv), t: ct, v: cv, err: "Recompute: " + rat(xv) + " − (" + rat(yv) + ") + (" + rat(zv) + ") = " + rat(ct) + "." });
    return L;
  });
};
CP.REV.planesys = function () {
  let n1, n2; do { n1 = rv(-3, 3); n2 = rv(-3, 3); } while (parallel(n1, n2));
  const X = rv(-3, 3), d1 = dot(n1, X), d2 = dot(n2, X), Dv = redV(cross(n1, n2)), sc = pick([1, -1, 2]), Y = add(X, Dv.map(x => sc * x));
  const onBoth = p => dot(n1, p) === d1 && dot(n2, p) === d2, o = p => ({ html: vec(p), test: p });
  return { task: "These planes meet in a line. Which point is on it?", expr: eqn(n1, d1) + "<br>" + eqn(n2, d2), cond: onBoth,
    correct: o(pick([X, Y])), wrong: [o(add(X, [1, 0, 0])), o(add(X, n1)), o(add(X, [0, 1, 0])), o(X.map(x => -x))],
    whyOf: p => "Plane 1 gives " + neg(dot(n1, p)) + " (needs " + neg(d1) + "), plane 2 gives " + neg(dot(n2, p)) + " (needs " + neg(d2) + "). It must satisfy both.",
    walk: ["A point on the line satisfies both equations.", "Put each option into both. Only one passes both."] };
};
CP.CTX.planesys = [
  function funds() {
    const z = pick([2000, 4000, 5000, 6000, 8000]), y = pick([3000, 5000, 6000, 9000]), x = 2 * z, T = x + y + z, I = 0.02 * x + 0.04 * y + 0.06 * z;
    const sys = [[1, 1, 1, T], [0.02, 0.04, 0.06, I], [1, 0, -2, 0]], f = v => vec(v.map(a => money(a, 0)).map(s => s));
    const ff = v => "A " + money(v[0], 0) + ", B " + money(v[1], 0) + ", C " + money(v[2], 0);
    return { k: "Finance", sid: "funds", task: "Split " + money(T, 0) + " among funds paying 2%, 4% and 6% to earn " + money(I, 0) + " a year, with twice as much in A as in C. How much in each?", expr: "x + y + z = " + T + "<br>0.02x + 0.04y + 0.06z = " + I + "<br>x = 2z", sysF: sys, prose: true,
      correct: { html: ff([x, y, z]), v: [x, y, z] }, wrong: [[[T / 3, T / 3, T / 3], "Equal thirds earn " + money(0.04 * T, 0) + " and break the A = 2C rule."], [[z, y, x], "A and C are swapped: A should be twice C."], [[x, y + 1000, z - 1000], "That breaks A = 2C."], [[x + 1000, y - 1000, z], "That breaks A = 2C."]]
        .filter(([v]) => v.join() !== [x, y, z].join()).map(([v, why]) => ({ html: ff(v), v, why })),
      walk: ["Substitute x = 2z: 3z + y = " + T + " and 0.1z + 0.04y = " + I + ".", "From the first, y = " + T + " − 3z. Then 0.1z + 0.04(" + T + " − 3z) = " + I + ".", "z = " + z + ", x = " + x + ", y = " + y + "."] };
  },
  function meals() {
    const X = [ri(1, 4), ri(1, 4), ri(1, 4)], N = [[20, 10, 5], [30, 40, 10], [5, 10, 20]], D = N.map(n => dot(n, X));
    return { k: "Health", sid: "meals", task: "Three foods give (protein, carbs, fat) of A (20, 30, 5), B (10, 40, 10) and C (5, 10, 20) grams per serving. How many servings of each give exactly " + D.join(", ") + " g?", expr: "20a + 10b + 5c = " + D[0] + "<br>30a + 40b + 10c = " + D[1] + "<br>5a + 10b + 20c = " + D[2],
      sys: [[20, 10, 5, D[0]], [30, 40, 10, D[1]], [5, 10, 20, D[2]]], correct: { html: "A " + X[0] + ", B " + X[1] + ", C " + X[2], v: X },
      wrong: [[X[1], X[0], X[2]], [X[0], X[1], X[2] + 1], [X[2], X[1], X[0]], [X[0] + 1, X[1], X[2]]].filter(v => v.join() !== X.join()).map(v => ({ html: "A " + v[0] + ", B " + v[1] + ", C " + v[2], v, why: "Check the totals: (" + N.map(n => dot(n, v)).join(", ") + ") g, not (" + D.join(", ") + ")." })),
      walk: ["Each nutrient is one plane in (a, b, c).", "Eliminate to solve: a = " + X[0] + ", b = " + X[1] + ", c = " + X[2] + ".", "Check: " + D.join(", ") + " g."] };
  }
];

/* ======================= LINES IN 3D ======================= */
const LC_LAB = { meet: "They meet at one point", par: "Parallel, never meeting", skew: "Skew: not parallel, never meeting", same: "They are the same line" };
function lineCase(P, d1, Q, d2) {
  if (parallel(d1, d2)) return isZero(cross(sub(Q, P), d1)) ? "same" : "par";
  return dot(sub(Q, P), cross(d1, d2)) === 0 ? "meet" : "skew";
}
CP.h.lineCase = lineCase;
CP.G.skew = function (tier) {
  if (tier === 0) {
    const cs = pick(["meet", "par", "skew"]), P = rv(-3, 3), d1 = rv(-2, 2);
    let d2, Q;
    if (cs === "par") { d2 = d1.map(x => pick([2, -1, 3]) * x); do { Q = rv(-3, 3); } while (isZero(cross(sub(Q, P), d1))); }
    else { do { d2 = rv(-2, 2); } while (parallel(d1, d2)); const X = add(P, d1.map(x => nz(-2, 2) * x)); Q = sub(X, d2.map(x => nz(-2, 2) * x)); if (cs === "skew") { const n = cross(d1, d2); Q = add(Q, redV(n)); } }
    if (lineCase(P, d1, Q, d2) !== cs) return null;
    const why = { meet: "Setting them equal gives no solution: the third coordinate never agrees.", par: parallel(d1, d2) ? "The directions are parallel, but one line's point is not on the other." : "The directions are not parallel.", skew: parallel(d1, d2) ? "Parallel directions can't be skew." : "Solve two coordinates for s and t, then check the third: it works.", same: "Same line needs parallel directions and a shared point." };
    return { task: "How are these two lines related?", expr: "r = " + vec(P) + " + t" + vec(d1) + "<br>r = " + vec(Q) + " + s" + vec(d2), lines: [P, d1, Q, d2], prose: true,
      correct: { html: LC_LAB[cs], cs }, wrong: Object.keys(LC_LAB).filter(c => c !== cs).map(c => ({ html: LC_LAB[c], cs: c, why: why[c] })),
      walk: ["Directions " + vec(d1) + " and " + vec(d2) + (parallel(d1, d2) ? " are parallel." : " are not parallel."), parallel(d1, d2) ? "Is " + vec(Q) + " on the first line? No, so they never meet." : "Set the lines equal and solve two coordinates for t and s; check the third.", "Answer: " + m_(LC_LAB[cs].toLowerCase()) + "."] };
  }
  if (tier === 1) {
    const P = rv(-3, 3), d1 = rv(-2, 2); let d2; do { d2 = rv(-2, 2); } while (parallel(d1, d2));
    const t0 = nz(-2, 2), s0 = nz(-2, 2), X = add(P, d1.map(x => t0 * x)), Q = sub(X, d2.map(x => s0 * x));
    const W = [[P, "That is the first line's starting point. The second line doesn't pass through it."], [Q, "That is the second line's starting point."], [add(X, d1), "It is on the first line but not the second."], [sub(X, d1), "It is on the first line but not the second."]];
    return { task: "Where do these lines meet?", expr: "r = " + vec(P) + " + t" + vec(d1) + "<br>r = " + vec(Q) + " + s" + vec(d2), onBoth: [P, d1, Q, d2],
      correct: { html: vec(X), v: X }, wrong: W.filter(([v]) => v.join() !== X.join()).map(([v, why]) => ({ html: vec(v), v, why })),
      walk: ["Set them equal: " + vec(P) + " + t" + vec(d1) + " = " + vec(Q) + " + s" + vec(d2) + ".", "Solving two coordinates gives t = " + neg(t0) + ", s = " + neg(s0) + "; the third coordinate agrees.", "Point: " + m_(vec(X)) + "."] };
  }
  let d1, d2, n, L; do { d1 = rv(-2, 2); d2 = rv(-2, 2); n = cross(d1, d2); L = Math.sqrt(dot(n, n)); } while (isZero(n) || !Number.isInteger(L));
  let P, Q, top; do { P = rv(-3, 3); Q = rv(-3, 3); top = Math.abs(dot(sub(Q, P), n)); } while (top === 0);
  /* independent check: the closest approach by minimizing |P + t d1 − Q − s d2|² */
  const w0 = sub(P, Q), a = dot(d1, d1), b = dot(d1, d2), c = dot(d2, d2), dd = dot(d1, w0), e = dot(d2, w0), den = a * c - b * b;
  const tc = (b * e - c * dd) / den, sc = (a * e - b * dd) / den, gap = len(sub(add(P, d1.map(x => tc * x)), add(Q, d2.map(x => sc * x))));
  return { task: "How far apart are these skew lines at their closest?", expr: "r = " + vec(P) + " + t" + vec(d1) + "<br>r = " + vec(Q) + " + s" + vec(d2),
    correct: opt(rat(top / L), top / L), truthN: gap,
    wrong: [opt(String(top), top, "You forgot to divide by |d₁ × d₂| = " + L + "."), opt(rat(top / (L * L)), top / (L * L), "Divide by |d₁ × d₂| = " + L + ", not its square."),
            opt(fN(len(sub(Q, P)), 2), len(sub(Q, P)), "That is the distance between the two starting points. The closest approach is along d₁ × d₂.")],
    walk: ["d₁ × d₂ = " + vec(n) + ", length " + L + ".", "(Q − P) · (d₁ × d₂) = " + neg(dot(sub(Q, P), n)) + ".", "Distance = " + top + " ÷ " + L + " = " + m_(rat(top / L)) + "."] };
};
CP.SPOT.skew = function () {
  let d1, d2, n, L; do { d1 = rv(-2, 2); d2 = rv(-2, 2); n = cross(d1, d2); L = Math.sqrt(dot(n, n)); } while (isZero(n) || !Number.isInteger(L) || n[1] === 0);
  let P, Q, w; do { P = rv(-3, 3); Q = rv(-3, 3); w = sub(Q, P); } while (dot(w, n) === 0 || w[0] === 0 || P[0] === 0);
  return mkSpot(ask, "Distance between r = " + vec(P) + " + t" + vec(d1) + " and r = " + vec(Q) + " + s" + vec(d2), bad => {
    const Ls = [], N = n.slice(); if (bad === 0) N[1] = -N[1];
    Ls.push({ html: "d₁ × d₂ = " + vec(N), t: n, v: N, err: "Middle component: d₁₃d₂₁ − d₁₁d₂₃ = " + neg(n[1]) + "." });
    const W = w.slice(); if (bad === 1) W[0] = Q[0] + P[0];
    Ls.push({ html: "Q − P = " + vec(W), t: w, v: W, err: "Sign slip: " + neg(Q[0]) + " − (" + neg(P[0]) + ") = " + neg(w[0]) + "." });
    const dt = dot(W, N), j = [0, 1, 2].find(i => W[i] * N[i] !== 0), dv = bad === 2 ? (j === undefined ? dt + 1 : dt - 2 * W[j] * N[j]) : dt;
    Ls.push({ html: "(Q − P) · (d₁ × d₂) = " + neg(dv), t: dt, v: dv, err: "Recompute: " + W.map((x, i) => "(" + neg(x) + ")(" + neg(N[i]) + ")").join(" + ") + " = " + neg(dt) + "." });
    const LN = len(N), gt = Math.abs(dv) / LN, gv = bad === 3 ? Math.abs(dv) / (LN * LN) : gt;
    Ls.push({ html: "Distance = " + Math.abs(dv) + " ÷ " + (bad === 3 ? "|d₁ × d₂|²" : "|d₁ × d₂|") + " = " + rat(gv), t: gt, v: gv, err: "Divide by |d₁ × d₂| = " + rat(LN) + ", not its square." });
    return Ls;
  });
};
CP.REV.skew = function () {
  const P = rv(-3, 3), d = rv(-2, 2);
  let e; do { e = rv(-2, 2); } while (parallel(d, e));
  const X = add(P, d.map(x => 2 * x)), Qm = sub(X, e), Qs = add(Qm, redV(cross(d, e))), Qp = add(P, [1, 0, 0]);
  const o = (Q, f) => ({ html: "r = " + vec(Q) + " + s" + vec(f), test: [Q, f] });
  return { task: "Which line is skew to r = " + vec(P) + " + t" + vec(d) + "?", expr: "skew: not parallel and never meeting", prose: true, cond: T => lineCase(P, d, T[0], T[1]) === "skew",
    correct: o(Qs, e), wrong: [o(Qm, e), isZero(cross(sub(Qp, P), d)) ? null : o(Qp, d.map(x => 2 * x)), o(X, e), o(P, d.map(x => -x))].filter(Boolean),
    whyOf: T => ({ meet: "It meets the line: solving gives a point both share.", par: "Its direction is parallel to " + vec(d) + ", so it is parallel, not skew.", same: "It is the same line, described differently." })[lineCase(P, d, T[0], T[1])] || "",
    walk: ["Skew needs two things: directions not parallel, and no shared point.", "For a line through Q with direction f: check f is not parallel to " + vec(d) + ", then check (Q − P) · (d × f) ≠ 0."] };
};
CP.CTX.skew = [
  function corridors() {
    const z1 = pick([80, 100, 120]), dz = pick([15, 20, 25, 30, 40]), y2 = pick([30, 50, 70]), P = [0, 0, z1], Q = [0, y2, z1 + dz], d1 = [1, 0, 0], d2 = [0, 1, 0];
    const w0 = sub(P, Q), a = 1, b = 0, c = 1, dd = dot(d1, w0), e = dot(d2, w0), tc = (b * e - c * dd) / (a * c - b * b), sc = (a * e - b * dd) / (a * c - b * b);
    return { k: "Science", sid: "corridors", task: "Drone corridors: r₁ = " + vec(P) + " + t(1, 0, 0) and r₂ = " + vec(Q) + " + s(0, 1, 0), in metres. How close do they come?", expr: "|(Q − P) · (d₁ × d₂)| ÷ |d₁ × d₂|",
      correct: opt(dz + " m", dz), truthN: len(sub(add(P, d1.map(x => tc * x)), add(Q, d2.map(x => sc * x)))),
      wrong: [opt(fN(Math.hypot(y2, dz), 1) + " m", Math.hypot(y2, dz), "That is the distance between the starting points. The closest approach is along d₁ × d₂ = (0, 0, 1)."), opt(y2 + " m", y2, "That is the sideways offset of the starting points."),
              opt((y2 + dz) + " m", y2 + dz, "Distances don't add like that. Project Q − P onto d₁ × d₂.")],
      walk: ["d₁ × d₂ = (0, 0, 1).", "Q − P = (0, " + y2 + ", " + dz + ").", "Distance = |" + dz + "| ÷ 1 = " + m_(dz + " m") + "."] };
  },
  function glidepaths() {
    const P = [80, 15, 5], d1 = [-2, 1, 1], cs = pick(["meet", "skew"]);
    const d2 = [-1, 2, -1], X = add(P, d1.map(x => 10 * x)), Q0 = sub(X, d2.map(x => 5 * x)), Q = cs === "meet" ? Q0 : add(Q0, [1, 1, 1]);
    if (lineCase(P, d1, Q, d2) !== cs) return null;
    const LAB = { meet: "Yes: at one mix, " + vec(X), skew: "No: the paths are skew and never share a mix", par: "No: the paths are parallel" };
    return { k: "Finance", sid: "glide2", task: "Fund 1 moves its (stocks, bonds, cash) mix along r = " + vec(P) + " + t" + vec(d1) + ". Fund 2 moves along r = " + vec(Q) + " + s" + vec(d2) + ". Do they ever hold exactly the same mix?", expr: "same mix ⇔ the lines meet", lines: [P, d1, Q, d2], prose: true,
      correct: { html: LAB[cs], cs }, wrong: Object.keys(LAB).filter(c => c !== cs).map(c => ({ html: LAB[c], cs: c, why: c === "par" ? "The directions " + vec(d1) + " and " + vec(d2) + " are not parallel." : c === "meet" ? "Solving two coordinates for t and s, the third doesn't agree: no shared mix." : "Solving gives t = 10, s = 5, and all three coordinates agree." })).concat([{ html: "Yes, at every point", cs: "same", why: "That would need parallel directions." }]),
      walk: ["Directions are not parallel, so the paths meet or are skew.", "Set them equal and solve two coordinates for t and s, then check the third.", cs === "meet" ? "t = 10, s = 5 works in all three: they share " + vec(X) + "." : "The third coordinate disagrees: skew, no shared mix."] };
  }
];
})();
