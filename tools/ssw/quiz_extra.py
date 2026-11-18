# -*- coding: utf-8 -*-
"""Soal tambahan (audit 2026-11-18) disuntik ke data/ssw/<slug>/quiz.json setelah build; idempotent (set berawalan 'ex-' diganti).
Data: tools/ssw/qx/<slug>.py berisi X = {bab_no: [("tf", teks_id, teks_jp, benar?, penjelasan_id), ("mc", teks_id, teks_jp, [opsi_benar_id, salah1, salah2], penjelasan_id)]}
Pakai:  python3 tools/ssw/quiz_extra.py linen-supply railway-track ..."""
import json, sys, re, pathlib, hashlib, random, importlib
sys.path.insert(0, str(pathlib.Path(__file__).parent / "qx"))
import pykakasi
KKS = pykakasi.kakasi(); KANJI = re.compile(r"[一-鿿々]"); HIRA = re.compile(r"[ぁ-ゟ]")
def rw(o, h):
    pre = 0
    while pre < len(o) and HIRA.match(o[pre]) and pre < len(h) and o[pre] == h[pre]: pre += 1
    suf = 0
    while suf < len(o) - pre and HIRA.match(o[-1 - suf]) and o[-1 - suf] == h[-1 - suf] and suf < len(h) - pre: suf += 1
    co, ch = o[pre:len(o) - suf], h[pre:len(h) - suf]
    return o if (not KANJI.search(co) or not ch) else o[:pre] + "{" + co + "|" + ch + "}" + o[len(o) - suf:]
def ruby(t): return "".join(rw(x["orig"], x["hira"]) if KANJI.search(x["orig"]) else x["orig"] for x in KKS.convert(t))
TFO = [{"id": "Benar (○)", "jp": "○ {正|ただ}しい"}, {"id": "Salah (×)", "jp": "× {間違|まちが}い"}]
def item(x, key):
    if x[0] == "tf":
        _, tid, jp, ok, exp = x
        return {"q": {"id": "Benar atau salah: “" + tid + "”", "jp": "○か×か。「" + ruby(jp.rstrip("。")) + "。」"}, "opts": TFO, "a": 0 if ok else 1, "exp": {"id": exp, "jp": ""}, "mb": True}
    _, tid, jp, opts, exp = x
    o = [(i == 0, t) for i, t in enumerate(opts)]; random.Random(int(hashlib.sha256(key.encode()).hexdigest()[:10], 16)).shuffle(o)
    return {"q": {"id": tid, "jp": ruby(jp)}, "opts": [{"id": t} for _, t in o], "a": [r for r, _ in o].index(True), "exp": {"id": exp, "jp": ""}}
def run(slug):
    X = importlib.import_module(slug.replace("-", "_")).X
    p = pathlib.Path("data/ssw") / slug / "quiz.json"; q = json.load(open(p))
    n = 0
    for bab, items in X.items():
        bid = "bab%d" % bab; sets = q["bab"].setdefault(bid, [])
        sets[:] = [s for s in sets if not str(s.get("id", "")).startswith("ex-")]
        its = [item(x, f"{slug}{bab}{i}") for i, x in enumerate(items)]
        sets.insert(0 if not sets else 1, {"id": f"ex-{bid}", "title": {"id": f"Latihan Tambahan Bab {bab}", "jp": "{追加練習|ついかれんしゅう}"}, "items": its}); n += len(its)
    json.dump(q, open(p, "w"), ensure_ascii=False, separators=(",", ":")); print(slug, "+", n, "soal")
if __name__ == "__main__":
    for s in sys.argv[1:]: run(s)
