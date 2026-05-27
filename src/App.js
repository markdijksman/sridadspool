import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { loadPool, savePool } from './supabase';
import { GROUPS_2026, FLAGS, ALL_TEAMS, INITIAL_POOL, calcPts, ROUND_MULTIPLIER, CHAMPION_BONUS, RUNNER_UP_BONUS } from './data';
import { CSS } from './styles';
import {
  TopBar, PageFooter, MatchRow, AdminMatchRow, PinGate, Pbar, TeamBadge, Pts, LegalBox, SriDadsLogo
} from './components';
import { fetchCompletedMatches, fetchLiveMatches, mergeApiResults, getPollInterval, getRateLimitInfo } from './scoreSync';
import { getEligibleTeams, getCountdown, isPredictionLocked, FIRST_MATCH_UTC, inferKnockoutBracket } from './knockout';

// ─── CONFETTI ─────────────────────────────────────────────────────────────────

function Confetti({ active }) {
  if (!active) return null;
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    dur: 1.5 + Math.random() * 1,
    color: ["#E8B84B","#fff","#3DAA6E","#E05555","#C9A84C"][Math.floor(Math.random()*5)],
    size: 6 + Math.random() * 8,
  }));
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9999, overflow:"hidden" }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position:"absolute", left:`${p.x}%`, top:"-10px",
          width:p.size, height:p.size, background:p.color, borderRadius:p.size < 8 ? "50%" : 2,
          animation:`confettiFall ${p.dur}s ease-in ${p.delay}s forwards`,
          transform:`rotate(${Math.random()*360}deg)`,
        }}/>
      ))}
      <style>{`@keyframes confettiFall { to { transform: translateY(110vh) rotate(720deg); opacity:0; } }`}</style>
    </div>
  );
}

// ─── RESULT FLASH ─────────────────────────────────────────────────────────────

