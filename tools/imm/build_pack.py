import json,re,os,shutil,sys
from PIL import Image
import pykakasi
KK=pykakasi.kakasi()
R='/home/claude/shirose-nihongo.github.io/'
IMM=R+'ssw-materials/industrial-manufacturing/'
CFG=[('','jaim-machine-metal','機械金属加工','Machine Metal — Buku Resmi JAIM','sg01'),('electrical-electronic-assembly/','jaim-elec-electronic','電気電子機器組立て','Elektrik & Elektronik — Buku Resmi JAIM','sg02'),('metal-surface-treatment/','jaim-metal-surface','金属表面処理','Perlakuan Permukaan Logam — Buku Resmi JAIM','sg03')]
KANJI=re.compile(r'[一-鿿々]+')
def rubyfy(jp,ruby):
    if not jp: return jp
    runs=KANJI.findall(jp)
    if len(runs)==1 and ruby and re.fullmatch(r'[぀-ゟー]+',ruby): return KANJI.sub(lambda m:'{%s|%s}'%(m.group(0),ruby),jp,1)
    return jp
def blocks(text,title):
    lines=[l.rstrip() for l in text.split('\n')]
    while lines and not lines[0].strip(): lines.pop(0)
    if lines and re.match(r'^\d+(\.\d+)*\.?\s',lines[0].strip()): lines.pop(0)
    out=[];cur=None;mode=None
    def flush():
        nonlocal cur,mode
        if cur is None: return
        if mode=='p': out.append({'p':re.sub(r'\s+',' ',' '.join(cur)).strip()})
        elif mode=='ul': out.append({'ul':[re.sub(r'\s+',' ',' '.join(x)).strip() for x in cur]})
        elif mode=='ol': out.append({'ol':[re.sub(r'\s+',' ',' '.join(x)).strip() for x in cur]})
        cur=None;mode=None
    for l in lines:
        s=l.strip()
        if not s: flush(); continue
        if re.match(r'^[•・●▪]\s*',s):
            t=re.sub(r'^[•・●▪]\s*','',s)
            if mode!='ul': flush(); cur=[];mode='ul'
            cur.append([t]); continue
        m=re.match(r'^(\d+)\)\s+(.*)',s)
        if m and not re.match(r'^\d+\)\s*\(',s):
            if mode!='ol': flush(); cur=[];mode='ol'
            cur.append([m.group(2)]); continue
        if mode in('ul','ol') and cur: cur[-1].append(s); continue
        if mode!='p': flush(); cur=[];mode='p'
        cur.append(s)
    flush()
    return [b for b in out if (b.get('p') or b.get('ul') or b.get('ol'))]
def kana_of(term,ruby):
    t=re.sub(r'[（(].*?[）)]','',term)
    if not KANJI.search(t): return t
    if ruby and re.fullmatch(r'[぀-ゟー]+',ruby) and KANJI.fullmatch(t): return ruby
    return ''.join(x['hira'] for x in KK.convert(t))
