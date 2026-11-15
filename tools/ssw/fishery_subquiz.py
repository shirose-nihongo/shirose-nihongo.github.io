#!/usr/bin/env python3
"""Tambah latihan per subbab (<subId>-q) ke data/ssw/fishery/quiz.json.

Soal orisinal Shirose Nihongo, disusun dari isi subbab (ringkasan + teks modul).
Tidak mengubah/menghapus grup soal lama; hanya menambah grup baru per subbab.
Jalankan dari akar repo: python3 tools/ssw/fishery_subquiz.py
"""
import json, hashlib, os

D = "data/ssw/fishery/"
T, F = True, False

# Format: ("mc", pertanyaan, benar, [salah1, salah2], penjelasan)
#         ("tf", pernyataan, benar?, penjelasan)
S = {
"b1s1": [
 ("mc", "Tiga negara dengan produksi perikanan + budidaya terbesar di dunia (2021) adalah…", "Cina, Indonesia, India", ["Jepang, Cina, India", "India, Norwegia, Cina"], "Urutannya Cina (sekitar 89 juta ton), Indonesia (sekitar 22 juta ton), India (sekitar 16 juta ton)."),
 ("tf", "Produksi perikanan Jepang mencapai puncak pada tahun 1984, lalu menurun.", T, "Benar, puncaknya 1984."),
 ("mc", "Perikanan dengan kapal kecil di sepanjang pantai (termasuk jaring tetap) disebut…", "Perikanan pantai (沿岸漁業)", ["Perikanan laut jauh (遠洋漁業)", "Perikanan perairan darat (内水面漁業)"], "Perikanan pantai memakai kapal kecil dekat pantai."),
 ("tf", "Perikanan pantai tidak mencakup jaring tetap (定置網).", F, "Salah: jaring tetap termasuk perikanan pantai."),
 ("mc", "Mengapa kapal dan alat tangkap harus disesuaikan?", "Karena perikanan dipengaruhi alam dan ikan sasaran berbeda-beda", ["Karena aturan warna kapal", "Karena jumlah awak selalu sama"], "Kapal dan alat disesuaikan dengan ikan sasaran dan kondisi alam."),
],
"b1s2": [
 ("mc", "Lampu navigasi di lambung kiri (左舷灯) berwarna…", "Merah", ["Hijau", "Putih"], "Lambung kiri merah, lambung kanan hijau; tiang dan buritan putih."),
 ("mc", "取舵 (torikaji) berarti mengemudikan kapal ke…", "Kiri", ["Kanan", "Mundur"], "取舵 = kiri; 面舵 (omokaji) = kanan."),
 ("tf", "Tateyure adalah goyangan kapal memanjang (pitching) dan yokoyure goyangan ke samping (rolling).", T, "Benar."),
 ("mc", "Siapa yang bertanggung jawab atas seluruh operasi penangkapan ikan?", "漁労長 (kepala operasi penangkapan)", ["船長 (nakhoda, pelayaran)", "機関長 (kepala mesin)"], "漁労長 memimpin penangkapan; 船長 mengurus pelayaran."),
 ("mc", "機関長 bertanggung jawab atas…", "Mesin dan pendingin", ["Pelayaran kapal", "Seluruh operasi penangkapan"], "機関長 = kepala kamar mesin dan pendingin."),
],
"b1s3": [
 ("mc", "Huruf “S” untuk dasar laut pada peta laut berarti…", "Pasir", ["Lumpur", "Batu"], "S = pasir, G = lumpur, R = batu."),
 ("mc", "Deviasi (偏差) adalah selisih antara…", "Utara sejati dan utara magnetik", ["Kedalaman dan pasang surut", "Arah kapal dan arah angin"], "Deviasi = selisih utara sejati dan utara magnetik."),
 ("tf", "Kedalaman pada peta laut diukur dari permukaan air terendah.", T, "Benar; ketinggian di darat dari permukaan air rata-rata."),
 ("mc", "Menurut aturan navigasi, jika berpapasan dengan kapal dari depan, kapal harus…", "Belok ke kanan", ["Belok ke kiri", "Berhenti total"], "Berpapasan dari depan: masing-masing belok kanan."),
 ("tf", "Ketinggian di darat pada peta laut diukur dari permukaan air terendah.", F, "Salah: ketinggian di darat dari permukaan air rata-rata."),
],
"b1s4": [
 ("mc", "Pasang merah (赤潮) menyebabkan ikan dan kerang mati karena…", "Plankton meningkat, oksigen berkurang, dan insang tersumbat", ["Suhu air turun drastis", "Salinitas menjadi nol"], "Plankton meningkat sehingga oksigen berkurang dan insang tersumbat."),
 ("tf", "Upwelling (湧昇流) membawa air dingin kaya nutrisi ke atas dan sering menjadi tempat penangkapan yang baik.", T, "Benar."),
 ("mc", "Salinitas air laut kira-kira…", "33–37‰", ["3–7‰", "133–137‰"], "Salinitas laut sekitar 33–37 permil."),
 ("mc", "Jaring dibagi menjadi dua jenis berdasarkan…", "Bersimpul dan tanpa simpul", ["Siang dan malam", "Kayu dan besi"], "Jaring: bersimpul (結節網) dan tanpa simpul (無結節網)."),
 ("tf", "Pasang merah terjadi karena plankton berkurang.", F, "Salah: plankton meningkat secara berlebihan."),
],
"b1s5": [
 ("mc", "本結び (reef knot) dipakai untuk…", "Menyambung dua tali yang sama tebal", ["Menambat tali di tiang", "Menyambung tali berbeda tebal dan licin"], "本結び menyambung dua tali sama tebal."),
 ("mc", "もやい結び dipakai terutama sebagai…", "Tali tambat pada tiang; aman dan mudah dilepas", ["Penyambung dua tali licin", "Pengunci kail"], "もやい結び kuat tetapi mudah dilepas."),
 ("tf", "二重つなぎ dipakai bila tali berbeda tebal atau licin.", T, "Benar."),
 ("mc", "Back splice, eye splice, dan short splice adalah…", "Anyaman untuk merapikan atau menyambung ujung tali", ["Tiga jenis jangkar", "Tiga jenis kail"], "Itu adalah teknik anyaman tali."),
 ("tf", "もやい結び sulit dilepas setelah dibebani.", F, "Salah: もやい結び aman namun mudah dilepas."),
],
"b1s6": [
 ("mc", "Untuk ikan bergigi tajam, senar (ハリス) sebaiknya memakai…", "Kawat", ["Benang katun", "Tali plastik tipis"], "Ikan bergigi tajam memotong senar biasa."),
 ("mc", "Fungsi kili-kili (より戻し) adalah…", "Mencegah tali terpelintir", ["Menambah daya apung", "Mengukur kedalaman"], "より戻し mencegah tali terpilin."),
 ("mc", "ライン ホーラー adalah mesin untuk…", "Menarik tali utama longline", ["Menarik jaring insang", "Mengukur kedalaman"], "ライン ホーラー = penarik tali utama."),
 ("mc", "ネット ホーラー adalah mesin untuk…", "Menarik jaring insang", ["Menarik tali utama longline", "Menggulung tali cabang"], "ネット ホーラー menarik jaring insang."),
 ("tf", "Senar (ハリス) menghubungkan kail dengan tali.", T, "Benar."),
],
"b2s1": [
 ("tf", "Ujung baju sebaiknya dimasukkan ke dalam celana agar tidak tersangkut mesin.", T, "Benar."),
 ("mc", "Alat pelindung yang dipakai agar tetap mengapung bila jatuh ke laut adalah…", "Jaket pelampung", ["Penutup telinga", "Kacamata pelindung"], "Jaket pelampung menjaga tubuh tetap mengapung."),
 ("mc", "Pakaian kerja di kapal sebaiknya…", "Lengan panjang dan pas ukuran", ["Lengan pendek dan longgar", "Sangat longgar agar leluasa"], "Pakaian longgar mudah tersangkut."),
 ("mc", "Mana yang BUKAN alat pelindung di kapal?", "Sandal terbuka", ["Helm", "Sarung tangan"], "Sandal tidak boleh dipakai di geladak."),
 ("tf", "Bekerja di ketinggian cukup berpegangan tanpa sabuk pengaman.", F, "Salah: wajib memakai sabuk pengaman."),
],
"b2s2": [
 ("tf", "Duduk atau memanjat pagar kapal (舷側) diperbolehkan jika berhati-hati.", F, "Dilarang; sangat mudah jatuh ke laut."),
 ("mc", "Jika harus ke geladak pada malam hari…", "Beri tahu awak lain dan jangan sendirian", ["Pergi diam-diam agar tidak mengganggu", "Matikan semua lampu"], "Jangan sendirian di geladak malam hari."),
 ("mc", "Rambu keselamatan yang menyatakan suatu tindakan dilarang disebut rambu…", "Larangan", ["Instruksi", "Panduan"], "Rambu terbagi: larangan, instruksi, peringatan, umum, panduan."),
 ("mc", "Palka (lubang geladak) sebaiknya…", "Ditutup bila tidak dipakai", ["Dibiarkan terbuka", "Dipakai sebagai tempat duduk"], "Palka terbuka berbahaya."),
 ("tf", "Alat sebaiknya disimpan kembali di tempatnya.", T, "Benar."),
],
"b2s3": [
 ("tf", "Boleh memasukkan kaki ke dalam lingkaran gulungan tali asalkan sebentar.", F, "Dilarang; kaki bisa terlilit dan tertarik."),
 ("mc", "Penyebab utama kecelakaan di kapal ikan antara lain…", "Terlilit winch atau tali, jatuh dari derek, jatuh ke laut", ["Kekurangan air tawar", "Salah memilih umpan"], "Itulah tiga kecelakaan utama."),
 ("mc", "Untuk mengangkat beban berat sebaiknya…", "Dibantu beberapa orang", ["Dikerjakan sendirian dengan cepat", "Ditarik sambil berlari"], "Beban berat dikerjakan bersama."),
 ("tf", "Boleh bekerja membelakangi bukaan kapal.", F, "Salah: jangan membelakangi bukaan karena risiko jatuh."),
 ("mc", "Untuk mengurangi risiko terpeleset, pakailah…", "Sepatu anti-selip", ["Sandal karet", "Kaus kaki saja"], "Sepatu anti-selip mencegah terpeleset."),
],
"b3s1": [
 ("mc", "Dua cara operasi pukat cincin adalah…", "Kapal tunggal dan armada (kapal pengiring)", ["Siang saja dan malam saja", "Kapal besi dan kapal kayu"], "Ada kapal tunggal dan armada."),
 ("mc", "Pada pukat cincin malam hari, ikan dikumpulkan dengan…", "Lampu", ["Umpan hidup", "Bunyi sonar"], "Lampu mengumpulkan ikan."),
 ("tf", "Pukat cincin tidak pernah dipakai untuk menangkap tuna.", F, "Sasarannya antara lain teri, sarden, aji, saba, katsuo, tuna, buri."),
 ("mc", "Tujuan menarik tali cincin adalah…", "Agar ikan tidak lolos dari bawah jaring", ["Menaikkan layar", "Mematikan mesin"], "Tali cincin menutup bagian bawah jaring."),
 ("tf", "Pada cara armada, ada kapal pengiring selain kapal jaring.", T, "Benar."),
],
"b3s2": [
 ("mc", "Power block berfungsi…", "Mengangkat bundel jaring ke posisi tinggi untuk dirapikan", ["Menarik tali cincin", "Mencari gerombolan ikan"], "Power block mengangkat jaring agar tertata."),
 ("mc", "Pursue winch dipakai untuk…", "Menarik tali cincin", ["Menyemprot air", "Mengukur kedalaman"], "Pursue winch menarik tali cincin."),
 ("mc", "Alat di anjungan untuk mencari gerombolan ikan adalah…", "Sonar dan fish finder", ["Kompas saja", "Pelampung bola"], "Sonar dan fish finder."),
 ("tf", "Side roller dipasang di sisi kanan dan jaring ditarik dengan gesekan.", T, "Benar."),
 ("mc", "Mana yang BUKAN peralatan mesin pukat cincin?", "Line shooter (rawai)", ["Net hauler", "Power block"], "Line shooter adalah alat rawai tuna."),
],
"b3s3": [
 ("mc", "Setelah ikan dikumpulkan dengan lampu, langkah berikutnya adalah…", "Menebar jaring", ["Pulang ke pelabuhan", "Mematikan sonar"], "Urutan: cari, kumpulkan, tebar jaring, kencangkan cincin, ambil ikan."),
 ("mc", "Kapal pukat cincin harian biasanya…", "Berangkat sore, pulang pagi, mendarat di pasar", ["Berangkat pagi, pulang sore", "Berlayar berbulan-bulan"], "Kapal harian berangkat sore dan pulang pagi."),
 ("tf", "Saat menebar jaring, kaki bisa terlilit tali atau jaring.", T, "Benar, karena itu harus waspada."),
 ("mc", "Untuk mencari gerombolan ikan dipakai…", "Sonar dan fish finder", ["Kompas", "Lampu navigasi"], "Sonar dan fish finder."),
 ("tf", "Kapal harian berangkat pagi dan pulang sore.", F, "Salah: berangkat sore, pulang pagi."),
],
"b4s1": [
 ("mc", "“Menusuk” (刺す) pada jaring insang berarti…", "Ikan terjepit di mata jaring", ["Duri terlilit benang jaring", "Ikan dikurung dalam lingkaran"], "Menusuk = terjepit di mata jaring."),
 ("mc", "“Menjerat” (からめる) berarti…", "Duri atau sirip terlilit benang jaring", ["Ikan terjepit di mata jaring", "Ikan dikurung lampu"], "Menjerat = duri/sirip terlilit."),
 ("mc", "Jaring insang digolongkan menurut…", "Lapisan air dan cara pasang (tetap atau hanyut)", ["Warna jaring", "Panjang kapal"], "Lapisan air dan cara pasang."),
 ("mc", "Berapa kombinasi lapisan air × cara pasang jaring insang?", "6 kombinasi", ["2 kombinasi", "12 kombinasi"], "3 lapisan × 2 cara pasang = 6."),
 ("tf", "Jaring insang hanya bisa dipasang di dasar laut.", F, "Bisa di permukaan, tengah, atau dasar."),
],
"b4s2": [
 ("mc", "Pelampung jaring insang zaman sekarang umumnya terbuat dari…", "Plastik resin sintetis", ["Kayu atau bambu", "Gabus alami"], "Dulu kayu/bambu/gabus; kini resin sintetis."),
 ("mc", "Bahan pemberat yang umum dipakai adalah…", "Timbal", ["Kayu", "Karet"], "Pemberat umumnya dari timbal."),
 ("tf", "Pelampung harus punya daya apung lebih dan tahan tekanan air.", T, "Benar."),
 ("mc", "Dua tali utama pada jaring insang adalah…", "Tali pelampung dan tali pemberat", ["Tali jangkar dan tali kail", "Tali layar dan tali kemudi"], "Tali pelampung dan tali pemberat."),
 ("tf", "Pemberat timbal berbentuk tong dengan lubang untuk tali.", T, "Benar."),
],
"b5s1": [
 ("mc", "Tiga bagian utama jaring pukat dasar adalah…", "Sayap, badan, dan kantong", ["Kepala, ekor, dan sirip", "Pelampung, pemberat, dan tali"], "Sayap (袖網), badan (身網), kantong (袋網)."),
 ("mc", "Mata jaring terbesar ada di…", "Ujung depan sayap", ["Kantong", "Badan tengah"], "Besar di depan, terkecil di kantong."),
 ("tf", "Papan pembuka (オッターボード) membuka mulut jaring.", T, "Benar."),
 ("mc", "Papan pembuka umumnya terbuat dari…", "Besi, kayu, atau FRP", ["Kaca", "Kertas"], "Besi, kayu, atau FRP."),
 ("tf", "Otter trawl tetap bisa dioperasikan saat cuaca buruk.", T, "Benar, menurut modul."),
],
"b5s2": [
 ("mc", "Pada pukat dua kapal, jaring ditarik oleh…", "Dua kapal pada jarak tertentu", ["Satu kapal kecil", "Pelampung otomatis"], "Dua kapal menarik ujung jaring."),
 ("tf", "Kapal pendukung menyerahkan ujung tali penarik kepada kapal utama.", T, "Benar."),
 ("mc", "Tali tarik yang panjang berfungsi…", "Menggiring ikan ke arah jaring", ["Mengukur kedalaman", "Mengikat umpan"], "Tali panjang menggiring ikan."),
 ("tf", "Pukat dua kapal bisa dilakukan dengan sedikit kapal dan tenaga.", F, "Salah: butuh banyak kapal dan tenaga."),
 ("mc", "Bahaya yang perlu diwaspadai saat jaring ditarik adalah…", "Terlilit tali", ["Kekurangan es", "Pasang merah"], "Awak bisa terlilit tali."),
],
"b6s1": [
 ("mc", "Mata jaring pagar (垣網) berukuran…", "30–90 cm", ["1–3 cm", "3–9 cm"], "Mata jaring pagar sangat besar."),
 ("mc", "Keunggulan jaring tetap menurut modul adalah…", "Tangkapan hidup sehingga pengiriman mudah diatur", ["Selalu menangkap satu jenis ikan", "Tidak memerlukan kapal"], "Ikan hidup memudahkan pengaturan pengiriman."),
 ("mc", "運動場 pada jaring tetap adalah…", "Area gerak ikan", ["Pintu masuk jaring", "Pemberat jaring"], "運動場 = area gerak."),
 ("tf", "Jaring kotak (箱網) termasuk unsur jaring tetap.", T, "Benar."),
 ("tf", "Tangkapan jaring tetap selalu mati.", F, "Salah: tangkapan bisa dipertahankan hidup."),
],
"b6s2": [
 ("mc", "Jaring tetap digantung pada…", "Tali sisi (dua tali sejajar sisi laut dan sisi darat)", ["Satu tiang kapal", "Jangkar"], "Tali sisi."),
 ("mc", "Pada jaring tetap tipe kotak dua tingkat, setelah area gerak adalah…", "Jaring naik 1", ["Kotak 2", "Jaring naik 2"], "Urutan: area gerak, jaring naik 1, kotak 1, jaring naik 2, kotak 2."),
 ("mc", "Pengangkatan jaring dilakukan dengan…", "1–3 perahu", ["10 kapal besar", "Tanpa perahu"], "Pengangkatan dengan 1–3 perahu."),
 ("tf", "Perahu pengangkat jaring berukuran sekitar 5–20 ton.", T, "Benar."),
 ("tf", "Tali sisi hanya satu tali.", F, "Salah: ada dua tali sejajar."),
],
"b6s3": [
 ("mc", "Tangkapan dijaga tetap segar dengan…", "Air laut + es atau tangki ikan hidup", ["Dijemur", "Dibiarkan di geladak"], "Air laut dan es, atau tangki ikan hidup."),
 ("tf", "Pada musim panas dipakai lebih banyak es.", T, "Benar."),
 ("mc", "Salah satu bahaya pada pekerjaan jaring tetap adalah…", "Jari terjepit dan tali jangkar", ["Kekurangan umpan", "Lampu terlalu terang"], "Poros putar, derek, jari terjepit, tali jangkar."),
 ("tf", "Perahu berlambung rendah berisiko membuat awak jatuh ke laut.", T, "Benar."),
 ("mc", "Mana yang termasuk bahaya di jaring tetap?", "Terkena poros putar", ["Terlalu banyak es", "Jaring terlalu longgar"], "Waspada poros putar dan derek."),
],
"b7s1": [
 ("mc", "Keuntungan bubu berbentuk kerucut adalah…", "Stabil di kapal dan mudah ditumpuk", ["Tidak butuh umpan", "Bisa terbang"], "Bubu kerucut stabil dan mudah ditumpuk."),
 ("mc", "Cara kerja bubu adalah…", "Hewan masuk lewat lubang tetapi tidak bisa keluar", ["Menjerat dengan mata jaring", "Mengurung dengan tali cincin"], "Masuk tetapi tidak bisa keluar."),
 ("tf", "Bubu dilengkapi umpan.", T, "Benar."),
 ("mc", "Bubu dibenamkan ke…", "Dasar laut", ["Permukaan", "Langit-langit kapal"], "Bubu dibenamkan ke dasar."),
 ("tf", "Bubu udang umumnya punya dua lubang di samping.", T, "Benar."),
],
"b7s2": [
 ("mc", "Perikanan bubu kepiting terutama dilakukan di…", "Laut Jepang", ["Samudra Hindia", "Laut Karibia"], "Kepiting salju merah dan salju di Laut Jepang."),
 ("mc", "Satu deret bubu kepiting kira-kira berisi…", "150 bubu", ["5 bubu", "1.500 bubu"], "Sekitar 150 bubu per deret."),
 ("mc", "Panjang tali pelampung adalah…", "2–3 kali kedalaman air", ["Sama dengan kedalaman", "10 kali kedalaman"], "2–3 kali kedalaman."),
 ("tf", "Kapal 70–100 ton umumnya berawak 8–10 orang.", T, "Benar."),
 ("mc", "Lokasi penebaran bubu ditentukan dari…", "Suhu air, kedalaman, dan jenis dasar laut", ["Warna kapal", "Nama nakhoda"], "Suhu, kedalaman, jenis dasar."),
],
"b7s3": [
 ("mc", "Udang yang paling banyak tertangkap bubu udang adalah…", "Udang merah utara (あまえび)", ["Udang windu", "Udang karang"], "あまえび."),
 ("tf", "Bubu udang bukaan samping berbentuk kerucut.", T, "Benar."),
 ("mc", "Jarak antar bubu ditentukan oleh…", "Lebar habitat udang", ["Jumlah awak", "Warna umpan"], "Sesuai lebar habitat."),
 ("tf", "Jumlah bubu diatur oleh tiap prefektur.", T, "Benar."),
 ("mc", "Tangkapan sampingan bubu udang antara lain…", "Kerang dan siput laut", ["Paus", "Hiu paus"], "Kerang dan siput laut."),
],
"b8s1": [
 ("mc", "Pada jaring batang (棒受網), ikan sauri dikumpulkan dengan…", "Lampu", ["Umpan hidup", "Suara"], "Lampu menarik sauri."),
 ("mc", "Satu sisi jaring persegi panjang diikat pada…", "Galah (向竹) yang mengapung", ["Jangkar", "Tiang layar"], "Sisi jaring diikat pada galah."),
 ("tf", "Jaring digantung pada galah bambu yang terpisah dari kapal.", T, "Benar."),
 ("mc", "Cahaya yang memandu ikan ke arah jaring adalah…", "Lampu merah", ["Lampu hijau", "Lampu biru"], "Lampu merah memandu ikan."),
 ("tf", "Pemberat dan tali penarik dipasang di sisi atas jaring.", F, "Salah: di sisi bawah jaring."),
],
"b8s2": [
 ("mc", "Sifat sauri yang dipakai dalam operasi ini adalah…", "Fototaksis (tertarik cahaya)", ["Takut cahaya", "Tertarik suara"], "Sauri berkumpul di bawah cahaya."),
 ("mc", "Operasi dilakukan…", "Dari matahari terbenam sampai fajar", ["Siang hari", "Hanya saat tengah hari"], "Malam hari."),
 ("mc", "Lampu sisi kiri dimatikan agar…", "Ikan pindah ke sisi kanan", ["Kapal tenggelam", "Jaring terangkat"], "Ikan berpindah ke sisi terang."),
 ("tf", "Kapal berukuran 10–200 ton dengan awak 6–18 orang.", T, "Benar."),
 ("mc", "Tahap pertama operasi jaring batang adalah…", "Pencarian ikan", ["Penarikan jaring", "Pengemasan"], "Pencarian, pengumpulan, pengarahan, penarikan."),
],
"b9s1": [
 ("mc", "Mana yang termasuk ikan sasaran pancing cakalang?", "Binnaga (albakor)", ["Teri", "Sarden"], "Katsuo, binnaga, kihadamaguro, mebachi."),
 ("tf", "Perikanan ini memakai umpan hidup.", T, "Benar."),
 ("mc", "Joran pendek dipakai untuk…", "Kail tiruan", ["Umpan hidup besar", "Jaring"], "Joran pendek untuk kail tiruan."),
 ("tf", "Ada mesin pancing otomatis untuk cakalang.", T, "Benar."),
 ("mc", "Perikanan ini dilakukan di…", "Pesisir Jepang, Pasifik, dan perairan tropis", ["Hanya sungai", "Hanya danau"], "Pesisir Jepang, Pasifik, tropis."),
],
"b9s2": [
 ("mc", "Setelah gerombolan ditemukan, kapal…", "Melaju penuh dengan haluan di belakang gerombolan", ["Berhenti dan menunggu", "Mundur"], "Haluan di belakang gerombolan."),
 ("mc", "Untuk membuat ikan bersemangat, dilakukan…", "Menebar umpan hidup dan menyemprotkan air laut", ["Mematikan semua lampu", "Menurunkan jangkar"], "Umpan ditebar dan air disemprot."),
 ("tf", "Pemancing berpengalaman berada di haluan.", T, "Benar."),
 ("mc", "Pemula ditempatkan di…", "Belakang sisi kiri buritan", ["Ujung haluan", "Ruang mesin"], "Pemula di belakang sisi kiri buritan."),
 ("tf", "Air laut disemprot agar ikan bersemangat.", T, "Benar."),
],
"b10s1": [
 ("mc", "Mana yang termasuk cumi sasaran?", "Surume-ika", ["Gurita", "Teripang"], "Surume, yari, kensaki, aka-ika."),
 ("mc", "Parachute anchor (para-anchor) dipakai agar…", "Kapal hanyut mengikuti arus dan senar tidak kusut", ["Kapal melaju kencang", "Jaring terangkat"], "Para-anchor mencegah senar kusut."),
 ("tf", "Memancing cumi malam hari memakai fish lamp dan umpan tiruan.", T, "Benar."),
 ("mc", "Mesin pancing cumi otomatis memiliki…", "Reel (drum)", ["Layar", "Power block"], "Mesin otomatis punya reel."),
 ("tf", "Para-anchor mencegah senar kusut.", T, "Benar."),
],
"b10s2": [
 ("mc", "Lampu paling banyak dinyalakan…", "Saat pertama dinyalakan", ["Menjelang fajar", "Saat pulang"], "Awal menyala paling banyak."),
 ("mc", "Spanker sail berfungsi…", "Mengarahkan kapal melawan angin", ["Mengumpulkan cumi", "Mendinginkan ikan"], "Spanker sail mengarahkan haluan."),
 ("tf", "Lokasi ditentukan sebelum matahari terbenam.", T, "Benar."),
 ("mc", "Sebelum menyalakan lampu, kapal…", "Melempar para-anchor", ["Mengemas hasil", "Memasang bubu"], "Persiapan mesin, para-anchor, lampu."),
 ("tf", "Lampu dikurangi bila cumi sudah di dalam sebelum fajar.", T, "Benar."),
],
"b11s1": [
 ("tf", "Rawai tuna dilakukan di seluruh perairan dunia.", T, "Benar."),
 ("mc", "Ikan sasaran rawai tuna antara lain…", "Kuromaguro, mebachi, kihada, binnaga", ["Sarden, teri", "Udang, kepiting"], "Jenis tuna dan marlin."),
 ("mc", "Rawai tuna terdiri atas…", "Tali utama panjang, tali cabang berkail, dan pelampung bola", ["Satu jaring besar", "Satu joran"], "Tali utama + tali cabang + pelampung bola."),
 ("tf", "Marlin termasuk ikan sasaran rawai tuna.", T, "Benar."),
 ("mc", "Kuromaguro juga disebut…", "Honmaguro", ["Binnaga", "Kihada"], "Kuromaguro = honmaguro."),
],
"b11s2": [
 ("mc", "Line shooter berfungsi…", "Menebar tali utama", ["Menarik tali utama", "Mengangkat ikan"], "Line shooter menebar tali utama."),
 ("mc", "Master hooking berfungsi…", "Memberi sinyal suara berbeda untuk tali cabang dan pelampung", ["Menggulung tali cabang", "Menjual ikan"], "Sinyal suara."),
 ("mc", "Blanc reel dipakai untuk…", "Menggulung tali cabang", ["Menebar tali utama", "Menyalakan lampu"], "Blanc reel menggulung tali cabang."),
 ("tf", "Line hauler dapat bertenaga hidrolik atau listrik.", T, "Benar."),
 ("mc", "Mesin yang menarik tali utama ke kapal adalah…", "Line hauler", ["Line shooter", "Blanc reel"], "Line hauler."),
],
"b11s3": [
 ("mc", "Penarikan tali utama dilakukan sekitar…", "12 jam, bergiliran oleh semua awak", ["30 menit oleh 1 orang", "1 minggu"], "Sekitar 12 jam bergiliran."),
 ("mc", "Mana yang termasuk metode penanganan ikan?", "Semi-dress", ["Fry", "Steam"], "Round, semi-dress, dress, fillet."),
 ("mc", "締める (shimeru) pada penanganan ikan berarti…", "Mematikan ikan seketika", ["Membekukan", "Memotong sirip"], "Mematikan seketika agar mutu terjaga."),
 ("tf", "Pada ikan besar dibuat lubang di kepala dan kawat dimasukkan ke sumsum tulang belakang.", T, "Benar."),
 ("tf", "Penarikan tali utama dikerjakan oleh satu orang saja.", F, "Salah: oleh semua awak bergiliran."),
],
"b12s1": [
 ("mc", "Longline dasar vertikal disebut…", "底立 (sokotate)", ["延縄 saja", "浮き"], "Ada longline dasar dan 底立."),
 ("mc", "Pelampung dan pemberat mengatur…", "Kedalaman dan tinggi tali dari dasar", ["Warna tali", "Jumlah umpan"], "Mengatur kedalaman dan tinggi."),
 ("tf", "Tali jangkar dipasang di ujung bawah tali pelampung.", T, "Benar."),
 ("mc", "Kail pada tali utama dipasang…", "Berkala dengan jarak tertentu", ["Hanya di ujung", "Secara acak tanpa aturan"], "Dipasang berkala."),
 ("tf", "Tali utama longline dasar membentang vertikal di permukaan.", F, "Salah: horizontal dekat dasar."),
],
"b12s2": [
 ("mc", "Urutan operasi longline dasar adalah…", "Lempar tali, tunggu, tarik tali", ["Tarik, tunggu, lempar", "Tunggu, lempar, tarik"], "Lempar, tunggu, tarik."),
 ("mc", "Tali dilempar dari…", "Buritan", ["Haluan", "Ruang mesin"], "Dari buritan."),
 ("mc", "Setelah jangkar dijatuhkan, berikutnya dilempar…", "Tali apung lalu tali utama", ["Kapal lain", "Kompas"], "Tali apung lalu tali utama."),
 ("tf", "Tiang bendera atau pelampung radio dipasang pada ujung atas tali pelampung.", T, "Benar."),
 ("tf", "Umpan dipasang pada kail sebelum penebaran.", T, "Benar."),
],
}


