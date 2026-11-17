# -*- coding: utf-8 -*-
"""Ekstrak teks Jepang per halaman dari panduan-belajar-jp.pdf JAIM (buang baris ruby/furigana kana-saja).
Pakai: python3 tools/ssw/jaim_jp_extract.py <slug> -> /tmp/jj/<slug>.json  {pdf_page: [lines]}"""
import sys, re, json, subprocess
J = r"[぀-ヿ一-鿿々]"
def clean_page(t):
    raw = [re.sub(r"\s+", " ", l).strip() for l in t.split("\n")]
    raw = [l for l in raw if l]
    out = []
    for i, s in enumerate(raw):
        nxt = raw[i + 1] if i + 1 < len(raw) else ""
        if re.fullmatch(r"[ぁ-んー・ ]{2,}", s) and re.search(r"[一-鿿]", nxt): continue
        s = re.sub(r"(?<=%s) (?=%s)" % (J, J), "", s)
        out.append(s)
    return out
def page_lines(pg):
    """Baris teks halaman tanpa span ruby (font <=6.5pt, atau kana-saja <=8pt); span disatukan per garis dasar."""
    sps = []
    for b in pg.get_text("dict")["blocks"]:
        for l in b.get("lines", []):
            for sp in l["spans"]:
                x, z = sp["text"], sp["size"]
                if z <= 6.5 or (z <= 8.2 and re.fullmatch(r"[ぁ-んー・ \u3000]+", x)): continue
                if x.strip(): sps.append((sp["origin"][1], sp["origin"][0], x))
    sps.sort(key=lambda a: (a[0], a[1]))
    rows = []
    for y, x0, t in sps:
        if rows and abs(rows[-1][0] - y) <= 2.5: rows[-1][1].append((x0, t)); rows[-1][0] = y
        else: rows.append([y, [(x0, t)]])
    out = []
    for y, parts in rows:
        t = " ".join(t for _, t in sorted(parts))
        t = re.sub(r"\s+", " ", t).strip()
        t = re.sub(r"(?<=%s) (?=%s)" % (J, J), "", t)
        if t: out.append(t)
    return out
def run(slug):
    import pymupdf
    doc = pymupdf.open(f"assets/ssw/{slug}/pdf/panduan-belajar-jp.pdf")
    json.dump({i + 1: page_lines(doc[i]) for i in range(len(doc))}, open(f"/tmp/jj/{slug}.json", "w"), ensure_ascii=False)
def run_old(slug):
    pdf = f"assets/ssw/{slug}/pdf/panduan-belajar-jp.pdf"
    n = int(re.search(r"Pages:\s+(\d+)", subprocess.run(["pdfinfo", pdf], capture_output=True, text=True).stdout).group(1))
    res = {}
    for p in range(1, n + 1):
        t = subprocess.run(["pdftotext", "-f", str(p), "-l", str(p), "-layout", pdf, "-"], capture_output=True, text=True).stdout
        res[p] = clean_page(t)
    json.dump(res, open(f"/tmp/jj/{slug}.json", "w"), ensure_ascii=False)
if __name__ == "__main__":
    for s in sys.argv[1:]: run(s)
