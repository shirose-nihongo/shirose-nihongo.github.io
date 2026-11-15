/* ========================================================================
   KOLEKSI TAMBAHAN karakter: celana (baru), sayap (baru, Lv 50), + banyak
   pakaian, sepatu, aksesori, senjata, aura. Dipanggil dari character.js via extend().
   Semua id diberi prefix agar tidak bentrok: o_ baju, cl_ celana, sh_ sepatu, ac_ aksesori,
   hh_ senjata, au_ aura, sy_ sayap.
   ======================================================================== */
const SK = "#f5d4b3";                       // warna kulit bawaan (sama seperti item lama)
/* tabel rarity → [harga min,max], level */
const RT = { common: [[400, 1500], 1], uncommon: [[2500, 5000], 10], rare: [[9000, 16000], 25], epic: [[25000, 36000], 50], legendary: [[50000, 80000], 80], mythic: [[100000, 130000], 90] };
const mk = (nama, rarity, i, n, svg, over = {}) => { // harga naik rata dalam satu rarity
  const [[a, b], lv] = RT[rarity]; const harga = Math.round((a + (b - a) * (n > 1 ? i / (n - 1) : 0)) / 50) * 50;
  return { nama, rarity, harga, unlock_lv: lv, svg, ...over };
};
function build(list, prefix) {  // list: [id, nama, rarity, svgFn]
  const cnt = {}; list.forEach(x => cnt[x[2]] = (cnt[x[2]] || 0) + 1);
  const seen = {}, out = {};
  list.forEach(([id, nama, rar, fn, over]) => { const i = seen[rar] = (seen[rar] || 0) + 1; out[prefix + id] = mk(nama, rar, i - 1, cnt[rar], fn, over); });
  return out;
}
const U = (() => { let n = 0; return (p) => p + (++n); })();   // id unik untuk gradient

/* ======================= PAKAIAN ======================= */
const TORSO = "M135 200 Q200 180 265 200 L270 345 L130 345 Z";
const SLV_L = "M135 205 Q110 240 115 300 L135 330 L145 325 L140 295 Q145 240 155 215 Z";
const SLV_R = "M265 205 Q290 240 285 300 L265 330 L255 325 L260 295 Q255 240 245 215 Z";
const SH_L = "M135 203 Q114 222 110 256 L145 264 Q146 236 156 214 Z", SH_R = "M265 203 Q286 222 290 256 L255 264 Q254 236 244 214 Z";
const HANDS = `<circle cx="123" cy="325" r="11" fill="${SK}"/><circle cx="277" cy="325" r="11" fill="${SK}"/>`;
function outfit(o) {
  const { c, d = "#00000066", st = "long", t = "", deco = "" } = o; const sw = `fill="${c}" stroke="${d}" stroke-width="2"`;
  let s = "";
  if (st === "tee") s = `<path d="${TORSO}" ${sw}/><path d="${SH_L}" ${sw}/><path d="${SH_R}" ${sw}/>`;
  else if (st === "tank") s = `<path d="${SH_L}" fill="${SK}"/><path d="${SH_R}" fill="${SK}"/><path d="M150 200 Q200 184 250 200 L270 345 L130 345 Z" ${sw}/>`;
  else s = `<path d="${TORSO}" ${sw}/><path d="${SLV_L}" ${sw}/><path d="${SLV_R}" ${sw}/>${HANDS}`;
  if (st === "hoodie") s += `<path d="M160 200 Q200 150 240 200 Q230 190 200 190 Q170 190 160 200 Z" fill="${d}"/><path d="M160 275 L240 275 L234 305 L166 305 Z" fill="${d}" opacity=".45"/>`;
  if (st === "jacket") s += `<line x1="200" y1="196" x2="200" y2="345" stroke="${d}" stroke-width="2"/><path d="M180 196 L200 214 L220 196 L226 206 L200 226 L174 206 Z" fill="${d}"/>`;
  if (st === "suit") s += `<path d="M160 200 L200 224 L240 200 L246 255 L200 245 L154 255 Z" fill="${d}"/><path d="M192 214 L208 214 L205 268 L200 274 L195 268 Z" fill="#fff"/><path d="M196 214 L204 214 L207 246 L200 262 L193 246 Z" fill="${o.tie || "#dc2626"}"/>`;
  if (st === "kimono") s += `<path d="M168 196 L200 262 L232 196" fill="none" stroke="#f5f0e8" stroke-width="6"/><rect x="130" y="282" width="140" height="24" fill="${o.obi || "#ffd700"}" stroke="${d}" stroke-width="1.5"/>`;
  if (st === "armor") s += `<path d="M150 210 L250 210 L245 290 Q200 310 155 290 Z" fill="${o.pl || "#9aa4b5"}" stroke="${d}" stroke-width="2"/><path d="M200 210 V300" stroke="${d}" stroke-width="2"/><ellipse cx="128" cy="214" rx="22" ry="14" fill="${o.pl || "#9aa4b5"}" stroke="${d}" stroke-width="2"/><ellipse cx="272" cy="214" rx="22" ry="14" fill="${o.pl || "#9aa4b5"}" stroke="${d}" stroke-width="2"/>`;
  if (st === "stripe") for (let y = 220; y < 345; y += 22) s += `<rect x="131" y="${y}" width="138" height="9" fill="${o.s2 || "#fff"}" opacity=".85"/>`;
  if (st === "robe") s += `<path d="M200 196 V345" stroke="${d}" stroke-width="3"/><path d="M135 300 H265" stroke="${o.obi || "#ffd700"}" stroke-width="8"/>`;
  if (st === "yukata") for (let i = 0; i < 9; i++) s += `<circle cx="${150 + (i % 3) * 50}" cy="${225 + Math.floor(i / 3) * 40}" r="7" fill="${o.s2 || "#fff"}" opacity=".7"/>`;
  if (st === "sweater") for (let y = 232; y < 345; y += 26) s += `<path d="M131 ${y} q10 6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="${o.s2 || "#fff"}" stroke-width="3" opacity=".8"/>`;
  return s + deco + t;
}
const OUT = [
  ["tee_merah", "Kaos Merah", "common", { c: "#ef4444", d: "#7a1a1a", st: "tee" }], ["tee_biru", "Kaos Biru Langit", "common", { c: "#38bdf8", d: "#075985", st: "tee" }],
  ["tee_hijau", "Kaos Hijau Mint", "common", { c: "#34d399", d: "#065f46", st: "tee" }], ["tank_hitam", "Tank Top Hitam", "common", { c: "#1f2937", d: "#000", st: "tank" }],
  ["kemeja_kotak", "Kemeja Kotak Merah", "common", { c: "#b91c1c", d: "#450a0a", st: "stripe", s2: "#111" }], ["sweater_krem", "Sweater Krem", "common", { c: "#e7d9b8", d: "#a8956a", st: "sweater", s2: "#a8956a" }],
  ["hoodie_abu", "Hoodie Abu", "uncommon", { c: "#9ca3af", d: "#4b5563", st: "hoodie" }], ["hoodie_biru", "Hoodie Biru Laut", "uncommon", { c: "#2563eb", d: "#1e3a8a", st: "hoodie" }],
  ["jaket_denim", "Jaket Denim", "uncommon", { c: "#3b6ea5", d: "#1e3a5f", st: "jacket" }], ["jaket_bomber", "Jaket Bomber Hijau", "uncommon", { c: "#4d6b3a", d: "#26361b", st: "jacket" }],
  ["yukata_biru", "Yukata Biru", "uncommon", { c: "#1d4ed8", d: "#172554", st: "yukata", s2: "#fff" }], ["tee_stripe", "Kaos Garis Pelaut", "uncommon", { c: "#f8fafc", d: "#1e3a8a", st: "stripe", s2: "#1e3a8a" }],
  ["jas_navy", "Jas Navy Formal", "rare", { c: "#1e2a4a", d: "#0b1226", st: "suit", tie: "#dc2626" }], ["yukata_sakura", "Yukata Sakura", "rare", { c: "#f9a8d4", d: "#9d174d", st: "yukata", s2: "#fff" }],
  ["hakama_miko", "Pakaian Miko", "rare", { c: "#f8fafc", d: "#b91c1c", st: "robe", obi: "#dc2626" }], ["jaket_kulit", "Jaket Kulit Biker", "rare", { c: "#262626", d: "#000", st: "jacket" }],
  ["armor_besi", "Armor Besi Ksatria", "epic", { c: "#475569", d: "#1e293b", st: "armor", pl: "#cbd5e1" }], ["kimono_biru", "Kimono Biru Malam", "epic", { c: "#1e3a8a", d: "#0f1f4d", st: "kimono", obi: "#ffd700" }],
  ["jubah_penyihir", "Jubah Penyihir", "epic", { c: "#5b21b6", d: "#2e1065", st: "robe", obi: "#fbbf24", deco: `<path d="M200 230 l4 9 10 1-8 6 3 10-9-6-9 6 3-10-8-6 10-1z" fill="#fde68a"/>` }],
  ["haori_ninja", "Seragam Ninja", "epic", { c: "#18181b", d: "#000", st: "jacket", deco: `<path d="M135 295 H265" stroke="#dc2626" stroke-width="10"/>` }],
  ["armor_samurai", "Armor Samurai Merah", "legendary", { c: "#991b1b", d: "#450a0a", st: "armor", pl: "#b91c1c", deco: `<path d="M150 300 L250 300 L255 345 L145 345Z" fill="#7f1d1d" stroke="#450a0a" stroke-width="2"/>` }],
  ["jubah_emas", "Jubah Kaisar Emas", "legendary", { c: "#facc15", d: "#92400e", st: "robe", obi: "#dc2626", deco: `<circle cx="200" cy="250" r="14" fill="#dc2626" stroke="#92400e" stroke-width="2"/>` }],
  ["armor_naga", "Armor Sisik Naga", "legendary", { c: "#047857", d: "#022c22", st: "armor", pl: "#10b981", deco: `<path d="M150 235 q10-10 20 0 t20 0 t20 0 t20 0" stroke="#022c22" stroke-width="2" fill="none"/>` }],
  ["jubah_galaxy", "Jubah Galaksi", "mythic", { c: "#1e1b4b", d: "#a78bfa", st: "robe", obi: "#a78bfa", deco: `<g fill="#fff"><circle cx="160" cy="240" r="2"/><circle cx="235" cy="225" r="1.5"/><circle cx="190" cy="270" r="2"/><circle cx="225" cy="310" r="2"/><circle cx="165" cy="320" r="1.5"/></g>` }],
  ["armor_surya", "Armor Cahaya Surya", "mythic", { c: "#fde047", d: "#a16207", st: "armor", pl: "#fef08a", deco: `<circle cx="200" cy="255" r="20" fill="#f59e0b" opacity=".6"><animate attributeName="r" values="16;24;16" dur="2s" repeatCount="indefinite"/></circle>` }],
].map(([id, n, r, o]) => [id, n, r, () => outfit(o)]);

