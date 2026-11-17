# -*- coding: utf-8 -*-
import json, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from railway_content import BABS, V
from railway_quiz import Q, TF, MC
SLUG = "railway-vehicle"
OUT = os.path.join(os.path.dirname(__file__), "..", "..", "data", "ssw", SLUG)
os.makedirs(OUT, exist_ok=True)
SRC = "鉄道分野（車両製造）特定技能1号評価試験 学習テキスト（初版） 日本鉄道車輌工業会 (JARi) https://www.tetsushako.or.jp/specific_skills.html — diringkas & diterjemahkan Shirose; perlu review ahli"

# ---- romaji
H = {}
base = "あいうえお かきくけこ さしすせそ たちつてと なにぬねの はひふへほ まみむめも や ゆ よ らりるれろ わ を ん".split()
def kk2h(s): return "".join(chr(ord(c)-0x60) if "ァ"<=c<="ヶ" else c for c in s)
R = {"あ":"a","い":"i","う":"u","え":"e","お":"o","か":"ka","き":"ki","く":"ku","け":"ke","こ":"ko","さ":"sa","し":"shi","す":"su","せ":"se","そ":"so","た":"ta","ち":"chi","つ":"tsu","て":"te","と":"to","な":"na","に":"ni","ぬ":"nu","ね":"ne","の":"no","は":"ha","ひ":"hi","ふ":"fu","へ":"he","ほ":"ho","ま":"ma","み":"mi","む":"mu","め":"me","も":"mo","や":"ya","ゆ":"yu","よ":"yo","ら":"ra","り":"ri","る":"ru","れ":"re","ろ":"ro","わ":"wa","を":"o","ん":"n","が":"ga","ぎ":"gi","ぐ":"gu","げ":"ge","ご":"go","ざ":"za","じ":"ji","ず":"zu","ぜ":"ze","ぞ":"zo","だ":"da","ぢ":"ji","づ":"zu","で":"de","ど":"do","ば":"ba","び":"bi","ぶ":"bu","べ":"be","ぼ":"bo","ぱ":"pa","ぴ":"pi","ぷ":"pu","ぺ":"pe","ぽ":"po"}
SM = {"ゃ":"ya","ゅ":"yu","ょ":"yo"}
def romaji(k):
    k = kk2h(k); out = []; i = 0; sok = False
    while i < len(k):
        c = k[i]
        if c == "っ": sok = True; i += 1; continue
        if c == "ー":
            if out: out.append(out[-1][-1])
            i += 1; continue
        r = R.get(c, c)
        if i+1 < len(k) and k[i+1] in SM:
            r = r[:-1] + ("" if r.endswith("i") and r in ("shi","chi","ji") else "y")+ SM[k[i+1]][1:] if r not in ("shi","chi","ji") else r[:-1] + SM[k[i+1]][1:]
            if c in "しちじ": r = {"し":"sh","ち":"ch","じ":"j"}[c] + SM[k[i+1]][1:]
            i += 1
        if sok: r = r[0] + r; sok = False
        out.append(r); i += 1
    return "".join(out)

def tf(q):
    return [{"id": "Benar (○)", "jp": "○ 正しい"}, {"id": "Salah (×)", "jp": "× 間違い"}]

PAGES = {}
idx = {"slug": SLUG, "nama": "Railway — Manufaktur Kereta (車両製造)", "jp": "鉄道（車両製造）", "bab": [], "vocab": "vocab.json", "quiz": "quiz.json",        "pages": {"jp": 224, "id": 0}, "book": "jp", "source": SRC}
vocab = []; vn = 0
catname = {b["no"]: b["id_"] for b in BABS}
for b in BABS:
    bid = f"bab{b['no']}"
    subs = []
    for si, (tid, tjp, pg, secs) in enumerate(b["subs"], 1):
        blocks = []
        for h, ul in secs:
            blocks.append({"h": h}); blocks.append({"ul": ul})
        subs.append({"id": f"b{b['no']}s{si}", "no": si, "title": {"id": tid, "jp": tjp}, "pages": [pg[0]+1, pg[1]+1],
                     "full": {"id": blocks}, "summary": {"id": [{"ul": [ul[0] for _, ul in secs]}]}})
    doc = {"schema": 1, "bidang": SLUG, "source": SRC, "markup": "Teks JP polos (tanpa furigana); **tebal**.",
           "bab": {"id": bid, "no": b["no"], "title": {"id": b["id_"], "jp": b["jp"]}, "intro": {"id": b["intro"], "jp": ""},
                   "pages": [b["pages"][0]+1, b["pages"][1]+1], "subs": subs}}
    json.dump(doc, open(os.path.join(OUT, f"{bid}.json"), "w", encoding="utf-8"), ensure_ascii=False)
    idx["bab"].append({"id": bid, "file": f"{bid}.json"})
for line in V:
    kata, kana, arti, bab = line.split("|")
    vn += 1
    vocab.append({"id": f"rw-{vn:03d}", "kata": kata, "kana": kana, "romaji": romaji(kana), "arti": arti,
                  "cat": catname[int(bab)], "bab": f"bab{bab}", "src": [f"b{bab}s1"], "contoh": "", "arti_contoh": "",
                  "fungsi": "", "status_validasi": "perlu review ahli", "sumber": "JARi 学習テキスト(初版)"})
quiz = {"bab": {}, "tema": []}
for no, items in Q.items():
    its = []
    for typ, qid, qjp, a, exp in items:
        if typ == TF:
            its.append({"q": {"id": f"Benar atau salah: “{qid}”", "jp": f"○か×か。「{qjp}」"}, "opts": tf(qid), "a": 0 if a else 1,
                        "exp": {"id": exp, "jp": ""}, "mb": True})
        else:
            opts, ai = a
            its.append({"q": {"id": qid, "jp": qjp}, "opts": [{"id": o, "jp": o} for o in opts], "a": ai, "exp": {"id": exp, "jp": ""}})
    quiz["bab"][f"bab{no}"] = [{"id": f"gen-rw-bab{no}", "rev": True, "title": {"id": f"Latihan Bab {no}: {catname[no]}", "jp": f"第{no}章の練習"}, "items": its}]
# tema: ujian campuran = 30 TF + 20 MC? ambil semua
alltf = [i for s in quiz["bab"].values() for i in s[0]["items"] if i.get("mb")]
allmc = [i for s in quiz["bab"].values() for i in s[0]["items"] if not i.get("mb")]
quiz["tema"].append({"id": "gen-rw-tema1", "tema": True, "title": {"id": "Ujian Campuran: ○× (学科)", "jp": "学科 ○×"}, "items": alltf})
quiz["tema"].append({"id": "gen-rw-tema2", "tema": True, "title": {"id": "Ujian Campuran: Pilihan Ganda (実技)", "jp": "実技 四択"}, "items": allmc})
json.dump(idx, open(os.path.join(OUT, "index.json"), "w", encoding="utf-8"), ensure_ascii=False)
json.dump({"items": vocab}, open(os.path.join(OUT, "vocab.json"), "w", encoding="utf-8"), ensure_ascii=False)
json.dump(quiz, open(os.path.join(OUT, "quiz.json"), "w", encoding="utf-8"), ensure_ascii=False)
print("vocab", len(vocab), "tf", len(alltf), "mc", len(allmc))
