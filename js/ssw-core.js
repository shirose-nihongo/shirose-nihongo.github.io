/* =====================================================================
 * SSW (特定技能) — CORE: data, progres, spaced repetition (SM-2), util.
 * Tanpa UI. Dipakai oleh js/ssw.js.
 *
 * Sumber data (statis, di repo):
 *   data/ssw/{slug}/index.json   manifest bidang (daftar bab, file kosakata, kuis)
 *   data/ssw/{slug}/babN.json    bab → subbab → materi lengkap + ringkasan (ID & JP)
 *   data/ssw/{slug}/vocab.json   bank kosakata (otomatis dikumpulkan dari bab)
 *   data/ssw/{slug}/quiz.json    3 kuis per bab + bank soal untuk 3 kuis penuh
 *   assets/ssw/{slug}/{id|jp}/pNN.webp   halaman buku (gambar) untuk "Buku Interaktif"
 *
 * Konfigurasi guru (Firestore, dilindungi rules):
 *   ssw_bidang/{slug}  { nama, jp, aktif, urut, tema, gambar, bab:{babId:"draft|published|hidden"} }
 * Progres siswa (Firestore, per akun):
 *   siswa/{uid}/ssw_progres/{slug}
 * ===================================================================== */

let FB = null;
export function initSswCore(fb) { FB = fb; }

const S = () => window.__SHIROSE_STATE || {};
export const uidNow = () => S().user?.uid || "guest";
export const isGuest = () => !S().user || (FB && FB.isGuestUser && FB.isGuestUser());
export const isGuru = () => { try { return !!(FB && FB.userIsGuru && FB.userIsGuru()); } catch (e) { return false; } };
export const DAY = 86400000, MIN = 60000;

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const attr = esc;

/* ---------- markup teks: {漢字|かんじ} → ruby, **tebal** ---------- */
export function rich(s, opt = {}) {
  let t = esc(s);
  t = t.replace(/\{([^|{}]+)\|([^{}]+)\}/g, (m, b, r) => opt.ruby === false ? b : `<ruby>${b}<rt>${r}</rt></ruby>`);
  t = t.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
  t = t.replace(/\n/g, "<br>");   // baris baru (dialog pada soal)
  return t;
}
/** teks polos tanpa markup (untuk TTS & pencarian) */
export const plain = (s) => String(s ?? "").replace(/\{([^|{}]+)\|([^{}]+)\}/g, "$1").replace(/\*\*/g, "");
/** teks untuk dibacakan (pakai furigana) */
export const spoken = (s) => String(s ?? "").replace(/\{([^|{}]+)\|([^{}]+)\}/g, "$2").replace(/\*\*/g, "");

export const shuffle = (a, rnd = Math.random) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export function seeded(seed) { let s = 0; for (const c of String(seed)) s = (s * 31 + c.charCodeAt(0)) >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
};

/* ============================ DATA ============================ */
const cache = {};
/** Tunggu promise maksimal ms; lewat itu pakai nilai cadangan (jaringan HP lambat tidak boleh membekukan halaman). */
const withTimeout = (p, ms, fb) => new Promise(res => { let d = false; const t = setTimeout(() => { if (!d) { d = true; res(fb); } }, ms); Promise.resolve(p).then(v => { if (!d) { d = true; clearTimeout(t); res(v); } }, () => { if (!d) { d = true; clearTimeout(t); res(fb); } }); });
const _lsj = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
const _lss = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
async function getJSON(url) {
  if (!cache[url]) cache[url] = fetch(url).then(r => { if (!r.ok) throw new Error(`${url}: ${r.status}`); return r.json(); }).catch(e => { delete cache[url]; throw e; });
  return cache[url];
}

/** Daftar bidang bawaan — dipakai bila guru belum membuat dokumen di Firestore.
 *  Hanya building-cleaning yang punya materi (hasContent). Sisanya "belum tersedia". */
