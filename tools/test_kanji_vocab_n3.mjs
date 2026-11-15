// Tes khusus: kosakata berbasis Kanji (N5-N1; N3 paling detail). Jalankan: node tools/test_kanji_vocab_n3.mjs
import fs from "node:fs";
import { buildKanjiVocab, kanjiVocabCards, makeChoices, isKanjiChar, cleanKata } from "../js/kanji-vocab.js";
const J = (p) => JSON.parse(fs.readFileSync(new URL("../" + p, import.meta.url), "utf8"));
let fail = 0; const ok = (c, m) => { if (!c) { fail++; console.log("GAGAL:", m); } else console.log("ok   :", m); };
const strokeCh = new Set();
for (const f of fs.readdirSync(new URL("../data/kanji-strokes/", import.meta.url))) { if (f.startsWith("_")) continue; for (const ch of Object.keys(J("data/kanji-strokes/" + f))) strokeCh.add(ch); }
const noOf = (it, i) => (Number.isFinite(it?.no) ? it.no : i + 1);
const summary = [];

for (const lv of ["n5", "n4", "n3", "n2", "n1", "ir0", "ir1", "ir2"]) {
  console.log(`\n=== ${lv.toUpperCase()} ===`);
  const K = J(`data/kanji-${lv}.json`), V = J(`data/kosakata-${lv}.json`);
  const idx = buildKanjiVocab(K, V), cards = kanjiVocabCards(idx);
  const mains = new Set(K.map(k => k.k));
  ok(idx.perKanji.length === K.length, `${lv}: ${K.length} Kanji utama terindeks`);
  // 1. Kanji satuan bukan kartu, kecuali kata yang dicantumkan database di `c` miliknya sendiri
  ok(cards.every(c => c.tipe === "kosakata"), `${lv}: semua kartu bertipe kosakata`);
  const explicitSelf = new Set(K.flatMap(k => (k.c || []).map(c => cleanKata(c.k)).filter(x => x === k.k)));
  const inKos = new Set(V.map(x => cleanKata(x.kata || x.k)));
  const singles = cards.filter(c => mains.has(c.front));
  ok(singles.every(c => (explicitSelf.has(c.front) || inKos.has(c.front) || c.skey === "kj:" + c.front) && c.reading && c.back), `${lv}: kartu satu-Kanji (${singles.length}) hanya kata eksplisit di database atau cadangan Kanji-tanpa-kosakata, ber-baca & ber-arti`);
  const asWordElsewhere = (ch) => K.some(o => o.k !== ch && (o.c || []).some(x => cleanKata(x.k) === ch));
  const unlisted = K.filter(k => !explicitSelf.has(k.k) && !asWordElsewhere(k.k) && !inKos.has(k.k));
  const fbs = idx.vocab.filter(v => v.fallback);
  ok(unlisted.every(k => !cards.some(c => c.front === k.k && !c.skey.startsWith("kj:"))), `${lv}: Kanji yang bukan kata (${unlisted.length}) tidak jadi kartu kosakata`);
  ok(fbs.every(v => v.key === "kj:" + v.kata && K.every((k, i) => k.k !== v.kata || (idx.perKanji[i].length === 1 && idx.perKanji[i][0] === v))), `${lv}: ${fbs.length} kartu cadangan Kanji hanya untuk Kanji yang tidak punya kosakata lain`);
  ok(K.every((k, i) => idx.perKanji[i].length >= 1), `${lv}: setiap Kanji utama punya >= 1 kartu`);
  ok(cards.every(c => Array.from(c.front).some(isKanjiChar)), `${lv}: semua kartu mengandung kanji`);
  // 2. Tanpa duplikat
  const keys = cards.map(c => c.skey), fronts = cards.map(c => c.front);
  ok(new Set(keys).size === keys.length && new Set(fronts).size === fronts.length, `${lv}: ${cards.length} kartu, kunci & kata unik`);
  // 3. Multi-Kanji satu identitas
  const shared = idx.vocab.filter(v => v.kanji.length > 1);
  const appears = (v) => idx.perKanji.filter(l => l.includes(v)).length;
  ok(shared.every(v => cards.filter(c => c.front === v.kata).length === 1 && appears(v) === v.kanji.length), `${lv}: kata multi-Kanji (${shared.length}) 1 kartu, muncul di tiap Kanji utamanya`);
  // 3b. Penautan dua arah: kata muncul di daftar SETIAP Kanji utama yang dimuatnya (c + tabel kosakata level)
  const mainsIn = (kata) => [...new Set(Array.from(kata))].filter(ch => mains.has(ch));
  const kiOf = (ch) => K.map((k, i) => k.k === ch ? i : -1).filter(i => i >= 0);
  ok(idx.vocab.every(v => mainsIn(v.kata).every(ch => v.kanji.includes(ch) && kiOf(ch).every(ki => idx.perKanji[ki].includes(v)))), `${lv}: tiap kata muncul di daftar semua Kanji utama yang dimuatnya`);
  const extras = idx.vocab.filter(v => v.extra);
  ok(extras.every(v => v.kosNo != null && v.key === "k:" + v.kosNo && mainsIn(v.kata).length > 0), `${lv}: ${extras.length} kata tambahan dari tabel kosakata memakai identitas lama (tanpa kartu baru)`);
  ok(K.every((k, i) => new Set(idx.perKanji[i]).size === idx.perKanji[i].length), `${lv}: tidak ada kata ganda dalam daftar satu Kanji`);
  // 4. Identitas lama dipakai ulang
  const byNo = new Map(V.map((x, i) => [noOf(x, i), x]));
  const linked = idx.vocab.filter(v => v.kosNo != null);
  ok(linked.every(v => v.key === "k:" + v.kosNo && cleanKata(byNo.get(v.kosNo).kata || byNo.get(v.kosNo).k) === v.kata), `${lv}: ${linked.length} kata tertaut ke kosakata-${lv} memakai kunci lama k:<no> (progres lama aman)`);
  ok(idx.vocab.filter(v => v.kosNo == null && !v.fallback).every(v => v.key === "kv:" + v.kata), `${lv}: kata baru memakai kunci kv:<kata>`);
  // 5. Data lengkap
  ok(cards.every(c => c.reading && c.back), `${lv}: semua kartu punya cara baca & arti`);
  const miss = new Set(); idx.vocab.forEach(v => v.chars.forEach(ch => { if (!strokeCh.has(ch)) miss.add(ch); }));
  ok(miss.size === 0, `${lv}: data goresan lokal ada untuk semua karakter kanji${miss.size ? " (kurang: " + [...miss].join("") + ")" : ""}`);
  const noVocab = K.filter((k, i) => idx.perKanji[i].every(v => v.fallback));
  console.log(`info : ${lv}: Kanji tanpa kosakata di database (pakai kartu Kanji sendiri): ${noVocab.length}${noVocab.length && noVocab.length < 12 ? " (" + noVocab.map(k => k.k).join("") + ")" : ""}`);
  // 6. Pilihan latihan
  const v0 = idx.vocab[0];
  const ch = makeChoices(idx, v0, "kana"), ch2 = makeChoices(idx, v0, "arti");
  ok(ch.length === 4 && ch.includes(v0.kana) && new Set(ch).size === 4 && ch2.length === 4 && ch2.includes(v0.arti), `${lv}: pilihan latihan membaca/arti 4 opsi unik`);
  summary.push(`${lv.toUpperCase()}: Kanji ${K.length} | kosakata ${idx.vocab.length} (tertaut ${linked.length}, baru ${idx.vocab.length - linked.length}) | kata multi-Kanji ${shared.length} | Kanji tanpa kosakata (kartu Kanji sendiri) ${noVocab.length}`);

  if (lv === "n3") {   // kasus khusus yang diminta
    ok(idx.byKata.get("昔")?.kana === "むかし", "n3: 昔 (むかし) jadi kartu");
    ok(idx.byKata.get("王様")?.kana === "おうさま" && idx.byKata.get("王様").kanji.includes("王"), "n3: 王様 (おうさま) jadi kartu untuk Kanji 王");
    ok(!cards.some(c => c.front === "政" || c.front === "駐"), "n3: 政 / 駐 tidak jadi kartu");
    ok(noVocab.length === 0, "n3: setiap Kanji utama punya minimal 1 kosakata asli");
  }
}
// Regresi bahasa: data JLPT & JFT tidak boleh berisi huruf khas bahasa Vietnam
console.log("\n=== Audit bahasa (JLPT + JFT) ===");
const VN = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
const scan = (o) => typeof o === "string" ? (VN.test(o) ? [o] : []) : Array.isArray(o) ? o.flatMap(scan) : o && typeof o === "object" ? Object.values(o).flatMap(scan) : [];
for (const lv of ["n5", "n4", "n3", "n2", "n1", "ir0", "ir1", "ir2"]) for (const kind of ["kanji", "kosakata", "bunpou"]) {
  const bad = scan(J(`data/${kind}-${lv}.json`)).filter(t => !/Pokémon/.test(t));   // Pokémon = nama asli, bukan Vietnam
  ok(bad.length === 0, `${kind}-${lv}: tidak ada teks Vietnam${bad.length ? " (" + bad.slice(0, 3).join(" | ") + ")" : ""}`);
}

