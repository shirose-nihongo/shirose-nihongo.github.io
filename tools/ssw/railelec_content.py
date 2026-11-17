# -*- coding: utf-8 -*-
"""Konten Railway 電気設備整備 — dari 受験案内 (鉄道電業安全協会, 2026), 試験実施要領 (MLIT/MOJ 2025-02), MLIT 業務区分.
Sample resmi berlabel 禁転載 → tidak disalin; materi & soal = ringkasan/orisinal Shirose (perlu review ahli)."""
BABS = [
 dict(no=1, id_="Gambaran Bidang & Ujian 電気設備整備", jp="分野と試験の概要", pages=[1, 2],
  intro="Pekerjaan, penyelenggara, format ujian, jadwal, biaya dan alur pendaftaran (sumber: 受験案内 鉄道電業安全協会 & 実施要領 MLIT).",
  subs=[("Pekerjaan dan penyelenggara", "業務区分と実施機関", [1, 1], [
    ("Pekerjaan 電気設備整備", ["Pekerjaan **baru, perbaikan, pemeliharaan** peralatan listrik kereta beserta **pemeriksaan**: **電路設備** (kawat kontak 電車線, saluran transmisi 送電線, distribusi 配電線), **変電所等設備**, **電気機器等設備**, **信号保安設備**, **保安通信設備**, **踏切保安設備** (termasuk penyangga, kabel, saluran, kabel instalasi).",
        "Penyelenggara ujian: **一般社団法人 鉄道電業安全協会**; kementerian: **国土交通省 鉄道局**."]),
    ("Syarat peserta", ["Usia **17 tahun ke atas**. Di Jepang: harus punya **在留資格**. Syarat bahasa **JFT-Basic / JLPT N4 ke atas** dibutuhkan untuk **permohonan COE**, bukan untuk ikut ujian.",
        "Lulus tidak menjamin status/visa. Sertifikat berlaku **10 tahun** dan diterbitkan **lewat perusahaan pemberi kerja**."]),
  ]),
  ("Format ujian, jadwal, biaya", "試験内容・日程・受験料", [1, 2], [
    ("Format", ["Bahasa Jepang, **paper test**, total **80 menit** (学科 + 実技).",
        "**学科: 30 soal** (○× / pilihan 3-4) tentang pengetahuan umum listrik perkeretaapian. **実技: 20 soal** berupa **situasi bergambar**, pilih tindakan yang benar. **Lulus ≥ 65% di tiap bagian**. Soal tidak boleh dibawa pulang."]),
    ("Jadwal 2026 (contoh)", ["**Fukuoka: 16 Des 2026**, **Osaka: 15 Jan 2027**, **Tokyo: 15 Mar 2027**. Pendaftaran sekitar **2 bulan sebelum** ujian."]),
    ("Biaya & alur", ["**Anggota (perusahaan anggota): ¥8.800**; **non-anggota: ¥13.200** (termasuk pajak), transfer ditanggung peserta.",
        "Alur: **formulir registrasi** (e-mail) → **受付通知** (nomor registrasi, batas bayar) → **formulir permohonan + foto (4×3 cm, JPG/PNG, <1 MB)** → **bayar** → **受験票**. Hasil lewat e-mail **≤ 2 minggu**.",
        "Bawa: **受験票**, **ID (kartu/paspor sama dengan formulir)**, **pensil & penghapus**. Datang **≥ 30 menit** sebelum mulai; HP & jam pintar disimpan di tas."]),
  ])]),
 dict(no=2, id_="Dasar Kelistrikan", jp="電気の基礎", pages=[1, 1],
  intro="Dasar listrik yang dibutuhkan untuk 学科 (ringkasan Shirose, perlu review ahli).",
  subs=[("Hukum dan perhitungan", "電気の基礎知識", [1, 1], [
    ("Besaran", ["**電圧 (V)**, **電流 (A)**, **抵抗 (Ω)**, **電力 (W)**. **Hukum Ohm**: **V = I × R**. **電力 P = V × I**.",
        "**Resistansi kabel logam**: **R = ρ × L / A** (ρ = resistivitas, L = panjang, A = luas penampang). **Makin panjang → R makin besar; makin besar penampang → R makin kecil**."]),
    ("Isolasi dan pentanahan", ["**絶縁** mencegah arus bocor; **接地 (grounding)** melindungi manusia & alat bila terjadi kebocoran. **Arus listrik berbahaya**: kontak badan dengan bagian bertegangan dapat fatal.",
        "**AC** (arus bolak-balik) dan **DC** (searah) dipakai di kereta (mis. **DC 1.500 V** di banyak jalur JR; **AC 20 kV/25 kV** untuk shinkansen/ jalur tertentu) — tegangan tinggi berbahaya."]),
  ])]),
 dict(no=3, id_="Peralatan Listrik Kereta", jp="鉄道電気設備", pages=[1, 2],
  intro="Jenis peralatan yang menjadi objek pekerjaan (berdasarkan daftar resmi MLIT).",
  subs=[("Daftar peralatan resmi", "対象設備", [1, 2], [
    ("電路設備・変電所", ["**電路設備**: **電車線** (kawat kontak), **送電線**, **配電線**. **変電所等設備**: **遮断装置**, **変圧器**, **整流器**, **避雷器**, **保護装置**, **接地装置**, **消火設備**."]),
    ("電気機器・信号・通信・踏切", ["**電気機器等設備**: **配電盤**, **開閉器**, **電源装置**, **照明設備**, **電気掲示器**, **電気融雪器**.",
        "**信号保安設備**: **信号装置**, **転てつ装置** (penggerak wesel), **連動装置** (interlocking), **列車検知装置**, **自動列車停止装置 (ATS)**.",
        "**保安通信設備**: **交換装置**, **搬送装置**, **無線装置**, **端末装置**, **通信線**. **踏切保安設備**: **踏切遮断機**, **踏切警報機**, **警報時間制御装置**, **踏切支障報知装置**, **障害物検知装置**."]),
  ])]),
 dict(no=4, id_="Keselamatan Kerja Listrik", jp="安全作業", pages=[1, 1],
  intro="Prinsip keselamatan kerja listrik & ketinggian (ringkasan Shirose, perlu review ahli).",
  subs=[("Prinsip keselamatan", "電気作業の安全", [1, 1], [
    ("Listrik", ["Sebelum kerja: **pastikan tegangan padam (無電圧確認)**, **pentanahan pengaman**, **tanda/kunci larangan operasi**. Jangan sentuh bagian bertegangan.",
        "Pakai **電気作業用ゴム長靴/絶縁靴**, **絶縁手袋**, **ヘルメット**. **Alat uji** diperiksa dahulu."]),
    ("Ketinggian & lintas", ["Kerja di ketinggian: **墜落制止用器具 (full harness)** dikaitkan pada titik kuat. Jangan menjatuhkan alat; area bawah ditutup.",
        "Di **lintas/stasiun**: ikuti **見張員** dan jadwal kereta; **laporkan kelainan segera**; patuhi **メーカー/manual**."]),
  ])]),
 dict(no=5, id_="Sinyal & Pengaman (信号・保安)", jp="信号・保安設備の基礎", pages=[1, 1],
  intro="Fungsi dasar sinyal, wesel, interlocking, dan perlintasan (ringkasan Shirose, perlu review ahli).",
  subs=[("Fungsi dasar", "信号保安設備の役割", [1, 1], [
    ("Fungsi", ["**信号装置** memberi tahu masinis batas kecepatan/berhenti. **転てつ装置** menggerakkan **wesel**. **連動装置** menghubungkan sinyal & wesel agar **tidak terbentuk rute berbahaya**.",
        "**列車検知装置 (軌道回路)** mendeteksi ada tidaknya kereta di blok. **ATS** menghentikan kereta otomatis bila melewati sinyal berhenti.",
        "**踏切**: **警報機** berbunyi/menyala, **遮断機** turun saat kereta mendekat; **障害物検知** mendeteksi kendaraan terjebak."]),
  ])]),
]
V = """鉄道電業安全協会|てつどうでんぎょうあんぜんきょうかい|Railway Electrical Industry Safety Association|1
電気設備整備|でんきせつびせいび|pemeliharaan peralatan listrik kereta|1
評価試験|ひょうかしけん|ujian penilaian|1
受験票|じゅけんひょう|kartu peserta ujian|1
受付通知|うけつけつうち|pemberitahuan penerimaan|1
合格証明書|ごうかくしょうめいしょ|sertifikat kelulusan|1
電圧|でんあつ|tegangan|2
電流|でんりゅう|arus listrik|2
抵抗|ていこう|hambatan/resistansi|2
電力|でんりょく|daya listrik|2
オームの法則|おーむのほうそく|hukum Ohm|2
抵抗率|ていこうりつ|resistivitas|2
断面積|だんめんせき|luas penampang|2
絶縁|ぜつえん|isolasi|2
接地|せっち|pentanahan (grounding)|2
直流|ちょくりゅう|arus searah (DC)|2
交流|こうりゅう|arus bolak-balik (AC)|2
電路設備|でんろせつび|fasilitas jalur listrik|3
電車線|でんしゃせん|kawat kontak/catenary|3
送電線|そうでんせん|saluran transmisi|3
配電線|はいでんせん|saluran distribusi|3
変電所|へんでんしょ|gardu induk|3
遮断装置|しゃだんそうち|alat pemutus|3
変圧器|へんあつき|transformator|3
整流器|せいりゅうき|penyearah|3
避雷器|ひらいき|penangkal petir|3
配電盤|はいでんばん|panel distribusi|3
開閉器|かいへいき|saklar/switchgear|3
信号装置|しんごうそうち|peralatan sinyal|3
転てつ装置|てんてつそうち|penggerak wesel|3
連動装置|れんどうそうち|interlocking|3
列車検知装置|れっしゃけんちそうち|alat pendeteksi kereta|3
自動列車停止装置|じどうれっしゃていしそうち|ATS|3
保安通信設備|ほあんつうしんせつび|peralatan komunikasi keselamatan|3
踏切遮断機|ふみきりしゃだんき|palang perlintasan|3
踏切警報機|ふみきりけいほうき|alarm perlintasan|3
障害物検知装置|しょうがいぶつけんちそうち|detektor penghalang|3
無電圧確認|むでんあつかくにん|pemastian tegangan nol|4
墜落制止用器具|ついらくせいしようきぐ|harness pengaman jatuh|4
絶縁手袋|ぜつえんてぶくろ|sarung tangan isolasi|4
感電|かんでん|sengatan listrik|4
見張員|みはりいん|penjaga/pengawas|4
閉そく|へいそく|blok (block section)|5
軌道回路|きどうかいろ|rangkaian rel (track circuit)|5
ATS|えーてぃーえす|sistem pengaman otomatis kereta|5""".split("\n")
