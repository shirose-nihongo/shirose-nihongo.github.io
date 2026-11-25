// PELAJARAN 授業 › SOAL (halaman siswa) — set soal pilihan ganda A–D buatan guru, lengkap dengan penjelasan di bawah jawaban.
// Set diterbitkan guru per kelas (soal_kelas). Siswa hanya mengerjakan; skor terakhir disimpan di siswa/{uid}/soal_progres/{id}.
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
/* Furigana: "漢字[かんじ]" → ruby. Baris baru dipertahankan. */
const rich = (t) => esc(t).replace(/([㐀-鿿々〆]+)\[([^\]]+)\]/g, "<ruby>$1<rt>$2</rt></ruby>").replace(/\n/g, "<br>");
const rnd = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const HURUF = ["A", "B", "C", "D"];

let FB = null, CTX = {}, LIST = null, PROG = {}, ERR = "", S = null, VIEW = "list";

const CSS = `
.sq{--sq:#4cc9f0}
.sq .sq-head{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px}
.sq .sq-set{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:var(--navy-2,#241a4d);border:1px solid var(--border-light,#4b3b86);border-left:5px solid var(--sq);color:var(--white,#fff);border-radius:14px;padding:14px 16px;margin-bottom:10px;cursor:pointer;font:inherit}
.sq .sq-set:hover{border-color:var(--sq)}
.sq .sq-set b{font-size:16px}.sq .sq-set small{display:block;color:var(--gray,#aaa);margin-top:3px}
.sq .sq-badge{margin-left:auto;font-size:12px;font-weight:800;padding:4px 10px;border-radius:99px;background:rgba(76,201,240,.15);color:var(--sq);white-space:nowrap}
.sq .sq-bar{height:8px;border-radius:99px;background:rgba(255,255,255,.1);overflow:hidden;margin:6px 0 14px}.sq .sq-bar i{display:block;height:100%;background:var(--sq);transition:width .25s}
.sq .sq-q{font-size:19px;line-height:1.6;font-weight:700;margin:6px 0 16px;word-break:break-word}
.sq .sq-opts{display:grid;gap:10px}
.sq .sq-opt{display:flex;align-items:flex-start;gap:12px;width:100%;text-align:left;background:var(--navy-2,#241a4d);border:2px solid var(--border-light,#4b3b86);color:var(--white,#fff);border-radius:14px;padding:13px 14px;font:inherit;font-size:16px;line-height:1.5;cursor:pointer;transition:background .15s,border-color .15s}
.sq .sq-opt:not([disabled]):hover{border-color:var(--sq)}
.sq .sq-opt .sq-l{flex:none;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.12);font-weight:800;font-size:14px}
.sq .sq-opt.ok{background:rgba(46,204,113,.16);border-color:#2ecc71}.sq .sq-opt.ok .sq-l{background:#2ecc71;color:#08301a}
.sq .sq-opt.no{background:rgba(231,76,60,.16);border-color:#e74c3c}.sq .sq-opt.no .sq-l{background:#e74c3c;color:#fff}
.sq .sq-opt.dim{opacity:.55}
.sq .sq-opt[disabled]{cursor:default}
.sq .sq-exp{margin-top:16px;border-radius:14px;padding:14px 16px;background:rgba(76,201,240,.1);border:1px solid rgba(76,201,240,.4);line-height:1.65}
.sq .sq-exp .sq-et{font-weight:800;color:var(--sq);margin-bottom:6px;display:flex;align-items:center;gap:8px}
.sq .sq-res{text-align:center;padding:10px 0 4px}.sq .sq-res .sq-sk{font-size:46px;font-weight:900;color:var(--sq)}
.sq .sq-wr{border:1px solid var(--border-light,#4b3b86);border-radius:12px;padding:12px 14px;margin-top:10px;background:var(--navy-2,#241a4d)}
.sq .sq-wr .sq-yes{color:#2ecc71;font-weight:700}
`;
const ensureCss = () => { if (document.getElementById("sq-css")) return; const st = document.createElement("style"); st.id = "sq-css"; st.textContent = CSS; document.head.appendChild(st); };
const paint = () => { const r = document.getElementById("sq-root"); if (r) { r.innerHTML = view(); window.scrollTo({ top: 0 }); } };

