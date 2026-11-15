# -*- coding: utf-8 -*-
"""Halaman Indonesia ala buku asli: ambil halaman PDF JICA, hapus teks Jepang pada sel bernomor (①②…), tulis terjemahan Indonesia di tempat yang sama.
Mengembalikan True bila halaman cocok sempurna (semua nomor ditemukan & cocok dengan data), selain itu False (pakai tata letak cadangan)."""
import pymupdf
from PIL import Image, ImageDraw, ImageFont
FONT = "/usr/share/fonts/opentype/noto/NotoSansCJK-%s.ttc"
def cnum(ch):
    o = ord(ch)
    if 0x2460 <= o <= 0x2473: return o - 0x245F
    if 0x3251 <= o <= 0x325F: return o - 0x3251 + 21
    if 0x32B1 <= o <= 0x32BF: return o - 0x32B1 + 36
    return 0
def lines(pg):
    out = []
    for b in pg.get_text("dict")["blocks"]:
        for l in b.get("lines", []):
            sp = [s for s in l["spans"] if s["text"].strip()]
            if not sp: continue
            txt = "".join(s["text"] for s in sp); sz = max(s["size"] for s in sp)
            out.append({"t": txt.strip(), "bb": l["bbox"], "sz": sz})
    return out
def wrap(d, text, font, w):
    toks = []; cur = ""
    for ch in text:
        if ord(ch) > 0x2E80 or ch == " ":
            if cur: toks.append(cur); cur = ""
            toks.append(ch)
        else: cur += ch
    if cur: toks.append(cur)
    ls = []; line = ""
    for t in toks:
        if d.textlength(line + t, font=font) > w and line.strip(): ls.append(line.rstrip()); line = t.lstrip()
        else: line += t
    return ls + [line.rstrip()] if line.strip() else ls
def overlay(d, pno, items_by_no, path, head=(), dpi=130):
    pg = d[pno]; ls = lines(pg); S = dpi / 72
    nl = [l for l in ls if l["sz"] >= 8.5 and l["t"] and cnum(l["t"][0]) and l["bb"][1] > 60]
    nums = [cnum(l["t"][0]) for l in nl]
    if not nl or len(set(nums)) != len(nums) or set(nums) != set(items_by_no): return False
    ims = [i["bbox"] for i in pg.get_image_info() if (i["bbox"][2] - i["bbox"][0]) > 40 and (i["bbox"][3] - i["bbox"][1]) > 30]
    xs = sorted({round(l["bb"][0]) for l in nl}); gaps = [b - a for a, b in zip(xs, xs[1:]) if b - a > 60]
    colw = min(gaps) if gaps else 160
    pg.get_pixmap(dpi=dpi).save("/tmp/_o.png"); im = Image.open("/tmp/_o.png").convert("RGB"); dr = ImageDraw.Draw(im)
    first = min(l["bb"][1] for l in nl) - 14
    if head:
        for l in ls:
            if l["bb"][3] < first and l["bb"][1] > 30 and not any(k in l["t"] for k in ("http", "watch", "youtube", "ページ", "v=")):
                dr.rectangle([l["bb"][0] * S - 2, l["bb"][1] * S - 2, l["bb"][2] * S + 2, l["bb"][3] * S + 2], fill="white")
        y = 46 * S / 1.0 * 0.95; hf = ImageFont.truetype(FONT % "Bold", 30); rf = ImageFont.truetype(FONT % "Regular", 21)
        for k, t in enumerate(head):
            f = hf if k < 2 else rf
            for t2 in wrap(dr, t, f, 330 * S if k >= 2 else 560 * S): dr.text((40 * S / 1.0 * 0.95, y), t2, font=f, fill="#0b5d8a" if k < 2 else "#333"); y += 36 if k < 2 else 28
    for l in nl:
        x0, y0, x1, y1 = l["bb"]; n = cnum(l["t"][0])
        right = x0 + colw - 8
        for o in nl:
            if o is not l and abs(o["bb"][1] - y0) < 15 and o["bb"][0] > x0 + 20: right = min(right, o["bb"][0] - 6)
        right = min(right, 560)
        for r in ims:
            if r[1] < y1 + 40 and r[3] > y0 and r[0] > x0 + 40 and r[0] < right: right = r[0] - 5
        bot = y1 + 48
        side = [r[3] for r in ims if r[1] <= y1 + 30 and r[3] >= y1 and r[0] > x0 + 40]
        if side: bot = max(bot, max(side))
        for r in ims:
            if r[3] > y1 and r[1] >= y1 - 4 and r[0] < right and r[2] > x0: bot = min(bot, r[1] - 2)
        for o in nl:
            if o is not l and o["bb"][1] > y1 + 2 and o["bb"][0] < right - 20 and abs(o["bb"][0] - x0) < colw * 0.6: bot = min(bot, o["bb"][1] - 12)
        # tambah baris lanjutan (di bawah ini sampai batas) ikut terhapus
        top = y0 - 13
        for o in nl:
            if o is not l and o["bb"][1] > y1 + 2 and abs(o["bb"][0] - x0) < 12: bot = min(bot, o["bb"][1] - 12)
        R = [x0 * S - 3, top * S, right * S, bot * S]
        dr.rectangle(R, fill="white")
        it = items_by_no[n]; w = R[2] - R[0] - 6; h = R[3] - R[1]
        for fs in (24, 21, 19, 17, 15, 13):
            fb = ImageFont.truetype(FONT % "Bold", fs); fr = ImageFont.truetype(FONT % "Regular", max(12, fs - 6))
            L1 = wrap(dr, "%s %s" % (l["t"][0], it["arti"]), fb, w)
            sub = it["kata"] + (" (%s)" % it["alias"] if it["alias"] else "") + ((" — " + it["ci"]) if it.get("desc") else "")
            L2 = wrap(dr, sub, fr, w)
            need = len(L1) * (fs + 4) + len(L2) * (fs - 2)
            if need <= h or fs == 13: break
        y = R[1] + 2
        for t in L1: dr.text((R[0] + 2, y), t, font=fb, fill="#b00020"); y += fs + 4
        for t in L2: dr.text((R[0] + 2, y), t, font=fr, fill="#555"); y += fs - 2
    im.save(path, "WEBP", quality=82)
    return True
