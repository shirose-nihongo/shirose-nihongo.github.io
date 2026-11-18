# Master Character Visual Specification — Shirose Nihongo

Sumber: hasil pembacaan zoom `weapon-animation-sheet.png` (18 panel: Idle, Grimoire x2, Hammer, Sword, Katana, Staff, Spear, Bow, Dual Daggers, Shield, Scythe + strip Idle/Ready/Attack). Phase 1 = pengamatan; Phase 2 = spesifikasi. Semua angka adalah perkiraan dari gambar, bukan ukuran resmi.

## 1. Identitas
Murid chibi berseragam sekolah hitam-emas dengan sayap emas besar. Gaya: ilustrasi 2D "toy-like" bersih, outline tipis gelap berwarna (bukan hitam pekat), warna flat dengan gradasi lembut dan rim light hangat. Latar panel: ungu-indigo gelap dengan bokeh partikel emas. Wajah selalu terbaca di semua pose.

## 2. Anatomi & proporsi
- Chibi ~2,2 kepala: kepala ≈ 30% tinggi total (tanpa sayap), torso pendek ≈ 28%, kaki ≈ 35%.
- Kepala kotak membulat (lebar ≈ lebar bahu), leher hampir tak terlihat; emblem menggantung di bawah dagu menutupi leher.
- Bahu sempit dan miring turun; lengan tabung pendek, tangan kecil seperti sarung tangan/mitten (jempol terpisah saat menggenggam).
- Kaki tabung lurus, sedikit melebar ke bawah; sepatu hitam bulat-kotak, tinggi ≈ 8% tubuh.
- Pose senjata menggeser berat badan: stance lebar (Sword, Shield, Dual Daggers rendah berlutut), tubuh memutar (Bow), satu bahu naik (Hammer di bahu).

## 3. Wajah & rambut
- Rambut navy (#1e2f6b, highlight #2f4a9a), poni runcing 5–6 spike tidak simetris, sisi menutupi telinga, ada jambul kecil di atas kepala.
- Kacamata bulat tipis pink/merah (#f472b6), lensa bening, mata titik biru-ungu besar dengan highlight putih.
- Kulit peach (#f6c9a8) dengan pipi blush pink lembut; mulut senyum kecil merah tipis. Ekspresi berubah: wink (Hammer), fokus (Bow), tenang (default).

## 4. Kostum
- Gakuran hitam: kerah berdiri dengan list emas, lapel V, 3 kancing emas bulat, saku pinggang, ujung jaket lurus dengan list emas.
- Emblem persegi ungu (#7c3aed) di dada atas dengan bintang/simbol emas bercahaya; dasi/kerah oranye-emas kecil di bawahnya; kemeja putih sedikit terlihat.
- Lengan jaket hitam dengan cuff emas tipis.

## 5. Celana, sepatu, aksesori
- Celana hitam lurus dengan lipatan halus, highlight biru-ungu di sisi.
- Sepatu hitam mengilap, highlight tipis; tanpa detail tali.
- Aksesori: kacamata, emblem. Tidak ada helm/armor di referensi — helm & armor baru harus kompatibel dengan siluet ini.

## 6. Anatomi tangan & grip
- Tangan mitten kecil, jempol melingkari gagang; genggaman satu tangan = jempol di atas, empat jari menutup; dua tangan = tangan belakang di pommel, depan ±1 lebar tangan di depannya.
- Katana: dua tangan di depan perut, pedang horizontal. Staff/Spear/Scythe: satu tangan tinggi, satu rendah. Bow: tangan kiri meraih busur lurus, tangan kanan menarik senar ke pipi. Hammer: satu tangan di bahu menahan gagang. Shield: lengan menekuk, perisai menutup sisi tubuh. Grimoire: dipegang satu tangan telapak di bawah / melayang dengan dua telapak terbuka.
- Tidak ada jari individual; bentuk sederhana tapi sudut siku/pergelangan terbaca.

## 7. Cahaya & shading
- Sumber utama atas-depan; rim light hangat emas/oranye di tepi sayap dan bahu; rim ungu dari sisi senjata magis.
- Bayangan lembut ungu-gelap di bawah kaki (elips) + ring oranye/ungu tipis di lantai.
- Shading sel 2–3 tingkat pada kain; specular kecil di senjata logam.

## 8. Material & tekstur
Kain hitam matte dengan sedikit highlight biru; emas metalik (gradasi #f7b928→#e3b02c→#a8741a); kulit halus; bulu sayap berlapis dengan outline emas tua; logam pedang putih-biru dengan tepi terang; kayu/gagang navy-ungu dengan ornamen emas.

## 9. Desain senjata (ringkas; detail di master-weapon-equipment-reference.md)
Bahasa desain: navy + emas + aksen ungu; ornamen bintang/matahari bersudut; cahaya ungu pada bilah/kristal.

## 10. Armor & perlengkapan
Belum ada di referensi. Aturan: tidak menutupi wajah (kecuali visor terbuka), tidak menutupi emblem, siluet chibi dipertahankan, palet hitam/navy/emas.

## 11. Aura & VFX
- Idle: dua busur api oranye di kiri-kanan kaki. Ready: partikel emas naik. Attack: swoosh/ledakan sesuai senjata (arc ungu-putih untuk pedang/sabit, burst emas untuk hammer, ring ungu untuk grimoire terbang).
- Sayap emas sendiri bercahaya (glow hangat) dan harus selalu terlihat.

## 12. Pose & animasi
Tiga state: Idle (napas, sayap sedikit), Ready (stance senjata + partikel), Attack (ayun/tusuk/tembak + VFX). Rambut, jaket, sayap dan aura harus ikut bergerak sedikit (lag 100–200 ms). Lepas senjata → kembali Idle normal.

## 13. Gaya render
Vektor/raster bersih, tepi halus, outline 1–2 px relatif ke 1024, gradasi lembut, tanpa noise, tanpa 3D realistis. Latar transparan untuk aset game.

## Pengamatan celah vs. kode saat ini
- Referensi: emblem berisi bintang emas; bible lama menulis 文 — perlu keputusan pemilik (lihat open items).
- Referensi punya 12 pose senjata dengan tubuh/kaki ikut berubah; sistem SVG saat ini hanya menganimasikan lengan+senjata (torso/kaki statis).
