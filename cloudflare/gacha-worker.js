/* Gacha server — Cloudflare Worker. RNG & potong koin HANYA di server.
 * Secret/Var: FIREBASE_SA (JSON service account, secret), FIREBASE_PROJECT (id proyek), FIREBASE_API_KEY (web api key), ALLOW_ORIGIN.
 * POST /  {n:1|10}  Authorization: Bearer <Firebase ID token>
 * Koin dipotong dari dompet tunggal siswa/{uid}/wallet/main.koin. Status gacha: siswa/{uid}/wallet/gacha.
 * Setiap tarikan ditulis ke koleksi siswa/{uid}/wallet_log (jejak transaksi). ⚠ BELUM diuji ke Firebase asli — lihat docs/EKONOMI-GACHA.md.
 * Firestore Rules: klien TIDAK boleh menulis wallet/gacha & wallet_log (hanya baca). */
import { rollMany, CONFIG, CONFIG_FREE } from "./gacha-core.js";
import { ITEMS } from "./gacha-items.js";
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
export default {
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
