# -*- coding: utf-8 -*-
"""Bidang logistics (物流倉庫). Sumber lingkup: 物流倉庫分野 特定技能評価試験 試験基準 (国土交通省, 2026-10-26) dan 分野別運用方針.
Isi = ORIGINAL LEARNING CONTENT Shirose (pengetahuan umum pergudangan mengikuti butir试验基准), perlu review ahli. Bukan soal resmi."""
def TF(jp, ok, exp_id, exp_jp, id_=None): return ("tf", id_, jp, ok, exp_id, exp_jp)
def MC(q_id, q_jp, right, wrong, exp_id, exp_jp): return ("mc", q_id, q_jp, right, wrong, exp_id, exp_jp)
SLUG = "logistics"; NAMA = "Logistik / Pergudangan (Butsuryu Soko)"; JP = "物流倉庫"; PREFIX = "lg"
SRC = "物流倉庫分野 試験基準 国土交通省 2026-10-26"
TEMA_SUB = "b3s2"; TEMA_ID = ("Tema: Keselamatan Kerja Gudang", "倉庫の安全")
BAB = [
 {"id": "bab1", "title_id": "Penyimpanan dan Bongkar-Muat", "title_jp": "保管・荷役",
  "intro_id": "Jenis gudang, peralatan, alur kerja masuk-keluar barang, satuan, dan simbol penanganan.",
  "intro_jp": "倉庫の種類、設備・機器、入庫・出庫の作業、単位、ケアマークを学びます。", "pages": [1, 1], "src": SRC},
 {"id": "bab2", "title_id": "Pengolahan Distribusi dan Manajemen Kerja", "title_jp": "流通加工",
  "intro_id": "Manajemen lokasi, cek barang, pengemasan, nama alat, dan menghitung waktu/jumlah orang.",
  "intro_jp": "ロケーション管理、検品・梱包、機器の名前、作業時間や人数の計算を学びます。", "pages": [1, 1], "src": SRC},
 {"id": "bab3", "title_id": "Keselamatan dan Kesehatan Kerja", "title_jp": "安全・衛生",
  "intro_id": "Kesehatan diri, APD, tindakan berbahaya, tanda darurat, dan prosedur kerja.",
  "intro_jp": "健康管理、保護具、危険な行動、防災サイン、作業手順を学びます。", "pages": [1, 1], "src": SRC},
]
SUBS = {}
SUBS["bab1"] = [
 {"id": "b1s1", "pages": [1, 1], "t_id": "Jenis Gudang", "t_jp": "倉庫の種類",
  "id_bl": [("h", "Jenis gudang menurut Undang-Undang Usaha Pergudangan"), ("ul", [
     "**普通倉庫**: gudang untuk barang umum (kemasan, kardus, pallet) pada suhu ruang.",
     "**冷蔵倉庫**: gudang berpendingin untuk barang yang disimpan pada suhu **10℃ atau lebih rendah** (makanan segar, beku).",
     "**危険品倉庫**: gudang khusus bahan berbahaya (mis. bahan mudah terbakar); dikelola ketat sesuai hukum yang berlaku.",
     "Orang yang menjalankan **usaha pergudangan (倉庫業)** harus terdaftar di **Menteri Pertanahan, Infrastruktur, Transportasi dan Pariwisata (国土交通大臣)**."])],
  "jp_bl": [("h", "倉庫の種類"), ("ul", [
     "普通倉庫は、ふつうの荷物を常温で保管する倉庫です。",
     "冷蔵倉庫は、10℃以下で荷物を保管する倉庫です。食品などを入れます。",
     "危険品倉庫は、危険な物を保管する倉庫です。",
     "倉庫業をするには、国土交通大臣の登録が必要です。"])],
  "terms": [("倉庫", "そうこ", "gudang", "倉庫で働きます。", "Bekerja di gudang."),
            ("普通倉庫", "ふつうそうこ", "gudang umum (suhu ruang)", "普通倉庫に荷物を入れます。", "Memasukkan barang ke gudang umum."),
            ("冷蔵倉庫", "れいぞうそうこ", "gudang pendingin", "冷蔵倉庫は寒いです。", "Gudang pendingin itu dingin."),
            ("危険品倉庫", "きけんひんそうこ", "gudang bahan berbahaya", "危険品倉庫に入る前に確認します。", "Memeriksa sebelum masuk gudang bahan berbahaya."),
            ("保管", "ほかん", "penyimpanan", "荷物を保管します。", "Menyimpan barang."),
            ("倉庫業", "そうこぎょう", "usaha pergudangan", "倉庫業は登録が必要です。", "Usaha pergudangan perlu pendaftaran.")],
  "qs": [TF("冷蔵倉庫は、10℃以下で荷物を保管する倉庫です。", True, "Benar: 10℃ atau lebih rendah.", "10℃以下です。", "Gudang pendingin menyimpan barang pada suhu 10℃ atau lebih rendah."),
         TF("普通倉庫は、荷物を冷凍して保管する倉庫です。", False, "Salah: gudang umum memakai suhu ruang.", "常温で保管します。", "Gudang umum menyimpan barang dengan cara dibekukan."),
         MC("Gudang untuk menyimpan barang umum pada suhu ruang disebut…", "ふつうの荷物を常温で保管する倉庫は何ですか。", ("普通倉庫", "普通倉庫"), [("冷蔵倉庫", "冷蔵倉庫"), ("危険品倉庫", "危険品倉庫"), ("野菜倉庫", "野菜倉庫")], "普通倉庫.", "普通倉庫です。"),
         MC("Untuk menjalankan usaha pergudangan, orang harus…", "倉庫業をするには、何が必要ですか。", ("登録 (国土交通大臣)", "国土交通大臣の登録"), [("tidak perlu apa-apa", "何もいらない"), ("izin sekolah", "学校の許可"), ("surat dari pasar", "市場の許可")], "Perlu pendaftaran.", "登録が必要です。")]},
 {"id": "b1s2", "pages": [1, 1], "t_id": "Peralatan dan Mesin Gudang", "t_jp": "設備・機器",
  "id_bl": [("h", "Peralatan utama"), ("ul", [
     "**パレット**: alas kayu/plastik tempat menumpuk barang agar bisa diangkat forklift.",
     "**フォークリフト**: kendaraan bergarpu untuk mengangkat dan memindahkan pallet.",
     "**ハンドリフト**: pengangkat pallet manual (didorong/ditarik tangan).",
     "**カゴ台車**: troli kerangka kawat (roll box pallet) untuk memindahkan banyak kardus.",
     "**エレベーター・垂直自動搬送機**: mengangkut barang antar lantai gudang.",
     "**コンベヤ**: ban berjalan yang memindahkan barang otomatis."])],
  "jp_bl": [("h", "主な設備・機器"), ("ul", [
     "パレットは、荷物をのせる台です。フォークリフトで運べます。",
     "フォークリフトは、荷物を持ち上げて運ぶ車です。",
     "ハンドリフトは、手でパレットを動かす道具です。",
     "カゴ台車は、たくさんの荷物を運ぶ台車です。",
     "エレベーターや垂直搬送機は、荷物を上の階や下の階に運びます。"])],
  "terms": [("パレット", "ぱれっと", "pallet", "パレットに荷物をのせます。", "Menaruh barang di pallet."),
            ("フォークリフト", "ふぉーくりふと", "forklift", "フォークリフトで運びます。", "Memindahkan dengan forklift."),
            ("ハンドリフト", "はんどりふと", "pengangkat pallet manual", "ハンドリフトを引きます。", "Menarik hand pallet."),
            ("カゴ台車", "かごだいしゃ", "troli kerangka kawat", "カゴ台車に積みます。", "Menumpuk di troli kawat."),
            ("垂直自動搬送機", "すいちょくじどうはんそうき", "pengangkut vertikal otomatis", "垂直自動搬送機で上の階へ運びます。", "Mengangkut ke lantai atas dengan pengangkut vertikal."),
            ("コンベヤ", "こんべや", "ban berjalan (konveyor)", "コンベヤで荷物が流れます。", "Barang mengalir di konveyor.")],
  "qs": [TF("パレットは、荷物をのせる台です。", True, "Benar.", "荷物をのせる台です。", "Pallet adalah alas tempat menaruh barang."),
         TF("ハンドリフトは、エンジンで動くフォークリフトの名前です。", False, "Salah: hand lift digerakkan tangan.", "手で動かします。", "Hand lift adalah nama forklift bermesin."),
         MC("Troli kerangka kawat untuk memindahkan banyak kardus disebut…", "たくさんの荷物を運ぶ、かごのような台車は何ですか。", ("カゴ台車", "カゴ台車"), [("パレット", "パレット"), ("コンベヤ", "コンベヤ"), ("エレベーター", "エレベーター")], "カゴ台車.", "カゴ台車です。"),
         MC("Alat untuk mengangkut barang antar lantai gudang…", "荷物を上の階や下の階へ運ぶ機械は何ですか。", ("垂直自動搬送機", "垂直自動搬送機"), [("ハンドリフト", "ハンドリフト"), ("パレット", "パレット"), ("カゴ台車", "カゴ台車")], "垂直自動搬送機 atau lift.", "垂直自動搬送機などです。")]},
 {"id": "b1s3", "pages": [1, 1], "t_id": "Alur Kerja: Masuk, Keluar, Picking, Tumpuk", "t_jp": "入庫・出庫・ピッキング・積付",
  "id_bl": [("h", "Alur kerja gudang"), ("ul", [
     "**入庫**: terima barang (荷受け) → cek (検品) → simpan di rak/lokasi (格納).",
     "**出庫**: ambil barang sesuai pesanan (**ピッキング**) → cek → kemas → kirim.",
     "**積付 (menumpuk di pallet)**: barang **berat di bawah**, ringan di atas; sejajarkan sudut; jangan melebihi tinggi/ beban yang ditentukan agar tidak roboh.",
     "**先入れ先出し (FIFO)**: barang yang masuk lebih dulu dikeluarkan lebih dulu; penting untuk makanan dengan tanggal kedaluwarsa.",
     "Periksa **jumlah, nomor barang, kondisi (rusak/basah), dan tanggal kedaluwarsa** saat menerima."])],
  "jp_bl": [("h", "倉庫の作業の流れ"), ("ul", [
     "入庫は、荷物を受け取り、検品をして、棚に入れる作業です。",
     "出庫は、注文の荷物を集め（ピッキング）、検品して、梱包して出す作業です。",
     "積付は、重い物を下に、軽い物を上に積みます。荷くずれしないように角をそろえます。",
     "先入れ先出しは、先に入った物から先に出すルールです。",
     "検品では、数、品番、きず、賞味期限を見ます。"])],
  "terms": [("入庫", "にゅうこ", "barang masuk gudang", "入庫の作業をします。", "Mengerjakan barang masuk."),
            ("出庫", "しゅっこ", "barang keluar gudang", "出庫の準備をします。", "Menyiapkan barang keluar."),
            ("検品", "けんぴん", "cek barang", "検品で数をかぞえます。", "Menghitung saat cek barang."),
            ("ピッキング", "ぴっきんぐ", "mengambil barang sesuai pesanan", "ピッキングをします。", "Melakukan picking."),
            ("積付", "つみつけ", "penumpukan di pallet", "パレットへ積付をします。", "Menumpuk di pallet."),
            ("先入れ先出し", "さきいれさきだし", "FIFO (masuk dulu keluar dulu)", "先入れ先出しを守ります。", "Menaati FIFO."),
            ("在庫", "ざいこ", "stok", "在庫を数えます。", "Menghitung stok."),
            ("荷くずれ", "にくずれ", "tumpukan roboh", "荷くずれを防ぎます。", "Mencegah tumpukan roboh.")],
  "qs": [TF("パレットに積むときは、重い物を上に置きます。", False, "Salah: berat di bawah.", "重い物は下です。", "Saat menumpuk di pallet, barang berat ditaruh di atas."),
         TF("先入れ先出しは、先に入った荷物から先に出すルールです。", True, "Benar.", "先に入った物から出します。", "FIFO artinya barang yang masuk lebih dulu keluar lebih dulu."),
         MC("Pekerjaan mengambil barang sesuai pesanan disebut…", "注文の荷物を集める作業は何ですか。", ("ピッキング", "ピッキング"), [("入庫", "入庫"), ("積付", "積付"), ("棚卸", "棚卸")], "ピッキング.", "ピッキングです。"),
         MC("Urutan kerja barang masuk yang benar…", "入庫の流れで正しいものはどれですか。", ("terima → cek → simpan", "荷受け→検品→格納"), [("simpan → terima → cek", "格納→荷受け→検品"), ("kirim → cek → terima", "出荷→検品→荷受け"), ("cek → kirim → simpan", "検品→出荷→格納")], "Terima, cek, simpan.", "荷受け→検品→格納です。"),
         MC("Hal yang diperiksa saat cek barang makanan…", "食品の検品で必ず見るものはどれですか。", ("数・品番・きず・賞味期限", "数、品番、きず、賞味期限"), [("warna truk saja", "トラックの色だけ"), ("nama sopir saja", "運転手の名前だけ"), ("cuaca", "天気")], "Jumlah, nomor, kondisi, kedaluwarsa.", "数、品番、きず、賞味期限を見ます。")]},
 {"id": "b1s4", "pages": [1, 1], "t_id": "Satuan dan Simbol Penanganan (Care Mark)", "t_jp": "単位とケアマーク",
  "id_bl": [("h", "Satuan"), ("ul", [
     "**1 t (ton) = 1.000 kg**; **1 kg = 1.000 g**; **1 m = 100 cm**; **1 m³ = 1.000 L**.",
     "Hitungan barang: **バラ** (satuan/pieces), **ケース** (dus/karton isi banyak). Contoh: 1 ケース = 12 個 → 5 ケース = 60 個.",
     "Barang **berat** (kg) dan **volume** (m³) dipakai untuk menghitung muatan."]),
    ("h", "Care mark (simbol penanganan)"), ("ul", [
     "**天地無用**: jangan dibalik; ujung panah menunjuk ke atas.",
     "**ワレモノ注意 (割れ物)**: mudah pecah, tangani hati-hati.",
     "**水ぬれ防止**: jaga agar tidak basah.",
     "**手かぎ無用**: jangan memakai pengait tangan.",
     "**積み重ね段数制限**: tumpukan tidak boleh melebihi jumlah tingkat yang ditunjukkan."])],
  "jp_bl": [("h", "単位"), ("ul", [
     "1トン（t）は1,000キログラム（kg）です。1メートルは100センチです。",
     "ケースとバラがあります。1ケース12個なら、5ケースは60個です。"]),
    ("h", "ケアマーク"), ("ul", [
     "天地無用：上下をさかさまにしてはいけません。",
     "ワレモノ注意：われやすいので、気をつけます。",
     "水ぬれ防止：水にぬらしてはいけません。",
     "手かぎ無用：手かぎを使ってはいけません。",
     "積み重ね段数制限：決められた段までしか積めません。"])],
  "terms": [("単位", "たんい", "satuan", "単位に気をつけます。", "Memperhatikan satuan."),
            ("換算", "かんさん", "konversi", "トンをキロに換算します。", "Mengonversi ton ke kilo."),
            ("ケース", "けーす", "dus/karton (isi banyak)", "ケースで数えます。", "Menghitung per dus."),
            ("バラ", "ばら", "satuan lepas", "バラで出荷します。", "Mengirim per satuan."),
            ("天地無用", "てんちむよう", "jangan dibalik (this side up)", "天地無用のマークを見ます。", "Melihat tanda jangan dibalik."),
            ("水ぬれ防止", "みずぬれぼうし", "jaga agar tidak basah", "水ぬれ防止の荷物です。", "Barang yang harus dijaga dari basah."),
            ("手かぎ無用", "てかぎむよう", "jangan pakai pengait tangan", "手かぎ無用の荷物です。", "Barang yang tidak boleh diberi pengait."),
            ("割れ物", "われもの", "barang pecah belah", "割れ物は気をつけて持ちます。", "Memegang barang pecah belah dengan hati-hati.")],
  "qs": [TF("1トンは1,000キログラムです。", True, "Benar.", "1,000kgです。", "1 ton sama dengan 1.000 kilogram."),
         TF("「天地無用」のマークは、荷物をさかさまにしてよいという意味です。", False, "Salah: jangan dibalik.", "さかさまにしてはいけません。", "Tanda 天地無用 berarti boleh membalik barang."),
         MC("1 dus isi 12 buah. 5 dus = … buah.", "1ケース12個です。5ケースは何個ですか。", ("60個", "60個"), [("17個", "17個"), ("48個", "48個"), ("72個", "72個")], "12×5=60.", "12×5で60個です。"),
         MC("Tanda yang berarti 'jaga agar tidak basah'…", "「水にぬらしてはいけない」を表すマークはどれですか。", ("水ぬれ防止", "水ぬれ防止"), [("天地無用", "天地無用"), ("手かぎ無用", "手かぎ無用"), ("ワレモノ注意", "ワレモノ注意")], "水ぬれ防止.", "水ぬれ防止です。"),
         MC("3 ton = … kg", "3トンは何キログラムですか。", ("3.000 kg", "3,000kg"), [("30 kg", "30kg"), ("300 kg", "300kg"), ("30.000 kg", "30,000kg")], "1 t = 1.000 kg.", "1トンは1,000kgです。")]},
]
SUBS["bab2"] = [
 {"id": "b2s1", "pages": [1, 1], "t_id": "Manajemen Lokasi dan Sistem Gudang", "t_jp": "ロケーション管理",
  "id_bl": [("h", "Lokasi barang"), ("ul", [
     "**ロケーション (lokasi)**: alamat tempat barang disimpan di rak, mis. kode lajur–bagian–tingkat.",
     "Dengan lokasi, barang yang dicari bisa ditemukan cepat dan salah ambil berkurang.",
     "**固定ロケーション**: satu jenis barang selalu di tempat yang sama. **フリーロケーション**: barang boleh ditaruh di tempat kosong, lokasi dicatat di sistem.",
     "**WMS (倉庫管理システム)**: sistem komputer yang mencatat stok dan lokasi barang.",
     "**ハンディターミナル** dan **バーコード**: membaca kode barang agar data akurat.",
     "**棚卸**: menghitung stok nyata dan mencocokkannya dengan data."])],
  "jp_bl": [("h", "ロケーション管理"), ("ul", [
     "ロケーションは、荷物を置く場所の番号です。",
     "ロケーションがあると、荷物をすぐ見つけられて、まちがいが減ります。",
     "固定ロケーションは、同じ荷物をいつも同じ場所に置きます。フリーロケーションは、空いている場所に置いて、システムに記録します。",
     "倉庫管理システム（WMS）は、在庫と場所を管理するシステムです。",
     "ハンディターミナルでバーコードを読むと、データが正確になります。",
     "棚卸は、実際の在庫を数えて、データと合わせる作業です。"])],
  "terms": [("ロケーション", "ろけーしょん", "lokasi penyimpanan (alamat rak)", "ロケーションを確認します。", "Memeriksa lokasi."),
            ("固定ロケーション", "こていろけーしょん", "lokasi tetap", "固定ロケーションで管理します。", "Mengelola dengan lokasi tetap."),
            ("フリーロケーション", "ふりーろけーしょん", "lokasi bebas", "フリーロケーションは空いた所に置きます。", "Lokasi bebas menaruh di tempat kosong."),
            ("倉庫管理システム", "そうこかんりしすてむ", "sistem manajemen gudang (WMS)", "倉庫管理システムに入力します。", "Menginput ke WMS."),
            ("ハンディターミナル", "はんでぃたーみなる", "terminal genggam (pemindai)", "ハンディターミナルで読みます。", "Memindai dengan terminal genggam."),
            ("バーコード", "ばーこーど", "barcode", "バーコードを読みます。", "Membaca barcode."),
            ("棚卸", "たなおろし", "stok opname", "月末に棚卸をします。", "Melakukan stok opname akhir bulan.")],
  "qs": [TF("ロケーションは、荷物を置く場所の番号です。", True, "Benar.", "置く場所の番号です。", "Lokasi adalah nomor tempat menaruh barang."),
         TF("棚卸は、荷物を出荷する作業です。", False, "Salah: stok opname = menghitung stok.", "在庫を数える作業です。", "Tanadoroshi adalah pekerjaan mengirim barang."),
         MC("Sistem yang mencatat stok dan lokasi barang…", "在庫と場所を管理するシステムは何ですか。", ("倉庫管理システム (WMS)", "倉庫管理システム"), [("ハンドリフト", "ハンドリフト"), ("コンベヤ", "コンベヤ"), ("ケアマーク", "ケアマーク")], "WMS.", "倉庫管理システムです。"),
         MC("Alat untuk membaca barcode barang…", "バーコードを読む道具は何ですか。", ("ハンディターミナル", "ハンディターミナル"), [("パレット", "パレット"), ("カゴ台車", "カゴ台車"), ("フォークリフト", "フォークリフト")], "Terminal genggam.", "ハンディターミナルです。")]},
 {"id": "b2s2", "pages": [1, 1], "t_id": "Cek Barang dan Pengemasan", "t_jp": "検品・梱包",
  "id_bl": [("h", "Cek barang (検品)"), ("ul", [
     "Cara cek: **目視** (lihat langsung), **バーコード** (pindai), **重量** (timbang).",
     "Yang dicek: jumlah, nomor barang, kerusakan/kotor, tanggal kedaluwarsa, dan label.",
     "Jika ada kelainan, **jangan memutuskan sendiri**: laporkan ke atasan."]),
    ("h", "Pengemasan (梱包)"), ("ul", [
     "Bahan: **段ボール** (kardus), **緩衝材** (pelindung, mis. bubble wrap), **テープ**, **ストレッチフィルム** (pembungkus plastik), **結束バンド**.",
     "Isi celah dengan pelindung agar barang tidak bergeser; barang berat di bawah.",
     "Tempel **ラベル** (label alamat/isi) pada tempat yang mudah dilihat.",
     "**流通加工**: pekerjaan tambahan seperti pasang label harga, kemas campur, atau pasang kemasan."])],
  "jp_bl": [("h", "検品"), ("ul", [
     "検品の方法には、目で見る、バーコードを読む、重さをはかる方法があります。",
     "数、品番、きず、よごれ、賞味期限、ラベルを確認します。",
     "おかしいと思ったら、自分で決めないで、上の人に報告します。"]),
    ("h", "梱包"), ("ul", [
     "段ボール、緩衝材、テープ、ストレッチフィルム、結束バンドを使います。",
     "すき間を緩衝材でうめて、荷物が動かないようにします。重い物は下にします。",
     "ラベルは見やすい所にはります。",
     "流通加工は、値札付け、詰め合わせなどの追加の作業です。"])],
  "terms": [("梱包", "こんぽう", "pengemasan", "梱包をします。", "Mengemas."),
            ("緩衝材", "かんしょうざい", "bahan pelindung (bubble wrap dsb.)", "緩衝材を入れます。", "Memasukkan pelindung."),
            ("段ボール", "だんぼーる", "kardus", "段ボールに入れます。", "Memasukkan ke kardus."),
            ("ストレッチフィルム", "すとれっちふぃるむ", "film plastik pembungkus pallet", "ストレッチフィルムを巻きます。", "Melilitkan stretch film."),
            ("ラベル", "らべる", "label", "ラベルをはります。", "Menempel label."),
            ("流通加工", "りゅうつうかこう", "pengolahan distribusi", "流通加工で値札をつけます。", "Memasang label harga sebagai pengolahan distribusi."),
            ("報告", "ほうこく", "melapor", "上の人に報告します。", "Melapor ke atasan."),
            ("重量", "じゅうりょう", "berat", "重量をはかります。", "Menimbang berat.")],
  "qs": [TF("検品でおかしいところを見つけたら、自分で決めて作業を続けます。", False, "Salah: laporkan ke atasan.", "報告します。", "Jika menemukan kelainan saat cek, putuskan sendiri dan lanjutkan kerja."),
         TF("梱包では、すき間に緩衝材を入れて荷物が動かないようにします。", True, "Benar.", "動かないようにします。", "Saat mengemas, celah diisi pelindung agar barang tidak bergeser."),
         MC("Plastik pembungkus yang dililit di tumpukan pallet…", "パレットの荷物にぐるぐる巻くフィルムは何ですか。", ("ストレッチフィルム", "ストレッチフィルム"), [("ラベル", "ラベル"), ("結束バンド", "結束バンド"), ("段ボール", "段ボール")], "Stretch film.", "ストレッチフィルムです。"),
         MC("Contoh pekerjaan 流通加工…", "流通加工の例はどれですか。", ("memasang label harga", "値札付け"), [("mengemudi truk", "トラックの運転"), ("membangun gudang", "倉庫の建設"), ("membeli barang", "仕入れ")], "Pasang label harga.", "値札付けなどです。")]},
 {"id": "b2s3", "pages": [1, 1], "t_id": "Menghitung Waktu dan Jumlah Orang", "t_jp": "作業時間・人数の計算",
  "id_bl": [("h", "Rumus dasar"), ("ul", [
     "**Waktu kerja = jumlah pekerjaan ÷ (kemampuan per jam × jumlah orang)**.",
     "**Jumlah orang = jumlah pekerjaan ÷ (kemampuan per jam × jam kerja)**.",
     "Contoh: 240 dus, 1 orang 60 dus/jam, selesai dalam 2 jam → 240 ÷ (60×2) = **2 orang**.",
     "Contoh: 300 dus, 3 orang, 50 dus/jam per orang → 300 ÷ (50×3) = **2 jam**."])],
  "jp_bl": [("h", "計算の基本"), ("ul", [
     "作業時間＝作業量÷（1人1時間の作業量×人数）です。",
     "人数＝作業量÷（1人1時間の作業量×時間）です。",
     "例：240ケースを1人が1時間に60ケースで、2時間で終わらせるなら、240÷（60×2）で2人です。",
     "例：300ケースを3人で、1人1時間50ケースなら、300÷（50×3）で2時間です。"])],
  "terms": [("作業量", "さぎょうりょう", "jumlah pekerjaan", "作業量を計算します。", "Menghitung jumlah pekerjaan."),
            ("作業時間", "さぎょうじかん", "waktu kerja", "作業時間を決めます。", "Menentukan waktu kerja."),
            ("人数", "にんずう", "jumlah orang", "必要な人数を計算します。", "Menghitung jumlah orang yang dibutuhkan."),
            ("所要時間", "しょようじかん", "waktu yang dibutuhkan", "所要時間を考えます。", "Memperkirakan waktu yang dibutuhkan."),
            ("割る", "わる", "membagi", "全部の数を人数で割ります。", "Membagi total dengan jumlah orang."),
            ("終わる", "おわる", "selesai", "5時に終わります。", "Selesai jam 5.")],
  "qs": [MC("480 dus, 1 orang 60 dus/jam, selesai dalam 4 jam. Berapa orang?", "480ケースを、1人1時間60ケースで4時間で終えるには、何人必要ですか。", ("2 orang", "2人"), [("1 orang", "1人"), ("4 orang", "4人"), ("8 orang", "8人")], "480÷(60×4)=2.", "480÷（60×4）＝2人です。"),
         MC("600 dus, 3 orang, 100 dus/jam per orang. Berapa jam?", "600ケースを3人で、1人1時間100ケースなら、何時間かかりますか。", ("2 jam", "2時間"), [("1 jam", "1時間"), ("3 jam", "3時間"), ("6 jam", "6時間")], "600÷(100×3)=2.", "600÷（100×3）＝2時間です。"),
         TF("作業時間は、作業量を1時間の作業量で割って考えます。", True, "Benar (dengan memperhitungkan jumlah orang).", "人数も考えます。", "Waktu kerja dihitung dengan membagi jumlah pekerjaan dengan kemampuan kerja per jam."),
         MC("120 dus, 2 orang, 30 dus/jam per orang. Berapa jam?", "120ケースを2人で、1人1時間30ケースなら、何時間ですか。", ("2 jam", "2時間"), [("1 jam", "1時間"), ("4 jam", "4時間"), ("6 jam", "6時間")], "120÷(30×2)=2.", "120÷（30×2）＝2時間です。")]},
]
SUBS["bab3"] = [
 {"id": "b3s1", "pages": [1, 1], "t_id": "Kesehatan Diri dan Alat Pelindung Diri", "t_jp": "健康管理・保護具",
  "id_bl": [("h", "Kesehatan"), ("ul", [
     "Lapor jika tidak sehat; jangan memaksa bekerja.",
     "Saat angkat barang berat, **turunkan pinggang** dan jaga punggung agar tidak sakit pinggang (腰痛).",
     "Cuaca panas: minum air teratur untuk mencegah **熱中症**. Gudang pendingin: pakai **防寒着** agar tidak kedinginan."]),
    ("h", "Alat pelindung diri (保護具)"), ("ul", [
     "**ヘルメット** (helm), **安全靴** (sepatu pengaman), **手袋** (sarung tangan), **保護メガネ**, **マスク**.",
     "Pakai APD sesuai pekerjaan; rusak atau tidak cocok → laporkan dan ganti."])],
  "jp_bl": [("h", "健康管理"), ("ul", [
     "体の調子が悪いときは、がまんしないで報告します。",
     "重い物を持つときは、腰を落とします。腰痛を防ぎます。",
     "暑いときは水を飲んで、熱中症を防ぎます。冷蔵倉庫では防寒着を着ます。"]),
    ("h", "保護具"), ("ul", [
     "ヘルメット、安全靴、手袋、保護メガネ、マスクなどを使います。",
     "保護具がこわれたら、報告して交換します。"])],
  "terms": [("健康", "けんこう", "kesehatan", "健康に気をつけます。", "Menjaga kesehatan."),
            ("保護具", "ほごぐ", "alat pelindung diri", "保護具をつけます。", "Memakai APD."),
            ("安全靴", "あんぜんぐつ", "sepatu pengaman", "安全靴をはきます。", "Memakai sepatu pengaman."),
            ("ヘルメット", "へるめっと", "helm", "ヘルメットをかぶります。", "Memakai helm."),
            ("熱中症", "ねっちゅうしょう", "sengatan panas", "熱中症に気をつけます。", "Waspada sengatan panas."),
            ("腰痛", "ようつう", "sakit pinggang", "腰痛を防ぎます。", "Mencegah sakit pinggang."),
            ("防寒着", "ぼうかんぎ", "pakaian anti dingin", "冷蔵倉庫では防寒着を着ます。", "Memakai pakaian anti dingin di gudang pendingin.")],
  "qs": [TF("体の調子が悪いときは、がまんして仕事を続けます。", False, "Salah: laporkan.", "報告します。", "Saat tidak enak badan, tahan saja dan lanjutkan kerja."),
         TF("重い物を持つときは、腰を落として持ちます。", True, "Benar.", "腰を落とします。", "Saat mengangkat barang berat, turunkan pinggang."),
         MC("Apa yang dipakai di kaki untuk melindungi dari barang jatuh?", "荷物が足に落ちても守ってくれるものは何ですか。", ("安全靴", "安全靴"), [("サンダル", "サンダル"), ("スリッパ", "スリッパ"), ("くつ下だけ", "くつ下だけ")], "Sepatu pengaman.", "安全靴です。"),
         MC("Di gudang pendingin, sebaiknya memakai…", "冷蔵倉庫で着るものはどれですか。", ("防寒着", "防寒着"), [("水着", "水着"), ("Tシャツだけ", "Tシャツだけ"), ("浴衣", "浴衣")], "Pakaian anti dingin.", "防寒着です。")]},
 {"id": "b3s2", "pages": [1, 1], "t_id": "Tindakan Berbahaya dan Pencegahan Kecelakaan", "t_jp": "危険な行動・労災防止",
  "id_bl": [("h", "Keselamatan forklift dan area kerja"), ("ul", [
     "**Jangan naik di atas garpu forklift** dan jangan berdiri di bawah barang yang terangkat.",
     "Saat membawa barang, **turunkan garpu rendah**, perhatikan sekitar, patuhi batas kecepatan, utamakan pejalan kaki.",
     "Mengemudi forklift butuh pelatihan: beban maks **1 ton ke atas = 技能講習**, **di bawah 1 ton = 特別教育**.",
     "**Jangan berlari** di gudang; hati-hati pada lantai basah atau yang tidak rata (risiko **転倒 / terpeleset**).",
     "Hati-hati **挟まれ (terjepit)** dan **荷くずれ (tumpukan roboh)**; jangan menumpuk melebihi batas.",
     "**ヒヤリハット**: kejadian nyaris celaka; laporkan agar tidak terulang."])],
  "jp_bl": [("h", "フォークリフトと作業場の安全"), ("ul", [
     "フォークリフトのツメに乗ってはいけません。持ち上げた荷物の下に入ってもいけません。",
     "運ぶときはツメを低くして、まわりを見て、スピードを守ります。歩く人が先です。",
     "フォークリフトの運転には資格が必要です。最大荷重1トン以上は技能講習、1トン未満は特別教育です。",
     "倉庫の中を走ってはいけません。ぬれた床や段差で転ばないように気をつけます。",
     "はさまれや荷くずれに気をつけます。",
     "ヒヤリハットは、事故になりそうだった出来事です。報告します。"])],
  "terms": [("危険", "きけん", "bahaya", "危険なので入らないでください。", "Berbahaya, jangan masuk."),
            ("労災", "ろうさい", "kecelakaan kerja", "労災を防ぎます。", "Mencegah kecelakaan kerja."),
            ("転倒", "てんとう", "terpeleset/jatuh", "転倒に注意します。", "Waspada terpeleset."),
            ("挟まれ", "はさまれ", "terjepit", "挟まれに注意します。", "Waspada terjepit."),
            ("ヒヤリハット", "ひやりはっと", "nyaris celaka (near miss)", "ヒヤリハットを報告します。", "Melapor near miss."),
            ("技能講習", "ぎのうこうしゅう", "pelatihan keterampilan (berlisensi)", "技能講習を受けます。", "Mengikuti pelatihan keterampilan."),
            ("特別教育", "とくべつきょういく", "pelatihan khusus", "特別教育を受けます。", "Mengikuti pelatihan khusus."),
            ("運転", "うんてん", "mengemudi/mengoperasikan", "フォークリフトを運転します。", "Mengoperasikan forklift.")],
  "qs": [TF("フォークリフトのツメに人が乗ってもよいです。", False, "Salah: dilarang.", "乗ってはいけません。", "Orang boleh naik di garpu forklift."),
         TF("持ち上げた荷物の下に入ってはいけません。", True, "Benar.", "入ってはいけません。", "Dilarang masuk ke bawah barang yang terangkat."),
         TF("倉庫の中は、急いで走ってもよいです。", False, "Salah: jangan berlari.", "走ってはいけません。", "Di dalam gudang boleh berlari terburu-buru."),
         MC("Kejadian nyaris celaka yang dilaporkan disebut…", "事故になりそうだった出来事は何ですか。", ("ヒヤリハット", "ヒヤリハット"), [("棚卸", "棚卸"), ("入庫", "入庫"), ("先入れ先出し", "先入れ先出し")], "Hiyari-hatto.", "ヒヤリハットです。"),
         MC("Saat membawa barang dengan forklift, garpu sebaiknya…", "フォークリフトで運ぶとき、ツメはどうしますか。", ("rendah", "低くする"), [("setinggi-tingginya", "いちばん高くする"), ("terserah", "どれでもよい"), ("diturunkan lalu ditinggal", "下ろして放置する")], "Rendah agar stabil.", "低くします。"),
         MC("Forklift berbeban maks 1 ton ke atas butuh…", "最大荷重1トン以上のフォークリフトに必要なものは何ですか。", ("技能講習", "技能講習"), [("tidak perlu", "何もいらない"), ("SIM mobil saja", "車の免許だけ"), ("surat dokter", "医者の手紙")], "Pelatihan keterampilan.", "技能講習が必要です。")]},
 {"id": "b3s3", "pages": [1, 1], "t_id": "Tanda Darurat dan Prosedur Kerja", "t_jp": "防災サイン・作業手順",
  "id_bl": [("h", "Tanda darurat"), ("ul", [
     "**Warna aman**: **hijau** = aman/evakuasi (pintu darurat), **merah** = larangan/pemadam api/stop, **kuning** = hati-hati, **biru** = perintah/wajib.",
     "Kenali lokasi **非常口 (pintu darurat)** dan **消火器 (alat pemadam)** sejak awal.",
     "Saat kebakaran: **beri tahu orang sekitar → hubungi → evakuasi** dengan tenang; jangan memakai lift."]),
    ("h", "Prosedur kerja"), ("ul", [
     "Ikuti **作業手順書 (prosedur kerja tertulis)**; jangan mengubah cara kerja sendiri.",
     "**報告・連絡・相談 (ほう・れん・そう)**: lapor, kabari, konsultasi.",
     "**5S**: 整理, 整頓, 清掃, 清潔, しつけ — menjaga tempat kerja rapi dan aman."])],
  "jp_bl": [("h", "防災サイン"), ("ul", [
     "安全色：緑は安全・避難、赤は禁止・防火・停止、黄色は注意、青は指示です。",
     "非常口と消火器の場所を、はじめに確認します。",
     "火事のときは、まわりに知らせて、連絡して、落ち着いて避難します。エレベーターは使いません。"]),
    ("h", "作業手順"), ("ul", [
     "作業手順書のとおりに作業します。自分の考えで手順を変えてはいけません。",
     "報告・連絡・相談を大切にします。",
     "5Sは、整理、整頓、清掃、清潔、しつけです。"])],
  "terms": [("非常口", "ひじょうぐち", "pintu darurat", "非常口の場所を確認します。", "Memeriksa lokasi pintu darurat."),
            ("消火器", "しょうかき", "alat pemadam api", "消火器を使います。", "Memakai alat pemadam."),
            ("避難", "ひなん", "evakuasi", "落ち着いて避難します。", "Evakuasi dengan tenang."),
            ("作業手順書", "さぎょうてじゅんしょ", "prosedur kerja tertulis", "作業手順書を読みます。", "Membaca prosedur kerja."),
            ("安全色", "あんぜんしょく", "warna keselamatan", "安全色の意味を覚えます。", "Menghafal arti warna keselamatan."),
            ("整理整頓", "せいりせいとん", "merapikan dan menata", "整理整頓をします。", "Merapikan dan menata.")],
  "qs": [TF("非常口のサインは、緑色です。", True, "Benar: hijau = evakuasi.", "緑は避難です。", "Tanda pintu darurat berwarna hijau."),
         TF("火事のときは、エレベーターを使って避難します。", False, "Salah: jangan pakai lift.", "エレベーターは使いません。", "Saat kebakaran, evakuasi memakai lift."),
         MC("Warna keselamatan 'kuning' berarti…", "安全色の黄色は何を表しますか。", ("hati-hati", "注意"), [("evakuasi", "避難"), ("perintah", "指示"), ("larangan", "禁止")], "Kuning = hati-hati.", "黄色は注意です。"),
         MC("Hal yang harus diikuti saat bekerja…", "作業するときに、したがうものはどれですか。", ("作業手順書", "作業手順書"), [("kemauan sendiri", "自分の好み"), ("kabar angin", "うわさ"), ("tebakan", "勘")], "Prosedur kerja tertulis.", "作業手順書です。"),
         MC("Arti 報連相 …", "「報連相」は何ですか。", ("lapor, kabari, konsultasi", "報告・連絡・相談"), [("belanja", "買い物"), ("istirahat", "休み"), ("makan", "食事")], "Hou-ren-sou.", "報告・連絡・相談です。")]},
]

