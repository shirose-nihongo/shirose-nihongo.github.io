/* ========================================================================
   TEMAN BELAJAR — karakter siswa (proporsi normal, ukuran kecil) yang berkeliaran di layar.
   - Jalan-jalan di dasar layar, melompat naik ke tombol/kartu pilihan, turun lagi. Yang pakai sayap bisa terbang.
   - mode "belajar": senang saat benar, sedih saat salah. mode "ujian": tidak ada benar/salah → semangat & "Ganbatte!".
   - Bisa dipencet & dipindah: panik (goyang pelan + tangan kecil menjepit). Dilepas → jatuh ke bawah, pusing sebentar, lalu aktif lagi.
   chibiSvg() (kepala besar) tetap dipakai untuk profil leaderboard.
   Dipakai bersama oleh Hafalan, Matching, Pilihan Ganda, JLPT, JFT, SSW. API: window.Chibi
   ======================================================================== */
import { renderCharacter, DEFAULT_EQUIPPED, SKIN_TONES, AURAS, SAYAP, CATALOG } from "./character.js?v=20261122p";
import { PET } from "./character-pet.js";

let _src = () => ({});
export const setSource = (fn) => { _src = fn; };
const LS_OFF = "shirose-chibi-off";
const reduce = () => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
const LS_PREF = "shirose-chibi-pref";   // "full" (jalan + lompat + terbang tiap ±1 menit) | "walk" (tanpa terbang) | "still" (diam)
export const chibiPref = () => { try { const v = localStorage.getItem(LS_PREF); return v === "walk" || v === "still" ? v : "full"; } catch (e) { return "full"; } };
const setPref = (v) => { try { localStorage.setItem(LS_PREF, v); } catch (e) {} };
export const chibiOff = () => { try { return localStorage.getItem(LS_OFF) === "1"; } catch (e) { return false; } };
export function chibiToggle(on) {
  try { localStorage.setItem(LS_OFF, on === false || (on === undefined && !chibiOff()) ? "1" : "0"); } catch (e) {}
  if (chibiOff()) { unmount(); showChip(); } else { removeChip(); mount(_lastMode); }
  return !chibiOff();
}
let _lastMode = "belajar";
/* tombol kecil untuk memunculkan karakter lagi setelah disembunyikan */
function removeChip() { const c = document.getElementById("cb-chip"); if (c) c.remove(); }
function showChip() {
  ensureCss(); if (document.getElementById("cb-chip")) return;
  const b = document.createElement("button"); b.id = "cb-chip"; b.type = "button"; b.title = "Munculkan teman belajar"; b.setAttribute("aria-label", "Munculkan teman belajar"); b.textContent = "🙂";
  b.onclick = () => chibiToggle(true); document.body.appendChild(b);
}

