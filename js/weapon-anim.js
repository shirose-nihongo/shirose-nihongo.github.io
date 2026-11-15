/* ========================================================================
   WEAPON-BASED ANIMATION — animasi adalah identitas bawaan senjata.
   Senjata ber-`animType` otomatis memakai pose tangan + gerak khasnya.
   Tipe: grimoire_held, grimoire_float, hammer, sword, katana.
   Tiap tipe punya 6 versi rarity (common–mythic); rarity hanya mengubah
   warna/efek visual, BUKAN pose dasar.
   State: idle | ready | attack | showcase (idle→ready→attack berulang).
   Semua animasi memakai SMIL (self-contained di dalam SVG, jalan di HP/desktop).
   Dipanggil dari character.js: extendWeaponAnim(C) & applyWeaponPose(...).
   ======================================================================== */

const rad = d => d * Math.PI / 180, clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t, ease = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
const f1 = n => (Math.round(n * 10) / 10).toString();

export const RARITIES = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];
/* palet per rarity: m=bilah/halaman, m2=tepi, ac=aksen, ac2=gagang, glow=cahaya (null = tanpa) */
const PAL = {
  common:    { m: "#cbd5e1", m2: "#94a3b8", ac: "#8b7355", ac2: "#4a3b2a", glow: null,      gl: 0, pt: 0 },
  uncommon:  { m: "#bbf7d0", m2: "#34d399", ac: "#15803d", ac2: "#14532d", glow: "#34d399", gl: 2.5, pt: 3 },
  rare:      { m: "#dbeafe", m2: "#60a5fa", ac: "#1d4ed8", ac2: "#1e3a8a", glow: "#60a5fa", gl: 4, pt: 6 },
  epic:      { m: "#ede9fe", m2: "#a78bfa", ac: "#6d28d9", ac2: "#3b0764", glow: "#a78bfa", gl: 5.5, pt: 9 },
  legendary: { m: "#fef9c3", m2: "#fbbf24", ac: "#b45309", ac2: "#451a03", glow: "#fbbf24", gl: 7.5, pt: 13 },
  mythic:    { m: "#ffe4e6", m2: "#fb7185", ac: "#be123c", ac2: "#4c0519", glow: "#fb7185", gl: 9.5, pt: 18 },
};
const RAINBOW = "#fb7185;#fbbf24;#4ade80;#60a5fa;#a78bfa;#fb7185";

/* ------------------------------ pose engine ------------------------------ */
/* K: nilai default pose. wx,wy,wr = tangan senjata (x,y,rotasi); fx,fy = tangan bebas;
   two=1 → tangan bebas ikut memegang senjata di y lokal g2; by = tinggi buku melayang. */
const K = o => ({ wx: 262, wy: 328, wr: 0, fx: 138, fy: 328, two: 0, g2: 0, by: 0, ...o });
function track(p, fr) {
  for (let i = 0; i < fr.length - 1; i++) {
    const [a, A] = fr[i], [b, B] = fr[i + 1];
    if (p <= b) { const u = ease(clamp((p - a) / (b - a))); const o = {}; for (const k in A) o[k] = lerp(A[k], B[k], u); return o; }
  }
  return { ...fr[fr.length - 1][1] };
}
const loop2 = (a, b) => [[0, a], [.5, b], [1, a]];
const ST = (period, frames) => ({ period, frames });
function loc(h, x, y) { const c = Math.cos(rad(h.rot)), s = Math.sin(rad(h.rot)); return { x: h.x + x * c - y * s, y: h.y + x * s + y * c }; }

