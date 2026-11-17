# -*- coding: utf-8 -*-
"""Bangun modul Aviation (hub `aviation` -> `aviation-gh` + `aviation-am`) dari data di aviation_*_data.py.
Tulis data/ssw/<slug>/{index,babN,vocab,quiz}.json. Halaman buku (JP dari PDF JAEA, ID via build_idbook) dibuat terpisah.
Pakai:  python3 tools/ssw/aviation_build.py"""
import json, os, re, sys, random
sys.path.insert(0, os.path.dirname(__file__))
from bidang_lib import vocab_item, vocab_quiz, write_pack
import aviation_gh_data as GH, aviation_am_data as AM, aviation_vocab_data as V, aviation_quiz_data as Q

KANJI = re.compile(r"[一-鿿々]"); RB = re.compile(r"\{[^{}|]*\|[^{}]*\}")
OV = {  # pembacaan konteks teknis (prioritas panjang)
 "航空機整備":"こうくうきせいび","航空機":"こうくうき","搭降載":"とうこうさい","搭載物":"とうさいぶつ","搭載":"とうさい","手荷物":"てにもつ","機側":"きそく","機移し":"きうつし","貨物":"かもつ","給油":"きゅうゆ","整備士":"せいびし","整備":"せいび",
 "旅客":"りょかく","搭乗":"とうじょう","駐機":"ちゅうき","取り扱い":"とりあつかい","取扱い":"とりあつかい","取扱":"とりあつかい","指差呼称":"ゆびさしこしょう","積み卸し":"つみおろし","取り卸し":"とりおろし","降載":"こうさい","航空":"こうくう",
 "行き先":"いきさき","行先":"ゆきさき","発地":"はっち","着地":"ちゃくち","便名":"びんめい","機長":"きちょう","機体":"きたい","機内":"きない","機首":"きしゅ","主翼":"しゅよく","翼":"つばさ","脚":"あし","前脚":"まえあし","主脚":"しゅきゃく",
 "日":"にち","間":"あいだ","量":"りょう","個数":"こすう","重量":"じゅうりょう","重い":"おもい","軽い":"かるい","締付":"しめつけ","締め":"しめ","回り止め":"まわりどめ","割ピン":"わりぴん","皿頭":"さらあたま","溝":"みぞ","目盛":"めもり",
 "直流":"ちょくりゅう","交流":"こうりゅう","電圧":"でんあつ","電流":"でんりゅう","抵抗":"ていこう","極性":"きょくせい","並列":"へいれつ","直列":"ちょくれつ","揚力":"ようりょく","油圧":"ゆあつ","圧縮空気":"あっしゅくくうき","与圧":"よあつ","防氷":"ぼうひょう",
 "高所":"こうしょ","保護具":"ほごぐ","安全線":"あんぜんせん","安全":"あんぜん","衛生":"えいせい","健康":"けんこう","騒音":"そうおん","火気厳禁":"かきげんきん","整備品質":"せいびひんしつ","品質":"ひんしつ","不具合":"ふぐあい","事故":"じこ",
 "通関":"つうかん","保税":"ほぜい","車椅子":"くるまいす","診断書":"しんだんしょ","税関":"ぜいかん","乗り継ぎ":"のりつぎ","忘れ物":"わすれもの","不審物":"ふしんぶつ","客室":"きゃくしつ","生鮮食料品":"せいせんしょくりょうひん","水濡れ":"みずぬれ","天地無用":"てんちむよう",
 "貨物室":"かもつしつ","飲料水":"いんりょうすい","上方":"じょうほう","下方":"かほう","時間内":"じかんない","時間":"じかん","夜間":"やかん","飛行間":"ひこうかん","不安全":"ふあんぜん","定期的":"ていきてき","長期的":"ちょうきてき","信頼性":"しんらいせい","被測定物":"ひそくていぶつ","測定":"そくてい","整備品質":"せいびひんしつ","床":"ゆか","測定値":"そくていち","会社":"かいしゃ","給油車":"きゅうゆしゃ","駐機中":"ちゅうきちゅう","鋼":"こう",
 "水平安定板":"すいへいあんていばん","垂直安定板":"すいちょくあんていばん","安定板":"あんていばん","補助翼":"ほじょよく","方向舵":"ほうこうだ","昇降舵":"しょうこうだ","動翼":"どうよく","胴体":"どうたい","落雷":"らくらい","逆噴射":"ぎゃくふんしゃ",
}
OVK = sorted(OV, key=len, reverse=True)
from fugashi import Tagger
_tag = Tagger()
def _ruby(orig, hira):
    # buang awalan/akhiran kana yang sama
    a = 0
    while a < len(orig) and a < len(hira) and orig[a] == hira[a] and not KANJI.match(orig[a]): a += 1
    b = 0
    while b < len(orig) - a and b < len(hira) - a and orig[-1 - b] == hira[-1 - b] and not KANJI.match(orig[-1 - b]): b += 1
    core, yomi = orig[a:len(orig) - b], hira[a:len(hira) - b]
    return orig[:a] + "{%s|%s}" % (core, yomi) + orig[len(orig) - b:] if core and yomi else orig
