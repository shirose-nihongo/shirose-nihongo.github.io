// Sumber bank soal MENSETSU "履歴書 (CV)". Teks Jepang ditulis dengan furigana kanji[baca]; versi polos diturunkan otomatis.
// Persona contoh jawaban: fiktif ("リナ", 22 tahun, Bandung) — tidak memakai data siswa sungguhan.
const KAT = [
  { k: "jiko", jp: "自己紹介・基本情報", id: "Perkenalan & data diri" },
  { k: "karada", jp: "体のサイズ", id: "Data fisik & ukuran" },
  { k: "kazoku", jp: "家族構成", id: "Susunan keluarga" },
  { k: "gakureki", jp: "学歴", id: "Riwayat pendidikan" },
  { k: "shokureki", jp: "職歴", id: "Pengalaman kerja" },
  { k: "chosho", jp: "長所・短所", id: "Kelebihan & kekurangan" },
  { k: "shumi", jp: "趣味・特技・興味", id: "Hobi, keahlian & minat" },
  { k: "nihongo", jp: "日本語・資格", id: "Bahasa Jepang & sertifikat" },
  { k: "kenkou", jp: "健康・生活", id: "Kesehatan & kebiasaan" },
  { k: "shourai", jp: "将来・お金", id: "Rencana & keuangan" },
  { k: "appeal", jp: "自己PR・アピール", id: "Self-PR / appeal" },
  { k: "saigo", jp: "最後の質問", id: "Pertanyaan penutup" },
];
const Q = [];
const q = (k, l, jf, id, v, m, ajf, ai, c, f = []) => Q.push({ k, l, jf, id, v, m, ajf, ai, c, f });

/* ---------------- 自己紹介・基本情報 ---------------- */
q("jiko", 1, "自己紹介[じこしょうかい]をお願[ねが]いします。", "Tolong perkenalkan diri Anda.",
  [["自己紹介", "perkenalan diri"], ["〜と申します", "nama saya (sopan)"], ["出身", "asal"]],
  "Pembukaan wawancara. Pewawancara mencocokkan perkenalanmu dengan data di CV (nama, umur, asal).",
  "はじめまして。リナと申[もう]します。二十二歳[にじゅうにさい]です。インドネシアの西[にし]ジャワ州[しゅう]、バンドンから来[き]ました。今[いま]、LPKでビルクリーニングと日本語[にほんご]を勉強[べんきょう]しています。どうぞよろしくお願[ねが]いいたします。",
  "Perkenalkan, nama saya Rina. Usia saya 22 tahun. Saya dari Bandung, Jawa Barat, Indonesia. Sekarang saya belajar building cleaning dan bahasa Jepang di LPK. Mohon bantuannya.",
  "Isi harus SAMA dengan CV: nama, umur, asal. Singkat (30–45 detik), suara jelas, senyum, lalu tutup dengan よろしくお願いいたします。",
  [["呼[よ]び名[な]は何[なん]ですか。", "Nama panggilan Anda apa?"], ["今[いま]、どこに住[す]んでいますか。", "Sekarang tinggal di mana?"]]);
q("jiko", 1, "お名前[なまえ]と、呼[よ]び名[な]を教[おし]えてください。", "Sebutkan nama lengkap dan nama panggilan Anda.",
  [["お名前", "nama (hormat)"], ["呼び名", "nama panggilan"], ["〜と呼んでください", "tolong panggil saya …"]],
  "Di CV ada kolom 呼び名. Orang Jepang sulit mengucapkan nama panjang, jadi mereka ingin tahu harus memanggilmu apa.",
  "名前[なまえ]はリナ・プスピタサリです。呼[よ]び名[な]はリナです。「リナ」と呼[よ]んでください。",
  "Nama saya Rina Puspitasari. Nama panggilan saya Rina. Tolong panggil saya \"Rina\".",
  "Sebut nama lengkap pelan-pelan, lalu nama panggilan yang pendek dan mudah diucapkan orang Jepang.");
q("jiko", 1, "生年月日[せいねんがっぴ]と年齢[ねんれい]を教[おし]えてください。", "Sebutkan tanggal lahir dan usia Anda.",
  [["生年月日", "tanggal lahir"], ["年齢", "usia"], ["〜年〜月〜日に生まれました", "lahir tanggal …"]],
  "Mengecek kecocokan dengan CV dan kemampuan menyebut angka/tanggal dalam bahasa Jepang.",
  "2004年[ねん]3月[がつ]15日[にち]に生[う]まれました。今[いま]、二十二歳[にじゅうにさい]です。",
  "Saya lahir tanggal 15 Maret 2004. Sekarang usia saya 22 tahun.",
  "Latih cara baca tanggal: 一日・二日・三日・四日・八日・十日・二十日. Jangan salah urutan: tahun → bulan → tanggal.");
q("jiko", 1, "出身地[しゅっしんち]はどこですか。どんな所[ところ]ですか。", "Dari mana asal Anda? Tempat seperti apa itu?",
  [["出身地", "daerah asal"], ["〜州", "provinsi …"], ["有名", "terkenal"], ["涼しい", "sejuk"]],
  "Kolom 出身地 di CV. Pewawancara ingin obrolan ringan dan melihat apakah kamu bisa menjelaskan sesuatu dengan sederhana.",
  "出身[しゅっしん]は西[にし]ジャワ州[しゅう]のバンドンです。山[やま]が多[おお]くて、涼[すず]しい町[まち]です。食[た]べ物[もの]がおいしくて、お茶[ちゃ]の畑[はたけ]も有名[ゆうめい]です。",
  "Saya berasal dari Bandung, Jawa Barat. Kota yang banyak gunungnya dan sejuk. Makanannya enak, dan kebun tehnya juga terkenal.",
  "Sebut 1–2 ciri khas daerahmu (cuaca, makanan, wisata). Ini kesempatan menunjukkan kamu bisa bercerita dengan santai.",
  [["日本[にほん]と比[くら]べて、どこが違[ちが]いますか。", "Dibanding Jepang, apa bedanya?"]]);
q("jiko", 1, "今[いま]、どこに住[す]んでいますか。", "Sekarang Anda tinggal di mana?",
  [["現住所", "alamat sekarang"], ["寮", "asrama"], ["実家", "rumah orang tua"]],
  "Kolom 現住所. Banyak kandidat tinggal di asrama LPK — jelaskan dengan jujur.",
  "今[いま]は、LPKの寮[りょう]に住[す]んでいます。実家[じっか]はバンドンにあります。寮[りょう]では友達[ともだち]と一緒[いっしょ]に住[す]んでいて、毎朝[まいあさ]みんなで掃除[そうじ]をしています。",
  "Sekarang saya tinggal di asrama LPK. Rumah orang tua saya ada di Bandung. Di asrama saya tinggal bersama teman-teman, dan setiap pagi kami bersih-bersih bersama.",
  "Kalau tinggal di asrama, ceritakan sedikit kehidupan bersama — ini menunjukkan kamu terbiasa hidup berkelompok (penting untuk 社宅 di Jepang).");
q("jiko", 1, "結婚[けっこん]していますか。お子[こ]さんはいますか。", "Apakah Anda sudah menikah? Apakah punya anak?",
  [["結婚", "menikah"], ["独身", "lajang"], ["配偶者", "pasangan (suami/istri)"], ["子供", "anak"]],
  "Kolom 配偶者の有無 dan 子供. Perusahaan ingin tahu apakah ada keluarga yang ditinggal dan apakah kamu siap tinggal lama di Jepang.",
  "いいえ、結婚[けっこん]していません。独身[どくしん]です。子供[こども]もいません。",
  "Tidak, saya belum menikah. Saya lajang. Saya juga belum punya anak.",
  "Kalau sudah menikah/punya anak: sebutkan siapa yang mengurus anak selama kamu di Jepang dan bahwa keluarga mendukung. Contoh: 夫と子供が一人います。子供は母が世話をしてくれます。家族はみんな応援してくれています。",
  [["ご家族[かぞく]は、日本[にほん]で働[はたら]くことに賛成[さんせい]していますか。", "Apakah keluarga setuju Anda bekerja di Jepang?"]]);
q("karada", 2, "身長[しんちょう]と体重[たいじゅう]はどのくらいですか。", "Berapa tinggi dan berat badan Anda?",
  [["身長", "tinggi badan"], ["体重", "berat badan"], ["センチ", "cm"], ["キロ", "kg"]],
  "Ada di CV (untuk ukuran seragam & pekerjaan fisik). Mengecek kemampuan menyebut angka.",
  "身長[しんちょう]は百五十五[ひゃくごじゅうご]センチで、体重[たいじゅう]は四十九[よんじゅうきゅう]キロです。",
  "Tinggi badan saya 155 cm dan berat badan 49 kg.",
  "Jawab langsung dengan angka yang sama seperti di CV. Latih angka ratusan: 百五十・百六十.");
q("jiko", 2, "履歴書[りれきしょ]は自分[じぶん]で書[か]きましたか。", "Apakah CV ini Anda tulis sendiri?",
  [["履歴書", "CV / daftar riwayat hidup"], ["自分で", "sendiri"], ["先生に手伝ってもらう", "dibantu guru"]],
  "Pewawancara ingin tahu apakah kamu benar-benar memahami isi CV-mu. Jawablah jujur.",
  "はい、内容[ないよう]は自分[じぶん]で考[かんが]えて書[か]きました。日本語[にほんご]は先生[せんせい]に確認[かくにん]してもらいました。",
  "Ya, isinya saya pikirkan dan tulis sendiri. Bahasa Jepangnya saya minta dicek oleh guru.",
  "Jujur lebih baik. Yang penting: kamu bisa menjelaskan SEMUA isi CV-mu dengan kata-katamu sendiri. Baca ulang CV-mu sebelum wawancara!");

