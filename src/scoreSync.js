// ─── WC2026 API SCORE SYNC ────────────────────────────────────────────────────
// Fetches official results from api.wc2026api.com and merges them into the pool.
//
// v2 changes:
// - ONE API call per sync cycle (was 2): fetches all matches, derives
//   completed + live locally. Halves request usage.
// - Robust score extraction: handles nested score objects AND flat
//   home_score/away_score fields.
// - Robust completed/live detection via status OR phase (FT, FT_PEN, 1H, ...).
// - Team-name matching: extended map (Irak, Congo DR, ...) + diacritic-
//   insensitive fallback comparison.
// - Removed hardcoded Resend email key (security: client code is public!).
//   Rate-limit warnings surface via the in-app toast (getRateLimitInfo).

const WC_API_KEY = process.env.REACT_APP_WC_API_KEY;
const WC_API_BASE = "https://api.wc2026api.com";

// Map WC API team names → our team names (handle any differences)
const TEAM_NAME_MAP = {
  "Czech Republic": "Czechia",
  "USA": "United States",
  "United States of America": "United States",
  "South Korea": "Korea Republic",
  "Korea": "Korea Republic",
  "Turkey": "Türkiye",
  "Turkiye": "Türkiye",
  "Bosnia": "Bosnia and Herzegovina",
  "Bosnia-Herzegovina": "Bosnia and Herzegovina",
  "Bosnia Herzegovina": "Bosnia and Herzegovina",
  "Curacao": "Curaçao",
  "Irak": "Iraq",
  "Congo DR": "DR Congo",
  "DR Congo": "DR Congo",
  "Congo-Kinshasa": "DR Congo",
  "Cote d'Ivoire": "Ivory Coast",
  "Côte d'Ivoire": "Ivory Coast",
};

function normalise(name) {
  if (!name) return name;
  return TEAM_NAME_MAP[name] || name;
}

