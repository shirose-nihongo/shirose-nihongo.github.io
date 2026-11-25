/* =====================================================================
 * SILABUS HARIAN 毎日のシラバス — JLPT N5–N1 + JFT-Basic (Irodori)
 *
 * Patokan = beban harian (kosakata / kanji / bunpo per hari), durasi mengikuti.
 * Pola minggu: 6 hari belajar + hari ke-7 fukushu.
 * Setelah materi habis: fase simulasi (ujian penuh format asli ↔ hari perbaikan).
 * KUNCI HARIAN: hari berikutnya baru terbuka bila hari ini tuntas —
 *   hari belajar: tes hafalan kosakata, kanji, bunpo masing-masing ≥ 80%, lalu ujian harian ≥ 80%;
 *   hari fukushu / perbaikan: ujian ≥ 80%; hari simulasi: ditandai selesai.
 *
 * Data (dibuat oleh tools/silabus_build.py & tools/silabus_soal.py):
 *   data/silabus/{lv}.json            urutan materi standar per hari
 *   data/silabus/{lv}-soal-{minggu}.json  soal format ujian asli per materi (+ pembahasan)
 *   data/silabus/{lv}-dokkai.json     bacaan berurutan pendek → panjang
 * Progres: localStorage + Firestore siswa/{uid}/silabus/{lv}.
 * Route: #sylabus (beranda), #sylabus-ujian (ujian hari aktif), #sylabus-hafal (tes hafalan),
 *        #sylabus-jadwal (jadwal bertanggal + target hafalan kumulatif)
 * ===================================================================== */
const S = () => window.__SHIROSE_STATE || window.state || {};
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const safe = (s) => String(s ?? "").replace(/<(?!\/?(u|br|small|b|table|tr|th|td|ruby|rt)\b)[^>]*>/gi, "");
const ruby = (s) => esc(s).replace(/([一-鿿々〆ヶ]+)\[([^\]]+)\]/g, "<ruby>$1<rt>$2</rt></ruby>");
const polos = (s) => String(s ?? "").replace(/\[[^\]]*\]/g, "").replace(/\s+/g, "");
const toast = (m) => (window.toast ? window.toast(m) : console.log(m));
const ABCD = "ABCD";
const LV_JLPT = ["n5", "n4", "n3", "n2", "n1"];
const NAMA = { n5: "JLPT N5", n4: "JLPT N4", n3: "JLPT N3", n2: "JLPT N2", n1: "JLPT N1", jft: "JFT-Basic (Irodori A1–A2)" };
const MAKS = { kosakata: 30, kanji: 20, bunpo: 10 };
const KAT = ["kosakata", "kanji", "bunpo"];
const KAT_NAMA = { kosakata: "Kosakata", kanji: "Kanji", bunpo: "Bunpo", dokkai: "Dokkai" };
const BLOK = 6;
const LULUS = 0.8;
const HARI_MS = 86400000;

let FB = null;
export function initSilabus(fb) { FB = fb; }

/* ---------- penyimpanan ---------- */
const uid = () => S().user?.uid || "guest";
const KEY = (lv) => `shirose-silabus:${uid()}:${lv}`;
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} },
};
const _progres = {};
async function muatProgres(lv) {
  if (_progres[lv] !== undefined) return _progres[lv];
  let p = LS.get(KEY(lv), null);
  if (FB && S().user) {
    try {
      const r = await FB.loadSilabusProgres(lv);
      if (r && (!p || (r.diubah || 0) > (p.diubah || 0))) { delete r.uid; delete r.updated; p = r; LS.set(KEY(lv), p); }
    } catch (e) { /* offline: pakai lokal */ }
  }
  _progres[lv] = p;
  return p;
}
function simpanProgres(lv, p) {
  p.diubah = Date.now();
  _progres[lv] = p;
  LS.set(KEY(lv), p);
  if (FB && S().user) FB.saveSilabusProgres(lv, p).catch(() => {});
}

/* ---------- data ---------- */
const _cache = {};
async function dat(url) {
  if (!(url in _cache)) {
    _cache[url] = fetch(url).then(r => r.ok ? r.json() : null).catch(() => null);
  }
  return _cache[url];
}
const fileOf = (id) => id.split("#")[0];
async function item(id) {
  const [f, n] = id.split("#");
  const arr = await dat(`./data/${f}.json`);
  return arr ? arr[+n] : null;
}
async function muatItems(ids) {
  const files = [...new Set(ids.map(fileOf))];
  await Promise.all(files.map(f => dat(`./data/${f}.json`)));
  const out = {};
  for (const id of ids) out[id] = await item(id);
  return out;
}
let _kanjiJlpt = null;
async function kanjiJlpt() {
  if (_kanjiJlpt) return _kanjiJlpt;
  const set = new Set();
  for (const l of LV_JLPT) (await dat(`./data/kanji-${l}.json`) || []).forEach(k => k.k && set.add(k.k));
  return (_kanjiJlpt = set);
}
const _ksetLv = {};
async function kanjiSampai(lv) {
  // Kanji yang wajar dipakai di pilihan jawaban: level ini + satu level di bawahnya (JFT ≈ N5+N4).
  if (_ksetLv[lv]) return _ksetLv[lv];
  const upto = lv === "jft" ? ["n5", "n4"] : LV_JLPT.slice(0, LV_JLPT.indexOf(lv) + 1);
  const set = new Set();
  for (const l of upto) (await dat(`./data/kanji-${l}.json`) || []).forEach(k => k.k && set.add(k.k));
  return (_ksetLv[lv] = set);
}
const levelAktif = () => { const l = String(S().level || "n5").toLowerCase(); return l.startsWith("ir") ? "jft" : (LV_JLPT.includes(l) ? l : "n5"); };

/* ---------- rencana (sama dengan tools/silabus_build.py) ---------- */
function urutanStandar(std) {
  const urut = { kosakata: [], kanji: [], bunpo: [] }, blok = {};
  let b = 0;
  for (const h of std.hari) {
    if (h.jenis !== "belajar") continue;
    for (const k of KAT) for (const id of h.materi[k]) { urut[k].push(id); blok[id] = Math.floor(b / BLOK); }
    b++;
  }
  return { urut, blok };
}
const sebar = (n, hari) => Array.from({ length: n }, (_, i) => Math.min(hari - 1, Math.floor(i * hari / n)));
const bulat = (x, lo, hi) => Math.max(lo, Math.min(hi, x));

