# Tinjauan N3 Full Exam 11 — versi 2

File baru: `jlpt/n3/full-11.v2.json` (belum live). File lama `full-11.json` tidak diubah.

## Ringkasan pilot

| Metrik (median karakter) | Lama | **v2** | Soal asli N3 |
|---|---|---|---|
| Dialog 課題理解 | 103 | **199** | 213 (178–258) |
| Dialog ポイント理解 | 89 | **176** | 213 (176–252) |
| Dialog 概要理解 | 82 | **176** | 189 (170–218) |
| Ucapan 即時応答 | 12 | **21** | 24 |
| Giliran 課題 / ポイント | 6 / 5 | **8 / 6** | 7 / 6 |
| Monolog 課題+ポイント | 0/12 | **4/12** | 20–30% |
| Kalimat 文法形式 | 15 | **32** | 37 (27–47) |
| Soal per bacaan Dokkai | 1,4 | **1,9** | 2,8 |

Perubahan isi utama:
- 漢字読み & 表記 tidak lagi menguji kata yang sama; pengecoh 表記 berupa kanji mirip bentuk/homofon (運/連, 勤/務/努, 資料/試料), bukan kata mustahil.
- 言い換え memakai kata bergaris bawah + pilihan pendek (format resmi), bukan kalimat utuh.
- 用法: semua pengecoh berupa kalimat wajar yang salah kolokasi.
- 文法形式: pola N3 (わりに, たびに, おかげで, ようとしない, とおりに, さえ, 謙譲語), tanpa soal kembar.
- 文章の文法: bacaan utuh dengan 2 celah (sebelumnya kalimat tunggal).
- Dokkai: 4 短文 + 1 中文 (3 soal) + 1 長文 (4 soal) + 1 情報検索 (2 soal), soal rujukan (それ, このこと) dan pemahaman maksud penulis.
- Choukai: 28 naskah baru; pengecoh = rencana dibatalkan/sudah selesai/disangkal; kunci tidak diucapkan persis; setiap pilihan punya penjelasan.
- Penjelasan setiap pilihan spesifik (bukan templat).

QC otomatis v2 (mode pratinjau): tidak ada kode B atau duplikat. Penanda tersisa: AUDIO_HILANG ×28 (MP3 dibuat workflow setelah push), KANJI_DI_ATAS_LEVEL (daftar kanji situs, keyakinan rendah), 1 PENGECOH_TIDAK_DISEBUT (salah deteksi: pengecoh disebut dalam bentuk parafrase).

**Langkah go-live** (belum dijalankan):
1. Commit + push ke `main` → workflow *Voice pack* membuat 28 MP3 di `audio/choukai/n3/p211/`.
2. Ubah `file` pada entri `n3-full-11` di `jlpt/index.json` menjadi `n3/full-11.v2.json` (+ `"versi": 2`).
3. Bump `CACHE` di `sw.js`.
4. Jalankan `node tools/jlpt_audit/audit.mjs n3` → harus 0 AUDIO_HILANG.

Cara membangun ulang setelah koreksi:
`python tools/choukai_build.py n3` → `python tools/jlpt_v2/build_full_v2.py n3 11` → `node tools/jlpt_v2/review.mjs n3 11` → `node tools/jlpt_audit/audit.mjs n3 --preview full-11.v2.json`.

## Tinjauan per soal

Setiap soal: **v2** (✓ = kunci) lalu versi lama sebagai pembanding. Beri catatan langsung di bawah soal bila perlu diubah.

## 問題1 漢字読み — Cara baca kanji

### 1. 駅前の＿工事＿は来月まで続くそうだ。

- 　 A. ごうじ
- ✓ B. こうじ
- 　 C. こうし
- 　 D. くうじ

*Alasan:* 工事 = こう（工）＋じ（事）. 事 di sini dibaca じ, bukan し.

  - A. ごうじ — Salah. ごうじ: 工 tidak dibaca ごう.
  - B. こうじ — BENAR. Benar: こうじ (pekerjaan konstruksi).
  - C. こうし — Salah. こうし tanpa dakuten; 事 tidak dibaca し dalam kata ini.
  - D. くうじ — Salah. くうじ: 工 kadang dibaca く (大工), tetapi tidak dalam 工事 dan tidak panjang.

<sub>Lama: 現在の ＿状況＿を 説明して ください。 — じょうぎょう / しょうきょう / じょうきよう / ✓じょうきょう</sub>

---

### 2. 会議で使う資料が全員に＿配られた＿。

- 　 A. かぞえられた
- 　 B. くらべられた
- ✓ C. くばられた
- 　 D. くわえられた

*Alasan:* 配る（くばる）= membagikan; bentuk pasif 配られた.

  - A. かぞえられた — Salah. かぞえられた = 数えられた (dihitung).
  - B. くらべられた — Salah. くらべられた = 比べられた (dibandingkan).
  - C. くばられた — BENAR. Benar: 配られた = dibagikan.
  - D. くわえられた — Salah. くわえられた = 加えられた (ditambahkan).

<sub>Lama: 機械の ＿状態＿は 良いです。 — ✓じょうたい / じょうだい / しょうたい / じようたい</sub>

---

### 3. 兄は食品会社で＿営業＿の仕事をしている。

- ✓ A. えいぎょう
- 　 B. えぎょう
- 　 C. えいきょう
- 　 D. えいごう

*Alasan:* 営業 = えい＋ぎょう (業 dibaca ぎょう, seperti 授業・卒業).

  - A. えいぎょう — BENAR. Benar: えいぎょう (penjualan/bisnis).
  - B. えぎょう — Salah. えぎょう: 営 dibaca えい (vokal panjang).
  - C. えいきょう — Salah. えいきょう = 影響 (pengaruh), kata lain.
  - D. えいごう — Salah. えいごう: 業 tidak dibaca ごう.

<sub>Lama: いろいろな ＿事情＿で、会社を 辞めました。 — じじょ / じいじょう / ✓じじょう / じしょう</sub>

---

### 4. 卵を＿割って＿、ボウルに入れてください。

- 　 A. けずって
- ✓ B. わって
- 　 C. さいて
- 　 D. きって

*Alasan:* 割る（わる）= memecahkan. 卵を割る adalah kolokasi tetap.

  - A. けずって — Salah. けずって = 削って (meraut/mengikis).
  - B. わって — BENAR. Benar: 割って = memecahkan.
  - C. さいて — Salah. さいて = 裂いて (merobek).
  - D. きって — Salah. きって = 切って (memotong).

<sub>Lama: 日本の 文化に ＿関心＿が あります。 — かんしいん / ✓かんしん / かんじん / がんしん</sub>

---

### 5. 出発の前に、もう一度持ち物を＿確認＿しましょう。

- ✓ A. かくにん
- 　 B. かくじん
- 　 C. こうにん
- 　 D. かくいん

*Alasan:* 確認 = かく（確）＋にん（認）.

  - A. かくにん — BENAR. Benar: かくにん (memastikan/mengecek).
  - B. かくじん — Salah. かくじん: 認 tidak dibaca じん.
  - C. こうにん — Salah. こうにん = 公認 (resmi diakui), kata lain.
  - D. かくいん — Salah. かくいん: 認 dibaca にん, bukan いん.

<sub>Lama: 音楽に ＿興味＿が あります。 — ✓きょうみ / きょみ / ぎょうみ / きようみ</sub>

---

### 6. ホテルの部屋から見える＿景色＿がとてもきれいだった。

- 　 A. けいしき
- 　 B. けしょく
- ✓ C. けしき
- 　 D. けいしょく

*Alasan:* 景色 dibaca khusus けしき (bukan けいしき).

  - A. けいしき — Salah. けいしき = 形式 (bentuk/formalitas) — jebakan vokal panjang.
  - B. けしょく — Salah. けしょく: tidak ada kata ini.
  - C. けしき — BENAR. Benar: けしき (pemandangan).
  - D. けいしょく — Salah. けいしょく = 軽食 (makanan ringan).

<sub>Lama: 旅行の ＿目的＿は 勉強です。 — もくでき / もうくてき / もくてぎ / ✓もくてき</sub>

---

### 7. ＿普段＿は自転車で会社に通っています。

- 　 A. ふうだん
- 　 B. ふたん
- 　 C. ぶだん
- ✓ D. ふだん

*Alasan:* 普段 = ふ＋だん (段 dibaca だん).

  - A. ふうだん — Salah. ふうだん: 普 dibaca ふ (pendek).
  - B. ふたん — Salah. ふたん = 負担 (beban), kata lain.
  - C. ぶだん — Salah. ぶだん: 普 tidak dibaca ぶ.
  - D. ふだん — BENAR. Benar: ふだん (biasanya, sehari-hari).

<sub>Lama: 今年の ＿目標＿を 決めました。 — もくびょう / ✓もくひょう / もくひょ / もうくひょう</sub>

---

## 問題2 表記 — Penulisan kanji

### 8. 道が混んでいるので、＿いそいだ＿ほうがいい。

- ✓ A. 急いだ
- 　 B. 速いだ
- 　 C. 忙いだ
- 　 D. 走いだ

*Alasan:* いそぐ ditulis 急ぐ.

  - A. 急いだ — BENAR. Benar: 急いだ.
  - B. 速いだ — Salah. 速 dibaca はや-い (cepat).
  - C. 忙いだ — Salah. 忙 (いそが-しい) bentuknya mirip tapi untuk 忙しい (sibuk).
  - D. 走いだ — Salah. 走 dibaca はし-る (berlari).

<sub>Lama: ＿じょうきょう＿ を 説明します。 — 犬況 / 状沢 / 状祝 / ✓状況</sub>

---

### 9. この荷物を二階まで＿はこんで＿もらえますか。

- 　 A. 連んで
- 　 B. 送んで
- ✓ C. 運んで
- 　 D. 達んで

*Alasan:* はこぶ ditulis 運ぶ.

  - A. 連んで — Salah. 連 bentuknya mirip 運, tapi dibaca つ-れる (membawa orang).
  - B. 送んで — Salah. 送 dibaca おく-る (mengirim).
  - C. 運んで — BENAR. Benar: 運んで.
  - D. 達んで — Salah. 達 tidak dipakai untuk はこぶ.

<sub>Lama: 機械の ＿じょうたい＿ は 良いです。 — 状能 / 状熊 / ✓状態 / 伏態</sub>

---

### 10. 毎朝、新聞を＿くばる＿アルバイトをしている。

- 　 A. 記る
- ✓ B. 配る
- 　 C. 改る
- 　 D. 届る

*Alasan:* くばる ditulis 配る.

  - A. 記る — Salah. 記 (しる-す) bagian kanannya mirip 配, tapi artinya mencatat.
  - B. 配る — BENAR. Benar: 配る.
  - C. 改る — Salah. 改 (あらた-める) = mengubah.
  - D. 届る — Salah. 届 (とど-ける) = mengantarkan; tidak dibaca くばる.

<sub>Lama: いろいろな ＿じじょう＿ が あります。 — 事晴 / 事清 / ✓事情 / 争情</sub>

---

### 11. 父は駅の近くの病院に＿つとめて＿いる。

- 　 A. 働めて
- 　 B. 務めて
- 　 C. 努めて
- ✓ D. 勤めて

*Alasan:* Bekerja di suatu tempat (〜に勤める) ditulis 勤める.

  - A. 働めて — Salah. 働 dibaca はたら-く, tidak ada 働める.
  - B. 務めて — Salah. 務める = menjabat peran (司会を務める).
  - C. 努めて — Salah. 努める = berusaha keras (努力).
  - D. 勤めて — BENAR. Benar: 勤めて (bekerja di tempat kerja).

<sub>Lama: 文化に ＿かんしん＿ が あります。 — 関化 / 間心 / 開心 / ✓関心</sub>

---

### 12. 来週の会議の＿しりょう＿を準備する。

- 　 A. 史料
- ✓ B. 資料
- 　 C. 試料
- 　 D. 資科

*Alasan:* Materi/dokumen = 資料.

  - A. 史料 — Salah. 史料 = sumber sejarah.
  - B. 資料 — BENAR. Benar: 資料 (materi/dokumen).
  - C. 試料 — Salah. 試料 = sampel uji laboratorium.
  - D. 資科 — Salah. 資科: 科 bentuknya mirip 料, kata ini tidak ada.

<sub>Lama: 音楽に ＿きょうみ＿ が あります。 — 與味 / 興未 / 興妹 / ✓興味</sub>

---

### 13. 辞書で漢字の＿せいかく＿な読み方を調べた。

- ✓ A. 正確
- 　 B. 正格
- 　 C. 性格
- 　 D. 生確

*Alasan:* Tepat/akurat = 正確.

  - A. 正確 — BENAR. Benar: 正確 (tepat).
  - B. 正格 — Salah. 正格: tidak dipakai.
  - C. 性格 — Salah. 性格 = sifat/karakter orang — homofon.
  - D. 生確 — Salah. 生確: tidak ada.

<sub>Lama: 旅行の ＿もくてき＿ を 決めます。 — ✓目的 / 目約 / 目釣 / 且的</sub>

---

## 問題3 文脈規定 — Kosakata sesuai konteks

### 14. 雨の日は道が（　　　）やすいので、気をつけて歩いてください。

- ✓ A. すべり
- 　 B. こぼれ
- 　 C. ころがり
- 　 D. ずれ

*Alasan:* 道がすべる = jalan licin.

  - A. すべり — BENAR. Benar: すべりやすい = mudah licin.
  - B. こぼれ — Salah. こぼれる = tumpah (cairan).
  - C. ころがり — Salah. ころがる = menggelinding (bola, batu).
  - D. ずれ — Salah. ずれる = bergeser dari posisinya.

<sub>Lama: 彼は 毎日 同じ 時間に 起きる（　）が あります。 — かんけい / げんいん / ✓しゅうかん / きかい</sub>

