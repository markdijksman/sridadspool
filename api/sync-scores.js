// api/sync-scores.js
// Server-side WC2026 score sync — the single source that talks to the WC API.
// SELF-CONTAINED: all merge logic is inlined here (no imports from ../lib),
// so Vercel never has to bundle a sibling file. Triggered by GitHub Actions
// every 15 min; clients read the result from Supabase via their 30s poll.
//
// Required Vercel environment variables:
//   WC_API_KEY                  — your wc2026api.com key (server-side, NOT REACT_APP_)
//   SYNC_SECRET                 — long random string; must match the GitHub secret
//   REACT_APP_SUPABASE_URL      — already set (reused here)
//   REACT_APP_SUPABASE_ANON_KEY — already set (reused here)

const WC_API_BASE = 'https://api.wc2026api.com';

// ── team-name normalisation ──────────────────────────────────────────────────
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

function normalise(name) {
  if (name == null) return name;
  const s = typeof name === 'object' ? (name.name || name.team || '') : String(name);
  return TEAM_NAME_MAP[s] || s;
}

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
    if (idx === -1) continue;
    const existing = matches[idx].result;
    if (!existing || existing.homeGoals !== score.homeGoals || existing.awayGoals !== score.awayGoals) {
      matches = matches.map((m, i) => (i === idx ? { ...m, result: { ...score, autoUpdated: true } } : m));
      changed = true;
    }
  }
  return { state: changed ? { ...state, matches } : state, changed };
}

// ── handler ──────────────────────────────────────────────────────────────────
module.exports = async (req, res) => {
  try {
    const { createClient } = require('@supabase/supabase-js');

    // 1. Auth
    const secret = process.env.SYNC_SECRET;
    const provided = (req.query && req.query.key) || (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!secret || provided !== secret) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const WC_API_KEY = process.env.WC_API_KEY;
    const SB_URL = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
    const SB_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (!WC_API_KEY) return res.status(500).json({ error: 'WC_API_KEY not set' });
    if (!SB_URL || !SB_KEY) return res.status(500).json({ error: 'Supabase env not set' });

    const supabase = createClient(SB_URL, SB_KEY);

    // 2. Fetch WC matches first (slow call), to keep the Supabase read->write window tiny.
    const apiRes = await fetch(`${WC_API_BASE}/matches`, {
      headers: { Authorization: `Bearer ${WC_API_KEY}` },
    });
    const rateLimitRemaining = apiRes.headers.get('x-ratelimit-remaining');

    if (!apiRes.ok) {
      return res.status(502).json({
        error: `WC API responded ${apiRes.status}`,
        hint: (apiRes.status === 401 || apiRes.status === 403)
          ? 'Key invalid or suspended (daily limit). Check your wc2026api.com key.'
          : undefined,
        rateLimitRemaining,
      });
    }

    const body = await apiRes.json();
    const apiMatches = Array.isArray(body) ? body : (body.matches || body.data || []);

    // 3. Load current pool state, merge, write back.
    const { data: row, error: loadErr } = await supabase
      .from('pool_state').select('data').eq('id', 'main').single();
    if (loadErr) throw new Error('Supabase load: ' + loadErr.message);

    const state = row && row.data;
    if (!state || !state.matches) {
      return res.status(500).json({ error: 'pool_state has no matches' });
    }

    const { state: merged, changed } = mergeApiResults(state, apiMatches);

    if (changed) {
      const { error: saveErr } = await supabase
        .from('pool_state')
        .upsert({ id: 'main', data: merged, updated_at: new Date().toISOString() });
      if (saveErr) throw new Error('Supabase save: ' + saveErr.message);
    }

    return res.status(200).json({
      ok: true,
      changed,
      fetched: apiMatches.length,
      completed: apiMatches.filter(isCompleted).length,
      rateLimitRemaining,
    });
  } catch (e) {
    // Any unexpected error becomes a readable JSON 500 (no opaque crash).
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
};
