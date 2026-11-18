/* KOSAKATA BERBASIS KANJI (N5-N1; struktur data Kanji tiap level sama)
 *
 * Aturan: Kanji satuan = indeks/pengelompokan (tidak otomatis jadi kartu). Kosakata contoh (field `c` di data/kanji-<lv>.json)
 * = materi hafalan, flashcard, dan latihan. Modul ini murni (tanpa DOM) supaya bisa dites di Node.
 *
 * Identitas kartu (kunci SRS):
 *  - kosakata yang juga ada di data/kosakata-<lv>.json  -> "k:<no>"   (kartu & progres LAMA dipakai ulang, tanpa duplikat)
 *  - kosakata contoh yang hanya ada di data Kanji        -> "kv:<kata>" (kunci baru, stabil, tidak bentrok)
 * Satu kata yang dipakai beberapa Kanji utama tetap satu entri (satu kunci, satu kartu).
 */

const KANJI_RE = /[㐀-䶿一-鿿豈-﫿々]/;
const WRITABLE_RE = /[㐀-䶿一-鿿豈-﫿]/;     // 々 (tanda ulang) tidak punya goresan sendiri
export const isKanjiChar = (ch) => KANJI_RE.test(ch);
export const cleanKata = (k) => String(k || "").replace(/\[[^\]]*\]/g, "").trim();
const kanjiOf = (it) => it.kanji || it.k || "";
const noOf = (it, idx) => (Number.isFinite(it?.no) ? it.no : idx + 1);

/** Bangun indeks kosakata dari daftar Kanji (+ daftar kosakata level yang sama untuk menautkan identitas lama). */
export function buildKanjiVocab(kanjiList, kosakataList = []) {
  const kos = new Map();
  (kosakataList || []).forEach((it, idx) => {
    const k = cleanKata(it.kata || it.k);
    if (k && !kos.has(k)) kos.set(k, { it, no: noOf(it, idx) });
  });

  const byKata = new Map();        // kata -> entri (unik)
  const perKanji = [];             // idx kanji -> [entri]  (urutan sesuai data, tanpa duplikat dalam satu kanji)
  (kanjiList || []).forEach((kj, ki) => {
    const main = kanjiOf(kj);
    const list = [];
    (kj.c || []).forEach((c) => {
      const kata = cleanKata(c.k);
      if (!kata || !Array.from(kata).some(isKanjiChar)) return;     // wajib mengandung kanji
      // Kanji utama yang TIDAK tercantum sebagai kata di `c` tidak pernah jadi kartu (mis. 駐, 政).
      // Kata satu-kanji yang memang dicantumkan database sebagai contoh kosakata (昔 むかし, 猫 ねこ, 米 こめ)
      // adalah kata utuh dengan bacaan & arti sendiri -> boleh jadi kartu.
      let e = byKata.get(kata);
      if (!e) {
        const link = kos.get(kata);
        const src = link && link.it;
        e = {
          kata,
          kana: c.r || (src && (src.kana || src.f)) || "",
          arti: c.a || (src && (src.arti || src.a)) || "",
          kosNo: link ? link.no : null,
          key: link ? "k:" + link.no : "kv:" + kata,
          chars: Array.from(kata).filter((ch) => WRITABLE_RE.test(ch)),
          src: src || null,                 // baris kosakata yang tertaut (kalimat contoh, dll.)
          kanji: [],
        };
        byKata.set(kata, e);
      }
      if (!e.kanji.includes(main)) e.kanji.push(main);
      if (!list.includes(e)) list.push(e);
    });
    perKanji[ki] = list;
  });

  // Kata dari tabel kosakata level yang memuat Kanji utama level ini (belum ada di `c`) ikut dihubungkan.
  // Identitasnya tetap baris kosakata aslinya (kunci k:<no>) -> tidak ada kartu ganda, progres lama dipakai ulang.
  const mainIdx = new Map();
  (kanjiList || []).forEach((kj, ki) => { const m = kanjiOf(kj); if (m) (mainIdx.get(m) || mainIdx.set(m, []).get(m)).push(ki); });
  (kosakataList || []).forEach((it, i) => {
    const kata = cleanKata(it.kata || it.k);
    if (!kata || byKata.has(kata) || !Array.from(kata).some((ch) => mainIdx.has(ch))) return;
    const kana = it.kana || it.f || "", arti = it.arti || it.a || "";
    if (!kana || !arti) return;                                     // kartu wajib punya bacaan & arti
    const no = noOf(it, i);
    byKata.set(kata, { kata, kana, arti, kosNo: no, key: "k:" + no, chars: Array.from(kata).filter((ch) => WRITABLE_RE.test(ch)), src: it, kanji: [], extra: true });
  });
  // Satu kata yang memuat beberapa Kanji utama = SATU entri, muncul di daftar setiap Kanji utamanya.
  const vocab = Array.from(byKata.values());
  vocab.forEach((v, i) => {
    v.id = i + 1;
    for (const ch of new Set(Array.from(v.kata))) {
      const kis = mainIdx.get(ch); if (!kis) continue;
      if (!v.kanji.includes(ch)) v.kanji.push(ch);
      for (const ki of kis) if (!perKanji[ki].includes(v)) perKanji[ki].push(v);
    }
  });
  // Kanji yang BENAR-BENAR belum punya kosakata di database: kartunya = Kanji itu sendiri (bacaan on/kun + arti).
  // Kunci terpisah "kj:<kanji>" (tidak bentrok dengan kartu Kanji lama k:<no>). Hanya sebagai cadangan.
  const tidyRd = (s) => String(s || "").replace(/[.\-]/g, "").trim();
  (kanjiList || []).forEach((kj, ki) => {
    if (perKanji[ki].length) return;
    const main = kanjiOf(kj), arti = kj.arti || kj.a || "";
    const kana = [tidyRd(kj.on || kj.onyomi), tidyRd(kj.kun || kj.kunyomi)].filter(Boolean).join(" / ");
    if (!main || !arti || !kana) return;
    let e = byKata.get(main);
    if (!e) {
      e = { kata: main, kana, arti, kosNo: null, key: "kj:" + main, chars: Array.from(main).filter((ch) => WRITABLE_RE.test(ch)), src: null, kanji: [main], fallback: true, id: vocab.length + 1 };
      byKata.set(main, e); vocab.push(e);
    }
    perKanji[ki].push(e);
  });
  return { vocab, perKanji, byKata };
}

