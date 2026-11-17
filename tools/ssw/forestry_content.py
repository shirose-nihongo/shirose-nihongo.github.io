# -*- coding: utf-8 -*-
"""Konten Kehutanan (林業) — dari dokumen resmi 林業技能向上センター / 林野庁 (ssw-materials/forestry).
Tidak ada buku belajar resmi; materi = ringkasan pedoman ujian, soal contoh resmi (学科) dan soal 実技 2026."""
BABS = [
 dict(no=1, id_="Gambaran Ujian 林業技能測定試験", jp="試験の概要", pages=[1, 2],
  intro="Penyelenggara, syarat peserta, format ujian tulis & praktik, dan kriteria lulus (resmi).",
  subs=[("Syarat & penyelenggara", "受験資格・実施機関", [1, 2], [
    ("Siapa yang bisa ikut", ["Ujian resmi **林業技能測定試験** (林業分野特定技能1号評価試験); penyelenggara: **一般社団法人 林業技能向上センター**; bahasa ujian: **Jepang** (kanji berfurigana).",
        "Peserta: **berumur ≥ 18 tahun** pada hari ujian dan **memiliki status tinggal (在留資格)** (ujian dalam negeri).",
        "Wajib sudah mengikuti **pendidikan khusus penebangan dengan chainsaw (チェーンソーによる伐木等特別教育)** atau kursus yang memenuhi syaratnya.",
        "Biaya ujian (2026): **20.000 yen** (termasuk pajak) untuk tulis + praktik. Lulus ujian **tidak menjamin** status tinggal 特定技能 diberikan.",
        "Jadwal 2026–2027 (contoh): Jun Ōita, Jul Nara, Agu Fukushima, Sep Hokkaidō & Ishikawa, **20 Des Ōita**, **26 Feb 2027 Ehime**."]),
  ]),
  ("Format & kriteria lulus", "試験内容・合格基準", [1, 2], [
    ("Ujian tulis (学科)", ["Bentuk: **benar-salah (○×) 30 soal**; cakupan: pengetahuan umum kehutanan, **keselamatan & kesehatan kerja**, kemampuan bahasa Jepang yang dibutuhkan; tingkat setara **林業職種 技能検定 3 級**.",
        "Lulus: **≥ 65% benar**.",
        "Waktu: panduan ujian 2026 menulis **30 menit**, sedangkan contoh soal (Jul 2025) menulis **60 menit** — periksa panduan terbaru saat mendaftar."]),
    ("Ujian praktik (実技)", ["Ujian kerja dengan **chainsaw** (setara 技能検定 3 級). Syarat lulus: **tiap tugas ≥ 40%** DAN **total ≥ 60%**.",
        "Tiga tugas: ① merakit chainsaw, ② pemanasan mesin, ③ membuat potongan kayu bulat (輪切り)."]),
  ])]),
 dict(no=2, id_="Ujian Praktik: 3 Tugas Chainsaw", jp="実技試験（3課題）", pages=[1, 8],
  intro="Rincian tiga tugas praktik 2026, waktu, urutan, dan aturan keselamatan saat ujian.",
  subs=[("Tiga tugas", "課題1〜3", [1, 8], [
    ("Tugas 1: Merakit chainsaw (組み立て作業)", ["Waktu standar **3 menit**, batas **4 menit** (penyesuaian setelah pemeriksaan: **3 menit**).",
        "Merakit body, **ソーチェーン (rantai)** dan **ガイドバー (bar)** dari kondisi terlepas. Boleh tangan kosong atau **軍手** (hanya untuk tugas 1).",
        "Selesai → **angkat tangan**; penguji memeriksa, bila ada bagian tak sesuai harus disesuaikan. Lewat 3 menit penyesuaian = **gagal**."]),
    ("Tugas 2: Pemanasan mesin (暖機運転)", ["Batas waktu **7 menit** (penyesuaian setelah pemeriksaan 3 menit).",
        "Urutan: **start mesin → idling → putar rantai (keluarkan oli rantai) → isyarat selesai**. Bila rantai kendor setelah pemanasan, boleh dikencangkan lagi sebelum melapor selesai."]),
    ("Tugas 3: Potong kayu bulat (丸太輪切り)", ["Waktu standar **3 menit**, batas **4 menit**. Bahan: kayu bulat konifer berdiameter **24 cm**, tinggi pemasangan **50 cm**.",
        "Membuat **2 potongan tebal 5 cm**: ke-1 dipotong dari atas ke bawah (**tanpa memotong ulang**); ke-2 dipotong di tengah di rentang bertanda merah hingga **ujungnya bertemu (切り合わせ)**, selisih **0 cm**.",
        "Pada potongan ke-2: setelah potongan pertama, **angkat bar dari kayu** lalu potong lagi — **dilarang 回し切り (memutar bar)**; tidak boleh memotong ulang. Tidak boleh memakai penggaris; patahan dengan memelintir bar dianggap **gagal**."])]),
  ("Aturan umum selama ujian", "共通注意事項", [1, 2], [
    ("Aturan keselamatan", ["Saat menyalakan mesin, **rem rantai harus aktif**; letakkan chainsaw **di tanah** — **dilarang 股掛け / 落とし掛け** (start di paha / dijatuhkan).",
        "Rem rantai diaktifkan/dilepas dengan **kedua tangan memegang** (kecuali bar di dalam kayu). Mesin hidup: **jangan berpindah ≥ 2 langkah tanpa rem**; **jangan menyentuh rantai**; **jangan memasang/melepas penutup**.",
        "Membawa chainsaw: pasang **ガイドバーカバー** menutupi seluruh rantai. Penutup dibuka **setelah isyarat mulai**, dipasang **sebelum isyarat selesai**.",
        "Ponsel / alat komunikasi **dilarang**. Pekerjaan mengikuti pedoman MHLW **「チェーンソーによる伐木等作業の安全に関するガイドライン」**."]),
  ])]),
 dict(no=3, id_="APD, Alat & Syarat Diskualifikasi", jp="保護具・作業用具・失格要件", pages=[3, 8],
  intro="APD dan alat yang harus dibawa peserta, standar, dan hal yang membuat peserta didiskualifikasi.",
  subs=[("APD yang dibawa peserta", "保護具等", [3, 8], [
    ("Daftar APD", ["**Helm (保護帽)**: sesuai standar benda jatuh/terbang (Notifikasi MHLW 1975 no.66), **tak retak, tak lapuk/berubah warna**, tali dagu terpasang. Umur pakai: FRP **5 tahun**, ABS/PC/PE **3 tahun**.",
        "**Pelindung wajah (visor) atau kacamata**; **earmuff atau sumbat telinga**; **baju lengan panjang berpergelangan rapat** (lengan pendek boleh bila ada arm cover — tidak ada kulit terbuka).",
        "**Sarung tangan** tebal anti-getar/dingin, tidak sobek; **軍手 tidak boleh** (kecuali merakit).",
        "**Pelindung kaki/celana (防護衣)**: JIS T8125-2 (2022) class 1 ke atas atau ISO/EN/ASTM/AS-NZS class 1+; kain tanpa sobekan, tanpa tambalan.",
        "**Sepatu pengaman**: JIS T8125-3/ISO/EN/ASTM Level 1+; atau sepatu berujung baja (JIS T8101) **+ gaiter** JIS T8125-5 class 1+. **Sepatu tabi (地下足袋) tidak boleh**."]),
    ("Alat kerja", ["**Chainsaw bergagang panjang (ロングハンドル, mesin bensin)** — listrik atau **top-handle** tidak boleh. **≥ 40 cc** harus memenuhi standar chainsaw (Notifikasi MHLW 1977 no.85). Bensin diisi penuh.",
        "Alat: **kunci kombinasi atau kunci busi**; **ガイドバーカバー**."]),
  ]),
  ("Syarat diskualifikasi", "失格要件", [5, 8], [
    ("Pemeriksaan sebelum ujian", ["Satu saja APD/alat tak memenuhi standar → **tidak boleh ujian = gagal praktik**.",
        "Helm retak (berapa pun) = tidak boleh; visor sobek **≥ 1 cm**; sumbat/earmuff retak ≥ 1 cm.",
        "Chainsaw: **rem rantai harus bekerja** (rantai tak berputar saat rem aktif); **フロントハンドガード retak = tidak boleh**; **スロットルロックアウト** retak ≥ 1 cm / tidak berfungsi; **チェーンキャッチャー** cacat; **クラッチカバー retak** tidak boleh.",
        "Bar: retak berapa pun, **bengkok ≥ 5 mm**, aus hingga drive link terlihat, atau gompal = tidak boleh. Rantai: **gigi atas terpanjang ≤ 3 mm** (terlalu aus) tidak boleh."]),
    ("Selama / setelah kerja", ["**Cedera** (obat/tidak), **start chainsaw dengan 落とし掛け**, **alat/peralatan rusak** (termasuk rantai lepas), APD **sobek baru** → diskualifikasi.",
        "Tugas 3: rantai berputar saat **idling**; potongan gagal; waktu habis (4 menit) → gagal. Penguji dapat menghentikan ujian bila perilaku dinilai berbahaya."]),
  ])]),
 dict(no=4, id_="Ujian Tulis: Silvikultur (Poin dari Soal Contoh)", jp="学科：造林・保育", pages=[1, 2],
  intro="Poin pengetahuan penanaman & perawatan hutan yang muncul di soal contoh resmi (hanya yang tertulis dalam kunci jawaban).",
  subs=[("Bibit, penjalaran, tanam, perawatan", "苗・つる切り・地拵え・植栽・下刈り", [1, 2], [
    ("Poin resmi (menurut kunci jawaban)", ["**つる切り (pemotongan liana)** efektif mencegah patah/bengkoknya batang pohon tanaman; efek besar sekitar **Juni–Juli**.",
        "**Pembersihan lahan strip (筋刈り地拵え)** **mengurangi jumlah tenaga (人工数)** dibanding 全刈り. (soal contoh: pernyataan sebaliknya = SALAH)",
        "**Penanaman segitiga sama sisi (正三角形植え)** efektif di daerah bersalju untuk mencegah tumbang bersama akibat salju (冠雪害).",
        "Tanah untuk lubang tanam di lereng: **runtuhkan dari sisi atas lereng** lalu masukkan.",
        "**下刈り (pembabatan rumput)**: metode **全刈り, 筋刈り, 坪刈り**; arah kerja umumnya **menyusuri garis kontur** (soal contoh: pernyataan arah 'dari kanan ke kiri' = BENAR).",
        "Pohon kecil/semak besar saat 下刈り **tidak** diproses dengan sabit (pernyataan sebaliknya salah).",
        "**除伐 (penjarangan awal)** **tidak** hanya membuang spesies selain target (pernyataan itu SALAH).",
        "**枝打ち (pemangkasan cabang)** memakai gergaji tangan memungkinkan posisi potong yang **akurat**.",
        "Bibit telanjang (裸苗) **tidak** lebih singkat masa persemaiannya dibanding bibit kontainer; kondisi bibit baik **tidak cukup** hanya dari akar dan pucuk (keduanya pernyataan SALAH di soal contoh)."]),
  ])]),
 dict(no=5, id_="Ujian Tulis: Penebangan, Chainsaw & K3", jp="学科：伐木・チェーンソー・安全衛生", pages=[2, 4],
  intro="Poin tentang penebangan, memangkas cabang, memotong batang, chainsaw, sabit mesin, 4S, kecelakaan, dan kelelahan panas (dari soal contoh resmi).",
  subs=[("Penebangan & chainsaw", "伐倒・枝払い・玉切り・チェーンソー", [2, 3], [
    ("Poin resmi (menurut kunci jawaban)", ["**Sebelum menebang (伐倒前)**: pastikan **arah rebah**, **arah angin**, dan **tidak ada orang di arah rebah**. Singkirkan semak, ranting, bambu kecil (ササ) yang berbahaya.",
        "**Tentukan 退避場所 (tempat berlindung) & jalurnya**; singkirkan rintangan di jalur itu lebih dulu.",
        "**枝払い (memangkas cabang) dengan chainsaw**: gunakan **bagian bawah chainsaw sebagai tumpuan (tuas)**; mudah bila pangkal cabang berada antara **lutut dan pinggang**; dekatkan chainsaw ke badan agar **punggung tidak tegang**.",
        "**玉切り (memotong batang)** dilakukan di **sisi atas lereng** dari batang; waspadai batang menggelinding (転動).",
        "**Posisi dasar chainsaw**: pegang **gagang depan & belakang dengan ibu jari melingkar** (grip penuh).",
        "**Spesifikasi chainsaw** diatur dalam peraturan UU Keselamatan & Kesehatan Kerja.",
        "Sabit mesin bahu (肩掛式刈払機) umumnya **bukan** tipe gagang loop (pernyataan loop = SALAH)."]),
    ("Tarik kayu (木寄せ) dengan とび", ["Soal contoh: 'menarik kayu dengan tenaga manusia **tidak boleh** memakai とび' = **SALAH**; 'melilitkan tangan di gagang とび agar kuat' = **BENAR** (menurut kunci resmi; tetap ikuti aturan keselamatan tempat kerja)."]),
  ]),
  ("K3 & kecelakaan", "安全衛生", [3, 4], [
    ("Poin resmi", ["**4S活動** = 整理・整頓・清掃・清潔 (di soal contoh disebut 4S).",
        "Pekerja yang menemukan **kecelakaan kerja (労働災害)** segera **melapor ke penanggung jawab komunikasi (連絡責任者)** dengan kondisi korban.",
        "**Kelelahan panas (熱中症)**: sebagai langkah pertolongan/pencegahan, **hindari kerja sendirian**."]),
  ])]),
]
V = """林業|りんぎょう|kehutanan|1
技能測定試験|ぎのうそくていしけん|ujian pengukuran keterampilan|1
特別教育|とくべつきょういく|pendidikan khusus (chainsaw)|1
在留資格|ざいりゅうしかく|status tinggal|1
学科試験|がっかしけん|ujian tulis|1
実技試験|じつぎしけん|ujian praktik|1
真偽法|しんぎほう|metode benar-salah (○×)|1
合格基準|ごうかくきじゅん|kriteria lulus|1
チェーンソー|ちぇーんそー|chainsaw|2
組み立て|くみたて|perakitan|2
暖機運転|だんきうんてん|pemanasan mesin|2
丸太|まるた|kayu bulat|2
輪切り|わぎり|potongan melintang kayu|2
切り合わせ|きりあわせ|memotong hingga ujung bertemu|2
回し切り|まわしぎり|memotong dengan memutar bar (dilarang)|2
ソーチェーン|そーちぇーん|rantai gergaji|2
ガイドバー|がいどばー|bar pemandu|2
チェーンブレーキ|ちぇーんぶれーき|rem rantai|2
股掛け|またがけ|start chainsaw di paha (dilarang)|2
落とし掛け|おとしがけ|start dengan menjatuhkan chainsaw (dilarang)|2
打切り時間|うちきりじかん|batas waktu (dihentikan)|2
標準時間|ひょうじゅんじかん|waktu standar|2
検定委員|けんていいいん|penguji|2
保護帽|ほごぼう|helm pengaman|3
保護網|ほごあみ|visor / pelindung wajah|3
イヤマフ|いやまふ|earmuff|3
防護衣|ぼうごい|pakaian/celana pelindung chainsaw|3
脚絆|きゃはん|gaiter|3
安全靴|あんぜんぐつ|sepatu pengaman|3
地下足袋|じかたび|sepatu tabi (tidak boleh)|3
軍手|ぐんて|sarung tangan katun|3
失格|しっかく|diskualifikasi|3
スロットルロックアウト|すろっとるろっくあうと|throttle lockout|3
チェーンキャッチャー|ちぇーんきゃっちゃー|chain catcher|3
クラッチカバー|くらっちかばー|penutup kopling|3
ガイドバーカバー|がいどばーかばー|penutup bar|3
造林|ぞうりん|penanaman hutan|4
苗|なえ|bibit|4
裸苗|はだかなえ|bibit akar telanjang|4
コンテナ苗|こんてななえ|bibit kontainer|4
つる切り|つるきり|pemotongan liana|4
地拵え|じごしらえ|persiapan lahan tanam|4
筋刈り|すじがり|pembabatan strip|4
全刈り|ぜんがり|pembabatan total|4
坪刈り|つぼがり|pembabatan per lubang tanam|4
下刈り|したがり|pembabatan rumput/semak|4
除伐|じょばつ|penjarangan awal (pembuangan spesies lain)|4
枝打ち|えだうち|pemangkasan cabang|4
植え穴|うえあな|lubang tanam|4
等高線|とうこうせん|garis kontur|4
冠雪害|かんせつがい|kerusakan akibat salju|4
伐倒|ばっとう|penebangan|5
退避場所|たいひばしょ|tempat berlindung|5
枝払い|えだはらい|memangkas cabang pohon rebah|5
玉切り|たまきり|memotong batang jadi bagian|5
木寄せ|きよせ|menarik/mengumpulkan kayu|5
とび|とび|kait kayu (pike)|5
刈払機|かりばらいき|sabit mesin (brush cutter)|5
労働災害|ろうどうさいがい|kecelakaan kerja|5
連絡責任者|れんらくせきにんしゃ|penanggung jawab komunikasi|5
熱中症|ねっちゅうしょう|kelelahan panas (heat stroke)|5
整理|せいり|seiri|5
整頓|せいとん|seiton|5
清掃|せいそう|seisou|5
清潔|せいけつ|seiketsu|5
""".strip().split("\n")
