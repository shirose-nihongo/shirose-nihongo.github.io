/* =====================================================================
 * MENSETSU — SIMULASI WAWANCARA SUARA (tanpa API AI)
 * Pewawancara berbicara otomatis (speechSynthesis ja-JP), siswa menjawab dengan BICARA (Web Speech API ja-JP) atau mengetik.
 * Giliran & penilaian memakai logika skrip di mensetsu-engine.js (scriptTurn / scoreScript / combine). Furigana: data statis.
 * Route: #mensetsu-sesi/{bidang}
 * ===================================================================== */
import * as EN from "./mensetsu-engine.js";
import { FURI_SKRIP } from "./mensetsu-furi-skrip.js";

let X = null;                                   // {esc, toast, LS, getFB, BIDANG, avatarSvg, setPage, refresh, param}
export function initWawancara(ctx) { X = ctx; }

const RX_FURI = /([㐀-鿿々〆ヶ]+)\[([^\]]+)\]/g;
const strip = (m) => String(m || "").replace(RX_FURI, "$1");
const furiHtml = (m) => X.esc(m).replace(RX_FURI, "<ruby>$1<rt>$2</rt></ruby>");
const ja = (plain, markup) => (W.furi && markup ? furiHtml(markup) : X.esc(plain));
const skripFuri = (t) => FURI_SKRIP[t] || t;

/* ---------------- suara pewawancara ---------------- */
const ttsOk = () => "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
let _tok = 0;
function bicara(text, { slow = false } = {}) {
  return new Promise((res) => {
    const tok = ++_tok;
    if (!ttsOk() || !W.suara) return res();
    try { speechSynthesis.cancel(); } catch (e) {}
    const u = new SpeechSynthesisUtterance(strip(text)); u.lang = "ja-JP"; u.rate = slow ? 0.7 : 0.95;
    const v = speechSynthesis.getVoices().find(x => /^ja/i.test(x.lang)); if (v) u.voice = v;
    let done = false; const fin = () => { if (!done) { done = true; res(); } };
    u.onend = fin; u.onerror = fin;
    setTimeout(fin, 20000);                      // jaga-jaga: bila onend tak pernah datang
    setPhase("speaking");
    try { speechSynthesis.speak(u); } catch (e) { fin(); }
  });
}
function stopTalk() { _tok++; try { ttsOk() && speechSynthesis.cancel(); } catch (e) {} }

/* ---------------- state sesi ---------------- */
const W = { key: null, bank: null, qs: [], idx: 0, turns: [], cur: null, mode: "latihan", chat: [], phase: "idle", run: false,
  furi: true, suara: true, mic: true, bantuan: null, rec: null, interim: "", fu: 0, clar: 0, selesai: null };
const CFG_KEY = "shirose-mensetsu-wawancara";
const cfg = () => Object.assign({ mode: "latihan", n: 6, furi: true, suara: true, mic: true }, X.LS.get(CFG_KEY, {}));

function setPhase(p) {
  W.phase = p;
  const st = document.getElementById("mw-status"); if (st) { st.dataset.ph = p; st.textContent = ({ speaking: "🔊 Pewawancara berbicara…", listening: "🎤 Giliranmu — silakan bicara", thinking: "…", idle: "Siap", done: "Selesai" })[p] || p; }
  const av = document.getElementById("mw-av"); if (av) av.className = "ms-avatar " + ({ speaking: "talk", listening: "listen", thinking: "think" }[p] || "");
  const mic = document.getElementById("mw-mic"); if (mic) mic.classList.toggle("on", p === "listening");
}
function bubble(who, plain, markup, id) { W.chat.push({ who, plain, markup: markup || "", id: id || "" }); paintChat(); }
function paintChat() {
  const box = document.getElementById("mw-chat"); if (!box) return;
  box.innerHTML = W.chat.map(b => `<div class="ms-b ${b.who}"><div class="ms-b-who">${b.who === "ai" ? "面接官" : b.who === "me" ? "Kamu" : ""}</div>
    <div class="ms-b-ja">${ja(b.plain, b.markup)}</div>${b.id && cfg().arti !== false ? `<div class="ms-b-id">${X.esc(b.id)}</div>` : ""}</div>`).join("");
  box.scrollTop = box.scrollHeight;
}

