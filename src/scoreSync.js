// ─── WC2026 API SCORE SYNC ────────────────────────────────────────────────────
// Fetches official results from api.wc2026api.com and merges them into the pool

const WC_API_KEY = process.env.REACT_APP_WC_API_KEY;
const WC_API_BASE = "https://api.wc2026api.com";

// Map WC API team names → our team names (handle any differences)
const TEAM_NAME_MAP = {
  "Czech Republic": "Czechia",
  "USA": "United States",
  "South Korea": "Korea Republic",
  "Turkey": "Türkiye",
  "Ivory Coast": "Ivory Coast",
  "DR Congo": "DR Congo",
  "Bosnia": "Bosnia and Herzegovina",
  "Bosnia-Herzegovina": "Bosnia and Herzegovina",
  "Cape Verde": "Cape Verde",
  "Curacao": "Curaçao",
};

function normalise(name) {
  return TEAM_NAME_MAP[name] || name;
}

// Fetch all completed matches from the WC2026 API
export async function fetchCompletedMatches() {
  if (!WC_API_KEY) {
    console.warn("No WC API key set — skipping auto-sync");
    return [];
  }
  try {
    const res = await fetch(`${WC_API_BASE}/matches?status=completed`, {
      headers: { Authorization: `Bearer ${WC_API_KEY}` },
    });
    if (!res.ok) throw new Error(`WC API error: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : (data.matches || data.data || []);
  } catch (e) {
    console.error("WC API fetch failed:", e);
    return [];
  }
}

// Fetch live/in-progress matches
export async function fetchLiveMatches() {
  if (!WC_API_KEY) return [];
  try {
    const res = await fetch(`${WC_API_BASE}/matches?status=live`, {
      headers: { Authorization: `Bearer ${WC_API_KEY}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.matches || data.data || []);
  } catch { return []; }
}

// Merge API results into our pool state
// Returns updated state (or same state if nothing changed)
export function mergeApiResults(currentState, apiMatches) {
  if (!apiMatches || apiMatches.length === 0) return { state: currentState, changed: false };

  let changed = false;
  let newMatches = [...currentState.matches];

  apiMatches.forEach(apiMatch => {
    // Only process matches with a final score
    const score = apiMatch.score || apiMatch.result || apiMatch.ft;
    if (!score) return;

    const homeGoals = score.home ?? score[0] ?? score.home_score;
    const awayGoals = score.away ?? score[1] ?? score.away_score;
    if (homeGoals === undefined || homeGoals === null) return;
    if (awayGoals === undefined || awayGoals === null) return;

    const apiHome = normalise(apiMatch.home_team || apiMatch.team1 || apiMatch.home);
    const apiAway = normalise(apiMatch.away_team || apiMatch.team2 || apiMatch.away);

    // Find matching match in our state
    const idx = newMatches.findIndex(m =>
      m.home === apiHome && m.away === apiAway
    );

    if (idx === -1) return; // no match found

    const existing = newMatches[idx].result;
    const newResult = {
      homeGoals: String(homeGoals),
      awayGoals: String(awayGoals),
      autoUpdated: true,
    };

    // Only update if result changed or not set
    if (!existing ||
        existing.homeGoals !== newResult.homeGoals ||
        existing.awayGoals !== newResult.awayGoals) {
      newMatches = newMatches.map((m, i) =>
        i === idx ? { ...m, result: newResult } : m
      );
      changed = true;
      console.log(`✅ Score synced: ${apiHome} ${homeGoals}–${awayGoals} ${apiAway}`);
    }
  });

  return {
    state: changed ? { ...currentState, matches: newMatches } : currentState,
    changed,
  };
}

// Poll interval: 5 min normally, 1 min if there's a live match
export function getPollInterval(liveMatches) {
  return liveMatches.length > 0 ? 60_000 : 5 * 60_000;
}