/* ---------------- 体のサイズ (data fisik: 体重・血液型・服・腰・靴) ---------------- */
q("karada", 1, "体重[たいじゅう]は何[なん]キロですか。", "Berat badan Anda berapa kilo?",
  [["体重", "berat badan"], ["キロ", "kilogram"], ["増える・減る", "naik・turun"], ["変わらない", "tidak berubah"]],
  "Kolom 体重 di CV. Pewawancara mencocokkan dengan CV dan kadang menanyakan apakah berat badanmu berubah (untuk kesehatan & seragam).",
  "四十九[よんじゅうきゅう]キロです。この一年[いちねん]は、あまり変[か]わっていません。",
  "49 kilo. Setahun terakhir tidak banyak berubah.",
  "Angka harus sama dengan CV. Kalau berubah, katakan: 前より三キロ増えました／減りました。Latih angka: 四十・七十・九.",
  [["何[なに]かスポーツをしていますか。", "Apakah Anda berolahraga?"]]);
q("karada", 1, "血液型[けつえきがた]は何型[なにがた]ですか。", "Golongan darah Anda apa?",
  [["血液型", "golongan darah"], ["A型", "golongan A (エーがた)"], ["B型", "golongan B (ビーがた)"], ["O型", "golongan O (オーがた)"], ["AB型", "golongan AB (エービーがた)"]],
  "Di Jepang golongan darah sering ditanyakan (untuk keadaan darurat, dan juga obrolan santai karena orang Jepang suka mengaitkannya dengan sifat).",
  "私[わたし]はO型[がた]です。",
  "Golongan darah saya O.",
  "Baca huruf dengan cara Jepang: A=エー, B=ビー, O=オー, AB=エービー + 型. Kalau belum tahu, cek dulu sebelum wawancara. Kalau terpaksa: まだ調べたことがありません。すぐに調べます。",
  [["O型[がた]の人[ひと]は、どんな性格[せいかく]だと言[い]われますか。", "Orang bergolongan darah O katanya berkepribadian seperti apa?"]]);
q("karada", 1, "服[ふく]のサイズは何[なん]ですか。", "Ukuran baju Anda apa?",
  [["服", "baju"], ["サイズ", "ukuran"], ["制服", "seragam"], ["作業着", "baju kerja"], ["S・M・L", "エス・エム・エル"]],
  "Kolom 服 di CV. Perusahaan menyiapkan seragam/baju kerja (作業着) sebelum kamu datang, jadi ukurannya harus tepat.",
  "Mサイズです。制服[せいふく]もMで大丈夫[だいじょうぶ]です。",
  "Ukuran M. Seragam juga ukuran M tidak masalah.",
  "Ukuran Jepang cenderung lebih kecil dari ukuran Indonesia — kalau ragu, sebutkan: Mですが、日本のサイズならLかもしれません。",
  [["ズボンのサイズは分[わ]かりますか。", "Tahu ukuran celana Anda?"]]);
q("karada", 2, "腰回[こしまわ]り（ウエスト）は何[なん]センチですか。", "Lingkar pinggang Anda berapa sentimeter?",
  [["腰回り", "lingkar pinggang"], ["ウエスト", "pinggang (waist)"], ["腰", "pinggang"], ["センチ", "sentimeter"], ["ズボン", "celana"]],
  "Kolom 腰 di CV. Dipakai untuk menyiapkan celana seragam/baju kerja.",
  "腰回[こしまわ]りは七十五[ななじゅうご]センチです。",
  "Lingkar pinggang saya 75 cm.",
  "Ukur dulu sebelum wawancara dan samakan dengan CV. Kalau tahu ukuran celana dalam inci: ウエストは三十インチです。 Ingat 七十 dibaca ななじゅう, bukan しちじゅう.",
  [["体重[たいじゅう]は変[か]わりましたか。", "Apakah berat badan Anda berubah?"]]);
q("karada", 1, "靴[くつ]のサイズは何[なん]センチですか。", "Ukuran sepatu Anda berapa sentimeter?",
  [["靴", "sepatu"], ["安全靴", "sepatu safety"], ["センチ", "sentimeter (ukuran sepatu Jepang)"], ["〜センチ半", "… setengah cm (mis. 23,5)"]],
  "Perusahaan menyiapkan sepatu kerja / sepatu safety (安全靴). Di Jepang ukuran sepatu memakai SENTIMETER, bukan nomor 37–43.",
  "二十三[にじゅうさん]センチ半[はん]です。インドネシアのサイズでは三十七[さんじゅうなな]です。",
  "Ukuran 23,5 cm. Kalau ukuran Indonesia, nomor 37.",
  "Hafalkan konversi kasar: 36=23, 37=23.5, 38=24, 39=24.5, 40=25, 41=25.5〜26, 42=26.5, 43=27 (センチ). 23.5 dibaca にじゅうさんセンチはん atau にじゅうさんてんご.",
  [["安全靴[あんぜんぐつ]を履[は]いたことがありますか。", "Pernah memakai sepatu safety?"]]);
q("karada", 2, "利[き]き手[て]はどちらですか。", "Tangan dominan Anda yang mana?",
  [["利き手", "tangan dominan"], ["右利き", "tidak kidal (kanan)"], ["左利き", "kidal"], ["両手", "kedua tangan"]],
  "Kadang ditanyakan untuk pekerjaan yang memakai alat/mesin. Jawaban singkat saja.",
  "右利[みぎき]きです。",
  "Saya tidak kidal (tangan kanan).",
  "Kalau kidal: 左利きですが、右手も使えます。 (Saya kidal, tapi bisa pakai tangan kanan juga.)");

/* ---------------- 家族構成 ---------------- */
q("kazoku", 1, "家族構成[かぞくこうせい]を教[おし]えてください。", "Tolong jelaskan susunan keluarga Anda.",
  [["家族構成", "susunan keluarga"], ["父・母", "ayah・ibu"], ["兄・姉", "kakak laki-laki・perempuan"], ["弟・妹", "adik laki-laki・perempuan"], ["〜人家族", "keluarga … orang"]],
  "Pertanyaan WAJIB dari kolom 家族構成. Pewawancara mencocokkan dengan CV dan menilai apakah kamu bisa memakai kata keluarga dengan benar.",
  "五人[ごにん]家族[かぞく]です。父[ちち]と母[はは]と妹[いもうと]が二人[ふたり]と私[わたし]です。父[ちち]は五十四歳[ごじゅうよんさい]で、農家[のうか]をしています。母[はは]は五十二歳[ごじゅうにさい]で、主婦[しゅふ]です。妹[いもうと]は十四歳[じゅうよんさい]と九歳[きゅうさい]で、学生[がくせい]です。",
  "Keluarga saya 5 orang: ayah, ibu, dua adik perempuan, dan saya. Ayah 54 tahun, petani. Ibu 52 tahun, ibu rumah tangga. Adik saya 14 dan 9 tahun, masih pelajar.",
  "Urutan: jumlah orang → siapa saja → umur & pekerjaan. Pakai 父・母・兄・姉・弟・妹 untuk keluarga SENDIRI (bukan お父さん). Umur harus sama dengan CV.",
  [["ご両親[りょうしん]は何[なん]の仕事[しごと]をしていますか。", "Orang tua Anda bekerja apa?"], ["兄弟[きょうだい]は何人[なんにん]いますか。", "Punya berapa saudara?"]]);
q("kazoku", 1, "ご両親[りょうしん]はどんな仕事[しごと]をしていますか。", "Orang tua Anda bekerja sebagai apa?",
  [["両親", "orang tua"], ["農家", "petani"], ["主婦", "ibu rumah tangga"], ["会社員", "karyawan"], ["自営業", "wiraswasta"], ["亡くなりました", "sudah meninggal"]],
  "Ingin mengenal latar belakang keluarga dan kondisi ekonomi.",
  "父[ちち]は農家[のうか]で、米[こめ]を作[つく]っています。母[はは]は主婦[しゅふ]ですが、家[いえ]で小[ちい]さい店[みせ]もしています。",
  "Ayah saya petani, menanam padi. Ibu saya ibu rumah tangga, tapi juga punya warung kecil di rumah.",
  "Kalau orang tua sudah meninggal, cukup katakan dengan tenang: 父は三年前に亡くなりました。今は母と兄が家族を支えています。",
  [["お父[とう]さんの仕事[しごと]を手伝[てつだ]ったことがありますか。", "Pernah membantu pekerjaan ayah?"]]);
q("kazoku", 1, "兄弟[きょうだい]は何人[なんにん]いますか。あなたは何番目[なんばんめ]ですか。", "Berapa saudara Anda? Anda anak ke berapa?",
  [["兄弟", "saudara kandung"], ["長女・長男", "anak pertama (perempuan・laki-laki)"], ["〜番目", "urutan ke-"], ["一人っ子", "anak tunggal"]],
  "Melihat posisimu di keluarga — anak sulung sering dianggap punya rasa tanggung jawab tinggi.",
  "妹[いもうと]が二人[ふたり]います。私[わたし]は長女[ちょうじょ]です。三人[さんにん]兄弟[きょうだい]の一番[いちばん]上[うえ]です。",
  "Saya punya dua adik perempuan. Saya anak perempuan pertama, yang paling tua dari tiga bersaudara.",
  "Anak pertama = 長男/長女, kedua = 次男/次女, bungsu = 末っ子, anak tunggal = 一人っ子.");
