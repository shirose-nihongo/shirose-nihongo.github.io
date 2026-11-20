// Bangun Latihan Dokkai 1–20 per level (N5–N2) dengan MENGKLON semua soal Dokkai dari Full Exam (versi v2),
// diacak per bacaan (satu bacaan + soal-soalnya selalu satu paket). Tidak ada soal baru.
//   node tools/jlpt_v2/build_dokkai_packs.mjs            → ringkasan saja (dry-run)
//   node tools/jlpt_v2/build_dokkai_packs.mjs --write    → tulis jlpt/<lv>/dokkai-NN.v2.json
//   node tools/jlpt_v2/build_dokkai_packs.mjs --apply    → (+write) cadangkan index.json lalu daftarkan 20 paket per level
//   node tools/jlpt_v2/build_dokkai_packs.mjs --rollback → pulihkan index.json dari cadangan terakhir
// File dokkai-01.json lama TIDAK dihapus (riwayat siswa menyimpan nama file); index diarahkan ke dokkai-01.v2.json.
import fs from "fs";
import path from "path";
const ROOT = process.cwd();
const A = new Set(process.argv.slice(2));
const R = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));
const BK = path.join(ROOT, "backup");
if (A.has("--rollback")) {
  const d = fs.readdirSync(BK).filter((x) => x.startsWith("jlpt-dokkai-packs-")).sort().pop();
  fs.copyFileSync(path.join(BK, d, "index.json"), path.join(ROOT, "jlpt", "index.json"));
  console.log("index.json dipulihkan dari", d); process.exit(0);
}
const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const shuffle = (a, r) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const rank = (j) => (/情報/.test(j) ? 4 : /統合|主張|長文/.test(j) ? 3 : /中文/.test(j) ? 2 : 1);
const SEED = { n5: 5005, n4: 4004, n3: 3003, n2: 2002, n1: 1001 };
// Jumlah paket Latihan Dokkai = jumlah paket Full Exam (N1 punya 30). N1: Full Exam asli (tidak diubah) dipakai apa adanya.
const CFG = { n5: { n: 20, ext: ".v2.json" }, n4: { n: 20, ext: ".v2.json" }, n3: { n: 20, ext: ".v2.json" }, n2: { n: 20, ext: ".v2.json" }, n1: { n: 30, ext: ".json" } };
const ONLY = (process.argv.find((a) => a.startsWith("--levels=")) || "").slice(9).split(",").filter(Boolean);
const LEVELS = Object.keys(CFG).filter((lv) => (ONLY.length ? ONLY.includes(lv) : lv !== "n1"));
const result = {};
for (const lv of LEVELS) {
  const N = CFG[lv].n; const groups = [];
  for (let p = 1; p <= N; p++) {
    const nn = String(p).padStart(2, "0"), f = `jlpt/${lv}/full-${nn}${CFG[lv].ext}`;
    if (!fs.existsSync(path.join(ROOT, f))) throw new Error("tidak ada " + f);
    const j = R(f); const by = new Map();
    for (const s of j.sections) if (s.cat === "dokkai") for (const it of s.items) { if (!by.has(it.pid)) by.set(it.pid, []); by.get(it.pid).push(it); }
    for (const [pid, its] of by) groups.push({ from: `${lv}-full-${nn}`, passage: j.passages[pid], items: its });
  }
  const total = groups.reduce((s, g) => s + g.items.length, 0);
  if (total % N) throw new Error(`${lv}: ${total} soal tidak habis dibagi ${N}`);
  const size = total / N;
  let bins = null;
  for (let attempt = 0; attempt < 5000 && !bins; attempt++) {
    const r = rng(SEED[lv] + attempt);
    const gs = shuffle([...groups], r).sort((a, b) => b.items.length - a.items.length || 0);
    // acak urutan di dalam ukuran yang sama sudah dari shuffle; sort stabil mempertahankannya
    const B = Array.from({ length: N }, () => ({ left: size, g: [] }));
    let ok = true;
    for (const g of gs) {
      const c = B.filter((b) => b.left >= g.items.length);
      if (!c.length) { ok = false; break; }
      const maxLeft = Math.max(...c.map((b) => b.left)); const top = c.filter((b) => b.left === maxLeft);
      const b = top[Math.floor(r() * top.length)]; b.g.push(g); b.left -= g.items.length;
    }
    if (ok && B.every((b) => b.left === 0)) bins = B.map((b) => shuffle(b.g, r).sort((x, y) => rank(x.passage.jenis) - rank(y.passage.jenis)));
  }
  if (!bins) throw new Error(lv + ": gagal membagi paket");
  shuffle(bins, rng(SEED[lv] + 99999));
  const old = R(`jlpt/${lv}/dokkai-01.json`);
  const packs = bins.map((gs, idx) => {
    const nn = String(idx + 1).padStart(2, "0"), passages = {}, items = [];
    gs.forEach((g, gi) => {
      const pid = "d" + (gi + 1); passages[pid] = JSON.parse(JSON.stringify(g.passage));
      for (const it of g.items) { const c = JSON.parse(JSON.stringify(it)); c.pid = pid; c.id = `${lv}-dokkai-${nn}-q${String(items.length + 1).padStart(2, "0")}`; c.no = items.length + 1; items.push(c); }
    });
    const sec = { ...old.sections[0], items };
    const durasi = Math.max(10, Math.round((old.durasi / old.jumlah) * items.length / 5) * 5);
    return { id: `${lv}-dokkai-${nn}`, lv, jenis: "dokkai", judul: `Dokkai Practice ${nn}`, durasi, sections: [sec], passages, jumlah: items.length, versi: 2, _from: gs.map((g) => g.from) };
  });
  result[lv] = { packs, size, total, groups: groups.length };
  console.log(`${lv}: ${groups.length} bacaan, ${total} soal → ${N} paket × ${size} soal`);
}
if (A.has("--write") || A.has("--apply")) {
  for (const [lv, r] of Object.entries(result)) for (const p of r.packs) {
    const { _from, ...out } = p; const nn = p.id.split("-").pop();
    fs.writeFileSync(path.join(ROOT, "jlpt", lv, `dokkai-${nn}.v2.json`), JSON.stringify(out));
  }
  console.log("paket ditulis.");
}
if (A.has("--apply")) {
  const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 12), dir = path.join(BK, "jlpt-dokkai-packs-" + stamp);
  fs.mkdirSync(dir, { recursive: true }); fs.copyFileSync(path.join(ROOT, "jlpt", "index.json"), path.join(dir, "index.json"));
  const idx = R("jlpt/index.json");
  const sumOld = Object.values(idx.level).flatMap((l) => Object.values(l)).filter(Array.isArray).flat().reduce((s, m) => s + (m.jumlah || 0), 0);
  for (const [lv, r] of Object.entries(result)) {
    const oldList = idx.level[lv].dokkai || [];
    idx.level[lv].dokkai = r.packs.map((p) => { const nn = p.id.split("-").pop(); return { id: p.id, file: `${lv}/dokkai-${nn}.v2.json`, judul: p.judul, jumlah: p.jumlah, durasi: p.durasi, mondai: [`読解 (${p.jumlah})`] }; });
    fs.writeFileSync(path.join(dir, `asal-${lv}.txt`), oldList.map((m) => m.file).join("\n"));
  }
  const sumNew = Object.values(idx.level).flatMap((l) => Object.values(l)).filter(Array.isArray).flat().reduce((s, m) => s + (m.jumlah || 0), 0);
  if (typeof idx.total_soal === "number") idx.total_soal += sumNew - sumOld;
  fs.writeFileSync(path.join(ROOT, "jlpt", "index.json"), JSON.stringify(idx));
  fs.writeFileSync(path.join(dir, "MANIFEST.txt"), `Cadangan sebelum Latihan Dokkai 1-20 (klon dari Full Exam)\nRollback: node tools/jlpt_v2/build_dokkai_packs.mjs --rollback\nTotal soal index: ${sumOld} -> ${sumNew}\n`);
  console.log(`index diperbarui. total soal ${sumOld} -> ${sumNew}. Cadangan: backup/${path.basename(dir)}`);
}
fs.writeFileSync(path.join(process.env.TEMP || ".", "dokkai_packs_from.json"), JSON.stringify(Object.fromEntries(Object.entries(result).map(([lv, r]) => [lv, r.packs.map((p) => p._from)]))));