export const DEFAULT_BIDANG = [
  { slug: "building-cleaning", nama: "Building Cleaning", jp: "ビルクリーニング", aktif: true, urut: 1, tema: "building", hasContent: true },
  { slug: "kaigo", nama: "Kaigo", jp: "介護", aktif: true, urut: 2, tema: "kaigo", hasContent: true },
  { slug: "kaigo-jp", nama: "Kaigo (Bahasa Jepang)", jp: "介護の日本語", induk: "kaigo", aktif: true, urut: 2.5, tema: "kaigo", hasContent: true },
  { slug: "food-manufacturing", nama: "Food Manufacturing", jp: "飲食料品製造業", aktif: true, urut: 3, tema: "factory", hasContent: true },
  { slug: "food-service", nama: "Food Service (Jasa Boga)", jp: "外食業", aktif: true, urut: 4, tema: "restaurant", hasContent: true },
  { slug: "agriculture", nama: "Agriculture (Pertanian)", jp: "農業", aktif: true, urut: 5, tema: "farm", hasContent: true },
  { slug: "construction", nama: "Construction", jp: "建設", label: "🏗️ Sipil (Doboku) ›", aktif: true, urut: 6, tema: "construction", hasContent: true },
  { slug: "construction-bangunan", nama: "Construction (Bangunan)", jp: "建設（建築）", label: "🏢 Bangunan (Kenchiku) ›", induk: "construction", aktif: true, urut: 6.1, tema: "construction", hasContent: true },
  { slug: "construction-lifeline", nama: "Construction (Lifeline & Peralatan)", jp: "建設（ライフライン・設備）", label: "🔧 Lifeline & Peralatan ›", induk: "construction", aktif: true, urut: 6.2, tema: "construction", hasContent: true },
  { slug: "accommodation", nama: "Accommodation (Penginapan)", jp: "宿泊", aktif: true, urut: 7, tema: "hotel", hasContent: true },
  { slug: "livestock", nama: "Livestock (Peternakan)", jp: "畜産業", aktif: true, urut: 8, tema: "farm", hasContent: true },
  { slug: "fishery", nama: "Fishery (Perikanan)", jp: "漁業", aktif: true, urut: 9, tema: "fishery", hasContent: true },
  { slug: "auto-maintenance", nama: "Auto Maintenance (Perawatan Mobil)", jp: "自動車整備", aktif: true, urut: 10, tema: "automobile", hasContent: true },
  { slug: "industrial-mfg", nama: "Industrial Manufacturing (Manufaktur)", jp: "工業製品製造業", aktif: true, urut: 11, tema: "machine", hasContent: true, hub: true },
  { slug: "jaim-machine-metal", nama: "機械金属加工 — Buku Resmi JAIM", jp: "機械金属加工", label: "📘 Mesin & Logam (Resmi) ›", induk: "industrial-mfg", aktif: true, urut: 11.1, tema: "machine", hasContent: true },
  { slug: "jaim-elec-electronic", nama: "電気電子機器組立て — Buku Resmi JAIM", jp: "電気電子機器組立て", label: "📘 Elektrik & Elektronik (Resmi) ›", induk: "industrial-mfg", aktif: true, urut: 11.2, tema: "electronic", hasContent: true },
  { slug: "jaim-metal-surface", nama: "金属表面処理 — Buku Resmi JAIM", jp: "金属表面処理", label: "📘 Perlakuan Permukaan Logam (Resmi) ›", induk: "industrial-mfg", aktif: true, urut: 11.3, tema: "plating", hasContent: true },
  { slug: "wood-industry", nama: "Wood Industry (Industri Kayu)", jp: "木材産業", aktif: true, urut: 12, tema: "wood", hasContent: true },
  { slug: "auto-transport", nama: "Automobile Transportation (Truk & Bus)", jp: "自動車運送業（トラック・バス）", aktif: true, urut: 13, tema: "truck", hasContent: true },
  { slug: "forestry", nama: "Forestry (Kehutanan)", jp: "林業", aktif: true, urut: 15, tema: "forestry", hasContent: true },
  { slug: "linen-supply", nama: "Linen Supply", jp: "リネンサプライ", aktif: true, urut: 16, tema: "linen", hasContent: true },
  { slug: "railway", nama: "Railway (Perkeretaapian)", jp: "鉄道", aktif: true, urut: 14, tema: "railway", hasContent: true, hub: true },
  { slug: "railway-track", nama: "Railway — Jalur Rel (軌道整備)", jp: "鉄道（軌道整備）", label: "🛤️ Jalur Rel (軌道整備) ›", induk: "railway", aktif: true, urut: 14.2, tema: "railway", hasContent: true },
  { slug: "railway-electrical", nama: "Railway — Kelistrikan (電気設備整備)", jp: "鉄道（電気設備整備）", label: "⚡ Kelistrikan (電気設備整備) ›", induk: "railway", aktif: true, urut: 14.3, tema: "railway", hasContent: true },
  { slug: "shipbuilding", nama: "Shipbuilding", jp: "造船・舶用工業", aktif: true, urut: 17, tema: "ship", hasContent: true },
  { slug: "railway-vehicle", nama: "Railway — Manufaktur Kereta (車両製造)", jp: "鉄道（車両製造）", label: "🚆 Manufaktur Kereta (車両製造) ›", induk: "railway", aktif: true, urut: 14.1, tema: "railway", hasContent: true },
  { slug: "logistics", nama: "Logistik / Pergudangan", jp: "物流倉庫", aktif: true, urut: 14, tema: "logistics", hasContent: true },
  { slug: "recycling", nama: "Daur Ulang Sumber Daya", jp: "資源循環", aktif: true, urut: 15, tema: "recycling", hasContent: true },
  { slug: "aviation", nama: "Aviation (Penerbangan)", jp: "航空", aktif: true, urut: 16, tema: "aviation", hasContent: true, hub: true },
  { slug: "aviation-gh", nama: "空港グランドハンドリング — Teks Resmi JAEA", jp: "空港グランドハンドリング", label: "🛫 Ground Handling (Resmi) ›", induk: "aviation", aktif: true, urut: 16.1, tema: "aviation", hasContent: true },
  { slug: "aviation-am", nama: "航空機整備 — Teks Resmi JAEA", jp: "航空機整備", label: "🔧 Aircraft Maintenance (Resmi) ›", induk: "aviation", aktif: true, urut: 16.2, tema: "aviation", hasContent: true },
];

/** Bidang buatan sendiri yang sudah dihapus (abaikan dokumen lama di Firestore). */
const SLUG_DIHAPUS = new Set(["mfg-machine-metal"]);
let _bidang = null;
/** Gabungan: bawaan + dokumen Firestore (Firestore menang). Dokumen yang ada di Firestore tapi tidak di bawaan ikut tampil. */
export async function loadBidang(force = false) {
  if (_bidang && !force) return _bidang;
  let remote = [];
  const _ck = "ssw-bidang-cache";
  try {
    if (FB && FB.loadSswBidang && !isGuest()) {
      const cached = _lsj(_ck);
      const fetchP = FB.loadSswBidang().then(r => { _lss(_ck, r); return r; });
      // Ada cache → pakai langsung, segarkan di latar belakang. Tanpa cache → tunggu maks 4 dtk.
      remote = cached ? (fetchP.catch(() => {}), cached) : await withTimeout(fetchP, 4000, []);
    }
  } catch (e) { console.warn("ssw: gagal memuat konfigurasi bidang:", e.message || e); }
  const map = new Map(DEFAULT_BIDANG.map(b => [b.slug, { ...b }]));
  for (const r of (remote || [])) {
    if (SLUG_DIHAPUS.has(r.slug)) continue;
    const base = map.get(r.slug) || { slug: r.slug, tema: "generic", urut: 99 };
    map.set(r.slug, { ...base, ...r });
  }
  _bidang = [...map.values()].sort((a, b) => (a.urut || 99) - (b.urut || 99));
  return _bidang;
}
export const bidangBySlug = async (slug) => (await loadBidang()).find(b => b.slug === slug) || null;

