# Chalk and Paper – product brief

Built from a twenty-question interview on 2026-09-25. This is the document the app is built against. Change it here and the build follows.

## The one-line version

A daily maths lesson that arrives by email, opens on a phone in one tap, takes two to five minutes, never punishes a missed day, and remembers everything the moment you tap.

## Decisions, in the order they were made

| # | Question | Decision |
|---|---|---|
| 1 | Device | Phone, almost always |
| 2 | Moments of use | Anything from 30 seconds to 15 minutes; a sitting is just several questions in a row |
| 3 | Where it lives | GitHub Pages, in this repository |
| 4 | Sign-in | Name and a 4-digit PIN. No email, no password |
| 5 | Sharing | Private by default; each person can turn on a read-only progress link |
| 6 | Tutor view | The shared page includes actual mistakes: which wrong option, how often |
| 7 | Scale | 5 to 10 people, friends and family. Not searchable. Household groups so Sebastian and his parents can see each other's progress |
| 8 | Progress that motivates | All of: mastery map, personal bests, points and levels, calendar of days practised |
| 9 | Streaks | Yes, with freeze days earned by practising |
| 10 | Reminders | One daily lesson by email: a short briefing, a link, the same briefing on the site, a few questions, then optional extra practice |
| 11 | Forgetting | Spaced review. Mastered steps return at growing intervals |
| 12 | Wrong answers | Cost nothing. The step's next review moves closer |
| 13 | Daily lesson size | Default one rule, five questions, two review. Adjustable per profile |
| 14 | Content | Calculus and Vectors is the default track because the course is live. Advanced Functions and Grade 11 are optional tracks a person can add to their daily email |
| 15 | Why-questions | One reasoning question mixed into every daily lesson |
| 16 | Own questions | No. Generated only |
| 17 | Code involvement | None by hand. Rule cards and lesson prose live in one plain content file so they can be reworded through Claude Code without touching the machinery |
| 18 | Cost | Free tiers only |
| 19 | Identity | Keep the name and the notebook look |
| 20 | Biggest risk of quitting | Life gets busy, the streak breaks, and that ends it |

## What answer 20 means for everything else

The most likely failure is a busy week, not boredom or difficulty. So the design priority, above every gamification feature, is **forgiving re-entry**:

- Freeze days absorb a missed day. They are earned, so a regular user always has some.
- Coming back after a gap is never scolded. The welcome-back screen shows what is still mastered, offers one easy review question, and says nothing about what was missed.
- The daily email keeps arriving, unchanged in tone, whether the last lesson was yesterday or three weeks ago.
- A break longer than a week quietly reduces the daily size to the minimum until three days have been completed.

## Missed lessons stay open

A lesson is dated, not disposable. If the email is missed, the lesson still sits on the site, and it keeps sitting there until it is done. But an unbounded pile of undone lessons is exactly the guilt that answer 20 warns about, so:

- The newest lesson is always at the top and is the one the site opens on. Older open lessons sit below it under "waiting", with no count and no red badge.
- After fourteen days an undone lesson stops being a to-do. Its questions fold quietly into the review pool, so nothing is lost, and the list never grows past two weeks.
- Doing an old lesson counts fully: points, calendar square for today, streak.

## The parents' safety net

Sebastian's parents may not remember their maths, and a person who gets four questions wrong in a row on their first evening will not come back. So every step has a floor under it.

- **Every step names its prerequisite.** Chain rule rests on power rule; power rule rests on exponent laws; vectors rest on nothing but arithmetic. This is data, not code.
- **Show me one first.** The first question on any new step is worked in front of you, not asked. Then the next three questions are the easiest version of that step, and the rule card stays open above them.
- **Two wrong in a row backs you up.** The app says "let's take a step back", opens the prerequisite step's rule card, gives three easy questions there, and then returns you. It does this without comment on the score.
- **A hint before answering, always.** The "remind me of the rule" link is on every question, and using it costs nothing.
- **Explanations are the product, not a consolation.** A wrong answer shows what went wrong, the walk-through, and the rule card. That is more teaching than a right answer gets, deliberately.
- **Difficulty is per person, not per step.** Someone still shaky on a step keeps getting the easy versions until they are not. Someone fluent gets the harder versions. Two people on the same step see different questions.

