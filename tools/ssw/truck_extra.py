# -*- coding: utf-8 -*-
"""Soal latihan tambahan Truk (ditulis Shirose dari 学習用テキスト JTA). Dipanggil di akhir truck_content.py."""
from truck_content import SUBS
from wood_content import TF, MC
EXTRA = {
 "b2s1": [
  TF("業務前点呼では、アルコール検知器で酒気帯びの有無を確認します。", True, "Benar.", "アルコール検知器で確認します。", id_="Pada tenko sebelum kerja, kadar alkohol diperiksa dengan alat pendeteksi alkohol."),
  TF("日常点検表は、運行管理者ではなく整備管理者にまず渡して確認してもらいます。", True, "Benar: ke整備管理者 dulu, lalu ke運行管理者.", "先に整備管理者に渡します。", id_="Formulir inspeksi harian diserahkan dulu ke manajer perawatan kendaraan untuk dicek."),
  MC("Tenko di tengah perjalanan wajib untuk operasi jarak jauh…", "途中の点呼（中間点呼）が必要なのは、どんな運行ですか。",
     ("2 malam 3 hari atau lebih", "2泊3日以上の長距離運行"), [("semua operasi harian", "毎日の運行すべて"), ("hanya dalam kota", "市内だけの運行"), ("hanya saat hujan", "雨の日だけ")], "Rute ≥2 malam 3 hari.", "2泊3日以上です。"),
  MC("Setelah kembali ke kantor, hal pertama yang dibuat adalah…", "運行が終わって営業所に帰ったら、まず何を作りますか。",
     ("catatan kerja (業務記録)", "業務記録"), [("surat izin", "免許証"), ("tabel inspeksi baru", "新しい点検表"), ("laporan pajak", "税金の書類")], "Catatan kerja → diserahkan ke manajer operasi.", "業務記録です。")],
 "b3s2": [
  TF("一般道路では、4時間ごとに安全な場所に停車して、荷物の固縛を点検します。", True, "Benar.", "4時間ごとです。", id_="Di jalan umum, berhenti tiap 4 jam di tempat aman untuk memeriksa pengikatan muatan."),
  TF("高速道路では、点検は4時間ごとで十分です。", False, "Salah: tol tiap 2 jam di SA/PA.", "高速道路は2時間ごとです。", id_="Di jalan tol pemeriksaan 4 jam sekali sudah cukup."),
  TF("シートをかけたときは、シートだけで固縛すれば十分です。", False, "Salah: tetap harus pakai tali.", "必ずロープなども使います。", id_="Jika muatan ditutup terpal, mengikat dengan terpal saja sudah cukup."),
  MC("Pekerjaan di tempat tinggi (≥ 2 m dari tanah) harus memakai…", "地面から2m以上の高い場所で作業するときは、何を使いますか。",
     ("tangga atau pijakan", "はしごや踏み台"), [("tanpa alat", "何も使わない"), ("forklift", "フォークリフトに乗る"), ("tali saja", "ロープだけ")], "Tangga/pijakan.", "はしごや踏み台です。")],
 "b3s5": [
  TF("ロールボックスパレットを1人で扱うときは、約300kgまでです。", True, "Benar.", "約300kgまでです。", id_="Roll box pallet ditangani sendirian maksimal sekitar 300 kg."),
  TF("テールゲートリフターの下に入って作業してもよいです。", False, "Salah: jangan masuk di bawah lifter.", "リフターの下に入りません。", id_="Boleh masuk ke bawah tail gate lifter saat bekerja."),
  MC("Saat mengoperasikan forklift, wajib memiliki…", "フォークリフトを運転する人は、何を持っていなければいけませんか。",
     ("sertifikat kursus keterampilan (技能講習修了証)", "技能講習修了証"), [("SIM bus", "バスの免許"), ("sertifikat bahasa", "日本語の証明書"), ("tidak perlu apa-apa", "何もいらない")], "Perlu 技能講習修了証.", "技能講習修了証です。"),
  MC("Saat naik-turun forklift sebaiknya berpegangan pada…", "フォークリフトに乗り降りするときは、何を使いますか。",
     ("pegangan tangan dan tangga", "手すりや階段"), [("tuas", "レバー"), ("setir", "ハンドル"), ("garpu", "フォーク")], "Bukan tuas/setir.", "手すりや階段です。")],
 "b1s5": [
  TF("狭い道で対向車と近づいたときは、相手が止まると考えて進みます。", False, "Salah: kita yang berhenti dan mengalah.", "自分が停止して譲ります。", id_="Di jalan sempit saat berpapasan, majulah dengan anggapan lawan akan berhenti."),
  TF("走行中や駐停車中でも、窓からのポイ捨ては禁止です。", True, "Benar.", "ポイ捨ては禁止です。", id_="Membuang sampah dari jendela dilarang, baik saat jalan maupun parkir."),
  MC("Dasar etika mengemudi adalah…", "運転マナーの基本は何ですか。",
     ("kepedulian dan saling mengalah", "思いやりと譲りあい"), [("kecepatan", "スピード"), ("kekuatan truk", "トラックの大きさ"), ("klakson", "クラクション")], "思いやり dan 譲りあい.", "思いやりと譲りあいです。"),
  MC("Perbedaan konsumsi BBM jika memakai gigi satu tingkat lebih rendah…", "1段低いギアで走ると、燃費はどのくらい悪くなりますか。",
     ("sekitar 20–40%", "約20〜40%"), [("sekitar 1%", "約1%"), ("tidak berubah", "変わらない"), ("membaik 20%", "20%よくなる")], "20–40% lebih boros.", "20〜40%悪くなります。")],
}
for bab in SUBS.values():
    for s in bab:
        if s["id"] in EXTRA:
            s["qs"] = s.get("qs", []) + EXTRA[s["id"]]
