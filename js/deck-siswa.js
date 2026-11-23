// HAFALAN 暗記 (halaman siswa) — deck kosakata buatan guru, diterbitkan per kelas.
// Mesin belajar dipakai bersama dashboard guru (js/deck-teacher.js, mode hanya-baca untuk siswa).
// Akses menu: siswa.aksesHafalan (true/false) > kelas.aksesHafalan (false = tutup) > terbuka. Guru selalu boleh.
let FB = null, _kelas = null;
export function initDeckSiswa(fb) { FB = fb; }
const S = () => window.__SHIROSE_STATE || window.state || {};
export async function bolehHafalan() {
  if (FB && FB.userIsGuru()) return true;
  const s = S().siswa || {};
  if (typeof s.aksesHafalan === "boolean") return s.aksesHafalan;
  const nama = String(s.kelas || "").trim(); if (!nama) return true;
  try { if (!_kelas) _kelas = await FB.listKelas(); } catch (e) { return true; }
  const k = _kelas.find(x => String(x.nama || "").trim() === nama);
  return !k || k.aksesHafalan !== false;
}
export const DECK_ROUTES = {
  anki: async () => {
    if (!(await bolehHafalan())) return `<div class="panel"><h2>🔒 Hafalan dikunci</h2><div class="empty"><div class="emoji">🔒</div>Gurumu belum membuka menu Hafalan untuk akunmu atau kelasmu.<br>Hubungi guru untuk membukanya.</div><button class="btn" onclick="route('pilih-level')">← Kembali</button></div>`;
    const m = await import("./deck-teacher.js?v=20261123h");
    return m.renderDeckSiswa(FB, { toast: t => (window.toast ? window.toast(t) : console.log(t)), kelas: String((S().siswa && S().siswa.kelas) || "").trim(), guru: FB.userIsGuru() });
  },
};
export const DECK_PUBLIC = Object.keys(DECK_ROUTES);
