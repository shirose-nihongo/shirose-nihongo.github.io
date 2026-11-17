# -*- coding: utf-8 -*-
"""Menambah poin ringkasan Indonesia (ditulis Shirose) ke subbab bersama konstruksi: bab6 b6s1, bab7 b7s1/b7s2,
berdasar "Tutorial for practical skills test" (modul kategori Infrastruktur & Peralatan, Bab 6.1 dan Bab 7).
Idempotent: blok ditandai judul tertentu. Jalankan dari root repo: python3 tools/ssw/construction_deepen.py"""
import json, pathlib

SLUGS = ["construction", "construction-bangunan", "construction-lifeline"]
MARK = "Poin penting dari tutorial ujian praktik"

ADD = {
 ("bab6", "b6s1"): [
  ("Ciri pekerjaan konstruksi", [
   "**受注一品生産** (satu produk sesuai pesanan): tiap proyek dirancang khusus, jadi tiap pekerjaan punya kondisi berbeda.",
   "Terikat **lahan** (selalu dikerjakan di tempat tertentu), dipengaruhi **alam** (cuaca, musim, topografi), dan **batasan sosial** (keamanan sekitar, kebisingan, hukum setempat).",
   "**Kualitas dibangun dalam proses yang aman**: mutu bangunan lahir dari seluruh proses kerja yang aman."]),
  ("Rencana dan manajemen pelaksanaan", [
   "**Rencana pelaksanaan** disusun dari kontrak, gambar rancangan, spesifikasi, dan aturan lokasi; tujuannya hasil bermutu dengan **biaya minimum** dalam **masa konstruksi** tanpa kecelakaan.",
   "**5M**: Manusia (Men), Material, Metode, Mesin (Machinery), Uang (Money). **Survei pendahuluan** dilakukan sebelum mulai.",
   "**QCDSE**: **Q**uality (mutu), **C**ost (anggaran), **D**elivery (waktu/proses), **S**afety (keselamatan), **E**nvironment (lingkungan)."]),
  ("Sebelum bekerja", [
   "Pahami isi kontrak, lingkup kerja, gambar, aturan lokasi, **pembagian kerja** dengan kontraktor lain, alur kerja, dan masalah keselamatan; bawa **kartu karier/lisensi** yang dibutuhkan.",
   "**Inspeksi sebelum kerja**: mesin, perkakas/peralatan, prosedur kerja, dan perlengkapan pelindung harus diperiksa dan layak dipakai.",
   "**墨出し (penandaan tinta)** = menandai posisi dan ketinggian; dikerjakan paling awal dan sangat menentukan ketepatan. Alat: **pot tinta** atau **laser**."]),
 ],
 ("bab7", "b7s1"): [
  ("Tiga kecelakaan besar dan data", [
   "**Tiga kecelakaan besar** di konstruksi: **terjatuh/terguling**, **kecelakaan akibat mesin konstruksi/crane**, dan **runtuh/roboh** (sekitar 40–70% dari semua kecelakaan).",
   "Yang paling banyak: **terjatuh/terguling** saat bekerja di ketinggian. Kecelakaan lalu lintas di jalan umum juga sering terjadi.",
   "Industri konstruksi juga menempati **jumlah kematian terbanyak** di antara pekerja asing menurut tabel kementerian."]),
  ("Contoh jenis kecelakaan dan pencegahannya", [
   "**Jatuh**: ganti tali gerak harness hanya saat tali berikutnya sudah terpasang; di **anjungan kerja tinggi** jangan memanjat susuran tangan.",
   "**Kecelakaan lalu lintas**: pasang pagar/pembatas dan **pemandu** di area kerja jalan umum; jangan bekerja di luar area kerja.",
   "**Ditabrak/terjepit backhoe**: tempatkan **pemandu khusus** untuk pekerja di parit; hati-hati saat backhoe dimuat/diturunkan dari truk.",
   "**Terbang/terjatuh**: **jangan berada di bawah beban gantung**; slinging harus memadai.",
   "**Sengatan listrik**: pakai alat pelindung (sarung tangan karet listrik, sepatu bot karet), **pastikan listrik padam**, periksa dengan alat uji, larang orang tak berkepentingan masuk.",
   "**Manhole**: waspada **kekurangan oksigen** dan **hidrogen sulfida**; penolong tanpa respirator udara juga bisa menjadi korban.",
   "**Penggalian**: galian **≥ 1,5 m** pada prinsipnya diberi penahan tanah (turap baja dll.) agar tidak longsor menimbun pekerja."]),
 ],
 ("bab7", "b7s2"): [
  ("Kegiatan keselamatan harian", [
   "**Siklus pelaksanaan aman** harian: ① apel pagi, ② rapat keselamatan (**KY**), ③ inspeksi sebelum kerja, ④ bimbingan/pengawasan, ⑤ **patroli keselamatan**, ⑥ rapat proses keselamatan, ⑦ **bersih-bersih tempat kerja**, ⑧ konfirmasi keselamatan di akhir kerja.",
   "**Pendidikan pekerja baru** diwajibkan oleh peraturan K3; **pendidikan pengunjung baru** karena hampir **separuh korban jiwa** terjadi dalam **seminggu pertama** di lokasi (± 30 menit).",
   "Isi pendidikan pengunjung baru: situasi kerja bersama, **tempat berbahaya/terlarang**, koordinasi antar pekerjaan, **cara evakuasi**, rantai komando, isi kerja dan pencegahan kecelakaan."]),
  ("Alat pelindung dan kesehatan", [
   "Perlengkapan dasar: **harness penuh (full harness)**, **helm**, pengait, **sepatu keselamatan**. Harness wajib pada tinggi lantai kerja **> 6,75 m**; di konstruksi dianjurkan **> 5 m**.",
   "**Masker** untuk debu (las, potong batu) agar tidak kena **pneumokoniosis**; **kacamata** untuk percikan/debu/laser; **jangan pakai sarung tangan kerja** dekat **mata pisau berputar** (gergaji bundar, bor) karena bisa tersangkut.",
   "**Sengatan panas**: waspadai **WBGT**; istirahat di tempat sejuk, minum air dan garam, pakaian berpengudaraan baik. Hari panas > 30 ℃, sangat panas > 35 ℃.",
   "**Tanda tambah hijau (緑十字)** = simbol keselamatan; kotak P3K ditandai dengan itu."]),
  ("Human error", [
   "**Human error** = kesalahan manusia, termasuk **kelalaian** tidak melakukan yang seharusnya; berdampak pada keselamatan, mutu, dan jadwal.",
   "Penyebab umum: **asumsi** (kesalahan kognitif), **kecerobohan**, **perhatian menurun** pada kerja berulang, **kurang pengalaman**, **terlalu terbiasa**, **cacat kolektif** (\"apa boleh buat\" di tenggat), **jalan pintas**, **kurang komunikasi**, **insting spontan**, **panik**, dan **penurunan fungsi fisik/mental**.",
   "**Kegiatan KY** sebelum kerja membantu pemula mengetahui titik bahaya dari pengalaman senior."]),
 ],
}

