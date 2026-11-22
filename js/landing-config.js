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

  /* MEMBERSHIP / BERLANGGANAN (halaman daftar harga dari js/membership.js).
     Harga dalam angka rupiah tanpa titik. Hapus bulanan atau lifetime kalau paket
     itu tidak punya opsi tersebut. "grup" dipakai untuk judul bagian di daftar. */
  membership: {
    jlpt: [
      { nama: "JLPT N5", big: "N5", warna: "#f9a8c9", wm: "日", desc: "Kosakata, kanji, bunpou, latihan, dan ujian penuh N5.", grup: "Per level", bulanan: 20000, lifetime: 99999 },
      { nama: "JLPT N4", big: "N4", warna: "#22d3ee", wm: "日", desc: "Kosakata, kanji, bunpou, latihan, dan ujian penuh N4.", grup: "Per level", bulanan: 20000, lifetime: 99999 },
      { nama: "JLPT N3", big: "N3", warna: "#ef6a9a", wm: "日", desc: "Kosakata, kanji, bunpou, latihan, dan ujian penuh N3.", grup: "Per level", bulanan: 30000, lifetime: 149999 },
      { nama: "JLPT N2", big: "N2", warna: "#f59e0b", wm: "日", desc: "Kosakata, kanji, bunpou, latihan, dan ujian penuh N2.", grup: "Per level", bulanan: 75000, lifetime: 349999 },
      { nama: "JLPT N1", big: "N1", warna: "#10b981", wm: "日", desc: "Kosakata, kanji, bunpou, latihan, dan ujian penuh N1.", grup: "Per level", bulanan: 75000, lifetime: 349999 },
      { nama: "JLPT N5 + N4", big: "N5 + N4", warna: "#f9a8c9", wm: "日", desc: "Paket gabungan level N5 + N4.", grup: "Paket bundling", bulanan: 30000, lifetime: 169999 },
      { nama: "JLPT N5 + N4 + N3", big: "N5 + N4 + N3", warna: "#f9a8c9", wm: "日", desc: "Paket gabungan level N5 + N4 + N3.", grup: "Paket bundling", bulanan: 50000, lifetime: 299999 },
      { nama: "JLPT N2 + N1", big: "N2 + N1", warna: "#f59e0b", wm: "日", desc: "Paket gabungan level N2 + N1.", grup: "Paket bundling", bulanan: 100000, lifetime: 599999 },
      { nama: "JLPT All Level N5–N1", big: "ALL", warna: "#ffd700", wm: "全", desc: "Semua level N5 sampai N1 dalam satu paket lifetime.", grup: "Paket bundling", lifetime: 799999 }
    ],
    jft: [
      { nama: "JFT-Basic Complete Access", big: "JFT", warna: "#22d3ee", wm: "試", desc: "Seluruh materi Irodori dalam satu membership.", ket: "Termasuk seluruh materi Irodori: Paket 1 (Bab 1–6), Paket 2 (Bab 7–12), Paket 3 (Bab 13–18). Ketiga paket menjadi satu membership.", bulanan: 50000, lifetime: 250000 }
    ],
    ssw: [
      { nama: "Building Cleaning + Mensetsu", tema: "building", jp: "ビルクリーニング", bulanan: 50000, lifetime: 250000 },
      { nama: "Kaigo", tema: "kaigo", jp: "介護", ket: "Mencakup materi Bahasa Indonesia dan Bahasa Jepang.", bulanan: 50000, lifetime: 250000 },
      { nama: "Food Manufacturing", tema: "factory", jp: "飲食料品製造業", bulanan: 50000, lifetime: 250000 },
      { nama: "Food Service", tema: "restaurant", jp: "外食業", bulanan: 50000, lifetime: 250000 },
      { nama: "Agriculture", tema: "farm", jp: "農業", bulanan: 30000, lifetime: 150000 },
      { nama: "Construction – Sipil", tema: "construction", jp: "建設", bulanan: 75000, lifetime: 375000 },
      { nama: "Construction – Bangunan", tema: "construction", jp: "建設（建築）", bulanan: 75000, lifetime: 375000 },
      { nama: "Construction – Lifeline", tema: "construction", jp: "建設（ライフライン・設備）", bulanan: 75000, lifetime: 375000 },
      { nama: "Accommodation", tema: "hotel", jp: "宿泊", bulanan: 50000, lifetime: 250000 },
      { nama: "Livestock", tema: "farm", jp: "畜産業", bulanan: 30000, lifetime: 150000 },
      { nama: "Fishery", tema: "fishery", jp: "漁業", bulanan: 100000, lifetime: 500000 },
      { nama: "Auto Maintenance", tema: "automobile", jp: "自動車整備", bulanan: 75000, lifetime: 375000 },
      { nama: "Industrial Manufacturing – Mesin Logam", tema: "machine", jp: "機械金属加工", bulanan: 100000, lifetime: 500000 },
      { nama: "Industrial Manufacturing – Elektronik", tema: "electronic", jp: "電気電子機器組立て", bulanan: 100000, lifetime: 500000 },
      { nama: "Industrial Manufacturing – Permukaan Logam", tema: "plating", jp: "金属表面処理", bulanan: 100000, lifetime: 500000 },
      { nama: "Wood Industry", tema: "wood", jp: "木材産業", bulanan: 100000, lifetime: 500000 },
      { nama: "Auto Transport", tema: "truck", jp: "自動車運送業（トラック・バス）", bulanan: 100000, lifetime: 500000 },
      { nama: "Forestry", tema: "forestry", jp: "林業", bulanan: 100000, lifetime: 500000 },
      { nama: "Linen Supply", tema: "linen", jp: "リネンサプライ", bulanan: 100000, lifetime: 500000 },
      { nama: "Railway – Jalur", tema: "railway", jp: "鉄道（軌道整備）", bulanan: 100000, lifetime: 500000 },
      { nama: "Railway – Listrik", tema: "railway", jp: "鉄道（電気設備整備）", bulanan: 100000, lifetime: 500000 },
      { nama: "Railway – Kereta", tema: "railway", jp: "鉄道（車両製造）", bulanan: 100000, lifetime: 500000 },
      { nama: "Shipbuilding", tema: "ship", jp: "造船・舶用工業", bulanan: 100000, lifetime: 500000 },
      { nama: "Logistics Warehouse", tema: "logistics", jp: "物流倉庫", bulanan: 100000, lifetime: 500000 },
      { nama: "Recycling", tema: "recycling", jp: "資源循環", bulanan: 100000, lifetime: 500000 },
      { nama: "Aviation – Ground Handling", tema: "aviation", jp: "空港グランドハンドリング", bulanan: 100000, lifetime: 500000 },
      { nama: "Aviation – Aircraft Maintenance", tema: "aviation", jp: "航空機整備", bulanan: 100000, lifetime: 500000 }
    ],
    catatan: {
      jlpt: [],
      jft: [],
      ssw: [
        "Setiap bidang atau subbidang dijual secara terpisah. Membeli satu subbidang tidak otomatis membuka subbidang lainnya.",
        "Kaigo mencakup materi Bahasa Indonesia dan Bahasa Jepang.",
        "Setiap pembelian SSW mendapat bonus latihan Mensetsu sesuai bidang yang dibeli.",
        "Akses Mensetsu mengikuti masa membership. Lifetime berlaku selama platform beroperasi."
      ]
    }
  },

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
