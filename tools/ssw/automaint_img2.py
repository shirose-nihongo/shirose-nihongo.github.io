# -*- coding: utf-8 -*-
"""Soal bergambar dari JICA イラスト集「かいて おぼえる」(hal. 40–70 = Gambar 6–36 tanpa label).
Jalankan SETELAH automaint_jica_build.py:  python3 -I tools/ssw/automaint_img2.py <illust.pdf>"""
import json, sys, hashlib, pymupdf
from PIL import Image, ImageChops
F = "data/ssw/auto-maintenance/quiz.json"; OUT = "assets/ssw/auto-maintenance/fig/"
# fig: (halaman PDF berlabel, judul, {no: (label JP, arti ID)})
FIG = {
 2: (6, "Langkah hisap mesin", {1:("インテーク・バルブ","katup hisap"),2:("エキゾースト・バルブ","katup buang"),3:("混合気","campuran udara-bahan bakar"),4:("ピストン","torak"),5:("シリンダ","silinder"),6:("クランクシャフト","poros engkol")}),
 6: (8, "Mesin DOHC 4 silinder", {1:("シリンダ・ヘッド","kepala silinder"),2:("カムシャフト","poros bubungan"),3:("シリンダ・ブロック","blok silinder"),4:("バルブ","katup"),5:("ピストン","torak"),6:("シリンダ","silinder"),7:("コンロッド","batang penghubung"),8:("クランクシャフト","poros engkol")}),
 8: (10, "Mekanisme katup tipe OHC (sabuk)", {1:("タイミング・ベルト","sabuk timing"),2:("カムシャフト","poros bubungan"),3:("ロッカ・アーム","lengan rocker"),4:("クランクシャフト","poros engkol"),5:("テンショナ","penegang sabuk")}),
 9: (11, "Mekanisme katup tipe DOHC (rantai)", {1:("タイミング・チェーン","rantai timing"),2:("カムシャフト","poros bubungan"),3:("チェーン・ガイド","pemandu rantai"),4:("クランクシャフト","poros engkol"),5:("テンショナ・アーム","lengan penegang"),6:("テンショナ","penegang")}),
 10: (12, "Sirkulasi oli", {1:("オイル・プレッシャ・スイッチ","sakelar tekanan oli"),2:("オイル・デリバリ・パイプ","pipa penyalur oli"),3:("オイル・ギャラリ","saluran oli (oil gallery)"),4:("オイル・ジェット","nosel semprot oli"),5:("オイル・ストレーナ","saringan oli (strainer)"),6:("オイル・パン","karter oli"),7:("オイル・フィルタ","filter oli"),8:("オイル・ポンプ","pompa oli")}),
 11: (13, "Sistem pendingin air", {1:("ラジエータ・アッパ・ホース","selang atas radiator"),2:("ウォータ・ポンプ","pompa air"),4:("サーモスタット","termostat"),5:("ラジエータ・ロアー・ホース","selang bawah radiator"),6:("ファン・モータ","motor kipas"),7:("バイパス通路","saluran bypass"),8:("ラジエータ","radiator")}),
 13: (15, "Injeksi bahan bakar elektronik", {1:("フューエル・ポンプ","pompa bahan bakar"),2:("フューエル・タンク","tangki bahan bakar"),3:("フューエル・ブリーザ・パイプ","pipa pernapasan tangki"),4:("チャコール・キャニスタ","kanister arang"),5:("フューエル・パイプ","pipa bahan bakar"),6:("インジェクタ","injektor")}),
 14: (16, "Sistem hisap dan buang", {1:("エア・クリーナ","saringan udara"),2:("エア・インテーク・ホース","selang hisap udara"),3:("スロットル・ボデー","throttle body"),4:("サージ・タンク","tangki surja"),5:("インテーク・マニホールド","manifold hisap"),6:("メイン・マフラ","knalpot utama"),7:("サブ・マフラ","knalpot tambahan"),8:("エキゾースト・パイプ","pipa gas buang"),9:("触媒コンバータ","konverter katalis"),10:("エキゾースト・マニホールド","manifold buang"),11:("EGR装置","perangkat EGR")}),
 15: (17, "Sistem starter", {1:("イグニッション・スイッチ","kunci kontak (saklar starter)"),2:("バッテリ","aki"),3:("スタータ","motor starter")}),
 16: (18, "Sistem pengisian", {1:("イグニッション・スイッチ","kunci kontak"),2:("バッテリ","aki"),3:("オルタネータ","alternator")}),
 17: (19, "Sistem pengapian", {1:("イグニッション・コイル","koil pengapian"),2:("スパーク・プラグ","busi"),3:("イグニッション・スイッチ","kunci kontak"),4:("ECU","unit kontrol elektronik (ECU)"),5:("バッテリ","aki"),6:("カム角センサ","sensor sudut cam"),7:("クランク角センサ","sensor sudut poros engkol")}),
 20: (22, "Susunan mobil", {1:("ステアリング装置","sistem kemudi"),2:("ボデー","bodi"),3:("ホイール及びタイヤ","roda dan ban"),4:("サスペンション","suspensi"),5:("ブレーキ装置","sistem rem"),6:("動力伝達装置","penerus tenaga"),7:("灯火装置","sistem lampu"),8:("エンジン","mesin")}),
 21: (23, "Mesin depan penggerak belakang (FR)", {1:("エンジン","mesin"),2:("ファイナル・ギヤ及びディファレンシャル","gigi akhir dan diferensial"),3:("プロペラ・シャフト","poros propeller"),4:("ユニバーサル・ジョイント","sambungan universal"),5:("トランスミッション","transmisi"),6:("クラッチ","kopling")}),
 22: (24, "Mesin depan penggerak depan (FF)", {1:("ファイナル・ギヤ及びディファレンシャル","gigi akhir dan diferensial"),2:("ドライブ・シャフト","poros penggerak"),3:("トランスミッション","transmisi"),4:("クラッチ","kopling"),5:("エンジン","mesin")}),
 23: (25, "Axle dan suspensi tipe gandar", {1:("ショック・アブソーバ","peredam kejut"),2:("リヤ・アクスル","as roda belakang"),3:("スプリング","pegas"),4:("フロント・アクスル","as roda depan")}),
 24: (26, "Suspensi independen", {1:("コイル・スプリング","pegas keong"),2:("ショック・アブソーバ","peredam kejut"),3:("スタビライザ","stabilizer"),4:("ロアー・サスペンション・アーム","lengan bawah suspensi")}),
 27: (29, "Kemudi rack & pinion", {1:("ステアリング操作機構","mekanisme operasi kemudi"),2:("ステアリング・ギヤ機構","mekanisme gigi kemudi"),3:("ステアリング・リンク機構","mekanisme sambungan kemudi")}),
 33: (35, "Struktur rem hidrolik", {1:("マスタ・シリンダ","master silinder"),2:("ブレーキ・ペダル","pedal rem"),3:("ブレーキ・ホース","selang rem"),4:("ディスク式油圧ブレーキ","rem hidrolik cakram"),5:("ブレーキ・パイプ","pipa rem"),6:("ドラム式油圧ブレーキ","rem hidrolik tromol")}),
 35: (37, "Rem tromol (2)", {1:("ブレーキ・シュー","sepatu rem"),2:("ホイール・シリンダ","silinder roda"),3:("ブレーキ・ドラム","tromol rem"),4:("バック・プレート","pelat belakang")}),
 36: (38, "Kaliper rem cakram mengambang", {1:("ディスク","cakram"),2:("スライド・ピン","pin geser"),3:("ピストン","torak"),4:("シリンダ","silinder"),5:("ピストン・シール","seal piston"),6:("キャリパ","kaliper"),7:("パッド","kampas rem")}),
}
H = lambda *a: int(hashlib.md5("|".join(map(str, a)).encode()).hexdigest(), 16)
def crop(d, pno, path):
    d[pno].get_pixmap(dpi=110).save("/tmp/_f.png"); im = Image.open("/tmp/_f.png").convert("RGB")
    bb = ImageChops.invert(im.convert("L")).point(lambda p: 255 if p > 20 else 0).getbbox()
    if bb: im = im.crop((max(0, bb[0] - 20), max(0, bb[1] - 20), min(im.width, bb[2] + 20), min(im.height, bb[3] + 20)))
    im.save(path, "WEBP", quality=82)
