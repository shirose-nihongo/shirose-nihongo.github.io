/* DIHASILKAN oleh tools/build-gacha.mjs — jangan edit manual */
const ITEMS = [
 {
  "id": "short",
  "nama": "Rambut Pendek",
  "rarity": "common",
  "kind": "shop",
  "kat": "Rambut",
  "harga": 100
 },
 {
  "id": "medium",
  "nama": "Rambut Sedang",
  "rarity": "common",
  "kind": "shop",
  "kat": "Rambut",
  "harga": 150
 },
 {
  "id": "long",
  "nama": "Rambut Panjang",
  "rarity": "common",
  "kind": "shop",
  "kat": "Rambut",
  "harga": 200
 },
 {
  "id": "spiky",
  "nama": "Rambut Jabrik",
  "rarity": "common",
  "kind": "shop",
  "kat": "Rambut",
  "harga": 300
 },
 {
  "id": "messy",
  "nama": "Rambut Acak",
  "rarity": "common",
  "kind": "shop",
  "kat": "Rambut",
  "harga": 250
 },
 {
  "id": "anime_boy",
  "nama": "Anime Boy",
  "rarity": "common",
  "kind": "shop",
  "kat": "Rambut",
  "harga": 400
 },
 {
  "id": "formal",
  "nama": "Rambut Formal",
  "rarity": "common",
  "kind": "shop",
  "kat": "Rambut",
  "harga": 500
 },
 {
  "id": "kemeja_navy",
  "nama": "Kemeja Navy",
  "rarity": "common",
  "kind": "shop",
  "kat": "Pakaian",
  "harga": 500
 },
 {
  "id": "jaket_hitam",
  "nama": "Jaket Hitam",
  "rarity": "uncommon",
  "kind": "shop",
  "kat": "Pakaian",
  "harga": 2500
 },
 {
  "id": "hoodie_pink",
  "nama": "Hoodie Pink Sakura",
  "rarity": "rare",
  "kind": "shop",
  "kat": "Pakaian",
  "harga": 10000
 },
 {
  "id": "n1_suit_legendary",
  "nama": "✨ Executive Suit Legendary (Gold)",
  "rarity": "legendary",
  "kind": "shop",
  "kat": "Pakaian",
  "harga": 50000
 },
 {
  "id": "kimono",
  "nama": "Kimono Tradisional",
  "rarity": "epic",
  "kind": "shop",
  "kat": "Pakaian",
  "harga": 25000
 },
 {
  "id": "sneakers_putih",
  "nama": "Sneakers Putih",
  "rarity": "common",
  "kind": "shop",
  "kat": "Sepatu",
  "harga": 150
 },
 {
  "id": "sneakers_merah",
  "nama": "Sneakers Merah",
  "rarity": "common",
  "kind": "shop",
  "kat": "Sepatu",
  "harga": 800
 },
 {
  "id": "boots",
  "nama": "Boots Hitam",
  "rarity": "uncommon",
  "kind": "shop",
  "kat": "Sepatu",
  "harga": 4000
 },
 {
  "id": "geta",
  "nama": "Geta (下駄) Rare",
  "rarity": "rare",
  "kind": "shop",
  "kat": "Sepatu",
  "harga": 13000
 },
 {
  "id": "kacamata",
  "nama": "Kacamata",
  "rarity": "common",
  "kind": "shop",
  "kat": "Aksesori",
  "harga": 500
 },
 {
  "id": "kacamata_pink",
  "nama": "Kacamata Pink",
  "rarity": "common",
  "kind": "shop",
  "kat": "Aksesori",
  "harga": 600
 },
 {
  "id": "topi_merah",
  "nama": "Topi Merah",
  "rarity": "uncommon",
  "kind": "shop",
  "kat": "Aksesori",
  "harga": 2800
 },
 {
  "id": "headband_pink",
  "nama": "Headband Pink",
  "rarity": "common",
  "kind": "shop",
  "kat": "Aksesori",
  "harga": 550
 },
 {
  "id": "mahkota",
  "nama": "Mahkota Emas",
  "rarity": "common",
  "kind": "shop",
  "kat": "Aksesori",
  "harga": 1500
 },
 {
  "id": "tas_sekolah",
  "nama": "Tas Sekolah",
  "rarity": "common",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 100
 },
 {
  "id": "buku_emas",
  "nama": "Buku Emas 極意の書",
  "rarity": "mythic",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 1200
 },
 {
  "id": "pedang_bambu",
  "nama": "Shinai 竹刀",
  "rarity": "common",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 700
 },
 {
  "id": "n5_buku_common",
  "nama": "N5 · Buku Pelajaran",
  "rarity": "common",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 500
 },
 {
  "id": "n5_buku_rare",
  "nama": "N5 · Buku Rare (Aura Hijau)",
  "rarity": "rare",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 12000
 },
 {
  "id": "n4_dualbooks_epic",
  "nama": "N4 · Dual Books Epic (Aura Ungu + Api)",
  "rarity": "epic",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 30000
 },
 {
  "id": "n3_grimoire_epic",
  "nama": "N3 · Flying Grimoire (Aura Ungu)",
  "rarity": "epic",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 28000
 },
 {
  "id": "n2_hammer_rare",
  "nama": "N2 · Palu Konstruksi (Aura)",
  "rarity": "rare",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 14000
 },
 {
  "id": "flying_book_green",
  "nama": "📘 Buku Terbang · Aura Hijau",
  "rarity": "epic",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 30000
 },
 {
  "id": "flying_book_purple",
  "nama": "📘 Buku Terbang · Aura Ungu Epic",
  "rarity": "legendary",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 60000
 },
 {
  "id": "flying_book_mythic",
  "nama": "✨ BUKU TERBANG MYTHIC · Emas + Api",
  "rarity": "mythic",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 120000
 },
 {
  "id": "hammer_green",
  "nama": "🔨 Palu · Aura Hijau",
  "rarity": "uncommon",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 4500
 },
 {
  "id": "hammer_purple",
  "nama": "🔨 Palu · Aura Ungu Epic",
  "rarity": "epic",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 28000
 },
 {
  "id": "hammer_fire_gold",
  "nama": "✨ Palu Mythic · Emas + Api",
  "rarity": "legendary",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 75000
 },
 {
  "id": "briefcase_common",
  "nama": "💼 Briefcase Hitam",
  "rarity": "common",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 1500
 },
 {
  "id": "briefcase_leather",
  "nama": "💼 Briefcase Kulit Rare",
  "rarity": "rare",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 12000
 },
 {
  "id": "briefcase_executive_gold",
  "nama": "✨ Executive Briefcase Legendary (Emas + Api)",
  "rarity": "legendary",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 80000
 },
 {
  "id": "tas_green",
  "nama": "🎒 Tas · Aura Hijau",
  "rarity": "uncommon",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 3000
 },
 {
  "id": "tas_purple",
  "nama": "🎒 Tas · Aura Ungu Epic",
  "rarity": "rare",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 14000
 },
 {
  "id": "tas_fire_gold",
  "nama": "✨ Tas Mythic · Emas + Api",
  "rarity": "epic",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 35000
 },
 {
  "id": "legendary_golden_tome",
  "nama": "✨ Golden Tome Legendary",
  "rarity": "legendary",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 50000
 },
 {
  "id": "legendary_golden_hammer",
  "nama": "✨ Golden Hammer Legendary",
  "rarity": "legendary",
  "kind": "shop",
  "kat": "Item Tangan",
  "harga": 50000
 },
 {
  "id": "aura_hijau",
  "nama": "💚 Aura Hijau",
  "rarity": "uncommon",
  "kind": "shop",
  "kat": "Aura",
  "harga": 5000
 },
 {
  "id": "aura_ungu",
  "nama": "💜 Aura Ungu Epic",
  "rarity": "rare",
  "kind": "shop",
  "kat": "Aura",
  "harga": 15000
 },
 {
  "id": "aura_emas_api",
  "nama": "✨ Aura Emas + Api Legendary",
  "rarity": "legendary",
  "kind": "shop",
  "kat": "Aura",
  "harga": 50000
 },
 {
  "id": "aura_pink",
  "nama": "Aura Pink (lama)",
  "rarity": "common",
  "kind": "shop",
  "kat": "Aura",
  "harga": 1000
 },
 {
  "id": "aura_emas",
  "nama": "Aura Emas (lama)",
  "rarity": "common",
  "kind": "shop",
  "kat": "Aura",
  "harga": 2500
 },
 {
  "id": "theme_ungu",
  "nama": "Tema Ungu",
  "rarity": "epic",
  "kind": "theme"
 },
 {
  "id": "theme_cerah",
  "nama": "Tema Cerah",
  "rarity": "epic",
  "kind": "theme"
 },
 {
  "id": "theme_hujan",
  "nama": "Tema Hujan",
  "rarity": "epic",
  "kind": "theme"
 },
 {
  "id": "theme_salju",
  "nama": "Tema Salju",
  "rarity": "legendary",
  "kind": "theme"
 },
 {
  "id": "theme_panas",
  "nama": "Tema Musim Panas",
  "rarity": "legendary",
  "kind": "theme"
 },
 {
  "id": "theme_badai",
  "nama": "Tema Badai",
  "rarity": "legendary",
  "kind": "theme"
 },
 {
  "id": "theme_gugur",
  "nama": "Tema Gugur",
  "rarity": "legendary",
  "kind": "theme"
 },
 {
  "id": "theme_semi",
  "nama": "Tema Semi",
  "rarity": "legendary",
  "kind": "theme"
 }
];

