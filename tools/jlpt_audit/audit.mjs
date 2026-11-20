// Audit kualitas bank soal JLPT Shirose Nihongo (read-only — TIDAK mengubah data).
//
//   node tools/jlpt_audit/audit.mjs            → audit N5–N2 (N1 dilewati)
//   node tools/jlpt_audit/audit.mjs n4         → satu level
//
// Hasil:
//   docs/jlpt-audit/baseline.json   angka mentah per level / paket / kategori + daftar temuan per soal
//   docs/jlpt-audit/flags.csv       satu baris per soal yang ditandai (untuk dipantau / di-filter di spreadsheet)
//
// Pemeriksaan otomatis hanya menangkap masalah yang bisa dideteksi mesin (struktur, level kanji,
// duplikat, pengecoh lemah, pola monoton, panjang teks/dialog). Kealamian bahasa & kesesuaian
// dengan soal asli tetap butuh penilaian manual memakai rubrik di docs/jlpt-audit/RUBRIK-QC.md.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
// Pratinjau versi revisi:  node tools/jlpt_audit/audit.mjs n3 --preview full-11.v2.json
//   → file v2 diperlakukan seolah sudah menggantikan full-11.json; hasil ke docs/jlpt-audit/preview/.
const PREVIEW = process.argv.includes("--preview") ? process.argv.slice(process.argv.indexOf("--preview") + 1).filter((a) => !a.startsWith("--")) : [];
const OUT = path.join(ROOT, "docs", "jlpt-audit", ...(PREVIEW.length ? ["preview"] : []));
const LEVELS = (process.argv[2] && !process.argv[2].startsWith("--") ? [process.argv[2]] : ["n5", "n4", "n3", "n2"]);
const ORDER = ["n5", "n4", "n3", "n2", "n1"];
const rd = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));

/* ---------- referensi level: kanji & kosakata ---------- */
const kanjiLv = {}, vocabLv = {};
for (const l of ORDER) {
  for (const k of rd(`data/kanji-${l}.json`)) if (!(k.k in kanjiLv)) kanjiLv[k.k] = l;
  for (const v of rd(`data/kosakata-${l}.json`)) if (v.kata && !(v.kata in vocabLv)) vocabLv[v.kata] = l;
}
const lvIdx = (l) => ORDER.indexOf(l);
const isKanji = (c) => /[一-鿿]/.test(c);
const strip = (s) => String(s ?? "").replace(/<[^>]+>/g, "").replace(/\[[^\]]*\]/g, "");
const norm = (s) => strip(s).replace(/[\s　、。，．・「」『』（）()！？!?]/g, "");
const kanaOnly = (s) => /^[぀-ヿー\s　]+$/.test(strip(s));

/* ---------- patokan kasar (mendekati JLPT asli, perlu dikalibrasi dengan soal asli) ---------- */
// Panjang bacaan (karakter, tanpa spasi) & panjang dialog choukai (karakter dialog, tanpa narasi).
const DOKKAI_LEN = { n5: [60, 450], n4: [80, 600], n3: [120, 900], n2: [180, 1300] };
const CHOUKAI_TARGET = { // jumlah soal per mondai menurut format resmi (2010–)
  n5: { "課題理解": 7, "ポイント理解": 6, "発話表現": 5, "即時応答": 6 },
  n4: { "課題理解": 8, "ポイント理解": 7, "発話表現": 5, "即時応答": 8 },
  n3: { "課題理解": 6, "ポイント理解": 6, "概要理解": 3, "発話表現": 4, "即時応答": 9 },
  n2: { "課題理解": 5, "ポイント理解": 6, "概要理解": 5, "即時応答": 12, "統合理解": 4 },
};
// Panjang dialog (karakter) yang wajar untuk 課題/ポイント理解 per level.
const DIALOG_LEN = { n5: [70, 260], n4: [100, 340], n3: [150, 480], n2: [220, 650] };

/* ---------- kumpulkan semua soal ---------- */
const flags = [];         // {lv, file, id, cat, tipe, kode, ket}
const levelStats = {};
const flag = (ctx, kode, ket = "") => { ctx.kode.add(kode); flags.push({ lv: ctx.lv, file: ctx.file, id: ctx.id, cat: ctx.cat, tipe: ctx.tipe_jp, kode, ket }); };

