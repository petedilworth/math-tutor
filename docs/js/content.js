/* Chalk and Paper – content
   Everything a person reads that is not a generated problem lives here:
   tracks, steps, rule cards, and the real-life calculations.
   Generators (the code that invents fresh problems) are in generators.js. */

window.CP = window.CP || {};

CP.M = "−"; /* true minus sign */
const M = CP.M;
const neg = x => String(x).replace(/-/g, M);
const pct = (x, d = 1) => neg((x * 100).toFixed(d)) + "%";
const cad = (x, d = 2) => "C$" + neg(Number(x).toLocaleString("en-CA", { minimumFractionDigits: d, maximumFractionDigits: d }));
const fx = x => Number(x).toFixed(4);
const num = (x, d = 2) => neg(Number(x).toFixed(d));

/* Fallbacks used when data/live.json is missing or stale. The UI says "fixed example" then. */
CP.LIVE_FALLBACK = {
  asOf: null,
  usdcad: 1.3500, usdcad30: 1.3700, eurcad: 1.4800, gbpcad: 1.7200,
  policy: 2.75, bond5: 3.00, bond10: 3.30, cpi: 2.1,
  temp: { noon: 18, max: 21, min: 12, sunrise: "07:02", sunset: "19:10" }
};

/* Four distinct numeric options from a correct value and three tempting wrong ones. */
function numOptions(correct, wrongs, fmt) {
  const seen = new Set([fmt(correct)]);
  const opts = [{ html: fmt(correct), ok: true }];
  for (const w of wrongs) {
    const s = fmt(w.v);
    if (seen.has(s)) continue;
    seen.add(s); opts.push({ html: s, ok: false, why: w.why });
    if (opts.length === 4) break;
  }
  let bump = 1;
  while (opts.length < 4) { /* pad only if two traps collided */
    const v = correct * (1 + 0.37 * bump); const s = fmt(v);
    if (!seen.has(s)) { seen.add(s); opts.push({ html: s, ok: false, why: "Not the value the calculation gives." }); }
    bump++;
  }
  return opts;
}

CP.TRACKS = [
  { id: "mcv4u", name: "Calculus and Vectors", code: "MCV4U", available: true },
  { id: "mhf4u", name: "Advanced Functions", code: "MHF4U", available: false },
  { id: "mcr3u", name: "Grade 11 Functions", code: "MCR3U", available: false }
];