---

### 15. 部長に頼まれた資料は、会議の前にもう一度（　　　）しておいたほうがいい。

- 　 A. ノック
- 　 B. キャンセル
- 　 C. サイン
- ✓ D. チェック

*Alasan:* 資料をチェックする = memeriksa materi.

  - A. ノック — Salah. ノック = mengetuk pintu.
  - B. キャンセル — Salah. キャンセル = membatalkan; tidak cocok dengan 'sebelum rapat'.
  - C. サイン — Salah. サイン = tanda tangan; materi tidak 'ditandatangani' untuk persiapan.
  - D. チェック — BENAR. Benar: チェック (memeriksa).

<sub>Lama: 来週の 会議は 重要なので、必ず（　）ください。 — けっせき / ✓しゅっせき / てんきん / たいいん</sub>

---

### 16. 試験に落ちて（　　　）している弟を、家族みんなではげました。

- 　 A. うっかり
- ✓ B. がっかり
- 　 C. のんびり
- 　 D. すっきり

*Alasan:* Gagal ujian → kecewa = がっかり.

  - A. うっかり — Salah. うっかり = tidak sengaja/lalai.
  - B. がっかり — BENAR. Benar: がっかり = kecewa.
  - C. のんびり — Salah. のんびり = santai.
  - D. すっきり — Salah. すっきり = lega/segar.

<sub>Lama: ごみの 分別が 正しく できて いない 人が 多いので、市が（　）を 呼びかけて います。 — ✓ちゅうい / はんたい / せつめい / けいかく</sub>

---

### 17. このアパートは駅から少し遠いですが、（　　　）は安いです。

- 　 A. 代金
- 　 B. 料金
- ✓ C. 家賃
- 　 D. 税金

*Alasan:* Biaya sewa tempat tinggal = 家賃.

  - A. 代金 — Salah. 代金 = harga barang yang dibeli.
  - B. 料金 — Salah. 料金 = tarif layanan (listrik, taksi).
  - C. 家賃 — BENAR. Benar: 家賃 (sewa rumah).
  - D. 税金 — Salah. 税金 = pajak.

<sub>Lama: この 薬は 副作用が ある ので、使う 前に 医者に（　）ほうが いいです。 — ✓そうだんした / じゅうたいした / ちゅうもんした / ほうこくした</sub>

---

### 18. 友達の結婚式で（　　　）を頼まれたので、何を話すか考えている。

- 　 A. アナウンス
- ✓ B. スピーチ
- 　 C. ニュース
- 　 D. インタビュー

*Alasan:* Bicara di depan tamu pernikahan = スピーチ.

  - A. アナウンス — Salah. アナウンス = pengumuman (stasiun, bandara).
  - B. スピーチ — BENAR. Benar: スピーチ (pidato/sambutan).
  - C. ニュース — Salah. ニュース = berita.
  - D. インタビュー — Salah. インタビュー = wawancara (ada penanya).

<sub>Lama: 会社の 経営が（　）なって、社員を 減らす ことに なりました。 — あたたかく / ✓くるしく / おだやかに / ゆたかに</sub>

---

### 19. 寒くなってきたので、そろそろ冬の服を（　　　）ことにした。

- ✓ A. 出す
- 　 B. 上げる
- 　 C. 起こす
- 　 D. 開ける

*Alasan:* 冬の服を出す = mengeluarkan baju dari lemari.

  - A. 出す — BENAR. Benar: 出す (mengeluarkan).
  - B. 上げる — Salah. 上げる = menaikkan.
  - C. 起こす — Salah. 起こす = membangunkan.
  - D. 開ける — Salah. 開ける = membuka (pintu, kotak), bukan baju.

<sub>Lama: 雨が 続いて いるので、洗濯物が なかなか（　）。 — ✓かわきません / ふくれません / ぬれません / ひろがりません</sub>

---

## 問題4 言い換え類義 — Sinonim / parafrasa

### 20. この仕事は＿たいてい＿午後六時ごろに終わる。

- 　 A. たまに
- 　 B. ときどき
- 　 C. かならず
- ✓ D. ほとんどいつも

*Alasan:* たいてい = hampir selalu (ほとんどいつも).

  - A. たまに — Salah. たまに = sesekali.
  - B. ときどき — Salah. ときどき = kadang-kadang (lebih jarang).
  - C. かならず — Salah. かならず = pasti/selalu (100%), lebih kuat dari たいてい.
  - D. ほとんどいつも — BENAR. Benar: ほとんどいつも = hampir selalu.

<sub>Lama: ＿この 問題は 彼女に とって たやすい。＿ / Pilih kalimat yang maknanya paling dekat dengan kalimat bergaris bawah. — この 問題は 彼女に とって 大切だ。 / この 問題は 彼女に とって むずかしい。 / この 問題は 彼女に とって つまらない。 / ✓この 問題は 彼女に とって かんたんだ。</sub>

---

### 21. 会議の時間が＿変更＿になった。

- ✓ A. 変わった
- 　 B. 書かれた
- 　 C. 知らされた
- 　 D. 決まった

*Alasan:* 変更になる = berubah (変わる).

  - A. 変わった — BENAR. Benar: 変わった = berubah.
  - B. 書かれた — Salah. 書かれた = ditulis.
  - C. 知らされた — Salah. 知らされた = diberitahukan.
  - D. 決まった — Salah. 決まった = diputuskan (belum tentu berubah).

<sub>Lama: ＿彼は いつも ていねいに 仕事を する。＿ / Pilih kalimat yang maknanya paling dekat dengan kalimat bergaris bawah. — 彼は いつも いそいで 仕事を する。 / 彼は いつも 休みながら 仕事を する。 / 彼は いつも ほかの 人に 仕事を たのむ。 / ✓彼は いつも 注意して きちんと 仕事を する。</sub>

---

### 22. 兄と弟は、顔が＿そっくり＿だ。

- 　 A. 少し似ている
- 　 B. 全然違う
- ✓ C. とても似ている
- 　 D. とてもかわいい

*Alasan:* そっくり = sangat mirip.

  - A. 少し似ている — Salah. 少し似ている = agak mirip; そっくり jauh lebih kuat.
  - B. 全然違う — Salah. 全然違う = sama sekali berbeda (lawannya).
  - C. とても似ている — BENAR. Benar: とても似ている.
  - D. とてもかわいい — Salah. とてもかわいい = sangat lucu (tidak terkait kemiripan).

<sub>Lama: ＿友だちの 意見に 賛成した。＿ / Pilih kalimat yang maknanya paling dekat dengan kalimat bergaris bawah. — 友だちに 意見を たずねた。 / 友だちの 意見に ちがう 考えだと 言った。 / 友だちの 意見を 聞かなかった。 / ✓友だちの 意見に 同じ 考えだと 言った。</sub>

---

### 23. 彼女の説明は＿あいまい＿だった。

- 　 A. わかりやすかった
- ✓ B. はっきりしなかった
- 　 C. 長かった
- 　 D. 正しかった

*Alasan:* あいまい = tidak jelas/samar.

  - A. わかりやすかった — Salah. わかりやすかった = mudah dipahami (kebalikannya).
  - B. はっきりしなかった — BENAR. Benar: はっきりしなかった.
  - C. 長かった — Salah. 長かった = panjang (bukan soal kejelasan).
  - D. 正しかった — Salah. 正しかった = benar.

<sub>Lama: ＿この 町は 人口が 減って いる。＿ / Pilih kalimat yang maknanya paling dekat dengan kalimat bergaris bawah. — ✓この 町に 住む 人が 少なく なって いる。 / この 町に 店が ふえて いる。 / この 町に 住む 人が 多く なって いる。 / この 町は 広く なって いる。</sub>

---

### 24. 出かける前に、窓が閉まっているか＿確かめた＿。

- ✓ A. チェックした
- 　 B. 開けた
- 　 C. ふいた
- 　 D. 閉めた

*Alasan:* 確かめる = memastikan/mengecek.

  - A. チェックした — BENAR. Benar: チェックした.
  - B. 開けた — Salah. 開けた = membuka.
  - C. ふいた — Salah. ふいた = mengelap.
  - D. 閉めた — Salah. 閉めた = menutup (tindakan, bukan mengecek).

<sub>Lama: ＿彼は 約束の 時間に 間に あわなかった。＿ / Pilih kalimat yang maknanya paling dekat dengan kalimat bergaris bawah. — 彼は 約束を わすれなかった。 / 彼は 約束を 守った。 / 彼は 約束の 時間より 早く 着いた。 / ✓彼は 約束の 時間に 遅れた。</sub>

---

## 問題5 用法 — Penggunaan kosakata

### 25. ＿さっそく＿

- ✓ A. 新しいパソコンが届いたので、さっそく使ってみた。
- 　 B. 毎朝さっそく起きて、ジョギングをしている。
- 　 C. 電車がさっそく出発したので、乗れなかった。
- 　 D. 弟は一年でさっそく背が高くなった。

*Alasan:* さっそく = segera melakukan sesuatu yang sudah ditunggu/diterima.

  - A. 新しいパソコンが届いたので、さっそく使ってみた。 — BENAR. Benar: langsung mencoba barang yang baru datang.
  - B. 毎朝さっそく起きて、ジョギングをしている。 — Salah. Bangun pagi-pagi = 早く起きて, bukan さっそく.
  - C. 電車がさっそく出発したので、乗れなかった。 — Salah. Kereta berangkat lebih cepat = 早く/もう出発した.
  - D. 弟は一年でさっそく背が高くなった。 — Salah. Tumbuh cepat = ずいぶん/急に; さっそく hanya untuk tindakan yang disengaja.

<sub>Lama: ＿さがす＿ / Pilih kalimat yang memakai kata bergaris bawah dengan paling tepat. — なくした鍵を、天気がさがした。 / 新しい仕事をさがして、電車を乗った。 / 辞書の中の言葉をさがして、水を飲んだ。 / ✓なくした鍵を、部屋中さがした。</sub>

---

### 26. ＿たまる＿

- 　 A. 駅の前にバスがたまっていて、乗れなかった。
- 　 B. 明日の天気がたまって、雨になるそうだ。
- ✓ C. 机の上にほこりがたまっている。
- 　 D. 旅行が楽しみで、気持ちがたまっている。

*Alasan:* たまる = sedikit demi sedikit menumpuk (ほこり、お金、仕事).

  - A. 駅の前にバスがたまっていて、乗れなかった。 — Salah. Bus yang berjejer = 並んでいて/止まっていて.
  - B. 明日の天気がたまって、雨になるそうだ。 — Salah. Cuaca tidak 'menumpuk'; yang benar 天気が崩れて.
  - C. 机の上にほこりがたまっている。 — BENAR. Benar: ほこりがたまる.
  - D. 旅行が楽しみで、気持ちがたまっている。 — Salah. Perasaan senang tidak 'menumpuk'; yang benar わくわくしている.

<sub>Lama: ＿はずす＿ / Pilih kalimat yang memakai kata bergaris bawah dengan paling tepat. — 授業中は、先生をはずしてください。 / 授業中は、天気をはずしてください。 / ✓授業中は、帽子をはずしてください。 / 授業中は、宿題をはずしてください。</sub>

---

### 27. ＿しめきり＿

- ✓ A. レポートのしめきりは来週の金曜日だ。
- 　 B. 彼はしめきりのいい人で、約束を必ず守る。
- 　 C. 窓のしめきりが悪くて、風が入ってくる。
- 　 D. 店のしめきりは夜十時なので、まだ買い物ができる。

*Alasan:* しめきり（締め切り）= batas waktu penyerahan.

  - A. レポートのしめきりは来週の金曜日だ。 — BENAR. Benar: tenggat laporan.
  - B. 彼はしめきりのいい人で、約束を必ず守る。 — Salah. Orang yang tepat janji = 時間を守る人; しめきり bukan sifat orang.
  - C. 窓のしめきりが悪くて、風が入ってくる。 — Salah. Jendela yang tidak rapat = 窓の閉まりが悪い.
  - D. 店のしめきりは夜十時なので、まだ買い物ができる。 — Salah. Jam tutup toko = 閉店時間.

<sub>Lama: ＿こぼす＿ / Pilih kalimat yang memakai kata bergaris bawah dengan paling tepat. — 友だちをこぼして、泣いてしまった。 / コーヒーをこぼして、会社に勤めた。 / 電車をこぼして、遅れてしまった。 / ✓コーヒーをこぼして、服をよごした。</sub>

---

### 28. ＿ゆずる＿

- 　 A. 毎月、母に手紙をゆずっている。
- ✓ B. 電車でお年寄りに席をゆずった。
- 　 C. 道に迷った人に、駅までの道をゆずった。
- 　 D. 先生に質問をゆずって、答えてもらった。

*Alasan:* 席をゆずる = memberikan (mengalah) tempat duduk.

  - A. 毎月、母に手紙をゆずっている。 — Salah. Mengirim surat = 手紙を送っている/書いている.
  - B. 電車でお年寄りに席をゆずった。 — BENAR. Benar: 席をゆずる.
  - C. 道に迷った人に、駅までの道をゆずった。 — Salah. Menunjukkan jalan = 道を教えた.
  - D. 先生に質問をゆずって、答えてもらった。 — Salah. Bertanya = 質問をして.

<sub>Lama: ＿ぬれる＿ / Pilih kalimat yang memakai kata bergaris bawah dengan paling tepat. — 急な雨で、かさがなくて全身をぬれた。 / 急な雨で、友だちがぬれて怒った。 / 急な雨で、計画がぬれて中止になった。 / ✓急な雨で、かさがなくて全身がぬれた。</sub>

---

### 29. ＿くわしい＿