/* ---------- gambar ---------- */
let _n = 0;
const EXP = {
  happy(s) { return `
    <ellipse cx="178" cy="126" rx="19" ry="19" fill="${s}"/><ellipse cx="222" cy="126" rx="19" ry="19" fill="${s}"/>
    <path d="M166 133 Q178 117 190 133 M210 133 Q222 117 234 133" stroke="#2a1a14" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="164" cy="150" rx="9" ry="5.5" fill="#ff7f9c" opacity=".6"/><ellipse cx="236" cy="150" rx="9" ry="5.5" fill="#ff7f9c" opacity=".6"/>
    <ellipse cx="200" cy="160" rx="19" ry="11" fill="${s}"/>
    <path d="M185 153 Q200 182 215 153 Z" fill="#7a1f2b" stroke="#5b141f" stroke-width="1.5" stroke-linejoin="round"/><path d="M192 166 Q200 174 208 166 Q200 160 192 166Z" fill="#ff7f8f"/>`; },
  sad(s) { return `
    <ellipse cx="178" cy="126" rx="19" ry="19" fill="${s}"/><ellipse cx="222" cy="126" rx="19" ry="19" fill="${s}"/>
    <ellipse cx="178" cy="132" rx="9" ry="10.5" fill="#fff" stroke="#2a1a14" stroke-width="1.5"/><ellipse cx="222" cy="132" rx="9" ry="10.5" fill="#fff" stroke="#2a1a14" stroke-width="1.5"/>
    <circle cx="178" cy="135" r="6" fill="#26324f"/><circle cx="222" cy="135" r="6" fill="#26324f"/><circle cx="175.5" cy="132" r="2.4" fill="#fff"/><circle cx="219.5" cy="132" r="2.4" fill="#fff"/>
    <path d="M164 118 L190 109 M210 109 L236 118" stroke="#3a2518" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M172 143 Q168 158 174 164 Q180 158 178 146Z M228 143 Q232 158 226 164 Q220 158 222 146Z" fill="#7dd3fc" opacity=".9"/>
    <ellipse cx="200" cy="164" rx="17" ry="9" fill="${s}"/>
    <path d="M187 170 Q200 156 213 170" stroke="#8b4a3a" stroke-width="3.4" fill="none" stroke-linecap="round"/>`; },
  panic(s) { return `
    <ellipse cx="178" cy="126" rx="19" ry="20" fill="${s}"/><ellipse cx="222" cy="126" rx="19" ry="20" fill="${s}"/>
    <circle cx="178" cy="131" r="11" fill="#fff" stroke="#2a1a14" stroke-width="2"/><circle cx="222" cy="131" r="11" fill="#fff" stroke="#2a1a14" stroke-width="2"/>
    <circle cx="178" cy="132" r="3.2" fill="#26324f"/><circle cx="222" cy="132" r="3.2" fill="#26324f"/>
    <path d="M164 111 Q178 102 192 111 M208 111 Q222 102 236 111" stroke="#3a2518" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    <ellipse cx="200" cy="163" rx="19" ry="11" fill="${s}"/>
    <ellipse cx="200" cy="165" rx="8" ry="11.5" fill="#7a1f2b" stroke="#5b141f" stroke-width="1.5"/>
    <path d="M244 102 Q250 114 244 120 Q238 114 244 102Z" fill="#7dd3fc"/>`; },
  dizzy(s) { return `
    <ellipse cx="178" cy="126" rx="19" ry="19" fill="${s}"/><ellipse cx="222" cy="126" rx="19" ry="19" fill="${s}"/>
    <path d="M169 117 L187 135 M187 117 L169 135 M213 117 L231 135 M231 117 L213 135" stroke="#2a1a14" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="200" cy="162" rx="16" ry="8" fill="${s}"/>
    <path d="M187 163 q4 -5 8 0 t8 0 t8 0" stroke="#8b4a3a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <g class="cb-dz"><path d="M150 70 l4 9 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1z" fill="#ffd54a"/><path d="M236 62 l4 9 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1z" fill="#7dd3fc"/><path d="M200 44 l3 7 7 1 -5 5 1 7 -6 -4 -6 4 1 -7 -5 -5 7 -1z" fill="#ff9ec7"/></g>`; },
  cheer(s) { return `
    <ellipse cx="178" cy="126" rx="19" ry="19" fill="${s}"/><ellipse cx="222" cy="126" rx="19" ry="19" fill="${s}"/>
    <path d="M167 131 Q178 120 189 131 M211 131 Q222 120 233 131" stroke="#2a1a14" stroke-width="4" fill="none" stroke-linecap="round"/>
    <ellipse cx="164" cy="150" rx="8" ry="5" fill="#ff7f9c" opacity=".5"/><ellipse cx="236" cy="150" rx="8" ry="5" fill="#ff7f9c" opacity=".5"/>
    <ellipse cx="200" cy="160" rx="16" ry="9" fill="${s}"/>
    <path d="M188 156 Q200 170 212 156" stroke="#8b4a3a" stroke-width="3" fill="#7a1f2b" stroke-linejoin="round"/>`; },
};

/** SVG chibi dari data karakter { equipped, skinTone, hairColor, body, bentuk }. exp: netral | happy | sad | panic | cheer
 *  Dua lapis: (1) seluruh karakter (baju, senjata, dll.) pada skala badan kecil, tanpa dipotong; (2) kepala saja (tanpa senjata)
 *  pada skala besar di atasnya. Aura, sayap, dan pet digambar terpisah supaya tidak terpotong/terskala ganda. */