The tracks below Calculus and Vectors matter most for this. A parent whose exponents are gone needs Grade 11 first, and the app should route them there rather than let them fail Grade 12 in public.

## Make it practical, with real numbers

Every lesson ends with an "in real life" section, and it is not a sentence of analogy. It is a short worked calculation with real data, followed by one question on that data. It counts as one of the lesson's questions, so the practical part is answered, not just read.

The shape, every time:

1. **A live number**, with its source and date, marked "live". Fetched fresh each morning by the same job that sends the email.
2. **A setup** in two sentences, in first person: you bought, you hold, you owe.
3. **The calculation**, three or four lines, in a monospaced block, with the answer.
4. **Why this is today's rule**, in one paragraph that names the rule and shows where it acted.
5. **Try it**: the same situation with one number changed, four options, wrong options being the usual mistakes (adding rates instead of multiplying, ignoring the currency, using the wrong direction).

Finance and investing at least once a week, and more often when the rule fits. Free sources with no key required:

- **Bank of Canada Valet API**: USD/CAD and every other exchange rate, the policy rate, bond yields, and CPI. Enough for most of the finance connections below.
- **Open-Meteo**: temperature, wind, sunrise and sunset, for rate-of-change and periodic-function days.
- Anything else stays a fixed worked example with the date stated. No source, no fake "live" tag.

The worked example for the chain rule, as drawn on the screens:

> USD/CAD 1.3500, Bank of Canada, yesterday's close. A year ago you bought a US stock at US$100 when a US dollar cost C$1.40. It is now US$110, and a US dollar costs C$1.35. Stock: 110 ÷ 100 = 1.100, up 10%. Currency: 1.35 ÷ 1.40 = 0.964, down 3.6%. Together: 1.100 × 0.964 = 1.061, up 6.1%. C$140 became C$148.50. Rates stacked inside each other multiply; that multiply is the chain rule. Try it: if the US dollar had risen to C$1.45 instead? Answer 13.9%; the trap is 13.6%, which is what you get by adding.

The connection per step, each of which becomes a calculation of this shape:

| Step | Live number | The calculation |
|---|---|---|
| Exponent laws | Policy rate | (1 + r)³ · (1 + r)² is five years of growth, so the exponents add |
| Fraction and negative exponents | 5-year bond yield | What a dollar due in three years is worth today: (1 + y)⁻³ |
| Slope and rate of change | USD/CAD, 30 days apart | The average daily rate of change of the currency |
| Power rule | Fixed example | Marginal cost from C(q) = 0.02q² |
| Tangent at a point | 10-year bond yield | Bond price against yield, and the slope at today's yield: duration |
| Product rule | Fixed example | Revenue is price times volume when a price cut raises volume |
| Chain rule | USD/CAD | The example above |
| eˣ and ln | Policy rate | Continuous compounding, and why log returns add |
| Maximums and minimums | Fixed example | The order size that minimizes total cost |
| Vector basics | Three exchange rates | A portfolio as a vector; rebalancing as subtraction |
| Dot product | Three exchange rates | Portfolio return as weights · returns |
| Cross product and planes | Fixed example | "Spend exactly $10,000 across three funds" as a plane |
| Lines in space | Fixed example | A retirement glide path as a line through allocation space |

Days that are not finance use Open-Meteo: today's temperature curve for sinusoidal functions, the rate the temperature is changing at noon for the derivative, sunrise drift across the year for average rate of change.

## Architecture, free tiers only

Three parts, one new account.

**1. The site: GitHub Pages, this repository.**
A static, installable web app. It works offline, saves every tap to the phone immediately, and syncs when it can. Installing it to the home screen is a browser menu item; it then opens full-screen like an app. This part needs no account and can ship first.

**2. The shared record: Supabase, free tier.**
Profiles, progress, households and share links. The site talks to it through a small server-side function that checks the PIN before it will write anything, so nobody can alter another person's record from the browser. One account to create, two keys to paste. Free tier limits are far above ten users.

