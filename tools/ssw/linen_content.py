# -*- coding: utf-8 -*-
"""Konten Linen Supply (リネンサプライ) — dari dokumen resmi: 試験基準 (日本リネンサプライ協会 / 技能実習評価試験 初級・専門級),
contoh soal 学科 resmi, 運用方針 (MOJ/MHLW). Ujian 1号 resmi baru; materi ini = dasar teknis ujian resmi lama + soal contoh."""
BABS = [
 dict(no=1, id_="Gambaran Bidang & Ujian", jp="分野と試験の概要", pages=[1, 2],
  intro="Syarat 特定技能1号 Linen Supply, dasar ujian resmi lama (初級/専門級), dan cakupan materi ujian.",
  subs=[("Syarat 1号 dan sumber ujian", "特定技能1号の要件", [1, 2], [
    ("Kebijakan operasional (MOJ/MHLW)", ["Tingkat keterampilan: lulus **リネンサプライ分野特定技能1号評価試験**. Bahasa: setara **A2.2** (JF Standard / 日本語教育の参照枠).",
        "Pekerjaan: rangkaian proses linen dari **penerimaan (入荷) hingga pengiriman (出荷)**; pekerjaan terkait (angkut bahan, bersih-bersih) boleh dikerjakan sambil lalu.",
        "**Hanya direct hire (直接雇用)**. Batas penerimaan: **4.300 orang selama 3 tahun mulai FY2026** (sampai akhir FY2028).",
        "Format ujian 1号 resmi baru; **belum ditemukan pedoman rinci** di sumber resmi saat ini — di sini dipakai **試験基準** ujian lama (技能実習評価試験) sebagai acuan teknis."]),
    ]),
   ("Ujian lama 初級 / 専門級", "技能実習評価試験の概要", [1, 2], [
    ("Struktur", ["Penyelenggara: **一般社団法人 日本リネンサプライ協会 (JLSA)**. Jenis: **初級** (keterampilan dasar), **専門級** (keterampilan umum yang harus dimiliki pekerja初級).",
        "Ujian tulis (学科) berbentuk **○× (benar-salah)**; ujian praktik (実技) = **リネンサプライ仕上げ作業** (kerja finishing).",
        "Statistik JLSA: **初級 total 5.334 peserta, 5.220 lulus**; **専門級 total 2.928 peserta**, tidak lulus tulis 144 & praktik 13 (Reiwa 1–7)."]),
    ("6 bidang pengetahuan ujian tulis (試験基準)", ["① **Jenis & ciri mesin**; ② **Operasi mesin**; ③ **Pengetahuan linen**; ④ **Pekerjaan finishing**; ⑤ **Perawatan mesin**; ⑥ **Keselamatan & kesehatan kerja**."]),
   ])]),
 dict(no=2, id_="Mesin & Operasinya", jp="機械の種類と操作", pages=[1, 1],
  intro="Mesin finishing laundry industri dan operasi dasarnya menurut 試験基準 + fakta dari soal contoh resmi.",
  subs=[("Jenis mesin", "機械の種類と特徴", [1, 1], [
    ("Mesin tingkat 初級", ["**スプレッダーフィーダー (投入機)** — mesin pengumpan/penebar lembaran; **ロールアイロナー (ロール機)** — setrika rol; **浴衣・ガウン投入機**; **タオルフォルダー (畳み機)**; **ユニフォーム・ガウンフォルダー**; **トンネルフィニッシャー (連続式熱風乾燥仕上げ機)**."]),
    ("Tambahan tingkat 専門級", ["**シーツ・包布フォルダー**, **浴衣・ガウン畳み機**, **スタッカー (積み重ね機)**, **検品装置**, **金属探知機 (検針装置)**, **結束機・包装機**."]),
    ("Fakta dari soal contoh resmi", ["Roller ironer ada tipe **チェストロール機** dan **カレンダーロール機**. Mesin pengumpan seprai dan mesin pengumpan gaun/yukata **berbeda**.",
        "Saat mengatur kecepatan roll: kecepatan **folder lebih cepat** dibanding roll (kunci resmi ○).",
        "Chest roll perlu **sesekali dilewati kain lilin (ワックス布)**. Handuk berbelakang-depan dimasukkan ke towel folder dengan **sisi belakang di atas**.",
        "**Cross folder** pada roll machine **tidak** dapat melipat akurat tanpa mengukur panjang seprai/duvet (pernyataan sebaliknya = SALAH).",
        "Mesin masukkan yukata & lipat yukata: **beda kecepatan besar dengan roll ironer tidak membuat rapi** (SALAH)."]),
  ]),
  ("Operasi mesin", "機械操作", [1, 1], [
    ("Operasi dasar", ["**Cara menyalakan/mematikan daya**; **cara berhenti darurat (非常停止)**; **pengaturan menu sesuai linen**. 専門級 tambahan: **pengaturan kecepatan tiap mesin** dan **tekanan udara & uap yang dibutuhkan**.",
        "Sebelum mulai kerja: **periksa tombol berhenti darurat** (menekannya menghentikan mesin) — soal contoh ○.",
        "Linen tersangkut → **hentikan mesin segera**. Bunyi buzzer mesin → **laporkan ke leader**."]),
  ])]),
 dict(no=3, id_="Pengetahuan Linen", jp="リネンに関する知識", pages=[1, 1],
  intro="Jenis linen hotel dan rumah sakit serta sifat serat (dari 試験基準 dan soal contoh).",
  subs=[("Jenis linen", "リネンの種類と用途", [1, 1], [
    ("Hotel (ホテルリネン)", ["**シーツ** (seprai), **デュベ (羽毛布団) カバー / 包布**, **ピローケース** (sarung bantal), **タオル**, **浴衣・ガウン・館内着**, **テーブルクロス**, **ナプキン**, **サービスウェア**, **厨房白衣**, **ワーキングウェア**."]),
    ("Rumah sakit (病院寝具)", ["Seprai, duvet cover, sarung bantal, **ドローシーツ** (draw sheet), **病衣・パジャマ**."]),
    ("Serat", ["**ポリエステル** adalah **serat sintetis** dan **mudah menghasilkan listrik statis** (soal contoh ○). Pernyataan 'polyester adalah serat alam terbanyak dikonsumsi' = **SALAH**.",
        "**ピローケース** dan **ガウン** adalah barang yang berbeda; **ガウン** punya sisi **belakang & depan**."]),
  ])]),
 dict(no=4, id_="Pekerjaan Finishing & Perawatan Mesin", jp="仕上げ作業と機械メンテナンス", pages=[1, 2],
  intro="Mesin-input, inspeksi, ikat & kemas, tugas pengelolaan lini, dan pemeriksaan perawatan.",
  subs=[("Pekerjaan finishing", "仕上げ作業", [1, 2], [
    ("機械投入", ["Cara memasukkan ke: **スプレッダーフィーダー**, **Sabuk masuk roll ironer secara langsung**, **mesin yukata/gaun**, **towel folder**, **uniform/gaun folder**, dan **menggantung di hanger** ke tunnel finisher/folder."]),
    ("検品 (専門級)", ["**Klasifikasi linen bermasalah menurut penyebab (事由別分類)** dan **analisis penyebab**. Ujian praktik: temukan & klasifikasikan cacat linen, tentukan penyebab."]),
    ("結束・包装 (専門級)", ["Linen jadi diklasifikasi menurut **jenis, ukuran, pelanggan**, lalu **diikat/dibungkus dengan jumlah tertentu**. Praktik: **ganti tali mesin pengikat** lalu ikat linen."]),
    ("Pengelolaan lini (専門級)", ["Memeriksa **listrik, udara, tekanan uap** tiap mesin sesuai ketentuan sebelum operasi; **membimbing pekerja** dalam pekerjaan memasukkan."]),
  ]),
  ("Perawatan mesin", "機械メンテナンス", [1, 2], [
    ("Poin pemeriksaan", ["**Kelonggaran/putus sabuk & pita pemandu**; **gerak komponen bergerak (chuck/clamp) bermasalah**; **lampu padam**; **bunyi/getaran tidak normal**.",
        "専門級: **チョコ停** = mesin berhenti sementara yang bisa pulih dengan menemukan penyebab dan perawatan ringan; bila **bukan チョコ停** → **laporkan ke kepala pabrik** untuk dicari solusi.",
        "Bunyi aneh dari mesin: **jangan lanjut bekerja**, laporkan (soal contoh: lanjut bekerja = SALAH)."]),
  ])]),
 dict(no=5, id_="Keselamatan & Kesehatan Kerja", jp="安全衛生", pages=[1, 2],
  intro="Pengetahuan K3 menurut 試験基準 (tingkat 'detail').",
  subs=[("K3 pekerjaan finishing", "安全衛生に関する知識", [1, 2], [
    ("Cakupan (試験基準)", ["① **Pendidikan K3 saat direkrut**; ② **konfirmasi keselamatan sebelum kerja**; ③ **整理・整頓・清掃・清潔・躾**; ④ **konfirmasi keselamatan antar pekerja**; ⑤ **cek APD, rambu & alat keselamatan**; ⑥ **cek penggunaan alat pengaman**; ⑦ **pertolongan pertama saat ada kelainan**; ⑧ **penyebab dan pencegahan kecelakaan finishing laundry**."]),
    ("Fakta dari soal contoh", ["Cedera saat bekerja → **segera sampaikan ke orang di sekitar**. **Patuhi waktu, jangan terlambat**.",
        "Alat bersih-bersih selalu bersih; **sapu dsb. diletakkan di tempat ditentukan** (soal 専門級 ○)."]),
  ])]),
]
V = """リネンサプライ|りねんさぷらい|laundry linen (penyedia linen)|1
特定技能|とくていぎのう|keterampilan khusus (SSW)|1
評価試験|ひょうかしけん|ujian evaluasi|1
初級|しょきゅう|tingkat dasar|1
専門級|せんもんきゅう|tingkat spesialis|1
学科試験|がっかしけん|ujian tulis|1
実技試験|じつぎしけん|ujian praktik|1
入荷|にゅうか|barang masuk|1
出荷|しゅっか|pengiriman|1
直接雇用|ちょくせつこよう|rekrut langsung|1
仕上げ作業|しあげさぎょう|pekerjaan finishing|1
スプレッダーフィーダー|すぷれっだーふぃーだー|mesin pengumpan lembaran|2
投入機|とうにゅうき|mesin pengumpan|2
ロールアイロナー|ろーるあいろなー|setrika rol|2
チェストロール機|ちぇすとろーるき|chest roller|2
カレンダーロール機|かれんだーろーるき|calender roller|2
タオルフォルダー|たおるふぉるだー|mesin lipat handuk|2
畳み機|たたみき|mesin lipat|2
トンネルフィニッシャー|とんねるふぃにっしゃー|tunnel finisher|2
スタッカー|すたっかー|mesin penumpuk|2
検品装置|けんぴんそうち|alat inspeksi|2
金属探知機|きんぞくたんちき|detektor logam|2
検針装置|けんしんそうち|detektor jarum|2
結束機|けっそくき|mesin pengikat|2
包装機|ほうそうき|mesin pembungkus|2
非常停止|ひじょうていし|berhenti darurat|2
ワックス布|わっくすぬの|kain lilin|2
メニュー設定|めにゅーせってい|pengaturan menu program|2
シーツ|しーつ|seprai|3
デュベカバー|でゅべかばー|sarung selimut duvet|3
包布|くるみふ|sarung selimut|3
ピローケース|ぴろーけーす|sarung bantal|3
浴衣|ゆかた|yukata|3
ガウン|がうん|gaun/jubah|3
館内着|かんないぎ|pakaian dalam hotel|3
テーブルクロス|てーぶるくろす|taplak meja|3
ナプキン|なぷきん|serbet|3
厨房白衣|ちゅうぼうはくい|jas putih dapur|3
病衣|びょうい|pakaian pasien|3
ドローシーツ|どろーしーつ|draw sheet|3
ポリエステル|ぽりえすてる|poliester|3
静電気|せいでんき|listrik statis|3
機械投入|きかいとうにゅう|memasukkan ke mesin|4
検品|けんぴん|inspeksi barang|4
結束|けっそく|mengikat|4
包装|ほうそう|membungkus|4
不具合|ふぐあい|cacat / ketidaksesuaian|4
ライン管理|らいんかんり|pengelolaan lini|4
チョコ停|ちょこてい|berhenti sebentar (bisa pulih cepat)|4
ベルト|べると|sabuk|4
ガイドテープ|がいどてーぷ|pita pemandu|4
クランプ|くらんぷ|penjepit|4
異音|いおん|bunyi tidak normal|4
安全衛生|あんぜんえいせい|keselamatan & kesehatan kerja|5
保護具|ほごぐ|APD|5
応急措置|おうきゅうそち|pertolongan pertama|5
整理|せいり|seiri|5
整頓|せいとん|seiton|5
清掃|せいそう|seisou|5
清潔|せいけつ|seiketsu|5
躾|しつけ|disiplin|5
""".strip().split("\n")
