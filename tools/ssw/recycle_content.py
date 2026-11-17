# -*- coding: utf-8 -*-
"""Bidang recycling (資源循環 / 廃棄物処分業・中間処理). Sumber: 分野別運用方針 (別紙19) dan 育成・キャリア形成プログラム (環境省).
Ujian 1号 belum diterbitkan pemerintah; isi = ORIGINAL LEARNING CONTENT Shirose dari dokumen tsb. + pengetahuan umum pengolahan limbah. Perlu review ahli."""
def TF(jp, ok, exp_id, exp_jp, id_=None): return ("tf", id_, jp, ok, exp_id, exp_jp)
def MC(q_id, q_jp, right, wrong, exp_id, exp_jp): return ("mc", q_id, q_jp, right, wrong, exp_id, exp_jp)
SLUG = "recycling"; NAMA = "Daur Ulang Sumber Daya (Shigen Junkan)"; JP = "資源循環"; PREFIX = "rc"
SRC = "資源循環分野 分野別運用方針 環境省 2026"
TEMA_SUB = "b3s1"; TEMA_ID = ("Tema: Keselamatan Kerja Pengolahan Limbah", "廃棄物処理の安全")
BAB = [
 {"id": "bab1", "title_id": "Bidang dan Pekerjaan Pengolahan Antara", "title_jp": "分野と仕事の内容",
  "intro_id": "Apa itu pengolahan antara limbah, jenis limbah, dan alur kerja.",
  "intro_jp": "中間処理とは何か、廃棄物の種類、仕事の流れを学びます。", "pages": [1, 1], "src": SRC},
 {"id": "bab2", "title_id": "Karier, Bahasa Jepang, dan Ujian", "title_jp": "キャリアと日本語・試験",
  "intro_id": "Jalur karier ikusei shuro → tokutei ginou 1, tingkat bahasa Jepang, dan pelatihan.",
  "intro_jp": "育成就労から特定技能1号までのキャリア、日本語の水準、講習を学びます。", "pages": [1, 1], "src": SRC},
 {"id": "bab3", "title_id": "Keselamatan dan Kualifikasi Kerja", "title_jp": "安全と資格",
  "intro_id": "Keselamatan kerja dan kualifikasi yang berguna di tempat pengolahan limbah.",
  "intro_jp": "廃棄物処理の仕事の安全と、役に立つ資格を学びます。", "pages": [1, 1], "src": SRC},
]
SUBS = {}
SUBS["bab1"] = [
 {"id": "b1s1", "pages": [7, 8], "t_id": "Apa Itu Pengolahan Antara (中間処理)", "t_jp": "中間処理とは",
  "id_bl": [("h", "Definisi"), ("ul", [
     "Satu-satunya kategori pekerjaan: **廃棄物処分業（中間処理）**.",
     "Pekerjaannya: mengolah limbah dari **rumah tangga dan kegiatan usaha** melalui **中間処理** untuk **減量化 (mengurangi berat), 減容化 (mengurangi volume), 安定化 (menstabilkan), 安全化 (membuat aman)**.",
     "Limbah dibedakan menjadi **一般廃棄物** (terutama dari rumah tangga) dan **産業廃棄物** (dari kegiatan usaha menurut jenis yang ditetapkan hukum)."])],
  "jp_bl": [("h", "中間処理とは"), ("ul", [
     "この分野の業務区分は、廃棄物処分業（中間処理）だけです。",
     "家庭や事業活動から出る廃棄物を、減量化、減容化、安定化、安全化する仕事です。",
     "廃棄物には、一般廃棄物（おもに家庭のごみ）と産業廃棄物があります。"])],
  "terms": [("廃棄物", "はいきぶつ", "limbah/sampah", "廃棄物を処理します。", "Mengolah limbah."),
            ("中間処理", "ちゅうかんしょり", "pengolahan antara", "中間処理の工場で働きます。", "Bekerja di pabrik pengolahan antara."),
            ("一般廃棄物", "いっぱんはいきぶつ", "limbah umum (terutama rumah tangga)", "家庭のごみは一般廃棄物です。", "Sampah rumah tangga adalah limbah umum."),
            ("産業廃棄物", "さんぎょうはいきぶつ", "limbah industri", "産業廃棄物を分けます。", "Memilah limbah industri."),
            ("減量化", "げんりょうか", "pengurangan berat", "焼却で減量化します。", "Mengurangi berat dengan pembakaran."),
            ("減容化", "げんようか", "pengurangan volume", "破砕で減容化します。", "Mengurangi volume dengan penghancuran."),
            ("安定化", "あんていか", "penstabilan", "安定化して埋め立てます。", "Menstabilkan lalu mengubur."),
            ("安全化", "あんぜんか", "pengamanan (membuat tidak berbahaya)", "安全化の処理をします。", "Melakukan pengolahan pengamanan.")],
  "qs": [TF("この分野の業務区分は、廃棄物処分業（中間処理）です。", True, "Benar.", "中間処理です。", "Kategori pekerjaan bidang ini adalah pengolahan antara limbah."),
         TF("中間処理の目的に、減量化と減容化は入りません。", False, "Salah: termasuk.", "入ります。", "Tujuan pengolahan antara tidak mencakup pengurangan berat dan volume."),
         MC("Limbah dari rumah tangga terutama disebut…", "おもに家庭から出る廃棄物は何ですか。", ("一般廃棄物", "一般廃棄物"), [("産業廃棄物", "産業廃棄物"), ("危険廃棄物", "危険廃棄物"), ("海の廃棄物", "海の廃棄物")], "Limbah umum.", "一般廃棄物です。"),
         MC("Mengurangi volume limbah disebut…", "廃棄物の体積を小さくすることは何ですか。", ("減容化", "減容化"), [("減量化", "減量化"), ("安定化", "安定化"), ("安全化", "安全化")], "減容化.", "減容化です。")]},
 {"id": "b1s2", "pages": [7, 9], "t_id": "Alur Kerja dan Cara Pengolahan", "t_jp": "仕事の流れと処理方法",
  "id_bl": [("h", "Alur kerja"), ("ul", [
     "Menurut kebijakan resmi, pengolahan antara mencakup beberapa tahap: **受入 (penerimaan) → 選別 (pemilahan) → 処分 (pengolahan) → 搬出 (pengeluaran)**.",
     "Pekerja perlu memahami seluruh rangkaian dan bekerja aman secara mandiri."]),
    ("h", "Cara pengolahan umum (pengetahuan umum)"), ("ul", [
     "**破砕**: menghancurkan agar kecil.",
     "**選別**: memilah menurut jenis (besi, plastik, kertas, dll.).",
     "**圧縮**: memadatkan agar volume kecil.",
     "**焼却**: membakar untuk mengurangi berat dan volume.",
     "**脱水・乾燥**: mengurangi kadar air."])],
  "jp_bl": [("h", "仕事の流れ"), ("ul", [
     "中間処理には、受入、選別、処分、搬出という工程があります。",
     "一連の流れを理解して、安全に一人で作業できるようになります。"]),
    ("h", "おもな処理方法"), ("ul", [
     "破砕：細かくくだきます。",
     "選別：鉄、プラスチック、紙などに分けます。",
     "圧縮：ぎゅっとかためて体積を小さくします。",
     "焼却：燃やして、量と体積を減らします。",
     "脱水・乾燥：水分を減らします。"])],
  "terms": [("受入", "うけいれ", "penerimaan", "受入の作業をします。", "Mengerjakan penerimaan."),
            ("選別", "せんべつ", "pemilahan", "プラスチックを選別します。", "Memilah plastik."),
            ("処分", "しょぶん", "pengolahan akhir/pembuangan", "廃棄物を処分します。", "Mengolah/membuang limbah."),
            ("搬出", "はんしゅつ", "pengeluaran/pengangkutan keluar", "処理した物を搬出します。", "Mengeluarkan hasil olahan."),
            ("破砕", "はさい", "penghancuran", "破砕機で破砕します。", "Menghancurkan dengan mesin penghancur."),
            ("圧縮", "あっしゅく", "pemadatan", "ごみを圧縮します。", "Memadatkan sampah."),
            ("焼却", "しょうきゃく", "pembakaran", "焼却炉で焼却します。", "Membakar di insinerator."),
            ("脱水", "だっすい", "pengurangan air (dehidrasi)", "汚泥を脱水します。", "Mendehidrasi lumpur.")],
  "qs": [MC("Urutan kerja yang benar…", "仕事の流れで正しいものはどれですか。", ("受入→選別→処分→搬出", "受入→選別→処分→搬出"), [("搬出→受入→処分→選別", "搬出→受入→処分→選別"), ("処分→搬出→受入→選別", "処分→搬出→受入→選別"), ("選別→搬出→処分→受入", "選別→搬出→処分→受入")], "Terima, pilah, olah, keluarkan.", "受入→選別→処分→搬出です。"),
         MC("Memilah limbah menurut jenis disebut…", "廃棄物を種類ごとに分ける作業は何ですか。", ("選別", "選別"), [("焼却", "焼却"), ("圧縮", "圧縮"), ("搬出", "搬出")], "Pemilahan.", "選別です。"),
         TF("破砕は、廃棄物を細かくくだく処理です。", True, "Benar.", "細かくくだきます。", "Penghancuran adalah pengolahan memecah limbah menjadi kecil."),
         MC("Memadatkan limbah agar volumenya kecil…", "ごみをかためて体積を小さくする処理は何ですか。", ("圧縮", "圧縮"), [("選別", "選別"), ("受入", "受入"), ("脱水", "脱水")], "Pemadatan.", "圧縮です。")]},
]
SUBS["bab2"] = [
 {"id": "b2s1", "pages": [1, 2], "t_id": "Jalur Karier dan Bahasa Jepang", "t_jp": "キャリアステップと日本語",
  "id_bl": [("h", "Jalur karier (ringkasan program resmi)"), ("ul", [
     "**育成就労 (ikusei shuro)** tahun ke-1 sampai 3, lalu pindah ke **特定技能1号** pada tahun ke-4 sampai 8.",
     "Ujian: **育成就労評価試験（初級）** lalu **特定技能1号評価試験**.",
     "Tingkat bahasa Jepang: awal ikusei shuro **A1 (JFT-Basic A1 / JLPT N5)**; selama bekerja sampai **A2.2 (JFT-Basic A2.2 / N4)**; tokutei ginou 1 mulai **A2.2 (N4)**, bekerja sampai **B1 (N3)**.",
     "Pengalaman manajemen: pemimpin lapangan (3 tahun ke atas), kepala regu (5 tahun ke atas)."])],
  "jp_bl": [("h", "キャリアステップ"), ("ul", [
     "育成就労は1年目から3年目、特定技能1号は4年目から8年目です。",
     "試験は、育成就労評価試験（初級）と、特定技能1号評価試験です。",
     "日本語は、育成就労の開始時にA1（N5）、特定技能1号の開始時にA2.2（N4）、その後B1（N3）をめざします。",
     "現場リーダー、係長・主任としての経験を積みます。"])],
  "terms": [("育成就労", "いくせいしゅうろう", "ikusei shuro (kerja pelatihan)", "育成就労で働きます。", "Bekerja dengan visa ikusei shuro."),
            ("特定技能", "とくていぎのう", "tokutei ginou (keterampilan khusus)", "特定技能に移ります。", "Beralih ke tokutei ginou."),
            ("評価試験", "ひょうかしけん", "ujian penilaian", "評価試験を受けます。", "Mengikuti ujian penilaian."),
            ("日本語能力", "にほんごのうりょく", "kemampuan bahasa Jepang", "日本語能力が必要です。", "Perlu kemampuan bahasa Jepang."),
            ("現場リーダー", "げんばりーだー", "pemimpin lapangan", "現場リーダーになります。", "Menjadi pemimpin lapangan."),
            ("キャリア", "きゃりあ", "karier", "キャリアを考えます。", "Memikirkan karier.")],
  "qs": [MC("Tokutei ginou 1 dimulai pada tahun ke…", "特定技能1号は何年目から始まりますか。", ("ke-4", "4年目"), [("ke-1", "1年目"), ("ke-2", "2年目"), ("ke-9", "9年目")], "Tahun ke-4 sampai 8.", "4年目から8年目です。"),
         MC("Tingkat bahasa untuk mulai tokutei ginou 1…", "特定技能1号の開始に必要な日本語の水準はどれですか。", ("A2.2 (N4)", "A2.2（N4）"), [("A1 (N5)", "A1（N5）"), ("C1", "C1"), ("tidak perlu", "必要ない")], "A2.2 / N4.", "A2.2（N4）です。"),
         TF("育成就労は1年目から3年目までです。", True, "Benar.", "1年目から3年目です。", "Ikusei shuro berlangsung tahun ke-1 sampai ke-3."),
         MC("Tingkat bahasa saat mulai ikusei shuro…", "育成就労の開始時に必要な日本語の水準はどれですか。", ("A1 (N5)", "A1（N5）"), [("A2.2 (N4)", "A2.2（N4）"), ("B1 (N3)", "B1（N3）"), ("C2", "C2")], "A1 / N5.", "A1（N5）です。")]},
]
SUBS["bab3"] = [
 {"id": "b3s1", "pages": [1, 2], "t_id": "Keselamatan Kerja di Pengolahan Limbah", "t_jp": "廃棄物処理の安全",
  "id_bl": [("h", "Dasar keselamatan"), ("ul", [
     "Ikuti **安全・衛生教育**; pakai **保護具** (helm, sarung tangan, masker, sepatu pengaman, kacamata).",
     "Waspada **benda tajam** dalam limbah, **terjepit mesin**, **debu**, dan **kebakaran**. Jangan menaruh tangan ke mesin penghancur yang berjalan.",
     "Sebelum membersihkan atau memperbaiki mesin: **matikan dan kunci** (stop & lock) agar tidak menyala tiba-tiba.",
     "Laporkan **ヒヤリハット** dan kelainan pada atasan."])],
  "jp_bl": [("h", "安全の基本"), ("ul", [
     "安全・衛生教育を受けて、保護具（ヘルメット、手袋、マスク、安全靴、保護メガネ）を使います。",
     "廃棄物の中のとがった物、機械にはさまれること、ほこり、火事に気をつけます。動いている破砕機に手を入れてはいけません。",
     "機械を掃除や修理するときは、必ず止めて、電源を切ってから始めます。",
     "ヒヤリハットや異常は、上の人に報告します。"])],
  "terms": [("保護具", "ほごぐ", "alat pelindung diri", "保護具をつけます。", "Memakai APD."),
            ("安全衛生教育", "あんぜんえいせいきょういく", "pendidikan keselamatan dan kesehatan", "安全衛生教育を受けます。", "Mengikuti pendidikan K3."),
            ("電源", "でんげん", "sumber listrik", "電源を切ります。", "Mematikan listrik."),
            ("異常", "いじょう", "kelainan", "異常を報告します。", "Melapor kelainan."),
            ("火災", "かさい", "kebakaran", "火災に注意します。", "Waspada kebakaran."),
            ("粉じん", "ふんじん", "debu halus", "粉じんを吸わないようにマスクをします。", "Memakai masker agar tidak menghirup debu.")],
  "qs": [TF("動いている破砕機に、手を入れてもよいです。", False, "Salah: sangat berbahaya.", "入れてはいけません。", "Boleh memasukkan tangan ke mesin penghancur yang sedang berjalan."),
         TF("機械を掃除するときは、先に電源を切ります。", True, "Benar.", "先に止めます。", "Saat membersihkan mesin, matikan listrik terlebih dulu."),
         MC("Apa yang dipakai untuk mencegah menghirup debu?", "粉じんを吸わないために、何をつけますか。", ("マスク", "マスク"), [("サングラス", "サングラス"), ("帽子だけ", "帽子だけ"), ("何もつけない", "何もつけない")], "Masker.", "マスクです。"),
         MC("Jika menemukan kelainan pada mesin, lakukan…", "機械の異常を見つけたら、どうしますか。", ("laporkan ke atasan", "上の人に報告する"), [("abaikan", "気にしない"), ("perbaiki sembunyi-sembunyi", "こっそり直す"), ("tetap dijalankan", "そのまま動かす")], "Lapor.", "報告します。")]},
 {"id": "b3s2", "pages": [1, 2], "t_id": "Pelatihan dan Kualifikasi yang Berguna", "t_jp": "講習と資格",
  "id_bl": [("h", "Menurut program karier resmi"), ("ul", [
     "Sejak tahun 1: **産廃処理実務者研修会 基礎コース**, **一般廃棄物（ごみ）実務管理者講習**, serta **フォークリフト**, **玉掛け**, **床上操作式クレーン**.",
     "Tahun ke-2: **産廃処理 現場業務コース（中間処理）**.",
     "Tahun ke-4: **安全衛生推進者**, **職長・安全衛生責任者教育**.",
     "Tahun ke-7: **廃棄物処理施設技術管理者講習**."])],
  "jp_bl": [("h", "育成・キャリア形成プログラムより"), ("ul", [
     "1年目から、産廃処理実務者研修会基礎コース、一般廃棄物実務管理者講習、フォークリフト、玉掛け、床上操作式クレーンなどを受けます。",
     "2年目から、産廃処理現場業務コース（中間処理）があります。",
     "4年目から、安全衛生推進者、職長・安全衛生責任者教育があります。",
     "7年目から、廃棄物処理施設技術管理者講習があります。"])],
  "terms": [("研修会", "けんしゅうかい", "pelatihan/seminar", "研修会に参加します。", "Mengikuti pelatihan."),
            ("講習", "こうしゅう", "kursus/pelatihan", "講習を受けます。", "Mengikuti kursus."),
            ("玉掛け", "たまがけ", "pemasangan sling pada beban crane", "玉掛けの講習を受けます。", "Mengikuti kursus penyling."),
            ("資格", "しかく", "kualifikasi", "資格を取ります。", "Memperoleh kualifikasi."),
            ("職長", "しょくちょう", "kepala regu kerja", "職長になります。", "Menjadi kepala regu."),
            ("フォークリフト", "ふぉーくりふと", "forklift", "フォークリフトを運転します。", "Mengoperasikan forklift.")],
  "qs": [TF("フォークリフトの講習は、1年目から受けられます。", True, "Benar (menurut program).", "1年目からです。", "Pelatihan forklift bisa diikuti sejak tahun pertama."),
         MC("Pelatihan kepala regu dan K3 dimulai tahun ke…", "職長・安全衛生責任者教育は何年目からですか。", ("ke-4", "4年目"), [("ke-1", "1年目"), ("ke-2", "2年目"), ("ke-7", "7年目")], "Tahun ke-4.", "4年目からです。"),
         MC("Kualifikasi yang berkaitan dengan crane…", "クレーンの仕事に関係する資格はどれですか。", ("玉掛け", "玉掛け"), [("料理", "調理"), ("英検", "英検"), ("泳ぎ", "水泳")], "Tamakake.", "玉掛けです。")]},
]

BOOK_PAGES = 12
