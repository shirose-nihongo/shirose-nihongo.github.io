// Audit data JFT: node tools/jft-audit.mjs [--md]  → cetak ringkasan; --md menulis docs/JFT-AUDIT.md
import fs from "fs";
import path from "path";
const R = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const ex = (p) => fs.existsSync(p);
const norm = (s) => String(s ?? "").normalize("NFKC").replace(/\s+/g, "").toLowerCase();
const issues = []; const add = (k, m) => issues.push([k, m]);
const keyOf = (q) => norm(q.q) + "|" + [...(q.o || [])].map(norm).sort().join("|") + "|" + norm(q.say || "") + "|" + norm(JSON.stringify(q.fl || ""));

function cekSoal(q, ctx) {
  if (q.tipe === "isi") { if (!q.a) add("tanpa-jawaban", ctx); }
  else {
    if (!Array.isArray(q.o) || q.o.length < 2) add("pilihan-kurang", ctx);
    else if (typeof q.a !== "number" || q.a < 0 || q.a >= q.o.length) add("kunci-di-luar-pilihan", ctx);
    else if (new Set(q.o.map(norm)).size !== q.o.length) add("pilihan-kembar", ctx);
  }
  if (!q.n && !q.exp) add("tanpa-penjelasan", ctx);
  if (!q.q) add("tanpa-pertanyaan", ctx);
}
const out = {};
const bank = R("data/jft/bank.json");
out.bank = { conv: bank.conv.length, listen: bank.listen.length, read: bank.read.length, readQ: bank.read.reduce((a, t) => a + t.qs.length, 0), babBlok: Object.fromEntries(Object.entries(bank.bab).map(([k, v]) => [k, v.length])) };
bank.conv.forEach((q, i) => cekSoal(q, `bank.conv[${i}]`));
bank.listen.forEach((q, i) => { cekSoal(q, `bank.listen[${i}]`); if (!q.say) add("listening-tanpa-naskah", `bank.listen[${i}]`); });
bank.read.forEach((t, i) => t.qs.forEach((q, j) => cekSoal(q, `bank.read[${i}].${j}`)));
Object.entries(bank.bab).forEach(([lv, bl]) => bl.forEach((b, i) => b.forEach((t, j) => (t.qs || []).forEach((q, k) => cekSoal(q, `bank.bab.${lv}[${i}][${j}].${k}`)))));

const T = R("data/jft/tryout.json");
out.tryout = T.paket.map((p) => ({ id: p.id, n: p.soal.length, menit: p.menit, sec: p.soal.reduce((a, s) => ((a[s.sec] = (a[s.sec] || 0) + 1), a), {}) }));
T.paket.forEach((p) => p.soal.forEach((q, i) => cekSoal(q, `tryout.${p.id}[${i}]`)));
// duplikat antar paket
const seen = new Map(); let dupAntar = 0;
T.paket.forEach((p) => p.soal.forEach((q, i) => { const k = keyOf(q); if (seen.has(k) && seen.get(k) !== p.id) { dupAntar++; add("duplikat-antar-paket", `${p.id}[${i}] = ${seen.get(k)}`); } else if (seen.has(k)) add("duplikat-dalam-paket", `${p.id}[${i}]`); else seen.set(k, p.id); }));
out.tryoutDupAntarPaket = dupAntar;

const isi = R("data/jft/isi.json");
out.isi = Object.fromEntries(["vocab", "conv", "listening", "reading"].map((k) => [k, (isi[k] || []).length]));
["vocab", "conv", "listening", "reading"].forEach((k) => (isi[k] || []).forEach((q, i) => cekSoal({ ...q, tipe: "isi" }, `isi.${k}[${i}]`)));

