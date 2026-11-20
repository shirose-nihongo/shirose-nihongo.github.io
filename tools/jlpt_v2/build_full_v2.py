# -*- coding: utf-8 -*-
"""Bangun Full Exam versi revisi (v2) dari sumber tools/jlpt_v2/src/<lv>_full_<NN>.py.

  python tools/jlpt_v2/build_full_v2.py n3 11

- Membaca jlpt/<lv>/full-NN.json HANYA sebagai cetakan (urutan mondai, judul, instruksi). File lama tidak diubah.
- Choukai diambil dari choukai/paket/<lv>-p<CHOUKAI_PK>.json (hasil tools/choukai_build.py).
- Menulis jlpt/<lv>/full-NN.v2.json. jlpt/index.json TIDAK diubah (go-live dilakukan terpisah setelah ditinjau).
- Posisi kunci diacak deterministik (seed tetap) supaya sebaran A–D merata; penjelasan ikut berpindah.
"""
import json, os, random, runpy, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, "tools"))
import jlpt_build as B  # noqa: E402

ABCD = "ABCD"
lv, nn = sys.argv[1], int(sys.argv[2])
VER = 2
S = runpy.run_path(os.path.join(ROOT, "tools", "jlpt_v2", "src", f"{lv}_full_{nn:02d}.py"))
old = json.load(open(os.path.join(ROOT, "jlpt", lv, f"full-{nn:02d}.json"), encoding="utf-8"))
rnd = random.Random(f"shirose-{lv}-full-{nn}-v{VER}")
NUM_OPTS = lambda opts: all(any(c.isdigit() for c in o) for o in opts)


def shuffle(it, target):
    """Pindahkan kunci ke posisi `target`; urutan pengecoh diacak. Pilihan angka dibiarkan urut."""
    opts, o, ans = it["opts"], it["o"], it["ans"]
    if NUM_OPTS(opts):
        return opts, o, ans
    others = [i for i in range(len(opts)) if i != ans]
    rnd.shuffle(others)
    order = others[:target] + [ans] + others[target:]
    return [opts[i] for i in order], [o[i] for i in order], target


def ex_lang(tipe, q_plain, opts, o, ans, tr, why, extra=None):
    ex = {"jawaban": f"{ABCD[ans]}. {opts[ans]}", "terjemahan": tr, "alasan": why,
          "opsi": [f"{ABCD[i]}. {x} — {'BENAR' if i == ans else 'Salah'}. {o[i]}" for i, x in enumerate(opts)],
          "kosakata": None, "poin": S["POIN"].get(tipe, "")}
    if extra: ex.update(extra)
    return ex


def balanced_targets(n, k=4):
    t = [i % k for i in range(n)]
    rnd.shuffle(t)
    return t


def lang_items(tipe, src, tipe_jp):
    out = []
    tg = balanced_targets(len(src))
    for it, t in zip(src, tg):
        opts, o, ans = shuffle(it, t)
        q = f"<u>{it['q']}</u>" if tipe == "youhou" else it["q"]
        item = {"cat": B.INSTR[tipe][1], "tipe": tipe, "tipe_jp": tipe_jp, "q": q, "opts": opts, "ans": ans}
        if it.get("pid"): item["pid"] = it["pid"]
        tr = it.get("tr") or S["PASSAGES"].get(it.get("pid"), {}).get("id", "")
        extra = {"bukti": it["bukti"]} if it.get("bukti") else None
        if it.get("poin"): extra = dict(extra or {}, grammar={"pola": it["poin"]})
        item["ex"] = ex_lang(tipe, q, opts, o, ans, tr, it["why"], extra)
        out.append(item)
    return out


