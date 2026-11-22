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
import { loadBidang, sswAllowed, loadKelasAkses, loadPack, fullQuizzes, esc, plain } from "./ssw-core.js?v=20261122a";

let C = null;   // { FB, state, renderCharacter, DEFAULT_EQUIPPED, canAccessLevel }
export function initHub(ctx) { C = ctx; }

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
.hub-full div b{display:block; font-size:15px;}
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
  return `
    <h3 class="hub-grp" style="margin-top:4px">Akun</h3>${akunInfo}
    <h3 class="hub-grp">🎌 JLPT</h3><div class="hub-grid">${jlpt}</div>
    <h3 class="hub-grp">📘 JFT-Basic</h3><div class="hub-grid">${jft}</div>
    <h3 class="hub-grp">🛠️ SSW 特定技能 ${sswUmumTutup ? '<span class="hub-badge no">Semua SSW ditutup</span>' : ""}</h3><div class="hub-grid">${ssw || '<div class="empty">Belum ada bidang.</div>'}</div>
    <p style="font-size:12px; color:var(--gray); margin-top:12px">Mensetsu (wawancara) mengikuti akses SSW per bidang.</p>`;
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

async function detailJlpt(lv) {
  const rows = (await jlptHasil()).filter(r => r.lv === lv && r.jenis === "full");
  const best = {};
  for (const r of rows) {
    const m = /full-(\d+)/.exec(r.pkgId || ""); if (!m) continue;
    const n = +m[1], p = Number(r.skor);
    if (!best[n] || p > best[n].p) best[n] = { p, benar: r.benar, total: r.total };
  }
  const sel = Object.keys(best).length;
  let kotak = "";
  for (let n = 1; n <= 20; n++) { const b = best[n]; kotak += `<div title="${b ? `${b.benar}/${b.total} benar` : "Belum dikerjakan"}">${String(n).padStart(2, "0")}<b style="color:${warna(b?.p)}">${pctTxt(b?.p)}</b></div>`; }
  const rata = sel ? Object.values(best).reduce((a, x) => a + x.p, 0) / sel : null;
  return { ringkas: `${sel}/20 Full Exam · rata-rata ${pctTxt(rata)}`, html: `<p style="font-size:12px; color:var(--gray); margin:0 0 8px">Skor terbaik tiap Full Exam (1–20).</p><div class="hub-full">${kotak}</div>` };
}

async function bestJft() {
  const lokal = LS.get(`shirose-jft-best:${uid()}`, {});
  let remote = {};
  try { remote = (C.FB.loadBestJft && await C.FB.loadBestJft()) || {}; } catch (e) {}
  const out = {};
  for (const [k, v] of Object.entries(lokal)) out[k.replace(":", "_")] = v;
  for (const [k, v] of Object.entries(remote)) if (v && typeof v === "object" && typeof v.pct === "number" && (!out[k] || v.pct > out[k].pct)) out[k] = v;
  // Sinkronkan hasil lokal yang belum ada/lebih tinggi ke akun (supaya muncul di perangkat lain & di guru).
  try { for (const [k, v] of Object.entries(out)) { const r = remote[k]; if (!r || r.pct < v.pct) C.FB.simpanBestJft && C.FB.simpanBestJft(k, v).catch(() => {}); } } catch (e) {}
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
    html += `<div class="hub-h">JFT Akhir · Simulasi Penuh (skor 10–250)</div><div class="hub-full">${[0, 1, 2, 3, 4].map(p => { const x = best[`${lv}_sim${p}`]; if (x) done++; return `<div>Paket ${p + 1}<b style="color:${x ? (x.skor >= 200 ? "var(--green)" : x.skor >= 175 ? "var(--orange)" : "var(--red)") : "var(--gray-dim)"}">${x ? x.skor : "–"}</b></div>`; }).join("")}</div><p style="font-size:11px; color:var(--gray); margin-top:8px">Skor simulasi hanya estimasi latihan, bukan skor resmi JFT-Basic.</p>`;
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
  const row = (id, label) => { const q = sk(id); return `<div class="hub-row"><span>${label}</span><b style="color:${warna(q ? q.best : null)}">${q ? q.best + "%" : "–"}${q && q.n > 1 ? ` <small style="color:var(--gray); font-weight:400">(${q.n}×)</small>` : ""}</b></div>`; };
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
  if (fulls.length) { html += `<div class="hub-h">Ujian Penuh (semua bab)</div>`; for (const q of fulls) { hitung(q.id); html += row(q.id, tt(q)); } }
  return { ringkas: `${selesai}/${total} kuis dikerjakan · rata-rata ${selesai ? Math.round(sum / selesai) + "%" : "–"}`, html: html || '<div class="empty">Belum ada kuis.</div>' };
}

const LOADERS = {};
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
