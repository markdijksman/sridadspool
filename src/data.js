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
    // GROUP A
    { id:1,  group:"A", home:"Mexico",              away:"South Africa",          date:"Thu 11 Jun", time:"23:00", venue:"Estadio Azteca, Mexico City", result:null },
    { id:2,  group:"A", home:"Korea Republic",      away:"Czechia",               date:"Fri 12 Jun", time:"06:00", venue:"Estadio Akron, Guadalajara", result:null },
    { id:3,  group:"A", home:"Czechia",             away:"South Africa",          date:"Thu 18 Jun", time:"20:00", venue:"Mercedes-Benz Stadium, Atlanta", result:null },
    { id:4,  group:"A", home:"Mexico",              away:"Korea Republic",        date:"Fri 19 Jun", time:"05:00", venue:"Estadio Akron, Guadalajara", result:null },
    { id:5,  group:"A", home:"Czechia",             away:"Mexico",                date:"Thu 25 Jun", time:"05:00", venue:"Estadio Azteca, Mexico City", result:null },
    { id:6,  group:"A", home:"South Africa",        away:"Korea Republic",        date:"Thu 25 Jun", time:"05:00", venue:"Estadio BBVA, Monterrey", result:null },
    // GROUP B
    { id:7,  group:"B", home:"Canada",              away:"Bosnia and Herzegovina",date:"Fri 12 Jun", time:"23:00", venue:"BMO Field, Toronto", result:null },
    { id:8,  group:"B", home:"Qatar",               away:"Switzerland",           date:"Sat 13 Jun", time:"23:00", venue:"Levi's Stadium, San Francisco", result:null },
    { id:9,  group:"B", home:"Switzerland",         away:"Bosnia and Herzegovina",date:"Thu 18 Jun", time:"23:00", venue:"SoFi Stadium, Los Angeles", result:null },
    { id:10, group:"B", home:"Canada",              away:"Qatar",                 date:"Fri 19 Jun", time:"02:00", venue:"BC Place, Vancouver", result:null },
    { id:11, group:"B", home:"Switzerland",         away:"Canada",                date:"Wed 24 Jun", time:"23:00", venue:"BC Place, Vancouver", result:null },
    { id:12, group:"B", home:"Bosnia and Herzegovina",away:"Qatar",              date:"Wed 24 Jun", time:"23:00", venue:"Lumen Field, Seattle", result:null },
    // GROUP C
    { id:13, group:"C", home:"Brazil",              away:"Morocco",               date:"Sat 13 Jun", time:"02:00", venue:"MetLife Stadium, New Jersey", result:null },
    { id:14, group:"C", home:"Haiti",               away:"Scotland",              date:"Sat 13 Jun", time:"05:00", venue:"Gillette Stadium, Boston", result:null },
    { id:15, group:"C", home:"Scotland",            away:"Morocco",               date:"Fri 19 Jun", time:"02:00", venue:"Gillette Stadium, Boston", result:null },
    { id:16, group:"C", home:"Brazil",              away:"Haiti",                 date:"Sat 20 Jun", time:"04:30", venue:"Lincoln Financial Field, Philadelphia", result:null },
    { id:17, group:"C", home:"Scotland",            away:"Brazil",                date:"Wed 25 Jun", time:"02:00", venue:"Hard Rock Stadium, Miami", result:null },
    { id:18, group:"C", home:"Morocco",             away:"Haiti",                 date:"Wed 25 Jun", time:"02:00", venue:"Mercedes-Benz Stadium, Atlanta", result:null },
    // GROUP D
    { id:19, group:"D", home:"United States",       away:"Paraguay",              date:"Sat 13 Jun", time:"05:00", venue:"SoFi Stadium, Los Angeles", result:null },
    { id:20, group:"D", home:"Australia",           away:"Türkiye",               date:"Sun 14 Jun", time:"08:00", venue:"BC Place, Vancouver", result:null },
    { id:21, group:"D", home:"United States",       away:"Australia",             date:"Fri 19 Jun", time:"23:00", venue:"Lumen Field, Seattle", result:null },
    { id:22, group:"D", home:"Türkiye",             away:"Paraguay",              date:"Sat 20 Jun", time:"07:00", venue:"Levi's Stadium, San Francisco", result:null },
    { id:23, group:"D", home:"Türkiye",             away:"United States",         date:"Fri 26 Jun", time:"06:00", venue:"SoFi Stadium, Los Angeles", result:null },
    { id:24, group:"D", home:"Paraguay",            away:"Australia",             date:"Fri 26 Jun", time:"06:00", venue:"Levi's Stadium, San Francisco", result:null },
    // GROUP E
    { id:25, group:"E", home:"Germany",             away:"Curaçao",               date:"Sun 14 Jun", time:"21:00", venue:"Houston Stadium, Houston", result:null },
    { id:26, group:"E", home:"Ivory Coast",         away:"Ecuador",               date:"Mon 15 Jun", time:"00:00", venue:"AT&T Stadium, Dallas", result:null },
    { id:27, group:"E", home:"Germany",             away:"Ivory Coast",           date:"Fri 20 Jun", time:"02:00", venue:"SoFi Stadium, Los Angeles", result:null },
    { id:28, group:"E", home:"Ecuador",             away:"Curaçao",               date:"Fri 20 Jun", time:"05:00", venue:"Hard Rock Stadium, Miami", result:null },
    { id:29, group:"E", home:"Ecuador",             away:"Germany",               date:"Thu 26 Jun", time:"02:00", venue:"MetLife Stadium, New Jersey", result:null },
    { id:30, group:"E", home:"Curaçao",             away:"Ivory Coast",           date:"Thu 26 Jun", time:"02:00", venue:"Lincoln Financial Field, Philadelphia", result:null },
    // GROUP F
    { id:31, group:"F", home:"Netherlands",         away:"Japan",                 date:"Sun 14 Jun", time:"01:00", venue:"AT&T Stadium, Dallas", result:null },
    { id:32, group:"F", home:"Sweden",              away:"Tunisia",               date:"Mon 15 Jun", time:"04:00", venue:"Levi's Stadium, San Francisco", result:null },
    { id:33, group:"F", home:"Japan",               away:"Sweden",                date:"Sat 20 Jun", time:"23:00", venue:"Lumen Field, Seattle", result:null },
    { id:34, group:"F", home:"Netherlands",         away:"Tunisia",               date:"Sun 21 Jun", time:"02:00", venue:"BC Place, Vancouver", result:null },
    { id:35, group:"F", home:"Japan",               away:"Tunisia",               date:"Thu 26 Jun", time:"05:00", venue:"BC Place, Vancouver", result:null },
    { id:36, group:"F", home:"Sweden",              away:"Netherlands",           date:"Thu 26 Jun", time:"05:00", venue:"Lumen Field, Seattle", result:null },
    // GROUP G
    { id:37, group:"G", home:"Belgium",             away:"Egypt",                 date:"Sun 15 Jun", time:"23:00", venue:"AT&T Stadium, Dallas", result:null },
    { id:38, group:"G", home:"Iran",                away:"New Zealand",           date:"Mon 16 Jun", time:"02:00", venue:"SoFi Stadium, Los Angeles", result:null },
    { id:39, group:"G", home:"Egypt",               away:"New Zealand",           date:"Sat 21 Jun", time:"23:00", venue:"Gillette Stadium, Boston", result:null },
    { id:40, group:"G", home:"Belgium",             away:"Iran",                  date:"Sun 22 Jun", time:"02:00", venue:"Houston Stadium, Houston", result:null },
    { id:41, group:"G", home:"Iran",                away:"Egypt",                 date:"Fri 27 Jun", time:"02:00", venue:"Hard Rock Stadium, Miami", result:null },
    { id:42, group:"G", home:"New Zealand",         away:"Belgium",               date:"Fri 27 Jun", time:"02:00", venue:"Mercedes-Benz Stadium, Atlanta", result:null },
    // GROUP H
    { id:43, group:"H", home:"Spain",               away:"Cape Verde",            date:"Sun 15 Jun", time:"20:00", venue:"SoFi Stadium, Los Angeles", result:null },
    { id:44, group:"H", home:"Saudi Arabia",        away:"Uruguay",               date:"Mon 16 Jun", time:"05:00", venue:"MetLife Stadium, New Jersey", result:null },
    { id:45, group:"H", home:"Cape Verde",          away:"Uruguay",               date:"Sun 21 Jun", time:"19:00", venue:"AT&T Stadium, Dallas", result:null },
    { id:46, group:"H", home:"Spain",               away:"Saudi Arabia",          date:"Mon 22 Jun", time:"05:00", venue:"Lincoln Financial Field, Philadelphia", result:null },
    { id:47, group:"H", home:"Cape Verde",          away:"Spain",                 date:"Fri 27 Jun", time:"05:00", venue:"Hard Rock Stadium, Miami", result:null },
    { id:48, group:"H", home:"Uruguay",             away:"Saudi Arabia",          date:"Fri 27 Jun", time:"05:00", venue:"MetLife Stadium, New Jersey", result:null },
    // GROUP I
    { id:49, group:"I", home:"France",              away:"Senegal",               date:"Mon 16 Jun", time:"23:00", venue:"Levi's Stadium, San Francisco", result:null },
    { id:50, group:"I", home:"Iraq",                away:"Norway",                date:"Tue 17 Jun", time:"02:00", venue:"Gillette Stadium, Boston", result:null },
    { id:51, group:"I", home:"Senegal",             away:"Norway",                date:"Mon 22 Jun", time:"23:00", venue:"Lumen Field, Seattle", result:null },
    { id:52, group:"I", home:"France",              away:"Iraq",                  date:"Tue 23 Jun", time:"02:00", venue:"Houston Stadium, Houston", result:null },
    { id:53, group:"I", home:"Norway",              away:"France",                date:"Sat 28 Jun", time:"02:00", venue:"BC Place, Vancouver", result:null },
    { id:54, group:"I", home:"Senegal",             away:"Iraq",                  date:"Sat 28 Jun", time:"02:00", venue:"Levi's Stadium, San Francisco", result:null },
    // GROUP J
    { id:55, group:"J", home:"Argentina",           away:"Algeria",               date:"Mon 16 Jun", time:"02:00", venue:"Mercedes-Benz Stadium, Atlanta", result:null },
    { id:56, group:"J", home:"Austria",             away:"Jordan",                date:"Tue 17 Jun", time:"05:00", venue:"Lincoln Financial Field, Philadelphia", result:null },
    { id:57, group:"J", home:"Algeria",             away:"Jordan",                date:"Mon 22 Jun", time:"02:00", venue:"Hard Rock Stadium, Miami", result:null },
    { id:58, group:"J", home:"Argentina",           away:"Austria",               date:"Mon 22 Jun", time:"20:00", venue:"MetLife Stadium, New Jersey", result:null },
    { id:59, group:"J", home:"Jordan",              away:"Argentina",             date:"Sat 28 Jun", time:"05:00", venue:"Mercedes-Benz Stadium, Atlanta", result:null },
    { id:60, group:"J", home:"Algeria",             away:"Austria",               date:"Sat 28 Jun", time:"05:00", venue:"Houston Stadium, Houston", result:null },
    // GROUP K
    { id:61, group:"K", home:"Portugal",            away:"DR Congo",              date:"Tue 17 Jun", time:"23:00", venue:"SoFi Stadium, Los Angeles", result:null },
    { id:62, group:"K", home:"Uzbekistan",          away:"Colombia",              date:"Wed 18 Jun", time:"02:00", venue:"AT&T Stadium, Dallas", result:null },
    { id:63, group:"K", home:"DR Congo",            away:"Colombia",              date:"Tue 23 Jun", time:"23:00", venue:"BC Place, Vancouver", result:null },
    { id:64, group:"K", home:"Portugal",            away:"Uzbekistan",            date:"Wed 24 Jun", time:"02:00", venue:"Lumen Field, Seattle", result:null },
    { id:65, group:"K", home:"Colombia",            away:"Portugal",              date:"Sun 29 Jun", time:"02:00", venue:"SoFi Stadium, Los Angeles", result:null },
    { id:66, group:"K", home:"DR Congo",            away:"Uzbekistan",            date:"Sun 29 Jun", time:"02:00", venue:"AT&T Stadium, Dallas", result:null },
    // GROUP L
    { id:67, group:"L", home:"England",             away:"Croatia",               date:"Wed 18 Jun", time:"05:00", venue:"MetLife Stadium, New Jersey", result:null },
    { id:68, group:"L", home:"Ghana",               away:"Panama",                date:"Wed 18 Jun", time:"09:00", venue:"Gillette Stadium, Boston", result:null },
    { id:69, group:"L", home:"Croatia",             away:"Panama",                date:"Tue 24 Jun", time:"05:00", venue:"Hard Rock Stadium, Miami", result:null },
    { id:70, group:"L", home:"England",             away:"Ghana",                 date:"Wed 25 Jun", time:"02:00", venue:"Lincoln Financial Field, Philadelphia", result:null },
    { id:71, group:"L", home:"Panama",              away:"England",               date:"Sun 29 Jun", time:"05:00", venue:"Houston Stadium, Houston", result:null },
    { id:72, group:"L", home:"Croatia",             away:"Ghana",                 date:"Sun 29 Jun", time:"05:00", venue:"Gillette Stadium, Boston", result:null },
  ];
}

