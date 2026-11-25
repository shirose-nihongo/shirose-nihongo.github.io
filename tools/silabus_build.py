#!/usr/bin/env python3
"""Bangun silabus harian Shirose (JLPT N5-N1 + JFT).

Patokan = beban harian standar per level (bukan durasi). Durasi dihitung dari
beban itu. Pola minggu: 6 hari belajar + hari ke-7 fukushu. Tiap minggu ke-4,
hari ke-7 jadi ujian bulanan (kumulatif). Setelah materi habis: fase simulasi.

Pemakaian:
    python tools/silabus_build.py            # tulis data/silabus/<lv>.json (standar)
    python tools/silabus_build.py --cek      # ringkasan + cek cakupan, tanpa menulis
    python tools/silabus_build.py --kos 20 --kanji 8 --bunpo 4 --lv n3 --cek   # tempo custom
"""
import argparse
import json
import math
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")
OUT = os.path.join(DATA, "silabus")

# Beban harian standar (kosakata, kanji, bunpo). Batas maksimal sama untuk semua level.
STANDAR = {
    "n5": (10, 5, 3),
    "n4": (10, 5, 3),
    "n3": (20, 7, 5),
    "n2": (25, 10, 5),
    "n1": (25, 12, 5),
    "jft": (15, 10, 3),
}
MAKS = (30, 20, 10)
# Tempo paling santai = setengah standar (dibulatkan ke atas).
MIN = {lv: tuple(math.ceil(x / 2) for x in s) for lv, s in STANDAR.items()}

# Lama fase simulasi akhir (hari) setelah semua materi selesai.
SIMULASI = {"n5": 7, "n4": 7, "n3": 14, "n2": 14, "n1": 14, "jft": 14}

# Format soal mengikuti mondai ujian asli tiap level.
FORMAT = {
    "kosakata": {
        "awal": ["arti", "baca"],
        "n5": ["文脈規定", "言い換え類義"],
        "n4": ["文脈規定", "言い換え類義", "用法"],
        "n3": ["文脈規定", "言い換え類義", "用法"],
        "n2": ["語形成", "文脈規定", "言い換え類義", "用法"],
        "n1": ["文脈規定", "言い換え類義", "用法"],
        "jft": ["語彙（意味）", "語彙（文脈）"],
    },
    "kanji": {
        "awal": ["arti", "baca"],
        "n5": ["漢字読み", "表記"],
        "n4": ["漢字読み", "表記"],
        "n3": ["漢字読み", "表記"],
        "n2": ["漢字読み", "表記"],
        "n1": ["漢字読み"],
        "jft": ["漢字の読み", "漢字の意味"],
    },
    "bunpo": {
        "awal": ["arti pola", "pilih bentuk"],
        "n5": ["文法形式の判断", "文の組み立て", "文章の文法"],
        "n4": ["文法形式の判断", "文の組み立て", "文章の文法"],
        "n3": ["文法形式の判断", "文の組み立て", "文章の文法"],
        "n2": ["文法形式の判断", "文の組み立て", "文章の文法"],
        "n1": ["文法形式の判断", "文の組み立て", "文章の文法"],
        "jft": ["文法", "会話と表現"],
    },
}

KANJI_RE = re.compile(r"[一-鿿々]")
LEVELS_JLPT = ["n5", "n4", "n3", "n2", "n1"]


def load(name):
    with open(os.path.join(DATA, name), encoding="utf-8") as f:
        return json.load(f)


def materi(lv):
    """Kembalikan daftar (kosakata, kanji, bunpo) berurutan, tiap item punya id."""
    if lv == "jft":
        kos, kan, bun = [], [], []
        for b in ("ir0", "ir1", "ir2"):
            for i, x in enumerate(load(f"kosakata-{b}.json")):
                kos.append({"id": f"kosakata-{b}#{i}", "w": x["kata"], "bab": f"{b}-{x.get('bab', 0)}"})
            for i, x in enumerate(load(f"kanji-{b}.json")):
                kan.append({"id": f"kanji-{b}#{i}", "w": x["k"], "bab": f"{b}-{x.get('bab', 0)}"})
            for i, x in enumerate(load(f"bunpou-{b}.json")):
                bun.append({"id": f"bunpou-{b}#{i}", "w": x["pola"], "bab": f"{b}-{x.get('bab', 0)}"})
        return kos, kan, bun

    # Kanji: buang yang sudah diajarkan di level lebih rendah (mis. 25 kanji dobel N3/N4).
    lebih_rendah = set()
    for l in LEVELS_JLPT[: LEVELS_JLPT.index(lv)]:
        lebih_rendah |= {x["k"] for x in load(f"kanji-{l}.json")}
    kan, seen = [], set()
    for i, x in enumerate(load(f"kanji-{lv}.json")):
        if x["k"] in lebih_rendah or x["k"] in seen:
            continue
        seen.add(x["k"])
        kan.append({"id": f"kanji-{lv}#{i}", "w": x["k"]})
    kos = [{"id": f"kosakata-{lv}#{i}", "w": x["kata"]} for i, x in enumerate(load(f"kosakata-{lv}.json"))]
    bun = [{"id": f"bunpou-{lv}#{i}", "w": x["pola"]} for i, x in enumerate(load(f"bunpou-{lv}.json"))]
    return kos, kan, bun


