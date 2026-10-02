/* Worked notes: lines in 2D, lines in space, equations of planes, plane equations in every form. */
(function () {
const { fmt, money, pct, sig, sup } = CP.nh;
/* a number for a vector or equation: grouped when large, short otherwise */
const n0 = x => Math.abs(x) >= 1000 ? fmt(x, Number.isInteger(+(+x).toFixed(6)) ? 0 : 2) : sig(x);
const V = a => "(" + a.map(n0).join(", ") + ")";
const sub = (a, b) => a.map((x, i) => x - b[i]);
const add = (a, b) => a.map((x, i) => x + b[i]);
const mul = (k, a) => a.map(x => k * x);
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = a => Math.sqrt(dot(a, a));
/* left side of a linear equation: lin([3, -4, 0]) → "3x − 4y" */
const lin = (c, names = ["x", "y", "z"]) => {
  let s = "";
  c.forEach((k, i) => {
    if (Math.abs(k) < 1e-12) return;
    const a = Math.abs(k), body = (Math.abs(a - 1) < 1e-12 ? "" : n0(a)) + names[i];
    s += s ? (k < 0 ? " − " : " + ") + body : (k < 0 ? "−" : "") + body;
  });
  return s;
};
/* solve a1 x + b1 y = c1, a2 x + b2 y = c2 */
const solve2 = (a1, b1, c1, a2, b2, c2) => { const D = a1 * b2 - a2 * b1; return [(c1 * b2 - c2 * b1) / D, (a1 * c2 - a2 * c1) / D]; };
const gcd = (a, b) => { a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b)); while (b) [a, b] = [b, a % b]; return a; };

