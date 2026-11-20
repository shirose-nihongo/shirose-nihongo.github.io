# Laporan Kondisi Awal — Bank Soal JLPT N5–N2

Tahap 1 (audit saja — **belum ada soal yang diubah**). Dibuat 2026-11-20.
N1 tidak diaudit (sudah selesai, tidak disentuh).

Berkas pendukung di folder ini:

| Berkas | Isi |
|---|---|
| `baseline.json` | Angka mentah audit otomatis per level / file / kategori |
| `flags.csv` | 1 baris per temuan per soal (±9.900 baris) — bisa di-filter di Excel |
| `benchmark.json` | Statistik bank Shirose vs soal JLPT asli (angka saja, tanpa teks soal) |
| `STATUS.csv` | Status pengerjaan per level × paket × file (kolom `status_revisi` diisi manual) |
| `RUBRIK-QC.md` | Sistem evaluasi kualitas + **draf standar** yang perlu disepakati |

Cara menjalankan ulang (read-only, tidak mengubah data):

```
node tools/jlpt_audit/audit.mjs
node tools/jlpt_audit/benchmark.mjs <path ref_dec.json>
node tools/jlpt_audit/status.mjs
```

---

## 1. Struktur bank soal

**Lokasi data.** Semua soal JLPT yang tampil di website ada di `jlpt/<level>/*.json` dan didaftarkan di `jlpt/index.json`. Struktur tiap file: `sections[] → items[]`, ditambah `passages{}` untuk Dokkai. Setiap soal punya `id`, `opts`, `ans`, dan penjelasan `ex`.

**Choukai** punya 3 lapis:

1. Naskah sumber: `tools/choukai-src/<lv>-pNN.txt`.
2. Paket choukai: `choukai/paket/<lv>-pNN.json`, dibuat oleh `tools/choukai_build.py`.
3. Salinan di Full Exam: `jlpt/<lv>/full-NN.json` (`ck.script`, `ck.dialog`, `ck.audio`).

MP3 (`audio/choukai/<lv>/pNN/`) dibuat oleh workflow *voice pack* (TTS) setelah push ke `main`. Artinya, merevisi Choukai = mengubah naskah, lalu membuat ulang audio.

**Pipeline pembuatan.** Bank bahasa: `tools/rw/<lv>/`. Pembangunnya: `tools/jlpt_rewrite.py`, `jlpt_dokkai_long.py`, `jlpt_kumitate/`, `jlpt_star_pack.py`, dan `jlpt_dedupe.py`. Catatan `tools/PROGRESS_exam20.md` memperingatkan: **jangan menjalankan ulang `jlpt_rewrite.py`**, karena duplikat akan muncul lagi. Revisi sebaiknya berupa *patch* terkontrol ke JSON, lalu dicek ulang dengan audit/dedupe.

**Riwayat siswa.**
- Hasil ujian disimpan di Firestore plus cadangan lokal.
- Jawaban disimpan **berdasarkan posisi soal (index)**, dan halaman pembahasan memuat ulang file paket (`h.file`).
- Akibatnya, jika soal diubah *di tempat*, pembahasan ujian lama akan menampilkan soal baru dengan jawaban lama siswa.
- Dampak ini memengaruhi pilihan mekanisme revisi (lihat §6).

## 2. Inventaris N5–N2

| Level | Full Exam | Latihan Kanji | Latihan Kotoba | Latihan Bunpou | ★ | Dokkai | **Total soal** |
|---|---|---|---|---|---|---|---|
| N5 | 20 × 84 = 1.680 | 20 × 8 = 160 | 20 × 20 = 400 | 120 | 4 × 20 | 10 | **2.450** |
| N4 | 20 × 88 = 1.760 | 20 × 20 = 400 | 20 × 20 = 400 | 269 | 4 × 20 | 10 | **2.919** |
| N3 | 20 × 88 = 1.760 | 400 | 400 | 120 | 4 × 20 | 10 | **2.770** |
| N2 | 20 × 91 = 1.820 | 400 | 400 | 235 | 4 × 20 | 10 | **2.945** |
| **Total** | 80 paket | 80 | 80 | 80 | 16 | 4 | **11.084** |

