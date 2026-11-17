# -*- coding: utf-8 -*-
"""Bangun bank hafalan per bidang: kanji (kanji.json + kanji-kartu.json), bunpou (bunpou.json), katakana (katakana.json).
   python3 tools/ssw/hafal_build.py [slug ...]   (idempoten; mengubah index.json bidang)
Sumber arti/bacaan kanji: data/kanji-*.json (kamus Shirose JLPT) + tambahan manual di bawah.
Pola bunpou dicocokkan ke teks Jepang bidang; contoh diambil dari teks/kosakata/soal bidang itu sendiri."""
import json, re, sys, glob, collections, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from katakana_glossary import G as KG
SLUGS = ["jaim-machine-metal", "jaim-elec-electronic", "jaim-metal-surface", "wood-industry", "auto-transport", "railway-vehicle",
         "forestry", "linen-supply", "logistics", "recycling", "aviation-gh", "aviation-am"]
if len(sys.argv) > 1: SLUGS = sys.argv[1:]
RUB = re.compile(r"\{([^|}]+)\|[^}]+\}"); BOLD = re.compile(r"\*\*")
KJ = re.compile(r"[一-鿿]"); KATA = re.compile(r"[ァ-ヴー]{2,}"); KATA_FULL = re.compile(r"^[ァ-ヴー・]+$")
plain = lambda s: BOLD.sub("", RUB.sub(r"\1", s or ""))

# kamus kanji dari data/kanji-*.json (+ manual untuk yang tidak ada)
KD = {}
for f in sorted(glob.glob("data/kanji-n*.json")) + sorted(glob.glob("data/kanji-ir*.json")):
    for it in json.load(open(f)): KD.setdefault(it["k"], it)