CP.NOTES.lines2d = [
  { k: "Finance", t: "Salary or commission",
    build() {
      const S = 52000, B = 30000, c = 0.05, s = (S - B) / c;
      return { setup: "Offer A pays a flat " + money(S, 0) + ". Offer B pays " + money(B, 0) + " plus 5% of your sales s. Each offer is a line of pay p against sales.",
        lines: [["Offer A", "p = " + fmt(S, 0), ""], ["Offer B", "p = " + fmt(B, 0) + " + " + sig(c) + "s", ""],
                ["Set equal", fmt(B, 0) + " + " + sig(c) + "s = " + fmt(S, 0) + " → " + sig(c) + "s = " + fmt(S - B, 0), ""],
                ["Solve", "s = " + fmt(S - B, 0) + " ÷ " + sig(c), money(s, 0) + " in sales"]],
        take: "Below " + money(s, 0) + " in yearly sales the salary pays more; above it the commission wins. The crossing of two lines turns a vague choice into one number to compare with your likely sales." };
    } },
  { k: "Finance", t: "Is a card's annual fee worth it",
    build() {
      const a = 0.01, b = 0.025, fee = 120, s = fee / (b - a), test = 20000;
      return { setup: "Card A has no fee and pays 1% cash back. Card B costs " + money(fee, 0) + " a year and pays 2.5% back. Net cash back r is a line against yearly spending s.",
        lines: [["Card A", "r = " + sig(a) + "s", ""], ["Card B", "r = " + sig(b) + "s − " + fee, ""],
                ["Set equal", sig(b - a) + "s = " + fee, "s = " + money(s, 0)],
                ["At " + money(test, 0), "A: " + sig(a) + " × " + fmt(test, 0) + "; B: " + sig(b) + " × " + fmt(test, 0) + " − " + fee, money(a * test, 0) + " vs " + money(b * test - fee, 0)]],
        take: "The lines cross at " + money(s, 0) + " a year. Spend less and the free card wins; spend more and the fee pays for itself. Check your real yearly spending before paying a fee." };
    } },
  { k: "Finance", t: "Where supply meets demand",
    build() {
      const [q, p] = solve2(0.5, 1, 20, -0.25, 1, 2);
      return { setup: "At a farmers' market, demand for strawberries is p = 20 − 0.5q and supply is p = 2 + 0.25q, with p in dollars a basket and q in thousands of baskets a week.",
        lines: [["Set equal", "20 − 0.5q = 2 + 0.25q", ""], ["Collect", "18 = 0.75q", "q = " + sig(q)],
                ["Price", "p = 2 + 0.25 × " + sig(q), money(p, 0) + " a basket"], ["Check demand", "20 − 0.5 × " + sig(q), money(20 - 0.5 * q, 0) + " ✓"]],
        take: "At " + money(p, 0) + " a basket, buyers want exactly what sellers bring: " + fmt(q * 1000, 0) + " baskets. Price it higher and baskets go unsold; lower and they run out." };
    } },
  { k: "Finance", t: "Card or transfer service for US dollars", live: "usdcad",
    build(L) {
      const r = L.usdcad, a = r * 1.025, b = r * 1.005, x = 15 / (a - b);
      return { setup: "You pay a bill of x US dollars at " + fmt(r, 4) + " CAD per USD. A credit card adds a 2.5% fee. A transfer service charges $15 CAD plus 0.5%. Cost C in CAD is a line for each.",
        lines: [["Card", "C = 1.025 × " + fmt(r, 4) + " × x", "C = " + fmt(a, 4) + "x"], ["Service", "C = 15 + 1.005 × " + fmt(r, 4) + " × x", "C = 15 + " + fmt(b, 4) + "x"],
                ["Set equal", fmt(a - b, 4) + "x = 15", ""], ["Solve", "x = 15 ÷ " + fmt(a - b, 4), money(x, 0) + " US"]],
        take: "For bills under about " + money(x, 0) + " US the card is cheaper; above that the flat $15 is worth paying. A weaker loonie makes both lines steeper and moves the crossing lower." };
    } },
  { k: "Sport", t: "Cutting off a pass",
    build() {
      const P = [0, 0], d = [3, 1], Q = [24, -6], e = [-1, 2];
      const [t, s] = solve2(d[0], -e[0], Q[0] - P[0], d[1], -e[1], Q[1] - P[1]);
      const X = add(P, mul(t, d));
      return { setup: "On a rink grid in metres, a pass leaves (0, 0) in direction (3, 1). A defender at (24, −6) skates in direction (−1, 2). Where do their paths cross?",
        lines: [["Puck", "x = 3t, y = t", ""], ["Defender", "x = 24 − s, y = −6 + 2s", ""],
                ["Match x and y", "3t = 24 − s and t = −6 + 2s", "t = " + sig(t) + ", s = " + sig(s)],
                ["Crossing", "(3 × " + sig(t) + ", " + sig(t) + ")", V(X)],
                ["Distances", "puck " + sig(t) + "√10, defender " + sig(s) + "√5", fmt(t * len(d), 1) + " m vs " + fmt(s * len(e), 1) + " m"]],
        take: "Parametric form gives each path its own parameter, so you match x and y separately. The defender skates the shorter distance. Comparing each distance with each speed tells him whether he gets there first." };
    } },
  { k: "Tech", t: "Which side of a wall a player is on",
    build() {
      const P = [1, 2], d = [3, 1], n = [d[1], -d[0]], C = -dot(n, P), A = [4, 1], B = [0, 3];
      const f = p => dot(n, p) + C;
      return { setup: "A wall in a game runs through (1, 2) in direction (3, 1). Is a player at (4, 1) on the same side as a player at (0, 3)?",
        lines: [["Normal", "swap and change a sign: (3, 1) → " + V(n), ""], ["Find C", "1(1) − 3(2) + C = 0", "C = " + sig(C)],
                ["Player at (4, 1)", "4 − 3(1) + " + sig(C), sig(f(A))], ["Player at (0, 3)", "0 − 3(3) + " + sig(C), sig(f(B))]],
        take: "One result is positive and one negative, so the wall is between the players. Games run this test on every wall many times a second because it takes only two multiplications and two additions." };
    } },
  { k: "Science", t: "Two ships on parallel courses",
    build() {
      const d = [4, 3], n = [3, -4], B = [10, 0], CA = 0, CB = -dot(n, B), gap = Math.abs(CB - CA) / len(n);
      return { setup: "On a chart in kilometres, ship A leaves (0, 0) in direction (4, 3). Ship B leaves (10, 0) in direction (8, 6). Where do their courses cross?",
        lines: [["Directions", "(8, 6) = 2 × (4, 3)", "parallel"], ["Ship A", "normal (3, −4) through (0, 0)", lin(n) + " = 0"],
                ["Ship B", "3(10) − 4(0) + C = 0", lin(n) + " − " + sig(-CB) + " = 0"], ["Gap", "|" + sig(CB) + " − 0| ÷ √(3² + 4²)", sig(gap) + " km"]],
        take: "The courses are parallel, so there is no crossing to solve for. The scalar form gives the steady gap instead: the ships stay " + sig(gap) + " km apart for as long as they hold course." };
    } },
  { k: "Home", t: "Placing a garden bench",
    build() {
      const n1 = [3, -4], c1 = 0, n2 = [1, 1], c2 = 14, [x, y] = solve2(n1[0], n1[1], c1, n2[0], n2[1], c2);
      return { setup: "Path 1 runs from a gate at (0, 0) toward the far corner (16, 12), in metres. Path 2 runs from a gate at (14, 0) in direction (−1, 1). Put the bench where they meet.",
        lines: [["Path 1", "direction (4, 3), normal (3, −4)", lin(n1) + " = 0"], ["Path 2", "direction (−1, 1), normal (1, 1)", lin(n2) + " = " + c2],
                ["Substitute", "x = 14 − y → 3(14 − y) − 4y = 0", "y = " + sig(y)], ["Bench", "x = 14 − " + sig(y), V([x, y])]],
        take: "Scalar form turns each path into one equation, so the meeting point is a pair of equations solved together. The bench lands at " + V([x, y]) + ", halfway along path 1." };
    } }
];

