import sys,re,json,hashlib; sys.path.insert(0,'.')
import parse_id as P, pymupdf
UP="/mnt/user-data/uploads/Downloads/SHIROSE NIHONGO/"
def jp_lines(pg):
    out=[]
    raw=pg.get_text('rawdict'); rubies=[];bases=[]
    for b in raw['blocks']:
        for l in b.get('lines',[]):
            txt=''.join(c['c'] for s in l['spans'] for c in s['chars']).strip()
            if not txt: continue
            sz=max(s['size'] for s in l['spans']); x0,y0,x1,y1=l['bbox']
            (rubies if sz<9 else bases).append(dict(t=txt,sz=sz,b=(x0,y0,x1,y1)))
    return bases,rubies
def ruby_for(base,rubies):
    x0,y0,x1,y1=base['b']
    r=[q for q in rubies if q['b'][3]<=y0+6 and q['b'][3]>=y0-14 and q['b'][2]>x0-1 and q['b'][0]<x1+1]
    r.sort(key=lambda q:q['b'][0]); return ''.join(q['t'] for q in r)
def rows(doc,pi,minsz):
    bases,rub=jp_lines(doc[pi]); bs=[q for q in bases if q['sz']>=minsz and q['b'][1]<770]
    bs.sort(key=lambda q:(round(q['b'][1]/4),q['b'][0])); out=[]
    for q in bs:
        if out and abs(out[-1]['y']-q['b'][1])<4: out[-1]['ch'].append(q)
        else: out.append(dict(y=q['b'][1],ch=[q]))
    res=[]
    for r in out:
        t=''.join(c['t'] for c in r['ch']); x0=min(c['b'][0] for c in r['ch']); x1=max(c['b'][2] for c in r['ch'])
        y0=min(c['b'][1] for c in r['ch'])
        rb=[q for q in rub if y0-14<=q['b'][3]<=y0+3 and q['b'][2]>x0-1 and q['b'][0]<x1+1]
        rb.sort(key=lambda q:q['b'][0])
        res.append(dict(t=t,ruby=''.join(q['t'] for q in rb),sz=max(c['sz'] for c in r['ch'])))
    return res
def jp_heading(doc,pdfidx,e):
    for pi in (pdfidx,pdfidx+1,pdfidx-1):
        if not 0<=pi<len(doc): continue
        for r in rows(doc,pi,13):
            t=re.sub(r'\s+',' ',r['t'])
            if e['level']==2: ok=re.match(r'^%s\.\s*\S'%re.escape(str(e['no'])),t)
            elif e['level']==3: ok=re.match(r'^%s\s*\S'%re.escape(str(e['no'])),t)
            else: ok=False
            if ok:
                t=re.sub(r'^[\d.]+\s*','',t); return dict(jp=t,ruby=r['ruby'],page_pdf=pi)
    return None
if __name__=='__main__':
    pages=P.load('sg01'); e,end=P.toc_for(pages)
    st=P.body_stream(pages,end); s=P.split_sections(st,e)
    doc=pymupdf.open(UP+'jaim_studyguide1_01.pdf')
    hit=0
    for i,x in enumerate(e):
        h=jp_heading(doc,st[s[i]][0],x)
        if h: hit+=1
        if i<10 or not h and i<60: print(x['level'],x['no'],x['title'][:30],'|',h)
    print(hit,len(e))
