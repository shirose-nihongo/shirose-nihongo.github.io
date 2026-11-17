# CHAT 2 HANDOFF — 工業製品製造業 (official-derived only)

Status: **PARTIAL** (bukan COMPLETE). Semua konten diturunkan dari PDF resmi JAIM (modul ID + JP); tidak ada materi buatan sendiri. PDF asli ada di komputer user (Downloads\SHIROSE NIHONGO), tidak di-commit.

| Kategori | Folder | Bab/Section/Sub-bab | Vocab | Soal resmi A/B | Set format terbuka |
|---|---|---|---|---|---|
| 機械金属加工 | ssw-materials/industrial-manufacturing/ | 10/36/99 | 99 | 97 | 5 |
| 電気電子機器組立て | .../electrical-electronic-assembly/ | 12/45/115 | 115 | 55 | 12 |
| 金属表面処理 | .../metal-surface-treatment/ | 13/52/139 | 139 | 120 | 7 |

Tiap folder: processed-materials/curriculum.json (teks resmi ID + judul JP + ruby resmi), vocabulary/vocabulary.json, flashcards/flashcards.json (turunan vocab), practice-tests/official-questions.json (label OFFICIAL QUESTION, kunci + penjelasan resmi) dan official-open-format-exercises.json, extracted-images/. Metadata dokumen: source-metadata/study-guide-documents.json. ID stabil: IMM-{kode}-V0001 / IMM-{kode}-OQ-{set}-{no}. Parser: tools/imm/ (SG, PDF, SUB, CAT, DOC, CATJP via env; butuh pdftotext hasil -layout sg0N_id.txt).

Gap (jangan diisi karangan):
- Set format terbuka/pilihan ganda A–D/tabel/ilustrasi (24 set total) hanya tersimpan sebagai teks mentah (NEEDS_MANUAL_STRUCTURING).
- Vocab baru judul sub-bab (belum istilah dari isi teks); ruby resmi hanya kanji (tanpa okurigana/partikel). Sebagian sudah ada di vocab app → exists_in_app_vocab (14/16/11).
- Modul tidak punya tujuan belajar, kesalahan umum, ringkasan → dikosongkan.
- Sample exam 1号 & 2号 (sample1_01..03, sample2_01..03) belum diparse; 14 kategori lain hanya sample.
- Belum terhubung ke UI app; semua record NEEDS_REVIEW; ID chapter-level text belum dicek manual.