Paket 01–20 lengkap untuk keempat level, dan semua file audio Choukai yang dirujuk ada di disk (0 audio hilang).

## 3. Kategori soal yang tersedia

| Kategori | Tipe (mondai) di bank |
|---|---|
| Kanji | 漢字読み, 表記 |
| Kotoba | 文脈規定, 言い換え類義, 用法, 接頭辞・接尾辞 (N2), **語彙の意味** (bukan format JLPT — pilihan berbahasa Indonesia, hanya di paket latihan) |
| Bunpou | 文法形式の判断, 文の組み立て (★), 文章の文法 |
| Dokkai | 短文, 中文, 長文 (N3), 統合理解 (N2), 情報検索, お知らせ/メモ |
| Choukai | 課題理解, ポイント理解, 概要理解 (N3–N2), 発話表現 (N5–N3), 即時応答, 統合理解 (N2) |

## 4. Hasil audit otomatis

Audit otomatis hanya menangkap masalah yang bisa dideteksi mesin. **"Bersih otomatis" ≠ "memenuhi standar".** Kealamian bahasa dan kualitas pengecoh tetap perlu diperiksa manual memakai rubrik.

Kode berat: **B** = kunci/struktur rusak, **M** = mayor, **m** = minor.

| Level | Soal | Ditandai | Bersih otomatis | B | M | m |
|---|---|---|---|---|---|---|
| N5 | 2.450 | 1.384 | 1.066 | 0 | 266 | 1.118 |
| N4 | 2.919 | 1.565 | 1.354 | 0 | 408 | 1.157 |
| N3 | 2.770 | 1.829 | 941 | 0 | 603 | 1.226 |
| N2 | 2.945 | 1.079 | 1.866 | 0 | 658 | 421 |
| **Total** | **11.084** | **5.857** | **5.227** | **0** | **1.935** | **3.922** |

Yang **tidak** ditemukan:
- kunci di luar pilihan,
- penjelasan yang menunjuk huruf jawaban yang berbeda,
- opsi ganda,
- audio hilang,
- pilihan 発話表現/即時応答 yang beda dengan audio.

Integritas teknis bank sudah baik. Masalahnya ada di **kualitas isi**.

### Temuan per kode (gabungan N5–N2)

| Kode | Jumlah | Arti |
|---|---|---|
| KANJI_DI_ATAS_LEVEL | 3.827 | Kanji di luar daftar level situs. ⚠ **Keyakinan rendah**: daftar `data/kanji-n5.json` hanya 81 kanji dan tidak memuat kanji N5 klasik (曜・買・会・駅). Perlu keputusan daftar acuan (lihat §7). |
| PENJELASAN_GENERIK | 2.856 | Pengecoh tidak dijelaskan (hampir semua Choukai) atau penjelasan templat ("Bukan bacaan yang benar…") |
| DIALOG_PENDEK | 1.118 | Dialog Choukai di bawah batas wajar level |
| JAWABAN_TERPANJANG | 944 | Jawaban benar jauh lebih panjang dari pengecoh (mudah ditebak) |
| BACAAN_PENDEK | 332 | Bacaan Dokkai terlalu pendek |
| KOSAKATA_DI_ATAS_LEVEL | 338 | Kata yang diuji berasal dari level lebih tinggi |
| PENGECOH_TIDAK_DISEBUT | 252 | ≥ 2 pengecoh Choukai tidak muncul sama sekali di audio |
| DUPLIKAT_LINTAS_LEVEL | 99 | Soal sama persis dipakai di level lain (terutama Choukai N4 ↔ N5) |
| DUPLIKAT_LEVEL | 47 | Soal/dialog sama di level yang sama (★, dokkai N2) |
| JAWABAN_DISEBUT_VERBATIM | 54 | Jawaban diucapkan persis, pengecoh tidak |
| SATU_PEMBICARA | 46 | 課題/ポイント hanya satu pembicara |

