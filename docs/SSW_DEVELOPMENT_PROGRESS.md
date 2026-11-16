# SSW Development Progress

Catatan: file ini baru dibuat oleh Chat 2. Progres sebelumnya (Chat 1 / autonomous) ada di `docs/SSW_AUTONOMOUS_PROGRESS.md`.

## CHAT 2 HANDOFF (16 Nov 2026)

**Kategori Industrial Manufacturing yang diperiksa:** daftar resmi 17 業務区分 dibaca (DOC-001, DOC-002). Daftar lengkap + status ada di `ssw-materials/industrial-manufacturing/source-metadata/categories.json`.

**Kategori yang dikerjakan:** hanya 機械金属加工 (status DRAFT_ORIGINAL, BUKAN COMPLETE). 16 kategori lain: NOT_STARTED.

**PDF yang berhasil diunduh:** 0. Shell workspace tidak bisa mengakses situs JAIM/METI/MOJ; WebFetch hanya membaca. Dokumen yang dibaca lewat WebFetch/pencarian tercatat di `source-metadata/documents.json` dengan status verifikasi masing-masing.

**URL sumber, bahasa, jenis dokumen:** lihat `SSW_SOURCE_REGISTRY.md`. Semua berbahasa Jepang. Jenis: ringkasan kebijakan, spesifikasi pelaksanaan ujian, contoh soal resmi (JAIM sample 機械金属加工), brosur seminar. Tidak ada modul. Modul 「学習用参考テキスト」 belum ditemukan.

**Jumlah (機械金属加工):** 6 bab, 18 subbab, 137 kosakata (37 kata sudah ada di database lama dan ditautkan lewat `existing_db_id`), 137 flashcard turunan, 144 soal (73 benar-salah A/B gaya 学科, 71 pilihan ganda 4 gaya 実技). Semua soal berlabel ORIGINAL PRACTICE QUESTION; tidak ada OFFICIAL QUESTION. Tidak ada soal bergambar (butuh gambar).

**File dibuat:** `ssw-materials/industrial-manufacturing/**` (curriculum-mmp.json/.md, vocab-mmp.json, flashcards-mmp.json, practice-mmp.json, documents.json, categories.json, exam-structure-mmp.md, README kosong), `tools/imm/*` (ch12.py, ch34.py, ch56.py, build.py; idempotent, ID stabil), `docs/SSW_*` (4 file).
**File diubah (di luar Chat 2 ini, sebelumnya hari yang sama):** `data/ssw/*/quiz.json` (kuis per subbab), `js/ssw.js` (tombol Rangkuman). Chat 2 tidak mengubah data Chat 1.

**Status integrasi:** BELUM terintegrasi ke aplikasi. `data/ssw/mfg-machine-metal` dan `industrial-mfg` tidak diubah oleh materi baru.

**Belum selesai:**
1. Unduh dan ekstrak modul resmi (perlu akses jaim-skill.or.jp; jika memang ada, simpan di original-pdf).
2. Verifikasi isi, kosakata, dan terjemahan terhadap teks resmi; ubah status UNVERIFIED.
3. Ilustrasi dan soal bergambar (tanda JIS, alat ukur, simbol las, simbol toleransi).
4. 2号 機械金属加工 (実技 saja) dan 16 kategori lain.
5. Distribusi benar-salah belum seimbang (46 A : 27 B).
6. Soal 実技 gaya gambar belum ada.

**Instruksi untuk Chat 3:** (a) jangan klaim COMPLETE; (b) impor curriculum-mmp.json ke format `data/ssw/mfg-machine-metal/bab*.json` dengan ID stabil `imm-mmp-*` dan `src`; (c) gabungkan kosakata lewat `existing_db_id` agar tidak ganda; (d) pertahankan label soal; (e) jalankan `python3 tools/imm/build.py` untuk membangun ulang (idempotent).

