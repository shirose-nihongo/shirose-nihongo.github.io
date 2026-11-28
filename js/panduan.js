/* =====================================================================
 * Panduan Shirose Nihongo — satu sumber teks penjelasan.
 * Dipakai di landing (bagian #panduan) dan di aplikasi (popup setelah login).
 * Pilihan "Jangan tampilkan lagi" disimpan per akun di perangkat ini.
 * ===================================================================== */

export const MENU = {
  materi: { icon: "📚", jp: "学習", nama: "Materi", ringkas: "Tempat membaca pelajaran sesuai level yang kamu pilih.", poin: [
    "Isinya Kosakata, Kanji, dan Bunpou (pola kalimat).",
    "Ketuk satu item untuk membuka cara baca, arti, penjelasan, dan contoh kalimat.",
    "Kata yang mau diingat bisa disimpan ke Rangkuman lewat tombol ➕ Rangkum.",
  ] },
  hafalan: { icon: "🧠", jp: "暗記", nama: "Hafalan", ringkas: "Latihan menghafal dengan kartu yang diulang secara berjarak (SRS).", poin: [
    "Pilih jenis materi dan bagian yang mau dihafal.",
    "Kata yang sudah waktunya diulang bisa dilatih lagi, jadi tidak cepat lupa.",
    "Cocok dikerjakan sedikit-sedikit setiap hari.",
  ] },
  ujian: { icon: "📝", jp: "試験", nama: "Ujian", ringkas: "Menguji hasil belajarmu dengan soal berwaktu.", poin: [
    "Pilih kategori ujian, lalu kerjakan sampai dikumpulkan.",
    "Hasil sebelumnya tetap tersimpan, jadi kamu bisa membandingkan saat mengulang.",
    "Latihan ujian penuh JLPT ada di JLPT Center.",
  ] },
  choukai: { icon: "🎧", jp: "聴解", nama: "Choukai", ringkas: "Latihan mendengar untuk JLPT.", poin: [
    "Putar audio, lalu pilih jawaban.",
    "Soal dibagi per level dan per paket.",
    "Menu ini hanya muncul di JLPT. Di JFT, latihan mendengar ada di dalam Ujian dan Tryout.",
  ] },
  sylabus: { icon: "🗺️", jp: "目次", nama: "Silabus", ringkas: "Peta belajar: kamu tahu hari ini harus belajar apa.", poin: [
    "Silabus harian membagi materi sesuai target waktu yang kamu pilih.",
    "Hari berikutnya terbuka setelah hafalan dan ujian harian minimal 80% dan tanggal jadwalnya sudah tiba.",
    "Ganti tempo tidak menghapus materi yang sudah tuntas.",
  ] },
  rangkuman: { icon: "📒", jp: "記録", nama: "Rangkuman", ringkas: "Daftar kata pilihanmu sendiri.", poin: [
    "Tambahkan kata lewat tombol ➕ Rangkum di materi, contoh kalimat, atau hasil ujian.",
    "Kata di Rangkuman bisa dihafalkan lagi.",
    "Rangkuman JLPT, JFT, dan SSW dipisah. Kata yang tidak perlu bisa dihapus.",
  ] },
  shop: { icon: "🛒", jp: "商店", nama: "Shop", ringkas: "Tukar koin hasil belajar untuk mendandani karaktermu.", poin: [
    "Koin didapat dari kegiatan belajar.",
    "Ada rambut, pakaian, aksesori, sayap, aura, dan lainnya.",
    "Sebagian barang baru terbuka di level karakter tertentu.",
  ] },
  kalender: { icon: "📅", jp: "暦", nama: "Kalender", ringkas: "Catatan kegiatan belajarmu per hari.", poin: [
    "Lihat hari apa saja kamu belajar.",
    "Ketuk satu tanggal untuk melihat jumlah kanji, kosakata, latihan, dan ujian.",
    "Dipakai untuk menjaga streak belajar.",
  ] },
  leaderboard: { icon: "🏆", jp: "順位", nama: "Peringkat", ringkas: "Papan peringkat dari hasil belajar.", poin: [
    "Bisa melihat peringkat kelasmu atau semua kelas.",
    "Ketuk nama untuk melihat karakternya.",
    "Akun demo bisa melihat, tetapi tidak masuk peringkat.",
  ] },
};

