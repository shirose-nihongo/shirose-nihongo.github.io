# Sistem Evaluasi Kualitas Soal JLPT (draf — perlu disepakati)

Setiap soal hasil revisi melewati dua lapis pemeriksaan:

1. **QC otomatis** — `node tools/jlpt_audit/audit.mjs`. Syarat lolos: tidak ada kode **B**, tidak ada duplikat, dan tidak ada kode **M** kecuali disetujui dengan alasan tertulis.
2. **QC manual** — rubrik 9 butir di bawah. Soal dinyatakan **LULUS** bila semua butir wajib bernilai ✓ dan skor ≥ 16/18.

## 1. Rubrik manual (per soal)

Skor tiap butir: 0 = gagal · 1 = perlu perbaikan kecil · 2 = baik.

| # | Butir | Wajib | Pertanyaan pemeriksa |
|---|---|---|---|
| 1 | Level | ✓ | Kosakata, kanji, dan pola tata bahasa sesuai level (tidak ada unsur ≥ 1 level di atasnya, kecuali yang memang diuji)? |
| 2 | Kealamian | ✓ | Apakah penutur asli akan mengatakan atau menulis kalimat ini dalam situasi tersebut? |
| 3 | Kejelasan | | Pertanyaan dan instruksi tidak ambigu; format sesuai mondai resmi? |
| 4 | Satu jawaban | ✓ | Hanya satu pilihan yang benar; pengecoh salah secara pasti, bukan "kurang bagus"? |
| 5 | Pengecoh | ✓ | Pengecoh satu kategori dengan jawaban dan masuk akal bagi peserta yang belum paham? (lihat §2) |
| 6 | Kesulitan | | Sebanding dengan referensi asli (panjang, kepadatan informasi, kebutuhan inferensi)? |
| 7 | Orisinal | ✓ | Bukan salinan soal asli; tidak duplikat dengan soal lain di bank (cek audit)? |
| 8 | Penjelasan | ✓ | Kunci benar; terjemahan akurat; tiap pengecoh dijelaskan mengapa salah? |
| 9 | Tampilan | | Tampil benar di website (garis bawah, ★, furigana, audio, gambar)? |

## 2. Aturan pengecoh per tipe

| Tipe | Pengecoh yang baik | Dilarang |
|---|---|---|
| 漢字読み | Bacaan yang mungkin: salah panjang/pendek vokal, ada/tanpa っ, 清音/濁音, on/kun tertukar | Bentuk mustahil (いのっで), campuran katakana |
| 表記 | Kanji mirip bentuk (待/持) atau bunyi (会/合), okurigana keliru | Kombinasi tak bermakna (場い, 題きい) |
| 文脈規定 / 言い換え | Kata satu kelas (semua kata kerja, semua keadaan) yang benar secara tata bahasa tapi salah makna | Campuran kelas kata, kata asing non-Jepang, pilihan berbahasa Indonesia |
| 用法 | 3 kalimat yang tampak wajar tetapi memakai kata dengan arti/kolokasi lain | Kalimat yang jelas rusak tata bahasanya |
| 文法形式 | Pola dengan fungsi berdekatan (のに/ので/のは), bentuk sambung yang mirip | Pola dari level jauh berbeda, jawaban satu-satunya yang gramatikal |
| Dokkai | Parafrase yang menyebut kata dari teks tapi salah hubungan sebab/waktu/pelaku | Pilihan yang tidak berkaitan dengan teks; jawaban benar terpanjang |
| Choukai 課題/ポイント | **Semua pilihan disebut atau tersirat di audio**; pengecoh = rencana yang dibatalkan, tugas yang sudah selesai, alasan yang disangkal | Pengecoh yang tidak muncul sama sekali; kunci diucapkan persis sementara pengecoh tidak |
| 発話表現 / 即時応答 | Respons yang wajar untuk situasi lain, salah arah keigo (あげる/くれる), salah salah-paham intonasi | Respons yang jelas tidak nyambung |

## 3. Draf target kuantitatif (dari soal JLPT asli)

Angka = jumlah karakter tanpa spasi/tanda baca. Toleransi: **rentang tengah 50%** referensi. Lihat `benchmark.json`.

### Choukai

| Level | 課題理解 | ポイント理解 | 概要理解 | 統合理解 | 即時応答 (pemicu) | Giliran (dialog) | Porsi monolog 課題/ポイント |
|---|---|---|---|---|---|---|---|
| N5* | 110–140 | 100–130 | — | — | 8–15 | 4–6 | ±10% |
| N4 | 110–170 | 100–195 | — | — | 18–25 | 4–8 | 25–40% |
| N3 | 180–260 | 175–250 | 170–220 | — | 19–28 | 6–9 | 20–30% |
| N2 | 220–310 | 200–305 | 200–255 | 1: 120–200 · 2/3: 400–500 | 21–31 | 6–9 | 15–30% |

\*N5: diekstrapolasi (referensi tanpa transkrip) — perlu konfirmasi.

Aturan isi Choukai:
- Informasi kunci tidak dinyatakan langsung di akhir. Gunakan perubahan rencana, koreksi, syarat, atau urutan "まず/その前に".
- Setidaknya 2 pengecoh harus muncul di audio.
- Variasi situasi: kantor, sekolah, toko, telepon, pengumuman, radio, rapat. Variasi pertanyaan: jangan > 25% soal dalam satu level memakai 「このあと（まず）何をしますか」.
- Pertanyaan dibacakan sebelum dan sesudah cerita (課題/ポイント). Untuk 概要/統合, pilihan dibacakan di akhir dan tidak dicetak.
- Konsistensi audio = naskah = pilihan = kunci = penjelasan diperiksa otomatis (`OPSI_AUDIO_BEDA`, `AUDIO_HILANG`).

### Dokkai

| Level | 短文 | 中文 | 長文 / 主張 | 情報検索 | Soal per bacaan |
|---|---|---|---|---|---|
| N5 | 100–160 | 200–260 | — | tabel/brosur | 1 (短文), 2 (中文) |
| N4 | 120–200 | 300–400 | — | tabel/brosur | 1 / 3 |
| N3 | 150–230 | 350–450 | 550–700 | 1 halaman info | 1 / 2 / 4 |
| N2 | 200–250 | 450–550 | 統合 2×250; 主張 800–950 | 1 halaman info | 1 / 2–3 / 3 |

### Bunpou

- 文法形式: panjang kalimat N5 16–27, N4 21–38, N3 27–47 karakter. Gunakan dialog A/B atau kalimat dua klausa supaya konteks menentukan jawaban.

### Komposisi Full Exam (format resmi)

Choukai:

| Level | 課題 | ポイント | 概要 | 発話 | 即時 | 統合 |
|---|---|---|---|---|---|---|
| N5 | 7 | 6 | — | 5 | 6 | — |
| N4 | 8 | 7 | — | 5 | 8 | — |
| N3 | 6 | 6 | 3 | 4 | 9 | — |
| N2 | 5 | 6 | 5 | — | 12 | 4 |

N2 saat ini 即時応答 11/12 di 20 paket.

## 4. Status per paket

Status ditulis di kolom `status_revisi` di `STATUS.csv`:

`BELUM` → `AUDIT-MANUAL` → `DIREVISI` → `QC-LULUS` → `LIVE`

Setelah tiap gelombang revisi, jalankan ulang `audit.mjs` lalu `status.mjs`. Angka ditandai/bersih diperbarui, sedangkan isian status manual tetap dipertahankan.
