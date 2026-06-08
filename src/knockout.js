// ─── KNOCKOUT BRACKET LOGIC ───────────────────────────────────────────────────
// IDs must match KNOCKOUT_TEMPLATE in data.js exactly

import { GROUPS_2026 } from './data';

const G = GROUPS_2026;

// R32_BRACKET — official FIFA 2026 bracket
// Source: ESPN/Yahoo Sports (official rights holders)
// 3rd place slots: which groups' 3rd-placed teams can fill each slot
// r32_13: 1E vs best 3rd from A/B/C/D/F
// r32_14: 1I vs best 3rd from C/D/F/G/H
// r32_15: 1A vs best 3rd from C/E/F/H/I
// r32_16: 1L vs best 3rd from E/H/I/J/K
export const R32_BRACKET = [
  { id:"r32_1",  label:"1A vs 2B",     home: G.A,                                                              away: G.B },
  { id:"r32_2",  label:"1C vs 2D",     home: G.C,                                                              away: G.D },
  { id:"r32_3",  label:"1E vs 2F",     home: G.E,                                                              away: G.F },
  { id:"r32_4",  label:"1G vs 2H",     home: G.G,                                                              away: G.H },
  { id:"r32_5",  label:"1I vs 2J",     home: G.I,                                                              away: G.J },
  { id:"r32_6",  label:"1K vs 2L",     home: G.K,                                                              away: G.L },
  { id:"r32_7",  label:"1B vs 2A",     home: G.B,                                                              away: G.A },
  { id:"r32_8",  label:"1D vs 2C",     home: G.D,                                                              away: G.C },
  { id:"r32_9",  label:"1F vs 2E",     home: G.F,                                                              away: G.E },
  { id:"r32_10", label:"1H vs 2G",     home: G.H,                                                              away: G.G },
  { id:"r32_11", label:"1J vs 2I",     home: G.J,                                                              away: G.I },
  { id:"r32_12", label:"1L vs 2K",     home: G.L,                                                              away: G.K },
  // Matches 13-16: Group winners vs best 3rd place teams
  // Exact pairings determined by FIFA after group stage
  { id:"r32_13", label:"Group winner vs best 3rd #1", home: [...G.A,...G.B,...G.C,...G.D,...G.E,...G.F,...G.G,...G.H,...G.I,...G.J,...G.K,...G.L], away: [...G.A,...G.B,...G.C,...G.D,...G.E,...G.F,...G.G,...G.H,...G.I,...G.J,...G.K,...G.L] },
  { id:"r32_14", label:"Group winner vs best 3rd #2", home: [...G.A,...G.B,...G.C,...G.D,...G.E,...G.F,...G.G,...G.H,...G.I,...G.J,...G.K,...G.L], away: [...G.A,...G.B,...G.C,...G.D,...G.E,...G.F,...G.G,...G.H,...G.I,...G.J,...G.K,...G.L] },
  { id:"r32_15", label:"Group winner vs best 3rd #3", home: [...G.A,...G.B,...G.C,...G.D,...G.E,...G.F,...G.G,...G.H,...G.I,...G.J,...G.K,...G.L], away: [...G.A,...G.B,...G.C,...G.D,...G.E,...G.F,...G.G,...G.H,...G.I,...G.J,...G.K,...G.L] },
  { id:"r32_16", label:"Group winner vs best 3rd #4", home: [...G.A,...G.B,...G.C,...G.D,...G.E,...G.F,...G.G,...G.H,...G.I,...G.J,...G.K,...G.L], away: [...G.A,...G.B,...G.C,...G.D,...G.E,...G.F,...G.G,...G.H,...G.I,...G.J,...G.K,...G.L] },
];

