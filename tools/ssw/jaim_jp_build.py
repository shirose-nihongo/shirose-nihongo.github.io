# -*- coding: utf-8 -*-
"""Tambah bacaan Jepang berfurigana (full.jp + summary.jp) ke 3 bidang JAIM dari panduan-belajar-jp.pdf resmi.
Pakai: python3 tools/ssw/jaim_jp_extract.py <slug...> && python3 tools/ssw/jaim_jp_build.py <slug...>"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
import aviation_build as AB
RB = re.compile(r"\{([^{}|]*)\|[^{}]*\}")
NA = r"[^\x00-\x7f]"
def norm(s): return re.sub(r"[\s　・、，,。（）()「」『』※]", "", RB.sub(r"\1", s))
def tidy(t):
    t = re.sub(r"\s+", " ", t).strip()
    t = re.sub(r"(?<=%s) | (?=%s)" % (NA, NA), "", t)
    return t
def head_match(line, t):
    m = re.match(r"^((?:\d+\.)+\d*|\(\d+\)|[①-⑩])?\s*(.*)$", line)
    n = norm(m.group(2)) if m else norm(line)
    return bool(n) and (n == t or (len(t) >= 3 and ((n.startswith(t) and len(n) < len(t) + 14) or (n.endswith(t) and len(n) < len(t) + 6))))
def to_blocks(lines):
    out = []; cur = None
    def flush():
        nonlocal cur
        if cur: out.append({"p": cur}); cur = None
    for l in lines:
        if re.match(r"^(\d+\.\d+(\.\d+)*|\(\d+\))\s*\S", l) and len(l) < 60:
            flush(); out.append({"h": l}); continue
        if re.match(r"^[①-⑩●・■◆▶]", l):
            flush(); it = re.sub(r"^[●・■◆▶]\s*", "", l)
            if out and "ul" in out[-1]: out[-1]["ul"].append(it)
            else: out.append({"ul": [it]})
            continue
        if l.startswith("※"):
            flush(); out.append({"note": l.lstrip("※ ")}); continue
        if cur and not re.search(r"[。！？：:]$", cur): cur += l
        else: flush(); cur = l
    flush(); return out
def fb(blocks):
    r = []
    for b in blocks:
        if "h" in b: r.append({"h": AB.furi(b["h"])})
        elif "ul" in b: r.append({"ul": [AB.furi(x) for x in b["ul"]]})
        elif "note" in b: r.append({"note": AB.furi(b["note"])})
        else: r.append({"p": AB.furi(b["p"])})
    return r
def summary(blocks):
    ps = [b["p"] for b in blocks if "p" in b]
    core = ps[0] if ps else (blocks[0].get("h") or "") if blocks else ""
    if len(core) > 110: core = core[:110].rsplit("。", 1)[0] + "。" if "。" in core[:110] else core[:110] + "…"
    pts = [re.sub(r"^(\d+\.\d+(\.\d+)*|\(\d+\))\s*", "", b["h"]) for b in blocks if "h" in b][:6]
    if len(pts) < 2: pts = [x for b in blocks if "ul" in b for x in b["ul"]][:6] or pts
    return {"core": AB.furi(core), "points": [AB.furi(x) for x in pts]}
def run(slug):
    pages = json.load(open(f"/tmp/jj/{slug}.json"))
    lines = []
    for p, L in pages.items():
        for l in L:
            l = tidy(l)
            if l and not l.startswith("▌"): lines.append((int(p), l))
    idx = json.load(open(f"data/ssw/{slug}/index.json"))
    subs = []
    for bb in idx["bab"]:
        path = f"data/ssw/{slug}/{bb['file']}"; d = json.load(open(path))
        subs += [(path, d, s) for s in d["bab"]["subs"] if s["no"] != 99]
    pos = 0; starts = []
    for path, d, s in subs:
        t = norm(s["title"]["jp"]); hit = None
        for i in range(pos, len(lines)):
            if head_match(lines[i][1], t): hit = i; break
        starts.append(hit)
        if hit is not None: pos = hit + 1
    miss = [s["id"] for (_, _, s), h in zip(subs, starts) if h is None]
    for k, (path, d, s) in enumerate(subs):
        if starts[k] is None: continue
        end = next((starts[j] for j in range(k + 1, len(subs)) if starts[j] is not None), len(lines))
        body = [l for _, l in lines[starts[k] + 1:end]]
        while body and re.match(r"^(\d+\.\s|第\s*\d+\s*章)", body[-1]): body.pop()
        bl = to_blocks(body)
        if not bl: miss.append(s["id"] + "(kosong)"); continue
        s.setdefault("full", {})["jp"] = fb(bl)
        s.setdefault("summary", {})["jp"] = summary(bl)
    for path in {p for p, _, _ in subs}:
        d = next(d for p, d, _ in subs if p == path)
        json.dump(d, open(path, "w"), ensure_ascii=False, indent=1)
    print(slug, len(subs), "tanpa teks JP:", miss)
if __name__ == "__main__":
    for s in sys.argv[1:]: run(s)
