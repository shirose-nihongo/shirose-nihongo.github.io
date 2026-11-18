#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ubah jlpt/n1/full-01..20.json (bagian NON-dokkai) ke format resmi N1:
 buang 表記 & 接頭辞・接尾辞; jumlah: 読み6 文脈7 言い換え6 用法6 文法形式10 組み立て5 文章の文法5.
 Dokkai & Choukai tidak disentuh. ID soal dinomori ulang (q01..). Pakai: python3 tools/jlpt_n1_resmi_lama.py"""
import json, os, sys, glob, random
H = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, H)
import jlpt_build as JB, jlpt_content as JC
from jlpt_core import Bank
LV = "n1"; ROOT = JB.ROOT
WANT = {"yomi": 6, "bunmyaku": 7, "iikae": 6, "youhou": 6, "keishiki": 10, "kumitate": 5, "bunshou": 5}
ORDER = ["yomi", "bunmyaku", "iikae", "youhou", "keishiki", "kumitate", "bunshou"]
def main():
    bank = Bank(); rnd = random.Random("shirose-n1-resmi-lama-2026")
    pools = JB.build_pools(bank, LV, rnd)
    ex = set()
    for f in glob.glob(os.path.join(ROOT, "jlpt", LV, "*.json")):
        for s in json.load(open(f, encoding="utf-8"))["sections"]:
            for q in s["items"]: ex.add(q["q"])
    for k in pools: pools[k] = [q for q in pools[k] if q["q"] not in ex]
    idxp = os.path.join(ROOT, "jlpt", "index.json"); I = json.load(open(idxp, encoding="utf-8"))
    for e in range(1, 21):
        f = os.path.join(ROOT, "jlpt", LV, f"full-{e:02d}.json"); p = json.load(open(f, encoding="utf-8"))
        by = {s["tipe"]: s for s in p["sections"] if s["cat"] not in ("dokkai", "choukai")}
        used = {JB.key_of(q) for s in by.values() for q in s["items"]}
        new = []
        for t in ORDER:
            n = WANT[t]; s = by.get(t)
            if t == "bunshou":
                its = JC.bunshou_items(rnd, LV, n)
            else:
                its = list(s["items"]) if s else []
                its = its[:n]
                if len(its) < n:
                    its += JB.take(pools[t], n - len(its), used)
            assert len(its) == n, (e, t, len(its))
            new.append(JB.section(t, 0, its))
        rest = [s for s in p["sections"] if s["cat"] in ("dokkai", "choukai")]
        secs = new + rest
        for i, s in enumerate(secs): s["mondai"] = i + 1
        p["sections"] = secs; JB.number(p)
        json.dump(p, open(f, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
        for x in I["level"][LV]["full"]:
            if x["id"] == p["id"]:
                x["jumlah"] = p["jumlah"]; x["mondai"] = [f"{s['tipe_jp']} ({len(s['items'])})" for s in secs]
        print(p["id"], p["jumlah"])
    json.dump(I, open(idxp, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
if __name__ == "__main__": main()
