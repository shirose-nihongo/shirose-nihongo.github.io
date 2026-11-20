// Bandingkan Dokkai lama (full-NN.json) vs revisi (full-NN.v2.json) dan terhadap angka soal JLPT asli.
//   node tools/jlpt_v2/compare_dokkai.mjs   → docs/jlpt-audit/PERBANDINGAN-DOKKAI.md
// Angka "asli" diambil dari benchmark.json (agregat) + median per jenis dari analisis ekspor soal asli (hanya angka, bukan teks).
import fs from "fs";
const rd = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const norm = (s) => (s || "").replace(/<[^>]+>/g, "").replace(/[\s　、。，．・「」『』（）()！？!?]/g, "");
const med = (a) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const REAL = { // median karakter bacaan, per jenis (sumber: ekspor soal asli, lihat LAPORAN-AWAL §Dokkai & catatan proyek)
  n5: { 短文: 85, 中文: 235 },
  n4: { 中文: 450 },
  n3: { 短文: 207, 中文: 422, 長文: 544, 情報: 540 },
  n2: { 短文: 230, 中文: 630, 統合: 542, 主張: 850, 情報: 610 },
};
const bench = rd("docs/jlpt-audit/benchmark.json").levels;
const jenisOf = (j) => /統合/.test(j) ? "統合" : /主張/.test(j) ? "主張" : /長文/.test(j) ? "長文" : /情報/.test(j) ? "情報" : /中文/.test(j) ? "中文" : "短文";
const dok = (j) => (j.sections || []).flatMap((s) => s.items || []).filter((i) => i.cat === "dokkai");
const flags = fs.readFileSync("docs/jlpt-audit/flags.csv", "utf8").split("\n").map((l) => l.split(","));
const flagN = (lv, file, code) => flags.filter((c) => c[0] === lv && c[1] === file && c[3] === "dokkai" && c[5] === code).length;
function stat(j) {
  const items = dok(j), pids = [...new Set(items.map((i) => i.pid))];
  const lens = pids.map((p) => norm(j.passages[p]?.jp).length);
  const by = {};
  for (const p of pids) { const k = jenisOf(j.passages[p].jenis || ""); (by[k] ||= []).push(norm(j.passages[p].jp).length); }
  const pos = [0, 0, 0, 0]; items.forEach((i) => pos[i.ans]++);
  const longest = items.filter((i) => { const L = i.opts.map((o) => norm(o).length); return L[i.ans] >= 8 && L[i.ans] > Math.max(...L.filter((_, k) => k !== i.ans)) * 1.35; }).length;
  const qchars = items.map((i) => norm(i.q).length), expl = items.filter((i) => (i.ex?.opsi || []).every((o) => (o.alasan || o).toString().length > 14)).length;
  return { n: items.length, np: pids.length, medLen: med(lens), by, spp: +(items.length / pids.length).toFixed(1), pos, longest, qmed: med(qchars), items, pids };
}
let md = `# Perbandingan Dokkai: lama vs revisi vs soal JLPT asli\n\nDibuat otomatis oleh \`tools/jlpt_v2/compare_dokkai.mjs\`. Panjang = karakter tanpa spasi/tanda baca/HTML.\n\n` +
`**Catatan metode.** Soal revisi ditulis orisinal (bukan salinan soal asli), jadi yang bisa dibandingkan adalah *struktur dan statistik*: tata letak, jumlah soal per bacaan, panjang bacaan, jenis pertanyaan, pola kunci. Pembanding isi 1:1 dengan satu soal asli tidak ada dan memang tidak dimaksudkan.\n\n`;
const out = {};
for (const lv of ["n5", "n4", "n3", "n2"]) {
  const rows = []; const agg = { old: [], nw: [] };
  for (let p = 1; p <= 20; p++) {
    const nn = String(p).padStart(2, "0"), f = `jlpt/${lv}/full-${nn}.json`, f2 = `jlpt/${lv}/full-${nn}.v2.json`;
    if (!fs.existsSync(f2)) continue;
    const A = rd(f), B = rd(f2); if (JSON.stringify(dok(A).map((i) => i.id)) !== JSON.stringify(dok(B).map((i) => i.id))) throw new Error("ID beda " + lv + nn);
    const a = stat(A), b = stat(B), pilot = lv === "n3" && p === 11;
    rows.push({ nn, a, b, pilot, fl: { pendekA: flagN(lv, `full-${nn}.json`, "BACAAN_PENDEK"), panjA: flagN(lv, `full-${nn}.json`, "JAWABAN_TERPANJANG") } });
    agg.old.push(a); agg.nw.push(b);
  }
  const R = REAL[lv], ref = bench[lv].ref;
  const sum = (arr, f) => arr.reduce((s, x) => s + f(x), 0);
  const allBy = (arr) => { const o = {}; for (const s of arr) for (const [k, v] of Object.entries(s.by)) (o[k] ||= []).push(...v); return o; };
  const oBy = allBy(agg.old), nBy = allBy(agg.nw);
  md += `## ${lv.toUpperCase()} — ${rows.length} paket\n\n### Ringkasan level\n\n| Ukuran | Lama | Revisi | JLPT asli |\n|---|---|---|---|\n`;
  md += `| Soal Dokkai per paket | ${agg.old[0].n} | ${agg.nw[0].n} | (tetap, sesuai desain paket) |\n`;
  md += `| Bacaan per paket (rata-rata) | ${(sum(agg.old, (s) => s.np) / rows.length).toFixed(1)} | ${(sum(agg.nw, (s) => s.np) / rows.length).toFixed(1)} | — |\n`;
  md += `| Soal per bacaan | ${(sum(agg.old, (s) => s.n) / sum(agg.old, (s) => s.np)).toFixed(1)} | ${(sum(agg.nw, (s) => s.n) / sum(agg.nw, (s) => s.np)).toFixed(1)} | median ${ref.dokkaiSoalPerBacaan.med} (rata-rata ${ref.dokkaiSoalPerBacaan.mean}) |\n`;
  md += `| Median panjang semua bacaan | ${med(Object.values(oBy).flat())} | ${med(Object.values(nBy).flat())} | ${ref.dokkaiChars.med} (p25 ${ref.dokkaiChars.p25}, p75 ${ref.dokkaiChars.p75}) |\n`;
  for (const [k, v] of Object.entries(R)) md += `| Median ${k} | ${oBy[k] ? med(oBy[k]) : "—"} | ${nBy[k] ? med(nBy[k]) : "—"} | ${v} |\n`;
  md += `| Bacaan ditandai "terlalu pendek" (paket) | ${sum(rows, (r) => r.fl.pendekA)} soal | 0 | — |\n| Soal dgn kunci paling panjang | ${sum(rows, (r) => r.fl.panjA)} | ${sum(agg.nw, (s) => s.longest)} | tidak ada pola ini |\n`;
  const P = agg.nw.reduce((t, s) => t.map((x, i) => x + s.pos[i]), [0, 0, 0, 0]); const PO = agg.old.reduce((t, s) => t.map((x, i) => x + s.pos[i]), [0, 0, 0, 0]);
  md += `| Sebaran kunci A/B/C/D | ${PO.join("/")} | ${P.join("/")} | acak merata |\n\n`;
  md += `### Per paket (karakter median bacaan; soal/bacaan)\n\n| Paket | Bacaan lama | Bacaan baru | Panjang lama → baru | Soal/bacaan lama → baru | Kunci terpanjang lama → baru |\n|---|---|---|---|---|---|\n`;
  for (const r of rows) md += `| ${r.nn}${r.pilot ? " (pilot, belum tayang)" : ""} | ${r.a.np} | ${r.b.np} | ${r.a.medLen} → ${r.b.medLen} | ${r.a.spp} → ${r.b.spp} | ${r.fl.panjA} → ${r.b.longest} |\n`;
  md += `\n`;
  out[lv] = rows;
}
// contoh sebelum/sesudah: bacaan pertama paket 05 tiap level
md += `## Contoh sebelum → sesudah (paket 05, soal Dokkai pertama)\n\n`;
for (const lv of ["n5", "n4", "n3", "n2"]) {
  const A = dok(rd(`jlpt/${lv}/full-05.json`))[0], B = dok(rd(`jlpt/${lv}/full-05.v2.json`))[0];
  const pa = rd(`jlpt/${lv}/full-05.json`).passages[A.pid], pb = rd(`jlpt/${lv}/full-05.v2.json`).passages[B.pid];
  const cl = (s) => s.replace(/<br>/g, " ⏎ ").replace(/<[^>]+>/g, "");
  md += `### ${lv.toUpperCase()}\n\n**Lama** (${A.id}, ${norm(pa.jp).length} karakter): ${cl(pa.jp)}\n\n- ${cl(A.q)}\n${A.opts.map((o, k) => `  - ${k === A.ans ? "✓" : "·"} ${o}`).join("\n")}\n\n**Revisi** (${B.id}, ${norm(pb.jp).length} karakter): ${cl(pb.jp)}\n\n- ${cl(B.q)}\n${B.opts.map((o, k) => `  - ${k === B.ans ? "✓" : "·"} ${o}`).join("\n")}\n\n`;
}
fs.writeFileSync("docs/jlpt-audit/PERBANDINGAN-DOKKAI.md", md);
console.log("ok", md.length);
