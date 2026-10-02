/* Worked notes: sine, cosine and eˣ; ln x and eˣ; exponential rates of change; motion; optimization. */
(function () {
const { fmt, money, pct, sig, sup } = CP.nh;
const e = s => "e" + sup(s);

CP.NOTES.trigexp = [
  { k: "Weather", t: "Toronto's daylight",
    build() {
      const A = 3.2, w = 2 * Math.PI / 365, rate = d => A * w * Math.cos(w * (d - 80));
      return { setup: "Toronto's day length is about D(t) = 12.2 + 3.2 sin(2π(t − 80) ÷ 365) hours, where t is the day of the year.",
        lines: [["Derivative", "D′(t) = 3.2 × (2π ÷ 365) × cos(2π(t − 80) ÷ 365)", ""],
                ["March 21 (day 80)", "3.2 × 2π ÷ 365 × cos 0", fmt(rate(80), 4) + " h/day"],
                ["In minutes", fmt(rate(80), 4) + " × 60", fmt(rate(80) * 60, 1) + " min/day"],
                ["June 21 (day 172)", "3.2 × 2π ÷ 365 × cos(2π × 92 ÷ 365)", fmt(rate(172) * 60, 2) + " min/day"]],
        take: "The derivative of sine is cosine. Near the March equinox the days grow about " + fmt(rate(80) * 60, 0) + " minutes longer each day; near June 21 the change is almost zero." };
    } },
  { k: "Finance", t: "Continuous compounding is eˣ", live: "policy",
    build(L) {
      const r = L.policy / 100, P = 1000, t = 5, B = P * Math.exp(r * t), dB = r * B;
      return { setup: money(P, 0) + " grows continuously at the policy rate, " + fmt(L.policy) + "%: B(t) = 1000" + e(sig(r) + "t") + ". How fast is it growing after " + t + " years?",
        lines: [["Derivative", "B′(t) = " + sig(r) + " × 1000" + e(sig(r) + "t"), ""],
                ["Balance at 5", "1000" + e(sig(r * t)), money(B)],
                ["Rate at 5", sig(r) + " × " + money(B), money(dB) + " a year"],
                ["Rate ÷ balance", money(dB) + " ÷ " + money(B), pct(dB / B)]],
        take: "(eˣ)′ = eˣ, so with the chain rule the growth rate is always exactly " + fmt(L.policy) + "% of the balance. Only base e grows with no extra factor in front." };
    } },
  { k: "Tech", t: "The power in your wall",
    build() {
      const Vp = 170, w = 120 * Math.PI, d0 = Vp * w;
      return { setup: "Outlet voltage in Canada is about V(t) = 170 sin(120πt) volts: 60 cycles a second, with a peak of 170 V for “120 V” power.",
        lines: [["Derivative", "V′(t) = 170 × 120π × cos(120πt)", ""],
                ["Crossing zero (t = 0)", "170 × 120π × cos 0", fmt(d0, 0) + " V/s"],
                ["Per millisecond", fmt(d0, 0) + " ÷ 1,000", fmt(d0 / 1000, 1) + " V/ms"],
                ["At the peak (t = 1/240 s)", "170 × 120π × cos(π/2)", fmt(Vp * w * Math.cos(Math.PI / 2) + 0, 0) + " V/s"]],
        take: "Sine changes fastest where it crosses zero, because cosine is largest there. At the peak the voltage is momentarily flat." };
    } },
  { k: "Finance", t: "When to stock up for winter",
    build() {
      const A = 250, w = Math.PI / 6, rate = t => -A * w * Math.sin(w * t);
      return { setup: "A heating-oil dealer sells about D(t) = 400 + 250 cos(πt/6) thousand litres a month, t months after mid-January, when demand peaks.",
        lines: [["Derivative", "D′(t) = −250 × (π/6) × sin(πt/6)", ""],
                ["Mid-January (t = 0)", "−250 × (π/6) × sin 0", fmt(rate(0) + 0, 0) + " thousand L/month"],
                ["Mid-April (t = 3)", "−250 × (π/6) × sin(π/2)", fmt(rate(3), 1) + " thousand L/month"],
                ["Mid-October (t = 9)", "−250 × (π/6) × sin(3π/2)", fmt(rate(9), 1) + " thousand L/month"]],
        take: "Cosine's derivative is −sine. Sales climb fastest in mid-October, three months before the peak, gaining about " + fmt(rate(9), 0) + " thousand litres a month, each month. That is when to hire drivers and fill tanks." };
    } },
  { k: "Nature", t: "Bay of Fundy tides",
    build() {
      const A = 8, w = 2 * Math.PI / 12.4, rate = t => A * w * Math.sin(w * t);
      return { setup: "In the Minas Basin the tide can rise about 16 m on a 12.4-hour cycle. From low tide, height above the middle is h(t) = −8 cos(2πt ÷ 12.4) m.",
        lines: [["Derivative", "h′(t) = 8 × (2π ÷ 12.4) × sin(2πt ÷ 12.4)", ""],
                ["At low tide (t = 0)", "8 × (2π ÷ 12.4) × sin 0", fmt(rate(0), 2) + " m/h"],
                ["Halfway (t = 3.1 h)", "8 × (2π ÷ 12.4) × sin(π/2)", fmt(rate(3.1), 2) + " m/h"],
                ["Per minute", fmt(rate(3.1), 2) + " × 100 ÷ 60", fmt(rate(3.1) * 100 / 60, 1) + " cm/min"]],
        take: "The water is still at low and high tide and rises fastest halfway between, at about " + fmt(rate(3.1) * 100 / 60, 0) + " cm a minute. The derivative of −cos is sin, and sine peaks there." };
    } },
  { k: "Finance", t: "A yearly rate grows by ln a", live: "bond10",
    build(L) {
      const y = L.bond10 / 100, a = 1 + y, P = 20000, B = P * Math.pow(a, 10), la = Math.log(a);
      return { setup: money(P, 0) + " in a TFSA earns the 10-year bond yield, " + fmt(L.bond10) + "%, compounded yearly: B(t) = 20000 × " + sig(a) + sup("t") + ". How fast is it growing at 10 years?",
        lines: [["Derivative", "B′(t) = 20000 × " + sig(a) + sup("t") + " × ln " + sig(a), ""],
                ["Balance at 10", "20000 × " + sig(a) + sup("10"), money(B)],
                ["The ln factor", "ln " + sig(a), fmt(la, 5)],
                ["Rate at 10", money(B) + " × " + fmt(la, 5), money(B * la) + " a year"]],
        take: "(aˣ)′ = aˣ · ln a. Here ln " + sig(a) + " = " + fmt(la, 5) + ", or " + pct(la, 3) + " a year, a little under the quoted " + fmt(L.bond10) + "%, because a yearly rate already includes a year of compounding." };
    } },
  { k: "Finance", t: "How fast grocery bills climb",
    build() {
      const P0 = 250, a = 1.025, la = Math.log(a), P20 = P0 * Math.pow(a, 20);
      return { setup: "A family's weekly groceries cost " + money(P0, 0) + ". Prices rise 2.5% a year: P(t) = 250 × 1.025" + sup("t") + ".",
        lines: [["Derivative", "P′(t) = 250 × 1.025" + sup("t") + " × ln 1.025", ""],
                ["Today (t = 0)", "250 × " + fmt(la, 5), money(P0 * la) + " a year"],
                ["Bill at 20 years", "250 × 1.025" + sup("20"), money(P20)],
                ["Rate at 20 years", money(P20) + " × " + fmt(la, 5), money(P20 * la) + " a year"]],
        take: "The bill rises by more dollars each year because the rate is proportional to the bill. The ln 1.025 factor comes from the base not being e." };
    } },
  { k: "Health", t: "Caffeine fades exponentially",
    build() {
      const C0 = 200, k = Math.log(2) / 5, C = t => C0 * Math.exp(-k * t);
      return { setup: "A large coffee at 3 p.m. has about 200 mg of caffeine. With a half-life of roughly 5 hours, C(t) = 200" + e("−" + fmt(k, 4) + "t") + " mg.",
        lines: [["Derivative", "C′(t) = −" + fmt(k, 4) + " × 200" + e("−" + fmt(k, 4) + "t"), ""],
                ["At 3 p.m. (t = 0)", "−" + fmt(k, 4) + " × 200", fmt(-k * C0, 1) + " mg/h"],
                ["At 1 a.m. (t = 10)", "200" + e("−" + fmt(k * 10, 3)), fmt(C(10), 0) + " mg left"],
                ["Rate at 1 a.m.", "−" + fmt(k, 4) + " × " + fmt(C(10), 0), fmt(-k * C(10), 1) + " mg/h"]],
        take: "The derivative of eˣ is itself, so the body clears caffeine in proportion to what is left. At 1 a.m. " + pct(C(10) / C0, 0) + " of the dose remains, leaving slowly." };
    } }
];

CP.NOTES.lnexp = [
  { k: "Finance", t: "Doubling time", live: "policy",
    build(L) {
      const r = L.policy / 100, t = Math.log(2) / r;
      return { setup: "Money compounding continuously at the policy rate, " + fmt(L.policy) + "%, grows as " + e(sig(r) + "t") + ". When does it double?",
        lines: [["Equation", e(sig(r) + "t") + " = 2", ""],
                ["Take ln", sig(r) + "t = ln 2 = 0.6931", ""],
                ["Solve", "0.6931 ÷ " + sig(r), fmt(t, 1) + " years"],
                ["Rule of 72 check", "72 ÷ " + fmt(L.policy), fmt(72 / L.policy, 1) + " years"]],
        take: "ln undoes eˣ, so “how long until” becomes one division. The rule of 72 is this formula rounded up a little to make mental maths easy." };
    } },
  { k: "Science", t: "Carbon dating",
    build() {
      const k = Math.log(2) / 5730, f = 0.30, lf = Math.log(f);
      return { setup: "Carbon-14 has a half-life of about 5,730 years, so the fraction left is e" + sup("−kt") + ". A piece of charcoal has 30% of its carbon-14 left.",
        lines: [["Find k", "ln 2 ÷ 5,730", fmt(k, 6)],
                ["Equation", e("−" + fmt(k, 6) + "t") + " = 0.30", ""],
                ["Take ln", "−" + fmt(k, 6) + "t = ln 0.30", fmt(lf, 4)],
                ["Solve", fmt(lf, 4) + " ÷ (−" + fmt(k, 6) + ")", fmt(Math.round(lf / -k / 10) * 10, 0) + " years"]],
        take: "Measure what is left, take ln, divide by −k. That one step turns a lab measurement into an age of about " + fmt(Math.round(lf / -k / 100) * 100, 0) + " years." };
    } },
  { k: "Finance", t: "Log returns add up",
    build() {
      const a = 100, b = 110, c = 99, r1 = Math.log(b / a), r2 = Math.log(c / b);
      return { setup: "A stock goes from " + money(a, 0) + " to " + money(b, 0) + " (up 10%), then to " + money(c, 0) + " (down 10%). Analysts measure each day's return as ln(new ÷ old).",
        lines: [["Day 1", "ln(110 ÷ 100)", fmt(r1, 4)],
                ["Day 2", "ln(99 ÷ 110)", fmt(r2, 4)],
                ["Add them", fmt(r1, 4) + " + (" + fmt(r2, 4) + ")", fmt(r1 + r2, 4)],
                ["Check", "ln(99 ÷ 100)", fmt(Math.log(c / a), 4)]],
        take: "Up 10% and down 10% sounds like zero, but it is a " + pct(1 - c / a, 0) + " loss. ln(ab) = ln a + ln b, so log returns simply add, and the sum tells the truth." };
    } },
  { k: "Health", t: "Drug half-life",
    build() {
      const k = 0.35, D = 400, m = 50, h = Math.log(2) / k, t = Math.log(D / m) / k;
      return { setup: "A pain reliever leaves the body as A(t) = 400" + e("−0.35t") + " mg, t in hours. Find its half-life, and when it falls to 50 mg.",
        lines: [["Half-life", e("−0.35t") + " = 0.5 → t = ln 2 ÷ 0.35", fmt(h, 2) + " h"],
                ["Equation", "400" + e("−0.35t") + " = 50 → " + e("−0.35t") + " = 0.125", ""],
                ["Take ln", "−0.35t = ln 0.125", fmt(Math.log(m / D), 3)],
                ["Solve", fmt(Math.log(m / D), 3) + " ÷ (−0.35)", fmt(t, 1) + " h"]],
        take: "50 mg is one eighth of the dose, three half-lives: 3 × " + fmt(h, 2) + " ≈ " + fmt(t, 1) + " hours. ln turns the dosing question into a division, which is how dosing intervals are set." };
    } },
  { k: "Finance", t: "How long until card debt triples",
    build() {
      const r = 0.1999, t3 = Math.log(3) / r, t2 = Math.log(2) / r;
      return { setup: "An unpaid $3,000 credit card balance grows at 19.99% a year. Treat the growth as continuous: B(t) = 3000" + e("0.1999t") + ". When does it reach $9,000?",
        lines: [["Equation", "3000" + e("0.1999t") + " = 9000 → " + e("0.1999t") + " = 3", ""],
                ["Take ln", "0.1999t = ln 3", fmt(Math.log(3), 4)],
                ["Solve", fmt(Math.log(3), 4) + " ÷ 0.1999", fmt(t3, 1) + " years"],
                ["To double", "ln 2 ÷ 0.1999", fmt(t2, 1) + " years"]],
        take: "At card rates a balance doubles in about " + fmt(t2, 1) + " years and triples in about " + fmt(t3, 1) + ". Taking ln of both sides answers any “how long until” question." };
    } },
  { k: "Home", t: "When coffee is ready to drink",
    build() {
      const k = 0.05, q = 40 / 70, lq = Math.log(q);
      return { setup: "Coffee poured at 90 °C in a 20 °C kitchen cools as T(t) = 20 + 70" + e("−0.05t") + ", t in minutes. When is it 60 °C?",
        lines: [["Equation", "20 + 70" + e("−0.05t") + " = 60", ""],
                ["Isolate e", e("−0.05t") + " = 40 ÷ 70", fmt(q, 4)],
                ["Take ln", "−0.05t = ln " + fmt(q, 4), fmt(lq, 4)],
                ["Solve", fmt(lq, 4) + " ÷ (−0.05)", fmt(lq / -k, 1) + " min"]],
        take: "Get the exponential alone first, then take ln. Subtracting 20 before the ln matters: ln(a + b) is not ln a + ln b." };
    } },
  { k: "Finance", t: "Turning a bond yield into a continuous rate", live: "bond5",
    build(L) {
      const y = L.bond5 / 100, P = 100 / Math.pow(1 + y / 2, 10), ratio = 100 / P, c = Math.log(ratio) / 5;
      return { setup: "Canadian bond yields are quoted with semi-annual compounding. At " + fmt(L.bond5) + "%, a bond paying $100 in 5 years costs 100 ÷ (1 + " + sig(y / 2, 5) + ")" + sup("10") + ".",
        lines: [["Price", "100 ÷ " + fmt(Math.pow(1 + y / 2, 10), 4), money(P)],
                ["Growth factor", "100 ÷ " + fmt(P, 2), fmt(ratio, 4)],
                ["Take ln", "ln " + fmt(ratio, 4), fmt(Math.log(ratio), 4)],
                ["Per year", fmt(Math.log(ratio), 4) + " ÷ 5", pct(c, 3)]],
        take: "The continuous rate, " + pct(c, 3) + ", is a little below the quoted " + fmt(L.bond5) + "%. Traders use it because continuous rates for different years simply add, and ln is how you get them." };
    } },
  { k: "Health", t: "Why leftovers go in the fridge",
    build() {
      const k = Math.log(2) / 20, t = Math.log(1000) / k;
      return { setup: "In ideal warm conditions some bacteria double about every 20 minutes: N(t) = N₀" + e("kt") + ". How long until 1,000 bacteria become 1,000,000?",
        lines: [["Find k", "ln 2 ÷ 20", fmt(k, 4) + " per min"],
                ["Equation", e(fmt(k, 4) + "t") + " = 1,000,000 ÷ 1,000 = 1,000", ""],
                ["Take ln", fmt(k, 4) + "t = ln 1,000", fmt(Math.log(1000), 3)],
                ["Solve", fmt(Math.log(1000), 3) + " ÷ " + fmt(k, 4), fmt(t, 0) + " min ≈ " + fmt(t / 60, 1) + " h"]],
        take: "A thousandfold increase in about " + fmt(t / 60, 1) + " hours. That is why food-safety advice says to refrigerate leftovers within about two hours." };
    } }
];

CP.NOTES.exprate = [
  { k: "Finance", t: "Growth in proportion to size", live: "policy",
    build(L) {
      const r = L.policy / 100;
      return { setup: "Savings grow continuously at the policy rate, " + fmt(L.policy) + "%, so P′(t) = " + sig(r) + " × P(t). Compare the growth at $50,000 and at $100,000.",
        lines: [["At $50,000", sig(r) + " × 50,000", money(r * 50000) + " a year"],
                ["Per day", money(r * 50000) + " ÷ 365", money(r * 50000 / 365)],
                ["At $100,000", sig(r) + " × 100,000", money(r * 100000) + " a year"],
                ["Time to double", "ln 2 ÷ " + sig(r), fmt(Math.log(2) / r, 1) + " years"]],
        take: "P′ = kP: double the balance and the dollars it earns double too. That is what makes the growth exponential rather than a straight line." };
    } },
  { k: "Science", t: "Coffee cools the same way",
    build() {
      const k = 0.05, R = 20, rate = T => -k * (T - R);
      return { setup: "Newton's law of cooling: the gap between coffee and a 20 °C room shrinks as G(t) = 70" + e("−0.05t") + ", so G′ = −0.05G, t in minutes.",
        lines: [["At 90 °C", "−0.05 × (90 − 20)", fmt(rate(90), 1) + " °C/min"],
                ["At 60 °C", "−0.05 × (60 − 20)", fmt(rate(60), 1) + " °C/min"],
                ["At 30 °C", "−0.05 × (30 − 20)", fmt(rate(30), 1) + " °C/min"]],
        take: "The cooling rate is k times the gap, so it falls as the gap closes. Fast at first, then slower and slower: exponential decay toward room temperature." };
    } },
  { k: "Finance", t: "Inflation erodes cash",
    build() {
      const k = 0.025, V = t => 10000 * Math.exp(-k * t);
      return { setup: "At 2.5% inflation, the buying power of $10,000 in cash is V(t) = 10000" + e("−0.025t") + ", so V′(t) = −0.025 × V(t).",
        lines: [["Today", "−0.025 × $10,000", money(-k * 10000) + " a year"],
                ["Value at 10 years", "10000" + e("−0.25"), money(V(10))],
                ["Loss rate at 10", "−0.025 × " + money(V(10)), money(-k * V(10)) + " a year"],
                ["Value at 20 years", "10000" + e("−0.5"), money(V(20))]],
        take: "Cash loses about " + money(k * 10000, 0) + " of buying power in the first year and a little less each year, because the loss is 2.5% of what is left. Over 20 years it loses " + pct(1 - V(20) / 10000, 0) + "." };
    } },
  { k: "Health", t: "Medications leave in proportion",
    build() {
      const k = 0.17, A = t => 500 * Math.exp(-k * t);
      return { setup: "A 500 mg dose is cleared as A(t) = 500" + e("−0.17t") + " mg, t in hours. The clearance rate is A′(t) = −0.17 × A(t).",
        lines: [["At the dose", "−0.17 × 500", fmt(-k * 500, 1) + " mg/h"],
                ["After 4 hours", "500" + e("−0.68") + " = " + fmt(A(4), 1) + " mg", fmt(-k * A(4), 1) + " mg/h"],
                ["After 8 hours", "500" + e("−1.36") + " = " + fmt(A(8), 1) + " mg", fmt(-k * A(8), 1) + " mg/h"],
                ["Half-life", "ln 2 ÷ 0.17", fmt(Math.log(2) / k, 1) + " h"]],
        take: "The body clears a fixed fraction, not a fixed amount, each hour: the rate halves as the amount halves. That is why doses can be spaced at regular intervals." };
    } },
  { k: "Finance", t: "Credit card debt feeds itself",
    build() {
      const k = 0.1999, B = t => 5000 * Math.exp(k * t);
      return { setup: "An unpaid $5,000 card balance at 19.99%, treated as continuous: B(t) = 5000" + e("0.1999t") + ", so B′(t) = 0.1999 × B(t).",
        lines: [["Today", "0.1999 × $5,000", money(k * 5000) + " a year"],
                ["Balance at 3 years", "5000" + e(fmt(k * 3, 4)), money(B(3))],
                ["Rate at 3 years", "0.1999 × " + money(B(3)), money(k * B(3)) + " a year"]],
        take: "The interest grows from about " + money(k * 5000, 0) + " to " + money(k * B(3), 0) + " a year in three years. The rate is proportional to the balance, so exponential growth works against the borrower." };
    } },
  { k: "Science", t: "Carbon-14 decay you can count",
    build() {
      const k = Math.log(2) / 5730, N = 6e10, perYr = k * N, perMin = perYr / (365.25 * 24 * 60);
      return { setup: "One gram of carbon from a living tree holds about 6 × 10" + sup("10") + " carbon-14 atoms. They decay as N′ = −kN, with k = ln 2 ÷ 5,730 per year.",
        lines: [["k", "ln 2 ÷ 5,730", fmt(k, 6) + " per year"],
                ["Decays per year", fmt(k, 6) + " × 6 × 10" + sup("10"), fmt(perYr, 0)],
                ["Per minute", fmt(perYr, 0) + " ÷ 525,960", fmt(perMin, 1)],
                ["After 5,730 years", "half the atoms → half the rate", fmt(perMin / 2, 1) + " per minute"]],
        take: "The decay rate is proportional to what is left. That rate is what dating labs measure: a count of about " + fmt(perMin / 2, 0) + " per minute per gram means one half-life has passed." };
    } },
  { k: "Finance", t: "Why starting early matters",
    build() {
      const k = 0.06, A = 10000 * Math.exp(k * 40), B = 10000 * Math.exp(k * 30);
      return { setup: "Two people each invest $10,000 at 6% a year, continuous. One starts at 25, the other at 35. Compare them at 65, where B′ = 0.06B.",
        lines: [["Start at 25", "10000" + e("0.06 × 40"), money(A, 0)],
                ["Start at 35", "10000" + e("0.06 × 30"), money(B, 0)],
                ["Growth at 65, early", "0.06 × " + money(A, 0), money(k * A, 0) + " a year"],
                ["Growth at 65, late", "0.06 × " + money(B, 0), money(k * B, 0) + " a year"]],
        take: "Ten extra years multiply the balance by e" + sup("0.6") + " ≈ " + fmt(A / B, 2) + ". Because growth is proportional to size, the early saver's money is also growing " + money(k * (A - B), 0) + " a year faster at the end." };
    } },
  { k: "Tech", t: "Viral videos",
    build() {
      const k = 0.3, V = 500 * Math.exp(k * 10);
      return { setup: "A video has 500 views. Early on, each hour's new views are proportional to the views so far: V(t) = 500" + e("0.3t") + ", so V′ = 0.3V.",
        lines: [["Views at 10 h", "500" + e("3"), fmt(V, 0)],
                ["Rate at 10 h", "0.3 × " + fmt(V, 0), fmt(k * V, 0) + " views/h"],
                ["Doubling time", "ln 2 ÷ 0.3", fmt(Math.log(2) / k, 1) + " h"]],
        take: "More viewers means more sharing, so the rate grows with the count. The curve bends over only when the audience starts to run out." };
    } }
];

CP.NOTES.motion = [
  { k: "Driving", t: "Stopping from 100 km/h",
    build() {
      const v0 = 100 / 3.6, a = 7, tStop = v0 / a, sStop = v0 * tStop - a / 2 * tStop * tStop, react = 1.5 * v0;
      return { setup: "At 100 km/h (" + fmt(v0, 2) + " m/s) a driver brakes at 7 m/s²: s(t) = " + fmt(v0, 2) + "t − 3.5t² m. Reaction time before braking is 1.5 s.",
        lines: [["Velocity", "v(t) = s′(t) = " + fmt(v0, 2) + " − 7t", ""],
                ["Stops when", fmt(v0, 2) + " − 7t = 0", fmt(tStop, 2) + " s"],
                ["Braking distance", "s(" + fmt(tStop, 2) + ")", fmt(sStop, 1) + " m"],
                ["Reaction distance", "1.5 × " + fmt(v0, 2), fmt(react, 1) + " m"],
                ["Total", fmt(sStop, 1) + " + " + fmt(react, 1), fmt(sStop + react, 1) + " m"]],
        take: "The car stops when v = 0, not when s = 0. Almost " + fmt(sStop + react, 0) + " m, about a football field, before the car is still." };
    } },
  { k: "Finance", t: "Inflation's acceleration",
    build() {
      const P = t => 100 + 2 * t + 0.15 * t * t, v = t => 2 + 0.3 * t;
      return { setup: "A price index is P(t) = 100 + 2t + 0.15t², t in years. The price level is position; its rate of change is how fast prices rise.",
        lines: [["Velocity", "P′(t) = 2 + 0.3t", ""],
                ["Acceleration", "P″(t)", "0.3 points/yr²"],
                ["Inflation now", "P′(0) ÷ P(0) = 2 ÷ 100", pct(v(0) / P(0))],
                ["Inflation at 4 years", "P′(4) ÷ P(4) = " + fmt(v(4), 1) + " ÷ " + fmt(P(4), 1), pct(v(4) / P(4))]],
        take: "When the news says inflation is “rising”, prices are accelerating: P″ > 0. Here inflation climbs from 2% to " + pct(v(4) / P(4), 1) + " in four years." };
    } },
  { k: "Sport", t: "A pop fly at the ballpark",
    build() {
      const v0 = 30, g = 9.8, tTop = v0 / g, hTop = 1 + v0 * tTop - 4.9 * tTop * tTop, tLand = (v0 + Math.sqrt(v0 * v0 + 4 * 4.9)) / g;
      return { setup: "A pop fly leaves the bat 1 m up at 30 m/s straight up: h(t) = 1 + 30t − 4.9t² metres.",
        lines: [["Velocity", "v(t) = h′(t) = 30 − 9.8t", ""],
                ["Acceleration", "a(t) = v′(t)", "−9.8 m/s²"],
                ["Top (v = 0)", "30 ÷ 9.8 = " + fmt(tTop, 2) + " s, h(" + fmt(tTop, 2) + ")", fmt(hTop, 1) + " m"],
                ["Comes down", "h(t) = 0 → t", fmt(tLand, 2) + " s"]],
        take: "At the top the ball is at rest for an instant, but its acceleration is still −9.8 m/s². The fielder has about " + fmt(tLand, 0) + " seconds to get under it." };
    } },
  { k: "Finance", t: "Debt and deficits",
    build() {
      const D = t => 1200 + 40 * t - 3 * t * t, tz = 40 / 6;
      return { setup: "A made-up country's debt is D(t) = 1200 + 40t − 3t² billion dollars, t years from now. The deficit is the debt's velocity.",
        lines: [["Deficit", "D′(t) = 40 − 6t", ""],
                ["Deficit in year 4", "40 − 6 × 4", "$" + fmt(40 - 24, 0) + " billion/yr"],
                ["Balanced budget", "40 − 6t = 0", fmt(tz, 1) + " years"],
                ["Debt then", "D(" + fmt(tz, 2) + ")", "$" + fmt(D(tz), 0) + " billion"]],
        take: "A shrinking deficit still means a growing debt. The debt stops rising only when its velocity, the deficit, reaches zero." };
    } },
  { k: "Tech", t: "Elevators are tuned for jerk",
    build() {
      const t = 1;
      return { setup: "An elevator starts smoothly: s(t) = t³ ÷ 6 metres for the first second. Engineers watch acceleration and its rate of change, called jerk.",
        lines: [["Velocity", "v(t) = s′(t) = t² ÷ 2", fmt(t * t / 2, 2) + " m/s at 1 s"],
                ["Acceleration", "a(t) = v′(t) = t", fmt(t, 0) + " m/s² at 1 s"],
                ["Jerk", "a′(t) = s‴(t)", "1 m/s³"],
                ["Distance", "s(1) = 1 ÷ 6", fmt(t * t * t / 6, 3) + " m"]],
        take: "Each derivative is the rate of the one before. Keeping jerk small lets acceleration build gradually, so the ride feels smooth instead of a lurch." };
    } },
  { k: "Finance", t: "Momentum investing",
    build() {
      const P = t => 50 + 4 * t - 0.2 * t * t, v = t => 4 - 0.4 * t;
      return { setup: "A stock's price is modelled as P(t) = 50 + 4t − 0.2t² dollars, t in weeks. Traders watch its velocity and acceleration.",
        lines: [["Velocity", "P′(t) = 4 − 0.4t", ""],
                ["Week 6", "P(6) = " + money(P(6)) + ", P′(6) = 4 − 2.4", money(v(6)) + "/week"],
                ["Acceleration", "P″(t)", "−$0.40/week²"],
                ["Peak (P′ = 0)", "t = 4 ÷ 0.4 = 10, P(10)", money(P(10))]],
        take: "At week 6 the price is still rising, but the negative acceleration says the rise is slowing. Momentum traders watch for exactly that sign change." };
    } },
  { k: "Driving", t: "Merging onto the 401",
    build() {
      const v0 = 50 / 3.6, v1 = 100 / 3.6, a = 2.5, t = (v1 - v0) / a, s = v0 * t + a / 2 * t * t;
      return { setup: "On the ramp a car speeds up from 50 km/h (" + fmt(v0, 2) + " m/s) at 2.5 m/s²: s(t) = " + fmt(v0, 2) + "t + 1.25t². When does it reach 100 km/h (" + fmt(v1, 2) + " m/s)?",
        lines: [["Velocity", "v(t) = s′(t) = " + fmt(v0, 2) + " + 2.5t", ""],
                ["Solve", fmt(v0, 2) + " + 2.5t = " + fmt(v1, 2), fmt(t, 2) + " s"],
                ["Distance", fmt(v0, 2) + " × " + fmt(t, 2) + " + 1.25 × " + fmt(t, 2) + "²", fmt(s, 0) + " m"]],
        take: "Velocity tells you when, position tells you where. The car needs about " + fmt(s, 0) + " m of ramp to match highway speed, which is why on-ramps have a long acceleration lane." };
    } },
  { k: "Finance", t: "The loonie has a velocity", live: "usdcad",
    build(L) {
      const now = L.usdcad, then = L.usdcad30, v = (now - then) / 30, trip = 5000 * v;
      const dir = v > 0 ? "more" : "less";
      return { setup: "Treat the exchange rate as position. Today US$1 costs " + fmt(now, 4) + " Canadian dollars; 30 days ago it cost " + fmt(then, 4) + ".",
        lines: [["Change", fmt(now, 4) + " − " + fmt(then, 4), fmt(now - then, 4)],
                ["Average velocity", fmt(now - then, 4) + " ÷ 30 days", fmt(v, 5) + " per day"],
                ["US$5,000 trip", "5,000 × (" + fmt(v, 5) + ")", money(Math.abs(trip)) + " " + dir + " per day"],
                ["Over 30 days", "5,000 × (" + fmt(now - then, 4) + ")", money(Math.abs(5000 * (now - then))) + " " + dir]],
        take: "Velocity is change in position over change in time. This is the average over 30 days; the derivative is the same idea over a shrinking interval. Lately a US trip has cost " + dir + " each day." };
    } }
];

CP.NOTES.optim = [
  { k: "Finance", t: "Pricing a streaming plan",
    build() {
      const a = 200000, b = 8000, p = a / (2 * b), N = a - b * p;
      return { setup: "A streaming service keeps N = 200,000 − 8,000p subscribers at a price of p dollars a month. Revenue R = p × N.",
        lines: [["Revenue", "R(p) = 200,000p − 8,000p²", ""],
                ["Derivative", "R′(p) = 200,000 − 16,000p", ""],
                ["Set to zero", "p = 200,000 ÷ 16,000", money(p)],
                ["Best revenue", money(p) + " × " + fmt(N, 0), money(p * N, 0) + "/month"]],
        take: "R″ = −16,000 < 0, so it is a maximum. For straight-line demand the best price is halfway to the price where no one subscribes, " + money(a / b) + "." };
    } },
  { k: "Home", t: "Fencing a yard against a wall",
    build() {
      const L0 = 60, x = L0 / 4, y = L0 - 2 * x;
      return { setup: "You have 60 m of fence for a rectangular garden against the house wall. Two sides of x and one side of 60 − 2x need fence.",
        lines: [["Area", "A(x) = x(60 − 2x) = 60x − 2x²", ""],
                ["Derivative", "A′(x) = 60 − 4x", ""],
                ["Set to zero", "x = 60 ÷ 4", fmt(x, 0) + " m"],
                ["Largest area", fmt(x, 0) + " × " + fmt(y, 0), fmt(x * y, 0) + " m²"]],
        take: "The side facing the wall, " + fmt(y, 0) + " m, is twice each of the other two. The ends, x = 0 and x = 30, give no area at all, so this is the maximum." };
    } },
  { k: "Finance", t: "The least risky mix",
    build() {
      const s1 = 0.15, s2 = 0.05, w = s2 * s2 / (s1 * s1 + s2 * s2), sd = Math.sqrt(w * w * s1 * s1 + (1 - w) * (1 - w) * s2 * s2);
      return { setup: "Put a fraction w in a stock fund (risk 15%) and the rest in a bond fund (risk 5%). If they move independently, variance V(w) = 0.0225w² + 0.0025(1 − w)².",
        lines: [["Derivative", "V′(w) = 0.045w − 0.005(1 − w)", ""],
                ["Set to zero", "0.05w = 0.005", "w = " + pct(w, 0)],
                ["Risk then", "√(" + fmt(w * w * s1 * s1, 6) + " + " + fmt((1 - w) * (1 - w) * s2 * s2, 6) + ")", pct(sd)]],
        take: "Risk here is the standard deviation of yearly returns. Adding " + pct(w, 0) + " stocks lowers it below the bond fund alone, to " + pct(sd, 1) + ". Setting a derivative to zero is how portfolio tools find the lowest-risk mix." };
    } },
  { k: "Home", t: "The can that uses the least metal",
    build() {
      const V = 540, r = Math.cbrt(V / (2 * Math.PI)), h = V / (Math.PI * r * r), S = 2 * Math.PI * r * r + 2 * V / r;
      return { setup: "A soup can holds 540 mL (540 cm³). With radius r, its height is 540 ÷ (πr²), so its metal area is S(r) = 2πr² + 1080 ÷ r.",
        lines: [["Derivative", "S′(r) = 4πr − 1080 ÷ r²", ""],
                ["Set to zero", "r³ = 1080 ÷ 4π", "r = " + fmt(r, 2) + " cm"],
                ["Height", "540 ÷ (π × " + fmt(r, 2) + "²)", fmt(h, 2) + " cm"],
                ["Metal", "S(" + fmt(r, 2) + ")", fmt(S, 0) + " cm²"]],
        take: "The best height equals the diameter, " + fmt(2 * r, 2) + " cm. Many real cans are taller, for labels and handling, and use a little more metal." };
    } },
  { k: "Finance", t: "How much flour to order", live: "policy",
    build(L) {
      const D = 2400, K = 50, h = 2 + 40 * L.policy / 100, q = Math.sqrt(2 * D * K / h), C = D * K / q + h * q / 2;
      return { setup: "A bakery uses 2,400 bags of flour a year. Each order costs $50. Holding a $40 bag for a year costs $2 of storage plus interest at the policy rate, " + fmt(L.policy) + "%.",
        lines: [["Holding cost", "2 + 40 × " + sig(L.policy / 100), money(h) + " per bag"],
                ["Total cost", "C(q) = 120,000 ÷ q + " + sig(h / 2) + "q", ""],
                ["Set C′ = 0", "120,000 ÷ q² = " + sig(h / 2) + " → q = √(120,000 ÷ " + sig(h / 2) + ")", fmt(q, 0) + " bags"],
                ["Cost per year", "C(" + fmt(q, 0) + ")", money(C, 0)]],
        take: "Order too often and fees add up; order too much and storage and interest do. The best order is where the two rates of change cancel. Higher interest rates mean smaller, more frequent orders." };
    } },
  { k: "Science", t: "A lifeguard's fastest path",
    build() {
      const T = x => Math.sqrt(100 + x * x) / 7 + Math.sqrt(400 + (30 - x) * (30 - x)) / 1.5;
      const dT = x => x / (7 * Math.sqrt(100 + x * x)) - (30 - x) / (1.5 * Math.sqrt(400 + (30 - x) * (30 - x)));
      let lo = 0, hi = 30;
      for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (dT(m) < 0) lo = m; else hi = m; }
      const x = (lo + hi) / 2;
      return { setup: "A lifeguard 10 m from the water runs at 7 m/s and swims at 1.5 m/s. A swimmer is 20 m out and 30 m along the beach. She enters the water x m along.",
        lines: [["Time", "T(x) = √(100 + x²) ÷ 7 + √(400 + (30 − x)²) ÷ 1.5", ""],
                ["Set T′(x) = 0", "x ÷ (7√(100 + x²)) = (30 − x) ÷ (1.5√(400 + (30 − x)²))", ""],
                ["Solve", "numerically", "x = " + fmt(x, 1) + " m"],
                ["Best time", "T(" + fmt(x, 1) + ")", fmt(T(x), 1) + " s"],
                ["Straight line", "T(10)", fmt(T(10), 1) + " s"]],
        take: "Running farther on sand saves " + fmt(T(10) - T(x), 1) + " s over the straight line. Light bending into water follows the same least-time rule, which is Snell's law." };
    } },
  { k: "Finance", t: "Best price for a school hoodie",
    build() {
      const c = 20, p = 40, q = 600 - 10 * p;
      return { setup: "A student council pays $20 a hoodie and expects to sell q = 600 − 10p at a price of p dollars. Profit = (p − 20)(600 − 10p).",
        lines: [["Profit", "P(p) = −10p² + 800p − 12,000", ""],
                ["Derivative", "P′(p) = −20p + 800", ""],
                ["Set to zero", "p = 800 ÷ 20", money(p, 0)],
                ["Best profit", "(" + p + " − " + c + ") × " + q, money((p - c) * q, 0)]],
        take: "The best price, " + money(p, 0) + ", is halfway between the cost, $20, and the price no one pays, $60. P″ = −20 < 0 confirms a maximum." };
    } },
  { k: "Sport", t: "The best launch angle",
    build() {
      const v = 25, g = 9.8, R = th => v * v * Math.sin(2 * th * Math.PI / 180) / g;
      return { setup: "On flat ground with no air resistance, a ball thrown at 25 m/s at angle θ lands R(θ) = 25² sin(2θ) ÷ 9.8 metres away.",
        lines: [["Derivative", "R′(θ) = 2 × 25² cos(2θ) ÷ 9.8", ""],
                ["Set to zero", "cos(2θ) = 0 → 2θ = 90°", "θ = 45°"],
                ["Range at 45°", "625 × sin 90° ÷ 9.8", fmt(R(45), 1) + " m"],
                ["Range at 35°", "625 × sin 70° ÷ 9.8", fmt(R(35), 1) + " m"]],
        take: "With no air, 45° goes farthest. Air resistance and a release above the ground move the best angle lower, which is why shot-putters launch below 45°." };
    } }
];
})();
