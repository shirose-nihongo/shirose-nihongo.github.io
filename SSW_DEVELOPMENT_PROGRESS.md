# SSW Development Progress

Status: `[ ]` belum · `[~]` berjalan · `[x]` selesai (terverifikasi) · `[!]` terhambat · `[R]` perlu review

## Log

### 2026-11-16
| Task | Sektor | Status | Catatan |
|---|---|:-:|---|
| Audit repo & inventaris per bidang | semua | [x] | `SSW_PROJECT_AUDIT.md`, angka dihitung dari data aktual |
| Daftar kekurangan Jidousha Seibi & Industrial | auto-maintenance, industrial-mfg, mfg-machine-metal | [x] | lihat audit |
| Source registry (`SSW_SOURCE_REGISTRY.json/.md`) | semua | [x] | 12 dokumen dari pencarian web; hanya 2 PDF JICA yang tersimpan di repo, sisanya NOT DOWNLOADED |
| Hubungkan kosakata ↔ gambar (Jidousha Seibi) | auto-maintenance | [R] | 98 kosakata punya `fig` (35 lama + 63 baru am-407..469); nomor bagian diverifikasi terhadap halaman kunci jawaban PDF JICA; `fungsi` + `hal_sumber` ditambahkan, sumber pemetaan tabel FIG di `automaint_img2.py`. Tautan gambar muncul di detail kata (`js/ssw.js`). Gambar belum dilihat satu per satu; uji klik UI belum |
| Flashcard bergambar per komponen (Jidousha Seibi) | auto-maintenance | [ ] | perlu crop tiap bagian bernomor; soal "bagian bernomor N adalah…" (117) sudah ada |
| Bab sistem kendaraan (mesin, rem, kemudi, suspensi, kelistrikan) | auto-maintenance | [ ] | perlu sumber resmi (JASPA/MLIT) |
| Perluas Industrial Manufacturing / Machine-Metal | industrial-mfg, mfg-machine-metal | [ ] | perlu modul resmi |
| QA: uji klik UI, validasi furigana & kunci | semua | [ ] | |

### Perubahan lain di repo (di luar roadmap SSW)
- 2026-11-16: layar "Hafalan selesai" mendapat bagian **Pembahasan** (benar/salah per kartu, mode pilihan ganda & matching; berlaku juga untuk hafalan SSW). File: `index.html`. Belum di-commit/push; uji klik di browser belum dijalankan. Cache service worker (`sw.js`, v271) perlu dinaikkan saat deploy.

### Berkas baru 2026-11-16
- `tools/ssw/automaint_figlink.py` (idempoten; jalankan setelah `automaint_jica_build.py` dan `automaint_img2.py`)
- Dimodifikasi: `data/ssw/auto-maintenance/vocab.json`, `js/ssw.js` (tautan gambar di kosakata), `index.html` (pembahasan hafalan), `sw.js` (cache v272)
- ID kosakata baru harus numerik berurutan karena mesin hafalan memakai angka ID sebagai kunci SRS.

## Rollback
Semua perubahan ada di git; sebelum deploy, `git diff` dan `git revert` cukup untuk membatalkan. Tidak ada data siswa/progres yang diubah.

### CHAT 1 HANDOFF (2026-11-16)

