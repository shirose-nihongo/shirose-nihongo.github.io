# -*- coding: utf-8 -*-
"""Bangun bank soal kaigo (Indonesia) ~900 butir dari fakta bertanda benar/salah → pilihan ganda 4 opsi.
Benar → 'Pilih pernyataan yang BENAR' (1 benar + 3 salah sekategori); Salah → 'Pilih pernyataan yang SALAH' (1 salah + 3 benar sekategori)."""
import json, sys, pathlib, random, hashlib
sys.path.insert(0, str(pathlib.Path(__file__).parent / "qx"))
import kaigo_id_b1 as b1, kaigo_id_b2 as b2, kaigo_id_b3 as b3, kaigo_id_b4 as b4, kaigo_id_b5 as b5, kaigo_id_b6 as b6
CATS = {"kb": b1.B + b5.KB2, "kk": b2.KK, "kom": b2.KOM, "sj": b3.SJ + b4.SJ2 + b5.SJ3 + b6.SJ4}
def build():
    out = {}
    for cat, facts in CATS.items():
        T = [f for f in facts if f[1]]; F = [f for f in facts if not f[1]]
        items = []
        for i, (s, ok, exp) in enumerate(facts):
            rnd = random.Random(int(hashlib.sha256(f"{cat}{i}{s}".encode()).hexdigest()[:10], 16))
            if ok:
                others = rnd.sample([f for f in F if f[0] != s], 3); q = "Manakah pernyataan yang BENAR?"; opts = [(True, s)] + [(False, o[0]) for o in others]
            else:
                others = rnd.sample([f for f in T if f[0] != s], 3); q = "Manakah pernyataan yang SALAH?"; opts = [(True, s)] + [(False, o[0]) for o in others]
            rnd.shuffle(opts)
            items.append({"q": {"id": q}, "opts": [{"id": t} for _, t in opts], "a": [r for r, _ in opts].index(True),
                          "exp": {"id": ("Benar: " if ok else "Salah: ") + s + " — " + exp}, "cat": cat, "gen": 1})
        out[cat] = items
    return out
if __name__ == "__main__":
    o = build(); print({k: len(v) for k, v in o.items()}, sum(len(v) for v in o.values()))