/** Manifest + semua bab + kosakata + kuis untuk satu bidang. */
const _pack = {};
export async function loadPack(slug) {
  if (_pack[slug]) return _pack[slug];
  _pack[slug] = (async () => {
    const base = `./data/ssw/${slug}`;
    const idx = await getJSON(`${base}/index.json`);
    const opt = (f, fb) => f ? getJSON(`${base}/${f}`).catch(() => fb) : Promise.resolve(fb);
    const [babs, vocab, quiz, figsR, kanji, bunpouR] = await Promise.all([
      Promise.all(idx.bab.map(b => getJSON(`${base}/${b.file}`))),
      opt(idx.vocab || "vocab.json", []),
      opt(idx.quiz || "quiz.json", { bab: {}, full: [] }),
      opt(idx.figs, { figs: [] }),
      opt(idx.kanji, null),
      opt(idx.bunpou, null),
    ]);
    const figs = (figsR && figsR.figs) || [];
    const bunpou = (bunpouR && bunpouR.items) || null;
    const chapters = babs.map((d, i) => ({ ...d.bab, source: d.source, order: i, subs: d.bab.subs }));
    return { slug, idx, chapters, vocab: vocab.items || vocab, quiz, figs, kanji, bunpou };
  })();
  try { return await _pack[slug]; } catch (e) { delete _pack[slug]; throw e; }
}

/** Status bab yang berlaku: konfigurasi guru > bawaan "published". */
export const babStatus = (bidang, babId) => (bidang?.bab && bidang.bab[babId]) || "published";
export const siswaBolehBab = (bidang, babId) => isGuru() || babStatus(bidang, babId) === "published";


/* ============================ AKSES & LEADERBOARD ============================ */
/** Akses SSW.
 *  - siswa/{uid}.aksesSsw === false            → seluruh SSW diblokir (aturan lama, tetap berlaku).
 *  - Per bidang (slug), urutan prioritas:
 *      1. siswa/{uid}.aksesSswBidang[slug]  (true/false, diatur guru per siswa)
 *      2. kelas/{id}.aksesSswBidang[slug]   (true/false, diatur guru per kelas; dicocokkan lewat nama kelas)
 *      3. bawaan aman: hanya "building-cleaning" yang terbuka (seperti sebelum ada akses per bidang).
 *  Tanpa slug = cek akses SSW umum saja. */
export const BIDANG_BAWAAN_BUKA = "building-cleaning";
let _kelasAkses = null;   // { uid, map }
export async function loadKelasAkses() {
  const d = (FB && FB.getSiswaDoc && FB.getSiswaDoc()) || null;
  if (!d || !d.kelas || isGuru() || isGuest()) return {};
  if (_kelasAkses && _kelasAkses.uid === uidNow() && _kelasAkses.kelas === d.kelas) return _kelasAkses.map;
  let map = {};
  const _kk = "ssw-kelas-" + uidNow() + "-" + d.kelas;
  const _kc = _lsj(_kk);
  if (_kc) {   // pakai cache dulu, segarkan di latar belakang
    FB.listKelas().then(l => { const k = l.find(x => x.nama === d.kelas); const m = (k && k.aksesSswBidang) || {}; _lss(_kk, m); if (_kelasAkses) _kelasAkses.map = m; }).catch(() => {});
    _kelasAkses = { uid: uidNow(), kelas: d.kelas, map: _kc };
    return _kc;
  }
  try { const k = (await withTimeout(FB.listKelas(), 4000, null) || []).find(x => x.nama === d.kelas); map = (k && k.aksesSswBidang) || {}; if (k) _lss(_kk, map); } catch (e) { console.warn("ssw: akses kelas gagal dimuat:", e.message || e); }
  _kelasAkses = { uid: uidNow(), kelas: d.kelas, map };
  return map;
}
export function sswAllowed(slug) {
  if (isGuru()) return true;
  try { if (FB && FB.hasFullAccess && FB.hasFullAccess()) return true; } catch (e) {}   // grup demo: semua bidang SSW terbuka
  let d = null; try { d = FB && FB.getSiswaDoc && FB.getSiswaDoc(); } catch (e) {}
  if (d && d.aksesSsw === false) return false;
  if (!slug) return true;
  // Bidang "turunan" (mis. Kaigo Bahasa Jepang) mengikuti bidang induknya (Kaigo) kecuali diatur sendiri.
  const cek = (sl) => {
    const a = d && d.aksesSswBidang ? d.aksesSswBidang[sl] : undefined;
    if (typeof a === "boolean") return a;
    const k = _kelasAkses && _kelasAkses.uid === uidNow() ? _kelasAkses.map[sl] : undefined;
    return typeof k === "boolean" ? k : undefined;
  };
  let r = cek(slug);
  if (r === undefined) { const _b = DEFAULT_BIDANG.find(b => b.slug === slug) || {}, ind = _b.induk || _b.aksesDari; if (ind) r = cek(ind); }
  return typeof r === "boolean" ? r : (slug === BIDANG_BAWAAN_BUKA);
}
/** Poin: subbab dibaca ×10, kartu sudah dikuasai ×2 (+3 bila "kuasa"), skor terbaik tiap kuis ×0.5. */
export function points(P) {
  const baca = Object.keys(P.read || {}).length * 10;
  let kartu = 0; for (const c of Object.values(P.cards || {})) { if ((c.reps || 0) >= 1) kartu += 2; if ((c.reps || 0) >= 3 && (c.iv || 0) >= 7) kartu += 3; }
  let kuis = 0; for (const q of Object.values(P.quiz || {})) kuis += Math.max(0, q.best || 0) * 0.5;
  return { poin: Math.round(baca + kartu + kuis), rinci: { baca, kartu, kuis: Math.round(kuis) } };
}
const _rankT = {};
export function syncRank(slug) {
  if (isGuru() || isGuest() || !(FB && FB.saveSswRank)) return;
  const e = PS[slug]; if (!e) return;
  clearTimeout(_rankT[slug]);
  _rankT[slug] = setTimeout(async () => {
    try { const d = (FB.getSiswaDoc && FB.getSiswaDoc()) || {}; const r = points(e.P);
      await FB.saveSswRank(slug, { nama: d.nama || "Siswa", kelas: d.kelas || "", poin: r.poin, rinci: r.rinci }); } catch (err) { console.warn("ssw: rank gagal:", err.message || err); }
  }, 1200);
}
export async function loadRank(slug) {
  if (!(FB && FB.loadSswRank) || isGuest()) return [];
  const rows = await FB.loadSswRank(slug);
  return rows.sort((a, b) => (b.poin || 0) - (a.poin || 0) || String(a.nama).localeCompare(String(b.nama)));
}

