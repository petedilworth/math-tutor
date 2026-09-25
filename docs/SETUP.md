# Setting up Chalk and Paper

Three switches, in order. Each one takes a few minutes and each one works on its own.

## 1. The site (one minute)

GitHub → this repository → **Settings → Pages**. Source: *Deploy from a branch*. Branch: `claude/cool-brown-nva5c2`, folder `/docs`. Save.

A minute later the site is at `https://petedilworth.github.io/math-tutor/`. Open it on your phone, share or menu button, *Add to Home Screen*.

At this point the app works fully on one device. Sign-in, households and sharing show a note saying they need step 2.

## 2. The shared record: Supabase (ten minutes)

This gives everyone a profile, makes progress follow you between devices, and turns on households and the read-only share link.

1. Go to supabase.com, sign up (free), and create a project. Any name, any region near you. Wait for it to finish setting up.
2. Left sidebar → **SQL Editor** → New query. Paste the whole of `supabase/schema.sql` from this repository and click Run. It should say "Success".
3. Still in the SQL editor, set your invite code:
   ```sql
   update cp_settings set value = 'YOUR-CODE-HERE' where key = 'invite_code';
   ```
   This is what a new person types once to make a profile. Change it any time.
4. Left sidebar → **Project Settings → API**. Copy two things: the **Project URL** and the **anon public** key.
5. Open `docs/js/config.js` in this repository (on GitHub, click the file, then the pencil) and paste them in:
   ```js
   supabaseUrl: "https://xxxx.supabase.co",
   supabaseAnonKey: "eyJ...",
   ```
   Commit. The site picks it up within a minute.

The anon key is safe to publish. It can only call the `cp_*` functions, each of which checks the name and PIN first, and nothing else.

To check: open the site, go to **Me**, sign in with a name, a PIN, and your invite code. Then open the site on another device and sign in with the same name and PIN. The progress should be there.

## 3. The morning email: Gmail (five minutes)

The site sends through your own Gmail account, so there is no email service to sign up for.

1. In your Google account, turn on 2-step verification if it is not already on, then go to **Security → App passwords** and create one. Name it anything. Google shows a 16-character password once. Copy it.
2. In Supabase, **Project Settings → API**, copy the **service_role** key. This one is secret: it bypasses every check. It goes only into GitHub's secrets, never into the site.
3. GitHub → this repository → **Settings → Secrets and variables → Actions**. Add four secrets:
   - `SUPABASE_URL`: the project URL from step 2
   - `SUPABASE_SERVICE_KEY`: the service_role key
   - `GMAIL_USER`: your Gmail address
   - `GMAIL_APP_PASSWORD`: the 16-character app password
   And under **Variables**, one variable:
   - `SITE_URL`: `https://petedilworth.github.io/math-tutor`
4. Anyone who wants the email goes to **Me** on the site, signs in, enters their address, and ticks the box.

The email job runs at 7 am Toronto time. **Scheduled jobs only run on the repository's default branch.** Until this branch is merged into it, or made the default (Settings → General → Default branch), run the jobs by hand from the **Actions** tab: first *Daily live data*, then *Daily email*.

To try it without sending anything: `DRY_RUN=1 node tools/send-daily.js` writes a preview to `docs/data/email-preview.html`.

## Where things live

| What | Where |
|---|---|
| A person's progress | Supabase, table `cp_progress`, one JSON record per profile. Also on each device they use. |
| Names and PINs | Supabase, table `cp_profiles`. PINs are stored hashed. |
| Who gets the email | `cp_profiles.email_opt_in` |
| The invite code | `cp_settings`, key `invite_code` |
| Today's real numbers | `docs/data/live.json`, rewritten each morning |

## Honest limits

Name and PIN is friends-and-family security. It keeps people out of each other's progress. It does not stop someone who knows a PIN, and there is no lockout after wrong guesses. Nothing is listed publicly, households need the code, and share links are long random strings that are off by default.

Free tiers: Supabase pauses a project after a week with no activity; the daily job counts as activity. Gmail allows 500 messages a day.
