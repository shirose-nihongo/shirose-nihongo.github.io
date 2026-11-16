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
