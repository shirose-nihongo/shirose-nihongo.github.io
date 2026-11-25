#!/usr/bin/env python3
"""Bank dokkai Silabus Harian JLPT (N5-N1) — tanpa soal berulang.

Sumber:
  1. jlpt/<lv>/dokkai-*.v2.json (bank latihan dokkai), MINUS bacaan yang muncul di
     paket Full Exam cadangan simulasi (CADANGAN), supaya simulasi di akhir silabus
     berisi bacaan yang belum pernah dilihat siswa.
  2. tools/dokkai_baru/<lv>.txt — bacaan baru yang ditulis khusus untuk silabus.

Setiap soal diberi id unik (hash teks + pertanyaan + pilihan); soal kembar dibuang.
Urutan: pendek → panjang (bertahap dari 短文 ke 中文/情報検索).

    python tools/silabus_dokkai.py          # tulis data/silabus/<lv>-dokkai.json
    python tools/silabus_dokkai.py --cek    # ringkasan stok vs kebutuhan

Format tools/dokkai_baru/<lv>.txt:
    === 短文（メモ）            ← awal bacaan + jenis
    (teks Jepang, boleh beberapa baris)
    --- (terjemahan Indonesia, boleh beberapa baris)
    ?? pertanyaan
    * pilihan benar
    - pilihan salah   (total 4 pilihan, urutan bebas; aplikasi tidak mengacak)
    >> alasan / pembahasan (Indonesia)
    ?? pertanyaan berikutnya untuk bacaan yang sama ...
"""
import glob
import hashlib
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "silabus")
BARU = os.path.join(ROOT, "tools", "dokkai_baru")

# Paket Full Exam yang disisihkan untuk hari simulasi (dipakai juga oleh js/silabus-harian.js).
CADANGAN = {
    "n5": [f"n5-full-{i:02d}" for i in range(17, 21)],
    "n4": [f"n4-full-{i:02d}" for i in range(14, 21)],
    "n3": [f"n3-full-{i:02d}" for i in range(14, 21)],
    "n2": [f"n2-full-{i:02d}" for i in range(14, 21)],
    "n1": [f"n1-full-{i:02d}" for i in range(16, 23)],
}


def kunci(jp, q, opts):
    return hashlib.sha1(json.dumps([jp, q, opts], ensure_ascii=False).encode()).hexdigest()[:12]


def bacaan_cadangan(lv):
    teks = set()
    for pid in CADANGAN[lv]:
        no = pid.rsplit("-", 1)[1]
        for f in (os.path.join(ROOT, "jlpt", lv, f"full-{no}.v2.json"), os.path.join(ROOT, "jlpt", lv, f"full-{no}.json")):
            if not os.path.exists(f):
                continue
            d = json.load(open(f, encoding="utf-8"))
            for p in (d.get("passages") or {}).values():
                if isinstance(p, dict) and p.get("jp"):
                    teks.add(p["jp"])
            break
    return teks


def dari_bank(lv, buang):
    units, idx = [], {}
    for f in sorted(glob.glob(os.path.join(ROOT, "jlpt", lv, "dokkai-*.v2.json"))):
        d = json.load(open(f, encoding="utf-8"))
        ps = d.get("passages") or {}
        for sec in d.get("sections", []):
            for it in sec.get("items", []):
                p = ps.get(it.get("pid")) or {}
                jp = p.get("jp", "")
                if not jp or jp in buang:
                    continue
                if jp not in idx:
                    idx[jp] = len(units)
                    units.append({"jenis": p.get("jenis", ""), "jp": jp, "terj": p.get("id", ""), "qs": [], "src": "bank"})
                ex = dict(it.get("ex") or {})
                if p.get("id") and not ex.get("terjemahan"):
                    ex["terjemahan"] = p["id"]
                units[idx[jp]]["qs"].append({"q": it["q"], "opts": it["opts"], "ans": it["ans"], "ex": ex})
    return units


