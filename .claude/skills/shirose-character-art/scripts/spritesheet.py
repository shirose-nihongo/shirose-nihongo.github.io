#!/usr/bin/env python3
"""Rakit frame animasi → sprite sheet + atlas JSON + preview GIF. Juga hapus latar polos (chroma/auto) bila perlu.

  python3 spritesheet.py --frames DIR --out assets/characters/shirose/sprites/sword_attack --cols 6 --size 512 [--bg auto|none|#RRGGBB] [--gif 12]
Frame diurutkan menurut nama file. Semua frame dinormalisasi ke kanvas size×size, kaki sejajar di dasar (anchor bawah-tengah)
agar tidak 'melompat' antar-frame. Keluaran: <out>.png, <out>.json (atlas), <out>.gif (opsional).
"""
import argparse, glob, json, os
from PIL import Image
import numpy as np

def cut_bg(im, mode):
    im = im.convert("RGBA")
    if mode == "none" or im.getchannel("A").getextrema()[0] < 250: return im
    a = np.array(im); h, w = a.shape[:2]
    if mode == "auto": bg = np.median(np.concatenate([a[0, :, :3], a[-1, :, :3], a[:, 0, :3], a[:, -1, :3]]), axis=0)
    else: bg = np.array([int(mode[i:i + 2], 16) for i in (1, 3, 5)])
    d = np.linalg.norm(a[:, :, :3].astype(float) - bg, axis=2)
    a[:, :, 3] = np.clip((d - 18) * 12, 0, 255).astype(np.uint8)       # tepi halus
    return Image.fromarray(a)

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--frames", required=True); ap.add_argument("--out", required=True)
    ap.add_argument("--cols", type=int, default=6); ap.add_argument("--size", type=int, default=512)
    ap.add_argument("--bg", default="none"); ap.add_argument("--gif", type=int, default=0, help="fps GIF preview (0=tidak)")
    a = ap.parse_args()
    files = sorted(sum([glob.glob(os.path.join(a.frames, e)) for e in ("*.png", "*.webp", "*.jpg")], []))
    if not files: raise SystemExit("tidak ada frame")
    ims = [cut_bg(Image.open(f), a.bg) for f in files]
    boxes = [i.getbbox() or (0, 0, i.width, i.height) for i in ims]
    S = a.size; pad = int(S * .04); scale = min((S - 2 * pad) / max(b[2] - b[0] for b in boxes), (S - 2 * pad) / max(b[3] - b[1] for b in boxes))
    cells = []
    for im, b in zip(ims, boxes):                       # skala SERAGAM (bukan per-frame) agar proporsi konsisten
        c = im.crop(b); c = c.resize((max(1, round(c.width * scale)), max(1, round(c.height * scale))), Image.LANCZOS)
        cell = Image.new("RGBA", (S, S), (0, 0, 0, 0)); cell.alpha_composite(c, ((S - c.width) // 2, S - pad - c.height)); cells.append(cell)
    rows = -(-len(cells) // a.cols); sheet = Image.new("RGBA", (a.cols * S, rows * S), (0, 0, 0, 0))
    atlas = {"frame_size": [S, S], "cols": a.cols, "rows": rows, "frames": []}
    for i, c in enumerate(cells):
        x, y = (i % a.cols) * S, (i // a.cols) * S; sheet.alpha_composite(c, (x, y)); atlas["frames"].append({"i": i, "x": x, "y": y, "src": os.path.basename(files[i])})
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    sheet.save(a.out + ".png", optimize=True); json.dump(atlas, open(a.out + ".json", "w"), indent=2)
    if a.gif:
        bgc = Image.new("RGBA", (S, S), (26, 18, 51, 255)); fr = [Image.alpha_composite(bgc, c).convert("P", palette=Image.ADAPTIVE) for c in cells]
        fr[0].save(a.out + ".gif", save_all=True, append_images=fr[1:], duration=int(1000 / a.gif), loop=0, disposal=2)
    print(f"{len(cells)} frame → {a.out}.png/.json" + (" + .gif" if a.gif else ""))

if __name__ == "__main__":
    main()
