/* Full lessons: vector basics, bearings, dot product. */
window.CP = window.CP || {};
(function () {
CP.LESSONS = CP.LESSONS || {};
const { fmt } = CP.W, PI = Math.PI, V = CP.V;
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const at = (p, x, y) => near(p[0], x, 1e-9) && near(p[1], y, 1e-9);
const deg = r => r * 180 / PI;

/* ======================= vector basics ======================= */
CP.LESSONS.vbasic = {
  big: "A vector is a list of moves, one per axis. To add, subtract or scale vectors, work on each component separately. Its length is Pythagoras: square each component, add, then take the square root.",
  intro: [
    "A vector is an arrow: it has a length and a direction, but no fixed starting point. We write it with components, like (3, 4): 3 units along x, then 4 units along y. In three dimensions there is a third component for z.",
    "Almost everything in this unit comes from two facts. First, vectors combine one component at a time, so the x-parts never mix with the y-parts. Second, the length of a vector comes from Pythagoras. Play with the pictures below and you will see both."
  ],
  see: [
    {
      h: "Adding is walking tip to tail",
      text: "Drag the tips of u and v. The orange arrow is u + v. The dashed purple arrow is a copy of v that starts where u ends. So u + v means “walk along u, then along v”. The readouts give every vector as components.",
      widget: { type: "vec2", mode: "add", u: [2, 1], v: [1, 3] },
      tasks: [
        { ask: "Leave u at (2, 1). Drag v until u + v = (5, 3).", check: s => at(s.u, 2, 1) && at(s.sum, 5, 3), got: "v = (3, 2). The x-parts add: 2 + 3 = 5. The y-parts add: 1 + 2 = 3. They never mix." },
        { ask: "Now make u + v = (0, 0), with u not zero.", check: s => near(s.sum[0], 0, 1e-9) && near(s.sum[1], 0, 1e-9) && s.nu > 0, got: "v is exactly −u: the same length, pointing the opposite way. The walk brings you back to the start, and the parallelogram folds flat." },
        { ask: "Make u + v point straight up the y-axis, with neither u nor v on the y-axis itself.", check: s => near(s.sum[0], 0, 1e-9) && s.sum[1] > 0 && Math.abs(s.u[0]) > 0 && Math.abs(s.v[0]) > 0, got: "The x-parts cancel: v’s x-part is minus u’s. Only the y-parts are left. This is how a pilot cancels a crosswind." }
      ],
      after: "Each axis keeps its own account. That is the whole rule for adding: (a, b) + (c, d) = (a + c, b + d). Subtracting works the same way, because u − v is just u + (−v). Notice too that the parallelogram has two routes to the same corner: u then v, or v then u. So u + v = v + u."
    },
    {
      h: "Scaling stretches every component",
      text: "Drag u, then move the k slider. The orange arrow is ku: every component of u multiplied by k. The last readout compares the two lengths.",
      widget: { type: "vec2", mode: "scale", u: [2, 1], k: 1.5 },
      tasks: [
        { ask: "Set k = 3.", check: s => near(s.k, 3, 0.05), got: "Every component is tripled, so ku points the same way and is 3 times as long. The length ratio reads 3." },
        { ask: "Set k = −1.", check: s => near(s.k, -1, 0.05), got: "This is −u. Every sign flips, so the arrow turns to face the opposite way. Its length does not change." },
        { ask: "Find the k that makes ku half as long as u and pointing the other way.", check: s => near(s.k, -0.5, 0.05), got: "k = −0.5. The size of k sets the stretch. The sign of k sets the direction." }
      ],
      after: "Multiplying by k multiplies every component by k. The arrow becomes |k| times as long. A negative k also turns it around. So 2u − 3v is just two scalings and one subtraction, each done one component at a time."
    },
    {
      h: "Length is Pythagoras, twice in 3D",
      text: "Turn the picture by dragging it. The sliders set u = (a, b, c). The dashed orange line on the floor is the diagonal √(a² + b²). The height c stands at right angles to it, so a second right triangle gives the full length.",
      widget: { type: "vec3", range: 6, yaw: -0.5, pitch: 0.35,
        params: [
          { name: "a", label: "a (x)", min: -6, max: 6, step: 1, val: 5, show: v => fmt(v, 0) },
          { name: "b", label: "b (y)", min: -6, max: 6, step: 1, val: 2, show: v => fmt(v, 0) },
          { name: "c", label: "c (z)", min: -6, max: 6, step: 1, val: 4, show: v => fmt(v, 0) }
        ],
        scene: p => [
          { t: "seg", a: [0, 0, 0], b: [p.a, 0, 0], c: 2 },
          { t: "seg", a: [p.a, 0, 0], b: [p.a, p.b, 0], c: 2 },
          { t: "seg", a: [0, 0, 0], b: [p.a, p.b, 0], c: 3, dash: true },
          { t: "seg", a: [p.a, p.b, 0], b: [p.a, p.b, p.c], c: 2 },
          { t: "vec", to: [p.a, p.b, p.c], c: 1, label: "u" }
        ],
        readouts: [
          { label: "floor √(a² + b²)", value: p => fmt(Math.hypot(p.a, p.b), 3) },
          { label: "length |u|", value: p => fmt(Math.hypot(p.a, p.b, p.c), 3) },
          { label: "a + b + c", value: p => fmt(p.a + p.b + p.c, 2) }
        ] },
      tasks: [
        { ask: "Set c = 0, then make (a, b) = (3, 4).", check: s => s.a === 3 && s.b === 4 && s.c === 0, got: "Length 5. With c = 0 the arrow lies flat, so it is Pythagoras once: √(3² + 4²) = √25 = 5." },
        { ask: "Now make u = (2, 3, 6).", check: s => s.a === 2 && s.b === 3 && s.c === 6, got: "The floor diagonal is √(4 + 9) = √13 ≈ 3.606. The height 6 stands on it at a right angle, so the length is √(13 + 36) = √49 = 7." },
        { ask: "Flip two signs: make u = (−2, 3, −6).", check: s => s.a === -2 && s.b === 3 && s.c === -6, got: "Still 7. Each component gets squared, and squares are never negative. But a + b + c is now −5. A sum can be negative. A length never is." },
        { ask: "Make u = (4, 4, 2). Compare the length with a + b + c.", check: s => s.a === 4 && s.b === 4 && s.c === 2, got: "Length √(16 + 16 + 4) = √36 = 6, but a + b + c = 10. Adding the parts is like walking along each axis in turn. The straight arrow is shorter." }
      ],
      after: "|(a, b, c)| = √(a² + b² + c²). First Pythagoras on the floor gives √(a² + b²). Then Pythagoras again with the height c. Squaring the floor diagonal undoes its square root, so the two steps join into one formula."
    }
  ],
  why: {
    lead: "Every rule here comes from one idea: a vector is a move along x, then along y (then along z). Moves along different axes never interfere with each other.",
    steps: [
      ["u = (u₁, u₂) means u₁ along x, then u₂ along y", "Components are just the moves along each axis."],
      ["u + v: u₁ then v₁ along x, u₂ then v₂ along y", "Walk u, then walk v. Along x you moved u₁ and then v₁."],
      ["u + v = (u₁ + v₁, u₂ + v₂)", "So the totals along each axis simply add."],
      ["ku = (ku₁, ku₂)", "Stretching the arrow by k stretches its triangle of moves by k. Similar triangles: every side grows by the same factor."],
      ["u − v = u + (−1)v = (u₁ − v₁, u₂ − v₂)", "Subtracting is adding the reversed vector."],
      ["|(a, b)| = √(a² + b²)", "The moves a and b are the two short sides of a right triangle. The arrow is the long side."],
      ["|(a, b, c)|² = (√(a² + b²))² + c² = a² + b² + c²", "In 3D, the floor diagonal and the height c make a second right triangle. Square the floor diagonal and its root disappears."],
      ["|(a, b, c)| = √(a² + b² + c²)", "Take the square root. This is Pythagoras twice."]
    ],
    end: "This is why the length is not the sum of the components. Walking along each axis in turn covers |a| + |b| + |c|, and the straight arrow is shorter than that walk unless the vector lies along a single axis."
  },
  examples: [
    { q: "u = (3, −1) and v = (−5, 4). Find u + v and u − v.",
      steps: [["x: 3 + (−5) = −2", "Add the first components."], ["y: −1 + 4 = 3", "Add the second components. So u + v = (−2, 3)."], ["x: 3 − (−5) = 8", "Subtracting a negative is adding."], ["y: −1 − 4 = −5", "So u − v = (8, −5)."]],
      a: "u + v = (−2, 3) and u − v = (8, −5)" },
    { q: "u = (2, −6, 9). Find |u| and |−3u|.",
      steps: [["2² = 4,  (−6)² = 36,  9² = 81", "Square each component. Every square is positive."], ["4 + 36 + 81 = 121", "Add the squares."], ["|u| = √121 = 11", "Take the square root."], ["−3u = (−6, 18, −27)", "Multiply every component by −3."], ["|−3u| = 3 × 11 = 33", "Scaling by −3 makes the arrow 3 times as long. Check: 36 + 324 + 729 = 1089 = 33²."]],
      a: "|u| = 11 and |−3u| = 33" },
    { q: "u = (2, −4, 4) and v = (−1, −4, 4). Find |2u − 3v|.",
      steps: [["2u = (4, −8, 8)", "Scale u by 2."], ["3v = (−3, −12, 12)", "Scale v by 3."], ["2u − 3v = (4 − (−3), −8 − (−12), 8 − 12)", "Subtract one component at a time. Watch the double negatives."], ["2u − 3v = (7, 4, −4)", "4 + 3 = 7, −8 + 12 = 4, 8 − 12 = −4."], ["49 + 16 + 16 = 81", "Square and add."], ["|2u − 3v| = √81 = 9", "Take the square root."]],
      a: "|2u − 3v| = 9" }
  ],
  mistakes: [
    { wrong: "|(3, 4)| = 3 + 4 = 7", why: "That adds the components. Length comes from Pythagoras, and the straight arrow is shorter than walking 3 across and then 4 up.", fix: "|(3, 4)| = √(9 + 16) = √25 = 5" },
    { wrong: "|(2, −6, 9)| = √(4 − 36 + 81) = √49 = 7", why: "(−6)² was written as −36. The square of a negative number is positive, so every term under the root is positive.", fix: "√(4 + 36 + 81) = √121 = 11" },
    { wrong: "(4, −2) − (1, −5) = (3, −7)", why: "The second component did −2 − 5. But it should subtract −5, and subtracting a negative is adding.", fix: "(4 − 1, −2 − (−5)) = (3, 3)" },
    { wrong: "3(2, −1, 4) = (6, −1, 4)", why: "Only the first component was multiplied. A scalar multiplies every component.", fix: "3(2, −1, 4) = (6, −3, 12)" }
  ],
  teach: {
    script: [
      "Draw an arrow from the origin to (3, 1) and call it u. Draw v = (1, 3). Ask: if I walk along u and then along v, where do I end up?",
      "Slide a copy of v to start at the tip of u. The end point is (4, 4). Point out that we added 3 + 1 across and 1 + 3 up, and the two never mixed.",
      "Now double u. Ask what happens to each component. Both double, so the arrow is twice as long and points the same way. A minus sign turns it around.",
      "For length, draw the right triangle under (3, 4). Its short sides are 3 and 4, so the arrow is √(9 + 16) = 5. Make him say “square, add, root” out loud.",
      "In 3D, hold a pencil from one floor corner of a box to the far top corner. The floor diagonal is one Pythagoras, then the height is a second one."
    ],
    board: "A grid with u = (3, 1), v = (1, 3) and a dashed copy of v starting at u’s tip, to make the parallelogram. Beside it, a right triangle with sides 3 and 4 and the long side labelled 5.",
    ask: [
      { q: "Without a calculator: how long is (6, 8)? And (6, 8, 0)?", listen: "“10 both times, because it is 3-4-5 doubled and the 0 adds nothing.” If he says 14, draw the triangle and ask which side the arrow is." },
      { q: "u + v = (5, 1) and u = (2, 4). What is v?", listen: "“(3, −3): subtract one component at a time.” If he adds instead, ask what you add to 2 to get 5." },
      { q: "Can a vector have a negative length?", listen: "“No: every term is squared, so the length is at least 0.” If he says yes, have him work out |(−3, −4)| and see it is 5." }
    ],
    confusion: "The big one is adding the components to get the length. Show the picture: the sum walks along the axes, while the arrow cuts straight across. The second is sign slips when subtracting, like −2 − (−5). Have him write the brackets every time until it is automatic."
  },
  recap: [
    "Add, subtract and scale one component at a time. The x-parts never mix with the y-parts.",
    "Length: square each component, add, then take the square root. |(a, b, c)| = √(a² + b² + c²).",
    "The length is not the sum of the components, and it is never negative."
  ]
};

/* ======================= bearings ======================= */
CP.LESSONS.bearings = {
  big: "A vector can be given as a length and a direction, or as components. Sine and cosine turn one into the other. Bearings measure the angle clockwise from north, so north gets the cosine and east gets the sine.",
  intro: [
    "Ships, planes and hikers don’t say “go (3, 4)”. They say “go 5 km on a bearing of 037°”. That is the same vector written as a length and a direction. This step is about switching between the two forms.",
    "There are two ways to name a direction. In maths, the angle θ starts at the positive x-axis and turns counterclockwise. In navigation, a bearing starts at north and turns clockwise. The trigonometry is the same, but sine and cosine swap jobs. Getting that right is most of the skill."
  ],
  see: [
    {
      h: "From components to length and angle",
      text: "Drag the tip of u. The purple dashed line is its x-part and the orange one is its y-part. The readouts give the length |u| and the angle from the positive x-axis, turning counterclockwise.",
      widget: { type: "vec2", mode: "comp", u: [2, 2] },
      tasks: [
        { ask: "Drag u to (3, 4).", check: s => at(s.u, 3, 4), got: "|u| = 5 and the angle is 53.1°. Check: 5 cos 53.1° ≈ 3 and 5 sin 53.1° ≈ 4. The length and angle hold the same information as the components." },
        { ask: "Now drag u to (−3, 4), pointing up and left.", check: s => at(s.u, -3, 4), got: "The angle is 126.9°. But a calculator gives tan⁻¹(4 ÷ (−3)) = −53.1°, which points down and right: the opposite way. Add 180°: −53.1° + 180° = 126.9°." },
        { ask: "Try (−3, −4), pointing down and left.", check: s => at(s.u, -3, -4), got: "The readout says −126.9°, which is the same direction as 233.1°. tan⁻¹(−4 ÷ (−3)) = tan⁻¹(4 ÷ 3) = 53.1° points the opposite way. Add 180° again: 233.1°." }
      ],
      after: "Going from components to length and angle: r = √(x² + y²) and tan θ = y ÷ x. But tan⁻¹ only returns angles between −90° and 90°, which all point right. When x is negative, the arrow points left, so add 180°. Going back: x = r cos θ and y = r sin θ."
    },
    {
      h: "Bearings: start at north, turn clockwise",
      text: "North is up. Each leg has a bearing and a distance slider. The orange arrow is the result: where you end up after both legs. Leg 2 starts with distance 0, so for now the result is just leg 1.",
      widget: { type: "vec2", mode: "bearing", legs: [[45, 4], [0, 0]] },
      tasks: [
        { ask: "Set leg 1 to bearing 090°.", check: s => near(s.legs[0][0], 90, 0.5), got: "090° points due east: a quarter turn clockwise from north. 180° is due south and 270° is due west. Bearings always have three digits." },
        { ask: "Set leg 1 to 060°, 4 km, with leg 2 still at 0 km. Compare east with 4 sin 60° and north with 4 cos 60°.", check: s => near(s.legs[0][0], 60, 0.5) && near(s.legs[0][1], 4, 0.05) && s.legs[1][1] < 0.05, got: "East 3.46 = 4 sin 60° and north 2 = 4 cos 60°. The angle starts at north, so the north part uses cosine and the east part uses sine." },
        { ask: "Give leg 2 a distance of 4 km. Turn leg 2 until the result points due north, 000°.", check: s => near(s.legs[0][0], 60, 0.5) && near(s.legs[0][1], 4, 0.05) && near(s.legs[1][1], 4, 0.05) && Math.abs(s.res[0]) < 0.05 && s.res[1] > 0.5, got: "Leg 2 is on 300°. Its east part, 4 sin 300° ≈ −3.46, cancels leg 1’s +3.46. The north parts add: 2 + 2 = 4 km, due north." },
        { ask: "Turn leg 2 until the trip brings you straight back to the start.", check: s => s.resD < 0.05 && s.legs[1][1] > 1, got: "240° = 060° + 180°. The distance reads 0, so the result’s bearing means nothing here. To retrace a bearing, add 180° (or subtract 180° if it is over 180°). This is the back bearing." },
        { ask: "Set leg 2 to 150°, 3 km. Read the result.", check: s => near(s.legs[0][0], 60, 0.5) && near(s.legs[0][1], 4, 0.05) && near(s.legs[1][0], 150, 0.5) && near(s.legs[1][1], 3, 0.05), got: "5 km on 097°. The legs meet at a right angle (150° − 60° = 90°), so the distance is √(4² + 3²) = 5. The result is just south of east: north reads −0.6." }
      ],
      after: "To add legs given as bearings, split each into east and north parts: east = d sin β, north = d cos β. Add the east parts and the north parts. Then the distance is √(east² + north²), and the angle from north is tan⁻¹(east ÷ north), with a sketch to check the quadrant."
    }
  ],
  why: {
    lead: "Every vector is the long side of a right triangle, and its components are the two short sides. Which side gets the cosine depends only on where you measure the angle from: cosine always goes with the side next to the angle.",
    steps: [
      ["cos θ = x ÷ r, so x = r cos θ", "θ is measured from the x-axis, so the x-part is the side next to the angle. Cosine is adjacent over hypotenuse."],
      ["sin θ = y ÷ r, so y = r sin θ", "The y-part is the side across from the angle. Sine is opposite over hypotenuse."],
      ["north = d cos β,  east = d sin β", "A bearing β is measured from north, so now the north part is next to the angle. The roles swap."],
      ["r = √(x² + y²)", "Pythagoras on the same triangle takes you back to the length."],
      ["tan θ = y ÷ x", "Divide y = r sin θ by x = r cos θ. The r’s cancel."],
      ["tan(θ + 180°) = tan θ", "Opposite arrows flip the signs of both x and y, so y ÷ x stays the same."],
      ["tan⁻¹ gives −90° < θ < 90°", "So the calculator can only return directions that point right. If x < 0, the true angle is its answer plus 180°."]
    ],
    end: "Quadrant bearings like S 23° W name the starting direction (N or S), the angle, and which way to turn (E or W). A three-figure bearing measures all the way round clockwise from north. So S 23° W is 180° + 23° = 203°, and N 40° W is 360° − 40° = 320°."
  },
  examples: [
    { q: "A boat sails 20 km on a bearing of N 30° E. Find its (east, north) components.",
      steps: [["The angle is measured from north", "So north is next to the angle and gets cosine. East is across from it and gets sine."], ["east = 20 sin 30° = 10", "sin 30° = 0.5."], ["north = 20 cos 30° ≈ 17.3", "cos 30° ≈ 0.866. Both parts are positive because the boat heads north and east."]],
      a: "(10, 17.3) km" },
    { q: "A hiker ends up 5 km west and 12 km south of camp. How far away is she, and on what bearing from camp?",
      steps: [["(east, north) = (−5, −12)", "West and south are the negative directions."], ["distance = √(25 + 144) = √169 = 13 km", "Pythagoras."], ["angle from south = tan⁻¹(5 ÷ 12) ≈ 22.6°", "She is mostly south, so measure from south. The side across from the angle is the 5 km west."], ["S 22.6° W", "Face south, then turn 22.6° toward west."], ["180° + 22.6° = 202.6°", "As a three-figure bearing: south is 180°, then keep turning clockwise."]],
      a: "13 km on a bearing of S 22.6° W (about 203°)" },
    { q: "A ship sails 30 km on a bearing of 040°, then 20 km on 160°. How far is it from where it started, and on what bearing?",
      steps: [["leg 1: east 30 sin 40° ≈ 19.28,  north 30 cos 40° ≈ 22.98", "Split the first leg. Bearings are from north, so north gets cosine."], ["leg 2: east 20 sin 160° ≈ 6.84,  north 20 cos 160° ≈ −18.79", "Split the second leg. cos 160° is negative, because 160° points south of east."], ["total: (26.12, 4.19)", "Add the east parts and the north parts separately."], ["distance = √(26.12² + 4.19²) ≈ 26.5 km", "Pythagoras."], ["angle from north = tan⁻¹(26.12 ÷ 4.19) ≈ 80.9°", "Both parts are positive, so the result is in the north-east quadrant and no 180° fix is needed."]],
      a: "about 26.5 km on a bearing of 081°" }
  ],
  mistakes: [
    { wrong: "20 km at N 30° E has an east part of 20 cos 30° ≈ 17.3 km", why: "That treats the angle as if it started at east. A bearing starts at north, so the east part is across from the angle.", fix: "east = 20 sin 30° = 10 km and north = 20 cos 30° ≈ 17.3 km" },
    { wrong: "The direction of (−3, 4) is tan⁻¹(4 ÷ (−3)) = −53.1°", why: "tan⁻¹ only returns angles that point right. (−3, 4) points left, so the calculator gave the opposite direction.", fix: "Add 180° when x < 0: −53.1° + 180° = 126.9°" },
    { wrong: "5 km east then 12 km north puts you 17 km from the start", why: "That adds the distances as if both legs pointed the same way. The legs are at right angles, so the straight distance is the long side of a triangle.", fix: "√(5² + 12²) = √169 = 13 km" },
    { wrong: "Bearing 060° is 60° up from east", why: "That is the maths angle, which starts at east and turns counterclockwise. Bearings start at north and turn clockwise.", fix: "060° is 60° clockwise from north, which is 30° above east" }
  ],
  teach: {
    script: [
      "Stand up and face north. Say a bearing is how far you turn clockwise from there. Turn to 090° (east), 180° (south), 270° (west). Three digits, always.",
      "Draw 10 km on N 30° E. Drop a line to make a right triangle with a north side and an east side. Ask: which side is next to the 30° angle? The north side, so it gets cosine.",
      "Contrast with the maths angle from the x-axis, where the x side is next to the angle. Cosine always goes with the side next to the angle. Only the starting line changes.",
      "Going back: Pythagoras for the distance, tan⁻¹ for the angle. Then always sketch it and ask which quadrant the arrow is in.",
      "For two legs: split each into east and north parts, add the columns, then turn the total back into a distance and a bearing."
    ],
    board: "A compass cross with N at the top. One arrow at N 30° E, with its right triangle drawn in: the north side labelled 10 cos 30° and the east side labelled 10 sin 30°.",
    ask: [
      { q: "What three-figure bearing is S 40° W?", listen: "“220°: south is 180°, then 40° more clockwise.” If he says 140°, have him turn from south toward west with his arm and see which way that goes." },
      { q: "Your calculator says tan⁻¹(5 ÷ (−2)) = −68.2°. Is that the direction of (−2, 5)?", listen: "“No, (−2, 5) points up and left. Add 180° to get 111.8°.” If he accepts −68.2°, have him sketch both arrows." },
      { q: "A plane flies 400 km/h north and the wind pushes 90 km/h east. Ground speed?", listen: "“√(400² + 90²) = 410 km/h.” If he says 490, ask whether the two speeds point the same way." }
    ],
    confusion: "Students learn x = r cos θ and then use cos for the east part of a bearing too. Don’t drill “bearing means sine for east”. Ask “which side is next to the angle?” every time. The other slip is trusting tan⁻¹ blindly. A ten-second sketch of the arrow catches every quadrant error."
  },
  recap: [
    "Bearings start at north and turn clockwise: 090° east, 180° south, 270° west. N 30° E means face north, turn 30° toward east.",
    "Cosine goes with the side next to the angle. For bearings: north = d cos β and east = d sin β.",
    "Back again: r = √(x² + y²) and tan⁻¹ for the angle, then check the quadrant and add 180° if needed."
  ]
};

/* ======================= dot product ======================= */
const DV = [1, 2, 2];
const du = k => [4, -1, k];
const ddot = k => V.dot(du(k), DV);
CP.LESSONS.dotp = {
  big: "Pair up matching components, multiply each pair, and add: u · v is a single number. It measures how much two arrows point the same way, and it is 0 exactly when they meet at a right angle.",
  intro: [
    "The dot product turns two vectors into one number: u · v = u₁v₁ + u₂v₂ (+ u₃v₃ in 3D). That number tells you about the angle between them.",
    "Its biggest use is a test for right angles. You can’t lay a protractor on two arrows in 3D, but you can always pair, multiply and add. If the answer is 0, the arrows are perpendicular. Later steps use this to find angles, normals to planes, and distances."
  ],
  see: [
    {
      h: "Zero means a square corner",
      text: "Drag the tips of u and v. The thick arrow lying along v is the shadow of u: where u’s tip lands if you drop a line straight down onto v. It is green when u · v is positive and orange when it is negative.",
      widget: { type: "vec2", mode: "dot", u: [5, 2], v: [1, 2] },
      tasks: [
        { ask: "Leave v at (1, 2). Drag u until u · v = 0.", check: s => at(s.v, 1, 2) && Math.abs(s.dot) < 1e-9 && s.nu > 0, got: "The angle reads 90° and the shadow vanishes. Every answer is a multiple of (2, −1): swap v’s components and change one sign. Check: 1 × 2 + 2 × (−1) = 0." },
        { ask: "Now make u · v negative.", check: s => s.dot < -1e-9, got: "The angle is over 90° and the shadow points backward, away from v. A negative dot product means the arrows lean apart." },
        { ask: "Point u exactly along v, the same way.", check: s => s.nu > 0 && s.nv > 0 && s.angle < 0.5, got: "Angle 0°. The shadow is all of u, and u · v = |u| × |v|: the biggest it can be for these two lengths." }
      ],
      after: "The sign of u · v tells you the angle. Positive: under 90°. Zero: exactly 90°. Negative: over 90°. In fact u · v = |u||v| cos θ, which is the length of v times the shadow of u. At the start, the shadow was 4.025 and |v| = √5 ≈ 2.236, and 4.025 × 2.236 ≈ 9, which was u · v."
    },
    {
      h: "Right angles in 3D",
      text: "Here v = (1, 2, 2) is fixed and u = (4, −1, k). The grey sheet holds every vector at right angles to v. The short green or orange arrow along v is the shadow of u again. Slide k and watch u · v. Drag the picture to turn it.",
      widget: { type: "vec3", range: 5, yaw: 1.2, pitch: 0.35,
        params: [{ name: "k", label: "k", min: -4, max: 4, step: 0.25, val: 2, show: v => fmt(v, 2) }],
        scene: p => {
          const u = du(p.k), d = ddot(p.k), o = [
            { t: "plane", n: DV, d: 0, c: 5, size: 3.4, op: 0.18 },
            { t: "line", p: [0, 0, 0], d: DV, c: 5, range: [-1.6, 1.6] },
            { t: "vec", to: DV, c: 2, label: "v" },
            { t: "vec", to: u, c: 1, label: "u" }
          ];
          if (Math.abs(d) > 0.05) { const sh = V.scale(DV, d / 9); o.push({ t: "vec", to: sh, c: d > 0 ? 4 : 3 }); o.push({ t: "seg", a: u, b: sh, c: 5, dash: true }); }
          return o;
        },
        readouts: [
          { label: "u", value: p => V.fmt(du(p.k)) },
          { label: "u · v", value: p => "4 − 2 + 2k = " + fmt(ddot(p.k), 2) },
          { label: "angle", value: p => fmt(deg(Math.acos(ddot(p.k) / (V.norm(du(p.k)) * 3))), 1) + "°" }
        ] },
      tasks: [
        { ask: "Slide k until u · v = 0.", check: s => near(s.k, -1, 0.01), got: "k = −1 and the angle is 90°. Pair and add: 4(1) + (−1)(2) + (−1)(2) = 4 − 2 − 2 = 0. The tip of u now lies in the grey sheet." },
        { ask: "Slide k below −1.", check: s => s.k < -1.2, got: "u · v turns negative and the angle passes 90°. u has gone through the sheet, to the side away from v." }
      ],
      after: "In 3D you can’t see a right angle by eye, but the dot product finds it. To find an unknown that makes two vectors perpendicular, set u · v = 0 and solve. Here 2 + 2k = 0 gives k = −1."
    }
  ],
  why: {
    lead: "Why should “pair, multiply, add” have anything to do with angles? The cosine law links them. Put u and v tail to tail. The third side of the triangle they make is u − v.",
    steps: [
      ["|u − v|² = |u|² + |v|² − 2|u||v| cos θ", "The cosine law, where θ is the angle between u and v."],
      ["|u − v|² = (u₁ − v₁)² + (u₂ − v₂)²", "The same length, found from components with Pythagoras."],
      ["= u₁² + u₂² + v₁² + v₂² − 2(u₁v₁ + u₂v₂)", "Expand both brackets and group the terms."],
      ["= |u|² + |v|² − 2(u · v)", "u₁² + u₂² is |u|², and v₁² + v₂² is |v|². What is left is the dot product."],
      ["u · v = |u||v| cos θ", "Match the two expressions for |u − v|². Everything else cancels."],
      ["θ = 90° → cos θ = 0 → u · v = 0", "A right angle gives zero. It works backward too: if u · v = 0 and neither vector is zero, then cos θ = 0, so θ = 90°."],
      ["|u| cos θ = the shadow of u on v", "So u · v = |v| × (shadow of u). That is the picture you played with."]
    ],
    end: "In 3D the same steps work with a third pair, u₃v₃. Because |u| and |v| are never negative, the sign of u · v is the sign of cos θ. That is why positive means under 90° and negative means over 90°."
  },
  examples: [
    { q: "u = (3, −2) and v = (4, 5). Find u · v.",
      steps: [["(3)(4) = 12", "Multiply the first pair."], ["(−2)(5) = −10", "Multiply the second pair. Say the sign out loud: negative times positive is negative."], ["u · v = 12 + (−10) = 2", "Add. The answer is a single number."]],
      a: "u · v = 2 (positive, so the angle is under 90°; it is about 85°)" },
    { q: "Are u = (2, −1, 3) and v = (4, 5, −1) perpendicular?",
      steps: [["(2)(4) = 8", "First pair."], ["(−1)(5) = −5", "Second pair."], ["(3)(−1) = −3", "Third pair."], ["u · v = 8 − 5 − 3 = 0", "Add the three products."]],
      a: "Yes. u · v = 0, so they meet at a right angle." },
    { q: "Find k so that u = (2, k, −3) and v = (k, 4, 2) are perpendicular.",
      steps: [["u · v = 0", "Perpendicular means the dot product is zero."], ["2k + 4k − 6 = 0", "Pair and multiply: (2)(k), (k)(4) and (−3)(2)."], ["6k = 6", "Collect the k terms and move the 6 across."], ["k = 1", "Divide by 6."], ["(2, 1, −3) · (1, 4, 2) = 2 + 4 − 6 = 0", "Check by putting k back in."]],
      a: "k = 1" }
  ],
  mistakes: [
    { wrong: "(3, −2) · (4, 5) = (12, −10)", why: "The pairs were multiplied but never added. The dot product is a single number, not a vector.", fix: "(3, −2) · (4, 5) = 12 + (−10) = 2" },
    { wrong: "(−2, 3) · (−4, −1) = −8 − 3 = −11", why: "(−2)(−4) was written as −8. A negative times a negative is positive.", fix: "(−2)(−4) + (3)(−1) = 8 − 3 = 5" },
    { wrong: "(1, 2) · (3, 4) = 1 + 2 + 3 + 4 = 10", why: "All four numbers were added. The dot product multiplies matching pairs first, then adds the products.", fix: "(1)(3) + (2)(4) = 3 + 8 = 11" },
    { wrong: "u · v came out negative, so I must have made a mistake", why: "A negative dot product is perfectly fine. It just means the angle between the vectors is over 90°.", fix: "Negative: over 90°. Zero: exactly 90°. Positive: under 90°." }
  ],
  teach: {
    script: [
      "Write u = (3, −2) above v = (4, 5). Pair the columns, multiply, add: 12 − 10 = 2. Stress that the answer is one number, not a vector.",
      "Ask what the number means. Draw (2, 1) and (−1, 2) on a grid: they meet at a square corner. Pair and add: −2 + 2 = 0.",
      "So a dot product of zero is a test for a right angle. No protractor needed, and it works in 3D, where you can’t measure by eye.",
      "Then the sign. Lean two arrows together and it is positive. Spread them past 90° and it is negative. The shadow of one arrow on the other shows this.",
      "To build a perpendicular in 2D: swap the two numbers and change one sign. (a, b) becomes (−b, a). Check it with the dot product."
    ],
    board: "Two arrows from one point, with the shadow of u dropped onto v. Underneath, three small sketches: an acute pair (+), a right-angle pair (0) and an obtuse pair (−).",
    ask: [
      { q: "Is (6, −4) perpendicular to (2, 3)?", listen: "“Yes: 12 − 12 = 0.” If he says no because the numbers look unrelated, show the swap-and-negate pattern: (2, 3) becomes (3, −2), then doubled." },
      { q: "u · v = −5. What can you say about the angle between them?", listen: "“It is over 90°.” If he thinks the vectors must be wrong, remind him that a negative answer just means they lean apart." },
      { q: "Is u · v a number or a vector?", listen: "“A number.” If he writes a bracket of products, ask him to finish the job by adding them." }
    ],
    confusion: "Two errors cause almost all lost marks. The first is stopping at the list of products and writing a vector. The second is a sign slip, usually a negative times a negative. Have him write every product with its brackets, like (−2)(−4) = 8, before adding. The cross product comes next and does give a vector, so keep the two clearly apart now."
  },
  recap: [
    "u · v = u₁v₁ + u₂v₂ + u₃v₃: pair, multiply, add. The answer is a single number.",
    "u · v = 0 means the vectors are perpendicular. Positive means under 90°, negative means over 90°.",
    "u · v = |u||v| cos θ: the length of v times the shadow of u on v."
  ]
};
})();
