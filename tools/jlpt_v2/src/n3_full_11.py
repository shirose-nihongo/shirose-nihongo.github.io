# -*- coding: utf-8 -*-
"""Sumber N3 Full Exam 11 versi 2 (pilot audit kualitas, 2026-11).

Dibangun oleh:  python tools/jlpt_v2/build_full_v2.py n3 11
Hasil        :  jlpt/n3/full-11.v2.json   (file lama full-11.json TIDAK diubah)
Standar      :  docs/jlpt-audit/RUBRIK-QC.md

Format item bahasa:
  q, opts, ans (0-based), tr (terjemahan), why (alasan), o (alasan per pilihan, urut opts), poin (opsional)
Kumitate: frag (potongan), order (indeks frag sesuai urutan benar), star (posisi ★, 1-based), head/tail kalimat.
"""

CHOUKAI_PK = 211   # choukai/paket/n3-p211.json (naskah: tools/choukai-src/n3-p211.txt)

# ------------------------------------------------------------------ 漢字読み (7)
yomi = [
    dict(q="駅前の<u>工事</u>は来月まで続くそうだ。", opts=["こうじ", "こうし", "ごうじ", "くうじ"], ans=0,
         tr="Katanya pekerjaan konstruksi di depan stasiun berlanjut sampai bulan depan.",
         why="工事 = こう（工）＋じ（事）. 事 di sini dibaca じ, bukan し.",
         o=["Benar: こうじ (pekerjaan konstruksi).", "こうし tanpa dakuten; 事 tidak dibaca し dalam kata ini.",
            "ごうじ: 工 tidak dibaca ごう.", "くうじ: 工 kadang dibaca く (大工), tetapi tidak dalam 工事 dan tidak panjang."]),
    dict(q="会議で使う資料が全員に<u>配られた</u>。", opts=["くばられた", "くらべられた", "くわえられた", "かぞえられた"], ans=0,
         tr="Materi rapat dibagikan kepada semua orang.",
         why="配る（くばる）= membagikan; bentuk pasif 配られた.",
         o=["Benar: 配られた = dibagikan.", "くらべられた = 比べられた (dibandingkan).",
            "くわえられた = 加えられた (ditambahkan).", "かぞえられた = 数えられた (dihitung)."]),
    dict(q="兄は食品会社で<u>営業</u>の仕事をしている。", opts=["えいぎょう", "えいごう", "えいきょう", "えぎょう"], ans=0,
         tr="Kakak laki-laki saya bekerja di bagian penjualan di perusahaan makanan.",
         why="営業 = えい＋ぎょう (業 dibaca ぎょう, seperti 授業・卒業).",
         o=["Benar: えいぎょう (penjualan/bisnis).", "えいごう: 業 tidak dibaca ごう.",
            "えいきょう = 影響 (pengaruh), kata lain.", "えぎょう: 営 dibaca えい (vokal panjang)."]),
    dict(q="卵を<u>割って</u>、ボウルに入れてください。", opts=["わって", "さいて", "きって", "けずって"], ans=0,
         tr="Pecahkan telur, lalu masukkan ke mangkuk.",
         why="割る（わる）= memecahkan. 卵を割る adalah kolokasi tetap.",
         o=["Benar: 割って = memecahkan.", "さいて = 裂いて (merobek).",
            "きって = 切って (memotong).", "けずって = 削って (meraut/mengikis)."]),
    dict(q="出発の前に、もう一度持ち物を<u>確認</u>しましょう。", opts=["かくにん", "かくいん", "こうにん", "かくじん"], ans=0,
         tr="Sebelum berangkat, mari periksa barang bawaan sekali lagi.",
         why="確認 = かく（確）＋にん（認）.",
         o=["Benar: かくにん (memastikan/mengecek).", "かくいん: 認 dibaca にん, bukan いん.",
            "こうにん = 公認 (resmi diakui), kata lain.", "かくじん: 認 tidak dibaca じん."]),
    dict(q="ホテルの部屋から見える<u>景色</u>がとてもきれいだった。", opts=["けしき", "けいしき", "けいしょく", "けしょく"], ans=0,
         tr="Pemandangan yang terlihat dari kamar hotel sangat indah.",
         why="景色 dibaca khusus けしき (bukan けいしき).",
         o=["Benar: けしき (pemandangan).", "けいしき = 形式 (bentuk/formalitas) — jebakan vokal panjang.",
            "けいしょく = 軽食 (makanan ringan).", "けしょく: tidak ada kata ini."]),
    dict(q="<u>普段</u>は自転車で会社に通っています。", opts=["ふだん", "ふたん", "ふうだん", "ぶだん"], ans=0,
         tr="Biasanya saya pergi ke kantor dengan sepeda.",
         why="普段 = ふ＋だん (段 dibaca だん).",
         o=["Benar: ふだん (biasanya, sehari-hari).", "ふたん = 負担 (beban), kata lain.",
            "ふうだん: 普 dibaca ふ (pendek).", "ぶだん: 普 tidak dibaca ぶ."]),
]

# ------------------------------------------------------------------ 表記 (6)
hyouki = [
    dict(q="道が混んでいるので、<u>いそいだ</u>ほうがいい。", opts=["急いだ", "忙いだ", "走いだ", "速いだ"], ans=0,
         tr="Jalanan macet, jadi sebaiknya bergegas.", why="いそぐ ditulis 急ぐ.",
         o=["Benar: 急いだ.", "忙 (いそが-しい) bentuknya mirip tapi untuk 忙しい (sibuk).",
            "走 dibaca はし-る (berlari).", "速 dibaca はや-い (cepat)."]),
    dict(q="この荷物を二階まで<u>はこんで</u>もらえますか。", opts=["運んで", "連んで", "送んで", "達んで"], ans=0,
         tr="Bisakah barang ini dibawa sampai lantai dua?", why="はこぶ ditulis 運ぶ.",
         o=["Benar: 運んで.", "連 bentuknya mirip 運, tapi dibaca つ-れる (membawa orang).",
            "送 dibaca おく-る (mengirim).", "達 tidak dipakai untuk はこぶ."]),
    dict(q="毎朝、新聞を<u>くばる</u>アルバイトをしている。", opts=["配る", "記る", "改る", "届る"], ans=0,
         tr="Setiap pagi saya kerja sambilan membagikan koran.", why="くばる ditulis 配る.",
         o=["Benar: 配る.", "記 (しる-す) bagian kanannya mirip 配, tapi artinya mencatat.",
            "改 (あらた-める) = mengubah.", "届 (とど-ける) = mengantarkan; tidak dibaca くばる."]),
    dict(q="父は駅の近くの病院に<u>つとめて</u>いる。", opts=["勤めて", "務めて", "努めて", "働めて"], ans=0,
         tr="Ayah bekerja di rumah sakit dekat stasiun.",
         why="Bekerja di suatu tempat (〜に勤める) ditulis 勤める.",
         o=["Benar: 勤めて (bekerja di tempat kerja).", "務める = menjabat peran (司会を務める).",
            "努める = berusaha keras (努力).", "働 dibaca はたら-く, tidak ada 働める."]),
    dict(q="来週の会議の<u>しりょう</u>を準備する。", opts=["資料", "試料", "資科", "史料"], ans=0,
         tr="Menyiapkan materi rapat minggu depan.", why="Materi/dokumen = 資料.",
         o=["Benar: 資料 (materi/dokumen).", "試料 = sampel uji laboratorium.",
            "資科: 科 bentuknya mirip 料, kata ini tidak ada.", "史料 = sumber sejarah."]),
    dict(q="辞書で漢字の<u>せいかく</u>な読み方を調べた。", opts=["正確", "性格", "正格", "生確"], ans=0,
         tr="Saya mengecek cara baca kanji yang tepat di kamus.", why="Tepat/akurat = 正確.",
         o=["Benar: 正確 (tepat).", "性格 = sifat/karakter orang — homofon.",
            "正格: tidak dipakai.", "生確: tidak ada."]),
]

