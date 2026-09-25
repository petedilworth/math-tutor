/* Sends the morning email to everyone who opted in.
   For each subscribed profile it loads their record, works out today's step and the real-life number,
   and sends one email through Gmail. Runs from .github/workflows/daily-email.yml.
   Needs: SUPABASE_URL, SUPABASE_SERVICE_KEY, GMAIL_USER, GMAIL_APP_PASSWORD, SITE_URL.
   Dry run without sending: DRY_RUN=1 node tools/send-daily.js */
const fs = require("fs"), path = require("path"), vm = require("vm");
const nodemailer = require("nodemailer");

const env = k => { const v = process.env[k]; if (!v && !process.env.DRY_RUN) throw new Error("missing " + k); return v || ""; };
const SUPABASE_URL = env("SUPABASE_URL"), SERVICE = env("SUPABASE_SERVICE_KEY"), SITE = (process.env.SITE_URL || "").replace(/\/$/, "");

/* load the site's own content and engine so the email matches what the site will show */
const docs = path.join(__dirname, "..", "docs", "js");
const ctx = { window: {}, Math, Number, String, Array, Object, Set, Error, console, Date, JSON, localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} } };
ctx.window.CP = {}; ctx.CP = ctx.window.CP;
vm.createContext(ctx);
for (const f of ["content.js", "generators.js", "engine.js"]) vm.runInContext(fs.readFileSync(path.join(docs, f), "utf8"), ctx, { filename: f });
const CP = ctx.window.CP;
let live = {}; try { live = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "docs", "data", "live.json"), "utf8")); } catch (e) {}
const liveFresh = live.asOf && (Date.now() - Date.parse(live.asOf)) / 86400000 <= 4;
const L = Object.assign({}, CP.LIVE_FALLBACK, liveFresh ? live : {});

const M = "−", esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

async function subscribers() {
  const r = await fetch(SUPABASE_URL + "/rest/v1/cp_profiles?select=name,email,lesson_size,tracks,cp_progress(state)&email_opt_in=eq.true&email=not.is.null",
    { headers: { apikey: SERVICE, authorization: "Bearer " + SERVICE } });
  if (!r.ok) throw new Error("supabase " + r.status + " " + await r.text());
  return r.json();
}

function lessonFor(profile) {
  const state = (profile.cp_progress && (Array.isArray(profile.cp_progress) ? profile.cp_progress[0] : profile.cp_progress) || {}).state || {};
  CP.replaceState(Object.assign({ v: 1 }, state));
  const step = CP.currentStep((profile.tracks && profile.tracks[0]) || "mcv4u");
  const pr = step.practical.build(L);
  const streak = CP.streak();
  const due = CP.trackSteps("mcv4u").filter(s => s.id !== step.id && CP.due(s.id)).length;
  const open = CP.openLessons().length;
  return { step, pr, streak, due, open, size: profile.lesson_size || 5, live: liveFresh && !!step.practical.live };
}

