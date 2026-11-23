// Deck Hafalan ala Anki — KHUSUS GURU (dashboard guru).
// Fungsi hafalan (flashcard SRS, pilihan ganda, cocokkan, ketik) disalin dari sisi siswa, tapi isi kartu
// 100% buatan guru: input manual, tempel massal, atau impor Excel/CSV. Satu file = satu deck.
// Penyimpanan: Firestore guru_deck (guru-only) bila aturan sudah dipublish; kalau ditolak -> lokal (IndexedDB).
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const DAY = 864e5, MAXB = 900000;
const rnd = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const newId = () => "d" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/* ---------- Penyimpanan ---------- */
const IDB = {
  _db: null,
  open() { return this._db || (this._db = new Promise((ok, no) => { const r = indexedDB.open("shirose-deck-guru", 1); r.onupgradeneeded = () => r.result.createObjectStore("deck", { keyPath: "id" }); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); })); },
  async tx(mode, fn) { const d = await this.open(); return new Promise((ok, no) => { const t = d.transaction("deck", mode), rq = fn(t.objectStore("deck")); t.oncomplete = () => ok(rq.result); t.onerror = () => no(t.error); }); },
  all() { return this.tx("readonly", s => s.getAll()); },
  get(id) { return this.tx("readonly", s => s.get(id)); },
  put(x) { return this.tx("readwrite", s => s.put(x)); },
  del(id) { return this.tx("readwrite", s => s.delete(id)); },
};
let LOKAL = false, FB = null, CTX = { toast: () => {}, rerender: () => {} };
const meta = d => ({ id: d.id, nama: d.nama, n: d.cards.length, updated: Date.now() });
const ST = {
  async index() {
    if (!LOKAL) { try { return await FB.deckIndex(); } catch (e) { LOKAL = true; } }
    return (await IDB.all()).map(meta);
  },
  async get(id) { return LOKAL ? await IDB.get(id) : await FB.deckGet(id); },
  async put(d) {
    if (JSON.stringify(d.cards).length > MAXB) throw new Error("Deck terlalu besar (± > 4000 kartu). Pecah jadi beberapa file.");
    if (LOKAL) await IDB.put(d); else await FB.deckPut(d);
  },
  async setIndex(l) { if (!LOKAL) await FB.deckSetIndex(l); },
  async del(id) { if (LOKAL) await IDB.del(id); else await FB.deckDelete(id); },
};

/* ---------- State ---------- */
let IDX = [], LOKALN = 0;
const V = { view: "list", id: "", deck: null, q: "", page: 0, edit: null, stage: null, busy: false, S: null,
  cfg: { mode: "flash", arah: "jp", sumber: "due", jumlah: 20 } };
const MODES = { flash: "🃏 Flashcard (SRS)", pg: "🔘 Pilihan ganda", cocok: "🧩 Cocokkan", ketik: "⌨️ Ketik" };
const toast = m => CTX.toast(m);
/* Furigana: "漢字[かんじ]" -> ruby; atau otomatis dari kolom Kana bila Kata berisi kanji. Pilihan ON/OFF dipakai bersama hafalan siswa. */
const pk = c => String(c.k || "").replace(/\[[^\]]*\]/g, "");
const rubyBr = t => esc(t).replace(/([\u3400-\u9fff々〆]+)\[([^\]]+)\]/g, "<ruby>$1<rt>$2</rt></ruby>");
const furi = c => { const k = String(c.k || ""); if (/\[[^\]]+\]/.test(k)) return rubyBr(k); if (c.y && c.y !== k && /[\u3400-\u9fff]/.test(k)) return `<ruby>${esc(k)}<rt>${esc(c.y)}</rt></ruby>`; return esc(k); };
const furiOn = () => { try { return localStorage.getItem("shirose-haf-furi") === "1"; } catch (e) { return false; } };
const applyFuri = () => document.body.classList.toggle("dk-furi-on", furiOn());
const furiBtn = () => `<button class="btn ghost sm" id="dk-furi-btn" onclick="DK.furi()" aria-pressed="${furiOn()}">${furiOn() ? "ふりがな ON" : "ふりがな OFF"}</button>`;
const paint = () => { const r = document.getElementById("dk-root"); if (r) { r.innerHTML = view(); setTimeout(() => { const i = document.getElementById("dk-in"); if (i) i.focus(); bindSwipe(); fit(); }, 0); } };
const simpan = async () => { const d = V.deck; await ST.put(d); const m = meta(d); IDX = [...IDX.filter(x => x.id !== d.id), m]; await ST.setIndex(IDX); };

