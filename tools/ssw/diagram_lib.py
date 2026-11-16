# -*- coding: utf-8 -*-
"""Pustaka kecil untuk menggambar diagram skematis komponen (SVG) + membangun data diagram/flashcard bergambar.

Diagram = gambar skematis ORISINAL Shirose (bukan salinan gambar buku). Tiap bagian (part) menunjuk satu kosakata
di vocab.json bidang tsb (satu database kosakata). Kata yang belum ada ditambahkan ke vocab.json dengan id baru
(sumber "Shirose") — tanpa duplikat, idempoten.
"""
import json, math, os, re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
W, H = 400, 270

STYLE = (".bg{fill:#e9edf8;stroke:#aab3d4;stroke-width:1.5}.bgl{fill:none;stroke:#aab3d4;stroke-width:2;stroke-linecap:round}"
         ".pt{cursor:pointer}.pt .f{fill:#c9d2ee;stroke:#4a5688;stroke-width:1.6}"
         ".pt .s{fill:none;stroke:#4a5688;stroke-width:5;stroke-linecap:round;stroke-linejoin:round}"
         ".pt .t{fill:none;stroke:#4a5688;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}"
         ".pt.on .f{fill:#ffc266 !important;stroke:#d9480f}.pt.on .s,.pt.on .t{stroke:#d9480f}"
         ".pt:hover .f{fill:#dfe5fa}.pt.on:hover .f{fill:#ffc266}")


def _a(**k):
    out = ""
    for a, v in k.items():
        out += f' style="fill:{v}"' if a == "fill" else f' {a.replace("_", "-")}="{v}"'
    return out


# --- bentuk dasar. cls: f = terisi, s = garis tebal, t = garis tipis, bg = latar konteks ---
def R(x, y, w, h, r=0, c="f", **k): return f'<rect class="{c}" x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}"{_a(**k)}/>'
def C(x, y, r, c="f", **k): return f'<circle class="{c}" cx="{x}" cy="{y}" r="{r}"{_a(**k)}/>'
def E(x, y, rx, ry, c="f", **k): return f'<ellipse class="{c}" cx="{x}" cy="{y}" rx="{rx}" ry="{ry}"{_a(**k)}/>'
def P(d, c="f", **k): return f'<path class="{c}" d="{d}"{_a(**k)}/>'
def L(x1, y1, x2, y2, c="s", **k): return f'<line class="{c}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"{_a(**k)}/>'
def POLY(pts, c="f", **k): return f'<polygon class="{c}" points="{" ".join(f"{x},{y}" for x, y in pts)}"{_a(**k)}/>'
def TXT(x, y, s, size=12, fill="#6a739c", **k): return f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" text-anchor="middle" font-family="sans-serif" font-weight="700"{_a(**k)}>{s}</text>'
def zig(x0, x1, y0, y1, n=6):
    pts = []
    for i in range(n * 2 + 1):
        y = y0 + (y1 - y0) * i / (n * 2)
        pts.append(f"{x0 if i % 2 == 0 else x1},{round(y, 1)}")
    return "M" + " L".join(pts)
def hexa(cx, cy, r, c="f"):
    return POLY([(round(cx + r * math.cos(math.radians(60 * i)), 1), round(cy + r * math.sin(math.radians(60 * i)), 1)) for i in range(6)], c)


class Dia:
    def __init__(self, id, title_id, title_jp, intro, bg=""):
        self.id, self.title_id, self.title_jp, self.intro, self.bg = id, title_id, title_jp, intro, bg
        self.parts = []  # (pid, kata, fungsi, svg, extra)

    def part(self, kata, fungsi, *els, extra=None):
        pid = f"p{len(self.parts) + 1}"
        self.parts.append(dict(pid=pid, kata=kata, fungsi=fungsi, svg="".join(els), extra=extra))
        return self

    def svg(self, on=None):
        g = []
        for p in self.parts:
            cls = "pt on" if p["pid"] == on else "pt"
            g.append(f'<g class="{cls}" data-p="{p["pid"]}">{p["svg"]}</g>')
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img"><style>{STYLE}</style>'
                f'<rect width="{W}" height="{H}" rx="14" fill="#fff"/><g>{self.bg}</g>{"".join(g)}</svg>')


