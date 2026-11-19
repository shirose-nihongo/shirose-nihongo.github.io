#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Susun ulang bagian Dokkai paket full ke STANDAR BACAAN (hasil ukur 101 paket JLPT asli, lihat docs/JLPT-STANDAR-BACAAN.md).
Struktur N1: 短文 4 · 中文 3 bacaan×3 soal · 統合 1 set(2) · 長文 1×4 · 情報検索 2  (=21 soal).
Bacaan baru dari tools/dokkai_long/{lv}_*.py slot chuL / touL / cho; bila bank baru kurang, dipakai bergilir (tahap 1) dan sisanya bacaan lama paket.
Pakai: python3 tools/jlpt_dokkai_std.py n1"""
import json, os, sys, random, hashlib, glob, re
H = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, H)
import jlpt_dokkai_long as DL, jlpt_build as JB
ROOT = JB.ROOT; L = "ABCD"
SPEC = {"n1": {"tan": 4, "chu": 3, "tou": 1, "cho": 1, "info": 2}}
def mk(p, pid, e, lv):
    passages = {"jenis": p["jenis"], "jp": DL.br(p["jp"]), "id": p["id"].replace("\n", " "), "info": False, "std": True}
    items = []
    for (q, opts, ans, alasan, bukti, wrong, poin) in p["qs"]:
        assert len(opts) == 4 and len(wrong) == 3 and len(set(opts)) == 4, (lv, q)
        wi = iter(wrong); tag = [(o, i == ans, alasan if i == ans else next(wi)) for i, o in enumerate(opts)]
        rr = random.Random(int(hashlib.md5((lv + str(e) + q).encode()).hexdigest()[:8], 16)); rr.shuffle(tag)
        opts = [t[0] for t in tag]; ans = next(i for i, t in enumerate(tag) if t[1])
        lines = [f"{L[i]}. {t[0]} — BENAR. {t[2]}" if t[1] else f"{L[i]}. {t[0]} — Salah. {t[2]}" for i, t in enumerate(tag)]
        items.append({"cat": "dokkai", "tipe": "dokkai", "tipe_jp": "読解", "pid": pid, "q": q, "opts": opts, "ans": ans,
                      "ex": {"jawaban": f"{L[ans]}. {opts[ans]}", "terjemahan": passages["id"], "alasan": alasan, "bukti": bukti,
                             "opsi": lines, "kosakata": None, "poin": poin}})
    return passages, items
def main(lv):
    sp = SPEC[lv]; bk = DL.bank(lv); idx = json.load(open(os.path.join(ROOT, "jlpt", "index.json"), encoding="utf-8"))
    for f in sorted(glob.glob(os.path.join(ROOT, "jlpt", lv, "full-*.json"))):
        d = json.load(open(f, encoding="utf-8")); e = int(re.search(r"full-(\d+)", f).group(1))
        sec = next(s for s in d["sections"] if s["cat"] == "dokkai")
        grp = {}
        for it in sec["items"]: grp.setdefault(it["pid"], []).append(it)
        old = {"tan": [], "chu": [], "tou": [], "info": []}
        for pid, its in grp.items():
            ps = d["passages"][pid]; j = ps.get("jenis", "")
            k = None if ps.get("std") else "info" if ps.get("info") else "tan" if "短文" in j else "chu" if "中文" in j else "tou" if "統合" in j else None
            if k: old[k].append((ps, its))
        newp = {}; items = []; n = 0
        def add_old(ps, its):
            nonlocal n
            n += 1; pid = f"p{n}"; newp[pid] = dict(ps)
            for it in its: x = dict(it); x["pid"] = pid; items.append(x)
        def add_new(p):
            nonlocal n
            n += 1; pid = f"p{n}"; ps, its = mk(p, pid, e, lv); newp[pid] = ps; items.extend(its)
        for ps, its in old["tan"][:sp["tan"]]: add_old(ps, its)
        chuL = bk.get("chuL", []); k = 0
        for i in range(sp["chu"]):
            if chuL and i == 0: add_new(chuL[(e - 1) % len(chuL)])
            elif chuL and len(chuL) > 3 and i < len(chuL): add_new(chuL[(e - 1 + i) % len(chuL)])
            elif k < len(old["chu"]): add_old(*old["chu"][k]); k += 1
        touL = bk.get("touL", [])
        if touL and e % 2 == 1: add_new(touL[(e // 2) % len(touL)])
        elif old["tou"]: add_old(*old["tou"][0])
        cho = bk.get("cho", [])
        if cho: add_new(cho[(e - 1) % len(cho)])
        for ps, its in old["info"][:sp["info"]]: add_old(ps, its)
        sec["items"] = items; d["passages"] = newp
        JB.number(d)
        json.dump(d, open(f, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
        for x in idx["level"][lv]["full"]:
            if x["id"] == d["id"]: x["jumlah"] = d["jumlah"]; x["mondai"] = [f"{s['tipe_jp']} ({len(s['items'])})" for s in d["sections"]]
        print(d["id"], d["jumlah"], len(items), "soal baca,", len(newp), "bacaan")
    json.dump(idx, open(os.path.join(ROOT, "jlpt", "index.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
if __name__ == "__main__":
    for lv in sys.argv[1:]: main(lv)
