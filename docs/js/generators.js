/* Chalk and Paper – problem generators
   Each step's gen(tier) invents a fresh multiple-choice problem.
   tier is 0 (easy), 1 (medium) or 2 (hard). Every wrong option names the mistake behind it.
   These formulas are verified numerically by the test in tools/verify.js. */

window.CP = window.CP || {};
(function () {
const M = "−";
const neg = x => String(x).replace(/-/g, M);
const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const nz = (a, b) => { let v; do { v = ri(a, b); } while (v === 0); return v; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const sup = p => "<sup>" + neg(p) + "</sup>";
const xp = p => p === 0 ? "" : p === 1 ? "x" : "x" + sup(p);

function poly(terms) {
  const t = terms.filter(o => o.c !== 0).sort((a, b) => b.p - a.p);
  if (!t.length) return "0";
  return t.map((o, i) => {
    const m = Math.abs(o.c);
    const body = o.p === 0 ? String(m) : (m === 1 ? "" : m) + xp(o.p);
    if (i === 0) return (o.c < 0 ? M : "") + body;
    return (o.c < 0 ? " " + M + " " : " + ") + body;
  }).join("");
}
const evalT = (t, x) => t.reduce((s, o) => s + o.c * Math.pow(x, o.p), 0);
const grp = t => "(" + poly(t) + ")";
function frac(n, d) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d) || 1; n /= g; d /= g;
  return { html: d === 1 ? neg(n) : neg(n) + "/" + d, val: n / d };
}
const vec = v => "(" + v.map(neg).join(", ") + ")";
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const sub = (a, b) => a.map((x, i) => x - b[i]);
const add = (a, b) => a.map((x, i) => x + b[i]);
const isZero = v => v.every(x => x === 0);
const to3 = v => v.length === 2 ? [v[0], v[1], 0] : v;
const parallel = (a, b) => isZero(cross(to3(a), to3(b)));
const rv = (lo, hi, n = 3) => { let v; do { v = Array.from({ length: n }, () => ri(lo, hi)); } while (isZero(v)); return v; };
const sgnTerm = (c, body) => (c < 0 ? " " + M + " " : " + ") + (Math.abs(c) === 1 && body ? "" : Math.abs(c)) + body;
const root = q => q === 2 ? "square" : "cube";
const m_ = s => '<span class="m">' + s + "</span>";

CP.G = {}; /* generators by step id */

/* ---- 1 exponent laws ---- */
CP.G.exp = function (tier) {
  const kinds = tier === 0 ? ["mul", "mul", "pow", "zero"] : tier === 1 ? ["mul", "pow", "div", "zero"] : ["combo", "combo", "div", "pow"];
  const t = pick(kinds), hi = tier === 2 ? 9 : 6;
  if (t === "mul") {
    const a = ri(2, hi), b = ri(2, hi);
    return { task: "Simplify.", expr: "x" + sup(a) + " · x" + sup(b),
      correct: { html: "x" + sup(a + b) },
      wrong: [{ html: "x" + sup(a * b), why: "You multiplied the exponents. That is the rule for a power of a power, like (x²)³. Here two powers are multiplied, so you add." },
              { html: "2x" + sup(a + b), why: "A 2 appears when you add, as in x + x = 2x. This is multiplication, so no 2 appears." },
              { html: "2x" + sup(a * b), why: "Two slips at once: you multiplied the exponents, and you created a 2 that belongs to addition." }],
      walk: ["x" + sup(a) + " means " + a + " x's multiplied together. x" + sup(b) + " is " + b + " more.",
             "Altogether that is " + (a + b) + " x's multiplied, so the answer is " + m_("x" + sup(a + b)) + "."] };
  }
  if (t === "pow") {
    const a = ri(2, 5), b = ri(2, tier === 2 ? 5 : 4);
    return { task: "Simplify.", expr: "(x" + sup(a) + ")" + sup(b),
      correct: { html: "x" + sup(a * b) },
      wrong: [{ html: "x" + sup(a + b), why: "You added the exponents. Adding is for multiplying two powers side by side, like x² · x³. A power raised to a power multiplies." },
              { html: b + "x" + sup(a), why: "You multiplied by " + b + ". The outer " + b + " is an exponent: it means the bracket is multiplied by itself " + b + " times." },
              { html: "x" + sup(Math.pow(a, b)), why: "You raised " + a + " to the power " + b + ". The exponents multiply: " + a + " × " + b + "." }],
      walk: ["(x" + sup(a) + ")" + sup(b) + " means x" + sup(a) + " written down " + b + " times and multiplied.",
             "That is " + b + " groups of " + a + " x's, which is " + a + " × " + b + " = " + (a * b) + " x's: " + m_("x" + sup(a * b)) + "."] };
  }
  if (t === "div") {
    const b = ri(2, 4), a = b + ri(1, hi - 3);
    return { task: "Simplify.", expr: "x" + sup(a) + " ÷ x" + sup(b),
      correct: { html: xp(a - b) },
      wrong: [{ html: "x" + sup(a + b), why: "You added the exponents. Adding is for multiplication. Division cancels x's, so you subtract." },
              { html: "x" + sup(b - a), why: "You subtracted the wrong way round. It is top exponent minus bottom exponent." },
              { html: (a % b === 0 ? "x" + sup(a / b) : "x" + sup(a * b)), why: (a % b === 0 ? "You divided the exponents. Division of powers subtracts the exponents." : "You multiplied the exponents. Division of powers subtracts them.") }],
      walk: [a + " x's on top, " + b + " underneath. Each x underneath cancels one on top.",
             a + " − " + b + " = " + (a - b) + " x's are left: " + m_(xp(a - b)) + "."] };
  }
  if (t === "combo") {
    const a = ri(2, 5), b = ri(2, 4), c = ri(1, 3), ans = a * b - c;
    return { task: "Simplify.", expr: "(x" + sup(a) + ")" + sup(b) + " ÷ x" + sup(c),
      correct: { html: xp(ans) },
      wrong: [{ html: xp(a + b - c), why: "You added a and b. A power of a power multiplies them: " + a + " × " + b + " = " + (a * b) + ", then subtract " + c + "." },
              { html: xp(a * b + c), why: "You added the last exponent. Dividing subtracts it." },
              { html: xp(a * b / c === Math.floor(a * b / c) ? a * b / c : a * b * c), why: "The division of powers subtracts exponents; it does not divide or multiply them." }],
      walk: ["Power of a power first: (x" + sup(a) + ")" + sup(b) + " = x" + sup(a * b) + ".",
             "Then divide: subtract " + c + ". " + (a * b) + " − " + c + " = " + ans + ", so " + m_(xp(ans)) + "."] };
  }
  const c = ri(2, 9);
  return { task: "Simplify.", expr: c + "x" + sup(0),
    correct: { html: String(c) },
    wrong: [{ html: "1", why: "The exponent 0 only applies to the x, not to the " + c + ". So x⁰ becomes 1 and the " + c + " stays." },
            { html: "0", why: "Anything to the power 0 is 1, not 0. So x⁰ = 1, and " + c + " × 1 = " + c + "." },
            { html: c + "x", why: "x⁰ is 1, so the x disappears. You kept it as x¹." }],
    walk: ["x" + sup(0) + " = 1 for any x that is not zero.", "So " + c + "x" + sup(0) + " = " + c + " × 1 = " + m_(String(c)) + "."] };
};

/* ---- 2 fraction and negative exponents ---- */
CP.G.frac = function (tier) {
  let m, q, base;
  do { m = ri(2, tier === 2 ? 6 : 5); q = tier === 0 ? 2 : pick([2, 3]); base = Math.pow(m, q); } while (base > (tier === 2 ? 216 : 125));
  const p = tier === 0 ? ri(1, 2) : ri(1, 3), s = tier === 0 ? 1 : pick([1, 1, -1]), val = Math.pow(m, p);
  const correct = s > 0 ? { html: String(val), n: val } : { html: "1/" + val, n: 1 / val };
  const wrong = [];
  if (s > 0) {
    wrong.push({ html: "1/" + val, n: 1 / val, why: "You took one over, but the exponent is positive. One over is only for a negative exponent." });
    if (p > 1) wrong.push({ html: String(m), n: m, why: "You took the " + root(q) + " root but stopped there. The top number, " + p + ", says to raise that to the power " + p + "." });
    const mult = base * p / q; if (Number.isInteger(mult)) wrong.push({ html: String(mult), n: mult, why: "You multiplied " + base + " by " + p + "/" + q + ". A fraction exponent is a root and a power, not a multiplier." });
    wrong.push({ html: String(m * p), n: m * p, why: "You multiplied the root by " + p + " instead of raising it to the power " + p + "." });
    wrong.push({ html: M + val, n: -val, why: "Nothing here makes the answer negative." });
  } else {
    wrong.push({ html: String(val), n: val, why: "You ignored the minus sign. A negative exponent means one over the result." });
    wrong.push({ html: M + val, n: -val, why: "A negative exponent never makes the answer negative. It means one over." });
    if (p > 1) wrong.push({ html: "1/" + m, n: 1 / m, why: "You took the root and the one-over, but forgot to raise to the power " + p + "." });
    wrong.push({ html: M + "1/" + val, n: -1 / val, why: "Right size, wrong sign. The minus in the exponent means one over. It does not also make the answer negative." });
  }
  return { task: "Work it out in your head.", expr: base + "<sup>" + (s < 0 ? M : "") + p + "/" + q + "</sup>",
    correct, wrong, truthN: Math.pow(base, s * p / q),
    walk: ["The bottom of the fraction is " + q + ", so take the " + root(q) + " root of " + base + ": that is " + m + ".",
           p > 1 ? "The top is " + p + ", so raise it to that power: " + m + sup(p) + " = " + val + "." : "The top is 1, so there is no power to apply.",
           s < 0 ? "The minus sign means one over, so the answer is " + m_("1/" + val) + "." : "So the answer is " + m_(String(val)) + "."] };
};

/* ---- 3 slope and rate of change ---- */
CP.G.slope = function (tier) {
  if (tier === 0 || (tier === 1 && Math.random() < 0.5)) {
    const R = tier === 0 ? 4 : 6;
    const x1 = ri(-R, R - 1), dx = tier === 0 ? ri(1, 3) : nz(-4, 4), x2 = x1 + dx, m = tier === 0 ? ri(1, 4) : nz(-4, 4), y1 = ri(-R, R), y2 = y1 + m * dx;
    const inv = frac(dx, m * dx), dy = m * dx;
    return { task: "Find the slope of the line through these two points.",
      expr: "(" + neg(x1) + ", " + neg(y1) + ") and (" + neg(x2) + ", " + neg(y2) + ")",
      correct: { html: neg(m), n: m }, truthN: (y2 - y1) / (x2 - x1),
      wrong: [{ html: inv.html, n: inv.val, why: "You divided run by rise. Slope is rise over run: the change in y goes on top." },
              { html: neg(-m), n: -m, why: "You subtracted in one order on top and the opposite order on the bottom. Keep the same order in both." },
              { html: neg(dy), n: dy, why: "You found the rise, " + neg(dy) + ", but did not divide by the run, " + neg(dx) + "." },
              { html: neg(dy * dx), n: dy * dx, why: "You multiplied rise by run. Slope divides them." }],
      walk: ["Rise: " + neg(y2) + " − (" + neg(y1) + ") = " + neg(dy) + ".", "Run: " + neg(x2) + " − (" + neg(x1) + ") = " + neg(dx) + ".",
             "Slope = rise ÷ run = " + neg(dy) + " ÷ " + neg(dx) + " = " + m_(neg(m)) + "."] };
  }
  const a = tier === 2 ? nz(-4, 4) : nz(-3, 3), p = ri(-3, 2), q = p + ri(1, tier === 2 ? 4 : 3);
  const f = x => a * x * x, rate = a * (p + q);
  const avgH = frac(f(p) + f(q), 2);
  return { task: "Find the average rate of change of f(x) = " + poly([{ c: a, p: 2 }]) + " from x = " + neg(p) + " to x = " + neg(q) + ".",
    expr: "f(x) = " + poly([{ c: a, p: 2 }]),
    correct: { html: neg(rate), n: rate }, truthN: (f(q) - f(p)) / (q - p),
    wrong: [{ html: neg(f(q) - f(p)), n: f(q) - f(p), why: "You found how much f changed, " + neg(f(q) - f(p)) + ", but did not divide by how much x changed, " + (q - p) + "." },
            { html: neg(2 * a * q), n: 2 * a * q, why: "That is the slope of the tangent at x = " + neg(q) + ", the rate at one instant. The question asks for the average over the whole interval." },
            { html: avgH.html, n: avgH.val, why: "You averaged the two heights. Average rate of change is change in height divided by change in x." },
            { html: neg(2 * a * p), n: 2 * a * p, why: "That is the slope of the tangent at x = " + neg(p) + ", the rate at the starting instant, not the average." }],
    walk: ["f(" + neg(q) + ") = " + neg(f(q)) + " and f(" + neg(p) + ") = " + neg(f(p)) + ".",
           "Change in f: " + neg(f(q)) + " − (" + neg(f(p)) + ") = " + neg(f(q) - f(p)) + ". Change in x: " + (q - p) + ".",
           "Average rate of change = " + neg(f(q) - f(p)) + " ÷ " + (q - p) + " = " + m_(neg(rate)) + "."] };
};

/* ---- 4 power rule, one term ---- */
CP.G.pow1 = function (tier) {
  const k = tier === 0 ? pick(["gen", "gen", "gen", "lin"]) : pick(["gen", "gen", "gen", "gen", "lin", "con"]);
  if (k === "gen") {
    const a = tier === 0 ? ri(1, 5) : nz(-9, 9), n = tier === 0 ? ri(2, 3) : tier === 1 ? ri(2, 6) : ri(4, 9);
    return { task: "Find the derivative.", expr: "f(x) = " + poly([{ c: a, p: n }]),
      src: x => a * Math.pow(x, n),
      correct: { html: poly([{ c: a * n, p: n - 1 }]), f: x => a * n * Math.pow(x, n - 1) },
      wrong: [{ html: poly([{ c: a * n, p: n }]), f: x => a * n * Math.pow(x, n), why: "You multiplied by the power but did not lower it. Both beats are needed: multiply, then drop by one." },
              { html: poly([{ c: a, p: n - 1 }]), f: x => a * Math.pow(x, n - 1), why: "You lowered the power but did not multiply by it first." },
              { html: poly([{ c: a * n, p: n + 1 }]), f: x => a * n * Math.pow(x, n + 1), why: "You raised the power instead of lowering it." },
              { html: poly([{ c: a + n, p: n - 1 }]), f: x => (a + n) * Math.pow(x, n - 1), why: "You added the power to the coefficient. The power multiplies it." }],
      walk: ["Bring the " + n + " down and multiply: " + neg(a) + " × " + n + " = " + neg(a * n) + ".", "Drop the power by one: " + n + " − 1 = " + (n - 1) + ".",
             "f′(x) = " + m_(poly([{ c: a * n, p: n - 1 }])) + "."] };
  }
  if (k === "lin") {
    const a = nz(2, 9) * (tier === 0 ? 1 : pick([1, -1]));
    return { task: "Find the derivative.", expr: "f(x) = " + poly([{ c: a, p: 1 }]),
      src: x => a * x,
      correct: { html: neg(a), f: () => a },
      wrong: [{ html: poly([{ c: a, p: 1 }]), f: x => a * x, why: "The x should disappear. x¹ becomes x⁰, which is 1." },
              { html: "0", f: () => 0, why: "Only a constant on its own has derivative 0. " + poly([{ c: a, p: 1 }]) + " changes at a steady rate of " + neg(a) + "." },
              { html: "1", f: () => 1, why: "You dropped the coefficient " + neg(a) + ". It stays: " + neg(a) + " × 1 = " + neg(a) + "." },
              { html: "x", f: x => x, why: "You dropped the coefficient and kept the x. It is the other way round." }],
      walk: ["Think of " + poly([{ c: a, p: 1 }]) + " as " + neg(a) + "x¹.", "Multiply by the power 1, then lower it to x⁰ = 1.",
             "f′(x) = " + m_(neg(a)) + ". Also visible from the graph: a straight line with slope " + neg(a) + "."] };
  }
  const c = nz(-9, 9);
  return { task: "Find the derivative.", expr: "f(x) = " + neg(c),
    src: () => c,
    correct: { html: "0", f: () => 0 },
    wrong: [{ html: neg(c), f: () => c, why: "The derivative measures change. A constant never changes, so its derivative is 0, not the constant itself." },
            { html: "1", f: () => 1, why: "A derivative of 1 would mean it rises one unit for every unit of x. A constant does not rise at all." },
            { html: poly([{ c: c, p: 1 }]), f: x => c * x, why: "That goes the wrong way. You found something whose derivative is " + neg(c) + ", instead of the derivative of " + neg(c) + "." }],
    walk: ["f(x) = " + neg(c) + " is a flat horizontal line.", "A flat line has slope 0 everywhere, so f′(x) = " + m_("0") + "."] };
};

/* ---- 5 power rule, whole polynomials ---- */
CP.G.polyd = function (tier) {
  const nTerms = tier === 2 ? 3 : 2, maxP = tier === 0 ? 3 : 5, cr = tier === 0 ? 5 : 7;
  const ps = []; while (ps.length < nTerms) { const p = ri(1, maxP); if (!ps.includes(p)) ps.push(p); }
  if (!ps.some(p => p >= 2)) ps[0] = ri(2, maxP);
  const F = ps.map(p => ({ c: tier === 0 ? ri(1, cr) : nz(-cr, cr), p })).concat([{ c: nz(-9, 9), p: 0 }]);
  const D = F.filter(o => o.p > 0).map(o => ({ c: o.c * o.p, p: o.p - 1 }));
  const keep = D.concat([F.find(o => o.p === 0)]);
  const noLow = F.filter(o => o.p > 0).map(o => ({ c: o.c * o.p, p: o.p }));
  const noMul = F.filter(o => o.p > 0).map(o => ({ c: o.c, p: o.p - 1 }));
  const Fs = F.slice().sort((a, b) => b.p - a.p);
  const first = [{ c: Fs[0].c * Fs[0].p, p: Fs[0].p - 1 }].concat(Fs.slice(1).filter(o => o.p > 0));
  return { task: "Find the derivative.", expr: "f(x) = " + poly(F),
    src: x => evalT(F, x),
    correct: { html: poly(D), f: x => evalT(D, x) },
    wrong: [{ html: poly(keep), f: x => evalT(keep, x), why: "You kept the constant term. A constant never changes, so its derivative is 0 and it disappears." },
            { html: poly(noLow), f: x => evalT(noLow, x), why: "You multiplied by each power but did not lower any of them." },
            { html: poly(noMul), f: x => evalT(noMul, x), why: "You lowered each power but forgot to multiply by it first." },
            { html: poly(first), f: x => evalT(first, x), why: "You differentiated the first term and copied the rest across. Every term gets the power rule." }],
    walk: F.filter(o => o.p > 0).sort((a, b) => b.p - a.p).map(o => poly([o]) + " becomes " + poly([{ c: o.c * o.p, p: o.p - 1 }]) + ".")
          .concat(["The constant " + neg(F.find(o => o.p === 0).c) + " becomes 0.", "f′(x) = " + m_(poly(D)) + "."]) };
};

/* ---- 6 tangent at a point ---- */
CP.G.tan = function (tier) {
  if (tier === 2) {
    const a = nz(-2, 2), b = nz(-4, 4), c = nz(-6, 6), d = ri(-5, 5), k = nz(-3, 3);
    const F = [{ c: a, p: 3 }, { c: b, p: 2 }, { c: c, p: 1 }, { c: d, p: 0 }], D = [{ c: 3 * a, p: 2 }, { c: 2 * b, p: 1 }, { c: c, p: 0 }];
    const ans = evalT(D, k);
    return { task: "Find the slope of the tangent at x = " + neg(k) + ".", expr: "f(x) = " + poly(F),
      correct: { html: neg(ans), n: ans }, truthN: (evalT(F, k + 1e-6) - evalT(F, k - 1e-6)) / 2e-6,
      wrong: [{ html: neg(evalT(F, k)), n: evalT(F, k), why: "That is f(" + neg(k) + "), the height. The slope is f′(" + neg(k) + ")." },
              { html: neg(evalT([{ c: a, p: 2 }, { c: b, p: 1 }, { c: c, p: 0 }], k)), n: evalT([{ c: a, p: 2 }, { c: b, p: 1 }, { c: c, p: 0 }], k), why: "You lowered every power but did not multiply by it. Both beats, every term." },
              { html: neg(3 * a * k * k + 2 * b * k), n: 3 * a * k * k + 2 * b * k, why: "You dropped the derivative of " + poly([{ c: c, p: 1 }]) + ", which is " + neg(c) + "." },
              { html: neg(evalT(D, k) + d), n: evalT(D, k) + d, why: "You kept the constant " + neg(d) + ". Its derivative is 0." }],
      walk: ["Differentiate: f′(x) = " + poly(D) + ".", "Put in x = " + neg(k) + ".", "Slope of the tangent = " + m_(neg(ans)) + "."] };
  }
  const a = tier === 0 ? ri(1, 2) : nz(-3, 3), b = tier === 0 ? ri(1, 4) : nz(-6, 6), c = ri(-6, 6), k = tier === 0 ? ri(1, 3) : nz(-3, 3);
  const F = [{ c: a, p: 2 }, { c: b, p: 1 }, { c: c, p: 0 }], D = [{ c: 2 * a, p: 1 }, { c: b, p: 0 }];
  const ans = 2 * a * k + b;
  return { task: "Find the slope of the tangent at x = " + neg(k) + ".", expr: "f(x) = " + poly(F),
    correct: { html: neg(ans), n: ans }, truthN: (evalT(F, k + 1e-6) - evalT(F, k - 1e-6)) / 2e-6,
    wrong: [{ html: neg(evalT(F, k)), n: evalT(F, k), why: "That is f(" + neg(k) + "), the height of the curve there. The slope is f′(" + neg(k) + ")." },
            { html: neg(a * k + b), n: a * k + b, why: "You differentiated " + poly([{ c: a, p: 2 }]) + " as " + poly([{ c: a, p: 1 }]) + ". The power rule brings the 2 down: " + poly([{ c: 2 * a, p: 1 }]) + "." },
            { html: neg(2 * a * k), n: 2 * a * k, why: "You dropped the derivative of " + poly([{ c: b, p: 1 }]) + ", which is " + neg(b) + "." },
            { html: neg(2 * a * k * k + b), n: 2 * a * k * k + b, why: "You kept x² after differentiating. The power should drop from 2 to 1." }],
    walk: ["Differentiate: f′(x) = " + poly(D) + ".",
           "Put in x = " + neg(k) + ": " + neg(2 * a) + "(" + neg(k) + ")" + sgnTerm(b, "") + " = " + neg(2 * a * k) + sgnTerm(b, "") + ".",
           "Slope of the tangent = " + m_(neg(ans)) + "."] };
};

/* ---- 7 product rule ---- */
CP.G.prod = function (tier) {
  if (tier === 2) {
    const a = ri(1, 3), b = nz(-4, 4), c = ri(1, 3), d = nz(-4, 4);
    const U = [{ c: a, p: 2 }, { c: b, p: 0 }], V = [{ c: c, p: 1 }, { c: d, p: 0 }];
    const D = [{ c: 3 * a * c, p: 2 }, { c: 2 * a * d, p: 1 }, { c: b * c, p: 0 }];
    return { task: "Find the derivative, and simplify.", expr: "f(x) = " + grp(U) + grp(V),
      src: x => evalT(U, x) * evalT(V, x),
      correct: { html: poly(D), f: x => evalT(D, x) },
      wrong: [{ html: poly([{ c: 2 * a * c, p: 1 }]), f: x => 2 * a * c * x, why: "You multiplied the two derivatives, " + poly([{ c: 2 * a, p: 1 }]) + " and " + neg(c) + ". The derivative of a product is u′v + uv′." },
              { html: poly([{ c: 2 * a * c, p: 2 }, { c: 2 * a * d, p: 1 }]), f: x => 2 * a * x * evalT(V, x), why: "Only u′v. The uv′ half is missing." },
              { html: poly([{ c: a * c, p: 2 }, { c: b * c, p: 0 }]), f: x => c * evalT(U, x), why: "Only uv′. The u′v half is missing." }],
      walk: ["u = " + poly(U) + ", u′ = " + poly([{ c: 2 * a, p: 1 }]) + ". v = " + poly(V) + ", v′ = " + neg(c) + ".",
             "u′v = " + poly([{ c: 2 * a, p: 1 }]) + grp(V) + " = " + poly([{ c: 2 * a * c, p: 2 }, { c: 2 * a * d, p: 1 }]) + ".",
             "uv′ = " + neg(c) + grp(U) + " = " + poly([{ c: a * c, p: 2 }, { c: b * c, p: 0 }]) + ".",
             "Add: f′(x) = " + m_(poly(D)) + "."] };
  }
  const a = tier === 0 ? 1 : ri(1, 4), b = tier === 0 ? ri(1, 5) : nz(-5, 5), c = tier === 0 ? 1 : ri(1, 4), d = tier === 0 ? ri(1, 5) : nz(-5, 5);
  const U = [{ c: a, p: 1 }, { c: b, p: 0 }], V = [{ c: c, p: 1 }, { c: d, p: 0 }];
  const D = [{ c: 2 * a * c, p: 1 }, { c: a * d + b * c, p: 0 }];
  return { task: "Find the derivative, and simplify.", expr: "f(x) = " + grp(U) + grp(V),
    src: x => evalT(U, x) * evalT(V, x),
    correct: { html: poly(D), f: x => evalT(D, x) },
    wrong: [{ html: neg(a * c), f: () => a * c, why: "You multiplied the two derivatives, " + neg(a) + " and " + neg(c) + ". The derivative of a product is not the product of the derivatives. You need u′v + uv′." },
            { html: poly([{ c: a * c, p: 1 }, { c: a * d, p: 0 }]), f: x => a * evalT(V, x), why: "You did only the first half, u′v = " + neg(a) + grp(V) + ". The second half, uv′, is missing." },
            { html: poly([{ c: a * c, p: 1 }, { c: b * c, p: 0 }]), f: x => c * evalT(U, x), why: "You did only the second half, uv′ = " + neg(c) + grp(U) + ". The first half, u′v, is missing." },
            { html: poly([{ c: a * c, p: 1 }, { c: a * d + b * c, p: 0 }]), f: x => a * c * x + a * d + b * c, why: "The x term is short by half. Adding u′v and uv′ gives " + neg(a * c) + "x twice, so " + neg(2 * a * c) + "x." }],
    walk: ["u = " + poly(U) + ", so u′ = " + neg(a) + ". v = " + poly(V) + ", so v′ = " + neg(c) + ".",
           "u′v = " + neg(a) + grp(V) + " = " + poly([{ c: a * c, p: 1 }, { c: a * d, p: 0 }]) + ".",
           "uv′ = " + neg(c) + grp(U) + " = " + poly([{ c: a * c, p: 1 }, { c: b * c, p: 0 }]) + ".",
           "Add them: f′(x) = " + m_(poly(D)) + "."] };
};

/* ---- 8 chain rule ---- */
CP.G.chain = function (tier) {
  const inP = tier === 2 ? 2 : 1;
  const a = tier === 0 ? ri(2, 3) : ri(2, 5), b = tier === 0 ? ri(1, 5) : nz(-6, 6), n = tier === 0 ? ri(2, 4) : ri(2, 5);
  const I = [{ c: a, p: inP }, { c: b, p: 0 }], ie = x => a * Math.pow(x, inP) + b, dIn = [{ c: a * inP, p: inP - 1 }];
  const pw = k => k === 1 ? "" : sup(k);
  const form = (co, k, withX) => (co === 1 ? "" : neg(co)) + (withX ? xp(inP - 1) : "") + grp(I) + pw(k);
  const wx = inP === 2;
  return { task: "Find the derivative.", expr: "f(x) = " + grp(I) + sup(n),
    src: x => Math.pow(ie(x), n),
    correct: { html: form(n * a * inP, n - 1, wx), f: x => n * a * inP * Math.pow(x, inP - 1) * Math.pow(ie(x), n - 1) },
    wrong: [{ html: form(n, n - 1, false), f: x => n * Math.pow(ie(x), n - 1), why: "You forgot to multiply by the derivative of the inside. The inside is " + poly(I) + ", and its derivative is " + poly(dIn) + "." },
            { html: form(n * a * inP, n, wx), f: x => n * a * inP * Math.pow(x, inP - 1) * Math.pow(ie(x), n), why: "You multiplied correctly, but forgot to lower the power from " + n + " to " + (n - 1) + "." },
            { html: form(a * inP, n - 1, wx), f: x => a * inP * Math.pow(x, inP - 1) * Math.pow(ie(x), n - 1), why: "You multiplied by the inside's derivative, but forgot to bring the power " + n + " down in front." }],
    walk: ["Outside: bring the " + n + " down and lower the power: " + n + grp(I) + pw(n - 1) + ". The inside stays exactly as it was.",
           "Inside: the derivative of " + poly(I) + " is " + poly(dIn) + ".",
           "Multiply: f′(x) = " + m_(form(n * a * inP, n - 1, wx)) + "."] };
};

/* ---- 9 sine, cosine, e^x ---- */
CP.G.trigexp = function (tier) {
  const kinds = tier === 0 ? ["sin", "cos", "ex"] : tier === 1 ? ["sin", "cos", "ex", "ekx", "ax", "sinkx"] : ["ekx", "ax", "sinkx", "coskx", "asin"];
  const t = pick(kinds);
  if (t === "sin") return { task: "Find the derivative.", expr: "f(x) = sin x", src: Math.sin,
    correct: { html: "cos x", f: Math.cos },
    wrong: [{ html: M + "cos x", f: x => -Math.cos(x), why: "Wrong sign. At x = 0 the sine graph is climbing, so the slope there is positive, and cos 0 = 1." },
            { html: M + "sin x", f: x => -Math.sin(x), why: "That is what you get by differentiating twice. The first derivative is cos x." },
            { html: "sin x", f: Math.sin, why: "Sine is not its own derivative. That special property belongs to eˣ." }],
    walk: ["At x = 0, sine climbs most steeply: slope 1. At π/2 it peaks and is flat: slope 0. At π it falls most steeply: slope −1.",
           "The slopes 1, 0, −1 trace out cosine, so the derivative is " + m_("cos x") + "."] };
  if (t === "cos") return { task: "Find the derivative.", expr: "f(x) = cos x", src: Math.cos,
    correct: { html: M + "sin x", f: x => -Math.sin(x) },
    wrong: [{ html: "sin x", f: Math.sin, why: "Missing the minus sign. Just after x = 0 the cosine graph is falling, so its slope must be negative." },
            { html: M + "cos x", f: x => -Math.cos(x), why: "That is what you get by differentiating twice. The first derivative is −sin x." },
            { html: "cos x", f: Math.cos, why: "Cosine is not its own derivative. Only eˣ has that property." }],
    walk: ["Cosine starts at its peak at x = 0, so its slope there is 0, and sin 0 = 0.",
           "Just after 0, cosine falls, so the slope is negative. That is why the answer carries a minus: " + m_(M + "sin x") + "."] };
  if (t === "ex") return { task: "Find the derivative.", expr: "f(x) = eˣ", src: Math.exp,
    correct: { html: "eˣ", f: Math.exp },
    wrong: [{ html: "x·e<sup>x" + M + "1</sup>", f: x => x * Math.exp(x - 1), why: "That is the power rule, and it does not apply. The x is in the exponent, not the base." },
            { html: "e<sup>x" + M + "1</sup>", f: x => Math.exp(x - 1), why: "Lowering the exponent by one is the power rule, which does not apply to exponentials." },
            { html: "e", f: () => Math.E, why: "The derivative still depends on x. eˣ grows faster the further along you go." }],
    walk: ["e is defined as the one base whose exponential has a slope equal to its own height at every point.", "So the derivative of eˣ is " + m_("eˣ") + ", unchanged."] };
  if (t === "ekx") {
    const k = pick([2, 3, 4, 5, -2, -3]);
    return { task: "Find the derivative.", expr: "f(x) = e<sup>" + neg(k) + "x</sup>", src: x => Math.exp(k * x),
      correct: { html: neg(k) + "e<sup>" + neg(k) + "x</sup>", f: x => k * Math.exp(k * x) },
      wrong: [{ html: "e<sup>" + neg(k) + "x</sup>", f: x => Math.exp(k * x), why: "You forgot the chain rule. The exponent is " + neg(k) + "x, whose derivative is " + neg(k) + ", so multiply by " + neg(k) + "." },
              { html: neg(k) + "x·e<sup>" + neg(k) + "x" + M + "1</sup>", f: x => k * x * Math.exp(k * x - 1), why: "That is the power rule, which does not apply to exponentials." },
              { html: "e<sup>" + neg(k) + "</sup>", f: () => Math.exp(k), why: "The answer must still depend on x. Keep eˣ style, then multiply by the derivative of the exponent." }],
      walk: ["The outside is e to a power, which stays unchanged: e<sup>" + neg(k) + "x</sup>.", "The inside is " + neg(k) + "x, whose derivative is " + neg(k) + ". Multiply.",
             "f′(x) = " + m_(neg(k) + "e<sup>" + neg(k) + "x</sup>") + "."] };
  }
  if (t === "ax") {
    const a = pick([2, 3, 10]);
    return { task: "Find the derivative.", expr: "f(x) = " + a + "ˣ", src: x => Math.pow(a, x),
      correct: { html: a + "ˣ · ln " + a, f: x => Math.pow(a, x) * Math.log(a) },
      wrong: [{ html: "x·" + a + "<sup>x" + M + "1</sup>", f: x => x * Math.pow(a, x - 1), why: "That is the power rule, which does not apply. The x is in the exponent." },
              { html: a + "ˣ", f: x => Math.pow(a, x), why: "Only eˣ is its own derivative. Any other base picks up a factor of ln " + a + "." },
              { html: a + "ˣ / ln " + a, f: x => Math.pow(a, x) / Math.log(a), why: "Right idea, wrong direction. You multiply by ln " + a + ", not divide." }],
      walk: ["Every exponential's derivative is itself times a constant. For base " + a + ", that constant is ln " + a + " ≈ " + Math.log(a).toFixed(3) + ".",
             "f′(x) = " + m_(a + "ˣ · ln " + a) + ". For base e, ln e = 1, which is why eˣ is its own derivative."] };
  }
  if (t === "coskx") {
    const k = pick([2, 3, 4, 5]);
    return { task: "Find the derivative.", expr: "f(x) = cos(" + k + "x)", src: x => Math.cos(k * x),
      correct: { html: M + k + " sin(" + k + "x)", f: x => -k * Math.sin(k * x) },
      wrong: [{ html: k + " sin(" + k + "x)", f: x => k * Math.sin(k * x), why: "Missing the minus. Cosine differentiates to negative sine." },
              { html: M + "sin(" + k + "x)", f: x => -Math.sin(k * x), why: "You forgot the chain rule. The inside " + k + "x has derivative " + k + "." },
              { html: M + k + " sin x", f: x => -k * Math.sin(x), why: "The inside does not change when you differentiate the outside. It stays as " + k + "x." }],
      walk: ["Outside: cosine becomes negative sine, inside left alone: −sin(" + k + "x).", "Inside: the derivative of " + k + "x is " + k + ". Multiply.",
             "f′(x) = " + m_(M + k + " sin(" + k + "x)") + "."] };
  }
  if (t === "asin") {
    const a = ri(2, 6), k = pick([2, 3, 4]);
    return { task: "Find the derivative.", expr: "f(x) = " + a + " sin(" + k + "x)", src: x => a * Math.sin(k * x),
      correct: { html: (a * k) + " cos(" + k + "x)", f: x => a * k * Math.cos(k * x) },
      wrong: [{ html: a + " cos(" + k + "x)", f: x => a * Math.cos(k * x), why: "You forgot the chain rule. Multiply by the derivative of " + k + "x, which is " + k + "." },
              { html: k + " cos(" + k + "x)", f: x => k * Math.cos(k * x), why: "You dropped the " + a + " out front. A constant multiplier stays." },
              { html: M + (a * k) + " sin(" + k + "x)", f: x => -a * k * Math.sin(k * x), why: "Sine differentiates to cosine, not to negative sine." }],
      walk: ["The " + a + " stays. Sine becomes cosine with the inside left alone: " + a + " cos(" + k + "x).", "Multiply by the inside's derivative, " + k + ".",
             "f′(x) = " + m_((a * k) + " cos(" + k + "x)") + "."] };
  }
  const k = pick([2, 3, 4, 5]);
  return { task: "Find the derivative.", expr: "f(x) = sin(" + k + "x)", src: x => Math.sin(k * x),
    correct: { html: k + " cos(" + k + "x)", f: x => k * Math.cos(k * x) },
    wrong: [{ html: "cos(" + k + "x)", f: x => Math.cos(k * x), why: "You forgot the chain rule. The inside is " + k + "x, whose derivative is " + k + ", so multiply by " + k + "." },
            { html: k + " cos x", f: x => k * Math.cos(x), why: "The inside does not change when you differentiate the outside. It stays as " + k + "x." },
            { html: M + k + " cos(" + k + "x)", f: x => -k * Math.cos(k * x), why: "Sine differentiates to positive cosine. The minus only appears when differentiating cosine." }],
    walk: ["Outside: sine becomes cosine, with the inside left alone: cos(" + k + "x).", "Inside: the derivative of " + k + "x is " + k + ". Multiply.",
           "f′(x) = " + m_(k + " cos(" + k + "x)") + "."] };
};

/* ---- 10 maximums and minimums ---- */
CP.G.maxmin = function (tier) {
  if (tier === 0 || (tier === 1 && Math.random() < 0.5)) {
    const a = tier === 0 ? pick([1, -1]) : nz(-3, 3), h = nz(-4, 4); let k; do { k = ri(-6, 6); } while (k === h || k === -h || k === 0);
    const F = [{ c: a, p: 2 }, { c: -2 * a * h, p: 1 }, { c: a * h * h + k, p: 0 }];
    return { task: "At what x is the tangent horizontal?", expr: "f(x) = " + poly(F),
      correct: { html: "x = " + neg(h), n: h }, truthN: h,
      wrong: [{ html: "x = " + neg(-h), n: -h, why: "Sign slip. Setting " + poly([{ c: 2 * a, p: 1 }, { c: -2 * a * h, p: 0 }]) + " = 0 gives x = " + neg(h) + "." },
              { html: "x = " + neg(k), n: k, why: "That is the height of the turning point, not where it is. The turning point is at (" + neg(h) + ", " + neg(k) + ")." },
              { html: "x = 0", n: 0, why: "You set x = 0. Set f′(x) = 0 and solve for x instead." }],
      walk: ["f′(x) = " + poly([{ c: 2 * a, p: 1 }, { c: -2 * a * h, p: 0 }]) + ".",
             "Set it to zero: " + poly([{ c: 2 * a, p: 1 }]) + " = " + neg(2 * a * h) + ", so x = " + neg(h) + ".",
             "The tangent is horizontal at " + m_("x = " + neg(h)) + ". It is a " + (a > 0 ? "minimum" : "maximum") + ", because the parabola opens " + (a > 0 ? "up" : "down") + "."] };
  }
  const p = ri(1, tier === 2 ? 4 : 3), c = ri(-5, 5), atPos = Math.random() < 0.5, x0 = atPos ? p : -p;
  const F = [{ c: 1, p: 3 }, { c: -3 * p * p, p: 1 }, { c: c, p: 0 }];
  const isMin = x0 > 0;
  const MX = "A local maximum", MN = "A local minimum", INF = "A point of inflection", NOT = "Nothing special: the slope is not zero there";
  const right = isMin ? MN : MX;
  const whys = {
    [MX]: "f″(" + neg(x0) + ") = 6 × " + neg(x0) + " = " + neg(6 * x0) + ", which is positive. Positive means concave up, a valley, so it is a minimum.",
    [MN]: "f″(" + neg(x0) + ") = 6 × " + neg(x0) + " = " + neg(6 * x0) + ", which is negative. Negative means concave down, a hill, so it is a maximum.",
    [INF]: "An inflection point needs f″ = 0. Here f″(" + neg(x0) + ") = " + neg(6 * x0) + ", which is not zero.",
    [NOT]: "Check it: f′(" + neg(x0) + ") = 3(" + neg(x0) + ")² − " + (3 * p * p) + " = 0. The tangent is horizontal there."
  };
  return { task: "What happens at x = " + neg(x0) + "?", expr: "f(x) = " + poly(F),
    correct: { html: right }, wrong: [MX, MN, INF, NOT].filter(s => s !== right).map(s => ({ html: s, why: whys[s] })), prose: true,
    walk: ["f′(x) = 3x² − " + (3 * p * p) + ", which is 0 at x = " + p + " and x = " + M + p + ". So x = " + neg(x0) + " is a flat point.",
           "f″(x) = 6x, so f″(" + neg(x0) + ") = " + neg(6 * x0) + ", which is " + (isMin ? "positive: concave up." : "negative: concave down."),
           "So x = " + neg(x0) + " is " + m_(right.toLowerCase()) + "."] };
};

/* ---- 11 vector basics ---- */
CP.G.vbasic = function (tier) {
  const dim = tier === 0 ? 2 : 3, R = tier === 2 ? 9 : 6;
  const t = tier === 0 ? pick(["add", "len"]) : pick(["add", "len", "len", "scale"]);
  if (t === "add") {
    const u = rv(-R, R, dim), v = rv(-R, R, dim), minus = tier === 0 ? false : Math.random() < 0.4, ans = minus ? sub(u, v) : add(u, v);
    const slip = ans.slice(); slip[1] = minus ? u[1] + v[1] : u[1] - v[1];
    return { task: "Find " + (minus ? "u − v" : "u + v") + ".", expr: "u = " + vec(u) + ", &nbsp;v = " + vec(v),
      correct: { html: vec(ans), v: ans }, truthV: ans,
      wrong: [{ html: vec(minus ? add(u, v) : sub(u, v)), v: minus ? add(u, v) : sub(u, v), why: "You " + (minus ? "added" : "subtracted") + " instead of " + (minus ? "subtracting" : "adding") + "." },
              { html: vec(u.map((x, i) => x * v[i])), v: u.map((x, i) => x * v[i]), why: "You multiplied matching components. Adding vectors adds matching components." },
              { html: vec(slip), v: slip, why: "Sign slip in the second component. Check each one: " + neg(u[1]) + (minus ? " − " : " + ") + "(" + neg(v[1]) + ") = " + neg(ans[1]) + "." }],
      walk: ["Work one component at a time.", "First: " + neg(u[0]) + (minus ? " − " : " + ") + "(" + neg(v[0]) + ") = " + neg(ans[0]) + ". Then the rest the same way.",
             "So the answer is " + m_(vec(ans)) + "."] };
  }
  if (t === "len") {
    const three = dim === 3 && Math.random() < 0.6;
    const T = three ? pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9], [3, 4, 12, 13]]) : pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25]]);
    const L = T[T.length - 1], comps = shuffle(T.slice(0, -1)).map(x => x * (tier === 0 ? 1 : pick([1, -1])));
    const sumAbs = comps.reduce((s, x) => s + Math.abs(x), 0), sq = L * L, sumS = comps.reduce((s, x) => s + x, 0);
    return { task: "Find the length of this vector.", expr: vec(comps),
      correct: { html: String(L), n: L }, truthN: Math.sqrt(comps.reduce((s, x) => s + x * x, 0)),
      wrong: [{ html: String(sumAbs), n: sumAbs, why: "You added the sizes of the components. Pythagoras squares them first, then takes a square root at the end." },
              { html: String(sq), n: sq, why: "You squared and added correctly, but forgot the square root at the end." },
              { html: neg(sumS), n: sumS, why: "You added the components. Length is never found by adding: square, add, then root." },
              { html: String(L + 1), n: L + 1, why: "Close, but check the squares: " + comps.map(x => "(" + neg(x) + ")²").join(" + ") + " = " + sq + ", and √" + sq + " = " + L + "." }],
      walk: ["Square each component: " + comps.map(x => "(" + neg(x) + ")² = " + (x * x)).join(", ") + ".", "Add them: " + sq + ".",
             "Take the square root: √" + sq + " = " + m_(String(L)) + "."] };
  }
  const u = rv(-5, 5, dim); let k; do { k = nz(-4, 4); } while (k === 1);
  const ans = u.map(x => k * x);
  const partial = u.slice(); partial[0] = k * u[0];
  return { task: "Find " + neg(k) + "u.", expr: "u = " + vec(u),
    correct: { html: vec(ans), v: ans }, truthV: ans,
    wrong: [{ html: vec(partial), v: partial, why: "You multiplied only the first component. A scalar multiplies every component." },
            { html: vec(u.map(x => x + k)), v: u.map(x => x + k), why: "You added " + neg(k) + " to each component. A scalar multiple multiplies." },
            { html: vec(u.map(x => -k * x)), v: u.map(x => -k * x), why: "Sign slip. Multiply each component by " + neg(k) + ", keeping track of negatives." }],
    walk: ["Multiply every component by " + neg(k) + ".", "The answer is " + m_(vec(ans)) + ". It points " + (k > 0 ? "the same way as" : "opposite to") + " u and is " + Math.abs(k) + " times as long."] };
};

