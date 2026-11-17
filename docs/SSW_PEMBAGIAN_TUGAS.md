# Audit web & pembagian tugas 3 chat (17 Nov 2026)

Angka dihitung langsung dari `data/ssw/*` dan `assets/ssw/*` (bukan dari dokumen lama).

## Kondisi sekarang (19 bidang live)
| Bidang | Soal | Kosakata | Hal. buku | Catatan |
|---|--:|--:|--:|---|
| construction (3 buku) | 961 / 1127 / 1038 | ±4400 | 454/463/504 | Tutorial 5–7 praktik belum |
| food-service (ID/JP) | 895 / 261 | 2463 / 634 | 614 / 331 | NEEDS REVIEW |
| building-cleaning | 629 | 1158 | 211 | |
| accommodation | 546 | 1095 | 63 | NEEDS REVIEW |
| food-manufacturing | 478 | 1463 | 130 | NEEDS REVIEW |
| auto-maintenance | 712 | 469 | 154 | bab sistem kendaraan & flashcard crop belum |
| agriculture | 443 | **213** | 103 | kosakata tipis |
| fishery | 380 | 2370 | 292 | ujian akhir resmi belum |
| livestock | 221 | **54** | 154 | kosakata sangat tipis |
| kaigo / kaigo-jp | 204 / 178 | 280 / 222 | 271 / **0** | kaigo-jp tanpa buku |
| jaim ×3 (resmi) | 167 / 129 / 192 | 110–140 | 361–440 | 18 set soal format terbuka belum terstruktur; 14 kategori lain baru sample |
| wood-industry | 129 | 168 | 89 | tipis |
| auto-transport (truk/bus) | 126 | 167 | 327 | tipis dibanding buku |

## BELUM ADA sama sekali (hanya ada dokumen pedoman ujian, bukan buku belajar)
Kehutanan, Perkapalan/造船, Penerbangan (GH + perawatan), Kereta (5 区分), Linen supply, Logistik/gudang (ujian dibuka 26 Okt 2026), Daur ulang, Taksi.
Forestry sudah terunduh ke PC user (SSW__forestry__*.pdf); sisanya belum.

## Belum teruji di lingkungan nyata (jujur)
Agregasi level lintas-level, sinkron hadiah gacha ke akun, tombol "Atur koin" guru, akses `aksesSswBidang` untuk slug baru (jaim-*, wood, auto-transport) — butuh Firestore & akun siswa asli. Tes UI baru lewat stub (`tools/ssw/qa`).

## Pembagian (tanpa tumpang tindih file)
**Chat 1 (sesi ini)** — dokumen resmi & kedalaman bidang kayu/truk
1. Unduh PDF resmi bidang yang belum ada → halaman "Dokumen resmi" di web + tombol dari hub SSW.
2. Tambah soal/kosakata Wood (129 soal) & Truk/Bus (126 soal, 167 vocab) dari bukunya.
3. Kosakata Livestock (54) & Agriculture (213).
File yang disentuh: `js/ssw.js`, `tools/ssw/wood_*`, `truck_*`, `assets/ssw/docs-resmi/`, `data/ssw/{wood-industry,auto-transport,livestock,agriculture}`.

**Chat 2** — JAIM (工業製品製造業)
1. Strukturkan 18 set soal format terbuka → soal resmi di quiz.json.
2. Unduh/parse sample 14 kategori JAIM lain; review glosarium.
3. Buku/halaman untuk kaigo-jp.
File: `tools/imm/*`, `ssw-materials/industrial-manufacturing`, `data/ssw/jaim-*`, `data/ssw/kaigo-jp`.

**Chat 3** — kualitas & verifikasi
1. Audit NEEDS REVIEW (furigana, kunci jawaban) pada accommodation, food-*, auto-maintenance, kaigo.
2. Auto-maintenance: bab sistem kendaraan, crop gambar flashcard; fishery ujian akhir; construction Tutorial 5–7.
3. Daftar uji manual untuk user (login siswa/guru) untuk fitur level/gacha/koin + perbarui `SSW_QA_REPORT.md`.
File: `data/ssw/{auto-maintenance,fishery,construction*,accommodation,food-*}`, `docs/SSW_QA_REPORT.md`.

Aturan bersama: sebelum push `git pull --rebase`; bump `sw.js` CACHE hanya untuk perubahan aset/JS; jangan sentuh file milik chat lain; catat progres di file `docs/SSW_*` milik masing-masing.
