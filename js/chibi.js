/* ========================================================================
   CHIBI — karakter siswa versi kecil (kepala besar, badan kecil) yang menemani belajar.
   - mode "belajar": pojok layar, kecil, tidak menghalangi klik. Senang saat benar, sedih saat salah.
   - mode "ujian"  : tidak ada benar/salah → hanya semangat. Jalan-jalan di bawah layar & bilang "Ganbatte!".
                     Bisa dipencet & dipindah: panik (meronta) dengan tangan kecil yang menjepit, lalu dilepas.
   Dipakai bersama oleh Hafalan, Matching, Pilihan Ganda, JLPT, JFT, SSW. API: window.Chibi
   ======================================================================== */
import { renderCharacter, DEFAULT_EQUIPPED, SKIN_TONES, AURAS, SAYAP } from "./character.js?v=20261122p";
import { PET } from "./character-pet.js";

let _src = () => ({});
export const setSource = (fn) => { _src = fn; };
const LS_OFF = "shirose-chibi-off";
const reduce = () => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
export const chibiOff = () => { try { return localStorage.getItem(LS_OFF) === "1"; } catch (e) { return false; } };
export function chibiToggle(on) { try { localStorage.setItem(LS_OFF, on === false || (on === undefined && !chibiOff()) ? "1" : "0"); } catch (e) {} if (chibiOff()) unmount(); return !chibiOff(); }

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

/* ---------- gaya ---------- */
const CSS = `
.cb{position:fixed;z-index:60;width:58px;user-select:none;-webkit-user-select:none;pointer-events:none;left:8px;bottom:calc(10px + env(safe-area-inset-bottom));}
@media(min-width:700px){.cb{width:70px;left:14px;}}
.cb .cb-in{transform-origin:50% 100%;animation:cbIdle 3s ease-in-out infinite;filter:drop-shadow(0 3px 5px rgba(0,0,0,.35));}
.cb svg{display:block;width:100%;height:auto;overflow:visible;}
@keyframes cbIdle{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-3px) rotate(1.5deg)}}
.cb.hop .cb-in{animation:cbHop .7s ease-out;}
@keyframes cbHop{0%{transform:translateY(0) scale(1,1)}20%{transform:translateY(0) scale(1.12,.86)}50%{transform:translateY(-22px) scale(.94,1.1)}75%{transform:translateY(0) scale(1.1,.88)}100%{transform:translateY(0) scale(1,1)}}
.cb.droop .cb-in{animation:cbDroop 1.4s ease-out;}
@keyframes cbDroop{0%{transform:scale(1,1)}25%{transform:scale(1.06,.88) rotate(-4deg)}100%{transform:scale(1,.97) rotate(-2deg)}}
.cb .cb-spark{animation:cbSpark .7s ease-out;transform-origin:center;}
@keyframes cbSpark{0%{opacity:0;transform:scale(.3)}40%{opacity:1;transform:scale(1.2)}100%{opacity:0;transform:scale(1)}}
.cb-say{position:absolute;left:50%;bottom:100%;transform:translateX(-30%);margin-bottom:2px;white-space:nowrap;background:#fff;color:#2b2540;font:800 12px/1 system-ui,sans-serif;padding:6px 10px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.3);opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;}
.cb-say::after{content:"";position:absolute;left:22%;top:100%;border:6px solid transparent;border-top-color:#fff;}
.cb.held .cb-say{bottom:auto;top:34%;left:100%;transform:none;margin:0 0 0 8px;}.cb.held .cb-say::after{display:none;}
.cb.held .cb-say.on{transform:none;}
.cb-say.on{opacity:1;transform:translateX(-30%) translateY(-3px);}
/* mode ujian: bisa diseret */
.cb.ujian{pointer-events:auto;cursor:grab;touch-action:none;width:56px;bottom:auto;transition:none;}
@media(min-width:700px){.cb.ujian{width:64px;}}
.cb.ujian.walk .cb-in{animation:cbWalk .46s ease-in-out infinite;}
@keyframes cbWalk{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-6px) rotate(5deg)}}
.cb.ujian.held{cursor:grabbing;z-index:90;}
.cb.ujian.held .cb-in{animation:cbPanic .16s linear infinite;}
@keyframes cbPanic{0%{transform:translate(-2px,0) rotate(-9deg)}25%{transform:translate(2px,-3px) rotate(8deg)}50%{transform:translate(-3px,1px) rotate(-6deg)}75%{transform:translate(3px,-2px) rotate(10deg)}100%{transform:translate(-2px,0) rotate(-9deg)}}
.cb.drop{transition:top .55s cubic-bezier(.3,1.5,.5,1);}
.cb-arm{position:absolute;left:50%;bottom:calc(100% - 31px);width:30px;height:46px;margin-left:-15px;pointer-events:none;display:none;z-index:2;}
.cb.held .cb-arm{display:block;}
.cb-arm svg{position:absolute;left:50%;bottom:0;width:30px;height:46px;margin-left:-15px;animation:cbGrip .18s ease-in-out infinite alternate;}
@keyframes cbGrip{from{transform:translateX(-1px) rotate(-3deg)}to{transform:translateX(1px) rotate(3deg)}}
@media(prefers-reduced-motion:reduce){.cb .cb-in,.cb.ujian.walk .cb-in{animation:none !important}}
`;
const HAND = (c) => `<svg viewBox="0 0 34 44"><path d="M7 0 H27 V10 H7Z" fill="#fff" stroke="#aab2d0" stroke-width="1.5"/><path d="M9 0 V10" stroke="#d3d8ec" stroke-width="1.5"/><path d="M6 11 H28 V24 Q28 32 22 35 L20 41 H14 L12 35 Q6 32 6 24Z" fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width="1"/><path d="M12 18 V30 M17 17 V31 M22 18 V30" stroke="rgba(0,0,0,.22)" stroke-width="1.2" stroke-linecap="round"/><ellipse cx="6" cy="22" rx="4" ry="7" fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width="1"/></svg>`;

