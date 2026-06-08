// ─── KNOCKOUT BRACKET LOGIC ───────────────────────────────────────────────────
// Official FIFA 2026 bracket with smart dropdowns per match slot

import { GROUPS_2026 } from './data';

// Teams per group (for dropdowns)
const G = GROUPS_2026;

// ─── ANNEX C TABLE ────────────────────────────────────────────────────────────
// Official FIFA mapping: given which 8 groups produce 3rd-place qualifiers,
// which group's 3rd-place team plays each group winner.
// Key = sorted 8-group string. Value = { winnerSlot: groupOf3rd }
// Winner slots: 1A,1B,1D,1E,1G,1I,1K,1L (these 8 winners play 3rd-place teams)
// Source: Wikipedia "2026 FIFA World Cup knockout stage"
const ANNEX_C = {
  "EFGHIJKL": {"1A":"E","1B":"J","1D":"I","1E":"F","1G":"H","1I":"G","1K":"L","1L":"K"},
  "DFGHIJKL": {"1A":"H","1B":"G","1D":"I","1E":"D","1G":"J","1I":"F","1K":"L","1L":"K"},
  "DEGHIJKL": {"1A":"E","1B":"J","1D":"I","1E":"D","1G":"H","1I":"G","1K":"L","1L":"K"},
  "DEFHIJKL": {"1A":"E","1B":"J","1D":"I","1E":"D","1G":"H","1I":"F","1K":"L","1L":"K"},
  "DEFGIJKL": {"1A":"E","1B":"G","1D":"I","1E":"D","1G":"J","1I":"F","1K":"L","1L":"K"},
  "DEFGHJKL": {"1A":"E","1B":"G","1D":"J","1E":"D","1G":"H","1I":"F","1K":"L","1L":"K"},
  "DEFGHIKL": {"1A":"E","1B":"G","1D":"I","1E":"D","1G":"H","1I":"F","1K":"L","1L":"K"},
  "DEFGHIJL": {"1A":"E","1B":"G","1D":"J","1E":"D","1G":"H","1I":"F","1K":"L","1L":"I"},
  "DEFGHIJK": {"1A":"E","1B":"G","1D":"J","1E":"D","1G":"H","1I":"F","1K":"I","1L":"K"},
  "CFGHIJKL": {"1A":"H","1B":"G","1D":"I","1E":"C","1G":"J","1I":"F","1K":"L","1L":"K"},
  "CEGHIJKL": {"1A":"E","1B":"J","1D":"I","1E":"C","1G":"H","1I":"G","1K":"L","1L":"K"},
  "CEFHIJKL": {"1A":"E","1B":"J","1D":"I","1E":"C","1G":"H","1I":"F","1K":"L","1L":"K"},
  "CEFGIJKL": {"1A":"E","1B":"G","1D":"I","1E":"C","1G":"J","1I":"F","1K":"L","1L":"K"},
  "CEFGHJKL": {"1A":"E","1B":"G","1D":"J","1E":"C","1G":"H","1I":"F","1K":"L","1L":"K"},
  "CEFGHIKL": {"1A":"E","1B":"G","1D":"I","1E":"C","1G":"H","1I":"F","1K":"L","1L":"K"},
  "CEFGHIJL": {"1A":"E","1B":"G","1D":"J","1E":"C","1G":"H","1I":"F","1K":"L","1L":"I"},
  "CEFGHIJK": {"1A":"E","1B":"G","1D":"J","1E":"C","1G":"H","1I":"F","1K":"I","1L":"K"},
  "CDGHIJKL": {"1A":"H","1B":"G","1D":"I","1E":"C","1G":"J","1I":"D","1K":"L","1L":"K"},
  "CDFHIJKL": {"1A":"C","1B":"J","1D":"I","1E":"D","1G":"H","1I":"F","1K":"L","1L":"K"},
  "CDFGIJKL": {"1A":"C","1B":"G","1D":"I","1E":"D","1G":"J","1I":"F","1K":"L","1L":"K"},
  "CDFGHJKL": {"1A":"C","1B":"G","1D":"J","1E":"D","1G":"H","1I":"F","1K":"L","1L":"K"},
  "CDFGHIKL": {"1A":"C","1B":"G","1D":"I","1E":"D","1G":"H","1I":"F","1K":"L","1L":"K"},
  "CDFGHIJL": {"1A":"C","1B":"G","1D":"J","1E":"D","1G":"H","1I":"F","1K":"L","1L":"I"},
  "CDFGHIJK": {"1A":"C","1B":"G","1D":"J","1E":"D","1G":"H","1I":"F","1K":"I","1L":"K"},
  "CDEHIJKL": {"1A":"E","1B":"J","1D":"I","1E":"C","1G":"H","1I":"D","1K":"L","1L":"K"},
  "CDEGIJKL": {"1A":"E","1B":"G","1D":"I","1E":"C","1G":"J","1I":"D","1K":"L","1L":"K"},
  "CDEGHIKL": {"1A":"E","1B":"G","1D":"I","1E":"C","1G":"H","1I":"D","1K":"L","1L":"K"},
  "CDEGHIJL": {"1A":"E","1B":"G","1D":"J","1E":"C","1G":"H","1I":"D","1K":"L","1L":"I"},
  "CDEGHIJK": {"1A":"E","1B":"G","1D":"J","1E":"C","1G":"H","1I":"D","1K":"I","1L":"K"},
  "CDEFIJKL": {"1A":"C","1B":"J","1D":"E","1E":"D","1G":"I","1I":"F","1K":"L","1L":"K"},
  "CDEFHJKL": {"1A":"C","1B":"J","1D":"E","1E":"D","1G":"H","1I":"F","1K":"L","1L":"K"},
  "CDEFHIKL": {"1A":"C","1B":"E","1D":"I","1E":"D","1G":"H","1I":"F","1K":"L","1L":"K"},
  "CDEFHIJL": {"1A":"C","1B":"J","1D":"E","1E":"D","1G":"H","1I":"F","1K":"L","1L":"I"},
  "CDEFHIJK": {"1A":"C","1B":"J","1D":"E","1E":"D","1G":"H","1I":"F","1K":"I","1L":"K"},
  "CDEFGJKL": {"1A":"C","1B":"G","1D":"E","1E":"D","1G":"J","1I":"F","1K":"L","1L":"K"},
  "CDEFGIKL": {"1A":"C","1B":"G","1D":"E","1E":"D","1G":"I","1I":"F","1K":"L","1L":"K"},
  "CDEFGIJL": {"1A":"C","1B":"G","1D":"E","1E":"D","1G":"J","1I":"F","1K":"L","1L":"I"},
  "CDEFGIJK": {"1A":"C","1B":"G","1D":"E","1E":"D","1G":"J","1I":"F","1K":"I","1L":"K"},
  "CDEFGHKL": {"1A":"C","1B":"G","1D":"E","1E":"D","1G":"H","1I":"F","1K":"L","1L":"K"},
  "CDEFGHJL": {"1A":"C","1B":"G","1D":"J","1E":"D","1G":"H","1I":"F","1K":"L","1L":"E"},
  "CDEFGHJK": {"1A":"C","1B":"G","1D":"J","1E":"D","1G":"H","1I":"F","1K":"E","1L":"K"},
  "CDEFGHIL": {"1A":"C","1B":"G","1D":"E","1E":"D","1G":"H","1I":"F","1K":"L","1L":"I"},
  "CDEFGHIK": {"1A":"C","1B":"G","1D":"E","1E":"D","1G":"H","1I":"F","1K":"I","1L":"K"},
  "CDEFGHIJ": {"1A":"C","1B":"G","1D":"J","1E":"D","1G":"H","1I":"F","1K":"E","1L":"I"},
  "BFGHIJKL": {"1A":"H","1B":"J","1D":"B","1E":"F","1G":"I","1I":"G","1K":"L","1L":"K"},
  "BEGHIJKL": {"1A":"E","1B":"J","1D":"I","1E":"B","1G":"H","1I":"G","1K":"L","1L":"K"},
  "BEFHIJKL": {"1A":"E","1B":"J","1D":"B","1E":"F","1G":"I","1I":"H","1K":"L","1L":"K"},
  "BEFGIJKL": {"1A":"E","1B":"J","1D":"B","1E":"F","1G":"I","1I":"G","1K":"L","1L":"K"},
  "BEFGHJKL": {"1A":"E","1B":"J","1D":"B","1E":"F","1G":"H","1I":"G","1K":"L","1L":"K"},
  "BEFGHIKL": {"1A":"E","1B":"G","1D":"B","1E":"F","1G":"I","1I":"H","1K":"L","1L":"K"},
  "BEFGHIJL": {"1A":"E","1B":"J","1D":"B","1E":"F","1G":"H","1I":"G","1K":"L","1L":"I"},
  "BEFGHIJK": {"1A":"E","1B":"J","1D":"B","1E":"F","1G":"H","1I":"G","1K":"I","1L":"K"},
  "BDGHIJKL": {"1A":"H","1B":"J","1D":"B","1E":"D","1G":"I","1I":"G","1K":"L","1L":"K"},
  "BDFHIJKL": {"1A":"H","1B":"J","1D":"B","1E":"D","1G":"I","1I":"F","1K":"L","1L":"K"},
  "BDFGIJKL": {"1A":"I","1B":"G","1D":"B","1E":"D","1G":"J","1I":"F","1K":"L","1L":"K"},
  "BDFGHJKL": {"1A":"H","1B":"G","1D":"B","1E":"D","1G":"J","1I":"F","1K":"L","1L":"K"},
  "BDFGHIKL": {"1A":"H","1B":"G","1D":"B","1E":"D","1G":"I","1I":"F","1K":"L","1L":"K"},
  "BDFGHIJL": {"1A":"H","1B":"G","1D":"B","1E":"D","1G":"J","1I":"F","1K":"L","1L":"I"},
  "BDFGHIJK": {"1A":"H","1B":"G","1D":"B","1E":"D","1G":"J","1I":"F","1K":"I","1L":"K"},
  "BDEHIJKL": {"1A":"E","1B":"J","1D":"B","1E":"D","1G":"I","1I":"H","1K":"L","1L":"K"},
  "BDEGIJKL": {"1A":"E","1B":"J","1D":"B","1E":"D","1G":"I","1I":"G","1K":"L","1L":"K"},
  "BDEGHIKL": {"1A":"E","1B":"G","1D":"B","1E":"D","1G":"I","1I":"H","1K":"L","1L":"K"},
  "BDEGHIJL": {"1A":"E","1B":"J","1D":"B","1E":"D","1G":"H","1I":"G","1K":"L","1L":"I"},
  "BDEGHIJK": {"1A":"E","1B":"J","1D":"B","1E":"D","1G":"H","1I":"G","1K":"I","1L":"K"},
  "BDEFIJKL": {"1A":"E","1B":"J","1D":"B","1E":"D","1G":"I","1I":"F","1K":"L","1L":"K"},
  "BDEFHJKL": {"1A":"E","1B":"J","1D":"B","1E":"D","1G":"H","1I":"F","1K":"L","1L":"K"},
  "BDEFHIKL": {"1A":"E","1B":"I","1D":"B","1E":"D","1G":"H","1I":"F","1K":"L","1L":"K"},
  "BDEFHIJL": {"1A":"E","1B":"J","1D":"B","1E":"D","1G":"H","1I":"F","1K":"L","1L":"I"},
  "BDEFHIJK": {"1A":"E","1B":"J","1D":"B","1E":"D","1G":"H","1I":"F","1K":"I","1L":"K"},
  "BDEFGJKL": {"1A":"E","1B":"G","1D":"B","1E":"D","1G":"J","1I":"F","1K":"L","1L":"K"},
  "BDEFGIKL": {"1A":"E","1B":"G","1D":"B","1E":"D","1G":"I","1I":"F","1K":"L","1L":"K"},
  "BDEFGIJL": {"1A":"E","1B":"G","1D":"B","1E":"D","1G":"J","1I":"F","1K":"L","1L":"I"},
  "BDEFGIJK": {"1A":"E","1B":"G","1D":"B","1E":"D","1G":"J","1I":"F","1K":"I","1L":"K"},
  "BDEFGHKL": {"1A":"E","1B":"G","1D":"B","1E":"D","1G":"H","1I":"F","1K":"L","1L":"K"},
  "BDEFGHJL": {"1A":"H","1B":"G","1D":"B","1E":"D","1G":"J","1I":"F","1K":"L","1L":"E"},
  "BDEFGHJK": {"1A":"H","1B":"G","1D":"B","1E":"D","1G":"J","1I":"F","1K":"E","1L":"K"},
  "BDEFGHIL": {"1A":"E","1B":"G","1D":"B","1E":"D","1G":"H","1I":"F","1K":"L","1L":"I"},
  "BDEFGHIK": {"1A":"E","1B":"G","1D":"B","1E":"D","1G":"H","1I":"F","1K":"I","1L":"K"},
  "BDEFGHIJ": {"1A":"H","1B":"G","1D":"B","1E":"D","1G":"J","1I":"F","1K":"E","1L":"I"},
  "BCGHIJKL": {"1A":"H","1B":"J","1D":"B","1E":"C","1G":"I","1I":"G","1K":"L","1L":"K"},
  "BCFHIJKL": {"1A":"H","1B":"J","1D":"B","1E":"C","1G":"I","1I":"F","1K":"L","1L":"K"},
  "BCFGIJKL": {"1A":"I","1B":"G","1D":"B","1E":"C","1G":"J","1I":"F","1K":"L","1L":"K"},
  "BCFGHJKL": {"1A":"H","1B":"G","1D":"B","1E":"C","1G":"J","1I":"F","1K":"L","1L":"K"},
  "BCFGHIKL": {"1A":"H","1B":"G","1D":"B","1E":"C","1G":"I","1I":"F","1K":"L","1L":"K"},
  "BCFGHIJL": {"1A":"H","1B":"G","1D":"B","1E":"C","1G":"J","1I":"F","1K":"L","1L":"I"},
  "BCFGHIJK": {"1A":"H","1B":"G","1D":"B","1E":"C","1G":"J","1I":"F","1K":"I","1L":"K"},
  "BCEHIJKL": {"1A":"E","1B":"J","1D":"B","1E":"C","1G":"I","1I":"H","1K":"L","1L":"K"},
  "BCEGIJKL": {"1A":"E","1B":"J","1D":"B","1E":"C","1G":"I","1I":"G","1K":"L","1L":"K"},
  "BCEFIJKL": {"1A":"E","1B":"J","1D":"B","1E":"C","1G":"I","1I":"F","1K":"L","1L":"K"},
  "BCEFHJKL": {"1A":"E","1B":"J","1D":"B","1E":"C","1G":"H","1I":"F","1K":"L","1L":"K"},
  "BCEFHIKL": {"1A":"E","1B":"I","1D":"B","1E":"C","1G":"H","1I":"F","1K":"L","1L":"K"},
  "BCEFHIJL": {"1A":"E","1B":"J","1D":"B","1E":"C","1G":"H","1I":"F","1K":"L","1L":"I"},
  "BCEFHIJK": {"1A":"E","1B":"J","1D":"B","1E":"C","1G":"H","1I":"F","1K":"I","1L":"K"},
  "BCEFGJKL": {"1A":"E","1B":"G","1D":"B","1E":"C","1G":"J","1I":"F","1K":"L","1L":"K"},
  "BCEFGIKL": {"1A":"E","1B":"G","1D":"B","1E":"C","1G":"I","1I":"F","1K":"L","1L":"K"},
  "BCEFGIJL": {"1A":"E","1B":"G","1D":"B","1E":"C","1G":"J","1I":"F","1K":"L","1L":"I"},
  "BCEFGIJK": {"1A":"E","1B":"G","1D":"B","1E":"C","1G":"J","1I":"F","1K":"I","1L":"K"},
  "BCEFGHKL": {"1A":"E","1B":"G","1D":"B","1E":"C","1G":"H","1I":"F","1K":"L","1L":"K"},
  "BCEFGHJL": {"1A":"H","1B":"G","1D":"B","1E":"C","1G":"J","1I":"F","1K":"L","1L":"E"},
  "BCEFGHJK": {"1A":"H","1B":"G","1D":"B","1E":"C","1G":"J","1I":"F","1K":"E","1L":"K"},
  "BCEFGHIL": {"1A":"E","1B":"G","1D":"B","1E":"C","1G":"H","1I":"F","1K":"L","1L":"I"},
  "BCEFGHIK": {"1A":"E","1B":"G","1D":"B","1E":"C","1G":"H","1I":"F","1K":"I","1L":"K"},
  "BCEFGHIJ": {"1A":"H","1B":"G","1D":"B","1E":"C","1G":"J","1I":"F","1K":"E","1L":"I"},
};

