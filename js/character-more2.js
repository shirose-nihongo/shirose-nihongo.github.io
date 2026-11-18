/* Koleksi tambahan ke-2: RAMBUT baru + lebih banyak baju, celana, sepatu, aksesori, senjata, aura, sayap. */
import { H } from "./character-more.js";
const { SK, build, U, outfit, pants, shoe, aura, blade, gl, orb, staff, PAIR, wingFeather, wingBat, wingLeaf, wingCrystal, wingWind, wingFlame, buildWings, tier, angel, phoenix, dragon, spirit, crystal } = H;

/* ---------- RAMBUT (svg menerima warna dasar c; yang punya warna tetap mengabaikannya) ---------- */
const BASE = (f) => `<path d="M150 90 Q155 72 180 68 Q200 65 220 68 Q245 72 250 90 Q252 105 250 115 Q245 95 220 92 L220 100 Q200 90 180 100 L180 92 Q155 95 150 115 Z" fill="${f}"/>`;
const HAIRS = {
  spiky: (f) => `<path d="M148 112 Q140 80 160 70 L150 48 L174 66 L180 40 L196 62 L206 36 L218 62 L236 44 L238 68 L258 56 L250 90 Q258 100 252 114 Q240 92 200 90 Q160 92 148 112Z" fill="${f}"/>`,
  bob: (f) => `<path d="M143 130 Q138 70 200 62 Q262 70 257 130 L257 152 Q245 152 240 135 Q240 100 200 92 Q160 100 160 135 Q155 152 143 152Z" fill="${f}"/>`,
  ponytail: (f) => BASE(f) + `<path d="M246 96 Q294 88 288 160 Q286 124 250 112Z" fill="${f}"/><circle cx="248" cy="100" r="5" fill="#ef4444"/>`,
  twin: (f) => BASE(f) + `<path d="M150 98 Q104 96 110 176 Q124 130 154 112Z M250 98 Q296 96 290 176 Q276 130 246 112Z" fill="${f}"/><circle cx="148" cy="100" r="5" fill="#f472b6"/><circle cx="252" cy="100" r="5" fill="#f472b6"/>`,
  afro: (f) => `<path d="M122 104 Q112 22 200 22 Q288 22 278 104 Q272 74 240 90 Q200 68 160 90 Q128 74 122 104Z" fill="${f}"/>`,
  mohawk: (f) => `<path d="M188 70 L182 34 L194 14 L206 14 L218 34 L212 70Z" fill="${f}"/><path d="M152 100 Q158 84 176 80 L176 92 Q160 94 152 112Z M248 100 Q242 84 224 80 L224 92 Q240 94 248 112Z" fill="${f}" opacity=".5"/>`,
  long: (f) => `<path d="M145 85 Q150 62 200 60 Q250 62 255 85 Q264 150 254 206 L240 200 Q246 130 238 104 Q200 88 162 104 Q154 130 160 200 L146 206 Q136 150 145 85Z" fill="${f}"/>`,
  bun: (f) => BASE(f) + `<circle cx="200" cy="52" r="20" fill="${f}"/><path d="M184 66 Q200 74 216 66" stroke="#0004" stroke-width="2" fill="none"/>`,
  curly: (f) => BASE(f) + [158, 176, 194, 212, 230, 246].map((x, i) => `<circle cx="${x}" cy="${74 - (i % 2) * 6}" r="13" fill="${f}"/>`).join(""),
  topknot: (f) => `<path d="M156 96 Q170 74 200 72 Q230 74 244 96 Q220 84 200 84 Q180 84 156 96Z" fill="${f}"/><ellipse cx="200" cy="52" rx="11" ry="16" fill="${f}"/><rect x="190" y="64" width="20" height="6" fill="#dc2626"/>`,
  emo: (f) => `<path d="M146 100 Q150 64 200 60 Q250 64 254 100 L254 144 L240 152 L236 118 L214 100 L200 132 L186 100 L164 118 L160 152 L146 144Z" fill="${f}"/>`,
  undercut: (f) => `<path d="M158 92 Q165 66 200 62 Q235 66 242 92 Q200 78 158 92Z" fill="${f}"/>`,
  twinbuns: (f) => BASE(f) + `<circle cx="160" cy="62" r="15" fill="${f}"/><circle cx="240" cy="62" r="15" fill="${f}"/>`,
  wolf: (f) => `<path d="M140 120 Q130 70 170 56 L162 28 L186 52 L200 22 L214 52 L238 28 L230 56 Q270 70 260 120 Q252 96 236 100 L226 88 L214 106 L200 90 L186 106 L174 88 L164 100 Q148 96 140 120Z" fill="${f}"/>`,
};
const gradH = (cols) => { const g = U("gh"); return [`url(#${g})`, `<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1">${cols.map((c, i) => `<stop offset="${Math.round(i * 100 / (cols.length - 1))}%" stop-color="${c}"/>`).join("")}</linearGradient></defs>`]; };
const hair = (style, col) => (c) => { if (!col) return HAIRS[style](c || "#2a1810"); if (Array.isArray(col)) { const [f, d] = gradH(col); return d + HAIRS[style](f); } return HAIRS[style](col); };
const HAIR = [
  ["spiky", "Rambut Spiky", "common", hair("spiky")], ["bob", "Rambut Bob", "common", hair("bob")], ["ponytail", "Rambut Ekor Kuda", "common", hair("ponytail")],
  ["undercut", "Rambut Undercut", "common", hair("undercut")], ["bun", "Rambut Cepol Bun", "uncommon", hair("bun")], ["long", "Rambut Panjang Lurus", "uncommon", hair("long")],
  ["twin", "Rambut Kuncir Dua", "uncommon", hair("twin")], ["curly", "Rambut Keriting", "uncommon", hair("curly")], ["emo", "Rambut Poni Emo", "uncommon", hair("emo")],
  ["afro", "Rambut Afro", "rare", hair("afro")], ["mohawk", "Rambut Mohawk", "rare", hair("mohawk", "#dc2626")], ["topknot", "Rambut Chonmage Samurai", "rare", hair("topknot")],
  ["pink", "Rambut Pink Sakura", "rare", hair("twin", "#f472b6")], ["biru", "Rambut Biru Laut", "rare", hair("spiky", "#2563eb")],
  ["perak", "Rambut Perak Spiky", "epic", hair("spiky", "#e5e7eb")], ["ungu", "Rambut Ungu Panjang", "epic", hair("long", "#7c3aed")], ["twinbuns_hijau", "Rambut Dua Cepol Hijau", "epic", hair("twinbuns", "#22c55e")],
  ["serigala_perak", "Rambut Serigala Perak", "epic", hair("wolf", "#cbd5e1")],
  ["api", "Rambut Api Menyala", "legendary", (c) => { const g = U("gh"); return `<defs><linearGradient id="${g}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#dc2626"/><stop offset=".6" stop-color="#f97316"/><stop offset="1" stop-color="#fde047"/></linearGradient></defs><g fill="url(#${g})">${HAIRS.spiky("url(#" + g + ")")}<animateTransform attributeName="transform" type="scale" values="1 1;1 1.04;1 1" dur=".9s" additive="sum" repeatCount="indefinite"/></g>`; }],
  ["es", "Rambut Es Kristal", "legendary", hair("spiky", ["#e0f2fe", "#38bdf8"])], ["emas", "Rambut Emas Dewa", "legendary", hair("long", ["#fef08a", "#f59e0b"])],
  ["pelangi", "Rambut Pelangi", "mythic", hair("long", ["#ef4444", "#facc15", "#22c55e", "#3b82f6", "#a855f7"])],
  ["galaxy", "Rambut Galaksi", "mythic", hair("wolf", ["#312e81", "#a855f7", "#22d3ee"])],
];

