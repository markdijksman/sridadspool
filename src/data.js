// ─── OFFICIAL FIFA WORLD CUP 2026 DATA ───────────────────────────────────────
// Source: FIFA official draw + Yahoo Sports / Al Jazeera verified schedule
// All times shown in Dubai time (GST = UTC+4)

export const GROUPS_2026 = {
  A: ["Mexico","South Africa","Korea Republic","Czechia"],
  B: ["Canada","Bosnia and Herzegovina","Qatar","Switzerland"],
  C: ["Brazil","Morocco","Haiti","Scotland"],
  D: ["United States","Paraguay","Australia","Türkiye"],
  E: ["Germany","Curaçao","Ivory Coast","Ecuador"],
  F: ["Netherlands","Japan","Sweden","Tunisia"],
  G: ["Belgium","Egypt","Iran","New Zealand"],
  H: ["Spain","Cape Verde","Saudi Arabia","Uruguay"],
  I: ["France","Senegal","Iraq","Norway"],
  J: ["Argentina","Algeria","Austria","Jordan"],
  K: ["Portugal","DR Congo","Uzbekistan","Colombia"],
  L: ["England","Croatia","Ghana","Panama"],
};

export const FLAGS = {
  "Mexico":"🇲🇽","South Africa":"🇿🇦","Korea Republic":"🇰🇷","Czechia":"🇨🇿",
  "Canada":"🇨🇦","Bosnia and Herzegovina":"🇧🇦","Qatar":"🇶🇦","Switzerland":"🇨🇭",
  "Brazil":"🇧🇷","Morocco":"🇲🇦","Haiti":"🇭🇹","Scotland":"🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "United States":"🇺🇸","Paraguay":"🇵🇾","Australia":"🇦🇺","Türkiye":"🇹🇷",
  "Germany":"🇩🇪","Curaçao":"🇨🇼","Ivory Coast":"🇨🇮","Ecuador":"🇪🇨",
  "Netherlands":"🇳🇱","Japan":"🇯🇵","Sweden":"🇸🇪","Tunisia":"🇹🇳",
  "Belgium":"🇧🇪","Egypt":"🇪🇬","Iran":"🇮🇷","New Zealand":"🇳🇿",
  "Spain":"🇪🇸","Cape Verde":"🇨🇻","Saudi Arabia":"🇸🇦","Uruguay":"🇺🇾",
  "France":"🇫🇷","Senegal":"🇸🇳","Iraq":"🇮🇶","Norway":"🇳🇴",
  "Argentina":"🇦🇷","Algeria":"🇩🇿","Austria":"🇦🇹","Jordan":"🇯🇴",
  "Portugal":"🇵🇹","DR Congo":"🇨🇩","Uzbekistan":"🇺🇿","Colombia":"🇨🇴",
  "England":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Croatia":"🇭🇷","Ghana":"🇬🇭","Panama":"🇵🇦",
  "TBD":"🏳️",
};

export const ALL_TEAMS = Object.values(GROUPS_2026).flat().sort((a, b) => a.localeCompare(b));

// Dubai time = UTC+4. All times converted from ET (UTC-4 in summer) → Dubai (UTC+4) = ET + 8 hours
// "3pm ET" = 23:00 Dubai | "6pm ET" = 02:00+1 Dubai | "9pm ET" = 05:00+1 Dubai | "10pm ET" = 06:00+1 Dubai
// "12pm ET" = 20:00 Dubai | "3am ET" = 11:00 Dubai