- 　 A. 彼の部屋は、いつもくわしく片付いている。
- 　 B. 昨日はくわしい雨が一日中降った。
- 　 C. この料理は塩がくわしくて、少しからい。
- ✓ D. 田中さんは日本の歴史にくわしい。

*Alasan:* 〜にくわしい = paham/mengetahui secara mendalam.

  - A. 彼の部屋は、いつもくわしく片付いている。 — Salah. Rapi = きれいに片付いている.
  - B. 昨日はくわしい雨が一日中降った。 — Salah. Hujan deras = 激しい雨/強い雨.
  - C. この料理は塩がくわしくて、少しからい。 — Salah. Terlalu asin = 塩が多くて/塩辛くて.
  - D. 田中さんは日本の歴史にくわしい。 — BENAR. Benar: 歴史にくわしい.

<sub>Lama: ＿折れる＿ / Pilih kalimat yang memakai kata bergaris bawah dengan paling tepat. — 強い風で、木の枝を折れた。 / ✓強い風で、木の枝が折れた。 / 強い風で、約束が折れた。 / 強い風で、時間が折れた。</sub>

---

## 問題6 文法形式の判断 — Bentuk tata bahasa

### 30. 林「この店、いつも混んでるね。」 / 山田「うん。でも、平日の昼（　　　）、すぐ入れるみたいだよ。」

- 　 A. まで
- 　 B. ほど
- ✓ C. なら
- 　 D. こそ

*Alasan:* 〜なら = kalau (menyebut kondisi tertentu sebagai topik).

  - A. まで — Salah. 〜まで = sampai; tidak bermakna.
  - B. ほど — Salah. 〜ほど = sampai sejauh/sekitar; tidak membentuk syarat.
  - C. なら — BENAR. Benar: 平日の昼なら = kalau siang hari kerja.
  - D. こそ — Salah. 〜こそ = justru (penekanan); 'justru siang hari kerja' tidak cocok dengan でも.

<sub>Lama: 来週の 金曜日（　　　）、レポートを 出して ください。 — ✓までに / から / ながら / まで</sub>

---

### 31. 駅前に新しくできたこの店の料理は、値段が安い（　　　）量も多くて、とてもおいしい。

- 　 A. せいで
- 　 B. くせに
- ✓ C. わりに
- 　 D. おかげで

*Alasan:* 〜わりに = tidak sebanding dengan yang diperkirakan dari…

  - A. せいで — Salah. 〜せいで = penyebab hal buruk; enak bukan hal buruk.
  - B. くせに — Salah. 〜くせに = mengkritik orang (nada negatif).
  - C. わりに — BENAR. Benar: 安いわりにおいしい.
  - D. おかげで — Salah. 〜おかげで = berkat; 'enak berkat murah' tidak logis.

<sub>Lama: 若い（　　　）、いろいろな 経験を して おきたい。 — ところ / ✓うちに / ながら / あいだ</sub>

---

### 32. 高校の文化祭でみんなで歌ったこの歌を聞く（　　　）、楽しかった学生時代のことを思い出す。

- 　 A. あいだに
- 　 B. までに
- 　 C. ところに
- ✓ D. たびに

*Alasan:* 〜たびに = setiap kali.

  - A. あいだに — Salah. 〜あいだに = dalam rentang waktu (biasanya dengan ている).
  - B. までに — Salah. 〜までに = batas waktu.
  - C. ところに — Salah. 〜ところに = tepat saat (situasi yang datang mengganggu).
  - D. たびに — BENAR. Benar: 聞くたびに.

<sub>Lama: 母が 料理を して いる（　　　）、私は 部屋を 掃除した。 — まで / うちに / あいだ / ✓あいだに</sub>

---

### 33. 母「もう九時よ。宿題、終わったの？」 / 子「今、やっている（　　　）だよ。あと少しで終わるから。」

- 　 A. ばかり
- ✓ B. ところ
- 　 C. はず
- 　 D. こと

*Alasan:* 〜ているところだ = sedang (tepat di tengah) melakukan.

  - A. ばかり — Salah. 〜ばかり tidak dipakai setelah ている dengan arti ini.
  - B. ところ — BENAR. Benar: やっているところ.
  - C. はず — Salah. 〜はず = seharusnya (dugaan) — aneh untuk perbuatan sendiri.
  - D. こと — Salah. 〜ことだ = nasihat; tidak cocok.

<sub>Lama: 彼は 忙しい（　　　）、いつも 笑顔で 話して くれる。 — から / ので / ために / ✓のに</sub>

---

### 34. 昨日は仕事が多くて大変だったが、先輩が手伝ってくれた（　　　）、予定より一時間も早く終わった。

- ✓ A. おかげで
- 　 B. せいで
- 　 C. くせに
- 　 D. かわりに

*Alasan:* 〜おかげで = berkat (hasil baik).

  - A. おかげで — BENAR. Benar: おかげで.
  - B. せいで — Salah. 〜せいで = gara-gara (hasil buruk); selesai cepat itu baik.
  - C. くせに — Salah. 〜くせに = padahal (mencela).
  - D. かわりに — Salah. 〜かわりに = sebagai ganti.

<sub>Lama: 雨が 降って いる（　　　）、試合は 行われます。 — ために / から / ので / ✓のに</sub>

---

### 35. 健康のために、エレベーターではなく、なるべく階段を使う（　　　）。

- 　 A. はずだ
- 　 B. ことになる
- ✓ C. ようにしている
- 　 D. ところだ

*Alasan:* 〜ようにしている = membiasakan diri/berusaha.

  - A. はずだ — Salah. 〜はずだ = seharusnya (dugaan).
  - B. ことになる — Salah. 〜ことになる = akan diputuskan/menjadi (bukan kebiasaan sendiri).
  - C. ようにしている — BENAR. Benar: なるべく〜ようにしている.
  - D. ところだ — Salah. 〜ところだ = akan segera; tidak cocok dengan なるべく.

<sub>Lama: 雨が 降って いる（　　　）、試合は 中止です。 — ✓ので / けれど / のに / ても</sub>

---

### 36. 田中さんは今日から一週間、夏休みを取っているから、明日の会議には来ない（　　　）。

- ✓ A. はずだ
- 　 B. ところだ
- 　 C. ことだ
- 　 D. ばかりだ

*Alasan:* 〜はずだ = dugaan kuat berdasarkan alasan.

  - A. はずだ — BENAR. Benar: 来ないはずだ.
  - B. ところだ — Salah. 〜ところだ = akan/sedang; tidak cocok dengan bentuk ない.
  - C. ことだ — Salah. 〜ことだ = sebaiknya (nasihat).
  - D. ばかりだ — Salah. 〜ばかりだ = makin…/baru saja; tidak cocok.

<sub>Lama: 体の ため（　　　）、毎日 歩いて います。 — で / ✓に / が / を</sub>

---

### 37. 同じアジアの国でも、国（　　　）、あいさつのしかたや食事のマナーがずいぶん違う。

- 　 A. に対して
- 　 B. にとって
- 　 C. について
- ✓ D. によって

*Alasan:* 〜によって違う = berbeda tergantung….

  - A. に対して — Salah. 〜に対して = terhadap.
  - B. にとって — Salah. 〜にとって = bagi (sudut pandang).
  - C. について — Salah. 〜について = tentang.
  - D. によって — BENAR. Benar: 国によって違う.

<sub>Lama: 駅に 着いたら、電話（　　　）ください。 — ✓して / した / しよう / する</sub>

---

### 38. 先週買った本棚を説明書の（　　　）組み立てたのに、なぜか少しぐらぐらする。

- 　 A. ほかに
- ✓ B. とおりに
- 　 C. かわりに
- 　 D. ために

*Alasan:* 〜のとおりに = sesuai dengan.

  - A. ほかに — Salah. 〜のほかに = selain.
  - B. とおりに — BENAR. Benar: 説明書のとおりに.
  - C. かわりに — Salah. 〜のかわりに = sebagai ganti buku petunjuk.
  - D. ために — Salah. 〜のために = demi; tidak logis.

<sub>Lama: 日本へ 来る（　　　）、日本語を 勉強して おいた ほうが いい。 — ながら / ✓前に / 後で / あとに</sub>

---

### 39. 今日は朝から会議やお客さんの対応が続いて、昼ご飯を食べる時間（　　　）なかった。

- 　 A. だけ
- ✓ B. さえ
- 　 C. まで
- 　 D. ほど

*Alasan:* 〜さえ〜ない = bahkan … pun tidak.

  - A. だけ — Salah. 〜だけなかった = hanya itu yang tidak ada (makna aneh).
  - B. さえ — BENAR. Benar: 時間さえなかった.
  - C. まで — Salah. 〜まで juga 'bahkan', tapi untuk hal yang melampaui batas; tidak wajar di sini.
  - D. ほど — Salah. 〜ほどなかった = tidak sebanyak itu.

<sub>Lama: ご飯を 食べた（　　　）、歯を みがきます。 — ✓あとで / ながら / うちに / 前に</sub>

---

### 40. 弟は母に部屋を片付けなさいと言われても、ぜんぜん（　　　）。

- ✓ A. 片付けようとしない
- 　 B. 片付けることはない
- 　 C. 片付けるはずがない
- 　 D. 片付けてしまった

*Alasan:* 〜ようとしない = tidak mau mencoba/tidak berusaha (orang lain).

  - A. 片付けようとしない — BENAR. Benar: 片付けようとしない.
  - B. 片付けることはない — Salah. 〜ことはない = tidak perlu.
  - C. 片付けるはずがない — Salah. 〜はずがない = mustahil (dugaan), tidak cocok dengan kebiasaan yang diamati.
  - D. 片付けてしまった — Salah. 〜てしまった = sudah selesai; bertentangan dengan ぜんぜん.

<sub>Lama: 今日は 春（　　　）暖かい 日だ。 — ばかりの / のために / だけの / ✓のような</sub>

---

### 41. ホテルの受付で / 店員「重いですから、お荷物はお部屋まで（　　　）。」

- 　 A. 持っていらっしゃいます
- 　 B. 持ってもらいます
- 　 C. お持ちになります
- ✓ D. お持ちします

*Alasan:* Tindakan diri sendiri untuk tamu → 謙譲語 お〜します.

  - A. 持っていらっしゃいます — Salah. 持っていらっしゃいます = sonkeigo (tamu sedang membawa).
  - B. 持ってもらいます — Salah. 持ってもらいます = menyuruh orang lain membawakan.
  - C. お持ちになります — Salah. お持ちになります = sonkeigo untuk tindakan tamu.
  - D. お持ちします — BENAR. Benar: お持ちします (kenjougo).

<sub>Lama: 彼は まるで 子ども（　　　）、はしゃいで いた。 — そうに / らしく / ばかり / ✓のように</sub>

---

## 問題7 文の組み立て — Menyusun kalimat (★)

### 42. 資料は ＿＿＿ ＿＿＿ ★＿＿＿ ＿＿＿ ください。

- ✓ A. 前に
- 　 B. 始まる
- 　 C. 会議が
- 　 D. 配っておいて

*Alasan:* Urutan yang benar: C → B → A → D, sehingga kalimatnya 「資料は会議が始まる前に配っておいてください。」. Kotak ★ ada di posisi ke-3, yaitu 「前に」. Kuncinya: 〜前に + 〜ておく.

  - A. 前に — posisi ke-3 (★ jawaban)
  - B. 始まる — posisi ke-2
  - C. 会議が — posisi ke-1
  - D. 配っておいて — posisi ke-4

<sub>Lama: 私は 来年から 日本の 大学に ＿＿＿ ★＿＿＿ ＿＿＿ ＿＿＿ 毎日 日本語を 勉強して います。 — ✓ことに / 留学する / 決めた / ので、</sub>

---

### 43. 子どものころ ＿＿＿ ★＿＿＿ ＿＿＿ ＿＿＿ 、今でもよく覚えている。

- ✓ A. 行った
- 　 B. 家族で
- 　 C. ことは
- 　 D. 海の

*Alasan:* Urutan yang benar: B → A → D → C, sehingga kalimatnya 「子どものころ家族で行った海のことは、今でもよく覚えている。」. Kotak ★ ada di posisi ke-2, yaitu 「行った」. Kuncinya: Klausa penjelas kata benda (家族で行った海).

  - A. 行った — posisi ke-2 (★ jawaban)
  - B. 家族で — posisi ke-1
  - C. ことは — posisi ke-4
  - D. 海の — posisi ke-3

<sub>Lama: 来月から 本社に ＿＿＿ ★＿＿＿ ＿＿＿ ＿＿＿ 引っ越しの 準備を して います。 — ✓ことに / なった / ので、 / 転勤する</sub>

---

### 44. 雨が ＿＿＿ ＿＿＿ ＿＿＿ ★＿＿＿ 、試合は予定どおり行われた。

- 　 A. いた
- 　 B. 降って
- ✓ C. にもかかわらず
- 　 D. 強く

*Alasan:* Urutan yang benar: D → B → A → C, sehingga kalimatnya 「雨が強く降っていたにもかかわらず、試合は予定どおり行われた。」. Kotak ★ ada di posisi ke-4, yaitu 「にもかかわらず」. Kuncinya: 〜にもかかわらず.

  - A. いた — posisi ke-3
  - B. 降って — posisi ke-2
  - C. にもかかわらず — posisi ke-4 (★ jawaban)
  - D. 強く — posisi ke-1

<sub>Lama: 健康の ために、 ＿＿＿ ＿＿＿ ＿＿＿ ★＿＿＿ して います。 — 三十分 / 歩く / 毎日 / ✓ように</sub>

---

### 45. 説明を ＿＿＿ ＿＿＿ ★＿＿＿ ＿＿＿ 、わからないところがあった。

- 　 A. 何度
- ✓ B. 聞いた
- 　 C. も
- 　 D. のに