/* ---------- PAKAIAN ---------- */
const OUT = [
  ["kaos_kuning", "Kaos Kuning Ceria", "common", { c: "#facc15", d: "#92400e", st: "tee" }], ["kaos_ungu", "Kaos Ungu", "common", { c: "#a855f7", d: "#581c87", st: "tee" }],
  ["kaos_oranye", "Kaos Oranye", "common", { c: "#fb923c", d: "#7c2d12", st: "tee" }], ["tank_putih", "Tank Top Putih", "common", { c: "#f8fafc", d: "#94a3b8", st: "tank" }],
  ["kemeja_putih", "Kemeja Putih Lengan Panjang", "common", { c: "#f8fafc", d: "#94a3b8", st: "long" }],
  ["hoodie_hijau", "Hoodie Hijau Hutan", "uncommon", { c: "#16a34a", d: "#14532d", st: "hoodie" }], ["jaket_olahraga", "Jaket Olahraga Merah", "uncommon", { c: "#dc2626", d: "#7f1d1d", st: "jacket" }],
  ["sweater_biru", "Sweater Rajut Biru", "uncommon", { c: "#3b82f6", d: "#1e3a8a", st: "sweater", s2: "#bfdbfe" }], ["yukata_hijau", "Yukata Hijau", "uncommon", { c: "#15803d", d: "#14532d", st: "yukata", s2: "#fef08a" }],
  ["pelaut", "Seragam Pelaut", "rare", { c: "#f8fafc", d: "#1e3a8a", st: "stripe", s2: "#1e3a8a" }], ["jas_putih", "Jas Putih Elegan", "rare", { c: "#f1f5f9", d: "#64748b", st: "suit", tie: "#2563eb" }],
  ["jaket_neon", "Jaket Neon Cyber", "rare", { c: "#111827", d: "#22d3ee", st: "jacket" }], ["hoodie_naga", "Hoodie Naga Hitam", "rare", { c: "#18181b", d: "#dc2626", st: "hoodie" }],
  ["armor_es", "Armor Kristal Es", "epic", { c: "#0ea5e9", d: "#0c4a6e", st: "armor", pl: "#e0f2fe" }], ["jubah_api", "Jubah Penyihir Api", "epic", { c: "#b91c1c", d: "#450a0a", st: "robe", obi: "#fbbf24" }],
  ["kimono_sakura", "Kimono Sakura", "epic", { c: "#f9a8d4", d: "#9d174d", st: "kimono", obi: "#be185d" }],
  ["armor_petir", "Armor Petir Dewa", "legendary", { c: "#1e3a8a", d: "#fde047", st: "armor", pl: "#facc15" }], ["kimono_emas", "Kimono Emas Kerajaan", "legendary", { c: "#fbbf24", d: "#78350f", st: "kimono", obi: "#7f1d1d" }],
  ["jubah_phoenix", "Jubah Phoenix", "mythic", { c: "#ea580c", d: "#7c2d12", st: "robe", obi: "#fde047", deco: `<path d="M200 226 q-22 14-18 40 q18-12 18-10 q0 -2 18 10 q4-26-18-40z" fill="#fde047"><animate attributeName="opacity" values=".6;1;.6" dur="1.2s" repeatCount="indefinite"/></path>` }],
].map(([id, n, r, o]) => [id, n, r, () => outfit(o)]);

