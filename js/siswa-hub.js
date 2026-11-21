/* =====================================================================
 * HUB SISWA — halaman #profile dengan 3 tab:
 *   1) Profil  : avatar, level, XP, flashcard yang diingat hari ini
 *   2) Akses   : semua akses JLPT / JFT / SSW (bisa dibuka dari sini), kelas, status akun
 *   3) Nilai   : HANYA paket yang dimiliki siswa. Tiap paket = 1 kartu yang bisa ditekan
 *                (detail baru dimuat saat ditekan).
 *                JLPT → nilai Full Exam 1–20 · JFT → paket per 6 bab + simulasi penuh ·
 *                SSW  → nilai per sub-bab/bab + Ujian Penuh.
 * Route: #profile, #profile/akses, #profile/nilai
 * Hanya MEMBACA data yang sudah ada (tidak mengubah aturan akses).
 * ===================================================================== */
import { initSswCore, loadBidang, sswAllowed, loadKelasAkses, loadPack, fullQuizzes, esc, plain } from "./ssw-core.js?v=20261118s";

const LOADERS = {};
let C = null;   // { FB, state, renderCharacter, DEFAULT_EQUIPPED, canAccessLevel }
export function initHub(ctx) { C = ctx; try { initSswCore(ctx.FB); } catch (e) {} }   // jaga-jaga bila versi modul ssw-core beda dengan ssw.js

const LVS = ["n5", "n4", "n3", "n2", "n1"];
const JFT_LV = { ir0: { nama: "Starter · A1", jp: "入門" }, ir1: { nama: "Shokyuu 1 · A2.1", jp: "初級1" }, ir2: { nama: "Shokyuu 2 · A2.2", jp: "初級2" } };
const BLOK = [[1, 6], [7, 12], [13, 18]];
const LS = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } } };
const uid = () => C.state.user?.uid || "guest";

const warna = (p) => p == null ? "var(--gray-dim)" : p >= 80 ? "var(--green)" : p >= 60 ? "var(--orange)" : "var(--red)";
const pctTxt = (p) => p == null ? "–" : Math.round(p) + "%";
const tt = (x) => esc(plain((x && x.title && (x.title.id || x.title)) || x?.id || ""));

/* ---------- gaya ---------- */
const CSS = `<style>
.hub-tabs{display:flex; gap:6px; margin:4px 0 14px; position:sticky; top:var(--tb-h,56px); z-index:5; background:var(--navy,#161b36); padding:6px 0;}
.hub-tabs button{flex:1 1 0; min-width:0; white-space:nowrap; padding:11px 4px; min-height:44px; border-radius:12px; border:1px solid var(--border); background:rgba(42,50,112,.4); color:var(--gray); font-weight:700; font-size:14px; cursor:pointer;}
.hub-tabs button.on{background:var(--pink); border-color:var(--pink); color:#fff;}
.hub-id{display:flex; gap:14px; align-items:center; flex-wrap:wrap;}
.hub-ava{width:132px; height:150px; flex:none; display:flex; align-items:center; justify-content:center; border-radius:16px; background:rgba(42,50,112,.45); border:1px solid var(--border); overflow:hidden;}
.hub-ava>*{transform:scale(.62); transform-origin:center;}
.hub-stat{display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr)); gap:8px; margin:14px 0;}
.hub-stat>div{padding:12px; border-radius:12px; background:rgba(42,50,112,.4); border:1px solid var(--border);}
.hub-stat b{display:block; font-size:22px;} .hub-stat small{color:var(--gray); font-size:12px;}
.hub-bar{height:10px; border-radius:6px; background:rgba(255,255,255,.08); overflow:hidden; margin-top:6px;}
.hub-bar i{display:block; height:100%; background:linear-gradient(90deg,var(--pink),var(--gold));}
.hub-badge{display:inline-block; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:700; background:rgba(239,106,154,.18); color:var(--pink-light); border:1px solid var(--pink);}
.hub-badge.ok{background:rgba(16,185,129,.15); color:var(--green); border-color:var(--green);} .hub-badge.no{background:rgba(239,68,68,.15); color:var(--red); border-color:var(--red);}
.hub-grp{margin:18px 0 8px; font-size:15px;}
.hub-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:8px;}
.hub-tile{padding:12px; min-height:64px; border-radius:12px; border:1px solid var(--border-light); background:rgba(42,50,112,.45); color:#fff; text-align:left; cursor:pointer; font:inherit;}
.hub-tile b{display:block; font-size:14px;} .hub-tile small{color:var(--gray); font-size:11.5px;}
.hub-tile.lock{opacity:.5; border-style:dashed;}
.hub-info{display:grid; grid-template-columns:auto 1fr; gap:6px 14px; font-size:14px; align-items:center;}
.hub-info span:nth-child(odd){color:var(--gray);}
.hub-card{border:1px solid var(--border-light); border-radius:12px; margin-bottom:8px; background:rgba(42,50,112,.35); overflow:hidden;}
.hub-card>button{width:100%; display:flex; justify-content:space-between; align-items:center; gap:10px; padding:14px; min-height:52px; background:none; border:none; color:#fff; font:inherit; text-align:left; cursor:pointer;}
.hub-card>button small{color:var(--gray); display:block; font-size:12px; font-weight:400;}
.hub-card .car{transition:transform .2s;} .hub-card.open .car{transform:rotate(90deg);}
.hub-body{display:none; padding:4px 14px 14px;} .hub-card.open .hub-body{display:block;}
.hub-full{display:grid; grid-template-columns:repeat(auto-fill,minmax(64px,1fr)); gap:6px;}
.hub-full div{padding:8px 4px; border-radius:8px; text-align:center; border:1px solid var(--border); font-size:12px; background:rgba(0,0,0,.18);}
.hub-full div b{display:block; font-size:15px;} .hub-full div small{display:block; font-size:10px; color:var(--gray);}
.hub-row{display:flex; justify-content:space-between; gap:10px; padding:8px 2px; border-bottom:1px solid rgba(255,255,255,.07); font-size:13px;}
.hub-row b{white-space:nowrap;}
.hub-h{margin:12px 0 6px; font-size:13px; color:var(--pink-light); font-weight:700;}
</style>`;

