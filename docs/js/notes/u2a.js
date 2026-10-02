/* Worked notes: power rule (one term), whole polynomials, slope of a tangent, roots and negative powers. */
(function () {
const { fmt, money, pct, sig, sup } = CP.nh;
CP.NOTES.pow1 = [
  { k: "Home", t: "Pizza is a square law",
    build() {
      const c = Math.PI / 4, A = d => c * d * d, d1 = 12, d2 = 16;
      return { setup: "A round pizza of diameter d inches has area A(d) = (π ÷ 4)d². Compare a 12-inch and a 16-inch pizza.",
        lines: [["12-inch", "0.7854 × 12" + sup(2), fmt(A(d1), 1) + " sq in"], ["16-inch", "0.7854 × 16" + sup(2), fmt(A(d2), 1) + " sq in"],
                ["Differentiate", "A′(d) = 2 × 0.7854d = 1.5708d", ""], ["At 12 inches", "1.5708 × 12", fmt(2 * c * d1, 1) + " sq in per inch"]],
        take: "Four more inches gives " + fmt(A(d2) / A(d1), 2) + " times the pizza. The derivative grows with d, so each extra inch adds more pizza than the last." };
    } },
  { k: "Finance", t: "Land priced per square metre",
    build() {
      const p = 500, s = 30, dC = 2 * p * s, exact = p * ((s + 1) * (s + 1) - s * s);
      return { setup: "Land sells for $500 per m². A square lot of side s metres costs C(s) = 500s². What does one more metre of side cost at 30 m?",
        lines: [["Cost now", "500 × 30" + sup(2), money(p * s * s, 0)], ["Differentiate", "C′(s) = 2 × 500s = 1,000s", ""],
                ["At 30 m", "1,000 × 30", money(dC, 0) + " per metre"], ["Check", "500 × (31" + sup(2) + " − 30" + sup(2) + ")", money(exact, 0)]],
        take: "The derivative predicts " + money(dC, 0) + " and the true cost is " + money(exact, 0) + ". A wider lot adds a whole strip along two sides, so every extra metre costs more than the one before." };
    } },
  { k: "Driving", t: "Braking distance grows with v²",
    build() {
      const k = 0.005, d = v => k * v * v;
      return { setup: "On dry pavement, braking distance is about d(v) = 0.005v² metres at v km/h, after you hit the brakes.",
        lines: [["At 50 km/h", "0.005 × 50" + sup(2), fmt(d(50), 1) + " m"], ["At 100 km/h", "0.005 × 100" + sup(2), fmt(d(100), 0) + " m"],
                ["Differentiate", "d′(v) = 2 × 0.005v = 0.01v", ""], ["At 100 km/h", "0.01 × 100", sig(0.01 * 100) + " m per extra km/h"]],
        take: "Double the speed and the braking distance is four times as long. At 100 km/h each extra km/h adds about " + sig(0.01 * 100) + " m, twice as much as at 50 km/h." };
    } },
  { k: "Finance", t: "Volatility drag",
    build() {
      const D = s => s * s / 2, a = 0.10, b = 0.20;
      return { setup: "A portfolio's long-run growth rate loses about D(σ) = σ² ÷ 2 to volatility σ, the typical yearly swing. Compare a 10% swing with a 20% swing.",
        lines: [["σ = 10%", "0.10" + sup(2) + " ÷ 2", pct(D(a))], ["σ = 20%", "0.20" + sup(2) + " ÷ 2", pct(D(b))],
                ["Differentiate", "D′(σ) = 2σ ÷ 2 = σ", ""], ["At σ = 20%", "1 more point × 0.20", fmt(b, 2) + " points of growth"]],
        take: "Doubling the swing makes the drag four times as large. At 20%, each extra point of volatility costs about 0.2 points of yearly growth, twice the cost at 10%." };
    } },
  { k: "Science", t: "Wind power grows as v³",
    build() {
      const k = 0.6, P = v => k * v * v * v;
      return { setup: "Wind carries P(v) = 0.6v³ watts through each square metre facing it, at wind speed v in m/s. Compare 6 m/s and 12 m/s.",
        lines: [["At 6 m/s", "0.6 × 6" + sup(3), fmt(P(6), 1) + " W"], ["At 12 m/s", "0.6 × 12" + sup(3), fmt(P(12), 1) + " W"],
                ["Differentiate", "P′(v) = 3 × 0.6v" + sup(2) + " = 1.8v" + sup(2), ""], ["At 12 m/s", "1.8 × 12" + sup(2), fmt(3 * k * 144, 1) + " W per m/s"]],
        take: "Twice the wind speed gives " + sig(P(12) / P(6)) + " times the power. The derivative 1.8v² grows fast, which is why turbines go on the windiest ridges and shores." };
    } },
  { k: "Finance", t: "Why the next keg costs more",
    build() {
      const a = 0.4, price = 150, qmax = price / (2 * a);
      return { setup: "A small brewery's weekly production cost is C(q) = 0.4q² dollars for q kegs, because overtime and crowding grow. Each keg sells for $150.",
        lines: [["Differentiate", "C′(q) = 2 × 0.4q = 0.8q", ""], ["At 50 kegs", "0.8 × 50", money(2 * a * 50, 0) + " per keg"],
                ["At 100 kegs", "0.8 × 100", money(2 * a * 100, 0) + " per keg"], ["Break point", "0.8q = 150, q = 150 ÷ 0.8", fmt(qmax, 1) + " kegs"]],
        take: "Each keg costs more than the last. Past about " + fmt(Math.floor(qmax), 0) + " kegs a week the next keg costs more than it sells for, so growing further loses money." };
    } },
  { k: "Science", t: "Kinetic energy and momentum",
    build() {
      const m = 1500, v = 25, E = 0.5 * m * v * v, dE = m * v, exact = 0.5 * m * ((v + 1) * (v + 1) - v * v);
      return { setup: "A 1,500 kg car moves at 25 m/s (90 km/h). Its kinetic energy is E(v) = ½mv² = 750v² joules.",
        lines: [["Energy now", "750 × 25" + sup(2), fmt(E, 0) + " J"], ["Differentiate", "E′(v) = 2 × 750v = 1,500v", ""],
                ["At 25 m/s", "1,500 × 25", fmt(dE, 0) + " J per m/s"], ["Check", "750 × (26" + sup(2) + " − 25" + sup(2) + ")", fmt(exact, 0) + " J"]],
        take: "The derivative of ½mv² is mv, the car's momentum. Each extra 1 m/s at highway speed costs about " + fmt(dE, 0) + " J, which the brakes must turn into heat." };
    } },
  { k: "Finance", t: "Sensitivity grows with time", live: "bond10",
    build(L) {
      const r = L.bond10 / 100, g = 1 + r, P = 10000, n = 30, V = P * Math.pow(g, n), dV = n * P * Math.pow(g, n - 1);
      return { setup: money(P, 0) + " grows at " + fmt(L.bond10) + "% a year, the 10-year bond yield, for 30 years. Its value is V(g) = 10,000g" + sup(30) + " with g = " + sig(g) + ".",
        lines: [["Value", "10,000 × " + sig(g) + sup(30), money(V, 0)], ["Differentiate", "V′(g) = 30 × 10,000g" + sup(29), money(dV, 0)],
                ["0.1 point higher", money(dV, 0) + " × 0.001", money(dV * 0.001, 0)], ["1-year deposit", "10,000 × 0.001", money(P * 0.001, 0)]],
        take: "The power 30 comes down in front. A tenth of a point is worth about " + money(dV * 0.001, 0) + " after 30 years but only $10 after one, which is why long savings plans care so much about the rate." };
    } }
];
CP.NOTES.polyd = [
  { k: "Finance", t: "Marginal cost from a cost curve",
    build() {
      const C1 = q => 0.03 * q * q - 1.2 * q + 15;
      return { setup: "A workshop's weekly cost for q chairs is C(q) = 0.01q³ − 0.6q² + 15q + 200 dollars. The $200 is rent.",
        lines: [["Term by term", "0.03q" + sup(2) + " − 1.2q + 15 + 0", ""], ["At 20 chairs", "0.03 × 400 − 1.2 × 20 + 15", money(C1(20)) + " per chair"],
                ["At 40 chairs", "0.03 × 1,600 − 1.2 × 40 + 15", money(C1(40)) + " per chair"]],
        take: "The rent vanishes when you differentiate, because it does not change when you make one more chair. The next chair costs " + money(C1(20), 0) + " at 20 a week but " + money(C1(40), 0) + " at 40, once the workshop gets crowded." };
    } },
  { k: "Sport", t: "A basketball's vertical speed",
    build() {
      const v0 = 7, tTop = v0 / 9.8, top = 2 + v0 * tTop - 4.9 * tTop * tTop;
      return { setup: "A shot leaves the hand 2 m up, rising at 7 m/s. Its height is h(t) = −4.9t² + 7t + 2 metres after t seconds.",
        lines: [["Term by term", "h′(t) = −9.8t + 7 + 0", ""], ["At release", "−9.8 × 0 + 7", "7 m/s up"],
                ["At 0.5 s", "−9.8 × 0.5 + 7", fmt(-4.9 + v0, 1) + " m/s up"], ["Top", "−9.8t + 7 = 0", "t = " + fmt(tTop, 2) + " s, h = " + fmt(top, 2) + " m"]],
        take: "The derivative is the ball's vertical speed. It shrinks to zero at the top of the arc, " + fmt(top, 1) + " m up, well above the 3.05 m rim, and then the ball falls." };
    } },
  { k: "Finance", t: "Sell while the next sale pays",
    build() {
      const q = 30 / 0.06, R = 40 * q - 0.02 * q * q, C = 0.01 * q * q + 10 * q + 3000;
      return { setup: "A print shop sells q posters a month. Revenue R(q) = 40q − 0.02q² dollars; cost C(q) = 0.01q² + 10q + 3,000 dollars.",
        lines: [["Marginal revenue", "R′(q) = 40 − 0.04q", ""], ["Marginal cost", "C′(q) = 0.02q + 10", ""],
                ["Set equal", "40 − 0.04q = 0.02q + 10, so 0.06q = 30", "q = " + fmt(q, 0)], ["Profit then", money(R, 0) + " − " + money(C, 0), money(R - C, 0)]],
        take: "Below " + fmt(q, 0) + " posters the next one brings in more than it costs; above, it brings in less. Differentiating each polynomial term by term finds the best volume." };
    } },
  { k: "Home", t: "How much a deck joist sags",
    build() {
      const k = 0.000125, d = x => k * (x * x * x * x - 8 * x * x * x + 64 * x), d1 = x => k * (4 * x * x * x - 24 * x * x + 64);
      return { setup: "A 4 m deck joist under an even load sags along d(x) = 0.000125(x⁴ − 8x³ + 64x) metres, x metres from one end.",
        lines: [["Term by term", "d′(x) = 0.000125(4x" + sup(3) + " − 24x" + sup(2) + " + 64)", ""], ["At the end", "0.000125 × 64", fmt(d1(0) * 1000, 0) + " mm drop per metre"],
                ["At the centre", "0.000125(32 − 96 + 64)", fmt(Math.abs(d1(2)), 0) + ", flat"], ["Sag at centre", "0.000125(16 − 64 + 128)", fmt(d(2) * 1000, 0) + " mm"]],
        take: "The tilt is steepest at the ends and zero at the centre, where the sag is deepest. A common limit for floors is span ÷ 360, here about " + fmt(4000 / 360, 0) + " mm, so this joist passes." };
    } },
  { k: "Finance", t: "Pricing concert tickets",
    build() {
      const R = p => 2000 * p - 20 * p * p, R1 = p => 2000 - 40 * p, best = 2000 / 40;
      return { setup: "A Toronto hall sells 2,000 − 20p tickets at a price of $p. Revenue is R(p) = p(2,000 − 20p) = 2,000p − 20p².",
        lines: [["Term by term", "R′(p) = 2,000 − 40p", ""], ["At $40", "2,000 − 40 × 40", money(R1(40), 0) + " per $1"],
                ["Best price", "2,000 − 40p = 0", money(best, 0)], ["Revenue then", "2,000 × 50 − 20 × 50" + sup(2), money(R(best), 0)]],
        take: "At $40, raising the price $1 still adds about " + money(R1(40), 0) + ". At $50 the derivative is zero: any higher and lost sales outweigh the higher price." };
    } },
  { k: "Tech", t: "Why screen animations feel smooth",
    build() {
      const s1 = t => 6 * t - 6 * t * t;
      return { setup: "Many apps move things on screen along s(t) = 3t² − 2t³, from t = 0 (start) to t = 1 (end). s is the share of the distance covered.",
        lines: [["Term by term", "s′(t) = 6t − 6t" + sup(2), ""], ["Start", "6(0) − 6(0)" + sup(2), sig(s1(0))],
                ["Halfway", "6(0.5) − 6(0.5)" + sup(2), sig(s1(0.5))], ["End", "6(1) − 6(1)" + sup(2), sig(s1(1))]],
        take: "The speed is zero at both ends and highest in the middle, so a menu eases in and eases out instead of jerking. Graphics people call this curve smoothstep." };
    } },
  { k: "Finance", t: "Three TFSA deposits and the rate", live: "bond5",
    build(L) {
      const g = 1 + L.bond5 / 100, D = 7000, V = x => D * (x * x * x + x * x + x), V1 = D * (3 * g * g + 2 * g + 1);
      return { setup: "You put $7,000 in a TFSA at the start of each of 3 years, earning " + fmt(L.bond5) + "%, the 5-year bond yield. With g = " + sig(g) + ", the value after 3 years is V(g) = 7,000(g³ + g² + g).",
        lines: [["Value", "7,000(" + sig(g) + sup(3) + " + " + sig(g) + sup(2) + " + " + sig(g) + ")", money(V(g), 0)],
                ["Term by term", "V′(g) = 7,000(3g" + sup(2) + " + 2g + 1)", money(V1, 0)],
                ["1 point higher", money(V1, 0) + " × 0.01", money(V1 * 0.01, 0)], ["Exact", "V(" + sig(g + 0.01) + ") − V(" + sig(g) + ")", money(V(g + 0.01) - V(g), 0)]],
        take: "Each deposit is one power of g, so the derivative is just three power-rule terms added. One more percentage point is worth about " + money(V1 * 0.01, 0) + " over three years." };
    } },
  { k: "Driving", t: "Merging onto the 401",
    build() {
      const v0 = 12, a = 2.5, target = 100 / 3.6, t = (target - v0) / a, s = v0 * t + (a / 2) * t * t;
      return { setup: "You enter a 401 on-ramp at 12 m/s (about 43 km/h) and speed up steadily. Distance travelled is s(t) = 12t + 1.25t² metres.",
        lines: [["Term by term", "v(t) = s′(t) = 12 + 2.5t", ""], ["100 km/h", "100 ÷ 3.6", fmt(target, 1) + " m/s"],
                ["Time", "12 + 2.5t = " + fmt(target, 1), fmt(t, 1) + " s"], ["Distance", "12 × " + fmt(t, 1) + " + 1.25 × " + fmt(t, 1) + sup(2), fmt(s, 0) + " m"]],
        take: "The derivative of position is speed. You need about " + fmt(s, 0) + " m of ramp to reach highway speed at this pace, which is why acceleration lanes are long." };
    } }
];
CP.NOTES.tan = [
  { k: "Finance", t: "A rate rise on a 5-year GIC", live: "bond5",
    build(L) {
      const g = 1 + L.bond5 / 100, P = 10000, V = x => P * Math.pow(x, 5), m = 5 * P * Math.pow(g, 4);
      return { setup: money(P, 0) + " sits in a 5-year GIC at " + fmt(L.bond5) + "%, the 5-year bond yield. Its value at maturity is V(g) = 10,000g⁵, with g = " + sig(g) + ". What if the rate were half a point higher?",
        lines: [["Value now", "10,000 × " + sig(g) + sup(5), money(V(g))], ["Slope", "V′(g) = 50,000g" + sup(4) + " at g = " + sig(g), money(m, 0)],
                ["Tangent estimate", money(V(g)) + " + " + money(m, 0) + " × 0.005", money(V(g) + m * 0.005)], ["Exact", "10,000 × " + sig(g + 0.005) + sup(5), money(V(g + 0.005))]],
        take: "The tangent line gets within " + money(V(g + 0.005) - V(g) - m * 0.005) + " of the exact answer. Bond desks use the same idea, called duration, to price small rate moves in their heads." };
    } },
  { k: "Finance", t: "Simple interest is the tangent line", live: "policy",
    build(L) {
      const r = L.policy / 100, n = 5, exact = Math.pow(1 + r, n);
      return { setup: "Compound growth over 5 years is f(g) = g⁵, with g = 1 + r. At the policy rate, r = " + fmt(L.policy) + "%. Take the tangent at g = 1, where r = 0.",
        lines: [["Slope at g = 1", "f′(g) = 5g" + sup(4) + ", f′(1) = 5", "5"], ["Tangent line", "f ≈ 1 + 5r", fmt(1 + n * r, 4)],
                ["Exact", "(1 + " + sig(r) + ")" + sup(5), fmt(exact, 4)], ["Gap", fmt(exact, 4) + " − " + fmt(1 + n * r, 4), fmt(exact - 1 - n * r, 4)]],
        take: "Simple interest, 1 + 5r, is the tangent to compound growth at r = 0. Close to that point the two agree; the gap is interest earned on interest." };
    } },
  { k: "Finance", t: "Near a price, revenue is a line",
    build() {
      const R = p => 5000 * p - 40 * p * p, m = 5000 - 80 * 50;
      return { setup: "A gym sells 5,000 − 40p memberships at $p a month, so revenue is R(p) = 5,000p − 40p². It now charges $50. What if it charges $50.50?",
        lines: [["Slope", "R′(p) = 5,000 − 80p; R′(50) = 5,000 − 4,000", money(m, 0) + " per $1"], ["Tangent estimate", money(m, 0) + " × 0.50", money(m * 0.5, 0)],
                ["Exact", "R(50.50) − R(50)", money(R(50.5) - R(50), 0)], ["Big move: +$10", "Tangent " + money(m * 10, 0) + " vs exact", money(R(60) - R(50), 0)]],
        take: "For a 50¢ change the tangent is almost exact. For a $10 change it is far off, because the curve bends away from the line. Tangent estimates are for small moves." };
    } },
  { k: "Finance", t: "Cost of the next ten units",
    build() {
      const C = q => 0.001 * q * q * q - 0.3 * q * q + 40 * q + 5000, m = 0.003 * 100 * 100 - 0.6 * 100 + 40;
      return { setup: "A plant's weekly cost is C(q) = 0.001q³ − 0.3q² + 40q + 5,000 dollars. It makes 100 units now. What do 10 more cost?",
        lines: [["Slope", "C′(q) = 0.003q" + sup(2) + " − 0.6q + 40", ""], ["At q = 100", "30 − 60 + 40", money(m, 0) + " per unit"],
                ["Tangent estimate", money(m, 0) + " × 10", money(m * 10, 0)], ["Exact", "C(110) − C(100)", money(C(110) - C(100), 0)]],
        take: "Differentiate first, then put in q = 100. The slope there gives a quick estimate within a dollar of the exact cost, without working out two big totals." };
    } },
  { k: "Driving", t: "Headlights point along the tangent",
    build() {
      const f = x => 0.002 * x * x, a = 100, m = 0.004 * a, tangent = f(a) + m * 50, road = f(a + 50);
      return { setup: "Seen from above, a curve in the road follows y = 0.002x² metres. Your car is at x = 100. Low beams light about 50 m ahead.",
        lines: [["Slope", "y′ = 0.004x; at x = 100", sig(m)], ["Beam at x = 150", fmt(f(a), 0) + " + " + sig(m) + " × 50", fmt(tangent, 0) + " m"],
                ["Road at x = 150", "0.002 × 150" + sup(2), fmt(road, 0) + " m"], ["Miss", fmt(road, 0) + " − " + fmt(tangent, 0), fmt(road - tangent, 0) + " m"]],
        take: "Your headlights point along the tangent, not along the road. On this bend the beam lands about " + fmt(road - tangent, 0) + " m off the road, which is why curves feel so dark at night." };
    } },
  { k: "Sport", t: "A football's angle in flight",
    build() {
      const s = x => 0.8 - 0.032 * x, deg = m => Math.atan(m) * 180 / Math.PI;
      return { setup: "A punted football follows y = 0.8x − 0.016x² metres, where x is the distance downfield. It lands at x = 50.",
        lines: [["Slope", "y′ = 0.8 − 0.032x", ""], ["At the kick", "y′(0) = 0.8", fmt(deg(s(0)), 0) + "° up"],
                ["At x = 10", "0.8 − 0.032 × 10 = " + sig(s(10)), fmt(deg(s(10)), 0) + "° up"], ["At landing", "0.8 − 0.032 × 50 = " + sig(s(50)), fmt(-deg(s(50)), 0) + "° down"]],
        take: "The slope of the tangent at each point is the ball's direction of travel there. It leaves at about " + fmt(deg(0.8), 0) + "° and comes down at the same angle, flat at the top." };
    } },
  { k: "Tech", t: "How a calculator finds √50",
    build() {
      const x1 = 7 + 1 / 14, x2 = x1 - (x1 * x1 - 50) / (2 * x1);
      return { setup: "To find √50, solve f(x) = x² − 50 = 0. Start at x = 7, slide down the tangent to where it hits zero, and repeat.",
        lines: [["At x = 7", "f(7) = −1, f′(7) = 2 × 7 = 14", ""], ["Step 1", "7 − (−1) ÷ 14", fmt(x1, 6)],
                ["Step 2", "x − f(x) ÷ f′(x)", fmt(x2, 6)], ["True value", "√50", fmt(Math.sqrt(50), 6)]],
        take: "Each step replaces the curve with its tangent line. Two steps give six correct decimals. This is Newton's method, and computers use it to find roots." };
    } },
  { k: "Science", t: "A dropped stone at two seconds",
    build() {
      const s = t => 4.9 * t * t, v = 9.8 * 2;
      return { setup: "A stone dropped from a bridge falls s(t) = 4.9t² metres in t seconds. How fast is it going at t = 2, and where is it at 2.1 s?",
        lines: [["Height fallen", "4.9 × 2" + sup(2), fmt(s(2), 1) + " m"], ["Slope", "s′(t) = 9.8t; s′(2)", fmt(v, 1) + " m/s"],
                ["Tangent estimate", fmt(s(2), 1) + " + " + fmt(v, 1) + " × 0.1", fmt(s(2) + v * 0.1, 2) + " m"], ["Exact", "4.9 × 2.1" + sup(2), fmt(s(2.1), 2) + " m"]],
        take: "s(2) answers how far; s′(2) answers how fast. The slope of the tangent is the speed at that instant, " + fmt(v * 3.6, 0) + " km/h after two seconds of falling." };
    } }
];
CP.NOTES.fracpow = [
  { k: "Finance", t: "Risk grows like the square root of time",
    build() {
      const R = n => 15 * Math.sqrt(n), R1 = n => 7.5 / Math.sqrt(n);
      return { setup: "A stock fund swings about 15% in a typical year. Over n years the typical swing is about R(n) = 15√n percent.",
        lines: [["Rewrite", "R(n) = 15n" + sup("1/2"), ""], ["Differentiate", "R′(n) = 7.5n" + sup("−1/2") + " = 7.5 ÷ √n", ""],
                ["At 4 years", "15√4; 7.5 ÷ 2", fmt(R(4), 0) + "%, adding " + fmt(R1(4), 2) + " points a year"], ["At 16 years", "15√16; 7.5 ÷ 4", fmt(R(16), 0) + "%, adding " + fmt(R1(16), 2) + " points a year"]],
        take: "Four years carries " + fmt(R(4), 0) + "% risk, not 60%. The derivative shrinks as n grows, so each extra year adds less risk, which is why long horizons suit stocks." };
    } },
  { k: "Science", t: "Adjusting a pendulum clock",
    build() {
      const c = 2 * Math.PI / Math.sqrt(9.81), L = 0.994, T = c * Math.sqrt(L), T1 = c / (2 * Math.sqrt(L)), swings = 86400 / T, perDay = swings * T1 * 0.001;
      return { setup: "A pendulum of length L metres swings with period T(L) = 2.006√L seconds. A clock's 0.994 m pendulum ticks every " + fmt(T, 2) + " s. Make it 1 mm longer.",
        lines: [["Rewrite", "T(L) = 2.006L" + sup("1/2"), ""], ["Differentiate", "T′(L) = 1.003L" + sup("−1/2") + " = 1.003 ÷ √L", ""],
                ["At 0.994 m", "1.003 ÷ √0.994", fmt(T1, 3) + " s per m"], ["1 mm longer", fmt(T1, 3) + " × 0.001 × " + fmt(swings, 0) + " swings", fmt(perDay, 0) + " s slow a day"]],
        take: "A millimetre changes each swing by only a thousandth of a second, but over a day the clock loses about " + fmt(perDay, 0) + " s. That is why the bob has a fine adjusting nut." };
    } },
  { k: "Finance", t: "The square-root rule for traders",
    build() {
      const d = 1000000, R = n => d * Math.sqrt(n), R1 = n => d / (2 * Math.sqrt(n));
      return { setup: "A trading desk's typical one-day loss risk is $1 million. Banks scale it to n days as R(n) = 1,000,000√n.",
        lines: [["Rewrite", "R(n) = 1,000,000n" + sup("1/2"), ""], ["10 days", "1,000,000 × √10", money(R(10), 0)],
                ["Differentiate", "R′(n) = 500,000n" + sup("−1/2"), ""], ["At 10 days", "500,000 ÷ √10", money(R1(10), 0) + " per extra day"]],
        take: "Ten days is about 3.16 times one day's risk, not 10 times, because random gains and losses partly cancel. Banks have long used this rule to scale risk limits." };
    } },
  { k: "Nature", t: "Why big animals eat less per kilogram",
    build() {
      const B = m => 70 * Math.pow(m, 0.75), B1 = m => 52.5 * Math.pow(m, -0.25), mouse = 0.02, ele = 4000;
      return { setup: "An animal of mass m kg burns about B(m) = 70m" + sup("3/4") + " kcal a day. Compare a 20 g mouse with a 4,000 kg elephant.",
        lines: [["Mouse", "70 × 0.02" + sup("3/4"), fmt(B(mouse), 1) + " kcal, " + fmt(B(mouse) / mouse, 0) + " per kg"],
                ["Elephant", "70 × 4,000" + sup("3/4"), fmt(B(ele), 0) + " kcal, " + fmt(B(ele) / ele, 1) + " per kg"],
                ["Differentiate", "B′(m) = ¾ × 70m" + sup("−1/4") + " = 52.5m" + sup("−1/4"), ""],
                ["Extra kg", "52.5 × 0.02" + sup("−1/4") + " vs 52.5 × 4,000" + sup("−1/4"), fmt(B1(mouse), 0) + " vs " + fmt(B1(ele), 1) + " kcal"]],
        take: "The power 3/4 − 1 is −1/4, so the derivative shrinks as mass grows. An extra kilogram of mouse needs about " + fmt(B1(mouse) / B1(ele), 0) + " times as much food as an extra kilogram of elephant." };
    } },
  { k: "Finance", t: "What a rate rise does to a future bill", live: "bond10",
    build(L) {
      const g = 1 + L.bond10 / 100, F = 50000, n = 15, P = x => F * Math.pow(x, -n), P1 = -n * F * Math.pow(g, -n - 1);
      return { setup: "You need $50,000 in 15 years. Invested at " + fmt(L.bond10) + "%, the 10-year bond yield, you must set aside P(g) = 50,000g" + sup("−15") + " today, with g = " + sig(g) + ".",
        lines: [["Set aside now", "50,000 ÷ " + sig(g) + sup(15), money(P(g), 0)], ["Differentiate", "P′(g) = −15 × 50,000g" + sup("−16"), money(P1, 0)],
                ["1 point higher", money(P1, 0) + " × 0.01", money(P1 * 0.01, 0)], ["Exact", "P(" + sig(g + 0.01) + ") − P(" + sig(g) + ")", money(P(g + 0.01) - P(g), 0)]],
        take: "Writing 1 ÷ g¹⁵ as g⁻¹⁵ lets the power rule work: −15 − 1 = −16. A one-point higher rate cuts what you must save today by about " + money(P(g) - P(g + 0.01), 0) + ". The slope overshoots a little because the curve bends." };
    } },
  { k: "Science", t: "Speed of a tsunami",
    build() {
      const v = d => Math.sqrt(9.8 * d), v1 = d => Math.sqrt(9.8) / (2 * Math.sqrt(d));
      return { setup: "In water of depth d metres, a tsunami travels at v(d) = √(9.8d) = 3.13√d m/s. Compare the open ocean (4,000 m) with water 10 m deep.",
        lines: [["Open ocean", "3.13√4,000", fmt(v(4000), 0) + " m/s (" + fmt(v(4000) * 3.6, 0) + " km/h)"], ["Near shore", "3.13√10", fmt(v(10), 1) + " m/s"],
                ["Differentiate", "v′(d) = 1.565d" + sup("−1/2") + " = 1.565 ÷ √d", ""],
                ["Per metre deeper", "1.565 ÷ √4,000 vs 1.565 ÷ √10", fmt(v1(4000), 3) + " vs " + fmt(v1(10), 3) + " m/s"]],
        take: "Out at sea the wave moves as fast as a jet. Near shore every metre of depth matters far more, so the front slows sharply and the water behind piles up into a tall wave." };
    } },
  { k: "Finance", t: "Economic order size",
    build() {
      const c = Math.sqrt(2 * 50 / 2), Q = D => c * Math.sqrt(D), Q1 = D => c / (2 * Math.sqrt(D)), D = 10000;
      return { setup: "A store pays $50 per order and $2 a year to store each unit. The cheapest order size for D units a year is Q(D) = √(2 × 50D ÷ 2) = 7.07√D.",
        lines: [["At 10,000 a year", "7.07√10,000", fmt(Q(D), 0) + " units"], ["Rewrite", "Q(D) = 7.07D" + sup("1/2"), ""],
                ["Differentiate", "Q′(D) = 3.54D" + sup("−1/2") + " = 3.54 ÷ √D", ""], ["100 more sales", "100 × 3.54 ÷ √10,000", fmt(Q1(D) * 100, 1) + " units"]],
        take: "100 more sales a year raise the best order size by only about " + fmt(Q1(D) * 100, 1) + " units. Order size grows like √D: a store with four times the sales orders twice as much at a time, twice as often." };
    } },
  { k: "Nature", t: "How far you see from the CN Tower",
    build() {
      const c = 3.57, d = h => c * Math.sqrt(h), d1 = h => c / (2 * Math.sqrt(h));
      return { setup: "From h metres up, the horizon is about d(h) = 3.57√h km away. Compare standing on a beach (eyes 2 m up) with the CN Tower's deck, about 350 m up.",
        lines: [["Beach", "3.57√2", fmt(d(2), 1) + " km"], ["CN Tower", "3.57√350", fmt(d(350), 0) + " km"],
                ["Differentiate", "d′(h) = 1.785h" + sup("−1/2"), ""], ["Per extra metre", "1.785 ÷ √2 vs 1.785 ÷ √350", fmt(d1(2), 2) + " vs " + fmt(d1(350), 2) + " km"]],
        take: "Climbing " + fmt(350 / 2, 0) + " times higher lets you see only about " + fmt(d(350) / d(2), 0) + " times farther. The first metres of height add the most view." };
    } }
];
})();
