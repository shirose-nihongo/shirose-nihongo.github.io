/* ============================================================
   SHIROSE NIHONGO — FIREBASE SYNC (RPG Platform v2)
   Reuse existing project "shirose-nihongo" (Spark plan).
   Schema baru:
     siswa/{uid}: { nama, email, kelas, aksesLevel{n5,n4,n3,n2,n1}, karakter{equipped,inventory}, aktif, created }
     siswa/{uid}/gami/{lvl}: { xp, koin, streak, level_karakter, lastAktivitas }
     siswa/{uid}/srs/{lvl}: { kartu{}, updated }
     siswa/{uid}/nilai/{id}: { kategoriId, skor, benar, salah, waktu, tgl }
     siswa/{uid}/misi_harian/{tgl}: { misi[], claimed[] }
     kategori_ujian/{id}: { nama, level, deskripsi, jumlahSoal, durasi, lulus, publish, reward, tipe }
     soal/{kategoriId}/items/{soalId}: { tipe, pertanyaan, opsi[], kunci, pembahasan_id, pembahasan_jp, materi, kesulitan, poin, gambar }
     item_shop/{kategori}/items/{id}: { nama, harga, rarity, level_unlock, svg_key }
     choukai/{lvl}/items/{id}: { pertanyaan, opsi[], kunci, transkrip, pembahasan, tts_text, audio_url }
     kelas/{id}: { nama, murid[], guru }
   ============================================================ */

import { initializeApp, deleteApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-check.js";
import {
  getAuth, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInAnonymously,
  signOut, sendPasswordResetEmail,
  setPersistence, browserLocalPersistence, browserSessionPersistence, inMemoryPersistence,
  indexedDBLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc as _setDoc0, updateDoc as _updateDoc0, deleteDoc as _deleteDoc0,
  collection, collectionGroup, getDocs, onSnapshot, query, orderBy, limit, addDoc as _addDoc0, Timestamp,
  where, writeBatch, serverTimestamp, FieldPath, deleteField, documentId, runTransaction, increment, arrayUnion
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCPdZmpHeAOIRcFNSfoiLj-HmNTHettrQo",
  authDomain: "shirose-nihongo.firebaseapp.com",
  projectId: "shirose-nihongo",
  storageBucket: "shirose-nihongo.firebasestorage.app",
  messagingSenderId: "601020682073",
  appId: "1:601020682073:web:adb7adb44e79b17d3d4648",
};

/* ========== CACHE DASHBOARD GURU (hemat kuota baca Firestore) ==========
 * Data siswa yang dibaca guru disimpan di browser guru (IndexedDB). Pindah tab / buka ulang
 * dashboard = 0 baca selama 30 menit. Tombol "🔄 Muat ulang" memaksa cek ulang, dan hasil ujian
 * (JLPT, JFT, Mensetsu, nilai) hanya mengambil yang BARU sejak cek terakhir.
 * Setiap tulis dari perangkat ini ke data seorang siswa otomatis membuang cache siswa itu. */
const GURU_TTL = 30 * 60e3;
let _idbP = null;
function _idb() {
  if (!_idbP) _idbP = new Promise((res, rej) => { try { const r = indexedDB.open("shirose-guru-cache", 1); r.onupgradeneeded = () => r.result.createObjectStore("kv"); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); } catch (e) { rej(e); } });
  return _idbP;
}
async function _kvGet(k) { try { const d = await _idb(); return await new Promise(res => { const t = d.transaction("kv").objectStore("kv").get(k); t.onsuccess = () => res(t.result); t.onerror = () => res(undefined); }); } catch (e) { return undefined; } }
async function _kvSet(k, v) { try { const d = await _idb(); await new Promise(res => { const t = d.transaction("kv", "readwrite"); t.objectStore("kv").put(v, k); t.oncomplete = res; t.onerror = res; }); } catch (e) {} }
async function _kvHapusAwalan(pre) { try { const d = await _idb(); await new Promise(res => { const t = d.transaction("kv", "readwrite"), st = t.objectStore("kv"), c = st.openCursor(); c.onsuccess = () => { const cur = c.result; if (!cur) return; if (String(cur.key).startsWith(pre)) cur.delete(); cur.continue(); }; t.oncomplete = res; t.onerror = res; }); } catch (e) {} }
function _paksaGet() { try { return Number(localStorage.getItem("shirose-guru-paksa")) || 0; } catch (e) { return 0; } }
const _segar = (c) => c && c.cek && Date.now() - c.cek < GURU_TTL && c.cek > _paksaGet();
/* Timestamp dari cache jadi objek biasa → kembalikan jadi Timestamp (supaya .toDate()/.toMillis() jalan). */
function _tsFix(o) {
  if (!o || typeof o !== "object") return o;
  for (const k of Object.keys(o)) { const v = o[k]; if (v && typeof v === "object" && !(v instanceof Timestamp) && typeof v.seconds === "number" && typeof v.nanoseconds === "number" && Object.keys(v).length === 2) o[k] = new Timestamp(v.seconds, v.nanoseconds); }
  return o;
}
const _msTs = (t) => t && t.toMillis ? t.toMillis() : (t && typeof t.seconds === "number" ? t.seconds * 1000 + Math.floor((t.nanoseconds || 0) / 1e6) : 0);
/** Guru: tombol "Muat ulang" — data berikutnya diambil dari server (hasil ujian hanya yang baru). */
export function guruMuatUlang() { try { localStorage.setItem("shirose-guru-paksa", String(Date.now())); } catch (e) {} }
/** Guru: ambil ulang DAFTAR siswa (tombol "Refresh daftar"). */
export function guruMuatUlangSiswa() { _memSiswa = null; _kvHapusAwalan("siswa-list"); }
const _segarSiswa = (c) => c && c.cek && Date.now() - c.cek < 24 * 3600e3;
/** Guru: kosongkan seluruh cache (kalau ada data yang terasa tidak cocok). */
export async function guruKosongkanCache() { guruMuatUlang(); await _kvHapusAwalan(""); }
let _memSiswa = null;
function _cacheBuangSiswa(uid) { _memSiswa = null; _kvHapusAwalan("siswa-list"); if (uid) { _kvHapusAwalan("gami:" + uid); _kvHapusAwalan("srs:" + uid); } }
/* Bungkus fungsi tulis: kalau perangkat ini mengubah data siswa, cache guru untuk siswa itu dibuang. */
function _setelahTulis(ref) { if (!userIsGuru()) return; try { const m = /^siswa\/([^/]+)(?:\/([^/]+))?/.exec(ref && ref.path || ""); if (m) { _cacheBuangSiswa(m[1]); if (m[2]) _kvHapusAwalan(`hasil:${m[2]}:${m[1]}`); } } catch (e) {} }
/* Hasil milik siswa sendiri (jlpt_hasil, jft_hasil, mensetsu_hasil, nilai) juga disimpan di perangkat.
 * Saat siswa menyimpan/menghapus hasil, cache ikut diperbarui → membuka riwayat tidak perlu baca ulang. */
const HASIL_SUBS = new Set(["jlpt_hasil", "jft_hasil", "mensetsu_hasil", "nilai"]);
function _sayaInfo(path) { const m = /^siswa\/([^/]+)\/([^/]+)(?:\/([^/]+))?$/.exec(path || ""); if (!m || !currentUser || m[1] !== currentUser.uid || !HASIL_SUBS.has(m[2])) return null; return { uid: m[1], sub: m[2], id: m[3] }; }
function _bersihTs(data) { const o = { ...(data || {}) }; for (const k of Object.keys(o)) { const v = o[k]; if (v && typeof v === "object" && v._methodName === "serverTimestamp") o[k] = Timestamp.now(); } return o; }
async function _sayaCatat(inf, id, data, merge) {
  const key = `hasil:${inf.sub}:${inf.uid}`, c = await _kvGet(key); if (!c) return;
  let items = c.items || []; const i = items.findIndex(x => x.id === id);
  if (data === null) items = items.filter(x => x.id !== id);
  else { const row = { id, ..._bersihTs(data) }; if (i >= 0) items[i] = merge ? { ...items[i], ...row } : row; else items = [row, ...items]; c.max = Math.max(c.max || 0, _msTs(row.tgl)); }
  c.items = items; await _kvSet(key, c);
}
const setDoc = (ref, data, o) => { _setelahTulis(ref); const p = _setDoc0(ref, data, o); const inf = _sayaInfo(ref && ref.path); if (inf && inf.id) p.then(() => _sayaCatat(inf, inf.id, data, o && o.merge)).catch(() => {}); return p; };
const updateDoc = (ref, ...a) => { _setelahTulis(ref); return _updateDoc0(ref, ...a); };
const deleteDoc = (ref, ...a) => { _setelahTulis(ref); const p = _deleteDoc0(ref, ...a); const inf = _sayaInfo(ref && ref.path); if (inf && inf.id) p.then(() => _sayaCatat(inf, inf.id, null)).catch(() => {}); return p; };
const addDoc = async (ref, data) => { const r = await _addDoc0(ref, data); const inf = _sayaInfo(ref && ref.path); if (inf) { try { await _sayaCatat(inf, r.id, data, false); } catch (e) {} } return r; };
/* Hasil ujian per siswa: ambil hanya dokumen yang lebih baru dari cache (kueri kosong = 1 baca). */
const SAYA_TTL = 24 * 3600e3;
const _segarSaya = (c) => c && c.cek && Date.now() - c.cek < SAYA_TTL;
async function _hasilSaya(sub, limitN) { return _hasilGuru(currentUser.uid, sub, limitN, true); }
async function _hasilGuru(uid, sub, limitN, saya = false) {
  const key = `hasil:${sub}:${uid}`, c = await _kvGet(key);
  const cukup = c && c.items && (c.items.length >= limitN || c.habis);
  if (cukup && (saya ? _segarSaya(c) : _segar(c))) return c.items.slice(0, limitN).map(x => _tsFix({ ...x }));
  if (cukup && !saya && await _guruSinkronCG(sub)) { const c2 = (await _kvGet(key)) || c; return c2.items.slice(0, limitN).map(x => _tsFix({ ...x })); }
  const base = collection(db, "siswa", uid, sub);
  const lama = (c && c.items) || [];
  const q = c && c.max && (lama.length >= limitN || c.habis)
    ? query(base, where("tgl", ">", Timestamp.fromMillis(c.max)), orderBy("tgl", "desc"), limit(limitN))
    : query(base, orderBy("tgl", "desc"), limit(limitN));
  const baru = (await getDocs(q)).docs.map(d => ({ id: d.id, ...d.data() }));
  const ids = new Set(baru.map(x => x.id));
  const items = [...baru, ...lama.filter(x => !ids.has(x.id))].sort((a, b) => _msTs(b.tgl) - _msTs(a.tgl)).slice(0, Math.max(limitN, 300));
  const max = items.reduce((m, x) => Math.max(m, _msTs(x.tgl)), 0);
  const habis = (c && c.habis) || (!c || !c.max || lama.length < limitN ? baru.length < limitN : false);
  await _kvSet(key, { items, max, cek: Date.now(), habis });
  return items.slice(0, limitN).map(x => _tsFix({ ...x }));
}
/* Guru: SATU kueri collection group untuk semua hasil baru semua siswa (bukan 1 kueri per siswa).
 * Butuh rules {path=**}/<sub> + indeks tgl (collection group). Kalau belum ada → kembali ke cara per siswa. */
const _cgJalan = {};
async function _guruSinkronCG(sub) {
  if (_cgJalan[sub]) return _cgJalan[sub];
  return (_cgJalan[sub] = (async () => {
    const k = "cg:" + sub; let st = (await _kvGet(k)) || {};
    if (st.cek && st.cek > _paksaGet() && Date.now() - st.cek < GURU_TTL) return true;
    if (!st.max) {   // pertama kali: mulai dari cek per-siswa paling lama yang tersimpan
      const semua = await _kvSemua(`hasil:${sub}:`); if (!semua.length) return false;
      st.max = Math.min(...semua.map(([, v]) => v.cek || 0)) - 5 * 60e3;
    }
    try {
      const snap = await getDocs(query(collectionGroup(db, sub), where("tgl", ">", Timestamp.fromMillis(st.max)), orderBy("tgl", "desc"), limit(1000)));
      const per = {};
      snap.docs.forEach(d => { const u = d.ref.parent.parent.id; (per[u] = per[u] || []).push({ id: d.id, ...d.data() }); });
      for (const [u, baru] of Object.entries(per)) {
        const key = `hasil:${sub}:${u}`, c = await _kvGet(key); if (!c) continue;
        const ids = new Set(baru.map(x => x.id));
        c.items = [...baru, ...c.items.filter(x => !ids.has(x.id))].sort((a, b) => _msTs(b.tgl) - _msTs(a.tgl)).slice(0, Math.max(300, c.items.length));
        c.max = Math.max(c.max || 0, ...baru.map(x => _msTs(x.tgl))); await _kvSet(key, c);
      }
      st = { max: Math.max(st.max, ...snap.docs.map(d => _msTs(d.data().tgl))), cek: Date.now() };
      await _kvSet(k, st); return true;
    } catch (e) { console.warn(`[hemat] kueri ${sub} gabungan gagal (rules/indeks collection group belum ada), pakai cara per siswa:`, e.message); return false; }
  })().finally(() => { setTimeout(() => { delete _cgJalan[sub]; }, 0); }));
}
async function _kvSemua(pre) { try { const d = await _idb(); return await new Promise(res => { const out = [], t = d.transaction("kv"), c = t.objectStore("kv").openCursor(); c.onsuccess = () => { const cur = c.result; if (!cur) return; if (String(cur.key).startsWith(pre)) out.push([cur.key, cur.value]); cur.continue(); }; t.oncomplete = () => res(out); t.onerror = () => res(out); }); } catch (e) { return []; } }
const _guruLihatOrangLain = (uid) => userIsGuru() && uid !== currentUser?.uid;


const GURU_EMAIL = "randitsmuhamad50@gmail.com";
// Developer email (Part 6). Defaults to the same account as guru but kept
// separate so a future rename or multi-guru setup doesn't dilute dev powers.
const DEVELOPER_EMAIL = "randitsmuhamad50@gmail.com";

// Branding publik. Email moderator di atas tetap dipakai INTERNAL untuk
// autentikasi/role — jangan pernah ditampilkan ke siswa. Nama tampilan
// publik akun moderator/owner selalu memakai brand ini.
export const BRAND_NAME = "bysswnoou";
function _isOwnerEmail(email){ return !!email && (email === GURU_EMAIL || email === DEVELOPER_EMAIL); }
// Nama lama yang bocor dari prefix email moderator (mis. "randitsmuhamad50").
function _isLegacyOwnerNama(nama){
  if (!nama) return true;
  const ownerPrefixes = [GURU_EMAIL, DEVELOPER_EMAIL].map(e => e.split("@")[0].toLowerCase());
  const n = String(nama).toLowerCase();
  return ownerPrefixes.includes(n) || n.includes("randitsmuhamad");
}
// Bersihkan nama lama yang tersimpan di Firestore (mis. komentar lama).
function _cleanNama(nama){
  if (!nama) return nama;
  const ownerPrefixes = [GURU_EMAIL, DEVELOPER_EMAIL].map(e => e.split("@")[0].toLowerCase());
  const n = String(nama).toLowerCase();
  return (ownerPrefixes.includes(n) || n.includes("randitsmuhamad")) ? BRAND_NAME : nama;
}
/** Nama tampilan publik yang aman untuk user mana pun (tidak pernah membocorkan email owner). */
export function publicNama(u, siswaDoc){
  if (u && _isOwnerEmail(u.email)) return BRAND_NAME;
  return siswaDoc?.nama || (u?.email ? u.email.split("@")[0] : "") || "Anon";
}

