// Bangun 20 paket Full Test JFT (50 soal · 4 bagian) → ditambahkan ke data/jft/tryout.json (id ft01..ft20).
// Jalankan: node tools/build-fulltest.mjs   (deterministik, idempoten; paket asli try0–try2 tidak diubah)
import fs from "fs";
import { CONV_OK } from "./jft-extra-conv.mjs";
import { LISTEN } from "./jft-extra-listen.mjs";
import { READ } from "./jft-extra-read.mjs";
const R = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const N_PKT = 20, SEC = { vocab: 12, conv: 14, listening: 12, reading: 12 };

/* ---- RNG berbenih ---- */
let _s = 20261118;
const rnd = () => { _s |= 0; _s = (_s + 0x6d2b79f5) | 0; let t = Math.imul(_s ^ (_s >>> 15), 1 | _s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a, n) => shuffle(a).slice(0, n);
const norm = (s) => String(s ?? "").normalize("NFKC").replace(/\s+/g, "").toLowerCase();
const strip = (s) => String(s || "").replace(/\[[^\]]*\]/g, "");
const opts4 = (benar, salah, extra = {}) => { const all = [benar, ...salah]; const idx = shuffle(all.map((_, i) => i)); return { ...extra, o: idx.map((i) => all[i]), a: idx.indexOf(0) }; };
const mk = (sec, q, benar, salah, n, ref, extra = {}) => ({ sec, q, ...opts4(benar, salah), n, ref, ...extra });

