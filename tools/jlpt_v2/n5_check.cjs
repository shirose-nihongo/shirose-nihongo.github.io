// Cek kanji di luar N5 pada Dokkai v2 N5: node tools/jlpt_v2/n5_check.cjs
const fs = require("fs");
const N5 = "曜何今午前後半毎週間時分円年月日火水木金土一二三四五六七八九十百千万人子女男父母友先生学校本中外上下右左東西南北山川天気雨花電車駅道店会社名国語書読見聞言話食飲行来帰入出立休買大小高安長新古白多少耳口手足目空田";
const cnt = {};
for (const f of fs.readdirSync("jlpt/n5").filter((x) => /^full-\d+\.v2\.json$/.test(x))) {
  const d = JSON.parse(fs.readFileSync("jlpt/n5/" + f, "utf8"));
  const s = d.sections.find((s) => s.cat === "dokkai");
  const txt = s.items.map((i) => i.q + i.opts.join("") + d.passages[i.pid].jp).join("").replace(/<[^>]+>/g, "");
  for (const c of txt) if (/[\u4e00-\u9fff]/.test(c) && !N5.includes(c)) (cnt[c] ??= new Set()).add(f);
}
console.log(Object.keys(cnt).length ? Object.entries(cnt).map(([c, s]) => c + ":" + [...s].join("/")).join("  ") : "OK: semua kanji Dokkai N5 v2 ada di daftar N5");