def shuffle_opts(sid, i, correct, wrongs):
    opts = [correct] + list(wrongs)
    h = int(hashlib.md5(f"{sid}-{i}".encode()).hexdigest(), 16)
    k = h % len(opts)
    order = list(range(len(opts)))
    order = order[k:] + order[:k]
    shuffled = [opts[j] for j in order]
    return shuffled, shuffled.index(correct)


def main():
    idx = json.load(open(D + "index.json"))
    quiz = json.load(open(D + "quiz.json"))
    added = 0
    for b in idx["bab"]:
        bj = json.load(open(D + b["file"]))["bab"]
        for s in bj["subs"]:
            sid = s["id"]
            gid = sid + "-q"
            if sid not in S:
                raise SystemExit("subbab tanpa soal: " + sid)
            lst = quiz["bab"].setdefault(bj["id"], [])
            if any(g["id"] == gid for g in lst):
                continue  # idempoten
            a, z = s["pages"]
            items = []
            for n, it in enumerate(S[sid]):
                if it[0] == "tf":
                    _, q, truth, exp = it
                    items.append({
                        "q": {"id": f"Benar atau salah: “{q}”"},
                        "opts": [{"id": "Benar (○)"}, {"id": "Salah (×)"}],
                        "a": 0 if truth else 1,
                        "exp": {"id": f"{exp} (Modul hal. {a}–{z}.)"},
                        "ref": {"p": a},
                        "mb": True,
                    })
                else:
                    _, q, c, w, exp = it
                    opts, ai = shuffle_opts(sid, n, c, w)
                    items.append({
                        "q": {"id": q},
                        "opts": [{"id": o} for o in opts],
                        "a": ai,
                        "exp": {"id": f"{exp} (Modul hal. {a}–{z}.)"},
                        "ref": {"p": a},
                    })
            title = s["title"]["id"]
            lst.append({
                "id": gid,
                "title": {"id": f"Latihan: {title}", "jp": "{練習問題|れんしゅうもんだい}"},
                "items": items,
            })
            added += len(items)
    with open(D + "quiz.json", "w", encoding="utf-8") as f:
        json.dump(quiz, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print("soal ditambahkan:", added)


if __name__ == "__main__":
    main()
