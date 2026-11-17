const ME={uid:"demo1",email:"demo@shirose.id",displayName:"Aru"};
const SISWA={nama:"Aru",email:"demo@shirose.id",role:"student",status:"aktif",aksesSswBidang:{"auto-maintenance":true,"industrial-mfg":true,"mfg-machine-metal":true,"wood-industry":true,"auto-transport":true,"kaigo":true,"kaigo-jp":true,"construction":true,"construction-bangunan":true,"construction-lifeline":true},aksesLevel:{n5:true,n4:true,n3:true,n2:true,n1:true},karakter:{equipped:{rambut:"messy",pakaian:"jaket_hitam",sepatu:"boots",aksesori:"ac_mahkota_permata",item_tangan:"wa_staff_mythic",aura:"none",celana:"cl_jeans_hitam",sayap:"sy_phoenix"},inventory:[],skinTone:"light",hairColor:"#2a1810"}};
const GAMI={xp:2350,koin:1840,streak:12,level_karakter:45};
const noop=async()=>null;
export async function assignSiswaKeKelas(...a){return window.__FBS&&window.__FBS["assignSiswaKeKelas"]?window.__FBS["assignSiswaKeKelas"](...a):null}
export async function beliItem(...a){return window.__FBS&&window.__FBS["beliItem"]?window.__FBS["beliItem"](...a):null}
export async function buatAkunSiswa(...a){return window.__FBS&&window.__FBS["buatAkunSiswa"]?window.__FBS["buatAkunSiswa"](...a):null}
export async function catatNilai(...a){return window.__FBS&&window.__FBS["catatNilai"]?window.__FBS["catatNilai"](...a):null}
export async function claimMisi(...a){return window.__FBS&&window.__FBS["claimMisi"]?window.__FBS["claimMisi"](...a):null}
export async function claimUjianLulusReward(...a){return window.__FBS&&window.__FBS["claimUjianLulusReward"]?window.__FBS["claimUjianLulusReward"](...a):null}
export async function daftar(...a){return window.__FBS&&window.__FBS["daftar"]?window.__FBS["daftar"](...a):null}
export async function daftarkanAkunExisting(...a){return window.__FBS&&window.__FBS["daftarkanAkunExisting"]?window.__FBS["daftarkanAkunExisting"](...a):null}
export async function deleteSswBidang(...a){return window.__FBS&&window.__FBS["deleteSswBidang"]?window.__FBS["deleteSswBidang"](...a):null}
export async function detectNewMastery(...a){return window.__FBS&&window.__FBS["detectNewMastery"]?window.__FBS["detectNewMastery"](...a):null}
export async function diagnosaRules(...a){return window.__FBS&&window.__FBS["diagnosaRules"]?window.__FBS["diagnosaRules"](...a):null}
export async function editSoal(...a){return window.__FBS&&window.__FBS["editSoal"]?window.__FBS["editSoal"](...a):null}
export async function equipItem(...a){return window.__FBS&&window.__FBS["equipItem"]?window.__FBS["equipItem"](...a):null}
export async function gachaRefund(...a){return window.__FBS&&window.__FBS["gachaRefund"]?window.__FBS["gachaRefund"](...a):null}
export async function gachaSpend(...a){return window.__FBS&&window.__FBS["gachaSpend"]?window.__FBS["gachaSpend"](...a):null}
export async function getHasilJLPT(...a){return window.__FBS&&window.__FBS["getHasilJLPT"]?window.__FBS["getHasilJLPT"](...a):null}
export async function getIdToken(...a){return window.__FBS&&window.__FBS["getIdToken"]?window.__FBS["getIdToken"](...a):null}
export async function getLastAuthDenied(...a){return window.__FBS&&window.__FBS["getLastAuthDenied"]?window.__FBS["getLastAuthDenied"](...a):null}

