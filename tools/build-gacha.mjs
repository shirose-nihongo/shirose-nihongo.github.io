/* Bangun daftar hadiah gacha: barang SHOP (js/shop-seed.js) + tema. Jalankan: node tools/build-gacha.mjs
 * Output: cloudflare/gacha-items.js  dan  cloudflare/gacha-worker.bundle.js (satu file, siap ditempel ke dashboard Cloudflare). */
import fs from "fs";
import { allShopItems } from "../js/shop-seed.js";
const THEMES = [ // tema: lebih sulit didapat daripada barang biasa (epic/legendary saja)
  ["ungu", "Tema Ungu", "epic"], ["cerah", "Tema Cerah", "epic"], ["hujan", "Tema Hujan", "epic"],
  ["salju", "Tema Salju", "legendary"], ["panas", "Tema Musim Panas", "legendary"], ["badai", "Tema Badai", "legendary"],
  ["gugur", "Tema Gugur", "legendary"], ["semi", "Tema Semi", "legendary"],
];
const items = [
  ...allShopItems(true).map(x => ({ id: x.id, nama: x.nama, rarity: x.rarity, kind: "shop", kat: x.kategori_label || x.kategori, harga: x.harga })),
  ...THEMES.map(([t, n, r]) => ({ id: "theme_" + t, nama: n, rarity: r, kind: "theme" })),
];
fs.writeFileSync("cloudflare/gacha-items.js", "/* DIHASILKAN oleh tools/build-gacha.mjs — jangan edit manual */\nexport const ITEMS = " + JSON.stringify(items, null, 1) + ";\n");
const strip = (s) => s.replace(/^import .*$/gm, "").replace(/^export default /gm, "const __worker = ").replace(/^export /gm, "");
const core = strip(fs.readFileSync("cloudflare/gacha-core.js", "utf8")), itemsJs = strip(fs.readFileSync("cloudflare/gacha-items.js", "utf8"));
let w = strip(fs.readFileSync("cloudflare/gacha-worker.js", "utf8"));
fs.writeFileSync("cloudflare/gacha-worker.bundle.js", itemsJs + "\n" + core + "\n" + w + "\nexport default __worker;\n");
console.log("item:", items.length, items.reduce((m, x) => (m[x.rarity] = (m[x.rarity] || 0) + 1, m), {}));