function viewList() {
  if (ERR) return `<div class="empty"><div class="emoji">⚠️</div>Soal belum bisa dimuat.<br><small style="color:var(--gray)">${esc(ERR)}</small></div>`;
  if (!LIST) return `<div class="loading">Memuat…</div>`;
  if (!LIST.length) return `<div class="empty"><div class="emoji">📝</div>Belum ada soal untuk kelasmu.<br><small style="color:var(--gray)">Guru akan menerbitkan set soal di sini.</small></div>`;
  return LIST.map((x) => {
    const p = PROG[x.id];
    return `<button class="sq-set" onclick="SQ.buka('${esc(x.id)}')"><div><b>${esc(x.nama)}</b><small>${x.n || 0} soal · pilihan A–D + penjelasan</small></div>
      <span class="sq-badge">${p ? `Skor ${p.skor}/${p.total}` : "Belum dikerjakan"}</span></button>`;
  }).join("");
}
function viewSoal() {
  const it = S.q[S.i], pil = S.pil, sudah = pil != null;
  const last = S.i === S.q.length - 1;
  return `
    <div class="sq-head"><button class="btn ghost sm" onclick="SQ.keluar()">← Daftar</button><b>${esc(S.set.nama)}</b><span style="margin-left:auto;color:var(--gray)">${S.i + 1} / ${S.q.length}</span></div>
    <div class="sq-bar"><i style="width:${(S.i / S.q.length) * 100}%"></i></div>
    <div class="sq-q">${rich(it.q)}</div>
    <div class="sq-opts">${it.o.map((o, k) => {
      const cls = !sudah ? "" : k === it.a ? "ok" : k === pil ? "no" : "dim";
      return `<button class="sq-opt ${cls}" ${sudah ? "disabled" : ""} onclick="SQ.jawab(${k})"><span class="sq-l">${HURUF[k]}</span><span>${rich(o)}</span></button>`;
    }).join("")}</div>
    ${sudah ? `<div class="sq-exp"><div class="sq-et">${pil === it.a ? "✅ Benar!" : `❌ Kurang tepat — jawaban: <b>${HURUF[it.a]}</b>`}</div>
      ${it.e ? `<div><b>💡 Penjelasan</b><br>${rich(it.e)}</div>` : `<div style="color:var(--gray)">Jawaban yang benar: <b>${HURUF[it.a]}. ${rich(it.o[it.a])}</b></div>`}</div>
      <div style="margin-top:14px"><button class="btn" onclick="SQ.lanjut()">${last ? "Lihat hasil 🏁" : "Soal berikutnya →"}</button></div>` : ""}`;
}
function viewHasil() {
  const tot = S.q.length, benar = S.q.filter((x) => x.pil === x.a).length, salah = S.q.map((x, i) => ({ x, i })).filter((o) => o.x.pil !== o.x.a);
  return `<div class="sq-res"><div style="color:var(--gray)">${esc(S.set.nama)}</div><div class="sq-sk">${benar}/${tot}</div>
      <div>${benar === tot ? "Sempurna! 🎉" : benar >= tot * 0.7 ? "Bagus sekali! 👏" : "Ayo ulangi, pasti bisa! 💪"}</div></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:12px 0">
      <button class="btn" onclick="SQ.ulang(false)">🔁 Ulangi semua</button>
      ${salah.length ? `<button class="btn ghost" onclick="SQ.ulang(true)">🎯 Ulangi yang salah (${salah.length})</button>` : ""}
      <button class="btn ghost" onclick="SQ.keluar()">← Daftar soal</button></div>
    ${salah.length ? `<h3 style="margin:16px 0 4px">Yang perlu diulang</h3>` + salah.map(({ x, i }) => `<div class="sq-wr"><div style="font-weight:700">${i + 1}. ${rich(x.q)}</div>
      <div style="margin-top:6px"><span style="color:#e74c3c">Jawabanmu: ${x.pil == null ? "—" : HURUF[x.pil] + ". " + rich(x.o[x.pil])}</span></div>
      <div class="sq-yes">Benar: ${HURUF[x.a]}. ${rich(x.o[x.a])}</div>${x.e ? `<div style="margin-top:6px;color:var(--gray-light,#ccc)">💡 ${rich(x.e)}</div>` : ""}</div>`).join("") : ""}`;
}
function view() {
  const judul = `<h2 style="margin:0 0 4px">📝 Soal</h2><p style="color:var(--gray);font-size:13px;margin:0 0 14px">Pilih jawaban A–D, lalu baca penjelasannya di bawah.</p>`;
  if (VIEW === "list") return judul + viewList();
  if (VIEW === "soal") return viewSoal();
  return viewHasil();
}
const react = (ok) => { try { window.Chibi && window.Chibi.react(ok); } catch (e) {} };

const SQ = {
  async buka(id) {
    try {
      const d = await FB.soalPubGet(id); if (!d || !(d.items || []).length) return CTX.toast && CTX.toast("Set soal belum tersedia");
      S = { set: d, all: d.items, q: [], i: 0, pil: null }; SQ.mulai(false, true);
    } catch (e) { CTX.toast && CTX.toast("❌ " + (e.message || e)); }
  },
  mulai(hanyaSalah, acak) {
    const base = hanyaSalah ? S.q.filter((x) => x.pil !== x.a).map((x) => ({ q: x.q, o: x.o, a: x.a, e: x.e })) : S.all;
    S.q = (acak ? rnd(base) : base).map((x) => ({ q: x.q, o: x.o, a: x.a, e: x.e, pil: null })); S.i = 0; S.pil = null; VIEW = "soal"; paint();
  },
  ulang(hanyaSalah) { SQ.mulai(hanyaSalah, true); },
  jawab(k) {
    if (S.pil != null) return; const it = S.q[S.i]; S.pil = k; it.pil = k; react(k === it.a); paint();
  },
  async lanjut() {
    if (S.i < S.q.length - 1) { S.i++; S.pil = null; paint(); return; }
    VIEW = "hasil"; paint();
    try {
      const benar = S.q.filter((x) => x.pil === x.a).length;
      if (S.q.length === S.all.length) { PROG[S.set.id] = { skor: benar, total: S.q.length }; await FB.soalProgresSet(S.set.id, { skor: benar, total: S.q.length }); }
    } catch (e) { /* progres gagal disimpan: tidak mengganggu */ }
  },
  keluar() { VIEW = "list"; S = null; paint(); },
};

export async function renderSoalSiswa(fb, ctx) {
  FB = fb; CTX = ctx || {}; VIEW = "list"; S = null; LIST = null; ERR = ""; ensureCss(); window.SQ = SQ;
  try {
    const idx = await FB.soalPubIndex();
    LIST = idx.filter((x) => ctx.guru || (x.aktif !== false && (x.semua || (x.kelas || []).includes(ctx.kelas) || (x.siswa || []).includes(ctx.uid))));
    PROG = await FB.soalProgresAll();
  } catch (e) { ERR = String((e && (e.code || e.message)) || e); LIST = []; }
  return `<div class="sq" id="sq-root">${view()}</div>`;
}
