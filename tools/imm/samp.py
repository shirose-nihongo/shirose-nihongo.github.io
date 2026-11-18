import pymupdf,re,sys
def page_text(pg):
    items=[]
    for b in pg.get_text('dict')['blocks']:
        for l in b.get('lines',[]):
            sp=[s for s in l['spans'] if s['size']>=8.5 and s['text'].strip()!='']
            if not sp: continue
            items.append((round(l['bbox'][1]),l['bbox'][0],''.join(s['text'] for s in sp)))
    items.sort(); rows=[]
    for y,x,t in items:
        if rows and abs(rows[-1][0]-y)<5: rows[-1][1].append((x,t))
        else: rows.append([y,[(x,t)]])
    return [''.join(t for x,t in sorted(r[1])).strip() for r in rows]
def doc_lines(path):
    d=pymupdf.open(path); out=[]
    for i,pg in enumerate(d):
        for l in page_text(pg): out.append((i+1,l))
    return out
if __name__=='__main__':
    L=doc_lines(sys.argv[1])
    for p,l in L:
        if p in [int(x) for x in sys.argv[2:]]: print(p,l)
