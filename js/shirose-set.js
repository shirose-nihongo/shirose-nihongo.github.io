/* ========================================================================
   SHIROSE SIGNATURE SET — mengikuti sheet referensi (seragam gakuran hitam-emas
   + emblem ungu, sayap emas berlapis, rambut navy poni runcing, celana/sepatu hitam).
   Item BARU (id baru), tidak mengubah item lama. Dipanggil lewat extendShirose(C).
   Catatan: ini ilustrasi SVG vektor — bukan raster; tetap lebih sederhana dari referensi.
   ======================================================================== */
const GOLD = "#f7b928", GOLD2 = "#e3b02c", GOLD3 = "#a8741a", NAVY = "#1e2f6b", PURPLE = "#7c3aed";
const SK = "#f5d4b3";
const SLV_L = "M135 205 Q110 240 115 300 L135 330 L145 325 L140 295 Q145 240 155 215 Z";
const SLV_R = "M265 205 Q290 240 285 300 L265 330 L255 325 L260 295 Q255 240 245 215 Z";
const TORSO = "M135 200 Q200 180 265 200 L270 345 L130 345 Z";

/* ---------- seragam gakuran Shirose ---------- */
const gakuran = (extra = "") => `
  <path d="${TORSO}" fill="#16161d" stroke="${GOLD2}" stroke-width="2.2"/>
  <path d="M135 330 L270 330" stroke="${GOLD2}" stroke-width="1.4" opacity=".7"/>
  <path d="M140 205 Q200 188 260 205 L262 236 Q200 222 138 236 Z" fill="#1f1f2b" opacity=".55"/>
  <path d="M186 214 L200 300 L214 214 Z" fill="#f8f4ea"/>
  <path d="M193 222 L207 222 L210 262 L200 276 L190 262 Z" fill="#f59e0b" stroke="#b45309" stroke-width="1"/>
  <path d="M160 200 L200 232 L156 262 L150 214 Z" fill="#0c0c12" stroke="${GOLD}" stroke-width="2"/>
  <path d="M240 200 L200 232 L244 262 L250 214 Z" fill="#0c0c12" stroke="${GOLD}" stroke-width="2"/>
  <path d="M160 200 Q200 214 240 200" fill="none" stroke="${GOLD}" stroke-width="2.4"/>
  <path d="M138 252 L162 262 M262 252 L238 262" stroke="${GOLD2}" stroke-width="1.6" opacity=".8"/>
  <rect x="172" y="296" width="22" height="14" rx="2" fill="#0c0c12" stroke="${GOLD2}" stroke-width="1" opacity=".9"/>
  <rect x="206" y="296" width="22" height="14" rx="2" fill="#0c0c12" stroke="${GOLD2}" stroke-width="1" opacity=".9"/>
  ${[[268], [296], [324]].map(([y]) => `<circle cx="200" cy="${y}" r="3.4" fill="${GOLD}" stroke="${GOLD3}" stroke-width=".9"/><circle cx="199" cy="${y - 1}" r="1" fill="#fff8d6"/>`).join("")}
  <path d="${SLV_L}" fill="#16161d" stroke="${GOLD2}" stroke-width="2"/>
  <path d="${SLV_R}" fill="#16161d" stroke="${GOLD2}" stroke-width="2"/>
  <path d="M115 296 L135 326" stroke="${GOLD}" stroke-width="2.6"/><path d="M285 296 L265 326" stroke="${GOLD}" stroke-width="2.6"/>
  <circle cx="123" cy="325" r="11" fill="${SK}"/><circle cx="277" cy="325" r="11" fill="${SK}"/>
  <rect x="176" y="168" width="48" height="34" rx="3" fill="${PURPLE}" stroke="${GOLD}" stroke-width="2"/>
  <rect x="179" y="171" width="42" height="28" rx="2" fill="none" stroke="#c4b5fd" stroke-width=".9" opacity=".7"/>
  <path d="M200 175 L203.4 183 L212 183.6 L205.4 189 L207.6 197 L200 192.6 L192.4 197 L194.6 189 L188 183.6 L196.6 183 Z" fill="#fde047" stroke="#b45309" stroke-width=".8"/>
  <rect x="172" y="164" width="56" height="42" rx="6" fill="${PURPLE}" opacity=".18"><animate attributeName="opacity" values=".1;.3;.1" dur="2.4s" repeatCount="indefinite"/></rect>
  ${extra}`;

