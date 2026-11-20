// Bangun data/mensetsu/rirekisho.json dari rirekisho_src.js:  node tools/mensetsu_rirekisho/build.js tools/mensetsu_rirekisho/rirekisho_src.js data/mensetsu/rirekisho.json
const path=process.argv[2], out=process.argv[3];
const { KAT, Q } = require(path);
const { annotate } = require("./furi_extra.js");
const plain = s => s.replace(/\[[^\]]*\]/g, "");
const bad = [];
const cnt = {};
const soal = Q.map(x => {
  cnt[x.k] = (cnt[x.k] || 0) + 1;
  for (const s of [x.jf, x.ajf, ...x.f.map(f => f[0])]) {
    // setiap [..] harus tepat setelah kanji
    for (const m of s.matchAll(/(.)\[([^\]]*)\]/g)) if (!/[㐀-鿿々〆ヶ]/.test(m[1])) bad.push(s.slice(0, 30) + " :: " + m[0]);
    if (/[㐀-鿿々]\[\]/.test(s)) bad.push("empty " + s);
  }
  if (!KAT.find(c => c.k === x.k)) bad.push("cat " + x.k);
  return { i: `rirekisho-${x.k}-${String(cnt[x.k]).padStart(2, "0")}`, k: x.k, l: x.l, ja: plain(x.jf), id: x.id, v: x.v, m: x.m, aj: plain(x.ajf), ai: x.ai, c: x.c, b: "rirekisho", jf: x.jf, ajf: x.ajf,
    vf: x.v.map(([j]) => annotate(j)), mf: annotate(x.m), cf: annotate(x.c),
    ...(x.f.length ? { f: x.f.map(([jf, id]) => ({ ja: plain(jf), id, jf })) } : {}) };
});
if (bad.length) { console.error(bad.join("\n")); process.exit(1); }
const bank = { bidang: "rirekisho", nama: "Pertanyaan CV (Rirekisho)", jp: "履歴書", emoji: "📄", kategori: KAT.map(c => ({ ...c, jf: annotate(c.jp) })), soal };
require("fs").writeFileSync(out, JSON.stringify(bank));
console.log(soal.length, JSON.stringify(cnt));
