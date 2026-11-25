// PELAJARAN 授業 (halaman siswa) — dua isi: HAFALAN (deck kosakata buatan guru) dan SOAL (pilihan ganda A–D + penjelasan).
// Semuanya diterbitkan guru per kelas. Mesin hafalan dipakai bersama dashboard guru (js/deck-teacher.js, mode hanya-baca untuk siswa).
// Akses menu (field Firestore tetap "aksesHafalan"): siswa.aksesHafalan (true/false) > kelas.aksesHafalan === true > TERTUTUP. Guru selalu boleh.
// Siswa tanpa akses tidak melihat menu ini sama sekali (kartunya disembunyikan, bukan digembok).
let FB = null, _kelas = null, _tab = "hafalan";
export function initDeckSiswa(fb) { FB = fb; }
const S = () => window.__SHIROSE_STATE || window.state || {};
export async function bolehPelajaran() {
  if (FB && FB.userIsGuru()) return true;
  const s = S().siswa || {};
  if (typeof s.aksesHafalan === "boolean") return s.aksesHafalan;
  const nama = String(s.kelas || "").trim(); if (!nama) return false;
  try { if (!_kelas) _kelas = await FB.listKelas(); } catch (e) { return false; }
  const k = _kelas.find(x => String(x.nama || "").trim() === nama);
  return !!k && k.aksesHafalan === true;
}
export const bolehHafalan = bolehPelajaran;   // nama lama (kompatibel)
const V = "20261126a";
const CSS = `
.pj{--pj:#4cc9f0}
.pj .pj-top{display:flex;align-items:center;gap:12px;margin-bottom:14px;padding:14px 16px;border-radius:16px;background:linear-gradient(135deg,rgba(76,201,240,.18),rgba(139,92,246,.18));border:1px solid rgba(76,201,240,.35)}
.pj .pj-top .pj-k{font-size:34px;font-weight:900;line-height:1;color:var(--pj)}
.pj .pj-top b{font-size:18px}.pj .pj-top small{display:block;color:var(--gray,#aaa);margin-top:2px}
.pj .pj-tabs{display:flex;gap:8px;margin-bottom:14px}
.pj .pj-tab{flex:1;padding:12px 10px;border-radius:12px;border:2px solid var(--border-light,#4b3b86);background:var(--navy-2,#241a4d);color:var(--white,#fff);font:inherit;font-weight:800;font-size:15px;cursor:pointer}
.pj .pj-tab.on{border-color:var(--pj);background:rgba(76,201,240,.16);color:var(--pj)}
`;
const ensureCss = () => { if (document.getElementById("pj-css")) return; const st = document.createElement("style"); st.id = "pj-css"; st.textContent = CSS; document.head.appendChild(st); };
const ctxSiswa = () => ({ toast: t => (window.toast ? window.toast(t) : console.log(t)), kelas: String((S().siswa && S().siswa.kelas) || "").trim(), guru: FB.userIsGuru() });
async function isiTab(t) {
  if (t === "soal") { const m = await import("./soal-siswa.js?v=" + V); return m.renderSoalSiswa(FB, ctxSiswa()); }
  const m = await import("./deck-teacher.js?v=20261125a"); return m.renderDeckSiswa(FB, ctxSiswa());
}
const kepala = (t) => `<div class="pj-top"><span class="pj-k">授業</span><div><b>Pelajaran · Jyugyou</b><small>Materi dari gurumu untuk kelasmu</small></div></div>
  <div class="pj-tabs"><button class="pj-tab ${t === "hafalan" ? "on" : ""}" onclick="pjTab('hafalan')">🗂️ Hafalan</button><button class="pj-tab ${t === "soal" ? "on" : ""}" onclick="pjTab('soal')">📝 Soal</button></div>`;
export const DECK_ROUTES = {
  pelajaran: async () => {
    if (!(await bolehPelajaran())) return `<div class="panel"><div class="empty"><div class="emoji">📭</div>Menu Pelajaran tidak tersedia untuk akunmu.</div><button class="btn" onclick="route('pilih-level')">← Kembali</button></div>`;
    ensureCss();
    window.pjTab = async (t) => {
      _tab = t === "soal" ? "soal" : "hafalan"; const body = document.getElementById("pj-body"); if (!body) return;
      document.querySelectorAll(".pj-tab").forEach((b, i) => b.classList.toggle("on", (i === 1) === (_tab === "soal")));
      body.innerHTML = '<div class="loading">Memuat…</div>'; body.innerHTML = await isiTab(_tab);
    };
    return `<div class="pj">${kepala(_tab)}<div id="pj-body">${await isiTab(_tab)}</div></div>`;
  },
};
DECK_ROUTES.anki = DECK_ROUTES.pelajaran;   // alamat lama (#anki) tetap jalan
export const DECK_PUBLIC = Object.keys(DECK_ROUTES);