export const R16_BRACKET = [
  { id:"r16_1", label:"W(1A/2B) vs W(1C/2D)",  homeR32:"r32_1",  awayR32:"r32_2"  },
  { id:"r16_2", label:"W(1E/2F) vs W(1G/2H)",  homeR32:"r32_3",  awayR32:"r32_4"  },
  { id:"r16_3", label:"W(1I/2J) vs W(1K/2L)",  homeR32:"r32_5",  awayR32:"r32_6"  },
  { id:"r16_4", label:"W(1B/2A) vs W(1D/2C)",  homeR32:"r32_7",  awayR32:"r32_8"  },
  { id:"r16_5", label:"W(1F/2E) vs W(1H/2G)",  homeR32:"r32_9",  awayR32:"r32_10" },
  { id:"r16_6", label:"W(1J/2I) vs W(1L/2K)",  homeR32:"r32_11", awayR32:"r32_12" },
  { id:"r16_7", label:"W(3rd#1) vs W(3rd#2)",  homeR32:"r32_13", awayR32:"r32_14" },
  { id:"r16_8", label:"W(3rd#3) vs W(3rd#4)",  homeR32:"r32_15", awayR32:"r32_16" },
];

export const QF_BRACKET = [
  { id:"qf_1", label:"QF1 · W R16-1 vs W R16-2", homeR16:"r16_1", awayR16:"r16_2" },
  { id:"qf_2", label:"QF2 · W R16-3 vs W R16-4", homeR16:"r16_3", awayR16:"r16_4" },
  { id:"qf_3", label:"QF3 · W R16-5 vs W R16-6", homeR16:"r16_5", awayR16:"r16_6" },
  { id:"qf_4", label:"QF4 · W R16-7 vs W R16-8", homeR16:"r16_7", awayR16:"r16_8" },
];

export const SF_BRACKET = [
  { id:"sf_1", label:"SF1 · W QF1 vs W QF2", homeQF:"qf_1", awayQF:"qf_2" },
  { id:"sf_2", label:"SF2 · W QF3 vs W QF4", homeQF:"qf_3", awayQF:"qf_4" },
];

// Get eligible teams for a knockout slot
export function getEligibleTeams(slotId) {
  const r32 = R32_BRACKET.find(m => m.id === slotId);
  if (r32) return [...new Set([...r32.home, ...r32.away])].sort();

  const r16 = R16_BRACKET.find(m => m.id === slotId);
  if (r16) {
    const hr32 = R32_BRACKET.find(m => m.id === r16.homeR32);
    const ar32 = R32_BRACKET.find(m => m.id === r16.awayR32);
    return [...new Set([...(hr32?.home||[]),...(hr32?.away||[]),...(ar32?.home||[]),...(ar32?.away||[])])].sort();
  }

  const qf = QF_BRACKET.find(m => m.id === slotId);
  if (qf) {
    const getR16Teams = (r16id) => {
      const r16m = R16_BRACKET.find(m => m.id === r16id);
      if (!r16m) return [];
      const hr32 = R32_BRACKET.find(m => m.id === r16m.homeR32);
      const ar32 = R32_BRACKET.find(m => m.id === r16m.awayR32);
      return [...(hr32?.home||[]),...(hr32?.away||[]),...(ar32?.home||[]),...(ar32?.away||[])];
    };
    return [...new Set([...getR16Teams(qf.homeR16),...getR16Teams(qf.awayR16)])].sort();
  }

  if (slotId === "sf_1") {
    return [...new Set([...getEligibleTeams("qf_1"),...getEligibleTeams("qf_2")])].sort();
  }
  if (slotId === "sf_2") {
    return [...new Set([...getEligibleTeams("qf_3"),...getEligibleTeams("qf_4")])].sort();
  }

  // Bronze and Final — all teams possible
  return Object.values(GROUPS_2026).flat().sort();
}

// ─── INFER BRACKET FROM GROUP PREDICTIONS ────────────────────────────────────

function inferGroupStanding(groupTeams, groupMatches, preds) {
  const pts = {}, gf = {}, ga = {};
  groupTeams.forEach(t => { pts[t] = 0; gf[t] = 0; ga[t] = 0; });
  groupMatches.forEach(m => {
    const r = m.result || preds[m.id];
    if (!r) return;
    const hg = parseInt(r.homeGoals), ag = parseInt(r.awayGoals);
    if (isNaN(hg) || isNaN(ag)) return;
    gf[m.home] = (gf[m.home]||0) + hg; ga[m.home] = (ga[m.home]||0) + ag;
    gf[m.away] = (gf[m.away]||0) + ag; ga[m.away] = (ga[m.away]||0) + hg;
    if (hg > ag) pts[m.home] = (pts[m.home]||0) + 3;
    else if (hg === ag) { pts[m.home] = (pts[m.home]||0) + 1; pts[m.away] = (pts[m.away]||0) + 1; }
    else pts[m.away] = (pts[m.away]||0) + 3;
  });
  return [...groupTeams].sort((a, b) => {
    if (pts[b] !== pts[a]) return pts[b] - pts[a];
    const gdA = (gf[a]||0)-(ga[a]||0), gdB = (gf[b]||0)-(ga[b]||0);
    if (gdB !== gdA) return gdB - gdA;
    return (gf[b]||0) - (gf[a]||0);
  });
}

