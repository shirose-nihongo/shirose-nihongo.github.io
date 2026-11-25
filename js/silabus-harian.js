/* =====================================================================
 * SILABUS HARIAN 毎日のシラバス — JLPT N5–N1 + JFT-Basic (Irodori)
 *
 * Patokan = beban harian (kosakata / kanji / bunpo per hari), durasi mengikuti.
 * Pola minggu: 6 hari belajar + hari ke-7 fukushu (tiap minggu ke-4 = ujian bulanan).
 * Setelah materi habis: fase simulasi (ujian penuh format asli ↔ hari perbaikan).
 *
 * Data (dibuat oleh tools/silabus_build.py & tools/silabus_soal.py):
 *   data/silabus/{lv}.json            urutan materi standar per hari
 *   data/silabus/{lv}-soal-{minggu}.json  soal format ujian asli per materi (+ pembahasan)
 *   data/silabus/{lv}-dokkai.json     bacaan berurutan pendek → panjang
 * Progres: localStorage + Firestore siswa/{uid}/silabus/{lv}.
 * Route: #sylabus (beranda silabus), #sylabus-ujian (sesi ujian hari aktif)
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
    const bulanan = Math.floor(hari.length / 7 + 1) % 4 === 0;
    hari.push(bulanan
      ? { jenis: "bulanan", dari: [...semua, ...minggu], fokus: minggu, soal: { kosakata: 10, kanji: 10, bunpo: 10, dokkai: 3 }, menit: 40 }
      : { jenis: "fukushu", dari: [...minggu], soal: { kosakata: 6, kanji: 6, bunpo: 6, dokkai: 2 }, menit: 25 });
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
    if (h.jenis === "bulanan" && h.fokus) {
      // 60% dari 4 minggu terakhir, sisanya acak dari semua materi sebelumnya + yang pernah salah.
      const baru = idsHari(R, h.fokus.concat((h.dari || []).slice(-24)))[k];
      ids = [...new Set([...baru, ...acak(ids).slice(0, n * 2)])];
    }
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
const JENIS = { belajar: "Belajar", fukushu: "Fukushu 復習", bulanan: "Ujian bulanan", simulasi: "Simulasi ujian", perbaikan: "Perbaikan" };
const IKON = { belajar: "📗", fukushu: "🔁", bulanan: "🏁", simulasi: "🎯", perbaikan: "🛠️" };
const tgl = (d) => d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
const tambahHari = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d; };

function bulanTempo(R) { return (R.hari.length / 30).toFixed(1).replace(".", ","); }

async function viewSetup(lv) {
  const std = await dat(`./data/silabus/${lv}.json`);
  if (!std) return `<div class="panel"><h2>🗺️ Silabus</h2><div class="empty">Data silabus ${esc(NAMA[lv])} belum tersedia.</div></div>`;
  const pilihan = [
    ["santai", "🐢 Santai", tempoMin(std)],
    ["standar", "📘 Standar", tempoStd(std)],
    ["cepat", "🚀 Paling cepat", { ...MAKS }],
  ];
  const kartu = [];
  for (const [k, nm, t] of pilihan) {
    const R = await rencana(lv, t);
    const b = R.hari.find(h => h.jenis === "belajar");
    const nSoal = KAT.reduce((s, c) => s + b.soal[c], 0) + b.soal.dokkai;
    kartu.push(`<button class="sh-tempo ${k === "standar" ? "on" : ""}" data-k="${k}" onclick="SH.pilihTempo('${k}')">
      <b>${nm}</b><span class="dur">${R.hari.length} hari · ± ${bulanTempo(R)} bulan</span>
      <span>${t.kosakata} kosakata · ${t.kanji} kanji · ${t.bunpo} bunpo / hari (maks.)</span>
      <span>${nSoal} soal ujian harian</span><span class="sel">Selesai ± ${tgl(tambahHari(R.hari.length))}</span></button>`);
  }
  window.SH._pilihan = Object.fromEntries(pilihan.map(([k, , t]) => [k, t]));
  window.SH._pilih = "standar";
  return `<div class="panel sh">
    <h2>🗺️ Silabus Harian · ${esc(NAMA[lv])}</h2>
    <p class="sh-muted">Pilih kecepatan belajarmu. Materi ${std.total.kosakata} kosakata, ${std.total.kanji} kanji, dan ${std.total.bunpo} bunpo dibagi rata per hari.
      Setiap minggu: 6 hari belajar + 1 hari fukushu. Tiap 4 minggu ada ujian bulanan, dan di akhir ada simulasi ujian asli.</p>
    <div class="sh-tempos">${kartu.join("")}</div>
    <details class="sh-custom"><summary>Atur sendiri (maks. 30 kosakata · 20 kanji · 10 bunpo per hari)</summary>
      <div class="sh-row">${KAT.map(k => `<label>${KAT_NAMA[k]}/hari <input type="number" id="sh-in-${k}" min="${tempoMin(std)[k]}" max="${MAKS[k]}" value="${std.standar[k]}"></label>`).join("")}</div>
      <button class="btn ghost sm" onclick="SH.pilihTempo('custom')">Pakai angka ini</button>
    </details>
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
    const r = p.hasil && p.hasil[idx];
    const cls = idx === pos ? "now" : (r ? (r.lulus ? "ok" : "ng") : "");
    return `<div class="sh-dot ${cls}" title="Hari ${idx + 1} · ${JENIS[h.jenis]}"><span>${IKON[h.jenis]}</span><small>${idx + 1}</small></div>`;
  }).join("")}</div>`;
}

async function viewBeranda(lv, p) {
  const R = await rencana(lv, p.tempo);
  if (p.pos >= R.hari.length) {
    return `<div class="panel sh"><h2>🎉 Silabus ${esc(NAMA[lv])} selesai!</h2>
      <p>Kamu sudah menyelesaikan ${R.hari.length} hari. Lanjutkan latihan dengan ujian penuh di JLPT Center atau tryout JFT.</p>
      <div class="sh-row"><button class="btn gold" onclick="route('${lv === "jft" ? "jft-tryout" : "jlpt"}')">🎯 Latihan ujian penuh</button>
      <button class="btn ghost" onclick="SH.reset('${lv}')">↺ Mulai ulang silabus</button></div></div>`;
  }
  const h = R.hari[p.pos];
  const done = p.pos;
  const pct = Math.round(done / R.hari.length * 100);
  const sisa = R.hari.length - p.pos;
  let isi = "";
  if (h.jenis === "belajar") {
    const kset = await kanjiJlpt();
    const items = await muatItems(KAT.flatMap(k => h.materi[k]));
    const blok = (k) => h.materi[k].length ? `<h3>${KAT_NAMA[k]} <small>(${h.materi[k].length})</small></h3><div class="sh-cards">${h.materi[k].map(id => kartuMateri(k, items[id], kset)).join("")}</div>` : "";
    const nSoal = KAT.reduce((s, c) => s + h.soal[c], 0) + h.soal.dokkai;
    isi = `<p class="sh-muted">Fase <b>${h.fase}</b> · Pelajari semua kartu, lalu kerjakan ujian ${nSoal} soal${h.menit ? ` (${h.menit} menit)` : ""}. Lulus jika ≥ 70%.
        <a href="#" onclick="route('sylabus-ujian'); return false;">Langsung ke ujian ↓</a></p>
      ${KAT.map(blok).join("")}`;
  } else if (h.jenis === "simulasi") {
    isi = `<p>Hari ini ujian penuh format asli ${lv === "jft" ? "JFT-Basic" : esc(NAMA[lv])}. Semua materi sudah kamu pelajari, jadi kerjakan seperti ujian sungguhan: sekali duduk, tanpa membuka catatan.</p>
      <div class="sh-row"><button class="btn gold" onclick="route('${lv === "jft" ? "jft-tryout" : `jlpt/${lv}`}')">🎯 Buka ujian penuh</button></div>
      <p class="sh-muted small">Setelah selesai, kembali ke sini dan tandai hari ini selesai.</p>`;
  } else {
    const nSoal = KAT.reduce((s, c) => s + h.soal[c], 0) + h.soal.dokkai;
    const ket = { fukushu: "Mengulang materi 6 hari minggu ini. Soal dari materi yang pernah salah keluar lebih dulu.",
      bulanan: "Ujian kumulatif sejak hari pertama, dengan porsi lebih besar untuk 4 minggu terakhir. Format seperti ujian asli.",
      perbaikan: "Mengulang materi yang salah di ujian-ujian sebelumnya." }[h.jenis];
    isi = `<p>${ket}</p><p class="sh-muted">${nSoal} soal · ${h.menit} menit · lulus ≥ 70%</p>`;
  }
  const tombol = h.jenis === "simulasi"
    ? `<button class="btn" onclick="SH.tandaiSimulasi('${lv}')">✓ Saya sudah menyelesaikan simulasi</button>`
    : `<button class="btn gold sh-mulai" onclick="route('sylabus-ujian')">📝 Mulai ujian ${h.jenis === "belajar" ? "hari ini" : JENIS[h.jenis].toLowerCase()}</button>`;
  const antre = Object.keys(p.salah || {}).length;
  return `<div class="panel sh">
    <div class="sh-head"><h2>${IKON[h.jenis]} Hari ${p.pos + 1} · ${JENIS[h.jenis]}</h2><span class="sh-lv">${esc(NAMA[lv])}</span></div>
    <div class="sh-prog"><div style="width:${pct}%"></div></div>
    <p class="sh-muted small">${done} dari ${R.hari.length} hari selesai · sisa ${sisa} hari · perkiraan selesai ${tgl(tambahHari(sisa))}
      · tempo ${p.tempo.kosakata}/${p.tempo.kanji}/${p.tempo.bunpo}${antre ? ` · ${antre} materi di antrean ulang` : ""}</p>
    ${stripMinggu(R, p)}
    ${isi}
    <div class="sh-row">${tombol}</div>
    <details class="sh-custom"><summary>Pengaturan</summary>
      <div class="sh-row"><button class="btn ghost sm" onclick="SH.gantiTempo('${lv}')">Ganti tempo</button>
      <button class="btn ghost sm" onclick="SH.reset('${lv}')">↺ Ulang dari awal</button>
      <button class="btn ghost sm" onclick="route('sylabus-peta')">Peta materi lama</button></div>
      <p class="sh-muted small">Ganti tempo tidak menghapus materi yang sudah selesai; materi yang belum dipelajari dibagi ulang.</p>
    </details>
  </div>`;
}

/* ---------- sesi ujian ---------- */
let U = null;       // { lv, idx, qs, pos, jawab[], lihat[], mulai, menit, nDokkai }
let _timer = null;
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
    <div class="sh-head"><b>${IKON[U.jenis]} Hari ${U.idx + 1} · ${JENIS[U.jenis]}</b>${s !== null ? `<span class="sh-timer" id="sh-timer">⏱ ${fmt(s)}</span>` : ""}</div>
    <div class="sh-qnav">${nav}</div>
    <div class="sh-qmeta">${U.pos + 1}/${U.qs.length} · ${KAT_NAMA[q.cat] || ""} · ${esc(q.tipe_jp || "")}${q.ulang ? " · 復習 materi sebelumnya" : ""}</div>
    ${bacaan}
    <div class="jx-q sh-q"><div class="txt">${safe(q.q)}</div></div>
    <div class="sh-opts">${opts}</div>
    ${lihat ? htmlEx(q) : ""}
    <div class="sh-row">
      <button class="btn ghost sm" onclick="SH.geser(-1)" ${U.pos === 0 ? "disabled" : ""}>← Sebelumnya</button>
      ${lihat || dijawab === undefined ? "" : `<button class="btn sm" onclick="SH.cek()">Cek jawaban</button>`}
      ${U.pos < U.qs.length - 1 ? `<button class="btn ghost sm" onclick="SH.geser(1)">Berikutnya →</button>`
        : (U.reviewMode ? `<button class="btn gold sm" onclick="SH.selesaiReview()">Selesai →</button>` : `<button class="btn gold sm" onclick="SH.kumpul()">✓ Kumpulkan</button>`)}
    </div>
  </div>`;
}

function htmlHasil() {
  const { benar, total, lulus, perKat } = U.hasil;
  const pct = total ? Math.round(benar / total * 100) : 0;
  const rows = Object.entries(perKat).map(([k, v]) => `<tr><td>${KAT_NAMA[k]}</td><td>${v.b}/${v.t}</td></tr>`).join("");
  return `<div class="panel sh">
    <h2>${lulus ? "🎉 Lulus" : "💪 Belum lulus"} — ${pct}%</h2>
    <p>${benar} dari ${total} soal benar. ${lulus ? "Hari ini selesai, lanjut ke hari berikutnya." : "Hari ini tetap dianggap selesai; materi yang salah masuk antrean dan muncul lagi di fukushu."}</p>
    <table class="sh-tab">${rows}</table>
    <div class="sh-row"><button class="btn gold" onclick="route('sylabus')">Lanjut →</button>
    <button class="btn ghost" onclick="SH.review()">📖 Lihat pembahasan</button></div>
  </div>`;
}

async function mulaiUjian() {
  const lv = levelAktif();
  const p = await muatProgres(lv);
  if (!p) { setTimeout(() => window.route("sylabus"), 0); return '<div class="loading">Memuat…</div>'; }
  const R = await rencana(lv, p.tempo);
  const h = R.hari[p.pos];
  if (!h || h.jenis === "simulasi") { setTimeout(() => window.route("sylabus"), 0); return '<div class="loading">Memuat…</div>'; }
  if (U && U.reviewMode && U.lv === lv) return `<div id="sh-root">${htmlUjian()}</div>`;
  if (!U || U.lv !== lv || U.idx !== p.pos || U.selesai) {
    const { qs, nDokkai } = await susunUjian(lv, R, p, p.pos);
    if (!qs.length) return `<div class="panel sh"><div class="empty">Soal untuk hari ini belum tersedia.</div><button class="btn" onclick="SH.lewati('${lv}')">Lewati hari ini</button></div>`;
    U = { lv, idx: p.pos, jenis: h.jenis, qs, pos: 0, jawab: [], lihat: [], mulai: Date.now(), menit: h.menit, nDokkai };
  }
  stopTimer();
  if (U.menit) {
    _timer = setInterval(() => {
      const el = document.getElementById("sh-timer");
      if (!el) { stopTimer(); return; }
      const s = sisaWaktu();
      el.textContent = `⏱ ${fmt(s)}`;
      if (s <= 0) { stopTimer(); toast("Waktu habis — jawaban dikumpulkan."); window.SH.kumpul(true); }
    }, 1000);
  }
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
    if (q.item) { if (ok && U.jenis !== "belajar") delete p.salah[q.item]; else if (!ok) p.salah[q.item] = (p.salah[q.item] || 0) + 1; }
    U.lihat[i] = true;
  });
  const total = U.qs.length;
  const lulus = total ? benar / total >= 0.7 : true;
  U.hasil = { benar, total, lulus, perKat };
  U.selesai = true;
  p.hasil = p.hasil || {};
  p.hasil[U.idx] = { benar, total, lulus, tgl: Date.now(), jenis: U.jenis };
  p.dokkaiPos = (p.dokkaiPos || 0) + (U.nDokkai || 0);
  p.pos = U.idx + 1;
  simpanProgres(lv, p);
  if (lulus && FB && S().user) { try { await FB.tambahXP(S().level, U.jenis === "belajar" ? 20 : 40, U.jenis === "belajar" ? 5 : 10); } catch (e) {} }
  render();
}

/* ---------- aksi ---------- */
window.SH = {
  _pilihan: {}, _pilih: "standar",
  pilihTempo(k) {
    if (k === "custom") {
      const t = {};
      for (const c of KAT) { const el = document.getElementById(`sh-in-${c}`); t[c] = bulat(parseInt(el && el.value, 10) || MAKS[c], +el.min || 1, MAKS[c]); }
      this._pilihan.custom = t;
      toast(`Tempo: ${t.kosakata} kosakata · ${t.kanji} kanji · ${t.bunpo} bunpo per hari`);
    }
    this._pilih = k;
    document.querySelectorAll(".sh-tempo").forEach(b => b.classList.toggle("on", b.dataset.k === k));
  },
  async mulai(lv) {
    const lama = await muatProgres(lv);
    const tempo = this._pilihan[this._pilih] || this._pilihan.standar;
    let p;
    if (lama && lama._gantiTempo) {
      // Pertahankan materi yang sudah selesai: cari hari di rencana baru dengan jumlah materi selesai yang sama.
      const R0 = await rencana(lv, lama.tempo), R1 = await rencana(lv, tempo);
      const selesai = new Set(R0.hari.slice(0, lama.pos).flatMap(h => h.materi ? KAT.flatMap(k => h.materi[k]) : []));
      let pos = 0;
      while (pos < R1.hari.length && (!R1.hari[pos].materi || KAT.flatMap(k => R1.hari[pos].materi[k]).every(id => selesai.has(id)))) pos++;
      p = { ...lama, tempo, pos, hasil: {}, _gantiTempo: false };
    } else {
      p = { lv, tempo, mulai: Date.now(), pos: 0, hasil: {}, salah: {}, dokkaiPos: 0 };
    }
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
  jawab(i) { if (!U || U.lihat[U.pos]) return; U.jawab[U.pos] = i; render(); },
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
  if (U && U.selesai) U = null;
  const lv = levelAktif();
  const p = await muatProgres(lv);
  if (!p || p.hapus || _modeSetup || p._gantiTempo) { _modeSetup = false; return viewSetup(lv); }
  return viewBeranda(lv, p);
}

export const SILABUS_ROUTES = {
  sylabus: () => renderSilabus(),
  "sylabus-ujian": () => mulaiUjian(),
};

// Untuk uji otomatis (tools / node), tidak dipakai UI.
export const _uji = { susunUjian, rencana };
