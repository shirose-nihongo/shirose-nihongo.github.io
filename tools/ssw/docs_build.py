# -*- coding: utf-8 -*-
"""Bangun dokumen SSW_*.md/.json dari data repositori + hasil QA (/tmp/qa/result-*.json bila ada).
Jalankan: python3 tools/ssw/docs_build.py"""
import json, os, subprocess, datetime, glob
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
S = json.loads(subprocess.check_output(["python3", os.path.join(ROOT, "tools/ssw/stats.py")]))
rows = {r["slug"]: r for r in S["sektor"]}; T = S["total"]
today = datetime.date.today().isoformat()
md = subprocess.check_output(["python3", os.path.join(ROOT, "tools/ssw/stats.py"), "--md"]).decode()

SRC = {
 "building-cleaning": ("Modul resmi Building Cleaning (buku PDF Indonesia/Jepang, halaman dirender ke WebP)", "buku modul; halaman dirender di assets/ssw/building-cleaning", "selesai"),
 "kaigo": ("Materi_Kaigo.pdf hal. 10–201 (Indonesia)", "modul pemberian pengelola; PDF tidak di-commit", "selesai"),
 "kaigo-jp": ("Materi_Kaigo.pdf hal. 204–267 (Bahasa Jepang)", "modul pemberian pengelola", "selesai (tanpa halaman buku bergambar)"),
 "food-service": ("3 modul Jasa Boga (127 hal. Indonesia)", "modul pemberian pengelola", "selesai"),
 "food-service-jp": ("Buku Jepang Jasa Boga (144 hal.)", "modul pemberian pengelola", "selesai"),
 "food-manufacturing": ("SSW_PM.pdf (第4版 2024, 82 hal.)", "modul pemberian pengelola", "selesai"),
 "agriculture": ("pertanian.pdf (Pertanaman Umum, 102 hal.)", "modul pemberian pengelola", "selesai"),
 "construction": ("sipil_indo (151 hal.) + edisi Jepang", "modul pemberian pengelola", "selesai (Bab 5–7 ada; ringkasan ID Bab 6.1 & 7 diperdalam dari tutorial praktik)"),
 "construction-bangunan": ("building_indo (152 hal.) + edisi Jepang", "modul pemberian pengelola", "selesai (Bab 5–7 ada; ringkasan ID Bab 6.1 & 7 diperdalam dari tutorial praktik)"),
 "construction-lifeline": ("THEORY_ID (117 hal.) + PRACTICE_ID", "modul pemberian pengelola", "selesai (Bab 5–7 ada; ringkasan ID Bab 6.1 & 7 diperdalam dari tutorial praktik)"),
 "accommodation": ("全旅連 2024 (Jepang, 52 hal.) + terjemahan Indonesia", "modul pemberian pengelola", "selesai"),
 "livestock": ("Modul Peternakan", "modul pemberian pengelola", "selesai; kosakata dan teks Jepang masih tipis"),
 "fishery": ("Modul Perikanan (12 bab)", "modul pemberian pengelola", "selesai; ujian akhir menunggu format resmi"),
 "auto-maintenance": ("JICA「みてまなぶ！自動車整備の日本語」2023-12-30 + Koleksi Ilustrasi (JICA)", "bebas diunduh/dipakai (situs JICA); PDF disimpan di assets/ssw/auto-maintenance/pdf/", "selesai + 12 diagram interaktif (orisinal Shirose)"),
 "industrial-mfg": ("Tidak ada buku (nobook): materi tulisan Shirose dasar pabrik", "orisinal Shirose; padanan kosakata tambahan Shirose", "selesai (dasar) + 4 diagram; belum ada sumber resmi MHLW/JASPA"),
 "wood-industry": ("木材産業特定技能1号測定試験 学習用テキスト 第1版 (全国木材組合連合会 / 林野庁, 2025-05, 67 hal.) — https://www.rinya.maff.go.jp/j/mokusan/seisankakou/foreigner.html", "PDF resmi tersedia gratis dari situs林野庁; PDF disimpan di assets/ssw/wood-industry/pdf/; halaman PDF dirender ke assets/ssw/wood-industry/jp (64 WebP) dan tampil di tiap subbab + Buku interaktif; isi di app = ringkasan & soal latihan ditulis ulang Shirose (bukan salinan)", "selesai (4 bab, 24 subbab); belum ada kartu gambar/diagram; soal resmi tidak tersedia"),
 "auto-transport": ("Truk: （外国人向け）トラック運転者をめざす人のための学習用テキスト (全日本トラック協会 JTA, 2024-11, 242 hal.) — https://jta.or.jp/member/driver/ssw_text.html. Bus: （外国人向け）バス運転者を目指す人の為の学習用テキスト (日本バス協会, Ver.2 2024-12, 68 hal.) — https://www.bus.or.jp/news/16554/", "PDF truk disimpan di assets/ssw/auto-transport/pdf/ (PDF bus 36 MB tidak dimasukkan repo; ambil dari URL resmi); halaman truk (p01–p233) dan bus (p234–p301) dirender ke assets/ssw/auto-transport/jp dan tampil di tiap subbab + Buku interaktif; halaman bus dibaca lewat OCR otomatis (Tesseract) sehingga angka penting dicocokkan dengan aturan lalu lintas; isi app = ringkasan & soal latihan ditulis ulang Shirose", "selesai (5 bab, 24 subbab: truk bab 1-4, bus bab 5); taksi belum ada; belum ada kartu gambar/diagram; soal resmi tidak tersedia"),
 "mfg-machine-metal": ("Tidak ada buku (nobook): materi tulisan Shirose mesin & logam", "orisinal Shirose", "selesai (dasar) + 5 diagram; tipis"),
}
reg = []
for slug, r in rows.items():
    s = SRC.get(slug, ("?", "?", "?"))
    reg.append(dict(slug=slug, sumber=s[0], lisensi_catatan=s[1], status=s[2], bab=r["bab"], subbab=r["sub"], kosakata=r["vocab"], kartu_gambar=r["kartu_gambar"], diagram=r["diagram"], soal=r["soal"], soal_bergambar=r["soal_img"]))