const tabBar = (t) => `<div class="hub-tabs">${[["profil", "👤 Profil"], ["akses", "🔑 Akses"], ["nilai", "📊 Nilai"]].map(([k, l]) => `<button class="${t === k ? "on" : ""}" onclick="route('profile${k === "profil" ? "" : "/" + k}')">${l}</button>`).join("")}</div>`;

export async function renderHub(rest) {
  const tab = ["akses", "nilai"].includes(rest && rest[0]) ? rest[0] : "profil";
  const body = tab === "akses" ? await tabAkses() : tab === "nilai" ? await tabNilai() : await tabProfil();
  return `<div class="panel">${CSS}<h2>👤 Akun Saya</h2>${tabBar(tab)}${body}</div>`;
}

/* ---------- peran / status ---------- */
function peran() {
  const { FB } = C;
  if (FB.userIsDeveloper()) return "Moderator";
  if (FB.userIsAdmin()) return "Admin";
  if (FB.userIsGuru()) return "Guru";
  return "Siswa";
}

/* =============================== TAB 1: PROFIL =============================== */
const ymdLokal = (d = new Date()) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;

async function tabProfil() {
  const { FB, state } = C;
  const s = state.siswa || {};
  if (!state.user) return `<div class="empty"><div class="emoji">🔑</div>Masuk dulu untuk melihat profil.<br><button class="btn" onclick="route('login')">Masuk</button></div>`;
  const eq = s.karakter?.equipped || C.DEFAULT_EQUIPPED, skin = s.karakter?.skinTone || "light";
  const ava = C.renderCharacter(eq, skin, { hairColor: s.karakter?.hairColor });
  // Flashcard yang diingat hari ini = aktivitas hafalan kanji + kosakata hari ini.
  let hariIni = 0;
  try { const a = await FB.listActivity(ymdLokal().slice(0, 6)); const d = a[ymdLokal()] || {}; hariIni = (d.kanji || 0) + (d.kosakata || 0); } catch (e) {}
  // Level & XP: ambil semua level yang dibuka, pakai yang tertinggi untuk "level karakter".
  const buka = LVS.filter(l => C.canAccessLevel(l));
  const gami = {};
  await Promise.all(buka.map(async l => { try { gami[l] = await FB.getGami(l); } catch (e) {} }));
  const g = state.gami || { xp: 0, koin: 0, level_karakter: 1, streak: 0 };
  const xpMod = (g.xp || 0) % 500;
  const perLevel = buka.length ? `<h3 class="hub-grp">Progres per Level</h3><div class="hub-grid">${buka.map(l => { const x = gami[l] || { xp: 0, level_karakter: 1 }; return `<div class="hub-tile" style="cursor:default"><b>${l.toUpperCase()}</b><small>Lv ${x.level_karakter || 1} · ${x.xp || 0} XP</small></div>`; }).join("")}</div>` : "";
  const guruBox = FB.userIsGuru() ? `<div class="kc-guru-box" style="margin-top:14px"><div><b>🛠️ Akun ${peran()} terdaftar</b><br><small>Akses Dashboard Guru: kelola siswa, bank soal, hasil ujian, dan laporan.</small></div><a class="btn" href="./teacher.html">Buka Dashboard Guru</a></div>` : "";
  return `
    <div class="hub-id">
      <div class="hub-ava">${ava}</div>
      <div style="flex:1; min-width:200px">
        <h3 style="margin:0 0 2px">${esc(s.nama || "Siswa")}</h3>
        <div style="color:var(--gray); font-size:13px; margin-bottom:8px">${esc(state.user.email || "")}</div>
        <span class="hub-badge">${peran()}</span> ${s.kelas ? `<span class="hub-badge">Kelas ${esc(s.kelas)}</span>` : ""}
        <div style="margin-top:12px; font-size:13px; color:var(--gray)">Level ${g.level_karakter || 1} · ${xpMod}/500 XP menuju level berikutnya</div>
        <div class="hub-bar"><i style="width:${xpMod / 5}%"></i></div>
      </div>
    </div>
    <div class="hub-stat">
      <div><b>${hariIni}</b><small>🧠 Flashcard diingat hari ini</small></div>
      <div><b>Lv ${g.level_karakter || 1}</b><small>⭐ ${g.xp || 0} XP total</small></div>
      <div><b>${g.koin || 0}</b><small>🪙 Koin</small></div>
      <div><b>${g.streak || 0}</b><small>🔥 Streak hari</small></div>
    </div>
    ${perLevel}
    <h3 class="hub-grp">Pengaturan</h3>
    <label style="display:flex; align-items:center; gap:10px; cursor:pointer; padding:12px; background:rgba(42,50,112,.4); border:1px solid var(--border); border-radius:10px;">
      <input type="checkbox" ${window.isAutoPlayAudio && window.isAutoPlayAudio() ? "checked" : ""} onchange="setAutoPlayAudio(this.checked)" style="width:20px; height:20px;"/>
      <span style="flex:1;"><b>🔊 Auto-play audio Jepang</b><br><small style="color:var(--gray);">Pelafalan diputar otomatis setelah kamu rate flashcard</small></span>
    </label>
    ${guruBox}
    <button class="btn ghost danger" style="margin-top:16px;" onclick="logout()">Keluar</button>`;
}

