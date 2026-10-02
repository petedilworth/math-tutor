/* Full lessons: ln x and eˣ, exponential rates of change, motion, optimization. */
window.CP = window.CP || {};
(function () {
CP.LESSONS = CP.LESSONS || {};
const { fmt } = CP.W, PI = Math.PI, V = CP.V, E = Math.E, LN2 = Math.LN2, LN10 = Math.LN10;
const near = (a, b, tol) => Math.abs(a - b) <= tol;

/* ======================= ln x and eˣ ======================= */
CP.LESSONS.lnexp = {
  big: "ln x answers one question: what power of e gives x? So ln undoes eˣ, its graph is eˣ flipped in the line y = x, and it pulls an unknown down out of an exponent: e<sup>kt</sup> = A gives t = ln A ÷ k.",
  intro: [
    "Adding is undone by subtracting, and squaring by a square root. Raising e to a power is undone by ln, the natural logarithm. ln 7 means “the power of e that gives 7”. Since e<sup>1.946</sup> ≈ 7, ln 7 ≈ 1.946.",
    "This matters whenever the unknown sits up in an exponent: how long until money doubles, how old a bone is, when a drug fades to a safe level. You can’t divide or square-root your way to t in e<sup>0.05t</sup> = 2. Taking ln is the one move that brings t down to ground level."
  ],
  see: [
    {
      h: "ln x is eˣ in a mirror",
      text: "The teal curve is y = ln x. The grey curves are eˣ and the line y = x. Drag the dot along ln x. The height readout is ln x, and the last readout raises e to that height. Watch it give back x every time.",
      widget: { type: "tracer", f: x => Math.log(x), df: x => x > 0 ? 1 / x : NaN, x: [-1.5, 5], y: [-2.4, 1.72], dy: [-0.4, 2.6], x0: 4, ticks: 1,
        label: "y = ln x", ylabel: "ln x", dlabel: "slope of ln x", ghost: x => x > 0 ? 1 / x : NaN, ghostLabel: "1/x",
        extra: [{ f: x => Math.exp(x), cls: "s5 wghost" }, { f: x => x, cls: "s5 wghost" }],
        readouts: [{ label: "e<sup>height</sup>", value: s => isFinite(s.y) ? fmt(Math.exp(s.y), 3) : "none" }] },
      tasks: [
        { ask: "Drag to x = 1. What power of e gives 1?", check: s => near(s.x, 1, 0.06), got: "Height 0, because e⁰ = 1. So ln 1 = 0. The grey eˣ passes through (0, 1): the same point with x and y swapped." },
        { ask: "Find the x where ln x reaches height 1.", check: s => near(s.x, E, 0.06), got: "x ≈ 2.718, which is e. ln e = 1 because e¹ = e. The mirror point (1, e) sits on eˣ." },
        { ask: "Find where ln x has height −1.", check: s => near(s.y, -1, 0.08), got: "x ≈ 0.368, which is 1/e, because e<sup>−1</sup> = 1/e. Numbers between 0 and 1 have negative logs." },
        { ask: "Drag left of x = 0. What happens to ln x?", check: s => s.x < -0.1, got: "The curve stops and the height has no value. No power of e is zero or negative, so ln x exists only for x > 0." },
        { ask: "Bonus: drag to x = 2 and read the slope.", check: s => near(s.x, 2, 0.06), got: "Slope 0.5. The mirror point on eˣ is (0.693, 2), where eˣ has slope 2. A mirror swaps rise and run, so 2 becomes ½." },
        { ask: "Sweep, then press Show 1/x.", check: s => s.ghost && s.covered > 0.85, got: "Every slope lands on 1/x. That is (ln x)′ = 1/x, which you get for free from the mirror." }
      ],
      after: "ln and eˣ undo each other: ln(eˣ) = x and e<sup>ln x</sup> = x. Every point (a, b) on eˣ has a twin (b, a) on ln x. So ln 1 = 0, ln e = 1, ln 2 ≈ 0.693, and ln of zero or a negative number does not exist."
    },
    {
      h: "Solve e<sup>kx</sup> = 10 by reading across",
      text: "The grey line is height 10. For each k, slide along the curve until you hit the line. The x you land on solves e<sup>kx</sup> = 10. Keep an eye on the k · x readout.",
      widget: { type: "tracer", f: (x, k) => Math.exp(k * x), df: (x, k) => k * Math.exp(k * x), x: [0, 3], y: [0, 12.5], x0: 1, ticks: 0.5, panel2: false,
        label: "y = eᵏˣ", ylabel: "eᵏˣ", extra: [{ f: () => 10, cls: "s5 wghost" }],
        param: { name: "k", label: "k", min: 0.5, max: 2, step: 0.05, val: 1, show: v => fmt(v, 2) },
        readouts: [{ label: "k · x", value: s => fmt(s.p * s.x, 3) }] },
      tasks: [
        { ask: "k is 1, so this is plain eˣ. Drag along until the height is 10.", check: s => near(s.p, 1, 0.02) && near(s.x, LN10, 0.04), got: "x ≈ 2.303. So e<sup>2.303</sup> ≈ 10, which is what ln 10 ≈ 2.303 means." },
        { ask: "Set k to 2. Find height 10 again.", check: s => near(s.p, 2, 0.02) && near(s.x, LN10 / 2, 0.04), got: "x ≈ 1.151, half of 2.303. The curve climbs twice as fast, so it gets there in half the time. k · x still reads about 2.303." },
        { ask: "Set k to 0.8 and find height 10 once more.", check: s => near(s.p, 0.8, 0.02) && near(s.x, LN10 / 0.8, 0.04), got: "x ≈ 2.878, and 2.303 ÷ 0.8 = 2.878. Every time, k · x = ln 10." }
      ],
      after: "To hit 10 you always need kx = ln 10. That is the whole method: take ln of both sides to get kx = ln 10, then divide by k. In general, e<sup>kt</sup> = A gives t = ln A ÷ k."
    }
  ],
  why: {
    lead: "Everything here follows from one definition: ln y is the power you put on e to get y. Read the exponent laws through that definition and the log laws fall out.",
    steps: [
      ["y = eˣ means the same as x = ln y", "The definition. ln reads the graph of eˣ backwards: from height to x."],
      ["ln(eˣ) = x", "Which power of e gives eˣ? The power x."],
      ["e<sup>ln y</sup> = y", "ln y is the power of e that gives y. Raise e to it and you get y."],
      ["(a, b) on y = eˣ  ↔  (b, a) on y = ln x", "Swapping input and output reflects the graph in the line y = x."],
      ["M = eᵃ, N = eᵇ  ⇒  MN = e<sup>a+b</sup>  ⇒  ln(MN) = ln M + ln N", "Multiplying powers adds exponents, so ln turns products into sums."],
      ["Mⁿ = e<sup>na</sup>  ⇒  ln(Mⁿ) = n ln M", "A power of a power multiplies exponents, so a power inside ln comes out in front."],
      ["e<sup>kt</sup> = A  ⇒  ln(e<sup>kt</sup>) = ln A", "To solve, take ln of both sides."],
      ["kt = ln A, so t = ln A ÷ k", "ln(e<sup>kt</sup>) = kt. Divide by k."]
    ],
    end: "There is no law for ln(M + N), because adding numbers has no matching exponent law. ln x needs x > 0, since eˣ is never zero or negative. The mirror also gives the slope: at height y, eˣ has slope y. Its twin point on ln x has run and rise swapped, so slope 1 ÷ y. That is why (ln x)′ = 1/x."
  },
  examples: [
    { q: "Simplify e<sup>2 ln 5</sup>.",
      steps: [["2 ln 5 = ln 5² = ln 25", "A number in front of ln moves inside as a power."], ["e<sup>ln 25</sup> = 25", "e and ln undo each other."]],
      a: "25" },
    { q: "Solve e<sup>3x</sup> = 20.",
      steps: [["ln(e<sup>3x</sup>) = ln 20", "Take ln of both sides."], ["3x = ln 20 ≈ 2.9957", "ln undoes e, leaving the exponent."], ["x ≈ 2.9957 ÷ 3 ≈ 0.9986", "Divide by 3."], ["Check: e<sup>3 × 0.9986</sup> = e<sup>2.9957</sup> ≈ 20", "Put it back to be sure."]],
      a: "x ≈ 0.999" },
    { q: "Solve 4e<sup>2x</sup> + 3 = 43.",
      steps: [["4e<sup>2x</sup> = 40", "Subtract 3. Get the exponential alone before you take ln."], ["e<sup>2x</sup> = 10", "Divide by 4."], ["2x = ln 10 ≈ 2.3026", "Now take ln of both sides."], ["x ≈ 2.3026 ÷ 2 ≈ 1.1513", "Divide by 2."]],
      a: "x ≈ 1.151" }
  ],
  mistakes: [
    { wrong: "e<sup>2x</sup> = 10, so x = 10 ÷ 2 = 5", why: "That treats e<sup>2x</sup> as if it were 2x. The x is stuck up in the exponent, and only ln brings it down.", fix: "2x = ln 10 ≈ 2.303, so x ≈ 1.151." },
    { wrong: "ln(5 + 3) = ln 5 + ln 3", why: "ln turns products into sums, not sums into sums. ln 8 ≈ 2.079, but ln 5 + ln 3 = ln 15 ≈ 2.708.", fix: "ln(ab) = ln a + ln b. ln(a + b) does not split." },
    { wrong: "4e<sup>2x</sup> + 3 = 43, so ln 4 + 2x + ln 3 = ln 43", why: "ln can’t be taken term by term across a sum. Taking ln too early makes a mess that won’t simplify.", fix: "Isolate first: 4e<sup>2x</sup> = 40, so e<sup>2x</sup> = 10. Then take ln." },
    { wrong: "eˣ = 50, so x = log 50 ≈ 1.699", why: "The calculator’s log key is base 10. It undoes 10ˣ, not eˣ.", fix: "Use the ln key: x = ln 50 ≈ 3.912." }
  ],
  teach: {
    script: [
      "Ask: what undoes squaring? (square root.) What undoes multiplying by 5? (dividing by 5.) Today: what undoes raising e to a power?",
      "Define it in words: ln 7 is the power of e that gives 7. Ask him to guess. e² ≈ 7.4, so ln 7 is a bit under 2. It is 1.946.",
      "Draw eˣ and the line y = x. Swap every point (a, b) to (b, a). The new curve is ln x. Read off ln 1 = 0 and ln e = 1.",
      "Write e<sup>3x</sup> = 20. Ask how to get x down. Take ln of both sides: 3x = ln 20. Divide by 3.",
      "Last, the order of moves: get eᵏˣ alone first (undo + and ×), then take ln, then divide by k."
    ],
    board: "Draw eˣ, the line y = x and ln x on one set of axes with equal scales. Mark (0, 1) and (1, 0), and (1, e) and (e, 1), joined by dashed lines across y = x.",
    ask: [
      { q: "Without a calculator: is ln 20 bigger or smaller than 3?", listen: "“Smaller, because e³ ≈ 20.1, which is just over 20.” If he says “bigger”, ask what e³ is first." },
      { q: "Why can’t you take ln of −4?", listen: "“No power of e is negative.” If he says “the calculator says error”, push for the reason: eˣ is always positive." },
      { q: "To solve 2e<sup>x</sup> − 1 = 9, what is your first move?", listen: "“Add 1, then divide by 2, to get eˣ = 5 alone.” If he takes ln straight away, have him try it and see it go nowhere." }
    ],
    confusion: "The big one is taking ln too early, before the exponential is alone. Have him circle e<sup>(…)</sup> and clear everything else off its side first. The second is the calculator: log means base 10, ln means base e. A quick check catches both: put the answer back into the original equation."
  },
  recap: [
    "ln x is the power of e that gives x. So ln(eˣ) = x and e<sup>ln x</sup> = x, and ln x exists only for x > 0.",
    "ln turns products into sums and powers into multipliers. ln(a + b) does not split.",
    "To solve e<sup>kt</sup> = A: isolate the exponential, take ln, divide by k. t = ln A ÷ k."
  ]
};

/* ======================= exponential rates of change ======================= */
CP.LESSONS.exprate = {
  big: "An exponential grows in proportion to its own size: if P = Ae<sup>kt</sup> then P′ = kP. Double the amount and you double the rate. And it always takes ln 2 ÷ k to double.",
  intro: [
    "Most things that grow by themselves (money earning interest, bacteria, a population) grow faster the bigger they get. $10,000 earns more interest than $1000 at the same rate. That is the signature of an exponential.",
    "Calculus makes it exact. For P(t) = Ae<sup>kt</sup>, the rate of growth P′(t) is always k times the amount P(t). So k is a rate per unit, like 5% a year, and the real rate depends on how much is there now. One more fact falls out: the doubling time is the same at every stage."
  ],
  see: [
    {
      h: "The rate is k times the amount",
      text: "This is P = 100e<sup>0.1x</sup>, where x counts years and k = 0.1. Drag along it. The lower panel collects the slopes. Watch the last readout, slope ÷ height.",
      widget: { type: "tracer", f: x => 100 * Math.exp(0.1 * x), df: x => 10 * Math.exp(0.1 * x), x: [0, 24], y: [0, 1150], dy: [0, 140], x0: 3, ticks: 4,
        label: "P = 100e^(0.1x)", ylabel: "amount P", mlabel: "slope P′", dlabel: "slope P′", ghost: x => 10 * Math.exp(0.1 * x), ghostLabel: "0.1 × P",
        readouts: [{ label: "slope ÷ height", value: s => fmt(s.m / s.y, 4) }] },
      tasks: [
        { ask: "Drag to x = 0, the start. Read the amount and the slope.", check: s => s.x < 0.25, got: "Amount 100, slope 10. It grows at 10 a year, which is 0.1 × 100." },
        { ask: "Find where the amount has doubled to 200.", check: s => near(s.y, 200, 5), got: "x ≈ 6.93 and the slope is now about 20. Double the amount, double the rate. Slope ÷ height is still 0.1." },
        { ask: "Find where it reaches 400.", check: s => near(s.y, 400, 8), got: "x ≈ 13.86, another 6.93 years, and the slope is about 40. Each doubling takes the same time." },
        { ask: "Sweep, then press Show 0.1 × P.", check: s => s.ghost && s.covered > 0.85, got: "The slope curve is the curve itself, shrunk to 0.1 of its height. P′ = 0.1 P everywhere." }
      ],
      after: "Slope ÷ height never moved from 0.1. That is the rule: P′(t) = kP(t). It also explains the steady doubling time: it always takes the same time to grow by the same factor."
    },
    {
      h: "Choose k, read the doubling time",
      text: "Now you set k. The grey lines mark 50 (half the start), 200 (double) and 400 (double again). The doubling time is ln 2 ÷ k ≈ 0.693 ÷ k. Find the k values that give round answers.",
      widget: { type: "tracer", f: (x, k) => 100 * Math.exp(k * x), df: (x, k) => 100 * k * Math.exp(k * x), x: [0, 30], y: [0, 820], x0: 10, ticks: 5, panel2: false,
        label: "P = 100eᵏˣ", ylabel: "amount P", extra: [{ f: () => 50, cls: "s5 wghost" }, { f: () => 200, cls: "s5 wghost" }, { f: () => 400, cls: "s5 wghost" }],
        param: { name: "k", label: "k", min: -0.1, max: 0.2, step: 0.005, val: 0.05, show: v => fmt(v, 3) },
        readouts: [{ label: "slope ÷ height", value: s => fmt(s.m / s.y, 4) },
          { label: "doubling time", value: s => s.p > 1e-9 ? fmt(LN2 / s.p, 2) : "never" },
          { label: "half-life", value: s => s.p < -1e-9 ? fmt(LN2 / -s.p, 2) : "never" }] },
      tasks: [
        { ask: "Move k until the amount doubles about every 10 years.", check: s => s.p > 0 && near(LN2 / s.p, 10, 0.4), got: "k = 0.07 gives 9.9 years: 0.693 ÷ 0.07 = 9.9. Money growing at 7% doubles in about 10 years." },
        { ask: "Now make it double about every 35 years.", check: s => s.p > 0 && near(LN2 / s.p, 35, 1), got: "k = 0.02 gives 34.66 years. Notice 70 ÷ 7 = 10 and 70 ÷ 2 = 35. That is the rule of 70." },
        { ask: "Make k negative: set it to −0.05.", check: s => near(s.p, -0.05, 0.003), got: "Slope ÷ height reads −0.05. The amount shrinks by 5% of itself a year, and halves every 13.86 years." }
      ],
      after: "Doubling time = ln 2 ÷ k. With k as a percentage, that is about 69.3 ÷ rate, rounded to the rule of 70. A negative k means decay, and the same formula with −k gives the half-life."
    }
  ],
  why: {
    lead: "The rule is the chain rule applied to e<sup>kt</sup>. A rewrite with ln then handles any other base.",
    steps: [
      ["P(t) = Ae<sup>kt</sup>", "Start with any exponential in base e."],
      ["P′(t) = A · e<sup>kt</sup> · k", "Chain rule: (e<sup>u</sup>)′ = e<sup>u</sup> · u′, and the inside u = kt has slope k."],
      ["P′(t) = k · Ae<sup>kt</sup> = k · P(t)", "Regroup. The derivative is k times the original."],
      ["Ae<sup>kT</sup> = 2A  ⇒  e<sup>kT</sup> = 2", "When is P double its start? Divide both sides by A."],
      ["kT = ln 2, so T = ln 2 ÷ k ≈ 0.693 ÷ k", "Take ln. A never appears, so the doubling time is the same from any start."],
      ["bᵗ = e<sup>t ln b</sup>", "Any base can be written with e, because e<sup>ln b</sup> = b."],
      ["(Abᵗ)′ = Ae<sup>t ln b</sup> · ln b = ln b · P(t)", "The same rule, with k = ln b."]
    ],
    end: "The rule of 70: if k = r%, then T = 0.693 ÷ (r ÷ 100) = 69.3 ÷ r ≈ 70 ÷ r. Some people use 72 instead, because 72 divides evenly by 2, 3, 4, 6, 8 and 9."
  },
  examples: [
    { q: "Find P′(t) for P(t) = 5e<sup>−3t</sup>.",
      steps: [["(e<sup>−3t</sup>)′ = −3e<sup>−3t</sup>", "The derivative of e<sup>kt</sup> is ke<sup>kt</sup>. Here k = −3."], ["P′(t) = 5 × (−3e<sup>−3t</sup>) = −15e<sup>−3t</sup>", "The 5 rides along."]],
      a: "P′(t) = −15e<sup>−3t</sup>, which is −3 × P(t)" },
    { q: "P(t) = 2 · 3ᵗ. How fast is P growing at t = 2?",
      steps: [["P′(t) = 2 · 3ᵗ · ln 3", "Base 3, not e, so multiply by ln 3."], ["P′(2) = 2 · 3² · ln 3 = 18 ln 3", "Substitute t = 2."], ["18 × 1.0986 ≈ 19.78", "ln 3 ≈ 1.0986."]],
      a: "about 19.78 per unit of time" },
    { q: "P(t) = 2000e<sup>0.05t</sup>, t in years. How fast is P growing when P = 5000, and when does that happen?",
      steps: [["P′(t) = 0.05 · P(t)", "The rate is k times the amount."], ["P′ = 0.05 × 5000 = 250", "Use the amount now, not the starting 2000. No need to find t for this part."], ["2000e<sup>0.05t</sup> = 5000  ⇒  e<sup>0.05t</sup> = 2.5", "For the time, divide by 2000."], ["0.05t = ln 2.5 ≈ 0.9163", "Take ln of both sides."], ["t ≈ 0.9163 ÷ 0.05 ≈ 18.33", "Divide by 0.05."]],
      a: "250 a year, after about 18.3 years" }
  ],
  mistakes: [
    { wrong: "(5e<sup>−3t</sup>)′ = 5e<sup>−3t</sup>", why: "Only plain eᵗ copies itself. The exponent −3t has slope −3, and the chain rule multiplies by it.", fix: "(5e<sup>−3t</sup>)′ = −15e<sup>−3t</sup>" },
    { wrong: "(3ᵗ)′ = t · 3<sup>t−1</sup>", why: "That is the power rule, which needs the variable in the base. Here t is the exponent.", fix: "(3ᵗ)′ = 3ᵗ · ln 3" },
    { wrong: "P = 2000e<sup>0.05t</sup>. When P = 5000, P′ = 0.05 × 2000 = 100.", why: "2000 is the starting amount. The rate uses the amount at that moment.", fix: "P′ = 0.05 × 5000 = 250 a year." },
    { wrong: "Doubling time = 2 ÷ k, so 2 ÷ 0.05 = 40 years", why: "Doubling means e<sup>kT</sup> = 2. ln undoes e, so kT = ln 2, not 2.", fix: "T = ln 2 ÷ k = 0.693 ÷ 0.05 ≈ 13.9 years." }
  ],
  teach: {
    script: [
      "Ask: which earns more interest in a year at 5%, $1000 or $10,000? The bigger one, ten times more. The growth rate depends on the amount.",
      "Differentiate P = Ae<sup>kt</sup> together with the chain rule: P′ = kAe<sup>kt</sup>. Circle Ae<sup>kt</sup> and write P. So P′ = kP.",
      "Say it in words: k is the growth per dollar. Multiply by the dollars you have now to get dollars per year.",
      "Ask how long to double. Set e<sup>kT</sup> = 2 and solve: T = ln 2 ÷ k. Point out that A has vanished.",
      "Finish with the rule of 70: at 7% money doubles in about 10 years, at 2% in about 35."
    ],
    board: "Draw one exponential curve. Mark heights 100, 200 and 400, and the tangent at each. Label the slopes 10, 20 and 40, and the equal gaps of 6.93 between them on the time axis.",
    ask: [
      { q: "P = 500e<sup>0.04t</sup>. How fast is it growing at the moment P = 800?", listen: "“0.04 × 800 = 32 per year.” If he starts solving for t, ask whether he needs it. The rate only depends on the amount now." },
      { q: "A population doubles every 20 years. What is k?", listen: "“ln 2 ÷ 20 ≈ 0.0347.” If he says 0.05 or 0.1, have him check by working the doubling time back out." },
      { q: "What does a negative k mean?", listen: "“Decay: it shrinks, and faster when there is more of it.” The rate is negative and proportional to the amount." }
    ],
    confusion: "Students mix up k, P and P′. k is a fixed rate per unit (like 0.05 per year). P is how much there is. P′ is how fast it is changing, in units per year. Have him say the units out loud: P′ in dollars a year equals k in “per year” times P in dollars. The other slip is forgetting the k from the chain rule."
  },
  recap: [
    "P = Ae<sup>kt</sup> gives P′ = kP: the rate is k times the amount right now.",
    "For base b: (bᵗ)′ = bᵗ · ln b. Only base e has nothing extra.",
    "Doubling time = ln 2 ÷ k ≈ 70 ÷ (rate in %). Negative k is decay, with half-life ln 2 ÷ |k|."
  ]
};

/* ======================= motion ======================= */
CP.LESSONS.motion = {
  big: "Velocity is how fast position changes, so v = s′. Acceleration is how fast velocity changes, so a = v′ = s″. At rest means v = 0, and speed rises when v and a have the same sign.",
  intro: [
    "A car’s odometer tells you where it is, its speedometer tells you how fast that is changing, and your stomach feels how fast the speed is changing. Those are position, velocity and acceleration. Each is the rate of change of the one before, so each is the derivative of the one before.",
    "In this step, s(t) is position along a line, and its sign says which side of the start you are on. v(t) has a sign too: positive means moving forward, negative means moving back. Speed is the size of v, with the sign dropped."
  ],
  see: [
    {
      h: "A ball thrown straight up",
      text: "You throw a ball up at 20 m/s. Its height is s = 20t − 4.9t² metres, shown on the track turned on its side. Below are s, v and a. Press Play, or drag across the graphs.",
      widget: { type: "motion", s: t => 20 * t - 4.9 * t * t, v: t => 20 - 9.8 * t, a: () => -9.8, t: [0, 20 / 4.9], t0: 0.5, vr: [-22, 30], ar: [-12, 2], trackLabel: "height (m), turned on its side" },
      tasks: [
        { ask: "Find the top of the flight.", check: s => Math.abs(s.v) < 0.15, got: "t ≈ 2.04 s, height ≈ 20.41 m. Velocity is 0: the ball is at rest for an instant. But acceleration is still −9.8." },
        { ask: "Find a moment when the ball’s speed is rising.", check: s => s.speeding, got: "Any time after the top. v is negative (falling) and a = −9.8 is negative too. Same sign, so it speeds up." },
        { ask: "Drag to the moment the ball lands back in your hand.", check: s => s.t > 4.04, got: "Height 0 and velocity about −20 m/s. Height 0 is not at rest: the ball is moving as fast as when you threw it." }
      ],
      after: "Acceleration is −9.8 the whole time, even at the top. On the way up, v > 0 and a < 0, so the ball slows. On the way down both are negative, so it speeds up. At rest means v = 0, which happens at the top, not when s = 0."
    },
    {
      h: "Forward, stop, back, stop, forward",
      text: "A particle moves along a line with s(t) = t³ − 9t² + 24t metres. Play it and watch it reverse twice. Then use the readouts to find the key moments.",
      widget: { type: "motion", s: t => t * t * t - 9 * t * t + 24 * t, v: t => 3 * t * t - 18 * t + 24, a: t => 6 * t - 18, t: [0, 5], t0: 0, vr: [-8, 34], trackLabel: "position (m)" },
      tasks: [
        { ask: "Find the first moment it stops.", check: s => near(s.t, 2, 0.05), got: "t = 2 s, at 20 m. v(2) = 3(4) − 36 + 24 = 0." },
        { ask: "Find a moment when it moves backward and speeds up.", check: s => s.v < 0 && s.speeding, got: "Anywhere between t = 2 and t = 3. v < 0 and a < 0: same sign, so the speed grows." },
        { ask: "Find when the acceleration is zero.", check: s => near(s.t, 3, 0.05), got: "t = 3 s. Here v = −3 m/s, the fastest it ever goes backward. After this, a > 0 pushes against the motion." },
        { ask: "Find the second stop.", check: s => near(s.t, 4, 0.05), got: "t = 4 s, at 16 m. It backed up 4 m between the two stops." }
      ],
      after: "v(t) = 3t² − 18t + 24 = 3(t − 2)(t − 4), so it stops at t = 2 and t = 4, and moves backward in between. a(t) = 6t − 18 is zero at t = 3, where the backward speed peaks."
    }
  ],
  why: {
    lead: "A derivative is a rate of change. Velocity is the rate of change of position, and acceleration is the rate of change of velocity. So both come from the same limit.",
    steps: [
      ["average velocity = [s(t + h) − s(t)] ÷ h", "Distance moved over a short time h, divided by that time."],
      ["v(t) = lim<sub>h→0</sub> [s(t + h) − s(t)] ÷ h = s′(t)", "Shrink h to get the velocity at one instant. That limit is the derivative."],
      ["a(t) = lim<sub>h→0</sub> [v(t + h) − v(t)] ÷ h = v′(t) = s″(t)", "The same idea one level up."],
      ["s = 20t − 4.9t²  ⇒  v = 20 − 9.8t  ⇒  a = −9.8", "For the ball: the power rule twice. Up is positive, and gravity pulls down at about 9.8 m/s²."],
      ["v = 0  ⇒  t = 20 ÷ 9.8 ≈ 2.04 s", "At the top the ball has stopped rising and not yet started to fall."],
      ["speed = |v|", "Speed is velocity with the direction dropped."],
      ["v, a same sign ⇒ speeding up. Opposite signs ⇒ slowing down.", "If a pushes the same way the object moves, |v| grows. If it pushes against the motion, |v| shrinks."]
    ],
    end: "Going the other way, from a to v to s, means undoing a derivative. The picture shows the link too: v(t) is the slope of the s graph, so v = 0 exactly where the s graph is flat."
  },
  examples: [
    { q: "s(t) = 3t² − 4t + 2. Find the velocity at t = 2.",
      steps: [["v(t) = s′(t) = 6t − 4", "Power rule on each term. The constant 2 disappears."], ["v(2) = 6(2) − 4 = 8", "Substitute t = 2."]],
      a: "v(2) = 8 m/s" },
    { q: "s(t) = t³ − 6t² + 5t. Find the acceleration at t = 3.",
      steps: [["v(t) = 3t² − 12t + 5", "Differentiate once for velocity."], ["a(t) = 6t − 12", "Differentiate again for acceleration."], ["a(3) = 18 − 12 = 6", "Substitute t = 3."]],
      a: "a(3) = 6 m/s²" },
    { q: "s(t) = t³ − 9t² + 15t. When is the object at rest, and where is it then?",
      steps: [["v(t) = 3t² − 18t + 15", "At rest means v = 0, so find v first."], ["3t² − 18t + 15 = 3(t² − 6t + 5)", "Take out the common factor 3."], ["= 3(t − 1)(t − 5)", "Factor the quadratic."], ["t = 1 or t = 5", "Set each factor to 0."], ["s(1) = 1 − 9 + 15 = 7,  s(5) = 125 − 225 + 75 = −25", "Put the times back into s to find where."]],
      a: "At rest at t = 1 (at 7 m) and t = 5 (at −25 m)" }
  ],
  mistakes: [
    { wrong: "At rest when s(t) = 0", why: "s = 0 means back at the starting point, which can happen at full speed. The ball lands at s = 0 doing 20 m/s.", fix: "At rest means v(t) = s′(t) = 0." },
    { wrong: "Negative acceleration means slowing down", why: "Only when v is positive. The falling ball has a = −9.8 and speeds up, because v is negative too.", fix: "Compare signs. Same sign: speeding up. Opposite signs: slowing down." },
    { wrong: "s(t) = 3t² − 4t + 2, so v(2) = s(2) = 6", why: "That is the position at t = 2, not how fast it is changing.", fix: "Differentiate first: v(t) = 6t − 4, so v(2) = 8." },
    { wrong: "The ball’s speed at landing is −20 m/s", why: "Speed has no direction, so it is never negative. The minus sign belongs to the velocity and says “downward”.", fix: "Velocity −20 m/s, speed 20 m/s." }
  ],
  teach: {
    script: [
      "Toss something straight up and catch it. Ask: when is it stopped? (at the top.) Is it stopped when it is back in your hand? (no, it is moving fast.)",
      "Write s = 20t − 4.9t². Differentiate: v = 20 − 9.8t. Again: a = −9.8. Say “each line is the rate of change of the line above”.",
      "Find the top by setting v = 0: t ≈ 2.04 s. Put it back in s to find the height, about 20.4 m.",
      "Ask: at the top, is the acceleration zero? No: −9.8. Gravity never switches off. v is zero for an instant only.",
      "Finish with the sign rule: same signs, speeding up; opposite signs, slowing down. Check it on the way up and the way down."
    ],
    board: "Three stacked graphs on one time axis: s (a hill), v (a falling line through zero at the top), a (a flat line at −9.8). Draw a vertical dashed line through the top of the hill and show it crosses v at 0.",
    ask: [
      { q: "A car has v = 12 and a = −3. Is it speeding up or slowing down?", listen: "“Slowing down: the signs are opposite.” If he says “speeding up because a is 3”, ask which way a pushes compared to the motion." },
      { q: "If s(4) = 0, is the object at rest at t = 4?", listen: "“Not necessarily. That only says it is back at the start. Check v(4).”" },
      { q: "Where on the s graph is the object at rest?", listen: "“Where the graph is flat, at the top or bottom of a hump.” That is where the slope, v, is zero." }
    ],
    confusion: "Students mix up position, velocity and speed: they set s = 0 for “at rest”, and they think a negative a always means braking. Keep asking two questions: “which way is it moving?” (the sign of v) and “is a pushing with it or against it?” (compare the signs). For questions about speed, take the size of v and drop its sign."
  },
  recap: [
    "v = s′ and a = v′ = s″. Each one is the rate of change of the one before.",
    "At rest means v = 0, not s = 0.",
    "v and a with the same sign: speeding up. Opposite signs: slowing down."
  ]
};

/* ======================= optimization ======================= */
const boxV = x => x * (24 - 2 * x) * (24 - 2 * x);
const boxDV = x => (24 - 2 * x) * (24 - 6 * x);
const r1 = v => v.toFixed(1);
function boxDraw(x) {
  const sc = 3.4, S = 24 * sc, c = x * sc, ox = 0, oy = 14, inner = S - 2 * c;
  const rect = (X, Y, w, h, cls) => '<rect x="' + r1(X) + '" y="' + r1(Y) + '" width="' + r1(Math.max(0, w)) + '" height="' + r1(Math.max(0, h)) + '" class="' + cls + '"/>';
  /* the flat sheet: base, four flaps, four corner squares cut away */
  let g = rect(ox + c, oy + c, inner, inner, "wa0");
  g += rect(ox + c, oy, inner, c, "wa1") + rect(ox + c, oy + S - c, inner, c, "wa1") + rect(ox, oy + c, c, inner, "wa1") + rect(ox + S - c, oy + c, c, inner, "wa1");
  for (const [X, Y] of [[ox, oy], [ox + S - c, oy], [ox, oy + S - c], [ox + S - c, oy + S - c]]) g += rect(X, Y, c, c, "wa2");
  g += '<text x="' + r1(ox + S / 2) + '" y="' + r1(oy + S + 12) + '" class="wlab sm" text-anchor="middle">24 cm sheet</text>';
  if (c > 3) g += '<text x="' + r1(ox + c / 2) + '" y="' + r1(oy - 2) + '" class="wlab sm" text-anchor="middle">x</text>';
  /* the folded box, at the same scale */
  const k = sc, b = (24 - 2 * x) * k, H = x * k, X0 = 94, Yb = 110, dx = 0.3 * b, dy = -0.2 * b;
  const P = pts => '<polygon points="' + pts.map(p => r1(p[0]) + "," + r1(p[1])).join(" ") + '" class="';
  g += P([[X0, Yb - H], [X0 + b, Yb - H], [X0 + b + dx, Yb - H + dy], [X0 + dx, Yb - H + dy]]) + 'wa3"/>';
  g += P([[X0 + b, Yb], [X0 + b + dx, Yb + dy], [X0 + b + dx, Yb + dy - H], [X0 + b, Yb - H]]) + 'wa1"/>';
  g += rect(X0, Yb - H, b, H, "wa0");
  g += '<text x="' + r1(X0 + b / 2) + '" y="' + r1(Yb + 12) + '" class="wlab sm" text-anchor="middle">24 − 2x</text>';
  if (H > 8) g += '<text x="' + r1(X0 - 3) + '" y="' + r1(Yb - H / 2 + 3) + '" class="wlab sm" text-anchor="end">x</text>';
  return g;
}

CP.LESSONS.optim = {
  big: "To find the best value, write the quantity as a function of one variable. At the best point inside the range its graph is flat, so solve Q′ = 0. Then check the ends, and answer the question that was asked.",
  intro: [
    "Optimization means finding the best: the biggest box, the cheapest design, the most profit. There is always a trade-off. Cut bigger squares from a sheet and the box gets taller but its base shrinks. Somewhere between is a best choice.",
    "Calculus finds it without guessing. Graph the quantity against your choice. The best value sits at the top of a hill (or the bottom of a valley), where the graph is flat and the derivative is 0. Most of the work is the setup: turning the words into one function of one variable."
  ],
  see: [
    {
      h: "The biggest box from a sheet",
      text: "Cut a square of side x from each corner of a 24 cm square sheet (orange). Fold up the flaps (purple) to make an open box. Move the slider and watch the box and its volume. The dashed line marks the best volume so far.",
      widget: { type: "optim", x: [0, 12], x0: 2, step: 0.05, obj: boxV, draw: boxDraw, objLabel: "volume (cm³)", xLabel: "cut x (cm)", y: [0, 1150], fmtVal: v => fmt(v, 0) + " cm³" },
      tasks: [
        { ask: "Make the cut tiny: x below 0.3 cm.", check: s => s.x < 0.3, got: "A flat tray. Lots of base, but almost no height, so almost no volume." },
        { ask: "Now make it huge: x above 10 cm.", check: s => s.x > 10, got: "A tall, thin chimney. At x = 10 the base is only 4 by 4, so V = 160 cm³. At x = 12 nothing is left." },
        { ask: "The best box is somewhere between. Find it.", check: s => s.atBest, got: "x = 4 cm gives 1024 cm³: a box 16 by 16 by 4." },
        { ask: "Move 1 cm away from the best, to x = 3 or x = 5.", check: s => near(s.x, 3, 0.06) || near(s.x, 5, 0.06), got: "972 or 980 cm³. You lose only about 50. Near the peak the graph is almost flat." }
      ],
      after: "The volume rises, peaks at x = 4, then falls back to 0 at x = 12. Both ends give no box at all. Near the peak, the graph is nearly flat: the next picture shows that its slope there is exactly 0."
    },
    {
      h: "At the peak the slope is 0",
      text: "Here is the same volume as a formula, V = x(24 − 2x)², with its slope V′(x) in the lower panel. Drag along it and watch the sign of the slope.",
      widget: { type: "tracer", f: boxV, df: boxDV, x: [0, 12], y: [-50, 1150], dy: [-250, 650], x0: 0.5, ticks: 2,
        label: "V = x(24 − 2x)²", ylabel: "V", mlabel: "slope V′", dlabel: "slope V′(x)" },
      tasks: [
        { ask: "Drag to anywhere between x = 1 and x = 3.", check: s => s.x > 1 && s.x < 3, got: "The slope is positive (396 at x = 1, 108 at x = 3). A bigger cut still adds volume, but the gain is shrinking." },
        { ask: "Now drag to between x = 5 and x = 8.", check: s => s.x > 5 && s.x < 8, got: "The slope is negative. A bigger cut now loses volume." },
        { ask: "The slope went from positive to negative. Find where it is 0.", check: s => near(s.x, 4, 0.1), got: "x = 4, the top of the hill, the same x the box hunt found. V′(4) = 0 and the tangent is flat." },
        { ask: "Drag to x = 12, the far end, and read the slope.", check: s => s.x > 11.9, got: "The slope shrinks to 0 at x = 12, but V = 0 there. V′ = 0 finds the lowest point too, so check which is the max." }
      ],
      after: "V′(x) = (24 − 2x)(24 − 6x) is 0 at x = 4 and x = 12. Only x = 4 is the peak. The max sits where the slope changes from positive to negative, so solve V′ = 0, then test each answer and the ends."
    }
  ],
  why: {
    lead: "Why is the slope 0 at the best point? Picture the graph of the quantity Q against x. At a peak inside the range, the graph rises up to it and falls after it.",
    steps: [
      ["Left of the peak: Q′(x) > 0", "The graph is rising: a bigger x still helps."],
      ["Right of the peak: Q′(x) < 0", "The graph is falling: a bigger x now hurts."],
      ["At the peak: Q′(x) = 0", "A smooth slope that goes from positive to negative must pass through 0. The tangent there is flat."],
      ["Ends of the range: x = a and x = b", "The best value can also sit at an end, where the graph just stops. Q′ = 0 does not find ends, so test them."],
      ["Compare Q(a), Q(b) and Q at each critical x", "The biggest is the max. The smallest is the min."],
      ["Box: V = x(24 − 2x)², 0 ≤ x ≤ 12", "Height x, base 24 − 2x by 24 − 2x. The cut can’t pass half the sheet."],
      ["V′ = (24 − 2x)² − 4x(24 − 2x) = (24 − 2x)(24 − 6x)", "Product rule, then take out the common factor 24 − 2x."],
      ["V′ = 0 at x = 4 or x = 12. V(0) = 0, V(4) = 1024, V(12) = 0.", "Compare the candidates. The max is 1024 cm³ at x = 4."]
    ],
    end: "Why one variable? A function of two unknowns has no single graph to climb. The constraint (here, the sheet is 24 cm) links them, so you can substitute until only one is left. You can also confirm a max with the sign of Q′ on each side, or with Q″ < 0."
  },
  examples: [
    { q: "Two positive numbers add to 30. What is the largest their product can be?",
      steps: [["y = 30 − x", "Use the constraint to write y in terms of x."], ["P(x) = x(30 − x) = 30x − x²", "The product as a function of one variable."], ["P′(x) = 30 − 2x = 0  ⇒  x = 15", "Set the derivative to 0."], ["y = 15,  P = 15 × 15 = 225", "Find the other number, then the product it asks for."]],
      a: "225" },
    { q: "A rectangle beside a river is fenced on three sides with 120 m of fence. What is the largest area?",
      steps: [["2x + y = 120", "x is each side at right angles to the river, y is the side along it. The river side needs no fence."], ["A(x) = x(120 − 2x) = 120x − 2x²", "Substitute y = 120 − 2x into A = xy."], ["A′(x) = 120 − 4x = 0  ⇒  x = 30", "Set the derivative to 0."], ["Ends: A(0) = 0 and A(60) = 0", "Check the ends of 0 ≤ x ≤ 60. Both give no area, so x = 30 is the max."], ["y = 60,  A = 30 × 60 = 1800", "Answer the question: the area."]],
      a: "1800 m² (30 m by 60 m)" },
    { q: "Squares of side x are cut from the corners of an 18 cm square sheet, and the sides folded up. Find the largest volume.",
      steps: [["V(x) = x(18 − 2x)², 0 ≤ x ≤ 9", "Height x, base (18 − 2x) by (18 − 2x)."], ["V′(x) = (18 − 2x)² − 4x(18 − 2x)", "Product rule. The chain rule gives 2(18 − 2x)(−2) = −4(18 − 2x)."], ["V′(x) = (18 − 2x)(18 − 6x)", "Take out the common factor 18 − 2x."], ["V′ = 0 at x = 9 or x = 3", "Set each factor to 0."], ["V(0) = 0, V(9) = 0, V(3) = 3 × 12² = 432", "Test the candidates and the ends."]],
      a: "432 cm³, with x = 3 cm" }
  ],
  mistakes: [
    { wrong: "The largest area is 30", why: "30 m is the width that gives the largest area. The question asked for the area itself.", fix: "A = 30 × 60 = 1800 m². Reread the question before you write the answer." },
    { wrong: "V′ = 0 at x = 4 and x = 12, so the box is biggest at x = 12", why: "At x = 12 nothing is left to fold, so V = 0. V′ = 0 finds valleys and ends as well as peaks.", fix: "Put every candidate and each end into V. x = 4 gives 1024 cm³, the max." },
    { wrong: "A = xy, so A′ = y", why: "y is not a constant. It depends on x through the fence length, so you can’t differentiate yet.", fix: "Substitute first: y = 120 − 2x, so A = 120x − 2x² and A′ = 120 − 4x." },
    { wrong: "Fence by the river: 2x + 2y = 120", why: "That fences all four sides. The river is the fourth side.", fix: "Three sides: 2x + y = 120." }
  ],
  teach: {
    script: [
      "Hand him a sheet of paper. Ask: if I cut squares from the corners and fold, what size cut makes the biggest box? Let him guess.",
      "Try the extremes: a tiny cut gives a flat tray, a huge cut gives a thin chimney. Both hold almost nothing, so the best is in between.",
      "Name the variable (x, the cut). Write the volume: V = x(24 − 2x)². Point out that one letter is all you need.",
      "Ask what the graph of V looks like at its best point. Flat at the top. So V′ = 0. Solve: x = 4 or x = 12.",
      "Test the candidates and the ends: V(4) = 1024 wins. Then reread the question and answer what it asked."
    ],
    board: "Draw the sheet with corner squares labelled x and sides labelled 24 − 2x. Next to it, sketch V against x: a hill from 0 to 12 with the peak at 4, and a flat tangent drawn at the top.",
    ask: [
      { q: "Why must x be between 0 and 12?", listen: "“A cut can’t be negative, and two cuts can’t be wider than the sheet.” If he is unsure, ask what is left of the base at x = 12." },
      { q: "V′ = 0 at x = 4 and at x = 12. How do you know which is the max?", listen: "“Put both into V: 1024 versus 0.” Or, “the slope goes from + to − at 4.” Both are fine." },
      { q: "The question says “find the largest volume”. Is “x = 4” a full answer?", listen: "“No, the volume is 1024 cm³.” x = 4 is how you get it, not what was asked." }
    ],
    confusion: "The calculus is the easy part. The setup is where students get stuck. Use the same three moves every time: draw and label a picture, write the quantity to optimize, then use the constraint to get it down to one variable. If he gets stuck, ask “what are you allowed to choose?” That is the variable."
  },
  recap: [
    "Set up: name the variable, write the quantity, use the constraint to get one variable and its allowed range.",
    "At the best point inside the range the graph is flat: solve Q′ = 0.",
    "Test the critical points and the ends, then answer the question asked, with units."
  ]
};
})();
