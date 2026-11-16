# -*- coding: utf-8 -*-
"""Hitung statistik SSW dari repositori (dipakai dokumentasi). Jalankan: python3 tools/ssw/stats.py [--md]"""
import json, os, sys, glob
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
D = os.path.join(ROOT, "data/ssw")
rows, tot = [], dict(bab=0, sub=0, vocab=0, kartu_gambar=0, grup=0, soal=0, soal_img=0, diagram=0, bagian=0, gambar=0, halaman=0)
for slug in sorted(os.listdir(D)):
    p = os.path.join(D, slug)
    if not os.path.isdir(p) or not os.path.exists(os.path.join(p, "index.json")): continue
    idx = json.load(open(os.path.join(p, "index.json"), encoding="utf-8"))
    bab = len(idx["bab"]); sub = 0
    for b in idx["bab"]: sub += len(json.load(open(os.path.join(p, b["file"]), encoding="utf-8"))["bab"]["subs"])
    v = json.load(open(os.path.join(p, idx.get("vocab", "vocab.json")), encoding="utf-8")); v = v["items"] if isinstance(v, dict) else v
    q = json.load(open(os.path.join(p, idx.get("quiz", "quiz.json")), encoding="utf-8"))
    groups = [g for k, l in q["bab"].items() for g in l] + list(q.get("full", [])) + list(q.get("tema", []))
    soal = sum(len(g["items"]) for g in groups)
    simg = sum(1 for g in groups for it in g["items"] if it.get("img") or any(o.get("img") for o in it["opts"]))
    kg = bg = dg = 0
    if os.path.exists(os.path.join(p, "alat.json")):
        kg = len(json.load(open(os.path.join(p, "alat.json"), encoding="utf-8"))["items"])
    if os.path.exists(os.path.join(p, "diagram.json")):
        dj = json.load(open(os.path.join(p, "diagram.json"), encoding="utf-8"))["diagrams"]; dg = len(dj); bg = sum(len(d["parts"]) for d in dj)
    a = os.path.join(ROOT, "assets/ssw", slug)
    gambar = sum(len(f) for _, _, f in os.walk(a)) if os.path.isdir(a) else 0
    r = dict(slug=slug, bab=bab, sub=sub, vocab=len(v), kartu_gambar=kg, grup=len(groups), soal=soal, soal_img=simg, diagram=dg, bagian=bg, gambar=gambar, nobook=bool(idx.get("nobook")))
    rows.append(r)
    for k in tot:
        if k in r: tot[k] += r[k]
pdfs = [os.path.relpath(f, ROOT) for f in glob.glob(os.path.join(ROOT, "assets/ssw/**/*.pdf"), recursive=True)]
out = dict(sektor=rows, total=tot, pdf=pdfs, flashcard_total=tot["vocab"] + tot["kartu_gambar"])
if "--md" in sys.argv:
    print("| Bidang | Bab | Subbab | Kosakata | Kartu gambar | Diagram | Bagian diagram | Kelompok soal | Butir soal | Soal bergambar | File gambar/halaman |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|")
    for r in rows: print(f"| {r['slug']} | {r['bab']} | {r['sub']} | {r['vocab']} | {r['kartu_gambar']} | {r['diagram']} | {r['bagian']} | {r['grup']} | {r['soal']} | {r['soal_img']} | {r['gambar']} |")
    t = tot; print(f"| **TOTAL** | {t['bab']} | {t['sub']} | {t['vocab']} | {t['kartu_gambar']} | {t['diagram']} | {t['bagian']} | {t['grup']} | {t['soal']} | {t['soal_img']} | {t['gambar']} |")
else:
    print(json.dumps(out, ensure_ascii=False, indent=1))