const SEVERITY = { // kode → berat (B = blocker/kunci rusak, M = mayor, m = minor)
  STRUKTUR: "B", KUNCI_TIDAK_COCOK: "B", OPSI_DUPLIKAT: "B", AUDIO_HILANG: "B", OPSI_AUDIO_BEDA: "B",
  KANJI_DI_ATAS_LEVEL: "m", KOSAKATA_DI_ATAS_LEVEL: "M", DUPLIKAT_LEVEL: "M", DUPLIKAT_LINTAS_LEVEL: "M",
  YOMI_FORMAT: "M", HYOUKI_FORMAT: "M", JAWABAN_TERPANJANG: "m", PENJELASAN_GENERIK: "m", PENJELASAN_KOSONG: "M",
  PENGECOH_TIDAK_DISEBUT: "M", JAWABAN_DISEBUT_VERBATIM: "m", DIALOG_PENDEK: "M", DIALOG_PANJANG: "m",
  BACAAN_PENDEK: "M", BACAAN_PANJANG: "m", SATU_PEMBICARA: "m", PERTANYAAN_TIDAK_DIULANG: "m",
};

const INDEX = rd("jlpt/index.json");
function liveFiles(lv) {
  const out = [];
  for (const list of Object.values(INDEX.level[lv] || {})) if (Array.isArray(list)) for (const m of list) out.push(m.file.split("/").pop());
  for (const p of PREVIEW) {
    const base = p.replace(/\.v\d+\.json$/, ".json");
    const i = out.indexOf(base);
    if (i >= 0) out[i] = p;
  }
  return [...new Set(out)].sort();
}

const seenLv = {};  // lv → Map(key → first id)
const seenAll = new Map(); // key → {lv,id}
const dialogSeen = new Map();

