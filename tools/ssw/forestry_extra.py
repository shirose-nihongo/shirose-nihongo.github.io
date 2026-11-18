# -*- coding: utf-8 -*-
import sys; sys.path.insert(0,"tools/ssw")
from extra_quiz import tf, mc, add
T=[
tf("{林業技能測定試験|りんぎょうぎのうそくていしけん}は、{学科試験|がっかしけん}と{実技試験|じつぎしけん}で{行|おこな}います。",True,"Benar: ada ujian teori dan praktik.","学科試験と実技試験で行います。","Ujian pengukuran keterampilan kehutanan terdiri dari ujian teori dan praktik."),
tf("{学科試験|がっかしけん}は、{原則|げんそく}として{真偽式|しんぎしき}（○×）です。",True,"Benar: pada prinsipnya benar-salah.","学科試験は原則として真偽式です。","Ujian teori pada prinsipnya berbentuk benar-salah (○×)."),
tf("{学科試験|がっかしけん}の{問題数|もんだいすう}は50{問|もん}です。",False,"Salah: 30 soal.","学科試験は30問です。","Ujian teori memiliki 50 soal."),
tf("{学科試験|がっかしけん}は、{得点|とくてん}が６{割|わり}５{分|ぶ}{以上|いじょう}の{人|ひと}が{合格|ごうかく}です。",True,"Benar: ≥65%.","学科試験の得点が6割5分以上です。","Ujian teori lulus bila skor 65% atau lebih."),
tf("{実技試験|じつぎしけん}は、{得点|とくてん}が６{割|わり}{以上|いじょう}の{人|ひと}が{合格|ごうかく}です。",True,"Benar: ≥60%.","実技試験の得点が6割以上です。","Ujian praktik lulus bila skor 60% atau lebih."),
tf("{学科試験|がっかしけん}の{得点|とくてん}が６{割|わり}５{分|ぶ}{以上|いじょう}なら、{実技試験|じつぎしけん}は{受|う}けなくてもいいです。",False,"Salah: keduanya harus terpenuhi.","学科と実技のどちらも基準を満たす必要があります。","Jika skor teori ≥65%, ujian praktik tidak perlu diambil."),
tf("{実技試験|じつぎしけん}では、チェーンソーを{使|つか}った{作業|さぎょう}をします。",True,"Benar: pekerjaan chainsaw sesuai instruksi penyelenggara.","チェーンソーに関する所定の作業を行います。","Pada ujian praktik, peserta mengerjakan tugas yang menggunakan gergaji mesin (chainsaw)."),
tf("{林業技能測定試験|りんぎょうぎのうそくていしけん}の{水準|すいじゅん}は、{林業|りんぎょう}の{技能検定|ぎのうけんてい}３{級|きゅう}と{同程度|どうていど}です。",True,"Benar: setara tingkat 3 ujian keterampilan kehutanan.","林業職種の技能検定3級と同程度の水準です。","Tingkat ujian setara dengan ujian keterampilan (ginou kentei) tingkat 3 bidang kehutanan."),
tf("{受験資格|じゅけんしかく}は、{試験日|しけんび}に{満|まん}18{歳|さい}{以上|いじょう}であることです。",True,"Benar: 18 tahun ke atas pada hari ujian.","試験日において満18歳以上の者です。","Syarat usia: 18 tahun atau lebih pada hari ujian."),
tf("{試験|しけん}は{日本語|にほんご}で{行|おこな}われ、{漢字|かんじ}にはふりがなが{付|つ}きます。",True,"Benar: hiragana/katakana atau kanji berfurigana.","日本語（ひらがな、カタカナ又はふりがなを付した漢字）です。","Ujian dalam bahasa Jepang, dan kanji diberi furigana."),
tf("{受験料|じゅけんりょう}を{払|はら}ったあとは、どんな{理由|りゆう}でもキャンセルして{全額|ぜんがく}{返|かえ}してもらえます。",False,"Salah: setelah dibayar tidak bisa dibatalkan; hanya pengecualian tertentu (kesalahan penyelenggara, bencana alam dsb.).","入金後の変更やキャンセルは受け付けません。","Setelah membayar biaya ujian, pembatalan dengan pengembalian penuh selalu bisa dengan alasan apa pun."),
tf("{試験|しけん}の{当日|とうじつ}は、{顔写真付|かおしゃしんつ}きの{身分証明書|みぶんしょうめいしょ}（{在留|ざいりゅう}カードまたはパスポート）を{見|み}せます。",True,"Benar: verifikasi identitas dengan kartu bergambar foto.","受付時に本人確認を受けます。","Pada hari ujian, peserta menunjukkan identitas berfoto (kartu residensi atau paspor)."),
tf("{合格者|ごうかくしゃ}の{受験番号|じゅけんばんごう}は、{試験後|しけんご}１か{月以内|げついない}に{発表|はっぴょう}されます。",True,"Benar: diumumkan dalam 1 bulan.","試験実施後1か月以内に掲載します。","Nomor peserta yang lulus diumumkan dalam 1 bulan setelah ujian."),
tf("{不正行為|ふせいこうい}をした{人|ひと}は、{５年以内|ごねんいない}、{試験|しけん}を{受|う}けられなくなることがあります。",True,"Benar: dapat dilarang mengikuti ujian hingga 5 tahun.","5年以内の期間を定めて受験を禁止できます。","Peserta yang berbuat curang dapat dilarang ikut ujian hingga 5 tahun."),
tf("{試験|しけん}に{合格|ごうかく}すれば、{必|かなら}ず{在留資格|ざいりゅうしかく}が{許可|きょか}されます。",False,"Salah: lulus tidak menjamin izin status residensi.","合格しても在留資格が保証されるわけではありません。","Dengan lulus ujian, izin status residensi pasti diberikan."),
mc("Siapa yang menyelenggarakan ujian kehutanan 2026 (dalam negeri)?","2026{年度|ねんど}の{林業技能測定試験|りんぎょうぎのうそくていしけん}（{国内試験|こくないしけん}）を{実施|じっし}する{団体|だんたい}はどこですか。",("Asosiasi Peningkatan Keterampilan Kehutanan","{一般社団法人|いっぱんしゃだんほうじん}{林業技能向上|りんぎょうぎのうこうじょう}センター"),[("Japan Post","{日本郵便|にほんゆうびん}"),("Perusahaan penyiaran NHK","NHK")],"Penyelenggara: 一般社団法人林業技能向上センター.","実施機関は林業技能向上センターです。",1),
mc("Biaya ujian dalam negeri 2026 adalah…","2026{年度|ねんど}の{国内試験|こくないしけん}の{受験手数料|じゅけんてすうりょう}はいくらですか。",("20.000 yen (termasuk pajak)","20,000{円|えん}（{消費税|しょうひぜい}{込|こ}み）"),[("2.000 yen","2,000{円|えん}"),("200.000 yen","200,000{円|えん}")],"Biaya 20.000 yen termasuk pajak konsumsi 10%.","20,000円です。",2),
mc("Syarat tambahan peserta ujian dalam negeri adalah telah mengikuti…","{国内試験|こくないしけん}の{受験|じゅけん}に{必要|ひつよう}な{講習|こうしゅう}はどれですか。",("Pendidikan khusus penebangan dengan chainsaw","チェーンソーによる{伐木等特別教育|ばつぼくとうとくべつきょういく}"),[("Kursus memasak","{料理講習|りょうりこうしゅう}"),("Kursus mengemudi kapal","{操船講習|そうせんこうしゅう}")],"Peserta wajib sudah ikut pendidikan khusus penebangan dengan chainsaw sesuai UU K3.","伐木等特別教育の要件を満たす講習が必要です。"),
]
add("forestry","bab1","b1s1","Soal tambahan: aturan ujian resmi (林野庁・技能向上センター)","{追加問題|ついかもんだい}：{試験|しけん}のルール（{林野庁|りんやちょう}）",T)