/* ---------- CELANA ---------- */
const PANTS = [
  ["pendek_hijau", "Celana Pendek Hijau", "common", { c: "#22c55e", d: "#14532d", end: 398 }], ["pendek_kuning", "Celana Pendek Kuning", "common", { c: "#facc15", d: "#92400e", end: 398 }],
  ["training_merah", "Training Merah", "common", { c: "#dc2626", d: "#7f1d1d", st: "stripe" }], ["cargo_abu", "Cargo Abu", "common", { c: "#6b7280", d: "#374151", st: "cargo" }],
  ["jogger_hitam", "Jogger Hitam", "uncommon", { c: "#27272a", d: "#000", w: -2, st: "stripe", c2: "#71717a" }], ["kotak_biru", "Celana Kotak Biru", "uncommon", { c: "#2563eb", d: "#1e3a8a", st: "plaid", c2: "#bfdbfe" }],
  ["jeans_pudar", "Jeans Pudar Robek", "uncommon", { c: "#7aa2c9", d: "#456a8e", st: "rip" }], ["neon", "Celana Neon Bintang", "rare", { c: "#0f172a", d: "#22d3ee", st: "stars", c2: "#22d3ee" }],
  ["petir", "Celana Petir Kuning", "epic", { c: "#1e3a8a", d: "#0b1226", st: "gold", c2: "#fde047" }], ["hutan_naga", "Celana Penjaga Hutan", "legendary", { c: "#166534", d: "#052e16", st: "camo", c2: "#86efac" }],
].map(([id, n, r, o]) => [id, n, r, () => pants(o)]);

