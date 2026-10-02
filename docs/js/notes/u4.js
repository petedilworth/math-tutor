/* Worked notes: reading derivatives from graphs, maximums and minimums, concavity, sketching from derivatives. */
(function () {
const { fmt, money, pct, sig, sup } = CP.nh;
CP.NOTES.graphs = [
  { k: "Finance", t: "Reading a stock chart's slope",
    build() {
      const P = t => t * t * t - 12 * t * t + 36 * t + 40;
      return { setup: "A share price follows P(t) = t³ − 12t² + 36t + 40 dollars over 8 months. On the chart it climbs, dips, then climbs again. When is it falling?",
        lines: [["Slope", "P′(t) = 3t² − 24t + 36", ""], ["Factor", "3(t − 2)(t − 6) = 0", "t = 2, t = 6"],
                ["Signs", "P′ is negative only between 2 and 6", "falling, months 2 to 6"], ["Turning points", "P(2) and P(6)", money(P(2), 0) + " high, " + money(P(6), 0) + " low"]],
        take: "The price falls from month 2 to month 6, exactly where P′ is below the axis. The peaks and dips of a chart are the zeros of its slope." };
    } },
  { k: "Driving", t: "Speed is the slope of distance",
    build() {
      const a = 14, b = 0.65, T = 10, v0 = a, v1 = a + 2 * b * T, d = a * T + b * T * T;
      return { setup: "Merging onto the 401, a car covers d(t) = " + a + "t + " + sig(b) + "t² metres in t seconds. The graph gets steeper every second.",
        lines: [["Slope", "d′(t) = " + a + " + " + sig(2 * b) + "t", ""], ["At the start", "d′(0) = " + v0 + " m/s × 3.6", fmt(v0 * 3.6, 0) + " km/h"],
                ["After " + T + " s", "d′(" + T + ") = " + sig(v1) + " m/s × 3.6", fmt(v1 * 3.6, 0) + " km/h"], ["Distance used", "d(" + T + ") = " + a * T + " + " + sig(b * T * T), fmt(d, 0) + " m"]],
        take: "Steeper distance graph means a higher speedometer reading. Here d′ is a rising straight line: the car gains the same speed every second." };
    } },
  { k: "Finance", t: "Spotting a slowdown in revenue",
    build() {
      const R1 = t => 60 - 6 * t;
      return { setup: "A company's revenue is R(t) = 500 + 60t − 3t² thousand dollars a quarter, t quarters from now. The graph still rises. Is it slowing?",
        lines: [["Slope", "R′(t) = 60 − 6t", ""], ["Quarter 1", "R′(1) = 60 − 6", money(R1(1), 0) + "k per quarter"],
                ["Quarter 6", "R′(6) = 60 − 36", money(R1(6), 0) + "k per quarter"], ["Slope hits zero", "60 − 6t = 0", "t = " + sig(60 / 6)]],
        take: "Revenue still rises in quarter 6, but at less than half the earlier pace. The falling slope is the warning sign, long before the graph itself turns down." };
    } },
  { k: "Weather", t: "Daylight changes fastest at the equinox",
    build() {
      const D = t => 12.2 + 3.2 * Math.sin(2 * Math.PI * (t - 80) / 365);
      const eq = (D(81) - D(80)) * 60, so = (D(172) - D(171)) * 60;
      return { setup: "A model of Toronto's day length is D(t) = 12.2 + 3.2 sin(2π(t − 80) ÷ 365) hours on day t of the year. Day 80 is about March 21.",
        lines: [["Longest, shortest", "12.2 ± 3.2", fmt(12.2 + 3.2, 1) + " h, " + fmt(12.2 - 3.2, 1) + " h"], ["Slope, late March", "D(81) − D(80), in minutes", fmt(eq, 1) + " min a day"],
                ["Slope, June 20", "D(172) − D(171), in minutes", fmt(so, 2) + " min a day"]],
        take: "The day-length graph is steepest at the equinox and flat at the solstice. So the days grow by about 3 minutes a day in March, and barely change in late June." };
    } },
  { k: "Health", t: "Fever charts",
    build() {
      const T1 = h => 0.6 - 0.1 * h, hp = 0.6 / 0.1, Tp = 37 + 0.6 * hp - 0.05 * hp * hp;
      return { setup: "A child's temperature is charted every hour. It fits T(h) = 37 + 0.6h − 0.05h² °C, h hours after it starts to rise.",
        lines: [["Slope", "T′(h) = 0.6 − 0.1h", ""], ["Hour 2", "T′(2)", sig(T1(2)) + " °C per hour"], ["Hour 4", "T′(4)", sig(T1(4)) + " °C per hour"],
                ["Peak", "T′ = 0 at h = " + sig(hp), fmt(Tp, 1) + " °C"]],
        take: "The temperature is still rising at hour 4, but the slope has halved. A flattening curve tells the nurse the peak is near, here at hour 6." };
    } },
  { k: "Finance", t: "Housing prices and their rate",
    build() {
      const P = t => 600 + 90 * t - 15 * t * t, P1 = t => 90 - 30 * t;
      return { setup: "Average prices in one town follow P(t) = 600 + 90t − 15t² thousand dollars, t years from now. Headlines report the yearly change, P′.",
        lines: [["Slope", "P′(t) = 90 − 30t", ""], ["Year 1", "P′(1)", money(P1(1), 0) + "k a year"], ["Year 3", "P′(3) = 0, a flat top", "P(3) = " + money(P(3), 0) + "k"],
                ["Year 4", "P′(4)", money(P1(4), 0) + "k a year"]],
        take: "\"Prices up $60k\" and \"prices down $30k\" are readings of P′. The peak of the price graph is where P′ crosses zero, so headlines usually report the derivative." };
    } },
  { k: "Sport", t: "Elevation profiles on a race map",
    build() {
      const h = x => 2 * x * x * x - 21 * x * x + 60 * x + 100, h1 = x => 6 * x * x - 42 * x + 60;
      return { setup: "A trail race's elevation is h(x) = 2x³ − 21x² + 60x + 100 metres, x km from the start. Runners feel the slope as the grade.",
        lines: [["Slope", "h′(x) = 6x² − 42x + 60 = 6(x − 2)(x − 5)", ""], ["Climb", "h′ > 0 from km 0 to 2", "top at " + fmt(h(2), 0) + " m"],
                ["Descent", "h′ < 0 from km 2 to 5", "bottom at " + fmt(h(5), 0) + " m"], ["Grade at the start", h1(0) + " m per 1,000 m", pct(h1(0) / 1000, 0)]],
        take: "The map's elevation graph is h, and the grade is h′. The hilltop and the valley are where h′ = 0, and the steepest climb is where h′ is largest." };
    } },
  { k: "Finance", t: "The slope of a savings graph is interest", live: "policy",
    build(L) {
      const r = L.policy / 100, P = 20000, end = P * (1 + r), slope = (end - P) / 12;
      return { setup: money(P, 0) + " earns simple interest at the policy rate, " + fmt(L.policy) + "% a year. Its graph against months is a straight line.",
        lines: [["Two points", "(0, " + money(P, 0) + ") and (12, " + money(end) + ")", ""], ["Rise", money(end) + " − " + money(P, 0), money(end - P)],
                ["Slope", money(end - P) + " ÷ 12 months", money(slope) + " a month"], ["Graph of f′", "flat line at height", money(slope)]],
        take: "A straight-line graph has the same slope everywhere, so its derivative graph is a flat line. Its height is the interest you earn each month." };
    } }
];
CP.NOTES.maxmin = [
  { k: "Finance", t: "The best price",
    build() {
      const c = 8, a = 1000, b = 40, p = (a / b + c) / 2, q = a - b * p;
      return { setup: "A product costs $8 to make. At price p, " + a + " − " + b + "p sell a week, so no one buys at $25. Profit is P(p) = (p − 8)(1000 − 40p).",
        lines: [["Expand", "P(p) = −40p² + 1320p − 8000", ""], ["Set P′ = 0", "−80p + 1320 = 0", "p = " + money(p)],
                ["Check", "P″(p) = −80 < 0", "a maximum"], ["Profit", money(p - c) + " × " + fmt(q, 0) + " sold", money((p - c) * q, 0) + " a week"]],
        take: "The best price, $16.50, sits exactly halfway between the $8 cost and the $25 where sales stop. Setting the derivative to zero finds it." };
    } },
  { k: "Sport", t: "The top of a punt",
    build() {
      const v = 20, g = 4.9, t = v / (2 * g), h = 1 + v * t - g * t * t;
      return { setup: "A CFL punt leaves the foot 1 m up, rising at 20 m/s. Its height is h(t) = 1 + 20t − 4.9t² metres after t seconds.",
        lines: [["Set h′ = 0", "20 − 9.8t = 0", "t = " + fmt(t, 2) + " s"], ["Check", "h″(t) = −9.8 < 0", "a maximum"],
                ["Peak height", "h(" + fmt(t, 2) + ")", fmt(h, 1) + " m"], ["Hang time", "about twice the rise", "about " + fmt(2 * t, 1) + " s"]],
        take: "The ball is highest when its vertical speed, h′, is zero. A returner judges the catch from that peak and the hang time of about 4 seconds." };
    } },
  { k: "Finance", t: "How much stock to order", live: "policy",
    build(L) {
      const D = 2400, S = 60, r = L.policy / 100 + 0.02, H = 6 + 200 * r, q = Math.sqrt(2 * D * S / H), C = D * S / q + H * q / 2;
      return { setup: "A shop sells 2,400 units a year. Each order costs $60. Holding one $200 unit costs $6 a year plus interest at the policy rate + 2% (" + pct(r) + ").",
        lines: [["Holding cost", "$6 + $200 × " + pct(r), money(H) + " a unit"], ["Total cost", "C(q) = " + fmt(D * S, 0) + "/q + " + sig(H / 2) + "q", ""],
                ["Set C′ = 0", "q² = " + fmt(D * S, 0) + " ÷ " + sig(H / 2), "q ≈ " + fmt(q, 0)], ["Check", "C″ = " + fmt(2 * D * S, 0) + "/q³ > 0", "a minimum"],
                ["Yearly cost", "C(" + fmt(q, 0) + ")", money(C, 0)]],
        take: "Ordering often costs fees; ordering a lot ties up money. The best batch is where the two rates of change cancel. When interest rates rise, the best batch gets smaller." };
    } },
  { k: "Home", t: "A rain gutter",
    build() {
      const W = 30, x = W / 4, A = x * (W - 2 * x);
      return { setup: "Fold up both edges of a 30 cm strip of metal by x cm to make a gutter. Its cross-section is A(x) = x(30 − 2x) cm². Which fold holds the most water?",
        lines: [["Expand", "A(x) = 30x − 2x²", ""], ["Set A′ = 0", "30 − 4x = 0", "x = " + sig(x) + " cm"], ["Check", "A″(x) = −4 < 0", "a maximum"],
                ["Area", sig(x) + " × " + sig(W - 2 * x), sig(A) + " cm²"]],
        take: "The best gutter has a base twice as wide as each side. A deeper or shallower fold carries less water in a heavy rain." };
    } },
  { k: "Finance", t: "Group discounts have a sweet spot",
    build() {
      const n = 40, price = 400 - 5 * n;
      return { setup: "A bus tour charges $300 each for 20 people, and $5 less per person for each person over 20. Revenue is R(n) = n(400 − 5n).",
        lines: [["Expand", "R(n) = 400n − 5n²", ""], ["Set R′ = 0", "400 − 10n = 0", "n = " + n], ["Check", "R″(n) = −10 < 0", "a maximum"],
                ["Revenue", n + " × " + money(price, 0), money(n * price, 0)]],
        take: "Past 40 people, each new rider costs more in discounts than they pay. The derivative tells the company where to stop selling seats at a discount." };
    } },
  { k: "Driving", t: "Best fuel economy",
    build() {
      const a = 0.0012, b = 0.17, c = 12, v = b / (2 * a), F = t => a * t * t - b * t + c;
      return { setup: "A model for one compact car: fuel use F(v) = 0.0012v² − 0.17v + 12 litres per 100 km at a steady v km/h.",
        lines: [["Set F′ = 0", "0.0024v − 0.17 = 0", "v ≈ " + fmt(v, 0) + " km/h"], ["Check", "F″(v) = 0.0024 > 0", "a minimum"],
                ["At the best speed", "F(" + fmt(v, 1) + ")", fmt(F(v), 1) + " L/100 km"], ["At 110 km/h", "F(110)", fmt(F(110), 1) + " L/100 km"]],
        take: "Slow driving wastes engine time; fast driving fights air drag. The minimum is where the two effects balance, around 70 km/h for this car." };
    } },
  { k: "Science", t: "Getting the most power from a battery",
    build() {
      const E = 12, r = 0.5, I = E / (2 * r), P = E * I - r * I * I;
      return { setup: "A 12 V battery has 0.5 Ω of resistance inside it. At current I amps, the power reaching the device is P(I) = 12I − 0.5I² watts.",
        lines: [["Set P′ = 0", "12 − I = 0", "I = " + I + " A"], ["Check", "P″(I) = −1 < 0", "a maximum"], ["Power", "12(12) − 0.5(12)²", P + " W"],
                ["Device resistance", "12 ÷ 12 − 0.5", sig(E / I - r) + " Ω"]],
        take: "Power peaks when the device's resistance equals the battery's own. Engineers call this the maximum power transfer rule, and it comes straight from P′ = 0." };
    } },
  { k: "Finance", t: "Tax revenue has a peak",
    build() {
      const t = 1 / Math.sqrt(3), R = 500 * t * (1 - t * t);
      return { setup: "In a simple model, income people report shrinks as the tax rate t rises: 500(1 − t²) billion dollars. Revenue is R(t) = 500t(1 − t²).",
        lines: [["Expand", "R(t) = 500t − 500t³", ""], ["Set R′ = 0", "500 − 1500t² = 0, t² = 1/3", "t ≈ " + pct(t, 1)],
                ["Check", "R″(t) = −3000t < 0", "a maximum"], ["Revenue", "R(" + fmt(t, 3) + ")", "$" + fmt(R, 0) + " billion"]],
        take: "At 0% and 100% the government collects nothing, so revenue must peak in between. Real estimates of where vary widely; the method is the same." };
    } }
];
CP.NOTES.concav = [
  { k: "Finance", t: "Diminishing returns on advertising",
    build() {
      const S1 = x => 20 / Math.sqrt(x), S2 = x => -10 / Math.pow(x, 1.5);
      return { setup: "Spending x thousand dollars on ads brings sales of S(x) = 40√x thousand dollars. Does each extra $1,000 still pay the same?",
        lines: [["Slope", "S′(x) = 20 ÷ √x", ""], ["Bend", "S″(x) = −10 ÷ x√x", "negative: concave down"], ["At $25k", "S′(25) = 20 ÷ 5", money(S1(25) * 1000, 0) + " per $1,000"],
                ["At $100k", "S′(100) = 20 ÷ 10", money(S1(100) * 1000, 0) + " per $1,000"], ["S″(25)", "−10 ÷ 125", sig(S2(25))]],
        take: "Each extra $1,000 still brings sales, but fewer than the last. A negative second derivative is the shape of diminishing returns." };
    } },
  { k: "Health", t: "Blood sugar after a meal",
    build() {
      const G = t => 5 + 6 * t * t - 4 * t * t * t, G1 = t => 12 * t - 12 * t * t;
      return { setup: "A model for one healthy adult: blood sugar is G(t) = 5 + 6t² − 4t³ mmol/L, t hours after a meal. When is it rising fastest?",
        lines: [["Slope", "G′(t) = 12t − 12t²", ""], ["Bend", "G″(t) = 12 − 24t", ""], ["Inflection", "12 − 24t = 0", "t = 0.5 h"],
                ["Fastest rise", "G′(0.5) = 6 − 3", sig(G1(0.5)) + " mmol/L per hour"], ["Peak", "G′ = 0 at t = 1", "G(1) = " + sig(G(1)) + " mmol/L"]],
        take: "Before 30 minutes the curve bends up; after, it bends down. The inflection point is when the rise is fastest, half an hour before the peak." };
    } },
  { k: "Finance", t: "Bond convexity", live: "bond5",
    build(L) {
      const y = L.bond5 / 100, P = x => 1000 / Math.pow(1 + x, 5), p0 = P(y), up = P(y - 0.005) - p0, dn = p0 - P(y + 0.005);
      return { setup: "A 5-year zero-coupon bond pays $1,000 at the end. At yield y its price is P(y) = 1000 ÷ (1 + y)⁵. Today's 5-year yield is " + fmt(L.bond5) + "%.",
        lines: [["Price today", "1000 ÷ " + fmt(1 + y, 4) + sup(5), money(p0)], ["Yield falls 0.5%", "P(" + pct(y - 0.005) + ") − P(" + pct(y) + ")", "gain " + money(up)],
                ["Yield rises 0.5%", "P(" + pct(y) + ") − P(" + pct(y + 0.005) + ")", "loss " + money(dn)], ["Bend", "P″(y) = 30,000 ÷ (1 + y)⁷ > 0", "concave up"]],
        take: "The price curve is concave up, so a drop in yield gains more than the same rise loses: here " + money(up - dn) + " more. Traders call this convexity." };
    } },
  { k: "Tech", t: "Adoption S-curves",
    build() {
      const A = t => 0.75 * t * t - 0.025 * t * t * t, A1 = t => 1.5 * t - 0.075 * t * t;
      return { setup: "A model: the share of homes with a new technology is A(t) = 0.75t² − 0.025t³ percent, t years after launch, for 20 years.",
        lines: [["Slope", "A′(t) = 1.5t − 0.075t²", ""], ["Bend", "A″(t) = 1.5 − 0.15t", ""], ["Inflection", "1.5 − 0.15t = 0", "t = 10 years"],
                ["Share then", "A(10) = 75 − 25", sig(A(10)) + "%"], ["Fastest spread", "A′(10) = 15 − 7.5", sig(A1(10)) + " points a year"]],
        take: "Adoption bends up for 10 years, then bends down as the market fills. The inflection, at half of all homes, is when it spreads fastest." };
    } },
  { k: "Finance", t: "Compound interest bends upward",
    build() {
      const P = 10000, B = t => P * Math.pow(1.06, t), g = t => B(t) - B(t - 1);
      return { setup: money(P, 0) + " grows at 6% a year. Look at how much the balance gains each year: that is the slope of its graph.",
        lines: [["Year 1", money(P, 0) + " × 0.06", money(g(1))], ["Year 11", "B(11) − B(10)", money(g(11))], ["Year 21", "B(21) − B(20)", money(g(21))],
                ["Slope keeps rising", money(g(21)) + " − " + money(g(1)), "+" + money(g(21) - g(1))]],
        take: "A slope that keeps increasing means the graph is concave up. The balance bends upward faster each year, which is why starting early beats saving more later." };
    } },
  { k: "Sport", t: "A sprinter's first seconds",
    build() {
      const a = 3.84, b = 0.32, t = a / (2 * b), d = a / 2 * t * t - b / 3 * t * t * t, v = a * t - b * t * t;
      return { setup: "A model of an elite 100 m sprinter: distance is d(t) = 1.92t² − 0.1067t³ metres after t seconds.",
        lines: [["Speed", "d′(t) = 3.84t − 0.32t²", ""], ["Bend", "d″(t) = 3.84 − 0.64t", ""], ["Bend ends", "3.84 − 0.64t = 0", "t = " + sig(t) + " s"],
                ["Top speed", "d′(6) = 23.04 − 11.52", fmt(v, 2) + " m/s (" + fmt(v * 3.6, 1) + " km/h)"], ["Distance by then", "d(6)", fmt(d, 0) + " m"]],
        take: "While d″ > 0 the graph bends up: the runner is still speeding up. Coaches study where the bend ends, here about halfway down the track." };
    } },
  { k: "Finance", t: "Why people buy insurance",
    build() {
      const W = 100000, loss = 75000, p = 0.01, U = Math.sqrt, EU = (1 - p) * U(W) + p * U(W - loss), CE = Math.round(EU * EU);
      return { setup: "Say the value of money to you is U(w) = √w, which is concave down. You have " + money(W, 0) + " and a 1% chance of a " + money(loss, 0) + " loss.",
        lines: [["Bend", "U″(w) = −¼w" + sup("−3/2") + " < 0", "concave down"], ["Average loss", "1% × " + money(loss, 0), money(p * loss, 0)],
                ["Average value", "0.99√" + fmt(W, 0) + " + 0.01√" + fmt(W - loss, 0), fmt(EU, 3)], ["Same value, for sure", fmt(EU, 3) + "²", money(CE, 0)],
                ["Most you'd pay", money(W, 0) + " − " + money(CE, 0), money(W - CE, 0)]],
        take: "Because U bends down, a big loss hurts more than an equal gain helps. You would pay up to " + money(W - CE, 0) + " to avoid an average loss of " + money(p * loss, 0) + ", so insurance can be rational." };
    } },
  { k: "Driving", t: "Braking shows up as a bend",
    build() {
      const v = 25, a = 5, T = v / a, D = v * T - a / 2 * T * T;
      return { setup: "A car at 25 m/s (90 km/h) brakes at 5 m/s². Its distance is d(t) = 25t − 2.5t² metres until it stops.",
        lines: [["Speed", "d′(t) = 25 − 5t", ""], ["Bend", "d″(t) = −5 < 0", "concave down"], ["Stops", "25 − 5t = 0", "t = " + sig(T) + " s"],
                ["Stopping distance", "d(5) = 125 − 62.5", sig(D) + " m"]],
        take: "Concave down on a distance graph means the speed is falling. The curve flattens into a level line at " + sig(D) + " m: the car has stopped." };
    } }
];
CP.NOTES.sketch = [
  { k: "Finance", t: "Cash flow and the bank balance",
    build() {
      const B = t => 20 + 12 * t - 1.5 * t * t, z = (12 + Math.sqrt(144 + 4 * 1.5 * 20)) / 3;
      return { setup: "A start-up's bank balance is B(t) = 20 + 12t − 1.5t² thousand dollars, t months from now. Sketch it before the money runs out.",
        lines: [["Slope", "B′(t) = 12 − 3t", "zero at t = 4"], ["Rising, then falling", "B′ > 0 before 4, < 0 after", "peak B(4) = " + money(B(4), 0) + "k"],
                ["Bend", "B″(t) = −3", "concave down"], ["Start", "B(0)", money(B(0), 0) + "k"], ["Runs out", "1.5t² − 12t − 20 = 0", "t ≈ " + fmt(z, 1) + " months"]],
        take: "The sketch is a frown: up from $20k to a $44k peak at month 4, then down through zero near month 9. Cash flow turning negative marks the top." };
    } },
  { k: "Health", t: "Epidemic curves",
    build() {
      const C = t => 30 * t * t - 2 / 3 * t * t * t, N = t => 60 * t - 2 * t * t;
      return { setup: "Total cases in an outbreak follow C(t) = 30t² − ⅔t³, t days in, for 30 days. New cases per day are C′(t).",
        lines: [["New cases", "C′(t) = 60t − 2t² = 2t(30 − t)", "zero at 0 and 30"], ["Bend", "C″(t) = 60 − 4t", "zero at t = 15"],
                ["Inflection", "C(15), with C′(15) = " + fmt(N(15), 0) + " a day", fmt(C(15), 0) + " cases"], ["End", "C(30)", fmt(C(30), 0) + " cases"]],
        take: "The total starts flat, bends up until day 15, then bends down and levels off at 9,000. The inflection, at half the final total, is when new cases peak." };
    } },
  { k: "Finance", t: "Export sales in Canadian dollars", live: "usdcad",
    build(L) {
      const k = L.usdcad;
      return { setup: "An Ontario winery sells in the US over a 12-week season. Total sales are S(t) = 12t² − ⅔t³ thousand US dollars, at " + fmt(k, 4) + " CAD per US dollar today.",
        lines: [["Slope", "S′(t) = 24t − 2t² = 2t(12 − t)", "zero at 0 and 12"], ["Bend", "S″(t) = 24 − 4t", "inflection at t = 6"],
                ["Fastest week", "S′(6) = 72 × " + fmt(k, 4), money(72 * k * 1000, 0) + " CAD a week"], ["Season total", "S(12) = 576 × " + fmt(k, 4), money(576 * k * 1000, 0) + " CAD"]],
        take: "The exchange rate stretches the sketch up or down, but the flat points and the inflection stay at weeks 0, 6 and 12. Only the heights change." };
    } },
  { k: "Sport", t: "Velocity tells you the top of a jump",
    build() {
      const v = 3.1, g = 4.9, tp = v / (2 * g), h = v * tp - g * tp * tp;
      return { setup: "A force plate shows a player leaves the floor at 3.1 m/s. Height is h(t) = 3.1t − 4.9t² metres after t seconds.",
        lines: [["Velocity", "h′(t) = 3.1 − 9.8t", "zero at " + fmt(tp, 3) + " s"], ["Bend", "h″(t) = −9.8", "concave down"],
                ["Top", "h(" + fmt(tp, 3) + ")", fmt(h * 100, 0) + " cm"], ["Lands", "3.1t − 4.9t² = 0", "t = " + fmt(2 * tp, 2) + " s"]],
        take: "The sketch is a frown from the floor to a " + fmt(h * 100, 0) + " cm peak and back. The top is exactly where velocity crosses zero, so the take-off speed alone gives the jump height." };
    } },
  { k: "Finance", t: "Many curves fit the same derivative",
    build() {
      const A = t => 500 * t + 25 * t * t, B = t => 10000 + A(t);
      return { setup: "Two savers both deposit 500 + 50t dollars in month t, so their balances share the derivative. One starts at $0, the other at $10,000.",
        lines: [["Balances", "A(t) = 500t + 25t², B(t) = 10,000 + 500t + 25t²", ""], ["Same slope", "A′(t) = B′(t) = 500 + 50t", "always rising"],
                ["Same bend", "A″(t) = B″(t) = 50", "concave up"], ["After 24 months", "A(24) and B(24)", money(A(24), 0) + " and " + money(B(24), 0)]],
        take: "From the deposits alone you can sketch the shape, but not the height. The two curves are the same smile, one $10,000 above the other: the + C." };
    } },
  { k: "Science", t: "Water in a reservoir",
    build() {
      const V = t => 500 + 3 * t * t - 0.1 * t * t * t;
      return { setup: "In spring melt, a reservoir holds V(t) = 500 + 3t² − 0.1t³ thousand m³ of water, t days from now.",
        lines: [["Net flow", "V′(t) = 6t − 0.3t² = 0.3t(20 − t)", "zero at 0 and 20"], ["Bend", "V″(t) = 6 − 0.6t", "zero at t = 10"],
                ["Filling fastest", "V(10)", fmt(V(10), 0) + " thousand m³"], ["Fullest", "V(20)", fmt(V(20), 0) + " thousand m³"]],
        take: "The sketch rises, bending up until day 10, then bending down to a peak at day 20. After that, outflow beats inflow and the level falls." };
    } },
  { k: "Finance", t: "Second-derivative headlines",
    build() {
      const P = t => 100 + 6 * t - 0.75 * t * t, P1 = t => 6 - 1.5 * t;
      return { setup: "A price index starts at 100 and follows P(t) = 100 + 6t − 0.75t², t years from now. The news says \"inflation is falling\".",
        lines: [["Inflation", "P′(t) = 6 − 1.5t", ""], ["Now and in 2 years", "P′(0), P′(2)", sig(P1(0)) + " and " + sig(P1(2)) + " points a year"],
                ["Bend", "P″(t) = −1.5", "concave down"], ["Prices in 2 years", "P(2)", sig(P(2))]],
        take: "Inflation falling means P′ is shrinking, not that prices drop. The sketch still climbs from 100 to 109; it just bends down." };
    } },
  { k: "Driving", t: "The crest of a hill on a road",
    build() {
      const y = x => 0.04 * x - 0.0001 * x * x;
      return { setup: "A road crest climbs at a 4% grade and drops at 4%. Its profile is y(x) = 0.04x − 0.0001x² metres, x metres along, for 400 m.",
        lines: [["Grade", "y′(x) = 0.04 − 0.0002x", "zero at x = 200"], ["Bend", "y″(x) = −0.0002", "concave down"], ["Top", "y(200)", fmt(y(200), 0) + " m"],
                ["Ends", "y′(0), y′(400)", pct(0.04, 0) + ", " + pct(0.04 - 0.0002 * 400, 0)]],
        take: "The sketch is a gentle frown, 4 m high over 400 m. Engineers use this kind of curve because the grade changes at a steady rate, so drivers can see over the top." };
    } }
];
})();
