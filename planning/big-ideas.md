# The seven ideas underneath all of it

The three courses contain 187 expectations. They contain about seven ideas. The expectations are a checklist for a teacher who has to prove coverage; they are not a map of the subject, and reading them will not give you understanding because they are not organized around understanding.

This file is the map. Each idea appears in all three courses in different costumes, and most of them have a root in primary school, which matters to you now for two reasons rather than one.

---

## 1. Function

A rule that takes an input and gives back exactly one output. That is the entire definition. The vertical line test is just a picture of "exactly one".

**The part adults get wrong.** The notation f(x) does three jobs and people conflate them. `f` is the rule. `x` is the input. `f(x)` is the output. When you write f(x) = x² + 1 you are defining a rule; when you write f(3) = 10 you are reporting an output. Students who never separate these cannot understand composition, inverses, or the notation f′(x) later, because all three depend on treating the rule itself as an object you can do things to.

**Where it lives.** MCR3U A1 defines it. Everything after that is families of functions: quadratic, exponential, trigonometric, polynomial, rational. Sequences are functions whose inputs are the counting numbers, which is what MCR3U C1.1 is saying in its awkward way.

**Primary root.** "What's my rule?" games. You say 3, I say 7. You say 5, I say 11. What am I doing? That is function notation without the notation, and an eight-year-old can play it.

---

## 2. Four representations

Every function can appear as a table of numbers, a graph, an equation, or a sentence in English. They are the same object seen from four sides.

Understanding is the ability to move between them in any direction. Most students can go from equation to table, and from table to graph, and no further. Ask them to go from a graph back to an equation, or from a sentence to a graph, and it stops.

**Where it lives.** This is what the curriculum means by its constant refrain about making connections between numeric, graphical and algebraic representations. Dozens of expectations. It reads as filler and it is actually the main idea.

**Test yourself.** Take any function in those files. Given one representation, produce the other three. If you can do that for every family, you understand the first half of the subject.

**Primary root.** Show one growing pattern four ways: as blocks on the table, as a table of numbers, as a picture, and as a sentence. Then ask which one makes the next term easiest to find. Different representations make different questions easy, and that is the whole point.

---

## 3. Rate of change

One question, asked with increasing precision over four school years, and nobody ever tells the student it is one question.

| Level | The question | The answer is called |
|---|---|---|
| Grade 4 | How much does it go up each time? | The pattern rule |
| Grade 9 | How steep is this line? | Slope |
| Grade 11 | How fast did it change between here and there? | Average rate of change, the slope of a secant |
| Grade 12, MHF4U | How fast is it changing right now? | Instantaneous rate of change, approximated |
| Grade 12, MCV4U | Exactly how fast, right now? | The derivative |

Each row is the previous row with the interval made smaller. That is all calculus does to the idea.

**Primary root, and the important one.** Proportional reasoning. If three apples cost two dollars, what do twelve cost? That is slope, years before anyone says the word. Proportional reasoning is the strongest single predictor of later success in mathematics, and it is the thing to spend time on with a ten-year-old.

---

## 4. Local linearity

The one idea that makes differential calculus work, and the curriculum never states it.

Zoom in far enough on a smooth curve and it becomes indistinguishable from a straight line. The derivative is the slope of that straight line. Every rule you will ever learn — power, product, chain — is bookkeeping built on top of that single observation.

**Why this matters for teaching.** It explains the things students find arbitrary.

- Why does a corner have no derivative? Because you can zoom in forever and a corner stays a corner. It never becomes a line. That is exactly what the sample problem at MCV4U A1.2 is asking about.
- Why is the tangent line a good approximation near the point? Because near the point, the curve *is* that line, to any accuracy you care to demand.
- Why does the difference quotient have a limit at all? Because the secants are converging on the line the curve is turning into.

**No primary root.** This one genuinely arrives in Grade 12. But "zoom in on a map until the coastline looks straight" is the intuition, and a ten-year-old gets it.

---

## 5. Transformation

One formula, y = af(k(x − d)) + c, applied to every function family in all three courses. Learn it once and it never changes.

Four moves. `a` stretches vertically. `c` shifts vertically. `k` stretches horizontally. `d` shifts horizontally. Negative values reflect.

**The part everyone gets wrong, including teachers.** The horizontal ones run backwards. (x − 3) shifts the graph *right* by three, and k = 2 *compresses* by a factor of two rather than stretching. It feels wrong every time.

The reason: `a` and `c` act on the output, after the function has done its work, so they behave as you expect. `k` and `d` act on the *input*, before the function runs. To make the transformed graph show at x = 5 what the original showed at x = 2, you have to hand the original a 2 when you are given a 5, so you subtract. You are not moving the graph; you are changing what you feed it.

Say that sentence to yourself until it is obvious. It is the single most common permanent confusion in secondary mathematics.

**Primary root.** Grade 4 and 5 geometry: translations, reflections and rotations of shapes on a grid. Same word, same idea, five years earlier, and almost nobody connects the two.

---

## 6. Inverse

Undoing. It runs through every year of school mathematics and is rarely named as one idea.

