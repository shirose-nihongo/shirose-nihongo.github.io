"""Hasilkan furigana statis (tanpa AI) untuk bank soal mensetsu: q.jf (pertanyaan), q.ajf (contoh jawaban), f[].jf (tanya lanjutan).
Format: 漢字[かんじ] (sama dengan furiHtml di mensetsu-prep.js). Jalankan: python3 tools/gen_mensetsu_furi.py  (butuh pykakasi)."""
import json,re,glob,sys
import pykakasi
K=pykakasi.kakasi()
FIX={"小[ちー]さい":"小[ちい]さい","ジャワ島[しま]":"ジャワ島[とう]","日本[にっぽん]":"日本[にほん]","今日[こんにち]":"今日[きょう]","大人[だいにん]":"大人[おとな]","一日[いちにち]":"一日[いちにち]"}
KAN=re.compile(r'[㐀-鿿々]')
def _kata2hira(x): return ''.join(chr(ord(c)-0x60) if 'ァ'<=c<='ヶ' else c for c in x)
def _tok(o,h):
    """Selaraskan satu token: tiap rangkaian kanji mendapat bacaannya sendiri, kana di antaranya dibiarkan."""
    parts=re.findall(r'[㐀-鿿々]+|[^㐀-鿿々]+',o)
    rx='^'+''.join('(.+?)' if KAN.match(p_) else re.escape(_kata2hira(p_)) for p_ in parts)+'$'
    m=re.match(rx,h)
    if not m: return f"{o}[{h}]"   # cadangan: seluruh token
    g=list(m.groups()); res=[]; gi=0
    for p_ in parts:
        if KAN.match(p_): res.append(f"{p_}[{g[gi]}]"); gi+=1
        else: res.append(p_)
    return ''.join(res)
def furi(t):
    out=[]
    for it in K.convert(t):
        o,h=it['orig'],it['hira']
        out.append(_tok(o,h) if KAN.search(o) and h else o)
    s=''.join(out)
    for a,b in FIX.items(): s=s.replace(a,b)
    return s
if __name__=="__main__":
    for p in sorted(glob.glob('data/mensetsu/*.json')):
        if p.endswith('index.json'): continue
        raw=open(p,encoding='utf8').read(); d=json.loads(raw)
        for q in d['soal']:
            q['jf']=furi(q['ja']); q['ajf']=furi(q['aj'])
            for x in q.get('f',[]): x['jf']=furi(x['ja'])
        for st in [dict(ensure_ascii=False,separators=(',',':')),dict(ensure_ascii=False),dict(ensure_ascii=False,indent=1),dict(ensure_ascii=False,indent=2)]:
            if json.dumps(json.loads(raw),**st) in (raw,raw.rstrip('\n')): break
        else: sys.exit('gaya '+p)
        open(p,'w',encoding='utf8').write(json.dumps(d,**st)+('\n' if raw.endswith('\n') else ''))
        print(p,len(d['soal']))
