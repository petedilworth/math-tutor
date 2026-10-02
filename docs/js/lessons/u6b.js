/* Full lessons: angles and projections, cross product, triple product and vector laws. */
window.CP = window.CP || {};
(function () {
CP.LESSONS = CP.LESSONS || {};
const { fmt } = CP.W, PI = Math.PI, V = CP.V;
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const rad = d => d * PI / 180, deg = r => r * 180 / PI;
const angOf = (a, b) => { const na = V.norm(a), nb = V.norm(b); return na && nb ? deg(Math.acos(Math.max(-1, Math.min(1, V.dot(a, b) / (na * nb))))) : NaN; };
const same = (a, b) => a.every((x, i) => Math.abs(x - b[i]) < 1e-9);
const circle = (r, c) => { const out = []; for (let i = 0; i < 36; i++) { const a = rad(i * 10), b = rad(i * 10 + 10); out.push({ t: "seg", a: [r * Math.cos(a), r * Math.sin(a), 0], b: [r * Math.cos(b), r * Math.sin(b), 0], c, dash: true }); } return out; };

/* ---------------- angle ---------------- */
const AV = [2, 2, 1]; /* |v| = 3 */
const AU = p => [3 * Math.cos(rad(p.phi)), 3 * Math.sin(rad(p.phi)), 0]; /* |u| = 3 */

CP.LESSONS.angle = {
  big: "u · v = |u||v| cos θ. So the dot product, divided by both lengths, gives the cosine of the angle between two vectors. Divide by |v| alone and you get the length of u’s shadow on v.",
  intro: [
    "In 2D you can measure an angle with a protractor. In 3D you can’t: the vectors don’t lie on your page. The dot product fixes that. It turns the components of two vectors into one number, and that number knows the angle.",
    "The same number also gives the <b>projection</b>: the shadow one vector casts on another when light shines straight down onto it. Shadows are how you split a force into the part that pushes along a ramp and the part that pushes into it."
  ],
  see: [
    {
      h: "The dot product knows the angle",
      text: "Drag the tips of u and v. The thick arrow along v’s line is the shadow of u on v: drop a right angle from u’s tip onto that line. Watch u · v, the angle and the shadow as you go.",
      widget: { type: "vec2", mode: "dot", u: [2, 1], v: [1, 3], snap: 0.5 },
      tasks: [
        { ask: "Right now u · v = 5 and the angle is 45°. Stretch u longer without turning it, for example to (4, 2).", check: s => same(s.v, [1, 3]) && Math.abs(s.u[0] * 1 - s.u[1] * 2) < 1e-9 && s.u[0] > 2.1,
          got: "At (4, 2), u · v = 10, double what it was, and the shadow doubled too. But the angle is still 45°. So u · v alone can’t be the angle: the lengths have to be divided out." },
        { ask: "Drag a tip until u · v = 0.", check: s => Math.abs(s.dot) < 1e-9 && s.nu > 0 && s.nv > 0,
          got: "The angle reads 90° and the shadow has shrunk to a point. A zero dot product means a right angle." },
        { ask: "Now open the angle past 90°.", check: s => s.dot < 0 && s.angle > 90.5,
          got: "u · v is negative and the shadow points backwards, away from v. A negative dot product always means an obtuse angle." },
        { ask: "Make u and v point in exactly opposite directions.", check: s => s.angle > 179.99 && s.nu > 0 && s.nv > 0,
          got: "180°. Now u · v = −|u||v|, the most negative it can be for these lengths. cos 180° = −1." }
      ],
      after: "Divide u · v by both lengths and the stretching cancels: cos θ = u · v ÷ (|u||v|). At the start that was 5 ÷ (√5 × √10) = 5 ÷ √50 ≈ 0.707 = cos 45°. The shadow readout is u · v ÷ |v|: the scalar projection of u on v."
    },
    {
      h: "Angles you can’t see: the same rule in 3D",
      text: "Here v = (2, 2, 1) points up out of the floor, and u, of length 3, turns around in the floor. Both have length 3, so |u||v| = 9 and cos θ = u · v ÷ 9. The orange arrow is the vector projection of u on v.",
      widget: { type: "vec3", range: 3, yaw: 0.3, pitch: -0.6,
        params: [{ name: "phi", label: "turn u", min: 0, max: 360, step: 1, val: 0, show: v => Math.round(v) + "°" }],
        scene: (p, V) => {
          const u = AU(p), k = V.dot(u, AV) / 9, pr = V.scale(AV, k);
          return circle(3, 5).concat([
            { t: "line", p: [0, 0, 0], d: AV, c: 5, range: [-1.2, 1.2] },
            { t: "seg", a: u, b: pr, c: 5, dash: true },
            { t: "vec", to: pr, c: 3 },
            { t: "vec", to: AV, c: 2, label: "v" },
            { t: "vec", to: u, c: 1, label: "u" }]);
        },
        readouts: [
          { label: "u", value: (p, V) => V.fmt(AU(p)) },
          { label: "u · v", value: (p, V) => fmt(V.dot(AU(p), AV), 2) },
          { label: "cos θ = u · v ÷ 9", value: (p, V) => fmt(V.dot(AU(p), AV) / 9, 3) },
          { label: "θ", value: (p, V) => fmt(angOf(AU(p), AV), 1) + "°" },
          { label: "shadow (u · v) ÷ |v|", value: (p, V) => fmt(V.dot(AU(p), AV) / 3, 2) },
          { label: "vector projection", value: (p, V) => V.fmt(V.scale(AV, V.dot(AU(p), AV) / 9)) }] },
      tasks: [
        { ask: "θ starts at 48.2°. Turn u until θ = 60°.", check: s => near(angOf(AU(s), AV), 60, 0.6),
          got: "At 103° (or 347°), u · v ≈ 4.5. That is half of |u||v| = 9, and cos 60° = 0.5. The shadow is 4.5 ÷ 3 = 1.5 long." },
        { ask: "Turn u until it meets v at a right angle.", check: s => near(angOf(AU(s), AV), 90, 0.6),
          got: "At 135°, for example, u = (−2.12, 2.12, 0) and u · v = −4.24 + 4.24 + 0 = 0. No shadow at all: the projection is the zero vector." },
        { ask: "Make the angle as large as it can get.", check: s => angOf(AU(s), AV) > 160.3,
          got: "About 160.5°, at 225°. u · v ≈ −8.49, so cos θ ≈ −0.943 and the shadow, −2.83, points backwards. It can’t reach 180° because u stays in the floor while v points up." }
      ],
      after: "Nothing here needed a protractor. Three multiplications, one division and cos⁻¹ give the angle in any number of dimensions. The vector projection is the shadow length times a unit vector along v: ((u · v) ÷ |v|²) v."
    }
  ],
  why: {
    lead: "The link between u · v and the angle comes from the cosine law. Draw u and v from one point. The third side of that triangle is u − v. Work out its length squared in two ways and compare.",
    steps: [
      ["|u − v|² = |u|² + |v|² − 2|u||v| cos θ", "The cosine law, for the triangle with sides u, v and u − v."],
      ["|u − v|² = (u − v) · (u − v)", "Any vector dotted with itself gives its length squared."],
      ["= u · u − 2u · v + v · v = |u|² − 2u · v + |v|²", "Expand like (a − b)². The dot product distributes and u · v = v · u."],
      ["−2u · v = −2|u||v| cos θ", "Set the two versions equal. |u|² and |v|² cancel."],
      ["cos θ = (u · v) ÷ (|u||v|)", "Divide both sides by −2|u||v|."],
      ["shadow = |u| cos θ = (u · v) ÷ |v|", "The shadow is the side next to θ in a right triangle with hypotenuse |u|. This is the scalar projection."],
      ["proj<sub>v</sub> u = ((u · v) ÷ |v|) × (v ÷ |v|) = ((u · v) ÷ |v|²) v", "Point the shadow along v: multiply by the unit vector v ÷ |v|. This is the vector projection."]
    ],
    end: "The sign takes care of itself. For θ over 90°, cos θ is negative, so u · v and the shadow are negative too, and the vector projection points against v. Your calculator’s cos⁻¹ returns angles from 0° to 180°, exactly the range an angle between vectors can have."
  },
  examples: [
    { q: "Find the angle between u = (2, 0, 2) and v = (0, 3, 3).",
      steps: [["u · v = 2(0) + 0(3) + 2(3) = 6", "Multiply matching components and add."],
              ["|u| = √8 = 2√2,  |v| = √18 = 3√2", "Lengths: square, add, square root."],
              ["|u||v| = 2√2 × 3√2 = 12", "√2 × √2 = 2."],
              ["cos θ = 6 ÷ 12 = 0.5", "Divide the dot product by both lengths."],
              ["θ = cos⁻¹ 0.5 = 60°", "Degree mode."]],
      a: "θ = 60°" },
    { q: "Find the scalar projection of u = (3, −1, 4) on v = (2, 3, 6).",
      steps: [["u · v = 6 − 3 + 24 = 27", "Watch the sign on the middle pair: (−1)(3) = −3."],
              ["|v| = √(4 + 9 + 36) = √49 = 7", "On v, so divide by the length of v."],
              ["27 ÷ 7 ≈ 3.857", "Divide once, by |v|."]],
      a: "27/7 ≈ 3.86" },
    { q: "Find the vector projection of u = (−1, 3, −2) on v = (2, −1, 2), and the angle between them.",
      steps: [["u · v = −2 − 3 − 4 = −9", "Negative, so the angle is obtuse and the projection points against v."],
              ["|v|² = 4 + 1 + 4 = 9", "For the vector projection you divide by |v|²."],
              ["multiplier = −9 ÷ 9 = −1", "This is how many copies of v the shadow is."],
              ["proj<sub>v</sub> u = −1(2, −1, 2) = (−2, 1, −2)", "Multiply v by the multiplier."],
              ["u − proj = (1, 2, 0), and (1, 2, 0) · v = 2 − 2 + 0 = 0", "Check: what is left of u is at right angles to v."],
              ["cos θ = −9 ÷ (√14 × 3) ≈ −0.802, so θ ≈ 143.3°", "|u| = √(1 + 9 + 4) = √14. Keep the minus sign."]],
      a: "proj = (−2, 1, −2), θ ≈ 143.3°" }
  ],
  mistakes: [
    { wrong: "u · v = −9, so cos θ = 9 ÷ (|u||v|) and θ is acute", why: "Dropping the minus sign turns an obtuse angle into its partner below 90°. The sign is the whole message: negative means the vectors point more apart than together.", fix: "Keep the sign: cos θ ≈ −0.802 gives θ ≈ 143.3°." },
    { wrong: "Scalar projection = (u · v) ÷ |v|²", why: "That is the multiplier for the vector projection. Dividing by |v|² twice shrinks the length by an extra factor of |v|.", fix: "Scalar: divide by |v| once. Vector: divide by |v|² and multiply by v." },
    { wrong: "Projection of u on v = (u · v) ÷ |u|", why: "That is the projection of v on u. The vector you project onto is the one you divide by.", fix: "Projection of u on v = (u · v) ÷ |v|." },
    { wrong: "cos⁻¹ 0.5 = 1.047", why: "The calculator is in radian mode. 1.047 is π/3 in radians, which is correct but not what the question wants in degrees.", fix: "Switch to degree mode: cos⁻¹ 0.5 = 60°." }
  ],
  teach: {
    script: [
      "Draw two arrows from one point. Ask: how could we find the angle between them if we couldn’t use a protractor?",
      "Remind him of the dot product. Then double one arrow. Ask: did the angle change? Did the dot product? So the lengths have to come out: cos θ = u · v ÷ (|u||v|).",
      "Shine a light straight down onto v. The shadow of u has length |u| cos θ. Swap in the formula and one |u| cancels: (u · v) ÷ |v|.",
      "To turn that length into an arrow along v, multiply by a unit vector, v ÷ |v|. That gives ((u · v) ÷ |v|²) v.",
      "Finish with the signs: positive dot product, acute; zero, right angle; negative, obtuse, and the shadow points backwards."
    ],
    board: "Two arrows u and v from one point, with a dashed perpendicular from u’s tip down to v’s line. Shade the shadow on v and label it |u| cos θ. Beside it, write the three formulas in a column.",
    ask: [
      { q: "u · v = −3. Without any lengths, what can you say about the angle?", listen: "“It is more than 90°.” If he says it is negative, ask whether an angle between two arrows can be negative." },
      { q: "Why do we divide by |v| and not |u| for the projection of u on v?", listen: "“The shadow lies along v, so we measure against v.” If unsure, draw the shadow: it sits on v." },
      { q: "If you double v, what happens to the vector projection of u on v?", listen: "“Nothing.” u · v doubles and |v|² goes up 4 times, but then you multiply by the doubled v. The shadow is the same. A good sign if he reasons it rather than guesses." }
    ],
    confusion: "Students mix up the scalar and vector projections. Tie each to its job: the scalar one is a length, so it divides by one length, |v|. The vector one must point along v, so it needs v at the end, and that costs a second division by |v|. Also check degree mode before any angle question."
  },
  recap: [
    "cos θ = (u · v) ÷ (|u||v|). Keep the sign: negative means obtuse.",
    "Scalar projection of u on v: (u · v) ÷ |v|. It is the length of the shadow.",
    "Vector projection: ((u · v) ÷ |v|²) v. It is that shadow pointing along v."
  ]
};

/* ---------------- crossp ---------------- */
const CU1 = [2, 0, 0];
const CV1 = p => [2 * Math.cos(rad(p.phi)), 2 * Math.sin(rad(p.phi)), 0];
const CU2 = [2, 1, 0];
const CV2 = p => [-1, 1, p.h];

CP.LESSONS.crossp = {
  big: "u × v is a new vector at right angles to both u and v. Its length is the area of the parallelogram they make, and swapping the order flips it to point the other way.",
  intro: [
    "The dot product turns two vectors into a number. The <b>cross product</b> turns two vectors in 3D into a third vector. That vector sticks straight out of the flat surface that u and v lie in.",
    "That makes it the tool for “find a direction at right angles to these two”. You will use it for the normal of a plane, the direction of the line where two planes meet, and areas of triangles in space."
  ],
  see: [
    {
      h: "Its length is the area",
      text: "u lies along the x-axis. v has length 2 and turns in the floor. The shaded parallelogram is the one u and v make. The orange arrow is u × v. Drag the picture to look from the side.",
      widget: { type: "vec3", range: 4, yaw: -0.5, pitch: -0.45,
        params: [{ name: "phi", label: "turn v", min: 0, max: 360, step: 1, val: 40, show: v => Math.round(v) + "°" }],
        scene: (p, V) => {
          const v = CV1(p), w = V.cross(CU1, v);
          return [
            { t: "poly", pts: [[0, 0, 0], CU1, V.add(CU1, v), v], c: 4 },
            { t: "vec", to: CU1, c: 1, label: "u" },
            { t: "vec", to: v, c: 2, label: "v" },
            { t: "vec", to: w, c: 3, label: "u × v" }];
        },
        readouts: [
          { label: "angle θ", value: (p, V) => fmt(angOf(CU1, CV1(p)), 1) + "°" },
          { label: "u × v", value: (p, V) => V.fmt(V.cross(CU1, CV1(p))) },
          { label: "area |u × v|", value: (p, V) => fmt(V.norm(V.cross(CU1, CV1(p))), 2) },
          { label: "|u||v| sin θ", value: (p, V) => fmt(4 * Math.sin(rad(angOf(CU1, CV1(p)))), 2) }] },
      tasks: [
        { ask: "Move the slider up, turning v away from u, until the parallelogram is as big as it can be.", check: s => Math.sin(rad(s.phi)) >= 0.9997,
          got: "At θ = 90° the area is 4 = |u||v| = 2 × 2, and u × v = (0, 0, 4): straight up, at right angles to both." },
        { ask: "Now close it flat: turn v until it lies along u.", check: s => Math.abs(Math.sin(rad(s.phi))) < 0.005,
          got: "Area 0 and u × v = (0, 0, 0). Parallel vectors have a zero cross product. sin 0° = 0 and sin 180° = 0." },
        { ask: "Turn v past u so that it sits on the other side of u.", check: s => Math.sin(rad(s.phi)) < -0.5,
          got: "u × v now points down. The area readout stays positive: only the direction flipped." }
      ],
      after: "The length of u × v is |u||v| sin θ, which is the area of the parallelogram: base |u| times height |v| sin θ. Its direction follows the right-hand rule: curl the fingers of your right hand from u to v, and your thumb points along u × v."
    },
    {
      h: "Always at right angles to both",
      text: "Now u = (2, 1, 0) lies in the floor and v = (−1, 1, h) can lift out of it. The dashed line drops from v’s tip to the floor. The last two readouts test the right angles.",
      widget: { type: "vec3", range: 4, yaw: -1.2, pitch: -0.42,
        params: [{ name: "h", label: "lift v (h)", min: -2, max: 2, step: 0.5, val: 1.5, show: v => fmt(v, 1) },
                 { name: "order", label: "order", min: 0, max: 1, step: 1, val: 0, show: v => v >= 0.5 ? "v × u" : "u × v" }],
        scene: (p, V) => {
          const v = CV2(p), sw = p.order >= 0.5, w = sw ? V.cross(v, CU2) : V.cross(CU2, v);
          return [
            { t: "poly", pts: [[0, 0, 0], CU2, V.add(CU2, v), v], c: 4 },
            { t: "seg", a: v, b: [v[0], v[1], 0], c: 5, dash: true },
            { t: "vec", to: CU2, c: 1, label: "u" },
            { t: "vec", to: v, c: 2, label: "v" },
            { t: "vec", to: w, c: 3, label: sw ? "v × u" : "u × v" }];
        },
        readouts: [
          { label: "v", value: (p, V) => V.fmt(CV2(p)) },
          { label: "answer", value: (p, V) => (p.order >= 0.5 ? "v × u = " : "u × v = ") + V.fmt(p.order >= 0.5 ? V.cross(CV2(p), CU2) : V.cross(CU2, CV2(p))) },
          { label: "area", value: (p, V) => fmt(V.norm(V.cross(CU2, CV2(p))), 2) },
          { label: "answer · u", value: (p, V) => fmt(V.dot(V.cross(CU2, CV2(p)), CU2), 2) },
          { label: "answer · v", value: (p, V) => fmt(V.dot(V.cross(CU2, CV2(p)), CV2(p)), 2) }] },
      tasks: [
        { ask: "Lower v until it lies flat in the floor (h = 0).", check: s => Math.abs(s.h) < 0.01,
          got: "u × v = (0, 0, 3): straight up. When u and v both lie in the floor, the only direction at right angles to both is vertical." },
        { ask: "Lift v to h = 2. Watch u × v tip over.", check: s => s.h > 1.99,
          got: "u × v = (2, −4, 3). Dot it with u: 4 − 4 + 0 = 0. With v: −2 − 4 + 6 = 0. It still meets both at right angles." },
        { ask: "Set the order to v × u.", check: s => s.order >= 0.5,
          got: "Every component flips sign. At h = 2, v × u = (−2, 4, −3): same length, opposite direction. Order matters: v × u = −(u × v)." }
      ],
      after: "Whatever you do to v, the two dot products stay at 0. That is the point of the cross product: it builds a vector at right angles to two others. Swap the order and you get the other of the two possible directions."
    }
  ],
  why: {
    lead: "Where does the formula come from? Ask for a vector n with n · u = 0 and n · v = 0. The formula is the answer, and you can check that it works by expanding. The length comes from comparing with the dot product.",
    steps: [
      ["u × v = (u₂v₃ − u₃v₂,  u₃v₁ − u₁v₃,  u₁v₂ − u₂v₁)", "The definition. Each component skips its own position: 2-3, then 3-1, then 1-2."],
      ["u · (u × v) = u₁u₂v₃ − u₁u₃v₂ + u₂u₃v₁ − u₂u₁v₃ + u₃u₁v₂ − u₃u₂v₁", "Dot it with u. Six terms."],
      ["= 0", "The terms cancel in pairs: u₁u₂v₃ with −u₂u₁v₃, and so on. So u × v is at right angles to u. The same works for v."],
      ["|u × v|² = |u|²|v|² − (u · v)²", "Expand both sides in components and every term matches. (Long, but only algebra.)"],
      ["= |u|²|v|² − |u|²|v|² cos²θ = |u|²|v|² sin²θ", "Use u · v = |u||v| cos θ, then 1 − cos²θ = sin²θ."],
      ["|u × v| = |u||v| sin θ", "Square root. sin θ ≥ 0 for θ from 0° to 180°."],
      ["area = base × height = |u| × |v| sin θ", "The parallelogram has base |u| and height |v| sin θ. That is exactly |u × v|."],
      ["v × u = (v₂u₃ − v₃u₂, …) = −(u × v)", "Swapping u and v swaps the two products in every component, so every sign flips."]
    ],
    end: "Two vectors pointing the same or opposite ways have sin θ = 0, so their cross product is the zero vector. There is no single direction at right angles to both: every direction around them works. And u × u = 0 for every u."
  },
  examples: [
    { q: "Find u × v for u = (1, 2, 0) and v = (2, −1, 1).",
      steps: [["first: u₂v₃ − u₃v₂ = (2)(1) − (0)(−1) = 2", "Skip position 1. Use positions 2 and 3."],
              ["second: u₃v₁ − u₁v₃ = (0)(2) − (1)(1) = −1", "Skip position 2. The order is 3-1, so u₃ comes first."],
              ["third: u₁v₂ − u₂v₁ = (1)(−1) − (2)(2) = −5", "Skip position 3. Use positions 1 and 2."],
              ["u × v = (2, −1, −5)", "Put them together."],
              ["(2, −1, −5) · u = 2 − 2 + 0 = 0,  · v = 4 + 1 − 5 = 0", "Check: right angles to both."]],
      a: "u × v = (2, −1, −5)" },
    { q: "Find the area of the parallelogram with sides u = (2, −1, 3) and v = (1, 4, −2).",
      steps: [["first: (−1)(−2) − (3)(4) = 2 − 12 = −10", "u₂v₃ − u₃v₂."],
              ["second: (3)(1) − (2)(−2) = 3 + 4 = 7", "u₃v₁ − u₁v₃. Slow down on the signs here."],
              ["third: (2)(4) − (−1)(1) = 8 + 1 = 9", "u₁v₂ − u₂v₁."],
              ["u × v = (−10, 7, 9)", "The cross product."],
              ["|u × v| = √(100 + 49 + 81) = √230 ≈ 15.17", "The area is the length of the cross product."]],
      a: "√230 ≈ 15.17 square units" },
    { q: "Find the area of the triangle with corners A(1, 0, 2), B(3, 1, 1) and C(0, 2, 4).",
      steps: [["AB = B − A = (2, 1, −1),  AC = C − A = (−1, 2, 2)", "Two sides from the same corner."],
              ["AB × AC = ((1)(2) − (−1)(2), (−1)(−1) − (2)(2), (2)(2) − (1)(−1))", "The cross product formula."],
              ["= (4, −3, 5)", "2 + 2 = 4, 1 − 4 = −3, 4 + 1 = 5."],
              ["|AB × AC| = √(16 + 9 + 25) = √50 ≈ 7.07", "That is the parallelogram on AB and AC."],
              ["triangle = ½ × √50 ≈ 3.54", "A triangle is half the parallelogram."]],
      a: "½√50 ≈ 3.54 square units" }
  ],
  mistakes: [
    { wrong: "Middle component = u₁v₃ − u₃v₁", why: "This is the most common slip. The cycle runs 2-3, 3-1, 1-2, so the middle one starts with u₃. Writing it the other way flips the sign of just that component, and the result is no longer at right angles to u and v.", fix: "Middle = u₃v₁ − u₁v₃. Then check with a dot product." },
    { wrong: "v × u = u × v", why: "Swapping the order swaps the two products in every component. The picture showed the arrow flip to the opposite direction.", fix: "v × u = −(u × v)." },
    { wrong: "u × v = (u₁v₁, u₂v₂, u₃v₃)", why: "Multiplying matching components is the first step of a dot product. The cross product always mixes different positions.", fix: "Each component uses the other two positions: u₂v₃ − u₃v₂, and so on." },
    { wrong: "Area of triangle ABC = |AB × AC|", why: "|AB × AC| is the area of the whole parallelogram. The triangle is half of it, cut along the diagonal.", fix: "Triangle area = ½|AB × AC|." }
  ],
  teach: {
    script: [
      "Lay two pens flat on the table in a V. Ask: which way points at right angles to both of them? (Straight up, or straight down.)",
      "The cross product picks one of those two. Curl your right hand from the first pen to the second; your thumb shows which one.",
      "Write the formula with the cycle 2-3, 3-1, 1-2 next to it. Do one with him, slowly, saying each sign out loud.",
      "Always check the answer: dot it with u and with v. Both must be 0. This catches nearly every sign slip.",
      "Close the V until the pens line up. The area goes to 0, and so does the cross product. Then swap the pens and watch the thumb flip."
    ],
    board: "Write u and v as two columns of three, side by side. For each component, cover its own row and cross-multiply the other two rows: rows 2-3, then 3-1, then 1-2. Next to it, sketch the parallelogram with u × v standing up out of it.",
    ask: [
      { q: "What is i × j, where i = (1, 0, 0) and j = (0, 1, 0)? Which way does it point?", listen: "“(0, 0, 1), straight up: k.” If he gets (0, 0, −1), go back to the third component: u₁v₂ − u₂v₁ = 1 − 0." },
      { q: "u × v = (0, 0, 0). What does that tell you about u and v?", listen: "“They are parallel” (or one is zero). Push for why: the parallelogram is flat, so it has no area." },
      { q: "How can you check a cross product answer without redoing it?", listen: "“Dot it with u and with v. Both should be 0.” This is the habit you want." }
    ],
    confusion: "Students get the middle component wrong more than anything else. Don’t let him memorize “minus the middle” tricks from determinants unless he already knows them. Teach the cycle 2-3, 3-1, 1-2 and the dot-product check. The second trouble is order: v × u is a different answer, so read the question carefully."
  },
  recap: [
    "u × v = (u₂v₃ − u₃v₂, u₃v₁ − u₁v₃, u₁v₂ − u₂v₁). Check it: its dot product with u and with v is 0.",
    "|u × v| = |u||v| sin θ, the area of the parallelogram. Parallel vectors give the zero vector.",
    "Order matters: v × u = −(u × v). The right-hand rule tells you which way it points."
  ]
};

/* ---------------- triple ---------------- */
const TV = [3, 0, 0], TW = [1, 2, 0]; /* v × w = (0, 0, 6) */
const TU = p => [0, p.a, p.h];
const box = (u, v, w, c, cb) => {
  const A = V.add, o = [0, 0, 0];
  return [
    { t: "poly", pts: [o, v, A(v, w), w], c: cb, op: 0.22 },
    { t: "poly", pts: [o, v, A(v, u), u], c, op: 0.08 },
    { t: "poly", pts: [w, A(v, w), A(A(v, w), u), A(w, u)], c, op: 0.08 },
    { t: "poly", pts: [o, w, A(w, u), u], c, op: 0.08 },
    { t: "poly", pts: [v, A(v, w), A(A(v, w), u), A(v, u)], c, op: 0.08 },
    { t: "poly", pts: [u, A(u, v), A(A(u, v), w), A(u, w)], c, op: 0.14 }];
};
const PU = [1, 0, 1], PV = [0, 2, 1], PN = [-2, -1, 2]; /* PN = u × v, length 3 */
const PW = p => [2, 1, p.k];
const T2 = p => V.dot(PU, V.cross(PV, PW(p))); /* = 2k − 5 */

CP.LESSONS.triple = {
  big: "u · (v × w) is the volume of the slanted box that u, v and w make, give or take a sign. When it is 0 the box is flat, so the three vectors lie in one plane.",
  intro: [
    "Three vectors from one corner make a slanted box called a <b>parallelepiped</b>: six faces, each a parallelogram. The <b>triple product</b> u · (v × w) is a cross product inside a dot product, and it gives the box’s volume in one calculation.",
    "This step also collects the rules of vector algebra: which ones hold (dot products can swap order) and which ones fail (cross products flip when swapped, and neither product can be regrouped). The fast way to test a rule is to try it on simple vectors."
  ],
  see: [
    {
      h: "Volume is base times height",
      text: "The base is the parallelogram of v = (3, 0, 0) and w = (1, 2, 0), so v × w = (0, 0, 6) and the base area is 6. The third edge is u = (0, a, h). Slide it sideways or change its height and watch the volume.",
      widget: { type: "vec3", range: 4, yaw: -0.5, pitch: -0.35,
        params: [{ name: "a", label: "slide u (a)", min: -2, max: 2, step: 0.5, val: 0, show: v => fmt(v, 1) },
                 { name: "h", label: "height of u (h)", min: -2, max: 3, step: 0.25, val: 2, show: v => fmt(v, 2) }],
        scene: (p, V) => {
          const u = TU(p);
          return box(u, TV, TW, 1, 2).concat([
            { t: "seg", a: u, b: [u[0], u[1], 0], c: 3, dash: true },
            { t: "vec", to: TV, c: 2, label: "v" },
            { t: "vec", to: TW, c: 2, label: "w" },
            { t: "vec", to: u, c: 1, label: "u" }]);
        },
        readouts: [
          { label: "u", value: (p, V) => V.fmt(TU(p)) },
          { label: "base |v × w|", value: () => "6" },
          { label: "u · (v × w)", value: (p, V) => fmt(V.dot(TU(p), V.cross(TV, TW)), 2) },
          { label: "volume", value: (p, V) => fmt(Math.abs(V.dot(TU(p), V.cross(TV, TW))), 2) }] },
      tasks: [
        { ask: "The volume is 12. Slide u sideways as far as it goes, either way.", check: s => Math.abs(s.a) > 1.99 && near(s.h, 2, 0.01),
          got: "The box leans over, but the volume stays 12. Its height is still 2, so base 6 × height 2 = 12. Sliding the top (a shear) never changes the volume." },
        { ask: "Find the height that makes the volume 18.", check: s => near(s.h, 3, 0.01),
          got: "h = 3. u · (v × w) = 0 + 0 + 3 × 6 = 18. Base 6 × height 3." },
        { ask: "Lower u all the way into the floor.", check: s => Math.abs(s.h) < 0.01,
          got: "Volume 0. Now u lies in the same plane as v and w, and the box is flat. A zero triple product means the three vectors are coplanar." },
        { ask: "Push u below the floor, to height −1.", check: s => near(s.h, -1, 0.01),
          got: "u · (v × w) = −6, but the volume is |−6| = 6. The minus sign only says u points to the other side of the base from v × w." }
      ],
      after: "u · (v × w) = |u||v × w| cos α, where α is the angle between u and v × w. |v × w| is the base area and |u| cos α is the height, so the triple product is base × height. Sliding u sideways leaves the height alone, so the volume stays the same."
    },
    {
      h: "When is the box flat?",
      text: "u = (1, 0, 1) and v = (0, 2, 1) are fixed, and the grey square is the plane they lie in. Their parallelogram is the base. Slide k to move w = (2, 1, k). The dashed line is w’s height off that plane.",
      widget: { type: "vec3", range: 4, yaw: 0.4, pitch: -0.3,
        params: [{ name: "k", label: "k", min: -2, max: 3, step: 0.5, val: 0, show: v => fmt(v, 1) }],
        scene: (p, V) => {
          const w = PW(p), t = V.dot(w, PN) / 9, foot = V.sub(w, V.scale(PN, t));
          const A = V.add, uv = A(PU, PV);
          return [{ t: "plane", n: PN, d: 0, c: 5, size: 2.6 },
            { t: "poly", pts: [[0, 0, 0], PU, uv, PV], c: 1, op: 0.3 },
            { t: "poly", pts: [w, A(w, PU), A(w, uv), A(w, PV)], c: 2, op: 0.12 },
            { t: "poly", pts: [[0, 0, 0], PU, A(PU, w), w], c: 2, op: 0.05 }, { t: "poly", pts: [[0, 0, 0], PV, A(PV, w), w], c: 2, op: 0.05 },
            { t: "poly", pts: [PU, uv, A(uv, w), A(PU, w)], c: 2, op: 0.05 }, { t: "poly", pts: [PV, uv, A(uv, w), A(PV, w)], c: 2, op: 0.05 },
            { t: "seg", a: w, b: foot, c: 3, dash: true },
            { t: "vec", to: PU, c: 1, label: "u" },
            { t: "vec", to: PV, c: 1, label: "v" },
            { t: "vec", to: w, c: 2, label: "w" }];
        },
        readouts: [
          { label: "w", value: (p, V) => V.fmt(PW(p)) },
          { label: "u · (v × w)", value: p => fmt(T2(p), 2) },
          { label: "w · (u × v)", value: (p, V) => fmt(V.dot(PW(p), V.cross(PU, PV)), 2) },
          { label: "v · (u × w)", value: (p, V) => fmt(V.dot(PV, V.cross(PU, PW(p))), 2) },
          { label: "height of w", value: p => fmt(Math.abs(T2(p)) / 3, 2) }] },
      tasks: [
        { ask: "Slide k until w lies flat in the plane of u and v.", check: s => Math.abs(T2(s)) < 0.01,
          got: "At k = 2.5, u · (v × w) = 0 and the box is flat. In fact w = (2, 1, 2.5) = 2u + 0.5v, built from u and v." },
        { ask: "Go one step further, to k = 3.", check: s => near(s.k, 3, 0.01),
          got: "u · (v × w) = 1. It changed sign because w crossed through the plane to the other side. Look at v · (u × w): it is −1, the opposite sign." },
        { ask: "Find the k that makes the volume 9.", check: s => near(s.k, -2, 0.01),
          got: "k = −2 gives u · (v × w) = −9, so the volume is 9. Base |u × v| = 3 times height 3. Here w = (2, 1, −2) stands at right angles to the plane, so its whole length, 3, is the height." }
      ],
      after: "The triple product here works out to 2k − 5, so it is 0 only at k = 2.5. Notice the readouts: w · (u × v) always equals u · (v × w), because a cycle u → v → w keeps the order. Swapping two of them, as in v · (u × w), flips the sign."
    }
  ],
  why: {
    lead: "The volume of any slanted box is base area times height, where the height is measured straight up from the base. The cross product gives the base, and the dot product finds the height.",
    steps: [
      ["base area = |v × w|", "The base is the parallelogram of v and w. Its area is the length of v × w."],
      ["v × w is at right angles to the base", "So the height is measured along v × w."],
      ["height = |u| |cos α|", "α is the angle between u and v × w. The height is the part of u along that direction: its projection."],
      ["u · (v × w) = |u||v × w| cos α", "The dot product rule from the angles step."],
      ["|u · (v × w)| = base × height = volume", "Put the pieces together."],
      ["(u + sv + tw) · (v × w) = u · (v × w)", "Shear: v · (v × w) = 0 and w · (v × w) = 0. Sliding u along the base adds nothing."],
      ["u · (v × w) = 0 ⇔ u, v, w are coplanar", "Zero volume means zero height: u lies in the plane of v and w."],
      ["i × (i × j) = i × k = −j,  but (i × i) × j = 0 × j = 0", "One counterexample shows the cross product can’t be regrouped."]
    ],
    end: "The other laws come from the definitions. u · v = v · u because u₁v₁ = v₁u₁, and so on. u × v = −(v × u) because swapping the order swaps each subtraction. Both products distribute: u · (v + w) = u · v + u · w and u × (v + w) = u × v + u × w."
  },
  examples: [
    { q: "True or false: (u × v) × w = u × (v × w) for all vectors. Test it with u = i, v = i, w = j.",
      steps: [["i × i = (0, 0, 0)", "Any vector crossed with itself gives the zero vector."],
              ["(i × i) × j = 0 × j = (0, 0, 0)", "The left side."],
              ["i × j = (0·0 − 0·1, 0·0 − 1·0, 1·1 − 0·0) = (0, 0, 1) = k", "Start the right side from the inside."],
              ["i × k = (0·1 − 0·0, 0·0 − 1·1, 1·0 − 0·0) = (0, −1, 0) = −j", "Now the outer cross product."],
              ["(0, 0, 0) ≠ (0, −1, 0)", "One failure is enough to rule out a law."]],
      a: "False. The cross product is not associative." },
    { q: "Find the volume of the parallelepiped with edges u = (−2, 1, 0), v = (1, 3, −1) and w = (0, 2, 4).",
      steps: [["v × w = (3·4 − (−1)·2, (−1)·0 − 1·4, 1·2 − 3·0)", "Cross product first: 2-3, 3-1, 1-2."],
              ["v × w = (14, −4, 2)", "12 + 2 = 14, 0 − 4 = −4, 2 − 0 = 2."],
              ["u · (v × w) = (−2)(14) + (1)(−4) + (0)(2) = −32", "Dot with u."],
              ["volume = |−32| = 32", "A volume is never negative."]],
      a: "32 cubic units" },
    { q: "For which k do u = (1, 2, 0), v = (0, 1, −1) and w = (2, 3, k) lie in one plane?",
      steps: [["coplanar ⇔ u · (v × w) = 0", "In one plane means the box is flat."],
              ["v × w = (1·k − (−1)·3, (−1)·2 − 0·k, 0·3 − 1·2) = (k + 3, −2, −2)", "Keep k as a letter."],
              ["u · (v × w) = (k + 3) − 4 + 0 = k − 1", "Dot with u = (1, 2, 0)."],
              ["k − 1 = 0, so k = 1", "Set it to 0 and solve."],
              ["check: 2u − v = (2, 4, 0) − (0, 1, −1) = (2, 3, 1) = w", "w is built from u and v, so it really is in their plane."]],
      a: "k = 1" }
  ],
  mistakes: [
    { wrong: "Volume = −32", why: "The triple product can be negative. That only tells you which side of the base the third edge sits on. A volume can’t be negative.", fix: "Volume = |u · (v × w)| = 32." },
    { wrong: "Volume = |u| × |v| × |w|", why: "Multiplying edge lengths only works for a box with right angles. A slanted box has less volume, as the shear in the picture showed: the edge got longer, the volume stayed the same.", fix: "Volume = |u · (v × w)|. It handles the slant for you." },
    { wrong: "Volume = |v × w|", why: "That is the area of the base, a parallelogram. You still need the height, which comes from dotting with the third edge.", fix: "Dot v × w with u, then take the absolute value." },
    { wrong: "u × v = v × u, and (u × v) × w = u × (v × w)", why: "These are true for ordinary numbers, so they feel safe. For the cross product, swapping flips the sign and regrouping changes the answer. Test with i and j: i × j = k but j × i = −k.", fix: "u × v = −(v × u). The cross product is not associative." }
  ],
  teach: {
    script: [
      "Stack a deck of cards into a neat box. Then push the top so the deck leans. Ask: did the volume change? (No: same cards, same height.)",
      "So volume is base area times straight-up height, however much it leans. The cross product v × w gives the base area and points straight up from it.",
      "The height is the part of u along v × w: that is a projection, which is a dot product. Put them together: u · (v × w).",
      "Now flatten the deck onto the table. Height 0, volume 0. So a zero triple product means the three vectors lie in one plane.",
      "For the vector laws, hand him i, j and k. Any claimed rule must survive them. One failure kills it."
    ],
    board: "A slanted box with edges u, v and w from one corner. Shade the base (v and w), draw v × w straight up from it, and a dashed height from the tip of u down to the base. Write: volume = |u · (v × w)| = base × height.",
    ask: [
      { q: "u · (v × w) = −10. What is the volume?", listen: "“10.” If he says −10, ask whether a box can hold negative water. The sign only says which side u is on." },
      { q: "If u · (v × w) = 0, what do you know about the three vectors?", listen: "“They lie in one plane.” Also accept that one is built from the other two. Ask him to picture the flat box." },
      { q: "Is u · (v × w) the same as w · (u × v)? What about v · (u × w)?", listen: "“The first, yes: it is a cycle. The second flips the sign, because u and v swapped.” If unsure, let him try the picture’s readouts." }
    ],
    confusion: "The common mix-up is between the base area and the volume: he stops after v × w and reports its length. Ask “where is the height?” every time. The second is the sign: the triple product can be negative, but the volume is its absolute value. For the laws, students trust patterns from ordinary numbers. Insist on a test with i, j and k."
  },
  recap: [
    "Volume of the box with edges u, v, w = |u · (v × w)|: base area |v × w| times height.",
    "u · (v × w) = 0 means the three vectors lie in one plane. Leaning the box (a shear) never changes its volume.",
    "u · v = v · u, but u × v = −(v × u). Neither product can be regrouped. Test any law with i, j and k."
  ]
};
})();
