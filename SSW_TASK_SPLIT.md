# SSW — Audit terbaru & pembagian tugas 3 chat (2026-11-17)

Dokumen koordinasi untuk 3 chat Claude yang mengerjakan repo ini. **Baca dulu sebelum mulai; centang/perbarui bagian milik chat sendiri.**

## 1. Audit isi aplikasi (data/ssw, per 2026-11-17)
| Bidang (slug) | Bab | Kosakata | Soal | PDF resmi | Catatan |
|---|---:|---:|---:|---:|---|
| building-cleaning | 3 | 1158 | 629 | 0 | alat; ujian resmi MHLW ada di spec |
| kaigo / kaigo-jp | 4 / 3 | 280 / 222 | 204 / 178 | 0 | kuis "arti kosakata" dihapus (sesi lain) |
| food-manufacturing | 3 | 1463 | 478 | 0 | |
| food-service / -jp | 3 / 3 | 2463 / 634 | 895 / 261 | 0 | |
| agriculture | 7 | 213 | 443 | 0 | |
| livestock | 3 | 54 | 221 | 0 | kosakata sedikit |
| fishery | 12 | 2370 | 380 | 0 | ujian resmi belum dipetakan |
| accommodation | 5 | 1095 | 546 | 0 | |
| construction (+bangunan, +lifeline) | 7 | ±4400 | 961–1127 | 0 | |
| auto-maintenance | 4 | 469 | 712 | 6 | 208 kosakata punya fungsi; 96+16 soal gaya JASPA |
| auto-transport (Truk & Bus) | 5 | 167 | 126 | 2 | |
| wood-industry | 4 | 168 | 129 | 2 | |
| jaim-machine-metal | 10 | 110 | 167 | 3+2 | buku resmi JAIM ID+JP |
| jaim-elec-electronic | 12 | 121 | 129 | 3+2 | |
| jaim-metal-surface | 13 | 140 | 192 | 3+2 | |

Modul buatan sendiri `industrial-mfg` & `mfg-machine-metal` **sudah dihapus pemilik** (commit 0b9cd871): jangan dibuat ulang; manufaktur hanya dari buku/soal resmi JAIM.

### Celah utama
1. **Bidang resmi yang belum ada sama sekali:** 造船・舶用工業 (Shipbuilding), 航空 (Aviation), 鉄道 (Railway), 林業 (Forestry). (16 bidang tokutei ginou resmi; di app baru 12 + 3 JAIM.)
2. **Manufaktur 工業製品製造業:** baru 3 dari 17 区分 1号 yang punya buku/soal (機械金属加工, 電気電子機器組立て, 金属表面処理). Contoh soal resmi 14 区分 lain (dan 2号) sudah diunduh di `assets/ssw/industrial-mfg/pdf/` tapi **belum tampil di app** (PDF_SUMBER hanya memuat 3 区分 di jaim-*).
3. **Auto Maintenance:** fungsi untuk 261 kosakata belum ada; flashcard gambar per-komponen (crop) belum; contoh soal 2号 JASPA belum dipelajari untuk soal 4-pilihan; sumber resmi baru MLIT/JASPA (bab sistem kendaraan) belum jadi bab.
4. **Label & review:** soal/kosakata buatan Shirose belum berlabel OFFICIAL vs ORIGINAL di UI; semua teks "fungsi"/arti buatan Shirose butuh review ahli.
5. **Ujian resmi per bidang:** `EXAM_SPEC` (js/ssw-core.js) belum diverifikasi ke sumber untuk: fishery, livestock, wood-industry, auto-transport, accommodation, kaigo, building-cleaning, food-*, agriculture (yang sudah terverifikasi: auto-maintenance 1号/2号, manufaktur 1号/2号 — lihat SSW_SOURCE_REGISTRY.json).
6. **Pengujian UI:** belum ada uji klik end-to-end (butuh login siswa); belum ada cek ukuran/performa (repo assets ±400 MB; PDF besar).
7. **Sumber belum lengkap:** SRC-021 (halaman web MOJ) tanpa PDF; sswm.go.jp tak bisa diakses dari PC user (DNS) — pakai jaim-skill.or.jp.

