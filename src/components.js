import React, { useState } from 'react';
import { FLAGS } from './data';
import { LEGAL_TEXT } from './styles';
import { calcPts } from './data';

export function Wordmark() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
      <div style={{
        width:26, height:26,
        background:"linear-gradient(135deg,#C9A84C,#8a6a28)",
        transform:"rotate(45deg)", borderRadius:3, flexShrink:0,
        boxShadow:"0 2px 8px rgba(201,168,76,0.35)"
      }} />
      <div style={{ lineHeight:1.1 }}>
        <p style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:13, color:"#C9A84C", letterSpacing:"0.8px" }}>SRI DADS</p>
        <p style={{ fontSize:8, color:"rgba(201,168,76,0.55)", letterSpacing:"1.8px", textTransform:"uppercase" }}>Dubai Sports City</p>
      </div>
    </div>
  );
}

export function TopBar({ saving }) {
  return (
    <div className="topbar">
      <Wordmark />
      <div style={{ textAlign:"right", lineHeight:1.2 }}>
        <p style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:12, color:"var(--text)" }}>World Cup Pool 2026</p>
        {saving && <p style={{ fontSize:10, color:"var(--muted)" }}>Saving <span className="spin">⚽</span></p>}
      </div>
    </div>
  );
}

export function TeamBadge({ team, right }) {
  const flag = FLAGS[team] || "🏳️";
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontWeight:600, fontSize:12,
      flexDirection: right ? "row-reverse" : "row" }}>
      <span style={{ fontSize:15 }}>{flag}</span>
      <span style={{ whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:76 }}>{team}</span>
    </span>
  );
}

export function Pts({ pts }) {
  if (pts === 3) return <span className="bx-exact">+3 ⭐</span>;
  if (pts === 1) return <span className="bx-ok">+1 ✓</span>;
  return <span className="bx-miss">0</span>;
}

export function Pbar({ value, max }) {
  const w = max > 0 ? (value / max) * 100 : 0;
  return <div className="pbar"><div className="pfill" style={{ width:`${w}%` }} /></div>;
}

export function LegalBox() {
  const [open, setOpen] = useState(false);
  return (
    <div className="legal">
      <p style={{ fontWeight:700, fontSize:12, color:"rgba(201,168,76,0.7)", marginBottom:6, letterSpacing:"0.5px" }}>
        ⚖️ LEGAL NOTICE — UAE COMPLIANCE
      </p>
      <p style={{ marginBottom:8 }}>
        This is a <strong style={{ color:"var(--text)" }}>free-to-play, no-prize, skill-based prediction game</strong>.
        No money changes hands. No financial benefit is gained by any participant.
        This activity does not constitute gambling or wagering under UAE law.
      </p>
      <button onClick={() => setOpen(v => !v)}
        style={{ background:"none", border:"none", color:"var(--gold)", cursor:"pointer",
          fontSize:11, padding:0, fontFamily:"Inter,sans-serif", textDecoration:"underline" }}>
        {open ? "Hide full legal text ▲" : "Read full legal disclaimer ▼"}
      </button>
      {open && <p style={{ marginTop:10, whiteSpace:"pre-line" }}>{LEGAL_TEXT}</p>}
    </div>
  );
}

export function PageFooter() {
  return (
    <div style={{ padding:"20px 16px 108px" }}>
      <LegalBox />
      <div style={{ marginTop:16, borderTop:"1px solid var(--bd)", paddingTop:14, textAlign:"center" }}>
        <p style={{ fontSize:11, color:"var(--muted)", lineHeight:1.8 }}>
          © 2026 SRI Dads · Dubai Sports City, UAE<br />
          All rights reserved. Made with ⚽ by the SRI parent community.<br />
          <span style={{ fontSize:10, opacity:.6 }}>Not affiliated with GEMS Education or GEMS School of Research &amp; Innovation.</span>
        </p>
      </div>
    </div>
  );
}

export function MatchRow({ match, myPred, onUpdate, showResult }) {
  const pred = myPred || {};
  const filled = pred.homeGoals !== undefined && pred.awayGoals !== undefined;
  const pts = match.result ? calcPts(pred, match.result) : null;
  const locked = !!match.result;
  return (
    <div className={`mrow ${locked ? "played" : ""}`}>
      <div style={{ flex:1, textAlign:"right" }}><TeamBadge team={match.home} right /></div>
      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
        <input type="number" min="0" max="20"
          className={`sbox ${filled ? "filled" : ""}`}
          value={pred.homeGoals ?? ""}
          disabled={locked || match.home === "TBD"}
          onChange={e => onUpdate && onUpdate(match.id, e.target.value, pred.awayGoals ?? "")} />
        <span style={{ color:"var(--muted)", fontWeight:700, fontSize:14 }}>–</span>
        <input type="number" min="0" max="20"
          className={`sbox ${filled ? "filled" : ""}`}
          value={pred.awayGoals ?? ""}
          disabled={locked || match.away === "TBD"}
          onChange={e => onUpdate && onUpdate(match.id, pred.homeGoals ?? "", e.target.value)} />
      </div>
      <div style={{ flex:1 }}><TeamBadge team={match.away} /></div>
      {pts !== null && <Pts pts={pts} />}
      {showResult && match.result && (
        <span style={{ color:"var(--muted)", fontSize:11 }}>{match.result.homeGoals}–{match.result.awayGoals}</span>
      )}
    </div>
  );
}

export function AdminMatchRow({ match, onSave }) {
  const [hg, setHg] = useState(match.result?.homeGoals ?? "");
  const [ag, setAg] = useState(match.result?.awayGoals ?? "");
  return (
    <div className={`mrow ${match.result ? "played" : ""}`}>
      <div style={{ flex:1, textAlign:"right" }}><TeamBadge team={match.home} right /></div>
      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
        <input type="number" min="0" max="20" className={`sbox ${match.result ? "filled" : ""}`}
          value={hg} onChange={e => setHg(e.target.value)} />
        <span style={{ color:"var(--muted)", fontWeight:700 }}>–</span>
        <input type="number" min="0" max="20" className={`sbox ${match.result ? "filled" : ""}`}
          value={ag} onChange={e => setAg(e.target.value)} />
      </div>
      <div style={{ flex:1 }}><TeamBadge team={match.away} /></div>
      <button className="btn btn-gold btn-sm" style={{ flexShrink:0 }}
        onClick={() => { if (hg !== "" && ag !== "") onSave(hg, ag); }}>✓</button>
    </div>
  );
}

export function PinGate({ onUnlock, adminPin }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  function tryPin() {
    if (pin === adminPin) { onUnlock(); }
    else { setErr(true); setPin(""); }
  }
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"60px 24px", gap:18 }}>
      <div style={{ width:60, height:60, borderRadius:"50%", background:"var(--gold-pale)",
        border:"2px solid var(--gold-bd)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>🔐</div>
      <p style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:20, color:"var(--text)" }}>Admin Access</p>
      <input type="password" inputMode="numeric" className="pin-inp" maxLength={4}
        value={pin} placeholder="••••"
        onChange={e => { setPin(e.target.value.replace(/\D/g, "")); setErr(false); }}
        onKeyDown={e => e.key === "Enter" && tryPin()} />
      {err && <p style={{ color:"var(--danger)", fontSize:13 }}>Incorrect PIN</p>}
      <button className="btn btn-gold" onClick={tryPin}>Unlock</button>
      <p style={{ color:"var(--muted)", fontSize:11 }}>Default PIN: 1234</p>
    </div>
  );
}
