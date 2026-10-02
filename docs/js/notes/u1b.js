/* Worked notes: fraction and negative exponents, slope and rate of change, limits, derivative from first principles. */
(function () {
const { fmt, money, pct, sig, sup } = CP.nh;

CP.NOTES.frac = [
  { k: "Finance", t: "Present value is a negative exponent", live: "bond10",
    build(L) {
      const y = L.bond10 / 100, F = 50000, n = 10, g = Math.pow(1 + y, n), d = 1 / g;
      return { setup: "An inheritance of " + money(F, 0) + " arrives in " + n + " years. Safe money earns the 10-year bond yield, " + fmt(L.bond10) + "% a year. What is it worth today?",
        lines: [["Growth", "(1 + " + sig(y) + ")" + sup(n), fmt(g, 4)],
                ["Flip it", "(1 + " + sig(y) + ")" + sup("-" + n) + " = 1 ÷ " + fmt(g, 4), fmt(d, 4)],
                ["Today", money(F, 0) + " × " + fmt(d, 4), money(F * d, 0)]],
        take: "The minus sign in the exponent means one over: it undoes " + n + " years of growth. The higher the yield, the less a future dollar is worth today." };
    } },
  { k: "Finance", t: "Average yearly return is a root",
    build() {
      const A = 40000, B = 64400, n = 5, f = B / A, r = Math.pow(f, 1 / n);
      return { setup: "A TFSA grew from " + money(A, 0) + " to " + money(B, 0) + " in " + n + " years. What steady yearly return does that work out to?",
        lines: [["Growth factor", money(B, 0) + " ÷ " + money(A, 0), sig(f)],
                ["Fifth root", sig(f) + sup("1/" + n), fmt(r, 4)],
                ["Yearly return", fmt(r, 4) + " − 1", pct(r - 1, 1)],
                ["Dividing instead", pct(f - 1, 0) + " ÷ " + n, pct((f - 1) / n, 1)]],
        take: "Five years of growth multiply, so you undo them with a fifth root, the exponent 1/5. Dividing the total gain by 5 overstates the yearly return." };
    } },
  { k: "Finance", t: "Canadian mortgages compound twice a year",
    build() {
      const r = 0.05, h = 1 + r / 2, m = Math.pow(h, 1 / 6), P = 500000;
      return { setup: "Canadian fixed-rate mortgages are usually compounded twice a year but paid monthly. Find the monthly rate on a " + money(P, 0) + " balance at 5%.",
        lines: [["Half-year factor", "1 + 0.05 ÷ 2", sig(h)],
                ["Monthly factor", sig(h) + sup("1/6"), fmt(m, 6)],
                ["First month's interest", money(P, 0) + " × " + fmt(m - 1, 6), money(P * (m - 1))],
                ["Check one year", fmt(m, 6) + sup("12") + " = " + sig(h) + sup("2"), fmt(h * h, 6)]],
        take: "Six months make a half-year, so the monthly factor is the sixth root: the exponent 1/6. Every Canadian mortgage calculator has this fractional exponent inside it." };
    } },
  { k: "Finance", t: "Monthly rates from yearly ones",
    build() {
      const Y = 0.06, m = Math.pow(1 + Y, 1 / 12), naive = Y / 12, back = Math.pow(1 + naive, 12);
      return { setup: "A fund earns 6% a year. What monthly growth rate gives exactly that over 12 months?",
        lines: [["Monthly factor", "1.06" + sup("1/12"), fmt(m, 5)],
                ["Monthly rate", fmt(m, 5) + " − 1", pct(m - 1, 3)],
                ["Dividing instead", "6% ÷ 12", pct(naive, 3)],
                ["That overshoots", sig(1 + naive) + sup("12") + " − 1", pct(back - 1, 2) + " a year"]],
        take: "Twelve months multiply, so the twelfth root (exponent 1/12) splits a year into months. Dividing by 12 gives a monthly rate that compounds to more than 6%." };
    } },
  { k: "Nature", t: "Kleiber's law",
    build() {
      const big = 400, small = 25, ratio = big / small, root = Math.pow(ratio, 1 / 4), e = Math.pow(root, 3);
      return { setup: "An animal's energy use grows about as mass" + sup("3/4") + ". A " + big + " kg moose is " + sig(ratio) + " times as heavy as a " + small + " kg beaver. How much more energy does it burn?",
        lines: [["Mass ratio", big + " ÷ " + small, sig(ratio)],
                ["Fourth root first", sig(ratio) + sup("1/4"), sig(root)],
                ["Then cube", sig(root) + sup("3"), sig(e) + " times the energy"],
                ["Per kilogram", sig(e) + " ÷ " + sig(ratio), sig(e / ratio)]],
        take: "Root first, then power, keeps the numbers small. The moose burns about " + sig(e) + " times the energy but needs only about half as much per kilogram, so large animals eat less for their size." };
    } },
  { k: "Science", t: "Piano keys are twelfth roots of 2",
    build() {
      const A = 440, s = Math.pow(2, 1 / 12);
      return { setup: "The A above middle C is tuned to " + A + " Hz. Each piano key up multiplies the pitch by the same factor, and 12 keys make an octave: double the pitch.",
        lines: [["One key", "2" + sup("1/12"), fmt(s, 4)],
                ["Up 7 keys (E)", A + " × 2" + sup("7/12"), fmt(A * Math.pow(2, 7 / 12), 2) + " Hz"],
                ["Up 12 keys (A)", A + " × 2" + sup("12/12"), fmt(A * Math.pow(2, 12 / 12), 0) + " Hz"],
                ["Down 12 keys (A)", A + " × 2" + sup("-12/12"), fmt(A * Math.pow(2, -1), 0) + " Hz"]],
        take: "The twelfth root of 2 is the step that, taken 12 times, doubles the pitch. A negative exponent walks down the keyboard: 2⁻¹ halves the pitch." };
    } },
  { k: "Science", t: "Inverse-square laws",
    build() {
      const I = 400, b = d => I * Math.pow(d, -2);
      return { setup: "A bare bulb gives " + I + " lux of light at 1 m. Brightness falls off as distance" + sup("-2") + ". How bright is it nearer and farther away?",
        lines: [["At 2 m", I + " × 2" + sup("-2") + " = " + I + " ÷ 4", fmt(b(2), 0) + " lux"],
                ["At 3 m", I + " × 3" + sup("-2") + " = " + I + " ÷ 9", fmt(b(3), 0) + " lux"],
                ["At 0.5 m", I + " × 0.5" + sup("-2") + " = " + I + " × 4", fmt(b(0.5), 0) + " lux"]],
        take: "A negative exponent means one over, never a negative answer. Twice as far is a quarter as bright; half as far is four times as bright. Gravity follows the same law." };
    } },
  { k: "Science", t: "Radioactive half-life",
    build() {
      const H = 5730, f = t => Math.pow(2, -t / H);
      return { setup: "Carbon-14 halves every " + fmt(H, 0) + " years, so the fraction left after t years is 2" + sup("-t/" + H) + ". How much is left in old wood or bone?",
        lines: [["After " + fmt(2 * H, 0) + " years", "2" + sup("-" + 2 * H + "/" + H) + " = 2" + sup("-2") + " = 1/4", fmt(f(2 * H), 2)],
                ["After " + fmt(H / 2, 0) + " years", "2" + sup("-1/2") + " = 1 ÷ √2", fmt(f(H / 2), 3)],
                ["After 1,000 years", "2" + sup("-1000/" + H), fmt(f(1000), 3)]],
        take: "Measure the fraction of carbon-14 left, solve for t, and you have an age. This is carbon dating, and it works for things up to about 50,000 years old." };
    } }
];

CP.NOTES.slope = [
  { k: "Finance", t: "Your savings rate is a slope",
    build() {
      const a = 4000, b = 7000, x1 = 1, x2 = 7, m = (b - a) / (x2 - x1), goal = 10000, more = (goal - b) / m;
      return { setup: "A savings balance is " + money(a, 0) + " in January (month " + x1 + ") and " + money(b, 0) + " in July (month " + x2 + "). How fast is it growing?",
        lines: [["Rise", money(b, 0) + " − " + money(a, 0), money(b - a, 0)],
                ["Run", x2 + " − " + x1, (x2 - x1) + " months"],
                ["Slope", money(b - a, 0) + " ÷ " + (x2 - x1), money(m, 0) + " a month"],
                ["To reach " + money(goal, 0), "(" + money(goal, 0) + " − " + money(b, 0) + ") ÷ " + money(m, 0), sig(more) + " more months"]],
        take: "Slope answers 'how fast'. It is an average: some months saved more and some less, but the line through the two points rises " + money(m, 0) + " a month." };
    } },
  { k: "Finance", t: "The US dollar's slope this month", live: "usdcad",
    build(L) {
      const a = L.usdcad30, b = L.usdcad, rise = b - a, m = rise / 30, cost = 5000 * rise;
      const dir = rise > 0 ? "rose" : rise < 0 ? "fell" : "held steady";
      return { setup: "A US dollar cost " + money(a, 4) + " thirty days ago and " + money(b, 4) + " now. How fast is it moving, and what does that do to a US$5,000 purchase?",
        lines: [["Rise", fmt(b, 4) + " − " + fmt(a, 4), fmt(rise, 4)],
                ["Run", "today − 30 days ago", "30 days"],
                ["Slope", fmt(rise, 4) + " ÷ 30", fmt(m, 5) + " a day"],
                ["Change on US$5,000", "5,000 × " + fmt(rise, 4), money(cost)]],
        take: "The US dollar " + dir + " by about " + fmt(Math.abs(m) * 100, 3) + " cents a day. A positive slope means US goods got dearer for Canadians; a negative slope means they got cheaper." };
    } },
  { k: "Driving", t: "Road grade signs",
    build() {
      const g = 6, m = g / 100, run = 2500, drop = m * run, ang = Math.atan(m) * 180 / Math.PI;
      return { setup: "A " + g + "% grade sign means the road drops " + g + " m for every 100 m across. A truck follows it for " + sig(run / 1000) + " km.",
        lines: [["Slope", g + " ÷ 100", sig(m)],
                ["Drop", sig(m) + " × " + fmt(run, 0) + " m", fmt(drop, 0) + " m"],
                ["Angle", "the angle whose tangent is " + sig(m), fmt(ang, 1) + "°"]],
        take: "A " + g + "% grade is only about " + fmt(ang, 1) + "°, but over " + sig(run / 1000) + " km it drops " + fmt(drop, 0) + " m, about a " + fmt(drop / 3, 0) + "-storey building. Truck drivers gear down because slope times distance is height lost." };
    } },
  { k: "Sport", t: "Running pace is a slope, flipped",
    build() {
      const d = 10, t = 50, m = d / t;
      return { setup: "A runner finishes a " + d + " km race in " + t + " minutes. On a graph of distance against time, the line runs from (0, 0) to (" + t + ", " + d + ").",
        lines: [["Slope", "(" + d + " − 0) ÷ (" + t + " − 0)", sig(m) + " km per min"],
                ["Per hour", sig(m) + " × 60", sig(m * 60) + " km/h"],
                ["Flip it (pace)", t + " ÷ " + d, sig(t / d) + " min per km"]],
        take: "Runners flip the slope: minutes per kilometre instead of kilometres per minute. Same two points, rise and run swapped, so a smaller pace number means faster." };
    } },
  { k: "Finance", t: "Hourly pay is a slope",
    build() {
      const w = 25, ot = 1.5 * w, p44 = 44 * w, p50 = p44 + 6 * ot;
      return { setup: "You earn " + money(w, 0) + " an hour. Ontario requires at least 1.5 times pay after 44 hours a week. Plot pay against hours: what are the slopes?",
        lines: [["0 to 44 h", "(" + money(p44, 0) + " − $0) ÷ 44", money(w) + " an hour"],
                ["44 to 50 h", "(" + money(p50, 0) + " − " + money(p44, 0) + ") ÷ 6", money(ot) + " an hour"],
                ["0 to 50 h", money(p50, 0) + " ÷ 50", money(p50 / 50) + " an hour"]],
        take: "The pay line bends steeper at 44 hours. The average rate over the whole week, " + money(p50 / 50) + ", is not the wage in either part: it is rise over run across both." };
    } },
  { k: "Weather", t: "Warming through the morning",
    build() {
      const T1 = 8, T2 = 20, h1 = 7, h2 = 13, m = (T2 - T1) / (h2 - h1);
      return { setup: "It is " + T1 + " °C at 7 a.m. and " + T2 + " °C at 1 p.m. How fast is the morning warming?",
        lines: [["Rise", T2 + " − " + T1, (T2 - T1) + " °C"],
                ["Run", "1 p.m. − 7 a.m.", (h2 - h1) + " hours"],
                ["Slope", (T2 - T1) + " ÷ " + (h2 - h1), sig(m) + " °C an hour"],
                ["Estimate 9 a.m.", T1 + " + " + sig(m) + " × 2", sig(T1 + m * 2) + " °C"]],
        take: "The rate is " + sig(m) + " °C an hour. It is not (" + T1 + " + " + T2 + ") ÷ 2 = " + sig((T1 + T2) / 2) + ", which is an average temperature, not a rate. The 9 a.m. estimate assumes steady warming." };
    } },
  { k: "Finance", t: "Paying down a mortgage",
    build() {
      const a = 400000, b = 388000, m = (b - a) / 12, months = b / -m;
      return { setup: "A mortgage balance falls from " + money(a, 0) + " to " + money(b, 0) + " over one year. What is the slope of the balance?",
        lines: [["Change", money(b, 0) + " − " + money(a, 0), money(b - a, 0)],
                ["Run", "12 months", ""],
                ["Slope", money(b - a, 0) + " ÷ 12", money(m, 0) + " a month"],
                ["Straight-line payoff", money(b, 0) + " ÷ " + money(-m, 0), fmt(months, 0) + " months"]],
        take: "The negative slope is good news: the debt is shrinking. The real payoff comes well before " + fmt(months / 12, 0) + " years, because each payment puts more toward the balance as the interest owed falls." };
    } },
  { k: "Home", t: "Roof pitch",
    build() {
      const rise = 6, run = 12, m = rise / run, half = 4.8, h = m * half, raf = Math.hypot(half, h);
      return { setup: "A " + rise + "/" + run + " roof climbs " + rise + " inches for every " + run + " across. The house is " + sig(2 * half) + " m wide, so each side runs " + sig(half) + " m from wall to peak.",
        lines: [["Slope", rise + " ÷ " + run, sig(m)],
                ["Height of peak", sig(m) + " × " + sig(half) + " m", fmt(h, 1) + " m"],
                ["Rafter length", "√(" + sig(half) + "² + " + fmt(h, 1) + "²)", fmt(raf, 2) + " m"]],
        take: "Rise over run has no units, so inches and metres mix freely. Roofers, ramp builders and plumbers all work in slopes: a drain pipe needs a small, steady one." };
    } }
];

CP.NOTES.limits = [
  { k: "Finance", t: "Average cost closes in on the per-item cost",
    build() {
      const F = 30000, v = 4, A = q => F / q + v;
      return { setup: "Printing a book costs " + money(F, 0) + " to set up, plus " + money(v, 0) + " a copy. The average cost per copy is A(q) = (" + F + " + " + v + "q) ÷ q.",
        lines: [["1,000 copies", F + " ÷ 1000 + " + v, money(A(1000))],
                ["10,000 copies", F + " ÷ 10000 + " + v, money(A(10000))],
                ["1,000,000 copies", F + " ÷ 1000000 + " + v, money(A(1000000))],
                ["Limit", "q → ∞: " + v + "q ÷ q", money(v)]],
        take: "Keep only the biggest power on top and bottom: " + v + "q ÷ q = " + v + ". The setup cost per copy shrinks toward zero, which is why big print runs are cheap per book." };
    } },
  { k: "Finance", t: "Continuous compounding is a limit", live: "policy",
    build(L) {
      const r = L.policy / 100, P = 100000;
      const y1 = P * r, mo = P * (Math.pow(1 + r / 12, 12) - 1), d = P * (Math.pow(1 + r / 365, 365) - 1), c = P * (Math.exp(r) - 1);
      const gap = c - d < 1 ? "less than a dollar" : "only " + money(c - d);
      return { setup: money(P, 0) + " earns " + fmt(L.policy) + "% a year, the Bank of Canada policy rate. Compound it more and more often. How much interest does one year bring?",
        lines: [["Once a year", money(P, 0) + " × " + sig(r, 5), money(y1)],
                ["Monthly", money(P, 0) + " × ((1 + " + sig(r, 5) + " ÷ 12)" + sup("12") + " − 1)", money(mo)],
                ["Daily", money(P, 0) + " × ((1 + " + sig(r, 5) + " ÷ 365)" + sup("365") + " − 1)", money(d)],
                ["Limit, n → ∞", money(P, 0) + " × (e" + sup(sig(r, 5)) + " − 1)", money(c)]],
        take: "(1 + r/n)ⁿ closes in on eʳ as n grows. Going from daily to continuous compounding adds " + gap + ": the limit is a ceiling, not a fortune." };
    } },
  { k: "Finance", t: "A perpetuity's value",
    build() {
      const C = 100, r = 0.05, pv = n => C * (1 - Math.pow(1 + r, -n)) / r;
      const row = n => [n + " years", C + "(1 − 1.05" + sup("-" + n) + ") ÷ " + r, money(pv(n))];
      return { setup: "A share pays " + money(C, 0) + " a year forever. At 5%, the first n payments are worth " + C + "(1 − 1.05" + sup("-n") + ") ÷ " + r + " today. Let n grow.",
        lines: [row(10), row(30), row(100),
                ["Limit, n → ∞", "1.05" + sup("-n") + " → 0, so " + C + " ÷ " + r, money(C / r)]],
        take: "Each extra year adds less, so the total closes in on " + money(C / r, 0) + " and never passes it. Some preferred shares that never mature are priced roughly this way." };
    } },
  { k: "Finance", t: "Stretching a mortgage has a floor",
    build() {
      const P = 500000, i = Math.pow(1.025, 1 / 6) - 1, pay = n => P * i / (1 - Math.pow(1 + i, -n)), lim = P * i;
      const row = (yrs, n) => [yrs + " years", "(1 + i)" + sup("-" + n) + " = " + fmt(Math.pow(1 + i, -n), 4), money(pay(n)) + " a month"];
      return { setup: "A " + money(P, 0) + " mortgage at 5% (monthly rate i = " + fmt(i, 6) + ") has payment P·i ÷ (1 − (1 + i)" + sup("-n") + ") over n months. Stretch n longer and longer.",
        lines: [row(25, 300), row(50, 600), row(100, 1200),
                ["Limit, n → ∞", money(P, 0) + " × " + fmt(i, 6), money(lim) + " a month"]],
        take: "As n grows, (1 + i)⁻ⁿ shrinks to 0 and the payment closes in on the interest alone. Doubling 25 years to 50 cuts the payment only " + pct(1 - pay(600) / pay(300), 0) + ", and it can never fall below " + money(lim, 0) + "." };
    } },
  { k: "Health", t: "Drug levels level off",
    build() {
      const D = 100, k = 0.5, a = n => D * (1 - Math.pow(k, n)) / (1 - k);
      return { setup: "In a simple model, a patient takes " + D + " mg every 4 hours, and the body clears half the drug every 4 hours. How high does the level just after a dose climb?",
        lines: [["Dose 1", String(D), fmt(a(1), 0) + " mg"],
                ["Dose 2", D + " + " + k + " × " + D, fmt(a(2), 0) + " mg"],
                ["Dose 5", D + "(1 − " + k + sup("5") + ") ÷ (1 − " + k + ")", fmt(a(5), 2) + " mg"],
                ["Limit", D + " ÷ (1 − " + k + ")", fmt(D / (1 - k), 0) + " mg"]],
        take: "Each dose adds less than the one before, so the level closes in on " + fmt(D / (1 - k), 0) + " mg, where the drug cleared between doses equals one dose. Prescribers choose doses with this limit in mind." };
    } },
  { k: "Sport", t: "Terminal velocity",
    build() {
      const vT = 55, k = 9.8 / vT, v = t => vT * Math.tanh(k * t);
      const row = t => [t + " seconds", vT + " tanh(" + fmt(k * t, 2) + ")", fmt(v(t), 1) + " m/s"];
      return { setup: "A skydiver lying flat falls at v(t) = " + vT + " tanh(" + fmt(k, 3) + "t) m/s, a standard model. The tanh function climbs from 0 toward 1.",
        lines: [row(5), row(10), row(20), ["Limit, t → ∞", vT + " × 1", vT + " m/s"]],
        take: "The speed rises fast, then closes in on about " + vT + " m/s (" + fmt(vT * 3.6, 0) + " km/h) and never passes it. At that speed air resistance balances gravity." };
    } },
  { k: "Nature", t: "Sunflower spirals",
    build() {
      const f = [1, 1]; while (f.length < 12) f.push(f[f.length - 1] + f[f.length - 2]);
      const phi = (1 + Math.sqrt(5)) / 2, row = i => [f[i] + " and " + f[i + 1], f[i + 1] + " ÷ " + f[i], fmt(f[i + 1] / f[i], 4)];
      return { setup: "Sunflower seed heads often show spirals in neighbouring Fibonacci numbers, like 34 and 55. Each Fibonacci number is the sum of the two before it.",
        lines: [row(4), row(6), row(9), ["Limit", "(1 + √5) ÷ 2", fmt(phi, 4)]],
        take: "The ratios close in on the golden ratio, about " + fmt(phi, 3) + ". Plants that place each new seed at the matching angle, about 137.5°, pack the head with almost no gaps." };
    } },
  { k: "Home", t: "Coffee cools to room temperature",
    build() {
      const R = 21, D = 64, k = 0.04, T = t => R + D * Math.exp(-k * t);
      const row = t => [t + " minutes", R + " + " + D + "e" + sup("-" + sig(k * t)), fmt(T(t), 1) + " °C"];
      return { setup: "A mug of coffee at " + (R + D) + " °C sits in a " + R + " °C kitchen. A simple cooling model gives T(t) = " + R + " + " + D + "e" + sup("-" + k + "t") + " after t minutes.",
        lines: [row(10), row(30), row(120), ["Limit, t → ∞", "e" + sup("-" + k + "t") + " → 0", R + " °C"]],
        take: "As t grows the exponential part shrinks to 0, so only the " + R + " is left. The coffee closes in on room temperature but, in the model, never quite reaches it." };
    } }
];

CP.NOTES.firstp = [
  { k: "Finance", t: "Marginal cost is a limit",
    build() {
      const F = 2000, a = 15, b = 0.01, q = 500, C = x => F + a * x + b * x * x, dq = h => (C(q + h) - C(q)) / h, lim = a + 2 * b * q;
      return { setup: "A coffee roaster's weekly cost is C(q) = " + F + " + " + a + "q + " + b + "q² dollars for q kilograms. What does one more kilogram cost at " + q + " kg?",
        lines: [["Expand", "C(" + q + " + h) − C(" + q + ") = " + a + "h + " + b + "(" + 2 * q + "h + h²)", ""],
                ["Divide by h", a + " + " + sig(2 * b * q) + " + " + b + "h", sig(lim) + " + " + b + "h"],
                ["h = 1", sig(lim) + " + " + b, money(dq(1))],
                ["h → 0", sig(lim) + " + 0", money(lim)]],
        take: "That limit, " + money(lim) + " a kilogram, is the marginal cost. With h = 1 the answer is a cent off; letting h shrink to 0 removes the cent and gives the exact rate." };
    } },
  { k: "Driving", t: "Braking distance at 100 km/h",
    build() {
      const v = 100, c = 170, d = x => x * x / c, dq = h => (d(v + h) - d(v)) / h, lim = 2 * v / c;
      return { setup: "On dry pavement, braking distance is about d(v) = v² ÷ " + c + " metres at v km/h. How much does each extra km/h add at " + v + " km/h?",
        lines: [["Expand", "(" + v + " + h)² − " + v + "² = " + 2 * v + "h + h²", ""],
                ["Divide by h", "(" + 2 * v + " + h) ÷ " + c, ""],
                ["h = 10", (2 * v + 10) + " ÷ " + c, fmt(dq(10), 3) + " m per km/h"],
                ["h = 1", (2 * v + 1) + " ÷ " + c, fmt(dq(1), 3) + " m per km/h"],
                ["h → 0", 2 * v + " ÷ " + c, fmt(lim, 3) + " m per km/h"]],
        take: "Near " + v + " km/h each extra km/h adds about " + fmt(lim, 1) + " m of braking. Going 120 instead of 100 adds about " + fmt(d(120) - d(100), 0) + " m, more than 20 × " + fmt(lim, 1) + ", because the rate itself grows with speed." };
    } },
  { k: "Finance", t: "How a bond's price reacts to yield", live: "bond5",
    build(L) {
      const y = L.bond5, P = r => 100 / Math.pow(1 + r / 100, 5), dq = h => (P(y + h) - P(y)) / h, lim = dq(0.0001);
      const row = h => ["h = " + h + " point", "(P(" + sig(y + h, 4) + "%) − P(" + sig(y, 4) + "%)) ÷ " + h, money(dq(h), 3)];
      return { setup: "A 5-year zero-coupon bond pays $100 at the end, so today it costs P(y) = 100 ÷ (1 + y)⁵. The yield is " + fmt(y) + "%. How fast does the price fall as the yield rises?",
        lines: [["Price now", "100 ÷ " + fmt(Math.pow(1 + y / 100, 5), 4), money(P(y), 3)], row(1), row(0.1), row(0.01)],
        take: "The quotients settle at about " + money(lim) + " per percentage point as h shrinks: the derivative. On $1,000,000 of these bonds, a 0.01-point rise costs about " + money(-lim * 100, 0) + ". Traders call that DV01." };
    } },
  { k: "Science", t: "Speed of a ball at exactly 1 second",
    build() {
      const u = 15, g = 4.9, t0 = 1, s = t => u * t - g * t * t, dq = h => (s(t0 + h) - s(t0)) / h, v = u - 2 * g * t0;
      return { setup: "A ball thrown straight up at " + u + " m/s is at height s(t) = " + u + "t − " + g + "t² metres after t seconds. How fast is it rising at exactly " + t0 + " second?",
        lines: [["Difference quotient", "[s(1 + h) − s(1)] ÷ h = " + sig(v) + " − " + g + "h", ""],
                ["h = 0.1", sig(v) + " − " + sig(g * 0.1), sig(dq(0.1)) + " m/s"],
                ["h = 0.01", sig(v) + " − " + sig(g * 0.01), sig(dq(0.01)) + " m/s"],
                ["h → 0", sig(v) + " − 0", sig(v) + " m/s"]],
        take: "At 1 s the ball rises at " + sig(v) + " m/s. The same algebra at t = 2 gives " + sig(u - 2 * g * 2) + " m/s: the minus sign says it is already falling." };
    } },
  { k: "Finance", t: "What a rate rise does to a mortgage payment",
    build() {
      const P = 500000, r = 5, M = x => { const i = Math.pow(1 + x / 200, 1 / 6) - 1; return P * i / (1 - Math.pow(1 + i, -300)); };
      const dq = h => (M(r + h) - M(r)) / h, lim = dq(0.0001);
      const row = h => ["h = " + h + " point", "(M(" + sig(r + h) + "%) − M(" + r + "%)) ÷ " + h, money(dq(h))];
      return { setup: "A " + money(P, 0) + " mortgage over 25 years at " + r + "% (compounded twice a year) has a monthly payment M(" + r + "%). How fast does the payment rise with the rate?",
        lines: [["M(" + r + "%)", "monthly payment", money(M(r))], row(1), row(0.1), row(0.01)],
        take: "The quotients settle near " + money(lim, 0) + " a month per percentage point: the derivative at " + r + "%. So a quarter-point rise at renewal adds about " + money(lim / 4, 0) + " a month." };
    } },
  { k: "Sport", t: "Shot speed from video",
    build() {
      const a = 30, b = 0.5, t0 = 0.5, x = t => a * t - b * t * t, dq = h => (x(t0 + h) - x(t0)) / h, v = a - 2 * b * t0;
      return { setup: "A puck slides x(t) = " + a + "t − " + b + "t² metres in t seconds; the ice slows it a little. TV cameras film 60 frames a second. How fast is it going at t = " + t0 + " s?",
        lines: [["Difference quotient", "[x(" + t0 + " + h) − x(" + t0 + ")] ÷ h = " + sig(v) + " − " + b + "h", ""],
                ["One frame, h = 1/60 s", sig(v) + " − " + b + " ÷ 60", fmt(dq(1 / 60), 4) + " m/s"],
                ["h = 1/1000 s", sig(v) + " − " + b + " ÷ 1000", fmt(dq(1 / 1000), 4) + " m/s"],
                ["h → 0", sig(v) + " − 0", sig(v) + " m/s ≈ " + fmt(v * 3.6, 0) + " km/h"]],
        take: "One frame is already a tiny h, so the camera's estimate is within " + fmt(v - dq(1 / 60), 3) + " m/s of the limit. The limit is the puck's speed at that exact instant." };
    } },
  { k: "Finance", t: "How fast savings grow at one moment", live: "bond10",
    build(L) {
      const y = L.bond10 / 100, P = 10000, B = t => P * Math.pow(1 + y, t), dq = h => (B(10 + h) - B(10)) / h, lim = dq(0.0001);
      const row = h => ["h = " + h + " year", "(B(" + sig(10 + h) + ") − B(10)) ÷ " + h, money(dq(h)) + " a year"];
      return { setup: money(P, 0) + " grows at the 10-year bond yield, " + fmt(L.bond10) + "% a year: B(t) = 10,000(1 + " + sig(y) + ")ᵗ. How fast is it growing at exactly 10 years?",
        lines: [["B(10)", "10,000 × " + fmt(Math.pow(1 + y, 10), 4), money(B(10))], row(1), row(0.1), row(0.01)],
        take: "The quotients settle near " + money(lim) + " a year: the derivative. A one-year window overstates it, because the balance keeps speeding up inside that year." };
    } },
  { k: "Health", t: "How fast a drug is cleared",
    build() {
      const D = 400, H = 4, A = t => D * Math.pow(0.5, t / H), dq = h => (A(H + h) - A(H)) / h, lim = dq(0.0001);
      const row = h => ["h = " + h + " hour", "(A(" + sig(H + h) + ") − A(" + H + ")) ÷ " + h, fmt(dq(h), 2) + " mg/h"];
      return { setup: "A " + D + " mg dose of a drug with a " + H + "-hour half-life leaves A(t) = " + D + " × 0.5" + sup("t/" + H) + " mg in the body. How fast is it being cleared at exactly " + H + " hours?",
        lines: [["A(" + H + ")", D + " × 0.5" + sup("1"), fmt(A(H), 0) + " mg"], row(1), row(0.1), row(0.01)],
        take: "The quotients settle near " + fmt(lim, 1) + " mg/h; the minus sign means the amount is falling. Clearing is fastest right after a dose, when there is the most drug in the body." };
    } }
];
})();
