// Bank Soal JLPT — KHUSUS GURU. Data disimpan di Firestore (guru_bank_jlpt), bukan di repo publik.
// Tidak ada jalur untuk siswa: tidak ditautkan dari halaman siswa, dan aturan Firestore menolak baca non-guru.
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const BG = { vocab: "Kosakata・文字語彙", gram: "Bunpou・Dokkai", listen: "Choukai・聴解", lain: "Lainnya" };
let FB = null, CTX = { toast: () => {}, rerender: () => {} };
let IDX = [], V = { lv: "N5", id: "", bg: "", cari: "", kunci: false, data: null };

const lvList = () => ["N5", "N4", "N3", "N2", "N1"];
const impor = async (files) => {
  let ok = 0, n = 0;
  const idx = new Map(IDX.map(x => [x.id, x]));
  for (const f of files) {
    let j; try { j = JSON.parse(await f.text()); } catch (e) { CTX.toast("❌ " + f.name + ": bukan JSON"); continue; }
    if (!j || !Array.isArray(j.ujian)) { CTX.toast("❌ " + f.name + ": format bukan paket Bank JLPT"); continue; }
    for (const u of j.ujian) {
      if (!u.id || !Array.isArray(u.soal)) continue;
      try {
        await FB.bankJlptPut({ id: u.id, level: j.level, ujian: u.ujian, soal: u.soal });
        const b = { vocab: 0, gram: 0, listen: 0, lain: 0 };
        u.soal.forEach(s => { b[s.bagian] = (b[s.bagian] || 0) + 1; });
        idx.set(u.id, { id: u.id, level: j.level, ujian: u.ujian, n: u.soal.length, bagian: b });
        ok++; n += u.soal.length;
      } catch (e) { CTX.toast("❌ " + u.id + ": " + (e.message || e)); }
    }
    CTX.toast(`… ${f.name}: ${ok} paket`);
  }
  IDX = [...idx.values()];
  await FB.bankJlptSetIndex(IDX);
  CTX.toast(`✓ Impor selesai: ${ok} paket, ${n} soal`);
};
const bukaPaket = async (id) => { V.id = id; V.data = id ? await FB.bankJlptGet(id) : null; CTX.rerender(); };
const urut = (a, b) => String(b.ujian).localeCompare(String(a.ujian));

function viewSoal() {
  const d = V.data; if (!d) return `<div class="card">Paket tidak ditemukan.</div>`;
  const q = V.cari.trim().toLowerCase();
  const list = d.soal.filter(s => (!V.bg || s.bagian === V.bg) && (!q || (s.soal + s.konteks + s.pilihan.join(" ")).toLowerCase().includes(q)));
  const rows = list.map(s => {
    const pil = s.pilihan.filter(x => x !== "").map((p, i) => {
      const bn = V.kunci && s.kunci === i + 1;
      return `<div style="padding:4px 8px;border-radius:6px;${bn ? "background:rgba(16,185,129,.18);font-weight:700;" : ""}">${i + 1}. ${esc(p)}${bn ? " ✓" : ""}</div>`;
    }).join("");
    return `<div class="card" style="margin-bottom:10px;">
      <div style="font-size:12px;color:var(--gray);margin-bottom:6px;">No ${esc(s.no)} · ${esc(BG[s.bagian] || s.bagian)}${s.audio ? " · 🔊 audio (tidak ikut)" : ""}${s.gambar ? " · 🖼️ gambar (tidak ikut)" : ""}${s.temuan ? ` · <span style="color:#f59e0b">⚠ ${esc(s.temuan)}</span>` : ""}</div>
      ${s.instruksi ? `<div style="font-size:12px;color:var(--gray);margin-bottom:4px;">${esc(s.instruksi)}</div>` : ""}
      ${s.konteks ? `<div style="white-space:pre-wrap;font-size:13px;background:rgba(255,255,255,.04);padding:8px;border-radius:8px;margin-bottom:6px;">${esc(s.konteks)}</div>` : ""}
      <div style="white-space:pre-wrap;margin-bottom:6px;">${esc(s.soal)}</div>${pil}</div>`;
  }).join("");
  const bgOpt = `<option value="">Semua bagian</option>` + Object.keys(BG).map(k => `<option value="${k}" ${V.bg === k ? "selected" : ""}>${BG[k]}</option>`).join("");
  return `<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:12px;">
      <button class="btn ghost" onclick="JLB.buka('')">← Daftar paket</button>
      <b>${esc(d.level)} · ${esc(d.ujian)}</b><span style="color:var(--gray)">${list.length}/${d.soal.length} soal</span>
      <select onchange="JLB.bg(this.value)">${bgOpt}</select>
      <input placeholder="Cari…" value="${esc(V.cari)}" onchange="JLB.cari(this.value)" style="min-width:140px;">
      <label style="display:flex;gap:6px;align-items:center;"><input type="checkbox" ${V.kunci ? "checked" : ""} onchange="JLB.kunci(this.checked)"> Tampilkan kunci</label></div>${rows || `<div class="card">Tidak ada soal.</div>`}`;
}

