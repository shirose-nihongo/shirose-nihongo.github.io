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
kks = pykakasi.kakasi()
def kana(t): return "".join(x["hira"] for x in kks.convert(t))
def romaji(t):
    r = " ".join(x["hepburn"] for x in kks.convert(t.replace("・", " ")))
    for a, b in zip("āīūēō", ["aa", "ii", "uu", "ee", "oo"]): r = r.replace(a, b)
    return re.sub(r"\s+", " ", r).strip()
d = json.load(open(V, encoding="utf-8")); lst = d["items"]
lst[:] = [x for x in lst if x.get("sumber") != "JICA イラスト集"]      # idempoten: buang entri hasil skrip ini
for x in lst: x.pop("fig", None)
by = {norm(x["kata"]): x for x in lst}
links = {}   # norm -> (kata, arti, [fig...], cat, sub)
for fno in sorted(FIG):
    _, title, parts = FIG[fno]
    for pno, (jp, arti) in parts.items():
        e = links.setdefault(norm(jp), {"kata": jp, "arti": arti, "fig": [], "fno": fno})
        e["fig"].append({"n": fno, "p": pno, "t": title, "src": FIGSRC % fno})
# ID harus numerik berurutan: mesin hafalan memakai angka dalam ID sebagai kunci SRS (vnum), jadi tidak boleh bentrok
nxt = max(int(re.sub(r"\D", "", x["id"]) or 0) for x in lst) + 1; added = linked = 0
for k, e in links.items():
    if k in by: by[k]["fig"] = e["fig"]; linked += 1; continue
    sub, cat = SUB[e["fno"]]
    kn = kana(e["kata"].replace("・", ""))
    if e["kata"].isascii(): kn = e["kata"]
    nv = {"id": "am-%03d" % nxt, "kata": e["kata"], "kana": kn, "romaji": romaji(e["kata"]) if not e["kata"].isascii() else e["kata"].lower(),
          "arti": e["arti"], "cat": cat, "bab": "bab4", "src": [sub], "sumber": "JICA イラスト集", "fig": e["fig"]}
    lst.append(nv); by[k] = nv; nxt += 1; added += 1
json.dump(d, open(V, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("terhubung ke kosakata lama:", linked, "| ditambah:", added, "| total:", len(lst))