# ---- tambahan (v2)
SUBS["bab1"].append(
 {"id": "b1s5", "pages": [1, 1], "t_id": "Cara Menyimpan dan Penataan Rak", "t_jp": "保管方法・棚",
  "id_bl": [("h", "Cara menyimpan"), ("ul", [
     "**平積み**: menumpuk barang langsung di lantai/pallet. **棚保管**: menyimpan di rak bertingkat.",
     "**パレットラック**: rak khusus untuk pallet yang dimuat forklift.",
     "Barang **berat di rak bawah**, ringan di atas; barang yang sering diambil ditaruh di tempat **mudah dijangkau**.",
     "Jangan menghalangi **jalur kerja**, **pintu darurat**, dan **alat pemadam**.",
     "Makanan dijaga **suhu**-nya sesuai jenis (suhu ruang / dingin / beku).",
     "Jangan mencampur barang berbahaya dengan barang lain."])],
  "jp_bl": [("h", "保管の方法"), ("ul", [
     "平積みは、床やパレットに直接積む保管方法です。棚保管は、棚に入れて保管する方法です。",
     "パレットラックは、パレットごと入れる棚です。",
     "重い物は下の棚に、軽い物は上の棚に置きます。よく使う物は取りやすい場所に置きます。",
     "通路、非常口、消火器の前に荷物を置いてはいけません。",
     "食品は、種類に合わせて温度を守ります。",
     "危険な物は、ほかの物と一緒に置きません。"])],
  "terms": [("平積み", "ひらづみ", "ditumpuk langsung (lantai/pallet)", "荷物を平積みします。", "Menumpuk barang langsung."),
            ("棚", "たな", "rak", "棚に入れます。", "Memasukkan ke rak."),
            ("通路", "つうろ", "lorong/jalur", "通路をあけておきます。", "Mengosongkan lorong."),
            ("温度管理", "おんどかんり", "pengelolaan suhu", "温度管理をします。", "Mengelola suhu."),
            ("格納", "かくのう", "menyimpan ke tempatnya", "棚に格納します。", "Menyimpan ke rak."),
            ("常温", "じょうおん", "suhu ruang", "常温で保管します。", "Menyimpan pada suhu ruang."),
            ("冷凍", "れいとう", "beku", "冷凍の荷物を運びます。", "Membawa barang beku.")],
  "qs": [TF("非常口の前に、荷物を置いてもよいです。", False, "Salah: jangan menghalangi.", "置いてはいけません。", "Boleh menaruh barang di depan pintu darurat."),
         TF("重い荷物は、棚の下の段に置きます。", True, "Benar.", "重い物は下です。", "Barang berat ditaruh di tingkat rak bawah."),
         MC("Rak untuk pallet yang dimuat forklift…", "パレットごと入れる棚は何ですか。", ("パレットラック", "パレットラック"), [("カゴ台車", "カゴ台車"), ("コンベヤ", "コンベヤ"), ("ハンドリフト", "ハンドリフト")], "Pallet rack.", "パレットラックです。"),
         MC("Menyimpan di tempat yang sesuai (ke rak) disebut…", "荷物を決まった場所にしまうことは何ですか。", ("格納", "格納"), [("出庫", "出庫"), ("検品", "検品"), ("搬出", "搬出")], "Kakunou.", "格納です。")]})
