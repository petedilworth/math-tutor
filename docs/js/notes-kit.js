/* Chalk and Paper – worked "where this shows up" notes: the toolkit
   Every note is a small worked example that computes its own numbers, so the working shown can never
   disagree with the answer. Shape of one note:
     { k: "Finance", t: "Title", live: "bond5" (optional),
       build(L) { return { setup, lines: [[label, calculation, result], …3 to 5], take, source (optional) }; } }
   L is today's live data (Bank of Canada) merged over CP.LIVE_FALLBACK. Notes in docs/js/notes/*.js. */

window.CP = window.CP || {};
CP.NOTES = CP.NOTES || {};
(function () {
const M = "−";
const neg = x => String(x).replace(/-/g, M);
/* number with grouping and fixed decimals: fmt(1234.5, 2) → "1,234.50" */
const fmt = (x, d = 2) => neg(Number(x).toLocaleString("en-CA", { minimumFractionDigits: d, maximumFractionDigits: d }));
/* dollars: money(1234.5) → "$1,234.50", money(-3, 0) → "−$3" */
const money = (x, d = 2) => (x < 0 ? M : "") + "$" + Math.abs(x).toLocaleString("en-CA", { minimumFractionDigits: d, maximumFractionDigits: d });
/* percent from a fraction: pct(0.0525) → "5.25%"; pct(0.05, 1) → "5.0%" */
const pct = (x, d = 2) => fmt(x * 100, d) + "%";
/* a short number without trailing zeros: sig(2.50) → "2.5", sig(3) → "3" */
const sig = (x, d = 4) => neg(String(+Number(x).toFixed(d)));
const sup = s => "<sup>" + neg(s) + "</sup>";
CP.nh = { M, neg, fmt, money, pct, sig, sup };
/* the live sources a note may name */
CP.LIVE_NAMES = {
  policy: L => "Bank of Canada policy rate " + fmt(L.policy) + "%",
  bond5: L => "Government of Canada 5-year bond yield " + fmt(L.bond5) + "%",
  bond10: L => "Government of Canada 10-year bond yield " + fmt(L.bond10) + "%",
  usdcad: L => "USD/CAD " + fmt(L.usdcad, 4) + ", Bank of Canada",
  eurcad: L => "EUR/CAD " + fmt(L.eurcad, 4) + ", Bank of Canada",
  gbpcad: L => "GBP/CAD " + fmt(L.gbpcad, 4) + ", Bank of Canada"
};
/* build one note against today's data */
CP.workNote = function (note) {
  if (!note) return null;
  const L = Object.assign({}, CP.LIVE_FALLBACK, CP.liveData || {});
  const w = note.build(L);
  const isLive = !!(note.live && CP.liveData && CP.liveData[note.live] != null);
  return Object.assign({ k: note.k, t: note.t, live: isLive, source: note.live ? (w.source || CP.LIVE_NAMES[note.live](L)) : null }, w);
};
})();