def kumitate_items(src, tipe_jp):
    out = []
    for it in src:
        frag, order, star = it["frag"], it["order"], it["star"]
        ans = order[star - 1]
        blanks = " ".join("★＿＿＿" if i + 1 == star else "＿＿＿" for i in range(4))
        sentence = it["head"] + "".join(frag[i] for i in order) + it["tail"]
        pos = {fi: p + 1 for p, fi in enumerate(order)}
        out.append({"cat": "bunpou", "tipe": "kumitate", "tipe_jp": tipe_jp,
                    "q": f"{it['head']} {blanks} {it['tail']}", "opts": frag, "ans": ans,
                    "ex": {"jawaban": f"{ABCD[ans]}. {frag[ans]}", "terjemahan": it["tr"],
                           "alasan": f"Urutan yang benar: {' → '.join(ABCD[i] for i in order)}, sehingga kalimatnya 「{sentence}」. "
                                     f"Kotak ★ ada di posisi ke-{star}, yaitu 「{frag[ans]}」. Kuncinya: {it['poin']}.",
                           "opsi": [f"{ABCD[i]}. {f} — posisi ke-{pos[i]}{' (★ jawaban)' if i == ans else ''}" for i, f in enumerate(frag)],
                           "grammar": {"pola": it["poin"]},
                           "struktur": " ＋ ".join([it["head"]] + [frag[i] for i in order] + [it["tail"]]),
                           "poin": S["POIN"]["kumitate"]}})
    return out


def choukai_sections(old_secs):
    pk = json.load(open(os.path.join(ROOT, "choukai", "paket", f"{lv}-p{S['CHOUKAI_PK']}.json"), encoding="utf-8"))
    by_jp = {s["tipe_jp"]: s for s in old_secs}
    secs = []
    for ps in pk["sections"]:
        tmpl = by_jp[ps["jp"]]
        items = []
        for it in ps["items"]:
            for qi, qq in enumerate(it["qs"]):
                ck = B.ck_from_real({"sec": ps, "it": it, "qi": qi, "q": qq})
                info = S["CHOUKAI"].get((ps["mondai"], it["no"]))
                if not info: raise SystemExit(f"penjelasan choukai {ps['mondai']}-{it['no']} belum ada")
                missing = [x for x in ck["opts"] if x not in info["o"]]
                if missing: raise SystemExit(f"choukai {ps['mondai']}-{it['no']}: pilihan tanpa penjelasan {missing}")
                a = ck["ans"]
                ck["ex"]["terjemahan"] = info["tr"]
                ck["ex"]["opsi"] = [f"{ABCD[i]}. {x} — {'BENAR' if i == a else 'Salah'}. {info['o'][x]}" for i, x in enumerate(ck["opts"])]
                items.append(ck)
        secs.append({**{k: v for k, v in tmpl.items() if k != "items"}, "items": items,
                     "src": f"{pk['title'].split(' · ')[0]} · Paket {nn} v{VER}"})
    return secs


pkg = {"id": old["id"], "lv": lv, "jenis": "full", "judul": old["judul"], "durasi": old["durasi"], "versi": VER,
       "sections": [], "passages": S["PASSAGES"]}
old_ck = [s for s in old["sections"] if s["cat"] == "choukai"]
for s in old["sections"]:
    if s["cat"] == "choukai":
        continue
    t = s["tipe"]
    if t == "kumitate":
        items = kumitate_items(S["kumitate"], s["tipe_jp"])
    elif t == "dokkai":
        items = lang_items("dokkai", S["dokkai"], s["tipe_jp"])
    else:
        items = lang_items(t, S[t], s["tipe_jp"])
    if len(items) != len(s["items"]):
        raise SystemExit(f"mondai {s['mondai']} {t}: {len(items)} soal, file lama {len(s['items'])}")
    pkg["sections"].append({**{k: v for k, v in s.items() if k != "items"}, "items": items})
new_ck = choukai_sections(old_ck)
for s_old, s_new in zip(old_ck, new_ck):
    if s_old["tipe_jp"] != s_new["tipe_jp"] or len(s_old["items"]) != len(s_new["items"]):
        raise SystemExit(f"choukai {s_new['tipe_jp']}: susunan berbeda dari file lama")
pkg["sections"] += new_ck
B.number(pkg)
if pkg["jumlah"] != old["jumlah"]:
    raise SystemExit(f"jumlah {pkg['jumlah']} ≠ file lama {old['jumlah']}")
out = os.path.join(ROOT, "jlpt", lv, f"full-{nn:02d}.v{VER}.json")
json.dump(pkg, open(out, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
from collections import Counter
print(out, pkg["jumlah"], "soal · sebaran kunci", dict(sorted(Counter(ABCD[q["ans"]] for s in pkg["sections"] for q in s["items"]).items())))
