// Ganti teks pilihan (dan opsional alasannya) pada satu soal di sumber dokkai.
//   node tools/jlpt_v2/replace_opts.cjs <file.py> <edits.json>
// edits.json: [[paket, "potongan pertanyaan", "pilihan lama", "pilihan baru", "alasan lama"?, "alasan baru"?], ...]
// Pencarian dibatasi pada soal yang pertanyaannya mengandung potongan tsb di dalam blok paket itu.
const fs = require("fs");
const [file, editf] = process.argv.slice(2);
let t = fs.readFileSync(file, "utf8");
let n = 0;
for (const [k, qpart, oldO, newO, oldR, newR] of JSON.parse(fs.readFileSync(editf, "utf8"))) {
  const at = t.indexOf("\n" + k + ": dict(passages={");
  if (at < 0) throw new Error("paket " + k);
  const nextM = t.slice(at + 5).search(/\n\d+: dict\(passages=\{/);
  const end = nextM < 0 ? t.length : at + 5 + nextM;
  const found = t.indexOf(qpart, t.indexOf("items=[", at));
  if (found < 0 || found > end) throw new Error(`soal tidak ditemukan: paket ${k} ${qpart}`);
  const qi = t.lastIndexOf('("d', found);                      // awal tuple soal
  const itemEnd = t.indexOf("]),", t.indexOf("],", t.indexOf("[", qi + 4)) + 2) + 3; // akhir tuple soal
  let blk = t.slice(qi, itemEnd);
  const o1 = `"${oldO}"`;
  if (!blk.includes(o1)) throw new Error(`pilihan tidak ditemukan: paket ${k} ${oldO}`);
  blk = blk.replace(o1, `"${newO}"`);
  if (oldR) {
    if (!blk.includes(`"${oldR}"`)) throw new Error(`alasan tidak ditemukan: paket ${k} ${oldR}`);
    blk = blk.replace(`"${oldR}"`, `"${newR}"`);
  }
  t = t.slice(0, qi) + blk + t.slice(itemEnd);
  n++;
}
fs.writeFileSync(file, t);
console.log(file, n, "perubahan");