/* ======================= CELANA ======================= */
function pants(o) {
  const { c, d = "#00000066", end = 452, w = 0, st = "", c2 = "#fff" } = o; const sw = `fill="${c}" stroke="${d}" stroke-width="1.8"`;
  const lx = 166 - w, rx = 234 + w, lb = 169 - w, rb = 231 + w, hip = 372, short = end < 440;
  let s = "";
  if (short) s += `<rect x="170" y="${end - 4}" width="26" height="${456 - end}" rx="10" fill="${SK}"/><rect x="204" y="${end - 4}" width="26" height="${456 - end}" rx="10" fill="${SK}"/>`;
  s += `<path d="M164 336 H236 V${hip} L${rb + 1} ${end} H201 L200 ${hip} L${lb + 31 + 0} ${end} H${lb} L${lx + 1} ${hip} Z" ${sw}/>`;
  s += `<path d="M200 ${hip} V${end - 4}" stroke="${d}" stroke-width="2"/>`;
  s += `<rect x="164" y="336" width="72" height="9" fill="${o.belt || d}" opacity=".75"/>`;
  if (st === "stripe") s += `<path d="M168 345 L${lb + 2} ${end}" stroke="${c2}" stroke-width="3"/><path d="M232 345 L${rb - 2} ${end}" stroke="${c2}" stroke-width="3"/>`;
  if (st === "cargo") s += `<rect x="168" y="385" width="24" height="22" fill="${d}" opacity=".35"/><rect x="208" y="385" width="24" height="22" fill="${d}" opacity=".35"/>`;
  if (st === "plaid") for (let y = 350; y < end; y += 16) s += `<path d="M166 ${y} H234" stroke="${c2}" stroke-width="2" opacity=".5"/>`;
  if (st === "camo") s += `<ellipse cx="180" cy="395" rx="9" ry="6" fill="${c2}" opacity=".6"/><ellipse cx="222" cy="420" rx="9" ry="6" fill="${c2}" opacity=".6"/><ellipse cx="184" cy="435" rx="7" ry="5" fill="${d}" opacity=".5"/><ellipse cx="218" cy="380" rx="8" ry="5" fill="${d}" opacity=".5"/>`;
  if (st === "stars") s += [[180, 380], [222, 395], [186, 420], [216, 440], [176, 352], [224, 358]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="${c2}"/>`).join("");
  if (st === "flame") s += `<path d="M${lb} ${end} q4-18 8-4 q4-22 8-4 q4-16 8-2 q3-14 7 0 L${lb + 31} ${end}Z" fill="${c2}"><animate attributeName="opacity" values=".6;1;.6" dur="1s" repeatCount="indefinite"/></path><path d="M${rb - 31} ${end} q4-18 8-4 q4-22 8-4 q4-16 8-2 q3-14 7 0 L${rb} ${end}Z" fill="${c2}"><animate attributeName="opacity" values="1;.6;1" dur="1s" repeatCount="indefinite"/></path>`;
  if (st === "ice") s += `<path d="M${lb} ${end} l5-22 5 22 5-16 5 16 5-20 6 20Z" fill="${c2}" opacity=".85"/><path d="M${rb - 31} ${end} l5-22 5 22 5-16 5 16 5-20 6 20Z" fill="${c2}" opacity=".85"/>`;
  if (st === "gold") s += `<path d="M164 360 H236 M${lb} ${end - 12} H${lb + 31} M${rb - 31} ${end - 12} H${rb}" stroke="${c2}" stroke-width="3"/>`;
  if (st === "wrap") s += `<path d="M${lb} 418 l31-8 M${lb} 428 l31-8 M${lb} 438 l31-8 M${rb - 31} 418 l31-8 M${rb - 31} 428 l31-8 M${rb - 31} 438 l31-8" stroke="${c2}" stroke-width="3"/>`;
  if (st === "rip") s += `<path d="M176 400 l12 4 M178 408 l10 3 M214 425 l12 4" stroke="${SK}" stroke-width="3"/>`;
  return s;
}
const PANTS = [
  ["jeans_biru", "Jeans Biru", "common", { c: "#3b6ea5", d: "#1e3a5f", st: "rip" }], ["jeans_hitam", "Jeans Hitam", "common", { c: "#27272a", d: "#000" }],
  ["chino_krem", "Chino Krem", "common", { c: "#d6c6a0", d: "#8b7d55" }], ["pendek_biru", "Celana Pendek Biru", "common", { c: "#2563eb", d: "#1e3a8a", end: 398 }],
  ["pendek_putih", "Celana Pendek Putih", "common", { c: "#f1f5f9", d: "#94a3b8", end: 398 }], ["training_hitam", "Training Hitam Garis Putih", "common", { c: "#1f2937", d: "#000", st: "stripe" }],
  ["sekolah_navy", "Celana Sekolah Navy", "common", { c: "#1e2a4a", d: "#0b1226" }], ["jogger_abu", "Jogger Abu", "uncommon", { c: "#9ca3af", d: "#4b5563", w: -2 }],
  ["cargo_hijau", "Cargo Hijau Army", "uncommon", { c: "#4d6b3a", d: "#26361b", st: "cargo" }], ["pendek_cargo", "Cargo Pendek Cokelat", "uncommon", { c: "#92651e", d: "#4a320f", st: "cargo", end: 405 }],
  ["kotak_merah", "Celana Kotak Merah", "uncommon", { c: "#b91c1c", d: "#450a0a", st: "plaid", c2: "#111" }], ["kain_hakama", "Hakama Hitam", "rare", { c: "#1f2937", d: "#000", w: 14, st: "plaid", c2: "#475569" }],
  ["camo", "Celana Kamuflase", "rare", { c: "#556b2f", d: "#2b3815", st: "camo", c2: "#8fa05a" }], ["kulit_hitam", "Celana Kulit", "rare", { c: "#171717", d: "#525252", st: "stripe", c2: "#525252" }],
  ["pink_sakura", "Celana Pink Sakura", "rare", { c: "#f9a8d4", d: "#9d174d", st: "stars", c2: "#fff" }], ["ninja_hitam", "Celana Ninja", "epic", { c: "#18181b", d: "#000", st: "wrap", c2: "#dc2626" }],
  ["hakama_merah", "Hakama Merah Miko", "epic", { c: "#dc2626", d: "#7f1d1d", w: 14, st: "gold", c2: "#fbbf24" }], ["samurai_biru", "Hakama Samurai Biru", "epic", { c: "#1d4ed8", d: "#172554", w: 14, st: "gold", c2: "#e5e7eb" }],
  ["es_kristal", "Celana Kristal Es", "epic", { c: "#7dd3fc", d: "#0369a1", st: "ice", c2: "#e0f2fe" }], ["api_membara", "Celana Api Membara", "legendary", { c: "#7f1d1d", d: "#450a0a", st: "flame", c2: "#fb923c" }],
  ["emas_kaisar", "Celana Kaisar Emas", "legendary", { c: "#facc15", d: "#92400e", st: "gold", c2: "#92400e", w: 6 }], ["naga_hijau", "Celana Sisik Naga", "legendary", { c: "#047857", d: "#022c22", st: "camo", c2: "#34d399" }],
  ["galaxy", "Celana Galaksi", "mythic", { c: "#1e1b4b", d: "#a78bfa", st: "stars", c2: "#fde68a" }], ["cahaya_dewa", "Celana Cahaya Dewa", "mythic", { c: "#fef08a", d: "#ca8a04", st: "gold", c2: "#f59e0b", w: 6 }],
].map(([id, n, r, o]) => [id, n, r, () => pants(o)]);

/* ======================= SEPATU ======================= */
function shoe(o) {
  const { c, d = "#00000088", st = "sneak", c2 = "#fff" } = o; const sw = `fill="${c}" stroke="${d}" stroke-width="1.6"`; let s = "";
  const L = (x, f) => f(x), twin = (f) => f(163) + f(197);
  if (st === "sneak") s = twin(x => `<path d="M${x} 450 L${x + 40} 450 L${x + 42} 465 L${x - 2} 465 Z" ${sw}/><path d="M${x + 3} 458 H${x + 36}" stroke="${c2}" stroke-width="2"/>`);
  else if (st === "high") s = twin(x => `<path d="M${x + 2} 436 L${x + 38} 436 L${x + 40} 465 L${x - 2} 465 Z" ${sw}/><path d="M${x + 4} 442 H${x + 36} M${x + 4} 448 H${x + 36}" stroke="${c2}" stroke-width="2"/>`);
  else if (st === "boot") s = twin(x => `<rect x="${x - 2}" y="430" width="46" height="35" rx="5" ${sw}/><rect x="${x - 2}" y="460" width="46" height="6" fill="${d}"/><path d="M${x + 4} 436 H${x + 38}" stroke="${c2}" stroke-width="3"/>`);
  else if (st === "sandal") s = twin(x => `<rect x="${x}" y="458" width="40" height="7" rx="3" ${sw}/><path d="M${x + 6} 452 L${x + 20} 458 M${x + 34} 452 L${x + 20} 458" stroke="${c2}" stroke-width="3"/>`);
  else if (st === "wing") s = twin(x => `<path d="M${x} 450 L${x + 40} 450 L${x + 42} 465 L${x - 2} 465 Z" ${sw}/>`) + `<path d="M160 452 q-24-6-26 -22 q16 6 26 8Z M240 452 q24-6 26-22 q-16 6-26 8Z" fill="${c2}" stroke="${d}" stroke-width="1"/>`;
  else if (st === "glow") s = twin(x => `<path d="M${x} 450 L${x + 40} 450 L${x + 42} 465 L${x - 2} 465 Z" ${sw}/><rect x="${x - 2}" y="464" width="44" height="3" fill="${c2}"><animate attributeName="opacity" values=".3;1;.3" dur="1.2s" repeatCount="indefinite"/></rect>`);
  else if (st === "spike") s = twin(x => `<path d="M${x} 450 L${x + 40} 450 L${x + 42} 465 L${x - 2} 465 Z" ${sw}/><path d="M${x + 2} 450 l4-8 4 8 4-8 4 8 4-8 4 8 4-8 4 8" fill="${c2}"/>`);
  return s;
}
const SHOESL = [
  ["biru", "Sneakers Biru", "common", { c: "#2563eb", d: "#1e3a8a" }], ["kuning", "Sneakers Kuning", "common", { c: "#facc15", d: "#92400e" }],
  ["hitam", "Sneakers Hitam", "common", { c: "#27272a", d: "#000" }], ["sandal_hijau", "Sandal Jepit Hijau", "common", { c: "#22c55e", d: "#166534", st: "sandal", c2: "#fff" }],
  ["high_merah", "High-top Merah", "uncommon", { c: "#dc2626", d: "#450a0a", st: "high" }], ["high_hitam", "High-top Hitam", "uncommon", { c: "#27272a", d: "#000", st: "high" }],
  ["boot_cokelat", "Boots Cokelat", "uncommon", { c: "#7c4a21", d: "#3d2410", st: "boot", c2: "#d6a363" }], ["zori", "Zori Merah", "uncommon", { c: "#b91c1c", d: "#450a0a", st: "sandal", c2: "#facc15" }],
  ["neon", "Sneakers Neon", "rare", { c: "#0f172a", d: "#000", st: "glow", c2: "#22d3ee" }], ["boot_ninja", "Boots Ninja", "rare", { c: "#18181b", d: "#000", st: "boot", c2: "#dc2626" }],
  ["high_pink", "High-top Sakura", "rare", { c: "#f9a8d4", d: "#9d174d", st: "high", c2: "#fff" }], ["boot_baja", "Boots Baja Ksatria", "epic", { c: "#94a3b8", d: "#334155", st: "boot", c2: "#e2e8f0" }],
  ["duri", "Sepatu Berduri", "epic", { c: "#18181b", d: "#000", st: "spike", c2: "#a1a1aa" }], ["neon_ungu", "Sneakers Neon Ungu", "epic", { c: "#2e1065", d: "#000", st: "glow", c2: "#c084fc" }],
  ["bersayap", "Sepatu Bersayap", "legendary", { c: "#f8fafc", d: "#94a3b8", st: "wing", c2: "#fff" }], ["emas", "Sepatu Emas", "legendary", { c: "#facc15", d: "#92400e", st: "sneak", c2: "#fff" }],
  ["boot_api", "Boots Api", "legendary", { c: "#7f1d1d", d: "#000", st: "glow", c2: "#fb923c" }], ["cahaya", "Sepatu Cahaya Dewa", "mythic", { c: "#fef9c3", d: "#ca8a04", st: "wing", c2: "#fde047" }],
  ["galaxy", "Sneakers Galaksi", "mythic", { c: "#1e1b4b", d: "#a78bfa", st: "glow", c2: "#a78bfa" }],
].map(([id, n, r, o]) => [id, n, r, () => shoe(o)]);

/* ======================= AKSESORI ======================= */
const G = (...a) => a.join("");
const ACCS = [
  ["topi_biru", "Topi Baseball Biru", "common", () => `<ellipse cx="200" cy="92" rx="52" ry="10" fill="#2563eb"/><path d="M155 90 Q200 52 245 90Z" fill="#2563eb" stroke="#1e3a8a" stroke-width="2"/><path d="M212 92 q40 0 44 8 q-30 4-44-2Z" fill="#1e3a8a"/>`],
  ["pita_merah", "Pita Rambut Merah", "common", () => `<path d="M185 80 L160 66 L160 94 Z M215 80 L240 66 L240 94 Z" fill="#ef4444" stroke="#7a1a1a" stroke-width="1.5"/><circle cx="200" cy="80" r="7" fill="#dc2626"/>`],
  ["masker", "Masker Putih", "common", () => `<path d="M168 148 Q200 140 232 148 L228 172 Q200 182 172 172 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/><path d="M168 150 L150 138 M232 150 L250 138" stroke="#94a3b8" stroke-width="1.5"/>`],
  ["syal_merah", "Syal Merah", "common", () => `<path d="M165 188 Q200 208 235 188 L238 204 Q200 222 162 204 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.5"/><path d="M222 202 L232 250 L214 246 L212 206Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.5"/>`],
  ["kalung_hati", "Kalung Hati", "common", () => `<path d="M172 192 Q200 232 228 192" fill="none" stroke="#d1d5db" stroke-width="2"/><path d="M200 222 l-8-8 q-4-8 4-8 l4 4 4-4 q8 0 4 8Z" fill="#ef4444"/>`],
  ["telinga_kucing", "Telinga Kucing", "uncommon", () => `<path d="M152 92 L158 52 L186 78 Z M248 92 L242 52 L214 78 Z" fill="#fbbf24" stroke="#92400e" stroke-width="2"/><path d="M160 80 L162 62 L176 76Z M240 80 L238 62 L224 76Z" fill="#f9a8d4"/>`],
  ["telinga_kelinci", "Telinga Kelinci", "uncommon", () => `<ellipse cx="172" cy="52" rx="10" ry="30" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/><ellipse cx="228" cy="52" rx="10" ry="30" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/><ellipse cx="172" cy="54" rx="4" ry="20" fill="#f9a8d4"/><ellipse cx="228" cy="54" rx="4" ry="20" fill="#f9a8d4"/>`],
  ["headphone", "Headphone", "uncommon", () => `<path d="M148 130 Q148 62 200 62 Q252 62 252 130" fill="none" stroke="#1f2937" stroke-width="7"/><rect x="138" y="118" width="16" height="30" rx="6" fill="#ef4444" stroke="#111" stroke-width="2"/><rect x="246" y="118" width="16" height="30" rx="6" fill="#ef4444" stroke="#111" stroke-width="2"/>`],
  ["bandana_ninja", "Bandana Ninja", "uncommon", () => `<path d="M150 98 Q200 84 250 98 L248 112 Q200 100 152 112Z" fill="#1f2937" stroke="#000" stroke-width="2"/><rect x="186" y="96" width="28" height="12" rx="2" fill="#9ca3af"/><path d="M250 104 l20 14-4 6-20-10Z" fill="#1f2937"/>`],
  ["tanduk_kecil", "Tanduk Setan Kecil", "uncommon", () => `<path d="M160 86 Q150 56 168 48 Q166 68 176 84Z M240 86 Q250 56 232 48 Q234 68 224 84Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.5"/>`],
  ["topi_penyihir", "Topi Penyihir", "rare", () => `<ellipse cx="200" cy="90" rx="62" ry="11" fill="#4c1d95"/><path d="M160 88 L200 6 L240 88Z" fill="#6d28d9" stroke="#2e1065" stroke-width="2"/><rect x="164" y="76" width="72" height="10" fill="#fbbf24"/>`],
  ["kacamata_hitam", "Kacamata Hitam Keren", "rare", () => `<rect x="160" y="122" width="34" height="20" rx="8" fill="#111" stroke="#374151" stroke-width="2"/><rect x="206" y="122" width="34" height="20" rx="8" fill="#111" stroke="#374151" stroke-width="2"/><path d="M194 128 H206" stroke="#111" stroke-width="3"/><path d="M164 126 l8 6 M210 126 l8 6" stroke="#9ca3af" stroke-width="1.5"/>`],
  ["topeng_kitsune", "Topeng Kitsune", "rare", () => `<path d="M230 80 Q262 86 258 130 Q252 158 232 160 Q244 130 236 104Z" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/><path d="M236 92 l14 4 M236 112 l16 2" stroke="#dc2626" stroke-width="2"/><path d="M232 80 l8-22 10 22Z" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>`],
  ["tanduk_iblis", "Tanduk Iblis", "epic", () => `<path d="M158 90 Q130 60 146 22 Q160 56 180 80Z M242 90 Q270 60 254 22 Q240 56 220 80Z" fill="#7f1d1d" stroke="#000" stroke-width="2"/>`],
  ["hachimaki", "Hachimaki Juara", "epic", () => `<path d="M150 100 Q200 86 250 100 L248 114 Q200 102 152 114Z" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/><circle cx="200" cy="104" r="7" fill="#dc2626"/><path d="M250 106 l20 18-6 4-18-14Z M248 110 l14 22-6 2-12-18Z" fill="#f8fafc" stroke="#dc2626" stroke-width="1.5"/>`],
  ["mahkota_permata", "Mahkota Permata", "epic", () => `<path d="M156 92 L162 56 L182 78 L200 46 L218 78 L238 56 L244 92Z" fill="#fde047" stroke="#a16207" stroke-width="2"/><circle cx="200" cy="64" r="5" fill="#ef4444"/><circle cx="168" cy="76" r="4" fill="#3b82f6"/><circle cx="232" cy="76" r="4" fill="#22c55e"/>`],
  ["halo", "Halo Malaikat", "legendary", () => `<ellipse cx="200" cy="48" rx="46" ry="11" fill="none" stroke="#fde047" stroke-width="6"><animate attributeName="opacity" values=".7;1;.7" dur="2s" repeatCount="indefinite"/></ellipse>`],
  ["mahkota_api", "Mahkota Api", "legendary", () => `<path d="M156 92 L160 44 q10 18 16 -2 l10 40 14-48 14 48 10-40 q6 20 16 2 L244 92Z" fill="#f97316" stroke="#7c2d12" stroke-width="2"><animate attributeName="fill" values="#f97316;#facc15;#f97316" dur="1.2s" repeatCount="indefinite"/></path>`],
  ["tiara_es", "Tiara Es", "legendary", () => `<path d="M158 92 L168 52 L184 78 L200 38 L216 78 L232 52 L242 92Z" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/><circle cx="200" cy="58" r="5" fill="#fff"/>`],
  ["mahkota_dewa", "Mahkota Dewa Cahaya", "mythic", () => { const g = U("gm"); return `<defs><radialGradient id="${g}"><stop offset="0%" stop-color="#fef08a" stop-opacity=".9"/><stop offset="100%" stop-color="#fef08a" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="64" r="56" fill="url(#${g})"><animate attributeName="r" values="46;62;46" dur="2s" repeatCount="indefinite"/></circle><path d="M156 92 L160 48 L180 74 L200 30 L220 74 L240 48 L244 92Z" fill="#fde047" stroke="#a16207" stroke-width="2.5"/><circle cx="200" cy="52" r="6" fill="#fff"/>`; }],
  ["mata_naga", "Mata Naga Merah", "mythic", () => `<circle cx="178" cy="132" r="9" fill="#dc2626"><animate attributeName="opacity" values=".6;1;.6" dur="1.4s" repeatCount="indefinite"/></circle><circle cx="222" cy="132" r="9" fill="#dc2626"><animate attributeName="opacity" values=".6;1;.6" dur="1.4s" repeatCount="indefinite"/></circle><rect x="176" y="124" width="4" height="16" rx="2" fill="#111"/><rect x="220" y="124" width="4" height="16" rx="2" fill="#111"/>`],
];

/* ======================= SENJATA (tangan kanan x≈277) ======================= */
const blade = (c, hilt, len = 160, glow = "", w = 6) => `${glow}<rect x="${277 - w / 2}" y="${330 - len}" width="${w}" height="${len}" fill="${c}" stroke="#0007" stroke-width="1"/><path d="M${277 - w / 2} ${330 - len} L277 ${322 - len} L${277 + w / 2} ${330 - len}Z" fill="${c}"/><rect x="266" y="326" width="22" height="5" rx="2" fill="${hilt}"/><rect x="274" y="331" width="6" height="26" rx="2" fill="#3a2518"/>`;
const gl = (col, len = 170) => { const g = U("gw"); return `<defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="${col}" stop-opacity="0"/><stop offset=".5" stop-color="${col}" stop-opacity=".8"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs><rect x="262" y="${326 - len}" width="30" height="${len}" fill="url(#${g})"><animate attributeName="opacity" values=".5;1;.5" dur="1.4s" repeatCount="indefinite"/></rect>`; };
const orb = (x, y, r, c) => { const g = U("go"); return `<defs><radialGradient id="${g}"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${g})"><animate attributeName="r" values="${r - 2};${r + 3};${r - 2}" dur="1.6s" repeatCount="indefinite"/></circle>`; };
const staff = (len, top) => `<rect x="274" y="${340 - len}" width="6" height="${len + 20}" rx="3" fill="#7c4a21" stroke="#3d2410" stroke-width="1.2"/>${top}`;
const HOLD = [
  ["katana", "Katana", "common", () => blade("#d1d5db", "#ca8a04", 150, "", 5)], ["pedang_kayu", "Pedang Kayu", "common", () => blade("#c08a50", "#7c4a21", 120, "", 8)],
  ["pensil_raksasa", "Pensil Raksasa", "common", () => `<rect x="274" y="190" width="10" height="150" fill="#facc15" stroke="#92400e" stroke-width="1.2"/><path d="M274 190 L279 168 L284 190Z" fill="#f5d4b3"/><path d="M277 176 L279 168 L281 176Z" fill="#111"/><rect x="274" y="338" width="10" height="12" fill="#f9a8d4"/>`],
  ["payung", "Payung Merah", "common", () => `<path d="M279 230 V338" stroke="#5a2f22" stroke-width="4"/><path d="M229 232 Q279 180 329 232 Q304 222 279 232 Q254 222 229 232Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="2"/>`],
  ["bunga", "Buket Bunga", "common", () => `<path d="M279 335 L270 290 M279 335 L279 282 M279 335 L289 290" stroke="#16a34a" stroke-width="3"/><circle cx="270" cy="286" r="9" fill="#f472b6"/><circle cx="279" cy="278" r="9" fill="#fb7185"/><circle cx="289" cy="286" r="9" fill="#fda4af"/>`],
  ["kipas", "Sensu (Kipas)", "common", () => `<path d="M279 335 L238 276 Q279 252 320 276Z" fill="#fde68a" stroke="#92400e" stroke-width="2"/><path d="M279 335 L252 270 M279 335 L279 258 M279 335 L306 270" stroke="#92400e" stroke-width="1.5"/><circle cx="279" cy="290" r="9" fill="#dc2626"/>`],
  ["kunai", "Kunai Ninja", "uncommon", () => `<path d="M279 330 L270 262 L279 244 L288 262Z" fill="#9ca3af" stroke="#374151" stroke-width="1.5"/><rect x="276" y="326" width="6" height="26" fill="#1f2937"/><circle cx="279" cy="356" r="6" fill="none" stroke="#1f2937" stroke-width="2.5"/>`],
  ["shuriken", "Shuriken", "uncommon", () => `<path d="M279 262 L286 278 L302 270 L292 284 L306 296 L288 294 L279 310 L270 294 L252 296 L266 284 L256 270 L272 278Z" fill="#9ca3af" stroke="#1f2937" stroke-width="1.5"><animateTransform attributeName="transform" type="rotate" from="0 279 286" to="360 279 286" dur="3s" repeatCount="indefinite"/></path><circle cx="279" cy="286" r="4" fill="#1f2937"/>`],
  ["busur", "Busur & Panah", "uncommon", () => `<path d="M262 222 Q316 280 262 350" fill="none" stroke="#7c4a21" stroke-width="5"/><path d="M262 222 L262 350" stroke="#e5e7eb" stroke-width="1.5"/><path d="M262 286 H322" stroke="#9ca3af" stroke-width="2"/><path d="M322 286 l-8-5 v10Z" fill="#9ca3af"/>`],
  ["tongkat_sihir", "Tongkat Sihir", "uncommon", () => staff(120, orb(277, 222, 12, "#a78bfa"))], ["lentera", "Lentera Chochin", "uncommon", () => `<path d="M279 280 V250" stroke="#5a2f22" stroke-width="3"/><ellipse cx="279" cy="300" rx="20" ry="26" fill="#dc2626" stroke="#7f1d1d" stroke-width="2"/><path d="M262 292 H296 M260 304 H298 M263 316 H295" stroke="#7f1d1d" stroke-width="1.5"/><ellipse cx="279" cy="300" rx="14" ry="20" fill="#fde047" opacity=".4"><animate attributeName="opacity" values=".2;.55;.2" dur="1.5s" repeatCount="indefinite"/></ellipse>`],
  ["yari", "Yari (Tombak)", "rare", () => `<rect x="275" y="190" width="6" height="170" fill="#7c4a21"/><path d="M278 190 L270 226 L278 144 L286 226Z" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/><rect x="272" y="226" width="12" height="6" fill="#dc2626"/>`],
  ["kapak", "Kapak Perang", "rare", () => `<rect x="275" y="222" width="6" height="130" fill="#7c4a21" stroke="#3d2410" stroke-width="1.2"/><path d="M281 226 Q322 218 322 258 Q322 288 281 280Z" fill="#9ca3af" stroke="#374151" stroke-width="2"/>`],
  ["palu", "Palu Raksasa", "rare", () => `<rect x="275" y="230" width="6" height="124" fill="#7c4a21"/><rect x="246" y="206" width="64" height="34" rx="5" fill="#6b7280" stroke="#1f2937" stroke-width="2"/><rect x="252" y="212" width="10" height="22" fill="#9ca3af"/>`],
  ["perisai", "Perisai Ksatria", "rare", () => `<path d="M95 270 H151 V316 Q123 350 95 316Z" fill="#2563eb" stroke="#1e3a8a" stroke-width="3"/><path d="M123 276 V338 M99 298 H147" stroke="#fde047" stroke-width="3"/>`],
  ["gitar", "Gitar Listrik", "rare", () => `<rect x="274" y="204" width="7" height="90" fill="#7c4a21"/><rect x="270" y="196" width="15" height="14" rx="2" fill="#1f2937"/><path d="M277 290 q-34 6-30 34 q4 24 30 20 q34 0 30-26 q-2-26-30-28Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="2"/><circle cx="277" cy="318" r="6" fill="#111"/>`],
  ["pedang_api", "Pedang Api", "epic", () => blade("#fb923c", "#92400e", 160, gl("#f97316"), 8)], ["pedang_es", "Pedang Es", "epic", () => blade("#bae6fd", "#0369a1", 160, gl("#38bdf8"), 8)],
  ["pedang_petir", "Pedang Petir", "epic", () => blade("#fde047", "#a16207", 160, gl("#facc15"), 7) + `<path d="M262 220 l10 16-8 4 12 20" stroke="#fff" stroke-width="2" fill="none"><animate attributeName="opacity" values="0;1;0" dur=".8s" repeatCount="indefinite"/></path>`],
  ["sabit", "Sabit Dewa Maut", "epic", () => `<rect x="275" y="186" width="6" height="170" fill="#3f3f46"/><path d="M281 188 Q340 176 330 244 Q316 214 281 212Z" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>`],
  ["tongkat_es", "Tongkat Kristal Es", "epic", () => staff(120, `<path d="M277 190 L266 220 L277 238 L288 220Z" fill="#bae6fd" stroke="#0369a1" stroke-width="2"/>` + orb(277, 214, 14, "#38bdf8"))],
  ["trisula", "Trisula Dewa Laut", "legendary", () => `<rect x="275" y="196" width="6" height="160" fill="#0e7490"/><path d="M252 156 V196 Q278 204 304 196 V156 M278 140 V198" fill="none" stroke="#22d3ee" stroke-width="5" stroke-linecap="round"/>${orb(278, 146, 12, "#22d3ee")}`],
  ["pedang_naga", "Pedang Naga Emas", "legendary", () => blade("#fde047", "#b45309", 170, gl("#fbbf24", 178), 9)],
  ["sabit_api", "Sabit Api Neraka", "legendary", () => `<rect x="275" y="186" width="6" height="170" fill="#450a0a"/><path d="M281 188 Q342 172 332 246 Q316 214 281 212Z" fill="#f97316" stroke="#7c2d12" stroke-width="2"><animate attributeName="fill" values="#f97316;#fde047;#f97316" dur="1s" repeatCount="indefinite"/></path>${orb(276, 190, 10, "#ef4444")}`],
  ["excalibur", "Pedang Cahaya Suci", "mythic", () => blade("#ffffff", "#fde047", 176, gl("#fef08a", 190), 10)],
  ["tongkat_galaxy", "Tongkat Galaksi", "mythic", () => staff(120, orb(277, 220, 18, "#c084fc") + `<circle cx="277" cy="220" r="26" fill="none" stroke="#e9d5ff" stroke-width="1.5"><animateTransform attributeName="transform" type="rotate" from="0 277 220" to="360 277 220" dur="4s" repeatCount="indefinite"/></circle>`)],
].map(([id, n, r, f]) => [id, n, r, f]);

/* ======================= AURA ======================= */
function aura(o) {
  const { c, c2 = c, r = 140, p = "dot", dur = "2.4s" } = o, g = U("ga"); let s = `<defs><radialGradient id="${g}"><stop offset="0" stop-color="${c}" stop-opacity=".42"/><stop offset=".7" stop-color="${c2}" stop-opacity=".14"/><stop offset="1" stop-color="${c2}" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="260" r="${r}" fill="url(#${g})"><animate attributeName="r" values="${r - 10};${r + 10};${r - 10}" dur="${dur}" repeatCount="indefinite"/></circle>`;
  const pts = [[120, 180], [285, 215], [135, 360], [276, 372], [168, 120], [240, 140], [112, 280], [296, 300]];
  const ch = { dot: (x, y) => `<circle cx="${x}" cy="${y}" r="2.5" fill="${c}">`, star: (x, y) => `<text x="${x}" y="${y}" font-size="14" fill="${c}" text-anchor="middle">✦`, petal: (x, y) => `<text x="${x}" y="${y}" font-size="14" text-anchor="middle">🌸`, flame: (x, y) => `<text x="${x}" y="${y}" font-size="15" text-anchor="middle">🔥`, snow: (x, y) => `<text x="${x}" y="${y}" font-size="14" text-anchor="middle">❄️`, bolt: (x, y) => `<text x="${x}" y="${y}" font-size="15" text-anchor="middle">⚡`, leaf: (x, y) => `<text x="${x}" y="${y}" font-size="14" text-anchor="middle">🍃`, kanji: (x, y) => `<text x="${x}" y="${y}" font-size="15" fill="${c}" font-weight="bold" text-anchor="middle">${"日月火水木金土山"[(x + y) % 8]}` };
  pts.forEach(([x, y], i) => { const f = ch[p](x, y); const close = f.startsWith("<circle") ? "</circle>" : "</text>"; s += `${f}<animate attributeName="opacity" values="0;1;0" dur="${1.6 + (i % 4) * .3}s" begin="${(i * .25).toFixed(2)}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 6;0 -14;0 6" dur="${2 + (i % 3) * .5}s" repeatCount="indefinite"/>${close}`; });
  if (o.ring) s += `<ellipse cx="200" cy="270" rx="120" ry="34" fill="none" stroke="${c}" stroke-width="2" opacity=".7"><animateTransform attributeName="transform" type="rotate" from="0 200 270" to="360 200 270" dur="6s" repeatCount="indefinite"/></ellipse>`;
  return s;
}
const AURA = [
  ["merah", "❤️ Aura Merah Membara", "uncommon", { c: "#ef4444", p: "flame" }], ["biru", "💙 Aura Biru Samudra", "uncommon", { c: "#3b82f6" }],
  ["kuning", "💛 Aura Kuning Cerah", "uncommon", { c: "#facc15", p: "star" }], ["putih", "🤍 Aura Putih Suci", "rare", { c: "#ffffff", c2: "#cbd5e1", p: "star" }],
  ["sakura", "🌸 Aura Kelopak Sakura", "rare", { c: "#f9a8d4", p: "petal" }], ["daun", "🍃 Aura Angin Daun", "rare", { c: "#4ade80", p: "leaf" }],
  ["es", "❄️ Aura Salju Beku", "epic", { c: "#7dd3fc", c2: "#e0f2fe", p: "snow", ring: 1 }], ["petir", "⚡ Aura Petir Biru", "epic", { c: "#60a5fa", c2: "#facc15", p: "bolt", dur: "1.2s" }],
  ["gelap", "🖤 Aura Kegelapan", "epic", { c: "#7c3aed", c2: "#000000", p: "dot", ring: 1 }], ["kanji", "漢 Aura Aksara Kanji", "legendary", { c: "#fde047", p: "kanji", ring: 1 }],
  ["naga_api", "🐉 Aura Naga Api", "legendary", { c: "#f97316", c2: "#dc2626", p: "flame", ring: 1, r: 150 }], ["pelangi", "🌈 Aura Pelangi", "legendary", { c: "#f472b6", c2: "#60a5fa", p: "star", ring: 1, r: 150 }],
  ["galaxy", "🌌 Aura Galaksi", "mythic", { c: "#a78bfa", c2: "#1e1b4b", p: "star", ring: 1, r: 158 }], ["dewa", "☀️ Aura Dewa Matahari", "mythic", { c: "#fde047", c2: "#f97316", p: "star", ring: 1, r: 165, dur: "1.8s" }],
].map(([id, n, r, o]) => [id, n, r, () => aura(o)]);

/* ======================= SAYAP (hanya dari GACHA; level pakai naik sesuai kelangkaan) ======================= */
const PV = "translate(252 226)";
const FLAP = (inner, a = 4, dur = "2.6s") => `<g>${inner}<animateTransform attributeName="transform" type="rotate" values="${-a} 252 226;${a} 252 226;${-a} 252 226" dur="${dur}" repeatCount="indefinite"/></g>`;
/* PAIR: sayap kanan digambar, kiri = cermin. k = skala, flap = animasi kepak */
const PAIR = (inner, flap, k = 1.35) => { const g = `<g transform="translate(252 226) scale(${k}) translate(-252 -226)">${inner}</g>`; return `<g data-wing="1">${flap ? FLAP(g) : g}<g transform="translate(400 0) scale(-1 1)">${flap ? FLAP(g) : g}</g></g>`; };
const lens = (L, w) => `M0 0 C${L * .25} ${-w} ${L * .8} ${-w} ${L} 0 C${L * .8} ${w} ${L * .25} ${w} 0 0Z`;
const tier = (n, a0, a1, L, w, f, st, op = 1) => { let s = ""; for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * (n > 1 ? i / (n - 1) : 0), l = L * (.82 + .18 * Math.sin((i / Math.max(1, n - 1)) * Math.PI)); s += `<path d="${lens(l, w)}" fill="${f}" stroke="${st}" stroke-width="1.4" opacity="${op}" transform="${PV} rotate(${a})"/>`; } return s; };
/* sayap malaikat berlapis 3 tingkat (terinspirasi sayap bulu besar) */
const angel = (f1, f2, st) => tier(8, -102, 18, 175, 15, f2, st) + tier(7, -88, 6, 130, 14, f1, st) + tier(6, -72, -2, 86, 12, f1, st) + `<ellipse cx="256" cy="224" rx="16" ry="12" fill="${f1}" stroke="${st}" stroke-width="1.4"/>`;
function flameTier(n, a0, a1, L, w, fill, dur) { let s = ""; for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * (n > 1 ? i / (n - 1) : 0), l = L * (.82 + .18 * Math.sin((i / Math.max(1, n - 1)) * Math.PI)); s += `<path d="M0 0 C${l * .2} ${-w * 1.2} ${l * .5} ${-w * .4} ${l * .62} ${-w} C${l * .7} ${-w * .2} ${l * .85} ${-w * .6} ${l} 0 C${l * .7} ${w * .6} ${l * .3} ${w} 0 0Z" fill="${fill}" transform="${PV} rotate(${a})"><animate attributeName="opacity" values=".6;1;.6" dur="${(dur + (i % 3) * .3).toFixed(1)}s" repeatCount="indefinite"/></path>`; } return s; }
const phoenix = (c1, c2, c3) => { const g = U("gf"); return `<defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="${c1}"/><stop offset=".55" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/></linearGradient></defs>` + flameTier(8, -100, 16, 185, 18, `url(#${g})`, 1.0) + flameTier(7, -86, 6, 135, 16, `url(#${g})`, .8) + flameTier(5, -70, -4, 88, 13, c1, .7); };
/* sayap naga / gargoyle: membran bergerigi + tulang + cakar */
function dragon(mem, bone, glow) { const T = [[372, 96], [438, 160], [448, 246], [410, 322], [336, 356]]; const mid = (p, q) => [(p[0] + q[0]) / 2 * .86 + 252 * .14, (p[1] + q[1]) / 2 * .86 + 226 * .14];
  let m = `M252 226 L${T[0][0]} ${T[0][1]}`; for (let i = 1; i < T.length; i++) { const c = mid(T[i - 1], T[i]); m += ` Q${c[0].toFixed(0)} ${c[1].toFixed(0)} ${T[i][0]} ${T[i][1]}`; } m += " L268 300 Q258 262 252 226Z";
  return (glow ? `<path d="${m}" fill="${glow}" opacity=".35" transform="translate(0 0) scale(1.03)"/>` : "") + `<path d="${m}" fill="${mem}" stroke="${bone}" stroke-width="2.2"/>` + T.map(t => `<path d="M252 226 L${t[0]} ${t[1]}" stroke="${bone}" stroke-width="5" stroke-linecap="round"/><path d="M${t[0]} ${t[1]} l5 -12 -12 6Z" fill="${bone}"/>`).join("") + `<path d="M252 226 Q300 160 372 96" stroke="${bone}" stroke-width="7" fill="none" stroke-linecap="round"/>`; }
