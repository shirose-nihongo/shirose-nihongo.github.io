# -*- coding: utf-8 -*-
"""Data modul Aviation — Aircraft Maintenance (航空機整備).
Sumber: JAEA 特定技能評価試験テキスト 3 buku: 「航空機の基本技術（締結、電気計測）」「作業安全・品質」「航空機概要」 (Rev. ORG 2019.9.13).
Buku JP gabungan: hal. 1–26 = Teks 1, hal. 27–46 = Teks 2, hal. 47–70 = Teks 3. Ringkasan ID/JP ditulis ulang oleh Shirose Nihongo (bukan terjemahan resmi)."""
SRC = "JAEA 特定技能評価試験テキスト 航空機整備 (3 buku, Rev. ORG 2019.9.13) (diringkas Shirose)"
BABS = [
 ("bab1", 1, "Teknik Dasar: Pengencangan (Fastening)", "航空機の基本技術：締結一般", "Baut, mur, sekrup, ring (washer), torsi pengencangan, safety wire, dan cotter pin.", [5, 21], [
  ("b1s1", "Baut (Bolt)", "ボルト", [5, 8], [
    ("ul", [
      "Pesawat dirakit dari banyak komponen yang disatukan dengan **baut, sekrup, mur**. Tanpa pengetahuan ulir, perawatan pesawat tidak mungkin. Ulir harus tahan **suhu, korosi, getaran hebat**, dan sekali dikencangkan **tidak boleh longgar**.",
      "Baut pesawat dipakai di sambungan yang menerima **beban sangat besar**. Standar: **AN, NAS, BAC**.",
      "Bentuk: **hexagon head**, **clevis**, **eye**, **drilled head**, **internal wrenching**, **external wrenching**, **flush head (kepala tenggelam)**, **modify hexagon head**.",
      "Fungsi: **Shear bolt** — untuk **beban geser**, kepala tipis, ulir pendek. **Tension bolt** — untuk **beban tarik**; yang sangat tinggi → **high-tension bolt**.",
      "Diameter nominal: No.10 – 5/8 in naik per **1/16 in**; 3/4 – 1½ in naik per **1/8 in**. Panjang kelipatan 1/16 in (baut AN banyak kelipatan 1/8 in).",
      "Bagian baut: kepala, **neck**, **grip**, **thread**, lubang cotter pin, lubang safety wire."]),
    ("h", "Penanganan baut"),
    ("ul", [
      "Gunakan **nomor suku cadang yang ditentukan** (kekuatan, tahan korosi, tahan panas).",
      "Kombinasi baut/ring dengan bagian yang dikencangkan: umumnya **paduan aluminium ↔ aluminium**, **baja ↔ baja**; untuk torsi tinggi pakai baja. Baut baja di paduan aluminium → pakai yang **dilapisi kadmium** (kontak logam berbeda = korosi).",
      "**Panjang**: grip sama atau sedikit lebih panjang dari ketebalan bagian. Penyesuaian dengan ring: **maks. 2 di satu sisi, 3 di kedua sisi**; lebih dari itu ganti baut. Pada **shear bolt**, **tidak boleh satu ulir pun** mengenai bagian yang menerima geser.",
      "Arah pemasangan: **depan → belakang, atas → bawah, dalam → luar** (agar baut tak lepas bila mur lepas).",
      "**Baut titanium**: jangan pakai self-locking nut berlapis perak di atas **600°F**; jangan pakai mur berlapis kadmium di atas **200°F**.",
      "**Baut toleransi presisi**: dipukul masuk dengan **palu plastik**; bila bukan flush, lubang sisi kepala di-**chamfer**.",
      "**Internal/external wrenching bolt**: chamfer lubang sesuai **'R'** di bawah kepala atau pakai **ring countersunk kekuatan tinggi**; perhatikan arah ring; pakai **mur kekuatan tinggi**."])],
   [("ul", [
      "{飛行機|ひこうき}の{部品|ぶひん}は、ボルト・スクリュー・ナットなどの「ねじ」でとめられています。ねじは、{温度|おんど}・サビ・{強|つよ}い{振動|しんどう}にたえ、{一度|いちど}しめたらゆるまない{工夫|くふう}があります。",
      "ボルトは{大|おお}きな{力|ちから}がかかる{所|ところ}に{使|つか}います。{規格|きかく}はAN、NAS、BACなどです。",
      "{形|かたち}：{六角頭|ろっかくあたま}、クレビス、アイ、{頭部穴付|とうぶあなつ}き、インターナル・レンチング、エクスターナル・レンチング、{皿頭|さらあたま}など。",
      "シア・ボルトは{剪断力|せんだんりょく}がかかる{所|ところ}に{使|つか}い、{頭|あたま}がうすく、ねじ{部|ぶ}が{短|みじか}いです。テンション・ボルトは{引|ひ}っぱる{力|ちから}がかかる{所|ところ}に{使|つか}います。"]),
    ("h", "ボルトの{取|と}り{扱|あつか}い"),
    ("ul", [
      "{使|つか}う{場所|ばしょ}に{合|あ}った{指定|してい}の{部品番号|ぶひんばんごう}のものを{使|つか}います。",
      "アルミ{合金|ごうきん}にはアルミのボルトとワッシャー、{鋼|はがね}には{鋼|はがね}を{使|つか}います。アルミに{鋼|はがね}のボルトを{使|つか}うときは、カドミウムメッキのものを{使|つか}います（サビ{防止|ぼうし}）。",
      "グリップの{長|なが}さは、{部材|ぶざい}の{厚|あつ}さと{同|おな}じか、わずかに{長|なが}いものです。ワッシャーで{調整|ちょうせい}できるのは、{片側|かたがわ}2{枚|まい}・{両側|りょうがわ}3{枚|まい}までです。シア・ボルトは、ねじ{山|やま}が{一山|ひとやま}も{部材|ぶざい}にかかってはいけません。",
      "{取|と}り{付|つ}ける{向|む}きは、{前|まえ}から{後|うし}ろ、{上|うえ}から{下|した}、{内側|うちがわ}から{外側|そとがわ}です。",
      "チタンボルトは、600°F{以上|いじょう}で{銀|ぎん}メッキのセルフ・ロッキング・ナット、200°F{以上|いじょう}でカドミウムメッキのナットを{使|つか}ってはいけません。{精密|せいみつ}{公差|こうさ}ボルトは、プラスチック・ハンマーで{打|う}ち{込|こ}みます。"])]),
  ("b1s2", "Mur (Nut)", "ナット", [9, 10], [
    ("ul", [
      "Mur pesawat bentuk/ukurannya beragam; berbeda dengan baut, **jarang ada kode identifikasi** → dikenali dari **kilau logam, ada/tidaknya sisipan nilon, struktur, ulir**.",
      "Menurut penguncian: **Non self-locking nut** (tanpa mekanisme kunci) dan **Self-locking nut**. Dipilih menurut **suhu** tempat pemakaian.",
      "Gunakan mur sesuai nomor suku cadang yang ditentukan."]),
    ("h", "Self-locking nut: TIDAK boleh dipakai di"),
    ("ul", [
      "① tempat yang bila mur longgar dan baut hilang **mengganggu keselamatan terbang**",
      "② bagian yang menerima **gaya putar** (puli, engkol, tuas, linkage, hinge pin, cam, dll.)",
      "③ tempat yang bila mur/baut/sekrup longgar bisa **jatuh ke air intake mesin**",
      "④ **panel/pintu** yang dipasang-lepas rutin untuk servis/akses sebelum/sesudah terbang."]),
    ("h", "Aturan"),
    ("ul", [
      "Setelah self-locking nut dipasang, ujung ulir baut harus **menonjol dari muka mur minimal 2 ulir** (termasuk bagian chamfer).",
      "**Jangan memodifikasi/memproses** self-locking nut. **Locking torque** = torsi yang dibutuhkan memutar mur setelah ujung baut menonjol ≥ 2 ulir."])],
   [("ul", [
      "ナットはボルトのような{識別|しきべつ}{記号|きごう}が{少|すく}ないので、{金属|きんぞく}の{光|ひか}り{方|かた}、ナイロンの{有無|うむ}、{構造|こうぞう}、ねじで{見分|みわ}けます。",
      "ナットには、ロック{機構|きこう}のないもの（Non Self-locking Nut）と、あるもの（Self-locking Nut）があります。{使|つか}う{場所|ばしょ}の{温度|おんど}で{使|つか}い{分|わ}けます。"]),
    ("h", "セルフ・ロッキング・ナットを{使|つか}えない{所|ところ}"),
    ("ul", [
      "ナットがゆるむと{飛行|ひこう}の{安全|あんぜん}にえいきょうする{所|ところ}。",
      "{回転力|かいてんりょく}を{受|う}ける{所|ところ}（プーリー、クランク、レバー、ヒンジ・ピン、カムなど）。",
      "ゆるんでエンジンの{空気|くうき}{取|と}り{入|い}れ{口|ぐち}に{落|お}ちるおそれがある{所|ところ}。",
      "{飛行前後|ひこうぜんご}に{定期的|ていきてき}に{取|と}り{付|つ}け・{取|と}り{外|はず}しをするパネルやドア。"]),
    ("ul", [
      "セルフ・ロッキング・ナットを{付|つ}けたら、ボルトの{先|さき}がナットの{面|めん}から2{山|やま}{以上|いじょう}{出|で}ていること。セルフ・ロッキング・ナットを{加工|かこう}してはいけません。"])]),
  ("b1s3", "Sekrup (Screw)", "スクリュー", [11, 12], [
    ("ul", [
      "Sekrup dipakai luas pada struktur dan pemasangan komponen sederhana. Perbedaan umum dengan baut: **kepala bercelah untuk obeng**, **kelas ulir 2**, **kekuatan lebih rendah**, **ulir lebih panjang & grip tidak jelas**.",
      "**Structural screw**: di struktur utama; hanya **bentuk kepalanya** beda dari baut struktural; kekuatan = baut seukuran. **Machine screw**: paling banyak dipakai (ulir kasar & halus).",
      "**Self-tapping screw** (3 jenis): **sheet metal screw** (menahan sementara pelat sebelum rivet / sambungan non-struktural; pakai ring fenol/aluminium), **machine self-tapping screw** (pasang plat nama dsb. di coran), **drive screw** (sebenarnya paku, untuk plat nama; **tidak bisa dipakai ulang**).",
      "**Set screw**: memasang/mengunci komponen seperti roda gigi pada poros.",
      "Gunakan sekrup dengan **nomor suku cadang yang sesuai**; obeng/kunci **sesuai bentuk dan ukuran celah kepala**."])],
   [("ul", [
      "スクリューは、{頭|あたま}にドライバーをかける{溝|みぞ}があり、ボルトより{強度|きょうど}が{低|ひく}く、ねじ{部|ぶ}が{長|なが}いです。ねじの{等級|とうきゅう}はクラス2です。",
      "{種類|しゅるい}：{構造用|こうぞうよう}、マシン・スクリュー、セルフ・タッピング・スクリュー（シート・メタル、マシン・セルフ・タッピング、ドライブ）、セット・スクリュー。",
      "ドライブ・スクリューは{釘|くぎ}のようなもので、{取|と}り{外|はず}したあとにもう{一度|いちど}{使|つか}うことはできません。",
      "{使|つか}う{場所|ばしょ}に{合|あ}った{指定|してい}の{部品|ぶひん}を{使|つか}い、ドライバーは{溝|みぞ}の{形|かたち}と{大|おお}きさに{合|あ}ったものを{使|つか}います。"])]),
  ("b1s4", "Ring (Washer)", "ワッシャー", [13, 14], [
    ("ul", [
      "Dipasang di sisi **kepala baut dan mur** untuk melindungi permukaan, mencegah longgar, dll.",
      "**Plain washer (平ワッシャー)**: menyebarkan gaya pengencang; **spacer penyetel** posisi lubang cotter pin; melindungi bagian; **mencegah korosi** akibat kontak logam berbeda.",
      "**Lock washer**: pengunci di tempat yang tidak bisa memakai self-locking nut/cotter pin/safety wire — spring lock, internal teeth, external teeth, tab washer.",
      "**Washer khusus**: **countersunk/flat kekuatan tinggi** (dengan internal wrenching bolt), **taper pin washer**, **preload indicating washer** (untuk pengencangan lebih akurat dari torque wrench).",
      "Aturan: pakai nomor suku cadang yang ditentukan; **plain washer maks. 3 buah** (1 pelindung permukaan + 1 di sisi kepala + 1 di sisi mur) — lock/khusus tidak dihitung; **bahan umumnya sama dengan baut**."])],
   [("ul", [
      "ワッシャーは、ボルトの{頭|あたま}とナットの{側|がわ}に{使|つか}い、{面|めん}を{守|まも}ったり、ゆるみを{防|ふせ}いだりします。",
      "{平|ひら}ワッシャー：しめつける{力|ちから}を{広|ひろ}げる、コッター・ピンの{穴|あな}を{合|あ}わせる、{部品|ぶひん}を{守|まも}る、サビ（{異種金属|いしゅきんぞく}）を{防|ふせ}ぐ。",
      "ロック・ワッシャー：ゆるみ{止|ど}め。{特殊|とくしゅ}ワッシャー：{高強度|こうきょうど}{皿取|さらど}り、テーパー・ピン、プリロード{指示|しじ}ワッシャー。",
      "{平|ひら}ワッシャーは{最大|さいだい}3{枚|まい}まで。ワッシャーは{原則|げんそく}としてボルトと{同|おな}じ{材料|ざいりょう}です。"])]),
  ("b1s5", "Torsi Pengencangan & Torque Wrench", "締付けトルクとトルク・レンチ", [15, 15], [
    ("ul", [
      "Pesawat mengalami **getaran hebat** dan **perubahan suhu mendadak** (beda pemuaian logam) → torsi pengencangan sangat penting. **Terlalu besar** = ulir/baut rusak, baut putus. **Terlalu kecil** = kelelahan material lebih cepat, aus. Maka torsi tiap baut/mur **ditentukan**.",
      "Jenis torque wrench: **tipe beam**, **tipe dial**, **tipe limit**."]),
    ("h", "Penggunaan"),
    ("ul", [
      "Torque wrench adalah alat ukur yang **dikalibrasi berkala** → pastikan **masih berlaku**.",
      "Pilih rentang yang cocok: **nilai torsi tidak boleh sama dengan nilai maksimum** wrench.",
      "**Jangan dipakai selain torque wrench** (palu, ratchet handle). Bila jatuh/terbentur → **periksa**.",
      "Tipe limit: setelah di-set **kunci**; setelah dipakai kembalikan ke **skala minimum** dan kunci. Ada **ulir kanan dan kiri** — jangan tertukar.",
      "Setelah mulai memakai satu wrench, **jangan ganti dengan wrench lain**."])],
   [("ul", [
      "{飛行機|ひこうき}は{強|つよ}い{振動|しんどう}や{急|きゅう}な{温度|おんど}{変化|へんか}を{受|う}けるので、ボルト・ナットの{締付|しめつ}けトルクはとても{大切|たいせつ}です。{大|おお}きすぎるとねじをいためてボルトが{折|お}れ、{足|た}りないと{疲労|ひろう}{破壊|はかい}がはやまります。",
      "トルク・レンチには、ビーム{式|しき}・ダイヤル{式|しき}・リミット{式|しき}があります。",
      "トルク・レンチは{校正|こうせい}されている{測定器|そくていき}です。{有効|ゆうこう}なものか{確|たし}かめます。トルク{値|ち}に{合|あ}った{範囲|はんい}のものを{選|えら}びます（{最大値|さいだいち}と{同|おな}じではだめ）。トルク・レンチ{以外|いがい}（ハンマーなど）に{使|つか}ってはいけません。{落|お}としたら{点検|てんけん}します。",
      "リミット{式|しき}は、セットしたら{必|かなら}ずロックし、{使|つか}ったあとは{最小|さいしょう}の{目盛|めもり}にもどしてロックします。{右|みぎ}ねじ{用|よう}と{左|ひだり}ねじ{用|よう}があるので、{混同|こんどう}しません。"])]),
  ("b1s6", "Safety Wire", "安全線のかけ方", [16, 18], [
    ("ul", [
      "Ulir pesawat bisa longgar karena getaran dan beban → semua diberi **pencegah putar**. Salah satunya **lock wire** yang menarik komponen ke arah **mengencang**. Ada juga **shear wire** untuk handle/switch/cover **pintu darurat, pemadam, rem darurat** agar tidak terbuka tak sengaja namun mudah dioperasikan saat dibutuhkan.",
      "Diameter kawat umum **min. 0,032 in**; **0,020 in** untuk lubang kecil/jarak rapat (≤ ¼ in screw/bolt rapat). Kawat peralatan darurat: **tembaga 0,020 in**."]),
    ("h", "Posisi lubang & cara memasang"),
    ("ul", [
      "Kawat harus **selalu bekerja ke arah mengencang**. Posisi lubang ideal untuk 2 unit: lubang miring sekitar **45° ke kiri** dari garis tengah. **Jangan mengencangkan berlebih/melonggarkan** demi posisi ideal; jika di luar rentang torsi, **ganti ring (ketebalan lain)**. Hindari posisi lubang antara **jam 12–3 dan 6–9** pada unit pertama & kedua.",
      "**Double twist wire** = **metode standar** (diutamakan). Jarak 4–6 in: maks. **3 unit** dalam satu rangkaian; jarak rapat: sebanyak yang bisa dengan kawat 24 in; **jangan** memasang kawat antar-fitting yang berjarak **> 6 in**.",
      "**Single wire**: untuk 3 unit atau lebih pada **bentuk geometri tertutup** (segitiga, persegi, lingkaran) pada **komponen sistem listrik**, berjarak pusat **≤ 2 in**; juga untuk **peralatan darurat**. Namun pada seal hidrolik/pneumatik atau bagian penting yang menerima tekanan hidrolik → tetap **double twist**."]),
    ("h", "Larangan & batasan"),
    ("ul", [
      "Gunakan kawat **baru setiap kali**; jangan dipakai ulang.",
      "Kencang (**tight**) antar unit tetapi **tidak diberi tegangan berlebih**; hindari **kink, nick, scrape**; jangan ditarik di sudut tajam, dipuntir berlebih, atau dicengkeram alat terlalu keras.",
      "Putaran: kawat 0,032/0,040 in → **6–8 putaran per inci**. Potong **tegak lurus**.",
      "**Pigtail**: panjang **½–¾ in**, **5–8 putaran** (NASM33540: ¼–½ in, 3–5 putaran); ujungnya jangan melukai/menyangkut dan jangan menyentuh bagian/mur.",
      "Sisa kawat potongan **tidak boleh jatuh** ke dalam mesin, badan pesawat, atau komponen."])],
   [("ul", [
      "ねじは{飛行中|ひこうちゅう}の{振動|しんどう}でゆるむおそれがあるので、{回|まわ}り{止|ど}めをします。その{一|ひと}つが、ねじを{締|し}める{方向|ほうこう}に{引|ひ}っぱって{固定|こてい}するロック・ワイヤです。{非常口|ひじょうぐち}などのカバーには、{必要|ひつよう}なときに{簡単|かんたん}に{切|き}れるシア・ワイヤを{使|つか}います。",
      "ふつうのワイヤは{直径|ちょっけい}0.032in{以上|いじょう}です。{非常用|ひじょうよう}の{装置|そうち}には{直径|ちょっけい}0.020inの{銅|どう}ワイヤを{使|つか}います。",
      "ワイヤは、いつも{締|し}まる{方向|ほうこう}に{働|はたら}いていることが{大切|たいせつ}です。",
      "ダブル・ツイスト・ワイヤ{方法|ほうほう}が{標準|ひょうじゅん}です。{間隔|かんかく}が4～6inのときは、{最大|さいだい}3{個|こ}までつなげます。6in{以上|いじょう}はなれた{部品|ぶひん}の{間|あいだ}にかけてはいけません。",
      "シングル・ワイヤ{方法|ほうほう}は、{電気系統|でんきけいとう}の{部品|ぶひん}が{狭|せま}い{間隔|かんかく}（2in{以下|いか}）で{閉|と}じた{形|かたち}にならんでいるときや、{非常用|ひじょうよう}の{装置|そうち}に{使|つか}います。"]),
    ("ul", [
      "{安全線|あんぜんせん}は{使|つか}うたびに{新|あたら}しいものを{使|つか}い、{再使用|さいしよう}してはいけません。ワイヤにキズやよじれを{付|つ}けない、{直角|ちょっかく}に{切|き}る、{余|あま}ったワイヤをエンジンなどに{落|お}とさない。",
      "より{数|かず}は、0.032in・0.040inで1in{当|あ}たり6～8{回|かい}です。ピグテイルは{長|なが}さ1/2～3/4in、より{数|かず}5～8{回|かい}で、{人|ひと}を{傷|きず}つけないようにします。"])]),
  ("b1s7", "Cotter Pin (割ピン)", "コッター・ピンによる回り止め", [19, 21], [
    ("ul", [
      "Dipakai untuk **castellated nut (溝付きナット)** dan komponen lain yang perlu pencegah putar/lepas. Ukuran: mis. **MS 24655-283** (baja karbon berlapis kadmium, panjang ¾ in, diameter 3/32 in). Bagian: **eye**, **prong (kaki)**.",
      "Pilih cotter pin dengan **diameter terbesar yang masuk** ke lubangnya.",
      "Cara pasang: **preferred method** (standar, bila tidak ada instruksi lain) dan **alternate method** (hanya bila ujung yang ditekuk menyentuh/menyangkut bagian lain).",
      "**Drill-shank bolt + castellated nut**: kencangkan mur pada **torsi minimum**, cek lubang baut dan celah mur; bila tidak sejajar, sesuaikan **dalam rentang torsi**, atau **ganti mur/ring/baut** atau tambah-kurangi ring. Posisi terbaik: **dasar celah mur sama tinggi dengan bagian bawah lubang baut**. Cotter pin **tidak boleh menonjol dari permukaan atas mur ≥ 50% diameter**."]),
    ("h", "Langkah pemasangan"),
    ("ul", [
      "① Masukkan dengan **kaki panjang di atas**, dorong semaksimal mungkin dengan tangan ② bila perlu ketuk ringan dengan **palu plastik** sampai kepala **sebidang dengan dinding mur** ③ jepit kaki atas dengan tang, tarik, potong **tidak melebihi diameter baut** ④ ketuk kaki yang terpotong ke ujung baut ⑤ tekuk kaki sisanya sedikit ke bawah dan potong agar tidak menyentuh ring ⑥ tekan kaki ke dinding mur ⑦ periksa **tidak ada kelonggaran (play)**."])],
   [("ul", [
      "コッター・ピン（{割|わ}りピン）は、{溝付|みぞつ}きナットなどの{回|まわ}り{止|ど}め・{抜|ぬ}け{止|ど}めに{使|つか}います。コッター・ピンの{太|ふと}さは、{穴|あな}に{入|はい}る{最大|さいだい}のものにします。",
      "{取|と}り{付|つ}け{方|かた}には、{優先方法|ゆうせんほうほう}（Preferred）と{代替|だいたい}{方法|ほうほう}（Alternate）があります。{特|とく}に{指示|しじ}がなければ{優先方法|ゆうせんほうほう}で{行|おこな}います。",
      "ナットを{決|き}められた{最低|さいてい}トルクでしめ、ボルトの{穴|あな}とナットの{溝|みぞ}が{合|あ}うか{確認|かくにん}します。{合|あ}わないときはワッシャーなどで{調整|ちょうせい}します。コッター・ピンの{直径|ちょっけい}の50%{以上|いじょう}がナットの{上面|じょうめん}から{出|で}てはいけません。",
      "{手順|てじゅん}：{先|さき}の{長|なが}い{方|ほう}を{上|うえ}にして{押|お}し{込|こ}む→プラスチック・ハンマーで{頭|あたま}を{壁|かべ}と{同|おな}じ{面|めん}にする→{上|うえ}の{先|さき}を{切|き}ってボルトに{押|お}しつける→のこりの{先|さき}も{曲|ま}げて{切|き}り、ナットの{壁|かべ}に{押|お}しつける→あそび（ガタ）がないか{検査|けんさ}する。"])]),
 ]),
 ("bab2", 2, "Teknik Dasar: Pengukuran Listrik", "航空機の基本技術：電気計測一般", "Penggunaan tester (circuit tester): tegangan DC/AC, resistansi (Ω), dan arus DC.", [22, 24], [
  ("b2s1", "Tester & Pengukuran Tegangan", "テスター・電圧の測定", [22, 23], [
    ("ul", [
      "**Tester (回路計, Circuit Tester)**: kecil, mudah dibawa (pocket tester), tipe **analog** dan **digital**; **akurasinya rendah** sehingga tidak cocok untuk pengukuran presisi.",
      "**Larangan/aturan:** ① cek **posisi nol** sebelum mengukur ② hindari **medan magnet kuat** (saat dipakai dan disimpan) ③ bila nilai tak terduga, **mulai dari range tertinggi lalu turun** ④ cek posisi **range knob** ⑤ ganti range knob **hanya setelah test pin dilepas** dari objek ⑥ pada DC cek **polaritas** ⑦ hindari **paralaks** ⑧ tester lemah terhadap **getaran/benturan** ⑨ warna test lead (+)/(−) — hati-hati pada uji semikonduktor ⑩ setelah dipakai, bila tak ada OFF, set ke **range tegangan AC/DC tertinggi**."]),
    ("h", "Tegangan"),
    ("ul", [
      "**DCV**: knob ke DCV → test pin **paralel** dengan rangkaian → baca jarum. Baca di **skala sisi kanan** agar galat kecil.",
      "**ACV**: knob ke ACV → test pin **paralel** → baca jarum; juga di skala kanan."])],
   [("ul", [
      "テスター（{回路計|かいろけい}）は{持|も}ち{運|はこ}びやすいですが、{精度|せいど}が{低|ひく}いので{精密|せいみつ}な{測定|そくてい}には{向|む}きません。アナログ{式|しき}とデジタル{式|しき}があります。",
      "{測定前|そくていまえ}にゼロ{位置|いち}を{確認|かくにん}します。{強|つよ}い{磁界|じかい}の{近|ちか}くを{避|さ}けます。{測定値|そくていち}がわからないときは、レンジを{高|たか}い{値|あたい}から{順|じゅん}に{下|さ}げます。レンジを{変|か}えるときは、{必|かなら}ずテスト・ピンを{測|はか}るものから{外|はず}します。",
      "{直流|ちょくりゅう}の{測定|そくてい}では{極性|きょくせい}を{確認|かくにん}します。{使|つか}い{終|お}わったら、OFFがなければ、{電圧|でんあつ}レンジの{高|たか}い{位置|いち}に{合|あ}わせておきます。",
      "{直流電圧|ちょくりゅうでんあつ}（DCV）・{交流電圧|こうりゅうでんあつ}（ACV）は、テスト・ピンを{回路|かいろ}に{並列|へいれつ}につなぎます。{右側|みぎがわ}の{目盛|めもり}で{読|よ}むと{誤差|ごさ}が{少|すく}なくなります。"])]),
  ("b2s2", "Pengukuran Resistansi & Arus", "抵抗・電流の測定", [23, 24], [
    ("ul", [
      "**Penyetelan Ω nol (ゼロΩ調整)**: sebelum mengukur resistansi, putar knob penyetel agar jarum menunjuk **0** saat test pin dihubung-singkat. Mencegah galat akibat baterai habis dan perubahan arus beban. Ulangi **setiap berganti range Ω** dan saat pengukuran terus-menerus.",
      "**Resistansi**: knob ke Ω → test pin (+)(−) dihubung singkat → setel nol → buka → sambungkan ke resistor → baca. Baca di **tengah skala** agar galat kecil. **Jangan menyentuh test pin dengan jari** (arus tubuh menimbulkan galat).",
      "**Polaritas pada range Ω terbalik**: terminal (+) tersambung ke (−) baterai internal. Penting pada **uji semikonduktor**.",
      "**Arus DC (mA)**: knob ke DC mA → test pin dihubung **seri** dengan rangkaian → baca jarum. Untuk keamanan, sambungkan di **sisi ground** rangkaian. Arus yang terukur umumnya **DC saja, hanya sampai ratusan mA**."])],
   [("ul", [
      "{抵抗|ていこう}を{測|はか}る{前|まえ}に、テスト・ピンをショートさせて、{指針|ししん}が0になるように「ゼロΩ{調整|ちょうせい}」をします。Ωレンジを{変|か}えたときは、そのたびに{調整|ちょうせい}します。",
      "{抵抗|ていこう}は{目盛|めもり}の{中央|ちゅうおう}で{読|よ}むと{誤差|ごさ}が{少|すく}なくなります。{指|ゆび}でテスト・ピンにさわると{誤差|ごさ}が{出|で}ます。",
      "Ωレンジのときだけ、テスト・ピンの（＋）（－）が{逆|ぎゃく}になります。{半導体|はんどうたい}のテストで{大切|たいせつ}です。",
      "{直流電流|ちょくりゅうでんりゅう}（DC mA）は、テスト・ピンを{回路|かいろ}に{直列|ちょくれつ}につなぎます。テスターで{測|はか}れる{電流|でんりゅう}は{直流|ちょくりゅう}で、{数百|すうひゃく}mA{程度|ていど}までです。"])]),
 ]),
 ("bab3", 3, "Keselamatan Kerja (作業安全)", "作業安全", "Keselamatan/kesehatan, penyebab kecelakaan, dan pemeriksaan diri: kesehatan, APD, alat pengaman, 5S, api, penerangan, bahan berbahaya, benda berputar, kerja di tangki, kebisingan.", [32, 37], [
  ("b3s1", "Tujuan, Penyebab Kecelakaan", "作業安全の目的・事故はなぜ起こるか", [32, 33], [
    ("ul", [
      "Tempat kerja perawatan pesawat berbeda dari lini pabrik: **lingkungan sering berubah**. Dibutuhkan tekad **'melindungi diri sendiri' dan 'melindungi rekan'**. Dasar hukum: **Undang-undang Keselamatan dan Kesehatan Kerja (労働安全衛生法)**.",
      "**Keselamatan (安全)** = tidak terluka. **Kesehatan/hygiene (衛生)** = tidak sakit. **Sehat (健康)** = badan tidak bermasalah dan kuat; fungsi mental/cara berpikir normal; sehat secara sosial.",
      "Kecelakaan terjadi bila ada **kondisi benda tidak aman** (lingkungan kerja tidak aman) **dan** **tindakan manusia tidak aman** (ceroboh). Karena itu: **rapikan lingkungan kerja** dan **jangan bertindak ceroboh**."])],
   [("ul", [
      "{整備|せいび}の{現場|げんば}は、{工場|こうじょう}のラインとちがって、{環境|かんきょう}がよく{変|か}わります。「{自分|じぶん}を{守|まも}る」と「{仲間|なかま}を{守|まも}る」という{強|つよ}い{気持|きも}ちが{必要|ひつよう}です。{労働安全衛生法|ろうどうあんぜんえいせいほう}が{基本|きほん}です。",
      "{安全|あんぜん}とはケガをしないこと、{衛生|えいせい}とは{病気|びょうき}にならないこと、{健康|けんこう}とは{体|からだ}・{心|こころ}・{社会|しゃかい}の{面|めん}で{健全|けんぜん}なことです。",
      "{不安全|ふあんぜん}な{物|もの}の{状態|じょうたい}と、{不安全|ふあんぜん}な{人|ひと}の{行動|こうどう}がそろうと、{事故|じこ}が{起|お}きやすくなります。"])]),
  ("b3s2", "Pemeriksaan Diri (1): Kesehatan, APD, Alat Pengaman, 5S", "自己点検：健康管理・保護具・安全装置・整理整頓", [33, 35], [
    ("ul", [
      "**Kesehatan**: bila tidak enak badan setelah masuk kerja, **sampaikan ke atasan/ketua kerja** dan minta petunjuk. Memaksakan diri berbahaya (mis. goyah dan jatuh saat kerja di ketinggian).",
      "**APD (保護具)**: bila perusahaan mewajibkan, **wajib dipakai**. Bahan kimia → **masker gas**. Kerja di ketinggian → **helm dan alat penahan jatuh (prinsipnya tipe full harness)**; bila dilepas sementara, **segera pasang kembali**.",
      "**Alat pengaman** (mis. pada mesin press) **tidak boleh dilepas** seenaknya karena 'sulit bekerja'.",
      "**Seiri (整理)** = menyingkirkan yang tidak perlu. **Seiton (整頓)** = menata agar mudah dipakai. Dasar: bersihkan dari sekitar diri sendiri, **jangan membuat berantakan**, simpan di **tempat yang ditentukan**. Di akhir kerja rapikan area dan **serah-terimakan** ke pekerja berikutnya."])],
   [("ul", [
      "{体調|たいちょう}が{悪|わる}いときは、{上司|じょうし}やリーダーに{伝|つた}えて{指示|しじ}を{受|う}けます。{無理|むり}をすると、{高所|こうしょ}{作業|さぎょう}で{落|お}ちるなど{危険|きけん}です。",
      "{会社|かいしゃ}が{着用|ちゃくよう}を{決|き}めた{保護具|ほごぐ}は、{必|かなら}ず{着|つ}けます。{化学物質|かがくぶっしつ}には{防毒|ぼうどく}マスクを{使|つか}います。{高所|こうしょ}{作業|さぎょう}では、ヘルメットと{墜落制止用器具|ついらくせいしようきぐ}（フルハーネス{型|がた}）を{着|つ}けます。",
      "{安全装置|あんぜんそうち}を{勝手|かって}に{外|はず}してはいけません。",
      "{整理|せいり}とは{不要|ふよう}なものをすてること、{整頓|せいとん}とは{使|つか}いやすくかたづけることです。{物|もの}は{決|き}まった{場所|ばしょ}に{置|お}きます。{作業|さぎょう}が{終|お}わったら{整理整頓|せいりせいとん}して、{次|つぎ}の{人|ひと}に{引|ひ}きつぎます。"])]),
  ("b3s3", "Pemeriksaan Diri (2): Api, Cahaya, Bahan Berbahaya, Benda Berputar, Tangki, Bising", "自己点検：火気・照明・有害物・回転体・タンク内・騒音", [35, 37], [
    ("ul", [
      "**Dilarang api (火気厳禁)**: di hangar dan seluruh **ramp bandara**. Jangan bekerja dengan **korek api di saku**. Sebagian bahan kimia perawatan bisa **menyala sendiri (自然発火)** → buang limbah dengan **dipilah**. Ketahui **letak dan cara memakai APAR**.",
      "**Penerangan** (standar hukum, di tangan kerja): pekerjaan **presisi ≥ 300 lux**, **biasa ≥ 150 lux**, **kasar ≥ 70 lux**. Gelap menurunkan ketelitian dan produktivitas; pakai lampu kerja yang sesuai.",
      "**Bahan berbahaya**: pelarut organik/bahan kimia — pelarut organik bisa menyebabkan **keracunan akut**, bahan kimia penggunaan lama bisa menimbulkan penyakit → pakai **masker gas** dsb.",
      "**Benda berputar** (bor meja, gerinda): **jangan memakai sarung tangan** — bila terlilit, jari langsung ikut tertarik.",
      "**Kerja dalam tangki bahan bakar**: bahaya **kekurangan oksigen**. Sebelum masuk pastikan **oksigen ≥ 18%** dan **uap bahan bakar ≤ 30 ppm**. Bila tidak sempat ventilasi → pakai **masker pasokan udara (送気マスク)**.",
      "**Kebisingan**: pakai **sumbat telinga / ear muff**. Tempat yang ditetapkan sebagai **area bising (管理区分 III)** → pakai dengan aktif; saling mengingatkan rekan."])],
   [("ul", [
      "{格納庫|かくのうこ}も{空港|くうこう}のランプも{火気厳禁|かきげんきん}です。ライターをポケットに{入|い}れたまま{作業|さぎょう}してはいけません。{自然発火|しぜんはっか}する{化学物質|かがくぶっしつ}もあるので、{ゴミ|ごみ}は{分|わ}けて{捨|す}てます。{消火器|しょうかき}の{場所|ばしょ}と{使|つか}い{方|かた}を{覚|おぼ}えます。",
      "{手元|てもと}の{明|あか}るさの{基準|きじゅん}：{精密|せいみつ}な{作業|さぎょう}は300ルクス{以上|いじょう}、ふつうは150ルクス{以上|いじょう}、あらい{作業|さぎょう}は70ルクス{以上|いじょう}です。",
      "{有機溶剤|ゆうきようざい}は{急性中毒|きゅうせいちゅうどく}を{起|お}こすことがあります。{防毒|ぼうどく}マスクなどの{保護具|ほごぐ}を{着|つ}けます。",
      "ボール{盤|ばん}やグラインダーなどの{回転体|かいてんたい}を{使|つか}うときは、{手袋|てぶくろ}を{着|つ}けてはいけません。{巻|ま}き{込|こ}まれます。",
      "{燃料|ねんりょう}タンクに{入|はい}る{前|まえ}に、{酸素濃度|さんそのうど}18%{以上|いじょう}、{燃料|ねんりょう}の{蒸気|じょうき}30ppm{以下|いか}であることを{確認|かくにん}します。{時間|じかん}がないときは{送気|そうき}マスクを{着|つ}けます。",
      "{騒音|そうおん}のある{場所|ばしょ}では、{耳栓|みみせん}やイヤマフで{耳|みみ}を{守|まも}ります。"])]),
 ]),
 ("bab4", 4, "Kualitas (品質) & Human Factor", "品質", "Kualitas perawatan (peralatan & pekerjaan), manajemen keandalan, human factor, model m-SHELL, dan hukum Heinrich.", [38, 43], [
  ("b4s1", "Kualitas Perawatan & Cacat", "整備品質と不具合の関係", [38, 38], [
    ("ul", [
      "**Kualitas (品質)** = tingkat kesesuaian sifat suatu 'benda' terhadap standar.",
      "**Kualitas perawatan (整備品質)** = tingkat kesempurnaan perawatan dan sistem berfungsi normal. Terdiri dari **kualitas peralatan (機材品質)** — pesawat/sistemnya berfungsi tanpa rusak — dan **kualitas pekerjaan (作業品質)** — pekerjaan perawatan oleh mekanik dilakukan dengan benar.",
      "Untuk meningkatkan kualitas perawatan, **kedua-duanya harus baik**. Kualitas perawatan tinggi → **kecelakaan dan insiden lebih jarang**."])],
   [("ul", [
      "{品質|ひんしつ}とは、「もの」の{性質|せいしつ}が{基準|きじゅん}にどれだけ{合|あ}っているかの{程度|ていど}です。",
      "{整備品質|せいびひんしつ}は、{機材品質|きざいひんしつ}（{飛行機|ひこうき}やシステムが{故障|こしょう}せず{働|はたら}くか）と、{作業品質|さぎょうひんしつ}（{整備士|せいびし}の{作業|さぎょう}が{確実|かくじつ}か）に{分|わ}かれます。",
      "{整備品質|せいびひんしつ}を{高|たか}くすれば、{事故|じこ}やインシデントは{起|お}きにくくなります。"])]),
  ("b4s2", "Kualitas Peralatan & Manajemen Keandalan", "機材品質と信頼性管理", [39, 40], [
    ("ul", [
      "**Indikator kualitas (品質指標)**: seperti hasil tes kesehatan dibandingkan nilai acuan, data pesawat dibandingkan indikator. Kriteria utama: **keselamatan (安全性)**, **ketepatan waktu (定時性)**, **kenyamanan (快適性)**.",
      "Dulu perawatan memakai **hard time** (bongkar/ganti komponen berkala). Sejak **Boeing 747 dan Airbus** bergeser ke **manajemen keandalan (信頼性管理方式)**: kumpulkan data kerusakan → **monitor** → temukan masalah, **evaluasi/analisis**, cari penyebab → **perbaikan (tindakan korektif)** — siklus **PDCA (Plan-Do-Check-Action)**.",
      "**4 program monitoring**: ① **Aircraft Total Performance Monitoring** (memantau kualitas pesawat secara menyeluruh) ② **Event Monitoring** (kejadian kerusakan penting harian) ③ **Trend Monitoring** (jumlah/laju kerusakan jangka panjang → temukan tren memburuk) ④ **Specific Monitoring** (kerusakan tertentu dipantau khusus dan rinci)."])],
   [("ul", [
      "{品質指標|ひんしつしひょう}とは、{良|よ}い・{悪|わる}いを{判断|はんだん}する「{目印|めじるし}」の{値|ち}です。{基準|きじゅん}は、{安全性|あんぜんせい}・{定時性|ていじせい}・{快適性|かいてきせい}などです。",
      "{昔|むかし}は{時間|じかん}を{決|き}めて{分解|ぶんかい}・{交換|こうかん}するハードタイム{方式|ほうしき}でしたが、ボーイング747やエアバスの{登場|とうじょう}から、{信頼性管理|しんらいせいかんり}{方式|ほうしき}が{中心|ちゅうしん}になりました。{故障|こしょう}データを{集|あつ}めて{監視|かんし}し、{問題|もんだい}を{評価|ひょうか}・{分析|ぶんせき}して、{原因|げんいん}を{調|しら}べ、{是正|ぜせい}する、というPDCAサイクルです。",
      "モニタリングには4つのプログラムがあります。{飛行機|ひこうき}の{品質|ひんしつ}を{総合|そうごう}{監視|かんし}、{重要|じゅうよう}な{故障|こしょう}（イベント）の{監視|かんし}、{故障|こしょう}の{傾向|けいこう}（トレンド）の{監視|かんし}、{特定|とくてい}の{故障|こしょう}の{重点|じゅうてん}{監視|かんし}です。"])]),
  ("b4s3", "Human Factor & Peningkatan Kualitas Kerja", "作業品質とヒューマンファクター", [41, 43], [
    ("ul", [
      "**Human Factor (ヒューマンファクター)** = sifat manusia sebagai faktor yang memengaruhi fungsi sistem. **Human Error** = tindakan yang tidak menghasilkan hasil sesuai niat akibat sifat manusia.",
      "**Model m-SHELL**: **L** (Liveware = diri: pengetahuan, sikap, kelelahan), **L** (orang lain: komunikasi, kerja tim), **S** (Software: aturan, manual, prosedur), **H** (Hardware: alat, fasilitas), **E** (Environment: cahaya, suhu, bising, getaran), **m** (Management: kebijakan, suasana, pendidikan, jumlah pekerja). Error terjadi di **antara L dan sekelilingnya**.",
      "Contoh: L⇔L salah instruksi/salah dengar, tak berani menegur senior; L⇔S aturan sulit/prosedur rumit sehingga satu langkah terlewat; L⇔H banyak saklar membingungkan, wadah mirip; L⇔E ruang gelap salah baca, terburu-buru; L⇔m pekerja sedikit/tidak dilatih; L sendiri: kurang belajar, kurang tidur.",
      "**Setiap orang pasti membuat error**, dan **error adalah akibat, bukan penyebab** (selalu ada faktor). Karena itu buat aturan dengan asumsi manusia bisa salah dan buat **mekanisme menemukan error lebih awal**."]),
    ("h", "Indikator & peningkatan kualitas pekerjaan"),
    ("ul", [
      "**ヒヤリハット (near miss)** = kejadian yang nyaris menjadi kecelakaan/insiden.",
      "**Hukum Heinrich**: dari **330** kejadian dengan sebab sama → **1 kecelakaan**, **29 insiden**, **300 cacat ringan/hiyari-hatto**. Di bawahnya ada ribuan **kondisi tidak aman** (kerusakan fasilitas) dan **tindakan tidak aman** (pelanggaran aturan).",
      "Heinrich menyatakan dengan mengurangi kondisi/tindakan tidak aman **98% kecelakaan bisa dicegah**. Ini hukum probabilitas; yang penting terus berusaha menghilangkan kondisi/tindakan tidak aman. Menurunkan jumlah total kejadian → menurunkan kecelakaan/insiden."])],
   [("ul", [
      "ヒューマンファクターは、システムの{働|はたら}きに{影響|えいきょう}する{人|ひと}の{特性|とくせい}です。ヒューマンエラーは、{人|ひと}の{特性|とくせい}のせいで{思|おも}ったとおりの{結果|けっか}にならなかった{行動|こうどう}です。",
      "m-SHELLモデル：L（{本人|ほんにん}）、L（{周|まわ}りの{人|ひと}）、S（ソフトウェア：ルール・マニュアル）、H（ハードウェア：{器具|きぐ}・{設備|せつび}）、E（{環境|かんきょう}：{明|あか}るさ・{気温|きおん}・{騒音|そうおん}）、m（マネジメント：{会社|かいしゃ}の{方針|ほうしん}・{教育|きょういく}）。L（{本人|ほんにん}）と{周|まわ}りの{間|あいだ}でエラーが{起|お}きます。",
      "{人|ひと}は{誰|だれ}でも{必|かなら}ずエラーを{起|お}こします。エラーは{原因|げんいん}ではなく{結果|けっか}です。だから、エラーを{起|お}こすことを{前提|ぜんてい}にルールを{決|き}め、{早|はや}く{見|み}つける{仕組|しく}みを{考|かんが}えることが{大切|たいせつ}です。"]),
    ("ul", [
      "ヒヤリハットは、{事故|じこ}にならなかったが、ヒヤリとしたりハッとしたできごとです。",
      "ハインリッヒの{法則|ほうそく}：{同|おな}じ{原因|げんいん}の{不具合|ふぐあい}が330{件|けん}{起|お}きると、{事故|じこ}1{件|けん}、インシデント29{件|けん}、{軽微|けいび}な{不具合|ふぐあい}・ヒヤリハット300{件|けん}の{割合|わりあい}になります。{不安全|ふあんぜん}な{状態|じょうたい}・{行動|こうどう}を{減|へ}らすと、{事故|じこ}の98%は{防|ふせ}げるといわれます。"])]),
 ]),
 ("bab5", 5, "Gambaran Umum Pesawat (航空機概要)", "航空機概要", "Sistem listrik, kontrol penerbangan, hidrolik, udara bertekanan (pneumatic), dan pengetahuan umum sistem pesawat.", [47, 67], [
  ("b5s1", "Sistem Listrik (Electrical Power System)", "電気システム", [51, 55], [
    ("ul", [
      "Dua jenis daya: **AC 115/200 V 3 fasa 400 Hz** dan **DC 28 V**.",
      "**Sumber AC (4)**: **IDG (Integrated Drive Generator)** — generator dengan Constant Speed Drive, satu per mesin, daya utama; **APU Generator** — di darat dan terbang; **External Power** — daya dari darat, soket di hidung pesawat; **Main Battery** — normalnya DC, saat darurat diubah jadi AC oleh **Static Inverter**.",
      "**Sumber DC (3)**: **TRU (Transformer Rectifier Unit)** — daya DC utama, ubah AC 115 V Main Bus → 28 VDC; **Main Battery** — cadangan Standby Power System, daya utama saat darurat/pendaratan otomatis, diisi **Main Battery Charger**; **APU Battery** — untuk start APU."]),
    ("h", "Bus"),
    ("ul", [
      "**Bus** = titik kumpul daya dari generator/TRU yang membagikannya ke sistem dalam satu grup.",
      "AC: **Left & Right 115 V AC Bus (Main AC Bus)** dari tiap IDG; **Transfer Bus** — normalnya dari Main AC Bus sisi sama; bila IDG sisi itu rusak, dari sisi lawan; **AC Standby Bus** — sistem penting, normal dari Left Transfer Bus, bila mati otomatis dari Main Battery via Static Inverter; **28 V AC Bus** — tegangan diturunkan dengan transformer, untuk lampu dan instrumen.",
      "DC: **Left & Right 28 V DC Bus** dari TRU; **Battery Bus** — normal dari Left TRU; **DC Standby Bus** — sistem penting; **Hot Battery Bus** — **selalu** dialiri Main Battery."])],
   [("ul", [
      "{飛行機|ひこうき}の{電気|でんき}は、{交流|こうりゅう}（AC）115/200V・400Hzと、{直流|ちょくりゅう}（DC）28Vの2{種類|しゅるい}です。",
      "{交流電源|こうりゅうでんげん}は4{種類|しゅるい}：IDG（{各|かく}エンジンに1{台|だい}、{主電源|しゅでんげん}）、APUジェネレーター、{外部電源|がいぶでんげん}（{機首|きしゅ}のレセプタクル）、メイン・バッテリー（{非常時|ひじょうじ}はスタティック・インバーターで{交流|こうりゅう}にする）。",
      "{直流電源|ちょくりゅうでんげん}は3{種類|しゅるい}：TRU（AC115Vを28VDCに{変換|へんかん}、{主電源|しゅでんげん}）、メイン・バッテリー、APUバッテリー（APUの{始動用|しどうよう}）。",
      "「バス」は、{電源|でんげん}の{電力|でんりょく}を1か{所|しょ}に{集|あつ}めて、グループのシステムに{配|くば}る{部分|ぶぶん}です。メインACバス、トランスファー・バス、ACスタンバイ・バス、28V ACバス、28V DCバス、バッテリー・バス、DCスタンバイ・バス、ホット・バッテリー・バスがあります。ホット・バッテリー・バスには{常|つね}にメイン・バッテリーの{電力|でんりょく}が{来|き}ています。"])]),
  ("b5s2", "Sistem Kontrol Penerbangan (Flight Control)", "操縦システム", [56, 60], [
    ("ul", [
      "**Primary Flight Control**: **Elevator** (sumbu **Pitch**, hidung naik-turun), **Aileron** (sumbu **Roll**, miring kiri-kanan), **Rudder** (sumbu **Yaw**, hidung kiri-kanan).",
      "**Secondary Flight Control**: **Leading Edge (LE) Slat**, **Trailing Edge (TE) Flap**, **Spoiler (Speed Brake)**, **Stabilizer Trim System**.",
      "Semua sistem kontrol memakai **tenaga hidrolik (Primary Power)**. **LE Slat dan TE Flap** juga memakai **listrik sebagai Secondary Power**. Pesawat baru umumnya **Fly-By-Wire** (sinyal listrik tanpa kabel kontrol).",
      "**Komponen**: **Main wing** = penghasil gaya angkat. **Horizontal Stabilizer** (bergerak dengan hidrolik/listrik) dan **Vertical Stabilizer** (**tidak bergerak**) menstabilkan gerakan atas-bawah dan kiri-kanan. **Elevator** di belakang horizontal stabilizer (terbagi **Inboard / Outboard**). **Aileron** di belakang sayap (I/B & O/B); ada **Flaperon**. **Rudder** di belakang vertical stabilizer (**Upper/Lower**); **Yaw Damper** meredam goyangan kiri-kanan lewat rudder.",
      "**Spoiler**: di permukaan atas sayap, **mengurangi gaya angkat**. **Flight Spoiler** (di udara; saat turun/berbelok) dan **Ground Spoiler** (setelah mendarat; **membantu pengereman**).",
      "**LE Slat**: di bagian depan sayap (I/B & O/B), **PDU** (Power Drive Unit) satu untuk tiap I/B dan O/B; hidrolik + listrik. **TE Flap**: di bagian belakang sayap (I/B & O/B), **PDU hanya satu**; hidrolik + listrik."])],
   [("ul", [
      "{主|おも}な{操縦|そうじゅう}システム：エレベーター（ピッチ＝{機首|きしゅ}の{上下|うえした}）、エルロン（ロール＝{左右|さゆう}の{傾|かたむ}き）、ラダー（ヨー＝{機首|きしゅ}の{左右|さゆう}）。",
      "{副|ふく}{操縦|そうじゅう}システム：スラット、フラップ、スポイラー（スピード・ブレーキ）、スタビライザー・トリム。",
      "すべての{操縦|そうじゅう}システムは、{油圧|ゆあつ}を{動力|どうりょく}にしています。スラットとフラップは、{電気|でんき}も{使|つか}います。{新|あたら}しい{機種|きしゅ}は、{電気信号|でんきしんごう}を{使|つか}うフライ・バイ・ワイヤ{方式|ほうしき}が{主流|しゅりゅう}です。",
      "{水平安定板|すいへいあんていばん}は{動|うご}きますが、{垂直安定板|すいちょくあんていばん}は{動|うご}きません。エレベーターは{水平安定板|すいへいあんていばん}の{後|うし}ろ、ラダーは{垂直安定板|すいちょくあんていばん}の{後|うし}ろにあります。エルロンは{主翼|しゅよく}の{後|うし}ろにあり、フラペロンというフラップの{機能|きのう}もあるものがあります。",
      "スポイラーは{主翼|しゅよく}の{上|うえ}にあり、{揚力|ようりょく}を{減|へ}らします。{飛行中|ひこうちゅう}に{使|つか}うものはフライト・スポイラー、{着陸後|ちゃくりくご}にブレーキを{助|たす}けるものはグラウンド・スポイラーです。",
      "スラットは{主翼|しゅよく}の{前|まえ}、フラップは{主翼|しゅよく}の{後|うし}ろにあります。スラットのPDUは{内側|うちがわ}・{外側|そとがわ}に1{台|だい}ずつ、フラップのPDUは1{台|だい}だけです。"])]),
  ("b5s3", "Sistem Hidrolik (Hydraulic)", "油圧システム", [61, 62], [
    ("ul", [
      "Pesawat **bermesin dua** memiliki **3 sistem hidrolik independen**: **Left, Center, Right**. Hidrolik menggerakkan sistem yang butuh gaya besar: **Landing Gear, Flight Control**, dll.",
      "Komponen utama ada di mesin, **Engine Strut**, **Main Gear Wheel Well**, **Wing/Body Fairing**.",
      "**Pompa**: **EDP (Engine Driven Pump)** — satu per mesin, **Primary Pump** sistem Left & Right; **ACMP (AC Motor Pump)** — **Primary Pump sistem Center**; juga satu di Left & Right sebagai **Secondary/Demand Pump** (saat butuh banyak, mis. landing gear naik-turun); **ADP (Air Driven Pump)** — digerakkan udara bertekanan, **Demand Pump sistem Center**."])],
   [("ul", [
      "{双発機|そうはつき}の{油圧|ゆあつ}システムは、{独立|どくりつ}した3{系統|けいとう}（Left・Center・Right）です。{脚|あし}や{操縦|そうじゅう}システムなど、{大|おお}きな{力|ちから}が{必要|ひつよう}なものを{動|うご}かします。",
      "ポンプ：EDP（エンジン{駆動|くどう}、LeftとRightの{主|おも}なポンプ）、ACMP（{交流|こうりゅう}モーター{駆動|くどう}、Centerの{主|おも}なポンプ、LeftとRightのデマンド・ポンプ）、ADP（{圧縮空気|あっしゅくくうき}で{動|うご}く、Centerのデマンド・ポンプ）。"])]),
  ("b5s4", "Sistem Udara Bertekanan (Pneumatic)", "圧縮空気システム", [63, 64], [
    ("ul", [
      "Menyediakan **udara bertekanan dengan suhu dan tekanan yang diatur** ke sistem pesawat.",
      "**3 sumber udara**: **Engine Compressor Bleed Air** (saat mesin hidup, suhu/tekanan diatur), **APU Bleed Air** (di darat; cadangan di udara bila bleed air mesin rusak), **Ground Pneumatic Cart Air** (di darat sebagai pengganti mesin/APU).",
      "**Pengguna**: **Wing Leading Edge Thermal Anti-Icing**, **Engine Nose Cowl Anti-Icing**, **Main Engine Starting**, **Hydraulic Reservoir Pressurization**, **Air Conditioning**, **Air Driven Hydraulic Pump**, **Potable Water Tank Pressurization**, **Thrust Reverser**.",
      "**Start mesin**: normalnya udara dari **APU** memutar **starter**; ada mesin dengan starter listrik; saat APU rusak bisa pakai **Ground Pneumatic Cart**."])],
   [("ul", [
      "{圧縮空気|あっしゅくくうき}システムは、{温度|おんど}と{圧力|あつりょく}を{調整|ちょうせい}した{空気|くうき}を{各|かく}システムに{送|おく}ります。",
      "{空気|くうき}の{供給源|きょうきゅうげん}は、エンジン・ブリード・エア、APUブリード・エア、{地上|ちじょう}のニューマチック・カートの3つです。",
      "{使|つか}うところ：{主翼前縁|しゅよくぜんえん}・エンジン・カウルの{防氷|ぼうひょう}、エンジンの{始動|しどう}、{油圧|ゆあつ}タンクの{加圧|かあつ}、{空調|くうちょう}、ADP、{飲料水|いんりょうすい}タンクの{加圧|かあつ}、スラスト・リバーサー。",
      "エンジンの{始動|しどう}は、ふつうAPUの{空気|くうき}でスターターを{回|まわ}します。"])]),
  ("b5s5", "Pengetahuan Umum Sistem Pesawat", "航空機各システム一般知識", [65, 67], [
    ("ul", [
      "**Air Conditioning**: pesawat terbang tinggi → kabin **diberi tekanan (Cabin Pressurization)**; memakai **Air Cycle Machine**; **Ozone Converter** membuang ozon.",
      "**Communications**: selain radio, ada **SATCOM**; **Static Discharger** di ujung sayap dan stabilizer membuang listrik statis.",
      "**Fuel**: tangki utama di dalam sayap; tangki diisi **nitrogen (N₂)** untuk mengurangi bahaya ledakan.",
      "**Rain Protection**: **wiper** di windshield, bisa dipakai saat terbang.",
      "**Landing Gear**: setelah lepas landas roda berhenti berputar dan **masuk Wheel Well** (kurangi hambatan); **rem hanya di roda utama (main gear)**, bukan semua roda; ada sistem deteksi **suhu rem dan tekanan ban**; rem bisa **otomatis** saat mendarat; **Anti-Skid System** mencegah ban rusak. Setelah mendarat: rem + **Thrust Reverser** + **Spoiler**.",
      "**Oxygen**: untuk dekompresi mendadak, **generator oksigen tipe reaksi kimia (Chemical Oxygen Generator)** yang utama.",
      "**Struktur**: badan dari **aluminium** dan **material komposit**; lantai kabin komposit **honeycomb**; jendela kabin **dua lapis** (anti-kabut); pintu masuk punya **alat evakuasi darurat**; **Radome** berisi radar cuaca dan antena ILS; pesawat bisa rusak karena **sambaran petir**.",
      "**Engine**: bisa rusak karena **Bird Strike**; bisa mundur dengan Reverser tetapi **biasanya tidak** (menyedot benda asing); susunan **Fan → Compressor → Combustion Chamber → Turbine**; poros 2 atau 3 ditopang **Ball & Roller Bearing** berpendingin oli; kerusakan bearing ditemukan dengan **analisis oli pelumas**; mesin/komponen penting **diganti menurut Flight Cycle/Flight Hour** meski tanpa cacat; **Ignition System** juga menyala untuk mencegah **flameout**; **Variable Stator Vane** bergerak **membuka** saat putaran naik.",
      "**Operation**: urutan fase terbang: **Takeoff → Climb → Cruise → Descent → Approach → (Go-Around) → Flare → Rollout**. **Gaya angkat (Lift) sebanding dengan kuadrat kecepatan.**"])],
   [("ul", [
      "{空調|くうちょう}：{高|たか}い{所|ところ}を{飛|と}ぶので、{機内|きない}に{圧力|あつりょく}をかけます（{与圧|よあつ}）。エア・サイクル・マシンを{使|つか}い、オゾン・コンバーターでオゾンを{取|と}ります。",
      "{通信|つうしん}：{無線機|むせんき}のほかに{衛星電話|えいせいでんわ}（SATCOM）があります。スタティック・ディスチャージャーが{静電気|せいでんき}を{逃|に}がします。",
      "{燃料|ねんりょう}：{主翼|しゅよく}の{内部|ないぶ}がおもな{燃料|ねんりょう}タンクで、{爆発|ばくはつ}の{危険|きけん}を{減|へ}らすために{窒素|ちっそ}を{入|い}れます。",
      "{脚|あし}：{離陸後|りりくご}はタイヤの{回転|かいてん}を{止|と}めて{脚|あし}を{格納|かくのう}します。ブレーキは{主脚|しゅきゃく}のタイヤだけにあります。アンチ・スキッド{装置|そうち}があります。{着陸後|ちゃくりくご}は、ブレーキ・{逆噴射|ぎゃくふんしゃ}（スラスト・リバーサー）・スポイラーを{使|つか}います。",
      "{酸素|さんそ}：{急減圧|きゅうげんあつ}のときは、{化学反応|かがくはんのう}{型|がた}の{酸素|さんそ}{発生器|はっせいき}を{使|つか}います。",
      "{構造|こうぞう}：{胴体|どうたい}はアルミや{複合材料|ふくごうざいりょう}、{客室|きゃくしつ}の{床|ゆか}は{軽|かる}いハニカム{構造|こうぞう}、{窓|まど}は2{重|じゅう}{構造|こうぞう}です。{機首|きしゅ}のレドームには{気象|きしょう}レーダーとILSのアンテナがあります。{落雷|らくらい}で{傷|きず}つくことがあります。",
      "エンジン：バード・ストライクで{傷|きず}つくことがあります。{内部|ないぶ}は{前|まえ}から、ファン→コンプレッサー→{燃焼室|ねんしょうしつ}→タービンです。ベアリングの{傷|いた}みは{潤滑油|じゅんかつゆ}の{分析|ぶんせき}で{見|み}つけます。{重要|じゅうよう}な{部品|ぶひん}は、{不具合|ふぐあい}がなくても、{使用回数|しようかいすう}（フライト・サイクル）や{使用時間|しようじかん}（フライト・アワー）で{交換|こうかん}します。",
      "{飛行|ひこう}の{順番|じゅんばん}：テイクオフ→クライム→クルーズ→ディセント→アプローチ→（ゴー・アラウンド）→フレア→ロールアウト。{揚力|ようりょく}は{速度|そくど}の2{乗|じょう}に{比例|ひれい}して{増|ふ}えます。"])]),
 ]),
]