/* ---------- pengendali ---------- */
let C = null;      // { el, mode, kar, exp, timers[], raf, x, y, dir, held }
const SAY_OK = ["Sugoi!", "Yatta!", "Bagus!", "Kereen!", "Hebat!"], SAY_NG = ["Ganbatte…", "Tak apa!", "Coba lagi~", "Pasti bisa!"];
const SAY_UJ = ["Ganbatte!", "頑張って!", "Semangat!", "Fight!", "Tenang…", "Kamu bisa!", "ファイト!"];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const later = (fn, ms) => { const t = setTimeout(fn, ms); C && C.timers.push(t); return t; };

function paint(exp) {
  if (!C) return;
  C.exp = exp || "netral";
  const inn = C.el.querySelector(".cb-in"); if (inn) inn.innerHTML = chibiSvg(C.kar, C.exp);
}
export function say(text, ms = 2200) {
  if (!C) return; const b = C.el.querySelector(".cb-say"); if (!b) return;
  b.textContent = text; b.classList.add("on"); clearTimeout(C.sayT); C.sayT = setTimeout(() => b.classList.remove("on"), ms);
}
function ensureCss() { if (document.getElementById("cb-css")) return; const st = document.createElement("style"); st.id = "cb-css"; st.textContent = CSS; document.head.appendChild(st); }

export function unmount() {
  if (!C) return;
  C.timers.forEach(clearTimeout); cancelAnimationFrame(C.raf); clearTimeout(C.sayT);
  window.removeEventListener("pointermove", C.mv); window.removeEventListener("pointerup", C.up); window.removeEventListener("pointercancel", C.up);
  C.el.remove(); C = null;
}

export function mount(mode = "belajar") {
  if (chibiOff()) { unmount(); return; }
  if (C && C.mode === mode && document.body.contains(C.el)) return;     // sudah ada: jangan diulang
  unmount(); ensureCss();
  const kar = _src() || {};
  const el = document.createElement("div");
  el.className = "cb " + (mode === "ujian" ? "ujian walk" : "");
  el.innerHTML = `<div class="cb-say"></div><div class="cb-arm">${HAND((SKIN_TONES[kar.skinTone || "light"] || SKIN_TONES.light).skin)}</div><div class="cb-flip"><div class="cb-in"></div></div>`;
  document.body.appendChild(el);
  C = { el, mode, kar, exp: "netral", timers: [], raf: 0, x: 20, dir: 1, held: false, pause: 0 };
  paint("netral");
  if (mode === "ujian") startWalk();
}

