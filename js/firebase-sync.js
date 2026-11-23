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
  getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, getDocs, onSnapshot, query, orderBy, limit, addDoc,
  where, writeBatch, serverTimestamp, FieldPath, deleteField, documentId, runTransaction, increment
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCPdZmpHeAOIRcFNSfoiLj-HmNTHettrQo",
  authDomain: "shirose-nihongo.firebaseapp.com",
  projectId: "shirose-nihongo",
  storageBucket: "shirose-nihongo.firebasestorage.app",
  messagingSenderId: "601020682073",
  appId: "1:601020682073:web:adb7adb44e79b17d3d4648",
};

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
export async function klaimAkunDemo(namaRaw) {
  const { email, password } = demoKredensial(namaRaw);
  const namaTampil = String(namaRaw).trim().slice(0, 30) || email.split("@")[0];
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
export async function keluar() { return await signOut(auth); }
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
  currentSiswaDoc.karakter = karakter;
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
  if (currentSiswaDoc && currentSiswaDoc.karakter) currentSiswaDoc.karakter.body = b;
}
export async function setBentukKarakter(b) {
  if (!currentUser) return;
  await updateDoc(doc(db, "siswa", currentUser.uid), { "karakter.bentuk": b });
  if (currentSiswaDoc && currentSiswaDoc.karakter) currentSiswaDoc.karakter.bentuk = b;
}
export async function equipItem(kategori, itemId) {
  if (!currentUser) return;
  const eq = currentSiswaDoc.karakter.equipped || {};
  eq[kategori] = itemId;
  await updateDoc(doc(db, "siswa", currentUser.uid), { "karakter.equipped": eq });
  currentSiswaDoc.karakter.equipped = eq;
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
  const out = await runTransaction(db, async (tx) => {
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
  });
  _baseSet(out);
  // Guru mengatur ulang koin (spentReset di dompet) → hapus catatan belanja gacha lama di perangkat ini (sekali per penyetelan)
  { const o = _gLocal(); if (_resetTok > (Number(o.spentSeen) || 0)) { o.spent = 0; o.spentSeen = _resetTok; _gSave(o); } }
  const _eff = Math.max(0, out - _gSpent());
  if (delta) { try { await addDoc(collection(db, "siswa", currentUser.uid, "wallet_log"), { t: serverTimestamp(), delta, alasan: String(alasan || ""), saldo: out }); } catch (e) {} }
  return _eff;
}
export async function getWalletKoin() {
  if (!currentUser) return null;
  try { const k = await walletTx(0, ""); _walletOff = false; _walletErr = ""; return k; } catch (e) { console.warn("wallet gagal, pakai saldo per level:", e.message); _walletErr = e.code || e.message; _walletOff = true; return null; }
}
/* Tambah (atau kurangi, delta<0) koin dari fitur apa pun. Mengembalikan saldo baru atau null. */
export async function tambahKoin(delta, alasan) {
  if (!currentUser || !delta) return null;
  for (let i = 0; i < 2; i++) {   // coba lagi sekali: error jaringan sesaat tidak boleh mematikan dompet
    try { const k = await walletTx(delta, alasan); _walletOff = false; _walletErr = ""; return k; }
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
    const [snap, k, lvMax] = await Promise.all([
      getDoc(doc(db, "siswa", currentUser.uid, "gami", level)),
      getWalletKoin().catch(() => null),
      _levelAkun(level).catch(() => 0),
    ]);
    const g = snap.exists() ? snap.data() : { xp:0, koin:0, streak:0, level_karakter:1 };
    g.koin = k !== null ? k : _koinFallback(g.koin);
    // Level karakter = level TERTINGGI di semua level JLPT/JFT (dulu hanya dokumen level aktif -> tampak "turun" saat pindah level)
    g.level_level_ini = g.level_karakter || 1;
    g.level_karakter = Math.max(g.level_karakter || 1, lvMax || 1);
    _lvSet(g.level_karakter);
    return g;
  } catch (e) { console.warn("getGami failed:", e.message); return { xp:0, koin:_koinFallback(0), streak:0, level_karakter:Math.max(1, _lvGet()) }; }
}
// Level akun: cache 6 jam di perangkat; baca dokumen level lain hanya bila cache kedaluwarsa (hemat kuota Firestore).
const _lvKey = () => "shirose-lvakun-" + (currentUser?.uid || "x");
function _lvGet() { try { return (JSON.parse(localStorage.getItem(_lvKey()) || "{}").v) || 0; } catch (e) { return 0; } }
function _lvSet(v) { try { const o = JSON.parse(localStorage.getItem(_lvKey()) || "{}"); localStorage.setItem(_lvKey(), JSON.stringify({ v: Math.max(v || 0, o.v || 0), t: o.t || 0 })); } catch (e) {} }
async function _levelAkun(aktif) {
  let o = {}; try { o = JSON.parse(localStorage.getItem(_lvKey()) || "{}"); } catch (e) {}
  if (o.t && Date.now() - o.t < 6 * 3600e3) return o.v || 0;
  const uid = currentUser.uid, lvls = WALLET_LVLS.filter(l => l !== aktif);
  const snaps = await Promise.all(lvls.map(l => getDoc(doc(db, "siswa", uid, "gami", l)).catch(() => null)));
  let mx = 0; snaps.forEach(sn => { if (sn && sn.exists()) mx = Math.max(mx, sn.data().level_karakter || 1); });
  mx = Math.max(mx, o.v || 0);
  try { localStorage.setItem(_lvKey(), JSON.stringify({ v: mx, t: Date.now() })); } catch (e) {}
  return mx;
}
export async function tambahXP(level, dXP, dKoin = 0) {
  if (!currentUser) return;
  try {
    const ref = doc(db, "siswa", currentUser.uid, "gami", level);
    const snap = await getDoc(ref);
    const cur = snap.exists() ? snap.data() : { xp:0, koin:0, streak:0, level_karakter:1 };
    cur.xp = (cur.xp || 0) + dXP;
    cur.level_karakter = Math.floor(Math.sqrt(cur.xp / 50)) + 1;
    const today = new Date().toISOString().slice(0,10);
    if (cur.lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
      cur.streak = cur.lastDate === yesterday ? (cur.streak || 0) + 1 : 1;
      cur.lastDate = today;
    }
    let saldo = null;
    if (dKoin) { try { saldo = await tambahKoin(dKoin, "hadiah belajar"); } catch (e) {} }
    if (dKoin && saldo === null) cur.koin = (cur.koin || 0) + dKoin;   // fallback lama
    await setDoc(ref, cur, { merge: true });
    _lbPush(level, cur.xp, cur.level_karakter);
    if (saldo !== null) cur.koin = saldo; else { const k = await getWalletKoin(); cur.koin = k !== null ? k : _koinFallback(cur.koin); }
    cur.level_level_ini = cur.level_karakter; cur.level_karakter = Math.max(cur.level_karakter, _lvGet()); _lvSet(cur.level_karakter);
    return cur;
  } catch (e) { console.warn("tambahXP failed:", e.message); return null; }
}