# ------------------------------------------------------------------ 文脈規定 (6)
bunmyaku = [
    dict(q="雨の日は道が（　　　）やすいので、気をつけて歩いてください。", opts=["すべり", "こぼれ", "ころがり", "ずれ"], ans=0,
         tr="Saat hujan jalan mudah licin, jadi berjalanlah dengan hati-hati.", why="道がすべる = jalan licin.",
         o=["Benar: すべりやすい = mudah licin.", "こぼれる = tumpah (cairan).",
            "ころがる = menggelinding (bola, batu).", "ずれる = bergeser dari posisinya."]),
    dict(q="部長に頼まれた資料は、会議の前にもう一度（　　　）しておいたほうがいい。", opts=["チェック", "サイン", "ノック", "キャンセル"], ans=0,
         tr="Materi yang diminta manajer sebaiknya dicek sekali lagi sebelum rapat.", why="資料をチェックする = memeriksa materi.",
         o=["Benar: チェック (memeriksa).", "サイン = tanda tangan; materi tidak 'ditandatangani' untuk persiapan.",
            "ノック = mengetuk pintu.", "キャンセル = membatalkan; tidak cocok dengan 'sebelum rapat'."]),
    dict(q="試験に落ちて（　　　）している弟を、家族みんなではげました。", opts=["がっかり", "うっかり", "すっきり", "のんびり"], ans=0,
         tr="Seluruh keluarga menyemangati adik yang kecewa karena gagal ujian.", why="Gagal ujian → kecewa = がっかり.",
         o=["Benar: がっかり = kecewa.", "うっかり = tidak sengaja/lalai.",
            "すっきり = lega/segar.", "のんびり = santai."]),
    dict(q="このアパートは駅から少し遠いですが、（　　　）は安いです。", opts=["家賃", "料金", "代金", "税金"], ans=0,
         tr="Apartemen ini agak jauh dari stasiun, tetapi sewanya murah.", why="Biaya sewa tempat tinggal = 家賃.",
         o=["Benar: 家賃 (sewa rumah).", "料金 = tarif layanan (listrik, taksi).",
            "代金 = harga barang yang dibeli.", "税金 = pajak."]),
    dict(q="友達の結婚式で（　　　）を頼まれたので、何を話すか考えている。", opts=["スピーチ", "アナウンス", "インタビュー", "ニュース"], ans=0,
         tr="Saya diminta memberi sambutan di pernikahan teman, jadi sedang memikirkan apa yang akan dibicarakan.",
         why="Bicara di depan tamu pernikahan = スピーチ.",
         o=["Benar: スピーチ (pidato/sambutan).", "アナウンス = pengumuman (stasiun, bandara).",
            "インタビュー = wawancara (ada penanya).", "ニュース = berita."]),
    dict(q="寒くなってきたので、そろそろ冬の服を（　　　）ことにした。", opts=["出す", "開ける", "起こす", "上げる"], ans=0,
         tr="Karena mulai dingin, saya memutuskan mengeluarkan baju musim dingin.", why="冬の服を出す = mengeluarkan baju dari lemari.",
         o=["Benar: 出す (mengeluarkan).", "開ける = membuka (pintu, kotak), bukan baju.",
            "起こす = membangunkan.", "上げる = menaikkan."]),
]

# ------------------------------------------------------------------ 言い換え類義 (5)
iikae = [
    dict(q="この仕事は<u>たいてい</u>午後六時ごろに終わる。", opts=["ほとんどいつも", "ときどき", "かならず", "たまに"], ans=0,
         tr="Pekerjaan ini biasanya selesai sekitar jam 6 sore.", why="たいてい = hampir selalu (ほとんどいつも).",
         o=["Benar: ほとんどいつも = hampir selalu.", "ときどき = kadang-kadang (lebih jarang).",
            "かならず = pasti/selalu (100%), lebih kuat dari たいてい.", "たまに = sesekali."]),
    dict(q="会議の時間が<u>変更</u>になった。", opts=["変わった", "決まった", "知らされた", "書かれた"], ans=0,
         tr="Waktu rapat diubah.", why="変更になる = berubah (変わる).",
         o=["Benar: 変わった = berubah.", "決まった = diputuskan (belum tentu berubah).",
            "知らされた = diberitahukan.", "書かれた = ditulis."]),
    dict(q="兄と弟は、顔が<u>そっくり</u>だ。", opts=["とても似ている", "少し似ている", "全然違う", "とてもかわいい"], ans=0,
         tr="Kakak dan adik itu wajahnya sangat mirip.", why="そっくり = sangat mirip.",
         o=["Benar: とても似ている.", "少し似ている = agak mirip; そっくり jauh lebih kuat.",
            "全然違う = sama sekali berbeda (lawannya).", "とてもかわいい = sangat lucu (tidak terkait kemiripan)."]),
    dict(q="彼女の説明は<u>あいまい</u>だった。", opts=["はっきりしなかった", "長かった", "正しかった", "わかりやすかった"], ans=0,
         tr="Penjelasannya tidak jelas (samar).", why="あいまい = tidak jelas/samar.",
         o=["Benar: はっきりしなかった.", "長かった = panjang (bukan soal kejelasan).",
            "正しかった = benar.", "わかりやすかった = mudah dipahami (kebalikannya)."]),
    dict(q="出かける前に、窓が閉まっているか<u>確かめた</u>。", opts=["チェックした", "開けた", "閉めた", "ふいた"], ans=0,
         tr="Sebelum keluar, saya memastikan jendela sudah tertutup.", why="確かめる = memastikan/mengecek.",
         o=["Benar: チェックした.", "開けた = membuka.", "閉めた = menutup (tindakan, bukan mengecek).", "ふいた = mengelap."]),
]

# ------------------------------------------------------------------ 用法 (5): q = kata; opts = 4 kalimat
youhou = [
    dict(q="さっそく", opts=["新しいパソコンが届いたので、さっそく使ってみた。", "毎朝さっそく起きて、ジョギングをしている。",
                         "電車がさっそく出発したので、乗れなかった。", "弟は一年でさっそく背が高くなった。"], ans=0,
         tr="Laptop baru datang, jadi langsung saya coba.", why="さっそく = segera melakukan sesuatu yang sudah ditunggu/diterima.",
         o=["Benar: langsung mencoba barang yang baru datang.", "Bangun pagi-pagi = 早く起きて, bukan さっそく.",
            "Kereta berangkat lebih cepat = 早く/もう出発した.", "Tumbuh cepat = ずいぶん/急に; さっそく hanya untuk tindakan yang disengaja."]),
    dict(q="たまる", opts=["机の上にほこりがたまっている。", "駅の前にバスがたまっていて、乗れなかった。",
                       "明日の天気がたまって、雨になるそうだ。", "旅行が楽しみで、気持ちがたまっている。"], ans=0,
         tr="Debu menumpuk di atas meja.", why="たまる = sedikit demi sedikit menumpuk (ほこり、お金、仕事).",
         o=["Benar: ほこりがたまる.", "Bus yang berjejer = 並んでいて/止まっていて.",
            "Cuaca tidak 'menumpuk'; yang benar 天気が崩れて.", "Perasaan senang tidak 'menumpuk'; yang benar わくわくしている."]),
    dict(q="しめきり", opts=["レポートのしめきりは来週の金曜日だ。", "店のしめきりは夜十時なので、まだ買い物ができる。",
                        "窓のしめきりが悪くて、風が入ってくる。", "彼はしめきりのいい人で、約束を必ず守る。"], ans=0,
         tr="Tenggat laporan adalah Jumat minggu depan.", why="しめきり（締め切り）= batas waktu penyerahan.",
         o=["Benar: tenggat laporan.", "Jam tutup toko = 閉店時間.",
            "Jendela yang tidak rapat = 窓の閉まりが悪い.", "Orang yang tepat janji = 時間を守る人; しめきり bukan sifat orang."]),
    dict(q="ゆずる", opts=["電車でお年寄りに席をゆずった。", "道に迷った人に、駅までの道をゆずった。",
                       "先生に質問をゆずって、答えてもらった。", "毎月、母に手紙をゆずっている。"], ans=0,
         tr="Saya memberikan tempat duduk kepada orang tua di kereta.", why="席をゆずる = memberikan (mengalah) tempat duduk.",
         o=["Benar: 席をゆずる.", "Menunjukkan jalan = 道を教えた.",
            "Bertanya = 質問をして.", "Mengirim surat = 手紙を送っている/書いている."]),
    dict(q="くわしい", opts=["田中さんは日本の歴史にくわしい。", "この料理は塩がくわしくて、少しからい。",
                        "昨日はくわしい雨が一日中降った。", "彼の部屋は、いつもくわしく片付いている。"], ans=0,
         tr="Tanaka paham betul tentang sejarah Jepang.", why="〜にくわしい = paham/mengetahui secara mendalam.",
         o=["Benar: 歴史にくわしい.", "Terlalu asin = 塩が多くて/塩辛くて.",
            "Hujan deras = 激しい雨/強い雨.", "Rapi = きれいに片付いている."]),
]

