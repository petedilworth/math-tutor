/* Full lessons: where a line meets a plane, where planes meet, skew lines, distance from a point to a plane. */
window.CP = window.CP || {};
(function () {
CP.LESSONS = CP.LESSONS || {};
const { fmt } = CP.W, PI = Math.PI, V = CP.V;
const near = (a, b, tol) => Math.abs(a - b) <= tol;

/* "2x − y + z = 4" from a normal and a constant */
function eqn(n, d) {
  let s = "";
  ["x", "y", "z"].forEach((v, i) => {
    const c = n[i]; if (Math.abs(c) < 1e-9) return;
    const a = Math.abs(c), num = Math.abs(a - 1) < 1e-9 ? "" : fmt(a, 2);
    s += (s ? (c < 0 ? " − " : " + ") : (c < 0 ? "−" : "")) + num + v;
  });
  return (s || "0") + " = " + fmt(d, 2);
}
/* the line where two planes cross: a point on it (the one nearest the origin), or null if they are parallel */
function meet2(n1, d1, n2, d2) {
  const c = V.cross(n1, n2), c2 = V.dot(c, c); if (c2 < 1e-9) return null;
  const a = V.dot(n1, n1), b = V.dot(n1, n2), e = V.dot(n2, n2);
  return V.scale(V.add(V.scale(n1, d1 * e - d2 * b), V.scale(n2, d2 * a - d1 * b)), 1 / c2);
}
const inBox = (p, L) => p.every(x => Math.abs(x) <= (L || 5.5));

/* ===================== where a line meets a plane ===================== */
const LP = { n: [2, 1, 2], P: [1, 2, 3], d: [0, -1, -1] };
CP.LESSONS.lineplane = {
  big: "Put the line’s x, y and z (written with t) into the plane’s equation and solve for t. Then put t back into the line to get the point. If t cancels out, the line is parallel: it misses the plane or lies in it.",
  intro: [
    "A line in 3D is a list of points, one for each value of t. A plane is a test: a point is on the plane when its x, y and z make the equation true. So “where do they meet?” becomes “which t passes the test?”",
    "That turns a 3D picture into one equation with one unknown. The only surprise comes when t drops out of the equation. That happens when the line runs parallel to the plane, and then there is no point at all, or every point."
  ],
  see: [
    {
      h: "Slide along the line until you hit the plane",
      text: "The teal plane is 2x + y + 2z = 4. The orange dot moves along the line r = (1, 2, 3) + t(0, −1, −1) as you change t. The readout puts the dot’s x, y and z into 2x + y + 2z and takes away 4. When that gap is 0, the dot is on the plane.",
      widget: { type: "vec3", range: 5, yaw: 0.3, pitch: 0.35,
        params: [{ name: "t", label: "t", min: -1, max: 3, step: 0.1, val: -1, show: v => fmt(v, 1) }],
        scene: (p, V) => {
          const r = V.add(LP.P, V.scale(LP.d, p.t));
          return [
            { t: "plane", n: LP.n, d: 4, c: 1, size: 4 },
            { t: "line", p: LP.P, d: LP.d, c: 2, label: "line" },
            { t: "vec", from: [-1, 2, 2], to: V.scale(V.unit(LP.n), 1.6), c: 4, label: "n" },
            { t: "pt", at: LP.P, c: 5, label: "P" },
            { t: "pt", at: r, c: 3, label: "t = " + fmt(p.t, 1) }
          ];
        },
        readouts: [
          { label: "point r(t)", value: (p, V) => V.fmt(V.add(LP.P, V.scale(LP.d, p.t))) },
          { label: "2x + y + 2z − 4", value: (p, V) => fmt(V.dot(LP.n, V.add(LP.P, V.scale(LP.d, p.t))) - 4, 2) },
          { label: "the dot is", value: (p, V) => { const g = V.dot(LP.n, V.add(LP.P, V.scale(LP.d, p.t))) - 4; return Math.abs(g) < 1e-6 ? "on the plane" : g > 0 ? "on the side n points to" : "on the far side"; } }
        ] },
      tasks: [
        { ask: "Set t = 0. The dot is at P = (1, 2, 3). Is it on the plane?", check: s => near(s.t, 0, 0.06), got: "No. 2(1) + 2 + 2(3) − 4 = 6, not 0. P is on the side the normal points to." },
        { ask: "Now set t = 1. How much did the gap change?", check: s => near(s.t, 1, 0.06), got: "It fell from 6 to 3. Each step of 1 in t changes the gap by n · d = (2, 1, 2) · (0, −1, −1) = −3." },
        { ask: "Find the t that makes the gap exactly 0.", check: s => near(s.t, 2, 0.06), got: "t = 2. The dot is at (1, 0, 1), and 2(1) + 0 + 2(1) = 4. That is the crossing point." },
        { ask: "Keep going, past the plane, to t = 3.", check: s => s.t > 2.5, got: "The gap is −3: the dot has gone through to the other side. The gap changes sign once, so the line crosses exactly once." }
      ],
      after: "The gap is 6 − 3t. It starts at 6 and loses 3 for every step in t. Setting 6 − 3t = 0 gives t = 2 with no sliding. That is exactly the equation you get when you put x = 1, y = 2 − t, z = 3 − t into 2x + y + 2z = 4."
    },
    {
      h: "Tilt the line until it runs parallel",
      text: "The line now pivots about P = (1, 2, 3), the grey dot. Its direction is d = (1, −a, −1 − a), so the tilt a turns it. The plane is 2x + y + 2z = D, and D slides it. The purple arrow is d and the green arrow is the normal n. Watch n · d and the crossing.",
      widget: { type: "vec3", range: 5, yaw: 0.3, pitch: 0.35,
        params: [{ name: "a", label: "tilt a", min: -1, max: 1, step: 0.05, val: 1, show: v => fmt(v, 2) },
                 { name: "D", label: "plane’s D", min: -2, max: 10, step: 0.5, val: 4, show: v => fmt(v, 1) }],
        scene: (p, V) => {
          const d = [1, -p.a, -1 - p.a], nd = V.dot(LP.n, d), o = [
            { t: "plane", n: LP.n, d: p.D, c: 1, size: 4 },
            { t: "line", p: LP.P, d, c: 2 },
            { t: "vec", from: LP.P, to: d, c: 2, label: "d" },
            { t: "vec", from: LP.P, to: V.scale(V.unit(LP.n), 1.6), c: 4, label: "n" },
            { t: "pt", at: LP.P, c: 5 }];
          if (Math.abs(nd) > 1e-9) { const X = V.add(LP.P, V.scale(d, (p.D - 10) / nd)); if (inBox(X)) o.push({ t: "pt", at: X, c: 3, label: "crossing" }); }
          return o;
        },
        readouts: [
          { label: "d", value: (p, V) => V.fmt([1, -p.a, -1 - p.a]) },
          { label: "n · d", value: (p, V) => fmt(V.dot(LP.n, [1, -p.a, -1 - p.a]), 2) },
          { label: "crossing", value: (p, V) => {
            const d = [1, -p.a, -1 - p.a], nd = V.dot(LP.n, d);
            if (Math.abs(nd) > 1e-9) { const t = (p.D - 10) / nd; return "t = " + fmt(t, 2) + " at " + V.fmt(V.add(LP.P, V.scale(d, t))); }
            return Math.abs(p.D - 10) < 1e-9 ? "every point (10 = 10)" : "none (10 = " + fmt(p.D, 1) + " is false)";
          } }
        ] },
      tasks: [
        { ask: "Turn the tilt down toward 0, but stop at 0.2 or less (not 0).", check: s => Math.abs(s.a) > 0.01 && Math.abs(s.a) <= 0.21 && Math.abs(s.D - 10) > 0.01, got: "The crossing has run off the picture. n · d is tiny now, and t = (D − n · P) ÷ (n · d) divides by that tiny number, so t is huge." },
        { ask: "Set the tilt to exactly 0.", check: s => Math.abs(s.a) < 0.01 && Math.abs(s.D - 10) > 0.01, got: "n · d = 0: d is at right angles to n, so the line runs alongside the plane. In the equation the t terms cancel and leave 10 = D, which is false. No crossing." },
        { ask: "Keep the tilt at 0. Slide the plane until the line lies in it.", check: s => Math.abs(s.a) < 0.01 && Math.abs(s.D - 10) < 0.01, got: "D = 10. Now the equation reads 10 = 10 for every t. Every point of the line is on the plane." }
      ],
      after: "So n · d decides it. If n · d is not 0, there is exactly one crossing. If n · d = 0, the line is parallel, and one check of P settles the rest: if P is on the plane, the whole line is; if not, none of it is."
    }
  ],
  why: {
    lead: "Every point of the line has the form P + td. A point is on the plane n · r = D exactly when it makes the equation true (D is the number on the right). So substitute the line into the plane and see what is left.",
    steps: [
      ["r = P + td", "One point for each value of t."],
      ["n · (P + td) = D", "The point is on the plane when it passes the plane’s test."],
      ["n · P + t(n · d) = D", "The dot product splits across the sum, and t comes out as a factor."],
      ["t = (D − n · P) ÷ (n · d)", "Solve for t. This works whenever n · d is not 0."],
      ["n · d = 0 ⇒ n · P = D, with no t left", "If n · d = 0, t cancels. The statement is true for every t or for none."],
      ["n · d = 0 ⇔ d ⟂ n", "A direction at right angles to the normal lies flat along the plane: the line is parallel to it."]
    ],
    end: "So a line and a plane share exactly one point, no points, or every point. Never two: the gap n · r − D changes by the same amount, n · d, for each step in t, so it can pass through 0 only once."
  },
  examples: [
    { q: "Where does the line r = (2, −1, 5) + t(1, 2, −1) meet the plane z = 2?",
      steps: [["x = 2 + t,  y = −1 + 2t,  z = 5 − t", "Write each coordinate in terms of t."], ["5 − t = 2", "The plane only tests z."], ["t = 3", "Solve."], ["(2 + 3, −1 + 6, 5 − 3) = (5, 5, 2)", "Put t = 3 back into the line."]],
      a: "(5, 5, 2)" },
    { q: "Where does r = (2, 0, −1) + t(1, −1, 3) meet the plane 2x + y − z = 9?",
      steps: [["x = 2 + t,  y = −t,  z = −1 + 3t", "Coordinates in terms of t."], ["2(2 + t) + (−t) − (−1 + 3t) = 9", "Substitute into the plane."], ["4 + 2t − t + 1 − 3t = 9", "Expand. Watch the minus in front of z."], ["5 − 2t = 9, so t = −2", "Collect like terms and solve."], ["(2 − 2, 0 + 2, −1 − 6) = (0, 2, −7)", "Put t = −2 back into the line."], ["2(0) + 2 − (−7) = 9 ✓", "Check the point in the plane."]],
      a: "(0, 2, −7)" },
    { q: "How many points do the line r = (1, 0, 2) + t(2, 1, −1) and the plane x − y + z = 3 share?",
      steps: [["n · d = (1, −1, 1) · (2, 1, −1) = 2 − 1 − 1 = 0", "Warning sign: the line is parallel to the plane."], ["(1 + 2t) − t + (2 − t) = 3", "Substitute anyway."], ["3 + 0t = 3", "The t terms cancel."], ["3 = 3, true for every t", "Every point of the line passes the test."]],
      a: "Every point: the line lies in the plane. (If the plane were x − y + z = 5, you would get 3 = 5: no points.)" }
  ],
  mistakes: [
    { wrong: "The line meets the plane at t = 2.", why: "t = 2 is a position along the line, not a point in space. The question asks where they meet.", fix: "Put t back: (1, 2, 3) + 2(0, −1, −1) = (1, 0, 1)." },
    { wrong: "Using only the direction: (2, 1, 2) · (0, −1, −1)t = 4, so −3t = 4.", why: "Every point of the line is P + td, not just td. The start point’s part, n · P = 10, belongs in the equation too.", fix: "10 − 3t = 4, so t = 2." },
    { wrong: "n · d = 0, so the line is perpendicular to the plane.", why: "n · d = 0 says d is perpendicular to the normal, not to the plane. A direction at right angles to the normal lies flat along the plane.", fix: "n · d = 0 means parallel to the plane. (d parallel to n would mean perpendicular to the plane.)" },
    { wrong: "n · d = 0, so there is no intersection.", why: "A parallel line can also lie inside the plane. You have to test one point to know which.", fix: "If n · d = 0, check P: n · P = D means every point is shared; otherwise none is." }
  ],
  teach: {
    script: [
      "Hold a pencil (the line) and a book (the plane). Ask: in how many ways can they meet? Push for all three: through it once, alongside it, lying on it.",
      "Write the line as x, y and z in terms of t. Say: each t gives one point. Which t lands on the plane?",
      "Substitute into the plane’s equation. You get one equation in t. Solve it, then put t back. Stress that t is not the answer.",
      "Lay the pencil flat along the cover, then lift it straight up off the book. Ask what happens to the equation now. The t terms cancel.",
      "Finish with the test: n · d = 0 means parallel. Then check P to tell “misses” from “lies in it”."
    ],
    board: "A tilted rectangle for the plane and a line piercing it, with P marked at t = 0 and the crossing at t = 2. Underneath, the gap 6 − 3t, with 6, 3, 0 written under t = 0, 1, 2.",
    ask: [
      { q: "You substitute and get 7 = 7. What does that mean?", listen: "“Every t works, so the whole line is in the plane.” If he says “no solution” or “t = 7”, ask which values of t make 7 = 7 true." },
      { q: "Why is n · d = 0 the sign of a parallel line?", listen: "“d is at right angles to the normal, so it runs along the plane.” If he says perpendicular, draw the normal sticking up out of the book and lay a pencil flat." },
      { q: "You found t = −2. Are you done?", listen: "“No, put it back into the line to get the point.” If he stops, ask: which point in space is t = −2?" }
    ],
    confusion: "Two mix-ups. First, treating t as the answer: it is only an address along the line, so always put it back. Second, swapping “parallel” and “perpendicular” when the normal is involved: n · d = 0 means the line is perpendicular to the normal, which makes it parallel to the plane."
  },
  recap: [
    "Write x, y and z in terms of t, put them into the plane’s equation, solve for t, then put t back into the line.",
    "One value of t: one point. t cancels and the equation is false: no points. True: the line lies in the plane.",
    "n · d = 0 is the warning sign: the line runs parallel to the plane."
  ]
};

/* ===================== where planes meet ===================== */
const PS = { n1: [1, 0, 1], d1: 3, n2: [0, 1, 1], d2: 1 };
CP.LESSONS.planesys = {
  big: "Each equation is a plane. Two planes that are not parallel meet in a line. Three planes meet at one point, along a line, or nowhere, and elimination says which: one value, 0 = 0, or 0 = a number that isn’t 0.",
  intro: [
    "An equation like x + y + z = 2 is a plane. Solving a system of such equations means finding the points that sit on every plane at once. So a system with no solution is not a mistake: it describes planes that never share a point.",
    "Start by comparing normals. They tell you whether two planes are parallel before you solve anything. With three planes, eliminate one variable at a time. What is left at the end tells you which picture you have."
  ],
  see: [
    {
      h: "Two planes: tilt one until they stop crossing",
      text: "The teal plane is x + y + z = 2. The purple plane has normal n₂ = (1 + k, 1 − k, 1), so the tilt k turns it, and d₂ slides it. The orange line is where they cross. Its direction is n₁ × n₂.",
      widget: { type: "vec3", range: 5, yaw: -0.7, pitch: 0.4,
        params: [{ name: "k", label: "tilt k", min: -1, max: 1, step: 0.1, val: 1, show: v => fmt(v, 1) },
                 { name: "d2", label: "d₂", min: -4, max: 6, step: 0.5, val: 4, show: v => fmt(v, 1) }],
        scene: (p, V) => {
          const n1 = [1, 1, 1], n2 = [1 + p.k, 1 - p.k, 1], X = meet2(n1, 2, n2, p.d2), o = [
            { t: "plane", n: n1, d: 2, c: 1, size: 4 },
            { t: "plane", n: n2, d: p.d2, c: 2, size: 4 }];
          if (X) o.push({ t: "line", p: X, d: V.cross(n1, n2), c: 3, label: "crossing" });
          return o;
        },
        readouts: [
          { label: "purple plane", value: p => eqn([1 + p.k, 1 - p.k, 1], p.d2) },
          { label: "n₁ × n₂", value: (p, V) => V.fmt(V.cross([1, 1, 1], [1 + p.k, 1 - p.k, 1])) },
          { label: "they share", value: p => Math.abs(p.k) > 1e-9 ? "a line" : Math.abs(p.d2 - 2) < 1e-9 ? "every point: same plane" : "nothing: parallel" }
        ] },
      tasks: [
        { ask: "Turn the tilt k to 0.", check: s => Math.abs(s.k) < 0.01 && Math.abs(s.d2 - 2) > 0.01, got: "Now n₂ = n₁ = (1, 1, 1) and n₁ × n₂ = (0, 0, 0). The orange line is gone: the planes are parallel, with a gap between them." },
        { ask: "Keep k at 0. Slide d₂ until the two planes become one.", check: s => Math.abs(s.k) < 0.01 && Math.abs(s.d2 - 2) < 0.01, got: "d₂ = 2. Same normal and same constant: one plane, so every point is shared." },
        { ask: "Now turn the tilt all the way to −1.", check: s => s.k < -0.99, got: "n₂ = (0, 2, 1). They cross again, along n₁ × n₂ = (−1, −1, 2). Any tilt but 0 gives a line, wherever you slide d₂." }
      ],
      after: "Two planes share a line, nothing, or everything. Never just one point: they are endless flat sheets, so where they cross, they cross along a whole line. Comparing normals tells you which case before you solve anything."
    },
    {
      h: "Three planes: one point, a line, or nothing",
      text: "Teal: x + z = 3. Purple: y + z = 1. They cross along the dashed orange line. The grey plane is x − y + kz = d₃. Take purple from teal to get x − y = 2. Take that from grey: x and y vanish, and kz = d₃ − 2 is left. The readout shows it.",
      widget: { type: "vec3", range: 5, yaw: -0.5, pitch: 0.4,
        params: [{ name: "k", label: "tilt k", min: -2, max: 2, step: 0.1, val: 1, show: v => fmt(v, 1) },
                 { name: "d3", label: "d₃", min: -2, max: 6, step: 0.5, val: 4, show: v => fmt(v, 1) }],
        scene: (p, V) => {
          const n3 = [1, -1, p.k], L12 = meet2(PS.n1, PS.d1, PS.n2, PS.d2), o = [
            { t: "plane", n: PS.n1, d: PS.d1, c: 1, size: 3.6 },
            { t: "plane", n: PS.n2, d: PS.d2, c: 2, size: 3.6 },
            { t: "plane", n: n3, d: p.d3, c: 5, size: 3.6 },
            { t: "line", p: L12, d: V.cross(PS.n1, PS.n2), c: 3, dash: true }];
          [[PS.n1, PS.d1], [PS.n2, PS.d2]].forEach(([n, d]) => { const X = meet2(n, d, n3, p.d3); if (X) o.push({ t: "line", p: X, d: V.cross(n, n3), c: 5 }); });
          if (Math.abs(p.k) > 1e-9) { const z = (p.d3 - 2) / p.k, X = [3 - z, 1 - z, z]; if (inBox(X)) o.push({ t: "pt", at: X, c: 3, label: "meet" }); }
          return o;
        },
        readouts: [
          { label: "grey plane", value: p => eqn([1, -1, p.k], p.d3) },
          { label: "grey − (x − y = 2)", value: p => (Math.abs(p.k) < 1e-9 ? "0" : Math.abs(p.k - 1) < 1e-9 ? "" : Math.abs(p.k + 1) < 1e-9 ? "−" : fmt(p.k, 1)) + "z = " + fmt(p.d3 - 2, 1) },
          { label: "they share", value: (p, V) => {
            if (Math.abs(p.k) > 1e-9) { const z = (p.d3 - 2) / p.k; return "one point " + V.fmt([3 - z, 1 - z, z]); }
            return Math.abs(p.d3 - 2) < 1e-9 ? "a line (0 = 0)" : "nothing (0 = " + fmt(p.d3 - 2, 1) + ")";
          } }
        ] },
      tasks: [
        { ask: "Slide d₃ until the orange point sits on the floor, at z = 0.", check: s => Math.abs(s.k) > 0.01 && Math.abs(s.d3 - 2) < 0.01, got: "d₃ = 2 leaves kz = 0, so z = 0 and the point is (3, 1, 0). The grey plane cuts the dashed line at exactly one point." },
        { ask: "Keep d₃ = 2 and turn k to 0.", check: s => Math.abs(s.k) < 0.01 && Math.abs(s.d3 - 2) < 0.01, got: "Elimination gives 0z = 0, which every z satisfies. The grey plane holds the whole dashed line: a line of solutions, like pages meeting at a book’s spine." },
        { ask: "Keep k at 0 and slide d₃ away from 2.", check: s => Math.abs(s.k) < 0.01 && Math.abs(s.d3 - 2) > 0.4, got: "Now 0z = d₃ − 2 is not 0, so no z works: no solution. Each pair of planes still meets, but in three parallel lines that form a tunnel." }
      ],
      after: "Elimination reads out the picture. One value for z: one point. 0 = 0: a line of points. 0 = a number that isn’t 0: no point. No point happens when two planes are parallel, or when three planes form a tunnel, as here."
    }
  ],
  why: {
    lead: "A solution of the system is a point on every plane. So the question is about shapes: how can flat sheets cross? For two planes, the normals answer it. For three planes, elimination answers it, and each way it can end matches a picture.",
    steps: [
      ["n₁ not a multiple of n₂ ⇒ the planes cross in a line", "Two sheets that are not parallel must cut each other, and the cut is a whole line."],
      ["direction of that line = n₁ × n₂", "The line lies in both planes, so it is at right angles to both normals. The cross product gives that direction."],
      ["n₂ = mn₁ and d₂ = md₁ ⇒ the same plane", "One equation is just a multiple of the other."],
      ["n₂ = mn₁ but d₂ ≠ md₁ ⇒ no common point", "Parallel sheets with a gap between them."],
      ["x + z = 3,  y + z = 1,  x − y + kz = d₃", "Three planes: the ones in the picture."],
      ["(1) − (2):  x − y = 2", "Eliminate z from the first two."],
      ["(3) − (x − y = 2):  kz = d₃ − 2", "Eliminate x and y. One equation in one unknown is left."],
      ["k ≠ 0:  z = (d₃ − 2) ÷ k", "One value of z, then x = 3 − z and y = 1 − z: one point."],
      ["k = 0:  0 = d₃ − 2", "If d₃ = 2 this reads 0 = 0, so every point of the line works. If not, it is false and nothing works."]
    ],
    end: "k = 0 is exactly when n₃ = n₁ − n₂. Then the three normals lie flat in one plane, so the three crossing lines all run the same way, along n₁ × n₂. They either coincide (a line of solutions) or form a tunnel (none). When the normals are not tied together like that, there is always exactly one point."
  },
  examples: [
    { q: "How do the planes x + 2y − z = 4 and 2x + 4y − 2z = 3 meet?",
      steps: [["n₁ = (1, 2, −1),  n₂ = (2, 4, −2) = 2n₁", "Compare normals first: they are parallel."], ["2 × (x + 2y − z = 4):  2x + 4y − 2z = 8", "Scale the first equation to match the second."], ["8 ≠ 3", "Same left side, different right side."]],
      a: "They are parallel and never meet. (If the second had said = 8, they would be the same plane.)" },
    { q: "Solve x + y + z = 6,  2x − y + z = 3,  x + 2y − z = 2.",
      steps: [["(1) + (3):  2x + 3y = 8", "Adding removes z."], ["(2) + (3):  3x + y = 5", "Remove z from a second pair."], ["y = 5 − 3x, so 2x + 3(5 − 3x) = 8", "Two equations in x and y. Substitute."], ["−7x + 15 = 8, so x = 1", "Solve."], ["y = 5 − 3 = 2,  z = 6 − 1 − 2 = 3", "Substitute back."], ["(2): 2(1) − 2 + 3 = 3 ✓", "Check in another equation."]],
      a: "The three planes meet at the point (1, 2, 3)." },
    { q: "Do the planes x + y − z = 1,  2x − y + z = 5 and 4x + y − z = 7 share any points?",
      steps: [["(1) + (2):  3x = 6, so x = 2", "y and z both cancel."], ["(1) with x = 2:  y − z = −1", "Put x back into (1)."], ["(3) with x = 2:  8 + y − z = 7, so y − z = −1", "Put x into (3)."], ["(y − z = −1) − (y − z = −1):  0 = 0", "The two agree, so one unknown stays free."], ["let z = t:  y = t − 1,  x = 2", "Name the free variable."], ["r = (2, −1, 0) + t(0, 1, 1)", "Write the answer as a line."]],
      a: "A whole line: r = (2, −1, 0) + t(0, 1, 1). (With 4x + y − z = 9 instead, you would get 0 = 2: no points.)" }
  ],
  mistakes: [
    { wrong: "The two planes meet at one point.", why: "Planes are endless flat sheets. If they cross at one point, they cross all along a line through it.", fix: "Two planes meet in a line, are parallel, or are the same plane." },
    { wrong: "Elimination gave 0 = 0, so there is no solution (or the answer is 0).", why: "0 = 0 is true. It means one equation added nothing new, so a whole line (or plane) of points works.", fix: "0 = 0: infinitely many solutions. 0 = 5: none." },
    { wrong: "x + y + z = 2 and 2x + 2y + 2z = 2 are the same plane, because the normals are parallel.", why: "Parallel normals only say the planes are parallel. Doubling the first gives 2x + 2y + 2z = 4, and the right sides differ.", fix: "Parallel normals give the same plane only if the whole equation is a multiple, constant included." },
    { wrong: "There is no solution, so two of the planes must be parallel.", why: "Three planes can share no point with no two of them parallel. Each pair meets in a line, and the three lines run side by side like a tunnel.", fix: "No solution means elimination ends in 0 = a number that isn’t 0. Parallel planes are only one way that happens." }
  ],
  teach: {
    script: [
      "Hold up two sheets of paper. Ask: how can two planes meet? Find all three: crossing in a line, parallel, the same sheet.",
      "Ask why two planes can’t meet at only one point. Let him try it with the paper.",
      "Add a third sheet. Show one point (the corner of a room), a line (pages at a book’s spine) and nothing (a tunnel, or three parallel sheets).",
      "Solve a 3 × 3 system by elimination. Point out that each step removes a variable until one equation in one unknown is left.",
      "Then change the last right side and redo it. Show how 0 = 0 and 0 = 5 appear, and match each one to a picture."
    ],
    board: "Three columns headed “one point”, “a line” and “no point”. Under each, a sketch (room corner, book spine, tunnel) and what elimination ends with: z = a number, 0 = 0, 0 = 5.",
    ask: [
      { q: "Two planes have normals (1, 2, 3) and (2, 4, 6). What could happen?", listen: "“Parallel or the same plane: compare the constants after scaling.” If he says they cross, ask whether the normals point the same way." },
      { q: "Elimination ends with 0 = 0. How many solutions are there?", listen: "“Infinitely many, a line of them.” If he says none or zero, ask: is 0 = 0 true or false?" },
      { q: "Three planes, no two parallel. Must they meet at a point?", listen: "“No: they can form a tunnel, or share a line.” If he says yes, build the tunnel with three sheets." }
    ],
    confusion: "The big one is reading 0 = 0 as “no solution” because it looks empty. Ask “is that statement true?” A true statement with no unknowns left means any value works. The other is assuming that no solution must mean parallel planes. The tunnel is the case students miss."
  },
  recap: [
    "Two planes: compare normals. Not parallel means a line along n₁ × n₂. Parallel means the same plane or no common point.",
    "Three planes: eliminate one variable at a time until one equation in one unknown is left.",
    "A value: one point. 0 = 0: infinitely many (a line). 0 = a number that isn’t 0: no solution."
  ]
};

/* ===================== skew lines ===================== */
const SK = { P: [-2, -1, 1], d1: [1, 0, -1], Q: [1, -2, 3], d2: [0, 2, -1] };
const skGap = (p, V) => V.sub(V.add(SK.Q, V.scale(SK.d2, p.s)), V.add(SK.P, V.scale(SK.d1, p.t)));
const OV = { P: [-1, -2, -1], d1: [1, 1, 0] };
const ovD2 = th => [Math.cos(th * PI / 180), Math.sin(th * PI / 180), 0];
const ovPar = th => Math.abs(th - 45) < 1e-6;
CP.LESSONS.skew = {
  big: "In 3D, two lines can meet, run parallel, or be skew: not parallel and never meeting. The shortest gap between skew lines is at right angles to both, along d₁ × d₂, and its length is |(Q − P) · (d₁ × d₂)| ÷ |d₁ × d₂|.",
  intro: [
    "On paper, two lines that aren’t parallel always cross. In 3D they usually don’t. Think of a road on an overpass and the road underneath it: they point different ways, but one passes over the other.",
    "So lines in 3D have three possible relationships: they meet, they are parallel, or they are skew. This lesson gives the test that tells them apart, and shows how close skew lines come."
  ],
  see: [
    {
      h: "Lift one line over the other",
      text: "Line 1 (teal) is r = (−1, −2, −1) + t(1, 1, 0). Line 2 (purple) is level too: its direction is (cos θ, sin θ, 0), and h lifts it. Seen from straight above, the two lines cross unless they are parallel. Turn the picture to check whether they really do.",
      widget: { type: "vec3", range: 5, yaw: -0.5, pitch: 0.3,
        params: [{ name: "th", label: "angle θ", min: 0, max: 180, step: 5, val: 120, show: v => fmt(v, 0) + "°" },
                 { name: "h", label: "lift h", min: -3, max: 3, step: 0.5, val: 2, show: v => fmt(v, 1) }],
        scene: (p, V) => {
          const Q = [1, 0, p.h - 1], o = [
            { t: "line", p: OV.P, d: OV.d1, c: 1, label: "line 1" },
            { t: "line", p: Q, d: ovD2(p.th), c: 2, label: "line 2" },
            { t: "pt", at: [1, 0, -1], c: 1 }];
          if (Math.abs(p.h) > 1e-9) o.push({ t: "seg", a: [1, 0, -1], b: Q, c: 5, dash: true }, { t: "pt", at: Q, c: 2 });
          else if (!ovPar(p.th)) o.push({ t: "pt", at: [1, 0, -1], c: 3, label: "meet" });
          return o;
        },
        readouts: [
          { label: "line 2", value: (p, V) => "r = " + V.fmt([1, 0, p.h - 1]) + " + s" + V.fmt(ovD2(p.th)) },
          { label: "d₁ × d₂", value: (p, V) => V.fmt(V.cross(OV.d1, ovD2(p.th))) },
          { label: "x and y agree at", value: p => ovPar(p.th) ? "no single t and s" : "t = 2, s = 0" },
          { label: "then z is", value: p => ovPar(p.th) ? "not needed" : "−1 on line 1, " + fmt(p.h - 1, 1) + " on line 2" },
          { label: "the lines", value: p => ovPar(p.th) ? (Math.abs(p.h) < 1e-9 ? "are the same line" : "are parallel") : Math.abs(p.h) < 1e-9 ? "meet at (1, 0, −1)" : "are skew" }
        ] },
      tasks: [
        { ask: "Lower line 2 to h = 0.", check: s => Math.abs(s.h) < 0.01 && Math.abs(s.th - 45) > 1, got: "Now z agrees too: both are −1 at t = 2, s = 0. The lines meet at (1, 0, −1)." },
        { ask: "Lift it again, by 1 or more, and turn θ to any angle you like. Can you find one where they meet?", check: s => Math.abs(s.h) >= 0.99 && Math.abs(s.th - 45) > 1, got: "No angle works. From above they still cross, but z is −1 on line 1 and h − 1 on line 2. Not parallel and never meeting: skew." },
        { ask: "Turn line 2 until it runs the same way as line 1.", check: s => Math.abs(s.th - 45) < 1 && Math.abs(s.h) > 0.01, got: "At θ = 45°, d₂ is a multiple of d₁ and d₁ × d₂ = (0, 0, 0). These lines never meet either, but they are parallel, not skew." },
        { ask: "Keep it parallel and lower it to h = 0.", check: s => Math.abs(s.th - 45) < 1 && Math.abs(s.h) < 0.01, got: "Now line 2 lies right on line 1. They are the same line, so every point is shared." }
      ],
      after: "Check the directions first. Parallel directions: parallel lines or the same line. Otherwise solve two coordinates for t and s, then test the third. If it agrees, the lines meet; if not, they are skew. A flat page has no third coordinate, which is why skew lines only exist in 3D."
    },
    {
      h: "Find the shortest gap",
      text: "Line 1 (teal) is r = (−2, −1, 1) + t(1, 0, −1). Line 2 (purple) is r = (1, −2, 3) + s(0, 2, −1). The orange segment joins your point on each line. The green arrow is d₁ × d₂ = (2, 1, 2), drawn from your point on line 1.",
      widget: { type: "vec3", range: 5, yaw: -0.6, pitch: 0.35,
        params: [{ name: "t", label: "t", min: -2, max: 4, step: 0.25, val: -1, show: v => fmt(v, 2) },
                 { name: "s", label: "s", min: -1, max: 3, step: 0.25, val: 2.5, show: v => fmt(v, 2) }],
        scene: (p, V) => {
          const X1 = V.add(SK.P, V.scale(SK.d1, p.t)), X2 = V.add(SK.Q, V.scale(SK.d2, p.s));
          return [
            { t: "line", p: SK.P, d: SK.d1, c: 1, label: "line 1" },
            { t: "line", p: SK.Q, d: SK.d2, c: 2, label: "line 2" },
            { t: "vec", from: X1, to: V.cross(SK.d1, SK.d2), c: 4, label: "d₁ × d₂" },
            { t: "seg", a: X1, b: X2, c: 3 },
            { t: "pt", at: X1, c: 1 },
            { t: "pt", at: X2, c: 2 }
          ];
        },
        readouts: [
          { label: "gap", value: (p, V) => V.fmt(skGap(p, V)) },
          { label: "length", value: (p, V) => fmt(V.norm(skGap(p, V)), 3) },
          { label: "gap · d₁", value: (p, V) => fmt(V.dot(skGap(p, V), SK.d1), 2) },
          { label: "gap · d₂", value: (p, V) => fmt(V.dot(skGap(p, V), SK.d2), 2) }
        ] },
      tasks: [
        { ask: "Move only t until gap · d₁ = 0.", check: s => Math.abs(V.dot(skGap(s, V), SK.d1)) < 0.01, got: "The gap now meets line 1 at a right angle. For this point on line 2, that is the closest spot on line 1." },
        { ask: "Now move both sliders until the length is as small as it can be.", check: s => near(V.norm(skGap(s, V)), 3, 0.001), got: "The length bottoms out at 3, at t = 1 and s = 1. Both dot products are 0, and the gap lines up with the green arrow, d₁ × d₂." },
        { ask: "Step either slider away from that spot.", check: s => V.norm(skGap(s, V)) > 3.01, got: "Any move makes the gap longer, and a dot product stops being 0. The smallest gap is 3, not 0, so these lines never meet: they are skew." }
      ],
      after: "The shortest gap is at right angles to both lines, so it points along d₁ × d₂. Its length is the part of Q − P in that direction: (3, −1, 2) · (2, 1, 2) = 9, and 9 ÷ |(2, 1, 2)| = 9 ÷ 3 = 3. That is the formula, with no sliding needed."
    }
  ],
  why: {
    lead: "Two questions: do the lines meet, and if not, how close do they come? Write line 1 as P + td₁ and line 2 as Q + sd₂. Both answers come from the gap between a point on each line.",
    steps: [
      ["d₂ = md₁ ?", "If the directions are multiples, the lines are parallel or the same line. Test whether Q is on line 1."],
      ["P + td₁ = Q + sd₂", "Otherwise set the lines equal: three equations (x, y and z) in two unknowns, t and s."],
      ["solve two, check the third", "Two equations pin down t and s. The third is a free test: true means they meet, false means skew."],
      ["gap = (Q − P) + sd₂ − td₁", "The segment from a point on line 1 to a point on line 2."],
      ["n = d₁ × d₂, so n · d₁ = n · d₂ = 0", "The cross product is at right angles to both directions."],
      ["gap · n = (Q − P) · n", "Dot the gap with n and the s and t parts vanish. Every gap has the same part along n."],
      ["shortest gap ∥ n", "If the gap leaned along one of the lines, sliding along that line would shorten it. So the shortest gap is at right angles to both."],
      ["length = |(Q − P) · n| ÷ |n|", "For a gap that points along n, its length is its dot product with n divided by |n|."]
    ],
    end: "The same number gives a quick test. If the directions are not parallel and (Q − P) · (d₁ × d₂) = 0, the shortest gap is 0, so the lines meet. If it isn’t 0, they are skew."
  },
  examples: [
    { q: "How are r = (1, 0, 2) + t(2, −1, 3) and r = (0, 1, 1) + s(−4, 2, −6) related?",
      steps: [["(−4, 2, −6) = −2(2, −1, 3)", "The directions are multiples: parallel or the same line."], ["Q − P = (0, 1, 1) − (1, 0, 2) = (−1, 1, −1)", "If Q were on line 1, this would be a multiple of (2, −1, 3)."], ["−1 ÷ 2 = −0.5, but 1 ÷ (−1) = −1", "The ratios differ, so it is not a multiple."]],
      a: "Parallel lines that never meet. (Not skew: skew lines are not parallel.)" },
    { q: "Do r = (1, 0, 2) + t(1, 1, 0) and r = (2, −1, 4) + s(0, 1, 2) meet?",
      steps: [["(1, 1, 0) and (0, 1, 2) are not multiples", "Not parallel, so they meet or are skew."], ["x:  1 + t = 2, so t = 1", "Start with the easiest coordinate."], ["y:  0 + t = −1 + s, so s = 2", "Put t = 1 in to find s."], ["z:  line 1 gives 2; line 2 gives 4 + 2(2) = 8", "Test the third coordinate."], ["2 ≠ 8", "The test fails."]],
      a: "They never meet. Not parallel and not meeting: skew." },
    { q: "How far apart are the lines in the last example at their closest?",
      steps: [["d₁ × d₂ = (1, 1, 0) × (0, 1, 2) = (2, −2, 1)", "(1·2 − 0·1, 0·0 − 1·2, 1·1 − 1·0)."], ["|d₁ × d₂| = √(4 + 4 + 1) = 3", "Length of the direction at right angles to both lines."], ["Q − P = (2, −1, 4) − (1, 0, 2) = (1, −1, 2)", "One gap between the lines."], ["(1, −1, 2) · (2, −2, 1) = 2 + 2 + 2 = 6", "Its part along d₁ × d₂, before dividing."], ["6 ÷ 3 = 2", "Divide by |d₁ × d₂|."]],
      a: "2 units" }
  ],
  mistakes: [
    { wrong: "The directions aren’t parallel, so the lines must meet.", why: "That is true on a flat page. In 3D one line can pass over the other.", fix: "Not parallel means they meet or are skew. Solve two coordinates, then check the third." },
    { wrong: "Setting P + td₁ = Q + td₂, with the same letter t on both lines.", why: "That forces both points to the same parameter value. Lines can meet at t = 1 on one and s = 2 on the other.", fix: "Use different letters: P + td₁ = Q + sd₂." },
    { wrong: "Solving x and y gives t = 1 and s = 2, so the lines meet.", why: "Two equations in two unknowns usually have a solution. The third coordinate is the real test.", fix: "Put t and s into z as well. The lines meet only if it agrees." },
    { wrong: "The distance between the lines is |Q − P|.", why: "P and Q are just the starting points you were given. The segment between them is usually slanted, so it is longer than the shortest gap.", fix: "Distance = |(Q − P) · (d₁ × d₂)| ÷ |d₁ × d₂|." }
  ],
  teach: {
    script: [
      "Hold two pencils. Make them cross, then lift one. Ask: are they parallel? Do they meet? That third case is skew.",
      "Point out that from straight above they still look as if they cross. The height is the third coordinate, and it is the test.",
      "Write P + td₁ = Q + sd₂ as three equations. Solve two for t and s, then check the third out loud.",
      "For the distance, hold the pencils skew and ask where they come closest. Show that the shortest gap is square to both pencils.",
      "Say: the direction square to both is d₁ × d₂. The distance is how much of Q − P points that way."
    ],
    board: "Two lines, one passing over the other, with the shortest gap drawn square to both. Label d₁, d₂, the gap along d₁ × d₂, and Q − P as a longer slanted segment.",
    ask: [
      { q: "Two lines aren’t parallel. Can you say they meet?", listen: "“Not yet: they could be skew. Check the third equation.” If he says yes, lift one pencil above the other." },
      { q: "Why do the two lines need different parameters, t and s?", listen: "“The meeting point can be at different places along each line.” If he is unsure, show a meeting at t = 1 on one line and s = 2 on the other." },
      { q: "Why is the shortest gap along d₁ × d₂?", listen: "“It has to be at right angles to both lines, and the cross product is at right angles to both.” If he is stuck, ask what happens if the gap leans along one line." }
    ],
    confusion: "Students carry a flat-page habit into 3D: “not parallel, so they cross.” Lift a pencil to break it. The second slip is using t for both lines, which can turn a real meeting point into “no solution”."
  },
  recap: [
    "Parallel directions: parallel lines or the same line. Otherwise the lines meet or are skew.",
    "Set P + td₁ = Q + sd₂, solve two coordinates for t and s, then check the third.",
    "Distance between skew lines: |(Q − P) · (d₁ × d₂)| ÷ |d₁ × d₂|."
  ]
};

/* ===================== distance from a point to a plane ===================== */
const DN = [2, 1, 2];
const dQ = p => [1 + p.w, 1 - 2 * p.w, p.z];
CP.LESSONS.dist = {
  big: "The distance from a point to a plane is measured along the normal. Put the point into the plane’s equation to see how far off it is, then divide by the length of the normal: |aq₁ + bq₂ + cq₃ − d| ÷ √(a² + b² + c²).",
  intro: [
    "How far is a point from a plane? There are many paths from the point to the plane, but only one is shortest: the one that meets the plane at a right angle, along the normal.",
    "The formula has two parts. The top asks how far the point is from fitting the plane’s equation. The bottom, the length of the normal, turns that into a real distance. The pictures show why you need both."
  ],
  see: [
    {
      h: "Move a point and watch its distance",
      text: "The teal plane is 2x + y + 2z = 4, with normal n = (2, 1, 2). The orange point Q moves up and down with z, and sideways with w. The green segment is the shortest path, along the normal. The grey dashed segment drops straight down.",
      widget: { type: "vec3", range: 5, yaw: -0.4, pitch: 0.3,
        params: [{ name: "z", label: "height z", min: -4, max: 5, step: 0.5, val: 3, show: v => fmt(v, 1) },
                 { name: "w", label: "slide w", min: -2, max: 2, step: 0.5, val: 0, show: v => fmt(v, 1) }],
        scene: (p, V) => {
          const Q = dQ(p), g = V.dot(DN, Q) - 4, F = V.sub(Q, V.scale(DN, g / 9)), B = [Q[0], Q[1], 0.5], o = [
            { t: "plane", n: DN, d: 4, c: 1, size: 4.2 },
            { t: "pt", at: Q, c: 3, label: "Q" }];
          if (Math.abs(g) > 1e-9) o.push({ t: "seg", a: Q, b: F, c: 4 }, { t: "pt", at: F, c: 4, r: 3.5 }, { t: "seg", a: Q, b: B, c: 5, dash: true });
          return o;
        },
        readouts: [
          { label: "Q", value: (p, V) => V.fmt(dQ(p)) },
          { label: "top: 2x + y + 2z − 4", value: (p, V) => fmt(V.dot(DN, dQ(p)) - 4, 2) },
          { label: "bottom: |n|", value: () => "√9 = 3" },
          { label: "distance", value: (p, V) => fmt(Math.abs(V.dot(DN, dQ(p)) - 4) / 3, 2) },
          { label: "straight down", value: p => fmt(Math.abs(p.z - 0.5), 2) }
        ] },
      tasks: [
        { ask: "Lower Q until it is on the plane.", check: s => Math.abs(s.z - 0.5) < 0.01, got: "At z = 0.5 the top is 0: Q makes 2x + y + 2z = 4 true. The distance is 0." },
        { ask: "Raise Q until it is exactly 3 from the plane.", check: s => s.z > 0.5 && near(Math.abs(2 * s.z - 1) / 3, 3, 0.01), got: "z = 5. The top is 9, and 9 ÷ 3 = 3. But the drop straight down is 4.5: a sloped plane is closer than the point directly below." },
        { ask: "Now slide Q sideways with w.", check: s => Math.abs(s.w) >= 0.49 && near(Math.abs(2 * s.z - 1) / 3, 3, 0.01), got: "Still 3. The slide runs along (1, −2, 0), and (1, −2, 0) · n = 0. So Q moves parallel to the plane and gets no closer." },
        { ask: "Find a spot 3 from the plane on the other side.", check: s => s.z < 0.5 && near(Math.abs(2 * s.z - 1) / 3, 3, 0.01), got: "z = −4. The top is −9 now. The sign tells you which side Q is on; the absolute value gives the distance, 3." }
      ],
      after: "The top, n · Q − d, measures how far Q is from fitting the equation. Here it is always 3 times the true distance, because |n| = 3. Dividing by |n| corrects that. The shortest path runs along the normal, and it is straight down only when the plane is level."
    },
    {
      h: "Double the equation: the distance must not change",
      text: "Teal: 2x + y + 2z = 4. Purple: 4x + 2y + 4z = D, a parallel plane written with doubled numbers. The green segment is the gap between them, along the normal. Move D and read the distance.",
      widget: { type: "vec3", range: 5, yaw: -0.4, pitch: 0.3,
        params: [{ name: "D", label: "D", min: -10, max: 20, step: 1, val: 14, show: v => fmt(v, 0) }],
        scene: (p, V) => {
          const A = V.scale(DN, 4 / 9), B = V.scale(DN, p.D / 18), o = [
            { t: "plane", n: DN, d: 4, c: 1, size: 3.5 },
            { t: "plane", n: V.scale(DN, 2), d: p.D, c: 2, size: 3.5 }];
          if (Math.abs(p.D - 8) > 1e-9) o.push({ t: "seg", a: A, b: B, c: 4 }, { t: "pt", at: A, c: 4, r: 3.5 }, { t: "pt", at: B, c: 4, r: 3.5 });
          return o;
        },
        readouts: [
          { label: "purple", value: p => "4x + 2y + 4z = " + fmt(p.D, 0) },
          { label: "halved", value: p => "2x + y + 2z = " + fmt(p.D / 2, 1) },
          { label: "distance", value: p => "|" + fmt(p.D / 2, 1) + " − 4| ÷ 3 = " + fmt(Math.abs(p.D / 2 - 4) / 3, 2) }
        ] },
      tasks: [
        { ask: "Make the purple plane the same plane as the teal one.", check: s => Math.abs(s.D - 8) < 0.01, got: "D = 8, not 4. Halve 4x + 2y + 4z = 8 and you get 2x + y + 2z = 4 exactly." },
        { ask: "Raise D until the planes are 2 apart.", check: s => s.D > 8 && near(Math.abs(s.D / 2 - 4) / 3, 2, 0.01), got: "D = 20. Halved, the constants are 10 and 4. They differ by 6, and 6 ÷ |n| = 6 ÷ 3 = 2." },
        { ask: "Now find the spot that is 2 apart on the other side.", check: s => s.D < 8 && near(Math.abs(s.D / 2 - 4) / 3, 2, 0.01), got: "D = −4, which halves to −2. |−2 − 4| = 6, and 6 ÷ 3 = 2." }
      ],
      after: "Before you compare two parallel planes, make their normals match. Then the distance is |d₂ − d₁| ÷ |n|. That is the point formula again: take any point on one plane and measure to the other."
    }
  ],
  why: {
    lead: "Pick any point A on the plane. The arrow from A to Q has two parts: one along the plane, which brings Q no closer, and one along the normal, which is the distance. A projection picks out the normal part.",
    steps: [
      ["n · A = d", "A is on the plane, so it satisfies the equation."],
      ["distance = length of the shadow of Q − A on n", "The shortest path runs along the normal, so the distance is the part of Q − A that points along n."],
      ["shadow = |(Q − A) · n| ÷ |n|", "Scalar projection: dot with n, then divide by |n|."],
      ["(Q − A) · n = n · Q − n · A = n · Q − d", "A drops out: every point on the plane gives the same answer."],
      ["n · Q − d = aq₁ + bq₂ + cq₃ − d", "Write it in coordinates, with n = (a, b, c) and Q = (q₁, q₂, q₃)."],
      ["distance = |aq₁ + bq₂ + cq₃ − d| ÷ √(a² + b² + c²)", "That is the rule."]
    ],
    end: "Multiply the plane’s equation by 2 and the top doubles, but so does |n|, so the distance stays the same. Without the division, writing the same plane a different way would change the distance, which can’t be right."
  },
  examples: [
    { q: "How far is Q (4, −1, −3) from the plane y = 2?",
      steps: [["The plane y = 2 is flat across x and z", "Only the y-coordinate matters. (Its normal is (0, 1, 0), of length 1.)"], ["|−1 − 2| = 3", "The distance is the difference in y."]],
      a: "3" },
    { q: "How far is Q (2, 1, 2) from the plane 2x + 3y + 6z = 5?",
      steps: [["Top: 2(2) + 3(1) + 6(2) − 5 = 14", "Put Q into the left side and take away d."], ["Bottom: √(4 + 9 + 36) = √49 = 7", "Length of the normal (2, 3, 6)."], ["14 ÷ 7 = 2", "Divide."]],
      a: "2" },
    { q: "How far apart are the parallel planes 2x − y + 2z = 1 and 4x − 2y + 4z = 20?",
      steps: [["4x − 2y + 4z = 20 → 2x − y + 2z = 10", "Halve the second so both have normal (2, −1, 2)."], ["Q = (0, −1, 0) is on the first plane", "2(0) − (−1) + 2(0) = 1."], ["Top: 2(0) − (−1) + 2(0) − 10 = −9", "Put Q into the second plane’s left side and take away 10."], ["Bottom: √(4 + 1 + 4) = 3", "Length of the normal."], ["|−9| ÷ 3 = 3", "Absolute value, then divide."]],
      a: "3 units. (Shortcut: |10 − 1| ÷ 3 = 3.)" }
  ],
  mistakes: [
    { wrong: "The distance from (2, 1, 2) to 2x + 3y + 6z = 5 is 14.", why: "14 is only the top. It would double if you doubled the equation, so it can’t be the distance.", fix: "Divide by |n| = 7: the distance is 2." },
    { wrong: "Top = 2(2) + 3(1) + 6(2) = 19, so the distance is 19 ÷ 7.", why: "That leaves out d. It measures to the parallel plane through the origin, not to this plane.", fix: "Take away d first: 19 − 5 = 14, and 14 ÷ 7 = 2." },
    { wrong: "The planes 2x − y + 2z = 1 and 4x − 2y + 4z = 20 are |20 − 1| ÷ 3 ≈ 6.33 apart.", why: "You can only compare the constants once the normals match. The second plane is written with doubled numbers.", fix: "Halve it first: 2x − y + 2z = 10, so |10 − 1| ÷ 3 = 3." },
    { wrong: "The distance is how far the point is straight above the plane.", why: "Straight down is shortest only when the plane is level. In the picture, Q at height 5 was 4.5 above the plane but only 3 from it.", fix: "Measure along the normal: |n · Q − d| ÷ |n|." }
  ],
  teach: {
    script: [
      "Hold a book at a slant and a pen tip above it. Ask: what is the shortest way from the tip to the cover? Lead him to the path at a right angle, not straight down.",
      "Put a point into the plane’s equation. Say: if the point were on the plane, you would get d. How far off you are is the top of the formula.",
      "Multiply the plane’s equation by 10. Ask: did the plane move? Did the top change? So the top alone can’t be the distance.",
      "Divide by |n| to fix it. Work one example with a normal like (2, 3, 6), so the square root comes out to a whole number (7).",
      "End with parallel planes: make the normals match, then use the same formula."
    ],
    board: "A sloped plane, a point Q above it, a dashed line straight down, and a solid line meeting the plane at a right angle. Label the solid line “distance” and write |n · Q − d| ÷ |n| beside it.",
    ask: [
      { q: "A point Q gives n · Q − d = 0. What does that tell you?", listen: "“Q is on the plane: distance 0.” If he hesitates, ask what it means for a point to satisfy the equation." },
      { q: "Why can’t the distance be just |n · Q − d|?", listen: "“Doubling the equation would double it, but the plane didn’t move.” If he is stuck, have him double an equation and work it out again." },
      { q: "How would you find the distance between two parallel planes?", listen: "“Make the normals match, pick a point on one, use the formula with the other”, or the shortcut |d₂ − d₁| ÷ |n|. If he subtracts the raw constants, ask whether the normals match." }
    ],
    confusion: "Two slips are common. First, forgetting to divide by |n|, because the top looks like a distance. Doubling the equation is the quickest cure. Second, comparing the constants of parallel planes written with different multiples. Always make the normals identical first."
  },
  recap: [
    "Distance from Q to ax + by + cz = d: |aq₁ + bq₂ + cq₃ − d| ÷ √(a² + b² + c²).",
    "The top says how far Q is from fitting the equation. The bottom turns that into a length.",
    "Parallel planes: match the normals, then the distance is |d₂ − d₁| ÷ |n|."
  ]
};
})();