SUBS["bab2"].append(
 {"id": "b2s4", "pages": [1, 1], "t_id": "Alat Kerja Pengolahan Distribusi", "t_jp": "流通加工の機器",
  "id_bl": [("h", "Nama dan fungsi alat"), ("ul", [
     "**ラベルプリンター**: mencetak label (alamat, kode barang).",
     "**台はかり**: timbangan lantai/meja untuk menimbang barang.",
     "**梱包機・結束機**: mesin pengikat/pengemas.",
     "**ピッキングカート**: troli untuk membawa barang yang diambil.",
     "**ハンディターミナル**: pemindai genggam (sudah dipelajari).",
     "**フォークリフト・ハンドリフト**: untuk memindahkan pallet (sudah dipelajari)."])],
  "jp_bl": [("h", "機器の名前とはたらき"), ("ul", [
     "ラベルプリンターは、ラベルを印刷する機械です。",
     "台はかりは、荷物の重さをはかる道具です。",
     "梱包機や結束機は、荷物をしばったり包んだりする機械です。",
     "ピッキングカートは、集めた荷物を運ぶカートです。"])],
  "terms": [("ラベルプリンター", "らべるぷりんたー", "printer label", "ラベルプリンターで印刷します。", "Mencetak dengan printer label."),
            ("台はかり", "だいはかり", "timbangan lantai/meja", "台はかりで重さをはかります。", "Menimbang dengan timbangan."),
            ("結束機", "けっそくき", "mesin pengikat", "結束機でしばります。", "Mengikat dengan mesin pengikat."),
            ("ピッキングカート", "ぴっきんぐかーと", "troli picking", "ピッキングカートに荷物をのせます。", "Menaruh barang di troli picking."),
            ("印刷", "いんさつ", "mencetak", "ラベルを印刷します。", "Mencetak label."),
            ("はかる", "はかる", "menimbang/mengukur", "重さをはかります。", "Menimbang berat.")],
  "qs": [MC("Alat untuk menimbang barang…", "荷物の重さをはかる道具は何ですか。", ("台はかり", "台はかり"), [("ラベルプリンター", "ラベルプリンター"), ("結束機", "結束機"), ("パレット", "パレット")], "Timbangan.", "台はかりです。"),
         MC("Mesin untuk mencetak label…", "ラベルを印刷する機械は何ですか。", ("ラベルプリンター", "ラベルプリンター"), [("台はかり", "台はかり"), ("コンベヤ", "コンベヤ"), ("カゴ台車", "カゴ台車")], "Printer label.", "ラベルプリンターです。"),
         TF("ピッキングカートは、集めた荷物を運ぶカートです。", True, "Benar.", "集めた荷物を運びます。", "Picking cart adalah troli untuk membawa barang yang sudah dikumpulkan.")]})