function bangunRencana(std, tempo) {
  const { urut, blok } = urutanStandar(std);
  const nHari = Math.max(...KAT.map(k => Math.ceil(urut[k].length / tempo[k])));
  const hariKanji = Math.min(nHari, Math.max(Math.ceil(urut.kanji.length / tempo.kanji), Math.ceil(0.8 * nHari)));
  const belajar = Array.from({ length: nHari }, () => ({ kosakata: [], kanji: [], bunpo: [] }));
  sebar(urut.kosakata.length, nHari).forEach((d, i) => belajar[d].kosakata.push(urut.kosakata[i]));
  sebar(urut.kanji.length, hariKanji).forEach((d, i) => belajar[d].kanji.push(urut.kanji[i]));
  sebar(urut.bunpo.length, nHari).forEach((d, i) => belajar[d].bunpo.push(urut.bunpo[i]));
  const skala = Math.max(...KAT.map(k => tempo[k] / std.standar[k]));
  const nSoal = (base) => bulat(Math.round(base * skala), 3, 15);
  const hari = [];
  let b = 0, minggu = [], semua = [];
  while (b < nHari) {
    for (let i = 0; i < 6 && b < nHari; i++, b++) {
      const p = b / nHari;
      const fase = p < 0.3 ? "awal" : (p < 0.8 ? "tengah" : "akhir");
      hari.push({ jenis: "belajar", fase, materi: belajar[b], soal: { kosakata: nSoal(5), kanji: nSoal(5), bunpo: nSoal(5), dokkai: 2 },
        menit: fase === "awal" ? null : (fase === "tengah" ? 20 : 15) });
      minggu.push(hari.length - 1);
    }
    hari.push({ jenis: "fukushu", dari: [...minggu], soal: { kosakata: 6, kanji: 6, bunpo: 6, dokkai: 2 }, menit: 25 });
    semua = semua.concat(minggu); minggu = [];
  }
  const nSim = std.hari.filter(h => h.jenis === "simulasi" || h.jenis === "perbaikan").length;
  for (let i = 0; i < nSim; i++) {
    hari.push(i % 2 === 0
      ? { jenis: "simulasi" }
      : { jenis: "perbaikan", dari: [...semua], soal: { kosakata: 8, kanji: 8, bunpo: 8, dokkai: 2 }, menit: 30 });
  }
  return { hari, nHari, blok, total: Object.fromEntries(KAT.map(k => [k, urut[k].length])) };
}
const _rencana = {};
async function rencana(lv, tempo) {
  const k = `${lv}:${tempo.kosakata}/${tempo.kanji}/${tempo.bunpo}`;
  if (!_rencana[k]) {
    const std = await dat(`./data/silabus/${lv}.json`);
    if (!std) throw new Error("Data silabus belum tersedia.");
    _rencana[k] = { std, ...bangunRencana(std, tempo) };
  }
  return _rencana[k];
}
const tempoStd = (std) => ({ ...std.standar });
const tempoMin = (std) => Object.fromEntries(KAT.map(k => [k, Math.ceil(std.standar[k] / 2)]));

/* ---------- tampilan materi ---------- */
const hasKanji = (s) => /[一-鿿]/.test(s || "");
const pendek = (a) => { let t = String(a || "").replace(/^\d+\.\s*/, "").split(/[;；]/)[0].trim(); if (t.length > 48) t = t.slice(0, 48) + "…"; return t; };
function tulisKata(it, kset) {
  // Kata berkanji di luar daftar JLPT (ateji seperti 捏巴爾, atau kata yang biasa ditulis kana) → tampil kana.
  // Bersihkan penanda data: 「押す［1］／押」 → 「押す」, 「早い[2]」 → 「早い」.
  const kata = String(it.kata || "").replace(/[\[［]\d+[\]］]/g, "").split(/[／]/)[0].trim();
  const aneh = [...kata].some(c => /[一-鿿]/.test(c) && !kset.has(c));
  return aneh ? (it.kana || kata) : kata;
}
function kartuMateri(kat, it, kset) {
  if (!it) return "";
  if (kat === "kosakata") {
    const k = tulisKata(it, kset);
    return `<div class="sh-card"><div class="jp big">${esc(k)}</div>${it.kana && it.kana !== k ? `<div class="kana">${esc(it.kana)}</div>` : ""}
      <div class="arti">${esc(pendek(it.arti))}</div>${it.contoh ? `<div class="ct jp">${ruby(it.contoh)}</div><div class="ct-id">${esc(it.arti_contoh || "")}</div>` : ""}</div>`;
  }
  if (kat === "kanji") {
    const c = (it.c || []).slice(0, 3).map(x => `<li><span class="jp">${esc(x.k)}</span> <small>${esc(x.r)}</small> — ${esc(pendek(x.a))}</li>`).join("");
    return `<div class="sh-card kanji"><div class="jp huge">${esc(it.k)}</div><div class="kana">音 ${esc(it.on || "-")} · 訓 ${esc(it.kun || "-")}</div>
      <div class="arti">${esc(pendek(it.a))}</div>${c ? `<ul class="cmp">${c}</ul>` : ""}</div>`;
  }
  const rumus = Array.isArray(it.rumus) ? it.rumus.slice(0, 2).map(r => `<li>${ruby(r)}</li>`).join("") : "";
  return `<div class="sh-card bunpo"><div class="jp big">${ruby(it.pola)}</div><div class="arti">${esc(it.arti)}</div>
    ${rumus ? `<ul class="cmp">${rumus}</ul>` : ""}${it.contoh ? `<div class="ct jp">${ruby(it.contoh)}</div><div class="ct-id">${esc(it.arti_contoh || "")}</div>` : ""}</div>`;
}

