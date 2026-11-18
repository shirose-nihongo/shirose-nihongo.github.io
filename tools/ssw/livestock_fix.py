# -*- coding: utf-8 -*-
"""Kosakata livestock: entri 'kata' berbahasa Indonesia (dari glosarium buku versi ID) dipetakan ke istilah Jepangnya (畜産用語).
Entri yang istilah Jepangnya sudah ada -> definisi Indonesia dipindah ke entri Jepang itu; sisanya diubah di tempat (id tetap)."""
import json, sys, os, re, random
sys.path.insert(0, os.path.dirname(__file__))
import pykakasi
from bidang_lib import vocab_quiz
K = pykakasi.kakasi()
P = "data/ssw/livestock/"
V = json.load(open(P + "vocab.json")); v = V["items"]
Q = json.load(open(P + "quiz.json"))
MAP = {0:"飼料|しりょう",27:"飼料|しりょう",40:"飼料|しりょう",1:"給餌|きゅうじ",28:"給餌|きゅうじ",41:"給餌|きゅうじ",2:"選び食い|えらびぐい",3:"黄色ブドウ球菌|おうしょくぶどうきゅうきん",4:"乾物摂取量|かんぶつせっしゅりょう",5:"牛群検定|ぎゅうぐんけんてい",6:"食い止まり|くいどまり",31:"食い止まり|くいどまり",7:"空胎日数|くうたいにっすう",8:"クローズアップ期|クローズアップき",9:"口蹄疫|こうていえき",10:"敷料|しきりょう",33:"敷料|しきりょう",11:"初乳|しょにゅう",34:"初乳|しょにゅう",12:"人工授精|じんこうじゅせい",13:"ストレス|ストレス",14:"第四胃変位|だいよんいへんい",15:"蹄病|ていびょう",16:"受精卵移植|じゅせいらんいしょく",17:"発情|はつじょう",18:"反芻|はんすう",19:"ブツ|ぶつ",20:"分娩|ぶんべん",21:"分娩間隔|ぶんべんかんかく",22:"哺育|ほいく",23:"ボディコンディションスコア|ボディコンディションスコア",24:"メガファーム|メガファーム",25:"可消化養分総量|かしょうかようぶんそうりょう",26:"ウェットフィーディング|ウェットフィーディング",29:"餌付け|えづけ",44:"餌付け|えづけ",30:"オガクズ豚舎|オガクズとんしゃ",32:"三元豚|さんげんとん",35:"人工乳|じんこうにゅう",36:"豚繁殖・呼吸障害症候群|ぶたはんしょく・こきゅうしょうがいしょうこうぐん",37:"豚流行性下痢|ぶたりゅうこうせいげり",38:"SPF豚|エスピーエフぶた",39:"育雛|いくすう",42:"食い込み|くいこみ",43:"餌ならし|えならし",45:"換羽|かんう",46:"共食い|ともぐい",47:"保温|ほおん",48:"グリット|グリット",49:"実用鶏|じつようけい",50:"地鶏|じどり",51:"断嘴|だんし",52:"ペックオーダー|ペックオーダー",53:"過密飼育|かみつしいく"}
# istilah Indonesia lama -> disimpan di 'arti' agar pencarian Indonesia tetap menemukan
byk = {x["kata"]: x for x in v if x.get("cat") != "Istilah peternakan"}
out, seen = [], set()
n0 = len(v)
for i, x in enumerate(v):
    if x.get("cat") != "Istilah peternakan": out.append(x); continue
    jp, kn = MAP[i].split("|")
    d = x["arti"]; indo = x["kata"]
    if jp in byk or jp in seen:
        tgt = byk.get(jp) or next(o for o in out if o["kata"] == jp)
        if len(d) > len(tgt["arti"]) + 3 and indo.lower() not in tgt["arti"].lower(): tgt["arti"] = d
        continue
    seen.add(jp)
    x["kata"] = jp; x["kana"] = kn; x["romaji"] = "".join(t["hepburn"] for t in K.convert(kn)).replace(" ", "")
    x["arti"] = ("%s: %s" % (indo, d)) if indo.lower() not in d.lower() and len(d) < 150 else d
    if re.search(r"[一-鿿]", jp): x["rb"] = ["%s|%s" % (jp, kn)] if kn != jp else []
    x["cat"] = "Istilah Jepang"
    out.append(x)
V["items"] = out
json.dump(V, open(P + "vocab.json", "w"), ensure_ascii=False, indent=1)
words = [x for x in out if x["cat"] in ("Istilah Jepang",) and x["kata"] != x["kana"] or x["cat"] == "Istilah Jepang"]
Q["tema"] = [vocab_quiz("tema-istilah1", {"id": "Istilah peternakan (A)", "jp": "{畜産用語|ちくさんようご}"}, words, 5, 10), vocab_quiz("tema-istilah2", {"id": "Istilah peternakan (B)", "jp": "{畜産用語|ちくさんようご}"}, words, 6, 10)]
json.dump(Q, open(P + "quiz.json", "w"), ensure_ascii=False, indent=1)
print(n0, "->", len(out), "kosakata;", len(words), "istilah Jepang untuk soal tema")
