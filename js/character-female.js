/* ========================================================================
   KARAKTER CEWE + koleksi cewek (rambut, jepit, anting, aksesori, gaun, rok, heels)
   - Badan cewek = warp koordinat SVG (wajah tirus, bahu kecil, dada, pinggang ramping, pinggul).
     Semua item (baju/rambut/aksesori) ikut ter-warp otomatis sehingga tetap pas.
   - "Tidak memakai" = kosongkan slot (tidak ada item), bukan telanjang.
   ======================================================================== */
import { H } from "./character-more.js";
const { build, SK } = H;

/* ---------- profil lebar (skala X terhadap sumbu x=200) per tinggi y ---------- */
const PROF = [[0, 1], [60, 1], [100, 1.03], [135, 1.04], [165, .98], [180, .8], [192, .6], [198, .6], [208, .62], [222, .72], [240, .8], [262, .62], [284, .5], [310, .66], [334, .79], [352, .83], [390, .78], [999, .75]];
const fy = (y) => { for (let i = 1; i < PROF.length; i++) if (y <= PROF[i][0]) { const [y0, f0] = PROF[i - 1], [y1, f1] = PROF[i]; return f0 + (f1 - f0) * (y - y0) / (y1 - y0); } return 1; };
const wx = (x, y) => {   // lengan (jauh dari sumbu) ikut lebih sedikit supaya tidak menyusut ke badan
  const f = fy(y), k = Math.min(1, Math.max(0, (y - 235) / 80)), dx = Math.abs(x - 200), t = Math.min(1, Math.max(0, (dx - 58) / 30));
  return 200 + (x - 200) * (f * (1 - t) + (f * (1 - k) + .9 * k) * t);
};
const r2 = (n) => Math.round(n * 10) / 10;
const attr = (t, k) => { const m = t.match(new RegExp("\\s" + k + '="([^"]*)"')); return m ? parseFloat(m[1]) : NaN; };
const dropAttr = (t, ks) => ks.reduce((s, k) => s.replace(new RegExp("\\s" + k + '="[^"]*"'), ""), t);

export function femWarp(svg) {
  if (!svg) return svg;
  return svg.replace(/<(path|ellipse|circle|rect|line)\b[^>]*>/g, (tag, name) => {
    if (name === "path") {
      const m = tag.match(/\sd="([^"]*)"/); if (!m) return tag;
      const d = m[1];
      const toks = d.match(/[A-Za-z]|-?\d*\.?\d+(?:[eE][+-]?\d+)?/g) || []; let i = 0, out = "", cx = 0, cy = 0, sx = 0, sy = 0, lq = null, lc = null;
      const P = (x, y) => r2(wx(x, y)) + " " + r2(y) + " ";
      const line = (x1, y1) => { const n = Math.max(1, Math.ceil(Math.hypot(x1 - cx, y1 - cy) / 6)); for (let k = 1; k <= n; k++) out += "L" + P(cx + (x1 - cx) * k / n, cy + (y1 - cy) * k / n); cx = x1; cy = y1; };
      const num = () => parseFloat(toks[i++]), more = () => i < toks.length && !/[A-Za-z]/.test(toks[i]);
      const quad = (x1, y1, x2, y2) => { const x0 = cx, y0 = cy; for (let k = 1; k <= 10; k++) { const t = k / 10, u = 1 - t; out += "L" + P(u * u * x0 + 2 * u * t * x1 + t * t * x2, u * u * y0 + 2 * u * t * y1 + t * t * y2); } cx = x2; cy = y2; lq = [x1, y1]; lc = null; };
      const cub = (x1, y1, x2, y2, x3, y3) => { const x0 = cx, y0 = cy; for (let k = 1; k <= 12; k++) { const t = k / 12, u = 1 - t; out += "L" + P(u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3, u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3); } cx = x3; cy = y3; lc = [x2, y2]; lq = null; };
      while (i < toks.length) {
        const c0 = toks[i++], c = c0.toUpperCase(), rel = c0 !== c, ox = rel ? cx : 0, oy = rel ? cy : 0;
        if (c === "M") { let first = true; while (more()) { const x = num() + ox, y = num() + oy; if (first) { cx = sx = x; cy = sy = y; out += "M" + P(x, y); first = false; } else line(x, y); } lq = lc = null; }
        else if (c === "L") { while (more()) { const x = num() + (rel ? cx : 0), y = num() + (rel ? cy : 0); line(x, y); } lq = lc = null; }
        else if (c === "H") { while (more()) { const x = num() + (rel ? cx : 0); line(x, cy); } lq = lc = null; }
        else if (c === "V") { while (more()) { const y = num() + (rel ? cy : 0); line(cx, y); } lq = lc = null; }
        else if (c === "Q") { while (more()) { const bx = cx, by = cy; quad(num() + (rel ? bx : 0), num() + (rel ? by : 0), num() + (rel ? bx : 0), num() + (rel ? by : 0)); } }
        else if (c === "T") { while (more()) { const bx = cx, by = cy, x1 = lq ? 2 * cx - lq[0] : cx, y1 = lq ? 2 * cy - lq[1] : cy; quad(x1, y1, num() + (rel ? bx : 0), num() + (rel ? by : 0)); } }
        else if (c === "C") { while (more()) { const bx = cx, by = cy; cub(num() + (rel ? bx : 0), num() + (rel ? by : 0), num() + (rel ? bx : 0), num() + (rel ? by : 0), num() + (rel ? bx : 0), num() + (rel ? by : 0)); } }
        else if (c === "S") { while (more()) { const bx = cx, by = cy, x1 = lc ? 2 * cx - lc[0] : cx, y1 = lc ? 2 * cy - lc[1] : cy; cub(x1, y1, num() + (rel ? bx : 0), num() + (rel ? by : 0), num() + (rel ? bx : 0), num() + (rel ? by : 0)); } }
        else if (c === "A") { while (more()) { i += 5; line(num() + (rel ? cx : 0), num() + (rel ? cy : 0)); } lq = lc = null; }   // busur → garis lurus (jarang dipakai)
        else if (c === "Z") { line(sx, sy); out += "Z"; lq = lc = null; }
      }
      return tag.replace(m[0], ` d="${out.trim()}"`);
    }
    if (name === "line") {
      const x1 = attr(tag, "x1"), y1 = attr(tag, "y1"), x2 = attr(tag, "x2"), y2 = attr(tag, "y2"); if ([x1, y1, x2, y2].some(isNaN)) return tag;
      return tag.replace(/\sx1="[^"]*"/, ` x1="${r2(wx(x1, y1))}"`).replace(/\sx2="[^"]*"/, ` x2="${r2(wx(x2, y2))}"`);
    }
    if (name === "rect") {
      const x = attr(tag, "x"), y = attr(tag, "y"), w = attr(tag, "width"), h = attr(tag, "height");
      if ([x, y, w, h].some(isNaN)) return tag;
      const f = fy(y + h / 2); const nx = 200 + (x - 200) * f;
      return tag.replace(/\sx="[^"]*"/, ` x="${r2(nx)}"`).replace(/\swidth="[^"]*"/, ` width="${r2(w * f)}"`);
    }
    const cx = attr(tag, "cx"), cy = attr(tag, "cy"); if (isNaN(cx) || isNaN(cy)) return tag;
    const rx = name === "circle" ? attr(tag, "r") : attr(tag, "rx"), ry = name === "circle" ? rx : attr(tag, "ry");
    if (isNaN(rx) || isNaN(ry)) return tag;
    if (Math.max(rx, ry) > 24) {                                              // bentuk besar → poligon agar ikut melengkung
      let d = ""; for (let i = 0; i < 32; i++) { const a = i / 32 * Math.PI * 2, px = cx + rx * Math.cos(a), py = cy + ry * Math.sin(a); d += (i ? "L" : "M") + r2(wx(px, py)) + " " + r2(py) + " "; }
      return dropAttr(tag.replace(/^<\w+/, "<path"), ["cx", "cy", "rx", "ry", "r"]).replace(/\s*\/?>$/, ` d="${d}Z"/>`);
    }
    const f = fy(cy); let t = tag.replace(/\scx="[^"]*"/, ` cx="${r2(200 + (cx - 200) * f)}"`);
    if (name === "ellipse") t = t.replace(/\srx="[^"]*"/, ` rx="${r2(rx * f)}"`);
    return t;
  });
}

