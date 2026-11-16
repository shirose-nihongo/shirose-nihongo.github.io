# SSW Project Audit

Audit 16 Nov 2026. Semua angka dihitung langsung dari `data/ssw/<slug>/` dan `assets/ssw/<slug>/` (bukan disalin dari dokumen lama). Acuan pola: `docs/SSW-POLA-DAN-PETA-MODUL.md`; catatan kerja sebelumnya: `docs/SSW_AUTONOMOUS_PROGRESS.md`.

## Arsitektur yang sudah ada (tidak dibangun ulang)

- Frontend statis (GitHub Pages): `index.html` + `js/ssw-core.js` (data, progres, akses), `js/ssw.js` (UI), `js/ssw-teacher.js` (guru), `js/ssw-art.js`.
- Data per bidang: `data/ssw/<slug>/{index,babN,vocab,quiz}.json`. Gambar halaman: `assets/ssw/<slug>/{jp,id,fig,pdf}`.
- Auth, progres, XP/koin: Firebase (Firestore `siswa/{uid}/ssw_progres/{slug}`, SRS `ssw-<slug>`), konfigurasi guru `ssw_bidang/{slug}`.
- Hafalan: memakai mesin hafalan JLPT (flashcard, matching, pilihan ganda; gambar didukung lewat field `img`).
- Pembangun idempoten: `tools/ssw/*.py`.

## Inventaris per bidang

> Angka dihitung sebelum commit `f88805b` (kuis per subbab livestock, kaigo-jp, food-service-jp, dan perluasan soal bidang tipis oleh sesi lain). Jumlah soal bidang-bidang itu kini lebih besar; hitung ulang sebelum dipakai.

Kolom: bab, subbab, subbab berisi teks lengkap (`full`), kosakata, kelompok soal, butir soal, soal bergambar, PDF sumber tersimpan, halaman buku (webp).

| Bidang (slug) | Bab | Sub | Full | Kosakata | Kelompok | Soal | Bergambar | PDF | Hal. | Status |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|---|
| 自動車整備 auto-maintenance | 4 | 27 | 27 | 469 | 59 | 346 | 117 | 2 | 134 | NEEDS REVIEW |
| 工業製品製造業 industrial-mfg | 5 | 17 | 17 | 115 | 22 | 105 | 0 | 0 | 0 | PARTIAL |
| 機械金属加工 mfg-machine-metal | 2 | 4 | 4 | 20 | 6 | 28 | 0 | 0 | 0 | PARTIAL (tipis) |
| 介護 kaigo | 4 | 14 | 14 | 280 | 26 | 252 | 0 | 0 | 271 | NEEDS REVIEW |
| 介護 JP kaigo-jp | 3 | 14 | 14 | 222 | 16 | 133 | 24 | 0 | 0 | NEEDS REVIEW |
| ビルクリーニング building-cleaning | 3 | 40 | 40 | 1158 | 49 | 509 | 0 | 0 | 171 | COMPLETE* |
| 建設 construction (sipil) | 7 | 22 | 22 | 4424 | 43 | 781 | 38 | 0 | 273 | PARTIAL (Tutorial 5–7 belum) |
| 建設 construction-bangunan | 7 | 23 | 23 | 4392 | 44 | 947 | 47 | 0 | 274 | PARTIAL |
| 建設 construction-lifeline | 7 | 28 | 28 | 4426 | 49 | 858 | 46 | 0 | 333 | PARTIAL |
| 宿泊 accommodation | 5 | 18 | 18 | 1095 | 28 | 386 | 5 | 0 | 53 | NEEDS REVIEW |
| 農業 agriculture | 7 | 33 | 33 | 213 | 54 | 380 | 0 | 0 | 103 | PARTIAL |
| 漁業 fishery | 12 | 33 | 33 | 2370 | 45 | 236 | 0 | 0 | 292 | PARTIAL (ujian akhir resmi belum) |
| 飲食料品製造業 food-manufacturing | 3 | 15 | 15 | 1463 | 24 | 388 | 31 | 0 | 83 | NEEDS REVIEW |
| 外食業 food-service | 3 | 24 | 24 | 2463 | 58 | 805 | 26 | 0 | 273 | NEEDS REVIEW |
| 外食業 JP food-service-jp | 3 | 20 | 20 | 634 | 25 | 229 | 0 | 0 | 145 | NEEDS REVIEW |
| 畜産 livestock | 3 | 18 | 18 | 54 | 9 | 56 | 0 | 0 | 154 | PARTIAL (kosakata & soal tipis) |

