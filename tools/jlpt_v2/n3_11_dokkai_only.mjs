// N3 paket 11: v2 hanya untuk Dokkai. Soal non-Dokkai (termasuk Choukai + audio lama) diambil dari full-11.json,
// bacaan Dokkai dari pilot (full-11.pilot-dokkai.json), lalu diperpanjang sesuai median soal asli N3.
//   node tools/jlpt_v2/n3_11_dokkai_only.mjs   → jlpt/n3/full-11.v2.json
import fs from "fs";
const R = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const old = R("jlpt/n3/full-11.json");
const pilot = R("tools/jlpt_v2/src/n3_11_pilot_dokkai.json");           // {passages:{p1..p7}, items:[13 soal]}
const ADD = R("tools/jlpt_v2/src/n3_11_dokkai_additions.json");         // [[pid, mode, jp, tr]]
// pemetaan p1..p7 → d1..d7 (sama dengan paket lain)
const map = (k) => "d" + k.slice(1);
const passages = {};
for (const [k, v] of Object.entries(pilot.passages)) passages[map(k)] = { ...v };
for (const [pid, mode, jp, tr] of ADD) {
  const P = passages[pid]; let J = P.jp, T = P.id || "";
  if (mode === "end") { J += "<br>" + jp; T += " " + tr; }
  else if (mode === "pre") {
    const i = J.lastIndexOf("。", J.length - 2) + 1; J = J.slice(0, i) + jp + J.slice(i);
    const ti = Math.max(T.lastIndexOf(". ", T.length - 2), T.lastIndexOf("; ", T.length - 2));
    T = ti < 0 ? T + " " + tr : T.slice(0, ti + 2) + tr + " " + T.slice(ti + 2);
  } else if (mode === "para") {
    const i = J.lastIndexOf("<br>"); J = J.slice(0, i) + jp + J.slice(i);
    const want = (i / J.length) * T.length; let best = -1;
    for (let p = T.indexOf(". "); p >= 0; p = T.indexOf(". ", p + 1)) if (best < 0 || Math.abs(p - want) < Math.abs(best - want)) best = p;
    T = best < 0 ? T + " " + tr : T.slice(0, best + 2) + tr + " " + T.slice(best + 2);
  } else throw new Error(mode);
  P.jp = J; P.id = T;
}
const out = JSON.parse(JSON.stringify(old));
const usedByOthers = new Set();
for (const s of out.sections) if (s.cat !== "dokkai") for (const it of s.items) if (it.pid) usedByOthers.add(it.pid);
out.passages = {};
for (const [k, v] of Object.entries(old.passages || {})) if (usedByOthers.has(k)) out.passages[k] = v;
Object.assign(out.passages, passages);
const sec = out.sections.find((s) => s.cat === "dokkai");
if (sec.items.length !== pilot.items.length) throw new Error("jumlah soal dokkai beda");
sec.items = sec.items.map((o, i) => {
  const n = JSON.parse(JSON.stringify(pilot.items[i]));
  if (n.id !== o.id) throw new Error("ID beda " + o.id);
  n.pid = map(n.pid); n.no = o.no; return n;
});
out.versi = 2;
fs.writeFileSync("jlpt/n3/full-11.v2.json", JSON.stringify(out));
console.log("ok", Object.keys(out.passages).join(","));
