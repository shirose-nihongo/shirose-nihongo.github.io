# -*- coding: utf-8 -*-
"""Bangun ulang modul Auto Maintenance dari buku JICA「みてまなぶ！自動車整備の日本語」(2023-12, bebas diunduh/dipakai).
Isi: kosakata+teks JP/ID per subbab, halaman buku JP (render PDF) & ID (disusun dari data), kuis.
Pakai: python3 -I tools/ssw/automaint_jica_build.py <seibi.pdf> [illust.pdf]   (dari akar repo)"""
import json, os, re, sys, glob, hashlib, shutil, textwrap
sys.path.insert(0, os.path.dirname(__file__))
from vocab_auto import romaji
import pymupdf
from PIL import Image, ImageDraw, ImageFont
from automaint_overlay import overlay

ROOT = "data/ssw/auto-maintenance/"; ASS = "assets/ssw/auto-maintenance/"
KANJI = re.compile(r"[㐀-鿿々]")
SRC = "JICA「みてまなぶ！自動車整備の日本語」(2023年12月30日第1版) https://www.jica.go.jp/activities/issues/transport/mechanic/health_safety_text/index.html"

BABS = [
 ("bab1", "Nama-nama dalam mobil", "{車|くるま}の{名前|なまえ}", "Nama bagian dalam, luar, ruang mesin, kaki-kaki, bagian bawah, jenis kendaraan, dan istilah lain.", "{車|くるま}の{中|なか}・{外|そと}・エンジンルーム・{足回|あしまわ}り・{下回|したまわ}りの{名前|なまえ}をおぼえます。"),
 ("bab2", "Perkakas dan alat pemeriksaan", "{自動車整備|じどうしゃせいび}に{使|つか}う{道具|どうぐ}", "Nama perkakas, alat ukur, alat uji, dan mesin bengkel beserta fungsinya.", "{工具|こうぐ}・{測|はか}る{道具|どうぐ}・{検査装置|けんさそうち}の{名前|なまえ}と{使|つか}いかたをおぼえます。"),
 ("bab3", "Kata kerja dalam perawatan mobil", "{自動車整備|じどうしゃせいび}で{使|つか}う{動詞|どうし}", "Kata kerja yang dipakai dalam instruksi kerja sehari-hari, beserta contoh kalimat.", "{整備|せいび}の{仕事|しごと}でよく{使|つか}う{動詞|どうし}と{例文|れいぶん}をおぼえます。"),
 ("bab4", "Komponen mobil", "{自動車|じどうしゃ}の{部品|ぶひん}", "Nama komponen mesin, bahan bakar, hisap-buang, pelumasan, pendingin, penerus tenaga, kemudi, rem, listrik, dan bodi.", "エンジン・{燃料|ねんりょう}・{冷却|れいきゃく}・{動力伝達|どうりょくでんたつ}・ブレーキ・{電気|でんき}・ボデーの{部品|ぶひん}をおぼえます。")]