/* ---------- detail wajah & dada (koordinat SETELAH warp) ---------- */
export const femFace = (blush = "#f4a3b5") => `<g data-slot="wajah-cewek">
  <ellipse cx="177" cy="132" rx="9" ry="11" fill="#fff"/><ellipse cx="223" cy="132" rx="9" ry="11" fill="#fff"/>
  <ellipse cx="177" cy="134" rx="6.6" ry="8.6" fill="#3b5bdb"/><ellipse cx="223" cy="134" rx="6.6" ry="8.6" fill="#3b5bdb"/>
  <ellipse cx="177" cy="135" rx="3.2" ry="5" fill="#0f172a"/><ellipse cx="223" cy="135" rx="3.2" ry="5" fill="#0f172a"/>
  <circle cx="174" cy="130" r="2.6" fill="#fff"/><circle cx="220" cy="130" r="2.6" fill="#fff"/><circle cx="180" cy="138" r="1.3" fill="#fff"/><circle cx="226" cy="138" r="1.3" fill="#fff"/>
  <path d="M166 127 Q177 117 188 126" stroke="#1a1008" stroke-width="3.4" fill="none" stroke-linecap="round"/>
  <path d="M212 126 Q223 117 234 127" stroke="#1a1008" stroke-width="3.4" fill="none" stroke-linecap="round"/>
  <path d="M166 127 L160 123 M166 130 L160 130 M234 127 L240 123 M234 130 L240 130" stroke="#1a1008" stroke-width="2" stroke-linecap="round"/>
  <path d="M168 110 Q177 106 186 110 M214 110 Q223 106 232 110" stroke="#4a2c17" stroke-width="2" fill="none" stroke-linecap="round"/>
  <ellipse cx="166" cy="149" rx="8" ry="4.5" fill="${blush}" opacity=".45"/><ellipse cx="234" cy="149" rx="8" ry="4.5" fill="${blush}" opacity=".45"/>
  <path d="M192 158 Q200 167 208 158 Q200 161 192 158Z" fill="#e0607e"/></g>`;
export const femBust = "";   // tanpa garis dada — lekuk badan cukup dari siluet

