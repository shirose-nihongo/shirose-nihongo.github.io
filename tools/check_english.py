"""Cek sisa bahasa Inggris / Vietnam di arti kanji & kosakata. Exit 1 jika ada. Butuh: pip install wordfreq"""
import json,re,sys
from wordfreq import zipf_frequency as z
KEEP=set('tempura sashimi kabuki sumo haiku bonsai washi stretching ramen sushi mode timer pad tv sms ac neet jlpt kimono manga anime karaoke noh fugu torii sake whisky wiper stapler spatula planetarium shinto narita ueno haneda ginza sendai akita aikido oolong teriyaki miso futon kola dermatitis maple go lift gim kobe hue dragon ball star wars queen menu set pop rock golf worcestershire final transit stop foil roman cap bush clover roller coaster interior hagi stempel aluminium golden week an cover'.split())
def en(w):
    w=w.lower()
    if w in KEEP: return False
    e,i=z(w,'en'),z(w,'id'); return e>i+0.3 and e>=3.0
bad=[]
for lv in ['n5','n4','n3','n2','n1','ir0','ir1','ir2']:
  for kind in ['kanji','kosakata']:
    f=f'data/{kind}-{lv}.json'
    for it in json.load(open(f,encoding='utf8')):
        v=[it.get('arti'),it.get('a')]+[c['a'] for c in it.get('c',[])]
        for s in v:
            if not isinstance(s,str): continue
            ws=re.findall(r"[A-Za-z']{2,}",s)
            ne=sum(en(w) for w in ws)
            if ne and ne>=len(ws)/2: bad.append(f"{f}: {s[:60]}")
print(f"{len(bad)} arti berbahasa Inggris")
for b in bad[:20]: print(' ',b)
sys.exit(1 if bad else 0)