*Alasan:* Urutan yang benar: A → C → B → D, sehingga kalimatnya 「説明を何度も聞いたのに、わからないところがあった。」. Kotak ★ ada di posisi ke-3, yaitu 「聞いた」. Kuncinya: 何度も + 〜のに.

  - A. 何度 — posisi ke-1
  - B. 聞いた — posisi ke-3 (★ jawaban)
  - C. も — posisi ke-2
  - D. のに — posisi ke-4

<sub>Lama: この 薬を 飲んで から、 ＿＿＿ ＿＿＿ ★＿＿＿ ＿＿＿ 。 — 夜 ぐっすり / ねむれる / ✓ように / なりました</sub>

---

## 問題8 文章の文法 — Tata bahasa dalam teks

> **Bacaan p0** (Teks untuk 文章の文法 (作文))
>
> 一年間の日本の生活 / 日本に来て、もうすぐ一年になります。来たばかりのころは日本語がほとんどわからず、買い物をするのも大変でした。【46】、近所のスーパーの店員さんは、いつもゆっくり話してくれました。そのおかげで、少しずつ店で話せるようになりました。 / 先月、国から来た友達を、そのスーパーに連れて行きました。友達は日本語ができないので、私が通訳をしました。店員さんは「日本語、上手になりましたね」と言ってくれました。一年前の自分を思い出して、とてもうれしく【47】。

### 46. 【46】に入るものはどれか。

- 　 A. それに
- ✓ B. でも
- 　 C. だから
- 　 D. つまり

*Alasan:* Sebelumnya: belanja sulit karena tidak paham bahasa Jepang. Sesudahnya: pegawai selalu bicara pelan (hal yang menolong). Hubungan berlawanan → でも.

  - A. それに — Salah. それに = selain itu (menambah hal sejenis), padahal isinya berlawanan.
  - B. でも — BENAR. Benar: でも (tetapi) — kontras.
  - C. だから — Salah. だから = karena itu; pegawai bicara pelan bukan akibat penulis kesulitan.
  - D. つまり — Salah. つまり = dengan kata lain (merangkum).

<sub>Lama: 昨日は 朝から 熱が ありました。（　　　）、会社を 休んで 病院へ 行きました。 — ところが / たとえば / ✓そこで / しかし</sub>

---

### 47. 【47】に入るものはどれか。

- ✓ A. なりました
- 　 B. してもらいました
- 　 C. なるでしょう
- 　 D. させました

*Alasan:* Perasaan penulis sendiri pada saat itu (lampau): うれしくなりました.

  - A. なりました — BENAR. Benar: うれしくなりました = menjadi senang.
  - B. してもらいました — Salah. うれしくしてもらいました = tidak gramatikal.
  - C. なるでしょう — Salah. うれしくなるでしょう = dugaan masa depan; ceritanya sudah terjadi.
  - D. させました — Salah. うれしくさせました = membuat (orang lain) senang — subjeknya salah.

<sub>Lama: この 店の ケーキは とても 有名です。（　　　）、いつも 長い 行列が できて います。 — たとえば / それとも / ところで / ✓そのため</sub>

---

## 問題9 読解 — Pemahaman bacaan

> **Bacaan p1** (Teks pendek (内容理解・短文) — email)
>
> 営業部の皆さん /  / 来週の水曜日に予定していた営業会議は、部長の出張のため、木曜日の午後二時からに変更になりました。場所は変わらず、三階の第二会議室です。 / なお、会議で使う資料は前の日までに各自で印刷し、当日持ってきてください。木曜日の午後に都合が悪い人は、明日中に山本までメールで連絡してください。 /  / 山本

### 48. このメールを読んだ人が、しなければならないことは何か。

- 　 A. 明日中に山本さんにメールを送る
- 　 B. 部長に会議の時間が変わったことを連絡する
- 　 C. 水曜日に第二会議室で資料を受け取る
- ✓ D. 水曜日までに会議の資料を印刷しておく

*Alasan:* Rapat jadi hari Kamis; materi dicetak sendiri paling lambat sehari sebelumnya → Rabu.

  - A. 明日中に山本さんにメールを送る — Salah. Email hanya untuk yang TIDAK bisa hadir Kamis siang — bukan semua orang.
  - B. 部長に会議の時間が変わったことを連絡する — Salah. Justru manajer yang dinas; tidak ada perintah menghubunginya.
  - C. 水曜日に第二会議室で資料を受け取る — Salah. Materi tidak dibagikan; masing-masing mencetak sendiri.
  - D. 水曜日までに会議の資料を印刷しておく — BENAR. Benar.

<sub>Lama: 朝市について、正しいものはどれか。 — 夜に開かれる / ✓農家が野菜や果物をスーパーより安く売っている / 毎週日曜日に開かれる / 果物は売っていない</sub>

---

> **Bacaan p2** (Teks pendek (内容理解・短文) — esai)
>
> 小さいころ、私は野菜が大嫌いだった。特にピーマンは、においをかぐだけでいやだった。ところが、大学生になって一人で暮らし始め、近所の人に畑を借りて野菜を育ててみると、考えが変わった。毎日水をやり、少しずつ大きくなるのを見ていると、とれたピーマンを捨てる気にはなれなかった。思い切って食べてみると、思っていたほど苦くなかった。今では、ピーマンは好きな野菜の一つである。

### 49. 「私」がピーマンを食べられるようになったのはなぜか。

- 　 A. 店で売っているピーマンが苦くなかったから
- 　 B. 一人暮らしで、ほかに食べる物がなかったから
- ✓ C. 自分で育てたピーマンを無駄にしたくなかったから
- 　 D. 近所の人にピーマンの料理を教えてもらったから

*Alasan:* Setelah merawat sendiri, ia tidak tega membuang paprika hasil panen, lalu mencoba memakannya.

  - A. 店で売っているピーマンが苦くなかったから — Salah. Yang tidak sepahit dugaan adalah paprika tanamannya sendiri, bukan dari toko.
  - B. 一人暮らしで、ほかに食べる物がなかったから — Salah. Tidak disebut kekurangan makanan.
  - C. 自分で育てたピーマンを無駄にしたくなかったから — BENAR. Benar.
  - D. 近所の人にピーマンの料理を教えてもらったから — Salah. Tetangga hanya meminjamkan ladang, tidak mengajari masak.

<sub>Lama: 「私」は一人で映画を見ることをどう思っているか。 — 友達と行くほうがずっとよい / さびしいのでもう行きたくない / ✓好きな席に座れて、ゆっくり感想を考えられるのでいい / お金がかかるのでよくない</sub>

---

> **Bacaan p3** (Teks pendek (内容理解・短文) — pengumuman)
>
> 市民プールをご利用の皆様へ / 七月一日から八月三十一日までは、利用者が多いため、営業時間を午前九時から午後八時までに延長します。ただし、毎週月曜日は清掃のため休みです。月曜日が祝日の場合は営業し、次の日を休みとします。また、小学生以下のお子様は、大人と一緒でなければ利用できませんので、ご注意ください。 / みどり市　スポーツ課

### 50. このお知らせからわかることは何か。

- 　 A. 夏の間は、毎日午後八時まで泳ぐことができる
- ✓ B. 祝日の次の日の火曜日に、プールが休みになることがある
- 　 C. 小学生は、一人でもプールを利用することができる
- 　 D. 七月の祝日の月曜日には、プールは休みになる

*Alasan:* Jika Senin hari libur nasional, kolam buka dan tutup keesokan harinya (Selasa).

  - A. 夏の間は、毎日午後八時まで泳ぐことができる — Salah. Senin tutup, jadi tidak setiap hari.
  - B. 祝日の次の日の火曜日に、プールが休みになることがある — BENAR. Benar.
  - C. 小学生は、一人でもプールを利用することができる — Salah. Anak SD harus bersama orang dewasa.
  - D. 七月の祝日の月曜日には、プールは休みになる — Salah. Justru Senin libur nasional kolam BUKA.

<sub>Lama: 電池を長持ちさせるために、何をするといいか。 — 明るい場所で使う / 電源を入れたままにする / ✓画面を暗くして、使っていないアプリを閉じる / 音楽を大きくする</sub>

---

> **Bacaan p4** (Teks pendek (内容理解・短文) — opini)
>
> 最近、会議の資料を紙で配らず、各自がパソコンやタブレットで見る会社が増えている。紙を使わないので費用が減るし、資料をなくす心配もない。しかし、画面で読むと大事なところを見落としやすい、という人もいる。私は、全部を画面にするのではなく、細かく読む必要がある資料だけは紙で配るのがいいと思う。道具は、目的に合わせて選ぶべきだ。

### 51. 筆者の考えに合うものはどれか。

- 　 A. パソコンが使える人だけが、画面で資料を見るほうがいい
- 　 B. 会議の資料は、費用がかからないので全部画面で見るほうがいい
- 　 C. 会議の資料は、見落としがないように全部紙で配るほうがいい
- ✓ D. 細かく読む必要がある資料は、紙で配るほうがいい

*Alasan:* Penulis tidak memilih semua layar atau semua kertas; hanya materi yang perlu dibaca teliti dibagikan di kertas.

  - A. パソコンが使える人だけが、画面で資料を見るほうがいい — Salah. Kemampuan memakai laptop tidak dibahas.
  - B. 会議の資料は、費用がかからないので全部画面で見るほうがいい — Salah. Penulis menolak 'semua di layar'.
  - C. 会議の資料は、見落としがないように全部紙で配るほうがいい — Salah. Penulis juga tidak menyarankan semua kertas.
  - D. 細かく読む必要がある資料は、紙で配るほうがいい — BENAR. Benar.

<sub>Lama: 「私」の無駄遣いが減ったのはなぜか。 — 給料が上がったから / ✓給料が入ったらすぐ一部を別の口座に移すから / 家族に管理してもらっているから / 買い物に行かなくなったから</sub>

---

> **Bacaan p5** (Teks menengah (内容理解・中文))
>
> 先月、駅前の古い商店街に、小さな本屋が開いた。店に置いてある本は二千冊ほどで、大きな書店と比べるとずっと少ない。しかし、この店はいつも客でにぎわっている。 / 理由の一つは、店長が選んだ本に、手書きのカードが付いていることだ。カードには、その本のどこがおもしろいのか、どんな人に読んでほしいのかが、短い言葉で書かれている。＿それを読んでいるうちに＿、今まで興味がなかった分野の本でも、つい手に取ってしまう。 / もう一つは、店の奥に、本を読んだ人どうしが話せるスペースがあることだ。毎週土曜日の夜には、同じ本を読んだ人が集まって、感想を話し合う会が開かれる。参加者の多くは、最初は一人で来た人たちだそうだ。 / インターネットで、いつでもすぐに本が買える時代である。それでも人がこの店に足を運ぶのは、本だけでなく、新しい本や人との出会いを求めているからではないだろうか。

### 52. ＿それを読んでいるうちに＿とあるが、何を読んでいるうちにか。

- 　 A. 大きな書店にある本の紹介
- ✓ B. 店長が本に付けたカード
- 　 C. インターネットの本の紹介
- 　 D. 客が書いた本の感想

*Alasan:* それ merujuk ke kartu tulisan tangan dari pemilik toko di kalimat sebelumnya.

  - A. 大きな書店にある本の紹介 — Salah. Toko besar hanya pembanding jumlah buku.
  - B. 店長が本に付けたカード — BENAR. Benar.
  - C. インターネットの本の紹介 — Salah. Internet disebut di paragraf terakhir, tidak terkait それ.
  - D. 客が書いた本の感想 — Salah. Kesan pembaca dibicarakan di acara Sabtu, bukan ditulis.

<sub>Lama: 「私」は部活動でどんな経験をしたか。 — すぐにやめた / 試合に出られなかった / 一人で練習した / ✓仲間と頑張って強い絆が生まれた</sub>

---

### 53. 土曜日の夜の会について、正しいものはどれか。

- ✓ A. 同じ本を読んだ人たちが感想を話し合う会である
- 　 B. 店の本を二千冊に増やすための会である
- 　 C. 友達と一緒に来なければ参加できない
- 　 D. 店長が本の選び方を説明する会である

*Alasan:* Teks: 同じ本を読んだ人が集まって、感想を話し合う会.

  - A. 同じ本を読んだ人たちが感想を話し合う会である — BENAR. Benar.
  - B. 店の本を二千冊に増やすための会である — Salah. 2.000 buku adalah jumlah saat ini, tidak terkait acara.
  - C. 友達と一緒に来なければ参加できない — Salah. Kebanyakan peserta awalnya datang sendirian.
  - D. 店長が本の選び方を説明する会である — Salah. Pemilik toko tidak disebut memberi penjelasan di acara itu.

<sub>Lama: 「私」にとって、あの経験は何か。 — ✓何より大切な宝物 / 役に立たなかったこと / つらいだけの時間 / 忘れたい思い出</sub>

---

### 54. 筆者は、人がこの本屋に来るのはなぜだと考えているか。

- 　 A. 駅から近くて、いつでも本が買えるから
- 　 B. 大きな書店より本の値段が安いから
- 　 C. インターネットでは本を買うのが難しいから
- ✓ D. 新しい本や人との出会いを期待しているから

*Alasan:* Kesimpulan penulis di kalimat terakhir.

  - A. 駅から近くて、いつでも本が買えるから — Salah. Lokasi dekat stasiun disebut, tapi bukan alasan menurut penulis.
  - B. 大きな書店より本の値段が安いから — Salah. Harga tidak dibahas.
  - C. インターネットでは本を買うのが難しいから — Salah. Justru internet disebut memudahkan membeli buku.
  - D. 新しい本や人との出会いを期待しているから — BENAR. Benar.