## CHAT 3 (17 Nov 2026) — Platform interaktif, kartu gambar, diagram, QA

Statistik nyata dari repo (`python3 tools/ssw/stats.py --md`):

| Bidang | Bab | Subbab | Kosakata | Kartu gambar | Diagram | Bagian diagram | Kelompok soal | Butir soal | Soal bergambar | File gambar/halaman |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| accommodation | 5 | 18 | 1095 | 0 | 0 | 0 | 44 | 546 | 5 | 63 |
| agriculture | 7 | 33 | 213 | 0 | 0 | 0 | 54 | 443 | 0 | 103 |
| auto-maintenance | 4 | 27 | 469 | 96 | 12 | 96 | 62 | 375 | 117 | 264 |
| building-cleaning | 3 | 40 | 1158 | 40 | 0 | 0 | 61 | 629 | 80 | 211 |
| construction | 7 | 22 | 4424 | 0 | 0 | 0 | 61 | 961 | 38 | 454 |
| construction-bangunan | 7 | 23 | 4392 | 0 | 0 | 0 | 62 | 1127 | 47 | 463 |
| construction-lifeline | 7 | 28 | 4426 | 0 | 0 | 0 | 67 | 1038 | 46 | 504 |
| fishery | 12 | 33 | 2370 | 0 | 0 | 0 | 49 | 380 | 0 | 293 |
| food-manufacturing | 3 | 15 | 1463 | 0 | 0 | 0 | 33 | 478 | 31 | 130 |
| food-service | 3 | 24 | 2463 | 0 | 0 | 0 | 67 | 895 | 26 | 614 |
| food-service-jp | 3 | 20 | 634 | 0 | 0 | 0 | 29 | 261 | 0 | 331 |
| industrial-mfg | 5 | 17 | 120 | 25 | 4 | 25 | 25 | 148 | 0 | 29 |
| kaigo | 4 | 14 | 280 | 0 | 0 | 0 | 26 | 252 | 0 | 271 |
| kaigo-jp | 3 | 14 | 222 | 0 | 0 | 0 | 23 | 178 | 24 | 0 |
| livestock | 3 | 18 | 54 | 0 | 0 | 0 | 29 | 221 | 0 | 154 |
| mfg-machine-metal | 2 | 4 | 29 | 27 | 5 | 27 | 7 | 36 | 0 | 32 |
| **TOTAL** | 78 | 350 | 23812 | 188 | 21 | 148 | 699 | 7968 | 414 | 3916 |

### Selesai
- Kartu gambar + diagram interaktif: auto-maintenance (12 diagram/96 bagian), industrial-mfg (4/25), mfg-machine-metal (5/27); building-cleaning 40 kartu foto. Semua terhubung ke satu `vocab.json` per bidang (SRS bersama, tanpa duplikasi).
- Mode: Gambar→Jepang, Jepang→Arti, Arti→Jepang, Matching, Review belum hafal, Tebak bagian diagram.
- Latihan: label resmi vs buatan Shirose, ulangi soal salah.
- Kecepatan SSW/login/logout/profil, navigasi tombol back.
- QA otomatis: 248/248 cek lulus (4 bidang × mobile+desktop), lihat `SSW_QA_REPORT.md`.

### Belum / batasan
- Bidang belum ada: Shipbuilding, Aviation, Forestry, Wood Industry, Automobile Transportation, Railway, Linen Supply, Distribution/Warehousing, Resource Recycling.
- Construction Tutorial 5–7 belum.
- PDF baru tidak diunduh sesi ini (jaringan sandbox dibatasi); hanya 2 PDF JICA di repo.
- Industrial-mfg & mfg-machine-metal tanpa sumber PDF resmi (materi orisinal).
- Belum diuji: Firestore nyata, perangkat fisik, Safari/iOS, klik dashboard guru.
- Pencarian/filter kategori kartu gambar sebatas filter kelompok & status.
