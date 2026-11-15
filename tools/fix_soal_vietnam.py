import json,re,glob,collections,os,shutil,sys
ACC=re.compile(r'[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]',re.I)
K={}
VT=set('tinh xoay treo giao quanh cung khinh nhau suy duy nghi xua hoan nhung gieo khua canh giam ngoan giai vung khay nhu danh phun khoe khoang ngang vun nho truy nguy oai lanh khoan khen xong thay tha phi huy phong coi can anh vai'.split())
def bad(t): return bool(ACC.search(t)) or bool(set(re.findall(r'[a-z]+',t.lower()))&VT)
for lv in ['n5','n4','n3','n2','n1','ir0','ir1','ir2']:
    for it in json.load(open(f'data/kanji-{lv}.json',encoding='utf8')): K.setdefault(it['k'],it['a'])
LINE=re.compile(r'^(.) — (.*?) \(on: (.*?); kun: (.*?); level (N\d)\)$')
# arti dalam kurung di ex.opsi: "Kanji 野 (arti...)"
OPSI=re.compile(r'((?<![\u3040-\u9fff])([\u4e00-\u9fff]) \()([^)]*)(\))')
n=0;changed=set()
for p in sorted(glob.glob('jlpt/n*/*.json')):
    raw=open(p,encoding='utf8').read()
    d=json.loads(raw)
    def fix(o):
        global n
        if isinstance(o,dict):
            for k,v in list(o.items()):
                if k=='kanji' and isinstance(v,list):
                    for i,l in enumerate(v):
                        m=LINE.match(l) if isinstance(l,str) else None
                        if m and m.group(1) in K and (bad(m.group(2)) or not m.group(2).strip()):
                            v[i]=f'{m.group(1)} — {K[m.group(1)]} (on: {m.group(3)}; kun: {m.group(4)}; level {m.group(5)})'; n+=1;changed.add(p)
                elif isinstance(v,list) and v and all(isinstance(x,str) for x in v) and k!='kanji':
                    for i,l in enumerate(v):
                        def r(m):
                            if m.group(2) in K and bad(m.group(3)): return m.group(1)+K[m.group(2)]+m.group(4)
                            return m.group(0)
                        nl=OPSI.sub(r,l)
                        if nl!=l: v[i]=nl;n+=1;changed.add(p)
                elif isinstance(v,str) and k not in('kanji',):
                    def r2(m):
                        if m.group(2) in K and bad(m.group(3)): return m.group(1)+K[m.group(2)]+m.group(4)
                        return m.group(0)
                    nv=OPSI.sub(r2,v)
                    if nv!=v: o[k]=nv;n+=1;changed.add(p)
                else: fix(v)
        elif isinstance(o,list):
            for x in o: fix(x)
    fix(d)
    if p in changed:
        b='backup/jlpt-soal-vietnam/'+p.replace('/','__')
        if not os.path.exists(b): shutil.copy(p,b)
        indent=None
        txt=json.dumps(d,ensure_ascii=False,indent=None if raw.count('\n')<3 else 1)
        open(p,'w',encoding='utf8').write(txt)
print('diubah',n,'string di',len(changed),'file')
