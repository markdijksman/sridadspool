// ─── KNOCKOUT BRACKET LOGIC ───────────────────────────────────────────────────
// Official FIFA 2026 bracket with smart dropdowns per match slot

import { GROUPS_2026 } from './data';

// Teams per group (for dropdowns)
const G = GROUPS_2026;

// Round of 32 — official FIFA bracket (from wikipedia)
// Each slot: { id, label, homePossible: [teams], awayPossible: [teams] }
export const R32_BRACKET = [
  // Fixed 1st vs 2nd matchups
  { id:"r32_1",  label:"Match 73 · 2A vs 2B",        home: G.A, away: G.B },
  { id:"r32_2",  label:"Match 74 · 1E vs Best 3rd",   home: G.E, away: [...G.A,...G.B,...G.C,...G.D,...G.F] },
  { id:"r32_3",  label:"Match 75 · 1F vs 2C",         home: G.F, away: G.C },
  { id:"r32_4",  label:"Match 76 · 1C vs 2F",         home: G.C, away: G.F },
  { id:"r32_5",  label:"Match 77 · 1I vs Best 3rd",   home: G.I, away: [...G.C,...G.D,...G.F,...G.G,...G.H] },
  { id:"r32_6",  label:"Match 78 · 2E vs 2I",         home: G.E, away: G.I },
  { id:"r32_7",  label:"Match 79 · 1A vs Best 3rd",   home: G.A, away: [...G.C,...G.E,...G.F,...G.H,...G.I] },
  { id:"r32_8",  label:"Match 80 · 1L vs Best 3rd",   home: G.L, away: [...G.E,...G.H,...G.I,...G.J,...G.K] },
  { id:"r32_9",  label:"Match 81 · 1D vs Best 3rd",   home: G.D, away: [...G.B,...G.E,...G.F,...G.I,...G.J] },
  { id:"r32_10", label:"Match 82 · 1G vs Best 3rd",   home: G.G, away: [...G.A,...G.E,...G.H,...G.I,...G.J] },
  { id:"r32_11", label:"Match 83 · 2K vs 2L",         home: G.K, away: G.L },
  { id:"r32_12", label:"Match 84 · 1H vs 2J",         home: G.H, away: G.J },
  { id:"r32_13", label:"Match 85 · 1B vs Best 3rd",   home: G.B, away: [...G.E,...G.F,...G.G,...G.I,...G.J] },
  { id:"r32_14", label:"Match 86 · 1J vs 2H",         home: G.J, away: G.H },
  { id:"r32_15", label:"Match 87 · 1K vs Best 3rd",   home: G.K, away: [...G.D,...G.E,...G.I,...G.J,...G.L] },
  { id:"r32_16", label:"Match 88 · 2D vs 2G",         home: G.D, away: G.G },
];

// Round of 16 — winners of R32 pairs
export const R16_BRACKET = [
  { id:"r16_1", label:"R16 M1 · W73 vs W74",   homeR32:"r32_1",  awayR32:"r32_2"  },
  { id:"r16_2", label:"R16 M2 · W75 vs W76",   homeR32:"r32_3",  awayR32:"r32_4"  },
  { id:"r16_3", label:"R16 M3 · W77 vs W78",   homeR32:"r32_5",  awayR32:"r32_6"  },
  { id:"r16_4", label:"R16 M4 · W79 vs W80",   homeR32:"r32_7",  awayR32:"r32_8"  },
  { id:"r16_5", label:"R16 M5 · W81 vs W82",   homeR32:"r32_9",  awayR32:"r32_10" },
  { id:"r16_6", label:"R16 M6 · W83 vs W84",   homeR32:"r32_11", awayR32:"r32_12" },
  { id:"r16_7", label:"R16 M7 · W85 vs W86",   homeR32:"r32_13", awayR32:"r32_14" },
  { id:"r16_8", label:"R16 M8 · W87 vs W88",   homeR32:"r32_15", awayR32:"r32_16" },
];