/* Gacha: logika murni (tanpa I/O) — dipakai Worker & simulasi. RNG HARUS dari server (crypto). */

function poolDari(items) { const p = { common: [], uncommon: [], rare: [], epic: [], legendary: [], mythic: [] }; items.forEach(x => p[x.rarity] && p[x.rarity].push(x.id)); return p; }
const CONFIG = {
  // ⚠ USULAN harga — tinjau sebelum produksi.
  PRICE_1: 1000, PRICE_10: 9000,
  RARITY: [ // persen, total 100
    { id: "common", pct: 45 }, { id: "uncommon", pct: 30 }, { id: "rare", pct: 15 },
    { id: "epic", pct: 7 }, { id: "legendary", pct: 2.99 }, { id: "mythic", pct: 0.01 },
  ],
  PITY_EPIC: 30,       // maks 30 tarikan tanpa epic+  → epic dijamin
  PITY_LEGENDARY: 120, // maks 120 tarikan tanpa legendary+ → legendary dijamin
  // Hadiah per rarity: barang SHOP + tema (dibangun dari cloudflare/gacha-items.js).
  POOL: poolDari(ITEMS),
  DUP_REFUND: { common: 100, uncommon: 250, rare: 700, epic: 2000, legendary: 6000, mythic: 20000 },
};
const ORDER = CONFIG.RARITY.map(r => r.id);
const rank = (id) => ORDER.indexOf(id);
function secureRandom() { const b = new Uint32Array(2); crypto.getRandomValues(b); return (b[0] * 2 ** 21 + (b[1] >>> 11)) / 2 ** 53; }
/* pity: {sinceEpic, sinceLegend}. rnd: () => [0,1). Mengembalikan {rarity,item,pity}. */
function rollOnce(pity, rnd = secureRandom, C = CONFIG) {
  let r = rnd() * 100, acc = 0, rar = C.RARITY[0].id;
  for (const x of C.RARITY) { acc += x.pct; if (r < acc) { rar = x.id; break; } }
  const se = (pity.sinceEpic || 0) + 1, sl = (pity.sinceLegend || 0) + 1;
  if (sl >= C.PITY_LEGENDARY && rank(rar) < rank("legendary")) rar = rnd() < 0.01 / 3 ? "mythic" : "legendary";
  else if (se >= C.PITY_EPIC && rank(rar) < rank("epic")) rar = "epic";
  const pool = C.POOL[rar]; const item = pool[Math.floor(rnd() * pool.length)];
  return { rarity: rar, item, pity: { sinceEpic: rank(rar) >= rank("epic") ? 0 : se, sinceLegend: rank(rar) >= rank("legendary") ? 0 : sl } };
}
/* n tarikan; inv = Set/array item yang sudah dimiliki. Duplikat jadi refund koin. */
function rollMany(n, pity, inv, rnd = secureRandom, C = CONFIG) {
  const own = new Set(inv || []); const out = []; let p = { ...pity }, refund = 0;
  for (let i = 0; i < n; i++) {
    const r = rollOnce(p, rnd, C); p = r.pity;
    const dup = own.has(r.item); if (dup) refund += C.DUP_REFUND[r.rarity]; else own.add(r.item);
    out.push({ rarity: r.rarity, item: r.item, dup });
  }
  return { results: out, pity: p, refund, inv: [...own] };
}

