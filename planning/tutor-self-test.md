# Calibration test for the tutor

Ten questions at MCV4U level, about ninety minutes. Take it **before** you study anything.

The point is not to revise. It is to find out, cheaply, which of your instincts are still working after twenty-five years. Almost everyone in your position over-estimates how much calculus is gone and under-estimates how much vector geometry is missing. This test settles both in one sitting.

Rules that matter: no notes, no worked examples, no calculator except for question 7. Write full solutions, not just answers. Time yourself loosely and note which questions felt slow rather than hard, because slow and hard need different remedies.

---

## Calculus

**1.** Differentiate f(x) = (3x² − 1)(2x + 5)⁴ and factor your answer.

**2.** Differentiate f(x) = √(x² + 5).

**3.** Differentiate f(x) = (x² + 1)/(x − 1) **without using the quotient rule.** Rewrite it as a product first.

**4.** From first principles, using the limit of the difference quotient, find f′(x) for f(x) = 1/x. Show the algebra.

**5.** For f(x) = x³ − 3x² − 9x + 5, determine the intervals of increase and decrease, the local maximum and minimum, the point of inflection, and the intervals of concavity.

**6.** A square sheet of metal measures 40 cm by 40 cm. Equal squares of side x are cut from each corner and the sides are folded up to make an open-top box. Find the value of x that maximizes the volume, and state the maximum volume.

---

## Vectors

**7.** Given a⃗ = (2, −1, 3) and b⃗ = (1, 4, −2), find a⃗ • b⃗, find a⃗ × b⃗, and find the angle between a⃗ and b⃗ to one decimal place. Then verify that your cross product is orthogonal to both vectors.

**8.** Find a vector equation and parametric equations for the line passing through (3, 2, −1) and (0, 2, 1).

**9.** Find the scalar equation of the plane passing through (3, 2, 5), (0, −2, 2) and (1, 3, 1). Verify your answer against all three points.

**10.** Without calculating anything: describe every way three planes in three-space can fail to intersect at a single point. For each case, say what happens when you try to solve the corresponding system of three linear equations algebraically.

---

# Answers

**1.** f′(x) = 2(2x + 5)³(18x² + 15x − 4)

Working: 6x(2x + 5)⁴ + 8(3x² − 1)(2x + 5)³, then take out 2(2x + 5)³.

**2.** f′(x) = x / √(x² + 5)

**3.** f′(x) = (x² − 2x − 1) / (x − 1)²

Working: write f(x) = (x² + 1)(x − 1)⁻¹, so f′(x) = 2x(x − 1)⁻¹ − (x² + 1)(x − 1)⁻², then combine over (x − 1)².

**4.** f′(x) = −1/x²

Working: [1/(x + h) − 1/x] / h becomes [−h / (x(x + h))] / h, which is −1 / (x(x + h)), which tends to −1/x².

**5.** f′(x) = 3(x − 3)(x + 1), f″(x) = 6(x − 1)

- Increasing for x < −1 and x > 3, decreasing for −1 < x < 3
- Local maximum at (−1, 10), local minimum at (3, −22)
- Point of inflection at (1, −6)
- Concave down for x < 1, concave up for x > 1

**6.** V = x(40 − 2x)², V′ = (40 − 2x)(40 − 6x)

x = 20/3 cm, about 6.7 cm. Maximum volume 128000/27 cm³, about 4741 cm³. The other root, x = 20, gives a box of zero volume and is rejected.

**7.**
- a⃗ • b⃗ = −8
- a⃗ × b⃗ = (−10, 7, 9)
- |a⃗| = √14, |b⃗| = √21, so cos θ = −8 / (7√6), giving θ ≈ 117.8°
- Check: (−10)(2) + (7)(−1) + (9)(3) = 0, and (−10)(1) + (7)(4) + (9)(−2) = 0

**8.** Direction vector (−3, 0, 2).

r⃗ = (3, 2, −1) + t(−3, 0, 2), and x = 3 − 3t, y = 2, z = −1 + 2t

**9.** Normal (19, −6, 11 with sign as below). Two vectors in the plane are (−3, −4, −3) and (−2, 1, −4); their cross product is (19, −6, −11).

Scalar equation: 19x − 6y − 11z + 10 = 0

Check (3, 2, 5): 57 − 12 − 55 + 10 = 0. Check (0, −2, 2): 0 + 12 − 22 + 10 = 0. Check (1, 3, 1): 19 − 18 − 11 + 10 = 0.

**10.** The configurations with no single point of intersection:

- All three planes parallel and distinct. No solution. Algebraically you reach a contradiction such as 0 = 5.
- Two planes coincident, third parallel and distinct. No solution, same contradiction.
- All three coincident. Infinitely many solutions, a whole plane. Two equations vanish entirely.
- Two coincident, third crossing them. Infinitely many solutions forming a line.
- Three distinct planes meeting in a common line. Infinitely many solutions, a line. One equation is a combination of the other two.
- Three distinct planes forming a triangular prism, each pair meeting in a line but no common point. No solution, and this is the case people miss.

---

# How to read your result

**Questions 1 to 3 fluent, question 4 slow.** The normal outcome for your background. The rules are intact; the difference quotient is rusty because you have not needed first principles since first year. Half an hour of practice fixes it. Do fix it, because MCV4U A2.3 requires it and Sebastian will be tested on it.

**Question 3 done with the quotient rule anyway.** Expected, and it is the single most useful thing this test will show you. You reached for a tool that is not in his course. Watch for that reflex in every session. The curriculum wants the product form with a negative exponent, and if you show him the quotient rule you are teaching outside the syllabus.

**Question 5 correct but slow.** Fine. Curve sketching is a procedure and speed returns with repetition. What matters is whether you built a sign chart or reasoned case by case. Sign charts are what he must learn, so use them yourself.

**Question 6 struggled.** Worth attention. Optimization is where students lose the most marks, so you need to be faster than competent at it. Twenty problems will do it.

**Questions 7 to 9 fine.** Then you almost certainly took OAC Algebra and Geometry, or have used vectors professionally. Your preparation just shrank from twelve hours to about four, and you should re-read the plan with that in mind.

**Questions 7 to 9 shaky or blank.** The expected result, and the main finding of the test. This is where your hours go. Follow the seven-step sequence in the re-learning plan and do not skip ahead to planes.

**Question 10 incomplete.** Almost everyone misses the triangular prism case. It is also a favourite examination question precisely because it is the one students cannot picture. Cardboard.

**Anything in 1 to 6 genuinely gone, not merely slow.** Unlikely on your background, but if it happens, revise the topic before the session where it comes up rather than trying to reconstruct it in front of him. Students notice.
