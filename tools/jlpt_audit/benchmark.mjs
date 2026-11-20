// Bandingkan karakteristik bank soal Shirose dengan soal JLPT asli (referensi).
//
//   node tools/jlpt_audit/benchmark.mjs <ref_dec.json>
//
// <ref_dec.json> = hasil konversi workbook referensi (sheet N5..N1, kolom A..Q). Berkas referensi
// TIDAK disimpan di repo (hak cipta Japan Foundation/JEES) — skrip ini hanya menyimpan ANGKA
// statistik ke docs/jlpt-audit/benchmark.json.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const REF = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const LEVELS = ["n5", "n4", "n3", "n2"];
const strip = (s) => String(s ?? "").replace(/<[^>]+>/g, "").replace(/\[[^\]]*\]/g, "");
const norm = (s) => strip(s).replace(/[\s　、。，．・「」『』（）()！？!?…・〜~\-:：]/g, "");
const toAscii = (s) => String(s).replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));

const LIS_MAP = {
  n5: { 1: "課題理解", 2: "ポイント理解", 3: "発話表現", 4: "即時応答" },
  n4: { 1: "課題理解", 2: "ポイント理解", 3: "発話表現", 4: "即時応答" },
  n3: { 1: "課題理解", 2: "ポイント理解", 3: "概要理解", 4: "発話表現", 5: "即時応答" },
  n2: { 1: "課題理解", 2: "ポイント理解", 3: "概要理解", 4: "即時応答", 5: "統合理解" },
};
const LIS_RE = /しつもんを\s*きいて|質問を聞いて|えを\s*み|えを見ながら|えなどが|何も\s*いんさつ|何も印刷|長めの話/;
const SPK = /(?:^|\s|。)((?:男|女)(?:の人|の学生|の留学生)?\s*[0-9０-９]?|先生|学生|店員|客|M|F)\s*[：:]/g;

const mentioned = (opt, body) => {
  const parts = strip(opt).split(/[\s　とや、]+/).map(norm).filter((p) => p.length >= 2);
  return parts.length ? parts.some((p) => body.includes(p) || body.includes(p.slice(0, 2))) : null;
};
const stats = (arr) => {
  const a = arr.filter((x) => x != null && !Number.isNaN(x)).sort((x, y) => x - y);
  if (!a.length) return null;
  const at = (p) => a[Math.min(a.length - 1, Math.floor(p * a.length))];
  return { n: a.length, p25: at(0.25), med: at(0.5), p75: at(0.75), mean: +(a.reduce((s, x) => s + x, 0) / a.length).toFixed(2) };
};
const pct = (arr) => { const a = arr.filter((x) => x != null); return a.length ? +(100 * a.filter(Boolean).length / a.length).toFixed(1) : null; };

/* ---------- referensi ---------- */
function parseTranscript(raw, opts) {
  let t = String(raw).replace(/^Tham khảo:\s*/, "").trim();
  t = t.replace(/\s(?:[1-4１-４][.．、]?|[①②③④])\s*[^\s]+.*$/s, (m) => (/[①②③④]|\s[1-4１-４][.．、 ]/.test(m) ? "" : m)); // buang daftar pilihan yang dibacakan
  const marks = [...t.matchAll(SPK)];
  const pre = marks.length ? t.slice(0, marks[0].index) : (t.match(/^[^。？?]*[。？?][^。？?]*[か？?][。]?/) || [""])[0];
  const qSent = (pre.match(/[^。]*か[。？?]?\s*$/) || [""])[0].trim();
  let body = t.slice(pre.length);
  if (qSent && norm(body).endsWith(norm(qSent))) body = body.slice(0, body.lastIndexOf(qSent.slice(0, 6)) >= 0 ? body.lastIndexOf(qSent.slice(0, 6)) : body.length);
  const speakers = new Set(marks.map((m) => toAscii(m[1]).replace(/\s/g, "")));
  return { body: norm(body.replace(SPK, " ")), turns: Math.max(1, marks.length), speakers: speakers.size || 1, qRepeated: !!qSent && norm(t).endsWith(norm(qSent)) };
}

