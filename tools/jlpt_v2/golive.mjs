// Go-live revisi Dokkai: arahkan jlpt/index.json ke file *.v2.json — dengan cadangan + rollback.
//   node tools/jlpt_v2/golive.mjs check             (bawaan) periksa saja, tidak mengubah apa pun
//   node tools/jlpt_v2/golive.mjs apply             cadangkan index.json, lalu arahkan ulang
//   (opsi --with-pilot: ikutkan N3-11 pilot, hanya jika audio p211 sudah dibuat)
//   node tools/jlpt_v2/golive.mjs rollback [folder] pulihkan index.json dari cadangan terbaru (atau folder tertentu)
// Hanya jlpt/index.json yang diubah. File lama (full-NN.json) TIDAK disentuh/dihapus, jadi riwayat siswa
// (yang menyimpan h.file) tetap bisa dibuka. N1 tidak pernah diproses.
import fs from "fs";
import path from "path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..", "..");
const INDEX = path.join(ROOT, "jlpt", "index.json");
const BK = path.join(ROOT, "backup");
const mode = process.argv[2] || "check";
const WITH_PILOT = process.argv.includes("--with-pilot");
const rd = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const items = (j) => (j.sections || []).flatMap((s) => s.items || []);

function plan() {
  const idx = rd(INDEX);
  const rows = [], problems = [];
  for (const lv of ["n5", "n4", "n3", "n2"]) {
    for (const m of idx.level[lv]?.full || []) {
      if (m.file.endsWith(".v2.json")) { rows.push({ lv, m, status: "sudah v2" }); continue; }
      const v2rel = m.file.replace(/\.json$/, ".v2.json");
      const v2p = path.join(ROOT, "jlpt", v2rel);
      if (!fs.existsSync(v2p)) { rows.push({ lv, m, status: "tanpa v2" }); continue; }
      const tag = `${lv} ${m.id}`;
      let ok = true;
      const bad = (t) => { ok = false; problems.push(`${tag}: ${t}`); };
      let oldJ, newJ;
      try { oldJ = rd(path.join(ROOT, "jlpt", m.file)); newJ = rd(v2p); } catch (e) { bad("JSON rusak: " + e.message); rows.push({ lv, m, v2rel, status: "GAGAL" }); continue; }
      const A = items(oldJ), B = items(newJ);
      if (A.length !== B.length) bad(`jumlah soal beda ${A.length}→${B.length}`);
      const idsA = A.map((x) => x.id).join("|"), idsB = B.map((x) => x.id).join("|");
      if (idsA !== idsB) bad("urutan/ID soal berbeda (riwayat siswa bisa bergeser)");
      if (oldJ.id !== newJ.id) bad(`id paket beda ${oldJ.id}→${newJ.id}`);
      if (m.jumlah !== B.length) bad(`jumlah di index (${m.jumlah}) ≠ isi v2 (${B.length})`);
      // soal non-dokkai harus identik (v2 hanya boleh mengubah dokkai)
      let nonDokkaiBeda = 0;
      for (let i = 0; i < Math.min(A.length, B.length); i++)
        if (A[i].cat !== "dokkai" && JSON.stringify(A[i]) !== JSON.stringify(B[i])) nonDokkaiBeda++;
      const pilot = tag.includes("n3-full-11");
      // Pilot N3-11 mengubah Choukai & butuh audio baru (audio/choukai/n3/p211) — dilewati kecuali --with-pilot dan audio ada.
      if (pilot && !(WITH_PILOT && fs.existsSync(path.join(ROOT, "audio", "choukai", "n3", "p211")))) { rows.push({ lv, m, v2rel, status: "DITAHAN (pilot, audio belum ada)" }); continue; }
      if (nonDokkaiBeda && !pilot) bad(`${nonDokkaiBeda} soal non-dokkai berubah`);
      for (const it of B) {
        if (!Array.isArray(it.opts) || it.ans < 0 || it.ans >= it.opts.length) bad(`${it.id}: kunci di luar pilihan`);
        if (new Set(it.opts).size !== it.opts.length) bad(`${it.id}: pilihan kembar`);
        if (it.pid && !newJ.passages?.[it.pid]) bad(`${it.id}: bacaan ${it.pid} tidak ada`);
      }
      rows.push({ lv, m, v2rel, status: ok ? (pilot ? "SIAP (pilot)" : "SIAP") : "GAGAL" });
    }
  }
  return { idx, rows, problems };
}

function report({ rows, problems }) {
  const c = {};
  for (const r of rows) c[`${r.lv} ${r.status}`] = (c[`${r.lv} ${r.status}`] || 0) + 1;
  console.log("Ringkasan:", JSON.stringify(c));
  if (problems.length) { console.log("MASALAH:"); problems.slice(0, 40).forEach((p) => console.log("  - " + p)); }
  return !problems.length;
}

if (mode === "check") {
  const p = plan();
  const ok = report(p);
  console.log(ok ? "OK — siap di-apply (belum ada yang diubah)." : "Ada masalah — jangan apply.");
  process.exit(ok ? 0 : 1);
} else if (mode === "apply") {
  const p = plan();
  if (!report(p)) { console.log("Dibatalkan: ada masalah."); process.exit(1); }
  const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 12);
  const dir = path.join(BK, "jlpt-golive-" + stamp);
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(INDEX, path.join(dir, "index.json"));
  const changed = p.rows.filter((r) => r.status.startsWith("SIAP"));
  for (const r of changed) r.m.file = r.v2rel.replace(/\\/g, "/");
  fs.writeFileSync(INDEX, JSON.stringify(p.idx)); // satu baris, sama dengan format aslinya
  fs.writeFileSync(path.join(dir, "MANIFEST.txt"), `Cadangan sebelum go-live Dokkai v2 (${new Date().toISOString()})\nDiarahkan ulang: ${changed.length} paket\n` + changed.map((r) => `${r.m.id} -> ${r.m.file}`).join("\n") + `\n\nRollback: node tools/jlpt_v2/golive.mjs rollback ${path.basename(dir)}\n`);
  console.log(`Selesai: ${changed.length} paket diarahkan ke v2. Cadangan: ${path.relative(ROOT, dir)}`);
} else if (mode === "rollback") {
  const want = process.argv[3];
  const dirs = fs.readdirSync(BK).filter((d) => d.startsWith("jlpt-golive-")).sort();
  const d = want || dirs[dirs.length - 1];
  const src = path.join(BK, d, "index.json");
  if (!d || !fs.existsSync(src)) { console.log("Cadangan tidak ditemukan."); process.exit(1); }
  fs.copyFileSync(src, INDEX);
  console.log("index.json dipulihkan dari", path.join("backup", d));
} else { console.log("mode? check | apply | rollback"); process.exit(1); }