for (const lv of LEVELS) {
  // Hanya file yang LIVE (terdaftar di jlpt/index.json). Versi lama (mis. full-05.json setelah
  // full-05.v2.json dipakai) tetap disimpan untuk riwayat siswa tetapi tidak diaudit.
  const files = liveFiles(lv);
  const st = levelStats[lv] = { files: {}, total: 0, flagged: 0, byCat: {}, byKode: {}, ansPos: [0, 0, 0, 0], choukai: { dialogLen: [], turns: [], speakers: [], perMondai: {} }, dokkai: { passLen: [] }, stems: {} };
  seenLv[lv] = new Map();
  for (const f of files) {
    const rel = `jlpt/${lv}/${f}`;
    const pkg = rd(rel);
    const jenis = f.replace(/-\d+(?:\.v\d+)?\.json$/, "");
    const fst = st.files[f] = { jenis, total: 0, flagged: 0, byCat: {}, kode: {} };
    const passages = pkg.passages || {};
    const passLenCounted = new Set();
    const chCount = {};
    for (const sec of pkg.sections || []) {
      for (const it of sec.items || []) {
        const ctx = { lv, file: f, id: it.id || `${pkg.id}-?`, cat: it.cat || sec.cat, tipe: it.tipe || sec.tipe, tipe_jp: it.tipe_jp || sec.tipe_jp, kode: new Set() };
        st.total++; fst.total++;
        const cat = ctx.cat === "choukai" ? `choukai/${ctx.tipe_jp}` : `${ctx.cat}/${ctx.tipe_jp}`;
        (st.byCat[cat] ??= { total: 0, flagged: 0 }).total++;
        (fst.byCat[ctx.cat] ??= { total: 0, flagged: 0 }).total++;

        /* 1. struktur & kunci */
        const opts = it.opts || [];
        const nOpt = ["発話表現", "即時応答"].includes(ctx.tipe_jp) ? 3 : 4;
        if (opts.length !== nOpt && !(ctx.tipe_jp === "発話表現" && opts.length === 3)) flag(ctx, "STRUKTUR", `jumlah opsi ${opts.length}, harusnya ${nOpt}`);
        if (!(Number.isInteger(it.ans) && it.ans >= 0 && it.ans < opts.length)) flag(ctx, "STRUKTUR", `ans=${it.ans}`);
        else st.ansPos[it.ans]++;
        if (new Set(opts.map(norm)).size !== opts.length) flag(ctx, "OPSI_DUPLIKAT", opts.join(" / "));
        const ex = it.ex || {};
        if (!ex.jawaban || !ex.alasan) flag(ctx, "PENJELASAN_KOSONG");
        else {
          const letter = "ABCD"[it.ans];
          const jw = String(ex.jawaban);
          if (!(jw === letter || jw.startsWith(letter + ".")) || (jw !== letter && opts[it.ans] && !norm(jw).includes(norm(opts[it.ans]).slice(0, 12)))) flag(ctx, "KUNCI_TIDAK_COCOK", `ans=${letter} "${opts[it.ans]}" vs ex.jawaban "${jw}"`);
        }
        const opsiEx = (ex.opsi || []).join(" ");
        if (/Bukan bacaan yang benar untuk|Tidak disebut\.|tidak cocok dengan konteks\.?$/.test(opsiEx) || (ex.opsi && ex.opsi.length && ex.opsi.filter((o) => !/BENAR/.test(o)).every((o) => o.split("—")[1] === undefined))) flag(ctx, "PENJELASAN_GENERIK");

        /* 2. level kanji & kosakata (N5–N3 saja; N2 boleh semua kanji jouyou) */
        const text = strip(it.q) + opts.map(strip).join("") + (it.pid && passages[it.pid] ? strip(passages[it.pid].jp) : "");
        if (lv !== "n2") {
          const over = [...new Set([...text].filter((c) => isKanji(c) && (!(c in kanjiLv) || lvIdx(kanjiLv[c]) > lvIdx(lv))))];
          // kanji yang memang diuji di 漢字読み/表記 boleh satu tingkat di atas? Tidak — JLPT memakai kanji level itu. Tetap ditandai.
          if (over.length) flag(ctx, "KANJI_DI_ATAS_LEVEL", over.join(""));
        }
        const target = it.ref?.kata;
        if (target && target in vocabLv && lvIdx(vocabLv[target]) > lvIdx(lv)) flag(ctx, "KOSAKATA_DI_ATAS_LEVEL", `${target} (${vocabLv[target]})`);

        /* 3. format khusus per tipe */
        if (ctx.tipe === "yomi") {
          if (!/<u>/.test(it.q)) flag(ctx, "YOMI_FORMAT", "tidak ada garis bawah");
          if (!opts.every(kanaOnly)) flag(ctx, "YOMI_FORMAT", "opsi bukan kana");
        }
        if (ctx.tipe === "hyouki") {
          if (!opts.some((o) => [...o].some(isKanji))) flag(ctx, "HYOUKI_FORMAT", "opsi tanpa kanji");
        }
        // jawaban benar paling panjang secara mencolok (petunjuk tebakan) — hanya untuk opsi kalimat
        if (opts.length >= 3 && ["bunpou", "dokkai", "choukai"].includes(ctx.cat) && ctx.tipe !== "kumitate") {
          const L = opts.map((o) => norm(o).length);
          const others = L.filter((_, i) => i !== it.ans);
          if (L[it.ans] >= 8 && L[it.ans] > Math.max(...others) * 1.35) flag(ctx, "JAWABAN_TERPANJANG", L.join("/"));
        }

        /* 4. duplikat (kalimat soal + jawaban benar) */
        const key = norm(it.q) + "|" + norm(opts[it.ans]) + (ctx.cat === "choukai" ? "|" + norm((it.ck?.dialog || []).map((d) => d.t).join("")) : "") + (it.pid ? "|" + norm(passages[it.pid]?.jp).slice(0, 60) : "");
        if (norm(it.q).length > 4 && !/^Dengarkan/.test(strip(it.q))) {
          if (seenLv[lv].has(key) && !(jenis === "full" && ctx.cat === "choukai")) flag(ctx, "DUPLIKAT_LEVEL", `sama dengan ${seenLv[lv].get(key)}`);
          else seenLv[lv].set(key, ctx.id);
          const prev = seenAll.get(key);
          if (prev && prev.lv !== lv) flag(ctx, "DUPLIKAT_LINTAS_LEVEL", `sama dengan ${prev.id}`);
          else if (!prev) seenAll.set(key, { lv, id: ctx.id });
        }

        /* 5. dokkai */
        if (ctx.cat === "dokkai" && it.pid && passages[it.pid]) {
          const len = norm(passages[it.pid].jp).length;
          if (!passLenCounted.has(it.pid)) { passLenCounted.add(it.pid); st.dokkai.passLen.push({ len, jenis: passages[it.pid].jenis }); }
          const [lo, hi] = DOKKAI_LEN[lv];
          if (len < lo) flag(ctx, "BACAAN_PENDEK", `${len} karakter`);
          if (len > hi) flag(ctx, "BACAAN_PANJANG", `${len} karakter`);
        }

        /* 6. choukai */
        if (ctx.cat === "choukai") {
          const ck = it.ck || {};
          chCount[ctx.tipe_jp] = (chCount[ctx.tipe_jp] || 0) + 1;
          if (!ck.audio || !fs.existsSync(path.join(ROOT, ck.audio))) flag(ctx, "AUDIO_HILANG", ck.audio || "(kosong)");
          const dlg = ck.dialog || [];
          const dtext = dlg.map((d) => d.t).join("");
          const dlen = norm(dtext).length;
          const spk = new Set(dlg.map((d) => d.s)).size;
          if (["課題理解", "ポイント理解", "概要理解", "統合理解"].includes(ctx.tipe_jp)) {
            st.choukai.dialogLen.push({ tipe: ctx.tipe_jp, len: dlen });
            st.choukai.turns.push({ tipe: ctx.tipe_jp, n: dlg.length });
            st.choukai.speakers.push(spk);
            const [lo, hi] = DIALOG_LEN[lv];
            if (dlen < lo) flag(ctx, "DIALOG_PENDEK", `${dlen} karakter, ${dlg.length} giliran`);
            if (dlen > hi * 1.3) flag(ctx, "DIALOG_PANJANG", `${dlen} karakter`);
            // Monolog (1 giliran panjang: pengumuman, penjelasan guru) memang dianjurkan standar (RUBRIK-QC §3).
            // Yang ditandai hanya "dialog" dengan beberapa giliran tetapi satu pembicara (salah label).
            if (spk < 2 && dlg.length > 1 && ctx.tipe_jp !== "概要理解") flag(ctx, "SATU_PEMBICARA");
            // pertanyaan diucapkan sebelum & sesudah cerita (format 課題/ポイント)
            if (["課題理解", "ポイント理解"].includes(ctx.tipe_jp)) {
              const qn = norm(it.q);
              const narr = (ck.script || []).filter((s) => s.s === "N").map((s) => norm(s.t));
              if (qn && narr.filter((t) => t.includes(qn)).length < 2) flag(ctx, "PERTANYAAN_TIDAK_DIULANG");
              // pengecoh harus "muncul" di audio (JLPT asli: semua opsi biasanya disebut)
              const nd = norm(dtext);
              const mention = opts.map((o) => {
                const parts = strip(o).split(/[\s　とや、]+/).map(norm).filter((p) => p.length >= 2);
                return parts.length ? parts.some((p) => nd.includes(p) || nd.includes(p.slice(0, 2))) : true;
              });
              const missing = mention.map((m, i) => (!m && i !== it.ans ? "ABCD"[i] : null)).filter(Boolean);
              if (missing.length >= 2) flag(ctx, "PENGECOH_TIDAK_DISEBUT", missing.join(","));
              const exact = norm(opts[it.ans]);
              if (exact.length >= 4 && nd.includes(exact) && opts.filter((o, i) => i !== it.ans && nd.includes(norm(o))).length === 0) flag(ctx, "JAWABAN_DISEBUT_VERBATIM");
              const stem = strip(it.q).replace(/^.*?は/, "").replace(/[一-龯ァ-ヶー]+/g, "X");
              st.stems[stem] = (st.stems[stem] || 0) + 1;
            }
          }
          if (["即時応答", "発話表現"].includes(ctx.tipe_jp)) {
            const spoken = (ck.script || []).map((s) => norm(s.t).replace(/^[123１２３]/, ""));
            const bad = opts.filter((o) => !spoken.some((t) => t === norm(o) || t.endsWith(norm(o))));
            if (bad.length) flag(ctx, "OPSI_AUDIO_BEDA", bad.join(" / "));
          }
          const dkey = norm(dtext);
          if (dkey.length > 10) {
            const p = dialogSeen.get(dkey);
            if (p && p.lv === lv && p.file !== f && !(jenis === "full")) flag(ctx, "DUPLIKAT_LEVEL", `dialog sama dengan ${p.id}`);
            if (!p) dialogSeen.set(dkey, { lv, file: f, id: ctx.id });
          }
        }

        if (ctx.kode.size) {
          st.flagged++; fst.flagged++; st.byCat[cat].flagged++; fst.byCat[ctx.cat].flagged++;
          for (const k of ctx.kode) { st.byKode[k] = (st.byKode[k] || 0) + 1; fst.kode[k] = (fst.kode[k] || 0) + 1; }
        }
      }
    }
    if (jenis === "full") {
      const tgt = CHOUKAI_TARGET[lv];
      const diff = Object.entries(tgt).filter(([k, n]) => (chCount[k] || 0) !== n).map(([k, n]) => `${k} ${chCount[k] || 0}/${n}`);
      const extra = Object.keys(chCount).filter((k) => !(k in tgt));
      if (diff.length || extra.length) fst.formatChoukai = [...diff, ...extra.map((k) => `${k} (tidak ada di format resmi)`)].join("; ");
      st.choukai.perMondai[f] = chCount;
    }
  }
}

