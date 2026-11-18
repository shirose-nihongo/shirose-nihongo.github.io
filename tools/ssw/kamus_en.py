"""Fallback arti Inggris (JMdict) untuk kata di materi JP yang belum ada di kamus Indonesia. -> data/ssw/kamus-en.json"""
import json, glob, re, collections
from jamdict import Jamdict
J = Jamdict()
K = json.load(open("data/ssw/kamus.json"))
rx = re.compile(r"\{([^|{}]+)\|([^{}]+)\}([ぁ-ん]{0,4})")
def texts(o, out):
    if isinstance(o, str): out.append(o)
    elif isinstance(o, list): [texts(x, out) for x in o]
    elif isinstance(o, dict): [texts(v, out) for v in o.values()]
freq = collections.Counter(); rdg = {}
for d in sorted(glob.glob("data/ssw/*/")):
    i = json.load(open(d + "index.json")); T = []
    for b in i["bab"]:
        for sub in json.load(open(d + b["file"]))["bab"]["subs"]:
            f = sub.get("full", {}); texts(f.get("jp", []), T)
            sm = sub.get("summary", {}); texts(sm.get("jp", []) if isinstance(sm, dict) else [], T)
    for t in T:
        for m in rx.finditer(t):
            base, rd, ok = m.groups()
            cs = [(base + ok[:n], rd + ok[:n]) for n in range(len(ok), -1, -1)]
            if any(c[0] in K for c in cs): continue
            for c in cs: freq[c[0]] += 1; rdg[c[0]] = c[1]
            # simpan kandidat utama (terpanjang) saja untuk dihitung
print("kandidat:", len(freq))
out = {}
for w, n in freq.most_common():
    r = J.lookup(w, lookup_chars=False)
    if not r.entries: continue
    e = r.entries[0]
    gl = [s.text() for s in e.senses[:1]]
    kana = e.kana_forms[0].text if e.kana_forms else rdg[w]
    out[w] = [kana, "; ".join(gl)[:90]]
print("dapat arti Inggris:", len(out))
json.dump(out, open("data/ssw/kamus-en.json", "w"), ensure_ascii=False, separators=(",", ":"))
json.dump(dict(freq.most_common(3000)), open("/tmp/freq.json", "w"), ensure_ascii=False)