/* ---- 12 dot product ---- */
CP.G.dotp = function (tier) {
  const dim = tier === 0 ? 2 : 3, R = tier === 2 ? 7 : 5;
  if (tier === 0 || Math.random() < 0.55) {
    let u, v, prods, ans, j;
    do { u = rv(-R, R, dim); v = rv(-R, R, dim); prods = u.map((x, i) => x * v[i]); ans = dot(u, v); j = prods.findIndex(p => p !== 0); } while (j < 0);
    const slip = ans - 2 * prods[j];
    const sumAll = u.concat(v).reduce((s, x) => s + x, 0);
    return { task: "Find u · v.", expr: "u = " + vec(u) + ", &nbsp;v = " + vec(v),
      correct: { html: neg(ans), n: ans }, truthN: ans,
      wrong: [{ html: vec(prods), n: NaN, why: "You multiplied the pairs but stopped. The dot product adds them to make a single number." },
              { html: neg(slip), n: slip, why: "Sign slip on one product. (" + neg(u[j]) + ")(" + neg(v[j]) + ") = " + neg(prods[j]) + "." },
              { html: neg(sumAll), n: sumAll, why: "You added all the numbers. The dot product multiplies matching pairs first." }],
      walk: ["Multiply matching pairs: " + u.map((x, i) => "(" + neg(x) + ")(" + neg(v[i]) + ") = " + neg(prods[i])).join(", ") + ".",
             "Add: " + prods.map(neg).join(" + ") + " = " + m_(neg(ans)) + "."] };
  }
  let a, b; do { a = nz(-5, 5); b = nz(-5, 5); } while (Math.abs(a) === Math.abs(b));
  const k = pick([1, 2, -1]), u = [a, b], good = [-b * k, a * k];
  const cands = [{ v: [a * pick([1, 2]), b], why: "This points the same way as u. Parallel is the opposite of perpendicular." },
                 { v: [b, a], why: null }, { v: [-a, b], why: null }, { v: [a, -b], why: null }]
    .filter(o => !parallel(o.v, good) && dot(o.v, u) !== 0);
  cands.forEach(o => { const d = dot(o.v, u); o.why = o.why || ("Its dot product with u is (" + neg(a) + ")(" + neg(o.v[0]) + ") + (" + neg(b) + ")(" + neg(o.v[1]) + ") = " + neg(d) + ". Not zero, so not perpendicular."); });
  return { task: "Which vector is perpendicular to u?", expr: "u = " + vec(u),
    correct: { html: vec(good), v: good }, perpTo: u, wrong: cands.map(o => ({ html: vec(o.v), v: o.v, why: o.why })),
    walk: ["Perpendicular means the dot product is 0.",
           "Check " + vec(good) + ": (" + neg(a) + ")(" + neg(good[0]) + ") + (" + neg(b) + ")(" + neg(good[1]) + ") = " + neg(a * good[0]) + " + " + neg(b * good[1]) + " = 0.",
           "A quick way to build one in two dimensions: swap the components and change one sign. (a, b) becomes (−b, a)."] };
};