q("kazoku", 2, "ご家族[かぞく]は、あなたが日本[にほん]で働[はたら]くことについて、何[なん]と言[い]っていますか。", "Apa kata keluarga tentang Anda bekerja di Jepang?",
  [["賛成", "setuju"], ["応援する", "mendukung"], ["心配する", "khawatir"], ["許可", "izin"]],
  "Perusahaan khawatir kandidat pulang di tengah kontrak karena keluarga tidak setuju. Tunjukkan bahwa keluarga mendukung.",
  "家族[かぞく]はみんな賛成[さんせい]して、応援[おうえん]してくれています。最初[さいしょ]、母[はは]は少[すこ]し心配[しんぱい]していましたが、今[いま]は「がんばってね」と言[い]ってくれます。",
  "Keluarga semua setuju dan mendukung saya. Awalnya ibu sedikit khawatir, tapi sekarang beliau bilang \"semangat ya\".",
  "Jawaban kunci: 家族は賛成しています / 応援してくれています. Boleh jujur ada yang khawatir, tapi tunjukkan masalahnya sudah selesai.");
q("kazoku", 2, "家族[かぞく]と離[はな]れて、寂[さび]しくないですか。", "Apakah tidak akan kesepian berpisah dari keluarga?",
  [["離れる", "berpisah/jauh"], ["寂しい", "kesepian"], ["連絡する", "menghubungi"], ["ビデオ通話", "video call"]],
  "Menguji ketahanan mental: apakah kamu akan homesick lalu ingin pulang.",
  "少[すこ]し寂[さび]しいと思[おも]います。でも、休[やす]みの日[ひ]にビデオ通話[つうわ]で家族[かぞく]と話[はな]せます。家族[かぞく]のためにがんばりたいので、大丈夫[だいじょうぶ]です。",
  "Mungkin sedikit kesepian. Tapi di hari libur saya bisa video call dengan keluarga. Saya ingin berjuang demi keluarga, jadi tidak apa-apa.",
  "Jangan bilang 全然寂しくない (kurang natural). Akui sedikit, lalu tunjukkan caramu mengatasinya.",
  [["寂[さび]しい時[とき]、どうしますか。", "Kalau kesepian, apa yang Anda lakukan?"]]);
q("kazoku", 2, "家族[かぞく]の中[なか]で、誰[だれ]を一番[いちばん]尊敬[そんけい]していますか。", "Siapa anggota keluarga yang paling Anda hormati?",
  [["尊敬する", "menghormati/mengagumi"], ["一生懸命", "sungguh-sungguh"], ["〜から", "karena …"]],
  "Melihat nilai-nilai pribadimu dan kemampuan memberi alasan.",
  "父[ちち]を一番[いちばん]尊敬[そんけい]しています。毎日[まいにち]朝[あさ]早[はや]くから畑[はたけ]で一生懸命[いっしょうけんめい]働[はたら]いて、家族[かぞく]を支[ささ]えているからです。",
  "Saya paling menghormati ayah. Karena setiap hari beliau bekerja keras di sawah sejak pagi untuk menghidupi keluarga.",
  "Pola: [orang]を尊敬しています。[alasan]からです。Hubungkan dengan sikap kerja (rajin, tanggung jawab).");
q("kazoku", 2, "日本[にほん]で働[はたら]いたお金[かね]は、何[なに]に使[つか]いたいですか。", "Uang hasil kerja di Jepang ingin Anda gunakan untuk apa?",
  [["仕送り", "kiriman uang ke keluarga"], ["学費", "biaya sekolah"], ["貯金", "tabungan"], ["家を建てる", "membangun rumah"]],
  "Pewawancara ingin tahu motivasi & rencana keuangan yang realistis (berhubungan dengan 目標貯金額 di CV).",
  "毎月[まいつき]、家族[かぞく]に少[すこ]し仕送[しおく]りしたいです。妹[いもうと]たちの学費[がくひ]に使[つか]ってほしいです。残[のこ]りは貯金[ちょきん]して、将来[しょうらい]インドネシアで小[ちい]さい店[みせ]を開[ひら]きたいです。",
  "Setiap bulan saya ingin mengirim sedikit uang ke keluarga, untuk biaya sekolah adik-adik. Sisanya saya tabung untuk membuka toko kecil di Indonesia nanti.",
  "Jawaban yang baik: ada rencana jelas (keluarga + tabungan + masa depan). Hindari kesan HANYA demi uang.");

/* ---------------- 学歴 ---------------- */
q("gakureki", 1, "最終学歴[さいしゅうがくれき]を教[おし]えてください。", "Apa pendidikan terakhir Anda?",
  [["最終学歴", "pendidikan terakhir"], ["高校", "SMA/SMK"], ["専門高校", "SMK"], ["卒業する", "lulus"], ["〜科", "jurusan …"]],
  "Kolom 学歴. Sebutkan sekolah, jurusan, dan tahun lulus sesuai CV.",
  "2025年[ねん]に、バンドンの専門高校[せんもんこうこう]を卒業[そつぎょう]しました。会計科[かいけいか]で勉強[べんきょう]しました。",
  "Tahun 2025 saya lulus dari SMK di Bandung. Saya belajar di jurusan akuntansi.",
  "SMA = 高校, SMK = 専門高校/職業高校, Madrasah Aliyah = イスラム高校, kuliah = 大学. Jurusan: 会計科 (akuntansi), 事務管理科 (administrasi), 看護科 (keperawatan), 理系 (IPA), 文系 (IPS).",
  [["学校[がっこう]で一番[いちばん]好[す]きな科目[かもく]は何[なん]でしたか。", "Mata pelajaran favorit di sekolah apa?"]]);
q("gakureki", 2, "学校[がっこう]では、何[なに]を勉強[べんきょう]しましたか。", "Apa yang Anda pelajari di sekolah?",
  [["専攻", "jurusan/bidang studi"], ["実習", "praktik"], ["役に立つ", "berguna"]],
  "Ingin tahu apakah ilmu sekolah ada hubungannya dengan pekerjaan.",
  "会計[かいけい]の勉強[べんきょう]をしました。お金[かね]の計算[けいさん]や、書類[しょるい]の整理[せいり]をしました。整理整頓[せいりせいとん]の習慣[しゅうかん]は、掃除[そうじ]の仕事[しごと]にも役[やく]に立[た]つと思[おも]います。",
  "Saya belajar akuntansi: menghitung uang dan merapikan dokumen. Kebiasaan merapikan itu saya rasa juga berguna untuk pekerjaan bersih-bersih.",
  "Kalau jurusanmu tidak berhubungan dengan pekerjaan, cari titik sambungnya (teliti, rapi, kerja tim, disiplin).");
q("gakureki", 2, "高校[こうこう]の専攻[せんこう]とビルクリーニングは関係[かんけい]がありませんが、どうしてこの仕事[しごと]を選[えら]びましたか。", "Jurusan SMA Anda tidak berhubungan dengan building cleaning, kenapa memilih pekerjaan ini?",
  [["関係がない", "tidak berhubungan"], ["選ぶ", "memilih"], ["興味を持つ", "menjadi tertarik"], ["きっかけ", "pemicu/awal mula"]],
  "Pertanyaan yang sering muncul kalau jurusan di CV berbeda dari bidang SSW. Tunjukkan alasan yang meyakinkan.",
  "確[たし]かに専攻[せんこう]は違[ちが]います。でも、ホテルで実習[じっしゅう]をしたとき、部屋[へや]をきれいにして、お客様[きゃくさま]に喜[よろこ]んでもらえたのがうれしかったです。それがきっかけで、この仕事[しごと]に興味[きょうみ]を持[も]ちました。",
  "Memang jurusannya berbeda. Tapi waktu praktik di hotel, saya senang kamar yang saya bersihkan membuat tamu senang. Itu awal saya tertarik pada pekerjaan ini.",
  "Akui perbedaannya (確かに…), lalu ceritakan きっかけ (pemicu) yang nyata. Untuk bidang lain, ganti ビルクリーニング dengan bidangmu.");
q("gakureki", 1, "LPKでは、どんなことを勉強[べんきょう]していますか。", "Di LPK Anda belajar apa saja?",
  [["日本語", "bahasa Jepang"], ["マナー", "tata krama"], ["技能", "keterampilan"], ["〜か月", "… bulan"]],
  "Baris terakhir 学歴 di CV biasanya LPK. Pewawancara ingin tahu persiapanmu.",
  "LPKで十[じゅっ]か月[げつ]、日本語[にほんご]とビルクリーニングの勉強[べんきょう]をしています。毎朝[まいあさ]、日本[にほん]のマナーや挨拶[あいさつ]の練習[れんしゅう]もしています。掃除[そうじ]の道具[どうぐ]の使[つか]い方[かた]も習[なら]いました。",
  "Saya sudah 10 bulan belajar bahasa Jepang dan building cleaning di LPK. Setiap pagi juga latihan tata krama dan salam Jepang. Saya juga belajar cara memakai alat kebersihan.",
  "Sebutkan lama belajar (sama dengan 日本語学習期間 di CV) dan 2–3 hal konkret yang dipelajari.");
