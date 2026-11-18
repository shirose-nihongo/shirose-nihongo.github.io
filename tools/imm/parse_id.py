import re, json, sys
sys.path.insert(0,'.')
import toc as T
FOOT=re.compile(r'^\s*▌')
def load(sg):
    t=open(f'{sg}_id.txt').read(); return T.split_pages(t)
def toc_for(pages):
    end=next(i for i,p in enumerate(pages) if re.search(r'Tabel 1-1',p))
    e=T.toc_entries(pages[1:end],max_pages=end)
    for x in e:
        if x['page'] is None:
            m=re.search(r'\s{2,}(\d+)\s*$',x['title'])
            if m: x['page']=int(m.group(1)); x['title']=x['title'][:m.start()].strip()
    return e,end
def clean_page(p):
    out=[];skip=0
    L=p.split('\n')
    for i,l in enumerate(L):
        if FOOT.match(l):
            m=re.search(r'▌[^\n]*?\s(\d{1,3})\s{2,}',l)
            out.append(('PAGE',int(m.group(1)) if m else None))
            skip=2; continue
        if skip and re.match(r'^\s{30,}\S',l): skip-=1; continue
        skip=0
        out.append(('L',l.rstrip()))
    return out
def body_stream(pages,start):
    stream=[]; pdfidx=[]
    last=None
    for pi in range(start,len(pages)):
        items=clean_page(pages[pi])
        pg=[v for k,v in items if k=='PAGE']
        printed=pg[0] if pg else None
        for k,v in items:
            if k=='L': stream.append((pi,printed,v))
    return stream
def split_sections(stream,entries):
    # sequentially find start line index for each entry
    starts=[];pos=0
    for e in entries:
        if e['level']==1: pat=re.compile(r'^\s*Bab\s+%d\b'%e['no'])
        elif e['level']==2: pat=re.compile(r'^\s*%s\.\s+%s'%(re.escape(str(e['no'])),re.escape(e['title'][:18])))
        else: pat=re.compile(r'^\s*%s\s+%s'%(re.escape(e['no']),re.escape(e['title'][:18])),re.I)
        found=None
        for i in range(pos,len(stream)):
            if pat.match(stream[i][2]) and not re.search(r'\.{5,}',stream[i][2]): found=i;break
        starts.append(found)
        if found is not None: pos=found+1
    return starts

def entry_texts(stream,entries,starts):
    res=[]
    for i,e in enumerate(entries):
        a=starts[i]; b=starts[i+1] if i+1<len(entries) else len(stream)
        seg=stream[a:b]
        res.append(seg)
    return res
SL=re.compile(r'^\s*Soal Latihan\s+(\d+)-(\d+)\s*$')
def parse_exercises(seg):
    lines=[x[2] for x in seg]; idx=[i for i,l in enumerate(lines) if SL.match(l)]
    if not idx: return list(seg),[]
    keep=list(seg[:idx[0]]); sets=[]
    for n,i in enumerate(idx):
        j=idx[n+1] if n+1<len(idx) else len(lines)
        block=lines[i+1:j]
        last=max([k for k,l in enumerate(block) if re.match(r'^\s*Jawaban\s*:',l)] or [len(block)-1])
        m=SL.match(lines[i])
        sets.append(dict(code=f'{m.group(1)}-{m.group(2)}',pdf=seg[i][0],printed=seg[i][1],raw=block[:last+1]))
        keep+= [(seg[i][0],seg[i][1],l) for l in block[last+1:]]
    return keep,sets
ITEM=re.compile(r'^\s*(?:(\d+)\)\s*)?\(\s*\)\s*(.*)$')
EXP=re.compile(r'^\s*(\d+)\)\s+(\S.*)$')
def parse_set(raw):
    # split instruction / items / explanations
    ins=[];items={};exps={};ans={}
    mode='ins';cur=None
    for l in raw:
        s=l.strip()
        if not s: continue
        if s=='Penjelasan': mode='exp';cur=None;continue
        if mode in('ins','items'):
            m=ITEM.match(l)
            if m: mode='items';cur=int(m.group(1) or 1);items[cur]=m.group(2).strip();continue
            if mode=='items' and cur: items[cur]+=' '+s
            else: ins.append(s)
        else:
            m=re.match(r'^\s*Jawaban\s*:\s*(\S+)',l)
            if m and (cur or len(items)==1): ans[cur or 1]=m.group(1);continue
            m=EXP.match(l)
            if m and (int(m.group(1)) in items) and (cur is None or int(m.group(1))>cur or int(m.group(1))==cur+1 or True) and not l.startswith('         ' * 3):
                cur=int(m.group(1));exps[cur]=m.group(2).strip();continue
            if cur: exps[cur]=exps.get(cur,'')+' '+s
            elif len(items)==1: cur=1; exps[1]=s
    return dict(instruction=' '.join(ins),items=items,explanations=exps,answers=ans)