<sub>Lama: 敬語が難しいと言われる理由は何か。 — 文字が多いから / 辞書がないから / ✓相手によって言い方を使い分けるから / 発音が難しいから</sub>

---

> **Bacaan p6** (Teks panjang (内容理解・長文))
>
> 私は三年前から、日本の会社で働いている。来日したばかりのころ、いちばん驚いたのは、電車が時刻表どおりに来ることだった。私の国では、電車が十分や二十分遅れるのは普通で、だれも気にしない。ところが日本では、一分遅れただけで、駅員が「ご迷惑をおかけしました」と謝るのだ。 / 会社でも同じだった。会議は時間ちょうどに始まり、決められた時間に終わる。最初の一か月、私は何度か会議に数分遅れて、そのたびに先輩に注意された。正直に言うと、＿①そのときは少しきゅうくつに感じた＿。数分ぐらい遅れても、仕事の結果には関係ないだろうと思っていたからだ。 / 考えが変わったのは、あるプロジェクトのリーダーを任されたときだった。メンバーが一人でも遅れると、全員がその人を待たなければならない。十人の会議で一人が五分遅れれば、合わせて五十分の時間が無駄になる。時間を守ることは、自分のためではなく、周りの人の時間を大切にすることなのだと、そのとき初めて気がついた。 / とはいえ、私は日本のやり方がすべて正しいとは思わない。予定どおりに進めることばかり気にして、途中で出たいい意見を「時間がないから」と次の会議に回してしまうこともある。時間を守ることは大切だが、それはあくまでも、よい仕事をするための手段であって、目的ではない。＿②このこと＿を、これからも忘れないでいたい。

### 55. ＿①そのときは少しきゅうくつに感じた＿とあるが、なぜか。

- ✓ A. 少しぐらい遅れても、仕事には影響がないと思っていたから
- 　 B. 会議が決められた時間に終わらなかったから
- 　 C. 先輩の注意のしかたが厳しすぎたから
- 　 D. 日本の電車がいつも遅れて来たから

*Alasan:* Kalimat berikutnya memberi alasan: ia mengira terlambat beberapa menit tidak berpengaruh pada hasil kerja.

  - A. 少しぐらい遅れても、仕事には影響がないと思っていたから — BENAR. Benar.
  - B. 会議が決められた時間に終わらなかったから — Salah. Rapat selesai tepat waktu.
  - C. 先輩の注意のしかたが厳しすぎたから — Salah. Cara menegur senior tidak dikomentari.
  - D. 日本の電車がいつも遅れて来たから — Salah. Kereta di Jepang justru tepat waktu.

<sub>Lama: 筆者が大切だと考えていることは何か。 — 完璧に話すこと / 早く話すこと / 敬語を使わないこと / ✓相手を思いやる気持ちを示すこと</sub>

---

### 56. 筆者が、時間を守ることについて考えを変えたのはどんなときか。

- ✓ A. リーダーになって、遅れた人を待つ立場になったとき
- 　 B. 会議で出た意見を、次の会議に回したとき
- 　 C. 会議に遅れて、先輩に注意されたとき
- 　 D. 来日して、電車が時刻表どおりに来るのを見たとき

*Alasan:* 「考えが変わったのは、あるプロジェクトのリーダーを任されたときだった」.

  - A. リーダーになって、遅れた人を待つ立場になったとき — BENAR. Benar.
  - B. 会議で出た意見を、次の会議に回したとき — Salah. Itu kritik penulis terhadap cara Jepang, bukan saat pandangannya berubah.
  - C. 会議に遅れて、先輩に注意されたとき — Salah. Saat ditegur ia justru merasa terkekang.
  - D. 来日して、電車が時刻表どおりに来るのを見たとき — Salah. Saat itu ia hanya terkejut, pandangannya belum berubah.

<sub>Lama: 地方へ移り住む人が増えている理由として、正しいものはどれか。 — ✓リモートワークで会社に通わなくても働けるようになったから / 電車が便利になったから / 地方に会社が増えたから / 都会の家賃が安くなったから</sub>

---

### 57. ＿②このこと＿とは何か。

- ✓ A. 時間を守るのは、よい仕事をするためだということ
- 　 B. 日本の会議は、時間ちょうどに始まるということ
- 　 C. 会議に一人が遅れると、多くの時間が無駄になるということ
- 　 D. いい意見は、次の会議で話すべきだということ

*Alasan:* このこと merujuk kalimat sebelumnya: menepati waktu hanyalah sarana untuk kerja yang baik, bukan tujuan.

  - A. 時間を守るのは、よい仕事をするためだということ — BENAR. Benar.
  - B. 日本の会議は、時間ちょうどに始まるということ — Salah. Fakta di paragraf 2, bukan yang ingin terus diingat.
  - C. 会議に一人が遅れると、多くの時間が無駄になるということ — Salah. Isi paragraf 3, bukan rujukan このこと.
  - D. いい意見は、次の会議で話すべきだということ — Salah. Penulis justru mengkritik penundaan ide.

<sub>Lama: 地方で暮らして、戸惑うことの例として挙げられているものはどれか。 — 自然が少ないこと / 店が多すぎること / ✓近所づきあいが思っていたより密なこと / 家賃が高いこと</sub>

---

### 58. この文章で、筆者がいちばん言いたいことは何か。

- 　 A. 日本のやり方はきゅうくつなので、変えたほうがいい
- 　 B. 時間に遅れても、いい意見を出せば問題はない
- ✓ C. 時間を守ることは大切だが、それだけを気にするべきではない
- 　 D. 会議では、時間を守ることが何よりも大切だ

*Alasan:* Penulis mengakui pentingnya tepat waktu, tetapi mengingatkan agar tidak menjadikannya tujuan.

  - A. 日本のやり方はきゅうくつなので、変えたほうがいい — Salah. Rasa terkekang hanya di awal; penulis tidak menyuruh mengubah semuanya.
  - B. 時間に遅れても、いい意見を出せば問題はない — Salah. Penulis tetap menganggap tepat waktu penting.
  - C. 時間を守ることは大切だが、それだけを気にするべきではない — BENAR. Benar.
  - D. 会議では、時間を守ることが何よりも大切だ — Salah. Terlalu mutlak; penulis menyebut itu bukan tujuan.

<sub>Lama: 移住を決める前に、何が大切だと言っているか。 — ✓何度か訪れて、実際の暮らしを体験しておくこと / すぐに家を買うこと / 都会に戻らないと決めること / 自治体に何も聞かないこと</sub>

---

> **Bacaan p7** (Mencari informasi (情報検索))
>
> さくら料理教室　十月のクラス案内 / クラス曜日・時間料金（1回）内容A　和食の基本火曜　10:00〜12:002,500円だしの取り方、みそ汁B　家庭のパン木曜　18:30〜20:303,000円食パン、ロールパンC　簡単おもてなし料理土曜　10:00〜12:303,500円パーティー料理D　親子でクッキング日曜　14:00〜16:00親子2人で4,000円クッキー、ピザ（小学生と保護者）・材料費は料金に含まれています。 / ・初めての方は、1回目の料金が500円引きになります。 / ・エプロンとタオルをお持ちください。Dクラスはお子様の分もお持ちください。 / ・予約は、前の週の金曜日までに、電話またはホームページでお願いします。

### 59. 会社員のマリアさんは、平日は午後七時まで働いていて、週末は土曜日だけ時間がある。初めてこの教室に参加する。マリアさんが払う料金はいくらか。

- 　 A. 2,000円
- 　 B. 2,500円
- ✓ C. 3,000円
- 　 D. 3,500円

*Alasan:* Hari kerja sampai jam 7 malam → kelas A (Selasa pagi) dan B (Kamis 18.30) tidak bisa; Minggu tidak bisa → kelas C 3.500 yen − potongan peserta baru 500 = 3.000 yen.

  - A. 2,000円 — Salah. 2.000 = kelas A dikurangi potongan, tapi kelas A Selasa pagi.
  - B. 2,500円 — Salah. 2.500 = harga kelas A.
  - C. 3,000円 — BENAR. Benar: 3.500 − 500.
  - D. 3,500円 — Salah. 3.500 = harga kelas C tanpa potongan peserta baru.

<sub>Lama: ハンさんは平日は学校があるので、土曜日と日曜日に働きたい。英語は話せない。条件に合う仕事の中で、時給がいちばん高いものはどれか。 — 本屋 / ✓ホテルの受付 / コンビニ / レストラン</sub>

---

### 60. 小学三年生の子どもと一緒にDクラスに参加したい。正しいものはどれか。

- 　 A. 親も子どもも一人4,000円ずつ払う
- ✓ B. 子どものエプロンとタオルも持っていく
- 　 C. 材料費を受付で料金とは別に払う
- 　 D. 当日の朝、教室に電話して予約する

*Alasan:* Untuk kelas D, celemek dan handuk anak juga dibawa.

  - A. 親も子どもも一人4,000円ずつ払う — Salah. 4.000 yen untuk orang tua + anak (berdua), bukan per orang.
  - B. 子どものエプロンとタオルも持っていく — BENAR. Benar.
  - C. 材料費を受付で料金とは別に払う — Salah. Biaya bahan sudah termasuk.
  - D. 当日の朝、教室に電話して予約する — Salah. Reservasi paling lambat Jumat minggu sebelumnya.

<sub>Lama: リンさんは平日は学校があるので、土曜日と日曜日に働きたい。英語は話せない。条件に合う仕事の中で、時給がいちばん高いものはどれか。 — レストラン / ✓コンビニ / 本屋 / ホテルの受付</sub>

---

## 問題10 課題理解 — Pemahaman tugas

### 61. 男の人はこのあとまず何をしますか。

<details><summary>Transkrip audio</summary>

- N: 1番
- N: 会社で女の人と男の人が話しています。男の人はこのあとまず何をしますか。
- F: 木村さん、来週の新商品の説明会、準備はどう？
- M: 会場は予約してありますし、お客様への案内のメールも昨日送りました。
- F: ありがとう。配る資料は？
- M: 今、最後のチェックをしているところです。終わったら百部印刷します。
- F: あ、それなんだけど、新商品の値段が少し変わるかもしれないって、さっき部長から連絡があったの。夕方には決まるそうだから、印刷はそれからにして。
- M: わかりました。じゃあ、それまでに会場のマイクとプロジェクターを確かめておきます。
- F: それは当日の朝でいいわ。それより、お客様から返事が来ているか見てくれる？来る人数がわからないと、いすが並べられないから。
- M: はい、すぐ確認します。
- N: 男の人はこのあとまず何をしますか。

</details>

- 　 A. 資料を百部印刷する
- 　 B. 新商品の値段を部長に聞く
- 　 C. マイクとプロジェクターを確かめる
- ✓ D. お客様からの返事を確認する

*Alasan:* Cetak ditunda sampai sore, cek mikrofon cukup hari-H; yang diminta sekarang: cek balasan tamu.

  - A. 資料を百部印刷する — Salah. Ditunda sampai harga diputuskan sore nanti.
  - B. 新商品の値段を部長に聞く — Salah. Harga akan diputuskan; tidak ada tugas menanyakan ke manajer.
  - C. マイクとプロジェクターを確かめる — Salah. Dikatakan cukup dilakukan pada pagi hari-H.
  - D. お客様からの返事を確認する — BENAR. Benar: 「すぐ確認します」.

<sub>Lama: 女の人はこのあとまず何をしますか。 — 資料を 印刷する / ホテルを 予約する / ✓旅行会社に 電話する / 部長に 連絡する · dialog: 明日の出張の資料、もう印刷した？ はい、人数分、できています。 切符は？ それはまだなんです。今から旅行会社に電話します。 頼むよ。ホテルの予約は私がしておいたから。 わかりました。</sub>

---

### 62. 学生は来週の月曜日までに何をしなければなりませんか。

<details><summary>Transkrip audio</summary>

- N: 2番
- N: 日本語学校で先生が学生に話しています。学生は来週の月曜日までに何をしなければなりませんか。
- F: 皆さん、来週の金曜日はスピーチ大会ですね。今日は準備について話します。まず、スピーチの原稿ですが、来週の月曜日までに私に出してください。読んで、直したほうがいいところに印をつけて、水曜日に返します。スピーチの題は、もう皆さんから聞いていますから、出さなくていいです。発表の順番は、大会の前の日にくじで決めます。それから、当日は写真を撮りますが、撮られたくない人は、大会の日の朝、受付で言ってください。
- N: 学生は来週の月曜日までに何をしなければなりませんか。

</details>

- 　 A. スピーチの題を先生に伝える
- ✓ B. スピーチの原稿を先生に出す
- 　 C. 発表の順番をくじで決める
- 　 D. 写真について受付で話す

*Alasan:* Tenggat Senin = naskah pidato. Judul sudah disampaikan; undian & urusan foto bukan sebelum Senin.

  - A. スピーチの題を先生に伝える — Salah. Judul sudah disampaikan sebelumnya.
  - B. スピーチの原稿を先生に出す — BENAR. Benar: tenggat Senin.
  - C. 発表の順番をくじで決める — Salah. Dilakukan sehari sebelum lomba (Kamis).
  - D. 写真について受付で話す — Salah. Pada pagi hari lomba, dan hanya bagi yang tidak mau difoto.

<sub>Lama: 息子は先に何をしなければなりませんか。 — 部屋を 片づける / ✓宿題を する / 遊びに 行く / 母の 手伝いを する · dialog: 太郎、遊びに行く前に、宿題はやったの？ 後でやるよ。 だめ。それに、部屋も散らかってるでしょう。 わかったよ。じゃあ、まず片づけてから、宿題をやる。 先に宿題を終わらせたほうがいいんじゃない？片づけは帰ってきてからでいいから。 そっか。わかった。</sub>

---

### 63. 女の人はこのあと何をしますか。

<details><summary>Transkrip audio</summary>