function html(name, l) {
  const first = name.charAt(0).toUpperCase() + name.slice(1);
  const lines = l.pr.lines.map(x => '<tr><td style="padding:3px 12px 3px 0;color:#51575F">' + x[0] + '</td><td style="padding:3px 12px 3px 0">' + x[1] + '</td><td style="padding:3px 0;color:#3A6627">' + (x[2] || "") + '</td></tr>').join("");
  return '<!doctype html><html><body style="margin:0;background:#ffffff;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#16191D">' +
    '<div style="max-width:600px;margin:0 auto;padding:24px 20px">' +
    '<p style="font-family:Georgia,serif;font-size:17px;line-height:1.5;color:#51575F;margin:0 0 18px">Morning' + (first ? ", " + esc(first) : "") + '. ' + l.size + ' questions' + (l.due ? ", " + l.due + " quick look" + (l.due > 1 ? "s" : "") + " back" : "") + ', and one with real numbers.</p>' +
    '<div style="border:1px solid #DBDBD4;border-left:3px solid #0B6E68;padding:16px 18px;margin:0 0 18px">' +
    '<p style="font-family:monospace;font-size:10.5px;letter-spacing:.11em;text-transform:uppercase;color:#0B6E68;margin:0 0 6px">Today’s rule</p>' +
    '<p style="font-family:Georgia,serif;font-size:21px;font-weight:600;margin:0 0 6px">' + esc(l.step.name) + '</p>' +
    '<p style="font-family:Georgia,serif;font-size:16px;line-height:1.5;margin:0 0 10px">' + l.step.rule.r + '</p>' +
    '<p style="font-size:13.5px;line-height:1.5;color:#51575F;margin:0"><span style="font-family:monospace;font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:#6B4E0E">Memory tip</span> &nbsp;' + l.step.rule.tip + '</p></div>' +
    '<p style="font-family:monospace;font-size:10.5px;letter-spacing:.11em;text-transform:uppercase;color:#0B6E68;margin:0 0 6px">In real life · ' + esc(l.pr.source) + (l.live ? "" : " (fixed example)") + '</p>' +
    '<p style="font-size:14px;line-height:1.6;margin:0 0 10px">' + l.pr.setup + '</p>' +
    '<table style="border-collapse:collapse;font-family:monospace;font-size:12.5px;background:#F4F4F1;padding:10px;margin:0 0 10px"><tbody>' + lines + '</tbody></table>' +
    '<p style="font-size:14px;line-height:1.6;margin:0 0 18px">' + l.pr.answer + ' The lesson asks: ' + l.pr.q + '</p>' +
    '<a href="' + SITE + '/#today" style="display:inline-block;background:#0B6E68;color:#ffffff;text-decoration:none;font-weight:500;font-size:15px;padding:13px 26px">Open today’s lesson</a>' +
    '<p style="font-size:12.5px;color:#51575F;line-height:1.55;margin:18px 0 0">Streak ' + l.streak.days + ', ' + l.streak.freezesBanked + ' freeze' + (l.streak.freezesBanked === 1 ? "" : "s") + ' banked.' + (l.open ? ' ' + l.open + ' lesson' + (l.open > 1 ? "s are" : " is") + ' still waiting if you want them, no rush.' : "") + '</p>' +
    '<p style="font-size:11.5px;color:#6B717A;line-height:1.5;margin:22px 0 0;padding-top:14px;border-top:1px solid #DBDBD4">You get this every morning because you asked to. Change the size or stop it on the Me screen.</p>' +
    '</div></body></html>';
}
function text(name, l) {
  return "Morning" + (name ? ", " + name : "") + ".\n\nToday's rule: " + l.step.name + "\n" + l.step.rule.r.replace(/<[^>]+>/g, "") + "\n\nIn real life (" + l.pr.source + "):\n" + l.pr.setup.replace(/<[^>]+>/g, "") + "\n" +
    l.pr.lines.map(x => "  " + x[0] + ": " + x[1].replace(/<[^>]+>/g, "") + " " + (x[2] || "")).join("\n") + "\n" + l.pr.answer.replace(/<[^>]+>/g, "") + "\n\nOpen today's lesson: " + SITE + "/#today\n";
}

(async () => {
  const subs = process.env.DRY_RUN ? [{ name: "pete", email: "dry-run@example.com", lesson_size: 5, tracks: ["mcv4u"], cp_progress: [{ state: {} }] }] : await subscribers();
  const transport = process.env.DRY_RUN ? null : nodemailer.createTransport({ service: "gmail", auth: { user: env("GMAIL_USER"), pass: env("GMAIL_APP_PASSWORD") } });
  let sent = 0, failed = 0;
  for (const p of subs) {
    try {
      const l = lessonFor(p);
      const subject = "Day " + (Object.keys(CP.state().lessons || {}).length + 1) + " · " + l.step.name + ", and " + l.pr.source.split(",")[0];
      const msg = { from: '"Chalk and Paper" <' + (process.env.GMAIL_USER || "chalk@example.com") + ">", to: p.email, subject, text: text(p.name, l), html: html(p.name, l) };
      if (process.env.DRY_RUN) { fs.writeFileSync(path.join(__dirname, "..", "docs", "data", "email-preview.html"), msg.html); console.log("DRY RUN, wrote docs/data/email-preview.html\nSubject:", subject); }
      else { await transport.sendMail(msg); }
      sent++;
    } catch (e) { failed++; console.error("failed for", p.name, e.message); }
  }
  console.log("sent " + sent + ", failed " + failed);
  if (failed && !sent) process.exit(1);
})().catch(e => { console.error(e); process.exit(1); });