// Soal latihan (jlpt/*) + data SSW + kata Vietnam tanpa tanda + sisa bahasa Inggris
import { readdirSync, readFileSync as RF, statSync } from "node:fs";
const walkJ = (d) => readdirSync(d).flatMap(f => { const p = d + "/" + f; return statSync(p).isDirectory() ? walkJ(p) : p.endsWith(".json") ? [p] : []; });
const VT = new Set("tinh xoay treo giao quanh cung khinh nhau suy duy nghi xua hoan nhung gieo khua canh giam ngoan giai vung khay nhu danh phun khoe khoang ngang vun nho truy nguy oai lanh khoan khen xong thay tha phi huy phong coi can anh".split(" "));
const EN = new Set("the of and or is are was with from this that which something someone often usually especially used being person people thing things way very to for in on at by sooner later swift expedited hand-made".split(" "));
const strs = (o) => typeof o === "string" ? [o] : Array.isArray(o) ? o.flatMap(strs) : o && typeof o === "object" ? Object.entries(o).filter(([k]) => !["id","voices","img","ref","ck","oimg","jp","instrVoice","title"].includes(k)).flatMap(([, v]) => strs(v)) : [];
console.log("\n=== Audit bahasa (soal latihan + SSW + data) ===");
const files = [...walkJ("jlpt"), ...walkJ("data/ssw"), ...["kanji","kosakata","bunpou"].flatMap(k => ["n5","n4","n3","n2","n1","ir0","ir1","ir2"].map(l => `data/${k}-${l}.json`))];
let nVN = [], nTok = [], nEN = [];
for (const f of files) for (const t of strs(JSON.parse(RF(f, "utf8")))) {
  if (VN.test(t) && !/Pok[eé]mon|Oboré|À la carte|à la carte|entrée|sauté|FUGÔ|GÔKAKU/i.test(t)) nVN.push(f + ": " + t.slice(0, 60));
  const plain = t.replace(/<[^>]+>/g, "").toLowerCase();
  if (/(kanji|kosakata)-/.test(f) || f.startsWith("jlpt/")) {
    for (const w of plain.match(/[a-z]+/g) || []) { if (VT.has(w)) { nTok.push(f + ": " + t.slice(0, 60)); break; } }
  }
  if (/data\/(kanji|kosakata)-/.test(f)) { const w = (plain.match(/[a-z']+/g) || []); if (w.filter(x => EN.has(x)).length >= 2) nEN.push(f + ": " + t.slice(0, 60)); }
}
ok(nVN.length === 0, "soal+SSW+data: tidak ada huruf khas Vietnam" + (nVN.length ? " (" + nVN.slice(0, 3).join(" | ") + ")" : ""));
ok(nTok.length === 0, "kosakata Vietnam tanpa tanda (thay, nhau, ...) tidak ada" + (nTok.length ? " (" + nTok.slice(0, 3).join(" | ") + ")" : ""));
ok(nEN.length === 0, "arti kanji/kosakata tidak berisi kalimat Inggris" + (nEN.length ? " (" + nEN.slice(0, 3).join(" | ") + ")" : ""));
import { spawnSync } from "node:child_process";
{ const r = spawnSync("python3", ["-I", "tools/check_english.py"], { encoding: "utf8" });
  if (r.error || /ModuleNotFoundError/.test(r.stderr || "")) console.log("  (lewati cek Inggris: butuh python3 + wordfreq)");
  else ok(r.status === 0, "arti kanji/kosakata tidak berbahasa Inggris" + (r.status ? " (" + r.stdout.split("\n").slice(1, 4).join(" | ") + ")" : "")); }
console.log("\nRINGKAS:\n" + summary.join("\n"));
console.log(fail ? `${fail} tes GAGAL` : "SEMUA TES LULUS"); process.exit(fail ? 1 : 0);