const ref = {};
for (const lv of LEVELS) {
  const rows = (REF[lv.toUpperCase()] || []).slice(1);
  const R = ref[lv] = { lis: {}, dokkai: { len: [], qPer: {} }, keishikiLen: [], yomiLen: [], exams: new Set() };
  const seenPass = new Map();
  for (const r of rows) {
    R.exams.add(r.B);
    const isLis = /Listening/.test(r.D) || LIS_RE.test(r.E || "");
    const m = toAscii((String(r.E || "").match(/(?:問題|もんだい|まんだい)\s*([0-9０-９]+)/) || [])[1] || "");
    const opts = [r.H, r.I, r.J, r.K].filter((o) => o != null && o !== "");
    if (isLis) {
      const tipe = LIS_MAP[lv][m];
      if (!tipe || !r.N || !/Tham khảo/.test(r.N)) continue;
      const tr = parseTranscript(r.N, opts);
      const L = R.lis[tipe] ??= { body: [], turns: [], speakers: [], mono: [], optLen: [], mention: [], allMention: [] };
      L.body.push(tr.body.length); L.turns.push(tr.turns); L.speakers.push(tr.speakers); L.mono.push(tr.speakers <= 1);
      if (["課題理解", "ポイント理解"].includes(tipe) && opts.length === 4 && opts.every((o) => norm(o).length)) {
        L.optLen.push(opts.reduce((s, o) => s + norm(o).length, 0) / 4);
        const ans = (+r.L || 0) - 1;
        const dm = opts.map((o, i) => (i === ans ? null : mentioned(o, tr.body))).filter((x) => x != null);
        L.mention.push(...dm); L.allMention.push(dm.every(Boolean));
      }
      continue;
    }
    if (/読解/.test(r.D) && r.G && norm(r.G).length > 80 && !/【\d+】|\(\d+\)から\(\d+\)に|から.*に何を入れ/.test(r.E)) {
      const k = norm(r.G).slice(0, 80);
      if (!seenPass.has(k)) { seenPass.set(k, 0); R.dokkai.len.push(norm(r.G).length); }
      seenPass.set(k, seenPass.get(k) + 1);
    }
    if (/\(\s*\)|（\s*）/.test(r.E || "") && /文法|Grammar/.test(r.D) && !r.G) R.keishikiLen.push(norm(r.F).replace(/^\d+/, "").length);
    if (/読み方|ひらがなで/.test(r.E || "")) R.yomiLen.push(norm(r.F).replace(/^\d+/, "").length);
  }
  R.dokkai.qPer = stats([...seenPass.values()]);
}

/* ---------- bank Shirose ---------- */
const INDEX = JSON.parse(fs.readFileSync(path.join(ROOT, "jlpt", "index.json"), "utf8"));
const liveFiles = (lv) => [...new Set(Object.values(INDEX.level[lv] || {}).flatMap((l) => (Array.isArray(l) ? l.map((m) => m.file.split("/").pop()) : [])))].sort();
const bank = {};
for (const lv of LEVELS) {
  const B = bank[lv] = { lis: {}, dokkai: { len: [] }, keishikiLen: [], yomiLen: [] };
  const dir = path.join(ROOT, "jlpt", lv);
  const passSeen = new Map();
  for (const f of liveFiles(lv)) {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    for (const sec of pkg.sections || []) for (const it of sec.items || []) {
      if (it.cat === "choukai") {
        if (!f.startsWith("full")) continue;
        const tipe = it.tipe_jp; const dlg = it.ck?.dialog || [];
        const body = norm(dlg.map((d) => d.t).join(""));
        const L = B.lis[tipe] ??= { body: [], turns: [], speakers: [], mono: [], optLen: [], mention: [], allMention: [] };
        const sp = new Set(dlg.map((d) => d.s)).size || 1;
        L.body.push(body.length); L.turns.push(Math.max(1, dlg.length)); L.speakers.push(sp); L.mono.push(sp <= 1);
        if (["課題理解", "ポイント理解"].includes(tipe) && (it.opts || []).length === 4) {
          L.optLen.push(it.opts.reduce((s, o) => s + norm(o).length, 0) / 4);
          const dm = it.opts.map((o, i) => (i === it.ans ? null : mentioned(o, body))).filter((x) => x != null);
          L.mention.push(...dm); L.allMention.push(dm.every(Boolean));
        }
      } else if (it.cat === "dokkai" && it.pid && pkg.passages?.[it.pid]) {
        const k = norm(pkg.passages[it.pid].jp).slice(0, 80);
        if (!passSeen.has(k)) { passSeen.set(k, 0); B.dokkai.len.push(norm(pkg.passages[it.pid].jp).length); }
        passSeen.set(k, passSeen.get(k) + 1);
      } else if (it.tipe === "keishiki") B.keishikiLen.push(norm(it.q).length);
      else if (it.tipe === "yomi") B.yomiLen.push(norm(it.q).length);
    }
  }
  B.dokkai.qPer = stats([...passSeen.values()]);
}