CP.NOTES.lines = [
  { k: "Finance", t: "A target-date glide path",
    build() {
      const P = [80, 15, 5], Q = [40, 45, 15], yrs = 25, D = sub(Q, P), d = mul(1 / yrs, D), t = 12, R = add(P, mul(t, d));
      return { setup: "At 40, a retirement fund holds 80% stocks, 15% bonds and 5% cash. At 65 it should hold 40%, 45% and 15%. A steady shift between them is a line.",
        lines: [["Direction", V(Q) + " − " + V(P), V(D)], ["Per year", V(D) + " ÷ " + yrs, V(d)],
                ["The line", "r = " + V(P) + " + t" + V(d), "t = years after 40"], ["At 52", "t = " + t, V(R)]],
        take: "The direction's parts add to 0, so every point on the line still adds to " + sig(R[0] + R[1] + R[2]) + "%. Fund companies sell this exact line as a target-date fund." };
    } },
  { k: "Finance", t: "Saving into three accounts",
    build() {
      const P = [12000, 30000, 5000], d = [500, 800, 100], t = 24, R = add(P, mul(t, d)), goal = 25000, tg = (goal - P[0]) / d[0];
      return { setup: "Your TFSA, RRSP and savings hold " + V(P) + " dollars. You add " + V(d) + " a month. Count contributions only, not growth.",
        lines: [["The line", "r = " + V(P) + " + t" + V(d), "t in months"], ["After 2 years", "t = " + t, V(R)],
                ["Total", "sum of the parts", money(R[0] + R[1] + R[2], 0)], ["TFSA hits " + money(goal, 0), fmt(P[0], 0) + " + " + d[0] + "t = " + fmt(goal, 0), "t = " + sig(tg) + " months"]],
        take: "Each account moves at its own steady rate, so the three balances together trace one straight line in space. Setting one coordinate to a target and solving for t gives the date." };
    } },
  { k: "Finance", t: "Estimating a 7-year bond yield", live: "bond10",
    build(L) {
      const P = [5, L.bond5], Q = [10, L.bond10], D = sub(Q, P), t = (7 - P[0]) / D[0], y = P[1] + t * D[1];
      return { setup: "Today Canada's 5-year bond yields " + fmt(L.bond5) + "% and the 10-year yields " + fmt(L.bond10) + "%. Treat each as a point (years, yield) and draw the line between them.",
        lines: [["Direction", "(10, " + fmt(L.bond10) + ") − (5, " + fmt(L.bond5) + ")", "(5, " + fmt(D[1]) + ")"],
                ["The line", "r = (5, " + fmt(L.bond5) + ") + t(5, " + fmt(D[1]) + ")", ""],
                ["7 years", "5 + 5t = 7", "t = " + sig(t)], ["Yield", fmt(L.bond5) + " + " + sig(t) + " × " + (D[1] < 0 ? "(" + fmt(D[1]) + ")" : fmt(D[1])), "about " + fmt(y) + "%"]],
        take: "This is a point partway along the line from P to Q. Traders use the same idea to estimate a yield for a term that falls between the quoted ones." };
    } },
  { k: "Finance", t: "Depreciating a small business's equipment",
    build() {
      const P = [30000, 2400, 6000], d = [-5000, -800, -600], t = 3, R = add(P, mul(t, d)), tz = -P[0] / d[0];
      return { setup: "A business owns a truck, a laptop and a set of tools worth " + V(P) + " dollars. Straight-line depreciation takes " + V(mul(-1, d)) + " off each year.",
        lines: [["The line", "r = " + V(P) + " + t" + V(d), "t in years"], ["After 3 years", "t = " + t, V(R)],
                ["Book value", R.map(n0).join(" + "), money(R[0] + R[1] + R[2], 0)], ["Truck at $0", fmt(P[0], 0) + " − " + fmt(-d[0], 0) + "t = 0", "t = " + sig(tz) + " years"]],
        take: "Each asset loses the same amount every year, so the three values move along one line. The laptop reaches $0 after 3 years; past that point the line no longer applies to it." };
    } },
  { k: "Science", t: "Two flight paths that miss",
    build() {
      const A = [0, 0, 10], a = [12, 9, 0], B = [150, 0, 10.6], b = [-9, 12, 0];
      const [t, s] = solve2(a[0], -b[0], B[0] - A[0], a[1], -b[1], B[1] - A[1]), X = add(A, mul(t, a));
      return { setup: "Two jets fly level at 15 km a minute. In km, jet A follows (0, 0, 10) + t(12, 9, 0) and jet B follows (150, 0, 10.6) + s(−9, 12, 0). Do their paths meet?",
        lines: [["Match x", "12t = 150 − 9s", ""], ["Match y", "9t = 12s", ""],
                ["Solve", "s = 0.75t → 18.75t = 150", "t = " + sig(t) + ", s = " + sig(s)],
                ["Check z", "A at " + sig(A[2]) + " km, B at " + sig(B[2]) + " km", fmt((B[2] - A[2]) * 1000, 0) + " m apart"]],
        take: "Seen from above, the tracks cross at (" + sig(X[0]) + ", " + sig(X[1]) + "), but the heights differ, so the 3D lines never meet. Lines in space can miss without being parallel, which is why controllers keep crossing flights at different heights." };
    } },
  { k: "Tech", t: "A 3D printer's straight move",
    build() {
      const P = [20, 35, 0.2], Q = [80, 115, 0.2], D = sub(Q, P), L0 = len(D), v = 50, M = add(P, mul(0.5, D));
      return { setup: "A 3D printer nozzle moves from P " + V(P) + " to Q " + V(Q) + ", in millimetres, at 50 mm/s.",
        lines: [["Direction", "Q − P", V(D)], ["Length", "√(" + D[0] + "² + " + D[1] + "² + 0²)", sig(L0) + " mm"],
                ["Halfway", "P + 0.5" + V(D), V(M)], ["Time", sig(L0) + " ÷ " + v, sig(L0 / v) + " s"]],
        take: "The controller runs t from 0 to 1 in r = P + t(Q − P) and places the nozzle at each value. Every straight stroke of a print is one of these lines." };
    } },
  { k: "Sport", t: "Is the passing lane open",
    build() {
      const P = [10, 20, 0], Q = [40, 35, 0], D = sub(Q, P), def = [28, 26], t = (def[0] - P[0]) / D[0], y = P[1] + t * D[1];
      return { setup: "On a soccer field in metres, a ground pass goes from " + V(P) + " to a teammate at " + V(Q) + ". A defender stands at (28, 26, 0).",
        lines: [["Direction", V(Q) + " − " + V(P), V(D)], ["The line", "r = " + V(P) + " + t" + V(D), ""],
                ["At the defender's x", "10 + 30t = 28", "t = " + sig(t)], ["Ball's y there", "20 + 15 × " + sig(t), sig(y)],
                ["Gap across the field", sig(y) + " − " + def[1], sig(y - def[1]) + " m"]],
        take: "When the ball passes the defender's spot along the field, it is " + sig(y - def[1]) + " m to the defender's side. That is about two long strides, so the lane is open if the pass is quick." };
    } },
  { k: "Weather", t: "Where a weather balloon drifts",
    build() {
      const d = [1.2, 0.8, 3.0], top = 9, t = top / d[2], R = mul(t, d), drift = Math.sqrt(R[0] * R[0] + R[1] * R[1]);
      return { setup: "A weather balloon is launched at (0, 0, 0). After 10 minutes it is at " + V(d) + ", in km (east, north, up). Assume the wind and rise rate stay steady.",
        lines: [["The line", "r = t" + V(d), "t in 10-minute steps"], ["Reach " + top + " km up", "3t = " + top, "t = " + sig(t) + ", " + sig(t * 10) + " min"],
                ["Position", sig(t) + " × " + V(d), V(R)], ["Ground drift", "√(" + sig(R[0]) + "² + " + sig(R[1]) + "²)", fmt(drift, 1) + " km"]],
        take: "Weather balloons rise about 5 m/s, which is 3 km every 10 minutes. The line predicts it is " + fmt(drift, 1) + " km downwind by " + top + " km up. Real winds change with height, so the true path bends." };
    } }
];

