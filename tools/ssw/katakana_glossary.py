# -*- coding: utf-8 -*-
"""Arti Indonesia untuk kata katakana yang muncul di materi SSW tetapi belum ada di bank kosakata.
Ditulis Shirose (ORIGINAL LEARNING CONTENT, perlu review ahli). Token pecahan/tidak bermakna sengaja tidak dimasukkan."""
G = {}
def add(s):
    for line in s.strip().splitlines():
        line = line.strip()
        if not line: continue
        k, a = line.split(" ", 1); G[k] = a.strip()
add("""
アイ mata/lubang (mis. mata baut)
アクセプター akseptor (penerima elektron pada semikonduktor)
アクチュエーター aktuator (penggerak)
アセスメント penilaian (assessment)
アダプター adaptor
アナログ analog
アナログテスター multimeter analog
アニオン anion (ion bermuatan negatif)
アノード anoda (elektroda positif)
アラウンド sekeliling (around)
アルカリエッチング etsa alkali
アルカリミスト kabut alkali
アルニコ alnico (paduan magnet aluminium-nikel-kobalt)
アルファベット alfabet (huruf Latin)
アルマイト alumite (pelapisan anodisasi aluminium)
アルマイトライン lini proses alumite
アルミナ alumina (aluminium oksida)
アルミニウムダイカスト die casting aluminium
アルミホイル aluminium foil
アワー jam (hour)
アンチ anti-
アンド dan (AND)
アンペア ampere (satuan arus listrik)
アンペール Ampère (nama ilmuwan; hukum Ampère)
アンモニア amonia
アンモニウム amonium
イタイイタイ itai-itai (penyakit akibat keracunan kadmium)
イリジウム iridium
インストラクション instruksi
インターナル internal (di dalam)
インダクタ induktor
インダクタンス induktansi
インデックステーブル meja indeks (meja putar mesin)
インバーター inverter
インピーダンス impedansi
インフレーション inflasi (mis. cetak tiup film)
ウェットエッチング etsa basah
ウエイト bobot/beban (weight)
ウレタンスポンジ spons urethane
ウール wol
ウールバフ buff wol (poles)
エア udara
エアバス Airbus (pesawat)
エアー udara
エアーグラインダー gerinda angin (pneumatik)
エクスターナル eksternal (di luar)
エコー gema (echo)
エジェクタピン pin pelontar (cetakan)
エッジ tepi (edge)
エッチング etsa (etching)
エナメル enamel
エポキシ epoksi
エポキシポリイミド epoksi poliimida
エミッタ emitor (transistor)
エラー kesalahan (error)
エルロン aileron (sirip sayap pesawat)
エンコーダ enkoder
エンジンオイル oli mesin
エンジンキー kunci kontak mesin
エンスト mesin mati mendadak (engine stall)
エンドミル end mill (pahat frais)
エンドミルフライス mesin frais end mill
オキシダント oksidan
オシログラフ osilograf
オシロスコープ osiloskop
オス jantan; bagian jantan (male)
オゾン ozon
オフ mati (off)
オフディレー penundaan saat mati (off-delay)
オフロード jalan luar (off-road)
オペアンプ penguat operasional (op-amp)
オレンジ jingga/jeruk
オン hidup (on)
オンディレー penundaan saat hidup (on-delay)
オンディレータイマー timer on-delay
オートポンチ penitik otomatis
オーバー melebihi (over)
オーバーフロー meluap (overflow)
オープンスペース ruang terbuka
オーム ohm (satuan hambatan)
カウル kap/penutup (cowl)
カエリ gerigi/ burr tepi (bekas potong)
カゴ keranjang/kerangka kawat
カス sisa/ampas
カソード katoda (elektroda negatif)
カチオン kation (ion bermuatan positif)
カドミウムメッキ pelapisan kadmium
カム nok/cam
カラフル berwarna-warni
カラマツ larch (pohon karamatsu)
カラーコード kode warna
カリウム kalium
カルシウム kalsium
カレンダーロール rol kalender (pengepres/setrika linen)
カンデラ kandela (satuan intensitas cahaya)
カー mobil (car)
カーボン karbon
カーボンアークランプ lampu busur karbon
ガウスメーター gaussmeter (pengukur medan magnet)
ガスゼロ nol gas (kalibrasi nol)
ガタ kelonggaran/goyang
ガタツキ goyangan/kelonggaran
ガラスエポキシ epoksi serat kaca
ガラスエポキシプリント PCB epoksi kaca
ガンマ gamma
ガードレール pagar pengaman jalan
キズ goresan/cacat
キセノン xenon
キセノンアークランプ lampu busur xenon
キャス roda putar (caster)
キャップスクリュー sekrup tutup (cap screw)
キャパシタンス kapasitansi
キャビン kabin
キャリアステップ jenjang karier
キャンバー camber (kemiringan roda)
キルヒホッフ Kirchhoff (hukum Kirchhoff)
キレート khelat
キログラム kilogram
キロメートル kilometer
クライム menanjak (climb)
クラクション klakson
クラック retakan
クランク engkol
クリッパ pemotong/klip
クルーズ pelayaran (cruise)
クレビス clevis (sambungan berpin)
クロスフォルダー pelipat silang (mesin lipat linen)
クロムメッキ pelapisan krom
クロメート kromat (perlakuan kromat)
クーロン coulomb (satuan muatan)
グラフデータ data grafik
グラム gram
グランドスタッフ staf darat bandara (ground staff)
グリス gemuk pelumas
グリッド kisi (grid)
グリル gril
ゲート gerbang/pintu masuk (gate)
ゲートトランジスタ transistor gerbang
ゲオルク Georg (nama; Georg Ohm)
ゲルマニウム germanium
ケイ silikon (ケイ素)
ケルビン kelvin
コイルリレー relai koil
コイルリレーコイル koil relai
コシ kekuatan/kekenyalan
コッター cotter (pasak belah)
コニカルビーカー gelas erlenmeyer
コバ tepi/sisi potongan
コバルト kobalt
コラム kolom/tiang
コレクタ kolektor (transistor)
コンタクタ kontaktor
コンタクタコイル koil kontaktor
コンダクタ konduktor
コンデンサ kapasitor
コンデンサアース pembumian kapasitor
コンバータ konverter
コンバータアナログ konverter analog
コンバータデジタル konverter digital
コンバーター konverter
コンピュータ komputer
コンプレッサー kompresor
コンベヤー konveyor
コンロ kompor
コールドチャンバダイカスト die casting ruang dingin
ゴムワッシャ ring karet (washer)
ゴールド emas (gold)
サイクロン siklon
サイザル sisal (serat agave)
サイザルバフ buff sisal
サイザー pengukur ukuran (sizer)
ササ bambu kecil (sasa)
サテン satin
サドル sadel
サブミリオーダー orde submilimeter
サンダー pengamplas (sander)
サンプリング pengambilan sampel
サンプリングレート laju pengambilan sampel
サンプルサイズ ukuran sampel
サンプルレート laju sampel
サービサー servis (penyedia layanan)
サーボモータ motor servo
サーマルリレー relai termal
サーミスタ termistor
シア geser (shear)
シアン sianida
シグナル sinyal
シップ kapal
シャーシ sasis
シュリンクフィルム film pengerut (shrink)
ショア Shore (kekerasan Shore)
シリカ silika
シリコン silikon
シリコンゴム karet silikon
シリンダゲージ pengukur silinder (cylinder gauge)
シリンダーモータ motor silinder
シンガポール Singapura
シングルアーム satu lengan
シンブル thimble (selongsong pada mikrometer)
シンブルフレーム rangka thimble
シンプル sederhana
シーケンス urutan (sequence)
シーケンスプログラム program sekuens
シース selubung (sheath)
シールドガス gas pelindung (las)
ジェット jet
ジェネレーター generator
ジグ jig (alat bantu kerja)
ジグザグ zig-zag
ジバフ buff jibaf (poles kain)
ジャカルタ Jakarta
ジュラルミン duralumin
ジュール joule
ジョウ rahang (jaw)
ジョウスライダ penggeser rahang
ジョウバーニヤ rahang vernier
ジンケート zincate (celup seng)
ジーメンス siemens (satuan konduktansi)
""")
add("""
スイッチング pensakelaran (switching)
スキッド selip/ rangka alas (skid)
スキャナ pemindai
スキャナー pemindai
スキャン memindai
スキル keterampilan
スギ sugi (cedar Jepang)
スクラッチ goresan
スコヤ siku-siku tukang (sukoya)
スジ garis/urat
スズ timah
スタイラス stilus (jarum penelusur)
スタティック statis
スタビライザー penstabil
スタンバイ siaga (standby)
スターター starter
スターデルタ star-delta (starter motor)
スチロール stirena/styrofoam
ステップ langkah
ステム tangkai (stem)
ステートリレー relai keadaan
ストッパー penahan (stopper)
ストライク mengenai (strike)
ストレッチャー tandu/ alat peregang
スパッタ percikan las (spatter)
スパッタリング sputtering (pelapisan film tipis)
スピンドル spindel (poros utama)
スピンドルクランプスリーブ selongsong klem spindel
スプルー sprue (saluran masuk cetakan)
スプルーランナー sprue dan runner
スプレーガン pistol semprot
スペシャルアシスタンス bantuan khusus (penumpang)
スマッジング smudging (kotoran menempel)
スマット smut (kerak hitam)
スモッグ kabut asap
スライダ penggeser
スラスト dorongan aksial (thrust)
スリット celah sempit
スリッパ sandal rumah
スリップ tergelincir
スリーレター tiga huruf (kode bandara)
スルーホール lubang tembus (through-hole)
スロット slot/alur
スローアウェイバイト pahat sisipan (throwaway)
セキュリテイ keamanan (security)
セムス sems (sekrup berpelat cincin)
セラミック keramik
セラミックコンデンサ kapasitor keramik
セラミックヒーター pemanas keramik
セル sel
セルフ sendiri (self)
センサ sensor
センタ pusat/senter
センタドリル bor senter
センチ sentimeter
セーフ aman (safe)
ソフトウェア perangkat lunak
ソリッド padat (solid)
タイダウン pengikat muatan (tie-down)
タイムチャート diagram waktu
タコ pengait/ tabung (tako)
タッピング penguliran dalam (tapping)
タップハンドル gagang tap
タングステン tungsten
タービン turbin
ダイ cetakan/die
ダイオード dioda
ダイカスト die casting
ダイヤモンド berlian
ダイヤモンドハンマ palu berlian
ダイヤル dial/tombol putar
ダイヤルキャリパーゲージ jangka sorong dial
ダスト debu
ダブルジンケート zincate ganda
ダブルスキン kulit ganda
ダメージ kerusakan
ダンジー dansi (nama ukuran kecil)
チェストロール rol dada (mesin setrika linen)
チェックシートデータ data lembar periksa
チェーンバーカ pemotong kulit rantai (chain barker)
チタン titanium
チタンボルト baut titanium
チップコンデンサ kapasitor chip
チップサイロ silo serpihan kayu
チャック cekam (chuck)
チャネル kanal (channel)
チョコ coklat
ツイスト memuntir
ツイン ganda (twin)
ツェナーダイオード dioda zener
ツキ lapisan tipis kayu (tsuki, veneer)
ツヤ kilap
ツーレター dua huruf (kode)
テイクオフ lepas landas
テスティング pengujian
テント tenda
テーパー tirus (taper)
テーパーピン pin tirus
テーブルベッド meja kerja/dasar mesin
テーマ tema
テールゲートリフター pengangkat bak belakang (tail lift)
ディスチャージャー pelepas muatan (discharger)
ディセント menurun (descent)
デジタルセンサ sensor digital
デジタルテスター multimeter digital
デジタルノギス jangka sorong digital
デジタルマルチメーター multimeter digital
デスマット desmut (menghilangkan kerak hitam)
デプスゲージ pengukur kedalaman
デプスバー batang kedalaman
デマンド permintaan (demand)
デメリット kerugian (demerit)
データシート lembar data
トップハンドルチェーンソー gergaji rantai gagang atas
トランジスタ transistor
トランスファー transfer/pemindahan
トリポリ tripoli (bahan poles)
トリム merapikan (trim)
トレンド tren
トーイング penarikan (towing)
トースカン penggores tinggi (tohsukan)
トーバー batang penarik (tow bar)
ドアハンドル gagang pintu
ドイツ Jerman
ドナー donor (semikonduktor)
ドライブ penggerak/mengemudi
ドライブレコーダ perekam mengemudi (dashcam)
ドライラミネート laminasi kering
ドロドロ kental/becek
ナイロンバフ buff nilon
ナットドライバ obeng nut
ナノメーター nanometer
ナンバー nomor
ナンバープレート pelat nomor
ニクロム nikrom
ニッケル nikel
ニューマチック pneumatik
ニューヨーク New York
ヌープ Knoop (kekerasan Knoop)
ネル flanel
ネルバフ buff flanel
ノイズ derau (noise)
ハイトゲージ pengukur tinggi
ハイドラント hidran
ハイリフト pengangkat tinggi (high lift)
ハインリッヒ Heinrich (hukum Heinrich: 1-29-300)
ハゲ botak/terkelupas
ハサミ gunting
ハッチング arsir (hatching)
ハット topi/profil topi
ハニカム sarang lebah
ハンディ genggam (handy)
ハンドグラインダ gerinda tangan
ハンドグラインダー gerinda tangan
ハンドバフ buff tangan
ハンドリベッター alat paku keling tangan
ハンドルチャックドリルベーステーブル bor dengan cekam gagang dan meja dasar
ハンマークラッシャ penghancur palu (hammer crusher)
ハードウェア perangkat keras
ハードタイム masa sulit
バイ dengan/ganda (bi-)
バイオマス biomassa
バイト pahat bubut (bite)
バイポーラトランジスタ transistor bipolar
バイメタル bimetal
バグフィルター filter kantong (bag filter)
バゲージ bagasi
バックラッシュ kelonggaran gigi (backlash)
バフ buff (poles dengan kain)
バラバラ berserakan
バリア penghalang (barrier)
バリウムイオン ion barium
バリコン kapasitor variabel
バレル barel/tong
バンコク Bangkok
バンド pita/sabuk
バード burung
バーニヤ vernier
パス jalur/lulus (pass)
パターンレジスト resist pola
パラジウム paladium
パラメータ parameter
パリ Paris
パレットラック rak pallet
パレート Pareto
パワーコンディショナー pengondisi daya
パーティクルボード papan partikel
ヒストグラムデータ data histogram
ヒダ lipatan
ヒノキ hinoki (cemara Jepang)
ヒューズ sekering
ヒンジ engsel
ヒートシンク pendingin panas (heat sink)
ビスマス bismut
ビッカース Vickers (kekerasan Vickers)
ビューレット buret
ビレット billet (batang logam)
ビーズ manik
ビード manik las (bead)
ビーム balok/sinar
ピカピカ mengilap
ピット lubang (pit)
ピンセット pinset
ピンホイール roda pin
ピンホール lubang jarum (pinhole)
""")
add("""
ファラデー Faraday (hukum Faraday)
ファーストクラス kelas satu
フィラメント filamen
フィルム film/selaput
フィルムコンデンサ kapasitor film
フィルムマスク masker film
フィン sirip (fin)
フィンガジョイント sambungan jari (finger joint)
フェノール fenol
フェノールフタレイン fenolftalein (indikator pH)
フェライト ferit
フェルト kain wol pres (felt)
フェルトバフ buff felt
フェード memudar
フェール gagal (fail)
フォトダイオード fotodioda
フォトマスク fotomask
フォルダー pelipat/folder
フューエラー pengisi bahan bakar (fueler)
フライス pahat frais/milling
フライト penerbangan
フラスコ labu
フラットヤーン benang pita datar
フラペロン flaperon (sirip sayap gabungan)
フリーマーケット pasar loak
フルスケール skala penuh
フレキシブル fleksibel
フレックスリジッド PCB fleksibel-kaku
フレミング Fleming (kaidah tangan Fleming)
フロー aliran
フロートスイッチ saklar pelampung
フローリングボード papan lantai
フード tudung/kap
ブザー bel/buzzer
ブラックライト lampu hitam (UV)
ブリッジ jembatan
ブリネル Brinell (kekerasan Brinell)
ブリード pendarahan/ meresap (bleed)
ブリーフィング pengarahan singkat (briefing)
ブレーク istirahat/putus
ブレード bilah
ブロックゲージ gauge blok
ブロムチモールブルー bromtimol biru (indikator)
ブロンズ perunggu
ブロー meniup (blow)
プラグゲージ gauge sumbat
プラスドライバ obeng plus (+)
プラズマ plasma
プラチナ platina
プラットフォーム peron/platform
プランジャ plunger (torak)
プリロード beban awal (preload)
プリンタ printer
プルーフ bukti/tahan (proof)
プレス pres (mesin tekan)
プレスボード papan pres
プログラマブルコントローラー PLC (pengendali terprogram)
プロセス proses
プロット memplot
プロトラクター busur derajat (protractor)
プロペラ baling-baling
プローブ probe (sensor uji)
ヘアライン hairline (goresan halus searah)
ヘッドカウント jumlah orang (head count)
ヘッドバーカ pengupas kulit kepala (head barker)
ヘッドライト lampu depan
ヘッドライトリフレクター reflektor lampu depan
ベアリング bantalan (bearing)
ベタベタ lengket
ベリリウム berilium
ベルトグラインダー gerinda sabuk
ベルトコンベヤー konveyor sabuk
ベンガラ bengara (besi oksida merah)
ベースメーク dasar (base)
ペレット pelet
ペンタイプ tipe pena
ホウキ sapu
ホットチャンバダイカスト die casting ruang panas
ホットプレス pres panas
ホテルリネン linen hotel
ホルマル formal (nama lain)
ホールソー gergaji lubang (hole saw)
ホールピペット pipet gondok
ボア diameter dalam (bore)
ボイラー ketel uap
ボタンスイッチ tombol sakelar
ボックス kotak
ボックスドライバ obeng kotak
ボディ bodi
ボディプレス pres bodi
ボンディング ikatan (bonding)
ボンベ tabung gas
ボーイング Boeing
ポリアミド poliamida (nilon)
ポリカーボネート polikarbonat
ポリプロピレン polipropilena
ポーラス berpori
マイカ mika
マイクロジーメンス mikrosiemens
マイクロスイッチ sakelar mikro
マイクロビッカース mikro-Vickers
マイボトル botol minum pribadi
マウス mouse
マグネシウム magnesium
マグネット magnet
マグネットスイッチ sakelar magnet
マザーボード papan induk
マシニング pemesinan
マシニングセンタ pusat pemesinan (machining center)
マシン mesin
マスキング penutupan (masking)
マスクフィルム film masker
マスターリングゲージ gauge acuan (mastering)
マネジメントシステム sistem manajemen
マンガン mangan
ミクロン mikron
ミラー cermin
ミリジーメンス milisiemens
ミリメートル milimeter
ミリングマシン mesin frais (milling)
ミールカート troli makanan
メカニズム mekanisme
メス betina; bagian betina (female)
メタル logam
メタルベース dasar logam
メチルオレンジ metil jingga (indikator)
メチルレッド metil merah (indikator)
メニスカス meniskus
メモリ memori
メーカー produsen
メーク membuat (make)
モバイル seluler (mobile)
モバイルバッテリー baterai portabel (power bank)
モリブデン molibdenum
モル mol
モータ motor
モールド cetakan (mold)
ヤスリ kikir
ユニポーラトランジスタ transistor unipolar
ヨット kapal layar
ヨーロッパ Eropa
ライター pemantik api
ラジオペンチ tang hidung panjang (radio pliers)
ラダー tangga/ rudder (kemudi pesawat)
ラダーシーケンス sekuens ladder (diagram tangga)
ラチェットストップ penghenti ratchet
ラミネート laminasi
ラム ram/domba
ランアウトテーブル meja keluar (run-out table)
ランダム acak
ランナーゲート runner dan gate (cetakan)
リアクトル reaktor (induktor)
リジッド kaku (rigid)
リジッドフレキ PCB kaku-fleksibel
リスト daftar
リチウム litium
リチウムイオン ion litium
リチウムイオンモバイルバッテリー power bank ion litium
リットル liter
リデュース mengurangi (reduce, 3R)
リトマス lakmus
リバーサー pembalik
リフター pengangkat
リミット batas
リミットスイッチ sakelar batas
リミットスイッチアクチュエーター aktuator sakelar batas
リユース memakai ulang (reuse, 3R)
リレー relai
リレーシーケンス sekuens relai
リン fosfor
リンギング ringing (getaran sinyal)
リングゲージ gauge cincin
リングバーカ pengupas kulit cincin (ring barker)
リード kabel/kaki komponen (lead)
リール gulungan (reel)
ルクス lux (satuan iluminasi)
ルビ furigana (ruby)
ルールブック buku peraturan
ループ simpul/lingkaran
レギュレータ regulator
レジスタ register
レジスト resist (lapisan tahan etsa)
レジストテープ pita resist
レセプタクル stopkontak/colokan (receptacle)
レゾルシノール resorsinol
レター huruf
レターサイズ ukuran letter
レドーム radome (kubah radar)
レバースイッチ sakelar tuas
レンチング wrenching (pengencangan dengan kunci)
レーダー radar
レート laju (rate)
レーヨン rayon
レーヨンバフ buff rayon
ロウ lilin/ pematrian keras (brazing)
ロゴ logo
ロサンゼルス Los Angeles
ロジスティックス logistik
ロジック logika
ロストバゲージ bagasi hilang
ロッキング pengunci (locking)
ロックウェル Rockwell (kekerasan Rockwell)
ロックタイプ tipe kunci
ロット lot (partai produksi)
ロットサイズ ukuran lot
ロボット robot
ロボットアーム lengan robot
ロボットバフ buff robot
ロンドン London
ローゼット rosette (soket plafon)
ローダー loader (pemuat)
ローレンツ Lorentz
ロータ rotor
ロール rol/gulungan
ロールアウト roll-out (keluar dari hangar)
ロールコート pelapisan rol
ロールスピード kecepatan rol
ロールボックスパレット roll box pallet
ワイヤストリッパ pengupas kabel
ワッシャ ring/ washer
ワット watt
ワットアワー watt-jam
ワレモノ barang pecah belah
ワーク benda kerja (work)
ワークテーブル meja kerja
ワークピース benda kerja (workpiece)
アンペール Ampère
""")
add("""
ギザギザ bergerigi
カチカチ keras/ bunyi klik
スポンジバフ buff spons
マイナスドライバ obeng minus (-)
ヤング Young (modulus Young)
""")
