/* Chalk and Paper – content, part three
   Twelve steps that complete the MCV4U expectations, the seven units, and the full 36-step order.
   Loaded after content-more.js. */

window.CP = window.CP || {};
(function () {
const M = "−";
const neg = x => String(x).replace(/-/g, M);
const num = (x, d = 2) => neg(Number(x).toFixed(d));
function numOptions(correct, wrongs, fmt) {
  const seen = new Set([fmt(correct)]), opts = [{ html: fmt(correct), ok: true }];
  for (const w of wrongs) { const s = fmt(w.v); if (seen.has(s)) continue; seen.add(s); opts.push({ html: s, ok: false, why: w.why }); if (opts.length === 4) break; }
  let bump = 1;
  while (opts.length < 4) { const s = fmt(correct * (1 + 0.37 * bump)); if (!seen.has(s)) { seen.add(s); opts.push({ html: s, ok: false, why: "Not the value the calculation gives." }); } bump++; }
  return opts;
}
const fixed = (setup, lines, answer, why, q, options) => ({ kind: "fixed", live: null, build() { return { source: "Fixed example", setup, lines, answer, why, q, options }; } });

const more = [
  {
    id: "limits", track: "mcv4u", name: "Limits", short: "Limits", code: "MCV4U A1.4", prereq: "slope", weight: 1,
    rule: {
      r: "A limit is the value a function closes in on, whether or not it ever gets there. As x grows, (ax + b) ÷ (cx + d) closes in on a ÷ c. At a hole, factor and cancel first, then put the number in.",
      tip: "For x → ∞, keep only the biggest power on top and bottom. Everything else shrinks out of the picture.",
      trap: "0 ÷ 0 is not an answer. It means more work is needed: factor, cancel, then substitute."
    },
    practical: fixed("A bakery pays $5,000 a month in rent and $12 in ingredients per cake. Its average cost per cake is A(q) = (5000 + 12q) ÷ q. What happens as it sells more and more?",
      [["100 cakes", "5000 ÷ 100 + 12", "$62.00"], ["1,000 cakes", "5000 ÷ 1000 + 12", "$17.00"], ["100,000 cakes", "5000 ÷ 100000 + 12", "$12.05"], ["Limit", "q → ∞", "$12.00"]],
      "The average cost closes in on $12 a cake but never quite reaches it. The rent gets spread thinner and thinner.",
      "The limit as q → ∞ keeps only the terms that grow: 12q ÷ q = 12. That is why big chains can undercut small shops: their fixed costs per item approach zero, and only the per-item cost is left.",
      "Another shop: A(q) = (8000 + 9q) ÷ q. What does the average cost close in on?",
      [{ html: "$9", ok: true }, { html: "$8,009", ok: false, why: "That is the cost of one item, A(1). The limit is about very large q." },
       { html: "$17", ok: false, why: "That is A(1000). Keep going: the 8000 ÷ q part keeps shrinking." }, { html: "$0", ok: false, why: "The fixed cost per item shrinks to 0, but each item still costs $9 to make." }])
  },
  {
    id: "fracpow", track: "mcv4u", name: "Roots and negative powers", short: "Roots and powers", code: "MCV4U A3.4", prereq: "pow1", weight: 2,
    rule: {
      r: "The power rule works for any power. Write roots as fraction powers and 1 ÷ xⁿ as x⁻ⁿ first. √x = x^(1/2), so its derivative is ½x^(−1/2) = 1 ÷ (2√x).",
      tip: "Rewrite, differentiate, rewrite back. Never differentiate a root or a fraction as it stands.",
      trap: "Lowering a negative or fraction power by one: −2 − 1 = −3, and 1/2 − 1 = −1/2. The power moves further down, not toward zero."
    },
    practical: fixed("A warehouse's monthly cost grows like C(q) = 600√q dollars for q orders. Each extra order costs less than the last. How much does one more order add?",
      [["Rewrite", "C(q) = 600q^(1/2)", ""], ["Differentiate", "C′(q) = 300q^(−1/2) = 300 ÷ √q", ""], ["At 100 orders", "300 ÷ 10", "$30"], ["At 400 orders", "300 ÷ 20", "$15"]],
      "The 100th order adds about $30. The 400th adds about $15. Quadruple the volume, half the extra cost.",
      "A square-root cost curve is an economy of scale. The derivative of √q is 1 ÷ (2√q), which shrinks as q grows. That shrinking derivative is the whole business case for getting bigger.",
      "What does one more order add at 900 orders?",
      [{ html: "$10", ok: true }, { html: "$18,000", ok: false, why: "That is C(900), the total cost. The extra cost is C′(900) = 300 ÷ 30." },
       { html: "$20", ok: false, why: "You forgot the ½ from the power rule: C′ = 300 ÷ √q, not 600 ÷ √q." }, { html: "$0.33", ok: false, why: "You divided by 900 instead of √900 = 30." }])
  },
  {
    id: "ratrad", track: "mcv4u", name: "Rational and radical functions", short: "Rational and radical", code: "MCV4U A3.5, B1.3, B2.4", prereq: "chain", weight: 3,
    rule: {
      r: "Write a fraction as a product with a negative power: (x² + 1) ÷ (x − 1) = (x² + 1)(x − 1)⁻¹. Write a root as a power: √(x² + 5) = (x² + 5)^(1/2). Then use the product and chain rules.",
      tip: "a ÷ (x + b) differentiates to −a ÷ (x + b)². The square on the bottom and the minus sign always appear together.",
      trap: "The chain rule still applies inside the root: the derivative of √(x² + 5) is (1/2)(x² + 5)^(−1/2) × 2x, not just (1/2)(x² + 5)^(−1/2)."
    },
    practical: fixed("A print shop's average cost per poster is A(q) = 1800 ÷ q + 6 + 0.02q dollars: fixed costs spread out, but bigger runs need overtime. Which run size is cheapest per poster?",
      [["Derivative", "A′(q) = −1800q⁻² + 0.02", ""], ["Set to zero", "1800 ÷ q² = 0.02, q² = 90,000", "q = 300"], ["Cost then", "1800 ÷ 300 + 6 + 0.02 × 300", "$18 each"]],
      "Runs of 300 are cheapest, at $18 a poster.",
      "A rational function, a fraction with q on the bottom, gets its derivative through q⁻¹. Setting it to zero balances two forces: fixed costs falling per item, and overtime rising. That balance is behind every 'minimum order' rule.",
      "Fixed costs rise to $3,200: A(q) = 3200 ÷ q + 6 + 0.02q. Cheapest run?",
      [{ html: "400 posters", ok: true }, { html: "300 posters", ok: false, why: "That was the old fixed cost. Now q² = 3200 ÷ 0.02 = 160,000." },
       { html: "160,000 posters", ok: false, why: "That is q². Take the square root." }, { html: "566 posters", ok: false, why: "You divided by 0.01. The equation is 3200 ÷ q² = 0.02." }])
  },
  {
    id: "lnexp", track: "mcv4u", name: "ln x and eˣ", short: "ln and eˣ", code: "MCV4U A2.7", prereq: "trigexp", weight: 2,
    rule: {
      r: "ln x is the inverse of eˣ: ln(eˣ) = x and e^(ln x) = x. To solve e^(kt) = A, take ln of both sides: kt = ln A, so t = ln A ÷ k.",
      tip: "ln answers one question: what power of e gives this? ln 1 = 0, ln e = 1, ln 2 ≈ 0.693.",
      trap: "ln(a + b) is not ln a + ln b. The log rules turn products into sums: ln(ab) = ln a + ln b."
    },
    practical: {
      kind: "finance", live: "bond5",
      build(L) {
        const y = L.bond5 / 100, t2 = Math.log(2) / y, t3 = Math.log(3) / y, yrs = v => num(v, 1) + " years";
        return {
          source: "Government of Canada 5-year bond yield " + num(L.bond5) + "%",
          setup: "Money compounding continuously at the 5-year yield, " + num(L.bond5) + "%, grows as e^(" + num(y, 4) + "t). How long until it doubles?",
          lines: [["Equation", "e^(" + num(y, 4) + "t) = 2", ""], ["Take ln", num(y, 4) + "t = ln 2 = 0.6931", ""], ["Solve", "0.6931 ÷ " + num(y, 4), yrs(t2)]],
          answer: "At today's yield, money doubles in about " + yrs(t2) + ".",
          why: "ln undoes e. Taking ln of both sides brings the exponent down where you can solve for it. The rule of 72 is this calculation rounded: ln 2 ≈ 0.69, and 72 is easier to divide.",
          q: "How long until it triples?",
          options: numOptions(t3, [
            { v: 3 / y, why: "You divided 3 by the rate. Take ln 3 first: ln 3 ≈ 1.099." },
            { v: 1.5 * t2, why: "Tripling is not one and a half doublings. Solve e^(kt) = 3: t = ln 3 ÷ k." },
            { v: 2 * t2, why: "Two doublings quadruple the money. Tripling takes less time." }
          ], yrs)
        };
      }
    }
  },
  {
    id: "graphs", track: "mcv4u", name: "Reading derivatives from graphs", short: "Graphs of f′", code: "MCV4U A2.1, A2.2, A2.4, A2.5, B1.1", prereq: "polyd", weight: 2,
    rule: {
      r: "The graph of f′ records the slope of f. Where f rises, f′ is above the axis. Where f falls, f′ is below. Where f has a flat turning point, f′ crosses zero.",
      tip: "Scan f from left to right and say the slope out loud: up, flat, down, flat, up. Then draw f′ as above, zero, below, zero, above.",
      trap: "f′ is not a copy of f. A high point on f is a zero on f′, not a high point."
    },
    practical: fixed("A shop's monthly revenue is R(m) = 2m³ − 27m² + 84m + 300 thousand dollars, m months after opening. Its graph rises, dips, then rises again. When is it falling?",
      [["Derivative", "R′(m) = 6m² − 54m + 84", ""], ["Factor", "6(m − 2)(m − 7)", ""], ["Before month 2", "both factors negative", "R′ > 0, rising"], ["Months 2 to 7", "one factor negative", "R′ < 0, falling"], ["After month 7", "both positive", "R′ > 0, rising"]],
      "Revenue grows to month 2, slides until month 7, then recovers.",
      "The sign of R′ is the direction of the revenue graph. Analysts read a chart this way all the time: the turning points of the chart are the zeros of its rate of change.",
      "During which months was revenue falling?",
      [{ html: "Between month 2 and month 7", ok: true }, { html: "Before month 2", ok: false, why: "R′ is positive before month 2: both factors are negative, so their product is positive." },
       { html: "After month 7", ok: false, why: "After month 7 both factors are positive, so R′ > 0: rising." }, { html: "Only at months 2 and 7", ok: false, why: "Those are the turning points, where R′ = 0 and the graph is flat for an instant." }])
  },
  {
    id: "sketch", track: "mcv4u", name: "Sketching from derivatives", short: "Sketching", code: "MCV4U B1.2, B1.4, B1.5", prereq: "concav", weight: 3,
    rule: {
      r: "To sketch f: find where f′ = 0 (flat points) and where f′ changes sign (max or min). Then find where f″ = 0 and changes sign (inflection). Mark the y-intercept and the end behaviour, then join the dots.",
      tip: "A sign chart does most of the work: one row for f′ (up or down), one row for f″ (smile or frown).",
      trap: "Knowing only f′, you know the shape of f but not its height. Any vertical shift of f has the same f′, which is why many graphs can fit."
    },
    practical: fixed("A game's weekly sales rate is S′(t) = 30t − 3t² thousand copies, t weeks after launch. When are total sales growing fastest, and when do they stop growing?",
      [["Rate is zero", "3t(10 − t) = 0", "t = 0, t = 10"], ["Rate's own slope", "S″(t) = 30 − 6t", ""], ["S″ = 0", "t = 5", "fastest growth"], ["After week 10", "S′ < 0", "returns exceed sales"]],
      "Total sales grow fastest at week 5, keep growing more slowly until week 10, then fall as returns outpace new sales.",
      "From S′ alone you can sketch S: rising where S′ > 0, steepest where S′ peaks, and topping out where S′ crosses zero. Publishers use exactly this curve to plan print runs.",
      "When are total sales growing fastest?",
      [{ html: "Week 5", ok: true }, { html: "Week 10", ok: false, why: "At week 10 the sales rate hits zero: that is when total sales stop growing, the top of S." },
       { html: "Week 0", ok: false, why: "At launch the rate is 0 and climbing." }, { html: "Week 15", ok: false, why: "By week 15 the rate is negative: total sales are falling." }])
  },
  {
    id: "bearings", track: "mcv4u", name: "Vectors with bearings and trig", short: "Bearings", code: "MCV4U C1.2, C1.3", prereq: "vbasic", weight: 2,
    rule: {
      r: "A 2D vector can be written as a length and a direction, or as components. Components: x = r cos θ, y = r sin θ. Back again: r = √(x² + y²), θ = tan⁻¹(y ÷ x), adding 180° when x < 0.",
      tip: "Bearings start at north. N 40° W means face north, then turn 40° toward west. A three-figure bearing like 320° turns clockwise from north.",
      trap: "tan⁻¹ only returns angles between −90° and 90°. For a vector pointing left, add 180°, or you get the opposite direction."
    },
    practical: fixed("A courier's drone flies straight from the depot to a customer 8 km east and 6 km north. It charges $2 per km of flight. What heading and price?",
      [["Distance", "√(8² + 6²)", "10 km"], ["Angle from north", "tan⁻¹(8 ÷ 6)", "53°"], ["Bearing", "N 53° E", ""], ["Price", "10 × $2", "$20"]],
      "The drone flies 10 km on a bearing of N 53° E, for $20. A truck on the roads would drive 14 km.",
      "Turning components into a length and a bearing is how every GPS, drone and ship states a course. The straight-line distance comes from Pythagoras; the heading comes from tan⁻¹.",
      "Another customer is 5 km east and 12 km north. Price?",
      [{ html: "$26", ok: true }, { html: "$34", ok: false, why: "You added the legs, 5 + 12 = 17 km. The drone flies the diagonal: √(25 + 144) = 13 km." },
       { html: "$13", ok: false, why: "That is the distance in km. Multiply by $2." }, { html: "$24", ok: false, why: "That uses only the north leg, 12 km. Use the diagonal, 13 km." }])
  },
  {
    id: "triple", track: "mcv4u", name: "Triple product and vector laws", short: "Vector laws", code: "MCV4U C2.2, C2.5, C2.7, C2.8", prereq: "crossp", weight: 3,
    rule: {
      r: "u · (v × w) is the volume of the slanted box (parallelepiped) the three vectors make, up to a sign. Zero means the three lie in one plane. Dot products commute; cross products reverse sign when swapped; neither is associative.",
      tip: "Test any claimed vector law with the simplest vectors you know: i = (1, 0, 0), j = (0, 1, 0), k = (0, 0, 1). One failure kills it.",
      trap: "u × v ≠ v × u. Swapping the order flips the direction: v × u = −(u × v)."
    },
    practical: fixed("A slanted storage bin has edges u = (4, 0, 0), v = (1, 3, 0) and w = (0, 1, 2), in metres. Storage costs $15 per m³ a month. What does it cost?",
      [["v × w", "(3·2 − 0·1, 0·0 − 1·2, 1·1 − 3·0)", "(6, −2, 1)"], ["u · (v × w)", "4 × 6 + 0 + 0", "24"], ["Volume", "|24|", "24 m³"], ["Monthly cost", "24 × $15", "$360"]],
      "The bin holds 24 m³ and costs $360 a month.",
      "The triple product handles the slant for you: no right angles needed. Its absolute value is the volume, which is what you pay to store or ship.",
      "The third edge becomes w = (0, 1, 3). Monthly cost?",
      [{ html: "$540", ok: true }, { html: "$360", ok: false, why: "That was the old bin. Now v × w = (9, −3, 1), so the volume is 36 m³." },
       { html: "$36", ok: false, why: "That is the volume in m³. Multiply by $15." }, { html: "$600", ok: false, why: "You multiplied the edge lengths, 4 × √10 × √10 = 40. That only works for a box with right angles." }])
  },
  {
    id: "lines2d", track: "mcv4u", name: "Lines in 2D: forms and crossings", short: "2D lines", code: "MCV4U C3.1, C4.1", prereq: "vbasic", weight: 2,
    rule: {
      r: "A 2D line has three forms. Vector: r = (x₀, y₀) + t(a, b). Parametric: x = x₀ + at, y = y₀ + bt. Scalar: Ax + By + C = 0, where (A, B) is a normal, at right angles to the direction (a, b).",
      tip: "Direction (a, b) gives normal (b, −a): swap and change one sign. Then put the point in to find C.",
      trap: "Two lines with parallel directions never cross, unless they are the same line. Check before solving."
    },
    practical: fixed("Phone plan A costs $30 a month plus $0.10 a minute. Plan B costs $45 plus $0.05 a minute. When are they equal?",
      [["Plan A", "c = 30 + 0.10m", ""], ["Plan B", "c = 45 + 0.05m", ""], ["Set equal", "30 + 0.10m = 45 + 0.05m", ""], ["Solve", "0.05m = 15", "m = 300 min, $60"]],
      "Under 300 minutes, plan A is cheaper. Over 300, plan B wins.",
      "Each plan is a line, and the break-even point is where the two lines cross. Every 'which plan is better' question is two linear equations solved together.",
      "Plan C costs $20 plus $0.15 a minute. Where does it cross plan A?",
      [{ html: "200 minutes", ok: true }, { html: "300 minutes", ok: false, why: "That is where A and B cross. Solve 30 + 0.10m = 20 + 0.15m." },
       { html: "100 minutes", ok: false, why: "You divided the $10 gap by 0.10. Divide by the difference in rates, 0.05." }, { html: "67 minutes", ok: false, why: "You divided by 0.15. The rates' difference is 0.15 − 0.10 = 0.05." }])
  },
  {
    id: "planeforms", track: "mcv4u", name: "Plane equations in every form", short: "Plane forms", code: "MCV4U C4.2, C4.5, C4.6", prereq: "planes", weight: 3,
    rule: {
      r: "Vector form: r = P + s·u + t·v, with two directions in the plane. Scalar form: ax + by + cz = d. To go from vector to scalar, n = u × v and d = n · P. A line in 3D can also be written as two planes meeting; its direction is n₁ × n₂.",
      tip: "Scalar to vector: find any point by setting two variables to 0, then find two directions at right angles to n.",
      trap: "The two directions in vector form must not be parallel. Parallel directions give a line, not a plane."
    },
    practical: fixed("Everything you can buy for exactly $120, with items at $4, $6 and $2, is the plane 4x + 6y + 2z = 120. Start at (0, 0, 60): sixty of the $2 item. Each swap is a direction in the plane.",
      [["Start", "P = (0, 0, 60)", ""], ["Swap 1", "one $4 item for two $2 items: u = (1, 0, −2)", ""], ["Swap 2", "one $6 item for three $2 items: v = (0, 1, −3)", ""], ["Vector form", "r = (0, 0, 60) + s(1, 0, −2) + t(0, 1, −3)", ""]],
      "Every affordable basket is the start plus some number of each swap.",
      "Vector form describes a plane by moves you can make inside it. Here the moves are trades that keep the bill at $120, which is how budgeting software walks along the options.",
      "Make s = 5 swaps of the first kind and t = 10 of the second. What basket do you get?",
      [{ html: "(5, 10, 20)", ok: true }, { html: "(5, 10, 60)", ok: false, why: "You didn't apply the z parts of the swaps: 60 − 2(5) − 3(10) = 20." },
       { html: "(10, 5, 25)", ok: false, why: "s goes with the first direction, (1, 0, −2), so x = 5." }, { html: "(5, 10, 25)", ok: false, why: "The first swap takes 2 per step (× 5 = 10) and the second takes 3 per step (× 10 = 30)." }])
  },
  {
    id: "planesys", track: "mcv4u", name: "Where planes meet", short: "Planes meeting", code: "MCV4U C3.2, C4.4", prereq: "planes", weight: 3,
    rule: {
      r: "Two planes that are not parallel meet in a line. Three planes can meet at one point, along a line, or not at all. To find the point, eliminate one variable at a time until one equation in one unknown remains.",
      tip: "Compare normals first. Parallel normals mean parallel planes, the same plane, or a gap: no need to solve.",
      trap: "0 = 0 after eliminating means infinitely many solutions (a line or a plane). 0 = 5 means none at all."
    },
    practical: fixed("You split $30,000 among three funds paying 2%, 4% and 6%, want $1,050 a year in income, and want twice as much in fund A as in fund C. How much in each?",
      [["Equations", "x + y + z = 30000; 0.02x + 0.04y + 0.06z = 1050; x = 2z", ""], ["Substitute x = 2z", "y = 30000 − 3z", ""], ["Income", "0.04z + 0.04(30000 − 3z) + 0.06z = 1050", "z = 7,500"], ["Then", "x = 15,000, y = 7,500", ""]],
      "Put $15,000 in A, $7,500 in B and $7,500 in C.",
      "Each condition is a plane in (x, y, z). Three planes meeting at one point means exactly one portfolio satisfies all three wishes. Change a wish and the point moves, or vanishes.",
      "You lower the income target to $1,000. Now what?",
      [{ html: "A $20,000, B $0, C $10,000", ok: true }, { html: "A $15,000, B $7,500, C $7,500", ok: false, why: "That pays $1,050. The new target is $1,000: −0.02z = −200, so z = 10,000." },
       { html: "A $10,000, B $10,000, C $10,000", ok: false, why: "That pays $1,200 and breaks the A = 2C rule." }, { html: "A $20,000, B $10,000, C $0", ok: false, why: "A should be twice C. With C = 0, A would have to be 0 too." }])
  },
  {
    id: "skew", track: "mcv4u", name: "Lines in 3D: meet, parallel or skew", short: "Skew lines", code: "MCV4U C3.3, C4.7", prereq: "lines", weight: 3,
    rule: {
      r: "Two lines in 3D either meet, run parallel, or are skew: not parallel and never meeting. The distance between skew lines is |(Q − P) · (d₁ × d₂)| ÷ |d₁ × d₂|.",
      tip: "Parallel directions first. If they are not parallel, set the two lines equal and solve for s and t with two coordinates; then check the third.",
      trap: "In 2D, non-parallel lines always meet. In 3D they usually don't. The third coordinate is the test."
    },
    practical: fixed("Two drone corridors: r₁ = (0, 0, 100) + t(1, 0, 0) and r₂ = (0, 50, 130) + s(0, 1, 0), in metres. Rules require 20 m of separation. Is it safe?",
      [["Directions", "(1, 0, 0) and (0, 1, 0)", "not parallel"], ["d₁ × d₂", "(0, 0, 1)", ""], ["Q − P", "(0, 50, 30)", ""], ["Distance", "|(0, 50, 30) · (0, 0, 1)| ÷ 1", "30 m"]],
      "The corridors pass 30 m apart at the closest point. Safe.",
      "Skew lines never meet, but they do have a closest approach. The cross product gives the direction at right angles to both, and the dot product measures the gap along it. Air traffic control works on exactly this.",
      "The second corridor drops to r₂ = (0, 50, 115) + s(0, 1, 0). New separation?",
      [{ html: "15 m", ok: true }, { html: "30 m", ok: false, why: "That was the old height. Now Q − P = (0, 50, 15)." },
       { html: "52.2 m", ok: false, why: "That is the distance between the two starting points. The closest approach is along d₁ × d₂ = (0, 0, 1)." }, { html: "50 m", ok: false, why: "That is the sideways offset of the starting points, not the gap along d₁ × d₂." }])
  }
];
CP.STEPS.push(...more);

/* Seven units, in the order most Ontario classes teach them. */
CP.UNITS = [
  { id: "u1", name: "Rates and limits", steps: ["exp", "frac", "slope", "limits", "firstp"] },
  { id: "u2", name: "Derivative rules", steps: ["pow1", "polyd", "tan", "fracpow", "prod", "chain", "combo", "ratrad"] },
  { id: "u3", name: "Exponential and trig", steps: ["trigexp", "lnexp", "exprate"] },
  { id: "u4", name: "Curve sketching", steps: ["graphs", "maxmin", "concav", "sketch"] },
  { id: "u5", name: "Applications", steps: ["motion", "optim"] },
  { id: "u6", name: "Vectors", steps: ["vbasic", "bearings", "dotp", "angle", "crossp", "triple"] },
  { id: "u7", name: "Lines and planes", steps: ["lines2d", "lines", "planes", "planeforms", "lineplane", "planesys", "skew", "dist"] }
];
const ORDER = CP.UNITS.reduce((a, u) => a.concat(u.steps), []);
for (const st of CP.STEPS) { st.order = ORDER.indexOf(st.id) + 1; st.unit = (CP.UNITS.find(u => u.steps.includes(st.id)) || {}).id; }
CP.STEPS.sort((a, b) => a.order - b.order);
CP.unitById = id => CP.UNITS.find(u => u.id === id);
CP.unitOf = stepId => CP.UNITS.find(u => u.steps.includes(stepId));
})();
