/* Worked notes: exponent laws. */
(function () {
const { fmt, money, pct, sig, sup } = CP.nh;
CP.NOTES.exp = [
  { k: "Finance", t: "Compound interest is an exponent law", live: "policy",
    build(L) {
      const r = L.policy / 100, P = 10000, a = Math.pow(1 + r, 3), b = Math.pow(1 + r, 2);
      return { setup: money(P, 0) + " earns the policy rate, " + fmt(L.policy) + "% a year. Leave it 3 years, then 2 more.",
        lines: [["3 years", "(1 + " + sig(r) + ")" + sup(3), fmt(a, 4)], ["2 more", "(1 + " + sig(r) + ")" + sup(2), fmt(b, 4)],
                ["Together", fmt(a, 4) + " × " + fmt(b, 4) + " = (1 + " + sig(r) + ")" + sup(5), fmt(a * b, 4)], ["Balance", money(P, 0) + " × " + fmt(a * b, 4), money(P * a * b)]],
        take: "x³ · x² = x⁵ because the years add. Every compounding statement is the product rule for exponents." };
    } },
  { k: "Tech", t: "How many photos fit on a phone",
    build() {
      const S = 37, P = 22;
      return { setup: "A 128 GB phone holds 2" + sup(S) + " bytes. A 4 MB photo is 2" + sup(P) + " bytes.",
        lines: [["Phone", "2" + sup(S), fmt(Math.pow(2, S), 0) + " bytes"], ["Photo", "2" + sup(P), fmt(Math.pow(2, P), 0) + " bytes"],
                ["Divide", "2" + sup(S) + " ÷ 2" + sup(P) + " = 2" + sup(S - P), ""], ["Photos", "2" + sup(S - P), fmt(Math.pow(2, S - P), 0)]],
        take: "Dividing powers subtracts exponents: 37 − 22 = 15. Computer sizes are powers of 2, so this is how storage is counted." };
    } },
  { k: "Finance", t: "The rule of 72, as powers of 2",
    build() {
      const r = 0.08, d = 72 / 8, n = 36 / d, P = 25000, exact = Math.pow(1 + r, 36);
      return { setup: "At 8% a year, money doubles about every 72 ÷ 8 = 9 years. Leave " + money(P, 0) + " for 36 years.",
        lines: [["Doublings", "36 ÷ 9", sig(n)], ["Growth factor", "2" + sup(n), sig(Math.pow(2, n))], ["Rule of 72", money(P, 0) + " × " + Math.pow(2, n), money(P * Math.pow(2, n), 0)],
                ["Exact", money(P, 0) + " × 1.08" + sup(36), money(P * exact, 0)]],
        take: "Four doublings is 2⁴ = 16 times, not 2 × 4 = 8. The shortcut lands within a few percent of the exact answer." };
    } },
  { k: "Science", t: "How long sunlight takes to reach you",
    build() {
      const d = 1.5e11, c = 3e8, t = d / c;
      return { setup: "The Sun is 1.5 × 10" + sup(11) + " m away. Light travels 3 × 10" + sup(8) + " m/s.",
        lines: [["Divide the numbers", "1.5 ÷ 3", "0.5"], ["Divide the powers", "10" + sup(11) + " ÷ 10" + sup(8) + " = 10" + sup(3), "1,000"],
                ["Time", "0.5 × 1,000", fmt(t, 0) + " s"], ["In minutes", fmt(t, 0) + " ÷ 60", fmt(t / 60, 1) + " min"]],
        take: "Scientific notation splits every calculation into plain numbers and an exponent law. The sunlight you see left the Sun about 8 minutes ago." };
    } },
  { k: "Finance", t: "What inflation does to a pension",
    build() {
      const i = 0.02, n = 35, P = 30000, f = Math.pow(1 + i, n);
      return { setup: "A pension pays " + money(P, 0) + " a year with no inflation increases. Prices rise 2% a year for " + n + " years.",
        lines: [["Price growth", "1.02" + sup(n), fmt(f, 3)], ["Buying power", money(P, 0) + " ÷ " + fmt(f, 3), money(P / f, 0)], ["Lost", "1 − 1 ÷ " + fmt(f, 3), pct(1 - 1 / f, 0)]],
        take: "1.02³⁵ is almost exactly 2. Prices double over a working life, so an un-indexed pension buys about half as much by the end." };
    } },
  { k: "Science", t: "Why loud noise does damage so fast",
    build() {
      const a = 90, b = 60, n = (a - b) / 10;
      return { setup: "Every 10 dB is 10 times the sound energy. Compare a " + a + " dB lawnmower with " + b + " dB conversation.",
        lines: [["Difference", a + " − " + b, (a - b) + " dB"], ["Steps of 10 dB", (a - b) + " ÷ 10", String(n)], ["Energy ratio", "10" + sup(n), fmt(Math.pow(10, n), 0) + " times"]],
        take: "Decibels are exponents. Thirty more decibels is 10 × 10 × 10 = 1,000 times the energy, which is why hearing protection matters long before sound hurts." };
    } },
  { k: "Finance", t: "A 2% fee over 30 years",
    build() {
      const g = 0.06, fee = 0.02, n = 30, P = 50000, A = P * Math.pow(1 + g, n), B = P * Math.pow(1 + g - fee, n);
      return { setup: money(P, 0) + " grows at 6% a year for " + n + " years. One fund charges nothing; another charges 2% a year.",
        lines: [["No fee", money(P, 0) + " × 1.06" + sup(n), money(A, 0)], ["2% fee", money(P, 0) + " × 1.04" + sup(n), money(B, 0)],
                ["Fee's share", "1 − " + money(B, 0) + " ÷ " + money(A, 0), pct(1 - B / A, 0)]],
        take: "The fee looks small each year, but it compounds too: (1.04 ÷ 1.06)³⁰ ≈ 0.56. Over 30 years it takes almost half the final balance." };
    } },
  { k: "Health", t: "Why the reproduction number matters",
    build() {
      const R = 2, k = 10;
      return { setup: "Each case infects R others. Follow one case through " + k + " rounds of spread.",
        lines: [["R = 2", "2" + sup(k), fmt(Math.pow(2, k), 0) + " cases"], ["R = 1.5", "1.5" + sup(k), fmt(Math.pow(1.5, k), 0) + " cases"], ["R = 0.9", "0.9" + sup(k), fmt(Math.pow(0.9, k), 2) + " cases"]],
        take: "Same exponent, different base. Above 1 the cases multiply; below 1 they fade. Public health is about pushing the base under 1." };
    } }
];
})();
