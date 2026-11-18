# -*- coding: utf-8 -*-
"""Render PDF resmi menjadi halaman buku (assets/ssw/<slug>/jp/pNN.webp, 90 dpi) untuk Buku Interaktif.
   python3 tools/ssw/build_docbook.py   (idempoten)"""
import subprocess, pathlib, tempfile, shutil
D = pathlib.Path("assets/ssw/docs-resmi")
BOOKS = {
  "logistics": ["logistics/shiken-kijun-1go.pdf", "logistics/jitsushi-yoryo-1go.pdf", "logistics/bunya-unyo-hoshin.pdf"],
  "recycling": ["recycling/ikusei-career-program.pdf", "recycling/bunya-unyo-hoshin.pdf"],
}
for slug, files in BOOKS.items():
    out = pathlib.Path("assets/ssw") / slug / "jp"
    if out.exists(): shutil.rmtree(out)
    out.mkdir(parents=True)
    n = 0
    for f in files:
        with tempfile.TemporaryDirectory() as t:
            subprocess.run(["pdftoppm", "-r", "90", "-png", str(D / f), t + "/x"], check=True)
            for png in sorted(pathlib.Path(t).glob("x-*.png")):
                n += 1
                subprocess.run(["convert", str(png), "-resize", "745x", "-quality", "78", str(out / f"p{n:02d}.webp")], check=True)
    print(slug, n, "halaman")