const SPEC = {
  grimoire_held: { side: "L", win: [.3, .7],
    idle: ST(3, loop2(K({ wx: 114, wy: 284, wr: -14, fx: 270, fy: 302 }), K({ wx: 114, wy: 280, wr: -12, fx: 270, fy: 298 }))),
    ready: ST(1.8, loop2(K({ wx: 120, wy: 266, wr: -8, fx: 282, fy: 262 }), K({ wx: 120, wy: 262, wr: -6, fx: 284, fy: 258 }))),
    attack: (() => { const R = K({ wx: 120, wy: 266, wr: -8, fx: 282, fy: 262 }), E = K({ wx: 112, wy: 270, wr: -14, fx: 322, fy: 208 });
      return ST(1.5, [[0, R], [.3, K({ wx: 112, wy: 270, wr: -14, fx: 250, fy: 226 })], [.45, E], [.7, E], [1, R]]); })() },
  grimoire_float: { side: "L", palm: true, win: [.4, .8],
    idle: ST(3, loop2(K({ wx: 150, wy: 322, fx: 250, fy: 322, by: 262 }), K({ wx: 150, wy: 320, fx: 250, fy: 320, by: 254 }))),
    ready: ST(1.6, loop2(K({ wx: 146, wy: 314, fx: 254, fy: 314, by: 246 }), K({ wx: 146, wy: 312, fx: 254, fy: 312, by: 238 }))),
    attack: (() => { const R = K({ wx: 146, wy: 314, fx: 254, fy: 314, by: 246 }), E = K({ wx: 138, wy: 254, fx: 262, fy: 254, by: 214 });
      return ST(1.7, [[0, R], [.3, K({ wx: 150, wy: 290, fx: 250, fy: 290, by: 232 })], [.5, E], [.75, E], [1, R]]); })() },
  hammer: { side: "R", win: [.5, .8],
    idle: ST(3.4, loop2(K({ wx: 262, wy: 268, wr: 38, fx: 146, fy: 324 }), K({ wx: 262, wy: 266, wr: 36, fx: 146, fy: 322 }))),
    ready: ST(1.8, loop2(K({ wx: 222, wy: 300, wr: 30, two: 1, g2: 30 }), K({ wx: 222, wy: 296, wr: 28, two: 1, g2: 30 }))),
    attack: (() => { const R = K({ wx: 222, wy: 300, wr: 30, two: 1, g2: 30 }), S = K({ wx: 218, wy: 318, wr: 176, two: 1, g2: 30 });
      return ST(1.6, [[0, R], [.35, K({ wx: 272, wy: 205, wr: 40, two: 1, g2: 30 })], [.5, S], [.72, S], [1, R]]); })() },
  sword: { side: "R", win: [.2, .44],
    idle: ST(3, loop2(K({ wx: 274, wy: 322, wr: 26, fx: 132, fy: 300 }), K({ wx: 274, wy: 318, wr: 28, fx: 132, fy: 296 }))),
    ready: ST(1.6, loop2(K({ wx: 282, wy: 296, wr: 38, fx: 130, fy: 268 }), K({ wx: 284, wy: 292, wr: 42, fx: 128, fy: 264 }))),
    attack: (() => { const R = K({ wx: 282, wy: 296, wr: 38, fx: 130, fy: 268 }), E = K({ wx: 292, wy: 318, wr: 150, fx: 125, fy: 250 });
      return ST(1.25, [[0, R], [.22, K({ wx: 262, wy: 215, wr: -70, fx: 128, fy: 262 })], [.38, E], [.58, E], [1, R]]); })() },
  katana: { side: "R", win: [.2, .52],
    idle: ST(3.4, loop2(K({ wx: 236, wy: 310, wr: -80, two: 1, g2: 16 }), K({ wx: 236, wy: 306, wr: -78, two: 1, g2: 16 }))),
    ready: ST(1.8, loop2(K({ wx: 232, wy: 300, wr: -70, two: 1, g2: 16 }), K({ wx: 232, wy: 300, wr: -66, two: 1, g2: 16 }))),
    attack: (() => { const R = K({ wx: 232, wy: 300, wr: -70, two: 1, g2: 16 }), E = K({ wx: 176, wy: 292, wr: 105, two: 1, g2: 16 });
      return ST(1.3, [[0, R], [.18, K({ wx: 246, wy: 316, wr: -104, two: 1, g2: 16 })], [.34, K({ wx: 215, wy: 255, wr: -10, two: 1, g2: 16 })], [.46, E], [.62, E], [1, R]]); })() },
};
const TIP = { sword: 124, katana: 142, hammer: 0, grimoire_held: 0, grimoire_float: 0 };

