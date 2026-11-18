# -*- coding: utf-8 -*-
TF="tf"; MC="mc"
OFF = []  # sample resmi 禁転載 → tidak disalin
def t(no,q,jp,a,e): return (TF,q,jp,a,e)
GEN = {
1: [
 t(1,"Penyelenggara ujian 軌道整備 adalah 日本鉄道施設協会.","試験実施機関は日本鉄道施設協会です。",True,"Benar."),
 t(1,"Waktu ujian 学科 + 実技 total 80 menit.","試験時間は学科と実技を合わせて80分。",True,"Benar."),
 t(1,"学科 30 soal dan 実技 20 soal.","学科30問、実技20問。",True,"Benar."),
 t(1,"Lulus bila total gabungan 学科+実技 ≥ 65%, walau satu bagian rendah.","学科と実技の合計で65%あれば、片方が低くても合格。",False,"Salah: tiap bagian ≥ 65%."),
 t(1,"Biaya ujian 8.000 yen (termasuk pajak).","受験料は8,000円（税込）。",True,"Benar."),
 t(1,"Usia minimal peserta 17 tahun.","受験資格は17歳以上。",True,"Benar."),
 t(1,"Syarat bahasa: JFT-Basic atau JLPT N4 ke atas.","日本語は国際交流基金日本語基礎テストまたはJLPT N4以上。",True,"Benar."),
 t(1,"Boleh membawa soal ujian pulang.","問題用紙は持ち帰れる。",False,"Salah."),
 t(1,"Sertifikat lulus berlaku 10 tahun.","合格証明書の有効期限は10年。",True,"Benar."),
 (MC,"Kementerian yang mengawasi bidang perkeretaapian SSW:","鉄道分野を所管する省は？",(["MLIT 国土交通省","MEXT","MAFF","METI"],0),"国土交通省 (MLIT)."),
],
2: [
 t(2,"軌間 adalah jarak antara dua rel.","軌間は二本のレールの間隔である。",True,"Benar."),
 t(2,"Jarak antar pusat jalur disebut 軌間.","線路の中心間の距離を軌間という。",False,"Salah: itu 線間距離."),
 t(2,"Lebar sepur konvensional JR umumnya 1.067 mm.","JR在来線の軌間は一般に1,067mmである。",True,"Benar."),
 t(2,"Balas (バラスト) adalah bahan yang mudah hancur.","バラストは壊れやすい材料である。",False,"Salah: harus keras dan kuat."),
 t(2,"まくらぎ menjaga jarak rel dan meneruskan beban.","まくらぎはレールの間隔を保ち荷重を伝える。",True,"Benar."),
 t(2,"Tie plate hanya dipasang di sambungan rel.","タイプレートはレール継目だけに使う。",False,"Salah."),
 t(2,"Rel, bantalan dan pengikat bersama membentuk 軌きょう.","レール・まくらぎ・締結装置で軌きょうを構成する。",True,"Benar."),
 t(2,"高低狂い adalah kelainan naik-turun sepanjang rel.","高低狂いはレールの上下方向の狂いである。",True,"Benar."),
 t(2,"通り狂い adalah kelainan ke samping (kelurusan).","通り狂いは左右方向の狂いである。",True,"Benar."),
 t(2,"水準 adalah beda tinggi rel kiri dan kanan.","水準は左右レールの高さの差である。",True,"Benar."),
 (MC,"Pekerjaan yang memadatkan balas untuk memperbaiki kelainan lintas:","軌道狂いを直すため道床を固める作業は？",(["つき固め","分岐","踏切","継目"],0),"つき固め (tamping)."),
],
3: [
 t(3,"Pada 通り整正, kelainan diukur sebelum dan sesudah kerja.","通り整正では作業の前後に狂いを測る。",True,"Benar."),
 t(3,"軌道検測 mengukur 高低 dan 通り.","軌道検測は高低・通りなどの変位を測る。",True,"Benar."),
 t(3,"Alat ukur tidak perlu diperiksa sebelum dipakai.","検測器具は事前に点検しなくてよい。",False,"Salah."),
 t(3,"Mengangkat rel adalah pekerjaan pendukung penggantian rel.","レールの吊り上げはレール交換の付帯作業である。",True,"Benar."),
 t(3,"道床掘削 adalah pekerjaan pendukung penggantian bantalan.","道床掘削はまくらぎ交換の付帯作業である。",True,"Benar."),
 t(3,"脱線防止ガード termasuk perangkat pengaman yang dipasang/diganti.","脱線防止ガードは保安設備の一つである。",True,"Benar."),
 t(3,"Pekerjaan balas termasuk membentuk penampang balas.","バラスト作業には道床形状の形成がある。",True,"Benar."),
 (MC,"Yang BUKAN pekerjaan utama 軌道整備:","軌道整備の作業でないものは？",(["レール交換","まくらぎ交換","車両の塗装","バラスト作業"],2),"Mengecat kendaraan tidak termasuk."),
],
4: [
 t(4,"Kebocoran oli kecil tidak perlu dilaporkan.","わずかな油漏れは報告しなくてよい。",False,"Salah: lapor semua kelainan."),
 t(4,"Alat kotor dibersihkan setelah dipakai.","汚れた工具は使用後に清掃する。",True,"Benar."),
 t(4,"Sebelum kerja di lintas ada rapat pagi dan pemeriksaan alat.","作業前にミーティングと工具点検を行う。",True,"Benar."),
 t(4,"Ikuti instruksi penjaga (見張員).","見張員の指示に従う。",True,"Benar."),
 t(4,"Bila ada orang berjalan di lintas di luar perlintasan, abaikan saja.","線路内に人がいても放置する。",False,"Salah: hentikan kereta/laporkan."),
 t(4,"APD seperti helm dan sepatu pengaman dipakai di lintas.","ヘルメットや安全靴などの保護具を着用する。",True,"Benar."),
 (MC,"Orang yang mengawasi datangnya kereta saat kerja di lintas:","列車の接近を見張る人は？",(["見張員","運転士","検査員","駅長"],0),"見張員."),
],
}
