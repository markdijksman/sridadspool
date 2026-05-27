// ─── TEAM INFO DATA ───────────────────────────────────────────────────────────
// FIFA April 2026 Rankings + Key player + Confederation

export const TEAM_INFO = {
  // Group A
  "Mexico":        { rank:13, pts:1532, conf:"CONCACAF", key:"Hirving Lozano", style:"Physical, quick transitions" },
  "South Africa":  { rank:65, pts:1069, conf:"CAF",      key:"Percy Tau", style:"Disciplined defense, counter-attack" },
  "Korea Republic":{ rank:24, pts:1431, conf:"AFC",      key:"Son Heung-min", style:"High pressing, technical" },
  "Czechia":       { rank:36, pts:1295, conf:"UEFA",     key:"Tomáš Souček", style:"Set pieces, direct play" },
  // Group B
  "Canada":        { rank:44, pts:1193, conf:"CONCACAF", key:"Alphonso Davies", style:"Fast transitions, athletic" },
  "Bosnia and Herzegovina": { rank:55, pts:1110, conf:"UEFA", key:"Edin Džeko", style:"Physical, long ball" },
  "Qatar":         { rank:58, pts:1094, conf:"AFC",      key:"Akram Afif", style:"Organized, counter-attack" },
  "Switzerland":   { rank:19, pts:1476, conf:"UEFA",     key:"Granit Xhaka", style:"Structured, disciplined" },
  // Group C
  "Brazil":        { rank:5,  pts:1756, conf:"CONMEBOL", key:"Vinícius Jr.", style:"Samba football, skillful" },
  "Morocco":       { rank:14, pts:1522, conf:"CAF",      key:"Achraf Hakimi", style:"Defensive solidity, fast breaks" },
  "Haiti":         { rank:83, pts:997,  conf:"CONCACAF", key:"Frantzdy Pierrot", style:"Energetic, unpredictable" },
  "Scotland":      { rank:38, pts:1272, conf:"UEFA",     key:"Andrew Robertson", style:"High energy, set pieces" },
  // Group D
  "United States": { rank:16, pts:1507, conf:"CONCACAF", key:"Christian Pulisic", style:"Athletic, direct" },
  "Paraguay":      { rank:52, pts:1127, conf:"CONMEBOL", key:"Miguel Almirón", style:"Gritty, defensive" },
  "Australia":     { rank:25, pts:1421, conf:"AFC",      key:"Mathew Ryan", style:"Compact defense, set pieces" },
  "Türkiye":       { rank:30, pts:1367, conf:"UEFA",     key:"Hakan Çalhanoğlu", style:"Technical midfield, physical" },
  // Group E
  "Spain":         { rank:2,  pts:1841, conf:"UEFA",     key:"Pedri", style:"Tiki-taka, positional play" },
  "Senegal":       { rank:20, pts:1472, conf:"CAF",      key:"Sadio Mané", style:"Explosive, athletic" },
  "Serbia":        { rank:33, pts:1330, conf:"UEFA",     key:"Aleksandar Mitrović", style:"Direct, set pieces" },
  "Ecuador":       { rank:40, pts:1245, conf:"CONMEBOL", key:"Enner Valencia", style:"Organized, physical" },
  // Group F
  "Netherlands":   { rank:7,  pts:1733, conf:"UEFA",     key:"Virgil van Dijk", style:"Total football, technical" },
  "Japan":         { rank:18, pts:1488, conf:"AFC",      key:"Takumi Minamino", style:"High press, disciplined" },
  "Sweden":        { rank:28, pts:1385, conf:"UEFA",     key:"Viktor Gyökeres", style:"Physical, direct" },
  "Tunisia":       { rank:42, pts:1228, conf:"CAF",      key:"Youssef Msakni", style:"Defensive, counter-attack" },
  // Group G
  "Belgium":       { rank:3,  pts:1803, conf:"UEFA",     key:"Kevin De Bruyne", style:"Clinical, creative midfield" },
  "Egypt":         { rank:34, pts:1318, conf:"CAF",      key:"Mohamed Salah", style:"Counter-attack, Salah-dependent" },
  "Iran":          { rank:21, pts:1464, conf:"AFC",      key:"Sardar Azmoun", style:"Physical, defensive" },
  "New Zealand":   { rank:90, pts:967,  conf:"OFC",      key:"Chris Wood", style:"Direct, set pieces" },
  // Group H
  "Portugal":      { rank:6,  pts:1744, conf:"UEFA",     key:"Bruno Fernandes", style:"Attack-minded, creative" },
  "DR Congo":      { rank:48, pts:1162, conf:"CAF",      key:"Cédric Bakambu", style:"Physical, athletic" },
  "Uzbekistan":    { rank:61, pts:1079, conf:"AFC",      key:"Eldor Shomurodov", style:"Disciplined, counter-attack" },
  "Colombia":      { rank:15, pts:1518, conf:"CONMEBOL", key:"Luis Díaz", style:"Technical, attacking" },
  // Group I
  "Germany":       { rank:12, pts:1560, conf:"UEFA",     key:"Jamal Musiala", style:"Modern pressing, technical" },
  "Algeria":       { rank:39, pts:1258, conf:"CAF",      key:"Riyad Mahrez", style:"Quick transitions, skillful" },
  "Ivory Coast":   { rank:27, pts:1393, conf:"CAF",      key:"Sébastien Haller", style:"Physical, direct" },
  "Iraq":          { rank:63, pts:1073, conf:"AFC",      key:"Aymen Hussein", style:"Disciplined, defensive" },
  // Group J
  "Argentina":     { rank:4,  pts:1783, conf:"CONMEBOL", key:"Lionel Messi", style:"Organized, world-class attack" },
  "Chile":         { rank:35, pts:1305, conf:"CONMEBOL", key:"Alexis Sánchez", style:"High press, technical" },
  "Norway":        { rank:17, pts:1499, conf:"UEFA",     key:"Erling Haaland", style:"Direct, lethal on counter" },
  "France":        { rank:1,  pts:1877, conf:"UEFA",     key:"Kylian Mbappé", style:"Balanced, world-class depth" },
  // Group K
  "Portugal":      { rank:6,  pts:1744, conf:"UEFA",     key:"Bruno Fernandes", style:"Attack-minded, creative" },
  "DR Congo":      { rank:48, pts:1162, conf:"CAF",      key:"Cédric Bakambu", style:"Physical, athletic" },
  "Uzbekistan":    { rank:61, pts:1079, conf:"AFC",      key:"Eldor Shomurodov", style:"Disciplined, counter-attack" },
  "Colombia":      { rank:15, pts:1518, conf:"CONMEBOL", key:"Luis Díaz", style:"Technical, attacking" },
  // Group L
  "England":       { rank:5,  pts:1756, conf:"UEFA",     key:"Jude Bellingham", style:"Direct, physical, creative" },
  "Croatia":       { rank:11, pts:1568, conf:"UEFA",     key:"Luka Modrić", style:"Technical, midfield control" },
  "Ghana":         { rank:60, pts:1082, conf:"CAF",      key:"Mohammed Kudus", style:"Explosive, skillful" },
  "Panama":        { rank:73, pts:1040, conf:"CONCACAF", key:"Rolando Blackburn", style:"Defensive, physical" },
  // Additional teams
  "Saudi Arabia":  { rank:56, pts:1106, conf:"AFC",      key:"Saleh Al-Shehri", style:"Organized, counter-attack" },
  "South Korea":   { rank:24, pts:1431, conf:"AFC",      key:"Son Heung-min", style:"High pressing, technical" },
  "Venezuela":     { rank:47, pts:1167, conf:"CONMEBOL", key:"Salomón Rondón", style:"Compact, counter-attack" },
  "Peru":          { rank:46, pts:1172, conf:"CONMEBOL", key:"Paolo Guerrero", style:"Technical, disciplined" },
  "Uruguay":       { rank:9,  pts:1680, conf:"CONMEBOL", key:"Darwin Núñez", style:"Physical, defensive solidity" },
  "Bolivia":       { rank:80, pts:1010, conf:"CONMEBOL", key:"Marcelo Moreno", style:"Physical, altitude advantage" },
  "Nigeria":       { rank:31, pts:1355, conf:"CAF",      key:"Victor Osimhen", style:"Athletic, direct" },
  "Cameroon":      { rank:43, pts:1218, conf:"CAF",      key:"André Onana", style:"Physical, athletic" },
  "Mali":          { rank:54, pts:1117, conf:"CAF",      key:"Naby Keïta", style:"Technical, midfield-focused" },
  "Tanzania":      { rank:122,pts:854,  conf:"CAF",      key:"Mbwana Samatta", style:"Physical, defensive" },
  "Kenya":         { rank:100,pts:934,  conf:"CAF",      key:"Michael Olunga", style:"Direct, counter-attack" },
  "Curaçao":       { rank:88, pts:975,  conf:"CONCACAF", key:"Leandro Bacuna", style:"Organized, technical" },
  "Trinidad and Tobago": { rank:95, pts:952, conf:"CONCACAF", key:"Kevin Molino", style:"Disciplined, counter" },
};

// Confidence emoji based on FIFA rank
export function rankEmoji(rank) {
  if (rank <= 10) return "🔥";
  if (rank <= 20) return "⭐";
  if (rank <= 35) return "💪";
  if (rank <= 55) return "👍";
  return "🌱";
}