# ------------------------------------------------------------------ 文法形式の判断 (12)
keishiki = [
    dict(q="林「この店、いつも混んでるね。」<br>山田「うん。でも、平日の昼（　　　）、すぐ入れるみたいだよ。」", opts=["なら", "ほど", "こそ", "まで"], ans=0,
         tr="Hayashi: Toko ini selalu ramai ya. Yamada: Iya. Tapi kalau siang hari kerja, sepertinya bisa langsung masuk.",
         why="〜なら = kalau (menyebut kondisi tertentu sebagai topik).",
         o=["Benar: 平日の昼なら = kalau siang hari kerja.", "〜ほど = sampai sejauh/sekitar; tidak membentuk syarat.",
            "〜こそ = justru (penekanan); 'justru siang hari kerja' tidak cocok dengan でも.", "〜まで = sampai; tidak bermakna."], poin="〜なら"),
    dict(q="駅前に新しくできたこの店の料理は、値段が安い（　　　）量も多くて、とてもおいしい。", opts=["わりに", "くせに", "せいで", "おかげで"], ans=0,
         tr="Masakan toko yang baru buka di depan stasiun ini, untuk harga semurah itu, porsinya banyak dan sangat enak.", why="〜わりに = tidak sebanding dengan yang diperkirakan dari…",
         o=["Benar: 安いわりにおいしい.", "〜くせに = mengkritik orang (nada negatif).",
            "〜せいで = penyebab hal buruk; enak bukan hal buruk.", "〜おかげで = berkat; 'enak berkat murah' tidak logis."], poin="〜わりに"),
    dict(q="高校の文化祭でみんなで歌ったこの歌を聞く（　　　）、楽しかった学生時代のことを思い出す。", opts=["たびに", "あいだに", "ところに", "までに"], ans=0,
         tr="Setiap kali mendengar lagu yang kami nyanyikan bersama di festival sekolah SMA, saya teringat masa sekolah yang menyenangkan.", why="〜たびに = setiap kali.",
         o=["Benar: 聞くたびに.", "〜あいだに = dalam rentang waktu (biasanya dengan ている).",
            "〜ところに = tepat saat (situasi yang datang mengganggu).", "〜までに = batas waktu."], poin="〜たびに"),
    dict(q="母「もう九時よ。宿題、終わったの？」<br>子「今、やっている（　　　）だよ。あと少しで終わるから。」", opts=["ところ", "ばかり", "はず", "こと"], ans=0,
         tr="Ibu: PR sudah selesai? Anak: Sedang dikerjakan sekarang.", why="〜ているところだ = sedang (tepat di tengah) melakukan.",
         o=["Benar: やっているところ.", "〜ばかり tidak dipakai setelah ている dengan arti ini.",
            "〜はず = seharusnya (dugaan) — aneh untuk perbuatan sendiri.", "〜ことだ = nasihat; tidak cocok."], poin="〜ているところだ"),
    dict(q="昨日は仕事が多くて大変だったが、先輩が手伝ってくれた（　　　）、予定より一時間も早く終わった。", opts=["おかげで", "せいで", "かわりに", "くせに"], ans=0,
         tr="Kemarin pekerjaan banyak dan berat, tetapi berkat bantuan senior, selesai satu jam lebih cepat dari rencana.", why="〜おかげで = berkat (hasil baik).",
         o=["Benar: おかげで.", "〜せいで = gara-gara (hasil buruk); selesai cepat itu baik.",
            "〜かわりに = sebagai ganti.", "〜くせに = padahal (mencela)."], poin="〜おかげで"),
    dict(q="健康のために、エレベーターではなく、なるべく階段を使う（　　　）。", opts=["ようにしている", "ことになる", "ところだ", "はずだ"], ans=0,
         tr="Demi kesehatan, saya berusaha sebisa mungkin memakai tangga, bukan lift.", why="〜ようにしている = membiasakan diri/berusaha.",
         o=["Benar: なるべく〜ようにしている.", "〜ことになる = akan diputuskan/menjadi (bukan kebiasaan sendiri).",
            "〜ところだ = akan segera; tidak cocok dengan なるべく.", "〜はずだ = seharusnya (dugaan)."], poin="〜ようにしている"),
    dict(q="田中さんは今日から一週間、夏休みを取っているから、明日の会議には来ない（　　　）。", opts=["はずだ", "ところだ", "ことだ", "ばかりだ"], ans=0,
         tr="Tanaka mengambil cuti musim panas seminggu mulai hari ini, jadi seharusnya tidak datang ke rapat besok.", why="〜はずだ = dugaan kuat berdasarkan alasan.",
         o=["Benar: 来ないはずだ.", "〜ところだ = akan/sedang; tidak cocok dengan bentuk ない.",
            "〜ことだ = sebaiknya (nasihat).", "〜ばかりだ = makin…/baru saja; tidak cocok."], poin="〜はずだ"),
    dict(q="同じアジアの国でも、国（　　　）、あいさつのしかたや食事のマナーがずいぶん違う。", opts=["によって", "について", "にとって", "に対して"], ans=0,
         tr="Meskipun sama-sama negara Asia, cara memberi salam dan tata krama makan cukup berbeda tergantung negaranya.", why="〜によって違う = berbeda tergantung….",
         o=["Benar: 国によって違う.", "〜について = tentang.", "〜にとって = bagi (sudut pandang).", "〜に対して = terhadap."], poin="〜によって"),
    dict(q="先週買った本棚を説明書の（　　　）組み立てたのに、なぜか少しぐらぐらする。", opts=["とおりに", "ために", "かわりに", "ほかに"], ans=0,
         tr="Rak buku yang saya beli minggu lalu sudah dirakit sesuai buku petunjuk, tetapi entah kenapa agak goyang.", why="〜のとおりに = sesuai dengan.",
         o=["Benar: 説明書のとおりに.", "〜のために = demi; tidak logis.",
            "〜のかわりに = sebagai ganti buku petunjuk.", "〜のほかに = selain."], poin="〜とおりに"),
    dict(q="今日は朝から会議やお客さんの対応が続いて、昼ご飯を食べる時間（　　　）なかった。", opts=["さえ", "まで", "だけ", "ほど"], ans=0,
         tr="Hari ini sejak pagi rapat dan melayani tamu terus, sampai-sampai waktu makan siang pun tidak ada.", why="〜さえ〜ない = bahkan … pun tidak.",
         o=["Benar: 時間さえなかった.", "〜まで juga 'bahkan', tapi untuk hal yang melampaui batas; tidak wajar di sini.",
            "〜だけなかった = hanya itu yang tidak ada (makna aneh).", "〜ほどなかった = tidak sebanyak itu."], poin="〜さえ"),
    dict(q="弟は母に部屋を片付けなさいと言われても、ぜんぜん（　　　）。",
         opts=["片付けようとしない", "片付けるはずがない", "片付けることはない", "片付けてしまった"], ans=0,
         tr="Meski disuruh ibu merapikan kamar, adik sama sekali tidak mau merapikannya.", why="〜ようとしない = tidak mau mencoba/tidak berusaha (orang lain).",
         o=["Benar: 片付けようとしない.", "〜はずがない = mustahil (dugaan), tidak cocok dengan kebiasaan yang diamati.",
            "〜ことはない = tidak perlu.", "〜てしまった = sudah selesai; bertentangan dengan ぜんぜん."], poin="〜ようとしない"),
    dict(q="ホテルの受付で<br>店員「重いですから、お荷物はお部屋まで（　　　）。」", opts=["お持ちします", "お持ちになります", "持っていらっしゃいます", "持ってもらいます"], ans=0,
         tr="Di resepsionis hotel. Pegawai: Barangnya berat, jadi akan saya bawakan sampai kamar.", why="Tindakan diri sendiri untuk tamu → 謙譲語 お〜します.",
         o=["Benar: お持ちします (kenjougo).", "お持ちになります = sonkeigo untuk tindakan tamu.",
            "持っていらっしゃいます = sonkeigo (tamu sedang membawa).", "持ってもらいます = menyuruh orang lain membawakan."], poin="謙譲語 お〜する"),
]

