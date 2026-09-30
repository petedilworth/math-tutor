/* Chalk and Paper – problem generators, part two
   Forward problems (tiers 0–2) for the ten steps in content-more.js.
   Same contract as generators.js; checked by tools/verify.js. */

window.CP = window.CP || {};
(function () {
const { M, neg, ri, nz, pick, shuffle, gcd, sup, xp, poly, evalT, grp, frac, vec, dot, cross, sub, add, isZero, parallel, rv, m_ } = CP.h;

/* a sum of terms with any variable part: [{c, s}] where s is html such as "x", "h", "xh" or "" */
function lin(terms) {
  const t = terms.filter(o => o.c !== 0);
  if (!t.length) return "0";
  return t.map((o, i) => {
    const m = Math.abs(o.c), body = o.s ? (m === 1 ? "" : m) + o.s : String(m);
    return i === 0 ? (o.c < 0 ? M : "") + body : (o.c < 0 ? " " + M + " " : " + ") + body;
  }).join("");
}
const sq = s => s + sup(2), cu = s => s + sup(3);
const eqn = (n, d) => lin([{ c: n[0], s: "x" }, { c: n[1], s: "y" }, { c: n[2], s: "z" }]) + " = " + neg(d);
const len = v => Math.sqrt(dot(v, v));
const redV = v => { const g = v.reduce((a, x) => gcd(a, x), 0) || 1; return v.map(x => x / g); };
/* integer-length vectors, for tidy lengths */
const PYTH = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [0, 3, 4, 5], [0, 5, 12, 13], [0, 6, 8, 10]];
function pythVec() {
  const T = pick(PYTH), v = shuffle(T.slice(0, 3)).map(x => x * pick([1, -1]));
  return { v: v.map(x => x === 0 ? 0 : x), L: T[3] };
}
CP.h.lin = lin; CP.h.eqn = eqn; CP.h.pythVec = pythVec; CP.h.redV = redV; CP.h.len = len;

/* ---- first principles ---- */
CP.G.firstp = function (tier) {
  if (tier === 0) {
    const a = ri(1, 5), k = ri(1, 4), f = x => a * x * x;
    return { task: "Use the limit definition to find f′(" + k + ").", expr: "f(x) = " + poly([{ c: a, p: 2 }]) + "<br><span class=\"small\">lim<sub>h→0</sub> [f(" + k + " + h) − f(" + k + ")] ÷ h</span>",
      correct: { html: String(2 * a * k), n: 2 * a * k }, truthN: (f(k + 1e-6) - f(k - 1e-6)) / 2e-6,
      wrong: [{ html: String(a * k * k), n: a * k * k, why: "That is f(" + k + "), the height of the curve. The limit gives the slope." },
              { html: String(a * (2 * k + 1)), n: a * (2 * k + 1), why: "You put h = 1 instead of letting h shrink to 0. That is the slope of a secant line, not the tangent." },
              { html: String(a * k), n: a * k, why: "Expanding (" + k + " + h)² gives a middle term 2 × " + k + " × h. You lost the 2." },
              { html: String(2 * k), n: 2 * k, why: "You dropped the " + a + " in front. It multiplies every term." }],
      walk: ["f(" + k + " + h) = " + a + "(" + k + " + h)² = " + lin([{ c: a * k * k, s: "" }, { c: 2 * a * k, s: "h" }, { c: a, s: sq("h") }]) + ".",
             "Subtract f(" + k + ") = " + (a * k * k) + ": " + lin([{ c: 2 * a * k, s: "h" }, { c: a, s: sq("h") }]) + ".",
             "Divide by h: " + lin([{ c: 2 * a * k, s: "" }, { c: a, s: "h" }]) + ".",
             "Let h → 0: f′(" + k + ") = " + m_(String(2 * a * k)) + "."] };
  }
  if (tier === 1) {
    const a = nz(-4, 4), b = nz(-6, 6), c = ri(-5, 5), F = [{ c: a, p: 2 }, { c: b, p: 1 }, { c: c, p: 0 }];
    return { task: "Simplify the difference quotient [f(x + h) − f(x)] ÷ h.", expr: "f(x) = " + poly(F), dq: x => evalT(F, x),
      correct: { html: lin([{ c: 2 * a, s: "x" }, { c: a, s: "h" }, { c: b, s: "" }]), fh: (x, h) => 2 * a * x + a * h + b },
      wrong: [{ html: lin([{ c: 2 * a, s: "x" }, { c: b, s: "" }]), fh: x => 2 * a * x + b, why: "That is the limit, after h → 0. The quotient itself still has an h in it." },
              { html: lin([{ c: a, s: "h" }, { c: b, s: "" }]), fh: (x, h) => a * h + b, why: "You lost the 2ax part. Expanding " + neg(a) + "(x + h)² gives a middle term " + lin([{ c: 2 * a, s: "xh" }]) + ", which becomes " + lin([{ c: 2 * a, s: "x" }]) + " after dividing by h." },
              { html: lin([{ c: 2 * a, s: "x" }, { c: a, s: "h" }]), fh: (x, h) => 2 * a * x + a * h, why: "You dropped the " + neg(b) + ". The term " + poly([{ c: b, p: 1 }]) + " gives " + lin([{ c: b, s: "h" }]) + " after subtracting, then " + neg(b) + " after dividing." },
              { html: lin([{ c: 2 * a, s: "x" }, { c: a, s: sq("h") }, { c: b, s: "" }]), fh: (x, h) => 2 * a * x + a * h * h + b, why: "Dividing " + lin([{ c: a, s: sq("h") }]) + " by h leaves " + lin([{ c: a, s: "h" }]) + ", one h fewer." }],
      walk: ["f(x + h) − f(x) = " + lin([{ c: 2 * a, s: "xh" }, { c: a, s: sq("h") }, { c: b, s: "h" }]) + ". Everything without an h cancels.",
             "Divide every term by h: " + m_(lin([{ c: 2 * a, s: "x" }, { c: a, s: "h" }, { c: b, s: "" }])) + ".",
             "Letting h → 0 would then give the derivative, " + lin([{ c: 2 * a, s: "x" }, { c: b, s: "" }]) + "."] };
  }
  if (Math.random() < 0.5) {
    const a = nz(-6, 6);
    return { task: "Simplify the difference quotient [f(x + h) − f(x)] ÷ h.", expr: "f(x) = " + neg(a) + "/x", dq: x => a / x,
      correct: { html: neg(-a) + " ÷ [x(x + h)]", fh: (x, h) => -a / (x * (x + h)) },
      wrong: [{ html: neg(-a) + " ÷ x²", fh: x => -a / (x * x), why: "That is the limit, after h → 0. The quotient itself still has x + h in it." },
              { html: neg(a) + " ÷ [x(x + h)]", fh: (x, h) => a / (x * (x + h)), why: "Sign slip. The top is " + neg(a) + "x − (" + neg(a) + ")(x + h) = " + lin([{ c: -a, s: "h" }]) + "." },
              { html: neg(-a) + " ÷ (x + h)", fh: (x, h) => -a / (x + h), why: "The common denominator is x(x + h). You lost the x." }],
      walk: ["f(x + h) − f(x) = " + neg(a) + "/(x + h) − (" + neg(a) + "/x) = [" + neg(a) + "x − (" + neg(a) + ")(x + h)] ÷ [x(x + h)] = " + lin([{ c: -a, s: "h" }]) + " ÷ [x(x + h)].",
             "Divide by h: " + m_(neg(-a) + " ÷ [x(x + h)]") + ".", "As h → 0 this becomes " + neg(-a) + "/x², the derivative."] };
  }
  const a = nz(-4, 4);
  return { task: "Simplify the difference quotient [f(x + h) − f(x)] ÷ h.", expr: "f(x) = " + poly([{ c: a, p: 3 }]), dq: x => a * x * x * x,
    correct: { html: lin([{ c: 3 * a, s: sq("x") }, { c: 3 * a, s: "xh" }, { c: a, s: sq("h") }]), fh: (x, h) => 3 * a * x * x + 3 * a * x * h + a * h * h },
    wrong: [{ html: lin([{ c: 3 * a, s: sq("x") }]), fh: x => 3 * a * x * x, why: "That is the limit, after h → 0. The quotient itself still has h in it." },
            { html: lin([{ c: 3 * a, s: sq("x") }, { c: 3 * a, s: "xh" }]), fh: (x, h) => 3 * a * x * x + 3 * a * x * h, why: "You dropped the last term. (x + h)³ ends in h³, which leaves " + lin([{ c: a, s: sq("h") }]) + " after dividing by h." },
            { html: lin([{ c: 3 * a, s: sq("x") }, { c: a, s: "xh" }, { c: a, s: sq("h") }]), fh: (x, h) => 3 * a * x * x + a * x * h + a * h * h, why: "(x + h)³ = x³ + 3x²h + 3xh² + h³. The middle terms both carry a 3." }],
    walk: ["(x + h)³ = x³ + 3x²h + 3xh² + h³.", "Subtract x³ and multiply by " + neg(a) + ": " + lin([{ c: 3 * a, s: sq("x") + "h" }, { c: 3 * a, s: "x" + sq("h") }, { c: a, s: cu("h") }]) + ".",
           "Divide by h: " + m_(lin([{ c: 3 * a, s: sq("x") }, { c: 3 * a, s: "xh" }, { c: a, s: sq("h") }])) + "."] };
};

/* ---- product and chain together ---- */
CP.G.combo = function (tier) {
  const m = tier === 0 ? 1 : tier === 1 ? ri(1, 2) : ri(2, 3);
  const a = tier === 0 ? 1 : ri(2, 3), b = tier === 0 ? ri(1, 4) : tier === 1 ? ri(1, 5) : nz(-5, 5), n = tier === 0 ? 2 : tier === 1 ? ri(2, 3) : ri(3, 4);
  const I = [{ c: a, p: 1 }, { c: b, p: 0 }], ie = x => a * x + b;
  const T = (co, p, ip) => (co === 1 && (p > 0 || ip > 0) ? "" : neg(co)) + xp(p) + (ip === 0 ? "" : grp(I) + (ip === 1 ? "" : sup(ip)));
  const F = (co, p, ip) => x => co * Math.pow(x, p) * Math.pow(ie(x), ip);
  const both = (t1, t2) => ({ html: T(...t1) + " + " + T(...t2), f: x => F(...t1)(x) + F(...t2)(x) });
  const up = [m, m - 1, n], uv = [n * a, m, n - 1];
  return { task: "Find the derivative.", expr: "f(x) = " + xp(m) + grp(I) + sup(n), src: F(1, m, n),
    correct: both(up, uv),
    wrong: [Object.assign(both(up, [n, m, n - 1]), { why: "You forgot the chain rule inside v′. The derivative of " + grp(I) + sup(n) + " carries an extra factor of " + a + "." }),
            { html: T(...up), f: F(...up), why: "Only u′v. The product rule has a second half, uv′." },
            { html: T(m * n * a, m - 1, n - 1), f: F(m * n * a, m - 1, n - 1), why: "You multiplied the two derivatives. The product rule adds u′v and uv′." },
            Object.assign(both(up, [n * a, m, n]), { why: "In uv′ you did not lower the power from " + n + " to " + (n - 1) + "." })],
    walk: ["u = " + xp(m) + ", u′ = " + T(m, m - 1, 0) + ".",
           "v = " + grp(I) + sup(n) + ", v′ = " + n + grp(I) + (n - 1 === 1 ? "" : sup(n - 1)) + " × " + a + " by the chain rule.",
           "f′ = u′v + uv′ = " + m_(T(...up) + " + " + T(...uv)) + "."] };
};

/* ---- exponential rates of change ---- */
CP.G.exprate = function (tier) {
  if (tier === 0) {
    const A = pick([2, 3, 5, 10, 100]), k = pick([2, 3, 4, -2, -3]);
    const E = "e<sup>" + neg(k) + "t</sup>";
    return { task: "Find P′(t).", expr: "P(t) = " + A + E, src: t => A * Math.exp(k * t),
      correct: { html: neg(k * A) + E, f: t => k * A * Math.exp(k * t) },
      wrong: [{ html: A + E, f: t => A * Math.exp(k * t), why: "You forgot the chain rule. The exponent " + neg(k) + "t has derivative " + neg(k) + ", so multiply by it." },
              { html: neg(k * A) + "t·e<sup>" + neg(k) + "t" + M + "1</sup>", f: t => k * A * t * Math.exp(k * t - 1), why: "That is the power rule, which does not apply. The t is in the exponent." },
              { html: neg(k) + E, f: t => k * Math.exp(k * t), why: "You dropped the " + A + ". A constant multiplier stays." }],
      walk: ["The derivative of e<sup>kt</sup> is ke<sup>kt</sup>.", "Keep the " + A + " in front: P′(t) = " + A + " × " + neg(k) + E + " = " + m_(neg(k * A) + E) + ".",
             "So P′(t) = " + neg(k) + " × P(t): the rate is always " + neg(k) + " times the amount."] };
  }
  if (tier === 1) {
    const A = pick([1, 2, 3, 5]), b = pick([2, 3, 5, 10]), pre = A === 1 ? "" : A + " · ";
    return { task: "Find P′(t).", expr: "P(t) = " + pre + b + "<sup>t</sup>", src: t => A * Math.pow(b, t),
      correct: { html: pre + b + "<sup>t</sup> · ln " + b, f: t => A * Math.pow(b, t) * Math.log(b) },
      wrong: [{ html: (A === 1 ? "" : A) + "t · " + b + "<sup>t" + M + "1</sup>", f: t => A * t * Math.pow(b, t - 1), why: "That is the power rule. It does not apply when t is in the exponent." },
              { html: pre + b + "<sup>t</sup>", f: t => A * Math.pow(b, t), why: "Only base e is its own derivative. Base " + b + " picks up a factor of ln " + b + "." },
              { html: pre + b + "<sup>t</sup> ÷ ln " + b, f: t => A * Math.pow(b, t) / Math.log(b), why: "Right idea, wrong way round. Multiply by ln " + b + "; do not divide." }],
      walk: ["Write " + b + "<sup>t</sup> as e<sup>t ln " + b + "</sup>. Its derivative is ln " + b + " × e<sup>t ln " + b + "</sup>.",
             "So P′(t) = " + m_(pre + b + "<sup>t</sup> · ln " + b) + ", about " + Math.log(b).toFixed(3) + " times P(t)."] };
  }
  const k = pick([0.02, 0.03, 0.04, 0.05, 0.06, 0.08]), A = pick([1000, 2000, 5000]);
  let V; do { V = A * ri(2, 6) + pick([0, 500, 1000]); } while (V === A);
  const f2 = x => neg(+x.toFixed(2));
  return { task: "How fast is P growing, per year, at the moment P = " + V.toLocaleString("en-CA") + "?", expr: "P(t) = " + A + "e<sup>" + k + "t</sup>",
    correct: { html: f2(k * V), n: +(k * V).toFixed(2) }, truthN: k * V,
    wrong: [{ html: f2(V), n: V, why: "That is the amount, not its rate of growth. The rate is " + k + " × " + V + "." },
            { html: f2(k * A), n: k * A, why: "That is the rate at the start, when P = " + A + ". The rate grows with P." },
            { html: f2(k * 100 * V), n: k * 100 * V, why: k + " is already a decimal. You used " + (k * 100) + " instead." }],
    walk: ["P′(t) = " + k + " × " + A + "e<sup>" + k + "t</sup> = " + k + " × P(t).", "When P = " + V + ", P′ = " + k + " × " + V + " = " + m_(f2(k * V)) + " a year.",
           "You never need to find t. The rate depends only on the current amount."] };
};

/* ---- motion ---- */
const tp = t => poly(t).replace(/x/g, "t");
const numd = (f, x, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);
CP.G.motion = function (tier) {
  if (tier === 0) {
    const a = nz(-5, 5), b = nz(-9, 9), c = ri(0, 9), T = ri(1, 4), S = [{ c: a, p: 2 }, { c: b, p: 1 }, { c: c, p: 0 }], s = t => evalT(S, t);
    return { task: "Find the velocity at t = " + T + ".", expr: "s(t) = " + tp(S),
      correct: { html: neg(2 * a * T + b), n: 2 * a * T + b }, truthN: numd(s, T),
      wrong: [{ html: neg(s(T)), n: s(T), why: "That is s(" + T + "), the position. Velocity is s′(" + T + ")." },
              { html: neg(a * T + b), n: a * T + b, why: "The derivative of " + tp([{ c: a, p: 2 }]) + " is " + tp([{ c: 2 * a, p: 1 }]) + ": the 2 comes down." },
              { html: neg(2 * a * T), n: 2 * a * T, why: "You dropped the derivative of " + tp([{ c: b, p: 1 }]) + ", which is " + neg(b) + "." },
              { html: neg(2 * a), n: 2 * a, why: "That is the acceleration, s″. The question asks for velocity, s′." }],
      walk: ["v(t) = s′(t) = " + tp([{ c: 2 * a, p: 1 }, { c: b, p: 0 }]) + ".", "v(" + T + ") = " + m_(neg(2 * a * T + b)) + "."] };
  }
  if (tier === 1) {
    const p = nz(-6, 6), q = nz(-9, 9), T = ri(1, 4), S = [{ c: 1, p: 3 }, { c: p, p: 2 }, { c: q, p: 1 }], s = t => evalT(S, t);
    return { task: "Find the acceleration at t = " + T + ".", expr: "s(t) = " + tp(S),
      correct: { html: neg(6 * T + 2 * p), n: 6 * T + 2 * p }, truthN: (s(T + 1e-3) - 2 * s(T) + s(T - 1e-3)) / 1e-6,
      wrong: [{ html: neg(3 * T * T + 2 * p * T + q), n: 3 * T * T + 2 * p * T + q, why: "That is the velocity, s′(" + T + "). Acceleration differentiates once more." },
              { html: neg(s(T)), n: s(T), why: "That is the position. Acceleration is the second derivative." },
              { html: neg(6 * T + p), n: 6 * T + p, why: "The derivative of " + tp([{ c: 2 * p, p: 1 }]) + " is " + neg(2 * p) + ". You kept only " + neg(p) + "." }],
      walk: ["v(t) = " + tp([{ c: 3, p: 2 }, { c: 2 * p, p: 1 }, { c: q, p: 0 }]) + ".", "a(t) = " + tp([{ c: 6, p: 1 }, { c: 2 * p, p: 0 }]) + ".",
             "a(" + T + ") = " + m_(neg(6 * T + 2 * p)) + "."] };
  }
  let r1, r2; do { r1 = ri(1, 5); r2 = ri(r1 + 1, 7); } while ((r1 + r2) % 2);
  const S = [{ c: 1, p: 3 }, { c: -3 * (r1 + r2) / 2, p: 2 }, { c: 3 * r1 * r2, p: 1 }], s = t => evalT(S, t);
  const sh = st => st.map(t => "t = " + neg(t)).join(" and ");
  return { task: "When is the object at rest?", expr: "s(t) = " + tp(S), src: s, rootsD: 1, nroots: 2, prose: true,
    correct: { html: sh([r1, r2]), set: [r1, r2] },
    wrong: [{ html: sh([-r1, -r2]), set: [-r1, -r2], why: "Sign slip. v(t) = 3(t − " + r1 + ")(t − " + r2 + "), which is zero at t = " + r1 + " and t = " + r2 + "." },
            { html: "t = " + neg((r1 + r2) / 2) + " only", set: [(r1 + r2) / 2], why: "That is where acceleration is zero, s″ = 0. At rest means velocity is zero." },
            { html: "t = 0 only", set: [0], why: "At t = 0 the position is 0, but the velocity is " + (3 * r1 * r2) + ". At rest means v = 0." },
            { html: "t = " + r1 + " only", set: [r1], why: "v(t) is a quadratic with two zeros. You missed t = " + r2 + "." }],
    walk: ["v(t) = s′(t) = " + tp([{ c: 3, p: 2 }, { c: -3 * (r1 + r2), p: 1 }, { c: 3 * r1 * r2, p: 0 }]) + ".",
           "Factor: 3(t − " + r1 + ")(t − " + r2 + ").", "At rest at " + m_(sh([r1, r2])) + "."] };
};

/* ---- concavity ---- */
CP.G.concav = function (tier) {
  if (tier === 0) {
    const r = nz(-3, 3), c = nz(-6, 6), d = ri(-5, 5), F = [{ c: 1, p: 3 }, { c: -3 * r, p: 2 }, { c: c, p: 1 }, { c: d, p: 0 }], f = x => evalT(F, x);
    const f2 = x => 6 * x - 6 * r, whyX = x => "f″(" + neg(x) + ") = " + neg(f2(x)) + ", not 0.";
    return { task: "Where is the point of inflection?", expr: "f(x) = " + poly(F), src: f, rootsD: 2, nroots: 1,
      correct: { html: "x = " + neg(r), set: [r] },
      wrong: [{ html: "x = " + neg(-r), set: [-r], why: "Sign slip. " + whyX(-r) },
              { html: "x = 0", set: [0], why: whyX(0) + " x = 0 is not special here." },
              { html: "x = " + neg(3 * r), set: [3 * r], why: "f″(x) = 6x " + (r > 0 ? M + " " : "+ ") + Math.abs(6 * r) + ". You divided by 2 instead of 6. " + whyX(3 * r) },
              { html: "x = " + neg(2 * r), set: [2 * r], why: whyX(2 * r) }],
      walk: ["f′(x) = " + poly([{ c: 3, p: 2 }, { c: -6 * r, p: 1 }, { c: c, p: 0 }]) + ".", "f″(x) = " + poly([{ c: 6, p: 1 }, { c: -6 * r, p: 0 }]) + ", which is zero at x = " + neg(r) + ".",
             "f″ changes sign there, so the inflection is at " + m_("x = " + neg(r)) + "."] };
  }
  if (tier === 1) {
    const a = pick([1, -1, 2, -2]), r = nz(-4, 4), c = nz(-5, 5), F = [{ c: a, p: 3 }, { c: -3 * a * r, p: 2 }, { c: c, p: 1 }], f = x => evalT(F, x);
    const f2 = x => 6 * a * (x - r), up = a > 0 ? [r, Infinity] : [-Infinity, r];
    const ivh = iv => iv[0] === -Infinity ? "x < " + neg(iv[1]) : "x > " + neg(iv[0]);
    const cands = [[r, Infinity], [-Infinity, r], [-r, Infinity], [-Infinity, -r]].filter(iv => ivh(iv) !== ivh(up));
    const why = iv => { for (let k = 1; k < 20; k++) { const x = iv[0] === -Infinity ? iv[1] - k : iv[0] + k; if (f2(x) <= 0) return "At x = " + neg(x) + ", f″ = " + neg(f2(x)) + ", which is " + (f2(x) === 0 ? "zero" : "negative") + ". Not concave up there."; } return "Check the sign of f″ on that interval."; };
    return { task: "Where is f concave up?", expr: "f(x) = " + poly(F), src: f, signD: 2, prose: true,
      correct: { html: ivh(up), iv: up }, wrong: cands.map(iv => ({ html: ivh(iv), iv, why: why(iv) })),
      walk: ["f″(x) = " + poly([{ c: 6 * a, p: 1 }, { c: -6 * a * r, p: 0 }]) + " = " + neg(6 * a) + "(x " + (r > 0 ? M + " " + r : "+ " + (-r)) + ").",
             "It is positive when " + ivh(up) + ".", "So f is concave up for " + m_(ivh(up)) + "."] };
  }
  const q = ri(1, 3), F = [{ c: 1, p: 4 }, { c: -6 * q * q, p: 2 }], f = x => evalT(F, x);
  const f2 = x => 12 * x * x - 12 * q * q;
  return { task: "Where are the points of inflection?", expr: "f(x) = " + poly(F), src: f, rootsD: 2, nroots: 2, prose: true,
    correct: { html: "x = " + q + " and x = " + M + q, set: [q, -q] },
    wrong: [{ html: "x = 0 only", set: [0], why: "f″(0) = " + neg(f2(0)) + ", not 0. x = 0 is a local maximum." },
            { html: "x = " + q + "√3 and x = " + M + q + "√3", set: [q * Math.sqrt(3), -q * Math.sqrt(3)], why: "Those are where f′ = 0, the flat points. Inflection needs f″ = 0." },
            { html: "x = " + q + " only", set: [q], why: "f″(x) = 12x² − " + (12 * q * q) + " is zero at both x = " + q + " and x = " + M + q + "." },
            { html: "x = " + (2 * q) + " and x = " + M + (2 * q), set: [2 * q, -2 * q], why: "f″(" + (2 * q) + ") = " + f2(2 * q) + ", not 0." }],
    walk: ["f′(x) = " + poly([{ c: 4, p: 3 }, { c: -12 * q * q, p: 1 }]) + ".", "f″(x) = " + poly([{ c: 12, p: 2 }, { c: -12 * q * q, p: 0 }]) + " = 12(x² − " + (q * q) + ").",
           "Zero at x = ±" + q + ", and the sign changes at each. So the inflections are at " + m_("x = ±" + q) + "."] };
};

/* ---- optimization ---- */
CP.G.optim = function (tier) {
  if (tier === 0) {
    const S = 2 * ri(5, 20), best = S * S / 4;
    return { task: "Two positive numbers add to " + S + ". What is the largest their product can be?", expr: "x + y = " + S + ", &nbsp;P = xy", prose: false,
      maxOf: { f: x => x * (S - x), lo: 0, hi: S, want: "val" },
      correct: { html: String(best), n: best },
      wrong: [{ html: String(S / 2), n: S / 2, why: "That is each number, " + (S / 2) + ". The question asks for the product." },
              { html: String(S * S / 2), n: S * S / 2, why: "You used P = x · S with x = S/2. The other number is S − x = " + (S / 2) + ", not " + S + "." },
              { html: String(best - 1), n: best - 1, why: "That is " + (S / 2 - 1) + " × " + (S / 2 + 1) + ". Close, but equal numbers do better." }],
      walk: ["P(x) = x(" + S + " − x) = " + S + "x − x².", "P′(x) = " + S + " − 2x = 0, so x = " + (S / 2) + " and y = " + (S / 2) + ".",
             "P = " + (S / 2) + " × " + (S / 2) + " = " + m_(String(best)) + "."] };
  }
  if (tier === 1) {
    const P = 12 * ri(2, 10), best = P * P / 8;
    return { task: "A rectangle along a river is fenced on three sides with " + P + " m of fence. Largest area?", expr: "A = x(" + P + " − 2x)",
      maxOf: { f: x => x * (P - 2 * x), lo: 0, hi: P / 2, want: "val" },
      correct: { html: best.toLocaleString("en-CA") + " m²", n: best },
      wrong: [{ html: (P / 4) + " m²", n: P / 4, why: "That is the best width, " + (P / 4) + " m. The question asks for the area." },
              { html: (P * P / 16).toLocaleString("en-CA") + " m²", n: P * P / 16, why: "That is a square fenced on all four sides. The river saves a side." },
              { html: (P * P / 9).toLocaleString("en-CA") + " m²", n: P * P / 9, why: "Three equal sides, " + (P / 3) + " m each. Equal sides are not best here: A′(x) = 0 gives x = " + (P / 4) + "." }],
      walk: ["A(x) = " + P + "x − 2x², where x is each side at right angles to the river.", "A′(x) = " + P + " − 4x = 0, so x = " + (P / 4) + " and the long side is " + (P / 2) + ".",
             "A = " + (P / 4) + " × " + (P / 2) + " = " + m_(best.toLocaleString("en-CA") + " m²") + "."] };
  }
  const s = 6 * ri(2, 6), V = x => x * (s - 2 * x) * (s - 2 * x);
  const cm = x => neg(+x.toFixed(2)) + " cm";
  return { task: "Squares of side x are cut from the corners of a " + s + " cm square sheet, and the sides folded up. Which x gives the largest box?", expr: "V(x) = x(" + s + " − 2x)²",
    maxOf: { f: V, lo: 0, hi: s / 2, want: "x" },
    correct: { html: cm(s / 6), n: s / 6 },
    wrong: [{ html: cm(s / 2), n: s / 2, why: "At x = " + (s / 2) + " nothing is left to fold: V = 0. It is the other zero of V′." },
            { html: cm(s / 4), n: s / 4, why: "V(" + (s / 4) + ") = " + V(s / 4) + " cm³, less than V(" + (s / 6) + ") = " + V(s / 6) + " cm³." },
            { html: cm(s / 3), n: s / 3, why: "V(" + (s / 3) + ") = " + V(s / 3) + " cm³, less than V(" + (s / 6) + ") = " + V(s / 6) + " cm³." }],
    walk: ["V′(x) = (" + s + " − 2x)² − 4x(" + s + " − 2x) = (" + s + " − 2x)(" + s + " − 6x).", "Zero at x = " + (s / 2) + " (no box) and x = " + (s / 6) + ".",
           "The largest box has " + m_("x = " + (s / 6) + " cm") + ", volume " + V(s / 6) + " cm³."] };
};

/* ---- angles and projections ---- */
const ANG = [[[1, 0, 0], [1, 1, 0], 45], [[1, 0, 0], [0, 1, 0], 90], [[1, 1, 0], [-1, 1, 0], 90], [[1, 0, 0], [-1, 1, 0], 135], [[1, 0, 0], [-1, 0, 0], 180], [[1, 1, 0], [1, 1, 0], 0],
             [[1, 1, 0], [0, 1, 1], 60], [[1, 1, 0], [0, -1, -1], 120], [[1, 0, 1], [0, 1, 1], 60], [[1, -1, 0], [0, 1, -1], 120]];
const degOf = (u, v) => Math.atan2(len(cross(u, v)), dot(u, v)) * 180 / Math.PI; /* atan2 stays exact near 0° and 180° */
CP.h.degOf = degOf;
CP.G.angle = function (tier) {
  if (tier === 0) {
    const [u0, v0, ang] = pick(ANG), perm = shuffle([0, 1, 2]), sg = [0, 1, 2].map(() => pick([1, -1]));
    const tf = w => perm.map((j, i) => w[j] * sg[i] || 0);
    const su = ri(1, 2), sv = ri(1, 3), u = tf(u0).map(x => x * su), v = tf(v0).map(x => x * sv);
    const two = u[2] === 0 && v[2] === 0, show = w => vec(two ? w.slice(0, 2) : w);
    const cosTxt = dg => (Math.round(Math.cos(dg * Math.PI / 180) * 1000) / 1000 || 0).toFixed(3);
    const c = dot(u, v) / (len(u) * len(v));
    const others = shuffle([0, 45, 60, 90, 120, 135, 180].filter(d => d !== ang)).slice(0, 4);
    return { task: "Find the angle between u and v.", expr: "u = " + show(u) + ", &nbsp;v = " + show(v), vecAngle: [u, v],
      correct: { html: ang + "°", n: ang }, truthN: degOf(u, v),
      wrong: others.map(d => ({ html: d + "°", n: d, why: "cos θ = u · v ÷ (|u||v|) = " + neg(dot(u, v)) + " ÷ " + (len(u) * len(v)).toFixed(3).replace(/\.?0+$/, "") + " ≈ " + neg(c.toFixed(3)) + ". cos " + d + "° is " + neg(cosTxt(d)) + ", so not " + d + "°." })),
      walk: ["u · v = " + neg(dot(u, v)) + ". |u| = " + len(u).toFixed(3).replace(/\.?0+$/, "") + ", |v| = " + len(v).toFixed(3).replace(/\.?0+$/, "") + ".",
             "cos θ = " + neg(c.toFixed(3)) + ".", "The angle with that cosine is " + m_(ang + "°") + "."] };
  }
  if (tier === 1) {
    const { v, L } = pythVec(); let u; do { u = rv(-5, 5); } while (dot(u, v) === 0);
    const d = dot(u, v), c = frac(d, L), w1 = frac(d, L * L), w2 = frac(-d, L);
    return { task: "Find the scalar projection of u on v.", expr: "u = " + vec(u) + ", &nbsp;v = " + vec(v),
      correct: { html: c.html, n: c.val }, truthN: d / L,
      wrong: [{ html: neg(d), n: d, why: "That is u · v. Divide by |v| = " + L + " to get the length of the shadow." },
              { html: w1.html, n: w1.val, why: "You divided by |v|² = " + (L * L) + ". That is the multiplier for the vector projection. The scalar projection divides once, by |v| = " + L + "." },
              { html: w2.html, n: w2.val, why: "Sign slip. u · v = " + neg(d) + ", and the sign stays: it says which way the shadow points." }],
      walk: ["u · v = " + neg(d) + ".", "|v| = √" + (L * L) + " = " + L + ".", "Scalar projection = " + neg(d) + " ÷ " + L + " = " + m_(c.html) + "."] };
  }
  let v, w, k; do { v = rv(-3, 3); w = cross(v, rv(-2, 2)); k = nz(-3, 3); } while (isZero(w) || dot(v, v) > 14);
  const u = add(v.map(x => k * x), w), d = dot(u, v), vv = dot(v, v), P = v.map(x => k * x);
  return { task: "Find the vector projection of u on v.", expr: "u = " + vec(u) + ", &nbsp;v = " + vec(v),
    correct: { html: vec(P), v: P }, truthV: v.map(x => d * x / vv),
    wrong: [{ html: vec(v.map(x => d * x)), v: v.map(x => d * x), why: "You multiplied v by u · v = " + neg(d) + " but did not divide by |v|² = " + vv + "." },
            { html: vec(w), v: w, why: "That is the other piece, the part of u at right angles to v. The projection is the part along v." },
            { html: vec(P.map(x => -x)), v: P.map(x => -x), why: "Sign slip. u · v = " + neg(d) + ", so the multiplier is " + neg(k) + "." }],
    walk: ["u · v = " + neg(d) + ", |v|² = " + vv + ".", "Multiplier: " + neg(d) + " ÷ " + vv + " = " + neg(k) + ".", "Projection = " + neg(k) + vec(v) + " = " + m_(vec(P)) + "."] };
};

/* ---- equations of planes ---- */
CP.G.planes = function (tier) {
  if (tier === 0) {
    let n; do { n = rv(-5, 5); } while (n.filter(Boolean).length < 2);
    const P = rv(-4, 4), d = dot(n, P);
    const cands = [{ v: P, why: "That is a point on the plane, not a normal. The normal is read from the coefficients of x, y and z." },
                   { v: cross(n, pick([[1, 0, 0], [0, 1, 0], [0, 0, 1]])), why: "That vector lies along the plane: its dot product with the normal is 0. A normal sticks straight out." },
                   { v: [n[0], n[1], d], why: "The number on the right is not part of the normal. It is the coefficient of z." },
                   { v: [n[1], n[0], n[2]], why: "The order matters: first the coefficient of x, then y, then z." }]
      .filter(o => !isZero(o.v) && !parallel(o.v, n));
    return { task: "Which is a normal vector to this plane?", expr: eqn(n, d), normalOf: n,
      correct: { html: vec(n), v: n }, wrong: cands.map(o => ({ html: vec(o.v), v: o.v, why: o.why })),
      walk: ["In ax + by + cz = d, the normal is (a, b, c).", "Read off the coefficients: " + m_(vec(n)) + ".", "Any multiple of it, such as " + vec(n.map(x => -x)) + ", is also a normal."] };
  }
  if (tier === 1) {
    let n, P; do { n = rv(-4, 4); P = rv(-4, 4); } while (dot(n, P) === 0 || n.filter(Boolean).length < 2);
    const d = dot(n, P), j = [0, 1, 2].find(i => n[i] * P[i] !== 0);
    const pl = (m, e) => ({ html: eqn(m, e), pl: m.concat([e]) });
    const wrong = [Object.assign(pl(n, -d), { why: "Sign slip. d = n · P = " + neg(d) + "." }),
                   Object.assign(pl(n, 0), { why: "That plane goes through the origin. Put P in to find d: n · P = " + neg(d) + "." })];
    if (j !== undefined) wrong.push(Object.assign(pl(n, d - 2 * n[j] * P[j]), { why: "Sign slip in one product. (" + neg(n[j]) + ")(" + neg(P[j]) + ") = " + neg(n[j] * P[j]) + "." }));
    if (!parallel(P, n)) wrong.push(Object.assign(pl(P, dot(P, P)), { why: "You swapped the roles. The normal gives the coefficients; the point gives d." }));
    return { task: "Which is the plane through P with normal n?", expr: "P " + vec(P) + ", &nbsp;n = " + vec(n), plane: { pts: [P], n }, prose: true,
      correct: pl(n, d), wrong,
      walk: ["The coefficients are the normal: " + lin([{ c: n[0], s: "x" }, { c: n[1], s: "y" }, { c: n[2], s: "z" }]) + " = d.", "Put in P: d = " + n.map((x, i) => "(" + neg(x) + ")(" + neg(P[i]) + ")").join(" + ") + " = " + neg(d) + ".",
             "So the plane is " + m_(eqn(n, d)) + "."] };
  }
  let A, B, C, n; do { A = rv(-3, 3); B = rv(-3, 3); C = rv(-3, 3); n = redV(cross(sub(B, A), sub(C, A))); } while (isZero(n) || n.some(x => Math.abs(x) > 12));
  const d = dot(n, A), u = sub(B, A), w = sub(C, A), slip = redV([n[0], -n[1], n[2]]);
  const pl = (m, e) => ({ html: eqn(m, e), pl: m.concat([e]) });
  const wrong = [Object.assign(pl(n, -d), { why: "Sign slip. Put A in: d = n · A = " + neg(d) + "." })];
  if (!parallel(slip, n) && !isZero(slip)) wrong.push(Object.assign(pl(slip, dot(slip, A)), { why: "Middle component of the cross product has the wrong sign. That plane passes through A but misses B or C." }));
  if (!parallel(u, n)) wrong.push(Object.assign(pl(u, dot(u, A)), { why: "B − A lies in the plane. It cannot be the normal; the normal is (B − A) × (C − A)." }));
  wrong.push(Object.assign(pl(n, d + pick([1, -1]) * (Math.abs(n[0]) || 1)), { why: "Right normal, but the point A does not satisfy it. Recompute d = n · A = " + neg(d) + "." }));
  return { task: "Which is the plane through A, B and C?", expr: "A " + vec(A) + ", &nbsp;B " + vec(B) + ", &nbsp;C " + vec(C), plane: { pts: [A, B, C] }, prose: true,
    correct: pl(n, d), wrong,
    walk: ["Two directions in the plane: B − A = " + vec(u) + ", C − A = " + vec(w) + ".", "Normal: their cross product, " + vec(cross(u, w)) + (cross(u, w).join() !== n.join() ? ", or more simply " + vec(n) : "") + ".",
           "d = n · A = " + neg(d) + ", so " + m_(eqn(n, d)) + "."] };
};

/* ---- where a line meets a plane ---- */
CP.G.lineplane = function (tier) {
  if (tier < 2) {
    let P, d, n, t0, X, D;
    do {
      P = rv(-4, 4); d = rv(-3, 3); t0 = nz(-3, 3);
      n = tier === 0 ? pick([[1, 0, 0], [0, 1, 0], [0, 0, 1]]) : rv(-3, 3);
      X = add(P, d.map(x => t0 * x)); D = dot(n, X);
    } while (dot(n, d) === 0);
    const plane = tier === 0 ? "xyz"[n.indexOf(1)] + " = " + neg(D) : eqn(n, D);
    const tf = (D - dot(n, P)) / dot(n, d), tBad = D / dot(n, d), j = ri(0, 2);
    const cands = [{ v: add(P, d.map(x => -t0 * x)), why: "Sign slip in t. Solving gives t = " + neg(t0) + "." },
                   { v: P.slice(), why: "That is the point where t = 0, the start of the line. It is not on the plane." },
                   { v: add(P, d.map(x => (t0 + 1) * x)), why: "That is t = " + neg(t0 + 1) + ". Check: it is on the line, but not on the plane." }];
    if (Number.isInteger(tBad) && tBad !== t0) cands.unshift({ v: add(P, d.map(x => tBad * x)), why: "You found t from n · d alone and forgot the n · P part. Solve " + lin([{ c: dot(n, P), s: "" }, { c: dot(n, d), s: "t" }]) + " = " + neg(D) + "." });
    const off = X.slice(); off[j] += pick([1, -1]); cands.push({ v: off, why: "One coordinate is off. With t = " + neg(t0) + ", check each component of P + td." });
    return { task: "Where does the line meet the plane?", expr: "r = " + vec(P) + " + t" + vec(d) + "<br>" + plane, meet: { P, d, n, D },
      correct: { html: vec(X), v: X }, wrong: cands.map(o => ({ html: vec(o.v), v: o.v, why: o.why })),
      walk: ["Put the line into the plane: " + lin([{ c: dot(n, P), s: "" }, { c: dot(n, d), s: "t" }]) + " = " + neg(D) + ".", "So t = " + neg(tf) + ".",
             "Put t back into the line: " + vec(P) + " + " + neg(t0) + vec(d) + " = " + m_(vec(X)) + "."] };
  }
  const n = rv(-3, 3), cs = pick(["one", "none", "all"]);
  let P = rv(-4, 4), d, D;
  if (cs === "one") { do { d = rv(-3, 3); } while (dot(n, d) === 0); D = dot(n, P) + ri(-6, 6); }
  else { do { d = cross(n, rv(-2, 2)); } while (isZero(d) || d.some(x => Math.abs(x) > 9)); D = cs === "all" ? dot(n, P) : dot(n, P) + nz(-6, 6); }
  const nd = dot(n, d), nP = dot(n, P);
  const LAB = { one: "Exactly one point", none: "No points: the line runs parallel to the plane", all: "Every point: the line lies in the plane", two: "Exactly two points" };
  const WHY = {
    one: "n · d = " + neg(nd) + (nd === 0 ? ", so t cancels out. The line runs parallel to the plane: no single crossing." : "."),
    none: nd !== 0 ? "n · d = " + neg(nd) + ", not 0, so the line is not parallel and must cross once." : "Put P in: n · P = " + neg(nP) + ", which equals " + neg(D) + ". The line sits inside the plane.",
    all: nd !== 0 ? "n · d = " + neg(nd) + ", not 0, so the line crosses the plane at one point only." : "Put P in: n · P = " + neg(nP) + ", not " + neg(D) + ". Parallel, but off to one side.",
    two: "A straight line and a flat plane cannot meet exactly twice. It is one, none, or all."
  };
  return { task: "How many points do the line and the plane share?", expr: "r = " + vec(P) + " + t" + vec(d) + "<br>" + eqn(n, D), meetCase: { P, d, n, D }, prose: true,
    correct: { html: LAB[cs], cs }, wrong: ["one", "none", "all", "two"].filter(k => k !== cs).map(k => ({ html: LAB[k], cs: k, why: WHY[k] })),
    walk: ["n · d = " + neg(nd) + (nd === 0 ? ": the line runs parallel to the plane." : ": not zero, so the line crosses the plane once."),
           nd === 0 ? "Is P on the plane? n · P = " + neg(nP) + " against " + neg(D) + ": " + (nP === D ? "yes, so every point is shared." : "no, so none are.") : "Solve for t to find the point.",
           "Answer: " + m_(LAB[cs].toLowerCase()) + "."] };
};

/* ---- distance from a point to a plane ---- */
CP.G.dist = function (tier) {
  if (tier === 0) {
    const j = ri(0, 2), c = nz(-6, 6); let Q; do { Q = rv(-8, 8); } while (Q[j] === c || Q[j] === 0 || Math.abs(Q[j]) === Math.abs(c) || Math.abs(Q[j] + c) === Math.abs(Q[j] - c));
    const ans = Math.abs(Q[j] - c), ax = "xyz"[j];
    return { task: "How far is Q from the plane?", expr: "Q " + vec(Q) + ", &nbsp;plane " + ax + " = " + neg(c),
      correct: { html: String(ans), n: ans }, truthN: Math.abs(Q[j] - c),
      wrong: [{ html: String(Math.abs(Q[j])), n: Math.abs(Q[j]), why: "That is the distance to the plane " + ax + " = 0. This plane sits at " + ax + " = " + neg(c) + "." },
              { html: String(Math.abs(c)), n: Math.abs(c), why: "That is where the plane sits. Measure from Q: |" + neg(Q[j]) + " − (" + neg(c) + ")|." },
              { html: String(Math.abs(Q[j] + c)), n: Math.abs(Q[j] + c), why: "You added. Distance is a difference: |" + neg(Q[j]) + " − (" + neg(c) + ")|." }],
      walk: ["The plane " + ax + " = " + neg(c) + " is flat across the other two directions, so only the " + ax + "-coordinate matters.",
             "Distance = |" + neg(Q[j]) + " − (" + neg(c) + ")| = " + m_(String(ans)) + "."] };
  }
  const { v: n, L } = pythVec();
  if (tier === 1) {
    const F = rv(-3, 3), D = dot(n, F), k = nz(-2, 2), Q = add(F, n.map(x => k * x)), top = dot(n, Q) - D, ans = Math.abs(top) / L;
    const noD = frac(Math.abs(dot(n, Q)), L);
    return { task: "How far is Q from the plane?", expr: "Q " + vec(Q) + "<br>" + eqn(n, D),
      correct: { html: String(ans), n: ans }, truthN: Math.abs(dot(n, Q) - D) / len(n),
      wrong: [{ html: String(Math.abs(top)), n: Math.abs(top), why: "You forgot to divide by |n| = " + L + "." },
              { html: noD.html, n: noD.val, why: "You left out the " + neg(D) + ". The top is |n · Q − d| = |" + neg(dot(n, Q)) + " − (" + neg(D) + ")|." },
              { html: frac(Math.abs(top), L * L).html, n: Math.abs(top) / (L * L), why: "You divided by |n|² = " + (L * L) + ". Divide by |n| = " + L + "." }],
      walk: ["Top: n · Q − d = " + neg(dot(n, Q)) + " − (" + neg(D) + ") = " + neg(top) + ".", "Bottom: |n| = √" + (L * L) + " = " + L + ".", "Distance = " + Math.abs(top) + " ÷ " + L + " = " + m_(String(ans)) + "."] };
  }
  const D1 = ri(-9, 9), m = nz(-3, 3), D2 = D1 + m * L, n2 = n.map(x => 2 * x);
  return { task: "How far apart are these parallel planes?", expr: eqn(n, D1) + "<br>" + eqn(n2, 2 * D2),
    correct: { html: String(Math.abs(m)), n: Math.abs(m) }, truthN: Math.abs(D2 - D1) / len(n),
    wrong: [{ html: frac(Math.abs(2 * D2 - D1), L).html, n: Math.abs(2 * D2 - D1) / L, why: "The second plane is written with doubled coefficients. Halve it first so both have the same normal." },
            { html: String(Math.abs(D2 - D1)), n: Math.abs(D2 - D1), why: "You forgot to divide by |n| = " + L + "." },
            { html: frac(Math.abs(D2 + D1), L).html, n: Math.abs(D2 + D1) / L, why: "You added the constants. The distance uses their difference." }],
    walk: ["Halve the second equation: " + eqn(n, D2) + ". Now both share the normal " + vec(n) + ".", "Difference of constants: |" + neg(D2) + " − (" + neg(D1) + ")| = " + Math.abs(D2 - D1) + ". |n| = " + L + ".",
           "Distance = " + Math.abs(D2 - D1) + " ÷ " + L + " = " + m_(String(Math.abs(m))) + "."] };
};
})();
