# -*- coding: utf-8 -*-
"""Render PDF -> assets/ssw/<slug>/jp/pNN.webp (nomor berlanjut). Pemakaian: render_pages.py <slug> <pdf1> [<pdf2> ...]
Mencetak awal-akhir halaman tiap PDF."""
import sys, os, subprocess, tempfile, glob
from PIL import Image
slug = sys.argv[1]; out = os.path.join("assets", "ssw", slug, "jp"); os.makedirs(out, exist_ok=True)
n = 0
for pdf in sys.argv[2:]:
    start = n + 1
    with tempfile.TemporaryDirectory() as t:
        subprocess.run(["pdftoppm", "-r", "100", "-png", pdf, os.path.join(t, "x")], check=True)
        for f in sorted(glob.glob(os.path.join(t, "x-*.png"))):
            n += 1
            im = Image.open(f).convert("RGB")
            im.save(os.path.join(out, f"p{n:02d}.webp"), "WEBP", quality=62, method=6)
    print(os.path.basename(pdf), start, n)