# ------------------------------------------------------------------ 文の組み立て (4)
kumitate = [
    dict(head="資料は", tail="ください。", frag=["前に", "始まる", "会議が", "配っておいて"], order=[2, 1, 0, 3], star=3,
         tr="Tolong bagikan materinya sebelum rapat dimulai.", poin="〜前に + 〜ておく"),
    dict(head="子どものころ", tail="、今でもよく覚えている。", frag=["行った", "家族で", "ことは", "海の"], order=[1, 0, 3, 2], star=2,
         tr="Laut yang saya kunjungi bersama keluarga waktu kecil masih saya ingat dengan baik.", poin="Klausa penjelas kata benda (家族で行った海)"),
    dict(head="雨が", tail="、試合は予定どおり行われた。", frag=["いた", "降って", "にもかかわらず", "強く"], order=[3, 1, 0, 2], star=4,
         tr="Meskipun hujan turun deras, pertandingan tetap diadakan sesuai jadwal.", poin="〜にもかかわらず"),
    dict(head="説明を", tail="、わからないところがあった。", frag=["何度", "聞いた", "も", "のに"], order=[0, 2, 1, 3], star=3,
         tr="Padahal sudah berkali-kali mendengar penjelasan, masih ada bagian yang tidak saya mengerti.", poin="何度も + 〜のに"),
]

# ------------------------------------------------------------------ 文章の文法 (2) — memakai bacaan p0
bunshou = [
    dict(pid="p0", q="【46】に入るものはどれか。", opts=["でも", "だから", "それに", "つまり"], ans=0,
         why="Sebelumnya: belanja sulit karena tidak paham bahasa Jepang. Sesudahnya: pegawai selalu bicara pelan (hal yang menolong). Hubungan berlawanan → でも.",
         o=["Benar: でも (tetapi) — kontras.", "だから = karena itu; pegawai bicara pelan bukan akibat penulis kesulitan.",
            "それに = selain itu (menambah hal sejenis), padahal isinya berlawanan.", "つまり = dengan kata lain (merangkum)."]),
    dict(pid="p0", q="【47】に入るものはどれか。", opts=["なりました", "させました", "なるでしょう", "してもらいました"], ans=0,
         why="Perasaan penulis sendiri pada saat itu (lampau): うれしくなりました.",
         o=["Benar: うれしくなりました = menjadi senang.", "うれしくさせました = membuat (orang lain) senang — subjeknya salah.",
            "うれしくなるでしょう = dugaan masa depan; ceritanya sudah terjadi.", "うれしくしてもらいました = tidak gramatikal."]),
]

