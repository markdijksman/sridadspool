import React, { useState, useRef } from 'react';
import { FLAGS, calcPts } from './data';
import { LEGAL_TEXT } from './styles';

export function SriDadsLogo({ size = 40 }) {
  return (
    <div style={{ width:size, height:size, flexShrink:0, borderRadius:size*0.12, overflow:"hidden", background:"#012148" }}>
      <img src="/logo.png" alt="GEMS SRI Football Dad's Club" width={size} height={size} style={{ objectFit:"cover", display:"block" }} />
    </div>
  );
}

export function Wordmark() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <SriDadsLogo size={38} />
      <div style={{ lineHeight:1.1 }}>
        <p style={{ fontFamily:"'Oswald', sans-serif", fontWeight:700, fontSize:14, color:"#C9A84C", letterSpacing:"2px", textTransform:"uppercase" }}>SRI Dads</p>
        <p style={{ fontSize:8, color:"rgba(201,168,76,0.55)", letterSpacing:"0.8px", textTransform:"uppercase", fontFamily:"Inter,sans-serif" }}>Brotherhood beyond the school gates</p>
      </div>
    </div>
  );
}

export function TopBar({ saving, syncStatus, lastSync }) {
  const syncLabel = syncStatus === 'syncing' ? '🔄 Syncing scores...'
    : syncStatus === 'ok' ? '✅ Scores live'
    : syncStatus === 'error' ? '⚠️ Sync error'
    : null;
  return (
    <div className="topbar">
      <Wordmark />
      <div style={{ textAlign:"right", lineHeight:1.2 }}>
        <p style={{ fontFamily:"'Bebas Neue', sans-serif", fontWeight:400, fontSize:15, color:"var(--text)", letterSpacing:"1px" }}>World Cup Pool 2026</p>
        {saving && <p style={{ fontSize:9, color:"var(--muted)" }}>Saving <span className="spin">⚽</span></p>}
        {syncLabel && !saving && (
          <p style={{ fontSize:9, color: syncStatus === 'error' ? "var(--danger)" : syncStatus === 'ok' ? "var(--ok)" : "var(--muted)" }}>{syncLabel}</p>
        )}
      </div>
    </div>
  );
}

export function TeamBadge({ team, right }) {
  const flag = FLAGS[team] || "🏳️";
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontWeight:600, fontSize:12, flexDirection: right ? "row-reverse" : "row" }}>
      <span style={{ fontSize:15 }}>{flag}</span>
      <span style={{ whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:110 }}>{team}</span>
    </span>
  );
}

export function Pts({ pts, stage }) {
  // pts already has multiplier applied
  if (pts <= 0) return <span className="bx-miss">0</span>;
  const isExact = pts % 3 === 0 && pts > 0;
  if (isExact) return <span className="bx-exact">+{pts} ⭐</span>;
  return <span className="bx-ok">+{pts} ✓</span>;
}

export function Pbar({ value, max }) {
  const w = max > 0 ? (value / max) * 100 : 0;
  return <div className="pbar"><div className="pfill" style={{ width:`${w}%` }} /></div>;
}

export function LegalBox() {
  const [open, setOpen] = useState(false);
  return (
    <div className="legal">
      <p style={{ fontWeight:700, fontSize:12, color:"rgba(201,168,76,0.7)", marginBottom:6, letterSpacing:"0.5px" }}>⚖️ LEGAL NOTICE — UAE COMPLIANCE</p>
      <p style={{ marginBottom:8 }}>
        This is a <strong style={{ color:"var(--text)" }}>free-to-play, no-prize, skill-based prediction game</strong>.
        No money changes hands. No financial benefit is gained by any participant.
        This activity does not constitute gambling or wagering under UAE law.
      </p>
      <button onClick={() => setOpen(v => !v)}
        style={{ background:"none", border:"none", color:"var(--gold)", cursor:"pointer", fontSize:11, padding:0, fontFamily:"Inter,sans-serif", textDecoration:"underline" }}>
        {open ? "Hide full legal text ▲" : "Read full legal disclaimer ▼"}
      </button>
      {open && <p style={{ marginTop:10, whiteSpace:"pre-line" }}>{LEGAL_TEXT}</p>}
    </div>
  );
}

export function PageFooter() {
  return (
    <div style={{ padding:"20px 16px 108px" }}>
      <a href={`https://wa.me/?text=${encodeURIComponent("⚽ Join our World Cup 2026 Pool!\n\nSign up and predict match scores to compete with the other SRI Dads.\n\n🔗 www.sridads.com\n\nMay the best dad win! 🏆")}`}
        target="_blank" rel="noopener noreferrer"
        style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, background:"#25D366", borderRadius:12, padding:"13px 20px", color:"#fff", fontWeight:700, fontSize:14, textDecoration:"none", boxShadow:"0 4px 16px rgba(37,211,102,0.25)", marginBottom:14 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Share with the Dads on WhatsApp
      </a>
      <LegalBox />
      <div style={{ marginTop:16, borderTop:"1px solid var(--bd)", paddingTop:14, textAlign:"center" }}>
        <p style={{ fontSize:11, color:"var(--muted)", lineHeight:1.8 }}>
          © 2026 SRI Dads · Brotherhood beyond the school gates<br />
          All rights reserved. Made with ⚽ by the SRI parent community.<br />
          <span style={{ fontSize:10, opacity:.6 }}>Not affiliated with GEMS Education or GEMS School of Research &amp; Innovation.</span>
        </p>
      </div>
    </div>
  );
}