q("gakureki", 2, "学生[がくせい]のとき、一番[いちばん]がんばったことは何[なん]ですか。", "Apa yang paling Anda perjuangkan saat masih pelajar?",
  [["がんばる", "berusaha keras"], ["部活", "ekstrakurikuler"], ["リーダー", "ketua"], ["経験", "pengalaman"]],
  "Pertanyaan klasik (ガクチカ). Ingin melihat usaha dan proses, bukan hanya hasil.",
  "バドミントン部[ぶ]の練習[れんしゅう]を一番[いちばん]がんばりました。三年間[さんねんかん]、毎日[まいにち]休[やす]まないで練習[れんしゅう]しました。チームで大会[たいかい]に出[で]て、協力[きょうりょく]することの大切[たいせつ]さを学[まな]びました。",
  "Saya paling berjuang di latihan klub bulu tangkis. Selama 3 tahun saya latihan setiap hari tanpa bolos. Saya ikut turnamen bersama tim dan belajar pentingnya kerja sama.",
  "Struktur: apa → bagaimana usahamu → apa yang dipelajari. Bisa dihubungkan dengan hobi di CV.");

/* ---------------- 職歴 ---------------- */
q("shokureki", 1, "職歴[しょくれき]について教[おし]えてください。", "Ceritakan riwayat pekerjaan Anda.",
  [["職歴", "riwayat kerja"], ["〜で働いていました", "pernah bekerja di …"], ["担当する", "bertugas/bertanggung jawab"], ["ハウスキーピング", "housekeeping"]],
  "Kolom 職歴. Sebutkan tempat, lama, dan tugas sesuai CV. Ini bagian yang paling banyak ditanya lebih dalam.",
  "高校[こうこう]を卒業[そつぎょう]してから、ホテルで六[ろっ]か月[げつ]、ハウスキーピングの仕事[しごと]をしました。客室[きゃくしつ]の清掃[せいそう]とベッドメイキングを担当[たんとう]しました。",
  "Setelah lulus SMA, saya bekerja 6 bulan di hotel sebagai housekeeping. Saya bertugas membersihkan kamar tamu dan bed making.",
  "Kalau belum pernah bekerja, katakan jujur: 仕事の経験はありませんが、学校の実習で…  Lalu ceritakan praktik/PKL.",
  [["一日[いちにち]に何部屋[なんへや]ぐらい掃除[そうじ]しましたか。", "Sehari kira-kira membersihkan berapa kamar?"], ["その仕事[しごと]で大変[たいへん]だったことは何[なん]ですか。", "Apa yang berat di pekerjaan itu?"]]);
q("shokureki", 2, "前[まえ]の仕事[しごと]では、一日[いちにち]どんな流[なが]れで働[はたら]いていましたか。", "Di pekerjaan sebelumnya, bagaimana alur kerja Anda dalam sehari?",
  [["流れ", "alur"], ["まず・次に・最後に", "pertama・lalu・terakhir"], ["朝礼", "briefing pagi"], ["報告する", "melapor"]],
  "Menguji apakah pengalamanmu nyata dan apakah kamu bisa menjelaskan urutan.",
  "朝[あさ]八時[はちじ]に朝礼[ちょうれい]がありました。まず、担当[たんとう]の部屋[へや]を確認[かくにん]しました。次[つぎ]に、ゴミを集[あつ]めて、ベッドを作[つく]って、床[ゆか]とトイレを掃除[そうじ]しました。最後[さいご]に、上司[じょうし]に報告[ほうこく]しました。",
  "Jam 8 pagi ada briefing. Pertama, saya cek kamar yang menjadi tugas saya. Lalu, kumpulkan sampah, rapikan tempat tidur, bersihkan lantai dan toilet. Terakhir, lapor ke atasan.",
  "Pakai まず → 次に → それから → 最後に. Detail kecil membuat pengalamanmu terdengar nyata.");
q("shokureki", 2, "前[まえ]の仕事[しごと]を辞[や]めた理由[りゆう]は何[なん]ですか。", "Apa alasan Anda berhenti dari pekerjaan sebelumnya?",
  [["辞める", "berhenti kerja"], ["契約が終わる", "kontrak habis"], ["理由", "alasan"], ["準備", "persiapan"]],
  "Pertanyaan sensitif. Perusahaan khawatir kamu cepat berhenti. JANGAN menjelekkan tempat kerja lama.",
  "契約[けいやく]が終[お]わったからです。それに、日本[にほん]で働[はたら]くために、LPKで日本語[にほんご]の勉強[べんきょう]に集中[しゅうちゅう]したかったです。",
  "Karena kontraknya selesai. Selain itu, saya ingin fokus belajar bahasa Jepang di LPK supaya bisa bekerja di Jepang.",
  "Alasan positif: kontrak habis, ingin fokus persiapan ke Jepang, ingin belajar keterampilan baru. Hindari: gaji kecil, atasan galak, capek.");
q("shokureki", 2, "前[まえ]の仕事[しごと]で大変[たいへん]だったことは何[なん]ですか。", "Apa yang sulit di pekerjaan sebelumnya?",
  [["大変", "berat/sulit"], ["忙しい", "sibuk"], ["工夫する", "mencari cara/akal"], ["乗り越える", "mengatasi"]],
  "Ingin melihat bagaimana kamu menghadapi kesulitan.",
  "週末[しゅうまつ]はお客様[きゃくさま]が多[おお]くて、短[みじか]い時間[じかん]でたくさんの部屋[へや]を掃除[そうじ]しなければなりませんでした。順番[じゅんばん]を決[き]めて、先輩[せんぱい]と協力[きょうりょく]して、時間内[じかんない]に終[お]わらせることができました。",
  "Akhir pekan tamunya banyak, jadi harus membersihkan banyak kamar dalam waktu singkat. Saya menentukan urutan dan bekerja sama dengan senior, sehingga bisa selesai tepat waktu.",
  "Pola: kesulitan → apa yang kamu lakukan (工夫) → hasilnya. Jangan hanya mengeluh.");
q("shokureki", 2, "前[まえ]の仕事[しごと]の経験[けいけん]を、日本[にほん]でどう活[い]かしたいですか。", "Bagaimana Anda ingin memanfaatkan pengalaman kerja sebelumnya di Jepang?",
  [["活かす", "memanfaatkan"], ["経験", "pengalaman"], ["丁寧", "teliti/rapi"], ["スピード", "kecepatan"]],
  "Kalimat 'この経験を活かして' sering ditulis di CV bagian アピール — pewawancara ingin mendengar contohnya.",
  "ホテルで、丁寧[ていねい]に、そして早[はや]く掃除[そうじ]する方法[ほうほう]を覚[おぼ]えました。日本[にほん]でも、この経験[けいけん]を活[い]かして、きれいで安全[あんぜん]な建物[たてもの]を作[つく]るためにがんばりたいです。",
  "Di hotel saya belajar cara membersihkan dengan teliti sekaligus cepat. Di Jepang saya ingin memanfaatkan pengalaman ini untuk membuat gedung yang bersih dan aman.",
  "Sebut keterampilan yang spesifik, jangan hanya 'pengalaman'.");
q("shokureki", 2, "前[まえ]の仕事[しごと]の給料[きゅうりょう]はいくらでしたか。", "Berapa gaji Anda di pekerjaan sebelumnya?",
  [["給料", "gaji"], ["収入", "penghasilan"], ["月に", "per bulan"], ["〜万ルピア", "… puluh ribu rupiah"]],
  "Kolom 現在の収入 di CV. Pewawancara ingin memahami kondisi ekonomi; jawab angka yang sama dengan CV.",
  "月[つき]に三百万[さんびゃくまん]ルピアぐらいでした。日本円[にほんえん]で三万円[さんまんえん]ぐらいです。",
  "Sekitar 3 juta rupiah per bulan. Kira-kira 30.000 yen.",
  "Satuan: 万 = 10.000. 3 juta = 三百万, 1,5 juta = 百五十万. Latih juga mengonversi ke yen.");
q("shokureki", 1, "仕事[しごと]の経験[けいけん]がない場合[ばあい]：アルバイトや実習[じっしゅう]の経験[けいけん]はありますか。", "(Kalau belum pernah kerja) Pernah kerja paruh waktu atau praktik?",
  [["アルバイト", "kerja paruh waktu"], ["実習", "praktik (PKL)"], ["インターンシップ", "magang"], ["手伝う", "membantu"]],
  "Untuk lulusan baru. Pewawancara mencari pengalaman apa pun yang menunjukkan sikap kerja.",
  "仕事[しごと]の経験[けいけん]はありません。でも、高校[こうこう]のとき、三[さん]か月[げつ]ホテルで実習[じっしゅう]をしました。それから、家[いえ]で母[はは]の店[みせ]をよく手伝[てつだ]っていました。",
  "Saya belum punya pengalaman kerja. Tapi waktu SMA saya PKL di hotel selama 3 bulan. Selain itu, saya sering membantu warung ibu di rumah.",
  "Jangan berhenti di 'tidak ada'. PKL, membantu usaha keluarga, kegiatan organisasi — semuanya boleh diceritakan.");