Selain itu:
- **Format N2:** 即時応答 di 20 Full Exam N2 hanya 11 soal (resmi: 12).
- **Posisi jawaban:** pilihan D sedikit kurang dipakai (±21% vs 25%) di semua level.

## 5. Perbandingan dengan soal JLPT asli

Referensi yang dipakai:
- Workbook `JLPT_Practice_Semua_Soal.xlsx`, berisi 101 ujian (N5 2 · N4 10 · N3 29 · N2 30).
- Transkrip Choukai tersedia untuk sebagian besar soal N4–N2.
- Workbook **tidak** disalin ke repo; hanya statistiknya yang disimpan.

Angka = median (rentang tengah 50%), jumlah karakter tanpa spasi/tanda baca.

### Choukai — prioritas utama

| Level · Tipe | Dialog ASLI | Dialog BANK | Rasio |
|---|---|---|---|
| N4 課題理解 | 144 (112–170) | 79 (64–92) | 55% |
| N4 ポイント理解 | 151 (101–195) | 62 (51–72) | 41% |
| N4 即時応答 (ucapan pemicu) | 20 | 12 | 60% |
| N3 課題理解 | 213 (178–258) | 92 (79–108) | 43% |
| N3 ポイント理解 | 213 (176–252) | 75 (63–84) | 35% |
| N3 概要理解 | 189 (170–218) | 87 (68–111) | 46% |
| N3 即時応答 | 24 | 12 | 50% |
| N2 課題理解 | 266 (218–312) | 114 (98–144) | 43% |
| N2 ポイント理解 | 264 (203–306) | 88 (74–106) | 33% |
| N2 概要理解 | 229 (201–257) | 117 (96–130) | 51% |
| N2 即時応答 | 26 | 18 | 69% |
| N2 統合理解 | 407 (121–485) | 148 (111–208) | 36% |
| N5 課題/ポイント | (referensi tanpa transkrip) | 73 / 54 | — |

Karakteristik lain yang terlihat:

1. **Panjang.** Dialog bank hanya **35–55%** dari panjang asli di semua level. Ini kekurangan terbesar dan paling konsisten.
2. **Giliran bicara.** N3/N2 asli: 6–9 giliran. Bank: hampir selalu 4–5.
3. **Monolog.** Soal asli memakai pengumuman, penjelasan guru, atau pidato pada 20–40% soal 課題/ポイント. Bank hampir selalu dialog dua orang (N4 課題: 4% vs 41%).
4. **Pola eliminasi mekanis.** Banyak dialog bank mengeliminasi pilihan satu per satu secara berurutan, lalu menyebut kunci secara eksplisit. Contoh: n3-full-06 ポイント — 「カメラがいいの？」「まあまあ」「安かったの？」「高め」「電池が…一番大事」. Soal asli menyebar informasi, memakai perubahan rencana, koreksi, dan informasi tersirat.
5. **Pilihan jawaban.** Pilihan bank lebih pendek: N3 ポイント 8,5 vs 12 karakter; N2 9,75 vs 14. Pilihan asli berupa frasa yang lebih spesifik.
6. **Narasi.** Pertanyaan sudah dibacakan sebelum dan sesudah cerita, sesuai format resmi.

### Dokkai

| Level | Panjang bacaan ASLI | BANK | Soal per bacaan ASLI / BANK |
|---|---|---|---|
| N5 | 158 (107–226) | 96 (57–102) | 3,4 / 1,2 |
| N4 | 270 (126–364) | 96 (68–101) | 3,0 / 1,3 |
| N3 | 360 (202–443) | 90 (78–133) | 2,8 / 1,4 |
| N2 | 432 (230–617) | 184 (115–191) | 1,8 / 1,6 |

