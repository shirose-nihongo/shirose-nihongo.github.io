/* Shop items that match character.js CATALOG. Seeded at runtime. */
import { CATALOG, CATALOG_LABELS } from "./character.js?v=20261118z6";

export const HARGA_FAKTOR = 0.5;
export function allShopItems(termasukGacha = false) {
  const out = [];
  for (const [kategori, items] of Object.entries(CATALOG)) {
    for (const [id, item] of Object.entries(items)) {
      if (item.equipped_default) continue;  // skip defaults (sudah owned)
      if (item.harga === 0) continue;
      if (item.gachaOnly && !termasukGacha) continue;   // sayap: hanya dari gacha
      out.push({
        kategori,
        kategori_label: CATALOG_LABELS[kategori],
        id,
        nama: item.nama,
        harga: Math.max(1, Math.round(item.harga * HARGA_FAKTOR)),   // diskon permanen 50% (ubah HARGA_FAKTOR untuk mengatur)
        rarity: item.rarity || "common",
        unlock_lv: item.unlock_lv || 1,
        gachaOnly: !!item.gachaOnly,
        g: item.g || null,
      });
    }
  }
  return out;
}
