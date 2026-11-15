# Backup Folder

## kanji-lama-vietnamese.json
Backup data kanji sebelum terjemahan Vietnamese → Indonesian (7 Nov 2026).
Berisi versi lama dari file `/data/kanji-*.json` dengan sebagian arti dalam bahasa Vietnam.
Dapat digunakan untuk referensi atau diff bila ada kesalahan terjemahan.

## Bank soal simulasi N3 lama
Bank soal simulasi N3 (290 soal + choukai + narabe + bunshou) yang sebelumnya
inline di file index.html versi lama TIDAK diimpor otomatis ke platform RPG baru,
karena arsitekturnya kini menggunakan **Firestore + kategori ujian dinamis**.

Alur migrasi yang disarankan:
1. Guru membuat kategori ujian baru di Teacher Dashboard (misal "N3 Paket Ujian 01")
2. Buka file index.html lama, export array soalnya ke format template Excel
3. Import ke kategori yang sudah dibuat

Hal ini sesuai aturan master prompt section 7: "Hapus hanya konten soal simulasi lama setelah membuat backup. Jangan menghapus struktur sistem ujian."
Struktur sistem ujian dipertahankan utuh (engine timer, navigasi nomor, penilaian otomatis, pembahasan, reward XP+koin).

## jft-vietnamese/
Backup `data/kanji-ir0.json`, `kanji-ir1.json`, `kanji-ir2.json` (JFT A1 / A2.1 / A2.2) sebelum 83 arti Kanji
yang berbahasa Vietnam / campuran Vietnam-Indonesia diganti dengan arti Indonesia dari data Kanji JLPT yang sudah dikoreksi (15 Nov 2026).
Hanya field `a` yang berubah; field lain tidak disentuh.

## n3-kanji-vocab/
Backup `index.html`, `js/kana-center.js`, `sw.js` sebelum fitur Kosakata Kanji (flashcard = kosakata contoh, Kanji = indeks).

## jlpt-sisa-vietnam/
Backup `kanji-n1`, `kanji-n3`, `kosakata-n2`, `kosakata-n5` sebelum 5 sisa teks Vietnam/salah ketik dirapikan
("secara đồng thời" dihapus; "rõmaji" -> "romaji"). Hanya 5 field yang berubah (15 Nov 2026).

## english-audit/ dan jlpt-soal-vietnam/
Cadangan file sebelum pembersihan sisa bahasa Vietnam/Inggris (arti kanji & kosakata N5–N1/JFT, soal latihan jlpt/n1–n5).
Alat: tools/fix_soal_vietnam.py, tools/scan_english.py, tools/check_english.py (dipanggil oleh tools/test_kanji_vocab_n3.mjs).