/* ============================ PROGRES ============================ */
const DEF = () => ({ v: 1, u: 0, read: {}, cards: {}, quiz: {}, last: null, log: [] });
const PS = {};   // slug → { id, P }
const _timers = {};
const LKEY = (slug) => `shirose-ssw:${uidNow()}:${slug}`;

export async function getProgress(slug) {
  const id = uidNow();
  if (PS[slug] && PS[slug].id === id) return PS[slug].P;
  const local = LS.get(LKEY(slug), null);
  let remote = null;
  if (FB && FB.loadSswProgres && !isGuest()) { try { remote = await withTimeout(FB.loadSswProgres(slug), 4000, null); } catch (e) { console.warn("ssw: gagal memuat progres:", e.message || e); } }
  const pick = !local ? remote : !remote ? local : ((remote.u || 0) >= (local.u || 0) ? remote : local);
  const P = Object.assign(DEF(), pick || {});
  P.read = P.read || {}; P.cards = P.cards || {}; P.quiz = P.quiz || {}; P.log = P.log || [];
  PS[slug] = { id, P };
  return P;
}
/** Kartu hafalan SSW memakai MESIN JLPT (dokumen SRS "ssw-bc", kunci "s:<no>") → dipetakan ke bentuk kartu SSW untuk statistik. */
export const vnum = (v) => parseInt(String(v.id).replace(/\D/g, ""), 10) || 0;
let _srsT = 0;
export async function syncCards(P, vocab, force) {
  if (typeof window === "undefined" || !window.sswSrsLoad) return;
  if (!force && P._srsOk && Date.now() - _srsT < 2500) return;
  let srs = {}; try { srs = await withTimeout(window.sswSrsLoad(), 4000, null); } catch (e) { return; } if (!srs) return;
  _srsT = Date.now(); P._srsOk = 1;
  const out = {};
  for (const v of vocab) {
    const c = srs["s:" + vnum(v)]; if (!c) continue;
    const ok = c.last === "ingat", iv = c.mastered ? Math.max(c.interval || 1, 7) : (c.interval || 1);
    out[v.id] = { last: c.n > 0 ? (c.due || Date.now()) - iv * 86400000 : 0, due: c.due || 0, iv, reps: c.mastered ? 3 : ok ? Math.max(1, Math.min(c.n || 1, 5)) : 0, lg: ok ? 1 : 0, ok: ok ? c.n : 0, ng: ok ? 0 : c.n };
  }
  P.cards = out;
}
export function touch(slug) {
  const e = PS[slug]; if (!e) return;
  e.P.u = Date.now(); LS.set(LKEY(slug), e.P); syncRank(slug);
  clearTimeout(_timers[slug]); _timers[slug] = setTimeout(() => flush(slug), 1500);
}
export async function flush(slug) {
  const e = PS[slug]; if (!e) return;
  clearTimeout(_timers[slug]);
  if (FB && FB.saveSswProgres && !isGuest()) { try { await FB.saveSswProgres(slug, e.P); } catch (err) { console.warn("ssw: gagal menyimpan progres:", err.message || err); } }
}
export function flushAll() { for (const s of Object.keys(PS)) { LS.set(LKEY(s), PS[s].P); flush(s); } }
if (typeof window !== "undefined") {
  window.addEventListener("pagehide", flushAll);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flushAll(); });
}
export function logAct(slug, text) {
  const e = PS[slug]; if (!e) return;
  e.P.log.unshift({ t: Date.now(), x: text }); e.P.log.length = Math.min(e.P.log.length, 20);
}

