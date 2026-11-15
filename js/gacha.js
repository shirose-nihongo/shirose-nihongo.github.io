/* Halaman Gacha (#gacha). RNG & potong koin di server (cloudflare/gacha-worker.js). Klien hanya menampilkan hasil. */
import { CONFIG, CONFIG_FREE, rollMany } from "../cloudflare/gacha-core.js";
import { ITEMS } from "../cloudflare/gacha-items.js";
import { CATALOG, DEFAULT_EQUIPPED, renderCharacter } from "./character.js?v=20261116j";
/* gambar barang: karakter memakai barang itu (SVG animasi bawaan item + efek melayang/bersinar per kelangkaan) */
const KAT_OF = {}; for (const [k, o] of Object.entries(CATALOG)) for (const id of Object.keys(o)) if (id !== "none") KAT_OF[id] = k;
const ANIM = { item_tangan: "gaSwing", aura: "gaPulse", sayap: "gaFlap", aksesori: "gaBob", pakaian: "gaBob", celana: "gaBob", sepatu: "gaBob", rambut: "gaBob" };
function gambarItem(id, rar, px = 96) {
  const c = ({ common: "#9aa0a6", uncommon: "#5bd16b", rare: "#4aa3ff", epic: "#b266ff", legendary: "#ffb703", mythic: "#ff4d94" })[rar] || "#999";
  if (String(id).startsWith("theme_")) return `<div class="ga-fig" style="width:${px}px;height:${px}px;--gc:${c};animation:gaBob 2s ease-in-out infinite"><div style="font-size:${px * .5}px;display:flex;align-items:center;justify-content:center;height:100%">🎨</div></div>`;
  const k = KAT_OF[id]; if (!k) return `<div class="ga-fig" style="width:${px}px;height:${px}px;--gc:${c}"></div>`;
  const VB = { rambut: "110 40 180 190", aksesori: "110 20 180 200", pakaian: "90 170 220 190", celana: "130 330 140 140", sepatu: "120 405 160 90", item_tangan: "70 150 260 240", sayap: "-110 -40 620 520" };
  const svg = renderCharacter({ ...DEFAULT_EQUIPPED, [k]: id }).replace(/viewBox="[^"]*"/, 'viewBox="' + (VB[k] || "0 0 400 500") + '"').replace('style="overflow:visible"', 'style="overflow:hidden"');   // potong sesuai viewBox, jangan meluber keluar kartu
  return `<div class="ga-fig" style="width:${px}px;height:${px * 1.15}px;--gc:${c};animation:${ANIM[k] || "gaBob"} ${k === "item_tangan" ? "1.6s" : "2.2s"} ease-in-out infinite">${svg}</div>`;
}
(function () { if (typeof document === "undefined" || document.getElementById("ga-css")) return; const st = document.createElement("style"); st.id = "ga-css";
  st.textContent = `.ga-fig{margin:0 auto;filter:drop-shadow(0 0 8px var(--gc));transform-origin:50% 90%}.ga-fig svg{width:100%;height:100%}
@keyframes gaBob{50%{transform:translateY(-6px) scale(1.04)}}@keyframes gaSwing{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg) scale(1.05)}}@keyframes gaPulse{50%{transform:scale(1.08);filter:drop-shadow(0 0 18px var(--gc))}}@keyframes gaFlap{50%{transform:scale(1.06) translateY(-4px)}}`; document.head.appendChild(st); })();
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
      return `<div style="padding:10px;border-radius:12px;border:1px solid ${RAR[r][1]};opacity:${own ? 1 : .92};${own ? "" : "filter:saturate(.8);"}">${gambarItem(i, r, 84)}<div style="font-weight:700;font-size:13px;margin:4px 0;">${esc(x.nama || i)}</div><div style="font-size:11px;color:var(--gray);">${th ? "Tema tampilan" : esc(x.kat || "Barang shop")}${x.harga ? " · 🪙 " + x.harga.toLocaleString("id-ID") : ""}</div><div style="font-size:11px;margin-top:3px;">≈ ${fmt(pctOf[r] / a.length)} per tarikan</div>${own ? '<div style="font-size:11px;color:#3cc878;margin-top:3px;">✓ Dimiliki</div>' : ""}${th ? `<button class="btn ghost" style="margin-top:6px;padding:4px 8px;font-size:12px;" onclick="SHIROSE_THEME.preview('${i.slice(6)}')">👀 Pratinjau</button>` : ""}</div>`; }).join("") + "</div>"; }).join("");
  const hasil = last ? `<div class="panel" style="margin-top:12px;"><h3>Hasil tarikan</h3>${last.results.map(x => `<div style="padding:6px 0;border-bottom:1px solid var(--border,#333);color:${RAR[x.rarity][1]};"><b>${RAR[x.rarity][0]}</b> · ${esc(NAMA[x.item] || x.item)}${x.dup ? ' <small style="color:var(--gray);">(duplikat, tidak ada pengembalian)</small>' : " ✨ baru!"}</div>`).join("")}</div>` : "";
  const aktif = true;
  return `<div class="panel"><h1>🎰 Gacha</h1>
    <p>Saldo: <b>${(st.gami?.koin || 0).toLocaleString("id-ID")} 🪙</b> (dompet satu untuk semua fitur)</p>
    <p style="font-size:12px;color:var(--gray);">Pity: epic+ dijamin ≤ ${CONFIG.PITY_EPIC} tarikan (sekarang ${g.sinceEpic || 0}) · legendary+ dijamin ≤ ${CONFIG.PITY_LEGENDARY} (sekarang ${g.sinceLegend || 0}). Hasil diundi di perangkat ini.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin:12px 0;">
      <button class="btn" ${busy ? "disabled" : ""} onclick="GACHA.tarik(1)">Tarik ×1 · ${CONFIG.PRICE_1.toLocaleString("id-ID")} 🪙</button>
      <button class="btn gold" ${busy ? "disabled" : ""} onclick="GACHA.tarik(10)">Tarik ×10 · ${CONFIG.PRICE_10.toLocaleString("id-ID")} 🪙</button></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:6px 0 10px;padding:10px;border:1px dashed var(--border,#444);border-radius:12px;"><b>🔁 Auto spin</b>
      <select id="ga-mode"><option value="1">tarik ×1</option><option value="10">tarik ×10</option></select>
      <span>sebanyak</span><select id="ga-count">${[3, 5, 10, 20, 50, 100, 200].map(v => `<option value="${v}">${v} kali</option>`).join("")}</select>
      <button class="btn ghost" ${busy ? "disabled" : ""} onclick="GACHA.auto()">▶ Mulai</button>
      <small style="color:var(--gray);flex-basis:100%;">Setiap putaran tetap menampilkan slot, bisa dipercepat 1×/2×/4×/8× atau Stop kapan saja. Berhenti sendiri kalau koin tidak cukup; ringkasan di akhir.</small></div>
    ${FB.hasUnlimitedCoins && FB.hasUnlimitedCoins() ? '<p style="font-size:12px;color:#ffb703;">🛡️ Akun moderator: tarik GRATIS, tapi peluang lebih rendah (Epic 1.3% · Legendary 0.19% · Mythic 0.01%) dan tanpa pity.</p>' : ""}<p style="font-size:11px;color:var(--gray);">Peluang: ${CONFIG.RARITY.map(r => RAR[r.id][0] + " " + r.pct + "%").join(" · ")}</p>
    ${GACHA_URL ? "" : '<p style="font-size:11px;color:var(--gray);">Undian, pity, dan inventaris gacha disimpan di perangkat ini (tanpa server).</p>'}</div>${hasil}
    <div class="panel" style="margin-top:12px;"><h3>📊 Peluang per kelangkaan</h3><div class="table-wrap"><table><thead><tr><th>Rarity</th><th></th><th>Peluang</th><th>Isi</th><th>Per item</th></tr></thead><tbody>${tabelRate}</tbody></table></div><p style="font-size:11px;color:var(--gray);margin-top:6px;">Peluang dasar per tarikan (angka bisa sedikit lebih tinggi untuk epic ke atas karena pity). Item duplikat tidak mendapat pengembalian koin. Tema hanya ada di Epic &amp; Legendary.</p></div>
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
function kartuHadiah(x, dl, px) { const c = RAR[x.rarity][1]; return `<div class="gfx-card" style="border-color:${c};box-shadow:0 0 22px ${c}66;${dl ? "animation-delay:" + dl + "s;" : ""}">${gambarItem(x.item, x.rarity, px || (dl === undefined ? 120 : 64))}<div style="color:${c};font-weight:900;letter-spacing:.08em;font-size:12px;">${RAR[x.rarity][0].toUpperCase()}</div><div style="font-size:15px;font-weight:800;margin:4px 0;">${esc(NAMA[x.item] || x.item)}</div>${x.dup ? `<div style="font-size:11px;color:#bbb;">Duplikat (tanpa pengembalian)</div>` : '<div style="font-size:11px;color:#3cc878;">✨ Baru!</div>'}</div>`; }
let autoSpeed = 1;
function playSlot(res, au) {
  return new Promise((done) => {
    const list = res.results.slice().sort((a, b) => ORDR.indexOf(a.rarity) - ORDR.indexOf(b.rarity)), best = list[0], target = pola(best.rarity), c = RAR[best.rarity][1];
    const hi = ORDR.indexOf(best.rarity) <= 1, mid = ORDR.indexOf(best.rarity) <= 3, H = 96, N = 26;
    const o = document.createElement("div"); o.id = "gfx"; o.style.setProperty("--c", c);
    const strip = (t) => { const a = []; for (let i = 0; i < N - 1; i++) a.push(rnd(FILL)); a.push(t); return a.map(s => `<div class="sym">${s}</div>`).join(""); };
    const bulbs = Array.from({ length: 14 }, (_, i) => `<i style="animation-delay:${(i % 2) * .4}s"></i>`).join("");
    o.innerHTML = `<style>