/* ---------- sayap emas berlapis (4 tingkat, outline emas tua, glow) ---------- */
const lens = (L, w) => `M0 0 C${L * .22} ${-w} ${L * .78} ${-w * 1.1} ${L} 0 C${L * .78} ${w * .8} ${L * .22} ${w * .8} 0 0Z`;
function wingSide() {
  const tiers = [ // [jumlah, a0, a1, panjang, lebar, fill, opacity]
    [10, -104, 26, 190, 15, "#f5b617", 1], [9, -92, 30, 150, 14, "#fbc934", 1],
    [8, -80, 34, 112, 13, "#fddc62", 1], [6, -66, 36, 76, 11, "#fff0a8", 1]];
  let s = "";
  tiers.forEach(([n, a0, a1, L, w, f]) => {
    for (let i = 0; i < n; i++) {
      const a = a0 + (a1 - a0) * i / (n - 1), l = L * (.84 + .16 * Math.sin(i / (n - 1) * Math.PI));
      s += `<path d="${lens(l, w)}" fill="${f}" stroke="${GOLD3}" stroke-width="1.3" transform="translate(252 226) rotate(${a.toFixed(1)})"/>`;
      s += `<path d="M${(l * .1).toFixed(1)} 0 L${(l * .8).toFixed(1)} 0" stroke="${GOLD3}" stroke-width=".7" opacity=".45" transform="translate(252 226) rotate(${a.toFixed(1)})"/>`;
    }
  });
  return s;
}
const wings = () => {
  const half = `<g transform="translate(252 226) scale(1.18) translate(-252 -226)">${wingSide()}</g>`;
  const flap = (g, sgn) => `<g>${g}<animateTransform attributeName="transform" type="rotate" values="${-3 * sgn} 252 226;${3 * sgn} 252 226;${-3 * sgn} 252 226" dur="3.2s" repeatCount="indefinite"/></g>`;
  return `<g data-wing="1"><defs><filter id="shiro-wg" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="0" stdDeviation="7" flood-color="#f59e0b" flood-opacity=".75"/></filter></defs>
    <g filter="url(#shiro-wg)">${flap(half, 1)}<g transform="translate(400 0) scale(-1 1)">${flap(half, 1)}</g></g></g>`;
};

/* ---------- rambut navy poni runcing ---------- */
const hairShirose = (c) => { const h = c || NAVY, hl = "#3b5bc4";
  return `<path d="M143 128 Q138 74 200 62 Q262 74 257 128 Q252 112 246 106 L238 124 L230 100 L220 122 L208 96 L198 122 L186 98 L176 122 L166 102 L158 124 L150 108 Z" fill="${h}" stroke="#0f1a44" stroke-width="2"/>
    <path d="M143 128 Q136 150 142 168 L150 140 Z M257 128 Q264 150 258 168 L250 140 Z" fill="${h}" stroke="#0f1a44" stroke-width="1.6"/>
    <path d="M168 76 Q190 66 214 72" stroke="${hl}" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/>
    <path d="M186 64 l-4-10 8 6 M204 62 l2-11 5 9" stroke="#0f1a44" stroke-width="2" fill="none"/>`; };

/* ---------- celana & sepatu hitam ---------- */
const pantsShirose = () => `
  <path d="M164 336 H236 L238 372 L235 452 H203 L200 380 L197 452 H165 L162 372 Z" fill="#14141b" stroke="#000" stroke-width="1.6"/>
  <rect x="164" y="336" width="72" height="9" fill="${GOLD3}" opacity=".6"/>
  <path d="M200 380 V448" stroke="#000" stroke-width="1.6"/>
  <path d="M176 350 L172 448 M224 350 L228 448" stroke="#3a3f7a" stroke-width="2.2" opacity=".6"/>
  <path d="M186 352 L184 440 M214 352 L216 440" stroke="#000" stroke-width="1" opacity=".35"/>`;
const shoesShirose = () => [163, 197].map(x => `
  <path d="M${x - 2} 452 Q${x + 4} 444 ${x + 20} 446 L${x + 40} 450 Q${x + 46} 456 ${x + 44} 466 L${x - 4} 466 Z" fill="#0d0d12" stroke="#000" stroke-width="1.6"/>
  <path d="M${x + 4} 452 Q${x + 18} 448 ${x + 34} 453" stroke="#4b5bb8" stroke-width="2" fill="none" opacity=".8"/>
  <rect x="${x - 4}" y="463" width="48" height="4" rx="2" fill="#2a2a38"/>`).join("");

/* ---------- aura busur api di lantai (referensi) ---------- */
const auraShirose = () => `<ellipse cx="200" cy="468" rx="96" ry="14" fill="#7c3aed" opacity=".22"/>
  ${[[1, 0], [-1, .6]].map(([sg, b]) => `<path d="M${200 + sg * 92} 462 Q${200 + sg * 112} 420 ${200 + sg * 80} 392" stroke="#fb923c" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"><animate attributeName="opacity" values=".35;1;.35" dur="2s" begin="${b}s" repeatCount="indefinite"/></path><path d="M${200 + sg * 92} 462 Q${200 + sg * 108} 424 ${200 + sg * 84} 400" stroke="#fde68a" stroke-width="2" fill="none" stroke-linecap="round"/>`).join("")}`;

/* ---------- registrasi ---------- */
export function extendShirose(C) {
  C.OUTFITS.shirose_gakuran = { nama: "🏫 Seragam Gakuran Shirose", rarity: "legendary", harga: 60000, unlock_lv: 80, svg: () => gakuran() };
  C.HAIR_STYLES.shirose_poni = { nama: "Rambut Poni Navy Shirose", rarity: "rare", harga: 12000, unlock_lv: 25, svg: hairShirose };
  C.CELANA.shirose_hitam = { nama: "Celana Gakuran Hitam", rarity: "rare", harga: 11000, unlock_lv: 25, svg: pantsShirose };
  C.SHOES.shirose_sepatu = { nama: "Sepatu Pantofel Hitam", rarity: "rare", harga: 9500, unlock_lv: 25, svg: shoesShirose };
  C.AURAS.shirose_api = { nama: "🔥 Aura Busur Api Shirose", rarity: "epic", harga: 30000, unlock_lv: 50, svg: auraShirose };
  C.SAYAP.shirose_emas = { nama: "Sayap Emas Berlapis Shirose", rarity: "mythic", harga: 300000, unlock_lv: 90, gachaOnly: false, svg: wings };
}
