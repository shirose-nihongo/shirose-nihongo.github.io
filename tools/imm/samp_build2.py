import sys,re,json,unicodedata,os,pymupdf; sys.path.insert(0,'.')
import samp
UP="/mnt/user-data/uploads/Downloads/SHIROSE NIHONGO/"
R='/home/claude/shirose-nihongo.github.io/ssw-materials/industrial-manufacturing/'
N=lambda s:unicodedata.normalize('NFKC',s)
cfg1=[('sample1_01','','機械金属加工','JAIM-SAMPLE1-01','machine-metal'),('sample1_02','electrical-electronic-assembly/','電気電子機器組立て','JAIM-SAMPLE1-02','elec-electronic'),('sample1_03','metal-surface-treatment/','金属表面処理','JAIM-SAMPLE1-03','metal-surface')]
cfg2=[('sample2_01','','機械金属加工','JAIM-SAMPLE2-01','machine-metal'),('sample2_02','electrical-electronic-assembly/','電気電子機器組立て','JAIM-SAMPLE2-02','elec-electronic'),('sample2_03','metal-surface-treatment/','金属表面処理','JAIM-SAMPLE2-03','metal-surface')]
G2=os.environ.get('GOU')=='2'
cfg=cfg2 if G2 else cfg1
TAG='SAMPLE2' if G2 else 'SAMPLE1'; OUT='official-sample-exam-2go-2025.json' if G2 else 'official-sample-exam-2025.json'; IMD='sample2' if G2 else 'sample1'
for fn,sub,jp,did,cat in cfg:
    path=UP+f'jaim_{fn}.pdf'; doc=pymupdf.open(path)
    L=samp.doc_lines(path)
    # answer key: last pages
    key={}
    for i in range(len(doc)-3,len(doc)):
        t=N(doc[i].get_text())
        for m in re.finditer(r'問題\s*(\d+)\s*\n?\s*([A-D])\b',t): key[int(m.group(1))]=m.group(2)
    # questions
    qs={};cur=None;cn=None
    keypages={i+1 for i in range(len(doc)) if len(re.findall(r'問題\s*\d+\s*\n?\s*[A-D]\b',N(doc[i].get_text())))>=8}
    for p,l in L:
        if p in keypages: continue
        l2=N(l)
        m=re.match(r'^問題\s*(\d+)\s*(.*)$',l2)
        if m:
            ds=m.group(1); ex=str((max(qs) if qs else 0)+1)
            if ds!=ex and ds.startswith(ex) and len(ds)>len(ex) and ex in [str(k) for k in range(1,41)]:
                m=re.match(r'^問題\s*(\d+)\s*(.*)$',l2[:0]+'問題'+ex+' '+ds[len(ex):]+m.group(2))
        if m and int(m.group(1))>=1 and not re.match(r'^から|^\d+から',m.group(2).strip()) and 'から問題' not in l2[:12]:
            cn=int(m.group(1)); rest=m.group(2)
            if cn>40: rest=str(cn%10)+rest; cn=cn//10; m=re.match(r'^(.*)$',rest)
            if cn in qs and qs[cn]['page']!=p and len(qs[cn]['lines'])>2: cur=None; continue
            qs[cn]=dict(page=p,lines=[m.group(1) if cn>0 and m.re.groups==1 else m.group(2)]);cur=cn;continue
        if cur and not re.match(r'^\d+$',l2) and not re.search(r'区分\s*学科|区分\s*実技',l2): qs[cur]['lines'].append(l2)
    items=[]
    os.makedirs(R+sub+'extracted-images/'+IMD+'/',exist_ok=True)
    pagesimg=set()
    for n in sorted(qs):
        if n not in key: continue
        q=qs[n]; txt=' '.join(q['lines']); opts=re.findall(r'([A-D])\s*[．.]\s*([^A-D]*?)(?=\s+[A-D]\s*[．.]|$)',txt)
        stem=re.split(r'選択肢\s*$|選択肢(?=\s*[A-D]\s*[．.])',txt)[0].strip()
        stem=re.sub(r'\s*選択肢\s*[A-D]\s*[．.].*$','',txt).strip() if opts else txt.strip()
        needs_img=bool(re.search(r'図|写真|グラフ|表|マーク|記号|ヒストグラム',txt)) or (opts and all(not o[1].strip() for o in opts))
        ref=None
        if needs_img:
            ref=f'extracted-images/{IMD}/{fn}-p{q["page"]}.png'; pagesimg.add(q['page'])
        ab = (not G2) and n<=30 and not opts
        items.append(dict(question_id=f'IMM-{cat}-{TAG}-Q{n:02d}',sector='工業製品製造業',category=jp,chapter='',subchapter='',question=stem,options=(['A (正しい)','B (間違っている)'] if ab else [f'{a}. {b.strip()}' for a,b in opts]),answer_key=key[n],explanation='',competency='実技試験' if G2 or n>30 else '学科試験',difficulty='',reference=f'{did} p.{q["page"]}',question_type='true_false_ab' if ab else 'multiple_choice_4',label='OFFICIAL QUESTION',image_ref=ref,language='ja',validation_status='AUTO_EXTRACTED_NEEDS_REVIEW'))
    for p in pagesimg: doc[p-1].get_pixmap(dpi=100).save(R+sub+f'extracted-images/{IMD}/{fn}-p{p}.png')
    os.makedirs(R+sub+'practice-tests',exist_ok=True)
    json.dump(items,open(R+sub+'practice-tests/'+OUT,'w'),ensure_ascii=False,indent=1)
    miss=[n for n in range(1,(31 if G2 else 41)) if n not in {i['question_id'][-2:] and int(i['question_id'][-2:]) for i in items}]
    print(fn,len(items),'keys',len(key),'missing',miss,'imgpages',len(pagesimg),'4choice w/o 4 opts',[i['question_id'][-2:] for i in items if i['question_type']=='multiple_choice_4' and len(i['options'])!=4])
