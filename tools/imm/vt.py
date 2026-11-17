import pymupdf,re,sys,json
def lines(pg):
    raw=pg.get_text('rawdict'); L=[];R=[]
    for b in raw['blocks']:
        for l in b.get('lines',[]):
            chars=[c for s in l['spans'] for c in s['chars']]
            sz=max((s['size'] for s in l['spans']),default=0)
            if not chars: continue
            if sz<9: R.append(dict(t=''.join(c['c'] for c in chars),b=l['bbox']))
            else: L.append(dict(chars=chars,b=l['bbox'],sz=sz))
    L.sort(key=lambda q:(round(q['b'][1]/4),q['b'][0])); M=[]
    for l in sorted(L,key=lambda q:(q['b'][1],q['b'][0])):
        if M and abs(M[-1]['b'][1]-l['b'][1])<5 and l['b'][0]>=M[-1]['b'][0]-1: M[-1]['chars']+=l['chars']; M[-1]['b']=(M[-1]['b'][0],min(M[-1]['b'][1],l['b'][1]),max(M[-1]['b'][2],l['b'][2]),max(M[-1]['b'][3],l['b'][3]))
        else: M.append(dict(chars=list(l['chars']),b=tuple(l['b']),sz=l['sz']))
    return M,R
def terms(doc):
    out=[]
    for pi,pg in enumerate(doc):
        L,R=lines(pg)
        for l in L:
            txt=''.join(c['c'] for c in l['chars'])
            for m in re.finditer(r'([^、。「」（）()\s・]{1,18}?)とは[、,]',txt):
                term=m.group(1); s=m.start(1); e=m.end(1)
                if not re.search(r'[一-鿿゠-ヿ]',term) or len(term)<2: continue
                x0=l['chars'][s]['bbox'][0]; x1=l['chars'][e-1]['bbox'][2]; y0=l['b'][1]
                rb=[r for r in R if y0-14<=r['b'][3]<=y0+3 and r['b'][2]>x0-1 and r['b'][0]<x1+1]
                rb.sort(key=lambda r:r['b'][0])
                rest=txt[m.end():]
                out.append(dict(term=term,ruby=''.join(r['t'] for r in rb),defn=(txt[m.start():]),page=pi+1))
    return out
if __name__=='__main__':
    d=pymupdf.open("/mnt/user-data/uploads/Downloads/SHIROSE NIHONGO/jaim_studyguide1_01.pdf")
    t=terms(d); print(len(t))
    for x in t[:25]: print(x['page'],x['term'],x['ruby'],'|',x['defn'][:40])
