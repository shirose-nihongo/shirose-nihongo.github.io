# Audit Shirose Nihongo + pembagian tugas 3 chat (17 Nov 2026)

Dibuat dari data di repo (`data/ssw/*`, `js/*`, `docs/*`) dan catatan sesi. **Semua chat wajib baca file ini dulu.**
Angka di bawah dihitung dari berkas, bukan dari ingatan. Hal yang belum pernah dites di website live ditandai ⚠.

## 1. Kondisi bidang SSW (19 bidang)

| Bidang | Bab | Kosakata | Soal | Bergambar | Halaman buku | Catatan |
|---|---:|---:|---:|---:|---:|---|
| building-cleaning | 3 | 1158 | 629 | 40 | 171 | lengkap |
| construction (+bangunan, +lifeline) | 7 | ±4400 | ±1000 | 38–47 | ±275–333 | lengkap, 3 jalur |
| food-manufacturing | 3 | 1463 | 478 | 31 | 83 | lengkap |
| food-service / -jp | 3 | 2463 / 634 | 895 / 261 | 26 / 0 | 273 / 145 | versi JP tanpa soal bergambar |
| accommodation | 5 | 1095 | 546 | 5 | 53 | ok |
| kaigo / kaigo-jp | 4 / 3 | 280 / 222 | 204 / 178 | 0 / 24 | 271 / **0** | kaigo-jp tanpa halaman buku |
| auto-maintenance | 4 | 469 | 712 | 117 | 134 | dari buku JICA; sisa: furigana contoh kalimat, ±16 ilustrasi, tautan PDF di UI |
| jaim-* (3 buku resmi) | 10–13 | **110–140** | 129–192 | 27–36 | 338–414 | kosakata tipis dibanding jumlah bab |
| fishery | 12 | 2370 | **380** | 0 | 292 | soal ujian akhir resmi belum (menunggu info pemilik) |
| agriculture | 7 | **213** | 443 | 0 | 103 | kosakata tipis |
| livestock | 3 | **54** | 221 | 0 | 154 | kosakata sangat tipis |
| wood-industry | 4 | 168 | 129 | 0 | 89 | tipis, tanpa gambar |
| auto-transport | 5 | 167 | 126 | 0 | 327 | tipis |

**Bidang yang belum ada sama sekali:** Shipbuilding/舶用工業, Aviation/航空, Railway/鉄道, Forestry/林業, Linen Supply/リネンサプライ, Logistics-Warehousing/物流倉庫, Resource Recycling/資源循環.
**Sumber resmi berstatus NOT DOWNLOADED:** lihat `SSW_SOURCE_REGISTRY.md` (SRC-004, 012, 020, 021 dst.). Shell sandbox tidak bisa unduh situs pemerintah; satu-satunya jalan yang pernah berhasil adalah lewat Chrome pengguna.
**Sudah dihapus:** modul manufaktur buatan sendiri (`industrial-mfg`, `mfg-machine-metal`); buku JAIM kini bidang sendiri.

## 2. Temuan non-SSW

1. ⚠ Belum ada uji klik di UI sebagai siswa login (hafalan cepat/tanpa tekan ganda, hadiah XP/koin akhir sesi, rangkuman 3 bidang, font Jepang, Save Gacha). Semua baru lolos cek sintaks / skrip logika.
2. ⚠ KING SSW (`shirose-nihongo/king-ssw`): login siswa/guru belum dites; `teacher.html` masih berlogo Shirose + tab JLPT; aturan Firestore `king_komentar`, `king_item_shop`, `king_choukai`, `king_kosakata_pos` ada di `firestore.rules.king-tambahan` tetapi belum dipublikasikan.
3. Firebase: aktifkan MFA sebelum **21 Nov 2026**. Kuota Firestore pernah menjadi masalah; gacha bergantung pada penyimpanan perangkat (sudah ada Download/Muat Save).
4. Gacha: undian di perangkat, bisa dicurangi lewat edit file save (cadangan, bukan pengaman).
5. `teacher.html` dan `landing.html` belum memakai pilihan font Jepang.
6. Pertanyaan lama belum terjawab: "cari semua siswa SSW-nya".