\* Status COMPLETE belum diverifikasi ulang terhadap seluruh Definition of Done (lihat bagian Catatan). "NEEDS REVIEW" = isi ada tetapi validasi furigana/arti/kunci oleh manusia belum tercatat. Jumlah PDF hanya menghitung `assets/ssw/<slug>/pdf/*.pdf`; sumber lain (mis. modul kaigo, pertanian) dipakai untuk membangun halaman buku tetapi PDF aslinya tidak ada di repo.

## Bidang resmi yang belum ada sama sekali (MISSING)

Shipbuilding & Marine (造船・舶用工業), Aviation (航空), Automobile Transportation (自動車運送業), Railway (鉄道), Forestry (林業), Wood Industry (木材産業), serta bidang lain hasil audit klasifikasi terbaru (mis. linen supply, distribusi/pergudangan, daur ulang sumber daya) — daftar resmi terbaru harus diverifikasi dari sumber pemerintah sebelum dibuat.

## Kekurangan Jidousha Seibi (prioritas 1)

1. ~~0 dari 406 kosakata terhubung ke gambar~~ **Diperbaiki 2026-11-16:** 98 kosakata kini punya field `fig` (gambar JICA + nomor bagian) dan 63 istilah ilustrasi baru ditambahkan (469 total) lewat `tools/ssw/automaint_figlink.py`. Flashcard bergambar per-bagian (crop satu komponen) tetap belum ada: gambar JICA berisi banyak bagian bernomor dalam satu file, sehingga kartu gambar-per-istilah butuh crop manual.
2. ~~Tidak ada fungsi komponen, sumber halaman, validation_status~~ **Sebagian diperbaiki 2026-11-16:** 98 kosakata bergambar kini punya `fungsi` (ORIGINAL LEARNING CONTENT, perlu review ahli), `hal_sumber` (halaman buku JICA イラスト集, dari halaman kunci jawaban PDF) dan `status_validasi`. Kosakata buku lain (371) belum punya field ini.
3. Cakupan topik masih mengikuti satu sumber (JICA「みてまなぶ！自動車整備の日本語」): sistem mesin, rem, kemudi, suspensi, kelistrikan, transmisi belum dibahas sebagai bab sistem; belum ada kompetensi resmi JASPA yang dipetakan.
4. Belum ada mode "identifikasi komponen pada diagram" dan "image ↔ istilah" khusus.
5. Uji klik UI di browser belum pernah dijalankan (login siswa diperlukan).
6. Label OFFICIAL/ORIGINAL belum ada di soal (README menyatakan semua soal berlabel latihan, bukan resmi).

## Kekurangan Industrial Manufacturing

- `industrial-mfg`: hanya 115 kosakata, 8 dari 17 subbab punya kosakata, tanpa halaman buku, tanpa sumber resmi tersimpan.
- `mfg-machine-metal`: 4 subbab, 20 kosakata, 28 soal; belum ada sumber resmi (modul METI/JAPAN-MET atau sejenis) yang diunduh.
- Kategori resmi lain di bawah 工業製品製造業 belum diinventarisasi dari sumber pemerintah.

## Verifikasi pemetaan gambar ↔ istilah (2026-11-16)

Nomor bagian di 20 gambar JICA (versi tanpa label) dicocokkan dengan halaman kunci jawaban berlabel di `jica-illust-shu.pdf` (teks PDF, bukan tebakan visual). Hasil: seluruh istilah cocok untuk 19 gambar; gambar 2 hanya beda ruby/furigana. Satu istilah yang ada di kunci tetapi belum di tabel ditambahkan: ウォータ・ジャケット (gambar 11 no. 3). Pemeriksaan visual sampel (gambar 2, 10, 13, 14, 36) tidak menemukan kontradiksi dengan kunci.

## Hambatan lingkungan (jujur)

- Shell sesi ini hanya mengakses registri paket dan GitHub; PDF dari situs pemerintah **tidak bisa diunduh langsung dari shell**. WebSearch/WebFetch bisa membaca halaman, tetapi tidak menyimpan PDF ke disk. PDF baru harus diunggah pengguna atau diambil dari repo.
- Karena itu belum ada PDF baru yang diunduh dan belum ada `SSW_SOURCE_REGISTRY.*`; registri hanya bisa mencatat tautan yang diverifikasi lewat pencarian web.

