# -*- coding: utf-8 -*-
"""Bangun 'buku Indonesia' dari ringkasan/teks lengkap ID di data/ssw/<slug>/babN.json:
render tiap subbab ke PDF A4 (Chromium), lalu ke WebP assets/ssw/<slug>/id/pNN.webp (+ PDF gabungan).
Subbab: pages = halaman buku ID (viewer, p = file-1), pagesJp = halaman buku Jepang asli. Idempotent.
Pakai:  python3 tools/ssw/build_idbook.py wood-industry auto-transport"""
import json, re, sys, os, glob, subprocess, shutil, html, pathlib
from playwright.sync_api import sync_playwright
REPO = pathlib.Path(__file__).resolve().parents[2]
def strip(s): return re.sub(r"\{([^|{}]+)\|([^{}]+)\}", r"\1", s)
def inline(s):
    s = html.escape(strip(s)); return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
CSS = """@page{size:A4;margin:16mm 15mm 18mm}body{font-family:'Noto Sans','Noto Sans CJK JP',sans-serif;font-size:11.5pt;line-height:1.55;color:#1d1d26}
.k{font-size:9.5pt;color:#7a5a2b;letter-spacing:.04em;margin:0}h1{font-size:19pt;margin:4px 0 2px;color:#2a1f4d}.j{font-size:11pt;color:#555;margin:0 0 10px}
h2{font-size:13pt;color:#2a1f4d;border-bottom:2px solid #e2c9a0;padding-bottom:2px;margin:16px 0 6px}ul{margin:4px 0 8px 18px;padding:0}li{margin:3px 0}
.note{background:#fff5df;border-left:4px solid #e0a53a;padding:6px 10px;margin:8px 0}p{margin:6px 0}
.ft{margin-top:18px;font-size:8.5pt;color:#777;border-top:1px solid #ddd;padding-top:5px}"""
def sub_html(slug, nama, c, s):
    out = [f"<p class='k'>{html.escape(nama)} · BAB {c['no']} — {inline(c['title']['id'])} · Subbab {c['no']}.{s['no']}</p><h1>{inline(s['title']['id'])}</h1><p class='j'>{html.escape(strip(s['title'].get('jp','')))}</p>"]
    for b in (s.get("full", {}).get("id") or s.get("summary", {}).get("id") or []):
        if "h" in b: out.append(f"<h2>{inline(b['h'])}</h2>")
        elif "ul" in b: out.append("<ul>" + "".join(f"<li>{inline(x)}</li>" for x in b["ul"]) + "</ul>")
        elif "p" in b: out.append(f"<p>{inline(b['p'])}</p>")
        elif "note" in b: out.append(f"<div class='note'>{inline(b['note'])}</div>")
    out.append("<div class='ft'>Ringkasan Indonesia oleh Shirose Nihongo berdasarkan teks belajar resmi (bukan terjemahan resmi). Untuk teks asli lihat halaman Jepang.</div>")
    return f"<html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{''.join(out)}</body></html>"
def main(slugs):
    with sync_playwright() as p:
        br = p.chromium.launch(); pg = br.new_page()
        for slug in slugs:
            D = REPO / "data/ssw" / slug; A = REPO / "assets/ssw" / slug
            idx = json.load(open(D / "index.json")); nama = idx["nama"]
            tmp = pathlib.Path("/tmp/idbook") / slug; shutil.rmtree(tmp, ignore_errors=True); tmp.mkdir(parents=True)
            outdir = A / "id"; shutil.rmtree(outdir, ignore_errors=True); outdir.mkdir(parents=True)
            files = []; spans = {}; n = 0   # n = jumlah halaman sebelumnya
            pg.set_content(f"<html><head><meta charset='utf-8'><style>{CSS}</style></head><body><div style='margin-top:90mm;text-align:center'><p class='k'>SHIROSE NIHONGO · SSW</p><h1 style='font-size:26pt'>{html.escape(nama)}</h1><p class='j'>Buku belajar versi Indonesia</p><p style='color:#666;font-size:10pt'>Ringkasan oleh Shirose Nihongo dari teks belajar resmi.<br>Bukan terjemahan resmi. Halaman asli (Jepang) tersedia lewat tombol 日本語.</p></div></body></html>")
            cov = tmp / "_cover.pdf"; pg.pdf(path=str(cov), format="A4", print_background=True); files.append(cov); n = 1
            babs = []
            for bf in idx["bab"]:
                path = D / bf["file"]; bd = json.load(open(path)); babs.append((path, bd))
            for path, bd in babs:
                c = bd["bab"]
                for s in c["subs"]:
                    pg.set_content(sub_html(slug, nama, c, s)); pdf = tmp / f"{s['id']}.pdf"
                    pg.pdf(path=str(pdf), format="A4", print_background=True)
                    k = int(re.search(r"Pages:\s+(\d+)", subprocess.run(["pdfinfo", str(pdf)], capture_output=True, text=True).stdout).group(1))
                    spans[s["id"]] = (n, n + k - 1); files.append(pdf); n += k
            merged = tmp / "all.pdf"; subprocess.run(["pdfunite", *map(str, files), str(merged)], check=True)
            subprocess.run(["pdftoppm", "-r", "90", "-png", str(merged), str(tmp / "pg")], check=True)
            for i, f in enumerate(sorted(glob.glob(str(tmp / "pg-*.png"))), 1):
                subprocess.run(["convert", f, "-quality", "72", "-define", "webp:method=4", str(outdir / f"p{i:02d}.webp")], check=True)
            os.makedirs(A / "pdf", exist_ok=True); shutil.copy(merged, A / "pdf" / f"shirose-ringkasan-indonesia-{slug}.pdf")
            # tulis ke data: pages = halaman ID (viewer p = file-1 => file i = halaman i-1), pagesJp = asli
            for path, bd in babs:
                c = bd["bab"]
                for s in c["subs"]:
                    jp = s.get("pagesJp") or s["pages"]; a, b = spans[s["id"]]
                    s["pagesJp"] = jp; s["pages"] = [a, b]
                c["pagesJp"] = c.get("pagesJp") or c["pages"]
                json.dump(bd, open(path, "w", encoding="utf8"), ensure_ascii=False, indent=1)
            idx.pop("book", None); idx.pop("nobook", None)
            idx["pages"] = {"jp": idx.get("pages", {}).get("jp"), "id": n}
            json.dump(idx, open(D / "index.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
            print(slug, "halaman ID:", n)
        br.close()
if __name__ == "__main__": main(sys.argv[1:])
