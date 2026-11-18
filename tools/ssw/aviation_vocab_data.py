# -*- coding: utf-8 -*-
"""Kosakata Aviation. Format baris: kata|kana|arti|subbab. Arti Indonesia ditulis Shirose; istilah diambil dari teks resmi JAEA."""
GH = """
グランドハンドリング|ぐらんどはんどりんぐ|ground handling (layanan darat bandara)|b1s1
航空機|こうくうき|pesawat terbang|b1s1
安全性|あんぜんせい|keselamatan (sebagai tujuan operasi)|b1s1
定時性|ていじせい|ketepatan waktu|b1s1
快適性|かいてきせい|kenyamanan|b1s1
機長|きちょう|kapten pesawat|b1s1
整備士|せいびし|mekanik pesawat|b1s1
凹み|へこみ|penyok (dent)|b1s1
工程管理|こうていかんり|manajemen proses kerja|b1s1
マーシャラー|まーしゃらー|marshaller (pemandu pesawat parkir)|b1s1
搭乗橋|とうじょうきょう|jembatan boarding (PBB)|b1s1
牽引車|けんいんしゃ|kendaraan penarik (towing)|b1s1
前脚|まえあし|roda depan (nose gear)|b1s1
地上支援機材|ちじょうしえんきざい|peralatan pendukung darat (GSE)|b1s1
基本情報|きほんじょうほう|informasi dasar penerbangan|b1s2
便名|びんめい|nomor penerbangan|b1s2
発地|はっち|tempat asal|b1s2
着地|ちゃくち|tempat tujuan|b1s2
駐機場|ちゅうきじょう|tempat parkir pesawat|b1s2
搭載物|とうさいぶつ|muatan|b1s2
機移し|きうつし|pemindahan langsung muatan antar pesawat|b1s2
搭載計画|とうさいけいかく|rencana muat|b1s2
接続搭載物|せつぞくとうさいぶつ|muatan sambungan (transit)|b1s2
特殊搭載物|とくしゅとうさいぶつ|muatan khusus (mis. barang berbahaya)|b1s2
コントローラー|こんとろーらー|controller (pengendali operasi)|b1s2
インストラクション・シート|いんすとらくしょん・しーと|lembar instruksi muat|b1s2
ULD|ゆーえるでぃー|ULD (Unit Load Device)|b1s2
機側|きそく|sisi pesawat|b2s1
バルク|ばるく|bulk (muatan curah, dimuat manual)|b2s1
貨物室|かもつしつ|ruang kargo|b2s1
トーイング・トラクター|とーいんぐ・とらくたー|towing tractor|b2s1
ドーリー|どーりー|dolly (kereta bawa kontainer/palet)|b2s1
バルク・カート|ばるく・かーと|bulk cart (kereta muatan curah)|b2s1
ハイリフト・ローダー|はいりふと・ろーだー|high-lift loader|b2s1
ベルト・ローダー|べると・ろーだー|belt loader (konveyor muat bulk)|b2s1
牽引|けんいん|menarik, penarikan (towing)|b2s1
遠心力|えんしんりょく|gaya sentrifugal|b2s1
作業責任者|さぎょうせきにんしゃ|penanggung jawab kerja|b2s2
役割分担|やくわりぶんたん|pembagian peran|b2s2
搭降載|とうこうさい|memuat dan menurunkan muatan|b2s2
指差呼称|ゆびさしこしょう|tunjuk-sebut (konfirmasi dengan menunjuk dan menyebut)|b2s2
翼下|よくか|bawah sayap|b2s2
連結|れんけつ|menyambung, sambungan|b2s2
積み残し|つみのこし|muatan tertinggal|b2s3
手荷物|てにもつ|bagasi tangan / bagasi penumpang|b2s3
貨物識別ラベル|かもつしきべつらべる|label identifikasi kargo|b2s3
荷崩れ|にくずれ|muatan roboh|b2s3
最小接続時間|さいしょうせつぞくじかん|waktu transit minimum (MCT)|b2s4
完了報告|かんりょうほうこく|laporan selesai|b2s4
給水|きゅうすい|pengisian air|b3s1
排水|はいすい|pengurasan air|b3s1
給水車|きゅうすいしゃ|mobil air (water car)|b3s1
排水車|はいすいしゃ|mobil pengurasan air|b3s1
飲料水|いんりょうすい|air minum|b3s1
汚水|おすい|air kotor|b3s2
汚水車|おすいしゃ|mobil toilet (lavatory car)|b3s2
殺菌消臭剤|さっきんしょうしゅうざい|disinfektan dan penghilang bau|b3s2
機内空調|きないくうちょう|pendingin udara kabin|b3s3
地上空調供給設備|ちじょうくうちょうきょうきゅうせつび|fasilitas pasokan AC darat|b3s3
地上電源|ちじょうでんげん|listrik darat (GPU)|b3s4
補助動力装置|ほじょどうりょくそうち|APU (Auxiliary Power Unit)|b3s4
脱炭素|だつたんそ|dekarbonisasi|b3s4
手荷物仕分け|てにもつしわけ|penyortiran bagasi|b4s1
クレーム・タグ|くれーむ・たぐ|claim tag (tanda terima bagasi)|b4s1
ハンディターミナル|はんでぃたーみなる|handheld terminal (HHT)|b4s1
誤搭載|ごとうさい|salah muat|b4s1
取扱注意|とりあつかいちゅうい|tangani dengan hati-hati|b4s1
重量物|じゅうりょうぶつ|barang berat|b4s1
貨物仕分け|かもつしわけ|penyortiran kargo|b4s2
航空貨物|こうくうかもつ|kargo udara|b4s2
行先タグ|ゆきさきたぐ|tag tujuan|b4s2
ケアマーク|けあまーく|care mark (tanda penanganan)|b4s2
生鮮食料品|せいせんしょくりょうひん|makanan segar|b4s2
こわれもの|こわれもの|barang pecah belah|b4s2
水濡れ厳禁|みずぬれげんきん|dilarang kena air|b4s2
天地無用|てんちむよう|jangan dibalik|b4s2
貨物運送約款|かもつうんそうやっかん|perjanjian angkutan kargo|b4s2
荷送人|におくりにん|pengirim barang|b4s2
フォークリフト|ふぉーくりふと|forklift|b4s2
通関|つうかん|bea cukai, proses kepabeanan|b4s2
保税|ほぜい|berikat|b4s2
機内清掃|きないせいそう|pembersihan kabin|b5s1
飛行間作業|ひこうかんさぎょう|pekerjaan antar penerbangan|b5s1
飛行後作業|ひこうごさぎょう|pekerjaan setelah penerbangan|b5s1
国際線|こくさいせん|rute internasional|b5s1
国内線|こくないせん|rute domestik|b5s1
座席ポケット|ざせきぽけっと|kantong kursi|b5s1
安全のしおり|あんぜんのしおり|kartu petunjuk keselamatan|b5s1
忘れ物|わすれもの|barang tertinggal|b5s1
不審物|ふしんぶつ|benda mencurigakan|b5s1
ギャレー|ぎゃれー|galley (dapur pesawat)|b5s1
ラバトリー|らばとりー|lavatory (toilet pesawat)|b5s1
客室用品|きゃくしつようひん|perlengkapan kabin|b5s2
機内食|きないしょく|makanan dalam pesawat|b5s2
搬送台車|はんそうだいしゃ|kereta pengangkut|b5s2
アウトリガー|あうとりがー|outrigger (penopang kendaraan)|b5s2
密輸|みつゆ|penyelundupan|b5s2
給油|きゅうゆ|pengisian bahan bakar|b6s1
航空燃料|こうくうねんりょう|bahan bakar penerbangan|b6s1
燃料搭載|ねんりょうとうさい|pemuatan bahan bakar|b6s1
燃料オーダー|ねんりょうおーだー|fuel order (jumlah BBM yang diminta)|b6s1
代替空港|だいたいくうこう|bandara alternatif|b6s1
予備燃料|よびねんりょう|bahan bakar cadangan|b6s1
静電気|せいでんき|listrik statis|b6s1
危険区域|きけんくいき|area bahaya|b6s1
車輪止め|しゃりんどめ|ganjal roda|b6s1
旅客|りょかく|penumpang|b7s1
搭乗券|とうじょうけん|boarding pass|b7s1
預け入れ手荷物|あずけいれてにもつ|bagasi tercatat|b7s1
搭乗口|とうじょうぐち|pintu keberangkatan (gate)|b7s1
乗り継ぎ|のりつぎ|transit, sambung penerbangan|b7s2
車椅子|くるまいす|kursi roda|b7s2
診断書|しんだんしょ|surat keterangan dokter|b7s2
空港|くうこう|bandara|b7s3
""".strip().split("\n")