def sebar(n_item, n_hari):
    """Hari (0-based) untuk tiap item, disebar rata."""
    return [min(n_hari - 1, (i * n_hari) // n_item) for i in range(n_item)]


def susun_kosakata(kos, kan_hari, n_hari):
    """Urutkan ulang kosakata supaya kata berkanji muncul setelah kanjinya diajarkan,
    tapi jumlah kata per hari tetap rata (tidak menumpuk)."""
    alami = sebar(len(kos), n_hari)
    kunci = []
    for i, x in enumerate(kos):
        perlu = [kan_hari[c] for c in KANJI_RE.findall(x["w"]) if c in kan_hari]
        kunci.append((max([alami[i]] + perlu), i))
    urut = sorted(range(len(kos)), key=lambda i: kunci[i])
    slot = sebar(len(kos), n_hari)
    hasil = [0] * len(kos)
    for pos, i in enumerate(urut):
        hasil[i] = slot[pos]
    return hasil


def bangun(lv, tempo):
    kos, kan, bun = materi(lv)
    k_rate, j_rate, b_rate = tempo
    n_hari = max(math.ceil(len(kos) / k_rate), math.ceil(len(kan) / j_rate), math.ceil(len(bun) / b_rate))

    # Kanji diselesaikan di 80% awal (tanpa melewati tempo kanji) supaya kosakata berkanji
    # lebih sering datang setelah kanjinya diajarkan.
    hari_kanji = min(n_hari, max(math.ceil(len(kan) / j_rate), math.ceil(0.8 * n_hari)))
    kan_d = sebar(len(kan), hari_kanji)
    bun_d = sebar(len(bun), n_hari)
    kan_hari = {x["w"]: kan_d[i] for i, x in enumerate(kan)}
    kos_d = susun_kosakata(kos, kan_hari, n_hari)

    belajar = [{"kosakata": [], "kanji": [], "bunpo": []} for _ in range(n_hari)]
    for i, d in enumerate(kos_d):
        belajar[d]["kosakata"].append(kos[i]["id"])
    for i, d in enumerate(kan_d):
        belajar[d]["kanji"].append(kan[i]["id"])
    for i, d in enumerate(bun_d):
        belajar[d]["bunpo"].append(bun[i]["id"])

    std = STANDAR[lv]
    skala = max(t / s for t, s in zip(tempo, std))  # >1 = lebih cepat dari standar

    def n_soal(base):
        return max(3, min(15, round(base * skala)))

    hari, minggu_ini, semua_sebelumnya = [], [], []
    b = 0
    while b < n_hari:
        for _ in range(6):
            if b >= n_hari:
                break
            p = b / n_hari
            fase = "awal" if p < 0.3 else ("tengah" if p < 0.8 else "akhir")
            fmt_key = "awal" if fase == "awal" else lv
            isi = belajar[b]
            hari.append({
                "hari": len(hari) + 1,
                "jenis": "belajar",
                "fase": fase,
                "materi": isi,
                "ujian": {
                    "sumber": "materi hari ini",
                    "kosakata": {"n": n_soal(5), "format": FORMAT["kosakata"][fmt_key]},
                    "kanji": {"n": n_soal(5), "format": FORMAT["kanji"][fmt_key]},
                    "bunpo": {"n": n_soal(5), "format": FORMAT["bunpo"][fmt_key]},
                    "dokkai": {"n": 2, "sumber": "bank dokkai level ini, berurutan"},
                    "waktu_menit": None if fase == "awal" else (20 if fase == "tengah" else 15),
                    "lulus": 0.7,
                },
            })
            minggu_ini.append(len(hari))
            b += 1
        no_minggu = (len(hari) // 7) + 1
        bulanan = no_minggu % 4 == 0
        hari.append({
            "hari": len(hari) + 1,
            "jenis": "ujian_bulanan" if bulanan else "fukushu",
            "materi_dari_hari": (semua_sebelumnya + minggu_ini) if bulanan else list(minggu_ini),
            "ujian": (
                {"sumber": "kumulatif sejak hari 1, porsi lebih besar untuk 4 minggu terakhir dan soal yang pernah salah",
                 "kosakata": {"n": 10}, "kanji": {"n": 10}, "bunpo": {"n": 10},
                 "dokkai": {"n": 3}, "format": "format JLPT/JFT asli", "waktu_menit": 40, "lulus": 0.7}
                if bulanan else
                {"sumber": "materi 6 hari minggu ini, prioritas soal yang salah",
                 "kosakata": {"n": 6}, "kanji": {"n": 6}, "bunpo": {"n": 6},
                 "dokkai": {"n": 2}, "waktu_menit": 25, "lulus": 0.7}
            ),
        })
        semua_sebelumnya += minggu_ini
        minggu_ini = []

    for i in range(SIMULASI[lv]):
        simul = i % 2 == 0
        hari.append({
            "hari": len(hari) + 1,
            "jenis": "simulasi" if simul else "perbaikan",
            "ujian": (
                {"sumber": "ujian penuh format asli (bank full-* boleh dipakai karena semua materi sudah dipelajari)",
                 "format": "JFT-Basic" if lv == "jft" else f"JLPT {lv.upper()} penuh", "lulus": 0.7}
                if simul else
                {"sumber": "materi dan pola soal yang salah di simulasi kemarin", "kosakata": {"n": 8},
                 "kanji": {"n": 8}, "bunpo": {"n": 8}, "dokkai": {"n": 2}, "lulus": 0.7}
            ),
        })

    return {
        "versi": 1,
        "level": lv,
        "tempo": {"kosakata": k_rate, "kanji": j_rate, "bunpo": b_rate},
        "standar": dict(zip(("kosakata", "kanji", "bunpo"), std)),
        "maks": dict(zip(("kosakata", "kanji", "bunpo"), MAKS)),
        "total": {"kosakata": len(kos), "kanji": len(kan), "bunpo": len(bun)},
        "hari_belajar": n_hari,
        "total_hari": len(hari),
        "hari": hari,
    }


def cek(s, lv):
    kos, kan, bun = materi(lv)
    want = {x["id"] for x in kos + kan + bun}
    got = []
    beban = []
    for h in s["hari"]:
        if h["jenis"] == "belajar":
            m = h["materi"]
            got += m["kosakata"] + m["kanji"] + m["bunpo"]
            beban.append((len(m["kosakata"]), len(m["kanji"]), len(m["bunpo"])))
    assert len(got) == len(set(got)), "ada materi dobel"
    assert set(got) == want, f"materi hilang: {len(want - set(got))}"
    puncak = tuple(max(b[i] for b in beban) for i in range(3))
    assert all(p <= m for p, m in zip(puncak, MAKS)), f"lewat batas maksimal {puncak}"
    return puncak


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lv", choices=list(STANDAR), action="append")
    ap.add_argument("--kos", type=int)
    ap.add_argument("--kanji", type=int)
    ap.add_argument("--bunpo", type=int)
    ap.add_argument("--cek", action="store_true", help="hanya ringkasan, tidak menulis file")
    a = ap.parse_args()
    for lv in a.lv or list(STANDAR):
        std = STANDAR[lv]
        tempo = (a.kos or std[0], a.kanji or std[1], a.bunpo or std[2])
        tempo = tuple(max(lo, min(hi, t)) for t, lo, hi in zip(tempo, MIN[lv], MAKS))
        s = bangun(lv, tempo)
        puncak = cek(s, lv)
        print(f"{lv}: tempo {tempo} -> {s['hari_belajar']} hari belajar, {s['total_hari']} hari total "
              f"(~{s['total_hari'] / 30:.1f} bulan), puncak harian {puncak}, total {s['total']}")
        if not a.cek:
            os.makedirs(OUT, exist_ok=True)
            with open(os.path.join(OUT, f"{lv}.json"), "w", encoding="utf-8") as f:
                json.dump(s, f, ensure_ascii=False, separators=(",", ":"))


if __name__ == "__main__":
    sys.exit(main())
