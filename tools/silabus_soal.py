#!/usr/bin/env python3
"""Bank soal per materi untuk Silabus Harian (JLPT N5-N1).

Setiap kosakata / kanji / bunpo di silabus mendapat soal format ujian asli
(漢字読み, 表記, 文脈規定, 言い換え類義, 用法, 文法形式の判断, 文の組み立て)
lengkap dengan pembahasan, memakai generator yang sama dengan bank JLPT
(tools/jlpt_gen.py). Soal dikelompokkan per id materi, jadi aplikasi tinggal
mengambil soal untuk materi yang dipelajari hari itu.

Materi yang tidak punya kalimat contoh tetap diuji di aplikasi dengan soal
arti / cara baca yang dibuat langsung dari data (js/silabus-harian.js).

    python tools/silabus_soal.py          # tulis data/silabus/<lv>-soal-<blok>.json
"""
import json
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from jlpt_core import Bank, ROOT  # noqa: E402
from jlpt_gen import (Targets, GramPool, make_yomi, make_hyouki, make_bunmyaku, make_imi,  # noqa: E402
                      make_iikae, make_youhou, make_bunpou_form, make_bunpou_star, kanji_chars)
from silabus_build import materi  # noqa: E402

OUT = os.path.join(ROOT, "data", "silabus")
MAKS_PER_ITEM = 4
BLOK = 6  # = satu minggu belajar per file, supaya aplikasi hanya memuat minggu yang aktif


def bersih(q):
    q = dict(q)
    for k in ("id", "_src", "no"):
        q.pop(k, None)
    return q


def tambah(pool, key, q, seen):
    if not q or not key:
        return
    lst = pool.setdefault(key, [])
    sig = (q.get("tipe"), q.get("q"))
    if sig in seen.setdefault(key, set()) or len(lst) >= MAKS_PER_ITEM * 2:
        return
    seen[key].add(sig)
    lst.append(bersih(q))


def bangun_level(bank, lv):
    rnd = random.Random(f"silabus-{lv}")
    kos, kan, bun = materi(lv)
    vocab = bank.vocab[lv]
    gram = bank.gram[lv]
    id_kos = {id(e): f"kosakata-{lv}#{i}" for i, e in enumerate(vocab)}
    id_gram = {id(e): f"bunpou-{lv}#{i}" for i, e in enumerate(gram)}
    kanji_id = {x["w"]: x["id"] for x in kan}

    pool, seen = {}, {}
    TV = Targets(bank, lv, "kotoba")
    for t in TV.items:
        key = id_kos.get(id(t.get("entry")))
        for fn in (make_bunmyaku, make_imi, make_iikae, make_youhou):
            tambah(pool, key, fn(bank, t, lv, rnd, "", TV.items), seen)

    TK = Targets(bank, lv, "kanji")
    for t in TK.items:
        qs = [make_yomi(bank, t, lv, rnd, ""), make_hyouki(bank, t, lv, rnd, "")]
        for c in set(kanji_chars(t.get("kata", ""))):
            for q in qs:
                tambah(pool, kanji_id.get(c), q, seen)
        key = id_kos.get(id(t.get("entry")))
        for q in qs:
            tambah(pool, key, q, seen)

    G = GramPool(bank, lv)
    for it in G.items:
        key = id_gram.get(id(it["g"]))
        for hi in range(min(3, len(it["hits"]))):
            tambah(pool, key, make_bunpou_form(bank, G, it, hi, lv, rnd, ""), seen)
        for hi in range(min(2, len(it["hits"]))):
            tambah(pool, key, make_bunpou_star(bank, G, it, hi, lv, rnd, ""), seen)

    # Pangkas per materi: utamakan variasi tipe soal.
    for key, lst in pool.items():
        by = {}
        for q in lst:
            by.setdefault(q.get("tipe"), []).append(q)
        out = []
        while len(out) < MAKS_PER_ITEM and any(by.values()):
            for t in list(by):
                if by[t] and len(out) < MAKS_PER_ITEM:
                    out.append(by[t].pop(0))
        pool[key] = out
    return pool, kos, kan, bun