// R32 slot → which group position fills it (matches KNOCKOUT_TEMPLATE)
const R32_HOME_SLOT = {
  r32_1:  { type:"1st", group:"A" },
  r32_2:  { type:"1st", group:"C" },
  r32_3:  { type:"1st", group:"E" },
  r32_4:  { type:"1st", group:"G" },
  r32_5:  { type:"1st", group:"I" },
  r32_6:  { type:"1st", group:"K" },
  r32_7:  { type:"1st", group:"B" },
  r32_8:  { type:"1st", group:"D" },
  r32_9:  { type:"1st", group:"F" },
  r32_10: { type:"1st", group:"H" },
  r32_11: { type:"1st", group:"J" },
  r32_12: { type:"1st", group:"L" },
  r32_13: { type:"any" },
  r32_14: { type:"any" },
  r32_15: { type:"any" },
  r32_16: { type:"any" },
};

const R32_AWAY_SLOT = {
  r32_1:  { type:"2nd", group:"B" },
  r32_2:  { type:"2nd", group:"D" },
  r32_3:  { type:"2nd", group:"F" },
  r32_4:  { type:"2nd", group:"H" },
  r32_5:  { type:"2nd", group:"J" },
  r32_6:  { type:"2nd", group:"L" },
  r32_7:  { type:"2nd", group:"A" },
  r32_8:  { type:"2nd", group:"C" },
  r32_9:  { type:"2nd", group:"E" },
  r32_10: { type:"2nd", group:"G" },
  r32_11: { type:"2nd", group:"I" },
  r32_12: { type:"2nd", group:"K" },
  r32_13: { type:"any" },
  r32_14: { type:"any" },
  r32_15: { type:"any" },
  r32_16: { type:"any" },
};

function inferSlotTeam(slot, groupStandings) {
  if (!slot) return null;
  if (slot.type === "1st") return groupStandings[slot.group]?.[0] || null;
  if (slot.type === "2nd") return groupStandings[slot.group]?.[1] || null;
  if (slot.type === "3rd") {
    for (const g of (slot.groups || [])) {
      const t = groupStandings[g]?.[2];
      if (t) return t;
    }
    return null;
  }
  // type "any" — can't auto-suggest, user must pick manually
  return null;
}

