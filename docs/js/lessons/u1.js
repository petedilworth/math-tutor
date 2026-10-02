/* Full lessons: exponent laws, fraction and negative exponents, slope, limits, first principles. */
window.CP = window.CP || {};
(function () {
CP.LESSONS = CP.LESSONS || {};
const { fmt } = CP.W, PI = Math.PI, V = CP.V;
const near = (a, b, tol) => Math.abs(a - b) <= tol;
/* x as a simple fraction when it is close to one, for the fraction-exponent picture */
const asFrac = x => {
  for (const q of [1, 2, 3, 4, 6]) {
    const p = Math.round(x * q);
    if (Math.abs(x - p / q) < 0.025) return q === 1 ? fmt(p, 0) : fmt(p, 0) + "/" + q;
  }
  return "not a simple one";
};
const lineF = x => 0.5 * x + 1, sq = x => x * x;

CP.LESSONS.exp = {
  big: "Every exponent law is counting. Multiplying joins rows of x’s, so exponents add. Dividing cancels pairs, so they subtract. A power of a power makes equal groups, so they multiply. And x⁰ = 1.",
  intro: [
    "An exponent counts how many times something is multiplied by itself. x⁴ means x · x · x · x. That is all it means, and every law in this step comes from it.",
    "Calculus uses these laws on almost every line. The power rule, the chain rule and the derivative of eˣ all lean on them. If you ever forget a law, write the x’s out long and count them."
  ],
  see: [
    {
      h: "Join rows, or make groups",
      text: "Each tile is one x. Set the two powers with the sliders and count the tiles. The tabs switch between multiplying two powers and raising a power to a power.",
      widget: { type: "blocks", modes: ["mul", "pow"], mode: "mul", m: 1, n: 1, max: 6 },
      tasks: [
        { ask: "In Multiply, set up x² · x³.", check: s => s.mode === "mul" && s.m === 2 && s.n === 3, got: "Two x’s, then three more: five in a row. x² · x³ = x⁵. The exponents add." },
        { ask: "Still in Multiply, make the answer x¹⁰.", check: s => s.mode === "mul" && s.e === 10, got: "Any pair that adds to 10 works, like x⁴ · x⁶ or x⁵ · x⁵. The rows join end to end, so you add." },
        { ask: "Switch to Power of a power and set up (x²)³.", check: s => s.mode === "pow" && s.m === 2 && s.n === 3, got: "Three groups of two x’s: six in all. (x²)³ = x⁶, not x⁵. The exponents multiply." },
        { ask: "Still in Power of a power, make x¹².", check: s => s.mode === "pow" && s.e === 12, got: "(x³)⁴, (x⁴)³, (x²)⁶ or (x⁶)². Equal groups multiply: 3 × 4 = 12." }
      ],
      after: "Multiplying puts two rows side by side, so you add. A power of a power copies the same group again and again, so you multiply. The same 2 and 3 gave two different answers: x⁵ and x⁶."
    },
    {
      h: "Dividing cancels pairs",
      text: "Now the x’s sit in a fraction. Each x on the bottom cancels one x on top, because x ÷ x = 1. Watch what is left over, and compare it with the exponent in the readout.",
      widget: { type: "blocks", modes: ["div"], mode: "div", m: 4, n: 1, max: 6 },
      tasks: [
        { ask: "Set up x⁶ ÷ x².", check: s => s.m === 6 && s.n === 2, got: "Two pairs cancel and four x’s are left on top: x⁴. 6 − 2 = 4, so dividing subtracts." },
        { ask: "Make the top and the bottom the same.", check: s => s.m === s.n && s.m > 0, got: "Every x cancels and 1 is left. The law says top minus bottom, which gives x⁰. Both are right, so x⁰ = 1." },
        { ask: "Set up x² ÷ x⁵.", check: s => s.m === 2 && s.n === 5, got: "Three x’s are left on the bottom: 1 ÷ x³. The law says 2 − 5 = −3. So x⁻³ means 1 ÷ x³. The next step is all about this." }
      ],
      after: "Dividing cancels x’s in pairs, so the exponents subtract. When everything cancels you get 1, which is why x⁰ = 1. When the bottom has more, the exponent goes negative, and that means one over."
    }
  ],
  why: {
    lead: "Write each power out long and count the x’s. Each law is just what the counting gives. We assume x is not 0, so that dividing by x is allowed.",
    steps: [
      ["x<sup>m</sup> · x<sup>n</sup> = (x · … · x)(x · … · x)", "m x’s in the first bracket and n in the second."],
      ["= x<sup>m+n</sup>", "Drop the brackets. That leaves one row of m + n x’s."],
      ["x<sup>m</sup> ÷ x<sup>n</sup> = x<sup>m−n</sup>", "Each x on the bottom cancels one on top, because x ÷ x = 1. When m is bigger, m − n x’s are left."],
      ["(x<sup>m</sup>)<sup>n</sup> = x<sup>m</sup> · x<sup>m</sup> · … · x<sup>m</sup>", "The outer power n says how many copies of x<sup>m</sup> to multiply."],
      ["= x<sup>m·n</sup>", "n groups of m x’s is m · n x’s."],
      ["x³ ÷ x³ = 1, and also x³ ÷ x³ = x<sup>3−3</sup> = x⁰", "Cancelling gives 1. The subtraction law gives x⁰. Both are right."],
      ["so x⁰ = 1", "This is not a new rule. It is the only value that keeps the division law working."]
    ],
    end: "The same counting explains the trap. In 5x⁰ the exponent is attached to the x only, so 5x⁰ = 5 × 1 = 5. In (5x)⁰ the bracket puts the 5 under the exponent too, so (5x)⁰ = 1. The laws also need the same base: x² · y³ can’t be combined, because there is nothing to count together."
  },
  examples: [
    { q: "Simplify x⁴ · x⁵.",
      steps: [["x⁴ · x⁵ = x<sup>4+5</sup>", "Multiplying powers of the same base: add the exponents."], ["= x⁹", "Four x’s and five more make nine."]],
      a: "x⁹" },
    { q: "Simplify (x³)⁴ ÷ x⁵.",
      steps: [["(x³)⁴ = x<sup>3×4</sup> = x¹²", "Power of a power first: multiply the exponents."], ["x¹² ÷ x⁵ = x<sup>12−5</sup>", "Dividing: subtract, top minus bottom."], ["= x⁷", "Twelve x’s, five cancel, seven are left."]],
      a: "x⁷" },
    { q: "Simplify (2x³)² · 5x⁰.",
      steps: [["(2x³)² = 2² · (x³)²", "The outer power applies to everything inside the bracket, the 2 included."], ["= 4x⁶", "2² = 4, and 3 × 2 = 6."], ["5x⁰ = 5 · 1 = 5", "The 0 is attached to the x only, so only the x becomes 1."], ["4x⁶ · 5 = 20x⁶", "Multiply the numbers. The x⁶ stays."]],
      a: "20x⁶" }
  ],
  mistakes: [
    { wrong: "x² · x³ = x⁶", why: "The exponents were multiplied. Multiplying exponents is for a power of a power. Here two rows join end to end: 2 x’s and 3 x’s make 5.", fix: "x² · x³ = x⁵" },
    { wrong: "(x²)³ = x⁵", why: "The exponents were added. (x²)³ is three copies of x², which is three groups of two x’s: six.", fix: "(x²)³ = x⁶" },
    { wrong: "x⁸ ÷ x² = x⁴", why: "The exponents were divided. Dividing cancels x’s one pair at a time: 2 pairs cancel and 6 x’s are left.", fix: "x⁸ ÷ x² = x⁶" },
    { wrong: "7x⁰ = 1, or 7x⁰ = 0", why: "The 0 belongs to the x only. x⁰ becomes 1 and the 7 is untouched. And x⁰ is 1, never 0.", fix: "7x⁰ = 7 × 1 = 7" }
  ],
  teach: {
    script: [
      "Write x⁴ on the board and ask what it means. Get him to say “four x’s multiplied together”, then write x · x · x · x underneath.",
      "Write x² · x³ out long: (x · x)(x · x · x). Ask him to count. Five. Then ask what happened to the 2 and the 3. They added.",
      "Now (x²)³. Write x² three times and count again: six. Same two numbers, but this time they multiplied. Ask why: three groups of two.",
      "Division: write x⁵ over x² and cross out pairs. Three are left. Then x³ over x³: everything goes, so the answer is 1. The law says x⁰, so x⁰ = 1.",
      "Finish with the trap: 5x⁰. Ask what the 0 is attached to. Only the x. So the answer is 5."
    ],
    board: "Write x² · x³ and (x²)³ side by side. Under each, write the x’s out long and circle the groups. Let Sebastian do the counting.",
    ask: [
      { q: "Without writing it out: what is x⁷ · x?", listen: "“x⁸, because x is x¹.” If he says x⁷, write x as x¹ and count." },
      { q: "When x = 2, which is bigger: (x²)³ or x² · x³?", listen: "“(x²)³ = x⁶ = 64, and x² · x³ = x⁵ = 32.” If he says they are equal, write both out long." },
      { q: "Why is x⁰ equal to 1 and not 0?", listen: "Something like “x³ ÷ x³ is 1, and the law turns it into x⁰.” “Anything to the 0 is 1” is right, but ask for the reason." }
    ],
    confusion: "The main mix-up is adding versus multiplying exponents. Don’t drill a table of rules. Ask “are two rows side by side, or is a whole power being copied?” Side by side adds. Copied multiplies. The second slip is the number in front: in 3x² only the x is squared, but in (3x)² the 3 is squared too."
  },
  recap: [
    "Multiplying powers: add the exponents. Dividing: subtract them, top minus bottom.",
    "A power of a power: multiply the exponents. x⁰ = 1 for any x that is not 0.",
    "An exponent touches only what it is attached to: 5x⁰ = 5, but (5x)⁰ = 1."
  ]
};

CP.LESSONS.frac = {
  big: "A fraction exponent is a root and a power: the bottom number picks the root and the top number is the power. A minus sign in the exponent means one over. It never makes the answer negative.",
  intro: [
    "Whole-number exponents count copies. But what could x<sup>1/2</sup> or x<sup>−3</sup> mean? You can’t multiply x by itself half a time. The answer comes from keeping the exponent laws working, and seeing what that forces.",
    "This matters for calculus. The power rule works on xⁿ. To use it on √x or 1 ÷ x³, you first rewrite them as x<sup>1/2</sup> and x<sup>−3</sup>. That rewriting is this step."
  ],
  see: [
    {
      h: "Negative exponents mean one over",
      text: "The tiles are 2’s now, so you can work out real numbers. Each 2 on the bottom cancels one 2 on top. Watch the exponent when the bottom has more 2’s than the top.",
      widget: { type: "blocks", modes: ["div"], mode: "div", base: "2", m: 3, n: 1, max: 6 },
      tasks: [
        { ask: "Make the top and the bottom the same.", check: s => s.m === s.n && s.m > 0, got: "Every 2 cancels, so the answer is 1. Top minus bottom gives 2⁰. So 2⁰ = 1." },
        { ask: "Now put exactly one more 2 on the bottom than on top.", check: s => s.n === s.m + 1, got: "One 2 is left underneath: 1 ÷ 2 = ½. Top minus bottom is −1. So 2⁻¹ = ½." },
        { ask: "Make the exponent −3.", check: s => s.e === -3, got: "Three 2’s are left underneath: 1 ÷ 2³ = 1/8 = 0.125. So 2⁻³ = 1/8. Small, but not negative." }
      ],
      after: "Each time the exponent drops by 1, you divide by 2 once more: 2² = 4, 2¹ = 2, 2⁰ = 1, 2⁻¹ = ½, 2⁻² = ¼, 2⁻³ = ⅛. The minus sign means one over. The answer never goes below zero."
    },
    {
      h: "Fraction exponents are roots",
      text: "This is the curve y = bˣ. Pick a base with the slider, then drag the dot to find the x that gives a certain height. The readout shows x as a fraction when x is close to a simple one.",
      widget: { type: "tracer", f: (x, b) => Math.pow(b, x), x: [-1, 1], x0: 1, ticks: 0.5, tangent: false, panel2: false,
        label: "y = bˣ", ylabel: "height",
        param: { name: "b", label: "base b", min: 2, max: 9, step: 1, val: 2, show: v => String(v) },
        readouts: [{ label: "x as a fraction", value: s => asFrac(s.x) }] },
      tasks: [
        { ask: "Set the base to 4. Find the x where the height is 2.", check: s => s.p === 4 && near(s.x, 0.5, 0.025), got: "x = ½. So 4<sup>1/2</sup> = 2, and 2 is √4." },
        { ask: "Set the base to 9 and find the height 3.", check: s => s.p === 9 && near(s.x, 0.5, 0.025), got: "x = ½ again. 9<sup>1/2</sup> = 3 = √9. An exponent of ½ means the square root." },
        { ask: "Set the base to 8 and find the height 2.", check: s => s.p === 8 && near(s.x, 1 / 3, 0.025), got: "x = ⅓. 8<sup>1/3</sup> = 2, because 2 × 2 × 2 = 8. A 3 on the bottom means the cube root." },
        { ask: "Stay on base 8 and find the height 4.", check: s => s.p === 8 && near(s.x, 2 / 3, 0.025), got: "x = ⅔. The cube root of 8 is 2, then 2² = 4. The top of the fraction is a power." },
        { ask: "Still on base 8, find the height ½.", check: s => s.p === 8 && near(s.x, -1 / 3, 0.025), got: "x = −⅓. The cube root of 8 is 2, and the minus sign flips it: 8<sup>−1/3</sup> = ½." }
      ],
      after: "The bottom of a fraction exponent picks the root. The top is the power. A minus sign means one over. Put together: 8<sup>−2/3</sup> = 1 ÷ (∛8)² = 1 ÷ 4 = ¼."
    }
  ],
  why: {
    lead: "Fraction and negative exponents are not new rules. They are the only meanings that keep the exponent laws from the last step true.",
    steps: [
      ["x<sup>1/2</sup> · x<sup>1/2</sup> = x<sup>1/2 + 1/2</sup> = x¹ = x", "Multiplying adds exponents, and ½ + ½ = 1."],
      ["so x<sup>1/2</sup> = √x", "x<sup>1/2</sup> is a number that gives x when multiplied by itself. That is the square root."],
      ["(x<sup>1/3</sup>)³ = x<sup>1/3 × 3</sup> = x¹ = x", "A power of a power multiplies, and ⅓ × 3 = 1. So x<sup>1/3</sup> is the cube root, ∛x."],
      ["x<sup>p/q</sup> = (x<sup>1/q</sup>)<sup>p</sup>", "Split p/q into (1/q) × p. Take the q-th root, then raise it to the power p."],
      ["xⁿ · x<sup>−n</sup> = x<sup>n−n</sup> = x⁰ = 1", "Add the exponents. The product is 1."],
      ["so x<sup>−n</sup> = 1 ÷ xⁿ", "When two numbers multiply to 1, each is one over the other."]
    ],
    end: "Root first or power first gives the same answer, because (x<sup>1/q</sup>)<sup>p</sup> = (x<sup>p</sup>)<sup>1/q</sup>. Root first keeps the numbers small. 8<sup>2/3</sup> is (∛8)² = 2² = 4. Power first gives ∛64, which is harder to see in your head."
  },
  examples: [
    { q: "Evaluate 25<sup>1/2</sup>.",
      steps: [["25<sup>1/2</sup> = √25", "The bottom of the fraction is 2: take the square root."], ["= 5", "5 × 5 = 25. The top is 1, so there is no power to apply."]],
      a: "5" },
    { q: "Evaluate 27<sup>2/3</sup>.",
      steps: [["27<sup>2/3</sup> = (∛27)²", "The bottom is 3, so cube root. The top is 2, so square. Root first."], ["∛27 = 3", "3 × 3 × 3 = 27."], ["3² = 9", "Now apply the power."]],
      a: "9" },
    { q: "Evaluate 16<sup>−3/2</sup>.",
      steps: [["16<sup>−3/2</sup> = 1 ÷ 16<sup>3/2</sup>", "The minus sign means one over. Deal with it first."], ["√16 = 4", "The bottom of the fraction is 2: square root."], ["4³ = 64", "The top is 3: cube it."], ["1 ÷ 64 = 1/64", "Put it back under the 1."]],
      a: "1/64" }
  ],
  mistakes: [
    { wrong: "2⁻³ = −8", why: "The minus was put on the answer and the 3 was read as “times”. A negative exponent means one over: 1 ÷ 2³.", fix: "2⁻³ = 1/8" },
    { wrong: "9<sup>1/2</sup> = 4.5", why: "The exponent ½ was read as “half of”. A fraction exponent is a root, not a multiplier.", fix: "9<sup>1/2</sup> = √9 = 3" },
    { wrong: "27<sup>2/3</sup> = 3", why: "The cube root was taken, then the top number was forgotten. The 2 says to square the root.", fix: "27<sup>2/3</sup> = 3² = 9" },
    { wrong: "√(x³) = x<sup>2/3</sup>", why: "Top and bottom were swapped. The root goes on the bottom of the fraction. The power inside goes on top.", fix: "√(x³) = x<sup>3/2</sup>" }
  ],
  teach: {
    script: [
      "Write the powers of 2 in a column: 2³ = 8, 2² = 4, 2¹ = 2. Ask what happens at each step down. You divide by 2.",
      "Keep going: 2⁰ = 1, 2⁻¹ = ½, 2⁻² = ¼. Ask whether the numbers ever went negative. They didn’t. The minus just means one over.",
      "Ask: what number times itself gives 9? It is 3. Then show 9<sup>1/2</sup> · 9<sup>1/2</sup> = 9¹, so 9<sup>1/2</sup> must be 3.",
      "For 8<sup>2/3</sup>, say it out loud as “cube root of 8, then squared”. Bottom number first, top number second.",
      "Finish with a negative fraction: 8<sup>−2/3</sup>. Set the minus aside, find 8<sup>2/3</sup> = 4, then flip it: ¼."
    ],
    board: "A column of powers of 2 from 2³ down to 2⁻³, with “÷ 2” arrows between them. Next to it, write 8<sup>2/3</sup> with an arrow from the 3 to “root” and from the 2 to “power”.",
    ask: [
      { q: "Is 5⁻² positive or negative?", listen: "“Positive: it is 1/25.” If he says negative, go back to the column of powers of 2 and have him continue it past 2⁰." },
      { q: "What is 32<sup>1/5</sup>?", listen: "“2, because 2 × 2 × 2 × 2 × 2 = 32.” If he says 6.4, he divided by 5. Ask what number, used five times, multiplies to 32." },
      { q: "Write 1 ÷ √x as a single power of x.", listen: "“x<sup>−1/2</sup>.” √x is x<sup>1/2</sup>, and one over flips the sign. This is exactly the rewrite he will need for derivatives." }
    ],
    confusion: "Students read the minus sign as “the answer is negative”. Fix it with the column of powers of 2: each step down divides by 2, so you can never reach a negative number. The other slip is treating ½ as “half of”. Ask “what number times itself gives 16?” to bring the root back."
  },
  recap: [
    "x<sup>−n</sup> = 1 ÷ xⁿ. A negative exponent means one over, never a negative answer.",
    "x<sup>1/q</sup> is the q-th root. For x<sup>p/q</sup>, take the root (bottom), then the power (top).",
    "Do the root first to keep numbers small: 8<sup>2/3</sup> = 2² = 4."
  ]
};

CP.LESSONS.slope = {
  big: "Slope is rise over run: the change in y divided by the change in x. A line has one slope everywhere. A curve does not, so between two points we measure its average rate of change.",
  intro: [
    "Slope answers one question: for each step you take to the right, how far up or down do you go? Rise ÷ run turns that into a single number. A positive slope climbs, a negative slope falls, and a slope of zero is flat.",
    "On a curve, the answer depends on which two points you pick. The slope between two points on a curve is called the average rate of change. Calculus is about what happens when those two points slide together, so this step is where it starts."
  ],
  see: [
    {
      h: "A line has one slope",
      text: "The dot is the first point and the second point is h to the right of it. The dashed legs show the run (across) and the rise (up). The orange line through both points lies right on top of the line here. Change h with the slider and drag the dot.",
      widget: { type: "tracer", f: lineF, df: () => 0.5, x: [-4, 6], y: [-2, 5], x0: 0, ticks: 1, tangent: false, panel2: false,
        secant: { h0: 1, min: 0.5, max: 4.5 }, label: "y = 0.5x + 1", ylabel: "y", mlabel: "slope at the dot",
        readouts: [{ label: "rise", value: s => fmt(lineF(s.x + s.h) - s.y, 3) }, { label: "run", value: s => fmt(s.h, 2) }] },
      tasks: [
        { ask: "Set the run h to 2.", check: s => near(s.h, 2, 0.02), got: "Rise 1, run 2. Slope = 1 ÷ 2 = 0.5." },
        { ask: "Double the run to 4.", check: s => near(s.h, 4, 0.02), got: "The rise doubles too, to 2. Slope = 2 ÷ 4 = 0.5 again." },
        { ask: "Drag the dot to the left, past x = −2.", check: s => s.x < -2, got: "The triangle moves, but the secant slope still reads 0.5. A line climbs at the same rate everywhere." }
      ],
      after: "Big triangle or small, here or there, rise ÷ run on this line is always 0.5. That is the 0.5 in y = 0.5x + 1. In y = mx + b, the m is the slope."
    },
    {
      h: "A curve’s slope depends on where you look",
      text: "Now the curve is y = x². The orange line joins the dot to a second point h further right. Its slope is the average rate of change between them. “Slope at the dot” is the steepness at one single point. Finding that number is what calculus is for.",
      widget: { type: "tracer", f: sq, df: x => 2 * x, x: [-4, 4], y: [-2, 17], x0: 0, ticks: 1, tangent: false, panel2: false,
        secant: { h0: 1, min: 0.5, max: 3 }, label: "y = x²", ylabel: "y", mlabel: "slope at the dot",
        readouts: [{ label: "rise", value: s => fmt(sq(s.x + s.h) - s.y, 3) }, { label: "run", value: s => fmt(s.h, 2) }] },
      tasks: [
        { ask: "Put the dot at x = 1 and set h to 2, so the second point is at x = 3.", check: s => near(s.x, 1, 0.08) && near(s.h, 2, 0.02), got: "Rise 9 − 1 = 8, run 2. The average rate of change is 8 ÷ 2 = 4. (Not 5, which is the average of the two heights.)" },
        { ask: "Keep h at 2. Slide the dot to x = 2.", check: s => near(s.x, 2, 0.08) && near(s.h, 2, 0.02), got: "From 2 to 4 the rise is 16 − 4 = 12, so the slope is 12 ÷ 2 = 6. Same run, steeper secant." },
        { ask: "Slide the dot to x = −1.", check: s => near(s.x, -1, 0.08) && near(s.h, 2, 0.02), got: "From −1 to 1 both heights are 1. Rise 0, slope 0. The secant is flat, even though the curve is not." },
        { ask: "Slide the dot to x = −3.", check: s => near(s.x, -3, 0.08) && near(s.h, 2, 0.02), got: "From −3 to −1 the curve falls from 9 to 1. Rise −8, slope −4. Falling means a negative slope." }
      ],
      after: "On a line every pair of points gives the same slope. On a curve each interval gives its own average rate of change: 4, 6, 0, −4. The secant slope is never quite the slope at the dot, because it averages a steep part and a flat part. Shrinking h fixes that, in the next two steps."
    }
  ],
  why: {
    lead: "Slope measures steepness as a ratio, so it can’t depend on how big a piece of the line you measure. A picture of triangles shows why a line has one slope. The same formula then measures a curve between two points.",
    steps: [
      ["slope = rise ÷ run = (y₂ − y₁) ÷ (x₂ − x₁)", "The rise is the change in y. The run is the change in x."],
      ["Any two points on a line make a right triangle under it", "The run is the bottom leg and the rise is the upright leg."],
      ["Every such triangle has the same angles", "The long side always lies on the same line, at the same tilt. So the triangles are similar: scaled copies of each other."],
      ["so rise ÷ run is the same for all of them", "Similar triangles keep their side ratios. The line has one slope."],
      ["(y₁ − y₂) ÷ (x₁ − x₂) = (y₂ − y₁) ÷ (x₂ − x₁)", "Swap the order on top and bottom and both signs flip. Two flips cancel. Swap only one and the sign comes out wrong."],
      ["average rate of change = [f(b) − f(a)] ÷ (b − a)", "On a curve, draw the straight line through (a, f(a)) and (b, f(b)). It is called a secant. Its slope is the average rate of change."],
      ["y = x² from 1 to 3: (9 − 1) ÷ (3 − 1) = 4", "Different intervals give different answers, as you saw: 4 here, 6 from 2 to 4."]
    ],
    end: "Units help too. If y is in metres and x is in seconds, rise ÷ run is in metres per second: a rate. The average of two heights is still in metres, so it can’t be a rate. That is the quickest way to catch the averaging mistake."
  },
  examples: [
    { q: "Find the slope of the line through (−2, 5) and (1, −1).",
      steps: [["rise = −1 − 5 = −6", "Second y minus first y."], ["run = 1 − (−2) = 3", "Second x minus first x, in the same order."], ["slope = −6 ÷ 3 = −2", "Rise over run. It is negative, so the line falls to the right."]],
      a: "−2" },
    { q: "Find the average rate of change of f(x) = −2x² from x = −3 to x = 1.",
      steps: [["f(1) = −2(1)² = −2", "Height at the end."], ["f(−3) = −2(−3)² = −2(9) = −18", "Height at the start. Square first, then multiply by −2."], ["change in f = −2 − (−18) = 16", "End minus start."], ["change in x = 1 − (−3) = 4", "Same order: end minus start."], ["16 ÷ 4 = 4", "Divide."]],
      a: "4" },
    { q: "The average rate of change of f(x) = x² from x = 1 to x = b is 7. Find b.",
      steps: [["(b² − 1) ÷ (b − 1) = 7", "Change in f over change in x."], ["b² − 1 = (b − 1)(b + 1)", "Factor the top. It is a difference of squares."], ["(b − 1)(b + 1) ÷ (b − 1) = b + 1", "Cancel b − 1. This is allowed because b is not 1."], ["b + 1 = 7, so b = 6", "Solve."], ["(36 − 1) ÷ (6 − 1) = 35 ÷ 5 = 7", "Check it."]],
      a: "b = 6" }
  ],
  mistakes: [
    { wrong: "The slope through (1, 2) and (3, 8) is 2 ÷ 6 = ⅓", why: "Run was put over rise. Slope is rise over run: the change in y goes on top.", fix: "(8 − 2) ÷ (3 − 1) = 6 ÷ 2 = 3" },
    { wrong: "(8 − 2) ÷ (1 − 3) = −3", why: "The top is second minus first, but the bottom is first minus second. Mixing the order flips the sign.", fix: "(8 − 2) ÷ (3 − 1) = 3" },
    { wrong: "The average rate of change of x² from 1 to 3 is (1 + 9) ÷ 2 = 5", why: "That is the average of the two heights. A rate is the change in height for each unit of x.", fix: "(9 − 1) ÷ (3 − 1) = 4" },
    { wrong: "The average rate of change of x² from 1 to 3 is 9 − 1 = 8", why: "That is the rise alone. It still has to be divided by the run, 3 − 1 = 2.", fix: "8 ÷ 2 = 4" }
  ],
  teach: {
    script: [
      "Draw a line through two grid points. Count the squares across, then up. Say “rise over run” and divide.",
      "Pick two different points on the same line and count again. Ask why the answer didn’t change. (The triangles are the same shape.)",
      "Draw y = x² and join the points at x = 1 and x = 3. Ask for the slope of that straight line: (9 − 1) ÷ 2 = 4.",
      "Ask him to guess the slope from x = 2 to x = 4 before working it out. It is 6. The curve is steeper there, so the answer changed.",
      "Name it: on a curve this is the average rate of change. It is the slope of the straight line between two points, not the slope at either point."
    ],
    board: "A parabola y = x² with two chords, one from x = 1 to 3 and one from 2 to 4. Draw the rise and run legs as dashed lines and write rise ÷ run beside each.",
    ask: [
      { q: "A line goes through (0, 3) and (4, 1). Before you calculate: is its slope positive or negative?", listen: "“Negative, because y goes down as x goes right.” Then −2 ÷ 4 = −½. If he can’t tell, sketch it." },
      { q: "Why is the average rate of change of x² from −1 to 1 equal to 0, when the curve isn’t flat?", listen: "“The start and end heights are both 1, so the rise is 0.” The secant is flat even though the curve dips in between." },
      { q: "If y is in dollars and x is in days, what are the units of the slope?", listen: "“Dollars per day.” If he says dollars, ask what dividing by days does." }
    ],
    confusion: "The usual error is averaging the two heights instead of dividing the change. Ask “what is changing, and per what?” every time. The second is a sign slip from subtracting in different orders. Have him write “end minus start” over “end minus start” before putting in any numbers."
  },
  recap: [
    "Slope = rise ÷ run = (y₂ − y₁) ÷ (x₂ − x₁). Subtract in the same order on top and bottom.",
    "A line has one slope. On a curve, rise ÷ run between two points is the average rate of change.",
    "Average rate of change is the change in height per unit of x, not the average of the heights."
  ]
};

CP.LESSONS.limits = {
  big: "A limit is the value a function closes in on as x gets near a number, or grows without end, whether or not it ever gets there. If putting the number in gives 0 ÷ 0, factor and cancel first.",
  intro: [
    "Some functions have a gap: one x where you can’t work out the value, because you would divide by zero. A limit asks a different question. Never mind the value at that x. What value do the nearby points close in on?",
    "Calculus is built on this. The slope at a single point is a 0 ÷ 0 problem, and limits are how we solve it. The same idea handles x → ∞, read “x goes to infinity”: what does the function settle down to as x gets huge?"
  ],
  see: [
    {
      h: "A hole in the graph",
      text: "This is y = (x² − 4) ÷ (x − 2). At x = 2 it gives 0 ÷ 0, so the graph has a hole there. The purple dot is h to the left of 2 and the orange dot is h to the right. Slide h smaller and watch the table.",
      widget: { type: "limit", f: x => (x * x - 4) / (x - 2), a: 2, L: 4, x: [0, 5], y: [0, 7.5], label: "y = (x² − 4) ÷ (x − 2)" },
      tasks: [
        { ask: "Slide until h = 0.1.", check: s => near(s.k, 1, 0.03), got: "f(1.9) = 3.9 and f(2.1) = 4.1. Both are 0.1 away from 4." },
        { ask: "Now make h = 0.001.", check: s => near(s.k, 3, 0.03), got: "3.999 and 4.001. Both sides are closing in on 4." },
        { ask: "Push h as small as it goes.", check: s => s.k >= 3.99, got: "3.9999 and 4.0001. The value at x = 2 itself still doesn’t exist, but the limit is 4." }
      ],
      after: "Factor the top: (x − 2)(x + 2) ÷ (x − 2) = x + 2, for every x except 2. So the graph is the line y = x + 2 with one point missing. The limit is the height of the hole: 2 + 2 = 4."
    },
    {
      h: "A limit you can’t factor",
      text: "y = (2ˣ − 1) ÷ x also gives 0 ÷ 0 at x = 0. This time there is nothing to factor. Shrink h and let the table do the work.",
      widget: { type: "limit", f: x => (Math.pow(2, x) - 1) / x, a: 0, L: Math.log(2), x: [-2, 2], y: [0, 1.7], label: "y = (2ˣ − 1) ÷ x" },
      tasks: [
        { ask: "Slide until h = 0.1.", check: s => near(s.k, 1, 0.03), got: "0.66967 on the left and 0.71773 on the right. Close, but they don’t agree yet." },
        { ask: "Now make h = 0.01.", check: s => near(s.k, 2, 0.03), got: "0.69075 and 0.69556. They are squeezing together." },
        { ask: "Push h as small as it goes.", check: s => s.k >= 3.99, got: "0.69312 and 0.69317. Both sides agree on 0.6931 to four places. That number is ln 2. It comes back later as the slope of 2ˣ at x = 0." }
      ],
      after: "0 ÷ 0 never means the answer is 0, or 1, or that there is no answer. It means “look closer”. Here the two sides squeeze together on 0.6931…, so that is the limit."
    },
    {
      h: "Where does it settle as x grows?",
      text: "Here y = (ax + 5) ÷ (2x + 1). Drag the dot to the right to make x big, and read the height. Change a, the number in front of x on top, with the slider.",
      widget: { type: "tracer", f: (x, a) => (a * x + 5) / (2 * x + 1), x: [0, 100], y: [0, 5.5], x0: 1, ticks: 20, tangent: false, panel2: false,
        label: "y = (ax + 5) ÷ (2x + 1)", ylabel: "height",
        param: { name: "a", label: "top number a", min: 1, max: 6, step: 1, val: 4, show: v => String(v) } },
      tasks: [
        { ask: "Leave a at 4. Drag the dot to x = 10.", check: s => s.p === 4 && near(s.x, 10, 1), got: "The height is about 2.14. The 5 and the 1 still pull it up a little." },
        { ask: "Keep going to the far right, past x = 95.", check: s => s.p === 4 && s.x > 95, got: "About 2.015, and still falling toward 2. That is 4 ÷ 2: at this size, 4x ÷ 2x is nearly the whole story." },
        { ask: "Stay at the far right and set a to 6.", check: s => s.p === 6 && s.x > 95, got: "About 3.01, closing in on 3. That is 6 ÷ 2." },
        { ask: "Find the a that makes the curve settle at 0.5.", check: s => s.p === 1 && s.x > 95, got: "a = 1. The height is about 0.52 and closing in on 1 ÷ 2 = 0.5. The limit is always a ÷ 2." }
      ],
      after: "For huge x, the 5 and the 1 are tiny next to ax and 2x. Divide top and bottom by x: (a + 5/x) ÷ (2 + 1/x). As x grows, 5/x and 1/x shrink to 0, which leaves a ÷ 2."
    }
  ],
  why: {
    lead: "A limit is about the values near a point, never the value at it. So you may change the function at that one point, as long as every nearby point stays the same. That freedom is why cancelling works.",
    steps: [
      ["f(x) = (x² − 4) ÷ (x − 2)", "Try x = 2: the top is 0 and the bottom is 0. 0 ÷ 0 is not a number, so more work is needed."],
      ["= (x − 2)(x + 2) ÷ (x − 2)", "Factor the top. It is a difference of squares."],
      ["= x + 2, for x ≠ 2", "Cancel. This is allowed because x − 2 is not zero anywhere near 2, only at 2 itself."],
      ["lim<sub>x→2</sub> f(x) = 2 + 2 = 4", "f and x + 2 agree at every point near 2, so they close in on the same value. Now substitute."],
      ["(3x + 1) ÷ (x − 4) = (3 + 1/x) ÷ (1 − 4/x)", "For x → ∞, divide every term on top and bottom by x."],
      ["1/x → 0 and 4/x → 0", "A fixed number divided by a huge number is tiny."],
      ["lim<sub>x→∞</sub> (3x + 1) ÷ (x − 4) = 3 ÷ 1 = 3", "Only the x numbers are left: top over bottom."]
    ],
    end: "A limit exists only if the left side and the right side close in on the same number. For y = |x| ÷ x the left side is always −1 and the right side is always 1, so there is no limit at 0. A hole alone does not stop a limit: (x² − 4) ÷ (x − 2) has a hole and still has a limit."
  },
  examples: [
    { q: "Find lim<sub>x→∞</sub> (6x − 5) ÷ (2x + 7).",
      steps: [["= lim (6 − 5/x) ÷ (2 + 7/x)", "Divide every term by x."], ["5/x → 0 and 7/x → 0", "They shrink as x grows."], ["= 6 ÷ 2 = 3", "Only the x numbers are left."]],
      a: "3" },
    { q: "Find lim<sub>x→−2</sub> (x² − 3x − 10) ÷ (x + 2).",
      steps: [["at x = −2: (4 + 6 − 10) ÷ 0 = 0 ÷ 0", "Try substituting. 0 ÷ 0 means more work, not an answer."], ["x² − 3x − 10 = (x + 2)(x − 5)", "Factor: two numbers that multiply to −10 and add to −3."], ["= x − 5, for x ≠ −2", "Cancel the (x + 2)."], ["−2 − 5 = −7", "Now substitute."]],
      a: "−7" },
    { q: "Find lim<sub>h→0</sub> [(3 + h)² − 9] ÷ h.",
      steps: [["(3 + h)² = 9 + 6h + h²", "Expand. Putting h = 0 in now would give 0 ÷ 0."], ["9 + 6h + h² − 9 = 6h + h²", "Subtract the 9."], ["(6h + h²) ÷ h = 6 + h", "Divide every term by h. This is allowed because h is not 0."], ["6 + 0 = 6", "Now let h go to 0. This limit is the slope of y = x² at x = 3, which is the next step’s idea."]],
      a: "6" }
  ],
  mistakes: [
    { wrong: "lim<sub>x→2</sub> (x² − 4) ÷ (x − 2) = 0 ÷ 0 = 0", why: "0 ÷ 0 is not 0. It is a signal that the top and bottom share a factor that has to be cancelled.", fix: "Factor and cancel to x + 2, then substitute: the limit is 4." },
    { wrong: "The limit does not exist, because f(2) does not exist.", why: "A limit ignores the value at the point. It only asks what the nearby values close in on, and both sides close in on 4.", fix: "The limit is 4, even though f(2) does not exist." },
    { wrong: "lim<sub>x→∞</sub> (2x + 9) ÷ (x + 1) = 9", why: "That is 9 ÷ 1, the value at x = 0. As x grows, the 9 and the 1 become tiny next to the x terms.", fix: "The limit is 2 ÷ 1 = 2." },
    { wrong: "lim<sub>x→∞</sub> (3x + 1) ÷ (6x − 2) = 2", why: "Upside down. It is the top’s x number over the bottom’s, not the other way round.", fix: "The limit is 3 ÷ 6 = ½." }
  ],
  teach: {
    script: [
      "Write f(x) = (x² − 4) ÷ (x − 2). Ask for f(2). He will find 0 ÷ 0. Say: “so f(2) doesn’t exist. But what about f(1.9)?”",
      "Make a table with x = 1.9, 1.99, 2.01 and 2.1. Let him use the calculator. Ask what the numbers are closing in on. (4.)",
      "Now factor the top and cancel. Ask why the table was so tidy: f is really x + 2, with one point missing.",
      "Draw the line y = x + 2 with an open circle at (2, 4). Say: the limit is the height of the hole.",
      "Switch to x → ∞ with (6x − 5) ÷ (2x + 7). Try x = 1000 on the calculator. Then show the shortcut: keep only the x terms, 6 ÷ 2 = 3."
    ],
    board: "The line y = x + 2 with an open circle at (2, 4). Below it, a table: x from the left (1.9, 1.99, 1.999) and from the right (2.1, 2.01, 2.001), with f(x) beside each.",
    ask: [
      { q: "If substituting gives 0 ÷ 0, what does that tell you?", listen: "“That I need to factor and cancel first.” If he says the answer is 0, or that there is no limit, go back to the table." },
      { q: "What is lim<sub>x→∞</sub> (5x + 100) ÷ (x − 3)?", listen: "“5, because only the x terms matter.” If he hesitates, try x = 1,000,000 on the calculator: it gives about 5.0001." },
      { q: "Can a function have a limit at a point where it has no value?", listen: "“Yes, like at a hole.” The limit is about nearby points, not the point itself." }
    ],
    confusion: "The big confusion is between the value at a point and the limit at that point. Keep using the word “near”: the limit is what the function is near, not what it equals. The other trap is stopping at 0 ÷ 0. Treat 0 ÷ 0 like a locked door: it means there is more work to do, not that the answer is 0."
  },
  recap: [
    "A limit is what f(x) closes in on near a point. The value at the point does not matter.",
    "0 ÷ 0 means factor, cancel, then substitute.",
    "As x → ∞, (ax + b) ÷ (cx + d) closes in on a ÷ c."
  ]
};

CP.LESSONS.firstp = {
  big: "The slope at one point is the limit of secant slopes: f′(x) = lim<sub>h→0</sub> [f(x + h) − f(x)] ÷ h. Expand, subtract, divide by h, then let h shrink to 0.",
  intro: [
    "Slope needs two points: rise over run. But a curve’s steepness changes from point to point. How can you measure it at just one point?",
    "The trick is to take a second point a small distance h away and find the secant slope. Then let h shrink. The secant swings into the tangent line, and its slope closes in on the slope at the point. That limit is called the derivative, written f′(x)."
  ],
  see: [
    {
      h: "Shrink the secant into a tangent",
      text: "The curve is y = x² and the dot is at x = 1. The orange line is the secant through the dot and a second point h further right. The purple line is the tangent: the line that just touches the curve at the dot. Shrink h and watch the orange line.",
      widget: { type: "tracer", f: sq, df: x => 2 * x, x: [-1, 3], y: [-1, 9.5], x0: 1, ticks: 1, panel2: false,
        secant: { h0: 2, min: 0.01, max: 2 }, label: "y = x²", mlabel: "tangent slope",
        readouts: [{ label: "secant − tangent", value: s => fmt(s.ms - s.m, 4) }] },
      tasks: [
        { ask: "Leave the dot at x = 1. Slide h down to 1.", check: s => near(s.x, 1, 0.04) && near(s.h, 1, 0.012), got: "Rise 4 − 1 = 3 over run 1: the secant slope is 3." },
        { ask: "Slide h down to 0.5.", check: s => near(s.x, 1, 0.04) && near(s.h, 0.5, 0.012), got: "The secant slope is 2.5. The orange line is swinging toward the purple one." },
        { ask: "Slide h below 0.1.", check: s => near(s.x, 1, 0.04) && s.h <= 0.1, got: "The secant slope is now between 2 and 2.1. Look at “secant − tangent”: it equals h. The secant slope is 2 + h." },
        { ask: "Take h all the way down to 0.01.", check: s => near(s.x, 1, 0.04) && s.h <= 0.0105, got: "2.01. The two lines now lie on top of each other. As h → 0, 2 + h → 2. So the slope of x² at x = 1 is 2." }
      ],
      after: "Algebra says the same thing: [(1 + h)² − 1] ÷ h = (2h + h²) ÷ h = 2 + h. You can’t put h = 0 in at the start, because that gives 0 ÷ 0. But once you have 2 + h, letting h go to 0 gives 2. That is first principles."
    },
    {
      h: "Do it at every x",
      text: "Same curve, but now you choose the point. With a tiny h, the secant slope tells you the slope at the dot. The lower panel collects the tangent slopes as you drag. Look for the pattern.",
      widget: { type: "tracer", f: sq, df: x => 2 * x, x: [-3, 3], y: [-1, 9.5], dy: [-6.5, 6.5], x0: 0.5, ticks: 1,
        secant: { h0: 1, min: 0.01, max: 1 }, label: "y = x²", dlabel: "slope of x²", mlabel: "tangent slope",
        ghost: x => 2 * x, ghostLabel: "2x" },
      tasks: [
        { ask: "Set h to 0.01, then drag the dot to x = 2.", check: s => s.h <= 0.0105 && near(s.x, 2, 0.06), got: "The secant slope is 4.01, closing in on 4. So f′(2) = 4." },
        { ask: "Keep h at 0.01 and drag to x = 3.", check: s => s.h <= 0.0105 && s.x >= 2.94, got: "6.01, closing in on 6. So f′(3) = 6." },
        { ask: "Now drag to x = −1.", check: s => s.h <= 0.0105 && near(s.x, -1, 0.06), got: "−1.99, closing in on −2. So f′(−1) = −2. Do you see the pattern?" },
        { ask: "Press Sweep to collect every slope, then press Show 2x.", check: s => s.ghost && s.covered > 0.85, got: "The slopes land exactly on the line 2x. The derivative of x² is 2x." }
      ],
      after: "Each x gave a limit, and every limit was double the x. That rule, f′(x) = 2x, is the derivative function. The “why” below gets it with algebra in four moves, for every x at once."
    }
  ],
  why: {
    lead: "The pictures showed the secant slope closing in on the tangent slope. First principles does the same thing with algebra, for every x at once. Here it is for f(x) = x².",
    steps: [
      ["f′(x) = lim<sub>h→0</sub> [f(x + h) − f(x)] ÷ h", "The secant from x to x + h has rise f(x + h) − f(x) and run h. Then let h shrink."],
      ["f(x + h) = (x + h)² = x² + 2xh + h²", "Move 1: expand."],
      ["f(x + h) − f(x) = 2xh + h²", "Move 2: subtract f(x). Every term without an h cancels. It always does."],
      ["(2xh + h²) ÷ h = 2x + h", "Move 3: divide every term by h. This is allowed because h is small but not 0."],
      ["lim<sub>h→0</sub> (2x + h) = 2x", "Move 4: now let h go to 0."],
      ["at x = 1: 2 + h → 2", "The secant slope you watched in the first picture was exactly 2 + h."]
    ],
    end: "Why not put h = 0 in at the start? The top becomes f(x) − f(x) = 0 and the bottom becomes 0, and 0 ÷ 0 tells you nothing. Dividing by h first removes the zero from the bottom. If the limit exists at x, f is called differentiable there. A sharp corner, like y = |x| at 0, gives −1 from the left and 1 from the right, so it has no derivative there."
  },
  examples: [
    { q: "Use the limit definition to find f′(2) for f(x) = 3x².",
      steps: [["f(2 + h) = 3(4 + 4h + h²)", "Expand (2 + h)² first."], ["= 12 + 12h + 3h²", "Multiply through by 3."], ["f(2 + h) − f(2) = 12h + 3h²", "f(2) = 3 × 4 = 12, so the 12 cancels."], ["(12h + 3h²) ÷ h = 12 + 3h", "Divide every term by h."], ["f′(2) = 12 + 0 = 12", "Let h go to 0."]],
      a: "f′(2) = 12" },
    { q: "For f(x) = 2x² − 5x + 1, simplify [f(x + h) − f(x)] ÷ h. Then find f′(x).",
      steps: [["f(x + h) = 2x² + 4xh + 2h² − 5x − 5h + 1", "Expand 2(x + h)² − 5(x + h) + 1."], ["f(x + h) − f(x) = 4xh + 2h² − 5h", "Subtract all of 2x² − 5x + 1. Every term without an h cancels."], ["(4xh + 2h² − 5h) ÷ h = 4x + 2h − 5", "Divide every term by h. This is the difference quotient."], ["f′(x) = 4x − 5", "Let h go to 0. The 2h disappears."]],
      a: "The quotient is 4x + 2h − 5, so f′(x) = 4x − 5" },
    { q: "Use first principles to find f′(x) for f(x) = 3 ÷ x.",
      steps: [["f(x + h) − f(x) = 3/(x + h) − 3/x", "Write the rise."], ["= [3x − 3(x + h)] ÷ [x(x + h)]", "Use the common denominator x(x + h)."], ["= −3h ÷ [x(x + h)]", "Expand the top: 3x − 3x − 3h."], ["÷ h gives −3 ÷ [x(x + h)]", "Divide by h. The h on top cancels."], ["f′(x) = −3 ÷ x²", "Let h go to 0. x + h becomes x, so the bottom becomes x · x."]],
      a: "f′(x) = −3/x²" }
  ],
  mistakes: [
    { wrong: "Put h = 0 first: [(x + 0)² − x²] ÷ 0 = 0 ÷ 0", why: "Setting h to 0 before dividing gives 0 ÷ 0, which tells you nothing. The h on the bottom has to be cancelled first.", fix: "Simplify to 2x + h, then let h → 0: f′(x) = 2x." },
    { wrong: "(x + h)² = x² + h²", why: "The middle term 2xh is lost. Then the quotient is just h, which goes to 0, and every slope would be 0. That can’t be right for a curve.", fix: "(x + h)² = x² + 2xh + h²" },
    { wrong: "f(x + h) − f(x) = 2(x + h)² − 5(x + h) + 1 − 2x² − 5x + 1", why: "The minus sign only reached the first term of f(x). It must change the sign of every term, so that the terms without h cancel.", fix: "… − 2x² + 5x − 1" },
    { wrong: "For f(x) = 4x², f′(3) = 36", why: "That is f(3), the height of the curve. The derivative is the slope there.", fix: "[f(3 + h) − f(3)] ÷ h = 24 + 4h, so f′(3) = 24." }
  ],
  teach: {
    script: [
      "Draw y = x² and mark the point (1, 1). Ask: how steep is it right here? He can’t use rise over run with only one point.",
      "Pick a second point at x = 2. The secant slope is (4 − 1) ÷ 1 = 3. Then x = 1.5 gives 2.5, and x = 1.1 gives 2.1. Ask what the slopes are heading for.",
      "Say: we can’t use h = 0, because that gives 0 ÷ 0. So we do the algebra with h as a letter, simplify, and only then let h shrink.",
      "Work out [(1 + h)² − 1] ÷ h together: it is 2 + h. Point out that it matches the table: h = 1 gave 3, h = 0.5 gave 2.5.",
      "Then do it with x instead of 1. Name the four moves out loud: expand, subtract, divide by h, let h go to 0."
    ],
    board: "y = x² with the point (1, 1) and three secants to x = 2, 1.5 and 1.1, getting flatter. Beside it a table of h and secant slope: 1 → 3, 0.5 → 2.5, 0.1 → 2.1, and an arrow to 2.",
    ask: [
      { q: "Why can’t we just set h = 0 at the start?", listen: "“We’d get 0 ÷ 0.” Push for the next sentence: dividing by h first gets rid of the zero on the bottom." },
      { q: "After you subtract f(x), what should every remaining term have in common?", listen: "“They all have an h.” If a term without h is left, something went wrong in the expanding or the subtracting." },
      { q: "The difference quotient for some f is 6x + 3h − 1. What is f′(x)?", listen: "“6x − 1.” If he says 6x + 3h − 1, remind him the last move is letting h go to 0." }
    ],
    confusion: "The usual slip is the order of the moves: setting h = 0 too early, or forgetting to take the limit at the end. Have him say the four moves before each question. The other slip is algebra: losing the 2xh from (x + h)², or not subtracting every term of f(x). The check is simple: after subtracting, every term must contain h."
  },
  recap: [
    "f′(x) = lim<sub>h→0</sub> [f(x + h) − f(x)] ÷ h: the secant slope as the second point slides in.",
    "Four moves: expand f(x + h), subtract f(x), divide by h, let h → 0.",
    "Never set h = 0 before dividing. 0 ÷ 0 tells you nothing."
  ]
};
})();