CP.STEPS = [
  {
    id: "exp", track: "mcv4u", order: 1, name: "Exponent laws", code: "underlies MCR3U B1", prereq: null, weight: 1,
    rule: {
      r: "Multiplying: add the exponents. Dividing: subtract them. A power of a power: multiply them. Anything to the power 0 is 1.",
      tip: "Write it out long. x² · x³ is (x·x)(x·x·x): five x's, so x⁵. Every exponent law is just counting x's.",
      trap: "The exponent only touches what it is attached to. In 5x⁰ only the x becomes 1, so the answer is 5."
    },
    practical: {
      kind: "finance", live: "policy",
      build(L) {
        const r = L.policy / 100, g = 1 + r;
        const a = Math.pow(g, 3), b = Math.pow(g, 2), c = a * b;
        return {
          source: "Bank of Canada policy rate " + num(L.policy) + "%",
          setup: "You put $1,000 in a savings account paying the policy rate, " + num(L.policy) + "% a year. You leave it three years, then two more.",
          lines: [["First 3 years", "(1 + " + num(r, 4) + ")³ = " + num(a, 4), ""],
                  ["Next 2 years", "(1 + " + num(r, 4) + ")² = " + num(b, 4), ""],
                  ["Together", num(a, 4) + " × " + num(b, 4) + " = " + num(c, 4), pct(c - 1)]],
          answer: "$1,000 becomes " + cad(1000 * c) + " after five years.",
          why: "Multiplying (1 + r)³ by (1 + r)² gives (1 + r)⁵, because the exponents add. Three years then two years is five years of compounding. Every exponent law is a statement about time when the base is a growth rate.",
          q: "You leave it three years, then four more. How many years of growth is (1 + r)³ · (1 + r)⁴?",
          options: [{ html: "7", ok: true }, { html: "12", ok: false, why: "You multiplied the exponents. That is for a power of a power. Multiplying two powers adds them." },
                    { html: "1", ok: false, why: "You subtracted. Subtracting is for dividing powers." }, { html: "34", ok: false, why: "You wrote the two exponents side by side. They add: 3 + 4 = 7." }]
        };
      }
    }
  },
  {
    id: "frac", track: "mcv4u", order: 2, name: "Fraction and negative exponents", code: "MCR3U B1.2, B1.3", prereq: "exp", weight: 1,
    rule: {
      r: "In a fractional exponent, the bottom number is a root and the top number is a power. A minus sign in the exponent means one over.",
      tip: "Root first, then power. For 8^(2/3), the cube root of 8 is 2, then 2² is 4. Doing the root first keeps the numbers small.",
      trap: "A negative exponent never makes the answer negative. 2⁻³ is 1/8, not −8."
    },
    practical: {
      kind: "finance", live: "bond5",
      build(L) {
        const y = L.bond5 / 100, g = 1 + y;
        const a = Math.pow(g, 3), pv = 1000 / a, pv5 = 1000 / Math.pow(g, 5);
        return {
          source: "Government of Canada 5-year bond yield " + num(L.bond5) + "%",
          setup: "Someone promises you $1,000 in three years. Safe money earns " + num(L.bond5) + "% a year. What is that promise worth today?",
          lines: [["Growth over 3 years", "(1 + " + num(y, 4) + ")³ = " + num(a, 4), ""],
                  ["Flip it", "(1 + " + num(y, 4) + ")⁻³ = 1 ÷ " + num(a, 4) + " = " + num(1 / a, 4), ""],
                  ["Today's value", "$1,000 × " + num(1 / a, 4) + " = " + cad(pv), ""]],
          answer: "The promise is worth " + cad(pv) + " today. Finance calls this present value.",
          why: "A negative exponent means one over. (1 + y)⁻³ is 1 divided by (1 + y)³, which undoes three years of growth. Discounting is compounding run backwards, and the minus sign in the exponent is the reverse gear.",
          q: "Same promise, but the $1,000 arrives in five years. Worth today?",
          options: numOptions(pv5, [
            { v: 1000 * Math.pow(g, 5), why: "You used a positive exponent and grew the money instead of shrinking it. Money in the future is worth less today, not more." },
            { v: 1000 * (1 - 5 * y), why: "You subtracted five years of simple interest. Discounting compounds: divide by (1 + y) five times." },
            { v: pv, why: "That is the three-year value. Five years away is worth less still." }
          ], v => cad(v))
        };
      }
    }
  },
  {
    id: "slope", track: "mcv4u", order: 3, name: "Slope and rate of change", code: "MHF4U D1.4", prereq: "frac", weight: 1,
    rule: {
      r: "Slope is rise over run: (y₂ − y₁) / (x₂ − x₁). Average rate of change is the same thing: how much the output changed, divided by how much the input changed.",
      tip: "Subtract in the same order on top and bottom. If the second point goes first on top, it goes first on the bottom too.",
      trap: "Average rate of change is not the average of the two heights. It is change in height per unit of x."
    },
    practical: {
      kind: "finance", live: "usdcad",
      build(L) {
        const a = L.usdcad30, b = L.usdcad, rate = (b - a) / 30;
        return {
          source: "USD/CAD " + fx(b) + " now, " + fx(a) + " thirty days ago, Bank of Canada",
          setup: "Thirty days ago a US dollar cost " + cad(a, 4) + ". Yesterday it cost " + cad(b, 4) + ". How fast has it been moving?",
          lines: [["Rise", fx(b) + " − " + fx(a) + " = " + num(b - a, 4), ""],
                  ["Run", "30 days", ""],
                  ["Average rate", num(b - a, 4) + " ÷ 30 = " + num(rate, 5) + " per day", ""]],
          answer: "The US dollar has moved " + num(rate * 100, 3) + " cents a day on average.",
          why: "This is slope. Two points on a graph of price against time, rise over run. It says nothing about any single day, which is what makes it an average rate rather than an instantaneous one. Tomorrow's step turns this into the slope of a tangent.",
          q: "If that average continued for 60 more days, what would a US dollar cost?",
          options: numOptions(b + 60 * rate, [
            { v: b + rate, why: "You added one day's change. Sixty days needs sixty times the daily rate." },
            { v: a + 60 * rate, why: "You started from the price thirty days ago. Start from yesterday's price." },
            { v: b * (1 + 60 * rate), why: "You treated the daily rate as a percentage. It is a change in dollars per day." }
          ], v => cad(v, 4))
        };
      }
    }
  },
  {
    id: "pow1", track: "mcv4u", order: 4, name: "Power rule, one term", code: "MCV4U A3.1", prereq: "exp", weight: 1,
    rule: {
      r: "The derivative of axⁿ is a·n·xⁿ⁻¹. Bring the power down to multiply, then lower the power by one.",
      tip: "Two beats, every time: multiply by the power, then drop the power by one. Say it out loud until it is automatic.",
      trap: "A constant on its own has derivative 0, because it never changes. And the derivative of 5x is just 5: x¹ becomes x⁰, which is 1."
    },
    practical: {
      kind: "finance", live: null,
      build() {
        return {
          source: "Fixed example",
          setup: "A small factory's total cost to make q units is C(q) = 0.02q² + 5q + 400 dollars. The boss asks: what does the next unit cost us, right now, at 500 units?",
          lines: [["Differentiate", "C′(q) = 0.04q + 5", ""],
                  ["At q = 500", "0.04 × 500 + 5 = 25", ""]],
          answer: "The 501st unit costs about $25 to make. Economists call this marginal cost.",
          why: "The power rule on 0.02q² brings the 2 down and lowers the power: 0.04q. The 5q becomes 5. The 400 vanishes because a fixed cost does not change when you make one more. Marginal cost is a derivative, and every “marginal” in economics is one.",
          q: "What is the marginal cost at 1,000 units?",
          options: [{ html: "$45", ok: true }, { html: "$40", ok: false, why: "You dropped the 5. The derivative of 5q is 5, and it is still there." },
                    { html: "$25,400", ok: false, why: "That is C(1000), the total cost of a thousand units. The question asks for the derivative." },
                    { html: "$25", ok: false, why: "That is the marginal cost at 500. At 1,000 the slope is steeper." }]
        };
      }
    }
  },
  {
    id: "polyd", track: "mcv4u", order: 5, name: "Power rule, whole polynomials", code: "MCV4U A3.2, A3.3", prereq: "pow1", weight: 1,
    rule: {
      r: "Differentiate each term on its own, then add the results. Any constant term disappears.",
      tip: "Cross out the constant term first, so you cannot forget it. Then go term by term, left to right.",
      trap: "Every term gets the power rule, not just the first one."
    },
    practical: {
      kind: "finance", live: null,
      build() {
        return {
          source: "Fixed example",
          setup: "A coffee cart's weekly revenue from q cups is R(q) = 50q − 0.01q² cents, because each extra cup needs a small price cut to sell. What does the next cup bring in at 1,000 cups a week?",
          lines: [["Differentiate", "R′(q) = 50 − 0.02q", ""],
                  ["At q = 1000", "50 − 0.02 × 1000 = 30", ""]],
          answer: "The 1,001st cup adds about 30 cents. Marginal revenue.",
          why: "Two terms, two derivatives, added. 50q becomes 50. The −0.01q² becomes −0.02q. Marginal revenue falls as you sell more, which is why every business eventually stops growing by cutting prices.",
          q: "At what number of cups does the next cup add nothing at all?",
          options: [{ html: "2,500", ok: true }, { html: "5,000", ok: false, why: "That is where R(q) itself is zero, where total revenue is nothing. The question asks where the derivative is zero." },
                    { html: "50", ok: false, why: "That is the starting marginal revenue, not a number of cups." },
                    { html: "1,000", ok: false, why: "At 1,000 cups the next one still adds 30 cents." }]
        };
      }
    }
  },
  {
    id: "tan", track: "mcv4u", order: 6, name: "Slope of a tangent at a point", code: "MCV4U A3.3", prereq: "polyd", weight: 2,
    rule: {
      r: "The slope of the tangent at x = a is f′(a). Differentiate first, then put the number in.",
      tip: "Derivative first, number second. If you put the number in first, you have a constant, and the derivative of a constant is zero.",
      trap: "f(a) is the height of the curve. f′(a) is how steep it is. They answer different questions."
    },
    practical: {
      kind: "finance", live: "bond10",
      build(L) {
        const y = L.bond10 / 100, g = 1 + y;
        const P = 1000 / Math.pow(g, 10), slope = -10 * 1000 / Math.pow(g, 11), dP = slope * 0.01;
        const slope20 = -20 * 1000 / Math.pow(g, 21);
        return {
          source: "Government of Canada 10-year bond yield " + num(L.bond10) + "%",
          setup: "A bond pays $1,000 in ten years and nothing before. Its price is P(y) = 1000 ÷ (1 + y)¹⁰, where y is the yield. Yields are " + num(L.bond10) + "%. If yields rise one percentage point, how much does the price fall?",
          lines: [["Price now", "1000 ÷ " + num(g, 4) + "¹⁰ = " + cad(P), ""],
                  ["Differentiate", "P′(y) = −10 × 1000 ÷ (1 + y)¹¹", ""],
                  ["Slope at " + num(L.bond10) + "%", num(slope, 0) + " dollars per unit of yield", ""],
                  ["One point up", num(slope, 0) + " × 0.01 ≈ " + cad(dP), ""]],
          answer: "The price drops about " + cad(-dP) + ", from " + cad(P) + " to roughly " + cad(P + dP) + ".",
          why: "The slope of the tangent at today's yield tells you the price change for a small move in yield. Bond desks call it duration, and it is the single number every bond trader watches. It is f′(a), nothing more.",
          q: "Same yield, but the bond pays in twenty years. Roughly how much does a one-point rise cost?",
          options: numOptions(-slope20 * 0.01, [
            { v: -dP, why: "That is the ten-year bond. Twenty years away, the price is far more sensitive to yield." },
            { v: -dP * 20 / 10 * 0.5, why: "Too small. The exponent doubles to 21 and the front number doubles to 20." },
            { v: 1000 / Math.pow(g, 20), why: "That is the twenty-year bond's price, not the change in it." }
          ], v => cad(v))
        };
      }
    }
  },
  {
    id: "prod", track: "mcv4u", order: 7, name: "Product rule", code: "MCV4U A3.4, A3.5", prereq: "polyd", weight: 2,
    rule: {
      r: "(uv)′ = u′v + uv′. The derivative of the first times the second, plus the first times the derivative of the second.",
      tip: "Chant it: “d-first times second, plus first times d-second.” Two terms, every time.",
      trap: "The derivative of a product is not the product of the derivatives. (uv)′ is not u′v′. This is the most common mistake in the whole course."
    },
    practical: {
      kind: "finance", live: null,
      build() {
        return {
          source: "Fixed example",
          setup: "A shop is cutting its price a little each week to sell more. Price p(t) = 10 − 0.5t dollars, sales q(t) = 100 + 20t units, t in weeks. Revenue is p × q. Is revenue rising or falling in week 4?",
          lines: [["p′ and q′", "p′ = −0.5, q′ = 20", ""],
                  ["Product rule", "R′ = p′q + pq′ = (−0.5)(100 + 20t) + (10 − 0.5t)(20)", ""],
                  ["At t = 4", "(−0.5)(180) + (8)(20) = −90 + 160 = 70", ""]],
          answer: "Revenue is rising by about $70 a week in week 4. The extra sales are outrunning the price cuts, for now.",
          why: "Revenue is two things multiplied, and both are moving. The first term is the loss from the price cut on all current sales. The second is the gain from new sales at the current price. The product rule adds them, and it is the only way to see which one is winning.",
          q: "What about week 10?",
          options: [{ html: neg("-50") + " dollars a week", ok: true }, { html: "100 dollars a week", ok: false, why: "You kept only pq′, the gain from new sales, and ignored the price cuts." },
                    { html: neg("-150") + " dollars a week", ok: false, why: "You kept only p′q, the loss from the price cut, and ignored the new sales." },
                    { html: neg("-10") + " dollars a week", ok: false, why: "You multiplied the two derivatives. The derivative of a product is never that." }]
        };
      }
    }
  },
  {
    id: "chain", track: "mcv4u", order: 8, name: "Chain rule", code: "MCV4U A3.4, A3.5", prereq: "pow1", weight: 2,
    rule: {
      r: "For a function inside another: differentiate the outside and leave the inside alone, then multiply by the derivative of the inside.",
      tip: "Outside, then inside. For (3x + 1)⁵: bring the 5 down, lower it to 4, leave (3x + 1) as it is, then multiply by 3.",
      trap: "Forgetting to multiply by the inside's derivative is the classic slip. When the inside is just x its derivative is 1, so you get away with it, and that is why the habit never forms."
    },
    practical: {
      kind: "finance", live: "usdcad",
      build(L) {
        const f0 = L.usdcad30, f1 = L.usdcad, s = 1.10, fxr = f1 / f0, tot = s * fxr;
        const alt = f1 + 0.10, totAlt = s * (alt / f0);
        return {
          source: "USD/CAD " + fx(f1) + " now, " + fx(f0) + " thirty days ago, Bank of Canada",
          setup: "A month ago you bought a US stock at US$100 when a US dollar cost " + cad(f0, 4) + ". It is now US$110, and a US dollar costs " + cad(f1, 4) + ". What did you make in Canadian dollars?",
          lines: [["Stock", "110 ÷ 100 = 1.100", pct(0.10)],
                  ["Currency", fx(f1) + " ÷ " + fx(f0) + " = " + num(fxr, 4), pct(fxr - 1)],
                  ["Together", "1.100 × " + num(fxr, 4) + " = " + num(tot, 4), pct(tot - 1)]],
          answer: cad(100 * f0) + " became " + cad(110 * f1) + ". The stock made 10%, you made " + pct(tot - 1) + ".",
          why: "Your Canadian return depends on the US price, which depends on time. Two rates stacked inside each other, so they multiply. That multiply is the chain rule. Adding them would say " + pct(0.10 + fxr - 1) + ", and the gap grows with bigger moves.",
          q: "Same stock, but instead a US dollar rose to " + cad(alt, 4) + ". Your return?",
          options: numOptions(totAlt - 1, [
            { v: 0.10 + (alt / f0 - 1), why: "You added the two rates. Stacked rates multiply: 1.10 × " + num(alt / f0, 4) + "." },
            { v: 0.10, why: "You ignored the currency. It moved, and it is part of your return." },
            { v: tot - 1, why: "That is the return with the dollar at " + cad(f1, 4) + ", the original question." }
          ], v => pct(v))
        };
      }
    }
  },
  {
    id: "trigexp", track: "mcv4u", order: 9, name: "Sine, cosine and eˣ", code: "MCV4U A2.4, A2.6, A2.8", prereq: "chain", weight: 2,
    rule: {
      r: "(sin x)′ = cos x. (cos x)′ = −sin x. (eˣ)′ = eˣ. For any other base, (aˣ)′ = aˣ · ln a.",
      tip: "Picture the graphs. Cosine starts at its peak and heads down, so its slope starts negative: that is where the minus comes from.",
      trap: "The power rule does not work on eˣ or 2ˣ. The x is up in the exponent, not down in the base, so “bring the power down” makes no sense."
    },
    practical: {
      kind: "finance", live: "policy",
      build(L) {
        const r = L.policy / 100;
        const annual = 1000 * Math.pow(1 + r, 5), cont = 1000 * Math.exp(5 * r), cont10 = 1000 * Math.exp(10 * r);
        return {
          source: "Bank of Canada policy rate " + num(L.policy) + "%",
          setup: "$1,000 at " + num(L.policy) + "% for five years. Compounded once a year it is one number. Compounded every instant, which is what e is for, it is another.",
          lines: [["Once a year", "1000 × (1 + " + num(r, 4) + ")⁵ = " + cad(annual), ""],
                  ["Every instant", "1000 × e^(5 × " + num(r, 4) + ") = 1000 × e^" + num(5 * r, 4) + " = " + cad(cont), ""],
                  ["Difference", cad(cont - annual), ""]],
          answer: "Continuous compounding adds " + cad(cont - annual) + " over five years. Small, and it is exactly what e measures.",
          why: "e is the base whose growth rate equals its own size, which is what “compounding every instant” means. e^(rt) is the limit of compounding more and more often. Professionals also use ln for returns, because ln turns multiplying returns into adding them.",
          q: "Same rate, compounded every instant for ten years?",
          options: numOptions(cont10, [
            { v: cont * 2, why: "You doubled the five-year result. Growth compounds: it is e^(10r), not 2 × e^(5r)." },
            { v: 1000 * Math.pow(1 + r, 10), why: "That is once-a-year compounding for ten years. Continuous is e^(10r)." },
            { v: 1000 * (1 + 10 * r), why: "That is simple interest, no compounding at all." }
          ], v => cad(v))
        };
      }
    }
  },
  {
    id: "maxmin", track: "mcv4u", order: 10, name: "Maximums and minimums", code: "MCV4U B1.3, B2.4", prereq: "polyd", weight: 2,
    rule: {
      r: "Local maximums and minimums happen where f′(x) = 0. Then look at the second derivative: f″ > 0 is a valley (minimum), f″ < 0 is a hill (maximum).",
      tip: "Positive second derivative smiles, so the flat point is the bottom of the smile. Negative frowns, so the flat point is the top.",
      trap: "Solve f′(x) = 0, not f(x) = 0. The first finds flat points. The second finds where the graph crosses the x-axis."
    },
    practical: {
      kind: "finance", live: null,
      build() {
        return {
          source: "Fixed example",
          setup: "A shop orders stock in batches of q. Each order costs $100 to place, and it needs 50 orders a year at q = 100, so ordering costs 5000/q a year. Holding stock costs $2 per unit a year, so 2q. Total yearly cost C(q) = 5000/q + 2q. What batch size is cheapest?",
          lines: [["Rewrite", "C(q) = 5000q⁻¹ + 2q", ""],
                  ["Differentiate", "C′(q) = −5000q⁻² + 2", ""],
                  ["Set to zero", "5000 ÷ q² = 2, so q² = 2500, q = 50", ""],
                  ["Check", "C″(q) = 10000q⁻³ > 0, a valley, so a minimum", ""]],
          answer: "Order 50 at a time. Yearly cost C(50) = 100 + 100 = $200.",
          why: "Every “optimal” in a finance article is a derivative set to zero. Ordering more often costs money; holding more costs money; the minimum is where the two rates of change cancel. That is what f′(q) = 0 means in dollars.",
          q: "Orders now cost $200 to place, so C(q) = 10000/q + 2q. Best batch size?",
          options: [{ html: "About 71", ok: true }, { html: "100", ok: false, why: "You doubled the answer because the cost doubled. q² = 5000, so q = √5000 ≈ 70.7." },
                    { html: "50", ok: false, why: "That was the old answer. Dearer orders mean bigger batches." },
                    { html: "25", ok: false, why: "Dearer orders push you toward fewer, larger batches, not smaller ones." }]
        };
      }
    }
  },
  {
    id: "vbasic", track: "mcv4u", order: 11, name: "Vector basics", code: "MCV4U C1.4, C2.1", prereq: null, weight: 1,
    rule: {
      r: "Add, subtract and scale vectors one component at a time. The length of (a, b, c) is √(a² + b² + c²).",
      tip: "Length is just Pythagoras. In three dimensions it is Pythagoras twice.",
      trap: "Length is not the sum of the components. Square each one, add, then take the square root."
    },
    practical: {
      kind: "finance", live: "fx3",
      build(L) {
        const h = [1000, 500, 300], r = [L.usdcad, L.eurcad, L.gbpcad];
        const v = h.map((x, i) => x * r[i]), total = v[0] + v[1] + v[2];
        return {
          source: "USD/CAD " + fx(L.usdcad) + ", EUR/CAD " + fx(L.eurcad) + ", GBP/CAD " + fx(L.gbpcad) + ", Bank of Canada",
          setup: "You hold US$1,000, €500 and £300. That is a vector: (1000, 500, 300), one component per currency. What is it worth in Canadian dollars?",
          lines: [["Convert each", "(1000 × " + fx(r[0]) + ", 500 × " + fx(r[1]) + ", 300 × " + fx(r[2]) + ")", ""],
                  ["In dollars", "(" + num(v[0]) + ", " + num(v[1]) + ", " + num(v[2]) + ")", ""],
                  ["Total", num(v[0]) + " + " + num(v[1]) + " + " + num(v[2]) + " = " + cad(total), ""]],
          answer: "Your holdings are worth " + cad(total) + ".",
          why: "A portfolio is a vector. Each currency is a component, and converting is multiplying each component by its own rate. Rebalancing is vector subtraction: the trades you make are the difference between the vector you have and the one you want.",
          q: "You sell all the pounds for Canadian dollars. What are the remaining foreign holdings worth?",
          options: numOptions(v[0] + v[1], [
            { v: total, why: "That still includes the pounds. Selling them for Canadian dollars takes them out of the foreign holdings." },
            { v: v[0], why: "You dropped the euros too. Only the pounds were sold." },
            { v: total - 300, why: "You subtracted £300 as if it were C$300. It was worth " + cad(v[2]) + "." }
          ], v => cad(v))
        };
      }
    }
  },
  {
    id: "dotp", track: "mcv4u", order: 12, name: "Dot product and right angles", code: "MCV4U C2.4, C2.5", prereq: "vbasic", weight: 2,
    rule: {
      r: "u · v = u₁v₁ + u₂v₂ + u₃v₃. The answer is a single number. If it is 0, the vectors are at right angles.",
      tip: "Pair them up, multiply each pair, add. Signs are where the errors live, so say each one out loud.",
      trap: "The dot product is a number, not a vector."
    },
    practical: {
      kind: "finance", live: null,
      build() {
        return {
          source: "Fixed example",
          setup: "Half your money is in a stock fund, 30% in bonds, 20% in cash. This year the stock fund made 4%, bonds lost 2%, cash made 1%. What did the whole portfolio make?",
          lines: [["Weights", "w = (0.5, 0.3, 0.2)", ""],
                  ["Returns", "r = (0.04, −0.02, 0.01)", ""],
                  ["Dot product", "0.5(0.04) + 0.3(−0.02) + 0.2(0.01) = 0.020 − 0.006 + 0.002 = 0.016", "+1.6%"]],
          answer: "The portfolio made 1.6%.",
          why: "This is the cleanest example in the whole course. A portfolio's return is exactly the dot product of the weights vector and the returns vector. Pair each weight with its return, multiply, add. Every fund fact sheet you have ever read is quoting a dot product.",
          q: "Same funds, but weights (0.2, 0.3, 0.5): mostly cash. Return?",
          options: [{ html: "+0.7%", ok: true }, { html: "+1.6%", ok: false, why: "That is the original weighting. Moving money to cash changes the dot product." },
                    { html: "+3.0%", ok: false, why: "You added the three returns. The weights matter: multiply each by its weight first." },
                    { html: "+1.0%", ok: false, why: "You averaged the three returns. An average is a dot product with equal weights, and these are not equal." }]
        };
      }
    }
  },
  {
    id: "crossp", track: "mcv4u", order: 13, name: "Cross product", code: "MCV4U C2.6, C2.7", prereq: "dotp", weight: 3,
    rule: {
      r: "u × v = (u₂v₃ − u₃v₂,  u₃v₁ − u₁v₃,  u₁v₂ − u₂v₁). The answer is a vector at right angles to both.",
      tip: "Each component skips its own position and uses the other two, in a cycle: 2-3, then 3-1, then 1-2.",
      trap: "Order matters: v × u = −(u × v). And the middle component is where sign slips happen."
    },
    practical: {
      kind: "finance", live: null,
      build() {
        return {
          source: "Fixed example",
          setup: "You have $10,000 to spread across funds A, B and C, so x + y + z = 10000. You also want twice as much in A as in C, so x − 2z = 0. Each rule is a plane in three-space. Along what direction can you move without breaking either?",
          lines: [["Normals", "n₁ = (1, 1, 1), n₂ = (1, 0, −2)", ""],
                  ["Cross product", "n₁ × n₂ = (1(−2) − 1(0), 1(1) − 1(−2), 1(0) − 1(1))", ""],
                  ["Direction", "= (−2, 3, −1)", ""]],
          answer: "You can move along (−2, 3, −1): take $2 from A and $1 from C, put $3 in B, and both rules still hold.",
          why: "Two planes meet in a line, and the line runs at right angles to both normals. The cross product is the tool that builds a vector perpendicular to two others. The set of portfolios that obey both rules is that line, and this is its direction.",
          q: "Which of these moves also keeps both rules?",
          options: [{ html: "(−4, 6, −2)", ok: true }, { html: "(1, 1, 1)", ok: false, why: "That is the normal to the first plane. Moving along a normal breaks the rule fastest." },
                    { html: "(1, 0, −2)", ok: false, why: "That is the normal to the second plane. It breaks the second rule." },
                    { html: "(2, 3, 1)", ok: false, why: "Check the first rule: 2 + 3 + 1 = 6, not 0. That changes the total." }]
        };
      }
    }
  },
  {
    id: "lines", track: "mcv4u", order: 14, name: "Lines in space", code: "MCV4U C4.2", prereq: "vbasic", weight: 3,
    rule: {
      r: "A line needs a point and a direction. The direction through P and Q is Q − P. The vector equation is r = P + t(Q − P).",
      tip: "Direction is where you end minus where you start, the same as a displacement.",
      trap: "A point is not a direction. Adding two points gives a vector with no meaning here."
    },
    practical: {
      kind: "finance", live: null,
      build() {
        return {
          source: "Fixed example",
          setup: "At 45 your retirement money is 70% stocks, 20% bonds, 10% cash: the point (70, 20, 10). By 65 you want (30, 50, 20). A steady glide between them is a line in allocation space.",
          lines: [["Direction", "(30, 50, 20) − (70, 20, 10) = (−40, 30, 10) over 20 years", ""],
                  ["Per year", "(−2, 1.5, 0.5)", ""],
                  ["The line", "r = (70, 20, 10) + t(−2, 1.5, 0.5), t in years after 45", ""]],
          answer: "Every year, move 2% out of stocks, 1.5% into bonds, 0.5% into cash.",
          why: "A line is a point plus a multiple of a direction. Here the point is where you are, the direction is the yearly rebalance, and t is time. Fund companies sell this exact line under the name target-date fund.",
          q: "What is the allocation at 55, when t = 10?",
          options: [{ html: "(50, 35, 15)", ok: true }, { html: "(30, 50, 20)", ok: false, why: "That is the endpoint at 65. At 55 you are halfway." },
                    { html: "(60, 27.5, 12.5)", ok: false, why: "That is t = 5, age 50. Ten years after 45 is 55." },
                    { html: "(50, 30, 20)", ok: false, why: "The components must add to 100 and follow the direction: 20 + 10 × 1.5 = 35 for bonds." }]
        };
      }
    }
  }
];

