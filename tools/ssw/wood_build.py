# -*- coding: utf-8 -*-
"""Bangun data/ssw/wood-industry/* dari tools/ssw/wood_content.py (idempotent). Jalankan dari root repo:
   python3 tools/ssw/wood_build.py"""
import json, re, sys, hashlib, random, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import pykakasi
from wood_content import BAB, SUBS

OUT = pathlib.Path("data/ssw/wood-industry"); OUT.mkdir(parents=True, exist_ok=True)
KKS = pykakasi.kakasi()
KANJI = re.compile(r"[一-鿿々]")
HIRA = re.compile(r"[ぁ-ゟ]")

# kamus bacaan dari kosakata sendiri (menang atas pykakasi)
TERMS = {}
for b in BAB:
    for s in SUBS[b["id"]]:
        for t in s["terms"]:
            if KANJI.search(t[0]): TERMS[t[0]] = t[1]
TERMS.update({"中割り": "なかわり", "小割り": "こわり", "大割り": "おおわり"})
TERM_RE = re.compile("(" + "|".join(sorted(map(re.escape, TERMS), key=len, reverse=True)) + ")") if TERMS else None

def ruby_word(orig, hira):
    """{kanji|kana} hanya pada bagian kanji (okurigana tetap di luar)."""
    pre = 0
    while pre < len(orig) and HIRA.match(orig[pre]) and pre < len(hira) and orig[pre] == hira[pre]: pre += 1
    suf = 0
    while suf < len(orig) - pre and HIRA.match(orig[-1 - suf]) and orig[-1 - suf] == hira[-1 - suf] and suf < len(hira) - pre: suf += 1
    core_o = orig[pre:len(orig) - suf]; core_h = hira[pre:len(hira) - suf]
    if not KANJI.search(core_o) or not core_h: return orig
    return orig[:pre] + "{" + core_o + "|" + core_h + "}" + orig[len(orig) - suf:]

def ruby(text):
    out = []
    parts = TERM_RE.split(text) if TERM_RE else [text]
    for p in parts:
        if not p: continue
        if p in TERMS:
            out.append(ruby_word(p, TERMS[p])); continue
        for tok in KKS.convert(p):
            o, h = tok["orig"], tok["hira"]
            out.append(ruby_word(o, h) if KANJI.search(o) else o)
    return "".join(out)

def romaji(kana): return "".join(t["hepburn"] for t in KKS.convert(kana)).replace(" ", "")
def rng(key): return random.Random(int(hashlib.sha256(key.encode()).hexdigest()[:12], 16))
def plain(s): return s.replace("**", "")

def blocks(bl, jp=False):
    out = []
    for kind, val in bl:
        if kind == "h": out.append({"h": ruby(val) if jp else val})
        else: out.append({"ul": [ruby(x) if jp else x for x in val]})
    return out

def flat(bl): return [x for k, v in bl if k == "ul" for x in v]

TF_OPTS = [{"id": "Benar (○)", "jp": "○ {正|ただ}しい"}, {"id": "Salah (×)", "jp": "× {間違|まちが}い"}]
def make_item(q, key):
    if q[0] == "tf":
        _, id_, jp, ok, ex_id, ex_jp = q
        stmt_id = id_ or None
        return {"q": {"id": "__TF__" + jp, "jp": "○か×か。「" + ruby(jp.rstrip("。")) + "。」"}, "opts": TF_OPTS,
                "a": 0 if ok else 1, "exp": {"id": ex_id, "jp": ruby(ex_jp)}, "mb": True}
    _, q_id, q_jp, right, wrong, ex_id, ex_jp = q
    allo = [right] + list(wrong); rng(key).shuffle(allo)
    return {"q": {"id": q_id, "jp": ruby(q_jp)},
            "opts": [{"id": a[0], "jp": ruby(a[1])} for a in allo],
            "a": allo.index(right), "exp": {"id": ex_id, "jp": ruby(ex_jp)}}

# --- Terjemahan pernyataan ○× (ID) disimpan di dict di bawah: dibuat dari penjelasan agar tidak ada teks palsu
TFID = {}  # diisi dari wood_tf_id.py bila ada
try:
    from wood_tf_id import TFID as _T; TFID.update(_T)
except Exception: pass