// reCAPTCHA v3 lewat Firebase App Check: membuktikan permintaan datang dari
// situs ini (bukan bot/skrip). Isi site key reCAPTCHA v3 yang sudah didaftarkan
// di Firebase Console → App Check. Kosong = dilewati.
const RECAPTCHA_SITE_KEY = "";
function _pasangAppCheck(a){
  if (!RECAPTCHA_SITE_KEY) return;
  try { initializeAppCheck(a, { provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY), isTokenAutoRefreshEnabled: true }); }
  catch (e) { console.warn("App Check gagal diinisialisasi:", e?.message || e); }
}
const app = initializeApp(firebaseConfig);
_pasangAppCheck(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Make sign-in persist across reloads and tabs. We try the strongest option
// first (indexedDB) and fall back when the browser blocks it (Safari private
// mode, extensions, strict privacy). Without this a fresh profile can reload
// into a "signed-out" state even though the user just signed in — that's the
// "akun engga terdetect" bug we're fixing. Errors are swallowed because the
// in-memory default still works, just without cross-reload persistence.
(async () => {
  try {
    await setPersistence(auth, indexedDBLocalPersistence);
  } catch (_e1) {
    try {
      await setPersistence(auth, browserLocalPersistence);
    } catch (_e2) {
      try { await setPersistence(auth, browserSessionPersistence); } catch (_e3) {}
    }
  }
})();

/* ========== STATE ========== */
let currentUser = null;
let currentSiswaDoc = null;
let onReadyCallbacks = [];
let authListenerSet = false;

// Role helpers (Part 17). The siswa doc's `role` field is authoritative;
// the hard-coded GURU_EMAIL / DEVELOPER_EMAIL act as a bootstrap for the
// very first admin so they can grant roles to others.
export function siswaRole(doc){ return (doc && typeof doc.role === "string") ? doc.role : "student"; }
export function isGuru(user) {
  if (!user) return false;
  if (user.email === GURU_EMAIL) return true;
  const r = siswaRole(currentSiswaDoc);
  return r === "guru" || r === "admin" || r === "developer";
}
export function isDeveloper(user) {
  if (!user) return false;
  if (user.email === DEVELOPER_EMAIL) return true;
  return siswaRole(currentSiswaDoc) === "developer";
}
export function isAdmin(user) {
  if (!user) return false;
  if (user.email === DEVELOPER_EMAIL) return true; // developer >= admin
  const r = siswaRole(currentSiswaDoc);
  return r === "admin" || r === "developer";
}
export function userIsGuru()      { return isGuru(currentUser); }
export function userIsDeveloper() { return isDeveloper(currentUser); }
export function userIsAdmin()     { return isAdmin(currentUser); }

/* ---------- Admin ops (only callable when userIsAdmin()) ---------- */
export async function listSemuaAkun(){
  if (!userIsAdmin()) throw new Error("Hanya admin / developer");
  const snap = await getDocs(collection(db, "siswa"));
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
}
export async function setRole(uid, role) {
  if (!userIsAdmin()) throw new Error("Hanya admin / developer");
  const allowed = ["student","guru","admin","developer"];
  if (!allowed.includes(role)) throw new Error("Role invalid");
  // Only developer can grant developer/admin role.
  if ((role === "developer" || role === "admin") && !userIsDeveloper())
    throw new Error("Hanya developer yang bisa set admin / developer");
  await updateDoc(doc(db, "siswa", uid), { role });
}
export async function setUnlimitedCoins(uid, enable) {
  if (!userIsDeveloper()) throw new Error("Hanya developer");
  await updateDoc(doc(db, "siswa", uid), {
    "permissions.unlimited_coins": !!enable,
  });
}
// Unlimited coins when developer OR siswa doc explicitly has the permission.
// Note: permission must come from a trusted write (admin/dev) — client shouldn't
// grant it to itself. See firestore.rules.example.
/* Akun dengan akses penuh equipment + koin tak terbatas (diatur pemilik). Hanya berlaku di sisi klien (shop/inventory/wardrobe). */
const FULL_ACCESS_EMAILS = ["arumiganteng@gmail.com"];
export function hasFullAccess(user = currentUser) {
  const em = (user && user.email || "").trim().toLowerCase();
  if (!!em && FULL_ACCESS_EMAILS.includes(em)) return true;
  // Grup DEMO: siswa yang kelasnya bernama "demo" (diatur guru) atau punya permissions.full_access → akses penuh semua.
  const d = (user && user === currentUser) ? currentSiswaDoc : null;
  if (d) {
    if (d.permissions && d.permissions.full_access === true) return true;
    if (String(d.kelas || "").trim().toLowerCase() === "demo") return true;
  }
  return false;
}
export function hasUnlimitedCoins() {
  if (isDeveloper(currentUser)) return true;
  if (hasFullAccess(currentUser)) return true;
  return !!(currentSiswaDoc?.permissions?.unlimited_coins);
}
export function getUser() { return currentUser; }
export function getSiswaDoc() { return currentSiswaDoc; }

/* ========== AUTH ========== */
// Alasan login terakhir ditolak: "not_registered" | "disabled" | null.
// Dibaca halaman login untuk menampilkan pesan yang jelas.
export let lastAuthDenied = null;
export function getLastAuthDenied(){ const r = lastAuthDenied; lastAuthDenied = null; return r; }


const _CS = "shirose-siswa-cache-";
function _bacaCacheSiswa(uid){ try { const j = localStorage.getItem(_CS + uid); return j ? JSON.parse(j) : null; } catch(_) { return null; } }
function _simpanCacheSiswa(uid, d){ try { const c = { ...d }; delete c.created; delete c.aktif; localStorage.setItem(_CS + uid, JSON.stringify(c)); } catch(_) {} }
function _siswaDitolak(){ return lastSiswaDocStatus === "not_registered" || lastSiswaDocStatus === "disabled" || lastSiswaDocStatus === "demo_expired"; }
async function _tolakAkun(u){
  lastAuthDenied = lastSiswaDocStatus;
  try { localStorage.removeItem(_CS + u.uid); } catch(_) {}
  currentUser = null; currentSiswaDoc = null;
  try { await signOut(auth); } catch(_) {}
}
export function onAuth(cb) {
  if (!authListenerSet) {
    authListenerSet = true;
    onAuthStateChanged(auth, async (u) => {
      // Saat klaim akun demo berjalan, profil dibuat SETELAH akun Auth jadi —
      // tahan dulu supaya tidak dianggap "belum terdaftar".
      if (_demoCreating) { currentUser = u; return; }
      await _prosesAuthUser(u);
      if (u) setTimeout(() => simpanSekarang(), 5000);   // kirim sisa antrean dari sesi sebelumnya
    });
  }
  onReadyCallbacks.push(cb);
}

async function _prosesAuthUser(u) {
  currentUser = u;
  if (!u) { currentSiswaDoc = null; onReadyCallbacks.forEach(c => c(u, null)); return; }
  // Cepat: kalau profil terakhir tersimpan di perangkat, tampilkan langsung (tanpa menunggu Firestore),
  // lalu verifikasi ke server di latar belakang.
  const cached = _bacaCacheSiswa(u.uid);
  if (cached) {
    currentSiswaDoc = cached;
    lastSiswaDocStatus = "ok";
    onReadyCallbacks.forEach(c => c(u, currentSiswaDoc));
    const before = JSON.stringify([cached.aksesLevel, cached.role, cached.status]);
    await ensureSiswaDoc(u);
    if (_siswaDitolak()) return _tolakAkun(u);
    if (currentSiswaDoc) _simpanCacheSiswa(u.uid, currentSiswaDoc);
    const after = currentSiswaDoc ? JSON.stringify([currentSiswaDoc.aksesLevel, currentSiswaDoc.role, currentSiswaDoc.status]) : "";
    if (after !== before) onReadyCallbacks.forEach(c => c(u, currentSiswaDoc));
    return;
  }
  await ensureSiswaDoc(u);
  // Pendaftaran ditutup: akun tanpa profil / dinonaktifkan langsung dikeluarkan
  // (Firestore Rules juga menolak akses datanya).
  if (_siswaDitolak()) return _tolakAkun(u);
  if (currentSiswaDoc && lastSiswaDocStatus === "ok") _simpanCacheSiswa(u.uid, currentSiswaDoc);
  onReadyCallbacks.forEach(c => c(u, currentSiswaDoc));
}

/* ========== KLAIM AKUN DEMO 7 HARI (mandiri) ========== */
// Email  : <nama>demo1234@gmail.com   Password: <nama>1234   (nama = huruf/angka kecil)
// Masuk kelas "demo" (akses penuh); masa 7 hari memakai mekanisme demoSejak yang
// sudah ada. Firestore Rules membatasi profil yang boleh dibuat sendiri & menolak
// akses setelah 7 hari.
let _demoCreating = false;
export function demoKredensial(namaRaw) {
  const slug = String(namaRaw || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20);
  if (slug.length < 2) throw new Error("Nama minimal 2 huruf/angka (tanpa spasi atau simbol).");
  return { slug, email: `${slug}demo1234@gmail.com`, password: `${slug}1234` };
}
/* ===== Batas 1 akun demo per perangkat =====
 * Setelah membuat demo, perangkat ditandai di 3 tempat (localStorage, IndexedDB, cookie) supaya
 * tidak hilang hanya karena satu tempat dibersihkan. Masuk lagi ke akun demo yang SAMA tetap boleh. */
const DEMO_TANDA = "shirose-demo-perangkat";
function _idbPerangkat() { return new Promise((res, rej) => { try { const r = indexedDB.open("shirose-perangkat", 1); r.onupgradeneeded = () => r.result.createObjectStore("kv"); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); } catch (e) { rej(e); } }); }
async function _demoTandaBaca() {
  let v = null;
  try { v = JSON.parse(localStorage.getItem(DEMO_TANDA) || "null"); } catch (e) {}
  if (!v) { try { const m = document.cookie.match(new RegExp("(?:^|; )" + DEMO_TANDA + "=([^;]*)")); if (m) v = JSON.parse(decodeURIComponent(m[1])); } catch (e) {} }
  if (!v) { try { const d = await _idbPerangkat(); v = await new Promise(res => { const t = d.transaction("kv").objectStore("kv").get(DEMO_TANDA); t.onsuccess = () => res(t.result || null); t.onerror = () => res(null); }); } catch (e) {} }
  return v && v.email ? v : null;
}
async function _demoTandaTulis(email) {
  const v = { email, t: Date.now() }, str = JSON.stringify(v);
  try { localStorage.setItem(DEMO_TANDA, str); } catch (e) {}
  try { document.cookie = `${DEMO_TANDA}=${encodeURIComponent(str)}; max-age=${60 * 60 * 24 * 400}; path=/; SameSite=Lax`; } catch (e) {}
  try { const d = await _idbPerangkat(); await new Promise(res => { const t = d.transaction("kv", "readwrite"); t.objectStore("kv").put(v, DEMO_TANDA); t.oncomplete = res; t.onerror = res; }); } catch (e) {}
}
export async function klaimAkunDemo(namaRaw) {
  const { email, password } = demoKredensial(namaRaw);
  const namaTampil = String(namaRaw).trim().slice(0, 30) || email.split("@")[0];
  const tanda = await _demoTandaBaca();
  if (tanda && tanda.email !== email) {
    await _demoTandaTulis(tanda.email);   // pulihkan tanda di tempat yang mungkin sudah dihapus
    const namaLama = tanda.email.replace(/demo1234@gmail\.com$/, "");
    const err = new Error(`HP ini sudah pernah dipakai membuat akun demo (nama: "${namaLama}"). Satu HP hanya boleh 1 akun demo. Ketik nama "${namaLama}" untuk masuk lagi ke akun itu.`);
    err.code = "demo-perangkat-sudah";
    throw err;
  }
  _demoCreating = true;
  let user = null;
  try {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      user = cred.user;
      try {
        await setDoc(doc(db, "siswa", user.uid), {
          ..._profilBaru(user.uid, email, namaTampil, "demo", { n5:true, n4:true, n3:true, n2:true, n1:true }, "student"),
          aksesJft: true, aksesSsw: true,
          dibuatOleh: user.uid,
        });
      } catch (e) {
        try { await user.delete(); } catch(_) {}
        const err = new Error("Gagal menyimpan profil demo (" + (e.code || e.message) + "). Aturan Firestore untuk akun demo mungkin belum dipublikasikan.");
        err.code = "demo-profil-gagal";
        throw err;
      }
    } catch (e) {
      if (e.code !== "auth/email-already-in-use") throw e;
      // Nama yang sama sudah pernah klaim: masuk ke akun itu (kredensial sama).
      try { user = (await signInWithEmailAndPassword(auth, email, password)).user; }
      catch (e2) {
        const err = new Error("Nama itu sudah dipakai orang lain. Tambahkan angka/nama belakang, mis. budi2.");
        err.code = "demo-nama-dipakai";
        throw err;
      }
    }
  } finally {
    _demoCreating = false;
  }
  await _demoTandaTulis(email);
  await _prosesAuthUser(user);
  return { email, password };
}


// What role should a brand-new siswa doc carry? Guru / developer emails get
// elevated automatically so the first login already behaves as teacher, which
// also lets Firestore's isGuru() rule read other students. Everybody else is
// "student". Needs the updated firestore.rules.example (allows role at create
// when email matches the bootstrap list).
function _bootstrapRoleFor(u){
  if (!u || !u.email) return "student";
  if (u.email === DEVELOPER_EMAIL) return "developer";
  if (u.email === GURU_EMAIL)      return "guru";
  return "student";
}

// Status terakhir ensureSiswaDoc — dipakai halaman login untuk tahu apakah
// siswa doc benar-benar sudah dibuat di Firestore, atau cuma ada di Auth.
// Nilai: "ok" | "write_blocked" | "read_blocked" | "not_registered" | "disabled" | null
export let lastSiswaDocStatus = null;
export function getLastSiswaDocStatus(){ return lastSiswaDocStatus; }

async function ensureSiswaDoc(u, extra = {}) {
  // PENTING: fungsi ini TIDAK PERNAH throw ke caller onAuthStateChanged —
  // sebelumnya throw di sini bikin onReadyCallbacks tidak dipanggil dan UI
  // stuck di "Memuat…" untuk user yang akunnya orphan (ada di Firebase Auth
  // tapi tidak ada di Firestore). Caller yang butuh tahu hasilnya baca
  // lastSiswaDocStatus setelah await.
  const ref = doc(db, "siswa", u.uid);
  const bootstrapRole = _bootstrapRoleFor(u);
  const isOwner = bootstrapRole !== "student";

  // Nama default: untuk tamu (anonymous user, u.email == null) kasih
  // nama "Tamu-xxxx" biar beda dari akun siswa asli di dashboard guru.
  const emailStr = u.email || "";
  const defaultNama = u.isAnonymous
    ? `Tamu-${u.uid.slice(0, 5)}`
    : (_isOwnerEmail(emailStr) ? BRAND_NAME
       : (emailStr ? emailStr.split("@")[0] : `User-${u.uid.slice(0, 5)}`));
  const base = {
    nama: _isOwnerEmail(emailStr) ? BRAND_NAME : (extra.nama || u.displayName || defaultNama),
    email: emailStr,
    isTamu: !!u.isAnonymous,
    kelas: "",
    // Akses JLPT per siswa diatur guru di teacher.html (field aksesLevel).
    // Hanya akun moderator yang dibuat otomatis di sini, dengan akses penuh.
    aksesLevel: { n5:true, n4:true, n3:true, n2:true, n1:true },
    status: "aktif",
    karakter: {
      equipped: {
        rambut: null,
        pakaian: "seragam_default",
        sepatu: "shoes_default",
        aksesori: "none",
        item_tangan: "none",
        aura: "none",
      },
      inventory: ["seragam_default", "shoes_default", "none"],
      skinTone: "light",
      hairColor: "#2a1810",
    },
    created: serverTimestamp(),
    aktif: serverTimestamp(),
  };

  lastSiswaDocStatus = null;

  try {
    const snap = await getDoc(ref);
    if (!snap.exists() && !isOwner) {
      // Pendaftaran ditutup: profil siswa HANYA dibuat oleh guru/moderator
      // lewat teacher.html (buatAkunSiswa). Akun Auth tanpa profil = belum
      // terdaftar → ditolak (lihat onAuth).
      currentSiswaDoc = null;
      lastSiswaDocStatus = "not_registered";
      return;
    }
    if (!snap.exists()) {
      // Bootstrap akun moderator/owner pertama kali.
      try {
        await setDoc(ref, base);
        currentSiswaDoc = { ...base };
        lastSiswaDocStatus = "ok";
      } catch (writeErr){
        console.warn("ensureSiswaDoc: setDoc blocked oleh Firestore Rules:", writeErr?.code || writeErr?.message);
        currentSiswaDoc = { ...base };
        lastSiswaDocStatus = "write_blocked";
        lastSiswaDocError = writeErr;
        // TIDAK throw — biarkan UI render dengan placeholder dan tampilkan banner recovery.
      }
    } else {
      currentSiswaDoc = snap.data();
      if (!isOwner && currentSiswaDoc.status === "nonaktif"){
        currentSiswaDoc = null;
        lastSiswaDocStatus = "disabled";
        return;
      }
      if (isDemoKelas(currentSiswaDoc.kelas) && (currentSiswaDoc.role || "student") === "student" && Number(currentSiswaDoc.demoSejak) && demoSisaMs(currentSiswaDoc) <= 0 && !isOwner) {
        // Masa demo 7 hari habis → hapus profil + akun login sendiri (data lain disapu guru).
        currentSiswaDoc = null; lastSiswaDocStatus = "demo_expired";
        try { await deleteDoc(ref); } catch(_){}
        try { await currentUser.delete(); } catch(_){}
        return;
      }
      lastSiswaDocStatus = "ok";
      updateDoc(ref, { aktif: serverTimestamp() }).catch(()=>{});
      // aksesLevel dibaca apa adanya dari database — TIDAK di-upgrade
      // otomatis. Perubahan akses oleh guru langsung berlaku saat login.
      if (!currentSiswaDoc.aksesLevel) currentSiswaDoc.aksesLevel = { n5:false, n4:false, n3:false, n2:false, n1:false };
    }

    // Rebranding: nama publik akun moderator lama masih "randitsmuhamad50"
    // (prefix email). Ganti ke BRAND_NAME supaya tidak tampil di leaderboard
    // / komentar / daftar siswa. Email TIDAK diubah. Rules mengizinkan user
    // mengubah `nama` dokumennya sendiri.
    if (_isOwnerEmail(emailStr) && _isLegacyOwnerNama(currentSiswaDoc.nama)){
      currentSiswaDoc.nama = BRAND_NAME;
      updateDoc(ref, { nama: BRAND_NAME }).catch(e => {
        console.warn("rename owner nama blocked:", e?.code);
      });
    }

    // Bootstrap guru/developer role untuk owner email.
    if (isOwner && currentSiswaDoc.role !== bootstrapRole){
      try {
        await updateDoc(ref, { role: bootstrapRole });
        currentSiswaDoc.role = bootstrapRole;
      } catch (_e){ /* perlu rules baru; dashboard tetap bisa jalan */ }
    }
  } catch (e){
    console.warn("ensureSiswaDoc: read blocked:", e?.code || e?.message);
    currentSiswaDoc = { ...base, role: bootstrapRole };
    lastSiswaDocStatus = "read_blocked";
    lastSiswaDocError = e;
  }
}

export let lastSiswaDocError = null;

/**
 * Hapus akun saya SENDIRI (Firebase Auth user + siswa doc kalau ada).
 * Dipakai user yang orphan supaya bisa daftar ulang dengan email yang sama.
 * HARUS login dulu (Firebase client Auth requirement).
 */
export async function hapusAkunSendiri(){
  if (!currentUser) throw new Error("Belum login");
  const uid = currentUser.uid;
  // Best-effort delete siswa doc dulu (kalau ada).
  try { await deleteDoc(doc(db, "siswa", uid)); } catch(_){}
  // Delete Firebase Auth user — ini yang critical supaya email bisa dipakai lagi.
  try {
    await currentUser.delete();
  } catch(e){
    // Firebase kadang minta "recent login" untuk delete. Kasih pesan jelas.
    if (e.code === "auth/requires-recent-login"){
      throw new Error(
        "Firebase minta login ulang sebelum hapus akun (keamanan). " +
        "Silakan logout, login lagi, lalu klik tombol hapus akun ini sekali lagi."
      );
    }
    throw e;
  }
  currentUser = null;
  currentSiswaDoc = null;
  lastSiswaDocStatus = null;
  return true;
}

/**
 * Coba buat ulang siswa doc untuk user yang sudah login tapi dokumennya hilang.
 * Dipakai tombol "Perbaiki Akun Saya" di UI: user yang akunnya ada di Firebase
 * Auth tapi tidak terlihat di dashboard guru bisa menekan tombol ini.
 */
export async function reparasiAkunSaya(nama){
  if (!currentUser) throw new Error("Belum login");
  await ensureSiswaDoc(currentUser, { nama });
  return { status: lastSiswaDocStatus, doc: currentSiswaDoc };
}

export async function login(email, pwd) {
  return await signInWithEmailAndPassword(auth, email, pwd);
}
export async function daftar(email, pwd, nama) {
  // Pendaftaran mandiri DITUTUP — akun siswa dibuat guru/moderator dari
  // teacher.html. Firestore Rules juga menolak pembuatan profil oleh siswa.
  throw new Error("Pendaftaran mandiri ditutup. Minta akun ke guru/moderator.");
}
async function _daftarLamaTidakDipakai(email, pwd, nama) {
  // Step 1: buat user di Firebase Auth.
  const cred = await createUserWithEmailAndPassword(auth, email, pwd);
  // Step 2: pastikan siswa doc tercipta. ensureSiswaDoc tidak throw lagi
  // (biar onAuthStateChanged tidak stuck untuk login orphan). Kita cek
  // lastSiswaDocStatus setelah await.
  await ensureSiswaDoc(cred.user, { nama: nama || null });
  if (lastSiswaDocStatus !== "ok"){
    const writeErr = lastSiswaDocError;
    // Rollback: hapus akun Auth supaya email bisa dipakai daftar lagi
    // setelah rules diperbaiki, daripada stuck "email sudah terdaftar".
    try { await cred.user.delete(); } catch(_){}
    const err = new Error(
      "Pendaftaran belum selesai: Firestore Rules menolak pembuatan profil " +
      "siswa. Guru perlu deploy ulang firestore.rules.example di Firebase " +
      "Console. Email kamu sudah dihapus otomatis, silakan coba daftar ulang " +
      "setelah guru memberi tahu rules sudah diperbaiki. " +
      "(Detail: " + (writeErr?.code || writeErr?.message || "permission-denied") + ")"
    );
    err.code = "siswa-doc-create-blocked";
    throw err;
  }
  return cred;
}
export async function keluar() { try { await simpanSekarang(); } catch (e) {} return await signOut(auth); }
export async function resetPassword(email) { return await sendPasswordResetEmail(auth, email); }

/**
 * Masuk sebagai Tamu (anonymous Firebase Auth user). Perlu Anonymous
 * provider di-enable di Firebase Console → Authentication → Sign-in
 * method. Kalau belum, Firebase throw auth/admin-restricted-operation
 * atau auth/operation-not-allowed — caller tampilkan pesan panduan.
 * Tamu dapat akses JLPT penuh (thanks to workaround Nov 2026) tapi
 * progres tidak permanen antar device.
 */
export async function masukTamu(){
  throw new Error("Mode tamu ditutup. Minta akun ke guru/moderator.");
}
async function _masukTamuLamaTidakDipakai(){
  const cred = await signInAnonymously(auth);
  // Siswa doc otomatis dibuat oleh onAuthStateChanged → ensureSiswaDoc.
  // Nama default "Tamu-xxxxx" biar guru tahu kalau ini anonymous.
  return cred;
}
export function isGuestUser(){
  return !!(currentUser && currentUser.isAnonymous);
}

