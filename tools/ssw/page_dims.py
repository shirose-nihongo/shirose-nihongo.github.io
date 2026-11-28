"""Tulis assets/ssw/page-dims.json: ukuran halaman buku SSW per folder (dir/lang).

Pembaca buku memakai ini untuk aspect-ratio tiap halaman, supaya tinggi halaman
sudah pasti sebelum gambarnya termuat (zoom & scroll tidak melompat).
Format: {"kaigo/jp": {"w":1400,"h":1980,"x":{"12":[1170,827]}}} — x = halaman (nomor file pNN) yang ukurannya beda.
Jalankan ulang setiap kali menambah/mengganti halaman buku.
"""
import collections, json, os, re
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..", "..", "assets", "ssw")
out = {}
for d in sorted(os.listdir(ROOT)):
    for lang in sorted(os.listdir(os.path.join(ROOT, d)) if os.path.isdir(os.path.join(ROOT, d)) else []):
        p = os.path.join(ROOT, d, lang)
        if not os.path.isdir(p):
            continue
        dims = {}
        for f in os.listdir(p):
            m = re.fullmatch(r"p(\d+)\.webp", f)
            if m:
                dims[int(m.group(1))] = Image.open(os.path.join(p, f)).size
        if not dims:
            continue
        (w, h), _ = collections.Counter(dims.values()).most_common(1)[0]
        x = {str(n): list(s) for n, s in sorted(dims.items()) if s != (w, h)}
        out[f"{d}/{lang}"] = {"w": w, "h": h, **({"x": x} if x else {})}

with open(os.path.join(ROOT, "page-dims.json"), "w") as fh:
    json.dump(out, fh, separators=(",", ":"))
print(len(out), "folder")
