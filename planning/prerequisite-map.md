# What MCV4U actually depends on

Built by reading all 187 expectations across the three courses and tracing each MCV4U expectation back to the earlier expectations it assumes. Codes refer to the files in `../curriculum/`.

## The headline

MCV4U splits into two halves that behave completely differently.

**Calculus (strands A and B, 27 expectations)** rests almost entirely on MHF4U, not MCR3U. Every hard prerequisite traces to Advanced Functions. MCR3U contributes algebra technique, not concepts.

**Vectors (strand C, 24 expectations)** rests on almost nothing from either course. It is new material built on Grade 10 geometry and basic trigonometry. Reviewing Grade 11 does not prepare a student for it.

That asymmetry should drive the whole plan. Half the course cannot be prepared for by review, and the other half is prepared for by reviewing MHF4U rather than MCR3U.

## Strand A, Rate of Change

| MCV4U expectation | Depends on | Strength |
|---|---|---|
| A1.1 to A1.3 rates of change, secants, tangents | MHF4U D1.1 to D1.9 | Near-duplicate |
| A1.4 limits, informal | MHF4U D1.6 | Moderate |
| A1.5, A1.6 the difference quotient | MCR3U A3.3 rational expressions; MCR3U A3.1 polynomial expansion | Hard |
| A2.1 sign of the rate of change | MHF4U D1.7, MHF4U C4.3 | Hard |
| A2.2, A2.3 the derivative function | MHF4U C1.2 polynomial graphs; MCR3U A3.1 | Hard |
| A2.4 derivative of sine and cosine | MHF4U B1.1 to B1.4 radians; MHF4U B2.1 | Hard |
| A2.5 to A2.8 derivative of exponentials, e, ln | MHF4U A1, A2, A3 in full; MCR3U B1 | Hard |
| A3.1 to A3.3 power, sum, difference rules | MCR3U A3.1; MHF4U C3.2 factoring | Hard |
| A3.4 power rule with rational exponents; chain rule | MCR3U B1.2, B1.3 rational exponents; MHF4U D2.4, D2.5 composition | Hard |
| A3.5 product and chain rules applied | MHF4U D2.1 combining functions; MCR3U A3.3 | Hard |

The single most important line in this table is A1.5 and A1.6. Simplifying [f(a + h) − f(a)]/h is an algebra exercise wearing a calculus costume. A student who cannot expand (3 + h)² and cancel an h, or who cannot add rational expressions over a common denominator, fails at calculus for reasons that are entirely MCR3U A3.

## Strand B, Derivatives and Their Applications

| MCV4U expectation | Depends on | Strength |
|---|---|---|
| B1.1, B1.2 sketching f′ and f″ from a graph | MHF4U D1.7, D1.8 | Hard |
| B1.3 second derivative, concavity | MHF4U C1.2, C1.3 end behaviour; MHF4U C2.1, C2.2 asymptotes | Hard |
| B1.4 reconstructing f from f′ | MHF4U C1.5 factored form and intercepts | Moderate |
| B1.5 curve sketching | MHF4U C4.2, C4.3 polynomial inequalities; MHF4U C1.9 even and odd | Hard |
| B2.1 motion | MHF4U D1.3 sketching rate-of-change graphs | Moderate |
| B2.2, B2.3 applied rates of change | MHF4U A2.4 exponential and log models; MHF4U D3.3 | Moderate |
| B2.4 optimization | MCR3U A2.2 max and min of a quadratic; MHF4U C4.3 | Hard |
| B2.5 modelling | MHF4U D3.3 | Moderate |

The hidden dependency here is MHF4U C4.3, solving factorable polynomial inequalities. Every sign chart in curve sketching and every optimization problem is that skill applied to f′(x). Teachers rarely name the connection, so a student who quietly skipped inequalities in Advanced Functions hits a wall in curve sketching and cannot explain why.

## Strand C, Geometry and Algebra of Vectors

