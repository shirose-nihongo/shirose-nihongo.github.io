# -*- coding: utf-8 -*-
"""Audit kaigo 2026-11-18: suntik soal baru + tag kategori (cat) ke quiz.json kaigo & kaigo-jp (idempotent).
Paket 20 soal tanpa duplikat dirakit di js/ssw-core.js (fullQuizzes, EXAM_SPEC.mix)."""
import json, sys, pathlib, hashlib, random, re
sys.path.insert(0, str(pathlib.Path(__file__).parent / "qx")); sys.path.insert(0, str(pathlib.Path(__file__).parent))
import kaigo_id_new as ID, kaigo_jp_new as JP
import kaigo_id_build as GEN
from quiz_extra import ruby
R = pathlib.Path("data/ssw")
def shuf(opts, key):
    o = [(i == 0, t) for i, t in enumerate(opts)]; random.Random(int(hashlib.sha256(key.encode()).hexdigest()[:10], 16)).shuffle(o)
    return o, [r for r, _ in o].index(True)
def put(q, bab, sid, title, items):
    sets = q["bab"][bab]; sets[:] = [s for s in sets if s.get("id") != sid]
    sets.insert(1 if sets else 0, {"id": sid, "title": title, "items": items})
def run_id():
    p = R / "kaigo/quiz.json"; q = json.load(open(p)); cats = {"bab1": "kb", "bab2": "kk", "bab3": "kom", "bab4": "sj"}
    for b, sets in q["bab"].items():
        for s in sets:
            if str(s["id"]).startswith("ex-"): continue
            for it in s["items"]: it["cat"] = cats[b]
    n = 0
    for bab, rows in ID.X.items():
        its = []
        for i, r in enumerate(rows):
            o, a = shuf(list(r[1:5]), f"kid{bab}{i}")
            its.append({"q": {"id": r[0]}, "opts": [{"id": t} for _, t in o], "a": a, "exp": {"id": r[5]}, "cat": cats[f"bab{bab}"]})
        put(q, f"bab{bab}", f"ex-bab{bab}", {"id": f"Latihan Tambahan Bab {bab}", "jp": "{追加練習|ついかれんしゅう}"}, its); n += len(its)
    gi = []
    for i, r in enumerate(ID.G):
        o, a = shuf(list(r[2:6]), f"kidg{i}")
        gi.append({"q": {"id": r[1]}, "img": {"src": f"assets/ssw/kaigo/quiz/{r[0]}.webp"}, "opts": [{"id": t} for _, t in o], "a": a, "exp": {"id": r[6]}, "cat": "gb"}); n += 1
    put(q, "bab4", "ex-gambar", {"id": "Soal Bergambar (判断等)", "jp": "{絵|え}を{見|み}て{答|こた}える"}, gi)
    gens = GEN.build(); babof = {"kb": "bab1", "kk": "bab2", "kom": "bab3", "sj": "bab4"}
    for cat, its in gens.items():
        put(q, babof[cat], f"ex-gen-{babof[cat]}", {"id": "Soal Latihan Tambahan (pilihan ganda)", "jp": "{追加練習|ついかれんしゅう}"}, its); n += len(its)
    json.dump(q, open(p, "w"), ensure_ascii=False, separators=(",", ":")); print("kaigo +", n)
def plain(t): return re.sub(r"\{([^|}]*)\|[^}]*\}", r"\1", t)
def run_jp():
    p = R / "kaigo-jp/quiz.json"; q = json.load(open(p))
    for b, sets in q["bab"].items():
        for s in sets:
            if str(s["id"]).startswith("ex-"): continue
            for it in s["items"]: it["cat"] = "bn" if it.get("img") else ("kw" if s["id"].startswith("bab2-q") else "kt")
    def mk(passage, ask_jp, ask_id, correct, wrongs, exp_id, key, cat, title=None):
        o, a = shuf([correct] + list(wrongs), key)
        head = f"【{title}】\n" if title else ""
        txt = head + "\n".join(passage)
        return {"q": {"jp": ruby(txt) + "\n\n［問題］" + ruby(ask_jp), "id": txt + "\n\n［Soal］" + ask_id}, "opts": [{"jp": ruby(t), "id": t} for _, t in o], "a": a,
                "exp": {"id": exp_id, "jp": "{正解|せいかい}：" + ruby(correct)}, "cat": cat}
    kw = [mk(r[0], r[1], "Pilih pernyataan yang benar sesuai isi percakapan." if "会話" in r[1] else "Pilih jawaban yang benar.", r[2], r[3:6], "Jawaban: " + r[2] + " — Terjemahan: " + r[6] + " " + r[7], f"jk{i}", "kw") for i, r in enumerate(JP.KAIWA)]
    bn = [mk(r[2], r[3], "Pilih pernyataan yang benar sesuai isi teks." if r[3] == JP.Q1 else "Pilih jawaban yang benar.", r[4], r[5:8], "Jawaban: " + r[4] + " — Terjemahan: " + r[8] + " " + r[9], f"jb{i}", "bn", r[1]) for i, r in enumerate(JP.BUNSHO)]
    kt = []
    for i, r in enumerate(JP.KOTOBA):
        o, a = shuf([r[2]] + list(r[3:6]), f"jt{i}")
        kt.append({"q": {"jp": ruby(r[0]) + "\n\n［問題］［　］のことばと同じ意味を選んでください。", "id": r[0] + "\n\n［Soal］Pilih arti yang sama dengan kata dalam ［ ］ (" + r[1] + ")."}, "opts": [{"jp": ruby(t), "id": t} for _, t in o], "a": a,
                   "exp": {"id": r[6], "jp": "{正解|せいかい}：" + ruby(r[2])}, "cat": "kt"})
    put(q, "bab1", "ex-bab1", {"id": "Latihan Tambahan Ucapan (ことば)", "jp": "ことば{練習|れんしゅう}"}, kt)
    put(q, "bab2", "ex-bab2", {"id": "Latihan Tambahan Percakapan (会話・声かけ)", "jp": "{会話|かいわ}・{声|こえ}かけ{練習|れんしゅう}"}, kw)
    put(q, "bab3", "ex-bab3", {"id": "Latihan Tambahan Teks (記録・文書)", "jp": "{記録|きろく}・{文書|ぶんしょ}{練習|れんしゅう}"}, bn)
    json.dump(q, open(p, "w"), ensure_ascii=False, separators=(",", ":")); print("kaigo-jp +", len(kw) + len(bn) + len(kt))
run_id(); run_jp()