export const QF_BRACKET = [
  { id:"qf_1", label:"QF1 · W R16M1 vs W R16M2", homeR16:"r16_1", awayR16:"r16_2" },
  { id:"qf_2", label:"QF2 · W R16M3 vs W R16M4", homeR16:"r16_3", awayR16:"r16_4" },
  { id:"qf_3", label:"QF3 · W R16M5 vs W R16M6", homeR16:"r16_5", awayR16:"r16_6" },
  { id:"qf_4", label:"QF4 · W R16M7 vs W R16M8", homeR16:"r16_7", awayR16:"r16_8" },
];

export const SF_BRACKET = [
  { id:"sf_1", label:"SF1 · W QF1 vs W QF2", homeQF:"qf_1", awayQF:"qf_2" },
  { id:"sf_2", label:"SF2 · W QF3 vs W QF4", homeQF:"qf_3", awayQF:"qf_4" },
];

// Get eligible teams for a knockout slot based on which R32 matches feed into it
export function getEligibleTeams(slotId, r32bracket = R32_BRACKET, r16bracket = R16_BRACKET, qfBracket = QF_BRACKET) {
  // R32 slots — direct group teams
  const r32 = r32bracket.find(m => m.id === slotId);
  if (r32) return [...new Set([...r32.home, ...r32.away])].sort();

  // R16 slots — teams from both feeding R32 matches
  const r16 = r16bracket.find(m => m.id === slotId);
  if (r16) {
    const homeR32 = r32bracket.find(m => m.id === r16.homeR32);
    const awayR32 = r32bracket.find(m => m.id === r16.awayR32);
    const teams = [...(homeR32?.home||[]), ...(homeR32?.away||[]), ...(awayR32?.home||[]), ...(awayR32?.away||[])];
    return [...new Set(teams)].sort();
  }

  // QF slots — teams from both feeding R16 matches
  const qf = qfBracket.find(m => m.id === slotId);
  if (qf) {
    const homeR16 = r16bracket.find(m => m.id === qf.homeR16);
    const awayR16 = r16bracket.find(m => m.id === qf.awayR16);
    const getR16Teams = (r16m) => {
      if (!r16m) return [];
      const hr32 = r32bracket.find(m => m.id === r16m.homeR32);
      const ar32 = r32bracket.find(m => m.id === r16m.awayR32);
      return [...(hr32?.home||[]), ...(hr32?.away||[]), ...(ar32?.home||[]), ...(ar32?.away||[])];
    };
    return [...new Set([...getR16Teams(homeR16), ...getR16Teams(awayR16)])].sort();
  }

  // SF slots
  if (slotId === "sf_1") {
    return getEligibleTeams("qf_1", r32bracket, r16bracket, qfBracket)
      .concat(getEligibleTeams("qf_2", r32bracket, r16bracket, qfBracket))
      .filter((v,i,a) => a.indexOf(v) === i).sort();
  }
  if (slotId === "sf_2") {
    return getEligibleTeams("qf_3", r32bracket, r16bracket, qfBracket)
      .concat(getEligibleTeams("qf_4", r32bracket, r16bracket, qfBracket))
      .filter((v,i,a) => a.indexOf(v) === i).sort();
  }

  // Bronze + Final — all teams
  if (slotId === "bronze" || slotId === "final") {
    return Object.values(GROUPS_2026).flat().sort();
  }

  return Object.values(GROUPS_2026).flat().sort();
}

// ─── INFER BRACKET FROM GROUP PREDICTIONS ────────────────────────────────────
// Given a user's group stage predictions, infer who would win/finish 2nd/3rd
// in each group, then auto-fill the knockout bracket accordingly.

function groupOutcome(h, a) {
  const ph = parseInt(h), pa = parseInt(a);
  if (isNaN(ph) || isNaN(pa)) return null;
  if (ph > pa) return "home";
  if (pa > ph) return "away";
  return "draw";
}

