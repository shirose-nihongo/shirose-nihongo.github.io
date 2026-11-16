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
