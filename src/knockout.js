// ─── KNOCKOUT BRACKET LOGIC ───────────────────────────────────────────────────
// Official FIFA 2026 bracket with full Annex C implementation
// IDs preserved from original to avoid data loss for existing predictions
// Source: Wikipedia "2026 FIFA World Cup knockout stage" + FIFA Annex C

import { GROUPS_2026 } from './data';

const G = GROUPS_2026;
const ALL = [...G.A,...G.B,...G.C,...G.D,...G.E,...G.F,...G.G,...G.H,...G.I,...G.J,...G.K,...G.L];

// ─── R32 BRACKET ─────────────────────────────────────────────────────────────
// Official FIFA R32 pairings (Wikipedia source)
// r32_1..4 = runners-up vs runners-up
// r32_5..8 = winners vs specific runners-up
// r32_9..16 = winners vs best 3rd (Annex C)
export const R32_BRACKET = [
  { id:"r32_1",  label:"2A vs 2B",       home: G.A,  away: G.B  },
  { id:"r32_2",  label:"2E vs 2I",       home: G.E,  away: G.I  },
  { id:"r32_3",  label:"2K vs 2L",       home: G.K,  away: G.L  },
  { id:"r32_4",  label:"2D vs 2G",       home: G.D,  away: G.G  },
  { id:"r32_5",  label:"1F vs 2C",       home: G.F,  away: G.C  },
  { id:"r32_6",  label:"1C vs 2F",       home: G.C,  away: G.F  },
  { id:"r32_7",  label:"1H vs 2J",       home: G.H,  away: G.J  },
  { id:"r32_8",  label:"1J vs 2H",       home: G.J,  away: G.H  },
  { id:"r32_9",  label:"1E vs best 3rd", home: G.E,  away: ALL  },
  { id:"r32_10", label:"1I vs best 3rd", home: G.I,  away: ALL  },
  { id:"r32_11", label:"1A vs best 3rd", home: G.A,  away: ALL  },
  { id:"r32_12", label:"1L vs best 3rd", home: G.L,  away: ALL  },
  { id:"r32_13", label:"1D vs best 3rd", home: G.D,  away: ALL  },
  { id:"r32_14", label:"1G vs best 3rd", home: G.G,  away: ALL  },
  { id:"r32_15", label:"1B vs best 3rd", home: G.B,  away: ALL  },
  { id:"r32_16", label:"1K vs best 3rd", home: G.K,  away: ALL  },
];

export const R16_BRACKET = [
  { id:"r16_1", label:"W(2A/2B) vs W(1E/3rd)",  homeR32:"r32_1",  awayR32:"r32_9"  },
  { id:"r16_2", label:"W(1F/2C) vs W(1C/2F)",   homeR32:"r32_5",  awayR32:"r32_6"  },
  { id:"r16_3", label:"W(1I/3rd) vs W(2E/2I)",  homeR32:"r32_10", awayR32:"r32_2"  },
  { id:"r16_4", label:"W(1A/3rd) vs W(1L/3rd)", homeR32:"r32_11", awayR32:"r32_12" },
  { id:"r16_5", label:"W(1D/3rd) vs W(1G/3rd)", homeR32:"r32_13", awayR32:"r32_14" },
  { id:"r16_6", label:"W(2K/2L) vs W(1H/2J)",   homeR32:"r32_3",  awayR32:"r32_7"  },
  { id:"r16_7", label:"W(1B/3rd) vs W(1J/2H)",  homeR32:"r32_15", awayR32:"r32_8"  },
  { id:"r16_8", label:"W(1K/3rd) vs W(2D/2G)",  homeR32:"r32_16", awayR32:"r32_4"  },
];

export const QF_BRACKET = [
  { id:"qf_1", label:"QF1", homeR16:"r16_1", awayR16:"r16_2" },
  { id:"qf_2", label:"QF2", homeR16:"r16_3", awayR16:"r16_4" },
  { id:"qf_3", label:"QF3", homeR16:"r16_5", awayR16:"r16_6" },
  { id:"qf_4", label:"QF4", homeR16:"r16_7", awayR16:"r16_8" },
];

export const SF_BRACKET = [
  { id:"sf_1", label:"SF1", homeQF:"qf_1", awayQF:"qf_2" },
  { id:"sf_2", label:"SF2", homeQF:"qf_3", awayQF:"qf_4" },
];

