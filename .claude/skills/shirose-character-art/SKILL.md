---
name: shirose-character-art
description: Membuat dan mengedit ilustrasi raster karakter Shirose Nihongo (turnaround, pose, pose senjata, expression sheet, sprite sheet, frame animasi) dengan identitas karakter terkunci dan validasi visual. Pakai saat diminta gambar/aset karakter, bukan untuk SVG/CSS.
---

# shirose-character-art — Character artist & game asset designer untuk Shirose Nihongo

Skill ini mengubah Claude menjadi character artist yang bekerja lewat **image-generation tool yang benar-benar terhubung**, menjaga identitas karakter tetap identik, dan memvalidasi setiap hasil terhadap gambar referensi sebelum disimpan sebagai aset project.

## 0. Aturan keras (baca dulu)

1. **Referensi karakter itu immutable.** Master: `assets/characters/<id>/ref/` (untuk Shirose: `shirose-idle-master.png` + `weapon-animation-sheet.png`). Jangan ditimpa, dikompres ulang, atau diedit. Salinan kerja boleh.
2. **Jangan ubah** wajah, rambut, kacamata, kostum, emblem, sayap, warna, atau proporsi. Detail lengkap: `references/character-bible-shirose.md`. Kalau permintaan user bertentangan dengan bible, tanyakan — jangan menebak.
3. **Jangan klaim bisa membuat gambar bila image-generation tool belum terhubung.** Lakukan *capability gate* (bagian 1). Gagal gate → berhenti, jelaskan jujur, beri instruksi setup (`references/setup-image-generation.md`).
4. **Jangan mengganti ilustrasi raster dengan SVG/CSS/canvas buatan sendiri**, walaupun lebih mudah. SVG hanya bila user memintanya secara eksplisit (mis. layer avatar di `js/character.js`).
5. **Referensi identitas dan referensi pose dipisah.** Identitas (wajah/kostum) lewat slot image-reference; pose lewat slot pose (skeleton/OpenPose/mannequin/depth). Jangan mengirim satu gambar yang membawa keduanya.
6. **Setiap hasil divalidasi** (bagian 4). Hasil yang menyimpang → revisi, bukan diloloskan.
7. Jangan commit/push/deploy kecuali diminta. Jangan mengubah sistem JLPT, FSRS, flashcard, koin/shop, login, dashboard guru, database siswa.

## 1. Capability gate (wajib di awal setiap sesi aset)

Jalankan berurutan dan catat hasilnya:

1. Cek tool yang ada di sesi: nama berawalan/berisi `comfy`, `image`, `diffusion`, `flux`, `generate`, atau connector gambar. Gunakan ToolSearch bila tool ditunda (deferred).
2. Cek ComfyUI lokal: `python3 .claude/skills/shirose-character-art/scripts/comfy_client.py status` (env `COMFY_URL`, default `http://127.0.0.1:8188`). Exit 0 = terhubung.
3. Cek registry connector (SearchMcpRegistry: "comfyui", "image generation") → tawarkan via SuggestConnectors bila ada yang cocok.
4. Ingat: sandbox cloud biasanya **tidak** bisa menjangkau `localhost` komputer user dan API gambar eksternal diblokir allowlist. ComfyUI di PC user hanya bisa dipakai bila Claude berjalan di PC itu (Claude Code lokal / Claude desktop + MCP) atau lewat MCP server yang menjembatani.

Hasil gate:
- **Ada tool + terhubung** → lanjut bagian 2.
- **Tidak ada** → katakan terus terang: "Image-generation belum terhubung, jadi saya belum bisa membuat gambar." Boleh menyiapkan *brief/prompt pack/daftar pose/struktur folder* dan memberi langkah setup, tetapi **label jelas sebagai persiapan, bukan hasil gambar**. Jangan membuat pengganti SVG/CSS untuk permintaan raster.

## 2. Persiapan per permintaan

