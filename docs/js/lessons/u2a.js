/* Full lessons: pow1, polyd, tan, fracpow (unit 2, derivative rules). */
window.CP = window.CP || {};
(function () {
CP.LESSONS = CP.LESSONS || {};
const { fmt } = CP.W, PI = Math.PI, V = CP.V;
const near = (a, b, tol) => Math.abs(a - b) <= tol;
/* a tangent line as "y = mx + b", rounded for a readout */
const lineStr = (m, b) => {
  const M = fmt(m, 2), B = fmt(Math.abs(b), 2);
  if (M === "0") return "y = " + fmt(b, 2);
  return "y = " + (M === "1" ? "" : M === "−1" ? "−" : M) + "x" + (B === "0" ? "" : (b < 0 ? " − " : " + ") + B);
};
/* a power slider value as a fraction: −1.5 shows as −3/2 */
const half = v => { const k = Math.round(v * 2); return k % 2 === 0 ? fmt(k / 2, 0) : fmt(k, 0) + "/2"; };

/* ======================= 4. Power rule, one term ======================= */
CP.LESSONS.pow1 = {
  big: "The slope of xⁿ is n·xⁿ⁻¹: bring the power down in front, then lower the power by one. A number in front rides along, so axⁿ becomes a·n·xⁿ⁻¹.",
  intro: [
    "Finding a slope from first principles works, but it takes half a page every time. The power rule does the same job in one line. It is the first real shortcut in calculus, and you will use it in almost every question from here on.",
    "You will find the rule yourself. Drag along x², read the slope at a few points, and look for the pattern. Then check that the same pattern works for x³, x⁴ and x⁵."
  ],
  see: [
    {
      h: "Read the slope of x²",
      text: "Drag the dot along the curve, or use the arrow keys. The purple line is the tangent: it shows how steep the curve is right there. Every slope you visit drops a dot in the lower panel. Keep an eye on the slope readout.",
      widget: { type: "tracer", f: x => x * x, df: x => 2 * x, x: [-4, 4], y: [-1.5, 17], dy: [-9, 9], x0: 2.5, ticks: 1,
        label: "y = x²", dlabel: "slope of x²", ghost: x => 2 * x, ghostLabel: "2x" },
      tasks: [
        { ask: "Drag to the bottom of the bowl.", check: s => near(s.x, 0, 0.08), got: "Slope 0. The bottom is flat." },
        { ask: "Drag to x = 1.", check: s => near(s.x, 1, 0.08), got: "Slope 2. Keep that number in mind." },
        { ask: "Drag to x = 3.", check: s => near(s.x, 3, 0.08), got: "Slope 6. At x = 1 it was 2, and at x = 3 it is 6. The slope is double the x." },
        { ask: "Test your guess on the left side. Drag to x = −2.", check: s => near(s.x, -2, 0.08), got: "Slope −4, double −2 again. Left of the bottom the curve falls, so the slope is negative." },
        { ask: "Press Sweep to trace every slope, then press Show 2x.", check: s => s.ghost && s.covered > 0.85, got: "The dots make a straight line through the origin, and 2x lands right on it. (x²)′ = 2x." }
      ],
      after: "The slope of x² is 2x. Look at where the 2 went: it came down in front, and the power dropped from 2 to 1. Those are the two beats of the power rule."
    },
    {
      h: "Any power: bring it down, drop it by one",
      text: "Now the power n is a slider. The slope readout is measured from the curve itself, so it is not using any rule. Predict each slope with the two beats before you look.",
      widget: { type: "tracer", f: (x, n) => Math.pow(x, n), df: (x, n) => n * Math.pow(x, n - 1), x: [-2, 2], x0: 1.5, ticks: 1,
        label: "y = xⁿ", dlabel: "slope of xⁿ", ghost: (x, n) => n * Math.pow(x, n - 1), ghostLabel: "n·xⁿ⁻¹",
        param: { name: "n", label: "power n", min: 1, max: 5, step: 1, val: 3, show: v => fmt(v, 0) } },
      tasks: [
        { ask: "Leave n at 3, so the curve is x³. Drag to x = 1.", check: s => near(s.p, 3, 0.01) && near(s.x, 1, 0.05), got: "Slope 3, the same as the power. At x = 1 every power of x is 1, so only the number in front shows." },
        { ask: "Keep n = 3 and drag to x = 2.", check: s => near(s.p, 3, 0.01) && near(s.x, 2, 0.05), got: "Slope 12. That is 3 × 2²: the 3 came down in front, and the power dropped from 3 to 2. So (x³)′ = 3x²." },
        { ask: "Predict the slope of x⁴ at x = 2. Then set n = 4 and stay at x = 2 to check.", check: s => near(s.p, 4, 0.01) && near(s.x, 2, 0.05), got: "Slope 32 = 4 × 2³ = 4 × 8. Bring the 4 down, drop the power to 3." },
        { ask: "Set n = 1. What happens to the slope?", check: s => near(s.p, 1, 0.01), got: "y = x is a straight line with slope 1 everywhere. The rule agrees: 1 · x⁰ = 1, because x⁰ = 1." },
        { ask: "Set n = 5, press Sweep, then show n·xⁿ⁻¹.", check: s => near(s.p, 5, 0.01) && s.ghost && s.covered > 0.85, got: "The dashed curve 5x⁴ runs through every dot. Try any other n: it always fits." }
      ],
      after: "For every power, the slope of xⁿ is n·xⁿ⁻¹. Beat one: multiply by the power. Beat two: lower the power by one. Say both beats every time."
    },
    {
      h: "A number in front rides along",
      text: "Here the curve is a·x². The slider a stretches it up and down. Watch what the stretch does to the slope at one point.",
      widget: { type: "tracer", f: (x, a) => a * x * x, df: (x, a) => 2 * a * x, x: [-2, 2], y: [-12, 12], dy: [-13, 13], x0: -1.2, ticks: 1,
        label: "y = a·x²", dlabel: "slope of a·x²", ghost: (x, a) => 2 * a * x, ghostLabel: "2a·x",
        param: { name: "a", label: "number in front, a", min: -3, max: 3, step: 0.5, val: 1, show: v => fmt(v, 1) } },
      tasks: [
        { ask: "Leave a = 1 and drag to x = 1.", check: s => near(s.p, 1, 0.01) && near(s.x, 1, 0.05), got: "Slope 2, the slope of x² from the first picture." },
        { ask: "Stay at x = 1 and set a = 3.", check: s => near(s.p, 3, 0.01) && near(s.x, 1, 0.05), got: "Slope 6, three times as steep. 3x² is x² stretched up 3 times, so every slope is 3 times bigger: (3x²)′ = 3 · 2x = 6x." },
        { ask: "Now set a = −2.", check: s => near(s.p, -2, 0.01), got: "The curve flips upside down, and so does every slope: (−2x²)′ = −2 · 2x = −4x. At x = 1 that is −4." },
        { ask: "Set a = 0.", check: s => near(s.p, 0, 0.01), got: "The curve squashes flat onto y = 0. A flat line has slope 0 everywhere, whatever x is." }
      ],
      after: "The number in front just scales every slope: (a·xⁿ)′ = a·n·xⁿ⁻¹. And a flat line has slope 0, which is why a constant on its own, like 7, has derivative 0."
    }
  ],
  why: {
    lead: "The slope at x is the limit of rise ÷ run as the run h shrinks to 0. Expand (x + h)ⁿ and watch which terms survive. Only one does, and it is n·xⁿ⁻¹.",
    steps: [
      ["(x²)′ = lim<sub>h→0</sub> [(x + h)² − x²] ÷ h", "Start from the definition of slope."],
      ["(x + h)² − x² = 2xh + h²", "Expand x² + 2xh + h², and the x² cancels."],
      ["(2xh + h²) ÷ h = 2x + h → 2x", "Divide by h, then let h shrink to 0."],
      ["(x + h)³ − x³ = 3x²h + 3xh² + h³", "Same move for x³. Expand, and the x³ cancels."],
      ["÷ h: 3x² + 3xh + h² → 3x²", "Every term that still has an h in it vanishes."],
      ["(x + h)ⁿ = xⁿ + n·xⁿ⁻¹h + (terms with h², h³, …)", "Multiply out n brackets of (x + h). To get exactly one h, take h from one bracket and x from the rest. There are n ways to do that."],
      ["[(x + h)ⁿ − xⁿ] ÷ h = n·xⁿ⁻¹ + (terms with h) → n·xⁿ⁻¹", "Cancel xⁿ, divide by h, and let h → 0. Only n·xⁿ⁻¹ is left."],
      ["(a·xⁿ)′ = a·n·xⁿ⁻¹", "Multiplying the curve by a multiplies every rise by a, so every slope too."]
    ],
    end: "A constant c is a flat line: (c − c) ÷ h = 0 for every h, so its derivative is 0. And 5x is a line of slope 5, which matches 5 · 1 · x⁰ = 5. The rule also works for negative and fraction powers. That comes in a later step."
  },
  examples: [
    { q: "Differentiate f(x) = 4x³.",
      steps: [["4 × 3 = 12", "Beat one: bring the power 3 down and multiply."], ["3 − 1 = 2", "Beat two: lower the power by one."]],
      a: "f′(x) = 12x²" },
    { q: "Differentiate f(x) = −3x⁶. Then find the slope at x = −1.",
      steps: [["−3 × 6 = −18", "Bring the 6 down."], ["f′(x) = −18x⁵", "Lower the power from 6 to 5."], ["(−1)⁵ = −1", "An odd power of −1 is −1."], ["f′(−1) = −18 × (−1) = 18", "Substitute."]],
      a: "f′(x) = −18x⁵, and the slope at x = −1 is 18" },
    { q: "Find the slope of f(x) = 6 ÷ x² at x = 2.",
      steps: [["f(x) = 6x⁻²", "Rewrite first: 1 ÷ x² = x⁻². The power rule needs a power of x."], ["6 × (−2) = −12", "Bring the −2 down."], ["−2 − 1 = −3", "Lower the power by one. One lower than −2 is −3."], ["f′(x) = −12x⁻³ = −12 ÷ x³", "Put it together, then write it as a fraction again."], ["f′(2) = −12 ÷ 8 = −1.5", "2³ = 8."]],
      a: "−1.5" }
  ],
  mistakes: [
    { wrong: "(4x³)′ = 12x³", why: "Only one beat. The 3 came down, but the power was not lowered.", fix: "(4x³)′ = 12x²" },
    { wrong: "(3x²)′ = 5x", why: "The power was added to the number in front. It multiplies: 3 × 2 = 6.", fix: "(3x²)′ = 6x" },
    { wrong: "(5x)′ = 0", why: "x¹ becomes 1 · x⁰, and x⁰ = 1, not 0. The graph of 5x is a straight line with slope 5, so the answer can’t be 0.", fix: "(5x)′ = 5" },
    { wrong: "(−7)′ = −7", why: "A derivative measures change. y = −7 is a flat line that never changes, so its slope is 0.", fix: "(−7)′ = 0" }
  ],
  teach: {
    script: [
      "Draw y = x². Lay a ruler on it as a tangent at x = 1, then x = 2, then x = 3. Ask him to estimate each slope. They come out near 2, 4 and 6.",
      "Ask what rule turns 1, 2, 3 into 2, 4, 6. Double it. So the slope of x² is 2x.",
      "Say: the 2 came down in front, and the power dropped from 2 to 1. Two beats: multiply by the power, then lower it by one.",
      "Test it on x³. The rule says 3x², which is 12 at x = 2. Check on a calculator: (2.001³ − 8) ÷ 0.001 ≈ 12.006.",
      "Finish with the two special cases. 5x is a straight line, so its slope is 5. 7 is a flat line, so its slope is 0."
    ],
    board: "Draw y = x² large on grid paper with tangent lines at x = 1, 2 and 3. Write each slope under its x. Then write x³, x⁴ and x⁵ in a column and have him fill in each derivative beside it.",
    ask: [
      { q: "What is the derivative of x⁷? Say the two beats out loud.", listen: "“Bring the 7 down, drop the power to 6: 7x⁶.” If he says 7x⁷ or x⁶, ask which beat he skipped." },
      { q: "Why is the derivative of 9 equal to 0, not 9?", listen: "“y = 9 is a flat line. It never changes, so its slope is 0.” If he says 9, draw y = 9 and ask how steep it is." },
      { q: "The slope of x² at x = 3 is 6. What is the slope of 5x² at x = 3?", listen: "“30, five times as steep.” (5x²)′ = 10x, and 10 × 3 = 30. If he says 6 or 10, show that 5x² is x² stretched up 5 times." }
    ],
    confusion: "The two beats get mixed up or half done: 4x³ becomes 12x³ (forgot to lower) or 4x² (forgot to multiply). Have him say both beats out loud every time for the first week. The other trap is 5x. Many students think x⁰ = 0 and write 0. But x⁰ = 1, so (5x)′ = 5."
  },
  recap: [
    "(xⁿ)′ = n·xⁿ⁻¹: bring the power down, then lower it by one.",
    "A number in front rides along: (a·xⁿ)′ = a·n·xⁿ⁻¹.",
    "(5x)′ = 5 and (7)′ = 0: a straight line has a fixed slope, and a flat line has slope 0."
  ]
};

/* ======================= 5. Power rule, whole polynomials ======================= */
CP.LESSONS.polyd = {
  big: "Differentiate a polynomial one term at a time and add the results. A constant term only shifts the curve up or down, so its derivative is 0 and it disappears.",
  intro: [
    "A polynomial is a sum of power terms, like 2x⁵ − 4x³ + x − 9. You already know how to differentiate each term on its own. This step says you can do them one at a time and add the answers.",
    "Why that works, and why the constant vanishes, is easiest to see in a picture. Sliding a curve up or down moves every point by the same amount, so no slope changes."
  ],
  see: [
    {
      h: "Shifting a curve up changes no slope",
      text: "The curve is x³ − 3x + c. The slider c is the constant term: it lifts or drops the whole curve. Watch the slope readout and the lower panel while you move it.",
      widget: { type: "tracer", f: (x, c) => x * x * x - 3 * x + c, df: x => 3 * x * x - 3, x: [-2.5, 2.5], y: [-10, 10], dy: [-5, 17], x0: 0.5, ticks: 1,
        label: "y = x³ − 3x + c", dlabel: "slope", ghost: x => 3 * x * x - 3, ghostLabel: "3x² − 3",
        param: { name: "c", label: "constant c", min: -4, max: 4, step: 0.5, val: 2, show: v => fmt(v, 1) } },
      tasks: [
        { ask: "Drag to x = 2 and read the slope.", check: s => near(s.x, 2, 0.05), got: "Slope 9. That is 3(2)² − 3 = 12 − 3." },
        { ask: "Keep the dot at x = 2. Slide c a long way up or down.", check: s => near(s.x, 2, 0.05) && Math.abs(s.p - 2) >= 2, got: "The curve moves, but the slope still reads 9. Lifting a curve doesn’t make it any steeper." },
        { ask: "Find a point where the curve is flat.", check: s => Math.abs(Math.abs(s.x) - 1) <= 0.05, got: "x = 1 or x = −1, where 3x² − 3 = 0. Move c again: the flat points stay at x = ±1." },
        { ask: "Press Sweep, then show 3x² − 3.", check: s => s.ghost && s.covered > 0.85, got: "Every dot sits on 3x² − 3, and there is no c in it. Change c and sweep again: same dots." }
      ],
      after: "The constant only sets how high the curve sits. It never changes how steep it is. So (x³ − 3x + c)′ = 3x² − 3 for every c: the constant’s derivative is 0."
    },
    {
      h: "Add the slopes of the pieces",
      text: "The curve is x³ − 6x. The grey curves are its two pieces, x³ and −6x. The last two readouts show each piece’s slope at your point. Compare their sum with the slope of the whole curve.",
      widget: { type: "tracer", f: x => x * x * x - 6 * x, df: x => 3 * x * x - 6, x: [-3, 3], y: [-10.5, 10.5], dy: [-8, 22], x0: -2.5, ticks: 1,
        label: "y = x³ − 6x", dlabel: "slope of x³ − 6x", ghost: x => 3 * x * x - 6, ghostLabel: "3x² − 6",
        extra: [{ f: x => x * x * x, cls: "s5 wghost" }, { f: x => -6 * x, cls: "s5 wghost" }],
        readouts: [{ label: "slope of x³", value: s => fmt(3 * s.x * s.x, 3) }, { label: "slope of −6x", value: () => "−6" }] },
      tasks: [
        { ask: "Drag to x = 2.", check: s => near(s.x, 2, 0.06), got: "The x³ piece has slope 12 there, and −6x has slope −6. The total slope is 12 − 6 = 6, the sum of the two." },
        { ask: "Drag to x = 0.", check: s => near(s.x, 0, 0.06), got: "x³ is flat at 0, so all the slope comes from −6x: the total is −6." },
        { ask: "Find a point where the whole curve is flat.", check: s => Math.abs(s.m) < 0.5, got: "Near x = ±1.41. There the x³ piece climbs at 6 and −6x falls at 6, so they cancel: 3x² − 6 = 0 gives x = ±√2." },
        { ask: "Press Sweep, then show 3x² − 6.", check: s => s.ghost && s.covered > 0.85, got: "A perfect fit. The slope of x³ − 6x is the slope of x³ plus the slope of −6x." }
      ],
      after: "The slope of a sum is the sum of the slopes. So you can take a polynomial apart, use the power rule on each term, and add: (x³ − 6x)′ = 3x² − 6."
    }
  ],
  why: {
    lead: "Two facts make this work: the slope of a sum is the sum of the slopes, and a constant has slope 0. Both come straight from the definition of slope.",
    steps: [
      ["f(x) = u(x) + v(x)", "Any sum of two terms, like x³ and −6x."],
      ["f(x + h) − f(x) = [u(x + h) − u(x)] + [v(x + h) − v(x)]", "The total rise is the rise of u plus the rise of v."],
      ["[f(x + h) − f(x)] ÷ h = [u(x + h) − u(x)] ÷ h + [v(x + h) − v(x)] ÷ h", "Divide everything by the run h."],
      ["f′(x) = u′(x) + v′(x)", "Let h shrink to 0. Each part becomes its own derivative."],
      ["for a constant c: (c − c) ÷ h = 0", "A constant has the same value at x and at x + h, so its rise is always 0."],
      ["(x³ − 6x + 4)′ = 3x² − 6 + 0 = 3x² − 6", "Put the pieces together."]
    ],
    end: "The same argument works for any number of terms, and for differences, since −v is just (−1)·v. Note what this does not say: products don’t split this way. The derivative of (x² + 1)(x − 3) is not 2x · 1. Expand it first, or use the product rule from a later step."
  },
  examples: [
    { q: "Differentiate f(x) = 3x² + 5x − 7.",
      steps: [["3x² → 6x", "Power rule: 3 × 2 = 6, and the power drops to 1."], ["5x → 5", "A line of slope 5."], ["−7 → 0", "The constant disappears."]],
      a: "f′(x) = 6x + 5" },
    { q: "Differentiate f(x) = −2x⁵ + 4x³ − x + 9.",
      steps: [["9 → 0", "Cross out the constant first, so you can’t forget it."], ["−2x⁵ → −10x⁴", "−2 × 5 = −10, and the power drops from 5 to 4."], ["4x³ → 12x²", "4 × 3 = 12, and the power drops from 3 to 2."], ["−x → −1", "−x is −1 · x¹, so its slope is −1."]],
      a: "f′(x) = −10x⁴ + 12x² − 1" },
    { q: "Find f′(x) for f(x) = (x² + 1)(x − 3). Then find the slope at x = 2.",
      steps: [["f(x) = x³ − 3x² + x − 3", "Expand first. Term by term works on sums, not on products."], ["f′(x) = 3x² − 6x + 1", "Power rule on each term. The −3 disappears."], ["f′(2) = 3(2)² − 6(2) + 1", "Substitute x = 2."], ["= 12 − 12 + 1 = 1", "Simplify."]],
      a: "f′(x) = 3x² − 6x + 1, and f′(2) = 1" }
  ],
  mistakes: [
    { wrong: "(x³ + 2x − 7)′ = 3x² + 2 − 7", why: "The constant was copied across. A constant shifts the curve up or down and never changes its slope, so it differentiates to 0.", fix: "(x³ + 2x − 7)′ = 3x² + 2" },
    { wrong: "(4x³ + 5x²)′ = 12x² + 5x²", why: "Only the first term got the power rule. Every term gets its own two beats.", fix: "(4x³ + 5x²)′ = 12x² + 10x" },
    { wrong: "(2x³ − x)′ = 6x² − x", why: "The −x term was left alone. −x is −1 · x¹, and its slope is −1.", fix: "(2x³ − x)′ = 6x² − 1" },
    { wrong: "[(x² + 1)(x − 3)]′ = 2x · 1 = 2x", why: "Term by term works for sums, not products. Multiplying the two derivatives gives the wrong answer: at x = 2 it gives 4, but the true slope is 1.", fix: "Expand first: x³ − 3x² + x − 3, so f′(x) = 3x² − 6x + 1." }
  ],
  teach: {
    script: [
      "Draw y = x² and, on the same axes, y = x² + 3. Ask: at x = 1, which one is steeper? Neither. They are the same shape, one sitting 3 higher.",
      "So adding a constant changes no slope. Its derivative must be 0. That is why constants disappear.",
      "Explain why adding works: the rise of a sum is the sum of the rises, so the slope of a sum is the sum of the slopes.",
      "Write 2x⁵ − 4x³ + x − 9 and have him cross out the 9 first.",
      "Then go left to right, saying the two beats for each term out loud: 10x⁴, then −12x², then 1."
    ],
    board: "Two parabolas, y = x² and y = x² + 3, one above the other, with parallel tangent lines at x = 1. Under them, a polynomial written out with a box around each term and an arrow from each box to its derivative.",
    ask: [
      { q: "What is the derivative of x⁴ + 100?", listen: "“4x³. The 100 just lifts the curve.” If he writes 4x³ + 100, point at the two parabolas: did lifting change the slope?" },
      { q: "Two curves both have derivative 3x² − 6. Must they be the same curve?", listen: "“No. One can be the other shifted up or down.” If he says yes, show x³ − 6x and x³ − 6x + 5." },
      { q: "Is the derivative of (x + 1)(x + 2) equal to 1 × 1 = 1?", listen: "“No. Expand first: x² + 3x + 2, so the derivative is 2x + 3.” If he says yes, check at x = 0: the true slope there is 3, not 1." }
    ],
    confusion: "Two slips. First, keeping the constant, especially when it is large or negative. Have him cross it out before he does anything else. Second, forgetting that a lone x has derivative 1, not 0 and not x. Ask what the graph of y = x looks like: a line of slope 1."
  },
  recap: [
    "Differentiate term by term, then add: (u + v)′ = u′ + v′.",
    "A constant term only shifts the curve up or down, so its derivative is 0.",
    "This works for sums only. Expand a product before you differentiate it."
  ]
};

/* ======================= 6. Slope of a tangent at a point ======================= */
CP.LESSONS.tan = {
  big: "The slope of the tangent at x = a is f′(a). Find the derivative first, then put in a. The height f(a) and the slope f′(a) are different numbers that answer different questions.",
  intro: [
    "A tangent line touches a curve at one point and runs in the same direction as the curve there. Its slope tells you how steep the curve is at that point.",
    "You already have the tool. The derivative f′(x) gives the slope at every x, so to get the slope at one point, you put that x into f′. With the slope and the point, you can also write the tangent line’s equation."
  ],
  see: [
    {
      h: "Height is not slope",
      text: "Drag along f(x) = x² − 2x − 1. The readouts give the height f(a) and the slope f′(a) at your point, and the equation of the purple tangent line.",
      widget: { type: "tracer", f: x => x * x - 2 * x - 1, df: x => 2 * x - 2, x: [-2, 4], y: [-3, 8], dy: [-7, 7], x0: 0.3, ticks: 1,
        label: "f(x) = x² − 2x − 1", dlabel: "slope f′(a)", ylabel: "height f(a)", mlabel: "slope f′(a)",
        ghost: x => 2 * x - 2, ghostLabel: "f′(x) = 2x − 2",
        readouts: [{ label: "tangent line", value: s => lineStr(s.m, s.y - s.m * s.x) }] },
      tasks: [
        { ask: "Drag to x = 3.", check: s => near(s.x, 3, 0.06), got: "Height f(3) = 2. Slope f′(3) = 4. One says how high the curve is, the other how steep." },
        { ask: "Find the other point where the height is also 2.", check: s => near(s.x, -1, 0.06), got: "x = −1. Same height, 2, but the slope is −4. Knowing f(a) tells you nothing about f′(a)." },
        { ask: "Find the point where the tangent is horizontal.", check: s => Math.abs(s.m) < 0.12, got: "x = 1, the bottom. f′(1) = 2(1) − 2 = 0, and the tangent is the flat line y = −2." },
        { ask: "Press Sweep, then show f′(x) = 2x − 2.", check: s => s.ghost && s.covered > 0.85, got: "Every slope you read is a point on the graph of f′. To get the slope at x = a, put a into f′(x)." }
      ],
      after: "f′(x) is a slope formula that works for every x at once. Find it first. Then put in the x you care about to get the slope of the tangent there."
    },
    {
      h: "Write the tangent line",
      text: "The curve is f(x) = x² + 1. The readout shows the tangent at your point as y = mx + b, where b is the height at which the tangent crosses the y-axis. Hunt for some special tangents.",
      widget: { type: "tracer", f: x => x * x + 1, df: x => 2 * x, x: [-3, 3], y: [-3, 10], x0: -2.3, ticks: 1, panel2: false,
        label: "f(x) = x² + 1", ylabel: "f(a)", mlabel: "m = f′(a)",
        readouts: [{ label: "tangent line", value: s => lineStr(s.m, s.y - s.m * s.x) }, { label: "b", value: s => fmt(s.y - s.m * s.x, 2) }] },
      tasks: [
        { ask: "Drag to x = 2. Where does the tangent line come from?", check: s => near(s.x, 2, 0.06), got: "The point is (2, 5) and the slope is f′(2) = 4. Then 5 = 4(2) + b gives b = −3, so the tangent is y = 4x − 3." },
        { ask: "Find a point with x > 0 whose tangent passes through the origin, (0, 0).", check: s => s.x > 0 && Math.abs(s.y - s.m * s.x) < 0.08, got: "x = 1. The tangent is y = 2x. Its b is 0, so it goes through (0, 0)." },
        { ask: "Now find the tangent whose slope is −2.", check: s => near(s.m, -2, 0.12), got: "f′(x) = 2x = −2 gives x = −1. The tangent is y = −2x, and it also passes through (0, 0). So two tangents to this curve go through the origin." }
      ],
      after: "A tangent line needs one point and one slope. The point (a, f(a)) comes from f. The slope m = f′(a) comes from f′. Then b = f(a) − m·a."
    }
  ],
  why: {
    lead: "Why is the tangent’s slope f′(a)? A derivative is built from lines that cut the curve at two points. As the two points slide together, those lines turn into the tangent.",
    steps: [
      ["P = (a, f(a)) and Q = (a + h, f(a + h))", "Two points on the curve, h apart."],
      ["slope of PQ = [f(a + h) − f(a)] ÷ h", "The line through them is a secant. Its slope is rise ÷ run."],
      ["h → 0: Q slides along the curve to P", "The secant swings round and settles on the tangent at P."],
      ["slope of tangent = lim<sub>h→0</sub> [f(a + h) − f(a)] ÷ h = f′(a)", "That limit is the definition of the derivative at a."],
      ["y − f(a) = f′(a)(x − a)", "The tangent is the line through (a, f(a)) with slope f′(a)."],
      ["y = mx + b with m = f′(a) and b = f(a) − f′(a) · a", "Expand to put it in y = mx + b form."]
    ],
    end: "Order matters. f′(x) is a formula that works for every x, so you differentiate first and substitute second. If you put a in first, f(a) is just a number, and the derivative of a number is 0. That is not the slope."
  },
  examples: [
    { q: "Find the slope of the tangent to f(x) = 2x² + 3x − 1 at x = 2.",
      steps: [["f′(x) = 4x + 3", "Differentiate first, term by term."], ["f′(2) = 4(2) + 3 = 11", "Then put in x = 2."]],
      a: "11" },
    { q: "Find the slope of the tangent to f(x) = x³ − 4x² + 2x − 5 at x = −1.",
      steps: [["f′(x) = 3x² − 8x + 2", "Power rule on each term. The −5 disappears."], ["f′(−1) = 3(−1)² − 8(−1) + 2", "Substitute, with brackets around −1."], ["= 3 + 8 + 2 = 13", "(−1)² = 1, and −8 × (−1) = +8."]],
      a: "13" },
    { q: "Find the equation of the tangent to f(x) = x² − 3x + 2 at x = 4.",
      steps: [["f′(x) = 2x − 3", "Derivative first."], ["m = f′(4) = 2(4) − 3 = 5", "The slope at x = 4."], ["f(4) = 16 − 12 + 2 = 6", "The point on the curve is (4, 6)."], ["6 = 5(4) + b, so b = −14", "Put the point into y = mx + b."], ["y = 5x − 14", "Write the line."]],
      a: "y = 5x − 14" }
  ],
  mistakes: [
    { wrong: "f(x) = x², slope at x = 3: f(3) = 9, and (9)′ = 0", why: "The number went in before the derivative. 9 is a constant, so its derivative is 0, which says nothing about the curve.", fix: "Differentiate first: f′(x) = 2x. Then f′(3) = 6." },
    { wrong: "The slope of f(x) = x² + 4 at x = 1 is 5.", why: "5 is f(1), the height of the curve. The slope is f′(1).", fix: "f′(x) = 2x, so the slope is f′(1) = 2." },
    { wrong: "f′(x) = 3x², so f′(−2) = 3 × −2² = −12", why: "Without brackets, −2² means −(2²) = −4. You must square the whole −2, which gives +4.", fix: "f′(−2) = 3(−2)² = 3 × 4 = 12" },
    { wrong: "Tangent to x² + 1 at x = 2: y = 4x + 5", why: "The height f(2) = 5 was used as b. But b is where the line crosses the y-axis, at x = 0, not at x = 2.", fix: "Solve 5 = 4(2) + b to get b = −3, so y = 4x − 3." }
  ],
  teach: {
    script: [
      "Draw a parabola and lay a ruler on it so it just touches at one point. That is the tangent. Ask how you would measure its slope.",
      "Remind him that f′(x) is a slope machine: put in any x and it gives the slope there.",
      "Write the order on the board: 1. differentiate, 2. substitute. Ask what goes wrong if he swaps them. He gets the slope of a constant, which is 0.",
      "For the equation, he needs a point and a slope. The point (a, f(a)) comes from the original function. The slope f′(a) comes from the derivative.",
      "Finish with a horizontal tangent: set f′(x) = 0 and solve. That finds the tops and bottoms of the curve."
    ],
    board: "A parabola with a straight tangent at one point. Label the point (a, f(a)) and write m = f′(a) along the line. Beside it, write the recipe: 1. differentiate, 2. substitute.",
    ask: [
      { q: "For f(x) = x² − 2x − 1, what are f(3) and f′(3)?", listen: "“f(3) = 2, the height. f′(3) = 4, the slope.” If he gives the same number for both, ask which one is about steepness." },
      { q: "Where is the tangent to y = x² − 6x horizontal?", listen: "“Where y′ = 2x − 6 = 0, so at x = 3.” If he sets y = 0 instead, he has found where the curve crosses the x-axis, not where it is flat." },
      { q: "A tangent has slope 4 and touches the curve at (2, 5). What is its equation?", listen: "“y = 4x − 3, because 5 = 8 + b.” If he writes y = 4x + 5, ask him to put x = 2 into his line. He gets 13, not 5." }
    ],
    confusion: "The big one is mixing up f(a) and f′(a). Keep asking “height or steepness?” The second is putting the number in before differentiating. Have him write f′(x) = … as a full line before any number goes in. When writing the line, students often use f(a) as b. But b is the height at x = 0, not at x = a."
  },
  recap: [
    "The slope of the tangent at x = a is f′(a): differentiate first, then substitute.",
    "f(a) is the height and f′(a) is the steepness. They are different numbers.",
    "The tangent goes through (a, f(a)) with slope m = f′(a). Find b from f(a) = m·a + b."
  ]
};

/* ======================= Roots and negative powers ======================= */
CP.LESSONS.fracpow = {
  big: "The power rule works for every power, not just whole numbers. Rewrite roots as fraction powers and 1 ÷ xⁿ as x⁻ⁿ. Then bring the power down and lower it by one, as usual.",
  intro: [
    "So far you have used the power rule on whole-number powers like x³. But √x and 1 ÷ x are powers too: √x = x<sup>1/2</sup> and 1 ÷ x = x⁻¹. Once you rewrite them, the same two beats work.",
    "The only new skill is the exponent arithmetic. Lowering by one still means subtract 1. So 1/2 becomes −1/2, and −2 becomes −3. A negative power moves further from zero, not toward it."
  ],
  see: [
    {
      h: "The slope of √x",
      text: "Drag along y = √x. Watch the slope readout, especially as you get close to x = 0.",
      widget: { type: "tracer", f: x => Math.sqrt(x), df: x => 0.5 / Math.sqrt(x), x: [0, 4], y: [-0.2, 2.4], dy: [-0.5, 3], x0: 2.5, ticks: 1,
        label: "y = √x", dlabel: "slope of √x", ghost: x => 0.5 / Math.sqrt(x), ghostLabel: "1 ÷ (2√x)" },
      tasks: [
        { ask: "Drag to x = 1.", check: s => near(s.x, 1, 0.05), got: "Slope 0.5. The power rule says ½x<sup>−1/2</sup>, and at x = 1 that is ½." },
        { ask: "Drag to x = 4.", check: s => near(s.x, 4, 0.05), got: "Slope 0.25 = 1 ÷ (2 × 2). The curve gets flatter as it goes." },
        { ask: "Now drag as close to x = 0 as you can.", check: s => s.x < 0.02, got: "The slope shoots up: 2.5 at x = 0.04 and 5 at x = 0.01. At x = 0 there is no slope at all: the curve leaves the origin going straight up." },
        { ask: "Press Sweep, then show 1 ÷ (2√x).", check: s => s.ghost && s.covered > 0.85, got: "The dashed curve runs through every dot and rockets upward near 0." }
      ],
      after: "The slope of √x is 1 ÷ (2√x), which is ½x<sup>−1/2</sup>. That is exactly the power rule: the ½ comes down, and the power drops from 1/2 to −1/2. Near 0 the bottom, 2√x, gets tiny, so the slope blows up."
    },
    {
      h: "Any power at all",
      text: "Now the power n is a slider that also takes negative and fraction values. Only x > 0 is shown, so every power makes sense. Test the two beats on the strange ones.",
      widget: { type: "tracer", f: (x, n) => Math.pow(x, n), df: (x, n) => n * Math.pow(x, n - 1), x: [0.5, 3], x0: 2.5, ticks: 1,
        label: "y = xⁿ", dlabel: "slope of xⁿ", ghost: (x, n) => n * Math.pow(x, n - 1), ghostLabel: "n·xⁿ⁻¹",
        param: { name: "n", label: "power n", min: -2, max: 3, step: 0.5, val: 2, show: half } },
      tasks: [
        { ask: "Set n = −1, so the curve is 1 ÷ x. Drag to x = 1.", check: s => near(s.p, -1, 0.01) && near(s.x, 1, 0.04), got: "Slope −1. The rule says (x⁻¹)′ = −1 · x⁻², and at x = 1 that is −1. The curve falls, so the slope is negative." },
        { ask: "Keep n = −1. Drag to x = 2.", check: s => near(s.p, -1, 0.01) && near(s.x, 2, 0.04), got: "Slope −0.25 = −1 ÷ 2². The power went from −1 down to −2, not up to 0." },
        { ask: "Predict the slope of x⁻² at x = 1. Then set n = −2 and drag to x = 1 to check.", check: s => near(s.p, -2, 0.01) && near(s.x, 1, 0.04), got: "Slope −2. (x⁻²)′ = −2x⁻³, and at x = 1 every power of x is 1." },
        { ask: "Set n = 3/2, press Sweep, then show n·xⁿ⁻¹.", check: s => near(s.p, 1.5, 0.01) && s.ghost && s.covered > 0.85, got: "The dashed curve (3/2)x<sup>1/2</sup> lands on every dot. The same two beats work for every power." }
      ],
      after: "Negative powers and fractions follow the same two beats: (xⁿ)′ = n·xⁿ⁻¹ for any n. Rewrite first, and take care subtracting 1."
    }
  ],
  why: {
    lead: "The proof of n·xⁿ⁻¹ by expanding (x + h)ⁿ only works for whole n. For 1 ÷ x and √x, go back to first principles and check that the same formula comes out.",
    steps: [
      ["(1/x)′ = lim<sub>h→0</sub> [1/(x + h) − 1/x] ÷ h", "Start from the definition of slope."],
      ["1/(x + h) − 1/x = −h ÷ [x(x + h)]", "Use a common denominator: [x − (x + h)] ÷ [x(x + h)]."],
      ["÷ h: −1 ÷ [x(x + h)] → −1 ÷ x²", "Cancel h, then let h → 0."],
      ["−1 ÷ x² = −1 · x⁻²", "That is n·xⁿ⁻¹ with n = −1."],
      ["(√x)′ = lim<sub>h→0</sub> [√(x + h) − √x] ÷ h", "Same start for the square root."],
      ["= lim 1 ÷ [√(x + h) + √x]", "Multiply top and bottom by √(x + h) + √x. The top becomes (x + h) − x = h, which cancels the h below."],
      ["→ 1 ÷ (2√x) = ½x<sup>−1/2</sup>", "Let h → 0. That is n·xⁿ⁻¹ with n = 1/2."]
    ],
    end: "Both match the power rule. The proof for every real n uses eˣ and logarithms, which come later. One warning: 1 ÷ (2√x) has no value at x = 0. The graph of √x starts out vertical there, so it has no slope at the origin."
  },
  examples: [
    { q: "Differentiate f(x) = 6√x.",
      steps: [["f(x) = 6x<sup>1/2</sup>", "Rewrite the root as a power."], ["6 × 1/2 = 3", "Bring the power down."], ["1/2 − 1 = −1/2", "Lower the power by one."], ["f′(x) = 3x<sup>−1/2</sup> = 3 ÷ √x", "Put it together, then rewrite as a root."]],
      a: "f′(x) = 3 ÷ √x" },
    { q: "Differentiate f(x) = 4 ÷ x³.",
      steps: [["f(x) = 4x⁻³", "Move x³ to the top. Its power changes sign."], ["4 × (−3) = −12", "Bring the −3 down."], ["−3 − 1 = −4", "Lower the power. One lower than −3 is −4."], ["f′(x) = −12x⁻⁴ = −12 ÷ x⁴", "Put it together, then rewrite as a fraction."]],
      a: "f′(x) = −12 ÷ x⁴" },
    { q: "Find the slope of f(x) = 8 ÷ √x at x = 4.",
      steps: [["f(x) = 8x<sup>−1/2</sup>", "A root on the bottom is a negative fraction power."], ["8 × (−1/2) = −4", "Bring the power down."], ["−1/2 − 1 = −3/2", "Lower the power by one."], ["f′(x) = −4x<sup>−3/2</sup>", "Put it together."], ["4<sup>−3/2</sup> = 1 ÷ (√4)³ = 1/8", "Negative means one over. The /2 means square root, and the 3 means cube."], ["f′(4) = −4 × 1/8 = −0.5", "Substitute."]],
      a: "−0.5" }
  ],
  mistakes: [
    { wrong: "(x⁻²)′ = −2x⁻¹", why: "The power moved up, toward zero. Lowering by one from −2 gives −3.", fix: "(x⁻²)′ = −2x⁻³" },
    { wrong: "(x<sup>2/3</sup>)′ = (2/3)x<sup>1/3</sup>", why: "1 was taken off the top of the fraction. Subtract a whole 1: 2/3 − 3/3 = −1/3.", fix: "(x<sup>2/3</sup>)′ = (2/3)x<sup>−1/3</sup>" },
    { wrong: "1 ÷ √x = x<sup>1/2</sup>", why: "A power on the bottom of a fraction changes sign when it moves to the top.", fix: "1 ÷ √x = x<sup>−1/2</sup>, so its derivative is −(1/2)x<sup>−3/2</sup>." },
    { wrong: "(1 ÷ x³)′ = 1 ÷ (3x²)", why: "That differentiates the bottom and leaves it on the bottom. There is no such rule. Rewrite as x⁻³ first.", fix: "(x⁻³)′ = −3x⁻⁴ = −3 ÷ x⁴" }
  ],
  teach: {
    script: [
      "Write a ladder of powers: x³, x², x¹, x⁰, x⁻¹, x⁻². Ask what each step down does. It divides by x. So x⁻¹ = 1 ÷ x and x⁻² = 1 ÷ x².",
      "Remind him that √x = x<sup>1/2</sup>, because √x × √x = x and x<sup>1/2</sup> × x<sup>1/2</sup> = x¹.",
      "Say the recipe: rewrite, differentiate, rewrite back. Do 1 ÷ x together: x⁻¹ becomes −1 · x⁻², which is −1 ÷ x².",
      "Draw a number line for the exponent. Lowering by one is a step to the left: −2 goes to −3, and 1/2 goes to −1/2.",
      "Sketch √x and ask where it is steepest. At the start, where it rises straight up. The formula 1 ÷ (2√x) agrees: it blows up as x → 0."
    ],
    board: "A column of powers from x³ down to x⁻², with “÷ x” arrows between them. Beside it, a number line for exponents with a hop of −1 drawn from 1/2 to −1/2 and from −2 to −3.",
    ask: [
      { q: "Rewrite 5 ÷ x⁴ as a power, then differentiate.", listen: "“5x⁻⁴, so the derivative is −20x⁻⁵.” If he gets x⁻³, he stepped toward zero. Draw the number line and hop left." },
      { q: "What is the derivative of ∛x?", listen: "“Rewrite as x<sup>1/3</sup>. The derivative is (1/3)x<sup>−2/3</sup>.” If he writes x<sup>2/3</sup>, have him work out 1/3 − 1 slowly: 1/3 − 3/3 = −2/3." },
      { q: "Is √x steeper at x = 1 or at x = 100?", listen: "“At x = 1. The slope is 1 ÷ (2√x): 0.5 at x = 1 and 0.05 at x = 100.” If he says 100 because the curve is higher there, that is height, not steepness." }
    ],
    confusion: "Nearly every error is in the exponent arithmetic, not the calculus. Students step toward zero for negative powers (−2 becomes −1) or take 1 off the top of a fraction (2/3 becomes 1/3). Have him write the subtraction out in full every time: −2 − 1 = −3, and 2/3 − 3/3 = −1/3. The other slip is skipping the rewrite and inventing a rule for roots or fractions."
  },
  recap: [
    "Rewrite first: √x = x<sup>1/2</sup>, ∛x = x<sup>1/3</sup> and 1 ÷ xⁿ = x⁻ⁿ.",
    "Then use the usual power rule: (xⁿ)′ = n·xⁿ⁻¹ for any n.",
    "Subtracting 1 moves a power to the left on the number line: −2 → −3, and 1/2 → −1/2."
  ]
};
})();