/* ---------- ringkas ---------- */
const sumLis = (L) => Object.fromEntries(Object.entries(L).map(([t, v]) => [t, {
  dialogChars: stats(v.body), turns: stats(v.turns), speakers: stats(v.speakers), monologPct: pct(v.mono),
  optLen: stats(v.optLen), pengecohDisebutPct: pct(v.mention), semuaPengecohDisebutPct: pct(v.allMention),
}]));
const out = {};
for (const lv of LEVELS) {
  out[lv] = {
    ref: { ujian: ref[lv].exams.size, choukai: sumLis(ref[lv].lis), dokkaiChars: stats(ref[lv].dokkai.len), dokkaiSoalPerBacaan: ref[lv].dokkai.qPer, keishikiChars: stats(ref[lv].keishikiLen), yomiChars: stats(ref[lv].yomiLen) },
    bank: { choukai: sumLis(bank[lv].lis), dokkaiChars: stats(bank[lv].dokkai.len), dokkaiSoalPerBacaan: bank[lv].dokkai.qPer, keishikiChars: stats(bank[lv].keishikiLen), yomiChars: stats(bank[lv].yomiLen) },
  };
}
fs.writeFileSync(path.join(ROOT, "docs", "jlpt-audit", "benchmark.json"), JSON.stringify({ dibuat: new Date().toISOString(), catatan: "Hanya statistik. Panjang = jumlah karakter tanpa spasi/tanda baca. Referensi: ekspor soal JLPT asli (tidak disimpan di repo).", levels: out }, null, 1));

const f = (s) => (s ? `${s.med} (${s.p25}–${s.p75}, n=${s.n})` : "—");
for (const lv of LEVELS) {
  const o = out[lv];
  console.log(`\n=== ${lv.toUpperCase()}  (ref ${o.ref.ujian} ujian)`);
  const tipes = [...new Set([...Object.keys(o.ref.choukai), ...Object.keys(o.bank.choukai)])];
  for (const t of tipes) {
    const r = o.ref.choukai[t] || {}, b = o.bank.choukai[t] || {};
    console.log(`  ${t}\n    dialog  REF ${f(r.dialogChars)}  |  BANK ${f(b.dialogChars)}\n    giliran REF ${f(r.turns)}  |  BANK ${f(b.turns)}   monolog REF ${r.monologPct}%  BANK ${b.monologPct}%`);
    if (r.optLen || b.optLen) console.log(`    opsi    REF ${f(r.optLen)}  |  BANK ${f(b.optLen)}   pengecoh disebut REF ${r.pengecohDisebutPct}% (semua ${r.semuaPengecohDisebutPct}%)  BANK ${b.pengecohDisebutPct}% (semua ${b.semuaPengecohDisebutPct}%)`);
  }
  console.log(`  dokkai   REF ${f(o.ref.dokkaiChars)}  |  BANK ${f(o.bank.dokkaiChars)}   soal/bacaan REF ${o.ref.dokkaiSoalPerBacaan?.mean}  BANK ${o.bank.dokkaiSoalPerBacaan?.mean}`);
  console.log(`  keishiki REF ${f(o.ref.keishikiChars)}  |  BANK ${f(o.bank.keishikiChars)}`);
  console.log(`  yomi     REF ${f(o.ref.yomiChars)}  |  BANK ${f(o.bank.yomiChars)}`);
}