/* ---------- generator soal sederhana (fase awal + cadangan) ---------- */
function acak(a, rnd = Math.random) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pilihan(benar, kolam, n = 3) {
  const lain = acak([...new Set(kolam.filter(x => x && x !== benar))]).slice(0, n);
  if (lain.length < n) return null;
  const opts = acak([benar, ...lain]);
  return { opts, ans: opts.indexOf(benar) };
}
function soalSederhana(kat, id, it, kolam, kset) {
  const out = [];
  if (!it) return out;
  const mk = (tipe_jp, q, benar, pool, alasan) => {
    const p = pilihan(benar, pool);
    if (p) out.push({ item: id, cat: kat, tipe_jp, q, ...p, ex: { jawaban: benar, alasan } });
  };
  if (kat === "kosakata") {
    const k = tulisKata(it, kset);
    mk("語彙の意味", `<b class="jp">${esc(k)}</b> <small>（${esc(it.kana || "")}）</small> の いみは？`, pendek(it.arti),
      kolam.kosakata.map(x => pendek(x.arti)), `${k}（${it.kana}）= ${pendek(it.arti)}`);
    if (hasKanji(k) && it.kana && it.kana !== k) {
      const pool = kolam.kosakata.map(x => x.kana).filter(x => x && Math.abs(x.length - it.kana.length) <= 2);
      mk("漢字読み", `<u class="jp">${esc(k)}</u> の よみかたは？`, it.kana, pool, `${k} dibaca ${it.kana}.`);
    }
    const kl = kolam.ksetLv || kset;
    const kk = tulisKata(it, kl);
    mk("意味から語へ", `「${esc(pendek(it.arti))}」は 日本語で？`, kk, kolam.kosakata.map(x => tulisKata(x, kl)), `${pendek(it.arti)} = ${k}（${it.kana}）`);
  } else if (kat === "kanji") {
    mk("漢字の意味", `<b class="jp huge-q">${esc(it.k)}</b> の いみは？`, pendek(it.a), kolam.kanji.map(x => pendek(x.a)), `${it.k} = ${pendek(it.a)}`);
    const dua = (r) => String(r || "").split(/[、,]/).map(t => t.replace(/[.\-]/g, "").trim()).filter(Boolean).slice(0, 2).join("・");
    const baca = (x) => [dua(x.on), dua(x.kun)].filter(Boolean).join("　|　");
    mk("漢字の読み", `<b class="jp huge-q">${esc(it.k)}</b> の よみは？`, baca(it), kolam.kanji.map(baca), `${it.k}: 音 ${it.on || "-"} · 訓 ${it.kun || "-"}`);
    const c = (it.c || []).find(x => x.k && x.k.includes(it.k) && x.r);
    if (c) {
      const pool = kolam.kanji.flatMap(x => (x.c || []).map(y => y.r)).filter(r => r && Math.abs(r.length - c.r.length) <= 2);
      mk("漢字読み", `<u class="jp">${esc(c.k)}</u> の よみかたは？`, c.r, pool, `${c.k} dibaca ${c.r} = ${pendek(c.a)}`);
    }
  } else {
    mk("文法の意味", `「<b class="jp">${ruby(it.pola)}</b>」の いみは？`, pendek(it.arti), kolam.bunpo.map(x => pendek(x.arti)), `${polos(it.pola)} = ${it.arti}`);
    const kata = polos(it.kata || it.pola).replace(/[（(].*$/, "");
    const ct = polos(it.contoh || "");
    if (kata && ct.includes(kata) && kata.length <= 12) {
      const q = esc(ct).replace(esc(kata), "（　　　）");
      const pool = kolam.bunpo.map(x => polos(x.kata || x.pola).replace(/[（(].*$/, "")).filter(x => x && x.length <= 12);
      mk("文法形式の判断", `<span class="jp">${q}</span>`, kata, pool, `${ct} — ${it.arti_contoh || it.arti}`);
    }
  }
  return out;
}

/* ---------- menyusun ujian ---------- */
async function soalPool(lv, blokNo) {
  if (lv === "jft") return {};
  return (await dat(`./data/silabus/${lv}-soal-${blokNo}.json`)) || {};
}
const FORMAT_AWAL = new Set(["語彙の意味", "漢字読み", "漢字の意味", "漢字の読み", "文法の意味", "意味から語へ", "文法形式の判断"]);
async function kandidat(lv, R, ids, fase, kset, kolam) {
  // Soal per materi: fase awal → soal pengenalan (arti / baca); tengah & akhir → format ujian asli dulu.
  const blokNos = [...new Set(ids.map(id => R.blok[id]).filter(x => x !== undefined))];
  const pools = await Promise.all(blokNos.map(b => soalPool(lv, b)));
  const pool = Object.assign({}, ...pools);
  const items = await muatItems(ids);
  const per = {};
  for (const id of ids) {
    const kat = id.startsWith("kosakata") ? "kosakata" : id.startsWith("kanji") ? "kanji" : "bunpo";
    const sederhana = soalSederhana(kat, id, items[id], kolam, kset);
    const asli = (pool[id] || []).map(q => ({ ...q, item: id, cat: kat, q: q.q }));
    const awal = sederhana.filter(q => FORMAT_AWAL.has(q.tipe_jp));
    per[id] = fase === "awal" ? acak(awal).concat(acak(asli.filter(q => q.tipe === "imi" || q.tipe === "yomi"))) : acak(asli).concat(acak(sederhana));
  }
  return per;
}
const kunciSoal = (q) => String(q.q || "").replace(/<[^>]+>/g, "").replace(/[\s　]/g, "");
function ambilMerata(per, ids, n, utama = []) {
  // Bergiliran per materi supaya semua materi hari itu teruji; materi "utama" (yang pernah salah) didahulukan.
  const urut = [...utama.filter(id => ids.includes(id)), ...acak(ids.filter(id => !utama.includes(id)))];
  const out = [], stem = new Set(), sisa = Object.fromEntries(urut.map(id => [id, (per[id] || []).slice()]));
  let jalan = true;
  while (out.length < n && jalan) {
    jalan = false;
    for (const id of urut) {
      if (out.length >= n) break;
      let q = sisa[id].shift();
      while (q && stem.has(kunciSoal(q))) q = sisa[id].shift();   // kalimat soal yang sama jangan muncul dua kali
      if (q) { out.push(q); stem.add(kunciSoal(q)); jalan = true; }
    }
  }
  return out;
}
async function kolamLevel(lv) {
  const files = lv === "jft" ? ["ir0", "ir1", "ir2"] : [lv];
  const ambil = async (pre) => (await Promise.all(files.map(f => dat(`./data/${pre}-${f}.json`)))).flat().filter(Boolean);
  return { kosakata: await ambil("kosakata"), kanji: await ambil("kanji"), bunpo: await ambil("bunpou") };
}
function idsHari(R, idxs) { const o = { kosakata: [], kanji: [], bunpo: [] }; for (const i of idxs) { const h = R.hari[i]; if (h && h.materi) KAT.forEach(k => o[k].push(...h.materi[k])); } return o; }

async function susunUjian(lv, R, p, idx) {
  const h = R.hari[idx];
  const kset = await kanjiJlpt();
  const kolam = await kolamLevel(lv);
  kolam.ksetLv = await kanjiSampai(lv);
  let sumber;
  if (h.jenis === "belajar") sumber = { ...h.materi };
  else sumber = idsHari(R, h.dari || []);
  const salah = Object.keys(p.salah || {});
  const qs = [];
  for (const k of KAT) {
    const n = h.soal[k];
    let ids = sumber[k];
    if (h.jenis === "perbaikan") ids = salah.filter(id => id.startsWith(k === "bunpo" ? "bunpou" : k)).concat(acak(ids).slice(0, n));
    let got = [];
    if (ids.length) got = ambilMerata(await kandidat(lv, R, ids, h.fase || "tengah", kset, kolam), ids, n, salah);
    // Soal kurang (mis. N5 hanya 81 kanji, jadi banyak hari tanpa kanji baru) → ulang materi hari-hari sebelumnya.
    for (let mundur = 1; got.length < n && mundur <= 30 && idx - mundur >= 0; mundur += 3) {
      const lalu = idsHari(R, [idx - mundur, idx - mundur - 1, idx - mundur - 2].filter(i => i >= 0))[k].filter(id => !ids.includes(id));
      if (!lalu.length) continue;
      ids = ids.concat(lalu);
      const tambahan = ambilMerata(await kandidat(lv, R, lalu, h.fase || "tengah", kset, kolam), lalu, n - got.length, salah);
      got = got.concat(tambahan.map(q => ({ ...q, ulang: true })));
    }
    qs.push(...got);
  }
  // Dokkai berurutan.
  const dk = await dat(`./data/silabus/${lv}-dokkai.json`) || [];
  const flat = dk.flatMap(u => u.qs.map(q => ({ ...q, cat: "dokkai", tipe_jp: "読解", unit: u })));
  const nD = (h.soal && h.soal.dokkai) || 0;
  for (let i = 0; i < nD && flat.length; i++) qs.push(flat[((p.dokkaiPos || 0) + i) % flat.length]);
  return { qs, nDokkai: Math.min(nD, flat.length) };
}

/* ---------- views ---------- */
const JENIS = { belajar: "Belajar", fukushu: "Fukushu 復習", simulasi: "Simulasi ujian", perbaikan: "Perbaikan" };
const IKON = { belajar: "📗", fukushu: "🔁", simulasi: "🎯", perbaikan: "🛠️" };
const tgl = (d) => d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
const tglPendek = (d) => d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
const tglPanjang = (d) => d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const tambahHari = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d; };
const awalHari = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d; };
const tglDari = (mulai, idx) => { const d = awalHari(mulai); d.setDate(d.getDate() + idx); return d; };
const tglHari = (p, idx) => tglDari(p.mulai || Date.now(), idx);
const idxHariIni = (p) => Math.round((awalHari(Date.now()) - awalHari(p.mulai || Date.now())) / HARI_MS);
const persen = (b, t) => (t ? Math.round(b / t * 100) : 0);

function bulanTempo(R) { return (R.hari.length / 30).toFixed(1).replace(".", ","); }

/* Jumlah materi yang sudah harus hafal setelah hari idx selesai (kumulatif). */
function kumulatif(R) {
  if (R._kum) return R._kum;
  const c = { kosakata: 0, kanji: 0, bunpo: 0 }, out = [];
  for (const h of R.hari) { if (h.materi) KAT.forEach(k => { c[k] += h.materi[k].length; }); out.push({ ...c }); }
  return (R._kum = out);
}
const kumSampai = (R, idx) => (idx < 0 ? { kosakata: 0, kanji: 0, bunpo: 0 } : kumulatif(R)[Math.min(idx, R.hari.length - 1)]);
const teksKum = (c) => `${c.kosakata} kosakata · ${c.kanji} kanji · ${c.bunpo} bunpo`;