/* =============================== TAB 2: AKSES =============================== */
async function sswTersedia() {
  try { await loadKelasAkses(); } catch (e) {}
  let list = [];
  try { list = await loadBidang(); } catch (e) {}
  return list.filter(b => b.aktif !== false);
}

async function tabAkses() {
  const { FB, state } = C;
  const s = state.siswa || {};
  if (!state.user) return `<div class="empty">Masuk dulu.</div>`;
  const guru = FB.userIsGuru();
  const nonaktif = s.status === "nonaktif";
  const jlpt = LVS.map(l => { const ok = C.canAccessLevel(l); return `<button class="hub-tile ${ok ? "" : "lock"}" onclick="${ok ? `pilihLevel('${l}')` : `toast('🔒 JLPT ${l.toUpperCase()} dikunci. Hubungi guru.')`}"><b>${ok ? "" : "🔒 "}JLPT ${l.toUpperCase()}</b><small>${ok ? "Terbuka · ketuk untuk belajar" : "Dikunci guru"}</small></button>`; }).join("");
  const jft = Object.entries(JFT_LV).map(([l, v]) => { const ok = C.canAccessLevel(l); return `<button class="hub-tile ${ok ? "" : "lock"}" onclick="${ok ? "route('jft')" : `toast('🔒 JFT ${v.nama} dikunci. Hubungi guru.')`}"><b>${ok ? "" : "🔒 "}JFT ${v.jp}</b><small>${v.nama}${ok ? "" : " · dikunci"}</small></button>`; }).join("");
  const bidang = await sswTersedia();
  const sswUmumTutup = !guru && s.aksesSsw === false;
  const ssw = bidang.map(b => {
    const ok = !sswUmumTutup && sswAllowed(b.slug) && b.hasContent !== false;
    const nama = esc(b.nama || b.slug);
    return `<button class="hub-tile ${ok ? "" : "lock"}" onclick="${ok ? `route('ssw-peta/${b.slug}')` : `toast('🔒 SSW ${nama.replace(/'/g, "")} dikunci. Hubungi guru.')`}"><b>${ok ? "" : "🔒 "}${nama}</b><small>${esc(b.jp || "")} · ${ok ? "Terbuka" : "Dikunci"}</small></button>`;
  }).join("");
  const akunInfo = `<div class="hub-info">
      <span>Peran akun</span><span><span class="hub-badge">${peran()}</span></span>
      <span>Kelas</span><span>${s.kelas ? `<b>${esc(s.kelas)}</b>` : '<i style="color:var(--gray)">Belum masuk kelas</i>'}</span>
      <span>Status akun</span><span><span class="hub-badge ${nonaktif ? "no" : "ok"}">${nonaktif ? "Nonaktif" : "Aktif"}</span></span>
    </div>
    <p style="font-size:12px; color:var(--gray); margin:10px 0 0">${guru ? "Peran, kelas, dan akses siswa diatur di Dashboard Guru." : "Kelas, peran, dan hak akses diatur oleh guru/admin supaya akunmu aman."}</p>
    ${guru ? `<a class="btn sm" style="margin-top:8px; display:inline-block" href="./teacher.html">🛠️ Atur kelas, status &amp; akses siswa</a>` : ""}`;
  const dasar = `<button class="hub-tile" onclick="route('kana')"><b>あ・ア Hiragana &amp; Katakana</b><small>Dasar menulis · tanpa pilih level</small></button>
    <button class="hub-tile" onclick="route('mensetsu')"><b>面接 Mensetsu</b><small>Wawancara kerja · mengikuti akses SSW</small></button>${guru ? `<button class="hub-tile" onclick="location.href='./teacher.html'"><b>師 Dashboard Guru</b><small>Bank soal, laporan, siswa</small></button>` : ""}`;
  LOADERS["kelola"] = kelolaLoader;
  const kelola = guru ? `<div class="hub-card" id="hc-kelola" style="margin-top:18px"><button onclick="hubNilai('kelola')"><span><b>⚙️ Kelola akses kelas &amp; siswa</b><small>Atur akses JLPT, JFT, tiap bidang SSW, kelas, status &amp; peran — langsung dari sini</small></span><span class="car">▶</span></button><div class="hub-body"></div></div>` : "";
  return `
    <h3 class="hub-grp" style="margin-top:4px">Akun</h3>${akunInfo}
    ${kelola}
    <h3 class="hub-grp">🎌 JLPT</h3><div class="hub-grid">${jlpt}</div>
    <h3 class="hub-grp">📘 JFT-Basic</h3><div class="hub-grid">${jft}</div>
    <h3 class="hub-grp">🛠️ SSW 特定技能 <small style="color:var(--gray); font-weight:400">(${bidang.length} bidang, akses tiap bidang terpisah)</small> ${sswUmumTutup ? '<span class="hub-badge no">Semua SSW ditutup</span>' : ""}</h3><div class="hub-grid">${ssw || '<div class="empty">Belum ada bidang.</div>'}</div>
    <h3 class="hub-grp">🎴 Dasar &amp; Wawancara</h3><div class="hub-grid">${dasar}</div>`;
}

