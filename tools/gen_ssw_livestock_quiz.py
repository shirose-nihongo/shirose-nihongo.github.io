import json,re,random,sys
sys.path.insert(0,'tools')
random.seed(7)
import os,glob
SL=os.environ.get('SSW_SL','livestock')
EXPAND=os.environ.get('SSW_EXPAND')=='1'
UNITS=r'(kg|gram|g|hari|bulan|minggu|tahun|jam|menit|%|persen|ekor|℃|derajat|cm|meter|m|liter|butir|kali|hari|kandang|kilogram)'
NUM=re.compile(r'(?<![\d.,/\-–])(\d{1,4})\s?'+UNITS+r'\b(?![\d])')
def subs():
    out=[]
    for f in sorted(glob.glob(f'data/ssw/{SL}/bab*.json'),key=lambda x:int(re.findall(r'bab(\d+)',x)[0])):
        b=json.load(open(f));bb=b.get('bab',b)
        out+= [(os.path.basename(f)[:-5],s) for s in bb['subs']]
    return out
def sents(s):
    res=[]
    for blk in s['full']['id']:
        ts=[blk['p']] if blk.get('p') else (blk.get('ul') or [])
        ts=[x for x in ts if isinstance(x,str)]
        if not ts: continue
        for t in ts:
          t=re.sub(r'\s+',' ',t)
          for x in re.split(r'(?<=[.;])\s+(?=[A-Z①-⑩（(])',t):
              x=x.strip()
              if x.endswith(('.','。')) and not re.search(r'(seperti|yaitu|antara lain|berikut|adalah|dan)\s*[.]$',x): res.append(x)
    return res
def distract(v,unit):
    v=int(v); c=set()
    for f in (0.5,2,1.5,3,0.25,0.75,4,5,10):
        d=int(round(v*f)) if v>1 else int(v*f+1)
        if d!=v and d>0: c.add(d)
    if v<=6:
        for k in (1,2,3): 
            c.add(v+k)
            if v-k>0: c.add(v-k)
    import math
    lst=sorted(c,key=lambda d:abs(math.log(d/v)))
    # drop near-duplicates of the true value (within 15%) when v>6
    if v>6: lst=[d for d in lst if abs(d-v)/v>=0.2]
    # prefer plausible magnitudes: closest ratios
    return lst
ANT=[('meningkat','menurun'),('naik','turun'),('tinggi','rendah'),('banyak','sedikit'),('panjang','pendek'),('besar','kecil'),('sebelum','sesudah'),('cepat','lambat'),('kering','basah'),('panas','dingin'),('bertambah','berkurang'),('lebih tinggi','lebih rendah'),('lebih banyak','lebih sedikit'),('siang hari','malam hari'),('mudah','sulit')]
ANTM={}
for a,b in ANT: ANTM[a]=b; ANTM[b]=a
ANTRE=re.compile(r'\b('+'|'.join(sorted(ANTM,key=len,reverse=True))+r')\b')
def flip(t):
    ms=list(ANTRE.finditer(t))
    if len(ms)!=1: return None
    m=ms[0]; w=m.group(1); r=ANTM[w]
    return t[:m.start()]+r+t[m.end():]
TERMS={}
TP=re.compile(r'\b(adalah|yaitu|disebut)\s+([^.,;:()]{4,42}?)(?=\s*[.,;)]|$)')
def collect_terms(all_s):
    for bab,s in all_s:
        L=[]
        for t in sents(s):
            if not (50<=len(t)<=260) or re.search(r'\d|Gambar|hal\.',t): continue
            m=TP.search(t)
            if not m: continue
            ans=m.group(2).strip()
            if len(ans.split())>6 or ans.lower().startswith(('sebagai','untuk','dengan','pada','di ','dari','salah','sebuah')): continue
            stem=t[:m.start(2)]+'＿＿＿'+t[m.end(2):]
            L.append((stem,ans,t))
        TERMS[s['id']]=L