/* ---------- RAMBUT ---------- */
const cap = (c) => `<path d="M146 152 Q138 58 200 53 Q262 58 254 152 L246 152 L246 103 Q200 110 154 103 L154 152Z" fill="${c}"/><path d="M164 100 Q200 106 236 100" stroke="#fff" stroke-opacity=".14" stroke-width="2" fill="none"/>`;
const sideL = (c, y, w = 20) => `<path d="M147 110 Q${132 - 0} ${(110 + y) / 2} ${138} ${y} L${138 + w} ${y - 4} Q${158} ${(110 + y) / 2} 162 128Z" fill="${c}"/>`;
const sideR = (c, y, w = 20) => `<path d="M253 110 Q268 ${(110 + y) / 2} 262 ${y} L${262 - w} ${y - 4} Q242 ${(110 + y) / 2} 238 128Z" fill="${c}"/>`;
const tie = (x, y, c = "#ef6a9a") => `<circle cx="${x}" cy="${y}" r="6" fill="${c}"/>`;
const wavy = (c, y) => `<path d="M147 110 Q128 170 140 ${y - 30} Q126 ${y - 10} 144 ${y} Q150 ${y - 14} 160 ${y - 4} Q156 190 162 128Z" fill="${c}"/><path d="M253 110 Q272 170 260 ${y - 30} Q274 ${y - 10} 256 ${y} Q250 ${y - 14} 240 ${y - 4} Q244 190 238 128Z" fill="${c}"/>`;
const HAIR = [
  ["lurus_panjang", "Rambut Panjang Lurus", "common", (c = "#1a1008") => sideL(c, 300) + sideR(c, 300) + cap(c)],
  ["bob_pendek", "Rambut Bob", "common", (c = "#1a1008") => sideL(c, 182, 24) + sideR(c, 182, 24) + cap(c)],
  ["pixie", "Rambut Pixie Pendek", "common", (c = "#1a1008") => sideL(c, 150, 14) + sideR(c, 150, 14) + cap(c)],
  ["ponytail", "Ekor Kuda", "common", (c = "#1a1008") => `<path d="M248 98 Q306 104 300 190 Q294 252 268 296 Q276 232 262 192 Q250 152 244 124Z" fill="${c}"/>` + sideL(c, 140, 12) + sideR(c, 140, 12) + cap(c) + tie(250, 100)],
  ["gelombang", "Rambut Panjang Bergelombang", "uncommon", (c = "#3a2518") => wavy(c, 310) + cap(c)],
  ["kuncir_dua", "Kuncir Dua", "uncommon", (c = "#1a1008") => `<path d="M152 106 Q96 130 100 205 Q104 258 124 284 Q130 224 140 192 Q152 152 158 122Z" fill="${c}"/><path d="M248 106 Q304 130 300 205 Q296 258 276 284 Q270 224 260 192 Q248 152 242 122Z" fill="${c}"/>` + cap(c) + tie(152, 104) + tie(248, 104)],
  ["cepol_atas", "Cepol Bun Atas", "uncommon", (c = "#1a1008") => sideL(c, 136, 12) + sideR(c, 136, 12) + cap(c) + `<circle cx="200" cy="44" r="21" fill="${c}"/>` + tie(200, 62, "#ef6a9a")],
  ["odango", "Odango Dua Cepol", "rare", (c = "#1a1008") => sideL(c, 140, 12) + sideR(c, 140, 12) + cap(c) + `<circle cx="158" cy="58" r="19" fill="${c}"/><circle cx="242" cy="58" r="19" fill="${c}"/>` + tie(165, 72) + tie(235, 72)],
  ["kepang_samping", "Kepang Samping", "rare", (c = "#3a2518") => sideL(c, 180, 14) + cap(c) + [0, 1, 2, 3, 4, 5].map(i => `<ellipse cx="${262 + (i % 2 ? 4 : -2)}" cy="${150 + i * 26}" rx="12" ry="14" fill="${c}" stroke="#00000033" stroke-width="1.5"/>`).join("") + tie(262, 300)],
  ["hime", "Rambut Hime Poni Lurus", "epic", (c = "#1a1008") => sideL(c, 320, 22) + sideR(c, 320, 22) + `<path d="M147 128 Q139 60 200 55 Q261 60 253 128 L246 108 L246 112 L154 112 L153 128Z" fill="${c}"/><path d="M158 112 H242" stroke="#fff" stroke-opacity=".15" stroke-width="2"/>`],
  ["twin_bergelombang_pink", "Rambut Pink Pastel Gelombang", "epic", (c = "#f9a8d4") => wavy(c, 320) + cap(c) + `<circle cx="236" cy="82" r="5" fill="#fff"/>`],
  ["putri_panjang", "Rambut Putri Panjang Berkilau", "legendary", (c = "#fde68a") => wavy(c, 340) + cap(c) + `<path d="M170 80 Q200 70 230 80" stroke="#fff" stroke-opacity=".5" stroke-width="3" fill="none"/>`],
];