// Given predictions for all matches in a group, return standing [1st, 2nd, 3rd, 4th]
function inferGroupStanding(groupTeams, groupMatches, preds) {
  // Build points table
  const pts = {}, gf = {}, ga = {};
  groupTeams.forEach(t => { pts[t] = 0; gf[t] = 0; ga[t] = 0; });

  groupMatches.forEach(m => {
    // Use actual result if available, else use prediction
    const r = m.result || preds[m.id];
    if (!r) return;
    const hg = parseInt(r.homeGoals), ag = parseInt(r.awayGoals);
    if (isNaN(hg) || isNaN(ag)) return;
    gf[m.home] = (gf[m.home]||0) + hg;
    ga[m.home] = (ga[m.home]||0) + ag;
    gf[m.away] = (gf[m.away]||0) + ag;
    ga[m.away] = (ga[m.away]||0) + hg;
    if (hg > ag) { pts[m.home] = (pts[m.home]||0) + 3; }
    else if (hg === ag) { pts[m.home] = (pts[m.home]||0) + 1; pts[m.away] = (pts[m.away]||0) + 1; }
    else { pts[m.away] = (pts[m.away]||0) + 3; }
  });

  return [...groupTeams].sort((a, b) => {
    if (pts[b] !== pts[a]) return pts[b] - pts[a];
    const gdA = (gf[a]||0) - (ga[a]||0), gdB = (gf[b]||0) - (ga[b]||0);
    if (gdB !== gdA) return gdB - gdA;
    return (gf[b]||0) - (gf[a]||0);
  });
}

// R32 bracket slot → which group team fills it
// Based on official FIFA bracket
const R32_HOME_SLOT = {
  r32_1:  { type:"2nd", group:"A" },
  r32_2:  { type:"1st", group:"E" },
  r32_3:  { type:"1st", group:"F" },
  r32_4:  { type:"1st", group:"C" },
  r32_5:  { type:"1st", group:"I" },
  r32_6:  { type:"2nd", group:"E" },
  r32_7:  { type:"1st", group:"A" },
  r32_8:  { type:"1st", group:"L" },
  r32_9:  { type:"1st", group:"D" },
  r32_10: { type:"1st", group:"G" },
  r32_11: { type:"2nd", group:"K" },
  r32_12: { type:"1st", group:"H" },
  r32_13: { type:"1st", group:"B" },
  r32_14: { type:"1st", group:"J" },
  r32_15: { type:"1st", group:"K" },
  r32_16: { type:"2nd", group:"D" },
};

const R32_AWAY_SLOT = {
  r32_1:  { type:"2nd", group:"B" },
  r32_2:  { type:"3rd", groups:["A","B","C","D","F"] },
  r32_3:  { type:"2nd", group:"C" },
  r32_4:  { type:"2nd", group:"F" },
  r32_5:  { type:"3rd", groups:["C","D","F","G","H"] },
  r32_6:  { type:"2nd", group:"I" },
  r32_7:  { type:"3rd", groups:["C","E","F","H","I"] },
  r32_8:  { type:"3rd", groups:["E","H","I","J","K"] },
  r32_9:  { type:"3rd", groups:["B","E","F","I","J"] },
  r32_10: { type:"3rd", groups:["A","E","H","I","J"] },
  r32_11: { type:"2nd", group:"L" },
  r32_12: { type:"2nd", group:"J" },
  r32_13: { type:"3rd", groups:["E","F","G","I","J"] },
  r32_14: { type:"2nd", group:"H" },
  r32_15: { type:"3rd", groups:["D","E","I","J","L"] },
  r32_16: { type:"2nd", group:"G" },
};

// Given all group standings, infer what team fills a slot
function inferSlotTeam(slot, groupStandings) {
  if (!slot) return null;
  if (slot.type === "1st") return groupStandings[slot.group]?.[0] || null;
  if (slot.type === "2nd") return groupStandings[slot.group]?.[1] || null;
  if (slot.type === "3rd") {
    // Best 3rd from candidate groups — return 3rd of first group that has one
    for (const g of (slot.groups || [])) {
      const t = groupStandings[g]?.[2];
      if (t) return t;
    }
    return null;
  }
  return null;
}