/* urutan state → daftar segmen; showcase = idle → ready → attack */
function segsFor(type, state) {
  const sp = SPEC[type], names = state === "showcase" ? ["idle", "ready", "attack"] : [state in sp ? state : "idle"];
  return names.map(n => ({ n, st: sp[n] }));
}
function poseAt(type, segs, t) {
  const D = segs.reduce((a, s) => a + s.st.period, 0); t = ((t % D) + D) % D;
  let idx = 0, acc = 0; for (; idx < segs.length; idx++) { if (t < acc + segs[idx].st.period) break; acc += segs[idx].st.period; }
  idx = Math.min(idx, segs.length - 1);
  const s = segs[idx], loc_t = t - acc, p = loc_t / s.st.period; let P = track(p, s.st.frames);
  const BL = .4;                                   // blend dari akhir segmen sebelumnya
  if (loc_t < BL && (segs.length > 1 || s.n === "attack")) {
    const prev = segs[(idx - 1 + segs.length) % segs.length], Pe = track(1, prev.st.frames), u = ease(loc_t / BL);
    const o = {}; for (const k in P) o[k] = lerp(Pe[k], P[k], u); P = o;
  }
  return { P, n: s.n, p };
}

/* ------------------------------ gambar senjata ------------------------------ */
const hash = s => s;                               // id deterministik (gradient identik antar-render)
function bookArt(sc, pal, ti, glowCol) {
  const cov = pal.ac, trim = ti >= 1 ? "#f5c542" : "#c9b27a", rune = pal.glow || "#7c3aed";
  const flut = `<animate attributeName="d" dur="2.4s" repeatCount="indefinite" values="M0 -22 Q14 -26 28 -21 L28 20 Q14 16 0 22Z;M0 -22 Q14 -31 28 -26 L28 20 Q14 16 0 22Z;M0 -22 Q14 -26 28 -21 L28 20 Q14 16 0 22Z"/>`;
  return `<g transform="scale(${sc})">
  ${glowCol ? `<circle r="46" fill="${glowCol}" opacity=".26"><animate attributeName="opacity" values=".18;.34;.18" dur="2.6s" repeatCount="indefinite"/></circle>` : ""}
  <rect x="-32" y="-26" width="64" height="52" rx="4" fill="${cov}" stroke="${trim}" stroke-width="2"/>
  <path d="M0 -22 Q-14 -26 -28 -21 L-28 20 Q-14 16 0 22Z" fill="#fdf6e3" stroke="#d8c9a0"/>
  <path d="M0 -22 Q14 -26 28 -21 L28 20 Q14 16 0 22Z" fill="#fdf6e3" stroke="#d8c9a0">${flut}</path>
  <text x="-14" y="3" text-anchor="middle" font-size="17" fill="${rune}" font-family="'Noto Sans JP','Yu Gothic',sans-serif">文</text>
  <path d="M6 -10 H24 M6 -2 H24 M6 6 H20" stroke="#a89878" stroke-width="1.4"/>
  ${ti >= 2 ? `<circle cx="0" cy="-31" r="3.2" fill="${pal.glow}"/>` : ""}
  ${ti >= 3 ? `<path d="M-30 -22 L-30 22 M30 -22 L30 22" stroke="${pal.glow}" stroke-width="1.6" opacity=".8"/>` : ""}
  ${ti >= 4 ? `<path d="M-32 -26 L-26 -32 L-20 -26 M20 -26 L26 -32 L32 -26" stroke="#fde68a" stroke-width="1.6" fill="none"/>` : ""}
  </g>`;
}
function swordArt(pal, ti) {
  return `<path d="M-7 -16 L-6 -112 L0 -130 L6 -112 L7 -16Z" fill="${pal.m}" stroke="${pal.m2}" stroke-width="${ti >= 4 ? 2.4 : 1.6}"/>
  <path d="M0 -24 V-112" stroke="${pal.m2}" stroke-width="1.8"/>
  ${ti >= 3 ? `<path d="M-3 -44 h6 M-3 -62 h6 M-3 -80 h6 M-3 -98 h6" stroke="${pal.glow}" stroke-width="1.6" opacity=".9"/>` : ""}
  <path d="M-25 -20 Q0 -9 25 -20 L22 -11 Q0 -2 -22 -11Z" fill="${ti >= 4 ? "#fbbf24" : pal.ac}" stroke="${pal.ac2}" stroke-width="1.5"/>
  ${ti >= 2 ? `<circle cx="0" cy="-14" r="3.4" fill="${pal.glow}" stroke="${pal.ac2}" stroke-width=".8"/>` : ""}
  <rect x="-4" y="-11" width="8" height="30" rx="2" fill="${pal.ac2}" stroke="${pal.ac}" stroke-width="1"/>
  <path d="M-4 -4 L4 0 M-4 4 L4 8 M-4 12 L4 16" stroke="${pal.ac}" stroke-width="1.2"/>
  <circle cy="22" r="5.5" fill="${ti >= 1 ? "#fbbf24" : "#9ca3af"}" stroke="${pal.ac2}"/>`;
}
function katanaArt(pal, ti) {
  return `<path d="M-2.5 -18 Q-7 -80 3 -146 L7 -142 Q1 -80 2.5 -18Z" fill="${pal.m}" stroke="${pal.m2}" stroke-width="${ti >= 4 ? 1.8 : 1}"/>
  ${ti >= 2 ? `<path d="M1 -22 Q-3 -80 5 -138" stroke="${pal.glow}" stroke-width="1.6" fill="none" opacity=".85"/>` : ""}
  <ellipse cy="-18" rx="${ti >= 3 ? 12 : 10}" ry="4.6" fill="${ti >= 4 ? "#fbbf24" : pal.ac}" stroke="${pal.ac2}" stroke-width="1.2"/>
  <rect x="-3.6" y="-15" width="7.2" height="44" rx="2" fill="${pal.ac2}"/>
  <path d="M-3.6 -8 L3.6 -2 L-3.6 4 L3.6 10 L-3.6 16 L3.6 22" stroke="${ti >= 1 ? pal.m2 : "#9ca3af"}" stroke-width="1.3" fill="none"/>
  <rect x="-4.6" y="28" width="9.2" height="4" rx="1.5" fill="${ti >= 4 ? "#fbbf24" : "#9ca3af"}"/>
  ${ti >= 4 ? `<path d="M0 32 Q-10 44 -4 56" stroke="${pal.glow}" stroke-width="2.4" fill="none" stroke-linecap="round"><animate attributeName="d" dur="1.8s" repeatCount="indefinite" values="M0 32 Q-10 44 -4 56;M0 32 Q10 44 4 56;M0 32 Q-10 44 -4 56"/></path>` : ""}`;
}
function hammerArt(pal, ti) {
  return `<rect x="-3.8" y="-112" width="7.6" height="158" rx="3" fill="${pal.ac2}" stroke="${pal.ac}" stroke-width="1"/>
  <rect x="-5" y="-4" width="10" height="5" fill="#fbbf24"/><rect x="-5" y="36" width="10" height="6" fill="#fbbf24"/>
  <rect x="-30" y="-140" width="60" height="36" rx="6" fill="${ti === 0 ? "#64748b" : pal.ac}" stroke="${ti >= 4 ? "#fbbf24" : pal.m2}" stroke-width="2.5"/>
  <rect x="-32" y="-140" width="6" height="36" rx="2" fill="${ti >= 1 ? "#fbbf24" : "#94a3b8"}"/><rect x="26" y="-140" width="6" height="36" rx="2" fill="${ti >= 1 ? "#fbbf24" : "#94a3b8"}"/>
  ${ti >= 1 ? `<path d="M0 -131 L2 -126 L7 -122 L2 -118 L0 -113 L-2 -118 L-7 -122 L-2 -126Z" fill="${ti >= 2 ? pal.glow : "#fbbf24"}"/>` : ""}
  ${ti >= 2 ? `<path d="M-30 -122 l-9 4 9 4 M30 -122 l9 4 -9 4" fill="${pal.m2}" stroke="${pal.ac2}" stroke-width="1"/>` : ""}
  ${ti >= 3 ? `<path d="M-20 -108 h40" stroke="${pal.glow}" stroke-width="2" opacity=".9"/>` : ""}
  ${ti >= 4 ? `<path d="M-14 -142 Q-18 -156 -10 -164 Q-8 -152 -2 -148 Q2 -158 8 -166 Q12 -152 14 -142Z" fill="#f97316" opacity=".9"><animate attributeName="opacity" values=".5;1;.5" dur=".9s" repeatCount="indefinite"/></path>` : ""}`;
}
function artFor(type, ti, pal) {
  if (type === "sword") return swordArt(pal, ti);
  if (type === "katana") return katanaArt(pal, ti);
  if (type === "hammer") return hammerArt(pal, ti);
  const sc = type === "grimoire_float" ? 1.6 : 1.25, glowC = pal.glow || null;
  return type === "grimoire_float" ? bookArt(sc, pal, ti, glowC) : `<g transform="translate(0 -28)">${bookArt(sc, pal, ti, glowC)}</g>`;
}
/* efek rarity yang mengikuti senjata: partikel, halo (legendary+), pelangi (mythic) */
function auraLocal(type, ti, pal) {
  if (!pal.pt) return "";
  const cy = type === "grimoire_float" ? 0 : (type === "hammer" ? -80 : -60);
  const col = ti === 5 ? "" : `fill="${pal.glow}"`;
  let s = "";
  for (let i = 0; i < pal.pt; i++) {
    const x = ((i * 37) % 70) - 35, d = 1.8 + (i % 5) * .35, b = (i * .23).toFixed(2);
    s += `<circle cx="${x}" cy="${cy + 40}" r="${(1.3 + (i % 3) * .7).toFixed(1)}" ${col} opacity="0">${ti === 5 ? `<animate attributeName="fill" values="${RAINBOW}" dur="3s" repeatCount="indefinite"/>` : ""}
      <animate attributeName="cy" values="${cy + 40};${cy - 45}" dur="${d.toFixed(2)}s" begin="${b}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;.95;0" dur="${d.toFixed(2)}s" begin="${b}s" repeatCount="indefinite"/></circle>`;
  }
  if (ti >= 4) s += `<g transform="translate(0 ${cy})"><ellipse rx="52" ry="13" fill="none" stroke="${pal.glow}" stroke-width="2" stroke-dasharray="9 7" opacity=".85">
      ${ti === 5 ? `<animate attributeName="stroke" values="${RAINBOW}" dur="3s" repeatCount="indefinite"/>` : ""}
      <animate attributeName="stroke-dashoffset" values="0;-32" dur="1.6s" repeatCount="indefinite"/></ellipse></g>`;
  return s;
}

/* ------------------------------ susun layer lengkap ------------------------------ */
function darken(hex, k = .3) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex || ""); if (!m) return "#00000055";
  const n = parseInt(m[1], 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const h = v => Math.round(v * (1 - k)).toString(16).padStart(2, "0"); return "#" + h(r) + h(g) + h(b);
}
const armPath = (sx, sy, hx, hy, out) => `M${f1(sx)} ${f1(sy)} Q${f1((sx + hx) / 2 + out * 16)} ${f1((sy + hy) / 2 + 14)} ${f1(hx)} ${f1(hy)}`;
const SHL = [146, 218], SHR = [254, 218];

export function buildWeaponLayer(type, rarity, ctx = {}) {
  const sp = SPEC[type]; if (!sp) return "";
  const ti = Math.max(0, RARITIES.indexOf(rarity)), pal = PAL[rarity] || PAL.common;
  const skin = ctx.skin || "#f5d4b3", sl = ctx.sleeve || { c: "#ffffff", d: "#c7cde0" };
  const state = ctx.state || "idle", segs = segsFor(type, state);
  const D = segs.reduce((a, s) => a + s.st.period, 0), N = Math.max(12, Math.round(D * 8));
  const A = { aw: [], af: [], hwx: [], hwy: [], hfx: [], hfy: [], wt: [], wr: [], fo: [], fs: [], orb: [], orbo: [] };
  const wSh = sp.side === "R" ? SHR : SHL, fSh = sp.side === "R" ? SHL : SHR, out = sp.side === "R" ? 1 : -1;
  const winp = sp.win;
  let fxPts = [];
  for (let i = 0; i <= N; i++) {
    const t = D * i / N, { P, n, p } = poseAt(type, segs, t);
    const wh = { x: P.wx, y: P.wy, rot: P.wr }; let fh = { x: P.fx, y: P.fy };
    if (P.two > 0) { const g = loc(wh, 0, P.g2); fh = { x: lerp(fh.x, g.x, P.two), y: lerp(fh.y, g.y, P.two) }; }
    A.aw.push(armPath(wSh[0], wSh[1], wh.x, wh.y, out)); A.af.push(armPath(fSh[0], fSh[1], fh.x, fh.y, -out));
    A.hwx.push(f1(wh.x)); A.hwy.push(f1(wh.y)); A.hfx.push(f1(fh.x)); A.hfy.push(f1(fh.y));
    if (type === "grimoire_float") { A.wt.push(`200 ${f1(P.by)}`); A.wr.push("0 0 0"); } else { A.wt.push(`${f1(wh.x)} ${f1(wh.y)}`); A.wr.push(`${f1(wh.rot)} 0 0`); }
    const inWin = n === "attack" && p > winp[0] && p < winp[1], u = inWin ? (p - winp[0]) / (winp[1] - winp[0]) : 0;
    A.fo.push(f1(inWin ? Math.sin(Math.PI * u) : 0).replace(/^0$/, "0")); A.fs.push(f1(.25 + u * .95));
    A.orb.push(`${f1(fh.x)} ${f1(fh.y - 14)}`); A.orbo.push(n === "attack" ? ".95" : n === "ready" ? ".8" : ".45");
  }
  if (TIP[type]) {                                  // jejak ujung bilah, disampel halus pada jendela tebasan
    const fr = sp.attack.frames;
    for (let k = 0; k <= 18; k++) {
      const P = track(winp[0] + (winp[1] - winp[0]) * k / 18, fr), tp = loc({ x: P.wx, y: P.wy, rot: P.wr }, 0, -TIP[type]); fxPts.push([tp.x, tp.y]);
    }
  }
  const dur = `dur="${D.toFixed(2)}s" repeatCount="indefinite"`;
  const an = (attr, arr) => `<animate attributeName="${attr}" values="${arr.join(";")}" ${dur}/>`;
  const gc = ti === 5 ? "" : (pal.glow || "");
  const filt = pal.gl ? `<filter id="wa-f-${rarity}" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="0" stdDeviation="${pal.gl}" flood-color="${pal.glow}" flood-opacity=".95">${ti === 5 ? `<animate attributeName="flood-color" values="${RAINBOW}" dur="3s" repeatCount="indefinite"/>` : ""}</feDropShadow></filter>` : "";

  const arm = (key, o) => `<path d="${A[key][0]}" stroke="${sl.d}" stroke-width="24" fill="none" stroke-linecap="round">${an("d", A[key])}</path><path d="${A[key][0]}" stroke="${sl.c}" stroke-width="20" fill="none" stroke-linecap="round">${an("d", A[key])}</path>`;
  const hand = (cxk, cyk) => sp.palm
    ? `<ellipse rx="13" ry="7" cx="${A[cxk][0]}" cy="${A[cyk][0]}" fill="${skin}" stroke="${darken(skin, .25)}" stroke-width="1.2">${an("cx", A[cxk])}${an("cy", A[cyk])}</ellipse>`
    : `<circle r="10.5" cx="${A[cxk][0]}" cy="${A[cyk][0]}" fill="${skin}">${an("cx", A[cxk])}${an("cy", A[cyk])}</circle>`;

  /* efek serangan: tebasan (sword/katana), dentuman (hammer), ledakan sihir (grimoire) */
  let fx = "";
  const fadeG = (inner, extra = "") => `<g opacity="0">${an("opacity", A.fo)}${extra}${inner}</g>`;
  if (type === "sword" || type === "katana") {
    if (fxPts.length > 2) {
      const d = "M" + fxPts.map(q => `${f1(q[0])} ${f1(q[1])}`).join(" L");
      const c1 = ti === 5 ? "#fda4af" : (pal.glow || "#bae6fd");
      fx = fadeG(`<path d="${d}" stroke="${c1}" stroke-width="14" fill="none" stroke-linecap="round" opacity=".55"/><path d="${d}" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`);
    }
  } else {
    const [cx, cy, R] = type === "hammer" ? [228, 450, 110] : type === "grimoire_float" ? [200, 214, 130] : [346, 202, 90];
    const col = pal.glow || (type === "hammer" ? "#fde68a" : "#c4b5fd");
    let ray = ""; for (let i = 0; i < 12; i++) { const a = rad(i * 30); ray += `<line x1="${f1(Math.cos(a) * R * .45)}" y1="${f1(Math.sin(a) * R * .45)}" x2="${f1(Math.cos(a) * R)}" y2="${f1(Math.sin(a) * R)}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`; }
    const sc = `<animateTransform attributeName="transform" type="scale" values="${A.fs.join(";")}" ${dur}/>`;
    fx = `<g transform="translate(${cx} ${cy})"><g opacity="0">${an("opacity", A.fo)}<g>${sc}${ray}<circle r="${R * .85}" fill="none" stroke="#fff" stroke-width="3"/></g></g></g>`;
  }
  const orb = type === "grimoire_held"
    ? `<g><animateTransform attributeName="transform" type="translate" values="${A.orb.join(";")}" ${dur}/><circle r="15" fill="${pal.glow || "#8b5cf6"}" opacity=".4"><animate attributeName="r" values="12;17;12" dur="1.2s" repeatCount="indefinite"/></circle><circle r="7" fill="#ede9fe"/></g>` : "";

  const weaponG = `<g><animateTransform attributeName="transform" type="translate" values="${A.wt.join(";")}" ${dur}/>
    <g><animateTransform attributeName="transform" type="rotate" values="${A.wr.join(";")}" ${dur}/>
      <g ${pal.gl ? `filter="url(#wa-f-${rarity})"` : ""}>${artFor(type, ti, pal)}</g>${auraLocal(type, ti, pal)}</g></g>`;
  const ring = type === "grimoire_float" ? `<g><animateTransform attributeName="transform" type="translate" values="${A.wt.join(";")}" ${dur}/>
    <ellipse cy="46" rx="72" ry="15" fill="none" stroke="${pal.glow || "#a78bfa"}" stroke-width="2.5" stroke-dasharray="10 8" opacity=".85"><animate attributeName="stroke-dashoffset" values="0;-36" dur="2s" repeatCount="indefinite"/></ellipse>
    <ellipse cy="46" rx="52" ry="10" fill="none" stroke="#ddd6fe" stroke-width="1.8" stroke-dasharray="4 7" opacity=".8"><animate attributeName="stroke-dashoffset" values="0;22" dur="1.4s" repeatCount="indefinite"/></ellipse></g>` : "";
  void gc;
  return `<defs>${filt}</defs><g data-wa="${type}" data-rarity="${rarity}" data-state="${state}">
    ${arm("aw")}${arm("af")}${ring}${weaponG}${hand("hwx", "hwy")}${hand("hfx", "hfy")}${orb}${fx}</g>`;
}

