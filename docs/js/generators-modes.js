/* Chalk and Paper – the Expert and Master tiers
   Two new kinds of question for every step:
   - Spot the error: a worked solution with one wrong line. Every line is a claim (written value v,
     true value t, given the lines above it). Exactly one line has v ≠ t. Later lines follow on
     correctly from whatever was written, as a real student's work would.
   - Work backwards: the answer is given; find what produced it. cond(test) is true only for the right option.
   Then the dispatcher: tiers 0–2 are forward problems; 3 (Expert) and 4 (Master) mix all three. */

window.CP = window.CP || {};
(function () {
const H = CP.h;
const { M, neg, ri, nz, pick, shuffle, sup, xp, poly, evalT, grp, frac, vec, dot, cross, sub, add, isZero, parallel, rv, keyOf, lin, eqn, pythVec, redV, len } = H;

/* ---------- small helpers ---------- */
const close = (u, v) => Math.abs(u - v) <= 1e-9 * Math.max(1, Math.abs(u), Math.abs(v));
const SX = [0.37, 1.21, 2.05, 0.83, 1.67];
function same(a, b) {
  if (typeof a === "function" || typeof b === "function") {
    const f = typeof a === "function" ? a : () => a, g = typeof b === "function" ? b : () => b;
    return SX.every(x => close(f(x, 0.61), g(x, 0.61)) && close(f(x, 1.3), g(x, 1.3)));
  }
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => same(x, b[i]));
  if (typeof a === "number" && typeof b === "number") return close(a, b);
  return a === b;
}
function finiteAll(v) {
  if (typeof v === "function") return SX.every(x => isFinite(v(x, 0.61)));
  if (Array.isArray(v)) return v.every(finiteAll);
  if (typeof v === "number") return isFinite(v);
  return true;
}
/* exact-looking number: integer, simple fraction, or a rounded decimal */
function rat(x) {
  if (!isFinite(x)) return "?";
  if (Math.abs(x - Math.round(x)) < 1e-9) return neg(Math.round(x));
  for (let d = 2; d <= 5000; d++) { const n = x * d; if (Math.abs(n - Math.round(n)) < 1e-7 * Math.max(1, Math.abs(n))) return frac(Math.round(n), d).html; }
  return "≈ " + neg(x.toFixed(3));
}
const vecR = v => "(" + v.map(rat).join(", ") + ")";
const X = p => p === 0 ? "1" : xp(p);
const tp = t => poly(t).replace(/x/g, "t");
const numd = (f, x, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);
const dTerms = T => T.filter(o => o.p !== 0).map(o => ({ c: o.c * o.p, p: o.p - 1 }));
const fT = T => x => evalT(T, x);
CP.h.same = same; CP.h.rat = rat;

/* run(bad) returns the lines with the mistake placed at line `bad`; run(−1) is the correct working. */
function mkSpot(task, expr, run) {
  const good = run(-1), bad = ri(0, good.length - 1), lines = run(bad);
  return { task, expr, lines, bad, why: lines[bad].err, fix: good[bad].html, walk: good.map((l, i) => "Line " + (i + 1) + ": " + l.html) };
}
const ask = "A student worked this out. One line has a mistake. Which line?";

CP.SPOT = {};
CP.REV = {};
CP.h.mkSpot = mkSpot; CP.h.ask = ask;

/* ================= exponents ================= */
CP.SPOT.exp = function () {
  const a = ri(2, 4), b = ri(2, 3), c = ri(1, 5), d = ri(2, 3), e = ri(2, 3);
  return mkSpot(ask, "(x" + sup(a) + ")" + sup(b) + " · x" + sup(c) + " ÷ (x" + sup(d) + ")" + sup(e), bad => {
    const L = [];
    const p1 = bad === 0 ? a + b : a * b;
    L.push({ html: "(x" + sup(a) + ")" + sup(b) + " = " + X(p1), t: a * b, v: p1, err: "A power of a power multiplies the exponents: " + a + " × " + b + " = " + (a * b) + ", not " + a + " + " + b + "." });
    const p2 = bad === 1 ? d + e : d * e;
    L.push({ html: "(x" + sup(d) + ")" + sup(e) + " = " + X(p2), t: d * e, v: p2, err: "A power of a power multiplies: " + d + " × " + e + " = " + (d * e) + "." });
    const p3 = bad === 2 ? p1 * c : p1 + c;
    L.push({ html: X(p1) + " · x" + sup(c) + " = " + X(p3), t: p1 + c, v: p3, err: "Multiplying powers adds the exponents: " + p1 + " + " + c + " = " + (p1 + c) + "." });
    const p4 = bad === 3 ? p3 + p2 : p3 - p2;
    L.push({ html: X(p3) + " ÷ " + X(p2) + " = " + X(p4), t: p3 - p2, v: p4, err: "Dividing powers subtracts the exponents: " + p3 + " − " + p2 + " = " + neg(p3 - p2) + "." });
    return L;
  });
};
CP.REV.exp = function (tier) {
  const k = pick(tier >= 4 ? ["mul", "div", "pow", "pow"] : ["mul", "div", "pow"]), B = "<span class=\"blank\">?</span>";
  if (k === "mul") {
    const a = ri(2, 7), e = ri(2, 7), c = a + e;
    return { task: "What exponent goes in the box?", expr: "x" + sup(a) + " · x<sup>" + B + "</sup> = x" + sup(c), cond: t => a + t === c,
      correct: { html: String(e), test: e }, wrong: [c + a, c, a - c, a * c <= 30 ? a * c : c - 1].map(t => ({ html: neg(t), test: t })),
      whyOf: t => "x" + sup(a) + " · x" + sup(t) + " = x" + sup(a + t) + ", not x" + sup(c) + ". Multiplying adds exponents.",
      walk: ["Multiplying powers adds exponents: " + a + " + ? = " + c + ".", "So the box is " + c + " − " + a + " = " + e + "."] };
  }
  if (k === "div") {
    const b = ri(2, 6), c = ri(1, 6), e = b + c;
    return { task: "What exponent goes in the box?", expr: "x<sup>" + B + "</sup> ÷ x" + sup(b) + " = x" + sup(c), cond: t => t - b === c,
      correct: { html: String(e), test: e }, wrong: [c - b, b * c <= 30 ? b * c : c + 1, b - c, c].map(t => ({ html: neg(t), test: t })),
      whyOf: t => "x" + sup(t) + " ÷ x" + sup(b) + " = x" + sup(t - b) + ", not x" + sup(c) + ". Dividing subtracts exponents.",
      walk: ["Dividing subtracts: ? − " + b + " = " + c + ".", "So the box is " + c + " + " + b + " = " + e + "."] };
  }
  const a = ri(2, 5), e = ri(2, 4), c = a * e;
  return { task: "What exponent goes in the box?", expr: "(x" + sup(a) + ")<sup>" + B + "</sup> = x" + sup(c), cond: t => a * t === c,
    correct: { html: String(e), test: e }, wrong: [c - a, c + a, c, a].map(t => ({ html: neg(t), test: t })),
    whyOf: t => "(x" + sup(a) + ")" + sup(t) + " = x" + sup(a * t) + ", not x" + sup(c) + ". A power of a power multiplies.",
    walk: ["A power of a power multiplies: " + a + " × ? = " + c + ".", "So the box is " + c + " ÷ " + a + " = " + e + "."] };
};

/* ================= fraction and negative exponents ================= */
CP.SPOT.frac = function () {
  let m, q; do { m = ri(2, 5); q = pick([2, 3]); } while (Math.pow(m, q) > 125);
  const base = Math.pow(m, q), p = ri(2, 3);
  const E = "<sup>" + M + p + "/" + q + "</sup>", Ep = "<sup>" + p + "/" + q + "</sup>";
  return mkSpot(ask, base + E, bad => {
    const L = [];
    const flip = bad === 0;
    L.push({ html: base + E + " = " + (flip ? M + base + Ep : "1 ÷ " + base + Ep), t: 1, v: flip ? -1 : 1, err: "A negative exponent means one over. It never makes the answer negative." });
    const r = bad === 1 ? base / q : m;
    L.push({ html: base + "<sup>1/" + q + "</sup> = " + rat(r), t: m, v: r, err: "The bottom of the exponent is a root: the " + (q === 2 ? "square" : "cube") + " root of " + base + " is " + m + ". You divided by " + q + " instead." });
    const V = bad === 2 ? r * p : Math.pow(r, p);
    L.push({ html: base + Ep + " = (" + rat(r) + ")" + sup(p) + " = " + rat(V), t: Math.pow(r, p), v: V, err: "The top of the exponent is a power: (" + rat(r) + ")" + sup(p) + " = " + rat(Math.pow(r, p)) + ", not " + rat(r) + " × " + p + "." });
    const truth = flip ? -V : 1 / V, ans = bad === 3 ? V : truth;
    L.push({ html: "So " + base + E + " = " + rat(ans), t: truth, v: ans, err: "Line 1 said one over, so the answer is 1 ÷ " + rat(V) + ", not " + rat(V) + "." });
    return L;
  });
};
CP.REV.frac = function () {
  let m, q; do { m = ri(2, 5); q = pick([2, 3]); } while (Math.pow(m, q) > 125);
  const base = Math.pow(m, q); let p; do { p = ri(1, 3); } while (p === q);
  const s = pick([1, -1]), e = s * p / q, V = Math.pow(base, e);
  const fh = (n, d) => (n * d < 0 ? M : "") + Math.abs(n) + (Math.abs(d) === 1 ? "" : "/" + Math.abs(d));
  return { task: "What exponent makes this true?", expr: base + "<sup><span class=\"blank\">?</span></sup> = " + rat(V), cond: t => Math.abs(Math.pow(base, t) - V) < 1e-9 * Math.max(1, V),
    correct: { html: fh(s * p, q), test: e },
    wrong: [{ html: fh(s * q, p), test: s * q / p }, { html: fh(-s * p, q), test: -e }, { html: fh(s * p, 1), test: s * p }, { html: fh(s * p * q, 1), test: s * p * q }],
    whyOf: t => base + "<sup>" + rat(t) + "</sup> = " + rat(Math.pow(base, t)) + ", not " + rat(V) + ".",
    walk: ["The " + (q === 2 ? "square" : "cube") + " root of " + base + " is " + m + ", so the bottom of the exponent is " + q + ".",
           m + sup(p) + " = " + Math.pow(m, p) + ", so the top is " + p + ".", s < 0 ? "The answer is one over, so the exponent is negative: " + fh(-p, q) + "." : "So the exponent is " + fh(p, q) + "."] };
};

/* ================= slope ================= */
CP.SPOT.slope = function () {
  const x1 = ri(-4, 3), dx = nz(-3, 3), m = nz(-3, 3), y1 = nz(-5, 5), x2 = x1 + dx, y2 = y1 + m * dx;
  if (x1 === 0) return null;
  return mkSpot("A student found the line through (" + neg(x1) + ", " + neg(y1) + ") and (" + neg(x2) + ", " + neg(y2) + "). One line has a mistake. Which line?", "y = mx + b", bad => {
    const L = [];
    const rise = bad === 0 ? y2 + y1 : y2 - y1;
    L.push({ html: "Rise: " + neg(y2) + " − (" + neg(y1) + ") = " + neg(rise), t: y2 - y1, v: rise, err: "Subtracting a negative adds, and subtracting a positive takes away. " + neg(y2) + " − (" + neg(y1) + ") = " + neg(y2 - y1) + "." });
    const run = bad === 1 ? x1 - x2 : x2 - x1;
    L.push({ html: "Run: " + neg(x2) + " − (" + neg(x1) + ") = " + neg(run), t: x2 - x1, v: run, err: "Subtract in the same order as the rise, second point first: " + neg(x2) + " − (" + neg(x1) + ") = " + neg(x2 - x1) + "." });
    if (rise === 0) return L.concat([{ html: "?", t: 0, v: NaN }]);
    const sl = bad === 2 ? run / rise : rise / run;
    L.push({ html: "Slope m = " + neg(rise) + " ÷ " + neg(run) + " = " + rat(sl), t: rise / run, v: sl, err: "Slope is rise over run: " + neg(rise) + " ÷ " + neg(run) + ". You divided the other way." });
    const bb = bad === 3 ? y1 + sl * x1 : y1 - sl * x1;
    L.push({ html: "b = " + neg(y1) + " − (" + rat(sl) + ")(" + neg(x1) + ") = " + rat(bb), t: y1 - sl * x1, v: bb, err: "b = y − mx. The product (" + rat(sl) + ")(" + neg(x1) + ") = " + rat(sl * x1) + " is subtracted." });
    return L;
  });
};
CP.REV.slope = function () {
  const P = [ri(-4, 4), ri(-4, 4)], m = nz(-3, 3), s = nz(-2, 2);
  const pt = (dx, dy) => [P[0] + dx, P[1] + dy], ph = Q => "(" + Q.map(neg).join(", ") + ")";
  const cond = Q => Q[0] !== P[0] && (Q[1] - P[1]) === m * (Q[0] - P[0]);
  return { task: "The line through P has slope " + neg(m) + ". Which point is also on it?", expr: "P" + ph(P), cond,
    correct: { html: ph(pt(s, m * s)), test: pt(s, m * s) },
    wrong: [pt(m * s, s), pt(s, -m * s), pt(s, m * s + 1), pt(-s, m * s)].map(Q => ({ html: ph(Q), test: Q })),
    whyOf: Q => "From P to " + ph(Q) + ": rise " + neg(Q[1] - P[1]) + ", run " + neg(Q[0] - P[0]) + ", slope " + rat((Q[1] - P[1]) / (Q[0] - P[0])) + ", not " + neg(m) + ".",
    walk: ["Slope " + neg(m) + " means a rise of " + neg(m) + " for every 1 across.", "Go " + neg(s) + " across and " + neg(m * s) + " up from P: " + ph(pt(s, m * s)) + "."] };
};

/* ================= first principles ================= */
CP.SPOT.firstp = function () {
  const a = nz(-4, 4), k = nz(-3, 3), h2 = sup(2);
  return mkSpot(ask, "f(x) = " + poly([{ c: a, p: 2 }]) + ". Find f′(" + neg(k) + ") from first principles.", bad => {
    const L = [];
    const c1 = bad === 0 ? 0 : 2 * a * k, W0 = h => a * k * k + c1 * h + a * h * h;
    L.push({ html: "f(" + neg(k) + " + h) = " + lin([{ c: a * k * k, s: "" }, { c: c1, s: "h" }, { c: a, s: "h" + h2 }]), t: h => a * (k + h) * (k + h), v: W0, err: "(" + neg(k) + " + h)² has a middle term 2(" + neg(k) + ")h. Squaring each part separately loses it." });
    const d2 = bad === 1 ? -a : a, W1 = h => c1 * h + d2 * h * h;
    L.push({ html: "f(" + neg(k) + " + h) − f(" + neg(k) + ") = " + lin([{ c: c1, s: "h" }, { c: d2, s: "h" + h2 }]), t: h => W0(h) - a * k * k, v: W1, err: "Subtracting f(" + neg(k) + ") removes only the " + neg(a * k * k) + ". The other terms keep their signs." });
    const W2 = bad === 2 ? h => c1 + d2 * h * h : h => c1 + d2 * h;
    L.push({ html: "Divide by h: " + lin([{ c: c1, s: "" }, { c: d2, s: bad === 2 ? "h" + h2 : "h" }]), t: h => W1(h) / h, v: W2, err: "Dividing " + lin([{ c: d2, s: "h" + h2 }]) + " by h leaves " + lin([{ c: d2, s: "h" }]) + "." });
    const lim = bad === 3 ? W2(1) : W2(0);
    L.push({ html: "Let h → 0: f′(" + neg(k) + ") = " + neg(lim), t: W2(0), v: lim, err: "Letting h go to 0 is not the same as putting h = 1." });
    return L;
  });
};
CP.REV.firstp = function () {
  const a = nz(-3, 3), b = nz(-5, 5), c = ri(-5, 5);
  const q = T => lin([{ c: 2 * T[0], s: "x" }, { c: T[0], s: "h" }, { c: T[1], s: "" }]);
  const opt = T => ({ html: "f(x) = " + poly([{ c: T[0], p: 2 }, { c: T[1], p: 1 }, { c: T[2], p: 0 }]), test: T });
  return { task: "Which function has this difference quotient?", expr: "[f(x + h) − f(x)] ÷ h = " + q([a, b]), cond: T => T[0] === a && T[1] === b,
    correct: opt([a, b, c]), wrong: [opt([2 * a, b, c]), opt([a, -b, c]), opt([a, 2 * b, c]), opt([0, 2 * a, b])],
    whyOf: T => "Its difference quotient is " + q(T) + ".",
    walk: ["For f(x) = ax² + bx + c the quotient is 2ax + ah + b. The constant c cancels.", "Match: a = " + neg(a) + " (from the h term), b = " + neg(b) + ".", "Any constant works; " + poly([{ c: a, p: 2 }, { c: b, p: 1 }, { c: c, p: 0 }]) + " is one."] };
};

/* ================= power rule, one term ================= */
CP.SPOT.pow1 = function () {
  const a = nz(-6, 6), n = ri(2, 4);
  return mkSpot(ask, "f(x) = " + neg(a) + " ÷ x" + sup(n) + ". Find f′(2).", bad => {
    const L = [];
    const p0 = bad === 0 ? n : -n;
    L.push({ html: "f(x) = " + poly([{ c: a, p: p0 }]), t: x => a / Math.pow(x, n), v: x => a * Math.pow(x, p0), err: "Moving x" + sup(n) + " from the bottom to the top flips the sign of its exponent: x" + sup(-n) + "." });
    const c1 = a * p0, p1 = bad === 1 ? p0 + 1 : p0 - 1;
    L.push({ html: "f′(x) = " + poly([{ c: c1, p: p1 }]), t: x => c1 * Math.pow(x, p0 - 1), v: x => c1 * Math.pow(x, p1), err: "Lower the power by one: " + neg(p0) + " − 1 = " + neg(p0 - 1) + ". From a negative power, lowering moves further from zero." });
    const val = bad === 2 ? c1 / Math.pow(2, p1) : c1 * Math.pow(2, p1);
    L.push({ html: "f′(2) = " + neg(c1) + " × 2" + sup(p1) + " = " + rat(val), t: c1 * Math.pow(2, p1), v: val, err: "2" + sup(p1) + " = " + rat(Math.pow(2, p1)) + ", so the value is " + rat(c1 * Math.pow(2, p1)) + "." });
    return L;
  });
};
CP.REV.pow1 = function () {
  const K = ri(1, 5), C = (K + 1) * nz(-4, 4), c0 = C / (K + 1);
  const opt = (c, p) => ({ html: "f(x) = " + poly([{ c, p }]), test: [c, p] });
  return { task: "Which function has this derivative?", expr: "f′(x) = " + poly([{ c: C, p: K }]), cond: T => T[0] * T[1] === C && T[1] - 1 === K,
    correct: opt(c0, K + 1), wrong: [opt(C, K + 1), opt(C * (K + 1), K + 1), opt(c0, K), opt(C, K - 1)],
    whyOf: T => "Differentiate it and you get " + poly([{ c: T[0] * T[1], p: T[1] - 1 }]) + ".",
    walk: ["Undo the power rule: raise the power by one, to " + (K + 1) + ".", "Then divide by the new power: " + neg(C) + " ÷ " + (K + 1) + " = " + neg(c0) + ".", "Check: differentiating " + poly([{ c: c0, p: K + 1 }]) + " gives " + poly([{ c: C, p: K }]) + "."] };
};

/* ================= power rule, polynomials ================= */
CP.SPOT.polyd = function () {
  const ps = shuffle([1, 2, 3, 4, 5]).slice(0, 3).sort((a, b) => b - a), T = ps.map(p => ({ c: nz(-7, 7), p })), c = nz(-9, 9);
  const kinds = ["nolow", "nomul", "raise"];
  const Fx = o => x => o.c * Math.pow(x, o.p);
  return mkSpot("A student differentiated f(x) = " + poly(T.concat([{ c, p: 0 }])) + " term by term. One line has a mistake. Which line?", "f(x) = " + poly(T.concat([{ c, p: 0 }])), bad => {
    const L = T.map((o, i) => {
      const good = { c: o.c * o.p, p: o.p - 1 };
      let w = good, err = "";
      if (i === bad) {
        const k = o.p === 1 ? pick(["nolow", "raise"]) : pick(kinds);
        w = k === "nolow" ? { c: o.c * o.p, p: o.p } : k === "nomul" ? { c: o.c, p: o.p - 1 } : { c: o.c * o.p, p: o.p + 1 };
        err = { nolow: "You multiplied by the power but did not lower it.", nomul: "You lowered the power but did not multiply by it first.", raise: "The power goes down by one, not up." }[k];
      }
      return { html: "d/dx(" + poly([o]) + ") = " + poly([w]), t: Fx(good), v: Fx(w), err };
    });
    L.push({ html: "d/dx(" + neg(c) + ") = " + (bad === 3 ? neg(c) : "0"), t: 0, v: bad === 3 ? c : 0, err: "A constant never changes, so its derivative is 0." });
    return L;
  });
};
CP.REV.polyd = function () {
  const ps = shuffle([0, 1, 2, 3]).slice(0, 2 + (Math.random() < 0.5 ? 1 : 0)).sort((a, b) => b - a);
  const D = ps.map(p => ({ c: (p + 1) * nz(-3, 3), p })), k = ri(-5, 5);
  const F = D.map(o => ({ c: o.c / (o.p + 1), p: o.p + 1 })).concat([{ c: k, p: 0 }]);
  const same2 = (A, B) => poly(A) === poly(B);
  const opt = T => ({ html: "f(x) = " + poly(T), test: T });
  const top = D[0];
  const w1 = [{ c: top.c, p: top.p + 1 }].concat(F.slice(1)), w2 = D.map(o => ({ c: o.c, p: o.p + 1 })).concat([{ c: k, p: 0 }]), w3 = dTerms(D), w4 = D.map(o => ({ c: o.c / (o.p + 1), p: o.p })).concat([{ c: k, p: 0 }]);
  return { task: "Which function has this derivative?", expr: "f′(x) = " + poly(D), cond: T => same2(dTerms(T), D),
    correct: opt(F), wrong: [opt(w1), opt(w2), opt(w3), opt(w4)],
    whyOf: T => "Differentiate it and you get " + poly(dTerms(T)) + ".",
    walk: ["Undo the power rule on each term: raise the power by one, then divide by the new power.", D.map(o => poly([o]) + " came from " + poly([{ c: o.c / (o.p + 1), p: o.p + 1 }])).join("; ") + ".",
           "Any constant can be added. Here: " + poly(F) + "."] };
};

/* ================= tangent ================= */
CP.SPOT.tan = function () {
  const a = nz(-3, 3), b = nz(-5, 5), c = ri(-5, 5), k = pick([2, 3, -2, -3]), f = x => a * x * x + b * x + c;
  return mkSpot("A student found the tangent to f(x) = " + poly([{ c: a, p: 2 }, { c: b, p: 1 }, { c, p: 0 }]) + " at x = " + neg(k) + ". One line has a mistake. Which line?", "tangent: y = mx + b", bad => {
    const L = [];
    const al = bad === 0 ? a : 2 * a;
    L.push({ html: "f′(x) = " + poly([{ c: al, p: 1 }, { c: b, p: 0 }]), t: x => 2 * a * x + b, v: x => al * x + b, err: "The power rule brings the 2 down: the derivative of " + poly([{ c: a, p: 2 }]) + " is " + poly([{ c: 2 * a, p: 1 }]) + "." });
    const m = bad === 1 ? al * k * k + b : al * k + b;
    L.push({ html: "Slope m = f′(" + neg(k) + ") = " + neg(m), t: al * k + b, v: m, err: "You squared " + neg(k) + ". f′(x) is linear; x appears once." });
    const y0 = bad === 2 ? m : f(k);
    L.push({ html: "Point: f(" + neg(k) + ") = " + neg(y0), t: f(k), v: y0, err: "That is the slope again. The point's height is f(" + neg(k) + ") = " + neg(f(k)) + "." });
    const B = bad === 3 ? y0 + m * k : y0 - m * k;
    L.push({ html: "b = " + neg(y0) + " − (" + neg(m) + ")(" + neg(k) + ") = " + neg(B) + ", so y = " + poly([{ c: m, p: 1 }, { c: B, p: 0 }]), t: y0 - m * k, v: B, err: "b = y − mx: subtract (" + neg(m) + ")(" + neg(k) + ") = " + neg(m * k) + "." });
    return L;
  });
};
CP.REV.tan = function () {
  const b = nz(-6, 6), e = ri(-5, 5), x0 = nz(-3, 3), f = x => x * x + b * x + e, m = 2 * x0 + b, c = f(x0) - m * x0;
  return { task: "The line is tangent to the curve. At which x does it touch?", expr: "f(x) = " + poly([{ c: 1, p: 2 }, { c: b, p: 1 }, { c: e, p: 0 }]) + "<br>y = " + poly([{ c: m, p: 1 }, { c, p: 0 }]),
    cond: t => 2 * t + b === m && f(t) === m * t + c,
    correct: { html: "x = " + neg(x0), test: x0 },
    wrong: [-x0 - b, -x0, x0 + 1, m].filter(t => Number.isInteger(t)).map(t => ({ html: "x = " + neg(t), test: t })),
    whyOf: t => "At x = " + neg(t) + " the curve's slope is f′(" + neg(t) + ") = " + neg(2 * t + b) + ", not " + neg(m) + ".",
    walk: ["At the touching point the slopes match: f′(x) = 2x " + (b < 0 ? M + " " + (-b) : "+ " + b) + " = " + neg(m) + ".", "So x = " + neg(x0) + ".", "Check the height: f(" + neg(x0) + ") = " + neg(f(x0)) + " and the line gives " + neg(m * x0 + c) + "."] };
};

/* ================= product rule ================= */
CP.SPOT.prod = function () {
  const a = ri(2, 4), b = nz(-5, 5), c = ri(2, 4), d = nz(-5, 5), k = nz(-3, 3);
  const U = [{ c: a, p: 1 }, { c: b, p: 0 }], V = [{ c: c, p: 1 }, { c: d, p: 0 }];
  return mkSpot("A student differentiated f(x) = " + grp(U) + grp(V) + " and found f′(" + neg(k) + "). One line has a mistake. Which line?", "f(x) = " + grp(U) + grp(V), bad => {
    const L = [];
    const A0 = [{ c: a * c, p: 1 }, { c: bad === 0 ? d : a * d, p: 0 }];
    L.push({ html: "u′v = " + a + grp(V) + " = " + poly(A0), t: x => a * (c * x + d), v: fT(A0), err: "Multiply every term in the bracket by " + a + ": " + a + " × " + neg(d) + " = " + neg(a * d) + "." });
    const A1 = [{ c: a * c, p: 1 }, { c: bad === 1 ? b : b * c, p: 0 }];
    L.push({ html: "uv′ = " + c + grp(U) + " = " + poly(A1), t: x => c * (a * x + b), v: fT(A1), err: "Multiply every term in the bracket by " + c + ": " + c + " × " + neg(b) + " = " + neg(b * c) + "." });
    const S = [{ c: bad === 2 ? A0[0].c : A0[0].c + A1[0].c, p: 1 }, { c: A0[1].c + A1[1].c, p: 0 }];
    L.push({ html: "f′(x) = " + poly(S), t: x => fT(A0)(x) + fT(A1)(x), v: fT(S), err: "Both halves have an x term. Add them: " + (A0[0].c) + "x + " + (A1[0].c) + "x = " + (A0[0].c + A1[0].c) + "x." });
    const val = bad === 3 ? evalT(S, -k) : evalT(S, k);
    L.push({ html: "f′(" + neg(k) + ") = " + neg(val), t: evalT(S, k), v: val, err: "You put in " + neg(-k) + " instead of " + neg(k) + "." });
    return L;
  });
};
CP.REV.prod = function () {
  let a, b; do { a = nz(-6, 6); b = nz(-6, 6); } while (a + b === 0 || a === b);
  const s = a + b, p = a * b;
  const opt = (u, v) => ({ html: "f(x) = (x " + (u < 0 ? M + " " + (-u) : "+ " + u) + ")(x " + (v < 0 ? M + " " + (-v) : "+ " + v) + ")", test: [u, v] });
  return { task: "Which function fits both facts?", expr: "f′(x) = " + poly([{ c: 2, p: 1 }, { c: s, p: 0 }]) + " &nbsp;and&nbsp; f(0) = " + neg(p), cond: T => T[0] + T[1] === s && T[0] * T[1] === p,
    correct: opt(a, b), wrong: [opt(-a, -b), opt(a + 1, b - 1), opt(p, 1), opt(a, -b)],
    whyOf: T => "Expand: x² + " + neg(T[0] + T[1]) + "x + " + neg(T[0] * T[1]) + ". Then f′(x) = 2x + " + neg(T[0] + T[1]) + " and f(0) = " + neg(T[0] * T[1]) + ".",
    walk: ["(x + a)(x + b) = x² + (a + b)x + ab.", "f′(x) = 2x + (a + b), so a + b = " + neg(s) + ". f(0) = ab = " + neg(p) + ".", "Two numbers adding to " + neg(s) + " and multiplying to " + neg(p) + ": " + neg(a) + " and " + neg(b) + "."] };
};

/* ================= chain rule ================= */
const chH = (co, a, b, n) => (co === 1 ? "" : neg(co)) + grp([{ c: a, p: 1 }, { c: b, p: 0 }]) + (n === 1 ? "" : sup(n));
CP.SPOT.chain = function () {
  const a = ri(2, 4), b = nz(-3, 3), n = ri(3, 4), ie = x => a * x + b;
  return mkSpot(ask, "f(x) = " + chH(1, a, b, n) + ". Find f′(0).", bad => {
    const L = [];
    const pw = bad === 0 ? n : n - 1;
    L.push({ html: "Outside: " + chH(n, a, b, pw), t: x => n * Math.pow(ie(x), n - 1), v: x => n * Math.pow(ie(x), pw), err: "Bring the " + n + " down and lower the power to " + (n - 1) + "." });
    const iw = bad === 1 ? a + b : a;
    L.push({ html: "Inside: the derivative of " + poly([{ c: a, p: 1 }, { c: b, p: 0 }]) + " is " + neg(iw), t: a, v: iw, err: "The constant " + neg(b) + " has derivative 0. Only " + a + " remains." });
    const C = bad === 2 ? n + iw : n * iw;
    L.push({ html: "f′(x) = " + chH(C, a, b, pw), t: x => n * iw * Math.pow(ie(x), pw), v: x => C * Math.pow(ie(x), pw), err: "The chain rule multiplies the two parts: " + n + " × " + neg(iw) + " = " + neg(n * iw) + ". You added." });
    const val = bad === 3 ? C * Math.pow(a + b, pw) : C * Math.pow(b, pw);
    L.push({ html: "f′(0) = " + neg(C) + "(" + neg(b) + ")" + sup(pw) + " = " + neg(val), t: C * Math.pow(b, pw), v: val, err: "At x = 0 the bracket is " + neg(b) + ". You put in x = 1." });
    return L;
  });
};
CP.REV.chain = function () {
  const k = ri(1, 3), a = ri(2, 3), b = nz(-5, 5), n = ri(2, 4), C = k * n * a;
  const opt = (co, e) => ({ html: "f(x) = " + chH(co, a, b, e), test: [co, e] });
  const ws = [[C, n], [k * a, n], [k * n, n], [k, n - 1], [C, n - 1]];
  return { task: "Which function has this derivative?", expr: "f′(x) = " + chH(C, a, b, n - 1), cond: T => T[0] * T[1] * a === C && T[1] === n,
    correct: opt(k, n), wrong: ws.map(w => opt(...w)),
    whyOf: T => "Differentiate it and you get " + chH(T[0] * T[1] * a, a, b, T[1] - 1) + ".",
    walk: ["The power on the bracket went down by one, so f had power " + n + ".", "Differentiating " + chH(1, a, b, n) + " gives " + chH(n * a, a, b, n - 1) + ": the " + n + " and the inside's " + a + " come out.",
           neg(C) + " ÷ " + (n * a) + " = " + k + ", so f(x) = " + chH(k, a, b, n) + "."] };
};

/* ================= product and chain together ================= */
function comboH(co, m, b, k) { /* co · x^m (x + b)^k */
  const I = grp([{ c: 1, p: 1 }, { c: b, p: 0 }]);
  return (co === 1 && (m > 0 || k > 0) ? "" : neg(co)) + xp(m) + (k === 0 ? "" : I + (k === 1 ? "" : sup(k)));
}
function comboD(co, m, b, k) { /* derivative html, product rule left unsimplified */
  const parts = [];
  if (m > 0) parts.push(comboH(co * m, m - 1, b, k));
  if (k > 0) parts.push(comboH(co * k, m, b, k - 1));
  return parts.join(" + ") || "0";
}
CP.SPOT.combo = function () {
  const m = ri(1, 2), a = ri(2, 3), b = nz(-3, 3), n = ri(2, 3), I = [{ c: a, p: 1 }, { c: b, p: 0 }], ie = x => a * x + b;
  const u = x => Math.pow(x, m), v = x => Math.pow(ie(x), n);
  return mkSpot(ask, "f(x) = " + xp(m) + grp(I) + sup(n), bad => {
    const L = [];
    const up = bad === 0 ? x => m * Math.pow(x, m) : x => m * Math.pow(x, m - 1);
    L.push({ html: "u = " + xp(m) + ", u′ = " + (bad === 0 ? (m === 1 ? "x" : m + xp(m)) : (m === 1 ? "1" : m + xp(m - 1))), t: x => m * Math.pow(x, m - 1), v: up, err: "Lower the power by one: the derivative of " + xp(m) + " is " + (m === 1 ? "1" : m + xp(m - 1)) + "." });
    const cv = bad === 1 ? n : n * a, vp = x => cv * Math.pow(ie(x), n - 1);
    L.push({ html: "v = " + grp(I) + sup(n) + ", v′ = " + cv + grp(I) + (n - 1 === 1 ? "" : sup(n - 1)), t: x => n * a * Math.pow(ie(x), n - 1), v: vp, err: "The chain rule multiplies by the inside's derivative, " + a + ": v′ = " + (n * a) + grp(I) + (n - 1 === 1 ? "" : sup(n - 1)) + "." });
    const uH = L[0].html.split("u′ = ")[1], vH = L[1].html.split("v′ = ")[1];
    const fw = bad === 2 ? x => up(x) * vp(x) : x => up(x) * v(x) + u(x) * vp(x);
    const uP = uH === "1" ? "" : "(" + uH + ")";
    L.push({ html: bad === 2 ? "f′(x) = u′ · v′ = " + (uP || "1 · ") + "(" + vH + ")" : "f′(x) = u′v + uv′ = " + uP + grp(I) + sup(n) + " + " + xp(m) + " · " + vH,
             t: x => up(x) * v(x) + u(x) * vp(x), v: fw, err: "The product rule is u′v + uv′. The derivative of a product is not the product of the derivatives." });
    return L;
  });
};
CP.REV.combo = function () {
  const b = nz(-4, 4), n = ri(2, 3), ie = x => x + b;
  const target = x => Math.pow(ie(x), n - 1) * ((n + 1) * x + b);
  const opt = (co, m, k) => ({ html: "f(x) = " + comboH(co, m, b, k), test: x => co * Math.pow(x, m) * Math.pow(ie(x), k), d: comboD(co, m, b, k) });
  const cond = f => SX.every(x => close(numd(f, x), target(x)) || Math.abs(numd(f, x) - target(x)) < 1e-4 * Math.max(1, Math.abs(target(x))));
  const W = [opt(1, 1, n - 1), opt(1, 0, n + 1), opt(1, 2, n - 1), opt(n, 1, n)];
  return { task: "Which function has this derivative?", expr: "f′(x) = " + grp([{ c: 1, p: 1 }, { c: b, p: 0 }]) + (n - 1 === 1 ? "" : sup(n - 1)) + grp([{ c: n + 1, p: 1 }, { c: b, p: 0 }]), cond,
    correct: opt(1, 1, n), wrong: W.map(o => Object.assign(o, { why: "Its derivative is " + o.d + ", which does not simplify to the target." })),
    walk: ["Try f(x) = x" + grp([{ c: 1, p: 1 }, { c: b, p: 0 }]) + sup(n) + ". Product rule: " + comboD(1, 1, b, n) + ".",
           "Take out " + grp([{ c: 1, p: 1 }, { c: b, p: 0 }]) + (n - 1 === 1 ? "" : sup(n - 1)) + ": what is left is " + grp([{ c: 1, p: 1 }, { c: b, p: 0 }]) + " + " + n + "x = " + poly([{ c: n + 1, p: 1 }, { c: b, p: 0 }]) + ".", "That matches."] };
};

/* ================= sine, cosine, e^x ================= */
CP.SPOT.trigexp = function () {
  const A = ri(2, 5), k = ri(2, 4), B = ri(2, 5), j = ri(2, 4), c = pick([2, 3, -1, -2]);
  const eh = "e<sup>" + (c === -1 ? M : neg(c)) + "x</sup>";
  return mkSpot(ask, "f(x) = " + A + " sin(" + k + "x) + " + B + " cos(" + j + "x) + " + eh + ". Find f′(0).", bad => {
    const L = [];
    const W0 = bad === 0 ? x => A * Math.cos(k * x) : x => A * k * Math.cos(k * x);
    L.push({ html: "d/dx[" + A + " sin(" + k + "x)] = " + (bad === 0 ? A : A * k) + " cos(" + k + "x)", t: x => A * k * Math.cos(k * x), v: W0, err: "Chain rule: multiply by the inside's derivative, " + k + ". " + A + " × " + k + " = " + (A * k) + "." });
    const W1 = bad === 1 ? x => B * j * Math.sin(j * x) : x => -B * j * Math.sin(j * x);
    L.push({ html: "d/dx[" + B + " cos(" + j + "x)] = " + (bad === 1 ? "" : M) + (B * j) + " sin(" + j + "x)", t: x => -B * j * Math.sin(j * x), v: W1, err: "Cosine differentiates to negative sine." });
    const W2 = bad === 2 ? x => Math.exp(c * x) : x => c * Math.exp(c * x);
    L.push({ html: "d/dx[" + eh + "] = " + (bad === 2 ? "" : (c === -1 ? M : neg(c))) + eh, t: x => c * Math.exp(c * x), v: W2, err: "Chain rule: the exponent " + neg(c) + "x has derivative " + neg(c) + ", so multiply by it." });
    const s = W0(0) + W1(0) + W2(0), val = bad === 3 ? s - W2(0) : s;
    L.push({ html: "f′(0) = " + neg(val), t: s, v: val, err: "At x = 0 the " + eh + " term still contributes " + neg(W2(0)) + ". Add all three parts: sin 0 = 0 and cos 0 = 1." });
    return L;
  });
};
CP.REV.trigexp = function () {
  const k = ri(2, 5), kind = pick(["sin", "cos", "exp"]);
  const S = x => Math.sin(k * x), C = x => Math.cos(k * x), E = x => Math.exp(k * x);
  const eh = "e<sup>" + k + "x</sup>";
  const F = {
    sin: { t: "f′(x) = " + k + " cos(" + k + "x)", g: x => k * C(x), c: ["sin(" + k + "x)", S, k + " cos(" + k + "x)"],
           w: [["cos(" + k + "x)", C, M + k + " sin(" + k + "x)"], [k + " sin(" + k + "x)", x => k * S(x), (k * k) + " cos(" + k + "x)"], ["sin x", Math.sin, "cos x"], [M + "sin(" + k + "x)", x => -S(x), M + k + " cos(" + k + "x)"]] },
    cos: { t: "f′(x) = " + M + k + " sin(" + k + "x)", g: x => -k * S(x), c: ["cos(" + k + "x)", C, M + k + " sin(" + k + "x)"],
           w: [["sin(" + k + "x)", S, k + " cos(" + k + "x)"], [M + "cos(" + k + "x)", x => -C(x), k + " sin(" + k + "x)"], [k + " cos(" + k + "x)", x => k * C(x), M + (k * k) + " sin(" + k + "x)"], ["cos x", Math.cos, M + "sin x"]] },
    exp: { t: "f′(x) = " + k + eh, g: x => k * E(x), c: [eh, E, k + eh],
           w: [[k + eh, x => k * E(x), (k * k) + eh], [eh + " ÷ " + k, x => E(x) / k, eh], ["eˣ", Math.exp, "eˣ"], [eh + " + " + k, x => E(x) + k, k + eh + " as well, so this one also works"]] }
  }[kind];
  const cond = f => SX.every(x => Math.abs(numd(f, x) - F.g(x)) < 1e-4 * Math.max(1, Math.abs(F.g(x))));
  return { task: "Which function has this derivative?", expr: F.t, cond,
    correct: { html: "f(x) = " + F.c[0], test: F.c[1] },
    wrong: F.w.filter(w => !cond(w[1])).map(w => ({ html: "f(x) = " + w[0], test: w[1], why: "Its derivative is " + w[2] + "." })),
    walk: ["Differentiate each option in your head and compare.", "The derivative of " + F.c[0] + " is " + F.c[2] + ", which matches."] };
};

/* ================= exponential rates ================= */
CP.SPOT.exprate = function () {
  const A = pick([1000, 2000, 5000]), k = pick([0.02, 0.03, 0.05, 0.07]);
  const f2 = x => neg(x.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  return mkSpot(ask, "P(t) = " + A + "e<sup>" + k + "t</sup>. How fast is it growing at t = 10?", bad => {
    const L = [];
    const cw = bad === 0 ? A : k * A;
    L.push({ html: "P′(t) = " + neg(+cw.toFixed(4)) + "e<sup>" + k + "t</sup>", t: x => k * A * Math.exp(k * x), v: x => cw * Math.exp(k * x), err: "The exponent " + k + "t has derivative " + k + ", so multiply by it: " + k + " × " + A + " = " + (k * A) + "." });
    const Vt = A * Math.exp(10 * k), V = bad === 1 ? 10 * A * Math.exp(k) : Vt;
    L.push({ html: "P(10) = " + A + "e<sup>" + +(10 * k).toFixed(2) + "</sup> = " + f2(V), t: Vt, v: V, err: "The exponent is " + k + " × 10 = " + +(10 * k).toFixed(2) + ". The 10 goes inside the exponent, not in front." });
    const kw = cw / A, R = bad === 2 ? V / kw : kw * V;
    L.push({ html: "P′(10) = " + +kw.toFixed(4) + " × " + f2(V) + " = " + f2(R) + " a year", t: kw * V, v: R, err: "The rate is k × P, not P ÷ k." });
    return L;
  });
};
CP.REV.exprate = function () {
  const k = pick([0.02, 0.03, 0.04, 0.05, 0.06, 0.08]), A = pick([1000, 2000, 5000]), R = +(k * A).toFixed(6);
  const opt = t => ({ html: "k = " + neg(+t.toFixed(6)), test: t });
  return { task: "What is k?", expr: "P(t) = " + A + "e<sup>kt</sup>, &nbsp;P′(0) = " + R, cond: t => Math.abs(t * A - R) < 1e-9 * Math.max(1, R),
    correct: opt(k), wrong: [opt(R), opt(k * 100), opt(k * 10), opt(R / 100)],
    whyOf: t => "Then P′(0) = " + neg(+t.toFixed(6)) + " × " + A + " = " + neg(+(t * A).toFixed(4)) + ", not " + R + ".",
    walk: ["P′(t) = kP(t), so P′(0) = k × " + A + ".", "k = " + R + " ÷ " + A + " = " + k + ", which is " + +(k * 100).toFixed(2) + "% a year."] };
};

/* ================= motion ================= */
CP.SPOT.motion = function () {
  const p = nz(-5, 5), q = nz(-9, 9), T = ri(1, 3), S = [{ c: 1, p: 3 }, { c: p, p: 2 }, { c: q, p: 1 }], s = fT(S);
  return mkSpot(ask, "s(t) = " + tp(S) + ". Find v(" + T + ") and a(" + T + ").", bad => {
    const L = [];
    const Vw = [{ c: 3, p: 2 }, { c: bad === 0 ? p : 2 * p, p: 1 }, { c: q, p: 0 }];
    L.push({ html: "v(t) = " + tp(Vw), t: fT(dTerms(S)), v: fT(Vw), err: "The derivative of " + tp([{ c: p, p: 2 }]) + " is " + tp([{ c: 2 * p, p: 1 }]) + ": the 2 comes down." });
    const Aw = bad === 1 ? [{ c: 6, p: 1 }, { c: Vw[1].c + q, p: 0 }] : dTerms(Vw);
    L.push({ html: "a(t) = " + tp(Aw), t: fT(dTerms(Vw)), v: fT(Aw), err: "The constant " + neg(q) + " in v(t) differentiates to 0." });
    const v1 = bad === 2 ? s(T) : evalT(Vw, T);
    L.push({ html: "v(" + T + ") = " + neg(v1), t: evalT(Vw, T), v: v1, err: "That is s(" + T + "), the position. Put " + T + " into v(t)." });
    const a1 = bad === 3 ? evalT(Vw, T) : evalT(Aw, T);
    L.push({ html: "a(" + T + ") = " + neg(a1), t: evalT(Aw, T), v: a1, err: "That is v(" + T + ") again. Put " + T + " into a(t)." });
    return L;
  });
};
CP.REV.motion = function () {
  const a = nz(-2, 2), b = nz(-4, 4), c = nz(-6, 6), s0 = ri(-9, 9);
  const V = [{ c: 3 * a, p: 2 }, { c: 2 * b, p: 1 }, { c, p: 0 }], S = [{ c: a, p: 3 }, { c: b, p: 2 }, { c, p: 1 }, { c: s0, p: 0 }];
  const opt = T => ({ html: "s(t) = " + tp(T), test: T });
  return { task: "Which is the position function?", expr: "v(t) = " + tp(V) + ", &nbsp;s(0) = " + neg(s0), cond: T => tp(dTerms(T)) === tp(V) && evalT(T, 0) === s0,
    correct: opt(S), wrong: [opt(S.slice(0, 3).concat([{ c: s0 + (s0 === 0 ? 5 : s0), p: 0 }])), opt(V.map(o => ({ c: o.c, p: o.p + 1 })).concat([{ c: s0, p: 0 }])), opt([dTerms(V)[0], { c: dTerms(V)[1].c + s0, p: 0 }]), opt(S.slice(0, 3))],
    whyOf: T => "Its derivative is " + tp(dTerms(T)) + " and s(0) = " + neg(evalT(T, 0)) + ".",
    walk: ["Undo each derivative: " + tp([V[0]]) + " came from " + tp([S[0]]) + ", " + tp([V[1]]) + " from " + tp([S[1]]) + ", " + neg(c) + " from " + tp([S[2]]) + ".", "Then s(0) fixes the constant: " + neg(s0) + "."] };
};

/* ================= max and min ================= */
CP.SPOT.maxmin = function () {
  const p = ri(1, 3), c = nz(-6, 6), x0 = pick([p, -p]);
  const F = [{ c: 1, p: 3 }, { c: -3 * p * p, p: 1 }, { c, p: 0 }];
  return mkSpot("A student classified the flat point of f(x) = " + poly(F) + " at x = " + neg(x0) + ". One line has a mistake. Which line?", "f(x) = " + poly(F), bad => {
    const L = [];
    const D1 = bad === 0 ? [{ c: 3, p: 2 }, { c: -3 * p * p, p: 0 }, { c, p: 0 }] : [{ c: 3, p: 2 }, { c: -3 * p * p, p: 0 }];
    const D1s = bad === 0 ? poly([{ c: 3, p: 2 }]) + " − " + (3 * p * p) + (c < 0 ? " − " + (-c) : " + " + c) : poly(D1);
    L.push({ html: "f′(x) = " + D1s, t: fT(dTerms(F)), v: fT(D1), err: "The constant " + neg(c) + " differentiates to 0." });
    const D2 = bad === 1 ? [{ c: 3, p: 1 }] : [{ c: 6, p: 1 }];
    L.push({ html: "f″(x) = " + poly(D2), t: fT(dTerms(D1)), v: fT(D2), err: "The derivative of 3x² is 6x: the 2 comes down." });
    const val = bad === 2 ? -evalT(D2, x0) : evalT(D2, x0);
    L.push({ html: "f″(" + neg(x0) + ") = " + neg(val), t: evalT(D2, x0), v: val, err: "Sign slip. f″(" + neg(x0) + ") = " + neg(evalT(D2, x0)) + "." });
    const kind = val > 0 ? "minimum" : "maximum", w = bad === 3 ? (kind === "minimum" ? "maximum" : "minimum") : kind;
    L.push({ html: (val > 0 ? "Positive" : "Negative") + ", so x = " + neg(x0) + " is a local " + w, t: kind, v: w, err: val > 0 ? "f″ > 0 means concave up, a valley: a minimum." : "f″ < 0 means concave down, a hill: a maximum." });
    return L;
  });
};
CP.REV.maxmin = function () {
  const a = ri(1, 3), h = nz(-4, 4), k = nz(-6, 6);
  const opt = T => ({ html: "f(x) = " + poly([{ c: T[0], p: 2 }, { c: T[1], p: 1 }, { c: T[2], p: 0 }]), test: T });
  const f = (T, x) => T[0] * x * x + T[1] * x + T[2];
  return { task: "Which function has a local minimum at this point?", expr: "(" + neg(h) + ", " + neg(k) + ")", cond: T => T[0] > 0 && -T[1] === 2 * T[0] * h && f(T, h) === k,
    correct: opt([a, -2 * a * h, a * h * h + k]), wrong: [opt([a, 2 * a * h, a * h * h + k]), opt([-a, 2 * a * h, -a * h * h + k]), opt([a, -2 * a * h, a * h * h - k]), opt([a, -a * h, k])],
    whyOf: T => { const x = -T[1] / (2 * T[0]); return "f′(x) = " + poly([{ c: 2 * T[0], p: 1 }, { c: T[1], p: 0 }]) + " is zero at x = " + rat(x) + ", where f = " + rat(f(T, x)) + ". It is a " + (T[0] > 0 ? "minimum" : "maximum") + " at (" + rat(x) + ", " + rat(f(T, x)) + ")."; },
    walk: ["f(x) = a(x − h)² + k has its turning point at (h, k), a minimum when a > 0.", "Expand " + a + "(x " + (h > 0 ? M + " " + h : "+ " + (-h)) + ")² " + (k < 0 ? M + " " + (-k) : "+ " + k) + ".", "Check with calculus: f′(" + neg(h) + ") = 0 and f″ = " + (2 * a) + " > 0."] };
};

/* ================= concavity ================= */
CP.SPOT.concav = function () {
  const r = nz(-3, 3), c = nz(-6, 6), d = ri(-5, 5), F = [{ c: 1, p: 3 }, { c: -3 * r, p: 2 }, { c, p: 1 }, { c: d, p: 0 }], f = fT(F);
  return mkSpot("A student found the point of inflection of f(x) = " + poly(F) + ". One line has a mistake. Which line?", "f(x) = " + poly(F), bad => {
    const L = [];
    const D1 = [{ c: 3, p: 2 }, { c: bad === 0 ? -3 * r : -6 * r, p: 1 }, { c, p: 0 }];
    L.push({ html: "f′(x) = " + poly(D1), t: fT(dTerms(F)), v: fT(D1), err: "The derivative of " + poly([{ c: -3 * r, p: 2 }]) + " is " + poly([{ c: -6 * r, p: 1 }]) + "." });
    const beta = D1[1].c, D2 = [{ c: 6, p: 1 }, { c: bad === 1 ? 2 * beta : beta, p: 0 }];
    L.push({ html: "f″(x) = " + poly(D2), t: fT(dTerms(D1)), v: fT(D2), err: "The derivative of " + poly([{ c: beta, p: 1 }]) + " is " + neg(beta) + "." });
    const Xt = -D2[1].c / 6, Xw = bad === 2 ? -Xt : Xt;
    L.push({ html: "f″(x) = 0 at x = " + rat(Xw), t: Xt, v: Xw, err: "Sign slip. " + poly(D2) + " = 0 gives x = " + rat(Xt) + "." });
    const y = bad === 3 ? evalT(dTerms(F), Xw) : f(Xw);
    L.push({ html: "Inflection point: (" + rat(Xw) + ", " + rat(y) + ")", t: f(Xw), v: y, err: "That is f′(" + rat(Xw) + "), the slope there. The point's height is f(" + rat(Xw) + ")." });
    return L;
  });
};
CP.REV.concav = function () {
  const a = ri(1, 4), b = nz(-5, 5), q = ri(1, 3);
  const cands = [[{ c: a, p: 2 }, { c: b, p: 1 }], [{ c: 1, p: 4 }, { c: a, p: 2 }], [{ c: 1, p: 4 }, { c: 2 * q, p: 2 }, { c: b, p: 1 }]];
  const traps = [[{ c: 1, p: 3 }, { c: a, p: 2 }], [{ c: -a, p: 2 }, { c: b, p: 1 }], [{ c: 1, p: 4 }, { c: -2 * q, p: 2 }], [{ c: 1, p: 3 }, { c: b, p: 1 }], [{ c: -1, p: 4 }, { c: a, p: 2 }]];
  const f2 = T => fT(dTerms(dTerms(T)));
  const grid = []; for (let x = -10; x <= 10; x += 0.1) grid.push(x);
  const cond = T => grid.every(x => f2(T)(x) > 0);
  const opt = T => ({ html: "f(x) = " + poly(T), test: T });
  return { task: "Which function is concave up everywhere?", expr: "concave up: f″(x) > 0 for every x", cond,
    correct: opt(pick(cands)), wrong: shuffle(traps.slice()).map(opt),
    whyOf: T => { const g = f2(T), x = g(0) <= 0 ? 0 : Math.round(grid.find(z => g(z) <= 0)); return "f″(x) = " + poly(dTerms(dTerms(T))) + ", which is " + (g(x) === 0 ? "zero" : "negative") + " at x = " + neg(x) + "."; },
    walk: ["Differentiate twice and ask whether f″ is positive for every x.", "x² terms give a positive constant; x⁴ gives 12x², which is never negative; an x³ term gives 6x, which changes sign."] };
};

/* ================= optimization ================= */
CP.SPOT.optim = function () {
  const P = 4 * ri(5, 25);
  return mkSpot("A student maximized the area fenced by " + P + " m along a river (three sides). One line has a mistake. Which line?", "width x, length " + P + " − 2x", bad => {
    const L = [];
    const al = bad === 0 ? 1 : 2;
    L.push({ html: "A(x) = x(" + P + " − 2x) = " + poly([{ c: P, p: 1 }, { c: -al, p: 2 }]), t: x => x * (P - 2 * x), v: x => P * x - al * x * x, err: "x × 2x = 2x², so A = " + P + "x − 2x²." });
    const sl = bad === 1 ? al : 2 * al;
    L.push({ html: "A′(x) = " + poly([{ c: P, p: 0 }, { c: -sl, p: 1 }]), t: x => P - 2 * al * x, v: x => P - sl * x, err: "The derivative of " + al + "x² is " + (2 * al) + "x: the 2 comes down." });
    const Xt = P / sl, Xw = bad === 2 ? P / (sl / 2) : Xt;
    L.push({ html: "A′(x) = 0 when x = " + rat(Xw), t: Xt, v: Xw, err: poly([{ c: P, p: 0 }, { c: -sl, p: 1 }]) + " = 0 gives x = " + P + " ÷ " + sl + " = " + rat(Xt) + "." });
    const At = Xw * (P - 2 * Xw), Aw = bad === 3 ? Xw * Xw : At;
    L.push({ html: "Largest area = " + rat(Xw) + " × " + rat(P - 2 * Xw) + " = " + rat(Aw) + " m²", t: At, v: Aw, err: "The rectangle is " + rat(Xw) + " by " + rat(P - 2 * Xw) + ", not a square." });
    return L;
  });
};
CP.REV.optim = function () {
  const s = ri(3, 12) * 2, P = 4 * s;
  const opt = (w, h) => ({ html: w + " m by " + h + " m", test: [w, h] });
  return { task: "A rectangle has perimeter " + P + " m. Which dimensions give the largest area?", expr: "2(w + h) = " + P, cond: T => 2 * (T[0] + T[1]) === P && T[0] * T[1] === s * s,
    correct: opt(s, s), wrong: [opt(s - 1, s + 1), opt(s - 2, s + 2), opt(s / 2, 3 * s / 2), opt(s / 2, 2 * s)],
    whyOf: T => 2 * (T[0] + T[1]) !== P ? "Its perimeter is " + 2 * (T[0] + T[1]) + " m, not " + P + " m." : "Its area is " + T[0] * T[1] + " m², less than " + s + " × " + s + " = " + s * s + " m².",
    walk: ["h = " + (P / 2) + " − w, so A(w) = w(" + (P / 2) + " − w).", "A′(w) = " + (P / 2) + " − 2w = 0 gives w = " + s + ", so h = " + s + ".", "A square: " + s + " m by " + s + " m, area " + s * s + " m²."] };
};

/* ================= vector basics ================= */
CP.SPOT.vbasic = function () {
  const { v: w0 } = pythVec(), v = rv(-4, 4), u = add(v, w0), j = [0, 1, 2].find(i => v[i] !== 0);
  if (j === undefined) return null;
  return mkSpot(ask, "u = " + vec(u) + ", v = " + vec(v) + ". Find |u − v|.", bad => {
    const L = [];
    const W = sub(u, v); if (bad === 0) W[j] = u[j] + v[j];
    L.push({ html: "u − v = " + vec(W), t: sub(u, v), v: W, err: "Sign slip in one component: " + neg(u[j]) + " − (" + neg(v[j]) + ") = " + neg(u[j] - v[j]) + "." });
    const k = W.findIndex(x => x !== 0), St = dot(W, W), Sw = bad === 1 ? St - 2 * W[k] * W[k] : St;
    L.push({ html: W.map(x => "(" + neg(x) + ")²").join(" + ") + " = " + neg(Sw), t: St, v: Sw, err: "Every square is positive: (" + neg(W[k]) + ")² = " + (W[k] * W[k]) + "." });
    if (Sw < 0) return L.concat([{ html: "?", t: 0, v: NaN }]);
    const r = Math.sqrt(Sw), Lw = bad === 2 ? Sw / 2 : r;
    L.push({ html: "|u − v| = √" + Sw + " = " + rat(Lw), t: r, v: Lw, err: "Take the square root: √" + Sw + " = " + rat(r) + ". Halving is not the same." });
    return L;
  });
};
CP.REV.vbasic = function () {
  const u = rv(-6, 6), v = rv(-6, 6), w = add(u, v), j = ri(0, 2), slip = sub(w, u); slip[j] = w[j] + u[j];
  const opt = V => ({ html: "v = " + vec(V), test: V });
  return { task: "Find v.", expr: "u = " + vec(u) + ", &nbsp;u + v = " + vec(w), cond: V => add(u, V).join() === w.join(),
    correct: opt(v), wrong: [opt(add(w, u)), opt(sub(u, w)), opt(slip)],
    whyOf: V => "Then u + v = " + vec(add(u, V)) + ", not " + vec(w) + ".",
    walk: ["v = (u + v) − u, one component at a time.", vec(w) + " − " + vec(u) + " = " + vec(v) + "."] };
};

/* ================= dot product ================= */
CP.SPOT.dotp = function () {
  const u = rv(-5, 5), v = rv(-5, 5), P = u.map((x, i) => x * v[i]);
  if (!P.some(x => x < 0) || P.filter(x => x !== 0).length < 3) return null;
  return mkSpot(ask, "u = " + vec(u) + ", v = " + vec(v) + ". Find u · v.", bad => {
    const L = [];
    const W = P.map((p, i) => i === bad ? -p : p);
    for (let i = 0; i < 3; i++) L.push({ html: "(" + neg(u[i]) + ")(" + neg(v[i]) + ") = " + neg(W[i]), t: P[i], v: W[i], err: "Sign slip: (" + neg(u[i]) + ")(" + neg(v[i]) + ") = " + neg(P[i]) + ". " + (u[i] < 0 && v[i] < 0 ? "Negative times negative is positive." : "Different signs give a negative.") });
    const St = W[0] + W[1] + W[2], Sw = bad === 3 ? W.reduce((s, x) => s + Math.abs(x), 0) : St;
    L.push({ html: "u · v = " + W.map(x => x < 0 ? "(" + neg(x) + ")" : x).join(" + ") + " = " + neg(Sw), t: St, v: Sw, err: "You dropped the minus signs when adding. The sum is " + neg(St) + "." });
    return L;
  });
};
CP.REV.dotp = function () {
  let c, d, e, a, b, S; do { c = nz(-4, 4); d = nz(-4, 4); e = nz(-3, 3); a = nz(-4, 4); b = nz(-4, 4); S = a * c + b * d; } while (S === 0 || S % e !== 0);
  const k = -S / e;
  return { task: "For which k are these vectors at right angles?", expr: "(" + neg(a) + ", " + neg(b) + ", k) and " + vec([c, d, e]), cond: t => S + t * e === 0,
    correct: { html: "k = " + neg(k), test: k }, wrong: [-k, S, k + 1, -S].map(t => ({ html: "k = " + neg(t), test: t })),
    whyOf: t => "Then the dot product is " + neg(S) + " + (" + neg(t) + ")(" + neg(e) + ") = " + neg(S + t * e) + ", not 0.",
    walk: ["Right angles means the dot product is 0: (" + neg(a) + ")(" + neg(c) + ") + (" + neg(b) + ")(" + neg(d) + ") + " + neg(e) + "k = 0.", neg(S) + " + " + neg(e) + "k = 0, so k = " + neg(k) + "."] };
};

/* ================= angles and projections ================= */
CP.SPOT.angle = function () {
  const A = pythVec(), B = pythVec(), u = A.v, v = B.v, D = dot(u, v), P = u.map((x, i) => x * v[i]), j = P.findIndex(x => x !== 0);
  if (D === 0 || j < 0) return null;
  return mkSpot(ask, "u = " + vec(u) + ", v = " + vec(v) + ". Find cos θ.", bad => {
    const L = [];
    const Dw = bad === 0 ? D - 2 * P[j] : D;
    L.push({ html: "u · v = " + neg(Dw), t: D, v: Dw, err: "Sign slip in one product: (" + neg(u[j]) + ")(" + neg(v[j]) + ") = " + neg(P[j]) + ". The total is " + neg(D) + "." });
    const Lu = bad === 1 ? A.L * A.L : A.L;
    L.push({ html: "|u| = " + Lu, t: A.L, v: Lu, err: "You forgot the square root: √" + (A.L * A.L) + " = " + A.L + "." });
    const Lv = bad === 2 ? v.reduce((s, x) => s + Math.abs(x), 0) : B.L;
    L.push({ html: "|v| = " + Lv, t: B.L, v: Lv, err: "Square, add, then root. Adding the components does not give the length: |v| = " + B.L + "." });
    const ct = Dw / (Lu * Lv), cw = bad === 3 ? Dw / (Lu + Lv) : ct;
    L.push({ html: "cos θ = " + neg(Dw) + " ÷ " + (bad === 3 ? "(" + Lu + " + " + Lv + ")" : "(" + Lu + " × " + Lv + ")") + " = " + rat(cw), t: ct, v: cw, err: "Multiply the lengths, do not add them: " + Lu + " × " + Lv + " = " + (Lu * Lv) + "." });
    return L;
  });
};
CP.REV.angle = function () {
  let u, v; do { u = rv(-4, 4); v = rv(-4, 4); } while (dot(u, v) >= 0);
  const mk = sgn => { let a, b; do { a = rv(-4, 4); b = rv(-4, 4); } while (Math.sign(dot(a, b)) !== sgn); return [a, b]; };
  const opt = T => ({ html: vec(T[0]) + " and " + vec(T[1]), test: T });
  return { task: "Which pair meets at an obtuse angle, more than 90°?", expr: "obtuse: u · v < 0", cond: T => dot(T[0], T[1]) < 0,
    correct: opt([u, v]), wrong: [opt(mk(1)), opt(mk(0)), opt(mk(1))],
    whyOf: T => { const d = dot(T[0], T[1]); return "u · v = " + neg(d) + (d === 0 ? ": exactly 90°." : ", which is positive: an acute angle."); },
    walk: ["cos θ has the same sign as u · v, since lengths are positive.", "Obtuse means cos θ < 0, so look for a negative dot product: " + vec(u) + " · " + vec(v) + " = " + neg(dot(u, v)) + "."] };
};

/* ================= cross product ================= */
CP.SPOT.crossp = function () {
  const u = rv(-3, 3), v = rv(-3, 3), w = cross(u, v);
  if (w.some(x => x === 0) || u[1] * v[0] === 0 || u[2] * v[1] === 0) return null;
  return mkSpot(ask, "u = " + vec(u) + ", v = " + vec(v) + ". Find u × v, then check it.", bad => {
    const L = [], W = w.slice();
    if (bad === 0) W[0] = -w[0];
    L.push({ html: "First: (" + neg(u[1]) + ")(" + neg(v[2]) + ") − (" + neg(u[2]) + ")(" + neg(v[1]) + ") = " + neg(W[0]), t: w[0], v: W[0], err: "Arithmetic slip: " + neg(u[1] * v[2]) + " − (" + neg(u[2] * v[1]) + ") = " + neg(w[0]) + "." });
    if (bad === 1) W[1] = -w[1];
    L.push({ html: "Second: (" + neg(u[2]) + ")(" + neg(v[0]) + ") − (" + neg(u[0]) + ")(" + neg(v[2]) + ") = " + neg(W[1]), t: w[1], v: W[1], err: "The middle component is the one most people flip: " + neg(u[2] * v[0]) + " − (" + neg(u[0] * v[2]) + ") = " + neg(w[1]) + "." });
    if (bad === 2) W[2] = u[0] * v[1] + u[1] * v[0];
    L.push({ html: "Third: (" + neg(u[0]) + ")(" + neg(v[1]) + ") − (" + neg(u[1]) + ")(" + neg(v[0]) + ") = " + neg(W[2]), t: w[2], v: W[2], err: "Subtract, do not add: " + neg(u[0] * v[1]) + " − (" + neg(u[1] * v[0]) + ") = " + neg(w[2]) + "." });
    const ck = dot(W, u), cw = bad === 3 ? ck + pick([1, -1, 2]) : ck;
    L.push({ html: "Check: " + vec(W) + " · u = " + neg(cw), t: ck, v: cw, err: "Recompute the check: " + W.map((x, i) => "(" + neg(x) + ")(" + neg(u[i]) + ")").join(" + ") + " = " + neg(ck) + "." });
    return L;
  });
};
CP.REV.crossp = function () {
  let u, v, w; do { u = rv(-3, 3); v = rv(-3, 3); w = redV(cross(u, v)); } while (isZero(w) || w[1] === 0 || parallel(u, v));
  const sg = pick([1, -1]), W = w.map(x => x * sg || 0);
  const opt = V => ({ html: vec(V), test: V });
  return { task: "Which vector is at right angles to both u and v?", expr: "u = " + vec(u) + ", &nbsp;v = " + vec(v), cond: V => !isZero(V) && dot(V, u) === 0 && dot(V, v) === 0,
    correct: opt(W), wrong: [opt([w[0], -w[1], w[2]]), opt(add(u, v)), opt(u.map((x, i) => x * v[i])), opt(sub(u, v))],
    whyOf: V => dot(V, u) !== 0 ? "Its dot product with u is " + neg(dot(V, u)) + ", not 0." : "Its dot product with v is " + neg(dot(V, v)) + ", not 0.",
    walk: ["u × v = " + vec(cross(u, v)) + " is at right angles to both.", "Any multiple of it works too, such as " + vec(W) + ".", "Check: dot it with u and with v; both give 0."] };
};

/* ================= lines in space ================= */
CP.SPOT.lines = function () {
  const P = rv(-4, 4), Q = rv(-4, 4), k = pick([2, 3, -2, -1]), j = P.findIndex(x => x !== 0);
  if (P.join() === Q.join() || j < 0) return null;
  return mkSpot(ask, "Find the point at t = " + neg(k) + " on the line through P" + vec(P) + " and Q" + vec(Q) + ", r = P + t(Q − P).", bad => {
    const L = [];
    const d = sub(Q, P); if (bad === 0) d[j] = Q[j] + P[j];
    L.push({ html: "Q − P = " + vec(d), t: sub(Q, P), v: d, err: "Sign slip in one component: " + neg(Q[j]) + " − (" + neg(P[j]) + ") = " + neg(Q[j] - P[j]) + "." });
    const K = bad === 1 ? d.map(x => x + k) : d.map(x => k * x);
    L.push({ html: neg(k) + vec(d) + " = " + vec(K), t: d.map(x => k * x), v: K, err: "Multiply every component by " + neg(k) + "; do not add it." });
    const Xt = add(P, K), Xw = bad === 2 ? sub(P, K) : Xt;
    L.push({ html: "Point: " + vec(P) + " + " + vec(K) + " = " + vec(Xw), t: Xt, v: Xw, err: "Add to P, component by component. You subtracted." });
    return L;
  });
};
CP.REV.lines = function () {
  let P, Q; do { P = rv(-4, 4); Q = rv(-4, 4); } while (P.join() === Q.join() || parallel(P, Q));
  const d = sub(Q, P), j = d.findIndex(x => x !== 0), slip = d.slice(); slip[j] = -slip[j];
  const onL = (A, D, X) => isZero(cross(sub(X, A), D));
  const opt = (A, D) => ({ html: "r = " + vec(A) + " + t" + vec(D), test: [A, D] });
  const forms = [[P, d], [Q, d.map(x => -x)], [P, d.map(x => 2 * x)], [Q, d]];
  return { task: "Which equation describes the line through P and Q?", expr: "P " + vec(P) + ", &nbsp;Q " + vec(Q), cond: T => !isZero(T[1]) && onL(T[0], T[1], P) && onL(T[0], T[1], Q),
    correct: opt(...pick(forms)), wrong: [opt(P, Q), opt(P, add(P, Q)), opt(P, slip), opt(Q, P)],
    whyOf: T => !onL(T[0], T[1], P) ? "P is not on it: no value of t reaches " + vec(P) + "." : "Q is not on it: no value of t reaches " + vec(Q) + ".",
    walk: ["The direction is Q − P = " + vec(d) + ", or any multiple of it.", "Start from any point on the line, P or Q.", "Check: both P and Q must come out for some t."] };
};

/* ================= planes ================= */
CP.SPOT.planes = function () {
  const A = rv(-3, 3), B = rv(-3, 3), C = rv(-3, 3), u = sub(B, A), w = sub(C, A), n = cross(u, w);
  const j = u.findIndex(x => x !== 0), i2 = w.findIndex(x => x !== 0);
  if (isZero(n) || n[1] === 0 || dot(n, A) === 0 || j < 0 || i2 < 0 || A[j] === 0 || A[i2] === 0) return null;
  return mkSpot(ask, "Find the plane through A" + vec(A) + ", B" + vec(B) + ", C" + vec(C) + ".", bad => {
    const L = [];
    const U = u.slice(); if (bad === 0) U[j] = B[j] + A[j];
    L.push({ html: "B − A = " + vec(U), t: u, v: U, err: "Sign slip: " + neg(B[j]) + " − (" + neg(A[j]) + ") = " + neg(u[j]) + "." });
    const Wv = w.slice(); if (bad === 1) Wv[i2] = C[i2] + A[i2];
    L.push({ html: "C − A = " + vec(Wv), t: w, v: Wv, err: "Sign slip: " + neg(C[i2]) + " − (" + neg(A[i2]) + ") = " + neg(w[i2]) + "." });
    const Nt = cross(U, Wv), N = Nt.slice(); if (bad === 2) N[1] = -N[1];
    L.push({ html: "n = " + vec(U) + " × " + vec(Wv) + " = " + vec(N), t: Nt, v: N, err: "The middle component of a cross product is u₃w₁ − u₁w₃. Its sign is the usual slip: it should be " + neg(Nt[1]) + "." });
    const dt = dot(N, A), dw = bad === 3 ? -dt : dt;
    L.push({ html: "d = n · A = " + neg(dw), t: dt, v: dw, err: "Sign slip: n · A = " + N.map((x, i) => "(" + neg(x) + ")(" + neg(A[i]) + ")").join(" + ") + " = " + neg(dt) + "." });
    return L;
  });
};
CP.REV.planes = function () {
  let n; do { n = rv(-4, 4); } while (n.filter(Boolean).length < 2);
  const P = rv(-3, 3), d = dot(n, P); let e; do { e = cross(n, rv(-1, 1)); } while (isZero(e));
  const R = add(P, e), off = j => { const X = R.slice(); X[j] += 1; return X; };
  const opt = X => ({ html: vec(X), test: X });
  return { task: "Which point lies on this plane?", expr: eqn(n, d), cond: X => dot(n, X) === d,
    correct: opt(R), wrong: [opt(off(0)), opt(off(1)), opt(off(2)), opt(n), opt(P.map(x => -x))],
    whyOf: X => "Put it in: " + n.map((c, i) => "(" + neg(c) + ")(" + neg(X[i]) + ")").join(" + ") + " = " + neg(dot(n, X)) + ", not " + neg(d) + ".",
    walk: ["A point is on the plane when it makes the equation true.", "Put " + vec(R) + " in: " + n.map((c, i) => "(" + neg(c) + ")(" + neg(R[i]) + ")").join(" + ") + " = " + neg(d) + ". It works."] };
};

/* ================= line meets plane ================= */
CP.SPOT.lineplane = function () {
  const P = rv(-4, 4), d = rv(-3, 3), n = rv(-3, 3), t0 = nz(-3, 3), X = add(P, d.map(x => t0 * x)), D = dot(n, X);
  const al = dot(n, P), be = dot(n, d), j = n.findIndex((x, i) => x * d[i] !== 0), k = d.findIndex(x => x !== 0);
  if (be === 0 || al === 0 || j < 0 || k < 0 || (be - 2 * n[j] * d[j]) === 0) return null;
  return mkSpot(ask, "r = " + vec(P) + " + t" + vec(d) + " meets " + eqn(n, D) + ". Where?", bad => {
    const L = [];
    const bw = bad === 0 ? be - 2 * n[j] * d[j] : be;
    L.push({ html: "Substitute: " + lin([{ c: al, s: "" }, { c: bw, s: "t" }]) + " = " + neg(D), t: [al, be], v: [al, bw], err: "Sign slip in n · d: (" + neg(n[j]) + ")(" + neg(d[j]) + ") = " + neg(n[j] * d[j]) + ". The t coefficient is " + neg(be) + "." });
    const tt = (D - al) / bw, tw = bad === 1 ? (D + al) / bw : tt;
    L.push({ html: "t = " + rat(tw), t: tt, v: tw, err: "Move " + neg(al) + " across and it changes sign: t = (" + neg(D) + " − (" + neg(al) + ")) ÷ " + neg(bw) + " = " + rat(tt) + "." });
    const Xt = P.map((x, i) => x + tw * d[i]), Xw = Xt.slice(); if (bad === 2) Xw[k] = P[k] - tw * d[k];
    L.push({ html: "Point: " + vecR(Xw), t: Xt, v: Xw, err: "Add t times the direction to P in every component." });
    return L;
  });
};
CP.REV.lineplane = function () {
  const P = rv(-3, 3); let d, n1; do { d = rv(-3, 3); n1 = redV(cross(d, rv(-2, 2))); } while (isZero(n1));
  let n3; do { n3 = rv(-3, 3); } while (dot(n3, d) === 0);
  const D1 = dot(n1, P) + nz(-5, 5);
  const opt = (n, D) => ({ html: eqn(n, D), test: [n, D] });
  let n4; do { n4 = rv(-3, 3); } while (dot(n4, d) === 0 || parallel(n4, n3));
  return { task: "The line never meets which plane?", expr: "r = " + vec(P) + " + t" + vec(d), prose: true, cond: T => dot(T[0], d) === 0 && dot(T[0], P) !== T[1],
    correct: opt(n1, D1), wrong: [opt(n1, dot(n1, P)), opt(n3, dot(n3, P) + ri(-4, 4)), opt(n4, ri(-9, 9))],
    whyOf: T => dot(T[0], d) !== 0 ? "n · d = " + neg(dot(T[0], d)) + ", not 0, so the line crosses it once." : "It is parallel, but P is on it: n · P = " + neg(dot(T[0], P)) + ". The line lies inside the plane.",
    walk: ["Never meeting means parallel and off to one side.", "Parallel: the normal is at right angles to the direction, n · d = 0.", "Off to one side: P does not satisfy the equation."] };
};

/* ================= distance ================= */
CP.SPOT.dist = function () {
  const { v: n, L } = pythVec(), Q = rv(-5, 5), D = nz(-9, 9), N = dot(n, Q) - D;
  if (N === 0) return null;
  return mkSpot(ask, "How far is Q" + vec(Q) + " from " + eqn(n, D) + "?", bad => {
    const Ls = [];
    const Nw = bad === 0 ? dot(n, Q) : N;
    Ls.push({ html: "n · Q − d = " + neg(dot(n, Q)) + " − (" + neg(D) + ")" + " = " + neg(Nw), t: N, v: Nw, err: "You forgot to subtract d: " + neg(dot(n, Q)) + " − (" + neg(D) + ") = " + neg(N) + "." });
    const Lw = bad === 1 ? L * L : L;
    Ls.push({ html: "|n| = " + Lw, t: L, v: Lw, err: "Take the square root: |n| = √" + (L * L) + " = " + L + "." });
    const dt = Math.abs(Nw) / Lw, dw = bad === 2 ? Math.abs(Nw) * Lw : dt;
    Ls.push({ html: "Distance = " + Math.abs(Nw) + (bad === 2 ? " × " : " ÷ ") + Lw + " = " + rat(dw), t: dt, v: dw, err: "Divide by |n|; do not multiply." });
    return Ls;
  });
};
CP.REV.dist = function () {
  const { v: n, L } = pythVec(), F = rv(-3, 3), D = dot(n, F), k = nz(-2, 2), r = Math.abs(k) * L, j = n.findIndex(x => x !== 0);
  const Qc = add(F, n.map(x => k * x)), e = [0, 0, 0]; e[j] = r;
  const opt = X => ({ html: vec(X), test: X });
  const dd = X => Math.abs(dot(n, X) - D) / L;
  return { task: "Which point is exactly " + r + " units from the plane?", expr: eqn(n, D), cond: X => close(dd(X), r),
    correct: opt(Qc), wrong: [opt(add(F, e)), opt(add(F, n.map(x => (k + Math.sign(k)) * x))), opt(add(F, n.map((x, i) => (i === j ? -k : k) * x))), opt(F)],
    whyOf: X => "Its distance is |" + neg(dot(n, X)) + " − (" + neg(D) + ")| ÷ " + L + " = " + rat(dd(X)) + ".",
    walk: ["Start on the plane at " + vec(F) + " and move along the normal, the shortest way off.", "Each step of " + vec(n) + " covers |n| = " + L + " units, so " + Math.abs(k) + " step" + (Math.abs(k) === 1 ? "" : "s") + " covers " + r + ".",
           vec(F) + " + " + neg(k) + vec(n) + " = " + vec(Qc) + "."] };
};

/* ================= building and dispatch ================= */
const tidy = s => String(s).replace(/= ≈/g, "≈").replace(/\+ −/g, "− ").replace(/− −(?=\d)/g, "+ ");
function buildSpot(stepId, tier) {
  for (let tries = 0; tries < 80; tries++) {
    const p = CP.SPOT[stepId](tier);
    if (!p || !p.lines || p.lines.length < 3) continue;
    const okLines = p.lines.every((l, i) => finiteAll(l.v) && finiteAll(l.t) && (i === p.bad ? !same(l.v, l.t) : same(l.v, l.t)));
    const keys = p.lines.map(l => keyOf(l.html));
    if (!okLines || new Set(keys).size !== keys.length || !p.why) continue;
    p.mode = "spot";
    for (const l of p.lines) l.html = tidy(l.html);
    p.why = tidy(p.why); p.fix = tidy(p.fix); p.walk = p.walk.map(tidy);
    p.options = p.lines.map((l, i) => ({ html: l.html, ok: i === p.bad, why: i === p.bad ? "" : "Line " + (i + 1) + " is correct: it follows from the lines above it. The mistake is " + (i < p.bad ? "further down." : "earlier.") }));
    return p;
  }
  throw new Error("could not build spot " + stepId);
}
function buildRev(stepId, tier) {
  for (let tries = 0; tries < 80; tries++) {
    const p = CP.REV[stepId](tier);
    if (!p || !p.cond(p.correct.test)) continue;
    const seen = new Set([keyOf(p.correct.html)]), w = [];
    for (const o of p.wrong) {
      const k = keyOf(o.html);
      if (seen.has(k) || p.cond(o.test) || !finiteAll(o.test)) continue;
      seen.add(k); w.push(Object.assign({}, o, { html: tidy(o.html), why: tidy(o.why || (p.whyOf ? p.whyOf(o.test) : "")) }));
    }
    if (w.length < 3) continue;
    p.mode = "rev";
    p.wrong = w.slice(0, 3);
    p.options = shuffle([Object.assign({ ok: true }, p.correct)].concat(p.wrong.map(o => Object.assign({ ok: false }, o))));
    return p;
  }
  throw new Error("could not build reverse " + stepId);
}

const fwdBuild = CP.build, fwdFreeze = CP.freeze;
CP.buildFwd = fwdBuild;
CP.buildMode = function (stepId, mode, tier) {
  if (mode === "spot") return buildSpot(stepId, tier);
  if (mode === "rev") return buildRev(stepId, tier);
  if (mode === "ctx") return CP.buildCtx(stepId);
  return fwdBuild(stepId, Math.min(tier, 2));
};
/* Hard: about a third of questions are set in a real situation.
   Expert: 40% spot, 40% backwards, 20% real situations or hard. Master: 45 / 45 / 10. */
CP.build = function (stepId, tier) {
  if (tier < 2) return fwdBuild(stepId, tier);
  if (tier === 2) return Math.random() < 0.35 ? CP.buildCtx(stepId) : fwdBuild(stepId, 2);
  const r = Math.random(), cut = tier === 3 ? [0.4, 0.8] : [0.45, 0.9];
  return CP.buildMode(stepId, r < cut[0] ? "spot" : r < cut[1] ? "rev" : Math.random() < 0.7 ? "ctx" : "fwd", tier);
};
CP.freeze = function (p, stepId, tier) {
  const f = fwdFreeze(p, stepId, tier);
  f.mode = p.mode || "fwd";
  if (tier >= 4) f.noHint = true;
  if (p.mode === "spot") { f.spotWhy = p.why; f.fix = p.fix; f.prose = true; }
  if (p.mode === "ctx") { f.ctx = p.k; f.sid = p.sid; }
  return f;
};
})();
