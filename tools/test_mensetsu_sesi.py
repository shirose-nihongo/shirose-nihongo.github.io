"""Tes simulasi wawancara suara Mensetsu (STT/TTS di-mock). python3 tools/test_mensetsu_sesi.py"""
#!/usr/bin/env python3
"""Tes browser (Playwright + Chrome) untuk Kosakata Kanji N3.
Firebase diganti stub otomatis (dibuat dari daftar export firebase-sync.js) supaya UI asli bisa diuji tanpa jaringan.
Jalankan dari root repo:  python3 tools/test_kanji_vocab_n3_browser.py [desktop|mobile]
"""
import http.server, json, re, socketserver, sys, threading, pathlib, functools
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
MODE='desktop'
exports = re.findall(r'^export\s+(?:async\s+)?(?:function|const|let|class)\s+(\w+)', (ROOT/"js/firebase-sync.js").read_text(encoding="utf8"), re.M)
SYNC = {"detectNewMastery","onAuth","loadSRS","saveSRS"}
lines = ["const MEM = (globalThis.__SRS = globalThis.__SRS || {});",
         "export const detectNewMastery = (card) => { if (!card || card.mastered) return false; if ((card.interval||0) < 21) return false; card.mastered = true; return true; };",
         "export const loadSRS = async (lv) => JSON.parse(JSON.stringify(MEM[lv] || {}));",
         "export const saveSRS = async (lv, k) => { MEM[lv] = JSON.parse(JSON.stringify(k)); };",
         "export const onAuth = (cb) => { setTimeout(() => cb({ uid: 'u-test', email: 'tes@example.com' }, { nama: 'Tes', aksesLevel: { n3: true, n5: true, n4: true, n2: true, n1: true } }), 50); };"]
for n in exports:
    if n in SYNC: continue
    if re.match(r'^(userIs|is[A-Z]|has[A-Z]|can[A-Z])', n): lines.append(f"export const {n} = () => false;")
    elif n in ("getPosOverride",): lines.append(f"export const {n} = async () => ({{}});")
    elif n == "getGami": lines.append("export const getGami = async () => ({ xp: 0, koin: 0, streak: 0, level_karakter: 1 });")
    elif n in ("tambahXP",): lines.append("export const tambahXP = async () => ({ xp: 0, koin: 0, streak: 0, level_karakter: 1 });")
    elif n.startswith(("list", "komentar", "getKomentar")) or "Komentar" in n or "Comments" in n: lines.append(f"export const {n} = async () => [];")
    else: lines.append(f"export const {n} = (...a) => Promise.resolve(null);")
lines.append("export let lastAuthDenied = null;")
STUB = "\n".join(l for l in lines if not (l.startswith("export const lastAuthDenied")))

from playwright.sync_api import sync_playwright

STUB="\n".join(l for l in STUB.split("\n") if not l.startswith("export const getSiswaDoc "))+"\nexport const getSiswaDoc = () => ({ aksesSswBidang: { kaigo: true } });\n"
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
socketserver.TCPServer.allow_reuse_address=True
srv=socketserver.ThreadingTCPServer(("127.0.0.1",8791),functools.partial(Q,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
MOCK="""
window.__said=[];
window.SpeechSynthesisUtterance=function(t){this.text=t};
Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},getVoices(){return[]},speak(u){window.__said.push(u.text);setTimeout(()=>u.onend&&u.onend(),30)}}});
window.SpeechRecognition=function(){this.start=()=>{window.__rec=this;this.onresult&&0};this.stop=()=>{setTimeout(()=>this.onend&&this.onend(),10)};this.abort=()=>{}};
"""
ok=True
def chk(n,c):
    global ok; print(("OK  " if c else "FAIL"),n); ok&=bool(c)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"]);ctx=b.new_context(service_workers="block")
    def rt(r):
        u=r.request.url
        if "/js/firebase-sync.js" in u: return r.fulfill(status=200,content_type="text/javascript",body=STUB)
        if u.startswith("http://127.0.0.1"): return r.continue_()
        return r.abort()
    ctx.route("**/*",rt);pg=ctx.new_page();errs=[]
    pg.on("pageerror",lambda e:errs.append(str(e)))
    ctx.add_init_script(MOCK)
    pg.goto("http://127.0.0.1:8791/index.html#mensetsu-sesi/kaigo");pg.wait_for_timeout(2500)
    chk("setup tampil",pg.locator("text=Simulasi wawancara").count()>0)
    pg.evaluate("MW.cfg('n',4)");pg.evaluate("MW.mulai()");pg.wait_for_timeout(1500)
    chk("pewawancara bicara otomatis",pg.evaluate("__said.length")>=2)
    chk("ruby furigana tampil",pg.locator(".ms-b-ja ruby").count()>0)
    pg.evaluate("MW.furiToggle(false)");chk("furigana mati",pg.locator(".ms-b-ja ruby").count()==0)
    pg.evaluate("MW.furiToggle(true)")
    for i in range(4):
        pg.fill("#mw-ta","私は介護の仕事がしたいです。人の役に立ちたいと思います。たとえば、お年寄りを助けます。");pg.evaluate("MW.kirimKetik()");pg.wait_for_timeout(1200)
        if pg.locator(".ms-score").count():break
    pg.wait_for_timeout(1500)
    chk("hasil tampil",pg.locator(".ms-score").count()>0)
    pg.goto("http://127.0.0.1:8791/index.html#mensetsu-bidang/kaigo");pg.wait_for_timeout(1500)
    chk("kartu di halaman bidang",pg.locator("text=Simulasi wawancara (suara)").count()>0)
    chk("tanpa error JS",not errs); print(errs[:3])
    b.close()
sys.exit(0 if ok else 1)