/* ---------- JEPIT RAMBUT (slot baru) ---------- */
const JP = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})">`;
const JEPIT = [
  ["pita", "Jepit Pita Kecil", "common", () => `<path d="M228 92 l-14 -8 v16z M228 92 l14 -8 v16z" fill="#ef6a9a"/><circle cx="228" cy="92" r="3.5" fill="#be185d"/>`],
  ["hati", "Jepit Hati", "common", () => `<path d="M230 98 q-12 -10 -4 -17 q4 -3 4 2 q0 -5 4 -2 q8 7 -4 17z" fill="#f43f5e"/>`],
  ["bintang", "Jepit Bintang Kuning", "common", () => `<path d="M230 80 l3.5 8 8.5 1 -6.4 5.8 1.9 8.5 -7.5 -4.5 -7.5 4.5 1.9 -8.5 -6.4 -5.8 8.5 -1z" fill="#fde047" stroke="#ca8a04" stroke-width="1.2"/>`],
  ["bunga", "Jepit Bunga Sakura", "uncommon", () => `<g transform="translate(232 90)">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-7" rx="4.6" ry="6" fill="#fbcfe8" transform="rotate(${a})"/>`).join("")}<circle r="3" fill="#f59e0b"/></g>`],
  ["kupu", "Jepit Kupu-kupu", "uncommon", () => `<g transform="translate(232 90)"><ellipse cx="-7" cy="-4" rx="7" ry="5" fill="#a78bfa" transform="rotate(-25 -7 -4)"/><ellipse cx="7" cy="-4" rx="7" ry="5" fill="#a78bfa" transform="rotate(25 7 -4)"/><ellipse cx="-5" cy="5" rx="5" ry="4" fill="#c4b5fd"/><ellipse cx="5" cy="5" rx="5" ry="4" fill="#c4b5fd"/><rect x="-1" y="-6" width="2" height="14" fill="#4c1d95"/></g>`],
  ["x_hitam", "Jepit Silang X (sepasang)", "uncommon", () => `<g stroke="#111827" stroke-width="3" stroke-linecap="round"><path d="M160 84 l14 8 M160 92 l14 -8 M226 84 l14 8 M226 92 l14 -8"/></g>`],
  ["cherry", "Jepit Cherry Merah", "rare", () => `<path d="M226 80 q6 14 -2 20 M236 82 q-2 12 6 18" stroke="#166534" stroke-width="2" fill="none"/><circle cx="224" cy="102" r="6" fill="#dc2626"/><circle cx="242" cy="102" r="6" fill="#dc2626"/><circle cx="222" cy="100" r="1.6" fill="#fff" opacity=".7"/>`],
  ["permata", "Jepit Permata Biru", "epic", () => `<path d="M222 90 l8 -10 8 10 -8 14z" fill="#38bdf8" stroke="#0369a1" stroke-width="1.5"/><path d="M222 90 h16 M230 80 v24" stroke="#e0f2fe" stroke-width="1"/>`],
  ["mahkota_mini", "Jepit Mahkota Mini Emas", "legendary", () => `<path d="M218 98 l2 -14 6 7 4 -10 4 10 6 -7 2 14z" fill="#facc15" stroke="#a16207" stroke-width="1.4"/><circle cx="230" cy="92" r="2" fill="#ef4444"/>`],
];


/* ---------- PONI (slot baru, hanya cewek) — dijual Rp-koin 1.000 per poni, warna ikut rambut ---------- */
const P1000 = { harga: 1000, _rp: 1 };   // _rp: lewati penyesuaian harga global (tetap 1.000 koin)
/* satu helai: pangkal lebar, ujung dipotong miring (kepotong sedikit), garis tengah + kilau */
const lock = (c, xt, yt, xb, yb, w = 7, cut = 2.5) => {
  const mx = (xt + xb) / 2 + (xb - xt) * .12, my = (yt + yb) / 2, y0 = yt + (yb - yt) * .3;
  return `<path d="M${xt - w} ${yt} Q${mx - w} ${my} ${xb - cut} ${yb} L${xb + cut + 1.5} ${yb - 2.5} Q${mx + w} ${my} ${xt + w} ${yt}Z" fill="${c}"/>`
    + `<path d="M${xt + w * .35} ${y0} Q${mx + w * .35} ${my + 4} ${xb + 1} ${yb - 4}" stroke="#000" stroke-opacity=".2" stroke-width="1.1" fill="none" stroke-linecap="round"/>`
    + `<path d="M${xt - w * .5} ${y0 + 2} Q${mx - w * .5} ${my + 4} ${xb - cut * .7} ${yb - 6}" stroke="#fff" stroke-opacity=".2" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
};
const JIT = [0, -5, 3, -3, 5, -6, 2];
const fan = (c, n, x0, x1, yt, yb, lean = .06, w = 8, jit = JIT) => { let o = ""; for (let i = 0; i < n; i++) { const xt = x0 + (x1 - x0) * i / (n - 1); o += lock(c, xt, yt, xt + (200 - xt) * lean, yb + jit[i % jit.length], w); } return o; };
const topFill = (c, y = 92) => `<path d="M152 ${y} Q145 62 200 53 Q255 62 248 ${y}Z" fill="${c}"/>`;
const swept = (c, n, x0, x1, yt, yb0, yb1, dx, w = 8) => { let o = ""; for (let i = 0; i < n; i++) { const t = n > 1 ? i / (n - 1) : 0, xt = x0 + (x1 - x0) * t; o += lock(c, xt, yt, xt + dx, yb0 + (yb1 - yb0) * t + JIT[i % JIT.length], w); } return o; };
/* curtain: belah tengah, helai menyapu ke kiri dan kanan */
const curtain = (c, yEnd, n = 5) => {
  let o = topFill(c, 80);
  for (let i = n - 1; i >= 0; i--) { const t = i / (n - 1), j = JIT[i % JIT.length], yb = 108 + (yEnd - 108) * t + j;
    o += lock(c, 190 - 30 * t, 66, 182 - 44 * t, yb, 10, 3) + lock(c, 210 + 30 * t, 66, 218 + 44 * t, yb - j * .6 + 2, 10, 3); }
  return o;
};
const PONI = [
  ["lurus", "Poni Depan Lurus", "common", (c = "#3a2518") => topFill(c) + fan(c, 9, 156, 244, 66, 116, .05, 8), P1000],
  ["tipis", "Poni Tipis (See-through)", "common", (c = "#3a2518") => topFill(c, 88) + fan(c, 8, 158, 242, 70, 112, .06, 5.5, [0, -6, 3, -4, 6, -2, 4, -5]), P1000],
  ["curtain", "Poni Curtain Kiri-Kanan", "common", (c = "#3a2518") => curtain(c, 168), P1000],
  ["curtain_panjang", "Poni Curtain Panjang", "common", (c = "#3a2518") => curtain(c, 196, 6), P1000],
  ["samping", "Poni Samping Menyapu", "common", (c = "#3a2518") => topFill(c, 88) + swept(c, 8, 162, 246, 66, 106, 136, -34), P1000],
  ["miring", "Poni Miring Asimetris", "common", (c = "#3a2518") => topFill(c, 88) + swept(c, 9, 156, 244, 66, 120, 100, -14, 7.5), P1000],
  ["hime", "Poni Hime + Sisi Panjang", "common", (c = "#3a2518") => topFill(c) + fan(c, 9, 156, 244, 66, 116, .05, 8) + lock(c, 152, 90, 144, 226, 9, 3) + lock(c, 160, 96, 158, 220, 6, 2.5) + lock(c, 248, 90, 256, 226, 9, 3) + lock(c, 240, 96, 242, 220, 6, 2.5), P1000],
  ["pendek", "Poni Pendek (Baby Bangs)", "common", (c = "#3a2518") => topFill(c, 84) + fan(c, 9, 156, 244, 66, 98, .03, 8, [0, -3, 2, -2, 3]), P1000],
  ["gerigi", "Poni Bergerigi (Choppy)", "common", (c = "#3a2518") => topFill(c, 88) + fan(c, 11, 154, 246, 66, 112, .08, 6.5, [0, -9, 4, -6, 8, -11, 2, -7]), P1000],
];

