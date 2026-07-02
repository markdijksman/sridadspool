// api/sync-scores.js
// Server-side WC2026 score sync. SELF-CONTAINED (no ../lib imports).
// Handles BOTH group-stage (matched by team name) and knockout (matched by
// match_number) results. Knockout also captures the penalty-shootout winner
// as result.progresser so the real bracket routes correctly.
//
// Required Vercel env: WC_API_KEY, SYNC_SECRET, REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY

const WC_API_BASE = 'https://api.wc2026api.com';

const TEAM_NAME_MAP = {
  'Czech Republic': 'Czechia', 'USA': 'United States', 'United States of America': 'United States',
  'South Korea': 'Korea Republic', 'Korea': 'Korea Republic', 'Turkey': 'Türkiye', 'Turkiye': 'Türkiye',
  'Bosnia': 'Bosnia and Herzegovina', 'Bosnia-Herzegovina': 'Bosnia and Herzegovina', 'Bosnia Herzegovina': 'Bosnia and Herzegovina',
  'Curacao': 'Curaçao', 'Irak': 'Iraq', 'Congo DR': 'DR Congo', 'DR Congo': 'DR Congo', 'Congo-Kinshasa': 'DR Congo',
  "Cote d'Ivoire": 'Ivory Coast', "Côte d'Ivoire": 'Ivory Coast', 'Cabo Verde': 'Cape Verde', 'IR Iran': 'Iran',
};
function normalise(name) {
  if (name == null) return name;
  const s = typeof name === 'object' ? (name.name || name.team || '') : String(name);
  return TEAM_NAME_MAP[s] || s;
}
function canon(name) {
  return String(name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
function sameTeam(a, b) { return canon(a) === canon(b); }

const COMPLETED_STATUSES = new Set(['completed', 'finished', 'ft', 'full_time', 'full-time', 'ended', 'final']);
const COMPLETED_PHASES = new Set(['FT', 'FT_PEN', 'FT_AET', 'AET']);
function isCompleted(m) {
  if (m.phase && COMPLETED_PHASES.has(String(m.phase).toUpperCase())) return true;
  if (m.status && COMPLETED_STATUSES.has(String(m.status).toLowerCase())) return true;
  return false;
}

// ── group-stage score (matched by team name) ────────────────────────────────
function extractScore(m) {
  let hg = m.home_score ?? m.score_home ?? m.home_goals ?? m.homeGoals;
  let ag = m.away_score ?? m.score_away ?? m.away_goals ?? m.awayGoals;
  if (hg == null || ag == null) return null;
  if (isNaN(parseInt(hg)) || isNaN(parseInt(ag))) return null;
  return { homeGoals: String(parseInt(hg)), awayGoals: String(parseInt(ag)) };
}
function mergeApiResults(state, apiMatches) {
  if (!apiMatches || apiMatches.length === 0) return { state, changed: false };
  let changed = false;
  let matches = state.matches.slice();
  for (const am of apiMatches) {
    // group matches only (match_number 1..72, or no knockout round)
    const mn = am.match_number;
    if (mn != null && mn >= 73) continue;
    if (!isCompleted(am)) continue;
    const score = extractScore(am);
    if (!score) continue;
    const apiHome = normalise(am.home_team || am.team1 || am.home);
    const apiAway = normalise(am.away_team || am.team2 || am.away);
    if (!apiHome || !apiAway) continue;
    const idx = matches.findIndex(m => sameTeam(m.home, apiHome) && sameTeam(m.away, apiAway));
    if (idx === -1) continue;
    const existing = matches[idx].result;
    if (!existing || existing.homeGoals !== score.homeGoals || existing.awayGoals !== score.awayGoals) {
      matches = matches.map((m, i) => (i === idx ? { ...m, result: { ...score, autoUpdated: true } } : m));
      changed = true;
    }
  }
  return { state: changed ? { ...state, matches } : state, changed };
}

// ── knockout results (matched by match_number) ──────────────────────────────
const KO_SLOT_BY_MATCHNUM = {
  73:'r32_1',74:'r32_2',75:'r32_3',76:'r32_4',77:'r32_5',78:'r32_6',79:'r32_7',80:'r32_8',
  81:'r32_9',82:'r32_10',83:'r32_11',84:'r32_12',85:'r32_13',86:'r32_14',87:'r32_15',88:'r32_16',
  89:'r16_1',90:'r16_2',91:'r16_3',92:'r16_4',93:'r16_5',94:'r16_6',95:'r16_7',96:'r16_8',
  97:'qf_1',98:'qf_2',99:'qf_3',100:'qf_4',101:'sf_1',102:'sf_2',103:'bronze',104:'final',
};
function mergeKnockoutResults(state, apiMatches) {
  if (!state.knockoutMatches || !apiMatches || apiMatches.length === 0) return { state, changed: false };
  let changed = false;
  let kms = state.knockoutMatches.slice();
  for (const am of apiMatches) {
    const slot = KO_SLOT_BY_MATCHNUM[am.match_number];
    if (!slot) continue;
    if (!isCompleted(am)) continue;
    const hs = am.home_score, as = am.away_score;
    if (hs == null || as == null || isNaN(parseInt(hs)) || isNaN(parseInt(as))) continue;
    const homeTeam = normalise(am.home_team);
    const awayTeam = normalise(am.away_team);
    // Who progressed: penalties if present, else the higher score
    let progresser = null;
    const hp = am.home_pen, ap = am.away_pen;
    if (hp != null && ap != null && !isNaN(parseInt(hp)) && !isNaN(parseInt(ap))) {
      progresser = parseInt(hp) > parseInt(ap) ? homeTeam : awayTeam;
    } else if (parseInt(hs) !== parseInt(as)) {
      progresser = parseInt(hs) > parseInt(as) ? homeTeam : awayTeam;
    }
    const idx = kms.findIndex(m => m.id === slot);
    if (idx === -1) continue;
    const cur = kms[idx];
    const newResult = { homeGoals: String(parseInt(hs)), awayGoals: String(parseInt(as)), autoUpdated: true };
    if (progresser) newResult.progresser = progresser;
    const curR = cur.result;
    const teamsChanged = (homeTeam && cur.home !== homeTeam) || (awayTeam && cur.away !== awayTeam);
    const resultChanged = !curR || curR.homeGoals !== newResult.homeGoals || curR.awayGoals !== newResult.awayGoals
      || (curR.progresser || null) !== (newResult.progresser || null);
    if (teamsChanged || resultChanged) {
      const updated = { ...cur, result: newResult };
      if (homeTeam) updated.home = homeTeam;
      if (awayTeam) updated.away = awayTeam;
      kms = kms.map((m, i) => (i === idx ? updated : m));
      changed = true;
    }
  }
  return { state: changed ? { ...state, knockoutMatches: kms } : state, changed };
}

module.exports = async (req, res) => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const secret = process.env.SYNC_SECRET;
    const provided = (req.query && req.query.key) || (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!secret || provided !== secret) return res.status(401).json({ error: 'unauthorized' });

    const WC_API_KEY = process.env.WC_API_KEY;
    const SB_URL = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
    const SB_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (!WC_API_KEY) return res.status(500).json({ error: 'WC_API_KEY not set' });
    if (!SB_URL || !SB_KEY) return res.status(500).json({ error: 'Supabase env not set' });

    const supabase = createClient(SB_URL, SB_KEY);
    const apiRes = await fetch(`${WC_API_BASE}/matches`, { headers: { Authorization: `Bearer ${WC_API_KEY}` } });
    const rateLimitRemaining = apiRes.headers.get('x-ratelimit-remaining');
    if (!apiRes.ok) {
      return res.status(502).json({
        error: `WC API responded ${apiRes.status}`,
        hint: (apiRes.status === 401 || apiRes.status === 403) ? 'Key invalid or suspended (daily limit).' : undefined,
        rateLimitRemaining,
      });
    }
    const body = await apiRes.json();
    const apiMatches = Array.isArray(body) ? body : (body.matches || body.data || []);

    const { data: row, error: loadErr } = await supabase.from('pool_state').select('data').eq('id', 'main').single();
    if (loadErr) throw new Error('Supabase load: ' + loadErr.message);
    const state0 = row && row.data;
    if (!state0 || !state0.matches) return res.status(500).json({ error: 'pool_state has no matches' });

    const g = mergeApiResults(state0, apiMatches);
    const k = mergeKnockoutResults(g.state, apiMatches);
    const merged = k.state;
    const changed = g.changed || k.changed;

    if (changed) {
      const { error: saveErr } = await supabase.from('pool_state')
        .upsert({ id: 'main', data: merged, updated_at: new Date().toISOString() });
      if (saveErr) throw new Error('Supabase save: ' + saveErr.message);
    }
    return res.status(200).json({
      ok: true, changed, groupChanged: g.changed, knockoutChanged: k.changed,
      fetched: apiMatches.length, completed: apiMatches.filter(isCompleted).length, rateLimitRemaining,
    });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
};
