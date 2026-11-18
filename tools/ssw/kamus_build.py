"""Bangun data/ssw/kamus.json: kamus kata (kata -> [kana, arti]) dari kosakata JLPT/IR/SSW + semua vocab SSW.
Dipakai pop-up ketuk kata di materi (arti KATA utuh, bukan per kanji)."""
import json, glob, os, re
D = {}
def add(k, r, a, pri):
    k = (k or "").strip(); a = (a or "").strip()
    if not k or not a: return
    k = re.sub(r"[（(].*?[）)]", "", k).strip() or k
    r = re.sub(r"[（(].*?[）)]", "", r or "").strip()
    cur = D.get(k)
    if cur is None or pri < cur[2]: D[k] = [r, a, pri]
    # varian tanpa 〜 / する
for f, pri in [("ssw-bc", 3), ("n5", 4), ("n4", 4), ("n3", 4), ("n2", 4), ("n1", 4), ("ir0", 5), ("ir1", 5), ("ir2", 5)]:
    for it in json.load(open(f"data/kosakata-{f}.json")):
        add(it.get("kata"), it.get("kana"), it.get("arti"), pri)
for p in glob.glob("data/ssw/*/vocab.json"):
    d = json.load(open(p)); d = d.get("items", d) if isinstance(d, dict) else d
    for it in d: add(it.get("kata"), it.get("kana"), it.get("arti"), 1)
manual = json.load(open("tools/ssw/kamus_manual.json")) if os.path.exists("tools/ssw/kamus_manual.json") else {}
for k, v in manual.items(): D[k] = [v[0], v[1], 0]
KJ = re.compile(r"[\u4e00-\u9fff]")
out = {k: [v[0], v[1]] for k, v in D.items() if KJ.search(k)}
json.dump(out, open("data/ssw/kamus.json", "w"), ensure_ascii=False, separators=(",", ":"))
print(len(out), os.path.getsize("data/ssw/kamus.json") // 1024, "KB")
