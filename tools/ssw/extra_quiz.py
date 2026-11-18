# -*- coding: utf-8 -*-
"""Tambah set soal ○× / pilihan ganda ke quiz.json sebuah bidang (bab tertentu). Soal buatan Shirose dari dokumen resmi; bukan soal resmi."""
import json, sys
def tf(jp, ok, id_, exp_id, exp_jp):
    return {"q": {"id": id_, "jp": "○か×か。「%s」" % jp},
            "opts": [{"id": "Benar (○)", "jp": "○ {正|ただ}しい"}, {"id": "Salah (×)", "jp": "× {間違|まちが}い"}],
            "a": 0 if ok else 1, "exp": {"id": exp_id, "jp": exp_jp}, "mb": True}
def mc(q_id, q_jp, right, wrongs, exp_id, exp_jp, pos=0):
    opts = [{"id": right[0], "jp": right[1]}] + [{"id": w[0], "jp": w[1]} for w in wrongs]
    a = 0
    if pos:
        o = opts.pop(0); opts.insert(pos, o); a = pos
    return {"q": {"id": q_id, "jp": q_jp}, "opts": opts, "a": a, "exp": {"id": exp_id, "jp": exp_jp}, "mb": True}
def add(slug, bab, sid, title_id, title_jp, items, root="."):
    p = "%s/data/ssw/%s/quiz.json" % (root, slug)
    d = json.load(open(p, encoding="utf-8"))
    sets = d["bab"][bab]
    key = "%s-x" % sid
    sets[:] = [s for s in sets if s["id"] != key]
    sets.append({"id": key, "sub": sid, "title": {"id": title_id, "jp": title_jp}, "items": items})
    json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print(slug, bab, "+%d" % len(items))
