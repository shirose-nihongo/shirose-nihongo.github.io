// Tambah teks ke akhir bacaan pada sumber dokkai:
//   node tools/jlpt_v2/append_passage.cjs <file.py> <tambahan.json>
// tambahan.json: [[paket, pid, "teks jepang", "terjemahan"], ...]  — teks Jepang ditambahkan setelah "<br>",
// terjemahan ditambahkan di akhir terjemahan bacaan.
const fs = require("fs");
const [file, addf] = process.argv.slice(2);
let t = fs.readFileSync(file, "utf8");
for (const [k, pid, jp, tr] of JSON.parse(fs.readFileSync(addf, "utf8"))) {
  const key = "\n" + k + ": dict(passages={";
  const at = t.indexOf(key);
  if (at < 0) throw new Error("paket tidak ditemukan: " + k);
  const s = t.indexOf('"' + pid + '": (', at);
  if (s < 0) throw new Error(`bacaan ${pid} tidak ditemukan di paket ${k}`);
  const q1 = t.indexOf('"', t.indexOf(",", s) + 1) + 1; // awal teks Jepang
  const jpEnd = t.indexOf('",\n', q1);
  const trStart = t.indexOf('"', jpEnd + 3) + 1;
  const trEnd = t.indexOf('"),', trStart);
  t = t.slice(0, jpEnd) + "<br>" + jp + t.slice(jpEnd, trEnd) + " " + tr + t.slice(trEnd);
}
fs.writeFileSync(file, t);
