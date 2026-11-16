# SSW Project Audit

Diperbarui: 17 Nov 2026. Audit ini mengacu pada kode dan data yang benar-benar ada di repositori `shirose-nihongo.github.io` (bukan rencana). Angka per bidang ada di `SSW_DEVELOPMENT_PROGRESS.md`; sumber di `SSW_SOURCE_REGISTRY.md/.json`.

Catatan: dokumen "Chat 1" dan "Chat 2" yang disebut dalam brief tidak ada di repositori maupun di unggahan sesi ini; hanya `docs/SSW_AUTONOMOUS_PROGRESS.md` dan `docs/SSW-POLA-DAN-PETA-MODUL.md` yang ada, dan keduanya dibaca. Karena itu audit memakai isi `data/ssw/*` sebagai kebenaran.

## Arsitektur (satu aplikasi, tanpa aplikasi kedua)

| Lapisan | Lokasi | Keterangan |
|---|---|---|
| UI siswa | `js/ssw.js` (rute `ssw`, `ssw-peta`, `ssw-bab`, `ssw-baca`, `ssw-buku`, `ssw-kosa`, `ssw-hafal`, `ssw-kartu`, `ssw-kuis`, `ssw-rank`, `ssw-progres`, **`ssw-diagram`** baru) | hash-router `route()` di `index.html` |
| Mesin data | `js/ssw-core.js` | memuat paket bidang, progres, akses; panggilan Firebase kini dibatasi 4 dtk + cache lokal |
| Mesin hafalan | `index.html` (`sswHafalStart`, Flashcard/Matching/Pilihan Ganda) | dipakai bersama JLPT; SRS per bidang `ssw-<slug>` |
| Dashboard guru | `js/ssw-teacher.js` + `teacher.html` tab SSW | status bab, akses per siswa/kelas |
| Data | `data/ssw/<slug>/{index,babN,vocab,quiz,alat,diagram}.json` | satu `vocab.json` per bidang = satu database kosakata |
| Aset | `assets/ssw/<slug>/` | halaman buku WebP, `diagram/*.svg` |
| Progres | Firestore `siswa/{uid}/ssw_progres/{slug}` + SRS | + salinan lokal `localStorage` |
| Akses | `siswa.aksesSsw` → `aksesSswBidang` → `kelas.aksesSswBidang` → bawaan | `hasFullAccess()` untuk grup demo |

## Sudah berfungsi sebelum sesi ini
Hub pulau, peta bab, baca subbab (lengkap/ringkas, ID/JP), buku interaktif, bank kosakata, flashcard SRS (Baru/Belum/Perlu diulang/Hafal/Kuasa), Matching, Pilihan Ganda, kuis per subbab/bab/ujian penuh dengan penjelasan, soal bergambar (opsi gambar), progres + leaderboard, panel flashcard peralatan bergambar khusus Building Cleaning.

## Celah yang ditemukan dan ditutup sesi ini

| Celah | Tindakan |
|---|---|
| Flashcard bergambar hanya Building Cleaning (40 foto buku) | Pipeline `tools/ssw/diagram_*.py` membuat diagram skematis orisinal + kartu gambar untuk Auto Maintenance, Industrial Manufacturing, Mesin & Logam; panel kartu gambar digeneralisasi per bidang |
| Tidak ada diagram interaktif | Rute `ssw-diagram/<slug>[/<id>]`: ketuk bagian → nama Jepang, furigana, romaji, arti, fungsi; mode "Tebak bagian" |
| Mode PG hanya Jepang→Arti | Ditambah **Arti→Jepang** dan **Gambar→Jepang** (arah `id2jp`) |
| Tidak ada "review khusus yang belum hafal" pada kartu gambar | Tombol "Review yang belum hafal" |
| Tidak bisa mengulang hanya soal yang salah | Tombol "Ulangi soal yang salah" (tidak menimpa skor terbaik) |
| Soal resmi vs buatan tidak dibedakan | Label "Latihan buatan Shirose" / "Soal resmi" (`quiz.resmi`) |
| Kartu hafalan tidak terbaca di tema Putih | Kartu dibuat terang untuk tema Putih |
| Panggilan Firebase SSW berurutan dan tanpa batas waktu (halaman SSW bisa ±30 dtk di HP) | Paralel + timeout 4 dtk + cache bidang/akses kelas |

## Batasan yang tersisa
- Gambar diagram adalah **skematis orisinal Shirose**, bukan foto/gambar PDF resmi. Gambar PDF asli dipakai bila tersedia (Auto Maintenance: JICA, soal bergambar 117 butir; Building Cleaning: foto buku). Industrial Manufacturing dan Mesin & Logam tidak punya PDF sumber di repo.
- Tidak ada animasi teknis (sesuai instruksi); semua diagram statis.
- Materi di GitHub Pages bersifat statis dan publik; gerbang akses hanya di aplikasi + Firestore Rules.
- Dashboard guru belum diubah (tidak ada duplikasi); progres kartu gambar ikut SRS yang sudah dibaca dashboard.
