# -*- coding: utf-8 -*-
"""Diagram skematis Industrial Manufacturing + Mesin & Logam (orisinal Shirose). Jalankan: python3 tools/ssw/diagram_ind.py"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from diagram_lib import *

A = []   # industrial-mfg
M = []   # mfg-machine-metal

# ---- APD
d = Dia("apd", "Alat pelindung diri (APD)", "保護具", "Pakaian dan perlengkapan wajib sesuai pekerjaan. Ketuk bagian untuk melihat namanya.",
        bg=R(168, 98, 64, 96, 10, "bg") + L(168, 112, 138, 190, "bgl") + L(232, 112, 262, 190, "bgl") + R(176, 194, 22, 52, 4, "bg") + R(202, 194, 22, 52, 4, "bg") + C(200, 70, 26, "bg"))
d.part("ヘルメット", "Melindungi kepala dari benda jatuh dan benturan.", P("M170,68 A30,30 0 0 1 230,68 Z"), R(162, 66, 76, 8, 3))
d.part("保護めがね", "Melindungi mata dari serpihan, percikan, dan debu.", R(180, 76, 40, 11, 5, fill="#cfe9ff"))
d.part("耳栓", "Mengurangi kebisingan mesin agar pendengaran terjaga.", C(172, 82, 5), C(228, 82, 5))
d.part("防じんマスク", "Menyaring debu dan serbuk logam agar tidak terhirup.", P("M184,90 Q200,112 216,90 L214,100 Q200,114 186,100 Z"))
d.part("手袋", "Melindungi tangan dari panas, goresan, dan bahan kimia (jangan dipakai dekat bagian berputar).", C(138, 194, 11), C(262, 194, 11))
d.part("安全靴", "Sepatu keselamatan: ujung keras melindungi kaki dari benda berat dan tertusuk.", P("M174,244 L198,244 L198,262 L166,262 Q166,248 174,244 Z"), P("M226,244 L202,244 L202,262 L234,262 Q234,248 226,244 Z"))
A.append(d)

# ---- Alat ukur
d = Dia("alat-ukur", "Alat ukur dasar", "測定器具", "Alat yang dipakai untuk mengukur dan memeriksa dimensi produk.")
cells = [(8, 8), (140, 8), (272, 8), (8, 140), (140, 140)]
for x, y in cells:
    d.bg += R(x, y, 120, 120, 10, "bg")
x, y = cells[0]
d.part("ノギス", "Jangka sorong: ukuran luar, dalam, dan kedalaman (ketelitian 0,05 mm).", R(x + 8, y + 62, 104, 14, 1), R(x + 8, y + 26, 10, 50, 1), R(x + 44, y + 44, 14, 44, 1), *[L(x + 64 + k * 7, y + 62, x + 64 + k * 7, y + 68, "t") for k in range(6)])
x, y = cells[1]
d.part("マイクロメータ", "Mikrometer: ukuran sangat kecil (ketelitian 0,01 mm).", P(f"M{x+22},{y+104} L{x+22},{y+54} Q{x+22},{y+30} {x+46},{y+30} L{x+70},{y+30}", "s"), R(x + 62, y + 50, 44, 14, 3), R(x + 94, y + 44, 18, 26, 4))
x, y = cells[2]
d.part("ダイヤルゲージ", "Dial gauge: membaca selisih ukuran/kerataan lewat jarum.", C(x + 60, y + 52, 34), C(x + 60, y + 52, 3, "t"), L(x + 60, y + 52, x + 78, y + 36, "t"), L(x + 60, y + 86, x + 60, y + 108, "s"))
x, y = cells[3]
d.part("直尺", "Penggaris baja: mengukur panjang secara kasar dan memeriksa kelurusan.", R(x + 8, y + 46, 104, 28, 2), *[L(x + 16 + k * 8, y + 46, x + 16 + k * 8, y + (60 if k % 5 == 0 else 54), "t") for k in range(12)])
x, y = cells[4]
d.part("限界ゲージ", "Gauge go/no-go: memeriksa cepat apakah ukuran masuk toleransi.", R(x + 12, y + 56, 40, 14, 3), R(x + 52, y + 60, 54, 6, 2), R(x + 76, y + 40, 28, 14, 3, fill="#ffd9d0"))
A.append(d)

# ---- Jangka sorong
d = Dia("jangka-sorong", "Bagian-bagian jangka sorong", "ノギスの各部", "Bagian jangka sorong yang perlu dikenali sebelum membaca ukuran.")
d.part("本尺", "Skala utama (dalam mm) pada batang tetap.", R(30, 120, 340, 30, 2), *[L(40 + k * 13, 120, 40 + k * 13, 120 + (18 if k % 5 == 0 else 10), "t") for k in range(25)],
       extra=("ほんじゃく", "honjaku", "skala utama (jangka sorong)", "bab3", ["b3s1"]))
d.part("副尺", "Skala nonius: memberi ketelitian 0,05 mm pada angka di skala utama.", R(130, 100, 90, 20, 2), *[L(138 + k * 8, 100, 138 + k * 8, 108, "t") for k in range(10)],
       extra=("ふくしゃく", "fukushaku", "skala nonius (jangka sorong)", "bab3", ["b3s1"]))
d.part("外側用ジョウ", "Rahang luar: menjepit benda untuk mengukur diameter/tebal luar.", R(30, 60, 14, 64, 2), R(138, 76, 14, 48, 2),
       extra=("そとがわようジョウ", "sotogawa-you jou", "rahang luar (jangka sorong)", "bab3", ["b3s1"]))
d.part("内側用ジョウ", "Rahang dalam: mengukur diameter lubang atau lebar alur.", R(30, 28, 14, 36, 2), R(150, 28, 10, 50, 2),
       extra=("うちがわようジョウ", "uchigawa-you jou", "rahang dalam (jangka sorong)", "bab3", ["b3s1"]))
d.part("デプスバー", "Batang kedalaman: mengukur kedalaman lubang atau tingkat.", R(224, 130, 150, 6, 2), R(364, 128, 8, 24, 1),
       extra=("デプスバー", "depusu baa", "batang pengukur kedalaman", "bab3", ["b3s1"]))
d.part("目盛り", "Garis-garis skala yang dibaca untuk mendapat hasil ukur.", R(46, 176, 300, 26, 3), *[L(54 + k * 10, 176, 54 + k * 10, 188, "t") for k in range(29)])
A.append(d)

# ---- Mesin & proses
def cellm(i, j): return 6 + j * 98, 8 + i * 128
d = Dia("proses", "Mesin perkakas dan proses pengerjaan", "工作機械と加工方法", "Delapan mesin/proses dasar di pabrik logam (gambar skematis).")
specs = [
 ("旋盤", "Mesin bubut: benda diputar, pahat bergerak memotong — untuk bentuk silinder.",
  lambda x, y: [R(x + 6, y + 70, 80, 10, 2), R(x + 6, y + 42, 22, 30, 2), R(x + 28, y + 52, 40, 8, 1), R(x + 66, y + 44, 20, 28, 2)]),
 ("フライス盤", "Mesin frais: alat potong berputar memotong benda yang bergerak di meja — untuk permukaan datar/alur.",
  lambda x, y: [R(x + 8, y + 10, 18, 80, 2), R(x + 8, y + 10, 60, 16, 2), L(x + 52, y + 26, x + 52, y + 54, "s"), R(x + 30, y + 66, 56, 10, 2)]),
 ("ボール盤", "Mesin bor: mata bor berputar membuat lubang.",
  lambda x, y: [R(x + 14, y + 8, 14, 82, 2), R(x + 14, y + 8, 50, 22, 3), L(x + 56, y + 30, x + 56, y + 60, "s"), R(x + 30, y + 70, 56, 10, 2)]),
 ("研削", "Penggerindaan: batu gerinda berputar menghaluskan atau mengikis dengan presisi tinggi.",
  lambda x, y: [C(x + 44, y + 44, 30), C(x + 44, y + 44, 6, "t"), R(x + 24, y + 78, 40, 10, 2)]),
 ("プレス加工", "Pengerjaan press: pelat ditekan dengan cetakan menjadi bentuk tertentu.",
  lambda x, y: [R(x + 20, y + 6, 48, 26, 3), R(x + 36, y + 32, 16, 20, 1), R(x + 14, y + 52, 60, 12, 2), R(x + 8, y + 70, 72, 16, 3)]),
 ("溶接", "Pengelasan: menyambung logam dengan panas (busur listrik/gas).",
  lambda x, y: [L(x + 14, y + 20, x + 46, y + 52, "s"), POLY([(x + 46, y + 44), (x + 56, y + 48), (x + 48, y + 58), (x + 60, y + 60), (x + 46, y + 68), (x + 40, y + 56)], fill="#ffd56b"), R(x + 8, y + 72, 74, 12, 2)]),
 ("鋳造", "Pengecoran: logam cair dituang ke cetakan lalu dibiarkan membeku.",
  lambda x, y: [P(f"M{x+8},{y+60} L{x+80},{y+60} L{x+70},{y+86} L{x+18},{y+86} Z"), P(f"M{x+16},{y+14} L{x+52},{y+14} L{x+44},{y+36} L{x+24},{y+36} Z"), L(x + 50, y + 36, x + 50, y + 58, "t", stroke_dasharray="3 3")]),
 ("鍛造", "Penempaan: logam dipukul/ditekan hingga berbentuk dan menjadi lebih kuat.",
  lambda x, y: [R(x + 10, y + 70, 70, 16, 3), R(x + 24, y + 54, 42, 16, 2), R(x + 30, y + 10, 30, 22, 3), R(x + 42, y + 32, 6, 22, 1)]),
]
for n, (kata, fg, fn) in enumerate(specs):
    i, j = divmod(n, 4)
    x, y = cellm(i, j)
    d.bg += R(x - 2, y - 2, 94, 100, 8, "bg")
    d.part(kata, fg, *fn(x, y))
A.append(d)

# ================= Mesin & Logam
d = Dia("bubut", "Bagian-bagian mesin bubut", "旋盤の各部", "Benda dijepit chuck dan diputar; pahat pada dudukan pahat bergerak memotongnya.",
        bg=R(130, 132, 124, 16, 4, "bg"))
d.part("ベッド", "Alas/rel mesin: menopang semua bagian dan menjadi jalur gerak kereta.", R(24, 176, 352, 28, 3),
       extra=("ベッド", "beddo", "alas mesin (bed)", "bab1", ["b1s1"]))
d.part("主軸台", "Kepala tetap: berisi poros utama yang memutar benda kerja.", R(24, 92, 92, 86, 5),
       extra=("しゅじくだい", "shujikudai", "kepala tetap mesin bubut", "bab1", ["b1s1"]))
d.part("チャック", "Chuck: penjepit benda kerja pada poros utama.", R(118, 104, 16, 58, 3), R(134, 108, 10, 12, 1), R(134, 146, 10, 12, 1))
d.part("往復台", "Kereta: bergerak sepanjang bed membawa pahat.", R(176, 160, 84, 18, 3),
       extra=("おうふくだい", "oufukudai", "kereta mesin bubut (carriage)", "bab1", ["b1s1"]))
d.part("刃物台", "Dudukan pahat: menjepit dan mengatur posisi pahat.", R(196, 134, 36, 26, 3),
       extra=("かたなだい", "katanadai", "dudukan pahat (tool post)", "bab1", ["b1s1"]))
d.part("バイト", "Pahat bubut: mata potong yang mengikis benda kerja.", POLY([(172, 144), (196, 142), (196, 150), (176, 152)]))
d.part("心押台", "Kepala lepas: menahan ujung benda kerja panjang agar tidak bergetar.", R(296, 104, 64, 72, 4),
       extra=("しんおしだい", "shinoshidai", "kepala lepas (tailstock)", "bab1", ["b1s1"]))
M.append(d)

d = Dia("frais", "Bagian-bagian mesin frais", "フライス盤の各部", "Alat potong berputar; benda dijepit di ragum pada meja yang bergerak.")
d.part("コラム", "Tiang mesin: menopang kepala dan menjadi jalur gerak vertikal.", R(34, 24, 62, 222, 4),
       extra=("コラム", "koramu", "tiang mesin (column)", "bab1", ["b1s1"]))
d.part("主軸", "Spindle: poros yang memutar alat potong.", R(96, 38, 150, 30, 4), R(160, 68, 22, 28, 2),
       extra=("しゅじく", "shujiku", "poros utama (spindle)", "bab1", ["b1s1"]))
d.part("エンドミル", "End mill: alat potong untuk membuat alur, tingkat, dan kontur.", R(164, 96, 14, 50, 2), L(160, 146, 182, 146, "t"))
d.part("バイス", "Ragum: menjepit benda kerja pada meja.", R(142, 176, 62, 28, 3), R(142, 160, 14, 16, 1), R(190, 160, 14, 16, 1))
d.part("テーブル", "Meja kerja: menggerakkan benda ke kiri-kanan dan depan-belakang.", R(96, 206, 210, 20, 3),
       extra=("テーブル", "teeburu", "meja kerja mesin", "bab1", ["b1s1"]))
M.append(d)

d = Dia("bor", "Bagian-bagian mesin bor", "ボール盤の各部", "Mata bor berputar dan turun menembus benda yang dijepit di meja.")
d.part("コラム", "Tiang mesin.", R(40, 24, 34, 206, 3))
d.part("主軸", "Poros yang memutar mata bor.", R(40, 26, 140, 40, 5))
d.part("チャック", "Penjepit mata bor.", R(142, 66, 28, 20, 3))
d.part("ドリル", "Mata bor: membuat lubang pada benda kerja.", POLY([(150, 86), (162, 86), (156, 136)]))
d.part("バイス", "Ragum: menjepit benda agar tidak ikut berputar (berbahaya jika dipegang tangan).", R(120, 168, 70, 26, 3))
d.part("テーブル", "Meja tempat benda kerja.", R(80, 194, 150, 14, 3))
M.append(d)

d = Dia("las", "Pengelasan busur dan keselamatannya", "アーク溶接と安全", "Pengelasan menimbulkan cahaya kuat, percikan, dan asap — gunakan perlengkapan pelindung.",
        bg=R(120, 200, 260, 20, 3, "bg"))
d.part("溶接面", "Topeng las: melindungi mata dan wajah dari cahaya busur dan percikan.", P("M60,70 A34,34 0 0 1 128,70 L128,118 L60,118 Z"), R(72, 88, 44, 14, 3, fill="#2b2f45"))
d.part("アーク溶接", "Las busur listrik: panas busur melelehkan logam dan kawat las.", L(150, 120, 226, 176, "s"), POLY([(226, 166), (240, 172), (232, 184), (248, 188), (228, 196), (220, 180)], fill="#ffd56b"))
d.part("ヒューム", "Asap las berisi partikel logam; berbahaya jika terhirup (butuh ventilasi/masker).", P("M262,170 q-12,-18 4,-34 q16,-16 -2,-34", "s", stroke="#9aa4c8"), P("M290,170 q-12,-18 4,-34 q16,-16 -2,-34", "s", stroke="#9aa4c8"))
d.part("ボンベ", "Tabung gas: berisi gas pelindung/gas las bertekanan — ikat agar tidak roboh.", R(320, 90, 40, 110, 14), R(332, 76, 16, 14, 2))
d.part("板金", "Pelat logam yang dilas atau diproses.", R(130, 188, 150, 12, 1))
M.append(d)

d = Dia("press", "Mesin press dan cetakan", "プレス機械と金型", "Cetakan atas turun menekan pelat di atas cetakan bawah; operator memakai kendali dua tangan.")
d.part("スライド", "Bagian bergerak yang membawa cetakan atas naik-turun.", R(120, 30, 140, 40, 4),
       extra=("スライド", "suraido", "slide (bagian bergerak mesin press)", "bab2", ["b2s1"]))
d.part("金型", "Cetakan (die): memberi bentuk pada pelat.", R(140, 70, 100, 30, 3), R(130, 156, 120, 34, 3))
d.part("板金", "Pelat logam yang ditekan.", R(136, 138, 108, 14, 1))
d.part("両手操作", "Kendali dua tangan: kedua tombol harus ditekan agar tangan tidak berada di area bahaya.", C(300, 200, 16), C(330, 200, 16), R(280, 214, 70, 30, 4))
M.append(d)

if __name__ == "__main__":
    print(build("industrial-mfg", "im", A, "Diagram gambar", {
        "title": "Flashcard Gambar", "jp": "絵カード",
        "desc": "Gambar alat/mesin/APD tampil di depan — tebak nama Jepangnya. Ketuk kartu untuk membalik."}))
    print(build("mfg-machine-metal", "mm", M, "Diagram mesin", {
        "title": "Flashcard Gambar Mesin", "jp": "機械の絵カード",
        "desc": "Gambar bagian mesin tampil di depan — tebak nama Jepangnya. Ketuk kartu untuk membalik."}))