/* ---------- progres bab (berdasar subbab dibaca + kuis) ---------- */
export function babProgress(P, chapter, vocab) {
  const subs = chapter.subs || [];
  const read = subs.filter(s => P.read[s.id]).length;
  const qids = [1, 2, 3].map(n => `${chapter.id}-q${n}`);
  const quizDone = qids.filter(q => (P.quiz[q]?.best ?? -1) >= 0).length;
  const total = subs.length + 3;
  const done = read + quizDone;
  const pct = total ? Math.round(100 * done / total) : 0;
  const words = vocab.filter(v => v.bab === chapter.id);
  const weak = words.filter(v => cardState(P.cards[v.id]) === "ulang" || cardState(P.cards[v.id]) === "belum").length;
  const hasQuizFail = qids.some(q => P.quiz[q] && P.quiz[q].best < 60);
  let status = "belum";
  if (pct >= 100 && !weak && !hasQuizFail) status = "selesai";
  else if (pct >= 100 && (weak || hasQuizFail)) status = "ulang";
  else if (pct > 0 || words.some(v => P.cards[v.id])) status = "proses";
  return { pct, read, subsTotal: subs.length, quizDone, status, weak };
}
export const STATUS_LABEL = { belum: "Belum dimulai", proses: "Sedang dipelajari", selesai: "Sudah selesai", ulang: "Perlu pengulangan" };

/* ============================ SM-2 FLASHCARD ============================ */
export const newCard = () => ({ ef: 2.5, iv: 0, reps: 0, lapses: 0, due: 0, ok: 0, ng: 0, last: 0, lg: null });