#gfx{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:14px;overflow:auto;color:#fff;background:radial-gradient(ellipse at 50% 40%,#2a1459 0%,#0b0620 60%,#000 100%);animation:gfxBg 3s ease-in-out infinite alternate}
@keyframes gfxBg{to{filter:hue-rotate(40deg) brightness(1.15)}}
#gfx .stars{position:absolute;inset:0;pointer-events:none;overflow:hidden}
#gfx .stars i{position:absolute;bottom:-20px;font-style:normal;animation:gfxUp linear infinite;opacity:.7}
@keyframes gfxUp{to{transform:translateY(-110vh) rotate(180deg)}}
#gfx .rays{position:absolute;left:50%;top:38%;width:160vmax;height:160vmax;margin:-80vmax 0 0 -80vmax;pointer-events:none;opacity:0;background:repeating-conic-gradient(from 0deg,var(--c) 0 6deg,transparent 6deg 18deg);-webkit-mask:radial-gradient(circle,#000 0,transparent 55%);mask:radial-gradient(circle,#000 0,transparent 55%);animation:gfxSpin 14s linear infinite;transition:opacity .6s}
#gfx.show .rays{opacity:.5}@keyframes gfxSpin{to{transform:rotate(360deg)}}
#gfx .box{position:relative;width:min(560px,100%);text-align:center}
#gfx .mach{position:relative;margin:14px auto;padding:22px 16px 16px;border-radius:22px;background:linear-gradient(#7a1f3d,#3d0f20);border:4px solid #ffd166;box-shadow:0 0 40px #ffd16666,inset 0 0 22px #0008;width:fit-content;max-width:100%}
#gfx .bulbs{position:absolute;left:12px;right:12px;top:6px;display:flex;justify-content:space-between}
#gfx .bulbs i{width:9px;height:9px;border-radius:50%;background:#ffd166;box-shadow:0 0 10px #ffd166;animation:gfxBlink .8s infinite}@keyframes gfxBlink{50%{opacity:.2}}
#gfx .reels{display:flex;gap:10px;justify-content:center;padding:10px;border-radius:14px;background:#111}
#gfx .win{width:88px;height:${H}px;overflow:hidden;border-radius:10px;background:#fff;box-shadow:inset 0 0 14px #0007;position:relative}
#gfx .win:after{content:"";position:absolute;inset:0;background:linear-gradient(#0005,transparent 25%,transparent 75%,#0005);pointer-events:none}
#gfx .strip{transition:transform var(--d,2s) cubic-bezier(.1,.75,.2,1);will-change:transform}
#gfx .strip.mv{filter:blur(2px)}
#gfx .sym{height:${H}px;display:flex;align-items:center;justify-content:center;font-size:52px;color:#000}
#gfx .win.lock{animation:gfxPop .4s}@keyframes gfxPop{40%{transform:scale(1.14)}}
#gfx .mach.glow{animation:gfxGlow .9s infinite}@keyframes gfxGlow{50%{box-shadow:0 0 60px 14px var(--c),inset 0 0 22px #0008}}
#gfx .gfx-card{display:inline-block;min-width:200px;margin:6px;padding:12px 16px;border-radius:14px;border:2px solid;background:#161616cc;backdrop-filter:blur(3px);animation:gfxCard .7s cubic-bezier(.2,1.4,.4,1) both}
@keyframes gfxCard{from{transform:scale(.2) rotateY(90deg);opacity:0}to{transform:none;opacity:1}}
#gfx .best .gfx-card{transform-origin:center;font-size:110%;animation:gfxCard .8s cubic-bezier(.2,1.4,.4,1) both,gfxFloat 2.4s ease-in-out .9s infinite}
@keyframes gfxFloat{50%{transform:translateY(-6px) scale(1.03)}}
#gfx .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:4px}
#gfx .grid .gfx-card{margin:2px;min-width:0;animation:gfxFly .5s ease-out both}
@keyframes gfxFly{from{transform:translateY(40px) scale(.6);opacity:0}to{transform:none;opacity:1}}
#gfx button{background:#fff;color:#111;border:0;border-radius:10px;padding:9px 18px;font-weight:800;cursor:pointer;margin:6px}
#gfx .conf{position:fixed;top:-20px;font-size:22px;animation:gfxFall linear forwards;pointer-events:none}@keyframes gfxFall{to{transform:translateY(110vh) rotate(360deg);opacity:.9}}
</style>
<div class="rays"></div><div class="stars">${Array.from({ length: 18 }, () => `<i style="left:${Math.random() * 100}%;font-size:${12 + Math.random() * 16}px;animation-duration:${4 + Math.random() * 5}s;animation-delay:-${Math.random() * 6}s">${rnd(["✨", "⭐", "🌟", "💫"])}</i>`).join("")}</div>
<div class="box"><div style="font-size:14px;letter-spacing:.25em;opacity:.9;">🎰 GACHA ${res.results.length > 1 ? "×" + res.results.length : ""}</div>
<div class="mach" id="gfx-mach"><div class="bulbs">${bulbs}</div><div class="reels">${target.map(t => `<div class="win"><div class="strip mv">${strip(t)}</div></div>`).join("")}</div></div>
<div id="gfx-out" style="min-height:120px;"></div><div id="gfx-btn"><button id="gfx-skip">Lewati ⏭</button></div></div>`;
    document.body.appendChild(o);
    if (au) {
      const bar = document.createElement("div"); bar.style.cssText = "position:absolute;top:8px;left:0;right:0;z-index:5;display:flex;gap:6px;justify-content:center;align-items:center;flex-wrap:wrap;color:#fff;font-size:13px";
      bar.innerHTML = `<b>🔁 Auto ${au.i}/${au.kali}</b>${[1, 2, 4, 8].map(v => `<button data-sp="${v}" style="padding:5px 10px;margin:0">${v}×</button>`).join("")}<button id="gfx-stop" style="padding:5px 10px;margin:0;background:#ef4444;color:#fff">⏹ Stop</button>`;
      o.appendChild(bar);
      bar.querySelectorAll("[data-sp]").forEach(b => { b.style.opacity = +b.dataset.sp === autoSpeed ? 1 : .55; b.onclick = () => { autoSpeed = +b.dataset.sp; bar.querySelectorAll("[data-sp]").forEach(x => x.style.opacity = +x.dataset.sp === autoSpeed ? 1 : .55); tampil(); }; });
      bar.querySelector("#gfx-stop").onclick = () => { autoStop = true; tampil(); };
    }
    const wins = [...o.querySelectorAll(".win")], strips = [...o.querySelectorAll(".strip")], tm = [];
    const sp = au ? autoSpeed : 1, durs = [2.0, 2.9, 3.8].map(d => d / sp);
    requestAnimationFrame(() => requestAnimationFrame(() => strips.forEach((s, i) => { s.style.setProperty("--d", durs[i] + "s"); s.style.transform = `translateY(${-(N - 1) * H}px)`; })));
    let finished = false;
    const kunci = (i) => { strips[i].classList.remove("mv"); wins[i].classList.add("lock"); };
    const tutup = () => { tm.forEach(clearTimeout); o.remove(); done(); };
    const tampil = () => {
      if (finished) return; finished = true;
      strips.forEach((s, i) => { s.style.transition = "none"; s.style.transform = `translateY(${-(N - 1) * H}px)`; kunci(i); });
      if (mid) o.querySelector("#gfx-mach").classList.add("glow"); o.classList.add("show");
      if (hi) for (let i = 0; i < 36; i++) { const e = document.createElement("i"); e.className = "conf"; e.textContent = rnd(["✨", "⭐", "🎉", "💎", "👑"]); e.style.left = Math.random() * 100 + "vw"; e.style.animationDuration = 1.6 + Math.random() * 1.8 + "s"; e.style.animationDelay = Math.random() * .6 + "s"; o.appendChild(e); }
      const sisa = list.slice(1);
      o.querySelector("#gfx-out").innerHTML = (res.results.length > 1 ? '<div style="opacity:.85;font-size:13px;">Hadiah terbaik</div>' : "") + `<div class="best">${kartuHadiah(best)}</div>` + (sisa.length ? `<div style="opacity:.85;font-size:13px;margin-top:10px;">Hadiah lainnya</div><div class="grid">${sisa.map((x, i) => kartuHadiah(x, (.5 + i * .12).toFixed(2))).join("")}</div>` : "");
      if (au) { tm.push(setTimeout(tutup, (autoStop ? 300 : 1700 / autoSpeed))); o.querySelector("#gfx-btn").innerHTML = ""; } else { o.querySelector("#gfx-btn").innerHTML = '<button id="gfx-ok">Tutup</button>'; o.querySelector("#gfx-ok").onclick = tutup; }
    };
    durs.forEach((d, i) => tm.push(setTimeout(() => kunci(i), d * 1000)));
    tm.push(setTimeout(tampil, durs[2] * 1000 + 350 / sp));
    o.querySelector("#gfx-skip").onclick = tampil;
    o.style.setProperty("--sp", sp);
  });
}
let autoStop = false;
async function satuTarik(n) {
  let res;
  if (GACHA_URL) {
    const tok = await FB.getIdToken();
    const r = await fetch(GACHA_URL, { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + tok }, body: JSON.stringify({ n }) });
    const j = await r.json(); if (!r.ok) throw new Error(j.error || "Gagal"); res = j;
  } else res = await tarikLokal(n);   // MODE LOKAL sementara (belum ada server)
  last = res;
  const gs = await FB.getGachaState(); if (window.SHIROSE_THEME) window.SHIROSE_THEME.setOwned(gs && gs.inv || []);
  if (window.__SHIROSE_STATE) window.__SHIROSE_STATE.gami.koin = res.koin;
  const c = document.getElementById("chip-coin"); if (c && !(FB.hasUnlimitedCoins && FB.hasUnlimitedCoins())) c.textContent = res.koin;
  return res;
}
function ringkasan(all, dipakai, berhenti) {
  return new Promise((done) => {
    const cnt = {}; all.forEach(x => cnt[x.rarity] = (cnt[x.rarity] || 0) + 1);
    const baru = all.filter(x => !x.dup).sort((a, b) => ORDR.indexOf(a.rarity) - ORDR.indexOf(b.rarity));
    const o = document.createElement("div"); o.id = "gfx";
    o.style.cssText = "position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.88);display:flex;align-items:center;justify-content:center;padding:14px;overflow:auto;color:#fff";
    o.innerHTML = `<div style="width:min(560px,100%);text-align:center"><h3>🎰 Auto spin selesai</h3><p style="opacity:.85;font-size:13px;">${all.length} tarikan · ${berhenti ? esc(berhenti) : "selesai"}${dipakai ? " · dipakai " + dipakai.toLocaleString("id-ID") + " 🪙" : " · gratis"}</p>
