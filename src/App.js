import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { loadPool, savePool } from './supabase';
import { GROUPS_2026, FLAGS, ALL_TEAMS, INITIAL_POOL, calcPts } from './data';
import { CSS } from './styles';
import {
  TopBar, PageFooter, MatchRow, AdminMatchRow, PinGate, Pbar, TeamBadge, Pts, LegalBox, SriDadsLogo
} from './components';
import { fetchCompletedMatches, fetchLiveMatches, mergeApiResults, getPollInterval } from './scoreSync';
import { getEligibleTeams, getCountdown, isPredictionLocked, FIRST_MATCH_UTC, inferKnockoutBracket } from './knockout';

// ─── COUNTDOWN WIDGET ────────────────────────────────────────────────────────

function Countdown() {
  const [cd, setCd] = useState(getCountdown());
  useEffect(() => {
    const t = setInterval(() => setCd(getCountdown()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!cd) return (
    <div style={{ background:"rgba(224,85,85,0.12)", border:"1px solid rgba(224,85,85,0.3)", borderRadius:12, padding:"12px 16px", textAlign:"center" }}>
      <p style={{ fontSize:13, fontWeight:700, color:"#E05555" }}>🔒 Predictions are now locked — the tournament has started!</p>
    </div>
  );

  const { days, hours, minutes, seconds } = cd;
  const urgency = cd.diff < 24*60*60*1000; // less than 24h

  return (
    <div style={{ background: urgency ? "rgba(224,85,85,0.1)" : "var(--gold-pale)", border:`1px solid ${urgency ? "rgba(224,85,85,0.3)" : "var(--gold-bd)"}`, borderRadius:12, padding:"14px 16px" }}>
      <p style={{ fontSize:11, fontWeight:700, color: urgency ? "#E05555" : "var(--gold)", marginBottom:10, letterSpacing:"1px", textTransform:"uppercase" }}>
        ⏱ {urgency ? "⚠️ Less than 24h left!" : "Predictions close at kickoff"}
      </p>
      <p style={{ fontSize:10, color:"var(--muted)", marginBottom:10 }}>Mexico vs South Africa · Thu 11 Jun · 23:00 Dubai</p>
      <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
        {[["days",days],["hrs",hours],["min",minutes],["sec",seconds]].map(([l,v]) => (
          <div key={l} style={{ textAlign:"center", background:"rgba(255,255,255,0.06)", borderRadius:8, padding:"8px 10px", minWidth:52 }}>
            <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:28, color: urgency ? "#E05555" : "var(--gold)", lineHeight:1 }}>{String(v).padStart(2,"0")}</div>
            <div style={{ fontSize:10, color:"var(--muted)", marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────

function HomeView({ shared, leaderboard, completedMatches, totalMatches, me, setView }) {
  return (
    <div>
      <div style={{ background:"linear-gradient(180deg,rgba(232,184,75,0.07) 0%,transparent 100%)", padding:"28px 20px 22px", textAlign:"center", borderBottom:"1px solid var(--bd)" }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:10 }}>
          <SriDadsLogo size={110} />
        </div>
        <h1 style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:44, lineHeight:1, marginBottom:6, color:"#fff", letterSpacing:"2px" }}>{shared.poolName}</h1>
        <p style={{ color:"var(--gold)", fontSize:13, fontWeight:600 }}>FIFA World Cup 2026 · USA / Canada / Mexico</p>
        <p style={{ color:"var(--muted)", fontSize:11, marginTop:4 }}>A friendly prediction game for the SRI Dads community</p>
      </div>
      <div style={{ padding:"18px 16px", display:"flex", flexDirection:"column", gap:14 }}>
        {/* Countdown */}
        <Countdown />

        {!me ? (
          <div className="card-gold" style={{ padding:20, textAlign:"center" }}>
            <p style={{ fontWeight:700, fontSize:16, marginBottom:4, color:"#fff" }}>Ready to play?</p>
            <p style={{ color:"var(--muted)", fontSize:13, marginBottom:16 }}>Sign up and make your predictions to compete with the other dads.</p>
            <button className="btn btn-gold" onClick={() => setView("join")}>Sign Up / Log In</button>
          </div>
        ) : (
          <div className="card" style={{ padding:16, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:"50%", background:"var(--gold-pale)", border:"2px solid var(--gold-bd)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>👤</div>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:700, fontSize:15 }}>Hey, {me.name}!</p>
              <p style={{ color:"var(--muted)", fontSize:12 }}>{Object.keys((shared.predictions[me.id] || {})).length} predictions saved · auto-saved ✓</p>
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
            <span style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:18, color:"var(--gold)" }}>🏆 Standings</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setView("leaderboard")}>Full table →</button>
          </div>
          {leaderboard.length === 0
            ? <p style={{ color:"var(--muted)", fontSize:13, textAlign:"center", padding:"8px 0" }}>No participants yet</p>
            : leaderboard.slice(0, 3).map((p, i) => (
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <span style={{ fontSize:20, minWidth:28 }}>{["🥇","🥈","🥉"][i]}</span>
                <span style={{ flex:1, fontWeight:600 }}>{p.name}</span>
                <span style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:28, color:"var(--gold)", lineHeight:1 }}>{p.pts}</span>
                <span style={{ color:"var(--muted)", fontSize:12 }}>pts</span>
              </div>
            ))
          }
        </div>
        <div className="card" style={{ padding:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:18, color:"var(--gold)" }}>📋 Scoring</span>
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
    if (shared.participants.find(p => p.name.toLowerCase() === name.trim().toLowerCase())) return setErr("That name is already taken.");
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
        <button className="btn btn-ghost btn-sm" style={{ marginBottom:20 }} onClick={() => mode === "choose" ? setView("home") : setMode("choose")}>← Back</button>
        {mode === "choose" && (
          <div>
            <h2 style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:26, marginBottom:4, color:"#fff" }}>Welcome, Dad! 👋</h2>
            <p style={{ color:"var(--muted)", fontSize:13, marginBottom:28 }}>First time, or returning?</p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <button className="btn btn-gold" style={{ padding:18, fontSize:15, textAlign:"left", display:"flex", gap:12, alignItems:"center" }} onClick={() => setMode("register")}>
                <span style={{ fontSize:22 }}>🆕</span>
                <div><div>I'm new — sign me up</div><div style={{ fontSize:12, fontWeight:500, opacity:.75 }}>Create your account</div></div>
              </button>
              <button className="btn btn-ghost" style={{ padding:18, fontSize:15, textAlign:"left", display:"flex", gap:12, alignItems:"center" }} onClick={() => setMode("login")}>
                <span style={{ fontSize:22 }}>🔑</span>
                <div><div>I'm already signed up</div><div style={{ fontSize:12, fontWeight:500, opacity:.75 }}>Log back in</div></div>
              </button>
            </div>
          </div>
        )}
        {mode === "register" && (
          <div>
            <h2 style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:26, marginBottom:4, color:"#fff" }}>Sign Up</h2>
            <p style={{ color:"var(--muted)", fontSize:13, marginBottom:24 }}>Choose a name and a 4-digit PIN.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div><p className="lbl" style={{ marginBottom:6 }}>Your name</p><input className="inp" placeholder="e.g. Thomas" value={name} onChange={e => setName(e.target.value)} /></div>
              <div><p className="lbl" style={{ marginBottom:6 }}>PIN (4 digits)</p><input className="inp" type="password" inputMode="numeric" maxLength={4} placeholder="••••" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ""))} /></div>
              <div><p className="lbl" style={{ marginBottom:6 }}>Repeat PIN</p><input className="inp" type="password" inputMode="numeric" maxLength={4} placeholder="••••" value={pin2} onChange={e => setPin2(e.target.value.replace(/\D/g, ""))} /></div>
              {err && <p style={{ color:"var(--danger)", fontSize:13 }}>{err}</p>}
              <button className="btn btn-gold" onClick={handleRegister} disabled={!name || pin.length < 4 || pin2.length < 4}>Sign Up & Start →</button>
            </div>
          </div>
        )}
        {mode === "login" && (
          <div>
            <h2 style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:26, marginBottom:4, color:"#fff" }}>Log In</h2>
            <p style={{ color:"var(--muted)", fontSize:13, marginBottom:20 }}>Select your name and enter your PIN.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
              {shared.participants.map(p => (
                <button key={p.id} style={{ background: selId === p.id ? "var(--gold-pale)" : "rgba(255,255,255,.03)", border:`1.5px solid ${selId === p.id ? "var(--gold)" : "var(--bd)"}`, borderRadius:12, padding:"14px 18px", cursor:"pointer", color:"var(--text)", display:"flex", alignItems:"center", gap:12, fontFamily:"Inter,sans-serif", fontSize:15, fontWeight:600 }} onClick={() => setSelId(p.id)}>
                  <span style={{ fontSize:20 }}>👤</span>
                  <span style={{ flex:1, textAlign:"left" }}>{p.name}</span>
                  {selId === p.id && <span style={{ color:"var(--gold)" }}>✓</span>}
                </button>
              ))}
            </div>
            {selId && <div><p className="lbl" style={{ marginBottom:6 }}>Your PIN</p><input className="inp" type="password" inputMode="numeric" maxLength={4} placeholder="••••" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ""))} style={{ marginBottom:14 }} /></div>}
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

  const myPreds = shared.predictions[me.id] || {};
  const filled = Object.values(myPreds).filter(p => p.homeGoals !== "" && p.awayGoals !== "").length;
  const groupMatches = shared.matches.filter(m => m.group === activeGroup);
  const stages = ["Round of 32","Round of 16","Quarter-final","Semi-final","Bronze Final","Final"];

  // Infer suggested knockout teams from group predictions
  const knockoutPreds = {};
  shared.knockoutMatches.forEach(m => { if (myPreds[m.id]) knockoutPreds[m.id] = myPreds[m.id]; });
  const suggested = inferKnockoutBracket(shared.matches, knockoutPreds, myPreds, {});

  function updatePred(matchId, hg, ag) {
    persist(s => ({ ...s, predictions: { ...s.predictions, [me.id]: { ...(s.predictions[me.id] || {}), [matchId]: { homeGoals: hg, awayGoals: ag } } } }));
  }

  return (
    <div>
      <div style={{ padding:"16px 16px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div>
            <p style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:20, color:"var(--gold)" }}>✏️ My Predictions</p>
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
            {isPredictionLocked() && (
              <div style={{ background:"rgba(224,85,85,0.1)", border:"1px solid rgba(224,85,85,0.25)", borderRadius:10, padding:"10px 14px", marginBottom:14 }}>
                <p style={{ fontSize:12, color:"#E05555", fontWeight:600 }}>🔒 Group stage predictions are locked — the tournament has started!</p>
              </div>
            )}
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
              {Object.keys(GROUPS_2026).map(g => (
                <button key={g} className={`gtab ${activeGroup === g ? "on" : "off"}`} onClick={() => setActiveGroup(g)}>{g}</button>
              ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {groupMatches.map(m => <MatchRow key={m.id} match={m} myPred={myPreds[m.id]} onUpdate={isPredictionLocked() ? null : updatePred} showResult />)}
            </div>
          </div>
        )}
        {activeStage === "knockout" && (
          <div>
            <div style={{ background:"var(--gold-pale)", border:"1px solid var(--gold-bd)", borderRadius:10, padding:"10px 14px", marginBottom:14 }}>
              <p style={{ fontSize:12, color:"var(--gold)", fontWeight:600 }}>💡 Predict using the dropdowns — only teams that can realistically reach each match are shown.</p>
            </div>
            {stages.map(stage => (
              <div key={stage} style={{ marginBottom:20 }}>
                <p className="lbl" style={{ marginBottom:10 }}>{stage}</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {shared.knockoutMatches.filter(m => m.stage === stage).map(m => {
                    const pred = myPreds[m.id] || {};
                    const pts = m.result ? calcPts(pred, m.result) : null;
                    const locked = !!m.result;
                    const eligible = getEligibleTeams(m.id);
                    const sug = suggested[m.id] || {};

                    // Use prediction if set, otherwise fall back to suggested
                    const homeVal = pred.homeTeam || sug.home || "";
                    const awayVal = pred.awayTeam || sug.away || "";
                    const homeIsAuto = !pred.homeTeam && !!sug.home;
                    const awayIsAuto = !pred.awayTeam && !!sug.away;

                    function setHometeam(val) {
                      persist(s => ({ ...s, predictions: { ...s.predictions, [me.id]: { ...(s.predictions[me.id]||{}), [m.id]: { ...pred, homeTeam: val } } } }));
                    }
                    function setAwayTeam(val) {
                      persist(s => ({ ...s, predictions: { ...s.predictions, [me.id]: { ...(s.predictions[me.id]||{}), [m.id]: { ...pred, awayTeam: val } } } }));
                    }

                    return (
                      <div key={m.id} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid var(--bd)", borderRadius:12, padding:"12px 14px" }}>
                        <p style={{ fontSize:10, color:"var(--gold)", fontWeight:600, marginBottom:10 }}>{m.label}</p>

                        {/* Home team */}
                        <div style={{ marginBottom:8 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                            <p style={{ fontSize:10, color:"var(--muted)" }}>Home team</p>
                            {homeIsAuto && <span style={{ fontSize:9, color:"var(--gold)", fontWeight:600 }}>✨ auto-suggested</span>}
                            {pred.homeTeam && <span style={{ fontSize:9, color:"var(--ok)", fontWeight:600 }}>✓ your pick</span>}
                          </div>
                          {locked && m.home && FLAGS[m.home] ? (
                            <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 12px", background:"rgba(255,255,255,0.04)", borderRadius:8 }}>
                              <span>{FLAGS[m.home]}</span><span style={{ fontWeight:600, fontSize:13 }}>{m.home}</span>
                            </div>
                          ) : (
                            <select className="inp" value={homeVal}
                              style={{ borderColor: pred.homeTeam ? "var(--ok)" : homeIsAuto ? "var(--gold-bd)" : "var(--bd)" }}
                              onChange={e => setHometeam(e.target.value)}>
                              <option value="">Select team...</option>
                              {eligible.map(t => <option key={t} value={t}>{FLAGS[t]} {t}</option>)}
                            </select>
                          )}
                        </div>

                        {/* Score */}
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                          <input type="number" min="0" max="20"
                            className={`sbox ${pred.homeGoals !== undefined ? "filled" : ""}`}
                            value={pred.homeGoals ?? ""} disabled={locked}
                            onChange={e => updatePred(m.id, e.target.value, pred.awayGoals ?? "")} />
                          <span style={{ color:"var(--muted)", fontWeight:700, fontSize:16 }}>–</span>
                          <input type="number" min="0" max="20"
                            className={`sbox ${pred.awayGoals !== undefined ? "filled" : ""}`}
                            value={pred.awayGoals ?? ""} disabled={locked}
                            onChange={e => updatePred(m.id, pred.homeGoals ?? "", e.target.value)} />
                          {pts !== null && <Pts pts={pts} />}
                          {m.result && <span style={{ fontSize:11, color:"var(--muted)" }}>{m.result.homeGoals}–{m.result.awayGoals}</span>}
                        </div>

                        {/* Away team */}
                        <div>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                            <p style={{ fontSize:10, color:"var(--muted)" }}>Away team</p>
                            {awayIsAuto && <span style={{ fontSize:9, color:"var(--gold)", fontWeight:600 }}>✨ auto-suggested</span>}
                            {pred.awayTeam && <span style={{ fontSize:9, color:"var(--ok)", fontWeight:600 }}>✓ your pick</span>}
                          </div>
                          {locked && m.away && FLAGS[m.away] ? (
                            <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 12px", background:"rgba(255,255,255,0.04)", borderRadius:8 }}>
                              <span>{FLAGS[m.away]}</span><span style={{ fontWeight:600, fontSize:13 }}>{m.away}</span>
                            </div>
                          ) : (
                            <select className="inp" value={awayVal}
                              style={{ borderColor: pred.awayTeam ? "var(--ok)" : awayIsAuto ? "var(--gold-bd)" : "var(--bd)" }}
                              onChange={e => setAwayTeam(e.target.value)}>
                              <option value="">Select team...</option>
                              {eligible.filter(t => t !== homeVal).map(t => <option key={t} value={t}>{FLAGS[t]} {t}</option>)}
                            </select>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="card-gold" style={{ padding:16, marginTop:4 }}>
              <p style={{ fontWeight:700, marginBottom:8, fontSize:14, color:"#fff" }}>🏆 Who will be World Champion?</p>
              <select className="inp" value={shared.champions[me.id] || ""} onChange={e => persist(s => ({ ...s, champions: { ...s.champions, [me.id]: e.target.value } }))}>
                <option value="">Select a country...</option>
                {ALL_TEAMS.map(t => <option key={t} value={t}>{FLAGS[t]} {t}</option>)}
              </select>
              {shared.champions[me.id] && <p style={{ marginTop:8, fontSize:12, color:"var(--muted)" }}>Your pick: {FLAGS[shared.champions[me.id]]} <strong style={{ color:"var(--text)" }}>{shared.champions[me.id]}</strong></p>}
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
        <p style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:26, marginBottom:20, color:"var(--gold)" }}>🏆 Leaderboard</p>
        {leaderboard.length === 0
          ? <div style={{ textAlign:"center", padding:48, color:"var(--muted)" }}><p style={{ fontSize:40, marginBottom:10 }}>👥</p><p>No participants yet</p></div>
          : <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {leaderboard.map((p, i) => (
                <div key={p.id} className={`card ${i===0?"lb1":i===1?"lb2":i===2?"lb3":""}`} style={{ padding:"16px 18px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:22, minWidth:30, textAlign:"center" }}>
                      {i < 3 ? ["🥇","🥈","🥉"][i] : <span style={{ fontFamily:"'Bebas Neue', sans-serif", color:"var(--muted)", fontSize:18 }}>#{i+1}</span>}
                    </span>
                    <div style={{ flex:1 }}>
                      <p style={{ fontWeight:700, fontSize:15, marginBottom:2 }}>{p.name}</p>
                      <p style={{ fontSize:11, color:"var(--muted)" }}>⭐ {p.exact} exact · ✅ {p.correct} correct</p>
                      {shared.champions[p.id] && <p style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>🏆 Pick: {FLAGS[shared.champions[p.id]]} {shared.champions[p.id]}</p>}
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <span style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:32, color: i===0 ? "var(--gold)" : "var(--text)", lineHeight:1 }}>{p.pts}</span>
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

// ─── SCHEDULE ─────────────────────────────────────────────────────────────────

function MatchCard({ m }) {
  const hasResult = !!m.result;
  return (
    <div className="card" style={{ padding:"12px 14px", borderLeft: hasResult ? "3px solid var(--gold)" : "3px solid transparent" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ fontSize:10, color:"var(--gold)", fontWeight:600 }}>
          {m.group ? `Group ${m.group}` : m.stage} · {m.date}
        </span>
        <span style={{ fontSize:10, color:"var(--muted)" }}>🕐 {m.time} Dubai</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, flex:1, justifyContent:"flex-end" }}>
          <span style={{ fontSize:13, fontWeight:700 }}>{m.home}</span>
          <span style={{ fontSize:18 }}>{FLAGS[m.home] || "🏳️"}</span>
        </div>
        <div style={{ padding:"5px 14px", background: hasResult ? "var(--gold-pale)" : "rgba(255,255,255,0.06)",
          border: hasResult ? "1px solid var(--gold-bd)" : "none",
          borderRadius:8, margin:"0 10px", minWidth:58, textAlign:"center" }}>
          {hasResult
            ? <span style={{ fontWeight:800, color:"var(--gold)", fontSize:18, letterSpacing:1 }}>{m.result.homeGoals}–{m.result.awayGoals}</span>
            : <span style={{ color:"var(--muted)", fontSize:12, fontWeight:600 }}>vs</span>
          }
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, flex:1 }}>
          <span style={{ fontSize:18 }}>{FLAGS[m.away] || "🏳️"}</span>
          <span style={{ fontSize:13, fontWeight:700 }}>{m.away}</span>
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <p style={{ fontSize:10, color:"var(--muted)" }}>📍 {m.venue || m.label || ""}</p>
        {hasResult && <span style={{ fontSize:10, color:"var(--gold)", fontWeight:700, background:"var(--gold-pale)", padding:"2px 8px", borderRadius:999 }}>Final score</span>}
      </div>
    </div>
  );
}

function ScheduleView({ shared }) {
  const [searchMode, setSearchMode] = useState("all"); // all | country | date
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [activeStage, setActiveStage] = useState("group");

  // All unique dates from group matches — in match order (not alphabetical)
  const allDates = useMemo(() => {
    const seen = new Set();
    const dates = [];
    shared.matches.forEach(m => { if (!seen.has(m.date)) { seen.add(m.date); dates.push(m.date); } });
    return dates; // already in chronological order from data.js
  }, [shared.matches]);

  // Filter logic
  const filteredGroupMatches = useMemo(() => {
    let matches = shared.matches;
    if (searchMode === "country" && selectedCountry) {
      matches = matches.filter(m => m.home === selectedCountry || m.away === selectedCountry);
    } else if (searchMode === "date" && selectedDate) {
      matches = matches.filter(m => m.date === selectedDate);
    }
    return matches;
  }, [shared.matches, searchMode, selectedCountry, selectedDate]);

  // Group filtered matches by date — preserve insertion order
  const matchesByDate = useMemo(() => {
    const map = {};
    filteredGroupMatches.forEach(m => {
      if (!map[m.date]) map[m.date] = [];
      map[m.date].push(m);
    });
    return map;
  }, [filteredGroupMatches]);

  // Keep dates in chronological order (order of first appearance in matches)
  const sortedDates = useMemo(() => {
    const seen = new Set();
    const dates = [];
    filteredGroupMatches.forEach(m => { if (!seen.has(m.date)) { seen.add(m.date); dates.push(m.date); } });
    return dates;
  }, [filteredGroupMatches]);

  const stages = ["Round of 32","Round of 16","Quarter-final","Semi-final","Bronze Final","Final"];

  // Country's group matches count
  const countryMatchCount = selectedCountry
    ? shared.matches.filter(m => m.home === selectedCountry || m.away === selectedCountry).length
    : 0;

  return (
    <div>
      <div style={{ padding:"16px 16px 0" }}>
        <p style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:24, marginBottom:4, color:"var(--gold)" }}>📅 Full Schedule</p>
        <p style={{ color:"var(--muted)", fontSize:12, marginBottom:14 }}>All times in Dubai time (GST, UTC+4)</p>

        {/* Stage toggle */}
        <div style={{ display:"flex", gap:8, marginBottom:14 }}>
          {[["group","Group Stage"],["knockout","Knockout"]].map(([s, l]) => (
            <button key={s} className={`tab ${activeStage===s?"on":"off"}`} onClick={() => setActiveStage(s)}>{l}</button>
          ))}
        </div>

        {/* Search mode — only for group stage */}
        {activeStage === "group" && (
          <div style={{ marginBottom:14 }}>
            <div style={{ display:"flex", gap:6, marginBottom:12 }}>
              {[["all","🌍 All"],["country","🏳️ Country"],["date","📅 Date"]].map(([m, l]) => (
                <button key={m} className={`tab ${searchMode===m?"on":"off"}`}
                  style={{ fontSize:12, padding:"7px 14px" }}
                  onClick={() => { setSearchMode(m); setSelectedCountry(""); setSelectedDate(""); }}>
                  {l}
                </button>
              ))}
            </div>

            {/* Country picker */}
            {searchMode === "country" && (
              <div>
                <select className="inp" value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}>
                  <option value="">Select a country...</option>
                  {ALL_TEAMS.map(t => (
                    <option key={t} value={t}>{FLAGS[t]} {t}</option>
                  ))}
                </select>
                {selectedCountry && (
                  <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"var(--gold-pale)", border:"1px solid var(--gold-bd)", borderRadius:10 }}>
                    <span style={{ fontSize:24 }}>{FLAGS[selectedCountry]}</span>
                    <div>
                      <p style={{ fontWeight:700, fontSize:14 }}>{selectedCountry}</p>
                      <p style={{ fontSize:11, color:"var(--muted)" }}>{countryMatchCount} group stage matches</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Date picker */}
            {searchMode === "date" && (
              <div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {allDates.map(d => (
                    <button key={d}
                      onClick={() => setSelectedDate(d === selectedDate ? "" : d)}
                      style={{ padding:"7px 12px", borderRadius:8, border:`1.5px solid ${selectedDate===d?"var(--gold)":"var(--border)"}`,
                        background: selectedDate===d ? "var(--gold-pale)" : "rgba(255,255,255,0.04)",
                        color: selectedDate===d ? "var(--gold)" : "var(--muted)",
                        cursor:"pointer", fontSize:11, fontWeight:600, fontFamily:"Inter,sans-serif",
                        whiteSpace:"nowrap" }}>
                      {d.replace("Thu ","").replace("Fri ","").replace("Sat ","").replace("Sun ","").replace("Mon ","").replace("Tue ","").replace("Wed ","")}
                      {shared.matches.filter(m => m.date === d && m.result).length > 0 &&
                        <span style={{ marginLeft:4, color:"var(--gold)" }}>✓</span>}
                    </button>
                  ))}
                </div>
                {selectedDate && (
                  <p style={{ fontSize:11, color:"var(--muted)", marginTop:8 }}>
                    {matchesByDate[selectedDate]?.length || 0} matches on {selectedDate}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* GROUP STAGE RESULTS */}
      {activeStage === "group" && (
        <div style={{ padding:"0 16px" }}>
          {sortedDates.length === 0 && (
            <div style={{ textAlign:"center", padding:40, color:"var(--muted)" }}>
              <p style={{ fontSize:32, marginBottom:8 }}>🔍</p>
              <p>No matches found</p>
            </div>
          )}
          {sortedDates.map(date => (
            <div key={date} style={{ marginBottom:20 }}>
              {/* Date header */}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ height:1, flex:1, background:"var(--border)" }}/>
                <span style={{ fontSize:11, fontWeight:700, color:"var(--gold)", whiteSpace:"nowrap", letterSpacing:"0.5px" }}>
                  📅 {date}
                </span>
                <div style={{ height:1, flex:1, background:"var(--border)" }}/>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {matchesByDate[date].map(m => <MatchCard key={m.id} m={m} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KNOCKOUT */}
      {activeStage === "knockout" && (
        <div style={{ padding:"0 16px" }}>
          {stages.map(stage => {
            const matches = shared.knockoutMatches.filter(m => m.stage === stage);
            if (!matches.length) return null;
            return (
              <div key={stage} style={{ marginBottom:20 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <div style={{ height:1, flex:1, background:"var(--border)" }}/>
                  <span style={{ fontSize:11, fontWeight:700, color:"var(--gold)", whiteSpace:"nowrap", letterSpacing:"0.5px" }}>{stage.toUpperCase()}</span>
                  <div style={{ height:1, flex:1, background:"var(--border)" }}/>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {matches.map(m => {
                    const hasReal = FLAGS[m.home] && FLAGS[m.away];
                    const hasResult = !!m.result;
                    return (
                      <div key={m.id} className="card" style={{ padding:"12px 14px", borderLeft: hasResult ? "3px solid var(--gold)" : "3px solid transparent" }}>
                        <p style={{ fontSize:10, color:"var(--gold)", fontWeight:600, marginBottom:8 }}>{m.label}</p>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6, flex:1, justifyContent:"flex-end" }}>
                            <span style={{ fontSize:13, fontWeight:700, color: hasReal ? "var(--text)" : "var(--muted)" }}>{m.home}</span>
                            {hasReal && <span style={{ fontSize:18 }}>{FLAGS[m.home]}</span>}
                          </div>
                          <div style={{ padding:"5px 14px", background: hasResult ? "var(--gold-pale)" : "rgba(255,255,255,0.06)", borderRadius:8, margin:"0 10px", minWidth:58, textAlign:"center" }}>
                            {hasResult
                              ? <span style={{ fontWeight:800, color:"var(--gold)", fontSize:18 }}>{m.result.homeGoals}–{m.result.awayGoals}</span>
                              : <span style={{ color:"var(--muted)", fontSize:12 }}>vs</span>
                            }
                          </div>
                          <div style={{ display:"flex", alignItems:"center", gap:6, flex:1 }}>
                            {hasReal && <span style={{ fontSize:18 }}>{FLAGS[m.away]}</span>}
                            <span style={{ fontSize:13, fontWeight:700, color: hasReal ? "var(--text)" : "var(--muted)" }}>{m.away}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <PageFooter />
    </div>
  );
}


// ─── RULES ────────────────────────────────────────────────────────────────────

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
          <h2 style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:24, color:"#fff", marginBottom:4 }}>Pool Rules</h2>
          <p style={{ color:"var(--gold)", fontSize:11, fontWeight:600, letterSpacing:"1px", textTransform:"uppercase" }}>SRI Dads · World Cup 2026</p>
        </div>
        <div className="card" style={{ padding:16, marginBottom:16 }}>
          <p className="lbl" style={{ marginBottom:12 }}>Points at a glance</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, textAlign:"center" }}>
            {[["⭐","Exact\nscore","3 pts","var(--ok)"],["✅","Correct\noutcome","1 pt","var(--amber)"],["❌","Wrong","0 pts","var(--muted)"]].map(([ic, lb, pts, col]) => (
              <div key={lb} style={{ background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"12px 8px", border:"1px solid var(--bd)" }}>
                <div style={{ fontSize:22, marginBottom:4 }}>{ic}</div>
                <div style={{ fontSize:11, color:"var(--muted)", marginBottom:6, whiteSpace:"pre-line", lineHeight:1.3 }}>{lb}</div>
                <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:20, color:col, fontWeight:700 }}>{pts}</div>
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

// ─── RESULTS (admin) ──────────────────────────────────────────────────────────

function ResultsView({ shared, persist, activeGroup, setActiveGroup, activeStage, setActiveStage, adminUnlocked, setAdminUnlocked, showToast }) {
  const stages = ["Round of 32","Round of 16","Quarter-final","Semi-final","Bronze Final","Final"];
  if (!adminUnlocked) return <div><PinGate onUnlock={() => setAdminUnlocked(true)} adminPin={shared.adminPin} /><PageFooter /></div>;

  function saveResult(matchId, hg, ag, isKo) {
    const key = isKo ? "knockoutMatches" : "matches";
    persist(s => ({ ...s, [key]: s[key].map(m => m.id === matchId ? { ...m, result:{ homeGoals:hg, awayGoals:ag } } : m) }));
    showToast("Result saved ✓");
  }

  const groupMatches = shared.matches.filter(m => m.group === activeGroup);
  return (
    <div>
      <div style={{ padding:"16px 16px" }}>
        <p style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:24, marginBottom:16, color:"var(--gold)" }}>📝 Enter Results</p>
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
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {groupMatches.map(m => <AdminMatchRow key={m.id} match={m} onSave={(h, a) => saveResult(m.id, h, a, false)} />)}
            </div>
          </div>
        )}
        {activeStage === "knockout" && stages.map(stage => (
          <div key={stage} style={{ marginBottom:20 }}>
            <p className="lbl" style={{ marginBottom:10 }}>{stage}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
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

// ─── ADMIN ────────────────────────────────────────────────────────────────────

function AdminView({ shared, persist, adminUnlocked, setAdminUnlocked, completedMatches, showToast }) {
  const [nameEdit, setNameEdit] = useState("");
  if (!adminUnlocked) return <div><PinGate onUnlock={() => setAdminUnlocked(true)} adminPin={shared.adminPin} /><PageFooter /></div>;
  const totalPreds = Object.values(shared.predictions).reduce((a, p) => a + Object.keys(p).length, 0);
  return (
    <div>
      <div style={{ padding:"16px 16px" }}>
        <p style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:24, marginBottom:20, color:"var(--gold)" }}>⚙️ Admin Panel</p>
        <div style={{ marginBottom:14 }}>
          <p className="lbl" style={{ marginBottom:8 }}>Pool name</p>
          <div className="card" style={{ padding:14 }}>
            <div style={{ display:"flex", gap:10 }}>
              <input className="inp" value={nameEdit || shared.poolName} onChange={e => setNameEdit(e.target.value)} placeholder={shared.poolName} />
              <button className="btn btn-gold btn-sm" style={{ flexShrink:0 }} onClick={() => { if (nameEdit.trim()) persist(s => ({ ...s, poolName: nameEdit.trim() })); setNameEdit(""); showToast("Name updated"); }}>Save</button>
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
                  <button className="btn-del" onClick={() => { persist(s => ({ ...s, participants: s.participants.filter(x => x.id !== p.id) })); showToast(`${p.name} removed`); }}>✕</button>
                </div>
              ))
            }
          </div>
        </div>
        <div style={{ marginBottom:14 }}>
          <p className="lbl" style={{ marginBottom:8 }}>Statistics</p>
          <div className="card" style={{ padding:14 }}>
            {[["Participants", shared.participants.length],["Group matches", shared.matches.length],["Results entered", completedMatches],["Total predictions", totalPreds]].map(([l, v]) => (
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

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

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

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!saving) { const data = await loadPool(); if (data && data.matches) setShared(data); }
    }, 30000);
    return () => clearInterval(interval);
  }, [saving]);

  // ── Auto-sync scores from WC2026 API ──────────────────────────────────────
  const [lastSync, setLastSync] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null); // null | 'syncing' | 'ok' | 'error'

  useEffect(() => {
    let timeoutId;

    async function syncScores() {
      setSyncStatus('syncing');
      try {
        const [completed, live] = await Promise.all([
          fetchCompletedMatches(),
          fetchLiveMatches(),
        ]);

        const allApiMatches = [...completed, ...live];

        if (allApiMatches.length > 0) {
          setShared(prev => {
            if (!prev) return prev;
            const { state, changed } = mergeApiResults(prev, allApiMatches);
            if (changed) {
              savePool(state);
              setLastSync(new Date());
            }
            return state;
          });
        }
        setSyncStatus('ok');
        setLastSync(new Date());
        const interval = getPollInterval(live);
        timeoutId = setTimeout(syncScores, interval);
      } catch (e) {
        setSyncStatus('error');
        timeoutId = setTimeout(syncScores, 5 * 60_000);
      }
    }

    // Start syncing after initial load
    timeoutId = setTimeout(syncScores, 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  const persist = useCallback(async (updater) => {
    setSaving(true);
    setShared(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      savePool(next).finally(() => setSaving(false));
      return next;
    });
  }, []);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2600); }
  function loginAs(p) { setMe(p); try { sessionStorage.setItem("sri_me", JSON.stringify(p)); } catch {} showToast(`Welcome, ${p.name}! ⚽`); setView("predict"); }
  function logout() { setMe(null); try { sessionStorage.removeItem("sri_me"); } catch {} setView("home"); }

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
    <div className="app"><style>{CSS}</style>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", gap:16 }}>
        <SriDadsLogo size={80} />
        <span className="spin" style={{ fontSize:28, marginTop:4 }}>⚽</span>
        <p style={{ color:"var(--muted)", fontSize:13 }}>Loading pool...</p>
      </div>
    </div>
  );

  const navItems = [
    { id:"home",        icon:"🏠", label:"Home" },
    { id:"predict",     icon:"✏️", label:"Predict" },
    { id:"leaderboard", icon:"🏆", label:"Standings" },
    { id:"schedule",    icon:"📅", label:"Schedule" },
    { id:"rules",       icon:"📋", label:"Rules" },
    { id:"results",     icon:"📝", label:"Scores",  hidden: !isAdminUrl },
    { id:"admin",       icon:"⚙️", label:"Admin",   hidden: !isAdminUrl },
    { id:"logout",      icon:"👋", label:"Log out",  hidden: !me },
  ].filter(n => !n.hidden);

  const sp = { shared, persist, me, setView, showToast };

  return (
    <div className="app">
      <style>{CSS}</style>
      <TopBar saving={saving} syncStatus={syncStatus} lastSync={lastSync} />
      {view === "home"        && <HomeView {...sp} leaderboard={leaderboard} completedMatches={completedMatches} totalMatches={totalMatches} />}
      {view === "join"        && <JoinView {...sp} loginAs={loginAs} />}
      {view === "predict"     && <PredictView {...sp} logout={logout} activeGroup={activeGroup} setActiveGroup={setActiveGroup} activeStage={activeStage} setActiveStage={setActiveStage} />}
      {view === "leaderboard" && <LeaderboardView leaderboard={leaderboard} shared={shared} />}
      {view === "schedule"    && <ScheduleView shared={shared} />}
      {view === "rules"       && <RulesView />}
      {view === "results"     && <ResultsView {...sp} activeGroup={activeGroup} setActiveGroup={setActiveGroup} activeStage={activeStage} setActiveStage={setActiveStage} adminUnlocked={adminUnlocked} setAdminUnlocked={setAdminUnlocked} />}
      {view === "admin"       && <AdminView {...sp} adminUnlocked={adminUnlocked} setAdminUnlocked={setAdminUnlocked} completedMatches={completedMatches} />}
      {toast && <div className="toast">{toast}</div>}
      <nav className="nav-bar">
        {navItems.map(n => (
          <button key={n.id} className={`nbtn ${view === n.id ? "on" : "off"}`} onClick={() => {
            if (n.id === "predict" && !me) setView("join");
            else if (n.id === "logout") logout();
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