/* ---- 13 cross product ---- */
CP.G.crossp = function (tier) {
  const R = tier === 0 ? 2 : tier === 1 ? 3 : 5;
  let u, v, w; do { u = rv(-R, R); v = rv(-R, R); w = cross(u, v); } while (isZero(w) || w[1] === 0);
  const mid = [w[0], -w[1], w[2]], rev = w.map(x => -x), prods = u.map((x, i) => x * v[i]);
  return { task: "Find u × v.", expr: "u = " + vec(u) + ", &nbsp;v = " + vec(v),
    correct: { html: vec(w), v: w }, truthV: w,
    wrong: [{ html: vec(mid), v: mid, why: "Sign slip in the middle component, the most common cross product error. It is u₃v₁ − u₁v₃, in that order." },
            { html: vec(rev), v: rev, why: "Every sign is flipped: you worked out v × u. Order matters, and v × u = −(u × v)." },
            { html: vec(prods), v: prods, why: "You multiplied matching components. That is the start of a dot product, not a cross product." }],
    walk: ["First: (" + neg(u[1]) + ")(" + neg(v[2]) + ") − (" + neg(u[2]) + ")(" + neg(v[1]) + ") = " + neg(w[0]) + ".",
           "Second: (" + neg(u[2]) + ")(" + neg(v[0]) + ") − (" + neg(u[0]) + ")(" + neg(v[2]) + ") = " + neg(w[1]) + ".",
           "Third: (" + neg(u[0]) + ")(" + neg(v[1]) + ") − (" + neg(u[1]) + ")(" + neg(v[0]) + ") = " + neg(w[2]) + ".",
           "Check: its dot product with u and with v is 0 both times, so " + m_(vec(w)) + " is at right angles to both."] };
};

