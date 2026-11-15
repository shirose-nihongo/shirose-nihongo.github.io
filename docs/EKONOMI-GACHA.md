# Ekonomi koin, tema & gacha — laporan + status

## Sumber & pemakaian koin (kondisi kode saat ini)
- Dompet saat ini **per level JLPT**: `siswa/{uid}/gami/{lvl}.koin`. XP → level: `floor(sqrt(xp/50))+1` (Lv10 ≈ 4.050 XP, Lv50 ≈ 120.050 XP, Lv75 ≈ 276.800 XP).
- Pemasukan: misi harian 5–20 koin (4–6 misi/hari ≈ 60 koin/hari maks), achievement level (Lv5 100, Lv10 300, Lv20 800, Lv30 1.500), hadiah lulus ujian pertama (≈2.500).
- **Dompet tunggal AKTIF** (`siswa/{uid}/wallet/main`): saldo lama tiap level dijumlah & dimigrasi sekali (tanda `migrasi[lvl]`, dokumen lama tidak dihapus). Dipakai JLPT, toko, JFT (+30 bab / +100 sim/tryout, sekali per paket saat lulus ≥60%), SSW (+15 per kuis, sekali saat pertama lulus ≥60%), Mensetsu (+20, maks 3×/hari), gacha. Log: `wallet_log`. Jika dompet gagal diakses, app kembali ke saldo per level (tidak ada koin hilang). Rules sub-koleksi yang ada sudah mencakup `wallet`/`wallet_log`. ⚠ Belum diuji di Firebase asli (diuji dengan Firestore tiruan). Hardening berikutnya: tulis wallet hanya lewat server.

## Simulasi gacha (`node tools/sim-gacha.mjs`, 200.000 tarikan)
| Rarity | Target | Hasil (dgn pity) |
|---|---|---|
| common | 45 | ~44.7 |
| uncommon | 30 | ~29.9 |
| rare | 15 | ~14.9 |
| epic | 7 | ~7.4 |
| legendary | 2.99 | ~3.04 |
| mythic | 0.01 | ~0.013 |
Pity: epic+ dijamin ≤30 tarikan, legendary+ ≤120. Rata-rata ±32.600 koin per legendary+ (harga 1.000/tarik). Semua angka di `cloudflare/gacha-core.js` (`CONFIG`) — **usulan**, ubah sebelum produksi: 1 tarik = 1.000, 10 tarik = 9.000, refund duplikat 100–20.000.

## Server gacha
- `cloudflare/gacha-core.js` — logika murni (RNG `crypto.getRandomValues`, hanya di server).
- `cloudflare/gacha-worker.js` — Worker: verifikasi ID token, potong koin + simpan pity/inventaris + log transaksi `siswa/{uid}/wallet_log` dalam satu commit Firestore (precondition updateTime → anti double-spend).
- **Belum di-deploy & belum diuji ke Firebase asli.** Butuh: secret `FIREBASE_SA` (service account), var `FIREBASE_PROJECT`, `FIREBASE_API_KEY`; Rules: klien hanya boleh *baca* `wallet/gacha` & `wallet_log`. Halaman `#gacha` sudah ada (kartu di beranda); isi `GACHA_URL` di `js/gacha.js` setelah Worker di-deploy.

## Tema (sudah di kode, `js/themes.js`)
Bawaan: **Putih Ungu** (Lv1) + Monokrom (Lv1). Tema yang masih terkunci otomatis kembali ke Putih Ungu; tema yang didapat dari gacha terbuka tanpa syarat level. Level buka: Ungu Lv10 · Cerah Lv15 · Hujan Lv20 · Salju Lv40 · Musim Panas & Badai Lv50 · Gugur & Semi Lv75. Guru/admin bebas. Gating hanya di UI (kosmetik). Pilihan tema lama siswa tetap dipakai; siswa tanpa pilihan jadi Monokrom.

## Hadiah gacha (diperbarui)
Pool = 48 barang SHOP (rarity dari katalog) + 8 tema (🎨, hanya epic/legendary → jauh lebih sulit). Barang shop masuk `karakter.inventory`, tema masuk `wallet/gacha.inv` (`theme_<id>`). Barang yang sudah dibeli dihitung duplikat (refund koin). Ubah daftar di `tools/build-gacha.mjs` lalu `node tools/build-gacha.mjs`. Deploy lewat dashboard: tempel **`cloudflare/gacha-worker.bundle.js`** (satu file, dihasilkan script itu).

## Pembaruan peluang & harga (terbaru)
Harga: ×1 = 800, ×10 = 7.200. Peluang: Common 40 · Uncommon 28 · Rare 18 · Epic 9 · Legendary 4 · Mythic 1 (%). Pity: epic+ ≤20, legendary+ ≤80. **Duplikat tidak ada pengembalian koin.** Auto spin: pilih ×1/×10 dan jumlah (3–100), berhenti sendiri jika koin kurang atau ditekan Stop; hasil diringkas di akhir. Akun moderator: gratis, peluang rendah (Epic 1.3 · Legendary 0.19 · Mythic 0.01), tanpa pity.