MANUAL = {  # k: (on, kun, arti)
 "頓": ("トン", "", "mendadak; teratur (頓着: peduli)"), "躾": ("", "しつけ", "disiplin; tata krama"), "挨": ("アイ", "", "mendekat (挨拶: salam)"),
 "拶": ("サツ", "", "mendesak (挨拶: salam)"), "梱": ("コン", "", "membungkus; mengemas (梱包)"), "杢": ("", "もく", "serat kayu (kokuji; 杢目)"),
 "脇": ("キョウ", "わき", "samping; ketiak"), "靭": ("ジン", "", "ulet; lentur (強靭)"), "脆": ("ゼイ", "もろい", "rapuh; getas"),
 "股": ("コ", "また", "paha; selangkangan"), "絆": ("ハン", "きずな", "ikatan; tali"), "拵": ("", "こしらえる", "membuat; menyiapkan (kokuji)"),
 "厨": ("チュウ", "くりや", "dapur (厨房)"), "牽": ("ケン", "ひく", "menarik (牽引)"), "濡": ("ジュ", "ぬれる", "basah; kebasahan"),
 "椅": ("イ", "", "kursi (椅子)"), "剪": ("セン", "はさみ", "memotong; gunting (剪定)"), "舵": ("ダ", "かじ", "kemudi"),
 "塵": ("ジン", "ちり", "debu; kotoran halus"), "誰": ("スイ", "だれ", "siapa"), "叩": ("コウ", "たたく", "memukul; mengetuk"), "吊": ("チョウ", "つる", "menggantung"),
 "拭": ("ショク", "ぬぐう・ふく", "mengelap"), "砥": ("シ", "と(ぐ)", "batu asah"), "嗅": ("キュウ", "かぐ", "mencium bau"), "蓋": ("ガイ", "ふた", "tutup"),
 "掴": ("カク", "つかむ", "menggenggam"), "洩": ("エイ", "もれる", "bocor"), "溜": ("リュウ", "たまる・ため", "menumpuk; tertampung"), "竿": ("カン", "さお", "tiang; batang"),
 "袖": ("シュウ", "そで", "lengan baju"), "剥": ("ハク", "はがす・むく", "mengupas; melepas"), "捗": ("チョク", "はかどる", "maju; lancar (進捗)"), "貼": ("チョウ", "はる", "menempel"),
 "崖": ("ガイ", "がけ", "tebing"), "噂": ("ソン", "うわさ", "kabar angin"), "錆": ("セイ", "さび", "karat"), "狙": ("ソ", "ねらう", "membidik; mengincar"),
 "鍋": ("カ", "なべ", "panci; wajan"), "汎": ("ハン", "", "umum; luas (汎用)"), "廻": ("カイ", "まわる", "berputar; berkeliling"), "緻": ("チ", "", "halus; teliti (緻密)"),
 "摺": ("ショウ", "する", "menggosok; mencetak"), "鍵": ("ケン", "かぎ", "kunci"), "梁": ("リョウ", "はり", "balok penopang"), "嶌": ("トウ", "しま", "pulau (varian 島)"),
 "箔": ("ハク", "", "foil; lembaran tipis"), "勾": ("コウ", "", "kemiringan (勾配)"), "埃": ("アイ", "ほこり", "debu"), "填": ("テン", "", "mengisi (充填)"),
 "梯": ("テイ", "はしご", "tangga"), "橙": ("トウ", "だいだい", "jingga; oranye"), "坦": ("タン", "", "datar (平坦)"), "尖": ("セン", "とがる", "runcing; lancip"),
 "馴": ("ジュン", "なれる", "terbiasa (馴染む)"), "裾": ("キョ", "すそ", "ujung/tepi pakaian"), "鍮": ("チュウ", "", "kuningan (真鍮)"), "痕": ("コン", "あと", "bekas; jejak"),
 "堆": ("タイ", "", "menumpuk (堆積)"), "蔽": ("ヘイ", "", "menutupi (遮蔽)"), "桁": ("コウ", "けた", "balok melintang; digit"), "撥": ("ハツ", "はねる", "memercik; menolak (撥水)"),
 "塞": ("サイ・ソク", "ふさぐ", "menutup; menyumbat"), "錐": ("スイ", "きり", "bor tangan; kerucut"), "屑": ("セツ", "くず", "serpihan; sisa"), "挽": ("バン", "ひく", "menggergaji; menarik"),
 "煉": ("レン", "", "menempa; membakar (煉瓦)"), "瓦": ("ガ", "かわら", "genteng; bata"), "撹": ("カク", "", "mengaduk (撹拌)"), "拌": ("ハン", "", "mengaduk (撹拌)"),
 "芯": ("シン", "", "inti; sumbu"), "頃": ("ケイ", "ころ", "sekitar (waktu)"), "膝": ("シツ", "ひざ", "lutut"), "紐": ("チュウ", "ひも", "tali"), "釘": ("テイ", "くぎ", "paku")}
for k, (on, kun, a) in MANUAL.items(): KD.setdefault(k, {"k": k, "on": on, "kun": kun, "a": a, "c": []})

GG = dict(KG)
for f in glob.glob("data/ssw/*/vocab.json"):
    v = json.load(open(f)); v = v["items"] if isinstance(v, dict) else v
    for i in v:
        if KATA_FULL.match(i["kata"]): GG.setdefault(i["kata"], i["arti"])
for f in glob.glob("data/kosakata-*.json"):
    try:
        for i in json.load(open(f)):
            k = i.get("kata") or i.get("k"); a = i.get("arti") or i.get("a")
            if k and a and KATA_FULL.match(k): GG.setdefault(k, a)
    except Exception: pass

