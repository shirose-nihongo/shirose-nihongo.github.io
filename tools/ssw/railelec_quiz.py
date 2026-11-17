# -*- coding: utf-8 -*-
TF="tf"; MC="mc"
OFF = []
def t(no,q,jp,a,e): return (TF,q,jp,a,e)
GEN = {
1: [
 t(1,"Penyelenggara ujian 電気設備整備 adalah 鉄道電業安全協会.","試験実施機関は鉄道電業安全協会です。",True,"Benar."),
 t(1,"Waktu ujian 学科 + 実技 total 80 menit.","試験時間は学科と実技で合計80分。",True,"Benar."),
 t(1,"学科 30 soal, 実技 20 soal.","学科30問、実技20問。",True,"Benar."),
 t(1,"Lulus ≥ 65% pada tiap bagian.","学科・実技それぞれ65%以上で合格。",True,"Benar."),
 t(1,"Biaya peserta non-anggota ¥13.200 (termasuk pajak).","会員以外の受験料は13,200円（税込）。",True,"Benar."),
 t(1,"Sertifikat lulus diterbitkan langsung ke peserta, bukan lewat perusahaan.","合格証明書は企業を通さず本人に発行される。",False,"Salah: lewat perusahaan pemberi kerja."),
 t(1,"Peserta harus datang minimal 30 menit sebelum ujian mulai.","試験開始の30分前までに会場に着く。",True,"Benar."),
 t(1,"Syarat bahasa (N4/JFT-Basic) dibutuhkan untuk permohonan COE.","日本語水準は在留資格認定証明書の申請に必要。",True,"Benar."),
 (MC,"Bagian 実技 pada ujian ini berbentuk:","実技試験の形式は？",(["Praktik memasang kabel","Soal situasi bergambar (pilih tindakan benar)","Wawancara","Menulis esai"],1),"判断等試験."),
],
2: [
 t(2,"Hukum Ohm: V = I × R.","オームの法則は V = I × R。",True,"Benar."),
 t(2,"Makin panjang kabel logam, resistansi makin besar.","導線が長いほど抵抗は大きくなる。",True,"Benar."),
 t(2,"Makin besar penampang kabel, resistansi makin besar.","断面積が大きいほど抵抗は大きくなる。",False,"Salah: makin kecil."),
 t(2,"Daya listrik P = V × I.","電力 P = V × I。",True,"Benar."),
 t(2,"接地 melindungi manusia dan alat dari kebocoran arus.","接地は人や機器を漏電から守る。",True,"Benar."),
 t(2,"Tegangan tinggi aman disentuh bila badan kering.","高圧は体が乾いていれば触れても安全。",False,"Salah."),
 (MC,"R = ρL/A: bila L 2 kali, A tetap, R menjadi:","導線の長さが2倍、断面積同じなら抵抗は？",(["½","tetap","2 kali","4 kali"],2),"R ∝ L → 2 kali."),
 (MC,"Arus 2 A, hambatan 5 Ω → tegangan:","電流2A、抵抗5Ωの電圧は？",(["2,5 V","7 V","10 V","25 V"],2),"V = I×R = 10 V."),
],
3: [
 t(3,"電車線 adalah kawat kontak yang menyuplai listrik ke kereta.","電車線は電車に電気を供給する線である。",True,"Benar."),
 t(3,"避雷器 melindungi peralatan dari lonjakan petir.","避雷器は雷による過電圧から機器を守る。",True,"Benar."),
 t(3,"Transformator termasuk peralatan gardu.","変圧器は変電所等設備である。",True,"Benar."),
 t(3,"転てつ装置 menggerakkan wesel.","転てつ装置は分岐器を動かす。",True,"Benar."),
 t(3,"踏切遮断機 adalah palang perlintasan.","踏切遮断機は踏切の遮断かんである。",True,"Benar."),
 t(3,"Alarm perlintasan termasuk 信号保安設備 (bukan 踏切保安設備).","踏切警報機は信号保安設備であり踏切保安設備ではない。",False,"Salah: termasuk 踏切保安設備."),
 (MC,"Panel distribusi termasuk kelompok:","配電盤が入るのは？",(["電気機器等設備","踏切保安設備","電路設備のみ","車両"],0),"電気機器等設備."),
],
4: [
 t(4,"Sebelum kerja pastikan tegangan padam.","作業前に無電圧を確認する。",True,"Benar."),
 t(4,"Pada ketinggian pakai harness dan kaitkan ke titik kuat.","高所では墜落制止用器具を使用する。",True,"Benar."),
 t(4,"Sarung tangan biasa cukup untuk bagian bertegangan.","充電部には普通の軍手で触れてよい。",False,"Salah: pakai isolasi."),
 t(4,"Laporkan kelainan segera.","異常はすぐに報告する。",True,"Benar."),
 t(4,"Alat uji tidak perlu diperiksa.","検電器などは点検しなくてよい。",False,"Salah."),
 t(4,"Patuhi 見張員 saat kerja di lintas.","線路での作業では見張員の指示に従う。",True,"Benar."),
],
5: [
 t(5,"連動装置 mencegah sinyal & wesel membentuk rute berbahaya.","連動装置は信号と転てつ器の危険な組合せを防ぐ。",True,"Benar."),
 t(5,"軌道回路 mendeteksi ada tidaknya kereta di blok.","軌道回路は列車の在線を検知する。",True,"Benar."),
 t(5,"ATS menghentikan kereta otomatis saat melewati sinyal berhenti.","ATSは停止信号を越えると自動で列車を止める。",True,"Benar."),
 t(5,"Palang perlintasan naik saat kereta mendekat.","踏切遮断機は列車接近時に上がる。",False,"Salah: turun."),
 t(5,"障害物検知装置 mendeteksi kendaraan terjebak di perlintasan.","障害物検知装置は踏切内の支障物を検知する。",True,"Benar."),
 (MC,"Alat yang menghubungkan sinyal dan wesel secara aman:","信号と転てつ器を安全に結び付ける装置は？",(["連動装置","変圧器","配電盤","整流器"],0),"連動装置."),
],
}
