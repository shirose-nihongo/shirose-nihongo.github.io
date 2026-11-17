# -*- coding: utf-8 -*-
TF="tf"; MC="mc"
# soal contoh resmi JLSA (bab, id, jp, jawaban, penjelasan)
OFF = [
 (2,"Mesin pengumpan seprai dan mesin pengumpan handuk adalah mesin yang berbeda. (初級 No.1)","シーツを入れる機械とタオルを入れる機械は違う。",True,"Kunci resmi: ○."),
 (2,"Sebelum mulai kerja, periksa bahwa tombol berhenti darurat bisa menghentikan mesin. (初級 No.2)","仕事を始める前には、非常停止ボタンを押して止まることをチェックする。",True,"Kunci resmi: ○."),
 (2,"Menekan tombol berhenti darurat adalah tugas leader saja. (初級 No.3)","非常停止ボタンを押すのは、リーダーの仕事です。",False,"Kunci resmi: ×."),
 (3,"Sarung bantal dan gaun adalah barang yang berbeda. (初級 No.4)","ピローケースとガウンは違うものです。",True,"Kunci resmi: ○."),
 (4,"Bila linen tersangkut, hentikan mesin segera. (初級 No.5)","リネン品が詰まったときは、すぐに機械を止める。",True,"Kunci resmi: ○."),
 (3,"Gaun memiliki sisi belakang dan depan. (初級 No.6)","ガウンには、裏と表がある。",True,"Kunci resmi: ○."),
 (4,"Mesin berbunyi aneh tetapi pekerjaan dilanjutkan begitu saja. (初級 No.7)","機械から変な音がしているが、そのまま仕事を続けた。",False,"Kunci resmi: × (hentikan & laporkan)."),
 (4,"Bila buzzer mesin berbunyi, sampaikan kepada leader. (初級 No.8)","機械のブザーが鳴ったら、リーダーに伝える。",True,"Kunci resmi: ○."),
 (5,"Bila cedera saat bekerja, segera beri tahu orang di sekitar. (初級 No.9)","仕事中にけがをしたら、すぐに周りの人に伝える。",True,"Kunci resmi: ○."),
 (5,"Patuhi waktu dan jangan terlambat. (初級 No.10)","時間を守り、遅刻をしない。",True,"Kunci resmi: ○."),
 (2,"Roller ironer terdiri dari tipe chest roll dan calender roll. (専門級 No.1)","ロールアイロナーには、チェストロール機とカレンダーロール機がある。",True,"Kunci resmi: ○."),
 (2,"Mesin pengumpan seprai dan mesin pengumpan gaun adalah mesin yang sama. (専門級 No.2)","シーツ投入機とガウン投入機は同じ機械である。",False,"Kunci resmi: ×."),
 (2,"Saat mengatur kecepatan roll, kecepatan folder dibuat lebih cepat dari roll. (専門級 No.3)","ロールスピードを設定する時は、ロール機よりもフォルダー（畳み機）のスピードを速くする。",True,"Kunci resmi: ○."),
 (3,"Poliester mudah menghasilkan listrik statis. (専門級 No.4)","ポリエステルは、静電気が発生しやすい素材である。",True,"Kunci resmi: ○."),
 (2,"Handuk yang punya sisi belakang-depan dimasukkan ke towel folder dengan sisi belakang di atas. (専門級 No.5)","裏表のあるタオルを、タオルフォルダー（畳み機）で仕上げる時は、裏を上にして投入する。",True,"Kunci resmi: ○."),
 (2,"Chest roll perlu sesekali dilewati kain lilin (kain berminyak). (専門級 No.6)","チェストロール機には、時々ワックス布（油布）を通す必要がある。",True,"Kunci resmi: ○."),
 (5,"Alat bersih-bersih dijaga bersih dan sapu dsb. diletakkan di tempat yang ditentukan. (専門級 No.7)","清掃用具は、いつも綺麗にして、ほうきなどは決められた場所に置いておく。",True,"Kunci resmi: ○."),
 (2,"Cross folder pada roll machine bisa melipat akurat tanpa mengukur panjang seprai/duvet. (専門級 No.8)","ロール機に付いているクロスフォルダー（畳み機）は、シーツやデュベカバーの長さを計測しなくても、正確にたためる機能がある。",False,"Kunci resmi: ×."),
 (3,"Poliester adalah serat alam yang paling banyak dikonsumsi dan unggul dalam penyerapan air. (専門級 No.9)","ポリエステルは天然繊維の中で最も多く消費されていて、丈夫で吸湿性、吸水性、保湿性、耐熱性、耐洗濯性に優れている繊維です。",False,"Kunci resmi: × (poliester serat sintetis)."),
 (2,"Perbedaan kecepatan besar antara mesin yukata dan roll ironer membuat hasil rapi. (専門級 No.10)","浴衣投入機と浴衣畳み機は、ロールアイロナーとの速度差が大きければきれいに仕上がる。",False,"Kunci resmi: ×."),
]
GEN = {
1: [
 (TF,"Ujian 1号 Linen Supply di pedoman operasional dinamai リネンサプライ分野特定技能1号評価試験.","技能水準は「リネンサプライ分野特定技能１号評価試験」に合格していることです。",True,"Benar (MOJ/MHLW 運用方針)."),
 (TF,"Tingkat bahasa yang diminta setara A2.2.","日本語能力水準はA2.2相当以上です。",True,"Benar."),
 (TF,"Pekerja 1号 Linen Supply boleh dipekerjakan lewat agen penyalur (派遣).","リネンサプライ分野の特定技能外国人は派遣で雇用できる。",False,"Salah: hanya 直接雇用."),
 (MC,"Ujian praktik tingkat 専門級 / 初級 berupa…","実技試験の課題は？",(["リネンサプライ仕上げ作業","Bongkar muat truk","Mencuci piring"],0),"リネンサプライ仕上げ作業."),
 (MC,"Berapa bidang pengetahuan ujian tulis menurut 試験基準?","学科試験の科目はいくつ？",(["4","6","10"],1),"6 bidang: mesin, operasi, linen, finishing, perawatan mesin, K3."),
],
2: [
 (TF,"トンネルフィニッシャー termasuk mesin dalam cakupan 初級.","トンネルフィニッシャーは初級の範囲に含まれます。",True,"Benar."),
 (TF,"金属探知機 (検針装置) termasuk dalam cakupan 専門級 saja.","金属探知機は専門級の範囲です。",True,"Benar."),
 (TF,"結束機・包装機 hanya masuk 専門級.","結束機・包装機は専門級の範囲です。",True,"Benar."),
 (TF,"Pengetahuan tekanan udara & uap yang dibutuhkan mesin masuk 専門級.","各機械に必要なエア及び蒸気圧力は専門級の範囲です。",True,"Benar."),
 (TF,"Operasi dasar 初級 mencakup cara berhenti darurat.","初級でも非常停止の方法を知っている必要があります。",True,"Benar."),
],
3: [
 (TF,"Linen rumah sakit mencakup 病衣 dan パジャマ.","病院寝具には病衣・パジャマが含まれます。",True,"Benar."),
 (TF,"Linen hotel mencakup テーブルクロス dan ナプキン.","ホテルリネンにはテーブルクロスやナプキンが含まれます。",True,"Benar."),
 (TF,"ドローシーツ termasuk linen rumah sakit.","ドローシーツは病院寝具関係です。",True,"Benar."),
],
4: [
 (TF,"Pemeriksaan perawatan 初級 mencakup kelonggaran/putus sabuk dan pita pemandu.","ベルト及びガイドテープのゆるみや切れの確認は初級の範囲です。",True,"Benar."),
 (TF,"Praktik 専門級: ganti tali mesin pengikat lalu ikat linen.","結束機の紐を交換し、リネンを結束する作業ができること。",True,"Benar."),
 (TF,"Kerusakan mesin yang bukan チョコ停 dilaporkan ke kepala pabrik.","チョコ停以外の故障は工場長に報告します。",True,"Benar."),
 (MC,"チョコ停 adalah…","チョコ停とは？",(["Mesin berhenti sementara yang bisa pulih dengan perawatan ringan","Kerusakan besar mesin","Pergantian shift"],0),"Berhenti sebentar, pulih dengan penanganan ringan."),
],
5: [
 (TF,"Cakupan K3 menurut 試験基準 meliputi pendidikan K3 saat direkrut.","雇い入れ時等の安全衛生教育は範囲に含まれます。",True,"Benar."),
 (TF,"Cakupan K3 meliputi 整理・整頓・清掃・清潔・躾.","整理・整頓・清掃・清潔・躾の遵守が含まれます。",True,"Benar."),
],
}
