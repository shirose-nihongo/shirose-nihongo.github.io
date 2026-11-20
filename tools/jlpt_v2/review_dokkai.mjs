// Lembar tinjauan Dokkai v2 per level: node tools/jlpt_v2/review_dokkai.mjs n5
import fs from "node:fs";
const lv = process.argv[2];
const strip = (s) => String(s ?? "").replace(/<br>/g, "  \n> ").replace(/<\/?u>/g, "＿").replace(/<tr>/g, "  \n> ").replace(/<\/t[hd]>/g, " ｜ ").replace(/<[^>]+>/g, "");
const files = fs.readdirSync(`jlpt/${lv}`).filter((f) => /^full-\d+\.v2\.json$/.test(f)).sort();
const L = [`# Tinjauan Dokkai ${lv.toUpperCase()} — versi 2`, "", `${files.length} paket. Hanya bagian 読解 yang diganti; bagian lain sama dengan file lama. ✓ = kunci.`, ""];
for (const f of files) {
  const d = JSON.parse(fs.readFileSync(`jlpt/${lv}/${f}`, "utf8"));
  const s = d.sections.find((x) => x.cat === "dokkai");
  L.push(`## Paket ${f.match(/\d+/)[0]} (${s.items.length} soal)`, "");
  const done = new Set();
  for (const it of s.items) {
    if (!done.has(it.pid)) {
      done.add(it.pid);
      const p = d.passages[it.pid];
      L.push(`> **${p.jenis}**  \n> ${strip(p.jp)}`, "", `<sub>${p.id}</sub>`, "");
    }
    L.push(`**${it.no}. ${strip(it.q)}**`, "", ...it.opts.map((o, k) => `- ${k === it.ans ? "✓" : "　"} ${"ABCD"[k]}. ${strip(o)}`), "",
      `*Alasan:* ${it.ex.alasan} — *bukti:* 「${it.ex.bukti}」`, "", ...it.ex.opsi.map((x) => `  - ${strip(x)}`), "");
  }
  L.push("---", "");
}
const out = `docs/jlpt-audit/dokkai-${lv}-v2.md`;
fs.writeFileSync(out, L.join("\n"));
console.log(out, L.length, "baris");