/* ---------------- alur wawancara ---------------- */
async function mulai() {
  const c = cfg(); Object.assign(W, { mode: c.mode, furi: c.furi, suara: c.suara, mic: c.mic && EN.sttSupported() });
  W.qs = EN.planQuestions(W.bank, { mode: c.mode === "lemah" ? "latihan" : c.mode, n: c.n, cats: [] });
  W.idx = 0; W.turns = []; W.chat = []; W.cur = null; W.bantuan = null; W.fu = 0; W.clar = 0; W.selesai = null; W.run = true;
  W.t0 = Date.now(); draw();
  const op = EN.OPENING;
  bubble("ai", op, skripFuri(op), "Baik, kita mulai wawancara. Mohon bantuannya.");
  await bicara(op);
  if (W.run) await tanya(W.qs[0], "");
}
async function tanya(q, awal) {
  if (!W.run || !q) return;
  W.cur = { i: q.i, q: q.ja, a: "", lang: "empty", conf: [] }; W.fu = 0; W.clar = 0; W.bantuan = null; paintHelp();
  const n = `${W.idx + 1}/${W.qs.length}`; const nn = document.getElementById("mw-no"); if (nn) nn.textContent = "Soal " + n;
  if (awal) bubble("ai", awal, skripFuri(awal));
  bubble("ai", q.ja, q.jf, q.id);
  await bicara((awal || "") + q.ja);
  if (W.run) siapDengar();
}
function siapDengar() {
  if (!W.run) return;
  if (W.mic) dengar(); else { setPhase("idle"); const ta = document.getElementById("mw-ta"); ta && ta.focus(); const st = document.getElementById("mw-status"); if (st) st.textContent = "⌨ Ketik jawabanmu lalu tekan Kirim"; }
}
function dengar() {
  if (!EN.sttSupported()) { W.mic = false; return siapDengar(); }
  stopDengar();
  W.interim = ""; setPhase("listening"); paintInterim();
  W.rec = EN.listen({
    lang: "ja-JP",
    onInterim: (t) => { W.interim = t; paintInterim(); },
    onEnd: ({ text, conf }) => { W.rec = null; if (!W.run || W.phase !== "listening") return; if (text) kirim(text, conf); else { setPhase("idle"); const st = document.getElementById("mw-status"); if (st) st.textContent = "Tidak terdengar. Tekan 🎤 untuk coba lagi atau ketik jawabanmu."; } },
    onError: (e) => { if (e === "not-allowed" || e === "service-not-allowed") { W.mic = false; X.toast("Izin mikrofon ditolak — jawab dengan mengetik."); setPhase("idle"); } else if (e === "no-speech" || e === "aborted") { /* biarkan onEnd */ } else if (e === "network") { X.toast("Pengenalan suara butuh internet. Ketik jawabanmu."); } },
  });
}
function stopDengar() { try { W.rec && W.rec.abort(); } catch (e) {} W.rec = null; }
function paintInterim() { const el = document.getElementById("mw-interim"); if (el) el.textContent = W.interim ? "🎙 " + W.interim : ""; }
function paintHelp() {
  const el = document.getElementById("mw-help"); if (!el) return;
  const h = W.bantuan; const q = W.cur && W.bank.byId[W.cur.i];
  el.innerHTML = h && q ? `<div class="ms-help"><b>💡 Contoh jawaban</b>
    <div class="ja">${ja(q.aj, q.ajf)} <button class="btn ghost sm" onclick="MW.sayContoh()">🔊</button></div>
    <div class="ms-b-id">${X.esc(q.ai)}</div>
    <div class="ms-b-id">Kosakata: ${q.v.map(([j, i]) => `<b>${X.esc(j)}</b> ${X.esc(i)}`).join(" · ")}</div></div>` : "";
}