// choukai JFT (901–904) + berkas audio
out.choukai = {}; let audioHilang = 0, audioTotal = 0;
for (const pk of [901, 902, 903, 904]) {
  const f = `choukai/paket/n5-p${pk}.json`; if (!ex(f)) { add("paket-choukai-hilang", f); continue; }
  const d = R(f); const items = d.sections.flatMap((s) => s.items);
  out.choukai[pk] = items.length;
  items.forEach((it) => {
    if (!it.audio) add("choukai-tanpa-audio", `${pk}:${it.id}`); else { audioTotal++; if (!ex(it.audio)) { audioHilang++; add("audio-berkas-hilang", `${pk}:${it.id} → ${it.audio}`); } }
    if (!it.qs || !it.qs.length) add("choukai-tanpa-soal", `${pk}:${it.id}`);
    else it.qs.forEach((q) => { if (typeof q.ans !== "number" || q.ans >= (it.opts || []).length) add("kunci-di-luar-pilihan", `${pk}:${it.id}`); });
    if (!it.exp) add("tanpa-penjelasan", `choukai ${pk}:${it.id}`);
  });
}
out.audio = { dirJft: fs.readdirSync("audio/choukai/jft").filter((x) => !x.endsWith(".mp3")).map((d) => [d, fs.readdirSync("audio/choukai/jft/" + d).length]), dirJftFiles: audioTotal, hilang: audioHilang };
// audio yatim (ada berkas tapi tidak dipakai)
const dipakai = new Set(); for (const pk of [901, 902, 903, 904]) if (ex(`choukai/paket/n5-p${pk}.json`)) R(`choukai/paket/n5-p${pk}.json`).sections.forEach((s) => s.items.forEach((it) => it.audio && dipakai.add(it.audio)));
let yatim = 0; for (const d of ["ir0", "ir1", "ir2", "sim"]) for (const f of fs.readdirSync(`audio/choukai/jft/${d}`)) if (!dipakai.has(`audio/choukai/jft/${d}/${f}`)) { yatim++; add("audio-yatim", `${d}/${f}`); }
out.audio.yatim = yatim;

// slide/ppt
const idx = R("data/jft/ppt/index.json"); out.ppt = { bab: idx.length, hilang: idx.filter((x) => !ex(`data/jft/ppt/${x.id}/m.json`)).map((x) => x.id) };
let slideTotal = 0, slideAudio = 0; idx.forEach((x) => { if (ex(`data/jft/ppt/${x.id}/m.json`)) { const m = R(`data/jft/ppt/${x.id}/m.json`); slideTotal += m.slides.length; slideAudio += m.slides.filter((s) => s.au && s.au.length).length; } });
out.ppt.slide = slideTotal; out.ppt.slideBerAudio = slideAudio;
// bunpou/kosakata/kanji sumber
out.sumber = {}; for (const lv of ["ir0", "ir1", "ir2"]) out.sumber[lv] = { kosakata: R(`data/kosakata-${lv}.json`).length, kanji: R(`data/kanji-${lv}.json`).length, bunpou: R(`data/bunpou-${lv}.json`).length };