<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:10px 0;">${ORDR.map(r => `<span style="padding:5px 10px;border-radius:10px;border:1px solid ${RAR[r][1]};color:${RAR[r][1]};font-weight:800;">${RAR[r][0]} ×${cnt[r] || 0}</span>`).join("")}</div>
<div style="opacity:.85;font-size:13px;">Barang baru (${baru.length}) · duplikat ${all.length - baru.length}</div>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:4px;max-height:48vh;overflow:auto;margin-top:6px;">${baru.map(x => kartuHadiah(x, 0, 64)).join("") || '<div style="opacity:.7;padding:10px;">Tidak ada barang baru</div>'}</div>
<button id="gfx-ok" style="background:#fff;color:#111;border:0;border-radius:10px;padding:9px 18px;font-weight:800;cursor:pointer;margin-top:12px;">Tutup</button></div>`;
    document.body.appendChild(o); o.querySelector("#gfx-ok").onclick = () => { o.remove(); done(); };
  });
}
window.GACHA = {
  async tarik(n) {
    if (busy) return; busy = true; let fresh = null;
    try { fresh = await satuTarik(n); } catch (e) { if (window.toast) window.toast("❌ " + (e.message || e)); }
    busy = false;
    if (fresh && fresh.results) { try { await playSlot(fresh); } catch (e) {} }
    route("gacha");
  },
  /* Auto spin: ulangi tarik ×1 / ×10 sebanyak N kali tanpa animasi, berhenti kalau koin habis atau ditekan Stop. */
  async auto() {
    if (busy) return;
    const n = +document.getElementById("ga-mode").value === 10 ? 10 : 1, kali = Math.max(1, Math.min(200, +document.getElementById("ga-count").value || 1));
    busy = true; autoStop = false;
    const all = []; let dipakai = 0, alasan = "", unl = !!(FB.hasUnlimitedCoins && FB.hasUnlimitedCoins());
    for (let i = 0; i < kali && !autoStop; i++) {
      try { const r = await satuTarik(n); all.push(...r.results); if (!unl) dipakai += n === 10 ? CONFIG.PRICE_10 : CONFIG.PRICE_1; await playSlot(r, { i: i + 1, kali }); }
      catch (e) { alasan = (e.message || "gagal") + " — dihentikan"; break; }
    }
    if (autoStop) alasan = "dihentikan";
    busy = false;
    if (all.length) await ringkasan(all, dipakai, alasan); else if (window.toast) window.toast(alasan || "Tidak ada tarikan");
    route("gacha");
  },
};
/* Mode lokal: undian di perangkat, saldo lewat dompet tunggal. Cukup untuk dipakai sekarang; ganti ke server (GACHA_URL) agar tak bisa dicurangi. */
async function tarikLokal(n) {
  const price = n === 10 ? CONFIG.PRICE_10 : CONFIG.PRICE_1;
  const unl = !!(FB.hasUnlimitedCoins && FB.hasUnlimitedCoins());
  const g = (await FB.getGachaState()) || { sinceEpic: 0, sinceLegend: 0, inv: [] };
  const st = window.__SHIROSE_STATE; const saldo = Number(st && st.gami && st.gami.koin) || 0;
  if (!unl && saldo < price) throw new Error("Koin tidak cukup!");
  const own = Array.from(new Set([...(g.inv || []), ...(FB.ownedShopIds ? FB.ownedShopIds() : [])]));
  const r = rollMany(n, { sinceEpic: g.sinceEpic || 0, sinceLegend: g.sinceLegend || 0 }, own, undefined, unl ? CONFIG_FREE : CONFIG);
  const kind = Object.fromEntries(ITEMS.map(x => [x.id, x.kind]));
  const baru = r.results.filter(x => !x.dup).map(x => x.item);
  await FB.saveGachaState({ sinceEpic: r.pity.sinceEpic, sinceLegend: r.pity.sinceLegend, inv: Array.from(new Set([...(g.inv || []), ...baru])) }, baru.filter(i => kind[i] === "shop"));
  let akhir = saldo;
  if (!unl) { FB.gachaSpend(price); akhir = saldo - price; if (st && st.gami) st.gami.koin = akhir; }
  return { results: r.results, refund: 0, koin: unl ? saldo : akhir, pity: r.pity };
}
export const GACHA_ROUTES = { gacha: () => render() };
