// Sisipkan teks ke bacaan dokkai di sumber .py, tanpa menempel setelah kalimat penutup.
//   node tools/jlpt_v2/insert_passage.cjs <file.py> <tambahan.json>
// tambahan.json: [[paket, pid, mode, "teks jepang", "terjemahan"], ...]
//   mode "pre" : sisip sebelum kalimat terakhir bacaan (dan sebelum kalimat terakhir terjemahan)
//   mode "A"   : (統合) sisip sebelum kalimat terakhir bagian A (terjemahan: sebelum " B: ")
//   mode "end" : tambah paragraf baru di akhir
const fs = require("fs");
const [file, addf] = process.argv.slice(2);
let t = fs.readFileSync(file, "utf8");
let n = 0;
for (const [k, pid, mode, jp, tr] of JSON.parse(fs.readFileSync(addf, "utf8"))) {
  const at = t.indexOf("\n" + k + ": dict(passages={");
  if (at < 0) throw new Error("paket tidak ditemukan: " + k);
  const s = t.indexOf('"' + pid + '": (', at);
  if (s < 0) throw new Error(`bacaan ${pid} tidak ditemukan di paket ${k}`);
  const q1 = t.indexOf('"', t.indexOf(",", s) + 1) + 1;
  const jpEnd = t.indexOf('",\n', q1);
  const trStart = t.indexOf('"', jpEnd + 3) + 1;
  const trEnd = t.indexOf('"),', trStart);
  let J = t.slice(q1, jpEnd), T = t.slice(trStart, trEnd);
  if (mode === "end") { J += "<br>" + jp; T += " " + tr; }
  else if (mode === "pre") {
    const i = J.lastIndexOf("。", J.length - 2) + 1;
    if (i <= 0) throw new Error(`tak ada kalimat: ${k} ${pid}`);
    J = J.slice(0, i) + jp + J.slice(i);
    const ti = Math.max(T.lastIndexOf(". ", T.length - 2), T.lastIndexOf("; ", T.length - 2));
    T = ti < 0 ? T + " " + tr : T.slice(0, ti + 2) + tr + " " + T.slice(ti + 2);
  } else if (mode === "para") {
    // akhir paragraf sebelum paragraf terakhir; terjemahan: batas kalimat terdekat pada posisi relatif yang sama
    const i = J.lastIndexOf("<br>");
    if (i <= 0) throw new Error(`tak ada paragraf: ${k} ${pid}`);
    const want = (i / J.length) * T.length;
    let best = -1;
    for (let p = T.indexOf(". "); p >= 0; p = T.indexOf(". ", p + 1)) if (best < 0 || Math.abs(p - want) < Math.abs(best - want)) best = p;
    J = J.slice(0, i) + jp + J.slice(i);
    T = best < 0 ? T + " " + tr : T.slice(0, best + 2) + tr + " " + T.slice(best + 2);
  } else if (mode === "A") {
    const b = J.indexOf("<br><br><b>B</b>");
    if (b < 0) throw new Error(`bukan 統合: ${k} ${pid}`);
    const i = J.lastIndexOf("。", b - 2) + 1;
    J = J.slice(0, i) + jp + J.slice(i);
    const tb = T.indexOf(" B: ");
    if (tb < 0) throw new Error(`terjemahan tanpa B: ${k} ${pid}`);
    const ti = T.lastIndexOf(". ", tb - 1);
    T = ti < 0 ? T.slice(0, tb) + " " + tr + T.slice(tb) : T.slice(0, ti + 2) + tr + " " + T.slice(ti + 2);
  } else throw new Error("mode? " + mode);
  t = t.slice(0, q1) + J + '",\n' + t.slice(jpEnd + 3, trStart) + T + t.slice(trEnd);
  n++;
}
fs.writeFileSync(file, t);
console.log(file, n, "sisipan");