/* ========== SRS (hafalan) ========== */
export async function saveSRS(level, kartu) {
  if (!currentUser) return;
  try {
    await setDoc(doc(db, "siswa", currentUser.uid, "srs", level), {
      kartu, updated: serverTimestamp()
    }, { merge: true });
  } catch (e) { console.warn("saveSRS failed:", e.message); }
}
export async function loadSRS(level) {
  if (!currentUser) return {};
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
  const q = query(collection(db, "siswa", currentUser.uid, "jlpt_hasil"), orderBy("tgl", "desc"), limit(limitN));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function listHasilJLPTOf(uid, limitN = 100) {
  if (!userIsGuru() && uid !== currentUser?.uid) throw new Error("Tidak diizinkan");
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
  const q = query(collection(db, "siswa", currentUser.uid, "mensetsu_hasil"), orderBy("tgl", "desc"), limit(limitN));
  return (await getDocs(q)).docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function listHasilMensetsuOf(uid, limitN = 100) {
  if (!userIsGuru() && uid !== currentUser?.uid) throw new Error("Tidak diizinkan");
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
  try {
    const ymd = _ymdLocal();
    const ref = doc(db, "siswa", currentUser.uid, "activity", ymd);
    const snap = await getDoc(ref);
    const prev = snap.exists() ? snap.data() : { kanji:0, kosakata:0, latihan:0, ujian:0, sesi:0 };
    const next = { ...prev, [type]: (prev[type]||0) + count, lastTs: serverTimestamp() };
    await setDoc(ref, next, { merge: true });
  } catch (e) { console.warn("recordActivity failed:", e.message); }
}
export async function listActivity(ym /* YYYYMM */){
  if (!currentUser) return {};
  try {
    // Hanya baca dokumen bulan yang diminta (id = YYYYMMDD), bukan seluruh riwayat.
    const col = collection(db, "siswa", currentUser.uid, "activity");
    const q = query(col, where(documentId(), ">=", ym), where(documentId(), "<", ym + "\uf8ff"));
    const snap = await getDocs(q);
    const result = {};
    snap.forEach(d => {
      if (d.id.startsWith(ym)) result[d.id] = d.data();
    });
    return result;
  } catch (e) { console.warn("listActivity failed:", e.message); return {}; }
}

/* ========== KOMENTAR (public per-item discussion) ========== */
// Composite key per detail page (kanji/kosakata/bunpou + level + number).
function _cmtKey(tipe, lvl, no){ return `${tipe}_${lvl}_${no}`; }
export async function listKomentar(tipe, lvl, no) {
  try {
    const key = _cmtKey(tipe, lvl, no);
    const col = collection(db, "komentar", key, "items");
    const q = query(col, orderBy("created", "desc"), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map(d => { const x = d.data(); return { id: d.id, ...x, nama: _cleanNama(x.nama) }; });
  } catch (e) { console.warn("listKomentar failed:", e.message); return []; }
}
export async function tambahKomentar(tipe, lvl, no, text) {
  if (!currentUser) throw new Error("Harus login dulu");
  const clean = (text || "").toString().trim().slice(0, 1000);
  if (!clean) throw new Error("Teks komentar kosong");
  const key = _cmtKey(tipe, lvl, no);
  const nama = publicNama(currentUser, currentSiswaDoc);
  const kelas = currentSiswaDoc?.kelas || "";
  const col = collection(db, "komentar", key, "items");
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

  // Try to overlay Firestore entries (more authoritative if available)
  try {
    const col = collection(db, "siswa", uid, "rangkuman");
    const snap = await getDocs(col);
    snap.docs.forEach(d => merged.set(d.id, { id: d.id, ...d.data() }));

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
  const q = query(collection(db, "siswa", currentUser.uid, "nilai"),
                  orderBy("tgl","desc"), limit(limitN));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id:d.id, ...d.data() }));
}

/* ========== KATEGORI UJIAN (guru CRUD) ========== */
export async function listKategori(level = null) {
  const col = collection(db, "kategori_ujian");
  const snap = await getDocs(col);
  let arr = snap.docs.map(d => ({ id:d.id, ...d.data() }));
  if (level) arr = arr.filter(k => k.level === level);
  return arr;
}
export async function simpanKategori(data, id = null) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  const col = collection(db, "kategori_ujian");
  if (id) {
    await setDoc(doc(col, id), { ...data, updated: serverTimestamp() }, { merge: true });
    return id;
  } else {
    const ref = await addDoc(col, { ...data, created: serverTimestamp() });
    return ref.id;
  }
}
export async function hapusKategori(id) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await deleteDoc(doc(db, "kategori_ujian", id));
}

