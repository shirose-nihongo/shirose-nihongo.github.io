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
  /* Harga 3 bulan = tigaBulanKali (default 2,5) x harga bulanan; harga coret = coretKali (default 5) x harga yang ditawarkan.
     Per paket boleh diisi manual: tiga: <angka> atau tidak ada 3 bulan dengan tiga: 0. */
  var KALI3 = typeof M.tigaBulanKali === "number" ? M.tigaBulanKali : 2.5;
  var KALIC = typeof M.coretKali === "number" ? M.coretKali : 5;
  function tigaOf(p) { if (typeof p.tiga === "number") return p.tiga > 0 ? p.tiga : undefined; return hasPrice(p.bulanan) ? Math.round(p.bulanan * KALI3) : undefined; }
  function coretOf(h) { return Math.round(h * KALIC / 1000) * 1000; }
  function hemat(h) { return Math.round((1 - h / coretOf(h)) * 100); }
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
      "#mb-root{position:fixed;inset:0;z-index:100000;background:radial-gradient(ellipse at 20% 30%,rgba(139,92,246,.15) 0%,transparent 50%),radial-gradient(ellipse at 80% 70%,rgba(239,106,154,.15) 0%,transparent 50%),linear-gradient(to bottom,var(--navy-4,#0d1024),var(--navy,#161b36));color:#fff;overflow-y:auto;-webkit-overflow-scrolling:touch;font-family:'Zen Kaku Gothic New',system-ui,-apple-system,sans-serif;line-height:1.5}",
      "#mb-root *{box-sizing:border-box}",
      ".mb-bar{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:12px;padding:12px 16px;background:color-mix(in srgb,var(--navy-4,#0d1024) 94%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid color-mix(in srgb,var(--pink-light,#ffb7d5) 25%,transparent)}",
      ".mb-back{border:1px solid color-mix(in srgb,var(--pink-light,#ffb7d5) 50%,transparent);background:rgba(255,255,255,.06);color:#fff;border-radius:999px;padding:9px 16px;font:inherit;font-weight:700;font-size:14px;cursor:pointer;min-height:42px;white-space:nowrap;flex:none}",
      ".mb-back:hover{background:color-mix(in srgb,var(--pink-light,#ffb7d5) 18%,transparent)}",
      ".mb-ttl{font-size:18px;font-weight:800}",
      ".mb-wrap{max-width:980px;margin:0 auto;padding:16px 16px 60px}",
      ".mb-lead{color:#ebe9f5;font-size:15px;margin:2px 0 14px}",
      ".mb-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}",
      ".mb-tab{border:1px solid color-mix(in srgb,var(--pink-light,#ffb7d5) 35%,transparent);background:rgba(255,255,255,.05);color:#f1eefa;border-radius:999px;padding:10px 20px;font:inherit;font-weight:800;font-size:14.5px;cursor:pointer;min-height:44px}",
      ".mb-tab[aria-selected=true]{background:linear-gradient(135deg,var(--pink,#ef6a9a),var(--pink-light,#f9a8c9));border-color:transparent;color:#2a1022}",
      /* pamflet: header + kotak-kotak */
      ".mb-pam-h{background:linear-gradient(135deg,var(--pink,#ef6a9a),var(--pink-light,#f9a8c9) 70%,#ffd3e4);border-radius:20px;padding:20px 20px 16px;color:#2a1022;margin-bottom:16px}",
      ".mb-pam-k{font-size:12px;font-weight:800;letter-spacing:.14em;opacity:.8}",
      ".mb-pam-t{font-family:'Shippori Mincho B1',serif;font-size:clamp(26px,5vw,36px);font-weight:800;line-height:1.15;margin-top:2px}",
      ".mb-pam-s{font-size:14px;margin-top:6px;font-weight:600}",
      ".mb-grp{font-size:13px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--pink-light,#ffb7c5);margin:20px 4px 10px}",
      ".mb-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px}",
      ".mb-k{position:relative;overflow:hidden;display:flex;flex-direction:column;gap:6px;background:linear-gradient(160deg,rgba(42,50,112,.45),rgba(31,38,80,.5));border:1.5px solid var(--ac,var(--pink-light,#ffb7c5));border-radius:18px;padding:20px;transition:transform .2s}",
      ".mb-k:hover{transform:translateY(-3px)}",
      ".mb-k>*{position:relative;z-index:1}",
      ".mb-wm{position:absolute!important;z-index:0!important;right:8px;bottom:-14px;font-family:'Shippori Mincho B1',serif;font-size:130px;line-height:1;font-weight:800;color:rgba(255,255,255,.06);pointer-events:none;user-select:none}",
      ".mb-big{font-size:clamp(34px,6vw,44px);font-weight:800;line-height:1.05;color:var(--ac,#fff)}",
      ".mb-big.sm{font-size:clamp(26px,5vw,32px)}",
      ".mb-sub{font-family:'Shippori Mincho B1',serif;font-size:17px;font-weight:700;color:var(--pink-light,#ffb7c5);line-height:1.3}",
      ".mb-isl{display:flex;justify-content:center;margin:-6px 0 -2px}",
      ".mb-isl svg{width:100%;max-width:190px;height:auto;filter:drop-shadow(0 8px 10px rgba(0,0,0,.35));animation:mbflt 5.5s ease-in-out infinite}",
      "@keyframes mbflt{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}",
      "@media(prefers-reduced-motion:reduce){.mb-isl svg{animation:none}}",
      ".mb-name{font-size:20px;font-weight:800;line-height:1.2;color:#fff}",
      ".mb-d{font-size:14px;color:var(--gray,#b9bfd9);line-height:1.5}",
      ".mb-sum{margin:4px 0 2px}",
      ".mb-chips{display:grid;grid-template-columns:repeat(auto-fit,minmax(86px,1fr));gap:8px}",
      ".mb-chip{font:inherit;color:#fff;background:rgba(10,6,20,.4);border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:9px 6px 8px;text-align:center;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:1px;line-height:1.15}",
      ".mb-chip .mb-ci{font-size:17px}.mb-chip b{font-size:17px;font-weight:800;color:var(--ac,#fff)}.mb-chip small{font-size:11.5px;color:var(--gray,#b9bfd9)}",
      ".mb-chip:hover{border-color:var(--ac,var(--pink,#ef6a9a))}.mb-chip.on{background:rgba(255,255,255,.1);border-color:var(--ac,var(--pink,#ef6a9a))}",
      ".mb-chip:focus-visible{outline:2px solid var(--ac,var(--pink,#ef6a9a));outline-offset:2px}",
      ".mb-pan{margin-top:8px;background:rgba(10,6,20,.38);border-radius:12px;padding:10px 12px;font-size:13px;color:#ebe9f5;line-height:1.5}",
      ".mb-pan-h b{color:var(--pink-light,#ffb7c5);font-size:13.5px}.mb-pan ul{margin:6px 0 0;padding-left:17px}.mb-pan li{margin:3px 0}",
      ".mb-pan ul.mb-sl{list-style:none;padding:0}.mb-sl li{display:flex;justify-content:space-between;gap:10px;border-bottom:1px dashed rgba(255,255,255,.12);padding:4px 0}.mb-sl li b{white-space:nowrap;color:#fff}",
      ".mb-pan-s{margin-top:8px;font-size:11.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--pink-light,#ffb7c5)}",
      ".mb-tags{font-family:'Shippori Mincho B1',serif;font-size:13px;color:#f1eefa;line-height:1.7}.mb-pan-n{margin-top:8px;color:var(--gray,#b9bfd9)}",
      ".mb-all{margin-top:8px;font-size:13px;color:#ebe9f5}.mb-all summary{cursor:pointer;color:var(--pink-light,#ffb7c5);font-weight:700;font-size:12.5px}.mb-all ul{margin:6px 0 0;padding-left:17px}.mb-all li{margin:3px 0}",
      ".mb-det{margin:4px 0 2px;font-size:13px;color:#ebe9f5;line-height:1.5;background:rgba(10,6,20,.28);border-radius:12px;padding:10px 12px}",
      ".mb-det b{display:block;margin-bottom:3px;color:var(--pink-light,#ffb7c5);font-size:12px;letter-spacing:.08em;text-transform:uppercase}",
      ".mb-det ul{margin:0;padding-left:17px}.mb-det li{margin:3px 0}",
      /* kartu besar (JFT-Basic): selebar daftar, huruf lebih besar, harga di samping isi */
      ".mb-k.besar{grid-column:1/-1;padding:26px}",
      ".mb-k.besar .mb-big{font-size:clamp(46px,9vw,68px)}",
      ".mb-k.besar .mb-sub{font-size:20px}",
      ".mb-k.besar .mb-d{font-size:16px}",
      ".mb-k.besar .mb-det{font-size:15px;padding:14px 16px}",
      ".mb-k.besar .mb-det li{margin:6px 0}",
      "@media(min-width:760px){.mb-k.besar .mb-opts{flex-direction:row}.mb-k.besar .mb-opt{flex:1}}",
      ".mb-opts{display:flex;flex-direction:column;gap:8px;margin-top:auto;padding-top:10px}",
      ".mb-opt{display:flex;flex-direction:column;gap:6px;background:rgba(10,6,20,.45);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:10px 12px}",
      ".mb-opt.na{background:transparent;border-style:dashed;color:var(--gray-dim,#7a80a0);font-size:13px;align-items:center;justify-content:center;min-height:44px}",
      ".mb-dur{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--gray,#b9bfd9)}",
      ".mb-price{font-size:20px;font-weight:800;color:#fff}",
      ".mb-price.none{font-size:13px;font-weight:700;color:var(--gray,#b9bfd9)}",
      ".mb-buy{display:inline-flex;align-items:center;justify-content:center;text-align:center;border:0;border-radius:999px;padding:9px 12px;font:inherit;font-weight:800;font-size:13px;cursor:pointer;text-decoration:none;min-height:42px;background:#1faa59;color:#fff}",
      ".mb-buy:hover{filter:brightness(1.08)}",
      ".mb-buy.off{background:#6b5a66;color:#e5d6de;cursor:not-allowed;pointer-events:none}",
      ".mb-opt{position:relative}.mb-opt.hot{border-color:var(--pink,#ef6a9a);background:rgba(239,106,154,.12)}",
      ".mb-badge{position:absolute;top:-10px;right:10px;background:linear-gradient(135deg,#ffb347,#ff6b6b);color:#2a1022;font-size:10.5px;font-weight:800;letter-spacing:.04em;padding:3px 9px;border-radius:999px}",
      ".mb-prow{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
      ".mb-coret{font-size:14px;color:#ff8f8f;text-decoration-thickness:2px}",
      ".mb-hemat{background:#e11d48;color:#fff;font-size:10.5px;font-weight:800;padding:2px 7px;border-radius:6px}",
      ".mb-per{font-size:12px;color:var(--pink-light,#ffb7c5);font-weight:700}",
      ".mb-promo{background:linear-gradient(135deg,rgba(225,29,72,.22),rgba(255,179,71,.18));border:1px solid rgba(255,143,143,.55);border-radius:14px;padding:12px 14px;margin:0 0 14px;font-size:14px;line-height:1.55}",
      ".mb-promo b{color:#ffd3a0}",
      /* teaser harga di landing */
      ".mb-tz{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px;max-width:1000px;margin:26px auto 0;text-align:left}",
      ".mb-tz .mb-k{padding:22px}.mb-tz-lb{font-size:12px;font-weight:800;letter-spacing:.1em;color:var(--pink-light,#ffb7c5)}",
      ".mb-tz-t{font-size:26px;font-weight:800;line-height:1.1;font-family:'Shippori Mincho B1',serif}",
      ".mb-tz .mb-opt{flex-direction:row;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px}",
      ".mb-tz .mb-price{font-size:19px}",
      ".mb-tz .mb-badge{top:-9px}",
      ".mb-note{margin:18px 2px 4px;font-size:13px;color:#ebe9f5;background:rgba(255,255,255,.06);border-left:4px solid var(--pink,#ef6a9a);border-radius:10px;padding:12px 14px}",
      ".mb-note b{display:block;margin-bottom:4px;color:var(--pink-light,#ffb7c5)}",
      ".mb-note ul{margin:0;padding-left:18px}",
      ".mb-foot{margin-top:14px;font-size:13px;color:var(--gray,#b9bfd9);text-align:center}",
      ".mb-off-note{color:#ffcf99;font-size:13px;margin-bottom:12px}",
      ".mb-nav-btn{white-space:nowrap}",
      "@media(max-width:560px){.mb-cards{grid-template-columns:1fr}.mb-opt{flex-direction:row;flex-wrap:wrap;align-items:center;justify-content:space-between}.mb-opt .mb-pr{display:flex;flex-direction:column}.mb-opt.na{min-height:0;padding:8px}}"
    ].join("\n");
    document.head.appendChild(s);
  }

  /* ---------- komponen ---------- */
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function optCell(nama, durasi, harga, badge) {
    if (harga === undefined) return el("div", "mb-opt na", durasi + ": tidak tersedia");
    var c = el("div", "mb-opt" + (badge ? " hot" : "")), pr = el("div", "mb-pr");
    if (badge) c.appendChild(el("div", "mb-badge", badge));
    pr.appendChild(el("div", "mb-dur", durasi));
    if (hasPrice(harga)) {
      var row = el("div", "mb-prow");
      row.appendChild(el("s", "mb-coret", rupiah(coretOf(harga))));
      row.appendChild(el("span", "mb-hemat", "HEMAT " + hemat(harga) + "%"));
      pr.appendChild(row);
    }
    pr.appendChild(el("div", "mb-price" + (hasPrice(harga) ? "" : " none"), hasPrice(harga) ? rupiah(harga) : "Harga belum diisi"));
    if (durasi === "3 Bulan" && hasPrice(harga)) pr.appendChild(el("div", "mb-per", "≈ " + rupiah(Math.round(harga / 3)) + " per bulan"));
    c.appendChild(pr);
    var href = waLink(nama, durasi, harga);
    var a = el("a", "mb-buy" + (href ? "" : " off"), hasPrice(harga) ? "Berlangganan Sekarang" : "Tanya Harga via WhatsApp");
    if (href) { a.href = href; a.target = "_blank"; a.rel = "noopener noreferrer"; } else { a.setAttribute("aria-disabled", "true"); }
    c.appendChild(a);
    return c;
  }
  var ART = null;   // modul gambar pulau SSW (js/ssw-art.js), dimuat sekali dan hanya untuk tab SSW
  function loadArt() { if (!ART) { try { ART = import("./ssw-art.js").catch(function () { return null; }); } catch (e) { ART = Promise.resolve(null); } } return ART; }

  /* ---------- ringkasan kartu: 4 angka utama (ketuk = detail), dihitung dari teks rincian ---------- */
  function num(x) { return parseInt(String(x).replace(/\./g, ""), 10) || 0; }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function stats(p) {
    var L = p.rincian || [], T = L.join("\n"), m, st = { chips: [], det: {} };
    var kk = /([\d.]+) kosakata/.exec(L.filter(function (l) { return /^Total/.test(l); }).join("\n") || T);
    var kj = /([\d.]+) kanji/.exec(L.filter(function (l) { return /^Total/.test(l); }).join("\n") || T);
    var bp = /([\d.]+) pola bunpou/.exec(L.filter(function (l) { return /^Total/.test(l); }).join("\n") || T);
    var soal = [], total = 0;
    function add(label, n, note) { soal.push([label, n, note || ""]); total += n; }
    if (/Full Exam/.test(T) && /Latihan per bagian/.test(T)) {            // JLPT satu level
      if ((m = /Full Exam: (\d+) paket \(([\d.]+) soal\)/.exec(T))) add("Full Exam", num(m[2]), m[1] + " paket");
      var re = /(Kanji|Kotoba|Bunpou|Dokkai|Bintang ★) (\d+) paket \(([\d.]+) soal\)/g, x;
      while ((x = re.exec(T))) add("Latihan " + x[1], num(x[3]), x[2] + " paket");
      if ((m = /Choukai: (\d+) paket audio \(([\d.]+) soal\)/.exec(T))) add("Choukai (audio)", num(m[2]), m[1] + " paket");
    } else if (/paket Full Exam/.test(T)) {                               // JLPT bundling
      if ((m = /(\d+) paket Full Exam \(([\d.]+) soal\) \+ ([\d.]+) soal latihan/.exec(T))) { add("Full Exam", num(m[2]), m[1] + " paket"); add("Latihan per bagian", num(m[3]), "Kanji, Kotoba, Bunpou, Dokkai, Bintang ★"); }
      if ((m = /Choukai: (\d+) paket audio \(([\d.]+) soal\)/.exec(T))) add("Choukai (audio)", num(m[2]), m[1] + " paket");
    } else if (/Tryout/.test(T)) {                                        // JFT
      if ((m = /\((\d+) paket, ([\d.]+) soal\)/.exec(T))) add("Ujian per blok bab", num(m[2]), m[1] + " paket");
      if ((m = /Simulasi penuh[^:]*: (\d+) paket × (\d+) soal/.exec(T))) add("Simulasi penuh", num(m[1]) * num(m[2]), m[1] + " paket × " + m[2] + " soal");
      if ((m = /Tryout: (\d+) paket[^=]*= ([\d.]+) soal/.exec(T))) add("Tryout", num(m[2]), m[1] + " paket");
      if ((m = /Latihan cepat[^\n]*/.exec(T))) { var q = 0; (m[0].match(/\((\d+)(?: soal)?\)/g) || []).forEach(function (t) { q += num(t.replace(/\D/g, "")); }); if (q) add("Latihan cepat", q, "per bagian"); }
    } else if (/set kuis/.test(T)) {                                      // SSW
      if ((m = /([\d.]+) soal latihan dalam (\d+) set kuis/.exec(T))) add("Latihan per bab", num(m[1]), m[2] + " set kuis");
      if ((m = /(\d+) (?:ujian|paket) × (\d+) soal/.exec(T))) add("Ujian penuh simulasi", num(m[1]) * num(m[2]), m[1] + " × " + m[2] + " soal");
    }
    var mb = /([\d.]+) bab · ([\d.]+) subbab/.exec(T), mz = /(\d+) pertanyaan wawancara/.exec(T);
    if (mb) st.chips.push(["📖", mb[1] + " bab", "materi", "bab", { bab: mb[1], sub: mb[2] }]);
    if (kk) st.chips.push(["📚", kk[1], "kosakata", "kosa", null]);
    if (kj) st.chips.push(["🈶", kj[1], "kanji", "kanji", null]);
    if (bp) st.chips.push(["📐", bp[1], "pola bunpou", "bunpou", null]);
    if (soal.length) st.chips.push(["📝", fmt(total), "soal", "soal", soal]);
    if (mz) st.chips.push(["🗣", mz[1], "tanya wawancara", "mensetsu", null]);
    st.lines = L; st.T = T;
    return st;
  }
  var FITUR = {
    kosa: ["Tiap kata punya bacaan (kana), arti Bahasa Indonesia, dan contoh kalimat.", "Bisa dihafal lewat flashcard dan mode hafalan.", "Ada suara untuk melatih pengucapan."],
    kanji: ["Arti, bacaan On dan Kun, serta contoh kata tiap kanji.", "Animasi urutan goresan, dengan nomor tiap goresan.", "Bisa latihan menulis di kanvas dengan penilaian perkiraan."],
    bunpou: ["Tiap pola: arti, penjelasan singkat, rumus, dan contoh kalimat beserta artinya.", "Tombol tabel perubahan kata kerja (bentuk masu, te, ta, nai, dan lainnya).", "Bisa digeser kiri dan kanan seperti kartu."],
    soal: [],
    bab: ["Materi dalam teks lengkap dan ringkas.", "Bisa ganti Bahasa Indonesia dan Jepang dengan satu ketukan.", "Ketuk kata di teks untuk melihat arti, lalu masukkan ke flashcard."],
    mensetsu: ["Latihan pertanyaan wawancara kerja, dengan contoh jawaban.", "Format Rirekisho (riwayat hidup) untuk dilatih."]
  };
  function detailPanel(st, key, p) {
    var c = st.chips.filter(function (x) { return x[3] === key; })[0];
    var box = el("div", "mb-pan"), h = el("div", "mb-pan-h");
    h.appendChild(el("b", null, c[0] + " " + c[1] + " " + c[2])); box.appendChild(h);
    if (key === "soal") {
      var ul = el("ul", "mb-sl"); c[4].forEach(function (r) { var li = el("li"); li.appendChild(el("span", null, r[0] + (r[2] ? " · " + r[2] : ""))); li.appendChild(el("b", null, fmt(r[1]) + " soal")); ul.appendChild(li); });
      box.appendChild(ul);
      var tipe = /Tipe soal Full Exam: ([^\n]+)/.exec(st.T);
      if (tipe) { box.appendChild(el("div", "mb-pan-s", "Tipe soal Full Exam")); box.appendChild(el("div", "mb-tags", tipe[1])); }
      var fmtU = /(tiap paket[^\n]*|60 menit[^\n]*)/.exec(st.T);
      if (/Simulasi penuh JFT/.test(st.T)) box.appendChild(el("div", "mb-pan-n", "Simulasi penuh: 60 menit, 4 bagian (Script & Vocabulary, Conversation & Expression, Listening, Reading)."));
      else if (fmtU && /Full Exam/.test(st.T)) box.appendChild(el("div", "mb-pan-n", "Satu paket Full Exam ±70 menit, format seperti ujian aslinya."));
    } else {
      var ul2 = el("ul"); (FITUR[key] || []).forEach(function (t) { ul2.appendChild(el("li", null, t)); });
      if (key === "bab" && c[4]) ul2.insertBefore(el("li", null, c[4].bab + " bab, " + c[4].sub + " subbab."), ul2.firstChild);
      if (key === "mensetsu") ul2.insertBefore(el("li", null, c[1] + " pertanyaan wawancara kerja."), ul2.firstChild);
      box.appendChild(ul2);
      if ((key === "kosa" || key === "kanji" || key === "bunpou") && /Starter A1/.test(st.T)) {
        var per = el("ul", "mb-sl"); st.lines.forEach(function (l) { var mm = /^(Starter A1|Shokyuu \d): ([\d.]+) kosakata · ([\d.]+) kanji · ([\d.]+) pola bunpou/.exec(l); if (mm) { var li = el("li"); li.appendChild(el("span", null, mm[1])); li.appendChild(el("b", null, key === "kosa" ? mm[2] : key === "kanji" ? mm[3] : mm[4])); per.appendChild(li); } });
        box.appendChild(el("div", "mb-pan-s", "Per level Irodori")); box.appendChild(per);
      }
    }
    return box;
  }
  function ringkas(p, k) {
    var st = stats(p); if (!st.chips.length) return null;
    var wrap = el("div", "mb-sum"), row = el("div", "mb-chips"), slot = el("div", "mb-pan-slot"), cur = null;
    st.chips.forEach(function (c) {
      var b = el("button", "mb-chip"); b.type = "button"; b.setAttribute("aria-expanded", "false");
      b.appendChild(el("span", "mb-ci", c[0])); b.appendChild(el("b", null, c[1])); b.appendChild(el("small", null, c[2]));
      b.onclick = function () {
        var open = cur === c[3]; cur = open ? null : c[3];
        [].forEach.call(row.children, function (x) { x.setAttribute("aria-expanded", "false"); x.classList.remove("on"); });
        slot.textContent = "";
        if (!open) { b.setAttribute("aria-expanded", "true"); b.classList.add("on"); slot.appendChild(detailPanel(st, c[3], p)); }
      };
      row.appendChild(b);
    });
    wrap.appendChild(row); wrap.appendChild(slot);
    if (p.rincian.length) {
      var all = el("details", "mb-all"); all.appendChild(el("summary", null, "Lihat semua isi paket"));
      var ul = el("ul"); p.rincian.forEach(function (t) { ul.appendChild(el("li", null, t)); }); all.appendChild(ul); wrap.appendChild(all);
    }
    return wrap;
  }
  function kotak(p, prefix) {
    var nama = (prefix || "") + p.nama, k = el("div", "mb-k" + (p.besar ? " besar" : ""));
    if (p.warna) k.style.setProperty("--ac", p.warna);
    if (p.wm) k.appendChild(el("div", "mb-wm", p.wm));
    if (p.tema) {
      var isl = el("div", "mb-isl"); isl.setAttribute("aria-hidden", "true"); k.appendChild(isl);
      loadArt().then(function (m) { if (m && m.islandSVG) { try { isl.innerHTML = m.islandSVG(p.tema); } catch (e) {} } });
      k.appendChild(el("div", "mb-name", p.nama));
      if (p.jp) k.appendChild(el("div", "mb-sub", p.jp));
    } else {
      k.appendChild(el("div", "mb-big" + (p.big && p.big.length > 4 ? " sm" : ""), p.big || p.nama));
      k.appendChild(el("div", "mb-sub", p.nama));
    }
    var d = p.ket || p.desc; if (d) k.appendChild(el("div", "mb-d", d));
    if (p.rincian && p.rincian.length) {
      var sm = ringkas(p);
      if (sm) k.appendChild(sm);
    }
    var o = el("div", "mb-opts");
    o.appendChild(optCell(nama, "1 Bulan", p.bulanan));
    o.appendChild(optCell(nama, "3 Bulan", tigaOf(p), tigaOf(p) !== undefined ? "⭐ REKOMENDASI" : ""));
    o.appendChild(optCell(nama, "Lifetime", p.lifetime, hasPrice(p.lifetime) && !hasPrice(p.bulanan) ? "♾️ SEKALI BAYAR" : ""));
    k.appendChild(o);
    return k;
  }
  function pamflet(kicker, title, sub, list, prefix, notes) {
    var box = el("div"), h = el("div", "mb-pam-h");
    h.appendChild(el("div", "mb-pam-k", kicker)); h.appendChild(el("div", "mb-pam-t", title)); h.appendChild(el("div", "mb-pam-s", sub));
    box.appendChild(h);
    var lastGrup = null, g = null;
    (list || []).forEach(function (p) {
      if (!g || (p.grup && p.grup !== lastGrup)) {
        if (p.grup) { box.appendChild(el("div", "mb-grp", p.grup)); lastGrup = p.grup; }
        g = el("div", "mb-cards"); box.appendChild(g);
      }
      g.appendChild(kotak(p, prefix));
    });
    if (notes && notes.length) {
      var n = el("div", "mb-note"); n.appendChild(el("b", null, "Ketentuan"));
      var ul = el("ul"); notes.forEach(function (t) { ul.appendChild(el("li", null, t)); }); n.appendChild(ul); box.appendChild(n);
    }
    return box;
  }
  var N = M.catatan || {};
  var TABS = [
    ["JLPT N5–N1", function () { return pamflet("PAMFLET HARGA", "JLPT N5–N1", "Pilih level atau paket bundling: 1 bulan, 3 bulan, atau lifetime.", M.jlpt, "", N.jlpt); }],
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
    var pr = el("div", "mb-promo"); pr.innerHTML = "🔥 <b>Harga promo, diskon hingga " + hemat(10000) + "% dari harga normal.</b> Pilih 1 bulan, <b>3 bulan</b> (lebih hemat per bulan), atau <b>Lifetime</b> sekali bayar. Harga promo bisa naik sewaktu-waktu."; wrap.appendChild(pr);
    wrap.appendChild(el("p", "mb-lead", "Pilih kategori, pilih paket dan durasi, lalu ketuk Berlangganan Sekarang. Ketuk angka di tiap paket untuk melihat isinya. Pesanmu terisi otomatis di WhatsApp admin."));
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
    root.appendChild(wrap); show(START_TAB);
    return root;
  }

  /* ---------- buka / tutup + riwayat browser ---------- */
  var START_TAB = 0;
  function openPricing(i) {
    if (OPEN) return;
    START_TAB = typeof i === "number" ? i : 0;
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
    if (t) { e.preventDefault(); e.stopPropagation(); var ti = parseInt(t.getAttribute("data-open-pricing"), 10); openPricing(isNaN(ti) ? 0 : ti); }
  });
  /* Browser dalam aplikasi (Instagram, TikTok, Facebook, Line, dll.) sering memblokir tab baru ke wa.me.
     Di sana link WhatsApp dibuka di tab yang sama (WhatsApp tetap terbuka lewat link universal). */
  var INAPP = /Instagram|FBAN|FBAV|FB_IAB|TikTok|musical_ly|BytedanceWebview|Line\/|MicroMessenger|Snapchat|Twitter/i.test(navigator.userAgent || "");
  document.addEventListener("click", function (e) {
    if (!INAPP || e.defaultPrevented) return;
    var a = e.target.closest && e.target.closest('a[href^="https://wa.me/"]');
    if (!a) return;
    e.preventDefault(); location.href = a.href;
  }, true);

  /* ---------- teaser harga di landing: <div id="harga-teaser"></div> ---------- */
  function mountTeaser() {
    var box = document.getElementById("harga-teaser"); if (!box) return;
    addStyle(); box.textContent = "";
    var grid = el("div", "mb-tz");
    [["JLPT", "Mulai dari N5", (M.jlpt || [])[0], 0, "#f9a8c9"], ["JFT-Basic", "Complete Access", (M.jft || [])[0], 1, "#22d3ee"],
     ["SSW 特定技能", "Mulai dari Agriculture", (M.ssw || []).filter(function (x) { return /Agriculture/.test(x.nama); })[0], 2, "#10b981"]].forEach(function (c) {
      var p = c[2]; if (!p) return;
      var k = el("div", "mb-k"); k.style.setProperty("--ac", c[4]);
      k.appendChild(el("div", "mb-tz-lb", c[1].toUpperCase())); k.appendChild(el("div", "mb-tz-t", c[0]));
      var o = el("div", "mb-opts");
      o.appendChild(optCell(p.nama, "1 Bulan", p.bulanan));
      o.appendChild(optCell(p.nama, "3 Bulan", tigaOf(p), "⭐ REKOMENDASI"));
      o.appendChild(optCell(p.nama, "Lifetime", p.lifetime));
      k.appendChild(o);
      var more = el("button", "mb-buy", "Lihat semua paket " + c[0]); more.type = "button"; more.style.background = "transparent"; more.style.border = "1.5px solid " + c[4]; more.setAttribute("data-open-pricing", String(c[3]));
      k.appendChild(more); grid.appendChild(k);
    });
    box.appendChild(grid);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountTeaser); else mountTeaser();
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