# pola bunpou: (id, pola, rx, arti, cara, contoh_umum, arti_contoh_umum)
P = lambda *a: a
GR = [
 P("tehaikenai", "〜てはいけません", "てはいけ|てはならな", "tidak boleh …; dilarang", "KK bentuk て + はいけません", "{作業中|さぎょうちゅう}は、{走|はし}ってはいけません。", "Dilarang berlari saat bekerja."),
 P("naidekudasai", "〜ないでください", "ないでください", "tolong jangan …", "KK bentuk ない + でください", "{機械|きかい}にさわらないでください。", "Tolong jangan menyentuh mesin."),
 P("nakerebanaranai", "〜なければなりません", "なければなり|なければいけ|なくてはならな|なくてはいけ", "harus …; wajib", "KK bentuk ない (buang い) + ければなりません", "ヘルメットをかぶらなければなりません。", "Harus memakai helm."),
 P("tekudasai", "〜てください", "[^い]でください|てください", "tolong …; mohon …", "KK bentuk て + ください", "もう{一度|いちど}{見|み}てください。", "Tolong lihat sekali lagi."),
 P("temoii", "〜てもいいです", "てもいい|てもよい|てもかまいま", "boleh …", "KK bentuk て + もいいです", "ここで{休|やす}んでもいいです。", "Boleh istirahat di sini."),
 P("kotogadekiru", "〜ことができます", "ことができ", "dapat …; bisa …", "KK bentuk kamus + ことができます", "フォークリフトを{運転|うんてん}することができます。", "Bisa mengoperasikan forklift."),
 P("kotogaaru", "〜ことがあります", "ことがあ", "kadang …; pernah …", "KK kamus/た + ことがあります", "{機械|きかい}が{止|と}まることがあります。", "Kadang mesin berhenti."),
 P("tame", "〜ために / 〜ための", "ために|ための", "untuk …; demi …; karena …", "KK kamus / Kata benda + の + ために", "{安全|あんぜん}のために、ヘルメットをかぶります。", "Memakai helm demi keselamatan."),
 P("youni", "〜ように / 〜ような", "ように|ような", "agar …; supaya …; seperti …", "KK kamus/ない + ように; Kata benda + の + ように", "{忘|わす}れないように、メモします。", "Mencatat agar tidak lupa."),
 P("naiyouni", "〜ないように", "ないように", "agar tidak …", "KK bentuk ない + ように", "{落|お}とさないように{注意|ちゅうい}します。", "Berhati-hati agar tidak menjatuhkan."),
 P("nagara", "〜ながら", "ながら", "sambil …", "KK bentuk ます (tanpa ます) + ながら", "{周|まわ}りを{見|み}ながら{運転|うんてん}します。", "Mengemudi sambil melihat sekeliling."),
 P("tekara", "〜てから", "てから|でから", "setelah …", "KK bentuk て + から", "{手|て}を{洗|あら}ってから{作業|さぎょう}を{始|はじ}めます。", "Mulai bekerja setelah cuci tangan."),
 P("taato", "〜たあとで", "たあと|たあとで|たあとは", "setelah … (selesai)", "KK bentuk た + あとで", "{作業|さぎょう}が{終|お}わったあとで、{掃除|そうじ}します。", "Setelah kerja selesai, membersihkan."),
 P("maeni", "〜る前に", "る前に|まえに|る前は", "sebelum …", "KK kamus + 前に", "{始|はじ}める{前|まえ}に、{機械|きかい}を{点検|てんけん}します。", "Sebelum mulai, memeriksa mesin."),
 P("toki", "〜とき", "(る|た|い|だ|の)とき|ときは", "ketika …; saat …", "KK/Kata sifat bentuk biasa + とき", "{危|あぶ}ないときは、すぐ{止|と}めます。", "Saat berbahaya, segera hentikan."),
 P("tara", "〜たら", "たら|だら", "kalau …; setelah …", "KK/Kata sifat bentuk た + ら", "{異常|いじょう}があったら、{報告|ほうこく}します。", "Kalau ada kelainan, melapor."),
 P("ba", "〜ば", "れば|ければ|えば|けば|げば|てば|べば|めば|せば|ねば", "jika …; kalau …", "KK/Kata sifat bentuk ば", "{押|お}せば、{止|と}まります。", "Kalau ditekan, berhenti."),
 P("houga", "〜ほうがいい", "ほうがいい|方がいい|ほうがよ|方がよ", "sebaiknya …", "KK bentuk た/ない + ほうがいい", "{早|はや}めに{報告|ほうこく}したほうがいいです。", "Sebaiknya segera melapor."),
 P("kamo", "〜かもしれません", "かもしれ", "mungkin …", "KK/Kata sifat bentuk biasa + かもしれません", "{雨|あめ}が{降|ふ}るかもしれません。", "Mungkin akan hujan."),
 P("darou", "〜でしょう / 〜だろう", "でしょう|だろう", "mungkin …; bukan?", "Bentuk biasa + でしょう", "{明日|あした}は{晴|は}れるでしょう。", "Besok mungkin cerah."),
 P("kotoninatteiru", "〜ことになっています", "ことになっ", "sudah ditetapkan bahwa …", "KK kamus/ない + ことになっています", "{毎朝|まいあさ}{点検|てんけん}することになっています。", "Sudah ditentukan memeriksa setiap pagi."),
 P("niyotte", "〜によって / 〜により", "によって|により", "dengan …; oleh …; tergantung …", "Kata benda + によって", "{場合|ばあい}によって、{方法|ほうほう}がちがいます。", "Caranya berbeda tergantung kasus."),
 P("nitsuite", "〜について", "について|につき", "tentang …", "Kata benda + について", "{安全|あんぜん}について{学|まな}びます。", "Belajar tentang keselamatan."),
 P("nitaishite", "〜に対して", "に対して|に対する", "terhadap …; kepada …", "Kata benda + に対して", "{お客様|おきゃくさま}に{対|たい}して、ていねいに{話|はな}します。", "Berbicara sopan kepada pelanggan."),
 P("nioite", "〜において", "において|における", "di …; pada … (tempat/situasi formal)", "Kata benda + において", "{工場|こうじょう}において{作業|さぎょう}します。", "Bekerja di pabrik."),
 P("toshite", "〜として", "として", "sebagai …", "Kata benda + として", "{作業者|さぎょうしゃ}として{働|はたら}きます。", "Bekerja sebagai pekerja."),
 P("towa", "〜とは", "とは", "yang dimaksud … itu …", "Kata benda + とは (definisi)", "{検品|けんぴん}とは、{荷物|にもつ}を{確認|かくにん}することです。", "Kenpin adalah memeriksa barang."),
 P("toiu", "〜という", "という", "yang disebut …", "Kutipan + という + kata benda", "ヒヤリハットという{言葉|ことば}を{使|つか}います。", "Memakai istilah hiyari-hatto."),
 P("teiru", "〜ています", "ています|ている|ていた|ていない", "sedang …; dalam keadaan …", "KK bentuk て + います", "{機械|きかい}が{動|うご}いています。", "Mesin sedang bergerak."),
 P("tearu", "〜てあります", "てあります|てある", "sudah …; (hasil perbuatan) tersedia", "KK transitif て + あります", "{道具|どうぐ}が{置|お}いてあります。", "Alat sudah ditaruh (di sana)."),
 P("teoku", "〜ておきます", "ておきま|ておく", "… dulu (persiapan)", "KK bentuk て + おきます", "{先|さき}に{確認|かくにん}しておきます。", "Memeriksa lebih dulu."),
 P("teshimau", "〜てしまいます", "てしまい|てしまう|てしまっ", "terlanjur …; sampai selesai …", "KK bentuk て + しまいます", "{全部|ぜんぶ}{使|つか}ってしまいました。", "Sudah terpakai semua."),
 P("yasui", "〜やすい / 〜にくい", "やすい|にくい|やすく|にくく", "mudah … / sulit …", "KK bentuk ます (tanpa ます) + やすい/にくい", "{持|も}ちやすい{道具|どうぐ}です。", "Alat yang mudah dipegang."),
 P("sugiru", "〜すぎる", "すぎる|すぎて|すぎない", "terlalu …", "KK/Kata sifat (tanpa い) + すぎる", "{荷物|にもつ}が{重|おも}すぎます。", "Barangnya terlalu berat."),
 P("kadouka", "〜かどうか", "かどうか", "apakah … atau tidak", "Bentuk biasa + かどうか", "{安全|あんぜん}かどうか{確認|かくにん}します。", "Memastikan apakah aman atau tidak."),
 P("node", "〜ので", "ので", "karena …", "Bentuk biasa + ので", "{危|あぶ}ないので、{入|はい}らないでください。", "Karena berbahaya, jangan masuk."),
 P("noni", "〜のに", "のに", "padahal …; untuk …", "Bentuk biasa + のに", "{説明|せつめい}したのに、わかりませんでした。", "Padahal sudah dijelaskan, tidak mengerti."),
 P("temo", "〜ても", "ても|でも(?!あり)", "meskipun …", "KK bentuk て + も", "{雨|あめ}がふっても、{作業|さぎょう}します。", "Meskipun hujan, tetap bekerja."),
 P("zuni", "〜ずに / 〜ないで", "ずに|ないで(?!ください)", "tanpa …", "KK bentuk ない + で / ずに", "{何|なに}も{言|い}わずに{帰|かえ}りました。", "Pulang tanpa berkata apa-apa."),
 P("rareru", "〜られる / 〜れる", "られる|られて|られた|られま", "dapat …; di- (pasif/potensial)", "KK grup 2: 〜られる; grup 1: 〜れる/〜われる", "{荷物|にもつ}が{運|はこ}ばれます。", "Barang diangkut."),
 P("saseru", "〜させる", "させる|させて|させた|させま", "menyuruh/membuat … (kausatif)", "KK 〜させる", "{部下|ぶか}に{点検|てんけん}させます。", "Menyuruh bawahan memeriksa."),
 P("beki", "〜べき", "べき", "seharusnya …", "KK kamus + べき", "{報告|ほうこく}するべきです。", "Seharusnya melapor."),
 P("baai", "〜場合は", "場合は|場合に|場合、|ばあいは", "dalam hal …; jika …", "Bentuk biasa + 場合は", "{故障|こしょう}した{場合|ばあい}は、{電源|でんげん}を{切|き}ります。", "Jika rusak, matikan listrik."),
 P("uchini", "〜うちに", "うちに", "selagi …; sebelum …", "Bentuk biasa + うちに", "{熱|あつ}いうちに{運|はこ}びます。", "Membawa selagi masih panas."),
 P("toori", "〜とおり", "とおりに|どおりに|のとおり|通りに", "sesuai …; seperti …", "Kata benda + の + とおり / KK + とおりに", "{手順書|てじゅんしょ}のとおりに{作業|さぎょう}します。", "Bekerja sesuai prosedur."),
 P("gotoni", "〜ごとに", "ごとに", "setiap …", "Kata benda + ごとに", "{一時間|いちじかん}ごとに{休|やす}みます。", "Istirahat setiap satu jam."),
 P("niouji", "〜に応じて", "に応じて|におうじて", "sesuai dengan …", "Kata benda + に応じて", "{状況|じょうきょう}に{応|おう}じて{判断|はんだん}します。", "Memutuskan sesuai situasi."),
 P("madeni", "〜までに", "までに", "paling lambat …; sebelum …", "Waktu + までに", "{五時|ごじ}までに{終|お}わらせます。", "Menyelesaikan paling lambat jam 5."),
 P("shika", "〜しか〜ない", "しか[^。]{0,10}ない", "hanya …", "Kata benda + しか + kalimat negatif", "ここには{一個|いっこ}しかありません。", "Di sini hanya ada satu."),
 P("yaado", "〜や〜など", "や[^。、]{1,12}など", "… dan … dan sebagainya", "A + や + B + など", "{手袋|てぶくろ}や{安全靴|あんぜんぐつ}などを{使|つか}います。", "Memakai sarung tangan, sepatu pengaman, dsb."),
 P("tabakari", "〜たばかり", "たばかり", "baru saja …", "KK bentuk た + ばかり", "{入社|にゅうしゃ}したばかりです。", "Baru saja masuk perusahaan."),
 P("tamama", "〜たまま / 〜のまま", "たまま|のまま", "dalam keadaan tetap …", "KK bentuk た + まま", "{電源|でんげん}を{入|い}れたまま{離|はな}れません。", "Tidak meninggalkan dengan listrik masih menyala."),
 P("hazu", "〜はずです", "はずです|はずだ|はずが", "seharusnya …; pasti …", "Bentuk biasa + はずです", "ここにあるはずです。", "Seharusnya ada di sini."),
 P("youda", "〜ようです", "ようです|ようだ", "tampaknya …", "Bentuk biasa + ようです", "{故障|こしょう}しているようです。", "Tampaknya rusak."),
 P("kotonisuru", "〜ことにする", "ことにして|ことにしま|ことにする", "memutuskan …", "KK kamus/ない + ことにする", "{毎日|まいにち}{点検|てんけん}することにしました。", "Memutuskan memeriksa setiap hari."),
 P("younini", "〜ようになる", "ようになる|ようになっ|ようになり", "menjadi bisa/terbiasa …", "KK kamus/ない + ようになる", "{一人|ひとり}でできるようになりました。", "Sudah bisa melakukannya sendiri."),
 P("kunaru", "〜くなる / 〜になる", "(く|に)なる|(く|に)なり|(く|に)なっ|(く|に)なら", "menjadi …", "Kata sifat い (い→く) / な (→に) + なる", "{部屋|へや}が{暑|あつ}くなります。", "Ruangan menjadi panas."),
 P("kiwotsukete", "〜に気をつける", "に気をつけ|に注意", "berhati-hati terhadap …", "Kata benda + に気をつける", "{足元|あしもと}に{気|き}をつけます。", "Berhati-hati dengan langkah kaki."),
 P("yori", "〜より", "より", "daripada …; dari …", "A + より + B", "{鉄|てつ}より{木|き}のほうが{軽|かる}いです。", "Kayu lebih ringan daripada besi."),
 P("hodo", "〜ほど", "ほど", "sekitar …; sebanyak …; semakin …", "Kata bilangan + ほど", "{十分|じゅっぷん}ほどかかります。", "Memerlukan sekitar 10 menit."),
 P("gurai", "〜ぐらい / 〜くらい", "ぐらい|くらい", "kira-kira …", "Kata bilangan + ぐらい", "{一時間|いちじかん}ぐらい{待|ま}ちます。", "Menunggu kira-kira satu jam."),
]
GRX = [(g, re.compile(g[2])) for g in GR]

