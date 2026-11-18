#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Full Exam N1 "Format Resmi": N1 asli TIDAK punya mondai 表記 dan 接頭辞・接尾辞.
Membuat jlpt/n1/full-21..30.json (paket BARU, aditif). full-01..20 tidak disentuh.
Soal diambil dari pool generator, dibuang bila teks soalnya sudah ada di paket N1 lain.
Pakai: python3 tools/jlpt_n1_resmi.py"""
import json, os, sys, glob, random, shutil, tempfile
H = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, H)
import jlpt_build as JB, jlpt_content as JC, jlpt_dokkai_long as DL
from jlpt_core import Bank
LV = "n1"; ROOT = JB.ROOT; START = 21; N = 10
PLAN = {"mojigoi": [("yomi", 6), ("bunmyaku", 7), ("iikae", 6), ("youhou", 6)],   # tanpa hyouki & settou
        "bunpou": [("keishiki", 10), ("kumitate", 5), ("bunshou", 5)]}             # jumlah = median 30 paket N1 asli
def existing_q():
    s = set()
    for f in glob.glob(os.path.join(ROOT, "jlpt", LV, "*.json")):
        p = json.load(open(f, encoding="utf-8"))
        for sec in p["sections"]:
            for q in sec["items"]: s.add(q["q"])
    return s
def main():
    bank = Bank(); rnd = random.Random("shirose-n1-resmi-2026")
    pools = JB.build_pools(bank, LV, rnd); ex = existing_q()
    for k in pools: pools[k] = [q for q in pools[k] if q["q"] not in ex]
    print({k: len(v) for k, v in pools.items()})
    tmp = tempfile.mkdtemp(); os.makedirs(os.path.join(tmp, "jlpt", LV))
    shutil.copy(os.path.join(ROOT, "jlpt", "index.json"), os.path.join(tmp, "jlpt", "index.json"))
    for e in range(START - 1):  # kerangka 1..20 agar nomor ujian (e) pada tool dokkai sejajar; hanya di folder sementara
        shutil.copy(os.path.join(ROOT, "jlpt", LV, f"full-{e+1:02d}.json"), os.path.join(tmp, "jlpt", LV, f"full-{e+1:02d}.json"))
    made = []
    for e in range(N):
        no = START + e; pid = f"{LV}-full-{no:02d}"; used = set(); secs = []; m = 0
        for tipe, n in PLAN["mojigoi"] + PLAN["bunpou"]:
            its = JB.take(pools[tipe], n, used) if tipe in pools else JC.bunshou_items(rnd, LV, n)
            assert len(its) == n, (tipe, len(its), n)
            m += 1; secs.append(JB.section(tipe, m, its))
        d_items, passages = JB.dokkai_items(random.Random(f"shirose-{LV}-ext-{no-1}"), LV, no, pid)
        m += 1; secs.append(JB.section("dokkai", m, d_items))
        for s in JB.choukai_clone_sections(LV, no - 1, m): m = s["mondai"]; secs.append(s)
        pkg = JB.number({"id": pid, "lv": LV, "jenis": "full", "judul": f"JLPT N1 Full Exam {no:02d} (Format Resmi)", "durasi": 70,
                         "sections": secs, "passages": passages})
        json.dump(pkg, open(os.path.join(tmp, "jlpt", LV, f"full-{no:02d}.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
        made.append(no)
    DL.ROOT = tmp; os.environ["NEX"] = str(START - 1 + N); DL.apply(LV)  # bacaan panjang (bank dokkai_long) utk paket baru
    idxp = os.path.join(ROOT, "jlpt", "index.json"); I = json.load(open(idxp, encoding="utf-8"))
    lst = I["level"][LV]["full"]
    for no in made:
        src = os.path.join(tmp, "jlpt", LV, f"full-{no:02d}.json"); dst = os.path.join(ROOT, "jlpt", LV, f"full-{no:02d}.json")
        p = json.load(open(src, encoding="utf-8"))
        json.dump(p, open(dst, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
        ent = {"id": p["id"], "file": f"{LV}/full-{no:02d}.json", "judul": p["judul"], "jumlah": p["jumlah"], "durasi": 70,
               "mondai": [f"{s['tipe_jp']} ({len(s['items'])})" for s in p["sections"]]}
        lst[:] = [x for x in lst if x["id"] != p["id"]] + [ent]
        print(ent["id"], ent["jumlah"], ent["mondai"])
    json.dump(I, open(idxp, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    shutil.rmtree(tmp)
if __name__ == "__main__": main()
