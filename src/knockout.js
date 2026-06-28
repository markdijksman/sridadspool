// ─── KNOCKOUT BRACKET LOGIC ───────────────────────────────────────────────────
// Official FIFA 2026 bracket with smart dropdowns per match slot
//
// FIX 2026-06-10:
// 1. 3rd-place slot assignment now works for ALL 495 group combinations:
//    official Annex C table where we have it, constraint solver otherwise.
//    The solver respects the official bracket constraints (each "best 3rd"
//    slot only accepts 3rds from its 5 allowed groups), so suggestions are
//    always in the dropdown, never duplicated, never vs own group winner.
// 2. Suggestions are gated on completeness: 1st/2nd of a group are only
//    suggested once ALL 6 matches of that group have a score; 3rd-place
//    suggestions only once ALL 12 groups are complete (best-8 ranking is
//    undefined before that).

import { GROUPS_2026 } from './data';

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

// Allowed 3rd-place candidate groups per winner slot — from the official
// FIFA bracket ("1E vs best 3rd of A/B/C/D/F" etc.)
const SLOT_ALLOWED_3RD = {
  "1E": ["A","B","C","D","F"],
  "1I": ["C","D","F","G","H"],
  "1A": ["C","E","F","H","I"],
  "1L": ["E","H","I","J","K"],
  "1D": ["B","E","F","I","J"],
  "1G": ["A","E","H","I","J"],
  "1B": ["E","F","G","I","J"],
  "1K": ["D","E","I","J","L"],
};

// Assign the 8 qualifying 3rd-place groups to the 8 winner slots.
// 1) Combination in the official ANNEX_C table → use FIFA's exact mapping.
// 2) Otherwise → backtracking search respecting SLOT_ALLOWED_3RD. This covers
//    all 495 possible combinations (verified by test harness) and guarantees:
//    suggestion is always in the dropdown's eligible list, no duplicates,
//    no team vs its own group winner.
export function assign3rdSlots(qualifyingGroups) {
  if (!qualifyingGroups || qualifyingGroups.length !== 8) return null;
  const key = [...qualifyingGroups].sort().join("");
  if (ANNEX_C[key]) return ANNEX_C[key];

  const qualSet = new Set(qualifyingGroups);
  // Slots with fewest candidates first → faster, more robust backtracking
  const slots = Object.keys(SLOT_ALLOWED_3RD).sort((a, b) =>
    SLOT_ALLOWED_3RD[a].filter(g => qualSet.has(g)).length -
    SLOT_ALLOWED_3RD[b].filter(g => qualSet.has(g)).length
  );
  const assigned = {};
  const used = new Set();
  function bt(i) {
    if (i === slots.length) return true;
    const slot = slots[i];
    for (const g of SLOT_ALLOWED_3RD[slot]) {
      if (qualSet.has(g) && !used.has(g)) {
        used.add(g); assigned[slot] = g;
        if (bt(i + 1)) return true;
        used.delete(g); delete assigned[slot];
      }
    }
    return false;
  }
  return bt(0) ? assigned : null;
}

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

// ─── OFFICIAL CONFIRMED ROUND OF 32 ──────────────────────────────────────────
// Once the group stage is over, the real R32 matchups are known. We surface
// these as the suggestion for each R32 slot instead of recomputing from group
// standings — recomputation can disagree with FIFA on tiebreakers and the
// best-8 third-place selection, so using the confirmed pairings guarantees the
// bracket shown matches reality exactly. These are SUGGESTIONS only: a user's
// own picks are never overwritten automatically.
// Slot ids map to match numbers: r32_1 = M73 … r32_16 = M88.
// Team names use the exact pool spelling (see GROUPS_2026 in data.js).
export const R32_REAL = {
  r32_1:  { home: "South Africa",  away: "Canada" },                  // M73 · 2A vs 2B
  r32_2:  { home: "Germany",       away: "Paraguay" },                // M74 · 1E vs best 3rd
  r32_3:  { home: "Netherlands",   away: "Morocco" },                 // M75 · 1F vs 2C
  r32_4:  { home: "Brazil",        away: "Japan" },                   // M76 · 1C vs 2F
  r32_5:  { home: "France",        away: "Sweden" },                  // M77 · 1I vs best 3rd
  r32_6:  { home: "Ivory Coast",   away: "Norway" },                  // M78 · 2E vs 2I
  r32_7:  { home: "Mexico",        away: "Ecuador" },                 // M79 · 1A vs best 3rd
  r32_8:  { home: "England",       away: "DR Congo" },                // M80 · 1L vs best 3rd
  r32_9:  { home: "United States", away: "Bosnia and Herzegovina" },  // M81 · 1D vs best 3rd
  r32_10: { home: "Belgium",       away: "Senegal" },                 // M82 · 1G vs best 3rd
  r32_11: { home: "Portugal",      away: "Croatia" },                 // M83 · 2K vs 2L
  r32_12: { home: "Spain",         away: "Austria" },                 // M84 · 1H vs 2J
  r32_13: { home: "Switzerland",   away: "Algeria" },                 // M85 · 1B vs best 3rd
  r32_14: { home: "Argentina",     away: "Cape Verde" },              // M86 · 1J vs 2H
  r32_15: { home: "Colombia",      away: "Ghana" },                   // M87 · 1K vs best 3rd
  r32_16: { home: "Australia",     away: "Egypt" },                   // M88 · 2D vs 2G
};

