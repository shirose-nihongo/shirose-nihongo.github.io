import sys,re,json,os,glob; sys.path.insert(0,'.')
import parse_id as P, build_imm as B, pymupdf
import os
SG,PDF,SUB,CAT,DOC,CATJP=os.environ['SG'],os.environ['PDF'],os.environ['SUB'],os.environ['CAT'],os.environ['DOC'],os.environ['CATJP']
R='/home/claude/shirose-nihongo.github.io/ssw-materials/industrial-manufacturing/'+SUB+'/'
for d in ['processed-materials','vocabulary','flashcards','practice-tests','extracted-images','extracted-text','source-metadata']: os.makedirs(R+d,exist_ok=True)
SEC='IMM'
pages=P.load(SG); e,end=P.toc_for(pages)
st=P.body_stream(pages,end); s=P.split_sections(st,e); tx=P.entry_texts(st,e,s)
doc=pymupdf.open(B.UP+PDF)
# chapter JP titles from footers
chjp={}
for pi in range(8,len(doc)):
    for q in B.jp_lines(doc[pi])[0]:
        m=re.match(r'^第\s*(\d+)\s*章\s*(.+)$',q['t'])
        if m and q['b'][1]>770: chjp.setdefault(int(m.group(1)),m.group(2).strip())
chjp[1]=chjp.get(1,'試験の概要と学習方法'); chjp.update({10:'電気機器、成形、塗装、包装、アルミ圧延、押出製品製造'} if SG=='sg01' else {})
OV={('sg01',10):'Peralatan Listrik, Pembentukan Plastik, Pengecatan, Pengemasan, Pengerolan Aluminium, dan Pembuatan Produk Ekstrusi',('sg02',5):'Aturan Perundang-undangan dan Standar Kelistrikan',('sg02',12):'Inspeksi, Pemeliharaan, Pengemasan, dan Pembentukan'}
for x in e:
    if x['level']==1 and (SG,x['no']) in OV: x['title']=OV[(SG,x['no'])]
chapters=[];cur_ch=cur_se=None;vocab=[];oq=[];open_ex=[];vid=0
def clean(seg):
    L=[x[2].rstrip() for x in seg]; txt='\n'.join(L); return re.sub(r'\n{3,}','\n\n',txt).strip()
def handle_sets(sets,ch_id,sub_id,holder):
    for S in sets:
        r=P.parse_set(S['raw']); code=S['code']
        base=dict(source_document=DOC,source_page=S['printed'],set_code=code,sector='工業製品製造業',category=CATJP,chapter=ch_id,subchapter=sub_id,instruction=r['instruction'])
        if r['items'] and set(r['items'])==set(r['answers']):
            for k in sorted(r['items']):
                a=r['answers'][k]
                oq.append(dict(question_id=f'{SEC}-{CAT}-OQ-{code}-{k:02d}',**base,question=r['items'][k],options=['A (Benar / 正)','B (Salah / 誤)'] if 'benar' in r['instruction'].lower() else [],answer_key=a,explanation=r['explanations'].get(k,''),competency='学科 (pengetahuan)',difficulty='dasar',reference=f'{DOC} p.{S["printed"]}',question_type='true_false_ab' if 'benar' in r['instruction'].lower() else 'other',label='OFFICIAL QUESTION',validation_status='AUTO_EXTRACTED_NEEDS_REVIEW'))
            holder.append(code)
        else:
            open_ex.append(dict(set_code=code,**{k:base[k] for k in('sector','category','chapter','subchapter','source_document','source_page')},raw_text=' '.join(l.strip() for l in S['raw'] if l.strip()),label='OFFICIAL QUESTION',note='Format terbuka/ilustrasi/tabel — belum bisa dijadikan pilihan ganda otomatis; perlu review manual',validation_status='NEEDS_MANUAL_STRUCTURING'))