/* ========== CHARACTER / INVENTORY ========== */
export async function updateKarakter(karakter) {
  if (!currentUser) return;
  await updateDoc(doc(db, "siswa", currentUser.uid), { karakter });
  currentSiswaDoc.karakter = karakter; publishKarakter();
}
export async function beliItem(kategori, itemId, harga, level) {
  if (!currentUser) throw new Error("Harus login dulu");
  const uid = currentUser.uid;
  const ref = doc(db, "siswa", uid);
  const siswa = (await getDoc(ref)).data();
  // Developer / permission-granted accounts bypass coin deduction entirely.
  const unlimited = isDeveloper(currentUser) || hasFullAccess(currentUser) || !!(siswa?.permissions?.unlimited_coins);
  const inv0 = siswa.karakter?.inventory || [];
  if (inv0.includes(itemId)) throw new Error("Sudah dimiliki");
  const gamiRef = doc(db, "siswa", uid, "gami", level);
  let gami, saldoW = null;
  if (!unlimited && !_walletOff) { try { saldoW = await walletTx(-harga, "toko: " + itemId); } catch (e) { if (/tidak cukup/i.test(e.message)) throw e; _walletOff = true; } }
  if (saldoW !== null) gami = { koin: saldoW };
  else {
    const gamiSnap = await getDoc(gamiRef);
    gami = gamiSnap.exists() ? gamiSnap.data() : { xp:0, koin:0, streak:0, level_karakter:1 };
    if (!unlimited && (gami.koin || 0) < harga) throw new Error("Koin tidak cukup!");
    if (!unlimited) gami.koin -= harga;
  }
  // Add to inventory
  const inv = siswa.karakter?.inventory || [];
  if (inv.includes(itemId)) throw new Error("Sudah dimiliki");
  inv.push(itemId);
  if (saldoW === null) await setDoc(gamiRef, gami, { merge: true });
  await updateDoc(ref, { "karakter.inventory": inv });
  currentSiswaDoc.karakter.inventory = inv;
  return { newKoin: gami.koin, unlimited };
}
export async function setBodyType(b) {
  if (!currentUser) return;
  await updateDoc(doc(db, "siswa", currentUser.uid), { "karakter.body": b });
  if (currentSiswaDoc && currentSiswaDoc.karakter) currentSiswaDoc.karakter.body = b; publishKarakter();
}
export async function setBentukKarakter(b) {
  if (!currentUser) return;
  await updateDoc(doc(db, "siswa", currentUser.uid), { "karakter.bentuk": b });
  if (currentSiswaDoc && currentSiswaDoc.karakter) currentSiswaDoc.karakter.bentuk = b; publishKarakter();
}
export async function equipItem(kategori, itemId) {
  if (!currentUser) return;
  const eq = currentSiswaDoc.karakter.equipped || {};
  eq[kategori] = itemId;
  await updateDoc(doc(db, "siswa", currentUser.uid), { "karakter.equipped": eq });
  currentSiswaDoc.karakter.equipped = eq; publishKarakter();
}

/* ========== DOMPET KOIN TUNGGAL ==========
 * Satu saldo untuk semua level JLPT / JFT / SSW / Mensetsu / toko / gacha: siswa/{uid}/wallet/main { koin, migrasi:{lvl:true} }.
 * Saldo lama di gami/{lvl}.koin dimigrasi SEKALI per level (ditandai migrasi[lvl]) lalu tidak dipakai lagi (dokumen lama tidak dihapus).
 * Jika dompet tidak bisa diakses (rules/jaringan) → kembali ke perilaku lama per level, tidak ada koin hilang.
 * Log transaksi: siswa/{uid}/wallet_log/{id} (best-effort). */
/* ===== GACHA 100% LOKAL (tanpa Firestore): pity, inventaris, dan koin yang sudah dibelanjakan disimpan di perangkat siswa. =====
 * Saldo efektif = saldo dompet server − koin yang dipakai gacha di perangkat ini. */
function _gLocal() { try { return JSON.parse(localStorage.getItem("shirose-gacha:" + (currentUser && currentUser.uid)) || "null") || {}; } catch (e) { return {}; } }
function _gSave(o) { try { localStorage.setItem("shirose-gacha:" + currentUser.uid, JSON.stringify(o)); } catch (e) {} }
function _gSpent() { return Number(_gLocal().spent) || 0; }
export function gachaSpend(price) { const o = _gLocal(); o.spent = (Number(o.spent) || 0) + price; o.t = Date.now(); _gSave(o); }
export function gachaRefund(price) { const o = _gLocal(); o.spent = Math.max(0, (Number(o.spent) || 0) - price); o.t = Date.now(); _gSave(o); }
/* Saldo dasar dompet (sebelum dikurangi belanja gacha lokal) disimpan di perangkat → saat server tak terjangkau (kuota/offline) saldo tetap benar. */
function _baseGet() { try { const v = JSON.parse(localStorage.getItem("shirose-walletbase:" + (currentUser && currentUser.uid)) || "null"); return v && typeof v.koin === "number" ? v.koin : null; } catch (e) { return null; } }
function _baseSet(k) { try { if (currentUser && typeof k === "number") localStorage.setItem("shirose-walletbase:" + currentUser.uid, JSON.stringify({ koin: k, t: Date.now() })); } catch (e) {} }
/* Saldo yang ditampilkan bila dompet tidak terbaca: cache saldo server − koin gacha; tanpa cache: koin per-level − koin gacha. */
function _koinFallback(levelKoin) { const b = _baseGet(); return Math.max(0, (b !== null ? b : (Number(levelKoin) || 0)) - _gSpent()); }
const WALLET_LVLS = ["n5","n4","n3","n2","n1","ir0","ir1","ir2"];
let _walletOff = false, _walletErr = "", _resetTok = 0;
export function walletError() { return _walletErr; }
async function walletTx(delta, alasan, { allowNegative = false } = {}) {
  const uid = currentUser.uid, wref = doc(db, "siswa", uid, "wallet", "main");
  const grefs = WALLET_LVLS.map(l => doc(db, "siswa", uid, "gami", l));
  // Belanja (delta < 0): koin hadiah yang masih di antrean ikut dikirim di transaksi yang sama, supaya saldo server cukup.
  let pk = 0;
  if (delta < 0) { const q = _q(); pk = Number(q.koin) || 0; if (pk) { q.koin = 0; _qSet(q); } }
  const _balikPk = () => { if (pk) { const q = _q(); q.koin = (Number(q.koin) || 0) + pk; _qSet(q); pk = 0; } };
  const delta0 = delta; delta = delta + pk;
  let out;
  try { out = await runTransaction(db, async (tx) => {
    const ws = await tx.get(wref);
    const w = ws.exists() ? ws.data() : { koin: 0, migrasi: {} }; w.migrasi = { ...(w.migrasi || {}) }; w.koin = w.koin || 0;
    _resetTok = Number(w.spentReset) || 0;
    // Baca dokumen gami lama HANYA untuk level yang belum dimigrasi (hemat kuota Firestore: 1 baca, bukan 9, untuk akun yang sudah migrasi)
    const sisa = WALLET_LVLS.map((l, i) => [l, grefs[i]]).filter(([l]) => !w.migrasi[l]);
    const gs = await Promise.all(sisa.map(([, r]) => tx.get(r)));
    sisa.forEach(([l], i) => { w.koin += gs[i].exists() ? (gs[i].data().koin || 0) : 0; w.migrasi[l] = true; });
    if (delta < 0 && !allowNegative && w.koin + delta < 0) throw new Error("Koin tidak cukup!");
    w.koin += delta;
    tx.set(wref, { koin: w.koin, migrasi: w.migrasi, uid, updated: serverTimestamp() }, { merge: true });
    return w.koin;
  }); } catch (e) { _balikPk(); throw e; }
  if (pk) { try { await addDoc(collection(db, "siswa", uid, "wallet_log"), { t: serverTimestamp(), delta: pk, alasan: "hadiah belajar", saldo: out - delta0 }); } catch (e) {} }
  delta = delta0;
  _baseSet(out);
  // Guru mengatur ulang koin (spentReset di dompet) → hapus catatan belanja gacha lama di perangkat ini (sekali per penyetelan)
  { const o = _gLocal(); if (_resetTok > (Number(o.spentSeen) || 0)) { o.spent = 0; o.spentSeen = _resetTok; _gSave(o); } }
  const _eff = Math.max(0, out - _gSpent());
  if (delta) { try { await addDoc(collection(db, "siswa", currentUser.uid, "wallet_log"), { t: serverTimestamp(), delta, alasan: String(alasan || ""), saldo: out }); } catch (e) {} }
  return _eff;
}
/* Cek saldo = BACA SAJA (1 baca, 0 tulis). Transaksi tulis hanya dipakai sekali untuk akun yang belum dimigrasi ke dompet tunggal. */
async function _walletBaca() {
  const ws = await getDoc(doc(db, "siswa", currentUser.uid, "wallet", "main"));
  const w = ws.exists() ? ws.data() : null;
  if (!w || WALLET_LVLS.some(l => !(w.migrasi || {})[l])) return walletTx(0, "");
  const out = Number(w.koin) || 0;
  _resetTok = Number(w.spentReset) || 0;
  _baseSet(out);
  { const o = _gLocal(); if (_resetTok > (Number(o.spentSeen) || 0)) { o.spent = 0; o.spentSeen = _resetTok; _gSave(o); } }
  return Math.max(0, out - _gSpent());
}
export async function getWalletKoin() {
  if (!currentUser) return null;
  try { const k = await _walletBaca(); _walletOff = false; _walletErr = ""; return k + _koinAntrean(); } catch (e) { console.warn("wallet gagal, pakai saldo per level:", e.message); _walletErr = e.code || e.message; _walletOff = true; return null; }
}
/* Tambah (atau kurangi, delta<0) koin dari fitur apa pun. Mengembalikan saldo baru atau null. */
export async function tambahKoin(delta, alasan) {
  if (!currentUser || !delta) return null;
  for (let i = 0; i < 2; i++) {   // coba lagi sekali: error jaringan sesaat tidak boleh mematikan dompet
    try { const k = await walletTx(delta, alasan); _walletOff = false; _walletErr = ""; return k + _koinAntrean(); }
    catch (e) {
      if (/tidak cukup/i.test(e.message)) throw e;
      console.warn("wallet gagal:", e.message); _walletErr = e.code || e.message; _walletOff = true;
      if (/resource-exhausted|quota/i.test(_walletErr + " " + e.message)) return await _koinTulisSaja(delta, alasan);   // kuota BACA habis → pakai tulis saja
      if (/permission|denied/i.test(_walletErr)) break; await new Promise(r => setTimeout(r, 600));
    }
  }
  return null;
}
/* Cadangan saat kuota BACA Firestore habis (transaksi butuh baca): ubah saldo dengan increment() = tulis murni, tanpa baca.
 * Saldo awal diambil dari data yang sudah dimuat (state/cache). Kurang dari 0 ditolak di klien. */
async function _koinTulisSaja(delta, alasan) {
  const st = window.__SHIROSE_STATE; const sekarang = Number(st && st.gami && st.gami.koin) || 0;
  if (delta < 0 && sekarang + delta < 0) throw new Error("Koin tidak cukup!");
  const wref = doc(db, "siswa", currentUser.uid, "wallet", "main");
  await setDoc(wref, { koin: increment(delta), uid: currentUser.uid, updated: serverTimestamp() }, { merge: true });
  const baru = sekarang + delta; if (st && st.gami) st.gami.koin = baru;
  { const b = _baseGet(); if (b !== null) _baseSet(b + delta); }
  try { await addDoc(collection(db, "siswa", currentUser.uid, "wallet_log"), { t: serverTimestamp(), delta, alasan: String(alasan || "") + " (mode tulis)", saldo: baru }); } catch (e) {}
  return baru;
}

/* ===== REWARD LOGIN 30 HARI: siswa/{uid}/login_reward/main = {hari, last, siklus, pending} (+ cadangan localStorage) ===== */
export function emailSaatIni() { return (currentUser && currentUser.email || "").toLowerCase(); }
export function namaSaatIni() { return String((currentSiswaDoc && currentSiswaDoc.nama) || (currentUser && currentUser.displayName) || ""); }
export async function getRewardFlag(id) {   // penanda sekali-pakai (mis. refund) di siswa/{uid}/login_reward/{id} + cadangan lokal
  if (!currentUser) return true; const k = "shirose-rwflag:" + currentUser.uid + ":" + id;
  try { if (localStorage.getItem(k)) return true; } catch (e) {}
  try { const sn = await getDoc(doc(db, "siswa", currentUser.uid, "login_reward", id)); if (sn.exists()) { try { localStorage.setItem(k, "1"); } catch (e) {} return true; } } catch (e) { return true; }   // gagal baca → jangan beri (aman)
  return false;
}
export async function setRewardFlag(id) {
  if (!currentUser) return; try { localStorage.setItem("shirose-rwflag:" + currentUser.uid + ":" + id, "1"); } catch (e) {}
  await setDoc(doc(db, "siswa", currentUser.uid, "login_reward", id), { t: Date.now(), ok: true });
}
export async function getLoginReward() {
  if (!currentUser) return null; const k = "shirose-loginrw:" + currentUser.uid; let loc = null;
  try { loc = JSON.parse(localStorage.getItem(k) || "null"); } catch (e) {}
  if (loc && Date.now() - (Number(loc.t) || 0) < 6 * 3600e3) return loc;   // baru disimpan di perangkat ini → tanpa baca
  let srv = null; try { const sn = await getDoc(doc(db, "siswa", currentUser.uid, "login_reward", "main")); srv = sn.exists() ? sn.data() : null; } catch (e) {}
  const pilih = [srv, loc].filter(Boolean).sort((a, b) => (Number(b.t) || 0) - (Number(a.t) || 0))[0];
  return pilih || { hari: 0, last: "", siklus: 0, pending: null };
}
export async function saveLoginReward(o) {
  if (!currentUser) return; o = { ...o, t: Date.now() };
  try { localStorage.setItem("shirose-loginrw:" + currentUser.uid, JSON.stringify(o)); } catch (e) {}
  try { await setDoc(doc(db, "siswa", currentUser.uid, "login_reward", "main"), o); } catch (e) { console.warn("login_reward:", e.message); }
}
export async function getGachaState() {
  if (!currentUser) return null;
  const o = _gLocal(); return { sinceEpic: o.sinceEpic || 0, sinceLegend: o.sinceLegend || 0, inv: o.inv || [] };
}
/* Simpan status & inventaris gacha di perangkat (localStorage). Barang toko ikut dimasukkan ke inventaris karakter di memori. */
export async function saveGachaState(state, shopIds) {
  if (!currentUser) throw new Error("Belum login");
  const o = _gLocal(); o.sinceEpic = state.sinceEpic || 0; o.sinceLegend = state.sinceLegend || 0; o.inv = state.inv || []; o.t = Date.now(); _gSave(o);
  if (!(shopIds && shopIds.length)) await _gachaInvKeAkun(o.inv);   // hadiah tema saja: tetap disimpan ke akun
  if (shopIds && shopIds.length && currentSiswaDoc) {
    currentSiswaDoc.karakter = currentSiswaDoc.karakter || {};
    currentSiswaDoc.karakter.inventory = Array.from(new Set([...(currentSiswaDoc.karakter.inventory || []), ...shopIds]));
    try { await updateDoc(doc(db, "siswa", currentUser.uid), { "karakter.inventory": currentSiswaDoc.karakter.inventory, "karakter.gachaInv": o.inv }); } catch (e) { console.warn("simpan hadiah gacha ke akun gagal (tersimpan di perangkat):", e.message); }
  }
}

/* Hadiah peti login: pastikan barang BENAR-BENAR masuk inventaris akun (Firestore), bukan hanya perangkat.
 * Memakai arrayUnion (tidak menimpa barang lain). Coba updateDoc dulu, lalu setDoc merge bila dokumen belum ada.
 * Mengembalikan true bila tersimpan di akun; false bila gagal (barang tetap aman di perangkat). */
export async function pastikanHadiahDiAkun(ids) {
  if (!currentUser) return false;
  ids = (Array.isArray(ids) ? ids : [ids]).filter(x => typeof x === "string" && x);
  if (!ids.length) return true;
  const ref = doc(db, "siswa", currentUser.uid), gi = Array.from(new Set([...(_gLocal().inv || []), ...ids]));
  let ok = false;
  try { await updateDoc(ref, { "karakter.inventory": arrayUnion(...ids), "karakter.gachaInv": arrayUnion(...gi) }); ok = true; }
  catch (e1) {
    try { await setDoc(ref, { karakter: { inventory: arrayUnion(...ids), gachaInv: arrayUnion(...gi) } }, { merge: true }); ok = true; }
    catch (e2) { console.warn("hadiah peti ke akun gagal:", e2.message); }
  }
  if (ok && currentSiswaDoc) {
    currentSiswaDoc.karakter = currentSiswaDoc.karakter || {};
    currentSiswaDoc.karakter.inventory = Array.from(new Set([...(currentSiswaDoc.karakter.inventory || []), ...ids]));
    currentSiswaDoc.karakter.gachaInv = Array.from(new Set([...(currentSiswaDoc.karakter.gachaInv || []), ...gi]));
  }
  return ok;
}

