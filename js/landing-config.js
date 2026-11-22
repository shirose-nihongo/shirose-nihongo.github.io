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
  langganan: { url: "https://wa.me/6285173269876", teks: "Halo admin Shirose Nihongo, saya mau berlangganan. Mohon info paket dan cara pembayarannya." },


  /* MEMBERSHIP / BERLANGGANAN (halaman daftar harga dari js/membership.js).
     Harga dalam angka rupiah tanpa titik. Hapus bulanan atau lifetime kalau paket
     itu tidak punya opsi tersebut. "grup" dipakai untuk judul bagian di daftar. */
  membership: {
    jlpt: [
      { nama: "JLPT N5", grup: "Per level", bulanan: 20000, lifetime: 99999 },
      { nama: "JLPT N4", grup: "Per level", bulanan: 20000, lifetime: 99999 },
      { nama: "JLPT N3", grup: "Per level", bulanan: 30000, lifetime: 149999 },
      { nama: "JLPT N2", grup: "Per level", bulanan: 75000, lifetime: 349999 },
      { nama: "JLPT N1", grup: "Per level", bulanan: 75000, lifetime: 349999 },
      { nama: "JLPT N5 + N4", grup: "Paket bundling", bulanan: 30000, lifetime: 169999 },
      { nama: "JLPT N5 + N4 + N3", grup: "Paket bundling", bulanan: 50000, lifetime: 299999 },
      { nama: "JLPT N2 + N1", grup: "Paket bundling", bulanan: 100000, lifetime: 599999 },
      { nama: "JLPT All Level N5–N1", grup: "Paket bundling", lifetime: 799999 }
    ],
    jft: [
      { nama: "JFT-Basic Complete Access", ket: "Termasuk seluruh materi Irodori: Paket 1 (Bab 1–6), Paket 2 (Bab 7–12), Paket 3 (Bab 13–18). Ketiga paket menjadi satu membership.", bulanan: 50000, lifetime: 250000 }
    ],
    ssw: [
      { nama: "Building Cleaning", jp: "ビルクリーニング", bulanan: 50000, lifetime: 250000 },
      { nama: "Kaigo", jp: "介護", ket: "Mencakup materi Bahasa Indonesia dan Bahasa Jepang.", bulanan: 50000, lifetime: 250000 },
      { nama: "Food Manufacturing", jp: "飲食料品製造業", bulanan: 50000, lifetime: 250000 },
      { nama: "Food Service", jp: "外食業", bulanan: 50000, lifetime: 250000 },
      { nama: "Agriculture", jp: "農業", bulanan: 30000, lifetime: 150000 },
      { nama: "Construction – Sipil", jp: "建設", bulanan: 75000, lifetime: 375000 },
      { nama: "Construction – Bangunan", jp: "建設（建築）", bulanan: 75000, lifetime: 375000 },
      { nama: "Construction – Lifeline", jp: "建設（ライフライン・設備）", bulanan: 75000, lifetime: 375000 },
      { nama: "Accommodation", jp: "宿泊", bulanan: 50000, lifetime: 250000 },
      { nama: "Livestock", jp: "畜産業", bulanan: 30000, lifetime: 150000 },
      { nama: "Fishery", jp: "漁業", bulanan: 100000, lifetime: 500000 },
      { nama: "Auto Maintenance", jp: "自動車整備", bulanan: 75000, lifetime: 375000 },
      { nama: "Industrial Manufacturing – Mesin Logam", jp: "機械金属加工", bulanan: 100000, lifetime: 500000 },
      { nama: "Industrial Manufacturing – Elektronik", jp: "電気電子機器組立て", bulanan: 100000, lifetime: 500000 },
      { nama: "Industrial Manufacturing – Permukaan Logam", jp: "金属表面処理", bulanan: 100000, lifetime: 500000 },
      { nama: "Wood Industry", jp: "木材産業", bulanan: 100000, lifetime: 500000 },
      { nama: "Auto Transport", jp: "自動車運送業（トラック・バス）", bulanan: 100000, lifetime: 500000 },
      { nama: "Forestry", jp: "林業", bulanan: 100000, lifetime: 500000 },
      { nama: "Linen Supply", jp: "リネンサプライ", bulanan: 100000, lifetime: 500000 },
      { nama: "Railway – Jalur", jp: "鉄道（軌道整備）", bulanan: 100000, lifetime: 500000 },
      { nama: "Railway – Listrik", jp: "鉄道（電気設備整備）", bulanan: 100000, lifetime: 500000 },
      { nama: "Railway – Kereta", jp: "鉄道（車両製造）", bulanan: 100000, lifetime: 500000 },
      { nama: "Shipbuilding", jp: "造船・舶用工業", bulanan: 100000, lifetime: 500000 },
      { nama: "Logistics Warehouse", jp: "物流倉庫", bulanan: 100000, lifetime: 500000 },
      { nama: "Recycling", jp: "資源循環", bulanan: 100000, lifetime: 500000 },
      { nama: "Aviation – Ground Handling", jp: "空港グランドハンドリング", bulanan: 100000, lifetime: 500000 },
      { nama: "Aviation – Aircraft Maintenance", jp: "航空機整備", bulanan: 100000, lifetime: 500000 }
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
