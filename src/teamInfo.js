// ─── TEAM INFO DATA ───────────────────────────────────────────────────────────
// FIFA April 2026 Rankings + Qualification record + Key player
// Sources: FIFA, Wikipedia, ESPN, Al Jazeera, Squawka

export const TEAM_INFO = {
  // ── GROUP A ──
  "Mexico": {
    rank:13, conf:"CONCACAF", key:"Hirving Lozano", style:"Physical, quick transitions",
    qual:"Hosts — automatic qualifier",
    qualRecord:{ p:0, w:0, d:0, l:0, gf:0, ga:0 },
    qualNote:"Qualified automatically as co-host. No qualifying matches played.",
    prevWC:"17 appearances. Best: Quarter-finals (1970, 1986). Qatar 2022: R16"
  },
  "South Africa": {
    rank:65, conf:"CAF", key:"Percy Tau", style:"Disciplined defense, counter-attack",
    qual:"CAF Group C winners",
    qualRecord:{ p:10, w:7, d:1, l:2, gf:18, ga:8 },
    qualNote:"Won CAF Group C convincingly, qualifying directly.",
    prevWC:"3 appearances. Best: R16 (2010 hosts). Qatar 2022: DNQ"
  },
  "Korea Republic": {
    rank:24, conf:"AFC", key:"Son Heung-min", style:"High pressing, technical",
    qual:"AFC 3rd Round — Group A runners-up",
    qualRecord:{ p:10, w:6, d:4, l:0, gf:20, ga:7 },
    qualNote:"Unbeaten in qualifying. Strong defensive record with 4 draws.",
    prevWC:"11 appearances. Best: 4th place (2002). Qatar 2022: R16"
  },
  "Czechia": {
    rank:36, conf:"UEFA", key:"Tomáš Souček", style:"Set pieces, direct play",
    qual:"UEFA Playoffs (Path A)",
    qualRecord:{ p:10, w:5, d:3, l:2, gf:18, ga:10 },
    qualNote:"Beat Ireland then Denmark on penalties to qualify — two shootout wins!",
    prevWC:"First WC as Czechia. Last as Czechoslovakia: 1990. Qatar 2022: DNQ"
  },
  // ── GROUP B ──
  "Canada": {
    rank:44, conf:"CONCACAF", key:"Alphonso Davies", style:"Fast transitions, athletic",
    qual:"Hosts — automatic qualifier",
    qualRecord:{ p:0, w:0, d:0, l:0, gf:0, ga:0 },
    qualNote:"Qualified automatically as co-host. No qualifying matches played.",
    prevWC:"2 appearances. Best: Group stage (1986). Qatar 2022: Group stage"
  },
  "Bosnia and Herzegovina": {
    rank:55, conf:"UEFA", key:"Edin Džeko", style:"Physical, long ball",
    qual:"UEFA Playoffs (Path A)",
    qualRecord:{ p:10, w:4, d:3, l:3, gf:16, ga:14 },
    qualNote:"Remarkable — finished bottom of qualifying group! Nations League saved them. Beat Wales and Italy on penalties.",
    prevWC:"1 appearance. Best: Group stage (2014). Qatar 2022: DNQ"
  },
  "Qatar": {
    rank:58, conf:"AFC", key:"Akram Afif", style:"Organized, counter-attack",
    qual:"AFC 3rd Round — Group B runners-up",
    qualRecord:{ p:10, w:5, d:2, l:3, gf:16, ga:12 },
    qualNote:"Consistent qualifying campaign after hosting 2022.",
    prevWC:"1 appearance (2022 hosts). Best: Group stage. Qatar 2022: Group stage"
  },
  "Switzerland": {
    rank:19, conf:"UEFA", key:"Granit Xhaka", style:"Structured, disciplined",
    qual:"UEFA Group B winners",
    qualRecord:{ p:8, w:6, d:1, l:1, gf:20, ga:8 },
    qualNote:"Won their group comfortably with strong defensive record.",
    prevWC:"12 appearances. Best: QF (1934, 1938, 1954). Qatar 2022: QF"
  },
  // ── GROUP C ──
  "Brazil": {
    rank:5, conf:"CONMEBOL", key:"Vinícius Jr.", style:"Samba football, skillful",
    qual:"CONMEBOL 4th place",
    qualRecord:{ p:18, w:9, d:5, l:4, gf:28, ga:17 },
    qualNote:"Turbulent campaign — fired coach Dorival Jr., brought in Ancelotti. Qualified comfortably despite struggles.",
    prevWC:"22 appearances. 5× World Champions. Qatar 2022: QF"
  },
  "Morocco": {
    rank:14, conf:"CAF", key:"Achraf Hakimi", style:"Defensive solidity, fast breaks",
    qual:"CAF Group F winners",
    qualRecord:{ p:10, w:8, d:1, l:1, gf:22, ga:5 },
    qualNote:"Dominant CAF qualifying — best defense in African zone.",
    prevWC:"7 appearances. Best: SF (2022 — historic!). Qatar 2022: Semi-finals"
  },
  "Haiti": {
    rank:83, conf:"CONCACAF", key:"Frantzdy Pierrot", style:"Energetic, unpredictable",
    qual:"CONCACAF 3rd Round qualifiers",
    qualRecord:{ p:14, w:7, d:2, l:5, gf:22, ga:18 },
    qualNote:"Ended 51-year absence from World Cup. Incredible story.",
    prevWC:"1 appearance. Last: 1974. Qatar 2022: DNQ"
  },
  "Scotland": {
    rank:38, conf:"UEFA", key:"Andrew Robertson", style:"High energy, set pieces",
    qual:"UEFA Playoffs (Path B)",
    qualRecord:{ p:10, w:6, d:2, l:2, gf:19, ga:8 },
    qualNote:"First World Cup since 1998! Beat Finland and Iceland in playoffs.",
    prevWC:"8 appearances. Best: Group stage. Last: 1998. Qatar 2022: DNQ"
  },
  // ── GROUP D ──
  "United States": {
    rank:16, conf:"CONCACAF", key:"Christian Pulisic", style:"Athletic, direct",
    qual:"Hosts — automatic qualifier",
    qualRecord:{ p:0, w:0, d:0, l:0, gf:0, ga:0 },
    qualNote:"Qualified automatically as co-host. No qualifying matches played.",
    prevWC:"11 appearances. Best: SF (1930). Qatar 2022: R16"
  },
  "Paraguay": {
    rank:52, conf:"CONMEBOL", key:"Miguel Almirón", style:"Gritty, defensive",
    qual:"CONMEBOL 5th place",
    qualRecord:{ p:18, w:6, d:7, l:5, gf:17, ga:15 },
    qualNote:"Defensive solidity (10 goals conceded in last 10 matches) carried them through.",
    prevWC:"9 appearances. Best: QF (1962). Qatar 2022: DNQ"
  },
  "Australia": {
    rank:25, conf:"AFC", key:"Mathew Ryan", style:"Compact defense, set pieces",
    qual:"AFC 3rd Round — Group A winners",
    qualRecord:{ p:10, w:7, d:2, l:1, gf:21, ga:8 },
    qualNote:"6th consecutive World Cup. Won their AFC group convincingly.",
    prevWC:"6 appearances. Best: R16 (2006, 2022). Qatar 2022: R16"
  },
  "Türkiye": {
    rank:30, conf:"UEFA", key:"Hakan Çalhanoğlu", style:"Technical midfield, physical",
    qual:"UEFA Playoffs (Path C)",
    qualRecord:{ p:10, w:6, d:2, l:2, gf:22, ga:11 },
    qualNote:"Beat Sweden and Poland in playoffs to return to World Cup.",
    prevWC:"2 appearances. Best: 3rd place (2002). Qatar 2022: DNQ"
  },
  // ── GROUP E ──
  "Germany": {
    rank:12, conf:"UEFA", key:"Jamal Musiala", style:"Modern pressing, technical",
    qual:"UEFA Group D winners",
    qualRecord:{ p:8, w:7, d:0, l:1, gf:28, ga:5 },
    qualNote:"Dominant qualifying — 7 wins from 8, including 7-0 vs San Marino.",
    prevWC:"20 appearances. 4× Champions. Qatar 2022: Group stage"
  },
  "Curaçao": {
    rank:88, conf:"CONCACAF", key:"Leandro Bacuna", style:"Organized, technical",
    qual:"CONCACAF 3rd Round qualifiers",
    qualRecord:{ p:14, w:6, d:3, l:5, gf:24, ga:19 },
    qualNote:"Smallest nation ever at a World Cup (pop. 158,000). Historic debut!",
    prevWC:"First World Cup appearance"
  },
  "Ivory Coast": {
    rank:27, conf:"CAF", key:"Sébastien Haller", style:"Physical, direct",
    qual:"CAF Group B winners",
    qualRecord:{ p:10, w:7, d:2, l:1, gf:25, ga:7 },
    qualNote:"Most goals in African qualifying (25). Dominant campaign.",
    prevWC:"3 appearances. Best: Group stage. Qatar 2022: DNQ"
  },
  "Ecuador": {
    rank:40, conf:"CONMEBOL", key:"Enner Valencia", style:"Organized, physical",
    qual:"CONMEBOL 2nd place",
    qualRecord:{ p:18, w:8, d:8, l:2, gf:14, ga:5 },
    qualNote:"Best defensive record in CONMEBOL — only 5 goals conceded in 18 matches!",
    prevWC:"4 appearances. Best: R16 (2006). Qatar 2022: Group stage"
  },
  // ── GROUP F ──
  "Netherlands": {
    rank:7, conf:"UEFA", key:"Virgil van Dijk", style:"Total football, technical",
    qual:"UEFA Group A winners",
    qualRecord:{ p:8, w:6, d:1, l:1, gf:22, ga:9 },
    qualNote:"Won group despite rocky start. Strong team chemistry.",
    prevWC:"11 appearances. Best: Runners-up (1974, 1978, 2010). Qatar 2022: QF"
  },
  "Japan": {
    rank:18, conf:"AFC", key:"Takumi Minamino", style:"High press, disciplined",
    qual:"AFC 3rd Round — Group C winners",
    qualRecord:{ p:10, w:8, d:1, l:1, gf:51, ga:5 },
    qualNote:"51 goals in qualifying — most of any team worldwide! First to qualify.",
    prevWC:"8 appearances. Best: R16. Qatar 2022: R16"
  },
  "Sweden": {
    rank:28, conf:"UEFA", key:"Viktor Gyökeres", style:"Physical, direct",
    qual:"UEFA Playoffs (Path B)",
    qualRecord:{ p:10, w:7, d:0, l:3, gf:24, ga:10 },
    qualNote:"Beat Finland and Iceland in playoffs. Back without Zlatan — new era.",
    prevWC:"12 appearances. Best: 3rd (1994). Qatar 2022: DNQ"
  },
  "Tunisia": {
    rank:42, conf:"CAF", key:"Youssef Msakni", style:"Defensive, counter-attack",
    qual:"CAF Group A winners",
    qualRecord:{ p:10, w:5, d:4, l:1, gf:14, ga:6 },
    qualNote:"Consistent African qualifiers — 6th World Cup appearance.",
    prevWC:"6 appearances. Best: Group stage. Qatar 2022: Group stage"
  },
  // ── GROUP G ──
  "Belgium": {
    rank:3, conf:"UEFA", key:"Kevin De Bruyne", style:"Clinical, creative midfield",
    qual:"UEFA Group C winners",
    qualRecord:{ p:8, w:7, d:0, l:1, gf:26, ga:5 },
    qualNote:"Dominant — Courtois kept 7 clean sheets. Golden generation's last shot?",
    prevWC:"14 appearances. Best: 3rd (2018). Qatar 2022: Group stage"
  },
  "Egypt": {
    rank:34, conf:"CAF", key:"Mohamed Salah", style:"Counter-attack, Salah-dependent",
    qual:"CAF Group D winners",
    qualRecord:{ p:10, w:6, d:3, l:1, gf:20, ga:6 },
    qualNote:"Salah carried qualifying campaign. Dominated African group.",
    prevWC:"3 appearances. Best: Group stage. Qatar 2022: DNQ"
  },
  "Iran": {
    rank:21, conf:"AFC", key:"Sardar Azmoun", style:"Physical, defensive",
    qual:"AFC 3rd Round — Group A runners-up",
    qualRecord:{ p:10, w:6, d:2, l:2, gf:18, ga:8 },
    qualNote:"Qualified despite losing Mehdi Taremi to injury concerns.",
    prevWC:"6 appearances. Best: Group stage. Qatar 2022: Group stage"
  },
  "New Zealand": {
    rank:90, conf:"OFC", key:"Chris Wood", style:"Direct, set pieces",
    qual:"OFC winners",
    qualRecord:{ p:6, w:5, d:1, l:0, gf:20, ga:3 },
    qualNote:"Dominated Oceania qualifying as expected. Chris Wood led the attack.",
    prevWC:"2 appearances. Best: Group stage (2010). Qatar 2022: DNQ"
  },
  // ── GROUP H ──
  "Spain": {
    rank:2, conf:"UEFA", key:"Pedri", style:"Tiki-taka, positional play",
    qual:"UEFA Group E winners",
    qualRecord:{ p:8, w:8, d:0, l:0, gf:28, ga:3 },
    qualNote:"Perfect qualifying record! 8 wins, 28 goals, only 3 conceded. Lamine Yamal — 6 assists.",
    prevWC:"16 appearances. 1× Champions (2010). Qatar 2022: R16"
  },
  "Cape Verde": {
    rank:71, conf:"CAF", key:"Garry Rodrigues", style:"Energetic, direct",
    qual:"CAF Group G winners",
    qualRecord:{ p:10, w:6, d:2, l:2, gf:16, ga:8 },
    qualNote:"Second consecutive World Cup. Growing African footballing nation.",
    prevWC:"1 appearance (2022). Best: Group stage. Qatar 2022: Group stage"
  },
  "Saudi Arabia": {
    rank:56, conf:"AFC", key:"Saleh Al-Shehri", style:"Organized, counter-attack",
    qual:"AFC 3rd Round — Group B winners",
    qualRecord:{ p:10, w:6, d:2, l:2, gf:16, ga:8 },
    qualNote:"Won their AFC group. Famous 2022 win over Argentina still fresh.",
    prevWC:"6 appearances. Best: R16 (1994). Qatar 2022: Group stage"
  },
  "Uruguay": {
    rank:9, conf:"CONMEBOL", key:"Darwin Núñez", style:"Physical, defensive solidity",
    qual:"CONMEBOL 3rd place",
    qualRecord:{ p:18, w:9, d:5, l:4, gf:27, ga:14 },
    qualNote:"Solid CONMEBOL campaign. Defense remains their strongest asset.",
    prevWC:"14 appearances. 2× Champions (1930, 1950). Qatar 2022: Group stage"
  },
  // ── GROUP I ──
  "France": {
    rank:1, conf:"UEFA", key:"Kylian Mbappé", style:"Balanced, world-class depth",
    qual:"UEFA Group F winners",
    qualRecord:{ p:8, w:7, d:1, l:0, gf:22, ga:5 },
    qualNote:"World #1 going into the tournament. Unbeaten in qualifying.",
    prevWC:"16 appearances. 2× Champions (1998, 2018). Qatar 2022: Runners-up"
  },
  "Senegal": {
    rank:20, conf:"CAF", key:"Sadio Mané", style:"Explosive, athletic",
    qual:"CAF Group H winners",
    qualRecord:{ p:10, w:7, d:2, l:1, gf:22, ga:7 },
    qualNote:"Defending African champions (AFCON 2022). Won group convincingly.",
    prevWC:"3 appearances. Best: QF (2002). Qatar 2022: R16"
  },
  "Iraq": {
    rank:63, conf:"AFC", key:"Aymen Hussein", style:"Disciplined, defensive",
    qual:"AFC 3rd Round + Inter-confederation playoffs",
    qualRecord:{ p:21, w:9, d:6, l:6, gf:28, ga:23 },
    qualNote:"Played 21 qualifying matches — most of any team! Beat Bolivia 2-1 in final playoff.",
    prevWC:"1 appearance (1986). Best: Group stage. Qatar 2022: DNQ"
  },
  "Norway": {
    rank:17, conf:"UEFA", key:"Erling Haaland", style:"Direct, lethal on counter",
    qual:"UEFA Group B winners",
    qualRecord:{ p:8, w:6, d:1, l:1, gf:28, ga:7 },
    qualNote:"Haaland scored 16 goals in qualifying — top scorer worldwide!",
    prevWC:"3 appearances. Best: R16 (1994, 1998). Qatar 2022: DNQ"
  },
  // ── GROUP J ──
  "Argentina": {
    rank:4, conf:"CONMEBOL", key:"Lionel Messi", style:"Organized, world-class attack",
    qual:"CONMEBOL 1st place",
    qualRecord:{ p:18, w:12, d:2, l:4, gf:31, ga:10 },
    qualNote:"Defending World Champions. Messi top scorer with 7 goals. Dominant.",
    prevWC:"19 appearances. 3× Champions (1978, 1986, 2022). Qatar 2022: Champions"
  },
  "Algeria": {
    rank:39, conf:"CAF", key:"Riyad Mahrez", style:"Quick transitions, skillful",
    qual:"CAF Group I winners",
    qualRecord:{ p:10, w:7, d:1, l:2, gf:21, ga:7 },
    qualNote:"Won CAF group impressively. Mohamed Amoura top scorer in African qualifying.",
    prevWC:"4 appearances. Best: R16 (2014). Qatar 2022: DNQ"
  },
  "Austria": {
    rank:23, conf:"UEFA", key:"Marcel Sabitzer", style:"High press, versatile",
    qual:"UEFA Group A runners-up",
    qualRecord:{ p:8, w:5, d:1, l:2, gf:18, ga:8 },
    qualNote:"First World Cup since 1998! Qualified directly as group runners-up.",
    prevWC:"7 appearances. Best: 3rd (1954). Qatar 2022: DNQ"
  },
  "Jordan": {
    rank:87, conf:"AFC", key:"Ahmad Nasser Saleh", style:"Disciplined, counter-attack",
    qual:"AFC 3rd Round runners-up",
    qualRecord:{ p:10, w:4, d:4, l:2, gf:16, ga:8 },
    qualNote:"First ever World Cup! Lost 5-0 to Uruguay in 2014 playoff — redemption now.",
    prevWC:"First World Cup appearance"
  },
  // ── GROUP K ──
  "Portugal": {
    rank:6, conf:"UEFA", key:"Bruno Fernandes", style:"Attack-minded, creative",
    qual:"UEFA Group G winners",
    qualRecord:{ p:8, w:7, d:0, l:1, gf:26, ga:6 },
    qualNote:"Dominant qualifying. Post-Ronaldo era — Bruno Fernandes leads.",
    prevWC:"8 appearances. Best: 3rd (1966). Qatar 2022: QF"
  },
  "DR Congo": {
    rank:48, conf:"CAF", key:"Cédric Bakambu", style:"Physical, athletic",
    qual:"Inter-confederation playoffs",
    qualRecord:{ p:12, w:7, d:2, l:3, gf:18, ga:10 },
    qualNote:"Beat Jamaica in final intercontinental playoff. Made history — first WC since 1974 as Zaire.",
    prevWC:"1 appearance as Zaire (1974). Best: Group stage. Qatar 2022: DNQ"
  },
  "Uzbekistan": {
    rank:61, conf:"AFC", key:"Eldor Shomurodov", style:"Disciplined, counter-attack",
    qual:"AFC 3rd Round — Group C runners-up",
    qualRecord:{ p:10, w:5, d:3, l:2, gf:12, ga:7 },
    qualNote:"81st different country to reach WC. All 5 wins by just one goal!",
    prevWC:"First World Cup appearance"
  },
  "Colombia": {
    rank:15, conf:"CONMEBOL", key:"Luis Díaz", style:"Technical, attacking",
    qual:"CONMEBOL 3rd place",
    qualRecord:{ p:18, w:7, d:7, l:4, gf:28, ga:18 },
    qualNote:"High-scoring campaign. Involved in the wildest match: Venezuela 3-6 Colombia!",
    prevWC:"6 appearances. Best: QF (2014). Qatar 2022: DNQ"
  },
  // ── GROUP L ──
  "England": {
    rank:8, conf:"UEFA", key:"Jude Bellingham", style:"Direct, physical, creative",
    qual:"UEFA Group H winners",
    qualRecord:{ p:8, w:8, d:0, l:0, gf:24, ga:2 },
    qualNote:"PERFECT record — 8 wins, 24 goals, only 2 conceded. Most goals in UEFA qualifying.",
    prevWC:"16 appearances. 1× Champions (1966). Qatar 2022: QF"
  },
  "Croatia": {
    rank:11, conf:"UEFA", key:"Luka Modrić", style:"Technical, midfield control",
    qual:"UEFA Group D runners-up",
    qualRecord:{ p:8, w:5, d:1, l:2, gf:17, ga:9 },
    qualNote:"Qualified directly despite tough group. Modrić defies age at 40.",
    prevWC:"6 appearances. Best: Runners-up (2018). Qatar 2022: 3rd place"
  },
  "Ghana": {
    rank:60, conf:"CAF", key:"Mohammed Kudus", style:"Explosive, skillful",
    qual:"CAF Group E winners",
    qualRecord:{ p:10, w:5, d:3, l:2, gf:14, ga:9 },
    qualNote:"Won tough African group. Federation fired head coach after poor pre-tournament friendlies.",
    prevWC:"4 appearances. Best: QF (2010). Qatar 2022: Group stage"
  },
  "Panama": {
    rank:73, conf:"CONCACAF", key:"Rolando Blackburn", style:"Defensive, physical",
    qual:"CONCACAF 3rd Round qualifiers",
    qualRecord:{ p:14, w:7, d:3, l:4, gf:20, ga:15 },
    qualNote:"Only 3rd World Cup. Defensive setup worked throughout qualifying.",
    prevWC:"2 appearances. Best: Group stage (2018). Qatar 2022: DNQ"
  },
};

export function rankEmoji(rank) {
  if (rank <= 5)  return "🔥";
  if (rank <= 15) return "⭐";
  if (rank <= 30) return "💪";
  if (rank <= 55) return "👍";
  return "🌱";
}

export function formColor(result) {
  if (result === "W") return "#3DAA6E";
  if (result === "D") return "#E08C2A";
  return "#E05555";
}