SUBS = {
 "b1s1": ("Di dalam mobil", "{車|くるま}の{中|なか}"), "b1s2": ("Luar mobil: depan", "{車|くるま}の{外|そと}：フロント"),
 "b1s3": ("Luar mobil: samping", "{車|くるま}の{外|そと}：サイド"), "b1s4": ("Luar mobil: belakang", "{車|くるま}の{外|そと}：リア"),
 "b1s5": ("Di dalam ruang mesin", "エンジンルームの{中|なか}"), "b1s6": ("Kaki-kaki", "{足回|あしまわ}り"),
 "b1s7": ("Bagian bawah mobil", "{下回|したまわ}り"), "b1s8": ("Jenis kendaraan", "{車種|しゃしゅ}"),
 "b1s9": ("Istilah lain di bengkel", "そのほかのことば"),
 "b2s1": ("Perkakas dasar", "{工具|こうぐ}"), "b2s2": ("Alat ukur", "{測|はか}る{道具|どうぐ}"),
 "b2s3": ("Alat pemeriksaan mesin, ban, aki", "{点検|てんけん}に{使|つか}う{道具|どうぐ}"), "b2s4": ("Alat pelumasan dan pengangkat", "{給油|きゅうゆ}・{持|も}ち{上|あ}げる{道具|どうぐ}"),
 "b2s5": ("Alat uji kendaraan dan mesin bengkel", "{検査用|けんさよう}{機械|きかい}"),
 "b3s1": ("Kata kerja: keselamatan & kebersihan", "{安全衛生|あんぜんえいせい}・{清掃|せいそう}の{動詞|どうし}"),
 "b3s2": ("Kata kerja: ruang mesin", "エンジンルーム{点検|てんけん}の{動詞|どうし}"),
 "b3s3": ("Kata kerja: kaki-kaki", "{足|あし}まわり{点検|てんけん}の{動詞|どうし}"),
 "b3s4": ("Kata kerja: bagian bawah", "{下|した}まわり{点検|てんけん}の{動詞|どうし}"),
 "b3s5": ("Kata kerja lain", "そのほかの{動詞|どうし}"),
 "b4s1": ("Sekitar mesin", "エンジンまわり"), "b4s2": ("Sistem bahan bakar", "{燃料装置|ねんりょうそうち}"),
 "b4s3": ("Sistem hisap dan buang", "{吸気装置|きゅうきそうち}・{排気装置|はいきそうち}"), "b4s4": ("Pelumasan dan pendinginan", "{潤滑装置|じゅんかつそうち}・{冷却装置|れいきゃくそうち}"),
 "b4s5": ("Penerus tenaga dan suspensi", "{動力伝達装置|どうりょくでんたつそうち}"), "b4s6": ("Kemudi dan rem", "ステアリング{装置|そうち}・ブレーキ{装置|そうち}"),
 "b4s7": ("Kelistrikan, rangka, dan bodi", "{電気装置|でんきそうち}・フレーム・ボディ"), "b4s8": ("Aplikasi dan pembuangan limbah", "{応用編|おうようへん}・ゴミのすてかた")}

def rb(w, r):
    r = r.replace("・", "").replace(" ", "")
    return "{%s|%s}" % (w, r) if KANJI.search(w) and r else w

def parse():
    blocks = []; cur = None
    for f in sorted(glob.glob("tools/ssw/jica_data/ch*.txt")):
        for ln in open(f, encoding="utf-8").read().split("\n"):
            if not ln.strip() or ln.startswith("#"): continue
            if ln.startswith("@"):
                p, sub, title, start = ln[1:].split("|")
                cur = {"page": int(p), "sub": sub, "title": title, "start": int(start), "items": [], "notes": []}; blocks.append(cur)
            elif ln.startswith("~"): cur["notes"].append(ln[1:].strip())
            else:
                x = (ln.split("|") + ["", "", "", ""])[:6]
                it = {"kata": x[0], "kana": x[1], "arti": x[2], "alias": x[3], "cj": x[4], "ci": x[5], "desc": False}
                if it["cj"] and not it["ci"]: it["ci"] = it["cj"]; it["cj"] = it["alias"]; it["alias"] = ""; it["desc"] = True
                cur["items"].append(it)
    return blocks

def circ(n): return "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳"[n - 1] if 1 <= n <= 20 else (str(n) + ".")

def build_text(blocks):
    subs = {}
    for b in blocks:
        s = subs.setdefault(b["sub"], {"blocks": []}); s["blocks"].append(b)
    for sid, s in subs.items():
        idb, jpb = [], []
        for b in s["blocks"]:
            idb.append({"h": "Hal. %d — %s" % (b["page"], b["title"])}); jpb.append({"h": "ページ %d" % b["page"]})
            for t in b["notes"]: idb.append({"p": t})
            ul_id, ul_jp = [], []
            for i, it in enumerate(b["items"]):
                n = (circ(b["start"] + i) + " ") if b["start"] else ""
                kana = it["kana"]; rom = romaji(kana.replace("・", " ").replace("（", " ").replace("）", ""))
                a = " (%s)" % it["alias"] if it["alias"] else ""
                lid = "%s**%s** (%s · %s) — %s" % (n, it["kata"], kana.replace("・", ""), rom.strip(), it["arti"])
                if it["alias"]: lid += "; alias/keterangan: " + it["alias"]
                if it["desc"]: lid += ". Keterangan: " + it["ci"]
                elif it["ci"]: lid += ". Contoh: " + it["cj"] + " → " + it["ci"]
                elif it["cj"]: lid += ". " + it["cj"]
                ljp = "%s**%s**%s" % (n, rb(it["kata"], kana), (a if it["alias"] else ""))
                if it["cj"]: ljp += ("：" if not it["desc"] else "：") + it["cj"]
                ul_id.append(lid); ul_jp.append(ljp)
            if ul_id: idb.append({"ul": ul_id}); jpb.append({"ul": ul_jp})
        s["full"] = {"id": idb, "jp": jpb}
        its = [it for b in s["blocks"] for it in b["items"]]
        s["items"] = its
        s["pages"] = [min(b["page"] for b in s["blocks"]), max(b["page"] for b in s["blocks"])]
    return subs