def load_vocab(slug):
    p = os.path.join(ROOT, "data/ssw", slug, "vocab.json")
    d = json.load(open(p, encoding="utf-8"))
    return p, d, (d["items"] if isinstance(d, dict) and "items" in d else d)


def build(slug, prefix, dias, grp_title, alat_info):
    """Tulis assets/ssw/<slug>/diagram/*.svg, data/ssw/<slug>/diagram.json, alat.json (flashcard bergambar)
    dan tambahkan kosakata baru ke vocab.json. Idempoten."""
    vp, vd, vocab = load_vocab(slug)
    by_kata = {}
    for v in vocab:
        by_kata.setdefault(v["kata"], v)
    nums = [int(re.sub(r"\D", "", v["id"]) or 0) for v in vocab]
    nxt = max(nums) + 1
    outdir = os.path.join(ROOT, "assets/ssw", slug, "diagram")
    os.makedirs(outdir, exist_ok=True)
    for f in os.listdir(outdir):
        if f.endswith(".svg"):
            os.remove(os.path.join(outdir, f))
    diag_out, alat_items, added = [], [], 0
    first_bab = None
    try:
        first_bab = json.load(open(os.path.join(ROOT, "data/ssw", slug, "index.json"), encoding="utf-8"))["bab"][0]["id"]
    except Exception:
        pass
    for d in dias:
        parts_out = []
        for p in d.parts:
            v = by_kata.get(p["kata"])
            if not v:
                ex = p["extra"]
                if not ex:
                    raise SystemExit(f"[{slug}] kata '{p['kata']}' tidak ada di vocab dan tidak punya extra")
                v = {"id": f"{prefix}-{nxt:03d}", "kata": p["kata"], "kana": ex[0], "romaji": ex[1], "arti": ex[2],
                     "cat": grp_title, "bab": ex[3] if len(ex) > 3 else (first_bab or "bab1"), "src": list(ex[4]) if len(ex) > 4 else [], "sumber": "Shirose (diagram)"}
                nxt += 1; added += 1
                vocab.append(v); by_kata[v["kata"]] = v
            parts_out.append({"pid": p["pid"], "vid": v["id"], "jp": v["kata"], "kana": v.get("kana", ""), "romaji": v.get("romaji", ""),
                              "arti": v["arti"], "fungsi": p["fungsi"]})
            n = int(re.sub(r"\D", "", v["id"]))
            img = f"assets/ssw/{slug}/diagram/{d.id}-{p['pid']}.svg"
            open(os.path.join(ROOT, img), "w", encoding="utf-8").write(d.svg(on=p["pid"]).replace("cursor:pointer", ""))
            alat_items.append({"id": f"dg-{d.id}-{p['pid']}", "no": n, "jp": v["kata"], "kana": v.get("kana", ""), "romaji": v.get("romaji", ""),
                               "arti": v["arti"], "fungsi": p["fungsi"], "img": img, "p": d.id, "vid": v["id"]})
        file = f"assets/ssw/{slug}/diagram/{d.id}.svg"
        open(os.path.join(ROOT, file), "w", encoding="utf-8").write(d.svg())
        diag_out.append({"id": d.id, "title": {"id": d.title_id, "jp": d.title_jp}, "intro": d.intro, "svg": file, "parts": parts_out})
    # vocab.json (tambahan saja; tidak menghapus apa pun)
    if added:
        if isinstance(vd, dict):
            vd["items"] = vocab
        json.dump(vd, open(vp, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump({"schema": 1, "note": "Diagram skematis orisinal Shirose; tiap bagian menunjuk kosakata di vocab.json (vid).", "diagrams": diag_out},
              open(os.path.join(ROOT, "data/ssw", slug, "diagram.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump({"schema": 2, "info": alat_info, "groups": [{"id": d.id, "title": d.title_id} for d in dias], "items": alat_items},
              open(os.path.join(ROOT, "data/ssw", slug, "alat.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    # index.json: aktifkan panel flashcard bergambar + diagram
    ip = os.path.join(ROOT, "data/ssw", slug, "index.json")
    idx = json.load(open(ip, encoding="utf-8"))
    idx["alat"] = True; idx["diagram"] = "diagram.json"
    json.dump(idx, open(ip, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    return {"slug": slug, "diagrams": len(dias), "parts": len(alat_items), "vocab_baru": added}