- N: 3番
- N: 女の人と男の人が電話で話しています。女の人はこのあと何をしますか。
- M: もしもし、今、駅に着いたんだけど、どこにいる？
- F: ごめん、まだ家なの。出かけようとしたら宅配便が来て。あと二十分ぐらいかかりそう。
- M: そっか。じゃあ、先に店に行って並んでるよ。あの店、昼はいつも混んでるから。
- F: ありがとう。あ、でも、さっき店のホームページを見たら、今日はお休みだって。
- M: え、本当？じゃあ、どうしよう。
- F: 駅ビルの中にパスタの店があったよね。そこにしない？
- M: いいね。じゃあ、駅ビルの入り口で待ってるよ。
- F: うん、急いで行くね。
- N: 女の人はこのあと何をしますか。

</details>

- 　 A. 宅配便を受け取る
- 　 B. 店に並んで待つ
- ✓ C. 駅ビルに向かう
- 　 D. 店のホームページを見る

*Alasan:* Paket sudah datang, situs sudah dicek, restoran tutup → dia segera berangkat ke gedung stasiun.

  - A. 宅配便を受け取る — Salah. Paket sudah datang.
  - B. 店に並んで待つ — Salah. Itu rencana awal pria, dibatalkan karena toko tutup.
  - C. 駅ビルに向かう — BENAR. Benar: 「急いで行くね」.
  - D. 店のホームページを見る — Salah. Sudah dilihat tadi.

<sub>Lama: 男の学生はレポートをどうしますか。 — ✓週末に 集中して 書く / 先生に 延ばして もらう / 友達に 手伝って もらう / 提出しない · dialog: 田中君、レポートの締め切り、来週の月曜日だよ。 知ってるけど、まだ半分しか書けてなくて。 先生に頼んで、少し延ばしてもらったら？ 前に一度延ばしてもらったから、もう言いにくいよ。 じゃあ、土日に頑張るしかないね。 そうだね。図書館で資料を借りて、週末に集中して書くことにする。</sub>

---

### 64. 男の学生はこのあとまず何をしなければなりませんか。

<details><summary>Transkrip audio</summary>

- N: 4番
- N: 大学で男の学生と事務室の人が話しています。男の学生はこのあとまず何をしなければなりませんか。
- M: すみません、奨学金の申し込みをしたいんですが。
- F: はい。この申込書に記入して、成績証明書と一緒に出してください。
- M: 成績証明書はどこでもらえますか。
- F: 一階の機械で出せますよ。学生証が必要です。
- M: あ、学生証、今日は持ってきていないんです。
- F: じゃあ、証明書は明日でもいいですよ。締め切りは金曜日ですから。ただ、申込書には先生のサインが必要なので、先にそれをもらっておいてください。先生が出張でいらっしゃらないこともありますから。
- M: わかりました。じゃあ、今からゼミの先生の研究室に行ってみます。
- N: 男の学生はこのあとまず何をしなければなりませんか。

</details>

- 　 A. 申込書に記入する
- 　 B. 成績証明書を出す
- 　 C. 学生証を取りに帰る
- ✓ D. 先生にサインをもらう

*Alasan:* Sertifikat nilai boleh besok; yang harus duluan: tanda tangan dosen (bisa sedang dinas).

  - A. 申込書に記入する — Salah. Perlu dilakukan, tapi petugas menekankan tanda tangan dosen 'dulu' (先に).
  - B. 成績証明書を出す — Salah. Boleh besok; kartu mahasiswa tertinggal.
  - C. 学生証を取りに帰る — Salah. Tidak perlu, sertifikat boleh besok.
  - D. 先生にサインをもらう — BENAR. Benar: 「先にそれをもらっておいて」.

<sub>Lama: 女の人はどの電車に乗りますか。 — 普通 / 特急 / バス / ✓急行 · dialog: すみません、空港へ行きたいんですが、どの電車がいいですか。 急行なら四十分ですが、特急のほうが十五分早いです。 特急は別料金ですよね。 はい。五百円かかります。 飛行機は一時間半後なので、急行でも間に合いそうですね。じゃあ、急行にします。</sub>

---

### 65. アルバイトの人たちは、まず何をしますか。

<details><summary>Transkrip audio</summary>

- N: 5番
- N: スーパーで店長がアルバイトの人たちに話しています。アルバイトの人たちは、まず何をしますか。
- M: おはようございます。今日は午後から雨の予報なので、入り口に傘の袋を置いてください。でも、それは雨が降り出してからで大丈夫です。それから、今日は卵の特売日なので、店が開く前に卵の棚をいっぱいにしておいてください。お客さんが多い日ですから、レジは十時から三台とも開けます。あ、その前に、昨日の夜、冷凍食品のケースの温度が少し高かったので、まず全部のケースの温度を確認してから、ほかの仕事を始めてください。では、今日もよろしくお願いします。
- N: アルバイトの人たちは、まず何をしますか。

</details>

- 　 A. 入り口に傘を入れる袋を置く
- 　 B. 卵の棚を卵でいっぱいにする
- 　 C. レジを三台とも開ける
- ✓ D. 冷凍食品のケースの温度を見る

*Alasan:* 「まず全部のケースの温度を確認してから、ほかの仕事を」 → cek suhu freezer dulu.

  - A. 入り口に傘を入れる袋を置く — Salah. Setelah hujan turun.
  - B. 卵の棚を卵でいっぱいにする — Salah. Sebelum toko buka, tapi setelah cek suhu.
  - C. レジを三台とも開ける — Salah. Jam 10.
  - D. 冷凍食品のケースの温度を見る — BENAR. Benar: 「まず全部のケースの温度を確認してから」.

<sub>Lama: 男の人は何を買ってきますか。 — 緑茶 / ✓紅茶 / お菓子 / 紅茶と お菓子 · dialog: 来週のお客さんのために、お茶とお菓子を準備してくれる？ はい。お茶は倉庫にありますよね。 倉庫にあるのは緑茶だけ。紅茶も欲しいな。 じゃあ、紅茶とお菓子を買ってきます。 お菓子は私が頼んであるから、紅茶だけでいいよ。 わかりました。</sub>

---

### 66. 夫は何を買ってきますか。

<details><summary>Transkrip audio</summary>

- N: 6番
- N: 家で夫と妻が話しています。夫は何を買ってきますか。
- F: ねえ、駅前のスーパーに行くなら、牛乳と卵、買ってきてくれない？
- M: いいよ。ほかには？
- F: えっと、パンもなかったかな。あ、パンはさっき、お隣の山田さんからいただいたんだった。
- M: じゃあ、牛乳と卵だけ？
- F: あ、卵はまだ冷蔵庫に六個あるから、今日はいいや。そのかわり、明日のお弁当用にトマトをお願い。
- M: 牛乳とトマトね。牛乳は一本でいい？
- F: 週末、母が来るから、二本にして。
- M: わかった。ついでに何かほしいものある？
- F: ううん、それだけで大丈夫。ありがとう。
- N: 夫は何を買ってきますか。

</details>

- 　 A. 牛乳一本と卵
- ✓ B. 牛乳二本とトマト
- 　 C. 牛乳二本と卵とパン
- 　 D. 牛乳一本とトマト

*Alasan:* Roti sudah dapat, telur masih ada → susu (2 botol) + tomat.

  - A. 牛乳一本と卵 — Salah. Telur dibatalkan, susu jadi dua.
  - B. 牛乳二本とトマト — BENAR. Benar.
  - C. 牛乳二本と卵とパン — Salah. Roti dan telur tidak perlu.
  - D. 牛乳一本とトマト — Salah. Susu diminta dua botol.

<sub>Lama: 女の人は次に何をしますか。 — 薬局に 行く / 予約を 取る / ✓会計に 行く / 診察を 受ける · dialog: 山本さん、診察は終わりましたので、薬は会計のあとで薬局でもらってください。 会計はどこですか。 一階の右側です。そのあと、駅の方に出て右にある薬局へどうぞ。 次回の予約は？ それは会計で一緒に取れます。</sub>

---

## 問題11 ポイント理解 — Pemahaman poin

### 67. 男の人はどうして引っ越すことにしましたか。

<details><summary>Transkrip audio</summary>

- N: 1番
- N: 会社で女の人と男の人が話しています。男の人はどうして引っ越すことにしましたか。
- F: 田中さん、引っ越すんですって？今のマンション、会社から近くて便利だって言ってたのに。
- M: ええ。便利なのはいいんですけど、最近、隣の部屋の工事がうるさくて。
- F: ああ、それで？
- M: いえ、工事はもうすぐ終わるそうなので、それはいいんです。実は、来年の春から母と一緒に住むことになって。
- F: そうなんですか。
- M: 今の部屋だと二人では狭いので、もう少し広いところを探しているんです。会社からは少し遠くなりますけど。
- N: 男の人はどうして引っ越すことにしましたか。

</details>

- 　 A. 会社から遠いから
- ✓ B. 家族と住むには部屋が狭いから
- 　 C. 隣の部屋の工事がうるさいから
- 　 D. 家賃が高くなったから

*Alasan:* Kebisingan disangkal ("それはいいんです"); alasan sebenarnya: akan tinggal dengan ibu, kamar terlalu sempit.

  - A. 会社から遠いから — Salah. Justru rumah baru akan lebih jauh dari kantor.
  - B. 家族と住むには部屋が狭いから — BENAR. Benar.
  - C. 隣の部屋の工事がうるさいから — Salah. Disangkal: 「それはいいんです」.
  - D. 家賃が高くなったから — Salah. Sewa tidak dibahas.

<sub>Lama: 男の人が会議に遅れた理由は何ですか。 — 寝坊した / ✓電車が 止まった / 道に 迷った / 病気に なった · dialog: 田中さん、遅かったですね。会議、もう終わりましたよ。 すみません。電車が事故で止まっていたんです。 連絡してくれればよかったのに。 携帯の電池が切れてしまって。 次から気をつけてくださいね。</sub>

---

### 68. 女の学生は、留学について何がいちばん心配だと言っていますか。

<details><summary>Transkrip audio</summary>

- N: 2番
- N: 大学で女の学生と男の学生が話しています。女の学生は、留学について何がいちばん心配だと言っていますか。
- M: 来月からアメリカに留学するんだよね。準備はできた？
- F: うん、だいたいね。寮も決まったし。
- M: 英語は大丈夫？
- F: 授業はちょっと不安だけど、去年から英会話学校に通ってたから、なんとかなると思う。それより、食べ物かな。私、アレルギーがあって、食べられない物が多いの。
- M: ああ、それは大変だね。
- F: 食堂の料理に何が入っているか、毎回聞かないといけないでしょう。それがいちばん気になってるんだ。友達は向こうでもすぐできると思うんだけどね。
- N: 女の学生は、留学について何がいちばん心配だと言っていますか。

</details>

- ✓ A. 食事に何が入っているか
- 　 B. 英語の授業についていけるか
- 　 C. 寮が見つかるかどうか
- 　 D. 向こうで友達ができるかどうか

*Alasan:* 「それがいちばん気になってる」 = isi makanan (alergi). Asrama sudah ada, bahasa Inggris "bisa diatasi".

  - A. 食事に何が入っているか — BENAR. Benar: 「それがいちばん気になってる」.
  - B. 英語の授業についていけるか — Salah. Agak cemas, tapi 「なんとかなると思う」.
  - C. 寮が見つかるかどうか — Salah. Asrama sudah ditetapkan.
  - D. 向こうで友達ができるかどうか — Salah. Dia yakin bisa cepat dapat teman.

<sub>Lama: 女の学生はどうして留学を決めましたか。 — ✓先輩の ことばに 勇気が 出た から / お金が 集まった から / 親に すすめられた から / 授業が つまらない から · dialog: 来年、留学するんだって？ うん。実は、最初は迷ってたの。お金も心配だったし。 じゃあ、どうして決めたの？ 先輩が「若いうちにしか経験できないことがあるよ」って言ってくれて。それで勇気が出たの。 へえ、いい先輩だね。</sub>

---

### 69. この町で、今年から新しく始めたことは何ですか。

<details><summary>Transkrip audio</summary>

- N: 3番
- N: ラジオで、ある町の観光課の人が話しています。この町で、今年から新しく始めたことは何ですか。
- M: 私たちの町は、毎年秋になると、紅葉を見に来る観光客でにぎわいます。以前は山の上の駐車場がいつもいっぱいで、道が混んで大変でした。そこで、三年前から、週末は駅から山の上まで無料のバスを走らせています。おかげで、道の混雑はずいぶん減りました。そして今年からは、夜も紅葉を楽しんでいただけるように、お寺の庭をライトで照らすことにしました。十一月の土曜日と日曜日です。ぜひいらしてください。
- N: この町で、今年から新しく始めたことは何ですか。

</details>

- 　 A. 駐車場を広くしたこと
- 　 B. 無料のバスを走らせたこと
- 　 C. 週末に道を通れなくしたこと
- ✓ D. 夜にお寺の庭を明るくしたこと

*Alasan:* Bus gratis sudah sejak 3 tahun lalu; yang baru tahun ini: lampu taman kuil di malam hari.

  - A. 駐車場を広くしたこと — Salah. Parkiran hanya disebut selalu penuh; tidak diperluas.
  - B. 無料のバスを走らせたこと — Salah. Sudah sejak tiga tahun lalu, bukan tahun ini.
  - C. 週末に道を通れなくしたこと — Salah. Jalan tidak ditutup; masalah macet diatasi dengan bus gratis.
  - D. 夜にお寺の庭を明るくしたこと — BENAR. Benar: 「今年からは…ライトで照らす」.

