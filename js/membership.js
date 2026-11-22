/* Membership / Berlangganan Shirose Nihongo.
 * Dipakai landing.html dan index.html. Harga, catatan, dan nomor WhatsApp dibaca dari
 * js/landing-config.js (window.LANDING_CONFIG.membership dan .langganan.url).
 * - Daftar harga berbentuk pamflet (tab JLPT / JFT-Basic / SSW), dibuka sebagai lapisan
 *   di atas halaman: halaman belajar, hash/route, dan progres TIDAK diubah.
 * - Tombol Kembali, tombol Back browser/HP, dan Esc menutup daftar harga.
 * - Elemen apa pun dengan atribut [data-open-pricing] membuka daftar harga.
 */
(function () {
  "use strict";
  var C = window.LANDING_CONFIG || {};
  var M = C.membership || {};
  var OPEN = false, lastFocus = null, root = null, STATE_KEY = "shirosePricing";

  /* ---------- nomor WhatsApp: hanya dari config ---------- */
  function waBase() {
    var u = ((C.langganan || {}).url || "").trim();
    return /^https:\/\/wa\.me\/\d{8,15}\/?$/i.test(u) ? u.replace(/\/$/, "") : "";
  }
  function rupiah(n) { return "Rp" + Number(n).toLocaleString("id-ID"); }
  function hasPrice(v) { return typeof v === "number" && v > 0; }
  function waLink(nama, durasi, harga) {
    var base = waBase(); if (!base) return "";
    var lines = [
      "Halo admin Shirose Nihongo, saya mau berlangganan.",
      "Membership: " + nama,
      "Durasi: " + durasi,
      "Harga: " + (hasPrice(harga) ? rupiah(harga) : "mohon info harga"),
      "Mohon info untuk melanjutkan pembayaran."
    ];
    return base + "?text=" + encodeURIComponent(lines.join("\n"));
  }

  /* ---------- gaya (mandiri, tidak bergantung CSS halaman) ---------- */
  function addStyle() {
    if (document.getElementById("mb-style")) return;
    var s = document.createElement("style"); s.id = "mb-style";
    s.textContent = [
      "#mb-root{position:fixed;inset:0;z-index:100000;background:linear-gradient(to bottom,#1c0e1e,#2b1631);color:#fff;overflow-y:auto;-webkit-overflow-scrolling:touch;font-family:'Zen Kaku Gothic New',system-ui,-apple-system,sans-serif;line-height:1.5}",
      "#mb-root *{box-sizing:border-box}",
      ".mb-bar{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:12px;padding:12px 16px;background:rgba(28,14,30,.94);backdrop-filter:blur(8px);border-bottom:1px solid rgba(255,183,213,.25)}",
      ".mb-back{border:1px solid rgba(255,183,213,.5);background:rgba(255,255,255,.06);color:#fff;border-radius:999px;padding:9px 16px;font:inherit;font-weight:700;font-size:14px;cursor:pointer;min-height:42px;white-space:nowrap;flex:none}",
      ".mb-back:hover{background:rgba(255,183,213,.18)}",
      ".mb-ttl{font-size:18px;font-weight:800}",
      ".mb-wrap{max-width:980px;margin:0 auto;padding:16px 16px 60px}",
      ".mb-lead{color:#e7cfe0;font-size:15px;margin:2px 0 14px}",
      ".mb-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}",
      ".mb-tab{border:1px solid rgba(255,183,213,.35);background:rgba(255,255,255,.05);color:#f6dcea;border-radius:999px;padding:10px 20px;font:inherit;font-weight:800;font-size:14.5px;cursor:pointer;min-height:44px}",
      ".mb-tab[aria-selected=true]{background:linear-gradient(135deg,#ef6a9a,#f9a8c9);border-color:transparent;color:#2a1022}",
      /* pamflet */
      ".mb-pam{background:#fffaf5;color:#2a1b26;border-radius:22px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.45)}",
      ".mb-pam-h{background:linear-gradient(135deg,#ef6a9a,#f9a8c9 70%,#ffd3e4);padding:22px 20px 18px;color:#2a1022}",
      ".mb-pam-k{font-size:12px;font-weight:800;letter-spacing:.14em;opacity:.8}",
      ".mb-pam-t{font-family:'Shippori Mincho B1',serif;font-size:clamp(26px,5vw,36px);font-weight:800;line-height:1.15;margin-top:2px}",
      ".mb-pam-s{font-size:14px;margin-top:6px;font-weight:600}",
      ".mb-pam-b{padding:6px 14px 16px}",
      ".mb-grp{font-size:13px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#c2457a;margin:16px 4px 6px}",
      ".mb-th{display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:10px;padding:8px 10px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#8a6b7c;border-bottom:2px solid #f3d2e0}",
      ".mb-row{display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:10px;align-items:center;padding:12px 10px;border-bottom:1px solid #f3e3ea}",
      ".mb-row:last-child{border-bottom:0}",
      ".mb-name{font-size:16px;font-weight:800}",
      ".mb-jp{font-size:12.5px;color:#8a6b7c}",
      ".mb-ket{font-size:12.5px;color:#6b5260;margin-top:2px}",
      ".mb-opt{display:flex;flex-direction:column;gap:6px;background:#fff0f5;border:1px solid #f6d3e1;border-radius:14px;padding:10px 12px}",
      ".mb-opt.na{background:transparent;border-style:dashed;color:#a8909c;font-size:13px;align-items:center;justify-content:center;min-height:72px}",
      ".mb-dur{display:none;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#8a6b7c}",
      ".mb-price{font-size:19px;font-weight:800;color:#c2185b}",
      ".mb-price.none{font-size:13px;font-weight:700;color:#8a6b7c}",
      ".mb-buy{display:inline-flex;align-items:center;justify-content:center;text-align:center;border:0;border-radius:999px;padding:9px 12px;font:inherit;font-weight:800;font-size:13px;cursor:pointer;text-decoration:none;min-height:42px;background:#1faa59;color:#fff}",
      ".mb-buy:hover{filter:brightness(1.08)}",
      ".mb-buy.off{background:#b9a5b0;color:#fff;cursor:not-allowed;pointer-events:none}",
      ".mb-note{margin:14px 4px 4px;font-size:13px;color:#5a4452;background:#fff0f5;border-left:4px solid #ef6a9a;border-radius:10px;padding:12px 14px}",
      ".mb-note b{display:block;margin-bottom:4px;color:#c2457a}",
      ".mb-note ul{margin:0;padding-left:18px}",
      ".mb-foot{margin-top:14px;font-size:13px;color:#d9b8cb;text-align:center}",
      ".mb-off-note{color:#ffcf99;font-size:13px;margin-bottom:12px}",
      ".mb-nav-btn{white-space:nowrap}",
      "@media(max-width:640px){.mb-th{display:none}.mb-row{grid-template-columns:1fr;gap:8px;padding:14px 6px}.mb-dur{display:block}.mb-opt{flex-direction:row;flex-wrap:wrap;align-items:center;justify-content:space-between}.mb-opt .mb-pr{display:flex;flex-direction:column}.mb-opt.na{min-height:0;padding:8px}}"
    ].join("\n");
    document.head.appendChild(s);
  }

  /* ---------- komponen ---------- */
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function optCell(nama, durasi, harga) {
    if (harga === undefined) return el("div", "mb-opt na", durasi + ": tidak tersedia");
    var c = el("div", "mb-opt"), pr = el("div", "mb-pr");
    pr.appendChild(el("div", "mb-dur", durasi));
    pr.appendChild(el("div", "mb-price" + (hasPrice(harga) ? "" : " none"), hasPrice(harga) ? rupiah(harga) : "Harga belum diisi"));
    c.appendChild(pr);
    var href = waLink(nama, durasi, harga);
    var a = el("a", "mb-buy" + (href ? "" : " off"), hasPrice(harga) ? "Berlangganan Sekarang" : "Tanya Harga via WhatsApp");
    if (href) { a.href = href; a.target = "_blank"; a.rel = "noopener noreferrer"; } else { a.setAttribute("aria-disabled", "true"); }
    c.appendChild(a);
    return c;
  }
  function row(p, prefix) {
    var nama = (prefix || "") + p.nama, r = el("div", "mb-row"), n = el("div");
    n.appendChild(el("div", "mb-name", p.nama));
    if (p.jp) n.appendChild(el("div", "mb-jp", p.jp));
    if (p.ket) n.appendChild(el("div", "mb-ket", p.ket));
    r.appendChild(n);
    r.appendChild(optCell(nama, "Bulanan", p.bulanan));
    r.appendChild(optCell(nama, "Lifetime", p.lifetime));
    return r;
  }
  function pamflet(kicker, title, sub, list, prefix, notes) {
    var box = el("div", "mb-pam"), h = el("div", "mb-pam-h");
    h.appendChild(el("div", "mb-pam-k", kicker)); h.appendChild(el("div", "mb-pam-t", title)); h.appendChild(el("div", "mb-pam-s", sub));
    box.appendChild(h);
    var b = el("div", "mb-pam-b"), th = el("div", "mb-th");
    ["Paket", "Bulanan", "Lifetime"].forEach(function (t) { th.appendChild(el("div", null, t)); });
    b.appendChild(th);
    var lastGrup = null;
    (list || []).forEach(function (p) {
      if (p.grup && p.grup !== lastGrup) { b.appendChild(el("div", "mb-grp", p.grup)); lastGrup = p.grup; }
      b.appendChild(row(p, prefix));
    });
    if (notes && notes.length) {
      var n = el("div", "mb-note"); n.appendChild(el("b", null, "Ketentuan"));
      var ul = el("ul"); notes.forEach(function (t) { ul.appendChild(el("li", null, t)); }); n.appendChild(ul); b.appendChild(n);
    }
    box.appendChild(b);
    return box;
  }
  var N = M.catatan || {};
  var TABS = [
    ["JLPT N5–N1", function () { return pamflet("PAMFLET HARGA", "JLPT N5–N1", "Pilih level atau paket bundling, bulanan atau lifetime.", M.jlpt, "", N.jlpt); }],
    ["JFT-Basic", function () { return pamflet("PAMFLET HARGA", "JFT-Basic", "Satu membership untuk seluruh materi Irodori.", M.jft, "", N.jft); }],
    ["SSW 特定技能", function () { return pamflet("PAMFLET HARGA", "SSW 特定技能", "Tiap bidang dijual terpisah, sudah termasuk bonus latihan Mensetsu.", M.ssw, "SSW – ", N.ssw); }]
  ];

  function build() {
    addStyle();
    root = el("div"); root.id = "mb-root"; root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true"); root.setAttribute("aria-label", "Daftar harga membership");
    var bar = el("div", "mb-bar"), back = el("button", "mb-back", "← Kembali"); back.type = "button"; back.id = "mb-back";
    back.onclick = function () { closePricing(); };
    bar.appendChild(back); bar.appendChild(el("div", "mb-ttl", "Berlangganan Shirose Nihongo")); root.appendChild(bar);
    var wrap = el("div", "mb-wrap");
    wrap.appendChild(el("p", "mb-lead", "Pilih kategori, pilih paket dan durasi, lalu ketuk Berlangganan Sekarang. Pesanmu terisi otomatis di WhatsApp admin."));
    if (!waBase()) wrap.appendChild(el("div", "mb-off-note", "Nomor WhatsApp admin belum diisi (js/landing-config.js → langganan.url). Tombol berlangganan nonaktif sementara."));
    var tabs = el("div", "mb-tabs"); tabs.setAttribute("role", "tablist");
    var body = el("div"); body.id = "mb-body";
    function show(i) {
      [].forEach.call(tabs.children, function (b, k) { b.setAttribute("aria-selected", String(k === i)); });
      body.textContent = ""; body.appendChild(TABS[i][1]()); root.scrollTop = 0;
    }
    TABS.forEach(function (t, i) { var b = el("button", "mb-tab", t[0]); b.type = "button"; b.setAttribute("role", "tab"); b.onclick = function () { show(i); }; tabs.appendChild(b); });
    wrap.appendChild(tabs); wrap.appendChild(body);
    wrap.appendChild(el("div", "mb-foot", "Setelah pembayaran dikonfirmasi admin, akses akunmu diaktifkan. Progres belajarmu tetap aman."));
    root.appendChild(wrap); show(0);
    return root;
  }

  /* ---------- buka / tutup + riwayat browser ---------- */
  function openPricing() {
    if (OPEN) return;
    lastFocus = document.activeElement;
    document.body.appendChild(build());
    document.documentElement.style.overflow = "hidden";
    OPEN = true;
    try { history.pushState({ [STATE_KEY]: true }, "", location.href); } catch (e) {}
    var b = document.getElementById("mb-back"); if (b) b.focus();
  }
  function reallyClose() {
    if (!OPEN) return;
    OPEN = false;
    if (root && root.parentNode) root.parentNode.removeChild(root);
    root = null; document.documentElement.style.overflow = "";
    try { if (lastFocus && lastFocus.focus) lastFocus.focus(); } catch (e) {}
  }
  function closePricing() {
    if (!OPEN) return;
    var st = null; try { st = history.state; } catch (e) {}
    if (st && st[STATE_KEY]) { history.back(); } else { reallyClose(); }   // popstate yang menutup
  }
  // Capture + stopImmediatePropagation: Back yang menutup daftar harga tidak ikut dibaca router aplikasi.
  window.addEventListener("popstate", function (e) {
    if (OPEN && !(e.state && e.state[STATE_KEY])) { reallyClose(); e.stopImmediatePropagation(); }
  }, true);
  document.addEventListener("keydown", function (e) { if (OPEN && e.key === "Escape") closePricing(); });
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-open-pricing]");
    if (t) { e.preventDefault(); e.stopPropagation(); openPricing(); }
  });
  window.openPricing = openPricing; window.closePricing = closePricing;

  /* ---------- tombol di topbar aplikasi, tepat di samping tombol Tema ---------- */
  function mountAppButton() {
    if (document.getElementById("mb-btn")) return true;
    var tema = document.querySelector(".topbar-right .th-wrap");
    if (!tema) return false;
    var w = el("div", "th-wrap");
    var b = el("button", "th-btn mb-nav-btn"); b.id = "mb-btn"; b.type = "button"; b.title = "Berlangganan"; b.setAttribute("aria-label", "Berlangganan");
    b.setAttribute("data-open-pricing", ""); b.appendChild(document.createTextNode("💳 ")); b.appendChild(el("span", "th-txt", "Berlangganan"));
    w.appendChild(b); tema.parentNode.insertBefore(w, tema.nextSibling);
    return true;
  }
  if (document.querySelector(".topbar-right")) {
    var tries = 0, iv = setInterval(function () { if (mountAppButton() || ++tries > 60) clearInterval(iv); }, 250);
  }
})();