export function chibiSvg(kar = {}, exp = "netral") {
  const skin = kar.skinTone || "light", s = (SKIN_TONES[skin] || SKIN_TONES.light).skin;
  const eqp = { ...DEFAULT_EQUIPPED, ...(kar.equipped || {}) };
  let auraSvg = "", sayapSvg = "", petSvg = "", petBehind = false;
  if (eqp.aura && eqp.aura !== "none" && AURAS[eqp.aura] && AURAS[eqp.aura].svg) { try { auraSvg = AURAS[eqp.aura].svg(); } catch (e) {} }
  if (eqp.sayap && eqp.sayap !== "none" && SAYAP && SAYAP[eqp.sayap] && SAYAP[eqp.sayap].svg) { try { sayapSvg = SAYAP[eqp.sayap].svg(); } catch (e) {} }
  if (eqp.pet && eqp.pet !== "none" && PET[eqp.pet] && PET[eqp.pet].svg) { try { petSvg = `<g transform="${PET[eqp.pet].tf || "translate(14 398) scale(1.3)"}">${PET[eqp.pet].svg()}</g>`; petBehind = !!PET[eqp.pet].behind; } catch (e) {} }
  const eqB = { ...eqp, aura: "none", sayap: "none", pet: "none" }, eqH = { ...eqB, item_tangan: "none" };
  const opt = { hairColor: kar.hairColor, body: kar.body, bentuk: kar.bentuk };
  const strip = (x) => x.replace(/^\s*<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  let innerB = "", innerH = "";
  try { innerB = strip(renderCharacter(eqB, skin, opt)); innerH = strip(renderCharacter(eqH, skin, opt)); }
  catch (e) { try { innerB = innerH = strip(renderCharacter({ ...DEFAULT_EQUIPPED }, "light", {})); } catch (e2) { return ""; } }
  const id = "cb" + (++_n), face = EXP[exp] ? EXP[exp](s) : "";
  const head = `translate(110 100) scale(1.3) translate(-200 -130)`, body = `translate(110 166) scale(.54) translate(-200 -184)`;
  const petG = petSvg ? `<g transform="${body}"><g transform="translate(200 470) scale(1.45) translate(-200 -470)">${petSvg}</g></g>` : "";
  return `<svg class="cb-svg" viewBox="0 -52 220 376" xmlns="http://www.w3.org/2000/svg" style="overflow:visible" aria-hidden="true">
    <defs><g id="${id}b">${innerB}</g><g id="${id}h">${innerH}</g>
      <clipPath id="${id}c"><rect x="-600" y="-300" width="1400" height="466"/><ellipse cx="200" cy="130" rx="66" ry="68"/></clipPath></defs>
    ${auraSvg ? `<clipPath id="${id}a"><rect x="-6" y="-46" width="232" height="352" rx="40"/></clipPath><g clip-path="url(#${id}a)"><g transform="translate(110 150) scale(.72) translate(-200 -250)">${auraSvg}</g></g>` : ""}
    ${sayapSvg ? `<clipPath id="${id}w"><rect x="-30" y="-46" width="280" height="356" rx="30"/></clipPath><g clip-path="url(#${id}w)"><g transform="${body}">${sayapSvg}</g></g>` : ""}
    ${petBehind ? petG : ""}
    <g transform="${body}"><use href="#${id}b"/></g>
    ${petBehind ? "" : petG}
    <g transform="${head}"><g clip-path="url(#${id}c)"><use href="#${id}h"/></g>${face}</g>
    ${exp === "happy" ? `<g class="cb-spark" fill="#ffd54a"><path d="M24 24 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z"/><path d="M190 10 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z"/></g>` : ""}
  </svg>`;
}


/** SVG karakter proporsi normal (400x500) lengkap dengan aura/sayap/pet, ditambah ekspresi. */
export function charSvg(kar = {}, exp = "netral") {
  const skin = kar.skinTone || "light", s = (SKIN_TONES[skin] || SKIN_TONES.light).skin;
  const eqp = { ...DEFAULT_EQUIPPED, ...(kar.equipped || {}) };
  const opt = { hairColor: kar.hairColor, body: kar.body, bentuk: kar.bentuk };
  let inner = "";
  try { inner = renderCharacter(eqp, skin, opt).replace(/^\s*<svg[^>]*>/, "").replace(/<\/svg>\s*$/, ""); }
  catch (e) { try { inner = renderCharacter({ ...DEFAULT_EQUIPPED }, "light", {}).replace(/^\s*<svg[^>]*>/, "").replace(/<\/svg>\s*$/, ""); } catch (e2) { return ""; } }
  const face = EXP[exp] ? EXP[exp](s) : "";
  return `<svg class="cb-svg" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" style="overflow:visible" aria-hidden="true">${inner}${face}${exp === "happy" ? `<g class="cb-spark" fill="#ffd54a"><path d="M60 60 l8 20 20 8 -20 8 -8 20 -8 -20 -20 -8 20 -8z"/><path d="M340 40 l6 16 16 6 -16 6 -6 16 -6 -16 -16 -6 16 -6z"/></g>` : ""}</svg>`;
}
const hasWings = (kar) => { const k = (kar && kar.equipped) || {}; let sy = k.sayap; if (k.set && k.set !== "none") { try { const st = (CATALOG && CATALOG.set && CATALOG.set[k.set] && CATALOG.set[k.set].parts); if (st && st.sayap) sy = st.sayap; } catch (e) {} } return !!(sy && sy !== "none"); };

/* ---------- gaya ---------- */
const CSS = `
.cb{position:fixed;left:0;top:0;z-index:60;width:66px;user-select:none;-webkit-user-select:none;pointer-events:auto;cursor:grab;touch-action:none;will-change:transform;}
@media(min-width:700px){.cb{width:76px;}}
.cb svg{display:block;width:100%;height:auto;overflow:visible;}
.cb .cb-flip{transform-origin:50% 100%;}
.cb .cb-in{transform-origin:50% 94%;filter:drop-shadow(0 3px 5px rgba(0,0,0,.35));}
.cb.held{cursor:grabbing;z-index:90;}
/* gerak */
.cb.st-idle .cb-in{animation:cbIdle 3s ease-in-out infinite;}
@keyframes cbIdle{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-2px) rotate(1deg)}}
.cb.st-walk .cb-in{animation:cbWalk .42s ease-in-out infinite;}
@keyframes cbWalk{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-4px) rotate(4deg)}}
.cb.st-air .cb-in{animation:cbAir .5s ease-in-out infinite alternate;}
@keyframes cbAir{from{transform:scale(.94,1.08) rotate(-3deg)}to{transform:scale(.96,1.06) rotate(3deg)}}
.cb.st-fly .cb-in{animation:cbFly .9s ease-in-out infinite;}
@keyframes cbFly{0%,100%{transform:translateY(-3px) rotate(-3deg)}50%{transform:translateY(4px) rotate(3deg)}}
.cb.st-fly [data-slot="sayap"],.cb.st-air.wing [data-slot="sayap"]{animation:cbFlap .22s ease-in-out infinite alternate;transform-origin:200px 250px;}
@keyframes cbFlap{from{transform:scaleX(1)}to{transform:scaleX(.62)}}
.cb.st-held .cb-in{animation:cbHeld .55s ease-in-out infinite alternate;}
@keyframes cbHeld{from{transform:rotate(-6deg) translateY(1px)}to{transform:rotate(6deg) translateY(-1px)}}
.cb.st-stun .cb-in{animation:cbStun 1.3s ease-in-out infinite;transform:scale(1.04,.9);}
@keyframes cbStun{0%,100%{transform:scale(1.04,.9) rotate(-5deg)}50%{transform:scale(1.04,.9) rotate(5deg)}}
.cb .cb-dz{animation:cbDz 1.4s linear infinite;transform-origin:200px 85px;}
@keyframes cbDz{to{transform:rotate(360deg)}}
.cb.hop .cb-in{animation:cbHop .6s ease-out;}
@keyframes cbHop{0%{transform:scale(1.1,.88)}40%{transform:scale(.95,1.08)}100%{transform:scale(1,1)}}
.cb.droop .cb-in{animation:cbDroop 1.4s ease-out forwards;}
@keyframes cbDroop{0%{transform:scale(1,1)}25%{transform:scale(1.05,.9) rotate(-4deg)}100%{transform:scale(1,.97) rotate(-2deg)}}
.cb .cb-spark{animation:cbSpark .7s ease-out;transform-origin:200px 100px;}
@keyframes cbSpark{0%{opacity:0;transform:scale(.3)}40%{opacity:1;transform:scale(1.2)}100%{opacity:0;transform:scale(1)}}
.cb-say{position:absolute;left:50%;bottom:100%;transform:translateX(-30%);margin-bottom:2px;white-space:nowrap;background:#fff;color:#2b2540;font:800 12px/1 system-ui,sans-serif;padding:6px 10px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.3);opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;z-index:3;}
.cb-say::after{content:"";position:absolute;left:22%;top:100%;border:6px solid transparent;border-top-color:#fff;}
.cb-say.on{opacity:1;transform:translateX(-30%) translateY(-3px);}
.cb-say.L{left:auto;right:50%;transform:translateX(30%);}.cb-say.L::after{left:auto;right:22%;}.cb-say.L.on{transform:translateX(30%) translateY(-3px);}
.cb.held .cb-say.L{left:auto;right:100%;margin:0 8px 0 0;transform:none;}
.cb.held .cb-say{bottom:auto;top:34%;left:100%;transform:none;margin:0 0 0 8px;}.cb.held .cb-say::after{display:none;}
.cb-arm{position:absolute;left:50%;bottom:calc(100% - 17px);width:26px;height:40px;margin-left:-13px;pointer-events:none;display:none;z-index:2;}
.cb.held .cb-arm{display:block;}
.cb-arm svg{position:absolute;left:0;bottom:0;width:26px;height:40px;animation:cbGrip .5s ease-in-out infinite alternate;}
@keyframes cbGrip{from{transform:rotate(-2deg)}to{transform:rotate(2deg)}}
#cb-chip{position:fixed;left:8px;bottom:calc(10px + env(safe-area-inset-bottom));z-index:60;width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.35);background:rgba(40,30,80,.72);color:#fff;font-size:18px;line-height:1;cursor:pointer;opacity:.7;padding:0;}
#cb-chip:hover{opacity:1}
.cb-menu{position:absolute;left:50%;bottom:calc(100% + 8px);width:182px;margin-left:-91px;background:#fff;color:#2b2540;border-radius:14px;box-shadow:0 4px 16px rgba(0,0,0,.4);padding:8px;z-index:5;cursor:default;font:700 13px/1.2 system-ui,sans-serif;touch-action:manipulation;}
.cb-menu::after{content:"";position:absolute;left:var(--tail,50%);top:100%;margin-left:-7px;border:7px solid transparent;border-top-color:#fff;}
.cb-menu.D{bottom:auto;top:calc(100% + 4px);}.cb-menu.D::after{top:auto;bottom:100%;border-top-color:transparent;border-bottom-color:#fff;}
.cb-menu .cb-mt{font-size:11px;font-weight:800;color:#7a6fa8;padding:2px 6px 6px;text-transform:uppercase;letter-spacing:.04em;}
.cb-menu button{display:flex;align-items:center;gap:8px;width:100%;text-align:left;background:#f3f0ff;color:#2b2540;border:2px solid transparent;border-radius:10px;padding:8px 10px;margin-top:5px;font:700 13px/1.2 system-ui,sans-serif;cursor:pointer;}
.cb-menu button:hover{background:#e6e0ff}
.cb-menu button.on{border-color:#ff5c9d;background:#ffe3ef}
.cb-menu button.on::after{content:"✓";margin-left:auto;color:#d6286f;font-weight:800;}
.cb-menu button.hide{background:#fff0f0;color:#a02b2b;}
@media(prefers-reduced-motion:reduce){.cb .cb-in,.cb [data-slot="sayap"],.cb .cb-dz{animation:none !important}}
`;
const HAND = (c) => `<svg viewBox="0 0 34 44"><path d="M7 0 H27 V10 H7Z" fill="#fff" stroke="#aab2d0" stroke-width="1.5"/><path d="M9 0 V10" stroke="#d3d8ec" stroke-width="1.5"/><path d="M6 11 H28 V24 Q28 32 22 35 L20 41 H14 L12 35 Q6 32 6 24Z" fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width="1"/><path d="M12 18 V30 M17 17 V31 M22 18 V30" stroke="rgba(0,0,0,.22)" stroke-width="1.2" stroke-linecap="round"/><ellipse cx="6" cy="22" rx="4" ry="7" fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width="1"/></svg>`;

/* ---------- pengendali ---------- */
let C = null;
const SAY_OK = ["Sugoi!", "Yatta!", "Bagus!", "Kereen!", "Hebat!"], SAY_NG = ["Ganbatte…", "Tak apa!", "Coba lagi~", "Pasti bisa!"];
const SAY_UJ = ["Ganbatte!", "頑張って!", "Semangat!", "Fight!", "Tenang…", "Kamu bisa!", "ファイト!"];
const SAY_BL = ["Ayo semangat!", "Pelan-pelan aja~", "Aku temenin!", "がんばれ!", "Kamu hebat!"];
const SAY_HELD = ["Waaa!", "Lepasin~!", "Eeeh?!", "Turunin aku!", "Tolong!"];
const SAY_STUN = ["Pusing…", "Aduh~", "Bintang-bintang…", "Auw…"];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const later = (fn, ms) => { const t = setTimeout(fn, ms); C && C.timers.push(t); return t; };
const G = 1900, FEET = .955;                       // gravitasi px/s²; posisi telapak kaki dalam tinggi elemen
const SEL = "button,.btn,[role=button],.opt,.option,.choice,.mc-opt,.lb-chip,.lb-row,.materi-item,.card,input[type=button],a.btn";

function paint(exp) {
  if (!C) return;
  C.exp = exp || "netral";
  const inn = C.el.querySelector(".cb-in"); if (inn) inn.innerHTML = charSvg(C.kar, C.exp);
}
function setSt(st) { if (!C || C.st === st) return; C.el.classList.remove("st-idle", "st-walk", "st-air", "st-fly", "st-held", "st-stun"); C.el.classList.add("st-" + st); C.st = st; }
export function say(text, ms = 2200) {
  if (!C) return; const b = C.el.querySelector(".cb-say"); if (!b) return;
  const r = C.el.getBoundingClientRect(); b.classList.toggle("L", r.left + r.width / 2 > window.innerWidth - 150);
  b.textContent = text; b.classList.add("on"); clearTimeout(C.sayT); C.sayT = setTimeout(() => b.classList.remove("on"), ms);
}
function ensureCss() { if (document.getElementById("cb-css")) return; const st = document.createElement("style"); st.id = "cb-css"; st.textContent = CSS; document.head.appendChild(st); }

export function unmount() {
  if (!C) return;
  C.timers.forEach(clearTimeout); cancelAnimationFrame(C.raf); clearTimeout(C.sayT); clearInterval(C.platT); C.unscroll && C.unscroll();
  window.removeEventListener("pointermove", C.mv); window.removeEventListener("pointerup", C.up); window.removeEventListener("pointercancel", C.up);
  if (C.docDown) document.removeEventListener("pointerdown", C.docDown, true);
  C.el.remove(); C = null; removeChip();
}

export function mount(mode = "belajar") {
  _lastMode = mode;
  if (chibiOff()) { unmount(); showChip(); return; }
  if (C && C.mode === mode && document.body.contains(C.el)) return;
  unmount(); ensureCss();
  const kar = _src() || {};
  const el = document.createElement("div");
  el.className = "cb st-idle" + (hasWings(kar) ? " wing" : "");
  el.innerHTML = `<div class="cb-say"></div><div class="cb-arm">${HAND((SKIN_TONES[kar.skinTone || "light"] || SKIN_TONES.light).skin)}</div><div class="cb-flip"><div class="cb-in"></div></div>`;
  document.body.appendChild(el);
  C = { el, mode, kar, exp: "netral", timers: [], raf: 0, st: "idle", wing: hasWings(kar), pref: chibiPref(), nextFly: performance.now() + 25000 + Math.random() * 20000, menuOpen: false, x: 0, y: 0, vx: 0, vy: 0, dir: 1, plats: [], on: null, busy: 0, held: false };
  paint(mode === "ujian" ? "cheer" : "netral");
  startLife();
}

/** Reaksi benar/salah (mode belajar). */
export function react(ok) {
  if (!C || C.mode !== "belajar" || C.held || C.st === "stun") return;
  const el = C.el; clearTimeout(C.rx);
  el.classList.remove("hop", "droop"); void el.offsetWidth;
  paint(ok ? "happy" : "sad"); el.classList.add(ok ? "hop" : "droop");
  C.busy = performance.now() + (ok ? 1300 : 1900); C.goal = null; C.vx = 0;
  if (ok && C.on) { C.vy = -430; C.on = null; }
  if (Math.random() < .7) say(pick(ok ? SAY_OK : SAY_NG), 1500);
  C.rx = setTimeout(() => { if (!C || C.held || C.st === "stun") return; el.classList.remove("hop", "droop"); paint("netral"); }, ok ? 1300 : 1900);
}

/* ---------- kehidupan: jalan, lompat ke tombol, terbang, jatuh ---------- */
function startLife() {
  const el = C.el;
  const W = () => el.offsetWidth || 66, H = () => el.offsetHeight || 83;
  const ground = () => ({ el: null, ground: true, left: -1e4, right: 1e4, top: window.innerHeight - 6 });
  const calm = reduce();

  const scan = () => {
    if (!C) return;
    const vh = window.innerHeight, vw = window.innerWidth, out = [];
    document.querySelectorAll(SEL).forEach((n) => {
      if (el.contains(n) || n === el) return;
      const r = n.getBoundingClientRect();
      if (r.width < 70 || r.height < 26 || r.height > 220 || r.top < 70 || r.top > vh - 40 || r.right < 10 || r.left > vw - 10) return;
      const cs = getComputedStyle(n); if (cs.display === "none" || cs.visibility === "hidden" || cs.pointerEvents === "none" || +cs.opacity < .3) return;
      out.push({ el: n });
    });
    // buang elemen yang bersarang (ambil yang terluar tetapi tidak raksasa)
    C.plats = out.filter((p, i) => !out.some((q, j) => j !== i && q.el !== p.el && q.el.contains(p.el))).slice(0, 40);
  };
  const rectOf = (p) => { if (p.ground) return { left: -1e4, right: 1e4, top: window.innerHeight - 6 }; if (!p.el || !p.el.isConnected) return null; const r = p.el.getBoundingClientRect(); if (r.top < 60 || r.top > window.innerHeight - 30 || r.width < 40) return null; return r; };
  const gnd = ground();
  const allPlats = () => [gnd, ...C.plats];

  const put = () => {
    el.style.transform = `translate3d(${(C.x - W() / 2).toFixed(1)}px,${(C.y - H() * FEET).toFixed(1)}px,0)`;
    const f = el.querySelector(".cb-flip"); if (f) f.style.transform = `scaleX(${C.dir})`;
  };
  // awal: di lantai, kiri bawah
  C.x = Math.min(window.innerWidth - W(), 16 + W() / 2); C.y = gnd.top; C.on = gnd; put();
  scan(); C.platT = setInterval(scan, 450);
  const onScroll = () => scan(); window.addEventListener("scroll", onScroll, { passive: true, capture: true }); C.unscroll = () => window.removeEventListener("scroll", onScroll, { capture: true });
  if (C.mode === "ujian") later(() => say(pick(SAY_UJ), 2400), 900);

  const tgtSay = () => pick(C.mode === "ujian" ? SAY_UJ : SAY_BL);
  let last = performance.now(), nextSay = last + 8000 + Math.random() * 6000, think = last + 1200;

  // ---- keputusan ----
  const decide = (t) => {
    const r0 = C.on && rectOf(C.on); const cur = r0 || gnd;
    const opts = [];
    // jalan di platform sekarang
    const canFly = C.wing && C.pref === "full" && t >= C.nextFly;      // terbang hanya sekitar 1× per menit
    opts.push({ w: canFly ? 1 : 3, f: () => { const hw = W() / 2 + 4, l = Math.max(cur.left, 0) + hw, r = Math.min(cur.right, window.innerWidth) - hw; C.goal = r > l ? l + Math.random() * (r - l) : (l + r) / 2; } });
    // lompat / terbang ke platform lain
    const here = C.on;
    for (const p of allPlats()) {
      if (p === here) continue; const r = rectOf(p); if (!r) continue;
      const left = Math.max(r.left, 8), right = Math.min(r.right, window.innerWidth - 8); if (right - left < 40) continue;
      const tx = left + 20 + Math.random() * Math.max(1, right - left - 40), dy = C.y - r.top, gx = Math.abs(tx - C.x);
      if (canFly) { if (gx < 520 && Math.abs(dy) < 520) opts.push({ w: dy > 0 ? 4 : 2.4, f: () => { C.fly = { tx, ty: r.top - 2, pl: p }; C.nextFly = t + 55000 + Math.random() * 20000; } }); }
      else if (dy <= 175 && gx <= 260 && (dy > -420)) opts.push({ w: dy > 20 ? 4 : 1.2, f: () => jump(tx, r.top, dy) });
    }
    if (canFly) opts.push({ w: 5, f: () => { C.nextFly = t + 55000 + Math.random() * 20000; C.fly = { tx: 60 + Math.random() * (window.innerWidth - 120), ty: window.innerHeight * (.3 + Math.random() * .55), pl: null, hover: 2000 + Math.random() * 3500 }; } });
    let sum = opts.reduce((a, o) => a + o.w, 0), x = Math.random() * sum;
    for (const o of opts) { x -= o.w; if (x <= 0) { o.f(); break; } }
    think = t + 1400 + Math.random() * 2600;
  };
  const jump = (tx, topY, dy) => {
    const h = Math.max(dy, 0) + 34 + Math.random() * 20;              // tinggi puncak di atas posisi sekarang
    const vy0 = -Math.sqrt(2 * G * h), tup = -vy0 / G, drop = Math.max(1, h - dy), tdn = Math.sqrt(2 * drop / G), T = tup + tdn;
    C.vy = vy0; C.vx = Math.max(-420, Math.min(420, (tx - C.x) / T)); C.on = null; C.goal = null; if (C.vx) C.dir = C.vx > 0 ? 1 : -1;
  };

  const land = (p, y) => { C.on = p; C.y = y; C.vy = 0; C.vx = 0; C.fly = null; };

  const step = (t) => {
    if (!C) return;
    const dt = Math.min(.05, (t - last) / 1000); last = t;
    const vw = window.innerWidth;
    if (C.held) { C.raf = requestAnimationFrame(step); return; }
    if (calm) { const g = ground(); C.y = g.top; C.on = gnd; put(); C.raf = requestAnimationFrame(step); return; }

    if (C.st === "stun") {
      if (t > C.stunUntil) { C.el.classList.remove("hop", "droop"); paint(C.mode === "ujian" ? "cheer" : "netral"); setSt("idle"); think = t + 800; say(pick(["Fuh, sudah lega.", "Oke lanjut!", "Aku baik-baik aja~"]), 1800); }
      else { C.raf = requestAnimationFrame(step); return; }
    }
    // jaga tetap menempel pada platform yang bergerak (scroll)
    if (C.on && !C.fly) {
      const r = rectOf(C.on);
      if (!r) { C.on = null; C.vy = 0; }
      else { C.y = r.top; if (C.x < r.left + 4 || C.x > r.right - 4) { if (!C.on.ground) { C.x = Math.max(r.left + 6, Math.min(r.right - 6, C.x)); } } }
    }
    if (C.fly) {
      // ---- terbang ----
      setSt("fly"); const f = C.fly, ty = f.ty + Math.sin(t / 380) * 4, dx = f.tx - C.x, dyy = ty - C.y, d = Math.hypot(dx, dyy);
      if (d > 6) { const sp = Math.min(d / dt, 120 + (d > 160 ? 60 : 0)); C.x += dx / d * sp * dt; C.y += dyy / d * sp * dt; C.dir = dx > 3 ? 1 : dx < -3 ? -1 : C.dir; }
      else if (f.pl) { const r = rectOf(f.pl); if (r) land(f.pl, r.top); else { C.fly = null; C.on = null; } setSt("idle"); think = t + 900; }
      else if ((f.hover -= dt * 1000) <= 0) { // pilih tempat mendarat
        const ps = allPlats().map((p) => ({ p, r: rectOf(p) })).filter((q) => q.r); const q = ps[Math.floor(Math.random() * ps.length)];
        C.fly = { tx: Math.max(q.r.left + 20, Math.min(q.r.right - 20, C.x)), ty: q.r.top - 2, pl: q.p };
      }
    } else if (C.on) {
      // ---- di atas platform: jalan / diam ----
      const busy = t < C.busy || C.menuOpen || C.pref === "still";
      if (C.pref === "still" && C.goal != null) C.goal = null;
      if (!busy && t > think) { if (C.goal == null) decide(t); }
      if (C.on && !C.fly && !busy && C.goal != null) {
        const dx = C.goal - C.x;
        if (Math.abs(dx) < 3) { C.goal = null; setSt("idle"); think = t + 900 + Math.random() * 2200; }
        else { C.dir = dx > 0 ? 1 : -1; C.x += C.dir * 40 * dt; setSt("walk"); }
        // batasi dalam platform sekarang
        const r = rectOf(C.on); if (r && !C.on.ground) C.x = Math.max(r.left + 6, Math.min(r.right - 6, C.x));
      } else if (C.st !== "idle" && !C.vy && C.goal == null) setSt("idle");
      // keputusan mungkin memicu lompatan atau terbang → ditangani di iterasi berikutnya
    }
    // ---- udara: fisika ----
    if (!C.on && !C.fly) {
      setSt("air"); const py = C.y; C.vy += G * dt; C.x += C.vx * dt; C.y += C.vy * dt; C.x = Math.max(W() / 2, Math.min(vw - W() / 2, C.x));
      if (C.vx) C.dir = C.vx > 0 ? 1 : -1;
      if (C.vy > 0) {
        let best = null, bt = 1e9;
        for (const p of allPlats()) { const r = rectOf(p); if (!r) continue; if (C.x >= r.left && C.x <= r.right && py <= r.top + 4 && C.y >= r.top && r.top < bt) { best = p; bt = r.top; } }
        if (best) { land(best, bt); setSt("idle"); think = t + 700; if (C.hardFall) { C.hardFall = false; stun(t, C.fellFrom ? Math.max(0, bt - C.fellFrom) : 0); } }
      }
    }
    if (t > nextSay && C.st !== "stun" && !C.menuOpen && C.pref !== "still") { say(tgtSay(), 2400); nextSay = t + 9000 + Math.random() * 9000; }
    C.x = Math.max(W() / 2, Math.min(vw - W() / 2, C.x));
    put(); C.raf = requestAnimationFrame(step);
  };
  const stun = (t, h) => { C.stunUntil = t + 1800 + Math.min(1800, h * 5); setSt("stun"); paint("dizzy"); say(pick(SAY_STUN), 1800); };
  C.raf = requestAnimationFrame(step);

  // ---- menu pilihan (balon percakapan) ----
  const closeMenu = (silent) => { const m = el.querySelector(".cb-menu"); if (m) m.remove(); C.menuOpen = false; if (C.docDown) { document.removeEventListener("pointerdown", C.docDown, true); C.docDown = null; } clearTimeout(C.menuT); };
  const choose = (a) => {
    if (a === "hide") { closeMenu(); chibiToggle(false); return; }
    C.pref = a; setPref(a); closeMenu(); C.goal = null;
    if (a !== "full" && C.fly) { const r = rectOf(gnd); C.fly = { tx: C.x, ty: r.top, pl: gnd }; }
    if (a === "still") { C.vx = 0; say("Oke, aku diam di sini~", 1800); }
    else if (a === "walk") say(C.wing ? "Oke, nggak terbang lagi!" : "Siap, jalan-jalan!", 1800);
    else say(C.wing ? "Yeay, boleh terbang!" : "Siap, jalan & lompat!", 1800);
    think = performance.now() + 600;
  };
  const openMenu = () => {
    closeMenu(); C.menuOpen = true; C.vx = 0; C.goal = null; clearTimeout(C.sayT); const sb = el.querySelector(".cb-say"); if (sb) sb.classList.remove("on");
    const items = [["full", C.wing ? "🕊️ Terbang & jalan-jalan" : "🚶 Jalan & lompat"], ...(C.wing ? [["walk", "🚶 Jalan-jalan saja"]] : []), ["still", "🧍 Diam saja"], ["hide", "🙈 Sembunyikan"]];
    const m = document.createElement("div"); m.className = "cb-menu";
    m.innerHTML = `<div class="cb-mt">Teman belajar</div>` + items.map(([k, l]) => `<button type="button" data-a="${k}" class="${k === "hide" ? "hide" : (k === C.pref || (k === "full" && !C.wing && C.pref === "walk") ? "on" : "")}">${l}</button>`).join("");
    m.addEventListener("pointerdown", (e) => e.stopPropagation());
    m.addEventListener("click", (e) => { const b = e.target.closest("button[data-a]"); if (b) choose(b.dataset.a); });
    el.appendChild(m);
    // jaga tetap di dalam layar
    const rc = el.getBoundingClientRect(), mw = 182, cx = rc.left + rc.width / 2; let sh = 0;
    if (cx - mw / 2 < 6) sh = 6 - (cx - mw / 2); else if (cx + mw / 2 > window.innerWidth - 6) sh = window.innerWidth - 6 - (cx + mw / 2);
    m.style.marginLeft = (-91 + sh) + "px"; m.style.setProperty("--tail", (91 - sh) + "px");
    if (rc.top - m.offsetHeight - 14 < 6) m.classList.add("D");
    C.docDown = (e) => { if (!el.contains(e.target)) closeMenu(); };
    document.addEventListener("pointerdown", C.docDown, true);
    C.menuT = setTimeout(() => { if (C && C.menuOpen) closeMenu(); }, 12000);
  };

  // ---- dipencet & dipindah ----
  let ox = 0, oy = 0, moved = 0, sx = 0, sy = 0;
  C.mv = (e) => {
    if (!C || !C.held) return;
    C.x = Math.max(W() / 2, Math.min(window.innerWidth - W() / 2, e.clientX - ox + W() / 2));
    C.y = Math.max(H() * FEET, Math.min(window.innerHeight, e.clientY - oy + H() * FEET));
    moved = Math.max(moved, Math.hypot(e.clientX - sx, e.clientY - sy)); put();
  };
  C.up = () => {
    if (!C || !C.held) return; C.held = false; el.classList.remove("held");
    C.fly = null; C.on = null; C.vx = 0; C.vy = 0; C.fellFrom = C.y;
    if (moved < 6) { C.hardFall = false; paint(C.mode === "ujian" ? "cheer" : "netral"); setSt("air"); C.dropOnly = true; if (C.menuOpen) closeMenu(); else openMenu(); }
    else { C.hardFall = true; setSt("air"); paint("panic"); }
    last = performance.now(); think = last + 600;
  };
  el.addEventListener("pointerdown", (e) => {
    if (!C || C.held) return; e.preventDefault();
    const r = el.getBoundingClientRect(); C.held = true; C.fly = null; C.goal = null; C.on = null; moved = 0; sx = e.clientX; sy = e.clientY; ox = e.clientX - r.left; oy = e.clientY - r.top;
    C.stunUntil = 0; el.classList.remove("hop", "droop"); setSt("held"); if (C.menuOpen) closeMenu(true); el.classList.add("held"); paint("panic"); say(pick(SAY_HELD), 1800);
    try { el.setPointerCapture(e.pointerId); } catch (_) {}
  });
  window.addEventListener("pointermove", C.mv); window.addEventListener("pointerup", C.up); window.addEventListener("pointercancel", C.up);
}

const Chibi = { setSource, chibiSvg, charSvg, mount, unmount, react, say, chibiToggle, chibiOff, chibiPref };
export default Chibi;