# ------------------------------------------------------------------ 読解: bacaan
PASSAGES = {
    "p0": dict(jenis="Teks untuk 文章の文法 (作文)", jp=(
        "<b>一年間の日本の生活</b><br>"
        "日本に来て、もうすぐ一年になります。来たばかりのころは日本語がほとんどわからず、買い物をするのも大変でした。"
        "【46】、近所のスーパーの店員さんは、いつもゆっくり話してくれました。そのおかげで、少しずつ店で話せるようになりました。<br>"
        "先月、国から来た友達を、そのスーパーに連れて行きました。友達は日本語ができないので、私が通訳をしました。"
        "店員さんは「日本語、上手になりましたね」と言ってくれました。一年前の自分を思い出して、とてもうれしく【47】。"),
        id="Hampir setahun saya di Jepang. Awalnya hampir tidak paham bahasa Jepang, belanja pun sulit. 【Tetapi】 pegawai supermarket dekat rumah selalu bicara pelan, sehingga lambat laun saya bisa bicara di toko. Bulan lalu saya mengajak teman dari negara saya ke supermarket itu dan menjadi penerjemahnya. Pegawai berkata 'Bahasa Jepangmu sudah jago ya.' Teringat diri setahun lalu, saya 【menjadi】 sangat senang."),
    "p1": dict(jenis="Teks pendek (内容理解・短文) — email", jp=(
        "営業部の皆さん<br><br>"
        "来週の水曜日に予定していた営業会議は、部長の出張のため、木曜日の午後二時からに変更になりました。"
        "場所は変わらず、三階の第二会議室です。<br>"
        "なお、会議で使う資料は前の日までに各自で印刷し、当日持ってきてください。"
        "木曜日の午後に都合が悪い人は、明日中に山本までメールで連絡してください。<br><br>山本"),
        id="Kepada staf penjualan: Rapat yang dijadwalkan Rabu minggu depan dipindah ke Kamis jam 2 siang karena manajer dinas. Tempat tetap ruang rapat 2 lantai 3. Materi dicetak sendiri paling lambat sehari sebelumnya dan dibawa saat rapat. Yang tidak bisa Kamis siang, kabari Yamamoto lewat email paling lambat besok."),
    "p2": dict(jenis="Teks pendek (内容理解・短文) — esai", jp=(
        "小さいころ、私は野菜が大嫌いだった。特にピーマンは、においをかぐだけでいやだった。"
        "ところが、大学生になって一人で暮らし始め、近所の人に畑を借りて野菜を育ててみると、考えが変わった。"
        "毎日水をやり、少しずつ大きくなるのを見ていると、とれたピーマンを捨てる気にはなれなかった。"
        "思い切って食べてみると、思っていたほど苦くなかった。今では、ピーマンは好きな野菜の一つである。"),
        id="Waktu kecil saya benci sayur, terutama paprika hijau. Saat kuliah dan tinggal sendiri, saya meminjam ladang tetangga dan menanam sayur. Setelah setiap hari menyiram dan melihatnya tumbuh, saya tidak tega membuang paprika hasil panen. Saat nekat dimakan, ternyata tidak sepahit dugaan. Sekarang paprika jadi salah satu sayur favorit."),
    "p3": dict(jenis="Teks pendek (内容理解・短文) — pengumuman", jp=(
        "<b>市民プールをご利用の皆様へ</b><br>"
        "七月一日から八月三十一日までは、利用者が多いため、営業時間を午前九時から午後八時までに延長します。"
        "ただし、毎週月曜日は清掃のため休みです。月曜日が祝日の場合は営業し、次の日を休みとします。"
        "また、小学生以下のお子様は、大人と一緒でなければ利用できませんので、ご注意ください。<br>"
        "みどり市　スポーツ課"),
        id="Untuk pengguna kolam renang kota: 1 Juli–31 Agustus jam buka diperpanjang 09.00–20.00. Tetapi setiap Senin tutup untuk pembersihan; jika Senin hari libur nasional, kolam buka dan tutup keesokan harinya. Anak SD ke bawah hanya boleh masuk bersama orang dewasa."),
    "p4": dict(jenis="Teks pendek (内容理解・短文) — opini", jp=(
        "最近、会議の資料を紙で配らず、各自がパソコンやタブレットで見る会社が増えている。"
        "紙を使わないので費用が減るし、資料をなくす心配もない。しかし、画面で読むと大事なところを見落としやすい、という人もいる。"
        "私は、全部を画面にするのではなく、細かく読む必要がある資料だけは紙で配るのがいいと思う。"
        "道具は、目的に合わせて選ぶべきだ。"),
        id="Makin banyak perusahaan yang tidak membagikan materi rapat di kertas, melainkan dilihat di laptop/tablet. Biaya turun dan tidak takut hilang, tetapi ada yang bilang di layar mudah terlewat bagian penting. Menurut saya, materi yang perlu dibaca teliti saja yang dibagikan di kertas. Alat harus dipilih sesuai tujuan."),
    "p5": dict(jenis="Teks menengah (内容理解・中文)", jp=(
        "先月、駅前の古い商店街に、小さな本屋が開いた。店に置いてある本は二千冊ほどで、大きな書店と比べるとずっと少ない。"
        "しかし、この店はいつも客でにぎわっている。<br>"
        "理由の一つは、店長が選んだ本に、手書きのカードが付いていることだ。カードには、その本のどこがおもしろいのか、"
        "どんな人に読んでほしいのかが、短い言葉で書かれている。<u>それを読んでいるうちに</u>、今まで興味がなかった分野の本でも、つい手に取ってしまう。<br>"
        "もう一つは、店の奥に、本を読んだ人どうしが話せるスペースがあることだ。毎週土曜日の夜には、同じ本を読んだ人が集まって、"
        "感想を話し合う会が開かれる。参加者の多くは、最初は一人で来た人たちだそうだ。<br>"
        "インターネットで、いつでもすぐに本が買える時代である。それでも人がこの店に足を運ぶのは、"
        "本だけでなく、新しい本や人との出会いを求めているからではないだろうか。"),
        id="Bulan lalu toko buku kecil dibuka di pertokoan tua depan stasiun. Bukunya hanya sekitar 2.000, jauh lebih sedikit dari toko besar, tapi selalu ramai. Pertama, buku pilihan pemilik toko diberi kartu tulisan tangan tentang bagian menarik dan untuk siapa buku itu cocok; saat membacanya, orang jadi mengambil buku dari bidang yang tadinya tidak diminati. Kedua, di bagian belakang ada ruang untuk berbincang; tiap Sabtu malam pembaca buku yang sama berkumpul bertukar kesan, kebanyakan awalnya datang sendirian. Di zaman buku bisa dibeli kapan saja lewat internet, orang tetap datang mungkin karena mencari pertemuan dengan buku dan orang baru."),
    "p6": dict(jenis="Teks panjang (内容理解・長文)", jp=(
        "私は三年前から、日本の会社で働いている。来日したばかりのころ、いちばん驚いたのは、電車が時刻表どおりに来ることだった。"
        "私の国では、電車が十分や二十分遅れるのは普通で、だれも気にしない。ところが日本では、一分遅れただけで、駅員が「ご迷惑をおかけしました」と謝るのだ。<br>"
        "会社でも同じだった。会議は時間ちょうどに始まり、決められた時間に終わる。最初の一か月、私は何度か会議に数分遅れて、そのたびに先輩に注意された。"
        "正直に言うと、<u>①そのときは少しきゅうくつに感じた</u>。数分ぐらい遅れても、仕事の結果には関係ないだろうと思っていたからだ。<br>"
        "考えが変わったのは、あるプロジェクトのリーダーを任されたときだった。メンバーが一人でも遅れると、全員がその人を待たなければならない。"
        "十人の会議で一人が五分遅れれば、合わせて五十分の時間が無駄になる。時間を守ることは、自分のためではなく、周りの人の時間を大切にすることなのだと、そのとき初めて気がついた。<br>"
        "とはいえ、私は日本のやり方がすべて正しいとは思わない。予定どおりに進めることばかり気にして、途中で出たいい意見を「時間がないから」と次の会議に回してしまうこともある。"
        "時間を守ることは大切だが、それはあくまでも、よい仕事をするための手段であって、目的ではない。<u>②このこと</u>を、これからも忘れないでいたい。"),
        id="Sudah tiga tahun saya bekerja di perusahaan Jepang. Yang paling mengejutkan saat baru datang: kereta datang tepat jadwal; di negara saya terlambat 10–20 menit itu biasa, sedangkan di Jepang terlambat 1 menit saja petugas minta maaf. Di kantor sama: rapat mulai dan selesai tepat waktu. Bulan pertama saya beberapa kali terlambat beberapa menit dan ditegur senior. Jujur, ① saat itu saya merasa agak terkekang, karena mengira terlambat sedikit tidak memengaruhi hasil kerja. Pandangan saya berubah ketika dipercaya menjadi pemimpin proyek: kalau satu orang terlambat, semua harus menunggu; satu orang telat 5 menit di rapat 10 orang berarti 50 menit terbuang. Saya sadar menepati waktu berarti menghargai waktu orang lain. Namun, saya tidak menganggap cara Jepang selalu benar: karena terlalu memikirkan jadwal, kadang ide bagus ditunda ke rapat berikutnya 'karena tidak ada waktu'. Menepati waktu penting, tetapi itu hanya sarana untuk kerja yang baik, bukan tujuan. ② Hal ini ingin terus saya ingat."),
    "p7": dict(jenis="Mencari informasi (情報検索)", jp=(
        "<b>さくら料理教室　十月のクラス案内</b><br>"
        "<table class='jx-table'><tr><th>クラス</th><th>曜日・時間</th><th>料金（1回）</th><th>内容</th></tr>"
        "<tr><td>A　和食の基本</td><td>火曜　10:00〜12:00</td><td>2,500円</td><td>だしの取り方、みそ汁</td></tr>"
        "<tr><td>B　家庭のパン</td><td>木曜　18:30〜20:30</td><td>3,000円</td><td>食パン、ロールパン</td></tr>"
        "<tr><td>C　簡単おもてなし料理</td><td>土曜　10:00〜12:30</td><td>3,500円</td><td>パーティー料理</td></tr>"
        "<tr><td>D　親子でクッキング</td><td>日曜　14:00〜16:00</td><td>親子2人で4,000円</td><td>クッキー、ピザ（小学生と保護者）</td></tr></table>"
        "・材料費は料金に含まれています。<br>"
        "・初めての方は、1回目の料金が500円引きになります。<br>"
        "・エプロンとタオルをお持ちください。Dクラスはお子様の分もお持ちください。<br>"
        "・予約は、前の週の金曜日までに、電話またはホームページでお願いします。"),
        id="Jadwal kelas memasak Sakura bulan Oktober: A (Selasa 10–12, 2.500 yen), B (Kamis 18.30–20.30, 3.000 yen), C (Sabtu 10–12.30, 3.500 yen), D (Minggu 14–16, 4.000 yen untuk orang tua + anak SD). Biaya bahan sudah termasuk. Peserta baru dapat potongan 500 yen untuk kali pertama. Bawa celemek dan handuk; kelas D bawa juga untuk anak. Reservasi paling lambat Jumat minggu sebelumnya lewat telepon/website."),
}