/* ------------------------------ integrasi ke renderCharacter ------------------------------ */
/* buang lengan/tangan statis bawaan agar tidak dobel dengan lengan berpose */
const SLV_L = "M135 205 Q110 240 115 300 L135 330 L145 325 L140 295 Q145 240 155 215 Z";
const SLV_R = "M265 205 Q290 240 285 300 L265 330 L255 325 L260 295 Q255 240 245 215 Z";
const SH_L = "M135 203 Q114 222 110 256 L145 264 Q146 236 156 214 Z", SH_R = "M265 203 Q286 222 290 256 L255 264 Q254 236 244 214 Z";
const FA_L = "M116 252 Q112 285 115 300 L135 330 L145 325 L140 295 Q141 272 142 258 Z", FA_R = "M284 252 Q288 285 285 300 L265 330 L255 325 L260 295 Q259 272 258 258 Z";
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function stripArms(svg) {
  if (!svg) return svg;
  for (const d of [SLV_L, SLV_R, SH_L, SH_R, FA_L, FA_R]) svg = svg.replace(new RegExp(`<path d="${esc(d)}"[^>]*/>`, "g"), "");
  return svg.replace(/<circle cx="(?:123|277)" cy="325" r="11"[^>]*\/>/g, "");
}
function sleeveOf(overlaySvg) {
  const m = /d="M135 200 Q200 180 265 200 L270 345 L130 345 Z"[^>]*?fill="(#[0-9a-fA-F]{3,8})"(?:[^>]*?stroke="(#[0-9a-fA-F]{3,8})")?/.exec(overlaySvg || "");
  if (m) return { c: m[1], d: m[2] || darken(m[1], .35) };
  return { c: "#ffffff", d: "#c7cde0" };
}
export function animTypeOf(item) { return item && item.animType && SPEC[item.animType] ? item.animType : null; }

