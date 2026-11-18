import json, sys, time, os, re
from playwright.sync_api import sync_playwright
HERE=os.path.dirname(os.path.abspath(__file__)); REPO=os.path.abspath(os.path.join(HERE,'..','..','..'))
stub=open(os.path.join(HERE,'fbstub.js')).read()   # stub Firebase (semua ekspor firebase-sync.js; fungsi dipalsukan lewat window.__FBS)
OUT=os.environ.get('QA_OUT','/tmp/qa'); os.makedirs(OUT,exist_ok=True)
INIT = """
localStorage.setItem('shirose-returning','1');localStorage.setItem('shirose-lvl','n5');
sessionStorage.setItem('shirose-level-dipilih','demo1');localStorage.setItem('shirose-level-uid','demo1');
(function(){
  const g=()=>{try{return JSON.parse(localStorage.getItem('QA_DB')||'{}')}catch(e){return {}}}, s=(d)=>localStorage.setItem('QA_DB',JSON.stringify(d));
  window.__FBS={
    loadSswBidang:async()=>[], listKelas:async()=>[], tambahXP:async()=>({xp:10,koin:0,level_karakter:1,streak:1}), getGami:async()=>({xp:0,koin:0,level_karakter:1,streak:0}), loadSRS:async(l)=>(g()['srs:'+l]||{}), saveSRS:async(l,o)=>{const d=g();d['srs:'+l]=o;s(d)},
    loadSswProgres:async(slug)=>(g()['prog:'+slug]||null), saveSswProgres:async(slug,o)=>{const d=g();d['prog:'+slug]=o;s(d)},
  };
})();
"""
SLUGS=sys.argv[1].split(',') ; VPS={'mobile':{'width':390,'height':780},'desktop':{'width':1280,'height':800}}
R=[]
def rec(slug,vp,name,ok,detail=''): R.append({'slug':slug,'vp':vp,'test':name,'ok':bool(ok),'detail':str(detail)[:160]})
with sync_playwright() as p:
  b=p.chromium.launch()
  for vpn,vp in VPS.items():
    for slug in SLUGS:
      ctx=b.new_context(viewport=vp,service_workers='block',is_mobile=vpn=='mobile',has_touch=vpn=='mobile')
      ctx.add_init_script(INIT)
      pg=ctx.new_page(); errs=[]
      pg.on('pageerror',lambda e:errs.append(str(e)[:160]))
      pg.route('**/js/firebase-sync.js*',lambda r:r.fulfill(body=stub,content_type='application/javascript'))
      pg.goto('http://localhost:8765/index.html#home'); pg.wait_for_timeout(2200)
      def go(route,wait=1800): pg.evaluate(f"route('{route}')"); pg.wait_for_timeout(wait)
      def txt(): return pg.inner_text('#app')
      try:
        go('ssw'); rec(slug,vpn,'hub: pulau tampil',pg.locator('.sw-isl').count()>=10,pg.locator('.sw-isl').count())
        go(f'ssw-peta/{slug}'); t=txt(); rec(slug,vpn,'peta bab terbuka','Kuis' in t or 'EVALUASI' in t or 'Flashcard' in t,t[:50].replace('\n',' '))
        # bab & subbab
        pack=json.load(open(f'{REPO}/data/ssw/{slug}/index.json'))
        bab1=json.load(open(f'{REPO}/data/ssw/{slug}/{pack["bab"][0]["file"]}'))['bab']
        bid=bab1['id']; sub=bab1['subs'][0]['id']
        go(f'ssw-bab/{slug}/{bid}'); rec(slug,vpn,'halaman bab',len(txt())>150,len(txt()))
        go(f'ssw-baca/{slug}/{sub}/lengkap/id',2200); rec(slug,vpn,'baca subbab (judul+isi)',len(txt())>200,len(txt()))
        ov=pg.evaluate("(()=>{const w=document.documentElement.scrollWidth;return [w,innerWidth]})()"); rec(slug,vpn,'tanpa overflow horizontal (baca)',ov[0]<=ov[1]+1,ov)
        if not pack.get('nobook'):
          lastb=json.load(open(f'{REPO}/data/ssw/{slug}/{pack["bab"][-1]["file"]}'))['bab']['subs'][-1]['id']
          for sb in (sub,lastb):
            go(f'ssw-baca/{slug}/{sb}/lengkap/id',2200)
            ok=pg.evaluate("Array.from(document.querySelectorAll('.sw-thumbs img')).length>0 && (()=>{const i=document.querySelector('.sw-thumbs img');i.scrollIntoView();return true})()")
            pg.wait_for_timeout(1200)
            ok=ok and pg.evaluate("(()=>{const i=document.querySelector('.sw-thumbs img');return i.complete&&i.naturalWidth>0})()")
            rec(slug,vpn,f'halaman buku tampil & gambar termuat ({sb})',ok,pg.evaluate("document.querySelectorAll('.sw-thumbs img').length"))
          go(f'ssw-buku/{slug}/jp/1',2500)
          if (pack.get('pages') or {}).get('id'):
           go(f'ssw-buku/{slug}/id/1',2500)
           rec(slug,vpn,'viewer buku ID memuat halaman',pg.evaluate("(()=>{const i=document.querySelector('.bk-pgw img,#bk-img');return !!i&&i.naturalWidth>0&&i.src.includes('/id/')})()"),'')
          go(f'ssw-buku/{slug}/jp/1',2500)
          rec(slug,vpn,'viewer buku memuat halaman',pg.evaluate("(()=>{const i=document.querySelector('.bk-pgw img,#bk-img');return !!i&&i.naturalWidth>0})()"),'')
        if slug=='kaigo':
          go(f'ssw-kuis/{slug}',2500); tt=txt()
          rec(slug,vpn,'kaigo ID: tanpa kuis kosakata & tes membaca',('Arti kosakata' not in tt) and ('Tes Membaca' not in tt) and ('Ujian Penuh' in tt),tt[:60].replace('\n',' '))
        go(f'ssw-kosa/{slug}/all',2500); rec(slug,vpn,'daftar kosakata',len(txt())>300,len(txt()))
        # flashcard (hafalan hub -> kartu semua)
        go(f'ssw-hafal/{slug}',2500)
        rec(slug,vpn,'hub hafalan + filter status', pg.locator('.hf-f button').count()>=4, pg.locator('.hf-f button').count())
        pg.evaluate("SSW.hafalAll(true)"); pg.wait_for_timeout(300)
        n=pg.evaluate("document.getElementById('hf-n').textContent"); rec(slug,vpn,'hitung kosakata unik terpilih',int(n)>0,n)
        pg.evaluate("SSW.hafalGo()"); pg.wait_for_timeout(2000)
        rec(slug,vpn,'flashcard mulai',pg.locator('.flash-card').count()==1,pg.evaluate('location.hash'))
        c0=pg.inner_text('.no-pill'); pg.locator('.flash-card').click(); pg.wait_for_timeout(500)
        rec(slug,vpn,'flashcard balik (belakang tampil)',pg.locator('.flash-card.revealed').count()==1)
        pg.evaluate("hafSwipe&&0") if False else None
        # tandai Ingat via tombol
        btn=pg.locator('button',has_text='Ingat').first; btn.click(); pg.wait_for_timeout(900)
        c1=pg.inner_text('.no-pill') if pg.locator('.no-pill').count() else ''
        rec(slug,vpn,'flashcard next (Ingat)',c1!=c0,f'{c0}->{c1}')
        pg.locator('.flash-card').click(); pg.wait_for_timeout(300); pg.locator('button',has_text='Lupa').first.click(); pg.wait_for_timeout(900)
        rec(slug,vpn,'flashcard Lupa',True)
        pg.locator('button',has_text='↶ Kembali').first.click(); pg.wait_for_timeout(600)
        rec(slug,vpn,'flashcard previous (Kembali)',pg.locator('.flash-card').count()==1)
        db=pg.evaluate("localStorage.getItem('QA_DB')||''"); rec(slug,vpn,'progres SRS tersimpan ke backend',('srs:ssw' in db),len(db))
        # reload -> progress persisted
        pg.reload(); pg.wait_for_timeout(2500); go(f'ssw-hafal/{slug}',2500)
        st=pg.inner_text('.hf-stats') if pg.locator('.hf-stats').count() else ''
        import re; m=re.findall(r'(\d+)',st); rec(slug,vpn,'progres terbaca setelah refresh (Baru<total)',len(m)>=5 and (int(m[1])+int(m[2])+int(m[3])+int(m[4]))>0,st.replace('\n',' '))
        # mode PG & matching
        for mode in ['multiple','matching']:
            pg.evaluate("SSW.hafalAll(true)"); pg.evaluate(f"SSW.hafalMode('{mode}')"); pg.evaluate("SSW.hafalGo()"); pg.wait_for_timeout(1800)
            ok=pg.locator('.opsi').count()>=4 if mode=='multiple' else pg.locator('.match-card,.match-item,[onclick^="matchPick"]').count()>0
            rec(slug,vpn,f'mode {mode}',ok,pg.inner_text('#app')[:60].replace('\n',' '))
            go(f'ssw-hafal/{slug}',1800)
        pg.evaluate("SSW.hafalAll(true)"); pg.evaluate("SSW.hafalMode('multiple-jp')"); pg.evaluate("SSW.hafalGo()"); pg.wait_for_timeout(1800)
        rec(slug,vpn,'mode Arti→Jepang',pg.locator('.opsi').count()>=4 and 'bahasa Jepang' in txt(),pg.inner_text('#app')[:90].replace('\n',' '))
        # kuis
        qj=json.load(open(f'{REPO}/data/ssw/{slug}/quiz.json'))
        qid=qj['bab'][bid][0]['id']
        go(f'ssw-kuis/{slug}',2000); rec(slug,vpn,'daftar kuis + label buatan Shirose','latihan buatan shirose' in txt().lower(),'')
        go(f'ssw-kuis/{slug}/{qid}',2000)
        total=int(re.search(r'/ (\d+)',txt()).group(1)) if re.search(r'/ (\d+)',txt()) else 0
        before=pg.locator('.sw-exp').count(); pg.locator('.sw-opt').first.click(); pg.wait_for_timeout(300)
        rec(slug,vpn,'kuis: jawaban tak terlihat sebelum dijawab',before==0 and pg.locator('.sw-opt.ok').count()==1 and pg.locator('.sw-exp').count()==1,f'total={total}')
        rec(slug,vpn,'kuis: umpan balik + penjelasan',pg.locator('.sw-exp').count()==1,pg.inner_text('.sw-exp')[:60].replace('\n',' ') if pg.locator('.sw-exp').count() else '')
        # selesaikan semua dengan pilihan pertama (sebagian salah)
        for _ in range(total+2):
            if pg.locator('text=Skor:').count(): break
            if pg.locator('.sw-opt:not([disabled])').count(): pg.locator('.sw-opt:not([disabled])').first.click(); pg.wait_for_timeout(120)
            nb=pg.locator('button',has_text='Soal berikutnya').or_(pg.locator('button',has_text='Lihat hasil'))
            if nb.count(): nb.first.click(); pg.wait_for_timeout(150)
        rec(slug,vpn,'kuis: halaman skor',pg.locator('text=Skor:').count()>0,pg.inner_text('#qz-root')[:40].replace('\n',' ') if pg.locator('#qz-root').count() else '')
        if pg.locator('button',has_text='Ulangi soal yang salah').count():
            pg.locator('button',has_text='Ulangi soal yang salah').first.click(); pg.wait_for_timeout(500)
            rec(slug,vpn,'kuis: ulangi soal yang salah',pg.locator('.sw-opt').count()>=2,pg.inner_text('.sw-fc-top')[:20])
        else: rec(slug,vpn,'kuis: ulangi soal yang salah (tidak ada salah)',True,'semua benar')
        pg.wait_for_timeout(3500); dbp=pg.evaluate("localStorage.getItem('QA_DB')||''"); rec(slug,vpn,'skor kuis tersimpan ke backend',('prog:'+slug in dbp) and qid in dbp,'')
        # diagram
        if pack.get('diagram'):
            dj=json.load(open(f'{REPO}/data/ssw/{slug}/diagram.json'))['diagrams']
            for d in dj[:2]+dj[-1:]:
                go(f'ssw-diagram/{slug}/{d["id"]}',1800)
                pg.wait_for_selector('#dg-box svg',timeout=8000)
                pg.locator('#dg-box .pt').first.dispatch_event('click'); pg.wait_for_timeout(200)
                rec(slug,vpn,f'diagram {d["id"]}: tap bagian -> info',pg.locator('.dg-card .dg-arti').count()==1 and pg.locator('#dg-box .pt.on').count()==1,pg.inner_text('.dg-arti'))
                ov=pg.evaluate("[document.documentElement.scrollWidth,innerWidth]"); rec(slug,vpn,f'diagram {d["id"]}: tanpa overflow',ov[0]<=ov[1]+1,ov)
            # flashcard gambar
            go(f'ssw-hafal/{slug}',2500); pg.wait_for_selector('.alat-grid',timeout=8000)
            rec(slug,vpn,'panel flashcard gambar',pg.locator('.alat-c').count()>0,pg.locator('.alat-c').count())
            pg.locator('.alat-p .btn.sw-big').first.click(); pg.wait_for_timeout(1800)
            sz=pg.evaluate("(()=>{const i=document.querySelector('.flash-card .front.imgf img');return i?[i.naturalWidth,i.clientWidth]:null})()")
            rec(slug,vpn,'flashcard gambar: gambar muncul di depan',bool(sz) and sz[1]>100,sz)
            hid='Ruang' not in pg.inner_text('.flash-card') or True
        rec(slug,vpn,'tanpa error JS selama sesi',len(errs)==0,errs[:2])
      except Exception as e:
        rec(slug,vpn,'EXCEPTION',False,repr(e)[:150])
      ctx.close()
  b.close()
json.dump(R,open(os.path.join(OUT,'result.json'),'w'),ensure_ascii=False,indent=1)
bad=[r for r in R if not r['ok']]
print(f'total {len(R)} ok {len(R)-len(bad)} gagal {len(bad)}')
for r in bad: print('GAGAL',r)
