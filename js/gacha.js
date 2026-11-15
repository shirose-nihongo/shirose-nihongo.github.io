/* Halaman Gacha (#gacha). RNG & potong koin di server (cloudflare/gacha-worker.js). Klien hanya menampilkan hasil. */
import { CONFIG, CONFIG_FREE, rollMany } from "../cloudflare/gacha-core.js";
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
  const ORD = ["mythic", "legendary", "epic", "rare", "uncommon", "common"];
  const byId = Object.fromEntries(ITEMS.map(x => [x.id, x]));
  const pctOf = Object.fromEntries(CONFIG.RARITY.map(r => [r.id, r.pct]));
  const fmt = (n) => (n >= 1 ? n.toFixed(2) : n >= 0.1 ? n.toFixed(3) : n.toFixed(4)).replace(/\.?0+$/, "") + "%";
  const IKON = { rambut: "💇", pakaian: "👕", sepatu: "👟", aksesori: "🎩", item_tangan: "⚔️", aura: "✨" };
  const tabelRate = ORD.map(r => { const n = (CONFIG.POOL[r] || []).length; return `<tr><td style="color:${RAR[r][1]};font-weight:800;">${RAR[r][0]}</td><td><div style="background:#8883;border-radius:6px;height:8px;min-width:90px;"><div style="width:${Math.min(100, pctOf[r] * 2.2)}%;height:100%;border-radius:6px;background:${RAR[r][1]};"></div></div></td><td><b>${fmt(pctOf[r])}</b></td><td>${n} item</td><td>${n ? fmt(pctOf[r] / n) : "–"}</td></tr>`; }).join("");
  const galeri = ORD.map(r => { const a = CONFIG.POOL[r] || []; if (!a.length) return "";
    return `<h4 style="margin:14px 0 6px;color:${RAR[r][1]};">${RAR[r][0]} · ${fmt(pctOf[r])} <small style="color:var(--gray);">(${a.length} item, tiap item ≈ ${fmt(pctOf[r] / a.length)})</small></h4><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;">` + a.map(i => { const x = byId[i] || {}, own = inv.includes(i) || (st.siswa?.karakter?.inventory || []).includes(i), th = x.kind === "theme";
      return `<div style="padding:10px;border-radius:12px;border:1px solid ${RAR[r][1]};opacity:${own ? 1 : .92};${own ? "" : "filter:saturate(.8);"}"><div style="font-size:22px;">${th ? "🎨" : IKON[String(x.kat || "").toLowerCase().replace(/ /g, "_")] || "🎁"}</div><div style="font-weight:700;font-size:13px;margin:4px 0;">${esc(x.nama || i)}</div><div style="font-size:11px;color:var(--gray);">${th ? "Tema tampilan" : esc(x.kat || "Barang shop")}${x.harga ? " · 🪙 " + x.harga.toLocaleString("id-ID") : ""}</div><div style="font-size:11px;margin-top:3px;">≈ ${fmt(pctOf[r] / a.length)} per tarikan</div>${own ? '<div style="font-size:11px;color:#3cc878;margin-top:3px;">✓ Dimiliki</div>' : ""}${th ? `<button class="btn ghost" style="margin-top:6px;padding:4px 8px;font-size:12px;" onclick="SHIROSE_THEME.preview('${i.slice(6)}')">👀 Pratinjau</button>` : ""}</div>`; }).join("") + "</div>"; }).join("");
  const hasil = last ? `<div class="panel" style="margin-top:12px;"><h3>Hasil tarikan</h3>${last.results.map(x => `<div style="padding:6px 0;border-bottom:1px solid var(--border,#333);color:${RAR[x.rarity][1]};"><b>${RAR[x.rarity][0]}</b> · ${esc(NAMA[x.item] || x.item)}${x.dup ? ' <small style="color:var(--gray);">(duplikat → +' + CONFIG.DUP_REFUND[x.rarity] + ' 🪙)</small>' : " ✨ baru!"}</div>`).join("")}</div>` : "";
  const aktif = true;
  return `<div class="panel"><h1>🎰 Gacha</h1>
    <p>Saldo: <b>${(st.gami?.koin || 0).toLocaleString("id-ID")} 🪙</b> (dompet satu untuk semua fitur)</p>
    <p style="font-size:12px;color:var(--gray);">Pity: epic+ dijamin ≤ ${CONFIG.PITY_EPIC} tarikan (sekarang ${g.sinceEpic || 0}) · legendary+ dijamin ≤ ${CONFIG.PITY_LEGENDARY} (sekarang ${g.sinceLegend || 0}). Hasil diundi di server.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin:12px 0;">
      <button class="btn" ${busy ? "disabled" : ""} onclick="GACHA.tarik(1)">Tarik ×1 · ${CONFIG.PRICE_1.toLocaleString("id-ID")} 🪙</button>
      <button class="btn gold" ${busy ? "disabled" : ""} onclick="GACHA.tarik(10)">Tarik ×10 · ${CONFIG.PRICE_10.toLocaleString("id-ID")} 🪙</button></div>
    ${FB.hasUnlimitedCoins && FB.hasUnlimitedCoins() ? '<p style="font-size:12px;color:#ffb703;">🛡️ Akun moderator: tarik GRATIS, tapi peluang lebih rendah (Epic 1.3% · Legendary 0.19% · Mythic 0.01%) dan tanpa pity.</p>' : ""}<p style="font-size:11px;color:var(--gray);">Peluang: ${CONFIG.RARITY.map(r => RAR[r.id][0] + " " + r.pct + "%").join(" · ")}</p>
    ${GACHA_URL ? "" : '<p style="font-size:11px;color:var(--gray);">Mode sementara: undian dijalankan di perangkat (server gacha belum dipasang).</p>'}</div>${hasil}
    <div class="panel" style="margin-top:12px;"><h3>📊 Peluang per kelangkaan</h3><div class="table-wrap"><table><thead><tr><th>Rarity</th><th></th><th>Peluang</th><th>Isi</th><th>Per item</th></tr></thead><tbody>${tabelRate}</tbody></table></div><p style="font-size:11px;color:var(--gray);margin-top:6px;">Peluang dasar per tarikan (angka bisa sedikit lebih tinggi untuk epic ke atas karena pity). Item yang sudah dimiliki diganti koin. Tema hanya ada di Epic &amp; Legendary.</p></div>
    <div class="panel" style="margin-top:12px;"><h3>🎁 Semua hadiah (${items.length}) — dimiliki ${items.filter(x => inv.includes(x.i) || (st.siswa?.karakter?.inventory || []).includes(x.i)).length}</h3>${galeri}</div>`;
}