// Group stage matches — official FIFA schedule
export function generateGroupMatches() {
  return [
    // GROUP A — Fox Sports official (ET+8=Dubai)
    { id:1,  group:"A", home:"Mexico",                   away:"South Africa",           date:"Thu 11 Jun", time:"23:00", venue:"Estadio Azteca, Mexico City", result:null },
    { id:2,  group:"A", home:"Korea Republic",           away:"Czechia",                date:"Fri 12 Jun", time:"06:00", venue:"Estadio Akron, Guadalajara", result:null },
    { id:3,  group:"A", home:"Czechia",                  away:"South Africa",           date:"Thu 18 Jun", time:"20:00", venue:"Mercedes-Benz Stadium, Atlanta", result:null },
    { id:4,  group:"A", home:"Mexico",                   away:"Korea Republic",         date:"Fri 19 Jun", time:"05:00", venue:"Estadio Akron, Guadalajara", result:null },
    { id:5,  group:"A", home:"Mexico",                   away:"Czechia",                date:"Thu 25 Jun", time:"05:00", venue:"Estadio Azteca, Mexico City", result:null },
    { id:6,  group:"A", home:"Korea Republic",           away:"South Africa",           date:"Thu 25 Jun", time:"05:00", venue:"Estadio BBVA, Monterrey", result:null },
    // GROUP B
    { id:7,  group:"B", home:"Canada",                   away:"Bosnia and Herzegovina", date:"Fri 12 Jun", time:"23:00", venue:"BMO Field, Toronto", result:null },
    { id:8,  group:"B", home:"Qatar",                    away:"Switzerland",            date:"Sat 13 Jun", time:"23:00", venue:"Levi's Stadium, San Francisco", result:null },
    { id:9,  group:"B", home:"Switzerland",              away:"Bosnia and Herzegovina", date:"Thu 18 Jun", time:"23:00", venue:"SoFi Stadium, Los Angeles", result:null },
    { id:10, group:"B", home:"Canada",                   away:"Qatar",                  date:"Fri 19 Jun", time:"02:00", venue:"BC Place, Vancouver", result:null },
    { id:11, group:"B", home:"Switzerland",              away:"Canada",                 date:"Wed 24 Jun", time:"23:00", venue:"BC Place, Vancouver", result:null },
    { id:12, group:"B", home:"Bosnia and Herzegovina",   away:"Qatar",                  date:"Wed 24 Jun", time:"23:00", venue:"Lumen Field, Seattle", result:null },
    // GROUP C
    { id:13, group:"C", home:"Brazil",                   away:"Morocco",                date:"Sun 14 Jun", time:"02:00", venue:"MetLife Stadium, New Jersey", result:null },
    { id:14, group:"C", home:"Haiti",                    away:"Scotland",               date:"Sun 14 Jun", time:"05:00", venue:"Gillette Stadium, Boston", result:null },
    { id:15, group:"C", home:"Scotland",                 away:"Morocco",                date:"Fri 19 Jun", time:"23:00", venue:"Gillette Stadium, Boston", result:null },
    { id:16, group:"C", home:"Brazil",                   away:"Haiti",                  date:"Sat 20 Jun", time:"05:00", venue:"Lincoln Financial Field, Philadelphia", result:null },
    { id:17, group:"C", home:"Brazil",                   away:"Scotland",               date:"Thu 25 Jun", time:"02:00", venue:"Hard Rock Stadium, Miami", result:null },
    { id:18, group:"C", home:"Morocco",                  away:"Haiti",                  date:"Thu 25 Jun", time:"02:00", venue:"Mercedes-Benz Stadium, Atlanta", result:null },
    // GROUP D
    { id:19, group:"D", home:"United States",            away:"Paraguay",               date:"Sat 13 Jun", time:"05:00", venue:"SoFi Stadium, Los Angeles", result:null },
    { id:20, group:"D", home:"Australia",                away:"Türkiye",                date:"Sun 14 Jun", time:"08:00", venue:"BC Place, Vancouver", result:null },
    { id:21, group:"D", home:"United States",            away:"Australia",              date:"Fri 19 Jun", time:"23:00", venue:"Lumen Field, Seattle", result:null },
    { id:22, group:"D", home:"Türkiye",                  away:"Paraguay",               date:"Sat 20 Jun", time:"08:00", venue:"Levi's Stadium, San Francisco", result:null },
    { id:23, group:"D", home:"United States",            away:"Türkiye",                date:"Fri 26 Jun", time:"06:00", venue:"SoFi Stadium, Los Angeles", result:null },
    { id:24, group:"D", home:"Paraguay",                 away:"Australia",              date:"Fri 26 Jun", time:"06:00", venue:"Levi's Stadium, San Francisco", result:null },
    // GROUP E
    { id:25, group:"E", home:"Germany",                  away:"Curaçao",                date:"Sun 14 Jun", time:"21:00", venue:"NRG Stadium, Houston", result:null },
    { id:26, group:"E", home:"Ivory Coast",              away:"Ecuador",                date:"Mon 15 Jun", time:"03:00", venue:"AT&T Stadium, Dallas", result:null },
    { id:27, group:"E", home:"Germany",                  away:"Ivory Coast",            date:"Sun 21 Jun", time:"00:00", venue:"BMO Field, Toronto", result:null },
    { id:28, group:"E", home:"Ecuador",                  away:"Curaçao",                date:"Sun 21 Jun", time:"04:00", venue:"Arrowhead Stadium, Kansas City", result:null },
    { id:29, group:"E", home:"Ecuador",                  away:"Germany",                date:"Fri 26 Jun", time:"00:00", venue:"MetLife Stadium, New Jersey", result:null },
    { id:30, group:"E", home:"Curaçao",                  away:"Ivory Coast",            date:"Fri 26 Jun", time:"00:00", venue:"Lincoln Financial Field, Philadelphia", result:null },
    // GROUP F
    { id:31, group:"F", home:"Netherlands",              away:"Japan",                  date:"Mon 15 Jun", time:"00:00", venue:"AT&T Stadium, Dallas", result:null },
    { id:32, group:"F", home:"Sweden",                   away:"Tunisia",                date:"Mon 15 Jun", time:"06:00", venue:"Estadio BBVA, Monterrey", result:null },
    { id:33, group:"F", home:"Netherlands",              away:"Sweden",                 date:"Sat 20 Jun", time:"21:00", venue:"NRG Stadium, Houston", result:null },
    { id:34, group:"F", home:"Japan",                    away:"Tunisia",                date:"Sun 21 Jun", time:"08:00", venue:"Estadio BBVA, Monterrey", result:null },
    { id:35, group:"F", home:"Tunisia",                  away:"Netherlands",            date:"Fri 26 Jun", time:"03:00", venue:"Arrowhead Stadium, Kansas City", result:null },
    { id:36, group:"F", home:"Japan",                    away:"Sweden",                 date:"Fri 26 Jun", time:"03:00", venue:"AT&T Stadium, Dallas", result:null },
    // GROUP G
    { id:37, group:"G", home:"Belgium",                  away:"Egypt",                  date:"Mon 15 Jun", time:"23:00", venue:"Lumen Field, Seattle", result:null },
    { id:38, group:"G", home:"Iran",                     away:"New Zealand",            date:"Tue 16 Jun", time:"05:00", venue:"SoFi Stadium, Los Angeles", result:null },
    { id:39, group:"G", home:"Belgium",                  away:"Iran",                   date:"Sun 21 Jun", time:"23:00", venue:"SoFi Stadium, Los Angeles", result:null },
    { id:40, group:"G", home:"New Zealand",              away:"Egypt",                  date:"Mon 22 Jun", time:"05:00", venue:"BC Place, Vancouver", result:null },
    { id:41, group:"G", home:"Egypt",                    away:"Iran",                   date:"Sat 27 Jun", time:"07:00", venue:"Lumen Field, Seattle", result:null },
    { id:42, group:"G", home:"New Zealand",              away:"Belgium",                date:"Sat 27 Jun", time:"07:00", venue:"BC Place, Vancouver", result:null },
    // GROUP H
    { id:43, group:"H", home:"Spain",                    away:"Cape Verde",             date:"Mon 15 Jun", time:"20:00", venue:"Mercedes-Benz Stadium, Atlanta", result:null },
    { id:44, group:"H", home:"Saudi Arabia",             away:"Uruguay",                date:"Tue 16 Jun", time:"02:00", venue:"Hard Rock Stadium, Miami", result:null },
    { id:45, group:"H", home:"Spain",                    away:"Saudi Arabia",           date:"Sun 21 Jun", time:"20:00", venue:"Mercedes-Benz Stadium, Atlanta", result:null },
    { id:46, group:"H", home:"Uruguay",                  away:"Cape Verde",             date:"Mon 22 Jun", time:"02:00", venue:"Hard Rock Stadium, Miami", result:null },
    { id:47, group:"H", home:"Cape Verde",               away:"Saudi Arabia",           date:"Sat 27 Jun", time:"04:00", venue:"NRG Stadium, Houston", result:null },
    { id:48, group:"H", home:"Uruguay",                  away:"Spain",                  date:"Sat 27 Jun", time:"04:00", venue:"Estadio Akron, Guadalajara", result:null },
    // GROUP I
    { id:49, group:"I", home:"France",                   away:"Senegal",                date:"Tue 16 Jun", time:"23:00", venue:"MetLife Stadium, New Jersey", result:null },
    { id:50, group:"I", home:"Iraq",                     away:"Norway",                 date:"Wed 17 Jun", time:"02:00", venue:"Gillette Stadium, Boston", result:null },
    { id:51, group:"I", home:"Norway",                   away:"Senegal",                date:"Tue 23 Jun", time:"04:00", venue:"MetLife Stadium, New Jersey", result:null },
    { id:52, group:"I", home:"France",                   away:"Iraq",                   date:"Tue 23 Jun", time:"01:00", venue:"Lincoln Financial Field, Philadelphia", result:null },
    { id:53, group:"I", home:"Norway",                   away:"France",                 date:"Fri 26 Jun", time:"23:00", venue:"Gillette Stadium, Boston", result:null },
    { id:54, group:"I", home:"Senegal",                  away:"Iraq",                   date:"Fri 26 Jun", time:"23:00", venue:"BMO Field, Toronto", result:null },
    // GROUP J
    { id:55, group:"J", home:"Argentina",                away:"Algeria",                date:"Wed 17 Jun", time:"05:00", venue:"Arrowhead Stadium, Kansas City", result:null },
    { id:56, group:"J", home:"Austria",                  away:"Jordan",                 date:"Wed 17 Jun", time:"08:00", venue:"Levi's Stadium, San Francisco", result:null },
    { id:57, group:"J", home:"Argentina",                away:"Austria",                date:"Mon 22 Jun", time:"21:00", venue:"AT&T Stadium, Dallas", result:null },
    { id:58, group:"J", home:"Jordan",                   away:"Algeria",                date:"Tue 23 Jun", time:"07:00", venue:"Levi's Stadium, San Francisco", result:null },
    { id:59, group:"J", home:"Jordan",                   away:"Argentina",              date:"Sun 28 Jun", time:"06:00", venue:"AT&T Stadium, Dallas", result:null },
    { id:60, group:"J", home:"Algeria",                  away:"Austria",                date:"Sun 28 Jun", time:"06:00", venue:"Arrowhead Stadium, Kansas City", result:null },
    // GROUP K
    { id:61, group:"K", home:"Portugal",                 away:"DR Congo",               date:"Wed 17 Jun", time:"21:00", venue:"NRG Stadium, Houston", result:null },
    { id:62, group:"K", home:"Uzbekistan",               away:"Colombia",               date:"Thu 18 Jun", time:"06:00", venue:"Estadio Azteca, Mexico City", result:null },
    { id:63, group:"K", home:"Portugal",                 away:"Uzbekistan",             date:"Tue 23 Jun", time:"21:00", venue:"NRG Stadium, Houston", result:null },
    { id:64, group:"K", home:"DR Congo",                 away:"Colombia",               date:"Wed 24 Jun", time:"06:00", venue:"Estadio Akron, Guadalajara", result:null },
    { id:65, group:"K", home:"Colombia",                 away:"Portugal",               date:"Sun 28 Jun", time:"03:30", venue:"Hard Rock Stadium, Miami", result:null },
    { id:66, group:"K", home:"DR Congo",                 away:"Uzbekistan",             date:"Sun 28 Jun", time:"03:30", venue:"Mercedes-Benz Stadium, Atlanta", result:null },
    // GROUP L
    { id:67, group:"L", home:"England",                  away:"Croatia",                date:"Thu 18 Jun", time:"00:00", venue:"AT&T Stadium, Dallas", result:null },
    { id:68, group:"L", home:"Ghana",                    away:"Panama",                 date:"Thu 18 Jun", time:"03:00", venue:"BMO Field, Toronto", result:null },
    { id:69, group:"L", home:"England",                  away:"Ghana",                  date:"Wed 24 Jun", time:"00:00", venue:"Gillette Stadium, Boston", result:null },
    { id:70, group:"L", home:"Panama",                   away:"Croatia",                date:"Wed 24 Jun", time:"03:00", venue:"BMO Field, Toronto", result:null },
    { id:71, group:"L", home:"Panama",                   away:"England",                date:"Sun 28 Jun", time:"01:00", venue:"MetLife Stadium, New Jersey", result:null },
    { id:72, group:"L", home:"Croatia",                  away:"Ghana",                  date:"Sun 28 Jun", time:"01:00", venue:"Lincoln Financial Field, Philadelphia", result:null },
  ];
}

