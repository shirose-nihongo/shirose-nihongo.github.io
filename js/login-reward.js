/* REWARD LOGIN 30 HARI + PETI PILIH-1-DARI-5. Hari 3 hadiah kecil, hari 7/15/30 peti. Satu klaim per hari kalender (lokal).
 * Progres: siswa/{uid}/login_reward/main {hari,last,pending}. Peti: 5 barang acak (belum dimiliki) → pilih 1 → masuk inventaris. */
import { ITEMS } from "../cloudflare/gacha-items.js";
import { PET } from "./character-pet.js?v=20261119n";
import { CATALOG, DEFAULT_EQUIPPED, renderCharacter } from "./character.js?v=20261119n";
/* gambar barang: karakter memakai barang itu (SVG animasi bawaan item + efek melayang/bersinar per kelangkaan) */
const KAT_OF = {}; for (const [k, o] of Object.entries(CATALOG)) for (const id of Object.keys(o)) if (id !== "none") KAT_OF[id] = k;
const ANIM = { item_tangan: "gaSwing", aura: "gaPulse", sayap: "gaFlap", aksesori: "gaBob", pakaian: "gaBob", celana: "gaBob", sepatu: "gaBob", rambut: "gaBob" };
function gambarItem(id, rar, px = 96, stat = false) {
  const c = ({ common: "#9aa0a6", uncommon: "#5bd16b", rare: "#4aa3ff", epic: "#b266ff", legendary: "#ffb703", mythic: "#ff4d94" })[rar] || "#999";
  if (String(id).startsWith("theme_")) return `<div class="ga-fig" style="width:${px}px;height:${px}px;--gc:${c};animation:gaBob 2s ease-in-out infinite"><div style="font-size:${px * .5}px;display:flex;align-items:center;justify-content:center;height:100%">🎨</div></div>`;
  const k = KAT_OF[id]; if (!k) return `<div class="ga-fig" style="width:${px}px;height:${px}px;--gc:${c}"></div>`;
  const VB = { jepit: "110 40 180 190", anting: "110 60 180 150", rambut: "110 40 180 190", aksesori: "110 20 180 200", pakaian: "90 170 220 190", celana: "130 330 140 140", sepatu: "120 405 160 90", item_tangan: "70 150 260 240", sayap: "-110 -40 620 520" };
  const svg = renderCharacter({ ...DEFAULT_EQUIPPED, [k]: id }).replace(/viewBox="[^"]*"/, 'viewBox="' + (VB[k] || "0 0 400 500") + '"').replace('style="overflow:visible"', 'style="overflow:hidden"');   // potong sesuai viewBox, jangan meluber keluar kartu
  return `<div class="ga-fig${stat ? " ga-st" : ""}" style="width:${px}px;height:${px * 1.15}px;--gc:${c};${stat ? "" : `animation:${ANIM[k] || "gaBob"} ${k === "item_tangan" ? "1.6s" : "2.2s"} ease-in-out infinite`}">${svg}</div>`;
}
(function () { if (typeof document === "undefined" || document.getElementById("ga-css")) return; const st = document.createElement("style"); st.id = "ga-css";
  st.textContent = `.ga-fig{margin:0 auto;filter:drop-shadow(0 0 8px var(--gc));transform-origin:50% 90%}.ga-fig svg{width:100%;height:100%}.ga-st{filter:none!important;animation:none!important}.ga-card{content-visibility:auto;contain-intrinsic-size:auto 190px}
@keyframes gaBob{50%{transform:translateY(-6px) scale(1.04)}}@keyframes gaSwing{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg) scale(1.05)}}@keyframes gaPulse{50%{transform:scale(1.08);filter:drop-shadow(0 0 18px var(--gc))}}@keyframes gaFlap{50%{transform:scale(1.06) translateY(-4px)}}`; document.head.appendChild(st); })();