- **Teknologi:** situs statis (GitHub Pages), `index.html` + ES module `js/*.js`, Firebase (Auth, Firestore), service worker `sw.js`, Cloudflare Worker untuk AI. Alat build: Python di `tools/ssw/`.
- **Struktur:** `data/ssw/<slug>/{index,babN,vocab,quiz}.json` (+`alat.json` untuk Building Cleaning), `assets/ssw/<slug>/{jp,id,fig,pdf}`, mesin di `js/ssw-core.js` / `js/ssw.js` / `js/ssw-teacher.js`.
- **Database:** Firestore `siswa/{uid}/ssw_progres/{slug}`, SRS `ssw-<slug>`, `ssw_bidang/{slug}` (konfigurasi guru). Tidak ada perubahan skema.
- **Sektor relatif lengkap:** Building Cleaning, Construction (3 buku, kecuali praktik Tutorial 5–7), Food Service, Food Manufacturing, Accommodation, Kaigo (semuanya masih NEEDS REVIEW untuk validasi manusia).
- **Sektor kurang:** Livestock, Fishery (ujian resmi), mfg-machine-metal, industrial-mfg. **Belum ada:** Shipbuilding, Aviation, Auto Transportation, Railway, Forestry, Wood Industry.
- **PDF yang berhasil diunduh/ada di repo:** hanya `assets/ssw/auto-maintenance/pdf/jica-jidosha-seibi-no-nihongo.pdf` dan `jica-illust-shu.pdf` (dari sesi sebelumnya). Sesi ini tidak mengunduh PDF baru: shell tidak bisa menjangkau situs pemerintah.
- **Link sumber:** `SSW_SOURCE_REGISTRY.md/.json` (12 dokumen: MLIT 1号/2号, METI, MOJ, JICA).
- **Kosakata Jidousha Seibi:** 469 (406 buku JICA + 63 istilah ilustrasi am-407..469); 98 terhubung ke gambar (`fig`), semuanya punya `fungsi`, `hal_sumber`, `status_validasi`.
- **Gambar terekstrak:** 20 gambar JICA di `assets/ssw/auto-maintenance/fig/` (sudah ada dari sesi sebelumnya; sesi ini tidak mengekstrak gambar baru). Setiap gambar berisi banyak bagian bernomor; pemetaan nomor → istilah dari tabel FIG di `tools/ssw/automaint_img2.py`.
- **File dibuat:** `SSW_PROJECT_AUDIT.md`, `SSW_DEVELOPMENT_PROGRESS.md`, `SSW_SOURCE_REGISTRY.json/.md`, `tools/ssw/automaint_figlink.py`.
- **File diubah:** `data/ssw/auto-maintenance/vocab.json`, `js/ssw.js`, `index.html` (pembahasan hafalan), `sw.js` (cache v272).
- **Belum selesai:** fungsi/`hal_sumber`/`status_validasi` untuk 371 kosakata buku lain (hal. buku JICA bisa dipetakan dari PDF yang sama), bab sistem kendaraan dari sumber resmi MLIT/JASPA, crop per-komponen untuk flashcard bergambar, review ahli atas teks `fungsi` (buatan Shirose), uji klik UI (butuh login siswa), unduhan PDF resmi.
- **Instruksi untuk Chat 2:** (1) jangan buat ulang modul COMPLETE; (2) jalankan urutan `automaint_jica_build.py` → `automaint_img2.py <illust.pdf>` → `automaint_figlink.py` bila data dibangun ulang; (3) minta pengguna mengunggah PDF dari sumber di registry, lalu ekstrak; (4) crop per bagian bernomor dengan pemeriksaan visual sebelum dipakai sebagai `img` di flashcard; (5) tambah field `def`, `fungsi`, `halaman` hanya dari sumber yang terverifikasi; (6) lanjut Industrial Manufacturing.

### 2026-11-17 — unduhan PDF resmi via Chrome pengguna
- Berhasil diunduh dan disimpan ke `ssw-materials/automobile-maintenance/original-pdf/`: **SRC-001** (MLIT 1号 実施要領, 5 hal.) dan **SRC-002** (MLIT 2号 実施要領, 16 hal.), teks diekstrak ke `extracted-text/`. Isi 1号 cocok dengan spesifikasi ujian yang sudah ada di `js/ssw-core.js`.
- **Belum turun (5):** SRC-004, SRC-011, SRC-020 (moj.go.jp) dan SRC-010, SRC-012 (meti.go.jp). Fetch dari browser berhasil (HTTP 200), tetapi Chrome tidak menyimpan filenya (diduga izin "unduh otomatis" per situs menunggu persetujuan di Chrome). Cara cepat: buka URL di registry lalu simpan manual ke Downloads, atau izinkan unduhan otomatis untuk moj.go.jp dan meti.go.jp, lalu jalankan ulang.
- `tools/ssw/fetch_sources.py` disiapkan untuk mengunduh semua PDF di registry dari lingkungan yang boleh mengakses situsnya.

## 2026-11-17 — Industrial Manufacturing sources
- SRC-010 (METI ringkasan, 28 hlm) dan SRC-011 (MOJ 運用要領 別冊 工業製品製造業, 45 hlm) diunduh, teks diekstrak ke ssw-materials/industrial-manufacturing/.
- Terverifikasi (SRC-011): 1号 = lulus ujian keterampilan + JFT-Basic A2.2 / JLPT N4+; 2号 = JLPT N3+ (B1), pengalaman ≥3 tahun, penilaian 2号 + Business Career 3級/技能検定1級. Info ujian di js/ssw-core.js diperbarui; klaim ambang lulus 65%/60% dihapus untuk sektor ini karena belum terverifikasi di sumber.
- Belum diunduh: SRC-004, SRC-020 (moj.go.jp), SRC-012 (meti.go.jp) — Chrome tidak menyimpan file ke Downloads.