/* ---------- SEPATU ---------- */
const SHOESL = [
  ["hijau", "Sneakers Hijau", "common", { c: "#22c55e", d: "#14532d" }], ["sandal_biru", "Sandal Jepit Biru", "common", { c: "#3b82f6", d: "#1e3a8a", st: "sandal" }],
  ["high_putih", "High-top Putih", "uncommon", { c: "#f8fafc", d: "#94a3b8", st: "high", c2: "#dc2626" }], ["boot_hijau", "Boots Hutan", "rare", { c: "#3f6212", d: "#1a2e05", st: "boot", c2: "#bef264" }],
  ["boot_putih", "Boots Putih Emas", "rare", { c: "#f8fafc", d: "#ca8a04", st: "boot", c2: "#facc15" }], ["es", "Sepatu Es Kristal", "epic", { c: "#7dd3fc", d: "#0369a1", st: "glow", c2: "#e0f2fe" }],
  ["petir", "Sepatu Petir", "legendary", { c: "#1e3a8a", d: "#000", st: "glow", c2: "#fde047" }], ["phoenix", "Sepatu Phoenix", "mythic", { c: "#ea580c", d: "#7c2d12", st: "wing", c2: "#fde047" }],
].map(([id, n, r, o]) => [id, n, r, () => shoe(o)]);

/* ---------- AKSESORI ---------- */
const cap = (c, d) => () => `<ellipse cx="200" cy="92" rx="52" ry="10" fill="${c}"/><path d="M155 90 Q200 52 245 90Z" fill="${c}" stroke="${d}" stroke-width="2"/><path d="M212 92 q40 0 44 8 q-30 4-44-2Z" fill="${d}"/>`;
const glasses = (c) => () => `<circle cx="178" cy="132" r="11" fill="${c}" fill-opacity=".25" stroke="${c}" stroke-width="2.5"/><circle cx="222" cy="132" r="11" fill="${c}" fill-opacity=".25" stroke="${c}" stroke-width="2.5"/><path d="M189 132 H211" stroke="${c}" stroke-width="2.5"/>`;
const ACCS = [
  ["topi_hijau", "Topi Baseball Hijau", "common", cap("#22c55e", "#14532d")], ["topi_pink", "Topi Baseball Pink", "common", cap("#f472b6", "#9d174d")],
  ["kacamata_biru", "Kacamata Bulat Biru", "common", glasses("#3b82f6")], ["bandana_merah", "Bandana Merah", "common", () => `<path d="M150 98 Q200 84 250 98 L248 112 Q200 100 152 112Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="2"/><path d="M250 104 l18 12-4 6-18-10Z" fill="#dc2626"/>`],
  ["topi_koki", "Topi Koki", "uncommon", () => `<rect x="160" y="80" width="80" height="14" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/><path d="M158 82 Q150 40 180 44 Q200 20 220 44 Q250 40 242 82Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>`],
  ["topi_jerami", "Topi Jerami", "uncommon", () => `<ellipse cx="200" cy="88" rx="76" ry="14" fill="#facc15" stroke="#a16207" stroke-width="2"/><path d="M160 86 Q200 40 240 86Z" fill="#fde047" stroke="#a16207" stroke-width="2"/><rect x="162" y="76" width="76" height="8" fill="#dc2626"/>`],
  ["kacamata_gamer", "Kacamata Gamer", "rare", () => `<rect x="156" y="122" width="88" height="22" rx="10" fill="#0f172a" stroke="#22d3ee" stroke-width="2.5"><animate attributeName="stroke" values="#22d3ee;#a855f7;#22d3ee" dur="2s" repeatCount="indefinite"/></rect>`],
  ["tanduk_rusa", "Tanduk Rusa", "rare", () => `<path d="M165 86 Q150 56 158 34 M158 56 Q142 52 138 40 M235 86 Q250 56 242 34 M242 56 Q258 52 262 40" fill="none" stroke="#92400e" stroke-width="5" stroke-linecap="round"/>`],
  ["topi_bajak", "Topi Bajak Laut", "rare", () => `<path d="M140 94 Q200 40 260 94 Q200 78 140 94Z" fill="#111827" stroke="#000" stroke-width="2"/><circle cx="200" cy="74" r="7" fill="#f8fafc"/><path d="M194 80 h12 M197 70 v8 M203 70 v8" stroke="#111" stroke-width="1.5"/>`],
  ["mahkota_bunga", "Mahkota Bunga", "epic", () => [0, 1, 2, 3, 4, 5].map(i => `<circle cx="${158 + i * 17}" cy="${82 - Math.sin(i / 5 * Math.PI) * 14}" r="8" fill="${["#f472b6", "#fde047", "#fb7185", "#c084fc", "#fda4af", "#fbbf24"][i]}" stroke="#fff" stroke-width="1"/>`).join("")],
  ["helm_ksatria", "Helm Ksatria", "epic", () => `<path d="M148 130 Q148 62 200 60 Q252 62 252 130 L240 130 L240 112 L160 112 L160 130Z" fill="#94a3b8" stroke="#334155" stroke-width="2.5"/><rect x="190" y="40" width="20" height="26" rx="4" fill="#dc2626"/><path d="M160 112 H240" stroke="#334155" stroke-width="2"/>`],
  ["mahkota_petir", "Mahkota Petir", "legendary", () => `<path d="M156 92 L166 52 L184 80 L196 40 L210 80 L226 48 L244 92Z" fill="#fde047" stroke="#a16207" stroke-width="2"><animate attributeName="fill" values="#fde047;#fff;#fde047" dur=".8s" repeatCount="indefinite"/></path>`],
  ["halo_ganda", "Halo Ganda Cahaya", "mythic", () => `<ellipse cx="200" cy="48" rx="46" ry="11" fill="none" stroke="#fde047" stroke-width="5"><animate attributeName="ry" values="9;13;9" dur="2s" repeatCount="indefinite"/></ellipse><ellipse cx="200" cy="34" rx="34" ry="8" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>`],
];