Bacaan bank 25–40% dari panjang asli. Selain itu, bank memakai banyak bacaan pendek dengan 1 soal, sedangkan soal asli memakai lebih sedikit bacaan dengan 2–4 soal tiap bacaan (pemahaman alur, maksud penulis, こそあど).

### Bunpou & Kanji/Kotoba

- **Kalimat 文法形式の判断:** N5 21 vs 12, N4 26 vs 14, N3 37 vs 14 karakter. Kalimat bank terlalu pendek sehingga konteks yang menentukan jawaban hampir tidak ada; soal asli sering memakai dialog A/B atau kalimat dua klausa.
- **漢字読み:** panjang kalimat sudah mendekati asli (N4 14 vs 13, N3 15 vs 13, N2 18 vs 15).

### Contoh temuan manual (sampel acak)

| ID | Masalah |
|---|---|
| n5-kanji-01-q01 | Kalimat N5 memakai 何分（なにぶん）「未熟な点が多い」— jauh di atas N5; penjelasan salah ("berapa menit") |
| n5-kanji-01-q04/q07 | Pengecoh 表記 berupa kata tak ada (場い・鳥い・題きい) — terlalu mudah; soal asli memakai kanji mirip bentuk/bunyi |
| n5-kotoba-05-q01/q15 | Pengecoh beda kategori (ぜひ/金/まつり); pilihan 「埃及」 (bahasa Mandarin untuk Mesir) |
| n5-kotoba-05-q08 | 語彙の意味: pilihan dalam bahasa Indonesia — bukan format JLPT |
| n3-kotoba-09-q01 | 何時も (penulisan tidak wajar); penjelasan rusak ("lapar ぎりぎりで…") |
| n3-kotoba-09-q11 | Garis bawah hanya 「つ」 dari うそをつく; penjelasan menyebut 吐く |
| n2-full-08-q01 | Pengecoh 漢字読み bentuk mustahil (いのうって/いのっで) — soal asli memakai bacaan yang mungkin (長音, 促音, 濁音) |
| n2-full-08-q47/q70 | Penjelasan hanya 3–5 kata |

## 6. Kekurangan utama per level

| Level | Kekurangan utama |
|---|---|
| **N5** | Paket latihan Kanji/Kotoba paling bermasalah (kalimat di atas level, pengecoh mustahil/lintas kategori, 語彙の意味 berbahasa Indonesia). Choukai pendek (課題 73, ポイント 54 karakter). Bacaan pendek dengan 1 soal. |
| **N4** | Choukai ±40–55% panjang asli, hampir tanpa monolog. 67 soal Choukai sama persis dengan N5. Bacaan 96 vs 270 karakter. Kalimat bunpou terlalu pendek. |
| **N3** | Penanda terbanyak di Kanji/Kotoba latihan (329/400 kanji ditandai). Choukai ±35–46%. 318 soal dengan jawaban mencolok terpanjang. Bacaan 90 vs 360 karakter — kesenjangan Dokkai terbesar. |
| **N2** | Bahasa (bunpou/kotoba) relatif paling bersih. Choukai ±33–51% (統合理解 148 vs 407). 即時応答 11/12. 359 jawaban terpanjang (terutama Dokkai). Bacaan 184 vs 432. |

## 7. Keputusan yang dibutuhkan sebelum revisi

1. **Standar kualitas.** Setujui draf target di `RUBRIK-QC.md` §3 (panjang dialog/bacaan, jumlah giliran, porsi monolog, aturan pengecoh).
2. ✅ **DISEPAKATI (2026-11-20): file versi baru.** Paket hasil revisi disimpan sebagai file baru (`full-05.v2.json`, `kanji-05.v2.json`, …), lalu entri di `jlpt/index.json` diarahkan ke file itu. Rinciannya di §8.
3. **Referensi N5.** Workbook hanya berisi 2 ujian N5 tanpa transkrip. Target Choukai N5 sementara diekstrapolasi (±110–140 karakter). Lebih baik jika ada referensi N5 tambahan.
4. **Daftar kanji acuan level.** Pilih antara daftar situs (`data/kanji-n*.json`, yang baru di-relevel) atau daftar JLPT konvensional untuk pemeriksaan "kanji di atas level".
5. **Urutan kerja.** Usulan: pilot 1 paket (mis. N3 paket 11: Choukai + Dokkai + bahasa), tinjau bersama, lalu lanjut per level.

