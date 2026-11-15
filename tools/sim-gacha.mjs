import { rollMany, CONFIG } from "../cloudflare/gacha-core.js";
const N = 200000, cnt = {}; let pity = { sinceEpic: 0, sinceLegend: 0 }, inv = [], maxGap = 0, gap = 0, maxLG = 0, lg = 0;
const r = rollMany(N, pity, [], Math.random);
for (const x of r.results) { cnt[x.rarity] = (cnt[x.rarity] || 0) + 1; gap = (x.rarity === "epic" || x.rarity === "legendary" || x.rarity === "mythic") ? 0 : gap + 1; maxGap = Math.max(maxGap, gap); lg = (x.rarity === "legendary" || x.rarity === "mythic") ? 0 : lg + 1; maxLG = Math.max(maxLG, lg); }
console.log("tarikan", N); for (const k of Object.keys(CONFIG.DUP_REFUND)) console.log(k.padEnd(10), ((cnt[k] || 0) / N * 100).toFixed(3) + "%");
console.log("maks tarikan tanpa epic+", maxGap, "(batas", CONFIG.PITY_EPIC + ")", "| tanpa legendary+", maxLG, "(batas", CONFIG.PITY_LEGENDARY + ")");
console.log("rata2 biaya per legendary+ (koin, harga satuan):", Math.round(N / ((cnt.legendary || 0) + (cnt.mythic || 0)) * CONFIG.PRICE_1));