async function kirim(text, conf) {
  text = String(text || "").trim(); if (!text || !W.run || !W.cur) return;
  stopDengar(); setPhase("thinking");
  const ta = document.getElementById("mw-ta"); if (ta) ta.value = "";
  W.interim = ""; paintInterim();
  bubble("me", text);
  W.cur.a = (W.cur.a ? W.cur.a + " " : "") + text; if (typeof conf === "number") W.cur.conf.push(conf);
  const q = W.qs[W.idx], nextQ = W.qs[W.idx + 1];
  const r = EN.scriptTurn({ q, answer: W.cur.a, followupsUsed: W.fu, nextQ, mode: W.mode });
  W.cur.lang = r.lang || EN.classify(W.cur.a).lang;
  if (r.kind === "next") {
    const aiz = nextQ ? r.say.replace(nextQ.ja, "") : r.say;
    W.turns.push(W.cur); W.idx++;
    if (nextQ) return tanya(nextQ, aiz);
    bubble("ai", aiz, skripFuri(aiz)); await bicara(aiz);
    bubble("ai", EN.CLOSE_END, skripFuri(EN.CLOSE_END), "Wawancara hari ini selesai. Terima kasih."); await bicara(EN.CLOSE_END);
    return selesai();
  }
  // tanya-balik / bantuan / klarifikasi: pewawancara bicara lalu siswa menjawab lagi
  if (r.kind === "followup") W.fu++;
  if (r.kind === "clarify") W.clar++;
  if (r.kind === "help") { W.bantuan = r.bantuan || {}; paintHelp(); W.cur.a = ""; }
  if (r.kind === "clarify" && W.clar >= 2) { W.turns.push(W.cur); W.idx++; const nq = W.qs[W.idx]; if (nq) return tanya(nq, "分かりました。次の質問です。"); return selesai(); }
  bubble("ai", r.say, skripFuri(r.say));
  await bicara(r.say);
  if (r.kind === "clarify") W.cur.a = "";
  if (W.run) siapDengar();
}
async function selesai() {
  W.run = false; stopDengar(); setPhase("done");
  const ev = EN.scoreScript(W.turns, W.bank);
  const confs = W.turns.flatMap(t => t.conf || []); const voiceConf = confs.length ? confs.reduce((a, b) => a + b, 0) / confs.length : null;
  const sk = EN.combine(ev, { voiceConf });
  W.selesai = { ev, sk, voiceConf };
  try {
    const FB = X.getFB();
    if (FB && FB.simpanHasilMensetsu && !(FB.isGuestUser && FB.isGuestUser())) {
      await FB.simpanHasilMensetsu({ bidang: W.key, mode: W.mode, sumber: "skrip-suara", total: sk.total, skor: sk, durasi: Math.round((Date.now() - W.t0) / 1000),
        turns: W.turns.map(t => ({ i: t.i, q: t.q, a: t.a, lang: t.lang, skor: (ev.per_soal.find(p => p.id === t.i) || {}).skor })) });
    }
  } catch (e) { console.warn("mensetsu: simpan hasil gagal:", e.message || e); }
  draw();
}

