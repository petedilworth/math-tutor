/* Chalk and Paper – content, part two
   Ten more MCV4U steps, the tier names, and the full course order.
   Loaded after content.js. Wrapped so its helpers do not clash with content.js's. */

window.CP = window.CP || {};
(function () {
const M = "−";
const neg = x => String(x).replace(/-/g, M);
const num = (x, d = 2) => neg(Number(x).toFixed(d));
const cad = (x, d = 2) => "C$" + neg(Number(x).toLocaleString("en-CA", { minimumFractionDigits: d, maximumFractionDigits: d }));
function numOptions(correct, wrongs, fmt) {
  const seen = new Set([fmt(correct)]), opts = [{ html: fmt(correct), ok: true }];
  for (const w of wrongs) { const s = fmt(w.v); if (seen.has(s)) continue; seen.add(s); opts.push({ html: s, ok: false, why: w.why }); if (opts.length === 4) break; }
  let bump = 1;
  while (opts.length < 4) { const s = fmt(correct * (1 + 0.37 * bump)); if (!seen.has(s)) { seen.add(s); opts.push({ html: s, ok: false, why: "Not the value the calculation gives." }); } bump++; }
  return opts;
}

/* Five tiers. Expert and Master mix in spot-the-error and work-backwards questions. */
CP.TIERS = ["Easy", "Medium", "Hard", "Expert", "Master"];
CP.TIER_NOTE = [
  "Small numbers, one idea at a time.",
  "Negatives and bigger numbers.",
  "Longer expressions, more places to slip.",
  "Spot the error and work backwards, mixed with hard ones.",
  "Mostly spot the error and work backwards. No rule reminder."
];

const more = [
  {
    id: "firstp", track: "mcv4u", name: "Derivative from first principles", short: "First principles", code: "MCV4U A1.5, A1.6, A2.3", prereq: "slope", weight: 2,
    rule: {
      r: "The derivative is the limit of the difference quotient: f′(x) = lim as h → 0 of [f(x + h) − f(x)] ÷ h. Expand, cancel, divide by h, then let h shrink to 0.",
      tip: "Four moves, always in this order: expand f(x + h), subtract f(x), divide every term by h, then set h to 0.",
      trap: "Do not put h = 0 in before dividing. You get 0 ÷ 0, which tells you nothing. Divide first, then let h go."
    },
    practical: {
      kind: "science", live: null,
      build() {
        return {
          source: "Fixed example",
          setup: "A dropped phone falls s(t) = 4.9t² metres in t seconds. How fast is it going at exactly 2 seconds? Average speeds over shorter and shorter windows close in on the answer.",
          lines: [["2 to 3 s", "(44.1 − 19.6) ÷ 1", "24.5 m/s"],
                  ["2 to 2.1 s", "(21.609 − 19.6) ÷ 0.1", "20.09 m/s"],
                  ["2 to 2.01 s", "(19.79649 − 19.6) ÷ 0.01", "19.649 m/s"],
                  ["Limit", "4.9(4 + h) as h → 0", "19.6 m/s"]],
          answer: "At 2 seconds it is falling at 19.6 m/s, about 70 km/h.",
          why: "Each line is a difference quotient: change in distance divided by a shrinking window h. Algebra gives 4.9(4 + h), and as h shrinks it becomes 19.6. That is the derivative, found without any rule. The rules you learn later are shortcuts for exactly this.",
          q: "Same fall. How fast at exactly 3 seconds?",
          options: [{ html: "29.4 m/s", ok: true },
                    { html: "44.1 m/s", ok: false, why: "That is s(3), how far it has fallen, in metres. Speed is the limit of the difference quotient: 9.8 × 3." },
                    { html: "14.7 m/s", ok: false, why: "That is 4.9 × 3. The derivative of 4.9t² is 9.8t: the 2 comes down." },
                    { html: "34.3 m/s", ok: false, why: "That is the average from 3 to 4 seconds, with h = 1. Let h shrink to 0." }]
        };
      }
    }
  },
  {
    id: "combo", track: "mcv4u", name: "Product and chain together", short: "Rules combined", code: "MCV4U A3.5", prereq: "chain", weight: 3,
    rule: {
      r: "For f(x) = u · v where v has an inside, use the product rule, f′ = u′v + uv′, and use the chain rule to find v′.",
      tip: "Label first, differentiate second. Write u, u′, v, v′ on four separate lines, then assemble u′v + uv′.",
      trap: "v′ needs the chain rule's extra factor. The derivative of (3x + 1)⁴ is 4(3x + 1)³ · 3, not 4(3x + 1)³."
    },
    practical: {
      kind: "finance", live: null,
      build() {
        return {
          source: "Fixed example",
          setup: "You buy 50 shares a month, so you hold S(t) = 1000 + 50t shares after t months. The price grows as p(t) = 20(1 + 0.01t)² dollars. Your holding is worth V = S · p. How fast is it growing at t = 10?",
          lines: [["u′v", "S′ · p = 50 × 20(1.1)² = 50 × 24.2", "1210"],
                  ["uv′", "S · p′ = 1500 × 20 · 2(1.1) · 0.01", "660"],
                  ["V′(10)", "1210 + 660", "$1,870 a month"]],
          answer: "At month 10 the holding grows by about $1,870 a month: $1,210 from buying more and $660 from the price rising.",
          why: "Value is shares times price, a product, so the product rule splits growth into two causes: buying more (u′v) and existing shares gaining (uv′). The price has an inside, 1 + 0.01t, so its derivative picks up the chain rule's factor 0.01.",
          q: "Same plan. How fast is the value growing at the start, t = 0?",
          options: [{ html: "$1,400 a month", ok: true },
                    { html: "$1,000 a month", ok: false, why: "That is only u′v, the new shares at $20. The 1000 shares you already hold are also gaining: uv′ = 1000 × 0.4 = $400." },
                    { html: "$400 a month", ok: false, why: "That is only uv′, the price rise on existing shares. Add the new shares you buy: 50 × $20 = $1,000." },
                    { html: "$20 a month", ok: false, why: "That is the share price at t = 0, not the rate the holding grows." }]
        };
      }
    }
  },
  {
    id: "exprate", track: "mcv4u", name: "Exponential rates of change", short: "Growth rates", code: "MCV4U A2.5, A2.8, B2.2", prereq: "trigexp", weight: 2,
    rule: {
      r: "If P(t) = Ae^(kt), then P′(t) = kAe^(kt) = k · P(t). The rate of growth is always k times the current amount. For base b, P′(t) = P(t) · ln b.",
      tip: "Exponential growth means the rate is proportional to the size. Double the money, double the rate.",
      trap: "k is a rate per unit of time. P′(t) = kP(t), not k alone and not P(t) alone."
    },
    practical: {
      kind: "finance", live: "bond5",
      build(L) {
        const y = L.bond5 / 100, B = t => 10000 * Math.exp(y * t), r10 = y * B(10), r20 = y * B(20);
        return {
          source: "Government of Canada 5-year bond yield " + num(L.bond5) + "%",
          setup: "$10,000 grows continuously at the 5-year yield, " + num(L.bond5) + "% a year: B(t) = 10000e^(" + num(y, 4) + "t). How fast is it growing after 10 years?",
          lines: [["Derivative", "B′(t) = " + num(y, 4) + " × B(t)", ""],
                  ["Value at 10", "10000e^(" + num(10 * y, 3) + ")", cad(B(10))],
                  ["Rate at 10", num(y, 4) + " × " + cad(B(10)), cad(r10) + " a year"]],
          answer: "After 10 years it is growing at " + cad(r10) + " a year, compared with " + cad(y * 10000) + " a year at the start.",
          why: "The derivative of Ae^(kt) is k times itself, so the growth rate is always the yield times the current balance. That is why compounding accelerates: the balance grows, so the rate grows, so the balance grows faster.",
          q: "Same money. How fast is it growing after 20 years?",
          options: numOptions(r20, [
            { v: y * 10000, why: "That is the rate at the start. The rate is k times the current balance, which has grown." },
            { v: B(20), why: "That is the balance after 20 years. The rate is " + num(y, 4) + " times it." },
            { v: 2 * r10, why: "You doubled the 10-year rate. Exponential growth does not scale with time like that: work out B(20) and multiply by the yield." }
          ], v => cad(v) + " a year")
        };
      }
    }
  },
  {
    id: "motion", track: "mcv4u", name: "Motion: position, velocity, acceleration", short: "Motion", code: "MCV4U B2.1, B2.3", prereq: "polyd", weight: 2,
    rule: {
      r: "Velocity is the derivative of position: v(t) = s′(t). Acceleration is the derivative of velocity: a(t) = v′(t) = s″(t). The object is at rest when v(t) = 0.",
      tip: "s, v, a: each is the derivative of the one before. Going back up the chain means undoing a derivative.",
      trap: "At rest means v = 0, not s = 0. s = 0 means back at the starting point, which is a different question."
    },
    practical: {
      kind: "science", live: null,
      build() {
        return {
          source: "Fixed example",
          setup: "A car doing 25 m/s (90 km/h) brakes hard. Its distance after t seconds is s(t) = 25t − 2.5t² metres. How far does it travel before stopping?",
          lines: [["Velocity", "v(t) = s′(t) = 25 − 5t", ""],
                  ["Stops when", "25 − 5t = 0", "t = 5 s"],
                  ["Distance", "s(5) = 125 − 62.5", "62.5 m"]],
          answer: "The car needs 62.5 metres to stop, about 15 car lengths.",
          why: "Stopping means velocity is zero, and velocity is the derivative of position. Set s′(t) = 0 to find when, then put that time back into s(t) to find where. The same two moves find any turning point.",
          q: "Better brakes: s(t) = 25t − 5t². Stopping distance?",
          options: [{ html: "31.25 m", ok: true },
                    { html: "62.5 m", ok: false, why: "That was the old brakes. Now v = 25 − 10t, so it stops at 2.5 s." },
                    { html: "2.5 m", ok: false, why: "2.5 is the stopping time in seconds. Put it into s(t): 62.5 − 31.25 = 31.25 m." },
                    { html: "0 m", ok: false, why: "You set s = 0. Stopping means v = 0." }]
        };
      }
    }
  },
  {
    id: "concav", track: "mcv4u", name: "Concavity and points of inflection", short: "Concavity", code: "MCV4U B1.2, B1.4, B1.5", prereq: "maxmin", weight: 3,
    rule: {
      r: "f″ > 0: concave up, bending like a smile. f″ < 0: concave down, like a frown. A point of inflection is where f″ changes sign, usually where f″ = 0.",
      tip: "The second derivative is the rate of change of the slope. Concave up means the slope is increasing.",
      trap: "f″ = 0 is not enough on its own. Check the sign really changes. For x⁴, f″(0) = 0 but it smiles on both sides, so there is no inflection."
    },
    practical: {
      kind: "business", live: null,
      build() {
        return {
          source: "Fixed example",
          setup: "A new product's total sales after t months are S(t) = −t³ + 12t² + 20t. When are sales growing fastest? That is the point of inflection.",
          lines: [["Sales rate", "S′(t) = −3t² + 24t + 20", ""],
                  ["Its change", "S″(t) = −6t + 24", ""],
                  ["Inflection", "−6t + 24 = 0", "t = 4"],
                  ["Peak rate", "S′(4) = −48 + 96 + 20", "68 a month"]],
          answer: "Sales grow fastest at month 4, at 68 units a month. After that they still grow, but more slowly each month.",
          why: "The inflection point is where the curve switches from bending up to bending down. For sales, that is the moment growth peaks. Investors watch for it: the numbers still rise, but the second derivative has turned negative.",
          q: "A different product: S(t) = −t³ + 18t². When is growth fastest?",
          options: [{ html: "Month 6", ok: true },
                    { html: "Month 12", ok: false, why: "That is where S′(t) = 0, when sales stop growing. The fastest growth is where S″ = 0: −6t + 36 = 0." },
                    { html: "Month 18", ok: false, why: "18 is a coefficient, not a time. Differentiate twice and set S″ = 0." },
                    { html: "Month 3", ok: false, why: "The derivative of 18t² is 36t, so S″ = −6t + 36. You kept 18 instead of 36." }]
        };
      }
    }
  },
  {
    id: "optim", track: "mcv4u", name: "Optimization problems", short: "Optimization", code: "MCV4U B2.4, B2.5", prereq: "maxmin", weight: 3,
    rule: {
      r: "Write the quantity to optimize as a function of one variable. Differentiate, set to zero, solve. Check the ends of the allowed range and confirm it is a max or a min.",
      tip: "Most of the work is the setup. Name the variable, write the constraint, substitute until one variable is left.",
      trap: "Answer the question asked. If it asks for the largest area, give the area, not the width that produces it."
    },
    practical: {
      kind: "finance", live: null,
      build() {
        return {
          source: "Fixed example",
          setup: "A café sells q = 1000 − 20p lattes a week at a price of p dollars. Revenue R = p · q. What price brings in the most?",
          lines: [["Revenue", "R(p) = p(1000 − 20p) = 1000p − 20p²", ""],
                  ["Derivative", "R′(p) = 1000 − 40p", ""],
                  ["Set to zero", "p = 1000 ÷ 40", "$25"],
                  ["Revenue then", "25 × (1000 − 500)", "$12,500"]],
          answer: "Charge $25. The café sells 500 a week and takes in $12,500.",
          why: "Raise the price and each sale earns more, but fewer people buy. R′(p) = 0 is where those two effects cancel. Every pricing model, from lattes to bonds, finds its best point this way.",
          q: "Demand rises to q = 1200 − 20p. Best price?",
          options: [{ html: "$30", ok: true },
                    { html: "$25", ok: false, why: "That was the old demand. Now R′(p) = 1200 − 40p = 0." },
                    { html: "$60", ok: false, why: "At $60 nobody buys: q = 0. That is where demand hits zero, not where revenue peaks." },
                    { html: "$600", ok: false, why: "You set 1200 − 2p = 0. The derivative of 20p² is 40p." }]
        };
      }
    }
  },
  {
    id: "angle", track: "mcv4u", name: "Angles and projections", short: "Angles", code: "MCV4U C2.4, C2.8", prereq: "dotp", weight: 2,
    rule: {
      r: "cos θ = (u · v) ÷ (|u||v|). The scalar projection of u on v is (u · v) ÷ |v|. The vector projection is ((u · v) ÷ |v|²) v.",
      tip: "The projection is the shadow of u on v. Divide by |v| once for its length, by |v|² once more to turn it back into a vector along v.",
      trap: "Negative u · v means the angle is obtuse, over 90°. The formula already handles the sign; do not drop it."
    },
    practical: {
      kind: "finance", live: null,
      build() {
        return {
          source: "Fixed example",
          setup: "Two stocks' returns over four quarters, measured from their averages: a = (2, −1, 1, −2) and b = (1, −1, 2, −2). The correlation between them is the cosine of the angle between these vectors.",
          lines: [["a · b", "2 + 1 + 2 + 4", "9"],
                  ["Lengths", "|a| = √10, |b| = √10", ""],
                  ["cos θ", "9 ÷ (√10 × √10)", "0.9"],
                  ["Angle", "cos⁻¹ 0.9", "25.8°"]],
          answer: "The correlation is 0.9. The two stocks move almost together, so holding both barely spreads your risk.",
          why: "Correlation is exactly the cosine formula applied to returns. Same direction: +1. At right angles: 0, which means unrelated. Opposite: −1. Diversification is looking for vectors that are not parallel.",
          q: "A third stock: c = (1, 2, −2, −1). Its correlation with a?",
          options: [{ html: "0", ok: true },
                    { html: "0.9", ok: false, why: "That is a with b. Work out a · c: 2 − 2 − 2 + 2 = 0." },
                    { html: "1", ok: false, why: "1 means they move exactly together. a · c = 0, so they are at right angles: unrelated." },
                    { html: "−1", ok: false, why: "−1 means exact opposites. a · c = 0, so the angle is 90°, not 180°." }]
        };
      }
    }
  },
  {
    id: "planes", track: "mcv4u", name: "Equations of planes", short: "Planes", code: "MCV4U C4.3, C4.4, C4.5, C4.6", prereq: "crossp", weight: 3,
    rule: {
      r: "A plane with normal n = (a, b, c) through point P has equation ax + by + cz = d, where d = n · P. Through three points A, B, C, the normal is (B − A) × (C − A).",
      tip: "The coefficients of x, y and z are the normal, read straight off. The number on the right comes from putting in any known point.",
      trap: "The normal is perpendicular to the plane, not along it. A direction vector that lies in the plane is never a normal."
    },
    practical: {
      kind: "finance", live: null,
      build() {
        return {
          source: "Fixed example",
          setup: "You split money among three funds paying 2%, 4% and 3% a year: x, y and z dollars. You want exactly $300 a year of income. Every split that works is a point on the plane 0.02x + 0.04y + 0.03z = 300.",
          lines: [["Normal", "(0.02, 0.04, 0.03)", "the yields"],
                  ["Test (5000, 5000, 0)", "100 + 200 + 0", "$300 ✓"],
                  ["Test (0, 0, 10000)", "0 + 0 + 300", "$300 ✓"]],
          answer: "Many splits hit $300. The plane holds all of them, and its normal is the list of yields.",
          why: "A plane is every point whose dot product with the normal is a fixed number. Here the normal is the yield vector and the dot product is the income. Any budget with a fixed total from several sources is a plane.",
          q: "Which split gives exactly $300?",
          options: [{ html: "A $0, B $3,000, C $6,000", ok: true },
                    { html: "A $3,000, B $3,000, C $3,000", ok: false, why: "60 + 120 + 90 = $270. Not on the plane." },
                    { html: "A $10,000, B $0, C $0", ok: false, why: "2% of $10,000 is $200. Not on the plane." },
                    { html: "A $2,000, B $4,000, C $2,000", ok: false, why: "40 + 160 + 60 = $260. Not on the plane." }]
        };
      }
    }
  },
  {
    id: "lineplane", track: "mcv4u", name: "Where a line meets a plane", short: "Line meets plane", code: "MCV4U C3.3, C4.7", prereq: "planes", weight: 3,
    rule: {
      r: "Put the line's x, y and z, written in terms of t, into the plane's equation. Solve for t, then put t back into the line. If t cancels out, the line is parallel: no point, or the whole line if the equation is then true.",
      tip: "n · d = 0 is the warning sign: the direction is at right angles to the normal, so the line runs parallel to the plane.",
      trap: "Once you find t, you are not done. The question wants the point, so put t back into the line."
    },
    practical: {
      kind: "finance", live: null,
      build() {
        return {
          source: "Fixed example",
          setup: "A retirement glide path starts at 45 with 70% stocks, 20% bonds, 10% cash, moving (−2, 1.5, 0.5) a year: r = (70, 20, 10) + t(−2, 1.5, 0.5). If stocks return 6%, bonds 3%, cash 1%, the mixes expecting 4.2% lie on the plane 6s + 3b + c = 420. When does the path cross it?",
          lines: [["Substitute", "6(70 − 2t) + 3(20 + 1.5t) + (10 + 0.5t) = 420", ""],
                  ["Simplify", "490 − 7t = 420", "t = 10"],
                  ["Point", "(70, 20, 10) + 10(−2, 1.5, 0.5)", "(50, 35, 15)"]],
          answer: "At 55 the mix is 50/35/15 and the expected return has fallen to 4.2%.",
          why: "The glide path is a line and the target return is a plane. Where they meet is a line–plane intersection: substitute, solve for t, put t back.",
          q: "When does the expected return fall to 4.06%, the plane 6s + 3b + c = 406?",
          options: [{ html: "Age 57", ok: true },
                    { html: "Age 55", ok: false, why: "That was 4.2%. Now 490 − 7t = 406, so t = 12." },
                    { html: "Age 12", ok: false, why: "t = 12 is years after 45. Age is 45 + 12." },
                    { html: "Age 65", ok: false, why: "65 is the end of the glide path, not where it crosses 4.06%." }]
        };
      }
    }
  },
  {
    id: "dist", track: "mcv4u", name: "Distance from a point to a plane", short: "Distance", code: "MCV4U C4.7", prereq: "planes", weight: 3,
    rule: {
      r: "The distance from Q to the plane ax + by + cz = d is |aq₁ + bq₂ + cq₃ − d| ÷ √(a² + b² + c²).",
      tip: "Top: put the point into the plane's equation and see how far off it is. Bottom: the length of the normal. The shortest path always runs along the normal.",
      trap: "Do not forget to divide by the length of the normal. Without it, doubling the equation would double the distance, which makes no sense."
    },
    practical: {
      kind: "science", live: null,
      build() {
        return {
          source: "Fixed example",
          setup: "A hillside is the plane 2x + y + 2z = 30, in metres. A drone hovers at (3, 6, 15). How close is it to the slope?",
          lines: [["Top", "2(3) + 6 + 2(15) − 30", "12"],
                  ["Bottom", "√(4 + 1 + 4)", "3"],
                  ["Distance", "12 ÷ 3", "4 m"],
                  ["Straight down", "ground is at z = 9 there", "6 m"]],
          answer: "The drone is 4 m from the slope, even though it is 6 m above the ground directly below it.",
          why: "The shortest path to a slope is not straight down. It runs along the normal, at right angles to the surface. The formula measures that path, which is why the height above ground overstates the clearance.",
          q: "The drone climbs to (3, 6, 18). Distance to the slope?",
          options: [{ html: "6 m", ok: true },
                    { html: "18 m", ok: false, why: "6 + 6 + 36 − 30 = 18, but you still divide by the length of the normal, 3." },
                    { html: "9 m", ok: false, why: "That is the height straight down to the ground. The shortest distance runs at right angles to the slope." },
                    { html: "3 m", ok: false, why: "3 is the length of the normal, the bottom of the fraction. The top is 18." }]
        };
      }
    }
  }
];
CP.STEPS.push(...more);

/* The full course order, and short names for the map. */
const ORDER = ["exp", "frac", "slope", "firstp", "pow1", "polyd", "tan", "prod", "chain", "combo", "trigexp", "exprate", "motion", "maxmin", "concav", "optim",
               "vbasic", "dotp", "angle", "crossp", "lines", "planes", "lineplane", "dist"];
const SHORT = { exp: "Exponents", frac: "Fraction exp.", slope: "Slope", pow1: "Power rule", polyd: "Polynomials", tan: "Tangent", prod: "Product rule", chain: "Chain rule",
                trigexp: "sin, cos, eˣ", maxmin: "Max and min", vbasic: "Vectors", dotp: "Dot product", crossp: "Cross product", lines: "Lines" };
for (const st of CP.STEPS) { st.order = ORDER.indexOf(st.id) + 1; if (!st.short) st.short = SHORT[st.id] || st.name; }
CP.STEPS.sort((a, b) => a.order - b.order);
})();
