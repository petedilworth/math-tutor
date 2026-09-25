/* Chalk and Paper – sync
   Keeps the local record and the shared one in step. Every answer is saved locally first; a push
   follows a moment later, or the next time the site is open with signal. Signing in on another device
   pulls the record down and merges it with whatever that device already had. */

window.CP = window.CP || {};
(function () {
const CFG = window.CP_CONFIG || {};
const AUTH_KEY = "chalk-paper-auth-v1";
CP.sync = { enabled: !!(CFG.supabaseUrl && CFG.supabaseAnonKey), auth: null, profile: null, dirty: false, lastPush: null, status: "off" };
try { CP.sync.auth = JSON.parse(localStorage.getItem(AUTH_KEY) || "null"); } catch (e) {}
const saveAuth = () => { try { if (CP.sync.auth) localStorage.setItem(AUTH_KEY, JSON.stringify(CP.sync.auth)); else localStorage.removeItem(AUTH_KEY); } catch (e) {} };

async function rpc(fn, args) {
  const r = await fetch(CFG.supabaseUrl.replace(/\/$/, "") + "/rest/v1/rpc/" + fn, {
    method: "POST", headers: { "content-type": "application/json", "apikey": CFG.supabaseAnonKey, "authorization": "Bearer " + CFG.supabaseAnonKey },
    body: JSON.stringify(args)
  });
  const text = await r.text();
  let j = null; try { j = JSON.parse(text); } catch (e) {}
  if (!r.ok) { const msg = (j && (j.message || j.hint)) || text || ("HTTP " + r.status); const code = /NO_PROFILE|BAD_PIN|BAD_INVITE|BAD_INPUT|NO_HOUSEHOLD|NO_SHARE|TOO_BIG/.exec(msg); throw new Error(code ? code[0] : msg); }
  return j;
}
CP.sync.rpc = rpc;
CP.sync.errorText = e => ({
  NO_PROFILE: "No profile with that name. To make one, add the invite code.",
  BAD_PIN: "That PIN does not match.",
  BAD_INVITE: "That invite code is not right.",
  BAD_INPUT: "Name needs two letters and the PIN four digits.",
  NO_HOUSEHOLD: "No household with that code.",
  NO_SHARE: "That link is not being shared any more.",
  TOO_BIG: "The record is too large to save."
}[e.message] || "Could not reach the server. Your progress is safe on this device and will sync later.");

/* ---------- merge two records: keep everything either side did ---------- */
CP.sync.merge = function (a, b) {
  if (!a || !a.v) return b; if (!b || !b.v) return a;
  const out = JSON.parse(JSON.stringify(a));
  /* answers: union by timestamp */
  const seen = new Set((out.answers || []).map(x => x.t));
  for (const x of (b.answers || [])) if (!seen.has(x.t)) { out.answers.push(x); seen.add(x.t); }
  out.answers.sort((x, y) => x.t - y.t); if (out.answers.length > 2000) out.answers = out.answers.slice(-2000);
  /* days: take the larger count each day */
  out.days = out.days || {};
  for (const d in (b.days || {})) { const x = out.days[d] || { q: 0, right: 0 }; out.days[d] = { q: Math.max(x.q, b.days[d].q), right: Math.max(x.right, b.days[d].right) }; }
  /* steps: per step, the side with more attempts wins; mastered sticks */
  out.steps = out.steps || {};
  for (const id in (b.steps || {})) { const x = out.steps[id], y = b.steps[id]; if (!x || (y.attempts || 0) > (x.attempts || 0)) out.steps[id] = y; if (x && y.mastered) out.steps[id].mastered = true; }
  /* lessons: per date, the one with more answers */
  out.lessons = out.lessons || {};
  for (const d in (b.lessons || {})) { const x = out.lessons[d], y = b.lessons[d]; if (!x || (y.answers || []).length > (x.answers || []).length) out.lessons[d] = y; }
  out.points = Math.max(out.points || 0, b.points || 0);
  out.freezes = Math.max(out.freezes || 0, b.freezes || 0);
  out.freezeEarnedAt = Math.max(out.freezeEarnedAt || 0, b.freezeEarnedAt || 0);
  out.bestRun = Math.max(out.bestRun || 0, b.bestRun || 0);
  out.frozen = Object.assign({}, b.frozen || {}, out.frozen || {});
  out.lastActive = [out.lastActive, b.lastActive].filter(Boolean).sort().pop() || null;
  out.easeUntil = [out.easeUntil, b.easeUntil].filter(Boolean).sort().pop() || null;
  out.profile = Object.assign({}, b.profile || {}, out.profile || {});
  return out;
};

/* ---------- sign in / out ---------- */
CP.sync.signIn = async function (name, pin, invite) {
  const r = await rpc("cp_signin", { p_name: name, p_pin: pin, p_invite: invite || null });
  CP.sync.auth = { name: r.profile.name, pin }; saveAuth();
  CP.sync.profile = r.profile;
  CP.sync.applyRemote(r.state, r.profile);
  await CP.sync.push(true);
  CP.sync.status = "ok";
  return r.profile;
};
CP.sync.signOut = function () { CP.sync.auth = null; CP.sync.profile = null; saveAuth(); CP.sync.status = "off"; };
CP.sync.signedIn = () => !!(CP.sync.enabled && CP.sync.auth);

CP.sync.applyRemote = function (remoteState, profile) {
  const merged = CP.sync.merge(CP.state(), remoteState);
  const p = merged.profile || {};
  if (profile) { p.name = p.name || profile.name; if (profile.lessonSize) p.size = profile.lessonSize; if (profile.email) p.email = profile.email; p.emailOptIn = !!profile.emailOptIn; if (profile.tracks && profile.tracks.length) p.tracks = profile.tracks; }
  merged.profile = p;
  CP.replaceState(merged);
};

/* ---------- push / pull ---------- */
let pushTimer = null;
CP.sync.push = async function (now) {
  if (!CP.sync.signedIn()) return;
  CP.sync.dirty = true;
  if (!now) { clearTimeout(pushTimer); pushTimer = setTimeout(() => CP.sync.push(true), 1500); return; }
  clearTimeout(pushTimer);
  if (!navigator.onLine) { CP.sync.status = "offline"; return; }
  try {
    const p = CP.state().profile;
    const r = await rpc("cp_push", { p_name: CP.sync.auth.name, p_pin: CP.sync.auth.pin, p_state: CP.state(),
      p_settings: { email: p.email || null, emailOptIn: !!p.emailOptIn, lessonSize: p.size, tracks: p.tracks, shareOn: CP.sync.profile ? !!CP.sync.profile.shareOn : false } });
    CP.sync.profile = r.profile; CP.sync.dirty = false; CP.sync.lastPush = Date.now(); CP.sync.status = "ok";
  } catch (e) { CP.sync.status = e.message === "BAD_PIN" || e.message === "NO_PROFILE" ? "auth" : "offline"; }
  if (CP.sync.onChange) CP.sync.onChange();
};
CP.sync.pull = async function () {
  if (!CP.sync.signedIn()) return;
  try {
    const r = await rpc("cp_pull", { p_name: CP.sync.auth.name, p_pin: CP.sync.auth.pin });
    CP.sync.profile = r.profile; CP.sync.applyRemote(r.state, r.profile); CP.sync.status = "ok";
    if (CP.sync.dirty) await CP.sync.push(true);
  } catch (e) { CP.sync.status = e.message === "BAD_PIN" || e.message === "NO_PROFILE" ? "auth" : "offline"; }
  if (CP.sync.onChange) CP.sync.onChange();
};
CP.sync.setShare = async function (on) {
  if (!CP.sync.signedIn()) return;
  CP.sync.profile.shareOn = on; await CP.sync.push(true);
};
CP.sync.shareUrl = () => CP.sync.profile && CP.sync.profile.shareToken ? location.href.replace(/index\.html.*$|#.*$/, "").replace(/\/?$/, "/") + "share.html?t=" + CP.sync.profile.shareToken : null;

/* households */
CP.sync.household = () => rpc("cp_household", { p_name: CP.sync.auth.name, p_pin: CP.sync.auth.pin });
CP.sync.householdCreate = n => rpc("cp_household_create", { p_name: CP.sync.auth.name, p_pin: CP.sync.auth.pin, p_hname: n });
CP.sync.householdJoin = c => rpc("cp_household_join", { p_name: CP.sync.auth.name, p_pin: CP.sync.auth.pin, p_code: c });
CP.sync.householdLeave = () => rpc("cp_household_leave", { p_name: CP.sync.auth.name, p_pin: CP.sync.auth.pin });
CP.sync.changePin = n => rpc("cp_change_pin", { p_name: CP.sync.auth.name, p_pin: CP.sync.auth.pin, p_new_pin: n }).then(() => { CP.sync.auth.pin = n; saveAuth(); });

/* every local save schedules a push; coming back online pushes at once */
CP.afterSave = () => { if (CP.sync.signedIn()) CP.sync.push(false); };
window.addEventListener("online", () => { if (CP.sync.signedIn() && CP.sync.dirty) CP.sync.push(true); });
})();