/* ---------- ringkas ---------- */
const q = (arr) => { if (!arr.length) return null; const s = [...arr].sort((a, b) => a - b); const at = (p) => s[Math.min(s.length - 1, Math.floor(p * s.length))]; return { n: s.length, min: s[0], p25: at(.25), med: at(.5), p75: at(.75), max: s[s.length - 1] }; };
const summary = {};
for (const [lv, st] of Object.entries(levelStats)) {
  const bySev = { B: 0, M: 0, m: 0 };
  const sevOf = new Map();
  for (const fl of flags.filter((x) => x.lv === lv)) {
    const s = SEVERITY[fl.kode] || "m"; const cur = sevOf.get(fl.id);
    if (!cur || "BMm".indexOf(s) < "BMm".indexOf(cur)) sevOf.set(fl.id, s);
  }
  for (const s of sevOf.values()) bySev[s]++;
  summary[lv] = {
    total: st.total, flagged: st.flagged, bersih: st.total - st.flagged, perSeverity: bySev,
    ansPos: st.ansPos, byCat: st.byCat, byKode: st.byKode,
    choukaiDialogLen: Object.fromEntries(["課題理解", "ポイント理解", "概要理解", "統合理解"].map((t) => [t, q(st.choukai.dialogLen.filter((x) => x.tipe === t).map((x) => x.len))])),
    choukaiTurns: q(st.choukai.turns.map((x) => x.n)),
    choukaiSpeakers: q(st.choukai.speakers),
    choukaiStemTop: Object.entries(st.stems).sort((a, b) => b[1] - a[1]).slice(0, 8),
    dokkaiPassLen: q(st.dokkai.passLen.map((x) => x.len)),
    dokkaiJenis: st.dokkai.passLen.reduce((m, x) => ((m[x.jenis] = (m[x.jenis] || 0) + 1), m), {}),
    files: st.files,
  };
}
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "baseline.json"), JSON.stringify({ dibuat: new Date().toISOString(), levels: LEVELS, summary, severity: SEVERITY }, null, 1));
const csv = ["level,file,id,kategori,tipe,kode,berat,keterangan", ...flags.map((f) => [f.lv, f.file, f.id, f.cat, f.tipe, f.kode, SEVERITY[f.kode] || "m", `"${String(f.ket).replace(/"/g, "'")}"`].join(","))];
fs.writeFileSync(path.join(OUT, "flags.csv"), "﻿" + csv.join("\n"));