// Diacritic-insensitive, case-insensitive comparison as a safety net
// (e.g. "Curacao" vs "Curaçao", "Turkiye" vs "Türkiye")
function canon(name) {
  return String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function sameTeam(a, b) {
  return canon(a) === canon(b);
}

// ── Status / phase detection ─────────────────────────────────────────────────

const COMPLETED_STATUSES = new Set(["completed", "finished", "ft", "full_time", "full-time", "ended", "final"]);
const COMPLETED_PHASES = new Set(["FT", "FT_PEN"]);
const LIVE_PHASES = new Set(["1H", "HT", "2H", "ET1", "ET2", "PEN"]);
const LIVE_STATUSES = new Set(["live", "in_play", "in-play", "playing", "started"]);

function isCompleted(m) {
  if (m.phase && COMPLETED_PHASES.has(String(m.phase).toUpperCase())) return true;
  if (m.status && COMPLETED_STATUSES.has(String(m.status).toLowerCase())) return true;
  return false;
}

function isLive(m) {
  if (m.phase && LIVE_PHASES.has(String(m.phase).toUpperCase())) return true;
  if (m.status && LIVE_STATUSES.has(String(m.status).toLowerCase())) return true;
  return false;
}

// Extract goals from any plausible shape:
//   { score: { home, away } }   { result: {...} }   { ft: [h, a] }
//   { home_score, away_score }  { score_home, score_away }  { home_goals, ... }
function extractScore(m) {
  const sc = m.score || m.result || m.ft || null;
  let hg, ag;
  if (sc && typeof sc === "object") {
    hg = sc.home ?? sc.home_score ?? sc.homeGoals ?? sc[0];
    ag = sc.away ?? sc.away_score ?? sc.awayGoals ?? sc[1];
  }
  if (hg === undefined || hg === null) hg = m.home_score ?? m.score_home ?? m.home_goals ?? m.homeGoals;
  if (ag === undefined || ag === null) ag = m.away_score ?? m.score_away ?? m.away_goals ?? m.awayGoals;
  if (hg === undefined || hg === null || ag === undefined || ag === null) return null;
  if (isNaN(parseInt(hg)) || isNaN(parseInt(ag))) return null;
  return { homeGoals: String(parseInt(hg)), awayGoals: String(parseInt(ag)) };
}

// ── Rate limit tracking ──────────────────────────────────────────────────────

let _rateLimitRemaining = null;
let _rateLimitTotal = null;

export function getRateLimitInfo() {
  return { remaining: _rateLimitRemaining, total: _rateLimitTotal };
}

// ── Fetching ─────────────────────────────────────────────────────────────────
// One real HTTP request per cycle, shared between fetchCompletedMatches and
// fetchLiveMatches via a short-lived cache (App.js calls both back-to-back).

let _cache = { at: 0, matches: null };
const CACHE_MS = 60_000;

async function fetchAllMatches() {
  if (!WC_API_KEY) {
    console.warn("No WC API key set (REACT_APP_WC_API_KEY) — skipping auto-sync");
    return null;
  }
  const now = Date.now();
  if (_cache.matches && now - _cache.at < CACHE_MS) return _cache.matches;

  const res = await fetch(`${WC_API_BASE}/matches`, {
    headers: { Authorization: `Bearer ${WC_API_KEY}` },
  });

  // Track rate limit headers
  const remaining = res.headers.get("X-RateLimit-Remaining") || res.headers.get("x-ratelimit-remaining");
  const total = res.headers.get("X-RateLimit-Limit") || res.headers.get("x-ratelimit-limit");
  if (remaining !== null) _rateLimitRemaining = parseInt(remaining);
  if (total !== null) _rateLimitTotal = parseInt(total);

  if (!res.ok) throw new Error(`WC API error: ${res.status}`);
  const data = await res.json();
  const matches = Array.isArray(data) ? data : (data.matches || data.data || []);
  _cache = { at: now, matches };
  return matches;
}

// Fetch all completed matches (kept API-compatible with App.js)
export async function fetchCompletedMatches() {
  try {
    const all = await fetchAllMatches();
    if (!all) return [];
    return all.filter(m => isCompleted(m) && extractScore(m));
  } catch (e) {
    console.error("WC API fetch failed:", e);
    return [];
  }
}

// Fetch live/in-progress matches (served from the same cached response)
export async function fetchLiveMatches() {
  try {
    const all = await fetchAllMatches();
    if (!all) return [];
    return all.filter(m => isLive(m));
  } catch {
    return [];
  }
}

// ── Merging ──────────────────────────────────────────────────────────────────
// Merge API results into our pool state.
// Returns { state, changed } — same state object if nothing changed.
export function mergeApiResults(currentState, apiMatches) {
  if (!apiMatches || apiMatches.length === 0) return { state: currentState, changed: false };

  let changed = false;
  let newMatches = [...currentState.matches];

  apiMatches.forEach(apiMatch => {
    // Only completed matches produce a final result
    if (!isCompleted(apiMatch)) return;

    const score = extractScore(apiMatch);
    if (!score) return;

    const apiHome = normalise(apiMatch.home_team || apiMatch.team1 || apiMatch.home);
    const apiAway = normalise(apiMatch.away_team || apiMatch.team2 || apiMatch.away);
    if (!apiHome || !apiAway) return;

    // Find matching match in our state (diacritic-insensitive)
    const idx = newMatches.findIndex(m =>
      sameTeam(m.home, apiHome) && sameTeam(m.away, apiAway)
    );
    if (idx === -1) {
      console.warn(`⚠️ No pool match found for API result: ${apiHome} vs ${apiAway}`);
      return;
    }

    const existing = newMatches[idx].result;
    const newResult = { ...score, autoUpdated: true };

    // Only update if result changed or not set
    if (!existing ||
        existing.homeGoals !== newResult.homeGoals ||
        existing.awayGoals !== newResult.awayGoals) {
      newMatches = newMatches.map((m, i) =>
        i === idx ? { ...m, result: newResult } : m
      );
      changed = true;
      console.log(`✅ Score synced: ${apiHome} ${newResult.homeGoals}–${newResult.awayGoals} ${apiAway}`);
    }
  });

  return {
    state: changed ? { ...currentState, matches: newMatches } : currentState,
    changed,
  };
}

// Poll interval: 10 min normally, 3 min if there's a live match
export function getPollInterval(liveMatches) {
  return liveMatches.length > 0 ? 3 * 60_000 : 10 * 60_000;
}
