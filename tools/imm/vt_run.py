import sys,json,re,glob,pymupdf; sys.path.insert(0,'.')
import vt
UP="/mnt/user-data/uploads/Downloads/SHIROSE NIHONGO/"
R='/home/claude/shirose-nihongo.github.io/'
B=R+'ssw-materials/industrial-manufacturing/'
app={}
for f in glob.glob(R+'data/ssw/*/vocab.json'):
    d=json.load(open(f))
    for i in (d if isinstance(d,list) else d.get('items',[])):
        if i.get('kata') and i.get('arti'): app.setdefault(i['kata'],i)
cfg=[('','jaim_studyguide1_01.pdf','JAIM-SG1-01','machine-metal'),('electrical-electronic-assembly/','jaim_studyguide1_02.pdf','JAIM-SG1-02','elec-electronic'),('metal-surface-treatment/','jaim_studyguide1_03.pdf','JAIM-SG1-03','metal-surface')]
for sub,pdf,did,cat in cfg:
    doc=pymupdf.open(UP+pdf); cur=json.load(open(B+sub+'processed-materials/curriculum.json'))
    subs=[(u['pdf_page'],u['id']) for c in cur['chapters'] for s in c['sections'] for u in s['subsections']]
    def where(p):
        c=[i for pg,i in subs if pg<=p]; return c[-1] if c else ''
    raw=vt.terms(doc); merged={}
    for x in raw:
        t=x['term'].split('：')[-1]
        if t.endswith(('こと','もの','こ')) or 'マーク' in t or len(t)<2 or re.match(r'^[つをがはのに]',t): continue
        ruby=x['ruby'] if '：' not in x['term'] else x['ruby'][len(x['ruby'])//2:]
        m=merged.setdefault(t,dict(term=t,ruby=ruby,defs=[],pages=[]))
        m['defs'].append(x['defn'][:160]); m['pages'].append(x['page'])
        if not m['ruby'] and ruby: m['ruby']=ruby
    out=[]
    for n,(t,m) in enumerate(sorted(merged.items(),key=lambda kv:kv[1]['pages'][0]),1):
        a=app.get(t); p0=m['pages'][0]; ch=where(p0)
        out.append(dict(id=f'IMM-{cat}-G{n:04d}',japanese_term=t,kanji=t if re.search(r'[一-鿿]',t) else '',furigana=m['ruby'],furigana_note='ruby resmi hanya kanji; sebagian bisa tidak lengkap',indonesian_meaning=a['arti'] if a else '',meaning_source='vocab app yang sudah ada' if a else 'BELUM ADA — perlu diterjemahkan dari modul ID resmi',definition_ja=m['defs'][0],category='istilah definisi (〜とは)',chapter=ch.rsplit('-S',1)[0] if ch else '',subchapter=ch,source_document=did,source_page=p0,source_pages=m['pages'],image_ref='',exists_in_app_vocab=bool(a),validation_status='AUTO_EXTRACTED_NEEDS_REVIEW'))
    json.dump(out,open(B+sub+'vocabulary/glossary-terms.json','w'),ensure_ascii=False,indent=1)
    print(sub or 'mm',len(raw),len(out),sum(o['exists_in_app_vocab'] for o in out),[o['japanese_term'] for o in out][:8])
