// PELAJARAN › SOAL — KHUSUS GURU (dashboard guru). Set soal pilihan ganda A–D + penjelasan.
// Input: manual, tempel massal, atau impor Excel/CSV. Satu set = satu file; diterbitkan ke kelas (soal_kelas) seperti deck Hafalan.
// Penyimpanan: Firestore guru_soal (guru-only) + soal_kelas (terbit). Butuh aturan Firestore (lihat firestore.rules.example).
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const newId = () => "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const HURUF = ["A", "B", "C", "D"];
const MAXB = 900000;

let FB = null, CTX = { toast: () => {}, rerender: () => {} };
const toast = (m) => CTX.toast(m);
let IDX = [], KELAS = [], ERR = "";
const V = { view: "list", set: null, edit: null, q: "", pubDraft: null };

const CSS = `
#sg-root .sg-card{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:12px;border:1px solid var(--border-light,#4b3b86);border-left:5px solid #4cc9f0;background:var(--navy-2,#241a4d);margin-bottom:10px;cursor:pointer}
#sg-root .sg-card:hover{border-color:#4cc9f0}
#sg-root .sg-card small{display:block;color:var(--gray,#aaa);margin-top:3px}
#sg-root .sg-q{border:1px solid var(--border-light,#4b3b86);border-radius:12px;padding:12px 14px;margin-bottom:10px;background:var(--navy-2,#241a4d)}
#sg-root .sg-q .o{margin:2px 0;color:var(--gray-light,#ccc)}#sg-root .sg-q .o.ok{color:#2ecc71;font-weight:700}
#sg-root .sg-q .e{margin-top:6px;font-size:13px;color:#4cc9f0}
#sg-root label.sg-l{display:block;font-size:12px;font-weight:700;color:var(--gray,#aaa);margin:10px 0 4px}
#sg-root textarea,#sg-root input[type=text],#sg-root select{width:100%;box-sizing:border-box}
#sg-root .sg-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:640px){#sg-root .sg-row{grid-template-columns:1fr}}
#sg-root .sg-pub{border:1px dashed #4cc9f0;border-radius:12px;padding:12px 14px;margin:12px 0;background:rgba(76,201,240,.06)}
#sg-root .sg-pub label{display:inline-flex;align-items:center;gap:6px;margin:4px 14px 4px 0;font-size:13px}
`;
const ensureCss = () => { if (document.getElementById("sg-css")) return; const st = document.createElement("style"); st.id = "sg-css"; st.textContent = CSS; document.head.appendChild(st); };
const paint = () => { const r = document.getElementById("sg-root"); if (r) r.innerHTML = view(); };
const meta = (d) => ({ id: d.id, nama: d.nama, n: (d.items || []).length, updated: Date.now(), pub: d.pub ? { aktif: d.pub.aktif !== false, semua: !!d.pub.semua, kelas: d.pub.kelas || [] } : null });
const val = (id) => (document.getElementById(id) || {}).value || "";

/* ---------- penyimpanan ---------- */
async function simpan() {
  const d = V.set;
  if (JSON.stringify(d.items).length > MAXB) throw new Error("Set terlalu besar (± > 1500 soal). Pecah jadi beberapa set.");
  await FB.soalPut(d);
  IDX = [...IDX.filter((x) => x.id !== d.id), meta(d)]; await FB.soalSetIndex(IDX);
  if (d.pub) await terbitkan(true);          // salinan terbit ikut diperbarui otomatis
}
async function terbitkan(diam) {
  const d = V.set, p = d.pub; if (!p) return;
  await FB.soalPubPut(d.id, { nama: d.nama, items: d.items, kelas: p.kelas || [], semua: !!p.semua, aktif: p.aktif !== false });
  const pi = (await FB.soalPubIndex()).filter((x) => x.id !== d.id);
  pi.push({ id: d.id, nama: d.nama, n: d.items.length, kelas: p.kelas || [], semua: !!p.semua, aktif: p.aktif !== false });
  await FB.soalPubSetIndex(pi); if (!diam) toast("✅ Diterbitkan");
}