// Knockout rounds with official bracket labels
export const KNOCKOUT_TEMPLATE = [
  // Round of 32 — official FIFA schedule (Wikipedia/Fox Sports source)
  // Fixed: runners-up vs runners-up (Match 73, 78, 83, 88)
  { id:"r32_1",  stage:"Round of 32", label:"2A vs 2B",       home:"2nd Group A", away:"2nd Group B", result:null },
  { id:"r32_2",  stage:"Round of 32", label:"2E vs 2I",       home:"2nd Group E", away:"2nd Group I", result:null },
  { id:"r32_3",  stage:"Round of 32", label:"2K vs 2L",       home:"2nd Group K", away:"2nd Group L", result:null },
  { id:"r32_4",  stage:"Round of 32", label:"2D vs 2G",       home:"2nd Group D", away:"2nd Group G", result:null },
  // Fixed: winners vs specific runners-up (Match 75, 76, 84, 86)
  { id:"r32_5",  stage:"Round of 32", label:"1F vs 2C",       home:"1st Group F", away:"2nd Group C", result:null },
  { id:"r32_6",  stage:"Round of 32", label:"1C vs 2F",       home:"1st Group C", away:"2nd Group F", result:null },
  { id:"r32_7",  stage:"Round of 32", label:"1H vs 2J",       home:"1st Group H", away:"2nd Group J", result:null },
  { id:"r32_8",  stage:"Round of 32", label:"1J vs 2H",       home:"1st Group J", away:"2nd Group H", result:null },
  // Variable: winners vs best 3rd (Annex C — auto-suggested from your group predictions)
  { id:"r32_9",  stage:"Round of 32", label:"1E vs best 3rd", home:"1st Group E", away:"Best 3rd placed team", result:null },
  { id:"r32_10", stage:"Round of 32", label:"1I vs best 3rd", home:"1st Group I", away:"Best 3rd placed team", result:null },
  { id:"r32_11", stage:"Round of 32", label:"1A vs best 3rd", home:"1st Group A", away:"Best 3rd placed team", result:null },
  { id:"r32_12", stage:"Round of 32", label:"1L vs best 3rd", home:"1st Group L", away:"Best 3rd placed team", result:null },
  { id:"r32_13", stage:"Round of 32", label:"1D vs best 3rd", home:"1st Group D", away:"Best 3rd placed team", result:null },
  { id:"r32_14", stage:"Round of 32", label:"1G vs best 3rd", home:"1st Group G", away:"Best 3rd placed team", result:null },
  { id:"r32_15", stage:"Round of 32", label:"1B vs best 3rd", home:"1st Group B", away:"Best 3rd placed team", result:null },
  { id:"r32_16", stage:"Round of 32", label:"1K vs best 3rd", home:"1st Group K", away:"Best 3rd placed team", result:null },
  // Round of 16
  { id:"r16_1", stage:"Round of 16", label:"W(2A/2B) vs W(1E/3rd)",  home:"W Match 73", away:"W Match 74", result:null },
  { id:"r16_2", stage:"Round of 16", label:"W(1F/2C) vs W(1C/2F)",   home:"W Match 75", away:"W Match 76", result:null },
  { id:"r16_3", stage:"Round of 16", label:"W(1I/3rd) vs W(2E/2I)",  home:"W Match 77", away:"W Match 78", result:null },
  { id:"r16_4", stage:"Round of 16", label:"W(1A/3rd) vs W(1L/3rd)", home:"W Match 79", away:"W Match 80", result:null },
  { id:"r16_5", stage:"Round of 16", label:"W(1D/3rd) vs W(1G/3rd)", home:"W Match 81", away:"W Match 82", result:null },
  { id:"r16_6", stage:"Round of 16", label:"W(2K/2L) vs W(1H/2J)",   home:"W Match 83", away:"W Match 84", result:null },
  { id:"r16_7", stage:"Round of 16", label:"W(1B/3rd) vs W(1J/2H)",  home:"W Match 85", away:"W Match 86", result:null },
  { id:"r16_8", stage:"Round of 16", label:"W(1K/3rd) vs W(2D/2G)",  home:"W Match 87", away:"W Match 88", result:null },
  // Quarter-finals
  { id:"qf_1", stage:"Quarter-final", label:"W R16-1 vs W R16-2", home:"W R16-1", away:"W R16-2", result:null },
  { id:"qf_2", stage:"Quarter-final", label:"W R16-3 vs W R16-4", home:"W R16-3", away:"W R16-4", result:null },
  { id:"qf_3", stage:"Quarter-final", label:"W R16-5 vs W R16-6", home:"W R16-5", away:"W R16-6", result:null },
  { id:"qf_4", stage:"Quarter-final", label:"W R16-7 vs W R16-8", home:"W R16-7", away:"W R16-8", result:null },
  // Semi-finals
  { id:"sf_1", stage:"Semi-final", label:"W QF1 vs W QF2", home:"W QF1", away:"W QF2", result:null },
  { id:"sf_2", stage:"Semi-final", label:"W QF3 vs W QF4", home:"W QF3", away:"W QF4", result:null },
  // Bronze & Final
  { id:"bronze", stage:"Bronze Final", label:"3rd place match", home:"Loser SF1", away:"Loser SF2", result:null },
  { id:"final",  stage:"Final",        label:"World Cup Final",  home:"Winner SF1", away:"Winner SF2", result:null },
];