/** Reaksi benar/salah. Hanya untuk mode belajar (di ujian tidak ada benar/salah). */
export function react(ok) {
  if (!C || C.mode !== "belajar") return;
  const el = C.el; clearTimeout(C.rx);
  el.classList.remove("hop", "droop"); void el.offsetWidth;
  paint(ok ? "happy" : "sad"); el.classList.add(ok ? "hop" : "droop");
  if (Math.random() < .7) say(pick(ok ? SAY_OK : SAY_NG), 1500);
  C.rx = setTimeout(() => { if (!C) return; el.classList.remove("hop", "droop"); paint("netral"); }, ok ? 1300 : 1900);
}

/* ---------- mode ujian: jalan, semangat, bisa diseret ---------- */
function startWalk() {
  const el = C.el, W = () => el.offsetWidth || 60, H = () => el.offsetHeight || 90;
  const floor = () => window.innerHeight - H() - 8 - (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sab")) || 0);
  C.x = Math.max(4, Math.min(window.innerWidth - W() - 4, 16)); C.y = floor();
  const put = () => { el.style.left = C.x + "px"; el.style.top = C.y + "px"; const f = el.querySelector(".cb-flip"); if (f) f.style.transform = `scaleX(${C.dir})`; };
  put(); paint("cheer");
  later(() => say(pick(SAY_UJ), 2400), 900);
  let last = performance.now(), nextSay = performance.now() + 7000 + Math.random() * 6000, standUntil = 0, goal = null;
  const step = (t) => {
    if (!C) return; const dt = Math.min(0.05, (t - last) / 1000); last = t;
    if (!C.held && !reduce()) {
      if (C.dropped) { /* sedang jatuh */ }
      else if (t < standUntil) { el.classList.remove("walk"); }
      else {
        if (goal == null || Math.abs(goal - C.x) < 3) { goal = 8 + Math.random() * Math.max(10, window.innerWidth - W() - 16); standUntil = t + 1500 + Math.random() * 3000; el.classList.remove("walk"); }
        else { C.dir = goal > C.x ? 1 : -1; C.x += C.dir * 30 * dt; el.classList.add("walk"); }
        C.y = floor(); put();
      }
      if (t > nextSay) { say(pick(SAY_UJ), 2400); nextSay = t + 9000 + Math.random() * 9000; }
    }
    C.raf = requestAnimationFrame(step);
  };
  C.raf = requestAnimationFrame(step);

  // ---- diseret ----
  let dx = 0, dy = 0;
  C.mv = (e) => {
    if (!C || !C.held) return;
    C.x = Math.max(0, Math.min(window.innerWidth - W(), e.clientX - dx)); C.y = Math.max(26, Math.min(window.innerHeight - H(), e.clientY - dy));
    el.style.left = C.x + "px"; el.style.top = C.y + "px";
    C.dir = 1; const f = el.querySelector(".cb-flip"); if (f) f.style.transform = "scaleX(1)";
  };
  C.up = () => {
    if (!C || !C.held) return; C.held = false; el.classList.remove("held"); el.classList.add("drop"); C.dropped = true;
    C.y = floor(); el.style.top = C.y + "px"; paint("cheer"); say(pick(["Huft…", "Fuuh!", "Jangan gitu dong~", "Hampir copot!"]), 2000);
    setTimeout(() => { if (!C) return; el.classList.remove("drop"); C.dropped = false; goal = null; standUntil = performance.now() + 900; }, 650);
  };
  el.addEventListener("pointerdown", (e) => {
    if (!C || C.held) return; e.preventDefault();
    const r = el.getBoundingClientRect(); C.held = true; C.dropped = false; dx = e.clientX - r.left; dy = e.clientY - r.top;
    el.classList.remove("drop", "walk"); el.classList.add("held"); paint("panic"); say(pick(["Waaa!", "Lepasin~!", "Eeeh?!", "Turunin aku!"]), 1800);
    try { el.setPointerCapture(e.pointerId); } catch (_) {}
  });
  window.addEventListener("pointermove", C.mv); window.addEventListener("pointerup", C.up); window.addEventListener("pointercancel", C.up);
}

const Chibi = { setSource, chibiSvg, mount, unmount, react, say, chibiToggle, chibiOff };
export default Chibi;