/* Target per ±30 hari: "tanggal X → sudah hafal sekian". */
function targetBulanan(R, mulai) {
  const out = [];
  for (let i = 29; i < R.hari.length - 1; i += 30) out.push({ idx: i, tgl: tglDari(mulai, i), kum: kumSampai(R, i) });
  out.push({ idx: R.hari.length - 1, tgl: tglDari(mulai, R.hari.length - 1), kum: kumSampai(R, R.hari.length - 1), akhir: true });
  return out;
}
function htmlTarget(R, mulai) {
  return `<table class="sh-jt"><tr><th>Tanggal</th><th>Hari ke-</th><th>Sudah hafal</th></tr>${targetBulanan(R, mulai).map(t =>
    `<tr${t.akhir ? ' class="akhir"' : ""}><td>${tgl(t.tgl)}</td><td>${t.idx + 1}${t.akhir ? " 🏁" : ""}</td><td>${teksKum(t.kum)}</td></tr>`).join("")}</table>`;
}

/* Kategori hafalan yang wajib di hari belajar (kategori tanpa materi baru dilewati). */
const katHari = (h) => (h && h.materi ? KAT.filter(k => h.materi[k].length) : []);
const hafalHari = (p, idx) => ((p.hafal || {})[idx] || {});
const hafalTuntas = (h, p, idx) => katHari(h).every(k => hafalHari(p, idx)[k]?.lulus);

async function viewSetup(lv) {
  const std = await dat(`./data/silabus/${lv}.json`);
  if (!std) return `<div class="panel"><h2>🗺️ Silabus</h2><div class="empty">Data silabus ${esc(NAMA[lv])} belum tersedia.</div></div>`;
  const pilihan = [
    ["santai", "🐢 Santai", tempoMin(std)],
    ["standar", "📘 Standar", tempoStd(std)],
    ["cepat", "🚀 Paling cepat", { ...MAKS }],
  ];
  const kartu = [], target = [];
  for (const [k, nm, t] of pilihan) {
    const R = await rencana(lv, t);
    const b = R.hari.find(h => h.jenis === "belajar");
    const nSoal = KAT.reduce((s, c) => s + b.soal[c], 0) + b.soal.dokkai;
    kartu.push(`<button class="sh-tempo ${k === "standar" ? "on" : ""}" data-k="${k}" onclick="SH.pilihTempo('${k}')">
      <b>${nm}</b><span class="dur">${R.hari.length} hari · ± ${bulanTempo(R)} bulan</span>
      <span>${t.kosakata} kosakata · ${t.kanji} kanji · ${t.bunpo} bunpo / hari (maks.)</span>
      <span>${nSoal} soal ujian harian</span><span class="sel">Selesai ± ${tgl(tambahHari(R.hari.length - 1))}</span></button>`);
    target.push(`<div class="sh-ms" data-k="${k}" ${k === "standar" ? "" : "hidden"}>${htmlTarget(R, Date.now())}</div>`);
  }
  window.SH._pilihan = Object.fromEntries(pilihan.map(([k, , t]) => [k, t]));
  window.SH._pilih = "standar";
  window.SH._lv = lv;
  return `<div class="panel sh">
    <h2>🗺️ Silabus Harian · ${esc(NAMA[lv])}</h2>
    <p class="sh-muted">Pilih kecepatan belajarmu. Materi ${std.total.kosakata} kosakata, ${std.total.kanji} kanji, dan ${std.total.bunpo} bunpo dibagi rata per hari.
      Setiap minggu: 6 hari belajar + 1 hari fukushu, dan di akhir ada simulasi ujian asli.</p>
    <p class="sh-muted"><b>🔒 Sistem kunci:</b> hari berikutnya baru terbuka setelah hari ini tuntas — tes hafalan kosakata, kanji, dan bunpo masing-masing ≥ 80%, lalu ujian harian ≥ 80%.</p>
    <div class="sh-tempos">${kartu.join("")}</div>
    <details class="sh-custom"><summary>Atur sendiri (maks. 30 kosakata · 20 kanji · 10 bunpo per hari)</summary>
      <div class="sh-row">${KAT.map(k => `<label>${KAT_NAMA[k]}/hari <input type="number" id="sh-in-${k}" min="${tempoMin(std)[k]}" max="${MAKS[k]}" value="${std.standar[k]}"></label>`).join("")}</div>
      <button class="btn ghost sm" onclick="SH.pilihTempo('custom')">Pakai angka ini</button>
    </details>
    <h3>📅 Target hafalan kalau mulai hari ini</h3>
    ${target.join("")}<div class="sh-ms" data-k="custom" id="sh-ms-custom" hidden></div>
    <button class="btn gold sh-mulai" onclick="SH.mulai('${lv}')">▶ Mulai silabus</button>
    <p class="sh-muted small"><a href="#" onclick="route('sylabus-peta'); return false;">Lihat peta materi lama (per 50 kata) →</a></p>
  </div>`;
}

function stripMinggu(R, p) {
  const pos = p.pos;
  const mulai = Math.floor(pos / 7) * 7;
  return `<div class="sh-strip">${Array.from({ length: 7 }, (_, i) => {
    const idx = mulai + i, h = R.hari[idx];
    if (!h) return "";
    const cls = idx === pos ? "now" : (idx < pos ? "ok" : "lock");
    return `<div class="sh-dot ${cls}" title="Hari ${idx + 1} · ${JENIS[h.jenis]} · ${tglPendek(tglHari(p, idx))}"><span>${idx > pos ? "🔒" : IKON[h.jenis]}</span><small>${idx + 1}</small></div>`;
  }).join("")}</div>`;
}

/* Kartu "hari ini tanggal sekian, harusnya sudah hafal sekian". */
function kartuTarget(R, p, tautan = true) {
  const hi = idxHariIni(p);
  const n = R.hari.length;
  const seharusnya = Math.min(hi, n - 1);
  const selisih = p.pos - hi;        // >0 lebih cepat, <0 terlambat
  const status = p.pos >= n ? "" : selisih === 0 ? `<span class="sh-pill ok">✓ Sesuai jadwal</span>`
    : selisih > 0 ? `<span class="sh-pill ok">🚀 Lebih cepat ${selisih} hari</span>`
    : `<span class="sh-pill ng">⚠ Terlambat ${-selisih} hari</span>`;
  const target = kumSampai(R, seharusnya), sudah = kumSampai(R, p.pos - 1);
  return `<div class="sh-target">
    <div class="sh-head"><b>📅 ${tglPanjang(new Date())}</b>${status}</div>
    <p>Sesuai jadwal, hari ini kamu ada di <b>Hari ${seharusnya + 1}</b>. Target sampai hari ini (setelah Hari ${seharusnya + 1} selesai): <b>${teksKum(target)}</b>.</p>
    <p class="sh-muted small">Sudah dituntaskan: ${teksKum(sudah)} · selesai sesuai jadwal ${tgl(tglHari(p, n - 1))}</p>
    ${tautan ? `<a href="#" class="small" onclick="route('sylabus-jadwal'); return false;">Lihat jadwal lengkap per tanggal →</a>` : ""}
  </div>`;
}

