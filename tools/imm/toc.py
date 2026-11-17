import re
def split_pages(txt): return txt.split('\f')
def toc_entries(pages, max_pages=12):
    """parse the Indonesian TOC (first pages). returns list of dict(level, no, title, page)"""
    lines=[]
    for p in pages[:max_pages]:
        for l in p.split('\n'):
            if 'Ujian Evaluasi Pekerja' in l: continue
            lines.append(l.rstrip())
    out=[]; cur=None
    pat_bab=re.compile(r'^\s*Bab\s+(\d+)\s+(\S.*?)(?:\s{2,}(\d+))?\s*$')
    pat_sec=re.compile(r'^\s*(\d+)\.\s{2,}(\S.*?)\s*(?:\.{3,}\s*(\d+))?\s*$')
    pat_sub=re.compile(r'^\s*(\d+)\.(\d+)\s{2,}(\S.*?)\s*(?:\.{3,}\s*(\d+))?\s*$')
    pat_cont=re.compile(r'^\s{10,}(\S.*?)\s*(?:\.{3,}\s*(\d+))?\s*$')
    for l in lines:
        if not l.strip(): continue
        m=pat_bab.match(l)
        if m and not re.match(r'^\s*Bab\s+\d+\s*$',l):
            cur=dict(level=1,no=int(m.group(1)),title=m.group(2).strip(),page=int(m.group(3)) if m.group(3) else None); out.append(cur); continue
        m=pat_sub.match(l)
        if m:
            cur=dict(level=3,no=f"{m.group(1)}.{m.group(2)}",title=re.sub(r'\.{3,}.*','',m.group(3)).strip(),page=int(m.group(4)) if m.group(4) else None); out.append(cur); continue
        m=pat_sec.match(l)
        if m:
            cur=dict(level=2,no=m.group(1),title=re.sub(r'\.{3,}.*','',m.group(2)).strip(),page=int(m.group(3)) if m.group(3) else None); out.append(cur); continue
        m=pat_cont.match(l)
        if m and cur is not None:
            if cur['page'] is None:
                cur['title']+=' '+re.sub(r'\.{3,}.*','',m.group(1)).strip(); 
                if m.group(2): cur['page']=int(m.group(2))
    return out
