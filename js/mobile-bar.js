/* HP (≤560px): Ganti tema, Font, dan Simpan dikumpulkan di satu tombol "⚙ Pengaturan".
   Tombol aslinya tidak dipindah (skrip lain masih menempel padanya); di HP hanya disembunyikan lewat CSS
   dan tombol di panel ini meneruskan klik ke tombol aslinya, sehingga menu tema/font/simpan tetap sama. */
(function () {
  "use strict";
  var ITEMS = [["th-btn", "🎨 Ganti tema"], ["fn-btn", "あ Font"], ["sv-btn", "💾 Simpan"], ["__saran", "💬 Kotak Saran"]];
  function build() {
    var tr = document.querySelector(".topbar-right");
    if (!tr || document.getElementById("mset-btn")) return !!document.getElementById("mset-btn");
    var wrap = document.createElement("div"); wrap.className = "mset-wrap"; wrap.id = "mset";
    var btn = document.createElement("button"); btn.type = "button"; btn.id = "mset-btn"; btn.className = "th-btn mset-btn";
    btn.setAttribute("aria-haspopup", "true"); btn.setAttribute("aria-expanded", "false"); btn.title = "Pengaturan";
    btn.appendChild(document.createTextNode("⚙ ")); var tx = document.createElement("span"); tx.className = "mset-txt"; tx.textContent = "Pengaturan"; btn.appendChild(tx);
    var panel = document.createElement("div"); panel.className = "mset-panel"; panel.id = "mset-panel"; panel.setAttribute("role", "menu");
    ITEMS.forEach(function (it) {
      var b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "menuitem"); b.textContent = it[1]; b.dataset.t = it[0];
      b.addEventListener("click", function (e) {
        e.stopPropagation(); close();
        if (it[0] === "__saran") { if (window.bukaSaran) window.bukaSaran(); return; }
        var real = document.getElementById(it[0]); if (real) real.click();
      });
      panel.appendChild(b);
    });
    function close() { panel.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    btn.addEventListener("click", function () {
      // tidak stopPropagation: klik ini ikut menutup menu tema/font yang sedang terbuka
      var open = !panel.classList.contains("open");
      ITEMS.forEach(function (it) { var b = panel.querySelector('[data-t="' + it[0] + '"]'); if (b) b.hidden = it[0] === "__saran" ? false : !document.getElementById(it[0]); });
      panel.classList.toggle("open", open); btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    wrap.appendChild(btn); wrap.appendChild(panel);
    tr.insertBefore(wrap, tr.firstChild);
    if (!document.getElementById("saran-btn")) {   // desktop: tombol langsung di topbar
      var sb = document.createElement("button"); sb.type = "button"; sb.id = "saran-btn"; sb.className = "th-btn"; sb.title = "Kotak Saran"; sb.textContent = "💬 Saran";
      sb.addEventListener("click", function () { if (window.bukaSaran) window.bukaSaran(); });
      tr.insertBefore(sb, wrap.nextSibling);
    }
    return true;
  }
  var n = 0, iv = setInterval(function () { if (build() || ++n > 40) clearInterval(iv); }, 150);
})();