AM = """
ボルト|ぼると|baut|b1s1
ナット|なっと|mur|b1s2
スクリュー|すくりゅー|sekrup|b1s3
ワッシャー|わっしゃー|ring (washer)|b1s4
締結|ていけつ|pengencangan, sambungan (fastening)|b1s1
剪断荷重|せんだんかじゅう|beban geser|b1s1
引張荷重|ひっぱりかじゅう|beban tarik|b1s1
呼び径|よびけい|diameter nominal|b1s1
腐食|ふしょく|korosi|b1s1
六角頭ボルト|ろっかくあたまぼると|baut kepala segi enam|b1s1
皿頭ボルト|さらあたまぼると|baut kepala tenggelam (flush)|b1s1
精密公差ボルト|せいみつこうさぼると|baut toleransi presisi|b1s1
面取り|めんとり|chamfer (pahat tepi)|b1s1
セルフ・ロッキング・ナット|せるふ・ろっきんぐ・なっと|mur pengunci sendiri|b1s2
溝付きナット|みぞつきなっと|castellated nut (mur beralur)|b1s2
ロッキング・トルク|ろっきんぐ・とるく|locking torque|b1s2
並目ねじ|なみめねじ|ulir kasar|b1s3
細目ねじ|ほそめねじ|ulir halus|b1s3
セルフ・タッピング・スクリュー|せるふ・たっぴんぐ・すくりゅー|sekrup self-tapping|b1s3
平ワッシャー|ひらわっしゃー|plain washer (ring datar)|b1s4
ロック・ワッシャー|ろっく・わっしゃー|lock washer (ring pengunci)|b1s4
締付けトルク|しめつけとるく|torsi pengencangan|b1s5
トルク・レンチ|とるく・れんち|torque wrench|b1s5
校正|こうせい|kalibrasi|b1s5
疲労破壊|ひろうはかい|kegagalan akibat kelelahan material|b1s5
安全線|あんぜんせん|safety wire (kawat pengaman)|b1s6
回り止め|まわりどめ|pencegah putar / longgar|b1s6
ダブル・ツイスト・ワイヤ方法|だぶる・ついすと・わいやほうほう|metode double twist wire|b1s6
シングル・ワイヤ方法|しんぐる・わいやほうほう|metode single wire|b1s6
ピグテイル|ぴぐてぃる|pigtail (ujung kawat)|b1s6
コッター・ピン|こったー・ぴん|cotter pin (pin belah)|b1s7
割ピン|わりぴん|pin belah (cotter pin)|b1s7
回路計|かいろけい|tester (circuit tester)|b2s1
テスター|てすたー|tester|b2s1
測定|そくてい|pengukuran|b2s1
直流電圧|ちょくりゅうでんあつ|tegangan DC|b2s1
交流電圧|こうりゅうでんあつ|tegangan AC|b2s1
並列|へいれつ|paralel|b2s1
直列|ちょくれつ|seri|b2s2
抵抗|ていこう|resistansi / resistor|b2s2
ゼロΩ調整|ぜろおーむちょうせい|penyetelan nol ohm|b2s2
極性|きょくせい|polaritas|b2s2
目盛|めもり|skala|b2s1
労働安全衛生法|ろうどうあんぜんえいせいほう|UU Keselamatan dan Kesehatan Kerja|b3s1
安全|あんぜん|keselamatan|b3s1
衛生|えいせい|kebersihan/kesehatan (hygiene)|b3s1
健康|けんこう|kesehatan|b3s1
不安全な行動|ふあんぜんなこうどう|tindakan tidak aman|b3s1
保護具|ほごぐ|alat pelindung diri (APD)|b3s2
墜落制止用器具|ついらくせいしようきぐ|alat penahan jatuh (full harness)|b3s2
防毒マスク|ぼうどくますく|masker gas|b3s2
安全装置|あんぜんそうち|alat pengaman|b3s2
整理|せいり|seiri: menyingkirkan yang tidak perlu|b3s2
整頓|せいとん|seiton: menata rapi|b3s2
火気厳禁|かきげんきん|dilarang api|b3s3
自然発火|しぜんはっか|menyala sendiri (spontan)|b3s3
消火器|しょうかき|alat pemadam api (APAR)|b3s3
照明|しょうめい|penerangan|b3s3
有機溶剤|ゆうきようざい|pelarut organik|b3s3
回転体|かいてんたい|benda berputar|b3s3
酸素欠乏|さんそけつぼう|kekurangan oksigen|b3s3
送気マスク|そうきますく|masker pasokan udara|b3s3
耳栓|みみせん|sumbat telinga|b3s3
騒音|そうおん|kebisingan|b3s3
品質|ひんしつ|kualitas|b4s1
整備品質|せいびひんしつ|kualitas perawatan|b4s1
機材品質|きざいひんしつ|kualitas peralatan (pesawat)|b4s1
作業品質|さぎょうひんしつ|kualitas pekerjaan|b4s1
不具合|ふぐあい|cacat, kerusakan, ketidaksesuaian|b4s1
品質指標|ひんしつしひょう|indikator kualitas|b4s2
信頼性管理|しんらいせいかんり|manajemen keandalan|b4s2
是正|ぜせい|perbaikan (tindakan korektif)|b4s2
ヒューマンファクター|ひゅーまんふぁくたー|human factor|b4s3
ヒューマンエラー|ひゅーまんえらー|human error (kesalahan manusia)|b4s3
ヒヤリハット|ひやりはっと|hampir celaka (near miss)|b4s3
ハインリッヒの法則|はいんりっひのほうそく|hukum Heinrich (1:29:300)|b4s3
インシデント|いんしでんと|insiden|b4s3
交流電源|こうりゅうでんげん|sumber daya AC|b5s1
直流電源|ちょくりゅうでんげん|sumber daya DC|b5s1
外部電源|がいぶでんげん|daya eksternal (dari darat)|b5s1
バス|ばす|bus (titik distribusi daya listrik)|b5s1
操縦システム|そうじゅうしすてむ|sistem kontrol penerbangan|b5s2
昇降舵|しょうこうだ|elevator|b5s2
補助翼|ほじょよく|aileron|b5s2
方向舵|ほうこうだ|rudder|b5s2
水平安定板|すいへいあんていばん|stabilizer horizontal|b5s2
垂直安定板|すいちょくあんていばん|stabilizer vertikal|b5s2
動翼|どうよく|permukaan kontrol bergerak (control surface)|b5s2
揚力|ようりょく|gaya angkat (lift)|b5s2
スポイラー|すぽいらー|spoiler|b5s2
スラット|すらっと|slat (sayap depan)|b5s2
フラップ|ふらっぷ|flap|b5s2
油圧|ゆあつ|tekanan hidrolik|b5s3
双発機|そうはつき|pesawat bermesin dua|b5s3
圧縮空気|あっしゅくくうき|udara bertekanan (pneumatic)|b5s4
防氷|ぼうひょう|anti-es (anti-icing)|b5s4
与圧|よあつ|pemberian tekanan kabin (pressurization)|b5s5
脚|あし|roda pendarat (landing gear)|b5s5
逆噴射|ぎゃくふんしゃ|thrust reverser (dorongan balik)|b5s5
胴体|どうたい|badan pesawat (fuselage)|b5s5
落雷|らくらい|sambaran petir|b5s5
""".strip().split("\n")
import aviation_gh_text1 as _T1
GH += _T1.VOCAB
