import os,sys,json
sys.path.insert(0,'tools')
slug=sys.argv[1]; os.environ['SSW_SL']=slug
import gen_ssw_livestock_quiz as g
g.SL=slug
r=g.build()
p=f'data/ssw/{slug}/quiz.json'
raw=open(p).read(); ind=1 if raw.startswith('{\n ') else None
q=json.loads(raw)
byid={s['id']:s for l in q['bab'].values() for s in l}
TARGET=10; added=0; rep=[]
for bab,sets in r.items():
    for ns in sets:
        ex=byid.get(ns['id'])
        if not ex: continue
        seen={(i['q'].get('id') or '') for i in ex['items']}
        for it in ns['items']:
            if len(ex['items'])>=TARGET: break
            k=it['q']['id']
            if k in seen: continue
            # skip generic core question to avoid noise
            if k.startswith('Pernyataan mana yang merupakan inti'): continue
            ex['items'].append(it); seen.add(k); added+=1
        rep.append((ns['id'],len(ex['items'])))
json.dump(q,open(p,'w'),ensure_ascii=False,indent=ind)
print(slug,'added',added,'min',min(n for _,n in rep),[x for x in rep if x[1]<8][:10])
