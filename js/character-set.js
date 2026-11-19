/* PAKET KOSTUM (kategori shop "set") — satu pembelian = baju + topi/topeng + jubah/sayap (+ sepatu). Desain ORIGINAL (bukan karakter berhak cipta).
 * Harga paket 10.000 🪙 (dasar 20.000 → diskon toko 50%). Cowok & cewek dipisah (g:"m" / "f"). Bagian-bagian paket disembunyikan dari toko (harga 0). */
import { H } from "./character-more.js?v=20261116m";
const SK = "#f5d4b3";
const TORSO = "M135 200 Q200 180 265 200 L270 345 L130 345 Z";
const SLV_L = "M135 205 Q110 240 115 300 L135 330 L145 325 L140 295 Q145 240 155 215 Z", SLV_R = "M265 205 Q290 240 285 300 L265 330 L255 325 L260 295 Q255 240 245 215 Z";
const HANDS = `<circle cx="123" cy="325" r="11" fill="${SK}"/><circle cx="277" cy="325" r="11" fill="${SK}"/>`;
const star = (x, y, r, f) => { let p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .42 : r; p.push((x + rr * Math.cos(a)).toFixed(1) + " " + (y + rr * Math.sin(a)).toFixed(1)); } return `<path d="M${p.join(" L")}Z" fill="${f}"/>`; };

