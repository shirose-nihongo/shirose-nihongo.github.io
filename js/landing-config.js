/* Konfigurasi landing page Shirose Nihongo (landing.html).
 * Edit file ini saja — tidak perlu menyentuh landing.html.
 */
window.LANDING_CONFIG = {
  /* Grup WhatsApp untuk klaim akun demo 7 hari. Isi link undangan asli,
     contoh: "https://chat.whatsapp.com/XXXXXXXX" atau "https://wa.me/62812xxxxxxx".
     Kosong = semua tombol Join tampil nonaktif "Link grup segera dibuka". */
  whatsapp: { url: "https://chat.whatsapp.com/BzXsGV00RumLlFs1rnpABT" },

  /* Berlangganan lewat WhatsApp (chat pribadi admin). Isi link wa.me, contoh:
     "https://wa.me/62812xxxxxxxx". Kosong = tombol berlangganan memakai link grup di atas. */
  langganan: { url: "https://wa.me/6285173269876", teks: "Halo admin Shirose Nihongo, saya mau tanya harga paket berlangganan. Mohon info pilihan paket dan cara pembayarannya." },

  /* Pilihan paket yang tampil di popup akun demo (js/demo.js). Tiap tombol membuka chat pribadi admin
     dengan pesan sesuai paket yang dipencet. Tambah/ubah/hapus baris sesuai paket yang dijual. */
  paket: [
    { id: "bulanan",  label: "📅 Paket Bulanan",  teks: "Halo admin Shirose Nihongo, saya mau membeli Paket BULANAN. Mohon info harga dan cara pembayarannya." },
    { id: "lifetime", label: "♾️ Paket Lifetime", teks: "Halo admin Shirose Nihongo, saya mau membeli Paket LIFETIME. Mohon info harga dan cara pembayarannya." }
  ],

  /* Isi URL asli akun kamu. Kosong ("") = tombol tampil nonaktif "Segera hadir".
     Contoh: instagram: "https://instagram.com/akunkamu" */
  social: [
    { id: "instagram", label: "Instagram", url: "" },
    { id: "tiktok",    label: "TikTok",    url: "" },
    { id: "youtube",   label: "YouTube",   url: "" }   // opsional; hapus baris jika tidak dipakai
  ],

  /* Pembaruan platform. Array kosong = section "What's New" disembunyikan.
     Tambah entri baru DI ATAS. kategori: "Fitur baru" | "Materi baru" |
     "Pembaruan sistem" | "Perbaikan" | "Program baru".
     tanggal diisi hanya jika benar (format "2026-11-14"), boleh dikosongkan. */
  updates: [
    // { kategori: "Fitur baru", judul: "Judul pembaruan", isi: "Penjelasan singkat.", tanggal: "" }
  ]
};
