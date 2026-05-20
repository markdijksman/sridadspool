export const GROUPS_2026 = {
  A: ["Mexico","USA","Canada","Honduras"],
  B: ["Argentina","Chile","Uruguay","Bolivia"],
  C: ["Brazil","Colombia","Paraguay","Venezuela"],
  D: ["Ecuador","Peru","Jamaica","Panama"],
  E: ["Spain","France","Portugal","Germany"],
  F: ["England","Netherlands","Belgium","Croatia"],
  G: ["Italy","Switzerland","Austria","Serbia"],
  H: ["Denmark","Poland","Czech Republic","Slovakia"],
  I: ["Morocco","Senegal","Egypt","Algeria"],
  J: ["Cameroon","Nigeria","Ghana","Ivory Coast"],
  K: ["Japan","South Korea","Iran","Saudi Arabia"],
  L: ["Australia","New Zealand","South Africa","Tunisia"],
};

export const FLAGS = {
  Mexico:"🇲🇽",USA:"🇺🇸",Canada:"🇨🇦",Honduras:"🇭🇳",
  Argentina:"🇦🇷",Chile:"🇨🇱",Uruguay:"🇺🇾",Bolivia:"🇧🇴",
  Brazil:"🇧🇷",Colombia:"🇨🇴",Paraguay:"🇵🇾",Venezuela:"🇻🇪",
  Ecuador:"🇪🇨",Peru:"🇵🇪",Jamaica:"🇯🇲",Panama:"🇵🇦",
  Spain:"🇪🇸",France:"🇫🇷",Portugal:"🇵🇹",Germany:"🇩🇪",
  England:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",Netherlands:"🇳🇱",Belgium:"🇧🇪",Croatia:"🇭🇷",
  Italy:"🇮🇹",Switzerland:"🇨🇭",Austria:"🇦🇹",Serbia:"🇷🇸",
  Denmark:"🇩🇰",Poland:"🇵🇱","Czech Republic":"🇨🇿",Slovakia:"🇸🇰",
  Morocco:"🇲🇦",Senegal:"🇸🇳",Egypt:"🇪🇬",Algeria:"🇩🇿",
  Cameroon:"🇨🇲",Nigeria:"🇳🇬",Ghana:"🇬🇭","Ivory Coast":"🇨🇮",
  Japan:"🇯🇵","South Korea":"🇰🇷",Iran:"🇮🇷","Saudi Arabia":"🇸🇦",
  Australia:"🇦🇺","New Zealand":"🇳🇿","South Africa":"🇿🇦",Tunisia:"🇹🇳",
  TBD:"🏳️",
};

export const ALL_TEAMS = Object.values(GROUPS_2026).flat();

export const KNOCKOUT_TEMPLATE = [
  {id:"r32_1",stage:"Round of 32",home:"TBD",away:"TBD",result:null},
  {id:"r32_2",stage:"Round of 32",home:"TBD",away:"TBD",result:null},
  {id:"r32_3",stage:"Round of 32",home:"TBD",away:"TBD",result:null},
  {id:"r32_4",stage:"Round of 32",home:"TBD",away:"TBD",result:null},
  {id:"r16_1",stage:"Round of 16",home:"TBD",away:"TBD",result:null},
  {id:"r16_2",stage:"Round of 16",home:"TBD",away:"TBD",result:null},
  {id:"r16_3",stage:"Round of 16",home:"TBD",away:"TBD",result:null},
  {id:"r16_4",stage:"Round of 16",home:"TBD",away:"TBD",result:null},
  {id:"qf_1",stage:"Quarter-final",home:"TBD",away:"TBD",result:null},
  {id:"qf_2",stage:"Quarter-final",home:"TBD",away:"TBD",result:null},
  {id:"qf_3",stage:"Quarter-final",home:"TBD",away:"TBD",result:null},
  {id:"qf_4",stage:"Quarter-final",home:"TBD",away:"TBD",result:null},
  {id:"sf_1",stage:"Semi-final",home:"TBD",away:"TBD",result:null},
  {id:"sf_2",stage:"Semi-final",home:"TBD",away:"TBD",result:null},
  {id:"final",stage:"Final",home:"TBD",away:"TBD",result:null},
];

export function generateGroupMatches() {
  const out = []; let id = 1;
  Object.entries(GROUPS_2026).forEach(([group, teams]) => {
    for (let i = 0; i < teams.length; i++)
      for (let j = i + 1; j < teams.length; j++)
        out.push({ id: id++, group, home: teams[i], away: teams[j], result: null });
  });
  return out;
}

export const INITIAL_POOL = {
  poolName: "SRI Dads — World Cup Pool 2026",
  adminPin: "1234",
  matches: generateGroupMatches(),
  knockoutMatches: KNOCKOUT_TEMPLATE,
  participants: [],
  predictions: {},
  champions: {},
};

export function calcPts(pred, actual) {
  if (!pred || !actual) return 0;
  const ph = parseInt(pred.homeGoals), pa = parseInt(pred.awayGoals);
  const ah = parseInt(actual.homeGoals), aa = parseInt(actual.awayGoals);
  if (isNaN(ph) || isNaN(pa)) return 0;
  if (ph === ah && pa === aa) return 3;
  const outcome = (h, a) => h > a ? "home" : a > h ? "away" : "draw";
  if (outcome(ph, pa) === outcome(ah, aa)) return 1;
  return 0;
}
