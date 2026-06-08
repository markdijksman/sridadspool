// ─── KNOCKOUT BRACKET LOGIC ───────────────────────────────────────────────────
// Original IDs preserved — data in Supabase stays intact
// Annex C logic added for correct auto-suggest
// Source: Wikipedia "2026 FIFA World Cup knockout stage"

import { GROUPS_2026 } from './data';

const G = GROUPS_2026;
const ALL = [...G.A,...G.B,...G.C,...G.D,...G.E,...G.F,...G.G,...G.H,...G.I,...G.J,...G.K,...G.L];

// Original R32 bracket IDs (unchanged to preserve Supabase data)
export const R32_BRACKET = [
  { id:"r32_1",  label:"1A vs 2B", home: G.A, away: G.B },
  { id:"r32_2",  label:"1C vs 2D", home: G.C, away: G.D },
  { id:"r32_3",  label:"1E vs 2F", home: G.E, away: G.F },
  { id:"r32_4",  label:"1G vs 2H", home: G.G, away: G.H },
  { id:"r32_5",  label:"1I vs 2J", home: G.I, away: G.J },
  { id:"r32_6",  label:"1K vs 2L", home: G.K, away: G.L },
  { id:"r32_7",  label:"1B vs 2A", home: G.B, away: G.A },
  { id:"r32_8",  label:"1D vs 2C", home: G.D, away: G.C },
  { id:"r32_9",  label:"1F vs 2E", home: G.F, away: G.E },
  { id:"r32_10", label:"1H vs 2G", home: G.H, away: G.G },
  { id:"r32_11", label:"1J vs 2I", home: G.J, away: G.I },
  { id:"r32_12", label:"1L vs 2K", home: G.L, away: G.K },
  { id:"r32_13", label:"Group winner vs best 3rd #1", home: ALL, away: ALL },
  { id:"r32_14", label:"Group winner vs best 3rd #2", home: ALL, away: ALL },
  { id:"r32_15", label:"Group winner vs best 3rd #3", home: ALL, away: ALL },
  { id:"r32_16", label:"Group winner vs best 3rd #4", home: ALL, away: ALL },
];

