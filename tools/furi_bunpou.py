"""Furigana statis untuk data bunpou JLPT + teks Perubahan Kata Kerja (kk-forms.json).
Format 漢字[かんじ] (sama dengan bunpou JFT & furiHtml). Butuh: pip install fugashi unidic-lite
Jalankan: python3 tools/furi_bunpou.py   (idempotent: bagian yang sudah ber-[..] tidak diubah)"""
import json,re,sys
import fugashi
T=fugashi.Tagger()
KAN=r'㐀-鿿々'
KANRE=re.compile(f'[{KAN}]')
SPAN=re.compile(f'[{KAN}]+\\[[^\\]]+\\]')
FIX={"私[わたくし]":"私[わたし]","日本[にっぽん]":"日本[にほん]","言[ゆ]":"言[い]","今[こん]大阪":"今[いま]大阪","家[か]に":"家[いえ]に",
     "〜的[まと]":"〜的[てき]","込[ご]":"込[こ]","米[べい]から":"米[こめ]から","明日[あす]":"明日[あした]","日[にち]中[ちゅう]":"日[にち]中[じゅう]",
     "世界[せかい]中[ちゅう]":"世界[せかい]中[じゅう]","町[ちょう]中[ちゅう]":"町[まち]中[じゅう]","中[ちゅう]を":"中[じゅう]を",
     "形[がた]":"形[けい]","形[かたち]":"形[けい]","一[いち] 人[にん]だけ":"一人[ひとり]だけ","一[いち] 人[にん]も":"一人[ひとり]も","一[いち] 人[にん]で":"一人[ひとり]で","一[いち] 人[にん]の":"一人[ひとり]の"}
import re as _re
def post(s):
    for a,b in FIX.items(): s=s.replace(a,b)
    s=_re.sub(r'(曜\[[^\]]+\])日\[ひ\]',r'\1日[び]',s)
    s=_re.sub(r'間\[ま\](?!に合|にか|博士)','間[あいだ]',s)
    s=s.replace('風[かぜ]','風[ふう]').replace('風[ふう]が吹','風[かぜ]が吹').replace('風[ふう]もだいぶ','風[かぜ]もだいぶ')
    return s
def k2h(x): return ''.join(chr(ord(c)-0x60) if 'ァ'<=c<='ヶ' else c for c in x)
def align(o,h):
    parts=re.findall(f'[{KAN}]+|[^{KAN}]+',o)
    rx='^'+''.join('(.+?)' if KANRE.match(p) else re.escape(k2h(p)) for p in parts)+'$'
    m=re.match(rx,h)
    if not m: return f"{o}[{h}]"
    g=list(m.groups()); gi=0; res=[]
    for p in parts:
        if KANRE.match(p): res.append(f"{p}[{g[gi]}]"); gi+=1
        else: res.append(p)
    return ''.join(res)
def plain(t):
    if not KANRE.search(t): return t
    out=[]; pos=0
    for w in T(t):
        s=w.surface; i=t.find(s,pos)
        if i<0: continue
        out.append(t[pos:i]); pos=i+len(s)
        r=getattr(w.feature,'kana',None)
        out.append(align(s,k2h(r)) if KANRE.search(s) and r and r!='*' else s)
    out.append(t[pos:]); return ''.join(out)
def furi(t):
    if not isinstance(t,str) or not KANRE.search(t): return t
    res=[]; pos=0
    for m in SPAN.finditer(t):
        res.append(plain(t[pos:m.start()])); res.append(m.group(0)); pos=m.end()
    res.append(plain(t[pos:])); s=''.join(res)
    return post(s)
def walk(o):
    if isinstance(o,str): return furi(o)
    if isinstance(o,list): return [walk(x) for x in o]
    if isinstance(o,dict): return {k:walk(v) for k,v in o.items()}
    return o
STYLES=[dict(ensure_ascii=False,indent=0),dict(ensure_ascii=False,separators=(',',':')),dict(ensure_ascii=False),dict(ensure_ascii=False,indent=1),dict(ensure_ascii=False,indent=2)]
def dump_like(raw,d):
    for st in STYLES:
        if json.dumps(json.loads(raw),**st) in (raw,raw.rstrip('\n')): return json.dumps(d,**st)+('\n' if raw.endswith('\n') else '')
    raise SystemExit('gaya JSON tidak dikenali')
