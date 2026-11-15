# SSW Autonomous Progress

Dokumen progres pengembangan modul SSW (dimulai 15 Nov 2026). Acuan pola: `docs/SSW-POLA-DAN-PETA-MODUL.md`.

## Audit kondisi repo (15 Nov 2026)

Dihitung dari `data/ssw/<slug>/` (bab, subbab, kosakata, kelompok soal, butir soal, butir bergambar, folder halaman `assets/ssw/<slug>`).

| Bidang | Bab | Subbab | Kosakata | Subbab dgn kosakata | Kelompok soal | Butir soal | Soal bergambar | Halaman buku |
|---|---:|---:|---:|---:|---:|---:|---:|:-:|
| accommodation | 5 | 18 | 1095 | 18 | 28 | 386 | 5 | ya |
| agriculture | 7 | 33 | 213 | 33 | 54 | 380 | 0 | ya |
| auto-maintenance | 7 | 31 | 227 | 31 | 46 | 197 | 6 | ya |
| building-cleaning | 3 | 40 | 1158 | 40 | 49 | 509 | 0 | ya |
| construction | 7 | 22 | 4424 | 22 | 43 | 781 | 38 | ya |
| construction-bangunan | 7 | 23 | 4392 | 23 | 44 | 947 | 47 | ya |
| construction-lifeline | 7 | 28 | 4426 | 28 | 49 | 858 | 46 | ya |
| fishery | 12 | 33 | 2370 | 33 | 12 | 71 | 0 | ya |
| food-manufacturing | 3 | 15 | 1463 | 15 | 24 | 388 | 31 | ya |
| food-service | 3 | 24 | 2463 | 24 | 58 | 805 | 26 | ya |
| food-service-jp | 3 | 20 | 634 | 17 | 25 | 229 | 0 | ya |
| industrial-mfg | 5 | 17 | 115 | 8 | 22 | 105 | 0 | tidak |
| kaigo | 4 | 14 | 280 | 14 | 26 | 252 | 0 | ya |
| kaigo-jp | 3 | 14 | 222 | 10 | 16 | 133 | 24 | tidak |
| livestock | 3 | 18 | 54 | 1 | 9 | 56 | 0 | ya |
| mfg-machine-metal | 2 | 4 | 20 | 2 | 6 | 28 | 0 | tidak |

Catatan: kolom "Kosakata" Building Cleaning dkk. dihitung dari `vocab.json` apa adanya (termasuk entri hasil ekstraksi otomatis).

## Temuan prioritas

1. **Livestock**: 18 subbab, tetapi hanya 54 kosakata (1 subbab terhubung lewat `src`), 56 soal, tanpa latihan per subbab. Teks Jepang (`full.jp`) belum ada.
2. **Fishery**: 33 subbab dan 2370 kosakata, tetapi hanya 71 soal dan 12 kelompok soal (tanpa latihan per subbab). Format ujian resmi belum dipublikasikan, jadi memakai ujian latihan.
3. **mfg-machine-metal**: 4 subbab, 20 kosakata, 28 soal; belum ada halaman buku.
4. **industrial-mfg**: 17 subbab, 115 kosakata, 105 soal; belum ada halaman buku, hanya 8 subbab punya kosakata.
5. Bidang yang belum ada sama sekali: Shipbuilding, Aviation, Forestry, Wood Industry, Automobile Transportation, Railway, Linen Supply, Distribution/Warehousing, Resource Recycling (perlu sumber resmi dulu).

## Status pekerjaan

- Audit: selesai (dokumen ini).
- Fishery: latihan per subbab selesai (33 grup `bXsY-q`, 165 soal orisinal, teks Indonesia; JP untuk soal subbab belum, sama seperti Agriculture). Skrip: `tools/ssw/fishery_subquiz.py`. Soal ujian akhir menunggu info format resmi dari Raditya.
- Tes: JSON valid, ID unik, kunci jawaban valid, grup lama identik, `loadPack` memuat tanpa error di headless Chrome. Tes klik UI belum dijalankan.
- Commit/deploy: belum.

## Sumber dan lisensi

Belum ada sumber baru yang diunduh sesi ini.

## Pekerjaan berikutnya

1. Fishery: soal ujian akhir sesuai format resmi (menunggu info dari Raditya).
1b. Auto-maintenance: ganti sumber ke teks resmi MLIT (perlu dicari dan diunduh).
2. Livestock: hubungkan kosakata ke subbab, tambah soal per subbab.
3. Industrial / Machine-Metal: perluas.

## Auto Maintenance – update (sumber resmi)
- Sumber: JASPA (cakupan & format ujian 1号/2号), MLIT, JICA「みてまなぶ！自動車整備の日本語」+ Koleksi Ilustrasi (bahan bebas unduh; diakses 2026-11). PDF sumber tidak di-commit.
- Ditambah: +184 kosakata (am-j###, arti Indonesia orisinal), +44 soal orisinal (bab*-qx ○×, bab7-qj1..3 simulasi 実技). Berlabel latihan, bukan soal resmi (soal resmi tidak dipublikasikan).
- Belum: soal bergambar dari halaman JICA, uji klik UI di browser.
- +6 soal bergambar (bab2-qimg) dari JICA イラスト集 hal.38 (Gambar 2, versi tanpa label); sumber gambar dikreditkan di penjelasan soal. Belum: gambar lain (DOHC, rem, dll.) dan uji UI.

## Auto Maintenance – ROMBAK TOTAL (atas permintaan pemilik, 2026-11-15)
Modul lama (7 bab/31 subbab buatan sendiri) DIHAPUS dan diganti dengan struktur & isi dari buku resmi JICA「みてまなぶ！自動車整備の日本語」(2023-12-30, bebas diunduh/dipakai; file asli ada di `assets/ssw/auto-maintenance/pdf/`).
- 4 bab / 27 subbab mengikuti daftar isi buku: 車の名前, 工具・検査装置, 動詞, 部品. 406 kosakata (semua istilah buku) lengkap dengan bacaan, romaji, arti Indonesia, alias, contoh kalimat.
- Buku Jepang = halaman PDF asli (assets/.../jp, 67 hal.). Buku Indonesia = halaman yang disusun dari data (assets/.../id) + teks JP/ID per subbab (semua kosakata ada di kedua versi).
- Kuis dibangkitkan dari kosakata buku (229 soal) + 6 soal bergambar (Koleksi Ilustrasi JICA). Latihan, bukan soal resmi.
- Pembangun: `tools/ssw/automaint_jica_build.py` + data `tools/ssw/jica_data/*.txt` (idempoten; bisa diedit lalu dijalankan ulang).
- Diuji: paket data dimuat oleh ssw-core (4 bab, 27 subbab, tanpa error); uji klik UI butuh login siswa — belum.
- Belum: koleksi ilustrasi lengkap (36 gambar) sebagai soal bergambar; furigana pada kalimat contoh; Indonesian penerjemahan video JAPIA.