/** state tampilan: baru | belum | ulang | hafal | kuasa */
export function cardState(c, now = Date.now()) {
  if (!c || !c.last) return "baru";
  if (c.lg === 0 || c.reps === 0) return "belum";
  if (c.due <= now) return "ulang";
  if (c.reps >= 3 && c.iv >= 7) return "kuasa";
  return "hafal";
}
/** SM-2 disesuaikan dua tombol. grade: 1=belum hafal (again), 4=hafal (good). */
export function schedule(card, grade, now = Date.now()) {
  const c = { ...newCard(), ...card };
  c.last = now;
  if (grade >= 3) {
    c.ok++; c.lg = 1;
    c.iv = c.reps === 0 ? 1 : c.reps === 1 ? 3 : Math.round(c.iv * c.ef);
    c.reps++;
    c.ef = Math.max(1.3, c.ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
    c.due = now + c.iv * DAY;
  } else {
    c.ng++; c.lapses++; c.lg = 0; c.reps = 0; c.iv = 0;
    c.ef = Math.max(1.3, c.ef - 0.2);
    c.due = now + 10 * MIN;   // muncul lagi di sesi yang sama / segera
  }
  return c;
}
export function cardStats(P, vocab, now = Date.now()) {
  const st = { total: vocab.length, baru: 0, belum: 0, ulang: 0, hafal: 0, kuasa: 0, due: 0 };
  for (const v of vocab) {
    const s = cardState(P.cards[v.id], now); st[s]++;
    const c = P.cards[v.id]; if (c && c.last && c.due <= now) st.due++;
  }
  return st;
}
/** Antrean sesi: jatuh tempo (paling lama dulu) → belum hafal → baru (maks newLimit). */
export function buildQueue(P, vocab, { newLimit = 15, now = Date.now(), mode = "review" } = {}) {
  const due = [], fresh = [], all = [];
  for (const v of vocab) {
    const c = P.cards[v.id];
    if (!c || !c.last) fresh.push(v);
    else if (c.due <= now) due.push(v);
  }
  due.sort((a, b) => (P.cards[a.id].due - P.cards[b.id].due));
  if (mode === "semua") return shuffle(vocab);
  if (mode === "baru") return shuffle(vocab.filter(v => cardState(P.cards[v.id], now) === "baru"));
  if (mode === "ulang") return shuffle(vocab.filter(v => ["belum", "ulang"].includes(cardState(P.cards[v.id], now))));
  if (mode === "hafal") return shuffle(vocab.filter(v => ["hafal", "kuasa"].includes(cardState(P.cards[v.id], now))));
  if (mode === "belum") return shuffle(vocab.filter(v => ["belum", "ulang"].includes(cardState(P.cards[v.id], now))));
  return [...due, ...fresh.slice(0, newLimit)];
}

/* ============================ KUIS ============================ */
/** Format ujian resmi tiap bidang (sumber: 実施要領 MOJ/JAC/MHLW). n = jumlah soal ujian penuh. */
export const EXAM_SPEC = {
  "food-manufacturing": { n: 40, img: 6, mb: 0, opts: 3, info: "Resmi (OTAFF): tulis 30 + praktik 10 = 40 soal, pilihan ganda 3 opsi, lulus ≥65%." },
  "food-service": { n: 45, img: 8, mb: 0, opts: 3, info: "Resmi (OTAFF): tulis 30 + praktik 15 = 45 soal, pilihan ganda 3 opsi, lulus ≥65%." },
  "construction": { n: 50, img: 8, mb: 20, info: "Resmi (JAC): tulis 30 (60 menit) + praktik 20 (40 menit) = 50 soal, ○× + pilihan ganda, lulus ≥65%." },
  "construction-bangunan": { n: 50, img: 8, mb: 20, info: "Resmi (JAC): tulis 30 (60 menit) + praktik 20 (40 menit) = 50 soal, ○× + pilihan ganda, lulus ≥65%." },
  "construction-lifeline": { n: 50, img: 8, mb: 20, info: "Resmi (JAC): tulis 30 (60 menit) + praktik 20 (40 menit) = 50 soal, ○× + pilihan ganda, lulus ≥65%." },
  "building-cleaning": { n: 50, img: 0, mb: 20, info: "Resmi (MHLW): tulis 20 + praktik 30 = 50 soal / 50 menit, lulus ≥60% di tiap bagian (tulis ≥24 dari 40, praktik ≥36 dari 60)." },
  "agriculture": { n: 70, img: 0, mb: 0, info: "Resmi (MAFF/全国農業会議所 試験実施要領 1号): 学科 + 実技 (termasuk bahasa Jepang kerja), 60 menit, ±70 soal (sebagian tidak dinilai), CBT; level ±70% lulus bagi yang berpengalaman kerja 3 tahun; lulus bila di atas nilai batas yang ditetapkan NCA. Soal latihan = buatan Shirose dari buku modul resmi." },
  "livestock": { n: 70, img: 0, mb: 0, info: "Resmi (MAFF/全国農業会議所 試験実施要領 1号 — 畜産農業): 学科 + 実技, 60 menit, ±70 soal (sebagian tidak dinilai), CBT; level setara 農業技能実習評価試験 専門級. Soal latihan = buatan Shirose dari buku modul resmi." },
  "accommodation": { n: 36, img: 4, mb: 10, info: "Resmi (宿泊業技能試験センター): tulis 30 + praktik 6 = 36 soal, 60 menit." },
  "kaigo": { n: 20, img: 0, mb: 0, paket: 10, mix: { kb: 4, kk: 3, kom: 2, sj: 8, gb: 1 }, fill: ["gb", "sj", "kb", "kk", "kom"], info: "Format resmi (MHLW 介護特定技能評価試験(技能), CBT): 45 soal / 60 menit = tulis 40 (介護の基本 10, こころとからだ 6, コミュニケーション 4, 生活支援技術 20) + 実技 5 soal 判断等 bergambar; batas lulus tidak dipublikasikan. Di sini: 10 paket latihan @20 soal berbahasa Indonesia, isi tiap paket berbeda (tanpa soal yang sama), proporsi mengikuti ujian resmi." },
  "kaigo-jp": { n: 20, img: 0, mb: 0, paket: 10, mix: { kt: 6, kw: 7, bn: 7 }, fill: ["bn", "kw", "kt"], info: "Format resmi (MHLW 介護日本語評価試験, CBT): 15 soal / 30 menit = 介護のことば 5 + 介護の会話・声かけ 5 (percakapan 2 orang) + 介護の文書 5 (記録, 申し送り, お知らせ, dsb.); batas lulus tidak dipublikasikan. Di sini: 10 paket latihan @20 soal, isi tiap paket berbeda (tanpa soal yang sama)." },
  "fishery": { n: 30, img: 0, mb: 12, info: "Ujian Latihan Shirose Nihongo (bukan format resmi): jumlah soal dan durasi ujian resmi tidak dipublikasikan. Info resmi: ambang lulus ujian 漁業 tercatat 65% (laporan pelaksanaan ujian MAFF)." },
  "auto-maintenance": { n: 30, img: 0, mb: 30, info: "Ujian Latihan Shirose Nihongo (bukan format resmi). Info resmi (MLIT): ujian tulis 30 soal ○× / 60 menit, lulus ≥65%; ujian praktik 3 tugas / 20 menit, lulus ≥60%." },
  "jaim-machine-metal": { n: 40, img: 0, mb: 30, info: "Resmi (JAIM/METI): 製造分野特定技能1号評価試験 CBT 80 menit, 40 soal (tulis 30 soal benar/salah + praktik 10 pilihan ganda), lulus tulis ≥65% dan praktik ≥60%. Soal latihan = soal resmi dari buku JAIM (hasil ekstraksi otomatis)." },
  "jaim-elec-electronic": { n: 40, img: 0, mb: 30, info: "Resmi (JAIM/METI): 製造分野特定技能1号評価試験 CBT 80 menit, 40 soal (tulis 30 soal benar/salah + praktik 10 pilihan ganda), lulus tulis ≥65% dan praktik ≥60%. Soal latihan = soal resmi dari buku JAIM (hasil ekstraksi otomatis)." },
  "jaim-metal-surface": { n: 40, img: 0, mb: 30, info: "Resmi (JAIM/METI): 製造分野特定技能1号評価試験 CBT 80 menit, 40 soal (tulis 30 soal benar/salah + praktik 10 pilihan ganda), lulus tulis ≥65% dan praktik ≥60%. Soal latihan = soal resmi dari buku JAIM (hasil ekstraksi otomatis)." },
  "forestry": { n: 30, img: 0, mb: 30, info: "Resmi (林業技能向上センター/林野庁): tulis 30 soal ○× (≥65% benar; panduan 2026 menulis 30 menit, contoh soal 2025 menulis 60 menit) + praktik chainsaw 3 tugas (tiap tugas ≥40%, total ≥60%). Soal latihan: soal contoh resmi (27 dari 30, tanpa soal bergambar) + soal buatan Shirose dari aturan praktik 2026 (perlu review ahli)." },
  "railway-track": { n: 50, img: 0, mb: 30, info: "Resmi (JRCEA 受験案内 / MLIT 実施要領 軌道整備): paper test, 学科 30 soal (○× / pilihan 3) + 実技 20 soal (判断等試験 bergambar), total 80 menit, lulus ≥65% di tiap bagian; biaya 8.000 yen. Soal latihan = buatan Shirose (sample resmi berlabel 禁転載 tidak disalin; perlu review ahli)." },
  "railway-electrical": { n: 50, img: 0, mb: 30, info: "Resmi (鉄道電業安全協会 受験案内 / MLIT 実施要領 電気設備整備): paper test, 学科 30 soal + 実技 20 soal (situasi bergambar), total 80 menit, lulus ≥65% di tiap bagian; biaya ¥8.800 (anggota) / ¥13.200. Soal latihan = buatan Shirose (sample resmi berlabel 禁転載 tidak disalin; perlu review ahli)." },
  "shipbuilding": { n: 30, img: 0, mb: 30, info: "Format resmi ClassNK (受験案内): 学科 60 menit, 30 soal ○× (K3 umum 10 + bidang 20: teks 10 + gambar 10), lulus ≥ 60%. 6 区分: 溶接, 塗装, 鉄工, 仕上げ, 機械加工, 電気機器組立て. Soal di sini = latihan Shirose (bukan soal asli); praktik dinilai terpisah." },
  "linen-supply": { n: 20, img: 0, mb: 20, info: "Ujian Latihan Shirose Nihongo (bukan format resmi): ujian 特定技能1号 Linen Supply baru dan pedoman rincinya belum dipublikasikan. Acuan: ujian lama 技能実習評価試験 (JLSA) — tulis ○× (lembar jawab contoh 初級 20 soal, 専門級 30 soal) + praktik 仕上げ作業; syarat bahasa 1号 setara A2.2." },
  "railway-vehicle": { n: 50, img: 0, mb: 30, info: "Resmi (JARi/MLIT 鉄道分野 車両製造 1号): ujian kertas 学科 30 soal ○× + 実技 20 soal pilihan ganda 4 opsi, total 80 menit, lulus ≥65/100 di tiap bagian. Soal latihan = buatan Shirose dari teks resmi JARi (perlu review ahli)." },
  "aviation-gh": { n: 30, img: 0, mb: 30, info: "Resmi (JAEA): 特定技能評価試験 空港グランドハンドリング. Latihan = soal buatan Shirose dari teks resmi JAEA (bukan soal resmi) + 6 soal contoh resmi JAEA. Teks 1 (Safety & Quality) belum dimasukkan; jumlah soal & durasi ujian resmi belum diverifikasi." },
  "aviation-am": { n: 30, img: 0, mb: 30, info: "Resmi (JAEA): 特定技能評価試験 航空機整備 — 3 科目: 基本技術(締結・電気計測), 作業安全・品質, 航空機概要. Latihan = soal buatan Shirose dari teks resmi JAEA (bukan soal resmi) + 5 soal contoh resmi JAEA; jumlah soal & durasi ujian resmi belum diverifikasi." },
  "logistics": { n: 30, img: 0, mb: 30, info: "Ujian Latihan Shirose Nihongo (bukan soal resmi). Info resmi (MLIT): ujian 物流倉庫 1号, kertas 80 menit via perusahaan; CBT mulai Des 2026; jumlah soal resmi belum diverifikasi." },
  "recycling": { n: 20, img: 0, mb: 20, info: "Ujian Latihan Shirose Nihongo (bukan soal resmi). Pedoman ujian resmi 資源循環 1号 belum diterbitkan pemerintah; bank soal ini masih kecil." },
  "wood-industry": { n: 35, img: 0, mb: 32, info: "Ujian Latihan Shirose Nihongo (bukan soal resmi). Format resmi 木材産業特定技能1号測定試験: CBT, 60 menit, 35 soal (tulis 32 soal ○× + praktik 3 soal pertimbangan); huruf kanji berfurigana." },
  "auto-transport": { n: 30, img: 0, mb: 30, info: "Ujian Latihan Shirose Nihongo (bukan format resmi; jumlah soal resmi tidak diverifikasi). Soal ditulis Shirose dari teks belajar resmi JTA (truk) dan Asosiasi Bus Jepang (bus)." },
};
/** Paket ujian tanpa soal yang sama antar paket: pool dideduplikasi lalu dibagi per kategori (it.cat) sesuai spec.mix. */
function paketKuis(pool, spec, slug, count) {
  const seen = new Set(), uniq = [];
  for (const it of pool) { const k = `${it.q.id}|${it.q.jp || ""}|${it.img ? JSON.stringify(it.img) : ""}`; if (!seen.has(k)) { seen.add(k); uniq.push(it); } }
  const rnd = seeded(`${slug}-paket`), by = {};
  for (const it of uniq) (by[it.cat || "x"] = by[it.cat || "x"] || []).push(it);
  for (const k of Object.keys(by)) by[k] = shuffle(by[k], rnd);
  const out = [];
  for (let n = 1; n <= count; n++) {
    const pick = [];
    for (const [cat, k] of Object.entries(spec.mix)) pick.push(...(by[cat] || []).splice(0, k));
    const order = [...(spec.fill || []), ...Object.keys(by)];
    for (let i = 0; pick.length < spec.n && i < 4 * order.length; i++) { const a = by[order[i % order.length]]; if (a && a.length) pick.push(a.shift()); }
    out.push({ id: `full-q${n}`, title: { id: `Paket Soal ${n}`, jp: `パッケージ ${n}` }, items: shuffle(pick, rnd) });
  }
  return out;
}
/** 10 ujian penuh = sampel deterministik dari seluruh bank soal; komposisi mengikuti ujian resmi bidangnya. */
export function fullQuizzes(pack, perQuizArg, count = 10) {
  const spec = EXAM_SPEC[pack.slug] || {};
  const perQuiz = perQuizArg || spec.n || 20;
  const pool = [];
  for (const ch of pack.chapters) for (const q of (pack.quiz.bab?.[ch.id] || [])) { if (q.rev) continue; for (const it of q.items) pool.push({ ...it, bab: ch.id }); }   // q.rev = kuis ulangan (soalnya sudah ada di kuis subbab)
  if (!pool.length) return [];
  if (spec.paket && spec.mix) return paketKuis(pool, spec, pack.slug, Math.min(count, spec.paket));
  const out = [];
  const isImg = (x) => !!x.img, isMB = (x) => !!x.mb && !x.img, isMC = (x) => !x.mb && !x.img;
  const stripTags = (t) => String(t || "").replace(/\{([^|}]*)\|[^}]*\}/g, "$1");
  /** ○× dari pilihan ganda: pasangkan soal dengan satu jawaban (benar / salah) */
  const toMB = (it, truth, rnd) => {
    const k = truth ? it.a : shuffle(it.opts.map((_, j) => j).filter(j => j !== it.a), rnd)[0];
    if (k == null) return null;
    const o = it.opts[k];
    return { q: { id: `Benar atau salah? Soal: “${it.q.id}” Jawaban: “${o.id}”`, jp: `○か×か。「${stripTags(it.q.jp)}」→「${stripTags(o.jp)}」` },
      opts: [{ id: "Benar (○)", jp: "○ {正|ただ}しい" }, { id: "Salah (×)", jp: "× {間違|まちが}い" }], a: truth ? 0 : 1, exp: it.exp, mb: true, bab: it.bab, ref: it.ref };
  };
  const cut = (it, nOpt, rnd) => {   // kurangi opsi (ujian resmi FM/FS: 3 pilihan)
    if (it.mb || !nOpt || it.opts.length <= nOpt) return it;
    const wrong = shuffle(it.opts.map((_, j) => j).filter(j => j !== it.a), rnd).slice(0, nOpt - 1);
    const keep = [it.a, ...wrong].sort((x, y) => x - y);
    return { ...it, opts: keep.map(j => it.opts[j]), a: keep.indexOf(it.a) };
  };
  for (let n = 1; n <= count; n++) {
    const rnd = seeded(`${pack.slug}-full-${n}`);
    const take = (arr, k, used) => shuffle(arr.filter(x => !used.has(x)), rnd).slice(0, k);
    const used = new Set(), pick = [];
    const nImg = Math.min(spec.img ?? 4, pool.filter(isImg).length), nMB = spec.mb ?? 6;
    const mbReal = take(pool.filter(isMB), nMB, used);
    for (const grp of [take(pool.filter(isImg), nImg, used), mbReal]) for (const x of grp) { used.add(x); pick.push(x); }
    // kekurangan ○× dibuat dari pilihan ganda (setengah benar, setengah salah)
    const need = nMB - mbReal.length;
    if (need > 0) for (const [i, x] of take(pool.filter(isMC), need, used).entries()) { const m = toMB(x, i % 2 === 0, rnd); if (m) { used.add(x); pick.push(m); } }
    // sisanya pilihan ganda, dibagi merata antar bab
    const byBab = {}; for (const it of pool.filter(x => isMC(x) && !used.has(x))) (byBab[it.bab] = byBab[it.bab] || []).push(it);
    const keys = Object.keys(byBab).map(k => shuffle(byBab[k], rnd)); let i = 0;
    while (pick.length < Math.min(perQuiz, pool.length) && keys.some(a => a.length)) { const it = keys[i++ % keys.length].shift(); if (it) pick.push(it); }
    out.push({ id: `full-q${n}`, title: { id: `Ujian Penuh ${n}`, jp: `総合テスト ${n}` }, items: shuffle(pick.map(x => cut(x, spec.opts, rnd)), rnd) });
  }
  return out;
}

