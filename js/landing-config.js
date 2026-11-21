/* Konfigurasi landing page Shirose Nihongo (landing.html).
 * Edit file ini saja — tidak perlu menyentuh landing.html.
 */
window.LANDING_CONFIG = {
  /* Grup WhatsApp untuk klaim akun demo 7 hari. Isi link undangan asli,
     contoh: "https://chat.whatsapp.com/XXXXXXXX" atau "https://wa.me/62812xxxxxxx".
     Kosong = semua tombol Join tampil nonaktif "Link grup segera dibuka". */
  whatsapp: { url: "https://chat.whatsapp.com/BzXsGV00RumLlFs1rnpABT" },

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
