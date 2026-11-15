/* Gacha: logika murni (tanpa I/O) — dipakai Worker & simulasi. RNG HARUS dari server (crypto). */
import { ITEMS } from "./gacha-items.js";
function poolDari(items) { const p = { common: [], uncommon: [], rare: [], epic: [], legendary: [], mythic: [] }; items.forEach(x => p[x.rarity] && p[x.rarity].push(x.id)); return p; }
export const CONFIG = {
  // ⚠ USULAN harga — tinjau sebelum produksi.
  PRICE_1: 1000, PRICE_10: 9000,
  RARITY: [ // persen, total 100
    { id: "common", pct: 45 }, { id: "uncommon", pct: 30 }, { id: "rare", pct: 15 },
    { id: "epic", pct: 7 }, { id: "legendary", pct: 2.99 }, { id: "mythic", pct: 0.01 },
  ],
  PITY_EPIC: 30,       // maks 30 tarikan tanpa epic+  → epic dijamin
  PITY_LEGENDARY: 120, // maks 120 tarikan tanpa legendary+ → legendary dijamin
  // Hadiah per rarity: barang SHOP + tema (dibangun dari cloudflare/gacha-items.js).
  POOL: poolDari(ITEMS),
  DUP_REFUND: { common: 100, uncommon: 250, rare: 700, epic: 2000, legendary: 6000, mythic: 20000 },
};
const ORDER = CONFIG.RARITY.map(r => r.id);
const rank = (id) => ORDER.indexOf(id);
export function secureRandom() { const b = new Uint32Array(2); crypto.getRandomValues(b); return (b[0] * 2 ** 21 + (b[1] >>> 11)) / 2 ** 53; }
/* pity: {sinceEpic, sinceLegend}. rnd: () => [0,1). Mengembalikan {rarity,item,pity}. */
export function rollOnce(pity, rnd = secureRandom, C = CONFIG) {
  let r = rnd() * 100, acc = 0, rar = C.RARITY[0].id;
  for (const x of C.RARITY) { acc += x.pct; if (r < acc) { rar = x.id; break; } }
  const se = (pity.sinceEpic || 0) + 1, sl = (pity.sinceLegend || 0) + 1;
  if (sl >= C.PITY_LEGENDARY && rank(rar) < rank("legendary")) rar = rnd() < 0.01 / 3 ? "mythic" : "legendary";
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