async function viewBeranda(lv, p) {
  const R = await rencana(lv, p.tempo);
  if (p.pos >= R.hari.length) {
    return `<div class="panel sh"><h2>🎉 Silabus ${esc(NAMA[lv])} selesai!</h2>
      <p>Kamu sudah menyelesaikan ${R.hari.length} hari. Lanjutkan latihan dengan ujian penuh di JLPT Center atau tryout JFT.</p>
      <div class="sh-row"><button class="btn gold" onclick="route('${lv === "jft" ? "jft-tryout" : "jlpt"}')">🎯 Latihan ujian penuh</button>
      <button class="btn ghost" onclick="route('sylabus-jadwal')">📅 Jadwal</button>
      <button class="btn ghost" onclick="SH.reset('${lv}')">↺ Mulai ulang silabus</button></div></div>`;
  }
  const idx = p.pos;
  const h = R.hari[idx];
  const pct = Math.round(idx / R.hari.length * 100);
  const coba = p.hasil && p.hasil[idx] && !p.hasil[idx].lulus ? p.hasil[idx] : null;
  const infoCoba = coba ? `<p class="sh-muted small">Percobaan ujian: ${coba.coba || 1}× · nilai terbaik ${coba.terbaik ?? persen(coba.benar, coba.total)}% (perlu ≥ 80%)</p>` : "";
  let isi = "", tombol = "";
  if (h.jenis === "belajar") {
    const kset = await kanjiJlpt();
    const items = await muatItems(KAT.flatMap(k => h.materi[k]));
    const hf = hafalHari(p, idx);
    const tuntas = hafalTuntas(h, p, idx);
    const nSoal = KAT.reduce((s, c) => s + h.soal[c], 0) + h.soal.dokkai;
    const langkah = katHari(h).map(k => {
      const r = hf[k];
      return `<a class="sh-step ${r?.lulus ? "ok" : ""}" href="#sh-kat-${k}" onclick="document.getElementById('sh-kat-${k}')?.scrollIntoView({behavior:'smooth'}); return false;">
        ${r?.lulus ? "✅" : "🧠"} Hafalan ${KAT_NAMA[k]}<small>${r ? `${r.terbaik ?? persen(r.b, r.t)}%` : "belum"}</small></a>`;
    }).join("");
    const blok = (k) => {
      if (!h.materi[k].length) return "";
      const r = hf[k];
      const tb = r?.lulus
        ? `<button class="btn ghost sm" onclick="SH.hafal('${k}')">✓ Lulus ${r.terbaik ?? persen(r.b, r.t)}% · ulangi tes</button>`
        : `<button class="btn gold sm" onclick="SH.hafal('${k}')">🧠 Tes hafalan ${KAT_NAMA[k]} (${h.materi[k].length} soal · lulus ≥ 80%)</button>`;
      return `<h3 id="sh-kat-${k}">${KAT_NAMA[k]} <small>(${h.materi[k].length})</small></h3>
        <div class="sh-cards">${h.materi[k].map(id => kartuMateri(k, items[id], kset)).join("")}</div>
        <div class="sh-row">${tb}${r && !r.lulus ? `<span class="sh-muted small">Terakhir ${persen(r.b, r.t)}% — hafalkan lagi kartunya lalu ulangi.</span>` : ""}</div>`;
    };
    isi = `<p class="sh-muted">Fase <b>${h.fase}</b> · Hafalkan kartu, lalu tes hafalan tiap bagian sampai ≥ 80%. Setelah semua lulus, ujian harian (${nSoal} soal${h.menit ? `, ${h.menit} menit` : ""}) terbuka. Lulus ujian ≥ 80% → Hari ${idx + 2} terbuka.</p>
      <div class="sh-steps">${langkah}<span class="sh-step ${tuntas ? "" : "lock"}">${tuntas ? "📝" : "🔒"} Ujian harian<small>${coba ? `terbaik ${coba.terbaik ?? persen(coba.benar, coba.total)}%` : (tuntas ? "siap" : "terkunci")}</small></span></div>
      ${infoCoba}
      ${KAT.map(blok).join("")}`;
    tombol = tuntas
      ? `<button class="btn gold sh-mulai" onclick="route('sylabus-ujian')">📝 ${coba ? "Ulangi ujian hari ini (soal baru)" : "Mulai ujian hari ini"}</button>`
      : `<button class="btn sh-mulai" disabled>🔒 Ujian terbuka setelah semua tes hafalan ≥ 80%</button>`;
  } else if (h.jenis === "simulasi") {
    isi = `<p>Hari ini ujian penuh format asli ${lv === "jft" ? "JFT-Basic" : esc(NAMA[lv])}. Semua materi sudah kamu pelajari, jadi kerjakan seperti ujian sungguhan: sekali duduk, tanpa membuka catatan.</p>
      <div class="sh-row"><button class="btn gold" onclick="route('${lv === "jft" ? "jft-tryout" : `jlpt/${lv}`}')">🎯 Buka ujian penuh</button></div>
      <p class="sh-muted small">Setelah selesai, kembali ke sini dan tandai hari ini selesai.</p>`;
    tombol = `<button class="btn" onclick="SH.tandaiSimulasi('${lv}')">✓ Saya sudah menyelesaikan simulasi</button>`;
  } else {
    const nSoal = KAT.reduce((s, c) => s + h.soal[c], 0) + h.soal.dokkai;
    const ket = { fukushu: "Mengulang materi 6 hari minggu ini. Materi yang pernah salah keluar lebih dulu.",
      perbaikan: "Mengulang materi yang salah di ujian-ujian sebelumnya." }[h.jenis];
    isi = `<p>${ket}</p><p class="sh-muted">${nSoal} soal · ${h.menit} menit · lulus ≥ 80% untuk membuka Hari ${idx + 2}</p>${infoCoba}`;
    tombol = `<button class="btn gold sh-mulai" onclick="route('sylabus-ujian')">📝 ${coba ? "Ulangi" : "Mulai"} ${JENIS[h.jenis].toLowerCase()}</button>`;
  }
  const antre = Object.keys(p.salah || {}).length;
  return `<div class="panel sh">
    ${kartuTarget(R, p)}
    <div class="sh-head"><h2>${IKON[h.jenis]} Hari ${idx + 1} · ${JENIS[h.jenis]}</h2><span class="sh-lv">${esc(NAMA[lv])}</span></div>
    <p class="sh-muted small">Jadwal hari ini: ${tglPanjang(tglHari(p, idx))}</p>
    <div class="sh-prog"><div style="width:${pct}%"></div></div>
    <p class="sh-muted small">${idx} dari ${R.hari.length} hari tuntas · tempo ${p.tempo.kosakata}/${p.tempo.kanji}/${p.tempo.bunpo}${antre ? ` · ${antre} materi di antrean ulang` : ""}</p>
    ${stripMinggu(R, p)}
    ${isi}
    <div class="sh-row">${tombol}</div>
    <details class="sh-custom"><summary>Pengaturan</summary>
      <div class="sh-row"><button class="btn ghost sm" onclick="SH.gantiTempo('${lv}')">Ganti tempo</button>
      <button class="btn ghost sm" onclick="SH.reset('${lv}')">↺ Ulang dari awal</button>
      <button class="btn ghost sm" onclick="route('sylabus-peta')">Peta materi lama</button></div>
      <p class="sh-muted small">Ganti tempo tidak menghapus materi yang sudah tuntas; materi yang belum dipelajari dibagi ulang dan jadwal dihitung ulang mulai hari ini.</p>
    </details>
  </div>`;
}

