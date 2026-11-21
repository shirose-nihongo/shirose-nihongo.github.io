#!/usr/bin/env node
/* Naskah audio VOICEVOX untuk soal listening Tryout JFT (data/jft/tryout.json).
 * Soal yang belum punya "audio" dibuatkan paket choukai/paket/n5-p905.json (naskah + suara)
 * dan field audio di tryout.json. MP3-nya dibuat otomatis oleh voice-pack.yml (GitHub Actions).
 * Suara: narator aoyama; perempuan acak mochiko/goki/nana; laki-laki acak kurita/sourin (No.7 = suara anak, tidak dipakai).
 * Aman dijalankan ulang: soal yang sudah punya audio dilewati. */
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, ".."), TRY = path.join(ROOT, "data/jft/tryout.json"), OUT = path.join(ROOT, "choukai/paket/n5-p905.json");
const FEMALE = ["mochiko", "goki", "nana"], MALE = ["kurita", "sourin"];
const hash = (s) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0; return h; };
const t = JSON.parse(fs.readFileSync(TRY, "utf8"));
const old = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : null;
const items = old ? old.sections[0].items : [];
const have = new Map(items.map((i) => [i.id, i]));
t.paket.forEach((pk, pi) => {
  let n = 0;
  pk.soal.forEach((x) => {
    if (x.sec !== "listening") return;
    n++;
    if (x.audio) return;
    const id = `jft-try-${String(pi + 1).padStart(2, "0")}-${String(n).padStart(2, "0")}`;
    const lines = x.say.split("\n").map((s) => s.trim()).filter(Boolean).map((l) => {
      let m = /^(男|女)：(.*)$/.exec(l);
      if (m) return { s: m[1] === "男" ? "M" : "F", t: m[2] };
      return { s: "F", t: l.replace(/^（[^）]*）/, "") };   // pengumuman/siaran: suara perempuan
    });
    const h = hash(id);
    const voices = { N: "aoyama", F: FEMALE[h % FEMALE.length], M: MALE[(h >> 3) % MALE.length] };
    const used = [...new Set(lines.map((l) => l.s))];
    const audio = `audio/choukai/jft/try/${id}.mp3`;
    const it = { id, no: n, audio, q: x.q, script: [{ s: "N", t: x.q }, ...lines, { s: "N", t: x.q }],
      voices: Object.fromEntries(["N", ...used].map((r) => [r, voices[r]])) };
    if (!have.has(id)) { items.push(it); have.set(id, it); }
    x.audio = audio;
  });
});
const data = { level: "n5", paket: 905, jft: true, title: "JFT Tryout · naskah audio listening",
  karakter: "Audio listening Tryout JFT-Basic (data/jft/tryout.json)",
  sections: [{ mondai: 1, type: "kadai", jp: "課題理解", romaji: "JFT Listening", desc: "JFT-Basic Listening",
    instr: "これから 会話を 聞きます。質問を よく 聞いて、いちばん いい ものを 選んで ください。",
    instrVoice: "aoyama", instrAudio: "audio/choukai/jft/instr.mp3", items }] };
fs.writeFileSync(OUT, JSON.stringify(data));
fs.writeFileSync(TRY, JSON.stringify(t));
console.log("soal baru dibuatkan audio:", items.length);