/* ---------- SENJATA ---------- */
const HOLD = [
  ["pisau", "Pisau Dapur", "common", () => blade("#e5e7eb", "#6b7280", 50, "", 6)], ["tongkat_bisbol", "Tongkat Bisbol", "common", () => `<rect x="274" y="230" width="9" height="120" rx="4" fill="#c08a50" stroke="#7c4a21" stroke-width="1.5"/><rect x="272" y="206" width="13" height="30" rx="6" fill="#c08a50" stroke="#7c4a21" stroke-width="1.5"/>`],
  ["mic", "Mikrofon", "common", () => `<circle cx="279" cy="300" r="11" fill="#9ca3af" stroke="#374151" stroke-width="2"/><rect x="274" y="308" width="10" height="42" rx="4" fill="#1f2937"/>`],
  ["buku_sihir", "Buku Sihir", "uncommon", () => `<rect x="258" y="300" width="34" height="42" rx="3" fill="#7c3aed" stroke="#4c1d95" stroke-width="2"/><text x="275" y="327" text-anchor="middle" font-size="16" fill="#fde047">✦</text>`],
  ["gulungan", "Gulungan Ninja", "uncommon", () => `<rect x="256" y="312" width="42" height="14" rx="7" fill="#fde68a" stroke="#92400e" stroke-width="2"/><rect x="254" y="310" width="6" height="18" rx="3" fill="#92400e"/><rect x="294" y="310" width="6" height="18" rx="3" fill="#92400e"/>`],
  ["bola_api", "Bola Api", "rare", () => orb(278, 306, 22, "#f97316")], ["bola_es", "Bola Es", "rare", () => orb(278, 306, 22, "#38bdf8")], ["pedang_kristal", "Pedang Kristal", "rare", () => blade("#c4b5fd", "#6d28d9", 140, gl("#a78bfa", 150), 8)],
  ["bola_petir", "Bola Petir", "epic", () => orb(278, 304, 26, "#facc15") + `<path d="M268 290 l8 12-6 2 10 16" stroke="#fff" stroke-width="2" fill="none"><animate attributeName="opacity" values="0;1;0" dur=".7s" repeatCount="indefinite"/></path>`],
  ["tombak_petir", "Tombak Petir", "epic", () => `<rect x="275" y="190" width="6" height="170" fill="#1e3a8a"/><path d="M278 140 L268 190 L278 180 L288 190Z" fill="#fde047" stroke="#a16207" stroke-width="1.5"/>${orb(278, 150, 12, "#facc15")}`],
  ["busur_emas", "Busur Emas Dewa", "legendary", () => `<path d="M262 216 Q324 280 262 356" fill="none" stroke="#fbbf24" stroke-width="6"/><path d="M262 216 L262 356" stroke="#fff" stroke-width="1.5"/>${orb(262, 286, 10, "#fde047")}`],
  ["gada_naga", "Gada Naga Merah", "legendary", () => `<rect x="275" y="240" width="7" height="116" fill="#450a0a"/><circle cx="278" cy="226" r="24" fill="#b91c1c" stroke="#450a0a" stroke-width="3"/><path d="M258 214 l-8-6 M298 214 l8-6 M278 200 v-10 M262 240 l-8 8 M296 240 l8 8" stroke="#fca5a5" stroke-width="4"/>`],
  ["sabit_galaxy", "Sabit Galaksi", "mythic", () => `<rect x="275" y="186" width="6" height="170" fill="#1e1b4b"/><path d="M281 188 Q344 170 334 248 Q318 214 281 212Z" fill="#a78bfa" stroke="#4c1d95" stroke-width="2"><animate attributeName="fill" values="#a78bfa;#22d3ee;#a78bfa" dur="3s" repeatCount="indefinite"/></path>${orb(276, 190, 10, "#c084fc")}`],
  ["pedang_dewa", "Pedang Dewa Surya", "mythic", () => blade("#fffbeb", "#f59e0b", 190, gl("#fde047", 200) + orb(277, 140, 16, "#fde047"), 12)],
];