/* ========== KELAS KATA KOSAKATA (override guru) ==========
   kosakata_pos/{lvl} = { map: { "<kata>": ["KK"|"KB"|"KSい"|"KSな", ...] | ["-"] } }
   Data JSON asli tidak diubah; override dipasang di memori saat Materi/Hafalan dimuat. */
export async function getPosOverride(lvl) {
  const snap = await getDoc(doc(db, "kosakata_pos", lvl));
  return snap.exists() ? (snap.data().map || {}) : {};
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
export async function listSoal(kategoriId) {
  const col = collection(db, "soal", kategoriId, "items");
  const snap = await getDocs(col);
  const arr = snap.docs.map(d => ({ id:d.id, ...d.data() }));
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
  return total;
}
export async function hapusSoal(kategoriId, soalId) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await deleteDoc(doc(db, "soal", kategoriId, "items", soalId));
}
export async function editSoal(kategoriId, soalId, data) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  await updateDoc(doc(db, "soal", kategoriId, "items", soalId), data);
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
    const snap = await getDocs(collection(db, "siswa"));
    return snap.docs.map(d => ({ uid:d.id, ...d.data() }));
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
  const result = {};
  for (const lvl of ["n5","n4","n3","n2","n1"]) {
    const s = await getDoc(doc(db, "siswa", uid, "gami", lvl));
    result[lvl] = s.exists() ? s.data() : null;
  }
  return result;
}
// Teacher view: all exam records for a specific student (newest first).
export async function listNilaiOf(uid, limitN = 100) {
  if (!userIsGuru() && uid !== currentUser?.uid) throw new Error("Tidak diizinkan");
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
}
export async function loadSswRank(slug) {
  const snap = await getDocs(query(collection(db, "ssw_rank"), where("slug", "==", slug)));
  return snap.docs.map(x => x.data());
}
export async function resetSswRank(slug) {
  if (!userIsGuru()) throw new Error("Hanya guru");
  const rows = await loadSswRank(slug);
  for (const r of rows) await deleteDoc(doc(db, "ssw_rank", `${slug}__${r.uid}`));
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
async function _lbPush(level, xpVal, lvVal){
  try {
    if (!currentUser) return;
    if (!_lbMine){ const g = await getDoc(doc(db, "lb", currentUser.uid)); _lbMine = g.exists() ? g.data() : { xp:{}, lv:1 }; }
    const xp = { ...(_lbMine.xp||{}), [level]: xpVal };
    const d = _lbBuild(xp, Math.max(_lbMine.lv||1, lvVal||1));
    await setDoc(doc(db, "lb", currentUser.uid), d);
    _lbMine = d; _lbCache.clear();
  } catch(e){ console.warn("lb push failed:", e.message); }
}
// Sinkron sekali (per sesi) dari data gami sendiri, supaya siswa lama langsung muncul.
let _lbSynced = false;
export async function syncMyLeaderboard(){
  if (_lbSynced || !currentUser) return;
  _lbSynced = true;
  try {
    const gs = await Promise.all(LVLS.map(l => getDoc(doc(db, "siswa", currentUser.uid, "gami", l)).catch(() => null)));
    const xp = {}; let lv = 1;
    gs.forEach((g, i) => { if (g && g.exists()){ const d = g.data(); xp[LVLS[i]] = d.xp || 0; lv = Math.max(lv, d.level_karakter || 1); } });
    const d = _lbBuild(xp, lv);
    if (d.total === 0) return;
    await setDoc(doc(db, "lb", currentUser.uid), d);
    _lbMine = d; _lbCache.clear();
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
  return n;
}

// kind: "global" | "jlpt-n5".."jlpt-n1". kelas (opsional) membatasi ke satu kelas.
export async function leaderboardAdvanced(kind = "global", topN = 20, kelas = "") {
  const key = kind + "|" + (kelas || "*") + "|" + topN;
  const hit = _lbCache.get(key);
  if (hit && Date.now() - hit.t < LB_TTL) return hit.data;
  try {
    const field = kind.startsWith("jlpt-") ? "xp." + kind.slice(5) : "total";
    const base = collection(db, "lb");
    // Per kelas: satu kelas kecil -> urut di klien (tanpa indeks gabungan). Semua kelas: orderBy + limit.
    const snap = await getDocs(kelas ? query(base, where("kelas", "==", kelas))
                                     : query(base, orderBy(field, "desc"), limit(topN)));
    const get = d => field === "total" ? (d.total || 0) : (d.xp?.[field.slice(3)] || 0);
    const result = snap.docs.map(x => x.data())
      .map(d => ({ uid: d.uid, nama: d.nama || "Anonim", kelas: d.kelas || "", score: get(d), meta: "Lv " + (d.lv || 1) }))
      .filter(r => r.score > 0)
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
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data();
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
  return data;
}
export async function updateMisiProgres(misiId, delta = 1) {
  if (!currentUser) return;
  try {
    const tgl = new Date().toISOString().slice(0,10);
    const ref = doc(db, "siswa", currentUser.uid, "misi_harian", tgl);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const data = snap.data();
    const m = data.misi.find(x => x.id === misiId);
    if (!m || data.claimed.includes(misiId)) return;
    m.progres = Math.min((m.progres || 0) + delta, m.target);
    await setDoc(ref, data);
    return m;
  } catch (e) { console.warn("updateMisiProgres failed:", e.message); }
}
export async function claimMisi(misiId, level = "n5") {
  if (!currentUser) return;
  const tgl = new Date().toISOString().slice(0,10);
  const ref = doc(db, "siswa", currentUser.uid, "misi_harian", tgl);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data();
  const m = data.misi.find(x => x.id === misiId);
  if (!m || data.claimed.includes(misiId) || m.progres < m.target) return;
  data.claimed.push(misiId);
  await setDoc(ref, data);
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
