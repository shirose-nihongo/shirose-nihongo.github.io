"""Furigana statis berbasis kamus (tanpa pykakasi) untuk bank soal mensetsu BARU. Kamus = bacaan dari 8 bidang lama (jf/ajf) + tools/mensetsu_furi_extra.py.
Format 漢字[かんじ]. Jalankan: python3 tools/gen_mensetsu_furi_dict.py [--cek]  (--cek hanya mencetak kata yang belum ada di kamus)."""
import json,re,glob,sys,os
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
M=R+'/data/mensetsu'
LAMA=['accommodation','agriculture','building_cleaning','construction','food_manufacturing','food_service','kaigo','livestock']
KAN='㐀-鿿々'
D={}
for b in LAMA:
    for s in json.load(open(f'{M}/{b}.json'))['soal']:
        for t in [s.get('jf',''),s.get('ajf','')]+[x.get('jf','') for x in s.get('f',[])]:
            for m in re.finditer(r'(['+KAN+r']+)\[([^\]]+)\]',t): D.setdefault(m.group(1),m.group(2))
sys.path.insert(0,R+'/tools')
from mensetsu_furi_extra import EXTRA
D.update(EXTRA)
KEYS=sorted(D,key=len,reverse=True)
SAFE1=set('一二三四五六七八九十百千万円日月年時分回間人中後前目度何今毎本朝夜')
def seg(run):
    # DP: segmentasi terpendek (jumlah potongan paling sedikit)
    n=len(run); best=[None]*(n+1); best[0]=[]
    for i in range(n):
        if best[i] is None: continue
        for k in KEYS:
            if run.startswith(k,i) and (len(k)>1 or k in SAFE1 or i+len(k)==n):
                j=i+len(k)
                if best[j] is None or len(best[i])+1<len(best[j]): best[j]=best[i]+[k]
    return best[n]
MISS=set()
CTX=[(r'島\[とう\]が','島[しま]が'),(r'足\[た\]([をの])',r'足[あし]\1'),(r'変\[か\]な','変[へん]な'),(r'出\[で\]([しさ])',r'出[だ]\1'),(r'入\[い\]([らりるっ])',r'入[はい]\1'),(r'来\[き\]な','来[こ]な'),(r'何\[なん\]([にをかがもは])',r'何[なに]\1')]
def strip(s): return re.sub(r'\[[^\]]*\]','',s)
def furi(t):
    return _furi(t)
def _furi(t):
    def rep(m):
        run=m.group(0)
        if run in D: return f'{run}[{D[run]}]'
        p=seg(run)
        if p is None: MISS.add(run); return run
        return f'{run}['+''.join(D[x] for x in p)+']'
    r=re.sub('['+KAN+']+',rep,t)
    for a,b in CTX: r=re.sub(a,b,r)
    return r
if __name__=='__main__':
    for p in sorted(glob.glob(M+'/*.json')):
        b=os.path.basename(p)[:-5]
        if b=='index' or b in LAMA: continue
        raw=open(p,encoding='utf8').read(); d=json.loads(raw)
        for q in d['soal']:
            if not (q.get('jf') and strip(q['jf'])==q['ja']): q['jf']=furi(q['ja'])
            if not (q.get('ajf') and strip(q['ajf'])==q['aj']): q['ajf']=furi(q['aj'])
        if '--cek' in sys.argv: continue
        open(p,'w',encoding='utf8').write(json.dumps(d,ensure_ascii=False,indent=1)); print(p)
    print('BELUM ADA:',sorted(MISS))
