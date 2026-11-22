/* ============================================================
   SHIROSE NIHONGO — AKUN DEMO (batas 10% materi)
   Script klasik (bukan module) supaya bisa dipakai semua modul lewat window.DEMO.

   Aturan demo (siswa/{uid}.isDemo === true):
     - Kosakata / Kanji / Bunpou + Hafalan (flashcard)  → 10% pertama dari tiap daftar
     - JLPT Center  → 10% paket tiap jenis (Full 10 → 1, latihan 20 → 2)
     - Choukai & kategori ujian → 10% paket / kategori pertama
     - JFT-Basic    → hanya 2 paket ujian (Bab 1–6, Paket 1 & 2); simulasi & latihan cepat terkunci
     - SSW          → Bab 1, subbab 1–3 · kosakata/flashcard 10% · 1 ujian penuh
   CATATAN KEAMANAN: pembatas ini berjalan di browser (situs statis tanpa server).
   Cukup untuk demo/promosi, tapi bukan pengaman data (file JSON di repo tetap publik).
   ============================================================ */
(function () {
  const PCT = 0.1;
  const state = () => (window.__SHIROSE_STATE || {});
  const on = () => { const s = state(); const k = s.siswa && String(s.siswa.kelas || "").trim().toLowerCase(); return !!(s.user && s.siswa && (s.siswa.isDemo === true || k === "demo") && (s.siswa.role || "student") === "student"); };
  const cap = (n) => Math.max(1, Math.ceil((Number(n) || 0) * PCT));
  const slice = (arr) => (on() && Array.isArray(arr)) ? arr.slice(0, cap(arr.length)) : arr;
  const MSG = "Fitur ini terkunci di akun Demo. Silakan hubungi admin untuk membeli akses penuh (WhatsApp), atau lihat harga akses di halaman Langganan.";
  const HARGA_URL = "./landing.html#langganan";   // bagian "Langganan" di landing = info paket & harga
  const ADMIN_WA = "https://wa.me/6285173269876";   // chat pribadi admin (bukan grup)
  const PAKET_DEFAULT = [
    { id: "bulanan",  label: "📅 Paket Bulanan",  teks: "Halo admin Shirose Nihongo, saya mau membeli Paket BULANAN. Mohon info harga dan cara pembayarannya." },
    { id: "lifetime", label: "♾️ Paket Lifetime", teks: "Halo admin Shirose Nihongo, saya mau membeli Paket LIFETIME. Mohon info harga dan cara pembayarannya." }
  ];
  const paketList = () => { const C = window.LANDING_CONFIG || {}; return (Array.isArray(C.paket) && C.paket.length) ? C.paket : PAKET_DEFAULT; };
  const adminUrl = () => { const C = window.LANDING_CONFIG || {}; return String((C.langganan && C.langganan.url) || ADMIN_WA).trim(); };
  /** Link WhatsApp admin dengan pesan sesuai paket yang dipilih (+ konteks: halaman yang terkunci). */
  const waUrl = (teks) => {
    const u = adminUrl();
    const ctx = location.hash ? ` (dari akun Demo, halaman ${location.hash})` : " (dari akun Demo)";
    return u + (u.indexOf("?") < 0 ? "?" : "&") + "text=" + encodeURIComponent((teks || paketList()[0].teks) + ctx);
  };
  const ctaHtml = () =>
    `<div class="demo-cta">` +
      paketList().map((p) => `<a class="btn gold" href="${esc(waUrl(p.teks))}" target="_blank" rel="noopener noreferrer">${esc(p.label)}</a>`).join("") +
      `<a class="btn ghost" href="${HARGA_URL}" data-open-pricing target="_blank" rel="noopener">💰 Lihat harga akses</a></div>`;
  /** Dipanggil saat tombol/kartu terkunci ditekan: popup ajakan beli akses. */
  const lockToast = (extra) => {
    const old = document.getElementById("demo-lock-modal"); if (old) old.remove();
    const m = document.createElement("div");
    m.id = "demo-lock-modal";
    m.innerHTML = `<div class="demo-lock-box"><div class="demo-lock-ico">🔒</div>` +
      `<h3>Fitur terkunci di akun Demo</h3>` +
      `<p>${esc(extra || "Pilih paket di bawah untuk membeli akses penuh lewat chat admin, atau lihat harga akses.")}</p>` +
      ctaHtml() + `<button class="btn ghost" data-x>Tutup</button></div>`;
    m.addEventListener("click", (e) => { if (e.target === m || (e.target.closest && e.target.closest("[data-x]"))) m.remove(); });
    document.body.appendChild(m);
  };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /** Banner kecil di atas daftar materi: "Demo: tampil X dari Y". */
  const note = (shown, total, what) => !on() ? "" :
    `<div class="demo-note">🎁 <b>Akun Demo</b> — ${esc(what || "materi")}: ${shown} dari ${total} dibuka (10%). Sisanya terkunci.<br><small>Mau akses penuh? Pilih paket lalu chat admin.</small>${ctaHtml()}</div>`;

  /** Panel "terkunci" untuk halaman penuh. */
  const lockedPanel = (title, backRoute, extra) =>
    `<div class="panel"><h2>🔒 ${esc(title || "Terkunci")}</h2><div class="empty"><div class="emoji">🔒</div>${esc(extra || MSG)}</div>` + ctaHtml() +
    `<button class="btn ghost" onclick="route('${backRoute || "home"}')">← Kembali</button></div>`;

  /** Pita DEMO tetap di atas halaman (dipanggil dari onAuth). */
  function bar() {
    let el = document.getElementById("demo-bar");
    if (!on()) { if (el) el.remove(); return; }
    if (!el) {
      el = document.createElement("div");
      el.id = "demo-bar";
      const app = document.getElementById("app");
      if (app && app.parentNode) app.parentNode.insertBefore(el, app); else document.body.prepend(el);
    }
    el.innerHTML = `🎁 <b>MODE DEMO</b> · semua materi dibuka sebatas 10% — <span>hubungi admin untuk membeli akses penuh · <a href="${HARGA_URL}" data-open-pricing target="_blank" rel="noopener" style="color:#fff;text-decoration:underline">lihat harga</a></span>`;
  }

  // Gaya (disuntik sekali; tidak perlu mengubah file CSS lain).
  if (!document.getElementById("demo-css")) {
    const st = document.createElement("style");
    st.id = "demo-css";
    st.textContent =
      "#demo-bar{background:linear-gradient(90deg,#f59e0b,#ef4444);color:#fff;text-align:center;font-size:12.5px;padding:6px 12px;position:sticky;top:0;z-index:50}" +
      "#demo-bar span{opacity:.92}" +
      ".demo-note{background:rgba(245,158,11,.14);border:1px solid rgba(245,158,11,.45);border-radius:10px;padding:8px 12px;margin:0 0 10px;font-size:13px}" +
      ".demo-lock{opacity:.5;filter:grayscale(.6);cursor:pointer!important}" +
      ".materi-item.demo-lock{position:relative}.materi-item.demo-lock::after{content:\"🔒\";position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:16px}" +
      ".demo-cta{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:10px 0}" +
      ".demo-cta .btn{text-decoration:none}" +
      "#demo-lock-modal{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px}" +
      ".demo-lock-box{background:var(--card,#1e1b2e);color:var(--text,#fff);border-radius:16px;padding:22px 18px;max-width:380px;width:100%;text-align:center}" +
      ".demo-lock-ico{font-size:40px}.demo-lock-box h3{margin:6px 0}.demo-lock-box p{font-size:14px;opacity:.85}";
    document.head.appendChild(st);
  }

  window.DEMO = { PCT, on, cap, slice, MSG, lockToast, note, lockedPanel, bar, waUrl };
})();
