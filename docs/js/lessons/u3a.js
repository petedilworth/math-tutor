/* Full lesson: sine, cosine and eˣ. This is the model the other lessons follow. */
window.CP = window.CP || {};
(function () {
CP.LESSONS = CP.LESSONS || {};
const { fmt } = CP.W, PI = Math.PI, E = Math.E;
const near = (a, b, tol) => Math.abs(a - b) <= tol;

CP.LESSONS.trigexp = {
  big: "Plot the slope of sin x at every point and you draw cos x. Do the same to cos x and you get −sin x. And e is simply the base whose slope always equals its own height.",
  intro: [
    "This step packs three facts that look unrelated. One idea joins them: you can read a derivative straight off a graph. Ask “how steep is it here?” at every point, plot the answers, and the derivative appears.",
    "So nothing here needs memorizing. You need to picture a wave and ask where it is steepest and where it is flat. For e, you need one question: how fast does it grow compared with its own size?"
  ],
  see: [
    {
      h: "Sine’s slope draws cosine",
      text: "Drag along the wave, or press Sweep. The purple line is the tangent: it touches the curve and shows how steep it is right there. Every slope you visit drops a dot in the lower panel.",
      widget: { type: "tracer", f: x => Math.sin(x), df: x => Math.cos(x), x: [0, 2 * PI], y: [-1.35, 1.35], dy: [-1.35, 1.35], x0: 0.7, ticks: "pi",
        label: "y = sin x", dlabel: "slope of sin x", ghost: x => Math.cos(x), ghostLabel: "cos x" },
      tasks: [
        { ask: "Drag to x = 0, where sine starts. How steep is it?", check: s => s.x < 0.06, got: "Slope 1, the steepest it ever climbs. And cos 0 = 1." },
        { ask: "Drag to the top of the wave.", check: s => near(s.x, PI / 2, 0.06), got: "Flat: slope 0. And cos(π/2) = 0." },
        { ask: "Find where sine falls fastest.", check: s => near(s.x, PI, 0.06), got: "Slope −1 at x = π. And cos π = −1." },
        { ask: "Press Sweep, or drag all the way across, to trace every slope.", check: s => s.covered > 0.85, got: "The dots make a wave that starts at 1 and dips to −1." },
        { ask: "Press Show cos x to compare.", check: s => s.ghost && s.covered > 0.85, got: "It lands right on the dots. (sin x)′ = cos x." }
      ],
      after: "You never memorized anything. Sine climbs, flattens, falls, flattens. Its slope goes 1, 0, −1, 0, 1. That list is the cosine wave."
    },
    {
      h: "Cosine’s slope is sine, flipped",
      text: "Same game with cosine. Watch what the slope does just after x = 0.",
      widget: { type: "tracer", f: x => Math.cos(x), df: x => -Math.sin(x), x: [0, 2 * PI], y: [-1.35, 1.35], dy: [-1.35, 1.35], x0: 2.2, ticks: "pi",
        label: "y = cos x", dlabel: "slope of cos x", ghost: x => -Math.sin(x), ghostLabel: "−sin x", extra: [{ f: x => Math.sin(x), cls: "s5 wghost" }] },
      tasks: [
        { ask: "Drag to x = 0. Cosine is at its peak. What is the slope?", check: s => s.x < 0.06, got: "0. A peak is flat. The slope starts at 0, not below it." },
        { ask: "Now drag a little to the right, between 0.2 and 1.2.", check: s => s.x > 0.2 && s.x < 1.2, got: "The slope turns negative. Cosine heads down from its peak while sine (the grey wave) heads up. That is the minus sign." },
        { ask: "Sweep across to trace every slope.", check: s => s.covered > 0.85, got: "The dots start at 0, sink to −1 at π/2, and rise to +1 at 3π/2." },
        { ask: "Press Show −sin x.", check: s => s.ghost && s.covered > 0.85, got: "A perfect match. (cos x)′ = −sin x." }
      ],
      after: "Sine starts by going up. Cosine starts by going down. That one difference is the whole minus sign."
    },
    {
      h: "Find e yourself",
      text: "Every exponential grows in proportion to its own size. So its slope is always the same multiple of its height. Move the base a and read that multiple, slope ÷ height. Hunt for the base where it is exactly 1.",
      widget: { type: "tracer", f: (x, a) => Math.pow(a, x), df: (x, a) => Math.pow(a, x) * Math.log(a), x: [-2, 2], x0: 1, ticks: 1,
        label: "y = aˣ", dlabel: "slope of aˣ", ghost: (x, a) => Math.pow(a, x), ghostLabel: "aˣ itself",
        param: { name: "a", label: "base a", min: 1.5, max: 4, step: 0.001, val: 2, show: v => fmt(v, 3) },
        readouts: [{ label: "slope ÷ height", value: s => fmt(s.m / s.y, 4) }] },
      tasks: [
        { ask: "Leave a at 2. Drag the dot to a few places and read slope ÷ height.", check: s => near(s.p, 2, 0.003) && Math.abs(s.x - 1) > 0.3, got: "It stays at 0.6931 wherever you go. 2ˣ always grows a bit slower than its height." },
        { ask: "Set a to 3.", check: s => near(s.p, 3, 0.003), got: "Now it is 1.0986. 3ˣ always grows a bit faster than its height." },
        { ask: "Somewhere between 2 and 3 the multiple is exactly 1. Find that base.", check: s => near(s.m / s.y, 1, 0.0015), got: "a ≈ 2.718. That number is e." },
        { ask: "Keep a at e and press Show aˣ itself.", check: s => s.ghost && near(s.p, E, 0.004), got: "The slope curve and the curve itself are the same curve. That is (eˣ)′ = eˣ." }
      ],
      after: "The multiple you were reading is ln a: ln 2 = 0.693, ln 3 = 1.099, ln e = 1. That gives the whole rule: (aˣ)′ = aˣ · ln a. For base e the multiple is 1, so it disappears. That is why calculus uses e: it is the one base with nothing left over."
    }
  ],
  why: {
    lead: "Both proofs use first principles: the slope is the limit of rise ÷ run as the run h shrinks to 0. Two small facts do the heavy lifting. For tiny h, sin h ÷ h gets close to 1 and (cos h − 1) ÷ h gets close to 0. You already saw the first one: sine’s slope at 0 is 1.",
    steps: [
      ["(sin x)′ = lim<sub>h→0</sub> [sin(x + h) − sin x] ÷ h", "Start from the definition of slope."],
      ["sin(x + h) = sin x cos h + cos x sin h", "The sum identity for sine."],
      ["= lim [sin x (cos h − 1) + cos x sin h] ÷ h", "Substitute, then group the two sin x terms."],
      ["= sin x · lim (cos h − 1)/h + cos x · lim (sin h)/h", "Split into two limits. sin x and cos x don’t change as h shrinks."],
      ["= sin x · 0 + cos x · 1 = cos x", "Use the two small facts. Done."],
      ["(eˣ)′ = lim [e<sup>x+h</sup> − eˣ] ÷ h = eˣ · lim (e<sup>h</sup> − 1) ÷ h", "Pull out eˣ, using the exponent law e<sup>x+h</sup> = eˣ · e<sup>h</sup>."],
      ["lim (e<sup>h</sup> − 1) ÷ h = 1", "This limit is the slope of eˣ at x = 0. For base 2 the same limit is 0.693, and for base 3 it is 1.099. e is defined as the base where it is exactly 1."],
      ["aˣ = e<sup>x ln a</sup>, so (aˣ)′ = e<sup>x ln a</sup> · ln a = aˣ · ln a", "Any base can be rewritten with e. The chain rule then brings ln a down."]
    ],
    end: "Cosine works the same way with cos(x + h) = cos x cos h − sin x sin h. The minus in that identity becomes the minus in the answer. One warning: sin h ÷ h → 1 only when h is in radians. In degrees the limit is π/180 ≈ 0.0175, so every rule here assumes radians."
  },
  examples: [
    { q: "Differentiate y = 4 sin x − 3eˣ.",
      steps: [["y′ = 4(sin x)′ − 3(eˣ)′", "Constants ride along. Take each term on its own."], ["y′ = 4 cos x − 3eˣ", "sin becomes cos. eˣ stays eˣ."]],
      a: "y′ = 4 cos x − 3eˣ" },
    { q: "Find the slope of y = 5ˣ at x = 2.",
      steps: [["y′ = 5ˣ · ln 5", "Any base other than e: the function times ln of the base."], ["At x = 2: y′ = 5² · ln 5 = 25 ln 5", "Substitute."], ["25 × 1.6094 = 40.24", "ln 5 ≈ 1.6094."]],
      a: "about 40.2" },
    { q: "Differentiate y = e<sup>3x</sup> cos 2x.",
      steps: [["u = e<sup>3x</sup>,  v = cos 2x", "It is a product, so use u′v + uv′."], ["u′ = 3e<sup>3x</sup>", "Chain rule: the inside, 3x, has slope 3."], ["v′ = −2 sin 2x", "Chain rule again: cos becomes −sin, times the inside’s slope, 2."], ["y′ = 3e<sup>3x</sup> cos 2x − 2e<sup>3x</sup> sin 2x", "u′v + uv′."], ["y′ = e<sup>3x</sup>(3 cos 2x − 2 sin 2x)", "Factor out e<sup>3x</sup>. It is never zero, so this form shows where the slope is zero."]],
      a: "y′ = e<sup>3x</sup>(3 cos 2x − 2 sin 2x)" }
  ],
  mistakes: [
    { wrong: "(cos x)′ = sin x", why: "The minus is missing. Just after 0, cosine is falling, so its slope is negative. But sin x is positive there, so sin x can’t be the slope.", fix: "(cos x)′ = −sin x" },
    { wrong: "(eˣ)′ = x · e<sup>x−1</sup>", why: "That is the power rule. It needs x in the base with a fixed power, like x⁵. In eˣ the x is up in the exponent.", fix: "(eˣ)′ = eˣ" },
    { wrong: "(2ˣ)′ = 2ˣ", why: "Only base e copies itself. 2ˣ grows at 0.693 times its height, as the slider showed.", fix: "(2ˣ)′ = 2ˣ · ln 2 ≈ 0.693 · 2ˣ" },
    { wrong: "The slope of sin x at 0 is 0.0175", why: "The calculator was in degree mode. The rule (sin x)′ = cos x only holds in radians, because sin h ÷ h → 1 only for radians.", fix: "Calculus runs in radians. The slope of sin x at 0 is 1." }
  ],
  teach: {
    script: [
      "Draw one sine wave. Ask: where is it steepest going up? (x = 0.) Where is it flat? (the top). Where is it steepest going down? (x = π).",
      "Underneath, plot those slopes as dots: 1, 0, −1, 0, 1. Join them. Ask what wave that is. It is cosine.",
      "Do the same for cosine. From its peak it heads down, so the slope wave starts by going negative. That is −sin x.",
      "Switch to growth. Every exponential grows in proportion to its size. 2ˣ grows at 0.69 times its height, 3ˣ at 1.10 times. Ask where it is exactly 1 times.",
      "That base is e ≈ 2.718. So (eˣ)′ = eˣ, and every other base pays a multiple: (aˣ)′ = aˣ · ln a."
    ],
    board: "Two stacked axes from 0 to 2π. Sine on top, slope dots underneath. Leave the bottom blank and have Sebastian place the dots before you join them.",
    ask: [
      { q: "Without any formula: is the slope of cos x at x = 1 positive or negative?", listen: "“Negative, because cosine is falling between 0 and π.” If he reaches for the formula first, send him back to the picture." },
      { q: "Why isn’t (2ˣ)′ equal to x · 2ˣ⁻¹?", listen: "The x is in the exponent, not the base, so the power rule doesn’t apply." },
      { q: "Right now, which is bigger: 3ˣ or its slope? And for eˣ?", listen: "3ˣ’s slope is about 1.1 times its height. For eˣ they are equal." }
    ],
    confusion: "Students mix up which one gets the minus. Don’t drill “cos goes to −sin”. Ask “which way is it heading at 0?” Sine heads up from 0, and cosine heads down from its peak. The second slip is a calculator in degree mode, which makes every slope come out about 57 times too small."
  },
  recap: [
    "(sin x)′ = cos x and (cos x)′ = −sin x. Picture which way each wave heads just after 0.",
    "e ≈ 2.718 is the base whose slope equals its height, so (eˣ)′ = eˣ.",
    "Any other base pays a multiple: (aˣ)′ = aˣ · ln a. Always work in radians."
  ]
};
})();