/* ---------------- 長所・短所 ---------------- */
q("chosho", 1, "あなたの長所[ちょうしょ]は何[なん]ですか。", "Apa kelebihan Anda?",
  [["長所", "kelebihan"], ["時間を守る", "tepat waktu"], ["責任感がある", "bertanggung jawab"], ["まじめ", "serius/rajin"], ["例えば", "misalnya"]],
  "Pertanyaan WAJIB. Jawaban harus sama dengan kolom 長所 di CV, dan HARUS ada contoh nyata.",
  "私[わたし]の長所[ちょうしょ]は、時間[じかん]を守[まも]ることです。遅刻[ちこく]しないように、毎日[まいにち]十五分[じゅうごふん]前[まえ]に準備[じゅんび]をします。LPKでも一度[いちど]も遅刻[ちこく]したことがありません。",
  "Kelebihan saya adalah tepat waktu. Supaya tidak terlambat, setiap hari saya bersiap 15 menit lebih awal. Di LPK pun saya belum pernah terlambat sekali pun.",
  "Pola: 私の長所は〜ことです。→ contoh/bukti → (hubungkan dengan pekerjaan). Pilih SATU kelebihan saja supaya jelas.",
  [["それを仕事[しごと]でどう活[い]かしますか。", "Bagaimana Anda memanfaatkannya dalam pekerjaan?"], ["周[まわ]りの人[ひと]からは、どんな人[ひと]だと言[い]われますか。", "Orang sekitar bilang Anda orang seperti apa?"]]);
q("chosho", 1, "あなたの短所[たんしょ]は何[なん]ですか。", "Apa kekurangan Anda?",
  [["短所", "kekurangan"], ["緊張しやすい", "mudah gugup"], ["気にしすぎる", "terlalu memikirkan"], ["直すために", "untuk memperbaikinya"], ["〜ようにしています", "saya berusaha untuk …"]],
  "Pertanyaan WAJIB. Yang dinilai bukan kekurangannya, tapi USAHA memperbaikinya.",
  "私[わたし]の短所[たんしょ]は、大勢[おおぜい]の前[まえ]で話[はな]すとき、緊張[きんちょう]しやすいところです。直[なお]すために、毎日[まいにち]LPKで友達[ともだち]と会話[かいわ]の練習[れんしゅう]をして、自信[じしん]を持[も]つようにしています。",
  "Kekurangan saya adalah mudah gugup saat bicara di depan banyak orang. Untuk memperbaikinya, setiap hari saya latihan percakapan dengan teman di LPK supaya lebih percaya diri.",
  "Pola: 私の短所は〜ところです。でも／直すために〜ようにしています。JANGAN pilih kekurangan fatal (malas, sering terlambat, mudah marah). Jangan jawab 'tidak ada'.",
  [["最近[さいきん]、少[すこ]しよくなりましたか。", "Belakangan sudah sedikit membaik?"]]);
q("chosho", 2, "長所[ちょうしょ]を表[あらわ]すエピソードを教[おし]えてください。", "Ceritakan pengalaman yang menunjukkan kelebihan Anda.",
  [["エピソード", "cerita/pengalaman"], ["任される", "dipercaya (diberi tugas)"], ["最後まで", "sampai selesai"], ["褒められる", "dipuji"]],
  "Pewawancara menguji apakah kelebihan di CV benar-benar nyata.",
  "ホテルで働[はたら]いていたとき、忙[いそが]しい日[ひ]に、他[ほか]の人[ひと]の部屋[へや]も任[まか]されました。最後[さいご]まで丁寧[ていねい]に掃除[そうじ]して、上司[じょうし]に「ありがとう、助[たす]かった」と褒[ほ]められました。",
  "Waktu kerja di hotel, di hari yang sibuk saya juga dipercaya membersihkan kamar bagian orang lain. Saya bersihkan dengan teliti sampai selesai, dan atasan memuji \"terima kasih, sangat membantu\".",
  "Cerita singkat dengan situasi → tindakan → hasil. Kalimat pujian orang lain membuat cerita lebih meyakinkan.");
q("chosho", 2, "短所[たんしょ]のせいで、失敗[しっぱい]したことはありますか。", "Pernahkah gagal karena kekurangan Anda?",
  [["失敗する", "gagal/berbuat salah"], ["反省する", "merenungkan kesalahan"], ["それから", "sejak itu"], ["メモを取る", "mencatat"]],
  "Melihat kejujuran dan kemampuan belajar dari kesalahan.",
  "はい、あります。前[まえ]に、上司[じょうし]に言[い]われたことを忘[わす]れてしまいました。とても反省[はんせい]しました。それから、いつもメモを取[と]るようにしています。今[いま]は忘[わす]れることが少[すく]なくなりました。",
  "Ya, pernah. Dulu saya lupa instruksi dari atasan. Saya sangat menyesal. Sejak itu saya selalu mencatat. Sekarang saya jadi jarang lupa.",
  "Jujur + 反省 + perbaikan konkret + hasil. Ini justru memberi kesan baik.");
q("chosho", 2, "友達[ともだち]や先生[せんせい]から、どんな人[ひと]だと言[い]われますか。", "Teman atau guru bilang Anda orang seperti apa?",
  [["〜と言われます", "dikatakan …"], ["明るい", "ceria"], ["優しい", "baik hati"], ["頼りになる", "bisa diandalkan"]],
  "Di CV ada kolom 先生/送出し機関からのコメント. Jawabanmu sebaiknya selaras dengan komentar guru.",
  "友達[ともだち]からは「明[あか]るくて、まじめな人[ひと]」とよく言[い]われます。先生[せんせい]からは「時間[じかん]をきちんと守[まも]る」と言[い]われました。",
  "Teman sering bilang saya \"orang yang ceria dan rajin\". Guru bilang saya \"selalu tepat waktu\".",
  "Cocokkan dengan komentar guru di CV-mu. Pewawancara sering membandingkan keduanya.");
q("chosho", 3, "ストレスがたまったとき、どうしますか。", "Kalau sedang stres, apa yang Anda lakukan?",
  [["ストレスがたまる", "stres menumpuk"], ["気分転換", "menyegarkan pikiran"], ["相談する", "berkonsultasi"], ["散歩", "jalan-jalan"]],
  "Bekerja di luar negeri penuh tekanan. Perusahaan ingin tahu caramu mengelola stres dengan sehat.",
  "好[す]きな音楽[おんがく]を聞[き]いたり、散歩[さんぽ]をしたりして気分転換[きぶんてんかん]します。悩[なや]みがあるときは、一人[ひとり]で考[かんが]えすぎないで、先輩[せんぱい]や友達[ともだち]に相談[そうだん]します。",
  "Saya menyegarkan pikiran dengan mendengarkan musik kesukaan atau jalan-jalan. Kalau ada masalah, saya tidak memikirkannya sendirian, tapi berkonsultasi dengan senior atau teman.",
  "Pakai 〜たり〜たりします. Menyebut 相談する (berkonsultasi) sangat dihargai di Jepang (budaya 報連相).");

/* ---------------- 趣味・特技・興味 ---------------- */
q("shumi", 1, "趣味[しゅみ]は何[なん]ですか。", "Apa hobi Anda?",
  [["趣味", "hobi"], ["〜ことです", "(hobi saya) adalah …"], ["映画", "film"], ["料理", "memasak"], ["休みの日", "hari libur"]],
  "Kolom 趣味. Pertanyaan santai — tapi siapkan cerita lanjutan karena hampir pasti ditanya lebih dalam.",
  "趣味[しゅみ]はバドミントンをすることです。休[やす]みの日[ひ]に、友達[ともだち]と一緒[いっしょ]に二時間[にじかん]ぐらいします。体力[たいりょく]がつくし、ストレスも解消[かいしょう]できます。",
  "Hobi saya bermain bulu tangkis. Di hari libur saya main bersama teman sekitar 2 jam. Menambah stamina dan juga menghilangkan stres.",
  "Pola: 趣味は〜ことです。+ kapan/dengan siapa + kenapa suka. Hobi yang menunjukkan stamina atau kerja sama nilainya plus.",
  [["日本[にほん]でも続[つづ]けたいですか。", "Ingin melanjutkannya di Jepang?"], ["どのくらいしていますか。", "Sudah berapa lama melakukannya?"]]);
q("shumi", 1, "特技[とくぎ]は何[なん]ですか。", "Apa keahlian khusus Anda?",
  [["特技", "keahlian khusus"], ["得意", "pandai/jago"], ["〜ことができます", "bisa …"], ["パソコン", "komputer"]],
  "Kolom 特技. Bedanya dengan hobi: 特技 = hal yang kamu KUASAI. Bisa dihubungkan dengan pekerjaan.",
  "特技[とくぎ]は料理[りょうり]です。インドネシア料理[りょうり]をよく作[つく]ります。日本[にほん]でも自分[じぶん]で料理[りょうり]をして、健康[けんこう]に気[き]をつけたいです。",
  "Keahlian saya memasak. Saya sering membuat masakan Indonesia. Di Jepang pun saya ingin masak sendiri dan menjaga kesehatan.",
  "Contoh lain: Microsoft Office, bahasa Inggris, merapikan/organisasi barang, fotografi. Hubungkan ke kehidupan atau pekerjaan di Jepang.",
  [["得意[とくい]な料理[りょうり]は何[なん]ですか。", "Masakan andalan Anda apa?"]]);
