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
| `js/notes.js` | "Where this shows up": eight real places each step's idea appears, about half money and half the rest of life. One follows every question. The easiest file to add to. |
| `js/generators-context.js` | Questions set in real situations, two or three scenarios per step with fresh numbers each time. Mixed in from Hard up, and used as the real-life item on most lessons. |
| `js/generators-modes.js` | Expert and Master: spot the error and work backwards for all 24 steps, and the dispatcher that mixes them in. |
| `js/engine.js` | Saving, spaced review, the daily lesson, the safety net, streaks, freezes, points |
| `js/app.js` | The screens |
| `js/config.js` | The two Supabase values that connect the site to its shared record |
| `js/sync.js` | Sign-in, push and pull, merging two devices' records, households, sharing |
| `share.html` | The read-only progress page a share link opens |
| `sw.js`, `manifest.webmanifest`, `icon.svg` | Offline support and the home-screen install |
| `data/live.json` | The real numbers, written each morning by the workflow in `.github/workflows/daily-data.yml` |

## Checks

`node tools/verify.js` builds every problem at every tier thousands of times and checks that the marked answer is right, that no wrong option is secretly also right, and that every wrong option explains the mistake. It also runs every real-life calculation against three sets of data. For spot the error it checks that exactly one line is false and the rest follow from the lines above; for work backwards, that the condition holds for the right option only. Run it after any change to a generator or a practical builder.

`node tools/fetch-live.js` fetches the live numbers by hand.

`DRY_RUN=1 node tools/send-daily.js` renders the morning email to `data/email-preview.html` without sending.

## Not yet

The Advanced Functions and Grade 11 tracks. Lockout after repeated wrong PINs.