/* dipanggil renderCharacter bila senjata ber-animType. Mengembalikan base/overlay tanpa lengan statis + layer senjata. */
export function applyWeaponPose({ item, base, pakaianOverlay, skin, state }) {
  const type = animTypeOf(item); if (!type) return null;
  return {
    base: stripArms(base), pakaianOverlay: stripArms(pakaianOverlay),
    handheld: buildWeaponLayer(type, item.rarity, { skin, sleeve: sleeveOf(pakaianOverlay), state }),
  };
}

/* ------------------------------ katalog: 5 tipe × 6 rarity ------------------------------ */
const NAMES = {
  sword:          ["Pedang Besi Latihan", "Pedang Zamrud Hutan", "Pedang Safir Ksatria", "Pedang Arcane Amethyst", "Pedang Surya Legendaris", "Pedang Mythic Aurora"],
  katana:         ["Katana Latihan Dojo", "Katana Giok Hijau", "Katana Safir Biru", "Katana Ametis Kegelapan", "Katana Emas Kenjutsu", "Katana Mythic Bulan Merah"],
  hammer:         ["Palu Tukang Besi", "Palu Zamrud Bumi", "Palu Baja Safir", "Palu Petir Ungu", "Palu Dewa Emas", "Palu Mythic Matahari"],
  grimoire_held:  ["Grimoire Dasar", "Grimoire Zamrud", "Grimoire Safir", "Grimoire Arcane Ungu", "Grimoire Emas Legendaris", "Grimoire Mythic Bintang"],
  grimoire_float: ["Buku Terbang Dasar", "Buku Terbang Zamrud", "Buku Terbang Safir", "Buku Terbang Arcane", "Buku Terbang Emas Legendaris", "Buku Terbang Mythic Galaksi"],
};
const ICON = { sword: "🗡️", katana: "⚔️", hammer: "🔨", grimoire_held: "📖", grimoire_float: "📘" };
const RT = { common: [[400, 1500], 1], uncommon: [[2500, 5000], 10], rare: [[9000, 16000], 25], epic: [[25000, 36000], 50], legendary: [[50000, 80000], 80], mythic: [[100000, 130000], 90] };
const TYPES = ["grimoire_held", "grimoire_float", "hammer", "sword", "katana"];
export const WEAPON_ANIM_TYPES = TYPES;

export function extendWeaponAnim(C) {
  TYPES.forEach((type, k) => {
    RARITIES.forEach((rar, ti) => {
      const [[a, b], lv] = RT[rar], harga = Math.round((a + (b - a) * (k / (TYPES.length - 1))) / 50) * 50;
      C.HANDHELD[`wa_${type}_${rar}`] = {
        nama: `${ICON[type]} ${NAMES[type][ti]}`, rarity: rar, harga, unlock_lv: lv, animType: type,
        svg: () => buildWeaponLayer(type, rar, {}),
      };
    });
  });
}