## 2. Pembagian tugas (tiap lane = kepemilikan file, supaya tidak bentrok)
### Lane A — "Sumber & bidang baru + Auto Maintenance" (chat ini / Chat 1)
Memiliki: `ssw-materials/`, `SSW_SOURCE_REGISTRY.*`, `data/ssw/auto-maintenance/`, `tools/ssw/automaint_*`, `tools/ssw/quiz_official_build.py`, `tools/ssw/quiz_auto_*`, bidang baru.
- [ ] Cari & unduh sumber resmi untuk Shipbuilding, Aviation, Railway, Forestry (MLIT/MAFF/METI/MOJ; via Chrome user, klik asli); catat di registry; ekstrak teks.
- [ ] Bangun bidang baru dari sumber resmi (bab, kosakata, soal) setelah sumbernya ada — jangan mengarang.
- [ ] Auto Maintenance: fungsi 261 kosakata sisa, soal 4-pilihan gaya 2号 (dari cakupan SRC-032), bab sistem kendaraan dari sumber resmi, crop gambar per-komponen.
- [ ] Verifikasi `EXAM_SPEC` bidang non-manufaktur terhadap sumber resmi (tulis hasil di registry), kirim daftar koreksi ke Lane C untuk diterapkan di ssw-core.js.

### Lane B — "Manufaktur JAIM + bidang buku resmi" (chat Chat2 / JAIM)
Memiliki: `data/ssw/jaim-*`, `assets/ssw/jaim-*`, `tools/imm/`, `assets/ssw/industrial-mfg/pdf/` (contoh soal 17 区分), `data/ssw/wood-industry`, `auto-transport`, `fishery`, `livestock`.
- [ ] Tampilkan contoh soal resmi 14 区分 lain + 2号 (file sudah ada) — mis. bidang `jaim-sample` atau tombol di halaman JAIM; pilih satu cara dan beri tahu Lane C.
- [ ] Parse contoh soal resmi (SRC-040..043, JAIM-sample*) jadi set "soal resmi" berlabel OFFICIAL (hak cipta JAIM, tampilkan sumber) untuk 区分 selain 3 yang sudah ada.
- [ ] Lengkapi kosakata/glosarium & soal 2号 untuk 3 区分 JAIM; periksa errata (正誤表: `assets/ssw/jaim-*/pdf/errata-jp.pdf`) terhadap buku yang sudah dirender.
- [ ] Wood / Truk-Bus / Fishery / Livestock: perdalam soal dari teks resmi, tambah kosakata Livestock (54 → ratusan).

### Lane C — "Platform, UI & QA" (chat Sswnoou / UI)
Memiliki: `index.html`, `js/ssw.js`, `js/ssw-core.js`, `js/ssw-art.js`, `sw.js`, shop/gacha/hafalan/Rangkuman.
- [ ] Uji klik end-to-end SSW (login siswa): peta bidang → bab → kuis → flashcard → ujian penuh; laporkan/perbaiki bug.
- [ ] Label OFFICIAL / ORIGINAL / DRAFT di tiap soal & kosakata (field `status_validasi`, `sumber`) dan tampilkan di UI.
- [ ] Terapkan koreksi `EXAM_SPEC` dari Lane A; ujian penuh meniru format resmi (jumlah soal, waktu, ambang lulus).
- [ ] Performa: kompres/lazy-load PDF & gambar besar, pastikan deploy Pages tidak 503 (assets ±400 MB), cek `sw.js` cache.
- [ ] Tombol PDF (`PDF_SUMBER`) dan viewer: dua bahasa, mobile, link rusak.

## 3. Aturan kerja bersama
- Jangan edit file milik lane lain; kalau perlu, tulis permintaan di bagian "Permintaan antar-lane" di bawah.
- Sebelum push: `git pull --rebase origin main`; konflik `sw.js` → ambil versi remote lalu naikkan angka CACHE +1.
- Setiap perubahan konten: tulis di `SSW_DEVELOPMENT_PROGRESS.md` dengan judul chat sendiri (tanggal + file + sumber).
- Konten buatan sendiri wajib ditandai ORIGINAL LEARNING CONTENT / perlu review ahli; angka & aturan ujian hanya dari sumber di registry.
- Jangan membuat ulang modul manufaktur buatan sendiri yang sudah dihapus pemilik.
- Unduhan PDF dari situs pemerintah: lewat Chrome user dengan **klik asli** (script-download tidak disimpan Chrome); satu klik = satu file.

## 4. Permintaan antar-lane
(isi di sini; format: `[dari → ke] permintaan — tanggal`)
[Lane A → Lane C] Halaman `dokumen-resmi.html` (PDF resmi logistik, daur ulang, kehutanan di `assets/ssw/docs-resmi/`) sudah live; mohon tambahkan link 'Dokumen resmi' di hub SSW untuk bidang yang belum punya konten, dan tambahkan ke precache sw.js bila perlu — 2026-11-17
