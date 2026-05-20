import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { loadPool, savePool } from './supabase';
import { GROUPS_2026, FLAGS, ALL_TEAMS, INITIAL_POOL, calcPts } from './data';
import { CSS } from './styles';
import {
  TopBar, PageFooter, MatchRow, AdminMatchRow, PinGate, Pbar, TeamBadge, Pts, LegalBox
} from './components';

// ─── HOME ────────────────────────────────────────────────────────────────────

function HomeView({ shared, leaderboard, completedMatches, totalMatches, me, setView }) {
  return (
    <div>
      <div style={{ background:"linear-gradient(180deg,rgba(201,168,76,0.07) 0%,transparent 100%)",
        padding:"28px 20px 22px", textAlign:"center", borderBottom:"1px solid var(--bd)" }}>
        <div style={{ fontSize:52, marginBottom:8 }}>⚽</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, lineHeight:1.1, marginBottom:6, color:"#fff" }}>{shared.poolName}</h1>
        <p style={{ color:"var(--gold)", fontSize:13, fontWeight:600 }}>FIFA World Cup 2026 · USA / Canada / Mexico</p>
        <p style={{ color:"var(--muted)", fontSize:11, marginTop:4 }}>A friendly prediction game for the SRI Dads community</p>
      </div>
      <div style={{ padding:"18px 16px", display:"flex", flexDirection:"column", gap:14 }}>
        {!me ? (
          <div className="card-gold" style={{ padding:20, textAlign:"center" }}>
            <p style={{ fontWeight:700, fontSize:16, marginBottom:4, color:"#fff" }}>Ready to play?</p>
            <p style={{ color:"var(--muted)", fontSize:13, marginBottom:16 }}>Sign up and make your predictions to compete with the other dads.</p>
            <button className="btn btn-gold" onClick={() => setView("join")}>Sign Up / Log In</button>
          </div>
        ) : (
          <div className="card" style={{ padding:16, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:"50%", background:"var(--gold-pale)",
              border:"2px solid var(--gold-bd)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>👤</div>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:700, fontSize:15 }}>Hey, {me.name}!</p>
              <p style={{ color:"var(--muted)", fontSize:12 }}>{Object.keys((shared.predictions[me.id] || {})).length} predictions saved</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setView("predict")}>Predict →</button>
          </div>
        )}
        <div className="card" style={{ padding:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <span style={{ fontWeight:600, fontSize:13 }}>Matches played</span>
            <span style={{ color:"var(--gold)", fontWeight:700, fontSize:13 }}>{completedMatches} / {totalMatches}</span>
          </div>
          <Pbar value={completedMatches} max={totalMatches} />
        </div>
        <div className="card" style={{ padding:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:"var(--gold)" }}>🏆 Standings</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setView("leaderboard")}>Full table →</button>
          </div>
          {leaderboard.length === 0
            ? <p style={{ color:"var(--muted)", fontSize:13, textAlign:"center", padding:"8px 0" }}>No participants yet</p>
            : leaderboard.slice(0, 3).map((p, i) => (
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <span style={{ fontSize:20, minWidth:28 }}>{["🥇","🥈","🥉"][i]}</span>
                <span style={{ flex:1, fontWeight:600 }}>{p.name}</span>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:"var(--gold)", lineHeight:1 }}>{p.pts}</span>
                <span style={{ color:"var(--muted)", fontSize:12 }}>pts</span>
              </div>
            ))
          }
        </div>
        {/* WhatsApp share button */}
        <a
          href={`https://wa.me/?text=${encodeURIComponent("⚽ Join our World Cup 2026 Pool!\n\nSign up and predict match scores to compete with the other SRI Dads.\n\n🔗 www.sridads.com\n\nMay the best dad win! 🏆")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10,
            background:"#25D366", borderRadius:12, padding:"14px 20px",
            color:"#fff", fontWeight:700, fontSize:14, textDecoration:"none",
            boxShadow:"0 4px 16px rgba(37,211,102,0.3)" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Share with the Dads on WhatsApp
        </a>

        <div className="card" style={{ padding:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:"var(--gold)" }}>📋 Scoring</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setView("rules")}>Full rules →</button>
          </div>
          {[["⭐ Exact score","3 pts"],["✅ Correct outcome","1 pt"],["❌ Wrong","0 pts"]].map(([l, v]) => (
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid var(--bd)" }}>
              <span style={{ fontSize:13 }}>{l}</span>
              <span style={{ fontWeight:700, color:"var(--gold)", fontSize:13 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <PageFooter />
    </div>
  );
}

// ─── JOIN ─────────────────────────────────────────────────────────────────────

function JoinView({ shared, persist, loginAs, setView }) {
  const [mode, setMode] = useState("choose");
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [pin2, setPin2] = useState("");
  const [err, setErr] = useState("");
  const [selId, setSelId] = useState(null);

  function handleRegister() {
    setErr("");
    if (!name.trim()) return setErr("Please enter your name.");
    if (pin.length < 4) return setErr("Please choose a 4-digit PIN.");
    if (pin !== pin2) return setErr("PINs don't match.");
    if (shared.participants.find(p => p.name.toLowerCase() === name.trim().toLowerCase()))
      return setErr("That name is already taken.");
    const np = { id: Date.now().toString(), name: name.trim(), pin, joinedAt: new Date().toISOString() };
    persist(s => ({ ...s, participants: [...s.participants, np] }));
    loginAs({ id: np.id, name: np.name });
  }

  function handleLogin() {
    setErr("");
    const p = shared.participants.find(p => p.id === selId);
    if (!p) return setErr("Select your name.");
    if (p.pin !== pin) return setErr("Incorrect PIN.");
    loginAs({ id: p.id, name: p.name });
  }

  return (
    <div>
      <div style={{ padding:"20px 20px" }}>
        <button className="btn btn-ghost btn-sm" style={{ marginBottom:20 }}
          onClick={() => mode === "choose" ? setView("home") : setMode("choose")}>← Back</button>

        {mode === "choose" && (
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:4, color:"#fff" }}>Welcome, Dad! 👋</h2>
            <p style={{ color:"var(--muted)", fontSize:13, marginBottom:28 }}>First time, or returning?</p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <button className="btn btn-gold" style={{ padding:18, fontSize:15, textAlign:"left", display:"flex", gap:12, alignItems:"center" }}
                onClick={() => setMode("register")}>
                <span style={{ fontSize:22 }}>🆕</span>
                <div>
                  <div>I'm new — sign me up</div>
                  <div style={{ fontSize:12, fontWeight:500, opacity:.75 }}>Create your account</div>
                </div>
              </button>
              {shared.participants.length > 0 && (
                <button className="btn btn-ghost" style={{ padding:18, fontSize:15, textAlign:"left", display:"flex", gap:12, alignItems:"center" }}
                  onClick={() => setMode("login")}>
                  <span style={{ fontSize:22 }}>🔑</span>
                  <div>
                    <div>I'm already signed up</div>
                    <div style={{ fontSize:12, fontWeight:500, opacity:.75 }}>Log back in</div>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        {mode === "register" && (
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:4, color:"#fff" }}>Sign Up</h2>
            <p style={{ color:"var(--muted)", fontSize:13, marginBottom:24 }}>Choose a name and a 4-digit PIN.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <p className="lbl" style={{ marginBottom:6 }}>Your name</p>
                <input className="inp" placeholder="e.g. Thomas" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <p className="lbl" style={{ marginBottom:6 }}>PIN (4 digits)</p>
                <input className="inp" type="password" inputMode="numeric" maxLength={4} placeholder="••••"
                  value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ""))} />
              </div>
              <div>
                <p className="lbl" style={{ marginBottom:6 }}>Repeat PIN</p>
                <input className="inp" type="password" inputMode="numeric" maxLength={4} placeholder="••••"
                  value={pin2} onChange={e => setPin2(e.target.value.replace(/\D/g, ""))} />
              </div>
              {err && <p style={{ color:"var(--danger)", fontSize:13 }}>{err}</p>}
              <button className="btn btn-gold" onClick={handleRegister} disabled={!name || pin.length < 4 || pin2.length < 4}>
                Sign Up & Start →
              </button>
            </div>
          </div>
        )}

        {mode === "login" && (
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:4, color:"#fff" }}>Log In</h2>
            <p style={{ color:"var(--muted)", fontSize:13, marginBottom:20 }}>Select your name and enter your PIN.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
              {shared.participants.map(p => (
                <button key={p.id}
                  style={{ background: selId === p.id ? "var(--gold-pale)" : "rgba(255,255,255,.03)",
                    border:`1.5px solid ${selId === p.id ? "var(--gold)" : "var(--bd)"}`,
                    borderRadius:12, padding:"14px 18px", cursor:"pointer", color:"var(--text)",
                    display:"flex", alignItems:"center", gap:12, fontFamily:"Inter,sans-serif", fontSize:15, fontWeight:600 }}
                  onClick={() => setSelId(p.id)}>
                  <span style={{ fontSize:20 }}>👤</span>
                  <span style={{ flex:1, textAlign:"left" }}>{p.name}</span>
                  {selId === p.id && <span style={{ color:"var(--gold)" }}>✓</span>}
                </button>
              ))}
            </div>
            {selId && (
              <div>
                <p className="lbl" style={{ marginBottom:6 }}>Your PIN</p>
                <input className="inp" type="password" inputMode="numeric" maxLength={4} placeholder="••••"
                  value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ""))} style={{ marginBottom:14 }} />
              </div>
            )}
            {err && <p style={{ color:"var(--danger)", fontSize:13, marginBottom:10 }}>{err}</p>}
            <button className="btn btn-gold" onClick={handleLogin} disabled={!selId || pin.length < 4}>Log In →</button>
          </div>
        )}
      </div>
      <PageFooter />
    </div>
  );
}

// ─── PREDICT ─────────────────────────────────────────────────────────────────

function PredictView({ shared, me, persist, logout, activeGroup, setActiveGroup, activeStage, setActiveStage, setView }) {
  const myPreds = shared.predictions[me.id] || {};
  const filled = Object.values(myPreds).filter(p => p.homeGoals !== "" && p.awayGoals !== "").length;
  const groupMatches = shared.matches.filter(m => m.group === activeGroup);
  const stages = ["Round of 32","Round of 16","Quarter-final","Semi-final","Final"];

  function updatePred(matchId, hg, ag) {
    persist(s => ({
      ...s,
      predictions: { ...s.predictions, [me.id]: { ...(s.predictions[me.id] || {}), [matchId]: { homeGoals: hg, awayGoals: ag } } }
    }));
  }

  if (!me) return (
    <div>
      <div style={{ padding:"60px 20px", textAlign:"center" }}>
        <p style={{ fontSize:40, marginBottom:12 }}>🔒</p>
        <p style={{ fontWeight:700, fontSize:16, marginBottom:8 }}>Not logged in</p>
        <p style={{ color:"var(--muted)", fontSize:13, marginBottom:20 }}>Sign up or log in to enter your predictions.</p>
        <button className="btn btn-gold" onClick={() => setView("join")}>Sign Up / Log In</button>
      </div>
      <PageFooter />
    </div>
  );

  return (
    <div>
      <div style={{ padding:"16px 16px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"var(--gold)" }}>✏️ My Predictions</p>
            <p style={{ color:"var(--muted)", fontSize:12 }}>{me.name} · {filled} saved</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Log out</button>
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:14, overflowX:"auto", paddingBottom:2 }}>
          {[["group","Group Stage"],["knockout","Knockout"]].map(([s, l]) => (
            <button key={s} className={`tab ${activeStage === s ? "on" : "off"}`} onClick={() => setActiveStage(s)}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ padding:"0 16px" }}>
        {activeStage === "group" && (
          <div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
              {Object.keys(GROUPS_2026).map(g => (
                <button key={g} className={`gtab ${activeGroup === g ? "on" : "off"}`} onClick={() => setActiveGroup(g)}>{g}</button>
              ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {groupMatches.map(m => <MatchRow key={m.id} match={m} myPred={myPreds[m.id]} onUpdate={updatePred} showResult />)}
            </div>
          </div>
        )}
        {activeStage === "knockout" && (
          <div>
            {stages.map(stage => (
              <div key={stage} style={{ marginBottom:20 }}>
                <p className="lbl" style={{ marginBottom:10 }}>{stage}</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {shared.knockoutMatches.filter(m => m.stage === stage).map(m => (
                    <MatchRow key={m.id} match={m} myPred={myPreds[m.id]} onUpdate={updatePred} showResult />
                  ))}
                </div>
              </div>
            ))}
            <div className="card-gold" style={{ padding:16, marginTop:4 }}>
              <p style={{ fontWeight:700, marginBottom:8, fontSize:14, color:"#fff" }}>🏆 Who will be World Champion?</p>
              <select className="inp" value={shared.champions[me.id] || ""}
                onChange={e => persist(s => ({ ...s, champions: { ...s.champions, [me.id]: e.target.value } }))}>
                <option value="">Select a country...</option>
                {ALL_TEAMS.map(t => <option key={t} value={t}>{FLAGS[t]} {t}</option>)}
              </select>
              {shared.champions[me.id] && (
                <p style={{ marginTop:8, fontSize:12, color:"var(--muted)" }}>
                  Your pick: {FLAGS[shared.champions[me.id]]} <strong style={{ color:"var(--text)" }}>{shared.champions[me.id]}</strong>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      <PageFooter />
    </div>
  );
}

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────

function LeaderboardView({ leaderboard, shared }) {
  const maxPts = leaderboard[0]?.pts || 1;
  return (
    <div>
      <div style={{ padding:"20px 16px" }}>
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:20, color:"var(--gold)" }}>🏆 Leaderboard</p>
        {leaderboard.length === 0
          ? <div style={{ textAlign:"center", padding:48, color:"var(--muted)" }}><p style={{ fontSize:40, marginBottom:10 }}>👥</p><p>No participants yet</p></div>
          : <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {leaderboard.map((p, i) => (
                <div key={p.id} className={`card ${i===0?"lb1":i===1?"lb2":i===2?"lb3":""}`} style={{ padding:"16px 18px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:22, minWidth:30, textAlign:"center" }}>
                      {i < 3 ? ["🥇","🥈","🥉"][i] : <span style={{ fontFamily:"'Playfair Display',serif", color:"var(--muted)", fontSize:18 }}>#{i+1}</span>}
                    </span>
                    <div style={{ flex:1 }}>
                      <p style={{ fontWeight:700, fontSize:15, marginBottom:2 }}>{p.name}</p>
                      <p style={{ fontSize:11, color:"var(--muted)" }}>⭐ {p.exact} exact · ✅ {p.correct} correct</p>
                      {shared.champions[p.id] && (
                        <p style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>🏆 Pick: {FLAGS[shared.champions[p.id]]} {shared.champions[p.id]}</p>
                      )}
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <span style={{ fontFamily:"'Playfair Display',serif", fontSize:32, color: i===0 ? "var(--gold)" : "var(--text)", lineHeight:1 }}>{p.pts}</span>
                      <span style={{ fontSize:11, color:"var(--muted)", marginLeft:3 }}>pts</span>
                    </div>
                  </div>
                  <div style={{ marginTop:10 }}><Pbar value={p.pts} max={maxPts} /></div>
                </div>
              ))}
            </div>
        }
      </div>
      <PageFooter />
    </div>
  );
}

// ─── RULES ───────────────────────────────────────────────────────────────────

function RulesView() {
  const rules = [
    { icon:"⚽", title:"How it works", body:"Predict the score of every group stage match. Once the knockout bracket is set, predict those too. Most points at the end of the Final wins — bragging rights only, no prizes." },
    { icon:"⭐", title:"Exact score — 3 points", body:"Predict the exact final score (e.g. 2–1) and the match ends 2–1 → 3 points. The jackpot!" },
    { icon:"✅", title:"Correct outcome — 1 point", body:"Predict the right result (home win, draw, or away win) but not the exact score → 1 point." },
    { icon:"❌", title:"Wrong prediction — 0 points", body:"Wrong outcome entirely → 0 points." },
    { icon:"🏆", title:"World Champion pick", body:"Pick the team you think lifts the trophy. No points — pure bragging rights on the school run." },
    { icon:"🔒", title:"Predictions lock when results are entered", body:"Predictions for a match lock once the admin enters the result. Fill them in early!" },
    { icon:"🤝", title:"Fair play", body:"This pool is for fun among the SRI Dads community. No financial stakes. All disputes are settled by the pool organiser — final decision is theirs." },
  ];
  return (
    <div>
      <div style={{ padding:"20px 16px" }}>
        <div className="card-gold" style={{ padding:"20px 18px", marginBottom:20, textAlign:"center" }}>
          <p style={{ fontSize:36, marginBottom:6 }}>📋</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:"#fff", marginBottom:4 }}>Pool Rules</h2>
          <p style={{ color:"var(--gold)", fontSize:11, fontWeight:600, letterSpacing:"1px", textTransform:"uppercase" }}>SRI Dads · World Cup 2026</p>
        </div>
        <div className="card" style={{ padding:16, marginBottom:16 }}>
          <p className="lbl" style={{ marginBottom:12 }}>Points at a glance</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, textAlign:"center" }}>
            {[["⭐","Exact\nscore","3 pts","var(--ok)"],["✅","Correct\noutcome","1 pt","var(--amber)"],["❌","Wrong","0 pts","var(--muted)"]].map(([ic, lb, pts, col]) => (
              <div key={lb} style={{ background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"12px 8px", border:"1px solid var(--bd)" }}>
                <div style={{ fontSize:22, marginBottom:4 }}>{ic}</div>
                <div style={{ fontSize:11, color:"var(--muted)", marginBottom:6, whiteSpace:"pre-line", lineHeight:1.3 }}>{lb}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:col, fontWeight:700 }}>{pts}</div>
              </div>
            ))}
          </div>
        </div>
        {rules.map((r, i) => (
          <div key={i} className="rcard">
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <span style={{ fontSize:20 }}>{r.icon}</span>
              <span style={{ fontWeight:700, fontSize:14, color:"#fff" }}>{r.title}</span>
            </div>
            <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.65, paddingLeft:30 }}>{r.body}</p>
          </div>
        ))}
        <div style={{ marginTop:20 }}><LegalBox /></div>
      </div>
      <PageFooter />
    </div>
  );
}

// ─── RESULTS ─────────────────────────────────────────────────────────────────

function ResultsView({ shared, persist, activeGroup, setActiveGroup, activeStage, setActiveStage, adminUnlocked, setAdminUnlocked, showToast }) {
  const stages = ["Round of 32","Round of 16","Quarter-final","Semi-final","Final"];

  if (!adminUnlocked) return (
    <div><PinGate onUnlock={() => setAdminUnlocked(true)} adminPin={shared.adminPin} /><PageFooter /></div>
  );

  function saveResult(matchId, hg, ag, isKo) {
    const key = isKo ? "knockoutMatches" : "matches";
    persist(s => ({ ...s, [key]: s[key].map(m => m.id === matchId ? { ...m, result:{ homeGoals:hg, awayGoals:ag } } : m) }));
    showToast("Result saved ✓");
  }

  const groupMatches = shared.matches.filter(m => m.group === activeGroup);

  return (
    <div>
      <div style={{ padding:"16px 16px" }}>
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:24, marginBottom:16, color:"var(--gold)" }}>📝 Enter Results</p>
        <div style={{ display:"flex", gap:8, marginBottom:14 }}>
          {[["group","Group Stage"],["knockout","Knockout"]].map(([s, l]) => (
            <button key={s} className={`tab ${activeStage === s ? "on" : "off"}`} onClick={() => setActiveStage(s)}>{l}</button>
          ))}
        </div>
        {activeStage === "group" && (
          <div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
              {Object.keys(GROUPS_2026).map(g => (
                <button key={g} className={`gtab ${activeGroup === g ? "on" : "off"}`} onClick={() => setActiveGroup(g)}>{g}</button>
              ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {groupMatches.map(m => <AdminMatchRow key={m.id} match={m} onSave={(h, a) => saveResult(m.id, h, a, false)} />)}
            </div>
          </div>
        )}
        {activeStage === "knockout" && stages.map(stage => (
          <div key={stage} style={{ marginBottom:20 }}>
            <p className="lbl" style={{ marginBottom:10 }}>{stage}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {shared.knockoutMatches.filter(m => m.stage === stage).map(m => (
                <AdminMatchRow key={m.id} match={m} onSave={(h, a) => saveResult(m.id, h, a, true)} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <PageFooter />
    </div>
  );
}

// ─── ADMIN ───────────────────────────────────────────────────────────────────

function AdminView({ shared, persist, adminUnlocked, setAdminUnlocked, completedMatches, showToast }) {
  const [nameEdit, setNameEdit] = useState("");

  if (!adminUnlocked) return (
    <div><PinGate onUnlock={() => setAdminUnlocked(true)} adminPin={shared.adminPin} /><PageFooter /></div>
  );

  const totalPreds = Object.values(shared.predictions).reduce((a, p) => a + Object.keys(p).length, 0);

  return (
    <div>
      <div style={{ padding:"16px 16px" }}>
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:24, marginBottom:20, color:"var(--gold)" }}>⚙️ Admin Panel</p>
        <div style={{ marginBottom:14 }}>
          <p className="lbl" style={{ marginBottom:8 }}>Pool name</p>
          <div className="card" style={{ padding:14 }}>
            <div style={{ display:"flex", gap:10 }}>
              <input className="inp" value={nameEdit || shared.poolName} onChange={e => setNameEdit(e.target.value)} placeholder={shared.poolName} />
              <button className="btn btn-gold btn-sm" style={{ flexShrink:0 }} onClick={() => {
                if (nameEdit.trim()) persist(s => ({ ...s, poolName: nameEdit.trim() }));
                setNameEdit(""); showToast("Name updated");
              }}>Save</button>
            </div>
          </div>
        </div>
        <div style={{ marginBottom:14 }}>
          <p className="lbl" style={{ marginBottom:8 }}>Participants ({shared.participants.length})</p>
          <div className="card" style={{ padding:14 }}>
            {shared.participants.length === 0
              ? <p style={{ color:"var(--muted)", fontSize:13, textAlign:"center", padding:"8px 0" }}>No participants yet — they sign up themselves!</p>
              : shared.participants.map(p => (
                <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:"1px solid var(--bd)" }}>
                  <span style={{ fontSize:18 }}>👤</span>
                  <span style={{ flex:1, fontWeight:500 }}>{p.name}</span>
                  <span style={{ fontSize:11, color:"var(--muted)", marginRight:4 }}>{Object.keys(shared.predictions[p.id] || {}).length} preds</span>
                  <button className="btn-del" onClick={() => {
                    persist(s => ({ ...s, participants: s.participants.filter(x => x.id !== p.id) }));
                    showToast(`${p.name} removed`);
                  }}>✕</button>
                </div>
              ))
            }
          </div>
        </div>
        <div style={{ marginBottom:14 }}>
          <p className="lbl" style={{ marginBottom:8 }}>Statistics</p>
          <div className="card" style={{ padding:14 }}>
            {[["Participants", shared.participants.length],["Group matches", shared.matches.length],
              ["Results entered", completedMatches],["Total predictions", totalPreds]].map(([l, v]) => (
              <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid var(--bd)" }}>
                <span style={{ fontSize:13 }}>{l}</span>
                <span style={{ fontWeight:700, color:"var(--gold)" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <PageFooter />
    </div>
  );
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [shared, setShared] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [me, setMe] = useState(null);
  const [view, setView] = useState("home");
  const [activeGroup, setActiveGroup] = useState("A");
  const [activeStage, setActiveStage] = useState("group");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [toast, setToast] = useState(null);
  // Secret admin access via URL hash: sridads.com/#admin
  const isAdminUrl = window.location.hash === "#admin";

  useEffect(() => {
    (async () => {
      const data = await loadPool();
      setShared(data && data.matches ? data : INITIAL_POOL);
      setLoading(false);
      try {
        const s = JSON.parse(sessionStorage.getItem("sri_me") || "null");
        if (s) setMe(s);
      } catch {}
    })();
  }, []);

  // Poll for updates every 30 seconds so standings stay fresh
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!saving) {
        const data = await loadPool();
        if (data && data.matches) setShared(data);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [saving]);

  const persist = useCallback(async (updater) => {
    setSaving(true);
    setShared(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      savePool(next).finally(() => setSaving(false));
      return next;
    });
  }, []);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2600); }

  function loginAs(p) {
    setMe(p);
    try { sessionStorage.setItem("sri_me", JSON.stringify(p)); } catch {}
    showToast(`Welcome, ${p.name}! ⚽`);
    setView("predict");
  }

  function logout() {
    setMe(null);
    try { sessionStorage.removeItem("sri_me"); } catch {}
    setView("home");
  }

  const leaderboard = useMemo(() => {
    if (!shared) return [];
    return shared.participants.map(p => {
      let pts = 0, exact = 0, correct = 0;
      [...shared.matches, ...shared.knockoutMatches].forEach(m => {
        if (!m.result) return;
        const s = calcPts((shared.predictions[p.id] || {})[m.id], m.result);
        pts += s; if (s === 3) exact++; if (s === 1) correct++;
      });
      return { ...p, pts, exact, correct };
    }).sort((a, b) => b.pts - a.pts || b.exact - a.exact);
  }, [shared]);

  const completedMatches = shared ? shared.matches.filter(m => m.result).length : 0;
  const totalMatches = shared ? shared.matches.length : 0;

  if (loading) return (
    <div className="app">
      <style>{CSS}</style>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", gap:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <div style={{ width:26, height:26, background:"linear-gradient(135deg,#C9A84C,#8a6a28)", transform:"rotate(45deg)", borderRadius:3 }} />
          <p style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:18, color:"#C9A84C" }}>SRI DADS</p>
        </div>
        <span className="spin" style={{ fontSize:28, marginTop:8 }}>⚽</span>
        <p style={{ color:"var(--muted)", fontSize:13 }}>Loading pool...</p>
      </div>
    </div>
  );

  const navItems = [
    { id:"home", icon:"🏠", label:"Home" },
    { id:"predict", icon:"✏️", label:"Predict" },
    { id:"leaderboard", icon:"🏆", label:"Standings" },
    { id:"rules", icon:"📋", label:"Rules" },
    { id:"results", icon:"📝", label:"Scores", hidden: !isAdminUrl },
    { id:"admin", icon:"⚙️", label:"Admin", hidden: !isAdminUrl },
  ].filter(n => !n.hidden);

  const sp = { shared, persist, me, setView, showToast };

  return (
    <div className="app">
      <style>{CSS}</style>
      <TopBar saving={saving} />
      {view === "home"        && <HomeView {...sp} leaderboard={leaderboard} completedMatches={completedMatches} totalMatches={totalMatches} />}
      {view === "join"        && <JoinView {...sp} loginAs={loginAs} />}
      {view === "predict"     && <PredictView {...sp} logout={logout} activeGroup={activeGroup} setActiveGroup={setActiveGroup} activeStage={activeStage} setActiveStage={setActiveStage} />}
      {view === "leaderboard" && <LeaderboardView leaderboard={leaderboard} shared={shared} />}
      {view === "rules"       && <RulesView />}
      {view === "results"     && <ResultsView {...sp} activeGroup={activeGroup} setActiveGroup={setActiveGroup} activeStage={activeStage} setActiveStage={setActiveStage} adminUnlocked={adminUnlocked} setAdminUnlocked={setAdminUnlocked} />}
      {view === "admin"       && <AdminView {...sp} adminUnlocked={adminUnlocked} setAdminUnlocked={setAdminUnlocked} completedMatches={completedMatches} />}
      {toast && <div className="toast">{toast}</div>}
      <nav className="nav-bar">
        {navItems.map(n => (
          <button key={n.id} className={`nbtn ${view === n.id ? "on" : "off"}`} onClick={() => {
            if (n.id === "predict" && !me) setView("join");
            else setView(n.id);
          }}>
            <span style={{ fontSize:19 }}>{n.id === "predict" && me ? "😎" : n.icon}</span>
            <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.3px" }}>
              {n.id === "predict" && me ? me.name.split(" ")[0] : n.label}
            </span>
            {view === n.id && <div className="ndot" />}
          </button>
        ))}
      </nav>
    </div>
  );
}