// Round of 16 — winners of R32 pairs (OFFICIAL FIFA bracket, M89–M96)
// slot ids: r16_1=M89 … r16_8=M96
export const R16_BRACKET = [
  { id:"r16_1", label:"M89 · W74 vs W77", homeR32:"r32_2",  awayR32:"r32_5"  },
  { id:"r16_2", label:"M90 · W73 vs W75", homeR32:"r32_1",  awayR32:"r32_3"  },
  { id:"r16_3", label:"M91 · W76 vs W78", homeR32:"r32_4",  awayR32:"r32_6"  },
  { id:"r16_4", label:"M92 · W79 vs W80", homeR32:"r32_7",  awayR32:"r32_8"  },
  { id:"r16_5", label:"M93 · W83 vs W84", homeR32:"r32_11", awayR32:"r32_12" },
  { id:"r16_6", label:"M94 · W81 vs W82", homeR32:"r32_9",  awayR32:"r32_10" },
  { id:"r16_7", label:"M95 · W86 vs W88", homeR32:"r32_14", awayR32:"r32_16" },
  { id:"r16_8", label:"M96 · W85 vs W87", homeR32:"r32_13", awayR32:"r32_15" },
];

// Quarter-finals (OFFICIAL bracket, M97–M100)
// M97=W89vW90 (left top), M98=W93vW94 (left bottom),
// M99=W91vW92 (right top), M100=W95vW96 (right bottom)
export const QF_BRACKET = [
  { id:"qf_1", label:"M97 · W89 vs W90",  homeR16:"r16_1", awayR16:"r16_2" },
  { id:"qf_2", label:"M98 · W93 vs W94",  homeR16:"r16_5", awayR16:"r16_6" },
  { id:"qf_3", label:"M99 · W91 vs W92",  homeR16:"r16_3", awayR16:"r16_4" },
  { id:"qf_4", label:"M100 · W95 vs W96", homeR16:"r16_7", awayR16:"r16_8" },
];