/* ---------- parser: tempel massal ---------- */
export function parseSoalTeks(teks) {
  const hasil = [], gagal = [];
  const blok = String(teks || "").replace(/\r/g, "").split(/\n\s*\n+/).map((b) => b.trim()).filter(Boolean);
  blok.forEach((b, bi) => {
    const baris = b.split("\n").map((x) => x.replace(/\s+$/, "")); let q = [], o = [null, null, null, null], a = -1, e = [], mode = "q", cur = -1;
    for (const raw of baris) {
      const l = raw.trim(); let m;
      if ((m = l.match(/^(?:jawaban|kunci(?: jawaban)?|answer|ans|key)\s*[:=\-]\s*\(?([A-Da-d])\)?\b/i))) { a = "ABCD".indexOf(m[1].toUpperCase()); mode = "k"; continue; }
      if ((m = l.match(/^(?:penjelasan|pembahasan|keterangan|explanation|alasan)\s*[:=\-]?\s*(.*)$/i))) { mode = "e"; if (m[1]) e.push(m[1]); continue; }
      if ((m = l.match(/^\(?([A-Da-d])[\.\)\]:]\s*(.*)$/)) && mode !== "e") { cur = "ABCD".indexOf(m[1].toUpperCase()); o[cur] = m[2]; mode = "o"; continue; }
      if (mode === "q") q.push(l.replace(/^\d+\s*[\.\)]\s*/, q.length ? "" : "")); else if (mode === "o" && cur >= 0) o[cur] += " " + l; else if (mode === "e") e.push(l);
    }
    const qq = q.join("\n").replace(/^\d+\s*[\.\)]\s*/, "").trim();
    if (!qq || o.some((x) => !x || !String(x).trim()) || a < 0) gagal.push(bi + 1); else hasil.push({ q: qq, o: o.map((x) => String(x).trim()), a, e: e.join("\n").trim() });
  });
  return { hasil, gagal };
}
/* ---------- parser: Excel / CSV (kolom: Soal, A, B, C, D, Jawaban, Penjelasan) ---------- */
const kol = (r, ...ks) => { for (const k of ks) { for (const rk of Object.keys(r)) if (rk.trim().toLowerCase() === k) return String(r[rk] == null ? "" : r[rk]).trim(); } return ""; };
function parseBaris(rows) {
  const hasil = [], gagal = [];
  rows.forEach((r, i) => {
    const q = kol(r, "soal", "pertanyaan", "question"), o = [kol(r, "a"), kol(r, "b"), kol(r, "c"), kol(r, "d")], j = kol(r, "jawaban", "kunci", "answer", "key").toUpperCase().replace(/[^A-D]/g, "").slice(0, 1);
    if (!q || o.some((x) => !x) || !j) { if (q || o.some(Boolean)) gagal.push(i + 2); return; }
    hasil.push({ q, o, a: "ABCD".indexOf(j), e: kol(r, "penjelasan", "pembahasan", "keterangan", "explanation") });
  });
  return { hasil, gagal };
}