/* ===== SAVE GACHA (file) — simpan di perangkat + Download Save / Muat Save. Yang dipakai selalu save TERBARU (cap waktu `t`). ===== */
export function gachaSaveInfo() { const o = _gLocal(); let dl = 0; try { dl = Number(localStorage.getItem("shirose-gacha-dl:" + (currentUser && currentUser.uid))) || 0; } catch (e) {} return { t: Number(o.t) || 0, dl, n: (o.inv || []).length }; }
export function gachaExportSave() {
  if (!currentUser) throw new Error("Belum login");
  const o = _gLocal(), t = Number(o.t) || 0;
  try { localStorage.setItem("shirose-gacha-dl:" + currentUser.uid, String(Date.now())); } catch (e) {}
  return { app: "shirose-gacha-save", v: 1, uid: currentUser.uid, email: currentUser.email || "", nama: (currentSiswaDoc && currentSiswaDoc.nama) || "", t, exportedAt: Date.now(),
    sinceEpic: o.sinceEpic || 0, sinceLegend: o.sinceLegend || 0, inv: o.inv || [], spent: Number(o.spent) || 0 };
}
/* Hasil: {status:"dipakai"|"lebih-lama"|"sama", ...}. Save file dipakai hanya kalau lebih baru dari save di perangkat. */
export function gachaImportSave(d) {
  if (!currentUser) throw new Error("Belum login");
  if (!d || d.app !== "shirose-gacha-save" || !Array.isArray(d.inv)) throw new Error("Ini bukan file Save Gacha SHIROSE");
  if (d.uid !== currentUser.uid) throw new Error("Save ini milik akun lain" + (d.nama ? " (" + d.nama + ")" : "") + ", tidak bisa dipakai di akun ini");
  const o = _gLocal(), tl = Number(o.t) || 0, tf = Number(d.t) || 0;
  if (tf < tl) return { status: "lebih-lama", tFile: tf, tLokal: tl };
  if (tf === tl && (o.inv || []).length >= d.inv.length) return { status: "sama", tFile: tf, tLokal: tl };
  o.inv = d.inv.filter(x => typeof x === "string"); o.sinceEpic = Number(d.sinceEpic) || 0; o.sinceLegend = Number(d.sinceLegend) || 0; o.spent = Math.max(0, Number(d.spent) || 0); o.t = tf; _gSave(o);
  return { status: "dipakai", n: o.inv.length, tFile: tf, tLokal: tl };
}
/* Hadiah gacha di perangkat (id barang toko + tema). Dipakai agar hadiah tak hilang dari "dimiliki". */
async function _gachaInvKeAkun(inv) { try { if (currentSiswaDoc) { currentSiswaDoc.karakter = currentSiswaDoc.karakter || {}; currentSiswaDoc.karakter.gachaInv = inv; } await updateDoc(doc(db, "siswa", currentUser.uid), { "karakter.gachaInv": inv }); } catch (e) {} }
export function gachaInvLocal() { return (currentUser && _gLocal().inv) || []; }
/* Salin hadiah gacha yang baru ada di perangkat ke inventaris akun (Firestore). isShop(id) → true untuk barang toko. Aman dipanggil berulang. */
export async function syncGachaInventory(isShop) {
  if (!currentUser || !currentSiswaDoc) return 0;
  // Gabungkan daftar hadiah gacha di akun dengan yang di perangkat (dua arah) → hadiah tidak hilang saat ganti HP/browser
  { const remote = (currentSiswaDoc.karakter && currentSiswaDoc.karakter.gachaInv) || [], o = _gLocal(), loc = o.inv || [];
    const gab = Array.from(new Set([...loc, ...remote]));
    if (gab.length !== loc.length) { o.inv = gab; _gSave(o); }
    if (gab.length !== remote.length) await _gachaInvKeAkun(gab); }
  const cur = (currentSiswaDoc.karakter && currentSiswaDoc.karakter.inventory) || [];
  const baru = gachaInvLocal().filter(id => isShop(id) && !cur.includes(id));
  if (!baru.length) return 0;
  const inv = Array.from(new Set([...cur, ...baru]));
  currentSiswaDoc.karakter = currentSiswaDoc.karakter || {}; currentSiswaDoc.karakter.inventory = inv;
  try { await updateDoc(doc(db, "siswa", currentUser.uid), { "karakter.inventory": inv }); } catch (e) { console.warn("sync hadiah gacha gagal:", e.message); }
  return baru.length;
}
/* Guru: atur saldo dompet siswa (mis. pengembalian koin gacha). Juga mereset catatan belanja gacha di perangkat siswa. */
export async function setWalletKoinOf(uid, koin, alasan) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  koin = Math.max(0, Math.round(Number(koin) || 0));
  const wref = doc(db, "siswa", uid, "wallet", "main"), cur = await getDoc(wref), lama = cur.exists() ? (cur.data().koin || 0) : 0;
  await setDoc(wref, { koin, uid, spentReset: Date.now(), updated: serverTimestamp() }, { merge: true });
  try { await addDoc(collection(db, "siswa", uid, "wallet_log"), { t: serverTimestamp(), delta: koin - lama, alasan: String(alasan || "atur koin oleh guru"), saldo: koin }); } catch (e) {}
  return koin;
}
export function ownedShopIds() { return (currentSiswaDoc && currentSiswaDoc.karakter && currentSiswaDoc.karakter.inventory) || []; }
export async function getWalletOf(uid) {
  if (!userIsGuru() && uid !== currentUser?.uid) throw new Error("Tidak diizinkan");
  const s = await getDoc(doc(db, "siswa", uid, "wallet", "main")); return s.exists() ? s.data() : null;
}
export async function listWalletLogOf(uid, n = 30) {
  if (!userIsGuru() && uid !== currentUser?.uid) throw new Error("Tidak diizinkan");
  const snap = await getDocs(query(collection(db, "siswa", uid, "wallet_log"), orderBy("t", "desc"), limit(n)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/* ========== GAMI (XP / Streak per level; koin → dompet tunggal) ========== */
export async function getGami(level) {
  if (!currentUser) return null;
  try {
    // Baca dokumen gami & dompet PARALEL (dulu berurutan → login/ganti akun terasa ngelag).
    // Cache perangkat 6 jam: buka web / pindah halaman tidak membaca ulang XP & saldo.
    const cg = _lcGet(_gamiKey(level)), segar = cg && _baseSegar();
    const [snap, k, lvMax] = await Promise.all([
      segar ? null : getDoc(doc(db, "siswa", currentUser.uid, "gami", level)),
      segar ? null : getWalletKoin().catch(() => null),
      _levelAkun(level).catch(() => 0),
    ]);
    const g = segar ? { ...cg } : (snap.exists() ? snap.data() : { xp:0, koin:0, streak:0, level_karakter:1 });
    if (!segar) _lcSet(_gamiKey(level), g);
    g.koin = k !== null ? k : _koinFallback(g.koin) + _koinAntrean();
    _gamiServer[level] = { ...g };
    // Level karakter = level TERTINGGI di semua level JLPT/JFT (dulu hanya dokumen level aktif -> tampak "turun" saat pindah level)
    g.level_level_ini = g.level_karakter || 1;
    g.level_karakter = Math.max(g.level_karakter || 1, lvMax || 1);
    _lvSet(g.level_karakter);
    _terapkanAntreanXP(level, g);   // XP yang belum terkirim ikut ditampilkan
    return g;
  } catch (e) { console.warn("getGami failed:", e.message); return { xp:0, koin:_koinFallback(0) + _koinAntrean(), streak:0, level_karakter:Math.max(1, _lvGet()) }; }
}
// Level akun: cache 6 jam di perangkat; baca dokumen level lain hanya bila cache kedaluwarsa (hemat kuota Firestore).
const _lvKey = () => "shirose-lvakun-" + (currentUser?.uid || "x");
function _lvGet() { try { return (JSON.parse(localStorage.getItem(_lvKey()) || "{}").v) || 0; } catch (e) { return 0; } }
function _lvSet(v) { try { const o = JSON.parse(localStorage.getItem(_lvKey()) || "{}"); localStorage.setItem(_lvKey(), JSON.stringify({ v: Math.max(v || 0, o.v || 0), t: o.t || 0 })); } catch (e) {} }
async function _levelAkun(aktif) {
  let o = {}; try { o = JSON.parse(localStorage.getItem(_lvKey()) || "{}"); } catch (e) {}
  if (o.t && Date.now() - o.t < 24 * 3600e3) return o.v || 0;
  const uid = currentUser.uid, lvls = WALLET_LVLS.filter(l => l !== aktif);
  const snaps = await Promise.all(lvls.map(l => getDoc(doc(db, "siswa", uid, "gami", l)).catch(() => null)));
  let mx = 0; snaps.forEach(sn => { if (sn && sn.exists()) mx = Math.max(mx, sn.data().level_karakter || 1); });
  mx = Math.max(mx, o.v || 0);
  try { localStorage.setItem(_lvKey(), JSON.stringify({ v: mx, t: Date.now() })); } catch (e) {}
  return mx;
}
/* XP & koin TIDAK langsung ditulis ke Firestore. Masuk antrean, tampilan dihitung di perangkat,
 * lalu dikirim sekali oleh simpanSekarang() (akhir kuis/sesi, keluar aplikasi, atau sebelum belanja). */
export async function tambahXP(level, dXP, dKoin = 0) {
  if (!currentUser) return;
  try {
    const q = _q(); const g = q.gami[level] || (q.gami[level] = { xp: 0 });
    g.xp = (Number(g.xp) || 0) + (Number(dXP) || 0);
    q.koin = (Number(q.koin) || 0) + (Number(dKoin) || 0); _qSet(q);
    _jadwalSimpan();
    if (!_gamiServer[level]) await getGami(level);   // sekali per level per sesi
    const base = _gamiServer[level] || { xp:0, koin:_koinFallback(0), streak:0, level_karakter:1 };
    const cur = { ...base, koin: _koinFallback(base.koin) + _koinAntrean() };
    _terapkanAntreanXP(level, cur);
    if (!cur.level_level_ini) { cur.level_level_ini = cur.level_karakter || 1; cur.level_karakter = Math.max(cur.level_karakter || 1, _lvGet()); }
    return cur;
  } catch (e) { console.warn("tambahXP failed:", e.message); return null; }
}
function _hitungStreak(cur) {
  const today = new Date().toISOString().slice(0,10);
  if (cur.lastDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
    cur.streak = cur.lastDate === yesterday ? (cur.streak || 0) + 1 : 1;
    cur.lastDate = today;
  }
}
/* Tambahkan XP antrean ke objek gami (untuk tampilan). */
function _terapkanAntreanXP(level, cur) {
  const px = Number((_qGet().gami || {})[level]?.xp) || 0;
  if (!px) return cur;
  cur.xp = (cur.xp || 0) + px;
  cur.level_karakter = Math.floor(Math.sqrt(cur.xp / 50)) + 1;
  _hitungStreak(cur);
  cur.level_level_ini = cur.level_karakter; cur.level_karakter = Math.max(cur.level_karakter, _lvGet()); _lvSet(cur.level_karakter);
  return cur;
}

/* ========== ANTREAN SIMPAN (hemat kuota Firestore) ==========
 * Dulu: tiap jawaban benar / kartu hafalan langsung menulis XP, koin, log koin, leaderboard,
 * misi harian, aktivitas & SRS (±3-4 tulis per klik). Sekarang semuanya dikumpulkan di perangkat
 * (memori + localStorage) dan dikirim SEKALI lewat simpanSekarang():
 *   - saat kuis / sesi / ujian selesai (dipanggil dari halaman),
 *   - saat siswa keluar / pindah aplikasi / menutup tab (tab tersembunyi),
 *   - cadangan tiap 10 menit bila masih ada antrean, dan sebelum belanja koin / klaim misi / logout.
 * Antrean ada di localStorage → kalau tab mati mendadak, sisanya dikirim saat aplikasi dibuka lagi. */
const _gamiServer = {};   // level -> data gami terakhir dari server (tanpa antrean)
/* Cache di perangkat (6 jam) untuk data yang praktis hanya diubah perangkat ini sendiri. */
const LOKAL_TTL = 6 * 3600e3;
function _lcGet(k, ttl = LOKAL_TTL) { try { const c = JSON.parse(localStorage.getItem(k) || "null"); return c && (!ttl || Date.now() - c.t < ttl) ? c.d : null; } catch (e) { return null; } }
function _lcSet(k, d) { try { localStorage.setItem(k, JSON.stringify({ t: Date.now(), d })); } catch (e) {} }
const _gamiKey = (lv) => `shirose-gami:${currentUser?.uid || "x"}:${lv}`;
const _misiKey = (tgl) => `shirose-misi:${currentUser?.uid || "x"}:${tgl}`;
const _actKey = (ym) => `shirose-act:${currentUser?.uid || "x"}:${ym}`;
function _baseSegar() { try { const v = JSON.parse(localStorage.getItem("shirose-walletbase:" + (currentUser && currentUser.uid)) || "null"); return !!(v && typeof v.koin === "number" && Date.now() - (v.t || 0) < LOKAL_TTL); } catch (e) { return false; } }
const _qKey = () => "shirose-antrean:" + (currentUser?.uid || "x");
function _qGet() { try { return JSON.parse(localStorage.getItem(_qKey()) || "null") || {}; } catch (e) { return {}; } }
function _qSet(q) { try { localStorage.setItem(_qKey(), JSON.stringify(q)); } catch (e) {} }
function _q() { const q = _qGet(); q.gami = q.gami || {}; q.act = q.act || {}; q.misi = q.misi || {}; return q; }
function _koinAntrean() { return Number(_qGet().koin) || 0; }
let _simpanT = 0;
function _jadwalSimpan() { if (!_simpanT) _simpanT = setTimeout(() => { _simpanT = 0; simpanSekarang(); }, 10 * 60e3); }
let _rantai = Promise.resolve();
export function simpanSekarang() {
  clearTimeout(_simpanT); _simpanT = 0;
  _rantai = _rantai.then(_kirimAntrean).catch(e => console.warn("simpan antrean gagal:", e && e.message));
  return _rantai;
}
async function _kirimAntrean() {
  if (!currentUser) return;
  const uid = currentUser.uid, awal = _q();
  // 1) Koin: satu transaksi dompet untuk semua hadiah yang terkumpul
  if (awal.koin) {
    const d = Number(awal.koin) || 0; { const q = _q(); q.koin = (Number(q.koin) || 0) - d; _qSet(q); }
    let k = null; try { k = await tambahKoin(d, "hadiah belajar"); } catch (e) {}
    if (k === null) { const q = _q(); q.koin = (Number(q.koin) || 0) + d; _qSet(q); }
  }
  // 2) XP per level: 1 baca + 1 tulis per level (bukan per jawaban)
  const lbXp = {}; let lbLv = 1;
  for (const [lv, p] of Object.entries(awal.gami)) {
    const px = Number(p && p.xp) || 0; if (!px) continue;
    const ref = doc(db, "siswa", uid, "gami", lv);
    let cur = _lcGet(_gamiKey(lv));   // data server terakhir yang diketahui → tanpa baca
    if (!cur) { const snap = await getDoc(ref); cur = snap.exists() ? snap.data() : { xp:0, koin:0, streak:0, level_karakter:1 }; }
    cur = { ...cur, xp: (cur.xp || 0) + px };
    cur.level_karakter = Math.floor(Math.sqrt(cur.xp / 50)) + 1;
    _hitungStreak(cur);
    await setDoc(ref, { xp: increment(px), level_karakter: cur.level_karakter, streak: cur.streak, lastDate: cur.lastDate }, { merge: true });
    _lcSet(_gamiKey(lv), cur);
    { const q = _q(); const g = q.gami[lv]; if (g) { g.xp = (Number(g.xp) || 0) - px; if (g.xp <= 0) delete q.gami[lv]; } _qSet(q); }
    if (_gamiServer[lv]) Object.assign(_gamiServer[lv], { xp: cur.xp, streak: cur.streak, lastDate: cur.lastDate, level_level_ini: cur.level_karakter });
    lbXp[lv] = cur.xp; lbLv = Math.max(lbLv, cur.level_karakter);
  }
  // 3) Catatan aktivitas: increment (tulis saja, tanpa baca)
  //    Satu dokumen per BULAN (activity/m-YYYYMM) → kalender sebulan = 1 baca.
  for (const [ymd, m] of Object.entries(awal.act)) {
    const hari = {}; let ada = false;
    for (const [t, n] of Object.entries(m || {})) if (n) { hari[t] = increment(n); ada = true; }
    if (ada) {
      await setDoc(doc(db, "siswa", uid, "activity", "m-" + ymd.slice(0, 6)), { hari: { [ymd]: hari }, lastTs: serverTimestamp() }, { merge: true });
      const c = _lcGet(_actKey(ymd.slice(0, 6)), 0);
      if (c) { const r = c[ymd] = { kanji:0, kosakata:0, latihan:0, ujian:0, sesi:0, ...(c[ymd] || {}) }; for (const [t, n] of Object.entries(m || {})) r[t] = (Number(r[t]) || 0) + (Number(n) || 0); _lcSet(_actKey(ymd.slice(0, 6)), c); }
    }
    { const q = _q(); const a = q.act[ymd] || {}; for (const [t, n] of Object.entries(m || {})) { a[t] = (Number(a[t]) || 0) - n; if (a[t] <= 0) delete a[t]; } if (Object.keys(a).length) q.act[ymd] = a; else delete q.act[ymd]; _qSet(q); }
  }
  // 4) Misi harian: 1 baca + 1 tulis per hari
  for (const [tgl, m] of Object.entries(awal.misi)) {
    const ref = doc(db, "siswa", uid, "misi_harian", tgl);
    let data = _lcGet(_misiKey(tgl));
    if (!data) { const snap = await getDoc(ref); data = snap.exists() ? snap.data() : null; }
    if (data) {
      let ubah = false;
      for (const [id, n] of Object.entries(m || {})) {
        const x = (data.misi || []).find(z => z.id === id);
        if (x && !(data.claimed || []).includes(id)) { x.progres = Math.min((x.progres || 0) + n, x.target); ubah = true; }
      }
      if (ubah) { await setDoc(ref, data); _lcSet(_misiKey(tgl), data); }
    }
    { const q = _q(); const a = q.misi[tgl] || {}; for (const [id, n] of Object.entries(m || {})) { a[id] = (Number(a[id]) || 0) - n; if (a[id] <= 0) delete a[id]; } if (Object.keys(a).length) q.misi[tgl] = a; else delete q.misi[tgl]; _qSet(q); }
  }
  // 5) SRS yang belum terkirim (termasuk sisa sesi lalu di localStorage)
  try { const pre = `shirose-srs-pend:${uid}:`; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(pre)) { const lv = k.slice(pre.length); if (!_srsPend[lv]) _srsPend[lv] = { n: 1, kartu: null }; } } } catch (e) {}
  for (const lv of Object.keys(_srsPend)) await _srsTulis(lv);
  // 6) Leaderboard: maksimal sekali sehari
  if (Object.keys(lbXp).length) await _lbPush(lbXp, lbLv);
}
if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => simpanSekarang());
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") simpanSekarang(); });
}

/* ========== SRS (hafalan) ========== */
/* Progres hafalan dikirim tiap 100 kartu (atau saat simpanSekarang), bukan tiap kartu.
 * Salinan terbaru disimpan di localStorage supaya tidak hilang kalau tab tertutup. */
const _srsPend = {};   // level -> { n: jumlah perubahan belum terkirim, kartu }
const _srsLsKey = (lv) => `shirose-srs-pend:${currentUser?.uid || "x"}:${lv}`;
export async function saveSRS(level, kartu, { segera = false } = {}) {
  if (!currentUser) return;
  const p = _srsPend[level] || (_srsPend[level] = { n: 0, kartu: null });
  p.kartu = kartu; p.n++;
  try { localStorage.setItem(_srsLsKey(level), JSON.stringify(kartu)); } catch (e) {}
  _jadwalSimpan();
  if (segera || p.n >= 100) await _srsTulis(level);
}
async function _srsTulis(level) {
  const p = _srsPend[level]; if (!p || !p.n || !currentUser) return;
  let kartu = p.kartu;
  if (!kartu) { try { kartu = JSON.parse(localStorage.getItem(_srsLsKey(level)) || "null"); } catch (e) {} }
  if (!kartu) { delete _srsPend[level]; return; }
  const n = p.n; p.n = 0;
  try {
    await setDoc(doc(db, "siswa", currentUser.uid, "srs", level), { kartu, updated: serverTimestamp() }, { merge: true });
    if (!p.n) { try { localStorage.removeItem(_srsLsKey(level)); } catch (e) {} }
  } catch (e) { p.n += n; console.warn("saveSRS failed:", e.message); }
}
export async function loadSRS(level) {
  if (!currentUser) return {};
  if (_srsPend[level] && _srsPend[level].kartu) return _srsPend[level].kartu;   // perubahan terbaru belum terkirim
  try { const lokal = JSON.parse(localStorage.getItem(_srsLsKey(level)) || "null"); if (lokal) { _srsPend[level] = { n: 1, kartu: lokal }; return lokal; } } catch (e) {}
  try {
    const snap = await getDoc(doc(db, "siswa", currentUser.uid, "srs", level));
    return snap.exists() ? (snap.data().kartu || {}) : {};
  } catch (e) { console.warn("loadSRS failed:", e.message); return {}; }
}

/* ========== NILAI (riwayat ujian) ========== */
export async function catatNilai(nilai) {
  if (!currentUser) return;
  const ref = collection(db, "siswa", currentUser.uid, "nilai");
  return await addDoc(ref, { ...nilai, tgl: serverTimestamp() });
}

/* ========== HASIL UJIAN JLPT CENTER ==========
 * Disimpan di siswa/{uid}/jlpt_hasil/{autoId} — sub-koleksi milik siswa,
 * sudah tercakup Firestore Rules yang ada (pemilik + guru boleh baca,
 * siswa lain TIDAK bisa). Tidak perlu mengubah rules.
 */
