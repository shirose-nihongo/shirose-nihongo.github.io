# -*- coding: utf-8 -*-
"""Soal bergambar auto-maintenance dari JICA イラスト集 (かいて おぼえる, hal. 38 = Gambar 2, versi tanpa label).
Butuh illust.pdf lokal (tidak di-commit): python3 -I tools/ssw/automaint_img.py <illust.pdf>"""
import json,sys,pymupdf
pdf=sys.argv[1]
d=pymupdf.open(pdf);pg=d[41];r=pg.rect
pg.get_pixmap(dpi=130,clip=pymupdf.Rect(40,60,r.width*0.55,r.height*0.8)).save("/tmp/fig02.png")
from PIL import Image
Image.open("/tmp/fig02.png").save("assets/ssw/auto-maintenance/fig/jica-fig02.webp",quality=85)
A=[("①","Katup hisap (インテーク・バルブ)",["Busi","Poros bubungan (camshaft)","Torak (piston)"],"インテーク・バルブ = katup yang memasukkan campuran udara-bahan bakar."),
("②","Katup buang (エキゾースト・バルブ)",["Katup hisap","Poros engkol","Silinder"],"エキゾースト・バルブ = katup untuk gas buang."),
("③","Campuran udara-bahan bakar (混合気)",["Gas buang","Oli mesin","Cairan pendingin"],"混合気 masuk saat langkah hisap."),
("④","Torak (ピストン)",["Silinder","Poros engkol","Katup buang"],"ピストン bergerak naik-turun di dalam silinder."),
("⑤","Silinder (シリンダ)",["Torak","Busi","Poros engkol"],"シリンダ = tabung tempat torak bergerak."),
("⑥","Poros engkol (クランクシャフト)",["Poros bubungan","Torak","Silinder"],"クランクシャフト mengubah gerak naik-turun torak menjadi putar.")]
items=[]
for i,(n,c,w,e) in enumerate(A):
    o=[c]+w;k=i%4;o=o[-k:]+o[:-k] if k else o
    items.append({"q":{"id":f"Pada gambar langkah hisap, bagian bernomor {n} adalah…"},"opts":[{"id":x} for x in o],"a":o.index(c),"exp":{"id":e+" (Sumber gambar: JICA, イラスト集)"},"img":{"src":"./assets/ssw/auto-maintenance/fig/jica-fig02.webp"}})
F="data/ssw/auto-maintenance/quiz.json";q=json.load(open(F,encoding="utf-8"))
if not any(g["id"]=="bab2-qimg" for g in q["bab"]["bab2"]):
    q["bab"]["bab2"].append({"id":"bab2-qimg","title":{"id":"Soal bergambar: langkah hisap mesin"},"items":items})
json.dump(q,open(F,"w",encoding="utf-8"),ensure_ascii=False,indent=1);print("ok")
