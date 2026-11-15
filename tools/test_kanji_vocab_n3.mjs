// Tes khusus: kosakata berbasis Kanji N3. Jalankan: node tools/test_kanji_vocab_n3.mjs
import fs from "node:fs";
import { buildKanjiVocab, kanjiVocabCards, makeChoices, isKanjiChar, cleanKata } from "../js/kanji-vocab.js";
const J = (p) => JSON.parse(fs.readFileSync(new URL("../" + p, import.meta.url), "utf8"));
const K = J("data/kanji-n3.json"), V = J("data/kosakata-n3.json");
const idx = buildKanjiVocab(K, V), cards = kanjiVocabCards(idx);
let fail = 0; const ok = (c, m) => { if (!c) { fail++; console.log("GAGAL:", m); } else console.log("ok   :", m); };

ok(K.length === 367, `Kanji utama N3 = ${K.length}`);
ok(idx.perKanji.length === K.length, "setiap Kanji utama punya daftar kosakata (terindeks)");
const noVocab = K.filter((k, i) => !idx.perKanji[i].length);
ok(noVocab.length === 0, `setiap Kanji utama punya minimal 1 kosakata (tanpa: ${noVocab.map(k => k.k)})`);
const kk = (k) => K.find(x => x.k === k);
ok(idx.byKata.has("昔") && idx.byKata.get("昔").kana === "むかし", "昔 (むかし) jadi kartu karena berdiri sendiri sebagai kata");
ok(idx.byKata.has("王様") && idx.byKata.get("王様").kana === "おうさま" && idx.byKata.get("王様").kanji.includes("王"), "王様 (おうさま) jadi kartu untuk Kanji 王");
// 1. Kanji satuan tidak pernah jadi kartu
const mains = new Set(K.map(k => k.k));
ok(cards.every(c => c.tipe === "kosakata"), "semua kartu bertipe kosakata (tidak ada tipe kanji)");
// Kanji satuan hanya boleh jadi kartu bila database mencantumkannya sebagai kata di `c` miliknya sendiri (kata utuh, bukan karakter)
const explicitSelf = new Set(K.flatMap(k => (k.c || []).map(c => cleanKata(c.k)).filter(x => x === k.k)));
const singles = cards.filter(c => mains.has(c.front));
ok(singles.every(c => explicitSelf.has(c.front) && c.reading && c.back), `kartu satu-Kanji (${singles.length}) semuanya kata eksplisit di database dengan bacaan+arti`);
const unlisted = K.filter(k => !explicitSelf.has(k.k));
ok(unlisted.length > 300 && unlisted.every(k => !cards.some(c => c.front === k.k && !K.some(o => o.k !== k.k && (o.c || []).some(x => cleanKata(x.k) === k.k)))), `Kanji yang tidak tercantum sebagai kata (${unlisted.length}, mis. 政 駐) TIDAK pernah jadi kartu`);
ok(cards.every(c => Array.from(c.front).some(isKanjiChar)), "semua kartu mengandung kanji");
// 2. Tanpa duplikat
const keys = cards.map(c => c.skey);
ok(new Set(keys).size === keys.length, `kunci kartu unik (${keys.length} kartu)`);
const fronts = cards.map(c => c.front);
ok(new Set(fronts).size === fronts.length, "tidak ada kosakata ganda (satu kata = satu kartu)");
// 3. Kata dengan >1 Kanji utama: satu identitas
const shared = idx.vocab.filter(v => v.kanji.length > 1);
ok(shared.length > 0 && shared.every(v => cards.filter(c => c.front === v.kata).length === 1), `kata multi-Kanji (${shared.length}) tetap 1 kartu`);
const appears = (v) => idx.perKanji.filter(l => l.includes(v)).length;
ok(shared.every(v => appears(v) === v.kanji.length), "kata multi-Kanji muncul di daftar setiap Kanji utamanya");
// 4. Identitas lama dipakai ulang (progres lama aman)
const linked = idx.vocab.filter(v => v.kosNo != null);
ok(linked.length > 0 && linked.every(v => v.key === "k:" + v.kosNo), `kosakata yang sudah ada di kosakata-n3 memakai kunci lama k:<no> (${linked.length})`);
const byNo = new Map(V.map(x => [x.no, x]));
ok(linked.every(v => cleanKata(byNo.get(v.kosNo).kata) === v.kata), "nomor tautan menunjuk kosakata yang benar (cocok berdasarkan field no)");
ok(idx.vocab.filter(v => v.kosNo == null).every(v => v.key === "kv:" + v.kata), "kosakata baru memakai kunci kv:<kata>");
ok(!keys.some(k => /^k:/.test(k) && !linked.find(v => v.key === k)), "tidak ada kunci k:<no> palsu");
// 5. Data lengkap: baca & arti
ok(cards.every(c => c.reading), "semua kartu punya cara baca");
ok(cards.filter(c => !c.back).length === 0, "semua kartu punya arti");
// 6. Data goresan tersedia untuk setiap karakter kanji
const strokeCh = new Set();
for (const f of fs.readdirSync(new URL("../data/kanji-strokes/", import.meta.url))) { if (f.startsWith("_")) continue; for (const ch of Object.keys(J("data/kanji-strokes/" + f))) strokeCh.add(ch); }
const missing = new Set(); idx.vocab.forEach(v => v.chars.forEach(ch => { if (!strokeCh.has(ch)) missing.add(ch); }));
console.log("info : karakter tanpa data goresan lokal (jatuh ke KanjiVG CDN):", missing.size, [...missing].slice(0, 20).join(""));
// 7. Pilihan latihan
const v0 = idx.vocab[0]; const ch = makeChoices(idx, v0, "kana"); ok(ch.length === 4 && ch.includes(v0.kana) && new Set(ch).size === 4, "pilihan membaca: 4 opsi unik berisi jawaban benar");
const ch2 = makeChoices(idx, v0, "arti"); ok(ch2.length === 4 && ch2.includes(v0.arti), "pilihan arti: 4 opsi berisi jawaban benar");
console.log(`\nRINGKAS: Kanji utama ${K.length} | kosakata unik ${idx.vocab.length} | tertaut kosakata-n3 ${linked.length} | baru ${idx.vocab.length - linked.length} | kata multi-Kanji ${shared.length}`);
console.log(fail ? `${fail} tes GAGAL` : "SEMUA TES LULUS"); process.exit(fail ? 1 : 0);
