/* Halaman Gacha (#gacha). RNG & potong koin di server (cloudflare/gacha-worker.js). Klien hanya menampilkan hasil. */
import { CONFIG } from "../cloudflare/gacha-core.js";
import { ITEMS } from "../cloudflare/gacha-items.js";
export const GACHA_URL = ""; // ⚠ isi URL Worker setelah di-deploy (docs/EKONOMI-GACHA.md), mis. https://shirose-gacha.<akun>.workers.dev
let FB = null;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const RAR = { common: ["Common", "#9aa0a6"], uncommon: ["Uncommon", "#5bd16b"], rare: ["Rare", "#4aa3ff"], epic: ["Epic", "#b266ff"], legendary: ["Legendary", "#ffb703"], mythic: ["Mythic", "#ff4d94"] };
const NAMA = Object.fromEntries(ITEMS.map(x => [x.id, (x.kind === "theme" ? "🎨 " : "") + x.nama]));
const S = () => window.__SHIROSE_STATE || {};
let last = null, busy = false;
export function initGacha(fb) { FB = fb; }
async function render() {
  const st = S();
  if (!st.user) { setTimeout(() => route("login"), 0); return '<div class="loading">Memuat…</div>'; }
  const g = (FB && FB.getGachaState ? await FB.getGachaState() : null) || { sinceEpic: 0, sinceLegend: 0, inv: [] };
  const inv = g.inv || [];
  const items = Object.entries(CONFIG.POOL).flatMap(([r, a]) => a.map(i => ({ i, r }))).sort((x, y) => ["common","uncommon","rare","epic","legendary","mythic"].indexOf(y.r) - ["common","uncommon","rare","epic","legendary","mythic"].indexOf(x.r));
  const koleksi = items.map(({ i, r }) => `<span style="display:inline-block;margin:3px;padding:5px 9px;border-radius:10px;border:1px solid ${RAR[r][1]};color:${inv.includes(i) ? RAR[r][1] : "#666"};opacity:${inv.includes(i) ? 1 : .5};font-size:12px;">${inv.includes(i) ? "" : "🔒 "}${esc(NAMA[i] || i)}</span>`).join("");
  const hasil = last ? `<div class="panel" style="margin-top:12px;"><h3>Hasil tarikan</h3>${last.results.map(x => `<div style="padding:6px 0;border-bottom:1px solid var(--border,#333);color:${RAR[x.rarity][1]};"><b>${RAR[x.rarity][0]}</b> · ${esc(NAMA[x.item] || x.item)}${x.dup ? ' <small style="color:var(--gray);">(duplikat → +' + CONFIG.DUP_REFUND[x.rarity] + ' 🪙)</small>' : " ✨ baru!"}</div>`).join("")}</div>` : "";
  const aktif = !!GACHA_URL;
  return `<div class="panel"><h1>🎰 Gacha</h1>
    <p>Saldo: <b>${(st.gami?.koin || 0).toLocaleString("id-ID")} 🪙</b> (dompet satu untuk semua fitur)</p>
    <p style="font-size:12px;color:var(--gray);">Pity: epic+ dijamin ≤ ${CONFIG.PITY_EPIC} tarikan (sekarang ${g.sinceEpic || 0}) · legendary+ dijamin ≤ ${CONFIG.PITY_LEGENDARY} (sekarang ${g.sinceLegend || 0}). Hasil diundi di server.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin:12px 0;">
      <button class="btn" ${busy ? "disabled" : ""} onclick="GACHA.tarik(1)">Tarik ×1 · ${CONFIG.PRICE_1.toLocaleString("id-ID")} 🪙</button>
      <button class="btn gold" ${busy ? "disabled" : ""} onclick="GACHA.tarik(10)">Tarik ×10 · ${CONFIG.PRICE_10.toLocaleString("id-ID")} 🪙</button></div>
    <p style="font-size:11px;color:var(--gray);">Peluang: ${CONFIG.RARITY.map(r => RAR[r.id][0] + " " + r.pct + "%").join(" · ")}</p>
    ${aktif ? "" : '<p style="color:#ffb703;">⚠ Server gacha belum aktif.</p>'}</div>${hasil}
    <div class="panel" style="margin-top:12px;"><h3>Koleksi (${items.filter(x => inv.includes(x.i)).length}/${items.length})</h3>${koleksi}</div>`;
}
window.GACHA = {
  async tarik(n) {
    if (busy) return; if (!GACHA_URL) { if (window.toast) window.toast("Server gacha belum aktif"); return; } busy = true;
    try {
      const tok = await FB.getIdToken();
      const r = await fetch(GACHA_URL, { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + tok }, body: JSON.stringify({ n }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Gagal");
      last = j; if (window.__SHIROSE_STATE) window.__SHIROSE_STATE.gami.koin = j.koin;
      try { const gs = await FB.getGachaState(); if (window.SHIROSE_THEME) window.SHIROSE_THEME.setOwned(gs && gs.inv || []); } catch (e) {}
      const c = document.getElementById("chip-coin"); if (c) c.textContent = j.koin;
    } catch (e) { if (window.toast) window.toast("❌ " + (e.message || e)); }
    busy = false; route("gacha");
  },
};
export const GACHA_ROUTES = { gacha: () => render() };