/* ---------- ANTING (slot baru) — telinga di x=148 / 252, y=135 ---------- */
const ear = (f) => f(148, 145) + f(252, 145);
const ANTING = [
  ["mutiara", "Anting Mutiara", "common", () => ear((x, y) => `<circle cx="${x}" cy="${y}" r="4.5" fill="#fff" stroke="#cbd5e1" stroke-width="1"/><circle cx="${x - 1.4}" cy="${y - 1.4}" r="1.2" fill="#fff"/>`)],
  ["hati", "Anting Hati Pink", "common", () => ear((x, y) => `<path d="M${x} ${y + 10} q-8 -7 -3 -12 q3 -2 3 1 q0 -3 3 -1 q5 5 -3 12z" fill="#f43f5e"/>`)],
  ["bintang", "Anting Bintang", "common", () => ear((x, y) => `<path d="M${x} ${y - 1} l2 5 5 .5 -4 3.5 1.2 5 -4.2 -2.8 -4.2 2.8 1.2 -5 -4 -3.5 5 -.5z" fill="#fde047" stroke="#ca8a04" stroke-width=".8"/>`)],
  ["cincin", "Anting Cincin Besar", "uncommon", () => ear((x, y) => `<circle cx="${x}" cy="${y + 8}" r="9" fill="none" stroke="#f59e0b" stroke-width="2.6"/>`)],
  ["tetes_kristal", "Anting Tetes Kristal", "uncommon", () => ear((x, y) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#94a3b8"/><path d="M${x} ${y + 2} v6 M${x} ${y + 8} l-4 6 4 7 4 -7z" stroke="#0284c7" stroke-width="1" fill="#7dd3fc"/>`)],
  ["bunga", "Anting Bunga", "rare", () => ear((x, y) => `<g transform="translate(${x} ${y + 6})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-5" rx="3.4" ry="4.6" fill="#f9a8d4" transform="rotate(${a})"/>`).join("")}<circle r="2.2" fill="#fde047"/></g>`)],
  ["bulan_sabit", "Anting Bulan Sabit", "rare", () => ear((x, y) => `<path d="M${x} ${y} v5 M${x - 6} ${y + 6} a8 8 0 1 0 12 3 a6 6 0 1 1 -12 -3z" fill="#fde68a" stroke="#d97706" stroke-width="1"/>`)],
  ["permata_merah", "Anting Permata Ruby", "epic", () => ear((x, y) => `<path d="M${x} ${y} v4 M${x - 5} ${y + 8} l5 -4 5 4 -5 10z" fill="#dc2626" stroke="#7f1d1d" stroke-width="1"/>`)],
  ["sayap_malaikat", "Anting Sayap Malaikat", "legendary", () => ear((x, y) => `<path d="M${x} ${y} v4 M${x} ${y + 6} q-12 -4 -10 8 q6 -2 10 -2 q4 0 10 2 q2 -12 -10 -8z" fill="#fff" stroke="#fbbf24" stroke-width="1.2"/>`)],
];

/* ---------- AKSESORI CUTE (slot aksesori lama) ---------- */
const ACC = [
  ["choker_pita", "Choker Pita Pink", "common", () => `<path d="M182 192 Q200 204 218 192" stroke="#ef6a9a" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M200 202 l-9 -7 v14z M200 202 l9 -7 v14z" fill="#ec4899"/>`],
  ["bando_pink", "Bando Pink", "common", () => `<path d="M152 106 Q200 40 248 106" stroke="#f472b6" stroke-width="7" fill="none" stroke-linecap="round"/>`],
  ["pita_besar", "Pita Besar di Kepala", "uncommon", () => `<path d="M200 66 l-30 -22 v40z M200 66 l30 -22 v40z" fill="#ef4444" stroke="#991b1b" stroke-width="2"/><circle cx="200" cy="66" r="7" fill="#b91c1c"/>`],
  ["telinga_kucing", "Bando Telinga Kucing", "uncommon", () => `<path d="M152 106 Q200 44 248 106" stroke="#374151" stroke-width="5" fill="none"/><path d="M158 92 L152 50 L184 72z M242 92 L248 50 L216 72z" fill="#374151" stroke="#111827" stroke-width="2"/><path d="M160 80 L158 62 L172 72z M240 80 L242 62 L228 72z" fill="#f9a8d4"/>`],
  ["telinga_kelinci", "Bando Telinga Kelinci", "rare", () => `<path d="M152 106 Q200 52 248 106" stroke="#fda4af" stroke-width="5" fill="none"/><ellipse cx="170" cy="40" rx="11" ry="34" fill="#fff" stroke="#e5e7eb" stroke-width="2" transform="rotate(-10 170 40)"/><ellipse cx="230" cy="40" rx="11" ry="34" fill="#fff" stroke="#e5e7eb" stroke-width="2" transform="rotate(10 230 40)"/><ellipse cx="170" cy="42" rx="5" ry="24" fill="#fbcfe8" transform="rotate(-10 170 42)"/><ellipse cx="230" cy="42" rx="5" ry="24" fill="#fbcfe8" transform="rotate(10 230 42)"/>`],
  ["kacamata_hati", "Kacamata Hati", "rare", () => `<path d="M178 136 q-14 -10 -6 -18 q6 -4 6 3 q0 -7 6 -3 q8 8 -6 18z M222 136 q-14 -10 -6 -18 q6 -4 6 3 q0 -7 6 -3 q8 8 -6 18z" fill="#f9a8d466" stroke="#be185d" stroke-width="2"/><path d="M190 124 h20" stroke="#be185d" stroke-width="2"/>`],
  ["tiara", "Tiara Putri", "epic", () => `<path d="M160 90 L166 68 L180 82 L200 60 L220 82 L234 68 L240 90 Q200 76 160 90Z" fill="#fde047" stroke="#a16207" stroke-width="2"/><circle cx="200" cy="68" r="4" fill="#ec4899"/><circle cx="170" cy="76" r="2.6" fill="#38bdf8"/><circle cx="230" cy="76" r="2.6" fill="#38bdf8"/>`],
  ["kalung_hati", "Kalung Hati Emas", "uncommon", () => `<path d="M178 196 Q200 232 222 196" stroke="#f59e0b" stroke-width="2.5" fill="none"/><path d="M200 232 q-9 -8 -3 -13 q3 -2 3 1 q0 -3 3 -1 q6 5 -3 13z" fill="#f43f5e" stroke="#9f1239" stroke-width="1"/>`],
];

/* ---------- PAKAIAN: gaun & atasan cewek ---------- */
const ARM_L = "M135 205 Q110 240 115 300 L135 330 L145 325 L140 295 Q145 240 155 215 Z";
const ARM_R = "M265 205 Q290 240 285 300 L265 330 L255 325 L260 295 Q255 240 245 215 Z";
const SLV_S = ["M135 203 Q114 222 110 256 L145 264 Q146 236 156 214 Z", "M265 203 Q286 222 290 256 L255 264 Q254 236 244 214 Z"];
const SLV_W = ["M135 203 Q96 232 92 308 L134 312 Q142 252 156 214 Z", "M265 203 Q304 232 308 308 L266 312 Q258 252 244 214 Z"];
function dress(o) {
  const { c, d = "#00000055", sk = c, c2 = "#fff", top = "strap", hem = 440, fl = 24, fold = true, deco = "", slit = false } = o; const sw = (f) => `fill="${f}" stroke="${d}" stroke-width="1.8"`;
  let s = "";
  if (hem < 432) s += `<rect x="165.5" y="${hem - 4}" width="30" height="${462 - hem}" rx="11" fill="${SK}"/><rect x="204.6" y="${hem - 4}" width="30" height="${462 - hem}" rx="11" fill="${SK}"/>`;
  const sleeve = top === "short" || top === "wide" || top === "long";
  s += `<path d="${ARM_L}" fill="${top === "long" ? c : SK}"/><path d="${ARM_R}" fill="${top === "long" ? c : SK}"/><circle cx="123" cy="325" r="11" fill="${SK}"/><circle cx="277" cy="325" r="11" fill="${SK}"/>`;
  if (!sleeve) s += `<path d="${SLV_S[0]}" fill="${SK}"/><path d="${SLV_S[1]}" fill="${SK}"/>`;   // tutup lengan kaos bawaan
  if (top === "short") s += `<path d="${SLV_S[0]}" ${sw(c)}/><path d="${SLV_S[1]}" ${sw(c)}/>`;
  if (top === "wide") s += `<path d="${SLV_W[0]}" ${sw(c)}/><path d="${SLV_W[1]}" ${sw(c)}/>`;
  if (!sleeve) s += `<path d="M138 203 Q200 184 262 203 L264 232 Q200 250 136 232Z" fill="${SK}"/>`;          // bahu & dada terbuka
  const bodice = sleeve ? "M135 200 Q200 180 265 200 L264 298 L136 298 Z" : top === "halter" ? "M170 204 L200 222 L230 204 L262 232 L264 298 L136 298 L138 232 Z" : "M138 232 Q168 246 200 234 Q232 246 262 232 L264 298 L136 298 Z";
  s += `<path d="${bodice}" ${sw(c)}/>`;
  if (!sleeve && top !== "halter") s += `<path d="M156 208 L160 238 M244 208 L240 238" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`;
  const hw = 70 + fl, k = fl * .45;
  s += `<path d="M133 294 L267 294 Q${267 + k} ${(294 + hem) / 2} ${200 + hw} ${hem} Q200 ${hem + 9} ${200 - hw} ${hem} Q${133 - k} ${(294 + hem) / 2} 133 294Z" ${sw(sk)}/>`;
  if (fold) for (let i = 0; i < 5; i++) { const t = (i - 2) / 2; s += `<path d="M${200 + t * 56} 300 L${200 + t * (hw - 6)} ${hem - 2}" stroke="${d}" stroke-opacity=".35" stroke-width="1.6" fill="none"/>`; }
  return s + deco;
}
const PITA_D = `<path d="M200 258 l-14 -9 v18z M200 258 l14 -9 v18z" fill="#ef4444"/>`;
const DRESS = [
  ["sundress", "Sundress Kuning Musim Panas", "common", () => dress({ c: "#fde68a", d: "#b45309", c2: "#fbbf24", hem: 396, fl: 6, deco: `<g fill="#f59e0b" opacity=".7"><circle cx="160" cy="330" r="4"/><circle cx="215" cy="345" r="4"/><circle cx="240" cy="320" r="4"/><circle cx="180" cy="370" r="4"/></g>` })],
  ["blouse_pita", "Blouse Putih Pita Merah", "common", () => dress({ c: "#fff", sk: "#fff", d: "#9ca3af", c2: "#fecdd3", top: "short", hem: 345, fl: 0, fold: false, deco: PITA_D })],
  ["sweater_pink", "Sweater Pink Lembut", "common", () => dress({ c: "#fbcfe8", sk: "#fbcfe8", d: "#be185d", c2: "#f9a8d4", top: "long", hem: 345, fl: 0, fold: false })],
  ["sailor", "Seragam Sailor Sekolah", "uncommon", () => dress({ c: "#fff", sk: "#1e2a4a", d: "#1e2a4a", c2: "#1e2a4a", top: "short", hem: 394, fl: 12, deco: `<path d="M158 206 L200 250 L242 206 L238 200 L200 232 L162 200Z" fill="#1e2a4a"/><path d="M200 250 l-11 12 11 6 11 -6z" fill="#ef4444"/>` })],
  ["gaun_putri_pink", "Gaun Putri Pink", "rare", () => dress({ c: "#f9a8d4", d: "#9d174d", c2: "#fff", fl: 34, hem: 444, deco: `<path d="M150 236 Q200 256 250 236" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray="2 5"/>` })],
  ["qipao_merah", "Qipao Merah Naga", "rare", () => dress({ c: "#dc2626", d: "#7f1d1d", c2: "#fbbf24", top: "short", hem: 420, fl: 0, slit: true, fold: false, deco: `<path d="M180 202 L200 218 L220 202" stroke="#fbbf24" stroke-width="3" fill="none"/><path d="M165 240 q10 12 20 0 M215 240 q10 12 20 0" stroke="#fbbf24" stroke-width="2.4" fill="none"/>` })],
  ["gaun_malam_hitam", "Gaun Malam Hitam Elegan", "epic", () => dress({ c: "#111827", d: "#000", c2: "#9ca3af", top: "halter", hem: 446, fl: 8, slit: true })],
  ["gaun_merah_pesta", "Gaun Pesta Merah Menyala", "epic", () => dress({ c: "#dc2626", d: "#7f1d1d", c2: "#fecaca", fl: 20, hem: 446, slit: true })],
  ["yukata_sakura", "Yukata Sakura", "epic", () => dress({ c: "#fbcfe8", d: "#9d174d", sk: "#fbcfe8", c2: "#7c3aed", top: "wide", hem: 438, fl: -22, fold: false, deco: `<path d="M168 200 L200 262 L232 200" fill="none" stroke="#fff" stroke-width="6"/><rect x="132" y="262" width="136" height="30" fill="#7c3aed" stroke="#4c1d95" stroke-width="1.6"/><g fill="#f472b6"><circle cx="160" cy="330" r="5"/><circle cx="238" cy="350" r="5"/><circle cx="190" cy="400" r="5"/><circle cx="225" cy="420" r="5"/></g>` })],
  ["gaun_pesta_biru", "Gaun Pesta Biru Samudra", "legendary", () => dress({ c: "#2563eb", d: "#1e3a8a", c2: "#93c5fd", fl: 44, hem: 448, deco: `<g fill="#bfdbfe"><circle cx="170" cy="340" r="2.5"/><circle cx="230" cy="360" r="2.5"/><circle cx="195" cy="395" r="2.5"/><circle cx="240" cy="420" r="2.5"/><circle cx="160" cy="425" r="2.5"/></g>` })],
  ["gaun_pengantin", "Gaun Pengantin Putih", "legendary", () => dress({ c: "#fff", d: "#9ca3af", c2: "#fde68a", fl: 52, hem: 450, deco: `<path d="M150 236 Q200 262 250 236" stroke="#fde68a" stroke-width="3" fill="none"/><path d="M130 296 Q112 380 100 446" stroke="#e5e7eb" stroke-width="3" fill="none"/>` })],
  ["furisode_emas", "Furisode Emas Mitologi", "mythic", () => dress({ c: "#fbbf24", d: "#78350f", sk: "#dc2626", c2: "#7c2d12", top: "wide", hem: 446, fl: -18, fold: false, deco: `<path d="M168 200 L200 262 L232 200" fill="none" stroke="#fff" stroke-width="6"/><rect x="132" y="262" width="136" height="32" fill="#7c2d12" stroke="#431407" stroke-width="1.6"/><g fill="#fde047"><circle cx="160" cy="340" r="6"/><circle cx="238" cy="365" r="6"/><circle cx="190" cy="410" r="6"/></g><path d="M120 300 q-14 14 0 22 M280 300 q14 14 0 22" stroke="#fde047" stroke-width="3" fill="none"><animate attributeName="opacity" values=".5;1;.5" dur="2s" repeatCount="indefinite"/></path>` })],
];

/* ---------- CELANA / ROK (slot celana, di dalam grup kaki) ---------- */
function rok(o) {
  const { c, d = "#00000055", end = 392, st = "", c2 = "#fff" } = o; const fl = Math.min(o.fl ?? 4, 10); const sw = `fill="${c}" stroke="${d}" stroke-width="1.8"`;
  let s = "";
  if (end < 440) s += `<rect x="170" y="${end - 4}" width="26" height="${456 - end}" rx="10" fill="${SK}"/><rect x="204" y="${end - 4}" width="26" height="${456 - end}" rx="10" fill="${SK}"/>`;
  s += `<path d="M163 336 H237 Q${243 + fl} ${(336 + end) / 2} ${240 + fl} ${end} Q200 ${end + 8} ${160 - fl} ${end} Q${157 - fl} ${(336 + end) / 2} 163 336Z" ${sw}/>`;
  if (st === "pleat" || st === "plaid") for (let i = 0; i < 7; i++) { const t = (i - 3) / 3; s += `<path d="M${200 + t * 28} 340 L${200 + t * (38 + fl)} ${end}" stroke="${d}" stroke-opacity=".4" stroke-width="1.5"/>`; }
  if (st === "plaid") for (let y = 352; y < end; y += 14) s += `<path d="M160 ${y} H240" stroke="${c2}" stroke-width="2" opacity=".5"/>`;
  if (st === "tutu") for (let k = 0; k < 3; k++) s += `<path d="M${160 - fl - k * 3} ${end - 6 - k * 9} Q200 ${end + 12 - k * 9} ${240 + fl + k * 3} ${end - 6 - k * 9}" stroke="${c2}" stroke-width="4" fill="none" opacity=".7"/>`;
  if (st === "floral") s += [[178, 380], [220, 400], [192, 420], [226, 436], [174, 440], [212, 360]].filter(p => p[1] < end).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="${c2}" opacity=".75"/>`).join("");
  s += `<rect x="163" y="336" width="74" height="8" fill="${d}" opacity=".6"/>`;
  return s;
}
const ROK = [
  ["mini_pink", "Rok Mini Pink", "common", () => rok({ c: "#f9a8d4", d: "#9d174d", end: 384, fl: 2 })],
  ["jeans_mini", "Rok Jeans Mini", "common", () => rok({ c: "#3b6ea5", d: "#1e3a5f", end: 386, fl: 0 })],
  ["tenis_putih", "Rok Tenis Putih", "common", () => rok({ c: "#f8fafc", d: "#94a3b8", end: 380, fl: 6, st: "pleat" })],
  ["plisket_navy", "Rok Plisket Navy", "uncommon", () => rok({ c: "#1e2a4a", d: "#0b1226", end: 398, fl: 10, st: "pleat" })],
  ["tartan_merah", "Rok Tartan Merah", "uncommon", () => rok({ c: "#b91c1c", d: "#450a0a", end: 398, fl: 8, st: "plaid", c2: "#111827" })],
  ["midi_floral", "Rok Midi Bunga", "rare", () => rok({ c: "#a7f3d0", d: "#047857", end: 428, fl: 12, st: "floral", c2: "#f472b6" })],
  ["panjang_hitam", "Rok Panjang Hitam", "rare", () => rok({ c: "#1f2937", d: "#000", end: 452, fl: 14 })],
  ["tutu_ungu", "Rok Tutu Balet Ungu", "epic", () => rok({ c: "#c084fc", d: "#6b21a8", end: 392, fl: 24, st: "tutu", c2: "#e9d5ff" })],
  ["hotpants", "Hotpants Denim", "common", () => H.pants({ c: "#60a5fa", d: "#1e3a8a", end: 376, w: 0 })],
  ["legging_hitam", "Legging Hitam", "common", () => H.pants({ c: "#111827", d: "#000", w: -5 })],
  ["skinny_jeans", "Skinny Jeans Biru", "uncommon", () => H.pants({ c: "#3b82f6", d: "#1e3a8a", w: -4 })],
  ["kulot_krem", "Celana Kulot Krem", "uncommon", () => H.pants({ c: "#e7d9b8", d: "#8b7d55", w: 6 })],
];

/* ---------- SEPATU HAK TINGGI & lainnya (digambar di grup kaki, skala 1.15) ---------- */
function heel(o) {
  const { c, d = "#00000066", h = 12, strap = "", plat = 0, boot = 0, toe = "pump" } = o;
  let s = "";
  for (const cx of [183, 217]) {
    if (boot) s += `<rect x="${cx - 13}" y="${440 - boot}" width="26" height="${boot + 12}" rx="6" fill="${c}" stroke="${d}" stroke-width="1.6"/>`;
    s += `<path d="M${cx - 16} 452 Q${cx} 443 ${cx + 16} 452 L${cx + 14} 462 Q${cx} ${toe === "round" ? 468 : 466} ${cx - 14} 462Z" fill="${c}" stroke="${d}" stroke-width="1.6"/>`;
    if (plat) s += `<rect x="${cx - 15}" y="462" width="30" height="${plat}" rx="3" fill="${strap || d}"/>`;
    if (h) s += `<path d="M${cx - 2.5} ${462 + plat} L${cx + 2.5} ${462 + plat} L${cx + 1.2} ${462 + plat + h} L${cx - 1.2} ${462 + plat + h}Z" fill="${d}"/>`;
    if (strap && !plat) s += `<path d="M${cx - 14} 452 H${cx + 14}" stroke="${strap}" stroke-width="2.6"/><circle cx="${cx}" cy="452" r="2" fill="#fde047"/>`;
  }
  return s;
}
const HEELS = [
  ["balet_pink", "Sepatu Balet Pink", "common", () => heel({ c: "#fbcfe8", d: "#be185d", h: 0, toe: "round" })],
  ["mary_jane", "Mary Jane Hitam", "common", () => heel({ c: "#111827", d: "#000", h: 3, strap: "#6b7280", toe: "round" })],
  ["pump_hitam", "Heels Pump Hitam", "uncommon", () => heel({ c: "#111827", d: "#000", h: 12 })],
  ["pump_nude", "Heels Pump Nude", "uncommon", () => heel({ c: "#e8c4a0", d: "#8b5a2b", h: 12 })],
  ["stiletto_merah", "Stiletto Merah Menyala", "rare", () => heel({ c: "#dc2626", d: "#7f1d1d", h: 14 })],
  ["heels_tali_putih", "Heels Tali Putih", "rare", () => heel({ c: "#f8fafc", d: "#6b7280", h: 12, strap: "#fbbf24" })],
  ["wedges_cokelat", "Wedges Cokelat", "rare", () => heel({ c: "#b45309", d: "#78350f", h: 0, plat: 9, strap: "#d6a45f" })],
  ["boots_hak_putih", "Boots Hak Putih", "epic", () => heel({ c: "#f1f5f9", d: "#64748b", h: 10, boot: 26 })],
  ["heels_kristal", "Heels Kristal Cinderella", "legendary", () => heel({ c: "#bae6fd", d: "#0284c7", h: 15, strap: "#e0f2fe" })],
];

/* ---------- versi CEWEK dari baju cowok: atasan pas badan + rok plisket + (kadang) stoking paha ---------- */
const lum = (h) => { const n = parseInt(h.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
const dark = (h, k) => { const n = parseInt(h.slice(1), 16); const f = (v) => Math.max(0, Math.round(v * k)).toString(16).padStart(2, "0"); return "#" + f(n >> 16) + f((n >> 8) & 255) + f(n & 255); };
export function femOutfit(svg, id, skirtOn = true) {
  const m = svg.match(/<path d="M135 200[^"]*"[^>]*fill="(#[0-9a-fA-F]{6})"/) || svg.match(/fill="(#[0-9a-fA-F]{6})"/);
  const main = m ? m[1] : "#1e2a4a", L = lum(main);
  if (!skirtOn) return svg;
  const skirt = L < .3 ? "#111827" : dark(main, .5), edge = dark(skirt, .6);
  let h = 0; for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const stock = h % 2 === 0, leg = stock ? "#2f2222" : SK;
  let o = `<rect x="165.5" y="372" width="30" height="92" rx="11" fill="${leg}"/><rect x="204.6" y="372" width="30" height="92" rx="11" fill="${leg}"/>`;
  if (stock) o += `<path d="M166 384 H196 M205 384 H235" stroke="#5a3d3d" stroke-width="3"/>`;
  o += `<path d="M136 294 L264 294 L267 346 Q269 366 271 384 Q200 396 129 384 Q131 366 133 346Z" fill="${skirt}" stroke="${edge}" stroke-width="1.8"/>`;
  for (let i = 0; i < 7; i++) { const t = (i - 3) / 3; o += `<path d="M${200 + t * 50} 300 L${200 + t * 68} 388" stroke="${edge}" stroke-opacity=".6" stroke-width="1.5"/>`; }
  if (!svg) return o;
  return o + svg;   // rok di BAWAH baju → baju tidak dimasukkan
}

const GCOL = [["pink", "#f9a8d4", "rare"], ["biru", "#60a5fa", "rare"], ["perak", "#e5e7eb", "epic"], ["merah", "#dc2626", "rare"], ["ungu", "#a78bfa", "epic"], ["pirang", "#fde68a", "uncommon"], ["cokelat", "#7c4a2d", "uncommon"]];
const HAIRCOL = []; for (const [id, nama, , fn] of HAIR.filter(h => !["pixie", "putri_panjang", "twin_bergelombang_pink", "hime"].includes(h[0]) || h[0] === "hime")) for (const [cn, hex, r] of GCOL) HAIRCOL.push([id + "_" + cn, nama.replace(/^Rambut /, "") + " " + cn[0].toUpperCase() + cn.slice(1), r, () => fn(hex)]);
const mark = (o) => { Object.values(o).forEach(x => { if (!x.equipped_default) x.g = "f"; }); return o; };
export const FEM_DEFAULT_HAIR = (c) => HAIR[1][3](c);

export function extendFemale(C) {
  Object.assign(C.HAIR_STYLES, mark(build(HAIR, "fh_")), mark(build(HAIRCOL, "fh_")));
  Object.assign(C.OUTFITS, mark(build(DRESS, "gn_")));
  Object.assign(C.CELANA, mark(build(ROK, "rk_")));
  Object.assign(C.SHOES, mark(build(HEELS, "hl_")));
  Object.assign(C.ACCESSORIES, mark(build(ACC, "fa_")));
  C.JEPIT = { none: { nama: "Tanpa jepit", harga: 0, equipped_default: true, svg: null }, ...mark(build(JEPIT, "jp_")) };
  C.PONI = { none: { nama: "Tanpa poni", harga: 0, equipped_default: true, svg: null }, ...mark(build(PONI, "pn_")) };
  C.ANTING = { none: { nama: "Tanpa anting", harga: 0, equipped_default: true, svg: null }, ...mark(build(ANTING, "an_")) };
}
