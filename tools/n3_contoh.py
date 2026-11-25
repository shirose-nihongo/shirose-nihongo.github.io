#!/usr/bin/env python3
"""Terapkan contoh kalimat + perbaikan data kosakata N3 dari tools/n3_contoh/*.txt.

Data asli kosakata N3 (hasil ekstrak PDF) tidak punya kalimat contoh dan banyak
salah kana / arti yang bergeser. File di tools/n3_contoh/ berisi:
    no|contoh|arti_contoh                   contoh kalimat
    !no|kata|kana|arti                      perbaikan (kolom kosong = tetap)
    +no|kata|kana|arti|contoh|arti_contoh   entri yang hilang
Furigana ditambahkan otomatis (fugashi + unidic-lite); furigana manual 漢字[よみ]
di file dipertahankan.

    pip install fugashi unidic-lite
    python tools/n3_contoh.py            # tulis data/kosakata-n3.json
    python tools/n3_contoh.py --cek      # laporan tanpa menulis
"""
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "kosakata-n3.json")
KANJI = re.compile(r"[一-鿿々〆ヶ]")

_tagger = None


def tagger():
    global _tagger
    if _tagger is None:
        import fugashi
        _tagger = fugashi.Tagger()
    return _tagger


def hira(s):
    return "".join(chr(ord(c) - 0x60) if "ァ" <= c <= "ヶ" else c for c in s)


def furi_kata(surface, yomi):
    """Sejajarkan bacaan dengan surface: 散らかし + ちらかし → 散[ち]らかし."""
    if not KANJI.search(surface) or not yomi:
        return surface
    y = hira(yomi)
    parts = re.findall(r"[一-鿿々〆ヶ]+|[^一-鿿々〆ヶ]+", surface)
    pola = "".join("(.+?)" if KANJI.match(p) else re.escape(hira(p)) for p in parts)
    m = re.fullmatch(pola, y)
    if not m:
        return f"{surface}[{y}]"
    out, g = [], 1
    for p in parts:
        if KANJI.match(p):
            out.append(f"{p}[{m.group(g)}]")
            g += 1
        else:
            out.append(p)
    return "".join(out)


# Salah baca unidic yang sering muncul di kalimat sehari-hari.
KOREKSI = {"米[べい]": "米[こめ]", "日本[にっぽん]": "日本[にほん]", "私[わたくし]": "私[わたし]", "物[ぶつ]": "物[もの]",
           "抱[いだ]": "抱[だ]", "蒸[ふか]": "蒸[む]", "方[ほう]々": "方[かた]々", "言[ゆ]": "言[い]", "悪[あく]": "悪[わる]"}


def furigana(teks):
    hasil = _furigana(teks)
    for a, b in KOREKSI.items():
        hasil = hasil.replace(a, b)
    return hasil


def _furigana(teks):
    """Tambah furigana ke bagian tanpa furigana manual."""
    out = []
    for manual, polos in re.findall(r"([一-鿿々〆ヶ]+\[[^\]]+\])|([^\[\]]+?(?=[一-鿿々〆ヶ]+\[|$))", teks):
        if manual:
            out.append(manual)
            continue
        for w in tagger()(polos):
            yomi = w.feature.kana if hasattr(w.feature, "kana") else None
            out.append(furi_kata(w.surface, yomi or ""))
            if w.white_space:
                pass
    return "".join(out)


def baca_file():
    contoh, fix, tambah, err = {}, {}, {}, []
    for f in sorted(glob.glob(os.path.join(ROOT, "tools", "n3_contoh", "*.txt"))):
        for ln, s in enumerate(open(f, encoding="utf-8").read().splitlines(), 1):
            s = s.strip()
            if not s or s.startswith("#"):
                continue
            cols = s.split("|")
            tag = f"{os.path.basename(f)}:{ln}"
            try:
                if s.startswith("!"):
                    assert len(cols) == 4
                    fix[int(cols[0][1:])] = cols[1:]
                elif s.startswith("+"):
                    assert len(cols) == 6
                    tambah[int(cols[0][1:])] = cols[1:]
                else:
                    assert len(cols) == 3 and cols[1] and cols[2]
                    contoh[int(cols[0])] = cols[1:]
            except (AssertionError, ValueError):
                err.append(f"{tag}: format salah: {s[:50]}")
    return contoh, fix, tambah, err


def stem(kata):
    k = re.split(r"[／・]", kata)[0]
    k = re.sub(r"[（(].*?[）)]", "", k)
    return k


def main():
    cek = "--cek" in sys.argv
    data = json.load(open(DATA, encoding="utf-8"))
    contoh, fix, tambah, err = baca_file()
    nos = {x.get("no") for x in data}
    for no, (kata, kana, arti, ct, ac) in tambah.items():
        if no in nos:
            err.append(f"+{no}: nomor sudah ada")
            continue
        data.append({"no": no, "kata": kata, "kana": kana, "arti": arti, "pos": ["KK"] if kata.endswith(("る", "う", "く", "す", "つ", "む", "ぶ", "ぐ", "ぬ")) else ["KB"]})
        contoh[no] = [ct, ac]
    data.sort(key=lambda x: x.get("no", 0))
    curiga, n = [], 0
    for x in data:
        no = x.get("no")
        if no in fix:
            for k, v in zip(("kata", "kana", "arti"), fix[no]):
                if v:
                    x[k] = v
        if no in contoh:
            ct, ac = contoh[no]
            x["contoh"] = furigana(ct)
            x["arti_contoh"] = ac
            n += 1
            # kalimat harus memuat kata (minimal 2 karakter awal bentuk dasarnya)
            st = stem(x["kata"])
            akar = re.sub(r"[るうくすつむぶぐぬいだ]$", "", st)[:2] or st[:1]
            if akar and akar not in re.sub(r"\[[^\]]*\]", "", ct):
                curiga.append(f"{no} {x['kata']}: {ct}")
    belum = [x["no"] for x in data if not x.get("contoh")]
    print(f"contoh: {n} / {len(data)} · belum: {len(belum)} · perbaikan: {len(fix)} · sisipan: {len(tambah)}")
    for c in curiga:
        print("  ? kata tidak terlihat di kalimat:", c)
    for e in err:
        print("  ✗", e)
    if err:
        sys.exit(1)
    if not cek:
        with open(DATA, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