q("shumi", 2, "興味[きょうみ]・関心[かんしん]のあることは何[なん]ですか。", "Hal apa yang Anda minati?",
  [["興味がある", "tertarik"], ["関心", "minat/perhatian"], ["技術", "teknik/teknologi"], ["道具", "alat"], ["洗剤", "deterjen/pembersih"]],
  "Kolom 興味・関心. Pewawancara ingin melihat minat yang berhubungan dengan pekerjaan/Jepang.",
  "日本[にほん]の清掃[せいそう]技術[ぎじゅつ]に興味[きょうみ]があります。日本[にほん]は道具[どうぐ]や洗剤[せんざい]の種類[しゅるい]が多[おお]くて、使[つか]い方[かた]もとても細[こま]かいと聞[き]きました。それを勉強[べんきょう]したいです。",
  "Saya tertarik pada teknik kebersihan Jepang. Saya dengar di Jepang jenis alat dan pembersihnya banyak, dan cara pakainya sangat detail. Saya ingin mempelajarinya.",
  "Sambungkan minatmu dengan bidang SSW-mu. Untuk bidang lain, ganti 清掃技術 dengan teknik bidangmu.");
q("shumi", 2, "休[やす]みの日[ひ]は何[なに]をしていますか。", "Apa yang Anda lakukan di hari libur?",
  [["休みの日", "hari libur"], ["洗濯", "mencuci baju"], ["掃除", "bersih-bersih"], ["復習", "mengulang pelajaran"]],
  "Melihat gaya hidup — apakah sehat dan teratur.",
  "午前[ごぜん]は洗濯[せんたく]や部屋[へや]の掃除[そうじ]をします。午後[ごご]は日本語[にほんご]の復習[ふくしゅう]をしたり、友達[ともだち]とバドミントンをしたりします。夜[よる]は家族[かぞく]に電話[でんわ]します。",
  "Pagi saya mencuci baju dan membersihkan kamar. Siang mengulang pelajaran bahasa Jepang atau main bulu tangkis dengan teman. Malam menelepon keluarga.",
  "Gambarkan hari libur yang teratur. Hindari 'tidur seharian' atau 'main game seharian'.");
q("shumi", 2, "日本[にほん]で行[い]ってみたい所[ところ]や、やってみたいことはありますか。", "Ada tempat yang ingin Anda kunjungi atau hal yang ingin dicoba di Jepang?",
  [["〜てみたい", "ingin mencoba …"], ["富士山", "Gunung Fuji"], ["桜", "bunga sakura"], ["お花見", "piknik melihat sakura"]],
  "Pertanyaan santai untuk melihat antusiasme terhadap Jepang.",
  "富士山[ふじさん]を見[み]てみたいです。それから、春[はる]に会社[かいしゃ]の人[ひと]たちとお花見[はなみ]をしてみたいです。",
  "Saya ingin melihat Gunung Fuji. Lalu, di musim semi saya ingin mencoba ohanami bersama orang-orang kantor.",
  "Menyebut kegiatan bersama rekan kerja memberi kesan kamu ingin akrab dengan tim.");

/* ---------------- 日本語・資格 ---------------- */
q("nihongo", 1, "日本語[にほんご]はどのくらい勉強[べんきょう]していますか。", "Sudah berapa lama Anda belajar bahasa Jepang?",
  [["日本語学習期間", "lama belajar bahasa Jepang"], ["〜か月", "… bulan"], ["〜年", "… tahun"], ["毎日", "setiap hari"]],
  "Kolom 日本語学習期間. Jawaban harus cocok dengan CV.",
  "十[じゅっ]か月[げつ]勉強[べんきょう]しています。LPKで毎日[まいにち]八時間[はちじかん]ぐらい勉強[べんきょう]しています。",
  "Saya sudah belajar 10 bulan. Di LPK saya belajar sekitar 8 jam setiap hari.",
  "Kalau pernah belajar di SMA juga, tambahkan: 高校でも二年間勉強しました.",
  [["どうやって勉強[べんきょう]していますか。", "Bagaimana cara Anda belajar?"]]);
q("nihongo", 1, "日本語[にほんご]の資格[しかく]を持[も]っていますか。", "Apakah Anda punya sertifikat bahasa Jepang?",
  [["資格", "sertifikat/kualifikasi"], ["合格する", "lulus (ujian)"], ["JFT-Basic", "tes JFT-Basic (A2)"], ["受験する", "mengikuti ujian"]],
  "Kolom 日本語能力 (JFT Basic A2 / JLPT N4). Sebutkan dengan jelas apa yang sudah lulus dan rencana berikutnya.",
  "はい、JFT-BasicのA2に合格[ごうかく]しました。今[いま]はJLPTのN3に合格[ごうかく]するために勉強[べんきょう]しています。",
  "Ya, saya sudah lulus JFT-Basic A2. Sekarang saya belajar untuk lulus JLPT N3.",
  "Selalu tambahkan target berikutnya — menunjukkan semangat belajar terus.");
q("nihongo", 1, "特定技能[とくていぎのう]の試験[しけん]には合格[ごうかく]しましたか。", "Apakah Anda sudah lulus ujian keterampilan SSW?",
  [["特定技能", "Tokutei Ginou (SSW)"], ["技能試験", "ujian keterampilan"], ["受験予定", "rencana ikut ujian"], ["〜月に", "pada bulan …"]],
  "Kolom 技能試験 (SSW). Kalau belum, sebutkan jadwal ujianmu dengan jelas.",
  "はい、ビルクリーニングの技能試験[ぎのうしけん]に合格[ごうかく]しました。",
  "Ya, saya sudah lulus ujian keterampilan building cleaning.",
  "Kalau belum: まだ合格していません。十二月に受験する予定です。今、毎日テキストで勉強しています。");
q("nihongo", 2, "日本語[にほんご]の勉強[べんきょう]で、何[なに]が一番[いちばん]難[むずか]しいですか。", "Apa yang paling sulit dalam belajar bahasa Jepang?",
  [["難しい", "sulit"], ["漢字", "kanji"], ["敬語", "bahasa hormat"], ["聞き取り", "mendengarkan"], ["覚える", "menghafal"]],
  "Ingin tahu kejujuran dan strategi belajarmu.",
  "漢字[かんじ]が一番[いちばん]難[むずか]しいです。読[よ]み方[かた]がたくさんあるからです。毎日[まいにち]十個[じゅっこ]ずつ書[か]いて、覚[おぼ]えるようにしています。",
  "Kanji yang paling sulit, karena cara bacanya banyak. Setiap hari saya menulis 10 kanji supaya hafal.",
  "Kesulitan + cara mengatasinya. Pola 〜ようにしています sangat berguna.");
q("nihongo", 2, "日本語[にほんご]が分[わ]からないとき、どうしますか。", "Kalau tidak mengerti bahasa Jepang (saat kerja), apa yang Anda lakukan?",
  [["もう一度お願いします", "tolong sekali lagi"], ["ゆっくり", "pelan-pelan"], ["確認する", "memastikan"], ["分かったふり", "pura-pura mengerti"]],
  "Sangat penting untuk keselamatan kerja. Pewawancara ingin memastikan kamu TIDAK pura-pura mengerti.",
  "分[わ]かったふりをしないで、「すみません、もう一度[いちど]ゆっくりお願[ねが]いします」と聞[き]きます。大切[たいせつ]なことはメモに書[か]いて、確認[かくにん]します。",
  "Saya tidak pura-pura mengerti, tapi bertanya \"Maaf, tolong sekali lagi pelan-pelan\". Hal penting saya catat dan pastikan.",
  "Kunci: 分かったふりをしない + kalimat bertanya yang sopan + メモ.");

/* ---------------- 健康・生活 ---------------- */
q("kenkou", 1, "タバコを吸[す]いますか。お酒[さけ]を飲[の]みますか。", "Apakah Anda merokok? Minum alkohol?",
  [["タバコを吸う", "merokok"], ["お酒を飲む", "minum alkohol"], ["吸いません", "tidak merokok"], ["飲みません", "tidak minum"]],
  "Kolom タバコ / お酒 di CV. Jawab sama dengan CV.",
  "いいえ、タバコは吸[す]いません。お酒[さけ]も宗教[しゅうきょう]の理由[りゆう]で飲[の]みません。",
  "Tidak, saya tidak merokok. Saya juga tidak minum alkohol karena alasan agama.",
  "Kalau merokok: 吸いますが、決められた場所と時間だけで吸います。 (aturan merokok di Jepang ketat).",
  [["会社[かいしゃ]の飲[の]み会[かい]に誘[さそ]われたら、どうしますか。", "Kalau diajak acara minum kantor, bagaimana?"]]);
q("kenkou", 1, "健康状態[けんこうじょうたい]はどうですか。大[おお]きい病気[びょうき]をしたことがありますか。", "Bagaimana kondisi kesehatan Anda? Pernah sakit berat?",
  [["健康", "sehat/kesehatan"], ["病気", "penyakit"], ["けが", "cedera"], ["入院", "dirawat inap"], ["健康診断", "pemeriksaan kesehatan"]],
  "Pekerjaan SSW banyak yang fisik. Jawab jujur — data kesehatan juga dicek lewat medical check-up.",
  "とても健康[けんこう]です。大[おお]きい病気[びょうき]や、けがをしたことはありません。健康診断[けんこうしんだん]も問題[もんだい]ありませんでした。",
  "Saya sangat sehat. Belum pernah sakit berat atau cedera. Hasil pemeriksaan kesehatan juga tidak ada masalah.",
  "Kalau pernah sakit/operasi, jujur dan sebutkan sekarang sudah sembuh: 三年前に手術をしましたが、今は完全に治っています。");
