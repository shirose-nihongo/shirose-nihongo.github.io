#!/usr/bin/env python3
"""Soal SSW dari sumber resmi (ssw-materials) + kosakata/fungsi repo. Idempotent: set ber-id 'gen-*' ditimpa.
Jalankan dari akar repo: python3 tools/ssw/quiz_official_build.py"""
import json, random, re

def load(s): return json.load(open(f"data/ssw/{s}/quiz.json", encoding="utf-8"))
def save(s, q): json.dump(q, open(f"data/ssw/{s}/quiz.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
def vocab(s): return json.load(open(f"data/ssw/{s}/vocab.json", encoding="utf-8"))["items"]

def tf(stmt_id, stmt_jp, ok, exp):
    q = {"id": f"Benar atau salah: “{stmt_id}”"}
    if stmt_jp: q["jp"] = f"○か×か。「{stmt_jp}」"
    return {"q": q, "opts": [{"id": "Benar (○)", "jp": "○ {正|ただ}しい"}, {"id": "Salah (×)", "jp": "× {間違|まちが}い"}],
            "a": 0 if ok else 1, "exp": {"id": exp}, "mb": True}

def mc(q_id, opts, a, exp, q_jp=None):
    q = {"id": q_id}
    if q_jp: q["jp"] = q_jp
    return {"q": q, "opts": [{"id": o} for o in opts], "a": a, "exp": {"id": exp}}

def pick(rng, correct, pool, k=3):
    d = [x for x in pool if x != correct]; rng.shuffle(d); o = d[:k] + [correct]; rng.shuffle(o); return o, o.index(correct)

def put_bab(q, bab, sets, prefix):
    q["bab"][bab] = [s for s in q["bab"].get(bab, []) if not s["id"].startswith(prefix)] + sets
def put_tema(q, sets, prefix):
    q["tema"] = [s for s in q["tema"] if not s["id"].startswith(prefix)] + sets

def chunks(items, n): return [items[i:i+n] for i in range(0, len(items), n)]

# ---------------------------------------------------------------- AUTO MAINTENANCE
q = load("auto-maintenance"); V = vocab("auto-maintenance"); rng = random.Random(7)
S = "Sumber: MLIT 実施要領 1号/2号 (SRC-001/002), laporan SRC-004."
exam = [
 tf("Ujian 1号 Auto Maintenance memakai bahasa Jepang dengan furigana pada kanji.", "{自動車整備|じどうしゃせいび}の{試験|しけん}は{日本語|にほんご}で、{漢字|かんじ}にルビがつきます。", True, "Benar. Bahasa ujian = Jepang, kanji diberi ruby (SRC-001 §1(1)). " + S),
 tf("Ujian 1号 diselenggarakan oleh 日整連 (Japan Automobile Service Promotion Association).", "", True, "Benar. Pelaksana = 一般社団法人日本自動車整備振興会連合会 (日整連). " + S),
 tf("Ujian 1号 hanya dilaksanakan sekali setahun.", "", False, "Salah. Minimal 2 kali setahun (年2回以上). " + S),
 tf("Usia minimal peserta ujian adalah 17 tahun pada hari ujian.", "", True, "Benar. Syarat: berusia 17 tahun ke atas pada hari ujian. " + S),
 tf("Ujian tulis 1号 berbentuk ○× dengan 30 soal dalam 60 menit.", "", True, "Benar (30 soal, 60 menit, ○×). " + S),
 tf("Ujian praktik 1号 terdiri dari 3 tugas dalam 20 menit.", "", True, "Benar. 3 課題 / 20 menit. " + S),
 tf("Syarat lulus ujian tulis 1号 adalah jawaban benar minimal 65% dari soal.", "", True, "Benar. 学科 ≥65%, 実技 ≥60%. " + S),
 tf("Syarat lulus ujian praktik 1号 adalah total nilai minimal 65%.", "", False, "Salah. Praktik cukup ≥60%; yang 65% adalah ujian tulis 1号. " + S),
 tf("Hasil ujian diumumkan di situs web 日整連 sekitar 30 hari setelah ujian.", "", True, "Benar (30日以内を目途). " + S),
 tf("Sertifikat lulus diberikan kepada peserta lulus walau belum ada kontrak kerja.", "", False, "Salah. Sertifikat diterbitkan bila ada kontrak kerja dengan perusahaan penerima. " + S),
 tf("Lulus ujian menjamin visa Tokutei Ginou otomatis diberikan.", "", False, "Salah. Lulus ujian tidak menjamin pemberian status/visa. " + S),
 tf("Biaya ujian dikembalikan jika peserta tidak hadir.", "", False, "Salah. Biaya yang sudah dibayar tidak dikembalikan. " + S),
 mc("Ujian tulis 2号 Auto Maintenance berbentuk…", ["Pilihan ganda 4 opsi, 40 soal, 80 menit", "○×, 30 soal, 60 menit", "Esai, 10 soal, 120 menit", "Lisan saja"], 0, "2号: 四択式, 40 soal, 80 menit (SRC-002). 1号: ○× 30 soal 60 menit."),
 mc("Syarat pengalaman untuk ujian 2号 Auto Maintenance:", ["Minimal 3 tahun kerja merawat mobil di bengkel bersertifikat", "Tidak perlu pengalaman", "Minimal 1 bulan", "Minimal 10 tahun"], 0, "Syarat 2号: pengalaman kerja pemeliharaan ≥3 tahun di tempat usaha bersertifikat (SRC-002 §1(5))."),
 mc("Ambang lulus ujian tulis 2号 Auto Maintenance:", ["≥60% jawaban benar", "≥65% jawaban benar", "≥80% jawaban benar", "100%"], 0, "2号: 学科 ≥60%, 実技 ≥60% (SRC-002 §5)."),
 mc("Masa berlaku sertifikat lulus ujian 2号 adalah…", ["10 tahun sejak tanggal ujian", "1 tahun", "3 tahun", "Seumur hidup"], 0, "Masa berlaku 10 tahun dari tanggal ujian (SRC-002)."),
 mc("Peserta lulus 外国人技能養成講習 dibebaskan dari…", ["Ujian praktik 2号 (dalam 2 tahun)", "Ujian tulis 2号", "Seluruh ujian", "Tes bahasa"], 0, "Pembebasan praktik 2号 berlaku sampai 2 tahun setelah kursus selesai (SRC-002 §8)."),
]
import sys; sys.path.insert(0, "tools/ssw")
from quiz_auto_gakka1_data import SETS as G1, PRAKTIK as PR
g1sets = []
for n, (name, rows) in enumerate(G1.items(), 1):
    its = []
    for jp, idt, ok, exp in rows:
        it = tf(idt, jp, ok, exp + " (Latihan gaya 学科 1号 — soal buatan Shirose)")
        it["q"]["jp"] = f"○か×か。「{jp}」"
        its.append(it)
    g1sets.append({"id": f"gen-g1-{n}", "tema": True, "title": {"id": f"Tema 1号 学科: {name}", "jp": f"テーマ：{name}"}, "items": its})
rng2 = random.Random(21); pr = []
for jp, idt, good, bad, exp in PR:
    pair = [(good, True), (bad, False)]; rng2.shuffle(pair)
    pr.append({"q": {"id": idt, "jp": jp}, "opts": [{"id": re.sub(r"\{([^|}]*)\|[^}]*\}", r"\1", t), "jp": t} for t, _ in pair],
               "a": [ok for _, ok in pair].index(True), "exp": {"id": exp + " (Latihan gaya 実技 1号 — 二択)"}})
g1sets.append({"id": "gen-g1-praktik", "tema": True, "title": {"id": "Tema 1号 実技: pilih 1 dari 2", "jp": "テーマ：{実技|じつぎ}（{二択|にたく}）"}, "items": pr})
put_tema(q, g1sets + [{"id": "gen-tema-ujian-resmi", "tema": True, "title": {"id": "Tema: Aturan ujian resmi", "jp": "テーマ：{試験|しけん}のルール"}, "items": exam}], "gen-")

fv = [v for v in V if v.get("fungsi")]
rng.shuffle(fv)
sets = []
for n, grp in enumerate(chunks(fv, 10), 1):
    items = []
    for v in grp:
        same = [x for x in fv if x["cat"] == v["cat"] and x["kata"] != v["kata"]] or [x for x in fv if x["kata"] != v["kata"]]
        pool = list({x["kata"] for x in same}); 
        pool += [x["kata"] for x in rng.sample(fv, 6) if x["kata"] != v["kata"]]
        opts, a = pick(rng, v["kata"], list(dict.fromkeys(pool)))
        items.append(mc(f"Komponen mana yang fungsinya: {v['fungsi']}", opts, a,
                        f"{v['kata']} ({v.get('kana','')}) = {v['arti']}. Fungsi: {v['fungsi']}", "{部品|ぶひん}の{働|はたら}きは？"))
    sets.append({"id": f"gen-fungsi-{n}", "title": {"id": f"Fungsi komponen ({n})", "jp": f"{{部品|ぶひん}}の{{働|はたら}}き {n}"}, "items": items})
put_bab(q, "bab4", sets, "gen-")
save("auto-maintenance", q); print("auto: exam", len(exam), "fungsi sets", len(sets), "soal", sum(len(s['items']) for s in sets))

# ---------------------------------------------------------------- MACHINE METAL
q = load("mfg-machine-metal"); V = vocab("mfg-machine-metal"); rng = random.Random(11)
for bab in ("bab1", "bab2"):
    vs = [v for v in V if v["bab"] == bab]; rng.shuffle(vs); sets = []
    for n, grp in enumerate(chunks(vs, 8), 1):
        items = []
        for v in grp:
            opts, a = pick(rng, v["arti"], [x["arti"] for x in V])
            items.append(mc(f"Apa arti 「{v['kata']}」?", opts, a, f"{v['kata']} ({v['kana']}) = {v['arti']}." + (f" Contoh: {v['arti_contoh']}" if v.get("arti_contoh") else ""), f"「{v['kata']}」の{{意味|いみ}}は？"))
            if v.get("contoh"):
                items.append(tf(f"{v['kata']} berarti {v['arti']}.", "", True, f"Benar. {v['kata']} = {v['arti']}."))
        sets.append({"id": f"gen-kosakata-{bab}-{n}", "title": {"id": f"Kosakata mesin & logam {bab[-1]}.{n}", "jp": f"{{単語|たんご}} {bab[-1]}.{n}"}, "items": items})
    put_bab(q, bab, sets, "gen-")
off = [
 tf("Industrial Manufacturing (工業製品製造業) 1号 mencakup 17 kategori pekerjaan (業務区分).", "", True, "Benar. Per 2026-06: 1号 = 17 区分, 2号 = 3 区分 (SRC-010 hlm. 6)."),
 tf("Kategori yang punya 2号: 機械金属加工, 電気電子機器組立て, 金属表面処理.", "", True, "Benar (SRC-010)."),
 tf("Bahasa 1号 manufaktur: JFT-Basic A2.2 atau JLPT N4 ke atas.", "", True, "Benar (SRC-011 hlm. 17)."),
 tf("Bahasa 2号 manufaktur: JLPT N3 ke atas.", "", True, "Benar; juga perlu pengalaman kerja ≥3 tahun (SRC-011)."),
 tf("Ujian 1号 manufaktur: lulus bila tulis ≥65 dan praktik ≥60 dari 100.", "", True, "Benar (SRC-012 §6)."),
 tf("Ujian 2号 manufaktur (製造分野特定技能2号評価試験) lulus bila ≥60 dari 100.", "", True, "Benar (SRC-012 §6)."),
 tf("縫製 (menjahit) termasuk kategori pekerjaan 1号 manufaktur.", "", True, "Benar; kategori no. 10 (SRC-010)."),
 tf("Kategori 家具製造 punya 2号.", "", False, "Salah. Hanya 機械金属加工, 電気電子機器組立て, 金属表面処理 yang punya 2号."),
 mc("Berapa kategori pekerjaan 1号 di manufaktur (per 2026-06)?", ["17", "3", "10", "30"], 0, "17 業務区分 (SRC-010)."),
 mc("Berapa kategori 2号 di manufaktur?", ["3", "17", "1", "10"], 0, "3 区分 (SRC-010)."),
]
q2 = load("industrial-mfg"); put_tema(q2, [{"id": "gen-tema-resmi", "tema": True, "title": {"id": "Tema: Aturan resmi manufaktur", "jp": "テーマ：{制度|せいど}のルール"}, "items": off}], "gen-"); save("industrial-mfg", q2)
save("mfg-machine-metal", q); print("mm ok; ind-mfg official", len(off))