/* =============================== TAB 3: NILAI =============================== */
let _jlptCache = null;
async function jlptHasil() {
  if (_jlptCache && _jlptCache.uid === uid() && Date.now() - _jlptCache.t < 60000) return _jlptCache.rows;
  let rows = [];
  try { rows = await C.FB.listHasilJLPT(300); } catch (e) { console.warn("hub: hasil JLPT gagal dimuat", e.message || e); }
  const lokal = LS.get(`shirose-jlpt-hasil:${uid()}`, []);   // cadangan lokal yang belum tersinkron
  const ada = new Set(rows.map(r => r.localId).filter(Boolean));
  rows = rows.concat(lokal.filter(r => !ada.has(r.localId)));
  _jlptCache = { uid: uid(), t: Date.now(), rows };
  return rows;
}

// Penilaian ala JLPT resmi — sama dengan js/jlpt-center.js (hitungJLPT): skor seksi 0–60/0–120, total /180, ambang lulus total + tiap seksi.
const JLPT_PASS = { n5: { overall: 80, cefr: "A1" }, n4: { overall: 90, cefr: "A2" }, n3: { overall: 95, cefr: "B1" }, n2: { overall: 90, cefr: "B2" }, n1: { overall: 100, cefr: "C1" } };
const jlptSecs = (lv) => (lv === "n5" || lv === "n4")
  ? [{ label: "言語知識・読解", max: 120, pass: 38, cats: ["kanji", "kotoba", "bunpou", "dokkai"] }, { label: "聴解", max: 60, pass: 19, cats: ["choukai"] }]
  : [{ label: "言語知識", max: 60, pass: 19, cats: ["kanji", "kotoba", "bunpou"] }, { label: "読解", max: 60, pass: 19, cats: ["dokkai"] }, { label: "聴解", max: 60, pass: 19, cats: ["choukai"] }];
