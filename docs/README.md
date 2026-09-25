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
| `js/generators.js` | The code that invents fresh problems, three difficulty tiers per step. Verified by `tools/verify.js`. |
| `js/engine.js` | Saving, spaced review, the daily lesson, the safety net, streaks, freezes, points |
| `js/app.js` | The screens |
| `js/config.js` | The two Supabase values that connect the site to its shared record |
| `js/sync.js` | Sign-in, push and pull, merging two devices' records, households, sharing |
| `share.html` | The read-only progress page a share link opens |
| `sw.js`, `manifest.webmanifest`, `icon.svg` | Offline support and the home-screen install |
| `data/live.json` | The real numbers, written each morning by the workflow in `.github/workflows/daily-data.yml` |

## Checks

`node tools/verify.js` builds every problem at every tier thousands of times and checks that the marked answer is right, that no wrong option is secretly also right, and that every wrong option explains the mistake. It also runs every real-life calculation against three sets of data. Run it after any change to `generators.js` or the practical builders in `content.js`.

`node tools/fetch-live.js` fetches the live numbers by hand.

`DRY_RUN=1 node tools/send-daily.js` renders the morning email to `data/email-preview.html` without sending.

## Not yet

The Advanced Functions and Grade 11 tracks. Lockout after repeated wrong PINs.