def texts(o, out):
    if isinstance(o, str): out.append(o)
    elif isinstance(o, list): [texts(x, out) for x in o]
    elif isinstance(o, dict): [texts(v, out) for v in o.values()]

def pairs_from_blocks(jp, idl, out):
    """pasangan butir daftar JP–ID yang sejajar (jumlah butir sama)"""
    for a, b in zip(jp, idl):
        if isinstance(a, dict) and "ul" in a and isinstance(b, dict) and "ul" in b and len(a["ul"]) == len(b["ul"]):
            out.extend(zip(a["ul"], b["ul"]))

def build(slug):
    base = pathlib.Path("data/ssw") / slug
    idx = json.load(open(base / "index.json"))
    vraw = json.load(open(base / idx.get("vocab", "vocab.json"))); vocab = vraw["items"] if isinstance(vraw, dict) else vraw
    quiz = json.load(open(base / idx.get("quiz", "quiz.json")))
    T, PAIRS = [], []   # T = teks JP mentah; PAIRS = (jp, id) sejajar
    for b in idx["bab"]:
        d = json.load(open(base / b["file"]))
        for sub in d["bab"]["subs"]:
            full = sub.get("full", {})
            texts(full.get("jp", []), T)
            pairs_from_blocks(full.get("jp", []), full.get("id", []), PAIRS)
    # soal: q.jp <-> q.id sejajar
    def walk(o):
        if isinstance(o, dict):
            if "q" in o and isinstance(o["q"], dict) and "jp" in o["q"]:
                jp = o["q"]["jp"]; idt = o["q"].get("id", "")
                m = re.match(r"^○か×か。「(.+)」$", jp)
                if m: jp = m.group(1); idt = re.sub(r"^Benar atau salah: [“\"](.*)[”\"]$", r"\1", idt)
                T.append(jp); PAIRS.append((jp, idt))
            for v in o.values(): walk(v)
        elif isinstance(o, list): [walk(x) for x in o]
    walk(quiz)
    for v in vocab:
        if v.get("contoh"): T.append(v["contoh"]); PAIRS.append((v["contoh"], v.get("arti_contoh", "")))
    # ---------- kanji
    cnt = collections.Counter()
    for v in vocab:
        for c in v["kata"]:
            if KJ.match(c): cnt[c] += 1
    for t in T:
        for c in plain(t):
            if KJ.match(c): cnt[c] += 1
    kd, cards, miss = {}, [], []
    for c, n in cnt.most_common():
        e = KD.get(c)
        if not e: miss.append(c); continue
        words = [{"k": v["kata"], "r": v.get("kana", ""), "a": v["arti"]} for v in vocab if c in v["kata"]][:5]
        if len(words) < 3: words += [w for w in (e.get("c") or []) if w["k"] not in [x["k"] for x in words]][: 3 - len(words)]
        a = e["a"] if isinstance(e["a"], str) else str(e["a"])
        kd[c] = a.split(";")[0].strip()
        cards.append({"id": "kj-" + c, "k": c, "on": e.get("on", ""), "kun": e.get("kun", ""), "a": a, "c": words, "n": n})
    # ---------- bunpou
    items = []
    for g, rx in GRX:
        hits = [(jp, idt) for jp, idt in PAIRS if jp and rx.search(plain(jp))]
        total = sum(1 for t in T if rx.search(plain(t)))
        if total == 0: continue
        # contoh terbaik: pendek (<=70), punya terjemahan ID pendek
        cand = sorted([(len(plain(jp)), jp, idt) for jp, idt in hits if idt and len(plain(jp)) <= 70 and len(idt) <= 160])
        it = {"id": "g-" + g[0], "pola": g[1], "rx": g[2], "arti": g[3], "cara": g[4], "jml": total}
        if cand: it["contoh"], it["arti_contoh"], it["contoh_dari"] = cand[0][1], cand[0][2], "materi"
        else:
            it["contoh"], it["arti_contoh"], it["contoh_dari"] = g[5], g[6], "umum"
            jpo = sorted([(len(plain(t)), t) for t in T if rx.search(plain(t)) and len(plain(t)) <= 80])
            if jpo: it["contoh_materi"] = jpo[0][1]
        items.append(it)
    items.sort(key=lambda x: -x["jml"])
    # ---------- katakana
    kat = {}
    for v in vocab:
        if KATA_FULL.match(v["kata"]): kat[v["kata"]] = {"id": "kt-" + v["kata"], "k": v["kata"], "r": v.get("kana") or v["kata"], "a": v["arti"], "dari": "kosakata", "n": 0, **({"contoh": v["contoh"], "arti_contoh": v.get("arti_contoh", "")} if v.get("contoh") else {})}
    freq = collections.Counter()
    ctx = {}
    for t in T:
        p = plain(t)
        for m in KATA.findall(p):
            freq[m] += 1
            if m not in ctx or len(t) < len(ctx[m]): ctx[m] = t
    for m, n in freq.items():
        if m in kat: kat[m]["n"] = n; continue
        a = GG.get(m)
        if a: kat[m] = {"id": "kt-" + m, "k": m, "r": m, "a": a, "dari": "materi", "n": n}
    katlist = sorted(kat.values(), key=lambda x: (-x["n"], x["k"]))
    # ---------- tulis
    json.dump(kd, open(base / "kanji.json", "w", encoding="utf8"), ensure_ascii=False, indent=0)
    json.dump({"items": cards}, open(base / "kanji-kartu.json", "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))
    json.dump({"items": items}, open(base / "bunpou.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
    json.dump({"items": katlist}, open(base / "katakana.json", "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))
    idx.update({"kanji": "kanji.json", "kanjiCards": "kanji-kartu.json", "bunpou": "bunpou.json", "katakana": "katakana.json"})
    json.dump(idx, open(base / "index.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
    umum = sum(1 for i in items if i["contoh_dari"] == "umum")
    print(f"{slug:22} kanji={len(cards):4} (tanpa data: {''.join(miss) or '-'})  bunpou={len(items):3} (contoh umum {umum})  katakana={len(katlist):4} (kosakata {sum(1 for x in katlist if x['dari']=='kosakata')})")
    return len(cards), len(items), len(katlist)

tot = [0, 0, 0]
for s in SLUGS:
    r = build(s); tot = [a + b for a, b in zip(tot, r)]
print("TOTAL kanji/bunpou/katakana:", tot)
