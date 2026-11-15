/* Gacha: logika murni (tanpa I/O) — dipakai Worker & simulasi. RNG HARUS dari server (crypto). */
import { ITEMS } from "./gacha-items.js";
function poolDari(items) { const p = { common: [], uncommon: [], rare: [], epic: [], legendary: [], mythic: [] }; items.forEach(x => p[x.rarity] && p[x.rarity].push(x.id)); return p; }
export const CONFIG = {
  // ⚠ USULAN harga — tinjau sebelum produksi.
  PRICE_1: 100, PRICE_10: 900,
  RARITY: [ // persen, total 100
    { id: "common", pct: 40 }, { id: "uncommon", pct: 28 }, { id: "rare", pct: 18 },
    { id: "epic", pct: 9 }, { id: "legendary", pct: 4.9 }, { id: "mythic", pct: 0.1 },
  ],
  PITY_EPIC: 20,       // maks 20 tarikan tanpa epic+  → epic dijamin
  PITY_LEGENDARY: 80,  // maks 80 tarikan tanpa legendary+ → legendary dijamin
  // Hadiah per rarity: barang SHOP + tema (dibangun dari cloudflare/gacha-items.js).
  POOL: poolDari(ITEMS),
  DUP_REFUND: { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0, mythic: 0 },   // tanpa cashback untuk duplikat
};
const ORDER = CONFIG.RARITY.map(r => r.id);
const rank = (id) => ORDER.indexOf(id);
export function secureRandom() { const b = new Uint32Array(2); crypto.getRandomValues(b); return (b[0] * 2 ** 21 + (b[1] >>> 11)) / 2 ** 53; }
/* pity: {sinceEpic, sinceLegend}. rnd: () => [0,1). Mengembalikan {rarity,item,pity}. */
export function rollOnce(pity, rnd = secureRandom, C = CONFIG) {
  let r = rnd() * 100, acc = 0, rar = C.RARITY[0].id;
  for (const x of C.RARITY) { acc += x.pct; if (r < acc) { rar = x.id; break; } }
  const se = (pity.sinceEpic || 0) + 1, sl = (pity.sinceLegend || 0) + 1;
  if (sl >= C.PITY_LEGENDARY && rank(rar) < rank("legendary")) rar = rnd() < C.RARITY[C.RARITY.length - 1].pct / (C.RARITY[C.RARITY.length - 1].pct + C.RARITY[C.RARITY.length - 2].pct) ? "mythic" : "legendary";
  else if (se >= C.PITY_EPIC && rank(rar) < rank("epic")) rar = "epic";
  const pool = C.POOL[rar]; const item = pool[Math.floor(rnd() * pool.length)];
  return { rarity: rar, item, pity: { sinceEpic: rank(rar) >= rank("epic") ? 0 : se, sinceLegend: rank(rar) >= rank("legendary") ? 0 : sl } };
}
/* n tarikan; inv = Set/array item yang sudah dimiliki. Duplikat jadi refund koin. */
export function rollMany(n, pity, inv, rnd = secureRandom, C = CONFIG) {
  const own = new Set(inv || []); const out = []; let p = { ...pity }, refund = 0;
  for (let i = 0; i < n; i++) {
    const r = rollOnce(p, rnd, C); p = r.pity;
    const dup = own.has(r.item); if (dup) refund += C.DUP_REFUND[r.rarity]; else own.add(r.item);
    out.push({ rarity: r.rarity, item: r.item, dup });
  }
  return { results: out, pity: p, refund, inv: [...own] };
}

/* Akun gratis (moderator / koin tak terbatas): tarikan tidak memotong koin, tapi peluang lebih rendah & tanpa pity. */
export const CONFIG_FREE = { ...CONFIG, RARITY: [
  { id: "common", pct: 70 }, { id: "uncommon", pct: 22 }, { id: "rare", pct: 6.5 },
  { id: "epic", pct: 1.3 }, { id: "legendary", pct: 0.19 }, { id: "mythic", pct: 0.01 },
], PITY_EPIC: 1e9, PITY_LEGENDARY: 1e9 };