### 工業製品製造業 — 17 業務区分 1号 (SRC-010 hlm 5–7, per 2026-06)
1 機械金属加工 (1号+2号) · 2 電気電子機器組立て (1号+2号) · 3 金属表面処理 (1号+2号) · 4 紙器・段ボール箱製造 · 5 コンクリート製品製造 · 6 RPF製造 · 7 陶磁器製品製造 · 8 印刷・製本 · 9 紡織製品製造 · 10 縫製 · 11 電線・ケーブル製造 · 12 プレハブ住宅製品製造 · 13 家具製造 · 14 定形・不定形耐火物製造 · 15 生コンクリート製造 · 16 ゴム製品製造 · 17 かばん製造.
Hanya 区分 1–3 yang punya 2号. Di app saat ini hanya "dasar bersama" (industrial-mfg) dan 機械金属加工 (mfg-machine-metal); 電気電子機器組立て & 金属表面処理 sudah dikerjakan sesi lain (Chat2). Sisanya (4–17) = backlog; sektor baru ditandai berdasarkan sumber, soal harus dibuat dari modul resmi, bukan dikarang.
- Auto-maintenance: +38 keterangan fungsi untuk kosakata buku (rem, mesin, pendingin, transmisi, suspensi); total 136 dari 469 punya fungsi. Status: ORIGINAL LEARNING CONTENT, perlu review ahli. Sisa 333.
- Auto-maintenance: +72 fungsi lagi (interior, lampu peringatan, ruang mesin, bawah mobil, kelistrikan, kaki-kaki). Total 208/469 punya fungsi; sisa 261 (umumnya perkakas, kata kerja, istilah umum yang tidak butuh fungsi komponen).
- SRC-004 (MLIT laporan pelaksanaan ujian 2025, 10 hlm; 学科 ≥65%, 実技 ≥60% terkonfirmasi), SRC-012 (METI 2607 guideline) dan SRC-020 (MOJ 分野別運用方針案, 95 hlm) berhasil diunduh lewat klik asli di Chrome (script-download tidak disimpan Chrome). Semua 12 PDF registry kini DOWNLOADED.
- SRC-012 §6 mengonfirmasi: 製造分野特定技能1号評価試験 lulus tulis ≥65/100 & praktik ≥60/100; 2号 ≥60/100. Teks info di ssw-core.js dikembalikan dengan angka ini (bersumber). SRC-021 (halaman web) tetap tidak ada PDF.
- mfg-machine-metal: kosakata 29 → 67 (+38: nama proses/mesin dari daftar 業務 resmi SRC-010 hlm. 5 + istilah ukur & keselamatan umum). Arti = ORIGINAL LEARNING CONTENT, perlu review ahli; belum ada contoh kalimat.
- mfg-machine-metal: +25 contoh kalimat (ORIGINAL LEARNING CONTENT) untuk kosakata baru.
- mfg-machine-metal: contoh kalimat lengkap untuk semua 38 kosakata baru. Item 'putih nyaru' dibatalkan oleh user.

## 2026-11-17 — Soal dari sumber resmi
tools/ssw/quiz_official_build.py (idempotent, set ber-id gen-*): Auto Maintenance +17 soal aturan ujian (SRC-001/002/004) +208 soal fungsi komponen (21 set, bab4); Machine-Metal soal kosakata (bab1/bab2); Industrial-Mfg +10 soal aturan resmi (SRC-010/011/012). Soal fungsi/kosakata = ORIGINAL LEARNING CONTENT, perlu review ahli.

### Sumber contoh soal resmi JASPA (SRC-030..033, https://www.jaspa.or.jp/mechanic/specific-skill/)
- Contoh soal 1号 学科 (○×, furigana + istilah Inggris), 1号 実技 (二択, bergambar), 2号 学科 (4 pilihan) + kunci 2号. Disimpan sebagai bahan rujukan format/cakupan di ssw-materials/automobile-maintenance/ (hak cipta JASPA: jangan disalin mentah ke app).
- Cakupan 1号 学科: mesin, pelumasan/pendingin, kelistrikan, penerus tenaga, suspensi/kemudi/ban, rem, alat ukur, oli/gemuk, penanganan.
- Soal baru (ORIGINAL, perlu review ahli): data/ssw/auto-maintenance/quiz.json set gen-g1-1..8 (96 soal ○×) + gen-g1-praktik (16 soal 二択). Sumber data: tools/ssw/quiz_auto_gakka1_data.py; builder: tools/ssw/quiz_official_build.py.
- Portal manufaktur (sswm.go.jp/exam/materials) memblokir fetch otomatis (robots); contoh soal 機械金属加工/電気電子機器組立て 1号 & 2号 perlu diambil lewat Chrome kalau mau dipakai sebagai rujukan.