export function inferKnockoutBracket(groupMatches, knockoutPreds, userGroupPreds) {
  // 1. Infer group standings
  const groupStandings = {};
  Object.entries(GROUPS_2026).forEach(([grp, teams]) => {
    const matches = groupMatches.filter(m => m.group === grp);
    groupStandings[grp] = inferGroupStanding(teams, matches, userGroupPreds);
  });

  // 2. Infer R32 teams
  const r32Inferred = {};
  Object.keys(R32_HOME_SLOT).forEach(id => {
    r32Inferred[id] = {
      home: inferSlotTeam(R32_HOME_SLOT[id], groupStandings),
      away: inferSlotTeam(R32_AWAY_SLOT[id], groupStandings),
    };
  });

  // 3. Helper: infer winner of a match — ONLY if that match has been filled in
  function inferWinner(matchId, preds, inferred) {
    const p = preds?.[matchId];
    const hasTeams = p?.homeTeam && p?.awayTeam;
    const hasScore = p?.homeGoals !== undefined && p?.homeGoals !== "" &&
                     p?.awayGoals !== undefined && p?.awayGoals !== "";
    if (hasTeams && hasScore) {
      const hg = parseInt(p.homeGoals), ag = parseInt(p.awayGoals);
      if (!isNaN(hg) && !isNaN(ag)) {
        if (hg > ag) return p.homeTeam;
        if (ag > hg) return p.awayTeam;
        // Draw — use progresser if set, otherwise null (no suggestion)
        return p.progresser || null;
      }
    }
    if (hasTeams) return p.homeTeam;
    return null;
  }

  // 4. Infer R16 — only suggest if BOTH feeding R32 matches are filled
  const r16Inferred = {};
  R16_BRACKET.forEach(m => {
    const homeR32Pred = knockoutPreds?.[m.homeR32];
    const awayR32Pred = knockoutPreds?.[m.awayR32];
    const homeR32Filled = homeR32Pred?.homeTeam && homeR32Pred?.awayTeam;
    const awayR32Filled = awayR32Pred?.homeTeam && awayR32Pred?.awayTeam;
    r16Inferred[m.id] = {
      home: homeR32Filled ? inferWinner(m.homeR32, knockoutPreds, {}) : null,
      away: awayR32Filled ? inferWinner(m.awayR32, knockoutPreds, {}) : null,
    };
  });

  // 5. Infer QF — only suggest if BOTH feeding R16 matches are filled
  const qfInferred = {};
  QF_BRACKET.forEach(m => {
    const homeR16Pred = knockoutPreds?.[m.homeR16];
    const awayR16Pred = knockoutPreds?.[m.awayR16];
    const homeR16Filled = homeR16Pred?.homeTeam && homeR16Pred?.awayTeam;
    const awayR16Filled = awayR16Pred?.homeTeam && awayR16Pred?.awayTeam;
    qfInferred[m.id] = {
      home: homeR16Filled ? inferWinner(m.homeR16, knockoutPreds, {}) : null,
      away: awayR16Filled ? inferWinner(m.awayR16, knockoutPreds, {}) : null,
    };
  });

  // 6. Infer SF — only suggest if BOTH feeding QF matches are filled
  const sfInferred = {};
  SF_BRACKET.forEach(m => {
    const homeQFPred = knockoutPreds?.[m.homeQF];
    const awayQFPred = knockoutPreds?.[m.awayQF];
    const homeQFFilled = homeQFPred?.homeTeam && homeQFPred?.awayTeam;
    const awayQFFilled = awayQFPred?.homeTeam && awayQFPred?.awayTeam;
    sfInferred[m.id] = {
      home: homeQFFilled ? inferWinner(m.homeQF, knockoutPreds, {}) : null,
      away: awayQFFilled ? inferWinner(m.awayQF, knockoutPreds, {}) : null,
    };
  });

  // 7. Bronze = losers of SF
  const sf1Pred = knockoutPreds?.sf_1;
  const sf2Pred = knockoutPreds?.sf_2;
  const sf1Winner = inferWinner("sf_1", knockoutPreds, sfInferred);
  const sf2Winner = inferWinner("sf_2", knockoutPreds, sfInferred);
  const bronzeHome = sf1Pred?.homeTeam && sf1Pred.homeTeam !== sf1Winner ? sf1Pred.homeTeam : sf1Pred?.awayTeam || null;
  const bronzeAway = sf2Pred?.homeTeam && sf2Pred.homeTeam !== sf2Winner ? sf2Pred.homeTeam : sf2Pred?.awayTeam || null;

  return {
    ...r32Inferred,
    ...r16Inferred,
    ...qfInferred,
    ...sfInferred,
    bronze: { home: bronzeHome, away: bronzeAway },
    final: { home: sf1Winner, away: sf2Winner },
  };
}

// First match: Mexico vs South Africa, Thu 11 Jun 23:00 Dubai = 2026-06-11T19:00:00Z
export const FIRST_MATCH_UTC = new Date("2026-06-11T19:00:00Z");

export function isPredictionLocked() {
  return new Date() >= FIRST_MATCH_UTC;
}

export function getCountdown() {
  const now = new Date();
  const diff = FIRST_MATCH_UTC - now;
  if (diff <= 0) return null;
  const days    = Math.floor(diff / (1000*60*60*24));
  const hours   = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
  const seconds = Math.floor((diff % (1000*60)) / 1000);
  return { days, hours, minutes, seconds, diff };
}