export const PROGRAM = {
  jlpt: { icon: "🏯", jp: "日本語能力試験", nama: "JLPT", ringkas: "Persiapan ujian kemampuan bahasa Jepang, level N5 sampai N1.", poin: [
    "Pilih level dulu. Materi, hafalan, dan ujian mengikuti level itu.",
    "Menu utamanya: Materi, Hafalan, Ujian, Choukai, Silabus, Rangkuman, Shop, Kalender, dan Peringkat.",
    "JLPT Center berisi ujian penuh serta latihan Kanji, Kotoba, dan Bunpou.",
    "Level yang bergembok dibuka oleh guru.",
  ] },
  jft: { icon: "🏠", jp: "JFT-Basic", nama: "JFT", ringkas: "Persiapan JFT-Basic dengan materi Irodori: 入門, 初級1, dan 初級2.", poin: [
    "Pilih salah satu dari tiga tahap, lalu belajar kosakata, kanji, dan bunpou.",
    "JFT tidak punya menu Choukai sendiri, tetapi tetap ada latihan mendengar (聴解) di Ujian per bab, simulasi, dan Tryout.",
    "Tryout: 50 soal, 60 menit, 4 bagian. Audio bagian Listening hanya bisa diputar dua kali.",
    "Skor yang tampil adalah estimasi latihan, bukan skor resmi.",
  ] },
  ssw: { icon: "🏝️", jp: "特定技能", nama: "SSW", ringkas: "Belajar per bidang kerja Tokutei Ginou. Tidak perlu memilih level JLPT.", poin: [
    "Setiap pulau adalah satu bidang. Ketuk pulaunya, lalu masuk ke gedung (bab).",
    "Tiap bab punya Materi Lengkap dan Ringkasan, bisa dalam bahasa Jepang atau Indonesia.",
    "Latihannya: flashcard kosakata dan kuis. Progres belajarmu tercatat.",
    "Bidang yang bergembok dibuka oleh guru.",
  ] },
};

/* ---------------- Popup di aplikasi ---------------- */
const LS = "shirose-panduan";
let _uid = "tamu", _el = null;
const baca = () => { try { return JSON.parse(localStorage.getItem(LS) || "{}") || {}; } catch (e) { return {}; } };
const tulis = (v) => { try { localStorage.setItem(LS, JSON.stringify(v)); } catch (e) {} };
const _sesi = {};   // cadangan bila localStorage tidak bisa dipakai
export const dimatikan = (key) => !!(_sesi[_uid + ":" + key] || (baca()[_uid] || {})[key]);
function matikan(key) { _sesi[_uid + ":" + key] = 1; const v = baca(); (v[_uid] = v[_uid] || {})[key] = 1; tulis(v); }
export function nyalakanSemua() { for (const k of Object.keys(_sesi)) delete _sesi[k]; const v = baca(); delete v[_uid]; tulis(v); }

const CSS = `
.pd-bg{position:fixed;inset:0;z-index:100000;background:rgba(8,6,12,.72);display:flex;align-items:center;justify-content:center;padding:16px}
.pd-box{width:100%;max-width:440px;max-height:88vh;overflow:auto;background:#1d1830;color:#fff;border:1px solid rgba(255,255,255,.16);border-radius:18px;padding:20px;text-align:left;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.pd-box h2{margin:0 0 6px;font-size:21px;color:#fff}.pd-jp{font-size:12px;letter-spacing:2px;color:#ffb74d}
.pd-box p{margin:0 0 10px;font-size:14px;line-height:1.55;color:#e4e0f2}
.pd-box ul{margin:0 0 14px;padding-left:18px}.pd-box li{font-size:13.5px;line-height:1.55;margin-bottom:6px;color:#e4e0f2}
.pd-btn{display:block;width:100%;margin-top:8px;padding:11px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.22);background:transparent;color:#fff;font:inherit;font-weight:700;font-size:14px;cursor:pointer}
.pd-btn.utama{background:#e8742c;border-color:#e8742c}
.pd-btn.pilih{text-align:left}.pd-btn.pilih small{display:block;font-weight:400;font-size:12px;color:#c9c4dd;margin-top:2px}
.pd-note{font-size:11.5px!important;color:#aaa4c4!important;margin-top:10px!important;text-align:center}`;

