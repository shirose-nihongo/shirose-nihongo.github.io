# -*- coding: utf-8 -*-
"""Konten Railway (車両製造) — diringkas Shirose dari
「鉄道分野（車両製造）特定技能1号評価試験 学習テキスト（初版）」(JARi 日本鉄道車輌工業会).
Hanya fakta yang tertulis di teks resmi (ssw-materials/railway/...). Ditandai perlu review ahli."""

BABS = [
 dict(no=1, id_="Keselamatan Kerja", jp="安全", pages=[9, 22],
  intro="UU keselamatan kerja, 5S, APD, alat pengaman, pemeriksaan alat, jalur jalan, dan tangga lipat.",
  subs=[
   ("UU Keselamatan & Kesehatan Kerja (労働安全衛生法)", "労働安全衛生法", [9, 10], [
     ("Tujuan", ["Tujuan **労働安全衛生法**: menjamin **keselamatan & kesehatan pekerja** dan menciptakan **lingkungan kerja yang nyaman**.",
        "Pekerja wajib mencegah **労働災害** (cedera/kematian saat bekerja) dan bekerja sama dengan program pengusaha."]),
     ("Lisensi / pelatihan keterampilan / pendidikan khusus", ["Pekerjaan berbahaya wajib punya **免許 (lisensi)**, **技能講習 (kursus keterampilan)** atau **特別教育 (pendidikan khusus)**.",
        "Contoh derek: beban angkat **< 5 t → 特別教育**; **≥ 5 t → 技能講習**; derek kabin operator (床上運転式) ≥ 5 t → **免許**.",
        "Forklift muatan maks **≥ 1 t → 技能講習**, **< 1 t → 特別教育**.玉掛け (sling) ≥ 1 t → 技能講習, < 1 t → 特別教育.",
        "**Las busur (アーク溶接)** → 特別教育; **las gas (ガス溶接)** → 技能講習. Ganti batu gerinda → 特別教育.",
        "**有機溶剤作業主任者** (pelarut organik > 5% di ruang dalam/tangki) → 技能講習."]),
   ]),
   ("Kesadaran keselamatan & 5S", "安全意識の徹底と5S活動", [11, 13], [
     ("5 penyebab kecelakaan", ["① APD/pakaian cacat; ② tindakan pengaman tidak dijalankan (kondisi tidak aman dibiarkan); ③ memakai mesin di luar fungsi / membersihkan-memeriksa mesin yang berjalan; ④ lingkungan/tempat kerja cacat; ⑤ kurang pengetahuan cara kerja."]),
     ("5S (5S活動)", ["**整理** (seiri) = buang barang tak perlu/cacat; **整頓** (seiton) = letak barang jelas & mudah diambil; **清掃** (seisou) = bersih-bersih; **清潔** (seiketsu) = menjaga 3S tetap terpelihara; **躾** (shitsuke) = disiplin/kebiasaan.",
        "Jangan taruh barang di dekat **hidran, APAR, pintu darurat, panel listrik, tandu**. Selang/kabel jangan dibentang di lantai jalur.",
        "Alat yang dipakai **dihitung (員数)** dan dikembalikan ke tempatnya; jangan meninggalkan alat/pengukur walau kerjaan lanjut besok.",
        "Debu mudah terbakar yang menumpuk = penyebab kebakaran; bahaya & barang berbahaya disimpan di wadah khusus."]),
   ]),
   ("Pakaian kerja & APD (保護具)", "服装と保護具", [13, 17], [
     ("Pakaian kerja", ["Pakai baju kerja bersih, ukuran pas, **lengan panjang**, kancing/risleting tidak terbuka, **sepatu pengaman (安全靴)**. Tujuan: tidak tersangkut/terjepit mesin."]),
     ("APD", ["**安全帽 (helm)**: wajib di area kerja; **tali dagu harus dikencangkan**.",
        "**安全靴**: lindungi ujung kaki dari benda jatuh. **耳栓**: area bising ≥ **90 dB** (zona Ⅲ).",
        "**Masker**: 防じん (debu), 防毒 (gas/pelarut organik), 送風. Debu las/gerinda lama → **じん肺 (pneumoconiosis)**; cat/lem berpelarut → pakai **防毒マスク** + ventilasi.",
        "**Sarung tangan**: kerja kabel → 軍手 (katun); las → **sarung kulit panjang**; kerja listrik hidup → **karet listrik**; kimia → tahan kimia. **Jangan pakai sarung tangan pada mesin berputar (bor) / kerja palu** (risiko terlilit).",
        "**Kacamata**: 防じん (gerinda) dan **遮光 (las)** — las busur memakai **topeng (面式)**, las gas **kacamata (眼鏡式)**.",
        "APD rusak → lapor atasan & ganti. Jangan pakai APD orang lain tanpa izin."]),
   ]),
   ("Alat pengaman, alat tangan, jalur, tangga lipat", "安全装置・工具・通路・脚立", [17, 22], [
     ("Alat pengaman (安全装置)", ["Melepas/memindah alat pengaman → **izin penanggung jawab**; saat dilepas untuk perbaikan beri tanda & **pasang kembali segera**.",
        "Alat pengaman rusak → **hentikan kerja & lapor**. Periksa **sebelum pakai**."]),
     ("Alat tangan (手工具)", ["Periksa sebelum pakai; yang rusak/bengkok → hentikan dan ganti. Pakai alat sesuai fungsi.",
        "**Dilarang**: palu/pahat kepala melebar atau retak; pisau tumpul; obeng ujung aus; **spanner disambung pipa**; spanner dipakai sebagai palu.",
        "Alat di tempat tinggi harus dicegah jatuh; jangan taruh di atas mesin/tangga/jalur; jangan simpan obeng di saku."]),
     ("Jalur jalan (通路)", ["Jangan bekerja / menaruh barang di jalur. Lap tumpahan air/oli segera. Jangan jalan dengan tangan di saku, jangan **berlari**, jangan ngobrol di tangga. Area terlarang (柵/tali) tidak boleh dimasuki sembarangan."]),
     ("Tangga lipat (脚立)", ["Kunci **開き止め金具** sebelum naik. Berdiri maks. pada anak tangga **ke-2 dari atas** (tipe ≤ 210 cm).",
        "**Dilarang**: naik/duduk di **天板 (papan atas)**, **mengangkangi**, mencondongkan badan keluar. Pindahkan tangga bila perlu."]),
   ]),
  ]),
 dict(no=2, id_="Pengetahuan Umum Kereta", jp="鉄道一般", pages=[23, 46],
  intro="Batas kendaraan/bangunan, struktur badan kereta, bogie, rel & listrik, sistem penggerak, rem, dan peralatan penumpang.",
  subs=[
   ("Batas kendaraan & struktur badan kereta", "車両限界・建築限界・車体", [23, 26], [
     ("車両限界 dan 建築限界", ["**車両限界** = ruang yang tidak boleh dilampaui kereta. **建築限界** = batas dalam yang tidak boleh dimasuki bangunan apa pun, memberi ruang karena kereta bergoyang. Ruang di antara keduanya menjamin keselamatan jalan."]),
     ("Badan kereta (車体)", ["Terdiri dari 6 sisi: **台枠 (underframe)**, **側構体 (sisi)**, **妻構体 (ujung)**, **屋根構体 (atap)**.",
        "台枠: menopang lantai & beban; peralatan bawah lantai digantung; **連結装置** di kedua ujung. 側構体 menanggung sebagian besar **beban vertikal**. 屋根構体 memasang **AC & pantograf**.",
        "**キャンバー (camber)**: badan dibuat sedikit melengkung ke atas agar saat penumpang naik tidak melorot ke bawah melampaui batas kendaraan."]),
   ]),
   ("Bogie (台車)", "台車の構造", [26, 30], [
     ("Komponen bogie", ["Bogie = **台車枠, 車体支持装置, 輪軸, 軸箱支持装置, 駆動装置, 基礎ブレーキ装置**. Dengan penggerak = **動台車**; tanpa = **付随台車**.",
        "**車輪**: bagian kontak rel = **踏面**; **フランジ** di sisi dalam mencegah anjlok. **輪軸** = poros dengan roda yang ditekan masuk.",
        "**軸ばね**: peredam getaran dari rel (umum pegas koil/karet). **軸受**: menopang poros berputar, kurangi hambatan gulir (bantalan rol).",
        "**まくらばね**: antara bogie & badan kereta; kini umumnya **空気ばね (air spring)**.",
        "**駆動装置**: meneruskan tenaga motor ke roda lewat roda gigi besar-kecil (reduksi). **けん引装置**: meneruskan gaya depan-belakang (traksi/rem).",
        "**基礎ブレーキ装置**: menyalurkan gaya silinder rem ke roda — tipe **踏面ブレーキ**, **ディスクブレーキ**, kini banyak **ユニットブレーキ**."]),
   ]),
   ("Rel, elektrifikasi, jenis kereta", "線路と電化方式・車両の分類", [31, 35], [
     ("Rel", ["**軌間** (lebar rel) = jarak terpendek antara kepala rel. Di Jepang 4 jenis: **762, 1.067, 1.372, 1.435 mm**. **1.435 mm = standar (標準軌)**; Shinkansen & beberapa swasta. **1.067 mm (狭軌)** = jalur konvensional JR & mayoritas swasta (paling banyak).",
        "**カント**: rel luar dibuat lebih tinggi di tikungan untuk melawan gaya sentrifugal & kenyamanan."]),
     ("Elektrifikasi", ["Tegangan kawat standar: **DC 1.500 V / 750 V / 600 V**; **AC 1 fasa 20.000 V** (50/60 Hz); Shinkansen **AC 25.000 V**.",
        "Gardu **DC** untuk jalur DC, gardu **AC** untuk jalur AC."]),
   ]),
   ("Peralatan penggerak & kontrol", "装置の用途と仕組み", [35, 42], [
     ("Pengumpul arus (集電装置)", ["**パンタグラフ** (di atap, menyentuh kawat); bentuk umum **菱形**; kini **シングルアーム式** (lebih rendah, ringan, hemat ruang, kurangi bising/salju). **集電靴 (collector shoe)** di bogie mengambil daya dari **第三軌条 (rel ketiga)** — dipakai subway karena terowongan lebih kecil."]),
     ("Kontrol (制御装置)", ["**主回路** = sirkuit tegangan tinggi untuk motor penggerak. **抵抗制御**: tegangan diatur lewat **tahanan** seri (jaman dulu). **VVVFインバーター制御**: atur **tegangan & frekuensi** motor AC → hemat energi.",
        "VVVF = **Variable Voltage Variable Frequency**. Inverter = ubah DC menjadi AC."]),
     ("Motor (主電動機)", ["**直流電動機**: memakai **ブラシ & 整流子** (aus, perlu perawatan). **交流電動機** (かご型誘導 IM, 永久磁石同期 PMSM): **tanpa sikat** → bebas perawatan; dikendalikan inverter (semikonduktor GTO/IGBT)."]),
     ("Catu daya bantu (補助電源装置)", ["Menyuplai **補機** (AC, lampu, kompresor) & sirkuit kontrol. Jenis: **電動発電機 (MG)** (tua, efisiensi rendah) & **静止型インバーター (SIV)** (konstan tegangan/frekuensi). Kebutuhan: AC/pemanas 3 fasa 440 V, lampu AC100 V, kontrol DC100 V."]),
   ]),
   ("Rem & peralatan penumpang", "ブレーキ・放送・非常通報", [42, 46], [
     ("Rem udara", ["Dasar rem kereta = **空気ブレーキ**. Tiga sistem: **直通 (straight)**, **自動 (automatic)**, **電気指令式**.",
        "**直通**: sederhana, rem halus bertahap, tapi kalau pipa putus (gerbong terpisah) rem tidak bekerja → dipadukan dengan rem otomatis (fail-safe).",
        "**自動**: pipa rem diturunkan tekanannya → rem bekerja; kalau terpisah/pipa pecah, tekanan turun cepat → **rem otomatis bekerja**.",
        "**電気指令式**: perintah listrik dari kab; **7 tahap**; hanya 1 pipa udara (元空気タンク管); rangkaian selalu bertekanan; bila listrik hilang → **rem darurat**."]),
     ("Pengumuman & tombol darurat", ["Pengumuman otomatis + penyesuaian volume mengikuti bising. **非常通報装置**: tekan tombol → **buzzer di kabin masinis**; **lampu samping (車側灯) menyala oranye**; masinis berhenti segera (hindari terowongan/jembatan); kini ada interkom."]),
   ]),
  ]),
 dict(no=3, id_="Material Umum", jp="材料一般", pages=[47, 57],
  intro="Logam badan kereta, sifat mekanik, uji tarik, dan perlakuan panas.",
  subs=[
   ("Logam untuk badan kereta", "車体に使用する金属材料", [47, 51], [
     ("Baja biasa & kode", ["**普通鋼**: mudah dipotong/ditekuk/dilas, tapi **berkarat** (perlu pelat tebal, ada batas pengurangan bobot).",
        "**SS400** = baja struktur umum, kuat tarik min. **400 N/mm²**; **SM490** = baja las, min. 490 N/mm². **SPA-H / SPA-C** = baja tahan cuaca. **S45C** = baja karbon struktur mesin, karbon **0,42–0,48%**."]),
     ("Stainless", ["Tahan karat tinggi & kuat, **lebih sulit diproses**; badan lebih ringan; sambungan sering **las titik**, kini juga **las laser**. Utama: **SUS301L** (low-C). **SUS430** = feritik murah.",
        "Stainless **bukan tidak berkarat**, hanya *sulit berkarat*; garam di pantai & **もらいさび** (karat tertempel dari partikel besi) bisa memicu karat."]),
     ("Paduan aluminium", ["Awal: **シングルスキン**; kemudian **ダブルスキン** (profil ekstrusi dua lapis, biaya turun). Seri **A7N01/A6N01**. Dilas dengan **摩擦撹拌接合 (FSW)**. Dipakai Shinkansen & kereta cepat; komuter memakai stainless atau aluminium."]),
   ]),
   ("Sifat mekanik & uji tarik", "金属材料の機械的性質", [51, 54], [
     ("Sifat mekanik", ["**硬さ** (kekerasan): sukar berubah bentuk/tergores; **強度**: beban maks. yang tertahan (引っ張り強さ, 降伏点); **靭性** (ketangguhan): tahan **impak**; **延性**: mudah memanjang; kebalikan getas = **脆性** (contoh besi tuang).",
        "Kekerasan dan kekuatan berkorelasi tinggi."]),
     ("Uji tarik", ["**引っ張り強さ** = tegangan maksimum; **降伏点** = batas deformasi elastis → plastis; **弾性変形** kembali ke bentuk semula saat beban dilepas, **塑性変形** tidak kembali; **耐力** dipakai bila titik luluh tidak jelas."]),
   ]),
   ("Perlakuan panas (熱処理)", "金属材料の熱処理と効果", [54, 57], [
     ("4 perlakuan", ["**焼なまし (HA)**: panaskan lalu **dinginkan perlahan di tungku** → lunak, mudah dimesin, hilangkan tegangan dalam (rangka bogie yang dilas).",
        "**焼ならし (HNR)**: **dinginkan di udara** → struktur seragam, halus.",
        "**焼入れ (HQ)**: dinginkan **cepat (air/oli)** → keras tapi getas (martensit).",
        "**焼戻し (HT)**: panaskan ulang setelah焼入れ (~420 ℃) → keras berkurang, **keuletan naik**. Panas awal 800–850 ℃ membentuk **austenit**.",
        "Semakin tinggi kadar karbon, semakin keras setelah焼入れ. **SS400** tak punya aturan kadar karbon → umumnya tidak dikeraskan."]),
   ]),
  ]),
 dict(no=4, id_="Mesin & Alat Kerja", jp="機械および器工具", pages=[58, 160],
  intro="Manajemen alat, kalibrasi, alat tangan/listrik, mesin perkakas, dan alat ukur (ringkasan dari bab terpanjang buku).",
  subs=[
   ("Manajemen alat & kalibrasi", "工具の管理と校正", [58, 61], [
     ("Manajemen alat", ["**姿置き (形跡管理)** = metode merapikan alat dengan bentuk/siluet tempat penyimpanan sehingga hilangnya alat langsung terlihat."]),
     ("Kalibrasi (校正)", ["**校正** = memastikan alat ukur membaca dengan benar; jika perlu disesuaikan/diperbaiki. Interval kalibrasi berkala **sekitar 6 bulan – 1 tahun**; juga saat alat menua, hasil ukur janggal, atau lingkungan berubah.",
        "Alat yang perlu kalibrasi: **トルクレンチ, 圧着工具, alat ukur panjang (mikrometer dll.)**."]),
   ]),
   ("Alat tangan & alat listrik", "器工具・電動工具", [61, 106], [
     ("Alat tangan", ["Daftar alat bab ini: obeng, spanner, kunci inggris, **トルクレンチ**, alat press terminal, tang, **ニッパ**, **ワイヤーストリッパー**, ragum, kunci pipa, **ハンドリベッター**, kunci soket, palu, penggunting baut, kikir.",
        "**トルクレンチ**: mengukur/menetapkan torsi pengencangan. Tipe **プリセット式** (atur nilai lebih dulu) — **直読式** (baca skala) & **シグナル式** (bunyi/getar 'klik')."]),
     ("Alat listrik/udara", ["**ドリルドライバー, インパクトレンチ, 電動グラインダー, エアーリベッター**. Pengencangan baut: **インパクトレンチ dulu (2–3 putaran, longgar) → lalu torsi dengan トルクレンチ**."]),
   ]),
   ("Mesin perkakas & alat ukur", "工作機械と測定工具", [107, 160], [
     ("Mesin perkakas", ["**旋盤 (bubut)**: benda kerja **berputar**, pahat (バイト) diam. **フライス盤 (frais)**: **pahat berputar**, benda kerja dipasang tetap. Juga **ボール盤 (bor), プレス機械, マシニングセンター, 研削盤 (gerinda)**.",
        "Komponen bubut biasa: **主軸台, 心押台, 往復台, 刃物台, ベッド, チャック**. **NC旋盤** = kontrol numerik (program); **普通旋盤** = manual.",
        "Kecepatan putar spindel dinyatakan **RPM**."]),
     ("Alat ukur", ["Alat ukur dalam buku: **ノギス (jangka sorong), マイクロメーター, テスター**."]),
   ]),
  ]),
 dict(no=5, id_="Manajemen Mutu", jp="品質管理（試験・検査）", pages=[161, 180],
  intro="QC/QA, prosedur kerja, kerja standar, pemeriksaan akhir, ceklis, double check, torsi baut, penguncian terminal, uji kontinuitas.",
  subs=[
   ("QC, prosedur & kerja standar", "品質管理・作業手順書・標準作業", [161, 165], [
     ("QC dan QA", ["**品質管理 (QC)**: menjaga mutu pada level tertentu, mencegah cacat — fokus pada **proses produksi & produk**. **品質保証 (QA)**: memastikan produk memenuhi **harapan pelanggan**.",
        "3 pengelolaan QC: **工程管理** (proses), **品質検証** (inspeksi/standar), **品質改善** (kurangi penyebab cacat — mesin rusak, material buruk, human error)."]),
     ("作業手順書", ["Cara kerja optimal = hilangkan **むり・むだ・むら**, mutu konsisten siapa pun yang kerja, dan **aman**.",
        "Syarat manual kerja yang baik: memenuhi standar teknis; tidak bertentangan hukum/aturan; memuat **pelajaran kecelakaan lalu**; **mudah dipahami** semua pekerja; bisa dilaksanakan; **poin penting ditonjolkan**; selalu bisa dilihat & **diperbarui**. Pekerja tidak boleh mengubah prosedur sendiri."]),
     ("標準作業 dan 作業標準", ["**標準作業** = langkah/cara kerja konkret; **作業標準** = aturan/kriteria kerjanya. Efek: mutu stabil, produktivitas naik, **keselamatan naik** (dengan 5S)."]),
   ]),
   ("Pengecekan akhir (後確認)", "後確認・自主検査・チェックシート・ダブルチェック", [165, 172], [
     ("後確認 & 自主検査", ["**出荷前検査** dilakukan bagian QC. **工程内検査** & **後確認 / 自主検査** = pekerja memeriksa sendiri sambil bekerja agar **cacat tidak mengalir ke proses berikutnya**."]),
     ("チェックシート", ["Dua jenis: **記録用** (catat hasil ukur/inspeksi) dan **点検・確認用** (pastikan semua langkah dikerjakan). Isi **di tempat, per pekerjaan, dengan melihat barang aslinya (現地・現物)** — dilarang mengisi sekaligus setelah kembali ke kantor."]),
     ("ダブルチェック", ["Pemeriksaan ulang oleh **orang lain**. Cara 2 orang: **連続チェック**, **同時双方向チェック**. Cara 1 orang: **一人連続**, **一人時間差**, **一人双方向** (urutan dibalik)."]),
   ]),
   ("Baut, terminal, kontinuitas", "ボルト・端子・導通", [174, 180], [
     ("Torsi baut (トルク管理)", ["Torsi satuan **N・m**. **トルク法** dikontrol dengan トルクレンチ. Metode inspeksi: **増し締め法, 戻しトルク法, マーキング法**. Tipe シグナル式: **sekali 'klik' = torsi tercapai**; klik berulang → **kelebihan torsi**."]),
     ("合いマーク", ["Garis tunggal dari **kepala baut ke bahan dasar** agar kekencangan terlihat. **Tanpa tanda = baru pra-kencang**; garis **menyambung = sudah kencang**; garis **bergeser = longgar**. Tanda dibuat setelah torsi dicek; buat ulang bila baut diganti."]),
     ("Kabel & terminal", ["**結線** = menyambung kabel agar arus mengalir. Masalah: sekrup terminal kurang kencang (kontak buruk, panas), **inti kabel tergores/patah**, **crimp tidak sempurna** (cegah dengan uji tarik). Uji kontinuitas & isolasi dilakukan **≥ 2 orang**."]),
     ("導通検査", ["Memeriksa sambungan, memastikan **tidak ada putus (断線) / korsleting (短絡)**. Alat: **導通チェッカー / tester** (fungsi bunyi); sentuh probe pada kedua ujung — **buzzer berbunyi = tersambung**."]),
   ]),
  ]),
 dict(no=6, id_="Membaca Gambar", jp="読図（製図）", pages=[181, 206],
  intro="Gambar teknik, proyeksi sudut ketiga, simbol dimensi & las, gambar listrik, kabel, dan penanda.",
  subs=[
   ("Gambar mesin (機械製図)", "機械製図", [181, 193], [
     ("Jenis garis", ["**太い実線** = garis bentuk (外形線); **細い実線** = garis dimensi/pembantu; **破線 (隠れ線)** = bagian tak terlihat; **一点鎖線** = garis tengah (中心線)."]),
     ("三角法 (proyeksi sudut ketiga)", ["Bentuk benda digambarkan dari beberapa arah. Dimensi diberi simbol: **φ** = diameter, **t** = tebal, **L** = panjang."]),
     ("Simbol las (溶接記号)", ["Standar **JIS**. Garis acuan (基準線): **di bawah = sisi dekat (手前)**, **di atas = sisi seberang**. Contoh: **すみ肉溶接**."]),
   ]),
   ("Gambar listrik (電気製図)", "電気製図", [194, 206], [
     ("Diagram sirkuit", ["Jenis: **実体配線図** (posisi nyata), **展開接続図 (ツナギ図)**. Label/simbol sama = **tersambung secara listrik**; titik sambung ada **dot**; garis menyilang tanpa dot = **tidak tersambung**.",
        "**Hukum Ohm**: V = I × R (tegangan = arus × hambatan)."]),
     ("Kabel & penanda", ["Kabel kereta: kabel berisolasi vinil/polietilen silang (架橋ポリエチレン) — kapasitas arus lebih besar. **リングマーク (ブーツマーク)** = penanda nomor kawat di **kedua ujung** kabel."]),
   ]),
  ]),
 dict(no=7, id_="Hal yang Diperlukan dalam Pekerjaan", jp="作業における必要事項", pages=[207, 221],
  intro="Baut & sekrup, urutan mengencangkan, pengelasan, perpipaan, dan penyegelan (sealing).",
  subs=[
   ("Baut & ulir", "ボルトとねじ", [207, 209], [
     ("Jenis & aturan", ["**おねじ** = ulir luar; **めねじ** = ulir dalam. **ボルト** besar, **小ねじ** kecil. Jenis: **六角ボルト, 六角穴付きボルト, なべ小ねじ, 皿小ねじ, タッピングねじ, ローレットねじ**.",
        "Mur dipasang di **sisi seberang kepala baut**; permukaan datar (tanpa chamfer) menghadap bidang kontak. Bila perlu pakai **平座金 / ばね座金**.",
        "Urutan: **diagonal (対角)**, bertahap **仮締め → 本締め → 追い締め**, bukan langsung penuh (benda miring)."]),
   ]),
   ("Pengelasan (溶接)", "溶接", [210, 213], [
     ("Metode", ["3 kelompok: **融接** (paling umum), **圧接**, **ろう接**. Las busur: **被覆アーク (手溶接)**, **TIG** (elektroda tungsten + gas inert, presisi), **MIG** (kawat + gas inert; aluminium/non-besi), **MAG** (gas aktif/CO₂; besi). Juga **レーザー溶接** dan **ガス溶接** (panas rendah, tak cocok pelat tebal). **抵抗溶接** (las titik, seam), **摩擦圧接**."]),
     ("Cacat las", ["Kategori: cacat **permukaan, dalam, dimensi**.",
        "**アンダーカット**: alur di tepi (kecepatan terlalu cepat / arus terlalu besar). **オーバーラップ**: logam las menumpuk tanpa menyatu (terlalu lambat).",
        "**ピンホール / ブローホール**: lubang/gas terperangkap (gas pelindung kurang, karat/air). **溶け込み不良**: arus rendah / terlalu cepat. **スラグ巻き込み**: terak tak dibersihkan. **融合不良**: arus rendah."]),
   ]),
   ("Perpipaan & sealing", "配管作業・接着シール作業", [214, 221], [
     ("Perpipaan", ["Jenis: **VP, CP, SGP** (pipa baja karbon). Ukuran inci: **10G = 3/8 (3分)**, **15G = 1/2 (4分)**, **20G = 3/4 (6分)**, **25G = 1 inci**.",
        "Alur: persiapan → **bersihkan dengan udara (気吹き)** → pasang. **Jangan sampai ada serpihan/debu/air**; beri sealant ulir; **jangan menaruh pipa langsung di lantai**; bila ukuran tak sesuai gambar lapor atasan."]),
     ("Sealing", ["**Fungsi**: kedap air/udara di sambungan pelat, bingkai jendela, tutup inspeksi. Syarat: tidak tembus air, melekat baik, **mengikuti gerak sambungan**, awet, tidak mengotori.",
        "Bahan utama kereta: **silikon, silikon modifikasi, poliuretan**. Pakai **primer** merata sebelum sealant. Suhu minimal kerja sekitar **+5 ℃**; di bawah 5 ℃ pertimbangkan menghentikan pekerjaan.",
        "**Jangan dekatkan alkohol**; hindari cat air/alkid (risiko **マイグレーション**). Safety: ventilasi, **dilarang api**, masker gas, **harness bila kerja ≥ 2 m**."]),
   ]),
  ]),
]