export async function getMisiHariIni(...a){return window.__FBS&&window.__FBS["getMisiHariIni"]?window.__FBS["getMisiHariIni"](...a):null}
export async function getPersiapanMensetsu(...a){return window.__FBS&&window.__FBS["getPersiapanMensetsu"]?window.__FBS["getPersiapanMensetsu"](...a):null}
export function getSiswaDoc(){return SISWA}
export async function getSiswaGami(...a){return window.__FBS&&window.__FBS["getSiswaGami"]?window.__FBS["getSiswaGami"](...a):null}
export async function getSiswaMasteryCounts(...a){return window.__FBS&&window.__FBS["getSiswaMasteryCounts"]?window.__FBS["getSiswaMasteryCounts"](...a):null}
export async function getSiswaSrsAll(...a){return window.__FBS&&window.__FBS["getSiswaSrsAll"]?window.__FBS["getSiswaSrsAll"](...a):null}
export async function getUser(...a){return window.__FBS&&window.__FBS["getUser"]?window.__FBS["getUser"](...a):null}
export async function getWalletOf(...a){return window.__FBS&&window.__FBS["getWalletOf"]?window.__FBS["getWalletOf"](...a):null}
export async function hapusAkunSendiri(...a){return window.__FBS&&window.__FBS["hapusAkunSendiri"]?window.__FBS["hapusAkunSendiri"](...a):null}
export async function hapusHasilMensetsu(...a){return window.__FBS&&window.__FBS["hapusHasilMensetsu"]?window.__FBS["hapusHasilMensetsu"](...a):null}
export async function hapusKategori(...a){return window.__FBS&&window.__FBS["hapusKategori"]?window.__FBS["hapusKategori"](...a):null}
export async function hapusKelas(...a){return window.__FBS&&window.__FBS["hapusKelas"]?window.__FBS["hapusKelas"](...a):null}
export async function hapusKomentar(...a){return window.__FBS&&window.__FBS["hapusKomentar"]?window.__FBS["hapusKomentar"](...a):null}
export async function hapusRangkuman(...a){return window.__FBS&&window.__FBS["hapusRangkuman"]?window.__FBS["hapusRangkuman"](...a):null}
export async function hapusSemuaHasilMensetsu(...a){return window.__FBS&&window.__FBS["hapusSemuaHasilMensetsu"]?window.__FBS["hapusSemuaHasilMensetsu"](...a):null}
export async function hapusSiswa(...a){return window.__FBS&&window.__FBS["hapusSiswa"]?window.__FBS["hapusSiswa"](...a):null}
export async function hapusSoal(...a){return window.__FBS&&window.__FBS["hapusSoal"]?window.__FBS["hapusSoal"](...a):null}
export async function isAdmin(...a){return window.__FBS&&window.__FBS["isAdmin"]?window.__FBS["isAdmin"](...a):null}
export async function isDeveloper(...a){return window.__FBS&&window.__FBS["isDeveloper"]?window.__FBS["isDeveloper"](...a):null}
export function isGuestUser(){return false}
export async function isGuru(...a){return window.__FBS&&window.__FBS["isGuru"]?window.__FBS["isGuru"](...a):null}
export async function keluar(...a){return window.__FBS&&window.__FBS["keluar"]?window.__FBS["keluar"](...a):null}
export async function leaderboard(...a){return window.__FBS&&window.__FBS["leaderboard"]?window.__FBS["leaderboard"](...a):null}
export async function leaderboardAdvanced(...a){return window.__FBS&&window.__FBS["leaderboardAdvanced"]?window.__FBS["leaderboardAdvanced"](...a):null}
export async function listActivity(...a){return window.__FBS&&window.__FBS["listActivity"]?window.__FBS["listActivity"](...a):null}
export async function listChoukai(...a){return window.__FBS&&window.__FBS["listChoukai"]?window.__FBS["listChoukai"](...a):null}
export async function listHasilJLPT(...a){return window.__FBS&&window.__FBS["listHasilJLPT"]?window.__FBS["listHasilJLPT"](...a):null}
export async function listHasilJLPTOf(...a){return window.__FBS&&window.__FBS["listHasilJLPTOf"]?window.__FBS["listHasilJLPTOf"](...a):null}
export async function listHasilMensetsu(...a){return window.__FBS&&window.__FBS["listHasilMensetsu"]?window.__FBS["listHasilMensetsu"](...a):null}
export async function listHasilMensetsuOf(...a){return window.__FBS&&window.__FBS["listHasilMensetsuOf"]?window.__FBS["listHasilMensetsuOf"](...a):null}
export async function listKategori(...a){return window.__FBS&&window.__FBS["listKategori"]?window.__FBS["listKategori"](...a):null}
export async function listKelas(...a){return window.__FBS&&window.__FBS["listKelas"]?window.__FBS["listKelas"](...a):null}
export async function listKomentar(...a){return window.__FBS&&window.__FBS["listKomentar"]?window.__FBS["listKomentar"](...a):null}
export async function listNilai(...a){return window.__FBS&&window.__FBS["listNilai"]?window.__FBS["listNilai"](...a):null}
export async function listNilaiOf(...a){return window.__FBS&&window.__FBS["listNilaiOf"]?window.__FBS["listNilaiOf"](...a):null}
export async function listPersiapanMensetsuOf(...a){return window.__FBS&&window.__FBS["listPersiapanMensetsuOf"]?window.__FBS["listPersiapanMensetsuOf"](...a):null}
export async function listSemuaAkun(...a){return window.__FBS&&window.__FBS["listSemuaAkun"]?window.__FBS["listSemuaAkun"](...a):null}
export async function listShopItems(...a){return window.__FBS&&window.__FBS["listShopItems"]?window.__FBS["listShopItems"](...a):null}
export async function listSiswa(...a){return window.__FBS&&window.__FBS["listSiswa"]?window.__FBS["listSiswa"](...a):null}
export async function listSoal(...a){return window.__FBS&&window.__FBS["listSoal"]?window.__FBS["listSoal"](...a):null}
export async function listWalletLogOf(...a){return window.__FBS&&window.__FBS["listWalletLogOf"]?window.__FBS["listWalletLogOf"](...a):null}
export async function loadKanaProgres(...a){return window.__FBS&&window.__FBS["loadKanaProgres"]?window.__FBS["loadKanaProgres"](...a):null}
export async function loadSRS(...a){return window.__FBS&&window.__FBS["loadSRS"]?window.__FBS["loadSRS"](...a):null}
export async function loadSswBidang(...a){return window.__FBS&&window.__FBS["loadSswBidang"]?window.__FBS["loadSswBidang"](...a):null}
export async function loadSswProgres(...a){return window.__FBS&&window.__FBS["loadSswProgres"]?window.__FBS["loadSswProgres"](...a):null}
export async function loadSswRank(...a){return window.__FBS&&window.__FBS["loadSswRank"]?window.__FBS["loadSswRank"](...a):null}
export async function login(...a){return window.__FBS&&window.__FBS["login"]?window.__FBS["login"](...a):null}
export async function masukTamu(...a){return window.__FBS&&window.__FBS["masukTamu"]?window.__FBS["masukTamu"](...a):null}
export async function ownedShopIds(...a){return window.__FBS&&window.__FBS["ownedShopIds"]?window.__FBS["ownedShopIds"](...a):null}
export async function publicNama(...a){return window.__FBS&&window.__FBS["publicNama"]?window.__FBS["publicNama"](...a):null}
export async function recordActivity(...a){return window.__FBS&&window.__FBS["recordActivity"]?window.__FBS["recordActivity"](...a):null}
export async function reparasiAkunSaya(...a){return window.__FBS&&window.__FBS["reparasiAkunSaya"]?window.__FBS["reparasiAkunSaya"](...a):null}
export async function resetPassword(...a){return window.__FBS&&window.__FBS["resetPassword"]?window.__FBS["resetPassword"](...a):null}
export async function resetPosOverride(...a){return window.__FBS&&window.__FBS["resetPosOverride"]?window.__FBS["resetPosOverride"](...a):null}
export async function resetSswRank(...a){return window.__FBS&&window.__FBS["resetSswRank"]?window.__FBS["resetSswRank"](...a):null}
export async function saveGachaState(...a){return window.__FBS&&window.__FBS["saveGachaState"]?window.__FBS["saveGachaState"](...a):null}
export async function saveKanaProgres(...a){return window.__FBS&&window.__FBS["saveKanaProgres"]?window.__FBS["saveKanaProgres"](...a):null}
export async function saveSRS(...a){return window.__FBS&&window.__FBS["saveSRS"]?window.__FBS["saveSRS"](...a):null}
export async function saveSswBidang(...a){return window.__FBS&&window.__FBS["saveSswBidang"]?window.__FBS["saveSswBidang"](...a):null}
export async function saveSswProgres(...a){return window.__FBS&&window.__FBS["saveSswProgres"]?window.__FBS["saveSswProgres"](...a):null}
export async function saveSswRank(...a){return window.__FBS&&window.__FBS["saveSswRank"]?window.__FBS["saveSswRank"](...a):null}
export async function setAksesJft(...a){return window.__FBS&&window.__FBS["setAksesJft"]?window.__FBS["setAksesJft"](...a):null}
export async function setAksesJftLevel(...a){return window.__FBS&&window.__FBS["setAksesJftLevel"]?window.__FBS["setAksesJftLevel"](...a):null}
export async function setAksesSsw(...a){return window.__FBS&&window.__FBS["setAksesSsw"]?window.__FBS["setAksesSsw"](...a):null}
export async function setAksesSswBidang(...a){return window.__FBS&&window.__FBS["setAksesSswBidang"]?window.__FBS["setAksesSswBidang"](...a):null}
export async function setAksesSswKelas(...a){return window.__FBS&&window.__FBS["setAksesSswKelas"]?window.__FBS["setAksesSswKelas"](...a):null}
export async function setPersiapanMensetsu(...a){return window.__FBS&&window.__FBS["setPersiapanMensetsu"]?window.__FBS["setPersiapanMensetsu"](...a):null}
export async function setPosOverride(...a){return window.__FBS&&window.__FBS["setPosOverride"]?window.__FBS["setPosOverride"](...a):null}
export async function setRole(...a){return window.__FBS&&window.__FBS["setRole"]?window.__FBS["setRole"](...a):null}
export async function setStatusSiswa(...a){return window.__FBS&&window.__FBS["setStatusSiswa"]?window.__FBS["setStatusSiswa"](...a):null}
export async function setUnlimitedCoins(...a){return window.__FBS&&window.__FBS["setUnlimitedCoins"]?window.__FBS["setUnlimitedCoins"](...a):null}
export async function simpanHasilJLPT(...a){return window.__FBS&&window.__FBS["simpanHasilJLPT"]?window.__FBS["simpanHasilJLPT"](...a):null}
export async function simpanHasilMensetsu(...a){return window.__FBS&&window.__FBS["simpanHasilMensetsu"]?window.__FBS["simpanHasilMensetsu"](...a):null}
export async function simpanKategori(...a){return window.__FBS&&window.__FBS["simpanKategori"]?window.__FBS["simpanKategori"](...a):null}
export async function simpanKelas(...a){return window.__FBS&&window.__FBS["simpanKelas"]?window.__FBS["simpanKelas"](...a):null}
export async function siswaRole(...a){return window.__FBS&&window.__FBS["siswaRole"]?window.__FBS["siswaRole"](...a):null}
export async function tambahChoukaiBatch(...a){return window.__FBS&&window.__FBS["tambahChoukaiBatch"]?window.__FBS["tambahChoukaiBatch"](...a):null}
export async function tambahKoin(...a){return window.__FBS&&window.__FBS["tambahKoin"]?window.__FBS["tambahKoin"](...a):null}
export async function tambahKomentar(...a){return window.__FBS&&window.__FBS["tambahKomentar"]?window.__FBS["tambahKomentar"](...a):null}
export async function tambahRangkuman(...a){return window.__FBS&&window.__FBS["tambahRangkuman"]?window.__FBS["tambahRangkuman"](...a):null}
export async function tambahSoalBatch(...a){return window.__FBS&&window.__FBS["tambahSoalBatch"]?window.__FBS["tambahSoalBatch"](...a):null}
export async function tambahXP(...a){return window.__FBS&&window.__FBS["tambahXP"]?window.__FBS["tambahXP"](...a):null}
export async function updateAksesSiswa(...a){return window.__FBS&&window.__FBS["updateAksesSiswa"]?window.__FBS["updateAksesSiswa"](...a):null}
export async function updateKarakter(...a){return window.__FBS&&window.__FBS["updateKarakter"]?window.__FBS["updateKarakter"](...a):null}
export async function updateKelasSiswa(...a){return window.__FBS&&window.__FBS["updateKelasSiswa"]?window.__FBS["updateKelasSiswa"](...a):null}
export async function updateMisiProgres(...a){return window.__FBS&&window.__FBS["updateMisiProgres"]?window.__FBS["updateMisiProgres"](...a):null}
export async function updateSiswaPermissions(...a){return window.__FBS&&window.__FBS["updateSiswaPermissions"]?window.__FBS["updateSiswaPermissions"](...a):null}
export async function walletError(...a){return window.__FBS&&window.__FBS["walletError"]?window.__FBS["walletError"](...a):null}
export let BRAND_NAME=null;
export let lastAuthDenied=null;
export let lastSiswaDocError=null;
export let lastSiswaDocStatus=null;

export function onAuth(cb){setTimeout(()=>cb(ME,SISWA),30)}
export function userIsGuru(){return false}
export function userIsAdmin(){return false}
export function userIsDeveloper(){return false}
export function hasUnlimitedCoins(){return false}
export function hasFullAccess(){return false}
export function getCurrentUser(){return ME}
export async function getGami(){return GAMI}
export async function listRangkuman(){return []}
export async function getGachaState(){return null}
export async function getPosOverride(){return {}}
export async function getWalletKoin(){return 1840}

export function getLastSiswaDocStatus(){return "ok"}