/* Akun gratis (moderator / koin tak terbatas): tarikan tidak memotong koin, tapi peluang lebih rendah & tanpa pity. */
const CONFIG_FREE = { ...CONFIG, RARITY: [
  { id: "common", pct: 70 }, { id: "uncommon", pct: 22 }, { id: "rare", pct: 6.5 },
  { id: "epic", pct: 1.3 }, { id: "legendary", pct: 0.19 }, { id: "mythic", pct: 0.01 },
], PITY_EPIC: 1e9, PITY_LEGENDARY: 1e9 };

/* Gacha server — Cloudflare Worker. RNG & potong koin HANYA di server.
 * Secret/Var: FIREBASE_SA (JSON service account, secret), FIREBASE_PROJECT (id proyek), FIREBASE_API_KEY (web api key), ALLOW_ORIGIN.
 * POST /  {n:1|10}  Authorization: Bearer <Firebase ID token>
 * Koin dipotong dari dompet tunggal siswa/{uid}/wallet/main.koin. Status gacha: siswa/{uid}/wallet/gacha.
 * Setiap tarikan ditulis ke koleksi siswa/{uid}/wallet_log (jejak transaksi). ⚠ BELUM diuji ke Firebase asli — lihat docs/EKONOMI-GACHA.md.
 * Firestore Rules: klien TIDAK boleh menulis wallet/gacha & wallet_log (hanya baca). */