def _hira(k): return "".join(chr(ord(c) - 0x60) if "ァ" <= c <= "ヶ" else c for c in k)
def _seg(s):
    out = ""; i = 0
    while i < len(s):
        hit = None
        if KANJI.match(s[i]):
            for k in OVK:
                if s.startswith(k, i): hit = k; break
        if hit: out += _ruby(hit, OV[hit]); i += len(hit); continue
        # potong segmen sampai override berikutnya, analisis dengan MeCab
        j = i
        while j < len(s) and not (KANJI.match(s[j]) and any(s.startswith(k, j) for k in OVK)): j += 1
        for w in _tag(s[i:j]):
            sf = w.surface
            if KANJI.search(sf) and w.feature.kana: out += _ruby(sf, _hira(w.feature.kana))
            else: out += sf
            out += getattr(w, "white_space", "") or ""
        i = j
    return out
_ADJ = re.compile(r"\{([^|{}]+)\|([^{}]+)\}\{([^|{}]+)\|([^{}]+)\}")
def _merge(t):
    while True:
        n = _ADJ.sub(lambda m: "{%s%s|%s%s}" % m.groups()[0::1][:1] + "" if False else "{%s|%s}" % (m.group(1) + m.group(3), m.group(2) + m.group(4)), t)
        if n == t: return n
        t = n
def furi(text):
    return _merge(_furi(text))
def _furi(text):
    parts = RB.split(text); toks = RB.findall(text); r = ""
    for i, p in enumerate(parts):
        r += _seg(p) if KANJI.search(p) else p
        if i < len(toks): r += toks[i]
    return r
def plain(s): return re.sub(r"\*\*", "", RB.sub(lambda m: m.group(0)[1:-1].split("|")[0], s))

def blocks(bl):
    out = []
    for t, v in bl:
        if t == "h": out.append({"h": v})
        elif t == "ul": out.append({"ul": list(v)})
        elif t == "note": out.append({"note": v})
        elif t == "p": out.append({"p": v})
    return out
def flat(bl):
    r = []
    for t, v in bl:
        if t == "ul": r += list(v)
        elif t in ("p", "note"): r.append(v)
    return r
def short(s, n=170):
    s = plain(s) if "{" not in s else s
    return s if len(s) <= n else s[:n].rsplit("、", 1)[0] + "…"

