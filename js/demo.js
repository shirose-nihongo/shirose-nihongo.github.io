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
  const MSG = "Fitur ini terkunci di akun Demo. Minta akun lengkap ke guru/moderator untuk membuka semua materi.";
  const lockToast = (extra) => { if (window.toast) window.toast("🔒 " + (extra || MSG)); };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /** Banner kecil di atas daftar materi: "Demo: tampil X dari Y". */
  const note = (shown, total, what) => !on() ? "" :
    `<div class="demo-note">🎁 <b>Akun Demo</b> — ${esc(what || "materi")}: ${shown} dari ${total} dibuka (10%). Sisanya terkunci.</div>`;

  /** Panel "terkunci" untuk halaman penuh. */
  const lockedPanel = (title, backRoute, extra) =>
    `<div class="panel"><h2>🔒 ${esc(title || "Terkunci")}</h2><div class="empty"><div class="emoji">🔒</div>${esc(extra || MSG)}</div>` +
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
    el.innerHTML = `🎁 <b>MODE DEMO</b> · semua materi dibuka sebatas 10% — <span>minta akun lengkap ke guru untuk akses penuh</span>`;
  }

  // Gaya (disuntik sekali; tidak perlu mengubah file CSS lain).
  if (!document.getElementById("demo-css")) {
    const st = document.createElement("style");
    st.id = "demo-css";
    st.textContent =
      "#demo-bar{background:linear-gradient(90deg,#f59e0b,#ef4444);color:#fff;text-align:center;font-size:12.5px;padding:6px 12px;position:sticky;top:0;z-index:50}" +
      "#demo-bar span{opacity:.92}" +
      ".demo-note{background:rgba(245,158,11,.14);border:1px solid rgba(245,158,11,.45);border-radius:10px;padding:8px 12px;margin:0 0 10px;font-size:13px}" +
      ".demo-lock{opacity:.5;filter:grayscale(.6);cursor:not-allowed!important}";
    document.head.appendChild(st);
  }

  window.DEMO = { PCT, on, cap, slice, MSG, lockToast, note, lockedPanel, bar };
})();
