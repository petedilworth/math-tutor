/* Full lessons: reading f′ from graphs, maximums and minimums, concavity, sketching. */
window.CP = window.CP || {};
(function () {
CP.LESSONS = CP.LESSONS || {};
const { fmt } = CP.W, PI = Math.PI, V = CP.V;
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const bend = (k, t) => Math.abs(k) < t ? "neither: f″ ≈ 0" : k > 0 ? "∪ concave up" : "∩ concave down";

/* ======================= reading f′ from a graph ======================= */
CP.LESSONS.graphs = {
  big: "The graph of f′ is a record of how steep f is. Where f rises, f′ sits above the axis. Where f falls, f′ sits below. Where f turns, f′ is exactly 0.",
  intro: [
    "Up to now you found f′ from a formula. This step works from a picture. You look at the graph of f and draw the graph of its slope, or you look at f′ and say what f must be doing.",
    "The whole skill is one question, asked at every x: is f going up, flat or down here, and how steeply? Up means f′ is positive. Flat means f′ is 0. Down means f′ is negative. Nothing about the height of f matters, only its direction."
  ],
  see: [
    {
      h: "Say the slope out loud",
      text: "This is a cubic with one hill and one valley. Drag the dot along it. The purple tangent shows the slope, and each slope you visit drops a dot in the lower panel. Above the axis there means a positive slope.",
      widget: { type: "tracer", f: x => x * x * x / 3 - x * x - 3 * x + 4, df: x => x * x - 2 * x - 3, x: [-3, 5], y: [-6.5, 7.5], dy: [-6, 13], x0: 1, ticks: 1,
        label: "f(x) = x³/3 − x² − 3x + 4", dlabel: "slope of f", mlabel: "slope f′(x)", ghost: x => x * x - 2 * x - 3, ghostLabel: "f′(x)" },
      tasks: [
        { ask: "Drag to the left part, left of x = −1, where f climbs. Where does the slope dot sit?", check: s => s.x < -1.25, got: "Above the axis. f is rising, so every slope here is positive: f′ > 0." },
        { ask: "Find the top of the hill, where the tangent goes flat.", check: s => near(s.x, -1, 0.1), got: "x = −1, slope 0. The dot sits right on the axis. The top of f is a zero of f′, not a peak of f′." },
        { ask: "Now find where f falls most steeply.", check: s => near(s.x, 1, 0.1), got: "x = 1, slope −4. This is the lowest point of the slope graph. It sits halfway between the two turns." },
        { ask: "Find the bottom of the valley.", check: s => near(s.x, 3, 0.1), got: "x = 3, slope 0 again. f′ crosses the axis a second time, going from below to above." },
        { ask: "Press Sweep, then Show f′(x), to see every slope at once.", check: s => s.ghost && s.covered > 0.85, got: "The parabola f′(x) = x² − 2x − 3 = (x + 1)(x − 3) lands on every dot. Its zeros, −1 and 3, are the turns of f." }
      ],
      after: "Read f from left to right and say it: up, flat, down, flat, up. Then f′ is: above, zero, below, zero, above. A cubic with two turns always gives a parabola for f′, with its zeros at the turns."
    },
    {
      h: "Peaks of f are not peaks of f′",
      text: "This curve has three turns. The dashed curve in the lower panel is f′, already drawn. Compare the two panels as you drag. The slider C moves f up or down.",
      widget: { type: "tracer", f: (x, C) => x * x * x * x / 4 - 2 * x * x + C, df: x => x * x * x - 4 * x, x: [-3, 3], y: [-6.5, 5], dy: [-6, 6], x0: -2.6, ticks: 1,
        label: "f(x) = x⁴/4 − 2x² + C", dlabel: "slope of f", mlabel: "slope f′(x)", ghost: x => x * x * x - 4 * x, ghostLabel: "f′(x) = x³ − 4x", ghostOn: true,
        param: { name: "C", label: "shift C", min: -2, max: 2, step: 0.1, val: 0, show: v => fmt(v, 1) } },
      tasks: [
        { ask: "Drag to the hump in the middle, the local max of f. What is f′ there?", check: s => near(s.x, 0, 0.08), got: "f′(0) = 0. The top of f lines up with a zero of f′, not with a peak of f′." },
        { ask: "Between x = −2 and x = 0, find where f′ is highest. Watch the lower panel.", check: s => near(s.x, -1.1547, 0.08), got: "x ≈ −1.15, slope ≈ 3.08. Look up at f: this is where it climbs most steeply, partway up the side. f is not at a peak here." },
        { ask: "Drag to the valley on the right.", check: s => near(s.x, 2, 0.08), got: "x = 2, slope 0. Three turns on f give three zeros on f′: −2, 0 and 2. So f′ is a cubic." },
        { ask: "Now move the slider C to shift f up or down by at least 1.", check: s => Math.abs(s.p) >= 1, got: "f moved, but the dashed f′ did not change at all. Shifting f up or down changes no slope." }
      ],
      after: "f′ tells you where f turns and how steep it is. A peak of f′ is the steepest climb of f, not the top of f. And f′ never knows the height of f: every curve x⁴/4 − 2x² + C has the same f′."
    }
  ],
  why: {
    lead: "The derivative at a point is the slope of the tangent there: f′(a) = lim<sub>h→0</sub> [f(a + h) − f(a)] ÷ h. Every claim in this step comes from asking what sign that fraction has.",
    steps: [
      ["f′(a) = lim<sub>h→0</sub> [f(a + h) − f(a)] ÷ h", "Start from the definition. The top is the rise and h is the run."],
      ["f rising at a: h > 0 gives rise > 0, and h < 0 gives rise < 0", "Step right and you go up. Step left and you go down."],
      ["rise ÷ run > 0 either way, so f′(a) > 0", "Both signs match, so the fraction is positive. (In rare cases like x³ at 0 the limit can be 0, but on any stretch where f rises, f′ is not negative.)"],
      ["f falling at a: rise ÷ run < 0, so f′(a) < 0", "Now the signs are opposite, so the fraction is negative."],
      ["At a smooth turn, f′ goes from + to − (or − to +)", "A polynomial’s slope changes without jumps, so it must pass through 0 on the way."],
      ["(f + C)′ = f′ + 0 = f′", "A constant has slope 0. Moving the graph up or down never changes f′."]
    ],
    end: "So the sign of f′ is the direction of f, and the size of f′ is its steepness. That is why the steepest point of f lines up with a peak or trough of f′, and the turns of f line up with zeros of f′."
  },
  examples: [
    { q: "The graph of f is a parabola that falls until x = 2, then rises. Describe the graph of f′.",
      steps: [["x < 2: f falls, so f′ < 0", "On the left, f′ is below the axis."], ["x = 2: f is flat, so f′(2) = 0", "The turn of f is where f′ crosses the axis."], ["x > 2: f rises, so f′ > 0", "On the right, f′ is above the axis."], ["f′ is a straight line", "A parabola’s slope changes at a steady rate, so its graph is a line."]],
      a: "A rising straight line that crosses the x-axis at x = 2." },
    { q: "f(x) = x³ − 3x² − 9x + 2. Where is f increasing, and where is it decreasing?",
      steps: [["f′(x) = 3x² − 6x − 9", "Increasing means f′ > 0, so find f′ first."], ["f′(x) = 3(x + 1)(x − 3)", "Factor. f′ = 0 at x = −1 and x = 3: the turns."], ["x = −2: f′ = 3(−1)(−5) = 15 > 0", "Test one x left of −1: rising."], ["x = 0: f′ = 3(1)(−3) = −9 < 0", "Test between the turns: falling."], ["x = 4: f′ = 3(5)(1) = 15 > 0", "Test right of 3: rising again."]],
      a: "Increasing for x < −1 and x > 3. Decreasing for −1 < x < 3." },
    { q: "The graph of f′ is a parabola that opens down and crosses the x-axis at x = −2 and x = 1. Where does f have a local max, and where a local min?",
      steps: [["x < −2: f′ is below the axis, so f falls", "Opening down, the parabola is negative outside its zeros."], ["−2 < x < 1: f′ is above the axis, so f rises", "Between its zeros it is positive."], ["x > 1: f′ is below the axis, so f falls", "Negative again."], ["x = −2: falls, then rises", "A valley: a local min."], ["x = 1: rises, then falls", "A hill: a local max."]],
      a: "Local min at x = −2, local max at x = 1. The graph of f′ can’t tell you how high they are." }
  ],
  mistakes: [
    { wrong: "f has a peak at x = 1, so f′ has a peak at x = 1.", why: "f′ is not a copy of f. At the top of a hill the tangent is flat, so the slope there is 0.", fix: "A peak of f is a zero of f′: f′(1) = 0." },
    { wrong: "f′ = 0 where the graph of f crosses the x-axis.", why: "Crossing the x-axis means the height f(x) is 0. f′ is about slope, not height.", fix: "f′ = 0 where the graph of f is flat: at its turning points." },
    { wrong: "f is below the x-axis there, so f′ is negative.", why: "A curve can sit below the axis and still be climbing. The sign of f′ depends on direction, not on position.", fix: "Ask “is f going up or down here?”, never “is f above or below the axis?”." },
    { wrong: "f′ is decreasing on 0 < x < 2, so f is decreasing there.", why: "f′ can fall from 3 to 1 and still be positive. Then f is still rising, just less steeply.", fix: "f decreases only where f′ is below the axis, f′ < 0." }
  ],
  teach: {
    script: [
      "Draw a cubic with one hill and one valley. Put your pencil at the far left and move right. Say “up” while it rises, “flat” at the hill, “down” on the way down, “flat” at the valley, “up” again.",
      "Draw a second set of axes underneath, lined up. Up means above the axis, flat means on the axis, down means below.",
      "Mark the two zeros first, right under the hill and the valley. Then join: above, through zero, below, through zero, above. That is a parabola.",
      "Ask where f was steepest going down. It is between the turns. That is the bottom of the parabola.",
      "Finish with the warning: a peak of f is a zero of f′. f′ only knows direction and steepness, never height."
    ],
    board: "Two stacked axes with the same x scale. A cubic on top with dashed vertical lines dropped from its hill and valley to the lower axis. Let Sebastian put the + and − signs between the lines before anything is drawn.",
    ask: [
      { q: "f has a local max at x = 4. What is f′(4)?", listen: "“0, because the tangent is flat at the top.” If he says “f′ has a max there”, put a ruler on the hilltop and ask how steep it is." },
      { q: "A graph sits below the x-axis but is climbing. Is f′ positive or negative there?", listen: "“Positive, because it is going up.” If he says negative, he is reading height. Ask him to cover the axis and look only at direction." },
      { q: "f′ is a parabola with zeros at 1 and 5, opening up. Where does f fall?", listen: "“Between 1 and 5, where f′ is below the axis.” A good answer also names a max at 1 and a min at 5." }
    ],
    confusion: "The big one is drawing f′ as a copy of f, with the peaks in the same places. Stop it by always marking the zeros of f′ first, straight under every hill and valley. Then only signs are left to decide. The second slip is reading height instead of direction. Have him run a finger along f and say “up” or “down”, ignoring the axis."
  },
  recap: [
    "f rising ⇔ f′ above the axis. f falling ⇔ f′ below. A turn of f ⇔ f′ crosses 0.",
    "The steepest point of f is a peak or trough of f′. A peak of f is a zero of f′.",
    "f′ gives the shape of f, not its height: f and f + C have the same f′."
  ]
};

/* ======================= maximums and minimums ======================= */
CP.LESSONS.maxmin = {
  big: "Hills and valleys are flat on top, so local maximums and minimums happen where f′(x) = 0. Then the sign of f″ sorts them: negative frowns (a max), positive smiles (a min).",
  intro: [
    "A maximum is the top of a hill on a graph, and a minimum is the bottom of a valley. Calculus finds them without drawing anything, because both are flat: the tangent there is horizontal, so f′(x) = 0.",
    "Solving f′(x) = 0 gives the candidates. Then you decide which kind each one is. One way is to check the sign of f′ on each side. The quicker way is the sign of f″. On a closed interval you must also check the two ends, because the highest point can sit at an edge."
  ],
  see: [
    {
      h: "Hunt for the flat points",
      text: "Drag along the cubic and watch the sign of f′ in the readout. The purple tangent shows the slope. The f″ readout is the second derivative, 6x.",
      widget: { type: "tracer", f: x => x * x * x - 12 * x + 2, df: x => 3 * x * x - 12, x: [-4, 4], y: [-18, 23], dy: [-15, 38], x0: 0, ticks: 1,
        label: "f(x) = x³ − 12x + 2", dlabel: "slope f′(x) = 3x² − 12", mlabel: "slope f′(x)",
        readouts: [{ label: "sign of f′", value: s => Math.abs(s.m) < 0.05 ? "0, flat" : s.m > 0 ? "+, rising" : "−, falling" }, { label: "f″(x) = 6x", value: s => fmt(6 * s.x, 2) }] },
      tasks: [
        { ask: "Drag left until the tangent goes flat on top of the hill. Watch the sign of f′ as you cross it.", check: s => near(s.x, -2, 0.1), got: "x = −2, height f(−2) = 18. f′ is + on the left and − on the right. Rising then falling: a local maximum." },
        { ask: "Now find the bottom of the valley.", check: s => near(s.x, 2, 0.1), got: "x = 2, height f(2) = −14. f′ goes from − to +. Falling then rising: a local minimum." },
        { ask: "Drag to where the curve crosses the x-axis on the right.", check: s => s.x > 3.3 && s.x < 3.46, got: "Here f(x) = 0, but the slope is about 22: nothing flat about it. Solving f(x) = 0 finds crossings. Solving f′(x) = 0 finds the turns." },
        { ask: "Go back to the top of the hill and read f″.", check: s => near(s.x, -2, 0.1), got: "f″(−2) = −12. Negative: the curve frowns, so the flat point is a max. At x = 2, f″ = 12: a smile, so a min." }
      ],
      after: "The flat points are where f′(x) = 3x² − 12 = 0, so x = ±2. To sort them, either watch f′ change sign (+ to − is a max, − to + is a min) or check f″: f″(−2) = −12 < 0 frowns (a max), f″(2) = 12 > 0 smiles (a min)."
    },
    {
      h: "On a closed interval, check the ends",
      text: "Now f(x) = x³ − 3x² is cut off: x can only run from −0.5 to 3.5. The dots mark the two flat points. Find the highest and lowest points anywhere on this piece.",
      widget: { type: "tracer", f: x => x * x * x - 3 * x * x, df: x => 3 * x * x - 6 * x, x: [-0.5, 3.5], y: [-5, 7.2], dy: [-4, 16], x0: 1, ticks: 0.5,
        label: "f(x) = x³ − 3x², −0.5 ≤ x ≤ 3.5", dlabel: "slope f′(x)", mlabel: "slope f′(x)", marks: [{ x: 0, label: "flat" }, { x: 2, label: "flat" }] },
      tasks: [
        { ask: "Drag to the local max, the hilltop at x = 0. How high is it?", check: s => near(s.x, 0, 0.06), got: "f(0) = 0. A hill, but is it the highest point on this piece?" },
        { ask: "Drag all the way to the right end.", check: s => s.x > 3.47, got: "f(3.5) = 6.125. Higher than the hill, and the slope there is 15.75, not 0. The absolute max sits at an end." },
        { ask: "Now drag to the valley at x = 2.", check: s => near(s.x, 2, 0.06), got: "f(2) = −4, a flat point where f′ = 0." },
        { ask: "Check the left end too.", check: s => s.x < -0.47, got: "f(−0.5) = −0.875. That is higher than −4, so the absolute min is the valley, f(2) = −4." }
      ],
      after: "On a closed interval, list the candidates: every x inside where f′ = 0, plus the two ends. Work out f at each one. The biggest is the absolute max and the smallest is the absolute min. Here the max is f(3.5) = 6.125, at an end. The hill at x = 0 is only a local max."
    }
  ],
  why: {
    lead: "Why must the slope be 0 at a smooth hilltop? Look just to each side. Then the second derivative test follows from one fact you saw in the last step: f″ is the slope of f′.",
    steps: [
      ["Just left of a max, f rises, so f′ > 0", "Climbing up to the top."],
      ["Just right of a max, f falls, so f′ < 0", "Coming down the other side."],
      ["f′ of a polynomial has no jumps, so f′ = 0 at the top", "To get from + to − without jumping, it must pass through 0."],
      ["At a min: f′ goes from − to +, so again f′ = 0", "Same argument, upside down."],
      ["f″ < 0 means f′ is decreasing", "f″ is the slope of f′."],
      ["f′ = 0 and decreasing: + before, − after, so a max", "A decreasing slope that passes through 0 must go from positive to negative."],
      ["f″ > 0: f′ goes from − to +, so a min", "An increasing slope through 0 goes from negative to positive."]
    ],
    end: "If f″ = 0 at a flat point, the test says nothing. Then check the sign of f′ on each side. For x³ at 0 the slope is + on both sides, so it is neither a max nor a min. On a closed interval the ends need no f′ = 0: the graph simply stops there, so you test them directly."
  },
  examples: [
    { q: "Find the turning point of f(x) = 2x² − 12x + 5. Is it a max or a min?",
      steps: [["f′(x) = 4x − 12", "Differentiate."], ["4x − 12 = 0, so x = 3", "Set f′ = 0 and solve for x."], ["f(3) = 18 − 36 + 5 = −13", "Substitute into f, not f′, to get the height."], ["f″(x) = 4 > 0", "Positive: a smile, so a min."]],
      a: "A local minimum at (3, −13)." },
    { q: "Find and classify the local maximum and minimum of f(x) = 2x³ + 3x² − 12x + 1.",
      steps: [["f′(x) = 6x² + 6x − 12", "Differentiate."], ["6(x + 2)(x − 1) = 0, so x = −2 or x = 1", "Take out 6, then factor x² + x − 2."], ["f″(x) = 12x + 6", "Differentiate again."], ["f″(−2) = −18 < 0: a max. f(−2) = −16 + 12 + 24 + 1 = 21", "Frown, so a hill."], ["f″(1) = 18 > 0: a min. f(1) = 2 + 3 − 12 + 1 = −6", "Smile, so a valley."]],
      a: "Local max at (−2, 21), local min at (1, −6)." },
    { q: "Find the absolute max and min of f(x) = x³ − 3x² + 1 on 1 ≤ x ≤ 4.",
      steps: [["f′(x) = 3x² − 6x = 3x(x − 2)", "Differentiate and factor."], ["x = 0 or x = 2", "Solve f′(x) = 0."], ["Keep x = 2. Drop x = 0", "x = 0 is outside 1 ≤ x ≤ 4."], ["f(1) = −1, f(2) = −3, f(4) = 17", "Test the flat point inside and both ends."], ["Biggest 17, smallest −3", "Compare the three values."]],
      a: "Absolute max 17 at x = 4 (an end). Absolute min −3 at x = 2." }
  ],
  mistakes: [
    { wrong: "Solve x³ − 12x + 2 = 0 to find the turning points.", why: "That finds where the graph crosses the x-axis, where the height is 0. Turning points are where the graph is flat.", fix: "Solve f′(x) = 3x² − 12 = 0, so x = ±2." },
    { wrong: "f(x) = 2x² − 12x + 5 has its minimum at x = −13.", why: "−13 is the height of the turning point, not its position. The position comes from f′(x) = 0.", fix: "The minimum is at x = 3, and its value is f(3) = −13: the point (3, −13)." },
    { wrong: "f″(2) = 12 > 0, so x = 2 is a maximum.", why: "The signs are swapped. Positive f″ means concave up, a smile, and the flat point is the bottom of the smile.", fix: "f″ > 0 gives a min. f″ < 0 gives a max." },
    { wrong: "On 1 ≤ x ≤ 4 the absolute max of x³ − 3x² + 1 is at a flat point.", why: "The ends of a closed interval are candidates too, even though f′ isn’t 0 there. f(4) = 17 beats every other value.", fix: "Test f at every flat point inside the interval and at both ends." }
  ],
  teach: {
    script: [
      "Draw a hill. Put a ruler on top as the tangent. Ask: how steep is it? Flat. So at any smooth max, f′ = 0. Same for a valley.",
      "That gives the method: differentiate, set f′ = 0, solve for x. Those are the candidates.",
      "To sort them, trace with a finger: up then down is a max, down then up is a min. That is the sign of f′ on each side.",
      "Shortcut: the sign of f″. Negative frowns, and the flat point is the top of the frown. Positive smiles, and the flat point is the bottom of the smile.",
      "Last, the fence: if x is only allowed from a to b, the highest point might be right at the fence. Always test the ends."
    ],
    board: "A cubic with a hill and a valley. A short flat ruler line on each. Under each, write f′ = 0, then a frown with f″ < 0 under the hill and a smile with f″ > 0 under the valley.",
    ask: [
      { q: "Why do we solve f′(x) = 0 and not f(x) = 0?", listen: "“f′ = 0 is where the graph is flat, which is where it turns. f = 0 is where it crosses the axis.” If unsure, point to a crossing and ask if it is flat there." },
      { q: "f′(5) = 0 and f″(5) = −3. What is at x = 5?", listen: "“A local max: negative f″ frowns.” If he says min, draw the frown and ask where the flat point is on it." },
      { q: "On 0 ≤ x ≤ 10, the only flat point is a min. Where could the max be?", listen: "“At one of the ends, x = 0 or x = 10. Test both.”" }
    ],
    confusion: "Two slips are common. First, solving f(x) = 0 instead of f′(x) = 0, often from habit with quadratics. Ask “what is flat at a turning point?” every time. Second, reporting the height as the position, or the reverse. Insist on the full point (x, f(x)). And on interval questions, have him write the list of candidates, including both ends, before computing anything."
  },
  recap: [
    "Local max and min happen where f′(x) = 0. Solve f′, not f.",
    "f″ < 0 frowns: a max. f″ > 0 smiles: a min. If f″ = 0, check the sign of f′ on each side.",
    "On a closed interval, test f at the flat points inside and at both ends."
  ]
};

/* ======================= concavity and inflection ======================= */
CP.LESSONS.concav = {
  big: "Concave up means the curve bends like a smile and its slope keeps rising, so f″ > 0. Concave down is a frown with a falling slope, f″ < 0. A point of inflection is where the bend switches.",
  intro: [
    "f′ tells you whether a curve goes up or down. f″ tells you how it bends. Concave up means it bends upward like a cup or a smile. Concave down means it bends downward like a cap or a frown.",
    "The place where the bend changes from one to the other is a point of inflection. You find it where f″ changes sign, which usually means f″ = 0. But f″ = 0 is only a candidate: you must check that the sign really changes."
  ],
  see: [
    {
      h: "Smile, frown, and the switch",
      text: "Drag along the cubic. Watch where the purple tangent line sits compared with the curve. The lower panel shows the slope at each point you visit, and the readouts show f″ and the bend.",
      widget: { type: "tracer", f: x => x * x * x - 3 * x * x + 2, df: x => 3 * x * x - 6 * x, x: [-1.2, 3.2], y: [-4.6, 4.6], dy: [-4, 12], x0: -0.8, ticks: 1,
        label: "f(x) = x³ − 3x² + 2", dlabel: "slope f′(x)", mlabel: "slope f′(x)",
        readouts: [{ label: "f″(x) = 6x − 6", value: s => fmt(6 * s.x - 6, 2) }, { label: "bend", value: s => bend(6 * s.x - 6, 0.3) }] },
      tasks: [
        { ask: "Drag into the valley near x = 2. Is the purple tangent above or below the curve?", check: s => near(s.x, 2, 0.07), got: "Below. The curve bends up like a smile: concave up. The readout shows f″(2) = 6, positive." },
        { ask: "Now drag onto the hill near x = 0. Where is the tangent now?", check: s => near(s.x, 0, 0.07), got: "Above. The curve bends down like a frown: concave down. f″(0) = −6, negative." },
        { ask: "Press Sweep and watch the slope dots in the lower panel.", check: s => s.covered > 0.85, got: "The slope falls until x = 1, then rises. Concave down means the slope is falling. Concave up means it is rising." },
        { ask: "Find the exact point where the bend switches.", check: s => near(s.x, 1, 0.05), got: "x = 1. f″(1) = 0 and the tangent cuts through the curve. This is the point of inflection, (1, 0). The slope is at its lowest here: −3." }
      ],
      after: "Concave up: the tangent sits below the curve, the slope is rising, and f″ > 0. Concave down: the tangent sits above, the slope is falling, and f″ < 0. At the inflection point the tangent crosses the curve and f″ changes sign."
    },
    {
      h: "f″ = 0 is only a candidate",
      text: "This is f(x) = x⁴ − ax². The slider sets a. It starts at 6. Watch the bend readout as you drag.",
      widget: { type: "tracer", f: (x, a) => x * x * x * x - a * x * x, df: (x, a) => 4 * x * x * x - 2 * a * x, x: [-2.5, 2.5], dy: [-12, 12], x0: -2, ticks: 1,
        label: "f(x) = x⁴ − ax²", dlabel: "slope f′(x)", mlabel: "slope f′(x)",
        param: { name: "a", label: "a", min: 0, max: 6, step: 0.1, val: 6, show: v => fmt(v, 1) },
        readouts: [{ label: "f″(x) = 12x² − 2a", value: s => fmt(12 * s.x * s.x - 2 * s.p, 2) }, { label: "bend", value: s => bend(12 * s.x * s.x - 2 * s.p, 1.25) }] },
      tasks: [
        { ask: "With a = 6, find the inflection point on the right, where the bend switches.", check: s => near(s.p, 6, 0.05) && near(s.x, 1, 0.05), got: "x = 1. f″(1) = 12 − 12 = 0, and the bend switches from frown to smile." },
        { ask: "Find the one on the left.", check: s => near(s.p, 6, 0.05) && near(s.x, -1, 0.05), got: "x = −1. f(x) = x⁴ − 6x² has two inflection points, at x = ±1." },
        { ask: "Now slide a down to 0, so f(x) = x⁴. Drag to x = 0.", check: s => near(s.p, 0, 0.05) && near(s.x, 0, 0.06), got: "f″(0) = 0 here. So is it an inflection point? Check both sides before you decide." },
        { ask: "Keep a = 0. Drag a little way left or right of 0, between 0.4 and 1 away.", check: s => near(s.p, 0, 0.05) && Math.abs(s.x) > 0.4 && Math.abs(s.x) < 1, got: "A smile on both sides. f″ = 12x² is never negative, so the sign never changes. x = 0 is a minimum of x⁴, not an inflection point." }
      ],
      after: "An inflection point needs the sign of f″ to change. f″ = 0 just tells you where to look. For x⁴ − 6x², f″ = 12x² − 12 changes sign at ±1. For x⁴, f″ = 12x² touches 0 and bounces back up."
    }
  ],
  why: {
    lead: "Concave up means the slope is increasing. f″ is the slope of f′, so concave up is exactly f″ > 0. The tangent picture follows too. Here is the algebra for f(x) = x³, where f″(a) = 6a.",
    steps: [
      ["Tangent at x = a: y = a³ + 3a²(x − a)", "Height a³, slope f′(a) = 3a²."],
      ["Step to x = a + h: f = (a + h)³ = a³ + 3a²h + 3ah² + h³", "Expand the cube."],
      ["Tangent there: a³ + 3a²h", "Put x − a = h into the tangent line."],
      ["Gap = curve − tangent = 3ah² + h³ = h²(3a + h)", "Subtract. Everything else cancels."],
      ["For small h, the gap has the sign of 3a = f″(a) ÷ 2", "h² is never negative, and h is tiny next to 3a."],
      ["f″(a) > 0: curve above tangent. f″(a) < 0: curve below", "So the sign of f″ decides which side the tangent is on."],
      ["At a = 0: gap = h³, which changes sign with h", "The tangent crosses the curve. That is the inflection point of x³."]
    ],
    end: "The same thing holds for any smooth curve: near x = a, the gap between curve and tangent is about ½f″(a)h². So f″ > 0 puts the curve above its tangents (a smile) and f″ < 0 puts it below (a frown)."
  },
  examples: [
    { q: "Find the point of inflection of f(x) = x³ − 6x² + 5x + 2.",
      steps: [["f′(x) = 3x² − 12x + 5", "Differentiate."], ["f″(x) = 6x − 12", "Differentiate again."], ["6x − 12 = 0, so x = 2", "Set f″ = 0."], ["f″(1) = −6 < 0, f″(3) = 6 > 0", "The sign changes, so it is a real inflection."], ["f(2) = 8 − 24 + 10 + 2 = −4", "Find the height."]],
      a: "(2, −4)" },
    { q: "Where is f(x) = −2x³ + 6x² + x concave up?",
      steps: [["f′(x) = −6x² + 12x + 1", "Differentiate."], ["f″(x) = −12x + 12 = −12(x − 1)", "Differentiate again and factor."], ["f″ > 0 when x − 1 < 0", "−12 times a negative number is positive."], ["So x < 1", "Concave up on the left, concave down on the right."]],
      a: "Concave up for x < 1. Concave down for x > 1." },
    { q: "Find all points of inflection of f(x) = x⁴ − 24x².",
      steps: [["f′(x) = 4x³ − 48x", "Differentiate."], ["f″(x) = 12x² − 48 = 12(x − 2)(x + 2)", "Differentiate again and factor."], ["f″ = 0 at x = −2 and x = 2", "The candidates."], ["f″(−3) = 60, f″(0) = −48, f″(3) = 60", "Test each piece: +, −, +. The sign changes at both."], ["f(±2) = 16 − 96 = −80", "Find the heights."]],
      a: "(−2, −80) and (2, −80)" }
  ],
  mistakes: [
    { wrong: "f(x) = x⁴ has f″(0) = 0, so (0, 0) is a point of inflection.", why: "f″ = 12x² is positive on both sides of 0. The curve smiles on both sides, so the bend never switches.", fix: "Check the sign of f″ on each side. x⁴ has no inflection point. (0, 0) is its minimum." },
    { wrong: "The inflection points of x³ − 3x are where f′ = 0, at x = ±1.", why: "f′ = 0 finds flat points: the max and min. Inflection is about the bend, which is f″.", fix: "f″(x) = 6x = 0 at x = 0. The inflection point is (0, 0)." },
    { wrong: "Concave up means the graph is going up.", why: "Concave up is about the bend, not the direction. y = x² is concave up everywhere, but it falls for x < 0.", fix: "Concave up means the slope is increasing, f″ > 0. Direction comes from f′." },
    { wrong: "f″(x) = 6x − 12 = 0, so x = 12 ÷ 2 = 6.", why: "An arithmetic slip: divide by the coefficient of x, which is 6.", fix: "6x = 12, so x = 2. Check: f″(2) = 0." }
  ],
  teach: {
    script: [
      "Draw a smile and a frown. Ask which one holds water. The smile is concave up, the frown is concave down.",
      "On the smile, lay a ruler as a tangent at a few points. It always sits under the curve. On the frown it sits on top.",
      "Walk along the smile from left to right and say the slope: steep down, gentle down, flat, gentle up, steep up. The slope keeps rising. That is f″ > 0.",
      "Now draw an S-shaped cubic. Find where the frown turns into a smile. The ruler there cuts through the curve. That is the point of inflection.",
      "End with x⁴: f″(0) = 0, but it smiles on both sides. f″ = 0 is a place to look, not a proof."
    ],
    board: "An S-shaped cubic. Short ruler lines as tangents: two above the frown part, two below the smile part, one cutting through at the switch. Label the pieces f″ < 0 and f″ > 0 with a dot at the switch.",
    ask: [
      { q: "The slope of a curve goes −3, −1, 1, 3 as you move right. Concave up or down?", listen: "“Up, because the slope is increasing.” If he says “it’s going up”, point out that it starts by falling." },
      { q: "f″(4) = 0. Is x = 4 a point of inflection?", listen: "“Not for sure. I need to check that f″ changes sign at 4.” Praise the doubt. If he says yes, give him x⁴ at 0." },
      { q: "On a curve, is the tangent above or below the curve where f″ < 0?", listen: "“Above, because it frowns.” If unsure, have him draw a frown and lay a pencil on it." }
    ],
    confusion: "Students mix up concavity with direction. “Concave up” sounds like “going up”. Keep returning to the shape: smile or frown, and slope rising or falling. The other trap is treating f″ = 0 as the finish line. Make the sign check a habit: a test value on each side, every time."
  },
  recap: [
    "f″ > 0: concave up, a smile, the slope is rising. f″ < 0: concave down, a frown, the slope is falling.",
    "A point of inflection is where f″ changes sign. There the tangent crosses the curve.",
    "f″ = 0 is only a candidate. x⁴ has f″(0) = 0 but no inflection point."
  ]
};

/* ======================= sketching from derivatives ======================= */
CP.LESSONS.sketch = {
  big: "A sign chart for f′ tells you where f rises, falls and turns. A sign chart for f″ tells you how it bends. Add the y-intercept and the ends, and the sketch draws itself.",
  intro: [
    "This step joins the last three. You find the flat points with f′, decide where f goes up or down, find the bends with f″, and then draw. The curve comes last, after the thinking is done.",
    "A sign chart is a number line with the zeros marked and a + or − on each piece between them. One row for f′ (up or down) and one row for f″ (smile or frown) hold almost everything you need."
  ],
  see: [
    {
      h: "Six steps to a cubic",
      text: "Press Next step to move through the method one step at a time. The vertical lines mark the zeros, and the rows under the graph are the sign charts for f′ and f″. Before each press, say what you expect to see.",
      widget: { type: "sign", c: [5, -9, -3, 1], x: [-3, 5] },
      tasks: [
        { ask: "Press Next step. Where is f′ zero?", check: s => s.step >= 1, got: "f′(x) = 3x² − 6x − 9 = 3(x + 1)(x − 3), so f′ = 0 at x = −1 and x = 3. The lines mark the two flat points." },
        { ask: "Next: the sign of f′ on each piece.", check: s => s.step >= 2, got: "+, −, +. f rises to x = −1, falls to x = 3, then rises. So x = −1 is a local max and x = 3 is a local min." },
        { ask: "Next: where is f″ zero?", check: s => s.step >= 3, got: "f″(x) = 6x − 6 = 0 at x = 1, halfway between the two turns." },
        { ask: "Next: the sign of f″.", check: s => s.step >= 4, got: "− then +: a frown left of x = 1, a smile to the right. f(1) = −6, so (1, −6) is the inflection point." },
        { ask: "Now draw it.", check: s => s.last, got: "Up to (−1, 10), down through (1, −6) to (3, −22), then up again. It crosses the y-axis at f(0) = 5." }
      ],
      after: "The curve only joins up what the charts already said. f′ chart: up, down, up, with turns at −1 and 3. f″ chart: frown, then smile, switching at 1. The x³ term sends the left end down and the right end up."
    },
    {
      h: "A flat point that is not a turn",
      text: "Same method on the quartic f(x) = x⁴ − 4x³ + 10. Look closely at x = 0.",
      widget: { type: "sign", c: [10, 0, 0, -4, 1], x: [-1, 4] },
      tasks: [
        { ask: "Step through to the sign of f′ (step 3).", check: s => s.step >= 2, got: "f′(x) = 4x³ − 12x² = 4x²(x − 3) is 0 at x = 0 and x = 3. But f′ is − on both sides of 0: f keeps falling through x = 0." },
        { ask: "Step on to the sign of f″ (step 5).", check: s => s.step >= 4, got: "f″(x) = 12x² − 24x = 12x(x − 2) changes sign at 0 and at 2. Two inflection points: (0, 10) and (2, −6)." },
        { ask: "Now draw it.", check: s => s.last, got: "At x = 0 the curve flattens for an instant and keeps falling: a flat inflection point. The only turn is the minimum at (3, −17)." }
      ],
      after: "f′ = 0 gives a flat point, but only a sign change in f′ makes a max or min. Here x² in f′ = 4x²(x − 3) never changes sign, so x = 0 is not a turn. It is a flat point and an inflection point at once."
    }
  ],
  why: {
    lead: "Each row of the chart rests on a fact from the earlier steps. Put together, they leave almost no freedom in the shape.",
    steps: [
      ["f′ > 0 ⇒ f rises. f′ < 0 ⇒ f falls", "The sign of the slope is the direction of the graph."],
      ["f′ changes sign at c ⇒ a turn at c", "+ to − is a max, − to + is a min."],
      ["A polynomial only changes sign at its zeros", "It has no jumps. So you only need one test value on each piece."],
      ["f″ > 0 ⇒ smile. f″ < 0 ⇒ frown", "f″ is the slope of f′: it says whether the slope is rising or falling."],
      ["f″ changes sign at c ⇒ an inflection point at c", "The bend switches there."],
      ["For large |x|, the leading term wins", "x³ heads down on the left and up on the right. x⁴ heads up on both sides."],
      ["(f + C)′ = f′", "The charts fix the shape, not the height. One known point, like the y-intercept, pins the curve in place."]
    ],
    end: "That is why the order matters. f′ gives the skeleton: where the turns are and which way each piece goes. f″ adds the bend between them. The real values f(c) at the turns and inflections give the heights."
  },
  examples: [
    { q: "f′(x) = 2x − 4. Describe the shape of f.",
      steps: [["2x − 4 = 0 at x = 2", "The only flat point."], ["f′ < 0 for x < 2, f′ > 0 for x > 2", "Falls, then rises: a min at x = 2."], ["f″(x) = 2 > 0", "Concave up everywhere: no inflection."], ["f = x² − 4x + C", "Its height is not fixed: any C works."]],
      a: "A U-shaped parabola with its lowest point at x = 2. f′ alone can’t give its height." },
    { q: "Sketch f(x) = x³ − 3x + 1.",
      steps: [["f′(x) = 3x² − 3 = 3(x − 1)(x + 1)", "Zero at x = −1 and x = 1."], ["f′: + for x < −1, − between, + for x > 1", "Max at x = −1, min at x = 1."], ["f(−1) = 3, f(1) = −1", "Heights of the turns."], ["f″(x) = 6x: − for x < 0, + for x > 0", "Inflection at x = 0, and f(0) = 1."], ["y-intercept 1. Left end down, right end up", "The x³ term rules the ends."], ["Rise to (−1, 3), fall through (0, 1) to (1, −1), then rise", "Join the pieces."]],
      a: "Local max (−1, 3), local min (1, −1), inflection (0, 1), falling to the left and rising to the right." },
    { q: "Sketch f(x) = 3x⁴ − 4x³.",
      steps: [["f′(x) = 12x³ − 12x² = 12x²(x − 1)", "Zero at x = 0 and x = 1."], ["f′: − for x < 0, − for 0 < x < 1, + for x > 1", "No sign change at 0, so no turn there. A min at x = 1, f(1) = −1."], ["f″(x) = 36x² − 24x = 12x(3x − 2)", "Zero at x = 0 and x = 2/3."], ["f″: + for x < 0, − for 0 < x < 2/3, + for x > 2/3", "Inflections at x = 0 and x = 2/3."], ["f(0) = 0, f(2/3) = −16/27 ≈ −0.59", "Heights of the inflections."], ["f = x³(3x − 4): zeros at 0 and 4/3. Both ends up", "The x⁴ term wins at both ends."]],
      a: "Min (1, −1). Flat inflection (0, 0). Inflection (2/3, −16/27). Crosses the x-axis at 0 and 4/3. Up at both ends." }
  ],
  mistakes: [
    { wrong: "f′(0) = 0, so f(x) = 3x⁴ − 4x³ has a max or min at x = 0.", why: "A flat point is only a turn if f′ changes sign there. f′ = 12x²(x − 1) is negative on both sides of 0.", fix: "Check the sign of f′ on each side. x = 0 is a flat inflection point, not a turn." },
    { wrong: "f′(x) = 2x − 4, so f(x) = x² − 4x.", why: "Every curve x² − 4x + C has the same derivative. f′ fixes the shape, not the height.", fix: "f(x) = x² − 4x + C. You need one known point, like f(0), to find C." },
    { wrong: "f″ > 0 on x > 1, so f is increasing there.", why: "That reads the wrong row. f″ is about the bend. A smile can still be falling.", fix: "Use the f′ row for up or down. Use the f″ row for smile or frown." },
    { wrong: "The sketch of x³ − 3x + 1 levels off at the ends.", why: "A polynomial never levels off. For large |x|, the x³ term dominates.", fix: "x³ − 3x + 1 heads down on the far left and up on the far right." }
  ],
  teach: {
    script: [
      "Write f, f′ and f″ in a column before any drawing. Ask Sebastian to say what each one will tell you: height, direction, bend.",
      "Factor f′ and put its zeros on a number line. Test one x on each piece and write + or −, with an arrow up or down.",
      "Do the same for f″ on a second line, with a smile or a frown on each piece.",
      "Work out f at every special x: the turns, the inflections and x = 0. Plot those points first.",
      "Ask which way the ends go, from the leading term. Only now join the points, following the arrows and the bends."
    ],
    board: "Two number lines stacked under an empty grid, with the same x scale. The top line is for f′ with arrows, the bottom one for f″ with smiles and frowns. Dashed lines up from every zero into the grid.",
    ask: [
      { q: "f′ is + then − at x = 2, and f″(2) < 0. What is at x = 2?", listen: "“A local max: rising then falling, and it frowns.” Both tests agree. If he hesitates, draw the arrows." },
      { q: "Two students draw f from the same f′ chart, and their graphs are at different heights. Who is right?", listen: "“Both could be. f′ doesn’t fix the height. You need one point.”" },
      { q: "f′ = 0 at x = 0, but f′ is negative on both sides. What does the graph do there?", listen: "“It flattens for a moment and keeps falling. No max or min.” Have him sketch y = −x³ near 0 if stuck." }
    ],
    confusion: "The most common slip is joining the dots too early, before the charts are done, so the curve gets the wrong bend or misses a flat point. Make the rule: no curve until both rows are filled in and the special points are plotted. The second slip is calling every zero of f′ a turn. Ask “does the sign change?” every time."
  },
  recap: [
    "f′ row: zeros are flat points, and + or − says up or down. A sign change makes a max or min.",
    "f″ row: + is a smile, − a frown. A sign change makes an inflection point.",
    "Plot the special points, the y-intercept and the ends. Draw the curve last."
  ]
};
})();
