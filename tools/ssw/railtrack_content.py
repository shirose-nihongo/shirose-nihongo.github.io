# -*- coding: utf-8 -*-
"""Konten Railway 軌道整備 — dari 受験案内 (日本鉄道施設協会, 2025-02-10), 試験実施要領 (MLIT/MOJ, 2025-02), MLIT 業務区分.
Soal sample resmi berlabel 禁転載 → TIDAK disalin; materi & soal = ringkasan/orisinal Shirose (perlu review ahli)."""
BABS = [
 dict(no=1, id_="Gambaran Bidang & Ujian 軌道整備", jp="分野と試験の概要", pages=[1, 2],
  intro="Pekerjaan 軌道整備, penyelenggara, format ujian, biaya dan pendaftaran (sumber: 受験案内 JRCEA & 実施要領 MLIT).",
  subs=[("Pekerjaan dan penyelenggara", "業務区分と実施機関", [1, 1], [
    ("Pekerjaan 軌道整備", ["Pekerjaan **baru, perbaikan, dan pemeliharaan lintas (軌道)** beserta **pemeriksaan**. Contoh: **軌道検測作業** (ukur kelainan **高低・通り**), **レール交換作業**, **まくらぎ交換作業**, **バラストを取り扱う作業**, **保安設備を取り扱う作業** (mis. pasang/lepas **脱線防止ガード**).",
        "Pelaksana ujian: **一般社団法人 日本鉄道施設協会**; kementerian pengawas: **国土交通省 鉄道局**. Jalur lain: lulus **技能実習2号 (軌道保守整備)** dengan baik = **bebas ujian keterampilan** ini."]),
    ("Syarat peserta", ["Usia **17 tahun ke atas** pada hari ujian. Di Jepang: harus punya **在留資格**.",
        "Bahasa: **JFT-Basic** atau **JLPT N4 ke atas**. Lulus tidak menjamin status/visa diberikan."]),
  ]),
  ("Format ujian", "試験内容と合格基準", [1, 2], [
    ("Struktur", ["Bahasa Jepang (**ルビ** bila perlu), **paper test**. Waktu **80 menit total** (学科 + 実技).",
        "**学科: 30 soal** (**○×** atau **pilihan 3**) tentang **軌道の新設・改良・修繕・検査** dan **安全衛生**. **実技: 20 soal** (pilihan 2/3/4) berupa **判断等試験** dengan gambar/ilustrasi situasi kerja.",
        "**Lulus**: **≥ 65%** di **学科 dan 実技 masing-masing**. Level ujian ≈ pekerja pengalaman ±2 tahun lulus sekitar 70%. Sertifikat berlaku **10 tahun**; hasil sekitar **2 minggu**."]),
    ("Biaya & alur", ["Biaya **8.000 yen (termasuk pajak)**, biaya transfer ditanggung peserta. Alur: kirim **formulir + foto + salinan 在留カード/paspor** (e-mail) → konfirmasi → **bayar** → **受験票** (dikirim mulai 2 minggu sebelum ujian) → ujian → hasil lewat e-mail.",
        "Foto: **JPEG, latar polos, menghadap depan, 4×3 cm, ≤ 6 bulan**. Bawa: **受験票 cetak**, **ID** (sama dengan formulir), **pensil & penghapus**. HP/jam pintar **dilarang** di ruang ujian; soal tidak boleh dibawa pulang."]),
  ])]),
 dict(no=2, id_="Struktur Lintas (軌道構造)", jp="軌道の構造", pages=[1, 1],
  intro="Komponen lintas dan istilah dasar yang sering muncul di 学科 (ringkasan Shirose, perlu review ahli).",
  subs=[("Komponen lintas", "軌道の構成", [1, 1], [
    ("Komponen utama", ["**レール** (rel) menopang & menuntun roda; **まくらぎ** (bantalan/sleeper) menjaga jarak rel dan meneruskan beban; **道床バラスト** (batu pecah) meredam & meneruskan beban ke tanah dasar; **締結装置** mengikat rel ke bantalan; **犬くぎ** sebagai pengikat tradisional; **タイプレート** (tie plate) alas rel di atas bantalan; **継目板** menyambung rel.",
        "Rel + bantalan + pengikat membentuk **軌きょう**. **橋梁** = konstruksi yang melintasi sungai/jurang. **踏切** = perlintasan sebidang."]),
    ("Ukuran lintas", ["**軌間 (gauge)** = jarak antara dua rel. Lintas konvensional JR umumnya **1.067 mm**; **shinkansen/standar 1.435 mm**.",
        "**Bukan** 'jarak antara pusat jalur' — itu **線間距離 (track center spacing)**.",
        "**Batu balas (バラスト)** harus **keras, bersudut, dan kuat** (bukan bahan mudah hancur)."]),
  ]),
  ("Kelainan lintas", "軌道狂い", [1, 1], [
    ("Jenis kelainan (軌道変位)", ["**軌間狂い**, **水準狂い** (beda tinggi kiri-kanan), **高低狂い** (naik-turun sepanjang rel), **通り狂い** (lurus-belok menyamping), **平面性狂い** (puntiran).",
        "Kelainan lintas diukur dengan **軌道検測** dan diperbaiki dengan **つき固め (tamping)** dan **通り整正**; **ukur sebelum dan sesudah** kerja untuk memastikan hasilnya."]),
  ])]),
 dict(no=3, id_="Pekerjaan Utama", jp="主な作業", pages=[1, 1],
  intro="Alur dan kehati-hatian pekerjaan: ukur, ganti rel, ganti bantalan, balas, perangkat pengaman.",
  subs=[("Jenis pekerjaan", "軌道整備の作業", [1, 1], [
    ("Pengukuran", ["**軌道検測**: ukur **高低** dan **通り**. Pastikan **alat ukur diperiksa lebih dulu** dan **dirawat bersih** setelah dipakai."]),
    ("レール交換・まくらぎ交換", ["Ganti rel lama-baru; pekerjaan pendukung seperti **mengangkat (吊り上げ) rel** — patuhi komando dan jaga jarak dari beban. Ganti bantalan; pendukung: **menggali balas (道床掘削)**."]),
    ("バラスト作業", ["**Menggali & mengisi kembali balas**, **membentuk penampang balas (道床形状)**, serta pekerjaan **つき固め** dan **通り整正**."]),
    ("保安設備", ["**脱線防止ガード** dsb.: pasang/ganti/lepas/pulihkan. Pendukung: **kendur & kencangkan pengikat (締結装置)**."]),
  ])]),
 dict(no=4, id_="Keselamatan di Jalur (安全衛生)", jp="線路内作業の安全", pages=[1, 1],
  intro="Prinsip keselamatan kerja di lintas (ringkasan Shirose, perlu review ahli).",
  subs=[("Keselamatan dan pelaporan", "線路内作業の安全", [1, 1], [
    ("Prinsip", ["Sebelum kerja: **rapat pagi (ミーティング)**, **periksa alat**, pahami **jadwal kereta dan area kerja**. Patuhi **penjaga (見張員)** dan sinyal.",
        "**Lapor segera** semua kelainan — meskipun kecil (mis. **kebocoran oli kecil** tetap dilaporkan). **Alat kotor dibersihkan** setelah dipakai.",
        "Bila melihat **orang berjalan di lintas** di luar perlintasan: **hentikan kereta** sesuai prosedur (misal dengan **sinyal berhenti/pemberitahuan ke petugas**) — jangan abaikan.",
        "Pakai **APD**: helm, sepatu pengaman, rompi reflektif, sarung tangan. **Jangan lari/lompat** di lintas; hati-hati **batu balas licin**."]),
  ])]),
]
V = """軌道|きどう|lintas/track|1
軌道整備|きどうせいび|pemeliharaan lintas|1
日本鉄道施設協会|にほんてつどうしせつきょうかい|Japan Railway Civil Engineering Association (JRCEA)|1
国土交通省|こくどこうつうしょう|Kementerian Pertanahan, Infrastruktur, Transportasi & Pariwisata (MLIT)|1
鉄道分野|てつどうぶんや|bidang perkeretaapian|1
評価試験|ひょうかしけん|ujian penilaian|1
判断等試験|はんだんとうしけん|ujian penilaian keputusan (situasi bergambar)|1
受験票|じゅけんひょう|kartu peserta ujian|1
在留カード|ざいりゅうかーど|kartu izin tinggal|1
合格証明書|ごうかくしょうめいしょ|sertifikat kelulusan|1
レール|れーる|rel|2
まくらぎ|まくらぎ|bantalan (sleeper)|2
道床|どうしょう|lapisan balas (ballast bed)|2
バラスト|ばらすと|batu balas|2
締結装置|ていけつそうち|perangkat pengikat rel|2
犬くぎ|いぬくぎ|paku rel|2
タイプレート|たいぷれーと|tie plate|2
継目|つぎめ|sambungan rel|2
継目板|つぎめいた|fishplate|2
軌きょう|ききょう|rangka lintas (rel + bantalan)|2
軌間|きかん|lebar sepur (gauge)|2
線間距離|せんかんきょり|jarak antar jalur|2
橋梁|きょうりょう|jembatan|2
踏切|ふみきり|perlintasan sebidang|2
分岐器|ぶんきき|wesel/turnout|2
軌道変位|きどうへんい|kelainan geometri lintas|2
軌道狂い|きどうくるい|kelainan lintas|2
高低|こうてい|naik-turun (longitudinal level)|2
通り|とおり|kelurusan/alignment|2
水準|すいじゅん|beda tinggi rel kiri-kanan (cross level)|2
平面性|へいめんせい|puntiran (twist)|2
軌道検測|きどうけんそく|pengukuran lintas|3
つき固め|つきかため|tamping (pemadatan balas)|3
通り整正|とおりせいせい|perbaikan alignment|3
レール交換|れーるこうかん|penggantian rel|3
まくらぎ交換|まくらぎこうかん|penggantian bantalan|3
道床掘削|どうしょうくっさく|penggalian balas|3
脱線防止ガード|だっせんぼうしがーど|guard rail anti-anjlok|3
吊り上げ|つりあげ|pengangkatan|3
見張員|みはりいん|penjaga/pengawas jalur|4
線路内|せんろない|di dalam lintas|4
触車|しょくしゃ|tertabrak kereta|4
ミーティング|みーてぃんぐ|rapat/briefing|4
点検|てんけん|inspeksi/pemeriksaan|4
報告|ほうこく|pelaporan|4
停止|ていし|berhenti|4
保護具|ほごぐ|APD|4""".split("\n")