## Prioritas pengerjaan

1. Jidousha Seibi: hubungkan kosakata ↔ gambar, tambah mode flashcard/pilihan ganda bergambar, tambah field definisi + sumber halaman.
2. Source registry resmi (JASPA, MLIT, JICA, METI) dengan status verifikasi.
3. Industrial Manufacturing / Machine-Metal: cari modul resmi, perluas kosakata dan soal.
4. Livestock & Fishery: tambah kosakata/soal.
5. Validasi konten (furigana, kunci jawaban) dan uji klik UI.

### CHAT 1 HANDOFF (2026-11-16)

- **Teknologi:** situs statis (GitHub Pages), `index.html` + ES module `js/*.js`, Firebase (Auth, Firestore), service worker `sw.js`, Cloudflare Worker untuk AI. Alat build: Python di `tools/ssw/`.
- **Struktur:** `data/ssw/<slug>/{index,babN,vocab,quiz}.json` (+`alat.json` untuk Building Cleaning), `assets/ssw/<slug>/{jp,id,fig,pdf}`, mesin di `js/ssw-core.js` / `js/ssw.js` / `js/ssw-teacher.js`.
- **Database:** Firestore `siswa/{uid}/ssw_progres/{slug}`, SRS `ssw-<slug>`, `ssw_bidang/{slug}` (konfigurasi guru). Tidak ada perubahan skema.
- **Sektor relatif lengkap:** Building Cleaning, Construction (3 buku, kecuali praktik Tutorial 5–7), Food Service, Food Manufacturing, Accommodation, Kaigo (semuanya masih NEEDS REVIEW untuk validasi manusia).
- **Sektor kurang:** Livestock, Fishery (ujian resmi), mfg-machine-metal, industrial-mfg. **Belum ada:** Shipbuilding, Aviation, Auto Transportation, Railway, Forestry, Wood Industry.
- **PDF yang berhasil diunduh/ada di repo:** hanya `assets/ssw/auto-maintenance/pdf/jica-jidosha-seibi-no-nihongo.pdf` dan `jica-illust-shu.pdf` (dari sesi sebelumnya). Sesi ini tidak mengunduh PDF baru: shell tidak bisa menjangkau situs pemerintah.
- **Link sumber:** `SSW_SOURCE_REGISTRY.md/.json` (12 dokumen: MLIT 1号/2号, METI, MOJ, JICA).
- **Kosakata Jidousha Seibi:** 468 (406 buku JICA + 62 istilah ilustrasi am-407..468); 97 terhubung ke gambar (`fig`).
- **Gambar terekstrak:** 20 gambar JICA di `assets/ssw/auto-maintenance/fig/` (sudah ada dari sesi sebelumnya; sesi ini tidak mengekstrak gambar baru). Setiap gambar berisi banyak bagian bernomor; pemetaan nomor → istilah dari tabel FIG di `tools/ssw/automaint_img2.py`.
- **File dibuat:** `SSW_PROJECT_AUDIT.md`, `SSW_DEVELOPMENT_PROGRESS.md`, `SSW_SOURCE_REGISTRY.json/.md`, `tools/ssw/automaint_figlink.py`.
- **File diubah:** `data/ssw/auto-maintenance/vocab.json`, `js/ssw.js`, `index.html` (pembahasan hafalan), `sw.js` (cache v272).
- **Belum selesai:** definisi teknis/fungsi per kosakata, `source_page` & `validation_status` per kosakata, bab sistem kendaraan dari sumber resmi MLIT/JASPA, crop per-komponen untuk flashcard bergambar, pemeriksaan visual 20 gambar, uji klik UI (butuh login siswa), unduhan PDF resmi.
- **Instruksi untuk Chat 2:** (1) jangan buat ulang modul COMPLETE; (2) jalankan urutan `automaint_jica_build.py` → `automaint_img2.py <illust.pdf>` → `automaint_figlink.py` bila data dibangun ulang; (3) minta pengguna mengunggah PDF dari sumber di registry, lalu ekstrak; (4) crop per bagian bernomor dengan pemeriksaan visual sebelum dipakai sebagai `img` di flashcard; (5) tambah field `def`, `fungsi`, `halaman` hanya dari sumber yang terverifikasi; (6) lanjut Industrial Manufacturing.