/* ---------------- tampilan ---------------- */
function setupHtml(b) {
  const c = cfg();
  const opt = (v, t, cur) => `<option value="${v}" ${String(cur) === String(v) ? "selected" : ""}>${t}</option>`;
  const stt = EN.sttSupported();
  return `<div class="ms-wrap">
    <div class="ms-crumbs"><a onclick="route('mensetsu')">MENSETSU</a> › <a onclick="route('mensetsu-bidang/${W.key}')">${b.id}</a> › <b>Simulasi suara</b></div>
    <div class="ms-head compact"><div class="jp">${b.jp}</div><h1>🎤 Simulasi wawancara · ${b.id}</h1>
      <p>Pewawancara <b>berbicara</b> dan kamu <b>menjawab dengan bicara</b> — tanpa mengetik. Tanpa AI berbayar.</p></div>
    <section class="ms-panel">
      <div class="ms-row"><label>Mode</label><select onchange="MW.cfg('mode',this.value)">${opt("latihan", "Latihan (ada bantuan & contoh jawaban)", c.mode)}${opt("nyata", "Wawancara sungguhan (tanpa bantuan)", c.mode)}</select></div>
      <div class="ms-row"><label>Jumlah pertanyaan</label><select onchange="MW.cfg('n',+this.value)">${[4, 6, 8, 10].map(n => opt(n, n + " pertanyaan", c.n)).join("")}</select></div>
      <div class="ms-row"><label><input type="checkbox" ${c.furi ? "checked" : ""} onchange="MW.cfg('furi',this.checked)"/> Tampilkan furigana (ふりがな)</label></div>
      <div class="ms-row"><label><input type="checkbox" ${c.suara ? "checked" : ""} onchange="MW.cfg('suara',this.checked)"/> Pewawancara berbicara otomatis</label></div>
      <div class="ms-row"><label><input type="checkbox" ${c.mic && stt ? "checked" : ""} ${stt ? "" : "disabled"} onchange="MW.cfg('mic',this.checked)"/> Jawab dengan suara (mikrofon)</label></div>
      ${stt ? "" : `<p class="ms-note bad">Browser ini tidak mendukung pengenalan suara. Gunakan Chrome / Edge (komputer atau Android). Kamu tetap bisa menjawab dengan mengetik.</p>`}
      ${ttsOk() ? "" : `<p class="ms-note bad">Browser ini tidak punya suara Jepang bawaan — pertanyaan hanya tampil sebagai teks.</p>`}
      <p class="ms-note">Pengenalan suara dilakukan oleh browser (Chrome mengirim audio ke Google) dan butuh internet. Rekaman tidak disimpan — hanya teks jawaban dan nilai.</p>
      <div class="ms-startbox"><button class="btn big" onclick="MW.mulai()">▶ Mulai wawancara — お願いします</button>
        <button class="btn ghost" onclick="route('mensetsu-bidang/${W.key}')">← Kembali</button></div>
    </section></div>`;
}
function roomHtml(b) {
  const terpilih = W.selesai;
  return `<div class="ms-wrap"><div class="ms-room">
    <div class="ms-who" style="--c1:${b.c[0]};--c2:${b.c[1]}">
      <div class="ms-avatar" id="mw-av"><span class="ms-ring"></span>${X.avatarSvg()}</div>
      <div class="ms-who-t"><div class="nm">面接官 <small>pewawancara · ${b.id}</small></div><div class="pos">${b.jp}</div>
        <span class="ms-status" id="mw-status" data-ph="idle">Siap</span></div>
      <div class="ms-meta"><span id="mw-no">Soal ${Math.min(W.idx + 1, W.qs.length)}/${W.qs.length}</span><span class="ms-modepill">${W.mode === "nyata" ? "本番" : "練習"}</span></div>
    </div>
    <div class="ms-chat" id="mw-chat"></div>
    <div id="mw-help"></div>
    ${terpilih ? hasilHtml() : `<div class="ms-input">
      <div class="ms-ctrl">
        ${EN.sttSupported() ? `<button class="ms-mic" id="mw-mic" onclick="MW.mic()" title="Bicara / berhenti">🎤</button>` : ""}
        <span id="mw-interim" class="ms-note"></span>
      </div>
      <textarea id="mw-ta" rows="2" placeholder="Atau ketik jawabanmu di sini (bahasa Jepang)…" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();MW.kirimKetik();}"></textarea>
      <div class="ms-ctrl">
        <button class="btn" onclick="MW.kirimKetik()">➤ Kirim</button>
        <button class="btn ghost" onclick="MW.ulang()">🔁 Ulangi pertanyaan</button>
        ${W.mode === "latihan" ? `<button class="btn ghost" onclick="MW.bantu()">💡 Contoh jawaban</button>` : ""}
        <label class="ck"><input type="checkbox" ${W.furi ? "checked" : ""} onchange="MW.furiToggle(this.checked)"/> Furigana</label>
        <button class="btn ghost danger" onclick="MW.stop()">⏹ Akhiri</button>
      </div></div>`}
  </div></div>`;
}
function hasilHtml() {
  const { ev, sk, voiceConf } = W.selesai; const tot = sk.total;
  const rows = [["Isi jawaban", sk.isi, 25], ["Tata bahasa", sk.tata_bahasa, 20], ["Kosakata", sk.kosakata, 15], ["Kelancaran", sk.kelancaran, 15], ["Kesopanan", sk.kesopanan, 10]];
  if (sk.artikulasi != null) rows.push(["Kejelasan suara (perkiraan)", sk.artikulasi, 15]);
  const li = (a) => (a && a.length ? `<ul class="pp-ul">${a.map(x => `<li>${X.esc(x)}</li>`).join("")}</ul>` : "<p class=\"ms-note\">—</p>");
  const lebih = (ev.jawaban_lebih_baik || []).map(x => { const q = W.qs.find(z => z.ja === x.q) || {}; return `<div class="pp-box"><div class="jp"><b>${ja(x.q, q.jf)}</b></div>
      <div class="ms-b-id">Jawabanmu: ${X.esc(x.versi_siswa || "(kosong)")}</div><div class="jp good2">Contoh: ${ja(x.versi_baik, q.ajf)}</div><div class="ms-b-id">${X.esc(x.arti)}</div></div>`; }).join("");
  return `<section class="ms-panel"><h2>Hasil simulasi</h2>
    <div class="ms-score"><div style="text-align:center"><div style="font-size:54px;font-weight:900">${tot}</div><div class="ms-note">/ 100</div></div>
      <div>${rows.map(([n, v, m]) => `<div style="margin:6px 0"><small>${n} — ${v}/${m}</small><div class="pp-meter"><i style="width:${Math.round(100 * v / m)}%"></i></div></div>`).join("")}</div></div>
    <h4>Yang sudah bagus</h4>${li(ev.kelebihan)}<h4>Yang perlu diperbaiki</h4>${li(ev.kekurangan)}<h4>Saran</h4>${li(ev.saran)}
    ${lebih ? `<h4>Pertanyaan yang perlu dilatih lagi</h4>${lebih}` : ""}
    <p class="ms-note">${X.esc(ev.catatan)}</p>
    <div class="ms-startbox"><button class="btn big" onclick="MW.mulai()">🔁 Ulangi simulasi</button><button class="btn ghost" onclick="route('mensetsu-bidang/${W.key}')">← Kembali ke bidang</button></div></section>`;
}
function draw() {
  const app = document.getElementById("app"); if (!app) return; const b = X.BIDANG[W.key];
  app.innerHTML = W.run || W.selesai ? roomHtml(b) : setupHtml(b);
  if (W.run || W.selesai) { paintChat(); paintHelp(); setPhase(W.phase); }
}