| MCV4U expectation | Depends on | Strength |
|---|---|---|
| C1.3 Cartesian and polar form | MCR3U D1.1, D1.2 trig ratios | Moderate |
| C2.3 navigation and force problems | MCR3U D1.6 sine and cosine law | Moderate |
| C2.4, C2.6 dot and cross product | MCR3U D1.1 exact trig values | Weak |
| C3.1 systems of two linear equations | Grade 10 analytic geometry | Outside both courses |
| C4.4 systems of three linear equations | Grade 10 elimination and substitution | Outside both courses |
| Everything else in strand C | Nothing in MCR3U or MHF4U | None |

Twenty-four expectations, and the only real feed-ins are the sine and cosine law and basic trigonometric ratios. There is no function theory in vectors at all.

Two consequences. First, a weak Grade 11 student can still do well in vectors, which makes it the best place to build a student's confidence. Second, the algebra it does need, solving a 3 by 3 linear system by elimination, appears nowhere in MCR3U or MHF4U. Students last met it in Grade 10 with two equations. C4.4 asks for three unknowns cold.

## Why the algebra is the weak point

MCR3U strand A3, the algebra of polynomial, radical and rational expressions, carries a footnote in the curriculum:

> The knowledge and skills described in the expectations in this section are to be introduced as needed, and applied and consolidated, as appropriate, in solving problems throughout the course

Read that as a design decision with a predictable failure mode. A3 is the only part of Grade 11 that the Ministry explicitly says should not be taught as a unit. It has no chapter, no test of its own, and no week on the timetable. It is meant to be absorbed while doing other things.

Skills taught that way are the ones students absorb unevenly. A student can pass MCR3U with a good mark while never having been assessed directly on adding rational expressions with unlike denominators. Then MCV4U A1.5 hands him [f(a + h) − f(a)]/h and the gap surfaces as a calculus problem, which it is not.

This is the strongest practical reason to run a diagnostic before teaching anything. The weakest skill is the one that was never given a unit, so neither the student nor his report card knows it is weak.

## What you can skip

**MCR3U strand C, Discrete Functions.** All 17 expectations: sequences, series, Pascal's triangle, compound interest, annuities. Nothing in MCV4U uses any of it. MCV4U A1.4 mentions the Fibonacci sequence once, as an informal illustration of a limit, and that is the entire connection. This is a quarter of Grade 11 that you can set aside.

**MCR3U strand B3 and D3, the data-collection expectations.** B3.1 and D3.1 are about gathering data with probes and from Statistics Canada. Useful teaching, irrelevant to calculus readiness.

**MHF4U A2.4, C2.3.** Applications of log scales and sketching rational functions by hand are light touches in MCV4U.

## What to review instead, in priority order

1. **MCR3U A3** – polynomial, radical and rational expressions. Four expectations. This is the highest-value review in the entire Grade 11 course, because it is what the difference quotient is made of.
2. **MHF4U D1** – average and instantaneous rate of change. Nine expectations that MCV4U strand A then repeats at higher speed.
3. **MHF4U C3 and C4** – factoring to degree four, and polynomial inequalities. Sign charts live here.
4. **MHF4U B1 and B2** – radian measure and trigonometric graphs. A2.4 is unreachable without radians.
5. **MHF4U A** – logarithms in full. A2.5 to A2.8 depend on knowing what e and ln are.
6. **MCR3U B1.2, B1.3** – rational exponents. Needed the moment the power rule meets a radical.
7. **MCR3U A1** – function notation, domain and range, transformations. Foundational but usually intact.
8. **MCR3U D1** – trig ratios and the sine and cosine law. Feeds both MHF4U B and MCV4U C2.3.

## What is not in MCV4U at all

Worth knowing, because textbooks add material the curriculum does not require and students waste effort on it.

- **No quotient rule.** A3.5 handles rational functions by rewriting them as products with negative exponents. Many teachers teach the quotient rule anyway.
- **No implicit differentiation.**
- **No related rates.** B2.3 asks for instantaneous rates of change from a given equation of a function. It does not ask students to chain one rate to another.
- **No formal limits.** A1.4 is explicitly informal. No limit laws, no epsilon-delta, no continuity theory.
- **No integration.**
- **No logarithmic differentiation, no derivative of ln x as an expectation.** A2.7 asks only that students recognize ln as the inverse of e^x.

If Sebastian's teacher is using the Nelson or McGraw-Hill textbook, some of these appear anyway. Ask him.
