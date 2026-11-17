# SSW Source Registry

Diperbarui: 2026-11-17. Angka dari `tools/ssw/stats.py` (data aktual repo).

| Bidang | Sumber | Lisensi / catatan | Status |
|---|---|---|---|
| accommodation | 全旅連 2024 (Jepang, 52 hal.) + terjemahan Indonesia | modul pemberian pengelola | selesai |
| agriculture | pertanian.pdf (Pertanaman Umum, 102 hal.) | modul pemberian pengelola | selesai |
| auto-maintenance | JICA「みてまなぶ！自動車整備の日本語」2023-12-30 + Koleksi Ilustrasi (JICA) | bebas diunduh/dipakai (situs JICA); PDF disimpan di assets/ssw/auto-maintenance/pdf/ | selesai + 12 diagram interaktif (orisinal Shirose) |
| auto-transport | Truk: （外国人向け）トラック運転者をめざす人のための学習用テキスト (全日本トラック協会 JTA, 2024-11, 242 hal.) — https://jta.or.jp/member/driver/ssw_text.html. Bus: （外国人向け）バス運転者を目指す人の為の学習用テキスト (日本バス協会, Ver.2 2024-12, 68 hal.) — https://www.bus.or.jp/news/16554/ | PDF truk disimpan di assets/ssw/auto-transport/pdf/ (PDF bus 36 MB tidak dimasukkan repo; ambil dari URL resmi); halaman truk (p01–p233) dan bus (p234–p301) dirender ke assets/ssw/auto-transport/jp dan tampil di tiap subbab + Buku interaktif (tombol ID = buku Indonesia 26 hal. hasil render ringkasan Shirose, tools/ssw/build_idbook.py); halaman bus dibaca lewat OCR otomatis (Tesseract) sehingga angka penting dicocokkan dengan aturan lalu lintas; isi app = ringkasan & soal latihan ditulis ulang Shirose | selesai (5 bab, 24 subbab: truk bab 1-4, bus bab 5); taksi belum ada; belum ada kartu gambar/diagram; soal resmi tidak tersedia |
| building-cleaning | Modul resmi Building Cleaning (buku PDF Indonesia/Jepang, halaman dirender ke WebP) | buku modul; halaman dirender di assets/ssw/building-cleaning | selesai |
| construction | sipil_indo (151 hal.) + edisi Jepang | modul pemberian pengelola | selesai (Bab 5–7 ada; ringkasan ID Bab 6.1 & 7 diperdalam dari tutorial praktik) |
| construction-bangunan | building_indo (152 hal.) + edisi Jepang | modul pemberian pengelola | selesai (Bab 5–7 ada; ringkasan ID Bab 6.1 & 7 diperdalam dari tutorial praktik) |
| construction-lifeline | THEORY_ID (117 hal.) + PRACTICE_ID | modul pemberian pengelola | selesai (Bab 5–7 ada; ringkasan ID Bab 6.1 & 7 diperdalam dari tutorial praktik) |
| fishery | Modul Perikanan (12 bab) | modul pemberian pengelola | selesai; ujian akhir menunggu format resmi |
| food-manufacturing | SSW_PM.pdf (第4版 2024, 82 hal.) | modul pemberian pengelola | selesai |
| food-service | 3 modul Jasa Boga (127 hal. Indonesia) | modul pemberian pengelola | selesai |
| food-service-jp | Buku Jepang Jasa Boga (144 hal.) | modul pemberian pengelola | selesai |
| industrial-mfg | Tidak ada buku (nobook): materi tulisan Shirose dasar pabrik | orisinal Shirose; padanan kosakata tambahan Shirose | selesai (dasar) + 4 diagram; belum ada sumber resmi MHLW/JASPA |
| jaim-elec-electronic | ? | ? | ? |
| jaim-machine-metal | ? | ? | ? |
| jaim-metal-surface | ? | ? | ? |
| kaigo | Materi_Kaigo.pdf hal. 10–201 (Indonesia) | modul pemberian pengelola; PDF tidak di-commit | selesai |
| kaigo-jp | Materi_Kaigo.pdf hal. 204–267 (Bahasa Jepang) | modul pemberian pengelola | selesai (tanpa halaman buku bergambar) |
| livestock | Modul Peternakan | modul pemberian pengelola | selesai; kosakata dan teks Jepang masih tipis |
| mfg-machine-metal | Tidak ada buku (nobook): materi tulisan Shirose mesin & logam | orisinal Shirose | selesai (dasar) + 5 diagram; tipis |
| wood-industry | 木材産業特定技能1号測定試験 学習用テキスト 第1版 (全国木材組合連合会 / 林野庁, 2025-05, 67 hal.) — https://www.rinya.maff.go.jp/j/mokusan/seisankakou/foreigner.html | PDF resmi tersedia gratis dari situs林野庁; PDF disimpan di assets/ssw/wood-industry/pdf/; halaman PDF dirender ke assets/ssw/wood-industry/jp (64 WebP) dan tampil di tiap subbab + Buku interaktif (tombol ID = buku Indonesia 25 hal. hasil render ringkasan Shirose, tools/ssw/build_idbook.py; PDF-nya di assets/ssw/wood-industry/pdf/); isi di app = ringkasan & soal latihan ditulis ulang Shirose (bukan salinan) | selesai (4 bab, 24 subbab); belum ada kartu gambar/diagram; soal resmi tidak tersedia |

