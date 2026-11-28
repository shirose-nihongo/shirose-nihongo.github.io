/* HP (≤560px): Ganti tema, Font, dan Simpan dikumpulkan di satu tombol "⚙ Pengaturan".
   Tombol aslinya tidak dipindah (skrip lain masih menempel padanya); di HP hanya disembunyikan lewat CSS
   dan tombol di panel ini meneruskan klik ke tombol aslinya, sehingga menu tema/font/simpan tetap sama. */
(function () {
  "use strict";
  var ITEMS = [["th-btn", "🎨 Ganti tema"], ["fn-btn", "あ Font"], ["sv-btn", "💾 Simpan"], ["__saran", "💬 Kotak Saran"], ["__teman", "🙂 Teman belajar"]];
  // Teman belajar (karakter siswa): tampil / sembunyi dari pengaturan
  function temanOff() { try { return !!(window.Chibi && window.Chibi.chibiOff()); } catch (e) { return false; } }
  function temanLabel() { return temanOff() ? "🙂 Munculkan teman belajar" : "🙈 Sembunyikan teman belajar"; }
  function temanToggle() { try { if (window.Chibi) window.Chibi.chibiToggle(); } catch (e) {} var t = document.getElementById("teman-btn"); if (t) t.textContent = temanOff() ? "🙂 Teman" : "🙈 Teman"; }

  /* Note: penjelasan fitur (bergambar) di atas menu Pengaturan HP. Tidak buka otomatis; hanya saat bulatan "Note" diketuk. */
  var FITUR = [["silabus","Silabus harian","Jadwal belajar otomatis, per hari."],["flashcard","Flashcard","Hafal kosakata, kartu demi kartu."],["buku","Buku interaktif","Buku scan asli + ringkasan + kuis."],["soal","Soal & ujian","Soal per subbab, ujian penuh tiap level."],["bahasa","Dua bahasa","Indonesia ⇄ Jepang, ketuk kata untuk artinya."],["choukai","Choukai","Dengar audionya, jawab soalnya."],["kanji","Kanji","Lihat urutan goresan, lalu tulis."]];
  function noteCss() {
    if (document.getElementById("fnote-css")) return;
    var st = document.createElement("style"); st.id = "fnote-css";
    st.textContent = ".mset-note-row{padding:4px 6px 8px}.mset-panel button.mset-note{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;width:54px;height:54px;padding:0;border-radius:50%;background:linear-gradient(135deg,#f9a8d4,#ef6a9a);color:#fff;font-size:20px;line-height:1;box-shadow:0 3px 10px rgba(239,106,154,.45)}.mset-panel button.mset-note small{font-size:10.5px;font-weight:800;letter-spacing:.3px;margin-top:1px}"
    + "#fnote{position:fixed;inset:0;z-index:2147483000;background:rgba(5,8,20,.72);display:flex;align-items:center;justify-content:center;padding:14px}"
    + "#fnote .fn-wrap{position:relative;width:min(440px,100%);max-height:92vh}"
    + "#fnote .fn-back{position:absolute;inset:6px -6px -6px 6px;background:#f3e7c2;border-radius:6px;transform:rotate(2.6deg);box-shadow:0 8px 24px rgba(0,0,0,.4)}"
    + "#fnote .fn-paper{position:relative;max-height:92vh;overflow:auto;background:#fffbea repeating-linear-gradient(transparent 0 27px,rgba(80,120,200,.13) 27px 28px);color:#2b2a33;border-radius:6px;padding:16px 16px 20px 22px;box-shadow:0 10px 30px rgba(0,0,0,.45);border-left:3px solid rgba(239,106,154,.55);-webkit-overflow-scrolling:touch}"
    + "#fnote h3{margin:0 30px 12px 0;font-size:18px;color:#b4235d}#fnote .fn-x{position:absolute;top:8px;right:8px;width:32px;height:32px;border-radius:50%;border:0;background:rgba(0,0,0,.08);font-size:18px;cursor:pointer;color:#333;z-index:2}"
    + "#fnote figure{margin:0 0 16px}#fnote img{width:100%;height:auto;display:block;border-radius:8px;border:1px solid rgba(0,0,0,.12);background:#fff}#fnote figcaption{margin-top:6px;font-size:14px;line-height:1.35}#fnote figcaption b{display:block;font-size:15px}";
    document.head.appendChild(st);
  }
  function openNote() {
    noteCss(); if (document.getElementById("fnote")) return;
    var o = document.createElement("div"); o.id = "fnote"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", "Note fitur");
    var h = '<div class="fn-wrap"><div class="fn-back"></div><div class="fn-paper"><button type="button" class="fn-x" aria-label="Tutup">✕</button><h3>📝 Note · Fitur Shirose Nihongo</h3>';
    FITUR.forEach(function (f) { h += '<figure><img src="./assets/landing/fitur-' + f[0] + '.webp" alt="' + f[1] + '" loading="lazy"/><figcaption><b>' + f[1] + '</b>' + f[2] + '</figcaption></figure>'; });
    o.innerHTML = h + "</div></div>";
    function shut() { o.remove(); document.removeEventListener("keydown", esc); }
    function esc(e) { if (e.key === "Escape") shut(); }
    o.addEventListener("click", function (e) { if (e.target === o || e.target.classList.contains("fn-x")) shut(); });
    document.addEventListener("keydown", esc);
    document.body.appendChild(o);
  }
  function build() {
    var tr = document.querySelector(".topbar-right");
    if (!tr || document.getElementById("mset-btn")) return !!document.getElementById("mset-btn");
    var wrap = document.createElement("div"); wrap.className = "mset-wrap"; wrap.id = "mset";
    var btn = document.createElement("button"); btn.type = "button"; btn.id = "mset-btn"; btn.className = "th-btn mset-btn";
    btn.setAttribute("aria-haspopup", "true"); btn.setAttribute("aria-expanded", "false"); btn.title = "Pengaturan";
    btn.appendChild(document.createTextNode("⚙ ")); var tx = document.createElement("span"); tx.className = "mset-txt"; tx.textContent = "Pengaturan"; btn.appendChild(tx);
    var panel = document.createElement("div"); panel.className = "mset-panel"; panel.id = "mset-panel"; panel.setAttribute("role", "menu");
    noteCss();
    var nrow = document.createElement("div"); nrow.className = "mset-note-row";
    var nb = document.createElement("button"); nb.type = "button"; nb.className = "mset-note"; nb.setAttribute("role", "menuitem"); nb.setAttribute("aria-label", "Note: penjelasan fitur"); nb.innerHTML = '📝<small>Note</small>';
    nb.addEventListener("click", function (e) { e.stopPropagation(); close(); openNote(); });
    nrow.appendChild(nb); panel.appendChild(nrow);
    ITEMS.forEach(function (it) {
      var b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "menuitem"); b.textContent = it[1]; b.dataset.t = it[0];
      b.addEventListener("click", function (e) {
        e.stopPropagation(); close();
        if (it[0] === "__saran") { if (window.bukaSaran) window.bukaSaran(); return; }
        if (it[0] === "__teman") { temanToggle(); return; }
        var real = document.getElementById(it[0]); if (real) real.click();
      });
      panel.appendChild(b);
    });
    function close() { panel.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    btn.addEventListener("click", function () {
      // tidak stopPropagation: klik ini ikut menutup menu tema/font yang sedang terbuka
      var open = !panel.classList.contains("open");
      ITEMS.forEach(function (it) { var b = panel.querySelector('[data-t="' + it[0] + '"]'); if (b) b.hidden = (it[0] === "__saran" || it[0] === "__teman") ? false : !document.getElementById(it[0]); if (b && it[0] === "__teman") b.textContent = temanLabel(); });
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
    if (!document.getElementById("teman-btn")) {   // desktop: tombol langsung di topbar
      var tb = document.createElement("button"); tb.type = "button"; tb.id = "teman-btn"; tb.className = "th-btn"; tb.title = "Tampilkan / sembunyikan teman belajar"; tb.textContent = temanOff() ? "🙂 Teman" : "🙈 Teman";
      tb.addEventListener("click", temanToggle);
      tr.insertBefore(tb, wrap.nextSibling);
    }
    return true;
  }
  var n = 0, iv = setInterval(function () { if (build() || ++n > 40) clearInterval(iv); }, 150);
})();
