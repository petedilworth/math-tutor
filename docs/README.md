# Chalk and Paper – the site

A daily maths lesson, built to the Ontario MCV4U expectations. Setup for each phase is in `SETUP.md`.

## Turn it on

Repository → Settings → Pages → Source: *Deploy from a branch* → Branch: this branch, folder `/docs` → Save. The site appears at `https://<owner>.github.io/<repo>/` within a minute or two.

On a phone, open that address, use the browser's share or menu button, and choose *Add to Home Screen*. It then opens full-screen and works without signal.

## What is here

| File | What it is |
|---|---|
| `index.html`, `app.css` | The page and its look |
| `js/content.js` | Everything a person reads: tracks, steps, rule cards, the real-life calculations, the why-questions. The file to reword. |
| `js/generators.js` | The code that invents fresh problems, the forward problems at tiers 1 to 3 (Easy, Medium, Hard) for the first 14 steps. Verified by `tools/verify.js`. |
| `js/content-more.js` | Ten more MCV4U steps (first principles through distance to a plane), the five tier names, and the full 24-step order. |
| `js/generators-more.js` | Forward problems for those ten steps. |
| `js/content-full.js` | Twelve steps that complete the course (limits, roots and powers, rational and radical, ln and eˣ, graphs of f′, sketching, bearings, vector laws, 2D lines, plane forms, planes meeting, skew lines), the seven units, and the 36-step order. |
| `js/graphs.js` | Drawn graphs. Questions store a short spec such as `p:0,-3,0,1`; this file draws it as an SVG when it reaches the screen. |
| `js/generators-full.js` | Every kind of question for the twelve new steps. |
| `js/notes-kit.js` | Shared helpers for the notes (number formats, live-data names) and `CP.workNote`, which runs a note against today's live data. |
| `js/notes/*.js` | "Where this shows up": eight worked calculations per step, at least three on money and three on the rest of life. Each note has a setup, 3 to 5 lines of working, and one takeaway. Every number comes from code, and notes marked `live` use Bank of Canada figures. One follows every question. Check with `node tools/check-notes.js` (add `--print stepId` to read a step's notes as text). |
| `js/generators-context.js` | Questions set in real situations, two or three scenarios per step with fresh numbers each time. Mixed in from Hard up, and used as the real-life item on most lessons. |
| `js/generators-modes.js` | Expert and Master: spot the error and work backwards for all 24 steps, and the dispatcher that mixes them in. |
| `js/engine.js` | Saving, spaced review, the daily lesson, the safety net, streaks, freezes, points |
| `js/app.js` | The screens |
| `js/config.js` | The two Supabase values that connect the site to its shared record |
| `js/sync.js` | Sign-in, push and pull, merging two devices' records, households, sharing |
| `lesson.html`, `js/lesson.js` | The full lessons. `lesson.html#stepId` opens one; `lesson.html` lists all 36. Each lesson has pictures to play with and "try this" challenges that tick off as you go, the rule, why it is true (folded), three worked examples revealed a step at a time, the usual mistakes, three fresh check questions from the generators, a worked real-life note, and teaching notes (a two-minute script, questions to ask, where it goes wrong) behind the **Teaching notes** switch. Opening a lesson and the check score are saved and shown on the share page. |
| `js/widgets.js` | The interactive pictures, plain SVG, finger or mouse: `tracer` (drag along a curve, tangent, slope trace, secant, a slider), `limit`, `blocks` (exponent laws by counting), `area` (product rule), `chain`, `motion`, `optim`, `sign` (sketching from sign charts), `vec2` (add, subtract, scale, components, dot, bearings, lines) and `vec3` (3D scenes you can turn). What each reports is in its `ST` function. |
| `js/lessons/*.js` | The lesson text, one `CP.LESSONS[stepId]` per step. `u3a.js` (sine, cosine and eˣ) is the model. Check with `node tools/check-lessons.js`: it checks the shape and house style, and proves every challenge can be met and is not already met at the start. Add `--print stepId` to read a lesson as text. |
| `share.html` | The read-only progress page a share link opens |
| `sw.js`, `manifest.webmanifest`, `icon.svg` | Offline support and the home-screen install |
| `data/live.json` | The real numbers, written each morning by the workflow in `.github/workflows/daily-data.yml` |

## Checks

`node tools/verify.js` builds every problem at every tier thousands of times and checks that the marked answer is right, that no wrong option is secretly also right, and that every wrong option explains the mistake. It also runs every real-life calculation against three sets of data. For spot the error it checks that exactly one line is false and the rest follow from the lines above; for work backwards, that the condition holds for the right option only. Run it after any change to a generator or a practical builder.

`node tools/fetch-live.js` fetches the live numbers by hand.

`DRY_RUN=1 node tools/send-daily.js` renders the morning email to `data/email-preview.html` without sending.

## Not yet

The Advanced Functions and Grade 11 tracks. Lockout after repeated wrong PINs.
