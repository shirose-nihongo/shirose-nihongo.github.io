# SSW QA Report

Tanggal: 2026-11-17. Pengujian nyata memakai Playwright (Chromium) terhadap aplikasi lokal, viewport **mobile 390×780 (sentuh)** dan **desktop 1280×800**. Backend Firebase **dipalsukan** (stub) dengan penyimpanan persisten di localStorage agar simpan–muat–refresh bisa diuji; ini bukan uji ke Firestore asli.

Skrip: `tools/ssw/qa/ssw_qa.py` (jalankan dengan server statis di port 8765).

## Ringkasan per bidang

| Bidang | Uji | Lulus | Gagal |
|---|---:|---:|---:|
| auto-maintenance | 66 | 66 | 0 |
| auto-transport | 56 | 56 | 0 |
| building-cleaning | 50 | 50 | 0 |
| construction-bangunan | 50 | 50 | 0 |
| construction-lifeline | 50 | 50 | 0 |
| construction | 50 | 50 | 0 |
| industrial-mfg | 66 | 66 | 0 |
| mfg-machine-metal | 66 | 66 | 0 |
| wood-industry | 56 | 56 | 0 |
| **Total** | 510 | 510 | 0 |

## Daftar pengujian (hasil pada bidang pertama, mobile)

- ✅ hub: pulau tampil
- ✅ peta bab terbuka
- ✅ halaman bab
- ✅ baca subbab (judul+isi)
- ✅ tanpa overflow horizontal (baca)
- ✅ daftar kosakata
- ✅ hub hafalan + filter status
- ✅ hitung kosakata unik terpilih
- ✅ flashcard mulai
- ✅ flashcard balik (belakang tampil)
- ✅ flashcard next (Ingat)
- ✅ flashcard Lupa
- ✅ flashcard previous (Kembali)
- ✅ progres SRS tersimpan ke backend
- ✅ progres terbaca setelah refresh (Baru<total)
- ✅ mode multiple
- ✅ mode matching
- ✅ mode Arti→Jepang
- ✅ daftar kuis + label buatan Shirose
- ✅ kuis: jawaban tak terlihat sebelum dijawab
- ✅ kuis: umpan balik + penjelasan
- ✅ kuis: halaman skor
- ✅ kuis: ulangi soal yang salah
- ✅ skor kuis tersimpan ke backend
- ✅ diagram mesin: tap bagian -> info
- ✅ diagram mesin: tanpa overflow
- ✅ diagram pendingin: tap bagian -> info
- ✅ diagram pendingin: tanpa overflow
- ✅ diagram perkakas: tap bagian -> info
- ✅ diagram perkakas: tanpa overflow
- ✅ panel flashcard gambar
- ✅ flashcard gambar: gambar muncul di depan
- ✅ tanpa error JS selama sesi

## Kegagalan

Tidak ada kegagalan pada putaran terakhir.

## Yang tidak bisa diuji dari sandbox (jujur)
- Firestore, Auth, dan aturan keamanan asli (jaringan eksternal diblokir). Persistensi diuji terhadap backend palsu yang menyimpan di localStorage.
- Perangkat fisik Android/iPhone; hanya emulasi viewport + sentuh di Chromium. Safari/iOS belum diuji.
- Dashboard guru (`teacher.html`) hanya diperiksa impornya (versi modul diselaraskan), belum diuji klik.
- Build/lint/type-check: proyek ini statis (tanpa build). Pengganti: `node --check` seluruh modul JS yang diubah dan validasi JSON.

## Bug yang ditemukan dan diperbaiki selama QA
- Kartu hafalan pada tema **Putih**: latar kartu gelap + teks hitam, tidak terbaca → kartu dibuat terang untuk tema Putih (`css/themes.css`).
- Gambar diagram (SVG tanpa ukuran bawaan) tampil hanya titik kecil di flashcard → SVG diberi `width`/`height` + CSS ukuran.
- `loadBidang` bisa melempar error jika Firestore mengembalikan `null` → dijaga `(remote || [])`.
- Tidak ada opsi mengulang hanya soal yang salah → ditambahkan tombol "Ulangi soal yang salah".
- Tidak ada pembeda soal resmi vs buatan sendiri → label "Latihan buatan Shirose" / "Soal resmi" pada daftar dan halaman kuis.