let env = {};
const J = (code, o, h = {}) => new Response(JSON.stringify(o), { status: code, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...h } });
const b64u = (b) => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
async function saToken() {
  const sa = JSON.parse(env.FIREBASE_SA), now = Math.floor(Date.now() / 1000), enc = new TextEncoder();
  const head = b64u(enc.encode(JSON.stringify({ alg: "RS256", typ: "JWT" }))), pl = b64u(enc.encode(JSON.stringify({ iss: sa.client_email, scope: "https://www.googleapis.com/auth/datastore", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })));
  const pem = sa.private_key.replace(/-----[^-]+-----|\s/g, ""), der = Uint8Array.from(atob(pem), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sig = b64u(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, enc.encode(head + "." + pl)));
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=" + head + "." + pl + "." + sig });
  return (await r.json()).access_token;
}
async function verifyToken(idToken) {
  if (!idToken) return null;
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${env.FIREBASE_API_KEY}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken }) });
  if (!r.ok) return null; const u = (await r.json())?.users?.[0]; return u && !u.disabled ? { uid: u.localId } : null;
}
const DB = () => `projects/${env.FIREBASE_PROJECT}/databases/(default)/documents`;
const num = (f) => f ? Number(f.integerValue ?? f.doubleValue ?? 0) : 0;
async function getDoc(tok, path) {
  const r = await fetch(`https://firestore.googleapis.com/v1/${DB()}/${path}`, { headers: { Authorization: "Bearer " + tok } });
  if (r.status === 404) return { fields: {}, updateTime: null }; if (!r.ok) throw new Error("firestore " + r.status); return r.json();
}
const fv = (v) => Array.isArray(v) ? { arrayValue: { values: v.map(fv) } } : typeof v === "number" ? { integerValue: String(Math.round(v)) } : typeof v === "boolean" ? { booleanValue: v } : v && typeof v === "object" ? { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fv(x)])) } } : { stringValue: String(v) };
const __worker = {
  async fetch(req, e) {
    env = e || {};
    const origin = req.headers.get("Origin") || "", ok = [...String(env.ALLOW_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean), "https://shirose-nihongo.github.io"].includes(origin);
    const cors = ok ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin", "Access-Control-Allow-Headers": "Authorization, Content-Type", "Access-Control-Allow-Methods": "POST, OPTIONS" } : { "Vary": "Origin" };
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (origin && !ok) return J(403, { error: "Origin tidak diizinkan" });
    if (req.method !== "POST") return J(405, { error: "POST saja" }, cors);
    const user = await verifyToken((req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, ""));
    if (!user) return J(401, { error: "Harus login" }, cors);
    let p; try { p = await req.json(); } catch (x) { return J(400, { error: "JSON salah" }, cors); }
    const n = p.n === 10 ? 10 : p.n === 1 ? 1 : 0;
    if (!n) return J(400, { error: "n harus 1 atau 10" }, cors);
    const price = n === 10 ? CONFIG.PRICE_10 : CONFIG.PRICE_1;
    try {
      const tok = await saToken(), gp = `siswa/${user.uid}/wallet/main`, wp = `siswa/${user.uid}/wallet/gacha`;
      const [g, w, s] = await Promise.all([getDoc(tok, gp), getDoc(tok, wp), getDoc(tok, `siswa/${user.uid}`)]);
      const unlimited = s.fields?.permissions?.mapValue?.fields?.unlimited_coins?.booleanValue === true;
      if (!g.updateTime) return J(409, { error: "Dompet belum siap — buka aplikasi sekali dulu" }, cors);
      const koin = num(g.fields?.koin); if (!unlimited && koin < price) return J(402, { error: "Koin tidak cukup", koin, price }, cors);
      const pity = { sinceEpic: num(w.fields?.sinceEpic), sinceLegend: num(w.fields?.sinceLegend) };
      const strs = (f) => (f?.arrayValue?.values || []).map(x => x.stringValue);
      const invW = strs(w.fields?.inv), karInv = strs(s.fields?.karakter?.mapValue?.fields?.inventory);
      const r = rollMany(n, pity, [...new Set([...invW, ...karInv])], undefined, unlimited ? CONFIG_FREE : CONFIG);   // barang shop yang sudah dibeli dihitung duplikat
      const kind = Object.fromEntries(ITEMS.map(x => [x.id, x.kind]));
      const baru = r.results.filter(x => !x.dup).map(x => x.item);
      const karBaru = [...new Set([...karInv, ...baru.filter(i => kind[i] === "shop")])];
      const invBaru = [...new Set([...invW, ...baru])];
      const koinBaru = (unlimited ? koin : koin - price) + r.refund;
      const logId = Date.now() + "-" + crypto.randomUUID().slice(0, 8);
      const pre = (d) => d.updateTime ? { updateTime: d.updateTime } : { exists: false };
      const writes = [
        { update: { name: `${DB()}/${gp}`, fields: { koin: fv(koinBaru) } }, updateMask: { fieldPaths: ["koin"] }, currentDocument: pre(g) },
        { update: { name: `${DB()}/${wp}`, fields: { sinceEpic: fv(r.pity.sinceEpic), sinceLegend: fv(r.pity.sinceLegend), inv: fv(invBaru) } }, currentDocument: pre(w) },
        ...(karBaru.length !== karInv.length ? [{ update: { name: `${DB()}/siswa/${user.uid}`, fields: { karakter: { mapValue: { fields: { inventory: fv(karBaru) } } } } }, updateMask: { fieldPaths: ["karakter.inventory"] }, currentDocument: pre(s) }] : []),
        { update: { name: `${DB()}/siswa/${user.uid}/wallet_log/${logId}`, fields: { t: { timestampValue: new Date().toISOString() }, tipe: fv("gacha"), n: fv(n), harga: fv(unlimited ? 0 : price), refund: fv(r.refund), koinSetelah: fv(koinBaru), hasil: fv(r.results) } } },
      ];
      const c = await fetch(`https://firestore.googleapis.com/v1/${DB()}:commit`, { method: "POST", headers: { Authorization: "Bearer " + tok, "Content-Type": "application/json" }, body: JSON.stringify({ writes }) });
      if (!c.ok) return J(409, { error: "Konflik/gagal simpan, coba lagi" }, cors); // precondition gagal → tidak ada koin berubah
      return J(200, { results: r.results, refund: r.refund, koin: koinBaru, pity: r.pity }, cors);
    } catch (x) { return J(500, { error: "Server gacha error" }, cors); }
  },
};

export default __worker;