const ringkas = {}; issues.forEach(([k]) => (ringkas[k] = (ringkas[k] || 0) + 1));
console.log(JSON.stringify({ ...out, masalah: ringkas }, null, 1));
if (process.argv.includes("--md")) {
  const L = [];
  L.push("# Audit JFT-Basic Shirose Nihongo", "", `_Dibuat otomatis oleh \`node tools/jft-audit.mjs --md\` — ${new Date().toISOString().slice(0, 10)}._`, "");
  L.push("## Inventaris", "", "| Komponen | Jumlah |", "|---|---:|");
  L.push(`| Bank konversasi (conv) | ${out.bank.conv} |`, `| Bank listening (bank.json) | ${out.bank.listen} |`, `| Bank reading | ${out.bank.read} teks / ${out.bank.readQ} soal |`);
  L.push(`| Paket tryout/Full Test | ${out.tryout.length} (${out.tryout.map((p) => p.n).join("/")} soal) |`, `| Soal isian (latihan) | ${Object.values(out.isi).reduce((a, b) => a + b, 0)} |`);
  L.push(`| Item Choukai JFT (paket 901–904) | ${Object.values(out.choukai).reduce((a, b) => a + b, 0)} (${Object.entries(out.choukai).map(([k, v]) => k + ":" + v).join(", ")}) |`);
  L.push(`| Berkas audio Choukai JFT | ${out.audio.dirJft.map(([d, n]) => d + ":" + n).join(", ")} |`, `| Audio dirujuk tapi berkas hilang | ${out.audio.hilang} |`, `| Audio tidak dipakai soal mana pun | ${out.audio.yatim} |`);
  L.push(`| PPT resmi Irodori | ${out.ppt.bab} bab · ${out.ppt.slide} slide · ${out.ppt.slideBerAudio} slide ber-audio |`);
  for (const lv of ["ir0", "ir1", "ir2"]) L.push(`| Sumber ${lv} | ${out.sumber[lv].kosakata} kosakata · ${out.sumber[lv].kanji} kanji · ${out.sumber[lv].bunpou} bunpou |`);
  L.push("", "## Masalah data", "");
  if (!issues.length) L.push("Tidak ada masalah terdeteksi."); else { L.push("| Jenis | Jumlah |", "|---|---:|"); Object.entries(ringkas).forEach(([k, v]) => L.push(`| ${k} | ${v} |`)); L.push("", "Contoh (maks 5 per jenis):", ""); const per = {}; issues.forEach(([k, m]) => { (per[k] = per[k] || []).length < 5 && per[k].push(m); }); Object.entries(per).forEach(([k, a]) => L.push(`- **${k}**: ${a.join("; ")}`)); }
  L.push("", "## Temuan manual & rekomendasi", "",
    "- **Choukai bukan audio resmi Irodori.** Audio di `audio/choukai/jft/*` dibuat dengan TTS (VOICEVOX) dari naskah orisinal Shirose; PDF/audio Choukai resmi Irodori **tidak ada di workspace** (hanya PDF kosakata Starter). Tidak ada referensi file palsu — bila PDF+audio resmi diunggah, integrasi nomor latihan → audio → soal bisa dibuat dengan struktur paket `choukai/paket/n5-p90x.json` yang sama.",
    "- **Slide PPT resmi** (54 bab, ±1.8 ribu slide) berupa gambar + titik audio; belum punya latihan per poin → ditambah mode latihan interaktif per slide (lihat `js/jft-slide.js`).",
    "- **Paket 6-bab**: tiap level sudah punya 3 blok (bab 1–6, 7–12, 13–18) × 3 paket = target minimal 3 paket per enam bab terpenuhi; paket digenerate dari kosakata+kanji+bunpou bab terkait dengan benih tetap.",
    "- **Full Test**: 20 paket (`ft01`–`ft20`) × 50 soal (12 huruf & kosakata · 14 percakapan · 12 choukai · 12 dokkai) dibangun `node tools/build-fulltest.mjs`; kosakata tiap soal unik antar paket, percakapan/choukai/dokkai dibagi per kuota sehingga duplikat antar paket < 1%.",
    "- **Skor**: pemetaan linear internal 0%→10, 50%→145, 70%→200, 100%→250 hanyalah estimasi latihan. Rentang level mengikuti Japan Foundation (145–174 A1, 175–199 A2.1, 200–250 A2.2/A2, <145 `*`). Halaman hasil kini berlabel *estimasi latihan* dan memuat tabel total/benar/salah/akurasi + analisis 4 kategori + rekomendasi.",
    "- **CBT**: satu soal per layar, nomor soal, timer 60 menit, kunci bagian setelah pindah bagian, konfirmasi selesai — sudah ada. Aturan navigasi Listening resmi (audio 2× putar) sesuai implementasi sekarang; belum diverifikasi terhadap CBT Prometric asli.",
    "- **Belum divalidasi native**: bahasa Jepang soal baru ditulis orisinal oleh Claude (A1–A2); disarankan review guru sebelum dipakai sebagai ujian resmi.");
  fs.writeFileSync("docs/JFT-AUDIT.md", L.join("\n") + "\n");
  console.log("→ docs/JFT-AUDIT.md");
}