/* ---- 14 lines in space ---- */
CP.G.lines = function (tier) {
  const R = tier === 2 ? 6 : 4;
  if (tier === 0 || (tier === 1 && Math.random() < 0.5)) {
    let P, Q; do { P = rv(-R, R); Q = rv(-R, R); } while (P.join() === Q.join());
    const d = sub(Q, P), nzc = d.filter(Boolean).length;
    const cands = [{ v: add(P, Q), why: "You added the points. Direction comes from subtracting: where you end minus where you start." },
                   { v: P.slice(), why: "That is a point, P itself, not a direction." }];
    if (nzc >= 2) { const j = d.findIndex(Boolean), s = d.slice(); s[j] = -s[j]; cands.push({ v: s, why: "Sign slip in one component. Check each: Q minus P, component by component." }); }
    cands.push({ v: Q.slice(), why: "That is a point, Q itself, not a direction." });
    const wrong = cands.filter(o => !isZero(o.v) && !parallel(o.v, d)).map(o => ({ html: vec(o.v), v: o.v, why: o.why }));
    return { task: "Which is a direction vector for the line through P and Q?", expr: "P " + vec(P) + " &nbsp;and&nbsp; Q " + vec(Q),
      correct: { html: vec(d), v: d }, dirOf: d, wrong,
      walk: ["Direction = Q − P, one component at a time.",
             "(" + neg(Q[0]) + " − " + neg(P[0]) + ", " + neg(Q[1]) + " − " + neg(P[1]) + ", " + neg(Q[2]) + " − " + neg(P[2]) + ") = " + m_(vec(d)) + ".",
             "P − Q would also work. It points the opposite way along the same line."] };
  }
  const P = rv(-R, R), d = rv(-3, 3), t = pick([2, -1, 3, -2]);
  const on = P.map((x, i) => x + t * d[i]);
  const off = j => { const w = on.slice(); w[j] += pick([1, -1]); return w; };
  const cands = [{ v: d.slice(), why: "That is the direction vector itself. It is not usually a point on the line." }, { v: off(0), why: null }, { v: off(2), why: null }, { v: off(1), why: null }];
  const onLine = w => isZero(cross(sub(w, P), d));
  const wrong = cands.filter(o => !onLine(o.v)).map(o => ({ html: vec(o.v), v: o.v, why: o.why || "Close, but one coordinate misses. Try the value of t that fixes the other two, and check every component." }));
  return { task: "Which point lies on this line?", expr: "r = " + vec(P) + " + t" + vec(d),
    correct: { html: vec(on), v: on }, onLine: { P, d }, wrong,
    walk: ["Every point on the line is P plus some multiple of the direction.", "Try t = " + neg(t) + ": " + vec(P) + " + " + neg(t) + vec(d) + " = " + m_(vec(on)) + ".",
           "Every component has to work for the same t. That is the whole test."] };
};

/* Build a ready-to-render problem: dedupe options, shuffle, retry if a generator cannot produce three distinct traps. */
const keyOf = h => String(h).replace(/<[^>]+>/g, "").replace(/\s+/g, "");
CP.build = function (stepId, tier) {
  const gen = CP.G[stepId];
  for (let tries = 0; tries < 60; tries++) {
    const p = gen(tier);
    const seen = new Set([keyOf(p.correct.html)]), w = [];
    for (const o of p.wrong) { const k = keyOf(o.html); if (!seen.has(k)) { seen.add(k); w.push(o); } }
    if (w.length >= 3) {
      p.wrong = w.slice(0, 3);
      p.options = shuffle([Object.assign({ ok: true }, p.correct)].concat(p.wrong.map(o => Object.assign({ ok: false }, o))));
      return p;
    }
  }
  throw new Error("could not build " + stepId);
};

/* Strip functions so a problem can be stored. */
CP.freeze = function (p, stepId, tier) {
  return { step: stepId, tier, task: p.task, expr: p.expr, prose: !!p.prose, walk: p.walk,
    options: p.options.map(o => ({ html: o.html, ok: !!o.ok, why: o.why || "" })) };
};

CP.gutil = { shuffle, pick, ri };
})();