export async function simpanHasilJLPT(hasil) {
  if (!currentUser) throw new Error("Belum login");
  const ref = collection(db, "siswa", currentUser.uid, "jlpt_hasil");
  const d = await addDoc(ref, { ...hasil, uid: currentUser.uid, tgl: serverTimestamp() });
  return d.id;
}
export async function listHasilJLPT(limitN = 100) {
  if (!currentUser) return [];
  try { return await _hasilSaya("jlpt_hasil", limitN); } catch (e) { console.warn("cache hasil:", e.message); }
  const q = query(collection(db, "siswa", currentUser.uid, "jlpt_hasil"), orderBy("tgl", "desc"), limit(limitN));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function listHasilJLPTOf(uid, limitN = 100) {
  if (!userIsGuru() && uid !== currentUser?.uid) throw new Error("Tidak diizinkan");
  if (_guruLihatOrangLain(uid)) return _hasilGuru(uid, "jlpt_hasil", limitN);
  const q = query(collection(db, "siswa", uid, "jlpt_hasil"), orderBy("tgl", "desc"), limit(limitN));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
/* ========== HASIL UJIAN JFT-Basic ==========
 * siswa/{uid}/jft_hasil/{t} — salinan hasil Latihan Bab / Simulasi / Tryout supaya guru bisa melihat
 * nilainya (sebelumnya hanya tersimpan di HP siswa). Tercakup rules wildcard /siswa/{sid}/{sub}/{docId}.
 * ID dokumen = waktu selesai → aman dikirim ulang (tidak dobel). Soal/jawaban (review) TIDAK ikut disimpan. */
export async function simpanHasilJft(rec) {
  if (!currentUser || currentUser.isAnonymous || !rec || !rec.t) return;
  const { review, ...r } = rec;
  await setDoc(doc(db, "siswa", currentUser.uid, "jft_hasil", String(rec.t)), { ...r, uid: currentUser.uid, tgl: serverTimestamp() });
}
export async function listHasilJftOf(uid, limitN = 300) {
  if (!userIsGuru() && uid !== currentUser?.uid) throw new Error("Tidak diizinkan");
  if (_guruLihatOrangLain(uid)) return _hasilGuru(uid, "jft_hasil", limitN);
  if (uid === currentUser?.uid) { try { return await _hasilSaya("jft_hasil", limitN); } catch (e) {} }
  const q = query(collection(db, "siswa", uid, "jft_hasil"), orderBy("tgl", "desc"), limit(limitN));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function getHasilJLPT(uid, id) {
  if (!userIsGuru() && uid !== currentUser?.uid) throw new Error("Tidak diizinkan");
  const s = await getDoc(doc(db, "siswa", uid, "jlpt_hasil", id));
  return s.exists() ? { id: s.id, ...s.data() } : null;
}

/* ========== PROGRES KANA & LATIHAN MENULIS ==========
 * Disimpan di siswa/{uid}/kana_progres/data — sub-koleksi milik siswa, sudah
 * tercakup Firestore Rules yang ada (pemilik + guru boleh baca/tulis, siswa
 * lain TIDAK bisa). Tidak perlu mengubah rules.
 * Isi: { v, u, hira{}, kata{}, kanji{n5..n1{}}, flash[], tes[] }  (lihat js/kana-center.js)
 */
export async function loadKanaProgres(uidOverride = null) {
  const id = uidOverride || currentUser?.uid;
  if (!id) return null;
  if (uidOverride && uidOverride !== currentUser?.uid && !userIsGuru()) throw new Error("Tidak diizinkan");
  const snap = await getDoc(doc(db, "siswa", id, "kana_progres", "data"));
  return snap.exists() ? snap.data() : null;
}
export async function saveKanaProgres(data) {
  if (!currentUser) return;
  await setDoc(doc(db, "siswa", currentUser.uid, "kana_progres", "data"),
    { ...data, uid: currentUser.uid, updated: serverTimestamp() });
}

/* ========== SILABUS HARIAN ==========
 * siswa/{uid}/silabus/{lv}  progres silabus harian (lv = n5..n1 | jft), lihat js/silabus-harian.js.
 * Sub-koleksi milik siswa — tercakup rules {sub}/{docId} yang sudah ada.
 */
export async function loadSilabusProgres(lv, uidOverride = null) {
  const id = uidOverride || currentUser?.uid;
  if (!id) return null;
  if (uidOverride && uidOverride !== currentUser?.uid && !userIsGuru()) throw new Error("Tidak diizinkan");
  const snap = await getDoc(doc(db, "siswa", id, "silabus", lv));
  return snap.exists() ? snap.data() : null;
}
export async function saveSilabusProgres(lv, data) {
  if (!currentUser) return;
  await setDoc(doc(db, "siswa", currentUser.uid, "silabus", lv),
    { ...data, uid: currentUser.uid, updated: serverTimestamp() });
}

/* ========== SSW 特定技能 ==========
 * ssw_bidang/{slug}            konfigurasi bidang (guru menulis, siswa terdaftar membaca):
 *                              { nama, jp, aktif, urut, tema, gambar, hasContent, bab:{babId:"draft|published|hidden"} }
 * siswa/{uid}/ssw_progres/{slug} progres siswa — sub-koleksi milik siswa, sudah tercakup rules {sub}/{docId}.
 * Menonaktifkan bidang TIDAK menghapus progres (dokumen progres tidak disentuh).
 */
export async function loadSswBidang() {
  const snap = await getDocs(collection(db, "ssw_bidang"));
  return snap.docs.map(d => ({ slug: d.id, ...d.data() }));
}
export async function saveSswBidang(slug, data) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  const clean = { ...data }; delete clean.slug;
  await setDoc(doc(db, "ssw_bidang", slug), { ...clean, updated: serverTimestamp(), updatedBy: currentUser.uid }, { merge: true });
}
export async function deleteSswBidang(slug) {
  if (!userIsAdmin() && !userIsDeveloper()) throw new Error("Hanya admin");
  await deleteDoc(doc(db, "ssw_bidang", slug));
}
export async function loadSswProgres(slug, uidOverride = null) {
  const id = uidOverride || currentUser?.uid;
  if (!id) return null;
  if (uidOverride && uidOverride !== currentUser?.uid && !userIsGuru()) throw new Error("Tidak diizinkan");
  const snap = await getDoc(doc(db, "siswa", id, "ssw_progres", slug));
  return snap.exists() ? snap.data() : null;
}
export async function saveSswProgres(slug, data) {
  if (!currentUser) return;
  await setDoc(doc(db, "siswa", currentUser.uid, "ssw_progres", slug),
    { ...data, uid: currentUser.uid, updated: serverTimestamp() });
}

/* ========== MENSETSU 面接 — hasil simulasi wawancara ==========
 * Disimpan di siswa/{uid}/mensetsu_hasil/{autoId} — sub-koleksi milik siswa, sudah
 * tercakup Firestore Rules yang ada (pemilik + guru boleh baca; siswa lain TIDAK).
 * Hanya TRANSKRIP TEKS + nilai. Rekaman suara tidak pernah disimpan.
 */
export async function getIdToken() {
  return currentUser ? await currentUser.getIdToken() : null;
}
export async function simpanHasilMensetsu(hasil) {
  if (!currentUser) throw new Error("Belum login");
  const { id, ...rest } = hasil || {};
  const clean = JSON.parse(JSON.stringify(rest));   // buang undefined (Firestore menolak)
  const d = await addDoc(collection(db, "siswa", currentUser.uid, "mensetsu_hasil"), { ...clean, uid: currentUser.uid, tgl: serverTimestamp() });
  // Hadiah koin simulasi (dompet tunggal): +20, maks 3x per hari per perangkat.
  try { const k = "shirose-mx-koin:" + currentUser.uid + ":" + new Date().toISOString().slice(0, 10), n = +(localStorage.getItem(k) || 0);
    if (n < 3) { localStorage.setItem(k, String(n + 1)); const sd = await tambahKoin(20, "mensetsu"); if (sd !== null && window.__koinBaru) window.__koinBaru(sd, 20); if (window.awardXP) window.awardXP(150, 0); } } catch (e) {}
  return d.id;
}
export async function listHasilMensetsu(limitN = 50) {
  if (!currentUser) return [];
  try { return await _hasilSaya("mensetsu_hasil", limitN); } catch (e) { console.warn("cache hasil:", e.message); }
  const q = query(collection(db, "siswa", currentUser.uid, "mensetsu_hasil"), orderBy("tgl", "desc"), limit(limitN));
  return (await getDocs(q)).docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function listHasilMensetsuOf(uid, limitN = 100) {
  if (!userIsGuru() && uid !== currentUser?.uid) throw new Error("Tidak diizinkan");
  if (_guruLihatOrangLain(uid)) return _hasilGuru(uid, "mensetsu_hasil", limitN);
  const q = query(collection(db, "siswa", uid, "mensetsu_hasil"), orderBy("tgl", "desc"), limit(limitN));
  return (await getDocs(q)).docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function hapusHasilMensetsu(id) {
  if (!currentUser) throw new Error("Belum login");
  await deleteDoc(doc(db, "siswa", currentUser.uid, "mensetsu_hasil", id));
}
export async function hapusSemuaHasilMensetsu() {
  if (!currentUser) throw new Error("Belum login");
  const docs = (await getDocs(collection(db, "siswa", currentUser.uid, "mensetsu_hasil"))).docs;
  _kvHapusAwalan(`hasil:mensetsu_hasil:${currentUser.uid}`);
  for (let i = 0; i < docs.length; i += 400) {
    const b = writeBatch(db); docs.slice(i, i + 400).forEach(d => b.delete(d.ref)); await b.commit();
  }
  return docs.length;
}

/* ========== MENSETSU 面接 — persiapan jawaban + koreksi AI ==========
 * siswa/{uid}/mensetsu_persiapan/{bidang} → { sel:[id], order:[id], answers:{[id]:{asli,koreksi,diterima,ev,riwayat[],status,updated}}, updated }
 * Milik siswa (pemilik + guru boleh baca) — tercakup Rules sub-koleksi siswa yang ada.
 */
export async function getPersiapanMensetsu(bidang) {
  if (!currentUser) return null;
  const s = await getDoc(doc(db, "siswa", currentUser.uid, "mensetsu_persiapan", bidang));
  return s.exists() ? s.data() : null;
}
export async function setPersiapanMensetsu(bidang, data) {
  if (!currentUser) throw new Error("Belum login");
  const clean = JSON.parse(JSON.stringify(data || {}));
  await setDoc(doc(db, "siswa", currentUser.uid, "mensetsu_persiapan", bidang), { ...clean, uid: currentUser.uid, bidang, tgl: serverTimestamp() });
}
export async function listPersiapanMensetsuOf(uid) {
  if (!userIsGuru() && uid !== currentUser?.uid) throw new Error("Tidak diizinkan");
  return (await getDocs(collection(db, "siswa", uid, "mensetsu_persiapan"))).docs.map(d => ({ id: d.id, ...d.data() }));
}

/* ========== ACTIVITY CALENDAR (Part 12) ========== */
// Each activity bumps a date-bucket document. Date is YYYYMMDD in Asia/Bangkok
// so streaks line up with the user's local day. Activity types:
//   kanji | kosakata | latihan | ujian | sesi
function _ymdLocal(d = new Date()){
  // Use the browser's local timezone (which is what the user experiences)
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}${m}${day}`;
}
export async function recordActivity(type, count = 1){
  if (!currentUser) return;
  const allowed = new Set(["kanji","kosakata","latihan","ujian","sesi"]);
  if (!allowed.has(type)) return;
  // Masuk antrean; dikirim sekali (increment, tanpa baca) oleh simpanSekarang().
  const ymd = _ymdLocal(), q = _q(), a = q.act[ymd] || (q.act[ymd] = {});
  a[type] = (Number(a[type]) || 0) + (Number(count) || 1); _qSet(q); _jadwalSimpan();
}
export async function listActivity(ym /* YYYYMM */){
  if (!currentUser) return {};
  try {
    // Bulan lalu: cache permanen. Bulan ini: cache 24 jam (+ diperbarui tiap simpan). Server: 1 dokumen per bulan.
    const bulanIni = _ymdLocal().slice(0, 6);
    let result = _lcGet(_actKey(ym), ym < bulanIni ? 0 : 24 * 3600e3);
    if (!result) {
      const mref = doc(db, "siswa", currentUser.uid, "activity", "m-" + ym);
      const ms = await getDoc(mref);
      const md = ms.exists() ? ms.data() : null;
      result = {};
      if (!md || !md.lengkap) {
        // Sekali per bulan: gabungkan dokumen harian lama ke dokumen bulanan.
        const col = collection(db, "siswa", currentUser.uid, "activity");
        const snap = await getDocs(query(col, where(documentId(), ">=", ym), where(documentId(), "<", ym + "\uf8ff")));
        snap.forEach(d => { if (/^\d{8}$/.test(d.id) && d.id.startsWith(ym)) { const { lastTs, ...x } = d.data(); result[d.id] = x; } });
      }
      for (const [ymd, x] of Object.entries((md && md.hari) || {})) { const r = result[ymd] = { ...(result[ymd] || {}) }; for (const [t, n] of Object.entries(x || {})) r[t] = (Number(r[t]) || 0) + (Number(n) || 0); }
      if (!md || !md.lengkap) { try { await setDoc(mref, { hari: result, lengkap: true, lastTs: serverTimestamp() }); } catch (e) {} }
      _lcSet(_actKey(ym), result);
    }
    result = JSON.parse(JSON.stringify(result));
    // Aktivitas yang masih di antrean ikut ditampilkan
    for (const [ymd, m] of Object.entries(_q().act)) if (ymd.startsWith(ym)) {
      const r = result[ymd] = { kanji:0, kosakata:0, latihan:0, ujian:0, sesi:0, ...(result[ymd] || {}) };
      for (const [t, n] of Object.entries(m || {})) r[t] = (Number(r[t]) || 0) + (Number(n) || 0);
    }
    return result;
  } catch (e) { console.warn("listActivity failed:", e.message); return {}; }
}

/* ========== KOMENTAR (public per-item discussion) ========== */
// Composite key per detail page (kanji/kosakata/bunpou + level + number).
function _cmtKey(tipe, lvl, no){ return `${tipe}_${lvl}_${no}`; }
const _cmtCache = new Map();   // key -> {t, list}  (cache 1 jam per halaman)
export async function listKomentar(tipe, lvl, no) {
  try {
    const key = _cmtKey(tipe, lvl, no);
    const lk = "shirose-cmt:" + key;
    let c = _cmtCache.get(key); if (!c) { try { c = JSON.parse(localStorage.getItem(lk) || "null"); } catch (e) {} }
    if (c && Date.now() - c.t < 3600e3) return c.list.map(x => _tsFix({ ...x }));
    const list = await _listKomentarServer(key);
    const ent = { t: Date.now(), list }; _cmtCache.set(key, ent); try { localStorage.setItem(lk, JSON.stringify(ent)); } catch (e) {}
    return list;
  } catch (e) { console.warn("listKomentar failed:", e.message); return []; }
}
function _cmtBuang(key) { _cmtCache.delete(key); try { localStorage.removeItem("shirose-cmt:" + key); } catch (e) {} }
async function _listKomentarServer(key) {
  try {
    const col = collection(db, "komentar", key, "items");
    const q = query(col, orderBy("created", "desc"), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map(d => { const x = d.data(); return { id: d.id, ...x, nama: _cleanNama(x.nama) }; });
  } catch (e) { throw e; }
}
export async function tambahKomentar(tipe, lvl, no, text) {
  if (!currentUser) throw new Error("Harus login dulu");
  const clean = (text || "").toString().trim().slice(0, 1000);
  if (!clean) throw new Error("Teks komentar kosong");
  const key = _cmtKey(tipe, lvl, no);
  const nama = publicNama(currentUser, currentSiswaDoc);
  const kelas = currentSiswaDoc?.kelas || "";
  const col = collection(db, "komentar", key, "items");
  _cmtBuang(key);
  return await addDoc(col, {
    uid: currentUser.uid, nama, kelas, text: clean,
    jlpt: lvl, tipe, no, created: serverTimestamp(),
  });
}
export async function hapusKomentar(tipe, lvl, no, id, ownerUid) {
  if (!currentUser) return;
  if (ownerUid && ownerUid !== currentUser.uid && !isGuru(currentUser)) {
    throw new Error("Bukan komentarmu");
  }
  const key = _cmtKey(tipe, lvl, no);
  _cmtBuang(key);
  await deleteDoc(doc(db, "komentar", key, "items", id));
}

/* ========== RANGKUMAN SENDIRI (personal word collection) ==========
 * Hybrid storage: tries Firestore first, falls back to localStorage so
 * the feature works even when Firestore rules haven't been deployed yet.
 * The two layers are merged on read (Firestore takes precedence per id).
 * When rules are applied later, the next call that succeeds will
 * silently upload the localStorage entries to Firestore.
 * ======================================================== */
function _lsRangKey(uid){ return `shirose-rangkuman-${uid||"guest"}`; }
function _lsRangGet(uid){
  try { return JSON.parse(localStorage.getItem(_lsRangKey(uid)) || "{}"); }
  catch { return {}; }
}
function _lsRangSet(uid, map){
  try { localStorage.setItem(_lsRangKey(uid), JSON.stringify(map)); } catch {}
}
function _safeRangId(jp){
  return jp.replace(/[\.#\$\[\]\/]/g, "_").slice(0, 120);
}

/* Rangkuman dipisah per bidang: "jlpt" | "ssw" | "jft". Data lama tanpa bidang ditebak dari 'sumber'. */
export function bidangRangkuman(v){
  if (v && (v.bidang === "ssw" || v.bidang === "jft" || v.bidang === "jlpt")) return v.bidang;
  const s = String((v && v.sumber) || "");
  if (/ssw/i.test(s)) return "ssw";
  if (/jft|·\s*IR\d/i.test(s)) return "jft";
  return "jlpt";
}

export async function tambahRangkuman({ jp, kana, arti, sumber = null, kategori = null, bidang = "jlpt" }) {
  if (!currentUser) throw new Error("Harus login dulu");
  if (!jp) throw new Error("Kata kosong");
  if (bidang !== "ssw" && bidang !== "jft") bidang = "jlpt";
  const uid = currentUser.uid;
  const id = (bidang === "jlpt" ? "" : bidang + "__") + _safeRangId(jp);
  const now = Date.now();
  const payload = {
    jp, kana: kana || "", arti: arti || "",
    sumber: sumber || "", kategori: kategori || "", bidang,
    updatedMs: now,
  };

  // 1) Always write to localStorage first — that way even offline / blocked
  //    sessions never lose a word.
  const local = _lsRangGet(uid);
  local[id] = { ...payload, _local: true };
  _lsRangSet(uid, local);

  // 2) Try Firestore. On success, remove the _local flag so sync is complete.
  try {
    const ref = doc(db, "siswa", uid, "rangkuman", id);
    await setDoc(ref, { ...payload, updated: serverTimestamp() }, { merge: true });
    delete local[id]._local;
    _lsRangSet(uid, local);
    return { id, synced: true };
  } catch (e) {
    // Firestore write blocked (rules not deployed, offline, etc.) — entry
    // stays in localStorage, feature keeps working.
    console.warn("Rangkuman: Firestore write blocked, saved locally:", e.message);
    return { id, synced: false };
  }
}

export async function listRangkuman(bidang) {
  if (!currentUser) return [];
  const uid = currentUser.uid;
  // Local first — always available.
  const local = _lsRangGet(uid);
  const merged = new Map();
  Object.entries(local).forEach(([id, v]) => merged.set(id, { id, ...v }));

  // Sinkron server hemat kuota: ambil yang BERUBAH saja maks. sekali sehari (biasanya 1 baca),
  // ambil semua seminggu sekali (supaya kata yang dihapus di HP lain ikut hilang).
  // Perangkat ini menyimpan salinan lengkap di localStorage.
  const sk = "shirose-rang-sync:" + uid; let sy = {}; try { sy = JSON.parse(localStorage.getItem(sk) || "{}"); } catch (e) {}
  const penuh = !sy.full || Date.now() - sy.full > 7 * 86400e3;
  if (!penuh && sy.cek && Date.now() - sy.cek < 86400e3) {
    let out = Array.from(merged.values()).map(v => ({ ...v, bidang: bidangRangkuman(v) }));
    if (bidang) out = out.filter(v => v.bidang === bidang);
    return out.sort((a,b) => (b.updatedMs||0) - (a.updatedMs||0));
  }
  try {
    const col = collection(db, "siswa", uid, "rangkuman");
    const snap = await getDocs(penuh ? col : query(col, where("updated", ">", Timestamp.fromMillis(sy.max || 0))));
    if (penuh) { for (const [id, v] of [...merged]) if (!v._local) merged.delete(id); }
    let max = sy.max || 0;
    snap.docs.forEach(d => { const x = d.data(); const { updated, ...rest } = x; const ms = _msTs(updated); if (ms > max) max = ms; merged.set(d.id, { id: d.id, ...rest, updatedMs: rest.updatedMs || ms }); });
    for (const [id, v] of merged) { const { id: _i, ...rest } = v; local[id] = rest; }
    for (const id of Object.keys(local)) if (!merged.has(id)) delete local[id];
    try { localStorage.setItem(sk, JSON.stringify({ cek: Date.now(), full: penuh ? Date.now() : sy.full, max })); } catch (e) {}

    // Opportunistic re-upload: if any local entry is marked _local,
    // retry its upload now that Firestore seems reachable.
    for (const [id, v] of Object.entries(local)){
      if (v._local){
        try {
          await setDoc(doc(db, "siswa", uid, "rangkuman", id),
            { jp:v.jp, kana:v.kana||"", arti:v.arti||"", sumber:v.sumber||"", kategori:v.kategori||"", bidang:bidangRangkuman(v), updated: serverTimestamp() },
            { merge: true });
          delete local[id]._local;
        } catch {}
      }
    }
    _lsRangSet(uid, local);
  } catch (e) {
    console.warn("listRangkuman: Firestore read failed, using local only:", e.message);
  }

  // Sort newest first by updatedMs if present, otherwise stable.
  let out = Array.from(merged.values()).map(v => ({ ...v, bidang: bidangRangkuman(v) }));
  if (bidang) out = out.filter(v => v.bidang === bidang);
  return out.sort((a,b) => (b.updatedMs||0) - (a.updatedMs||0));
}

export function idRangkuman(jp, bidang = "jlpt"){ return (bidang === "jlpt" ? "" : bidang + "__") + _safeRangId(jp); }

export async function hapusRangkuman(id) {
  if (!currentUser) return;
  const uid = currentUser.uid;
  // Local delete always.
  const local = _lsRangGet(uid);
  delete local[id];
  _lsRangSet(uid, local);
  // Firestore delete best-effort.
  try { await deleteDoc(doc(db, "siswa", uid, "rangkuman", id)); }
  catch (e) { console.warn("hapusRangkuman: Firestore delete failed:", e.message); }
}

/**
 * Update a few safe fields in siswa.permissions (currently only
 * audio_autoplay; never let clients write unlimited_coins here).
 */
export async function updateSiswaPermissions(partial) {
  if (!currentUser) return;
  const allowed = {};
  if (typeof partial.audio_autoplay === "boolean") allowed["permissions.audio_autoplay"] = partial.audio_autoplay;
  if (!Object.keys(allowed).length) return;
  await updateDoc(doc(db, "siswa", currentUser.uid), allowed);
}

/**
 * Part 5 — reward 10.000 coin ONCE when a student passes an exam.
 * Returns { firstTime: boolean, rewardKoin: number } so caller can toast.
 * Idempotent: a second call for the same kategoriId with any score returns
 * { firstTime: false, rewardKoin: 0 }.
 */
export async function claimUjianLulusReward(kategoriId, skor, lulusMin) {
  if (!currentUser || !kategoriId) return { firstTime:false, rewardKoin:0 };
  if (skor < (lulusMin || 60)) return { firstTime:false, rewardKoin:0 };
  const ref = doc(db, "siswa", currentUser.uid, "ujian_rewards", kategoriId);
  const snap = await getDoc(ref);
  if (snap.exists()) return { firstTime:false, rewardKoin:0 };
  await setDoc(ref, { skor, tgl: serverTimestamp() });
  // Part 5 revised reward: 2.500 coin per ujian lulus (sekali).
  // Semula 10k, user minta diturunin supaya legendary tetap susah dibeli.
  return { firstTime:true, rewardKoin: 2500 };
}

/**
 * Part 5 — reward 1 coin when a SRS card reaches "mastered" (interval >= 21d)
 * for the first time. Called from hafalan after SRS updates.
 * The caller passes the card object (already updated) and we mutate
 * card.mastered_at + card.mastered = true on first mastery.
 * Returns true when a coin should be awarded.
 */
export function detectNewMastery(card) {
  const MASTERY_INTERVAL = 21;
  if (!card || card.mastered) return false;
  if ((card.interval || 0) < MASTERY_INTERVAL) return false;
  if (card.last === "salah") return false;
  card.mastered = true;
  card.mastered_at = Date.now();
  return true;
}
export async function listNilai(limitN = 50) {
  if (!currentUser) return [];
  try { return await _hasilSaya("nilai", limitN); } catch (e) { console.warn("cache hasil:", e.message); }
  const q = query(collection(db, "siswa", currentUser.uid, "nilai"),
                  orderBy("tgl","desc"), limit(limitN));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id:d.id, ...d.data() }));
}

/* ========== KATEGORI UJIAN (guru CRUD) ========== */
/* Daftar kategori ujian: siswa membaca SATU dokumen kategori_index/all (cache 6 jam di perangkat).
 * Guru tetap membaca koleksi asli, dan setiap guru mengubah kategori/soal → indeks & paket soal dibangun ulang. */
const KAT_TTL = 6 * 3600e3;
let _katMem = null;
async function _kategoriIndex() {
  if (_katMem && Date.now() - _katMem.t < KAT_TTL) return _katMem.items;
  const key = "shirose-katidx:" + (currentUser?.uid || "x");
  try { const c = JSON.parse(localStorage.getItem(key) || "null"); if (c && Date.now() - c.t < KAT_TTL) { _katMem = c; return c.items; } } catch (e) {}
  const snap = await getDoc(doc(db, "kategori_index", "all"));
  if (!snap.exists()) return null;
  const items = snap.data().items || [];
  _katMem = { t: Date.now(), items };
  try { localStorage.setItem(key, JSON.stringify(_katMem)); } catch (e) {}
  return items;
}
async function _kategoriKoleksi() { const snap = await getDocs(collection(db, "kategori_ujian")); return snap.docs.map(d => ({ id:d.id, ...d.data() })); }
export async function listKategori(level = null) {
  let arr = null;
  if (!userIsGuru()) { try { arr = await _kategoriIndex(); } catch (e) { console.warn("kategori_index:", e.message); } }
  if (!arr) arr = await _kategoriKoleksi();
  arr = arr.map(k => _tsFix({ ...k }));
  if (level) arr = arr.filter(k => k.level === level);
  return arr;
}
/** Guru: bangun ulang indeks kategori (1 dokumen) — dipanggil otomatis setelah kategori/soal berubah. */
export async function bangunKategoriIndex() {
  if (!userIsGuru()) return;
  const items = await _kategoriKoleksi();
  const paket = {};
  await Promise.all(items.map(async k => { try { const p = await getDoc(doc(db, "soal_paket", k.id)); if (p.exists()) paket[k.id] = Number(p.data().v) || 0; } catch (e) {} }));
  await setDoc(doc(db, "kategori_index", "all"), { items: items.map(k => ({ ...k, paketV: paket[k.id] || 0 })), upd: serverTimestamp() });
}
/** Guru: gabungkan semua soal satu kategori jadi SATU dokumen soal_paket/{id} (siswa cukup 1 baca). */
export async function bangunPaketSoal(kategoriId, { indeks = true } = {}) {
  if (!userIsGuru()) return;
  const snap = await getDocs(collection(db, "soal", kategoriId, "items"));
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  const v = Date.now(), data = { items, v, upd: serverTimestamp() };
  if (JSON.stringify(data).length > 900000) { console.warn("[hemat] soal kategori", kategoriId, "terlalu besar untuk 1 dokumen; siswa pakai cara lama"); try { await deleteDoc(doc(db, "soal_paket", kategoriId)); } catch (e) {} }
  else await setDoc(doc(db, "soal_paket", kategoriId), data);
  if (indeks) await bangunKategoriIndex();
}
export async function simpanKategori(data, id = null) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  const col = collection(db, "kategori_ujian");
  if (id) {
    await setDoc(doc(col, id), { ...data, updated: serverTimestamp() }, { merge: true });
    bangunKategoriIndex().catch(e => console.warn("indeks kategori:", e.message));
    return id;
  } else {
    const ref = await addDoc(col, { ...data, created: serverTimestamp() });
    bangunKategoriIndex().catch(e => console.warn("indeks kategori:", e.message));
    return ref.id;
  }
}
export async function hapusKategori(id) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await deleteDoc(doc(db, "kategori_ujian", id));
  try { await deleteDoc(doc(db, "soal_paket", id)); } catch (e) {}
  bangunKategoriIndex().catch(e => console.warn("indeks kategori:", e.message));
}

/* ========== KELAS KATA KOSAKATA (override guru) ==========
   kosakata_pos/{lvl} = { map: { "<kata>": ["KK"|"KB"|"KSい"|"KSな", ...] | ["-"] } }
   Data JSON asli tidak diubah; override dipasang di memori saat Materi/Hafalan dimuat. */
export async function getPosOverride(lvl) {
  const k = "shirose-kpos:" + lvl;
  if (!userIsGuru()) { const c = _lcGet(k); if (c) return c; }
  const snap = await getDoc(doc(db, "kosakata_pos", lvl));
  const m = snap.exists() ? (snap.data().map || {}) : {};
  _lcSet(k, m);
  return m;
}
export async function setPosOverride(lvl, kata, tags) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await setDoc(doc(db, "kosakata_pos", lvl), { map: { [kata]: (tags && tags.length) ? tags : ["-"] }, updated: serverTimestamp() }, { merge: true });
}
export async function resetPosOverride(lvl, kata) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await updateDoc(doc(db, "kosakata_pos", lvl), new FieldPath("map", kata), deleteField());
}

/* ========== SOAL (per kategori / paket soal) ========== */
// Urutan soal harus dipertahankan sesuai input Excel — Firestore tidak
// menjamin urutan dari getDocs, jadi kita simpan field `urutan` di tiap
// soal dan sort di client.
async function _soalPaket(kategoriId) {
  // Versi paket dari indeks kategori → cache soal di perangkat dipakai selama versinya sama.
  const idx = await _kategoriIndex(); if (!idx) return null;
  const k = idx.find(x => x.id === kategoriId); if (!k || !k.paketV) return null;
  const key = `soal:${currentUser?.uid || "x"}:${kategoriId}`, c = await _kvGet(key);
  if (c && c.v === k.paketV) return c.items;
  const p = await getDoc(doc(db, "soal_paket", kategoriId)); if (!p.exists()) return null;
  const d = p.data(); await _kvSet(key, { v: d.v, items: d.items || [] });
  return d.items || [];
}
export async function listSoal(kategoriId) {
  let arr = null;
  if (!userIsGuru()) { try { arr = await _soalPaket(kategoriId); if (arr) arr = arr.map(x => _tsFix({ ...x })); } catch (e) { console.warn("soal_paket:", e.message); } }
  if (!arr) { const snap = await getDocs(collection(db, "soal", kategoriId, "items")); arr = snap.docs.map(d => ({ id:d.id, ...d.data() })); }
  arr.sort((a, b) => {
    const au = typeof a.urutan === "number" ? a.urutan : Infinity;
    const bu = typeof b.urutan === "number" ? b.urutan : Infinity;
    if (au !== bu) return au - bu;
    // Fallback stable: timestamp created lalu id
    const at = a.created?.toMillis ? a.created.toMillis() : 0;
    const bt = b.created?.toMillis ? b.created.toMillis() : 0;
    if (at !== bt) return at - bt;
    return (a.id || "").localeCompare(b.id || "");
  });
  return arr;
}
// Hitung berapa soal yang sudah ada — buat tahu nomor urut berikutnya saat
// tambah manual. Tidak error kalau kategori belum ada.
async function _nextUrutan(kategoriId){
  try {
    const existing = await listSoal(kategoriId);
    const maxU = existing.reduce((m, s) => Math.max(m, typeof s.urutan === "number" ? s.urutan : 0), 0);
    return maxU + 1;
  } catch(e) { return 1; }
}
export async function tambahSoalBatch(kategoriId, soalArr) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  // Jika caller tidak kasih `urutan`, kita lanjutkan dari max yang sudah ada.
  const needAssign = soalArr.some(s => typeof s.urutan !== "number");
  let base = 0;
  if (needAssign) base = await _nextUrutan(kategoriId);
  const withUrutan = soalArr.map((s, i) => ({
    ...s,
    urutan: typeof s.urutan === "number" ? s.urutan : (base + i),
  }));
  const batches = [];
  for (let i = 0; i < withUrutan.length; i += 400) {
    batches.push(withUrutan.slice(i, i + 400));
  }
  let total = 0;
  for (const batch of batches) {
    const b = writeBatch(db);
    batch.forEach(s => {
      const r = doc(collection(db, "soal", kategoriId, "items"));
      b.set(r, { ...s, created: serverTimestamp() });
    });
    await b.commit();
    total += batch.length;
  }
  _paketNanti(kategoriId);
  return total;
}
/* Guru sering mengedit beberapa soal berturut-turut → paket dibangun ulang 5 detik setelah edit terakhir. */
const _paketT = {};
function _paketNanti(kategoriId) { clearTimeout(_paketT[kategoriId]); _paketT[kategoriId] = setTimeout(() => bangunPaketSoal(kategoriId).catch(e => console.warn("paket soal:", e.message)), 5000); }
export async function hapusSoal(kategoriId, soalId) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await deleteDoc(doc(db, "soal", kategoriId, "items", soalId));
  _paketNanti(kategoriId);
}
export async function editSoal(kategoriId, soalId, data) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await updateDoc(doc(db, "soal", kategoriId, "items", soalId), data);
  _paketNanti(kategoriId);
}

/* ========== ITEM SHOP (seedable) ========== */
export async function listShopItems(kategori = null) {
  if (kategori) {
    const col = collection(db, "item_shop", kategori, "items");
    const snap = await getDocs(col);
    return snap.docs.map(d => ({ id:d.id, kategori, ...d.data() }));
  }
  // All categories
  const result = [];
  for (const k of ["rambut","pakaian","sepatu","aksesori","item_tangan","aura"]) {
    try {
      const col = collection(db, "item_shop", k, "items");
      const snap = await getDocs(col);
      snap.docs.forEach(d => result.push({ id:d.id, kategori:k, ...d.data() }));
    } catch(e) { /* empty */ }
  }
  return result;
}

/* ========== CHOUKAI ========== */
export async function listChoukai(level) {
  const col = collection(db, "choukai", level, "items");
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id:d.id, ...d.data() }));
}
export async function tambahChoukaiBatch(level, soalArr) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  let total = 0;
  for (let i = 0; i < soalArr.length; i += 400) {
    const b = writeBatch(db);
    soalArr.slice(i, i + 400).forEach(s => {
      const r = doc(collection(db, "choukai", level, "items"));
      b.set(r, { ...s, created: serverTimestamp() });
      total++;
    });
    await b.commit();
  }
  return total;
}

/* ========== SISWA (guru dashboard) ========== */
export async function listSiswa() {
  if (!userIsGuru()) throw new Error("Hanya guru");
  try {
    if (_memSiswa && _segarSiswa(_memSiswa)) return _memSiswa.items.map(x => _tsFix({ ...x }));
    const c = await _kvGet("siswa-list");
    if (_segarSiswa(c)) { _memSiswa = c; return c.items.map(x => _tsFix({ ...x })); }
    const snap = await getDocs(collection(db, "siswa"));
    const items = snap.docs.map(d => ({ uid:d.id, ...d.data() }));
    _memSiswa = { items, cek: Date.now() }; _kvSet("siswa-list", _memSiswa);
    return items;
  } catch (e){
    // Firestore most likely rejected the collection read because the guru's
    // siswa doc still has role != "guru" (bootstrap not applied). Give a
    // clearer message so the user knows the Firebase Console step to take.
    if (e && (e.code === "permission-denied" || /permission/i.test(e.message || ""))){
      throw new Error("Firestore menolak baca daftar siswa. Update Firestore Rules dari firestore.rules.example (Firebase Console → Firestore → Rules → Publish), lalu refresh halaman.");
    }
    throw e;
  }
}

/**
 * Diagnosa cepat untuk guru: cek permission tulis/baca di titik-titik penting
 * tanpa benar-benar memodifikasi data. Dipakai tombol "Diagnosa Firestore Rules"
 * di teacher dashboard — guru bisa lihat mana rule yang block dan tahu harus
 * publish ulang firestore.rules.example.
 * Return: array { op, path, ok, error }
 */
export async function diagnosaRules(){
  const results = [];
  const check = async (op, path, fn) => {
    try { await fn(); results.push({ op, path, ok:true }); }
    catch(e){ results.push({ op, path, ok:false, error: e.code || e.message }); }
  };
  if (!currentUser){ return [{ op:"auth", ok:false, error:"Belum login" }]; }
  const uid = currentUser.uid;
  // Baca siswa doc sendiri
  await check("read", `/siswa/${uid}`, () => getDoc(doc(db, "siswa", uid)));
  // Baca koleksi siswa (guru only)
  await check("list", `/siswa (all)`, () => getDocs(collection(db, "siswa")));
  // Baca subkoleksi activity sendiri
  await check("read", `/siswa/${uid}/activity`, () => getDocs(collection(db, "siswa", uid, "activity")));
  // Baca kategori_ujian
  await check("read", `/kategori_ujian`, () => getDocs(collection(db, "kategori_ujian")));
  // Coba tulis timestamp ke siswa doc sendiri (non-destruktif, hanya update aktif)
  await check("write", `/siswa/${uid}.aktif`, () => updateDoc(doc(db, "siswa", uid), { aktif: serverTimestamp() }));
  return results;
}
const LEVELS = ["n5","n4","n3","n2","n1"];
function _normAkses(a){ const r = {}; LEVELS.forEach(l => r[l] = !!(a && a[l])); return r; }
function _profilBaru(uid, email, nama, kelas, aksesLevel, role){
  return {
    nama: (nama || "").trim() || email.split("@")[0],
    email, isTamu: false, kelas: kelas || "",
    ...(isDemoKelas(kelas) ? { demoSejak: Date.now() } : {}),
    aksesLevel: _normAkses(aksesLevel || { n5:true }),
    role: role || "student",
    status: "aktif",
    dibuatOleh: currentUser?.uid || null,
    karakter: {
      equipped: { rambut:null, pakaian:"seragam_default", sepatu:"shoes_default", aksesori:"none", item_tangan:"none", aura:"none" },
      inventory: ["seragam_default", "shoes_default", "none"],
      skinTone: "light", hairColor: "#2a1810",
    },
    created: serverTimestamp(),
  };
}
/**
 * Guru/moderator membuat akun baru (Firebase Auth + profil Firestore).
 * Pakai instance Firebase App KEDUA dengan persistence in-memory supaya
 * sesi login guru di tab ini tidak tergantikan oleh akun yang baru dibuat.
 * role "guru" hanya boleh dibuat oleh admin/moderator.
 */
export async function buatAkunSiswa({ email, password, nama, kelas, aksesLevel, role = "student" }) {
  if (!userIsGuru()) throw new Error("Hanya guru/moderator");
  if (role !== "student" && !userIsAdmin()) throw new Error("Hanya moderator yang bisa membuat akun guru");
  if (!["student","guru"].includes(role)) throw new Error("Role tidak valid");
  email = (email || "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Email tidak valid");
  if (!password || password.length < 6) throw new Error("Password minimal 6 karakter");
  const sec = initializeApp(firebaseConfig, "akun-creator-" + Date.now());
  _pasangAppCheck(sec);
  const secAuth = getAuth(sec);
  try {
    await setPersistence(secAuth, inMemoryPersistence);
    const cred = await createUserWithEmailAndPassword(secAuth, email, password);
    const uid = cred.user.uid;
    try {
      await setDoc(doc(db, "siswa", uid), _profilBaru(uid, email, nama, kelas, aksesLevel, role));
    } catch (e) {
      // Rollback supaya tidak ada akun Auth yatim tanpa profil.
      try { await cred.user.delete(); } catch(_){}
      throw new Error("Akun dibatalkan — gagal menyimpan profil: " + (e.code || e.message));
    }
    return uid;
  } catch (e) {
    if (e.code === "auth/email-already-in-use") throw new Error("Email sudah terdaftar di sistem login.");
    if (e.code === "auth/weak-password") throw new Error("Password terlalu lemah (min. 6 karakter).");
    throw e;
  } finally {
    try { await signOut(secAuth); } catch(_){}
    try { await deleteApp(sec); } catch(_){}
  }
}
/** Daftarkan akun Auth yang SUDAH ada (punya UID) tapi belum punya profil. */
export async function daftarkanAkunExisting({ uid, email, nama, kelas, aksesLevel }) {
  if (!userIsGuru()) throw new Error("Hanya guru/moderator");
  const ref = doc(db, "siswa", uid);
  if ((await getDoc(ref)).exists()) throw new Error("Profil sudah ada");
  await setDoc(ref, _profilBaru(uid, (email||"").trim().toLowerCase(), nama, kelas, aksesLevel, "student"));
  return uid;
}
/**
 * Guru/moderator menghapus akun siswa: semua data belajarnya (sub-koleksi) lalu
 * profil siswa/{uid}. Catatan: record login di Firebase Authentication TIDAK ikut
 * terhapus (itu butuh Admin SDK / Firebase Console). Tanpa profil, akun itu tidak
 * bisa membaca data apa pun (status "belum terdaftar" di Rules).
 */
const _SUB_SISWA = ["activity","gami","jlpt_hasil","kana_progres","mensetsu_hasil","mensetsu_persiapan","misi_harian","nilai","rangkuman","srs","ujian_rewards"];
export async function hapusSiswa(uid) {
  if (!userIsGuru()) throw new Error("Hanya guru/moderator");
  if (!uid) throw new Error("UID kosong");
  if (currentUser && uid === currentUser.uid) throw new Error("Tidak bisa menghapus akun sendiri");
  const ref = doc(db, "siswa", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return 0;
  const data = snap.data() || {};
  const role = data.role || "student";
  if (role === "developer" || _isOwnerEmail(data.email)) throw new Error("Akun moderator tidak bisa dihapus");
  if (role !== "student" && !userIsAdmin()) throw new Error("Hanya moderator yang bisa menghapus akun guru");
  let n = 0;
  for (const sub of _SUB_SISWA) {
    const docs = (await getDocs(collection(db, "siswa", uid, sub))).docs;
    for (let i = 0; i < docs.length; i += 400) {
      const b = writeBatch(db);
      docs.slice(i, i + 400).forEach(d => b.delete(d.ref));
      await b.commit();
      n += Math.min(400, docs.length - i);
    }
  }
  await deleteDoc(ref);
  return n + 1;
}
/** Aktifkan / nonaktifkan akun (akun nonaktif tidak bisa login & ditolak Rules). */
export async function setStatusSiswa(uid, aktif) {
  if (!userIsGuru()) throw new Error("Hanya guru/moderator");
  await updateDoc(doc(db, "siswa", uid), { status: aktif ? "aktif" : "nonaktif" });
}
export async function updateAksesSiswa(uid, aksesLevel) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await updateDoc(doc(db, "siswa", uid), { aksesLevel: _normAkses(aksesLevel) });
}
/* ===== Kelas DEMO: akun otomatis terhapus 7 hari setelah masuk kelas "demo" ===== */
export const DEMO_HARI = 7;
export const isDemoKelas = (k) => String(k || "").trim().toLowerCase() === "demo";
/** Sisa waktu (ms) sebelum akun demo dihapus; null jika belum dimulai / bukan demo. */
export const demoSisaMs = (s) => { if (!s || !isDemoKelas(s.kelas)) return null; const t = Number(s.demoSejak); return t ? t + DEMO_HARI * 86400000 - Date.now() : null; };
const _kelasPayload = (kelas) => isDemoKelas(kelas) ? { kelas, demoSejak: Date.now() } : { kelas: kelas || "", demoSejak: deleteField() };
export async function updateKelasSiswa(uid, kelas) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await updateDoc(doc(db, "siswa", uid), _kelasPayload(kelas));
}
/** Guru: mulai/ulang hitung mundur demo untuk satu akun (7 hari dari sekarang). */
export async function mulaiDemo(uid) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  const t = Date.now(); await updateDoc(doc(db, "siswa", uid), { demoSejak: t }); return t;
}
/** Dipanggil dashboard guru: beri tanggal mulai pada akun demo yang belum punya, hapus yang sudah lewat 7 hari. */
export async function sapuDemoKadaluarsa(list) {
  if (!userIsGuru()) return { dihapus: [], dimulai: 0 };
  const dihapus = []; let dimulai = 0;
  for (const s of list || []) {
    if (!isDemoKelas(s.kelas) || (s.role || "student") !== "student") continue;
    if (!Number(s.demoSejak)) { try { s.demoSejak = await mulaiDemo(s.uid); dimulai++; } catch (_) {} continue; }
    if (demoSisaMs(s) <= 0) { try { await hapusSiswa(s.uid); dihapus.push(s.uid); } catch (e) { console.warn("sapuDemo gagal", s.uid, e && e.message); } }
  }
  return { dihapus, dimulai };
}
// Bulk-assign: put each uid into the given kelas (or "" to unassign).
export async function assignSiswaKeKelas(uids, namaKelas) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  if (!Array.isArray(uids) || uids.length === 0) return 0;
  const b = writeBatch(db);
  uids.forEach(uid => b.update(doc(db, "siswa", uid), _kelasPayload(namaKelas || "")));
  await b.commit();
  return uids.length;
}
export async function getSiswaGami(uid) {
  if (!userIsGuru() && uid !== currentUser?.uid) throw new Error("Tidak diizinkan");
  const lain = _guruLihatOrangLain(uid), key = "gami:" + uid;
  if (lain) { const c = await _kvGet(key); if (_segar(c)) return c.data; }
  const result = {};
  const lvls = ["n5","n4","n3","n2","n1"];
  const snaps = await Promise.all(lvls.map(l => getDoc(doc(db, "siswa", uid, "gami", l))));
  lvls.forEach((l, i) => { result[l] = snaps[i].exists() ? snaps[i].data() : null; });
  if (lain) _kvSet(key, { data: result, cek: Date.now() });
  return result;
}
// Teacher view: all exam records for a specific student (newest first).
export async function listNilaiOf(uid, limitN = 100) {
  if (!userIsGuru() && uid !== currentUser?.uid) throw new Error("Tidak diizinkan");
  if (_guruLihatOrangLain(uid)) return _hasilGuru(uid, "nilai", limitN);
  const q = query(collection(db, "siswa", uid, "nilai"), orderBy("tgl","desc"), limit(limitN));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
// Teacher view: count SRS mastery per level. Returns { n5:{mastered,total}, ... }
// Teacher view: kartu SRS mentah per level ({ n5:{key:{mastered,...}}, ... }) —
// dipakai untuk menghitung progres sylabus dengan rumus yang sama seperti
// halaman Sylabus siswa.
export async function getSiswaSrsAll(uid) {
  if (!userIsGuru() && uid !== currentUser?.uid) throw new Error("Tidak diizinkan");
  if (_guruLihatOrangLain(uid)) { const c = await _kvGet("srs:" + uid); if (_segar(c)) return c.data; const d = await _srsAllServer(uid); _kvSet("srs:" + uid, { data: d, cek: Date.now() }); return d; }
  return _srsAllServer(uid);
}
async function _srsAllServer(uid) {
  const result = {};
  await Promise.all(["n5","n4","n3","n2","n1"].map(async lvl => {
    try {
      const snap = await getDoc(doc(db, "siswa", uid, "srs", lvl));
      result[lvl] = snap.exists() ? (snap.data().kartu || {}) : {};
    } catch(_) { result[lvl] = {}; }
  }));
  return result;
}
export async function getSiswaMasteryCounts(uid) {
  if (!userIsGuru() && uid !== currentUser?.uid) throw new Error("Tidak diizinkan");
  const result = {};
  for (const lvl of ["n5","n4","n3","n2","n1"]) {
    const snap = await getDoc(doc(db, "siswa", uid, "srs", lvl));
    const kartu = snap.exists() ? (snap.data().kartu || {}) : {};
    const total = Object.keys(kartu).length;
    const mastered = Object.values(kartu).filter(c => c?.mastered).length;
    result[lvl] = { mastered, total };
  }
  return result;
}

/* ========== KOTAK SARAN ========== */
// Siswa/pengunjung yang login boleh MENULIS (create saja). Hanya guru yang boleh membaca/menghapus.
// 1 saran = 1 dokumen kecil (1 write). Guru membaca saat membuka tab Saran (maks. 200 dokumen).
export async function kirimSaran({ pesan, nama = "", kontak = "", kelas = "" }) {
  if (!currentUser) throw new Error("Masuk dulu untuk mengirim saran");
  const p = String(pesan || "").trim().slice(0, 600);
  if (p.length < 3) throw new Error("Saran terlalu pendek");
  await addDoc(collection(db, "saran"), {
    pesan: p, nama: String(nama || "").trim().slice(0, 60), kontak: String(kontak || "").trim().slice(0, 80),
    kelas: String(kelas || "").trim().slice(0, 60), uid: currentUser.uid, tgl: serverTimestamp(),
  });
}
export async function listSaran(limitN = 200) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  const snap = await getDocs(query(collection(db, "saran"), orderBy("tgl", "desc"), limit(limitN)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function hapusSaran(id) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await deleteDoc(doc(db, "saran", id));
}

/* ========== KELAS ========== */
export async function listKelas() {
  const snap = await getDocs(collection(db, "kelas"));
  return snap.docs.map(d => ({ id:d.id, ...d.data() }));
}
export async function hapusKelas(id) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await deleteDoc(doc(db, "kelas", id));
}
export async function simpanKelas(data, id = null) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  if (id) {
    await setDoc(doc(db, "kelas", id), data, { merge: true });
    return id;
  } else {
    const r = await addDoc(collection(db, "kelas"), data);
    return r.id;
  }
}


/* ---- SSW: akses per siswa + leaderboard ----
 * siswa/{uid}.aksesSsw  (boolean; kosong = diizinkan)  — hanya guru yang boleh mengubah (rules).
 * ssw_rank/{slug}__{uid} { uid, slug, nama, kelas, poin, rinci{baca,kartu,kuis}, upd } — siswa menulis dokumennya sendiri. */
export async function setAksesSsw(uid, on) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await updateDoc(doc(db, "siswa", uid), { aksesSsw: !!on });
}
/* siswa/{uid}.aksesHafalan (boolean; kosong = ikut kelas) dan kelas/{id}.aksesHafalan (boolean; kosong = terbuka)
   — menu HAFALAN/Anki siswa. Hanya guru yang boleh mengubah (rules). */
export async function setAksesHafalan(uid, on) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await updateDoc(doc(db, "siswa", uid), { aksesHafalan: !!on });
}
export async function resetAksesHafalan(uid) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await updateDoc(doc(db, "siswa", uid), { aksesHafalan: deleteField() });
}
export async function setKelasAksesHafalan(kelasId, on) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await updateDoc(doc(db, "kelas", kelasId), { aksesHafalan: !!on });
}
/* siswa/{uid}.aksesJft (boolean; kosong = diizinkan) — hanya guru yang boleh mengubah (rules). */
export async function setAksesJft(uid, on) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await updateDoc(doc(db, "siswa", uid), { aksesJft: !!on });
}
/* siswa/{uid}.aksesJftLevel {ir0,ir1,ir2: boolean}; false = level itu ditutup. */
export async function setAksesJftLevel(uid, map) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  const o = {}; ["ir0","ir1","ir2"].forEach(l => { if (typeof map?.[l] === "boolean") o[l] = map[l]; });
  await updateDoc(doc(db, "siswa", uid), { aksesJftLevel: o });
}
/* Akses SSW per bidang. v: true = boleh, false = blokir, null = hapus (ikut kelas / bawaan).
 * siswa/{uid}.aksesSswBidang.{slug}  dan  kelas/{id}.aksesSswBidang.{slug} */
export async function setAksesSswBidang(uid, slug, v) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await updateDoc(doc(db, "siswa", uid), new FieldPath("aksesSswBidang", slug), v === null ? deleteField() : !!v);
}
export async function setAksesSswKelas(kelasId, slug, v) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await updateDoc(doc(db, "kelas", kelasId), new FieldPath("aksesSswBidang", slug), v === null ? deleteField() : !!v);
}
export async function saveSswRank(slug, data) {
  if (!currentUser) return;
  const d = { uid: currentUser.uid, slug, nama: String(data.nama || "Siswa").slice(0, 60), kelas: String(data.kelas || "").slice(0, 40),
    poin: Math.max(0, Math.min(1000000, Math.round(data.poin || 0))), rinci: data.rinci || {}, upd: serverTimestamp() };
  await setDoc(doc(db, "ssw_rank", `${slug}__${currentUser.uid}`), d);
  await _aggTulis(["ssw_rank_agg", slug], currentUser.uid, { n: d.nama, k: d.kelas, p: d.poin, r: d.rinci });
}
export async function loadSswRank(slug, { paksa = false } = {}) {
  // Utama: 1 dokumen gabungan per bidang (cache 6 jam). Cadangan: baca semua baris (cara lama).
  try {
    const rows = await _aggBaca(["ssw_rank_agg", slug], paksa);
    if (rows && Object.keys(rows).length) return Object.entries(rows).map(([uid, r]) => ({ uid, slug, nama: r.n || "Siswa", kelas: r.k || "", poin: Number(r.p) || 0, rinci: r.r || {} }));
  } catch (e) { console.warn("ssw rank gabungan gagal, pakai cara lama:", e.message); }
  const snap = await getDocs(query(collection(db, "ssw_rank"), where("slug", "==", slug)));
  return snap.docs.map(x => x.data());
}
export async function resetSswRank(slug) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  const snap = await getDocs(query(collection(db, "ssw_rank"), where("slug", "==", slug)));
  const rows = snap.docs.map(x => x.data());
  for (const r of rows) await deleteDoc(doc(db, "ssw_rank", `${slug}__${r.uid}`));
  try { await deleteDoc(doc(db, "ssw_rank_agg", slug)); } catch (e) {}
  try { localStorage.removeItem("shirose-agg:ssw_rank_agg/" + slug); } catch (e) {}
  return rows.length;
}

/* ========== LEADERBOARD ========== */
// PERINGATAN SKALA: dua fungsi di bawah membaca SELURUH koleksi siswa + sub-koleksi
// tiap siswa (ribuan baca per pemanggilan). Jangan dihubungkan ke UI siswa sebelum
// dibuat ulang memakai satu koleksi ringkasan (mis. leaderboard/{level}) + limit(20).
export async function leaderboard(level, topN = 20) {
  // Per-level leaderboard (original behaviour, backward compatible)
  try {
    const snap = await getDocs(collection(db, "siswa"));
    const result = [];
    for (const d of snap.docs) {
      try {
        const g = await getDoc(doc(db, "siswa", d.id, "gami", level));
        if (g.exists()) {
          const sdata = d.data();
          result.push({
            uid: d.id,
            nama: _isOwnerEmail(sdata.email) ? BRAND_NAME : (sdata.nama || "Anonim"),
            kelas: sdata.kelas || "",
            avatar: sdata.karakter?.equipped || null,
            ...g.data()
          });
        }
      } catch(e) {}
    }
    result.sort((a,b) => (b.xp || 0) - (a.xp || 0));
    return result.slice(0, topN);
  } catch (e) { console.warn("leaderboard failed:", e.message); return []; }
}

/**
 * Part 15 — Global leaderboard variants:
 *   kind = "jlpt-{level}" (default) — per-JLPT XP
 *   kind = "global"                 — sum XP across all 5 JLPTs
 *   kind = "weekly" / "monthly"     — ranked by activity count in window
 */
/* ---- Leaderboard ringkas: lb/{uid} = { uid, nama, kelas, xp:{n5..n1}, total, lv, upd } ----
 * Hanya level & poin. Ditulis siswa sendiri tiap dapat XP; dibaca dengan limit(20) / satu kelas. */
const _lbCache = new Map();           // key -> {t, data}
const LB_TTL = 60000;                 // 1 menit
const LVLS = ["n5","n4","n3","n2","n1"];
let _lbMine = null;                   // cache dokumen lb milik sendiri
export function clearLeaderboardCache(){ _lbCache.clear(); }

function _lbNama(){ return _isOwnerEmail(currentUser?.email) ? BRAND_NAME : (currentSiswaDoc?.nama || "Anonim"); }
function _lbBuild(xp, lv){
  const total = LVLS.reduce((t,l) => t + (xp[l]||0), 0);
  return { uid: currentUser.uid, nama: _lbNama(), kelas: currentSiswaDoc?.kelas || "",
           xp, total, lv: lv || 1, upd: Date.now() };
}
/* Leaderboard diperbarui MAKSIMAL SEKALI SEHARI per siswa. XP yang masuk setelah itu
 * disimpan di perangkat dan ikut terkirim pada pembaruan hari berikutnya. */
const _lbHariKey = () => "shirose-lb-hari:" + (currentUser?.uid || "x");
function _lbHariGet(){ try { return JSON.parse(localStorage.getItem(_lbHariKey()) || "{}") || {}; } catch(e){ return {}; } }
function _lbHariSet(o){ try { localStorage.setItem(_lbHariKey(), JSON.stringify(o)); } catch(e){} }
async function _lbPush(xpMap, lvVal){
  try {
    if (!currentUser || isDemoKelas(currentSiswaDoc?.kelas)) return;   // akun demo tidak masuk leaderboard
    const o = _lbHariGet();
    o.xp = { ...(o.xp || {}), ...(xpMap || {}) }; o.lv = Math.max(o.lv || 1, lvVal || 1);
    if (o.hari === _ymdLocal()) { _lbHariSet(o); return; }   // sudah update hari ini
    if (!_lbMine){ const g = await getDoc(doc(db, "lb", currentUser.uid)); _lbMine = g.exists() ? g.data() : { xp:{}, lv:1 }; }
    const xp = { ...(_lbMine.xp||{}), ...o.xp };
    const d = _lbBuild(xp, Math.max(_lbMine.lv||1, o.lv));
    await setDoc(doc(db, "lb", currentUser.uid), d);
    await _aggTulis(["lb_agg", "global"], currentUser.uid, _lbRow(d));
    _lbMine = d; _lbCache.clear();
    _lbHariSet({ hari: _ymdLocal() });
  } catch(e){ console.warn("lb push failed:", e.message); }
}
/* ---- Karakter publik untuk leaderboard: lbk/{uid} = { uid, nama, eq, sk, hc, b, bt, upd } ----
 * Koleksi terpisah dari lb/{uid} supaya aturan lb lama tidak terganggu. Kalau aturan lbk belum dipasang,
 * tulis/baca gagal diam-diam (profil tampil tanpa karakter). Hanya dandanan karakter — tidak ada data pribadi. */
let _karPub = "";
export async function publishKarakter(){
  try {
    if (!currentUser || !currentSiswaDoc || isDemoKelas(currentSiswaDoc.kelas)) return;   // akun demo tidak dipublikasikan
    const k = currentSiswaDoc.karakter || {};
    const d = JSON.parse(JSON.stringify({ uid: currentUser.uid, nama: _lbNama(), eq: k.equipped || {}, sk: k.skinTone || "light", hc: k.hairColor || null, b: k.body || "male", bt: k.bentuk || null }));
    const sig = JSON.stringify([d.nama, d.eq, d.sk, d.hc, d.b, d.bt]); if (sig === _karPub) return;
    d.upd = Date.now(); await setDoc(doc(db, "lbk", currentUser.uid), d); _karPub = sig;
  } catch (e) { console.warn("karakter publik gagal:", e && e.message); }
}
export async function getKarakterLb(uid){
  try { const g = await getDoc(doc(db, "lbk", uid)); return g.exists() ? g.data() : null; } catch (e) { return null; }
}
// Sinkron sekali (per sesi) dari data gami sendiri, supaya siswa lama langsung muncul.
let _lbSynced = false;
export async function syncMyLeaderboard(){
  publishKarakter();
  if (_lbSynced || !currentUser || isDemoKelas(currentSiswaDoc?.kelas)) return;
  _lbSynced = true;
  if (_lbHariGet().hari === _ymdLocal()) return;   // leaderboard sudah diperbarui hari ini
  try {
    const gs = await Promise.all(LVLS.map(l => getDoc(doc(db, "siswa", currentUser.uid, "gami", l)).catch(() => null)));
    const xp = {}; let lv = 1;
    gs.forEach((g, i) => { if (g && g.exists()){ const d = g.data(); xp[LVLS[i]] = d.xp || 0; lv = Math.max(lv, d.level_karakter || 1); } });
    const d = _lbBuild(xp, lv);
    if (d.total === 0) return;
    await setDoc(doc(db, "lb", currentUser.uid), d);
    await _aggTulis(["lb_agg", "global"], currentUser.uid, _lbRow(d));
    _lbMine = d; _lbCache.clear();
    _lbHariSet({ hari: _ymdLocal() });
  } catch(e){ console.warn("lb sync failed:", e.message); _lbSynced = false; }
}
// Guru/admin: isi ulang ringkasan untuk SEMUA siswa (sekali jalan, mis. dari console: FB.backfillLeaderboard()).
export async function backfillLeaderboard(){
  const snap = await getDocs(collection(db, "siswa"));
  let n = 0;
  await Promise.all(snap.docs.map(async d => {
    const sd = d.data();
    if ((sd.role || "student") !== "student") return;
    const gs = await Promise.all(LVLS.map(l => getDoc(doc(db, "siswa", d.id, "gami", l)).catch(() => null)));
    const xp = {}; let lv = 1;
    gs.forEach((g, i) => { if (g && g.exists()){ const x = g.data(); xp[LVLS[i]] = x.xp || 0; lv = Math.max(lv, x.level_karakter || 1); } });
    const total = LVLS.reduce((t,l) => t + (xp[l]||0), 0);
    if (!total) return;
    await setDoc(doc(db, "lb", d.id), { uid: d.id, nama: sd.nama || "Anonim", kelas: sd.kelas || "", xp, total, lv, upd: Date.now() });
    n++;
  }));
  _lbCache.clear();
  try { await bangunLeaderboardGabungan(); } catch (e) { console.warn("agg:", e.message); }
  return n;
}

/* ========== LEADERBOARD GABUNGAN: 1 dokumen = 1 baca ==========
 * lb_agg/global        = { rows: { uid: { n, k, t, x:{n5..n1}, lv } }, upd }
 * ssw_rank_agg/{slug}  = { rows: { uid: { n, k, p, r } }, upd }
 * Tiap siswa hanya menulis barisnya sendiri (sekali sehari). Membaca leaderboard = 1 baca,
 * lalu disimpan di perangkat 24 jam. Muat ±5.000 siswa per dokumen (batas 1 MiB). */
const AGG_TTL = 24 * 3600e3;
async function _aggTulis(path, uid, row) {
  try { await setDoc(doc(db, ...path), { rows: { [uid]: row }, upd: serverTimestamp() }, { merge: true }); } catch (e) { console.warn("agg tulis gagal:", e.message); }
}
async function _aggBaca(path, paksa) {
  const key = "shirose-agg:" + path.join("/");
  if (!paksa) { try { const c = JSON.parse(localStorage.getItem(key) || "null"); if (c && Date.now() - c.t < AGG_TTL) return c.rows; } catch (e) {} }
  const snap = await getDoc(doc(db, ...path));
  const rows = snap.exists() ? (snap.data().rows || {}) : null;
  if (rows) { try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), rows })); } catch (e) {} }
  return rows;
}
const _lbRow = (d) => ({ n: String(d.nama || "Anonim").slice(0, 40), k: String(d.kelas || "").slice(0, 30), t: Number(d.total) || 0, x: d.xp || {}, lv: Number(d.lv) || 1 });
/** Guru: isi dokumen gabungan dari data lama (lb/* dan ssw_rank/*). Sekali jalan; aman diulang. */
export async function bangunLeaderboardGabungan() {
  if (!userIsGuru()) throw new Error("Hanya guru");
  const lb = await getDocs(collection(db, "lb"));
  const rows = {}; lb.docs.forEach(d => { const x = d.data(); if (x && x.uid) rows[x.uid] = _lbRow(x); });
  await setDoc(doc(db, "lb_agg", "global"), { rows, upd: serverTimestamp() });
  const sr = await getDocs(collection(db, "ssw_rank"));
  const per = {}; sr.docs.forEach(d => { const x = d.data(); if (x && x.uid && x.slug) (per[x.slug] = per[x.slug] || {})[x.uid] = { n: x.nama || "Siswa", k: x.kelas || "", p: Number(x.poin) || 0, r: x.rinci || {} }; });
  for (const [slug, r] of Object.entries(per)) await setDoc(doc(db, "ssw_rank_agg", slug), { rows: r, upd: serverTimestamp() });
  try { localStorage.setItem("shirose-agg-dibangun", String(Date.now())); } catch (e) {}
  return { lb: Object.keys(rows).length, ssw: Object.keys(per).length };
}
/** Dipanggil dashboard guru: bangun dokumen gabungan bila belum ada (cek maks. sekali sehari). */
export async function pastikanLeaderboardGabungan() {
  if (!userIsGuru()) return;
  try { if (Date.now() - (Number(localStorage.getItem("shirose-agg-cek")) || 0) < 86400e3) return; localStorage.setItem("shirose-agg-cek", String(Date.now())); } catch (e) {}
  try { const g = await getDoc(doc(db, "lb_agg", "global")); if (!g.exists()) await bangunLeaderboardGabungan(); } catch (e) { console.warn("agg cek gagal (rules lb_agg belum dipasang?):", e.message); }
  // Paket soal ujian guru + indeks kategori (1 baca untuk siswa)
  try {
    const idx = await getDoc(doc(db, "kategori_index", "all"));
    const ada = idx.exists() ? new Set((idx.data().items || []).filter(k => k.paketV).map(k => k.id)) : new Set();
    const kat = await _kategoriKoleksi();
    for (const k of kat) if (!ada.has(k.id)) await bangunPaketSoal(k.id, { indeks: false });
    if (!idx.exists() || kat.some(k => !ada.has(k.id))) await bangunKategoriIndex();
  } catch (e) { console.warn("paket soal cek gagal (rules soal_paket/kategori_index belum dipasang?):", e.message); }
}

// kind: "global" | "jlpt-n5".."jlpt-n1". kelas (opsional) membatasi ke satu kelas.
export async function leaderboardAdvanced(kind = "global", topN = 20, kelas = "") {
  const key = kind + "|" + (kelas || "*") + "|" + topN;
  const hit = _lbCache.get(key);
  if (hit && Date.now() - hit.t < LB_TTL) return hit.data;
  // Utama: dokumen gabungan (1 baca, cache 6 jam). Cadangan: cara lama bila belum tersedia.
  try {
    const rows = await _aggBaca(["lb_agg", "global"]);
    if (rows && Object.keys(rows).length) {
      const lvl = kind.startsWith("jlpt-") ? kind.slice(5) : "";
      const me = currentUser?.uid, mine = _lbMine;
      const all = Object.entries(rows).map(([uid, r]) => ({ uid, ...r }));
      if (me && mine) { const r = all.find(x => x.uid === me); const m = { uid: me, ..._lbRow(mine) }; if (r) Object.assign(r, { t: Math.max(r.t, m.t), x: { ...r.x, ...m.x } }); }
      const result = all
        .filter(r => !kelas || r.k === kelas)
        .map(r => ({ uid: r.uid, nama: r.n || "Anonim", kelas: r.k || "", score: lvl ? (Number((r.x || {})[lvl]) || 0) : (Number(r.t) || 0), meta: "Lv " + (r.lv || 1) }))
        .filter(r => r.score > 0 && !isDemoKelas(r.kelas))
        .sort((a, b) => b.score - a.score)
        .slice(0, topN);
      _lbCache.set(key, { t: Date.now(), data: result });
      return result;
    }
  } catch (e) { console.warn("lb gabungan gagal, pakai cara lama:", e.message); }
  try {
    const field = kind.startsWith("jlpt-") ? "xp." + kind.slice(5) : "total";
    const base = collection(db, "lb");
    // Per kelas: satu kelas kecil -> urut di klien (tanpa indeks gabungan). Semua kelas: orderBy + limit.
    const snap = await getDocs(kelas ? query(base, where("kelas", "==", kelas))
                                     : query(base, orderBy(field, "desc"), limit(topN)));
    const get = d => field === "total" ? (d.total || 0) : (d.xp?.[field.slice(3)] || 0);
    const result = snap.docs.map(x => x.data())
      .map(d => ({ uid: d.uid, nama: d.nama || "Anonim", kelas: d.kelas || "", score: get(d), meta: "Lv " + (d.lv || 1) }))
      .filter(r => r.score > 0 && !isDemoKelas(r.kelas))   // siswa kelas demo disembunyikan dari ranking
      .sort((a,b) => b.score - a.score)
      .slice(0, topN);
    _lbCache.set(key, { t: Date.now(), data: result });
    return result;
  } catch (e) { console.warn("leaderboardAdvanced failed:", e.message); return []; }
}

/* ========== MISI HARIAN ========== */
export async function getMisiHariIni() {
  if (!currentUser) return null;
  const tgl = new Date().toISOString().slice(0,10);
  const ref = doc(db, "siswa", currentUser.uid, "misi_harian", tgl);
  const c = _lcGet(_misiKey(tgl));
  if (c) return _misiPlusAntrean(tgl, c);
  const snap = await getDoc(ref);
  if (snap.exists()) { _lcSet(_misiKey(tgl), snap.data()); return _misiPlusAntrean(tgl, snap.data()); }
  // Generate 3 misi baru
  const misiPool = [
    { id: "hafalan_10", nama: "Hafalkan 10 kata", target: 10, reward_xp: 30, reward_koin: 10 },
    { id: "benar_20", nama: "Jawab benar 20 soal", target: 20, reward_xp: 50, reward_koin: 20 },
    { id: "selesai_sesi", nama: "Selesaikan 1 sesi ujian", target: 1, reward_xp: 40, reward_koin: 15 },
    { id: "streak_lanjut", nama: "Jaga streak hari ini", target: 1, reward_xp: 20, reward_koin: 5 },
    { id: "kanji_5", nama: "Pelajari 5 kanji baru", target: 5, reward_xp: 25, reward_koin: 10 },
    { id: "bunpou_3", nama: "Pelajari 3 bunpou", target: 3, reward_xp: 30, reward_koin: 10 },
  ];
  const shuffled = [...misiPool].sort(() => Math.random() - 0.5);
  const misi = shuffled.slice(0, 3).map(m => ({ ...m, progres: 0 }));
  const data = { misi, claimed: [] };
  await setDoc(ref, data);
  _lcSet(_misiKey(tgl), data);
  return data;
}
/* Progres misi masuk antrean; dikirim sekali oleh simpanSekarang() (1 baca + 1 tulis per hari). */
export async function updateMisiProgres(misiId, delta = 1) {
  if (!currentUser || !delta) return;
  const tgl = new Date().toISOString().slice(0,10), q = _q(), m = q.misi[tgl] || (q.misi[tgl] = {});
  m[misiId] = (Number(m[misiId]) || 0) + (Number(delta) || 0); _qSet(q); _jadwalSimpan();
}
function _misiPlusAntrean(tgl, data) {
  const m = _q().misi[tgl]; if (!m || !data || !data.misi) return data;
  const d = JSON.parse(JSON.stringify(data));
  for (const [id, n] of Object.entries(m)) { const x = d.misi.find(z => z.id === id); if (x && !(d.claimed || []).includes(id)) x.progres = Math.min((x.progres || 0) + n, x.target); }
  return d;
}
export async function claimMisi(misiId, level = "n5") {
  if (!currentUser) return;
  await simpanSekarang();   // kirim progres misi yang masih di antrean dulu
  const tgl = new Date().toISOString().slice(0,10);
  const ref = doc(db, "siswa", currentUser.uid, "misi_harian", tgl);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data();
  const m = data.misi.find(x => x.id === misiId);
  if (!m || data.claimed.includes(misiId) || m.progres < m.target) return;
  data.claimed.push(misiId);
  await setDoc(ref, data);
  _lcSet(_misiKey(tgl), data);
  await tambahXP(level, m.reward_xp, m.reward_koin);
  return m;
}

/* ========== BANK SOAL JLPT (KHUSUS GURU) ==========
   guru_bank_jlpt/_index : { list:[{id,level,ujian,n,bagian{vocab,gram,listen}}], updated }
   guru_bank_jlpt/{id}   : { level, ujian, n, soal[] }   (id = "N3_07_2021")
   Aturan Firestore: read/write hanya isGuru(). Siswa tidak punya jalur baca. */
export async function bankJlptIndex() {
  if (!userIsGuru()) throw new Error("Hanya guru");
  const d = await getDoc(doc(db, "guru_bank_jlpt", "_index"));
  return d.exists() ? (d.data().list || []) : [];
}
export async function bankJlptGet(id) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  const d = await getDoc(doc(db, "guru_bank_jlpt", id));
  return d.exists() ? d.data() : null;
}
export async function bankJlptPut(item) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await setDoc(doc(db, "guru_bank_jlpt", item.id), { level: item.level, ujian: item.ujian, n: item.soal.length, soal: item.soal, updated: serverTimestamp() });
}
export async function bankJlptSetIndex(list) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await setDoc(doc(db, "guru_bank_jlpt", "_index"), { list, updated: serverTimestamp() });
}
export async function bankJlptDelete(id) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await deleteDoc(doc(db, "guru_bank_jlpt", id));
}

/* ========== DECK HAFALAN GURU (ala Anki) ==========
   guru_deck/_index : { list:[{id,nama,n,updated}], updated }
   guru_deck/{id}   : { nama, cards[], updated }   (cards: {k,y,a,c,ca,n,t, + SRS: iv,ez,r,l,due,last})
   Aturan Firestore: read/write hanya isGuru(). */
export async function deckIndex() {
  if (!userIsGuru()) throw new Error("Hanya guru");
  const d = await getDoc(doc(db, "guru_deck", "_index"));
  return d.exists() ? (d.data().list || []) : [];
}
export async function deckGet(id) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  const d = await getDoc(doc(db, "guru_deck", id));
  return d.exists() ? { id, ...d.data() } : null;
}
export async function deckPut(deck) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await setDoc(doc(db, "guru_deck", deck.id), { nama: deck.nama, cards: deck.cards, updated: serverTimestamp() });
}
export async function deckSetIndex(list) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await setDoc(doc(db, "guru_deck", "_index"), { list, updated: serverTimestamp() });
}
export async function deckDelete(id) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await deleteDoc(doc(db, "guru_deck", id));
}

/* ========== DECK HAFALAN: TERBIT KE KELAS ==========
   deck_kelas/_index : { list:[{id,nama,n,kelas:[nama kelas],semua,aktif}], updated }  (dibaca semua siswa terdaftar; hanya metadata)
   deck_kelas/{id}   : { nama, cards[{id,k,y,a,c,ca,n,t}], kelas[], semua, aktif, updated }  (siswa hanya boleh baca bila kelasnya dipilih / semua=true)
   siswa/{uid}/deck_progres/{id} : { m:{ [cardId]:{iv,ez,r,l,due,last} }, t }   (progres SRS siswa; subkoleksi siswa sudah boleh tulis oleh pemiliknya) */
export async function deckPubIndex() {
  const d = await getDoc(doc(db, "deck_kelas", "_index"));
  return d.exists() ? (d.data().list || []) : [];
}
export async function deckPubGet(id) {
  const d = await getDoc(doc(db, "deck_kelas", id));
  return d.exists() ? { id, ...d.data() } : null;
}
export async function deckPubPut(id, data) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await setDoc(doc(db, "deck_kelas", id), { ...data, updated: serverTimestamp() });
}
export async function deckPubSetIndex(list) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await setDoc(doc(db, "deck_kelas", "_index"), { list, updated: serverTimestamp() });
}
export async function deckPubDelete(id) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await deleteDoc(doc(db, "deck_kelas", id));
}
export async function deckProgresGet(id) {
  if (!currentUser) return {};
  const d = await getDoc(doc(db, "siswa", currentUser.uid, "deck_progres", id));
  return d.exists() ? (d.data().m || {}) : {};
}
export async function deckProgresSet(id, m) {
  if (!currentUser) throw new Error("Belum masuk");
  await setDoc(doc(db, "siswa", currentUser.uid, "deck_progres", id), { m, t: Date.now() });
}

/* ========== SOAL PELAJARAN (pilihan ganda A–D + penjelasan, buatan guru) ==========
   guru_soal/_index   : { list:[{id,nama,n,updated,pub:{aktif,semua,kelas[]}|null}] }   (guru saja)
   guru_soal/{id}     : { nama, items:[{q,o:[4],a:0-3,e}], updated }
   soal_kelas/_index  : { list:[{id,nama,n,kelas[],semua,aktif}] }                      (dibaca siswa terdaftar; metadata saja)
   soal_kelas/{id}    : { nama, items[], kelas[], semua, aktif, updated }               (siswa hanya bila kelasnya dipilih / semua)
   siswa/{uid}/soal_progres/{id} : { skor, total, t, salah:[idx] }                      (progres siswa; sub-koleksi milik siswa) */
const _guruSaja = () => { if (!userIsGuru()) throw new Error("Hanya guru"); };
export async function soalIndex() { _guruSaja(); const d = await getDoc(doc(db, "guru_soal", "_index")); return d.exists() ? (d.data().list || []) : []; }
export async function soalGet(id) { _guruSaja(); const d = await getDoc(doc(db, "guru_soal", id)); return d.exists() ? { id, ...d.data() } : null; }
export async function soalPut(set) { _guruSaja(); await setDoc(doc(db, "guru_soal", set.id), { nama: set.nama, items: set.items, updated: serverTimestamp() }); }
export async function soalSetIndex(list) { _guruSaja(); await setDoc(doc(db, "guru_soal", "_index"), { list, updated: serverTimestamp() }); }
export async function soalDelete(id) { _guruSaja(); await deleteDoc(doc(db, "guru_soal", id)); }
export async function soalPubIndex() { const d = await getDoc(doc(db, "soal_kelas", "_index")); return d.exists() ? (d.data().list || []) : []; }
export async function soalPubGet(id) { const d = await getDoc(doc(db, "soal_kelas", id)); return d.exists() ? { id, ...d.data() } : null; }
export async function soalPubPut(id, data) { _guruSaja(); await setDoc(doc(db, "soal_kelas", id), { ...data, updated: serverTimestamp() }); }
export async function soalPubSetIndex(list) { _guruSaja(); await setDoc(doc(db, "soal_kelas", "_index"), { list, updated: serverTimestamp() }); }
export async function soalPubDelete(id) { _guruSaja(); await deleteDoc(doc(db, "soal_kelas", id)); }
export async function soalProgresAll() {
  if (!currentUser) return {};
  try { const g = await getDocs(collection(db, "siswa", currentUser.uid, "soal_progres")); const o = {}; g.docs.forEach(x => o[x.id] = x.data()); return o; } catch (e) { return {}; }
}
export async function soalProgresSet(id, data) {
  if (!currentUser) throw new Error("Belum masuk");
  await setDoc(doc(db, "siswa", currentUser.uid, "soal_progres", id), { ...data, t: Date.now() });
}

export { db, auth };

/* ========== SAVE DATA (tombol 💾 Simpan) ==========
 * Snapshot di siswa/{uid}/save/main (sub-koleksi milik siswa): XP & level tiap level JLPT/JFT, item, pakaian, tema/background, font.
 * Pulihkan hanya MENAIKKAN (XP = yang terbesar, item = gabungan) — tidak pernah menurunkan data yang ada. */
export async function saveSaveData(ui = {}) {
  if (!currentUser) throw new Error("Masuk dulu");
  const uid = currentUser.uid, gami = {};
  const snaps = await Promise.all(WALLET_LVLS.map(l => getDoc(doc(db, "siswa", uid, "gami", l)).catch(() => null)));
  let mx = 1;
  snaps.forEach((s, i) => { if (s && s.exists()) { const d = s.data(); const lv = d.level_karakter || 1; mx = Math.max(mx, lv); gami[WALLET_LVLS[i]] = { xp: d.xp || 0, level_karakter: lv, streak: d.streak || 0 }; } });
  const sd = currentSiswaDoc || {}, k = sd.karakter || {};
  const data = { savedAt: Date.now(), ts: serverTimestamp(), levelAkun: mx, gami,
    karakter: { equipped: k.equipped || {}, inventory: k.inventory || [], skinTone: k.skinTone || null, hairColor: k.hairColor || null, body: k.body || null, bentuk: k.bentuk || null }, ui };
  await setDoc(doc(db, "siswa", uid, "save", "main"), data);
  _lvSet(mx);
  return { ...data, ts: null };
}
export async function getSaveData() {
  if (!currentUser) return null;
  const s = await getDoc(doc(db, "siswa", currentUser.uid, "save", "main"));
  if (!s.exists()) return null;
  const d = s.data(); d.ts = null; return d;
}
export async function restoreSaveData(d) {
  if (!currentUser) throw new Error("Masuk dulu");
  if (!d || typeof d !== "object") throw new Error("Data save tidak valid");
  const uid = currentUser.uid; let naik = 0;
  for (const [lvl, g] of Object.entries(d.gami || {})) {
    if (!WALLET_LVLS.includes(lvl) || !g || typeof g.xp !== "number") continue;
    const ref = doc(db, "siswa", uid, "gami", lvl), cur = await getDoc(ref);
    const curXp = cur.exists() ? (cur.data().xp || 0) : 0;
    if (g.xp > curXp) { await setDoc(ref, { xp: g.xp, level_karakter: Math.floor(Math.sqrt(g.xp / 50)) + 1 }, { merge: true }); naik++; }
  }
  const k = d.karakter || {}, sd = currentSiswaDoc || {}, cur = sd.karakter || {};
  const inv = [...new Set([...(cur.inventory || []), ...(Array.isArray(k.inventory) ? k.inventory : [])])];
  const upd = { "karakter.inventory": inv };
  if (k.equipped && Object.keys(cur.equipped || {}).length === 0) upd["karakter.equipped"] = k.equipped;
  await updateDoc(doc(db, "siswa", uid), upd);
  if (currentSiswaDoc) { currentSiswaDoc.karakter = { ...(currentSiswaDoc.karakter || {}), inventory: inv, ...(upd["karakter.equipped"] ? { equipped: k.equipped } : {}) }; }
  _lvSet(d.levelAkun || 1);
  return { xpDinaikkan: naik, item: inv.length };
}

/* Pulihkan dari file save TANPA Firestore: hadiah gacha → penyimpanan perangkat, level akun → cache perangkat. Hanya menambah. */
export function restoreLokal(o) {
  if (!currentUser || !o) return { gacha: 0 };
  const g = _gLocal(), lama = g.inv || [], tambahan = Array.isArray(o.gachaInv) ? o.gachaInv.filter(x => typeof x === "string") : [];
  const gab = Array.from(new Set([...lama, ...tambahan])); g.inv = gab;
  if (typeof o.sinceEpic === "number" && !g.sinceEpic) g.sinceEpic = o.sinceEpic;
  if (typeof o.sinceLegend === "number" && !g.sinceLegend) g.sinceLegend = o.sinceLegend;
  _gSave(g); if (o.levelAkun) _lvSet(o.levelAkun);
  return { gacha: gab.length - lama.length };
}