export async function renderBankJlptTab(fb, ctx) {
  FB = fb; CTX = ctx;
  if (!FB.userIsGuru()) return `<div class="card">Khusus guru.</div>`;
  try { IDX = await FB.bankJlptIndex(); } catch (e) { return `<div class="card" style="color:var(--red)">Gagal memuat: ${esc(e.message || e)}<br><small>Pastikan aturan Firestore untuk guru_bank_jlpt sudah dipublish.</small></div>`; }
  window.JLB = {
    lv: l => { V.lv = l; V.id = ""; V.data = null; CTX.rerender(); },
    buka: id => bukaPaket(id), bg: v => { V.bg = v; CTX.rerender(); }, cari: v => { V.cari = v; CTX.rerender(); },
    kunci: v => { V.kunci = v; CTX.rerender(); },
    impor: async (el) => { const f = [...el.files]; el.value = ""; if (f.length) { await impor(f); CTX.rerender(); } },
    hapus: async (id) => { if (!confirm("Hapus paket " + id + " dari bank guru?")) return; await FB.bankJlptDelete(id); IDX = IDX.filter(x => x.id !== id); await FB.bankJlptSetIndex(IDX); V.id = ""; V.data = null; CTX.rerender(); },
  };
  const head = `<div class="card" style="margin-bottom:12px;">
    <b>📚 Bank Soal JLPT — khusus guru</b>
    <p style="font-size:12px;color:var(--gray);margin:6px 0;">Soal JLPT asli: hanya untuk bahan guru, <b>tidak dibagikan ke siswa</b> (tidak ada tautan di sisi siswa, Firestore menolak baca non-guru). Kunci belum diverifikasi ke kunci resmi. Audio & gambar tidak ikut.</p>
    <label class="btn" style="display:inline-block;cursor:pointer;">⬆ Impor paket (jlpt-bank-N*.json)<input type="file" accept=".json" multiple style="display:none" onchange="JLB.impor(this)"></label></div>`;
  if (V.id) {
    if (!V.data) V.data = await FB.bankJlptGet(V.id);
    return head + viewSoal() + `<div style="margin-top:14px;"><button class="btn ghost" onclick="JLB.hapus('${esc(V.id)}')" style="color:var(--red)">🗑 Hapus paket ini</button></div>`;
  }
  const tabs = lvList().map(l => { const n = IDX.filter(x => x.level === l).length; return `<button class="btn ${V.lv === l ? "" : "ghost"}" onclick="JLB.lv('${l}')">${l} <small>(${n})</small></button>`; }).join(" ");
  const paket = IDX.filter(x => x.level === V.lv).sort(urut).map(x => `<div class="card" onclick="JLB.buka('${esc(x.id)}')" style="cursor:pointer;display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:8px;">
      <div><b>${esc(x.ujian)}</b> <span style="color:var(--gray);font-size:12px;">${x.n} soal</span></div>
      <div style="font-size:11px;color:var(--gray);">Kosakata ${x.bagian?.vocab || 0} · Bunpou/Dokkai ${x.bagian?.gram || 0} · Choukai ${x.bagian?.listen || 0}</div></div>`).join("");
  return head + `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">${tabs}</div>` + (paket || `<div class="card" style="color:var(--gray)">Belum ada paket ${V.lv}. Impor file jlpt-bank-${V.lv}.json.</div>`);
}
