# Character bible — Shirose Nihongo (id: `shirose`)

Sumber kebenaran visual: `assets/characters/shirose/ref/shirose-idle-master.png` (panel Idle) dan `weapon-animation-sheet.png` (semua pose senjata). Bila teks di bawah berbeda dengan gambar master, **gambar menang**, kecuali user menyatakan lain — catat selisihnya dan tanyakan.

## Identitas yang TIDAK BOLEH berubah
| Elemen | Deskripsi | Warna acuan |
|---|---|---|
| Gaya | chibi/SD, kepala besar (± 1/3 tinggi total), kaki pendek, tangan kecil bulat, outline tipis, shading cel lembut | — |
| Rambut | biru tua (navy), pendek, poni runcing/tufted, menutupi dahi | navy ≈ #1e2f6b (highlight #3b52a8) |
| Wajah | bulat, kulit peach, mata titik sederhana, blush tipis, mulut kecil | kulit ≈ #f9dcc2 |
| Kacamata | bulat, bingkai merah muda, lensa nyaris bening | pink ≈ #f472b6 |
| Seragam | jas/gakuran hitam dengan list emas, 3 kancing emas di tengah, kerah | hitam ≈ #14141c, emas ≈ #e3b02c |
| Emblem | persegi panjang ungu di dada atas, simbol emas **文** (di master tampak seperti ornamen emas bergaya bintang — verifikasi dengan user bila simbol penting) | ungu ≈ #7c3aed, emas #fde68a |
| Sayap | besar, bentuk kelopak/bulu panjang, berlapis (± 9 helai per sisi) mengembang dari punggung, emas cerah dengan pinggir oranye; **selalu terlihat**, juga saat memegang senjata | emas ≈ #f7b928 → #c98a06 |
| Bawahan | celana hitam lurus, sepatu hitam | — |
| Efek dasar | percik/ember oranye kecil di sekitar pinggul pada idle | oranye ≈ #f97316 |

## Yang BOLEH berubah per aset
Pose tubuh, arah pandang, ekspresi (hanya wajah), posisi tangan, senjata/prop, efek (aura/partikel sesuai rarity), sudut kamera (turnaround).

## Terlarang
Mengganti gaya jadi anime warrior realistis; menghapus/menyembunyikan sayap; mengganti warna rambut/kacamata; menambah jubah, helm, armor, rambut panjang; mengubah proporsi chibi; menghapus emblem; menambah teks/watermark.

## Pose per tipe senjata (acuan = weapon-animation-sheet.png)
| animType | Pose inti | Catatan identitas |
|---|---|---|
| (tanpa senjata) | Idle tegak, tangan di samping | master |
| grimoire_held | buku di tangan kanan di samping/depan, tangan kiri terbuka (gaya mage elegan), halaman bergerak | sayap tetap terlihat |
| grimoire_float | buku melayang di depan dada, kedua telapak menghadap atas di bawah buku, cincin + partikel sihir | tangan harus berinteraksi dengan buku |
| hammer | palu di bahu atau dua tangan, kaki terbuka kokoh, ayunan berat saat attack | proporsi chibi tetap |
| sword | pedang tangan kanan, tangan kiri bertahan, stance knight, tebasan cepat | |
| katana | stance rendah, dua tangan, iaijutsu, tebasan presisi | |
| staff | tongkat 1–2 tangan, efek sihir di ujung | |
| spear | tombak ke depan, stance lancer, tusukan cepat | |
| bow | busur satu tangan, tangan lain menarik tali, panah bercahaya | |
| dual_daggers | dua belati, tubuh rendah, kombinasi dua tebasan | |
| shield | perisai di depan tubuh, defensive stance, efek pelindung | |
| scythe | sabit 1–2 tangan, pose dark reaper, ayunan melingkar | |

State yang didukung: idle, ready, attack, special. Rarity mengubah **intensitas efek** (common polos → mythic paling istimewa), bukan pose.

## Template karakter baru
```
# Character bible — <Nama> (id: <id>)
Master: assets/characters/<id>/ref/<id>-idle-master.png
## Identitas (tabel: elemen | deskripsi | hex acuan)
## Boleh berubah
## Terlarang
## Profil validasi: tambahkan ke PROFILES di scripts/validate_identity.py
```