// Knockout rounds with official bracket labels
export const KNOCKOUT_TEMPLATE = [
  // Round of 32 — official FIFA bracket pairings
  { id:"r32_1",  stage:"Round of 32", label:"1A vs 2B", home:"1st Group A", away:"2nd Group B", result:null },
  { id:"r32_2",  stage:"Round of 32", label:"1C vs 2D", home:"1st Group C", away:"2nd Group D", result:null },
  { id:"r32_3",  stage:"Round of 32", label:"1E vs 2F", home:"1st Group E", away:"2nd Group F", result:null },
  { id:"r32_4",  stage:"Round of 32", label:"1G vs 2H", home:"1st Group G", away:"2nd Group H", result:null },
  { id:"r32_5",  stage:"Round of 32", label:"1I vs 2J", home:"1st Group I", away:"2nd Group J", result:null },
  { id:"r32_6",  stage:"Round of 32", label:"1K vs 2L", home:"1st Group K", away:"2nd Group L", result:null },
  { id:"r32_7",  stage:"Round of 32", label:"1B vs 2A", home:"1st Group B", away:"2nd Group A", result:null },
  { id:"r32_8",  stage:"Round of 32", label:"1D vs 2C", home:"1st Group D", away:"2nd Group C", result:null },
  { id:"r32_9",  stage:"Round of 32", label:"1F vs 2E", home:"1st Group F", away:"2nd Group E", result:null },
  { id:"r32_10", stage:"Round of 32", label:"1H vs 2G", home:"1st Group H", away:"2nd Group G", result:null },
  { id:"r32_11", stage:"Round of 32", label:"1J vs 2I", home:"1st Group J", away:"2nd Group I", result:null },
  { id:"r32_12", stage:"Round of 32", label:"1L vs 2K", home:"1st Group L", away:"2nd Group K", result:null },
  { id:"r32_13", stage:"Round of 32", label:"3rd best (1)", home:"Best 3rd #1", away:"Best 3rd #2", result:null },
  { id:"r32_14", stage:"Round of 32", label:"3rd best (2)", home:"Best 3rd #3", away:"Best 3rd #4", result:null },
  { id:"r32_15", stage:"Round of 32", label:"3rd best (3)", home:"Best 3rd #5", away:"Best 3rd #6", result:null },
  { id:"r32_16", stage:"Round of 32", label:"3rd best (4)", home:"Best 3rd #7", away:"Best 3rd #8", result:null },
  // Round of 16
  { id:"r16_1", stage:"Round of 16", label:"W r32_1 vs W r32_2", home:"W Match 1", away:"W Match 2", result:null },
  { id:"r16_2", stage:"Round of 16", label:"W r32_3 vs W r32_4", home:"W Match 3", away:"W Match 4", result:null },
  { id:"r16_3", stage:"Round of 16", label:"W r32_5 vs W r32_6", home:"W Match 5", away:"W Match 6", result:null },
  { id:"r16_4", stage:"Round of 16", label:"W r32_7 vs W r32_8", home:"W Match 7", away:"W Match 8", result:null },
  { id:"r16_5", stage:"Round of 16", label:"W r32_9 vs W r32_10", home:"W Match 9",  away:"W Match 10", result:null },
  { id:"r16_6", stage:"Round of 16", label:"W r32_11 vs W r32_12", home:"W Match 11", away:"W Match 12", result:null },
  { id:"r16_7", stage:"Round of 16", label:"W r32_13 vs W r32_14", home:"W Match 13", away:"W Match 14", result:null },
  { id:"r16_8", stage:"Round of 16", label:"W r32_15 vs W r32_16", home:"W Match 15", away:"W Match 16", result:null },
  // Quarter-finals
  { id:"qf_1", stage:"Quarter-final", label:"W R16 M1 vs W R16 M2", home:"W R16 Match 1", away:"W R16 Match 2", result:null },
  { id:"qf_2", stage:"Quarter-final", label:"W R16 M3 vs W R16 M4", home:"W R16 Match 3", away:"W R16 Match 4", result:null },
  { id:"qf_3", stage:"Quarter-final", label:"W R16 M5 vs W R16 M6", home:"W R16 Match 5", away:"W R16 Match 6", result:null },
  { id:"qf_4", stage:"Quarter-final", label:"W R16 M7 vs W R16 M8", home:"W R16 Match 7", away:"W R16 Match 8", result:null },
  // Semi-finals
  { id:"sf_1", stage:"Semi-final", label:"W QF1 vs W QF2", home:"W Quarter-final 1", away:"W Quarter-final 2", result:null },
  { id:"sf_2", stage:"Semi-final", label:"W QF3 vs W QF4", home:"W Quarter-final 3", away:"W Quarter-final 4", result:null },
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