/* ---------- Impor / ekspor Excel ---------- */
const norm = s => String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]/g, "");
const ALIAS = {
  k: ["kata", "kanji", "jp", "jepang", "nihongo", "depan", "front", "word", "kosakata", "katakanji", "tangoo", "tango"],
  y: ["kana", "bacaan", "baca", "furigana", "yomi", "reading", "hiragana", "cara baca", "carabaca"],
  a: ["arti", "artiindonesia", "makna", "meaning", "belakang", "back", "indo", "indonesia", "terjemahan"],
  c: ["contoh", "contohkalimat", "kalimat", "example", "reibun"],
  ca: ["articontoh", "artikalimat", "terjemahancontoh", "artikontoh", "translation", "artiindocontoh"],
  n: ["catatan", "note", "notes", "keterangan", "memo"],
  t: ["tag", "tags", "kategori", "bab", "label"],
};
const POS = { k: 0, y: 1, a: 2, c: 3, ca: 4, n: 5, t: 6 };
const colMap = row => { const m = {}; row.forEach((h, i) => { const n = norm(h); if (!n) return; for (const f in ALIAS) if (m[f] === undefined && ALIAS[f].map(norm).includes(n)) { m[f] = i; break; } }); return m; };
const keyOf = c => [c.k, c.y, c.a].join("\u0001");
// aoa = array of arrays dari sheet. Kembalikan { cards, skip:[{row,alasan}] }
function parseRows(aoa) {
  const rows = aoa.map((r, i) => ({ r, no: i + 1 })).filter(x => x.r.some(c => String(c == null ? "" : c).trim() !== ""));
  let m = null, start = 0;
  for (let i = 0; i < Math.min(rows.length, 5); i++) { const mm = colMap(rows[i].r); if (Object.keys(mm).length >= 2 && (mm.k !== undefined || mm.a !== undefined)) { m = mm; start = i + 1; break; } }
  if (!m) m = POS;
  const cards = [], skip = [], seen = new Set();
  for (const { r, no } of rows.slice(start)) {
    const v = f => m[f] === undefined ? "" : String(r[m[f]] == null ? "" : r[m[f]]).trim();
    const c = { k: v("k"), y: v("y"), a: v("a"), c: v("c"), ca: v("ca"), n: v("n"), t: v("t") };
    if (!c.k) { skip.push({ row: no, alasan: "kolom Kata kosong" }); continue; }
    if (!c.a && !c.y) { skip.push({ row: no, alasan: "Arti & Kana kosong" }); continue; }
    const key = keyOf(c); if (seen.has(key)) { skip.push({ row: no, alasan: "dobel" }); continue; }
    seen.add(key); cards.push(c);
  }
  return { cards, skip, header: start > 0 };
}
async function bacaFile(f) {
  const base = f.name.replace(/\.[^.]+$/, "");
  const wb = /\.csv$/i.test(f.name) ? XLSX.read(await f.text(), { type: "string" }) : XLSX.read(await f.arrayBuffer(), { type: "array" });
  const names = wb.SheetNames.filter(n => !/^(petunjuk|readme|info|panduan)$/i.test(n.trim()));
  const out = [];
  for (const sn of names) {
    const aoa = XLSX.utils.sheet_to_json(wb.Sheets[sn], { header: 1, defval: "", raw: false });
    const p = parseRows(aoa); if (!p.cards.length && !p.skip.length) continue;
    out.push({ nama: names.length > 1 ? `${base} – ${sn}` : base, cards: p.cards, skip: p.skip, on: p.cards.length > 0, target: "new", file: f.name });
  }
  return out;
}
const HEAD = ["Kata", "Kana", "Arti", "Contoh", "Arti Contoh", "Catatan", "Tag"];
function buatTemplate() {
  const ws = XLSX.utils.aoa_to_sheet([HEAD,
    ["食べる", "たべる", "makan", "毎日ごはんを食べる。", "Setiap hari makan nasi.", "KK golongan 2", "N5 bab1"],
    ["学校", "がっこう", "sekolah", "学校へ行きます。", "Pergi ke sekolah.", "", "N5 bab1"],
    ["きれい", "きれい", "cantik / bersih", "このへやはきれいです。", "Kamar ini bersih.", "KS-na", "N5 bab2"]]);
  ws["!cols"] = [{ wch: 14 }, { wch: 14 }, { wch: 22 }, { wch: 28 }, { wch: 28 }, { wch: 18 }, { wch: 14 }];
  const pt = XLSX.utils.aoa_to_sheet([["PETUNJUK IMPOR DECK"], [""],
    ["1. Isi sheet 'Kosakata'. Baris pertama = judul kolom, jangan diubah urutannya (boleh diubah kalau namanya mirip)."],
    ["2. Wajib: kolom Kata + (Arti atau Kana). Kolom lain (Contoh, Arti Contoh, Catatan, Tag) boleh kosong."],
    ["3. Satu file = satu deck. Kalau ada banyak sheet, tiap sheet jadi deck sendiri (sheet bernama 'Petunjuk' diabaikan)."],
    ["4. Hapus 3 baris contoh sebelum dipakai (atau biarkan, tinggal hapus kartunya nanti)."],
    ["5. Di dashboard: Deck → ⬆ Impor Excel / CSV → pilih file → cek pratinjau → tekan ✅ Submit."],
    ["6. Baris dobel (Kata+Kana+Arti sama) dilewati otomatis."]]);
  pt["!cols"] = [{ wch: 110 }];
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Kosakata"); XLSX.utils.book_append_sheet(wb, pt, "Petunjuk");
  XLSX.writeFile(wb, "format-deck-shirose.xlsx");
}
function ekspor() {
  const d = V.deck; if (!d) return;
  const ws = XLSX.utils.aoa_to_sheet([HEAD, ...d.cards.map(c => [c.k, c.y, c.a, c.c || "", c.ca || "", c.n || "", c.t || ""])]);
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Kosakata");
  XLSX.writeFile(wb, (d.nama.replace(/[\\/:*?"<>|]+/g, "_") || "deck") + ".xlsx");
}

/* ---------- SRS (ala Anki) ---------- */
function sched(c, q) {
  const iv0 = c.iv || 0, ez0 = c.ez || 2.5;
  if (q === 0) return { iv: 0, ez: Math.max(1.3, ez0 - 0.2) };
  if (q === 1) return { iv: Math.max(1, Math.round(iv0 * 1.2)), ez: Math.max(1.3, ez0 - 0.15) };
  if (q === 2) return { iv: iv0 < 1 ? 1 : Math.max(iv0 + 1, Math.round(iv0 * ez0)), ez: ez0 };
  return { iv: iv0 < 1 ? 4 : Math.max(iv0 + 2, Math.round(iv0 * ez0 * 1.3)), ez: ez0 + 0.15 };
}
const ivLbl = iv => iv === 0 ? "hari ini" : iv + " hari";
const baru = c => !c.r;
const jatuhTempo = c => c.r > 0 && (c.due || 0) <= Date.now();
const lemah = c => (c.l || 0) > 0 || (c.r > 0 && (c.iv || 0) < 3);
const hafal = c => (c.iv || 0) >= 21;
const hitung = d => ({ n: d.cards.length, baru: d.cards.filter(baru).length, due: d.cards.filter(jatuhTempo).length, lemah: d.cards.filter(lemah).length, hafal: d.cards.filter(hafal).length });

/* ---------- Sesi belajar ---------- */
const sumberKartu = (d, s) => s === "due" ? [...d.cards.filter(jatuhTempo).sort((a, b) => (a.due || 0) - (b.due || 0)), ...d.cards.filter(baru)]
  : s === "lemah" ? d.cards.filter(lemah) : d.cards;
const arahItem = (c, ar) => ({ c, ar: ar === "acak" ? (Math.random() < .5 ? "jp" : "id") : ar });
const teksJawab = (c, ar) => ar === "jp" ? (c.a || c.y) : (c.y && c.y !== pk(c) ? `${pk(c)}（${c.y}）` : pk(c));
function mulai() {
  const d = V.deck, cfg = V.cfg;
  const sumber = cfg.mode === "flash" ? cfg.sumber : (cfg.sumber === "due" ? "semua" : cfg.sumber);
  let pool = sumberKartu(d, sumber);
  if (cfg.mode !== "flash" || sumber !== "due") pool = rnd(pool);
  if (cfg.jumlah > 0) pool = pool.slice(0, cfg.jumlah);
  if (!pool.length) return toast("Tidak ada kartu untuk sumber ini");
  if ((cfg.mode === "pg") && d.cards.length < 2) return toast("Pilihan ganda butuh minimal 2 kartu di deck");
  if (cfg.mode === "cocok" && pool.length < 2) return toast("Cocokkan butuh minimal 2 kartu");
  let items = pool.map(c => arahItem(c, cfg.arah));
  if (cfg.mode === "ketik") items = items.filter(it => tujuanKetik(it).length);
  if (!items.length) return toast("Kartu tidak punya jawaban yang bisa diketik");
  if (cfg.mode === "pg") items.forEach(it => buatOpsi(it, d.cards));
  V.S = { mode: cfg.mode, q: items, i: 0, flip: false, pick: -1, cek: null, b: 0, s: 0, salah: [], rev: 0, round: null, dirty: 0 };
  if (cfg.mode === "cocok") mulaiRonde();
  V.view = "study"; paint();
}
function buatOpsi(it, semua) {
  const benar = teksJawab(it.c, it.ar);
  const ds = rnd([...new Set(semua.filter(x => x !== it.c).map(x => teksJawab(x, it.ar)).filter(t => t && t !== benar))]).slice(0, 3);
  it.opsi = rnd([benar, ...ds]); it.ans = it.opsi.indexOf(benar);
}
const pisah = s => String(s || "").split(/[\/;；,、]/).map(x => x.trim()).filter(Boolean);
function tujuanKetik(it) { const c = it.c; return it.ar === "jp" ? (c.y ? [c.y] : pisah(c.a).concat(c.a ? [c.a] : [])) : [pk(c), c.y].filter(Boolean); }
const n2 = s => String(s || "").toLowerCase().replace(/[\s・.,、。!?！？~〜]/g, "");
function mulaiRonde() {
  const S = V.S, chunk = S.q.slice(S.i, S.i + 6);
  S.round = { L: chunk, R: rnd(chunk), done: new Set(), sl: -1, sr: -1, bad: null };
}
const selesaiItem = () => { const S = V.S; S.i++; S.flip = false; S.pick = -1; S.cek = null; };
async function simpanSesi() { if (V.S && V.S.dirty) { V.S.dirty = 0; try { await simpan(); } catch (e) { toast("❌ Gagal menyimpan progres: " + (e.message || e)); } } }

/* ---------- View ---------- */
const CSS = `<style>
.dk-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px;}
.dk-deck{cursor:pointer;background:var(--navy-2);border:1px solid var(--border);border-radius:14px;padding:14px;}
.dk-deck:hover{border-color:var(--pink);}
.dk-card{background:var(--navy-4);border:2px solid var(--border);border-radius:18px;min-height:280px;padding:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;cursor:pointer;gap:8px;}
.dk-big{font-family:var(--font-jp);font-size:44px;font-weight:700;line-height:1.3;word-break:break-word;}
.dk-mid{font-size:22px;color:var(--gold);}
.dk-sm{font-size:13px;color:var(--gray);}
.dk-rate{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px;}
.dk-rate .btn{display:flex;flex-direction:column;gap:2px;align-items:center;}
.dk-rate small{font-weight:400;font-size:11px;opacity:.85;}
.dk-opt{display:block;width:100%;text-align:left;margin-bottom:8px;background:var(--navy-2);border:2px solid var(--border);color:var(--white);padding:12px 14px;border-radius:12px;font:600 15px var(--font-sans);cursor:pointer;}
.dk-opt:hover{border-color:var(--pink);}
.dk-opt.ok{border-color:var(--green);background:rgba(16,185,129,.2);}
.dk-opt.no{border-color:var(--red);background:rgba(239,68,68,.2);}
.dk-bar{height:6px;background:var(--navy-4);border-radius:99px;overflow:hidden;margin:8px 0 14px;}
.dk-bar i{display:block;height:100%;background:var(--pink);}
.dk-mt{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.dk-tile{padding:14px 10px;border-radius:12px;border:2px solid var(--border);background:var(--navy-2);color:var(--white);font:600 15px var(--font-jp);cursor:pointer;text-align:center;min-height:54px;}
.dk-tile.sel{border-color:var(--gold);}
.dk-tile.ok{border-color:var(--green);background:rgba(16,185,129,.2);opacity:.45;cursor:default;}
.dk-tile.bad{border-color:var(--red);background:rgba(239,68,68,.25);}
.dk-in{width:100%;padding:12px;border-radius:10px;border:2px solid var(--border);background:var(--navy-4);color:var(--white);font:600 20px var(--font-jp);}
.dk-frm{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;}
.dk-frm input,.dk-frm textarea,.dk-ta{padding:8px;border-radius:8px;border:1px solid var(--border);background:var(--navy-4);color:var(--white);font:14px var(--font-sans);width:100%;}
.dk-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
.dk-furi rt{display:none;font-size:.45em;font-weight:600;color:var(--pink-light,#f9a8c9);} body.dk-furi-on .dk-furi rt{display:revert;}
.flash-stage{position:relative;min-height:min(68vh,520px);display:flex;align-items:center;justify-content:center;margin:10px 0 18px;overflow:visible;user-select:none;-webkit-user-select:none;touch-action:pan-y;}
.flash-card{position:relative;width:100%;max-width:520px;height:clamp(380px,62vh,500px);overflow-x:hidden;overflow-y:auto;box-sizing:border-box;background:linear-gradient(160deg,rgba(42,50,112,.85),rgba(22,27,54,.85));border:1px solid var(--border);border-radius:24px;padding:32px 24px;text-align:center;box-shadow:0 12px 44px rgba(0,0,0,.4);transition:transform .25s ease,box-shadow .25s ease,opacity .25s ease;cursor:pointer;will-change:transform,opacity;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.flash-card .no-pill{position:absolute;top:14px;left:16px;font-size:12px;color:var(--gray);}
.flash-card .front{font-family:var(--font-jp);font-weight:800;font-size:min(22vw,120px);line-height:1.05;color:var(--pink-light);margin:14px 0 10px;word-break:break-all;max-width:100%;overflow-wrap:anywhere;}
.flash-card .reading{display:inline-block;padding:8px 18px;border-radius:999px;background:rgba(42,50,112,.6);color:var(--white);font-family:var(--font-jp);font-size:26px;margin:10px 0 14px;}
.flash-card .arti{font-size:22px;font-weight:700;color:var(--white);line-height:1.4;margin-top:8px;}
.flash-card .contoh{font-size:14px;color:var(--gray);margin-top:12px;padding:10px;background:rgba(255,255,255,.04);border-radius:10px;text-align:left;font-family:var(--font-jp);}
.flash-card .tap-hint{margin-top:18px;font-size:13px;color:var(--gray);animation:dkHint 1.6s ease-in-out infinite;}
@keyframes dkHint{0%,100%{opacity:.4}50%{opacity:.9}}
.flash-card .back-face{display:none;}
.flash-card.revealed .back-face{display:block;animation:dkReveal .25s ease-out;}
.flash-card.revealed .tap-hint{display:none;}
.flash-card.revealed .front.f-jp{font-size:72px;margin-top:0;}
@keyframes dkReveal{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}
.flash-card .say-btn{position:absolute;top:12px;right:12px;width:52px;height:52px;border-radius:50%;border:2px solid var(--border);background:rgba(255,255,255,.06);color:var(--white);font-size:24px;cursor:pointer;z-index:3;display:none;}
.flash-card.revealed .say-btn{display:block;}
.flash-card.swiping{transition:none;}
.flash-card.leave-left{transform:translateX(-120%) rotate(-14deg);opacity:0;}
.flash-card.leave-right{transform:translateX(120%) rotate(14deg);opacity:0;}
.flash-card.enter{animation:dkEnter .35s ease-out;}
@keyframes dkEnter{0%{transform:translateY(16px) scale(.96);opacity:0;}100%{transform:translateY(0) scale(1);opacity:1;}}
.flash-badge{position:absolute;top:24px;padding:6px 16px;border-radius:8px;font-weight:800;font-size:14px;letter-spacing:1px;opacity:0;pointer-events:none;transition:opacity .15s;border:2px solid currentColor;text-transform:uppercase;z-index:4;}
.flash-badge.left{left:20px;color:#ef5350;transform:rotate(-10deg);} .flash-badge.right{right:20px;color:#10b981;transform:rotate(10deg);}
.flash-actions{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;margin-top:8px;}
.flash-btn{padding:20px 16px;border-radius:16px;border:none;font-weight:800;font-size:18px;cursor:pointer;font-family:var(--font-sans);transition:transform .12s,filter .12s;display:flex;flex-direction:column;align-items:center;gap:4px;min-height:76px;color:#fff;}
.flash-btn .ico{font-size:24px;}
.flash-btn.lupa{background:linear-gradient(135deg,#ef5350,#c62828);box-shadow:0 6px 18px rgba(239,83,80,.5);}
.flash-btn.ingat{background:linear-gradient(135deg,#10b981,#059669);box-shadow:0 6px 18px rgba(16,185,129,.5);}
.flash-btn.back{background:rgba(255,255,255,.08);border:1px solid var(--border);padding:20px 22px;}
.flash-btn:disabled{opacity:.4;cursor:not-allowed;} .flash-btn:not(:disabled):active{transform:scale(.97);}
@media(max-width:640px){.dk-big{font-size:34px;}.dk-rate{grid-template-columns:repeat(2,1fr);}.flash-card .reading{font-size:22px;}.flash-card .arti{font-size:20px;}.flash-btn{font-size:16px;padding:18px 12px;min-height:84px;}.flash-card.revealed .front.f-jp{font-size:58px;}}
</style>`;

const chip = (on, js, txt) => `<button class="chip btn-chip ${on ? "on" : ""}" onclick="${js}">${txt}</button>`;

function view() {
  if (V.view === "study" && V.S) return CSS + viewStudy();
  if (V.view === "deck" && V.deck) return CSS + viewDeck();
  return CSS + viewList();
}

function viewList() {
  const lokal = LOKAL ? `<div class="alert" style="background:rgba(245,158,11,.12);border:1px solid #f59e0b;color:#fde68a;">● <b>Mode lokal</b>: deck tersimpan di browser ini saja (aturan Firestore <code>guru_deck</code> belum dipublish). Ganti browser/perangkat = deck tidak ikut. Tambahkan aturan dari <code>firestore.rules.example</code> supaya tersimpan di cloud.</div>` : "";
  const mig = !LOKAL && LOKALN ? `<div class="alert alert-ok">☁️ Ada <b>${LOKALN}</b> deck lokal di browser ini. <button class="btn sm" onclick="DK.migrasi()">Pindahkan ke cloud</button></div>` : "";
  const decks = [...IDX].sort((a, b) => String(a.nama).localeCompare(String(b.nama))).map(x => `<div class="dk-deck" onclick="DK.buka('${esc(x.id)}')">
      <b style="font-size:16px;">${esc(x.nama)}</b><div class="dk-sm" style="margin-top:4px;">${x.n} kartu</div></div>`).join("");
  return `<div class="panel">
    <h2>🗂️ Deck Hafalan <small style="font-size:12px;color:var(--gray);font-weight:400;">ala Anki · khusus guru</small></h2>
    <p class="dk-sm" style="margin-bottom:12px;">Isi kosakata sendiri, satu deck per file. Belajar pakai Flashcard (jadwal SRS), Pilihan ganda, Cocokkan, atau Ketik. Masukkan kartu manual, tempel massal, atau impor Excel.</p>
    <div class="dk-row">
      <button class="btn" onclick="DK.baru()">➕ Deck baru</button>
      <label class="btn gold" style="cursor:pointer;">⬆ Impor Excel / CSV<input type="file" accept=".xlsx,.xls,.csv" multiple style="display:none" onchange="DK.pilihFile(this)"></label>
      <button class="btn ghost" onclick="DK.template()">⬇ Template Excel</button>
    </div></div>${lokal}${mig}${V.stage ? viewStage() : ""}
    ${decks ? `<div class="dk-grid">${decks}</div>` : `<div class="panel" style="color:var(--gray);">Belum ada deck. Klik <b>➕ Deck baru</b> atau <b>⬆ Impor Excel</b>. Unduh <b>Template Excel</b> dulu untuk format kolomnya.</div>`}`;
}

function viewStage() {
  const opsiDeck = IDX.map(x => `<option value="${esc(x.id)}">${esc(x.nama)} (${x.n})</option>`).join("");
  const rows = V.stage.map((s, i) => `<div style="border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:10px;${s.on ? "" : "opacity:.5;"}">
      <div class="dk-row" style="margin-bottom:8px;">
        <label style="display:flex;gap:6px;align-items:center;"><input type="checkbox" ${s.on ? "checked" : ""} onchange="DK.stOn(${i},this.checked)"> <b>${s.cards.length} kartu</b></label>
        <span class="dk-sm">dari ${esc(s.file)}</span>
        ${s.skip.length ? `<span class="chip off" title="${esc(s.skip.slice(0, 20).map(x => "baris " + x.row + ": " + x.alasan).join("\n"))}">⚠ ${s.skip.length} baris dilewati</span>` : ""}
      </div>
      <div class="dk-row">
        <select onchange="DK.stTarget(${i},this.value)"><option value="new" ${s.target === "new" ? "selected" : ""}>➕ Deck baru</option>${opsiDeck.replace(`value="${esc(s.target)}"`, `value="${esc(s.target)}" selected`)}</select>
        ${s.target === "new" ? `<input value="${esc(s.nama)}" onchange="DK.stNama(${i},this.value)" placeholder="Nama deck" style="flex:1;min-width:160px;">` : `<span class="dk-sm">ditambahkan ke deck terpilih (kartu dobel dilewati)</span>`}
      </div>
      <div class="dk-sm" style="margin-top:8px;">Pratinjau: ${s.cards.slice(0, 4).map(c => `<b>${esc(pk(c))}</b> ${esc(c.y && c.y !== pk(c) ? "(" + c.y + ")" : "")} = ${esc(c.a)}`).join(" · ") || "—"}</div></div>`).join("");
  return `<div class="panel"><h2>📥 Pratinjau impor</h2>${rows}
    <div class="dk-row"><button class="btn" onclick="DK.submit()" ${V.busy ? "disabled" : ""}>${V.busy ? "Menyimpan…" : "✅ Submit ke deck"}</button><button class="btn ghost" onclick="DK.batalStage()">Batal</button></div></div>`;
}

function viewDeck() {
  const d = V.deck, h = hitung(d), cfg = V.cfg;
  const q = V.q.trim().toLowerCase();
  const all = d.cards.map((c, i) => ({ c, i })).filter(x => !q || [x.c.k, x.c.y, x.c.a, x.c.c, x.c.t, x.c.n].join(" ").toLowerCase().includes(q));
  const per = 50, pages = Math.max(1, Math.ceil(all.length / per)), pg = Math.min(V.page, pages - 1);
  const rows = all.slice(pg * per, pg * per + per).map(({ c, i }) => `<tr>
      <td style="font-family:var(--font-jp);font-size:16px;">${esc(pk(c))}</td><td>${esc(c.y)}</td><td>${esc(c.a)}</td>
      <td class="dk-sm">${esc(c.c)}</td><td class="dk-sm">${esc(c.t)}</td>
      <td style="white-space:nowrap;"><button class="btn sm ghost" onclick="DK.edit(${i})">✏️</button> <button class="btn sm ghost" onclick="DK.hapusKartu(${i})">🗑</button></td></tr>`).join("");
  const ed = V.edit;
  const cEd = ed !== null && ed >= 0 ? d.cards[ed] : null;
  const fv = f => esc(cEd ? cEd[f] || "" : "");
  const srcN = { due: h.due + h.baru, semua: h.n, lemah: h.lemah };
  const stat = `<span class="chip on">Baru ${h.baru}</span><span class="chip" style="background:#f59e0b;">Jatuh tempo ${h.due}</span><span class="chip" style="background:#ef4444;">Lemah ${h.lemah}</span><span class="chip on" style="background:#6366f1;">Hafal ${h.hafal}</span>`;
  const sumberTombol = (cfg.mode === "flash" ? [["due", "📅 Jadwal Anki"], ["semua", "Semua"], ["lemah", "Lemah"]] : [["semua", "Semua"], ["lemah", "Lemah"]])
    .map(([k, t]) => chip((cfg.mode !== "flash" && cfg.sumber === "due" ? "semua" : cfg.sumber) === k, `DK.cfg('sumber','${k}')`, `${t} (${srcN[k]})`)).join("");
  return `<div class="dk-row" style="margin-bottom:12px;">
      <button class="btn ghost" onclick="DK.list()">← Daftar deck</button>
      <b style="font-size:18px;">${esc(d.nama)}</b><span class="dk-sm">${h.n} kartu</span>
      <span style="flex:1"></span>
      <button class="btn sm ghost" onclick="DK.rename()">✏️ Nama</button>
      <button class="btn sm ghost" onclick="DK.ekspor()">⬇ Ekspor Excel</button>
      <button class="btn sm ghost" style="color:var(--red);" onclick="DK.hapusDeck()">🗑 Hapus deck</button></div>
    <div class="panel"><h2>🎯 Belajar</h2>
      <div style="margin-bottom:8px;">${stat}</div>
      <div class="dk-row" style="margin-bottom:8px;">${Object.entries(MODES).map(([k, t]) => chip(cfg.mode === k, `DK.cfg('mode','${k}')`, t)).join("")}</div>
      <div class="dk-row" style="margin-bottom:8px;"><span class="dk-sm">Arah:</span>${[["jp", "Jepang → Arti"], ["id", "Arti → Jepang"], ["acak", "Acak"]].map(([k, t]) => chip(cfg.arah === k, `DK.cfg('arah','${k}')`, t)).join("")}</div>
      <div class="dk-row" style="margin-bottom:8px;"><span class="dk-sm">Sumber:</span>${sumberTombol}</div>
      <div class="dk-row" style="margin-bottom:12px;"><span class="dk-sm">Jumlah:</span>${[10, 20, 50, 0].map(n => chip(cfg.jumlah === n, `DK.cfg('jumlah',${n})`, n || "Semua")).join("")}</div>
      <button class="btn" onclick="DK.mulai()" ${h.n ? "" : "disabled"}>▶ Mulai</button>
      ${cfg.mode === "flash" ? `<span class="dk-sm" style="margin-left:8px;">Geser kartu / ← Lupa · → Ingat · Spasi balik · Backspace kembali</span>` : ""}</div>
    <div class="panel"><h2>${cEd ? "✏️ Edit kartu" : "➕ Tambah kartu"}</h2>
      <div class="dk-frm">
        <input id="dk-k" placeholder="Kata (kanji/kana) *" value="${fv("k")}">
        <input id="dk-y" placeholder="Kana / bacaan" value="${fv("y")}">
        <input id="dk-a" placeholder="Arti *" value="${fv("a")}">
      </div>
      <details style="margin:8px 0;" ${cEd ? "open" : ""}><summary class="dk-sm" style="cursor:pointer;">Opsional: contoh, arti contoh, catatan, tag</summary>
        <div class="dk-frm" style="margin-top:8px;"><input id="dk-c" placeholder="Contoh kalimat" value="${fv("c")}"><input id="dk-ca" placeholder="Arti contoh" value="${fv("ca")}"><input id="dk-n" placeholder="Catatan" value="${fv("n")}"><input id="dk-t" placeholder="Tag" value="${fv("t")}"></div></details>
      <div class="dk-row"><button class="btn" onclick="DK.simpanKartu()">${cEd ? "💾 Simpan perubahan" : "➕ Tambah"}</button>${cEd ? `<button class="btn ghost" onclick="DK.batalEdit()">Batal</button>` : ""}</div>
      ${cEd ? "" : `<details style="margin-top:12px;"><summary class="dk-sm" style="cursor:pointer;">📋 Tempel massal (satu baris = satu kartu)</summary>
        <p class="dk-sm" style="margin:8px 0;">Format: <code>kata | kana | arti</code> atau <code>kata | arti</code>. Pemisah boleh <code>|</code>, Tab (tempel dari Excel), atau <code>;</code>.</p>
        <textarea id="dk-bulk" class="dk-ta" rows="6" placeholder="食べる | たべる | makan&#10;学校 | がっこう | sekolah"></textarea>
        <button class="btn" style="margin-top:8px;" onclick="DK.bulk()">➕ Tambahkan semua</button></details>`}</div>
    <div class="panel"><h2>📇 Kartu <small style="font-size:12px;color:var(--gray);font-weight:400;">${all.length}${q ? "/" + h.n : ""}</small></h2>
      <input placeholder="Cari kata / arti / tag…" value="${esc(V.q)}" onchange="DK.cari(this.value)" style="margin-bottom:10px;max-width:320px;">
      <div class="table-wrap"><table><thead><tr><th>Kata</th><th>Kana</th><th>Arti</th><th>Contoh</th><th>Tag</th><th></th></tr></thead><tbody>${rows || `<tr><td colspan="6" style="color:var(--gray);">Belum ada kartu.</td></tr>`}</tbody></table></div>
      ${pages > 1 ? `<div class="dk-row" style="margin-top:10px;"><button class="btn sm ghost" ${pg ? "" : "disabled"} onclick="DK.page(${pg - 1})">‹</button><span class="dk-sm">${pg + 1} / ${pages}</span><button class="btn sm ghost" ${pg < pages - 1 ? "" : "disabled"} onclick="DK.page(${pg + 1})">›</button></div>` : ""}</div>`;
}

function viewStudy() {
  const S = V.S, total = S.q.length, pct = Math.min(100, Math.round(S.i / total * 100));
  const top = `<div class="dk-row" style="margin-bottom:4px;"><button class="btn sm ghost" onclick="DK.keluar()">← Keluar</button><b>${MODES[S.mode]}</b><span class="dk-sm">${Math.min(S.i + 1, total)} / ${total}</span><span style="flex:1"></span>${furiBtn()}<span class="chip on">✓ ${S.b}</span><span class="chip" style="background:var(--red);">✗ ${S.s}</span></div><div class="dk-bar"><i style="width:${pct}%"></i></div>`;
  if (S.mode === "cocok") return top + viewCocok();
  if (S.i >= total) return top + viewSelesai();
  const it = S.q[S.i], c = it.c;
  const depan = it.ar === "jp" ? pk(c) : c.a, depanH = it.ar === "jp" ? `<span class="dk-furi">${furi(c)}</span>` : esc(c.a);
  const speak = it.ar === "jp" ? `<button class="btn sm ghost" onclick="event.stopPropagation();DK.suara()">🔊</button>` : "";
  if (S.mode === "flash") {
    const rev = it.ar === "id", ada = c.y && c.y !== pk(c);
    const reading = ada ? `<div class="reading">${esc(c.y)}</div>` : "";
    const extra = `${c.c ? `<div class="contoh">${rubyBr(c.c)}${c.ca ? `<br><i style="font-family:var(--font-sans);">${esc(c.ca)}</i>` : ""}</div>` : ""}${c.n ? `<div class="dk-sm" style="margin-top:8px;">📝 ${esc(c.n)}</div>` : ""}`;
    const front = rev ? `<div class="front" style="font-size:clamp(26px,7vw,48px);font-family:var(--font-sans);">${esc(c.a)}</div>` : `<div class="front f-jp dk-furi">${furi(c)}</div>`;
    const back = rev ? `<div class="front f-jp dk-furi" style="font-size:clamp(34px,10vw,64px);margin-top:0;">${furi(c)}</div>${reading}${extra}` : `${reading}<div class="arti">${esc(c.a)}</div>${extra}`;
    const kembali = S.hist && S.hist.length ? `<button class="flash-btn back" onclick="DK.undo()" title="Kembali ke kartu sebelumnya">↶ Kembali</button>` : `<button class="flash-btn back" disabled>↶ Kembali</button>`;
    return top + `<div class="flash-stage"><span class="flash-badge left" id="badge-lupa">✕ LUPA</span><span class="flash-badge right" id="badge-ingat">✓ INGAT</span>
      <div class="flash-card enter ${S.flip ? "revealed" : ""}" id="flash-card" data-say="${esc(pk(c) || c.y)}" onclick="DK.tap(event)">
        <div class="no-pill">${S.i + 1}${baru(c) ? " · 🆕" : ""}${c.t ? " · " + esc(c.t) : ""}</div>
        ${front}<div class="back-face">${back}</div>
        <button class="say-btn" title="Dengarkan" onclick="event.stopPropagation();DK.suara()">🔊</button>
        <div class="tap-hint">👆 Tap kartu = bolak-balik · ← Geser Lupa · Ingat Geser →</div></div></div>
      <div class="flash-actions"><button class="flash-btn lupa" onclick="DK.rate(0)"><span class="ico">←</span><span>Lupa</span></button>${kembali}<button class="flash-btn ingat" onclick="DK.rate(2)"><span class="ico">→</span><span>Ingat</span></button></div>`;
  }
  if (S.mode === "pg") {
    const opts = it.opsi.map((o, i) => {
      const cl = S.pick < 0 ? "" : i === it.ans ? "ok" : i === S.pick ? "no" : "";
      return `<button class="dk-opt ${cl}" ${S.pick >= 0 ? "disabled" : ""} onclick="DK.pilih(${i})">${i + 1}. ${esc(o)}</button>`;
    }).join("");
    return top + `<div class="dk-card" style="min-height:160px;cursor:default;"><div class="dk-sm">${it.ar === "jp" ? "Apa artinya?" : "Kata Jepangnya?"}</div><div class="dk-big" ${it.ar === "id" ? `style="font-size:30px;font-family:var(--font-sans);"` : ""}>${depanH}</div>${speak}</div><div style="margin-top:12px;">${opts}</div>
      ${S.pick >= 0 ? `<button class="btn" style="width:100%;" onclick="DK.lanjut()">Lanjut ›</button>` : ""}`;
  }
  // ketik
  const tj = tujuanKetik(it), tanya = it.ar === "jp" ? (c.y ? "Ketik cara baca (kana)" : "Ketik artinya") : "Ketik kata Jepangnya (kanji/kana)";
  const hasil = S.cek ? `<div class="alert ${S.cek.ok ? "alert-ok" : "alert-err"}" style="margin-top:12px;">${S.cek.ok ? "✓ Benar!" : "✗ Salah"} — jawaban: <b>${esc(tj.join(" / "))}</b>${S.cek.ok ? "" : `<br>Jawabanmu: ${esc(S.cek.val)}`}</div>` : "";
  return top + `<div class="dk-card" style="min-height:160px;cursor:default;"><div class="dk-sm">${tanya}</div><div class="dk-big" ${it.ar === "id" ? `style="font-size:30px;font-family:var(--font-sans);"` : ""}>${depanH}</div>${speak}</div>
    <div style="margin-top:12px;"><input id="dk-in" class="dk-in" autocomplete="off" ${S.cek ? "disabled" : ""} value="${esc(S.cek ? S.cek.val : "")}" onkeydown="if(event.key==='Enter'&&!event.isComposing){event.preventDefault();DK.cek();}" placeholder="…"></div>
    ${hasil}<div style="margin-top:10px;">${S.cek ? `<button class="btn" style="width:100%;" onclick="DK.lanjut()">Lanjut ›</button>` : `<button class="btn" style="width:100%;" onclick="DK.cek()">Periksa</button>`}</div>`;
}

function viewCocok() {
  const S = V.S, R = S.round;
  if (!R) return viewSelesai();
  const lt = it => it.ar === "jp" ? `<span class="dk-furi">${furi(it.c)}</span>` : esc(it.c.a), rt = it => it.ar === "jp" ? esc(it.c.a) : esc(teksJawab(it.c, "id"));
  const tile = (it, side, i) => {
    const key = side + i, done = R.done.has(it), sel = (side === "L" ? R.sl : R.sr) === i;
    const bad = R.bad && R.bad[side] === i;
    return `<button class="dk-tile ${done ? "ok" : bad ? "bad" : sel ? "sel" : ""}" ${done ? "disabled" : ""} onclick="DK.mt('${side}',${i})">${side === "L" ? lt(it) : rt(it)}</button>`;
  };
  return `<div class="dk-sm" style="margin-bottom:8px;">Pilih satu di kiri, lalu pasangannya di kanan.</div><div class="dk-mt"><div>${R.L.map((it, i) => `<div style="margin-bottom:8px;">${tile(it, "L", i)}</div>`).join("")}</div><div>${R.R.map((it, i) => `<div style="margin-bottom:8px;">${tile(it, "R", i)}</div>`).join("")}</div></div>
    ${R.done.size === R.L.length ? `<button class="btn" style="width:100%;margin-top:8px;" onclick="DK.lanjut()">${S.i + R.L.length >= S.q.length ? "Selesai ›" : "Ronde berikutnya ›"}</button>` : ""}`;
}

function viewSelesai() {
  const S = V.S, tot = S.b + S.s, p = tot ? Math.round(S.b / tot * 100) : 100;
  return `<div class="panel" style="text-align:center;"><h2>🎉 Selesai</h2><div style="font-size:42px;font-weight:800;">${p}%</div>
    <p class="dk-sm" style="margin:8px 0 14px;">${S.b} benar · ${S.s} salah · ${S.q.length} kartu</p>
    <div class="dk-row" style="justify-content:center;">${S.salah.length ? `<button class="btn" onclick="DK.ulangSalah()">🔁 Ulangi yang salah (${S.salah.length})</button>` : ""}<button class="btn ghost" onclick="DK.keluar()">Kembali ke deck</button></div></div>`;
}

/* ---------- Aksi ---------- */
const val = id => (document.getElementById(id) || {}).value || "";
let swiped = false, drag = null, winOn = false;
const THRESH = 90;
function fit() {   // kata panjang / banyak furigana dikecilkan sampai muat di kartu
  const card = document.getElementById("flash-card"), f = card && card.querySelector(".front.f-jp"); if (!f) return;
  f.style.fontSize = ""; let fs = parseFloat(getComputedStyle(f).fontSize) || 72, n = 0;
  const over = () => f.scrollWidth > card.clientWidth - 40 || card.scrollHeight > card.clientHeight + 1;
  while (n++ < 30 && fs > 18 && over()) { fs *= 0.88; f.style.fontSize = fs + "px"; }
}
function bindSwipe() {
  const card = document.getElementById("flash-card"); if (!card) return;
  const bl = () => document.getElementById("badge-lupa"), br = () => document.getElementById("badge-ingat");
  const down = (x, y) => { drag = { x, y, dx: 0, card }; swiped = false; card.classList.add("swiping"); };
  card.addEventListener("touchstart", e => down(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  card.addEventListener("touchmove", e => move(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  card.addEventListener("touchend", up); card.addEventListener("touchcancel", cancel);
  card.addEventListener("mousedown", e => down(e.clientX, e.clientY));
  if (!winOn) { winOn = true; window.addEventListener("mousemove", e => { if (drag) move(e.clientX, e.clientY); }); window.addEventListener("mouseup", () => { if (drag) up(); }); }
  function move(x, y) {
    if (!drag) return; const dx = x - drag.x, dy = y - drag.y; drag.dx = dx;
    if (Math.abs(dy) > Math.abs(dx) * 1.2 && Math.abs(dy) > 20) return cancel();
    if (Math.abs(dx) > 8) swiped = true;
    drag.card.style.transform = `translateX(${dx}px) rotate(${dx / 20}deg)`;
    if (bl()) bl().style.opacity = dx < 0 ? Math.min(1, -dx / THRESH) : 0; if (br()) br().style.opacity = dx > 0 ? Math.min(1, dx / THRESH) : 0;
  }
  function up() {
    const d = drag; if (!d) return; drag = null; d.card.classList.remove("swiping");
    if (d.dx <= -THRESH) { d.card.classList.add("leave-left"); setTimeout(() => DK.rate(0), 180); }
    else if (d.dx >= THRESH) { d.card.classList.add("leave-right"); setTimeout(() => DK.rate(2), 180); }
    else cancel(d.card);
  }
  function cancel(c) { const cd = (c && c.style ? c : drag && drag.card) || card; drag = null; cd.classList.remove("swiping"); cd.style.transform = ""; if (bl()) bl().style.opacity = 0; if (br()) br().style.opacity = 0; }
}
let keyOn = false;
function installKeys() {
  if (keyOn) return; keyOn = true;
  document.addEventListener("keydown", e => {
    if (!document.getElementById("dk-root") || V.view !== "study" || !V.S) return;
    const t = e.target && e.target.tagName; if (t === "INPUT" || t === "TEXTAREA" || t === "SELECT") return;
    const S = V.S;
    if (S.mode === "flash" && S.i < S.q.length) {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); DK.tap({}); }
      else if (e.key === "ArrowLeft") DK.rate(0);
      else if (e.key === "ArrowRight") DK.rate(2);
      else if (e.key === "Backspace" || e.key === "ArrowUp") { e.preventDefault(); DK.undo(); }
    } else if (S.mode === "pg" && S.i < S.q.length) {
      if (S.pick < 0 && /^[1-4]$/.test(e.key) && +e.key <= S.q[S.i].opsi.length) DK.pilih(+e.key - 1);
      else if (S.pick >= 0 && (e.key === " " || e.key === "Enter")) { e.preventDefault(); DK.lanjut(); }
    }
  });
}

export async function renderDeckTab(fb, ctx) {
  FB = fb; CTX = ctx;
  if (!FB.userIsGuru()) return `<div class="card">Khusus guru.</div>`;
  try { IDX = await ST.index(); } catch (e) { return `<div class="alert alert-err">Gagal memuat deck: ${esc(e.message || e)}</div>`; }
  LOKALN = 0;
  if (!LOKAL) { try { const ids = new Set(IDX.map(x => x.id)); LOKALN = (await IDB.all()).filter(x => !ids.has(x.id)).length; } catch (e) {} }
  if (V.view === "study" && !V.S) V.view = V.deck ? "deck" : "list";
  if (V.view === "deck" && !V.deck) V.view = "list";
  window.DK = {
    list() { V.view = "list"; V.deck = null; V.id = ""; V.q = ""; V.page = 0; V.edit = null; paint(); },
    async buka(id) { try { const d = await ST.get(id); if (!d) return toast("Deck tidak ditemukan"); d.cards = d.cards || []; V.deck = d; V.id = id; V.view = "deck"; V.q = ""; V.page = 0; V.edit = null; paint(); } catch (e) { toast("❌ " + (e.message || e)); } },
    async baru() {
      const nama = (prompt("Nama deck baru:") || "").trim(); if (!nama) return;
      V.deck = { id: newId(), nama, cards: [] };
      try { await simpan(); V.view = "deck"; V.q = ""; V.page = 0; V.edit = null; paint(); } catch (e) { toast("❌ " + (e.message || e)); }
    },
    async rename() { const nama = (prompt("Nama deck:", V.deck.nama) || "").trim(); if (!nama) return; V.deck.nama = nama; try { await simpan(); paint(); } catch (e) { toast("❌ " + (e.message || e)); } },
    async hapusDeck() {
      if (!confirm(`Hapus deck "${V.deck.nama}" beserta ${V.deck.cards.length} kartu? Tidak bisa dibatalkan.`)) return;
      try { await ST.del(V.deck.id); IDX = IDX.filter(x => x.id !== V.deck.id); await ST.setIndex(IDX); toast("🗑 Deck dihapus"); DK.list(); } catch (e) { toast("❌ " + (e.message || e)); }
    },
    cari(v) { V.q = v; V.page = 0; paint(); }, page(n) { V.page = n; paint(); },
    cfg(k, v) { V.cfg[k] = v; if (k === "mode" && v !== "flash" && V.cfg.sumber === "due") V.cfg.sumber = "semua"; if (k === "mode" && v === "flash") V.cfg.sumber = "due"; paint(); },
    mulai, template: buatTemplate, ekspor,
    // --- kartu ---
    edit(i) { V.edit = i; paint(); window.scrollTo({ top: 0, behavior: "smooth" }); }, batalEdit() { V.edit = null; paint(); },
    async simpanKartu() {
      const c = { k: val("dk-k").trim(), y: val("dk-y").trim(), a: val("dk-a").trim(), c: val("dk-c").trim(), ca: val("dk-ca").trim(), n: val("dk-n").trim(), t: val("dk-t").trim() };
      if (!c.k) return toast("Kata wajib diisi"); if (!c.a && !c.y) return toast("Isi Arti atau Kana");
      const d = V.deck, ed = V.edit;
      if (ed !== null && ed >= 0) d.cards[ed] = { ...d.cards[ed], ...c };
      else { if (d.cards.some(x => keyOf(x) === keyOf(c))) return toast("Kartu dobel, dilewati"); d.cards.push(c); }
      try { await simpan(); V.edit = null; paint(); toast(ed !== null ? "✓ Kartu diperbarui" : "✓ Kartu ditambah"); setTimeout(() => { const k = document.getElementById("dk-k"); if (k) k.focus(); }, 30); } catch (e) { toast("❌ " + (e.message || e)); }
    },
    async hapusKartu(i) { const c = V.deck.cards[i]; if (!confirm(`Hapus kartu "${pk(c)}"?`)) return; V.deck.cards.splice(i, 1); try { await simpan(); paint(); } catch (e) { toast("❌ " + (e.message || e)); } },
    async bulk() {
      const lines = val("dk-bulk").split(/\r?\n/).map(s => s.trim()).filter(Boolean); if (!lines.length) return toast("Kosong");
      const aoa = lines.map(l => (l.includes("\t") ? l.split("\t") : l.includes("|") ? l.split("|") : l.split(";")).map(s => s.trim()));
      const norm3 = aoa.map(r => r.length === 2 ? [r[0], "", r[1]] : r);
      const p = parseRows(norm3.map(r => r)), d = V.deck, ada = new Set(d.cards.map(keyOf));
      const baruK = p.cards.filter(c => !ada.has(keyOf(c)));
      d.cards.push(...baruK);
      try { await simpan(); paint(); toast(`✓ ${baruK.length} kartu ditambah` + (p.skip.length || p.cards.length - baruK.length ? ` · ${p.skip.length + p.cards.length - baruK.length} dilewati` : "")); } catch (e) { toast("❌ " + (e.message || e)); }
    },
    // --- impor ---
    async pilihFile(el) {
      const fs = [...el.files]; el.value = ""; if (!fs.length) return;
      if (typeof XLSX === "undefined") return toast("❌ Library Excel (SheetJS) belum termuat. Cek koneksi lalu muat ulang.");
      const st = [];
      for (const f of fs) { try { st.push(...await bacaFile(f)); } catch (e) { toast(`❌ ${f.name}: ${e.message || e}`); } }
      if (!st.length) return toast("Tidak ada baris kartu yang terbaca. Pakai Template Excel.");
      V.stage = st; paint();
    },
    stOn(i, b) { V.stage[i].on = b; paint(); }, stTarget(i, v) { V.stage[i].target = v; paint(); }, stNama(i, v) { V.stage[i].nama = v.trim() || V.stage[i].nama; },
    batalStage() { V.stage = null; paint(); },
    async submit() {
      const pilih = V.stage.filter(s => s.on && s.cards.length); if (!pilih.length) return toast("Tidak ada deck yang dicentang");
      V.busy = true; paint(); let nd = 0, nk = 0, gagal = 0; const sisa = [];
      for (const s of pilih) {
        try {
          let d;
          if (s.target === "new") d = { id: newId(), nama: s.nama, cards: [] };
          else { d = await ST.get(s.target); d.cards = d.cards || []; }
          const ada = new Set(d.cards.map(keyOf)), tambah = s.cards.filter(c => !ada.has(keyOf(c)));
          d.cards.push(...tambah);
          await ST.put(d); IDX = [...IDX.filter(x => x.id !== d.id), meta(d)]; nd++; nk += tambah.length;
        } catch (e) { gagal++; sisa.push(s); toast(`❌ ${s.nama}: ${e.message || e}`); }
      }
      try { await ST.setIndex(IDX); } catch (e) {}
      V.busy = false; V.stage = sisa.length ? sisa : null;
      paint(); toast(`✓ ${nk} kartu masuk ke ${nd} deck` + (gagal ? ` · ${gagal} gagal` : ""));
    },
    async migrasi() {
      try { const ids = new Set(IDX.map(x => x.id)); let n = 0; for (const d of (await IDB.all())) if (!ids.has(d.id)) { await FB.deckPut(d); IDX.push(meta(d)); n++; } await FB.deckSetIndex(IDX); LOKALN = 0; paint(); toast(`☁️ ${n} deck dipindahkan ke cloud`); } catch (e) { toast("❌ " + (e.message || e)); }
    },
    // --- sesi ---
    keluar() { simpanSesi(); V.S = null; V.view = "deck"; paint(); },
    flip() { V.S.flip = true; paint(); },
    rate(q) {
      const S = V.S, it = S.q[S.i]; if (!it || S.lock) return; const c = it.c;
      const h = { it, i: S.i, prev: { iv: c.iv, ez: c.ez, r: c.r, l: c.l, due: c.due, last: c.last }, salahBaru: false, ins: -1, b: S.b, s: S.s, dirty: S.dirty };
      const r = sched(c, q);
      c.iv = r.iv; c.ez = r.ez; c.last = Date.now(); c.due = q === 0 ? Date.now() : Date.now() + r.iv * DAY;
      if (q === 0) { c.l = (c.l || 0) + 1; if (!S.salah.includes(c)) { S.salah.push(c); S.s++; h.salahBaru = true; } h.ins = Math.min(S.i + 4, S.q.length); S.q.splice(h.ins, 0, it); }
      else { c.r = (c.r || 0) + 1; if (!S.salah.includes(c)) S.b++; }
      (S.hist = S.hist || []).push(h);
      S.dirty++; selesaiItem(); if (S.dirty >= 10 || S.i >= S.q.length) simpanSesi(); paint();
    },
    undo() {
      const S = V.S, h = S.hist && S.hist.pop(); if (!h) return;
      const c = h.it.c; for (const k of Object.keys(h.prev)) { if (h.prev[k] === undefined) delete c[k]; else c[k] = h.prev[k]; }
      if (h.ins >= 0) S.q.splice(h.ins, 1);
      if (h.salahBaru) S.salah = S.salah.filter(x => x !== c);
      S.b = h.b; S.s = h.s; S.i = h.i; S.flip = false; S.dirty = h.dirty + 1; paint();
    },
    tap(ev) {
      if (swiped) { swiped = false; return; }
      const S = V.S, card = document.getElementById("flash-card"); if (!card) return;
      S.flip = !S.flip; card.classList.toggle("revealed", S.flip); fit();
    },
    furi() { try { localStorage.setItem("shirose-haf-furi", furiOn() ? "0" : "1"); } catch (e) {} applyFuri(); const b = document.getElementById("dk-furi-btn"); if (b) { b.textContent = furiOn() ? "ふりがな ON" : "ふりがな OFF"; b.setAttribute("aria-pressed", String(furiOn())); } fit(); },
    pilih(i) { const S = V.S, it = S.q[S.i]; if (S.pick >= 0) return; S.pick = i; if (i === it.ans) S.b++; else { S.s++; S.salah.push(it.c); } paint(); },
    cek() {
      const S = V.S, it = S.q[S.i]; if (S.cek) return;
      const v = val("dk-in"); if (!v.trim()) return;
      const tj = tujuanKetik(it), ok = tj.some(t => n2(t) === n2(v)) || (it.ar === "jp" && !it.c.y && n2(it.c.a) === n2(v));
      S.cek = { ok, val: v }; if (ok) S.b++; else { S.s++; S.salah.push(it.c); } paint();
    },
    lanjut() {
      const S = V.S;
      if (S.mode === "cocok") { S.i += S.round.L.length; if (S.i >= S.q.length) S.round = null; else mulaiRonde(); paint(); return; }
      selesaiItem(); paint();
    },
    mt(side, i) {
      const S = V.S, R = S.round; if (!R || R.bad) return;
      if (side === "L") R.sl = R.sl === i ? -1 : i; else R.sr = R.sr === i ? -1 : i;
      if (R.sl >= 0 && R.sr >= 0) {
        const a = R.L[R.sl], b = R.R[R.sr];
        if (a === b) { R.done.add(a); S.b++; R.sl = R.sr = -1; }
        else { S.s++; if (!S.salah.includes(a.c)) S.salah.push(a.c); R.bad = { L: R.sl, R: R.sr }; paint(); setTimeout(() => { if (V.S && V.S.round === R) { R.bad = null; R.sl = R.sr = -1; paint(); } }, 600); return; }
      }
      paint();
    },
    ulangSalah() {
      const S = V.S, set = new Set(S.salah), items = S.q.filter((it, i, a) => set.has(it.c) && a.findIndex(x => x.c === it.c) === i);
      V.S = { ...S, hist: [], q: rnd(items), i: 0, flip: false, pick: -1, cek: null, b: 0, s: 0, salah: [], round: null, dirty: S.dirty };
      if (V.S.mode === "pg") V.S.q.forEach(it => buatOpsi(it, V.deck.cards));
      if (V.S.mode === "cocok") mulaiRonde();
      paint();
    },
    suara() { try { const S = V.S, it = S.q[S.i], u = new SpeechSynthesisUtterance(it.c.y || pk(it.c)); u.lang = "ja-JP"; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { toast("Suara tidak didukung browser ini"); } },
  };
  installKeys(); applyFuri();
  return `<div id="dk-root">${view()}</div>`;
}