<sub>Lama: 男の人はどうして商品を返しますか。 — サイズが 合わない から / 色が 気に入らない から / 値段が 高い から / ✓ボタンが 取れて いた から · dialog: すみません、昨日買ったシャツなんですが、返品できますか。 どうなさいましたか。サイズが合いませんでしたか。 いえ、サイズはいいんですが、家に帰ってよく見たら、ボタンが一つ取れていて。 申し訳ありません。新しいものと交換いたしますか。 はい、お願いします。</sub>

---

### 70. 男の人は、どうしてこのかばんを買いませんでしたか。

<details><summary>Transkrip audio</summary>

- N: 4番
- N: 店で男の人と店員が話しています。男の人は、どうしてこのかばんを買いませんでしたか。
- M: すみません、このかばん、色はこれだけですか。
- F: いえ、黒と茶色もございます。今、お持ちしますね。…こちらです。
- M: ああ、黒がいいですね。大きさもちょうどいいし。
- F: ありがとうございます。雨にも強い素材になっております。
- M: いいですね。…あれ、ちょっと重いな。
- F: ええ、中に仕切りがたくさんあるので、少し重めなんです。
- M: うーん、毎日パソコンも入れて歩くので、これだとちょっと…。値段は手ごろなんですけどね。もう少し考えます。
- N: 男の人は、どうしてこのかばんを買いませんでしたか。

</details>

- 　 A. 好きな色がなかったから
- ✓ B. 重かったから
- 　 C. 大きさが合わなかったから
- 　 D. 値段が高かったから

*Alasan:* Warna & ukuran cocok, harga terjangkau; masalahnya berat (dibawa setiap hari dengan laptop).

  - A. 好きな色がなかったから — Salah. Ada warna hitam yang disukai.
  - B. 重かったから — BENAR. Benar.
  - C. 大きさが合わなかったから — Salah. 「大きさもちょうどいい」.
  - D. 値段が高かったから — Salah. 「値段は手ごろ」.

<sub>Lama: 妻はどうして引っ越したいと言っていますか。 — 駅から 遠い から / ✓電車の 音が うるさい から / 家賃が 高い から / 部屋が 狭い から · dialog: 今の家、駅から近くて便利なのに、どうして引っ越したいの？ 近いのはいいけど、夜、電車の音がうるさくて眠れないの。 ああ、そうか。 それに、日当たりも悪いし。 確かに。もう少し静かなところを探してみようか。</sub>

---

### 71. 二人は、いつ打ち合わせをすることにしましたか。

<details><summary>Transkrip audio</summary>

- N: 5番
- N: 会社で男の人と女の人が話しています。二人は、いつ打ち合わせをすることにしましたか。
- M: 林さん、来週、新しいプロジェクトの打ち合わせをしたいんだけど、いつがいい？
- F: 月曜と火曜は、一日中お客様のところに行っているんです。
- M: そうか。水曜日の午前は？
- F: 水曜日は大丈夫です。
- M: あ、でも、ぼくが水曜日の午前は会議だった。午後は？
- F: 午後は二時から研修があって、五時まで出られないんです。
- M: じゃあ、木曜日の朝一番はどう？
- F: はい、木曜日なら一日空いています。
- M: よし、じゃあ九時からにしよう。
- N: 二人は、いつ打ち合わせをすることにしましたか。

</details>

- 　 A. 月曜日の午後
- 　 B. 水曜日の午前
- 　 C. 水曜日の午後
- ✓ D. 木曜日の午前

*Alasan:* Senin–Selasa dia keluar, Rabu pagi pria rapat, Rabu sore pelatihan → Kamis jam 9 pagi.

  - A. 月曜日の午後 — Salah. Wanita seharian di klien.
  - B. 水曜日の午前 — Salah. Pria ada rapat.
  - C. 水曜日の午後 — Salah. Wanita pelatihan sampai jam 5.
  - D. 木曜日の午前 — BENAR. Benar: 「九時からにしよう」.

<sub>Lama: 男の人が今の会社を辞めたい一番の理由は何ですか。 — 給料が 低い / 人間関係が よくない / ✓残業が 多い / 仕事が つまらない · dialog: 本当に辞めるんですか。 ええ。給料に不満はないんです。人間関係も悪くないし。 じゃあ、どうして？ 毎日残業が続いて、家族と過ごす時間がまったくなくて。 それは確かに大変ですね。</sub>

---

### 72. 先生は、てんぷらを作るとき、いちばん大切なことは何だと言っていますか。

<details><summary>Transkrip audio</summary>

- N: 6番
- N: 料理教室で先生が話しています。先生は、てんぷらを作るとき、いちばん大切なことは何だと言っていますか。
- F: 今日はてんぷらを作ります。家で作ると失敗しやすい料理ですが、コツさえわかれば難しくありません。てんぷらというと、油の温度が大事だと思う方が多いでしょう。もちろん温度も大事ですが、温度計を使えば、だれでも簡単にわかります。粉も、普通の小麦粉で十分です。いちばん気をつけてほしいのは、衣を混ぜすぎないことです。よく混ぜたくなりますが、混ぜすぎると、ねばりが出て、さくっと揚がりません。少し粉が残っているぐらいで、ちょうどいいんですよ。
- N: 先生は、てんぷらを作るとき、いちばん大切なことは何だと言っていますか。

</details>

- 　 A. 油の温度をはかること
- 　 B. 特別な粉を使うこと
- 　 C. 粉を残さず混ぜること
- ✓ D. 衣をあまり混ぜないこと

*Alasan:* 「いちばん気をつけてほしいのは、衣を混ぜすぎないこと」 → dalam pilihan diparafrasekan menjadi 衣をあまり混ぜないこと.

  - A. 油の温度をはかること — Salah. Penting, tetapi 'mudah bagi siapa saja'.
  - B. 特別な粉を使うこと — Salah. Tepung biasa sudah cukup.
  - C. 粉を残さず混ぜること — Salah. Kebalikannya: sedikit tepung tersisa itu pas.
  - D. 衣をあまり混ぜないこと — BENAR. Benar.

<sub>Lama: 女の学生は何に困っていますか。 — 授業が 難しい / 友達と けんかした / 病気に なった / ✓アルバイトで 睡眠が 足りない · dialog: 最近、授業中に眠そうだね。 すみません。実は、アルバイトが遅くまであって、帰るのが十二時過ぎになるんです。 睡眠時間が足りないんだね。 はい。でも、学費のためにやめられなくて。 先生も奨学金について調べてみるよ。</sub>

---

## 問題12 概要理解 — Pemahaman garis besar

### 73. 男の人は、何について話していますか。

<details><summary>Transkrip audio</summary>

- N: 1番
- N: テレビで、アナウンサーと男の人が話しています。
- F: 山田さんは、会社をやめて農業を始められたそうですね。
- M: ええ、五年前です。最初は野菜がなかなか育たなくて、本当に苦労しました。
- F: 大変だったんですね。
- M: でも、近所の農家の方が、土の作り方から丁寧に教えてくださって。今では、町のレストランにも野菜を届けているんですよ。会社にいたころは毎日忙しくて、季節が変わったことにも気がつかないぐらいでしたが、今は一日一日の変化を感じながら暮らしています。
- N: 男の人は、何について話していますか。
- N: 1、農業を始めてからの生活
- N: 2、会社をやめた理由
- N: 3、おいしい野菜の育て方
- N: 4、レストランの料理

</details>

- ✓ A. 農業を始めてからの生活
- 　 B. 会社をやめた理由
- 　 C. おいしい野菜の育て方
- 　 D. レストランの料理

*Alasan:* Keseluruhan: perjalanan & kehidupan sejak bertani (kesulitan awal → bantuan tetangga → kini merasakan musim).

  - A. 農業を始めてからの生活 — BENAR. Benar — topik keseluruhan.
  - B. 会社をやめた理由 — Salah. Hanya disinggung sedikit.
  - C. おいしい野菜の育て方 — Salah. Cara menanam tidak dijelaskan.
  - D. レストランの料理 — Salah. Restoran hanya penerima sayurnya.

<sub>Lama: 男の人は何について話していますか。 — ✓挨拶の 運動の お知らせ / 新しい 規則の 発表 / 仕事の 内容の 説明 / お客様の 苦情 · dialog: 来週から、会社の入り口で、毎朝、皆さんが挨拶をする運動を始めます。挨拶は仕事の基本です。社員同士はもちろん、お客様にも、元気に声をかけましょう。</sub>

---

### 74. 先生は、何について話していますか。

<details><summary>Transkrip audio</summary>

- N: 2番
- N: 大学の授業で先生が話しています。
- M: 皆さんは、メモを取るとき、全部書こうとしていませんか。聞いたことを全部書こうとすると、書くことに気を取られて、話の内容が頭に入らなくなります。ノートをきれいに書くことが目的ではありません。大切なのは、キーワードだけを書くことです。そして授業が終わったら、その日のうちに、キーワードを見ながら自分の言葉で文にしてみてください。そうすると、内容がしっかり記憶に残ります。慣れるまでは少し時間がかかりますが、ぜひ試してみてください。
- N: 先生は、何について話していますか。
- N: 1、授業でノートを使う理由
- N: 2、記憶力がいい人の特徴
- N: 3、授業の内容をまとめる宿題
- N: 4、効果的なメモの取り方

</details>

- 　 A. 授業でノートを使う理由
- 　 B. 記憶力がいい人の特徴
- 　 C. 授業の内容をまとめる宿題
- ✓ D. 効果的なメモの取り方

*Alasan:* Inti: cara mencatat yang efektif (tulis kata kunci, lalu susun ulang hari itu juga).

  - A. 授業でノートを使う理由 — Salah. Bukan alasan memakai buku catatan.
  - B. 記憶力がいい人の特徴 — Salah. Ciri orang tidak dibahas.
  - C. 授業の内容をまとめる宿題 — Salah. Merangkum disarankan, bukan PR.
  - D. 効果的なメモの取り方 — BENAR. Benar.

<sub>Lama: 女の人は何について話していますか。 — ダイエットの 方法 / 料理の 作り方 / 果物の 値段 / ✓朝ごはんの 大切さ · dialog: 最近、朝ごはんを食べない人が増えているそうです。しかし、朝ごはんを食べると、頭がよく働き、一日の元気が出ると言われています。時間がない人は、バナナやヨーグルトだけでも、食べるようにしましょう。</sub>

---

### 75. 女の人は、新しい図書館についてどう思っていますか。

<details><summary>Transkrip audio</summary>

- N: 3番
- N: 女の人と男の人が、新しくできた図書館について話しています。
- M: 駅の前にできた図書館、行ってみた？
- F: うん、先週の土曜日に行ってきた。建物がきれいで明るくて、気持ちよかったよ。カフェもあって、コーヒーを飲みながら本が読めるの。
- M: へえ、いいね。
- F: でもね、前の図書館に比べて本が少ないんだよね。私が探してた専門書は、ほとんど置いてなかった。勉強するには、ちょっと物足りないかな。
- M: じゃあ、試験の勉強には使えないね。
- F: うん。本を借りるなら、やっぱり大学の図書館に行くと思う。
- N: 女の人は、新しい図書館についてどう思っていますか。
- N: 1、建物も本も満足している
- N: 2、建物はいいが、本が足りない
- N: 3、カフェがあるので毎日行きたい
- N: 4、駅から遠いので不便だ

</details>

- 　 A. 建物も本も満足している
- ✓ B. 建物はいいが、本が足りない
- 　 C. カフェがあるので毎日行きたい
- 　 D. 駅から遠いので不便だ

*Alasan:* Puas dengan gedung, tapi koleksi buku (buku spesialis) kurang.

  - A. 建物も本も満足している — Salah. Tidak puas dengan buku.
  - B. 建物はいいが、本が足りない — BENAR. Benar.
  - C. カフェがあるので毎日行きたい — Salah. Kafe disukai, tapi tidak bilang ingin datang setiap hari.
  - D. 駅から遠いので不便だ — Salah. Perpustakaan ada di depan stasiun.

<sub>Lama: 女の人は何のために電話しましたか。 — 時間を 変える ため / ✓場所の 変更を 知らせる ため / 会議を 中止する ため / 資料を 頼む ため · dialog: 佐藤さん、石川です。今日の午後の打ち合わせですが、先方の都合で、場所が変わりました。駅前のホテルではなく、会社のビルの五階の会議室になりました。時間は同じです。よろしくお願いします。</sub>

---

## 問題13 発話表現 — Ungkapan lisan

### 76. （Dengarkan, lalu pilih tanggapan yang paling tepat.）

<details><summary>Transkrip audio</summary>

- N: 1番
- N: 友だちの家で、トイレを使いたいです。何と言いますか。
- F: 1、トイレ、貸してあげようか？
- F: 2、ちょっとトイレ借りてもいい？
- F: 3、トイレに行ってもらえる？

</details>

- 　 A. トイレ、貸してあげようか？
- ✓ B. ちょっとトイレ借りてもいい？
- 　 C. トイレに行ってもらえる？

*Alasan:* 借りる = meminjam (kita yang memakai). 貸してあげる = kita yang meminjamkan.

  - A. トイレ、貸してあげようか？ — Salah. Menawarkan meminjamkan — peran terbalik.
  - B. ちょっとトイレ借りてもいい？ — BENAR. Benar: meminta izin memakai.
  - C. トイレに行ってもらえる？ — Salah. Menyuruh teman ke toilet.

<sub>Lama: （Dengarkan, lalu pilih tanggapan yang paling tepat.） — ✓すみません、注文した料理が まだ 来ないんですが。 / 料理を ありがとう、おいしかったです。 / もう 食べ終わりました。 · dialog: </sub>

---

### 77. （Dengarkan, lalu pilih tanggapan yang paling tepat.）

<details><summary>Transkrip audio</summary>

