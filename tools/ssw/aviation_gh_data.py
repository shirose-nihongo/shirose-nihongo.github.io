# -*- coding: utf-8 -*-
"""Data modul Aviation — Ground Handling (空港グランドハンドリング).
Sumber: 日本航空技術協会(JAEA) 特定技能評価試験テキスト「グランドハンドリング」2nd Revision (exam.jaea.or.jp).
Ringkasan ID/JP ditulis ulang oleh Shirose Nihongo (bukan terjemahan resmi, bukan dari JAEA). Halaman asli = PDF JAEA.
Format sub: (id, judul_id, judul_jp, [hal_awal, hal_akhir], blok_ID, blok_JP). Blok: ("h", teks) | ("ul", [..]) | ("note", teks).
Nomor halaman = nomor halaman PDF JAEA (p01 = sampul)."""
SRC = "JAEA 特定技能評価試験テキスト グランドハンドリング 2nd Revision + 安全・品質 2nd Revision (diringkas Shirose)"
BABS = [
 ("bab1", 1, "Dasar Ground Handling, Proses, dan Informasi", "グランドハンドリングの基本・工程・情報", "Apa itu ground handling, urutan kerja saat pesawat tiba/berangkat, dan membaca informasi penerbangan.", [7, 12], [
  ("b1s1", "Apa itu Ground Handling & Proses Kerja", "グランドハンドリングとは・工程管理", [7, 8], [
    ("h", "Ground handling"),
    ("ul", [
      "Pekerjaan di darat (**spot / ramp**) yang menyiapkan pesawat: memuat bahan bakar, bagasi, kargo, membersihkan kabin, dll. Disebut **グランドハンドリング**.",
      "Tujuan: pesawat berangkat **aman (安全性)**, **tepat waktu (定時性)**, dan **nyaman (快適性)**.",
      "Keselamatan: sampaikan ke kapten informasi barang berbahaya, berat muatan, dan posisi titik berat; jika menemukan kerusakan/penyok (**Dent**) pada badan pesawat, laporkan ke mekanik.",
      "Ketepatan waktu: kerjakan persiapan sesuai waktu yang ditetapkan. Kenyamanan: bersihkan kabin.",
      "**IATA** menyusun standar kontrak layanan handling (**Airport Handling Manual**) bila maskapai menitipkan handling di bandara luar negeri."]),
    ("h", "Manajemen proses (工程管理)"),
    ("ul", [
      "Urutan kerja, waktu, dan jumlah orang ditentukan lebih dulu; semua pekerjaan mengikuti **standar proses kerja** menuju jam berangkat berikutnya.",
      "Sebelum pesawat tiba, petugas dan **GSE (Ground Support Equipment)** menunggu di tempat aman yang tidak menghalangi pesawat: mekanik, petugas penumpang, **marshaller**, petugas penurunan kontainer, operator **PBB (Passenger Boarding Bridge)**, petugas kebersihan.",
      "**Marshaller** memandu pesawat ke posisi berhenti. Penanggung jawab kedatangan memastikan **semua mesin mati**, lalu memberi tanda **OK pemasangan peralatan**; baru peralatan dan petugas mendekat.",
      "Lalu: PBB dipasang dan pintu dibuka; kontainer diturunkan dari ruang kargo; truk dipasang di pintu belakang untuk pembersihan; **water service car** mengisi air minum dan **lavatory service car** menyedot air kotor.",
      "Setelah kontainer kedatangan turun, kontainer keberangkatan dimuat. **Traktor tarik** dipasang di roda depan untuk mendorong pesawat."])],
   [("h", "グランドハンドリング"),
    ("ul", [
      "{飛行機|ひこうき}が{飛|と}ぶための{準備|じゅんび}を{地上|ちじょう}（スポット・ランプ）で{行|おこな}う{仕事|しごと}を「グランドハンドリング」といいます。",
      "{目的|もくてき}は、{安全|あんぜん}に・{時間|じかん}どおりに・{快適|かいてき}に{飛|と}ばすことです。",
      "{安全|あんぜん}のため、{危険物|きけんぶつ}・{積|つ}む{重|おも}さ・{重心|じゅうしん}の{位置|いち}を{機長|きちょう}に{正|ただ}しく{伝|つた}えます。{機体|きたい}にキズやへこみ（Dent）を{見|み}つけたら{整備士|せいびし}に{伝|つた}えます。",
      "{国際航空運送協会|こくさいこうくううんそうきょうかい}（IATA）は、グランドハンドリングを{他|ほか}の{会社|かいしゃ}にたのむときの{標準|ひょうじゅん}の{契約|けいやく}（Airport Handling Manual）を{作|つく}っています。"]),
    ("h", "{工程管理|こうていかんり}"),
    ("ul", [
      "{作業|さぎょう}の{順番|じゅんばん}・{時間|じかん}・{人数|にんずう}を{先|さき}に{決|き}め、{全員|ぜんいん}が{標準|ひょうじゅん}の{工程|こうてい}に{従|したが}って{次|つぎ}の{出発|しゅっぱつ}{時刻|じこく}に{向|む}かいます。",
      "{飛行機|ひこうき}が{着|つ}く{前|まえ}に、{整備士|せいびし}・マーシャラー・{搭乗橋|とうじょうきょう}（PBB）の{係員|かかりいん}・{清掃|せいそう}{係|がかり}などが、{安全|あんぜん}な{場所|ばしょ}で{待|ま}ちます。",
      "マーシャラーが{飛行機|ひこうき}を{止|と}める{位置|いち}まで{案内|あんない}します。{責任者|せきにんしゃ}が{全部|ぜんぶ}のエンジンの{停止|ていし}を{確認|かくにん}して「{機材|きざい}{装着|そうちゃく}OK」の{合図|あいず}を{出|だ}してから、{機材|きざい}と{係員|かかりいん}が{近|ちか}づきます。",
      "{到着便|とうちゃくびん}のコンテナを{降|お}ろした{後|あと}に、{出発便|しゅっぱつびん}の{荷物|にもつ}を{積|つ}みます。{最後|さいご}に{牽引車|けんいんしゃ}を{前脚|まえあし}に{付|つ}けます。"])]),
  ("b1s2", "Informasi Penerbangan & Muatan", "情報の入手", [9, 12], [
    ("h", "Informasi dasar (基本情報)"),
    ("ul", [
      "Dicek di monitor informasi: **FLT** (nomor penerbangan), **EQT** (nomor pesawat/ship number), **FRM/TO** (asal/tujuan), **STA/STD** (jadwal tiba/berangkat), **SPOT** (tempat parkir).",
      "Bandara dan maskapai dinyatakan dengan **kode 3 huruf / 2 huruf** (Reference-1).",
      "Untuk **機移し (pemindahan langsung antar pesawat)**, periksa juga informasi dasar pesawat tujuan. Jika antar maskapai berbeda, info tidak muncul di monitor — tanyakan ke **controller**."]),
    ("h", "Informasi muatan"),
    ("ul", [
      "Rencana muat keberangkatan diberikan controller lewat **Instruction Sheet**: **POS** (posisi muat), **ULD-ID**, **PCS** (jumlah), **WGT** (berat), **RMKS** (muatan khusus/berbahaya, muatan sambungan).",
      "Instruction Sheet sering sekaligus berfungsi sebagai **lembar cek muat**; pakai sesuai aturan.",
      "Muatan kedatangan: periksa rencana muat dari bandara asal; urutan dan tujuan penurunan bisa berbeda menurut jenis muatan.",
      "**ULD (Unit Load Device)** = kontainer/palet dengan bentuk standar untuk dipasang di pesawat. Contoh: **AKH (LD-46)**, **AKE (LD-3)**, **DQP (LD-4)**.",
      "**Irregular**: perubahan seperti jumlah air, rencana muat (cuaca, jumlah penumpang, perawatan) bisa diinstruksikan controller; proses sesuai aturan."])],
   [("h", "{基本情報|きほんじょうほう}"),
    ("ul", [
      "{情報|じょうほう}モニターで{確認|かくにん}します。FLT＝{便名|びんめい}、EQT＝シップ・ナンバー、FRM／TO＝{発地|はっち}／{着地|ちゃくち}、STA／STD＝{到着|とうちゃく}／{出発|しゅっぱつ}{時刻|じこく}、SPOT＝{駐機|ちゅうき}{場所|ばしょ}。",
      "{空港|くうこう}と{航空会社|こうくうがいしゃ}は、アルファベット3{文字|もじ}・2{文字|もじ}のコードで{表|あらわ}します。",
      "{機移|きうつ}し{搭載物|とうさいぶつ}は、{積|つ}みかえ{先|さき}の{飛行機|ひこうき}の{情報|じょうほう}も{確認|かくにん}します。{会社|かいしゃ}がちがうときはコントローラーに{確認|かくにん}します。"]),
    ("h", "{搭載物|とうさいぶつ}の{情報|じょうほう}"),
    ("ul", [
      "{出発便|しゅっぱつびん}は、コントローラーが「インストラクション・シート」で{指示|しじ}します。POS＝{搭載|とうさい}ポジション、ULD-ID＝ULD{番号|ばんごう}、PCS＝{個数|こすう}、WGT＝{重量|じゅうりょう}、RMKS＝{特殊|とくしゅ}{搭載物|とうさいぶつ}など。",
      "ULD（Unit Load Device）は、コンテナやパレットのように、{飛行機|ひこうき}に{付|つ}ける{形|かたち}が{決|き}まっているものです。",
      "{天気|てんき}・{旅客数|りょかくすう}・{整備|せいび}などで{計画|けいかく}が{変|か}わることがあります。そのときはコントローラーの{指示|しじ}と{規則|きそく}に{従|したが}います。"])]),
 ]),
 ("bab2", 2, "Pekerjaan Pengangkutan (搬送作業)", "搬送作業", "Alat GSE untuk pengangkutan, persiapan, memuat ULD/bulk, menangani muatan, dan pemindahan bagasi sambungan.", [12, 20], [
  ("b2s1", "GSE Pengangkutan", "搬送作業のGSE", [12, 15], [
    ("h", "Dua jenis ruang kargo"),
    ("ul", [
      "**Ruang kontainer**: bisa memuat **ULD** langsung; dimuat dengan **high-lift loader**. Terbagi dua (depan dan belakang sayap).",
      "**Ruang bulk (バルク)**: barang dimuat satu per satu dengan tangan; memakai **belt loader**.",
      "High-lift loader dan belt loader hanya dipakai di sisi pesawat (**機側**)."]),
    ("h", "GSE utama"),
    ("ul", [
      "**Towing tractor (TT車)**: kendaraan penarik kereta non-self-propelled (dolly, cart). Hati-hati: saat belok dolly/cart bisa mendekat karena gaya sentrifugal; rem dolly/cart harus penuh saat dilepas; jangan taruh tangan di ujung tow bar saat menyambung.",
      "**Truk**: mengangkut bagasi/kargo curah (truk biasa, ber-tailgate, ber-konveyor).",
      "**Container dolly**: kereta untuk kontainer (LD-3 dst.), ada roller dan turntable. **Pallet dolly**: untuk palet (maks 96in×125in). **Bulk cart**: kereta bagasi/kargo bulk, juga hewan hidup; disebut juga baggage/cargo cart.",
      "**High-lift loader**: memuat/menurunkan ULD ke **lower deck / main deck**; lebar 60.4in, 96in, 125in.",
      "**Belt loader**: konveyor sabuk bertenaga pompa hidrolik untuk bulk. Sebelum menyalakan pastikan tidak ada orang di atas/terlilit sabuk; jangan naik ke sabuk yang berjalan; waspada sarung tangan/sepatu terlilit."])],
   [("h", "2{種類|しゅるい}の{貨物室|かもつしつ}"),
    ("ul", [
      "コンテナ{室|しつ}：ULDをそのまま{積|つ}める{貨物室|かもつしつ}。ハイリフト・ローダーを{使|つか}います。",
      "バルク{貨物室|かもつしつ}：{荷物|にもつ}を{一|ひと}つずつ{手|て}で{積|つ}みおろす{貨物室|かもつしつ}。ベルト・ローダーを{使|つか}います。",
      "ハイリフト・ローダーもベルト・ローダーも、{機側|きそく}{作業|さぎょう}{専用|せんよう}です。"]),
    ("h", "おもなGSE"),
    ("ul", [
      "トーイング・トラクター（TT{車|しゃ}）：ドーリーやカートをひく{車|くるま}です。カーブでは{遠心力|えんしんりょく}でドーリーが{近|ちか}づくので{注意|ちゅうい}します。ドーリーを{切|き}りはなすときはブレーキをかけます。トーバーの{先|さき}に{手|て}を{置|お}いたまま{接続|せつぞく}してはいけません。",
      "コンテナ・ドーリーはコンテナ、パレット・ドーリーはパレット、バルク・カートはバルクの{荷物|にもつ}や{生|い}き{物|もの}を{運|はこ}びます。",
      "ハイリフト・ローダーは、ULDを{貨物室|かもつしつ}に{積|つ}みおろす{車|くるま}です。ベルト・ローダーは、ベルトコンベヤーで{荷物|にもつ}を{積|つ}みおろす{車|くるま}です。ベルトの{上|うえ}に{乗|の}ってはいけません。"])]),
  ("b2s2", "Persiapan & Memuat/Menurunkan ULD", "事前準備とULDの搭降載", [16, 17], [
    ("h", "Persiapan (事前準備)"),
    ("ul", [
      "Penanggung jawab/controller dan petugas memeriksa informasi dasar dan muatan, lalu **rapat** singkat: jumlah ULD yang diturunkan, muatan khusus, isi bulk, muatan sambungan/機移し, pengamanan alat, **pembagian tugas**, dan **keselamatan**.",
      "Alat yang disiapkan menunggu di tempat yang tidak menghalangi pesawat masuk spot.",
      "Siap **10–5 menit sebelum** pesawat tiba. Untuk keberangkatan, bawa muatan agar tepat waktu mulai kerja."]),
    ("h", "Memuat/menurunkan ULD (ULD の搭降載)"),
    ("ul", [
      "Kecepatan towing tractor di sisi pesawat **maks. 5 km/jam**.",
      "Cocokkan **nomor ULD dan posisi muat** dengan Instruction Sheet. Putar ULD di dolly dengan memastikan keselamatan sekitar, dan kerja sama dengan aba-aba/suara.",
      "Di atas dolly ULD dipindah dengan tenaga manusia; **palet berat oleh 2 orang atau lebih**.",
      "Sebelum traktor melepas, cek: **kunci pintu ULD dan tag ULD**, **kunci stopper dolly**, **sambungan traktor–dolly**.",
      "Saat traktor lepas, ia mendekati mesin pesawat — lakukan **sangat pelan**.",
      "**Jangan lewat di bawah sayap.** Bila terpaksa (ruang kargo belakang): lihat ke belakang, cek kiri-kanan dan sayap, jalan sangat pelan, dan lakukan dengan **指差呼称 (tunjuk-sebut)**."])],
   [("h", "{事前準備|じぜんじゅんび}"),
    ("ul", [
      "{責任者|せきにんしゃ}とコントローラー、{作業員|さぎょういん}は、{基本情報|きほんじょうほう}と{搭載物|とうさいぶつ}の{情報|じょうほう}を{確認|かくにん}し、ミーティングで{役割|やくわり}{分担|ぶんたん}・{安全|あんぜん}{注意|ちゅうい}を{伝|つた}えます。",
      "{到着便|とうちゃくびん}が{着|つ}く10～5{分前|ふんまえ}までに{準備|じゅんび}を{終|お}えて、スポットで{待|ま}ちます。"]),
    ("h", "ULDの{搭降載|とうこうさい}"),
    ("ul", [
      "{機側|きそく}では、トーイング・トラクターは{時速|じそく}5km{以下|いか}で{走|はし}ります。",
      "インストラクション・シートで、ULD{番号|ばんごう}と{搭載|とうさい}ポジションを{確認|かくにん}します。",
      "{重|おも}いパレットは2{人|ふたり}{以上|いじょう}で{運|はこ}びます。{声|こえ}をかけあって{作業|さぎょう}します。",
      "トラクターが{離|はな}れる{前|まえ}に、ULDのドア・ロックとタグ、ドーリー・ストッパーのロック、トラクターとドーリーの{連結|れんけつ}を{確認|かくにん}します。",
      "{翼|つばさ}の{下|した}を{通|とお}って{走|はし}ってはいけません。やむをえないときは、{後|うし}ろ・{左右|さゆう}・{翼|つばさ}を{指差呼称|ゆびさしこしょう}で{確認|かくにん}し、とてもゆっくり{走|はし}ります。"])]),
  ("b2s3", "Memuat Bulk & Menangani Muatan", "バルクの搭降載・搭載物の取扱い", [18, 20], [
    ("h", "Bulk (バルクの搭降載)"),
    ("ul", [
      "Kecepatan traktor maks. **5 km/jam**. Setelah belt loader terpasang, pasang cart; cocokkan nomor ULD/bulk cart dengan Instruction Sheet.",
      "Petugas pemuat menaruh barang di **tengah sabuk** dengan jarak **± 50 cm** agar mudah diterima. Susun menurut jenis/bentuk dan urutan penurunan; cegah jatuh/terguling, tempatkan pengawas bila perlu.",
      "Barang berat: kerja sama beberapa orang, beri tahu penerima; penerima **menghentikan sabuk sementara** untuk barang berat/besar/sulit dipegang.",
      "Saat angin kencang barang ringan seperti dokumen diserahkan **dengan tangan**. Saat hujan beri **perlindungan anti-air**.",
      "Cek **label ID kargo** / **tag bagasi** (tujuan). Ikuti label cara penanganan dan beri tahu penerima. Hewan kecil (**AVI**): periksa kondisinya dulu.",
      "Barang rusak/berubah bentuk/kotor → lapor ke bagian terkait. Cek **kondisi dan jumlah** saat serah-terima.",
      "Setelah bagasi dimuat, kedua petugas **menghitung jumlah**; jika tidak cocok hitung ulang. Kehilangan, kotor, rusak, salah muat **tidak boleh terjadi**.",
      "Selesai: periksa ruang kargo, sekitar belt loader, isi ULD/cart; pastikan **tidak ada yang tertinggal** dengan tunjuk-sebut. Pintu ULD/cart jangan langsung ditutup sampai beberapa orang memeriksa."]),
    ("h", "Menangani muatan (搭載物の取扱い)"),
    ("ul", [
      "Tangani dengan hati-hati. Muat di posisi yang ditentukan, **jangan di tempat lain**.",
      "Susun stabil agar tidak roboh: tumpuk menyilang; **yang berat di bawah**, **yang mudah pecah di atas**; barang tidak stabil/mesin presisi di-**tie-down** di posisi stabil; jangan menyisakan ruang kosong.",
      "Muatan khusus ikuti tag/label/stiker. Beban melebihi kekuatan lantai → lindungi dengan **pelat penguat**. Hasil laut/beku → **anti-air** dulu."])],
   [("h", "バルクの{搭降載|とうこうさい}"),
    ("ul", [
      "{積|つ}む{人|ひと}は、ベルトの{中央|ちゅうおう}に、50cm{位|くらい}あけて{荷物|にもつ}を{載|の}せます。{落|お}ちたり{倒|たお}れたりしないようにします。",
      "{重|おも}い{荷物|にもつ}は、{受|う}ける{人|ひと}に{合図|あいず}をして、ベルトを{一時停止|いちじていし}してから{受|う}け{取|と}ります。",
      "{強|つよ}い{風|かぜ}のときは{書類|しょるい}などを{手渡|てわた}しします。{雨|あめ}のときは{必|かなら}ず{防水|ぼうすい}します。",
      "{貨物|かもつ}はラベル、{手荷物|てにもつ}はタグで{行|い}き{先|さき}を{確認|かくにん}します。{動物|どうぶつ}（AVI）は{状態|じょうたい}を{見|み}てから{載|の}せます。",
      "{荷物|にもつ}のキズやよごれは{関係|かんけい}{部署|ぶしょ}に{報告|ほうこく}します。{手荷物|てにもつ}は{積|つ}んだ{後|あと}に{個数|こすう}を{確認|かくにん}します。",
      "{終|お}わったら、{貨物室|かもつしつ}・ULD・カートの{中|なか}に{積|つ}み{残|のこ}しがないか、{指差呼称|ゆびさしこしょう}で{確認|かくにん}します。"]),
    ("h", "{搭載物|とうさいぶつ}の{取扱|とりあつか}い"),
    ("ul", [
      "{荷物|にもつ}は{丁寧|ていねい}に{扱|あつか}い、{決|き}まった{場所|ばしょ}に{積|つ}みます。{重|おも}い{物|もの}は{下|した}、こわれやすい{物|もの}は{上|うえ}に{積|つ}みます。",
      "{不安定|ふあんてい}な{荷物|にもつ}や{精密|せいみつ}{機械|きかい}は、{安定|あんてい}した{場所|ばしょ}にタイダウンします。{空|あ}きスペースを{作|つく}らないようにします。",
      "タグ・ラベルの{指示|しじ}に{従|したが}います。{水産物|すいさんぶつ}や{冷凍品|れいとうひん}は{防水|ぼうすい}してから{積|つ}みます。"])]),
  ("b2s4", "Pemindahan Bagasi Sambungan (手荷物機移し)", "手荷物機移し作業", [20, 20], [
    ("ul", [
      "**MCT (Minimum Connecting Time)** = waktu minimal untuk transit yang ditentukan tiap bandara/maskapai. Berbeda menurut kombinasi: sesama maskapai, antar maskapai, domestik–domestik, internasional–internasional, domestik–internasional.",
      "Setelah pemindahan bagasi selesai, cocokkan informasi yang dibagikan sebelumnya (**nomor penerbangan, jumlah, ship no., tempat parkir**) dengan hasil kerja, dan **segera laporkan**."])],
   [("ul", [
      "MCT（{最小接続時間|さいしょうせつぞくじかん}）は、{乗|の}り{継|つ}ぎに{必要|ひつよう}な{最|もっと}も{短|みじか}い{時間|じかん}で、{空港|くうこう}や{航空会社|こうくうがいしゃ}ごとに{決|き}まっています。",
      "{機移|きうつ}しが{終|お}わったら、{便名|びんめい}・{個数|こすう}・シップNo.・{駐機場|ちゅうきじょう}などを{実際|じっさい}の{作業|さぎょう}と{照合|しょうごう}して、すぐに{報告|ほうこく}します。"])]),
 ]),
 ("bab3", 3, "Pekerjaan Badan Pesawat (機体作業)", "機体作業", "Water service, lavatory service, pendingin kabin (air conditioning), dan listrik darat (GPU).", [21, 26], [
  ("b3s1", "Water Service (Air Minum)", "ウォーター・サービス", [21, 22], [
    ("ul", [
      "Mengisi **tangki air** di badan pesawat sebelum terbang untuk air minum dan cuci tangan. Jumlah air berbeda menurut **tujuan, tipe pesawat, tanggal berangkat** → cek informasi dasar; bila jumlah ditentukan, cek dengan **water level gauge**.",
      "Setelah mengisi: **tutup valve pengisian dan overflow valve**, lepas selang, pastikan **tidak ada kebocoran** dari lubang pengisian, lalu tutup access panel. Bocoran bisa **membeku di ketinggian** menjadi es dan merusak komponen atau jatuh ke tanah.",
      "**Water car (給水車)**: tangki ± 4.000 L, selang, alat pengisi (tekanan maks. 3,0 kg/㎡); umumnya self-propelled. **Drain water car (排水車)**: menguras air minum di pesawat karena air tidak boleh disimpan **lebih dari 1 hari** → diganti tiap malam.",
      "Satuan jumlah air bisa **galon** atau **liter** menurut tipe pesawat; saat melapor **samakan dengan satuan yang ditentukan**. Isi pertama (始発便) dilakukan setelah pengurasan malam; isi antar-penerbangan bila sisa di bawah nilai tabel."])],
   [("ul", [
      "{飛行前|ひこうまえ}に、{機体|きたい}の{水|みず}タンクに{飲料水|いんりょうすい}を{入|い}れる{作業|さぎょう}です。{行|い}き{先|さき}・{機種|きしゅ}・{出発日|しゅっぱつび}で{水|みず}の{量|りょう}が{変|か}わるので{基本情報|きほんじょうほう}を{確認|かくにん}します。",
      "{給水|きゅうすい}{後|ご}は、バルブを{閉|し}めてホースを{外|はず}し、{水|みず}もれがないか{確認|かくにん}します。もれた{水|みず}は{空|そら}で{凍|こお}って{部品|ぶひん}をこわしたり、{落|お}ちたりします。",
      "{給水車|きゅうすいしゃ}はタンク{約|やく}4,000ℓ。{排水車|はいすいしゃ}は{飲料水|いんりょうすい}を{抜|ぬ}く{車|くるま}です。{機体|きたい}の{水|みず}は1{日|にち}{以上|いじょう}ためておけないので、{夜|よる}に{入|い}れかえます。"])]),
  ("b3s2", "Lavatory Service (Toilet)", "ラバトリー・サービス", [22, 23], [
    ("ul", [
      "Air kotor/limbah toilet disimpan di tangki khusus saat terbang dan **dikeluarkan setelah mendarat**. Urutan: **keluarkan isi tangki → bilas tangki dengan air → isi air sesuai takaran + disinfektan/penghilang bau**.",
      "Jumlah toilet dan ukuran tangki berbeda menurut tipe pesawat, rute domestik/internasional, dan jumlah penumpang maksimum.",
      "**Perhatian:** saat melepas selang jangan menumpahkan air kotor ke spot — spot bisa tidak dapat dipakai sampai dibersihkan.",
      "**Lavatory car (汚水車)**: tangki air kotor ± 2.000 L + tangki air bersih ± 2.000 L, selang, alat pengisi (tekanan maks. 3,0 kg/㎡)."])],
   [("ul", [
      "{飛行中|ひこうちゅう}にトイレの{汚水|おすい}は{専用|せんよう}タンクにたまり、{着陸後|ちゃくりくご}に{機外|きがい}へ{出|だ}します。{汚水|おすい}を{出|だ}す→タンクを{水|みず}で{洗|あら}う→{決|き}まった{量|りょう}の{水|みず}と{殺菌|さっきん}{消臭剤|しょうしゅうざい}を{入|い}れる、の{順|じゅん}です。",
      "ホースを{外|はず}すとき、{汚水|おすい}をこぼしてスポットをよごしてはいけません。そうじが{終|お}わるまでスポットが{使|つか}えなくなることがあります。",
      "{汚水車|おすいしゃ}（ラバトリー・カー）は、{汚水用|おすいよう}タンク{約|やく}2,000ℓと{清水用|せいすいよう}タンク{約|やく}2,000ℓをもつ{車|くるま}です。"])]),
  ("b3s3", "Pendingin Kabin (Low-pressure Air)", "機内空調サービス", [24, 24], [
    ("ul", [
      "Memakai **air conditioning pit** di spot (sumber udara dari fasilitas bawah apron). Tarik **selang besar** sepenuhnya, **luruskan yang terpuntir**, bawa ke dekat access panel kopling pesawat. Selang terpuntir → udara kurang masuk dan **kopling pesawat bisa rusak**.",
      "Buka access panel, sambungkan selang ke kopling, lalu nyalakan **saklar di control panel** fasilitas. Jumlah/letak kopling berbeda menurut tipe (biasanya 1–2), ukuran fitting hampir sama.",
      "Sebelum mengoperasikan, pastikan **pintu pesawat terbuka** (sebagai jalan keluar udara).",
      "Air dingin (musim panas) / uap (musim dingin) dari plant pendingin–pemanas kawasan dikirim ke tiap spot; **heat exchanger** dan blower di bawah apron mendinginkan/menghangatkan udara."])],
   [("ul", [
      "{駐機場|ちゅうきじょう}の{地面|じめん}にあるエアコン・ピットを{使|つか}います。{太|ふと}いホースを{全部|ぜんぶ}{出|だ}して、ねじれを{直|なお}してから、{機体|きたい}のカップリングにつなぎます。ねじれたままだと{空気|くうき}が{入|はい}らず、カップリングがこわれることがあります。",
      "ホースをつないだら、コントロール・パネルのスイッチを{入|い}れて{空気|くうき}を{送|おく}ります。{始|はじ}める{前|まえ}に、{空気|くうき}の{出口|でぐち}になる{機体|きたい}のドアが{開|あ}いていることを{確認|かくにん}します。"])]),
  ("b3s4", "Listrik Darat (GPU)", "地上電源供給作業", [25, 26], [
    ("ul", [
      "**GPU (Ground Power Unit)** memasok listrik dari luar ke pesawat yang parkir untuk lampu kabin dan berbagai perangkat; juga menjaga lingkungan kabin dan **mengurangi beban lingkungan (dekarbonisasi)** dengan menghentikan **APU**.",
      "**GPU tetap (埋設型)**: banyak di spot tetap bandara besar (Haneda, Narita; tempat ber-PBB). Buka tutup **pit** di apron, tarik kabel, colokkan ke soket dekat hidung pesawat.",
      "**GPU bergerak (地上電源車)**: truk ber-generator diesel besar (mis. **AC 115 V / 400 Hz**). Kini dikembangkan **eGPU** bertenaga baterai lithium-ion tanpa emisi.",
      "Saat menyambung/melepas, **pastikan keselamatan sekitar dan kondisi soket pesawat**; ikuti prosedur.",
      "Langkah: ① cek **tegangan/frekuensi** ② buka **panel listrik eksternal** pesawat ③ sambung kabel dan pasang **fitting belt** ④ ON-kan saklar pasokan ⑤ pastikan lampu **CONNECTED** dan **NOT IN USE** menyala."])],
   [("ul", [
      "{地上電源|ちじょうでんげん}（GPU）は、{止|と}まっている{飛行機|ひこうき}に{外|そと}から{電気|でんき}を{送|おく}る{設備|せつび}・{車|くるま}です。APUを{止|と}められるので{環境|かんきょう}にもよいです。",
      "{固定式|こていしき}GPU（{埋設型|まいせつがた}）は、{地面|じめん}のピットからケーブルを{出|だ}して{機首|きしゅ}{近|ちか}くの{接続口|せつぞくこう}に{差|さ}します。{移動式|いどうしき}GPU（{地上電源車|ちじょうでんげんしゃ}）は、{発電機|はつでんき}をのせた{車|くるま}です。{最近|さいきん}は{排出|はいしゅつ}ガスゼロのeGPUが{増|ふ}えています。",
      "{手順|てじゅん}：①{電圧|でんあつ}・{周波数|しゅうはすう}を{確認|かくにん} ②{外部電源|がいぶでんげん}パネルを{開|あ}ける ③ケーブルをつなぎ、ベルトをつける ④スイッチをONにする ⑤CONNECTEDライトとNOT IN USEライトの{点灯|てんとう}を{確認|かくにん}する。"])]),
 ]),
 ("bab4", 4, "Bagasi & Kargo", "手荷物・貨物の仕分け作業", "Menyortir bagasi (keberangkatan/kedatangan), menyortir kargo, tag/care mark, forklift, dan bea cukai.", [27, 32], [
  ("b4s1", "Penyortiran Bagasi (手荷物仕分け)", "手荷物仕分け作業", [27, 29], [
    ("h", "Keberangkatan (出発作業)"),
    ("ul", [
      "Bagasi yang dititipkan saat check-in diberi **claim tag** dan dikirim dengan konveyor ke tempat sortir menurut **maskapai dan tujuan**; di sana disusun ke kontainer/bulk cart menurut **kota transit, kelas, dan tag bagasi khusus**.",
      "**HHT (Handheld Terminal)**: pemindai nirkabel untuk membaca barcode tag bagasi/kontainer dan menghubungkannya ke **BRS** maskapai secara real-time; layar menampilkan **nomor penerbangan, tujuan, kelas**. Cek layar secara visual untuk mencegah **salah muat**.",
      "Tag khusus: **取扱注意** (butuh penanganan hati-hati), **ペット** (taruh di tempat teduh berangin), **重量物** (jangan memaksakan, bahaya pinggang).",
      "Jumlah bagasi di kontainer dilaporkan ke petugas **Weight & Balance**, yang menentukan posisi muat dan membuat Instruction Sheet; petugas sisi pesawat memuat sesuai itu. Menjelang berangkat, keputusan cepat dan tepat sangat penting demi ketepatan waktu."]),
    ("h", "Kedatangan (到着作業)"),
    ("ul", [
      "Bagasi dari kontainer/bulk dikirim ke konveyor khusus kedatangan sambil memperhatikan **prioritas** (bagasi First Class dll.) dan tag khusus, lalu diserahkan ke penumpang.",
      "Selesai: cek lagi di dalam kontainer, bulk cart, dan **di bawah GSE** agar tidak ada yang tertinggal.",
      "Dekat konveyor kedatangan banyak orang bekerja; saat GSE mulai jalan, pengemudi/petugas sekitar **memberi tahu orang di sekitar**."])],
   [("h", "{出発作業|しゅっぱつさぎょう}"),
    ("ul", [
      "{預|あず}かった{手荷物|てにもつ}にはクレーム・タグを{付|つ}け、コンベヤーで{航空会社|こうくうがいしゃ}・{行|い}き{先|さき}べつの{仕分|しわ}け{場|ば}に{送|おく}ります。{経由地|けいゆち}・クラス・{特殊|とくしゅ}タグべつに、コンテナやバルク・カートに{積|つ}みます。",
      "HHT（ハンディターミナル）で、タグやコンテナのバーコードを{読|よ}み、{画面|がめん}の{便名|びんめい}・{行|い}き{先|さき}・クラスを{目|め}で{確認|かくにん}して、{誤搭載|ごとうさい}を{防|ふせ}ぎます。",
      "{特殊|とくしゅ}タグ：{取扱注意|とりあつかいちゅうい}、ペット、{重量物|じゅうりょうぶつ}など。{重|おも}い{物|もの}は{腰|こし}をいためないようにムリをしません。",
      "コンテナに{積|つ}んだ{個数|こすう}をウエイト・アンド・バランス{担当|たんとう}に{伝|つた}えます。{担当者|たんとうしゃ}が{搭載|とうさい}{位置|いち}を{決|き}めてインストラクション・シートを{作|つく}ります。"]),
    ("h", "{到着作業|とうちゃくさぎょう}"),
    ("ul", [
      "コンテナやバルクから{降|お}ろした{手荷物|てにもつ}を、{優先|ゆうせん}{順位|じゅんい}（ファーストクラスなど）に{注意|ちゅうい}して、{到着|とうちゃく}{専用|せんよう}のコンベヤーでお{客様|きゃくさま}に{渡|わた}します。{終|お}わったら{積|つ}み{残|のこ}しがないか{確認|かくにん}します。",
      "コンベヤーの{近|ちか}くは{人|ひと}が{多|おお}いので、GSEが{動|うご}くときは{周|まわ}りの{人|ひと}に{知|し}らせます。"])]),
  ("b4s2", "Penyortiran Kargo (貨物仕分け)", "貨物仕分け作業", [30, 32], [
    ("h", "Kargo udara"),
    ("ul", [
      "Kargo udara kini luas: barang umum, **makanan segar**, paket kurir, pindahan, mesin besar. Pesawat kargo bisa membawa **100 ton lebih**.",
      "Alur: terima (partai kecil/agen) → terbitkan **tag tujuan** (Figure 6; mis. awalan **205 = ANA**, **Master Air Way Bill**) dan sortir menurut tujuan → barang khusus ditandai **tag kargo khusus / care mark** → dimuat ke kontainer/bulk cart.",
      "**Perjanjian angkut kargo (貨物運送約款)** dipublikasikan maskapai; kontrak sah saat pengirim (荷送人) menyetujui dan mengajukan angkutan."]),
    ("h", "Tag khusus & care mark"),
    ("ul", [
      "**なまもの**: makanan segar/bunga — waspadai kebocoran air. **小動物**: hewan hidup — tempat teduh berangin, cara muat tergantung jenis.",
      "**取扱注意** (jangan diberi benturan; mesin presisi), **こわれもの** (mudah pecah; kaca/keramik), **水濡れ厳禁** (lindungi dari air; komponen elektronik), **天地無用** (jangan dibalik/ditumpuk menyamping), **上積み制限** (batas jumlah tumpukan; mis. maks. 6 tingkat)."]),
    ("h", "Forklift & Bea Cukai"),
    ("ul", [
      "**Forklift** bandara: mesin atau motor listrik; lebih berat dan bertenaga dari mobil seukuran. Jangan masuk **di bawah garpu / muatan yang terangkat**, jangan mendekat dalam **1,5 m** dari garpu yang bergerak, jangan di **belakang** forklift (saat bongkar muat umumnya **mundur**).",
      "**Kargo internasional (外国貨物)** butuh **通関 (bea cukai)**: ① hasil produksi dalam negeri yang sudah izin ekspor ② barang masuk dari luar negeri yang belum izin impor ③ pengangkutan antar kawasan berikat (**保税運送**) ④ barang yang sementara disimpan di kawasan berikat untuk dipindah ke pesawat internasional lain (**仮陸揚げ貨物**)."])],
   [("h", "{航空貨物|こうくうかもつ}"),
    ("ul", [
      "{航空貨物|こうくうかもつ}は、{生鮮食料品|せいせんしょくりょうひん}・{宅配|たくはい}・{大型|おおがた}{機械|きかい}など{広|ひろ}い{物|もの}を{運|はこ}びます。{貨物専用機|かもつせんようき}は1{機|き}で100トン{以上|いじょう}{運|はこ}べます。",
      "{受|う}け{付|つ}け→{行先|ゆきさき}タグを{発行|はっこう}して{仕分|しわ}け→{特殊|とくしゅ}{貨物|かもつ}はタグやケアマークで{区別|くべつ}→コンテナやバルク・カートに{積|つ}む、の{順|じゅん}です。",
      "{運送|うんそう}のきまり「{貨物運送約款|かもつうんそうやっかん}」を{荷送人|におくりにん}が{承諾|しょうだく}すると、{契約|けいやく}が{成立|せいりつ}します。"]),
    ("h", "タグ・ケアマーク"),
    ("ul", [
      "{生|なま}もの：{水|みず}もれに{注意|ちゅうい}。{小動物|しょうどうぶつ}：{日陰|ひかげ}で{風通|かぜとお}しのよい{場所|ばしょ}に{置|お}きます。",
      "{取扱注意|とりあつかいちゅうい}：{衝撃|しょうげき}をあたえない。こわれもの：ガラスなど。{水濡|みずぬ}れ{厳禁|げんきん}：{水|みず}にぬらさない。{天地無用|てんちむよう}：さかさ・{横積|よこづ}みをしない。{上積|うわづ}み{制限|せいげん}：{重|かさ}ねられる{段数|だんすう}。"]),
    ("h", "フォークリフト・{通関|つうかん}"),
    ("ul", [
      "フォークや、{持|も}ち{上|あ}げた{荷物|にもつ}の{下|した}に{入|はい}ってはいけません。{動|うご}いているフォークの1.5m{以内|いない}に{近|ちか}づいてはいけません。{荷役中|にやくちゅう}は{後進|こうしん}が{基本|きほん}なので、{後|うし}ろに{近|ちか}づいてはいけません。",
      "{国際線|こくさいせん}の{貨物|かもつ}は、{税関|ぜいかん}の{審査|しんさ}を{受|う}ける{手続|てつづ}き（{通関|つうかん}）が{必要|ひつよう}です。"])]),
 ]),
 ("bab5", 5, "Pembersihan Kabin & Perlengkapan Kabin", "機内清掃・客室用品", "Jenis pembersihan kabin, titik-titik pembersihan, dan memuat/menurunkan perlengkapan kabin (katering).", [33, 38], [
  ("b5s1", "Pembersihan Kabin (機内清掃)", "機内清掃作業", [33, 35], [
    ("ul", [
      "Pekerjaan berbeda menurut tujuan/tipe/tanggal → cek informasi dasar dahulu.",
      "Jenis: **飛行間作業** (antara kedatangan dan keberangkatan berikutnya, domestik), **飛行後作業** (malam hari setelah operasi domestik selesai, sekali sehari), **国際線作業** (antar penerbangan internasional), **特別作業** (bongkar-muat semua barang saat perawatan berkala).",
      "**GSE: trash car** — truk berhatch; sampah dilempar dari atas PBB.",
      "**Titik pembersihan antar-penerbangan:** *Kursi* — rapikan sabuk sesuai bentuk maskapai (八の字型/一文字型), isi kantong kursi (majalah, kartu keselamatan, kantong muntah), ganti yang kotor/rusak, cek sampah/barang tertinggal/**barang mencurigakan**, ganti headset bekas. *Galley* — buang sampah, kunci pintu tempat sampah, lap meja, pel lantai lengket. *Lavatory* — lap dinding/pintu/wastafel/cermin/kloset, jangan buang selain tisu toilet ke kloset, buang sampah dan kunci, pel lantai, isi ulang perlengkapan. *Kabin lain* — lap dinding/pintu/overhead stowage, ambil sampah besar, vakum sampah kecil (waspadai barang tertinggal/mencurigakan).",
      "Penerbangan **malam** (飛行後) sama dengan antar-penerbangan tetapi lebih teliti, dan memakai **disinfektan** di tempat yang diinstruksikan. **Internasional**: ditambah penggantian isi kantong kursi dan linen menurut tujuan/kelas; butuh banyak orang."]),
    ("note", "WAJIB: **kartu keselamatan (安全のしおり)** harus ada di semua kursi, sesuai tipe pesawat, **judul menghadap depan**. Barang tertinggal (dompet, HP, paspor) → lapor lewat penanggung jawab dengan jalur yang ditentukan, **sebut lokasi temuan**. Barang mencurigakan → lapor ke penanggung jawab.")],
   [("ul", [
      "{機内清掃|きないせいそう}は、{行|い}き{先|さき}・{機種|きしゅ}・{出発日|しゅっぱつび}で{作業|さぎょう}が{変|か}わるので、{基本情報|きほんじょうほう}を{確認|かくにん}します。",
      "{飛行間作業|ひこうかんさぎょう}（{国内線|こくないせん}の{到着|とうちゃく}～{出発|しゅっぱつ}の{間|あいだ}）、{飛行後作業|ひこうごさぎょう}（{夜|よる}・1{日|にち}1{回|かい}）、{国際線作業|こくさいせんさぎょう}、{特別作業|とくべつさぎょう}（{整備|せいび}にあわせて{荷物|にもつ}を{全部|ぜんぶ}{出|だ}し{入|い}れ）があります。",
      "{座席|ざせき}：ベルトの{形|かたち}をそろえ、ポケットの{中|なか}（{機内誌|きないし}・{安全|あんぜん}のしおりなど）を{整|ととの}え、ゴミ・{忘|わす}れ{物|もの}・{不審物|ふしんぶつ}がないか{見|み}ます。ギャレー：ゴミ{箱|ばこ}を{出|だ}し、ふき、ゆかをふきます。ラバトリー：かべ・{洗面台|せんめんだい}・{鏡|かがみ}・{便器|べんき}をふき、{用品|ようひん}を{補充|ほじゅう}します。トイレにはトイレットペーパー{以外|いがい}を{流|なが}してはいけません。",
      "{安全|あんぜん}のしおりは、{必|かなら}ず{全部|ぜんぶ}の{席|せき}に、その{機体|きたい}に{合|あ}うものを、{表題|ひょうだい}が{見|み}えるようにセットします。",
      "{忘|わす}れ{物|もの}（{財布|さいふ}・{携帯|けいたい}・パスポートなど）や{不審物|ふしんぶつ}を{見|み}つけたら、{責任者|せきにんしゃ}を{通|とお}して{報告|ほうこく}します。{見|み}つけた{場所|ばしょ}も{伝|つた}えます。"])]),
  ("b5s2", "Perlengkapan Kabin (客室用品の搭降載)", "客室用品の搭降載作業", [36, 38], [
    ("ul", [
      "Perlengkapan kabin termasuk **makanan dalam pesawat** dan barang jualan. Disimpan di gudang, dimuat per penerbangan ke kereta khusus (**roll box pallet, meal cart**), lalu diangkut ke pesawat dan dimasukkan lewat **pintu pesawat**.",
      "**GSE:** **cabin service car** (dipasang di pintu belakang untuk membersihkan kabin; bak bisa naik-turun) dan **food loader** (mengangkut makanan ke galley; ber-**pendingin**).",
      "**Pekerjaan gudang (庫内作業)**: standar muat berbeda menurut tipe, rute, jumlah kursi → cek jenis & jumlah, masukkan ke kit per penerbangan, cek ulang sebelum diangkut.",
      "**Memasang kendaraan ke pesawat:** pemandu ditempatkan; kendaraan berhenti di posisi lalu **outrigger** dikembangkan; bak dinaikkan dengan **lantai bak sedikit di bawah lantai kabin** (karena pesawat turun saat dimuati kargo/bahan bakar, agar pintu yang membuka keluar tidak rusak); **platform bergerak** dimajukan dekat badan pesawat dan dikunci agar orang/barang tidak jatuh; lalu pintu dibuka. Ini **kerja di ketinggian** → patuhi prosedur.",
      "**Memuat/menurunkan:** kumpulkan barang bekas dulu, lalu muat barang baru dengan cepat. Perlengkapan wajib hukum (kit obat, dll.) harus diletakkan **di tempat dan jumlah yang ditentukan** demi keseimbangan pesawat. Koordinasi dengan awak kabin dan petugas kebersihan.",
      "Selesai: penanggung jawab cek akhir dan lapor ke penanggung jawab maskapai (awak kabin); tutup pintu, lepas kendaraan."]),
    ("note", "WAJIB: ① cek **rem/kunci peralatan** (galley dll.) sebelum dipakai ② saat mendorong kereta di lorong sempit, **titik buta di posisi rendah** → hati-hati bertabrakan ③ semua tempat penyimpanan/kontainer punya **kunci anti-lontar** → pastikan terkunci ④ kabin internasional diperlakukan seperti **luar negeri menurut hukum bea cukai**: ikuti instruksi kepala bea cukai; membawa keluar rokok, minuman keras, majalah = **penyelundupan (密輸)**, dihukum; kaleng kosong/sampah dibuang menurut cara yang ditentukan.")],
   [("ul", [
      "{客室用品|きゃくしつようひん}（{機内食|きないしょく}・{販売品|はんばいひん}など）は、{倉庫|そうこ}から{搬送台車|はんそうだいしゃ}（ロールボックスパレット・ミールカート）に{積|つ}み、{搬送車|はんそうしゃ}で{飛行機|ひこうき}の{ドア|ドア}から{入|い}れます。",
      "キャビン・サービス・カーは{機内|きない}そうじ{用|よう}の{車|くるま}、フード・ローダー{車|しゃ}は{食品|しょくひん}を{運|はこ}ぶ{冷却|れいきゃく}{装置|そうち}つきの{車|くるま}です。",
      "{搬送車|はんそうしゃ}は、アウトリガーを{出|だ}し、{荷台|にだい}の{床|ゆか}を{機体|きたい}の{床|ゆか}より{少|すこ}し{低|ひく}くして{上|あ}げます。{機体|きたい}が{沈|しず}むので、ドアをこわさないためです。{作業員|さぎょういん}や{物|もの}が{落|お}ちないよう、プラットフォームを{固定|こてい}します。{高|たか}い{所|ところ}の{作業|さぎょう}なので{手順|てじゅん}を{守|まも}ります。",
      "{使用済|しようず}みの{用品|ようひん}を{回収|かいしゅう}してから、{必要|ひつよう}な{用品|ようひん}を{決|き}まった{場所|ばしょ}に{決|き}まった{数|かず}だけ{入|い}れます。ロック{装置|そうち}は{全部|ぜんぶ}かけます。",
      "{国際線|こくさいせん}の{機内|きない}は、{税関法|ぜいかんほう}では{外国|がいこく}と{同|おな}じです。タバコ・お{酒|さけ}・{雑誌|ざっし}などを{持|も}ち{出|だ}すと{密輸|みつゆ}になり、{罰|ばっ}せられます。"])]),
 ]),
 ("bab6", 6, "Pengisian Bahan Bakar (給油作業)", "給油作業", "Fueler dan servicer, avtur, jumlah bahan bakar (fuel order), sistem fueler vs hydrant, dan prosedur pengisian.", [39, 41], [
  ("b6s1", "Pengisian Bahan Bakar", "給油作業", [39, 41], [
    ("h", "Dasar"),
    ("ul", [
      "Pengisian bahan bakar sebenarnya **bagian dari pekerjaan perawatan maskapai**: prosedur **mengikuti manual maskapai**, kualifikasi petugas disertifikasi maskapai (atau perusahaan minyak yang ditunjuk), dan **pemeriksaan akhir dilakukan mekanik berlisensi maskapai**.",
      "**Fueler (フューエラー)**: truk bahan bakar dengan tangki avtur, **pompa**, flow meter, filter. **Servicer (サービサー)**: truk dengan flow meter, filter, selang — dipakai pada sistem hydrant.",
      "Pesawat **tidak diisi penuh** kecuali penerbangan sangat jauh/khusus, karena bahan bakar yang dibawa menambah berat sehingga konsumsi mesin juga naik. Jumlah dari maskapai dibagi ke tiap tangki.",
      "Avtur: hasil olahan minyak bumi, dibagi **bensin penerbangan** dan **jet fuel**.",
      "**Fuel order** = **bandara tujuan + bandara alternatif (bila tujuan tak bisa didarati) + cadangan**; dihitung menurut tipe, tujuan, cuaca, jumlah penumpang, muatan, sesuai **aturan operasi** maskapai (berdasarkan Undang-undang Penerbangan)."]),
    ("h", "Dua sistem"),
    ("ul", [
      "**Fueler**: tanpa hydrant, memakai pompa fueler; dipakai di sebagian besar **bandara daerah**; bisa juga **menyedot** bahan bakar dari pesawat.",
      "**Hydrant**: tangki di fasilitas → **pipa bawah tanah** ke tiap spot → **hydrant valve** → servicer → pompa tetap fasilitas menekan ke pesawat."]),
    ("h", "Prosedur (fueler)"),
    ("ul", [
      "① Fueler masuk & parkir di posisi ② kunci (ganjal roda) ③ pasang **tanda area bahaya** (safety cone/bendera) ④ pasang **arde anti-statis** (tanah ⇔ fueler ⇔ pesawat) ⑤ buka access door ⑥ pasang **delivery unit** ⑦ buka **fueling station panel** pesawat ⑧ cek jumlah bersama mekanik maskapai ⑨ cek **kualitas** BBM; mulai setelah penumpang selesai turun ⑩ isi sampai jumlah ⑪ cek jumlah (indikator kokpit ⇔ totalizer) ⑫ lepas dengan urutan terbalik ⑬ fueler pergi.",
      "Hydrant: sama, ditambah memasang **intake unit** (hydrant pit ⇔ servicer).",
      "Tiga hal terpenting: **cek kualitas**, **keselamatan** (barang berbahaya dalam jumlah besar), dan **mengisi sesuai fuel order dengan tepat dan cepat**."])],
   [("ul", [
      "{給油作業|きゅうゆさぎょう}は、{本来|ほんらい}{航空会社|こうくうがいしゃ}の{整備作業|せいびさぎょう}の{一部|いちぶ}です。{手順|てじゅん}は{航空会社|こうくうがいしゃ}のマニュアルに{従|したが}い、{最後|さいご}の{確認|かくにん}は{資格|しかく}のある{整備士|せいびし}が{行|おこな}います。",
      "フューエラーは{航空燃料|こうくうねんりょう}タンクとポンプをもつ{給油車|きゅうゆしゃ}、サービサーはハイドラント{方式|ほうしき}で{使|つか}う{給油車|きゅうゆしゃ}です。",
      "{飛行機|ひこうき}は、{燃料|ねんりょう}を{満|まん}タンクにしません。{燃料|ねんりょう}が{重|おも}いと、{使|つか}う{燃料|ねんりょう}も{増|ふ}えるからです。",
      "{燃料|ねんりょう}オーダー＝{目的|もくてき}{空港|くうこう}＋{代替|だいたい}{空港|くうこう}＋{予備|よび}{燃料|ねんりょう}です。",
      "フューエラー{方式|ほうしき}は{地方|ちほう}{空港|くうこう}に{多|おお}く、{燃料|ねんりょう}を{抜|ぬ}くこともできます。ハイドラント{方式|ほうしき}は、{地下|ちか}の{配管|はいかん}で{各|かく}スポットに{燃料|ねんりょう}を{送|おく}ります。",
      "{手順|てじゅん}：{車|くるま}を{止|と}める→{車輪止|しゃりんど}め→{危険|きけん}{区域|くいき}の{表示|ひょうじ}→{静電気|せいでんき}{除去|じょきょ}のアース→ホース{取|と}り{付|つ}け→{整備士|せいびし}と{量|りょう}を{確認|かくにん}→{燃料|ねんりょう}の{品質|ひんしつ}を{確認|かくにん}して{給油|きゅうゆ}→{量|りょう}を{確認|かくにん}→{逆|ぎゃく}の{順|じゅん}で{取|と}り{外|はず}す。",
      "{大切|たいせつ}なことは、{品質|ひんしつ}の{確認|かくにん}、{危険物|きけんぶつ}を{扱|あつか}う{安全|あんぜん}、{指示|しじ}された{量|りょう}を{確実|かくじつ}に{早|はや}く{入|い}れることです。"])]),
 ]),
 ("bab7", 7, "Layanan Penumpang (Ground Staff) & Kode Bandara", "旅客サービス・コード", "Check-in, bagasi tercatat, gate, kedatangan, transit, special assistance, irregular, dan kode 2/3 huruf.", [42, 52], [
  ("b7s1", "Layanan Keberangkatan", "出発時のサービス", [42, 44], [
    ("h", "Check-in counter"),
    ("ul", [
      "Internasional: cek **tiket, paspor, visa / otorisasi perjalanan elektronik**. Domestik: **tiket dan tanda pengenal**. Cocokkan data reservasi dengan dokumen; cek masa berlaku paspor dan syarat masuk negara tujuan.",
      "**Penentuan kursi** sesuai permintaan (jendela/lorong, kursi roda, anak) dan **penerbitan boarding pass** (nama, jam, tujuan, nomor penerbangan, gate, nomor kursi)."]),
    ("h", "Bagasi tercatat"),
    ("ul", [
      "Terima & periksa: cek **kerusakan luar**, tanyakan **barang berbahaya**. Cek **berat/ukuran**; bila melebihi aturan, tarik **biaya kelebihan**.",
      "Pasang **tag tujuan** dan berikan **claim tag** ke penumpang. Pandu agar barang terlarang (pisau, gunting) / berbahaya (gas bertekanan tinggi) **dimasukkan ke bagasi tercatat** dan bukan kabin."]),
    ("h", "Lobi & self-service"),
    ("ul", [
      "Informasi fasilitas dan keberangkatan: pemeriksaan keamanan, gate, informasi **delay/pembatalan**, pertanyaan umum (duty free, penukaran uang).",
      "**Mesin check-in otomatis** (check-in, ubah kursi, mileage, cetak tag, kuitansi); **SBD (Self Bag Drop)** — penumpang menaruh sendiri bagasi di konveyor."]),
    ("h", "Di GATE"),
    ("ul", [
      "Sebelum boarding: **briefing** dengan awak kabin (jumlah penumpang, penumpang butuh bantuan, transit, kesiapan pesawat); cek **PBB** dan konter; cek bagasi kabin yang melebihi ukuran.",
      "**Boarding**: pengumuman **prioritas/kelas** dalam bahasa Jepang dan Inggris; **scan** boarding pass + paspor untuk memantau penumpang secara real-time.",
      "Tanpa scanner: **もぎり** (potong kupon) lalu cocokkan dengan sistem; cocokkan **manifes kertas** satu per satu (**head count**); prioritaskan kursi roda, ibu hamil, anak.",
      "**Delay/masalah**: umumkan segera; siapkan **pengganti** (penerbangan lain, hotel, makan); **cari penumpang yang belum naik** — bila tak ketemu, lakukan **offload** bagasinya dari pesawat; **tolak boarding** (penggunaan tidak sah, mabuk) demi keselamatan.",
      "Penutup: setelah semua naik, lapor **jumlah akhir** ke awak kabin/petugas operasi lalu **door close**."])],
   [("ul", [
      "{旅客|りょかく}サービス（グランドスタッフ）は、{空港|くうこう}に{着|つ}いてから{目的地|もくてきち}で{降|お}りるまでを{助|たす}ける{仕事|しごと}です。",
      "チェックイン：{国際線|こくさいせん}は{航空券|こうくうけん}・パスポート・ビザを{確認|かくにん}し、{国内線|こくないせん}は{航空券|こうくうけん}と{身分証明書|みぶんしょうめいしょ}を{確認|かくにん}します。{座席|ざせき}を{決|き}めて{搭乗券|とうじょうけん}を{出|だ}します。",
      "{預|あず}け{手荷物|てにもつ}：{外|そと}の{破損|はそん}と{危険物|きけんぶつ}を{確認|かくにん}し、{重量|じゅうりょう}・サイズを{見|み}ます。{行|い}き{先|さき}タグをつけて、クレーム・タグを{渡|わた}します。ナイフやハサミ、{高圧|こうあつ}ガスなどは{預|あず}け{荷物|にもつ}に{入|い}れてもらいます。",
      "ゲート：{搭乗|とうじょう}{前|まえ}にCAとブリーフィングをします。{日本語|にほんご}と{英語|えいご}で{案内|あんない}し、{搭乗券|とうじょうけん}とパスポートをスキャンします。スキャナーがないときは{半券|はんけん}を{切|き}って{人数|にんずう}を{確認|かくにん}します（ヘッドカウント）。",
      "おくれやトラブルのときは、すぐに{案内|あんない}して{代|か}わりの{便|びん}・ホテル・{食事|しょくじ}を{用意|ようい}します。{乗|の}っていない{人|ひと}は{探|さが}し、{見|み}つからなければ{荷物|にもつ}を{降|お}ろします（オフロード）。",
      "{全員|ぜんいん}の{搭乗|とうじょう}を{確認|かくにん}したら、{最後|さいご}の{人数|にんずう}をCAに{報告|ほうこく}して、ドアを{閉|し}めます。"])]),
  ("b7s2", "Kedatangan, Transit, Special Assistance, Irregular", "到着・乗り継ぎ・スペシャルアシスタンス", [44, 45], [
    ("h", "Kedatangan & Transit"),
    ("ul", [
      "**Baggage claim**: awasi dan rapikan pengembalian bagasi. **Masalah bagasi** (hilang/rusak): cari, perbaiki, urus pengiriman. **Info kedatangan**: imigrasi, pintu keluar, transportasi umum.",
      "**Transit**: prioritaskan penumpang yang waktunya sempit (mis. karena delay). Pahami **MCT** — ditentukan oleh **jarak pindah, jenis prosedur (domestik/internasional), kombinasi maskapai**."]),
    ("h", "Special assistance"),
    ("ul", [
      "Sasaran: pengguna **kursi roda**, tunanetra/tunarungu, lansia, cedera, **ibu hamil**, membawa anak, **anak bepergian sendiri**.",
      "Bantuan: pemandu dengan kart/kursi roda; konter khusus & **prioritas boarding**; bantuan ke kursi, **kursi roda dalam kabin**; setelah mendarat: bantu turun, ambil bagasi, serahkan ke penjemput.",
      "Medis: cek **surat keterangan dokter** (layak terbang), izin membawa **tabung oksigen** dan alat **cuci darah**, kursi untuk **tandu (stretcher)**.",
      "Koordinasi reservasi: cek lebih dulu **ukuran kursi roda** dan **jenis baterai** (lithium-ion = termasuk barang berbahaya?); tempatkan staf bantuan sesuai data reservasi."]),
    ("h", "Irregular terakhir"),
    ("ul", ["Karena cuaca/gangguan pesawat: selesaikan **pemindahan penerbangan** dan **hotel**, susun ulang rencana perjalanan penumpang."])],
   [("ul", [
      "{到着|とうちゃく}：バゲージ・クレームで{手荷物|てにもつ}の{返却|へんきゃく}を{見守|みまも}ります。ロストバゲージや{破損|はそん}は{探|さが}したり{修理|しゅうり}したりします。{入国審査|にゅうこくしんさ}・{出口|でぐち}・{交通|こうつう}の{案内|あんない}もします。",
      "{乗|の}り{継|つ}ぎ：{時間|じかん}がない{旅客|りょかく}を{優先|ゆうせん}して{案内|あんない}します。MCT（{最低|さいてい}{接続|せつぞく}{時間|じかん}）は「{移動|いどう}{距離|きょり}」「{手続|てつづ}きの{種類|しゅるい}」「{航空会社|こうくうがいしゃ}の{組|く}み{合|あ}わせ」で{決|き}まります。",
      "スペシャルアシスタンス：{車椅子|くるまいす}・{目|め}や{耳|みみ}が{不自由|ふじゆう}・{高齢者|こうれいしゃ}・{妊娠中|にんしんちゅう}・{子供連|こどもづ}れ・{子供|こども}の{一人旅|ひとりたび}の{人|ひと}を{助|たす}けます。",
      "{医療|いりょう}：{診断書|しんだんしょ}で{飛行機|ひこうき}に{乗|の}れるか{確認|かくにん}し、{酸素|さんそ}ボンベ・{人工透析|じんこうとうせき}{機|き}の{持|も}ち{込|こ}みを{許可|きょか}します。ストレッチャー{用|よう}の{座席|ざせき}も{用意|ようい}します。",
      "{車椅子|くるまいす}のサイズやバッテリーの{種類|しゅるい}（リチウムイオンなど）を{先|さき}に{確認|かくにん}します。",
      "{天気|てんき}や{機材|きざい}トラブルのときは、{振替|ふりかえ}やホテルを{手配|てはい}して、お{客様|きゃくさま}の{旅|たび}を{組|く}み{直|なお}します。"])]),
  ("b7s3", "Kode Bandara 3 Huruf / Maskapai 2 Huruf", "スリーレター・コード（Reference）", [46, 52], [
    ("ul", [
      "Lampiran buku: **kode 3 huruf bandara** (IATA) dan **kode 2 huruf maskapai**. Bandara luar negeri contoh: **JFK** = New York John F. Kennedy; **LAX** = Los Angeles; **SIN** = Singapura; **CGK** = Jakarta Soekarno-Hatta; **BKK** = Bangkok; **ICN** = Seoul Incheon; **HKG** = Hong Kong; **CDG** = Paris Charles de Gaulle; **LHR** = London Heathrow; **SYD** = Sydney; **MNL** = Manila; **SGN** = Ho Chi Minh; **HAN** = Hanoi; **DAC** = Dhaka; **KUL** = Kuala Lumpur.",
      "Tabel buku: **A** kode bandara luar negeri, **B** kode bandara Jepang, **C** kode maskapai dunia (2 huruf, 3 huruf, **Prefix** nomor kargo), **D** kode maskapai Jepang. Contoh Prefix: **205 = ANA**.",
      "Kode dipakai di **tag bagasi, tag tujuan kargo, dan monitor informasi**."])],
   [("ul", [
      "{巻末|かんまつ}の{資料|しりょう}に、{空港|くうこう}のスリーレター・コードと{航空会社|こうくうがいしゃ}のツーレター・コードがのっています。",
      "{例|れい}：JFK＝ニューヨーク、LAX＝ロサンゼルス、SIN＝シンガポール、CGK＝ジャカルタ、BKK＝バンコク、ICN＝ソウル・{仁川|インチョン}、HKG＝{香港|ホンコン}、CDG＝パリ、LHR＝ロンドン。",
      "コードは、{手荷物|てにもつ}のタグ、{貨物|かもつ}の{行先|ゆきさき}タグ、{情報|じょうほう}モニターなどで{使|つか}います。"])]),
 ]),
]
import aviation_gh_text1 as _T1
BABS.append(_T1.BAB8)