function skorJlpt(h) {
  const cfg = JLPT_PASS[h.lv] || { overall: 90, cefr: "-" }, per = h.perKategori;
  if (!per || !Object.keys(per).length) return { total: Math.round((Number(h.skor) || 0) * 1.8), lulus: null, secs: [], cfg };   // data lama tanpa rincian → estimasi
  const secs = jlptSecs(h.lv).map(s => { let b = 0, t = 0; s.cats.forEach(c => { if (per[c]) { b += per[c].benar || 0; t += per[c].total || 0; } }); const skor = t ? Math.round(b / t * s.max) : 0; return { ...s, skor, lulus: skor >= s.pass }; });
  const total = secs.reduce((a, s) => a + s.skor, 0);
  return { total, secs, cfg, lulus: total >= cfg.overall && secs.every(s => s.lulus) };
}
async function detailJlpt(lv) {
  const rows = (await jlptHasil()).filter(r => r.lv === lv && r.jenis === "full");
  const best = {};
  for (const r of rows) {
    const m = /full-(\d+)/.exec(r.pkgId || ""); if (!m) continue;
    const n = +m[1], sc = skorJlpt(r);
    if (!best[n] || sc.total > best[n].total) best[n] = sc;
  }
  const ada = Object.values(best), cfg = JLPT_PASS[lv];
  const lulusN = ada.filter(x => x.lulus).length, tertinggi = ada.length ? Math.max(...ada.map(x => x.total)) : null;
  let kotak = "";
  for (let n = 1; n <= 20; n++) {
    const b = best[n];
    const tip = b ? (b.secs.length ? b.secs.map(s => `${s.label} ${s.skor}/${s.max}${s.lulus ? "" : " ✗"}`).join(" · ") + (b.lulus ? " · LULUS" : " · belum lulus") : "estimasi (data lama)") : "Belum dikerjakan";
    kotak += `<div title="${esc(tip)}" style="${b ? `border-color:${b.lulus === false ? "var(--red)" : b.lulus ? "var(--green)" : "var(--border)"}` : ""}">${String(n).padStart(2, "0")}<b style="color:${b ? (b.lulus === false ? "var(--red)" : b.lulus ? "var(--green)" : "var(--orange)") : "var(--gray-dim)"}">${b ? b.total : "–"}</b>${b && b.lulus != null ? `<small>${b.lulus ? "✔ lulus" : "✗"}</small>` : ""}</div>`;
  }
  return { ringkas: `${ada.length}/20 Full Exam · ${lulusN} lulus · tertinggi ${tertinggi ?? "–"}/180`,
    html: `<p style="font-size:12px; color:var(--gray); margin:0 0 8px">Skor memakai penilaian ala JLPT resmi: <b>/180</b>, lulus bila total ≥ <b>${cfg.overall}</b> (CEFR ≈ ${cfg.cefr}) <u>dan</u> tiap seksi di atas batas minimum. Tertinggi dari tiap Full Exam (1–20). Ketuk/tahan kotak untuk rincian seksi.</p><div class="hub-full">${kotak}</div>` };
}

async function bestJft() {
  // Skor terbaik per paket: gabungan hasil di akun (jft_hasil, juga dilihat guru) + cadangan lokal perangkat ini.
  const out = {};
  const taruh = (k, v) => { if (v && typeof v.pct === "number" && (!out[k] || v.pct > out[k].pct)) out[k] = { pct: v.pct, skor: v.skor ?? null }; };
  for (const [k, v] of Object.entries(LS.get(`shirose-jft-best:${uid()}`, {}))) taruh(k.replace(":", "_"), v);
  try { for (const r of await C.FB.listHasilJftOf(uid(), 300)) if (r.mode !== "latihan" && r.lv && r.kode) taruh(`${r.lv}_${r.kode}`, r); } catch (e) { console.warn("hub: hasil JFT gagal dimuat", e.message || e); }
  return out;
}

async function detailJft(lv) {
  const best = await bestJft();
  let html = ""; let done = 0;
  BLOK.forEach((r, b) => {
    html += `<div class="hub-h">Bab ${r[0]}–${r[1]}</div><div class="hub-full">${[0, 1, 2].map(p => { const x = best[`${lv}_b${b}p${p}`]; if (x) done++; return `<div>Paket ${p + 1}<b style="color:${warna(x ? x.pct * 100 : null)}">${x ? Math.round(x.pct * 100) + "%" : "–"}</b></div>`; }).join("")}</div>`;
  });
  let simInfo = "";
  if (lv === "ir2") {
    html += `<div class="hub-h">JFT Akhir · Simulasi Penuh (skor 10–250 · lulus A2 ≥ 200)</div><div class="hub-full">${[0, 1, 2, 3, 4].map(p => { const x = best[`${lv}_sim${p}`]; if (x) done++; return `<div>Paket ${p + 1}<b style="color:${x ? (x.skor >= 200 ? "var(--green)" : x.skor >= 175 ? "var(--orange)" : "var(--red)") : "var(--gray-dim)"}">${x ? x.skor : "–"}</b></div>`; }).join("")}</div><p style="font-size:11px; color:var(--gray); margin-top:8px">Skor simulasi hanya estimasi latihan, bukan skor resmi JFT-Basic.</p>`;
  }
  return { ringkas: `${done} paket sudah dikerjakan`, html: html || '<div class="empty">Belum ada data.</div>' };
}