export const R16_BRACKET = [
  { id:"r16_1", label:"W r32_1 vs W r32_2",   homeR32:"r32_1",  awayR32:"r32_2"  },
  { id:"r16_2", label:"W r32_3 vs W r32_4",   homeR32:"r32_3",  awayR32:"r32_4"  },
  { id:"r16_3", label:"W r32_5 vs W r32_6",   homeR32:"r32_5",  awayR32:"r32_6"  },
  { id:"r16_4", label:"W r32_7 vs W r32_8",   homeR32:"r32_7",  awayR32:"r32_8"  },
  { id:"r16_5", label:"W r32_9 vs W r32_10",  homeR32:"r32_9",  awayR32:"r32_10" },
  { id:"r16_6", label:"W r32_11 vs W r32_12", homeR32:"r32_11", awayR32:"r32_12" },
  { id:"r16_7", label:"W r32_13 vs W r32_14", homeR32:"r32_13", awayR32:"r32_14" },
  { id:"r16_8", label:"W r32_15 vs W r32_16", homeR32:"r32_15", awayR32:"r32_16" },
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

// ─── ANNEX C TABLE ────────────────────────────────────────────────────────────
// Maps sorted 8-group key → which 3rd-place group plays which winner slot
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

// ─── GROUP STANDING INFERENCE ─────────────────────────────────────────────────
function inferGroupStanding(groupTeams, groupMatches, preds) {
  const pts = {}, gf = {}, ga = {};
  groupTeams.forEach(t => { pts[t]=0; gf[t]=0; ga[t]=0; });
  groupMatches.forEach(m => {
    const r = m.result || preds[m.id];
    if (!r) return;
    const hg = parseInt(r.homeGoals), ag = parseInt(r.awayGoals);
    if (isNaN(hg)||isNaN(ag)) return;
    gf[m.home]=(gf[m.home]||0)+hg; ga[m.home]=(ga[m.home]||0)+ag;
    gf[m.away]=(gf[m.away]||0)+ag; ga[m.away]=(ga[m.away]||0)+hg;
    if (hg>ag) pts[m.home]=(pts[m.home]||0)+3;
    else if (hg===ag){pts[m.home]=(pts[m.home]||0)+1;pts[m.away]=(pts[m.away]||0)+1;}
    else pts[m.away]=(pts[m.away]||0)+3;
  });
  return [...groupTeams].sort((a,b)=>{
    if (pts[b]!==pts[a]) return pts[b]-pts[a];
    const gdA=(gf[a]||0)-(ga[a]||0), gdB=(gf[b]||0)-(ga[b]||0);
    if (gdB!==gdA) return gdB-gdA;
    return (gf[b]||0)-(gf[a]||0);
  });
}

// ─── MAIN INFERENCE ───────────────────────────────────────────────────────────
export function inferKnockoutBracket(groupMatches, knockoutPreds, userGroupPreds) {
  // 1. Group standings
  const groupStandings = {};
  Object.entries(GROUPS_2026).forEach(([grp,teams]) => {
    groupStandings[grp] = inferGroupStanding(teams, groupMatches.filter(m=>m.group===grp), userGroupPreds);
  });

  // 2. 3rd-place teams with stats
  const third = {};
  Object.entries(GROUPS_2026).forEach(([grp,teams]) => {
    const t = groupStandings[grp][2];
    if (!t) return;
    let pts=0,gf=0,ga=0;
    groupMatches.filter(m=>m.group===grp).forEach(m=>{
      const r=m.result||userGroupPreds[m.id]; if(!r) return;
      const hg=parseInt(r.homeGoals),ag=parseInt(r.awayGoals); if(isNaN(hg)||isNaN(ag)) return;
      if(m.home===t){gf+=hg;ga+=ag;if(hg>ag)pts+=3;else if(hg===ag)pts+=1;}
      if(m.away===t){gf+=ag;ga+=hg;if(ag>hg)pts+=3;else if(hg===ag)pts+=1;}
    });
    third[grp]={team:t,pts,gd:gf-ga,gf};
  });

  // 3. Best 8 third-place teams via Annex C
  const ranked = Object.entries(third)
    .sort(([,a],[,b])=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf)
    .slice(0,8);
  const key = ranked.map(([g])=>g).sort().join("");
  const annexC = ANNEX_C[key]||null;

  // 4. R32 home slots (group 1st/2nd)
  const homeSlot = {
    r32_1:"A",r32_2:"C",r32_3:"E",r32_4:"G",r32_5:"I",r32_6:"K",
    r32_7:"B",r32_8:"D",r32_9:"F",r32_10:"H",r32_11:"J",r32_12:"L",
    r32_13:null,r32_14:null,r32_15:null,r32_16:null,
  };
  // Annex C maps winner label → 3rd group
  // r32_13..16 home teams are the 4 winners that play 3rd — 1E,1I,1A,1L (per official schedule)
  // But original IDs don't change — just use Annex C for auto-suggest
  const annexWinners = ["1A","1B","1D","1E","1G","1I","1K","1L"];

  function get1st(g) { return groupStandings[g]?.[0]||null; }
  function get2nd(g) { return groupStandings[g]?.[1]||null; }
  function get3rd(winnerKey) {
    if (!annexC) return null;
    const g = annexC[winnerKey];
    return g ? third[g]?.team||null : null;
  }

  const r32Inferred = {
    r32_1:  {home:get1st("A"), away:get2nd("B")},
    r32_2:  {home:get1st("C"), away:get2nd("D")},
    r32_3:  {home:get1st("E"), away:get2nd("F")},
    r32_4:  {home:get1st("G"), away:get2nd("H")},
    r32_5:  {home:get1st("I"), away:get2nd("J")},
    r32_6:  {home:get1st("K"), away:get2nd("L")},
    r32_7:  {home:get1st("B"), away:get2nd("A")},
    r32_8:  {home:get1st("D"), away:get2nd("C")},
    r32_9:  {home:get1st("F"), away:get2nd("E")},
    r32_10: {home:get1st("H"), away:get2nd("G")},
    r32_11: {home:get1st("J"), away:get2nd("I")},
    r32_12: {home:get1st("L"), away:get2nd("K")},
    // 3rd place slots — Annex C based
    r32_13: {home:get3rd("1E"), away:get3rd("1I")},
    r32_14: {home:get3rd("1A"), away:get3rd("1L")},
    r32_15: {home:get3rd("1D"), away:get3rd("1G")},
    r32_16: {home:get3rd("1B"), away:get3rd("1K")},
  };

  // 5. Winner inference — only if match filled
  function inferWinner(matchId, preds) {
    const p = preds?.[matchId];
    const hasTeams = p?.homeTeam && p?.awayTeam;
    const hasScore = p?.homeGoals!==undefined && p?.homeGoals!=="" &&
                     p?.awayGoals!==undefined && p?.awayGoals!=="";
    if (hasTeams && hasScore) {
      const hg=parseInt(p.homeGoals), ag=parseInt(p.awayGoals);
      if (!isNaN(hg)&&!isNaN(ag)) {
        if (hg>ag) return p.homeTeam;
        if (ag>hg) return p.awayTeam;
        return p.progresser||null;
      }
    }
    if (hasTeams) return p.homeTeam;
    return null;
  }

  // 6. R16
  const r16Inferred = {};
  R16_BRACKET.forEach(m=>{
    const hP=knockoutPreds?.[m.homeR32], aP=knockoutPreds?.[m.awayR32];
    r16Inferred[m.id]={
      home:(hP?.homeTeam&&hP?.awayTeam)?inferWinner(m.homeR32,knockoutPreds):null,
      away:(aP?.homeTeam&&aP?.awayTeam)?inferWinner(m.awayR32,knockoutPreds):null,
    };
  });

  // 7. QF
  const qfInferred = {};
  QF_BRACKET.forEach(m=>{
    const hP=knockoutPreds?.[m.homeR16], aP=knockoutPreds?.[m.awayR16];
    qfInferred[m.id]={
      home:(hP?.homeTeam&&hP?.awayTeam)?inferWinner(m.homeR16,knockoutPreds):null,
      away:(aP?.homeTeam&&aP?.awayTeam)?inferWinner(m.awayR16,knockoutPreds):null,
    };
  });

  // 8. SF
  const sfInferred = {};
  SF_BRACKET.forEach(m=>{
    const hP=knockoutPreds?.[m.homeQF], aP=knockoutPreds?.[m.awayQF];
    sfInferred[m.id]={
      home:(hP?.homeTeam&&hP?.awayTeam)?inferWinner(m.homeQF,knockoutPreds):null,
      away:(aP?.homeTeam&&aP?.awayTeam)?inferWinner(m.awayQF,knockoutPreds):null,
    };
  });

  // 9. Bronze & Final
  const sf1W=inferWinner("sf_1",knockoutPreds);
  const sf2W=inferWinner("sf_2",knockoutPreds);
  const sf1P=knockoutPreds?.sf_1, sf2P=knockoutPreds?.sf_2;

  return {
    ...r32Inferred, ...r16Inferred, ...qfInferred, ...sfInferred,
    bronze:{
      home:sf1P?.homeTeam&&sf1P.homeTeam!==sf1W?sf1P.homeTeam:sf1P?.awayTeam||null,
      away:sf2P?.homeTeam&&sf2P.homeTeam!==sf2W?sf2P.homeTeam:sf2P?.awayTeam||null,
    },
    final:{home:sf1W, away:sf2W},
  };
}

// ─── COUNTDOWN & LOCK ─────────────────────────────────────────────────────────
export const FIRST_MATCH_UTC = new Date("2026-06-11T19:00:00Z");
export function isPredictionLocked() { return new Date() >= FIRST_MATCH_UTC; }
export function getCountdown() {
  const now=new Date(), diff=FIRST_MATCH_UTC-now;
  if (diff<=0) return null;
  return {
    days:Math.floor(diff/(1000*60*60*24)),
    hours:Math.floor((diff%(1000*60*60*24))/(1000*60*60)),
    minutes:Math.floor((diff%(1000*60*60))/(1000*60)),
    seconds:Math.floor((diff%(1000*60))/1000),
    diff,
  };
}