export const SF_BRACKET = [
  { id:"sf_1", label:"M101 · W97 vs W98",  homeQF:"qf_1", awayQF:"qf_2" },
  { id:"sf_2", label:"M102 · W99 vs W100", homeQF:"qf_3", awayQF:"qf_4" },
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

// A group's standings only count once ALL its matches have a score
// (real result or user prediction)
function isGroupComplete(groupMatches, preds) {
  if (!groupMatches.length) return false;
  return groupMatches.every(m => {
    const r = m.result || preds[m.id];
    if (!r) return false;
    return !isNaN(parseInt(r.homeGoals)) && !isNaN(parseInt(r.awayGoals));
  });
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

// Given all group standings, infer what team fills a slot.
// Only suggests when the slot's group is COMPLETE (all matches scored).
function inferSlotTeam(slot, groupStandings, completeGroups) {
  if (!slot) return null;
  if (slot.type === "1st") {
    return completeGroups.has(slot.group) ? (groupStandings[slot.group]?.[0] || null) : null;
  }
  if (slot.type === "2nd") {
    return completeGroups.has(slot.group) ? (groupStandings[slot.group]?.[1] || null) : null;
  }
  // type "3rd" is handled by resolve3rd in inferKnockoutBracket
  return null;
}

// Main function: given userPredictions + groupMatches + knockoutMatches,
// return suggested homeTeam/awayTeam for each knockout match
export function inferKnockoutBracket(groupMatches, knockoutPreds, userGroupPreds, realResults) {
  // 1. Infer group standings from predictions (falling back to real results)
  //    Track which groups are complete — suggestions only come from those.
  const groupStandings = {};
  const completeGroups = new Set();
  Object.entries(GROUPS_2026).forEach(([grp, teams]) => {
    const matches = groupMatches.filter(m => m.group === grp);
    groupStandings[grp] = inferGroupStanding(teams, matches, userGroupPreds);
    if (isGroupComplete(matches, userGroupPreds)) completeGroups.add(grp);
  });

  // 2. 3rd-place assignment — only meaningful once ALL 12 groups are complete
  //    (the best-8 ranking is undefined before that).
  let slotAssignment = null;   // { "1E": "C", ... } winner slot → group of 3rd
  const thirdStats = {};
  if (completeGroups.size === 12) {
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

    // Rank all 12 third-place teams; best 8 qualify
    // (points → goal difference → goals scored; remaining ties: group order,
    //  which is deterministic — FIFA would use fair play points / lots)
    const ranked3rd = Object.entries(thirdStats)
      .sort(([, a], [, b]) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)
      .slice(0, 8);
    slotAssignment = assign3rdSlots(ranked3rd.map(([g]) => g));
  }

  // Resolve which 3rd-place team plays a given winner slot
  function resolve3rd(matchId) {
    const winnerSlot = R32_3RD_WINNER[matchId];
    if (!winnerSlot || !slotAssignment) return null;
    const grp3rd = slotAssignment[winnerSlot];
    return grp3rd ? (thirdStats[grp3rd]?.team || null) : null;
  }

  // 2b. R32 teams — use the OFFICIAL confirmed Round of 32 (R32_REAL) as the
  // suggestion so it always matches FIFA exactly, regardless of how group
  // standings would recompute. Falls back to inference only for any slot not
  // present in R32_REAL (e.g. before the bracket is confirmed).
  const r32Inferred = {};
  Object.keys(R32_HOME_SLOT).forEach(id => {
    if (R32_REAL[id]) {
      r32Inferred[id] = { home: R32_REAL[id].home, away: R32_REAL[id].away };
      return;
    }
    const homeSlot = R32_HOME_SLOT[id];
    const awaySlot = R32_AWAY_SLOT[id];
    r32Inferred[id] = {
      home: homeSlot?.type === "3rd" ? resolve3rd(id) : inferSlotTeam(homeSlot, groupStandings, completeGroups),
      away: awaySlot?.type === "3rd" ? resolve3rd(id) : inferSlotTeam(awaySlot, groupStandings, completeGroups),
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

// ─── PHASE TIMING ─────────────────────────────────────────────────────────────
// Phase 1: group predictions — open until first match kickoff
// Phase 2: tournament running, knockout predictions locked
// Phase 3: knockout window — opens after the last group matches,
//          closes at the first Round of 32 kickoff
// Phase 4: everything locked

export const FIRST_MATCH_UTC = new Date("2026-06-11T19:00:00Z");        // Thu 11 Jun · 23:00 Dubai
export const KNOCKOUT_OPEN_UTC = new Date("2026-06-28T06:00:00Z");      // Sun 28 Jun · 10:00 Dubai (after last group matches)
export const KNOCKOUT_DEADLINE_UTC = new Date("2026-06-28T19:00:00Z");  // Sun 28 Jun · 23:00 Dubai (first R32 kickoff)

export function isPredictionLocked() {
  return new Date() >= FIRST_MATCH_UTC;
}

// Knockout window open? Admin can override via the knockoutOpen flag in pool state.
export function isKnockoutOpen(shared) {
  if (shared && shared.knockoutOpen === true) return true; // admin override
  return new Date() >= KNOCKOUT_OPEN_UTC;
}

export function isKnockoutLocked() {
  return new Date() >= KNOCKOUT_DEADLINE_UTC;
}

export function getCountdownTo(target) {
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) return null;
  const days    = Math.floor(diff / (1000*60*60*24));
  const hours   = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
  const seconds = Math.floor((diff % (1000*60)) / 1000);
  return { days, hours, minutes, seconds, diff };
}

export function getCountdown() {
  return getCountdownTo(FIRST_MATCH_UTC);
}

// ─── PER-MATCH LOCKING (late entry support) ──────────────────────────────────
// Normally all group predictions lock at the first kickoff. When the admin
// enables lateEntryOpen in the pool state, individual matches stay editable
// until their own kickoff (or until a result is entered) — so late joiners
// can still fill in everything that hasn't been played yet.

const MONTHS = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };

// Parse "Thu 11 Jun" + "23:00" (Dubai time, UTC+4) → Date in UTC
export function getMatchKickoffUTC(m) {
  try {
    const dm = String(m.date || "").match(/(\d{1,2})\s+([A-Za-z]{3})/);
    const tm = String(m.time || "").match(/(\d{1,2}):(\d{2})/);
    if (!dm || !tm) return null;
    const day = parseInt(dm[1]);
    const month = MONTHS[dm[2]];
    if (month === undefined) return null;
    const hh = parseInt(tm[1]), mm = parseInt(tm[2]);
    // Dubai = UTC+4, no DST
    return new Date(Date.UTC(2026, month, day, hh - 4, mm, 0));
  } catch {
    return null;
  }
}

// Is this specific group match locked for prediction edits?
export function isGroupMatchLocked(m, shared) {
  if (m.result) return true;                       // played → always locked
  const ko = getMatchKickoffUTC(m);
  if (ko && new Date() >= ko) return true;         // kicked off → always locked
  if (!isPredictionLocked()) return false;         // before tournament → open
  return !(shared && shared.lateEntryOpen === true); // after first kickoff: only open during late entry
}