async function detailSsw(slug) {
  const pack = await loadPack(slug);
  let P = null;
  try { P = await C.FB.loadSswProgres(slug); } catch (e) {}
  const lokal = LS.get(`shirose-ssw:${uid()}:${slug}`, null);
  if (lokal && (!P || (lokal.u || 0) > (P.u || 0))) P = lokal;
  const Q = (P && P.quiz) || {};
  const sk = (id) => Q[id] && Q[id].best >= 0 ? Q[id] : null;
  const row = (id, label, lulus) => { const q = sk(id); const w = q ? (lulus ? (q.best >= lulus ? "var(--green)" : "var(--red)") : warna(q.best)) : "var(--gray-dim)"; return `<div class="hub-row"><span>${label}</span><b style="color:${w}">${q ? q.best + "%" : "–"}${q && lulus ? (q.best >= lulus ? " ✔ lulus" : " ✗") : ""}${q && q.n > 1 ? ` <small style="color:var(--gray); font-weight:400">(${q.n}×)</small>` : ""}</b></div>`; };
  let html = "", total = 0, selesai = 0, sum = 0;
  const hitung = (id) => { total++; const q = sk(id); if (q) { selesai++; sum += q.best; } };
  for (const ch of pack.chapters) {
    const qs = (pack.quiz.bab && pack.quiz.bab[ch.id]) || [];
    if (!qs.length) continue;
    html += `<div class="hub-h">Bab ${esc(ch.no ?? "")} · ${esc(plain((ch.title && (ch.title.id || ch.title)) || ""))}</div>`;
    for (const q of qs) { hitung(q.id); html += row(q.id, tt(q)); }
  }
  const tema = pack.quiz.tema || [];
  if (tema.length) { html += `<div class="hub-h">Tema</div>`; for (const q of tema) { hitung(q.id); html += row(q.id, tt(q)); } }
  let fulls = [];
  try { fulls = fullQuizzes(pack); } catch (e) {}
  if (fulls.length) { html += `<div class="hub-h">Ujian Penuh (semua bab) · lulus ≥ 65%</div>`; for (const q of fulls) { hitung(q.id); html += row(q.id, tt(q), 65); } }
  return { ringkas: `${selesai}/${total} kuis dikerjakan · rata-rata ${selesai ? Math.round(sum / selesai) + "%" : "–"}`, html: html || '<div class="empty">Belum ada kuis.</div>' };
}

async function tabNilai() {
  const { state } = C;
  if (!state.user) return `<div class="empty">Masuk dulu.</div>`;
  const kartu = [];
  const add = (key, ico, judul, loader) => { LOADERS[key] = loader; kartu.push({ key, ico, judul }); };
  LVS.filter(l => C.canAccessLevel(l)).forEach(l => add(`jlpt:${l}`, "🎌", `JLPT ${l.toUpperCase()} · Full Exam`, () => detailJlpt(l)));
  Object.entries(JFT_LV).filter(([l]) => C.canAccessLevel(l)).forEach(([l, v]) => add(`jft:${l}`, "📘", `JFT ${v.jp} · ${v.nama}`, () => detailJft(l)));
  const bidang = await sswTersedia();
  const sswTutup = !C.FB.userIsGuru() && state.siswa?.aksesSsw === false;
  bidang.filter(b => !sswTutup && b.hasContent !== false && sswAllowed(b.slug)).forEach(b => add(`ssw:${b.slug}`, "🛠️", `SSW ${b.nama || b.slug}`, () => detailSsw(b.slug)));
  if (!kartu.length) return `<div class="empty"><div class="emoji">📭</div>Belum ada paket yang dibuka untukmu.<br><small>Hubungi guru untuk membuka akses.</small></div>`;
  return `<p style="font-size:13px; color:var(--gray); margin:0 0 10px">Nilai hanya dari paket yang kamu punya. Ketuk satu paket untuk melihat nilai detailnya.</p>
    ${kartu.map(k => `<div class="hub-card" id="hc-${k.key.replace(/[^a-z0-9]/gi, "_")}"><button onclick="hubNilai('${k.key}')"><span><b>${k.ico} ${esc(k.judul)}</b><small>Ketuk untuk lihat nilai</small></span><span class="car">▶</span></button><div class="hub-body"></div></div>`).join("")}`;
}

window.hubNilai = async (key) => {
  const el = document.getElementById("hc-" + key.replace(/[^a-z0-9]/gi, "_")); if (!el) return;
  const body = el.querySelector(".hub-body"), sub = el.querySelector("button small");
  if (el.classList.contains("open")) { el.classList.remove("open"); return; }
  el.classList.add("open");
  if (body.dataset.ok) return;
  body.innerHTML = '<div style="color:var(--gray); padding:10px">Memuat nilai…</div>';
  try {
    const r = await LOADERS[key]();
    body.innerHTML = r.html; if (sub) sub.textContent = r.ringkas; body.dataset.ok = "1";
  } catch (e) { body.innerHTML = `<div class="empty">Gagal memuat nilai: ${esc(e.message || e)}</div>`; }
};