// Main function: given userPredictions + groupMatches + knockoutMatches,
// return suggested homeTeam/awayTeam for each knockout match
export function inferKnockoutBracket(groupMatches, knockoutPreds, userGroupPreds, realResults) {
  // 1. Infer group standings from predictions (falling back to real results)
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

  // 3. Infer R16 teams from knockout predictions
  const r16Inferred = {};
  R16_BRACKET.forEach(m => {
    const homePred = knockoutPreds[m.homeR32];
    const awayPred = knockoutPreds[m.awayR32];
    const homeR32 = r32Inferred[m.homeR32];
    const awayR32 = r32Inferred[m.awayR32];

    // Winner of homeR32 match
    let homeWinner = null;
    if (homePred?.homeTeam && homePred?.awayTeam && homePred?.homeGoals !== undefined) {
      const hg = parseInt(homePred.homeGoals), ag = parseInt(homePred.awayGoals);
      if (!isNaN(hg) && !isNaN(ag)) homeWinner = hg >= ag ? homePred.homeTeam : homePred.awayTeam;
    } else if (homePred?.homeTeam) {
      homeWinner = homePred.homeTeam; // default to home if no score
    } else if (homeR32?.home) {
      homeWinner = homeR32.home;
    }

    let awayWinner = null;
    if (awayPred?.homeTeam && awayPred?.awayTeam && awayPred?.homeGoals !== undefined) {
      const hg = parseInt(awayPred.homeGoals), ag = parseInt(awayPred.awayGoals);
      if (!isNaN(hg) && !isNaN(ag)) awayWinner = hg >= ag ? awayPred.homeTeam : awayPred.awayTeam;
    } else if (awayPred?.homeTeam) {
      awayWinner = awayPred.homeTeam;
    } else if (awayR32?.home) {
      awayWinner = awayR32.home;
    }

    r16Inferred[m.id] = { home: homeWinner, away: awayWinner };
  });

  // 4. Infer QF, SF, Final similarly
  function inferWinner(matchId, pred, inferred) {
    const p = pred?.[matchId];
    const inf = inferred?.[matchId];
    if (p?.homeTeam && p?.awayTeam && p?.homeGoals !== undefined) {
      const hg = parseInt(p.homeGoals), ag = parseInt(p.awayGoals);
      if (!isNaN(hg) && !isNaN(ag)) return hg >= ag ? p.homeTeam : p.awayTeam;
    }
    return p?.homeTeam || inf?.home || null;
  }

  const qfInferred = {};
  QF_BRACKET.forEach(m => {
    qfInferred[m.id] = {
      home: inferWinner(m.homeR16, knockoutPreds, r16Inferred),
      away: inferWinner(m.awayR16, knockoutPreds, r16Inferred),
    };
  });

  const sfInferred = {};
  SF_BRACKET.forEach(m => {
    sfInferred[m.id] = {
      home: inferWinner(m.homeQF, knockoutPreds, qfInferred),
      away: inferWinner(m.awayQF, knockoutPreds, qfInferred),
    };
  });

  const bronzeHome = inferWinner("sf_1", knockoutPreds, sfInferred) === knockoutPreds?.sf_1?.homeTeam
    ? knockoutPreds?.sf_1?.awayTeam : knockoutPreds?.sf_1?.homeTeam;
  const bronzeAway = inferWinner("sf_2", knockoutPreds, sfInferred) === knockoutPreds?.sf_2?.homeTeam
    ? knockoutPreds?.sf_2?.awayTeam : knockoutPreds?.sf_2?.homeTeam;

  return {
    ...r32Inferred,
    ...r16Inferred,
    ...qfInferred,
    ...sfInferred,
    bronze: { home: bronzeHome || null, away: bronzeAway || null },
    final: {
      home: inferWinner("sf_1", knockoutPreds, sfInferred),
      away: inferWinner("sf_2", knockoutPreds, sfInferred),
    },
  };
}

// = 2026-06-11T19:00:00Z
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
