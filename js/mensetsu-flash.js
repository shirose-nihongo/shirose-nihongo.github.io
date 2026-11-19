/* =====================================================================
 * MENSETSU 面接 — FLASHCARD  (#mensetsu-flash/{bidang})
 * Depan: pertanyaan wawancara (JP + furigana). Ketuk → belakang: terjemah, contoh jawaban JP + arti, jawabanmu (bila ada), suara.
 * Hadiah: 30 XP + 1 koin tiap kartu "Hafal" (10× XP flashcard biasa = 3 XP), sekali per kartu per hari.
 * ===================================================================== */
import * as EN from "./mensetsu-engine.js";
import { getX, bayar, qj, ajh, ttsPlay, ttsStop, loadPrep, aktif } from "./mensetsu-prep.js?v=20261119k";

export const XP_FLASH = 30, KOIN_FLASH = 2;   // XP flashcard biasa = 3 per kartu benar → ×10
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
let F = null;   // { key, bank, deck, i, open, ok, ulang, cat, prep }
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const crumbs = (key, t) => { const X = getX(); return `<div class="ms-crumbs"><a onclick="route('mensetsu')">MENSETSU</a> › <a onclick="route('mensetsu-bidang/${key}')">${esc(X.BIDANG[key].id)}</a> › <b>${t}</b></div>`; };
function bangun(cat) {
  F.cat = cat; const ids = F.bank.soal.filter(q => cat === "all" || q.k === cat).map(q => q.i);
  F.deck = shuffle(ids); F.i = 0; F.open = false; F.ok = 0; F.ulang = 0; F.selesai = false;
}
const qOf = (id) => F.bank.soal.find(q => q.i === id);

export async function renderFlash(p) {
  const X = getX(), key = X.param(p);
  if (!X.BIDANG[key]) { setTimeout(() => route("mensetsu"), 0); return '<div class="loading">Memuat…</div>'; }
  X.setPage(renderFlash, p);
  if (!F || F.key !== key) {
    const bank = await EN.loadBank(key).catch(() => null);
    if (!bank) return `<div class="ms-wrap"><div class="ms-panel"><h2>Bank soal belum tersedia</h2><button class="btn" onclick="route('mensetsu')">← Kembali</button></div></div>`;
    F = { key, bank, prep: null }; try { F.prep = (await loadPrep(key, bank)).data; } catch (e) {}
    bangun("all");
  }
  return tampil();
}
function tampil() {
  const X = getX(), key = F.key, b = X.BIDANG[key];
  const chips = [["all", "Semua"], ...EN.CATS.map(c => [c.k, c.jp])].map(([k, l]) => `<button class="ms-chip ${F.cat === k ? "on" : ""}" onclick="MF.kat('${k}')">${l}</button>`).join("");
  const head = `<div class="ms-wrap pp">${crumbs(key, "Flashcard")}
    <div class="ms-head compact"><div class="jp">単語帳</div><h1>Flashcard — ${esc(b.id)}</h1>
    <p>Ketuk kartu untuk membuka jawaban. Tiap kartu <b>Hafal</b> = <b>+${XP_FLASH} XP</b> &amp; +${KOIN_FLASH} 🪙 (10× flashcard biasa; sekali per kartu per hari).</p></div>
    <div class="pp-fil" style="margin:6px 0 10px">${chips}</div>`;
  const foot = `<div class="ms-actions"><button class="btn ghost" onclick="MF.acak()">🔀 Acak ulang</button><button class="btn ghost" onclick="route('mensetsu-bidang/${key}')">← Kembali</button></div></div>`;
  if (!F.deck.length) return head + `<section class="ms-panel"><p>Tidak ada kartu di kategori ini.</p></section>` + foot;
  if (F.selesai || F.i >= F.deck.length) {
    return head + `<section class="ms-panel mf-done"><h2>🎉 Selesai!</h2><p>${F.ok} kartu hafal${F.ulang ? " · " + F.ulang + " kali diulang" : ""}.</p>
      <div class="pp-act"><button class="btn big" onclick="MF.acak()">🔁 Main lagi</button><button class="btn ghost" onclick="route('mensetsu-persiapan/${key}')">✍️ Persiapan jawaban</button></div></section>` + foot;
  }
  const q = qOf(F.deck[F.i]), mine = F.prep && F.prep.answers && F.prep.answers[q.i]; const mineT = mine ? aktif(mine) : "";
  const cat = EN.CATS.find(c => c.k === q.k);
  const depan = `<div class="mf-cat">${esc(cat ? cat.jp + " · " + cat.id : "")}</div><div class="mf-q jp">${qj(q)}</div>
    <div class="mf-hint">Ketuk untuk melihat jawaban</div>`;
  const belakang = `<div class="mf-cat">${esc(cat ? cat.jp : "")}</div><div class="mf-q sm jp">${qj(q)}</div><div class="ms-note">${esc(q.id || "")}</div><hr/>
    <div class="mf-lbl">Contoh jawaban</div><p class="jp">${ajh(q)}</p><p class="ms-note">${esc(q.ai || "")}</p>
    ${mineT ? `<div class="mf-lbl">Jawabanmu</div><p class="jp">${esc(mineT)}</p>` : ""}
    <div class="mf-snd"><button class="btn ghost sm" onclick="event.stopPropagation();MF.suara('q')">🔊 Pertanyaan</button><button class="btn ghost sm" onclick="event.stopPropagation();MF.suara('a')">🔊 Jawaban</button></div>`;
  return head + `<div class="mf-pos">${F.i + 1} / ${F.deck.length} · ✅ ${F.ok}</div>
    <div class="mf-card ${F.open ? "open" : ""}" onclick="MF.balik()">${F.open ? belakang : depan}</div>
    ${F.open ? `<div class="mf-btns"><button class="btn ghost big" onclick="MF.nilai(false)">🔁 Ulangi lagi</button><button class="btn big" onclick="MF.nilai(true)">✅ Hafal · +${XP_FLASH} XP</button></div>` : `<div class="mf-btns"><button class="btn big" onclick="MF.balik()">Lihat jawaban</button></div>`}` + foot;
}
async function ulangRender() { const h = tampil(); const app = document.getElementById("app"); if (app) app.innerHTML = h; }
const MF = window.MF = {
  balik() { ttsStop(); F.open = !F.open; ulangRender(); },
  kat(k) { ttsStop(); bangun(k); ulangRender(); },
  acak() { ttsStop(); bangun(F.cat); ulangRender(); },
  suara(w) { const q = qOf(F.deck[F.i]); ttsPlay(w === "q" ? q.ja : q.aj, "mf"); },
  nilai(hafal) {
    ttsStop(); const id = F.deck[F.i];
    if (hafal) { F.ok++; bayar("flash", F.key, id, XP_FLASH, KOIN_FLASH, { harian: true, cap: 100 }); }
    else { F.ulang++; F.deck.push(id); }   // kartu yang belum hafal muncul lagi di akhir
    F.i++; F.open = false; ulangRender();
  },
};
export const FLASH_ROUTES = { "mensetsu-flash": (p) => renderFlash(p) };