/* ---------- topi / topeng / mahkota (koordinat kepala; pusat 200,130) ---------- */
const HAT = {
  cowboy: (c, band = "#3a2410") => `<path d="M163 88 Q160 50 200 50 Q240 50 237 88Z" fill="${c}"/><path d="M164 80 Q200 90 236 80 L237 88 Q200 98 163 88Z" fill="${band}"/><path d="M138 90 Q150 80 165 88 Q200 98 235 88 Q250 80 262 90 Q250 104 200 100 Q150 104 138 90Z" fill="${c}" stroke="${band}" stroke-width="2"/>`,
  wizard: (c, st = "#fde047") => `<path d="M150 92 Q175 60 200 8 Q222 62 250 92 Q200 104 150 92Z" fill="${c}"/><ellipse cx="200" cy="93" rx="64" ry="9" fill="${c}" stroke="#00000044" stroke-width="2"/><path d="M158 88 Q200 100 242 88" stroke="${st}" stroke-width="4" fill="none"/>${star(200, 52, 9, st)}`,
  mask: (c) => `<path d="M157 124 Q178 110 196 126 L204 126 Q222 110 243 124 Q242 146 221 143 Q206 141 200 133 Q194 141 179 143 Q158 146 157 124Z" fill="${c}" stroke="#00000055" stroke-width="2"/><ellipse cx="178" cy="130" rx="6" ry="7" fill="#fff"/><ellipse cx="222" cy="130" rx="6" ry="7" fill="#fff"/><circle cx="178" cy="132" r="3.4" fill="#1b1b2a"/><circle cx="222" cy="132" r="3.4" fill="#1b1b2a"/>`,
  helm: (c, pl) => `<path d="M146 138 Q144 60 200 60 Q256 60 254 138 L240 138 Q240 96 200 96 Q160 96 160 138Z" fill="${c}" stroke="#00000055" stroke-width="2.4"/><path d="M200 60 V96" stroke="#00000044" stroke-width="2"/><path d="M194 62 Q172 26 212 22 Q202 42 210 62Z" fill="${pl}"/>`,
  ninja: (c) => `<ellipse cx="200" cy="130" rx="57" ry="65" fill="${c}"/><path d="M152 118 H248 V144 H152Z" fill="${SK}"/><ellipse cx="178" cy="130" rx="6" ry="7" fill="#fff"/><ellipse cx="222" cy="130" rx="6" ry="7" fill="#fff"/><circle cx="178" cy="132" r="3.4" fill="#1b1b2a"/><circle cx="222" cy="132" r="3.4" fill="#1b1b2a"/><path d="M168 118 H232" stroke="#dc2626" stroke-width="5"/>`,
  astro: () => `<circle cx="200" cy="128" r="68" fill="#bfe8ff" fill-opacity=".28" stroke="#e5e7eb" stroke-width="8"/><circle cx="200" cy="128" r="68" fill="none" stroke="#9ca3af" stroke-width="2"/><path d="M158 96 Q172 78 196 74" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/><rect x="170" y="184" width="60" height="14" rx="6" fill="#e5e7eb" stroke="#9ca3af" stroke-width="2"/>`,
  tricorn: (c = "#1f1f2b") => `<path d="M140 98 Q160 52 200 60 Q240 52 260 98 Q200 84 140 98Z" fill="${c}" stroke="#d4a017" stroke-width="2.6"/><path d="M140 98 L126 84 Q150 86 160 90Z M260 98 L274 84 Q250 86 240 90Z" fill="${c}"/><circle cx="200" cy="76" r="7" fill="#f1f1f1"/><circle cx="197" cy="75" r="1.6" fill="#1b1b2a"/><circle cx="203" cy="75" r="1.6" fill="#1b1b2a"/><circle cx="178" cy="132" r="9.5" fill="#15151f"/><path d="M168 124 L152 110 M188 124 L246 100" stroke="#15151f" stroke-width="2.4"/>`,
  crown: (c = "#facc15", g = "#ef4444") => `<path d="M156 90 L162 54 L182 76 L200 44 L218 76 L238 54 L244 90Z" fill="${c}" stroke="#92400e" stroke-width="2.4"/><circle cx="162" cy="54" r="4" fill="${g}"/><circle cx="200" cy="44" r="5" fill="${g}"/><circle cx="238" cy="54" r="4" fill="${g}"/><rect x="156" y="86" width="88" height="8" rx="3" fill="${c}" stroke="#92400e" stroke-width="2"/>`,
  tiara: (c = "#e5e7eb", g = "#60a5fa") => `<path d="M166 84 Q200 70 234 84 L226 72 L214 80 L200 62 L186 80 L174 72Z" fill="${c}" stroke="#94a3b8" stroke-width="2"/><circle cx="200" cy="68" r="5" fill="${g}"/>`,
  flower: () => [[160, 82, "#f472b6"], [178, 72, "#fde047"], [200, 68, "#fb7185"], [222, 72, "#fde047"], [240, 82, "#f472b6"]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="9" fill="${c}"/><circle cx="${x}" cy="${y}" r="3.4" fill="#fff7"/>`).join("") + `<path d="M154 88 Q200 70 246 88" stroke="#16a34a" stroke-width="3" fill="none"/>`,
};
/* ---------- jubah (slot sayap: tergambar di belakang badan) ---------- */
const CAPE = (c, lin) => () => `<path d="M148 204 Q96 330 108 438 Q200 462 292 438 Q304 330 252 204Z" fill="${c}" stroke="#00000044" stroke-width="2"/><path d="M160 214 Q124 330 136 430 Q200 446 264 430 Q276 330 240 214Z" fill="${lin}" opacity=".55"/>`;
const WING_FAIRY = () => `<g opacity=".8"><ellipse cx="108" cy="228" rx="52" ry="30" fill="#bff5ff" stroke="#38bdf8" stroke-width="2" transform="rotate(-24 108 228)"/><ellipse cx="292" cy="228" rx="52" ry="30" fill="#bff5ff" stroke="#38bdf8" stroke-width="2" transform="rotate(24 292 228)"/><ellipse cx="124" cy="282" rx="34" ry="20" fill="#e0b8ff" stroke="#a855f7" stroke-width="2" transform="rotate(16 124 282)"/><ellipse cx="276" cy="282" rx="34" ry="20" fill="#e0b8ff" stroke="#a855f7" stroke-width="2" transform="rotate(-16 276 282)"/></g>`;
/* ---------- gaun (g:"f", digambar utuh: badan + lengan + rok) ---------- */
const GOWN = (c, c2, trim, deco = "") => () => `<path d="M132 330 Q200 352 268 330 L312 446 Q200 478 88 446Z" fill="${c2}" stroke="${trim}" stroke-width="2.4"/><path d="M200 340 L176 452 M200 340 L224 452 M200 340 L150 448 M200 340 L250 448" stroke="${trim}" stroke-opacity=".35" stroke-width="2"/><path d="${TORSO}" fill="${c}" stroke="${trim}" stroke-width="2"/><path d="M135 330 Q200 346 265 330" stroke="${trim}" stroke-width="5" fill="none"/><path d="${SLV_L}" fill="${c}" stroke="${trim}" stroke-width="2"/><path d="${SLV_R}" fill="${c}" stroke="${trim}" stroke-width="2"/>${HANDS}<path d="M170 200 Q200 222 230 200" fill="none" stroke="${trim}" stroke-width="4"/>${deco}`;

const SEP = { koboi: (c) => H.shoe({ c, d: "#2a1708", st: "high", c2: "#d4a017" }), hitam: () => H.shoe({ c: "#1f1f2b", d: "#000", st: "high", c2: "#9ca3af" }), putih: () => H.shoe({ c: "#f8fafc", d: "#94a3b8", st: "high", c2: "#a5b4fc" }) };
const OUT = (o, deco = "") => () => H.outfit({ ...o, deco });

const DEF = [
  // id, nama, g, bagian: {pakaian:[nama,svg], aksesori:[nama,svg], sayap:[nama,svg], sepatu:[nama,svg]}
  ["koboi", "🤠 Koboi Gurun", "m", { pakaian: OUT({ c: "#b07a42", d: "#4a2f14", st: "jacket" }, star(168, 232, 11, "#fde047") + `<path d="M135 330 H265" stroke="#3a2410" stroke-width="9"/><rect x="190" y="324" width="20" height="13" rx="2" fill="#facc15"/>`), aksesori: () => HAT.cowboy("#a9743f"), sepatu: () => SEP.koboi("#6b4423") }],
  ["penyihir", "🧙 Penyihir Akademi", "m", { pakaian: OUT({ c: "#34279a", d: "#150f55", st: "robe", obi: "#fbbf24" }, star(170, 240, 7, "#fde68a") + star(232, 262, 6, "#fde68a") + star(196, 300, 5, "#fde68a")), aksesori: () => HAT.wizard("#34279a"), sepatu: () => SEP.hitam() }],
  ["pahlawan", "🦸 Pahlawan Topeng", "m", { pakaian: OUT({ c: "#0e7c86", d: "#053a40", st: "tee" }, `<circle cx="200" cy="248" r="20" fill="#facc15" stroke="#92400e" stroke-width="2.4"/>${star(200, 248, 14, "#0e7c86")}<path d="M130 318 H270" stroke="#facc15" stroke-width="10"/>${`<path d="${SLV_L}" fill="#0e7c86" stroke="#053a40" stroke-width="2"/><path d="${SLV_R}" fill="#0e7c86" stroke="#053a40" stroke-width="2"/>${HANDS}`}`), aksesori: () => HAT.mask("#facc15"), sayap: CAPE("#0e7c86", "#facc15"), sepatu: () => SEP.hitam() }],
  ["ksatria", "🛡️ Ksatria Baja", "m", { pakaian: OUT({ c: "#475569", d: "#1e293b", st: "armor", pl: "#cbd5e1" }), aksesori: () => HAT.helm("#cbd5e1", "#dc2626"), sayap: CAPE("#b91c1c", "#fca5a5"), sepatu: () => SEP.hitam() }],
  ["ninja", "🥷 Ninja Bayangan", "m", { pakaian: OUT({ c: "#18181b", d: "#000", st: "jacket" }, `<path d="M135 295 H265" stroke="#dc2626" stroke-width="10"/>`), aksesori: () => HAT.ninja("#18181b"), sepatu: () => SEP.hitam() }],
  ["astronot", "🚀 Astronot Bintang", "m", { pakaian: OUT({ c: "#f1f5f9", d: "#94a3b8", st: "jacket" }, `<rect x="160" y="228" width="30" height="20" rx="3" fill="#2563eb"/><rect x="212" y="228" width="30" height="20" rx="3" fill="#ef4444"/><circle cx="200" cy="300" r="9" fill="#facc15"/>`), aksesori: () => HAT.astro(), sepatu: () => SEP.putih() }],
  ["bajaklaut", "🏴‍☠️ Bajak Laut", "m", { pakaian: OUT({ c: "#7a1f1f", d: "#3a0d0d", st: "jacket" }, `<path d="M135 318 H265" stroke="#1f1f2b" stroke-width="10"/><circle cx="200" cy="318" r="7" fill="#facc15"/>`), aksesori: () => HAT.tricorn(), sepatu: () => SEP.koboi("#2a2a33") }],
  ["raja", "👑 Raja Agung", "m", { pakaian: OUT({ c: "#facc15", d: "#92400e", st: "robe", obi: "#dc2626" }, `<circle cx="200" cy="250" r="14" fill="#dc2626" stroke="#92400e" stroke-width="2"/>`), aksesori: () => HAT.crown(), sayap: CAPE("#b91c1c", "#fecaca"), sepatu: () => SEP.koboi("#7a1f1f") }],
  ["putri", "👸 Putri Dongeng", "f", { pakaian: GOWN("#f9a8d4", "#fbcfe8", "#be185d", star(200, 232, 8, "#fde047")), aksesori: () => HAT.tiara("#fde68a", "#f472b6"), sepatu: () => SEP.putih() }],
  ["penyihirw", "🧙‍♀️ Penyihir Cantik", "f", { pakaian: OUT({ c: "#7c3aed", d: "#3b0764", st: "robe", obi: "#f9a8d4" }, star(170, 240, 7, "#fde68a") + star(232, 262, 6, "#fde68a")), aksesori: () => HAT.wizard("#7c3aed", "#f9a8d4"), sepatu: () => SEP.hitam() }],
  ["pahlawanw", "🦸‍♀️ Pahlawan Wanita", "f", { pakaian: OUT({ c: "#be185d", d: "#500724", st: "tee" }, `<circle cx="200" cy="248" r="20" fill="#fde047" stroke="#92400e" stroke-width="2.4"/>${star(200, 248, 14, "#be185d")}<path d="M130 318 H270" stroke="#fde047" stroke-width="10"/><path d="${SLV_L}" fill="#be185d" stroke="#500724" stroke-width="2"/><path d="${SLV_R}" fill="#be185d" stroke="#500724" stroke-width="2"/>${HANDS}`), aksesori: () => HAT.mask("#fde047"), sayap: CAPE("#be185d", "#fda4af"), sepatu: () => SEP.hitam() }],
  ["ratu", "❄️ Ratu Kristal", "f", { pakaian: GOWN("#7dd3fc", "#bae6fd", "#0369a1", `<path d="M168 250 L200 232 L232 250" stroke="#e0f2fe" stroke-width="3" fill="none"/>`), aksesori: () => HAT.crown("#e5e7eb", "#38bdf8"), sayap: CAPE("#38bdf8", "#e0f2fe"), sepatu: () => SEP.putih() }],
  ["koboiw", "🤠 Koboi Cewek", "f", { pakaian: OUT({ c: "#ec4899", d: "#831843", st: "jacket" }, star(168, 232, 11, "#fde047") + `<path d="M135 330 H265" stroke="#5a2d18" stroke-width="9"/>`), aksesori: () => HAT.cowboy("#f9a8d4", "#be185d"), sepatu: () => SEP.koboi("#9d174d") }],
  ["peri", "🧚 Peri Hutan", "f", { pakaian: GOWN("#86efac", "#bbf7d0", "#15803d", `<path d="M150 300 q10 -10 20 0 t20 0 t20 0 t20 0" stroke="#15803d" stroke-width="2" fill="none"/>`), aksesori: () => HAT.flower(), sayap: WING_FAIRY, sepatu: () => SEP.putih() }],
  ["ksatriaw", "⚔️ Ksatria Putri", "f", { pakaian: OUT({ c: "#6b7280", d: "#1f2937", st: "armor", pl: "#e5e7eb" }), aksesori: () => HAT.helm("#e5e7eb", "#ec4899"), sayap: CAPE("#be123c", "#fecdd3"), sepatu: () => SEP.hitam() }],
];

export const SET = {};
export function extendSet(C) {
  const slotMap = { pakaian: C.OUTFITS, aksesori: C.ACCESSORIES, sayap: C.SAYAP, sepatu: C.SHOES };
  for (const [id, nama, g, parts] of DEF) {
    const pid = {};
    for (const [slot, fn] of Object.entries(parts)) {
      const key = "set_" + id + "_" + slot; pid[slot] = key;
      slotMap[slot][key] = { nama: nama + " · " + slot, harga: 0, rarity: "epic", unlock_lv: 1, _rp: 1, svg: fn, ...(slot === "pakaian" && g === "f" && /^(putri|ratu|peri)$/.test(id) ? { g: "f" } : {}), _set: 1 };
    }
    SET["set_" + id] = { nama, harga: 20000, rarity: "epic", unlock_lv: 1, _rp: 1, g, parts: pid, svg: null };
  }
}
