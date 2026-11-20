# -*- coding: utf-8 -*-
"""Ganti HANYA bagian Dokkai pada Full Exam → jlpt/<lv>/full-NN.v2.json.

  python tools/jlpt_v2/build_dokkai_v2.py n5            # semua paket yang ada sumbernya
  python tools/jlpt_v2/build_dokkai_v2.py n5 3 4        # paket tertentu

Sumber: tools/jlpt_v2/src/dokkai_<lv>_*.py, masing-masing berisi dict PAKET = {nomor: dict(passages=..., items=...)}.
- Bagian lain (moji-goi, bunpou, choukai) disalin apa adanya dari full-NN.json.
- Paket yang punya sumber lengkap (src/<lv>_full_NN.py, mis. pilot n3-11) dilewati — Dokkai-nya sudah direvisi di sana.
- Jumlah soal per paket, id soal, dan urutan mondai harus sama dengan file lama.
- jlpt/index.json TIDAK diubah.

Format item:  (pid, pertanyaan, [4 pilihan], indeks_kunci, alasan, bukti, [alasan per pilihan])
Format bacaan: pid: (jenis, teks_jepang, terjemahan_indonesia)
"""
import copy, glob, json, os, random, re, runpy, sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, "tools"))
import jlpt_build as B  # noqa: E402

ABCD = "ABCD"
POIN = {
    "短文": "短文: baca pertanyaan dulu, lalu cari satu kalimat di teks yang menjawabnya. Pilihan yang memakai kata dari teks tetapi salah hubungannya adalah jebakan.",
    "中文": "中文: perhatikan alasan (から・ので), urutan kejadian, dan kata rujukan (それ・この〜) — jawabannya biasanya ada di kalimat sebelum/sesudah garis bawah.",
    "長文": "長文: tiap paragraf punya satu gagasan; pertanyaan terakhir biasanya menanyakan pendapat penulis di paragraf penutup.",
    "主張": "主張理解: bedakan pendapat penulis dari pendapat umum yang ia kutip (〜と言われる・〜という人もいる); kesimpulan biasanya di akhir.",
    "統合": "統合理解: bandingkan A dan B — cari poin yang sama-sama disebut dan poin di mana pendapat mereka berbeda.",
    "情報": "情報検索: tulis dulu syarat orang di soal (hari, jam, usia, biaya), lalu coret baris tabel yang tidak memenuhi syarat satu per satu.",
}
NUMERIC = lambda opts: all(any(c.isdigit() for c in o) for o in opts)
POS = Counter({0: 0, 1: 0, 2: 0, 3: 0})   # sebaran kunci berjalan per level


def load_src(lv):
    pk = {}
    for f in sorted(glob.glob(os.path.join(ROOT, "tools", "jlpt_v2", "src", f"dokkai_{lv}_*.py"))):
        for k, v in runpy.run_path(f)["PAKET"].items():
            if k in pk: raise SystemExit(f"paket {k} dobel ({f})")
            pk[k] = v
    return pk


def kind(jenis):
    for k in POIN:
        if k in jenis: return k
    return "短文"