- N: 2番
- N: 先輩に、自分のレポートを読んでもらいたいです。何と言いますか。
- M: 1、このレポート、読んでいただけませんか。
- M: 2、このレポート、読ませていただけませんか。
- M: 3、このレポート、お読みになりましたか。

</details>

- ✓ A. このレポート、読んでいただけませんか。
- 　 B. このレポート、読ませていただけませんか。
- 　 C. このレポート、お読みになりましたか。

*Alasan:* 〜ていただけませんか = minta orang lain melakukan. 読ませていただけませんか = minta izin agar KITA yang membaca.

  - A. このレポート、読んでいただけませんか。 — BENAR. Benar: meminta senior membaca.
  - B. このレポート、読ませていただけませんか。 — Salah. Minta izin agar diri sendiri yang membaca.
  - C. このレポート、お読みになりましたか。 — Salah. Menanyakan apakah sudah dibaca.

<sub>Lama: （Dengarkan, lalu pilih tanggapan yang paling tepat.） — ✓一つ 持とうか？ / 荷物を 置いて いって。 / 階段が きらいだね。 · dialog: </sub>

---

### 78. （Dengarkan, lalu pilih tanggapan yang paling tepat.）

<details><summary>Transkrip audio</summary>

- N: 3番
- N: 会社で、帰る時間になりました。まだ仕事をしている人に何と言いますか。
- F: 1、お疲れになりました。
- F: 2、お先にどうぞ。
- F: 3、お先に失礼します。

</details>

- 　 A. お疲れになりました。
- 　 B. お先にどうぞ。
- ✓ C. お先に失礼します。

*Alasan:* Ungkapan baku saat pulang lebih dulu: お先に失礼します.

  - A. お疲れになりました。 — Salah. Bukan ungkapan pamit; bentuk keigo yang janggal.
  - B. お先にどうぞ。 — Salah. Mempersilakan orang lain duluan.
  - C. お先に失礼します。 — BENAR. Benar.

<sub>Lama: （Dengarkan, lalu pilih tanggapan yang paling tepat.） — 私は 反対では ありません でした。 / それは 初めて 聞きました。 / ✓私も その 意見に 賛成です。 · dialog: </sub>

---

### 79. （Dengarkan, lalu pilih tanggapan yang paling tepat.）

<details><summary>Transkrip audio</summary>

- N: 4番
- N: 店で、買いたい服の大きいサイズが見つかりません。店員に何と言いますか。
- M: 1、これ、大きくしてもいいですか。
- M: 2、大きいサイズにしてあげましょうか。
- M: 3、これの大きいサイズはありますか。

</details>

- 　 A. これ、大きくしてもいいですか。
- 　 B. 大きいサイズにしてあげましょうか。
- ✓ C. これの大きいサイズはありますか。

*Alasan:* Bertanya ketersediaan: 〜はありますか.

  - A. これ、大きくしてもいいですか。 — Salah. Minta izin membesarkan barang — tidak logis.
  - B. 大きいサイズにしてあげましょうか。 — Salah. Ucapan pegawai, bukan pembeli.
  - C. これの大きいサイズはありますか。 — BENAR. Benar.

<sub>Lama: （Dengarkan, lalu pilih tanggapan yang paling tepat.） — ごめんなさい、帰ります。 / ✓失礼します。 / 先に 行って ください。 · dialog: </sub>

---

## 問題14 即時応答 — Respons langsung

### 80. （Dengarkan, lalu pilih tanggapan yang paling tepat.）

<details><summary>Transkrip audio</summary>

- N: 1番
- M: 山田さん、この書類、今日中に部長に渡してもらえないかな。
- F: 1、はい、お渡ししておきます。
- F: 2、はい、もらっておきます。
- F: 3、いえ、部長はもう渡しましたよ。

</details>

- ✓ A. はい、お渡ししておきます。
- 　 B. はい、もらっておきます。
- 　 C. いえ、部長はもう渡しましたよ。

*Alasan:* Diminta menyerahkan dokumen ke manajer → はい、お渡ししておきます.

  - A. はい、お渡ししておきます。 — BENAR. Benar.
  - B. はい、もらっておきます。 — Salah. もらう = menerima, bukan menyerahkan.
  - C. いえ、部長はもう渡しましたよ。 — Salah. Subjek/arahnya salah.

<sub>Lama: （Dengarkan, lalu pilih tanggapan yang paling tepat.） — ✓ええ、本当に。冷たい ものでも 飲みませんか。 / 暑くなくて いいですね。 / 暑い ものを 食べましょう。 · dialog: 今日は暑いですね。</sub>

---

### 81. （Dengarkan, lalu pilih tanggapan yang paling tepat.）

<details><summary>Transkrip audio</summary>

- N: 2番
- F: あれ、まだ帰ってなかったの？もう八時だよ。
- M: 1、うん、もう帰ったよ。
- M: 2、うん、八時に帰るつもりだったよ。
- M: 3、うん、この仕事だけ終わらせたくて。

</details>

- 　 A. うん、もう帰ったよ。
- 　 B. うん、八時に帰るつもりだったよ。
- ✓ C. うん、この仕事だけ終わらせたくて。

*Alasan:* Ditanya kenapa belum pulang → beri alasan masih bekerja.

  - A. うん、もう帰ったよ。 — Salah. Bertentangan — dia masih di sini.
  - B. うん、八時に帰るつもりだったよ。 — Salah. Tidak menjawab kenapa masih di kantor.
  - C. うん、この仕事だけ終わらせたくて。 — BENAR. Benar: memberi alasan.

<sub>Lama: （Dengarkan, lalu pilih tanggapan yang paling tepat.） — はい、コピーされました。 / いいえ、資料を ください。 / ✓はい、何部 必要ですか。 · dialog: この資料、コピーしておいてくれる？</sub>

---

### 82. （Dengarkan, lalu pilih tanggapan yang paling tepat.）

<details><summary>Transkrip audio</summary>

- N: 3番
- M: 来週の発表、田中さんに代わってもらえることになったよ。
- F: 1、えっ、田中さんの代わりに発表するの？
- F: 2、じゃあ、田中さんにお願いしてみようか。
- F: 3、よかった。じゃあ、安心して休めるね。

</details>

- 　 A. えっ、田中さんの代わりに発表するの？
- 　 B. じゃあ、田中さんにお願いしてみようか。
- ✓ C. よかった。じゃあ、安心して休めるね。

*Alasan:* 代わってもらえる = Tanaka yang menggantikan pembicara; urusan sudah beres, jadi bisa tenang.

  - A. えっ、田中さんの代わりに発表するの？ — Salah. Salah paham arah 代わってもらう.
  - B. じゃあ、田中さんにお願いしてみようか。 — Salah. Sudah diputuskan, tidak perlu minta lagi.
  - C. よかった。じゃあ、安心して休めるね。 — BENAR. Benar: merespons kabar baik.

<sub>Lama: （Dengarkan, lalu pilih tanggapan yang paling tepat.） — 映画は 好きじゃない でしょう。 / ✓ごめん、明日は 用事が あって。 / うん、昨日 行ったよ。 · dialog: 明日、一緒に映画に行かない？</sub>

---

### 83. （Dengarkan, lalu pilih tanggapan yang paling tepat.）

<details><summary>Transkrip audio</summary>

- N: 4番
- F: このパソコン、どうも調子が悪いみたいなんだけど。
- M: 1、調子がよくてよかったですね。
- M: 2、じゃあ、ちょっと見てみましょうか。
- M: 3、パソコンは買わないんですか。

</details>

- 　 A. 調子がよくてよかったですね。
- ✓ B. じゃあ、ちょっと見てみましょうか。
- 　 C. パソコンは買わないんですか。

*Alasan:* Keluhan komputer bermasalah → tawarkan untuk memeriksa.

  - A. 調子がよくてよかったですね。 — Salah. Kebalikan isi.
  - B. じゃあ、ちょっと見てみましょうか。 — BENAR. Benar.
  - C. パソコンは買わないんですか。 — Salah. Tidak nyambung.

<sub>Lama: （Dengarkan, lalu pilih tanggapan yang paling tepat.） — いいえ、時間を あげます。 / ✓はい、大丈夫です。どうぞ。 / はい、時間が ありません。 · dialog: 今、お時間よろしいでしょうか。</sub>

---

### 84. （Dengarkan, lalu pilih tanggapan yang paling tepat.）

<details><summary>Transkrip audio</summary>

- N: 5番
- M: 駅まで歩いたら、二十分はかかるよ。
- F: 1、じゃあ、バスで行こうか。
- F: 2、二十分も歩いたんですか。
- F: 3、駅までは近いんですね。

</details>

- ✓ A. じゃあ、バスで行こうか。
- 　 B. 二十分も歩いたんですか。
- 　 C. 駅までは近いんですね。

*Alasan:* 二十分はかかる = setidaknya 20 menit (jauh) → usul naik bus.

  - A. じゃあ、バスで行こうか。 — BENAR. Benar.
  - B. 二十分も歩いたんですか。 — Salah. Belum berjalan; ini pengandaian.
  - C. 駅までは近いんですね。 — Salah. Kebalikan isi.

<sub>Lama: （Dengarkan, lalu pilih tanggapan yang paling tepat.） — ✓いえ、見て いるだけです。 / はい、探して ください。 / いえ、探して いません でした。 · dialog: 何かお探しですか。</sub>

---

### 85. （Dengarkan, lalu pilih tanggapan yang paling tepat.）

<details><summary>Transkrip audio</summary>

- N: 6番
- F: 昨日貸した本、もう読み終わっちゃったの？
- M: 1、うん、一晩で読んじゃった。
- M: 2、ううん、まだ貸してないよ。
- M: 3、うん、明日読み終わるところ。

</details>

- ✓ A. うん、一晩で読んじゃった。
- 　 B. ううん、まだ貸してないよ。
- 　 C. うん、明日読み終わるところ。

*Alasan:* Ditanya sudah selesai membaca → ya, karena menarik selesai dalam semalam.

  - A. うん、一晩で読んじゃった。 — BENAR. Benar.
  - B. ううん、まだ貸してないよ。 — Salah. Penutur yang meminjamkan, bukan pendengar.
  - C. うん、明日読み終わるところ。 — Salah. うん tidak cocok dengan 'baru besok selesai'.

<sub>Lama: （Dengarkan, lalu pilih tanggapan yang paling tepat.） — 部長を 探して います。 / はい、よく 探します。 / ✓えっ、本当？すぐ 行って みます。 · dialog: 田中さん、さっき部長が探してたよ。</sub>

---

### 86. （Dengarkan, lalu pilih tanggapan yang paling tepat.）

<details><summary>Transkrip audio</summary>

- N: 7番
- M: 遅くなってすみません。電車が止まってしまって。
- F: 1、電車で来ればよかったのに。
- F: 2、じゃあ、止まってください。
- F: 3、いえいえ、大変でしたね。

</details>

- 　 A. 電車で来ればよかったのに。
- 　 B. じゃあ、止まってください。
- ✓ C. いえいえ、大変でしたね。

*Alasan:* Orang minta maaf terlambat karena kereta berhenti → tunjukkan simpati.

  - A. 電車で来ればよかったのに。 — Salah. Dia memang naik kereta.
  - B. じゃあ、止まってください。 — Salah. Tidak nyambung.
  - C. いえいえ、大変でしたね。 — BENAR. Benar: simpati.

<sub>Lama: （Dengarkan, lalu pilih tanggapan yang paling tepat.） — 重いのは きらいです。 / 荷物は 軽いです。 / ✓ありがとう、助かります。 · dialog: 荷物が重そうですね。</sub>

---

### 87. （Dengarkan, lalu pilih tanggapan yang paling tepat.）

<details><summary>Transkrip audio</summary>

- N: 8番
- F: 部長、明日の会議の資料、お持ちしましょうか。
- M: 1、うん、持っていってあげるよ。
- M: 2、ありがとう。机の上に置いといて。
- M: 3、いや、会議は明日だよ。

</details>

- 　 A. うん、持っていってあげるよ。
- ✓ B. ありがとう。机の上に置いといて。
- 　 C. いや、会議は明日だよ。

*Alasan:* お持ちしましょうか = menawarkan membawakan → terima tawaran.

  - A. うん、持っていってあげるよ。 — Salah. Peran terbalik.
  - B. ありがとう。机の上に置いといて。 — BENAR. Benar: menerima tawaran.
  - C. いや、会議は明日だよ。 — Salah. Penutur sudah bilang besok.

<sub>Lama: （Dengarkan, lalu pilih tanggapan yang paling tepat.） — 来週は 休みです。 / ✓こちらこそ、よろしくお願いします。 / 出張は 行きませんでした。 · dialog: 来週の出張、よろしくお願いします。</sub>

---

### 88. （Dengarkan, lalu pilih tanggapan yang paling tepat.）

<details><summary>Transkrip audio</summary>

- N: 9番
- M: せっかく作ったんだから、少しでも食べてみてよ。
- F: 1、せっかくなので、作ってみます。
- F: 2、じゃあ、ひとくちだけいただきます。
- F: 3、少しだけ作ってもいいですか。

</details>

- 　 A. せっかくなので、作ってみます。
- ✓ B. じゃあ、ひとくちだけいただきます。
- 　 C. 少しだけ作ってもいいですか。

*Alasan:* Diminta mencicipi masakan → じゃあ、ひとくちだけいただきます.

  - A. せっかくなので、作ってみます。 — Salah. Diminta makan, bukan membuat.
  - B. じゃあ、ひとくちだけいただきます。 — BENAR. Benar.
  - C. 少しだけ作ってもいいですか。 — Salah. Tidak nyambung.

<sub>Lama: （Dengarkan, lalu pilih tanggapan yang paling tepat.） — ✓一口 食べますか？ / 食べなかったよ。 / おいしくないです。 · dialog: それ、おいしそうですね。</sub>

---