/** Kartu flashcard untuk mesin hafalan lama (tipe "kosakata" supaya semua mode & tampilan tetap bekerja). */
export function vocabToCard(v) {
  return {
    tipe: "kosakata", idx: (v.kosNo != null ? v.kosNo - 1 : v.id - 1),
    no: v.id,   // nomor tampilan 1..n (identitas progres = skey)
    skey: v.key, kv: true,
    front: v.kata, fraw: v.kata, fr: "", reading: v.kana, back: v.arti,
    pos: undefined, src: undefined, kimg: "",
    kanjiMain: v.kanji, fb: !!v.fallback,
  };
}

/** Semua kartu kosakata-kanji, tanpa duplikat kunci. */
export function kanjiVocabCards(idx) {
  const seen = new Set(), out = [];
  for (const v of idx.vocab) { if (seen.has(v.key)) continue; seen.add(v.key); out.push(vocabToCard(v)); }
  return out;
}

/** Pembuat opsi acak untuk latihan membaca / arti (pengecoh diambil dari kosakata lain). */
export function makeChoices(idx, v, field, n = 4, rnd = Math.random) {
  const pool = idx.vocab.filter((x) => x.kata !== v.kata && x[field] && x[field] !== v[field]);
  const picks = [];
  const used = new Set([v[field]]);
  while (picks.length < n - 1 && pool.length) {
    const x = pool[Math.floor(rnd() * pool.length)];
    if (used.has(x[field])) { if (used.size > pool.length) break; continue; }
    used.add(x[field]); picks.push(x[field]);
  }
  const all = picks.concat([v[field]]);
  for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
  return all;
}