for i,x in enumerate(e):
    pdfidx=st[s[i]][0]; printed=st[s[i]][1]
    if x['level']==1:
        cur_ch=dict(id=f'{SEC}-{CAT}-C{int(x["no"]):02d}',no=int(x['no']),title_id=x['title'],title_jp=chjp.get(int(x['no'])),page_start=x['page'],sections=[]);chapters.append(cur_ch);cur_se=None;continue
    if x['level']==2:
        cur_se=dict(id=f'{cur_ch["id"]}-S{int(x["no"]):02d}',no=x['no'],title_id=x['title'],page_start=x['page'],subsections=[])
        h=B.jp_heading(doc,pdfidx,x)
        if h: cur_se.update(title_jp=h['jp'],furigana_ruby=h['ruby'])
        keep2,sets2=P.parse_exercises(tx[i]); cur_se['exercise_sets']=[]
        handle_sets(sets2,cur_ch['id'],cur_se['id'],cur_se['exercise_sets'])
        cur_se['text_id']=clean(keep2) if not any(e[j]['level']==3 for j in range(i+1,min(i+2,len(e)))) else ''
        cur_ch['sections'].append(cur_se);continue
    # level 3 (or level2 w/o chapter)
    keep,sets=P.parse_exercises(tx[i])
    sub=dict(id=f'{cur_se["id"]}-U{x["no"].split(".")[-1].zfill(2)}',no=x['no'],title_id=x['title'],page_start=x['page'],pdf_page=pdfidx+1)
    h=B.jp_heading(doc,pdfidx,x)
    if h: sub.update(title_jp=h['jp'],furigana_ruby=h['ruby'])
    sub['text_id']=clean(keep); sub['exercise_sets']=[]
    handle_sets(sets,cur_ch['id'],sub['id'],sub['exercise_sets'])
    cur_se['subsections'].append(sub)
    if sub.get('title_jp'):
        vid+=1
        vocab.append(dict(id=f'{SEC}-{CAT}-V{vid:04d}',japanese_term=sub['title_jp'],kanji=sub['title_jp'] if re.search(r'[一-鿿]',sub['title_jp']) else '',furigana=sub.get('furigana_ruby',''),furigana_note='ruby resmi hanya untuk kanji (okurigana/partikel tidak termasuk)',indonesian_meaning=sub['title_id'],definition='',category='istilah judul sub-bab',chapter=cur_ch['id'],subchapter=sub['id'],source_document=DOC,source_page=sub['page_start'],image_ref='',validation_status='AUTO_EXTRACTED_NEEDS_REVIEW'))
# images per pdf page
imgdir=R+'extracted-images/'; nimg=0; imgref={}
for ch in chapters:
    for se in ch['sections']:
        for sub in se['subsections']:
            pg=doc[sub['pdf_page']-1]; refs=[]
            for k,im in enumerate(pg.get_images(full=True)):
                try:
                    pm=pymupdf.Pixmap(doc,im[0])
                    if pm.width<120 or pm.height<80: continue
                    if pm.n>=5: pm=pymupdf.Pixmap(pymupdf.csRGB,pm)
                    fn=f'{sub["id"]}-p{sub["pdf_page"]}-{k}.png'; pm.save(imgdir+fn); refs.append('extracted-images/'+fn); nimg+=1
                except Exception: pass
            sub['images']=refs
# write
def W(p,o): json.dump(o,open(R+p,'w'),ensure_ascii=False,indent=1)
W('processed-materials/curriculum.json',dict(sector='工業製品製造業',category=CATJP,source=DOC,language='id+ja',chapters=chapters,note='Teks penjelasan = teks resmi modul JAIM (versi Indonesia). Tujuan belajar, kesalahan umum & ringkasan TIDAK ada di modul → tidak dibuat.'))
W('vocabulary/vocabulary.json',vocab)
W('flashcards/flashcards.json',[dict(id=v['id'].replace('-V','-F'),vocab_id=v['id'],front=v['japanese_term'],reading=v['furigana'],back=v['indonesian_meaning'],chapter=v['chapter'],subchapter=v['subchapter'],source=v['source_document'],source_page=v['source_page']) for v in vocab])
W('practice-tests/official-questions.json',oq)
W('practice-tests/official-open-format-exercises.json',open_ex)
print(SG,'chapters',len(chapters),'sections',sum(len(c['sections']) for c in chapters),'subs',sum(len(se['subsections']) for c in chapters for se in c['sections']),'vocab',len(vocab),'oq',len(oq),'open',len(open_ex),'imgs',nimg,chjp)