/* ---------------- handler global ---------------- */
const MW = {
  cfg(k, v) { const c = cfg(); c[k] = v; X.LS.set(CFG_KEY, c); },
  mulai() { stopTalk(); stopDengar(); mulai(); },
  kirimKetik() { const ta = document.getElementById("mw-ta"); const t = ta && ta.value.trim(); if (!t) return; stopDengar(); stopTalk(); kirim(t, null); },
  mic() { if (W.phase === "listening") { W.rec && W.rec.stop(); } else if (W.run) { stopTalk(); dengar(); } },
  ulang() { if (!W.run || !W.cur) return; stopDengar(); const q = W.qs[W.idx]; bicara(q.ja).then(() => W.run && siapDengar()); },
  bantu() { W.bantuan = {}; paintHelp(); },
  sayContoh() { const q = W.cur && W.bank.byId[W.cur.i]; if (!q) return; stopDengar(); bicara(q.aj, { slow: true }).then(() => W.run && siapDengar()); },
  furiToggle(on) { W.furi = on; MW.cfg("furi", on); paintChat(); paintHelp(); },
  stop() { stopTalk(); stopDengar(); if (W.turns.length >= 1) { W.run = false; selesai(); } else { W.run = false; W.selesai = null; setPhase("idle"); draw(); } },
};
window.MW = MW;
window.addEventListener("hashchange", () => { if (!/^mensetsu-sesi/.test(location.hash.slice(1))) { W.run = false; stopTalk(); stopDengar(); } });
window.addEventListener("pagehide", () => { stopTalk(); stopDengar(); });

export async function renderSesi(p) {
  const key = X.param(p); const b = X.BIDANG[key];
  if (!b) { setTimeout(() => route("mensetsu"), 0); return '<div class="loading">Memuat…</div>'; }
  const bank = await EN.loadBank(key).catch(() => null);
  if (!bank) return `<div class="ms-wrap"><div class="ms-panel"><h2>Bank soal belum tersedia</h2><button class="btn" onclick="route('mensetsu')">← Kembali</button></div></div>`;
  if (W.key !== key) { W.run = false; W.selesai = null; W.chat = []; W.turns = []; }
  W.key = key; W.bank = bank; stopTalk(); stopDengar();
  if (!W.run && !W.selesai) return setupHtml(b);
  return roomHtml(b);
}
