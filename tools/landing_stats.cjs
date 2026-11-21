/* Hitung statistik NYATA dari data repo → js/landing-stats.js (dipakai landing.html).
 * Jalankan ulang setelah materi bertambah:  node tools/landing_stats.cjs */
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const J = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const len = (d) => Array.isArray(d) ? d.length : Object.values(d).filter(Array.isArray).reduce((a, x) => a + x.length, 0);

const lv = ["n5", "n4", "n3", "n2", "n1"], ir = ["ir0", "ir1", "ir2"];
const S = { jlpt: {}, ssw: {}, total: {} };
let kosa = 0, kanji = 0, bunpou = 0;
for (const l of lv) {
  const k = len(J(`data/kosakata-${l}.json`)), kj = len(J(`data/kanji-${l}.json`)), b = len(J(`data/bunpou-${l}.json`));
  S.jlpt[l] = { kosakata: k, kanji: kj, bunpou: b, soal: 0, paket: 0, ujian: 0 };
  kosa += k; kanji += kj; bunpou += b;
}
const idx = J("jlpt/index.json");
let soal = 0, paket = 0, ujian = 0;
for (const l of lv) for (const [jenis, arr] of Object.entries(idx.level[l] || {})) for (const e of arr) {
  S.jlpt[l].soal += e.jumlah || 0; S.jlpt[l].paket++;
  if (jenis === "full") S.jlpt[l].ujian++;
  soal += e.jumlah || 0; paket++; if (jenis === "full") ujian++;
}
let jftK = 0, jftKj = 0;
for (const l of ir) { jftK += len(J(`data/kosakata-${l}.json`)); jftKj += len(J(`data/kanji-${l}.json`)); }
const bank = J("data/jft/bank.json");
const jftSoal = ["conv", "read", "listen"].reduce((a, k) => a + (bank[k] || []).length, 0);

const fam = new Set(); const SKIP = [];
let sswBidang = 0, sswBab = 0, sswSub = 0, sswQuiz = 0, sswVocab = 0, sswPages = 0;
for (const d of fs.readdirSync(path.join(root, "data/ssw"))) {
  if (SKIP.includes(d)) continue;
  const ip = `data/ssw/${d}/index.json`; if (!fs.existsSync(path.join(root, ip))) continue;
  const ix = J(ip); if (!ix.bab || !ix.bab.length) continue;
  fam.add(d);
  for (const b of ix.bab) { sswBab++; try { sswSub += (J(`data/ssw/${d}/${b.file}`).bab.subs || []).length; } catch (e) {} }
  try { const q = J(`data/ssw/${d}/quiz.json`); for (const arr of Object.values(q.bab || {})) for (const kz of arr) sswQuiz += (kz.items || []).length; } catch (e) {}
  try { sswVocab += len(J(`data/ssw/${d}/vocab.json`)); } catch (e) {}
  sswPages += Object.values(ix.pages || {}).reduce((a, x) => a + (+x || 0), 0);
}
/* daftar bidang dari js/ssw-core.js (DEFAULT_BIDANG) — pulau & buku scan di landing */
const core = fs.readFileSync(path.join(root, "js/ssw-core.js"), "utf8");
const rows = core.split("\n").filter((l) => /^\s*\{ slug: "/.test(l)).map((l) => { try { return (new Function("return (" + l.trim().replace(/,\s*$/, "") + ")"))(); } catch (e) { return null; } }).filter(Boolean);
const shortName = (n) => n.replace(/\s*\(.*\)\s*$/, "").replace(/\s*—.*$/, "");
const has = (slug) => { try { const ix = J(`data/ssw/${slug}/index.json`); return ix.bab && ix.bab.length; } catch (e) { return false; } };
const tops = rows.filter((r) => !r.induk && r.aktif !== false && has(r.slug) || (!r.induk && r.hub));
const islands = tops.map((r) => ({ slug: r.slug, nama: shortName(r.nama), jp: r.jp, tema: r.tema, sub: rows.filter((x) => x.induk === r.slug).length }));
const book = [];
for (const r of rows) {
  if (!has(r.slug)) continue;
  let ix; try { ix = J(`data/ssw/${r.slug}/index.json`); } catch (e) { continue; }
  if (ix.nobook) continue;
  const langs = {};
  for (const lg of ["id", "jp"]) {
    const n = +(ix.pages || {})[lg] || 0; if (n < 14) continue;
    for (let p = 10; p < n - 1; p++) { const f = (q) => path.join(root, `assets/ssw/${r.slug}/${lg}/p${String(q).padStart(2, "0")}.webp`); if (fs.existsSync(f(p)) && fs.existsSync(f(p + 1))) { langs[lg] = { start: p, total: n }; break; } }
  }
  if (Object.keys(langs).length) {
    const par = r.induk ? rows.find((x) => x.slug === r.induk) : null;
    const paren = (r.nama.match(/\(([^)]+)\)\s*$/) || [])[1];
    const nama = par ? shortName(par.nama) + " · " + (paren || r.jp) : shortName(r.nama);
    book.push({ slug: r.slug, nama, jp: r.jp, langs });
  }
}
S.ssw = { islands, book, sektor: rows.filter((r) => has(r.slug)).length };
const mens = J("data/mensetsu/index.json").bidang.reduce((a, x) => a + (x.jumlah || 0), 0);
const kana = (() => { try { return len(J("data/kana.json")); } catch (e) { return 0; } })();

S.total = { kosakataJlpt: kosa, kanjiJlpt: kanji, bunpouJlpt: bunpou, soalJlpt: soal, paketJlpt: paket, ujianJlpt: ujian,
  kosakataJft: jftK, kanjiJft: jftKj, soalJft: jftSoal,
  sswBidang: islands.length, sswBab, sswSub, sswQuiz, sswHalamanBuku: sswPages, mensetsu: mens, kana };
fs.writeFileSync(path.join(root, "js/landing-stats.js"),
  "/* DIHASILKAN otomatis oleh tools/landing_stats.cjs — jangan edit manual. */\nwindow.LANDING_STATS = " + JSON.stringify(S, null, 1) + ";\n");
console.log(S.total); console.log(S.ssw.islands.length, "pulau;", S.ssw.book.length, "buku;", S.ssw.sektor, "sektor"); console.log(S.jlpt);
