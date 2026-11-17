import json, sys, os
from playwright.sync_api import sync_playwright
HERE=os.path.dirname(os.path.abspath(__file__))
src=open(os.path.join(HERE,'ssw_qa.py')).read()
INIT=src.split('INIT = """')[1].split('"""')[0]
stub=open(os.path.join(HERE,'fbstub.js')).read()
SLUGS=sys.argv[1].split(','); R=[]
def rec(*a): R.append(a); print(('OK  ' if a[3] else 'FAIL'),*a[:3],str(a[4])[:100])
with sync_playwright() as p:
  b=p.chromium.launch()
  for vpn,vp in {'mobile':{'width':390,'height':780},'desktop':{'width':1280,'height':800}}.items():
    for slug in SLUGS:
      ctx=b.new_context(viewport=vp,service_workers='block'); ctx.add_init_script(INIT)
      pg=ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:120]))
      pg.route('**/js/firebase-sync.js*',lambda r:r.fulfill(body=stub,content_type='application/javascript'))
      pg.goto('http://localhost:8765/index.html#home'); pg.wait_for_timeout(2000)
      for j in ('katakana','kanji','bunpou'):
        pg.evaluate(f"route('ssw-pustaka/{slug}/{j}')"); pg.wait_for_timeout(1500)
        n=pg.locator('.sw-vrow').count(); cnt=pg.inner_text('#sw-pcount') if pg.locator('#sw-pcount').count() else ''
        rec(slug,vpn,j+' daftar',n>0,f'{n} baris, {cnt}')
        if n:
          pg.fill('#sw-pq','a'); pg.wait_for_timeout(300)
          pg.locator('.sw-vrow summary').first.click(); pg.wait_for_timeout(200)
          pg.evaluate("SSW.pusHafal('flashcard')"); pg.wait_for_timeout(1500)
          t=pg.inner_text('#app'); rec(slug,vpn,j+' flashcard',len(t)>10 and 'hafalan' in pg.evaluate("location.hash"),pg.evaluate("location.hash")+' '+t[:50].replace('\n',' '))
      rec(slug,vpn,'tanpa pageerror',not errs,errs[:2]); ctx.close()