/* ---------- jadwal bertanggal ---------- */
async function viewJadwal() {
  const lv = levelAktif();
  const p = await muatProgres(lv);
  if (!p || p.hapus) { setTimeout(() => window.route("sylabus"), 0); return '<div class="loading">Memuat…</div>'; }
  const R = await rencana(lv, p.tempo);
  const hi = idxHariIni(p);
  const kum = kumulatif(R);
  const minggu = [];
  for (let m = 0; m * 7 < R.hari.length; m++) {
    const rows = [];
    for (let idx = m * 7; idx < Math.min(R.hari.length, m * 7 + 7); idx++) {
      const h = R.hari[idx];
      const r = p.hasil && p.hasil[idx];
      const keg = h.jenis === "belajar"
        ? `${IKON.belajar} +${h.materi.kosakata.length} kosakata · +${h.materi.kanji.length} kanji · +${h.materi.bunpo.length} bunpo`
        : `${IKON[h.jenis]} ${JENIS[h.jenis]}`;
      const st = idx < p.pos ? `✅${r && r.total ? ` ${persen(r.benar, r.total)}%` : ""}`
        : idx === p.pos ? "▶ sekarang"
        : "🔒";
      const telat = idx < hi && idx >= p.pos ? ' <span class="sh-pill ng">terlambat</span>' : "";
      const cls = [idx === p.pos ? "now" : "", idx === hi ? "today" : "", idx < p.pos ? "done" : ""].filter(Boolean).join(" ");
      rows.push(`<tr class="${cls}"><td>${idx + 1}</td><td>${tglPendek(tglHari(p, idx))}${idx === hi ? " · <b>hari ini</b>" : ""}</td><td>${keg}</td><td>${teksKum(kum[idx])}</td><td>${st}${telat}</td></tr>`);
    }
    const buka = Math.floor(p.pos / 7) === m || Math.floor(hi / 7) === m;
    const a = tglHari(p, m * 7), b = tglHari(p, Math.min(R.hari.length - 1, m * 7 + 6));
    minggu.push(`<details class="sh-minggu" ${buka ? "open" : ""}><summary><b>Minggu ${m + 1}</b> · ${tglPendek(a)} – ${tglPendek(b)}
      <span class="sh-muted small">→ total ${teksKum(kum[Math.min(R.hari.length - 1, m * 7 + 6)])}</span></summary>
      <div class="sh-scroll"><table class="sh-jt harian"><tr><th>Hari</th><th>Tanggal</th><th>Kegiatan</th><th>Total hafal</th><th>Status</th></tr>${rows.join("")}</table></div></details>`);
  }
  return `<div class="panel sh">
    <div class="sh-head"><h2>📅 Jadwal Silabus · ${esc(NAMA[lv])}</h2><button class="btn ghost sm" onclick="route('sylabus')">← Kembali</button></div>
    ${kartuTarget(R, p, false)}
    <h3>Target per bulan</h3>
    ${htmlTarget(R, p.mulai)}
    <h3>Rincian per hari</h3>
    <p class="sh-muted small">Isi materi hari berikutnya baru bisa dibuka setelah hari sebelumnya tuntas (hafalan ≥ 80% + ujian ≥ 80%). Tanggal di bawah adalah jadwal idealmu sejak mulai ${tgl(awalHari(p.mulai))}.</p>
    ${minggu.join("")}
  </div>`;
}

/* ---------- sesi ujian / tes hafalan ---------- */
let U = null;       // { mode: "ujian"|"hafal", kat?, lv, idx, qs, pos, jawab[], lihat[], mulai, menit, nDokkai }
let _timer = null;
let _hafalKat = null;
const stopTimer = () => { if (_timer) { clearInterval(_timer); _timer = null; } };
function render() { const el = document.getElementById("sh-root"); if (el) el.innerHTML = htmlUjian(); }