def dokkai_jlpt(lv):
    """Unit bacaan (teks + soal) level ini, dari yang paling pendek ke paling panjang."""
    import glob
    units, seen = [], set()
    for f in sorted(glob.glob(os.path.join(ROOT, "jlpt", lv, "dokkai-*.v2.json"))):
        d = json.load(open(f, encoding="utf-8"))
        ps = d.get("passages") or {}
        for sec in d.get("sections", []):
            for it in sec.get("items", []):
                p = ps.get(it.get("pid")) or {}
                jp = p.get("jp", "")
                if not jp:
                    continue
                if jp not in seen:
                    seen.add(jp)
                    units.append({"jenis": p.get("jenis", ""), "jp": jp, "terj": p.get("id", ""), "qs": []})
                u = next(x for x in units if x["jp"] == jp)
                u["qs"].append({"q": it["q"], "opts": it["opts"], "ans": it["ans"], "ex": it.get("ex", {})})
    units.sort(key=lambda u: len(u["jp"]))
    return units


def dokkai_jft():
    """Bacaan JFT: flyer per bab Irodori (bank.json), lalu soal reading tryout."""
    units = []
    bank = json.load(open(os.path.join(ROOT, "data", "jft", "bank.json"), encoding="utf-8"))
    for buku in ("ir0", "ir1", "ir2"):
        for grup in bank.get("bab", {}).get(buku, []):
            for set_ in grup:
                qs = [{"q": q["q"], "opts": q["o"], "ans": q["a"], "ex": {"alasan": q.get("n", "")}} for q in set_.get("qs", [])]
                if qs:
                    units.append({"fl": set_.get("fl"), "qs": qs})
    tryout = json.load(open(os.path.join(ROOT, "data", "jft", "tryout.json"), encoding="utf-8"))
    seen = set()
    for pk in tryout.get("paket", []):
        for q in pk.get("soal", []):
            if q.get("sec") != "reading":
                continue
            key = q["q"] + json.dumps(q.get("fl"), ensure_ascii=False)
            if key in seen:
                continue
            seen.add(key)
            units.append({"fl": q.get("fl"), "qs": [{"q": q["q"], "opts": q["o"], "ans": q["a"], "ex": {"alasan": q.get("n", "")}}]})
    return units


def tulis(nama, isi):
    with open(os.path.join(OUT, nama), "w", encoding="utf-8") as f:
        json.dump(isi, f, ensure_ascii=False, separators=(",", ":"))


def main():
    bank = Bank()
    os.makedirs(OUT, exist_ok=True)
    jft = dokkai_jft()
    tulis("jft-dokkai.json", jft)
    print(f"jft: {sum(len(u['qs']) for u in jft)} soal bacaan")
    os.makedirs(OUT, exist_ok=True)
    for lv in ("n5", "n4", "n3", "n2", "n1"):
        pool, kos, kan, bun = bangun_level(bank, lv)
        silabus = json.load(open(os.path.join(OUT, f"{lv}.json"), encoding="utf-8"))
        # Bagi per blok hari belajar supaya file kecil.
        blok, n_belajar = {}, 0
        for h in silabus["hari"]:
            if h["jenis"] != "belajar":
                continue
            b = n_belajar // BLOK
            n_belajar += 1
            for ids in h["materi"].values():
                for i in ids:
                    if i in pool:
                        blok.setdefault(b, {})[i] = pool[i]
        for b, isi in blok.items():
            with open(os.path.join(OUT, f"{lv}-soal-{b}.json"), "w", encoding="utf-8") as f:
                json.dump(isi, f, ensure_ascii=False, separators=(",", ":"))
        dk = dokkai_jlpt(lv)
        tulis(f"{lv}-dokkai.json", dk)
        tot = {"kosakata": kos, "kanji": kan, "bunpo": bun}
        cov = {k: f"{sum(1 for x in v if x['id'] in pool)}/{len(v)}" for k, v in tot.items()}
        nq = sum(len(v) for v in pool.values())
        print(f"{lv}: {nq} soal, materi bersoal {cov}, {len(blok)} file blok, {sum(len(u['qs']) for u in dk)} soal bacaan")


if __name__ == "__main__":
    main()