| Operation | Its inverse | First met |
|---|---|---|
| Add | Subtract | Grade 1 |
| Multiply | Divide | Grade 3 |
| Square | Square root | Grade 8 |
| A function | Its inverse function, reflected in y = x | MCR3U A1.4 to A1.7 |
| Exponentiate | Take the logarithm | MHF4U A1, A2 |
| e to the x | Natural logarithm | MCV4U A2.7 |
| Differentiate | Integrate | Cut from this course |

The last row is worth knowing even though it is not examinable. It is the other half of calculus, and the picture is incomplete without it, which is one reason MCV4U can feel like it stops mid-sentence.

**Primary root.** "What plus three makes seven?" An eight-year-old who is comfortable running an operation backwards has the seed of everything in that table.

---

## 7. Direction as a quantity

The odd one out, and the whole of MCV4U strand C.

Some quantities are incomplete without a direction. A velocity of 80 km/h tells you nothing useful; 80 km/h west does. That is the observation. Everything else is machinery for calculating with such quantities.

**The deep move.** Geometry becomes algebra. A plane is a geometric object you could hold as a sheet of cardboard, and it is also the equation 19x − 6y − 11z + 10 = 0. The intersection of three planes, a question about shapes in space, becomes a system of three linear equations, a question about arithmetic. Solve the arithmetic and read the answer back as geometry.

That translation between two worlds is the actual content of the strand. The dot and cross products are the dictionary.

**Primary root.** Coordinate grids, describing position, giving directions. Grade 4 to 6 spatial sense.

---

# How to study for understanding rather than coverage

Five things, in order of how much they matter.

**1. Explain it to a ten-year-old.** You have one. This is not a metaphor for you, it is a method, and it is the most reliable test of understanding that exists. If you cannot explain why (x − 3) shifts right in language a ten-year-old follows, you do not understand it yet. You know a rule.

**2. Ask why, not how.** "How do I differentiate this?" produces a procedure you will forget. "Why is that the answer?" produces something that survives. You have the enormous advantage of not needing to pass anything, so you can afford the slower question.

**3. Work problems.** Reading mathematics produces a convincing sensation of understanding that evaporates the moment someone asks you something slightly different. There is no substitute and there never has been.

**4. Connect forwards and backwards.** Every time you meet an idea, ask where it came from and where it goes. The seven ideas above are the threads. Following them is what turns 187 disconnected expectations into one subject.

**5. Try to break it.** What happens at a corner? What if k is negative? What if the denominator is zero? What if the two vectors are parallel? The edge cases are where the definition shows you what it is actually saying.

---

# Twelve questions that test understanding

If you can answer these in plain language, you understand this material better than most people who teach it. The curriculum asks none of them directly.

1. Why can a function not have two outputs for one input? What breaks if you allow it?
2. Why does (x − 3) move a graph to the right rather than the left?
3. Why does a corner have no derivative?
4. Why is the derivative of a constant zero? Answer in terms of rate of change, not the rule.
5. Why is e special? What question is e the answer to?
6. Why does the derivative of sin x turn out to be cos x? Think about the slope of the sine graph at each point.
7. Why does log(ab) = log a + log b? What fact about exponents is this?
8. What does the second derivative mean if the first derivative is speed?
9. Why does the chain rule multiply? What is each factor measuring?
10. Why does the dot product tell you about the angle between two vectors?
11. Why is the cross product perpendicular to both vectors, and why does its length measure area?
12. Three planes, no common point. Give two genuinely different ways that can happen.

Work through these over the coming weeks rather than in one sitting. Number 6 and number 12 are the two most people cannot do.

---

# For an eight-year-old and a ten-year-old

Four things, and none of them is teaching them mathematics early.

**Proportional reasoning, constantly.** Recipes doubled and halved. Kilometres per hour on a car journey. Price per hundred grams in a shop. Scaling a drawing. This is the root of rate of change, it is the strongest predictor of later mathematical success, and it costs you nothing but conversation.

**"What's my rule?"** You pick a rule, they feed you numbers, you give back answers, they work out the rule. Then they pick one. That is function notation without notation, and a ten-year-old will beat you at it within a month.

**Show one thing four ways.** A growing pattern as blocks, as a table, as a picture, as a sentence. Ask which version makes the next step easiest to see. You are teaching that representations are choices, which is idea number two, eight years early.

**Never reward speed.** The single most damaging belief in school mathematics is that being good at it means being fast. It is the belief that makes capable children decide at eleven that they are not maths people. Reward the child who says "wait, why does that work?" and lets the faster sibling finish first.

**One practical note.** The Ontario elementary curriculum was rewritten in 2020 and no longer resembles what you did. It has five strands, and two of them will surprise you: the algebra strand now contains **coding**, and there is a separate **financial literacy** strand from Grade 1. If you want those expectations transcribed the way we did these three courses, send me the pages for Grade 3 and Grade 5 and I will do the same job. The network here cannot reach the Ministry site.

**And one correction to earlier advice.** I told you to skip MCR3U strand C, sequences, series and financial mathematics, because nothing in MCV4U touches it. That still holds for Sebastian. It stops holding the moment your own children reach Grade 11, so do not delete it from your mental map.
