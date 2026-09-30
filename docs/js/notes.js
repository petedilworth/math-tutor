/* Chalk and Paper – "Where this shows up"
   For every step, a pool of real places the idea appears: about half money and investing, half the rest of life.
   One is shown after every question, rotating so the same one rarely comes twice in a row.
   k is the label shown: Finance, Science, Driving, Sport, Health, Home, Tech, Nature, Weather. */

window.CP = window.CP || {};
CP.NOTES = {
  exp: [
    { k: "Finance", t: "Compound interest is an exponent law", x: "Money growing at 5% for 3 years, then 2 more, is 1.05³ × 1.05² = 1.05⁵. The exponents add because the years add. Every bank statement is x² · x³ = x⁵." },
    { k: "Tech", t: "Phone storage is powers of 2", x: "A 128 GB phone holds 2³⁷ bytes and a 4 MB photo is 2²² bytes. 2³⁷ ÷ 2²² = 2¹⁵ = 32,768 photos. Dividing powers subtracts the exponents." },
    { k: "Finance", t: "The rule of 72", x: "At 8% a year, money doubles about every 9 years. In 36 years that is 4 doublings: 2⁴ = 16 times the money, not 2 × 4 = 8. Doublings stack as a power." },
    { k: "Science", t: "Scientific notation", x: "The Sun is 1.5 × 10¹¹ m away and light moves at 3 × 10⁸ m/s. 10¹¹ ÷ 10⁸ = 10³, so sunlight takes about 500 seconds, just over 8 minutes, to reach you." },
    { k: "Finance", t: "Inflation compounds too", x: "2% inflation for 35 years is 1.02³⁵ ≈ 2.0. Prices double over a working life, which is why a pension that is not indexed quietly shrinks." },
    { k: "Science", t: "Decibels hide an exponent", x: "Every 10 dB is 10 times the sound energy. A 90 dB lawnmower against 60 dB conversation is 10³ = 1,000 times the energy, which is why hearing damage creeps up fast." },
    { k: "Finance", t: "Fees are an exponent working against you", x: "A 2% yearly fee for 30 years leaves 0.98³⁰ ≈ 0.55 of what you would have had. The fee quietly takes almost half of the final amount." },
    { k: "Health", t: "Why R matters in an outbreak", x: "If each case infects 2 more, ten rounds of spread is 2¹⁰ = 1,024 times as many. Bring it to 1 per case and 1¹⁰ = 1: the growth stops." }
  ],
  frac: [
    { k: "Finance", t: "Present value is a negative exponent", x: "$1,000 promised in 5 years, at 4%, is worth 1000 × 1.04⁻⁵ ≈ $822 today. Lottery lump sums and lawsuit settlements are priced this way." },
    { k: "Nature", t: "Kleiber's law", x: "An animal's energy use grows as mass^(3/4). An animal 16 times heavier burns 16^(3/4) = 8 times the energy, so it needs half as much food per kilogram. Elephants eat less per kilo than mice." },
    { k: "Finance", t: "Average yearly return is a root", x: "A fund that grew 61% in 5 years (a factor of 1.61) averaged 1.61^(1/5) ≈ 1.10: 10% a year, not 61 ÷ 5 = 12.2%. Dividing overstates it." },
    { k: "Science", t: "Piano keys are twelfth roots of 2", x: "Each semitone multiplies the pitch by 2^(1/12) ≈ 1.0595. Twelve of them give 2^(12/12) = 2: one octave, double the frequency." },
    { k: "Finance", t: "Canadian mortgages compound twice a year", x: "A 5% fixed mortgage is quoted compounded semi-annually, so the monthly factor is 1.025^(1/6) ≈ 1.004124. That fractional exponent sits inside every Canadian mortgage calculator." },
    { k: "Science", t: "Inverse-square laws", x: "Light from a bulb falls off as distance⁻². Twice as far is 2⁻² = one quarter as bright. The same rule roughly governs gravity and radiation." },
    { k: "Finance", t: "Monthly rates from yearly ones", x: "6% a year is 1.06^(1/12) ≈ 1.00487 a month: 0.487%, not 0.5%. Divide instead and you overstate the yearly return." },
    { k: "Science", t: "Radioactive half-life", x: "Carbon-14 halves every 5,730 years, so the fraction left after t years is 2^(−t/5730). After 11,460 years it is 2⁻² = one quarter. That is how carbon dating works." }
  ],
  slope: [
    { k: "Finance", t: "Your savings rate is a slope", x: "A balance of $4,000 in January and $7,000 in July is (7000 − 4000) ÷ 6 = $500 a month. Slope is the question 'how fast', asked of money." },
    { k: "Driving", t: "Road grade signs", x: "A 6% grade sign means 6 m of climb for every 100 m across: a slope of 0.06. Truckers read it as how hard the brakes will work on the way down." },
    { k: "Finance", t: "Exchange rates move at a rate", x: "If USD/CAD goes from 1.35 to 1.38 in 30 days, that is 0.001 a day. On a $5,000 US purchase, every day of waiting cost about $5." },
    { k: "Sport", t: "Running pace is a slope, flipped", x: "10 km in 50 minutes is 0.2 km per minute. Runners flip it: 5 minutes per km. Same line, rise and run swapped." },
    { k: "Finance", t: "Hourly pay is a slope", x: "Plot pay against hours worked and you get a line whose slope is your wage. Ontario overtime at 1.5 times after 44 hours makes the line bend steeper." },
    { k: "Weather", t: "Warming through the morning", x: "8 °C at 7 a.m. and 20 °C at 1 p.m. is 12 degrees over 6 hours: 2 °C an hour. Forecasters talk in exactly these slopes." },
    { k: "Finance", t: "Paying down a mortgage", x: "A balance that falls from $400,000 to $388,000 in a year has a slope of −$1,000 a month. The minus sign is good news here." },
    { k: "Home", t: "Roof pitch", x: "A 6/12 roof climbs 6 inches for every 12 across: slope 0.5. Roofers, ramp builders and plumbers (drains need a small, steady slope) all work in rise over run." }
  ],
  firstp: [
    { k: "Finance", t: "Marginal cost is a limit", x: "Accountants ask what one more unit costs. Shrink 'one more' to 'a tiny bit more' and the difference quotient becomes the derivative: marginal cost." },
    { k: "Driving", t: "Your speedometer takes a limit", x: "Speed at an instant does not exist until you shrink the time window. The car measures distance over a split second and divides. That is the difference quotient with a tiny h." },
    { k: "Finance", t: "Compounding more and more often", x: "At 5%, compounding yearly, monthly, daily, every second: (1 + 0.05/n)ⁿ closes in on e^0.05 ≈ 1.05127. Continuous compounding is a limit." },
    { k: "Science", t: "Speed at exactly 2 seconds", x: "A dropped phone averages 20.09 m/s from 2 to 2.1 s, and 19.6049 m/s from 2 to 2.001 s. The limit, 19.6 m/s, is its speed at the instant 2 s." },
    { k: "Finance", t: "A bond trader's DV01", x: "DV01 is the price change for a 0.01% move in yield: a difference quotient with a small h. Traders use it as the derivative, and it is close enough to run billion-dollar books on." },
    { k: "Sport", t: "Shot speed from video", x: "Broadcast shot speeds can come from frames: how far the puck moved between frames, divided by 1/60 of a second. Shorter windows give sharper answers." },
    { k: "Finance", t: "Slope of a stock chart at one moment", x: "'The stock is rising fast right now' means the average change over a shrinking window. Every momentum signal is an estimate of that limit." },
    { k: "Driving", t: "Instant fuel economy", x: "The L/100 km figure that jumps around on the dashboard is fuel used ÷ distance over the last moment: a difference quotient, refreshed constantly." }
  ],
  pow1: [
    { k: "Home", t: "Pizza is a square law", x: "Area grows with the square of the diameter: a 16-inch pizza has (16/12)² ≈ 1.78 times the pizza of a 12-inch, usually for much less than 1.78 times the price." },
    { k: "Finance", t: "Land priced per square metre", x: "A square lot of side s costs c·s². Its derivative, 2cs, says each extra metre of side costs more the bigger the lot already is: at 30 m, one more metre adds about 60 m²." },
    { k: "Driving", t: "Braking distance grows with v²", x: "Double your speed and braking distance quadruples. The derivative, 2v, says each extra km/h costs more metres the faster you are already going." },
    { k: "Finance", t: "Volatility drag", x: "A portfolio's long-run growth loses about σ²/2 to volatility. The derivative in σ is σ itself: the more volatile it already is, the more each extra bit of volatility costs." },
    { k: "Science", t: "Wind power grows as v³", x: "A turbine in 12 m/s wind makes (12/6)³ = 8 times the power of 6 m/s. The derivative, 3v², explains why windy sites are worth so much more." },
    { k: "Finance", t: "Why costs can run away", x: "If costs grow like q² (overtime, crowding, delivery distance), the next unit costs 2q times the coefficient. Each extra unit costs more than the last, which is one reason firms do not grow forever." },
    { k: "Science", t: "Energy and momentum", x: "Kinetic energy is ½mv². Differentiate in v and you get mv: momentum. Physics is full of pairs linked by the power rule." },
    { k: "Finance", t: "Sensitivity grows with time", x: "A 30-year investment's sensitivity to its return rate is about 30 times bigger than a 1-year one. The power comes down in front, and the n becomes a multiplier." }
  ],
  polyd: [
    { k: "Finance", t: "Marginal cost from a cost curve", x: "Cost C(q) = 0.01q³ − 0.6q² + 15q + 200. The fixed $200 vanishes when you differentiate, because rent does not change when you make one more unit." },
    { k: "Sport", t: "A basketball's vertical speed", x: "Height h = −4.9t² + 8t + 2. Its derivative, −9.8t + 8, is the vertical speed: 8 m/s up at release, zero at the top, falling after." },
    { k: "Finance", t: "Sell while marginal revenue beats marginal cost", x: "Profit = revenue − cost, so profit′ = revenue′ − cost′. Keep selling more while the next sale brings in more than it costs. The derivatives decide." },
    { k: "Science", t: "How a loaded beam sags", x: "A beam under a uniform load sags along a degree-4 polynomial. Its derivative is the beam's tilt, which engineers check against limits." },
    { k: "Finance", t: "Lowest average cost", x: "Average cost C(q)/q falls then rises. Its minimum is exactly where marginal cost equals average cost: a classic result you get by differentiating." },
    { k: "Tech", t: "Fonts and car bodies are cubics", x: "Letters on this screen and the curves of car designs are cubic Bézier curves. Differentiating them gives the direction the pen is moving at each point." },
    { k: "Finance", t: "Yield curves", x: "Analysts fit bond yields against maturity with polynomial-like curves. The derivative shows where the curve is steepening, which traders bet on." },
    { k: "Science", t: "Roller coasters", x: "Track designers use polynomial pieces so the slope, and the rider's stomach, change smoothly rather than with a sudden jolt." }
  ],
  tan: [
    { k: "Finance", t: "Bond duration is a tangent line", x: "A bond's price change ≈ −duration × rate change. That is the tangent-line estimate. A bond with duration 7 loses about 7% if rates rise 1%." },
    { k: "Driving", t: "Headlights point along the tangent", x: "On a curve your headlights shine straight ahead, along the tangent, and light the ditch instead of the road. That is why bends at night feel so dark." },
    { k: "Finance", t: "An option's delta", x: "Delta is the slope of the tangent to an option's price curve. A delta of 0.5 means a $1 move in the stock moves the option about $0.50." },
    { k: "Sport", t: "Let go and it flies off along the tangent", x: "A hammer thrower's ball, or a stone from a sling, leaves along the tangent to the circle at the moment of release. Timing the release is aiming the tangent." },
    { k: "Finance", t: "Beta", x: "A stock's beta is the slope of its returns against the market's. A beta of 1.3 means a 1% market move comes with about a 1.3% move in the stock." },
    { k: "Home", t: "Square roots in your head", x: "√50 ≈ 7 + 1/(2 × 7) ≈ 7.071, using the tangent to √x at 49. The true value is 7.0711. Tangent lines are the best quick estimates." },
    { k: "Finance", t: "Near a point, curves are lines", x: "Revenue is $80,000 and rising $2,000 per $1 of price? A $0.50 rise adds about $1,000. Good for small moves; bad for big ones, where the curve bends away." },
    { k: "Tech", t: "How GPS solves for position", x: "Your phone's position comes from curved distance equations. It solves them by repeatedly replacing each curve with its tangent line, which is Newton's method." }
  ],
  prod: [
    { k: "Finance", t: "Revenue = price × quantity", x: "Raise the price 10¢ a month while losing 20 customers a month: R′ = (0.10)(customers) + (price)(−20). Both halves matter, and they can cancel." },
    { k: "Health", t: "Cardiac output = heart rate × stroke volume", x: "During exercise both rise. The product rule says total blood flow grows from each: faster beats, and more blood per beat." },
    { k: "Finance", t: "A US stock held in Canada", x: "Its CAD value is (US price) × (USD/CAD). Its growth rate is the stock's growth plus the currency's: the product rule in percent form." },
    { k: "Science", t: "Power = voltage × current", x: "If a battery's voltage sags while current rises, power changes by V′I + VI′. Engineers balance the two halves." },
    { k: "Finance", t: "Payroll = wage × hours", x: "Wages up 3% and hours down 2%? Payroll changes about 3% − 2% = 1%. Relative rates add, because of the product rule." },
    { k: "Science", t: "A rocket's momentum", x: "Momentum = mass × velocity. A rocket gains speed while burning off mass, so its momentum changes in two ways at once." },
    { k: "Finance", t: "Portfolio value = shares × price", x: "Buying more shares and the price rising add separately: (new shares)(price) + (shares)(price rise). Your statement's 'contributions' and 'gains' are the two halves." },
    { k: "Nature", t: "Timber in a forest", x: "Wood volume = number of trees × volume per tree. Logging lowers one while growth raises the other; foresters track both halves." }
  ],
  chain: [
    { k: "Finance", t: "Bond duration comes from the chain rule", x: "A payment's value is C(1 + y)⁻ⁿ. Differentiate: −nC(1 + y)^(−n−1). The n in front is why long bonds swing far more when rates move." },
    { k: "Driving", t: "Litres per hour", x: "Fuel per hour = (litres per km) × (km per hour). Rates stacked inside each other multiply: the chain rule in the dashboard." },
    { k: "Finance", t: "Real returns", x: "Money after inflation is ((1 + r)/(1 + i))ⁿ: one function inside another. How it responds to inflation needs the chain rule." },
    { k: "Tech", t: "Bike gears", x: "Pedal turns drive chainring turns, which drive wheel turns, which drive distance. Each link multiplies the rate. That is the chain rule in metal." },
    { k: "Finance", t: "Mortgage payments and rates", x: "Your payment depends on the rate, and your qualifying amount depends on the payment. A rate rise works through both links, which is why stress tests move buying power so much." },
    { k: "Science", t: "Blowing up a balloon", x: "Pump air at a steady rate and the radius grows more and more slowly: dr/dt = (dV/dt) ÷ (4πr²). The chain rule turns one rate into another." },
    { k: "Finance", t: "Currency-converted returns", x: "Your CAD return depends on the US return and on the exchange rate, each driven by something else. Sensitivities along the chain multiply." },
    { k: "Science", t: "A melting ice cube", x: "Volume depends on side length, and side length depends on time. dV/dt = 3s² × ds/dt: a big cube loses volume much faster for the same shrink in side." }
  ],
  combo: [
    { k: "Finance", t: "Shares × a compounding price", x: "Buy shares steadily while the price compounds: value = (shares) × p₀(1 + g)^t. Growth needs the product rule outside and the chain rule inside." },
    { k: "Home", t: "The open-box problem", x: "Cut squares from a sheet and fold: V = x(L − 2x)². Product rule for x times the rest, chain rule for the squared bracket." },
    { k: "Finance", t: "Present value of a growing payment", x: "A payment growing at g, discounted at r: P(1 + g)^t × (1 + r)^(−t). Its sensitivity to time or rate takes both rules at once." },
    { k: "Science", t: "Walking away from a speaker", x: "Loudness ∝ power × distance⁻². If the power also changes while you walk, you need the product rule and the chain rule together." },
    { k: "Finance", t: "Revenue with compounding demand", x: "R = price × q₀(1 + g)^t. A price change and compounding demand interact, and the derivative separates the two effects." },
    { k: "Health", t: "Dose × body weight", x: "Dosing that scales with weight, on a patient whose weight is changing: both factors move, and one of them has an inside." },
    { k: "Finance", t: "Why real models need both rules", x: "Textbook rules come one at a time, but real formulas stack them. Almost every pricing model is a product with a chain inside." },
    { k: "Science", t: "Heat loss from a pipe", x: "Natural convection heat loss ≈ length × (temperature difference)^(5/4). A pipe that is lengthening and cooling needs both rules." }
  ],
  trigexp: [
    { k: "Weather", t: "Toronto's daylight", x: "Day length is about 12.2 + 3.1 sin(...) hours. Near the March equinox it grows about 3 minutes a day; near June 21 barely at all. The derivative of sine is cosine." },
    { k: "Finance", t: "Continuous compounding is eˣ", x: "$1,000 at 4% continuously is 1000e^(0.04t). It grows at 40e^(0.04t) a year: always exactly 4% of itself. Only e does this with no extra factor." },
    { k: "Tech", t: "The power in your wall", x: "Outlet voltage is about 170 sin(120πt): 60 cycles a second, with a peak of 170 V for '120 V' power. The derivative shows it changes fastest as it crosses zero." },
    { k: "Finance", t: "Seasonal sales", x: "Retail and heating-fuel demand follow sine-like yearly cycles. The derivative says demand rises fastest about three months before the peak, which is when to stock up." },
    { k: "Nature", t: "Bay of Fundy tides", x: "Water rises and falls up to about 16 m on a 12.4-hour cycle. It rises fastest halfway between low and high tide, where cosine, the derivative, peaks." },
    { k: "Finance", t: "The rule of 70", x: "Doubling time ≈ 70 ÷ rate%. It comes from e: e^(rt) = 2 when rt = ln 2 ≈ 0.693." },
    { k: "Health", t: "Caffeine fades exponentially", x: "Caffeine leaves the body at a rate proportional to what is left, a half-life of roughly 5 hours. A 3 p.m. coffee is about a quarter strength at 1 a.m." },
    { k: "Sport", t: "A swimmer's stroke", x: "Arm position in a steady stroke is close to a sine wave. Hand speed is its derivative: fastest mid-pull, zero at each end of the stroke." }
  ],
  exprate: [
    { k: "Finance", t: "Growth in proportion to size", x: "A TFSA growing 6% has P′ = 0.06P: $3,000 a year at $50,000, $6,000 a year at $100,000. The rate keeps up with the balance." },
    { k: "Science", t: "Coffee cools the same way", x: "Newton's law: the cooling rate is proportional to the gap between the coffee and the room. Fast at first, then slower and slower." },
    { k: "Finance", t: "Inflation erodes cash", x: "At 2.5% inflation, $10,000 in cash loses about $250 of buying power in the first year, and a little less each year after." },
    { k: "Health", t: "Medications leave in proportion", x: "Most drugs are cleared at a rate proportional to the amount in the body. That is why doses are spaced at regular intervals." },
    { k: "Finance", t: "Credit card debt", x: "At about 20% a year, a $5,000 balance grows by about $1,000 a year, and faster as it grows. Exponential growth works against the borrower." },
    { k: "Science", t: "Carbon dating", x: "Carbon-14 decays at about 0.012% a year of what remains. Measure what is left and the exponential gives the age." },
    { k: "Finance", t: "Why starting early matters", x: "Because the growth rate is proportional to the balance, early dollars have the longest time to feed their own growth. The last decade of saving adds the most dollars." },
    { k: "Tech", t: "Viral videos", x: "Early views grow in proportion to the viewers sharing them: exponential, until the audience runs out and the curve bends over." }
  ],
  motion: [
    { k: "Driving", t: "Stopping from 100 km/h", x: "At 27.8 m/s, braking at 7 m/s² takes about 55 m, plus about 42 m travelled in a 1.5-second reaction. Position, velocity and acceleration, all in one stop." },
    { k: "Finance", t: "Inflation's acceleration", x: "Price level is position, inflation is velocity. When inflation is 'rising', prices are accelerating: that is the second derivative of the price level." },
    { k: "Sport", t: "A slapshot from the blue line", x: "At about 160 km/h (44 m/s), a puck covers the roughly 20 m from the blue line to the net in under half a second." },
    { k: "Finance", t: "Debt and deficits", x: "Debt is position; the deficit is its rate of change. A 'shrinking deficit' still means the debt is growing, just more slowly." },
    { k: "Science", t: "Elevators are tuned for jerk", x: "Engineers limit acceleration, and even its rate of change, called jerk, so rides feel smooth. That is the third derivative of position." },
    { k: "Finance", t: "Momentum investing", x: "Price, its rate of change, and whether that rate is rising: position, velocity, acceleration. Momentum strategies trade on the middle one." },
    { k: "Science", t: "Rockets accelerate harder as they go", x: "Same thrust, less mass as fuel burns: acceleration climbs through the flight." },
    { k: "Finance", t: "Savings on a schedule", x: "Balance is position, monthly contributions are velocity, and raises that increase your contribution are acceleration." }
  ],
  maxmin: [
    { k: "Finance", t: "The best price", x: "Profit (p − c)(a − bp) peaks exactly halfway between your cost and the price at which no one buys. Setting the derivative to zero finds it." },
    { k: "Sport", t: "The top of a throw", x: "A ball's peak height is where its vertical speed, the derivative of height, is zero. That is where a receiver judges the catch." },
    { k: "Finance", t: "How much stock to order", x: "Ordering often costs fees; ordering a lot costs storage. The economic order quantity sets the derivative of total cost to zero: q = √(2 × demand × order cost ÷ holding cost)." },
    { k: "Nature", t: "Honeycomb", x: "Hexagons hold the most honey for the least wax of any shape that tiles. Bees solved an optimization problem that took mathematicians until 1999 to prove." },
    { k: "Finance", t: "Tax revenue has a peak", x: "At a 0% rate the government collects nothing, and at 100% almost nothing. Somewhere between, revenue peaks: where its derivative is zero. Where exactly is hotly argued." },
    { k: "Driving", t: "Best fuel economy", x: "Many cars use the least fuel per km somewhere around 60 to 90 km/h. Slower wastes engine time; faster fights air drag. The minimum is a derivative set to zero." },
    { k: "Finance", t: "When to sell", x: "If a model of an asset's value has a peak, it is where the rate of change is zero, and a negative second derivative confirms it is a top, not a bottom." },
    { k: "Home", t: "A rain gutter", x: "Bend a flat strip into a gutter. One fold angle carries the most water, and it comes from setting the derivative of the cross-section area to zero." }
  ],
  concav: [
    { k: "Finance", t: "Diminishing returns", x: "Each extra $1,000 of advertising brings fewer new sales than the last. The curve is concave down, and the second derivative is negative." },
    { k: "Health", t: "When an outbreak turns", x: "The inflection point of a case curve is when daily new cases peak. Cases still rise afterwards, but more slowly: the first real sign of control." },
    { k: "Finance", t: "Bond convexity", x: "A bond's price against yield is concave up, so a 1% rate drop gains more than a 1% rise loses. Traders pay extra for that curve." },
    { k: "Tech", t: "Adoption S-curves", x: "Smartphones, streaming and EVs spread slowly, then fastest at the inflection point, then saturate. Investors try to buy before the inflection." },
    { k: "Finance", t: "Compound interest bends upward", x: "A growing balance is concave up: the curve steepens every year. That upward bend is why starting early beats saving more later." },
    { k: "Sport", t: "A sprinter's first seconds", x: "Distance against time is concave up while the sprinter accelerates, then straight once they hit top speed. Coaches study where the bend ends." },
    { k: "Finance", t: "Why people buy insurance", x: "Money's usefulness to a person is concave down: losing $100,000 hurts more than gaining it helps. That curve is why paying a premium can be rational." },
    { k: "Driving", t: "Smooth highway curves", x: "Highway on-ramps use curves whose bend changes gradually (clothoids), so steering changes smoothly instead of all at once." }
  ],
  optim: [
    { k: "Finance", t: "Pricing tickets or a streaming plan", x: "Higher prices earn more per sale but lose customers. Revenue peaks where R′(p) = 0: for straight-line demand, halfway to the price where no one buys." },
    { k: "Home", t: "Fencing a yard", x: "With a fixed length of fence a square encloses the most area. Against a wall, the side facing the wall should be twice each of the other two." },
    { k: "Finance", t: "The least risky mix", x: "Mixing two funds, the combination with the lowest risk comes from setting the derivative of portfolio variance to zero. Every robo-adviser does this." },
    { k: "Home", t: "Soup cans", x: "The can that uses the least metal for its volume has a height equal to its diameter. Many real cans are taller, for labels and handling." },
    { k: "Finance", t: "Airline overbooking", x: "Airlines sell more seats than they have, choosing the number that maximizes expected revenue after compensating bumped passengers." },
    { k: "Science", t: "Light takes the fastest path", x: "Light bends entering water because it chooses the path of least time. Snell's law is the answer to an optimization problem." },
    { k: "Finance", t: "Batch size", x: "Order too often and fees add up; too much at once and storage does. Total cost is smallest where its derivative is zero." },
    { k: "Sport", t: "The best launch angle", x: "On flat ground with no air, 45° throws farthest. With air resistance the best angle is lower, which is why shot-putters and golfers launch below 45°." }
  ],
  vbasic: [
    { k: "Finance", t: "A portfolio is a vector", x: "(stocks, bonds, cash) = ($40,000, $30,000, $10,000). A trade is another vector, and your new holdings are the sum." },
    { k: "Science", t: "Flying in a crosswind", x: "A plane's velocity over the ground is its airspeed vector plus the wind vector. Pilots point the nose off course so the sum points where they want to go." },
    { k: "Finance", t: "Rebalancing adds to zero", x: "A rebalance with no new money is a vector whose components sum to zero, like (−$5,000, +$3,000, +$2,000). Money moves; the total stays." },
    { k: "Sport", t: "Leading a pass", x: "A good pass aims at where a teammate will be: position + velocity × time. Soccer and hockey players do this vector sum by instinct." },
    { k: "Finance", t: "Spending changes month to month", x: "This month's (rent, food, transport) minus last month's is a vector of changes. Its length is one number summing up how much your spending moved." },
    { k: "Nature", t: "Swimming across a river", x: "Your velocity plus the current's gives where you actually go. Aim straight across and you land downstream." },
    { k: "Finance", t: "Converting currencies", x: "Holdings in USD, EUR and CAD form a vector; converting to CAD multiplies each component by its rate. Scalar and componentwise operations, every day in a bank." },
    { k: "Tech", t: "Video game movement", x: "Games move each character by adding a velocity vector to its position about 60 times a second." }
  ],
  dotp: [
    { k: "Finance", t: "Portfolio return = weights · returns", x: "50/30/20 in funds returning 8%, 3% and −2%: 0.5(8) + 0.3(3) + 0.2(−2) = 4.5%. Every fund's return is a dot product." },
    { k: "Science", t: "Work = force · displacement", x: "Pulling a sled with a rope at an angle, only the part of your pull along the ground counts. The dot product keeps that part and drops the rest." },
    { k: "Finance", t: "Your grocery bill", x: "Quantities (3, 2, 5) and prices ($4, $6.50, $2) give 12 + 13 + 10 = $35. A receipt is a dot product." },
    { k: "Tech", t: "Recommendations", x: "Streaming services describe you and each show as vectors of tastes. A big dot product means a good match." },
    { k: "Finance", t: "Stock indexes", x: "A market-cap index like the TSX Composite is basically shares · prices, scaled to a starting value." },
    { k: "Nature", t: "Solar panels", x: "A panel's power depends on the dot product of the sunlight direction and the way the panel faces: most when they line up, none when the sun is edge-on." },
    { k: "Finance", t: "Net worth", x: "Holdings (shares of each stock) · prices = total value. Update the price vector each day and one dot product gives your net worth." },
    { k: "Sport", t: "Weighted scores", x: "A final mark with weights 30% tests, 50% exam, 20% homework is weights · marks. So are decathlon points tables." }
  ],
  angle: [
    { k: "Finance", t: "Correlation is a cosine", x: "Write two stocks' returns (from their averages) as vectors. The cosine of the angle between them is their correlation: 1 moves together, 0 unrelated, −1 opposite." },
    { k: "Nature", t: "Tilting solar panels", x: "In Toronto, panels are often tilted near 44°, the latitude, so the midday sun arrives close to straight on over a year." },
    { k: "Finance", t: "Why diversify", x: "Two assets at a right angle (correlation 0) partly offset: combined risk is less than the sum. Parallel vectors give no such help." },
    { k: "Sport", t: "Skiing down a slope", x: "The part of gravity pulling you down a slope is a projection: g sin θ along the hill. Steeper hill, bigger projection." },
    { k: "Finance", t: "Beta is a projection", x: "A stock's beta is the length of the projection of its returns onto the market's, measured in market units." },
    { k: "Tech", t: "Search engines", x: "Documents become vectors of word counts, and ranking by the cosine of the angle between query and page is a classic search method." },
    { k: "Finance", t: "Tracking error", x: "How far a fund's returns point away from its index's is an angle. Index funds aim for an angle near zero." },
    { k: "Home", t: "Shadows are projections", x: "A fence's shadow at noon is its projection onto the ground. Longer in winter, when the sun is low." }
  ],
  crossp: [
    { k: "Home", t: "Torque and a stuck bolt", x: "Torque = r × F. A longer wrench, or pushing at right angles to it, gives more turning force. Pushing along the handle does nothing." },
    { k: "Finance", t: "Land from corner coordinates", x: "A lot's area comes from its corner coordinates by the cross product (the surveyor's formula). Area × price per m² is the land's value." },
    { k: "Sport", t: "Why a curveball curves", x: "Spin produces a sideways force along spin × velocity: the Magnus effect. The ball breaks at right angles to both." },
    { k: "Tech", t: "Lighting in 3D games", x: "Each triangle's facing direction is the cross product of two edges. Graphics cards compute billions of these a second to shade surfaces." },
    { k: "Finance", t: "Hedging two risks at once", x: "With three assets, a mix neutral to two risk factors points along the cross product of the two exposure vectors: at right angles to both." },
    { k: "Science", t: "Electric motors", x: "The force on a wire in a magnetic field is I L × B, at right angles to both the wire and the field. Every motor spins on a cross product." },
    { k: "Finance", t: "Measuring irregular lots", x: "Lot area is one input to a property's assessed value. Irregular lots are measured by splitting them into triangles, each with area ½|u × v| from its corner coordinates." },
    { k: "Science", t: "Earth's spin and weather", x: "The Coriolis effect involves a cross product with Earth's rotation, which is why storms spin opposite ways in the two hemispheres." }
  ],
  lines: [
    { k: "Finance", t: "Target-date funds move along a line", x: "Start at (70% stocks, 20% bonds, 10% cash) and shift (−2, +1.5, +0.5) a year: r = P + t d, with t in years." },
    { k: "Science", t: "Air traffic control", x: "A plane's path is position + time × velocity. Controllers project these lines forward to spot two planes heading for the same point." },
    { k: "Finance", t: "Straight-line depreciation", x: "A $30,000 truck losing $5,000 a year has book value 30,000 + t(−5,000): a line through a starting point with a direction." },
    { k: "Tech", t: "3D printers and CNC machines", x: "The tool moves from point to point along r = P + t(Q − P), with t running from 0 to 1." },
    { k: "Finance", t: "Dollar-cost averaging", x: "Investing $500 a month traces a line: total invested = 500t. The market value wobbles around it." },
    { k: "Science", t: "Aiming a laser", x: "A beam is a line: a starting point plus a direction. Aiming it means choosing the direction vector." },
    { k: "Finance", t: "Budget lines", x: "All the mixes of two things you can afford on a fixed budget lie on a line. Add a third and it becomes a plane, the next step." },
    { k: "Sport", t: "A putt on a flat green", x: "The ball rolls from a start point in one direction: a line in parametric form, until the slope of the green bends it." }
  ],
  planes: [
    { k: "Finance", t: "An income target is a plane", x: "Every split among three funds that pays exactly $300 a year is a point on 0.02x + 0.04y + 0.03z = 300. The normal is the yield vector." },
    { k: "Home", t: "Roofs and ramps", x: "A roof is a plane. Builders get its pitch from the normal vector, and its height at any point by solving the equation for z." },
    { k: "Finance", t: "Allocations add to 100%", x: "stocks + bonds + cash = 100 is a plane, and every valid portfolio mix lies on it." },
    { k: "Tech", t: "Games are made of flat triangles", x: "Every curved surface in a 3D game is cut into small flat triangles, each a piece of a plane with its own normal." },
    { k: "Finance", t: "Break-even", x: "Selling three products with different margins, all the sales mixes that exactly cover fixed costs form a plane." },
    { k: "Science", t: "Rock layers", x: "Geologists record a tilted rock layer by its strike and dip, which describe a plane's orientation. Drillers use it to predict depths." },
    { k: "Finance", t: "A three-item budget", x: "4x + 6y + 2z = 100: everything you can buy for exactly $100 is a plane. Prices are the normal vector." },
    { k: "Sport", t: "A ski hill's fall line", x: "The steepest way down a planar slope points along the plane, opposite the uphill tilt given by the normal. Skiers call it the fall line." }
  ],
  lineplane: [
    { k: "Finance", t: "When a glide path crosses a target", x: "A target-date fund's path is a line and 'expected return = 4.2%' is a plane. Where they meet is the age the fund hits that return." },
    { k: "Science", t: "Descending into cloud", x: "A plane on approach follows a line; the cloud base is a horizontal plane. Solving for t gives when the pilot loses sight of the ground." },
    { k: "Tech", t: "Ray tracing", x: "Films and modern games find where each light ray (a line) hits each surface (a plane), millions of times per frame." },
    { k: "Finance", t: "Rebalancing bands", x: "A drifting portfolio moves along a line; the rebalancing rule is a plane. The crossing is the moment to trade." },
    { k: "Science", t: "Drilling into a rock layer", x: "A drill hole is a line and a rock layer is a plane. Their meeting point tells the crew at what depth to expect the layer." },
    { k: "Sport", t: "Line calls in tennis", x: "Tracking systems fit the ball's path and find where it meets the court's plane, and whether that point is in." },
    { k: "Finance", t: "Hitting a spending limit", x: "Spending that grows along a line in (food, travel, other) meets the budget plane at the point where you run out." },
    { k: "Science", t: "Shadows on a wall", x: "A sun ray is a line; a wall is a plane. Where the ray from a rooftop meets the wall marks the tip of the shadow." }
  ],
  dist: [
    { k: "Science", t: "Drone clearance over a slope", x: "The shortest distance to a hillside runs along the normal, not straight down. Height above the ground overstates the real clearance." },
    { k: "Finance", t: "The smallest change to hit a target", x: "Your holdings are a point; 'income = $300' is a plane. The distance between them is the smallest straight-line change in holdings that hits the target." },
    { k: "Tech", t: "Collision checks in games", x: "Is a character within 0.5 m of a wall? Games compute point-to-plane distances for every object, every frame." },
    { k: "Finance", t: "Credit scoring with a margin", x: "Support vector machines, used in credit scoring, separate good and bad loans with a plane chosen so that the nearest cases are as far away as possible." },
    { k: "Home", t: "A light under a sloped ceiling", x: "How close is a fixture to a slanted ceiling? The point-to-plane formula, not the vertical gap, gives the real clearance." },
    { k: "Finance", t: "Least squares", x: "Fitting a plane to data, as in a multi-factor return model, chooses the plane that makes the squared vertical distances from the points as small as possible." },
    { k: "Science", t: "Earthquakes and faults", x: "Seismologists measure how far an earthquake's origin lies from a mapped fault plane to decide which fault moved." },
    { k: "Sport", t: "Offside and goal lines", x: "Whether a puck fully crossed the goal line is a point-to-plane question: the distance of its edge from the line's vertical plane." }
  ]
};