def build(slug, nama, jp, M, V_LINES, QZ, pre, src, npages, extra_sub=None, samples=None, info_note=""):
    babs = []; vocab = []; quiz = {"bab": {}, "tema": []}
    subs_all = {}
    for (bid, no, t_id, t_jp, intro, pg, subs) in M.BABS:
        ss = []
        for k, (sid, s_id, s_jp, sp, ID, JP) in enumerate(subs, 1):
            f_id = flat(ID); f_jp = flat(JP)
            sub = {"id": sid, "no": k, "title": {"id": s_id, "jp": furi(s_jp)}, "pages": [sp[0] - 1, sp[1] - 1], "pagesJp": [sp[0] - 1, sp[1] - 1],
                   "full": {"id": blocks(ID), "jp": [({"h": furi(v)} if t == "h" else {"ul": [furi(x) for x in v]} if t == "ul" else {"note": furi(v)} if t == "note" else {"p": furi(v)}) for t, v in JP]},
                   "summary": {"id": {"core": short(f_id[0]), "points": [short(x) for x in f_id[1:4]], "avoid": [], "exam": []},
                               "jp": {"core": short(furi(f_jp[0]), 200), "points": [short(furi(x), 200) for x in f_jp[1:4]]}}}
            ss.append(sub); subs_all[sid] = (bid, s_id, sp[0] - 1)
        babs.append({"schema": 1, "bidang": slug, "source": src + ". Ringkasan ID/JP ditulis ulang oleh Shirose Nihongo (bukan terjemahan resmi, bukan dari JAEA). " + info_note,
                     "markup": "Teks JP memakai {kanji|furigana} untuk ruby.",
                     "bab": {"id": bid, "no": no, "title": {"id": t_id, "jp": furi(t_jp)}, "intro": {"id": intro}, "pages": [pg[0] - 1, pg[1] - 1], "pagesJp": [pg[0] - 1, pg[1] - 1], "subs": ss}})
    if extra_sub:  # soal contoh resmi
        babs[0]["bab"]["subs"].append(extra_sub)
    # kosakata
    cat = {b[0]: b[2] for b in M.BABS}; n = 0
    for ln in V_LINES:
        kata, kana, arti, sid = ln.split("|"); n += 1
        bid, _, p = subs_all[sid]
        e = vocab_item(pre, n, kata, kana, arti, cat[bid], bid, [sid]); e["sumber"] = src; e["halaman"] = p; vocab.append(e)
    # kuis: per bab (○×) + per subbab (arti kosakata)
    def mc_item(jps, ids, ans, exp):
        return {"q": {"id": "Benar atau salah: “%s”" % ids, "jp": "○か×か。「%s」" % furi(jps)},
                "opts": [{"id": "Benar (○)", "jp": "○ {正|ただ}しい"}, {"id": "Salah (×)", "jp": "× {間違|まちが}い"}], "a": 0 if ans else 1,
                "exp": {"id": exp}, "mb": True}
    for (bid, no, t_id, t_jp, intro, pg, subs) in M.BABS:
        ql = []
        items = [mc_item(*x) for x in QZ.get(bid, [])]
        if items: ql.append({"id": bid + "-q1", "title": {"id": "Latihan Bab %d (○×)" % no, "jp": furi("第%d章の練習" % no)}, "items": items})
        for (sid, *_r) in subs:
            ws = [dict(v, _p=v["halaman"]) for v in vocab if v["src"] == [sid]]
            if len(ws) >= 4:
                q = vocab_quiz(sid + "-q", {"id": "Kosakata: " + dict((s[0], s[1]) for s in subs)[sid], "jp": furi("ことば")}, ws, seed=hash(sid) & 0xffff, n=min(8, len(ws)), pool=vocab)
                q["sub"] = sid; ql.append(q)
        quiz["bab"][bid] = ql
    if samples: quiz["bab"]["bab1"].insert(0, samples)
    idx = {"slug": slug, "nama": nama, "jp": jp, "pages": {"jp": npages, "id": 0}, "attrib": "出典: 公益社団法人 日本航空技術協会（JAEA）特定技能評価試験テキスト。編集・加工（要約・翻訳・設問作成）は Shirose Nihongo が行ったもので、JAEA によるものではありません。 / Sumber: Japan Aeronautical Engineers' Association (JAEA). Ringkasan, terjemahan, dan soal latihan dibuat oleh Shirose Nihongo, bukan oleh JAEA.", "vocab": "vocab.json", "quiz": "quiz.json"}
    write_pack(slug, idx, babs, vocab, quiz)

def sample_sub(sid, n_id):
    return {"id": sid, "no": 99, "title": {"id": "Soal Contoh Resmi JAEA", "jp": "{特定技能評価試験|とくていぎのうひょうかしけん}サンプル{問題|もんだい}"}, "pages": [0, 0], "pagesJp": [0, 0],
            "full": {"id": [{"p": "Soal contoh resmi dari JAEA (satu halaman sampel per bidang). Latihannya ada di menu Kuis: 'Soal Contoh Resmi JAEA'."}]},
            "summary": {"id": {"core": "Soal contoh resmi JAEA (○×).", "points": [], "avoid": [], "exam": []}}}