def summary(sid, s):
    its = s["items"]; top = its[:5]
    pts = ["**%s** = %s" % (i["kata"], i["arti"]) for i in top] or ["Lihat catatan pada halaman buku."]
    jp = ["**%s**" % rb(i["kata"], i["kana"]) for i in top]
    core = "Subbab ini memuat %d istilah Jepang dari buku JICA (hal. %d–%d)." % (len(its), s["pages"][0], s["pages"][1]) if its else "Catatan budaya dan aturan kerja dari buku JICA."
    return {"id": {"core": core, "points": pts, "avoid": ["Nama bisa berbeda di tiap bengkel/daerah — tanyakan juga ke rekan kerja."], "exam": ["Menyebutkan nama Jepang dari bagian/alat/pekerjaan yang ditunjukkan."]},
            "jp": {"core": "このところのことばを%dこおぼえます。" % len(its), "points": jp or ["ページのメモをよみます。"], "avoid": ["{工場|こうじょう}によって{言|い}い{方|かた}がちがうことがあります。"], "exam": ["{名前|なまえ}を{日本語|にほんご}で{言|い}います。"]}}

def vocab(subs):
    items = []; seen = {}
    for sid in sorted(subs):
        for it in subs[sid]["items"]:
            k = it["kata"]
            if k in seen:
                if sid not in seen[k]["src"]: seen[k]["src"].append(sid)
                continue
            kana = it["kana"].replace("・", "").replace("（", "").replace("）", "")
            v = {"id": "am-%03d" % (len(items) + 1), "kata": k, "kana": kana,
                 "romaji": romaji(it["kana"].replace("・", " ").replace("（", " ").replace("）", "")).strip(), "arti": it["arti"],
                 "cat": SUBS[sid][0], "bab": "bab" + sid[1], "src": [sid], "sumber": "JICA"}
            if it["alias"]: v["alias"] = it["alias"]
            if it["ci"] and not it["desc"]: v["contoh"] = it["cj"]; v["arti_contoh"] = it["ci"]
            elif it["ci"]: v["catatan"] = it["ci"]
            seen[k] = v; items.append(v)
    return items

# ---------- kuis ----------
def H(*a): return int(hashlib.md5("|".join(map(str, a)).encode()).hexdigest(), 16)
def pick_opts(correct, pool, seed):
    ds = [p for p in dict.fromkeys(pool) if p != correct]
    ds.sort(key=lambda p: H(seed, p)); o = ds[:3] + [correct]
    o.sort(key=lambda p: H(seed, "o", p)); return o