## PDF yang ada di repositori
- `assets/ssw/auto-transport/pdf/shirose-ringkasan-indonesia-auto-transport.pdf`
- `assets/ssw/auto-transport/pdf/jta-truck-gakushu-text-ja.pdf`
- `assets/ssw/wood-industry/pdf/shirose-ringkasan-indonesia-wood-industry.pdf`
- `assets/ssw/wood-industry/pdf/zenmoku-gakushu-text-ja.pdf`
- `assets/ssw/auto-maintenance/pdf/jica-illust-shu.pdf`
- `assets/ssw/auto-maintenance/pdf/jica-jidosha-seibi-no-nihongo.pdf`

PDF modul bidang lain tidak di-commit (hanya hasil render halaman WebP di `assets/ssw/<slug>/`). Tidak ada PDF yang diunduh sesi ini: sandbox hanya mengizinkan registri paket dan GitHub, jadi situs sumber (JICA, MHLW, JASPA, dll.) tidak bisa dijangkau dari sini.

## Bidang SSW yang belum ada
Shipbuilding, Aviation, Forestry, Automobile Transportation (taksi; truk & bus sudah ada), Railway, Linen Supply, Distribution/Warehousing, Resource Recycling.

Status sumber per 2026-11-17 (audit ulang lewat pencarian; belum ada materi yang dimasukkan):
- Forestry (林業): hanya pedoman penerimaan & 試験実施要領 (林野庁); belum ada 学習用テキスト resmi.
- Shipbuilding (造船・舶用工業): hanya 試験実施要領 (MLIT / 日本海事協会); belum ada teks belajar.
- Aviation (航空): **SUDAH MASUK (2026-11-17)** — teks belajar resmi JAEA (公益社団法人 日本航空技術協会, exam.jaea.or.jp; lisensi: boleh salin/terjemah/edit dengan mencantumkan sumber + pernyataan bahwa edit bukan oleh JAEA). Modul `aviation-gh` (GH Text 2 Rev.2, 52 hal. + edisi 1 sebagai arsip) dan `aviation-am` (3 teks Aircraft Maintenance, Rev. ORG 2019.9.13, 70 hal.), plus soal contoh resmi (GH 6 soal, AM 5 soal). **Belum**: GH Text 1 "Safety and Quality" REV2 (`/wp-content/uploads/2026/06/GHtext【1.Safety and Quality】.REV2.pdf`, 3,1 MB) dan `sws_ii_GH_vol2.pdf` — gagal diunduh dari browser bawaan; perlu diunduh lewat Chrome pengguna.
- Railway (鉄道, 5 区分): hanya 試験実施要領 & dokumen kebijakan; belum ada teks belajar.
- Linen Supply: bidang baru, mulai 2027-04; baru ada pedoman operasional.
- Distribution/Warehousing (物流倉庫): ujian dibuka 2026-10-26 (日本海事協会), 試験実施要領 masih disusun per 2026-06; tanpa teks belajar.
- Resource Recycling (資源循環): bidang baru, teks belajar belum terbit.
- Taksi: tidak ditemukan PDF teks belajar.
Catatan: satu sumber berita (Mynavi, 2026-07) melaporkan penerimaan baru 特定技能1号 Food Service (外食業) dihentikan sejak Maret 2026; belum diverifikasi ke sumber pemerintah.
Bidang-bidang ini tidak dibuat dari ingatan umum agar isi tetap bisa ditelusuri ke sumber resmi.

Bidang yang sudah ada tetapi masih tipis (per audit): Livestock (54 kosakata), Machine Metal (36 soal), Industrial Mfg (148 soal), Kaigo JP (178 soal).
