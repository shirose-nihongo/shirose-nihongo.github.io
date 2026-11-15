import json,re,glob,collections,sys
from wordfreq import zipf_frequency as z
def tok_en(w):
    w=w.lower()
    if len(w)<3: return None
    e,i=z(w,'en'),z(w,'id')
    if e>=2.3 and i<=e-1.2: return True
    if i>=2.3 and e<=i-1.2: return False
    return None
def score(s):
    ws=re.findall(r"[A-Za-z]+",s)
    r=[tok_en(w) for w in ws]; en=sum(1 for x in r if x is True); idn=sum(1 for x in r if x is False)
    return en,idn
def is_en(s):
    if re.search(r'[぀-鿿]',s) and len(re.findall(r"[A-Za-z]+",s))<3: return False
    en,idn=score(s); return en>=1 and en>=idn
if __name__=='__main__':
    pat=sys.argv[1:] or ['data/*.json']
    fld=collections.Counter();ex={}
    def walk(o,f,p):
        if isinstance(o,dict):
            for k,v in o.items(): walk(v,f,p+'.'+k)
        elif isinstance(o,list):
            for v in o: walk(v,f,p+'[]')
        elif isinstance(o,str) and is_en(o):
            fld[(f,p)]+=1; ex.setdefault((f,p),[]).append(o[:90])
    for g in pat:
        for f in glob.glob(g):
            try: walk(json.load(open(f,encoding='utf8')),f,'')
            except Exception as e: pass
    for k,v in sorted(fld.items(),key=lambda x:-x[1])[:40]: print(v,k,ex[k][:3])
    print('total',sum(fld.values()))
