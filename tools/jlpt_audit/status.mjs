// Buat / perbarui tabel status per level × paket dari docs/jlpt-audit/baseline.json.
//   node tools/jlpt_audit/status.mjs
// Kolom status_revisi & catatan yang sudah diisi manual di STATUS.csv dipertahankan.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const DIR = path.join(ROOT, "docs", "jlpt-audit");
const base = JSON.parse(fs.readFileSync(path.join(DIR, "baseline.json"), "utf8"));
const OUTF = path.join(DIR, "STATUS.csv");

const keep = new Map();
if (fs.existsSync(OUTF)) {
  for (const line of fs.readFileSync(OUTF, "utf8").replace(/^﻿/, "").split("\n").slice(1)) {
    const c = line.split(",");
    if (c.length >= 9) keep.set(`${c[0]}|${c[2]}`, { status: c[c.length - 2], cat: c[c.length - 1] });
  }
}
const rows = [["level", "paket", "file", "soal", "ditandai", "bersih_otomatis", "kode_teratas", "status_revisi", "catatan"].join(",")];
for (const [lv, s] of Object.entries(base.summary)) {
  const groups = {};
  for (const [f, v] of Object.entries(s.files)) {
    const m = f.match(/-(\d+)(?:\.v\d+)?\.json$/);
    const pk = /^(full|kanji|kotoba|bunpou)-/.test(f) && m ? m[1] : "lain";
    (groups[pk] ??= []).push([f, v]);
  }
  for (const pk of Object.keys(groups).sort()) {
    for (const [f, v] of groups[pk].sort()) {
      const top = Object.entries(v.kode).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, n]) => `${k}:${n}`).join(" ");
      const prev = keep.get(`${lv}|${f}`) || {};
      rows.push([lv, pk, f, v.total, v.flagged, v.total - v.flagged, top, prev.status || "BELUM", prev.cat || ""].join(","));
    }
  }
}
fs.writeFileSync(OUTF, "﻿" + rows.join("\n"));
console.log(`STATUS.csv: ${rows.length - 1} baris`);