def main():
    d = pymupdf.open(sys.argv[1]); allarti = sorted({v[1] for f in FIG.values() for v in f[2].values()})
    q = json.load(open(F, encoding="utf-8")); gs = q["bab"]["bab4"]
    gs[:] = [g for g in gs if not g["id"].startswith("bab4-qimg")]
    for g in [json.load(open(F))["bab"]["bab4"]]: pass
    for fn, (pg, title, labs) in sorted(FIG.items()):
        path = "jica-fig%02d.webp" % fn; (crop(d, pg + 35, OUT + path) if fn != 2 else None); items = []
        for no, (jp, arti) in sorted(labs.items()):
            pool = [v[1] for k, v in labs.items() if k != no] + allarti
            ds = sorted({p for p in pool if p != arti}, key=lambda p: H(fn, no, p))[:3]; o = sorted(ds + [arti], key=lambda p: H(fn, no, "o", p))
            items.append({"q": {"id": "Pada Gambar %d (%s), bagian bernomor %d adalah…" % (fn, title, no)}, "opts": [{"id": x} for x in o], "a": o.index(arti),
                          "exp": {"id": "%s = %s. (Gambar: JICA, イラスト集)" % (jp, arti)}, "img": {"src": "./assets/ssw/auto-maintenance/fig/" + path}})
        gs.append({"id": "bab4-qimg-%02d" % fn, "rev": True, "title": {"id": "Soal bergambar: Gambar %d — %s" % (fn, title)}, "items": items})
    # gambar 2 (langkah hisap) tetap
    print("grup gambar:", len(FIG), "soal:", sum(len(g["items"]) for g in gs if "qimg" in g["id"]))
    json.dump(q, open(F, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
main()