export const INITIAL_POOL = {
  poolName: "SRI Dads — World Cup Pool 2026",
  adminPin: "1234",
  matches: generateGroupMatches(),
  knockoutMatches: KNOCKOUT_TEMPLATE,
  participants: [],
  predictions: {},
  champions: {},
};

// Round multipliers for knockout stages
export const ROUND_MULTIPLIER = {
  "group": 1,
  "Round of 32": 2,
  "Round of 16": 3,
  "Quarter-final": 4,
  "Semi-final": 5,
  "Bronze Final": 6,
  "Final": 8,
};

export function calcPts(pred, actual, stage = "group") {
  if (!pred || !actual) return 0;
  const ph = parseInt(pred.homeGoals), pa = parseInt(pred.awayGoals);
  const ah = parseInt(actual.homeGoals), aa = parseInt(actual.awayGoals);
  if (isNaN(ph) || isNaN(pa)) return 0;
  const mult = ROUND_MULTIPLIER[stage] || 1;
  if (ph === ah && pa === aa) return 3 * mult;
  const outcome = (h, a) => h > a ? "home" : a > h ? "away" : "draw";
  if (outcome(ph, pa) === outcome(ah, aa)) return 1 * mult;
  return 0;
}

// Champion bonus points
export const CHAMPION_BONUS = 15;
export const RUNNER_UP_BONUS = 5;
