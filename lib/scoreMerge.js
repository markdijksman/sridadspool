// lib/scoreMerge.js
// Pure, dependency-free WC2026 result-merging logic.
// Mirrors the matching rules from src/scoreSync.js so behaviour is identical,
// but runs server-side (no browser, no fetch). Imported by api/sync-scores.js
// and by the test harness.

// Map WC API team names -> our pool team names (handle any differences).
const TEAM_NAME_MAP = {
  'Czech Republic': 'Czechia',
  'USA': 'United States',
  'United States of America': 'United States',
  'South Korea': 'Korea Republic',
  'Korea': 'Korea Republic',
  'Turkey': 'Türkiye',
  'Turkiye': 'Türkiye',
  'Bosnia': 'Bosnia and Herzegovina',
  'Bosnia-Herzegovina': 'Bosnia and Herzegovina',
  'Bosnia Herzegovina': 'Bosnia and Herzegovina',
  'Curacao': 'Curaçao',
  'Irak': 'Iraq',
  'Congo DR': 'DR Congo',
  'DR Congo': 'DR Congo',
  'Congo-Kinshasa': 'DR Congo',
  "Cote d'Ivoire": 'Ivory Coast',
  "Côte d'Ivoire": 'Ivory Coast',
  'Cabo Verde': 'Cape Verde',
  'IR Iran': 'Iran',
};

// The WC API returns team names as strings, but accept an object shape too,
// just in case ({ name } / { team }).
function normalise(name) {
  if (name == null) return name;
  const s = typeof name === 'object' ? (name.name || name.team || '') : String(name);
  return TEAM_NAME_MAP[s] || s;
}

// Diacritic- and case-insensitive comparison as a safety net.
function canon(name) {
  return String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function sameTeam(a, b) {
  return canon(a) === canon(b);
}

const COMPLETED_STATUSES = new Set(['completed', 'finished', 'ft', 'full_time', 'full-time', 'ended', 'final']);
const COMPLETED_PHASES = new Set(['FT', 'FT_PEN']);

function isCompleted(m) {
  if (m.phase && COMPLETED_PHASES.has(String(m.phase).toUpperCase())) return true;
  if (m.status && COMPLETED_STATUSES.has(String(m.status).toLowerCase())) return true;
  return false;
}

// Extract goals from any plausible shape the API might use.
function extractScore(m) {
  const sc = m.score || m.result || m.ft || null;
  let hg, ag;
  if (sc && typeof sc === 'object') {
    hg = sc.home ?? sc.home_score ?? sc.homeGoals ?? sc[0];
    ag = sc.away ?? sc.away_score ?? sc.awayGoals ?? sc[1];
  }
  if (hg == null) hg = m.home_score ?? m.score_home ?? m.home_goals ?? m.homeGoals;
  if (ag == null) ag = m.away_score ?? m.score_away ?? m.away_goals ?? m.awayGoals;
  if (hg == null || ag == null) return null;
  if (isNaN(parseInt(hg)) || isNaN(parseInt(ag))) return null;
  return { homeGoals: String(parseInt(hg)), awayGoals: String(parseInt(ag)) };
}

// Merge completed API results into the pool state's group `matches`.
// Returns { state, changed }. Only group-stage matches are auto-updated
// (knockout results are entered by hand, since the bracket teams are
// prediction-derived). Returns the SAME state object if nothing changed.
function mergeApiResults(state, apiMatches) {
  if (!apiMatches || apiMatches.length === 0) return { state, changed: false };

  let changed = false;
  let matches = state.matches.slice();

  for (const am of apiMatches) {
    if (!isCompleted(am)) continue;

    const score = extractScore(am);
    if (!score) continue;

    const apiHome = normalise(am.home_team || am.team1 || am.home);
    const apiAway = normalise(am.away_team || am.team2 || am.away);
    if (!apiHome || !apiAway) continue;

    const idx = matches.findIndex(m => sameTeam(m.home, apiHome) && sameTeam(m.away, apiAway));
    if (idx === -1) continue; // not a group match we track (e.g. knockout) — skip

    const existing = matches[idx].result;
    if (!existing ||
        existing.homeGoals !== score.homeGoals ||
        existing.awayGoals !== score.awayGoals) {
      matches = matches.map((m, i) => (i === idx ? { ...m, result: { ...score, autoUpdated: true } } : m));
      changed = true;
    }
  }

  return { state: changed ? { ...state, matches } : state, changed };
}

module.exports = { normalise, canon, sameTeam, isCompleted, extractScore, mergeApiResults };