const spirit = (f, st) => tier(7, -98, 14, 172, 11, f, st, .6) + tier(6, -84, 4, 124, 11, f, st, .7) + tier(5, -66, -2, 80, 10, "#fff", st, .8);
const crystal = (f, st, n = 7) => { let s = ""; for (let i = 0; i < n; i++) { const a = -95 + i * (130 / (n - 1)), k = 1 + .25 * Math.sin((i / (n - 1)) * Math.PI), L = 170 * k; s += `<path d="M0 -6 L${L - 20} -10 L${L} 0 L${L - 20} 10 L0 6Z" fill="${f}" stroke="${st}" stroke-width="1.5" opacity=".92" transform="${PV} rotate(${a})"/>`; } return s + `<circle cx="252" cy="226" r="9" fill="${f}" stroke="${st}" stroke-width="1.5"/>`; };
const wingFeather = (f, st, n = 9, span = 150, big = 1) => tier(n, -90, -90 + span, 120 * big, 14, f, st);
const wingBat = (m, bone) => dragon(m, bone);
const wingLeaf = (f, vein, n = 6) => { let s = ""; for (let i = 0; i < n; i++) { const a = -88 + i * (125 / (n - 1)), k = .85 + .25 * Math.sin((i / (n - 1)) * Math.PI); s += `<g transform="${PV} rotate(${a}) scale(${k})"><path d="M0 0 Q60 -34 140 0 Q60 34 0 0Z" fill="${f}" stroke="${vein}" stroke-width="1.5"/><path d="M6 0 H128" stroke="${vein}" stroke-width="1.5"/></g>`; } return s; };
const wingCrystal = (f, st, n = 6) => crystal(f, st, n);
const wingWind = (c, n = 5) => { let s = ""; for (let i = 0; i < n; i++) { const a = -85 + i * (120 / Math.max(1, n - 1)); s += `<path d="M0 0 Q70 ${-34 + i * 5} 160 ${-12 + i * 4} Q80 ${10 + i * 4} 0 0Z" fill="${c}" opacity=".55" stroke="#fff" stroke-width="1.5" transform="${PV} rotate(${a})"><animate attributeName="opacity" values=".25;.75;.25" dur="${1.4 + i * .25}s" repeatCount="indefinite"/></path>`; } return s; };
const wingFlame = (c1, c2) => phoenix(c1, c2, c1);
const paperWing = (f, st) => `<path d="M252 226 L336 150 L350 232 L318 262 L330 304 L270 270Z" fill="${f}" stroke="${st}" stroke-width="2"/><path d="M252 226 L350 232 M252 226 L318 262" stroke="${st}" stroke-width="1.2" opacity=".7"/>`;
const WING = [
  ["kardus", "Sayap Kardus", "common", () => PAIR(paperWing("#c8a06b", "#7c5a2a"), 0, 1.5)], ["kertas", "Sayap Kertas Origami", "common", () => PAIR(paperWing("#f8fafc", "#94a3b8"), 0, 1.5)],
  ["plastik", "Sayap Plastik Kresek", "common", () => PAIR(paperWing("#fecaca", "#dc2626"), 0, 1.5)], ["kain_lusuh", "Sayap Kain Lusuh", "common", () => PAIR(dragon("#a8a29e", "#57534e"), 0, 1.0)],
  ["ayam", "Sayap Ayam", "common", () => PAIR(tier(6, -70, 10, 70, 11, "#f5e6c8", "#a8854a"), 0, 1.4)], ["bebek_karet", "Sayap Bebek Karet", "common", () => PAIR(tier(5, -60, 10, 60, 11, "#fde047", "#a16207"), 0, 1.4)],
  ["daun", "Sayap Daun Hutan", "uncommon", () => PAIR(wingLeaf("#4ade80", "#166534"), 1)], ["capung", "Sayap Capung", "uncommon", () => PAIR(`<path d="M252 226 Q330 176 372 208 Q330 240 252 230Z M252 232 Q326 256 360 300 Q312 296 252 236Z" fill="#a5f3fc" opacity=".6" stroke="#0891b2" stroke-width="1.5"/>`, 1)],
  ["angin", "Sayap Angin Puyuh", "rare", () => PAIR(wingWind("#d1fae5"), 1)], ["es", "Sayap Es Kristal", "rare", () => PAIR(wingCrystal("#bae6fd", "#0284c7"), 1)],
  ["daun_besar", "Sayap Pohon Dunia", "rare", () => PAIR(wingLeaf("#22c55e", "#14532d", 9), 1)], ["badai", "Sayap Angin Badai", "epic", () => PAIR(wingWind("#93c5fd", 8), 1)],
  ["api", "Sayap Api", "epic", () => PAIR(wingFlame("#facc15", "#dc2626"), 1)], ["gargoyle", "Sayap Gargoyle", "epic", () => PAIR(dragon("#4b5563", "#111827"), 1)],
  ["gargoyle_batu", "Sayap Gargoyle Batu Hitam", "legendary", () => PAIR(dragon("#1f2937", "#9ca3af", "#ef4444") + `<circle cx="372" cy="96" r="5" fill="#ef4444"/>`, 1)], ["malaikat", "Sayap Malaikat Agung", "legendary", () => PAIR(angel("#ffffff", "#fef3c7", "#d4a017"), 1)],
  ["phoenix", "Sayap Phoenix Abadi", "legendary", () => PAIR(phoenix("#fde047", "#f97316", "#dc2626"), 1)], ["naga_es", "Sayap Naga Es Bangsawan", "legendary", () => PAIR(dragon("#7dd3fc", "#0369a1", "#e0f2fe"), 1)],
  ["galaxy", "Sayap Galaksi", "mythic", () => PAIR(angel("#4c1d95", "#312e81", "#c4b5fd") + `<g fill="#fff"><circle cx="330" cy="150" r="2"/><circle cx="352" cy="214" r="2"/><circle cx="300" cy="250" r="1.6"/><circle cx="388" cy="170" r="2"/></g>`, 1)],
  ["dewa_angin", "Sayap Dewa Roh Biru", "mythic", () => PAIR(spirit("#67e8f9", "#0e7490") + `<path d="M372 120 l-10 28 12 4-12 28" stroke="#fde047" stroke-width="3" fill="none"><animate attributeName="opacity" values="0;1;0" dur=".9s" repeatCount="indefinite"/></path>`, 1)],
].map(([id, n, r, f]) => [id, n, r, f]);
/* level pakai & harga sayap (tidak dijual di shop — hanya gacha; harga = nilai tampilan) */
const WING_LV = { common: 50, uncommon: 50, rare: 55, epic: 62, legendary: 75, mythic: 90 };
const WING_HARGA = { common: 15000, uncommon: 25000, rare: 45000, epic: 80000, legendary: 150000, mythic: 300000 };
const EPIC_UP = { common: "epic", uncommon: "epic", rare: "epic", epic: "epic", legendary: "legendary", mythic: "mythic" };
/* Semua sayap minimal EPIC (langka di gacha); level & harga mengikuti kelangkaan asli desainnya; semua dijual di shop */
const buildWings = (list, pre) => { const o = build(list, pre || "sy_"); Object.values(o).forEach(x => { x.unlock_lv = WING_LV[x.rarity]; x.harga = WING_HARGA[x.rarity]; x.rarity = EPIC_UP[x.rarity]; x.gachaOnly = false; }); return o; };

/* ======================= EKSPOR ======================= */
export const H = { SK, mk, build, U, outfit, pants, shoe, aura, blade, gl, orb, staff, PAIR, FLAP, wingFeather, wingBat, wingLeaf, wingCrystal, wingWind, wingFlame, paperWing, buildWings, tier, angel, phoenix, dragon, spirit, crystal };
export function extend(C) {
  Object.assign(C.OUTFITS, build(OUT, "o_"));
  Object.assign(C.SHOES, build(SHOESL, "sh_"));
  Object.assign(C.ACCESSORIES, build(ACCS, "ac_"));
  Object.assign(C.HANDHELD, build(HOLD, "hh_"));
  Object.assign(C.AURAS, build(AURA, "au_"));
  C.CELANA = { none: { nama: "Tidak memakai celana (default)", harga: 0, equipped_default: true, svg: null }, ...build(PANTS, "cl_") };
  C.SAYAP = { none: { nama: "Tanpa sayap (default)", harga: 0, equipped_default: true, svg: null }, ...buildWings(WING) };
}
