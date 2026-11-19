# Standar Bacaan (Dokkai) & Format Full Exam JLPT — Shirose Nihongo

Sumber ukur: 101 paket soal JLPT asli (N5 2 · N4 10 · N3 29 · N2 30 · N1 30; hanya acuan internal guru, tidak ada isinya di repo ini).
Nilai = median per paket. "Huruf" = jumlah karakter teks bacaan.

## 1. Struktur bacaan soal asli
| Level | Soal baca | Susunan (bacaan × soal, huruf/bacaan) | Total huruf |
|---|---|---|---|
| N1 | ±24 | 短文 4×1 (±250) · 中文 3×3 (±700) · 統合 1 set 2 soal (±700) · 長文 1×3–4 (±780) · 情報検索 1×2 | ±4.800 |
| N2 | ±20 | 短文 5×1 (±250) · 中文 3×3 (±710) · 統合 1 set 2 (±560) · 長文 1×3 (±700) · 情報検索 1×2 | ±4.900 |
| N3 | 16 | 短文 4×1 (±290) · 中文 2×3 (±510) · 長文 1×4 (±650–800) · 情報検索 1×2 | ±3.500 |
| N4 | 8–9 | 短文 3×1 (±250) · 中文 1×3–5 (±495) · 情報検索 1×2 | ±1.860 |
| N5 | 6 | 短文 3×1 (±95–150) · 中文 1×2 (±305) · 情報検索 1 | ±710 |

## 2. Kondisi Shirose sebelum perbaikan (paket full 1–20)
| Level | Soal baca | Bacaan/paket | Huruf/bacaan | Total huruf | Kunci = pilihan terpanjang |
|---|---|---|---|---|---|
| N1 | 17 | 12 | 196 | 2.354 | 88% |
| N2 | 17 | 12 | 184 | 2.210 | 70% |
| N3 | 13 | 9 | 122 | 1.106 | 73% |
| N4 | 9 | 7 | 115 | 814 | 51% |
| N5 | 7 | 6 | 102 | 621 | 28% |
Soal asli: kunci adalah pilihan terpanjang hanya 16–25% (acak = 25%). Di bank lama kita murid bisa menebak dari panjang pilihan.
Bank bacaan panjang lama: 中文 hanya ±140–280 huruf (asli ±500–710); belum ada 長文 untuk N1/N2/N4/N5.

## 3. Aturan kesulitan untuk bacaan baru
- Panjang sesuai tabel 1 (target tidak boleh < 80% dari angka asli).
- 4 pilihan dengan panjang setara; kunci terpanjang paling banyak ±25% soal.
- Pengecoh masuk akal: memakai kata dari teks tetapi salah hubungan sebab-akibat, terlalu mutlak, atau membalik arah.
- Kunci berupa parafrase (bukan salinan teks). Tipe soal: 下線部の意味, 理由, 内容一致, 筆者の主張, 指示語.
- Setiap pengecoh punya alasan salah singkat (Indonesia) di pembahasan.
- Label: "latihan Shirose Nihongo" (bukan soal resmi). Perlu tinjau penutur asli.

## 4. Status
| Level | Format non-dokkai | Dokkai |
|---|---|---|
| N1 | SELESAI: `full-01..30` tanpa 表記/接頭辞 (読み6 文脈7 言い換え6 用法6 文法形式10 組み立て5 文章の文法5) | Tahap 1: 21 soal (短文4 · 中文3×3 · 統合2 · 長文4 · 情報検索2), 3.400 huruf. Bacaan baru: 中文 3, 統合 1, 長文 1 (bank `n1_p.py`, `n1_q.py`). Perlu tambahan bacaan baru agar tidak berulang antar paket |
| N2–N5 | Belum | Belum |

Kebutuhan bacaan baru (perkiraan, agar tiap paket hampir unik): N1 ±90 中文 + 30 長文 + 15 統合; N2 sama; N3 ±40 中文 + 20 長文; N4 ±20 中文; N5 ±15 中文.

## 5. Skrip
- `tools/jlpt_n1_resmi.py` — membuat `n1/full-21..30` (format resmi).
- `tools/jlpt_n1_resmi_lama.py` — menyesuaikan `n1/full-01..20` (non-dokkai) ke format resmi; ID soal dinomori ulang.
- `tools/jlpt_dokkai_std.py <lv>` — menyusun ulang dokkai ke standar bacaan (idempoten).