/* =============== KELOLA AKSES (guru/admin) — dari dalam profil =============== */
const tri = (v) => typeof v === "boolean" ? (v ? "1" : "0") : "";
const triVal = (s) => s === "1" ? true : s === "0" ? false : null;
const toast = (m) => (window.toast ? window.toast(m) : console.log(m));
const K = { siswa: [], kelas: [], bidang: [], uid: null, kid: null, q: "" };
const triSel = (cur, on, off = "Bawaan / ikut kelas") => `<select onchange="${on}" style="min-height:36px"><option value="" ${cur === "" ? "selected" : ""}>${off}</option><option value="1" ${cur === "1" ? "selected" : ""}>Buka</option><option value="0" ${cur === "0" ? "selected" : ""}>Tutup</option></select>`;
async function kelolaLoader() {
  const { FB } = C;
  [K.siswa, K.kelas] = await Promise.all([FB.listSiswa().catch(() => []), FB.listKelas().catch(() => [])]);
  K.bidang = await sswTersedia();
  K.siswa.sort((a, b) => String(a.nama || "").localeCompare(String(b.nama || "")));
  K.kid = K.kelas[0]?.id || null; K.uid = null; K.q = "";
  return { ringkas: `${K.siswa.length} siswa · ${K.kelas.length} kelas`, html: `<div id="hk-root">${kelolaHtml()}</div>` };
}
const kelolaRender = () => { const r = document.getElementById("hk-root"); if (r) r.innerHTML = kelolaHtml(); };
function kelolaHtml() {
  const kls = K.kelas.find(k => k.id === K.kid);
  const kelasBox = kls ? `<p style="font-size:12px; color:var(--gray); margin:6px 0">Akses SSW untuk SEMUA siswa di kelas ini (kecuali siswa yang diatur sendiri).</p>` + K.bidang.map(b => `<div class="hub-row"><span>${esc(b.nama || b.slug)}</span>${triSel(tri((kls.aksesSswBidang || {})[b.slug]), `hubKelasSet('${kls.id}','${b.slug}',this.value)`, "Bawaan")}</div>`).join("") : '<div class="empty">Belum ada kelas.</div>';
  const q = K.q.toLowerCase();
  const daftar = K.siswa.filter(s => !q || (s.nama || "").toLowerCase().includes(q) || (s.email || "").toLowerCase().includes(q)).slice(0, 60);
  const s = K.siswa.find(x => x.uid === K.uid);
  return `<div class="hub-h">🎓 Akses per KELAS</div>
    <select onchange="hubKelasPilih(this.value)" style="min-height:40px; width:100%">${K.kelas.map(k => `<option value="${k.id}" ${k.id === K.kid ? "selected" : ""}>${esc(k.nama || k.id)}</option>`).join("")}</select>
    ${kelasBox}
    <div class="hub-h" style="margin-top:18px">👤 Akses per SISWA</div>
    <input type="search" placeholder="Cari nama / email…" value="${esc(K.q)}" oninput="hubSiswaCari(this.value)" style="width:100%; min-height:40px; margin-bottom:6px"/>
    <select onchange="hubSiswaPilih(this.value)" style="min-height:40px; width:100%"><option value="">— pilih siswa (${daftar.length}${K.siswa.length > daftar.length ? "+" : ""}) —</option>${daftar.map(x => `<option value="${x.uid}" ${x.uid === K.uid ? "selected" : ""}>${esc(x.nama || x.email)}${x.kelas ? " · " + esc(x.kelas) : ""}</option>`).join("")}</select>
    ${s ? siswaHtml(s) : ""}`;
}
function siswaHtml(s) {
  const { FB } = C, admin = FB.userIsAdmin(), dev = FB.userIsDeveloper(), role = s.role || "student", self = s.uid === C.state.user?.uid;
  const jftTutup = s.aksesJft === false;
  const chip = (on, label, fn) => `<span class="chip btn-chip ${on ? "on" : ""}" style="cursor:pointer; padding:8px 12px; display:inline-block; margin:2px" onclick="${fn}">${label}</span>`;
  const bol = (slug) => { const a = (s.aksesSswBidang || {})[slug]; return tri(a); };
  const kelasOpt = `<option value="">— tanpa kelas —</option>${K.kelas.map(k => `<option value="${esc(k.nama)}" ${k.nama === s.kelas ? "selected" : ""}>${esc(k.nama)}</option>`).join("")}`;
  return `<div style="margin-top:10px; padding:10px; border:1px solid var(--border-light); border-radius:10px">
    <b>${esc(s.nama || "")}</b> <small style="color:var(--gray)">${esc(s.email || "")}</small>
    <div class="hub-h">Kelas &amp; status</div>
    <div class="hub-row"><span>Kelas</span><select onchange="hubSiswaKelas(this.value)" style="min-height:36px">${kelasOpt}</select></div>
    <div class="hub-row"><span>Status akun</span><select onchange="hubSiswaStatus(this.value)" style="min-height:36px" ${self ? "disabled" : ""}><option value="aktif" ${s.status !== "nonaktif" ? "selected" : ""}>Aktif</option><option value="nonaktif" ${s.status === "nonaktif" ? "selected" : ""}>Nonaktif</option></select></div>
    <div class="hub-row"><span>Peran</span>${admin && !self ? `<select onchange="hubSiswaRole(this.value)" style="min-height:36px"><option value="student" ${role === "student" ? "selected" : ""}>Siswa</option><option value="guru" ${role === "guru" ? "selected" : ""}>Guru</option>${dev ? `<option value="admin" ${role === "admin" ? "selected" : ""}>Admin</option>` : ""}</select>` : `<b>${role === "student" ? "Siswa" : role === "guru" ? "Guru" : "Admin"}</b>`}</div>
    <div class="hub-h">JLPT</div>
    <div>${LVS.map(l => chip(!!s.aksesLevel?.[l], l.toUpperCase(), `hubSiswaLv('${l}')`)).join("")}</div>
    <div class="hub-h">JFT-Basic</div>
    <div>${chip(!jftTutup, "JFT " + (jftTutup ? "Tutup" : "Buka"), "hubSiswaJft()")}${Object.entries(JFT_LV).map(([l, v]) => chip(!jftTutup && s.aksesJftLevel?.[l] !== false, v.jp, `hubSiswaJftLv('${l}')`)).join("")}</div>
    <div class="hub-h">SSW — tiap bidang <span style="font-weight:400; color:var(--gray)">(Bawaan = ikut kelas)</span></div>
    <div class="hub-row"><span>Semua SSW (saklar utama)</span>${chip(s.aksesSsw !== false, s.aksesSsw === false ? "Ditutup" : "Terbuka", "hubSiswaSsw()")}</div>
    ${K.bidang.map(b => `<div class="hub-row"><span>${esc(b.nama || b.slug)}</span>${triSel(bol(b.slug), `hubSiswaBidang('${b.slug}',this.value)`)}</div>`).join("")}
  </div>`;
}
const cur = () => K.siswa.find(x => x.uid === K.uid);
const jalan = async (fn, ok) => { try { await fn(); toast("✓ " + ok); } catch (e) { toast("❌ " + (e.message || e)); } kelolaRender(); };
window.hubKelasPilih = (id) => { K.kid = id; kelolaRender(); };
window.hubKelasSet = (id, slug, v) => jalan(async () => { await C.FB.setAksesSswKelas(id, slug, triVal(v)); const k = K.kelas.find(x => x.id === id); k.aksesSswBidang = { ...(k.aksesSswBidang || {}) }; const t = triVal(v); if (t === null) delete k.aksesSswBidang[slug]; else k.aksesSswBidang[slug] = t; }, "Akses kelas disimpan");
window.hubSiswaCari = (q) => { K.q = q; const r = document.getElementById("hk-root"); const sel = r && r.querySelectorAll("select")[1]; if (!sel) return; const l = q.toLowerCase(); const d = K.siswa.filter(s => !l || (s.nama || "").toLowerCase().includes(l) || (s.email || "").toLowerCase().includes(l)).slice(0, 60); sel.innerHTML = `<option value="">— pilih siswa (${d.length}) —</option>` + d.map(x => `<option value="${x.uid}">${esc(x.nama || x.email)}${x.kelas ? " · " + esc(x.kelas) : ""}</option>`).join(""); };
window.hubSiswaPilih = (uid) => { K.uid = uid || null; kelolaRender(); };
window.hubSiswaKelas = (v) => { const s = cur(); jalan(async () => { await C.FB.updateKelasSiswa(s.uid, v); s.kelas = v; }, "Kelas disimpan"); };
window.hubSiswaStatus = (v) => { const s = cur(); jalan(async () => { await C.FB.setStatusSiswa(s.uid, v === "aktif"); s.status = v; }, "Status disimpan"); };
window.hubSiswaRole = (v) => { const s = cur(); jalan(async () => { await C.FB.setRole(s.uid, v); s.role = v; }, "Peran disimpan"); };
window.hubSiswaLv = (l) => { const s = cur(); jalan(async () => { const m = { n5: false, n4: false, n3: false, n2: false, n1: false, ...(s.aksesLevel || {}) }; m[l] = !m[l]; await C.FB.updateAksesSiswa(s.uid, m); s.aksesLevel = m; }, "Akses JLPT " + l.toUpperCase() + " disimpan"); };
window.hubSiswaJft = () => { const s = cur(); jalan(async () => { const baru = s.aksesJft === false; await C.FB.setAksesJft(s.uid, baru); s.aksesJft = baru; }, "Akses JFT disimpan"); };
window.hubSiswaJftLv = (l) => { const s = cur(); jalan(async () => { const tutup = s.aksesJft === false, peta = {}; Object.keys(JFT_LV).forEach(k => peta[k] = tutup ? false : s.aksesJftLevel?.[k] !== false); peta[l] = !peta[l]; if (tutup) { await C.FB.setAksesJft(s.uid, true); s.aksesJft = true; } await C.FB.setAksesJftLevel(s.uid, peta); s.aksesJftLevel = peta; }, "Akses JFT disimpan"); };
window.hubSiswaSsw = () => { const s = cur(); jalan(async () => { const baru = s.aksesSsw === false; await C.FB.setAksesSsw(s.uid, baru); s.aksesSsw = baru; }, "Saklar SSW disimpan"); };
window.hubSiswaBidang = (slug, v) => { const s = cur(); jalan(async () => { const t = triVal(v); await C.FB.setAksesSswBidang(s.uid, slug, t); s.aksesSswBidang = { ...(s.aksesSswBidang || {}) }; if (t === null) delete s.aksesSswBidang[slug]; else s.aksesSswBidang[slug] = t; }, "Akses bidang disimpan"); };