## 3. Pembagian tugas

### Chat A — Konten SSW bidang yang sudah ada
Kepemilikan berkas: `data/ssw/<livestock|agriculture|fishery|wood-industry|auto-transport|jaim-*|kaigo-jp|auto-maintenance>/`, `assets/ssw/<slug yang sama>/`, `tools/ssw/*` yang terkait.
1. Livestock, Agriculture, Wood Industry, Auto Transport: perluas kosakata dan soal per subbab (arti Indonesia orisinal, bacaan, romaji, contoh kalimat), hubungkan ke subbab lewat `src`.
2. JAIM (3 buku): tambah kosakata dari teks buku.
3. Fishery: soal ujian akhir — **tunggu info format dari pemilik**, jangan menebak.
4. Auto-maintenance: furigana contoh kalimat, ilustrasi tersisa, tautan PDF di UI.
5. Kaigo-jp: halaman buku.
Aturan: jangan sentuh `js/` kecuali bug data; tiap bidang satu PR.

### Chat B — Bidang SSW baru + sumber resmi
Kepemilikan: `data/ssw/<slug baru>/`, `assets/ssw/<slug baru>/`, `SSW_SOURCE_REGISTRY.*`, `ssw-materials/`, dan **satu-satunya yang boleh mengedit `DEFAULT_BIDANG` dan `EXAM_SPEC` di `js/ssw-core.js`** untuk menambah bidang.
1. Cari buku/teks belajar resmi gratis (METI, MLIT, MAFF, JICA, asosiasi bidang) untuk 7 bidang yang belum ada; catat di registry; unduh lewat Chrome pengguna.
2. Bangun modul seperti Auto Maintenance (JP + ID, semua kosakata, kuis dari kosakata, label "latihan" bila bukan soal resmi).
3. Unduh sisa sumber NOT DOWNLOADED dan masukkan ke web bila relevan (ruang lingkup ujian, daftar kosakata).
Aturan: tanpa sumber resmi, jangan membuat konten karangan; bila tak ada sumber, lapor.

### Chat C — QA, platform, dan KING SSW
Kepemilikan: `index.html`, `js/*.js` (selain data SSW), `css/`, `teacher.html`, `landing.html`, `sw.js`, repo `king-ssw`.
1. Uji klik UI sebagai siswa login (Chrome, akun uji) untuk: hafalan SSW/JLPT/JFT, hadiah akhir sesi, rangkuman JLPT/SSW/JFT, font Jepang, Save Gacha, hub SSW semua bidang. Laporkan temuan jujur.
2. KING SSW: tes login siswa+guru, ganti logo/hilangkan tab JLPT di `teacher.html`, lengkapi dan publikasikan aturan `king_*`.
3. Pilihan font Jepang di `teacher.html` dan `landing.html`.
4. Pertanyaan "cari semua siswa SSW-nya" — tanyakan ulang ke pemilik.
5. **Hanya Chat C yang menjalankan sinkron KING** (`python3 -I tools/build_king.py <shirose> <king>`) dan menaikkan versi cache.

## 4. Aturan kerja bareng (hindari tabrakan)
- Satu cabang per tugas, PR kecil, `git pull --rebase origin main` sebelum merge. Merge lewat REST (`gh api -X PUT repos/.../pulls/N/merge`), `gh pr create` diblokir (GraphQL).
- Titik rawan konflik: `js/ssw-core.js` (hanya B untuk daftar bidang), `sw.js` + angka `?v=` di `index.html` (konflik → ambil angka lebih tinggi). A dan B tidak menaikkan `?v=` dan tidak menyentuh KING; C yang menaikkan saat merge.
- Jangan simpan kunci API/token di repo. Jangan ubah data siswa di Firestore tanpa diminta pemilik.
- Selesai satu tugas → tambah catatan di `docs/SSW_AUTONOMOUS_PROGRESS.md` (A, B) atau `docs/QA_LOG.md` (C).
- Lapor jujur: tulis "belum dites" bila belum dites.