vocab, vn = [], 0
SRC = "木材産業特定技能1号測定試験 学習用テキスト(第1版, 全国木材組合連合会, 2025-05)"
bab_files, quiz = [], {"bab": {}, "tema": []}
for b in BAB:
    subs_out, quiz_sub = [], []
    allq = []
    for si, s in enumerate(SUBS[b["id"]], 1):
        flat_id, flat_jp = flat(s["id_bl"]), flat(s["jp_bl"])
        terms = s["terms"]
        kata_list = [t[0] for t in terms[:4]]
        summ_id = {"core": plain(flat_id[0]), "points": [plain(x) for x in flat_id[1:4]], "avoid": [],
                   "exam": ["Istilah penting: " + ", ".join(kata_list) + "."]}
        summ_jp = {"core": ruby(flat_jp[0]), "points": [ruby(x) for x in flat_jp[1:4]], "avoid": [],
                   "exam": [ruby("大事な用語：" + "、".join(kata_list) + "。")]}
        subs_out.append({"id": s["id"], "no": si, "title": {"id": s["t_id"], "jp": ruby(s["t_jp"])}, "pages": s["pages"],
                         "full": {"id": blocks(s["id_bl"]), "jp": blocks(s["jp_bl"], True)},
                         "summary": {"id": summ_id, "jp": summ_jp}})
        for t in terms:
            vn += 1
            kata, kana, arti_id, ex_jp, ex_id = t[0], t[1], t[2], t[3], t[4]
            vocab.append({"id": f"wd-{vn:03d}", "kata": kata, "kana": kana, "romaji": romaji(kana), "arti": arti_id,
                          "cat": b["title_id"], "bab": b["id"], "src": [s["id"]], "contoh": ruby(ex_jp), "arti_contoh": ex_id,
                          "sumber": "全木連 学習用テキスト 第1版 (diringkas Shirose)", "halaman": s["pages"][0]})
        items = [make_item(q, f"{s['id']}-{i}") for i, q in enumerate(s["qs"])]
        # pernyataan ○×: terjemahan ID memakai kunci kalimat JP
        for it in items:
            if it["q"]["id"].startswith("__TF__"):
                raw = it["q"]["id"][6:]
                it["q"]["id"] = "Benar atau salah: “" + TFID[raw] + "”"
        quiz_sub.append({"id": f"{s['id']}-q", "sub": s["id"], "title": {"id": f"Subbab {b['id'][3:]}.{si} · {s['t_id']}", "jp": f"{b['id'][3:]}.{si} " + ruby(s["t_jp"])}, "items": items})
        allq += items[:1]
    # kuis ulangan bab (rev=True: soalnya sudah ada di kuis subbab)
    rev_items = []
    for sq in quiz_sub: rev_items += sq["items"][:1]
    quiz["bab"][b["id"]] = [{"id": f"{b['id']}-q1", "rev": True, "title": {"id": f"Latihan Bab {b['id'][3:]}", "jp": ruby("第" + b['id'][3:] + "章の練習")}, "items": rev_items}] + quiz_sub
    bab_files.append(b["id"])
    json.dump({"schema": 1, "bidang": "wood-industry", "source": SRC + " — ringkasan & soal latihan ditulis ulang oleh Shirose Nihongo (bukan salinan teks). Soal = Latihan Shirose Nihongo, bukan soal resmi.",
               "markup": "Teks JP memakai {kanji|furigana} untuk ruby. Teks ID/JP memakai **tebal**.",
               "bab": {"id": b["id"], "no": int(b["id"][3:]), "title": {"id": b["title_id"], "jp": ruby(b["title_jp"])},
                       "intro": {"id": b["intro_id"], "jp": ruby(b["intro_jp"])}, "pages": b["pages"], "subs": subs_out}},
              open(OUT / f"{b['id']}.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)

# tema: soal keselamatan (dari bab1 b1s3)
saf = [it for sq in quiz["bab"]["bab1"] if sq.get("sub") == "b1s3" for it in sq["items"]]
quiz["tema"] = [{"id": "tema-wd", "tema": True, "title": {"id": "Tema: Keselamatan Kerja Kayu", "jp": ruby("テーマ：木材加工の安全")}, "items": saf}]
json.dump(quiz, open(OUT / "quiz.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
json.dump({"items": vocab}, open(OUT / "vocab.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
json.dump({"slug": "wood-industry", "nama": "Wood Industry (Industri Kayu)", "jp": "木材産業", "nobook": True,
           "bab": [{"id": b, "file": f"{b}.json"} for b in bab_files], "vocab": "vocab.json", "quiz": "quiz.json"},
          open(OUT / "index.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
nq = sum(len(sq["items"]) for v in quiz["bab"].values() for sq in v)
print("subbab", sum(len(SUBS[b['id']]) for b in BAB), "vocab", len(vocab), "soal", nq)