SUBS["bab3"].append(
 {"id": "b3s4", "pages": [1, 1], "t_id": "Kerja di Gudang Pendingin dan Barang Berat", "t_jp": "冷蔵倉庫・重い荷物の作業",
  "id_bl": [("h", "Gudang pendingin"), ("ul", [
     "Pakai **防寒着** dan sarung tangan hangat; jangan terlalu lama di dalam, **istirahat teratur**.",
     "Lantai bisa **licin** karena es/embun; jalan pelan.",
     "Pintu gudang pendingin **jangan dibiarkan terbuka** agar suhu terjaga.",
     "Jangan terkunci di dalam: tahu cara membuka pintu dari dalam."]),
    ("h", "Barang berat"), ("ul", [
     "Jika terlalu berat, **minta bantuan** atau pakai alat; jangan memaksa.",
     "Angkat dengan **pinggang turun**, barang dekat badan; jangan memutar badan sambil mengangkat.",
     "Jangan menumpuk melebihi tinggi yang ditentukan."])],
  "jp_bl": [("h", "冷蔵倉庫"), ("ul", [
     "防寒着と暖かい手袋を使います。長くいないで、定期的に休みます。",
     "氷や水で床がすべりやすいので、ゆっくり歩きます。",
     "冷蔵倉庫のドアは開けっぱなしにしません。",
     "中に閉じこめられないように、中からドアを開ける方法を知っておきます。"]),
    ("h", "重い荷物"), ("ul", [
     "重すぎるときは、人にたのむか、道具を使います。",
     "腰を落として、荷物を体に近づけて持ちます。体をひねらないようにします。"])],
  "terms": [("すべる", "すべる", "licin/tergelincir", "床がすべります。", "Lantai licin."),
            ("開けっぱなし", "あけっぱなし", "dibiarkan terbuka", "ドアを開けっぱなしにしません。", "Tidak membiarkan pintu terbuka."),
            ("ひねる", "ひねる", "memutar (badan)", "体をひねらないでください。", "Jangan memutar badan."),
            ("休憩", "きゅうけい", "istirahat", "休憩を取ります。", "Beristirahat."),
            ("手伝い", "てつだい", "bantuan", "手伝いをたのみます。", "Meminta bantuan."),
            ("閉じこめられる", "とじこめられる", "terkunci di dalam", "閉じこめられないように気をつけます。", "Berhati-hati agar tidak terkunci di dalam.")],
  "qs": [TF("冷蔵倉庫のドアは、開けっぱなしにしてよいです。", False, "Salah: tutup agar suhu terjaga.", "開けっぱなしにしません。", "Pintu gudang pendingin boleh dibiarkan terbuka."),
         TF("重すぎる荷物は、無理に一人で持たないで、手伝いをたのみます。", True, "Benar.", "手伝いをたのみます。", "Barang yang terlalu berat jangan dipaksakan sendiri; minta bantuan."),
         MC("Saat mengangkat barang berat, hindari…", "重い荷物を持つとき、してはいけないことはどれですか。", ("memutar badan", "体をひねること"), [("menurunkan pinggang", "腰を落とすこと"), ("memegang dekat badan", "体に近づけること"), ("minta bantuan", "手伝いをたのむこと")], "Jangan memutar badan.", "体をひねってはいけません。"),
         MC("Lantai gudang pendingin mudah…", "冷蔵倉庫の床は、どうなりやすいですか。", ("licin", "すべりやすい"), [("lengket", "ベタベタする"), ("panas", "あつくなる"), ("berpasir", "すなだらけ")], "Licin karena es/embun.", "すべりやすいです。")]})

