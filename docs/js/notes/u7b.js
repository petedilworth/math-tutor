/* Worked notes: where a line meets a plane, where planes meet, skew lines, distance from a point to a plane. */
(function () {
const { fmt, money, pct, sig, sup } = CP.nh;
/* small vector and equation helpers for this file */
const V = (a, d = 3) => "(" + a.map(x => sig(x, d)).join(", ") + ")";
const Vf = (a, d = 1) => "(" + a.map(x => fmt(x, d)).join(", ") + ")";
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = a => Math.sqrt(dot(a, a));
const sub = (a, b) => a.map((x, i) => x - b[i]);
const isInt = v => Math.abs(v - Math.round(v)) < 1e-9;
const num = x => (isInt(x) && Math.abs(x) >= 1000 ? fmt(Math.round(x), 0) : sig(x, 4));
const tm = (c, v, first) => {
  if (Math.abs(c) < 1e-12) return "";
  const s = (Math.abs(c) === 1 ? "" : num(Math.abs(c))) + v;
  return first ? (c < 0 ? "−" + s : s) : (c < 0 ? " − " : " + ") + s;
};
const eqs = (cs, vs, r) => { let o = ""; cs.forEach((c, i) => { o += tm(c, vs[i], o === ""); }); return (o || "0") + " = " + num(r); };
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const tidy = (e, reduce = true) => {
  let f = e.map(v => (Math.abs(v) < 1e-12 ? 0 : v));
  if (reduce && f.every(isInt)) { f = f.map(Math.round); const g = f.reduce((g, v) => gcd(g, Math.abs(v)), 0); if (g > 1) f = f.map(v => v / g); }
  const lead = f.slice(0, -1).find(v => v !== 0);
  if (lead !== undefined && lead < 0) f = f.map(v => (v === 0 ? 0 : -v));
  return f;
};
const comb = (Ei, E1, k) => {
  const p = E1[k], q = Ei[k];
  if (q === 0) return Ei.slice();
  if (isInt(q / p)) { const m = q / p; return Ei.map((v, j) => v - m * E1[j]); }
  return Ei.map((v, j) => p * v - q * E1[j]);
};
/* eliminate the first variable, then the second; returns the reduced rows and the solution */
const elim3 = (A, b) => {
  const E = A.map((r, i) => r.concat(b[i]));
  const E2 = tidy(comb(E[1], E[0], 0)), E3 = tidy(comb(E[2], E[0], 0));
  const raw = comb(E3, E2, 1), last = tidy(raw, false);
  const ok = Math.abs(last[2]) > 1e-12;
  const z = ok ? last[3] / last[2] : NaN, y = (E2[3] - E2[2] * z) / E2[1], x = (E[0][3] - A[0][1] * y - A[0][2] * z) / A[0][0];
  return { E2, E3, last, ok, sol: [x, y, z] };
};
const yz = (e, vs) => eqs(e.slice(0, 3), vs, e[3]);

/* ---------------- Where a line meets a plane ---------------- */
CP.NOTES.lineplane = [
  { k: "Finance", t: "When a glide path crosses a target return", live: "policy",
    build(L) {
      const P = L.policy, c0 = 6 * 70 + 3 * 20 + P * 10, c1 = 6 * 2 - 3 * 1.5 - P * 0.5, t = (c0 - 420) / c1;
      const pt = [70 - 2 * t, 20 + 1.5 * t, 10 + 0.5 * t];
      return { setup: "A retirement fund starts at age 45 with 70% stocks, 20% bonds, 10% cash and moves (−2, 1.5, 0.5) points a year. Stocks earn 6%, bonds 3%, cash about the policy rate, " + fmt(P) + "%.",
        lines: [["Target plane", "6s + 3b + " + sig(P) + "c = 420", "4.2% return"],
                ["Substitute", "6(70 − 2t) + 3(20 + 1.5t) + " + sig(P) + "(10 + 0.5t) = 420", ""],
                ["Simplify", sig(c0) + " − " + sig(c1) + "t = 420", "t = " + fmt(t, 1)],
                ["Point", "(70, 20, 10) + " + fmt(t, 1) + "(−2, 1.5, 0.5)", Vf(pt)],
                ["Age", "45 + " + fmt(t, 1), fmt(45 + t, 1)]],
        take: "The expected return falls to 4.2% at about age " + fmt(45 + t, 0) + ", when the mix is " + Vf(pt) + ". A higher cash rate pushes that crossing later, because cash holds the return up." };
    } },
  { k: "Finance", t: "Rebalancing at a 65% band",
    build() {
      const s0 = 60, b0 = 30, c0 = 10, ds = 2, db = 0.25, w = 0.65;
      const k0 = (1 - w) * s0 - w * b0 - w * c0, k1 = (1 - w) * ds - w * db, t = -k0 / k1;
      const pt = [s0 + ds * t, b0 + db * t, c0], tot = pt[0] + pt[1] + pt[2];
      return { setup: "In $1,000s, a portfolio holds (60, 30, 10) in stocks, bonds and cash. Each month stocks gain 2 and bonds 0.25: r = (60, 30, 10) + t(2, 0.25, 0). You rebalance when stocks reach 65% of the total.",
        lines: [["Rule as a plane", "s = 0.65(s + b + c) → 0.35s − 0.65b − 0.65c = 0", ""],
                ["Substitute", "0.35(60 + 2t) − 0.65(30 + 0.25t) − 0.65(10) = 0", ""],
                ["Simplify", sig(k1) + "t − " + sig(-k0) + " = 0", "t = " + fmt(t, 1) + " months"],
                ["Point", "(60, 30, 10) + " + fmt(t, 1) + "(2, 0.25, 0)", Vf(pt)],
                ["Check", fmt(pt[0], 1) + " ÷ " + fmt(tot, 1), pct(pt[0] / tot, 1)]],
        take: "After about " + fmt(t, 0) + " months the drifting portfolio crosses the 65% plane and it is time to trade. The crossing is a line meeting a plane: substitute, solve for t, put t back." };
    } },
  { k: "Finance", t: "When the fun budget runs out", live: "usdcad",
    build(L) {
      const U = L.usdcad, B = 8000, a = 500, u = 200, o = 300, k = a + U * u + o, t = B / k;
      return { setup: "A household sets aside C$8,000 for fun this year. Each month: C$500 eating out, US$200 on cross-border trips, C$300 other. A US dollar costs " + fmt(U, 4) + " Canadian.",
        lines: [["Budget plane", "x + " + fmt(U, 4) + "y + z = 8,000", "in CAD"],
                ["Substitute", "500t + " + fmt(U, 4) + "(200t) + 300t = 8,000", ""],
                ["Simplify", fmt(k, 2) + "t = 8,000", "t = " + fmt(t, 2) + " months"],
                ["Point", "t(500, 200, 300)", "(" + money(a * t, 0) + ", US" + money(u * t, 0) + ", " + money(o * t, 0) + ")"]],
        take: "The money runs out after about " + fmt(t, 1) + " months. When the loonie is weaker, each US dollar costs more, the y-coefficient grows, and the line reaches the plane sooner." };
    } },
  { k: "Finance", t: "When a ramp-up hits the profit target",
    build() {
      const p = [40, 120, 60], r0 = [10, 3, 5], d = [1, 0.5, 0.5], T = 1580, c0 = dot(p, r0), c1 = dot(p, d), t = (T - c0) / c1;
      const pt = r0.map((x, i) => x + d[i] * t);
      return { setup: "A furniture shop makes 10 chairs, 3 tables and 5 shelves a week, adding 1 chair, half a table and half a shelf each week. Profit is $40 a chair, $120 a table and $60 a shelf. When does weekly profit reach $1,580?",
        lines: [["Target plane", "40x + 120y + 60z = 1,580", ""],
                ["Substitute", "40(10 + t) + 120(3 + 0.5t) + 60(5 + 0.5t) = 1,580", ""],
                ["Simplify", fmt(c0, 0) + " + " + sig(c1) + "t = 1,580", "t = " + sig(t, 2)],
                ["Point", "(10, 3, 5) + " + sig(t, 2) + "(1, 0.5, 0.5)", V(pt, 1)]],
        take: "In week " + sig(t, 1) + " the shop makes " + sig(pt[0], 1) + " chairs, " + sig(pt[1], 1) + " tables and " + sig(pt[2], 1) + " shelves and clears $1,580. Substituting the line turns three unknowns into one: t." };
    } },
  { k: "Weather", t: "Breaking out below the cloud",
    build() {
      const z0 = 900, fwd = 75, sink = 4, base = 300, t = (z0 - base) / sink, x = fwd * t, ang = Math.atan(sink / fwd) * 180 / Math.PI;
      return { setup: "An aircraft on approach is at 900 m, moving 75 m/s forward and sinking 4 m/s: r = (0, 0, 900) + t(75, 0, −4). The cloud base is the flat plane z = 300.",
        lines: [["Substitute", "900 − 4t = 300", "t = " + fmt(t, 0) + " s"],
                ["Point", "(0, 0, 900) + " + fmt(t, 0) + "(75, 0, −4)", "(" + fmt(x, 0) + ", 0, " + base + ")"],
                ["Distance flown", fmt(x, 0) + " m", fmt(x / 1000, 2) + " km"],
                ["Descent angle", "tan⁻¹(4 ÷ 75)", fmt(ang, 1) + "°"]],
        take: "The pilot comes out of the cloud " + fmt(t, 0) + " seconds later, about " + fmt(x / 1000, 0) + " km along. The path matches the usual 3° approach slope, so pilots can plan where the runway should appear." };
    } },
  { k: "Tech", t: "Ray tracing one pixel",
    build() {
      const P = [0, 1.5, 0], d = [2, -0.5, 1], n = [2, 1, 2], D = 18, t = (D - dot(n, P)) / dot(n, d), pt = P.map((x, i) => x + d[i] * t), rays = 1920 * 1080;
      return { setup: "A camera sends a ray r = (0, 1.5, 0) + t(2, −0.5, 1) through one pixel. A surface in the scene lies on the plane 2x + y + 2z = 18.",
        lines: [["Substitute", "2(2t) + (1.5 − 0.5t) + 2(t) = 18", ""],
                ["Simplify", sig(dot(n, P)) + " + " + sig(dot(n, d)) + "t = 18", "t = " + sig(t)],
                ["Point", "(0, 1.5, 0) + " + sig(t) + "(2, −0.5, 1)", V(pt)],
                ["Rays a second", fmt(rays, 0) + " pixels × 60 frames", fmt(rays * 60 / 1e6, 0) + " million"]],
        take: "The pixel shows the surface at " + V(pt) + ". A full-HD screen at 60 frames a second needs about " + fmt(rays * 60 / 1e6, 0) + " million of these solves a second, before reflections, so graphics chips are built for it." };
    } },
  { k: "Sport", t: "Line calls in tennis",
    build() {
      const P = [10, 3.6, 0.3], d = [18, 0.5, -3], t = -P[2] / d[2], pt = P.map((x, i) => x + d[i] * t), base = 23.77 / 2, side = 8.23 / 2;
      return { setup: "Cameras fit the ball's last frames to a line: r = (10, 3.6, 0.3) + t(18, 0.5, −3), in metres from the net and the centre line. The court is the plane z = 0.",
        lines: [["Substitute", "0.3 − 3t = 0", "t = " + sig(t) + " s"],
                ["Point", "(10, 3.6, 0.3) + " + sig(t) + "(18, 0.5, −3)", V(pt)],
                ["Baseline", sig(base) + " − " + sig(pt[0]), fmt((base - pt[0]) * 100, 1) + " cm inside"],
                ["Singles sideline", sig(side) + " − " + sig(pt[1]), fmt((side - pt[1]) * 100, 1) + " cm inside"]],
        take: "The ball lands " + fmt((base - pt[0]) * 100, 1) + " cm inside the baseline: in. Real systems fit a curve, but over the last tenth of a second a line is very close." };
    } },
  { k: "Home", t: "Where a roof's shadow lands",
    build() {
      const P = [0, 0, 10], d = [2, 1, -1.5], tw = 12 / d[0], tg = -P[2] / d[2], pt = P.map((x, i) => x + d[i] * tw);
      return { setup: "A sun ray grazes a roof edge at (0, 0, 10) and travels along (2, 1, −1.5), in metres. The neighbour's wall is the plane x = 12 and the ground is z = 0.",
        lines: [["Wall", "2t = 12", "t = " + sig(tw)],
                ["Ground", "10 − 1.5t = 0", "t = " + fmt(tg, 2)],
                ["First hit", sig(tw) + " < " + fmt(tg, 2), "the wall"],
                ["Point", "(0, 0, 10) + " + sig(tw) + "(2, 1, −1.5)", V(pt)]],
        take: "The shadow of the roof edge lands " + sig(pt[2]) + " m up the neighbour's wall, not on the ground. The smaller t is the surface the ray reaches first, which is also how ray tracing decides what you see." };
    } }
];

/* ---------------- Where planes meet ---------------- */
CP.NOTES.planesys = [
  { k: "Finance", t: "Three goals, one portfolio",
    build() {
      const vs = ["x", "y", "z"], A = [[1, 1, 1], [2, 4, 5], [0, 1, -2]], b = [50000, 170000, 0], r = elim3(A, b), [x, y, z] = r.sol;
      return { setup: "Split $50,000 among funds A, B and C paying 2%, 4% and 5%. You want $1,700 a year in income and twice as much in B as in C.",
        lines: [["Planes, income ×100", eqs(A[0], vs, b[0]) + "; " + eqs(A[1], vs, b[1]) + "; " + eqs(A[2], vs, b[2]), ""],
                ["Eliminate x", yz(r.E2, vs) + "; " + yz(r.E3, vs), ""],
                ["Eliminate y", yz(r.last, vs), "z = " + num(z)],
                ["Back-substitute", "y from row 2, then x from row 1", "x = " + num(x) + ", y = " + num(y)]],
        take: "Put " + money(x, 0) + " in A, " + money(y, 0) + " in B and " + money(z, 0) + " in C. Three planes meeting at one point means exactly one portfolio meets all three goals." };
    } },
  { k: "Health", t: "Planning meals by nutrients",
    build() {
      const vs = ["o", "y", "p"], A = [[5, 17, 7], [27, 6, 7], [3, 0, 16]], b = [34, 67, 22], r = elim3(A, b), [o, y, p] = r.sol;
      return { setup: "Per serving: oats have about 5 g protein, 27 g carbs, 3 g fat; plain Greek yogurt 17, 6, 0; peanut butter 7, 7, 16. A breakfast plan wants 34 g protein, 67 g carbs, 22 g fat.",
        lines: [["Planes", eqs(A[0], vs, b[0]) + "; " + eqs(A[1], vs, b[1]) + "; " + eqs(A[2], vs, b[2]), ""],
                ["Eliminate o", yz(r.E2, vs) + "; " + yz(r.E3, vs), ""],
                ["Eliminate y", yz(r.last, vs), "p = " + sig(p)],
                ["Back-substitute", "y from row 2, then o from row 1", "o = " + sig(o) + ", y = " + sig(y)]],
        take: "Eat " + sig(o) + " servings of oats, " + sig(y) + " of yogurt and " + sig(p) + " of peanut butter. Each nutrient target is a plane in (o, y, p), and the plan is where all three meet." };
    } },
  { k: "Finance", t: "Prices from three US receipts", live: "usdcad",
    build(L) {
      const U = L.usdcad, vs = ["s", "j", "h"], A = [[2, 1, 1], [1, 2, 1], [1, 1, 2]], b = [165, 190, 225], r = elim3(A, b), [s, j, h] = r.sol;
      return { setup: "Three US receipts for shirts (s), jeans (j) and shoes (h): 2s + j + h = 165, s + 2j + h = 190, s + j + 2h = 225, in US dollars. A US dollar costs " + fmt(U, 4) + " Canadian.",
        lines: [["Eliminate s", yz(r.E2, vs) + "; " + yz(r.E3, vs), ""],
                ["Eliminate j", yz(r.last, vs), "h = " + sig(h)],
                ["Back-substitute", "j from row 2, then s from row 1", "s = " + sig(s) + ", j = " + sig(j)],
                ["In CAD", "US$" + sig(s) + ", US$" + sig(j) + ", US$" + sig(h) + " × " + fmt(U, 4), money(s * U) + ", " + money(j * U) + ", " + money(h * U)]],
        take: "A shirt costs " + money(s * U) + ", jeans " + money(j * U) + " and shoes " + money(h * U) + " in Canadian money. Three receipts with different mixes are three planes; one point satisfies them all." };
    } },
  { k: "Science", t: "Balancing a chemical equation",
    build() {
      const C = 3, H = 8, c = C, d = H / 2, b = (2 * c + d) / 2;
      return { setup: "Propane burns as C₃H₈ + b O₂ → c CO₂ + d H₂O. Atoms are not created or destroyed, so each kind of atom gives one equation in b, c and d.",
        lines: [["Carbon", "3 = c", "c = " + c],
                ["Hydrogen", "8 = 2d", "d = " + d],
                ["Oxygen", "2b = 2c + d = 2(" + c + ") + " + d, "b = " + sig(b)],
                ["Balanced", "1 propane + " + sig(b) + " oxygen", "C₃H₈ + " + sig(b) + "O₂ → " + c + "CO₂ + " + d + "H₂O"]],
        take: "Three atom counts are three planes in (b, c, d), and they meet at one point. A clean barbecue flame uses " + sig(b) + " oxygen molecules for every propane molecule." };
    } },
  { k: "Finance", t: "When goals conflict",
    build() {
      const vs = ["x", "y", "z"], T = 40000, A = [[1, 1, 1], [2, 4, 6], [1, 0, -1]], b = [T, 180000, 0], r = elim3(A, b);
      return { setup: "Split $40,000 among funds A, B and C paying 2%, 4% and 6%. You want $1,800 a year in income and equal amounts in A and C.",
        lines: [["Planes, income ×100", eqs(A[0], vs, b[0]) + "; " + eqs(A[1], vs, b[1]) + "; " + eqs(A[2], vs, b[2]), ""],
                ["Eliminate x", yz(r.E2, vs) + "; " + yz(r.E3, vs), ""],
                ["Eliminate y", yz(r.last, vs), "no solution"],
                ["Why", "with x = z, 0.02x + 0.06z = 0.04(x + z)", "income " + money(0.04 * T, 0)]],
        take: "The planes never share a point. With A = C, every dollar earns 4% on average, so $40,000 always pays " + money(0.04 * T, 0) + ". Lower the target or drop the A = C rule." };
    } },
  { k: "Home", t: "Which appliance uses the power",
    build() {
      const vs = ["h", "d", "m"], A = [[4, 1, 10], [2, 2, 8], [6, 1, 6]], b = [14, 13, 15], r = elim3(A, b), [h, d, m] = r.sol, price = 0.12;
      return { setup: "A smart meter shows the extra kWh used by a space heater (h), dryer (d) and dehumidifier (m) on three days. Hours of use: (4, 1, 10) → 14 kWh, (2, 2, 8) → 13 kWh, (6, 1, 6) → 15 kWh.",
        lines: [["Eliminate h", yz(r.E2, vs) + "; " + yz(r.E3, vs), ""],
                ["Eliminate d", yz(r.last, vs), "m = " + sig(m) + " kW"],
                ["Back-substitute", "d from row 2, then h from row 1", "h = " + sig(h) + ", d = " + sig(d) + " kW"],
                ["Dryer, 1 h a day", sig(d) + " kW × 1 h × 30 days × $0.12/kWh", money(d * 30 * price)]],
        take: "The dryer draws " + sig(d) + " kW, the heater " + sig(h) + " and the dehumidifier " + sig(m) + ". Three days of readings are three planes; their meeting point splits the bill by appliance." };
    } },
  { k: "Finance", t: "Two goals leave a line of choices",
    build() {
      const T = 30000, fA = 0.0025, fB = 0.009, fC = 0.004, c0 = fB * T, slope = fA + fC - 2 * fB, zMax = T / 2;
      const zBest = slope < 0 ? zMax : 0, best = c0 + slope * zBest;
      return { setup: "Split $30,000 among funds A, B and C paying 3%, 4% and 5%, to earn $1,200 a year. Their yearly fees are 0.25%, 0.90% and 0.40%.",
        lines: [["Two planes", "x + y + z = 30,000; 3x + 4y + 5z = 120,000", ""],
                ["Eliminate x", "y + 2z = 30,000, and then x = z", ""],
                ["The line", "(z, 30,000 − 2z, z) for 0 ≤ z ≤ " + fmt(zMax, 0), "every point works"],
                ["Fees on the line", "0.0025z + 0.009(30,000 − 2z) + 0.004z", money(c0, 0) + " − " + sig(-slope) + "z"],
                ["Cheapest", "z = " + fmt(zBest, 0) + ": A " + money(zBest, 0) + ", B " + money(T - 2 * zBest, 0) + ", C " + money(zBest, 0), money(best) + " a year"]],
        take: "Two planes meet in a line, so infinitely many portfolios pay $1,200. Choosing the cheapest point on that line cuts fees from " + money(c0, 0) + " to " + money(best) + " a year." };
    } },
  { k: "Sport", t: "Fitting a basketball shot's arc",
    build() {
      const y0 = 2.1, y1 = 3.0, y2 = 3.6, c = y0, s1 = y1 - c, s2 = y2 - c, a = (s2 - 2 * s1) / 2, b = s1 - a, xp = -b / (2 * a), hp = a * xp * xp + b * xp + c;
      return { setup: "Tracking finds a shot at heights 2.1 m, 3.0 m and 3.6 m when it is 0, 1 and 2 m from the release point. Fit h = ax² + bx + c: each point gives one plane in (a, b, c).",
        lines: [["Three planes", "c = 2.1; a + b + c = 3.0; 4a + 2b + c = 3.6", ""],
                ["Use c = " + sig(c), "a + b = " + sig(s1) + "; 4a + 2b = " + sig(s2), ""],
                ["Eliminate b", "(4a + 2b) − 2(a + b) = " + sig(s2) + " − " + sig(2 * s1), "a = " + sig(a)],
                ["Back-substitute", "b = " + sig(s1) + " − (" + sig(a) + ")", "b = " + sig(b)],
                ["Peak", "x = −b ÷ 2a = " + sig(xp, 2) + " m", fmt(hp, 2) + " m high"]],
        take: "The arc is h = " + sig(a) + "x² + " + sig(b) + "x + " + sig(c) + ", peaking near " + fmt(hp, 1) + " m, well above the 3.05 m rim. Shot-tracking software fits arcs like this from a few camera frames." };
    } }
];

/* ---------------- Lines in 3D: meet, parallel or skew ---------------- */
const skewLines = (P, d1, Q, d2) => {
  const n = cross(d1, d2), w = sub(Q, P), top = dot(w, n), bot = len(n);
  return { n, w, top, bot, D: Math.abs(top) / bot };
};
CP.NOTES.skew = [
  { k: "Science", t: "Air traffic separation",
    build() {
      const P = [0, 0, 10.7], d1 = [1, 0, 0], Q = [40, -30, 11.0], d2 = [0, 1, 0.002], s = skewLines(P, d1, Q, d2);
      return { setup: "An eastbound jet flies level at 10.7 km: r₁ = (0, 0, 10.7) + t(1, 0, 0). A northbound jet climbs 2 m per km: r₂ = (40, −30, 11.0) + s(0, 1, 0.002). Units are km.",
        lines: [["Directions", "(1, 0, 0) and (0, 1, 0.002)", "not parallel"],
                ["d₁ × d₂", "(1, 0, 0) × (0, 1, 0.002)", V(s.n)],
                ["Q − P", "(40, −30, 11.0) − (0, 0, 10.7)", V(s.w)],
                ["Distance", "|" + sig(s.top) + "| ÷ " + fmt(s.bot, 4), fmt(s.D * 1000, 0) + " m"]],
        take: "Their paths pass about " + fmt(s.D * 1000, 0) + " m apart, more than the 300 m (1,000 ft) vertical gap controllers need at this height. Flying level, the gap would be " + fmt(Math.abs(s.w[2]) * 1000, 0) + " m; the climb adds the rest." };
    } },
  { k: "Finance", t: "Where two glide paths cross",
    build() {
      const A0 = [80, 15, 5], a = [-2, 1.5, 0.5], B0 = [60, 35, 5], b = [-1, 0.5, 0.5];
      /* a[0]t − b[0]s = B0[0] − A0[0]; a[1]t − b[1]s = B0[1] − A0[1] */
      const det = a[0] * -b[1] - -b[0] * a[1], r1 = B0[0] - A0[0], r2 = B0[1] - A0[1];
      const t = (r1 * -b[1] - -b[0] * r2) / det, s = (a[0] * r2 - a[1] * r1) / det;
      const cA = A0[2] + a[2] * t, cB = B0[2] + b[2] * s, pt = A0.map((x, i) => x + a[i] * t);
      return { setup: "Fund A starts at 80/15/5 (stocks/bonds/cash) and moves (−2, 1.5, 0.5) a year. Fund B starts at 60/35/5 and moves (−1, 0.5, 0.5) a year. Do they ever hold the same mix?",
        lines: [["Stocks", "80 − 2t = 60 − s", ""],
                ["Bonds", "15 + 1.5t = 35 + 0.5s", "t = " + sig(t) + ", s = " + sig(s)],
                ["Check cash", "5 + 0.5(" + sig(t) + ") vs 5 + 0.5(" + sig(s) + ")", sig(cA) + " = " + sig(cB)],
                ["Meeting mix", "(80, 15, 5) + " + sig(t) + "(−2, 1.5, 0.5)", V(pt)]],
        take: "They meet: after " + sig(t) + " years both hold " + sig(pt[0]) + "% stocks, " + sig(pt[1]) + "% bonds, " + sig(pt[2]) + "% cash. Mixes that add to 100% all lie in one plane, so glide paths can never be skew." };
    } },
  { k: "Tech", t: "Robot arms that must not touch",
    build() {
      const P = [0, 0, 0.8], d1 = [1, 1, 0], Q = [0.6, 0, 1.0], d2 = [0, 1, -1], s = skewLines(P, d1, Q, d2), r = 0.05;
      return { setup: "Two robot arm links lie along r₁ = (0, 0, 0.8) + t(1, 1, 0) and r₂ = (0.6, 0, 1.0) + s(0, 1, −1), in metres. Each link is 10 cm thick.",
        lines: [["d₁ × d₂", "(1, 1, 0) × (0, 1, −1)", V(s.n)],
                ["Q − P", "(0.6, 0, 1.0) − (0, 0, 0.8)", V(s.w)],
                ["Distance", "|" + sig(s.top) + "| ÷ √" + sig(dot(s.n, s.n)), fmt(s.D * 100, 1) + " cm"],
                ["Clearance", fmt(s.D * 100, 1) + " − 5 − 5", fmt((s.D - 2 * r) * 100, 1) + " cm"]],
        take: "The centre lines pass " + fmt(s.D * 100, 0) + " cm apart, so the surfaces clear by about " + fmt((s.D - 2 * r) * 100, 0) + " cm. Motion planners repeat this check many times a second as the arms move." };
    } },
  { k: "Home", t: "Pipes in a ceiling",
    build() {
      const P = [0, 1, 2.6], d1 = [1, 0, 0], Q = [3, 0, 2.75], d2 = [0, 1, -0.02], s = skewLines(P, d1, Q, d2), mm = s.D * 1000;
      return { setup: "A water line runs level: r₁ = (0, 1, 2.6) + t(1, 0, 0). A drain crosses above it, sloping 2%: r₂ = (3, 0, 2.75) + s(0, 1, −0.02), in metres. The drain is about 90 mm across, the water line 25 mm.",
        lines: [["d₁ × d₂", "(1, 0, 0) × (0, 1, −0.02)", V(s.n)],
                ["Q − P", "(3, 0, 2.75) − (0, 1, 2.6)", V(s.w)],
                ["Centre to centre", "|" + sig(s.top) + "| ÷ " + fmt(s.bot, 4), fmt(mm, 0) + " mm"],
                ["Clear gap", fmt(mm, 0) + " − 45 − 12.5", fmt(mm - 57.5, 1) + " mm"]],
        take: "There is about " + fmt((mm - 57.5) / 10, 0) + " cm of space between the pipes. If the drain ran level the centres would be " + fmt(Math.abs(s.w[2]) * 1000, 0) + " mm apart; its slope uses up " + fmt(Math.abs(s.w[2]) * 1000 - mm, 0) + " mm by the crossing." };
    } },
  { k: "Finance", t: "Will two savers ever hold the same portfolio?",
    build() {
      const A0 = [20, 10, 5], a = [2, 1, 1], B0 = [10, 20, 8], b = [3, 0, 1];
      const t = (B0[1] - A0[1]) / a[1], s = (A0[0] + a[0] * t - B0[0]) / b[0], cA = A0[2] + a[2] * t, cB = B0[2] + b[2] * s;
      return { setup: "In $1,000s of (stocks, bonds, cash), Saver A holds (20, 10, 5) and adds (2, 1, 1) a year. Saver B holds (10, 20, 8) and adds (3, 0, 1) a year. Do their portfolios ever match?",
        lines: [["Directions", "(2, 1, 1) and (3, 0, 1)", "not parallel"],
                ["Bonds", "10 + t = 20", "t = " + sig(t)],
                ["Stocks", "20 + 2(" + sig(t) + ") = 10 + 3s", "s = " + sig(s)],
                ["Check cash", "5 + " + sig(t) + " vs 8 + " + sig(s), money(cA * 1000, 0) + " ≠ " + money(cB * 1000, 0)],
                ["Verdict", "two coordinates match, the third does not", "skew"]],
        take: "Stocks and bonds line up, but cash is " + money(Math.abs(cB - cA) * 1000, 0) + " apart, so the lines are skew and the portfolios never match. In 3D, matching two coordinates is easy; the third is the real test." };
    } },
  { k: "Finance", t: "Two travellers changing money", live: "usdcad",
    build(L) {
      const U = L.usdcad, E = L.eurcad, t = 200, s = 0, cA = 4000 - U * t, cB = 3500 - E * s;
      return { setup: "Write a wallet as (CAD, USD, EUR). A has C$4,000 and buys US dollars at " + fmt(U, 4) + ". B has C$3,500 and US$200 and buys euros at " + fmt(E, 4) + ". Can the wallets ever be identical?",
        lines: [["Lines", "(4,000, 0, 0) + t(−" + fmt(U, 4) + ", 1, 0); (3,500, 200, 0) + s(−" + fmt(E, 4) + ", 0, 1)", ""],
                ["Match USD", "t = 200", "t = " + t],
                ["Match EUR", "0 = s", "s = " + s],
                ["Check CAD", "4,000 − " + fmt(U, 4) + "(200) vs 3,500", money(cA) + " ≠ " + money(cB)],
                ["Verdict", "the third coordinate fails", "skew"]],
        take: "The wallets can match in US dollars and euros, but not in Canadian dollars at the same time, so the lines are skew. They would only meet if a US dollar cost " + money(500 / t) + "." };
    } },
  { k: "Driving", t: "An overpass and the road beneath",
    build() {
      const P = [0, 0, 0], d1 = [1, 0, 0.01], Q = [200, -100, 7.6], d2 = [0.6, 0.8, 0], s = skewLines(P, d1, Q, d2), truck = 4.15;
      const xc = Q[0] + d2[0] * (-Q[1] / d2[1]), zr = d1[2] * xc;
      return { setup: "A highway climbs 1%: r₁ = (0, 0, 0) + t(1, 0, 0.01). A bridge's underside runs level across it: r₂ = (200, −100, 7.6) + s(0.6, 0.8, 0). Units are metres.",
        lines: [["d₁ × d₂", "(1, 0, 0.01) × (0.6, 0.8, 0)", V(s.n)],
                ["Q − P", "(200, −100, 7.6) − (0, 0, 0)", V(s.w)],
                ["Distance", "|" + sig(s.top) + "| ÷ " + fmt(s.bot, 4), fmt(s.D, 2) + " m"],
                ["Truck room", fmt(s.D, 2) + " − 4.15", fmt(s.D - truck, 2) + " m"]],
        take: "The bridge clears the road by " + fmt(s.D, 2) + " m, leaving about " + fmt(s.D - truck, 1) + " m above a truck at Ontario's 4.15 m height limit. The bridge is 7.6 m above the road's start, but the road climbs " + fmt(zr, 2) + " m before it passes under." };
    } },
  { k: "Sport", t: "Ski lifts that cross on the map",
    build() {
      const P = [0, 0, 1500], d1 = [1, 0, 0.4], Q = [300, -200, 1650], d2 = [0, 1, 0.3], s = skewLines(P, d1, Q, d2);
      const z1 = P[2] + d1[2] * (Q[0] - P[0]), z2 = Q[2] + d2[2] * (P[1] - Q[1]);
      return { setup: "Two chairlift cables, in metres: r₁ = (0, 0, 1500) + t(1, 0, 0.4) and r₂ = (300, −200, 1650) + s(0, 1, 0.3). On the trail map they cross at (300, 0).",
        lines: [["d₁ × d₂", "(1, 0, 0.4) × (0, 1, 0.3)", V(s.n)],
                ["Q − P", "(300, −200, 150)", V(s.w)],
                ["Distance", "|" + sig(s.top) + "| ÷ " + fmt(s.bot, 3), fmt(s.D, 1) + " m"],
                ["Gap over crossing", fmt(z2, 0) + " − " + fmt(z1, 0), fmt(z2 - z1, 0) + " m"]],
        take: "The cables never meet. Straight above the map crossing they are " + fmt(z2 - z1, 0) + " m apart, but the true closest approach is " + fmt(s.D, 1) + " m, found along d₁ × d₂." };
    } }
];

/* ---------------- Distance from a point to a plane ---------------- */
const ptPlane = (n, d, Q) => { const top = dot(n, Q) - d, bot = len(n); return { top, bot, D: Math.abs(top) / bot }; };
CP.NOTES.dist = [
  { k: "Science", t: "Drone clearance over a slope",
    build() {
      const n = [1, 2, 2], d = 60, Q = [10, 5, 30], r = ptPlane(n, d, Q), zg = (d - n[0] * Q[0] - n[1] * Q[1]) / n[2];
      return { setup: "A hillside is the plane x + 2y + 2z = 60, in metres. A survey drone hovers at (10, 5, 30).",
        lines: [["Top", "10 + 2(5) + 2(30) − 60", sig(r.top)],
                ["Bottom", "√(1 + 4 + 4)", sig(r.bot)],
                ["Distance", sig(r.top) + " ÷ " + sig(r.bot), fmt(r.D, 2) + " m"],
                ["Straight down", "ground at z = " + sig(zg) + " below the drone", sig(Q[2] - zg) + " m"]],
        take: "The drone is " + sig(Q[2] - zg) + " m above the ground below it but only " + fmt(r.D, 1) + " m from the slope. On a steep hill the nearest ground is uphill, not straight down." };
    } },
  { k: "Finance", t: "The smallest change to hit an income target", live: "bond5",
    build(L) {
      const B = L.bond5, n = [20, 10 * B, 50], H = [10, 20, 5], T = 1500, I = dot(n, H), bot = len(n), D = Math.abs(I - T) / bot, k = (T - I) / dot(n, n), tr = n.map(x => k * x * 1000);
      return { setup: "You hold $10,000 in savings at 2%, $20,000 in a bond fund at the 5-year yield, " + fmt(B) + "%, and $5,000 in a dividend fund at 5%. In $1,000s, income is the plane 20x + " + sig(10 * B) + "y + 50z = 1,500.",
        lines: [["Income now", "20(10) + " + sig(10 * B) + "(20) + 50(5)", money(I, 0)],
                ["Top", "|" + fmt(I, 0) + " − 1,500|", fmt(Math.abs(I - T), 0)],
                ["Bottom", "√(20² + " + sig(10 * B) + "² + 50²)", fmt(bot, 2)],
                ["Distance", fmt(Math.abs(I - T), 0) + " ÷ " + fmt(bot, 2), money(D * 1000, 0)],
                ["Along the normal", "add to savings, bonds, dividend", money(tr[0], 0) + ", " + money(tr[1], 0) + ", " + money(tr[2], 0)]],
        take: "The shortest change, about " + money(D * 1000, 0) + " long, points along the normal, so the 5% fund gets the most. It is shortest, not cheapest: " + money((T - I) / 50 * 1000, 0) + " in the dividend fund alone also works." };
    } },
  { k: "Tech", t: "Collision checks in games",
    build() {
      const n = [3, 4, 0], d = 20, Q = [2, 2.9, 1], r = ptPlane(n, d, Q), need = 0.5, objs = 200, fps = 60;
      return { setup: "A wall in a game is the plane 3x + 4y = 20, in metres. A character stands at (2, 2.9, 1) and must stay 0.5 m from walls.",
        lines: [["Top", "3(2) + 4(2.9) + 0(1) − 20", sig(r.top)],
                ["Bottom", "√(9 + 16 + 0)", sig(r.bot)],
                ["Distance", "|" + sig(r.top) + "| ÷ " + sig(r.bot), sig(r.D) + " m"],
                ["Too close?", "0.5 − " + sig(r.D), r.D < need ? "push back " + fmt((need - r.D) * 100, 0) + " cm" : "fine"],
                ["Every second", objs + " objects × " + fps + " frames", fmt(objs * fps, 0) + " checks"]],
        take: "The character is " + fmt(r.D * 100, 0) + " cm from the wall, so the game nudges it back. The sign of the top says which side of the wall a point is on; dividing by |n| gives the gap." };
    } },
  { k: "Finance", t: "Credit scoring with a margin",
    build() {
      const n = [0.4, -1.2, 0.3], d = 3, A = [12, 2, 10], B = [9, 2, 4], a = ptPlane(n, d, A), b = ptPlane(n, d, B);
      const sg = x => (x > 0 ? "+" : "") + sig(x);
      return { setup: "A simple scoring model uses the plane 0.4x − 1.2y + 0.3z = 3: x is income in $10,000s, y is debt payments as a % of income ÷ 10, z is years of credit history. A positive score means approve.",
        lines: [["Applicant A", "0.4(12) − 1.2(2) + 0.3(10) − 3", sg(a.top)],
                ["Applicant B", "0.4(9) − 1.2(2) + 0.3(4) − 3", sg(b.top)],
                ["Bottom", "√(0.4² + 1.2² + 0.3²)", sig(a.bot)],
                ["Distances", sig(Math.abs(a.top)) + " ÷ " + sig(a.bot) + " and " + sig(Math.abs(b.top)) + " ÷ " + sig(b.bot), fmt(a.D, 2) + " and " + fmt(b.D, 2)]],
        take: "A is well on the approve side. B is on the decline side but only " + fmt(b.D, 2) + " from the plane, so a person should look again. Some models choose the plane that keeps past cases as far from it as possible." };
    } },
  { k: "Home", t: "A lamp under a sloped ceiling",
    build() {
      const n = [-1, 0, 3], d = 7.2, Q = [3, 1, 2.9], r = ptPlane(n, d, Q), zc = (d - n[0] * Q[0]) / n[2];
      return { setup: "A vaulted ceiling rises 1 m for every 3 m across: the plane −x + 3z = 7.2, in metres. The top of a lamp shade sits at (3, 1, 2.9). How much room is there?",
        lines: [["Top", "−3 + 3(2.9) − 7.2", sig(r.top)],
                ["Bottom", "√(1 + 0 + 9)", fmt(r.bot, 3)],
                ["Distance", "|" + sig(r.top) + "| ÷ " + fmt(r.bot, 3), fmt(r.D * 100, 1) + " cm"],
                ["Straight up", "ceiling at z = " + sig(zc) + " above the shade", fmt((zc - Q[2]) * 100, 0) + " cm"]],
        take: "A tape measure held straight up reads " + fmt((zc - Q[2]) * 100, 0) + " cm, but the nearest point of the ceiling is " + fmt(r.D * 100, 1) + " cm away, along the normal. The steeper the ceiling, the bigger that difference." };
    } },
  { k: "Finance", t: "A 45° angular plane on a condo",
    build() {
      const n = [-1, 0, 1], d = 16, Q = [6, 0, 24], r = ptPlane(n, d, Q), back = r.top / Math.abs(n[0]), front = 30, val = 10000;
      return { setup: "Toronto steps back mid-rise buildings with 45° angular planes. Here the limit is −x + z = 16: it starts 16 m up at the lot line and rises 1 m per metre back. A planned top corner sits at (6, 0, 24).",
        lines: [["Top", "−6 + 24 − 16", sig(r.top)],
                ["Bottom", "√(1 + 0 + 1)", fmt(r.bot, 3)],
                ["Distance", sig(r.top) + " ÷ " + fmt(r.bot, 3), fmt(r.D, 2) + " m through the plane"],
                ["Step back", "at 45°, " + sig(r.top) + " m up = " + sig(back) + " m back", sig(back) + " m"],
                ["Lost floor space", sig(back) + " m × " + front + " m × about $10,000/m²", money(back * front * val, 0)]],
        take: "The corner pokes " + fmt(r.D, 2) + " m through the plane. Stepping the top floor back " + sig(back) + " m along a " + front + " m front gives up about " + money(back * front * val, 0) + " of sellable space." };
    } },
  { k: "Nature", t: "Which fault moved?",
    build() {
      const Q = [4, 3, -8], A = ptPlane([2, -1, 2], 10, Q), B = ptPlane([1, 2, 2], -8, Q);
      return { setup: "Two mapped faults are the planes 2x − y + 2z = 10 and x + 2y + 2z = −8, in km. An earthquake starts 8 km down at (4, 3, −8).",
        lines: [["Fault A top", "2(4) − 3 + 2(−8) − 10", sig(A.top)],
                ["Fault A distance", "|" + sig(A.top) + "| ÷ √(4 + 1 + 4)", fmt(A.D, 2) + " km"],
                ["Fault B top", "4 + 2(3) + 2(−8) + 8", sig(B.top)],
                ["Fault B distance", "|" + sig(B.top) + "| ÷ √(1 + 4 + 4)", fmt(B.D, 2) + " km"]],
        take: "The quake began " + fmt(B.D, 1) + " km from fault B and " + fmt(A.D, 0) + " km from fault A, so B is the likely source. Earthquake locations can be off by a kilometre or more, so close calls need more data." };
    } },
  { k: "Sport", t: "How high a ski jumper flies",
    build() {
      const n = [0.6, 0, 1], d = 0, Q = [60, 0, -32], r = ptPlane(n, d, Q), zg = -n[0] * Q[0], ang = Math.atan(n[0]) * 180 / Math.PI;
      return { setup: "A landing hill drops 0.6 m for each metre forward, about " + fmt(ang, 0) + "°: the plane 0.6x + z = 0. A jumper is at (60, 0, −32), in metres.",
        lines: [["Top", "0.6(60) + (−32) − 0", sig(r.top)],
                ["Bottom", "√(0.6² + 1²)", fmt(r.bot, 3)],
                ["Distance", sig(r.top) + " ÷ " + fmt(r.bot, 3), fmt(r.D, 2) + " m"],
                ["Straight down", "−32 − (" + sig(zg) + ")", sig(Q[2] - zg) + " m"]],
        take: "The jumper is " + sig(Q[2] - zg) + " m above the snow straight down, but only " + fmt(r.D, 1) + " m from it along the normal. On this hill, height measured straight down overstates the true gap by a factor of " + fmt(r.bot, 2) + "." };
    } }
];
})();
