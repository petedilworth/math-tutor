/* Worked notes: product rule, chain rule, product and chain together, rational and radical functions. */
(function () {
const { fmt, money, pct, sig, sup } = CP.nh;
CP.NOTES.prod = [
  { k: "Finance", t: "Revenue = price × quantity",
    build() {
      const p = 5, dp = 0.10, q = 2000, dq = -30, a = dp * q, b = p * dq;
      return { setup: "A café sells " + fmt(q, 0) + " lattes a month at " + money(p) + ". It raises the price 10¢ a month and loses 30 customers a month. Is revenue R = p × q rising?",
        lines: [["Rates", "p′ = " + money(dp) + ", q′ = " + fmt(dq, 0) + " a month", ""], ["p′q", fmt(dp) + " × " + fmt(q, 0), money(a)],
                ["pq′", fmt(p) + " × (" + fmt(dq, 0) + ")", money(b)], ["R′ = p′q + pq′", money(a) + " + (" + money(b) + ")", money(a + b) + " a month"]],
        take: "Revenue still rises about " + money(a + b, 0) + " a month: the price gain beats the lost customers. Using p′q′ instead would give " + money(dp * dq) + ", which means nothing." };
    } },
  { k: "Health", t: "Cardiac output = heart rate × stroke volume",
    build() {
      const h = 120, dh = 4, s = 90, ds = 2, a = dh * s, b = h * ds;
      return { setup: "Blood pumped per minute is heart rate × stroke volume. Mid-workout: " + h + " beats a minute, rising " + dh + " a minute, and " + s + " mL per beat, rising " + ds + " mL a minute.",
        lines: [["Output now", h + " × " + s + " mL", fmt(h * s / 1000, 1) + " L/min"], ["h′s", dh + " × " + s + " mL", fmt(a, 0) + " mL/min"],
                ["hs′", h + " × " + ds + " mL", fmt(b, 0) + " mL/min"], ["Total change", fmt(a, 0) + " + " + fmt(b, 0), fmt((a + b) / 1000, 2) + " L/min each minute"]],
        take: "Both factors push blood flow up, and the product rule credits each: " + pct(a / (a + b), 0) + " from faster beats, " + pct(b / (a + b), 0) + " from fuller beats." };
    } },
  { k: "Finance", t: "A US stock held in Canada", live: "usdcad",
    build(L) {
      const P = 150, dP = 2, X = L.usdcad, X0 = L.usdcad30, dX = X - X0, a = dP * X, b = P * dX;
      return { setup: "A US stock at US$" + P + " is rising US$" + dP + " a month. Its CAD value is price × USD/CAD. A US dollar went from " + fmt(X0, 4) + " to " + fmt(X, 4) + " CAD last month. Say both trends hold.",
        lines: [["CAD value", P + " × " + fmt(X, 4), money(P * X)], ["Stock term P′X", dP + " × " + fmt(X, 4), money(a)],
                ["Currency term PX′", P + " × (" + fmt(X, 4) + " − " + fmt(X0, 4) + ")", money(b)], ["Change in CAD", money(a) + " + (" + money(b) + ")", money(a + b) + " a month"]],
        take: "The stock's rise and the currency's move are separate terms. When the US dollar loses ground against the loonie, the currency term is negative and eats into the gain." };
    } },
  { k: "Science", t: "Power = voltage × current",
    build() {
      const V = 12, dV = -0.05, I = 8, dI = 0.2, a = dV * I, b = V * dI;
      return { setup: "A motor runs from a " + V + " V battery that sags 0.05 V a minute, while the current it draws rises 0.2 A a minute from " + I + " A. Power is P = V × I.",
        lines: [["Power now", V + " × " + I, fmt(V * I, 0) + " W"], ["V′I", "(−0.05) × " + I, fmt(a, 1) + " W/min"],
                ["VI′", V + " × 0.2", fmt(b, 1) + " W/min"], ["P′ = V′I + VI′", fmt(a, 1) + " + " + fmt(b, 1), fmt(a + b, 1) + " W/min"]],
        take: "Power still rises " + fmt(a + b, 1) + " W a minute. The voltage sag costs a little and the extra current gives more. Engineers watch both terms, since more current also drains the battery faster." };
    } },
  { k: "Finance", t: "Payroll = wage × hours",
    build() {
      const w = 28, dw = 0.03 * w, h = 40000, dh = -0.02 * h, a = dw * h, b = w * dh, P = w * h;
      return { setup: "A firm pays " + money(w) + " an hour for " + fmt(h, 0) + " hours a year. Wages rise 3% a year (" + fmt(dw * 100, 0) + "¢) while hours fall 2% (" + fmt(-dh, 0) + " hours). Payroll is wage × hours.",
        lines: [["Payroll now", money(w, 0) + " × " + fmt(h, 0), money(P, 0)], ["w′h", sig(dw) + " × " + fmt(h, 0), money(a, 0)],
                ["wh′", w + " × (" + fmt(dh, 0) + ")", money(b, 0)], ["Change", money(a, 0) + " + (" + money(b, 0) + ")", money(a + b, 0) + " a year"],
                ["As a percent", money(a + b, 0) + " ÷ " + money(P, 0), pct((a + b) / P, 1)]],
        take: "Divide the product rule by wh and you get w′/w + h′/h = 3% − 2%. Percent growth rates of a product add, so payroll grows about " + pct((a + b) / P, 0) + "." };
    } },
  { k: "Science", t: "A rocket's momentum",
    build() {
      const m = 500000, dm = -2500, v = 200, dv = 15, a = dm * v, b = m * dv;
      return { setup: "A " + fmt(m, 0) + " kg rocket moves at " + v + " m/s. It burns " + fmt(-dm, 0) + " kg of fuel a second and gains " + dv + " m/s each second. Its momentum is p = m × v.",
        lines: [["m′v", "(" + fmt(dm, 0) + ") × " + v, fmt(a, 0)], ["mv′", fmt(m, 0) + " × " + dv, fmt(b, 0)],
                ["p′ = m′v + mv′", fmt(a, 0) + " + " + fmt(b, 0), fmt(a + b, 0) + " kg·m/s each second"]],
        take: "Losing mass pulls momentum down " + fmt(-a / 1e6, 1) + " million each second; gaining speed pushes it up " + fmt(b / 1e6, 1) + " million. The product rule keeps the two effects apart." };
    } },
  { k: "Finance", t: "Portfolio value = shares × price",
    build() {
      const n = 400, dn = 10, p = 50, dp = 0.40, a = dn * p, b = n * dp;
      return { setup: "You own " + n + " shares at " + money(p, 0) + " and buy " + dn + " more each month. The price is rising " + money(dp) + " a month. Value is shares × price.",
        lines: [["Value now", n + " × " + money(p, 0), money(n * p, 0)], ["Contributions n′p", dn + " × " + money(p, 0), money(a, 0)],
                ["Gains np′", n + " × " + money(dp), money(b, 0)], ["Growth", money(a, 0) + " + " + money(b, 0), money(a + b, 0) + " a month"]],
        take: "The 'contributions' and 'gains' on your statement are the two terms of the product rule. Early on, contributions lead; as the share count grows, gains take over." };
    } },
  { k: "Nature", t: "Timber in a forest",
    build() {
      const n = 20000, dn = -500, v = 1.5, dv = 0.06, a = dn * v, b = n * dv;
      return { setup: "A forest has " + fmt(n, 0) + " trees holding about " + v + " m³ of wood each. Logging removes " + (-dn) + " trees a year, and each tree adds " + dv + " m³ a year.",
        lines: [["Wood now", fmt(n, 0) + " × " + v, fmt(n * v, 0) + " m³"], ["n′v", "(" + fmt(dn, 0) + ") × " + v, fmt(a, 0) + " m³"],
                ["nv′", fmt(n, 0) + " × " + dv, fmt(b, 0) + " m³"], ["Change", fmt(a, 0) + " + " + fmt(b, 0), fmt(a + b, 0) + " m³ a year"]],
        take: "Growth outpaces the harvest, so the total wood still rises. Foresters set cutting rates so the n′v loss stays smaller than the nv′ gain." };
    } }
];

CP.NOTES.chain = [
  { k: "Finance", t: "Bond duration comes from the chain rule", live: "bond10",
    build(L) {
      const y = L.bond10 / 100, F = 1000, n = 10, P = F * Math.pow(1 + y, -n), dP = -n * F * Math.pow(1 + y, -n - 1), ch = dP * 0.01;
      return { setup: "A government bond pays " + money(F, 0) + " in " + n + " years. Today's 10-year yield is " + fmt(L.bond10) + "%. Its price is P = 1000(1 + y)" + sup("-10") + ". What does a 1-point rise in y do?",
        lines: [["Price", "1000 ÷ " + fmt(1 + y, 4) + sup(n), money(P)], ["Chain rule", "P′ = −10 × 1000(1 + y)" + sup("-11") + " × 1", ""],
                ["P′(y)", "−10,000 ÷ " + fmt(1 + y, 4) + sup(11), money(dP, 0) + " per unit of y"], ["1-point rise", money(dP, 0) + " × 0.01", money(ch)],
                ["As a share", money(ch) + " ÷ " + money(P), pct(ch / P, 1)]],
        take: "The 10 that the chain rule brings down is why long bonds swing hard: about " + pct(-ch / P, 1) + " per point here, against about 2% for a 2-year bond." };
    } },
  { k: "Driving", t: "Litres per hour",
    build() {
      const per = 7.5 / 100, v = 100, rate = per * v, d = 260, t = d / v;
      return { setup: "A car uses 7.5 L per 100 km and cruises at " + v + " km/h on the 401. Fuel used depends on distance, and distance depends on time.",
        lines: [["dF/dx", "7.5 ÷ 100", sig(per) + " L/km"], ["dx/dt", "speed", v + " km/h"], ["dF/dt", sig(per) + " × " + v, fmt(rate, 1) + " L/h"],
                ["Toronto to Kingston", "about " + d + " km takes " + sig(t) + " h; " + sig(t) + " × " + fmt(rate, 1), fmt(rate * t, 1) + " L"]],
        take: "Rates stacked inside each other multiply: dF/dt = dF/dx × dx/dt. The units show it: L/km × km/h = L/h." };
    } },
  { k: "Finance", t: "Real returns",
    build() {
      const r = 1.06, i = 0.02, n = 20, P = 10000, u = r / (1 + i), G = Math.pow(u, n), du = -r / Math.pow(1 + i, 2), dG = n * Math.pow(u, n - 1) * du, loss = P * dG * 0.01;
      return { setup: money(P, 0) + " earns 6% a year for " + n + " years. Its growth after inflation i is G = (1.06 ÷ (1 + i))" + sup(n) + ". Inflation is 2%. What if it runs 1 point higher?",
        lines: [["Inside u", "1.06 ÷ 1.02", fmt(u, 4)], ["Real growth", fmt(u, 4) + sup(n), fmt(G, 3)], ["Inside′", "−1.06 ÷ 1.02" + sup(2), fmt(du, 4)],
                ["Chain rule", n + " × " + fmt(u, 4) + sup(n - 1) + " × (" + fmt(du, 4) + ")", fmt(dG, 2)], ["1 point more", money(P, 0) + " × (" + fmt(dG, 2) + ") × 0.01", money(loss, 0)]],
        take: "One extra point of inflation costs about " + money(-loss, 0) + " of buying power, near " + pct(-dG * 0.01 / G, 0) + " of the real result. The chain rule's " + n + " in front is why small inflation gaps matter over long horizons." };
    } },
  { k: "Tech", t: "Bike gears",
    build() {
      const front = 44, back = 11, ratio = front / back, c = 2.1, cad = 80, mpm = c * ratio * cad;
      return { setup: "A bike has a " + front + "-tooth chainring and an " + back + "-tooth rear cog. The wheel rolls " + c + " m per turn. The rider pedals " + cad + " turns a minute.",
        lines: [["Wheel per pedal", front + " ÷ " + back, sig(ratio) + " turns"], ["Metres per wheel turn", "circumference", c + " m"],
                ["Chain rule", c + " × " + sig(ratio) + " × " + cad, fmt(mpm, 0) + " m/min"], ["Speed", fmt(mpm, 0) + " × 60 ÷ 1,000", fmt(mpm * 60 / 1000, 1) + " km/h"]],
        take: "Distance depends on wheel turns, which depend on pedal turns, which depend on time. Each link multiplies. Shift to a 22-tooth cog and the " + sig(ratio) + " becomes " + sig(front / 22) + ": " + fmt(c * front / 22 * cad * 60 / 1000, 1) + " km/h at the same cadence." };
    } },
  { k: "Finance", t: "Turning a mortgage rate into a monthly rate", live: "bond5",
    build(L) {
      const r = (L.bond5 + 1.5) / 100, B = 500000, j = Math.pow(1 + r / 2, 1 / 6) - 1, o = Math.pow(1 + r / 2, -5 / 6) / 6, dj = o * 0.5, extra = B * dj * 0.0025;
      return { setup: "Canadian mortgages compound twice a year, so a quoted rate r gives a monthly rate j = (1 + r/2)" + sup("1/6") + " − 1. Take r = " + fmt(r * 100) + "%: the 5-year bond yield plus 1.5 points.",
        lines: [["Monthly rate", "(1 + " + sig(r / 2, 5) + ")" + sup("1/6") + " − 1", pct(j, 4)], ["Outside′", "(1/6)(1 + " + sig(r / 2, 5) + ")" + sup("−5/6"), fmt(o, 4)],
                ["Inside′", "d(1 + r/2)/dr", "0.5"], ["dj/dr", fmt(o, 4) + " × 0.5", fmt(dj, 4)], ["+0.25 point", money(B, 0) + " × " + fmt(dj, 4) + " × 0.0025", money(extra) + " a month"]],
        take: "Each quarter-point rise adds about " + money(extra, 0) + " to the first month's interest on " + money(B, 0) + ". The inside's ½ comes from compounding twice a year, and the chain rule carries it through." };
    } },
  { k: "Science", t: "Blowing up a balloon",
    build() {
      const Q = 500, r1 = 10, r2 = 20, a = Q / (4 * Math.PI * r1 * r1), b = Q / (4 * Math.PI * r2 * r2);
      return { setup: "You pump " + Q + " cm³ of air a second into a balloon. Its volume is V = (4/3)πr³, so by the chain rule dV/dt = 4πr² × dr/dt. How fast does the radius grow?",
        lines: [["Solve", "dr/dt = " + Q + " ÷ (4πr²)", ""], ["At r = " + r1 + " cm", Q + " ÷ (4π × " + r1 * r1 + ")", fmt(a, 3) + " cm/s"],
                ["At r = " + r2 + " cm", Q + " ÷ (4π × " + r2 * r2 + ")", fmt(b, 3) + " cm/s"]],
        take: "Doubling the radius cuts the growth rate to a quarter, because the same air spreads over four times the surface. The chain rule links the rate you control to the rate you see." };
    } },
  { k: "Finance", t: "One more quarter point on a GIC",
    build() {
      const P = 20000, r = 0.04, N = 60, g = 1 + r / 12, A = P * Math.pow(g, N), outer = N * Math.pow(g, N - 1), dA = P * outer / 12, est = dA * 0.0025,
        exact = P * Math.pow(1 + (r + 0.0025) / 12, N) - A;
      return { setup: money(P, 0) + " sits in a 5-year GIC at 4%, compounded monthly: A = 20,000(1 + r/12)" + sup(N) + ". How much is one more quarter point worth?",
        lines: [["Balance", "20,000 × " + fmt(g, 5) + sup(N), money(A)], ["Outside′", N + " × " + fmt(g, 5) + sup(N - 1), fmt(outer, 2)],
                ["Inside′", "d(1 + r/12)/dr", "1/12"], ["dA/dr", "20,000 × " + fmt(outer, 2) + " ÷ 12", money(dA, 0)], ["+0.25 point", money(dA, 0) + " × 0.0025", money(est)]],
        take: "The chain rule says a quarter point adds about " + money(est) + " over five years. Working it out in full gives " + money(exact) + ", so the derivative is a quick, close estimate." };
    } },
  { k: "Home", t: "A melting ice cube",
    build() {
      const ds = -0.1, s1 = 3, s2 = 1.5, a = 3 * s1 * s1 * ds, b = 3 * s2 * s2 * ds;
      return { setup: "An ice cube in a drink loses about 1 mm of side a minute: ds/dt = −0.1 cm/min. Its volume is V = s³, and s depends on time.",
        lines: [["Chain rule", "dV/dt = 3s² × ds/dt", ""], ["s = " + s1 + " cm", "3 × " + sig(s1 * s1) + " × (−0.1)", fmt(a, 2) + " cm³/min"],
                ["s = " + s2 + " cm", "3 × " + sig(s2 * s2) + " × (−0.1)", fmt(b, 3) + " cm³/min"], ["Ratio", fmt(a, 2) + " ÷ (" + fmt(b, 3) + ")", sig(a / b) + " times"]],
        take: "Same shrink in side, but the big cube loses " + sig(a / b) + " times the volume each minute. The 3s² from the outside function grows with the square of the size." };
    } }
];

CP.NOTES.combo = [
  { k: "Finance", t: "Shares × a rising price",
    build() {
      const t = 12, S = 800 + 25 * t, dS = 25, g = 1 + 0.01 * t, p = 30 * Math.pow(g, 3), dp = 30 * 3 * g * g * 0.01, a = dS * p, b = S * dp;
      return { setup: "You hold S = 800 + 25t shares after t months. The price is p = 30(1 + 0.01t)³ dollars. How fast is your holding V = S × p growing at month " + t + "?",
        lines: [["S and p", "S = " + fmt(S, 0) + "; p = 30 × " + sig(g) + "³", money(p)], ["p′ (chain)", "30 × 3(" + sig(g) + ")² × 0.01", money(dp, 3)],
                ["u′v", dS + " × " + money(p), money(a)], ["uv′", fmt(S, 0) + " × " + money(dp, 3), money(b)], ["V′(" + t + ")", money(a) + " + " + money(b), money(a + b) + " a month"]],
        take: money(a, 0) + " a month comes from buying shares and " + money(b, 0) + " from the price rising. The 0.01 is the chain rule's inside factor; forget it and you overstate price gains 100 times." };
    } },
  { k: "Finance", t: "Setting a ticket price",
    build() {
      const N = 2000, m = 40, p = 10, w = 1 - p / m, a = N * w * w, b = p * N * 2 * w * (-1 / m), best = m / 3, qb = N * Math.pow(1 - best / m, 2);
      return { setup: "A theatre sells q = 2,000(1 − p/40)² tickets at a price of p dollars. Revenue is R = p × q. Does raising the price from " + money(p, 0) + " help?",
        lines: [["u′v", "1 × 2,000(" + sig(w) + ")²", fmt(a, 0)], ["uv′", p + " × 2,000 × 2(" + sig(w) + ") × (−1/40)", fmt(b, 0)],
                ["R′(" + p + ")", fmt(a, 0) + " + (" + fmt(b, 0) + ")", money(a + b, 0) + " per $1"], ["Best price", "R′ = 2,000(1 − p/40)(1 − 3p/40) = 0", money(best)],
                ["Revenue then", money(best) + " × " + fmt(qb, 0) + " tickets", money(best * qb, 0)]],
        take: "The −1/40 from the chain rule is how fast the bracket shrinks as price rises. At " + money(p, 0) + " each extra dollar still adds about " + money(a + b, 0) + "; the gain runs out at " + money(best) + "." };
    } },
  { k: "Finance", t: "Monthly buys of a US fund", live: "usdcad",
    build(L) {
      const t = 12, X = L.usdcad, u = 100 + 5 * t, g = 1 + 0.004 * t, P = 80 * g * g, dP = 80 * 2 * g * 0.004, us = 5 * P + u * dP;
      return { setup: "In a TFSA you buy 5 units a month of a US fund: u = 100 + 5t. Its price is P = 80(1 + 0.004t)² US dollars. At " + fmt(X, 4) + " CAD per US dollar, how fast is the value growing at month " + t + "?",
        lines: [["Price at " + t, "80 × " + sig(g) + "²", "US$" + fmt(P)], ["P′ (chain)", "80 × 2(" + sig(g) + ") × 0.004", "US$" + fmt(dP, 3)],
                ["u′P + uP′", "5 × " + fmt(P) + " + " + u + " × " + fmt(dP, 3), "US$" + fmt(us)], ["In CAD", "US$" + fmt(us) + " × " + fmt(X, 4), money(us * X) + " a month"]],
        take: "The product rule splits growth into new units and price gains; the chain rule supplies the inside's 0.004. The exchange rate multiplies both halves, so a stronger US dollar makes your CAD growth bigger." };
    } },
  { k: "Finance", t: "A price rise that loses subscribers",
    build() {
      const t = 6, p = 12 + 0.25 * t, w = 1 - 0.01 * t, n = 4000 * w * w, dn = 4000 * 2 * w * (-0.01), a = 0.25 * n, b = p * dn;
      return { setup: "An app charges p = 12 + 0.25t dollars a month, raising it every month. Subscribers fall as n = 4,000(1 − 0.01t)². Is revenue R = p × n rising at month " + t + "?",
        lines: [["n′ (chain)", "4,000 × 2(" + sig(w) + ") × (−0.01)", fmt(dn, 1) + " a month"], ["p′n", "0.25 × " + fmt(n, 0), money(a)],
                ["pn′", fmt(p) + " × (" + fmt(dn, 1) + ")", money(b)], ["R′(" + t + ")", money(a) + " + (" + money(b) + ")", money(a + b) + " a month"]],
        take: "Revenue is falling about " + money(-(a + b), 0) + " a month: the price rises earn less than the lost subscribers cost. The chain rule's −0.01 sets how fast people leave." };
    } },
  { k: "Home", t: "The open-box problem",
    build() {
      const L0 = 60, x = L0 / 6, V = x * Math.pow(L0 - 2 * x, 2);
      return { setup: "Cut x-cm squares from the corners of a " + L0 + " cm square sheet and fold up the sides. The box holds V = x(" + L0 + " − 2x)². Which x holds the most?",
        lines: [["Product rule", "V′ = 1 × (" + L0 + " − 2x)² + x × 2(" + L0 + " − 2x)(−2)", ""], ["Factor", "V′ = (" + L0 + " − 2x)(" + L0 + " − 6x)", ""],
                ["Set to zero", L0 + " − 6x = 0", "x = " + sig(x) + " cm"], ["Volume", sig(x) + " × " + sig(L0 - 2 * x) + "²", fmt(V, 0) + " cm³ = " + sig(V / 1000) + " L"]],
        take: "The −2 is the chain rule: each centimetre of x takes 2 cm off the base width. The other root, x = " + sig(L0 / 2) + ", leaves no base at all." };
    } },
  { k: "Health", t: "A growing teen's BMI",
    build() {
      const m = 60, dm = 4, h = 1.70, dh = 0.05, B = m / (h * h), a = dm / (h * h), b = m * (-2) * Math.pow(h, -3) * dh;
      return { setup: "A teen weighs " + m + " kg at " + fmt(h) + " m, gaining " + dm + " kg and " + dh * 100 + " cm a year. BMI is m × h" + sup("-2") + ", a product with a power inside. Is it rising?",
        lines: [["BMI now", m + " × " + fmt(h) + sup("-2"), fmt(B, 1)], ["m′h⁻²", dm + " × " + fmt(h) + sup("-2"), fmt(a, 2)],
                ["m(h⁻²)′", m + " × (−2)(" + fmt(h) + ")" + sup("-3") + " × " + dh, fmt(b, 2)], ["BMI′", fmt(a, 2) + " + (" + fmt(b, 2) + ")", fmt(a + b, 2) + " a year"]],
        take: "Weight gain pushes BMI up " + fmt(a, 2) + " a year; growing taller pulls it down " + fmt(-b, 2) + ". Height counts heavily, which is one reason teen BMI is read against age-based growth charts." };
    } },
  { k: "Science", t: "Walking away from a speaker",
    build() {
      const t = 4, P = 1 + 0.2 * t, d = 1 + 0.5 * t, k = 4 * Math.PI, I = P / (d * d) / k, a = 0.2 / (d * d) / k, b = P * (-2) * Math.pow(d, -3) * 0.5 / k;
      return { setup: "A speaker's power rises as P = 1 + 0.2t watts while you walk away, d = 1 + 0.5t metres. Sound intensity is I = P × d" + sup("-2") + " ÷ 4π. At t = " + t + " s, which effect wins?",
        lines: [["At t = " + t, "P = " + sig(P) + " W, d = " + sig(d) + " m", fmt(I * 1000, 1) + " mW/m²"], ["P′d⁻² ÷ 4π", "0.2 × " + sig(d) + sup("-2") + " ÷ 4π", fmt(a * 1000, 2)],
                ["P(d⁻²)′ ÷ 4π", sig(P) + " × (−2)(" + sig(d) + ")" + sup("-3") + " × 0.5 ÷ 4π", fmt(b * 1000, 2)], ["I′(" + t + ")", fmt(a * 1000, 2) + " + (" + fmt(b * 1000, 2) + ")", fmt((a + b) * 1000, 2) + " mW/m² per s"]],
        take: "Walking away wins, so the sound fades even as the speaker gets louder. The chain rule's −2 makes every metre of distance count double." };
    } },
  { k: "Nature", t: "How fast a tree adds wood",
    build() {
      const t = 20, h = 2 + 0.6 * t, D = 0.05 + 0.01 * t, V = 0.4 * h * D * D, a = 0.4 * 0.6 * D * D, b = 0.4 * h * 2 * D * 0.01;
      return { setup: "A spruce's wood volume is about V = 0.4 × h × D², with height h = 2 + 0.6t m and trunk width D = 0.05 + 0.01t m after t years. How fast is it adding wood at " + t + " years?",
        lines: [["At t = " + t, "h = " + sig(h) + " m, D = " + sig(D) + " m", fmt(V, 3) + " m³"], ["h′D² part", "0.4 × 0.6 × " + sig(D) + "²", fmt(a, 4)],
                ["h(D²)′ part", "0.4 × " + sig(h) + " × 2(" + sig(D) + ") × 0.01", fmt(b, 4)], ["V′(" + t + ")", fmt(a, 4) + " + " + fmt(b, 4), fmt(a + b, 3) + " m³ a year"]],
        take: "Width growth adds about " + sig(b / a, 1) + " times what height adds, because D is squared and the chain rule's 2D grows with the tree. Bigger trees add more wood each year." };
    } }
];

CP.NOTES.ratrad = [
  { k: "Finance", t: "Cheapest order size",
    build() {
      const D = 12000, S = 150, H = 4, K = D * S, q2 = K / (H / 2), q = Math.sqrt(q2), C = K / q + H / 2 * q;
      return { setup: "A store sells " + fmt(D, 0) + " units a year. Each order costs " + money(S, 0) + " to place; holding a unit costs " + money(H, 0) + " a year. Orders of q units cost C(q) = " + fmt(K, 0) + " ÷ q + " + sig(H / 2) + "q a year.",
        lines: [["Derivative", "C′ = −" + fmt(K, 0) + "q" + sup("-2") + " + " + sig(H / 2), ""], ["Set to zero", "q² = " + fmt(K, 0) + " ÷ " + sig(H / 2), fmt(q2, 0)],
                ["Best order", "√" + fmt(q2, 0), fmt(q, 0) + " units"], ["Cost then", fmt(K, 0) + " ÷ " + fmt(q, 0) + " + " + sig(H / 2) + " × " + fmt(q, 0), money(C, 0) + " a year"]],
        take: "At the best size, ordering and holding costs are equal: " + money(C / 2, 0) + " each. Writing 1 ÷ q as q⁻¹ makes this the power rule. Warehouses call √(2DS ÷ H) the economic order quantity." };
    } },
  { k: "Health", t: "When a pill peaks",
    build() {
      const A = 20, k2 = 4, k = Math.sqrt(k2), peak = A * k / (k * k + k2);
      return { setup: "A simple model of a drug in the blood is C(t) = " + A + "t ÷ (t² + " + k2 + ") mg/L, t hours after a pill. When is the level highest?",
        lines: [["Rewrite", "C = " + A + "t(t² + " + k2 + ")" + sup("-1"), ""], ["Product and chain", "C′ = " + A + "(t² + " + k2 + ")" + sup("-1") + " − " + A + "t(t² + " + k2 + ")" + sup("-2") + " × 2t", ""],
                ["Simplify", "C′ = " + A + "(" + k2 + " − t²) ÷ (t² + " + k2 + ")²", ""], ["Set to zero", "t² = " + k2, "t = " + sig(k) + " h"],
                ["Peak level", sig(A * k) + " ÷ " + sig(k * k + k2), fmt(peak, 1) + " mg/L"]],
        take: "The peak comes at t = √" + k2 + " = " + sig(k) + " hours. Models like this help set dosing times so the next pill arrives as the level falls." };
    } },
  { k: "Finance", t: "Bond prices are rational functions", live: "bond5",
    build(L) {
      const y = L.bond5 / 100, c = 30, F = 1000, n = 5;
      let P = 0, dP = 0;
      for (let k = 1; k <= n; k++) { const cf = c + (k === n ? F : 0); P += cf * Math.pow(1 + y, -k); dP += -k * cf * Math.pow(1 + y, -k - 1); }
      const ch = dP * 0.005;
      return { setup: "A 5-year bond pays $30 a year and $1,000 at the end. At today's 5-year yield, " + fmt(L.bond5) + "%, its price is P = 30(1 + y)" + sup("-1") + " + … + 1,030(1 + y)" + sup("-5") + ".",
        lines: [["Price", "sum of 5 payments", money(P)], ["Derivative", "P′ = −30(1 + y)" + sup("-2") + " − 60(1 + y)" + sup("-3") + " − … − " + fmt(n * (c + F), 0) + "(1 + y)" + sup("-6"), ""],
                ["P′(y)", "at y = " + sig(y), money(dP, 0) + " per unit of y"], ["+0.5 point", money(dP, 0) + " × 0.005", money(ch)], ["As a share", money(ch) + " ÷ " + money(P), pct(ch / P, 2)]],
        take: "Each payment is a negative power of (1 + y), so every term of the derivative is negative: prices fall when yields rise. A half-point rise costs this bond about " + pct(-ch / P, 1) + "." };
    } },
  { k: "Finance", t: "A share that pays forever", live: "bond10",
    build(L) {
      const D = 1.25, c = (L.bond10 + 2) / 100, P = D / c, dP = -D / (c * c), ch = dP * 0.0025;
      return { setup: "A preferred share pays " + money(D) + " a year with no end date. Say investors want the 10-year bond yield plus 2 points: c = " + fmt(c * 100) + "%. Its price is P = 1.25 ÷ c.",
        lines: [["Price", "1.25 ÷ " + sig(c), money(P)], ["Derivative", "P = 1.25c" + sup("-1") + ", so P′ = −1.25c" + sup("-2"), ""],
                ["P′(c)", "−1.25 ÷ " + sig(c) + "²", money(dP, 0) + " per unit of c"], ["+0.25 point", money(dP, 0) + " × 0.0025", money(ch)]],
        take: "A quarter point higher cuts the price about " + pct(-ch / P, 1) + ". Because of the c⁻², the lower rates are, the harder each rise hits." };
    } },
  { k: "Finance", t: "Risk grows like a square root",
    build() {
      const s = 15, t1 = 1, t2 = 25, d1 = s / 2 / Math.sqrt(t1), d2 = s / 2 / Math.sqrt(t2);
      return { setup: "A stock fund's yearly returns swing with a standard deviation of about " + s + "%. If years are independent, the spread of total returns after t years is about σ = " + s + "√t percent.",
        lines: [["Derivative", "σ = " + s + "t" + sup("1/2") + ", so σ′ = " + sig(s / 2) + "t" + sup("-1/2"), ""], ["After " + t1 + " year", sig(s / 2) + " ÷ √" + t1, fmt(d1, 1) + " points a year"],
                ["After " + t2 + " years", sig(s / 2) + " ÷ √" + t2, fmt(d2, 1) + " points a year"], ["Spread at " + t2 + " years", s + "√" + t2, fmt(s * Math.sqrt(t2), 0) + "%"]],
        take: "Uncertainty keeps growing, but each year adds less, because the derivative of √t shrinks like 1 ÷ √t. By year " + t2 + ", one more year adds only 1/" + sig(d1 / d2) + " as much spread as the first year did." };
    } },
  { k: "Science", t: "Focusing a camera lens",
    build() {
      const f = 50, d1 = 2000, d2 = 500, r1 = f * f / Math.pow(d1 - f, 2), r2 = f * f / Math.pow(d2 - f, 2);
      return { setup: "A " + f + " mm lens forms an image at dᵢ = " + f + "d ÷ (d − " + f + ") mm for a subject d mm away. How far must the lens move as the subject comes closer?",
        lines: [["Rewrite", "dᵢ = " + f + " + " + fmt(f * f, 0) + "(d − " + f + ")" + sup("-1"), ""], ["Derivative", "dᵢ′ = −" + fmt(f * f, 0) + "(d − " + f + ")" + sup("-2"), ""],
                ["Subject at " + sig(d1 / 1000) + " m", fmt(f * f, 0) + " ÷ " + fmt(d1 - f, 0) + "²", fmt(r1 * 1000, 2) + " mm per metre"],
                ["Subject at " + sig(d2 / 1000) + " m", fmt(f * f, 0) + " ÷ " + fmt(d2 - f, 0) + "²", fmt(r2 * 1000, 1) + " mm per metre"]],
        take: "Close up, the image shifts about " + fmt(r2 / r1, 0) + " times as far for each metre the subject moves. That is why focus is touchy for close subjects and easy for distant ones." };
    } },
  { k: "Tech", t: "Distance to a drone",
    build() {
      const h = 120, v = 10, rate = x => x * v / Math.sqrt(x * x + h * h);
      return { setup: "A drone flies at " + h + " m, just under Canada's 122 m limit for small drones, heading straight away from you at " + v + " m/s. Its distance from you is D = √(x² + " + h + "²).",
        lines: [["Chain rule", "D′ = ½(x² + " + h + "²)" + sup("-1/2") + " × 2x × x′", ""], ["Overhead, x = 0", "0 × " + v + " ÷ " + h, fmt(rate(0), 2) + " m/s"],
                ["x = 50 m", "50 × " + v + " ÷ √(50² + " + h + "²)", fmt(rate(50), 2) + " m/s"], ["x = 500 m", "500 × " + v + " ÷ √(500² + " + h + "²)", fmt(rate(500), 2) + " m/s"]],
        take: "Overhead, its motion is all sideways, so the distance does not grow at first. Far away, it grows at nearly the full " + v + " m/s. Radio range estimates depend on this." };
    } },
  { k: "Nature", t: "Why a tsunami slows near shore",
    build() {
      const g = 9.8, d1 = 4000, d2 = 10, v1 = Math.sqrt(g * d1), v2 = Math.sqrt(g * d2), s1 = g / 2 / v1, s2 = g / 2 / v2;
      return { setup: "A wave much longer than the water is deep, like a tsunami, travels at about v = √(" + g + "d) m/s in water d metres deep.",
        lines: [["Derivative", "v′ = ½(" + g + "d)" + sup("-1/2") + " × " + g + " = " + sig(g / 2) + " ÷ v", ""], ["Open ocean, " + fmt(d1, 0) + " m", "√(" + g + " × " + fmt(d1, 0) + ")", fmt(v1, 0) + " m/s"],
                ["Its slope there", sig(g / 2) + " ÷ " + fmt(v1, 0), fmt(s1, 3) + " m/s per m"], ["Near shore, " + d2 + " m", "v = √(" + sig(g * d2) + "); " + sig(g / 2) + " ÷ " + fmt(v2, 1), fmt(v2, 1) + " m/s; " + fmt(s2, 2) + " m/s per m"]],
        take: "In deep water a tsunami moves at about " + fmt(v1 * 3.6, 0) + " km/h and depth barely matters. Near shore each metre of depth changes its speed " + sig(s2 / s1, 0) + " times as much, so it slows sharply and piles up." };
    } }
];
})();