function htmlFlyer(fl) {
  if (!fl) return "";
  const rows = (fl.r || []).map(r => `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join("");
  return `<div class="sh-flyer"><div class="t">${esc(fl.e || "")} <b>${esc(fl.j || "")}</b></div>${fl.s ? `<div class="s">${esc(fl.s)}</div>` : ""}
    ${rows ? `<table>${rows}</table>` : ""}${fl.f ? `<div class="f">${esc(fl.f)}</div>` : ""}</div>`;
}
function htmlEx(q) {
  const x = q.ex || {};
  const li = (a) => a && a.length ? `<ul>${a.map(v => `<li>${safe(v)}</li>`).join("")}</ul>` : "";
  const g = x.grammar;
  return `<div class="jx-ex sh-ex">
    ${x.jawaban ? `<p class="ans">✓ ${esc(x.jawaban)}</p>` : ""}
    ${x.terjemahan ? `<p>${esc(x.terjemahan)}</p>` : ""}
    ${x.alasan ? `<p>${esc(x.alasan)}</p>` : ""}
    ${li(x.opsi)}
    ${g ? `<p><b>Pola:</b> ${esc(g.pola)} — ${esc(g.arti)}</p>` : ""}
    ${li(x.kosakata)}${li(x.kanji)}
    ${x.poin ? `<p class="sh-muted">💡 ${esc(x.poin)}</p>` : ""}
  </div>`;
}
function sisaWaktu() { if (!U.menit) return null; return Math.max(0, U.menit * 60 - Math.floor((Date.now() - U.mulai) / 1000)); }
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

function judulSesi() {
  return U.mode === "hafal" ? `🧠 Tes hafalan ${KAT_NAMA[U.kat]} · Hari ${U.idx + 1}` : `${IKON[U.jenis]} Hari ${U.idx + 1} · ${JENIS[U.jenis]}`;
}

function htmlUjian() {
  if (!U) return "";
  if (U.selesai) return htmlHasil();
  const q = U.qs[U.pos];
  const dijawab = U.jawab[U.pos];
  const lihat = U.lihat[U.pos];
  const unit = q.unit;
  const bacaan = unit ? (unit.jp ? `<div class="jx-passage sh-passage"><small>${esc(unit.jenis || "読解")}</small><p class="jp">${safe(unit.jp)}</p></div>` : htmlFlyer(unit.fl)) : "";
  const opts = q.opts.map((o, i) => {
    let cls = "";
    if (lihat) cls = i === q.ans ? "right" : (i === dijawab ? "wrong" : "");
    else if (i === dijawab) cls = "on";
    return `<button class="jx-opt ${cls}" ${lihat ? "disabled" : ""} onclick="SH.jawab(${i})"><span class="k">${ABCD[i]}</span><span class="t">${safe(o)}</span></button>`;
  }).join("");
  const s = sisaWaktu();
  const nav = U.qs.map((x, i) => `<button class="${i === U.pos ? "cur" : ""} ${U.lihat[i] ? (U.jawab[i] === U.qs[i].ans ? "benar" : "salah") : ""}" onclick="SH.lompat(${i})">${i + 1}</button>`).join("");
  return `<div class="panel sh jx">
    <div class="sh-head"><b>${judulSesi()}</b>${s !== null ? `<span class="sh-timer" id="sh-timer">⏱ ${fmt(s)}</span>` : ""}</div>
    <div class="sh-qnav">${nav}</div>
    <div class="sh-qmeta">${U.pos + 1}/${U.qs.length} · ${KAT_NAMA[q.cat] || ""} · ${esc(q.tipe_jp || "")}${q.ulang ? " · 復習 materi sebelumnya" : ""}</div>
    ${bacaan}
    <div class="jx-q sh-q"><div class="txt">${safe(q.q)}</div></div>
    <div class="sh-opts">${opts}</div>
    ${lihat ? htmlEx(q) : ""}
    <div class="sh-row">
      <button class="btn ghost sm" onclick="SH.geser(-1)" ${U.pos === 0 ? "disabled" : ""}>← Sebelumnya</button>
      ${lihat || dijawab === undefined || U.mode === "hafal" ? "" : `<button class="btn sm" onclick="SH.cek()">Cek jawaban</button>`}
      ${U.pos < U.qs.length - 1 ? `<button class="btn ghost sm" onclick="SH.geser(1)">Berikutnya →</button>`
        : (U.reviewMode ? `<button class="btn gold sm" onclick="SH.selesaiReview()">Selesai →</button>` : `<button class="btn gold sm" onclick="SH.kumpul()">✓ Kumpulkan</button>`)}
    </div>
  </div>`;
}

function htmlHasil() {
  const { benar, total, lulus, perKat } = U.hasil;
  const pct = persen(benar, total);
  const perlu = Math.ceil(total * LULUS);
  const rows = Object.entries(perKat).map(([k, v]) => `<tr><td>${KAT_NAMA[k]}</td><td>${v.b}/${v.t}</td></tr>`).join("");
  let pesan, tombol;
  if (U.mode === "hafal") {
    pesan = lulus
      ? `Hafalan ${KAT_NAMA[U.kat]} hari ini lulus. ${U.hafalSemua ? "Semua hafalan lulus — ujian harian sudah terbuka." : "Lanjutkan tes hafalan bagian lainnya."}`
      : `Butuh minimal ${perlu} benar dari ${total} (80%). Hafalkan lagi kartunya, lalu ulangi tesnya — urutan soal dan pilihan diacak ulang.`;
    tombol = lulus
      ? `<button class="btn gold" onclick="route('sylabus')">Lanjut →</button>`
      : `<button class="btn gold" onclick="SH.hafal('${U.kat}')">↻ Ulangi tes hafalan</button><button class="btn ghost" onclick="route('sylabus')">📖 Pelajari kartu lagi</button>`;
  } else {
    pesan = lulus
      ? `Hari ${U.idx + 1} tuntas — Hari ${U.idx + 2} sudah terbuka.`
      : `Butuh minimal ${perlu} benar dari ${total} (80%). Hari ${U.idx + 2} masih terkunci. Pelajari lagi materinya lewat pembahasan, lalu ulangi ujian dengan soal baru.`;
    tombol = lulus
      ? `<button class="btn gold" onclick="route('sylabus')">Lanjut ke Hari ${U.idx + 2} →</button>`
      : `<button class="btn gold" onclick="SH.ulangUjian()">↻ Ulangi ujian (soal baru)</button><button class="btn ghost" onclick="route('sylabus')">📖 Pelajari materi lagi</button>`;
  }
  return `<div class="panel sh">
    <h2>${lulus ? "🎉 Lulus" : "💪 Belum 80%"} — ${pct}%</h2>
    <p>${benar} dari ${total} soal benar. ${pesan}</p>
    ${U.mode === "hafal" ? "" : `<table class="sh-tab">${rows}</table>`}
    <div class="sh-row">${tombol}<button class="btn ghost" onclick="SH.review()">📖 Lihat pembahasan</button></div>
  </div>`;
}

const tungguRoute = () => { setTimeout(() => window.route("sylabus"), 0); return '<div class="loading">Memuat…</div>'; };

function mulaiTimer() {
  stopTimer();
  if (!U.menit) return;
  _timer = setInterval(() => {
    const el = document.getElementById("sh-timer");
    if (!el) { stopTimer(); return; }
    const s = sisaWaktu();
    el.textContent = `⏱ ${fmt(s)}`;
    if (s <= 0) { stopTimer(); toast("Waktu habis — jawaban dikumpulkan."); window.SH.kumpul(true); }
  }, 1000);
}

async function susunHafalan(lv, R, idx, kat) {
  // Satu soal per materi hari itu; tipe pengenalan (arti / baca / arti → kata), urutan & pilihan acak tiap percobaan.
  const h = R.hari[idx];
  const SUKA = { kosakata: ["語彙の意味", "意味から語へ", "漢字読み"], kanji: ["漢字の意味", "漢字の読み"], bunpo: ["文法の意味"] };
  const kset = await kanjiJlpt();
  const kolam = await kolamLevel(lv);
  kolam.ksetLv = await kanjiSampai(lv);
  const items = await muatItems(h.materi[kat]);
  const qs = [];
  for (const id of h.materi[kat]) {
    const ss = soalSederhana(kat, id, items[id], kolam, kset).filter(q => SUKA[kat].includes(q.tipe_jp));
    if (ss.length) qs.push(acak(ss)[0]);
  }
  return acak(qs);
}

async function mulaiHafal() {
  const lv = levelAktif();
  const p = await muatProgres(lv);
  if (!p) return tungguRoute();
  const R = await rencana(lv, p.tempo);
  const h = R.hari[p.pos];
  const kat = _hafalKat;
  if (!h || h.jenis !== "belajar" || !kat || !h.materi[kat].length) return tungguRoute();
  if (U && U.reviewMode && U.mode === "hafal" && U.lv === lv) return `<div id="sh-root">${htmlUjian()}</div>`;
  if (!U || U.mode !== "hafal" || U.kat !== kat || U.lv !== lv || U.idx !== p.pos || U.selesai) {
    const qs = await susunHafalan(lv, R, p.pos, kat);
    if (!qs.length) {   // data materi tidak bisa dijadikan soal → anggap lulus supaya tidak macet
      p.hafal = p.hafal || {}; p.hafal[p.pos] = { ...hafalHari(p, p.pos), [kat]: { b: 0, t: 0, lulus: true, terbaik: 100 } };
      simpanProgres(lv, p); return tungguRoute();
    }
    U = { mode: "hafal", kat, lv, idx: p.pos, jenis: h.jenis, qs, pos: 0, jawab: [], lihat: [], mulai: Date.now(), menit: null, nDokkai: 0 };
  }
  stopTimer();
  return `<div id="sh-root">${htmlUjian()}</div>`;
}

async function mulaiUjian() {
  const lv = levelAktif();
  const p = await muatProgres(lv);
  if (!p) return tungguRoute();
  const R = await rencana(lv, p.tempo);
  const h = R.hari[p.pos];
  if (!h || h.jenis === "simulasi") return tungguRoute();
  if (h.jenis === "belajar" && !hafalTuntas(h, p, p.pos)) { toast("Selesaikan dulu semua tes hafalan (≥ 80%)."); return tungguRoute(); }
  if (U && U.reviewMode && U.mode === "ujian" && U.lv === lv) return `<div id="sh-root">${htmlUjian()}</div>`;
  if (!U || U.mode !== "ujian" || U.lv !== lv || U.idx !== p.pos || U.selesai) {
    const { qs, nDokkai } = await susunUjian(lv, R, p, p.pos);
    if (!qs.length) return `<div class="panel sh"><div class="empty">Soal untuk hari ini belum tersedia.</div><button class="btn" onclick="SH.lewati('${lv}')">Lewati hari ini</button></div>`;
    U = { mode: "ujian", lv, idx: p.pos, jenis: h.jenis, qs, pos: 0, jawab: [], lihat: [], mulai: Date.now(), menit: h.menit, nDokkai };
  }
  mulaiTimer();
  return `<div id="sh-root">${htmlUjian()}</div>`;
}

async function kumpulkan() {
  stopTimer();
  const lv = U.lv;
  const p = await muatProgres(lv);
  let benar = 0;
  const perKat = {};
  p.salah = p.salah || {};
  U.qs.forEach((q, i) => {
    const ok = U.jawab[i] === q.ans;
    if (ok) benar++;
    const k = q.cat;
    perKat[k] = perKat[k] || { b: 0, t: 0 }; perKat[k].t++; if (ok) perKat[k].b++;
    if (q.item && U.mode === "ujian") { if (ok && U.jenis !== "belajar") delete p.salah[q.item]; else if (!ok) p.salah[q.item] = (p.salah[q.item] || 0) + 1; }
    U.lihat[i] = true;
  });
  const total = U.qs.length;
  const lulus = total ? benar / total >= LULUS : true;
  const pct = persen(benar, total);
  U.hasil = { benar, total, lulus, perKat };
  U.selesai = true;
  if (U.mode === "hafal") {
    p.hafal = p.hafal || {};
    const lama = hafalHari(p, U.idx)[U.kat];
    p.hafal[U.idx] = { ...hafalHari(p, U.idx), [U.kat]: { b: benar, t: total, lulus: lulus || !!lama?.lulus, terbaik: Math.max(pct, lama?.terbaik || 0), coba: (lama?.coba || 0) + 1, tgl: Date.now() } };
    const R = await rencana(lv, p.tempo);
    U.hafalSemua = hafalTuntas(R.hari[U.idx], p, U.idx);
  } else {
    p.hasil = p.hasil || {};
    const lama = p.hasil[U.idx];
    p.hasil[U.idx] = { benar, total, lulus, tgl: Date.now(), jenis: U.jenis, coba: (lama?.coba || 0) + 1, terbaik: Math.max(pct, lama?.terbaik || 0) };
    p.dokkaiPos = (p.dokkaiPos || 0) + (U.nDokkai || 0);
    if (lulus) p.pos = U.idx + 1;     // KUNCI: hari berikutnya hanya terbuka bila lulus ≥ 80%
  }
  simpanProgres(lv, p);
  if (lulus && U.mode === "ujian" && FB && S().user) { try { await FB.tambahXP(S().level, U.jenis === "belajar" ? 20 : 40, U.jenis === "belajar" ? 5 : 10); } catch (e) {} }
  render();
}

/* ---------- aksi ---------- */
window.SH = {
  _pilihan: {}, _pilih: "standar",
  async pilihTempo(k) {
    if (k === "custom") {
      const t = {};
      for (const c of KAT) { const el = document.getElementById(`sh-in-${c}`); t[c] = bulat(parseInt(el && el.value, 10) || MAKS[c], +el.min || 1, MAKS[c]); }
      this._pilihan.custom = t;
      toast(`Tempo: ${t.kosakata} kosakata · ${t.kanji} kanji · ${t.bunpo} bunpo per hari`);
      const box = document.getElementById("sh-ms-custom");
      if (box && this._lv) { const R = await rencana(this._lv, t); box.innerHTML = `<p class="sh-muted small">${R.hari.length} hari · selesai ± ${tgl(tambahHari(R.hari.length - 1))}</p>${htmlTarget(R, Date.now())}`; }
    }
    this._pilih = k;
    document.querySelectorAll(".sh-tempo").forEach(b => b.classList.toggle("on", b.dataset.k === k));
    document.querySelectorAll(".sh-ms").forEach(b => { b.hidden = b.dataset.k !== k; });
  },
  async mulai(lv) {
    const lama = await muatProgres(lv);
    const tempo = this._pilihan[this._pilih] || this._pilihan.standar;
    let p;
    if (lama && lama._gantiTempo) {
      // Pertahankan materi yang sudah tuntas: cari hari di rencana baru dengan jumlah materi selesai yang sama.
      const R0 = await rencana(lv, lama.tempo), R1 = await rencana(lv, tempo);
      const selesai = new Set(R0.hari.slice(0, lama.pos).flatMap(h => h.materi ? KAT.flatMap(k => h.materi[k]) : []));
      let pos = 0;
      while (pos < R1.hari.length && (!R1.hari[pos].materi || KAT.flatMap(k => R1.hari[pos].materi[k]).every(id => selesai.has(id)))) pos++;
      // Jadwal dihitung ulang: hari "pos" = hari ini.
      p = { ...lama, tempo, pos, mulai: tglDari(Date.now(), -pos).getTime(), hasil: {}, hafal: {}, _gantiTempo: false };
    } else {
      p = { lv, tempo, mulai: awalHari(Date.now()).getTime(), pos: 0, hasil: {}, hafal: {}, salah: {}, dokkaiPos: 0 };
    }
    U = null;
    simpanProgres(lv, p);
    window.route("sylabus");
  },
  async gantiTempo(lv) {
    const p = await muatProgres(lv);
    if (!p) return;
    p._gantiTempo = true; simpanProgres(lv, p);
    _modeSetup = true; window.route("sylabus");
  },
  async reset(lv) {
    if (!confirm("Ulang silabus dari hari pertama? Progres silabus level ini akan dihapus.")) return;
    LS.del(KEY(lv)); _progres[lv] = null;
    if (FB && S().user) { try { await FB.saveSilabusProgres(lv, { hapus: true, diubah: Date.now() }); } catch (e) {} }
    _progres[lv] = null; LS.del(KEY(lv)); U = null;
    window.route("sylabus");
  },
  async tandaiSimulasi(lv) {
    const p = await muatProgres(lv);
    p.hasil = p.hasil || {}; p.hasil[p.pos] = { lulus: true, tgl: Date.now(), jenis: "simulasi" };
    p.pos += 1; simpanProgres(lv, p); window.route("sylabus");
  },
  async lewati(lv) { const p = await muatProgres(lv); p.pos += 1; simpanProgres(lv, p); U = null; window.route("sylabus"); },
  hafal(kat) { _hafalKat = kat; if (U && U.mode === "hafal") U = null; window.route("sylabus-hafal"); },
  ulangUjian() { U = null; window.route("sylabus-ujian"); },
  jawab(i) {
    if (!U || U.lihat[U.pos]) return;
    U.jawab[U.pos] = i;
    // Tes hafalan: langsung tampilkan benar/salah supaya sekalian menghafal.
    if (U.mode === "hafal") U.lihat[U.pos] = true;
    render();
  },
  cek() { if (!U) return; U.lihat[U.pos] = true; render(); },
  geser(d) { if (!U) return; U.pos = bulat(U.pos + d, 0, U.qs.length - 1); render(); },
  lompat(i) { if (!U) return; U.pos = i; render(); },
  kumpul(paksa) {
    if (!U || U.selesai || U.reviewMode) return;
    const kosong = U.qs.filter((_, i) => U.jawab[i] === undefined).length;
    if (!paksa && kosong && !confirm(`${kosong} soal belum dijawab. Kumpulkan sekarang?`)) return;
    kumpulkan();
  },
  review() { if (!U) return; U.selesai = false; U.reviewMode = true; U.pos = 0; U.menit = null; render(); },
  selesaiReview() { U = null; window.route("sylabus"); },
};

let _modeSetup = false;
async function renderSilabus() {
  stopTimer();
  if (U && (U.selesai || U.reviewMode)) U = null;
  const lv = levelAktif();
  const p = await muatProgres(lv);
  if (!p || p.hapus || _modeSetup || p._gantiTempo) { _modeSetup = false; return viewSetup(lv); }
  return viewBeranda(lv, p);
}

export const SILABUS_ROUTES = {
  sylabus: () => renderSilabus(),
  "sylabus-ujian": () => mulaiUjian(),
  "sylabus-hafal": () => mulaiHafal(),
  "sylabus-jadwal": () => viewJadwal(),
};

// Untuk uji otomatis (tools / node), tidak dipakai UI.
export const _uji = { susunUjian, susunHafalan, rencana, kumulatif, get U() { return U; } };
