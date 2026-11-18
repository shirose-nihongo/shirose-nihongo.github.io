# Audit hafalan SSW (manufaktur → aviation)

Dibuat otomatis oleh `tools/ssw/hafal_build.py`. Semua arti/contoh = materi buatan Shirose, **perlu review ahli**; bukan soal/terjemahan resmi.

Contoh kalimat kosakata: dari materi (pasangan JP-ID bila ada, kalau tidak kalimat JP saja) + ±115 contoh manual Shirose (`tools/ssw/contoh_manual.py`, perlu review). Sisa ±180 "kosakata" JAIM adalah judul subbab, sengaja tanpa contoh.

| Bidang | Kosakata | Vocab tanpa contoh | Katakana | Kanji | Bunpou (contoh dari materi) |
|---|---|---|---|---|---|
| jaim-machine-metal | 110 | 110 | 288 | 967 | 51 (1) |
| jaim-elec-electronic | 121 | 121 | 452 | 998 | 48 (1) |
| jaim-metal-surface | 140 | 140 | 346 | 969 | 47 (1) |
| wood-industry | 168 | 0 | 100 | 420 | 32 (30) |
| auto-transport | 167 | 0 | 51 | 458 | 33 (31) |
| railway-vehicle | 125 | 125 | 47 | 355 | 16 (16) |
| forestry | 65 | 65 | 16 | 278 | 20 (20) |
| linen-supply | 61 | 61 | 35 | 190 | 13 (13) |
| logistics | 89 | 0 | 43 | 259 | 22 (22) |
| recycling | 34 | 0 | 12 | 170 | 19 (18) |
| aviation-gh | 142 | 142 | 130 | 431 | 32 (29) |
| aviation-am | 101 | 101 | 171 | 439 | 30 (19) |

Total: kosakata 1323, katakana 1691, kanji 5934, bunpou 363; kosakata tanpa contoh 865.

## Temuan
- Bunpou JAIM kebanyakan memakai contoh umum (bukan kalimat materi) — perlu contoh teknis.
- Pola bunpou berbasis regex; beberapa pola pendek (ば, ても, より, ほど) bisa salah-tandai di pop-up teks.
- Arti kanji dari kamus N-level + ±90 entri manual; arti katakana dari glosarium Shirose (±655 kata).
- Belum diuji: akun siswa nyata / Firestore SRS (QA memakai stub).

## Akses
Hub bidang › tombol Katakana / Kanji / Bunpou → daftar bisa dicari + Flashcard / Pilihan ganda (100 kartu acak per sesi). Rute: `ssw-pustaka/<slug>/<katakana|kanji|bunpou>`.