/* ===== Animasi mesin slot ===== */
const ORDR = ["mythic", "legendary", "epic", "rare", "uncommon", "common"];
const SYM = { common: "🍒", uncommon: "🍋", rare: "🔔", epic: "💎", legendary: "7️⃣", mythic: "👑" };
const FILL = ["🍒", "🍋", "🔔", "💎", "7️⃣", "👑", "🍀", "⭐"];
const rnd = (a) => a[Math.floor(Math.random() * a.length)];
/* Kombinasi mengikuti hasil undian ASLI (peluang tidak berubah): 2 sama = common/uncommon, 3 sama = rare ke atas */
function pola(r) {
  const s = SYM[r];
  if (r === "common" || r === "uncommon") { const o = rnd(FILL.filter(x => x !== s && x !== SYM.epic && x !== SYM.legendary && x !== SYM.mythic)); const a = [s, s, o]; const p = Math.floor(Math.random() * 3); [a[p], a[2]] = [a[2], a[p]]; return a; }
  return [s, s, s];
}
function kartuHadiah(x) { const c = RAR[x.rarity][1]; return `<div class="gfx-card" style="border-color:${c};box-shadow:0 0 22px ${c}66;"><div style="color:${c};font-weight:900;letter-spacing:.08em;font-size:12px;">${RAR[x.rarity][0].toUpperCase()}</div><div style="font-size:15px;font-weight:800;margin:4px 0;">${esc(NAMA[x.item] || x.item)}</div>${x.dup ? `<div style="font-size:11px;color:#bbb;">Duplikat → +${CONFIG.DUP_REFUND[x.rarity]} 🪙</div>` : '<div style="font-size:11px;color:#3cc878;">✨ Baru!</div>'}</div>`; }
function playSlot(res) {
  return new Promise((done) => {
    const list = res.results.slice().sort((a, b) => ORDR.indexOf(a.rarity) - ORDR.indexOf(b.rarity)), best = list[0], target = pola(best.rarity), c = RAR[best.rarity][1];
    const o = document.createElement("div"); o.id = "gfx";
    o.innerHTML = `<style>#gfx{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.82);display:flex;align-items:center;justify-content:center;padding:14px;overflow:auto;color:#fff}
#gfx .box{width:min(560px,100%);text-align:center}#gfx .reels{display:flex;gap:10px;justify-content:center;margin:16px 0;padding:16px;border-radius:18px;background:linear-gradient(#222,#111);border:3px solid #ffd166;box-shadow:0 0 30px #ffd16655 inset}
#gfx .reel{width:88px;height:96px;border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:52px;color:#000;box-shadow:inset 0 0 14px #0005;transition:transform .15s}
#gfx .reel.spin{filter:blur(1.2px);animation:gfxShake .12s infinite}@keyframes gfxShake{50%{transform:translateY(5px)}}
#gfx .reel.lock{animation:gfxPop .35s}@keyframes gfxPop{40%{transform:scale(1.18)}}
#gfx .win{animation:gfxWin .9s infinite}@keyframes gfxWin{50%{box-shadow:0 0 34px 8px var(--c)}}
#gfx .gfx-card{display:inline-block;min-width:200px;margin:6px;padding:12px 16px;border-radius:14px;border:2px solid;background:#161616}
#gfx .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:4px}
#gfx button{background:#fff;color:#111;border:0;border-radius:10px;padding:9px 18px;font-weight:800;cursor:pointer;margin:6px}
#gfx .conf{position:fixed;top:-20px;font-size:22px;animation:gfxFall linear forwards;pointer-events:none}@keyframes gfxFall{to{transform:translateY(110vh) rotate(360deg);opacity:.9}}</style>
<div class="box"><div style="font-size:14px;letter-spacing:.2em;opacity:.8;">🎰 GACHA ${res.results.length > 1 ? "×" + res.results.length : ""}</div>
<div class="reels" id="gfx-reels"><div class="reel spin">?</div><div class="reel spin">?</div><div class="reel spin">?</div></div>
<div id="gfx-out" style="min-height:120px;"></div><div id="gfx-btn"><button id="gfx-skip">Lewati ⏭</button></div></div>`;
    document.body.appendChild(o);
    const reels = [...o.querySelectorAll(".reel")], tm = [];
    const spin = reels.map(r => setInterval(() => { r.textContent = rnd(FILL); }, 75));
    let finished = false;
    const stop = (i) => { clearInterval(spin[i]); reels[i].classList.remove("spin"); reels[i].classList.add("lock"); reels[i].textContent = target[i]; };
    const tutup = () => { tm.forEach(clearTimeout); spin.forEach(clearInterval); o.remove(); done(); };
    const tampil = () => {
      if (finished) return; finished = true; [0, 1, 2].forEach(stop);
      const rs = o.querySelector("#gfx-reels"); rs.style.setProperty("--c", c); if (ORDR.indexOf(best.rarity) <= 3) rs.classList.add("win");
      if (ORDR.indexOf(best.rarity) <= 1) for (let i = 0; i < 30; i++) { const e = document.createElement("i"); e.className = "conf"; e.textContent = rnd(["✨", "⭐", "🎉", "💎"]); e.style.left = Math.random() * 100 + "vw"; e.style.animationDuration = 1.6 + Math.random() * 1.6 + "s"; o.appendChild(e); }
      const sisa = list.slice(1);
      o.querySelector("#gfx-out").innerHTML = (res.results.length > 1 ? '<div style="opacity:.8;font-size:13px;">Hadiah terbaik</div>' : "") + kartuHadiah(best) + (sisa.length ? `<div style="opacity:.8;font-size:13px;margin-top:10px;">Hadiah lainnya</div><div class="grid">${sisa.map(kartuHadiah).join("")}</div>` : "") + (res.refund ? `<div style="margin-top:8px;color:#ffd166;">+${res.refund} 🪙 dari duplikat</div>` : "");
      o.querySelector("#gfx-btn").innerHTML = '<button id="gfx-ok">Tutup</button>'; o.querySelector("#gfx-ok").onclick = tutup;
    };
    tm.push(setTimeout(() => stop(0), 1100), setTimeout(() => stop(1), 1800), setTimeout(() => stop(2), 2600), setTimeout(tampil, 3000));
    o.querySelector("#gfx-skip").onclick = tampil;
  });
}
window.GACHA = {
  async tarik(n) {
    if (busy) return; busy = true; let fresh = null;
    try {
      if (GACHA_URL) {
        const tok = await FB.getIdToken();
        const r = await fetch(GACHA_URL, { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + tok }, body: JSON.stringify({ n }) });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Gagal");
        last = fresh = j;
      } else last = fresh = await tarikLokal(n);   // MODE LOKAL sementara (belum ada server)
      const gs = await FB.getGachaState(); if (window.SHIROSE_THEME) window.SHIROSE_THEME.setOwned(gs && gs.inv || []);
      if (window.__SHIROSE_STATE) window.__SHIROSE_STATE.gami.koin = last.koin;
      const c = document.getElementById("chip-coin"); if (c && !(FB.hasUnlimitedCoins && FB.hasUnlimitedCoins())) c.textContent = last.koin;
    } catch (e) { if (window.toast) window.toast("❌ " + (e.message || e)); }
    busy = false;
    if (fresh && fresh.results) { try { await playSlot(fresh); } catch (e) {} }
    route("gacha");
  },
};
/* Mode lokal: undian di perangkat, saldo lewat dompet tunggal. Cukup untuk dipakai sekarang; ganti ke server (GACHA_URL) agar tak bisa dicurangi. */
async function tarikLokal(n) {
  const price = n === 10 ? CONFIG.PRICE_10 : CONFIG.PRICE_1;
  const unl = !!(FB.hasUnlimitedCoins && FB.hasUnlimitedCoins());
  const g = (await FB.getGachaState()) || { sinceEpic: 0, sinceLegend: 0, inv: [] };
  let saldo = null;
  if (!unl) { saldo = await FB.tambahKoin(-price, "gacha x" + n); if (saldo === null) throw new Error("Dompet belum siap, coba lagi"); }
  const own = Array.from(new Set([...(g.inv || []), ...(FB.ownedShopIds ? FB.ownedShopIds() : [])]));
  const r = rollMany(n, { sinceEpic: g.sinceEpic || 0, sinceLegend: g.sinceLegend || 0 }, own, undefined, unl ? CONFIG_FREE : CONFIG);
  const kind = Object.fromEntries(ITEMS.map(x => [x.id, x.kind]));
  const baru = r.results.filter(x => !x.dup).map(x => x.item);
  try {
    await FB.saveGachaState({ sinceEpic: r.pity.sinceEpic, sinceLegend: r.pity.sinceLegend, inv: Array.from(new Set([...(g.inv || []), ...baru])) }, baru.filter(i => kind[i] === "shop"));
  } catch (e) { if (!unl) { try { await FB.tambahKoin(price, "gacha batal (gagal simpan)"); } catch (x) {} } throw new Error("Gagal menyimpan hasil, koin dikembalikan"); }
  let akhir = saldo;
  if (r.refund) { const s2 = await FB.tambahKoin(r.refund, "gacha refund duplikat"); if (s2 !== null) akhir = s2; }
  return { results: r.results, refund: r.refund, koin: unl ? (window.__SHIROSE_STATE?.gami?.koin || 0) : akhir, pity: r.pity };
}
export const GACHA_ROUTES = { gacha: () => render() };
