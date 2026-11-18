# -*- coding: utf-8 -*-
"""Soal tambahan orisinal Auto Maintenance (○× per bab sesuai cakupan JASPA + simulasi 実技 3 tugas).
Orisinal buatan Shirose, BUKAN soal resmi. Idempoten. Jalankan dari akar repo."""
import json
F="data/ssw/auto-maintenance/quiz.json"
T=lambda s,v,e:{"q":{"id":"Benar atau salah: “"+s+"”"},"opts":[{"id":"Benar (○)"},{"id":"Salah (×)"}],"a":0 if v else 1,"exp":{"id":e},"mb":True}
def M(q,c,w,e,k):
    o=[c]+w; r=k%len(o); o=o[-r:]+o[:-r] if r else o
    return {"q":{"id":q},"opts":[{"id":x} for x in o],"a":o.index(c),"exp":{"id":e}}
X={
"bab1":[("Mobil sedan, station wagon, dan van satu boks termasuk jenis bentuk bodi mobil.",1,"Itu contoh jenis bentuk bodi."),
("Lampu rem (制動灯) menyala saat pedal gas diinjak.",0,"Lampu rem menyala saat pedal rem diinjak."),
("Kap mesin (ボンネット) menutup ruang mesin di bagian depan mobil.",1,"Betul, kap mesin ada di depan."),
("Perawatan pencegahan (予防保全) bertujuan mencegah kerusakan sebelum terjadi.",1,"Itulah inti perawatan pencegahan."),
("Pelat nomor dipasang hanya di bagian belakang mobil.",0,"Pelat nomor dipasang di depan dan belakang.")],
"bab2":[("Urutan mesin 4 langkah adalah hisap, kompresi, usaha (ledakan), buang.",1,"Itu urutan yang benar."),
("Oli mesin hanya berfungsi melumasi dan tidak ikut mendinginkan.",0,"Oli juga membantu pendinginan, perapat, dan pembersih."),
("Busi (点火プラグ) berfungsi memercikkan api untuk membakar campuran pada mesin bensin.",1,"Busi menyalakan campuran bahan bakar dan udara."),
("Tutup radiator boleh dibuka saat mesin masih sangat panas.",0,"Berbahaya: air panas bertekanan dapat menyembur."),
("Coolant (cairan pendingin) bagian dari sistem pendingin.",1,"Coolant bersirkulasi melalui radiator dan mesin.")],
"bab3":[("Rem cakram terdiri dari cakram (disc), kaliper, dan kampas (pad).",1,"Itu komponen utamanya."),
("Tekanan angin ban yang terlalu rendah tidak memengaruhi keausan ban.",0,"Tekanan rendah membuat ban cepat aus dan boros bahan bakar."),
("Pegas keong (コイルスプリング) adalah bagian dari suspensi.",1,"Pegas menyerap guncangan jalan."),
("Minyak rem (ブレーキフルード) boleh dicampur dengan oli mesin.",0,"Jangan dicampur; jenisnya berbeda dan merusak sistem."),
("Pada rem tromol, silinder roda mendorong kampas ke tromol.",1,"Betul.")],
"bab4":[("Saat melepas kabel aki, lepas terminal negatif (−) terlebih dahulu.",1,"Itu mencegah korsleting dengan bodi."),
("Sekring (ヒューズ) yang putus boleh diganti dengan kawat biasa.",0,"Harus diganti sekring dengan kapasitas ampere yang sama."),
("Alternator berfungsi mengisi aki saat mesin hidup.",1,"Alternator membangkitkan listrik."),
("Pada kendaraan hybrid, kabel tegangan tinggi biasanya berwarna oranye.",1,"Warna oranye menandakan tegangan tinggi."),
("Lampu peringatan aki yang menyala saat mesin hidup selalu berarti normal.",0,"Itu menandakan masalah pengisian.")],
"bab5":[("Pemeriksaan harian mencakup cek oli, air pendingin, tekanan ban, dan lampu.",1,"Itu bagian pemeriksaan harian."),
("Saat menggunakan dongkrak, cukup berdiri di bawah mobil yang hanya ditopang dongkrak.",0,"Wajib pakai jack stand; jangan di bawah mobil yang hanya didongkrak."),
("5S: seiri, seiton, seisō, seiketsu, shitsuke.",1,"Itulah lima unsur 5S."),
("Oli bekas boleh dibuang ke selokan.",0,"Harus ditampung dan dibuang sesuai aturan limbah."),
("Menggunakan alat pelindung diri (APD) adalah bagian dari keselamatan kerja.",1,"Misalnya sarung tangan, kacamata, sepatu safety.")],
"bab6":[("Kunci torsi dipakai untuk mengencangkan baut sesuai torsi yang ditentukan.",1,"Itu fungsinya."),
("Obeng boleh dipakai sebagai pahat atau pengungkit.",0,"Itu merusak alat dan berbahaya."),
("Jangka sorong (ノギス) dapat mengukur diameter luar dan dalam.",1,"Betul."),
("Palu karet cocok dipakai bila tidak ingin merusak permukaan komponen.",1,"Karet lebih lembut dari baja."),
("Oli mesin dan minyak rem dapat saling menggantikan.",0,"Fungsi dan jenisnya berbeda.")],
"bab7":[("Sebelum bekerja, periksa kondisi alat dan siapkan area kerja yang rapi.",1,"Persiapan adalah langkah awal."),
("Saat merakit, baut dikencangkan sesuai torsi yang ditentukan.",1,"Hindari terlalu kencang atau longgar."),
("Pada ganti oli, kuras oli bekas lalu pasang kembali baut pembuang dengan paking yang layak.",1,"Paking yang rusak diganti."),
("Setelah memasang roda, baut roda cukup dikencangkan dengan tangan saja.",0,"Harus dikencangkan sesuai torsi, dikencangkan bersilang."),
("Hasil kerja perlu dicek kembali dan dilaporkan kepada atasan.",1,"Pelaporan bagian dari alur kerja.")]}
J=[("bab7-qj1","Simulasi 実技 tugas 1: Ganti oli",[
 ("Urutan benar dalam ganti oli adalah…","Naikkan mobil dengan aman → buka baut pembuang → kuras oli → pasang baut dan paking → isi oli baru → cek level",["Isi oli baru → buka baut pembuang → turunkan mobil","Pasang baut pembuang → kuras oli → naikkan mobil"],"Kuras dulu, baru isi oli baru, lalu cek level."),
 ("Setelah isi oli baru, yang harus dilakukan adalah…","Cek level oli dengan dipstick dan periksa kebocoran",["Langsung jalankan mobil tanpa cek","Menambah oli sampai tumpah"],"Level dan kebocoran harus dicek."),
 ("Apa yang dilakukan dengan paking baut pembuang yang rusak?","Diganti baru",["Dipakai lagi","Diganti dengan lakban"],"Paking rusak menyebabkan bocor.")]),
("bab7-qj2","Simulasi 実技 tugas 2: Ganti roda dan cek ban",[
 ("Urutan kerja yang aman melepas roda adalah…","Longgarkan baut → dongkrak → pasang jack stand → lepas baut",["Dongkrak → lepas baut → longgarkan baut","Lepas semua baut → dongkrak"],"Longgarkan dulu saat roda masih menapak."),
 ("Baut roda dikencangkan dengan…","Kunci torsi sesuai nilai yang ditentukan, bersilang",["Tenaga sebesar mungkin","Hanya tangan"],"Pakai torsi dan pola bersilang."),
 ("Alat untuk mengukur tekanan ban adalah…","Pengukur tekanan ban (タイヤゲージ)",["Jangka sorong","Feeler gauge"],"Tire gauge mengukur tekanan.")]),
("bab7-qj3","Simulasi 実技 tugas 3: Pemeriksaan sederhana",[
 ("Alat untuk mengukur celah dengan lembar tipis adalah…","Feeler gauge (シックネスゲージ)",["Dial gauge","Tire gauge"],"Feeler gauge cocok untuk celah."),
 ("Sebelum membuka tutup radiator, pastikan…","Mesin sudah dingin",["Mesin hidup","Kipas mati saja"],"Tekanan panas berbahaya."),
 ("Setelah selesai kerja, hal yang dilakukan adalah…","Cek hasil, bereskan alat, laporkan",["Tinggalkan alat","Langsung pulang"],"Itu bagian 5S dan alur kerja.")])]
def main():
    q=json.load(open(F,encoding="utf-8"));n=0
    for b,L in X.items():
        gid=b+"-qx"
        if any(g["id"]==gid for g in q["bab"][b]):continue
        q["bab"][b].append({"id":gid,"title":{"id":"Tambahan ○× sesuai cakupan JASPA"},"items":[T(*x) for x in L]});n+=len(L)
    for gid,t,L in J:
        if any(g["id"]==gid for g in q["bab"]["bab7"]):continue
        q["bab"]["bab7"].append({"id":gid,"title":{"id":t},"items":[M(a,c,w,e,i) for i,(a,c,w,e) in enumerate(L)]});n+=len(L)
    json.dump(q,open(F,"w",encoding="utf-8"),ensure_ascii=False,indent=1)
    print("soal baru:",n)
main()