# ------------------------------------------------------------------ 読解: soal (13)
dokkai = [
    dict(pid="p1", q="このメールを読んだ人が、しなければならないことは何か。",
         opts=["水曜日に第二会議室で資料を受け取る", "水曜日までに会議の資料を印刷しておく", "明日中に山本さんにメールを送る", "部長に会議の時間が変わったことを連絡する"], ans=1,
         why="Rapat jadi hari Kamis; materi dicetak sendiri paling lambat sehari sebelumnya → Rabu.", bukti="会議で使う資料は前の日までに各自で印刷し",
         o=["Materi tidak dibagikan; masing-masing mencetak sendiri.", "Benar.", "Email hanya untuk yang TIDAK bisa hadir Kamis siang — bukan semua orang.", "Justru manajer yang dinas; tidak ada perintah menghubunginya."]),
    dict(pid="p2", q="「私」がピーマンを食べられるようになったのはなぜか。",
         opts=["店で売っているピーマンが苦くなかったから", "自分で育てたピーマンを無駄にしたくなかったから", "近所の人にピーマンの料理を教えてもらったから", "一人暮らしで、ほかに食べる物がなかったから"], ans=1,
         why="Setelah merawat sendiri, ia tidak tega membuang paprika hasil panen, lalu mencoba memakannya.", bukti="とれたピーマンを捨てる気にはなれなかった",
         o=["Yang tidak sepahit dugaan adalah paprika tanamannya sendiri, bukan dari toko.", "Benar.", "Tetangga hanya meminjamkan ladang, tidak mengajari masak.", "Tidak disebut kekurangan makanan."]),
    dict(pid="p3", q="このお知らせからわかることは何か。",
         opts=["夏の間は、毎日午後八時まで泳ぐことができる", "七月の祝日の月曜日には、プールは休みになる", "祝日の次の日の火曜日に、プールが休みになることがある", "小学生は、一人でもプールを利用することができる"], ans=2,
         why="Jika Senin hari libur nasional, kolam buka dan tutup keesokan harinya (Selasa).", bukti="月曜日が祝日の場合は営業し、次の日を休みとします",
         o=["Senin tutup, jadi tidak setiap hari.", "Justru Senin libur nasional kolam BUKA.", "Benar.", "Anak SD harus bersama orang dewasa."]),
    dict(pid="p4", q="筆者の考えに合うものはどれか。",
         opts=["会議の資料は、費用がかからないので全部画面で見るほうがいい", "会議の資料は、見落としがないように全部紙で配るほうがいい", "細かく読む必要がある資料は、紙で配るほうがいい", "パソコンが使える人だけが、画面で資料を見るほうがいい"], ans=2,
         why="Penulis tidak memilih semua layar atau semua kertas; hanya materi yang perlu dibaca teliti dibagikan di kertas.", bukti="細かく読む必要がある資料だけは紙で配るのがいい",
         o=["Penulis menolak 'semua di layar'.", "Penulis juga tidak menyarankan semua kertas.", "Benar.", "Kemampuan memakai laptop tidak dibahas."]),
    dict(pid="p5", q="<u>それを読んでいるうちに</u>とあるが、何を読んでいるうちにか。",
         opts=["大きな書店にある本の紹介", "店長が本に付けたカード", "客が書いた本の感想", "インターネットの本の紹介"], ans=1,
         why="それ merujuk ke kartu tulisan tangan dari pemilik toko di kalimat sebelumnya.", bukti="店長が選んだ本に、手書きのカードが付いている",
         o=["Toko besar hanya pembanding jumlah buku.", "Benar.", "Kesan pembaca dibicarakan di acara Sabtu, bukan ditulis.", "Internet disebut di paragraf terakhir, tidak terkait それ."]),
    dict(pid="p5", q="土曜日の夜の会について、正しいものはどれか。",
         opts=["店長が本の選び方を説明する会である", "友達と一緒に来なければ参加できない", "同じ本を読んだ人たちが感想を話し合う会である", "店の本を二千冊に増やすための会である"], ans=2,
         why="Teks: 同じ本を読んだ人が集まって、感想を話し合う会.", bukti="同じ本を読んだ人が集まって、感想を話し合う会が開かれる",
         o=["Pemilik toko tidak disebut memberi penjelasan di acara itu.", "Kebanyakan peserta awalnya datang sendirian.", "Benar.", "2.000 buku adalah jumlah saat ini, tidak terkait acara."]),
    dict(pid="p5", q="筆者は、人がこの本屋に来るのはなぜだと考えているか。",
         opts=["大きな書店より本の値段が安いから", "インターネットでは本を買うのが難しいから", "駅から近くて、いつでも本が買えるから", "新しい本や人との出会いを期待しているから"], ans=3,
         why="Kesimpulan penulis di kalimat terakhir.", bukti="新しい本や人との出会いを求めているからではないだろうか",
         o=["Harga tidak dibahas.", "Justru internet disebut memudahkan membeli buku.", "Lokasi dekat stasiun disebut, tapi bukan alasan menurut penulis.", "Benar."]),
    dict(pid="p6", q="<u>①そのときは少しきゅうくつに感じた</u>とあるが、なぜか。",
         opts=["先輩の注意のしかたが厳しすぎたから", "少しぐらい遅れても、仕事には影響がないと思っていたから", "日本の電車がいつも遅れて来たから", "会議が決められた時間に終わらなかったから"], ans=1,
         why="Kalimat berikutnya memberi alasan: ia mengira terlambat beberapa menit tidak berpengaruh pada hasil kerja.", bukti="数分ぐらい遅れても、仕事の結果には関係ないだろうと思っていたから",
         o=["Cara menegur senior tidak dikomentari.", "Benar.", "Kereta di Jepang justru tepat waktu.", "Rapat selesai tepat waktu."]),
    dict(pid="p6", q="筆者が、時間を守ることについて考えを変えたのはどんなときか。",
         opts=["来日して、電車が時刻表どおりに来るのを見たとき", "会議に遅れて、先輩に注意されたとき", "リーダーになって、遅れた人を待つ立場になったとき", "会議で出た意見を、次の会議に回したとき"], ans=2,
         why="「考えが変わったのは、あるプロジェクトのリーダーを任されたときだった」.", bukti="考えが変わったのは、あるプロジェクトのリーダーを任されたときだった",
         o=["Saat itu ia hanya terkejut, pandangannya belum berubah.", "Saat ditegur ia justru merasa terkekang.", "Benar.", "Itu kritik penulis terhadap cara Jepang, bukan saat pandangannya berubah."]),
    dict(pid="p6", q="<u>②このこと</u>とは何か。",
         opts=["時間を守るのは、よい仕事をするためだということ", "日本の会議は、時間ちょうどに始まるということ", "会議に一人が遅れると、多くの時間が無駄になるということ", "いい意見は、次の会議で話すべきだということ"], ans=0,
         why="このこと merujuk kalimat sebelumnya: menepati waktu hanyalah sarana untuk kerja yang baik, bukan tujuan.", bukti="それはあくまでも、よい仕事をするための手段であって、目的ではない",
         o=["Benar.", "Fakta di paragraf 2, bukan yang ingin terus diingat.", "Isi paragraf 3, bukan rujukan このこと.", "Penulis justru mengkritik penundaan ide."]),
    dict(pid="p6", q="この文章で、筆者がいちばん言いたいことは何か。",
         opts=["会議では、時間を守ることが何よりも大切だ", "時間を守ることは大切だが、それだけを気にするべきではない", "日本のやり方はきゅうくつなので、変えたほうがいい", "時間に遅れても、いい意見を出せば問題はない"], ans=1,
         why="Penulis mengakui pentingnya tepat waktu, tetapi mengingatkan agar tidak menjadikannya tujuan.", bukti="時間を守ることは大切だが、それはあくまでも、よい仕事をするための手段",
         o=["Terlalu mutlak; penulis menyebut itu bukan tujuan.", "Benar.", "Rasa terkekang hanya di awal; penulis tidak menyuruh mengubah semuanya.", "Penulis tetap menganggap tepat waktu penting."]),
    dict(pid="p7", q="会社員のマリアさんは、平日は午後七時まで働いていて、週末は土曜日だけ時間がある。初めてこの教室に参加する。マリアさんが払う料金はいくらか。",
         opts=["2,000円", "2,500円", "3,000円", "3,500円"], ans=2,
         why="Hari kerja sampai jam 7 malam → kelas A (Selasa pagi) dan B (Kamis 18.30) tidak bisa; Minggu tidak bisa → kelas C 3.500 yen − potongan peserta baru 500 = 3.000 yen.", bukti="初めての方は、1回目の料金が500円引き",
         o=["2.000 = kelas A dikurangi potongan, tapi kelas A Selasa pagi.", "2.500 = harga kelas A.", "Benar: 3.500 − 500.", "3.500 = harga kelas C tanpa potongan peserta baru."]),
    dict(pid="p7", q="小学三年生の子どもと一緒にDクラスに参加したい。正しいものはどれか。",
         opts=["当日の朝、教室に電話して予約する", "材料費を受付で料金とは別に払う", "子どものエプロンとタオルも持っていく", "親も子どもも一人4,000円ずつ払う"], ans=2,
         why="Untuk kelas D, celemek dan handuk anak juga dibawa.", bukti="Dクラスはお子様の分もお持ちください",
         o=["Reservasi paling lambat Jumat minggu sebelumnya.", "Biaya bahan sudah termasuk.", "Benar.", "4.000 yen untuk orang tua + anak (berdua), bukan per orang."]),
]