BOOK_PAGES = 16

# ---- soal tambahan (audit 2026-11-18) — buatan Shirose dari 試験基準/運用方針 MLIT; perlu review ahli
def _add(bab, sid, qs):
    for s in SUBS[bab]:
        if s["id"] == sid: s["qs"] += qs; return
    raise KeyError(sid)
def _opt(a, b=None): return (a, b or a)
_add("bab1", "b1s1", [
 TF("冷蔵倉庫は、10℃以下で保管する荷物のための倉庫です。", True, "Benar: gudang berpendingin untuk barang pada suhu 10℃ atau lebih rendah.", "10℃以下です。", "Gudang berpendingin untuk barang yang disimpan pada suhu 10℃ atau lebih rendah."),
 TF("普通倉庫には、危険な薬品だけを入れます。", False, "Salah: gudang umum untuk barang umum; bahan berbahaya di gudang khusus.", "危険品倉庫が別にあります。", "Gudang umum hanya untuk bahan kimia berbahaya."),
 TF("倉庫業を始めるには、国土交通大臣の登録が必要です。", True, "Benar: usaha pergudangan harus terdaftar.", "登録が必要です。", "Usaha pergudangan harus terdaftar pada Menteri Pertanahan, Infrastruktur, Transportasi dan Pariwisata."),
 MC("Gudang khusus untuk bahan mudah terbakar disebut…", "燃えやすい薬品などを保管する倉庫はどれですか。", _opt("危険品倉庫", "きけんひんそうこ"), [_opt("普通倉庫", "ふつうそうこ"), _opt("冷蔵倉庫", "れいぞうそうこ")], "危険品倉庫 = gudang bahan berbahaya.", "危険品倉庫です。"),
 MC("Gudang untuk makanan segar dan beku adalah…", "生鮮食品や冷凍食品を入れる倉庫はどれですか。", _opt("冷蔵倉庫", "れいぞうそうこ"), [_opt("普通倉庫", "ふつうそうこ"), _opt("危険品倉庫", "きけんひんそうこ")], "冷蔵倉庫 = gudang berpendingin.", "冷蔵倉庫です。"),
])
_add("bab1", "b1s2", [
 TF("ハンドリフトは、人の力でパレットを動かす道具です。", True, "Benar: pengangkat pallet manual.", "手で動かします。", "Hand lift adalah alat pemindah pallet dengan tenaga tangan."),
 TF("コンベヤは、荷物を自動で運ぶベルトなどの設備です。", True, "Benar.", "自動で運びます。", "Konveyor adalah ban berjalan yang memindahkan barang otomatis."),
 TF("カゴ台車は、荷物を持ち上げるために使うエレベーターです。", False, "Salah: troli kerangka kawat untuk memindahkan banyak kardus.", "台車です。", "Kago-daisha adalah lift pengangkat barang."),
 MC("Alas tempat menumpuk barang agar bisa diangkat forklift…", "フォークリフトで運ぶために荷物をのせる台はどれですか。", _opt("パレット", "パレット"), [_opt("カゴ台車", "カゴだいしゃ"), _opt("コンベヤ", "コンベヤ")], "パレット = pallet.", "パレットです。"),
 MC("Alat untuk mengangkut barang antar lantai gudang…", "階をこえて荷物を運ぶ設備はどれですか。", _opt("エレベーター・垂直自動搬送機", "エレベーター・すいちょくじどうはんそうき"), [_opt("ハンドリフト", "ハンドリフト"), _opt("台はかり", "だいはかり")], "Lift/pengangkut vertikal otomatis.", "エレベーターなどです。"),
])
_add("bab1", "b1s3", [
 TF("入庫は、荷受け、検品、格納の順に進みます。", True, "Benar.", "その順です。", "Alur masuk gudang: terima, cek, simpan."),
 TF("先入れ先出しは、あとに入った荷物を先に出す方法です。", False, "Salah: FIFO = yang masuk lebih dulu keluar lebih dulu.", "先に入ったものを先に出します。", "FIFO adalah mengeluarkan barang yang masuk belakangan lebih dulu."),
 TF("パレットに積むときは、重い荷物を下に置きます。", True, "Benar: berat di bawah, ringan di atas.", "重い物が下です。", "Saat menumpuk di pallet, barang berat ditaruh di bawah."),
 TF("荷受けのとき、賞味期限は確認しなくてよいです。", False, "Salah: periksa jumlah, nomor barang, kondisi, dan tanggal kedaluwarsa.", "期限も確認します。", "Saat menerima barang, tanggal kedaluwarsa tidak perlu dicek."),
 MC("Mengambil barang sesuai pesanan disebut…", "注文に合わせて荷物をとり出す作業はどれですか。", _opt("ピッキング", "ピッキング"), [_opt("格納", "かくのう"), _opt("荷受け", "にうけ")], "ピッキング = picking.", "ピッキングです。"),
 MC("FIFO sangat penting untuk barang…", "先入れ先出しがとくに大切な荷物はどれですか。", _opt("賞味期限のある食品", "しょうみきげんのあるしょくひん"), [_opt("空のパレット", "からのパレット"), _opt("古い机", "ふるいつくえ")], "Makanan dengan tanggal kedaluwarsa.", "期限のある食品です。"),
])
_add("bab1", "b1s4", [
 TF("1トンは1,000キログラムです。", True, "Benar.", "1t=1,000kgです。", "1 ton = 1.000 kg."),
 TF("1ケースが12個なら、5ケースは50個です。", False, "Salah: 12 × 5 = 60.", "60個です。", "Jika 1 dus = 12 buah, 5 dus = 50 buah."),
 TF("「天地無用」は、荷物をさかさまにしてはいけないという意味です。", True, "Benar: jangan dibalik.", "さかさまにしません。", "Simbol 天地無用 berarti barang tidak boleh dibalik."),
 TF("「水ぬれ防止」のマークがある荷物は、ぬらさないようにします。", True, "Benar.", "ぬらしません。", "Barang dengan tanda 水ぬれ防止 dijaga agar tidak basah."),
 MC("Tanda yang berarti mudah pecah…", "われやすい荷物に付けるマークの言葉はどれですか。", _opt("ワレモノ注意", "ワレモノちゅうい"), [_opt("手かぎ無用", "てかぎむよう"), _opt("水ぬれ防止", "みずぬれぼうし")], "ワレモノ注意 = mudah pecah.", "ワレモノ注意です。"),
 MC("1 m³ sama dengan berapa liter?", "1立方メートルは何リットルですか。", _opt("1,000リットル", "1,000リットル"), [_opt("100リットル", "100リットル"), _opt("10リットル", "10リットル")], "1 m³ = 1.000 L.", "1,000Lです。"),
])
_add("bab1", "b1s5", [
 TF("重い荷物は棚の下の段に置きます。", True, "Benar.", "重い物は下です。", "Barang berat ditaruh di rak bagian bawah."),
 TF("非常口や消火器の前に荷物を置いてもよいです。", False, "Salah: jangan menghalangi jalur kerja, pintu darurat, dan pemadam.", "置いてはいけません。", "Boleh menaruh barang di depan pintu darurat dan alat pemadam."),
 TF("危険物は、ほかの荷物といっしょにしてはいけません。", True, "Benar: jangan dicampur.", "分けて保管します。", "Barang berbahaya tidak boleh dicampur dengan barang lain."),
 MC("Rak khusus yang dimuat forklift…", "フォークリフトで荷物を出し入れする、パレット用の棚はどれですか。", _opt("パレットラック", "パレットラック"), [_opt("平積み", "ひらづみ"), _opt("カゴ台車", "カゴだいしゃ")], "パレットラック = rak pallet.", "パレットラックです。"),
])
_add("bab2", "b2s1", [
 TF("ロケーションは、荷物をしまう場所の住所のようなものです。", True, "Benar: alamat tempat barang di rak.", "場所の番地です。", "Lokasi (ロケーション) seperti alamat tempat penyimpanan barang."),
 TF("フリーロケーションは、荷物をいつも同じ場所に置く方法です。", False, "Salah: itu lokasi tetap; free location = boleh di tempat kosong, dicatat di sistem.", "固定ロケーションの説明です。", "Free location berarti barang selalu di tempat yang sama."),
 TF("棚卸は、実際の在庫を数えて、データと合わせる作業です。", True, "Benar: stock opname.", "数えて合わせます。", "Tanaoroshi adalah menghitung stok nyata dan mencocokkan dengan data."),
 MC("Sistem komputer yang mencatat stok dan lokasi barang…", "在庫や場所を記録するコンピューターのシステムはどれですか。", _opt("WMS（倉庫管理システム）", "ダブリューエムエス（そうこかんりシステム）"), [_opt("バーコード", "バーコード"), _opt("パレット", "パレット")], "WMS = sistem manajemen gudang.", "WMSです。"),
])
_add("bab2", "b2s2", [
 TF("検品で異常を見つけたら、自分で判断しないで上司に報告します。", True, "Benar.", "報告します。", "Jika menemukan kelainan saat inspeksi, jangan memutuskan sendiri; lapor ke atasan."),
 TF("梱包のときは、すき間に緩衝材を入れて荷物が動かないようにします。", True, "Benar.", "緩衝材で固定します。", "Isi celah dengan bahan pelindung agar barang tidak bergeser."),
 TF("ラベルは、見えにくい場所にはります。", False, "Salah: tempel di tempat yang mudah dilihat.", "見やすい場所です。", "Label ditempel di tempat yang sulit dilihat."),
 MC("Pekerjaan tambahan seperti memasang label harga disebut…", "値札をつけるなど、荷物に加える作業をなんといいますか。", _opt("流通加工", "りゅうつうかこう"), [_opt("入庫", "にゅうこ"), _opt("棚卸", "たなおろし")], "流通加工 = pengolahan distribusi.", "流通加工です。"),
 MC("Pembungkus plastik untuk menahan tumpukan…", "荷物をまとめて巻くプラスチックのフィルムはどれですか。", _opt("ストレッチフィルム", "ストレッチフィルム"), [_opt("緩衝材", "かんしょうざい"), _opt("ラベル", "ラベル")], "ストレッチフィルム = stretch film.", "ストレッチフィルムです。"),
])
_add("bab2", "b2s3", [
 TF("作業時間は、作業量を（1時間の力×人数）で割って求めます。", True, "Benar.", "割り算です。", "Waktu kerja = jumlah kerja ÷ (kemampuan per jam × jumlah orang)."),
 MC("240 dus, 1 orang 60 dus/jam, selesai 2 jam. Berapa orang?", "240箱を、1人1時間60箱で2時間で終えるには、何人必要ですか。", _opt("2人", "2にん"), [_opt("1人", "1にん"), _opt("4人", "4にん")], "240 ÷ (60×2) = 2 orang.", "240÷(60×2)=2です。"),
 MC("300 dus, 3 orang, 50 dus/jam per orang. Berapa jam?", "300箱を、3人で1人1時間50箱で運ぶと何時間かかりますか。", _opt("2時間", "2じかん"), [_opt("3時間", "3じかん"), _opt("1時間", "1じかん")], "300 ÷ (50×3) = 2 jam.", "300÷150=2です。"),
 MC("120 dus, 4 orang, 30 dus/jam per orang. Berapa jam?", "120箱を、4人で1人1時間30箱で作業すると何時間ですか。", _opt("1時間", "1じかん"), [_opt("2時間", "2じかん"), _opt("4時間", "4じかん")], "120 ÷ (30×4) = 1 jam.", "120÷120=1です。"),
])
_add("bab2", "b2s4", [
 TF("ラベルプリンターは、宛先などのラベルを印刷する機械です。", True, "Benar.", "ラベルを印刷します。", "Label printer mencetak label alamat dan sebagainya."),
 TF("台はかりは、荷物の重さをはかる道具です。", True, "Benar.", "重さをはかります。", "Timbangan lantai/meja untuk menimbang barang."),
 MC("Troli untuk membawa barang hasil picking…", "ピッキングした荷物を運ぶ台車はどれですか。", _opt("ピッキングカート", "ピッキングカート"), [_opt("梱包機", "こんぽうき"), _opt("ラベルプリンター", "ラベルプリンター")], "ピッキングカート.", "ピッキングカートです。"),
])
_add("bab3", "b3s1", [
 TF("体調が悪いときは、がまんして働きます。", False, "Salah: lapor jika tidak sehat; jangan memaksa bekerja.", "報告します。", "Saat tidak sehat, bekerja saja sambil menahan."),
 TF("重い物を持つときは、腰を落として背中を守ります。", True, "Benar: turunkan pinggang untuk mencegah 腰痛.", "腰を落とします。", "Saat mengangkat berat, turunkan pinggang dan jaga punggung."),
 TF("暑い日は、こまめに水を飲んで熱中症を防ぎます。", True, "Benar.", "水を飲みます。", "Hari panas: minum teratur untuk mencegah sengatan panas."),
 MC("Pakaian untuk kerja di gudang pendingin…", "冷蔵倉庫で寒さを防ぐために着るものはどれですか。", _opt("防寒着", "ぼうかんぎ"), [_opt("半そで", "はんそで"), _opt("水着", "みずぎ")], "防寒着 = pakaian penahan dingin.", "防寒着です。"),
])
_add("bab3", "b3s2", [
 TF("フォークリフトのつめ（フォーク）の上に乗ってはいけません。", True, "Benar.", "乗ってはいけません。", "Dilarang naik di atas garpu forklift."),
 TF("持ち上げた荷物の下に立ってもよいです。", False, "Salah: sangat berbahaya.", "下に入りません。", "Boleh berdiri di bawah barang yang terangkat."),
 TF("最大荷重1トン以上のフォークリフトには、技能講習が必要です。", True, "Benar (≥1 t: 技能講習; <1 t: 特別教育).", "1t以上は技能講習です。", "Forklift beban maks ≥1 ton perlu pelatihan keterampilan (技能講習)."),
 TF("ヒヤリハットは、報告しなくてよいです。", False, "Salah: laporkan agar tidak terulang.", "報告します。", "Hiyari-hatto tidak perlu dilaporkan."),
 MC("Tumpukan barang roboh disebut…", "積んだ荷物がくずれることをなんといいますか。", _opt("荷くずれ", "にくずれ"), [_opt("挟まれ", "はさまれ"), _opt("転倒", "てんとう")], "荷くずれ = tumpukan roboh.", "荷くずれです。"),
])
_add("bab3", "b3s3", [
 TF("緑色の標識は、安全や避難口を示します。", True, "Benar: hijau = aman/evakuasi.", "緑は安全です。", "Tanda hijau menunjukkan keselamatan/pintu evakuasi."),
 TF("火災のとき、避難にエレベーターを使います。", False, "Salah: jangan memakai lift.", "階段を使います。", "Saat kebakaran, evakuasi memakai lift."),
 TF("作業手順書の手順は、自分の考えで変えてよいです。", False, "Salah: ikuti prosedur tertulis; jangan ubah sendiri.", "変えません。", "Langkah prosedur kerja boleh diubah sesuai pendapat sendiri."),
 MC("Warna tanda 'hati-hati'…", "「注意」を表す標識の色はどれですか。", _opt("黄色", "きいろ"), [_opt("緑", "みどり"), _opt("青", "あお")], "Kuning = hati-hati.", "黄色です。"),
 MC("ほう・れん・そう artinya…", "「ほう・れん・そう」の意味はどれですか。", _opt("報告・連絡・相談", "ほうこく・れんらく・そうだん"), [_opt("整理・整頓・清掃", "せいり・せいとん・せいそう"), _opt("出庫・入庫・棚卸", "しゅっこ・にゅうこ・たなおろし")], "Lapor, kabari, konsultasi.", "報告・連絡・相談です。"),
])
_add("bab3", "b3s4", [
 TF("冷蔵倉庫の扉は、開けたままにしておきます。", False, "Salah: tutup agar suhu terjaga.", "閉めます。", "Pintu gudang pendingin dibiarkan terbuka."),
 TF("冷蔵倉庫の中の床は、氷でぬれてすべりやすいことがあります。", True, "Benar: jalan pelan.", "ゆっくり歩きます。", "Lantai gudang pendingin bisa licin karena es."),
 TF("重い物を持つときは、体をひねりながら持ち上げます。", False, "Salah: jangan memutar badan sambil mengangkat.", "ひねりません。", "Mengangkat barang berat sambil memutar badan."),
 MC("Jika barang terlalu berat…", "荷物が重すぎるとき、どうしますか。", _opt("助けをたのむか、道具を使う", "たすけをたのむか、どうぐをつかう"), [_opt("一人でむりに持つ", "ひとりでむりにもつ"), _opt("投げて運ぶ", "なげてはこぶ")], "Minta bantuan atau pakai alat.", "むりをしません。"),
])