def build_items(lv, nn, src, tipe_jp):
    rnd = random.Random(f"shirose-{lv}-dokkai-{nn}-v2")
    P = src["passages"]
    out = []
    for (pid, q, opts, ans, why, bukti, o) in src["items"]:
        # posisi kunci: isi posisi yang paling jarang dipakai di level ini (soal angka mengikuti urutan nilai)
        low = min(POS.values())
        t = rnd.choice([k for k in range(4) if POS[k] == low])
        if pid not in P: raise SystemExit(f"{lv}-{nn}: bacaan {pid} tidak ada")
        if len(opts) != 4 or len(o) != 4: raise SystemExit(f"{lv}-{nn}: {q} — pilihan/alasan harus 4")
        if len(set(opts)) != 4: raise SystemExit(f"{lv}-{nn}: pilihan kembar di {q}")
        if NUMERIC(opts):
            # Pilihan angka (jam, harga, tanggal) disusun naik seperti soal asli; kunci ikut berpindah.
            num = lambda s: float(re.search(r"\d+(?:\.\d+)?", s.replace(",", "")).group())
            order = sorted(range(4), key=lambda i: num(opts[i]))
            opts, o, ans = [opts[i] for i in order], [o[i] for i in order], order.index(ans)
        else:
            others = [i for i in range(4) if i != ans]
            rnd.shuffle(others)
            order = others[:t] + [ans] + others[t:]
            opts, o, ans = [opts[i] for i in order], [o[i] for i in order], t
        POS[ans] += 1
        jenis, jp, tr = P[pid]
        out.append({"cat": "dokkai", "tipe": "dokkai", "tipe_jp": tipe_jp, "pid": pid, "q": q, "opts": opts, "ans": ans,
                    "ex": {"jawaban": f"{ABCD[ans]}. {opts[ans]}", "terjemahan": tr, "alasan": why, "bukti": bukti,
                           "opsi": [f"{ABCD[i]}. {x} — {'BENAR' if i == ans else 'Salah'}. {o[i]}" for i, x in enumerate(opts)],
                           "kosakata": None, "poin": POIN[kind(jenis)]}})
    return out


def build(lv, nn, src):
    old = json.load(open(os.path.join(ROOT, "jlpt", lv, f"full-{nn:02d}.json"), encoding="utf-8"))
    pkg = copy.deepcopy(old)
    pkg["versi"] = 2
    dsec = [s for s in pkg["sections"] if s["cat"] == "dokkai"]
    if len(dsec) != 1: raise SystemExit(f"{lv}-{nn}: bagian dokkai {len(dsec)}")
    ds = dsec[0]
    old_pids = {it.get("pid") for it in ds["items"]}
    other_pids = {it.get("pid") for s in pkg["sections"] if s is not ds for it in s["items"] if it.get("pid")}
    if old_pids & other_pids: raise SystemExit(f"{lv}-{nn}: bacaan dokkai dipakai bagian lain {old_pids & other_pids}")
    items = build_items(lv, nn, src, ds["tipe_jp"])
    if len(items) != len(ds["items"]):
        raise SystemExit(f"{lv}-{nn}: {len(items)} soal dokkai, file lama {len(ds['items'])}")
    ds["items"] = items
    pkg["passages"] = {k: v for k, v in pkg.get("passages", {}).items() if k not in old_pids}
    for pid, (jenis, jp, tr) in src["passages"].items():
        if pid in pkg["passages"]: raise SystemExit(f"{lv}-{nn}: pid {pid} bentrok")
        pkg["passages"][pid] = {"jenis": jenis, "jp": jp, "id": tr}
    B.number(pkg)
    for a, b in zip([i["id"] for s in old["sections"] for i in s["items"]], [i["id"] for s in pkg["sections"] for i in s["items"]]):
        if a != b: raise SystemExit(f"{lv}-{nn}: id bergeser {a} → {b}")
    out = os.path.join(ROOT, "jlpt", lv, f"full-{nn:02d}.v2.json")
    json.dump(pkg, open(out, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    return Counter(ABCD[i["ans"]] for i in items)


if __name__ == "__main__":
    lv = sys.argv[1]
    src = load_src(lv)
    want = [int(x) for x in sys.argv[2:]] or sorted(src)
    tot = Counter()
    for nn in want:
        if os.path.exists(os.path.join(ROOT, "tools", "jlpt_v2", "src", f"{lv}_full_{nn:02d}.py")):
            print(f"lewati {lv}-{nn:02d}: sudah punya sumber lengkap (build_full_v2.py)"); continue
        if nn not in src:
            print(f"lewati {lv}-{nn:02d}: belum ada sumber dokkai"); continue
        c = build(lv, nn, src[nn]); tot += c
        print(f"OK {lv}/full-{nn:02d}.v2.json  dokkai {sum(c.values())} soal")
    print("sebaran kunci dokkai:", dict(sorted(tot.items())))