# ------------------------------------------------------------------ 聴解: terjemahan & alasan per pilihan (kunci = teks pilihan)
CHOUKAI = {
    (1, 1): dict(tr="Persiapan presentasi produk: aula & email sudah beres; cetak materi ditunda karena harga mungkin berubah; cek mikrofon cukup pada hari-H; sekarang diminta mengecek balasan tamu.",
                 o={"資料を百部印刷する": "Ditunda sampai harga diputuskan sore nanti.", "新商品の値段を部長に聞く": "Harga akan diputuskan; tidak ada tugas menanyakan ke manajer.",
                    "マイクとプロジェクターを確かめる": "Dikatakan cukup dilakukan pada pagi hari-H.", "お客様からの返事を確認する": "Benar: 「すぐ確認します」."}),
    (1, 2): dict(tr="Guru menjelaskan persiapan lomba pidato: naskah diserahkan paling lambat Senin; judul tidak perlu diserahkan; urutan diundi sehari sebelum lomba; yang tidak mau difoto bilang di resepsionis pagi hari lomba.",
                 o={"スピーチの題を先生に伝える": "Judul sudah disampaikan sebelumnya.", "スピーチの原稿を先生に出す": "Benar: tenggat Senin.",
                    "発表の順番をくじで決める": "Dilakukan sehari sebelum lomba (Kamis).", "写真について受付で話す": "Pada pagi hari lomba, dan hanya bagi yang tidak mau difoto."}),
    (1, 3): dict(tr="Wanita masih di rumah karena ada kiriman paket; restoran ternyata tutup hari ini; mereka pindah ke restoran pasta di gedung stasiun; dia akan segera berangkat.",
                 o={"宅配便を受け取る": "Paket sudah datang.", "店に並んで待つ": "Itu rencana awal pria, dibatalkan karena toko tutup.",
                    "駅ビルに向かう": "Benar: 「急いで行くね」.", "店のホームページを見る": "Sudah dilihat tadi."}),
    (1, 4): dict(tr="Mahasiswa ingin mendaftar beasiswa: formulir + sertifikat nilai; sertifikat butuh kartu mahasiswa (tertinggal) sehingga boleh besok; formulir perlu tanda tangan dosen, jadi minta itu dulu.",
                 o={"申込書に記入する": "Perlu dilakukan, tapi petugas menekankan tanda tangan dosen 'dulu' (先に).", "成績証明書を出す": "Boleh besok; kartu mahasiswa tertinggal.",
                    "学生証を取りに帰る": "Tidak perlu, sertifikat boleh besok.", "先生にサインをもらう": "Benar: 「先にそれをもらっておいて」."}),
    (1, 5): dict(tr="Manajer memberi arahan: kantong payung dipasang setelah hujan turun; rak telur diisi sebelum toko buka; kasir dibuka jam 10; tetapi sebelum semua itu, cek suhu freezer.",
                 o={"入り口に傘を入れる袋を置く": "Setelah hujan turun.", "卵の棚を卵でいっぱいにする": "Sebelum toko buka, tapi setelah cek suhu.",
                    "レジを三台とも開ける": "Jam 10.", "冷凍食品のケースの温度を見る": "Benar: 「まず全部のケースの温度を確認してから」."}),
    (1, 6): dict(tr="Istri minta susu dan telur; roti sudah dapat dari tetangga; telur masih ada → ganti tomat; susu dua botol karena ibu datang.",
                 o={"牛乳一本と卵": "Telur dibatalkan, susu jadi dua.", "牛乳二本とトマト": "Benar.",
                    "牛乳二本と卵とパン": "Roti dan telur tidak perlu.", "牛乳一本とトマト": "Susu diminta dua botol."}),
    (2, 1): dict(tr="Pria pindah rumah. Kebisingan konstruksi akan segera berakhir; alasan sebenarnya: mulai musim semi tinggal bersama ibu dan kamar terlalu sempit.",
                 o={"会社から遠いから": "Justru rumah baru akan lebih jauh dari kantor.", "隣の部屋の工事がうるさいから": "Disangkal: 「それはいいんです」.",
                    "家族と住むには部屋が狭いから": "Benar.", "家賃が高くなったから": "Sewa tidak dibahas."}),
    (2, 2): dict(tr="Mahasiswi akan kuliah di AS. Asrama sudah ada, bahasa Inggris dirasa bisa diatasi, teman pasti dapat; yang paling dikhawatirkan: alergi makanan.",
                 o={"英語の授業についていけるか": "Agak cemas, tapi 「なんとかなると思う」.", "寮が見つかるかどうか": "Asrama sudah ditetapkan.",
                    "食事に何が入っているか": "Benar: 「それがいちばん気になってる」.", "向こうで友達ができるかどうか": "Dia yakin bisa cepat dapat teman."}),
    (2, 3): dict(tr="Petugas wisata: dulu parkiran penuh & macet; sejak 3 tahun lalu ada bus gratis akhir pekan; tahun ini mulai menyalakan lampu di taman kuil agar daun merah bisa dinikmati malam hari.",
                 o={"駐車場を広くしたこと": "Parkiran hanya disebut selalu penuh; tidak diperluas.", "無料のバスを走らせたこと": "Sudah sejak tiga tahun lalu, bukan tahun ini.",
                    "夜にお寺の庭を明るくしたこと": "Benar: 「今年からは…ライトで照らす」.", "週末に道を通れなくしたこと": "Jalan tidak ditutup; masalah macet diatasi dengan bus gratis."}),
    (2, 4): dict(tr="Pria suka warna hitam, ukuran pas, harga terjangkau, tapi tasnya berat karena banyak sekat — tidak cocok untuk dibawa setiap hari dengan laptop.",
                 o={"好きな色がなかったから": "Ada warna hitam yang disukai.", "大きさが合わなかったから": "「大きさもちょうどいい」.",
                    "重かったから": "Benar.", "値段が高かったから": "「値段は手ごろ」."}),
    (2, 5): dict(tr="Menentukan jadwal rapat: Senin–Selasa wanita keluar; Rabu pagi pria rapat; Rabu sore wanita pelatihan; Kamis kosong → Kamis jam 9.",
                 o={"月曜日の午後": "Wanita seharian di klien.", "水曜日の午前": "Pria ada rapat.",
                    "水曜日の午後": "Wanita pelatihan sampai jam 5.", "木曜日の午前": "Benar: 「九時からにしよう」."}),
    (2, 6): dict(tr="Guru masak: suhu minyak penting tapi mudah diukur dengan termometer; tepung biasa cukup; yang paling penting jangan mengaduk adonan berlebihan; sisa sedikit tepung justru pas.",
                 o={"油の温度をはかること": "Penting, tetapi 'mudah bagi siapa saja'.", "特別な粉を使うこと": "Tepung biasa sudah cukup.",
                    "衣をあまり混ぜないこと": "Benar.", "粉を残さず混ぜること": "Kebalikannya: sedikit tepung tersisa itu pas."}),
    (3, 1): dict(tr="Wawancara TV: pria berhenti kerja kantoran dan bertani 5 tahun lalu; awalnya sulit, dibantu tetangga, kini memasok restoran dan menikmati perubahan tiap hari.",
                 o={"会社をやめた理由": "Hanya disinggung sedikit.", "農業を始めてからの生活": "Benar — topik keseluruhan.",
                    "おいしい野菜の育て方": "Cara menanam tidak dijelaskan.", "レストランの料理": "Restoran hanya penerima sayurnya."}),
    (3, 2): dict(tr="Dosen: jangan mencatat semuanya; tulis kata kunci saja, lalu hari itu juga susun menjadi kalimat sendiri agar tersimpan dalam ingatan.",
                 o={"授業でノートを使う理由": "Bukan alasan memakai buku catatan.", "効果的なメモの取り方": "Benar.",
                    "記憶力がいい人の特徴": "Ciri orang tidak dibahas.", "授業の内容をまとめる宿題": "Merangkum disarankan, bukan PR."}),
    (3, 3): dict(tr="Wanita suka gedung perpustakaan baru (terang, ada kafe), tetapi koleksi buku spesialis kurang sehingga kurang untuk belajar; untuk meminjam buku dia tetap ke perpustakaan kampus.",
                 o={"建物も本も満足している": "Tidak puas dengan buku.", "建物はいいが、本が足りない": "Benar.",
                    "カフェがあるので毎日行きたい": "Kafe disukai, tapi tidak bilang ingin datang setiap hari.", "駅から遠いので不便だ": "Perpustakaan ada di depan stasiun."}),
    (4, 1): dict(tr="Di rumah teman, ingin memakai toilet.",
                 o={"ちょっとトイレ借りてもいい？": "Benar: meminta izin memakai.", "トイレ、貸してあげようか？": "Menawarkan meminjamkan — peran terbalik.",
                    "トイレに行ってもらえる？": "Menyuruh teman ke toilet."}),
    (4, 2): dict(tr="Ingin senior membaca laporan sendiri.",
                 o={"このレポート、読んでいただけませんか。": "Benar: meminta senior membaca.", "このレポート、読ませていただけませんか。": "Minta izin agar diri sendiri yang membaca.",
                    "このレポート、お読みになりましたか。": "Menanyakan apakah sudah dibaca."}),
    (4, 3): dict(tr="Pulang lebih dulu dari rekan yang masih bekerja.",
                 o={"お先に失礼します。": "Benar.", "お疲れになりました。": "Bukan ungkapan pamit; bentuk keigo yang janggal.",
                    "お先にどうぞ。": "Mempersilakan orang lain duluan."}),
    (4, 4): dict(tr="Mencari ukuran lebih besar di toko.",
                 o={"これの大きいサイズはありますか。": "Benar.", "これ、大きくしてもいいですか。": "Minta izin membesarkan barang — tidak logis.",
                    "大きいサイズにしてあげましょうか。": "Ucapan pegawai, bukan pembeli."}),
    (5, 1): dict(tr="'Yamada, bisa tolong serahkan dokumen ini ke manajer hari ini?'",
                 o={"はい、お渡ししておきます。": "Benar.", "はい、もらっておきます。": "もらう = menerima, bukan menyerahkan.", "いえ、部長はもう渡しましたよ。": "Subjek/arahnya salah."}),
    (5, 2): dict(tr="'Lho, belum pulang? Sudah jam 8.'",
                 o={"うん、この仕事だけ終わらせたくて。": "Benar: memberi alasan.", "うん、もう帰ったよ。": "Bertentangan — dia masih di sini.", "うん、八時に帰るつもりだったよ。": "Tidak menjawab kenapa masih di kantor."}),
    (5, 3): dict(tr="'Presentasi minggu depan, Tanaka jadi bisa menggantikan(mu).'",
                 o={"よかった。じゃあ、安心して休めるね。": "Benar: merespons kabar baik.", "えっ、田中さんの代わりに発表するの？": "Salah paham arah 代わってもらう.", "じゃあ、田中さんにお願いしてみようか。": "Sudah diputuskan, tidak perlu minta lagi."}),
    (5, 4): dict(tr="'Komputer ini sepertinya bermasalah.'",
                 o={"じゃあ、ちょっと見てみましょうか。": "Benar.", "調子がよくてよかったですね。": "Kebalikan isi.", "パソコンは買わないんですか。": "Tidak nyambung."}),
    (5, 5): dict(tr="'Kalau jalan kaki ke stasiun, paling tidak 20 menit.'",
                 o={"じゃあ、バスで行こうか。": "Benar.", "二十分も歩いたんですか。": "Belum berjalan; ini pengandaian.", "駅までは近いんですね。": "Kebalikan isi."}),
    (5, 6): dict(tr="'Buku yang kemarin kupinjamkan sudah selesai dibaca?'",
                 o={"うん、一晩で読んじゃった。": "Benar.", "ううん、まだ貸してないよ。": "Penutur yang meminjamkan, bukan pendengar.", "うん、明日読み終わるところ。": "うん tidak cocok dengan 'baru besok selesai'."}),
    (5, 7): dict(tr="'Maaf terlambat, keretanya berhenti.'",
                 o={"いえいえ、大変でしたね。": "Benar: simpati.", "電車で来ればよかったのに。": "Dia memang naik kereta.", "じゃあ、止まってください。": "Tidak nyambung."}),
    (5, 8): dict(tr="'Pak, perlu saya bawakan materi rapat besok?'",
                 o={"ありがとう。机の上に置いといて。": "Benar: menerima tawaran.", "うん、持っていってあげるよ。": "Peran terbalik.", "いや、会議は明日だよ。": "Penutur sudah bilang besok."}),
    (5, 9): dict(tr="'Sudah susah payah dibuat, cobalah makan sedikit.'",
                 o={"じゃあ、ひとくちだけいただきます。": "Benar.", "せっかくなので、作ってみます。": "Diminta makan, bukan membuat.", "少しだけ作ってもいいですか。": "Tidak nyambung."}),
}