const POOL_ALL = [...ITEMS, ...Object.entries(PET).map(([id, p]) => ({ id, nama: p.nama, rarity: p.rarity, kind: "shop", kat: "Pet" }))];
const KIND = Object.fromEntries(POOL_ALL.map(x => [x.id, x.kind])), NAMA = Object.fromEntries(POOL_ALL.map(x => [x.id, x.nama]));
const RAR = { common: ["Common", "#9aa0a6"], uncommon: ["Uncommon", "#5bd16b"], rare: ["Rare", "#4aa3ff"], epic: ["Epic", "#b266ff"], legendary: ["Legendary", "#ffb703"], mythic: ["Mythic", "#ff4d94"] };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
let FB = null;
const SEMUA_BUKA = new Set(["randitsmuhamad50@gmail.com"]);   // akun ini boleh membuka SEMUA hadiah hari 1–30 kapan saja, berulang
const bebas = () => !!(FB && FB.emailSaatIni && SEMUA_BUKA.has(FB.emailSaatIni()));
export function initLoginReward(fb) { FB = fb; }

export const PETI = {
  perak:  { nama: "Peti Perak",  ikon: "🥈", bobot: { common: 30, uncommon: 40, rare: 30 } },
  emas:   { nama: "Peti Emas",   ikon: "🥇", bobot: { rare: 45, epic: 40, legendary: 15 } },
  mitos:  { nama: "Peti Mitos",  ikon: "👑", bobot: { epic: 50, legendary: 40, mythic: 10 } },
};
/* Jadwal 30 hari */
export function hadiahHari(h) {
  if (h === 30) return { koin: 2000, xp: 1000, peti: "mitos", label: "Peti Mitos", ikon: "👑" };
  if (h === 15 || h === 14 || h === 28) return { koin: 600 + h * 10, xp: 400 + h * 5, peti: "emas", label: "Peti Emas", ikon: "🥇" };
  if (h % 5 === 0 || h % 7 === 0) return { koin: 300 + h * 10, xp: 200 + h * 5, peti: "perak", label: "Peti Perak", ikon: "🥈" };   // 5,7,10,20,21,25
  if (h % 3 === 0) return { koin: 200 + h * 10, xp: 100 + h * 5, label: "Hadiah besar", ikon: "🎁" };   // 3,6,9,12,18,24,27
  return { koin: 50 + h * 5, xp: 30 + h * 3, label: "Koin & XP", ikon: "🪙" };
}
const ymd = (d = new Date()) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
const punya = async () => { const g = (FB.getGachaState ? await FB.getGachaState() : null) || { inv: [] }; return new Set([...(g.inv || []), ...(FB.ownedShopIds ? FB.ownedShopIds() : [])]); };
function pilihAcak(bobot, own, n = 5) {
  const hasil = [], rarList = Object.keys(bobot), tot = rarList.reduce((a, r) => a + bobot[r], 0);
  const byR = {}; POOL_ALL.forEach(x => { if (!own.has(x.id) && (x.kind === "theme" || CATALOG[(x.kat && "") || ""] || true)) (byR[x.rarity] = byR[x.rarity] || []).push(x.id); });
  let guard = 0;
  while (hasil.length < n && guard++ < 400) {
    let r = Math.random() * tot, rar = rarList[0]; for (const k of rarList) { r -= bobot[k]; if (r <= 0) { rar = k; break; } }
    const a = (byR[rar] || []).filter(i => !hasil.includes(i)); if (!a.length) continue;
    hasil.push(a[Math.floor(Math.random() * a.length)]);
  }
  if (hasil.length < n) { const sisa = POOL_ALL.filter(x => !hasil.includes(x.id)).map(x => x.id); while (hasil.length < n && sisa.length) hasil.push(sisa.splice(Math.floor(Math.random() * sisa.length), 1)[0]); }
  return hasil;
}
const rarOf = (id) => (POOL_ALL.find(x => x.id === id) || {}).rarity || "common";
function modal(html) {
  let m = document.getElementById("lr-modal"); if (!m) { m = document.createElement("div"); m.id = "lr-modal"; m.className = "modal-backdrop open"; m.onclick = (e) => { if (e.target === m && !m.dataset.kunci) m.remove(); }; document.body.appendChild(m); }
  m.innerHTML = `<div class="modal lr-box" style="max-width:640px;max-height:92vh;overflow:auto">${html}</div>`; return m;
}
const tutup = () => { const m = document.getElementById("lr-modal"); if (m) m.remove(); };
async function muat() { return (FB && FB.getLoginReward ? await FB.getLoginReward() : null) || { hari: 0, last: "", pending: null }; }
function kalender(rw, bisaKlaim) {
  const selanjutnya = rw.hari >= 30 ? 1 : rw.hari + 1, sudah = rw.last === ymd() ? rw.hari : (rw.hari >= 30 ? 0 : rw.hari);
  const sel = Array.from({ length: 30 }, (_, i) => {
    const h = i + 1, d = hadiahHari(h), klaim = h <= sudah, hariIni = bisaKlaim && h === selanjutnya;
    return `<div class="lr-d ${klaim ? "ok" : ""} ${hariIni ? "now" : ""} ${d.peti ? "peti" : ""}" ${bebas() ? `style="cursor:pointer;opacity:1" onclick="LR.klaimHari(${h})"` : ""}><b>${h}</b><span>${klaim ? "✅" : d.ikon}</span><small>${d.peti ? d.label : "🪙" + d.koin}</small></div>`;
  }).join("");
  return `<div class="lr-grid">${sel}</div>`;
}
const CSS = `.lr-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin:12px 0}.lr-d{border:1px solid var(--border,#444);border-radius:10px;padding:6px 2px;text-align:center;font-size:11px;background:rgba(255,255,255,.04)}.lr-d b{display:block;font-size:12px}.lr-d span{font-size:20px;display:block}.lr-d.ok{opacity:.55}.lr-d.peti{border-color:#ffb703;background:rgba(255,183,3,.1)}.lr-d.now{outline:2px solid #ef6a9a;animation:lrp 1.2s infinite}@keyframes lrp{50%{transform:scale(1.07)}}.lr-opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:14px 0}.lr-opt{cursor:pointer;border:2px solid;border-radius:14px;padding:10px;text-align:center;background:rgba(255,255,255,.05);transition:transform .15s}.lr-opt:hover{transform:translateY(-3px)}.lr-opt .n{font-weight:800;font-size:13px;margin-top:6px}.lr-opt .r{font-size:11px;font-weight:700}`;
if (typeof document !== "undefined" && !document.getElementById("lr-css")) { const st = document.createElement("style"); st.id = "lr-css"; st.textContent = CSS; document.head.appendChild(st); }
function tampilPilih(rw) {
  const p = rw.pending, pt = PETI[p.peti];
  const m = modal(`<h2 style="margin:0">${pt.ikon} ${pt.nama} terbuka!</h2><p style="color:var(--gray)">Pilih <b>1</b> dari 5 hadiah acak. Yang tidak dipilih hangus.</p>
    <div class="lr-opts">${p.opsi.map(id => { const r = rarOf(id), c = RAR[r][1]; return `<div class="lr-opt" style="border-color:${c};box-shadow:0 0 14px ${c}55" onclick="LR.ambil('${id}')">${gambarItem(id, r, 84, true)}<div class="n">${esc(NAMA[id] || id)}</div><div class="r" style="color:${c}">${RAR[r][0]}</div></div>`; }).join("")}</div>`);
  m.dataset.kunci = "1";
}
export async function bukaLoginReward() {
  if (!FB) return; const rw = await muat();
  if (rw.pending) return tampilPilih(rw);
  const bisa = rw.last !== ymd() || bebas(), nxt = rw.hari >= 30 ? 1 : rw.hari + 1, d = hadiahHari(nxt);
  modal(`<h2 style="margin:0">🎁 Reward Login — 30 Hari</h2><p style="color:var(--gray);margin:4px 0">Login tiap hari, klaim hadiah. Kelipatan 3 hadiah besar · hari 5, 7, 10, 20, 21, 25 Peti Perak · hari 14, 15, 28 Peti Emas · hari 30 Peti Mitos (pilih 1 dari 5 barang).</p>
    ${kalender(rw, bisa)}
    ${bisa ? `<button class="btn gold big" style="width:100%" onclick="LR.klaim()">${d.ikon} Klaim hari ke-${nxt}: ${d.peti ? d.label : "🪙" + d.koin + " + " + d.xp + " XP"}</button>`
           : `<button class="btn ghost" style="width:100%" disabled>✅ Sudah klaim hari ini — kembali besok (hari ${nxt})</button>`}
    ${bebas() ? `<p style="color:var(--gold);font-size:12px;text-align:center;margin-top:8px">🔓 Akun khusus: ketuk hari mana pun (1–30) untuk membuka hadiahnya, berulang.</p>` : ""}
    <div style="text-align:center;margin-top:10px"><button class="btn ghost" onclick="document.getElementById('lr-modal').remove()">Tutup</button></div>`);
}
const LR = window.LR = {
  async klaim() {
    const rw = await muat(); if ((rw.last === ymd() && !bebas()) || rw.pending) return bukaLoginReward();
    const h = rw.hari >= 30 ? 1 : rw.hari + 1, d = hadiahHari(h);
    const baru = { hari: h, last: ymd(), pending: null };
    if (d.peti) baru.pending = { hari: h, peti: d.peti, opsi: pilihAcak(PETI[d.peti].bobot, await punya()) };
    await FB.saveLoginReward(baru);   // simpan DULU (anti klaim ganda / anti reroll)
    try { window.awardXP && window.awardXP(d.xp, 0); } catch (e) {}
    try { window.awardKoin && await window.awardKoin(d.koin, "Reward login hari " + h); } catch (e) {}
    try { window.toast && window.toast(`🎁 Hari ${h}: +${d.koin} 🪙 +${d.xp} XP`); } catch (e) {}
    if (baru.pending) tampilPilih(baru); else bukaLoginReward();
  },
  async klaimHari(h) {   // khusus akun SEMUA_BUKA: hadiah hari h kapan saja, tanpa mengubah progres harian
    if (!bebas()) return; const d = hadiahHari(h), rw = await muat();
    try { window.awardXP && window.awardXP(d.xp, 0); window.awardKoin && await window.awardKoin(d.koin, "Reward login (uji) hari " + h); } catch (e) {}
    if (d.peti) { const p = { hari: h, peti: d.peti, opsi: pilihAcak(PETI[d.peti].bobot, await punya()) }; await FB.saveLoginReward({ ...rw, pending: p }); tampilPilih({ ...rw, pending: p }); }
    else try { window.toast && window.toast(`🎁 Hari ${h}: +${d.koin} 🪙 +${d.xp} XP`); } catch (e) {}
  },
  async ambil(id) {
    const rw = await muat(); if (!rw.pending || !rw.pending.opsi.includes(id)) return;
    const g = (FB.getGachaState ? await FB.getGachaState() : null) || { sinceEpic: 0, sinceLegend: 0, inv: [] };
    await FB.saveGachaState({ sinceEpic: g.sinceEpic || 0, sinceLegend: g.sinceLegend || 0, inv: Array.from(new Set([...(g.inv || []), id])) }, KIND[id] === "shop" ? [id] : []);
    await FB.saveLoginReward({ ...rw, pending: null });
    try { if (window.SHIROSE_THEME && KIND[id] === "theme") { const g2 = await FB.getGachaState(); window.SHIROSE_THEME.setOwned(g2.inv || []); } } catch (e) {}
    const r = rarOf(id), c = RAR[r][1];
    const m = modal(`<div style="text-align:center"><h2>🎉 Kamu dapat!</h2>${gambarItem(id, r, 130)}<h3 style="color:${c}">${esc(NAMA[id] || id)}</h3><p style="color:var(--gray)">${RAR[r][0]} · masuk inventaris — cek di Shop (tab “Dimiliki”).</p><button class="btn gold" onclick="document.getElementById('lr-modal').remove()">Mantap</button></div>`); delete m.dataset.kunci;
  },
};
/* Auto-buka sekali per sesi bila ada klaim/peti tertunda */
let _auto = false;
/* Refund sekali: akun "nufus" kehilangan koin gacha → +1000 koin (penanda disimpan SEBELUM koin diberikan agar tidak ganda) */
async function refundCek() {
  try {
    const id = "refund_gacha_1000", em = (FB.emailSaatIni ? FB.emailSaatIni() : ""), nm = (FB.namaSaatIni ? FB.namaSaatIni() : "");
    if (!/nufus/i.test(em + " " + nm)) return;
    if (await FB.getRewardFlag(id)) return;
    await FB.setRewardFlag(id);
    await window.awardKoin(1000, "Refund koin gacha hilang");
    window.toast && window.toast("💰 Refund koin gacha: +1000 🪙");
  } catch (e) { console.warn("refund:", e.message); }
}
export async function cekLoginReward() {
  refundCek();
  if (_auto || !FB) return; _auto = true;
  try { const rw = await muat(); if (rw.pending || rw.last !== ymd()) setTimeout(bukaLoginReward, 800); } catch (e) {}
}
window.openLoginReward = bukaLoginReward;