for (const [lv, s] of Object.entries(summary)) {
  console.log(`\n=== ${lv.toUpperCase()}  soal ${s.total}  ditandai ${s.flagged}  bersih ${s.bersih}  B/M/m ${s.perSeverity.B}/${s.perSeverity.M}/${s.perSeverity.m}  posisi jawaban ${s.ansPos.join("/")}`);
  console.log("  per kategori:", Object.entries(s.byCat).map(([k, v]) => `${k} ${v.flagged}/${v.total}`).join(" | "));
  console.log("  per kode:", Object.entries(s.byKode).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${v}`).join(" "));
  console.log("  choukai dialog len:", JSON.stringify(s.choukaiDialogLen), "giliran", JSON.stringify(s.choukaiTurns), "pembicara", JSON.stringify(s.choukaiSpeakers));
  console.log("  choukai stem top:", JSON.stringify(s.choukaiStemTop));
  console.log("  dokkai len:", JSON.stringify(s.dokkaiPassLen), JSON.stringify(s.dokkaiJenis));
  const fmt = Object.entries(s.files).filter(([, v]) => v.formatChoukai).map(([k, v]) => `${k}: ${v.formatChoukai}`);
  if (fmt.length) console.log("  format choukai full beda:", fmt.slice(0, 3).join(" || "), fmt.length > 3 ? `(+${fmt.length - 3})` : "");
}
console.log(`\nflags.csv: ${flags.length} baris`);