def romaji_of(t): return ' '.join(x['hepburn'] for x in KK.convert(re.sub(r'[（(].*?[）)]','',t)))
for sub,slug,jp,nama,sg in CFG:
    cur=json.load(open(IMM+sub+'processed-materials/curriculum.json'))
    oq=json.load(open(IMM+sub+'practice-tests/official-questions.json'))
    voc=json.load(open(IMM+sub+'vocabulary/vocabulary.json')); glo=json.load(open(IMM+sub+'vocabulary/glossary-terms.json'))
    samples=[]
    for f in ('official-sample-exam-2025.json','official-sample-exam-2go-2025.json'):
        p=IMM+sub+'practice-tests/'+f
        if os.path.exists(p): samples+=json.load(open(p))
    D=R+'data/ssw/'+slug+'/'; os.makedirs(D,exist_ok=True)
    total_pages=len(os.listdir(R+f'assets/ssw/{slug}/id'))
    import statistics
    OFF=int(statistics.median([int(u['pdf_page'])-int(u['page_start']) for c_ in cur['chapters'] for s_ in c_['sections'] for u in s_['subsections'] if u.get('pdf_page') and u.get('page_start')]))
    babs=[];idmap={};babfiles=[]
    for ci,ch in enumerate(cur['chapters'],1):
        units=[]
        for s in ch['sections']:
            if s['subsections']:
                for u in s['subsections']: units.append((u,s['id'],s.get('title_jp'),s.get('furigana_ruby')))
            else: units.append((s,s['id'],None,None))
        subs=[]
        for k,(u,secid,_,_) in enumerate(units,1):
            pg=int(u.get('pdf_page') or 0)
            if not pg:
                pg=int(u['page_start'])+OFF
            subs.append(dict(u=u,secid=secid,start=pg-1))
        for i,s in enumerate(subs):
            s['end']=(subs[i+1]['start']-1 if i+1<len(subs) else min(total_pages-1,(int(cur['chapters'][ci]['page_start'])+OFF-2) if ci<len(cur['chapters']) else total_pages-1))
            if s['end']<s['start']: s['end']=s['start']
        bid=f'bab{ci}'; out=[]
        for k,s in enumerate(subs,1):
            u=s['u']; sid=f'b{ci}s{k}'; idmap[u['id']]=sid; idmap.setdefault(s['secid'],sid)
            bl=blocks(u.get('text_id',''),u['title_id'])
            paras=[b['p'] for b in bl if 'p' in b]
            pts=[(x if len(x)<90 else x[:87]+'…') for b in bl if 'ul' in b for x in b['ul']][:6]
            core=(paras[0] if paras else (pts[0] if pts else u['title_id']))[:320]
            sub_o=dict(id=sid,no=k,title=dict(id=u['title_id'],jp=rubyfy(u.get('title_jp') or '',u.get('furigana_ruby') or '') or u['title_id']),pages=[s['start'],s['end']],full=dict(id=bl or [{'p':'(Teks bagian ini ada di halaman buku.)'}]),summary=dict(id=dict(core=core,points=pts)))
            out.append(sub_o)
        babo=dict(schema=1,bidang=slug,source='JAIM (一般社団法人 工業製品製造業技能評価機構) — 製造分野特定技能1号評価試験 学習用テキスト / Buku Referensi Pembelajaran, kategori '+jp+' (versi Indonesia & Jepang resmi). Teks = hasil ekstraksi otomatis dari buku resmi, belum direview manual.',markup='Teks JP memakai {kanji|furigana} untuk ruby.',bab=dict(id=bid,no=ci,title=dict(id=ch['title_id'],jp=ch.get('title_jp') or ch['title_id']),intro=dict(id=f'Bab {ci} buku resmi JAIM.'),pages=[out[0]['pages'][0],out[-1]['pages'][1]] if out else [0,0],subs=out))
        json.dump(babo,open(D+f'{bid}.json','w'),ensure_ascii=False,indent=1); babfiles.append(dict(id=bid,file=f'{bid}.json'))
    # sample sub in bab1
    b1=json.load(open(D+'bab1.json'))
    if samples:
        b1['bab']['subs'].append(dict(id='b1s99',no=99,title=dict(id='Soal Ujian Contoh Resmi JAIM 2025',jp='2025年度 試験問題（サンプル）'),pages=[0,0],full=dict(id=[{'p':'Soal ujian contoh resmi dari JAIM (tahun 2025), dalam bahasa Jepang, lengkap dengan kunci jawaban resmi. Kerjakan di tab Kuis pada sub-bab ini.'},{'note':'Soal 1号: 30 soal benar/salah + 10 soal pilihan ganda; soal 2号 実技: 30 soal pilihan ganda. Beberapa soal bergantung pada gambar di halaman PDF contoh (ditampilkan di atas soal).'}]),summary=dict(id=dict(core='Soal ujian contoh resmi JAIM 2025 (JP) untuk latihan format CBT.',points=[]))))
        json.dump(b1,open(D+'bab1.json','w'),ensure_ascii=False,indent=1)
    # quiz
    quiz={'bab':{},'tema':[]}
    by={}
    for q in oq:
        sid=idmap.get(q['subchapter']) or idmap.get(q['chapter'])
        if not sid: print('UNMAPPED',q['question_id'],q['subchapter'],q['chapter']); continue
        by.setdefault(sid,[]).append(q)
    for bab in babfiles:
        b=json.load(open(D+bab['file']))['bab']; sets=[]
        for sub_ in b['subs']:
            its=[]
            for q in by.get(sub_['id'],[]):
                if q['question_type']=='true_false_ab':
                    it=dict(q=dict(id=q['question']),opts=[dict(id='Benar (○)'),dict(id='Salah (×)')],a=0 if q['answer_key']=='A' else 1,exp=dict(id=q['explanation'] or 'Lihat penjelasan resmi di buku.'),mb=True)
                else:
                    opts=[re.sub(r'^[A-D]\.\s*','',o) for o in q['options']]
                    if len(opts)<2: continue
                    qt=q['question'] if q['question_type']!='classification_ab' else 'Berkaitan dengan 5S atau tidak? — '+q['question']
                    it=dict(q=dict(id=qt),opts=[dict(id=o) for o in opts],a='ABCD'.index(q['answer_key']),exp=dict(id=q['explanation'] or 'Lihat penjelasan resmi di buku.'))
                    if q['question_type']=='classification_ab': it['mb']=True
                it['ref']=q['question_id']; its.append(it)
            if sub_['id']=='b1s99':
                for q in samples:
                    img=None
                    if q.get('image_ref'):
                        src=IMM+sub+q['image_ref']; dst=R+f'assets/ssw/{slug}/sample/'+os.path.basename(q['image_ref']).replace('.png','.webp'); os.makedirs(os.path.dirname(dst),exist_ok=True)
                        if not os.path.exists(dst): Image.open(src).convert('RGB').save(dst,'WEBP',quality=60)
                        img=dict(src='./'+dst.split(R)[1])
                    if q['question_type']=='true_false_ab': it=dict(q=dict(id=q['question']),opts=[dict(id='Benar (○)'),dict(id='Salah (×)')],a=0 if q['answer_key']=='A' else 1,exp=dict(id='Kunci resmi JAIM.'),mb=True)
                    else:
                        opts=[re.sub(r'^[A-D]\.\s*','',o) for o in q['options']] if q['options'] else list('ABCD')
                        it=dict(q=dict(id=q['question']),opts=[dict(id=o) for o in opts],a='ABCD'.index(q['answer_key']),exp=dict(id='Kunci resmi JAIM.'))
                    if img: it['img']=img
                    it['ref']=q['question_id']; its.append(it)
            if its: sets.append(dict(id=f"{sub_['id']}-q",sub=sub_['id'],title=sub_['title'],resmi=True,items=its))
        quiz['bab'][bab['id']]=sets
    json.dump(quiz,open(D+'quiz.json','w'),ensure_ascii=False,indent=1)
    # vocab
    items=[];seen=set();n=0
    def add(kata,ruby,arti,cat,ch,subid,src_note):
        global n
        kata=re.sub(r'とは$','',kata.strip())
        if not kata or kata in seen or not arti: return
        seen.add(kata); n+=1
        ci=int(re.search(r'-C(\d+)',ch).group(1)) if ch else 1
        items.append(dict(id=f'{slug}-{n:03d}',kata=kata,kana=kana_of(kata,ruby),romaji=romaji_of(kata),arti=arti,cat=cat,bab=f'bab{ci}',src=[idmap.get(subid,'')] if idmap.get(subid) else []))
    for g in glo: add(g['japanese_term'],g['furigana'],g['indonesian_meaning'],'Istilah resmi (definisi buku)',g['chapter'],g['subchapter'],'')
    for v in voc: add(v['japanese_term'],v['furigana'],v['indonesian_meaning'],'Judul sub-bab',v['chapter'],v['subchapter'],'')
    json.dump({'items':items},open(D+'vocab.json','w'),ensure_ascii=False,indent=1)
    idx=dict(slug=slug,nama=nama,jp=jp,pages=dict(id=total_pages,jp=len(os.listdir(R+f'assets/ssw/{slug}/jp'))),bab=babfiles,vocab='vocab.json',quiz='quiz.json')
    json.dump(idx,open(D+'index.json','w'),ensure_ascii=False,indent=1)
    print(slug,'bab',len(babfiles),'subs',sum(len(json.load(open(D+b['file']))['bab']['subs']) for b in babfiles),'quizsets',sum(len(v) for v in quiz['bab'].values()),'qitems',sum(len(s['items']) for v in quiz['bab'].values() for s in v),'vocab',len(items))