CP.NOTES.planes = [
  { k: "Finance", t: "An income target is a plane", live: "bond5",
    build(L) {
      const b = L.bond5 / 100, n = [b, 0.04, 0.05], D = 1500, x = 20000, y = 10000, part = b * x + 0.04 * y, z = (D - part) / 0.05;
      return { setup: "Split savings among 5-year bonds at " + fmt(L.bond5) + "%, a fund paying 4% and one paying 5%. Every split earning exactly " + money(D, 0) + " a year lies on one plane.",
        lines: [["Normal", "the yields", V(n)], ["Plane", sig(b) + "x + 0.04y + 0.05z = " + fmt(D, 0), ""],
                ["Choose x and y", sig(b) + " × " + fmt(x, 0) + " + 0.04 × " + fmt(y, 0), money(part, 0)],
                ["Solve for z", "(" + fmt(D, 0) + " − " + fmt(part, 0) + ") ÷ 0.05", money(z, 0)]],
        take: "The normal is the list of yields, and the dot product with it is the income. When bond yields fall, the plane tilts and you need more in the 5% fund to reach the same target." };
    } },
  { k: "Finance", t: "Recovering margins from break-even points",
    build() {
      const A = [3000, 0, 0], B = [0, 2000, 0], C = [0, 0, 1200], u = sub(B, A), v = sub(C, A), raw = cross(u, v);
      const g = gcd(gcd(raw[0], raw[1]), raw[2]), n = mul(1 / g, raw), d = dot(n, A);
      return { setup: "A print shop breaks even each month selling 3,000 posters alone, 2,000 mugs alone, or 1,200 shirts alone. These are three points of one plane.",
        lines: [["Two edges", "B − A and C − A", V(u) + ", " + V(v)], ["Cross product", "(B − A) × (C − A)", V(raw)],
                ["Normal", "÷ " + fmt(g, 0), V(n)], ["d", V(n) + " · " + V(A), fmt(d, 0)], ["Plane", "n · r = d", lin(n) + " = " + fmt(d, 0)]],
        take: "The normal is the profit on each item: $" + n[0] + " a poster, $" + n[1] + " a mug, $" + n[2] + " a shirt. d is the fixed cost the sales must cover, " + money(d, 0) + " a month." };
    } },
  { k: "Finance", t: "A grocery budget is a plane",
    build() {
      const n = [12, 3, 5], P = [5, 10, 12], u = [1, -4, 0], Q = add(P, u);
      return { setup: "Chicken costs $12/kg, rice $3/kg and vegetables $5/kg. Every basket of x, y and z kg costing exactly $150 lies on 12x + 3y + 5z = 150.",
        lines: [["Normal", "the prices", V(n)], ["Test " + V(P), "12(5) + 3(10) + 5(12)", money(dot(n, P), 0) + " ✓"],
                ["A swap", "u = " + V(u) + ": n · u = 12 − 12", sig(dot(n, u))], ["New basket", V(P) + " + " + V(u), V(Q) + ", " + money(dot(n, Q), 0)]],
        take: "Any move at right angles to the normal stays on the plane. Trading 4 kg of rice for 1 kg of chicken keeps the bill the same, because the move's dot product with the prices is 0." };
    } },
  { k: "Finance", t: "A trip budget in three currencies", live: "usdcad",
    build(L) {
      const r = L.usdcad, e = L.eurcad, D = 6000, x = 1500, z = 1000, y = D - r * x - e * z;
      return { setup: "A trip mixes US dollars x, Canadian dollars y and euros z. Today 1 USD = " + fmt(r, 4) + " CAD and 1 EUR = " + fmt(e, 4) + " CAD. Every mix worth $6,000 CAD lies on a plane.",
        lines: [["Normal", "CAD value of each currency", "(" + fmt(r, 4) + ", 1, " + fmt(e, 4) + ")"], ["Plane", fmt(r, 4) + "x + y + " + fmt(e, 4) + "z = " + fmt(D, 0), ""],
                ["US$1,500 and €1,000", fmt(r, 4) + " × 1,500 + " + fmt(e, 4) + " × 1,000", money(r * x + e * z)],
                ["Solve for y", fmt(D, 0) + " − " + fmt(r * x + e * z), money(y)]],
        take: "The normal holds the exchange rates, so the plane tilts whenever the rates move. When the loonie weakens, the same US and euro spending leaves fewer Canadian dollars." };
    } },
  { k: "Home", t: "How high is the roof",
    build() {
      const A = [0, 0, 3], B = [10, 0, 3], C = [0, 8, 6], u = sub(B, A), v = sub(C, A), raw = cross(u, v);
      const g = gcd(gcd(raw[0], raw[1]), raw[2]), n = mul(1 / g, raw), d = dot(n, A), y = 4, z = (d - n[1] * y) / n[2];
      return { setup: "A roof's eave runs from (0, 0, 3) to (10, 0, 3), in metres, and it rises to the ridge at (0, 8, 6). How high is the roof 4 m in from the eave?",
        lines: [["Two edges", "B − A and C − A", V(u) + ", " + V(v)], ["Normal", V(u) + " × " + V(v) + " ÷ " + g, V(n)],
                ["d", V(n) + " · (0, 0, 3)", sig(d)], ["Height at y = 4", lin(n) + " = " + d + " with y = 4", "z = " + sig(z) + " m"]],
        take: "The plane gives the roof's height above any spot on the floor. It rises 3 m for every 8 m in, which builders call a pitch of " + sig(12 * 3 / 8) + " in 12." };
    } },
  { k: "Sport", t: "A ski slope's fall line",
    build() {
      const n = [0.3, 0.2, 1], d = 400, P = [100, 200], h = d - n[0] * P[0] - n[1] * P[1], g = Math.hypot(n[0], n[1]), ang = Math.atan(g) * 180 / Math.PI;
      return { setup: "A ski slope is the plane 0.3x + 0.2y + z = 400, in metres, with x east, y north and z height. Which way is straight downhill, and how steep is it?",
        lines: [["Normal", "the coefficients", V(n)], ["Height at (100, 200)", "400 − 0.3(100) − 0.2(200)", sig(h) + " m"],
                ["Fall line on the map", "flat part of the normal", "(0.3, 0.2)"], ["Steepness", "√(0.3² + 0.2²)", fmt(g, 3) + " m drop per m"],
                ["Angle", "tan⁻¹(" + fmt(g, 3) + ")", fmt(ang, 1) + "°"]],
        take: "The normal tilts downhill, so its flat part points straight down the fall line, the way a ball would roll. A " + pct(g, 0) + " grade, about " + fmt(ang, 0) + "°, is a steady intermediate run." };
    } },
  { k: "Science", t: "Mapping a buried rock layer",
    build() {
      const A = [0, 0, -120], B = [400, 0, -160], C = [0, 300, -90], u = sub(B, A), v = sub(C, A), raw = cross(u, v);
      const g = gcd(gcd(raw[0], raw[1]), raw[2]), n = mul(1 / g, raw), d = dot(n, A), X = [400, 300], z = (d - n[0] * X[0] - n[1] * X[1]) / n[2];
      const dip = Math.acos(Math.abs(n[2]) / len(n)) * 180 / Math.PI;
      return { setup: "Three drill holes hit a rock layer at A(0, 0, −120), B(400, 0, −160) and C(0, 300, −90), in metres. How deep will a fourth hole at (400, 300) hit it?",
        lines: [["Two edges", "B − A and C − A", V(u) + ", " + V(v)], ["Normal", "cross product ÷ " + fmt(g, 0), V(n)],
                ["Plane", "d = n · A", lin(n) + " = " + n0(d)], ["Fourth hole", "400 − 300 + 10z = " + n0(d), "z = " + sig(z) + " m"],
                ["Dip", "cos θ = 10 ÷ √" + sig(dot(n, n)), fmt(dip, 1) + "°"]],
        take: "Three points fix the plane, and the plane predicts the layer anywhere nearby. The dip, the angle between the normal and straight up, tells geologists how fast the layer deepens." };
    } },
  { k: "Tech", t: "Shading a triangle in a game",
    build() {
      const A = [0, 0, 0], B = [2, 0, 0], C = [0, 2, 1], u = sub(B, A), v = sub(C, A), n = cross(u, v), Lt = [0, 0, 1], br = dot(n, Lt) / len(n);
      return { setup: "A triangle in a game has corners A(0, 0, 0), B(2, 0, 0) and C(0, 2, 1). A light shines straight down from above. How bright is the face?",
        lines: [["Edges", "B − A and C − A", V(u) + ", " + V(v)], ["Normal", "u × v", V(n)],
                ["Plane", "n · r = n · A", lin(n) + " = 0"], ["Brightness", "n · (0, 0, 1) ÷ |n| = " + n[2] + " ÷ √" + dot(n, n), fmt(br, 2) + ", so " + pct(br, 0) + " lit"]],
        take: "A face that points straight at the light is fully lit; one that tilts away is darker. Games compute this normal for each of millions of triangles to shade a scene." };
    } }
];