q("kenkou", 1, "目[め]は悪[わる]くないですか。", "Apakah penglihatan Anda baik?",
  [["視力", "penglihatan"], ["裸眼", "mata telanjang"], ["眼鏡", "kacamata"], ["コンタクト", "lensa kontak"]],
  "Kolom 視力 di CV (右・左・裸眼). Penting untuk pekerjaan yang butuh ketelitian.",
  "はい、大丈夫[だいじょうぶ]です。視力[しりょく]は右[みぎ]も左[ひだり]も0.8で、眼鏡[めがね]はかけていません。",
  "Ya, baik. Penglihatan kanan dan kiri 0,8, saya tidak memakai kacamata.",
  "Angka desimal: 0.8 = れいてんはち. Kalau pakai kacamata: 眼鏡をかけています。眼鏡をかけると一・〇です。");
q("kenkou", 2, "体力[たいりょく]に自信[じしん]がありますか。", "Apakah Anda percaya diri dengan stamina Anda?",
  [["体力", "stamina/tenaga"], ["自信がある", "percaya diri"], ["立ち仕事", "pekerjaan berdiri"], ["運動", "olahraga"]],
  "Building cleaning dan bidang SSW lain banyak berdiri, berjalan, dan mengangkat barang.",
  "はい、自信[じしん]があります。毎朝[まいあさ]三十分[さんじゅっぷん]走[はし]っています。ホテルでも一日中[いちにちじゅう]立[た]って仕事[しごと]をしていたので、大丈夫[だいじょうぶ]です。",
  "Ya, saya percaya diri. Setiap pagi saya lari 30 menit. Di hotel pun saya kerja berdiri seharian, jadi tidak masalah.",
  "Beri bukti (olahraga rutin, pengalaman kerja fisik).");
q("kenkou", 2, "仕事中[しごとちゅう]のお祈[いの]りについて、どう考[かんが]えていますか。", "Bagaimana pendapat Anda tentang waktu salat saat bekerja?",
  [["お祈り", "ibadah/salat"], ["休憩時間", "waktu istirahat"], ["了承する", "memahami & menyetujui"], ["会社のルール", "aturan perusahaan"]],
  "Kolom 就労中のお祈り制限 (了承). Perusahaan ingin memastikan kamu memahami bahwa salat dilakukan di waktu istirahat dan mengikuti aturan perusahaan.",
  "仕事中[しごとちゅう]は会社[かいしゃ]のルールを守[まも]ります。お祈[いの]りは休憩時間[きゅうけいじかん]にします。時間[じかん]が合[あ]わないときは、仕事[しごと]が終[お]わってからまとめてお祈[いの]りします。",
  "Saat bekerja saya mengikuti aturan perusahaan. Salat saya lakukan di waktu istirahat. Kalau waktunya tidak cocok, saya jamak setelah pekerjaan selesai.",
  "Tunjukkan bahwa kamu fleksibel dan mengutamakan aturan kerja. Ini sudah kamu setujui (了承) di CV.");
q("kenkou", 2, "仕事中[しごとちゅう]は、帽子[ぼうし]をかぶったり、スカーフを外[はず]したりする必要[ひつよう]がありますが、大丈夫[だいじょうぶ]ですか。", "Saat kerja mungkin perlu memakai topi atau melepas/menyesuaikan kerudung, apakah tidak masalah?",
  [["帽子をかぶる", "memakai topi"], ["スカーフ", "kerudung/jilbab"], ["制服", "seragam"], ["規則に従う", "mengikuti aturan"]],
  "Kolom 頭部への帽子やスカーフの着用制限. Jawab sesuai yang sudah kamu setujui di CV.",
  "はい、大丈夫[だいじょうぶ]です。会社[かいしゃ]の制服[せいふく]や規則[きそく]に従[したが]います。安全[あんぜん]のために必要[ひつよう]なことは、理解[りかい]しています。",
  "Ya, tidak masalah. Saya mengikuti seragam dan aturan perusahaan. Saya memahami bahwa itu diperlukan demi keselamatan.",
  "Kalau ada hal yang tidak bisa kamu terima, lebih baik diskusikan dengan sopan sekarang daripada bermasalah nanti.");
q("kenkou", 2, "会社[かいしゃ]の寮[りょう]（社宅[しゃたく]）に住[す]みたいですか。", "Apakah Anda ingin tinggal di asrama perusahaan?",
  [["社宅", "asrama/rumah perusahaan"], ["寮", "asrama"], ["共同生活", "hidup bersama"], ["ゴミの分別", "memilah sampah"]],
  "Kolom 社宅手配希望. Pewawancara juga ingin tahu apakah kamu bisa hidup bersama orang lain dan mengikuti aturan lingkungan Jepang.",
  "はい、社宅[しゃたく]を希望[きぼう]します。LPKでも寮[りょう]で共同生活[きょうどうせいかつ]をしているので、慣[な]れています。ゴミの分別[ぶんべつ]や、夜[よる]は静[しず]かにすることなど、日本[にほん]のルールを守[まも]ります。",
  "Ya, saya ingin asrama perusahaan. Di LPK pun saya hidup bersama di asrama, jadi sudah terbiasa. Saya akan mematuhi aturan Jepang seperti memilah sampah dan tidak berisik di malam hari.",
  "Sebutkan aturan hidup di Jepang yang kamu tahu (ゴミの分別, 騒音, 時間) — nilai plus.");
q("kenkou", 3, "日本[にほん]の食[た]べ物[もの]は大丈夫[だいじょうぶ]ですか。食[た]べられない物[もの]はありますか。", "Apakah Anda cocok dengan makanan Jepang? Ada yang tidak bisa dimakan?",
  [["豚肉", "daging babi"], ["ハラール", "halal"], ["自炊する", "masak sendiri"], ["アレルギー", "alergi"]],
  "Ingin tahu apakah ada pantangan makanan atau alergi, dan bagaimana kamu mengaturnya.",
  "宗教[しゅうきょう]の理由[りゆう]で、豚肉[ぶたにく]とお酒[さけ]は食[た]べられません。でも、自分[じぶん]で料理[りょうり]をするので、大丈夫[だいじょうぶ]です。アレルギーはありません。",
  "Karena alasan agama, saya tidak bisa makan daging babi dan alkohol. Tapi saya masak sendiri, jadi tidak masalah. Saya tidak punya alergi.",
  "Sebut pantangan dengan jelas + solusi (masak sendiri, cek label) supaya perusahaan tidak khawatir.");

/* ---------------- 将来・お金 ---------------- */
q("shourai", 1, "日本[にほん]で何年[なんねん]ぐらい働[はたら]きたいですか。", "Berapa tahun Anda ingin bekerja di Jepang?",
  [["希望就労期間", "lama kerja yang diinginkan"], ["〜年間", "selama … tahun"], ["長く", "lama"], ["できれば", "kalau bisa"]],
  "Kolom 希望就労期間. Perusahaan Jepang sangat menghargai kandidat yang ingin bekerja LAMA.",
  "五年間[ごねんかん]働[はたら]きたいです。できれば、もっと長[なが]く同[おな]じ会社[かいしゃ]で働[はたら]いて、仕事[しごと]をしっかり覚[おぼ]えたいです。",
  "Saya ingin bekerja 5 tahun. Kalau bisa, saya ingin bekerja lebih lama di perusahaan yang sama dan menguasai pekerjaan dengan baik.",
  "Angka harus sama dengan CV. Tambahkan 'di perusahaan yang sama' — perusahaan takut kandidat pindah kerja.",
  [["特定技能[とくていぎのう]二号[にごう]を知[し]っていますか。", "Apakah Anda tahu SSW nomor 2?"]]);
q("shourai", 2, "目標[もくひょう]の貯金額[ちょきんがく]はいくらですか。", "Berapa target tabungan Anda?",
  [["目標", "target"], ["貯金額", "jumlah tabungan"], ["〜万円", "… puluh ribu yen"], ["毎月", "setiap bulan"]],
  "Kolom 目標貯金額. Pewawancara menilai apakah rencanamu realistis dan apakah kamu bisa mengatur uang.",
  "五年間[ごねんかん]で二百四十万円[にひゃくよんじゅうまんえん]貯金[ちょきん]したいです。毎月[まいつき]四万円[よんまんえん]ずつ貯金[ちょきん]する予定[よてい]です。",
  "Saya ingin menabung 2,4 juta yen dalam 5 tahun. Rencananya setiap bulan menabung 40.000 yen.",
  "Hitung dulu: target ÷ jumlah bulan = tabungan per bulan. Jawaban dengan rencana per bulan terdengar matang.",
  [["その貯金[ちょきん]で何[なに]をしたいですか。", "Tabungan itu ingin dipakai untuk apa?"]]);
q("shourai", 3, "借金[しゃっきん]はありますか。どうやって返[かえ]しますか。", "Apakah Anda punya utang? Bagaimana cara melunasinya?",
  [["借金", "utang"], ["返す", "mengembalikan/melunasi"], ["費用", "biaya"], ["〜ずつ", "masing-masing/sedikit demi sedikit"]],
  "Kolom 借金 di CV. Perusahaan ingin memastikan utang tidak membuatmu kabur atau berhenti tiba-tiba. Jawab JUJUR sesuai CV.",
  "はい、日本[にほん]に行[い]く準備[じゅんび]の費用[ひよう]で、四十万円[よんじゅうまんえん]ぐらいあります。最初[さいしょ]の一年[いちねん]で、毎月[まいつき]少[すこ]しずつ返[かえ]す予定[よてい]です。",
  "Ya, sekitar 400.000 yen untuk biaya persiapan ke Jepang. Rencananya saya cicil sedikit demi sedikit setiap bulan di tahun pertama.",
  "Jangan berbohong — angka di CV bisa dicek. Yang penting: ada rencana pelunasan yang jelas. Kalau tidak ada utang: いいえ、借金はありません。");
