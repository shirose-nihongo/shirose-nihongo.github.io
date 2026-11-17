/* Tombol 💾 Simpan di bar atas (samping Font): simpan ke akun, unduh/muat file save, pulihkan. */
export function initSaveData(FB, state) {
  const $ = (id) => document.getElementById(id);
  const ui = () => { const g = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } }; return { tema: g("shirose-theme"), font: g("shirose-jpfont"), level: g("shirose-lvl") }; };
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function css() {
    if ($("sv-css")) return; const s = document.createElement("style"); s.id = "sv-css";
    s.textContent = `#sv-ov{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;padding:16px;background:radial-gradient(ellipse at top,#3a2466 0,#150d2b 70%,#0b0618 100%)}
#sv-ov.open{display:flex}#sv-box{width:min(440px,100%);max-height:92vh;overflow:auto;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.18);border-radius:20px;padding:20px;color:#fff;box-shadow:0 20px 60px #0008}
#sv-box h2{margin:0 0 4px;font-size:20px}#sv-box p{margin:4px 0 12px;color:#cdbfe8;font-size:13px}#sv-box .sv-st{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0 14px}
#sv-box .sv-st div{background:rgba(255,255,255,.08);border-radius:12px;padding:8px 10px;font-size:12px;color:#cdbfe8}#sv-box .sv-st b{display:block;font-size:17px;color:#fff}
#sv-box button{width:100%;margin:5px 0;padding:12px;border-radius:12px;border:0;font-weight:700;font-size:14px;cursor:pointer}
#sv-box .sv-a{background:linear-gradient(135deg,#ffd700,#e0a000);color:#2a1810}#sv-box .sv-b{background:rgba(255,255,255,.14);color:#fff}#sv-box .sv-x{background:transparent;color:#cdbfe8}
#sv-msg{min-height:18px;font-size:12.5px;color:#9ff0c0;margin-top:6px}#sv-msg.err{color:#ff9aa8}.sv-top .th-txt{display:inline}`;
    document.head.appendChild(s);
  }
  function ov() {
    if ($("sv-ov")) return $("sv-ov"); const d = document.createElement("div"); d.id = "sv-ov";
    d.innerHTML = `<div id="sv-box"><h2>💾 Simpan Data</h2><p>Simpan progres supaya aman: level, XP, item (termasuk hadiah gacha), pakaian, tema/background, dan font.</p><div class="sv-st" id="sv-st"></div>
<button class="sv-a" id="sv-cloud">☁️ Simpan ke akun</button><button class="sv-b" id="sv-restore">♻️ Pulihkan dari akun</button>
<button class="sv-b" id="sv-dl">⬇️ Unduh file save</button><button class="sv-b" id="sv-up">⬆️ Muat file save</button><input type="file" id="sv-file" accept="application/json,.json" style="display:none">
<div id="sv-msg"></div><button class="sv-x" id="sv-close">Tutup</button></div>`;
    document.body.appendChild(d); d.addEventListener("click", (e) => { if (e.target === d) d.classList.remove("open"); }); $("sv-close").onclick = () => d.classList.remove("open"); return d;
  }
  const msg = (t, err) => { const m = $("sv-msg"); m.textContent = t; m.className = err ? "err" : ""; };
  async function build() {
    const g = state.gami || {}, inv = state.siswa?.karakter?.inventory || [], u = ui();
    return { app: "shirose-nihongo", v: 1, savedAt: Date.now(), levelAkun: g.level_karakter || 1, xp: g.xp || 0, koin: g.koin || 0, inventory: inv, equipped: state.siswa?.karakter?.equipped || {}, ui: u };
  }
  function stats() {
    const g = state.gami || {}, inv = state.siswa?.karakter?.inventory || [], u = ui();
    $("sv-st").innerHTML = `<div>Level<b>Lv ${esc(g.level_karakter || 1)}</b></div><div>XP (level aktif)<b>${esc(g.xp || 0)}</b></div><div>Item dimiliki<b>${inv.length}</b></div><div>Tema / Font<b style="font-size:13px">${esc(u.tema || "ungu")} · ${esc(u.font || "bawaan")}</b></div>`;
  }
  async function reload() { try { state.gami = await FB.getGami(state.level); const c = document.getElementById("chip-lv"); if (c) c.textContent = state.gami.level_karakter || 1; } catch (e) {} }
  function applyUi(u) { if (!u) return; try { if (u.tema) localStorage.setItem("shirose-theme", u.tema); if (u.font) localStorage.setItem("shirose-jpfont", u.font); } catch (e) {} }
  function open() {
    css(); const d = ov(); d.classList.add("open"); stats(); msg("");
    const logged = !!state.user;
    $("sv-cloud").onclick = async () => { if (!logged) return msg("Masuk dulu untuk simpan ke akun (atau pakai Unduh file).", 1); msg("Menyimpan…");
      try { const r = await FB.saveSaveData(ui()); msg(`✅ Tersimpan di akun · Lv ${r.levelAkun} · ${Object.keys(r.gami).length} level JLPT/JFT`); } catch (e) { msg("❌ " + e.message, 1); } };
    $("sv-restore").onclick = async () => { if (!logged) return msg("Masuk dulu.", 1); msg("Memulihkan…");
      try { const s = await FB.getSaveData(); if (!s) return msg("Belum ada save di akun ini.", 1); const r = await FB.restoreSaveData(s); applyUi(s.ui); await reload(); stats();
        msg(`✅ Dipulihkan · XP naik di ${r.xpDinaikkan} level · ${r.item} item. Memuat ulang tema…`); setTimeout(() => location.reload(), 1200); } catch (e) { msg("❌ " + e.message, 1); } };
    $("sv-dl").onclick = async () => { const o = await build(); try { if (logged) { const s = await FB.getSaveData().catch(() => null); if (s) o.akun = s; } } catch (e) {}
      const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(o, null, 1)], { type: "application/json" })); a.download = `shirose-save-${new Date().toISOString().slice(0, 10)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); msg("✅ File save diunduh."); };
    $("sv-up").onclick = () => $("sv-file").click();
    $("sv-file").onchange = async (e) => { const f = e.target.files[0]; e.target.value = ""; if (!f) return;
      try { const o = JSON.parse(await f.text()); if (o.app !== "shirose-nihongo") throw new Error("Bukan file save Shirose");
        applyUi(o.ui); if (logged) { const snap = o.akun || { gami: {}, karakter: { inventory: o.inventory || [], equipped: o.equipped || {} }, levelAkun: o.levelAkun }; const r = await FB.restoreSaveData(snap); await reload(); msg(`✅ File dimuat · ${r.item} item. Memuat ulang…`); } else msg("✅ Tema & font dimuat (masuk dulu untuk memulihkan XP/item). Memuat ulang…");
        setTimeout(() => location.reload(), 1200); } catch (er) { msg("❌ " + er.message, 1); } };
  }
  function mount() {
    const tr = document.querySelector(".topbar-right"); if (!tr) return false; if ($("sv-btn")) return true;
    const w = document.createElement("div"); w.className = "th-wrap sv-top"; w.innerHTML = '<button class="th-btn" id="sv-btn" title="Simpan data" aria-label="Simpan data">💾 <span class="th-txt">Simpan</span></button>';
    const fn = $("fn-menu"), anchor = fn ? fn.parentNode : null; tr.insertBefore(w, anchor ? anchor.nextSibling : tr.firstChild);
    $("sv-btn").onclick = (e) => { e.stopPropagation(); open(); }; return true;
  }
  let n = 0; const t = setInterval(() => { if ((mount() && $("fn-menu")) || ++n > 40) clearInterval(t); }, 250);
}