# (kata, kana, arti, bab, cat)
V = """労働安全衛生法|ろうどうあんぜんえいせいほう|UU Keselamatan & Kesehatan Kerja|1
労働災害|ろうどうさいがい|kecelakaan kerja|1
免許|めんきょ|lisensi|1
技能講習|ぎのうこうしゅう|kursus keterampilan|1
特別教育|とくべつきょういく|pendidikan khusus|1
玉掛け|たまがけ|pemasangan sling (rigging)|1
整理|せいり|seiri: memilah & membuang yang tak perlu|1
整頓|せいとん|seiton: menata (mudah diambil)|1
清掃|せいそう|membersihkan|1
清潔|せいけつ|menjaga kebersihan (3S tetap)|1
躾|しつけ|disiplin|1
保護具|ほごぐ|alat pelindung diri (APD)|1
安全帽|あんぜんぼう|helm pengaman|1
安全靴|あんぜんぐつ|sepatu pengaman|1
防じんマスク|ぼうじんますく|masker debu|1
防毒マスク|ぼうどくますく|masker gas|1
耳栓|みみせん|penyumbat telinga|1
軍手|ぐんて|sarung tangan katun|1
保護めがね|ほごめがね|kacamata pelindung|1
遮光|しゃこう|penahan cahaya (kacamata las)|1
安全装置|あんぜんそうち|alat pengaman|1
手工具|てこうぐ|alat tangan|1
通路|つうろ|jalur jalan|1
脚立|きゃたつ|tangga lipat|1
天板|てんいた|papan atas tangga lipat|1
有機溶剤|ゆうきようざい|pelarut organik|1
車両限界|しゃりょうげんかい|batas kendaraan|2
建築限界|けんちくげんかい|batas bangunan|2
台枠|だいわく|rangka bawah (underframe)|2
側構体|がわこうたい|struktur sisi badan kereta|2
妻構体|つまこうたい|struktur ujung badan kereta|2
屋根構体|やねこうたい|struktur atap|2
台車|だいしゃ|bogie|2
輪軸|りんじく|wheelset (poros+roda)|2
車輪|しゃりん|roda kereta|2
踏面|ふみつら|permukaan roda yang menyentuh rel|2
軸ばね|じくばね|pegas poros|2
軸受|じくうけ|bantalan poros|2
空気ばね|くうきばね|pegas udara|2
駆動装置|くどうそうち|alat penggerak|2
基礎ブレーキ装置|きそぶれーきそうち|perangkat rem dasar|2
軌間|きかん|lebar rel (gauge)|2
標準軌|ひょうじゅんき|rel standar 1.435 mm|2
狭軌|きょうき|rel sempit 1.067 mm|2
カント|かんと|superelevasi rel tikungan|2
電化方式|でんかほうしき|sistem elektrifikasi|2
架線|かせん|kawat listrik atas|2
パンタグラフ|ぱんたぐらふ|pantograf|2
第三軌条|だいさんきじょう|rel ketiga|2
集電靴|しゅうでんぐつ|collector shoe|2
主電動機|しゅでんどうき|motor traksi|2
抵抗制御|ていこうせいぎょ|kontrol tahanan|2
補助電源装置|ほじょでんげんそうち|catu daya bantu|2
空気ブレーキ|くうきぶれーき|rem udara|2
非常通報装置|ひじょうつうほうそうち|alat laporan darurat|2
金属材料|きんぞくざいりょう|material logam|3
普通鋼|ふつうこう|baja biasa|3
ステンレス鋼|すてんれすこう|baja tahan karat|3
アルミ合金|あるみごうきん|paduan aluminium|3
引っ張り強さ|ひっぱりつよさ|kuat tarik|3
降伏点|こうふくてん|titik luluh|3
弾性変形|だんせいへんけい|deformasi elastis|3
塑性変形|そせいへんけい|deformasi plastis|3
硬さ|かたさ|kekerasan|3
強度|きょうど|kekuatan|3
靭性|じんせい|ketangguhan (tahan impak)|3
延性|えんせい|keuletan (daktilitas)|3
脆性|ぜいせい|kegetasan|3
焼なまし|やきなまし|anil (annealing)|3
焼ならし|やきならし|normalisasi|3
焼入れ|やきいれ|pengerasan (quenching)|3
焼戻し|やきもどし|temper|3
熱処理|ねつしょり|perlakuan panas|3
工具管理|こうぐかんり|manajemen alat|4
姿置き|すがたおき|penataan alat dengan siluet|4
校正|こうせい|kalibrasi|4
トルクレンチ|とるくれんち|kunci torsi|4
圧着工具|あっちゃくこうぐ|alat press (crimp) terminal|4
インパクトレンチ|いんぱくとれんち|kunci impak|4
旋盤|せんばん|mesin bubut|4
フライス盤|ふらいすばん|mesin frais|4
ボール盤|ぼーるばん|mesin bor|4
研削盤|けんさくばん|mesin gerinda|4
ノギス|のぎす|jangka sorong|4
マイクロメーター|まいくろめーたー|mikrometer|4
テスター|てすたー|tester (multimeter)|4
品質管理|ひんしつかんり|manajemen mutu (QC)|5
品質保証|ひんしつほしょう|jaminan mutu (QA)|5
工程管理|こうていかんり|manajemen proses|5
作業手順書|さぎょうてじゅんしょ|manual prosedur kerja|5
標準作業|ひょうじゅんさぎょう|kerja standar|5
後確認|あとかくにん|pengecekan setelah kerja|5
自主検査|じしゅけんさ|inspeksi mandiri|5
チェックシート|ちぇっくしーと|lembar ceklis|5
ダブルチェック|だぶるちぇっく|pemeriksaan ganda|5
合いマーク|あいまーく|tanda pencocokan baut|5
結線|けっせん|penyambungan kabel|5
導通検査|どうつうけんさ|uji kontinuitas|5
断線|だんせん|kabel putus|5
短絡|たんらく|korsleting|5
機械製図|きかいせいず|gambar mesin|6
外形線|がいけいせん|garis bentuk|6
中心線|ちゅうしんせん|garis tengah|6
破線|はせん|garis putus-putus (tak terlihat)|6
三角法|さんかくほう|proyeksi sudut ketiga|6
溶接記号|ようせつきごう|simbol las|6
基準線|きじゅんせん|garis acuan simbol las|6
電気回路図|でんきかいろず|diagram sirkuit listrik|6
リングマーク|りんぐまーく|penanda nomor kawat|6
オームの法則|おーむのほうそく|hukum Ohm|6
おねじ|おねじ|ulir luar|7
めねじ|めねじ|ulir dalam|7
六角ボルト|ろっかくぼると|baut kepala segi enam|7
座金|ざがね|ring/washer|7
仮締め|かりじめ|pra-kencang|7
本締め|ほんじめ|kencang penuh|7
対角|たいかく|diagonal|7
融接|ゆうせつ|las lebur|7
被覆アーク溶接|ひふくあーくようせつ|las busur berselaput (las tangan)|7
アンダーカット|あんだーかっと|undercut (cacat las)|7
ブローホール|ぶろーほーる|blowhole (rongga gas)|7
配管|はいかん|perpipaan|7
気吹き|きぶき|membersihkan dengan hembusan udara|7
シール材|しーるざい|bahan sealant|7
プライマー|ぷらいまー|primer|7
""".strip().split("\n")