q("shourai", 2, "将来[しょうらい]の夢[ゆめ]は何[なん]ですか。", "Apa cita-cita Anda di masa depan?",
  [["将来", "masa depan"], ["夢", "cita-cita/mimpi"], ["国に帰る", "pulang ke negara asal"], ["会社を作る", "mendirikan usaha"]],
  "Melihat tujuan jangka panjang dan apakah sejalan dengan bekerja lama di Jepang.",
  "日本[にほん]で技術[ぎじゅつ]と経験[けいけん]を積[つ]んで、将来[しょうらい]はインドネシアで清掃[せいそう]の会社[かいしゃ]を作[つく]りたいです。日本[にほん]のきれいにする文化[ぶんか]をインドネシアに広[ひろ]めたいです。",
  "Saya ingin mengumpulkan keterampilan dan pengalaman di Jepang, lalu suatu hari mendirikan perusahaan kebersihan di Indonesia. Saya ingin menyebarkan budaya bersih Jepang ke Indonesia.",
  "Mimpi yang berhubungan dengan bidang kerja terdengar paling meyakinkan.");
q("shourai", 2, "五年後[ごねんご]、どうなっていたいですか。", "Lima tahun lagi, Anda ingin menjadi seperti apa?",
  [["〜後", "… kemudian"], ["リーダー", "pemimpin tim"], ["後輩", "junior"], ["教える", "mengajar"]],
  "Melihat ambisi dan rencana karier di perusahaan.",
  "五年後[ごねんご]は、仕事[しごと]を全部[ぜんぶ]一人[ひとり]でできるようになって、後輩[こうはい]に教[おし]えられる人[ひと]になりたいです。日本語[にほんご]もN3に合格[ごうかく]したいです。",
  "Lima tahun lagi saya ingin bisa mengerjakan semua pekerjaan sendiri dan menjadi orang yang bisa mengajari junior. Saya juga ingin lulus N3.",
  "Pola: 〜ようになりたい / 〜人になりたい. Target konkret (N3, jadi senior/leader) bagus.");

/* ---------------- 自己PR・アピール ---------------- */
q("appeal", 1, "自己[じこ]PRをしてください。", "Silakan lakukan self-PR (promosikan diri Anda).",
  [["自己PR", "promosi diri"], ["責任感", "rasa tanggung jawab"], ["活かす", "memanfaatkan"], ["貢献する", "berkontribusi"]],
  "Pertanyaan WAJIB, sumbernya kolom その他・アピール di CV. Gabungkan kelebihan + pengalaman + semangat, 1 menit.",
  "私[わたし]の長所[ちょうしょ]は、まじめで責任感[せきにんかん]があるところです。ホテルで六[ろっ]か月[げつ]、ハウスキーピングの仕事[しごと]をして、客室[きゃくしつ]の清掃[せいそう]とベッドメイキングを担当[たんとう]しました。この経験[けいけん]を活[い]かして、日本[にほん]でも一生懸命[いっしょうけんめい]働[はたら]き、御社[おんしゃ]に貢献[こうけん]したいです。よろしくお願[ねが]いいたします。",
  "Kelebihan saya adalah rajin dan bertanggung jawab. Saya bekerja 6 bulan di hotel sebagai housekeeping, bertugas membersihkan kamar dan bed making. Dengan pengalaman ini, saya ingin bekerja sungguh-sungguh di Jepang dan berkontribusi untuk perusahaan Anda. Mohon bantuannya.",
  "Struktur 3 langkah: ① kelebihan ② bukti/pengalaman ③ apa yang akan kamu lakukan untuk perusahaan. Isi harus sesuai CV — tapi ucapkan dengan kata-katamu sendiri, jangan seperti membaca.",
  [["ほかにアピールしたいことはありますか。", "Ada hal lain yang ingin Anda tonjolkan?"]]);
q("appeal", 2, "ほかの人[ひと]ではなく、あなたを採用[さいよう]する理由[りゆう]は何[なん]ですか。", "Kenapa kami harus memilih Anda, bukan orang lain?",
  [["採用する", "merekrut/menerima kerja"], ["負けない", "tidak kalah"], ["強み", "kekuatan"], ["約束する", "berjanji"]],
  "Pertanyaan tingkat lanjut. Tunjukkan kekuatan khasmu dengan percaya diri tapi tetap rendah hati.",
  "清掃[せいそう]の経験[けいけん]と、時間[じかん]を守[まも]ることは、誰[だれ]にも負[ま]けません。分[わ]からないことはすぐ質問[しつもん]して、早[はや]く仕事[しごと]を覚[おぼ]えます。長[なが]く働[はたら]いて、会社[かいしゃ]の役[やく]に立[た]つ人[ひと]になることを約束[やくそく]します。",
  "Dalam hal pengalaman kebersihan dan ketepatan waktu, saya tidak kalah dari siapa pun. Kalau ada yang tidak saya pahami, saya langsung bertanya dan cepat menguasai pekerjaan. Saya berjanji bekerja lama dan menjadi orang yang berguna bagi perusahaan.",
  "誰にも負けません = 'tidak kalah dari siapa pun' — kalimat kuat untuk menutup.");
q("appeal", 2, "チームで働[はたら]くとき、あなたはどんな役割[やくわり]ですか。", "Saat bekerja dalam tim, peran Anda biasanya apa?",
  [["役割", "peran"], ["協力する", "bekerja sama"], ["サポート", "dukungan"], ["声をかける", "menyapa/mengajak bicara"]],
  "Banyak CV menulis 'bisa kerja sama tim'. Pewawancara meminta bukti peranmu.",
  "私[わたし]は、みんなをサポートする役割[やくわり]が多[おお]いです。困[こま]っている人[ひと]がいたら、「手伝[てつだ]いましょうか」と声[こえ]をかけます。チームで仕事[しごと]を早[はや]く終[お]わらせることが好[す]きです。",
  "Saya sering berperan mendukung semua orang. Kalau ada yang kesulitan, saya menawarkan \"boleh saya bantu?\". Saya suka menyelesaikan pekerjaan dengan cepat bersama tim.",
  "Beri contoh kalimat yang kamu ucapkan (手伝いましょうか) — terdengar konkret.");
q("appeal", 3, "履歴書[りれきしょ]に書[か]いていないことで、伝[つた]えたいことはありますか。", "Ada hal yang tidak tertulis di CV yang ingin Anda sampaikan?",
  [["伝える", "menyampaikan"], ["実は", "sebenarnya"], ["自信", "percaya diri"], ["意欲", "semangat/motivasi"]],
  "Kesempatan terakhir menunjukkan nilai tambah. Siapkan 1 hal yang belum muncul di CV.",
  "はい。実[じつ]は、毎日[まいにち]寝[ね]る前[まえ]に日本[にほん]のニュースを聞[き]いて、聞[き]き取[と]りの練習[れんしゅう]をしています。日本[にほん]の生活[せいかつ]に早[はや]く慣[な]れるように、これからも続[つづ]けます。",
  "Ya. Sebenarnya, setiap malam sebelum tidur saya mendengarkan berita Jepang untuk latihan mendengar. Supaya cepat terbiasa dengan kehidupan di Jepang, saya akan terus melakukannya.",
  "Contoh lain: SIM, bisa berenang, pengalaman relawan, bisa bahasa Inggris. Jangan jawab いいえ, 特にありません.");

/* ---------------- 最後の質問 ---------------- */
q("saigo", 1, "最後[さいご]に、何[なに]か質問[しつもん]はありますか。", "Terakhir, apakah ada pertanyaan?",
  [["質問", "pertanyaan"], ["準備しておく", "menyiapkan sebelumnya"], ["勉強しておく", "mempelajari lebih dulu"]],
  "Penutup wawancara. Siapkan 1 pertanyaan yang menunjukkan semangat — bukan soal gaji/libur.",
  "はい、一[ひと]つあります。入社[にゅうしゃ]までに、勉強[べんきょう]しておいたほうがいいことはありますか。",
  "Ya, ada satu. Sebelum mulai bekerja, apakah ada hal yang sebaiknya saya pelajari terlebih dahulu?",
  "Pertanyaan bagus: persiapan sebelum masuk, suasana kerja, cara pelatihan. Tutup dengan: 本日はありがとうございました。");
q("saigo", 1, "今日[きょう]の面接[めんせつ]はどうでしたか。", "Bagaimana wawancara hari ini?",
  [["緊張する", "gugup"], ["精一杯", "sekuat tenaga"], ["機会", "kesempatan"]],
  "Pertanyaan ringan di akhir. Tutup dengan sopan dan berterima kasih.",
  "とても緊張[きんちょう]しましたが、精一杯[せいいっぱい]お話[はな]ししました。今日[きょう]は貴重[きちょう]な機会[きかい]をいただき、ありがとうございました。",
  "Saya sangat gugup, tapi sudah bicara sebaik mungkin. Terima kasih atas kesempatan berharga hari ini.",
  "Kalimat penutup standar: 本日は貴重なお時間をいただき、ありがとうございました。");

module.exports = { KAT, Q };
