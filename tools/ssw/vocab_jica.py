# -*- coding: utf-8 -*-
"""Tambah kosakata auto-maintenance dari JICA「みてまなぶ！自動車整備の日本語」(2023/2024, bebas dipakai menurut JICA).
Hanya kosakata (kata Jepang + arti Indonesia buatan Shirose); teks buku TIDAK disalin.
Bersifat menambah (id am-j###), tidak mengubah entri lama; idempoten.
Jalankan dari akar repo: python3 tools/ssw/vocab_jica.py
Format baris: kata|kana (kosong = otomatis dari katakana)|arti|kategori|subbab"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from vocab_auto import romaji

BAB = lambda s: "bab" + s[1]
D = "data/ssw/auto-maintenance/"

RAW = """
運転席|うんてんせき|kursi pengemudi|Dalam kabin|b1s1
助手席|じょしゅせき|kursi penumpang depan|Dalam kabin|b1s1
後部座席|こうぶざせき|kursi penumpang belakang|Dalam kabin|b1s1
バックミラー||spion tengah (kabin)|Dalam kabin|b1s1
エアコン||AC (pendingin udara)|Dalam kabin|b1s1
吹き出し口|ふきだしぐち|lubang hembusan AC|Dalam kabin|b1s1
カーナビ||navigasi mobil|Dalam kabin|b1s1
ホーン||klakson|Dalam kabin|b1s1
クラクション||klakson (sebutan lain)|Dalam kabin|b1s1
ウィンカーレバー||tuas lampu sein|Dalam kabin|b1s1
ライティングスイッチ||saklar lampu|Dalam kabin|b1s1
パッシングライト||lampu passing (kedip lampu jauh)|Dalam kabin|b1s1
メーター||panel instrumen (meteran)|Dalam kabin|b1s1
ウォッシャースイッチ||saklar penyemprot kaca|Dalam kabin|b1s1
グローブボックス||laci dasbor|Dalam kabin|b1s1
ダッシュボード||dasbor|Dalam kabin|b1s1
センターパネル||panel tengah|Dalam kabin|b1s1
ハザードスイッチ||saklar lampu hazard|Dalam kabin|b1s1
シフトレバー||tuas persneling|Dalam kabin|b1s1
アクセルペダル||pedal gas|Dalam kabin|b1s1
ブレーキペダル||pedal rem|Dalam kabin|b1s1
クラッチペダル||pedal kopling|Dalam kabin|b1s1
ルームランプ||lampu kabin|Dalam kabin|b1s1
サンバイザー||pelindung silau (sun visor)|Dalam kabin|b1s1
エアバッグ||kantong udara (airbag)|Dalam kabin|b1s1
シートベルト||sabuk pengaman|Dalam kabin|b1s1
ヘッドレスト||sandaran kepala|Dalam kabin|b1s1
センターコンソール||konsol tengah|Dalam kabin|b1s1
エンジンチェックランプ||lampu peringatan mesin (check engine)|Dalam kabin|b4s3
半ドア|はんドア|pintu belum tertutup rapat|Dalam kabin|b4s3
ボンネット||kap mesin|Luar mobil|b1s1
前照灯|ぜんしょうとう|lampu depan (headlight)|Luar mobil|b1s1
フロントバンパー||bemper depan|Luar mobil|b1s1
フロントグリル||gril depan|Luar mobil|b1s1
ナンバープレート||pelat nomor|Luar mobil|b1s1
ワイパーアーム||lengan wiper|Luar mobil|b1s1
フロントガラス||kaca depan|Luar mobil|b1s1
車幅灯|しゃはばとう|lampu posisi (lebar kendaraan)|Luar mobil|b1s1
フォグランプ||lampu kabut|Luar mobil|b1s1
給油口|きゅうゆこう|lubang pengisian bahan bakar|Luar mobil|b1s1
方向指示器|ほうこうしじき|lampu sein (penunjuk arah)|Luar mobil|b1s1
ドアハンドル||pegangan pintu|Luar mobil|b1s1
フロントピラー||tiang depan (pilar A)|Luar mobil|b1s1
ドアミラー||spion samping|Luar mobil|b1s1
フェンダー||spatbor|Luar mobil|b1s1
キーシリンダー||lubang kunci|Luar mobil|b1s1
リアガラス||kaca belakang|Luar mobil|b1s1
リアゲート||pintu bagasi belakang|Luar mobil|b1s1
リアバンパー||bemper belakang|Luar mobil|b1s1
クォーターパネル||panel samping belakang|Luar mobil|b1s1
ルーフ||atap mobil|Luar mobil|b1s1
後退灯|こうたいとう|lampu mundur|Luar mobil|b1s1
ライセンスランプ||lampu pelat nomor|Luar mobil|b1s1
制動灯|せいどうとう|lampu rem (stop lamp)|Luar mobil|b1s1
ハイマウントストップランプ||lampu rem tambahan di atas|Luar mobil|b1s1
テールレンズ||lensa lampu belakang|Luar mobil|b1s1
トランク||bagasi|Luar mobil|b1s1
セダン||sedan|Jenis mobil|b1s1
ステーションワゴン||station wagon|Jenis mobil|b1s1
ワンボックス||mobil satu boks (van)|Jenis mobil|b1s1
軽トラ|けいトラ|truk mini (kei truck)|Jenis mobil|b1s1
パトカー||mobil patroli polisi|Jenis mobil|b1s1
エンジンルーム||ruang mesin|Ruang mesin|b5s1
エンジンオイル||oli mesin|Ruang mesin|b5s1
ブレーキリザーバタンク||tangki cadangan minyak rem|Ruang mesin|b5s1
ブレーキフルード||minyak rem (fluida rem)|Ruang mesin|b5s1
ウィンドウォッシャ液|ウィンドウォッシャえき|cairan penyemprot kaca|Ruang mesin|b5s1
ラジエータリザーバタンク||tangki cadangan radiator|Ruang mesin|b5s1
クーラント||cairan pendingin (coolant)|Ruang mesin|b5s1
冷却ファン|れいきゃくファン|kipas pendingin|Ruang mesin|b5s1
ファンベルト||sabuk kipas|Ruang mesin|b5s1
パワーステアリングベルト||sabuk power steering|Ruang mesin|b5s1
スパークプラグ||busi|Ruang mesin|b5s1
ディストリビュータ||distributor (pembagi arus pengapian)|Ruang mesin|b5s1
エンジンECU||unit kontrol mesin (ECU)|Ruang mesin|b5s1
アッパーホース||selang atas radiator|Ruang mesin|b5s1
エアクリーナボックス||kotak saringan udara|Ruang mesin|b5s1
ヘッドカバー||tutup kepala silinder|Ruang mesin|b5s1
フィラーキャップ||tutup pengisian oli|Ruang mesin|b5s1
エンジンマウント||dudukan mesin|Ruang mesin|b5s1
インテークマニホールド||manifold hisap (inmani)|Ruang mesin|b5s1
ラジエータキャップ||tutup radiator|Ruang mesin|b5s1
マスターバック||servo rem (master back)|Ruang mesin|b5s1
足回り|あしまわり|kaki-kaki (ban dan suspensi)|Kaki-kaki & bawah mobil|b3s5
ブレーキディスク||cakram rem|Kaki-kaki & bawah mobil|b3s4
キャリパ||kaliper rem|Kaki-kaki & bawah mobil|b3s4
ブレーキパッド||kampas rem cakram|Kaki-kaki & bawah mobil|b3s4
ブレーキドラム||tromol rem|Kaki-kaki & bawah mobil|b3s4
ホイールシリンダ||silinder roda (rem tromol)|Kaki-kaki & bawah mobil|b3s4
エアバルブ||pentil ban|Kaki-kaki & bawah mobil|b3s5
下回り|したまわり|bagian bawah mobil|Kaki-kaki & bawah mobil|b5s2
ナックル||knuckle (penyangga roda)|Kaki-kaki & bawah mobil|b3s2
ブレーキホース||selang rem|Kaki-kaki & bawah mobil|b3s4
ロアアーム||lengan bawah (lower arm)|Kaki-kaki & bawah mobil|b3s2
エアコンコンプレッサ||kompresor AC|Kaki-kaki & bawah mobil|b5s2
ドレーンボルト||baut pembuang oli|Kaki-kaki & bawah mobil|b2s3
オイルエレメント||elemen filter oli|Kaki-kaki & bawah mobil|b2s3
O2センサ|オーツーセンサ|sensor oksigen (O2)|Kaki-kaki & bawah mobil|b2s5
触媒|しょくばい|katalis (converter gas buang)|Kaki-kaki & bawah mobil|b2s5
サブフレーム||rangka bantu (subframe)|Kaki-kaki & bawah mobil|b3s2
ホーシング||rumah gardan (housing)|Kaki-kaki & bawah mobil|b3s1
コイルスプリング||pegas keong (coil spring)|Kaki-kaki & bawah mobil|b3s2
ブレーキパイプ||pipa rem|Kaki-kaki & bawah mobil|b3s4
エキゾーストパイプ||pipa gas buang|Kaki-kaki & bawah mobil|b2s5
遮熱板|しゃねつばん|pelindung panas|Kaki-kaki & bawah mobil|b2s5
モンキーレンチ||kunci inggris|Perkakas|b6s1
スピンナハンドル||tangkai putar socket|Perkakas|b6s1
ラチェットハンドル||tangkai ratchet|Perkakas|b6s1
Tレンチ|ティーレンチ|kunci T|Perkakas|b6s1
インパクトレンチ||kunci impak|Perkakas|b6s1
六角レンチ|ろっかくレンチ|kunci L (heksagon)|Perkakas|b6s1
パイプレンチ||kunci pipa|Perkakas|b6s1
プラスドライバ||obeng plus|Perkakas|b6s1
マイナスドライバ||obeng minus|Perkakas|b6s1
貫通型ドライバ|かんつうがたドライバ|obeng tembus (boleh dipukul)|Perkakas|b6s1
スタッビドライバ||obeng pendek|Perkakas|b6s1
ショックドライバ||obeng kejut (dipukul untuk melonggarkan)|Perkakas|b6s1
木ハンマ|きハンマ|palu kayu|Perkakas|b6s1
ゴムハンマ||palu karet|Perkakas|b6s1
プラスチックハンマ||palu plastik|Perkakas|b6s1
テストハンマ||palu uji (cek kekencangan baut)|Perkakas|b6s1
コンビネーションプライヤ||tang kombinasi|Perkakas|b6s1
ペンチ||tang potong (pentjit)|Perkakas|b6s1
ラジオペンチ||tang lancip (radio pliers)|Perkakas|b6s1
ニッパ||tang pemotong (nipper)|Perkakas|b6s1
スナップリングプライヤ||tang cincin snap|Perkakas|b6s1
ウォーターポンププライヤ||tang pompa air|Perkakas|b6s1
たがね||pahat besi|Perkakas|b6s1
油圧プレス|ゆあつプレス|pres hidrolik|Perkakas|b6s1
バイス||ragum|Perkakas|b6s1
やすり||kikir|Perkakas|b6s1
弓のこ|ゆみのこ|gergaji busur|Perkakas|b6s1
リーマ||reamer (penghalus lubang)|Perkakas|b6s1
ベンチグラインダ||gerinda duduk|Perkakas|b6s1
ドリル||bor|Perkakas|b6s1
タップ||tap (pembuat ulir dalam)|Perkakas|b6s1
ダイス||dies (pembuat ulir luar)|Perkakas|b6s1
スケール||penggaris|Alat ukur & uji|b6s2
サーキットテスタ||multimeter (circuit tester)|Alat ukur & uji|b6s2
バッテリテスタ||penguji aki|Alat ukur & uji|b6s2
スキャンツール||alat scan (OBD)|Alat ukur & uji|b6s2
オパシメータ||opasimeter (ukur asap diesel)|Alat ukur & uji|b6s2
デプスゲージ||pengukur kedalaman alur ban|Alat ukur & uji|b6s2
エアゲージ||pengukur tekanan udara|Alat ukur & uji|b6s2
炭化水素|たんかすいそ|hidrokarbon (HC)|Alat ukur & uji|b6s2
ブレーキテスタ||alat uji rem|Alat ukur & uji|b6s2
スピードメータテスタ||alat uji spidometer|Alat ukur & uji|b6s2
サイドスリップテスタ||alat uji selip samping|Alat ukur & uji|b6s2
騒音計|そうおんけい|alat ukur kebisingan|Alat ukur & uji|b6s2
ヘッドライトテスタ||alat uji lampu depan|Alat ukur & uji|b6s2
ホイールバランサ||alat balancing roda|Alat ukur & uji|b6s2
タイヤチェンジャ||mesin pasang-lepas ban|Alat ukur & uji|b6s2
バッテリ充電器|バッテリじゅうでんき|pengisi aki (charger)|Alat ukur & uji|b6s2
エアガン||pistol udara|Alat bengkel|b6s1
グリースガン||pistol gemuk|Alat bengkel|b6s1
リフト||lift mobil|Alat bengkel|b5s3
チェーンブロック||katrol rantai|Alat bengkel|b5s3
ガレージジャッキ||dongkrak buaya|Alat bengkel|b5s3
予防保全|よぼうほぜん|perawatan pencegahan|Istilah kerja|b1s2
免許証|めんきょしょう|surat izin mengemudi (SIM)|Istilah kerja|b1s2
朝礼|ちょうれい|apel pagi|Istilah kerja|b1s4
ラジオ体操|ラジオたいそう|senam radio (senam pagi)|Istilah kerja|b1s4
指示書|しじしょ|lembar instruksi kerja|Istilah kerja|b1s4
気を付ける|きをつける|berhati-hati|Kata kerja bengkel|b5s3
戻す|もどす|mengembalikan|Kata kerja bengkel|b7s1
磨く|みがく|menggosok, memoles|Kata kerja bengkel|b5s4
片付ける|かたづける|merapikan, membereskan|Kata kerja bengkel|b5s4
掃除する|そうじする|membersihkan (menyapu/mengepel)|Kata kerja bengkel|b5s4
拭く|ふく|mengelap|Kata kerja bengkel|b5s4
掃く|はく|menyapu|Kata kerja bengkel|b5s4
洗う|あらう|mencuci|Kata kerja bengkel|b5s4
洗車する|せんしゃする|mencuci mobil|Kata kerja bengkel|b5s4
替える|かえる|mengganti|Kata kerja bengkel|b7s3
捨てる|すてる|membuang|Kata kerja bengkel|b5s4
冷ます|さます|mendinginkan|Kata kerja bengkel|b7s1
張る|はる|mengencangkan (sabuk)|Kata kerja bengkel|b7s4
開ける|あける|membuka|Kata kerja bengkel|b7s1
閉める|しめる|menutup|Kata kerja bengkel|b7s1
止める|とめる|menghentikan, mematikan|Kata kerja bengkel|b7s1
取る|とる|mengambil|Kata kerja bengkel|b7s1
取り出す|とりだす|mengeluarkan|Kata kerja bengkel|b7s2
つなぐ||menyambung|Kata kerja bengkel|b7s2
外す|はずす|melepas|Kata kerja bengkel|b7s2
入れ替える|いれかえる|menukar posisi (rotasi ban)|Kata kerja bengkel|b7s3
"""


def main():
    vf = D + "vocab.json"
    data = json.load(open(vf, encoding="utf-8"))
    items = data["items"]
    have = {x["kata"] for x in items}
    subs = {s["id"] for b in json.load(open(D + "index.json"))["bab"]
            for s in json.load(open(D + b["file"]))["bab"]["subs"]}
    n = 0
    for line in RAW.strip().split("\n"):
        kata, kana, arti, cat, sub = line.split("|")
        assert sub in subs, line
        if kata in have:
            continue
        if not kana:
            kana = "".join(chr(ord(c) - 0x60) if "ァ" <= c <= "ヶ" and c != "ー" else c for c in kata)
        n += 1
        items.append({"id": f"am-j{len(items) + 1 - 227:03d}", "kata": kata, "kana": kana, "romaji": romaji(kana),
                      "arti": arti, "cat": cat, "bab": BAB(sub), "src": [sub], "sumber": "JICA"})
        have.add(kata)
    with open(vf, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print("kosakata baru:", n, "total:", len(items))


if __name__ == "__main__":
    main()
