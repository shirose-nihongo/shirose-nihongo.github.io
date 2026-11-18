# -*- coding: utf-8 -*-
"""Cari kata ber-ruby ({kanji|kana}) di materi/soal suatu bidang yang belum punya entri kosakata (sehingga ketukan di UI jatuh ke arti per-kanji).
Pakai:  python3 tools/ssw/vocab_gap.py <slug> [--apply tools/ssw/gloss/<slug>.json]
 - otomatis memakai kamus umum (data/kosakata-*.json + kosakata-ssw-bc.json) bila kata ada di sana
 - sisanya dicetak ke /tmp/vg/<slug>.txt untuk diberi arti manual (file gloss: {"kata|kana": "arti"}).
 - --apply: menambah entri ke data/ssw/<slug>/vocab.json (idempotent)."""
import json, re, glob, os, sys, collections
ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
RB = re.compile(r'\{([^{}|]+)\|([^{}|]+)\}')
KJ = re.compile(r'[一-鿿]')
def hira(s): return "".join(chr(ord(c)-0x60) if "ァ"<=c<="ヶ" else c for c in s)
def general():
    g = {}
    for f in glob.glob(os.path.join(ROOT, "data", "kosakata-*.json")):
        for it in json.load(open(f, encoding="utf-8")):
            g.setdefault(it["kata"], []).append((it.get("kana", ""), it["arti"]))
    return g
def scan(slug):
    d = os.path.join(ROOT, "data", "ssw", slug)
    txt = ""
    for fn in glob.glob(os.path.join(d, "*.json")):
        if fn.endswith(("index.json", "vocab.json", "kanji.json", "bunpou.json", "figs.json")): continue
        txt += open(fn, encoding="utf-8").read()
    # gabungkan ruby per-kanji berurutan: {意|い}{味|み} -> kata 意味|いみ (untuk deteksi saja)
    toks = collections.Counter()
    for m in RB.finditer(txt):
        toks[(m.group(1), m.group(2))] += 1
    return toks
def main():
    slug = sys.argv[1]
    d = os.path.join(ROOT, "data", "ssw", slug)
    v = json.load(open(os.path.join(d, "vocab.json"), encoding="utf-8")); items = v["items"] if isinstance(v, dict) else v
    kata = {i["kata"] for i in items}; rbs = {k for i in items for k in (i.get("rb") or [])}
    gen = general(); toks = scan(slug)
    multi = [k for k in kata if len(k) >= 2]
    def covered(b, r):
        if b in kata or f"{b}|{r}" in rbs: return True
        return any(k in b for k in multi)   # kata sektor di dalam blok ruby -> sudah bisa diketuk (arti kata itu)
    unc = [(b, r, c) for (b, r), c in toks.items() if len(KJ.findall(b)) >= 2 and not covered(b, r)]
    gloss = {}
    if "--apply" in sys.argv:
        gf = sys.argv[sys.argv.index("--apply") + 1]
        gloss = json.load(open(os.path.join(ROOT, gf), encoding="utf-8")) if os.path.exists(os.path.join(ROOT, gf)) else {}
    auto, manual, add = 0, [], []
    for b, r, c in sorted(unc, key=lambda x: -x[2]):
        a = gloss.get(f"{b}|{r}")
        if not a and b in gen:
            cand = [x for x in gen[b] if hira(x[0]) == r] or gen[b]
            a = cand[0][1]; auto += 1
        if a: add.append((b, r, a))
        else: manual.append((b, r, c))
    done = {(b, r) for b, r, _ in add}
    for key, a in gloss.items():            # entri gloss eksplisit (mis. kanji tunggal yang berarti sendiri)
        b, r = key.split("|", 1)
        if (b, r) not in done and b not in kata and key not in rbs: add.append((b, r, a)); done.add((b, r))
    open(f"/tmp/vg/{slug}.txt", "w", encoding="utf-8").write("\n".join(f"{b}|{r}\t{c}" for b, r, c in manual))
    print(slug, "uncovered", len(unc), "auto/gloss", len(add), "manual-left", len(manual))
    if "--apply" in sys.argv and add:
        n0 = len(items); nid = n0 + 1; pre = (items[0]["id"].rsplit("-", 1)[0] if items and "-" in items[0]["id"] else slug[:2])
        have = {i["id"] for i in items}
        sys.path.insert(0, os.path.dirname(__file__))
        from vocab_romaji import romaji
        for b, r, a in add:
            while f"{pre}-{nid:04d}" in have: nid += 1
            i = {"id": f"{pre}-{nid:04d}", "kata": b, "kana": r, "romaji": romaji(r), "arti": a, "cat": "Kosakata tambahan", "bab": "b1", "src": [], "rb": [f"{b}|{r}"]}
            items.append(i); have.add(i["id"])
        json.dump({"items": items} if isinstance(v, dict) else items, open(os.path.join(d, "vocab.json"), "w", encoding="utf-8"), ensure_ascii=False)
        print("added", len(add))
if __name__ == "__main__": main()