POIN = {
    "yomi": "漢字読み: waspadai jebakan vokal panjang (けしき/けいしき), dakuten (こうじ/こうし), dan bacaan kata lain yang mirip.",
    "hyouki": "表記: bandingkan bentuk kanji yang mirip (運/連) dan kanji homofon dengan arti berbeda (勤める/務める/努める).",
    "bunmyaku": "文脈規定: cari kata kunci di kalimat (雨・道 → すべる) dan kolokasi yang lazim.",
    "iikae": "言い換え: pilih yang artinya sama kuat; hati-hati dengan pilihan yang 'mirip tapi lebih lemah/kuat'.",
    "youhou": "用法: semua kalimat gramatikal — periksa kolokasi dan makna kata pada masing-masing kalimat.",
    "keishiki": "文法形式: tentukan hubungan antarbagian (sebab, kontras, syarat, waktu) lalu cocokkan dengan nuansa pola.",
    "kumitate": "★: pasangkan dulu potongan yang pasti menempel, susun dari belakang, baru tentukan isi ★.",
    "bunshou": "文章の文法: baca kalimat sebelum dan sesudah celah untuk menentukan hubungan logisnya.",
    "dokkai": "Baca pertanyaan dulu, cari bagian teks yang menjadi bukti, dan coret pilihan yang bertentangan atau tidak disebut.",
}
