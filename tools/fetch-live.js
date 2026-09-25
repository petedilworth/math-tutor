/* Fetches the real numbers the daily lesson uses and writes docs/data/live.json.
   Sources, both free and keyless:
     Bank of Canada Valet API  https://www.bankofcanada.ca/valet/docs
     Open-Meteo                https://open-meteo.com/
   Any series that fails keeps the previous value (or the fallback) and is reported; the site treats
   data older than four days as absent and says "fixed example" instead of "live".
   Run: node tools/fetch-live.js   (Node 18+, uses global fetch) */
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "..", "docs", "data", "live.json");
const LAT = process.env.CP_LAT || "43.65", LON = process.env.CP_LON || "-79.38"; /* Toronto by default */

/* Valet series names. FX ones are stable; check the others against the Valet series list if a value looks wrong. */
const SERIES = {
  usdcad: "FXUSDCAD", eurcad: "FXEURCAD", gbpcad: "FXGBPCAD",
  bond5: "BD.CDN.5YR.DQ.YLD", bond10: "BD.CDN.10YR.DQ.YLD",
  policy: "V39079"
};

async function valet(names, recent) {
  const url = "https://www.bankofcanada.ca/valet/observations/" + names.join(",") + "/json?recent=" + recent;
  const r = await fetch(url, { headers: { "accept": "application/json" } });
  if (!r.ok) throw new Error("valet " + r.status + " for " + names.join(","));
  return (await r.json()).observations || [];
}
function lastValue(obs, name) {
  for (let i = obs.length - 1; i >= 0; i--) { const o = obs[i][name]; if (o && o.v !== undefined && o.v !== null && o.v !== "") return Number(o.v); }
  return null;
}
function valueNearestDaysAgo(obs, name, days) {
  const target = Date.now() - days * 86400000; let best = null;
  for (const o of obs) { if (!o[name] || o[name].v === "" || o[name].v == null) continue; const t = Date.parse(o.d); if (best === null || Math.abs(t - target) < Math.abs(best.t - target)) best = { t, v: Number(o[name].v) }; }
  return best ? best.v : null;
}

(async () => {
  let prev = {};
  try { prev = JSON.parse(fs.readFileSync(OUT, "utf8")); } catch (e) {}
  const out = Object.assign({}, prev, { asOf: new Date().toISOString().slice(0, 10), notes: [] });
  try {
    const fxObs = await valet([SERIES.usdcad, SERIES.eurcad, SERIES.gbpcad], 45);
    for (const k of ["usdcad", "eurcad", "gbpcad"]) { const v = lastValue(fxObs, SERIES[k]); if (v) out[k] = v; else out.notes.push(k + " missing"); }
    const v30 = valueNearestDaysAgo(fxObs, SERIES.usdcad, 30); if (v30) out.usdcad30 = v30; else out.notes.push("usdcad30 missing");
  } catch (e) { out.notes.push("fx: " + e.message); }
  for (const k of ["bond5", "bond10", "policy"]) {
    try { const obs = await valet([SERIES[k]], 10); const v = lastValue(obs, SERIES[k]); if (v !== null) out[k] = v; else out.notes.push(k + " missing"); }
    catch (e) { out.notes.push(k + ": " + e.message); }
  }
  try {
    const u = "https://api.open-meteo.com/v1/forecast?latitude=" + LAT + "&longitude=" + LON + "&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&hourly=temperature_2m&timezone=America%2FToronto&forecast_days=1";
    const r = await fetch(u); if (!r.ok) throw new Error("open-meteo " + r.status);
    const j = await r.json();
    const noonIx = (j.hourly.time || []).findIndex(t => t.endsWith("T12:00"));
    out.temp = { noon: noonIx >= 0 ? j.hourly.temperature_2m[noonIx] : null, max: j.daily.temperature_2m_max[0], min: j.daily.temperature_2m_min[0],
                 sunrise: (j.daily.sunrise[0] || "").slice(11, 16), sunset: (j.daily.sunset[0] || "").slice(11, 16) };
  } catch (e) { out.notes.push("weather: " + e.message); }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log("wrote", OUT, out.notes.length ? "with notes: " + out.notes.join("; ") : "cleanly");
})().catch(e => { console.error(e); process.exit(1); });