def qs(vs, pool, seed, n):
    out = []; vs = sorted(vs, key=lambda v: H(seed, v["id"]))
    for i, v in enumerate(vs[:n]):
        t = (H(seed, i) % 4)
        sd = "%s-%s" % (seed, v["id"])
        exp = "%s (%s) = %s." % (v["kata"], v["kana"], v["arti"])
        if t == 0 or (t == 2 and not KANJI.search(v["kata"])):
            o = pick_opts(v["arti"], [p["arti"] for p in pool], sd)
            out.append({"q": {"id": "Apa arti 「%s」?" % v["kata"], "jp": "「%s」の{意味|いみ}は？" % rb(v["kata"], v["kana"])}, "opts": [{"id": x} for x in o], "a": o.index(v["arti"]), "exp": {"id": exp}})
        elif t == 1:
            o = pick_opts(v["kata"], [p["kata"] for p in pool], sd)
            out.append({"q": {"id": "Bahasa Jepang untuk 「%s」 adalah…" % v["arti"]}, "opts": [{"id": x} for x in o], "a": o.index(v["kata"]), "exp": {"id": exp}})
        elif t == 2:
            o = pick_opts(v["kana"], [p["kana"] for p in pool if KANJI.search(p["kata"])], sd)
            out.append({"q": {"id": "Cara baca 「%s」 yang benar adalah…" % v["kata"]}, "opts": [{"id": x} for x in o], "a": o.index(v["kana"]), "exp": {"id": exp}})
        else:
            true = (H(sd, "tf") % 2 == 0); arti = v["arti"]
            if not true:
                alt = [p["arti"] for p in pool if p["arti"] != arti]; arti = alt[H(sd, "x") % len(alt)]
            out.append({"q": {"id": "Benar atau salah: “%s artinya %s.”" % (v["kata"], arti)}, "opts": [{"id": "Benar (○)"}, {"id": "Salah (×)"}], "a": 0 if true else 1, "exp": {"id": exp}, "mb": True})
    return out

def quiz(subs, vlist, old_img):
    by = {sid: [v for v in vlist if sid in v["src"]] for sid in subs}
    q = {"bab": {}, "tema": json.load(open(ROOT + "quiz.json", encoding="utf-8")).get("tema")}
    for bid, *_ in BABS:
        groups = []; pool_b = [v for v in vlist if v["bab"] == bid]
        for k in range(1, 4):
            groups.append({"id": "%s-q%d" % (bid, k), "title": {"id": "Latihan bab %s (%d)" % (bid[3:], k), "jp": "{練習|れんしゅう}%d" % k}, "items": qs(pool_b, vlist, "%s-%d" % (bid, k), 6)})
        for sid in sorted(subs):
            if sid[:3] != "b" + bid[3] + "s": continue
            vs = by[sid] or pool_b[:6]
            groups.append({"id": sid + "-q", "sub": sid, "title": {"id": "Latihan: " + SUBS[sid][0], "jp": "{練習|れんしゅう}：" + SUBS[sid][1]}, "items": qs(vs, pool_b if len(pool_b) > 8 else vlist, sid, 6)})
        if bid == "bab4" and old_img: groups.append(old_img)
        q["bab"][bid] = groups
    return q

# ---------- halaman ----------
FONT = "/usr/share/fonts/opentype/noto/NotoSansCJK-%s.ttc"
def wrap(d, text, font, w):
    lines = []; cur = ""
    for ch in text:
        if d.textlength(cur + ch, font=font) > w and cur: lines.append(cur); cur = ch
        else: cur += ch
    return lines + [cur] if cur else lines
def draw_page(path, page, blocks, title=None):
    W = 1100; fb = ImageFont.truetype(FONT % "Bold", 30); fr = ImageFont.truetype(FONT % "Regular", 22); fs = ImageFont.truetype(FONT % "Regular", 19)
    tmp = ImageDraw.Draw(Image.new("RGB", (10, 10))); rows = []; y = 90
    for b in blocks:
        rows.append(("t", b["title"], y)); y += 44
        for t in b["notes"]:
            ls = wrap(tmp, t, fs, W - 100); rows.append(("n", ls, y)); y += 26 * len(ls) + 10
        for i, it in enumerate(b["items"]):
            ex = []
            if it["alias"]: ex.append("= " + it["alias"])
            if it["ci"]: ex.append(it["cj"] + " → " + it["ci"])
            elif it["cj"]: ex.append(it["cj"])
            ls = sum([wrap(tmp, e, fs, W - 120) for e in ex], [])
            rows.append(("i", (b["start"] and circ(b["start"] + i), it, ls), y)); y += 62 + 24 * len(ls)
    H_ = max(780, y + 60); im = Image.new("RGB", (W, H_), "white"); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, 64], fill="#0b5d8a"); d.text((24, 12), "Hal. %s  ·  Versi Indonesia (disusun Shirose Nihongo dari buku JICA)" % page, font=fr, fill="white")
    for kind, v, yy in rows:
        if kind == "t": d.text((30, yy), v, font=fb, fill="#0b5d8a"); d.line([30, yy + 38, W - 30, yy + 38], fill="#bbb")
        elif kind == "n":
            for j, l in enumerate(v): d.text((40, yy + j * 26), l, font=fs, fill="#444")
        else:
            n, it, ls = v; x = 40
            if n: d.text((x, yy), n, font=fb, fill="#888"); x += 46
            d.text((x, yy), it["kata"], font=fb, fill="#111"); wk = d.textlength(it["kata"], font=fb)
            d.text((x + wk + 16, yy + 8), "(%s)" % it["kana"].replace("・", ""), font=fs, fill="#666")
            d.text((x, yy + 36), it["arti"], font=fr, fill="#b00020")
            for j, l in enumerate(ls): d.text((x + 10, yy + 62 + j * 24), l, font=fs, fill="#555")
    im.save(path, "WEBP", quality=82)