CP.NOTES.planeforms = [
  { k: "Finance", t: "Every basket on a budget",
    build() {
      const n = [3, 5, 15], D = 90, P = [D / n[0], 0, 0], u = [5, -3, 0], v = [5, 0, -1];
      return { setup: "Items cost $3, $5 and $15. Every way to spend exactly $90 is the plane 3x + 5y + 15z = 90. Write it in vector form.",
        lines: [["A point", "set y = z = 0: 3x = 90", V(P)], ["Direction u", V(u) + ": n · u = 15 − 15", sig(dot(n, u)) + ", in the plane"],
                ["Direction v", V(v) + ": n · v = 15 − 15", sig(dot(n, v)) + ", in the plane"],
                ["Vector form", "r = " + V(P) + " + s" + V(u) + " + t" + V(v), "u × v = " + V(cross(u, v))]],
        take: "Each direction is a trade that keeps the bill at $90: swap three $5 items for five $3 items, or one $15 item for five $3 items. The cross product gives back the prices, so both forms agree." };
    } },
  { k: "Finance", t: "Two goals leave a line of portfolios",
    build() {
      const n1 = [1, 1, 1], n2 = [2, 4, 5], T = 10000, I = 350, dir = cross(n1, n2);
      const [x, y] = solve2(1, 1, T, n2[0], n2[1], I * 100), P = [x, y, 0], Q = add(P, mul(1000, dir)), inc = dot(n2, Q) / 100;
      return { setup: "Invest " + money(T, 0) + " in funds paying 2%, 4% and 5%, and earn exactly " + money(I, 0) + " a year. That is two planes: x + y + z = 10,000 and 0.02x + 0.04y + 0.05z = 350.",
        lines: [["Direction", "(1, 1, 1) × (2, 4, 5)", V(dir)], ["A point", "z = 0: x + y = 10,000, 2x + 4y = 35,000", V(P)],
                ["The line", "r = " + V(P) + " + t" + V(dir), ""],
                ["Check t = 1,000", V(Q) + ": 2% + 4% + 5% parts", money(inc, 0) + " ✓"]],
        take: "Two goals leave a line of answers, not one. Each step along it moves $3 out of the 4% fund, $1 into the 2% fund and $2 into the 5% fund, and keeps both the total and the income fixed." };
    } },
  { k: "Finance", t: "Currency trades inside a trip budget", live: "usdcad",
    build(L) {
      const r = L.usdcad, g = L.gbpcad, D = 4000, n = [r, 1, g], u = [1, -r, 0], v = [0, -g, 1], c = cross(u, v);
      const f4 = a => "(" + a.map(x => Math.abs(x) === 1 || x === 0 ? sig(x) : fmt(x, 4)).join(", ") + ")";
      return { setup: "A $4,000 CAD trip budget can be held in US dollars x, Canadian dollars y or pounds z. Today 1 USD = " + fmt(r, 4) + " CAD and 1 GBP = " + fmt(g, 4) + " CAD.",
        lines: [["Scalar form", "", fmt(r, 4) + "x + y + " + fmt(g, 4) + "z = " + fmt(D, 0)], ["A point", "all Canadian: x = z = 0", "(0, 4,000, 0)"],
                ["Buy US$1", "one US dollar for " + fmt(r, 4) + " CAD", "u = " + f4(u)], ["Buy £1", "one pound for " + fmt(g, 4) + " CAD", "v = " + f4(v)],
                ["Check", "u × v", f4(c) + " = −n"]],
        take: "Each direction is a currency trade that keeps the budget's value fixed. Their cross product points back along the normal of exchange rates, so the vector and scalar forms describe the same plane." };
    } },
  { k: "Finance", t: "Recovering profit margins from trade-offs",
    build() {
      const P = [300, 0, 0], u = [-1, 3, 0], v = [-1, 0, 2], n = cross(u, v), d = dot(n, P);
      return { setup: "A bakery breaks even selling 300 cakes a week. It also breaks even if it swaps 1 cake for 3 loaves, or 1 cake for 2 pies. Find the scalar form.",
        lines: [["Vector form", "r = " + V(P) + " + s" + V(u) + " + t" + V(v), ""], ["Normal", V(u) + " × " + V(v), V(n)],
                ["d", V(n) + " · " + V(P), fmt(d, 0)], ["Scalar form", "n · r = d", lin(n) + " = " + fmt(d, 0)]],
        take: "The normal is the profit on each item: $" + n[0] + " a cake, $" + n[1] + " a loaf, $" + n[2] + " a pie. d is the weekly fixed cost, " + money(d, 0) + ". The trades alone were enough to find the margins." };
    } },
  { k: "Home", t: "Roof framing",
    build() {
      const P = [0, 0, 2.5], u = [0, 4, 2], v = [1, 0, 0], raw = cross(u, v), n = mul(1 / 2, raw), d = dot(n, P), y = 3, z = (d - n[1] * y) / n[2];
      return { setup: "A roof starts at a corner (0, 0, 2.5), in metres. Each rafter runs 4 m in and 2 m up: u = (0, 4, 2). The eave runs along v = (1, 0, 0). How high is the roof 3 m in?",
        lines: [["Normal", "u × v = " + V(raw), "÷ 2: " + V(n)], ["d", V(n) + " · " + V(P), sig(d)],
                ["Scalar form", "n · r = d", lin(n) + " = " + sig(d)], ["Height at y = 3", "3 − 2z = " + sig(d), "z = " + sig(z) + " m"]],
        take: "The vector form comes from the framing: a corner and two lumber directions. The scalar form answers a different question in one step, the roof's height above any point of the floor." };
    } },
  { k: "Sport", t: "A ski slope from two directions",
    build() {
      const P = [0, 0, 1200], u = [0, 3, -1], v = [1, 0, 0], raw = cross(u, v), n = mul(-1, raw), d = dot(n, P), y = 900, z = (d - n[1] * y) / n[2];
      return { setup: "A ski slope starts at the lift top (0, 0, 1,200), in metres. Down the fall line it drops 1 m for every 3 m north: u = (0, 3, −1). Across it is level: v = (1, 0, 0).",
        lines: [["Normal", "u × v = " + V(raw), "use " + V(n)], ["d", V(n) + " · " + V(P), fmt(d, 0)],
                ["Scalar form", "n · r = d", lin(n) + " = " + fmt(d, 0)], ["900 m north", "900 + 3z = " + fmt(d, 0), "z = " + fmt(z, 0) + " m"],
                ["Steepness", "tan⁻¹(1 ÷ 3)", fmt(Math.atan(1 / 3) * 180 / Math.PI, 1) + "°"]],
        take: "Two directions you can ski along describe the slope; the cross product turns them into one equation. That equation gives the height at any point on the trail map." };
    } },
  { k: "Tech", t: "The edge where two faces meet",
    build() {
      const n1 = [1, 2, 1], d1 = 6, n2 = [2, -1, 1], d2 = 2, dir = cross(n1, n2), [x, y] = solve2(n1[0], n1[1], d1, n2[0], n2[1], d2), P = [x, y, 0], Q = add(P, dir);
      return { setup: "Two flat faces of a 3D model lie on x + 2y + z = 6 and 2x − y + z = 2. The software needs the line where they meet, to draw the edge.",
        lines: [["Direction", V(n1) + " × " + V(n2), V(dir)], ["A point", "z = 0: x + 2y = 6, 2x − y = 2", V(P)],
                ["The edge", "r = " + V(P) + " + t" + V(dir), ""],
                ["Check t = 1", V(Q) + " in both", sig(dot(n1, Q)) + " and " + sig(dot(n2, Q)) + " ✓"]],
        take: "The edge lies in both faces, so it is at right angles to both normals. The cross product of the normals gives exactly that direction." };
    } },
  { k: "Science", t: "How steep a rock layer dips",
    build() {
      const P = [0, 0, -50], u = [2, 2, 0], v = [2, -2, -1], raw = cross(u, v), n = mul(-1 / 2, raw), d = dot(n, P);
      const dip = Math.acos(n[2] / len(n)) * 180 / Math.PI;
      return { setup: "A geologist finds a rock layer at (0, 0, −50), in metres. Along the layer, (2, 2, 0) stays level and (2, −2, −1) runs straight down the slope. How steep is it?",
        lines: [["Normal", V(u) + " × " + V(v), V(raw)], ["Simplify", "÷ −2", V(n)],
                ["Scalar form", "d = n · " + V(P), lin(n) + " = " + sig(d)], ["Dip", "cos θ = " + n[2] + " ÷ √" + dot(n, n), "θ ≈ " + fmt(dip, 1) + "°"]],
        take: "The dip is the angle between the layer and level ground, which equals the angle between the normal and straight up. Drillers use it to predict how deep the layer lies farther away." };
    } }
];
})();
