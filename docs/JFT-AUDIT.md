# Audit JFT-Basic Shirose Nihongo

_Dibuat otomatis oleh `node tools/jft-audit.mjs --md` — 2026-11-18._

## Inventaris

| Komponen | Jumlah |
|---|---:|
| Bank konversasi (conv) | 37 |
| Bank listening (bank.json) | 16 |
| Bank reading | 10 teks / 20 soal |
| Paket tryout/Full Test | 23 (50/50/50/50/50/50/50/50/50/50/50/50/50/50/50/50/50/50/50/50/50/50/50 soal) |
| Soal isian (latihan) | 24 |
| Item Choukai JFT (paket 901–904) | 156 (901:45, 902:43, 903:44, 904:24) |
| Berkas audio Choukai JFT | ir0:45, ir1:43, ir2:44, sim:24 |
| Audio dirujuk tapi berkas hilang | 0 |
| Audio tidak dipakai soal mana pun | 0 |
| PPT resmi Irodori | 54 bab · 1781 slide · 793 slide ber-audio |
| Sumber ir0 | 1081 kosakata · 157 kanji · 54 bunpou |
| Sumber ir1 | 425 kosakata · 145 kanji · 54 bunpou |
| Sumber ir2 | 442 kosakata · 119 kanji · 54 bunpou |

## Masalah data

| Jenis | Jumlah |
|---|---:|
| duplikat-antar-paket | 8 |

Contoh (maks 5 per jenis):

- **duplikat-antar-paket**: ft19[40] = ft06; ft19[41] = ft06; ft19[42] = ft07; ft19[43] = ft07; ft20[38] = ft16

## Temuan manual & rekomendasi

- **Choukai bukan audio resmi Irodori.** Audio di `audio/choukai/jft/*` dibuat dengan TTS (VOICEVOX) dari naskah orisinal Shirose; PDF/audio Choukai resmi Irodori **tidak ada di workspace** (hanya PDF kosakata Starter). Tidak ada referensi file palsu — bila PDF+audio resmi diunggah, integrasi nomor latihan → audio → soal bisa dibuat dengan struktur paket `choukai/paket/n5-p90x.json` yang sama.
- **Slide PPT resmi** (54 bab, ±1.8 ribu slide) berupa gambar + titik audio; belum punya latihan per poin → ditambah mode latihan interaktif per slide (lihat `js/jft-slide.js`).
- **Paket 6-bab**: tiap level sudah punya 3 blok (bab 1–6, 7–12, 13–18) × 3 paket = target minimal 3 paket per enam bab terpenuhi; paket digenerate dari kosakata+kanji+bunpou bab terkait dengan benih tetap.
- **Full Test**: 20 paket (`ft01`–`ft20`) × 50 soal (12 huruf & kosakata · 14 percakapan · 12 choukai · 12 dokkai) dibangun `node tools/build-fulltest.mjs`; kosakata tiap soal unik antar paket, percakapan/choukai/dokkai dibagi per kuota sehingga duplikat antar paket < 1%.
- **Skor**: pemetaan linear internal 0%→10, 50%→145, 70%→200, 100%→250 hanyalah estimasi latihan. Rentang level mengikuti Japan Foundation (145–174 A1, 175–199 A2.1, 200–250 A2.2/A2, <145 `*`). Halaman hasil kini berlabel *estimasi latihan* dan memuat tabel total/benar/salah/akurasi + analisis 4 kategori + rekomendasi.
- **CBT**: satu soal per layar, nomor soal, timer 60 menit, kunci bagian setelah pindah bagian, konfirmasi selesai — sudah ada. Aturan navigasi Listening resmi (audio 2× putar) sesuai implementasi sekarang; belum diverifikasi terhadap CBT Prometric asli.
- **Belum divalidasi native**: bahasa Jepang soal baru ditulis orisinal oleh Claude (A1–A2); disarankan review guru sebelum dipakai sebagai ujian resmi.