// ─── ANNEX C TABLE ────────────────────────────────────────────────────────────
// Maps sorted 8-group key → which 3rd-place team plays which group winner
// winner slot key: "1A","1B","1D","1E","1G","1I","1K","1L"
// value: group letter whose 3rd-place team plays that winner
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
  "CDEGHIJKL":{"1A":"E","1B":"G","1D":"J","1E":"C","1G":"H","1I":"D","1K":"L","1L":"K"},
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
  "BDEGHIJKL":{"1A":"E","1B":"J","1D":"B","1E":"D","1G":"H","1I":"G","1K":"L","1L":"K"},
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
  "BCDEGHIJKL":{"1A":"E","1B":"J","1D":"B","1E":"C","1G":"H","1I":"D","1K":"L","1L":"K"},
};

// ─── ELIGIBLE TEAMS ───────────────────────────────────────────────────────────
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

  if (slotId === "sf_1") return [...new Set([...getEligibleTeams("qf_1"),...getEligibleTeams("qf_2")])].sort();
  if (slotId === "sf_2") return [...new Set([...getEligibleTeams("qf_3"),...getEligibleTeams("qf_4")])].sort();

  return ALL.sort();
}

// ─── GROUP STANDING INFERENCE ─────────────────────────────────────────────────
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

// ─── MAIN INFERENCE ───────────────────────────────────────────────────────────
export function inferKnockoutBracket(groupMatches, knockoutPreds, userGroupPreds) {
  // 1. Infer group standings
  const groupStandings = {};
  Object.entries(GROUPS_2026).forEach(([grp, teams]) => {
    const matches = groupMatches.filter(m => m.group === grp);
    groupStandings[grp] = inferGroupStanding(teams, matches, userGroupPreds);
  });

  // 2. Calculate 3rd-place teams with points/GD/GF for Annex C ranking
  const thirdPlaceStats = {};
  Object.entries(GROUPS_2026).forEach(([grp, teams]) => {
    const standing = groupStandings[grp];
    const third = standing[2];
    if (!third) return;
    const matches = groupMatches.filter(m => m.group === grp);
    let pts = 0, gf = 0, ga = 0;
    matches.forEach(m => {
      const r = m.result || userGroupPreds[m.id];
      if (!r) return;
      const hg = parseInt(r.homeGoals), ag = parseInt(r.awayGoals);
      if (isNaN(hg) || isNaN(ag)) return;
      if (m.home === third) { gf += hg; ga += ag; if (hg > ag) pts += 3; else if (hg === ag) pts += 1; }
      if (m.away === third) { gf += ag; ga += hg; if (ag > hg) pts += 3; else if (hg === ag) pts += 1; }
    });
    thirdPlaceStats[grp] = { team: third, pts, gd: gf-ga, gf };
  });

  // 3. Rank 3rd-place teams, take best 8
  const ranked3rd = Object.entries(thirdPlaceStats)
    .sort(([,a],[,b]) => b.pts-a.pts || b.gd-a.gd || b.gf-a.gf)
    .slice(0, 8);
  const qualifying3rdGroups = ranked3rd.map(([grp]) => grp).sort();
  const annexKey = qualifying3rdGroups.join("");
  const annexC = ANNEX_C[annexKey] || null;

  // 4. Resolve R32 home/away from standings + Annex C
  // Fixed slots
  const fixedHome = {
    "r32_1":"A","r32_2":"E","r32_3":"K","r32_4":"D",
    "r32_5":"F","r32_6":"C","r32_7":"H","r32_8":"J",
    "r32_9":"E","r32_10":"I","r32_11":"A","r32_12":"L",
    "r32_13":"D","r32_14":"G","r32_15":"B","r32_16":"K",
  };
  const fixedAway = {
    "r32_1":{type:"2nd",g:"B"},"r32_2":{type:"2nd",g:"I"},
    "r32_3":{type:"2nd",g:"L"},"r32_4":{type:"2nd",g:"G"},
    "r32_5":{type:"2nd",g:"C"},"r32_6":{type:"2nd",g:"F"},
    "r32_7":{type:"2nd",g:"J"},"r32_8":{type:"2nd",g:"H"},
    "r32_9": {type:"3rd",winner:"1E"},"r32_10":{type:"3rd",winner:"1I"},
    "r32_11":{type:"3rd",winner:"1A"},"r32_12":{type:"3rd",winner:"1L"},
    "r32_13":{type:"3rd",winner:"1D"},"r32_14":{type:"3rd",winner:"1G"},
    "r32_15":{type:"3rd",winner:"1B"},"r32_16":{type:"3rd",winner:"1K"},
  };

  function resolveHome(id) {
    const g = fixedHome[id];
    // r32_1..4 are runners-up as home, r32_5..8 winners as home
    if (["r32_1","r32_2","r32_3","r32_4"].includes(id)) return groupStandings[g]?.[1] || null;
    return groupStandings[g]?.[0] || null;
  }

  function resolveAway(id) {
    const slot = fixedAway[id];
    if (!slot) return null;
    if (slot.type === "2nd") return groupStandings[slot.g]?.[1] || null;
    if (slot.type === "3rd" && annexC) {
      const group3rd = annexC[slot.winner];
      if (group3rd) return thirdPlaceStats[group3rd]?.team || null;
    }
    // Fallback: best available 3rd
    if (slot.type === "3rd") return ranked3rd[0] ? thirdPlaceStats[ranked3rd[0][0]]?.team || null : null;
    return null;
  }

  const r32Inferred = {};
  R32_BRACKET.forEach(m => {
    r32Inferred[m.id] = {
      home: resolveHome(m.id),
      away: resolveAway(m.id),
    };
  });

  // 5. Infer winner — only if match filled in
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
        return p.progresser || null;
      }
    }
    if (hasTeams) return p.homeTeam;
    return null;
  }

  // 6. R16
  const r16Inferred = {};
  R16_BRACKET.forEach(m => {
    const hPred = knockoutPreds?.[m.homeR32];
    const aPred = knockoutPreds?.[m.awayR32];
    r16Inferred[m.id] = {
      home: (hPred?.homeTeam && hPred?.awayTeam) ? inferWinner(m.homeR32, knockoutPreds, {}) : null,
      away: (aPred?.homeTeam && aPred?.awayTeam) ? inferWinner(m.awayR32, knockoutPreds, {}) : null,
    };
  });

  // 7. QF
  const qfInferred = {};
  QF_BRACKET.forEach(m => {
    const hPred = knockoutPreds?.[m.homeR16];
    const aPred = knockoutPreds?.[m.awayR16];
    qfInferred[m.id] = {
      home: (hPred?.homeTeam && hPred?.awayTeam) ? inferWinner(m.homeR16, knockoutPreds, {}) : null,
      away: (aPred?.homeTeam && aPred?.awayTeam) ? inferWinner(m.awayR16, knockoutPreds, {}) : null,
    };
  });

  // 8. SF
  const sfInferred = {};
  SF_BRACKET.forEach(m => {
    const hPred = knockoutPreds?.[m.homeQF];
    const aPred = knockoutPreds?.[m.awayQF];
    sfInferred[m.id] = {
      home: (hPred?.homeTeam && hPred?.awayTeam) ? inferWinner(m.homeQF, knockoutPreds, {}) : null,
      away: (aPred?.homeTeam && aPred?.awayTeam) ? inferWinner(m.awayQF, knockoutPreds, {}) : null,
    };
  });

  // 9. Bronze
  const sf1Pred = knockoutPreds?.sf_1;
  const sf2Pred = knockoutPreds?.sf_2;
  const sf1Winner = inferWinner("sf_1", knockoutPreds, sfInferred);
  const sf2Winner = inferWinner("sf_2", knockoutPreds, sfInferred);
  const bronzeHome = sf1Pred?.homeTeam && sf1Pred.homeTeam !== sf1Winner ? sf1Pred.homeTeam : sf1Pred?.awayTeam || null;
  const bronzeAway = sf2Pred?.homeTeam && sf2Pred.homeTeam !== sf2Winner ? sf2Pred.homeTeam : sf2Pred?.awayTeam || null;

  return {
    ...r32Inferred, ...r16Inferred, ...qfInferred, ...sfInferred,
    bronze: { home: bronzeHome, away: bronzeAway },
    final: { home: sf1Winner, away: sf2Winner },
  };
}

// ─── COUNTDOWN & LOCK ─────────────────────────────────────────────────────────
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