/* ---------- AURA ---------- */
const AURA = [
  ["oranye", "🧡 Aura Oranye Senja", "uncommon", { c: "#fb923c", p: "dot" }], ["tosca", "🩵 Aura Tosca Segar", "uncommon", { c: "#14b8a6", p: "leaf" }],
  ["emas_bintang", "⭐ Aura Bintang Emas", "rare", { c: "#fbbf24", p: "star" }], ["hati", "💗 Aura Cinta", "rare", { c: "#fb7185", p: "petal" }],
  ["badai", "🌪️ Aura Badai Ungu", "epic", { c: "#6366f1", c2: "#a855f7", p: "bolt", ring: 1, dur: "1.4s" }], ["lava", "🌋 Aura Lava", "legendary", { c: "#ef4444", c2: "#f97316", p: "flame", ring: 1, r: 152 }],
  ["bintang_jatuh", "🌠 Aura Bintang Jatuh", "mythic", { c: "#e0e7ff", c2: "#6366f1", p: "star", ring: 1, r: 165 }],
].map(([id, n, r, o]) => [id, n, r, () => aura(o)]);

/* ---------- SAYAP (Lv 50) ---------- */
const WING = [
  ["kupu", "Sayap Kupu-kupu", "uncommon", () => PAIR(`<path d="M252 226 Q344 120 372 196 Q360 244 252 230Z M252 232 Q340 252 342 306 Q304 336 252 236Z" fill="#fb923c" stroke="#7c2d12" stroke-width="2"/><circle cx="334" cy="196" r="9" fill="#fde047"/><circle cx="312" cy="294" r="6" fill="#fde047"/>`, 1)],
  ["malam", "Sayap Kelelawar Malam", "rare", () => PAIR(dragon("#4c1d95", "#c4b5fd"), 1)], ["kristal_ungu", "Sayap Kristal Ungu", "epic", () => PAIR(crystal("#c4b5fd", "#6d28d9", 8), 1)],
  ["pelangi", "Sayap Pelangi", "legendary", () => PAIR(["#a855f7", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444"].map((c, i) => tier(7 - i, -100 + i * 6, 10 - i * 4, 175 - i * 22, 14 - i, c, "#fff")).join(""), 1)],
  ["emas_agung", "Sayap Emas Dewa Cahaya", "mythic", () => PAIR(angel("#fef08a", "#facc15", "#a16207") + `<circle cx="256" cy="224" r="22" fill="#fff" opacity=".5"><animate attributeName="r" values="16;28;16" dur="2s" repeatCount="indefinite"/></circle>`, 1)],
].map(([id, n, r, f]) => [id, n, r, f]);

export function extend2(C) {
  Object.assign(C.HAIR_STYLES, build(HAIR, "hr_"));
  Object.assign(C.OUTFITS, build(OUT, "o2_")); Object.assign(C.SHOES, build(SHOESL, "sh2_"));
  Object.assign(C.ACCESSORIES, build(ACCS, "ac2_")); Object.assign(C.HANDHELD, build(HOLD, "hh2_")); Object.assign(C.AURAS, build(AURA, "au2_"));
  Object.assign(C.CELANA, build(PANTS, "cl2_"));
  Object.assign(C.SAYAP, buildWings(WING, "sy2_"));
}
