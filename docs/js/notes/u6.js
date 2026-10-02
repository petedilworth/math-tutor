/* Worked notes: vector basics, bearings, dot product, angles and projections, cross product, triple product. */
(function () {
const { fmt, money, pct, sig, sup } = CP.nh;
/* small vector kit for these notes */
const V = (a, d = 4) => "(" + a.map(x => sig(x, d)).join(", ") + ")";
const VM = a => "(" + a.map(x => money(x, 0)).join(", ") + ")";
const P = (x, d = 4) => x < 0 ? "(" + sig(x, d) + ")" : sig(x, d);
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = a => Math.sqrt(dot(a, a));
const add = (a, b) => a.map((x, i) => x + b[i]);
const sub = (a, b) => a.map((x, i) => x - b[i]);
const mul = (k, a) => a.map(x => x * k);
const sum = a => a.reduce((s, x) => s + x, 0);
const D = Math.PI / 180;
const r2 = x => Math.round(x * 100) / 100;
const dotStr = (a, b) => a.map((x, i) => P(x) + " × " + P(b[i])).join(" + ");
const sj = (a, f) => a.map((x, i) => i === 0 ? f(x) : (x < 0 ? " − " + f(-x) : " + " + f(x))).join("");
const sqStr = a => "√(" + a.map(x => P(x) + "²").join(" + ") + ")";
const sci = (x, d = 2) => { const e = Math.floor(Math.log10(Math.abs(x))); return fmt(x / Math.pow(10, e), d) + " × 10" + sup(String(e)); };

CP.NOTES.vbasic = [
  { k: "Finance", t: "A rebalance adds to zero",
    build() {
      const h = [40000, 30000, 10000], t = [-5000, 3000, 2000], n = add(h, t);
      return { setup: "An RRSP holds (stocks, bonds, cash) = " + VM(h) + ". You sell " + money(-t[0], 0) + " of stocks and move it into bonds and cash.",
        lines: [["Trade vector", "sell stocks, buy bonds and cash", VM(t)], ["Add", VM(h) + " + " + VM(t), VM(n)],
                ["Trade total", sj(t, x => money(x, 0)), money(sum(t), 0)], ["Holdings total", n.map(x => money(x, 0)).join(" + "), money(sum(n), 0)]],
        take: "Vectors add one component at a time. A rebalance only moves money between components, so its parts sum to zero and the total stays " + money(sum(n), 0) + "." };
    } },
  { k: "Finance", t: "Pricing a US trip in Canadian dollars", live: "usdcad",
    build(L) {
      const c = [900, 400, 300], k = L.usdcad, cad = mul(k, c);
      return { setup: "A Florida trip costs (hotel, food, car) = (US$900, US$400, US$300). Today one US dollar costs C$" + fmt(k, 4) + ".",
        lines: [["Scale", fmt(k, 4) + " × " + V(c), "(" + cad.map(x => money(x)).join(", ") + ")"],
                ["Add the C$ parts", cad.map(x => money(x)).join(" + "), money(sum(cad))],
                ["Check", "US$" + fmt(sum(c), 0) + " × " + fmt(k, 4), money(sum(c) * k)]],
        take: "Multiplying a vector by a number scales every component. Scaling then adding gives the same total as adding then scaling, which is why one exchange rate converts the whole budget." };
    } },
  { k: "Finance", t: "How much your spending moved",
    build() {
      const a = [1850, 640, 310], b = [1800, 590, 400], d = sub(a, b), s = sum(d), l = len(d);
      return { setup: "This month you spent (rent, food, transport) = " + VM(a) + ". Last month it was " + VM(b) + ".",
        lines: [["Change", VM(a) + " − " + VM(b), VM(d)], ["Sum of changes", sj(d, x => money(x, 0)), money(s, 0)],
                ["Length", sqStr(d), money(l)]],
        take: "The total moved only " + money(s, 0) + ", yet the length shows about " + money(l, 0) + " of real change. Length squares each part first, so rises and cuts do not cancel." };
    } },
  { k: "Finance", t: "A supplier raises every price",
    build() {
      const c = [12, 18, 6], k = 1.08, n = mul(k, c), b = 25;
      return { setup: "A Toronto bakery's ingredients for one batch cost (flour, butter, eggs) = ($12, $18, $6). The supplier raises everything 8%. The bakery makes " + b + " batches a week.",
        lines: [["Scale", "1.08 × " + V(c), "(" + n.map(x => money(x)).join(", ") + ")"], ["Old batch cost", c.map(x => money(x, 0)).join(" + "), money(sum(c))],
                ["New batch cost", n.map(x => money(x)).join(" + "), money(sum(n))], ["Extra per week", b + " × (" + money(sum(n)) + " − " + money(sum(c)) + ")", money(b * (sum(n) - sum(c)))]],
        take: "An across-the-board increase is a scalar multiple of the cost vector. Every component grows by the same factor, so the total does too." };
    } },
  { k: "Science", t: "Flying in a crosswind",
    build() {
      const a = [0, 250], w = [40, 0], g = add(a, w), h = 2;
      return { setup: "A small plane flies north at 250 km/h through the air. A wind blows east at 40 km/h. Use (east, north) components.",
        lines: [["Ground velocity", V(a) + " + " + V(w), V(g) + " km/h"], ["Ground speed", sqStr(g), fmt(len(g), 1) + " km/h"],
                ["Drift in " + h + " h", h + " × " + w[0], fmt(h * w[0], 0) + " km east"]],
        take: "The plane's path over the ground is its own velocity plus the wind's. Left alone, it ends up " + fmt(h * w[0], 0) + " km off course, which is why pilots aim into the wind." };
    } },
  { k: "Sport", t: "Leading a pass in hockey",
    build() {
      const p = [10, 5], v = [6, 2], t = 1.5, m = mul(t, v), a = add(p, m);
      return { setup: "A teammate is at (10, 5) m from you, skating at (6, 2) m/s. The pass takes 1.5 s to arrive.",
        lines: [["Scale velocity", "1.5 × " + V(v), V(m)], ["Aim point", V(p) + " + " + V(m), V(a)], ["Pass length", sqStr(a), fmt(len(a), 1) + " m"]],
        take: "Aim at position + time × velocity, not at where the player is now. Good passers do this vector sum by instinct." };
    } },
  { k: "Nature", t: "Swimming across a river",
    build() {
      const s = [0, 1.2], c = [0.8, 0], g = add(s, c), w = 60, t = w / s[1];
      return { setup: "You swim straight across a 60 m river at 1.2 m/s. The current flows at 0.8 m/s. Use (downstream, across) components.",
        lines: [["Actual velocity", V(s) + " + " + V(c), V(g) + " m/s"], ["Speed", sqStr(g), fmt(len(g), 2) + " m/s"],
                ["Time to cross", w + " ÷ " + sig(s[1]), fmt(t, 0) + " s"], ["Land downstream", sig(c[0]) + " × " + fmt(t, 0), fmt(c[0] * t, 0) + " m"]],
        take: "The current adds a sideways component but does not slow your crossing. You land " + fmt(c[0] * t, 0) + " m downstream, so start upstream of where you want to get out." };
    } },
  { k: "Home", t: "Will the curtain rod fit in the box",
    build() {
      const b = [1.2, 0.5, 0.4], rod = 1.33, f = Math.sqrt(b[0] * b[0] + b[1] * b[1]), d = len(b);
      return { setup: "A shipping box is 1.2 m × 0.5 m × 0.4 m. Will a " + sig(rod) + " m curtain rod fit inside?",
        lines: [["Floor diagonal", "√(1.2² + 0.5²)", fmt(f, 2) + " m"], ["Corner to corner", "√(1.2² + 0.5² + 0.4²)", fmt(d, 2) + " m"],
                ["Compare", sig(rod) + " m against " + fmt(d, 2) + " m", d >= rod ? "it fits, on the slant" : "too long"]],
        take: "Flat on the floor the rod is too long, but corner to corner there is room. The length of (1.2, 0.5, 0.4) is Pythagoras twice." };
    } }
];

CP.NOTES.bearings = [
  { k: "Finance", t: "Drone delivery pricing",
    build() {
      const e = 9, s = 4, d = Math.sqrt(e * e + s * s), a = Math.atan(e / s) / D, rate = 1.5, truck = (e + s) * rate;
      return { setup: "A customer is 9 km east and 4 km south of the depot. Drones and trucks both cost $1.50 per km to run.",
        lines: [["Distance", "√(9² + 4²)", fmt(d, 2) + " km"], ["Angle from south", "tan⁻¹(9 ÷ 4)", fmt(a, 0) + "°"],
                ["Bearing", "180° − " + fmt(a, 0) + "°", fmt(180 - a, 0) + "° (S " + fmt(a, 0) + "° E)"],
                ["Drone", fmt(d, 2) + " × $1.50", money(d * rate)], ["Truck, both legs", (e + s) + " × $1.50", money(truck)]],
        take: "The drone flies the length of the vector; the truck drives its components. The " + money(truck - d * rate) + " gap per trip is the business case for drone delivery." };
    } },
  { k: "Finance", t: "Turning a survey line into lot value",
    build() {
      const r = 32.5, b = 40, e = r2(r * Math.sin(b * D)), n = r2(r * Math.cos(b * D)), f = 15, A = f * n, price = 900;
      return { setup: "A lot's side line runs N 40° E for 32.5 m. Its front runs due east along the street for 15 m, so the lot is a parallelogram. Land sells for $900 per m².",
        lines: [["East part", "32.5 sin 40°", fmt(e, 2) + " m"], ["North part (depth)", "32.5 cos 40°", fmt(n, 2) + " m"],
                ["Area", "15 × " + fmt(n, 2), fmt(A, 1) + " m²"], ["Value", fmt(A, 1) + " × $900", money(A * price, 0)]],
        take: "A parallelogram's area is base × height, and the height is the north component of the side line. Surveys give bearings; components give area and value." };
    } },
  { k: "Finance", t: "What a headwind costs an airline",
    build() {
      const sp = 850, w = 120, wb = 80, dist = 3350, cost = 10000;
      const we = w * Math.sin(wb * D), wn = w * Math.cos(wb * D), g = sp - we, t0 = r2(dist / sp), t1 = r2(dist / g);
      return { setup: "A jet flies west from Toronto to Vancouver, about 3,350 km, at 850 km/h. Wind blows toward bearing 080° at 120 km/h. Say the jet costs $10,000 an hour to run.",
        lines: [["Wind east part", "120 sin 80°", fmt(we, 1) + " km/h"], ["Wind north part", "120 cos 80°", fmt(wn, 1) + " km/h"],
                ["Ground speed west", "850 − " + fmt(we, 1), fmt(g, 1) + " km/h"], ["Flight time", "3,350 ÷ " + fmt(g, 1), fmt(t1, 2) + " h, not " + fmt(t0, 2) + " h"],
                ["Extra cost", fmt(t1 - t0, 2) + " h × $10,000", money((t1 - t0) * cost, 0)]],
        take: "Nearly all of the wind's push is east, straight against the jet. That is why westbound flights across Canada take longer than eastbound ones." };
    } },
  { k: "Finance", t: "A boat charter's trip home", live: "usdcad",
    build(L) {
      const l1 = [18 * Math.sin(60 * D), 18 * Math.cos(60 * D)], l2 = [10 * Math.sin(150 * D), 10 * Math.cos(150 * D)];
      const t = add(l1, l2), d = len(t), back = (Math.atan2(-t[0], -t[1]) / D + 360) % 360, us = 9, k = L.usdcad;
      return { setup: "A fishing charter from the New York side of Lake Ontario sails 18 km on a bearing of 060°, then 10 km on 150°. It bills US$9 per km for the run home. Today US$1 = C$" + fmt(k, 4) + ".",
        lines: [["Leg 1 (east, north)", "(18 sin 60°, 18 cos 60°)", "(" + fmt(l1[0], 2) + ", " + fmt(l1[1], 2) + ")"],
                ["Leg 2", "(10 sin 150°, 10 cos 150°)", "(" + fmt(l2[0], 2) + ", " + fmt(l2[1], 2) + ")"],
                ["Distance home", "length of the sum", fmt(d, 1) + " km, bearing " + fmt(back, 0) + "°"],
                ["Cost", fmt(d, 1) + " × US$9 × " + fmt(k, 4), money(d * us * k)]],
        take: "Add the legs as components, then turn the sum back into a length and a bearing. The straight run home is shorter than retracing both legs." };
    } },
  { k: "Science", t: "Pilots correct for wind",
    build() {
      const a = 200, w = 30, c = Math.asin(w / a) / D, g = a * Math.cos(c * D), dist = 300;
      return { setup: "A pilot wants to track due north at 200 km/h airspeed. The wind blows due east at 30 km/h. Aim the nose west of north so the east parts cancel.",
        lines: [["Correction", "sin⁻¹(30 ÷ 200)", fmt(c, 1) + "°"], ["Heading", "360° − " + fmt(c, 1) + "°", fmt(360 - c, 1) + "°"],
                ["Ground speed", "200 cos " + fmt(c, 1) + "°", fmt(g, 1) + " km/h"], ["300 km takes", "300 ÷ " + fmt(g, 1), fmt(dist / g * 60, 0) + " min"]],
        take: "The plane's west part, 200 sin " + fmt(c, 1) + "° = 30 km/h, cancels the wind exactly. The cost is a slightly slower ground speed." };
    } },
  { k: "Sport", t: "Orienteering on the map",
    build() {
      const r = 400, b = 230, e = r * Math.sin(b * D), n = r * Math.cos(b * D);
      return { setup: "The next control is 400 m away on a bearing of 230°. The map scale is 1:10,000, so 1 cm on the map is 100 m.",
        lines: [["East part", "400 sin 230°", fmt(e, 0) + " m"], ["North part", "400 cos 230°", fmt(n, 0) + " m"],
                ["On the map", fmt(-e, 0) + " ÷ 100 and " + fmt(-n, 0) + " ÷ 100", fmt(-e / 100, 1) + " cm left, " + fmt(-n / 100, 1) + " cm down"]],
        take: "Both parts come out negative because 230° points south-west. The signs from sin and cos tell you which way to go." };
    } },
  { k: "Tech", t: "Turning GPS velocity into a heading",
    build() {
      const e = -8, n = 15, s = Math.sqrt(e * e + n * n), a = Math.atan(-e / n) / D;
      return { setup: "A phone's GPS reports a cyclist's velocity as 8 m/s west and 15 m/s north: (east, north) = (−8, 15).",
        lines: [["Speed", "√(8² + 15²)", fmt(s, 0) + " m/s"], ["In km/h", fmt(s, 0) + " × 3.6", fmt(s * 3.6, 1) + " km/h"],
                ["Angle west of north", "tan⁻¹(8 ÷ 15)", fmt(a, 1) + "°"], ["Bearing", "360° − " + fmt(a, 1) + "°", fmt(360 - a, 1) + "°"]],
        take: "Typing tan⁻¹(15 ÷ −8) into a calculator gives −" + fmt(Math.atan(n / -e) / D, 1) + "°, measured from the wrong axis and pointing the wrong way. Check the signs, then name the angle from north." };
    } },
  { k: "Nature", t: "A goose blown off course",
    build() {
      const f = [0, -60], w = [20, 0], g = add(f, w), s = len(g), a = Math.atan(g[0] / -g[1]) / D, h = 8;
      return { setup: "A goose flies due south at 60 km/h. A wind blows due east at 20 km/h. Use (east, north) components.",
        lines: [["Track", V(f) + " + " + V(w), V(g) + " km/h"], ["Speed", "√(20² + 60²)", fmt(s, 1) + " km/h"],
                ["Bearing", "180° − tan⁻¹(20 ÷ 60)", fmt(180 - a, 1) + "° (S " + fmt(a, 1) + "° E)"], ["After " + h + " h", h + " × 20", fmt(h * w[0], 0) + " km east of plan"]],
        take: "The goose holds its heading, but its real track is the vector sum. Migrating birds correct for drift using landmarks and the sun." };
    } }
];

CP.NOTES.dotp = [
  { k: "Finance", t: "Portfolio return is a dot product", live: "bond5",
    build(L) {
      const w = [0.5, 0.3, 0.2], r = [7, L.bond5, 2.5], prod = w.map((x, i) => x * r[i]), tot = sum(prod), P0 = 100000;
      return { setup: "A portfolio is 50% stocks, 30% bonds, 20% cash. Expect stocks to earn 7%, bonds the 5-year yield of " + fmt(L.bond5) + "%, and cash 2.5%.",
        lines: [["Stocks", "0.5 × 7", fmt(prod[0]) + "%"], ["Bonds", "0.3 × " + fmt(L.bond5), fmt(prod[1]) + "%"], ["Cash", "0.2 × 2.5", fmt(prod[2]) + "%"],
                ["Weights · returns", fmt(prod[0]) + " + " + fmt(prod[1]) + " + " + fmt(prod[2]), fmt(tot) + "%"], ["On $100,000", "$100,000 × " + pct(tot / 100), money(P0 * tot / 100, 0) + " a year"]],
        take: "Pair each weight with its return, multiply, add. A portfolio's return is weights · returns, a single number, not a vector." };
    } },
  { k: "Finance", t: "A grocery receipt",
    build() {
      const q = [3, 2, 5], p = [4, 6.5, 2], prod = q.map((x, i) => x * p[i]);
      return { setup: "You buy 3 bags of apples at $4.00, 2 blocks of cheese at $6.50 and 5 cans of tomatoes at $2.00. Quantities (3, 2, 5), prices ($4.00, $6.50, $2.00).",
        lines: [["Apples", "3 × $4.00", money(prod[0])], ["Cheese", "2 × $6.50", money(prod[1])], ["Tomatoes", "5 × $2.00", money(prod[2])],
                ["Quantities · prices", prod.map(x => money(x)).join(" + "), money(sum(prod))]],
        take: "Every receipt is a dot product: multiply matching components, then add. Basic groceries carry no HST in Ontario, so this is the total you pay." };
    } },
  { k: "Finance", t: "Today's gain in one calculation",
    build() {
      const h = [200, 150, 80], c = [0.45, -1.2, 2.1], prod = h.map((x, i) => x * c[i]), tot = sum(prod);
      return { setup: "A TFSA holds (200, 150, 80) shares of three stocks. Today their prices changed by (+$0.45, −$1.20, +$2.10).",
        lines: [["Stock 1", "200 × $0.45", money(prod[0])], ["Stock 2", "150 × (−$1.20)", money(prod[1])], ["Stock 3", "80 × $2.10", money(prod[2])],
                ["Holdings · changes", sj(prod, x => money(x)), money(tot)]],
        take: "You do not need to revalue everything. The change in value is holdings · price changes, and the negative pair is where sign mistakes hide." };
    } },
  { k: "Finance", t: "A swap that costs nothing",
    build() {
      const q = [-4, 5, 2], p = [75, 36, 60], prod = q.map((x, i) => x * p[i]), tot = sum(prod);
      return { setup: "Sell 4 shares at $75, buy 5 at $36 and 2 at $60. The trade vector is (−4, 5, 2); the price vector is ($75, $36, $60).",
        lines: [["Sell", "−4 × $75", money(prod[0])], ["Buy", "5 × $36", money(prod[1])], ["Buy", "2 × $60", money(prod[2])],
                ["Trade · prices", sj(prod, x => money(x)), money(tot)]],
        take: "The dot product is zero, so the trade vector is at right angles to the price vector. In money terms: the sale pays for the purchases exactly, with nothing left over." };
    } },
  { k: "Science", t: "Work pulling a sled",
    build() {
      const F = [60, 45], d = [25, 0], W = dot(F, d);
      return { setup: "You pull a sled with a force of (60, 45) N: 60 N forward, 45 N upward through the rope. It moves (25, 0) m along flat snow.",
        lines: [["Forward pair", "60 × 25", fmt(F[0] * d[0], 0) + " J"], ["Upward pair", "45 × 0", fmt(F[1] * d[1], 0) + " J"],
                ["Work = F · d", fmt(F[0] * d[0], 0) + " + " + fmt(F[1] * d[1], 0), fmt(W, 0) + " J"]],
        take: "The sled never rises, so the upward 45 N does no work. The dot product keeps the part of the force along the motion and drops the rest." };
    } },
  { k: "Sport", t: "Points in the NHL standings",
    build() {
      const r = [45, 28, 9], pts = [2, 0, 1], prod = r.map((x, i) => x * pts[i]);
      return { setup: "A team finishes with 45 wins, 28 regulation losses and 9 overtime losses. The NHL gives 2 points for a win, 0 for a regulation loss, 1 for an overtime loss.",
        lines: [["Wins", "45 × 2", String(prod[0])], ["Losses", "28 × 0", String(prod[1])], ["Overtime losses", "9 × 1", String(prod[2])],
                ["Record · points", prod.join(" + "), sum(prod) + " points"]],
        take: "The standings are a dot product of each team's record with the points vector (2, 0, 1). Change the points rule and every team's total changes." };
    } },
  { k: "Home", t: "Is the patio corner square",
    build() {
      const u = [3, 4], v = [-4, 3], w = [-4, 3.1], a = dot(u, v), b = dot(u, w);
      return { setup: "From one corner of a patio, the stakes along two edges sit at u = (3, 4) m and v = (−4, 3) m. Then someone bumps the second stake to (−4, 3.1).",
        lines: [["As planned", dotStr(u, v), sig(a)], ["Stake bumped", dotStr(u, w), sig(b)],
                ["Verdict", "zero, then not zero", b === 0 ? "still square" : "re-set the stake"]],
        take: "A dot product of zero means a right angle. Even a 10 cm bump makes it non-zero, so the patio would no longer be square." };
    } },
  { k: "Tech", t: "Matching viewers to shows",
    build() {
      const y = [5, 1, 3], s = { A: [4, 0, 2], B: [1, 5, 0], C: [0, 1, 5] }, sc = Object.keys(s).map(k => [k, dot(y, s[k])]);
      const best = sc.reduce((m, x) => x[1] > m[1] ? x : m);
      return { setup: "A streaming service scores your taste for (action, comedy, documentary) as (5, 1, 3). Show A scores (4, 0, 2), show B (1, 5, 0), show C (0, 1, 5).",
        lines: sc.map(([k, v]) => ["Show " + k, dotStr(y, s[k]), String(v)]).concat([["Recommend", "largest dot product", "show " + best[0]]]),
        take: "A big dot product means your tastes and the show's point the same way. Services compare millions of these to fill your home screen." };
    } }
];

CP.NOTES.angle = [
  { k: "Finance", t: "Correlation is a cosine",
    build() {
      const a = [2, -1, 3, -4], b = [1, -2, 2, -1], d = dot(a, b), la = len(a), lb = len(b), c = d / (la * lb);
      return { setup: "Over four years, two stocks' returns minus their averages were A = (2, −1, 3, −4) and B = (1, −2, 2, −1), in percentage points.",
        lines: [["A · B", dotStr(a, b), sig(d)], ["Lengths", "√" + sig(dot(a, a)) + " and √" + sig(dot(b, b)), fmt(la, 3) + " and " + fmt(lb, 3)],
                ["cos θ", sig(d) + " ÷ (" + fmt(la, 3) + " × " + fmt(lb, 3) + ")", fmt(c, 3)], ["Angle", "cos⁻¹ " + fmt(c, 3), fmt(Math.acos(c) / D, 1) + "°"]],
        take: "The cosine, " + fmt(c, 2) + ", is the two stocks' correlation. The angle formula works in four dimensions the same way: 1 moves together, 0 unrelated, −1 opposite." };
    } },
  { k: "Finance", t: "Why diversifying lowers risk",
    build() {
      const s = 10, mix = t => 0.5 * Math.sqrt(s * s + s * s + 2 * s * s * Math.cos(t * D));
      return { setup: "Two funds each swing about 10% a year (their risk). Hold half of each. The mix's risk is ½|u + v|, where |u + v|² = 10² + 10² + 2(10)(10) cos θ.",
        lines: [0, 60, 90].map(t => ["θ = " + t + "°", "½√(" + s * s + " + " + s * s + " + " + 2 * s * s + " × " + sig(Math.cos(t * D)) + ")", fmt(mix(t), 2) + "%"]),
        take: "The angle between the funds is set by their correlation. At right angles, the mix swings " + pct(1 - mix(90) / 10, 0) + " less than either fund alone, with no change in expected return." };
    } },
  { k: "Finance", t: "Beta is a projection",
    build() {
      const m = [3, -2, 4, -5], s = [5, -2, 6, -9], d = dot(s, m), mm = dot(m, m), beta = d / mm, fall = 10;
      return { setup: "Over four years, the TSX's returns minus their average were m = (3, −2, 4, −5). One stock's were s = (5, −2, 6, −9), in percentage points.",
        lines: [["s · m", dotStr(s, m), sig(d)], ["|m|²", "3² + 2² + 4² + 5²", sig(mm)], ["Beta", sig(d) + " ÷ " + sig(mm), fmt(beta, 2)],
                ["Vector projection", fmt(beta, 2) + " × m", V(mul(beta, m), 2)]],
        take: "Beta is the projection coefficient (s · m) ÷ |m|². At " + fmt(beta, 2) + ", when the market falls " + fall + "%, expect this stock to fall about " + fmt(beta * fall, 0) + "%." };
    } },
  { k: "Finance", t: "How closely an index fund tracks",
    build() {
      const f = [1.9, -3.1, 4.2, -3], x = [2, -3, 4, -3], d = dot(f, x), lf = len(f), lx = len(x), c = d / (lf * lx);
      return { setup: "Over four years, an index fund's returns minus their average were f = (1.9, −3.1, 4.2, −3.0). Its index's were x = (2, −3, 4, −3).",
        lines: [["f · x", dotStr(f, x), fmt(d, 2)], ["Lengths", "|f| and |x|", fmt(lf, 3) + " and " + fmt(lx, 3)],
                ["cos θ", fmt(d, 2) + " ÷ (" + fmt(lf, 3) + " × " + fmt(lx, 3) + ")", fmt(c, 4)], ["Angle", "cos⁻¹ " + fmt(c, 4), fmt(Math.acos(c) / D, 1) + "°"]],
        take: "An angle of about " + fmt(Math.acos(c) / D, 0) + "° means the fund points almost exactly where its index does. That is the whole job of an index fund." };
    } },
  { k: "Nature", t: "Tilting solar panels in Toronto",
    build() {
      const n = [0, -0.69, 0.72], ju = [0, -0.34, 0.94], de = [0, -0.92, 0.39];
      const ang = s => Math.acos(dot(n, s) / (len(n) * len(s))) / D;
      return { setup: "A panel tilted 44° toward the south faces n = (0, −0.69, 0.72) in (east, north, up). The noon sun is in direction (0, −0.34, 0.94) in June and (0, −0.92, 0.39) in December.",
        lines: [["June n · s", dotStr(n, ju), fmt(dot(n, ju), 3)], ["June angle", "cos⁻¹(n · s ÷ |n||s|)", fmt(ang(ju), 0) + "°"],
                ["December n · s", dotStr(n, de), fmt(dot(n, de), 3)], ["December angle", "cos⁻¹(n · s ÷ |n||s|)", fmt(ang(de), 0) + "°"]],
        take: "Tilting at about Toronto's latitude, 44°, splits the difference: the noon sun is about " + fmt(ang(ju), 0) + "° off straight-on in both seasons. The panel gets cos θ, about " + pct(Math.cos(ang(ju) * D), 0) + ", of full sun." };
    } },
  { k: "Sport", t: "How hard a slope pulls a skier",
    build() {
      const g = [0, -9.81], dd = deg => [Math.round(Math.cos(deg * D) * 1000) / 1000, -Math.round(Math.sin(deg * D) * 1000) / 1000];
      const a = dd(25), b = dd(15), pa = dot(g, a) / len(a), pb = dot(g, b) / len(b);
      return { setup: "Gravity is g = (0, −9.81) m/s² in (horizontal, up). Straight down a 25° slope is the unit vector d = " + V(a, 3) + ".",
        lines: [["g · d", "0 × " + sig(a[0], 3) + " + (−9.81) × (" + sig(a[1], 3) + ")", fmt(dot(g, a), 2)], ["|d|", sqStr(a), fmt(len(a), 2)],
                ["Pull down 25°", fmt(dot(g, a), 2) + " ÷ " + fmt(len(a), 2), fmt(pa, 2) + " m/s²"], ["Pull down 15°", "same steps, d = " + V(b, 3), fmt(pb, 2) + " m/s²"]],
        take: "The scalar projection of gravity on the slope is the part that speeds you up. A steeper hill gives a bigger projection, " + fmt(pa, 2) + " against " + fmt(pb, 2) + " m/s², before friction and air." };
    } },
  { k: "Tech", t: "Ranking search results",
    build() {
      const q = [1, 1, 0], pg = { A: [3, 2, 0], B: [1, 0, 4] }, c = k => dot(q, pg[k]) / (len(q) * len(pg[k]));
      return { setup: "Count the words (hockey, skates, recipe). The search \"hockey skates\" is q = (1, 1, 0). Page A has (3, 2, 0); page B has (1, 0, 4).",
        lines: [["Page A", sig(dot(q, pg.A)) + " ÷ (√" + dot(q, q) + " × √" + dot(pg.A, pg.A) + ")", "cos θ = " + fmt(c("A"), 3)], ["Page A angle", "cos⁻¹ " + fmt(c("A"), 3), fmt(Math.acos(c("A")) / D, 0) + "°"],
                ["Page B", sig(dot(q, pg.B)) + " ÷ (√" + dot(q, q) + " × √" + dot(pg.B, pg.B) + ")", "cos θ = " + fmt(c("B"), 3)], ["Page B angle", "cos⁻¹ " + fmt(c("B"), 3), fmt(Math.acos(c("B")) / D, 0) + "°"]],
        take: "Page A points almost the same way as the search, so it ranks first. Dividing by the lengths means a long page cannot win just by having more words." };
    } },
  { k: "Home", t: "Pushing a lawnmower",
    build() {
      const F = [60, -45], d = [1, 0], pr = dot(F, d) / len(d), lF = len(F);
      return { setup: "You push along the mower's handle with a force of F = (60, −45) N in (forward, up). The mower moves forward, d = (1, 0).",
        lines: [["F · d", "60 × 1 + (−45) × 0", sig(dot(F, d))], ["Push forward", sig(dot(F, d)) + " ÷ |d|", fmt(pr, 0) + " N"],
                ["Your push", "√(60² + 45²)", fmt(lF, 0) + " N"], ["Angle", "cos⁻¹(" + fmt(pr, 0) + " ÷ " + fmt(lF, 0) + ")", fmt(Math.acos(pr / lF) / D, 1) + "°"]],
        take: "Only the projection, " + fmt(pr, 0) + " of your " + fmt(lF, 0) + " N, moves the mower forward. The rest presses it into the grass. A flatter handle angle sends more of your push forward." };
    } }
];

CP.NOTES.crossp = [
  { k: "Home", t: "Torque on a stuck bolt",
    build() {
      const r = [0.25, 0, 0], F1 = [0, 0, -120], F2 = [72, 0, -96], F3 = [120, 0, 0];
      const t = F => cross(r, F), show = F => V(t(F)) + " → " + fmt(len(t(F)), 0) + " N·m";
      return { setup: "A wrench handle is r = (0.25, 0, 0) m. You push its end with 120 N: straight down, at an angle, or along the handle.",
        lines: [["Straight down", V(r) + " × " + V(F1), show(F1)], ["At an angle", V(r) + " × " + V(F2), show(F2)], ["Along the handle", V(r) + " × " + V(F3), show(F3)]],
        take: "Torque = r × F, and only the part of F at right angles to the handle counts. Pushing along the handle does nothing; a longer handle multiplies the torque." };
    } },
  { k: "Finance", t: "Area of a triangular lot",
    build() {
      const u = [30, 5, 0], v = [12, 40, 0], c = cross(u, v), A = len(c) / 2, price = 650;
      return { setup: "From one corner, the other two corners of a triangular lot are u = (30, 5, 0) m and v = (12, 40, 0) m. Land nearby sells for $650 per m².",
        lines: [["u × v", "(5·0 − 0·40, 0·12 − 30·0, 30·40 − 5·12)", V(c)], ["|u × v|", "parallelogram area", fmt(len(c), 0) + " m²"],
                ["Lot area", "½ × " + fmt(len(c), 0), fmt(A, 0) + " m²"], ["Value", fmt(A, 0) + " × $650", money(A * price, 0)]],
        take: "|u × v| is the area of the parallelogram on u and v, and the triangle is half of it. Surveyors use this to get area straight from corner coordinates." };
    } },
  { k: "Finance", t: "A Florida lot from its corners", live: "usdcad",
    build(L) {
      const B = [35, 0, 0], C = [40, 28, 0], Dd = [-3, 25, 0], t1 = len(cross(B, C)) / 2, t2 = len(cross(C, Dd)) / 2, A = t1 + t2, us = 90, k = L.usdcad;
      return { setup: "A snowbird looks at a four-sided lot with corners at (0, 0), (35, 0), (40, 28) and (−3, 25) m. It is listed at US$90 per m². Today US$1 = C$" + fmt(k, 4) + ".",
        lines: [["Triangle 1", "½|(35, 0, 0) × (40, 28, 0)|", fmt(t1, 0) + " m²"], ["Triangle 2", "½|(40, 28, 0) × (−3, 25, 0)|", fmt(t2, 0) + " m²"],
                ["Lot", fmt(t1, 0) + " + " + fmt(t2, 0), fmt(A, 0) + " m²"], ["Price in US$", fmt(A, 0) + " × US$90", "US" + money(A * us, 0)],
                ["Price in C$", "US" + money(A * us, 0) + " × " + fmt(k, 4), money(A * us * k, 0)]],
        take: "Split an irregular lot into triangles and take half of each cross product. The area is fixed; what it costs a Canadian moves with the exchange rate." };
    } },
  { k: "Finance", t: "Hedging two risks at once",
    build() {
      const a = [1.2, 0.8, 0.1], b = [0.3, 0.9, 1.5], h = cross(a, b);
      return { setup: "Three funds move a = (1.2, 0.8, 0.1)% when interest rates rise 1 point, and b = (0.3, 0.9, 1.5)% when oil rises 10%. Find a mix h that neither risk moves.",
        lines: [["1st part (2-3)", "0.8 × 1.5 − 0.1 × 0.9", sig(h[0])], ["2nd part (3-1)", "0.1 × 0.3 − 1.2 × 1.5", sig(h[1])], ["3rd part (1-2)", "1.2 × 0.9 − 0.8 × 0.3", sig(h[2])],
                ["Check", "a · h and b · h", sig(dot(a, h)) + " and " + sig(dot(b, h))]],
        take: "h = a × b is at right angles to both exposures, so neither risk moves it. Hold " + sig(h[0]) + " units of fund 1 and " + sig(h[2]) + " of fund 3, and sell short (borrow and sell) " + sig(-h[1]) + " of fund 2." };
    } },
  { k: "Finance", t: "Pricing a sloped roof",
    build() {
      const u = [10, 0, 0], v = [0, 4, 3], c = cross(u, v), A = len(c), rate = 75, plan = 10 * 4;
      return { setup: "One face of a roof runs u = (10, 0, 0) m along the eave and v = (0, 4, 3) m up the slope. A roofer quotes $75 per m² installed.",
        lines: [["u × v", "(0·3 − 0·4, 0·0 − 10·3, 10·4 − 0·0)", V(c)], ["Area", "√(0² + 30² + 40²)", fmt(A, 0) + " m²"],
                ["Cost", fmt(A, 0) + " × $75", money(A * rate, 0)], ["From the floor plan", "10 × 4 × $75", money(plan * rate, 0)]],
        take: "The roof's true area is |u × v|. Measuring only the floor plan under it would miss " + money((A - plan) * rate, 0) + ", because the slope adds " + pct((A - plan) / plan, 0) + " more surface." };
    } },
  { k: "Sport", t: "Why a curveball drops",
    build() {
      const v = [33, 0, 0], w1 = [0, 250, 0], w2 = [0, 200, 150], c1 = cross(w1, v), c2 = cross(w2, v);
      return { setup: "Use x toward the plate, y to the pitcher's left, z up. The ball moves at v = (33, 0, 0) m/s. The spin-driven force points along spin × velocity.",
        lines: [["Topspin", V(w1) + " × " + V(v), V(c1)], ["Direction", "only a negative z part", "straight down"],
                ["Tilted spin", V(w2) + " × " + V(v), V(c2)], ["Direction", "+y and −z", "down and to the left"]],
        take: "The cross product is at right angles to both the spin axis and the ball's path. That sideways or downward push, the Magnus effect, is what makes a pitch break." };
    } },
  { k: "Science", t: "Force on a wire in a motor",
    build() {
      const I = 5, L1 = [0.2, 0, 0], B = [0, 0.5, 0], L2 = [0, 0.2, 0], c1 = cross(L1, B), c2 = cross(L2, B);
      return { setup: "A 0.2 m wire carries 5 A through a magnetic field B = (0, 0.5, 0) T. The force on it is F = I(L × B).",
        lines: [["L × B", V(L1) + " × " + V(B), V(c1)], ["Force", "5 × " + V(c1), V(mul(I, c1)) + " N"],
                ["Wire along the field", V(L2) + " × " + V(B), V(mul(I, c2)) + " N"]],
        take: "The force is " + sig(len(mul(I, c1))) + " N straight up, at right angles to both wire and field. Along the field it vanishes. Every electric motor turns on this cross product." };
    } },
  { k: "Tech", t: "Shading a triangle in a game",
    build() {
      const u = [2, 0, 0], v = [0, 1, 2], n = cross(u, v), l = [0, 0, 1], b = dot(n, l) / len(n);
      return { setup: "A triangle in a 3D game has edges u = (2, 0, 0) and v = (0, 1, 2) from one corner. The light shines straight down from above, l = (0, 0, 1).",
        lines: [["Normal n = u × v", "(0·2 − 0·1, 0·0 − 2·2, 2·1 − 0·0)", V(n)], ["|n|", sqStr(n), fmt(len(n), 2)],
                ["Brightness", "n · l ÷ |n| = " + sig(dot(n, l)) + " ÷ " + fmt(len(n), 2), pct(b, 0)]],
        take: "The cross product of two edges gives the direction the surface faces. Graphics chips compute billions of these a second to decide how bright each triangle looks." };
    } }
];

CP.NOTES.triple = [
  { k: "Finance", t: "Concrete for a leaning wall",
    build() {
      const u = [6, 0, 0], v = [0, 0.3, 0], w = [0, 0.4, 1.2], c = cross(v, w), vol = dot(u, c), rate = 260;
      return { setup: "A retaining wall leans back. Its edges are u = (6, 0, 0) m along the ground, v = (0, 0.3, 0) m thick, and w = (0, 0.4, 1.2) m up the lean. Concrete costs $260 per m³ delivered.",
        lines: [["v × w", "(0.3·1.2 − 0·0.4, 0·0 − 0·1.2, 0·0.4 − 0.3·0)", V(c)], ["Volume", "u · (v × w) = 6 × " + sig(c[0]), fmt(vol, 2) + " m³"],
                ["Cost", fmt(vol, 2) + " × $260", money(vol * rate)], ["Straight wall", "6 × 0.3 × 1.2", fmt(6 * 0.3 * 1.2, 2) + " m³"]],
        take: "The lean does not change the volume: it equals a straight wall of the same height. The triple product handles the slant without any angles." };
    } },
  { k: "Finance", t: "Three funds that cover only two directions",
    build() {
      const a = [1, 2, 0], b = [0, 1, 1], c = [2, 5, 1], c2 = [2, 5, 3], x = cross(b, c), x2 = cross(b, c2);
      return { setup: "Three funds' exposures to (interest rates, oil, US dollar) are a = (1, 2, 0), b = (0, 1, 1) and c = (2, 5, 1). Can mixing them offset any risk?",
        lines: [["b × c", "(1·1 − 1·5, 1·2 − 0·1, 0·5 − 1·2)", V(x)], ["a · (b × c)", dotStr(a, x), sig(dot(a, x))], ["Why", "2a + b", V(add(mul(2, a), b)) + " = c"],
                ["Swap in c = (2, 5, 3)", "b × c = " + V(x2), "a · (b × c) = " + sig(dot(a, x2))]],
        take: "A zero triple product means the three vectors lie in one plane. Fund c was just 2a + b, so it added nothing new. A non-zero result means the funds can be mixed to offset any risk." };
    } },
  { k: "Finance", t: "Shipping a crate measured at an angle", live: "usdcad",
    build(L) {
      const u = [0.96, 0.72, 0], v = [-0.48, 0.64, 0], w = [0, 0, 0.9], c = cross(v, w), vol = dot(u, c), us = 140, k = L.usdcad;
      return { setup: "A warehouse scanner sees a crate sitting at an angle, with edges u = (0.96, 0.72, 0), v = (−0.48, 0.64, 0), w = (0, 0, 0.9) in metres. A US carrier charges US$140 per m³.",
        lines: [["v × w", "(0.64·0.9 − 0·0, 0·0 − (−0.48)·0.9, 0)", V(c)], ["Volume", dotStr(u, c), fmt(vol, 3) + " m³"],
                ["Cost in US$", fmt(vol, 3) + " × US$140", "US" + money(vol * us)], ["Cost in C$", "US" + money(vol * us) + " × " + fmt(k, 4), money(vol * us * k)]],
        take: "The crate is 1.2 × 0.8 × 0.9 m, and the triple product finds its volume without lining it up with the axes first. The exchange rate then sets the Canadian price." };
    } },
  { k: "Finance", t: "A swapped column gives a negative cost",
    build() {
      const u = [3, 0, 0], v = [1, 2, 0], w = [0, 1, 2], a = cross(v, w), b = cross(w, v), rate = 20;
      return { setup: "A spreadsheet prices storage bins at $20 per m³ a month from their edges u = (3, 0, 0), v = (1, 2, 0), w = (0, 1, 2). Someone swaps the v and w columns.",
        lines: [["v × w", "(2·2 − 0·1, 0·0 − 1·2, 1·1 − 2·0)", V(a)], ["u · (v × w)", "3 × " + sig(a[0]), sig(dot(u, a)) + " m³"],
                ["Swapped: u · (w × v)", "3 × " + P(b[0]), sig(dot(u, b)) + " m³"], ["Monthly cost", "|" + sig(dot(u, b)) + "| × $20", money(Math.abs(dot(u, b)) * rate) + ", not " + money(dot(u, b) * rate)]],
        take: "w × v = −(v × w), so swapping two inputs flips the sign. Take the absolute value of the triple product for a volume, or a swapped column quietly produces a negative bill." };
    } },
  { k: "Science", t: "The density of magnesium",
    build() {
      const u = [0.321, 0, 0], v = [-0.1605, 0.278, 0], w = [0, 0, 0.521], c = cross(v, w), vol = dot(u, c);
      const cm3 = vol * 1e-21, m = 2 * 24.31 / 6.022e23, rho = m / cm3;
      return { setup: "Magnesium repeats a slanted cell with edges u = (0.321, 0, 0), v = (−0.1605, 0.278, 0), w = (0, 0, 0.521) in nanometres. Each cell holds 2 atoms of 24.31 g/mol.",
        lines: [["v × w", "(0.278 × 0.521, 0.1605 × 0.521, 0)", V(c)], ["Cell volume", "0.321 × " + sig(c[0]), fmt(vol, 4) + " nm³ = " + sci(cm3) + " cm³"],
                ["Cell mass", "2 × 24.31 ÷ (6.022 × 10" + sup("23") + ")", sci(m) + " g"], ["Density", "mass ÷ volume", fmt(rho, 2) + " g/cm³"]],
        take: "The cell's sides meet at 120°, so length × width × height does not work, but the triple product does. The result matches magnesium's measured density, about 1.74 g/cm³." };
    } },
  { k: "Tech", t: "Which side of a surface a point is on",
    build() {
      const u = [1, 0, 0], v = [0, 1, 0], n = cross(u, v), p = [0.3, 0.2, 0.5], q = [0.3, 0.2, -0.4], nn = cross(v, u);
      return { setup: "A game tests whether a point is in front of a surface. The surface has edges u = (1, 0, 0) and v = (0, 1, 0). Points sit at p = (0.3, 0.2, 0.5) and q = (0.3, 0.2, −0.4) from its corner.",
        lines: [["u × v", V(u) + " × " + V(v), V(n)], ["Point p", "(u × v) · p", sig(dot(n, p)) + ", in front"], ["Point q", "(u × v) · q", sig(dot(n, q)) + ", behind"],
                ["Order swapped", "(v × u) · p", sig(dot(nn, p)) + ", sign flips"]],
        take: "The sign of the triple product says which side a point is on. Swap the order of the edges and every answer flips, so graphics code must keep a fixed order." };
    } },
  { k: "Tech", t: "Testing a vector rule with i, j and k",
    build() {
      const i = [1, 0, 0], j = [0, 1, 0], ii = cross(i, i), left = cross(ii, j), ij = cross(i, j), right = cross(i, ij);
      return { setup: "Is (u × v) × w always equal to u × (v × w)? Test it with u = i, v = i, w = j, where i = (1, 0, 0) and j = (0, 1, 0).",
        lines: [["i × i", V(i) + " × " + V(i), V(ii)], ["(i × i) × j", V(ii) + " × " + V(j), V(left)], ["i × j", V(i) + " × " + V(j), V(ij) + " = k"],
                ["i × (i × j)", V(i) + " × " + V(ij), V(right)]],
        take: "The two sides differ, so the cross product is not associative and the brackets matter. One failed simple case is enough to reject a rule, which is how engineers test code." };
    } },
  { k: "Home", t: "Are the slab corners in one plane",
    build() {
      const u = [4, 0, 0.08], v = [0, 3, 0.06], w = [4, 3, 0.15], w2 = [4, 3, 0.14], a = cross(v, w), b = cross(v, w2);
      return { setup: "Stakes mark a concrete slab, in metres (east, north, up). From corner A: B is at u = (4, 0, 0.08), D at v = (0, 3, 0.06), C at w = (4, 3, 0.15).",
        lines: [["v × w", "(3·0.15 − 0.06·3, 0.06·4 − 0·0.15, 0·3 − 3·4)", V(a)], ["u · (v × w)", dotStr(u, a), sig(dot(u, a))],
                ["Lower C to 0.14", "v × w = " + V(b), "u · (v × w) = " + sig(dot(u, b))]],
        take: "A non-zero triple product means the four corners are not in one plane, so the slab would twist. Lowering C by 1 cm makes it zero: one flat slab that drains one way." };
    } }
];
})();
