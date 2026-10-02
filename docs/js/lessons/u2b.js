/* Full lessons: product rule, chain rule, the two together, rational and radical functions. */
window.CP = window.CP || {};
(function () {
CP.LESSONS = CP.LESSONS || {};
const { fmt } = CP.W, PI = Math.PI, V = CP.V;
const near = (a, b, tol) => Math.abs(a - b) <= tol;

CP.LESSONS.prod = {
  big: "When two changing things multiply, picture a rectangle. Each growing side adds a strip, and the tiny corner fades away. So (uv)′ = u′v + uv′: one factor at a time, then add. It is never u′v′.",
  intro: [
    "Up to now you have differentiated sums one term at a time. But many functions are two things multiplied, like (3x − 2)(2x + 5), or price × number sold. You could expand the brackets first, but that gets slow, and soon you will meet products you can’t expand at all.",
    "The product rule handles any product directly. The clearest way to see it is a rectangle: one side is u, the other is v, and its area is u × v. When both sides grow, the area grows in two strips, one for each side."
  ],
  see: [
    {
      h: "A rectangle that grows on two sides",
      text: "The rectangle is u = x wide and v = x² tall, so its area is x · x² = x³. The Δx slider nudges x. The width grows by Δu (the purple strip on the right) and the height grows by Δv (the orange strip on top). Watch the dark corner where the two strips meet.",
      widget: { type: "area", u: x => x, v: x => x * x, du: () => 1, dv: x => 2 * x, x: [0.5, 2], x0: 2, dx0: 0.2, dxmax: 0.5, ulabel: "u", vlabel: "v" },
      tasks: [
        { ask: "Leave x at 2 and push Δx all the way up to 0.5. Read the four numbers under the picture.", check: s => near(s.x, 2, 0.006) && s.dx > 0.49,
          got: "Real growth 7.625, two strips 6.5, corner 1.125. With a big nudge the corner is about a seventh of the growth." },
        { ask: "Now drag Δx down to its smallest, 0.01.", check: s => near(s.x, 2, 0.006) && s.dx < 0.0105,
          got: "Real growth 0.1206, two strips 0.1202, corner 0.0004. The strips are almost all of it. The corner is about a third of a percent." },
        { ask: "Keep Δx at 0.01 and slide x to 1.", check: s => near(s.x, 1, 0.006) && s.dx < 0.0105,
          got: "Real growth 0.0303. Divide by Δx = 0.01 and the rate is about 3. The strips predict it: u′v + uv′ = 1 × 1 + 1 × 2 = 3. The power rule agrees: x³ has slope 3x² = 3." },
        { ask: "Still with Δx at 0.01, slide x to 1.5.", check: s => near(s.x, 1.5, 0.006) && s.dx < 0.0105,
          got: "Real growth 0.068, so the rate is about 6.8. Strips: u′v + uv′ = 1 × 2.25 + 1.5 × 3 = 6.75. Power rule: 3 × 1.5² = 6.75." }
      ],
      after: "Growth = v·Δu + u·Δv + corner. Divide by Δx and let it shrink. The right strip becomes u′v, the top strip becomes uv′, and the corner, which is about u′v′ × Δx², fades to nothing. So (uv)′ = u′v + uv′. The tempting answer u′v′ only ever described the corner."
    },
    {
      h: "Why u′v′ fails",
      text: "Here y = (x + 1)(x − 2), so u = x + 1 and v = x − 2. Both have slope 1, so the guess u′v′ says the slope is 1 × 1 = 1 everywhere. Drag along the curve and compare the slope with the two formulas in the readouts.",
      widget: { type: "tracer", f: x => (x + 1) * (x - 2), df: x => 2 * x - 1, x: [-2, 3], y: [-3, 5], dy: [-5.5, 7], x0: 2, ticks: 1,
        label: "y = (x + 1)(x − 2)", dlabel: "slope", ghost: () => 1, ghostLabel: "u′v′",
        readouts: [{ label: "u′v + uv′", value: s => fmt((s.x - 2) + (s.x + 1), 3) }, { label: "u′v′", value: () => "1" }] },
      tasks: [
        { ask: "Drag to the bottom of the U.", check: s => near(s.x, 0.5, 0.04),
          got: "Slope about 0 at x = 0.5. u′v + uv′ = (x − 2) + (x + 1) = −1.5 + 1.5 = 0. But u′v′ still says 1, as if the curve were climbing." },
        { ask: "Drag all the way to the left edge, x = −2.", check: s => s.x < -1.995,
          got: "Slope −5: the curve is falling steeply. u′v + uv′ = −4 + (−1) = −5. The guess u′v′ still says 1." },
        { ask: "Press Sweep, or drag all the way across, to trace every slope.", check: s => s.covered > 0.85,
          got: "The dots make a straight sloped line, from −5 on the left to 5 on the right." },
        { ask: "Press Show u′v′ to compare.", check: s => s.ghost && s.covered > 0.85,
          got: "A flat line at 1. It crosses the dots only once, at x = 1, and that is luck. u′v′ is not the slope." }
      ],
      after: "Expanding gives a check: (x + 1)(x − 2) = x² − x − 2, whose slope is 2x − 1. That is exactly u′v + uv′ = (x − 2) + (x + 1) = 2x − 1. The guess u′v′ = 1 is not even close."
    }
  ],
  why: {
    lead: "This is the rectangle from the picture, written with symbols. Nudge x by Δx. Then u changes by Δu and v changes by Δv, and the area uv changes too.",
    steps: [
      ["(u + Δu)(v + Δv) − uv", "The new area minus the old area: the growth."],
      ["= vΔu + uΔv + ΔuΔv", "Expand. The two uv terms cancel. What is left is two strips and the corner."],
      ["÷ Δx:  v · (Δu ÷ Δx) + u · (Δv ÷ Δx) + Δu · (Δv ÷ Δx)", "Divide every term by Δx to get a rate."],
      ["Δu ÷ Δx → u′,  Δv ÷ Δx → v′,  Δu → 0", "Let Δx shrink to 0. The rates become derivatives, and the change in u itself shrinks to nothing."],
      ["(uv)′ = vu′ + uv′ + 0 · v′ = u′v + uv′", "The corner term dies. The two strips survive."],
      ["(x · x)′ = 1 · x + x · 1 = 2x", "A check you already know: x · x = x², whose slope is 2x. The guess u′v′ would give 1 · 1 = 1."]
    ],
    end: "The order inside each term does not matter, since vu′ = u′v. What matters is that there are two terms, and each one differentiates exactly one factor."
  },
  examples: [
    { q: "Differentiate f(x) = (x + 3)(x + 2).",
      steps: [["u = x + 3, u′ = 1.  v = x + 2, v′ = 1", "Label both factors and their derivatives."],
              ["u′v = 1 · (x + 2) = x + 2", "The derivative of the first, times the second."],
              ["uv′ = (x + 3) · 1 = x + 3", "The first, times the derivative of the second."],
              ["f′(x) = 2x + 5", "Add the two halves."]],
      a: "f′(x) = 2x + 5" },
    { q: "Differentiate f(x) = (3x − 2)(2x + 5), and simplify.",
      steps: [["u = 3x − 2, u′ = 3.  v = 2x + 5, v′ = 2", "Label first."],
              ["u′v = 3(2x + 5) = 6x + 15", "The 3 multiplies both terms in the bracket."],
              ["uv′ = 2(3x − 2) = 6x − 4", "Same again with the 2."],
              ["f′(x) = 12x + 11", "Add: 6x + 6x = 12x and 15 − 4 = 11."],
              ["Check: f(x) = 6x² + 11x − 10, so f′(x) = 12x + 11", "Expanding first gives the same answer."]],
      a: "f′(x) = 12x + 11" },
    { q: "Differentiate f(x) = (2x² − 3)(x + 4) and simplify. Then find the slope at x = 1.",
      steps: [["u = 2x² − 3, u′ = 4x.  v = x + 4, v′ = 1", "Label first."],
              ["u′v = 4x(x + 4) = 4x² + 16x", "Multiply out."],
              ["uv′ = (2x² − 3) · 1 = 2x² − 3", "v′ is 1, so this half is just u."],
              ["f′(x) = 6x² + 16x − 3", "Add like terms: 4x² + 2x² = 6x²."],
              ["f′(1) = 6 + 16 − 3 = 19", "Substitute x = 1."]],
      a: "f′(x) = 6x² + 16x − 3, so the slope at x = 1 is 19" }
  ],
  mistakes: [
    { wrong: "((3x − 2)(2x + 5))′ = 3 × 2 = 6", why: "That multiplies the two derivatives. In the picture, u′v′ only describes the tiny corner, which fades away. Also, the slope of a curved graph must change with x, and 6 never changes.", fix: "u′v + uv′ = 3(2x + 5) + 2(3x − 2) = 12x + 11" },
    { wrong: "((3x − 2)(2x + 5))′ = 3(2x + 5) = 6x + 15", why: "Only the first half. Both sides of the rectangle grow, so both strips count.", fix: "Add uv′ = 2(3x − 2): f′(x) = 12x + 11" },
    { wrong: "3(2x + 5) = 6x + 5", why: "The 3 multiplied only the first term. A number in front of a bracket multiplies everything inside it.", fix: "3(2x + 5) = 6x + 15" },
    { wrong: "(x + 1) · (−2) = −2x + 2", why: "A sign slip with a negative derivative. The −2 multiplies the 1 as well, giving −2.", fix: "(x + 1)(−2) = −2x − 2" }
  ],
  teach: {
    script: [
      "Draw a rectangle. Call the width u and the height v. Its area is u × v.",
      "Ask: if both sides grow a little, where does the new area appear? Shade a strip on the right and a strip on top. Point out the small corner.",
      "The right strip is v × Δu and the top strip is u × Δv. The corner is Δu × Δv: a small number times a small number.",
      "Divide by Δx and let it shrink. The strips become u′v and uv′. The corner vanishes. So (uv)′ = u′v + uv′.",
      "Finish with x · x. The rule gives x + x = 2x, which he knows is right. The guess u′v′ gives 1, which is clearly wrong."
    ],
    board: "A rectangle with u along the bottom and v up the side. Add a thin strip on the right (Δu wide) and one on top (Δv tall). Shade the small corner square darker.",
    ask: [
      { q: "Why can’t (uv)′ be u′v′?", listen: "Something like “u′v′ is the corner, and the corner shrinks to nothing”, or the x · x check giving 1 instead of 2x. If he says “because the formula says so”, go back to the rectangle." },
      { q: "Find the derivative of (x + 4)(x − 1) two ways.", listen: "Product rule: (x − 1) + (x + 4) = 2x + 3. Expanding: x² + 3x − 4, slope 2x + 3. If the two don’t match, look for a bracket slip." },
      { q: "In u′v + uv′, which factor is being differentiated in each term?", listen: "Exactly one in each: u in the first, v in the second. If he says “both”, write u, u′, v and v′ in a column and point to each." }
    ],
    confusion: "The pull of u′v′ is strong. The sum rule works term by term, so students expect products to work the same way. Don’t just say “no”. Run the x · x check every time: it takes ten seconds, and the wrong rule gives 1. The other slip is losing track of brackets, so insist on writing u, u′, v and v′ on separate lines before putting them together."
  },
  recap: [
    "(uv)′ = u′v + uv′: differentiate one factor at a time, then add the two results.",
    "Picture a rectangle: each growing side adds a strip, and the tiny corner disappears.",
    "(uv)′ is never u′v′. Check with x · x = x²: the rule gives 2x, the guess gives 1."
  ]
};

CP.LESSONS.chain = {
  big: "A nudge in x passes through the inside first, then the outside. Each one stretches it, and stretches multiply. So the slope is the outside’s derivative (inside left alone) times the inside’s derivative.",
  intro: [
    "Some functions sit inside others. To work out (3x + 1)⁵ for a number, you first find 3x + 1, then raise the answer to the 5th power. So 3x + 1 is the inside, and “to the 5th” is the outside.",
    "You could expand (3x + 1)⁵, but that is ugly, and many functions can’t be expanded at all. The chain rule finds the slope directly. The idea: a small change in x gets stretched twice, once by each function, and the two stretches multiply."
  ],
  see: [
    {
      h: "Two stretches in a row",
      text: "Here the inside is u = x² + 1 and the outside is y = u³. The top line shows a small nudge Δx. The middle line shows how far u moves, and the bottom line how far y moves. Between the lines is each stretch factor: how many times longer the next nudge is.",
      widget: { type: "chain", inner: x => x * x + 1, outer: u => u * u * u, dinner: x => 2 * x, douter: u => 3 * u * u, x: [-1, 2], x0: 0.5, dx0: 0.1, dxmax: 0.5,
        xlabel: "x", ulabel: "u = x² + 1", ylabel: "y = u³" },
      tasks: [
        { ask: "Slide x to 1. Read the two stretch factors.", check: s => near(s.x, 1, 0.006),
          got: "The inside stretches the nudge by 2, its slope 2x at x = 1. Then the outside stretches it again by 12, its slope 3u² at u = 2." },
        { ask: "Keep x at 1 and push Δx up to 0.3 or more. Compare the two readouts.", check: s => near(s.x, 1, 0.006) && s.dx >= 0.3,
          got: "Δy ÷ Δx is far above 2 × 12 = 24. Over a wide nudge the stretch factors keep changing, so the two don’t agree." },
        { ask: "Now shrink Δx to its smallest, 0.001.", check: s => near(s.x, 1, 0.006) && s.dx < 0.0015,
          got: "Δy ÷ Δx = 24.036, almost exactly 2 × 12 = 24. For a tiny nudge the two stretches simply multiply." },
        { ask: "Keep Δx tiny (under 0.01) and slide x to 0.", check: s => near(s.x, 0, 0.006) && s.dx < 0.0105,
          got: "The inside’s stretch is 0, because x² + 1 is flat at x = 0. The outside still stretches by 3, but 0 × 3 = 0. Nothing gets through, so Δy ÷ Δx is close to 0." }
      ],
      after: "The slope is (outside′) × (inside′). At x = 1 that is 3u² × 2x = 12 × 2 = 24. In full: ((x² + 1)³)′ = 3(x² + 1)² · 2x = 6x(x² + 1)². Bring the power down with the inside left alone, then multiply by the inside’s slope."
    },
    {
      h: "The factor people forget",
      text: "This curve is y = (kx + 1)³, and the slider sets k, the slope of the inside. The dashed curve is 3(kx + 1)²: the answer you get if you forget to multiply by the inside’s derivative. The last readout divides the true slope by the dashed one.",
      widget: { type: "tracer", f: (x, k) => Math.pow(k * x + 1, 3), df: (x, k) => 3 * k * Math.pow(k * x + 1, 2), x: [-1, 0.5], x0: 0, ticks: 0.5,
        label: "y = (kx + 1)³", dlabel: "slope", ghost: (x, k) => 3 * Math.pow(k * x + 1, 2), ghostLabel: "3(kx + 1)²",
        param: { name: "k", label: "k, the inside’s slope", min: 1, max: 3, step: 0.1, val: 2, show: v => fmt(v, 1) },
        readouts: [{ label: "slope ÷ dashed", value: s => { const g = 3 * Math.pow(s.p * s.x + 1, 2); return g < 1e-9 ? "0 ÷ 0" : fmt(s.m / g, 3); } }] },
      tasks: [
        { ask: "Leave k at 2. Press Sweep to trace the true slope of (2x + 1)³.", check: s => near(s.p, 2, 0.05) && s.covered > 0.85,
          got: "The dots touch 0 at x = −0.5, where the inside 2x + 1 is 0, and climb steeply on either side." },
        { ask: "Press Show 3(kx + 1)².", check: s => near(s.p, 2, 0.05) && s.ghost,
          got: "The dots sit twice as far from 0 as the dashed curve. Slope ÷ dashed reads 2 everywhere. The missing factor is 2, the slope of the inside 2x + 1." },
        { ask: "Set k to 3, then sweep again.", check: s => near(s.p, 3, 0.05) && s.covered > 0.85,
          got: "Now slope ÷ dashed reads 3. The missing factor is always the inside’s slope, k." },
        { ask: "Set k to 1, sweep once more, and make sure the dashed curve is showing.", check: s => near(s.p, 1, 0.05) && s.covered > 0.85 && s.ghost,
          got: "The dots land right on the dashed curve. The inside x + 1 has slope 1, so forgetting it costs nothing. That is how the bad habit sneaks in." }
      ],
      after: "(kx + 1)³ has slope 3(kx + 1)² · k. The first part is the outside’s derivative with the inside left alone. The · k is the inside’s derivative. It only looks optional when k = 1."
    }
  ],
  why: {
    lead: "Write y = f(u) with u = g(x). Nudge x by Δx. Then u moves by Δu, and y moves by Δy. The slope is the limit of Δy ÷ Δx.",
    steps: [
      ["Δy ÷ Δx = (Δy ÷ Δu) × (Δu ÷ Δx)", "Multiply and divide by Δu. The Δu’s cancel, so this is true whenever Δu is not 0."],
      ["Δu ÷ Δx → g′(x)", "As Δx shrinks, the inside’s rate becomes its derivative."],
      ["Δu → 0, so Δy ÷ Δu → f′(u)", "The inside’s change shrinks too, so the outside’s rate becomes its derivative at u."],
      ["dy/dx = f′(u) · g′(x) = (dy/du) · (du/dx)", "The two limits multiply. In this notation the du’s look like they cancel, which is a good way to remember it."],
      ["((3x + 1)²)′ = 2(3x + 1) · 3 = 18x + 6", "Test it on something you can expand."],
      ["(9x² + 6x + 1)′ = 18x + 6", "Expand first and use the power rule: the same answer. Without the · 3 you would get 6x + 2, which is wrong."]
    ],
    end: "The first step breaks if Δu is exactly 0 for small nudges, for example when the inside is flat. A careful proof treats that case separately, and the rule still holds. For this course, the stretch picture is the argument to remember."
  },
  examples: [
    { q: "Differentiate f(x) = (2x + 5)³.",
      steps: [["Outside: 3(2x + 5)²", "Bring the 3 down and lower the power to 2. Leave 2x + 5 alone."],
              ["Inside: (2x + 5)′ = 2", "The slope of the inside."],
              ["f′(x) = 3(2x + 5)² · 2 = 6(2x + 5)²", "Multiply, and tidy the numbers in front."]],
      a: "f′(x) = 6(2x + 5)²" },
    { q: "Differentiate f(x) = (4x − 3)⁵. Then find the slope at x = 1.",
      steps: [["Outside: 5(4x − 3)⁴", "Power down, lower it by one, inside unchanged."],
              ["Inside: (4x − 3)′ = 4", "The slope of the inside."],
              ["f′(x) = 5 · 4 · (4x − 3)⁴ = 20(4x − 3)⁴", "Multiply the outside by the inside’s slope."],
              ["f′(1) = 20(4 − 3)⁴ = 20 · 1 = 20", "Substitute x = 1. The inside is 1, and 1⁴ = 1."]],
      a: "f′(x) = 20(4x − 3)⁴, so the slope at x = 1 is 20" },
    { q: "Differentiate f(x) = (3x² − 4)³. Where is the graph flat?",
      steps: [["Outside: 3(3x² − 4)²", "Power down, lower it to 2. The inside stays 3x² − 4."],
              ["Inside: (3x² − 4)′ = 6x", "This inside is not a straight line, so its slope depends on x."],
              ["f′(x) = 3(3x² − 4)² · 6x = 18x(3x² − 4)²", "Multiply: 3 × 6x = 18x."],
              ["18x = 0 gives x = 0", "The graph is flat where a factor is 0. First factor."],
              ["3x² − 4 = 0 gives x = ±√(4/3) ≈ ±1.15", "Second factor."]],
      a: "f′(x) = 18x(3x² − 4)², flat at x = 0 and x ≈ ±1.15" }
  ],
  mistakes: [
    { wrong: "((3x + 1)⁵)′ = 5(3x + 1)⁴", why: "The outside is right, but the inside’s derivative is missing. The inside stretches every nudge by 3, so the true slope is 3 times this.", fix: "5(3x + 1)⁴ · 3 = 15(3x + 1)⁴" },
    { wrong: "((x² + 1)³)′ = 3(2x)²", why: "The inside was differentiated in place. The outside’s derivative keeps the inside exactly as it was: it is still x² + 1 that gets squared.", fix: "3(x² + 1)² · 2x = 6x(x² + 1)²" },
    { wrong: "((3x + 1)⁵)′ = 15(3x + 1)⁵", why: "The power was not lowered. The outside u⁵ has derivative 5u⁴, so the power drops to 4.", fix: "15(3x + 1)⁴" },
    { wrong: "((2x + 5)³)′ = 3(2x + 5)² · (2x + 5)", why: "That multiplies by the inside itself, not by the inside’s derivative. The stretch factor is the inside’s slope, 2.", fix: "3(2x + 5)² · 2 = 6(2x + 5)²" }
  ],
  teach: {
    script: [
      "Write (3x + 1)⁵. Ask: if x = 1, what do you work out first? (3x + 1 = 4.) Then what? (4⁵.) That order names the inside and the outside.",
      "Say: a small change in x gets stretched by the inside, then stretched again by the outside.",
      "The inside 3x + 1 stretches every change by 3. The outside u⁵ stretches by 5u⁴, where u is whatever the inside gave.",
      "Stretches multiply: 5(3x + 1)⁴ × 3 = 15(3x + 1)⁴.",
      "Test it on (3x + 1)², which he can expand: 9x² + 6x + 1 has slope 18x + 6, and 2(3x + 1) · 3 gives the same."
    ],
    board: "Three number lines stacked: x, then u = 3x + 1, then y = u⁵. Draw a short bracket on the x line, one 3 times as long on the u line, and a much longer one on the y line. Write × 3 and × 5u⁴ between them.",
    ask: [
      { q: "What is the derivative of (x + 7)⁴, and why can’t you see the chain rule in the answer?", listen: "4(x + 7)³. The inside’s slope is 1, so multiplying by it changes nothing. If he says the chain rule doesn’t apply, ask what the inside’s derivative is." },
      { q: "In 5(3x + 1)⁴ · 3, which part comes from the outside and which from the inside?", listen: "5(3x + 1)⁴ is the outside’s derivative with the inside left alone, and · 3 is the inside’s derivative. If he can’t split it, cover the · 3 and ask what the derivative of u⁵ is." },
      { q: "Differentiate (x² − 3)⁴.", listen: "4(x² − 3)³ · 2x = 8x(x² − 3)³. If he writes 4(2x)³, he changed the inside. Say: the inside stays as it is inside the bracket." }
    ],
    confusion: "The classic slip is dropping the inside’s derivative. It hides because simple insides like x + 7 have slope 1, so the mistake costs nothing for weeks. Pick early examples with insides like 3x + 1 or x² + 1, where the factor is not 1. The second slip is changing what is inside the bracket. Say “outside first, inside stays” out loud each time."
  },
  recap: [
    "Differentiate the outside and leave the inside alone, then multiply by the inside’s derivative.",
    "(ax + b)ⁿ has derivative n(ax + b)ⁿ⁻¹ · a. The · a is the part people forget.",
    "Stretches multiply: dy/dx = (dy/du) · (du/dx)."
  ]
};

CP.LESSONS.combo = {
  big: "When one factor of a product has an inside, you need both rules. Label u and v, find u′, use the chain rule for v′, then assemble u′v + uv′. Factor the answer to see where the slope is zero.",
  intro: [
    "Real functions often mix the rules. In x²(3x + 1)⁴ two things are multiplied, so you need the product rule. But the second factor has an inside, so its own derivative needs the chain rule.",
    "Nothing here is new. The skill is keeping track. Write u, u′, v and v′ on four separate lines, then put them together. The answer comes out long, so learn to factor it: the factored form tells you where the graph is flat."
  ],
  see: [
    {
      h: "Two halves that can cancel",
      text: "Here y = x(x − 2)³, so u = x and v = (x − 2)³. By the chain rule, v′ = 3(x − 2)² · 1. Drag along the curve and watch the two halves of the product rule, u′v and uv′, in the readouts. The slope is their sum.",
      widget: { type: "tracer", f: x => x * Math.pow(x - 2, 3), df: x => Math.pow(x - 2, 2) * (4 * x - 2), x: [0, 3], y: [-2.2, 3.5], dy: [-8.5, 13], x0: 1.2, ticks: 0.5,
        label: "y = x(x − 2)³", dlabel: "slope", ghost: x => Math.pow(x - 2, 2) * (4 * x - 2), ghostLabel: "(x − 2)²(4x − 2)",
        readouts: [{ label: "u′v", value: s => fmt(Math.pow(s.x - 2, 3), 3) }, { label: "uv′", value: s => fmt(3 * s.x * Math.pow(s.x - 2, 2), 3) }] },
      tasks: [
        { ask: "Find the bottom of the dip.", check: s => near(s.x, 0.5, 0.025),
          got: "Slope about 0 at x = 0.5. Here u′v ≈ −3.375 and uv′ ≈ 3.375: the two halves cancel." },
        { ask: "There is a second flat spot. Find it.", check: s => near(s.x, 2, 0.025),
          got: "At x = 2 both halves are 0, because each one contains (x − 2). The curve flattens for a moment, then keeps climbing. Flat does not always mean a turn." },
        { ask: "Press Sweep, or drag all the way across, to trace every slope.", check: s => s.covered > 0.85,
          got: "The dots start at −8, cross 0 at x = 0.5, rise to 2 at x = 1, touch 0 again at x = 2, then climb to 10." },
        { ask: "Press Show (x − 2)²(4x − 2) to compare.", check: s => s.ghost && s.covered > 0.85,
          got: "A perfect match. That is u′v + uv′ after factoring, and it shows both flat points at once: x = 2 and x = 0.5." }
      ],
      after: "u′v + uv′ = (x − 2)³ + 3x(x − 2)². Both terms contain (x − 2)², so take it out: (x − 2)²[(x − 2) + 3x] = (x − 2)²(4x − 2). Each factor gives a flat point. You could not read them off the long form."
    },
    {
      h: "Forget the chain factor, miss the peak",
      text: "Now y = x(2x − 3)². Here v′ = 2(2x − 3) · 2, and the last 2 is the inside’s slope. The dashed curve is the slope you get if you drop it. Look where each one says the slope is zero.",
      widget: { type: "tracer", f: x => x * Math.pow(2 * x - 3, 2), df: x => (2 * x - 3) * (6 * x - 3), x: [0, 2], y: [-0.4, 2.6], dy: [-4, 12.5], x0: 1.1, ticks: 0.5,
        label: "y = x(2x − 3)²", dlabel: "slope", ghost: x => (2 * x - 3) * (4 * x - 3), ghostLabel: "the wrong slope" },
      tasks: [
        { ask: "Find the top of the hump.", check: s => near(s.x, 0.5, 0.015),
          got: "Slope about 0 at x = 0.5, at height 2. That is the real peak." },
        { ask: "Press Show the wrong slope.", check: s => s.ghost,
          got: "The dashed curve crosses 0 at x = 0.75, not 0.5. It claims the peak is somewhere else." },
        { ask: "Drag to x = 0.75, where the wrong slope says the top is.", check: s => near(s.x, 0.75, 0.015),
          got: "The real slope here is about −2.25. The curve is already falling. Drop the chain factor and you put the peak in the wrong place." },
        { ask: "Now find the bottom of the valley.", check: s => near(s.x, 1.5, 0.015),
          got: "Slope 0 at x = 1.5, and the dashed curve is 0 here too, because both contain (2x − 3). One lucky match doesn’t make the wrong formula right." }
      ],
      after: "The right derivative is (2x − 3)² + x · 2(2x − 3) · 2 = (2x − 3)(6x − 3), which is zero at x = 0.5 and x = 1.5. Without the · 2 you get (2x − 3)(4x − 3), which is zero at 0.75. The chain factor decides where the peak is."
    }
  ],
  why: {
    lead: "There is no new rule to prove. The work is in combining the two you have, then factoring so the answer is useful. Here it is for y = x²(3x + 1)⁴.",
    steps: [
      ["u = x²,  u′ = 2x", "The first factor. Power rule."],
      ["v = (3x + 1)⁴,  v′ = 4(3x + 1)³ · 3 = 12(3x + 1)³", "The second factor has an inside, so use the chain rule. The · 3 is the inside’s slope."],
      ["y′ = 2x(3x + 1)⁴ + 12x²(3x + 1)³", "u′v + uv′."],
      ["= 2x(3x + 1)³[(3x + 1) + 6x]", "Both terms contain 2x and (3x + 1)³. Take them out. The first term leaves (3x + 1) and the second leaves 6x."],
      ["= 2x(3x + 1)³(9x + 1)", "Collect the bracket."],
      ["y′ = 0 at x = 0, x = −1/3 and x = −1/9", "Each factor gives one zero."]
    ],
    end: "Factoring works because both terms share the bracket. Take out the smaller power: (3x + 1)³ goes into both (3x + 1)⁴ and (3x + 1)³. The same move finds flat points in curve sketching and optimization later."
  },
  examples: [
    { q: "Differentiate f(x) = x(x + 3)².",
      steps: [["u = x, u′ = 1", "Label the first factor."],
              ["v = (x + 3)², v′ = 2(x + 3) · 1 = 2(x + 3)", "Chain rule. The inside x + 3 has slope 1."],
              ["f′(x) = 1 · (x + 3)² + x · 2(x + 3)", "u′v + uv′."],
              ["= (x + 3)[(x + 3) + 2x] = (x + 3)(3x + 3)", "Take out the common (x + 3)."],
              ["= 3(x + 3)(x + 1)", "Take the 3 out of 3x + 3."]],
      a: "f′(x) = (x + 3)² + 2x(x + 3) = 3(x + 3)(x + 1)" },
    { q: "Differentiate f(x) = x²(2x + 1)³, and factor the answer.",
      steps: [["u = x², u′ = 2x", "Power rule."],
              ["v = (2x + 1)³, v′ = 3(2x + 1)² · 2 = 6(2x + 1)²", "Chain rule. The inside 2x + 1 has slope 2."],
              ["f′(x) = 2x(2x + 1)³ + 6x²(2x + 1)²", "u′v + uv′."],
              ["= 2x(2x + 1)²[(2x + 1) + 3x]", "Take out 2x and the smaller power, (2x + 1)². 6x² ÷ 2x = 3x."],
              ["= 2x(2x + 1)²(5x + 1)", "Collect the bracket."]],
      a: "f′(x) = 2x(2x + 1)³ + 6x²(2x + 1)² = 2x(2x + 1)²(5x + 1)" },
    { q: "Where does f(x) = x²(3x − 4)³ have slope zero?",
      steps: [["u = x², u′ = 2x", "Label."],
              ["v = (3x − 4)³, v′ = 3(3x − 4)² · 3 = 9(3x − 4)²", "Chain rule. The inside 3x − 4 has slope 3."],
              ["f′(x) = 2x(3x − 4)³ + 9x²(3x − 4)²", "u′v + uv′."],
              ["= x(3x − 4)²[2(3x − 4) + 9x]", "Take out x and the smaller power, (3x − 4)²."],
              ["= x(3x − 4)²(15x − 8)", "6x − 8 + 9x = 15x − 8."],
              ["x = 0, x = 4/3, x = 8/15", "Set each factor to zero."]],
      a: "Slope zero at x = 0, x = 8/15 and x = 4/3" }
  ],
  mistakes: [
    { wrong: "v = (2x + 1)³, so v′ = 3(2x + 1)²", why: "The chain rule’s factor is missing. The inside 2x + 1 has slope 2. The second picture shows what this costs: the peak lands in the wrong place.", fix: "v′ = 3(2x + 1)² · 2 = 6(2x + 1)²" },
    { wrong: "(x²(2x + 1)³)′ = 2x · 6(2x + 1)²", why: "That multiplies the two derivatives, u′v′. The product rule adds two terms, each differentiating one factor.", fix: "u′v + uv′ = 2x(2x + 1)³ + 6x²(2x + 1)²" },
    { wrong: "(x²(2x + 1)³)′ = 2x(2x + 1)³", why: "Only u′v. The second half, uv′, is missing.", fix: "Add uv′ = x² · 6(2x + 1)²." },
    { wrong: "2x(2x + 1)³ + 6x²(2x + 1)² = (2x + 1)³(…)", why: "The second term only has (2x + 1)². You can only take out what both terms share, so take out the smaller power.", fix: "Take out 2x(2x + 1)²: f′(x) = 2x(2x + 1)²(5x + 1)" }
  ],
  teach: {
    script: [
      "Write y = x²(3x + 1)⁴. Ask: if you put in a number, what is the last thing you do? (Multiply.) So the main rule is the product rule.",
      "Make four lines: u, u′, v, v′. Fill in u and v first, then u′.",
      "For v′, say the chain rule out loud: outside first with the inside left alone, then times the inside’s slope, 3.",
      "Assemble u′v + uv′. Only now combine anything.",
      "Factor: take out every common piece, using the smaller power of the bracket. Then each factor shows a flat point."
    ],
    board: "A four-line grid: u = …, u′ = …, v = …, v′ = …, with an arrow down to u′v + uv′. Circle the chain rule factor in v′ in a different colour.",
    ask: [
      { q: "For y = x(5x − 2)³, what is v′?", listen: "3(5x − 2)² · 5 = 15(5x − 2)². If he says 3(5x − 2)², ask what the inside’s slope is." },
      { q: "When you factor (5x − 2)³ + 15x(5x − 2)², why take out (5x − 2)² and not (5x − 2)³?", listen: "Because the second term only has the square. You can only take out what both terms share. If he is unsure, write both terms and underline the common pieces." },
      { q: "A factored answer is x(3x − 4)²(15x − 8). Where is the graph flat?", listen: "x = 0, x = 4/3 and x = 8/15: set each factor to zero. If he starts expanding, stop him. The factored form is the point." }
    ],
    confusion: "Two things go wrong. First, the chain factor in v′ gets dropped, because it is buried inside a bigger calculation. The four-line grid fixes this: v′ gets its own line. Second, factoring stalls. Show him that both terms share the bracket, and take out the smaller power. If the algebra gets messy, check one value of x in both forms with a calculator."
  },
  recap: [
    "Label u, u′, v and v′ on four lines, then write u′v + uv′.",
    "When v has an inside, v′ needs the chain rule’s extra factor.",
    "Factor out the smaller power of the bracket. Each factor then shows a flat point."
  ]
};

CP.LESSONS.ratrad = {
  big: "A fraction is a negative power and a root is a fraction power. Rewrite a ÷ (x + b) as a(x + b)⁻¹ and √(x² + 5) as (x² + 5)<sup>1/2</sup>. Then the chain and product rules do the rest.",
  intro: [
    "Rational functions have x on the bottom of a fraction, like 4 ÷ (x + 1). Radical functions have x under a root, like √(x² + 5). They look as if they need new rules. They don’t.",
    "You already know that 1 ÷ x³ = x⁻³ and √x = x<sup>1/2</sup>. Do the same with a whole bracket. Once a fraction or a root is written as a power, it is a chain rule question, plus the product rule when there is something on top."
  ],
  see: [
    {
      h: "Dividing is a power of −1",
      text: "This is y = a ÷ (x + 1), which is the same as a(x + 1)⁻¹. Drag along the curve. The last readout multiplies the slope by (x + 1)². Watch what it does.",
      widget: { type: "tracer", f: (x, a) => a / (x + 1), df: (x, a) => -a / Math.pow(x + 1, 2), x: [0, 3], y: [0, 6.6], dy: [-6.6, 1.3], x0: 2, ticks: 1,
        label: "y = a ÷ (x + 1)", dlabel: "slope", ghost: (x, a) => -a / Math.pow(x + 1, 2), ghostLabel: "−a ÷ (x + 1)²",
        param: { name: "a", label: "a, the top number", min: 1, max: 6, step: 1, val: 4, show: v => fmt(v, 0) },
        readouts: [{ label: "slope × (x + 1)²", value: s => fmt(s.m * Math.pow(s.x + 1, 2), 3) }] },
      tasks: [
        { ask: "Leave a at 4. Drag all the way to the left edge, x = 0.", check: s => s.x < 0.005 && near(s.p, 4, 0.01),
          got: "Slope −4: the curve falls fastest here. And slope × (x + 1)² = −4 × 1 = −4." },
        { ask: "Now drag all the way to the right edge, x = 3.", check: s => s.x > 2.995 && near(s.p, 4, 0.01),
          got: "Slope −0.25, much gentler. But slope × (x + 1)² is −4 again: −0.25 × 16 = −4. So the slope is always −4 ÷ (x + 1)²." },
        { ask: "Change the top number a to 6.", check: s => near(s.p, 6, 0.01),
          got: "The readout becomes −6. The top number comes out in front, and it brings a minus sign with it." },
        { ask: "Sweep, then press Show −a ÷ (x + 1)².", check: s => s.ghost && s.covered > 0.85,
          got: "The dots sit right on the dashed curve. (a ÷ (x + 1))′ = −a ÷ (x + 1)²." }
      ],
      after: "Here is why. a ÷ (x + 1) = a(x + 1)⁻¹. The power rule brings the −1 down and lowers the power to −2, giving −a(x + 1)⁻². The inside x + 1 has slope 1. As a fraction that is −a ÷ (x + 1)². The minus and the square come together because both come from the power −1."
    },
    {
      h: "A root with an inside",
      text: "This is y = √(x² + 5) = (x² + 5)<sup>1/2</sup>. The dashed curve is 1 ÷ (2√(x² + 5)): the power rule alone, without the chain rule’s factor. The last readout divides the true slope by it.",
      widget: { type: "tracer", f: x => Math.sqrt(x * x + 5), df: x => x / Math.sqrt(x * x + 5), x: [-3, 3], y: [2, 4], dy: [-1, 1.4], x0: 1, ticks: 1,
        label: "y = √(x² + 5)", dlabel: "slope", ghost: x => 1 / (2 * Math.sqrt(x * x + 5)), ghostLabel: "1 ÷ (2√(x² + 5))",
        readouts: [{ label: "slope ÷ dashed", value: s => fmt(s.m * 2 * Math.sqrt(s.x * s.x + 5), 3) }] },
      tasks: [
        { ask: "Drag to the bottom of the curve.", check: s => near(s.x, 0, 0.04),
          got: "Slope 0 at x = 0. The curve is a symmetric bowl, so its bottom is flat." },
        { ask: "Stay at the bottom and press Show 1 ÷ (2√(x² + 5)).", check: s => s.ghost && near(s.x, 0, 0.04),
          got: "The dashed curve says the slope here is 0.224, as if the curve were climbing at its lowest point. That can’t be right." },
        { ask: "Drag to x = 2.", check: s => near(s.x, 2, 0.025),
          got: "True slope about 0.667, which is 2 ÷ 3. The dashed curve says 0.167. The readout shows the gap: about 4, which is 2x, the slope of the inside x² + 5." },
        { ask: "Now drag to x = −2.", check: s => near(s.x, -2, 0.025),
          got: "True slope about −0.667, and the readout is about −4, which is 2x again. The dashed curve stays positive everywhere, so on the left it even has the wrong sign." }
      ],
      after: "The full derivative: (x² + 5)<sup>1/2</sup> becomes ½(x² + 5)<sup>−1/2</sup> · 2x = x ÷ √(x² + 5). The ½ and the 2 cancel, which happens often. Without the · 2x the slope has the wrong size and, for negative x, the wrong sign."
    },
    {
      h: "A fraction as a product",
      text: "This is y = (x² + 3) ÷ (x − 1). Write it as (x² + 3)(x − 1)⁻¹, a product. So u = x² + 3 and v = (x − 1)⁻¹, with v′ = −(x − 1)⁻². The readouts show the two halves of the product rule.",
      widget: { type: "tracer", f: x => (x * x + 3) / (x - 1), df: x => (x - 3) * (x + 1) / Math.pow(x - 1, 2), x: [2, 6], y: [5.5, 8.2], dy: [-3.3, 2.2], x0: 5, ticks: 1,
        label: "y = (x² + 3) ÷ (x − 1)", dlabel: "slope", ghost: x => (x - 3) * (x + 1) / Math.pow(x - 1, 2), ghostLabel: "(x − 3)(x + 1) ÷ (x − 1)²",
        readouts: [{ label: "u′v", value: s => fmt(2 * s.x / (s.x - 1), 3) }, { label: "uv′", value: s => fmt(-(s.x * s.x + 3) / Math.pow(s.x - 1, 2), 3) }] },
      tasks: [
        { ask: "Drag all the way to the left edge, x = 2.", check: s => s.x < 2.005,
          got: "u′v = 4 and uv′ = −7, so the slope is 4 − 7 = −3. The bottom’s half is winning, so the curve falls." },
        { ask: "Find the lowest point.", check: s => near(s.x, 3, 0.03),
          got: "At x = 3 the slope is 0 and the height is 6. The two halves cancel: u′v = 3 and uv′ = −3." },
        { ask: "Sweep, then press Show (x − 3)(x + 1) ÷ (x − 1)².", check: s => s.ghost && s.covered > 0.85,
          got: "A perfect match. Put both halves over the common bottom (x − 1)² and the top becomes x² − 2x − 3 = (x − 3)(x + 1). The factor (x − 3) is the low point you found." }
      ],
      after: "Any fraction u ÷ v works this way. (u · v⁻¹)′ = u′v⁻¹ − uv′v⁻², and over a common bottom that is (u′v − uv′) ÷ v². Some books call this the quotient rule. You don’t need to memorize it: rewrite as a product and it falls out."
    }
  ],
  why: {
    lead: "There is nothing new to prove. Every step is a rule you already have, applied to a rewritten function. Three rewrites do it all.",
    steps: [
      ["a ÷ (x + b) = a(x + b)⁻¹", "Dividing by something is multiplying by it to the power −1."],
      ["(a(x + b)⁻¹)′ = a · (−1)(x + b)⁻² · 1", "Chain rule: power down, lower it from −1 to −2, then times the inside’s slope, 1."],
      ["= −a ÷ (x + b)²", "The −1 gives the minus sign. The −2 gives the square on the bottom."],
      ["√g = g<sup>1/2</sup>, so (√g)′ = ½g<sup>−1/2</sup> · g′ = g′ ÷ (2√g)", "A root is the power ½. Lowering ½ by 1 gives −½, which puts the root on the bottom. The g′ is the chain rule."],
      ["u ÷ v = u · v⁻¹", "A general fraction is a product."],
      ["(u · v⁻¹)′ = u′v⁻¹ + u · (−v⁻² · v′)", "Product rule, with the chain rule for v⁻¹."],
      ["= (u′v − uv′) ÷ v²", "Multiply the top and bottom of the first term by v to put both over v². This is the quotient rule."]
    ],
    end: "Many textbooks teach the quotient rule, and it is worth recognizing. But you never need to memorize it: rewrite, and use the rules you trust. Watch the domain too. These functions don’t exist where the bottom is 0, or where the number under a square root is negative."
  },
  examples: [
    { q: "Differentiate f(x) = 5 ÷ (x + 2).",
      steps: [["f(x) = 5(x + 2)⁻¹", "Rewrite as a power. Keep the bracket whole."],
              ["f′(x) = 5 · (−1)(x + 2)⁻² · 1", "Power down, lower −1 to −2, times the inside’s slope, 1."],
              ["f′(x) = −5 ÷ (x + 2)²", "Write it back as a fraction."]],
      a: "f′(x) = −5 ÷ (x + 2)²" },
    { q: "Differentiate f(x) = √(3x² + 4). Then find the slope at x = 2.",
      steps: [["f(x) = (3x² + 4)<sup>1/2</sup>", "Rewrite the root as a power."],
              ["Outside: ½(3x² + 4)<sup>−1/2</sup>", "Power down, lower ½ to −½. The inside stays."],
              ["Inside: (3x² + 4)′ = 6x", "The chain rule still applies inside the root."],
              ["f′(x) = ½ · 6x · (3x² + 4)<sup>−1/2</sup> = 3x ÷ √(3x² + 4)", "Multiply: ½ × 6x = 3x. The power −½ puts the root on the bottom."],
              ["f′(2) = 6 ÷ √16 = 6 ÷ 4 = 1.5", "3 × 2 = 6 on top, and 3 × 4 + 4 = 16 under the root."]],
      a: "f′(x) = 3x ÷ √(3x² + 4), so the slope at x = 2 is 1.5" },
    { q: "f(x) = (x² + 5) ÷ (x − 2). Find f′(4).",
      steps: [["f(x) = (x² + 5)(x − 2)⁻¹", "Rewrite as a product."],
              ["u = x² + 5, u′ = 2x.  v = (x − 2)⁻¹, v′ = −(x − 2)⁻²", "Label. v′ uses the chain rule, and the inside’s slope is 1."],
              ["f′(x) = 2x(x − 2)⁻¹ − (x² + 5)(x − 2)⁻²", "u′v + uv′."],
              ["f′(4) = 8 ÷ 2 − 21 ÷ 4", "At x = 4: x − 2 = 2, so (x − 2)² = 4, and x² + 5 = 21."],
              ["= 4 − 5.25 = −1.25", "So the curve is falling at x = 4."]],
      a: "f′(4) = −5/4 = −1.25" }
  ],
  mistakes: [
    { wrong: "(5 ÷ (x + 2))′ = 5 ÷ (x + 2)²", why: "The minus sign is missing. The power −1 comes down in front. The first picture agrees: the curve always falls, so its slope must be negative.", fix: "(5 ÷ (x + 2))′ = −5 ÷ (x + 2)²" },
    { wrong: "(√(3x² + 4))′ = 1 ÷ (2√(3x² + 4))", why: "That is only the outside. The chain rule still applies inside the root, so multiply by the inside’s derivative, 6x.", fix: "6x ÷ (2√(3x² + 4)) = 3x ÷ √(3x² + 4)" },
    { wrong: "((x² + 5) ÷ (x − 2))′ = 2x ÷ 1 = 2x", why: "The top and bottom were differentiated separately. A fraction is a product with a power of −1, and a product needs the product rule.", fix: "Write (x² + 5)(x − 2)⁻¹ and use u′v + uv′." },
    { wrong: "1 ÷ (x + 2) = x⁻¹ + 2⁻¹", why: "A power can’t be split across a sum. Try x = 2: 1 ÷ (2 + 2) = 0.25, but 1 ÷ 2 + 1 ÷ 2 = 1.", fix: "1 ÷ (x + 2) = (x + 2)⁻¹, with the bracket kept whole." }
  ],
  teach: {
    script: [
      "Warm up with what he knows: 1 ÷ x³ = x⁻³ and √x = x<sup>1/2</sup>. Then ask: what is 1 ÷ (x + 2) as a power? Keep the bracket whole: (x + 2)⁻¹.",
      "Differentiate (x + 2)⁻¹ with the chain rule: −1(x + 2)⁻² · 1. Write it back as −1 ÷ (x + 2)².",
      "Point out the pattern: the minus and the square always come together, because both come from the power −1.",
      "For roots, rewrite √(x² + 5) as (x² + 5)<sup>1/2</sup>. Do the outside, then ask: what is inside, and what is its slope? Multiply by 2x.",
      "For a fraction with x on top and bottom, rewrite it as top × (bottom)⁻¹. Now it is a product rule question he already knows."
    ],
    board: "Two columns. Left: functions as written: 5 ÷ (x + 2), √(3x² + 4), (x² + 5) ÷ (x − 2). Right: the same as powers: 5(x + 2)⁻¹, (3x² + 4)<sup>1/2</sup>, (x² + 5)(x − 2)⁻¹. Label the arrow between them “rewrite first”.",
    ask: [
      { q: "Rewrite 7 ÷ (x − 3)² as a power, then differentiate.", listen: "7(x − 3)⁻², so −14(x − 3)⁻³ = −14 ÷ (x − 3)³. If he lowers −2 to −1, remind him: one less than −2 is −3." },
      { q: "Why is the slope of 4 ÷ (x + 1) negative for every x greater than −1?", listen: "The derivative is −4 ÷ (x + 1)², and a square is positive, so the minus wins. Or from the graph: the curve always falls. Either answer is fine." },
      { q: "What is the slope of √(x² + 9) at x = 4?", listen: "x ÷ √(x² + 9) = 4 ÷ 5 = 0.8. If he gets 0.1, that is 1 ÷ (2 × 5): the chain factor 2x is missing." }
    ],
    confusion: "Most errors happen in the rewrite, not the calculus. Watch for splitting 1 ÷ (x + 2) into x⁻¹ + 2⁻¹, and for losing the minus sign when the −1 comes down. In roots, the slip is forgetting the inside, just as in the chain rule step. If a problem feels new, ask him: “What power is this, and what is inside?”"
  },
  recap: [
    "Rewrite first: a ÷ (x + b) = a(x + b)⁻¹ and √(stuff) = (stuff)<sup>1/2</sup>. Keep brackets whole.",
    "(a ÷ (x + b))′ = −a ÷ (x + b)². The minus and the square always come together.",
    "Inside a root the chain rule still applies: multiply by the inside’s derivative."
  ]
};
})();