def draw_table(path, page, blocks, babt):
    W = 1240; fb = ImageFont.truetype(FONT % "Bold", 26); fr = ImageFont.truetype(FONT % "Regular", 22); fs = ImageFont.truetype(FONT % "Regular", 19)
    tmp = ImageDraw.Draw(Image.new("RGB", (10, 10))); cx = [50, 470, 860, 1190]; rows = []; y = 150
    for b in blocks:
        rows.append(("t", b["title"], y)); y += 52; rows.append(("h", None, y)); y += 46
        for i, it in enumerate(b["items"]):
            c0 = wrap(tmp, "%s%s" % ((circ(b["start"] + i) + " ") if b["start"] else "", it["arti"]), fb, cx[1] - cx[0] - 20) + wrap(tmp, it["kata"] + ("" if it["kata"] == it["kana"] else " (" + it["kana"].replace("・", "") + ")"), fs, cx[1] - cx[0] - 20)
            c1 = wrap(tmp, it["cj"], fs, cx[2] - cx[1] - 20) + wrap(tmp, "→ " + it["ci"], fs, cx[2] - cx[1] - 20)
            c2 = wrap(tmp, it["alias"], fs, cx[3] - cx[2] - 20)
            hh = max(len(c0) * 26 + 12, len(c1) * 26, len(c2) * 26) + 24
            rows.append(("r", (c0, c1, c2), y, hh)); y += hh
        y += 24
    H_ = max(1754, y + 80); im = Image.new("RGB", (W, H_), "white"); d = ImageDraw.Draw(im)
    d.text((50, 40), babt, font=ImageFont.truetype(FONT % "Bold", 34), fill="#0b5d8a")
    d.text((50, 92), "Hal. %d · Versi Indonesia (disusun Shirose Nihongo dari buku JICA)" % page, font=fs, fill="#777")
    for r in rows:
        if r[0] == "t": d.text((50, r[2]), r[1], font=ImageFont.truetype(FONT % "Bold", 28), fill="#111")
        elif r[0] == "h":
            d.rectangle([cx[0], r[2], cx[3], r[2] + 40], fill="#e8eef3", outline="#555")
            for k, t in enumerate(("Kata kerja (動詞)", "Contoh kalimat (例文)", "Cara bilang lain (言い方)")): d.text((cx[k] + 12, r[2] + 6), t, font=fr, fill="#222")
        else:
            c0, c1, c2 = r[1]; hh = r[3]
            for k in range(3): d.rectangle([cx[k], r[2], cx[k + 1], r[2] + hh], outline="#555")
            for k, cl in enumerate((c0, c1, c2)):
                for j, t in enumerate(cl):
                    f = fb if (k == 0 and j == 0) else fs
                    d.text((cx[k] + 10, r[2] + 10 + (j * 26 + (10 if (k == 0 and j > 0) else 0))), t, font=f, fill="#b00020" if (k == 0 and j == 0) else "#222")
    im.save(path, "WEBP", quality=82)