/* ---------- tampilan ---------- */
function viewList() {
  if (ERR) return `<div class="alert alert-err" style="padding:12px;border-radius:10px;background:rgba(231,76,60,.12);border:1px solid #e74c3c">⚠️ ${esc(ERR)}<br><small>Kemungkinan aturan Firestore untuk <b>guru_soal</b> &amp; <b>soal_kelas</b> belum dipublish. Salin dari <code>firestore.rules.example</code> ke Firebase Console → Firestore → Rules → Publish.</small></div>`;
  return `<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px"><h3 style="margin:0">📝 Set Soal</h3><button class="btn" style="margin-left:auto" onclick="SG.baru()">➕ Set soal baru</button></div>
    ${IDX.length ? [...IDX].sort((a, b) => String(a.nama).localeCompare(String(b.nama), "id")).map((x) => `<div class="sg-card" onclick="SG.buka('${esc(x.id)}')"><div style="flex:1"><b>${esc(x.nama)}</b><small>${x.n || 0} soal · ${x.pub ? (x.pub.aktif === false ? "⏸️ Terbit (nonaktif)" : "✅ Terbit: " + (x.pub.semua ? "semua siswa" : (x.pub.kelas || []).map(esc).join(", ") || "belum pilih kelas")) : "Belum terbit"}</small></div><span style="color:#4cc9f0">Buka ›</span></div>`).join("") : `<div class="empty"><div class="emoji">📝</div>Belum ada set soal. Buat set pertama.</div>`}`;
}
function formSoal() {
  const ed = V.edit, it = ed != null && ed >= 0 ? V.set.items[ed] : { q: "", o: ["", "", "", ""], a: 0, e: "" };
  return `<div class="panel" style="margin:12px 0;padding:14px"><b>${ed != null && ed >= 0 ? `✏️ Edit soal #${ed + 1}` : "➕ Tambah soal"}</b>
    <label class="sg-l">Pertanyaan (furigana: 漢字[かんじ])</label><textarea id="sg-q" rows="3">${esc(it.q)}</textarea>
    <div class="sg-row">${HURUF.map((h, k) => `<div><label class="sg-l">Pilihan ${h}</label><input type="text" id="sg-o${k}" value="${esc(it.o[k])}"/></div>`).join("")}</div>
    <div class="sg-row"><div><label class="sg-l">Jawaban benar</label><select id="sg-a">${HURUF.map((h, k) => `<option value="${k}" ${it.a === k ? "selected" : ""}>${h}</option>`).join("")}</select></div></div>
    <label class="sg-l">Penjelasan (tampil di bawah jawaban siswa)</label><textarea id="sg-e" rows="3">${esc(it.e)}</textarea>
    <div style="margin-top:10px;display:flex;gap:8px"><button class="btn" onclick="SG.simpanSoal()">${ed != null && ed >= 0 ? "Simpan perubahan" : "Tambah"}</button>${ed != null ? `<button class="btn ghost" onclick="SG.batalEdit()">Batal</button>` : ""}</div></div>`;
}
function viewSet() {
  const d = V.set, p = V.pubDraft || { aktif: true, semua: false, kelas: [] };
  const items = d.items.map((x, i) => ({ x, i })).filter(({ x }) => !V.q || (x.q + " " + x.o.join(" ")).toLowerCase().includes(V.q.toLowerCase()));
  return `<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px"><button class="btn ghost sm" onclick="SG.daftar()">← Daftar set</button><h3 style="margin:0">${esc(d.nama)}</h3><span style="color:var(--gray)">${d.items.length} soal</span>
      <button class="btn ghost sm" style="margin-left:auto" onclick="SG.rename()">✏️ Nama</button><button class="btn ghost sm" onclick="SG.hapusSet()" style="color:#e74c3c">🗑️ Hapus set</button></div>
    <div class="sg-pub"><b>📤 Terbitkan ke siswa</b> <small style="color:var(--gray)">— siswa hanya melihat set yang kelasnya dipilih (dan yang punya akses Pelajaran).</small><div style="margin-top:8px">
      <label><input type="checkbox" ${p.aktif ? "checked" : ""} onchange="SG.pub('aktif',this.checked)"/> Aktif</label><label><input type="checkbox" ${p.semua ? "checked" : ""} onchange="SG.pub('semua',this.checked)"/> Semua siswa</label></div>
      <div style="margin-top:4px">${KELAS.length ? KELAS.map((k) => `<label><input type="checkbox" ${(p.kelas || []).includes(k) ? "checked" : ""} ${p.semua ? "disabled" : ""} onchange="SG.pubKelas('${esc(k).replace(/'/g, "&#39;")}',this.checked)"/> ${esc(k)}</label>`).join("") : `<small style="color:var(--gray)">Belum ada kelas.</small>`}</div>
      <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn" onclick="SG.terbit()">${d.pub ? "Perbarui terbitan" : "Terbitkan"}</button>${d.pub ? `<button class="btn ghost" onclick="SG.tarik()">Tarik dari siswa</button>` : ""}</div></div>
    ${formSoal()}
    <details style="margin:10px 0"><summary style="cursor:pointer;font-weight:700">📥 Tempel massal / impor Excel</summary><div class="panel" style="padding:14px;margin-top:8px">
      <label class="sg-l">Tempel banyak soal — pisahkan antar soal dengan 1 baris kosong</label>
      <textarea id="sg-bulk" rows="9" placeholder="1. 関係[かんけい]がありません。の読み方は？&#10;A. かんけい&#10;B. かんけえ&#10;C. かんがい&#10;D. かんげい&#10;Jawaban: A&#10;Penjelasan: 関係 dibaca かんけい (hubungan)."></textarea>
      <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;align-items:center"><button class="btn" onclick="SG.tempel()">Tambahkan dari teks</button>
        <span style="color:var(--gray)">atau</span><input type="file" id="sg-file" accept=".xlsx,.xls,.csv" onchange="SG.file(this)"/><button class="btn ghost sm" onclick="SG.template()">⬇️ Template Excel</button></div>
      <small style="color:var(--gray);display:block;margin-top:6px">Kolom Excel: <b>Soal, A, B, C, D, Jawaban, Penjelasan</b> (Jawaban diisi huruf A–D).</small></div></details>
    <div style="display:flex;align-items:center;gap:8px;margin:14px 0 8px"><b>Daftar soal</b><input type="text" placeholder="Cari soal…" value="${esc(V.q)}" oninput="SG.cari(this.value)" style="margin-left:auto;max-width:240px"/></div>
    ${items.length ? items.map(({ x, i }) => `<div class="sg-q"><div style="display:flex;gap:8px"><b style="flex:1">${i + 1}. ${esc(x.q).replace(/\n/g, "<br>")}</b><button class="btn ghost sm" onclick="SG.edit(${i})">✏️</button><button class="btn ghost sm" onclick="SG.hapusSoal(${i})" style="color:#e74c3c">🗑️</button></div>
      ${x.o.map((o, k) => `<div class="o ${k === x.a ? "ok" : ""}">${HURUF[k]}. ${esc(o)}${k === x.a ? " ✓" : ""}</div>`).join("")}${x.e ? `<div class="e">💡 ${esc(x.e).replace(/\n/g, "<br>")}</div>` : ""}</div>`).join("") : `<div class="empty">Belum ada soal.</div>`}`;
}
function view() { return V.view === "set" && V.set ? viewSet() : viewList(); }

/* ---------- aksi ---------- */
const SG = {
  daftar() { V.view = "list"; V.set = null; V.edit = null; V.q = ""; paint(); },
  async baru() {
    const nama = (prompt("Nama set soal baru:") || "").trim(); if (!nama) return;
    V.set = { id: newId(), nama, items: [] }; V.pubDraft = { aktif: true, semua: false, kelas: [] };
    try { await simpan(); V.view = "set"; V.edit = null; V.q = ""; paint(); } catch (e) { toast("❌ " + (e.message || e)); }
  },
  async buka(id) {
    try {
      const d = await FB.soalGet(id); if (!d) return toast("Set tidak ditemukan"); d.items = d.items || [];
      const m = IDX.find((x) => x.id === id); d.pub = m && m.pub ? m.pub : null;
      V.set = d; V.pubDraft = d.pub ? { aktif: d.pub.aktif !== false, semua: !!d.pub.semua, kelas: [...(d.pub.kelas || [])] } : { aktif: true, semua: false, kelas: [] };
      V.view = "set"; V.edit = null; V.q = ""; paint();
    } catch (e) { toast("❌ " + (e.message || e)); }
  },
  async rename() { const n = (prompt("Nama set:", V.set.nama) || "").trim(); if (!n) return; V.set.nama = n; try { await simpan(); paint(); } catch (e) { toast("❌ " + (e.message || e)); } },
  async hapusSet() {
    if (!confirm(`Hapus set "${V.set.nama}" beserta ${V.set.items.length} soal? Tidak bisa dibatalkan.`)) return;
    try {
      if (V.set.pub) { try { await FB.soalPubDelete(V.set.id); await FB.soalPubSetIndex((await FB.soalPubIndex()).filter((x) => x.id !== V.set.id)); } catch (e) {} }
      await FB.soalDelete(V.set.id); IDX = IDX.filter((x) => x.id !== V.set.id); await FB.soalSetIndex(IDX); V.set = null; V.view = "list"; paint(); toast("Set dihapus");
    } catch (e) { toast("❌ " + (e.message || e)); }
  },
  cari(v) { V.q = v; const r = document.getElementById("sg-root"); const pos = document.activeElement && document.activeElement.selectionStart; paint(); const i = r && r.querySelector('input[placeholder^="Cari"]'); if (i) { i.focus(); try { i.setSelectionRange(pos, pos); } catch (e) {} } },
  edit(i) { V.edit = i; paint(); const f = document.getElementById("sg-q"); if (f) f.scrollIntoView({ behavior: "smooth", block: "center" }); },
  batalEdit() { V.edit = null; paint(); },
  async simpanSoal() {
    const it = { q: val("sg-q").trim(), o: [0, 1, 2, 3].map((k) => val("sg-o" + k).trim()), a: +val("sg-a") || 0, e: val("sg-e").trim() };
    if (!it.q) return toast("Pertanyaan wajib diisi"); if (it.o.some((x) => !x)) return toast("Isi semua pilihan A–D");
    if (V.edit != null && V.edit >= 0) V.set.items[V.edit] = it; else V.set.items.push(it);
    try { await simpan(); V.edit = null; paint(); toast("✓ Tersimpan"); } catch (e) { toast("❌ " + (e.message || e)); }
  },
  async hapusSoal(i) { if (!confirm(`Hapus soal #${i + 1}?`)) return; V.set.items.splice(i, 1); try { await simpan(); paint(); } catch (e) { toast("❌ " + (e.message || e)); } },
  async tempel() {
    const { hasil, gagal } = parseSoalTeks(val("sg-bulk")); if (!hasil.length) return toast("Tidak ada soal terbaca. Cek format: A–D, 'Jawaban: X', pisah dengan baris kosong." + (gagal.length ? ` (gagal: blok ${gagal.join(", ")})` : ""));
    V.set.items.push(...hasil);
    try { await simpan(); paint(); toast(`✓ ${hasil.length} soal ditambahkan` + (gagal.length ? ` · ${gagal.length} blok dilewati (#${gagal.join(", ")})` : "")); } catch (e) { toast("❌ " + (e.message || e)); }
  },
  async file(inp) {
    const f = inp.files && inp.files[0]; if (!f) return;
    try {
      if (!window.XLSX) return toast("Pustaka Excel belum termuat");
      const wb = /\.csv$/i.test(f.name) ? XLSX.read(await f.text(), { type: "string" }) : XLSX.read(await f.arrayBuffer(), { type: "array" });
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "", raw: false });
      const { hasil, gagal } = parseBaris(rows); if (!hasil.length) return toast("Tidak ada soal terbaca. Pakai kolom: Soal, A, B, C, D, Jawaban, Penjelasan");
      V.set.items.push(...hasil); await simpan(); paint(); toast(`✓ ${hasil.length} soal diimpor` + (gagal.length ? ` · baris dilewati: ${gagal.join(", ")}` : ""));
    } catch (e) { toast("❌ " + (e.message || e)); }
  },
  template() {
    if (!window.XLSX) return toast("Pustaka Excel belum termuat");
    const ws = XLSX.utils.aoa_to_sheet([["Soal", "A", "B", "C", "D", "Jawaban", "Penjelasan"],
      ["関係[かんけい]がありません。の読み方は？", "かんけい", "かんけえ", "かんがい", "かんげい", "A", "関係 dibaca かんけい = hubungan."],
      ["「ありがとう」artinya?", "Maaf", "Terima kasih", "Selamat pagi", "Permisi", "B", "ありがとう = terima kasih."]]);
    ws["!cols"] = [{ wch: 44 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 9 }, { wch: 50 }];
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Soal"); XLSX.writeFile(wb, "template-soal-pelajaran.xlsx");
  },
  pub(k, v) { V.pubDraft = { ...(V.pubDraft || { kelas: [] }), [k]: v }; paint(); },
  pubKelas(k, on) { const d = V.pubDraft || { aktif: true, semua: false, kelas: [] }; const s = new Set(d.kelas || []); on ? s.add(k) : s.delete(k); V.pubDraft = { ...d, kelas: [...s] }; },
  async terbit() {
    const p = V.pubDraft || { aktif: true, semua: false, kelas: [] };
    if (!V.set.items.length) return toast("Set masih kosong");
    if (!p.semua && !(p.kelas || []).length) return toast("Pilih minimal satu kelas, atau centang 'Semua siswa'");
    V.set.pub = { aktif: p.aktif !== false, semua: !!p.semua, kelas: p.kelas || [] };
    try { await terbitkan(false); IDX = [...IDX.filter((x) => x.id !== V.set.id), meta(V.set)]; await FB.soalSetIndex(IDX); paint(); } catch (e) { toast("❌ " + (e.message || e)); }
  },
  async tarik() {
    if (!confirm("Tarik set ini dari siswa? Siswa tidak bisa lagi membukanya.")) return;
    try { await FB.soalPubDelete(V.set.id); await FB.soalPubSetIndex((await FB.soalPubIndex()).filter((x) => x.id !== V.set.id)); V.set.pub = null; IDX = [...IDX.filter((x) => x.id !== V.set.id), meta(V.set)]; await FB.soalSetIndex(IDX); paint(); toast("Ditarik"); } catch (e) { toast("❌ " + (e.message || e)); }
  },
};

export async function renderSoalGuruTab(fb, ctx) {
  FB = fb; CTX = ctx || CTX; ensureCss(); window.SG = SG; ERR = "";
  if (!FB.userIsGuru()) return `<div class="card">Khusus guru.</div>`;
  { const nm = new Set(); try { (await FB.listKelas()).forEach((k) => { const n = String(k.nama || "").trim(); if (n) nm.add(n); }); } catch (e) {} try { (await FB.listSiswa()).forEach((x) => { const n = String(x.kelas || "").trim(); if (n) nm.add(n); }); } catch (e) {} KELAS = [...nm].sort((a, b) => a.localeCompare(b, "id")); }
  try { IDX = await FB.soalIndex(); } catch (e) { IDX = []; ERR = String((e && (e.code || e.message)) || e); }
  if (V.view === "set" && !V.set) V.view = "list";
  return `<div id="sg-root">${view()}</div>`;
}
