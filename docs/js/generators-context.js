/* Chalk and Paper – questions set in real situations
   For every step, two or three scenarios with fresh numbers each time: money and investing, and the rest of life.
   Each returns a forward problem (same contract as generators.js) plus k, the label, and sid, the scenario's name.
   Mixed into Hard and above, and used in place of the fixed real-life example on most lessons. Checked by tools/verify.js. */

window.CP = window.CP || {};
(function () {
const { M, neg, ri, nz, pick, shuffle, poly, vec, dot, cross, sub, add, m_, keyOf } = CP.h;
const fN = (x, d = 2) => neg(Number(x).toLocaleString("en-CA", { minimumFractionDigits: d, maximumFractionDigits: d }));
const money = (x, d = 2) => (x < 0 ? M : "") + "$" + Math.abs(x).toLocaleString("en-CA", { minimumFractionDigits: d, maximumFractionDigits: d });
const numd = (f, x, h = 1e-6) => (f(x + h) - f(x - h)) / (2 * h);
const pct = (x, d = 1) => fN(x * 100, d) + "%";
const opt = (html, n, why) => ({ html, n, why });
const len = v => Math.sqrt(dot(v, v));
const tp = s => s.replace(/x/g, "t");

const C = CP.CTX = {};

/* ---- exponent laws ---- */
C.exp = [
  function doubling() {
    const d = pick([6, 8, 9, 12]), k = ri(2, 5), Y = d * k, P = pick([5000, 10000, 20000]), ans = P * Math.pow(2, k);
    return { k: "Finance", sid: "doubling", task: "Money doubles about every " + d + " years (roughly " + (72 / d) + "% a year). You leave " + money(P, 0) + " for " + Y + " years. What does it become?", expr: money(P, 0) + " × 2<sup>" + Y + " ÷ " + d + "</sup>",
      correct: opt(money(ans, 0), ans), truthN: P * Math.pow(2, Y / d),
      wrong: [opt(money(P * 2 * k, 0), P * 2 * k, "You multiplied by 2 × " + k + ". Each doubling multiplies again: 2 × 2 × … " + k + " times is 2" + "<sup>" + k + "</sup> = " + Math.pow(2, k) + "."),
              opt(money(P * k, 0), P * k, "That is " + k + " times the money. " + k + " doublings is 2<sup>" + k + "</sup> times."),
              opt(money(P * Math.pow(2, k + 1), 0), P * Math.pow(2, k + 1), "One doubling too many. " + Y + " ÷ " + d + " = " + k + " doublings."),
              opt(money(P * Math.pow(2, k - 1), 0), P * Math.pow(2, k - 1), "One doubling short. " + Y + " ÷ " + d + " = " + k + " doublings.")],
      walk: [Y + " years ÷ " + d + " years per doubling = " + k + " doublings.", "Growth factor 2<sup>" + k + "</sup> = " + Math.pow(2, k) + ".", money(P, 0) + " × " + Math.pow(2, k) + " = " + m_(money(ans, 0)) + "."] };
  },
  function storage() {
    const S = ri(35, 39), P = ri(21, 23), gb = Math.pow(2, S - 30), mb = Math.pow(2, P - 20), ans = Math.pow(2, S - P);
    return { k: "Tech", sid: "storage", task: "A " + gb + " GB phone holds 2<sup>" + S + "</sup> bytes. A " + mb + " MB photo is 2<sup>" + P + "</sup> bytes. How many photos fit?", expr: "2<sup>" + S + "</sup> ÷ 2<sup>" + P + "</sup>",
      correct: opt(ans.toLocaleString("en-CA"), ans), truthN: Math.pow(2, S) / Math.pow(2, P),
      wrong: [opt(String(S - P), S - P, "That is the exponent, " + (S - P) + ". The count is 2<sup>" + (S - P) + "</sup>."),
              opt((ans * 2).toLocaleString("en-CA"), ans * 2, "Check the subtraction: " + S + " − " + P + " = " + (S - P) + ", so 2<sup>" + (S - P) + "</sup>."),
              opt((ans / 2).toLocaleString("en-CA"), ans / 2, "Check the subtraction: " + S + " − " + P + " = " + (S - P) + ", so 2<sup>" + (S - P) + "</sup>.")],
      walk: ["Dividing powers of the same base subtracts exponents.", "2<sup>" + S + "</sup> ÷ 2<sup>" + P + "</sup> = 2<sup>" + (S - P) + "</sup> = " + m_(ans.toLocaleString("en-CA")) + " photos."] };
  },
  function decibels() {
    const L = pick([80, 90, 100, 110]), n = (L - 60) / 10, ans = Math.pow(10, n);
    return { k: "Science", sid: "decibels", task: "Conversation is about 60 dB. Every 10 dB is 10 times the sound energy. How many times the energy is a " + L + " dB sound?", expr: "10<sup>(" + L + " − 60) ÷ 10</sup>",
      correct: opt(ans.toLocaleString("en-CA"), ans), truthN: Math.pow(10, (L - 60) / 10),
      wrong: [opt(String(n), n, "That is the exponent, the number of 10 dB steps. Each step multiplies by 10."),
              opt(String(L - 60), L - 60, "That is the difference in decibels. Decibels are exponents, not amounts."),
              opt((ans / 10).toLocaleString("en-CA"), ans / 10, "One factor of 10 short. " + (L - 60) + " dB is " + n + " steps of 10 dB.")],
      walk: [(L - 60) + " dB is " + n + " steps of 10 dB.", "Each step multiplies the energy by 10, so 10<sup>" + n + "</sup> = " + m_(ans.toLocaleString("en-CA")) + " times."] };
  }
];

/* ---- fraction and negative exponents ---- */
C.frac = [
  function annualize() {
    const r = pick([0.04, 0.05, 0.08, 0.1, 0.12]), n = ri(2, 5), F = Math.round(Math.pow(1 + r, n) * 10000) / 10000, tot = F - 1;
    const g = Math.pow(F, 1 / n) - 1;
    return { k: "Finance", sid: "annualize", task: "A fund grew " + pct(tot, 2) + " in total over " + n + " years. What was its average yearly return?", expr: "(" + fN(F, 4) + ")<sup>1/" + n + "</sup> − 1",
      correct: opt(pct(g, 2), g), truthN: g,
      wrong: [opt(pct(tot / n, 2), tot / n, "You divided the total by " + n + ". Returns compound, so take the " + n + "th root of the growth factor instead."),
              opt(pct(tot, 2), tot, "That is the total over all " + n + " years."),
              opt(pct(Math.pow(F, n === 2 ? 1 / 3 : 1 / 2) - 1, 2), Math.pow(F, n === 2 ? 1 / 3 : 1 / 2) - 1, "Wrong root. " + n + " years means the " + n + "th root.")],
      walk: ["Growth factor: 1 + " + pct(tot, 2) + " = " + fN(F, 4) + ".", "Per year: " + fN(F, 4) + "<sup>1/" + n + "</sup> = " + fN(1 + g, 4) + ".", "Average yearly return ≈ " + m_(pct(g, 2)) + ". Dividing would overstate it."] };
  },
  function kleiber() {
    const [m, a] = pick([[16, 8], [81, 27], [256, 64], [625, 125]]);
    return { k: "Nature", sid: "kleiber", task: "An animal's energy use grows as mass<sup>3/4</sup>. An animal " + m + " times heavier uses how many times the energy?", expr: m + "<sup>3/4</sup>",
      correct: opt(String(a), a), truthN: Math.pow(m, 0.75),
      wrong: [opt(String(m * 3 / 4), m * 3 / 4, "You multiplied by 3/4. A fraction exponent is a root and a power: the 4th root of " + m + ", then cubed."),
              opt(String(m), m, "That would be a power of 1. The 3/4 power grows more slowly than the mass."),
              opt(String(Math.round(Math.pow(m, 4 / 3))), Math.round(Math.pow(m, 4 / 3)), "You flipped the fraction. Root first (4th), then power (3rd).")],
      walk: ["The bottom of 3/4 is a root: the 4th root of " + m + " is " + Math.round(Math.pow(m, 0.25)) + ".", "The top is a power: " + Math.round(Math.pow(m, 0.25)) + "³ = " + a + ".", "So " + m_(a + " times") + " the energy, and " + a + "/" + m + " as much per kilogram."] };
  },
  function presentValue() {
    const X = pick([1000, 5000, 10000]), r = pick([0.03, 0.04, 0.05, 0.06]), n = pick([3, 5, 10]), pv = X * Math.pow(1 + r, -n);
    return { k: "Finance", sid: "pv", task: "A payment of " + money(X, 0) + " arrives in " + n + " years. Money earns " + pct(r, 0) + " a year. What is it worth today?", expr: money(X, 0) + " × (1 + " + r + ")<sup>" + M + n + "</sup>",
      correct: opt(money(pv), pv), truthN: X / Math.pow(1 + r, n),
      wrong: [opt(money(X * Math.pow(1 + r, n)), X * Math.pow(1 + r, n), "You grew it instead of shrinking it. A future payment is worth less today: the exponent is negative."),
              opt(money(X * (1 - r * n)), X * (1 - r * n), "You took off simple interest. Discounting compounds: divide by (1 + r) once per year."),
              opt(money(X / (1 + r * n)), X / (1 + r * n), "Simple discounting. The years compound, so it is (1 + r)<sup>" + n + "</sup> on the bottom.")],
      walk: ["(1 + " + r + ")<sup>" + n + "</sup> = " + fN(Math.pow(1 + r, n), 4) + ".", "The minus sign means divide: " + money(X, 0) + " ÷ " + fN(Math.pow(1 + r, n), 4) + " = " + m_(money(pv)) + "."] };
  }
];

/* ---- slope ---- */
C.slope = [
  function savings() {
    const m = pick([3, 4, 6, 8]), per = pick([150, 250, 400, 500, 750]), A = ri(10, 60) * 100, B = A + per * m;
    return { k: "Finance", sid: "savings", task: "Your TFSA held " + money(A, 0) + " and " + m + " months later " + money(B, 0) + ". What was the average monthly growth?", expr: "(" + money(B, 0) + " − " + money(A, 0) + ") ÷ " + m,
      correct: opt(money(per), per), truthN: (B - A) / m,
      wrong: [opt(money(B - A), B - A, "That is the total change. Divide by the " + m + " months."),
              opt(money((A + B) / 2), (A + B) / 2, "That is the average balance, not how fast it grew."),
              opt(money((B - A) / 12, 2), (B - A) / 12, "You divided by 12. The change happened over " + m + " months.")],
      walk: ["Rise: " + money(B - A, 0) + ". Run: " + m + " months.", "Slope = " + money(B - A, 0) + " ÷ " + m + " = " + m_(money(per, 0)) + " a month."] };
  },
  function grade() {
    const R = pick([30, 45, 60, 90, 120]), D = pick([0.5, 1, 1.5, 2]), g = R / (D * 1000);
    return { k: "Driving", sid: "grade", task: "A road climbs " + R + " m over " + D + " km of distance. What grade goes on the sign?", expr: R + " m ÷ " + (D * 1000).toLocaleString("en-CA") + " m",
      correct: opt(fN(g * 100, 1) + "%", g * 100), truthN: R / (D * 1000) * 100,
      wrong: [opt(fN(R / D, 1) + "%", R / D, "Units don't match: metres over kilometres. Convert " + D + " km to " + (D * 1000) + " m first."),
              opt(fN(g * 10, 1) + "%", g * 10, "Check the conversion: " + D + " km is " + (D * 1000) + " m."),
              opt(fN(D * 1000 / R, 1) + "%", D * 1000 / R, "That is run over rise. Grade is rise over run.")],
      walk: [D + " km = " + (D * 1000) + " m.", "Slope = " + R + " ÷ " + (D * 1000) + " = " + fN(g, 3) + ".", "As a percent: " + m_(fN(g * 100, 1) + "%") + "."] };
  },
  function fx() {
    const a = pick([1.33, 1.35, 1.37, 1.40]), dd = pick([30, 20, 15, 10]), ch = pick([-0.03, -0.02, 0.015, 0.02, 0.03]), b = +(a + ch).toFixed(3), X = pick([2000, 5000, 10000]);
    const perDay = (b - a) / dd * X;
    return { k: "Finance", sid: "fx", task: "USD/CAD went from " + a.toFixed(3) + " to " + b.toFixed(3) + " over " + dd + " days. On a US$" + X.toLocaleString("en-CA") + " purchase, how much did each day's change cost or save in Canadian dollars, on average?", expr: "(" + b.toFixed(3) + " − " + a.toFixed(3) + ") ÷ " + dd + " × " + X.toLocaleString("en-CA"),
      correct: opt(money(perDay), perDay), truthN: ((b - a) / dd) * X,
      wrong: [opt(money((b - a) * X), (b - a) * X, "That is the whole " + dd + "-day change. Divide by " + dd + "."),
              opt(money(-perDay), -perDay, "Sign slip. The rate went " + (b > a ? "up, so the purchase cost more each day." : "down, so each day saved money.")),
              opt(money((b - a) * X / 365), (b - a) * X / 365, "You divided by 365. The change happened over " + dd + " days.")],
      walk: ["Rate slope: (" + b.toFixed(3) + " − " + a.toFixed(3) + ") ÷ " + dd + " = " + fN((b - a) / dd, 5) + " CAD per USD per day.", "× " + X.toLocaleString("en-CA") + " = " + m_(money(perDay)) + " a day."] };
  }
];

/* ---- first principles ---- */
C.firstp = [
  function marginalRevenue() {
    const a = pick([40, 50, 60]), b = pick([0.05, 0.1, 0.2]), k = pick([50, 100, 150]), R = q => a * q - b * q * q, ans = a - 2 * b * k;
    return { k: "Finance", sid: "mr", task: "Revenue from selling q units is R(q) = " + a + "q − " + b + "q². Using the limit of [R(" + k + " + h) − R(" + k + ")] ÷ h, how much does one more sale add at q = " + k + "?", expr: "R(q) = " + a + "q − " + b + "q²",
      correct: opt(money(ans), ans), truthN: numd(R, k),
      wrong: [opt(money(R(k) / k), R(k) / k, "That is average revenue per unit, R ÷ q. The limit gives the rate at q = " + k + "."),
              opt(money(R(k + 1) - R(k)), R(k + 1) - R(k), "That uses h = 1. Let h shrink to 0: the " + M + b + "h term disappears."),
              opt(money(R(k), 0), R(k), "That is total revenue at q = " + k + ", not the extra per unit.")],
      walk: ["R(" + k + " + h) − R(" + k + ") = " + a + "h − " + b + "(2 × " + k + "h + h²) = " + fN(a - 2 * b * k, 2) + "h − " + b + "h².", "Divide by h: " + fN(a - 2 * b * k, 2) + " − " + b + "h.", "Let h → 0: " + m_(money(ans)) + " per extra unit."] };
  },
  function ripple() {
    const k = pick([2, 3, 5, 8, 10]), A = r => Math.PI * r * r, ans = 2 * Math.PI * k;
    return { k: "Nature", sid: "ripple", task: "A ripple's area is A = πr². Using the limit definition, how fast is the area growing per cm of radius when r = " + k + " cm?", expr: "A(r) = πr²",
      correct: opt(fN(ans, 1) + " cm² per cm", ans), truthN: numd(A, k),
      wrong: [opt(fN(Math.PI * k * k, 1) + " cm² per cm", Math.PI * k * k, "That is the area itself, πr²."),
              opt(fN(Math.PI * k, 1) + " cm² per cm", Math.PI * k, "Expanding π(r + h)² gives 2πrh in the middle. You lost the 2."),
              opt(fN(Math.PI * (2 * k + 1), 1) + " cm² per cm", Math.PI * (2 * k + 1), "That uses h = 1. Let h shrink to 0.")],
      walk: ["[π(" + k + " + h)² − π(" + k + ")²] ÷ h = π(" + (2 * k) + " + h).", "As h → 0: " + (2 * k) + "π ≈ " + m_(fN(ans, 1)) + ".", "It is the circumference: a thin ring of width h adds about 2πr × h of area."] };
  }
];

/* ---- power rule ---- */
C.pow1 = [
  function patio() {
    const c = pick([40, 60, 80, 120]), s = ri(3, 8), ans = 2 * c * s;
    return { k: "Home", sid: "patio", task: "Pavers cost " + money(c, 0) + " per m², so a square patio of side s metres costs C = " + c + "s². At s = " + s + " m, how much does the cost rise per extra metre of side?", expr: "C(s) = " + c + "s²",
      correct: opt(money(ans, 0) + " per m", ans), truthN: numd(s2 => c * s2 * s2, s),
      wrong: [opt(money(c * s * s, 0) + " per m", c * s * s, "That is the cost of the patio, C(" + s + ")."),
              opt(money(c * s, 0) + " per m", c * s, "The power rule brings the 2 down: C′ = " + (2 * c) + "s."),
              opt(money(2 * c, 0) + " per m", 2 * c, "You dropped the s. C′(s) = " + (2 * c) + "s, then put s = " + s + ".")],
      walk: ["C′(s) = 2 × " + c + "s = " + (2 * c) + "s.", "At s = " + s + ": " + m_(money(ans, 0)) + " per extra metre of side."] };
  },
  function braking() {
    const v = pick([50, 60, 80, 100, 120]), d = x => 0.006 * x * x, ans = 0.012 * v;
    return { k: "Driving", sid: "braking", task: "Braking distance is about d = 0.006v² metres at v km/h. At " + v + " km/h, how many extra metres does each extra km/h add?", expr: "d(v) = 0.006v²",
      correct: opt(fN(ans, 2) + " m", ans), truthN: numd(d, v),
      wrong: [opt(fN(d(v), 2) + " m", d(v), "That is the braking distance itself."),
              opt(fN(0.006 * v, 2) + " m", 0.006 * v, "The 2 comes down: d′ = 0.012v."),
              opt(fN(0.012, 3) + " m", 0.012, "You dropped the v. d′(v) = 0.012v.")],
      walk: ["d′(v) = 2 × 0.006v = 0.012v.", "At " + v + " km/h: 0.012 × " + v + " = " + m_(fN(ans, 2) + " m") + " per extra km/h.", "At double the speed, each extra km/h costs double the metres."] };
  },
  function drag() {
    const sg = pick([0.1, 0.15, 0.2, 0.25, 0.3]), ans = sg * 0.01;
    return { k: "Finance", sid: "drag", task: "Volatility quietly drags long-run growth down by about σ²/2 a year. For a portfolio with σ = " + pct(sg, 0) + ", how much more growth does each extra percentage point of volatility cost? (the derivative × 0.01)", expr: "drag(σ) = σ²/2",
      correct: opt(pct(ans, 2) + " a year", ans), truthN: numd(x => x * x / 2, sg) * 0.01,
      wrong: [opt(pct(sg * sg / 2, 2) + " a year", sg * sg / 2, "That is the whole drag at σ = " + pct(sg, 0) + ", not the cost of one more point."),
              opt(pct(sg / 2 * 0.01, 2) + " a year", sg / 2 * 0.01, "The 2 comes down and cancels the ½: the derivative of σ²/2 is σ."),
              opt(pct(0.01 * 0.01, 2) + " a year", 0.0001, "You dropped the σ. The derivative is σ itself, then × 0.01.")],
      walk: ["d/dσ (σ²/2) = σ.", "At σ = " + sg + ": each extra 0.01 of volatility costs " + sg + " × 0.01 = " + m_(pct(ans, 2)) + " a year of growth.", "The more volatile a portfolio already is, the more each extra bit of swing costs."] };
  },
  function wind() {
    const v = pick([4, 6, 8, 10, 12]), P = x => 0.5 * x * x * x, ans = 1.5 * v * v;
    return { k: "Science", sid: "wind", task: "A small turbine makes P = 0.5v³ watts in a wind of v m/s. At " + v + " m/s, how many more watts does each extra 1 m/s add?", expr: "P(v) = 0.5v³",
      correct: opt(fN(ans, 1) + " W", ans), truthN: numd(P, v),
      wrong: [opt(fN(P(v), 1) + " W", P(v), "That is the power output itself."),
              opt(fN(0.5 * 3 * v, 1) + " W", 1.5 * v, "Lower the power by one: 3v³⁻¹ = 3v²."),
              opt(fN(0.5 * v * v, 1) + " W", 0.5 * v * v, "Multiply by the power, 3, as you lower it.")],
      walk: ["P′(v) = 3 × 0.5v² = 1.5v².", "At " + v + " m/s: 1.5 × " + (v * v) + " = " + m_(fN(ans, 1) + " W") + " per extra m/s."] };
  }
];

/* ---- polynomials ---- */
C.polyd = [
  function marginalCost() {
    const k = pick([10, 20, 30, 40, 50]), Cf = q => 0.01 * q * q * q - 0.6 * q * q + 15 * q + 200, ans = 0.03 * k * k - 1.2 * k + 15;
    return { k: "Finance", sid: "mc", task: "A bakery's daily cost of making q loaves is C(q) = 0.01q³ − 0.6q² + 15q + 200 dollars. What does one more loaf cost at q = " + k + "?", expr: "C(q) = 0.01q³ − 0.6q² + 15q + 200",
      correct: opt(money(ans), ans), truthN: numd(Cf, k),
      wrong: [opt(money(Cf(k) / k), Cf(k) / k, "That is average cost per loaf, including the fixed $200. Marginal cost is C′(q)."),
              opt(money(ans + 200), ans + 200, "You kept the $200 fixed cost. Constants differentiate to 0: rent doesn't change with one more loaf."),
              opt(money(0.01 * k * k - 0.6 * k + 15), 0.01 * k * k - 0.6 * k + 15, "You lowered each power but did not multiply by it.")],
      walk: ["C′(q) = 0.03q² − 1.2q + 15. The 200 disappears.", "At q = " + k + ": 0.03(" + (k * k) + ") − 1.2(" + k + ") + 15 = " + m_(money(ans)) + "."] };
  },
  function ball() {
    const v0 = pick([8, 10, 12, 15]), h0 = pick([1.5, 2]), t = pick([0.5, 1, 1.5]), h = x => -4.9 * x * x + v0 * x + h0, ans = -9.8 * t + v0;
    return { k: "Sport", sid: "ball", task: "A basketball's height is h(t) = −4.9t² + " + v0 + "t + " + h0 + " metres. How fast is it moving up (or down) at t = " + t + " s?", expr: "h(t) = −4.9t² + " + v0 + "t + " + h0,
      correct: opt(fN(ans, 2) + " m/s", ans), truthN: numd(h, t),
      wrong: [opt(fN(h(t), 2) + " m/s", h(t), "That is the height at t = " + t + ", not the speed."),
              opt(fN(-4.9 * t + v0, 2) + " m/s", -4.9 * t + v0, "The derivative of −4.9t² is −9.8t: the 2 comes down."),
              opt(fN(v0, 2) + " m/s", v0, "That is the launch speed. Gravity has been slowing it for " + t + " s.")],
      walk: ["h′(t) = −9.8t + " + v0 + ".", "At t = " + t + ": " + m_(fN(ans, 2) + " m/s") + (ans < 0 ? ", negative: it is already coming down." : ans === 0 ? ": the top of the arc." : ", still rising.")] };
  }
];

/* ---- tangent ---- */
C.tan = [
  function profit() {
    const a = pick([60, 80, 100]), c = pick([200, 300]), k = pick([5, 10, 15, 20]), P = x => -2 * x * x + a * x - c, ans = -4 * k + a;
    return { k: "Finance", sid: "profit", task: "Weekly profit at a price of x dollars is P(x) = −2x² + " + a + "x − " + c + ". At x = " + k + ", how much does profit change per $1 of price (the tangent's slope)?", expr: "P(x) = −2x² + " + a + "x − " + c,
      correct: opt(money(ans, 0) + " per $1", ans), truthN: numd(P, k),
      wrong: [opt(money(P(k), 0) + " per $1", P(k), "That is the profit at x = " + k + ", not its slope."),
              opt(money(-2 * k + a, 0) + " per $1", -2 * k + a, "The derivative of −2x² is −4x."),
              opt(money(-4 * k, 0) + " per $1", -4 * k, "You dropped the derivative of " + a + "x, which is " + a + ".")],
      walk: ["P′(x) = −4x + " + a + ".", "At x = " + k + ": " + m_(money(ans, 0)) + " per $1. " + (ans > 0 ? "Positive: a small price rise would raise profit." : ans < 0 ? "Negative: a small price cut would raise profit." : "Zero: this is the best price.")] };
  },
  function ramp() {
    const a = pick([0.1, 0.2, 0.25, 0.5]), k = ri(1, 4), ans = 2 * a * k;
    return { k: "Sport", sid: "ramp", task: "A skateboard ramp's profile is y = " + a + "x² metres. How steep is it (the slope) " + k + " m out from the bottom?", expr: "y = " + a + "x²",
      correct: opt(fN(ans, 2), ans), truthN: numd(x => a * x * x, k),
      wrong: [opt(fN(a * k * k, 2), a * k * k, "That is the height there, not the slope."),
              opt(fN(a * k, 2), a * k, "The power rule brings the 2 down: y′ = " + fN(2 * a, 2) + "x."),
              opt(fN(2 * a, 2), 2 * a, "You dropped the x. y′ = " + fN(2 * a, 2) + "x, then put in x = " + k + ".")],
      walk: ["y′ = " + fN(2 * a, 2) + "x.", "At x = " + k + ": slope " + m_(fN(ans, 2)) + ", which means " + fN(ans, 2) + " m up for each metre across there."] };
  },
  function sqrtEst() {
    const N = ri(5, 10), e = ri(1, 4), est = N + e / (2 * N);
    return { k: "Home", sid: "sqrt", task: "Estimate √" + (N * N + e) + " in your head with the tangent line to √x at x = " + (N * N) + ".", expr: "√x ≈ " + N + " + (x − " + (N * N) + ") ÷ (2 × " + N + ")",
      correct: opt(fN(est, 3), est), truthN: N + e * (0.5 / N),
      wrong: [opt(fN(N + e / N, 3), N + e / N, "The slope of √x at " + (N * N) + " is 1/(2√x) = 1/" + (2 * N) + ", not 1/" + N + "."),
              opt(fN(N + e, 3), N + e, "You added the whole " + e + ". The slope of √x there is only 1/" + (2 * N) + "."),
              opt(fN(N - e / (2 * N), 3), N - e / (2 * N), "Sign slip. √x rises, so the estimate is above " + N + ".")],
      walk: ["√" + (N * N) + " = " + N + " and the slope there is 1/(2 × " + N + ") = 1/" + (2 * N) + ".", "Tangent estimate: " + N + " + " + e + "/" + (2 * N) + " = " + m_(fN(est, 3)) + ". The true value is " + fN(Math.sqrt(N * N + e), 4) + "."] };
  }
];

/* ---- product rule ---- */
C.prod = [
  function cafe() {
    const p0 = pick([4, 5, 6]), a = pick([0.05, 0.1, 0.2]), q0 = pick([800, 1000, 1500]), b = pick([10, 20, 30]), ans = a * q0 - b * p0;
    return { k: "Finance", sid: "cafe", task: "A café sells " + q0 + " lattes a month at " + money(p0) + ". It raises the price " + money(a) + " a month and loses " + b + " sales a month. At this moment, how fast is monthly revenue changing?", expr: "R = p × q, &nbsp;R′ = p′q + pq′",
      correct: opt(money(ans) + " a month", ans), truthN: numd(t => (p0 + a * t) * (q0 - b * t), 0),
      wrong: [opt(money(-a * b) + " a month", -a * b, "You multiplied the two rates. The product rule is p′q + pq′."),
              opt(money(a * q0) + " a month", a * q0, "Only p′q, the gain from the higher price. The lost sales, pq′ = " + money(-b * p0) + ", count too."),
              opt(money(-b * p0) + " a month", -b * p0, "Only pq′, the lost sales. The higher price on the remaining sales, p′q = " + money(a * q0) + ", counts too.")],
      walk: ["p′q = " + money(a) + " × " + q0 + " = " + money(a * q0) + ".", "pq′ = " + money(p0) + " × (−" + b + ") = " + money(-b * p0) + ".", "R′ = " + m_(money(ans)) + " a month."] };
  },
  function heart() {
    const ht = pick([3, 5, 8]), s0 = pick([70, 80]), st = pick([0.5, 1]), k = pick([2, 4, 6]), HR = 70 + ht * k, SV = s0 + st * k, ans = ht * SV + HR * st;
    return { k: "Health", sid: "heart", task: "During exercise, heart rate is 70 + " + ht + "t beats/min and stroke volume is " + s0 + " + " + st + "t mL per beat (t in minutes). How fast is cardiac output rising at t = " + k + "?", expr: "Output = HR × SV",
      correct: opt(fN(ans, 1) + " mL/min per min", ans), truthN: numd(t => (70 + ht * t) * (s0 + st * t), k),
      wrong: [opt(fN(ht * st, 1) + " mL/min per min", ht * st, "You multiplied the two rates. The product rule is HR′·SV + HR·SV′."),
              opt(fN(ht * SV, 1) + " mL/min per min", ht * SV, "Only the heart-rate half. Add HR × SV′ = " + HR + " × " + st + "."),
              opt(fN(HR * st, 1) + " mL/min per min", HR * st, "Only the stroke-volume half. Add HR′ × SV = " + ht + " × " + SV + ".")],
      walk: ["At t = " + k + ": HR = " + HR + ", SV = " + SV + ".", "HR′·SV + HR·SV′ = " + ht + "(" + SV + ") + " + HR + "(" + st + ") = " + m_(fN(ans, 1)) + " mL/min each minute."] };
  }
];

/* ---- chain rule ---- */
C.chain = [
  function sensitivity() {
    const P = pick([1000, 10000]), n = pick([10, 20, 30]), r = pick([0.04, 0.05, 0.06]), V = x => P * Math.pow(1 + x, n);
    const ans = P * n * Math.pow(1 + r, n - 1) * 0.01;
    return { k: "Finance", sid: "sens", task: money(P, 0) + " grows for " + n + " years: V(r) = " + P.toLocaleString("en-CA") + "(1 + r)<sup>" + n + "</sup>. At r = " + pct(r, 0) + ", about how many dollars does each extra 1% of return add? (V′(r) × 0.01)", expr: "V(r) = " + P.toLocaleString("en-CA") + "(1 + r)<sup>" + n + "</sup>",
      correct: opt(money(ans), ans), truthN: numd(V, r) * 0.01,
      wrong: [opt(money(P * n * 0.01), P * n * 0.01, "You forgot the (1 + r)<sup>" + (n - 1) + "</sup> part. The outside's derivative keeps the bracket."),
              opt(money(P * n * Math.pow(1 + r, n) * 0.01), P * n * Math.pow(1 + r, n) * 0.01, "Lower the power from " + n + " to " + (n - 1) + "."),
              opt(money(P * Math.pow(1 + r, n - 1) * 0.01), P * Math.pow(1 + r, n - 1) * 0.01, "Bring the " + n + " down in front.")],
      walk: ["V′(r) = " + P.toLocaleString("en-CA") + " × " + n + "(1 + r)<sup>" + (n - 1) + "</sup> × 1. The inside, 1 + r, has derivative 1.", "At r = " + r + ": " + money(P * n * Math.pow(1 + r, n - 1)) + " per unit of r.", "× 0.01 for one percentage point: " + m_(money(ans)) + "."] };
  },
  function balloon() {
    const r0 = pick([2, 3, 5]), g = pick([0.5, 1]), k = pick([1,2, 4]), r = r0 + g * k, V = t => 4 / 3 * Math.PI * Math.pow(r0 + g * t, 3), ans = 4 * Math.PI * r * r * g;
    return { k: "Science", sid: "balloon", task: "A balloon's radius is r = " + r0 + " + " + g + "t cm. Its volume is V = (4/3)πr³. How fast is the volume growing at t = " + k + " s?", expr: "V(t) = (4/3)π(" + r0 + " + " + g + "t)³",
      correct: opt(fN(ans, 1) + " cm³/s", ans), truthN: numd(V, k),
      wrong: [opt(fN(4 * Math.PI * r * r, 1) + " cm³/s", 4 * Math.PI * r * r, "You forgot to multiply by the inside's derivative, " + g + " cm/s."),
              opt(fN(4 / 3 * Math.PI * r * r * r, 1) + " cm³/s", 4 / 3 * Math.PI * r * r * r, "That is the volume, not its rate of change."),
              opt(fN(4 / 3 * Math.PI * r * r * g, 1) + " cm³/s", 4 / 3 * Math.PI * r * r * g, "Bring the 3 down: (4/3)π × 3r² = 4πr².")],
      walk: ["dV/dt = 4πr² × dr/dt = 4πr² × " + g + ".", "At t = " + k + ", r = " + r + ": 4π(" + (r * r) + ")(" + g + ") ≈ " + m_(fN(ans, 1)) + " cm³/s."] };
  }
];

/* ---- product and chain together ---- */
C.combo = [
  function shares() {
    const S0 = pick([500, 1000, 2000]), b = pick([20, 50, 100]), p0 = pick([10, 20, 50]), g = pick([0.01, 0.02]);
    const V = t => (S0 + b * t) * p0 * Math.pow(1 + g * t, 2), ans = b * p0 + S0 * p0 * 2 * g;
    return { k: "Finance", sid: "shares", task: "You hold " + S0 + " shares and buy " + b + " more each month. The price is p(t) = " + p0 + "(1 + " + g + "t)² dollars. How fast is your holding's value growing right now (t = 0)?", expr: "V = (" + S0 + " + " + b + "t) × " + p0 + "(1 + " + g + "t)²",
      correct: opt(money(ans) + " a month", ans), truthN: numd(V, 0),
      wrong: [opt(money(b * p0) + " a month", b * p0, "Only the new shares. The price rise on the " + S0 + " you hold adds " + money(S0 * p0 * 2 * g) + "."),
              opt(money(S0 * p0 * 2 * g) + " a month", S0 * p0 * 2 * g, "Only the price rise. The new shares add " + b + " × " + money(p0) + "."),
              opt(money(S0 * p0 * g) + " a month", S0 * p0 * g, "The price's derivative needs the chain rule: 2(1 + " + g + "t) × " + g + ", which is " + (2 * g) + " × " + p0 + " at t = 0.")],
      walk: ["u′v: " + b + " new shares × " + money(p0) + " = " + money(b * p0) + ".", "uv′: " + S0 + " × p′(0), with p′(t) = " + p0 + " × 2(1 + " + g + "t) × " + g + ", so p′(0) = " + money(p0 * 2 * g) + ". That gives " + money(S0 * p0 * 2 * g) + ".", "Total: " + m_(money(ans)) + " a month."] };
  },
  function box() {
    const L = pick([12, 18, 24, 30]), k = ri(1, 3), V = x => x * Math.pow(L - 2 * x, 2), ans = Math.pow(L - 2 * k, 2) - 4 * k * (L - 2 * k);
    return { k: "Home", sid: "box", task: "Cut squares of side x from the corners of a " + L + " cm sheet and fold it into an open box: V = x(" + L + " − 2x)². How fast does the volume change as x grows, at x = " + k + " cm?", expr: "V(x) = x(" + L + " − 2x)²",
      correct: opt(fN(ans, 0) + " cm³ per cm", ans), truthN: numd(V, k),
      wrong: [opt(fN(Math.pow(L - 2 * k, 2), 0) + " cm³ per cm", Math.pow(L - 2 * k, 2), "Only u′v. The uv′ half, x × 2(" + L + " − 2x)(−2), is missing."),
              opt(fN(Math.pow(L - 2 * k, 2) + 2 * k * (L - 2 * k), 0) + " cm³ per cm", Math.pow(L - 2 * k, 2) + 2 * k * (L - 2 * k), "The inside, " + L + " − 2x, has derivative −2. That factor makes uv′ = −4x(" + L + " − 2x)."),
              opt(fN(V(k), 0) + " cm³ per cm", V(k), "That is the volume itself.")],
      walk: ["V′ = (" + L + " − 2x)² + x × 2(" + L + " − 2x)(−2).", "At x = " + k + ": " + Math.pow(L - 2 * k, 2) + " − " + 4 * k * (L - 2 * k) + " = " + m_(fN(ans, 0)) + " cm³ per cm.", ans > 0 ? "Still positive: bigger cuts still make a bigger box." : ans === 0 ? "Zero: this is the largest box." : "Negative: the cuts are now too big."] };
  }
];

/* ---- sine, cosine, e^x ---- */
const DAYS = [[80, "March 21"], [110, "April 20"], [141, "May 21"], [172, "June 21"], [264, "September 21"], [355, "December 21"]];
C.trigexp = [
  function daylight() {
    const [t, name] = pick(DAYS), D = x => 12.2 + 3.2 * Math.sin(2 * Math.PI * (x - 80) / 365), w = 2 * Math.PI / 365, c = Math.cos(w * (t - 80));
    const ans = 3.2 * w * c * 60;
    return { k: "Weather", sid: "daylight", task: "Toronto's day length is about D(t) = 12.2 + 3.2 sin(2π(t − 80)/365) hours on day t of the year. On " + name + ", how many minutes a day is it changing by?", expr: "D′(t) = 3.2 × (2π/365) × cos(2π(t − 80)/365) hours",
      correct: opt(fN(ans, 2) + " min/day", ans), truthN: numd(D, t, 1e-4) * 60,
      wrong: [opt(fN(3.2 * c * 60, 2) + " min/day", 3.2 * c * 60, "You forgot the chain rule's factor 2π/365. The inside changes slowly: once around per year."),
              opt(fN(3.2 * w * c, 2) + " min/day", 3.2 * w * c, "That is in hours per day. Multiply by 60."),
              opt(fN(3.2 * w * Math.sin(w * (t - 80)) * 60, 2) + " min/day", 3.2 * w * Math.sin(w * (t - 80)) * 60, "Sine differentiates to cosine, not to sine.")],
      walk: ["D′(t) = 3.2 × (2π/365) × cos(2π(t − 80)/365).", "On " + name + " the cosine is " + fN(c, 3) + ".", "3.2 × 0.01721 × " + fN(c, 3) + " × 60 ≈ " + m_(fN(ans, 2) + " minutes a day") + "."] };
  },
  function ac() {
    const [ph, ts] = pick([[0, "0"], [Math.PI / 6, "1/720"], [Math.PI / 3, "1/360"], [Math.PI / 4, "1/480"]]), w = 120 * Math.PI, ans = 170 * w * Math.cos(ph);
    return { k: "Tech", sid: "ac", task: "Your outlet's voltage is V(t) = 170 sin(120πt) volts. How fast is it changing at t = " + ts + " s?", expr: "V′(t) = 170 × 120π cos(120πt)",
      correct: opt(fN(ans, 0) + " V/s", ans), truthN: numd(x => 170 * Math.sin(w * x), ph / w, 1e-9),
      wrong: [opt(fN(170 * Math.cos(ph), 0) + " V/s", 170 * Math.cos(ph), "You forgot the chain rule: the inside 120πt has derivative 120π ≈ 377."),
              opt(fN(170 * w * Math.sin(ph), 0) + " V/s", 170 * w * Math.sin(ph), "Sine differentiates to cosine."),
              opt(fN(170 * Math.sin(ph), 0) + " V/s", 170 * Math.sin(ph), "That is the voltage itself, not how fast it changes.")],
      walk: ["V′(t) = 170 × 120π × cos(120πt) ≈ 64,088 cos(120πt).", "At t = " + ts + " s, 120πt = " + ["0", "π/6", "π/3", "π/4"][[0, Math.PI / 6, Math.PI / 3, Math.PI / 4].indexOf(ph)] + ".", "So V′ ≈ " + m_(fN(ans, 0) + " V/s") + "."] };
  },
  function continuous() {
    const P = pick([1000, 5000, 10000]), r = pick([0.03, 0.04, 0.05]), t = pick([5, 10, 20]), B = x => P * Math.exp(r * x), ans = r * B(t);
    return { k: "Finance", sid: "cont", task: money(P, 0) + " grows continuously at " + pct(r, 0) + ": B(t) = " + P.toLocaleString("en-CA") + "e<sup>" + r + "t</sup>. How fast is it growing after " + t + " years, in dollars a year?", expr: "B′(t) = " + r + " × " + P.toLocaleString("en-CA") + "e<sup>" + r + "t</sup>",
      correct: opt(money(ans), ans), truthN: numd(B, t),
      wrong: [opt(money(B(t)), B(t), "That is the balance, not its growth rate. Multiply by " + r + "."),
              opt(money(r * P), r * P, "That is the rate at the start. The balance has grown since."),
              opt(money(r * t * B(t)), r * t * B(t), "The t is not a factor. The derivative of e<sup>" + r + "t</sup> is " + r + "e<sup>" + r + "t</sup>.")],
      walk: ["B′(t) = " + r + "B(t): always " + pct(r, 0) + " of the balance.", "B(" + t + ") = " + money(B(t)) + ".", "B′ = " + m_(money(ans)) + " a year."] };
  }
];

/* ---- exponential rates ---- */
C.exprate = [
  function groceries() {
    const W = pick([200, 250, 300]), k = pick([0.02, 0.025, 0.03, 0.04]), t = pick([5, 10]), G = x => W * Math.exp(k * x), ans = k * G(t);
    return { k: "Finance", sid: "groceries", task: "Groceries cost " + money(W, 0) + " a week. With inflation of " + pct(k, 1) + " a year, the weekly bill is G(t) = " + W + "e<sup>" + k + "t</sup>. After " + t + " years, how fast is the weekly bill rising, in dollars per year?", expr: "G′(t) = " + k + " × G(t)",
      correct: opt(money(ans), ans), truthN: numd(G, t),
      wrong: [opt(money(k * W), k * W, "That is the rate at the start. After " + t + " years the bill, and so the rate, is bigger."),
              opt(money(G(t)), G(t), "That is the weekly bill itself."),
              opt(money(k * W * t), k * W * t, "That treats inflation as simple, not compounding.")],
      walk: ["G′(t) = " + k + " × G(t).", "G(" + t + ") = " + money(G(t)) + " a week.", "G′ = " + m_(money(ans)) + " a year, and still climbing."] };
  },
  function coffee() {
    const t = pick([5, 10, 20, 30]), T = x => 20 + 70 * Math.exp(-0.05 * x), ans = -3.5 * Math.exp(-0.05 * t);
    return { k: "Science", sid: "coffee", task: "Coffee cools as T(t) = 20 + 70e<sup>−0.05t</sup> °C after t minutes. How fast is it cooling at t = " + t + "?", expr: "T′(t) = −0.05 × 70e<sup>−0.05t</sup>",
      correct: opt(fN(ans, 2) + " °C/min", ans), truthN: numd(T, t),
      wrong: [opt(fN(-0.05 * T(t), 2) + " °C/min", -0.05 * T(t), "The room temperature, 20, is a constant: it differentiates to 0. Only the 70e<sup>−0.05t</sup> part changes."),
              opt(fN(70 * Math.exp(-0.05 * t), 2) + " °C/min", 70 * Math.exp(-0.05 * t), "That is how far above room temperature it is, not the rate."),
              opt(fN(-3.5, 2) + " °C/min", -3.5, "That is the rate at t = 0. It slows as the coffee nears room temperature.")],
      walk: ["T′(t) = 70 × (−0.05)e<sup>−0.05t</sup> = −3.5e<sup>−0.05t</sup>.", "At t = " + t + ": −3.5 × " + fN(Math.exp(-0.05 * t), 4) + " = " + m_(fN(ans, 2) + " °C/min") + "."] };
  },
  function debt() {
    const B = pick([2000, 5000, 8000]), r = pick([0.2, 0.22, 0.25]), ans = r * B;
    return { k: "Finance", sid: "debt", task: "Credit card debt grows continuously at " + pct(r, 0) + " a year: D(t) = D₀e<sup>" + r + "t</sup>. When the balance reaches " + money(B, 0) + ", how fast is it growing, in dollars a year?", expr: "D′ = " + r + " × D",
      correct: opt(money(ans, 0), ans), truthN: numd(x => B * Math.exp(r * x), 0),
      wrong: [opt(money(B, 0), B, "That is the balance itself."),
              opt(money(B * (1 + r), 0), B * (1 + r), "That is roughly the balance a year later, not the rate now."),
              opt(money(r * 100, 0), r * 100, "You forgot to multiply by the balance. The rate is " + r + " × D.")],
      walk: ["For D₀e<sup>kt</sup>, the rate is k × D.", r + " × " + money(B, 0) + " = " + m_(money(ans, 0)) + " a year. Pay it down and the rate shrinks too."] };
  }
];

/* ---- motion ---- */
C.motion = [
  function puck() {
    const [v0, a] = pick([[20, 2], [24, 3], [30, 3], [30, 5], [20, 4]]), x = t => v0 * t - a * t * t, ts = v0 / (2 * a), ans = x(ts);
    return { k: "Sport", sid: "puck", task: "A puck slides x(t) = " + v0 + "t − " + a + "t² metres. How far does it go before it stops?", expr: "x(t) = " + v0 + "t − " + a + "t²",
      correct: opt(fN(ans, 2) + " m", ans), truthN: v0 * v0 / (4 * a),
      wrong: [opt(fN(ts, 2) + " m", ts, "That is when it stops, " + fN(ts, 2) + " seconds. Put that time into x(t)."),
              opt(fN(v0 * v0 / (2 * a), 2) + " m", v0 * v0 / (2 * a), "You dropped the " + M + a + "t² term's effect. x(" + fN(ts, 2) + ") = " + fN(v0 * ts, 2) + " − " + fN(a * ts * ts, 2) + "."),
              opt(fN(v0 / a, 2) + " m", v0 / a, "That is where x = 0 again, in seconds. Stopping means v = 0.")],
      walk: ["v(t) = " + v0 + " − " + (2 * a) + "t = 0 at t = " + fN(ts, 2) + " s.", "x(" + fN(ts, 2) + ") = " + m_(fN(ans, 2) + " m") + "."] };
  },
  function saving() {
    const a = pick([10, 20, 25]), b = pick([200, 300, 400, 500]), k = ri(3, 18), B = t => a * t * t + b * t, v = 2 * a * k + b;
    return { k: "Finance", sid: "saving", task: "You raise your savings a little every month, so your balance is B(t) = " + a + "t² + " + b + "t dollars after t months. How much are you adding per month at month " + k + "?", expr: "B(t) = " + a + "t² + " + b + "t",
      correct: opt(money(v, 0) + " a month", v), truthN: numd(B, k),
      wrong: [opt(money(B(k), 0) + " a month", B(k), "That is the balance, the 'position'. The rate of saving is B′(t)."),
              opt(money(a * k + b, 0) + " a month", a * k + b, "The derivative of " + a + "t² is " + (2 * a) + "t."),
              opt(money(2 * a, 0) + " a month", 2 * a, "That is B″, how fast your monthly saving grows: the acceleration.")],
      walk: ["Balance is position; the saving rate is velocity: B′(t) = " + (2 * a) + "t + " + b + ".", "At month " + k + ": " + m_(money(v, 0)) + " a month.", "B″ = " + money(2 * a, 0) + ": each month you save that much more than the month before."] };
  },
  function merge() {
    const a = pick([1, 1.5, 2]), v0 = pick([10, 12, 15]), t = pick([2, 3, 4]), s = x => a * x * x + v0 * x, v = 2 * a * t + v0;
    return { k: "Driving", sid: "merge", task: "Merging onto the 401, a car's distance is s(t) = " + a + "t² + " + v0 + "t metres. How fast is it going after " + t + " s, in km/h?", expr: "v(t) = s′(t) m/s, × 3.6 for km/h",
      correct: opt(fN(v * 3.6, 1) + " km/h", v * 3.6), truthN: numd(s, t) * 3.6,
      wrong: [opt(fN(v, 1) + " km/h", v, "That is in m/s. Multiply by 3.6 for km/h."),
              opt(fN((a * t + v0) * 3.6, 1) + " km/h", (a * t + v0) * 3.6, "The derivative of " + a + "t² is " + (2 * a) + "t."),
              opt(fN(s(t), 1) + " km/h", s(t), "That is the distance travelled in metres.")],
      walk: ["v(t) = " + (2 * a) + "t + " + v0 + ".", "v(" + t + ") = " + v + " m/s.", "× 3.6 = " + m_(fN(v * 3.6, 1) + " km/h") + "."] };
  }
];

/* ---- max and min ---- */
C.maxmin = [
  function pricing() {
    const top = pick([20, 30, 40]), B = pick([50, 100]), A = top * B, c = pick([4, 6, 8, 10]), best = (top + c) / 2;
    return { k: "Finance", sid: "pricing", task: "Each item costs you " + money(c, 0) + ". At price p you sell " + A.toLocaleString("en-CA") + " − " + B + "p a week. Profit P = (p − " + c + ")(" + A + " − " + B + "p). What price makes the most profit?", expr: "P(p) = (p − " + c + ")(" + A + " − " + B + "p)",
      correct: opt(money(best), best), truthN: (A / B + c) / 2,
      wrong: [opt(money(top), top), opt(money(top / 2), top / 2), opt(money(c), c)].map((o, i) => Object.assign(o, { why: ["At " + money(top) + " nobody buys: " + A + " − " + B + "(" + top + ") = 0.", "That is the best price if items were free. Your cost pushes it up to halfway between " + money(c, 0) + " and " + money(top, 0) + ".", "At cost you make nothing on each sale."][i] })),
      walk: ["P′(p) = (" + A + " − " + B + "p) − " + B + "(p − " + c + ") = " + (A + B * c) + " − " + (2 * B) + "p.", "Zero at p = " + m_(money(best)) + ".", "Halfway between your cost, " + money(c, 0) + ", and the price where sales stop, " + money(top, 0) + "."] };
  },
  function throwBall() {
    const m = pick([1, 1.5, 2]), v = 9.8 * m, h = t => -4.9 * t * t + v * t + 1.8, ans = h(m);
    return { k: "Sport", sid: "throw", task: "A ball is thrown up from 1.8 m: h(t) = −4.9t² + " + fN(v, 1) + "t + 1.8. What is its highest point?", expr: "h(t) = −4.9t² + " + fN(v, 1) + "t + 1.8",
      correct: opt(fN(ans, 2) + " m", ans), truthN: 1.8 + v * v / (4 * 4.9),
      wrong: [opt(fN(m, 2) + " m", m, "That is the time of the peak, " + m + " s. Put it into h(t)."),
              opt(fN(9.8 * m * m + 1.8, 2) + " m", 9.8 * m * m + 1.8, "Check h(" + m + ") = −4.9(" + (m * m) + ") + " + fN(v, 1) + "(" + m + ") + 1.8."),
              opt(fN(4.9 * m * m, 2) + " m", 4.9 * m * m, "That is how far it rose. It started 1.8 m up.")],
      walk: ["h′(t) = −9.8t + " + fN(v, 1) + " = 0 at t = " + m + " s.", "h(" + m + ") = " + m_(fN(ans, 2) + " m") + "."] };
  }
];

/* ---- concavity ---- */
C.concav = [
  function price() {
    const a = ri(2, 6), c = pick([40, 50, 80]), P = t => -t * t * t + 3 * a * t * t + c;
    return { k: "Finance", sid: "price", task: "After a product launch, a stock's price is modelled as P(t) = −t³ + " + (3 * a) + "t² + " + c + " (t in months). When is the price rising fastest?", expr: "P(t) = −t³ + " + (3 * a) + "t² + " + c,
      correct: opt("Month " + a, a), truthN: (3 * a) / 3,
      wrong: [opt("Month " + (2 * a), 2 * a, "At month " + (2 * a) + ", P′ = 0: that is the peak price. The fastest rise is where P″ = 0."),
              opt("Month " + (3 * a), 3 * a, "Month " + (3 * a) + " comes from the coefficient " + (3 * a) + ". Set P″(t) = −6t + " + (6 * a) + " = 0."),
              opt("Month 0", 0, "At launch P′(0) = 0: the rise hasn't started.")],
      walk: ["P′(t) = −3t² + " + (6 * a) + "t, the rate of rise.", "P″(t) = −6t + " + (6 * a) + " = 0 at t = " + a + ".", "The rise is fastest at " + m_("month " + a) + ": the point of inflection."] };
  },
  function outbreak() {
    const a = pick([10, 12, 15, 20]);
    return { k: "Health", sid: "outbreak", task: "Total cases in an outbreak follow C(t) = " + (3 * a) + "t² − t³ for t days. On what day is the number of new cases per day at its peak?", expr: "C(t) = " + (3 * a) + "t² − t³",
      correct: opt("Day " + a, a), truthN: (6 * a) / 6,
      wrong: [opt("Day " + (2 * a), 2 * a, "On day " + (2 * a) + " new cases per day drop to zero: C′ = 0. The peak of daily cases is where C″ = 0."),
              opt("Day " + (3 * a), 3 * a, "On day " + (3 * a) + " the model's total falls back to zero, which ends the model."),
              opt("Day " + (a / 2), a / 2, "Set C″(t) = " + (6 * a) + " − 6t = 0.")],
      walk: ["New cases per day: C′(t) = " + (6 * a) + "t − 3t².", "Their peak: C″(t) = " + (6 * a) + " − 6t = 0, so t = " + a + ".", m_("Day " + a) + " is the inflection point: after it, the outbreak is slowing."] };
  }
];

/* ---- optimization ---- */
C.optim = [
  function tickets() {
    const A = pick([18000, 20000, 24000]), B = pick([200, 250, 300, 400]), best = A / (2 * B);
    return { k: "Finance", sid: "tickets", task: "At a ticket price of p dollars, an arena sells " + A.toLocaleString("en-CA") + " − " + B + "p seats. What price brings in the most revenue?", expr: "R(p) = p(" + A.toLocaleString("en-CA") + " − " + B + "p)",
      correct: opt(money(best), best), truthN: A / (2 * B),
      wrong: [opt(money(A / B), A / B, "At that price nobody comes: " + A + " − " + B + "p = 0. Revenue peaks halfway there."),
              opt(money(A / (4 * B)), A / (4 * B), "R′(p) = " + A + " − " + (2 * B) + "p. Solve for p."),
              opt(money(A / B / 3), A / B / 3, "R′(p) = " + A + " − " + (2 * B) + "p = 0 gives p = " + money(best) + ".")],
      walk: ["R(p) = " + A + "p − " + B + "p².", "R′(p) = " + A + " − " + (2 * B) + "p = 0.", "p = " + m_(money(best)) + ", selling " + (A / 2).toLocaleString("en-CA") + " seats."] };
  },
  function pens() {
    const P = 12 * ri(3, 12), best = P * P / 24;
    return { k: "Home", sid: "pens", task: "You have " + P + " m of fence for a rectangular pen split in two by a fence across the middle (three parallel sides of length x). Largest total area?", expr: "A(x) = x(" + P + " − 3x) ÷ 2",
      correct: opt(best.toLocaleString("en-CA") + " m²", best), truthN: (P / 6) * ((P - 3 * P / 6) / 2),
      wrong: [opt((P * P / 16).toLocaleString("en-CA") + " m²", P * P / 16, "That is a square with no divider. The divider uses fence too."),
              opt((P / 6) + " m²", P / 6, "That is the best x, " + (P / 6) + " m. The question asks for the area."),
              opt((P * P / 18).toLocaleString("en-CA") + " m²", P * P / 18, "Check: x = " + (P / 6) + " and the other side is (" + P + " − " + (P / 2) + ") ÷ 2 = " + (P / 4) + ".")],
      walk: ["A(x) = (" + P + "x − 3x²) ÷ 2.", "A′(x) = (" + P + " − 6x) ÷ 2 = 0, so x = " + (P / 6) + " m and the other side is " + (P / 4) + " m.", "Area = " + (P / 6) + " × " + (P / 4) + " = " + m_(best.toLocaleString("en-CA") + " m²") + "."] };
  }
];

/* ---- vector basics ---- */
C.vbasic = [
  function crosswind() {
    const base = pick([[4, 3], [3, 4], [12, 5], [5, 12], [8, 15]]), L = Math.hypot(base[0], base[1]), sc = pick([20, 25, 30, 40].filter(s => s * L >= 250 && s * L <= 700)) || 30;
    const R = base.map(x => x * sc), W = [pick([-40, -30, -20, 20, 30, 40]), pick([-40, -30, -20, 20, 30, 40])], A = sub(R, W), ans = L * sc;
    return { k: "Science", sid: "crosswind", task: "A plane's airspeed vector is (" + A.join(", ") + ") km/h and the wind is (" + W.map(neg).join(", ") + ") km/h. How fast is it moving over the ground?", expr: "ground = air + wind",
      correct: opt(fN(ans, 1) + " km/h", ans), truthN: len(add(A, W)),
      wrong: [opt(fN(len(A), 1) + " km/h", len(A), "That is the airspeed alone. Add the wind vector first."),
              opt(fN(len(A) + len(W), 1) + " km/h", len(A) + len(W), "Lengths don't add unless the vectors point the same way. Add the vectors, then find the length."),
              opt(fN(R[0] + R[1], 1) + " km/h", R[0] + R[1], "You added the components. Length is √(x² + y²).")],
      walk: ["Ground velocity = (" + A.join(", ") + ") + (" + W.map(neg).join(", ") + ") = (" + R.join(", ") + ").", "Speed = √(" + R[0] + "² + " + R[1] + "²) = " + m_(fN(ans, 1) + " km/h") + "."] };
  },
  function holdings() {
    const H = [ri(20, 60), ri(10, 40), ri(2, 15)], T = [nz(-8, 8), nz(-8, 8), nz(-5, 5)], ans = add(H, T), j = ri(0, 2), slip = ans.slice(); slip[j] = H[j] - T[j];
    const k$ = v => "(" + v.map(x => neg(x) + "k").join(", ") + ")";
    return { k: "Finance", sid: "holdings", task: "You hold " + k$(H) + " in (stocks, bonds, cash), in thousands of dollars. You trade " + k$(T) + ". What do you hold now?", expr: "H + T",
      correct: { html: k$(ans), v: ans }, truthV: add(H, T),
      wrong: [{ html: k$(sub(H, T)), v: sub(H, T), why: "You subtracted the trades. A negative trade already means selling." },
              { html: k$(slip), v: slip, why: "Sign slip in one component. Add each pair: " + neg(H[j]) + " + (" + neg(T[j]) + ") = " + neg(ans[j]) + "." },
              { html: k$(T), v: T, why: "Those are the trades. Add them to what you held." }],
      walk: ["Add matching components.", k$(H) + " + " + k$(T) + " = " + m_(k$(ans)) + "."] };
  }
];

/* ---- dot product ---- */
C.dotp = [
  function portfolio() {
    const w = pick([[50, 30, 20], [60, 30, 10], [40, 40, 20], [70, 20, 10]]); let r; do { r = [ri(-5, 12), ri(-3, 8), ri(-4, 6)]; } while (!r.some(x => x < 0) || r.some(x => x === 0));
    const ans = dot(w, r) / 100, avg = (r[0] + r[1] + r[2]) / 3, noNeg = dot(w, r.map(Math.abs)) / 100;
    return { k: "Finance", sid: "portfolio", task: "Your money is split " + w.join("/") + " among three funds that returned " + r.map(x => neg(x) + "%").join(", ") + " this year. What did the whole portfolio return?", expr: "(" + w.map(x => x / 100).join(", ") + ") · (" + r.map(neg).join(", ") + ")",
      correct: opt(fN(ans, 1) + "%", ans), truthN: (w[0] * r[0] + w[1] * r[1] + w[2] * r[2]) / 100,
      wrong: [opt(fN(avg, 1) + "%", avg, "That is the plain average. Weight each return by how much money is in it."),
              opt(fN(r[0] + r[1] + r[2], 1) + "%", r[0] + r[1] + r[2], "You added the returns. Weight them: " + w.map((x, i) => (x / 100) + " × " + neg(r[i])).join(" + ") + "."),
              opt(fN(noNeg, 1) + "%", noNeg, "You dropped a minus sign. A losing fund pulls the total down.")],
      walk: [w.map((x, i) => (x / 100) + " × " + neg(r[i]) + " = " + fN(x * r[i] / 100, 2)).join(", ") + ".", "Add: " + m_(fN(ans, 1) + "%") + "."] };
  },
  function receipt() {
    const P = shuffle([1.99, 3.49, 4.25, 6.5, 2.75, 12.99]).slice(0, 3), q = [ri(1, 6), ri(1, 6), ri(1, 6)], ans = dot(q, P);
    return { k: "Finance", sid: "receipt", task: "At the grocery store you buy quantities (" + q.join(", ") + ") of three items priced (" + P.map(p => money(p)).join(", ") + "). What is the total?", expr: "quantities · prices",
      correct: opt(money(ans), ans), truthN: q[0] * P[0] + q[1] * P[1] + q[2] * P[2],
      wrong: [opt(money(P[0] + P[1] + P[2]), P[0] + P[1] + P[2], "That is one of each. Multiply each price by its quantity."),
              opt(money((q[0] + q[1] + q[2]) * (P[0] + P[1] + P[2])), (q[0] + q[1] + q[2]) * (P[0] + P[1] + P[2]), "You multiplied the totals. A dot product multiplies matching pairs, then adds."),
              opt(money(ans - P[1] * q[1] + P[1]), ans - P[1] * q[1] + P[1], "You counted only one of the second item. There are " + q[1] + ".")],
      walk: [q.map((x, i) => x + " × " + money(P[i]) + " = " + money(x * P[i])).join(", ") + ".", "Total: " + m_(money(ans)) + "."] };
  },
  function sled() {
    const k = pick([4, 5, 6]), F = [12 * k, 5 * k], d = pick([10, 20, 25]), W = F[0] * d;
    return { k: "Science", sid: "sled", task: "You pull a sled with a force of (" + F.join(", ") + ") N (forward, upward) and it moves (" + d + ", 0) m along the ground. How much work did you do?", expr: "W = F · d",
      correct: opt(W.toLocaleString("en-CA") + " J", W), truthN: dot(F, [d, 0]),
      wrong: [opt((13 * k * d).toLocaleString("en-CA") + " J", 13 * k * d, "That uses the full pull, |F| = " + (13 * k) + " N. Only the part along the motion does work."),
              opt((F[1] * d).toLocaleString("en-CA") + " J", F[1] * d, "That is the upward part. The sled moves forward."),
              opt(((F[0] + F[1]) * d).toLocaleString("en-CA") + " J", (F[0] + F[1]) * d, "You added the force components. Dot with the displacement: " + F[0] + " × " + d + " + " + F[1] + " × 0.")],
      walk: ["F · d = " + F[0] + " × " + d + " + " + F[1] + " × 0.", "= " + m_(W.toLocaleString("en-CA") + " J") + ". The upward pull lightens the sled but does no work moving it."] };
  }
];

/* ---- angles and projections ---- */
const CORR = [[[2, -1, 1, -2], [1, -1, 2, -2]], [[1, -1, 1, -1], [1, 1, -1, -1]], [[2, -2, 1, -1], [-2, 2, -1, 1]], [[1, -1, 1, -1], [1, -1, 0, 0]], [[1, -1, 1, -1], [2, -2, 1, -1]], [[3, -1, -1, -1], [1, 1, -1, -1]]];
C.angle = [
  function correlation() {
    const [a0, b0] = pick(CORR), perm = shuffle([0, 1, 2, 3]), sa = ri(1, 3), sb = ri(1, 3), a = perm.map(i => a0[i] * sa), b = perm.map(i => b0[i] * sb);
    const d = dot(a, b), c = d / (len(a) * len(b));
    return { k: "Finance", sid: "corr", task: "Two stocks' quarterly returns, measured from their averages, are a = (" + a.map(neg).join(", ") + ") and b = (" + b.map(neg).join(", ") + "). What is their correlation, cos θ?", expr: "cos θ = a · b ÷ (|a||b|)",
      correct: opt(fN(c, 2), c), truthN: d / Math.sqrt(dot(a, a) * dot(b, b)),
      wrong: [opt(fN(d, 2), d, "That is a · b. Divide by both lengths to get a number between −1 and 1."),
              opt(fN(-c, 2), -c, "Sign slip. a · b = " + neg(d) + "."),
              opt(fN(d / dot(b, b), 2), d / dot(b, b), "You divided by |b|² only. Correlation divides by |a| × |b|.")],
      walk: ["a · b = " + neg(d) + ". |a| = " + fN(len(a), 3) + ", |b| = " + fN(len(b), 3) + ".", "cos θ = " + m_(fN(c, 2)) + ".", Math.abs(c) > 0.8 ? "Strongly related: holding both spreads little risk." : Math.abs(c) < 0.2 ? "Close to unrelated: a good pair for spreading risk." : "Partly related."] };
  },
  function solar() {
    const P = [[2, 3, 6, 7], [1, 2, 2, 3], [2, 6, 9, 11], [4, 4, 7, 9]];
    let s, n, sL, nL; do { const A = pick(P), B = pick(P); s = shuffle(A.slice(0, 3)); n = shuffle(B.slice(0, 3)); sL = A[3]; nL = B[3]; } while (dot(s, n) <= 0 || s.join() === n.join());
    const c = dot(s, n) / (sL * nL);
    return { k: "Nature", sid: "solar", task: "Sunlight comes from direction s = (" + s.join(", ") + ") and a solar panel faces n = (" + n.join(", ") + "). What percent of its full power does it make? (Power ∝ cos θ.)", expr: "cos θ = s · n ÷ (|s||n|)",
      correct: opt(fN(c * 100, 1) + "%", c * 100), truthN: dot(s, n) / (len(s) * len(n)) * 100,
      wrong: [opt(fN(dot(s, n), 1) + "%", dot(s, n), "That is s · n. Divide by the two lengths, " + sL + " and " + nL + "."),
              opt(fN(100 - c * 100, 1) + "%", 100 - c * 100, "That is the power lost, not the power made."),
              opt(fN(Math.acos(c) * 180 / Math.PI, 1) + "%", Math.acos(c) * 180 / Math.PI, "That is the angle in degrees. The power fraction is its cosine.")],
      walk: ["s · n = " + dot(s, n) + ", |s| = " + sL + ", |n| = " + nL + ".", "cos θ = " + dot(s, n) + " ÷ " + (sL * nL) + " = " + fN(c, 3) + ".", "About " + m_(fN(c * 100, 1) + "%") + " of full power."] };
  }
];

/* ---- cross product ---- */
C.crossp = [
  function wrench() {
    const L = pick([0.2, 0.25, 0.3, 0.4]), k = pick([10, 20, 25]), F = [3 * k, 4 * k, 0], T = L * F[1];
    return { k: "Home", sid: "wrench", task: "You push on a wrench at r = (" + L + ", 0, 0) m from the bolt with force F = (" + F.join(", ") + ") N. What is the size of the torque, |r × F|?", expr: "r × F",
      correct: opt(fN(T, 1) + " N·m", T), truthN: len(cross([L, 0, 0], F)),
      wrong: [opt(fN(L * F[0], 1) + " N·m", L * F[0], "That uses the part of the push along the handle, which does not turn the bolt."),
              opt(fN(L * 5 * k, 1) + " N·m", L * 5 * k, "That uses the whole push, |F| = " + (5 * k) + " N. Only the part at right angles to the handle turns it."),
              opt(fN(L + F[1], 1) + " N·m", L + F[1], "The cross product multiplies; it does not add.")],
      walk: ["r × F = (0, 0, " + L + " × " + F[1] + " − 0 × " + F[0] + ").", "|r × F| = " + m_(fN(T, 1) + " N·m") + ". Only the push at right angles to the handle counts."] };
  },
  function lot() {
    let u, v, A2; do { u = [ri(10, 60), ri(-20, 20)]; v = [ri(-20, 30), ri(10, 60)]; A2 = u[0] * v[1] - u[1] * v[0]; } while (A2 <= 0 || A2 % 2);
    const price = pick([150, 200, 350]), area = A2 / 2, val = area * price;
    return { k: "Finance", sid: "lot", task: "A triangular lot has corners at the origin, (" + u.map(neg).join(", ") + ") m and (" + v.map(neg).join(", ") + ") m. Land sells for " + money(price, 0) + "/m². What is the lot worth?", expr: "Area = ½|u × v|",
      correct: opt(money(val, 0), val), truthN: Math.abs(u[0] * v[1] - u[1] * v[0]) / 2 * price,
      wrong: [opt(money(A2 * price, 0), A2 * price, "|u × v| is the parallelogram. The triangle is half of it."),
              opt(money(Math.abs(dot(u, v)) / 2 * price, 0), Math.abs(dot(u, v)) / 2 * price, "That uses the dot product. Area needs the cross product: u₁v₂ − u₂v₁."),
              opt(money(Math.abs(u[0] * v[1] + u[1] * v[0]) / 2 * price, 0), Math.abs(u[0] * v[1] + u[1] * v[0]) / 2 * price, "Subtract the cross terms: u₁v₂ − u₂v₁.")],
      walk: ["u₁v₂ − u₂v₁ = " + (u[0] * v[1]) + " − (" + neg(u[1] * v[0]) + ") = " + A2 + ".", "Triangle area = " + A2 + " ÷ 2 = " + area.toLocaleString("en-CA") + " m².", "Value = " + area.toLocaleString("en-CA") + " × " + money(price, 0) + " = " + m_(money(val, 0)) + "."] };
  }
];

/* ---- lines in space ---- */
C.lines = [
  function flight() {
    const P = [ri(-50, 50), ri(-50, 50), ri(8, 11)], d = [nz(-9, 9), nz(-9, 9), pick([0, -1])], t = ri(3, 12), X = add(P, d.map(x => x * t)), j = ri(0, 1), slip = X.slice(); slip[j] = P[j] - d[j] * t;
    return { k: "Science", sid: "flight", task: "Radar places a plane at (" + P.map(neg).join(", ") + ") km, moving (" + d.map(neg).join(", ") + ") km per minute. Where will it be in " + t + " minutes?", expr: "r = P + t d",
      correct: { html: vec(X) + " km", v: X }, truthV: P.map((x, i) => x + t * d[i]),
      wrong: [{ html: vec(slip) + " km", v: slip, why: "Sign slip in one component: add " + t + " × (" + neg(d[j]) + ")." },
              { html: vec(d.map(x => x * t)) + " km", v: d.map(x => x * t), why: "That is how far it moved. Add it to where it started." },
              { html: vec(add(P, d)) + " km", v: add(P, d), why: "That is after 1 minute. Multiply the direction by " + t + "." }],
      walk: [t + " × " + vec(d) + " = " + vec(d.map(x => x * t)) + ".", vec(P) + " + that = " + m_(vec(X) + " km") + "."] };
  },
  function glide() {
    const [S, D] = pick([[[80, 15, 5], [-2, 1, 1]], [[70, 20, 10], [-2, 2, 0]], [[90, 5, 5], [-3, 2, 1]], [[75, 20, 5], [-1, 1, 0]]]), A0 = pick([35, 40, 45]), t = ri(5, 20), age = A0 + t, X = add(S, D.map(x => x * t));
    if (X.some(x => x < 0)) return null;
    return { k: "Finance", sid: "glide", task: "At " + A0 + " a retirement fund holds (" + S.join(", ") + ")% in (stocks, bonds, cash) and shifts (" + D.map(neg).join(", ") + ") percentage points a year. What does it hold at " + age + "?", expr: "r = (" + S.join(", ") + ") + t(" + D.map(neg).join(", ") + ")",
      correct: { html: vec(X) + "%", v: X }, truthV: S.map((x, i) => x + t * D[i]),
      wrong: [{ html: vec(add(S, D.map(x => x * age))) + "%", v: add(S, D.map(x => x * age)), why: "t is years since " + A0 + ", so t = " + t + ", not " + age + "." },
              { html: vec(sub(S, D.map(x => x * t))) + "%", v: sub(S, D.map(x => x * t)), why: "You went backwards. Add t times the yearly shift." },
              { html: vec(add(S, D)) + "%", v: add(S, D), why: "That is one year later. Multiply the shift by " + t + "." }],
      walk: ["t = " + age + " − " + A0 + " = " + t + " years.", vec(S) + " + " + t + vec(D) + " = " + m_(vec(X) + "%") + "."] };
  }
];

/* ---- planes ---- */
C.planes = [
  function income() {
    const y = pick([[2, 4, 3], [3, 5, 4], [2, 3, 5], [4, 2, 6]]), x = ri(1, 8) * 1000, yy = ri(1, 8) * 1000, z = ri(1, 8) * 1000, I = (y[0] * x + y[1] * yy + y[2] * z) / 100;
    return { k: "Finance", sid: "income", task: "Three funds pay " + y.map(v => v + "%").join(", ") + " a year. You hold " + money(x, 0) + " in the first and " + money(yy, 0) + " in the second. How much in the third gives exactly " + money(I, 0) + " a year?", expr: y.map((v, i) => (v / 100) + "xyz"[i]).join(" + ") + " = " + I,
      correct: opt(money(z, 0), z), truthN: (I - y[0] * x / 100 - y[1] * yy / 100) / (y[2] / 100),
      wrong: [opt(money(I / (y[2] / 100), 0), I / (y[2] / 100), "That ignores the income from the first two funds. Subtract it first."),
              opt(money(I - (y[0] * x + y[1] * yy) / 100, 0), I - (y[0] * x + y[1] * yy) / 100, "That is the income still needed. Divide by " + (y[2] / 100) + " to get the amount to hold."),
              opt(money((I + (y[0] * x + y[1] * yy) / 100) / (y[2] / 100), 0), (I + (y[0] * x + y[1] * yy) / 100) / (y[2] / 100), "Sign slip: the first two funds' income is subtracted from the target.")],
      walk: ["Income from the first two: " + money(y[0] * x / 100, 0) + " + " + money(y[1] * yy / 100, 0) + " = " + money((y[0] * x + y[1] * yy) / 100, 0) + ".", "Still needed: " + money(I - (y[0] * x + y[1] * yy) / 100, 0) + ".", "÷ " + (y[2] / 100) + " = " + m_(money(z, 0)) + "."] };
  },
  function roof() {
    const n = [pick([1, 2, 3]), pick([1, 2, 3]), pick([4, 5, 6])], x = ri(1, 6), y = ri(1, 6), z = ri(3, 8), d = n[0] * x + n[1] * y + n[2] * z;
    return { k: "Home", sid: "roof", task: "A roof is the plane " + n[0] + "x + " + n[1] + "y + " + n[2] + "z = " + d + " (metres). How high is it above the point (" + x + ", " + y + ")?", expr: "z = (" + d + " − " + n[0] + "x − " + n[1] + "y) ÷ " + n[2],
      correct: opt(fN(z, 2) + " m", z), truthN: (d - n[0] * x - n[1] * y) / n[2],
      wrong: [opt(fN(d / n[2], 2) + " m", d / n[2], "That is the height above the origin. Put in x = " + x + " and y = " + y + " first."),
              opt(fN(d - n[0] * x - n[1] * y, 2) + " m", d - n[0] * x - n[1] * y, "Divide by the z coefficient, " + n[2] + "."),
              opt(fN((d + n[0] * x + n[1] * y) / n[2], 2) + " m", (d + n[0] * x + n[1] * y) / n[2], "Moving the x and y terms across changes their sign.")],
      walk: [n[2] + "z = " + d + " − " + (n[0] * x) + " − " + (n[1] * y) + " = " + (n[2] * z) + ".", "z = " + m_(fN(z, 2) + " m") + "."] };
  }
];

/* ---- line meets plane ---- */
C.lineplane = [
  function cloud() {
    const dz = pick([0.2, 0.25, 0.5]), T = ri(4, 12), hc = pick([0.5, 0.8, 1, 1.5]), h0 = +(hc + dz * T).toFixed(2), P = [ri(-20, 20), ri(-20, 20), h0], d = [nz(-6, 6), nz(-6, 6), -dz];
    return { k: "Science", sid: "cloud", task: "A plane on approach is at (" + P.map(neg).join(", ") + ") km, moving (" + d.map(neg).join(", ") + ") km per minute. The cloud base is the plane z = " + hc + ". In how many minutes does it enter the cloud?", expr: h0 + " − " + dz + "t = " + hc,
      correct: opt(fN(T, 1) + " min", T), truthN: (h0 - hc) / dz,
      wrong: [opt(fN(h0 / dz, 1) + " min", h0 / dz, "That is when it would reach the ground, z = 0. The cloud is at z = " + hc + "."),
              opt(fN(hc / dz, 1) + " min", hc / dz, "Solve " + h0 + " − " + dz + "t = " + hc + ": the drop needed is " + fN(h0 - hc, 2) + " km."),
              opt(fN((h0 + hc) / dz, 1) + " min", (h0 + hc) / dz, "Subtract the cloud height from the starting height.")],
      walk: ["Only z matters for a horizontal plane: " + h0 + " − " + dz + "t = " + hc + ".", "t = " + fN(h0 - hc, 2) + " ÷ " + dz + " = " + m_(fN(T, 1) + " minutes") + "."] };
  },
  function target() {
    const t = pick([4, 6, 8, 10, 12, 14]), E = (490 - 7 * t) / 100, A0 = 45;
    return { k: "Finance", sid: "target", task: "A glide path runs r = (70, 20, 10) + t(−2, 1.5, 0.5) from age 45. With returns of 6%, 3% and 1%, expected return is (6s + 3b + c)/100 %. At what age does it fall to " + fN(E, 2) + "%?", expr: "6(70 − 2t) + 3(20 + 1.5t) + (10 + 0.5t) = " + Math.round(E * 100),
      correct: opt("Age " + (A0 + t), A0 + t), truthN: A0 + (490 - E * 100) / 7,
      wrong: [opt("Age " + t, t, "t is years after 45. Add 45."),
              opt("Age " + (A0 + t + 2), A0 + t + 2, "Check: 490 − 7t = " + Math.round(E * 100) + " gives t = " + t + "."),
              opt("Age 65", 65, "65 is the end of the glide path, not where it crosses " + fN(E, 2) + "%.")].filter(o => o.n !== A0 + t),
      walk: ["Substitute: 490 − 7t = " + Math.round(E * 100) + ".", "t = " + t + " years after 45, so " + m_("age " + (A0 + t)) + "."] };
  }
];

/* ---- distance to a plane ---- */
C.dist = [
  function drone() {
    const N = pick([[2, 1, 2, 3], [1, 2, 2, 3], [2, 3, 6, 7], [6, 2, 3, 7]]), n = N.slice(0, 3), L = N[3], F = [ri(0, 6), ri(0, 6), ri(2, 8)], D = dot(n, F), k = ri(1, 3), Q = add(F, n.map(x => k * x));
    const top = dot(n, Q) - D, ans = top / L, vert = top / n[2];
    return { k: "Science", sid: "drone", task: "A hillside is the plane " + n[0] + "x + " + n[1] + "y + " + n[2] + "z = " + D + " (metres). A drone hovers at (" + Q.join(", ") + "). How close is it to the slope?", expr: "|n · Q − d| ÷ |n|",
      correct: opt(fN(ans, 2) + " m", ans), truthN: Math.abs(dot(n, Q) - D) / len(n),
      wrong: [opt(fN(top, 2) + " m", top, "You forgot to divide by |n| = " + L + "."),
              opt(fN(vert, 2) + " m", vert, "That is the height straight down to the slope. The shortest path runs along the normal."),
              opt(fN(top / (L * L), 2) + " m", top / (L * L), "Divide by |n| = " + L + ", not |n|² = " + (L * L) + ".")],
      walk: ["n · Q − d = " + dot(n, Q) + " − " + D + " = " + top + ".", "|n| = " + L + ".", "Distance = " + top + " ÷ " + L + " = " + m_(fN(ans, 2) + " m") + ", less than the " + fN(vert, 2) + " m straight down."] };
  },
  function gap() {
    const F = [ri(2, 8) * 1000, ri(2, 8) * 1000, ri(1, 5) * 1000], I = (2 * F[0] + 3 * F[1] + 6 * F[2]) / 100, k = ri(1, 5), Q = sub(F, [200 * k, 300 * k, 600 * k]);
    if (Q.some(x => x < 0)) return null;
    const short = I - (2 * Q[0] + 3 * Q[1] + 6 * Q[2]) / 100, ans = short / 0.07;
    return { k: "Finance", sid: "gap", task: "Funds paying 2%, 3% and 6% hold (" + Q.map(x => money(x, 0)).join(", ") + "). Your income target is " + money(I, 0) + " a year: the plane 0.02x + 0.03y + 0.06z = " + I + ". How far is your portfolio from the target plane, in dollars?", expr: "|n · Q − d| ÷ |n|, &nbsp;|n| = √(0.02² + 0.03² + 0.06²) = 0.07",
      correct: opt(money(ans, 0), ans), truthN: Math.abs(0.02 * Q[0] + 0.03 * Q[1] + 0.06 * Q[2] - I) / Math.sqrt(0.02 * 0.02 + 0.03 * 0.03 + 0.06 * 0.06),
      wrong: [opt(money(short, 0), short, "That is the income shortfall. Divide by |n| = 0.07 to turn it into a distance in dollars held."),
              opt(money(short / 0.0049, 0), short / 0.0049, "You divided by |n|² = 0.0049. Divide by |n| = 0.07."),
              opt(money(short / 0.06, 0), short / 0.06, "That is how much extra to put in the 6% fund alone. The straight-line distance spreads the change along the normal.")],
      walk: ["Income now: " + money(I - short, 0) + ". Shortfall: " + money(short, 0) + ".", "Distance = " + money(short, 0) + " ÷ 0.07 = " + m_(money(ans, 0)) + ".", "The shortest move adds to each fund in proportion to its yield: 2 : 3 : 6."] };
  }
];

/* ---------- build ---------- */
CP.buildCtx = function (stepId, sid) {
  const pool = C[stepId];
  for (let tries = 0; tries < 60; tries++) {
    const fn = sid ? pool.find(f => f.name === sid || f.sid === sid) || pick(pool) : pick(pool);
    const p = fn();
    if (!p) continue;
    const seen = new Set([keyOf(p.correct.html)]), w = [];
    for (const o of p.wrong) { const k = keyOf(o.html); if (typeof p.correct.n === "number" && typeof o.n === "number" && Math.abs(o.n - p.correct.n) < 1e-12) continue; if (!seen.has(k)) { seen.add(k); w.push(o); } }
    if (w.length < 3) continue;
    p.wrong = w.slice(0, 3); p.mode = "ctx"; p.prose = p.correct.html.length > 18;
    p.options = shuffle([Object.assign({ ok: true }, p.correct)].concat(p.wrong.map(o => Object.assign({ ok: false }, o))));
    return p;
  }
  throw new Error("could not build context " + stepId);
};
})();