json.dump(dict(dibuat=today, catatan="Angka dihitung dari data/ssw oleh tools/ssw/stats.py.", pdf_di_repo=S["pdf"], sektor=reg, total=T, flashcard_total=S["flashcard_total"]),
          open(os.path.join(ROOT, "docs/SSW_SOURCE_REGISTRY.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

reg_md = "# SSW Source Registry\n\nDiperbarui: %s. Angka dari `tools/ssw/stats.py` (data aktual repo).\n\n| Bidang | Sumber | Lisensi / catatan | Status |\n|---|---|---|---|\n" % today
for x in reg: reg_md += f"| {x['slug']} | {x['sumber']} | {x['lisensi_catatan']} | {x['status']} |\n"
reg_md += "\n## PDF yang ada di repositori\n" + "".join(f"- `{p}`\n" for p in S["pdf"])
reg_md += "\nPDF modul bidang lain tidak di-commit (hanya hasil render halaman WebP di `assets/ssw/<slug>/`). Tidak ada PDF yang diunduh sesi ini: sandbox hanya mengizinkan registri paket dan GitHub, jadi situs sumber (JICA, MHLW, JASPA, dll.) tidak bisa dijangkau dari sini.\n"
reg_md += "\n## Bidang SSW yang belum ada\nShipbuilding, Aviation, Forestry, Automobile Transportation (taksi; truk & bus sudah ada), Railway, Linen Supply, Distribution/Warehousing, Resource Recycling.\n\nStatus sumber per 2026-11-17 (hasil pencarian; belum ada materi yang dimasukkan):\n- Taksi: situs 全タク連 tidak lagi menampilkan teks belajar bagi pencari; belum ditemukan PDF.\n- Railway, Forestry, Linen Supply: hanya dokumen kebijakan/pedoman ujian; tidak ditemukan teks belajar resmi.\n- Distribution/Warehousing (物流倉庫): hanya kerangka 試験基準 (MLIT, ujian dibuka 2026-10-26); tanpa teks belajar.\n- Resource Recycling (資源循環): teks belajar baru direncanakan/dipesan KLH Jepang; belum terbit.\n- Shipbuilding, Aviation: belum ditemukan teks belajar resmi.\nBidang-bidang ini tidak dibuat dari ingatan umum agar isi tetap bisa ditelusuri ke sumber resmi.\n"
open(os.path.join(ROOT, "docs/SSW_SOURCE_REGISTRY.md"), "w", encoding="utf-8").write(reg_md)

# ---- QA
qa = {}
for f in sorted(glob.glob("/tmp/qa/result-*.json")):
    qa[os.path.basename(f)[7:-5]] = json.load(open(f, encoding="utf-8"))
qa_md = f"# SSW QA Report\n\nTanggal: {today}. Pengujian nyata memakai Playwright (Chromium) terhadap aplikasi lokal, viewport **mobile 390×780 (sentuh)** dan **desktop 1280×800**. Backend Firebase **dipalsukan** (stub) dengan penyimpanan persisten di localStorage agar simpan–muat–refresh bisa diuji; ini bukan uji ke Firestore asli.\n\nSkrip: `tools/ssw/qa/ssw_qa.py` (jalankan dengan server statis di port 8765).\n\n"
tot_ok = tot_all = 0
qa_md += "## Ringkasan per bidang\n\n| Bidang | Uji | Lulus | Gagal |\n|---|---:|---:|---:|\n"
for slug, R in qa.items():
    ok = sum(1 for r in R if r["ok"]); tot_ok += ok; tot_all += len(R)
    qa_md += f"| {slug} | {len(R)} | {ok} | {len(R) - ok} |\n"
qa_md += f"| **Total** | {tot_all} | {tot_ok} | {tot_all - tot_ok} |\n\n"
if qa:
    names = []
    for r in next(iter(qa.values())):
        if r["test"] not in names: names.append(r["test"])
    qa_md += "## Daftar pengujian (hasil pada bidang pertama, mobile)\n\n"
    first = next(iter(qa.values()))
    for r in first:
        if r["vp"] == "mobile": qa_md += f"- {'✅' if r['ok'] else '❌'} {r['test']}\n"
    bad = [(s, r) for s, R in qa.items() for r in R if not r["ok"]]
    qa_md += "\n## Kegagalan\n" + ("\nTidak ada kegagalan pada putaran terakhir.\n" if not bad else "".join(f"- {s} / {r['vp']} / {r['test']}: {r['detail']}\n" for s, r in bad))
qa_md += """
## Yang tidak bisa diuji dari sandbox (jujur)
- Firestore, Auth, dan aturan keamanan asli (jaringan eksternal diblokir). Persistensi diuji terhadap backend palsu yang menyimpan di localStorage.
- Perangkat fisik Android/iPhone; hanya emulasi viewport + sentuh di Chromium. Safari/iOS belum diuji.
- Dashboard guru (`teacher.html`) hanya diperiksa impornya (versi modul diselaraskan), belum diuji klik.
- Build/lint/type-check: proyek ini statis (tanpa build). Pengganti: `node --check` seluruh modul JS yang diubah dan validasi JSON.

## Bug yang ditemukan dan diperbaiki selama QA
- Kartu hafalan pada tema **Putih**: latar kartu gelap + teks hitam, tidak terbaca → kartu dibuat terang untuk tema Putih (`css/themes.css`).
- Gambar diagram (SVG tanpa ukuran bawaan) tampil hanya titik kecil di flashcard → SVG diberi `width`/`height` + CSS ukuran.
- `loadBidang` bisa melempar error jika Firestore mengembalikan `null` → dijaga `(remote || [])`.
- Tidak ada opsi mengulang hanya soal yang salah → ditambahkan tombol "Ulangi soal yang salah".
- Tidak ada pembeda soal resmi vs buatan sendiri → label "Latihan buatan Shirose" / "Soal resmi" pada daftar dan halaman kuis.
"""
open(os.path.join(ROOT, "docs/SSW_QA_REPORT.md"), "w", encoding="utf-8").write(qa_md)
print("ok", tot_ok, tot_all)