1. Tentukan: karakter (`id`), jenis aset (lihat 3), state/pose, ukuran, tujuan folder. Tanya hanya jika benar-benar menghalangi.
2. Muat `references/character-bible-shirose.md` (atau bible karakter lain) dan lihat gambar master dengan Read.
3. Siapkan input terpisah:
   - **identity ref**: master idle (+ turnaround yang sudah disetujui).
   - **pose ref**: skeleton/OpenPose/depth/mannequin untuk pose yang diminta (buat atau minta; jangan pakai gambar karakter lain sebagai pose karena membawa identitasnya).
   - **prop ref**: sheet senjata/aksesori (benda saja, tanpa karakter).
   - **expression ref** (opsional): hanya area wajah.
4. Tentukan seed & parameter; semuanya dicatat ke `manifest.json` aset.

## 3. Resep per jenis aset

Selalu mulai dari bentuk paling sederhana, setujui, lalu turunkan ke yang lain (anchor-first).

- **Character turnaround**: depan → 3/4 depan → samping → 3/4 belakang → belakang. Pose netral (A-pose), skala & garis tanah sama, latar polos. Depan disetujui dulu; view lain memakai depan sebagai identity ref + pose skeleton view-nya. Sayap & emblem harus konsisten antar-view (emblem tidak terlihat dari belakang; sayap tetap).
- **Pose variations**: identity ref tetap, ganti pose ref saja. Kekuatan pose ref cukup untuk pose, tidak sampai mengubah proporsi chibi.
- **Weapon poses**: buat/pakai *prop sheet* dulu (senjata tunggal, skala chibi). Lalu pose tangan lewat pose ref (jari menggenggam di titik pegangan) + inpaint area tangan/senjata. Sayap emas **harus tetap terlihat**. Pose per tipe: lihat tabel animType di `references/character-bible-shirose.md`.
- **Expression sheet**: 8 ekspresi (netral, senang, serius, kaget, sedih, bangga, fokus-casting, teriak-serang). Hanya wajah yang berubah — gunakan inpaint dengan mask wajah; rambut, kacamata, kostum, sayap dibekukan.
- **Sprite sheet / animation frames**: key pose dulu (idle 2, ready 2, attack 3–4 key), lalu in-between dengan interpolasi pose. Semua frame satu skala & anchor kaki yang sama; gunakan `scripts/spritesheet.py` untuk menormalkan, merakit atlas, dan membuat GIF preview.
- **Ekspor game-ready**: PNG/WebP transparan, master 512×512 (atau 1024), turunan 256/128, versi @2x bila perlu. Cek tepi (halo latar) di atas latar gelap & terang. Kompres WebP untuk dipakai di web, simpan master PNG.

## 4. Validasi visual (wajib, dan loop revisi)

Untuk **setiap** kandidat:

1. Otomatis:
   `python3 .claude/skills/shirose-character-art/scripts/validate_identity.py --ref assets/characters/shirose/ref/shirose-idle-master.png --cand <kandidat.png> --out <dir_report> [--strict] [--no-ssim]`
   Mengecek: proporsi warna identitas (rambut navy, kacamata pink, sayap emas, emblem ungu, kulit, seragam), korelasi histogram, lebar sayap relatif, kecocokan fitur ORB, SSIM kepala. Gunakan `--strict` hanya untuk idle depan/turnaround depan; untuk pose senjata/aksi pakai mode biasa dan `--no-ssim` bila kepala miring/menunduk/tertutup (warna senjata & efek menggeser rasio emblem/seragam). Menghasilkan `*.sbs.png` (ref | kandidat | selisih) dan `*.report.json`.
2. **Cek mata (wajib, tidak bisa digantikan skrip)**: buka `*.sbs.png` dan kandidat dengan Read, lalu centang daftar di bawah. Skrip hanya menangkap penyimpangan warna/komposisi kasar; ia bisa PASS padahal wajah berubah atau FAIL karena warna senjata.

   Checklist identitas: ☐ rambut navy pendek dengan poni runcing sama ☐ kacamata bulat merah muda, bentuk & ukuran sama ☐ wajah chibi, mata titik sederhana, blush sama ☐ seragam hitam dengan list emas dan 3 kancing emas ☐ emblem ungu di dada (cek simbol terhadap master/bible) ☐ sayap emas besar berbentuk kelopak, berlapis, tidak hilang/berubah warna ☐ proporsi kepala:badan & kaki pendek sama ☐ celana & sepatu hitam ☐ tangan/jari wajar (5 jari atau gaya tangan chibi master) ☐ senjata tidak menutupi emblem/wajah secara aneh ☐ tidak ada elemen baru (aksesori, jubah, rambut) ☐ gaya render (outline, shading) sama dengan master.