def build():
    all_s=subs(); res={}
    collect_terms(all_s)
    cores={s['id']:(s.get('summary',{}).get('id',{}).get('core') or '') for _,s in all_s}
    for bab,s in all_s:
        items=[]
        for t in sents(s):
            if not (45<=len(t)<=330): continue
            ms=list(NUM.finditer(t))
            if len(ms)!=1: continue
            if re.search(r'(19|20)\d\d|Februari|Januari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember|hal\.|halaman|Gambar',t): continue
            m=ms[0]; v=m.group(1); unit=m.group(2)
            if re.search(r'\d',t[:m.start()][-3:]) : continue
            ds=distract(v,unit)
            if len(ds)<3: continue
            # choose 3 distractors spread
            pick=[ds[0],ds[2] if len(ds)>2 else ds[1],ds[4] if len(ds)>4 else ds[3]]
            opts=[f'{v} {unit}']+[f'{d} {unit}' for d in pick]
            if len(set(opts))<4: continue
            stem=t[:m.start()]+'＿＿＿'+t[m.end():]
            idx=len(items)
            items.append((stem,opts,t))
        random.shuffle(items)
        items=items[:7]
        out=[]
        # term-cloze: after 'adalah' / 'yaitu' / 'disebut'
        terms=TERMS.get(s['id'],[])
        random.shuffle(terms)
        for stem,ans,t in terms:
            if len(items)+0>=8: break
            pool=[a for k,l in TERMS.items() if k!=s['id'] for _,a,_ in l if abs(len(a)-len(ans))<=max(8,len(ans)//2) and a.lower()!=ans.lower() and a not in ans and ans not in a]
            pool=list(dict.fromkeys(pool))
            if len(pool)<3: continue
            d=random.sample(pool,3)
            items.append((stem,[ans]+d,t))
        for stem,opts,t in items:
            a=random.randrange(4); o=opts[1:]; random.shuffle(o)
            o.insert(a,opts[0])
            out.append({'q':{'id':'Lengkapi sesuai teks: “'+stem+'”','jp':'{本文|ほんぶん}に{合|あ}うものを{選|えら}んでください。'},
              'opts':[{'id':x} for x in o],'a':a,
              'exp':{'id':'Sesuai teks subbab: “'+t+'”','jp':'{本文|ほんぶん}のとおりです。'}})
        # benar/salah by antonym flip
        tf=[]
        for t in sents(s):
            if not (50<=len(t)<=230) or re.search(r'\d|Gambar|hal\.|＿',t): continue
            f=flip(t)
            if f: tf.append((t,f))
        random.shuffle(tf)
        need=max(0,9-len(items)-len(out))
        for i,(t,f) in enumerate(tf[:min(need,6)]):
            true=(i%2==0); stmt=t if true else f
            out.append({'q':{'id':'Benar atau salah (sesuai teks): “'+stmt+'”','jp':'{本文|ほんぶん}の{内容|ないよう}に{合|あ}っていますか。'},
              'opts':[{'id':'Benar (○)','jp':'○ {正|ただ}しい'},{'id':'Salah (×)','jp':'× {間違|まちが}い'}],'a':0 if true else 1,
              'exp':{'id':('Benar sesuai teks.' if true else 'Salah. Menurut teks: “'+t+'”'),'jp':'{本文|ほんぶん}をたしかめましょう。'},'mb':True})
        # core question
        others=[c for k,c in cores.items() if k!=s['id'] and c.strip().endswith('.')]
        if others and cores[s['id']].strip().endswith('.') and len(cores[s['id']])<260:
            d=random.sample(others,3); a=random.randrange(4); o=d[:]; o.insert(a,cores[s['id']])
            out.insert(0,{'q':{'id':'Pernyataan mana yang merupakan inti dari subbab “'+s['title']['id']+'”?','jp':'この{項目|こうもく}の{要点|ようてん}はどれですか。'},
              'opts':[{'id':x} for x in o],'a':a,'exp':{'id':'Inti subbab: '+cores[s['id']],'jp':'{要点|ようてん}をたしかめましょう。'}})
        from ssw_livestock_manual import M
        for (qq,ok,wr,ex) in M.get(s['id'],[]):
            a=random.randrange(4); o=wr[:]; o.insert(a,ok)
            out.append({'q':{'id':qq,'jp':'{正|ただ}しいものを{選|えら}んでください。'},'opts':[{'id':x} for x in o],'a':a,'exp':{'id':ex,'jp':'{本文|ほんぶん}をたしかめましょう。'}})
        res.setdefault(bab,[]).append({'id':s['id']+'-q','sub':s['id'],
          'title':{'id':f"Subbab {s['title']['id']}",'jp':s['title']['jp']},'items':out})
    return res
if __name__=='__main__':
    r=build()
    q=json.load(open(f'data/ssw/{SL}/quiz.json'))
    for bab,sets in r.items():
        q['bab'][bab]=[x for x in q['bab'][bab] if not x['id'].endswith('-q') or x.get('sub') is None]+[] if False else [x for x in q['bab'][bab] if not x['id'].endswith('-q')]
        q['bab'][bab]=sets+q['bab'][bab]
    for bab,sets in r.items():
        for s in sets: print(s['sub'],len(s['items']))
    json.dump(q,open(f'data/ssw/{SL}/quiz.json','w'),ensure_ascii=False,indent=1)
