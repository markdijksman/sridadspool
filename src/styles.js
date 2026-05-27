export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --navy:#012148;--gold:#E8B84B;--gold-lt:#f5cc6a;
  --gold-pale:rgba(232,184,75,0.13);--gold-bd:rgba(232,184,75,0.28);
  --text:#EEE9DF;--muted:#7D8FA8;--subtle:rgba(255,255,255,0.06);
  --bd:rgba(255,255,255,0.09);--danger:#E05555;--ok:#3DAA6E;--amber:#E08C2A;
}
body{background:#012148;font-family:'Inter',sans-serif;-webkit-tap-highlight-color:transparent;}
#root{min-height:100vh;}
.app{min-height:100vh;background:#012148;color:var(--text);}
.serif{font-family:'Playfair Display',serif;}
.lbl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);}
.card{background:rgba(255,255,255,0.04);border:1px solid var(--bd);border-radius:16px;}
.card-gold{background:var(--gold-pale);border:1px solid var(--gold-bd);border-radius:16px;}
.btn{border:none;border-radius:10px;padding:12px 24px;font-weight:700;cursor:pointer;font-size:14px;font-family:'Inter',sans-serif;transition:all .18s;}
.btn-gold{background:linear-gradient(135deg,#C9A84C,#a8853a);color:#071628;}
.btn-gold:hover{transform:translateY(-1px);box-shadow:0 6px 22px rgba(201,168,76,0.35);}
.btn-ghost{background:transparent;border:1px solid var(--bd);color:var(--text);}
.btn-ghost:hover{background:var(--subtle);border-color:var(--gold-bd);}
.btn-sm{padding:8px 16px;font-size:13px;}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important;}
.btn-del{background:rgba(224,85,85,0.09);border:1px solid rgba(224,85,85,0.22);color:var(--danger);border-radius:8px;padding:6px 14px;font-weight:600;cursor:pointer;font-size:13px;font-family:'Inter',sans-serif;}
.inp{background:rgba(255,255,255,0.06);border:1.5px solid var(--bd);border-radius:10px;color:var(--text);padding:12px 16px;font-size:14px;outline:none;width:100%;font-family:'Inter',sans-serif;transition:border-color .18s;}
.inp:focus{border-color:var(--gold);}
.inp::placeholder{color:var(--muted);}
select.inp{cursor:pointer;appearance:none;-webkit-appearance:none;}
.sbox{width:50px;text-align:center;background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.1);border-radius:8px;color:#fff;font-size:20px;font-weight:700;padding:6px 2px;outline:none;font-family:'Inter',sans-serif;transition:border-color .18s;-moz-appearance:textfield;}
.sbox::-webkit-outer-spin-button,.sbox::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}
.sbox:focus{border-color:var(--gold);}
.sbox.filled{border-color:rgba(201,168,76,0.5);background:rgba(201,168,76,0.07);}
.sbox:disabled{opacity:.4;}
.tab{padding:9px 18px;border-radius:8px;font-weight:600;font-size:13px;cursor:pointer;border:none;font-family:'Inter',sans-serif;transition:all .15s;}
.tab.on{background:var(--gold);color:#071628;}
.tab.off{background:transparent;color:var(--muted);}
.tab.off:hover{color:var(--text);background:var(--subtle);}
.gtab{padding:7px 13px;border-radius:8px;font-weight:700;font-size:15px;cursor:pointer;border:1px solid var(--bd);font-family:'Playfair Display',serif;transition:all .15s;}
.gtab.on{background:var(--gold);color:#071628;border-color:transparent;}
.gtab.off{background:var(--subtle);color:var(--muted);}
.gtab.off:hover{color:var(--text);border-color:var(--gold-bd);}
.mrow{background:rgba(255,255,255,0.025);border:1px solid var(--bd);border-radius:12px;padding:12px 10px;display:flex;align-items:center;gap:6px;transition:border-color .15s;}
.mrow:hover{border-color:var(--gold-bd);}
.mrow.played{opacity:.6;}
.lb1{background:linear-gradient(135deg,rgba(201,168,76,.12),rgba(201,168,76,.03));border-color:rgba(201,168,76,.32)!important;}
.lb2{background:linear-gradient(135deg,rgba(192,192,192,.08),rgba(192,192,192,.02));border-color:rgba(192,192,192,.2)!important;}
.lb3{background:linear-gradient(135deg,rgba(180,110,50,.08),rgba(180,110,50,.02));border-color:rgba(180,110,50,.2)!important;}
.pbar{height:4px;border-radius:2px;background:rgba(255,255,255,0.07);overflow:hidden;}
.pfill{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--gold),var(--gold-lt));transition:width .6s ease;}
.nav-bar{position:fixed;bottom:0;left:0;right:0;background:#012148;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-top:1px solid var(--gold-bd);display:flex;justify-content:space-around;padding:8px 0;padding-bottom:max(8px,env(safe-area-inset-bottom));z-index:300;}
.nbtn{display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:6px 8px;border-radius:10px;border:none;background:transparent;font-family:'Inter',sans-serif;transition:all .15s;min-width:48px;}
.nbtn.on{color:var(--gold);}
.nbtn.off{color:var(--muted);}
.ndot{width:4px;height:4px;border-radius:50%;background:var(--gold);margin:0 auto;}
.toast{position:fixed;bottom:88px;left:50%;transform:translateX(-50%);background:#011535;border:1px solid var(--gold-bd);color:var(--gold);padding:11px 22px;border-radius:12px;font-weight:600;font-size:14px;z-index:999;white-space:nowrap;animation:fadeUp .25s ease;box-shadow:0 8px 30px rgba(0,0,0,.5);}
@keyframes fadeUp{from{opacity:0;transform:translateX(-50%) translateY(8px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
.bx-exact{background:#3DAA6E;color:#fff;border-radius:999px;padding:2px 8px;font-size:11px;font-weight:700;white-space:nowrap;}
.bx-ok{background:#D4872A;color:#fff;border-radius:999px;padding:2px 8px;font-size:11px;font-weight:700;white-space:nowrap;}
.bx-miss{background:rgba(255,255,255,0.07);color:var(--muted);border-radius:999px;padding:2px 8px;font-size:11px;font-weight:700;}
.topbar{background:#012148;border-bottom:1px solid var(--gold-bd);padding:10px 18px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200;}
.rcard{background:rgba(255,255,255,0.025);border-left:3px solid var(--gold);border-radius:0 12px 12px 0;padding:14px 16px;margin-bottom:10px;}
.legal{background:rgba(7,16,32,0.7);border:1px solid rgba(201,168,76,0.15);border-radius:12px;padding:16px 18px;font-size:11px;line-height:1.7;color:var(--muted);}
.pin-inp{background:rgba(255,255,255,0.07);border:2px solid var(--bd);border-radius:12px;color:#fff;font-size:28px;font-weight:700;text-align:center;padding:12px;width:160px;outline:none;letter-spacing:8px;font-family:'Inter',sans-serif;}
.pin-inp:focus{border-color:var(--gold);}
.hide-scrollbar::-webkit-scrollbar{display:none;}
.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none;}

@keyframes spin{to{transform:rotate(360deg);}}
.page{padding-bottom:108px;}
`;

export const LEGAL_TEXT = `This prediction pool is organised by a private group of parents ("SRI Dads") for social and entertainment purposes only. It is a free-to-play, skill-based forecasting activity. No entry fee is charged, no money or prizes of monetary value are exchanged, and no financial benefit is gained by any participant or organiser.

This activity does not constitute gambling, wagering, or any form of commercial gaming as defined under UAE Federal Law No. 4 of 1979 (Penal Code) or any subsequent legislation, including regulations issued by the General Commercial Gaming Regulatory Authority (GCGRA). Participants do not pay to enter and do not receive financial winnings. Points are awarded purely for recreational tracking of prediction accuracy.

This pool is not affiliated with, endorsed by, or connected to GEMS Education, GEMS School of Research and Innovation, or any other educational institution.`;