def SUBSID(sid): return SUBS[sid][0]

def main():
    pdf = sys.argv[1]
    blocks = parse(); subs = build_text(blocks); vl = vocab(subs)
    old = None
    try:
        for g in json.load(open(ROOT + "quiz.json", encoding="utf-8"))["bab"].get("bab2", []):
            if g["id"] == "bab2-qimg": old = dict(g, id="bab4-qimg", title={"id": "Soal bergambar: langkah hisap mesin"})
    except Exception: pass
    # data
    for f in glob.glob(ROOT + "bab*.json"): os.remove(f)
    for bi, (bid, ti, tj, ii, ij) in enumerate(BABS, 1):
        sl = []
        for k, sid in enumerate(sorted(x for x in subs if x[:2] == "b%d" % bi), 1):
            s = subs[sid]
            sl.append({"id": sid, "no": k, "title": {"id": SUBS[sid][0], "jp": SUBS[sid][1]}, "pages": s["pages"], "full": s["full"], "summary": summary(sid, s)})
        pg = [min(x["pages"][0] for x in sl), max(x["pages"][1] for x in sl)]
        json.dump({"schema": 1, "bidang": "auto-maintenance", "source": SRC, "markup": "Teks JP memakai {kanji|furigana}; **tebal**.",
                   "bab": {"id": bid, "no": bi, "title": {"id": ti, "jp": tj}, "intro": {"id": ii, "jp": ij}, "pages": pg, "subs": sl}},
                  open(ROOT + bid + ".json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump({"items": vl}, open(ROOT + "vocab.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(quiz(subs, vl, old), open(ROOT + "quiz.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    ix = json.load(open(ROOT + "index.json", encoding="utf-8")); ix.pop("nobook", None)
    ix["pages"] = {"id": 67, "jp": 67}; ix["bab"] = [{"id": b[0], "file": b[0] + ".json"} for b in BABS]
    ix["source"] = SRC
    json.dump(ix, open(ROOT + "index.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    # halaman
    for sub in ("jp", "id"): os.makedirs(ASS + sub, exist_ok=True); [os.remove(f) for f in glob.glob(ASS + sub + "/*.webp")]
    for f in glob.glob(ASS + "*.svg"): os.remove(f)
    d = pymupdf.open(pdf)
    for n in range(0, 67):
        pno = 0 if n == 0 else n + 4    # berkas p(n+1): n=0 sampul, n>=1 halaman cetak n = PDF hal. n+5
        pix = d[pno].get_pixmap(dpi=100); pix.save("/tmp/_p.png"); Image.open("/tmp/_p.png").convert("RGB").save(ASS + "jp/p%02d.webp" % (n + 1), "WEBP", quality=80)
        bl = [b for b in blocks if b["page"] == n]
        pth = ASS + "id/p%02d.webp" % (n + 1)
        if n == 0:
            draw_page(pth, n, [{"title": "Sampul / 表紙: 自動車整備の日本語 みてまなぶ！(JICA, 2023)", "start": 0, "items": [], "notes": ["Versi Indonesia disusun Shirose Nihongo dari buku JICA. Halaman Jepang = buku asli."]}]); continue
        babt = "Bab %s — %s" % (bl[0]["sub"][1], BABS[int(bl[0]["sub"][1]) - 1][1]) if bl else ""
        if bl and 39 <= n <= 42: draw_table(pth, n, bl, babt); continue
        m = {}
        for b in bl:
            if b["start"]:
                for i, it in enumerate(b["items"]): m[b["start"] + i] = it
        head = ()
        if bl: head = [babt, SUBSID(bl[0]["sub"])] + ([bl[0]["notes"][0]] if bl[0]["notes"] else [])
        if m and overlay(d, pno, m, pth, head): continue
        if not bl: bl = [{"title": "(Halaman ini berisi gambar/penjelasan tanpa daftar istilah baru)", "start": 0, "items": [], "notes": []}]
        draw_page(pth, n, bl)
    print("vocab", len(vl), "subs", len(subs), "soal", sum(len(g["items"]) for b in json.load(open(ROOT + "quiz.json"))["bab"].values() for g in b))
main()