// Which winner slot does each R32 "best 3rd" match correspond to?
const R32_3RD_WINNER = {
  r32_2: "1E", r32_5: "1I", r32_7: "1A", r32_8: "1L",
  r32_9: "1D", r32_10: "1G", r32_13: "1B", r32_15: "1K",
};

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

  // 2. Compute 3rd-place teams and rank them per Annex C, then resolve slots
  // Build stats for each group's 3rd-place team
  const thirdStats = {};
  Object.entries(GROUPS_2026).forEach(([grp]) => {
    const third = groupStandings[grp]?.[2];
    if (!third) return;
    let pts = 0, gf = 0, ga = 0;
    groupMatches.filter(m => m.group === grp).forEach(m => {
      const r = m.result || userGroupPreds[m.id];
      if (!r) return;
      const hg = parseInt(r.homeGoals), ag = parseInt(r.awayGoals);
      if (isNaN(hg) || isNaN(ag)) return;
      if (m.home === third) { gf += hg; ga += ag; if (hg > ag) pts += 3; else if (hg === ag) pts += 1; }
      if (m.away === third) { gf += ag; ga += hg; if (ag > hg) pts += 3; else if (hg === ag) pts += 1; }
    });
    thirdStats[grp] = { team: third, pts, gd: gf - ga, gf };
  });

  // Rank all 3rd-place teams, best 8 qualify
  const ranked3rd = Object.entries(thirdStats)
    .sort(([, a], [, b]) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)
    .slice(0, 8);
  const annexKey = ranked3rd.map(([g]) => g).sort().join("");
  const annexC = ANNEX_C[annexKey] || null;

  // Fallback assignment: distribute the 8 qualifying 3rd-place teams across
  // the 8 winner slots in a fixed order (no duplicates) when exact Annex C
  // combination isn't in our table.
  const winnerSlotOrder = ["1A","1B","1D","1E","1G","1I","1K","1L"];
  const fallback3rd = {};
  ranked3rd.forEach(([grp], i) => {
    const slot = winnerSlotOrder[i];
    if (slot) fallback3rd[slot] = thirdStats[grp]?.team || null;
  });

  // Resolve which 3rd-place team plays a given winner slot
  function resolve3rd(matchId) {
    const winnerSlot = R32_3RD_WINNER[matchId];
    if (!winnerSlot) return null;
    if (annexC) {
      const grp3rd = annexC[winnerSlot];
      if (grp3rd) return thirdStats[grp3rd]?.team || null;
    }
    // Fallback: no-duplicate distribution
    return fallback3rd[winnerSlot] || null;
  }

  // 2b. Infer R32 teams
  const r32Inferred = {};
  Object.keys(R32_HOME_SLOT).forEach(id => {
    const homeSlot = R32_HOME_SLOT[id];
    const awaySlot = R32_AWAY_SLOT[id];
    r32Inferred[id] = {
      home: homeSlot?.type === "3rd" ? resolve3rd(id) : inferSlotTeam(homeSlot, groupStandings),
      away: awaySlot?.type === "3rd" ? resolve3rd(id) : inferSlotTeam(awaySlot, groupStandings),
    };
  });

  // 3. Infer R16 teams — ONLY suggest when the feeding R32 match is filled in by the user
  const r16Inferred = {};
  R16_BRACKET.forEach(m => {
    const homePred = knockoutPreds[m.homeR32];
    const awayPred = knockoutPreds[m.awayR32];

    // Winner of homeR32 — only if user picked both teams in that match
    let homeWinner = null;
    if (homePred?.homeTeam && homePred?.awayTeam) {
      const hg = parseInt(homePred.homeGoals), ag = parseInt(homePred.awayGoals);
      if (!isNaN(hg) && !isNaN(ag)) {
        if (hg > ag) homeWinner = homePred.homeTeam;
        else if (ag > hg) homeWinner = homePred.awayTeam;
        else homeWinner = homePred.progresser || null; // draw → use progresser
      } else {
        homeWinner = homePred.homeTeam; // teams picked, no score yet
      }
    }

    let awayWinner = null;
    if (awayPred?.homeTeam && awayPred?.awayTeam) {
      const hg = parseInt(awayPred.homeGoals), ag = parseInt(awayPred.awayGoals);
      if (!isNaN(hg) && !isNaN(ag)) {
        if (hg > ag) awayWinner = awayPred.homeTeam;
        else if (ag > hg) awayWinner = awayPred.awayTeam;
        else awayWinner = awayPred.progresser || null;
      } else {
        awayWinner = awayPred.homeTeam;
      }
    }

    r16Inferred[m.id] = { home: homeWinner, away: awayWinner };
  });

  // 4. Infer QF, SF, Final — only suggest when the feeding match is filled in
  function inferWinner(matchId, pred) {
    const p = pred?.[matchId];
    if (!p?.homeTeam || !p?.awayTeam) return null; // not filled → no suggestion
    const hg = parseInt(p.homeGoals), ag = parseInt(p.awayGoals);
    if (!isNaN(hg) && !isNaN(ag)) {
      if (hg > ag) return p.homeTeam;
      if (ag > hg) return p.awayTeam;
      return p.progresser || null; // draw → progresser
    }
    return p.homeTeam; // teams picked, no score
  }

  const qfInferred = {};
  QF_BRACKET.forEach(m => {
    qfInferred[m.id] = {
      home: inferWinner(m.homeR16, knockoutPreds),
      away: inferWinner(m.awayR16, knockoutPreds),
    };
  });

  const sfInferred = {};
  SF_BRACKET.forEach(m => {
    sfInferred[m.id] = {
      home: inferWinner(m.homeQF, knockoutPreds),
      away: inferWinner(m.awayQF, knockoutPreds),
    };
  });

  // Bronze = losers of the two semi-finals (only if SF filled in)
  const sf1 = knockoutPreds?.sf_1;
  const sf2 = knockoutPreds?.sf_2;
  const sf1Winner = inferWinner("sf_1", knockoutPreds);
  const sf2Winner = inferWinner("sf_2", knockoutPreds);
  const bronzeHome = (sf1?.homeTeam && sf1?.awayTeam && sf1Winner)
    ? (sf1Winner === sf1.homeTeam ? sf1.awayTeam : sf1.homeTeam) : null;
  const bronzeAway = (sf2?.homeTeam && sf2?.awayTeam && sf2Winner)
    ? (sf2Winner === sf2.homeTeam ? sf2.awayTeam : sf2.homeTeam) : null;

  return {
    ...r32Inferred,
    ...r16Inferred,
    ...qfInferred,
    ...sfInferred,
    bronze: { home: bronzeHome, away: bronzeAway },
    final: { home: sf1Winner, away: sf2Winner },
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
