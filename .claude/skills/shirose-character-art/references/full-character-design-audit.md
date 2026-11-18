# Full Character Design Audit (Phase 3)

Metode: render semua katalog `js/character.js` + modul tambahan lewat harness Playwright (lihat `audit/contact-*.png`). Rating 1–5 terhadap referensi (5 = setara referensi).

| Kategori | Jumlah | Rating | Temuan | Rekomendasi |
|---|---|---|---|---|
| Rambut | 30 | 3 | Siluet datar; poni runcing referensi (5–6 spike, jambul) tidak ada di semua gaya | Redesain gaya default + variasi dengan poni berspike & highlight |
| Pakaian | 50 | 2.5 | Hampir semua = kaus/jaket polos recolor; badan tabung putih; tidak ada gakuran emas+emblem seperti referensi (`seragam_default` = kaus putih; `n1_suit_legendary` paling dekat) | Buat set gakuran "Shirose" (kerah, list emas, 3 kancing, emblem) sebagai pakaian default; naikkan detail kain |
| Celana | 35 | 2.5 | Flat, banyak recolor; tak ada lipatan/shading | Tambah lipatan, highlight sisi, variasi lebar; hitam lurus sebagai default |
| Sepatu | 32 | 2.5 | Belum dirender di contact sheet ini; terlihat sepatu bulat flat | Audit lanjutan; tambah highlight & sol |
| Aksesori | 40 | 3 | Siluet mudah dibaca & bervariasi (mahkota, halo, tanduk); outline tipis & flat; beberapa aman dipertahankan | Pertahankan; helm (`ac2_helm_ksatria`) perlu redesain berlapis |
| Sayap | 26 | 3.5 | Variasi baik; `sy2_emas_agung` & `sy_malaikat` terdekat dengan referensi tapi bulu 1–2 lapis (referensi ±4 lapis, outline emas tua, glow) | Perkaya `sy2_emas_agung` jadi 4 lapis + glow; jadikan sayap default avatar |
| Aura | 27 | 2.5 | Efek sederhana | Ganti ke busur api lantai + partikel seperti referensi |
| Senjata baru (`wa_*`) | 30 | 3 | Animasi & pose sesuai, tetapi art SVG jauh lebih sederhana dibanding referensi (tanpa ornamen, material, hamon, kristal) | Butuh ilustrasi raster/art ulang (lihat blocker) |
| Senjata legacy (`hh_*`, dll.) | ±60 | 2 | Kecil, flat, hampir identik antar rarity; beberapa belum punya pose khusus tipe | Redesain prioritas: Grimoire, Sword, Katana, Hammer, Staff, Bow, Shield, Spear, Scythe |
| Body (torso/kaki) | – | 2 | Statis; tidak ikut bergerak/berubah pose; proporsi tubuh dasar tinggi-kurus, bukan chibi referensi | Body pose per senjata (stance, bahu) — perlu rig tambahan |
| Dual Daggers / Greatsword | 0 | – | Tidak ada | Buat baru |

## Yang sudah baik (jangan diubah)
Sistem animasi SMIL + palet rarity, siluet aksesori, banyak variasi sayap, struktur katalog/ID/harga.

## Blocker jujur
Kualitas referensi (shading sel, ornamen, rim light) adalah ilustrasi raster. SVG tangan tidak bisa menyamainya; skill melarang pengganti SVG untuk permintaan raster. Image-generation belum terhubung di sesi ini (lihat setup-image-generation.md).

## Update — Shirose Signature Set (SVG, bukan raster)
Ditambahkan di `js/shirose-set.js`: `shirose_gakuran`, `shirose_poni`, `shirose_hitam`, `shirose_sepatu`, `shirose_emas` (sayap 4 lapis), `shirose_api` (aura); senjata baru `wa_daggers_*` & `wa_greatsword_*` (6 rarity, pose idle/ready/attack, dua tangan untuk greatsword, dua belati untuk daggers).
QC `validate_identity.py --no-ssim` (idle): palette wing_gold 0.93, hair_navy 0.87, skin 0.85, glasses_pink 0.55, emblem_purple 0.5 — lulus; histogram korelasi 0.25 → FAIL (latar & gaya render berbeda dari raster). Cek mata: identitas cocok; beda proporsi (badan lebih tinggi-kurus, kepala lebih kecil), tanpa rim light/shading sel. Masih ≈ "dekat", belum "setara" referensi.

## Update 2 — Standar badan v2 (fondasi)
- `baseBody` digambar ulang: kepala persegi-membulat, mata besar berkilau, pipi blush, mulut merah, tangan mitten+jempol, kaki & sepatu dasar lebih tebal. Kontrak koordinat item tidak berubah → 51 pakaian, 36 celana, 33 sepatu, 31 rambut, 40 aksesori, 105 senjata tetap cocok (diuji 840 kombinasi senjata×state×outfit tanpa error).
- Filter `shiro-cel` (outline berwarna + rim light + bayangan sisi) per-slot → semua item lama & baru seragam.
- Generator pakaian/celana/sepatu diberi detail: bayangan kain, lipatan, hem, cuff, kerah, jahitan, sol, highlight.
- Tee dasar tidak lagi mengintip di bawah pakaian lengan panjang.
- Stance kaki per senjata (kaki melebar saat ready/attack) untuk SEMUA celana/sepatu via clip kiri/kanan.