## 8. Mekanisme versi, backup & rollback (disiapkan, belum dijalankan)

### Paket versi baru

Kode aplikasi sudah mendukung mekanisme ini tanpa perubahan:
- Sesi ujian dan riwayat menyimpan `file` lalu memuat file itu lagi (`js/jlpt-center.js` `loadPkg(sesi.file)` / `loadPkg(h.file)`).
- Halaman guru mengambil `./jlpt/` + `h.file` (`teacher.html`).
- Tanda "sudah dikerjakan" memakai `pkgId`.

Aturan:
- `id` paket (`pkgId`, mis. `n3-full-05`) **tidak berubah**, sehingga progres dan tanda selesai siswa tetap.
- Hanya `file` di `jlpt/index.json` yang berpindah, dari `n3/full-05.json` ke `n3/full-05.v2.json`. Tambahkan juga `"versi": 2`.
- File lama **tidak dihapus**. Ujian lama, sesi yang sedang berjalan, dan pembahasan di riwayat tetap memakai file lama sehingga jawaban siswa tetap cocok.
- Di dalam file v2, `id` soal tetap sama untuk posisi yang sama. Jumlah dan urutan soal juga tetap.
- Bump `CACHE` di `sw.js` setiap rilis.
- Audit (`tools/jlpt_audit/*.mjs`) hanya membaca file yang terdaftar di `index.json`, jadi versi lama tidak terhitung sebagai duplikat.
- Choukai yang direvisi memakai audio di folder baru (mis. `audio/choukai/n3/p5v2/`), jadi MP3 lama untuk riwayat tetap ada.

⚠ **Jangan jalankan `tools/jlpt_build.py` setelah revisi dimulai.** Skrip itu menulis ulang `jlpt/index.json` dengan nama file asli, sehingga situs kembali ke paket lama. `jlpt_dedupe.py` juga memindai semua file di folder, termasuk versi lama; skrip itu perlu disesuaikan sebelum dipakai lagi. `jlpt_star_pack.py` dan `jlpt_choukai_swap.py` juga mengubah `index.json` dan perlu dicek sebelum dipakai.

### Backup & rollback

Sebelum revisi massal pertama:

1. Tag git `jlpt-pra-revisi-<tanggal>` di `main`.
2. Salinan `jlpt/`, `choukai/`, `tools/choukai-src/` ke `backup/jlpt-<tanggal>/` (pola sama dengan `backup/akses-ssw-*`).
3. Revisi dikerjakan per level di branch/PR terpisah. Jumlah, urutan, dan `id` soal per paket dipertahankan.
4. Setiap PR wajib lolos `audit.mjs` (0 kode B, tidak ada duplikat baru) sebelum merge, lalu bump cache `sw.js`.
5. Rollback per paket: kembalikan entri `file` di `jlpt/index.json` ke file lama, lalu bump cache. Riwayat siswa yang sempat memakai v2 tetap valid, karena file v2 juga tidak dihapus.

## 9. Masalah yang belum terselesaikan

- Validitas kebahasaan (kealamian, satu jawaban tepat) belum diperiksa per soal — butuh pemeriksaan manual atau tinjauan dengan rubrik.
- Pemeriksaan kanji/kosakata bergantung pada daftar level situs yang tidak standar.
- Heuristik "pengecoh disebut di audio" masih kasar (berbasis kecocokan kata). Angka referensi pada metrik ini kurang andal, karena pilihan asli sering berupa parafrase.
- Kunci jawaban referensi tidak diverifikasi ulang terhadap kunci resmi (sesuai catatan workbook).
