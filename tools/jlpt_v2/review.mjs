// Lembar tinjauan paket v2 (Markdown): node tools/jlpt_v2/review.mjs n3 11
import fs from "node:fs";
const [lv, nn] = [process.argv[2], process.argv[3].padStart(2, "0")];
const rd = (f) => JSON.parse(fs.readFileSync(`jlpt/${lv}/${f}`, "utf8"));
const oldP = rd(`full-${nn}.json`), neu = rd(`full-${nn}.v2.json`);
const strip = (s) => String(s ?? "").replace(/<br>/g, " / ").replace(/<\/?u>/g, "＿").replace(/<[^>]+>/g, "");
const flat = (p) => p.sections.flatMap((s) => s.items.map((i) => ({ ...i, sec: s })));
const O = flat(oldP);
const L = [`# Tinjauan ${lv.toUpperCase()} Full Exam ${nn} — versi 2`, "",
  `File baru: \`jlpt/${lv}/full-${nn}.v2.json\` (belum live). File lama \`full-${nn}.json\` tidak diubah.`, "",
  "Setiap soal: **v2** (✓ = kunci) lalu versi lama sebagai pembanding. Beri catatan langsung di bawah soal bila perlu diubah.", ""];
const passDone = new Set();
let lastSec = null;
flat(neu).forEach((it, i) => {
  if (it.sec !== lastSec) { lastSec = it.sec; L.push(`## 問題${it.sec.mondai} ${it.sec.tipe_jp} — ${it.sec.judul}`, ""); }
  if (it.pid && !passDone.has(it.pid)) { passDone.add(it.pid); const p = neu.passages[it.pid]; L.push(`> **Bacaan ${it.pid}** (${p.jenis})`, ">", `> ${strip(p.jp).replace(/\n/g, " ")}`, ""); }
  L.push(`### ${it.no}. ${strip(it.q)}`);
  if (it.ck) {
    L.push("", "<details><summary>Transkrip audio</summary>", "", ...(it.ck.script || []).map((x) => `- ${x.s}: ${x.t}`), "", "</details>");
  }
  L.push("", ...it.opts.map((o, k) => `${k === it.ans ? "✓" : "　"} ${"ABCD"[k]}. ${strip(o)}`.replace(/^/, "- ")), "");
  L.push(`*Alasan:* ${strip(it.ex.alasan)}`, "", ...(it.ex.opsi || []).map((x) => `  - ${strip(x)}`), "");
  const o = O[i];
  if (o) L.push(`<sub>Lama: ${strip(o.q)} — ${o.opts.map((x, k) => (k === o.ans ? "✓" : "") + strip(x)).join(" / ")}${o.ck ? " · dialog: " + o.ck.dialog.map((d) => d.t).join(" ") : ""}</sub>`, "", "---", "");
});
const out = `docs/jlpt-audit/pilot-${lv}-full-${nn}-v2.md`;
fs.writeFileSync(out, L.join("\n"));
console.log(out, L.length, "baris");
