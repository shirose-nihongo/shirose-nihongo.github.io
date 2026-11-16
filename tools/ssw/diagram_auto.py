# -*- coding: utf-8 -*-
"""Diagram skematis Auto Maintenance (orisinal Shirose). Jalankan: python3 tools/ssw/diagram_auto.py"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from diagram_lib import *

D = []

# 1 ---------------------------------------------------------------- Mesin: piston & katup
d = Dia("mesin", "Mesin: piston, silinder, dan katup", "エンジンの中（ピストンとバルブ）",
        "Potongan skematis satu silinder mesin bensin 4 langkah. Ketuk bagian untuk melihat nama Jepang dan fungsinya.",
        bg=R(138, 88, 124, 118, 0, "bg"))
d.part("シリンダーヘッド", "Penutup bagian atas silinder; tempat katup, busi, dan lubang hisap/buang.", R(136, 40, 128, 48, 4))
d.part("カムシャフト", "Poros bubungan: menekan katup agar membuka tepat waktu.", C(168, 26, 11), C(232, 26, 11), L(168, 26, 232, 26, "t"))
d.part("スパークプラグ", "Memercikkan api untuk membakar campuran udara dan bahan bakar.", R(196, 4, 8, 34, 2), R(192, 36, 16, 10, 2), L(200, 46, 200, 70, "t"))
d.part("インテーク・バルブ", "Katup hisap: membuka agar udara dan bahan bakar masuk ke ruang bakar.", L(172, 50, 172, 92, "t"), R(160, 90, 24, 6, 2))
d.part("エキゾースト・バルブ", "Katup buang: membuka agar gas hasil pembakaran keluar.", L(228, 50, 228, 92, "t"), R(216, 90, 24, 6, 2))
d.part("燃焼室", "Ruang tempat campuran dibakar sehingga menghasilkan tenaga.", R(150, 98, 100, 22, 3, fill="#ffd9d0"))
d.part("シリンダー", "Tabung tempat piston bergerak naik-turun.", R(138, 98, 12, 108, 2), R(250, 98, 12, 108, 2))
d.part("ピストン", "Terdorong tekanan pembakaran, lalu menggerakkan poros engkol lewat batang penghubung.", R(152, 128, 96, 30, 4))
d.part("ピストンリング", "Ring penyekat: mencegah gas bocor dan mengatur lapisan oli di dinding silinder.", R(152, 132, 96, 4, 1), R(152, 140, 96, 4, 1), R(152, 148, 96, 4, 1))
d.part("コンロッド", "Batang penghubung: meneruskan gerak naik-turun piston ke poros engkol.", POLY([(193, 158), (207, 158), (212, 222), (188, 222)]))
d.part("クランクシャフト", "Poros engkol: mengubah gerak naik-turun piston menjadi gerak putar.", C(200, 240, 24), R(168, 236, 30, 8, 2))
D.append(d)

# 2 ---------------------------------------------------------------- Pendinginan
d = Dia("pendingin", "Sistem pendingin mesin", "冷却装置",
        "Cairan pendingin mengalir dari mesin ke radiator lewat selang, lalu kembali ke mesin.",
        bg=R(20, 232, 360, 4, 0, "bg"))
d.part("エンジン", "Sumber panas yang perlu didinginkan.", R(30, 96, 112, 100, 8))
d.part("ウォーターポンプ", "Pompa air: mengalirkan cairan pendingin ke seluruh sistem.", C(118, 176, 16), C(118, 176, 6, "t"))
d.part("サーモスタット", "Katup pengatur suhu: menutup saat mesin dingin, membuka saat sudah panas.", R(108, 78, 30, 16, 3))
d.part("アッパー・ホース", "Selang atas: mengalirkan cairan panas dari mesin ke radiator.", P("M138,86 C190,70 220,70 276,82", "s"))
d.part("ロア・ホース", "Selang bawah: mengalirkan cairan yang sudah dingin dari radiator kembali ke mesin.", P("M276,188 C220,210 180,208 142,186", "s"))
d.part("冷却ファン", "Kipas: meniupkan udara melewati radiator agar lebih cepat dingin.", C(238, 135, 26, "t"), L(238, 109, 238, 161, "s"), L(212, 135, 264, 135, "s"))
d.part("ラジエーター", "Radiator: melepaskan panas cairan pendingin ke udara.", R(280, 66, 56, 140, 6), L(292, 78, 292, 194, "t"), L(308, 78, 308, 194, "t"), L(324, 78, 324, 194, "t"))
d.part("リザーバータンク", "Tangki cadangan: menampung cairan pendingin yang memuai dan menambah saat berkurang.", R(350, 40, 38, 56, 5), L(342, 100, 350, 90, "t"))
D.append(d)

# 3 ---------------------------------------------------------------- Pelumasan
d = Dia("pelumasan", "Sistem pelumasan mesin", "潤滑装置",
        "Oli diambil dari karter, disaring, lalu dialirkan ke bagian mesin yang bergesekan.",
        bg=R(100, 56, 190, 150, 8, "bg"))
d.part("フィラー・キャップ", "Tutup lubang pengisian oli di atas mesin.", R(180, 36, 40, 14, 3))
d.part("レベル・ゲージ", "Batang celup: mengecek jumlah dan kondisi oli.", L(120, 52, 120, 218, "t"), C(120, 44, 8, "t"))
d.part("オイルフィルター", "Menyaring kotoran dan serpihan logam dari oli.", R(298, 108, 44, 70, 8), L(298, 120, 342, 120, "t"))
d.part("オイルポンプ", "Pompa oli: menekan oli ke bagian-bagian mesin.", C(200, 170, 18), C(200, 170, 6, "t"))
d.part("オイルパン", "Karter: wadah penampung oli di bagian bawah mesin.", P("M110,206 L290,206 L268,246 L132,246 Z"))
d.part("エンジン・オイル", "Pelumas: mengurangi gesekan, mendinginkan, dan membersihkan bagian dalam mesin.", R(138, 222, 124, 18, 3, fill="#ffe08a"))
d.part("ドレーンボルト", "Baut pembuang: dilepas untuk menguras oli bekas.", hexa(200, 253, 9))
D.append(d)

# 4 ---------------------------------------------------------------- Hidrolik rem
d = Dia("rem-hidrolik", "Sistem rem hidrolik", "ブレーキの油圧の流れ",
        "Injakan pedal diubah menjadi tekanan minyak rem yang dikirim ke tiap roda.")
d.part("ブレーキ・ペダル", "Diinjak pengemudi untuk memperlambat kendaraan.", POLY([(28, 150), (46, 150), (60, 230), (42, 230)]), L(54, 150, 92, 145, "s"))
d.part("マスター・シリンダ", "Mengubah tenaga injakan menjadi tekanan minyak rem.", R(92, 130, 80, 32, 6))
d.part("ブレーキ・リザーバ・タンク", "Tangki penampung minyak rem.", R(108, 98, 46, 32, 4), L(120, 98, 120, 130, "t"))
d.part("ブレーキ・パイプ", "Pipa logam yang menyalurkan minyak rem bertekanan.", L(172, 146, 296, 146, "s"), L(250, 146, 250, 218, "s"))
d.part("ブレーキ・ホース", "Selang fleksibel di dekat roda (mengikuti gerak suspensi).", P("M296,146 C320,146 322,176 336,186", "s"))
d.part("ブレーキ・ディスク", "Cakram yang berputar bersama roda dan dijepit pad.", C(352, 214, 38), C(352, 214, 12, "t"))
d.part("ブレーキ・ディスク・キャリパ", "Kaliper: rumah piston yang menjepitkan pad ke cakram.", R(330, 170, 44, 22, 6))
D.append(d)

# 5 ---------------------------------------------------------------- Rem cakram
d = Dia("rem-cakram", "Rem cakram (tampak samping roda)", "ディスクブレーキ",
        "Pad dijepitkan ke cakram yang berputar sehingga roda melambat.")
d.part("ブレーキ・ディスク", "Cakram besi yang ikut berputar bersama roda.", C(150, 135, 100), C(150, 135, 24, "t"))
d.part("ホイール・ナット", "Mur pengikat roda ke hub.", *[C(round(150 + 13 * math.cos(math.radians(a)), 1), round(135 + 13 * math.sin(math.radians(a)), 1), 4) for a in (45, 135, 225, 315)])
d.part("ブレーキ・ディスク・キャリパ", "Kaliper menjepit cakram dari kedua sisi dengan tekanan minyak.", P("M226,82 Q262,82 262,118 L262,152 Q262,188 226,188 L226,166 Q240,166 240,152 L240,118 Q240,104 226,104 Z"))
d.part("ブレーキ・パッド", "Kampas rem cakram: bergesekan dengan cakram untuk menahan putaran.", R(222, 108, 6, 54, 1, fill="#e6c7a1"), R(236, 108, 6, 54, 1, fill="#e6c7a1"))
d.part("ブレーキ・ホース", "Selang yang menyalurkan minyak rem ke kaliper.", P("M262,135 C300,135 320,100 372,96", "s"))
D.append(d)

# 6 ---------------------------------------------------------------- Rem tromol
d = Dia("rem-tromol", "Rem tromol", "ドラムブレーキ",
        "Sepatu rem mengembang menekan bagian dalam tromol yang ikut berputar bersama roda.")
d.part("ブレーキ・ドラム", "Tromol: drum berputar bersama roda; sepatu menekan dinding dalamnya.", C(200, 135, 110, c="f", fill="#d9deef"))
d.part("ブレーキ・シュー", "Sepatu rem (kampas rem tromol): menekan dinding dalam tromol.", P("M122,150 A82,82 0 0 1 180,60 L182,78 A66,66 0 0 0 138,150 Z", fill="#e6c7a1"), P("M278,150 A82,82 0 0 0 220,60 L218,78 A66,66 0 0 1 262,150 Z", fill="#e6c7a1"))
d.part("ブレーキ・ホイール・シリンダ", "Silinder roda: piston di dalamnya mendorong kedua sepatu keluar.", R(176, 64, 48, 18, 5))
D.append(d)

# 7 ---------------------------------------------------------------- Penerus tenaga FR
d = Dia("penerus", "Penerus tenaga (mesin depan, penggerak belakang)", "動力伝達装置（FR）",
        "Tenaga mesin diteruskan ke roda belakang lewat kopling, transmisi, poros propeller, dan diferensial (tampak atas).",
        bg=R(20, 60, 360, 150, 14, "bg"))
d.part("エンジン", "Menghasilkan tenaga putar.", R(32, 100, 76, 60, 6))
d.part("クラッチ", "Kopling: menyambung dan memutus tenaga dari mesin ke transmisi.", R(110, 104, 16, 52, 3))
d.part("トランスミッション", "Transmisi: mengubah perbandingan gigi sesuai kecepatan dan beban.", R(128, 100, 56, 60, 5))
d.part("プロペラシャフト", "Poros propeller: menyalurkan putaran ke bagian belakang.", R(186, 126, 100, 8, 3))
d.part("ユニバーサルジョイント", "Sambungan universal: memungkinkan poros tetap berputar walau sudutnya berubah.", C(186, 130, 8), C(288, 130, 8))
d.part("ディファレンシャル", "Diferensial: membagi tenaga ke roda kiri-kanan dan memungkinkan beda putaran saat belok.", C(318, 130, 20), C(318, 130, 7, "t"))
d.part("ドライブ・シャフト", "Poros penggerak: menyalurkan tenaga dari diferensial ke roda.", L(318, 110, 318, 76, "s"), L(318, 150, 318, 184, "s"))
d.part("タイヤ", "Ban: satu-satunya bagian yang menyentuh jalan.", R(300, 40, 36, 32, 6), R(300, 188, 36, 32, 6))
D.append(d)

# 8 ---------------------------------------------------------------- Kelistrikan
d = Dia("listrik", "Sistem kelistrikan mesin", "電装品",
        "Aki menyuplai listrik; alternator mengisi ulang; ECU mengatur pengapian dan injeksi.",
        bg=R(190, 110, 170, 110, 8, "bg"))
d.part("バッテリー", "Aki: menyimpan listrik untuk menghidupkan mesin dan perlengkapan.", R(30, 120, 80, 50, 4), R(40, 110, 12, 10, 1), R(88, 110, 12, 10, 1))
d.part("スターターモーター", "Motor starter: memutar mesin saat dihidupkan.", R(132, 150, 54, 28, 8))
d.part("オルタネーター", "Alternator: membangkitkan listrik dan mengisi aki saat mesin hidup.", C(238, 100, 24), C(238, 100, 9, "t"))
d.part("ECU", "Unit kontrol elektronik: otak yang mengatur pengapian, injeksi bahan bakar, dan sensor.", R(150, 20, 82, 38, 5))
d.part("ワイヤーハーネス", "Rangkaian kabel: menghubungkan semua komponen listrik.", P("M110,145 L128,145 L128,164 L132,164", "s"), P("M110,135 L130,135 L130,70 L214,70 L214,60", "s"), P("M262,100 L300,100 L300,70 L330,70", "s"))
d.part("イグニッションコイル", "Koil pengapian: menaikkan tegangan listrik untuk memercikkan busi.", R(324, 34, 30, 44, 5))
d.part("スパークプラグ", "Busi: memercikkan api di dalam ruang bakar.", L(339, 78, 339, 128, "t"), R(332, 128, 14, 34, 3))
D.append(d)

# 9 ---------------------------------------------------------------- Ruang mesin (tampak atas)
d = Dia("ruang-mesin", "Isi ruang mesin (tampak atas)", "エンジンルームの中",
        "Bagian-bagian yang sering dicek saat pemeriksaan harian: cairan, aki, saringan udara, dan sabuk.",
        bg=R(40, 12, 320, 246, 16, "bg"))
d.part("エンジン", "Mesin utama.", R(132, 80, 128, 104, 8))
d.part("フィラー・キャップ", "Tutup pengisian oli mesin.", C(230, 106, 12), C(230, 106, 4, "t"))
d.part("レベル・ゲージ", "Batang celup untuk mengecek oli mesin.", L(158, 62, 158, 100, "t"), C(158, 56, 7, "t"))
d.part("エア・クリーナー・ボックス", "Kotak saringan udara: menyaring udara sebelum masuk mesin.", R(276, 90, 70, 56, 6))
d.part("バッテリ", "Aki.", R(58, 24, 64, 38, 4))
d.part("ブレーキ・リザーバ・タンク", "Tangki minyak rem.", R(296, 28, 34, 34, 4))
d.part("ラジエータ・リザーバ・タンク", "Tangki cadangan cairan pendingin.", R(58, 96, 40, 40, 5))
d.part("ウィンド・ウォッシャ液のリザーバ・タンク", "Tangki cairan penyemprot kaca.", R(58, 160, 48, 66, 6))
d.part("ファン・ベルト", "Sabuk kipas: memutar alternator dan pompa air dari poros engkol.", R(150, 196, 102, 30, 15, c="s"))
d.part("オルタネータ", "Alternator (pembangkit listrik).", C(168, 211, 10))
D.append(d)

# 10 --------------------------------------------------------------- Suspensi depan
d = Dia("suspensi", "Suspensi dan roda depan (tampak depan)", "フロント・サスペンション",
        "Pegas dan peredam kejut meredam guncangan; lengan bawah dan knuckle menahan roda.")
d.part("ショック・アブソーバー", "Peredam kejut: meredam ayunan pegas agar kendaraan stabil.", R(180, 30, 18, 112, 4, ), L(189, 12, 189, 32, "s"))
d.part("コイル・スプリング", "Pegas keong: menahan beban dan menyerap benturan jalan.", P(zig(168, 210, 48, 122, 6), "t"))
d.part("ナックル", "Knuckle: penyangga roda; titik sambung strut, lengan bawah, dan tie rod.", R(176, 142, 26, 50, 4))
d.part("ロア・アーム", "Lengan bawah: menghubungkan roda ke rangka dan menahan gaya samping.", POLY([(60, 188), (180, 176), (180, 196), (60, 214)]))
d.part("タイロッド", "Tie rod: meneruskan gerakan setir untuk membelokkan roda.", L(70, 160, 176, 160, "s"))
d.part("ブレーキ・ディスク", "Cakram rem (tampak samping).", R(212, 150, 8, 72, 2))
d.part("ホイール", "Pelek: tempat ban terpasang.", R(228, 124, 40, 116, 6))
d.part("タイヤ", "Ban.", R(272, 100, 56, 160, 16))
D.append(d)

# 11 --------------------------------------------------------------- Kabin pengemudi
d = Dia("kabin", "Kabin pengemudi", "運転席まわり",
        "Alat kendali yang dipakai pengemudi (setir kiri/kanan sama bentuk dasarnya).",
        bg=R(10, 10, 380, 70, 10, "bg"))
d.part("メーター", "Panel instrumen: menampilkan kecepatan, putaran mesin, bahan bakar, dan lampu peringatan.", R(78, 26, 90, 40, 8), C(100, 46, 12, "t"), C(146, 46, 12, "t"))
d.part("ハンドル", "Setir: mengarahkan kendaraan.", C(123, 122, 52, "s"), L(123, 70, 123, 174, "t"), L(71, 122, 175, 122, "t"))
d.part("ホーン", "Klakson: di tengah setir; memberi peringatan.", C(123, 122, 17))
d.part("ウィンカー・レバー", "Tuas lampu sein (juga lampu utama/wiper pada sebagian mobil).", R(52, 112, 22, 8, 3))
d.part("ハザード・スイッチ", "Tombol lampu hazard: menyalakan semua lampu sein bersamaan.", POLY([(248, 42), (266, 42), (257, 60)]), L(240, 70, 274, 70, "t"))
d.part("シフト・レバー", "Tuas persneling: memilih gigi transmisi.", L(262, 190, 262, 130, "s"), C(262, 124, 9))
d.part("パーキング・ブレーキ", "Rem parkir: menahan mobil saat berhenti/parkir.", L(306, 214, 322, 160, "s"), R(314, 150, 20, 10, 3))
d.part("クラッチ・ペダル", "Pedal kopling (mobil manual): memutus tenaga mesin ke transmisi.", R(72, 218, 30, 38, 5))
d.part("ブレーキ・ペダル", "Pedal rem.", R(112, 218, 34, 38, 5))
d.part("アクセル・ペダル", "Pedal gas: mengatur tenaga mesin.", POLY([(172, 256), (194, 256), (198, 214), (180, 214)]))
D.append(d)

# 12 --------------------------------------------------------------- Papan perkakas
def tool(i, j):
    return 12 + j * 96, 12 + i * 84
d = Dia("perkakas", "Perkakas dasar bengkel", "基本工具",
        "Perkakas yang paling sering dipakai pembelajar baru. Gambar skematis (bukan skala).")
cells = []
# tiap sel: kotak 88x74, ikon digambar relatif
def cell(i, j): x, y = 8 + j * 96, 8 + i * 84; return x, y
spec = [
 ("スパナ", "Kunci pas: mengencangkan/mengendurkan mur dan baut dengan satu ujung terbuka.",
  lambda x, y: [R(x + 10, y + 34, 56, 8, 3), P(f"M{x+60},{y+22} h14 v12 h-6 v8 h6 v12 h-14 Z")]),
 ("モンキーレンチ", "Kunci inggris: rahangnya bisa disetel mengikuti ukuran mur.",
  lambda x, y: [R(x + 14, y + 36, 48, 8, 3), R(x + 56, y + 18, 18, 30, 3), R(x + 66, y + 22, 8, 12, 1, fill="#fff")]),
 ("眼鏡レンチ", "Kunci ring: kedua ujungnya berbentuk cincin; cengkeraman kuat.",
  lambda x, y: [R(x + 22, y + 36, 40, 6, 3), C(x + 14, y + 39, 12), C(x + 14, y + 39, 5, "t"), C(x + 70, y + 39, 12), C(x + 70, y + 39, 5, "t")]),
 ("ラチェット・ハンドル", "Tangkai ratchet: mengencangkan baut tanpa melepas socket tiap putaran.",
  lambda x, y: [R(x + 28, y + 36, 52, 8, 3), C(x + 20, y + 40, 15), R(x + 14, y + 34, 12, 12, 1, fill="#fff")]),
 ("プラス・ドライバ", "Obeng plus (+): untuk sekrup berkepala bentuk silang.",
  lambda x, y: [R(x + 8, y + 30, 26, 18, 6), L(x + 34, y + 39, x + 70, y + 39, "s"), L(x + 70, y + 32, x + 70, y + 46, "t"), L(x + 63, y + 39, x + 77, y + 39, "t")]),
 ("マイナス・ドライバ", "Obeng minus (−): untuk sekrup berkepala alur lurus.",
  lambda x, y: [R(x + 8, y + 30, 26, 18, 6), L(x + 34, y + 39, x + 68, y + 39, "s"), POLY([(x + 68, y + 31), (x + 78, y + 31), (x + 78, y + 47), (x + 68, y + 47)])]),
 ("ハンマ", "Palu: memukul, memasang, atau melepas bagian yang macet.",
  lambda x, y: [R(x + 40, y + 22, 8, 46, 2), R(x + 20, y + 14, 48, 18, 3)]),
 ("ペンチ", "Tang: memegang, menekuk, atau memotong kawat.",
  lambda x, y: [L(x + 10, y + 64, x + 40, y + 34, "s"), L(x + 10, y + 14, x + 40, y + 44, "s"), POLY([(x + 38, y + 28), (x + 76, y + 34), (x + 76, y + 44), (x + 38, y + 50)])]),
 ("ニッパ", "Tang pemotong (nipper): memotong kawat dan kabel kecil.",
  lambda x, y: [L(x + 10, y + 62, x + 44, y + 38, "s"), L(x + 10, y + 16, x + 44, y + 40, "s"), POLY([(x + 42, y + 30), (x + 66, y + 38), (x + 66, y + 42), (x + 42, y + 50)])]),
 ("ノギス", "Jangka sorong: mengukur panjang, diameter dalam/luar, dan kedalaman.",
  lambda x, y: [R(x + 6, y + 34, 76, 10, 1), R(x + 6, y + 18, 8, 26, 1), R(x + 30, y + 26, 10, 26, 1), *[L(x + 46 + k * 6, y + 34, x + 46 + k * 6, y + 38, "t") for k in range(6)]]),
 ("マイクロメータ", "Mikrometer: mengukur ketebalan/diameter kecil dengan ketelitian tinggi.",
  lambda x, y: [P(f"M{x+14},{y+56} L{x+14},{y+26} Q{x+14},{y+14} {x+28},{y+14} L{x+42},{y+14}", "s"), R(x + 36, y + 24, 36, 10, 2), R(x + 70, y + 20, 12, 18, 3)]),
 ("ジャッキ", "Dongkrak: mengangkat kendaraan sementara untuk dikerjakan bagian bawahnya.",
  lambda x, y: [POLY([(x + 44, y + 12), (x + 70, y + 38), (x + 44, y + 64), (x + 18, y + 38)]), R(x + 12, y + 62, 64, 7, 2), R(x + 36, y + 6, 16, 7, 2)]),
]
for n, (kata, fg, fn) in enumerate(spec):
    i, j = divmod(n, 4)
    x, y = cell(i, j)
    d.bg += R(x - 2, y - 2, 92, 80, 8, "bg")
    d.part(kata, fg, *fn(x, y))
D.append(d)

if __name__ == "__main__":
    print(build("auto-maintenance", "am", D, "Diagram komponen", {
        "title": "Flashcard Gambar Komponen", "jp": "部品の絵カード",
        "desc": "Gambar skematis komponen mobil tampil di depan — tebak nama Jepangnya. Ketuk kartu untuk membalik."}))
