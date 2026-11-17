# -*- coding: utf-8 -*-
"""Konten Shipbuilding (造船・舶用工業) — dari dokumen resmi ClassNK: 受験案内, 実技試験実施要領/問題, 学科試験サンプル (6 区分).
Ujian 学科 asli tidak dipublikasikan penuh (hanya 6 contoh); butir K3 umum = ringkasan Shirose, perlu review ahli."""
S = "分野と試験の概要"
BABS = [
 dict(no=1, id_="Gambaran Bidang & Ujian ClassNK", jp="分野と試験の概要", pages=[1, 4],
  intro="Penyelenggara, 6 区分, syarat, format 学科 & 実技, biaya, dan alur pendaftaran ujian 特定技能1号 造船・舶用工業.",
  subs=[("Penyelenggara dan syarat", "試験の概要と受験資格", [1, 2], [
    ("Ujian", ["Penyelenggara: **一般財団法人 日本海事協会 (ClassNK)**. Tujuan: menilai tingkat keterampilan calon pekerja **特定技能1号** di industri **造船・舶用工業**.",
        "**6 区分 (bidang kerja)**: **溶接** (pengelasan), **塗装** (pengecatan), **鉄工** (kerja besi), **仕上げ** (finishing/fitting), **機械加工** (pemesinan), **電気機器組立て** (perakitan peralatan listrik).",
        "Bahasa ujian: **Jepang (kanji dengan furigana hiragana)**."]),
    ("Syarat peserta", ["Pada hari ujian berusia **17 tahun ke atas**. Bila ujian di Jepang, harus punya **status tinggal (在留資格)** apa pun.",
        "Lulus ujian **tidak menjamin** diberi status 特定技能; tetap ada pemeriksaan permohonan izin/visa."]),
  ]),
  ("Format ujian dan biaya", "試験内容と受験料", [2, 4], [
    ("学科試験 (ujian tulis)", ["Waktu **60 menit**, bentuk **真偽選択法 (○×)**, **30 soal**. Cakupan: **安全衛生一般 10 soal** + **pengetahuan/keterampilan bidang** (**文章問題 10 + 図表問題 10**). Batas lulus: **benar 60% ke atas** (18 dari 30).",
        "Petunjuk soal: tulis **○** bila benar, **×** bila salah di kotak jawaban."]),
    ("実技試験 (praktik)", ["Dinilai lewat pemeriksaan hasil kerja (visual/pengukuran). Waktu: **溶接 ±30 menit (perkiraan)**, **塗装 1 jam**, **仕上げ 1 jam**, **鉄工 1 jam 30 menit**, **機械加工 1 jam 30 menit**, **電気機器組立て 2 jam 30 menit**.",
        "**Pembebasan praktik**: pemegang **sertifikat kemampuan las ClassNK yang berlaku** dan cakupannya meliputi isi ujian (溶接) boleh dibebaskan dari praktik."]),
    ("Biaya (溶接, per orang, belum termasuk pajak)", ["**学科 + 実技**: **23.800 yen**; **学科 saja (praktik dibebaskan)**: **6.100 yen**. Ada **biaya minimum per ujian**: **99.000 yen** (dengan praktik) / **30.500 yen** (学科 saja). Ditambah **biaya perjalanan pengawas** (dibagi rata bila beberapa pelamar)."]),
  ]),
  ("Alur pendaftaran", "申請の手続き", [2, 4], [
    ("Langkah", ["**3 bulan sebelum** tanggal ujian yang diinginkan, hubungi ClassNK untuk konsultasi syarat fasilitas. **Tempat ujian disediakan pemohon**, ClassNK mengirim pengawas.",
        "Unduh **formulir permohonan**, isi, kirim lewat e-mail dengan **foto** (JPEG, **400×300 piksel**, **maks 1 MB**, latar polos, menghadap depan, tanpa topi).",
        "Nomor identitas di formulir: **paspor** atau **在留カード**. Biaya dibayar via transfer setelah faktur diterima.",
        "Bawa saat ujian: **pemberitahuan ujian**, **dokumen identitas** (sama dengan formulir), **pensil/mekanik & penghapus**, dan **pakaian/APD kerja** untuk praktik."]),
  ])]),
 dict(no=2, id_="K3 Umum (安全衛生一般)", jp="安全衛生一般", pages=[1, 2],
  intro="10 dari 30 soal 学科 adalah K3 umum. Ringkasan prinsip keselamatan kerja galangan (ringkasan Shirose, perlu review ahli).",
  subs=[("Prinsip keselamatan kerja", "安全衛生の基本", [1, 2], [
    ("Kondisi diri dan komunikasi", ["Jangan bekerja dengan **kondisi badan buruk**; **laporkan** kepada atasan/rekan (contoh resmi: bekerja sambil menahan sakit = **×**).",
        "Bila **cedera** atau **ada kelainan**, **segera beri tahu orang sekitar/atasan**. Ikuti instruksi pengawas."]),
    ("Alat berat dan area berbahaya", ["Bila **crane mendekat**, **menjauh dari tempat itu** (contoh resmi: ○). Jangan masuk **di bawah beban gantung**.",
        "**Patuhi rambu & tanda**, jangan masuk area terlarang."]),
    ("APD", ["Pakai APD sesuai pekerjaan: **安全帯**, **ヘルメット (安全帽)**, **安全靴**, **保護メガネ / 溶接用保護面**, **防じんマスク**, **皮手袋**, **耳栓**.",
        "Periksa APD **sebelum** bekerja; jangan rusak/ubah alat pengaman."]),
    ("5S dan pekerjaan di ketinggian/ruang tertutup", ["**整理・整頓・清掃・清潔・躾** (5S) mencegah terpeleset & tersandung. Letakkan alat di tempat yang ditentukan.",
        "Pekerjaan **di ketinggian** pakai sabuk pengaman dan jangan menjatuhkan benda. **Ruang tertutup** (tangki, ruang kapal) perlu **ventilasi** dan pengecekan **oksigen/gas**.",
        "**Tidak ada api** di sekitar bahan mudah terbakar; tahu lokasi **alat pemadam** dan **jalur evakuasi**."]),
  ])]),
 dict(no=3, id_="Pengelasan (溶接)", jp="溶接", pages=[1, 5],
  intro="Isi 実技試験 溶接 berdasarkan 実施要領 ClassNK (鋼船規則 M編5章) dan cakupan 学科.",
  subs=[("Ketentuan ujian praktik", "実技試験の内容", [1, 3], [
    ("Jenis ujian", ["Metode las salah satu: **手溶接 (MW)**, **半自動溶接 (SW)**, **ティグ溶接 (TW)**. Produk: **板材 (P)**; sambungan: **突合せ溶接 (B)**; posisi: **下向 (PA)**.",
        "Bahan induk: **普通鋼 (CS)**, **ステンレス鋼 (SU)**, atau **アルミニウム合金 (AL)**; tebal **9 mm ke atas**; sambungan **片面溶接 裏当てあり (ss mb)**.",
        "Las spesimen sesuai **溶接施工要領書 (WPS)**. Item uji: **外観検査** dan **曲げ試験** (bisa diganti **放射線透過試験** kecuali SW kawat solid/metal-cored)."]),
    ("Aturan pengelasan", ["Pada lapisan permukaan 1 pass dan **ルートパス**, buat **minimal satu titik henti las** tiap-nya. Boleh dirapikan dengan gerinda sebelum mulai lagi.",
        "**Jangan mengubah arah** (atas-bawah-kiri-kanan) spesimen selama pengelasan. **Deformasi sudut** setelah las **tidak boleh > 5°** (pakai逆ひずみ/penjepit).",
        "**Dilarang** perlakuan panas atau **peening** sebelum/sesudah pengelasan."]),
  ]),
  ("Kriteria penilaian", "判定基準", [2, 3], [
    ("外観試験", ["Dilakukan **visual**, **sebelum** mengambil spesimen lengkung. Lulus bila **ISO 5817 Level B ke atas**; khusus **余盛 berlebih** dan **penetrasi berlebih** cukup **Level C ke atas**.",
        "Contoh cacat: **割れ (retak)**, **ピット**, **アンダーカット**."]),
    ("曲げ試験", ["Jumlah spesimen **4 buah**; minimal satu dari **titik henti las**. Metode **型曲げ** atau **ローラ曲げ**, sudut **180°** (aluminium boleh **巻付け曲げ**).",
        "Spesimen titik henti ditekuk dengan **titik henti di sisi tarik**.",
        "Lulus bila di permukaan luar: tidak ada retak **> 3 mm**; jumlah panjang retak **≤ 3 mm** tak melebihi **10 mm**; jumlah **blowhole/retak kecil ≤ 10 titik**. Retak di sudut spesimen tidak dinilai; retak di bahan induk → **ulang uji**."]),
    ("Uji ulang", ["Bila sebagian lengkung gagal: ulang las dalam **1 bulan** dan ambil spesimen **dua kali lipat**.",
        "Bila gagal total: setelah latihan, baru bisa mengulang **setelah 1 bulan atau lebih**."]),
  ]),
  ("Pengetahuan 学科 pengelasan", "溶接の基礎知識", [1, 1], [
    ("Dasar", ["**半自動アーク溶接**: **ワイヤ** diumpan **otomatis**. **ヒューム (fume)** = asap logam, **bukan** cacat las. **溶接用保護面** melindungi mata dan wajah dari sinar busur.",
        "**すみ肉溶接** = las sudut (fillet) pada pertemuan dua pelat membentuk sudut. **突合せ溶接** = las sambungan tumpul."]),
  ])]),
 dict(no=4, id_="Pengecatan (塗装)", jp="塗装", pages=[1, 3],
  intro="Isi 実技試験 塗装 dari 実施要領: persiapan permukaan, masking, cat dasar, corner, kriteria lulus.",
  subs=[("Ujian praktik pengecatan", "実技試験の内容", [1, 3], [
    ("Ketentuan", ["Waktu praktik **1 jam**. Bahan: **pelat logam (L型)**, tebal **t = 1–5 mm**. Pekerjaan: **素地調整**, **マスキング**, **下塗り**, **コーナ塗装**.",
        "Metode cat dasar dipilih saat pendaftaran dan **tak boleh diganti** pada hari ujian: **エアレススプレー**, **エアスプレー**, atau **ローラ・刷毛**.",
        "Pengecatan **エアスプレー: maks 10 menit per orang**; waktu antre tidak dihitung waktu ujian."]),
    ("Alur kerja", ["**素地調整**: buang **bavur (バリ)** tepi dan **karat/kotoran** dengan **kain amplas P100**, bersihkan dengan **pelarut organik**.",
        "**マスキング**: lindungi area dari tepi pelat sekitar **80 mm** (①) dan area kuas (②) dengan **masking tape**; posisi diukur dengan **penggaris**.",
        "**下塗り**: arah semprot **horizontal** (spray) / **ke bawah** (roller & kuas); rata di muka **A dan B**; keringkan **alami pada suhu ruang**.",
        "**コーナ塗装**: lepas masking area ②, cat **sudut dengan kuas** sesuai gambar, pelat tetap pada arah semula.",
        "Saat mengumpulkan, **semua masking tape harus dilepas**; **tidak boleh ada cat menempel** di area masking."]),
    ("Kriteria lulus", ["① **Masking sesuai instruksi** dan tidak ada cat menempel. ② **Tebal film cat dasar ≥ 100 μm** (muka A). ③ **Tidak ada belang** di sudut. ④ Tidak ada cacat seperti **垂れ (menetes/sagging)** dan **ゆず肌 (kulit jeruk)**.",
        "Alat ukur ketebalan film harus mampu mengukur **30–200 μm**. Dilarang api (**火気厳禁**); ruang perlu **ventilasi** karena cat/pelarut mudah terbakar dan berbahaya."]),
  ])]),
 dict(no=5, id_="Kerja Besi (鉄工)", jp="鉄工", pages=[1, 3],
  intro="Isi 実技試験 鉄工: けがき, ガス切断, 仮付け溶接, 曲げ加工, dan kriteria pengukuran.",
  subs=[("Ujian praktik kerja besi", "実技試験の内容", [1, 3], [
    ("Ketentuan", ["Waktu praktik **1 jam 30 menit**. Dari bahan yang diberikan, buat produk sesuai **製作図**: **けがき (marking)**, **ガス切断**, **仮付け溶接 (tack weld)**, **曲げ加工**.",
        "Pelat tekuk (曲げ板) diberikan sudah ditekuk. Alat: **定盤**, **横万力**, **ノギス**, **テーパゲージ**, **ボールゲージ (Ø2,0 dan Ø5,0 mm)**.",
        "Mesin las: **las busur** atau **semi-otomatis**; las busur harus memakai **電撃防止装置** (pencegah sengatan listrik)."]),
    ("Contoh instruksi", ["Tack weld **panjang las ≥ 70 mm**. Dimensi tertentu harus **135 ± 3 mm**; celah antara pelat ② dan pelat tekuk **< 3 mm**."]),
    ("Kriteria lulus", ["① Dimensi posisi rakitan **dalam toleransi**. ② **Kemiringan pelat tegak** dalam nilai yang ditentukan. ③ Pelat tekuk disetel dalam ukuran tertentu dari tepi. ④ **Ketidakrataan bidang potong gas** dalam batas. ⑤ **Posisi dan jumlah tack weld** sesuai gambar."]),
  ])]),
 dict(no=6, id_="Finishing / Fitting (仕上げ)", jp="仕上げ", pages=[1, 3],
  intro="Isi 実技試験 仕上げ: kekasaran permukaan, fit (はめあい), chamfer.",
  subs=[("Ujian praktik finishing", "実技試験の内容", [1, 3], [
    ("Ketentuan", ["Waktu praktik **1 jam**. Buat **部品A** sesuai **加工図**. **ロッド (Ø20, L50) tidak boleh diproses**.",
        "Pekerjaan: **表面粗さ調整**, **はめあい調整**, **面取り仕上げ**."]),
    ("Instruksi", ["Permukaan finish ① **Ra 6,3** (50 mm kiri-kanan dari pusat lubang); lalu bagian kanan 50 mm **Ra 1,6 atau lebih halus**.",
        "Permukaan dalam lubang disetel sehingga **ロッド lewat mulus** dengan **celah maks 0,5 mm**. Semua tepi **糸面取り**. Setelah selesai, **bongkar** rod dan 部品A."]),
    ("Kriteria lulus", ["① Kekasaran permukaan atas 部品A **dalam rentang**. ② Rod **bergeser mulus**. ③ **Celah maks rod–lubang ≤ 0,5 mm** (cek **ボールゲージ 0,5 mm**). ④ **Semua tepi (陵/edge) 糸面取り**."]),
  ])]),
 dict(no=7, id_="Pemesinan (機械加工)", jp="機械加工", pages=[1, 3],
  intro="Isi 実技試験 機械加工 (bubut): toleransi, alur O-ring, chamfer.",
  subs=[("Ujian praktik pemesinan", "実技試験の内容", [1, 3], [
    ("Ketentuan", ["Waktu praktik **1 jam 30 menit**. Bahan: **baja atau paduan tembaga**. Buat bagian sesuai **加工図** dengan **mesin bubut (旋盤)**.",
        "Alur kerja: bubut **sisi luar**, bubut **bidang bertingkat**, bubut **alur O-ring** (lebar dan kedalaman dalam toleransi); sudut alur O-ring boleh **R ≤ 0,8**.",
        "Tepi tanpa petunjuk → **糸面取り**. Toleransi lain: **±0,3 mm**. Kekasaran target **Ra 6,3**."]),
    ("Kriteria lulus", ["① Dimensi bertoleransi dalam **±0,3 mm**. ② **Lebar & kedalaman alur** dalam toleransi. ③ Tepi terluar yang ditunjuk **C1 (chamfer 1 mm)**. ④ Tepi lain semua **糸面取り**.",
        "Alat ukur: **内側マイクロメータ** (lebar alur), **ディプスマイクロメータ** (kedalaman), **ノギス**, **スケール**."]),
  ])]),
 dict(no=8, id_="Perakitan Peralatan Listrik (電気機器組立て)", jp="電気機器組立て", pages=[1, 3],
  intro="Isi 実技試験: membuat panel kontrol motor induksi 3 fasa dari diagram sambungan.",
  subs=[("Ujian praktik perakitan listrik", "実技試験の内容", [1, 3], [
    ("Ketentuan", ["Waktu praktik **2 jam 30 menit**. Bahan: komponen yang diberikan; buat **panel kontrol motor induksi 3 fasa** dengan acuan **接続図・配置図・ルート図**.",
        "Komponen contoh: **配線用遮断器 (3 kutub, AC200–220 V)**, **電磁接触器 (2,2 kW, AC220 V; koil AC100 V)**, **表示灯 (GN/RD)**, **端子台**, **ダクト**, **600V ビニール電線 (IV)**."]),
    ("Aturan kerja", ["**Sirkuit utama**: kabel **3,5 mm²**; **sirkuit kontrol**: kabel **1,25 mm²**. Ujung kabel pakai **R形裸圧着端子**.",
        "Kabel lampu indikator (**GN, RD**) **tidak lewat duct horizontal**. **Kepala sekrup dalam duct dilindungi isolasi**. Di dalam duct **jangan mengikat/melipat balik** kabel.",
        "**Nomor terminal** ditulis jelas di kertas simbol terminal. Pengawatan hanya dalam **panjang kabel yang diberikan**. **Alat yang rusak tidak diganti**."]),
    ("Kriteria lulus & diskualifikasi", ["① Dengan operasi saklar tertentu, sirkuit utama **berkontinuitas sesuai ketentuan**. ② Untuk operasi saklar apa pun, **isolasi tetap terjaga**. ③ **Lampu indikator** menyala sesuai operasi.",
        "**Diskualifikasi (失格)**: meninggalkan ujian, atau tindakan berbahaya yang dapat merusak alat/menimbulkan cedera menurut pengawas."]),
  ])]),
]
V = """造船|ぞうせん|pembuatan kapal|1
舶用工業|はくようこうぎょう|industri peralatan/permesinan kapal|1
日本海事協会|にほんかいじきょうかい|ClassNK (Nippon Kaiji Kyokai)|1
特定技能|とくていぎのう|keterampilan khusus (SSW)|1
受験案内|じゅけんあんない|panduan peserta ujian|1
学科試験|がっかしけん|ujian tulis|1
実技試験|じつぎしけん|ujian praktik|1
真偽選択法|しんぎせんたくほう|metode pilih benar/salah (○×)|1
合格基準|ごうかくきじゅん|kriteria kelulusan|1
受験料|じゅけんりょう|biaya ujian|1
在留カード|ざいりゅうかーど|kartu izin tinggal|1
申請書|しんせいしょ|formulir permohonan|1
試験監督者|しけんかんとくしゃ|pengawas ujian|1
免除|めんじょ|pembebasan|1
安全衛生|あんぜんえいせい|keselamatan dan kesehatan kerja|2
安全帽|あんぜんぼう|helm pengaman|2
安全靴|あんぜんぐつ|sepatu keselamatan|2
保護メガネ|ほごめがね|kacamata pelindung|2
防じんマスク|ぼうじんますく|masker anti debu|2
皮手袋|かわてぶくろ|sarung tangan kulit|2
安全帯|あんぜんたい|sabuk pengaman|2
整理整頓|せいりせいとん|rapi dan teratur (5S)|2
火気厳禁|かきげんきん|dilarang api|2
熱中症|ねっちゅうしょう|sengatan panas|2
クレーン|くれーん|crane|2
溶接|ようせつ|pengelasan|3
手溶接|てようせつ|las tangan (MW)|3
半自動溶接|はんじどうようせつ|las semi-otomatis (SW)|3
ティグ溶接|てぃぐようせつ|las TIG (TW)|3
突合せ溶接|つきあわせようせつ|las sambungan tumpul|3
すみ肉溶接|すみにくようせつ|las sudut/fillet|3
下向|したむき|posisi bawah tangan (PA)|3
裏当て|うらあて|pelat/bahan penyangga belakang|3
開先|かいさき|alur sambungan (groove)|3
余盛|よもり|kelebihan tinggi las (reinforcement)|3
外観試験|がいかんしけん|uji visual|3
曲げ試験|まげしけん|uji tekuk|3
放射線透過試験|ほうしゃせんとうかしけん|uji radiografi|3
割れ|われ|retak|3
アンダーカット|あんだーかっと|undercut|3
ブローホール|ぶろーほーる|blowhole/porositas|3
ヒューム|ひゅーむ|fume (asap logam)|3
保護面|ほごめん|pelindung wajah las|3
中断箇所|ちゅうだんかしょ|titik henti las|3
逆ひずみ|ぎゃくひずみ|pra-distorsi balik|3
塗装|とそう|pengecatan|4
素地調整|そじちょうせい|persiapan permukaan|4
マスキング|ますきんぐ|masking|4
下塗り|したぬり|cat dasar|4
刷毛塗り|はけぬり|pengecatan kuas|4
膜厚|まくあつ|tebal film cat|4
垂れ|たれ|cat menetes (sagging)|4
ゆず肌|ゆずはだ|kulit jeruk (orange peel)|4
エアレススプレー|えあれすすぷれー|airless spray|4
エアスプレー|えあすぷれー|air spray|4
薄め液|うすめえき|thinner|4
鉄工|てっこう|kerja besi|5
けがき|けがき|marking/menggores|5
ガス切断|がすせつだん|potong gas|5
仮付け溶接|かりづけようせつ|las tack|5
曲げ加工|まげかこう|pembengkokan|5
製作図|せいさくず|gambar kerja|5
定盤|じょうばん|meja rata (surface plate)|5
横万力|よこまんりき|ragum|5
ノギス|のぎす|jangka sorong|5
電撃防止装置|でんげきぼうしそうち|alat pencegah sengatan listrik|5
仕上げ|しあげ|finishing/fitting|6
表面粗さ|ひょうめんあらさ|kekasaran permukaan|6
はめあい|はめあい|kesesuaian (fit)|6
面取り|めんとり|chamfer|6
糸面取り|いとめんとり|chamfer tipis|6
陵|りょう|tepi/sudut (edge)|6
隙間|すきま|celah|6
ボールゲージ|ぼーるげーじ|ball gauge|6
加工図|かこうず|gambar pengerjaan|6
機械加工|きかいかこう|pemesinan|7
旋盤|せんばん|mesin bubut|7
公差|こうさ|toleransi|7
溝|みぞ|alur|7
Oリング|おーりんぐ|O-ring|7
内側マイクロメータ|うちがわまいくろめーた|mikrometer dalam|7
ディプスマイクロメータ|でぃぷすまいくろめーた|mikrometer kedalaman|7
電気機器組立て|でんきききくみたて|perakitan peralatan listrik|8
制御盤|せいぎょばん|panel kontrol|8
三相誘導電動機|さんそうゆうどうでんどうき|motor induksi 3 fasa|8
配線用遮断器|はいせんようしゃだんき|MCCB (pemutus sirkuit)|8
電磁接触器|でんじせっしょくき|kontaktor magnetik|8
表示灯|ひょうじとう|lampu indikator|8
端子台|たんしだい|blok terminal|8
圧着端子|あっちゃくたんし|terminal press (crimp)|8
ダクト|だくと|duct kabel|8
主回路|しゅかいろ|sirkuit utama|8
制御回路|せいぎょかいろ|sirkuit kontrol|8
絶縁|ぜつえん|isolasi|8
導通|どうつう|kontinuitas|8
失格|しっかく|diskualifikasi|8""".split("\n")