def opt(t): return {"id": t, "jp": t}
def gh_sample():
    img = "./assets/ssw/aviation-gh/sample/sample-gh-p2.webp"
    its = []
    def tf(jp, idt, ans, ref, im=None):
        d = {"q": {"id": "Benar atau salah: “%s”" % idt, "jp": "○か×か。「%s」" % furi(jp)}, "opts": [{"id": "Benar (○)", "jp": "○ {正|ただ}しい"}, {"id": "Salah (×)", "jp": "× {間違|まちが}い"}], "a": 0 if ans else 1, "exp": {"id": "Kunci resmi JAEA."}, "mb": True, "ref": ref}
        if im: d["img"] = {"src": im}
        return d
    its += [tf("動いているジェット・エンジンの前方は危険である。", "Bagian depan mesin jet yang sedang berputar berbahaya.", True, "JAEA-GH-SAMPLE-Q1"),
            tf("ランプパス（標準IDカード）は、他人に貸してもよい。", "Ramp pass (kartu ID standar) boleh dipinjamkan ke orang lain.", False, "JAEA-GH-SAMPLE-Q2"),
            tf("航空機は大きさや形状のため、機敏な動きができない。", "Karena ukuran dan bentuknya, pesawat tidak bisa bergerak lincah.", True, "JAEA-GH-SAMPLE-Q3"),
            tf("“SAFETY INSTRUCTION”には、サービスに係わることが書いてある。", "'SAFETY INSTRUCTION' memuat hal-hal yang berkaitan dengan layanan.", False, "JAEA-GH-SAMPLE-Q4")]
    its.append({"q": {"id": "Jawablah nama maskapai (bahasa Inggris) yang tertera pada tag bagasi di gambar.", "jp": "{図|ず}１のタグが{付|つ}いた{手荷物|てにもつ}を{搭載|とうさい}する{航空会社名|こうくうがいしゃめい}を、{英語|えいご}で{答|こた}えなさい。"},
                "opts": [opt("JAPAN AIRLINES"), opt("ALL NIPPON AIRWAYS"), opt("PEACH"), opt("SKYMARK")], "a": 0, "exp": {"id": "Jawaban resmi: JAPAN AIRLINES (soal aslinya isian; pilihan ganda di sini disusun Shirose)."}, "img": {"src": img}, "ref": "JAEA-GH-SAMPLE-Q5"})
    its.append(tf("図２のタグが付いた貨物は、壊れやすい物が入っているので、注意して取り扱う。", "Kargo bertag pada gambar 2 berisi barang mudah pecah sehingga ditangani dengan hati-hati.", True, "JAEA-GH-SAMPLE-Q6", img))
    return {"id": "b1s99-q", "sub": "b1s99", "resmi": True, "title": {"id": "Soal Contoh Resmi JAEA (Ground Handling)", "jp": "サンプル{問題|もんだい}"}, "items": its}
def am_sample():
    def tf(jp, idt, ans, ref):
        return {"q": {"id": "Benar atau salah: “%s”" % idt, "jp": "○か×か。「%s」" % furi(jp)}, "opts": [{"id": "Benar (○)", "jp": "○ {正|ただ}しい"}, {"id": "Salah (×)", "jp": "× {間違|まちが}い"}], "a": 0 if ans else 1, "exp": {"id": "Kunci resmi JAEA."}, "mb": True, "ref": ref}
    return {"id": "b1s99-q", "sub": "b1s99", "resmi": True, "title": {"id": "Soal Contoh Resmi JAEA (Aircraft Maintenance)", "jp": "サンプル{問題|もんだい}"}, "items": [
        tf("空港のランプ内で作業する時、ライターを持っていても問題ない。", "Saat bekerja di ramp bandara, membawa korek api tidak masalah.", False, "JAEA-AM-SAMPLE-Q1"),
        tf("整備品質を良くすれば、事故やインシデントは減る。", "Jika kualitas perawatan baik, kecelakaan dan insiden berkurang.", True, "JAEA-AM-SAMPLE-Q2"),
        tf("スクリューは強度を必要としない場所に使う。", "Sekrup dipakai di tempat yang tidak membutuhkan kekuatan.", True, "JAEA-AM-SAMPLE-Q3"),
        tf("回路計は直流電流が計れる。", "Tester dapat mengukur arus DC.", True, "JAEA-AM-SAMPLE-Q4"),
        tf("航空機は、すべてのタイヤにブレーキが装備されている。", "Semua ban pesawat dilengkapi rem.", False, "JAEA-AM-SAMPLE-Q5")]}

if __name__ == "__main__":
    build("aviation-gh", "Ground Handling — Teks Resmi JAEA", "空港グランドハンドリング", GH, V.GH, Q.GH, "avgh", GH.SRC, 52, sample_sub("b1s99", ""), gh_sample() , "Soal contoh resmi JAEA disertakan.")
    build("aviation-am", "Aircraft Maintenance — Teks Resmi JAEA", "航空機整備", AM, V.AM, Q.AM, "avam", AM.SRC, 70, sample_sub("b1s99", ""), am_sample(), "Soal contoh resmi JAEA disertakan.")
