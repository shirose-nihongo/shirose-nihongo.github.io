# -*- coding: utf-8 -*-
"""Soal latihan tambahan Wood Industry (ditulis Shirose dari 学習用テキスト). Dipanggil di akhir wood_content.py."""
from wood_content import SUBS, TF, MC

EXTRA = {
 "b2s5": [
  TF("ツキ板は、ふつうそのまま製品として使われます。", False, "Salah: hampir selalu ditempel pada bahan lain.", "ほとんどそのままでは使わず、ほかの材料に貼ります。", id_="Veneer hias biasanya dipakai langsung apa adanya sebagai produk."),
  TF("ツキ板は「化粧単板」とも呼ばれます。", True, "Benar.", "化粧単板ともいいます。", id_="Tsukiita juga disebut “veneer hias”."),
  MC("Veneer hias ditempel pada kaca terutama menonjolkan…", "ツキ板を板ガラスで覆うように接着したものの特徴はどれですか。",
     ("urat kayu jelas, tembus cahaya, awet", "木目が鮮明で、透光性・耐久性がよい"), [("tidak bisa terbakar sama sekali", "必ず燃えない"), ("sangat lentur untuk bidang lengkung", "曲面加工にいちばん向いている"), ("hanya dipakai di luar ruangan", "屋外だけで使う")], "Kaca: urat jelas, tembus cahaya, awet.", "木目が鮮明で、透光性・耐久性がよいです。"),
  MC("Veneer pada kertas non-tenun/washi menjadi…", "ツキ板を不織布や和紙に貼ると、どうなりますか。",
     ("lebih kuat, tidak mudah sobek/robek", "強くなり、破れ・裂けにくい"), [("lebih berat", "重くなる"), ("tidak bisa dibengkokkan", "曲げられない"), ("mudah terbakar saja", "燃えやすいだけ")], "Kekuatan naik, fleksibel.", "強くなり、破れにくいです。")],
 "b2s6": [
  TF("単層フローリングは、ひき板を基材とし、厚さ方向の構成層が1のものです。", True, "Benar.", "厚さ方向の層が1です。", id_="Lantai tunggal berbasis papan gergajian dengan satu lapisan pada arah ketebalan."),
  TF("複合フローリングは、単層フローリングよりふつう価格が高いです。", False, "Salah: umumnya lebih murah.", "ふつう安いです。", id_="Lantai komposit umumnya lebih mahal daripada lantai tunggal."),
  MC("Lantai komposit yang paling banyak diproduksi di Jepang berbasis…", "日本で多く生産される複合フローリングの基材はどれですか。",
     ("kayu lapis", "合板"), [("beton", "コンクリート"), ("besi", "鉄"), ("kaca", "ガラス")], "Basis kayu lapis + MDF + veneer/olefin.", "合板が基材です。"),
  MC("Keunggulan lantai tunggal jika permukaan sudah aus…", "単層フローリングの長所はどれですか。",
     ("bisa diamplas dan dicat ulang", "研磨して再塗装できる"), [("tidak boleh diperbaiki", "直せない"), ("harus diganti seluruhnya", "全部取りかえる"), ("tidak bisa dipakai di sekolah", "学校では使えない")], "Perawatan: amplas + cat ulang.", "研磨して再塗装できます。")],
 "b2s7": [
  TF("建築物の解体材から作るチップは、ボイラー燃料や木質ボードの原料に使われます。", True, "Benar.", "解体材のチップはボイラー燃料やボード原料です。", id_="Chip dari kayu bongkaran bangunan dipakai sebagai bahan bakar boiler atau bahan papan kayu."),
  MC("Chip untuk pembangkit biomassa kayu dipakai sebagai…", "木質バイオマス発電所で、チップは何として使われますか。",
     ("bahan bakar", "燃料"), [("bahan cat", "塗料"), ("bahan kaca", "ガラス"), ("bahan pupuk saja", "肥料だけ")], "Bahan bakar; permintaan naik.", "燃料です。"),
  MC("Chip dari sisa pabrik gergaji dan sisa hutan terutama dipakai untuk…", "工場残材や林地残材のチップは、主に何に使われますか。",
     ("kertas dan bahan bakar", "製紙用や燃料用"), [("hanya furnitur", "家具だけ"), ("hanya perekat", "接着剤だけ"), ("hanya lantai", "床だけ")], "Kertas & bahan bakar.", "製紙用と燃料用です。")],
 "b2s8": [
  TF("プレカットでは、建物の設計情報を木材の加工情報に変換して、コンピュータ制御の機械で加工します。", True, "Benar.", "設計情報を加工情報に変換します。", id_="Pada precut, informasi desain bangunan diubah menjadi data pengerjaan kayu lalu diproses mesin kontrol komputer."),
  TF("プレカットは、建築現場でのゴミ（木くず）を増やします。", False, "Salah: mengurangi sampah di lokasi.", "ゴミを減らせます。", id_="Precut menambah sampah (serbuk kayu) di lokasi bangunan."),
  MC("Salah satu keuntungan precut…", "プレカットのメリットはどれですか。",
     ("masa kerja di lokasi lebih singkat", "現場の工期を短くできる"), [("presisi turun", "精度が下がる"), ("pekerjaan manual bertambah", "手作業が増える"), ("kualitas tidak stabil", "品質が不安定")], "Waktu kerja pendek, presisi tinggi.", "工期が短くなります。")],
 "b3s1": [
  TF("はく皮は、のこ歯が樹皮や土砂で傷むのを防ぐために行います。", True, "Benar.", "のこ歯を守るためです。", id_="Pengupasan kulit dilakukan agar mata gergaji tidak rusak oleh kulit dan tanah."),
  MC("Mesin untuk mengupas kulit kayu bulat disebut…", "はく皮に使う機械はどれですか。",
     ("バーカ", "バーカ"), [("エジャ", "エジャ"), ("トリマ", "トリマ"), ("乾燥機", "乾燥機")], "Barker.", "バーカです。"),
  MC("Menentukan bagian bulatan yang digergaji dan produknya disebut…", "丸太のどこからどんな製材品を挽くか決めることを何といいますか。",
     ("木取り", "木取り"), [("耳すり", "耳すり"), ("結束", "結束"), ("横切り", "横切り")], "木取り sangat penting bagi rendemen.", "木取りです。"),
  MC("Memotong panjang produk disebut…", "製品の長さを決める作業はどれですか。",
     ("横切り", "横切り"), [("耳すり", "耳すり"), ("はく皮", "はく皮"), ("桟積み", "桟積み")], "横切り; mesin: trimmer/crosscut.", "横切りです。"),
  MC("Mesin pengering buatan yang paling umum adalah tipe…", "人工乾燥機でいちばん一般的なのはどれですか。",
     ("tipe uap (蒸気式)", "蒸気式"), [("tipe matahari", "太陽式"), ("tipe angin", "風式"), ("tipe es", "氷式")], "Tipe uap paling umum.", "蒸気式です。")],
}
for bab in SUBS.values():
    for s in bab:
        if s["id"] in EXTRA:
            s["qs"] = s.get("qs", []) + EXTRA[s["id"]]