/* The why-questions: reasons, not rules. One appears in every daily lesson. */
CP.WHY = [
  { q: "Why can a function have only one output for each input?",
    right: "So that knowing the input tells you the output for certain. That certainty is what lets you graph it, combine it, and ask how fast it changes.",
    wrong: [["Because two outputs would be impossible to draw.", "A circle has two outputs for most inputs and is easy to draw. The issue is predictability, not drawing."],
            ["Because mathematics does not allow two outputs.", "It does. Those are called relations. Functions are a choice, made because they are useful."],
            ["Because the vertical line test says so.", "The vertical line test is a picture of the rule, not the reason for it."]],
    explain: "Relations with two outputs are perfectly real: x = y² is one. What they lose is certainty. If an input of 4 could give 2 or −2, then “the value at 4” means nothing, and you cannot ask how fast it is changing. Requiring one output is the price of being able to say the answer." },
  { q: "Why does y = (x − 3)² sit 3 units to the right of y = x²?",
    right: "The function is being fed 3 less than x, so each output shows up 3 units later along the axis.",
    wrong: [["Because a minus sign means move right.", "That is the memorized rule, not the reason, and it misleads you on forms like (3 − x)²."],
            ["Because it subtracts 3 from every y-value.", "Subtracting from the output moves a graph down. Here the 3 is subtracted from the input."],
            ["It does not. It moves 3 to the left.", "Check a point: x² is 0 at x = 0, and (x − 3)² is 0 at x = 3. The zero moved right."]],
    explain: "You are not moving the graph. You are changing what the function is fed. To get out what x² gave at 0, you now have to put in 3. Every feature arrives 3 units later. This is why a and c behave as expected in y = af(k(x − d)) + c, and k and d seem backwards: a and c act on the output, k and d act on the input." },
  { q: "Why is there no derivative at a sharp corner?",
    right: "Zooming in never makes a corner look like a straight line, so there is no single slope to measure.",
    wrong: [["Because the function has no value at the corner.", "The function has a value at the corner. It is the slope that fails."],
            ["Because the slope there is infinite.", "Infinite slope is a vertical tangent, a different situation. At a corner, the slopes from the left and right disagree."],
            ["Because the slope there is zero.", "Zero slope means a flat tangent. A corner has no tangent at all."]],
    explain: "The derivative is the slope of the straight line a curve turns into when you zoom in far enough. A smooth curve flattens into a line. A corner stays a corner at every magnification, forever, so there is no line and no slope." },
  { q: "Why is the derivative of a constant zero?",
    right: "A constant never changes, and a derivative measures change.",
    wrong: [["Because a constant has no x in it.", "True, but that is a symptom, not the reason."],
            ["Because the power rule gives zero.", "That works mechanically but explains nothing."],
            ["Because the graph of a constant goes through zero.", "y = 7 never touches zero. Its graph is flat, and flat means slope zero."]],
    explain: "The derivative answers one question: how fast is the output changing? A constant's output never changes, so the answer is 0. Its graph is a horizontal line, and a horizontal line has slope 0. The rule is the consequence, not the reason." },
  { q: "What makes the number e special?",
    right: "eˣ is the one exponential whose slope at every point equals its own height.",
    wrong: [["It is the most precise irrational number.", "There is no such thing. e is special for what it does, not how it is written."],
            ["It is the base of the log key on a calculator.", "The log key is base 10. The ln key is base e, and it is named after e, not the reason for it."],
            ["It is the largest base an exponential can have.", "Any positive base works. e is special because its growth rate matches its size exactly."]],
    explain: "Every exponential aˣ has a derivative that is itself times a constant. For base 2 that constant is about 0.69. For base 3 it is about 1.10. Somewhere between, the constant is exactly 1, and the function is its own derivative. That base is e, about 2.718." },
  { q: "Why is the derivative of sin x equal to cos x?",
    right: "If you plot the slope of the sine curve at each point, you get 1, 0, −1, 0, 1: exactly the values of cosine.",
    wrong: [["Because sine and cosine are the same curve, shifted.", "They are shifts of each other, but that alone does not make one the derivative of the other."],
            ["Because sin²x + cos²x = 1.", "That identity is true, but it is not what makes the derivative work."],
            ["It is a definition, so there is no reason.", "It is a result you can check by reading slopes off the sine graph."]],
    explain: "At x = 0 sine climbs most steeply: slope 1. At π/2 it peaks and is flat: slope 0. At π it falls most steeply: slope −1. At 3π/2 it is flat again. Those slopes, 1, 0, −1, 0, trace out the cosine curve. This only works in radians. In degrees an awkward factor of π/180 appears, which is the real reason radians exist." },
  { q: "Why does log(ab) = log a + log b?",
    right: "A logarithm is an exponent, and when you multiply powers of the same base you add the exponents.",
    wrong: [["Because logs spread out over multiplication.", "Spreading out would give log a · log b. The real reason is the exponent law."],
            ["It only happens to work for base 10.", "It works for every base, because every base obeys the exponent laws."],
            ["Because logs turn addition into multiplication.", "Backwards. Logs turn multiplication into addition."]],
    explain: "If a = 10ᵐ and b = 10ⁿ, then ab = 10ᵐ⁺ⁿ. The exponent of the product is the sum of the exponents. Take logs of both sides: log(ab) = m + n = log a + log b. It is xᵐ · xⁿ = xᵐ⁺ⁿ read backwards." },
  { q: "If the first derivative is speed, what is the second derivative?",
    right: "Acceleration: how fast the speed itself is changing.",
    wrong: [["Distance travelled.", "Distance is the original function. Derivatives go from distance to speed to acceleration."],
            ["Average speed.", "Average speed is a rate over an interval, still a first-derivative idea."],
            ["Speed squared.", "The second derivative is the derivative of the derivative, not its square."]],
    explain: "The first derivative says how fast position changes. The second says how fast that rate changes. On a graph, the first tells you if you are going up or down; the second tells you if you are curving up like a valley or down like a hill." },
  { q: "Why does the chain rule multiply?",
    right: "Rates compound: if y changes 3 times as fast as u, and u changes 5 times as fast as x, then y changes 15 times as fast as x.",
    wrong: [["Because it is really the product rule.", "Different rule. The product rule is for two functions multiplied; the chain rule is for one inside another."],
            ["It actually adds the rates.", "Test it with gears: one turning twice as fast driving one that turns three times as fast gives six times, not five."],
            ["Because of the power rule.", "The power rule is one place the chain rule gets used, not its reason."]],
    explain: "Gears make it plain. A gear turning 2 times as fast drives one turning 3 times as fast: the last gear turns 6 times as fast as the first. Rates stacked inside each other multiply. The notation shows it too: (dy/du)(du/dx), where du cancels and leaves dy/dx." },
  { q: "What does the dot product of two vectors tell you?",
    right: "How much the two vectors point the same way. Zero means they are at right angles.",
    wrong: [["The area between them.", "That is the length of the cross product."],
            ["The length of the two combined.", "That is the length of u + v."],
            ["A vector at right angles to both.", "That is the cross product. The dot product is a single number."]],
    explain: "u · v = |u||v| cos θ. Take out the lengths and what is left is cos θ, which measures alignment. Same direction: largest. Right angles: zero, which is why a zero dot product is the test for perpendicular. Opposite directions: negative." },
  { q: "Why does the length of u × v equal the area of the parallelogram they make?",
    right: "Its length is |u||v| sin θ, and that is exactly base times height.",
    wrong: [["Because it multiplies all the components together.", "It does not; the formula subtracts pairs of products."],
            ["Because the cross product is at right angles to both.", "True, but that explains its direction, not its length."],
            ["Because it equals the dot product.", "The dot product uses cos θ and measures alignment, not area."]],
    explain: "Use u as the base of the parallelogram. The height is the part of v at right angles to u, which is |v| sin θ. Base times height is |u||v| sin θ, which is |u × v|." },
  { q: "Three planes, no two of them parallel, share no common point. How?",
    right: "They form a triangular prism: each pair meets in a line, but the three lines run parallel and never meet.",
    wrong: [["It cannot happen; non-parallel planes always share a point.", "The prism case proves otherwise. Picture the long box of a Toblerone bar."],
            ["They all meet in one line.", "Then every point on that line would be common to all three."],
            ["They are all the same plane.", "Then every point would be common, and they would be parallel as well."]],
    explain: "Stand three sheets of cardboard up as the sides of a Toblerone box. Each pair touches along an edge, but the three edges are parallel and never meet. Nothing is parallel, yet no point is on all three. It is the case most people miss, and algebraically it shows up as a contradiction such as 0 = 5." }
];

/* Level titles. Points thresholds are in engine.js. */
CP.LEVELS = ["Beginner", "Apprentice", "Journeyman", "Practitioner", "Adept", "Expert", "Master"];

CP.stepById = id => CP.STEPS.find(s => s.id === id);
