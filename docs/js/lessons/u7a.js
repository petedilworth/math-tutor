/* Full lessons: lines in 2D, lines in space, equations of planes, plane equations in every form. */
window.CP = window.CP || {};
(function () {
CP.LESSONS = CP.LESSONS || {};
const { fmt } = CP.W, PI = Math.PI, V = CP.V;
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const same = (a, b) => a.every((x, i) => Math.abs(x - b[i]) < 1e-6);
const nearV = (a, b, tol) => a.every((x, i) => Math.abs(x - b[i]) <= tol);
/* "x − 2y + 3z = 4" from a normal and d */
const eq3 = (n, d) => {
  let s = "";
  ["x", "y", "z"].forEach((v, i) => {
    const c = n[i]; if (Math.abs(c) < 1e-9) return;
    const a = Math.abs(c), co = Math.abs(a - 1) < 1e-9 ? "" : fmt(a, 2);
    s += s ? (c < 0 ? " − " : " + ") + co + v : (c < 0 ? "−" : "") + co + v;
  });
  return (s || "0") + " = " + fmt(d, 2);
};

/* ======================= LINES IN 2D ======================= */
const L2P = [-2, 1], L2D = [2, 1];
const l2orig = s => same(s.u, L2P) && same(s.v, L2D);
CP.LESSONS.lines2d = {
  big: "A line is a starting point plus any number of steps along a direction: r = P + td. Turn the direction (a, b) a quarter turn to (b, −a) and you have the normal, which gives the scalar form Ax + By + C = 0.",
  intro: [
    "You already know y = mx + b. That form breaks for vertical lines, and it does not carry over to 3D. Vectors give a better way to describe a line: pick a point on it, pick a direction along it, and say how far you travel.",
    "This step has three ways to write the same line. The vector form r = (x₀, y₀) + t(a, b) is a set of travel instructions. The parametric form splits them into x and y. The scalar form Ax + By + C = 0 is a test: put a point in, and you get 0 only if the point is on the line."
  ],
  see: [
    {
      h: "Walk along the line",
      text: "The teal dot is P = (−2, 1), the start. The purple arrow is the direction d = (2, 1). The orange dot is r = P + td. Slide t and watch it walk. In coordinates, the line is x = −2 + 2t, y = 1 + t.",
      widget: { type: "vec2", mode: "line", u: L2P.slice(), v: L2D.slice(), t0: 0.5, tmin: -3, tmax: 3 },
      tasks: [
        { ask: "Slide t to 0. Where is the orange dot?", check: s => near(s.t, 0, 0.03), got: "Right on P = (−2, 1). t = 0 means no steps taken yet." },
        { ask: "Find where the line crosses the y-axis.", check: s => l2orig(s) && near(s.pt[0], 0, 0.03), got: "t = 1 lands on (0, 2). Solving x = −2 + 2t = 0 gives the same t = 1." },
        { ask: "Walk to the point (4, 4).", check: s => l2orig(s) && nearV(s.pt, [4, 4], 0.05), got: "t = 3: three copies of d added to P. (−2, 1) + 3(2, 1) = (4, 4)." },
        { ask: "Now reach (−4, 0), which is behind P.", check: s => l2orig(s) && nearV(s.pt, [-4, 0], 0.05), got: "t = −1. A negative t walks backwards, against the arrow. The line runs forever both ways." },
        { ask: "Drag the tip of d to make the line horizontal.", check: s => Math.abs(s.v[1]) < 1e-9 && Math.abs(s.v[0]) > 0.1, got: "d has no y part now, so y never changes as you walk. The scalar form reads 0x: the whole equation just says y is fixed." }
      ],
      after: "Every point on the line is P plus t copies of d. Split into coordinates, that is x = −2 + 2t and y = 1 + t: the parametric form. The scalar form you started with, x − 2y + 4 = 0, describes the same line with no t at all."
    },
    {
      h: "The normal is d turned a quarter turn",
      text: "The green arrow is the normal: it sticks out of the line at a right angle. Its numbers are A and B in the scalar form under the picture. Drag the tip of d and watch A and B follow it.",
      widget: { type: "vec2", mode: "line", u: [1, 2], v: [3, 1], t0: -1, tmin: -3, tmax: 3 },
      tasks: [
        { ask: "Drag the tip of d so that d = (2, 1). What are A and B?", check: s => same(s.v, [2, 1]), got: "1x − 2y: the normal is (1, −2). Swap 2 and 1 to get (1, 2), then change the sign of the second number." },
        { ask: "Now make d = (−1, 3). Predict the normal before you look.", check: s => same(s.v, [-1, 3]), got: "Swap to get (3, −1), then change the second sign: (3, 1). Check: (3, 1) · (−1, 3) = −3 + 3 = 0, so they meet at a right angle." },
        { ask: "Make the normal point straight up.", check: s => Math.abs(s.n[0]) < 1e-9 && s.n[1] > 0.1, got: "d points left along the x-axis, and the normal points up. The normal (b, −a) is always d turned a quarter turn clockwise." },
        { ask: "Now drag P until C becomes 0.", check: s => Math.abs(s.c) < 1e-9, got: "C = 0 means (0, 0) fits the equation: the line passes through the origin. Moving P slides the line but never changes A or B." }
      ],
      after: "The direction fixes A and B. The point fixes C. So to write the scalar form, swap the direction’s numbers, change one sign, then put the point in to find C."
    }
  ],
  why: {
    lead: "A point R = (x, y) is on the line exactly when you can get from P to R by moving along d. Each of the three forms says that in its own way.",
    steps: [
      ["R − P = td", "To reach R from P, you travel some number t of copies of d."],
      ["r = (x₀, y₀) + t(a, b)", "Move P to the other side. That is the vector form."],
      ["x = x₀ + at,  y = y₀ + bt", "Read the vector equation one coordinate at a time: the parametric form."],
      ["n = (b, −a),  n · d = ba − ab = 0", "Swap and change one sign. The dot product is 0, so n is at right angles to d."],
      ["n · (R − P) = 0", "R − P runs along d, so it is at right angles to n as well."],
      ["b(x − x₀) − a(y − y₀) = 0", "Write out the dot product."],
      ["Ax + By + C = 0,  with A = b, B = −a, C = −(Ax₀ + By₀)", "Expand. That is the scalar form, and the point sets C."]
    ],
    end: "The slope of the line is b ÷ a, the rise over the run of d. From the scalar form it is −A ÷ B = −b ÷ (−a), the same number. Two lines are parallel when their normals are multiples of each other. Substitute one into the other and the t term vanishes (its coefficient is n · d = 0), so there is no crossing unless they are the same line."
  },
  examples: [
    { q: "Write r = (3, −1) + t(2, 5) in scalar form.",
      steps: [["d = (2, 5), so n = (5, −2)", "Swap, then change the sign of the second number."], ["5x − 2y + C = 0", "The normal gives A and B."], ["5(3) − 2(−1) + C = 0", "Put in the point (3, −1)."], ["17 + C = 0, so C = −17", "15 + 2 = 17."]],
      a: "5x − 2y − 17 = 0" },
    { q: "Where do 2x + y − 7 = 0 and x − 3y + 7 = 0 cross?",
      steps: [["(2, 1) and (1, −3) are not multiples", "Check first: the normals differ, so the lines are not parallel and cross once."], ["6x + 3y − 21 = 0", "Multiply the first equation by 3 so the y terms will cancel."], ["7x − 14 = 0", "Add the second equation: 6x + x, 3y − 3y, −21 + 7."], ["x = 2", "Solve."], ["2(2) + y − 7 = 0, so y = 3", "Substitute back into the first equation."], ["2 − 3(3) + 7 = 0 ✓", "Check in the second equation."]],
      a: "(2, 3)" },
    { q: "Where does the line x = 1 + 2t, y = −2 + 3t meet 3x − y − 11 = 0?",
      steps: [["n · d = (3, −1) · (2, 3) = 3", "Not 0, so the lines are not parallel. They cross."], ["3(1 + 2t) − (−2 + 3t) − 11 = 0", "Substitute x and y into the scalar equation."], ["3 + 6t + 2 − 3t − 11 = 0", "Expand. Watch the minus in front of the bracket."], ["3t − 6 = 0, so t = 2", "Collect terms and solve."], ["x = 1 + 4 = 5,  y = −2 + 6 = 4", "Put t = 2 back into the parametric equations."], ["3(5) − 4 − 11 = 0 ✓", "Check."]],
      a: "(5, 4)" }
  ],
  mistakes: [
    { wrong: "r = (1, 2) + t(3, 1) is 3x + y − 5 = 0", why: "That uses the direction (3, 1) as the normal. A and B must be at right angles to the line, not along it. The point (1, 2) fits, but the line is tilted the wrong way.", fix: "Normal (1, −3): x − 3y + 5 = 0." },
    { wrong: "Direction (4, 3) gives normal (3, 4)", why: "Swapping alone is not enough. (3, 4) · (4, 3) = 24, not 0, so they are not at right angles.", fix: "Swap and change one sign: (3, −4). Check: 12 − 12 = 0." },
    { wrong: "Through (2, −1) with normal (3, 4): 3x + 4y + 2 = 0", why: "Sign slip in C. 3(2) + 4(−1) = 2, so C must be −2 to make the total 0.", fix: "3x + 4y − 2 = 0" },
    { wrong: "Forcing a crossing point for 2x + y − 3 = 0 and 4x + 2y − 1 = 0", why: "The normals (2, 1) and (4, 2) are multiples, so the lines are parallel. Elimination gives −5 = 0, which is impossible. That is the algebra saying “no point”.", fix: "Compare the normals first. Parallel and different means no crossing at all." }
  ],
  teach: {
    script: [
      "Put a dot on the grid and draw one arrow from it. Ask: what are all the places you can reach by sliding along this arrow, forwards or backwards? That set is the line.",
      "Write r = P + td and read it as travel instructions: start at P, take t steps of d. Try t = 0, 1, 2 and −1 out loud and plot each one.",
      "Split it into x and y. That is the parametric form: the same instructions, one coordinate at a time.",
      "Now the normal. Draw d = (2, 1), then (1, −2) from the same point. Ask him to check the angle with a dot product. Swap and change one sign always gives a right angle.",
      "Finish with the test: a point is on the line when R − P is at right angles to the normal. Written out, that is Ax + By + C = 0, and C comes from putting P in."
    ],
    board: "A grid with P = (−2, 1) and d = (2, 1). Mark the points for t = −1, 0, 1, 2, 3 and join them. Draw the normal (1, −2) at P with a right-angle box.",
    ask: [
      { q: "Is (6, 5) on r = (−2, 1) + t(2, 1)?", listen: "x needs t = 4 and y needs t = 4, so yes. If he finds t from x only, ask him to check y with the same t." },
      { q: "What is a normal to the direction (−3, 5)?", listen: "(5, 3), or any multiple such as (−5, −3). Ask him to check with the dot product: −15 + 15 = 0." },
      { q: "Two lines have directions (2, −1) and (−4, 2). Can they cross?", listen: "Only if they are the same line: (−4, 2) = −2(2, −1), so they are parallel. If he starts solving, stop him and ask him to compare the directions first." }
    ],
    confusion: "The usual mix-up is between the direction and the normal. In r = P + td, the numbers in d run along the line. In Ax + By + C = 0, the numbers A and B stick out of it at a right angle. When he is unsure which is which, have him draw both arrows on the grid. The second slip is finding t from one coordinate and never checking the other."
  },
  recap: [
    "Vector form r = P + td: start at P and take t steps of d. The parametric form is the same thing split into x and y.",
    "Direction (a, b) gives normal (b, −a). The normal’s numbers are A and B in Ax + By + C = 0.",
    "Put a point in to find C. Parallel lines have matching normals and never cross unless they are the same line."
  ]
};

/* ======================= LINES IN SPACE ======================= */
const LP = [-3, -1, 2], LQ = [-1, 0, 1], LD = [2, 1, -1];
const LP2 = [1, 2, -1], LD2 = [1, -1, 2], LA = [3, 0, 3], LB = [0, 3, -2];
CP.LESSONS.lines = {
  big: "A line in space is a point plus any multiple of a direction: r = P + t(Q − P). The direction is a trip, where you end minus where you start, and every coordinate has to agree on the same t.",
  intro: [
    "In 2D, one equation like 2x + y = 7 pins down a line. In 3D that trick fails: one equation in x, y and z describes a whole flat sheet, a plane. So for a line in space you go back to travel instructions: a starting point and a direction.",
    "Given two points P and Q, the direction is the trip from P to Q, which is Q − P. Then r = P + t(Q − P) reaches P at t = 0, Q at t = 1, and every other point on the line at some other value of t."
  ],
  see: [
    {
      h: "From P to Q and beyond",
      text: "P and Q are the teal dots. The purple arrow is d = Q − P = (2, 1, −1). The orange dot is P + td. The dashed line drops from it to the floor (the xy-plane), so you can judge its height. Drag the picture to turn it.",
      widget: { type: "vec3", range: 4, yaw: -0.5, pitch: 0.35,
        params: [{ name: "t", label: "t", min: -0.5, max: 3, step: 0.05, val: -0.5 }],
        scene: (p, V) => {
          const R = V.add(LP, V.scale(LD, p.t)), floor = Math.abs(R[2]) < 0.03;
          return [
            { t: "line", p: LP, d: LD, c: 5 },
            { t: "seg", a: R, b: [R[0], R[1], 0], c: 5, dash: true },
            { t: "vec", from: LP, to: LD, c: 2 },
            { t: "pt", at: LP, c: 1, label: "P" },
            { t: "pt", at: LQ, c: 1, label: "Q" },
            { t: "pt", at: R, c: floor ? 4 : 3, label: floor ? "on the floor" : "t = " + fmt(p.t, 2) }
          ];
        },
        readouts: [
          { label: "x = −3 + 2t", value: p => fmt(LP[0] + LD[0] * p.t, 2) },
          { label: "y = −1 + t", value: p => fmt(LP[1] + LD[1] * p.t, 2) },
          { label: "z = 2 − t", value: p => fmt(LP[2] + LD[2] * p.t, 2) }
        ] },
      tasks: [
        { ask: "Slide t to 0.", check: s => near(s.t, 0, 0.03), got: "The dot sits on P = (−3, −1, 2). No steps taken." },
        { ask: "Slide t to 1.", check: s => near(s.t, 1, 0.03), got: "You land on Q = (−1, 0, 1). One full step of Q − P takes you from P to Q." },
        { ask: "Find the point halfway between P and Q.", check: s => near(s.t, 0.5, 0.03), got: "t = 0.5 gives (−2, −0.5, 1.5), the midpoint. Fractions of a step land between the points." },
        { ask: "Walk to (3, 2, −1).", check: s => near(s.t, 3, 0.03), got: "t = 3: three steps of d past P. You can use Q − P as many times as you like." },
        { ask: "Find where the line goes through the floor (z = 0).", check: s => near(s.t, 2, 0.03), got: "z = 2 − t = 0 at t = 2. Put t = 2 into x and y: the line crosses the floor at (1, 1, 0)." }
      ],
      after: "The three readouts are the parametric equations: x = −3 + 2t, y = −1 + t, z = 2 − t. To find where the line meets the floor, set z = 0, solve for t, then put that t into x and y."
    },
    {
      h: "Is a point on the line?",
      text: "Here the line is r = (1, 2, −1) + t(1, −1, 2). A is the green dot and B is the grey one. A point is on the line only if one value of t makes all three coordinates match.",
      widget: { type: "vec3", range: 5, yaw: -0.7, pitch: 0.3,
        params: [{ name: "t", label: "t", min: -2, max: 3, step: 0.05, val: 0.5 }],
        scene: (p, V) => {
          const R = V.add(LP2, V.scale(LD2, p.t));
          return [
            { t: "line", p: LP2, d: LD2, c: 1 },
            { t: "pt", at: LA, c: 4, label: "A" },
            { t: "pt", at: LB, c: 5, label: "B" },
            { t: "pt", at: R, c: 3, label: "t = " + fmt(p.t, 2) }
          ];
        },
        readouts: [
          { label: "point", value: (p, V) => V.fmt(V.add(LP2, V.scale(LD2, p.t))) },
          { label: "distance to A", value: (p, V) => fmt(V.norm(V.sub(V.add(LP2, V.scale(LD2, p.t)), LA)), 2) },
          { label: "distance to B", value: (p, V) => fmt(V.norm(V.sub(V.add(LP2, V.scale(LD2, p.t)), LB)), 2) }
        ] },
      tasks: [
        { ask: "Slide t until the orange dot lands on A = (3, 0, 3).", check: s => near(s.t, 2, 0.03), got: "t = 2 gives (3, 0, 3) exactly. All three coordinates agree on t = 2, so A is on the line." },
        { ask: "Now try for B = (0, 3, −2). Match x and y first.", check: s => near(s.t, -1, 0.03), got: "t = −1 gives (0, 3, −3). x and y fit, but z is −3, not −2. The dot is still 1 away from B." },
        { ask: "Find the t that makes z right for B.", check: s => near(s.t, -0.5, 0.03), got: "t = −0.5 gives z = −2, but now x = 0.5 and y = 2.5. x and y want t = −1, z wants t = −0.5. No single t works, so B is off the line." }
      ],
      after: "To test a point, solve for t in each coordinate. If all three give the same t, the point is on the line. If any one disagrees, it is not, however close it looks. The distance to B never drops below 0.58."
    }
  ],
  why: {
    lead: "A line is every point you can reach from P by moving along one fixed direction. Everything else follows from what the vector between two points means.",
    steps: [
      ["Q − P = (q₁ − p₁, q₂ − p₂, q₃ − p₃)", "The trip from P to Q: end minus start, coordinate by coordinate."],
      ["R is on the line ⇔ R − P = t(Q − P) for some t", "R is on the line exactly when the trip from P to R is parallel to the trip from P to Q."],
      ["r = P + t(Q − P)", "Move P across. That is the vector equation."],
      ["t = 0 → P,  t = 1 → Q,  t = ½ → midpoint", "t counts how many trips from P to Q you have made."],
      ["x = x₀ + at,  y = y₀ + bt,  z = z₀ + ct", "One equation per coordinate, with d = (a, b, c): the parametric form."],
      ["(x − x₀) ÷ a = (y − y₀) ÷ b = (z − z₀) ÷ c", "Solve each one for t and set them equal: the symmetric form. It needs a, b and c to be non-zero."]
    ],
    end: "There is no scalar equation for a line in 3D. One equation ax + by + cz = d leaves two coordinates free, and that is a plane. A line in space needs two such equations at once: it is where two planes meet. That comes in a later step."
  },
  examples: [
    { q: "Write a vector equation of the line through P(2, −1, 4) and Q(5, 3, 1).",
      steps: [["d = Q − P = (5 − 2, 3 − (−1), 1 − 4)", "End minus start, one coordinate at a time."], ["d = (3, 4, −3)", "Careful: 3 − (−1) = 4."], ["r = (2, −1, 4) + t(3, 4, −3)", "Point plus t times direction."]],
      a: "r = (2, −1, 4) + t(3, 4, −3)" },
    { q: "Is the point (7, 4, 0) on the line r = (1, −2, 4) + t(2, 2, −2)?",
      steps: [["x: 1 + 2t = 7, so t = 3", "Solve for t using x."], ["y: −2 + 2t = 4, so t = 3", "Solve again using y. It agrees so far."], ["z: 4 − 2t = 0, so t = 2", "z wants a different t."], ["3 ≠ 2", "One t must work for all three coordinates. It doesn’t."]],
      a: "No. At t = 3 the line is at (7, 4, −2), not (7, 4, 0)." },
    { q: "The line through P(1, 3, 5) and Q(3, 2, 3) passes through the xy-plane. Where?",
      steps: [["d = Q − P = (2, −1, −2)", "End minus start."], ["x = 1 + 2t,  y = 3 − t,  z = 5 − 2t", "Write the parametric equations."], ["5 − 2t = 0, so t = 2.5", "The xy-plane is where z = 0."], ["x = 1 + 2(2.5) = 6,  y = 3 − 2.5 = 0.5", "Put t = 2.5 into x and y."]],
      a: "(6, 0.5, 0)" }
  ],
  mistakes: [
    { wrong: "The direction through P(1, 2, 3) and Q(4, 0, 5) is P + Q = (5, 2, 8)", why: "Adding two points has no meaning here. A direction is a trip, and a trip is end minus start.", fix: "d = Q − P = (3, −2, 2)" },
    { wrong: "The line through P(1, 2, 3) and Q(4, 0, 5) is r = (1, 2, 3) + t(4, 0, 5)", why: "That uses the point Q as the direction. The line starts at P but heads the way of the arrow from the origin to Q, so it misses Q: its y stays 2 forever.", fix: "r = (1, 2, 3) + t(3, −2, 2)" },
    { wrong: "(3, 0, 4) is on r = (1, 2, −1) + t(1, −1, 2), because t = 2 fits x and y", why: "Two out of three is not enough. At t = 2 the z-coordinate is −1 + 4 = 3, not 4.", fix: "Check all three coordinates with the same t. (3, 0, 4) is off the line; (3, 0, 3) is on it." },
    { wrong: "The line through (1, 0, 2) with direction (2, 1, 3) is 2x + y + 3z = 8", why: "One equation in x, y and z is a plane, not a line. With the direction as its coefficients, this is the plane through (1, 0, 2) at right angles to the line.", fix: "r = (1, 0, 2) + t(2, 1, 3), or x = 1 + 2t, y = t, z = 2 + 3t." }
  ],
  teach: {
    script: [
      "Hold a pencil in the air. Ask: how would you tell someone exactly where the line of this pencil is? You need one point on it and the way it points.",
      "Name two points P and Q. The direction is the trip from P to Q: Q − P. Do one subtraction together, slowly, one coordinate at a time.",
      "Write r = P + t(Q − P). Ask what t = 0, t = 1 and t = 0.5 give. He should say P, Q and the midpoint without computing.",
      "Write the three parametric equations in a column. Each coordinate is its own simple equation in t.",
      "Finish with the floor question: where does the line hit z = 0? Set z = 0, find t, then use that t in x and y."
    ],
    board: "Three axes with z up. Mark P and Q, draw the arrow Q − P between them, then extend the line both ways. Beside it, write x = …, y = …, z = … in a column.",
    ask: [
      { q: "A line passes through (2, 0, 5) and (4, 1, 2). Give a direction vector, and a second one that also works.", listen: "(2, 1, −3), and any multiple such as (−2, −1, 3) or (4, 2, −6). If he gives (6, 1, 7), he added the points." },
      { q: "On r = (0, 1, 2) + t(1, 1, 1), what point has t = −2? Is it still on the line?", listen: "(−2, −1, 0), and yes: a negative t is behind the start point, still on the line." },
      { q: "Why can’t 2x + y + 3z = 8 be the equation of a line?", listen: "One equation leaves two coordinates free, so it is a whole plane. If he is unsure, ask him to find three points on it that are not in a row." }
    ],
    confusion: "Points and directions both look like three numbers in brackets, so students mix them. Say “point” or “trip” out loud for every bracket. A point is a place; a trip is the difference of two places. The other slip is testing a point with only one coordinate. Insist on one t that works for all three."
  },
  recap: [
    "A line is a point plus a multiple of a direction: r = P + t(Q − P).",
    "Direction = end minus start. t = 0 gives P, t = 1 gives Q, and negative t goes behind P.",
    "A point is on the line only if one t works in all three coordinates. In 3D a line has no single scalar equation."
  ]
};

/* ======================= PLANES ======================= */
const PN = [1, 2, 2], PP = [1, 2, 1], PQ = [-2, 1, -3];
const QP = [1, 1, 1], QQ = [3, 1, 0], QR = [1, 3, 0];
CP.LESSONS.planes = {
  big: "A plane is every point R where R − P is at right angles to one normal n. Written out, n · R = n · P becomes ax + by + cz = d: the coefficients are the normal, and d is n · P.",
  intro: [
    "A plane is a flat sheet that goes on forever, like a tabletop with no edges. Endless directions lie inside it, but only one direction sticks straight out of it. That direction is the normal, and it is all you need to describe the tilt.",
    "Once you know the tilt, one point fixes where the plane sits. The equation ax + by + cz = d holds both facts: (a, b, c) is the normal, and d says which of the many parallel planes you mean."
  ],
  see: [
    {
      h: "Slide a plane along its normal",
      text: "This plane is x + 2y + 2z = d, so its normal is n = (1, 2, 2), the green arrow. Slide d: the plane moves but its tilt stays the same. The readouts put P and Q into the left side, x + 2y + 2z.",
      widget: { type: "vec3", range: 5, yaw: -0.2, pitch: 0.35,
        params: [{ name: "d", label: "d", min: -9, max: 9, step: 1, val: 3, show: v => fmt(v, 0) }],
        scene: (p, V) => {
          const F = V.scale(PN, p.d / 9), onP = near(p.d, 7, 0.25), onQ = near(p.d, -6, 0.25);
          return [
            { t: "plane", n: PN, d: p.d, c: 1, size: 3 },
            { t: "vec", from: F, to: PN, c: 4, label: "n" },
            { t: "pt", at: [0, 0, 0], c: 5, label: "O" },
            { t: "pt", at: PP, c: onP ? 4 : 3, label: "P" },
            { t: "pt", at: PQ, c: onQ ? 4 : 3, label: "Q" }
          ];
        },
        readouts: [
          { label: "plane", value: p => "x + 2y + 2z = " + fmt(p.d, 0) },
          { label: "P (1, 2, 1) gives", value: () => "7" },
          { label: "Q (−2, 1, −3) gives", value: () => fmt(-6, 0) },
          { label: "distance from O", value: p => fmt(Math.abs(p.d) / 3, 2) }
        ] },
      tasks: [
        { ask: "Slide d to 0.", check: s => near(s.d, 0, 0.25), got: "x + 2y + 2z = 0 passes through the origin: put in (0, 0, 0) and you get 0." },
        { ask: "Slide d until the plane goes through P.", check: s => near(s.d, 7, 0.25), got: "d = 7. That is exactly what P gives: 1 + 2(2) + 2(1) = 7. To put a plane through a point, use d = n · P." },
        { ask: "Now catch Q.", check: s => near(s.d, -6, 0.25), got: "d = −6 = −2 + 2(1) + 2(−3). A negative d puts the plane on the far side of the origin, against the normal." },
        { ask: "Move the plane exactly 3 units from the origin, on the side the normal points to.", check: s => near(s.d, 9, 0.25), got: "d = 9. The normal has length 3, and 9 ÷ 3 = 3. Each unit the plane slides adds |n| to d." }
      ],
      after: "Changing d never tilts the plane. All the planes x + 2y + 2z = d are parallel, because they share one normal. To pick the one through a point, put the point into the left side: that number is d."
    },
    {
      h: "Tilt the normal to catch three points",
      text: "This plane always passes through P = (1, 1, 1), and you control its normal n = (a, b, 2). Try to make it pass through Q and R as well. The readouts show n · (Q − P) and n · (R − P).",
      widget: { type: "vec3", range: 4, yaw: -0.6, pitch: 0.35,
        params: [{ name: "a", label: "a", min: -4, max: 4, step: 0.5, val: 2 }, { name: "b", label: "b", min: -4, max: 4, step: 0.5, val: -1 }],
        scene: (p, V) => {
          const n = [p.a, p.b, 2], d = V.dot(n, QP), onQ = Math.abs(V.dot(n, QQ) - d) < 0.05, onR = Math.abs(V.dot(n, QR) - d) < 0.05;
          return [
            { t: "plane", n, d, c: 1, size: 3.2 },
            { t: "seg", a: QP, b: QQ, c: 2, dash: true },
            { t: "seg", a: QP, b: QR, c: 2, dash: true },
            { t: "vec", from: QP, to: V.scale(V.unit(n), 2), c: 4, label: "n" },
            { t: "pt", at: QP, c: 1, label: "P" },
            { t: "pt", at: QQ, c: onQ ? 4 : 3, label: "Q" },
            { t: "pt", at: QR, c: onR ? 4 : 3, label: "R" }
          ];
        },
        readouts: [
          { label: "n", value: (p, V) => V.fmt([p.a, p.b, 2], 1) },
          { label: "plane", value: p => eq3([p.a, p.b, 2], p.a + p.b + 2) },
          { label: "n · (Q − P)", value: p => fmt(2 * p.a - 2, 2) },
          { label: "n · (R − P)", value: p => fmt(2 * p.b - 2, 2) }
        ] },
      tasks: [
        { ask: "Make the plane flat, like a floor.", check: s => near(s.a, 0, 0.05) && near(s.b, 0, 0.05), got: "n = (0, 0, 2) points straight up. The equation is 2z = 2, or just z = 1." },
        { ask: "Tilt it so the origin is on the plane.", check: s => near(s.a + s.b + 2, 0, 0.05), got: "Now d = n · P = a + b + 2 = 0. A plane goes through the origin exactly when d = 0." },
        { ask: "Tilt it so the plane passes through Q.", check: s => near(s.a, 1, 0.05), got: "a = 1. Q − P = (2, 0, −1) lies in the plane, so the normal must be at right angles to it: n · (Q − P) = 2a − 2 = 0." },
        { ask: "Keep Q and catch R as well.", check: s => near(s.a, 1, 0.05) && near(s.b, 1, 0.05), got: "n = (1, 1, 2), and the plane is x + y + 2z = 4. This n is at right angles to both Q − P and R − P, just like their cross product (2, 2, 4)." }
      ],
      after: "A normal has to be at right angles to every direction inside the plane. Three points give you two such directions, Q − P and R − P, and the cross product gives a vector at right angles to both. That is the normal."
    }
  ],
  why: {
    lead: "Pick any point R = (x, y, z) on the plane. The arrow from P to R lies flat in the plane, so it is at right angles to the normal. The dot product turns that fact into an equation.",
    steps: [
      ["R − P lies in the plane", "Both points are on the plane, so the trip between them stays in it."],
      ["n · (R − P) = 0", "At right angles means a dot product of 0."],
      ["n · R = n · P", "Expand the dot product and move n · P across."],
      ["ax + by + cz = d,  with d = n · P", "Write n = (a, b, c) and R = (x, y, z). The right side is just a number."],
      ["same n, different d: parallel planes", "Changing d keeps the tilt and slides the plane along n."],
      ["n = (B − A) × (C − A)", "Through three points: B − A and C − A lie in the plane, and their cross product is at right angles to both."]
    ],
    end: "This is why a normal works and a direction in the plane does not. A plane contains endless directions, so one of them cannot tell you the tilt. But it has only one normal direction (up to length and sign). The plane’s distance from the origin is |d| ÷ |n|, which is what the first picture showed: 9 ÷ 3 = 3."
  },
  examples: [
    { q: "Find the plane through P(2, −1, 3) with normal n = (4, 1, −2).",
      steps: [["4x + y − 2z = d", "The normal’s numbers are the coefficients."], ["d = 4(2) + 1(−1) − 2(3)", "Put in P to find d."], ["d = 8 − 1 − 6 = 1", "Work it out."]],
      a: "4x + y − 2z = 1" },
    { q: "Find the plane through A(1, 0, 2) that is parallel to 2x − 3y + z = 5.",
      steps: [["n = (2, −3, 1)", "Parallel planes share a normal. Read it off."], ["2x − 3y + z = d", "Same left side, new d."], ["d = 2(1) − 3(0) + 2 = 4", "Put in A."]],
      a: "2x − 3y + z = 4" },
    { q: "Find the plane through A(1, 2, −1), B(2, 3, 1) and C(3, −1, 2).",
      steps: [["B − A = (1, 1, 2),  C − A = (2, −3, 3)", "Two directions that lie in the plane."], ["n = (1·3 − 2·(−3), 2·2 − 1·3, 1·(−3) − 1·2)", "Cross product, one component at a time."], ["n = (9, 1, −5)", "3 + 6 = 9, 4 − 3 = 1, −3 − 2 = −5."], ["d = 9(1) + 1(2) − 5(−1) = 16", "Put in A."], ["B: 18 + 3 − 5 = 16 ✓,  C: 27 − 1 − 10 = 16 ✓", "Check the other two points."]],
      a: "9x + y − 5z = 16" }
  ],
  mistakes: [
    { wrong: "Through P(1, 2, 3) with normal (2, −1, 4): x + 2y + 3z = 14", why: "The roles are swapped: the point went into the coefficients. The normal decides the coefficients; the point only decides d.", fix: "2x − y + 4z = 12, since 2(1) − 2 + 4(3) = 12." },
    { wrong: "The normal of 2x − y + 3z = 5 is (2, −1, 5)", why: "The number on the right is not part of the normal. It only says where the plane sits.", fix: "n = (2, −1, 3), the coefficients of x, y and z." },
    { wrong: "Through A, B and C, the normal is B − A", why: "B − A runs from one point of the plane to another, so it lies flat in the plane. A normal must stick out of it.", fix: "n = (B − A) × (C − A)" },
    { wrong: "Through (3, −2, −1) with normal (2, 1, −4): 2x + y − 4z = 0", why: "A sign slip in one product. (−4)(−1) is +4, not −4.", fix: "d = 6 − 2 + 4 = 8, so 2x + y − 4z = 8." }
  ],
  teach: {
    script: [
      "Hold a book flat and stand a pencil upright on it. Tilt the book and the pencil tilts with it. The pencil is the normal, and it tells you the tilt completely.",
      "Ask: how many directions lie inside the book? (Endless.) How many stick straight out? (One, up to flipping it.) That is why we describe a plane by its normal.",
      "Write n · (R − P) = 0 and say it in words: the trip from P to any point of the plane is at right angles to the pencil. Expand it to ax + by + cz = d.",
      "Slide the book up the pencil. The tilt stays the same and only d changes. Those are parallel planes.",
      "For three points, ask him for two trips inside the plane, then their cross product. Always check all three points in the final equation."
    ],
    board: "A tilted parallelogram for the plane. The normal arrow standing up from a point P. A dashed arrow from P to another point R in the plane, with a right-angle box between R − P and n.",
    ask: [
      { q: "What is a normal to 3x − 5z = 2? Careful.", listen: "(3, 0, −5). There is no y term, so the middle number is 0. If he says (3, −5, 2), he took the right side as a coefficient." },
      { q: "Is (1, 1, 1) on the plane 2x − y + 4z = 5?", listen: "2 − 1 + 4 = 5, so yes. He should test it in one line by substituting." },
      { q: "Why is B − A never a normal for the plane through A, B and C?", listen: "Because it lies in the plane, and a normal sticks out of it. Its dot product with the true normal is 0." }
    ],
    confusion: "Students treat a normal as if it were a direction in the plane, because both are three numbers in brackets. Use the book and pencil as often as needed: the normal is the pencil, not a line drawn on the cover. The other common slip is a sign error in d = n · P, so always check the point in the final equation."
  },
  recap: [
    "ax + by + cz = d has normal (a, b, c), read straight off. d = n · P for any point P on the plane.",
    "Same normal, different d: parallel planes. d = 0 means the plane passes through the origin.",
    "Through three points: n = (B − A) × (C − A). Check all three points at the end."
  ]
};

/* ======================= PLANE FORMS ======================= */
const FP = [-1, 1, 1], FU = [2, 0, -1], FV = [0, 2, -1], FN = [2, 2, 4];
const fr = p => V.add(FP, V.add(V.scale(FU, p.s), V.scale(FV, p.t)));
const GP = [1, 0, 1], GU = [2, 1, 0];
const gv = p => [p.a, 1, p.c];
CP.LESSONS.planeforms = {
  big: "A plane can be built from moves: r = P + s·u + t·v, with two directions inside it. Their cross product n = u × v sticks out of it, and d = n · P turns the moves into one scalar equation ax + by + cz = d.",
  intro: [
    "The last step described a plane by the arrow that sticks out of it. This step describes it from the inside. Stand at a point P on the plane. You can reach any other point with some steps along u and some steps along v, as long as u and v point in different directions.",
    "So a plane has two forms, and you need to move between them. Vector form r = P + s·u + t·v lists moves. Scalar form ax + by + cz = d tests points. The cross product is the bridge, and it also explains how two planes meet in a line."
  ],
  see: [
    {
      h: "Reach any point with two moves",
      text: "This plane has P = (−1, 1, 1), u = (2, 0, −1) and v = (0, 2, −1). s counts steps along u and t counts steps along v. The orange dot is P + su + tv. The green arrow is n = u × v.",
      widget: { type: "vec3", range: 5, yaw: 0.3, pitch: 0.5,
        params: [{ name: "s", label: "s", min: -2, max: 2, step: 0.1, val: -1 }, { name: "t", label: "t", min: -2, max: 2, step: 0.1, val: 0.5 }],
        scene: (p, V) => {
          const A = V.add(FP, V.scale(FU, p.s)), R = fr(p);
          return [
            { t: "poly", pts: [[2, 2], [-2, 2], [-2, -2], [2, -2]].map(q => fr({ s: q[0], t: q[1] })), c: 1 },
            { t: "seg", a: FP, b: A, c: 2, dash: true },
            { t: "seg", a: A, b: R, c: 2, dash: true },
            { t: "vec", from: FP, to: FU, c: 2, label: "u" },
            { t: "vec", from: FP, to: FV, c: 2, label: "v" },
            { t: "vec", from: FP, to: V.scale(V.unit(FN), 2), c: 4, label: "n" },
            { t: "pt", at: FP, c: 1, label: "P" },
            { t: "pt", at: R, c: 3, label: "r" }
          ];
        },
        readouts: [
          { label: "r = P + su + tv", value: (p, V) => V.fmt(fr(p)) },
          { label: "x + y + 2z", value: p => { const R = fr(p); return fmt(R[0] + R[1] + 2 * R[2], 2); } },
          { label: "n · (r − P)", value: (p, V) => fmt(V.dot(FN, V.sub(fr(p), FP)), 2) }
        ] },
      tasks: [
        { ask: "Set s = 1 and t = 0.", check: s => near(s.s, 1, 0.06) && near(s.t, 0, 0.06), got: "P + u = (1, 1, 0). One step along u." },
        { ask: "Set s = 0 and t = 1.", check: s => near(s.s, 0, 0.06) && near(s.t, 1, 0.06), got: "P + v = (−1, 3, 0). One step along v." },
        { ask: "Reach the point (3, −1, 0).", check: s => nearV(fr(s), [3, -1, 0], 0.1), got: "s = 2 and t = −1: two steps along u and one step back along v." },
        { ask: "Find where the plane crosses the z-axis, where x = 0 and y = 0.", check: s => nearV(fr(s), [0, 0, 1], 0.1), got: "s = 0.5 and t = −0.5 give (0, 0, 1). Check it in the scalar form: 0 + 0 + 2(1) = 2." }
      ],
      after: "Watch the readouts: x + y + 2z stays 2, and n · (r − P) stays 0, wherever you go. That is because n = u × v = (2, 2, 4) is at right angles to every move. Halve it to (1, 1, 2), put P in, and the plane is x + y + 2z = 2."
    },
    {
      h: "Where the normal comes from",
      text: "Now u = (2, 1, 0) is fixed and you control v = (a, 1, c). The plane passes through P = (1, 0, 1). The green arrow is n = u × v. Watch n · u and n · v as you move the sliders.",
      widget: { type: "vec3", range: 4, yaw: -0.3, pitch: 0.55,
        params: [{ name: "a", label: "a", min: -2, max: 3, step: 0.5, val: -1 }, { name: "c", label: "c", min: -2, max: 2, step: 0.5, val: 1 }],
        scene: (p, V) => {
          const v = gv(p), n = V.cross(GU, v), ok = V.norm(n) > 1e-9;
          const o = [];
          if (ok) o.push({ t: "plane", n, d: V.dot(n, GP), c: 1, size: 3.2 }, { t: "vec", from: GP, to: V.scale(V.unit(n), 2), c: 4, label: "n" });
          else o.push({ t: "line", p: GP, d: GU, c: 3 });
          o.push({ t: "vec", from: GP, to: GU, c: 2, label: ok ? "u" : "u = v" }, { t: "vec", from: GP, to: v, c: 2, label: ok ? "v" : "", dash: !ok }, { t: "pt", at: GP, c: 1, label: "P" });
          return o;
        },
        readouts: [
          { label: "v", value: (p, V) => V.fmt(gv(p), 1) },
          { label: "n = u × v", value: (p, V) => V.fmt(V.cross(GU, gv(p)), 1) },
          { label: "n · u,  n · v", value: (p, V) => { const n = V.cross(GU, gv(p)); return fmt(V.dot(n, GU), 2) + ",  " + fmt(V.dot(n, gv(p)), 2); } },
          { label: "scalar form", value: (p, V) => { const n = V.cross(GU, gv(p)); return V.norm(n) > 1e-9 ? eq3(n, V.dot(n, GP)) : "none: n = 0"; } }
        ] },
      tasks: [
        { ask: "Make the plane flat, like a floor.", check: s => near(s.c, 0, 0.05) && Math.abs(s.a - 2) > 0.2, got: "With c = 0, neither u nor v has a z part. So n = (0, 0, 2 − a) points straight up. Divide the scalar form through and it says z = 1." },
        { ask: "Now stand the plane up straight, like a wall.", check: s => near(s.a, 2, 0.05) && Math.abs(s.c) > 0.2, got: "a = 2 makes n = (c, −2c, 0). The normal has no z part, so the plane is vertical. Divide the scalar form through: x − 2y = 1, with no z at all." },
        { ask: "Find the one setting of v where there is no plane at all.", check: s => near(s.a, 2, 0.05) && near(s.c, 0, 0.05), got: "v = (2, 1, 0), the same as u. Then u × v = (0, 0, 0). Two parallel directions only sweep out a line." }
      ],
      after: "n · u and n · v stayed at 0 the whole time: u × v is always at right angles to both directions. That is why it is the normal. It fails in one case only. When u and v are parallel, u × v = 0 and there is no plane."
    }
  ],
  why: {
    lead: "Two facts do all the work. Every point of the plane is P plus some mix of u and v. And the cross product u × v is at right angles to both u and v.",
    steps: [
      ["r − P = s·u + t·v", "Any point is reached from P by some steps along u and some along v."],
      ["n = u × v,  so n · u = 0 and n · v = 0", "The cross product is at right angles to both of the vectors it came from."],
      ["n · (r − P) = s(n · u) + t(n · v) = 0", "Dot both sides with n. Each piece is 0."],
      ["n · r = n · P", "Move n · P across."],
      ["ax + by + cz = d,  with (a, b, c) = n and d = n · P", "Write it out: the scalar form."],
      ["u parallel to v  →  u × v = 0", "With parallel directions there is no normal: the moves only reach a line."],
      ["direction of the line = n₁ × n₂", "A line inside two planes is at right angles to both normals, so the cross product of the normals points along it."]
    ],
    end: "Going the other way, from scalar to vector form, you need a point and two directions. Set two variables to 0 to find a point. Then find two non-parallel vectors whose dot product with n is 0. For n = (2, −1, 3), (1, 2, 0) works: 2 − 2 + 0 = 0."
  },
  examples: [
    { q: "Write r = (1, 0, 2) + s(1, 1, 0) + t(0, 1, 3) as a scalar equation.",
      steps: [["n = u × v = (1·3 − 0·1, 0·0 − 1·3, 1·1 − 1·0)", "Cross product, one component at a time."], ["n = (3, −3, 1)", "Tidy up."], ["d = n · P = 3(1) − 3(0) + 1(2) = 5", "Put in P."], ["P + u = (2, 1, 2): 6 − 3 + 2 = 5 ✓", "Check another point of the plane."]],
      a: "3x − 3y + z = 5" },
    { q: "Write 2x − y + 3z = 6 in vector form.",
      steps: [["y = 0, z = 0: 2x = 6, so x = 3", "Find a point: set two variables to 0. P = (3, 0, 0)."], ["u = (1, 2, 0): 2 − 2 + 0 = 0", "First direction: any vector whose dot product with n = (2, −1, 3) is 0."], ["v = (0, 3, 1): 0 − 3 + 3 = 0", "A second one, not parallel to u."], ["r = (3, 0, 0) + s(1, 2, 0) + t(0, 3, 1)", "Point plus two directions."]],
      a: "r = (3, 0, 0) + s(1, 2, 0) + t(0, 3, 1)" },
    { q: "The planes x + y + z = 6 and 2x − y + z = 3 meet in a line. Find a vector equation of the line.",
      steps: [["direction = n₁ × n₂ = (1, 1, 1) × (2, −1, 1)", "The line lies in both planes, so it is at right angles to both normals."], ["= (1·1 − 1·(−1), 1·2 − 1·1, 1·(−1) − 1·2) = (2, 1, −3)", "Cross product, one component at a time."], ["z = 0: x + y = 6 and 2x − y = 3", "Find one point on both planes. Setting z = 0 leaves two equations."], ["3x = 9, so x = 3 and y = 3", "Add the two equations, then substitute back."], ["r = (3, 3, 0) + t(2, 1, −3)", "Point plus direction."]],
      a: "r = (3, 3, 0) + t(2, 1, −3)" }
  ],
  mistakes: [
    { wrong: "r = (0, 1, 2) + s(1, 2, −1) + t(−2, −4, 2) is a plane", why: "The second direction is −2 times the first, so both moves run along one line. Their cross product is (0, 0, 0), and there is no normal.", fix: "Pick two directions that are not multiples of each other." },
    { wrong: "(1, 1, 0) × (0, 1, 3) = (3, 3, 1)", why: "The middle component has the wrong sign. It is u₃v₁ − u₁v₃ = 0 − 3 = −3. This is the cross product slip most people make.", fix: "(3, −3, 1)" },
    { wrong: "2x − y + 3z = 6 is r = (3, 0, 0) + s(2, −1, 3) + t(1, 2, 0)", why: "(2, −1, 3) is the normal. It sticks out of the plane, so moving along it leaves the plane.", fix: "Both directions need a dot product of 0 with n: r = (3, 0, 0) + s(1, 2, 0) + t(0, 3, 1)." },
    { wrong: "n = (3, −3, 1) and P = (1, 0, 2), so the plane is 3x − 3y + z = 0", why: "That plane passes through the origin. You found the tilt but never placed the plane.", fix: "d = n · P = 3 + 0 + 2 = 5, so 3x − 3y + z = 5." }
  ],
  teach: {
    script: [
      "Stand at one spot on the floor. Ask: with only two kinds of step, say forwards and sideways, can you reach every spot on the floor? Yes, as long as the two steps point different ways.",
      "Write r = P + s·u + t·v. s and t say how many of each step. Work out s = 1, t = 0 and then s = 2, t = −1 together.",
      "Ask what happens if both steps point the same way. He should see that you can only walk along a line. That is the trap.",
      "Now the bridge: u × v is at right angles to both steps, so it is the normal. Then d = n · P, as in the last step.",
      "Going back: set two variables to 0 to find a point. For directions, find vectors whose dot product with n is 0.",
      "Last, two planes meeting: their line lies in both, so its direction is at right angles to both normals. That is n₁ × n₂."
    ],
    board: "A tilted parallelogram with P at one corner, arrows u and v from P along two edges, and n standing up from P. Beside it, vector form on the left, scalar form on the right, and an arrow between them labelled “n = u × v, d = n · P”.",
    ask: [
      { q: "Is r = P + s(1, 0, 2) + t(2, 0, 4) a plane?", listen: "No: (2, 0, 4) = 2(1, 0, 2), so the directions are parallel and it is only a line. A cross product of 0 confirms it." },
      { q: "Give one direction that lies in the plane x + y + z = 10.", listen: "Anything whose numbers add to 0, such as (1, −1, 0). Have him check the dot product with the normal (1, 1, 1)." },
      { q: "Two planes have normals (1, 0, 0) and (0, 1, 0). Which way does their line of meeting point?", listen: "Straight up, along the z-axis: (1, 0, 0) × (0, 1, 0) = (0, 0, 1). One plane is x = a number and the other is y = a number, so they meet in a vertical line." }
    ],
    confusion: "The two forms use vectors in opposite roles. In vector form, u and v lie inside the plane. In scalar form, n sticks out of it. Students mix them up and put a normal into the vector form. Ask: does this arrow walk along the plane, or stick out of it? The other common error is a wrong sign on the middle component of a cross product, so always check a second point at the end."
  },
  recap: [
    "Vector form r = P + s·u + t·v: a point and two non-parallel directions inside the plane.",
    "To scalar form: n = u × v and d = n · P. To vector form: find a point, then two directions with dot product 0 with n.",
    "Two planes meet in a line whose direction is n₁ × n₂."
  ]
};
})();
