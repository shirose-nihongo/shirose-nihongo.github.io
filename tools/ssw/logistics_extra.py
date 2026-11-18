# -*- coding: utf-8 -*-
import sys; sys.path.insert(0,"tools/ssw")
from extra_quiz import tf, mc, add
S="Sumber: 物流倉庫分野 特定技能評価試験 試験基準・実施要領 (国土交通省, 2026)"
T=[
tf("{物流倉庫分野|ぶつりゅうそうこぶんや}の１{号評価試験|ごうひょうかしけん}の{学科試験|がっかしけん}は、{問題数|もんだいすう}が30{問|もん}です。",True,"Benar: 学科 30 soal, 40 menit, pilihan ganda.","学科試験は40分、30問、多肢選択式です。","Ujian teori (学科) 1号 bidang pergudangan terdiri dari 30 soal."),
tf("{物流倉庫分野|ぶつりゅうそうこぶんや}の{実技試験|じつぎしけん}は、20{問|もん}で{時間|じかん}は40{分|ぷん}です。",True,"Benar: 実技 20 soal, 40 menit.","実技試験は40分、20問です。","Ujian praktik (実技) berisi 20 soal dengan waktu 40 menit."),
tf("{学科試験|がっかしけん}は、30{点満点|てんまんてん}で18{点|てん}{以上|いじょう}が{合格|ごうかく}です。",True,"Benar: 1 soal 1 poin, lulus 18 dari 30.","1問1点、30点満点で18点以上が合格です。","Ujian teori lulus bila mendapat 18 poin atau lebih dari 30."),
tf("{実技試験|じつぎしけん}は、20{点満点|てんまんてん}で15{点|てん}{以上|いじょう}が{合格|ごうかく}です。",False,"Salah: lulus 12 poin atau lebih dari 20.","実技試験は12点以上が合格です。","Ujian praktik lulus bila mendapat 15 poin atau lebih."),
tf("{試験|しけん}は{日本語|にほんご}で{行|おこな}われ、{漢字|かんじ}にはひらがなの{読|よ}みが{付|つ}きます。",True,"Benar: bahasa Jepang, kanji diberi hiragana dalam kurung.","試験言語は日本語で、漢字の後ろに読みが付きます。","Ujian memakai bahasa Jepang dengan kanji yang diberi bacaan hiragana."),
tf("{受験資格|じゅけんしかく}は、{満|まん}18{歳|さい}{以上|いじょう}です。",False,"Salah: usia 17 tahun ke atas.","満17歳以上の日本国籍を有しない者です。","Syarat usia peserta ujian adalah 18 tahun ke atas."),
tf("{試験|しけん}に{合格|ごうかく}すれば、{必|かなら}ず{特定技能|とくていぎのう}の{在留資格|ざいりゅうしかく}がもらえます。",False,"Salah: lulus ujian tidak otomatis memberi status residensi.","合格しても在留資格が必ず付与されるわけではありません。","Dengan lulus ujian, status residensi tokutei ginou pasti diberikan."),
tf("{試験結果通知書|しけんけっかつうちしょ}と{合格証明書|ごうかくしょうめいしょ}の{有効期限|ゆうこうきげん}は、{受験日|じゅけんび}から10{年|ねん}です。",True,"Benar: berlaku 10 tahun sejak tanggal ujian.","有効期限は受験日から10年後です。","Masa berlaku surat hasil dan sertifikat lulus adalah 10 tahun sejak tanggal ujian."),
tf("{評価試験|ひょうかしけん}は、{実務経験|じつむけいけん}２{年程度|ねんていど}の{人|ひと}が{受|う}けると７{割程度|わりていど}{合格|ごうかく}できる{水準|すいじゅん}です。",True,"Benar: standar soal = lulus sekitar 70% bagi yang berpengalaman 2 tahun.","実務経験2年程度の人が7割程度合格できる水準です。","Tingkat ujian: sekitar 70% peserta berpengalaman kerja 2 tahun dapat lulus."),
tf("{物流倉庫分野|ぶつりゅうそうこぶんや}の{学科試験|がっかしけん}では、{倉庫|そうこ}の{種類|しゅるい}（{普通倉庫|ふつうそうこ}、{冷蔵倉庫|れいぞうそうこ}、{危険品倉庫|きけんひんそうこ}など）を{学|まな}びます。",True,"Benar: termasuk dalam cakupan 保管・荷役.","倉庫の種類が試験範囲に入っています。","Jenis gudang (umum, pendingin, barang berbahaya) termasuk cakupan ujian teori."),
tf("{学科試験|がっかしけん}の{範囲|はんい}には、{安全|あんぜん}・{衛生|えいせい}（{保護具|ほごぐ}、{危険行為|きけんこうい}、{防災|ぼうさい}サイン）も{入|はい}ります。",True,"Benar: 安全・衛生 adalah salah satu dari 3 bidang ujian teori.","安全・衛生に関する知識も試験範囲です。","Pengetahuan K3 (APD, tindakan berbahaya, tanda penanggulangan bencana) termasuk cakupan ujian."),
tf("{実技試験|じつぎしけん}では、{単位|たんい}の{換算|かんさん}や{計算|けいさん}はありません。",False,"Salah: praktik meliputi pemahaman satuan, konversi dan perhitungan.","単位の理解と換算、計算ができることが求められます。","Ujian praktik tidak memuat konversi satuan maupun perhitungan."),
mc("Siapa penyelenggara ujian evaluasi 1号 bidang pergudangan?","{物流倉庫分野|ぶつりゅうそうこぶんや}の１{号評価試験|ごうひょうかしけん}の{実施機関|じっしきかん}はどこですか。",("Nippon Kaiji Kyokai (ClassNK)","{一般財団法人|いっぱんざいだんほうじん}{日本海事協会|にほんかいじきょうかい}"),[("Japan Post","{日本郵便|にほんゆうびん}"),("Japan Airlines","{日本航空|にほんこうくう}")],"Penyelenggara: Nippon Kaiji Kyokai.","実施機関は一般財団法人日本海事協会です。",1),
mc("Yang bukan bagian dari 3 bidang ujian teori adalah…","{学科試験|がっかしけん}の３{分野|ぶんや}に{入|はい}らないものはどれですか。",("Pengetahuan mengemudikan kapal","{船|ふね}の{操縦|そうじゅう}の{知識|ちしき}"),[("Pengetahuan penyimpanan dan bongkar muat","{保管|ほかん}・{荷役|にやく}の{知識|ちしき}"),("Pengetahuan pemrosesan distribusi","{流通加工|りゅうつうかこう}の{知識|ちしき}")],"3 bidang: 保管・荷役, 流通加工, 安全・衛生.","学科は保管・荷役、流通加工、安全・衛生の3分野です。",2),
mc("Hasil ujian diumumkan dalam waktu…","{試験後|しけんご}、{合否|ごうひ}はどのくらいで{通知|つうち}されますか。",("Dalam 1 bulan","1か{月以内|げついない}"),[("Dalam 1 tahun","1{年以内|ねんいない}"),("Dalam 5 tahun","5{年以内|ねんいない}")],"Pengumuman lulus/tidak di situs khusus dalam 1 bulan setelah ujian.","1か月以内に専用ホームページで通知します。"),
mc("Yang termasuk alat gudang dalam cakupan ujian…","{倉庫|そうこ}で{使|つか}う{機器|きき}・{器具|きぐ}はどれですか。",("Forklift dan palet","フォークリフトとパレット"),[("Mesin bubut","{旋盤|せんばん}"),("Alat las listrik","{溶接機|ようせつき}")],"Forklift, palet, kereta kotak, lift vertikal otomatis adalah contoh peralatan gudang.","フォークリフトやパレットが挙げられています。"),
mc("Prosedur kerja gudang yang termasuk ujian…","{物流倉庫|ぶつりゅうそうこ}の{各作業|かくさぎょう}に{入|はい}らないものはどれですか。",("Pengelasan","{溶接|ようせつ}"),[("Penerimaan barang","{入庫|にゅうこ}"),("Pemilahan/pengambilan (picking)","ピッキング")],"Pekerjaan: 入庫・出庫・検品・ピッキング・積付; bukan pengelasan.","溶接は入ってきません。"),
]
add("logistics","bab1","b1s1","Soal tambahan: format & isi ujian resmi (MLIT)","{追加問題|ついかもんだい}：{試験|しけん}の{形式|けいしき}と{内容|ないよう}（{国土交通省|こくどこうつうしょう}）",T)
