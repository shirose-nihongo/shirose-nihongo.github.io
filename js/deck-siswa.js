// HAFALAN 暗記 (halaman siswa) — deck kosakata buatan guru, diterbitkan per kelas.
// Mesin belajar dipakai bersama dashboard guru (js/deck-teacher.js, mode hanya-baca untuk siswa).
let FB = null;
export function initDeckSiswa(fb) { FB = fb; }
const S = () => window.__SHIROSE_STATE || window.state || {};
export const DECK_ROUTES = {
  anki: async () => {
    const m = await import("./deck-teacher.js?v=20261123f");
    return m.renderDeckSiswa(FB, { toast: t => (window.toast ? window.toast(t) : console.log(t)), kelas: String((S().siswa && S().siswa.kelas) || "").trim(), guru: FB.userIsGuru() });
  },
};
export const DECK_PUBLIC = Object.keys(DECK_ROUTES);