### Sumber contoh soal resmi JAIM (SRC-040..043, https://www.jaim-skill.or.jp/exam/materials/)
- Format resmi 製造分野特定技能1号 機械金属加工 (SRC-040): 80 menit, 40 soal = 学科 30 (○×, jawab A/B; lulus 20/30 = 65%) + 実技 10 (pilihan A–D; lulus 6/10 = 60%). Cakupan: K3 & rambu JIS, 4S, QC (histogram, scatter, pareto), pH/kimia, ukur (noken/mikrometer/kalibrasi), gambar teknik, permesinan, bahan (SS400), las, cat.
- sswm.go.jp tidak bisa diakses (DNS) dari komputer user & fetch otomatis diblokir robots; JAIM adalah operator ujian dan menyediakan PDF yang sama.
- Soal baru ORIGINAL: Machine-Metal tema gen-mm-1..4 + gen-mm-pilihan (4 pilihan); Industrial-Mfg gen-im-1..3 + gen-im-pilihan. Data: tools/ssw/quiz_mfg_data.py; builder tools/ssw/quiz_official_build.py. Perlu review ahli.
- Belum: contoh soal 電気電子機器組立て/金属表面処理 (SRC-041/042) sudah diunduh tapi belum dipelajari untuk soal.

### 2026-11-17 — PDF resmi JAIM/JASPA dimasukkan ke web
- JAIM (jaim-skill.or.jp/exam/materials): contoh soal 1号 untuk 17 区分 + 2号 untuk 3 区分 → assets/ssw/industrial-mfg/pdf/; panduan belajar resmi (JP, Indonesia, errata) → assets/ssw/jaim-*/pdf/.
- JASPA: 4 PDF contoh soal Auto Maintenance → assets/ssw/auto-maintenance/pdf/.
- Tombol PDF muncul di halaman tiap bidang lewat PDF_SUMBER (js/ssw.js). Versi Vietnam panduan (_vn) tidak diunduh.
- Catatan hak cipta: file milik JAIM/JASPA, disediakan gratis oleh mereka untuk belajar; sumber dicantumkan di tombol.

## Railway (鉄道・車両製造) — 2026-11-17
- Sumber resmi (JARi 日本鉄道車輌工業会, https://www.tetsushako.or.jp/specific_skills.html): 学習テキスト(初版,224 hlm), 学科 sample, 実技 sample, 試験案内, 結果 → `ssw-materials/railway/{original-pdf,extracted-text}`; 4 PDF live di `assets/ssw/railway-vehicle/pdf/`.
- Format ujian terverifikasi (試験案内): 学科 ○× 30 soal + 実技 四択 20 soal, total 80 menit, lulus ≥65/100 tiap bagian, bahasa Jepang, kertas.
- Sektor baru `railway-vehicle`: 7 bab (安全, 鉄道一般, 材料一般, 機械および器工具, 品質管理, 読図, 作業における必要事項), 125 kosakata, 94 soal latihan (77 ○× + 17 pilihan ganda) — dibuat dari teks resmi, **perlu review ahli**. Generator: `tools/ssw/railway_{content,quiz,build}.py` (idempotent).
- Belum: soal contoh 学科/実技 resmi masih berupa gambar (PDF tanpa teks) — belum dimasukkan; kategori lain 鉄道 (軌道整備, 電気設備整備, 車両整備, 運輸係員) menyusul.

## Forestry (林業) — 2026-11-17
- Sumber resmi (林業技能向上センター https://ringyou-gino.org/specific/2_index_detail.php + 林野庁): 学科 sample + kunci jawaban, 実技試験問題 2026, prosedur 実技, Q&A APD → `ssw-materials/forestry/`, PDF live `assets/ssw/forestry/pdf/`.
- Format terverifikasi: 学科 ○× 30 soal ≥65% (panduan 2026: 30 menit; sample Jul 2025: 60 menit), 実技 chainsaw 3 tugas (tiap tugas ≥40%, total ≥60%), usia ≥18, wajib 特別教育 chainsaw, biaya 20.000 yen.
- Sektor `forestry`: 5 bab, 65 kosakata, 54 soal (27 dari 30 soal contoh resmi — 3 soal bergambar dilewati — + soal buatan dari aturan 実技). Generator `tools/ssw/forestry_{content,quiz,build}.py`. Tidak ada buku belajar resmi → materi bab 4–5 hanya poin yang tertulis di kunci jawaban resmi.