/** Tes membaca: kanji kosakata → bacaan kana (diambil dari bank kosakata). 15 soal acak tiap kali dibuka. */
export function readingQuiz(pack, n = 15) {
  const items = (pack.vocab?.items || pack.vocab || []).filter(v => /[\u4e00-\u9fff]/.test(v.kata) && v.kana && v.kana !== v.kata);
  if (items.length < 4) return null;
  const pickN = shuffle(items).slice(0, Math.min(n, items.length));
  const out = pickN.map(v => {
    const others = shuffle(items.filter(o => o.kana !== v.kana)).sort((a, b) => Math.abs(a.kana.length - v.kana.length) - Math.abs(b.kana.length - v.kana.length)).slice(0, 6);
    const wrong = shuffle(others).slice(0, 3).map(o => o.kana);
    const opts = shuffle([v.kana, ...wrong]);
    return { q: { id: `Bagaimana cara membaca ${v.kata} ?`, jp: `「${v.kata}」の{読|よ}み{方|かた}は？` }, opts: opts.map(k => ({ id: k, jp: k })), a: opts.indexOf(v.kana),
      exp: { id: `${v.kata} dibaca ${v.kana} (${v.romaji}) = ${v.arti}.`, jp: `${v.kata}＝${v.kana}。` } };
  });
  return { id: "baca-kosakata", title: { id: "Tes Membaca Kosakata", jp: "{読|よ}み{方|かた}テスト" }, items: out };
}
export function recordQuiz(P, quizId, score, total, wrongIds) {
  const pct = Math.round(100 * score / Math.max(1, total));
  const q = P.quiz[quizId] || { best: -1, n: 0, hist: [] };
  q.best = Math.max(q.best, pct); q.last = pct; q.n++; q.ts = Date.now(); q.wrong = wrongIds || [];
  q.hist = [...(q.hist || []), { t: Date.now(), p: pct }].slice(-10);
  P.quiz[quizId] = q;
  // Koin sekali per kuis saat pertama lulus (≥60%) — dompet tunggal.
  if (pct >= 60 && !q.paid) { q.paid = 1; try { if (typeof window !== "undefined" && window.awardKoin) window.awardKoin(15, "ssw kuis " + quizId); } catch (e) {} }
  return pct;
}