export function MatchRow({ match, myPred, onUpdate, showResult }) {
  const pred = myPred || {};
  // Fix: properly check both values are filled (handles 0 as valid score)
  const filled = pred.homeGoals !== undefined && pred.homeGoals !== "" && pred.homeGoals !== null
               && pred.awayGoals !== undefined && pred.awayGoals !== "" && pred.awayGoals !== null;
  const stage = match.stage || (match.group ? "group" : "Round of 32");
  const pts = match.result ? calcPts(pred, match.result, stage) : null;
  const locked = !!match.result;
  const isKnockout = !match.group;
  const awayRef = useRef(null);

  function handleHomeChange(e) {
    const val = e.target.value.replace(/[^0-9]/g, "");
    onUpdate && onUpdate(match.id, val, pred.awayGoals ?? "");
    if (val.length === 1) {
      setTimeout(() => awayRef.current?.focus(), 80);
    }
  }

  return (
    <div style={{ marginBottom:2 }}>
      {(match.date || match.label) && (
        <div style={{ display:"flex", justifyContent:"space-between", padding:"2px 4px 4px", fontSize:10, color:"var(--muted)" }}>
          <span>{match.label || match.date}</span>
          {match.time && <span>🕐 {match.time} Dubai</span>}
          {match.venue && <span style={{ fontSize:9, opacity:.7 }}>{match.venue}</span>}
        </div>
      )}
      <div className={`mrow ${locked ? "played" : ""}`}>
        <div style={{ flex:1, textAlign:"right" }}>
          <TeamBadge team={isKnockout && !FLAGS[match.home] ? "TBD" : match.home} right />
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <input
            type="text" inputMode="numeric" pattern="[0-9]*" maxLength={2}
            className={`sbox ${filled ? "filled" : ""}`}
            value={pred.homeGoals ?? ""}
            disabled={locked || match.home === "TBD" || (isKnockout && !FLAGS[match.home])}
            onChange={handleHomeChange} />
          <span style={{ color:"var(--muted)", fontWeight:700, fontSize:14 }}>–</span>
          <input
            type="text" inputMode="numeric" pattern="[0-9]*" maxLength={2}
            ref={awayRef}
            className={`sbox ${filled ? "filled" : ""}`}
            value={pred.awayGoals ?? ""}
            disabled={locked || match.away === "TBD" || (isKnockout && !FLAGS[match.away])}
            onChange={e => {
              const val = e.target.value.replace(/[^0-9]/g, "");
              onUpdate && onUpdate(match.id, pred.homeGoals ?? "", val);
            }} />
        </div>
        <div style={{ flex:1 }}>
          <TeamBadge team={isKnockout && !FLAGS[match.away] ? "TBD" : match.away} />
        </div>
        {pts !== null && <Pts pts={pts} />}
        {showResult && match.result && (
          <span style={{ color:"var(--muted)", fontSize:11 }}>{match.result.homeGoals}–{match.result.awayGoals}</span>
        )}
      </div>
    </div>
  );
}

export function AdminMatchRow({ match, onSave }) {
  const [hg, setHg] = useState(match.result?.homeGoals ?? "");
  const [ag, setAg] = useState(match.result?.awayGoals ?? "");
  const awayRef = useRef(null);
  return (
    <div style={{ marginBottom:2 }}>
      {(match.date || match.label) && (
        <div style={{ display:"flex", justifyContent:"space-between", padding:"2px 4px 4px", fontSize:10, color:"var(--muted)" }}>
          <span>{match.label || match.date}</span>
          {match.time && <span>🕐 {match.time} Dubai</span>}
          {match.venue && <span style={{ fontSize:9, opacity:.7 }}>{match.venue}</span>}
        </div>
      )}
      <div className={`mrow ${match.result ? "played" : ""}`}>
        <div style={{ flex:1, textAlign:"right" }}><TeamBadge team={match.home} right /></div>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={2}
            className={`sbox ${match.result ? "filled" : ""}`}
            value={hg} onChange={e => { const v=e.target.value.replace(/[^0-9]/g,""); setHg(v); if (v.length===1) setTimeout(()=>awayRef.current?.focus(),80); }} />
          <span style={{ color:"var(--muted)", fontWeight:700 }}>–</span>
          <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={2}
            ref={awayRef}
            className={`sbox ${match.result ? "filled" : ""}`}
            value={ag} onChange={e => setAg(e.target.value.replace(/[^0-9]/g,""))} />
        </div>
        <div style={{ flex:1 }}><TeamBadge team={match.away} /></div>
        <button className="btn btn-gold btn-sm" style={{ flexShrink:0 }}
          onClick={() => { if (hg !== "" && ag !== "") onSave(hg, ag); }}>✓</button>
      </div>
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
      <div style={{ width:60, height:60, borderRadius:"50%", background:"var(--gold-pale)", border:"2px solid var(--gold-bd)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>🔐</div>
      <p style={{ fontFamily:"'Bebas Neue', sans-serif", fontWeight:700, fontSize:20, color:"var(--text)" }}>Admin Access</p>
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
