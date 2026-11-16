# -*- coding: utf-8 -*-
"""Bangun ssw-materials/industrial-manufacturing/ untuk kategori 機械金属加工 (idempotent, ID stabil).
Jalankan dari root repo:  python3 tools/imm/build.py"""
import json, sys, hashlib, random, pathlib, datetime
sys.path.insert(0, 'tools/imm')
from ch12 import CH as A
from ch34 import CH as B
from ch56 import CH as C
ROOT = pathlib.Path('ssw-materials/industrial-manufacturing')
SECTOR = {"id": "industrial-manufacturing", "jp": "工業製品製造業", "name": "Industrial Product Manufacturing"}
CAT = {"id": "mmp", "jp": "機械金属加工", "kana": "きかいきんぞくかこう", "name": "Machine & Metal Processing", "grades": ["1号", "2号"]}
LABEL = "ORIGINAL PRACTICE QUESTION"
CHAPTERS = A + B + C
OPT = "ABCD"
def rng(key): return random.Random(int(hashlib.sha256(key.encode()).hexdigest()[:12], 16))
exist = {}
for slug in ("mfg-machine-metal", "industrial-mfg"):
    try:
        for v in json.load(open(f"data/ssw/{slug}/vocab.json"))["items"]: exist.setdefault(v["kata"], (slug, v["id"]))
    except Exception: pass
vocab, cards, tests, curr_ch = [], [], [], []
qn = 0
for ch in CHAPTERS:
    subs_out = []
    for si, s in enumerate(ch["subs"], 1):
        # kosakata
        vids = []
        for i, (kanji, kana, rom, arti, defi) in enumerate(s["terms"], 1):
            vid = f"imm-mmp-v-{s['id']}-{i:02d}"
            rec = {"id": vid, "kata": kanji, "kanji": kanji, "kana": kana, "romaji": rom, "arti": arti, "definisi": defi,
                   "cat": ch["title_id"], "bab": ch["id"], "subbab": s["id"], "src": [s["id"]],
                   "source_document": "ORIGINAL-SHIROSE-MMP-001", "source_page": None, "image_ref": None,
                   "validation": "UNVERIFIED_AGAINST_OFFICIAL_TEXT (disusun orisinal; dasar topik: contoh soal resmi JAIM)",
                   "existing_db_id": (exist.get(kanji)[1] if kanji in exist else None), "existing_db": (exist.get(kanji)[0] if kanji in exist else None)}
            vocab.append(rec); vids.append(vid)
            cards.append({"id": f"imm-mmp-fc-{s['id']}-{i:02d}", "vocab_id": vid, "front": kanji, "reading": kana,
                          "back": arti, "note": defi, "bab": ch["id"], "subbab": s["id"]})
        # soal
        qs = []
        for qi, q in enumerate(s["questions"], 1):
            qid = f"imm-mmp-q-{s['id']}-{qi:02d}"; qn += 1
            if q[0] == "tf":
                _, stmt, ok, exp, comp, diff = q
                item = {"type": "true_false_AB", "question": stmt, "options": [{"id": "A", "text": "Benar (○)"}, {"id": "B", "text": "Salah (×)"}], "answer": "A" if ok else "B"}
            else:
                _, ques, right, wrong, exp, comp, diff = q
                assert len(wrong) == 3 and right not in wrong, qid
                allo = [right] + wrong; rng(qid).shuffle(allo)
                item = {"type": "mc4", "question": ques, "options": [{"id": OPT[k], "text": t} for k, t in enumerate(allo)], "answer": OPT[allo.index(right)]}
            item.update({"id": qid, "sector": SECTOR["id"], "category": CAT["id"], "chapter": ch["id"], "subchapter": s["id"],
                         "explanation": exp, "competency": comp, "difficulty": diff,
                         "reference": f"Materi Shirose {s['id']}; topik sejalan dengan contoh soal resmi JAIM sample1_01.pdf (bukan salinan)",
                         "label": LABEL, "image_ref": None})
            qs.append(item)
        tests.append({"id": f"imm-mmp-set-{s['id']}", "chapter": ch["id"], "subchapter": s["id"], "title": s["title_id"], "label": LABEL, "items": qs})
        subs_out.append({"id": s["id"], "no": si, "title": {"id": s["title_id"], "jp": s["title_jp"], "kana": s["title_kana"]},
                         "objectives": s["objectives"], "explanation": s["explanation"], "terms": vids, "application": s["application"],
                         "common_mistakes": s["mistakes"], "summary": s["summary"], "illustration": {"status": "NOT_CREATED", "plan": s["illustration"]},
                         "practice_set": f"imm-mmp-set-{s['id']}", "furigana": "Istilah Jepang beserta furigana ada di vocabulary/vocab.json (kolom kana)"})
    curr_ch.append({"id": ch["id"], "no": ch["no"], "title": {"id": ch["title_id"], "jp": ch["title_jp"], "kana": ch["title_kana"]}, "subchapters": subs_out})
def w(path, obj): (ROOT / path).write_text(json.dumps(obj, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
curr = {"schema": 1, "sector": SECTOR, "category": CAT, "status": "DRAFT_ORIGINAL (belum COMPLETE; lihat CHAT 2 HANDOFF)", "chapters": curr_ch}
w("processed-materials/curriculum-mmp.json", curr)
w("vocabulary/vocab-mmp.json", {"schema": 1, "category": CAT["id"], "items": vocab})
w("flashcards/flashcards-mmp.json", {"schema": 1, "category": CAT["id"], "derived_from": "vocabulary/vocab-mmp.json", "cards": cards})
w("practice-tests/practice-mmp.json", {"schema": 1, "label_policy": "Semua soal berlabel ORIGINAL PRACTICE QUESTION; tidak ada OFFICIAL QUESTION karena PDF resmi tidak berhasil diunduh.", "sets": tests})
# markdown kurikulum
md = ["# 機械金属加工 — Machine & Metal Processing (draft kurikulum orisinal)", "", "> Status: DRAFT. Disusun orisinal oleh Shirose Nihongo berdasarkan struktur ujian resmi dan topik contoh soal JAIM. Belum diverifikasi terhadap modul resmi (tidak berhasil diunduh).", ""]
for c in curr_ch:
    md.append(f"## Bab {c['no']} — {c['title']['id']} ({c['title']['jp']} / {c['title']['kana']})")
    for s in c["subchapters"]:
        md += ["", f"### {s['id']} — {s['title']['id']} ({s['title']['jp']})", "", "**Tujuan:**"] + [f"- {x}" for x in s["objectives"]] + ["", "**Penjelasan:**"] + s["explanation"] + ["", f"**Contoh penerapan:** {s['application']}", "", "**Kesalahan umum:**"] + [f"- {x}" for x in s["common_mistakes"]] + ["", "**Ringkasan:**"] + [f"- {x}" for x in s["summary"]] + ["", f"**Ilustrasi:** {s['illustration']['plan']} (status: belum dibuat)", ""]
(ROOT / "processed-materials/curriculum-mmp.md").write_text("\n".join(md) + "\n", encoding="utf-8")
print("chapters", len(curr_ch), "subs", sum(len(c['subchapters']) for c in curr_ch), "vocab", len(vocab), "cards", len(cards), "questions", qn)