ONLY_LIFELINE = {
 ("bab6", "b6s4"): [
  ("Pipa besi cor ulet jenis GX (suplai air)", [
   "Jepang rawan gempa, jadi dipakai **pipa besi cor ulet (ダクタイル鋳鉄管)**; jenis **GX** punya sambungan **tahan gempa**: bisa memuai, menyusut, menekuk, dan **tidak lepas** meski ditarik sampai batas.",
   "Urutan menyambung: pasang pipa (tanda pabrik menghadap **atas**) → bersihkan soket dan sekitar **30 cm** dari ujung spigot → cek **cincin pengunci** → pasang **cincin karet** (tanda GX, bagian bersudut menghadap depan) → oles **pelumas** khusus pada karet dan spigot (bukan permukaan dalam soket sebelum cincin terpasang) → masukkan spigot dengan hoist (sudut tekuk kedua pipa **≤ 2°**) → cek posisi cincin karet dengan **pengukur khusus** (catat **8 titik** pada lembar periksa)."]),
  ("Pekerjaan membenamkan pipa", [
   "Jangan merusak/memutus **pipa terpendam** yang ada: lakukan **penggalian uji (試掘)**, pakai detektor pipa/kabel, cocokkan dengan gambar dan buku besar; di dalam jarak **50 cm** dari pipa yang ada **gali manual**.",
   "Pasang **lembar indikasi** di atas pipa: kabel komunikasi **merah**, daya listrik **oranye**, suplai air **biru**, drainase **cokelat**, gas **hijau**.",
   "**Manhole**: yang boleh masuk hanya orang yang sudah pelatihan bahaya kekurangan oksigen; ukur dan ventilasi sampai **oksigen ≥ 18%** dan **hidrogen sulfida ≤ 10 ppm**; bila tidak bisa, pakai alat napas dan tempatkan **pengawas**; pakai alat penahan jatuh meski tinggi **< 2 m** bila berisiko kekurangan oksigen; pasang pagar/selungkup dan **pemandu** karena sering di jalan raya."]),
 ],
}

for slug in SLUGS:
    items = dict(ADD)
    if slug == "construction-lifeline": items.update(ONLY_LIFELINE)
    for (bab, sub), groups in items.items():
        p = pathlib.Path(f"data/ssw/{slug}/{bab}.json")
        d = json.load(open(p, encoding="utf8"))
        s = next(x for x in d["bab"]["subs"] if x["id"] == sub)
        full = s["full"]["id"]
        if any(b.get("h", "").startswith(MARK) for b in full):
            continue
        idx = next((i for i, b in enumerate(full) if "note" in b), len(full))
        new = [{"h": MARK}]
        for h, bl in groups:
            new += [{"h": h}, {"ul": bl}]
        full[idx:idx] = new
        json.dump(d, open(p, "w", encoding="utf8"), ensure_ascii=False, indent=1)
        print("ok", slug, bab, sub)