/* ---- data sumber ---- */
const kos = ["ir0", "ir1", "ir2"].flatMap((l) => R(`data/kosakata-${l}.json`));
const bun = ["ir0", "ir1", "ir2"].flatMap((l) => R(`data/bunpou-${l}.json`).map((b) => ({ ...b, lv: l })));
const bank = R("data/jft/bank.json");
const G = R("data/jft/gambar.json");
const pendek = (a) => { let t = String(a).replace(/^\d+\.\s*/, "").split(/[;；(（]/)[0].trim(); if (t.length > 40) t = t.slice(0, 40) + "…"; return t; };
const hasKanji = (s) => /[一-鿿]/.test(s);
const bersih = (w) => w.kata && w.kana && w.arti && w.kata.length <= 8 && !/[～〜（）()／]/.test(w.kata) && !w.kana.includes("／") && !/(です|ます|ました|ません|ですか|ください)$/.test(w.kata) && !/[。、]/.test(w.kata) && !/[?？]/.test(w.arti) && !/[A-Za-z]{4,}/.test(w.kata) && !/[0-9０-９]/.test(w.kata) && !/^(Benar|Ya|Tidak)\b/i.test(w.arti);
const K = kos.filter(bersih), KJ = K.filter((w) => hasKanji(w.kata));
const posKey = (w) => (Array.isArray(w.pos) && w.pos[0]) || "";
const serupa = (w, arr) => { const same = arr.filter((x) => posKey(x) === posKey(w) && x !== w); return same.length >= 12 ? same : arr.filter((x) => x !== w); };
const emoOf = (w) => G.w[w.kata] || G.w[w.kata.replace(/^お/, "")];
const KG = K.filter(emoOf);

/* ---- 1) 文字と語彙 : dari kosakata Irodori, setiap kata dipakai sekali ---- */
const usedW = new Set();
const fresh = (arr) => { for (let t = 0; t < 400; t++) { const w = arr[Math.floor(rnd() * arr.length)]; if (!usedW.has(w.kata)) { usedW.add(w.kata); return w; } } return arr[Math.floor(rnd() * arr.length)]; };
function vocabQ(tipe) {
  if (tipe === "gambar") { const w = fresh(KG), e = emoOf(w); const lain = pick(KG.filter((x) => emoOf(x) !== e), 3); return mk("vocab", "Gambar ini disebut apa dalam bahasa Jepang?", w.kata, lain.map((x) => x.kata), `${e} = ${w.kata}（${w.kana}）`, "Irodori (Kotoba)", { emo: e }); }
  if (tipe === "gambar2") { const w = fresh(KG), e = emoOf(w); const lain = pick(KG.filter((x) => emoOf(x) !== e), 3); return mk("vocab", `「${w.kata}」 yang mana?`, `pic:${e}`, lain.map((x) => `pic:${emoOf(x)}`), `${w.kata} = ${e}`, "Irodori (Kotoba)"); }
  if (tipe === "arti") { const w = fresh(K); const salah = pick(serupa(w, K).filter((x) => pendek(x.arti) !== pendek(w.arti)), 3); return mk("vocab", `「${w.kata}」 artinya…`, pendek(w.arti), salah.map((x) => pendek(x.arti)), `${w.kata}（${w.kana}）= ${pendek(w.arti)}`, "Irodori (Kotoba)"); }
  if (tipe === "baca") { const w = fresh(KJ); const salah = pick(KJ.filter((x) => x.kana !== w.kana), 3); return mk("vocab", `「${w.kata}」 cara bacanya…`, w.kana, salah.map((x) => x.kana), `${w.kata} dibaca ${w.kana}`, "Irodori (Kanji)"); }
  const w = fresh(KJ); const salah = pick(KJ.filter((x) => x.kata !== w.kata), 3); return mk("vocab", `「${w.kana}」 ditulis dengan kanji…`, w.kata, salah.map((x) => x.kata), `${w.kana} = ${w.kata}`, "Irodori (Kanji)");
}
/* ---- 2) 会話と表現 ---- */
const poolConvA = CONV_OK.map((x) => ({ k: "c:" + norm(x[0]), mk: () => mk("conv", x[0], x[1], [x[2], x[3], x[4]], x[5], "Shirose (orisinal)") }));
const poolConvB = bank.conv.map((x) => ({ k: "c:" + norm(x.q), mk: () => mk("conv", x.q, x.o[x.a], x.o.filter((_, i) => i !== x.a), x.n, "Shirose · bank conv") }));
const bunOk = bun.filter((b) => b.contoh && b.arti_contoh && b.pola);
const poolConvC = [];
bunOk.forEach((b) => {
  const lain = bunOk.filter((x) => x.arti_contoh && x.arti_contoh !== b.arti_contoh);
  poolConvC.push({ k: "b:" + norm(b.contoh), mk: () => mk("conv", b.contoh, b.arti_contoh, pick(lain, 3).map((x) => x.arti_contoh), `${strip(b.contoh)} = ${b.arti_contoh} (pola ${strip(b.pola)})`, `Irodori Bunpou ${b.lv}`, { pre: "Arti kalimat ini…", emo: "💬" }) });
  poolConvC.push({ k: "b:" + norm(b.contoh), mk: () => mk("conv", b.contoh, b.pola, pick(bunOk.filter((x) => x.pola !== b.pola), 3).map((x) => x.pola), `${strip(b.pola)}: ${b.penjelasan || b.arti}`, `Irodori Bunpou ${b.lv}`, { pre: "Pola yang dipakai kalimat ini…", emo: "💬" }) });
});
/* ---- 3) 聴解 ---- */
const rapi = (t) => String(t).replace(/^（アナウンス）(男|女)：/, "（アナウンス）");
const poolListA = LISTEN.map((x) => ({ k: "l:" + norm(x[0] + x[1]), mk: () => mk("listening", x[1], x[2], [x[3], x[4], x[5]], x[6], "Shirose (orisinal)", { say: rapi(x[0]), emo: "🎧" }) }));
const poolListB = bank.listen.map((x) => ({ k: "l:" + norm(x.say + x.q), mk: () => mk("listening", x.q, x.o[x.a], x.o.filter((_, i) => i !== x.a), x.n, "Shirose · bank listening", { say: x.say, emo: "🎧" }) }));
const poolListC = [901, 902, 903, 904].flatMap((pk) => R(`choukai/paket/n5-p${pk}.json`).sections.flatMap((s) => s.items)).map((it) => ({
  k: "l:" + it.id, mk: () => { const q = it.qs[0]; return { sec: "listening", q: q.q, o: it.opts, a: q.ans, n: it.exp || "", ref: "Choukai JFT (audio TTS Shirose)", audio: it.audio, say: [it.set + q.q, ...it.dialog.map((l) => (l.s.startsWith("M") ? "男：" : "女：") + l.t), q.q].join("\n"), cid: it.id, emo: "🎧" }; },
}));
/* ---- 4) 読解 : satuan = satu teks + soalnya ---- */
const rd = (fl, qs, k, ref) => ({ k, mk: () => qs.map((x, i) => ({ ...mk("reading", x.q, x.o[x.a], x.o.filter((_, j) => j !== x.a), x.n, ref, { fl }), pid: k })) });
const poolReadA = READ.map(([fl, ...qs]) => ({ k: "r:" + norm(fl.j + fl.s), mk: () => qs.map((x) => ({ ...mk("reading", x[0], x[1], [x[2], x[3], x[4]], x[5], "Shirose (orisinal)", { fl }) })) }));
const poolReadB = bank.read.map((t, i) => ({ k: "r:" + norm(t.fl.j + t.fl.s), mk: () => t.qs.map((x) => mk("reading", x.q, x.o[x.a], x.o.filter((_, j) => j !== x.a), x.n, "Shirose · bank reading", { fl: t.fl })) }));
const babRead = Object.values(bank.bab).flatMap((bl) => bl.flatMap((b) => b));
const seenR = new Set(); const poolReadC = [];
babRead.forEach((t) => { const k = "r:" + norm(t.fl.j + t.fl.s + JSON.stringify(t.fl.r)); if (seenR.has(k)) return; seenR.add(k); poolReadC.push({ k, mk: () => t.qs.map((x) => mk("reading", x.q, x.o[x.a], x.o.filter((_, j) => j !== x.a), x.n, "Irodori (Dokkai)", { fl: t.fl })) }); });

/* ---- pembagian ke paket: tiap sumber punya kuota; urutan diacak, putar lagi bila habis ---- */
function dealer(pool) { let arr = shuffle(pool), i = 0; return (n, taken) => { const out = []; let guard = 0; while (out.length < n && guard++ < pool.length * 3) { if (i >= arr.length) { arr = shuffle(pool); i = 0; } const it = arr[i++]; if (taken.has(it.k)) continue; taken.add(it.k); out.push(it); } return out; }; }
const dConvA = dealer(poolConvA), dConvB = dealer(poolConvB), dConvC = dealer(poolConvC);
const dLA = dealer(poolListA), dLB = dealer(poolListB), dLC = dealer(poolListC);
const dRA = dealer(poolReadA), dRB = dealer(poolReadB), dRC = dealer(poolReadC);
const TEMA = ["Belanja & makan", "Kota & transportasi", "Kantor & kerja", "Kesehatan & rumah sakit", "Rumah & lingkungan", "Informasi umum & pengumuman"];

const paket = [];
for (let p = 0; p < N_PKT; p++) {
  const taken = new Set(), soal = [];
  const tipe = ["arti", "baca", "gambar", "kanji", "gambar2", "baca", "arti", "kanji", "arti", "baca", "gambar", "arti"];
  soal.push(...shuffle(tipe.map((t) => vocabQ(t))));
  const qA = p < 13 ? 3 : 2, qB = p < 17 ? 2 : 1;                         // kuota agar tiap soal pool terpakai ±sekali
  const c = [...dConvA(qA, taken), ...dConvB(qB, taken)]; c.push(...dConvC(14 - c.length, taken));
  soal.push(...shuffle(c.slice(0, 14).map((x) => x.mk())));
  const lB = p < 16 ? 1 : 0, lC = p % 5 === 0 ? 7 : 8;
  const l = [...dLC(lC, taken), ...dLB(lB, taken)]; l.push(...dLA(12 - l.length, taken));
  soal.push(...shuffle(l).slice(0, 12).map((x) => x.mk()));
  // 読解: 6 teks × 2 soal
  const rA = p % 2 ? 2 : 3, rB = p % 2 ? 1 : 0;
  const r = [...dRA(rA, taken), ...dRB(rB, taken)]; r.push(...dRC(6 - r.length, taken));
  r.slice(0, 6).forEach((x, ti) => soal.push(...x.mk().slice(0, 2).map((q) => ({ ...q, pid: ti }))));
  // bila ada kekurangan (pool habis) → lengkapi
  const hit = (s) => soal.filter((x) => x.sec === s).length;
  for (const s of Object.keys(SEC)) if (hit(s) < SEC[s]) console.warn(`paket ${p + 1}: ${s} ${hit(s)}/${SEC[s]}`);
  const urut = ["vocab", "conv", "listening", "reading"];
  const final = urut.flatMap((s) => soal.filter((x) => x.sec === s).slice(0, SEC[s]));
  paket.push({ id: "ft" + String(p + 1).padStart(2, "0"), no: "Full Test " + String(p + 1).padStart(2, "0"), judul: `Full Test ${String(p + 1).padStart(2, "0")} · ${TEMA[p % TEMA.length]}`, menit: 60, soal: final });
}

const f = "data/jft/tryout.json"; const T = R(f);
const asli = T.paket.filter((x) => !String(x.id).startsWith("ft"));
T.paket = [...asli, ...paket];
T.versi = (T.versi || 1) + 0; T.catatan = "Paket 1–3 & Full Test 01–20: soal orisinal/derivat Shirose Nihongo untuk latihan (bukan soal resmi JFT-Basic). Struktur & Can-do mengikuti JFT-Basic A2; skor adalah ESTIMASI internal.";
fs.writeFileSync(f, JSON.stringify(T));
console.log("paket:", T.paket.length, "soal/paket:", paket.map((x) => x.soal.length).join(","));