3. **Revisi** bila gagal. Tangga perbaikan (naik satu tingkat tiap percobaan):
   1. seed baru; 2. naikkan bobot identity ref / turunkan kekuatan pose; 3. inpaint area yang menyimpang (rambut / kacamata / emblem / sayap / tangan) dengan mask + identity ref; 4. perbaiki prompt negatif untuk elemen asing; 5. pakai/latih LoRA karakter (lihat setup). Maksimum 5 putaran per aset.
4. Catat setiap putaran di `manifest.json` (`attempts[]`: seed, parameter, skor, alasan gagal). Bila setelah 5 putaran tetap gagal: serahkan hasil terbaik **dengan label gagal-validasi dan alasan**, jangan diam-diam diloloskan.

## 5. Penyimpanan aset (project Shirose Nihongo)

```
assets/characters/<id>/
  ref/                 # IMMUTABLE — master & sheet referensi (jangan diubah)
  turnaround/          # <id>_turn_<view>.png
  poses/               # <id>_pose_<nama>.png
  weapons/<animType>/  # <id>_<animType>_<state>_<nn>.png  (state: idle|ready|attack|special)
  expressions/         # <id>_expr_<nama>.png + sheet
  sprites/             # <nama>.png + <nama>.json (atlas) + <nama>.gif (preview)
  work/                # kandidat, report validasi, manifest (boleh dibuang)
  manifest.json        # prompt, seed, model, ref yang dipakai, hasil validasi per aset
```
- Gunakan path relatif repo; periksa ukuran (target < 400 KB per sprite web, WebP) sebelum menyimpan.
- Jangan menimpa file `ref/`. Jangan commit/push kecuali diminta; bila diminta, commit hanya aset final + manifest, bukan `work/`.
- Integrasi ke game: sistem equip & animasi yang ada (`js/character.js`, `js/weapon-anim.js`) berbasis SVG berlapis. Aset raster adalah jalur terpisah; jangan membuat sistem inventory/equipment baru. Bila diminta mengintegrasikan, petakan `animType` ↔ folder `weapons/<animType>/` dan tambahkan lewat opsi render, tanpa mengubah database siswa.

## 6. Melaporkan hasil

Lapor singkat: apa yang dibuat, di mana disimpan, skor validasi + hasil cek mata, dan masalah yang tersisa. Sertakan `*.sbs.png` untuk yang diragukan. Jangan mengklaim "mirip" tanpa menjalankan validasi.

## 7. Karakter lain

Skill ini berlaku untuk semua karakter Shirose Nihongo:
1. Buat `assets/characters/<id>/ref/` dengan master (idle depan, latar polos) — minimal 1 master + 1 turnaround sebelum membuat aset lain.
2. Salin template di bawah `references/character-bible-shirose.md` ke `references/character-bible-<id>.md` dan isi (deskripsi, palet hex, proporsi, hal terlarang).
3. Tambah profil warna baru di `PROFILES` pada `scripts/validate_identity.py` (kalibrasi dengan master: jalankan master terhadap dirinya sendiri dan panel pose lain).
4. Ikuti alur 1–6 yang sama.

## 8. Larangan

- Mengklaim gambar dibuat tanpa tool yang terbukti terhubung.
- Menggambar ulang karakter dengan SVG/CSS/canvas untuk permintaan raster.
- Memakai gambar pose berkarakter lain sebagai pose ref; mencampur identity & pose dalam satu slot.
- Mengubah/menimpa file di `ref/`.
- Meloloskan hasil yang gagal validasi tanpa label.
- Menyentuh fitur belajar, database siswa, koin/shop, login; commit/push/deploy tanpa diminta.
