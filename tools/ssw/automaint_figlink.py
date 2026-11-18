# -*- coding: utf-8 -*-
"""Hubungkan kosakata Jidousha Seibi ke gambar JICA イラスト集 (bagian bernomor) + tambah istilah ilustrasi yang belum ada.
Sumber pemetaan: tabel FIG di automaint_img2.py (istilah per nomor bagian gambar). Idempoten.
Jalankan SETELAH automaint_jica_build.py dan automaint_img2.py:   python3 -I tools/ssw/automaint_figlink.py"""
import json, re, ast, hashlib
import pykakasi
V = "data/ssw/auto-maintenance/vocab.json"
SRC = open("tools/ssw/automaint_img2.py", encoding="utf-8").read()
m = re.search(r"^FIG = (\{.*?^\})\n", SRC, re.S | re.M)
FIG = ast.literal_eval(m.group(1))
FIGSRC = "./assets/ssw/auto-maintenance/fig/jica-fig%02d.webp"
# gambar -> (subbab, kategori)
SUB = {2:("b4s1","Sekitar mesin"),6:("b4s1","Sekitar mesin"),8:("b4s1","Sekitar mesin"),9:("b4s1","Sekitar mesin"),
 10:("b4s4","Pelumasan dan pendinginan"),11:("b4s4","Pelumasan dan pendinginan"),13:("b4s2","Sistem bahan bakar"),14:("b4s3","Sistem hisap dan buang"),
 15:("b4s7","Kelistrikan, rangka, dan bodi"),16:("b4s7","Kelistrikan, rangka, dan bodi"),17:("b4s7","Kelistrikan, rangka, dan bodi"),
 20:("b4s5","Penerus tenaga dan suspensi"),21:("b4s5","Penerus tenaga dan suspensi"),22:("b4s5","Penerus tenaga dan suspensi"),23:("b4s5","Penerus tenaga dan suspensi"),24:("b4s5","Penerus tenaga dan suspensi"),
 27:("b4s6","Kemudi dan rem"),33:("b4s6","Kemudi dan rem"),35:("b4s6","Kemudi dan rem"),36:("b4s6","Kemudi dan rem")}
norm = lambda s: re.sub(r"[・･\s　]", "", s)
# Halaman PDF (indeks 0) dari versi BERLABEL tiap gambar di jica-illust-shu.pdf (kunci jawaban); halaman cetak = indeks - 3.
# Nomor bagian & istilah dicocokkan dengan teks halaman itu (2026-11-16): 19 dari 20 gambar cocok persis; gambar 2 hanya beda ruby.
KEYPAGE = {2:5,6:7,8:9,9:10,10:11,11:12,13:14,14:15,15:16,16:17,17:18,20:21,21:22,22:23,23:24,24:25,27:28,33:34,35:36,36:37}
# Istilah pada kunci jawaban yang belum ada di tabel FIG (gambar 11, bagian 3 = ウォータ・ジャケット)
EXTRA = {11: {3: ("ウォータ・ジャケット", "saluran air pendingin (water jacket)")}}
FUNGSI = {}
for ln in open("tools/ssw/jica_data/automaint_fungsi.txt", encoding="utf-8"):
    if ln.startswith("#") or "\t" not in ln: continue
    k, f = ln.rstrip("\n").split("\t", 1); FUNGSI[norm(k)] = f
kks = pykakasi.kakasi()
def kana(t): return "".join(x["hira"] for x in kks.convert(t))
def romaji(t):
    r = " ".join(x["hepburn"] for x in kks.convert(t.replace("・", " ")))
    for a, b in zip("āīūēō", ["aa", "ii", "uu", "ee", "oo"]): r = r.replace(a, b)
    return re.sub(r"\s+", " ", r).strip()
d = json.load(open(V, encoding="utf-8")); lst = d["items"]
lst[:] = [x for x in lst if x.get("sumber") != "JICA イラスト集"]      # idempoten: buang entri hasil skrip ini
for x in lst:
    for k in ("fig", "hal_sumber", "status_validasi"): x.pop(k, None)
by = {norm(x["kata"]): x for x in lst}
links = {}   # norm -> (kata, arti, [fig...], cat, sub)
# EXTRA diproses terakhir agar ID istilah yang sudah terbit (am-407..468) tidak bergeser (ID = kunci SRS siswa)
ORDER = [(f, FIG[f][2], FIG[f][1]) for f in sorted(FIG)] + [(f, p, FIG[f][1]) for f, p in sorted(EXTRA.items())]
for fno, parts, title in ORDER:
    for pno, (jp, arti) in parts.items():
        e = links.setdefault(norm(jp), {"kata": jp, "arti": arti, "fig": [], "fno": fno})
        e["fig"].append({"n": fno, "p": pno, "t": title, "src": FIGSRC % fno})
        e.setdefault("hal", {"dok": "jica-illust-shu.pdf", "hal_cetak": KEYPAGE[fno] - 3, "hal_pdf": KEYPAGE[fno] + 1})
# ID harus numerik berurutan: mesin hafalan memakai angka dalam ID sebagai kunci SRS (vnum), jadi tidak boleh bentrok
nxt = max(int(re.sub(r"\D", "", x["id"]) or 0) for x in lst) + 1; added = linked = 0
for k, e in links.items():
    if k in by: by[k]["fig"] = e["fig"]; linked += 1; tgt = by[k]
    else: tgt = None
    if tgt is not None:
        tgt["hal_sumber"] = e["hal"]; tgt["status_validasi"] = "gambar: nomor bagian cocok dengan kunci jawaban PDF JICA; fungsi: ORIGINAL LEARNING CONTENT, perlu review"
        if norm(e["kata"]) in FUNGSI: tgt["fungsi"] = FUNGSI[norm(e["kata"])]
        continue
    sub, cat = SUB[e["fno"]]
    kn = kana(e["kata"].replace("・", ""))
    if e["kata"].isascii(): kn = e["kata"]
    nv = {"id": "am-%03d" % nxt, "kata": e["kata"], "kana": kn, "romaji": romaji(e["kata"]) if not e["kata"].isascii() else e["kata"].lower(),
          "arti": e["arti"], "cat": cat, "bab": "bab4", "src": [sub], "sumber": "JICA イラスト集", "fig": e["fig"],
          "hal_sumber": e["hal"], "status_validasi": "gambar: nomor bagian cocok dengan kunci jawaban PDF JICA; fungsi: ORIGINAL LEARNING CONTENT, perlu review"}
    if k in FUNGSI: nv["fungsi"] = FUNGSI[k]
    lst.append(nv); by[k] = nv; nxt += 1; added += 1
filled = 0
for it in lst:
    if not it.get("fungsi") and norm(it["kata"]) in FUNGSI:
        it["fungsi"] = FUNGSI[norm(it["kata"])]
        it.setdefault("status_validasi", "fungsi: ORIGINAL LEARNING CONTENT, perlu review")
        filled += 1
print("fungsi tambahan utk kosakata buku:", filled)
json.dump(d, open(V, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("terhubung ke kosakata lama:", linked, "| ditambah:", added, "| total:", len(lst))