function useResultFlash(shared) {
  const [flash, setFlash] = useState(false);
  const prevResults = useRef(0);
  useEffect(() => {
    const count = [...shared.matches, ...shared.knockoutMatches].filter(m => m.result).length;
    if (prevResults.current > 0 && count > prevResults.current) {
      setFlash(true);
      setTimeout(() => setFlash(false), 1500);
    }
    prevResults.current = count;
  }, [shared]);
  return flash;
}

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
  const urgency = cd.diff < 24*60*60*1000;

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
  const myRank = me ? leaderboard.findIndex(p => p.id === me.id) : -1;
  const myPts = me ? leaderboard[myRank]?.pts : null;
  const leader = leaderboard[0];
  const ptsBehind = myRank > 0 && leader ? leader.pts - myPts : 0;

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
        <Countdown />

        {!me ? (
          <div className="card-gold" style={{ padding:20, textAlign:"center" }}>
            <p style={{ fontWeight:700, fontSize:16, marginBottom:4, color:"#fff" }}>Ready to play?</p>
            <p style={{ color:"var(--muted)", fontSize:13, marginBottom:16 }}>Sign up and make your predictions to compete with the other dads.</p>
            <button className="btn btn-gold" onClick={() => setView("join")}>Sign Up / Log In</button>
          </div>
        ) : (
          <div className="card" style={{ padding:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom: ptsBehind > 0 ? 10 : 0 }}>
              <div style={{ width:42, height:42, borderRadius:"50%", background:"var(--gold-pale)", border:"2px solid var(--gold-bd)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>👤</div>
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:700, fontSize:15 }}>Hey, {me.name}!</p>
                <p style={{ color:"var(--muted)", fontSize:12 }}>
                  {myRank >= 0 ? `You're #${myRank+1} with ${myPts} pts · ` : ""}
                  {Object.keys((shared.predictions[me.id] || {})).length} predictions saved ✓
                </p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setView("predict")}>Predict →</button>
            </div>
            {/* Motivation: X points behind leader */}
            {ptsBehind > 0 && (
              <div style={{ background:"rgba(232,184,75,0.07)", borderRadius:8, padding:"8px 12px", fontSize:12, color:"var(--muted)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span>🎯 You're <strong style={{ color:"var(--gold)" }}>{ptsBehind} pts</strong> behind {leader.name}</span>
                <button className="btn btn-ghost" style={{ padding:"4px 10px", fontSize:11 }} onClick={() => setView("leaderboard")}>See table</button>
              </div>
            )}
            {myRank === 0 && myPts > 0 && (
              <div style={{ background:"rgba(232,184,75,0.07)", borderRadius:8, padding:"8px 12px", fontSize:12, color:"var(--gold)", fontWeight:600 }}>
                👑 You're leading the pool! Keep it up.
              </div>
            )}
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
          {[["⭐ Exact score (group)","3 pts"],["✅ Correct outcome (group)","1 pt"],["📈 Knockout multipliers","×2 to ×8"],["🏆 Champion bonus","15 pts"]].map(([l, v]) => (
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
  const [nameSearch, setNameSearch] = useState("");

  function handleRegister() {
    setErr("");
    if (!name.trim()) return setErr("Please enter your name.");
    if (pin.length < 4) return setErr("Please choose a 4-digit PIN.");
    if (pin !== pin2) return setErr("PINs don't match.");
    if (shared.participants.find(p => p.name.toLowerCase() === name.trim().toLowerCase())) return setErr(`"${name.trim()}" is already taken — choose a different name or log in instead.`);
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
            <p style={{ color:"var(--muted)", fontSize:13, marginBottom:16 }}>Find your name and enter your PIN.</p>

            {/* Search/filter */}
            <div style={{ marginBottom:12 }}>
              <input className="inp" placeholder="🔍 Search your name..." value={nameSearch} onChange={e => { setNameSearch(e.target.value); setSelId(null); setPin(""); }}
                style={{ marginBottom:0 }} />
            </div>

            {/* Filtered list */}
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16, maxHeight:240, overflowY:"auto" }}>
              {shared.participants
                .filter(p => p.name.toLowerCase().includes(nameSearch.toLowerCase()))
                .sort((a,b) => a.name.localeCompare(b.name))
                .map(p => (
                <button key={p.id} style={{
                  background: selId === p.id ? "var(--gold-pale)" : "rgba(255,255,255,.03)",
                  border:`1.5px solid ${selId === p.id ? "var(--gold)" : "var(--bd)"}`,
                  borderRadius:12, padding:"12px 16px", cursor:"pointer", color:"var(--text)",
                  display:"flex", alignItems:"center", gap:12, fontFamily:"Inter,sans-serif",
                  fontSize:15, fontWeight:600, textAlign:"left", width:"100%"
                }} onClick={() => { setSelId(p.id); setPin(""); }}>
                  <span style={{ fontSize:18 }}>👤</span>
                  <span style={{ flex:1 }}>{p.name}</span>
                  {selId === p.id && <span style={{ color:"var(--gold)" }}>✓</span>}
                </button>
              ))}
              {shared.participants.filter(p => p.name.toLowerCase().includes(nameSearch.toLowerCase())).length === 0 && (
                <p style={{ color:"var(--muted)", fontSize:13, padding:"12px 0", textAlign:"center" }}>No names found — try signing up instead</p>
              )}
            </div>

            {/* PIN — only show after selecting */}
            {selId && (
              <div style={{ marginBottom:14 }}>
                <p className="lbl" style={{ marginBottom:6 }}>Your PIN</p>
                <input className="inp" type="password" inputMode="numeric" maxLength={4} placeholder="••••"
                  value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
                  autoFocus />
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
  const [confetti, setConfetti] = useState(false);
  const touchStartX = useRef(null);
  const groupKeys = Object.keys(GROUPS_2026);

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

  // Robust check: 0 is a valid score, empty string and undefined/null are not
  function isPredFilled(p) {
    if (!p) return false;
    const hg = p.homeGoals, ag = p.awayGoals;
    const hOk = hg !== undefined && hg !== null && String(hg) !== "";
    const aOk = ag !== undefined && ag !== null && String(ag) !== "";
    return hOk && aOk;
  }

  const filled = shared.matches.filter(m => isPredFilled(myPreds[m.id])).length;
  const totalGroupMatches = shared.matches.length;
  const groupMatches = shared.matches.filter(m => m.group === activeGroup);
  const stages = ["Round of 32","Round of 16","Quarter-final","Semi-final","Bronze Final","Final"];

  function groupProgress(g) {
    const matches = shared.matches.filter(m => m.group === g);
    const done = matches.filter(m => isPredFilled(myPreds[m.id])).length;
    return { done, total: matches.length };
  }

  // Check if user has filled any knockout predictions (to show warning on group change)
  const hasKnockoutPreds = shared.knockoutMatches.some(m => myPreds[m.id]?.homeTeam || myPreds[m.id]?.homeGoals !== undefined);

  const knockoutPreds = {};
  shared.knockoutMatches.forEach(m => { if (myPreds[m.id]) knockoutPreds[m.id] = myPreds[m.id]; });
  const suggested = inferKnockoutBracket(shared.matches, knockoutPreds, myPreds, {});

  // Check if all knockout + champion filled for completion card
  const allGroupFilled = filled === totalGroupMatches;
  const allKnockoutFilled = shared.knockoutMatches.every(m => myPreds[m.id]?.homeGoals !== undefined && myPreds[m.id]?.awayGoals !== undefined);
  const championPicked = !!shared.champions[me.id];
  const allDone = allGroupFilled && allKnockoutFilled && championPicked;

  function updatePred(matchId, hg, ag) {
    const isGroupMatch = shared.matches.find(m => m.id === matchId);
    if (isGroupMatch && hasKnockoutPreds) {
      showToast("⚠️ Group changed — check your Knockout predictions!");
    }
    persist(s => {
      const existingPred = (s.predictions[me.id] || {})[matchId] || {};
      // IMPORTANT: merge with existing pred to preserve homeTeam/awayTeam
      const newPred = { ...existingPred, homeGoals: hg, awayGoals: ag };
      const newState = { ...s, predictions: { ...s.predictions, [me.id]: { ...(s.predictions[me.id] || {}), [matchId]: newPred } } };
      const match = [...s.matches, ...s.knockoutMatches].find(m => m.id === matchId);
      if (match?.result) {
        const pts = calcPts({ homeGoals: hg, awayGoals: ag }, match.result, match.stage || "group");
        if (pts >= 3) { setConfetti(true); setTimeout(() => setConfetti(false), 2500); }
      }
      return newState;
    });
  }

  function handleTouchStart(e) { touchStartX.current = e.touches[0].clientX; }
  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return;
    const idx = groupKeys.indexOf(activeGroup);
    if (diff > 0 && idx < groupKeys.length - 1) setActiveGroup(groupKeys[idx + 1]);
    if (diff < 0 && idx > 0) setActiveGroup(groupKeys[idx - 1]);
    touchStartX.current = null;
  }

  return (
    <div>
      <Confetti active={confetti} />
      {/* Compact sticky header */}
      <div style={{ padding:"10px 16px 0", background:"var(--navy)", position:"sticky", top:56, zIndex:100, borderBottom:"1px solid var(--bd)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <p style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:18, color:"var(--gold)", lineHeight:1 }}>✏️ {me.name}</p>
            <p style={{ color:"var(--muted)", fontSize:11 }}>{filled}/{totalGroupMatches} · {shared.knockoutMatches.filter(m => isPredFilled(myPreds[m.id])).length}/{shared.knockoutMatches.length} KO</p>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ padding:"5px 12px", fontSize:11 }} onClick={logout}>Log out</button>
        </div>
        <div style={{ marginBottom:8 }}><Pbar value={filled} max={totalGroupMatches} /></div>
        <div style={{ display:"flex", gap:8, marginBottom:10 }}>
          {[["group","Group Stage"],["knockout","Knockout"]].map(([s, l]) => (
            <button key={s} className={`tab ${activeStage === s ? "on" : "off"}`} style={{ fontSize:12, padding:"7px 14px" }} onClick={() => setActiveStage(s)}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ padding:"10px 16px 0" }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {activeStage === "group" && (
          <div>
            {isPredictionLocked() && (
              <div style={{ background:"rgba(224,85,85,0.1)", border:"1px solid rgba(224,85,85,0.25)", borderRadius:10, padding:"10px 14px", marginBottom:10 }}>
                <p style={{ fontSize:12, color:"#E05555", fontWeight:600 }}>🔒 Group stage predictions are locked — the tournament has started!</p>
              </div>
            )}
            {/* Single scrollable row of group tabs */}
            <div style={{ position:"relative", marginBottom:8 }}>
              <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:4, paddingRight:32, scrollbarWidth:"none", msOverflowStyle:"none" }}
                className="hide-scrollbar">
                {groupKeys.map(g => {
                  const { done, total } = groupProgress(g);
                  const complete = done === total;
                  return (
                    <button key={g} className={`gtab ${activeGroup === g ? "on" : "off"}`}
                      onClick={() => setActiveGroup(g)}
                      style={{ position:"relative", flexShrink:0 }}>
                      {g}
                      {complete && activeGroup !== g && <span style={{ position:"absolute", top:-4, right:-4, width:8, height:8, background:"var(--ok)", borderRadius:"50%", border:"2px solid var(--navy)" }}/>}
                      {!complete && done > 0 && activeGroup !== g && <span style={{ position:"absolute", top:-4, right:-4, width:8, height:8, background:"var(--amber)", borderRadius:"50%", border:"2px solid var(--navy)" }}/>}
                    </button>
                  );
                })}
              </div>
              {/* Fade hint on right to show scrollability */}
              <div style={{ position:"absolute", right:0, top:0, bottom:4, width:32, background:"linear-gradient(to right, transparent, var(--navy))", pointerEvents:"none" }}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              {(() => { const {done, total} = groupProgress(activeGroup); return (
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:12, color: done===total ? "var(--ok)" : "var(--muted)" }}>
                    {done===total ? "✅" : `${done}/${total}`} Group {activeGroup}
                  </span>
                  <div style={{ width:60, height:4, background:"rgba(255,255,255,0.08)", borderRadius:2, overflow:"hidden" }}>
                    <div style={{ width:`${(done/total)*100}%`, height:"100%", background: done===total ? "var(--ok)" : "var(--gold)", borderRadius:2, transition:"width .3s" }}/>
                  </div>
                </div>
              );})()}
              <span style={{ fontSize:10, color:"var(--muted)" }}>← swipe →</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {groupMatches.map(m => <MatchRow key={m.id} match={m} myPred={myPreds[m.id]} onUpdate={isPredictionLocked() ? null : updatePred} showResult />)}
            </div>

            {/* Next / Prev group navigation */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:16, marginBottom:8 }}>
              <button
                className="btn btn-ghost btn-sm"
                disabled={groupKeys.indexOf(activeGroup) === 0}
                onClick={() => setActiveGroup(groupKeys[groupKeys.indexOf(activeGroup) - 1])}
                style={{ opacity: groupKeys.indexOf(activeGroup) === 0 ? 0.3 : 1 }}>
                ← Group {groupKeys[groupKeys.indexOf(activeGroup) - 1] || ""}
              </button>
              <span style={{ fontSize:10, color:"var(--muted)" }}>
                {groupKeys.indexOf(activeGroup) + 1} / {groupKeys.length}
              </span>
              <button
                className="btn btn-ghost btn-sm"
                disabled={groupKeys.indexOf(activeGroup) === groupKeys.length - 1}
                onClick={() => setActiveGroup(groupKeys[groupKeys.indexOf(activeGroup) + 1])}
                style={{ opacity: groupKeys.indexOf(activeGroup) === groupKeys.length - 1 ? 0.3 : 1 }}>
                {groupKeys.indexOf(activeGroup) === groupKeys.length - 2 ? "Group L →" : `Group ${groupKeys[groupKeys.indexOf(activeGroup) + 1] || ""} →`}
              </button>
            </div>
            {/* Last group — show Continue to Knockout */}
            {activeGroup === groupKeys[groupKeys.length - 1] && (
              <button className="btn btn-gold" style={{ width:"100%", marginTop:12, fontSize:15 }}
                onClick={() => setActiveStage("knockout")}>
                Continue to Knockout Predictions →
              </button>
            )}
          </div>
        )}
        {activeStage === "knockout" && (
          <div>
            <div style={{ background:"var(--gold-pale)", border:"1px solid var(--gold-bd)", borderRadius:10, padding:"10px 14px", marginBottom:14 }}>
              <p style={{ fontSize:12, color:"var(--gold)", fontWeight:600 }}>💡 Only realistic teams shown. ✨ = auto-suggested from your group predictions.</p>
            </div>
            {stages.map(stage => (
              <div key={stage} style={{ marginBottom:20 }}>
                <p className="lbl" style={{ marginBottom:10 }}>{stage}</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {shared.knockoutMatches.filter(m => m.stage === stage).map(m => {
                    const pred = myPreds[m.id] || {};
                    const pts = m.result ? calcPts(pred, m.result, stage) : null;
                    const locked = !!m.result;
                    const eligible = getEligibleTeams(m.id);
                    const sug = suggested[m.id] || {};
                    // IMPORTANT: only use pred.homeTeam as select value — never auto-fill with suggestion
                    // suggestion is shown as a hint only, never written to state automatically
                    const homeVal = pred.homeTeam || "";
                    const awayVal = pred.awayTeam || "";
                    const homeIsAuto = !pred.homeTeam && !!sug.home;
                    const awayIsAuto = !pred.awayTeam && !!sug.away;
                    function setHomeTeam(val) { persist(s => { const cur = (s.predictions[me.id]||{})[m.id]||{}; return { ...s, predictions: { ...s.predictions, [me.id]: { ...(s.predictions[me.id]||{}), [m.id]: { ...cur, homeTeam: val } } } }; }); }
                    function setAwayTeam(val) { persist(s => { const cur = (s.predictions[me.id]||{})[m.id]||{}; return { ...s, predictions: { ...s.predictions, [me.id]: { ...(s.predictions[me.id]||{}), [m.id]: { ...cur, awayTeam: val } } } }; }); }
                    return (
                      <div key={m.id} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid var(--bd)", borderRadius:12, padding:"12px 14px" }}>
                        <p style={{ fontSize:10, color:"var(--gold)", fontWeight:600, marginBottom:10 }}>{m.label}</p>
                        <div style={{ marginBottom:8 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                            <p style={{ fontSize:10, color:"var(--muted)" }}>Home team</p>
                            {homeIsAuto && <span style={{ fontSize:9, color:"var(--gold)" }}>✨ auto-suggested</span>}
                            {pred.homeTeam && <span style={{ fontSize:9, color:"var(--ok)" }}>✓ your pick</span>}
                          </div>
                          {locked && m.home && FLAGS[m.home] ? (
                            <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 12px", background:"rgba(255,255,255,0.04)", borderRadius:8 }}>
                              <span>{FLAGS[m.home]}</span><span style={{ fontWeight:600, fontSize:13 }}>{m.home}</span>
                            </div>
                          ) : (
                            <select className="inp" value={homeVal} style={{ borderColor: pred.homeTeam ? "var(--ok)" : homeIsAuto ? "var(--gold-bd)" : "var(--bd)" }} onChange={e => setHomeTeam(e.target.value)}>
                              <option value="">{homeIsAuto ? `✨ Suggested: ${sug.home}` : "Select team..."}</option>
                              {eligible.map(t => <option key={t} value={t}>{FLAGS[t]} {t}</option>)}
                            </select>
                          )}
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                          <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={2}
                            className={`sbox ${pred.homeGoals !== undefined && pred.homeGoals !== "" ? "filled" : ""}`}
                            value={pred.homeGoals ?? ""} disabled={locked}
                            onChange={e => { const v = e.target.value.replace(/[^0-9]/g,""); updatePred(m.id, v, pred.awayGoals ?? ""); }} />
                          <span style={{ color:"var(--muted)", fontWeight:700, fontSize:16 }}>–</span>
                          <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={2}
                            className={`sbox ${pred.awayGoals !== undefined && pred.awayGoals !== "" ? "filled" : ""}`}
                            value={pred.awayGoals ?? ""} disabled={locked}
                            onChange={e => { const v = e.target.value.replace(/[^0-9]/g,""); updatePred(m.id, pred.homeGoals ?? "", v); }} />
                          {pts !== null && <Pts pts={pts} />}
                          {m.result && <span style={{ fontSize:11, color:"var(--muted)" }}>{m.result.homeGoals}–{m.result.awayGoals}</span>}
                        </div>
                        <div>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                            <p style={{ fontSize:10, color:"var(--muted)" }}>Away team</p>
                            {awayIsAuto && <span style={{ fontSize:9, color:"var(--gold)" }}>✨ auto-suggested</span>}
                            {pred.awayTeam && <span style={{ fontSize:9, color:"var(--ok)" }}>✓ your pick</span>}
                          </div>
                          {locked && m.away && FLAGS[m.away] ? (
                            <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 12px", background:"rgba(255,255,255,0.04)", borderRadius:8 }}>
                              <span>{FLAGS[m.away]}</span><span style={{ fontWeight:600, fontSize:13 }}>{m.away}</span>
                            </div>
                          ) : (
                            <select className="inp" value={awayVal} style={{ borderColor: pred.awayTeam ? "var(--ok)" : awayIsAuto ? "var(--gold-bd)" : "var(--bd)" }} onChange={e => setAwayTeam(e.target.value)}>
                              <option value="">{awayIsAuto ? `✨ Suggested: ${sug.away}` : "Select team..."}</option>
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

            {/* Completion card */}
            {allDone && (
              <div style={{ marginTop:16, background:"linear-gradient(135deg,rgba(61,170,110,0.15),rgba(61,170,110,0.05))", border:"2px solid var(--ok)", borderRadius:16, padding:"20px 18px", textAlign:"center" }}>
                <div style={{ fontSize:48, marginBottom:8 }}>🎉</div>
                <p style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:24, color:"var(--ok)", marginBottom:8 }}>You're all done!</p>
                <p style={{ fontSize:13, color:"var(--muted)", marginBottom:16 }}>All predictions submitted. Good luck!</p>
                <div style={{ display:"flex", flexDirection:"column", gap:6, textAlign:"left" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontSize:13, color:"var(--muted)" }}>Group stage</span>
                    <span style={{ fontSize:13, fontWeight:700, color:"var(--ok)" }}>{filled}/{totalGroupMatches} ✅</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontSize:13, color:"var(--muted)" }}>Knockout rounds</span>
                    <span style={{ fontSize:13, fontWeight:700, color:"var(--ok)" }}>{shared.knockoutMatches.length}/{shared.knockoutMatches.length} ✅</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", padding:"6px 0" }}>
                    <span style={{ fontSize:13, color:"var(--muted)" }}>🏆 World Champion</span>
                    <span style={{ fontSize:13, fontWeight:700, color:"var(--gold)" }}>{FLAGS[shared.champions[me.id]]} {shared.champions[me.id]}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <PageFooter />
    </div>
  );
}

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────

// ─── PLAYER PREDICTIONS POPUP ────────────────────────────────────────────────

function PlayerPredictionsPopup({ player, shared, onClose }) {
  const [activeGroup, setActiveGroup] = useState("A");
  const [activeTab, setActiveTab] = useState("group");
  const preds = shared.predictions[player.id] || {};
  const groupKeys = Object.keys(GROUPS_2026);
  const stages = ["Round of 32","Round of 16","Quarter-final","Semi-final","Bronze Final","Final"];

  function isPredFilled(p) {
    if (!p) return false;
    return p.homeGoals !== undefined && p.homeGoals !== "" && p.homeGoals !== null &&
           p.awayGoals !== undefined && p.awayGoals !== "" && p.awayGoals !== null;
  }

  const filledGroup = shared.matches.filter(m => isPredFilled(preds[m.id])).length;
  const filledKO = shared.knockoutMatches.filter(m => isPredFilled(preds[m.id])).length;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:3000, display:"flex", alignItems:"flex-end" }}
      onClick={onClose}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.7)" }}/>
      <div style={{ position:"relative", background:"#012148", border:"1px solid var(--gold-bd)", borderRadius:"20px 20px 0 0", width:"100%", maxHeight:"88vh", display:"flex", flexDirection:"column" }}
        onClick={e => e.stopPropagation()}>

        {/* Handle */}
        <div style={{ padding:"12px 20px 0", flexShrink:0 }}>
          <div style={{ width:36, height:4, background:"rgba(255,255,255,0.2)", borderRadius:2, margin:"0 auto 12px" }}/>

          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:"var(--gold-pale)", border:"2px solid var(--gold-bd)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>👤</div>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:20, color:"var(--gold)", lineHeight:1 }}>{player.name}</p>
              <p style={{ fontSize:11, color:"var(--muted)" }}>
                {filledGroup}/72 group · {filledKO}/31 knockout
                {shared.champions[player.id] && <span> · 🏆 {FLAGS[shared.champions[player.id]]} {shared.champions[player.id]}</span>}
              </p>
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:"50%", width:30, height:30, color:"var(--muted)", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:8, marginBottom:12 }}>
            {[["group","Group Stage"],["knockout","Knockout"]].map(([t,l]) => (
              <button key={t} className={`tab ${activeTab===t?"on":"off"}`} style={{ fontSize:12, padding:"7px 14px" }} onClick={() => setActiveTab(t)}>{l}</button>
            ))}
          </div>

          {/* Group tabs */}
          {activeTab === "group" && (
            <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:4, paddingRight:32, scrollbarWidth:"none" }} className="hide-scrollbar">
              {groupKeys.map(g => {
                const matches = shared.matches.filter(m => m.group === g);
                const done = matches.filter(m => isPredFilled(preds[m.id])).length;
                return (
                  <button key={g} className={`gtab ${activeGroup===g?"on":"off"}`}
                    onClick={() => setActiveGroup(g)}
                    style={{ position:"relative", flexShrink:0, fontSize:13, padding:"6px 11px" }}>
                    {g}
                    {done === matches.length && <span style={{ position:"absolute", top:-4, right:-4, width:7, height:7, background:"var(--ok)", borderRadius:"50%", border:"2px solid var(--navy)" }}/>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY:"auto", padding:"10px 16px 36px", flex:1 }}>
          {activeTab === "group" && (
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {shared.matches.filter(m => m.group === activeGroup).map(m => {
                const pred = preds[m.id];
                const filled = isPredFilled(pred);
                const pts = m.result && filled ? calcPts(pred, m.result, "group") : null;
                return (
                  <div key={m.id} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid var(--bd)", borderRadius:10, padding:"10px 12px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                      <span style={{ fontSize:10, color:"var(--muted)" }}>{m.date} · {m.time}</span>
                      {pts !== null && <Pts pts={pts} />}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:5, flex:1, justifyContent:"flex-end" }}>
                        <span style={{ fontSize:12, fontWeight:600 }}>{m.home}</span>
                        <span>{FLAGS[m.home]}</span>
                      </div>
                      <div style={{ margin:"0 10px", textAlign:"center", minWidth:60 }}>
                        {filled
                          ? <span style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:20, color: pts === 3 ? "var(--ok)" : pts === 1 ? "var(--amber)" : pts === 0 && m.result ? "var(--danger)" : "var(--gold)" }}>
                              {pred.homeGoals} – {pred.awayGoals}
                            </span>
                          : <span style={{ color:"var(--muted)", fontSize:12 }}>– –</span>
                        }
                        {m.result && <p style={{ fontSize:9, color:"var(--muted)" }}>Result: {m.result.homeGoals}–{m.result.awayGoals}</p>}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:5, flex:1 }}>
                        <span>{FLAGS[m.away]}</span>
                        <span style={{ fontSize:12, fontWeight:600 }}>{m.away}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "knockout" && (
            <div>
              {stages.map(stage => {
                const matches = shared.knockoutMatches.filter(m => m.stage === stage);
                if (!matches.length) return null;
                return (
                  <div key={stage} style={{ marginBottom:16 }}>
                    <p className="lbl" style={{ marginBottom:8 }}>{stage}</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {matches.map(m => {
                        const pred = preds[m.id];
                        const filled = isPredFilled(pred);
                        const pts = m.result && filled ? calcPts(pred, m.result, stage) : null;
                        const homeTeam = pred?.homeTeam || m.home;
                        const awayTeam = pred?.awayTeam || m.away;
                        return (
                          <div key={m.id} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid var(--bd)", borderRadius:10, padding:"10px 12px" }}>
                            <p style={{ fontSize:10, color:"var(--gold)", marginBottom:6 }}>{m.label}</p>
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:5, flex:1, justifyContent:"flex-end" }}>
                                <span style={{ fontSize:12, fontWeight:600, color: FLAGS[homeTeam] ? "var(--text)" : "var(--muted)" }}>{homeTeam}</span>
                                {FLAGS[homeTeam] && <span>{FLAGS[homeTeam]}</span>}
                              </div>
                              <div style={{ margin:"0 10px", textAlign:"center", minWidth:60 }}>
                                {filled
                                  ? <span style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:20, color: pts === null ? "var(--gold)" : pts > 0 ? "var(--ok)" : "var(--danger)" }}>
                                      {pred.homeGoals} – {pred.awayGoals}
                                    </span>
                                  : <span style={{ color:"var(--muted)", fontSize:12 }}>– –</span>
                                }
                                {m.result && <p style={{ fontSize:9, color:"var(--muted)" }}>Result: {m.result.homeGoals}–{m.result.awayGoals}</p>}
                              </div>
                              <div style={{ display:"flex", alignItems:"center", gap:5, flex:1 }}>
                                {FLAGS[awayTeam] && <span>{FLAGS[awayTeam]}</span>}
                                <span style={{ fontSize:12, fontWeight:600, color: FLAGS[awayTeam] ? "var(--text)" : "var(--muted)" }}>{awayTeam}</span>
                              </div>
                            </div>
                            {pts !== null && <div style={{ textAlign:"right", marginTop:4 }}><Pts pts={pts} /></div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────

function LeaderboardView({ leaderboard, shared, me, onRefresh, lastSync }) {
  const [refreshing, setRefreshing] = useState(false);
  const [viewingPlayer, setViewingPlayer] = useState(null);
  const maxPts = leaderboard[0]?.pts || 1;
  const myRank = me ? leaderboard.findIndex(p => p.id === me.id) : -1;
  const locked = isPredictionLocked();

  async function handleRefresh() {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 800);
  }

  function shareStandings() {
    const top3 = leaderboard.slice(0, 3).map((p, i) => `${["🥇","🥈","🥉"][i]} ${p.name} — ${p.pts} pts`).join("\n");
    const myLine = myRank >= 0 ? `\n\nI'm #${myRank+1} with ${leaderboard[myRank].pts} pts 💪` : "";
    const text = `🏆 SRI Dads World Cup Pool 2026\n\nCurrent standings:\n${top3}${myLine}\n\nJoin us at www.sridads.com ⚽`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div>
      {viewingPlayer && (
        <PlayerPredictionsPopup
          player={viewingPlayer}
          shared={shared}
          onClose={() => setViewingPlayer(null)}
        />
      )}
      <div style={{ padding:"16px 16px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <p style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:26, color:"var(--gold)" }}>🏆 Leaderboard</p>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button onClick={shareStandings} style={{ background:"#25D366", border:"none", borderRadius:8, padding:"7px 12px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Inter,sans-serif", display:"flex", alignItems:"center", gap:5 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Share
            </button>
            <button onClick={handleRefresh} className="btn btn-ghost btn-sm" style={{ fontSize:12 }}>
              {refreshing ? <span className="spin">⚽</span> : "↻ Refresh"}
            </button>
          </div>
        </div>
        {lastSync && <p style={{ fontSize:10, color:"var(--muted)", marginBottom:6 }}>Updated {Math.floor((Date.now()-lastSync)/60000) || "<1"} min ago</p>}
        {!locked && <p style={{ fontSize:11, color:"var(--muted)", marginBottom:14 }}>👀 Predictions visible after tournament starts (Thu 11 Jun)</p>}
        {locked && <p style={{ fontSize:11, color:"var(--ok)", marginBottom:14 }}>👀 Tap a name to see their predictions!</p>}
      </div>

      <div style={{ padding:"0 16px" }}>
        {leaderboard.length === 0
          ? <div style={{ textAlign:"center", padding:48, color:"var(--muted)" }}><p style={{ fontSize:40, marginBottom:10 }}>👥</p><p>No participants yet</p></div>
          : <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {leaderboard.map((p, i) => {
                const isMe = me && p.id === me.id;
                const ptsBehind = i > 0 ? leaderboard[0].pts - p.pts : 0;
                return (
                  <div key={p.id} className={`card ${i===0?"lb1":i===1?"lb2":i===2?"lb3":""}`}
                    style={{ padding:"16px 18px", border: isMe ? "2px solid var(--gold)" : undefined,
                      boxShadow: isMe ? "0 0 12px rgba(232,184,75,0.2)" : undefined,
                      cursor: locked ? "pointer" : "default" }}
                    onClick={() => locked && setViewingPlayer(p)}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize:22, minWidth:30, textAlign:"center" }}>
                        {i < 3 ? ["🥇","🥈","🥉"][i] : <span style={{ fontFamily:"'Bebas Neue', sans-serif", color:"var(--muted)", fontSize:18 }}>#{i+1}</span>}
                      </span>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <p style={{ fontWeight:700, fontSize:15 }}>{p.name}</p>
                          {isMe && <span style={{ fontSize:10, background:"var(--gold)", color:"#012148", borderRadius:4, padding:"1px 5px", fontWeight:700 }}>YOU</span>}
                          {locked && !isMe && <span style={{ fontSize:10, color:"var(--muted)" }}>👁</span>}
                        </div>
                        <p style={{ fontSize:11, color:"var(--muted)" }}>⭐ {p.exact} exact · ✅ {p.correct} correct</p>
                        {shared.champions[p.id] && <p style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>🏆 {FLAGS[shared.champions[p.id]]} {shared.champions[p.id]}</p>}
                        {ptsBehind > 0 && isMe && <p style={{ fontSize:11, color:"var(--amber)", marginTop:2 }}>🎯 {ptsBehind} pts behind the leader</p>}
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <span style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:32, color: i===0 ? "var(--gold)" : "var(--text)", lineHeight:1 }}>{p.pts}</span>
                        <span style={{ fontSize:11, color:"var(--muted)", marginLeft:3 }}>pts</span>
                      </div>
                    </div>
                    <div style={{ marginTop:10 }}><Pbar value={p.pts} max={maxPts} /></div>
                  </div>
                );
              })}
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
  const scoringRows = [
    ["Group Stage",    "3 pts",  "1 pt"],
    ["Round of 32",   "6 pts",  "2 pts"],
    ["Round of 16",   "9 pts",  "3 pts"],
    ["Quarter-final", "12 pts", "4 pts"],
    ["Semi-final",    "15 pts", "5 pts"],
    ["Final",         "24 pts", "8 pts"],
  ];
  const rules = [
    { icon:"⚽", title:"How it works", body:"Predict the score of every group stage match before the tournament starts. Once the knockout bracket is set, predict those too. Most points after the Final wins — bragging rights only, no prizes." },
    { icon:"📈", title:"Round multipliers — the later, the bigger", body:"Points multiply each round: ×1 group stage, ×2 Round of 32, ×3 Round of 16, ×4 Quarter-finals, ×5 Semi-finals, ×8 Final. This keeps the pool exciting all the way to the last match." },
    { icon:"⭐", title:"Exact score — 3 × multiplier", body:"Predict the exact final score (e.g. 2–1) and it ends exactly that way → 3 pts × round multiplier. Getting the Final exact is worth a massive 24 points!" },
    { icon:"✅", title:"Correct outcome — 1 × multiplier", body:"Predict the right result (home win, draw, or away win) but miss the exact score → 1 pt × round multiplier." },
    { icon:"🏆", title:"World Champion bonus — 15 points", body:"Pick the team that lifts the trophy. If you're right → 15 bonus points added at the end. Enough to shake up the leaderboard, but not enough to overcome a strong group stage." },
    { icon:"🥈", title:"Runner-up bonus — 5 points", body:"In your Final prediction, pick the team that finishes runner-up. Correct → 5 bonus points." },
    { icon:"⚖️", title:"Tiebreaker", body:"Equal points? Most exact scores wins. Still tied? Most correct outcomes. Still tied? Earliest sign-up." },
    { icon:"⏱️", title:"Knockout draws — 90 minutes counts", body:"In the knockout phase, your predicted score is judged on the result after 90 minutes only. If you predict 2–2 and it ends 2–2 after 90 minutes, you get full points — regardless of extra time or penalties. Your team winner prediction is judged on who ultimately progresses." },
    { icon:"🔒", title:"Predictions lock at kickoff", body:"Group stage predictions lock when Mexico vs South Africa kicks off on Thu 11 Jun at 23:00 Dubai time. Fill them in before then!" },
    { icon:"🤝", title:"Fair play", body:"This pool is for fun among the SRI Dads community. No financial stakes. All disputes settled by the pool organiser — their decision is final." },
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
          <p className="lbl" style={{ marginBottom:12 }}>Points per round</p>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid var(--bd)" }}>
                <th style={{ textAlign:"left", padding:"6px 6px", color:"var(--muted)", fontWeight:600 }}>Round</th>
                <th style={{ textAlign:"center", padding:"6px 6px", color:"var(--gold)", fontWeight:600 }}>⭐ Exact</th>
                <th style={{ textAlign:"center", padding:"6px 6px", color:"var(--amber)", fontWeight:600 }}>✅ Outcome</th>
              </tr>
            </thead>
            <tbody>
              {scoringRows.map(([round, exact, outcome]) => (
                <tr key={round} style={{ borderBottom:"1px solid var(--bd)" }}>
                  <td style={{ padding:"7px 6px", color:"var(--text)", fontWeight:500, fontSize:12 }}>{round}</td>
                  <td style={{ padding:"7px 6px", textAlign:"center", color:"var(--gold)", fontWeight:700, fontFamily:"'Bebas Neue', sans-serif", fontSize:16 }}>{exact}</td>
                  <td style={{ padding:"7px 6px", textAlign:"center", color:"var(--amber)", fontWeight:700, fontFamily:"'Bebas Neue', sans-serif", fontSize:16 }}>{outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid var(--bd)" }}>
            <p className="lbl" style={{ marginBottom:8 }}>Bonus points</p>
            {[["🏆 Correct World Champion","15 pts"],["🥈 Correct Runner-up","5 pts"]].map(([l,v]) => (
              <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0" }}>
                <span style={{ fontSize:13, color:"var(--text)" }}>{l}</span>
                <span style={{ fontWeight:700, color:"var(--gold)", fontFamily:"'Bebas Neue', sans-serif", fontSize:16 }}>{v}</span>
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

        // Check rate limit — warn at 75% usage
        const { remaining, total } = getRateLimitInfo();
        if (remaining !== null && total !== null) {
          const usedPct = ((total - remaining) / total) * 100;
          if (usedPct >= 75 && usedPct < 100) {
            showToast(`⚠️ API limit: ${remaining}/${total} requests left today`);
          } else if (remaining === 0) {
            showToast("🚫 API daily limit reached — scores won't auto-update until tomorrow");
          }
        }

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
  function loginAs(p) {
    setMe(p);
    setActiveGroup("A");
    setActiveStage("group");
    try { sessionStorage.setItem("sri_me", JSON.stringify(p)); } catch {}
    showToast(`Welcome, ${p.name}! ⚽`);
    setView("predict");
  }
  function logout() {
    if (!window.confirm("Are you sure you want to log out? Your predictions are saved.")) return;
    setMe(null);
    try { sessionStorage.removeItem("sri_me"); } catch {}
    setView("home");
  }

  const leaderboard = useMemo(() => {
    if (!shared) return [];
    // Find actual champion and runner-up from Final result
    const finalMatch = shared.knockoutMatches.find(m => m.stage === "Final");
    const finalResult = finalMatch?.result;
    let actualChampion = null, actualRunnerUp = null;
    if (finalResult && finalMatch.home && finalMatch.away && FLAGS[finalMatch.home]) {
      const hg = parseInt(finalResult.homeGoals), ag = parseInt(finalResult.awayGoals);
      if (!isNaN(hg) && !isNaN(ag)) {
        actualChampion = hg >= ag ? finalMatch.home : finalMatch.away;
        actualRunnerUp = hg >= ag ? finalMatch.away : finalMatch.home;
      }
    }

    return shared.participants.map(p => {
      let pts = 0, exact = 0, correct = 0;
      // Group stage
      shared.matches.forEach(m => {
        if (!m.result) return;
        const s = calcPts((shared.predictions[p.id] || {})[m.id], m.result, "group");
        pts += s; if (s === 3) exact++; if (s === 1) correct++;
      });
      // Knockout rounds
      shared.knockoutMatches.forEach(m => {
        if (!m.result) return;
        const s = calcPts((shared.predictions[p.id] || {})[m.id], m.result, m.stage);
        pts += s; if (s > 0 && s === 3 * (ROUND_MULTIPLIER[m.stage]||1)) exact++; if (s === (ROUND_MULTIPLIER[m.stage]||1)) correct++;
      });
      // Champion bonus
      const champPick = shared.champions[p.id];
      if (champPick && actualChampion && champPick === actualChampion) pts += CHAMPION_BONUS;
      // Runner-up bonus (from knockout predictions on Final)
      const finalPred = (shared.predictions[p.id] || {})[finalMatch?.id];
      if (finalPred && actualRunnerUp) {
        const predRunnerUp = finalPred.awayTeam || finalPred.homeTeam;
        if (predRunnerUp === actualRunnerUp) pts += RUNNER_UP_BONUS;
      }
      return { ...p, pts, exact, correct };
    }).sort((a, b) => b.pts - a.pts || b.exact - a.exact);
  }, [shared]);

  const completedMatches = shared ? shared.matches.filter(m => m.result).length : 0;
  const totalMatches = shared ? shared.matches.length : 0;
  const resultFlash = useResultFlash(shared || { matches:[], knockoutMatches:[] });

  // Count incomplete group predictions for nav badge
  const myGroupPreds = me ? (shared?.predictions[me.id] || {}) : {};
  const incompleteCount = me ? shared?.matches.filter(m => {
    const p = myGroupPreds[m.id];
    if (!p) return true;
    const hg = p.homeGoals, ag = p.awayGoals;
    return !(hg !== undefined && hg !== "" && hg !== null && ag !== undefined && ag !== "" && ag !== null);
  }).length : 0;

  async function handleRefreshLeaderboard() {
    const data = await loadPool();
    if (data && data.matches) setShared(data);
  }

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
      {resultFlash && <div style={{ position:"fixed", inset:0, background:"rgba(61,170,110,0.15)", pointerEvents:"none", zIndex:500, animation:"flashFade .8s ease forwards" }}><style>{`@keyframes flashFade{0%{opacity:1}100%{opacity:0}}`}</style></div>}
      {view === "home"        && <HomeView {...sp} leaderboard={leaderboard} completedMatches={completedMatches} totalMatches={totalMatches} />}
      {view === "join"        && <JoinView {...sp} loginAs={loginAs} />}
      {view === "predict"     && <PredictView {...sp} logout={logout} activeGroup={activeGroup} setActiveGroup={setActiveGroup} activeStage={activeStage} setActiveStage={setActiveStage} />}
      {view === "leaderboard" && <LeaderboardView leaderboard={leaderboard} shared={shared} me={me} onRefresh={handleRefreshLeaderboard} lastSync={lastSync} />}
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
          }} style={{ position:"relative" }}>
            <span style={{ fontSize:19 }}>{n.id === "predict" && me ? "😎" : n.icon}</span>
            <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.3px" }}>
              {n.id === "predict" && me ? me.name.split(" ")[0] : n.label}
            </span>
            {view === n.id && <div className="ndot" />}
            {n.id === "predict" && me && incompleteCount > 0 && !isPredictionLocked() && (
              <span style={{ position:"absolute", top:2, right:6, background:"#E05555", color:"#fff", borderRadius:"50%", width:16, height:16, fontSize:9, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid var(--navy)" }}>
                {incompleteCount > 9 ? "9+" : incompleteCount}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