def parse_baru(path):
    """Baca file dokkai_baru; kembalikan unit + daftar kesalahan format."""
    units, err = [], []
    if not os.path.exists(path):
        return units, err
    cur, q, mode = None, None, None
    lines = open(path, encoding="utf-8").read().splitlines()

    def tutup_q():
        nonlocal q
        if q is not None:
            if len(q["opts"]) != 4 or q["ans"] is None:
                err.append(f"{os.path.basename(path)}:{q['_ln']}: soal harus 4 pilihan dengan tepat satu '*' ({len(q['opts'])} pilihan)")
            else:
                q.pop("_ln")
                cur["qs"].append(q)
        q = None

    def tutup_u():
        nonlocal cur
        tutup_q()
        if cur is not None:
            cur["jp"] = "\n".join(cur["jp"]).strip()
            cur["terj"] = "\n".join(cur["terj"]).strip()
            if not cur["jp"] or not cur["qs"]:
                err.append(f"{os.path.basename(path)}:{cur['_ln']}: bacaan tanpa teks atau tanpa soal")
            else:
                cur.pop("_ln")
                for x in cur["qs"]:
                    x["ex"]["terjemahan"] = cur["terj"]
                units.append(cur)
        cur = None

    for ln, raw in enumerate(lines, 1):
        s = raw.rstrip()
        if s.startswith("#") or (not s and mode not in ("jp", "terj")):
            continue
        if s.startswith("==="):
            tutup_u()
            cur = {"jenis": s[3:].strip() or "短文", "jp": [], "terj": [], "qs": [], "src": "baru", "_ln": ln}
            mode = "jp"
        elif cur is None:
            err.append(f"{os.path.basename(path)}:{ln}: teks di luar bacaan")
        elif s.startswith("---"):
            mode = "terj"
            if s[3:].strip():
                cur["terj"].append(s[3:].strip())
        elif s.startswith("??"):
            tutup_q()
            q = {"q": s[2:].strip(), "opts": [], "ans": None, "ex": {}, "_ln": ln}
            mode = "q"
        elif s.startswith("*") and q is not None:
            if q["ans"] is not None:
                err.append(f"{os.path.basename(path)}:{ln}: lebih dari satu jawaban benar")
            q["ans"] = len(q["opts"])
            q["opts"].append(s[1:].strip())
        elif s.startswith("-") and q is not None:
            q["opts"].append(s[1:].strip())
        elif s.startswith(">>") and q is not None:
            q["ex"]["alasan"] = s[2:].strip()
            q["ex"]["jawaban"] = q["opts"][q["ans"]] if q["ans"] is not None else ""
        elif mode == "jp":
            cur["jp"].append(s)
        elif mode == "terj":
            cur["terj"].append(s)
        else:
            err.append(f"{os.path.basename(path)}:{ln}: baris tidak dikenali: {s[:40]}")
    tutup_u()
    return units, err


# N1: paket Full Exam N1 sendiri memakai ulang bacaan bank dokkai (tiap paket ±68 dari 175 bacaan),
# jadi bacaan cadangan tidak bisa dibuang tanpa menghabiskan stok. Untuk N1 bacaan tidak dibuang.
BUANG_CADANGAN = {"n5": True, "n4": True, "n3": True, "n2": True, "n1": False}


def bangun(lv):
    units = dari_bank(lv, bacaan_cadangan(lv) if BUANG_CADANGAN[lv] else set())
    baru, err = parse_baru(os.path.join(BARU, f"{lv}.txt"))
    units += baru
    seen, out = set(), []
    for u in units:
        qs = []
        for q in u["qs"]:
            k = kunci(u["jp"], q["q"], q["opts"])
            if k in seen:
                continue
            seen.add(k)
            qs.append({**q, "id": f"{lv}-dk-{k}"})
        if qs:
            out.append({**u, "qs": qs})
    out.sort(key=lambda u: len(re.sub(r"\s", "", u["jp"])))
    return out, err


def main():
    cek = "--cek" in sys.argv
    semua_err = []
    for lv in ("n5", "n4", "n3", "n2", "n1"):
        units, err = bangun(lv)
        semua_err += err
        nq = sum(len(u["qs"]) for u in units)
        nb = sum(len(u["qs"]) for u in units if u["src"] == "baru")
        print(f"{lv}: {len(units)} bacaan, {nq} soal unik (baru {nb}), cadangan simulasi {', '.join(CADANGAN[lv])}")
        if not cek:
            for u in units:
                u.pop("src", None)
            with open(os.path.join(OUT, f"{lv}-dokkai.json"), "w", encoding="utf-8") as f:
                json.dump(units, f, ensure_ascii=False, separators=(",", ":"))
    for e in semua_err:
        print("  ✗", e)
    if semua_err:
        sys.exit(1)


if __name__ == "__main__":
    main()
