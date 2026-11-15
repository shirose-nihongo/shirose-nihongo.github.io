#!/usr/bin/env python3
"""Tes browser (Playwright + Chrome) untuk Kosakata Kanji N3.
Firebase diganti stub otomatis (dibuat dari daftar export firebase-sync.js) supaya UI asli bisa diuji tanpa jaringan.
Jalankan dari root repo:  python3 tools/test_kanji_vocab_n3_browser.py [desktop|mobile]
"""
import http.server, json, re, socketserver, sys, threading, pathlib, functools
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
MODE = sys.argv[1] if len(sys.argv) > 1 else "desktop"
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

class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
Handler = functools.partial(H, directory=str(ROOT))
socketserver.TCPServer.allow_reuse_address = True
srv = socketserver.ThreadingTCPServer(("127.0.0.1", 8765), Handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()

res = []; errs = []
def ok(c, m): res.append(bool(c)); print(("ok   : " if c else "GAGAL: ") + m)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
    ctx = b.new_context(viewport={"width": 390, "height": 800} if MODE == "mobile" else {"width": 1280, "height": 800}, service_workers="block")
    def route(r):
        u = r.request.url
        if "/js/firebase-sync.js" in u: return r.fulfill(status=200, content_type="text/javascript", body=STUB)
        if u.startswith("http://127.0.0.1"): return r.continue_()
        return r.abort()
    ctx.route("**/*", route)
    ctx.add_init_script("try { sessionStorage.setItem('shirose-level-dipilih','u-test'); localStorage.setItem('shirose-level-uid','u-test'); } catch(e){}")
    pg = ctx.new_page()
    pg.on("pageerror", lambda e: errs.append(str(e) + " @ " + str(getattr(e, "stack", ""))[:300]))
    pg.on("console", lambda m: errs.append(m.text) if m.type == "error" and "ERR_FAILED" not in m.text and "Failed to load resource" not in m.text else None)
    pg.goto("http://127.0.0.1:8765/index.html#home"); pg.wait_for_timeout(1500)
    pg.add_style_tag(content="#orphan-banner{display:none!important}")   # banner akun milik stub Firebase, bukan fitur yang diuji
    pg.evaluate("() => { const s = window.__SHIROSE_STATE; s.level = 'n3'; }")
    # --- Kanji utama: daftar + detail
    pg.evaluate("() => { location.hash = 'kanji'; }"); pg.wait_for_timeout(1500)
    ok(pg.locator("#app .kanji").count() >= 50, f"daftar Kanji N3 tampil ({pg.locator('#app .kanji').count()} item di chunk pertama)")
    pg.evaluate("() => window.showMateriDetail ? 0 : 0")
    # buka detail kanji pertama via klik
    pg.locator("#app .kanji").first.click(); pg.wait_for_timeout(800)
    items = pg.locator(".contoh-item.kv-item")
    ok(items.count() >= 2, f"Kanji utama menampilkan daftar kosakata yang bisa diklik ({items.count()})")
    ok(pg.locator(".kv-note").count() >= 1, "ada penanda: Kanji utama = kategori")
    ok(pg.locator("text=Flashcard kosakata Kanji ini").count() == 1, "tombol flashcard kosakata Kanji ini ada")
    # --- detail kosakata
    first_txt = items.first.locator(".jp").inner_text()
    items.first.click(); pg.wait_for_timeout(800)
    ok(pg.locator("#kv-modal .kv-kata").count() == 1, "klik kosakata -> panel detail terbuka")
    kata = pg.locator("#kv-modal .kv-kata").inner_text()
    ok(len(pg.locator("#kv-modal .kv-kata rt").inner_text()) > 0, "furigana tampil")
    ok(len(pg.locator("#kv-modal .kv-arti").inner_text()) > 1, "arti Indonesia tampil")
    ok(pg.locator("text=Urutan goresan").count() == 1 and pg.locator("text=書いてみよう").count() >= 1, "tombol urutan goresan + latihan menulis ada")
    # stroke order
    pg.locator("#kv-modal >> text=Urutan goresan").click(); pg.wait_for_timeout(1500)
    nstroke = pg.locator("#stroke-grid .stroke-wrap").count()
    chars = len([c for c in kata if '㐀' <= c <= '鿿'])
    ok(nstroke == chars and nstroke >= 1, f"urutan goresan per karakter: {nstroke} panel untuk {chars} kanji")
    ok(pg.locator("#stroke-grid .stroke-wrap svg path").count() > 0, "SVG goresan (data lokal) termuat")
    pg.evaluate("() => closeStrokeOrder()")
    # --- latihan menulis (komponen KC yang sudah ada, tiap karakter berurutan)
    pg.screenshot(path=f"/tmp/kv-detail-{MODE}.png")
    pg.locator("#kv-modal >> text=書いてみよう").first.click(); pg.wait_for_timeout(1500)
    ok(pg.locator("#kc-modal").count() == 1, "latihan menulis (kc-modal) terbuka untuk kosakata")
    pg.screenshot(path=f"/tmp/kv-writer-{MODE}.png")
    ok(pg.locator("#kc-modal canvas, #kc-modal svg").count() > 0, "area menulis / goresan tampil")
    pg.evaluate("() => KC.close()"); pg.wait_for_timeout(300)
    # --- latihan membaca
    pg.locator("#kv-modal >> text=Latihan membaca").click(); pg.wait_for_timeout(300)
    ok(pg.locator("#kv-quiz .kv-opt").count() == 4, "latihan membaca: 4 pilihan")
    pg.locator("#kv-quiz .kv-opt").nth(0).click(); pg.wait_for_timeout(400)
    ok(pg.locator("#kv-quiz .kv-opt.ok").count() == 1, "jawaban benar ditandai")
    srs = pg.evaluate("() => JSON.parse(JSON.stringify(globalThis.__SRS || {}))")
    ok(any("lat" in c for lv in srs.values() for c in lv.values()), "hasil latihan tersimpan di kartu (progres per kosakata)")
    keys = [k for lv in srs.values() for k in lv.keys()]
    ok(len(keys) == 1 and (keys[0].startswith("kv:") or keys[0].startswith("k:")), f"kunci progres = identitas kosakata ({keys})")
    pg.wait_for_timeout(1500)
    pg.evaluate("() => kvClose()")
    # --- sesi flashcard dari satu Kanji
    pg.evaluate("() => kvStudy(0, 'flashcard')"); pg.wait_for_timeout(1200)
    q = pg.evaluate("() => window.__SHIROSE_STATE.hafalan_queue.map(c => ({t: c.tipe, f: c.front, k: c.skey, kv: c.kv}))")
    ok(len(q) >= 2 and all(c["t"] == "kosakata" and c["kv"] for c in q), f"flashcard dari Kanji 1 hanya berisi kosakata: {[c['f'] for c in q]}")
    ok(all(c["f"] != "政" for c in q), "Kanji satuan 政 tidak ada di flashcard")
    ok(pg.locator("#app .flash-card, #app .flashcard, #app [class*=flash]").count() > 0, "tampilan flashcard terbuka")
    pg.screenshot(path=f"/tmp/kv-flash-{MODE}.png")
    pg.evaluate("() => kvStudy(0, 'multiple')"); pg.wait_for_timeout(1200)
    ok(pg.evaluate("() => window.__SHIROSE_STATE.hafalan.mode") == "multiple" and pg.locator("#app button").count() >= 3, "pilihan ganda dari satu Kanji (3 kosakata) terbuka tanpa error")
    pg.evaluate("() => kvStudy(0, 'flashcard')"); pg.wait_for_timeout(600)
    # --- hafalan: pilih materi Kanji -> hanya kosakata
    pg.evaluate("() => { location.hash = 'hafalan'; }"); pg.wait_for_timeout(1500)
    ok(pg.locator("text=Kosakata Kanji").count() >= 1, "menu hafalan N3 berlabel 'Kosakata Kanji' (bukan 'Kanji')")
    pg.evaluate("() => hafCfg('tipe','kanji')"); pg.wait_for_timeout(1000)
    ok(pg.locator(".kv-note").count() == 1, "catatan: kartu = kosakata, bukan Kanji satuan")
    pg.evaluate("() => { window.__SHIROSE_STATE.hafalan.range='all'; window.__SHIROSE_STATE.hafalan.filter='all'; return hafStart(); }"); pg.wait_for_timeout(1500)
    q = pg.evaluate("() => window.__SHIROSE_STATE.hafalan_queue.map(c => ({t: c.tipe, f: c.front, k: c.skey || (c.tipe[0] + ':' + c.no)}))")
    mains = set(json.load(open(ROOT/"data/kanji-n3.json", encoding="utf8"))[i]["k"] for i in range(367))
    ok(len(q) > 800, f"deck Kosakata Kanji N3: {len(q)} kartu")
    ok(not any(c["t"] == "kanji" for c in q), "tidak ada kartu bertipe kanji")
    kj = json.load(open(ROOT/"data/kanji-n3.json", encoding="utf8"))
    kos3 = json.load(open(ROOT/"data/kosakata-n3.json", encoding="utf8"))
    listed = {c["k"] for k in kj for c in k["c"] if c["k"] == k["k"]} | {re.sub(r"\[[^\]]*\]", "", v["kata"]).strip() for v in kos3}
    ok(all(c["f"] in listed for c in q if c["f"] in mains), "kartu satu-Kanji hanya kata yang eksplisit ada di database (昔, 猫, ...)")
    ok(not any(c["f"] in (mains - listed) for c in q if not c["k"].startswith("kj:")), "Kanji satuan yang bukan kata (政, 駐, ...) tidak ada di deck")
    ok(any(c["f"] == "昔" for c in q) and any(c["f"] == "王様" for c in q), "昔 dan 王様 ada di deck")
    ok(len({c['k'] for c in q}) == len(q), "tanpa kartu ganda")
    # semua
    pg.evaluate("() => hafCfg('tipe','semua')"); pg.wait_for_timeout(800)
    pg.evaluate("() => hafStart()"); pg.wait_for_timeout(1500)
    q = pg.evaluate("() => window.__SHIROSE_STATE.hafalan_queue.map(c => ({t: c.tipe, f: c.front, k: c.skey || (c.tipe[0] + ':' + c.no)}))")
    ok(not any(c["t"] == "kanji" for c in q) and len({c['k'] for c in q}) == len(q), f"mode 'Semua' N3: {len(q)} kartu, tanpa kanji satuan & tanpa duplikat")
    # --- level lain (N5, N4, N2, N1): alur yang sama, pola N3
    cl = lambda t: re.sub(r"\[[^\]]*\]", "", t).strip()
    for lv in ["n5", "n4", "n2", "n1"]:
        K = json.load(open(ROOT/f"data/kanji-{lv}.json", encoding="utf8")); V = json.load(open(ROOT/f"data/kosakata-{lv}.json", encoding="utf8"))
        mains = {k["k"] for k in K}; inkos = {cl(v["kata"]) for v in V}
        listed = {cl(c["k"]) for k in K for c in k["c"] if cl(c["k"]) == k["k"]}
        pg.evaluate("(lv) => { window.__SHIROSE_STATE.level = lv; location.hash = 'kanji'; }", lv); pg.wait_for_timeout(1500)
        ok(pg.locator("#app .kanji").count() == len(K), f"{lv}: daftar Kanji tampil ({len(K)})")
        pg.locator("#app .kanji").first.click(); pg.wait_for_timeout(900)
        n_items = pg.locator(".contoh-item.kv-item").count()
        ok(n_items >= 1 and pg.locator(".kv-note").count() >= 1, f"{lv}: Kanji pertama menampilkan {n_items} kosakata yang bisa diklik + penanda kategori")
        pg.locator(".contoh-item.kv-item").first.click(); pg.wait_for_timeout(700)
        kata = pg.locator("#kv-modal .kv-kata").inner_text()
        ok(len(pg.locator("#kv-modal .kv-arti").inner_text()) > 1 and len(pg.locator("#kv-modal .kv-kata rt").inner_text()) > 0, f"{lv}: panel detail '{kata}' berisi furigana + arti")
        pg.locator("#kv-modal >> text=Urutan goresan").click(); pg.wait_for_timeout(1500)
        chars = len([c for c in kata if '\u3400' <= c <= '\u9fff' or '\uf900' <= c <= '\ufaff'])
        ok(pg.locator("#stroke-grid .stroke-wrap").count() == chars and pg.locator("#stroke-grid .stroke-wrap svg path").count() > 0, f"{lv}: urutan goresan {chars} karakter termuat")
        pg.evaluate("() => closeStrokeOrder()")
        pg.locator("#kv-modal >> text=Latihan arti").click(); pg.wait_for_timeout(300)
        ok(pg.locator("#kv-quiz .kv-opt").count() == 4, f"{lv}: latihan arti 4 pilihan")
        pg.evaluate("() => kvClose()")
        pg.evaluate("() => { const s = window.__SHIROSE_STATE; s.hafalan = { tipe: 'kanji', mode: 'flashcard', range: 'all', filter: 'all', pos: 'all' }; return hafStart(); }"); pg.wait_for_timeout(1500)
        q = pg.evaluate("() => window.__SHIROSE_STATE.hafalan_queue.map(c => ({t: c.tipe, f: c.front, k: c.skey || (c.tipe[0] + ':' + c.no)}))")
        ok(len(q) > 50 and not any(c["t"] == "kanji" for c in q), f"{lv}: deck Kosakata Kanji {len(q)} kartu, tanpa kartu bertipe kanji")
        ok(len({c['k'] for c in q}) == len(q), f"{lv}: tanpa kartu ganda")
        ok(all(c["f"] in listed or c["f"] in inkos or c["k"].startswith("kj:") for c in q if c["f"] in mains), f"{lv}: kartu satu-Kanji hanya kata eksplisit / cadangan Kanji-tanpa-kosakata")
        fbn = sum(1 for c in q if c["k"].startswith("kj:"))
        ok(not any(c["f"] in (mains - listed - inkos) for c in q if not c["k"].startswith("kj:")), f"{lv}: Kanji satuan yang bukan kata tidak jadi kartu kosakata (cadangan kj: = {fbn})")
    ok(not errs, f"tidak ada error JS di {MODE}: {errs[:3]}")
    b.close()
srv.shutdown()
print("\n%s: %d/%d lulus" % (MODE, sum(res), len(res))); sys.exit(0 if all(res) else 1)