export function tutup() { if (_el) { _el.remove(); _el = null; } }
function buka(html) {
  tutup();
  if (!document.getElementById("pd-css")) { const s = document.createElement("style"); s.id = "pd-css"; s.textContent = CSS; document.head.appendChild(s); }
  _el = document.createElement("div"); _el.className = "pd-bg";
  _el.innerHTML = `<div class="pd-box" role="dialog" aria-modal="true">${html}</div>`;
  document.body.appendChild(_el);
  return _el;
}
const isi = (d) => `<div class="pd-jp">${d.jp}</div><h2>${d.icon} ${d.nama}</h2><p>${d.ringkas}</p><ul>${d.poin.map(p => `<li>${p}</li>`).join("")}</ul>`;

/** Penjelasan satu menu / program. kembali = fungsi untuk balik ke daftar pilihan. */
function jelaskan(key, d, kembali) {
  const el = buka(`${isi(d)}
    <button type="button" class="pd-btn utama" data-a="ok">Mengerti (tampilkan lagi nanti)</button>
    <button type="button" class="pd-btn" data-a="off">Mengerti, jangan tampilkan lagi</button>
    ${kembali ? `<button type="button" class="pd-btn" data-a="back">← Pilih penjelasan lain</button>` : ""}`);
  el.onclick = (e) => {
    const a = e.target.closest("[data-a]")?.dataset.a; if (!a) return;
    if (a === "off") matikan(key);
    if (a === "back") return kembali();
    tutup();
  };
}

/** Pilihan "mau penjelasan yang mana": JLPT / JFT / SSW. */
export function pilihPanduan() {
  const el = buka(`<h2>👋 Mau penjelasan yang mana?</h2><p>Pilih salah satu. Kamu bisa membaca semuanya satu per satu.</p>
    ${Object.entries(PROGRAM).map(([k, d]) => `<button type="button" class="pd-btn pilih" data-p="${k}">${d.icon} ${d.nama}<small>${d.ringkas}</small></button>`).join("")}
    <button type="button" class="pd-btn utama" data-a="ok">Tutup (tampilkan lagi nanti)</button>
    <button type="button" class="pd-btn" data-a="off">Jangan tampilkan lagi</button>
    <button type="button" class="pd-btn" data-a="reset">🔄 Munculkan lagi semua penjelasan</button>
    <p class="pd-note">Tombol ❓ Panduan di halaman pilih level membuka daftar ini kapan saja.</p>`);
  el.onclick = (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.p) return jelaskan("program:" + b.dataset.p, PROGRAM[b.dataset.p], pilihPanduan);
    if (b.dataset.a === "off") matikan("pilih");
    if (b.dataset.a === "reset") { nyalakanSemua(); b.textContent = "✓ Semua penjelasan akan muncul lagi"; return; }
    tutup();
  };
}

const RUTE_MENU = { materi: "materi", hafalan: "hafalan", ujian: "ujian", "jft-ujian": "ujian", choukai: "choukai",
  sylabus: "sylabus", rangkuman: "rangkuman", "jft-rangkuman": "rangkuman", "ssw-rangkuman": "rangkuman",
  shop: "shop", kalender: "kalender", leaderboard: "leaderboard" };

let _terakhir = "";
/** Dipanggil aplikasi setiap pindah halaman. Popup hanya muncul saat MASUK ke halaman (bukan saat render ulang). */
export function panduanRute(name, { uid, level } = {}) {
  if (!uid) { _terakhir = ""; return tutup(); }
  _uid = uid;
  const tanda = uid + "|" + name;
  if (tanda === _terakhir) return;
  _terakhir = tanda;
  tutup();
  if (name === "pilih-level") { if (!dimatikan("pilih")) pilihPanduan(); return; }
  const program = name === "ssw" ? "ssw" : name === "jft" ? "jft" : name === "home" ? (String(level).startsWith("ir") ? "jft" : "jlpt") : null;
  if (program) { if (!dimatikan("program:" + program)) jelaskan("program:" + program, PROGRAM[program]); return; }
  const m = RUTE_MENU[name];
  if (m && !dimatikan("menu:" + m)) jelaskan("menu:" + m, MENU[m]);
}
