/* Chalk and Paper – "Where this shows up", part two: the twelve steps in content-full.js. */
window.CP = window.CP || {};
Object.assign(CP.NOTES = CP.NOTES || {}, {
  limits: [
    { k: "Finance", t: "Average cost closes in on the per-item cost", x: "Fixed costs spread over more and more units shrink toward zero per unit. The limit of average cost is the variable cost, which is why scale matters so much in manufacturing." },
    { k: "Finance", t: "Continuous compounding is a limit", x: "Compounding n times a year gives (1 + r/n)ⁿ. As n grows, this closes in on eʳ. At 5%, monthly gives 5.116% a year and continuous gives 5.127%: the limit." },
    { k: "Health", t: "Drug levels level off", x: "With a steady IV drip, the level in the blood rises and closes in on a fixed value where intake balances removal. Nurses rely on that limit when setting rates." },
    { k: "Sport", t: "Terminal velocity", x: "A skydiver speeds up until air resistance matches gravity: around 55 m/s belly-down. Speed closes in on that limit and never passes it." },
    { k: "Finance", t: "A perpetuity's value", x: "A payment of $100 a year forever, at 5%, is worth the limit of an ever-longer sum: 100 ÷ 0.05 = $2,000. Some preferred shares and old British bonds are priced exactly this way." },
    { k: "Nature", t: "Sunflower spirals", x: "Count the spirals on a sunflower and you often get neighbouring Fibonacci numbers, like 34 and 55. Their ratio closes in on the golden ratio, about 1.618." },
    { k: "Finance", t: "The long-run price of an annuity", x: "The present value of a 30-year annuity is close to the limit for a payment that never ends. Each extra year adds less and less, so the value closes in on a ceiling." },
    { k: "Tech", t: "Your speedometer takes a limit", x: "Speed at an instant is the limit of distance over a shrinking time window. The car measures over a tiny window and divides." }
  ],
  fracpow: [
    { k: "Finance", t: "Risk grows like the square root of time", x: "A fund with a 15% yearly swing has a typical 4-year swing of 15√4 = 30%, not 60%. The derivative 15 ÷ (2√n) shows each extra year adds less risk." },
    { k: "Science", t: "Pendulum clocks", x: "A pendulum's period grows like √L. To double the period, you need four times the length. Grandfather clocks are tall for exactly this reason." },
    { k: "Finance", t: "Economies of scale", x: "Many costs grow like √q: warehousing, management, network costs. The derivative 1 ÷ (2√q) shrinks, so each extra unit is cheaper to handle than the last." },
    { k: "Nature", t: "Why big animals eat less per kilogram", x: "Energy use grows like mass^(3/4). Its derivative, ¾ m^(−1/4), shrinks as mass grows: an elephant needs far less food per kilogram than a mouse." },
    { k: "Finance", t: "The square-root rule for traders", x: "Trading desks scale daily risk to a 10-day horizon by √10 ≈ 3.16, not 10. Banking regulators accept this rule for setting capital." },
    { k: "Science", t: "Speed of a wave in shallow water", x: "A tsunami's speed is √(g × depth). In 4,000 m of ocean that is about 200 m/s, as fast as a jet. Near shore it slows and piles up." },
    { k: "Finance", t: "Inverse-square fees", x: "Some marketplaces charge a fee rate that falls like 1 ÷ √(volume). The derivative of a negative power tells you exactly how much each extra sale saves." },
    { k: "Sport", t: "How far you can see from a height", x: "The distance to the horizon grows like √height: about 3.6√h km for h metres. Climbing from 4 m to 16 m only doubles the view." }
  ],
  ratrad: [
    { k: "Finance", t: "Cheapest order size", x: "Average cost F/q + c·q falls then rises. Its derivative, −F/q² + c, is zero at q = √(F/c). The same square root sets economic order sizes in warehouses." },
    { k: "Health", t: "When a pill peaks", x: "A model like C(t) = At ÷ (t² + k²) rises and falls. Setting the derivative to zero gives the peak at t = k, which guides dosing times." },
    { k: "Finance", t: "Bond prices are rational functions", x: "A bond's price is a sum of payments divided by powers of (1 + y). Its derivative with respect to y, built from negative powers, is the bond's sensitivity to rates." },
    { k: "Science", t: "Lenses", x: "The thin-lens equation relates image distance to object distance through 1/f = 1/d₀ + 1/dᵢ. Differentiating it tells you how fast an image moves as you focus." },
    { k: "Finance", t: "Price per unit with bulk discounts", x: "Unit price formulas like (a + bq) ÷ (1 + cq) appear in supplier contracts. Their derivative shows where extra volume stops paying off." },
    { k: "Tech", t: "Distance on a screen", x: "Distances are √(x² + y²), a radical function. Games differentiate it to make objects move smoothly toward a target." },
    { k: "Finance", t: "Payback on an upgrade", x: "Average saving per year from an upgrade cost C saving s a year is often s − C ÷ t. Its derivative, C ÷ t², shows how fast the payback improves with time." },
    { k: "Sport", t: "Throwing distance with height", x: "The range of a throw from height h involves √(v² sin²θ + 2gh). Differentiating it shows why taller throwers get a little extra distance." }
  ],
  lnexp: [
    { k: "Finance", t: "Doubling time", x: "Solve e^(rt) = 2 with ln: t = ln 2 ÷ r ≈ 0.693 ÷ r. At 6%, money doubles in about 11.6 years. The rule of 72 is this formula rounded." },
    { k: "Science", t: "Carbon dating", x: "Carbon-14 left after t years is e^(−0.000121t). Measure what's left, take ln, and divide: that is the age of a bone or a piece of charcoal." },
    { k: "Finance", t: "Log returns add up", x: "Analysts use ln(price today ÷ price yesterday) as a return, because log returns add across days. A +10% day then a −10% day is not zero overall, but log returns show the loss clearly." },
    { k: "Health", t: "Drug half-life", x: "If a drug leaves the body as e^(−kt), its half-life is ln 2 ÷ k. Pharmacists use it to decide how often a dose is needed." },
    { k: "Finance", t: "How long debt takes to grow", x: "At 22% continuously, a balance triples in ln 3 ÷ 0.22 ≈ 5 years. ln turns 'how long until' into one division." },
    { k: "Science", t: "Cooling a cup of coffee", x: "Coffee cools as 20 + 70e^(−kt). To find when it reaches 60 °C, take ln of both sides: t = ln(70 ÷ 40) ÷ k." },
    { k: "Finance", t: "Continuous rates in bond pricing", x: "Traders quote continuously compounded rates because e and ln make adding and comparing rates simple: a 5-year rate is ln(price ratio) ÷ 5." },
    { k: "Tech", t: "Earthquakes and sound use logs", x: "Magnitudes and decibels are logarithms: each step up multiplies the energy. A log turns huge ranges into numbers people can compare." }
  ],
  graphs: [
    { k: "Finance", t: "Reading a stock chart's slope", x: "Where the price line climbs, its rate of change is positive. Where it peaks, the rate is zero. Momentum traders are really reading the graph of the derivative." },
    { k: "Driving", t: "Speed is the slope of distance", x: "On a distance-time graph, steep means fast and flat means stopped. The speedometer draws the derivative of that graph live." },
    { k: "Finance", t: "Spotting a slowdown in revenue", x: "Revenue that still rises but less steeply has a falling derivative. Investors watch for it months before revenue itself turns down." },
    { k: "Weather", t: "Daylight changes fastest at the equinox", x: "The day-length graph is a sine wave. Its slope, the derivative, peaks around March 21 and September 21, and is zero at the solstices." },
    { k: "Health", t: "Fever charts", x: "Nurses chart temperature over time. A rising curve that is flattening means the fever is about to peak, even before it does." },
    { k: "Finance", t: "Housing prices and their rate", x: "A price index graph and its year-over-year change are a function and its derivative. Headlines usually report the derivative." },
    { k: "Sport", t: "Elevation profiles on a race map", x: "A race's elevation graph shows climbs and descents. The slope at each point is the grade the runners feel." },
    { k: "Science", t: "Tides", x: "The tide graph's slope is how fast the water rises. It is fastest halfway between low and high tide, where the graph is steepest." }
  ],
  sketch: [
    { k: "Finance", t: "From growth rate to total", x: "A sales report gives weekly sales: a rate. Sketching the total from it tells you when cumulative sales peak, which sets inventory and print runs." },
    { k: "Health", t: "Epidemic curves", x: "New cases per day is the derivative of total cases. Where new cases peak, the total curve has its inflection point." },
    { k: "Finance", t: "Cash flow and the bank balance", x: "Monthly cash flow is the rate; the bank balance is the total. Where cash flow turns negative, the balance peaks." },
    { k: "Sport", t: "Velocity tells you the top of a jump", x: "A jumper's height peaks exactly when vertical velocity crosses zero. Coaches read force-plate graphs this way." },
    { k: "Finance", t: "Many curves fit the same derivative", x: "Knowing only a fund's monthly returns tells you its shape, not its starting size. That is the + C in every sketch from a derivative." },
    { k: "Science", t: "Water in a reservoir", x: "Inflow minus outflow is the rate. The reservoir is fullest where the net rate crosses from positive to negative." },
    { k: "Finance", t: "Second-derivative headlines", x: "'Inflation is rising more slowly' means prices still rise, but the rate of rise is falling: a negative second derivative." },
    { k: "Driving", t: "Smooth curves on roads", x: "Engineers sketch road profiles from slope requirements so crests and dips stay gentle enough to see over." }
  ],
  bearings: [
    { k: "Finance", t: "Shipping costs by direction", x: "Freight lanes charge by distance along a route. Turning a course and distance into east and north parts is how logistics software splits costs between regions." },
    { k: "Science", t: "Pilots correct for wind", x: "A pilot aims the nose a few degrees into the wind so that the sum of air velocity and wind velocity points down the runway." },
    { k: "Sport", t: "Orienteering", x: "Orienteers convert a bearing and distance into steps east and north on the map, then walk the bearing with a compass." },
    { k: "Finance", t: "Drone delivery pricing", x: "A drone flies the straight line, √(east² + north²), while a truck drives both legs. That gap is the business case for drone delivery." },
    { k: "Nature", t: "Bird migration", x: "Migrating birds hold a compass bearing while winds push them off course. Their actual track is the vector sum of the two." },
    { k: "Finance", t: "Real estate lot lines", x: "Property surveys describe boundaries as bearings and distances, like 'N 40° E, 32.5 m'. Converting them to coordinates gives the lot's area and value." },
    { k: "Science", t: "GPS headings", x: "A GPS reports your velocity as east and north components. Your heading is tan⁻¹ of their ratio, turned into a bearing." },
    { k: "Sport", t: "Sailing upwind", x: "A sailboat can't sail straight into the wind, so it zigzags. Each leg is a vector, and progress upwind is the sum of their north parts." }
  ],
  triple: [
    { k: "Finance", t: "Freight priced by volume", x: "Shippers bill by cubic metre. For a slanted space, the triple product gives the volume without needing right angles." },
    { k: "Science", t: "Crystal cells", x: "Salt and metals are built from repeating slanted boxes. A crystal's density comes from its cell volume, a triple product of the cell's edges." },
    { k: "Finance", t: "Three-factor exposure", x: "Three risk exposures that lie in one plane can be hedged with two instruments. The triple product being zero is the test." },
    { k: "Tech", t: "3D graphics", x: "Games check whether a point is inside a 3D shape using signs of triple products. Order matters, since swapping two vectors flips the sign." },
    { k: "Home", t: "Pouring concrete", x: "A leaning footing holds the same volume as a straight one with the same height. The triple product shows why: slant doesn't change the base times the height." },
    { k: "Finance", t: "Why order matters", x: "u × v and v × u point opposite ways, so swapping inputs flips results in any formula built on cross products. Spreadsheet models built on them break silently if columns are swapped." },
    { k: "Science", t: "Torque on a spinning top", x: "Physics formulas chain cross products. Because the cross product isn't associative, the brackets decide which force does what." },
    { k: "Home", t: "Testing a claim with simple cases", x: "Engineers test a formula with the simplest inputs first. One failure with i, j and k is enough to throw a vector rule out." }
  ],
  lines2d: [
    { k: "Finance", t: "Break-even between two plans", x: "Two phone or hydro plans are two lines of cost against use. They cross at the break-even: below it one plan wins, above it the other." },
    { k: "Finance", t: "Supply and demand", x: "Supply rises with price and demand falls. Where the two lines cross is the market price and quantity." },
    { k: "Sport", t: "Intercepting a pass", x: "A defender runs a straight line to cut off a puck moving in a straight line. Where their paths cross is the interception point." },
    { k: "Finance", t: "Buy or rent", x: "Buying costs a lump sum plus a lower monthly cost; renting has no lump sum and a higher monthly cost. The lines cross at the month buying pays off." },
    { k: "Tech", t: "Screen geometry", x: "Graphics code stores lines as normals and constants, Ax + By + C = 0, because testing which side of a line a point is on is a single dot product." },
    { k: "Science", t: "Two ships' courses", x: "Navigators plot each ship's course as a line and solve for the crossing point to check for a collision risk." },
    { k: "Finance", t: "Salary or commission", x: "A flat salary is a horizontal line; base plus commission is a sloped one. Their crossing tells a salesperson which offer pays more at their likely sales." },
    { k: "Home", t: "Laying out a garden", x: "Two straight paths from different gates meet where their equations agree. Solving the pair tells you where to put the bench." }
  ],
  planeforms: [
    { k: "Finance", t: "Every basket on a budget", x: "All the ways to spend exactly $120 on three items form a plane. Its vector form lists trades that keep the bill the same, like swapping one $6 item for three $2 items." },
    { k: "Sport", t: "Ski slopes as planes", x: "A slope through the lift top can be written by two directions in it: down the fall line and across. Its scalar form gives the height at any spot." },
    { k: "Finance", t: "Portfolios at a target income", x: "Every split earning exactly $300 a year lies on a plane. Moving along its directions changes the mix without changing the income." },
    { k: "Tech", t: "3D modelling", x: "Modelling software stores flat faces as a point and two edge directions, and converts to a normal when it needs lighting. Both forms of the same plane." },
    { k: "Home", t: "Roof framing", x: "A roof plane is pinned by a corner and two rafter directions. Builders convert to the scalar form to find the height above any point of the floor." },
    { k: "Science", t: "A line where two planes meet", x: "The fold of a sheet of paper is the line where two planes meet. Its direction is the cross product of their normals." },
    { k: "Finance", t: "Two constraints give a line", x: "A fixed total and a fixed income target are two planes. Together they leave a line of portfolios that satisfy both." },
    { k: "Science", t: "Geology", x: "A rock layer is described by a point and two directions along it. Its normal, from their cross product, gives the dip geologists measure." }
  ],
  planesys: [
    { k: "Finance", t: "Three goals, one portfolio", x: "A total to invest, an income target and a ratio between funds are three planes. If they meet at one point, exactly one portfolio does it all." },
    { k: "Health", t: "Planning meals by nutrients", x: "Protein, carb and fat targets for three foods are three equations. Solving them gives the servings of each, as a dietitian would." },
    { k: "Finance", t: "Pricing from three receipts", x: "Three receipts with different mixes of the same three items give three equations. Solving them recovers each item's price." },
    { k: "Science", t: "GPS uses intersecting surfaces", x: "Each satellite signal places you on a surface. Where the surfaces meet is your position, found by solving a system much like three planes." },
    { k: "Finance", t: "When goals conflict", x: "If elimination ends in 0 = 50, no portfolio meets all three goals. The algebra is telling you to relax one of them." },
    { k: "Home", t: "Mixing paint or concrete", x: "Matching a colour or strength from three ingredients is a three-equation system. Contractors solve it every time they batch a mix." },
    { k: "Finance", t: "Infinitely many answers", x: "If elimination gives 0 = 0, a whole line of portfolios works. That freedom is useful: choose the one with the lowest fees." },
    { k: "Science", t: "Balancing chemical equations", x: "Balancing a reaction means solving a system for the number of each molecule. Three unknowns, three equations." }
  ],
  skew: [
    { k: "Science", t: "Air traffic separation", x: "Two flight paths at different altitudes are skew lines. The closest approach is measured along the cross product of their directions." },
    { k: "Finance", t: "Do two funds ever hold the same mix?", x: "Two glide paths through (stocks, bonds, cash) are lines. If they are skew, there is no age at which the two funds hold the same mix." },
    { k: "Tech", t: "Robot arms", x: "Robot planners check the closest distance between arm segments, modelled as lines, so the arms never collide." },
    { k: "Home", t: "Pipes in a ceiling", x: "Two pipes running in different directions at different heights are skew. Plumbers need the gap between them for clearance." },
    { k: "Finance", t: "Planning separate delivery routes", x: "Drone delivery companies keep routes skew with a safe gap, so drones never need to dodge each other." },
    { k: "Science", t: "Power lines and highways", x: "An overpass and the road beneath are skew lines. Engineers design the vertical clearance from the distance between them." },
    { k: "Sport", t: "Ski lifts crossing", x: "Two chairlift cables that cross on a map pass at different heights. The cable gap is a skew-line distance." },
    { k: "Finance", t: "Infrastructure costs", x: "Whether a new road can pass over another without a costly interchange depends on the gap between them, a skew-line calculation in the planning stage." }
  ]
});