**3. The daily email: a scheduled job in this repository, sent through Gmail.**
Every morning a GitHub Actions job asks Supabase who is subscribed and what each person's next lesson is, then sends one email per person through a Gmail app password. No third-party email service, no extra account. Gmail allows 500 a day, which is fifty times what is needed.

### Why not the alternatives

- *Stay on claude.ai.* Would have worked and needed no accounts, but everyone would need a claude.ai login and an invitation, and it cannot install as a phone app. The user chose GitHub Pages.
- *A native app store app.* Weeks of work, a developer account that is not free, and review delays for every fix. An installable web app does the job at this scale.
- *Firebase or Cloudflare instead of Supabase.* Either would work. Supabase has the friendlier data browser for a non-programmer owner who wants to look at what is stored.

### Honest security note

Name and PIN over a public website is friends-and-family security. It stops someone from casually opening another person's progress. It does not stop a determined person who knows the PIN. PINs are stored hashed, share links use long random tokens, households are joined by invite code only, and nothing is listed publicly. For five to ten people who know each other, that is the right trade.

## Safe as it goes

Every answer is written to the phone's storage before the screen even updates. A second write goes to Supabase. If the network is absent, the answer waits in a queue and is sent the next time the site opens with signal. Signing in on a second device pulls the full record down. Two devices used within the same minute reconcile by keeping both sets of answers; nothing is overwritten.

## Data kept per person

- Profile: name, PIN hash, share token, household, settings (tracks, daily size, email address if opted in).
- Every answer: step, track, correct or not, which option was chosen, when. The chosen option is what makes the tutor view diagnostic.
- Per step: mastery level, next review date, current interval.
- Derived, not stored: streak, freezes, points, level, personal bests, calendar.

## Gamification, as specified

- **Mastery map:** the steps of each track as a path, lit as mastered, dimmed when due for review.
- **Personal bests:** fastest correct answer per step, longest run of correct answers, best accuracy on a step.
- **Points and levels:** points per correct answer, weighted by step difficulty, bonus for a review answered correctly, none deducted for mistakes.
- **Calendar:** one square per day, darker for more questions. Never shows a red square for a missed day.
- **Streak with freezes:** one freeze earned per five days practised, up to three banked.
- **Household:** members see each other's step, streak, questions this week and weakest topic, as a table rather than a ranking. A small household total (questions, days practised, steps mastered this week) sits below it. Nothing nudges anyone to do anything about anyone else's results. An earlier "explain it to them" mechanic was considered and dropped.

## Content model

Each track is a data file listing its steps in order. A step has: name, curriculum code, its prerequisite step, a generator for fresh problems at three difficulty levels, and the prose for its rule card (rule, memory tip, trap) and its real-life connections. Generators are code; the prose is a separate content file.

Tracks at launch:

- **Calculus and Vectors** (MCV4U): the fourteen steps that exist, extended to roughly twenty to cover curve sketching, optimization and planes.
- **Advanced Functions** (MHF4U): logarithms, radians, compound angles, factor theorem, inequalities. Built second.
- **Grade 11 Functions** (MCR3U): rational expressions, radicals, transformations, trig ratios. Built third.

A person can subscribe to any combination. The daily lesson draws from all their tracks.

## Build order

**Phase 1, no accounts needed.** The site in this repository: installable, offline, all gamification, spaced review, multiple tracks, the daily lesson shown on the site with its practical section, missed lessons kept open, the safety net (worked first example, easy versions, step-back to the prerequisite). Single-device only until phase 2. The owner turns on GitHub Pages in the repository settings, which takes under a minute.

**Phase 2, needs a Supabase account.** Profiles, PIN, sync across devices, share links, households.

**Phase 3, needs a Gmail app password.** The daily email.

Phase 1 alone delivers most of the daily value for one person. Phases 2 and 3 are what make it shareable and what make it come to you.

## What the owner has to do

1. Repository settings, Pages, choose the branch and folder I name. One minute.
2. Create a free Supabase account and project, then paste two keys where I say. Ten minutes.
3. Create a Gmail app password and paste it into the repository's secrets. Five minutes.

Nothing else. Everything else is written and tested here.
