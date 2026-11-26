"""Tambah furigana {漢字|よみ} otomatis pada semua teks JP kuis SSW yang kanjinya belum ber-ruby.

Pakai: python3 tools/ssw/furigana_auto.py kaigo-jp [slug lain ...]
Butuh:  pip install fugashi unidic-lite
Idempotent: kanji yang sudah ada di dalam {..|..} tidak disentuh.
"""
import json, re, sys
from pathlib import Path
import fugashi

R = Path(__file__).resolve().parents[2] / "data/ssw"
KANJI = re.compile(r"[一-鿿々〆ヶ]")
RUBY = re.compile(r"\{[^|{}]+\|[^{}]+\}")
tagger = fugashi.Tagger()

def hira(s):
    return "".join(chr(ord(c) - 0x60) if "ァ" <= c <= "ヶ" else c for c in s)

def kana_char(c):
    return "ぁ" <= c <= "ゖ" or "ァ" <= c <= "ヺ" or c == "ー"

def ruby_word(surf, yomi):
    """食べ/たべ → {食|た}べ ; 取り扱い/とりあつかい → {取|と}り{扱|あつか}い"""
    parts = re.findall(r"[一-鿿々〆ヶ]+|[^一-鿿々〆ヶ]+", surf)
    pat = "".join("(.+?)" if KANJI.match(p) else "(" + re.escape(hira(p)) + ")" for p in parts)
    m = re.fullmatch(pat, yomi)
    if not m:
        return "{%s|%s}" % (surf, yomi)
    return "".join("{%s|%s}" % (p, g) if KANJI.match(p) else p for p, g in zip(parts, m.groups()))

def furi_plain(t):
    if not KANJI.search(t):
        return t
    out = []
    for w in tagger(t):
        s = w.surface
        y = getattr(w.feature, "kana", None)
        if KANJI.search(s) and y and y != "*":
            out.append(ruby_word(s, hira(y)))
        else:
            out.append(s)
    res = "".join(out)
    # fugashi membuang spasi; kembalikan teks asli bila panjang polosnya berubah
    plain = RUBY.sub(lambda m: m.group(0)[1:m.group(0).index("|")], res)
    return res if plain == t else t

TANGGAL = {"1": "ついたち", "2": "ふつか", "3": "みっか", "4": "よっか", "5": "いつか", "6": "むいか", "7": "なのか",
           "8": "ようか", "9": "ここのか", "10": "とおか", "14": "じゅうよっか", "20": "はつか", "24": "にじゅうよっか"}
D = r"[0-9０-９]"
# koreksi bacaan yang sering salah dari analisis otomatis (juga pada ruby lama)
FIX = [
    (rf"({D})\{{時\|とき\}}", r"\1{時|じ}"),
    (r"\{洗濯\|せんたく\}\{物\|ぶつ\}", "{洗濯物|せんたくもの}"),
    (r"\{誕生\|たんじょう\}\{日\|[^}]*\}", "{誕生日|たんじょうび}"),
    (r"\{今日\|こんにち\}", "{今日|きょう}"),
    (r"\{私\|わたくし\}", "{私|わたし}"),
    (r"\{今\|こん\}", "{今|いま}"),
    (r"\{上\|じょう\}の", "{上|うえ}の"),
    (r"\{何\|なん\}を", "{何|なに}を"),
    (rf"(^|[^0-9０-９]|\}})\{{人\|にん\}}", r"\1{人|ひと}"),
    (r"\{日\|にち\}にち", "{日|ひ}にち"),
    (r"(の|る|く|い|う|た|よい)\{日\|にち\}", r"\1{日|ひ}"),
    (r"\{([月火水木金土日])曜\|(\w+)よう\}\{日\|[^}]*\}", r"{\1曜日|\2ようび}"),
    (r"([（(])\{月\|がつ\}([）)])", r"\1{月|げつ}\2"),
    (r"([（(　])\{土\|つち\}([）)：])", r"\1{土|ど}\2"),
]

def fix(t):
    for a, b in FIX:
        t = re.sub(a, b, t)
    # tanggal: 5{月|がつ}10{日|にち} → とおか
    t = re.sub(r"(\{月\|がつ\})(\d+)\{日\|にち\}", lambda m: m.group(1) + m.group(2) + "{日|%s}" % TANGGAL.get(m.group(2), "にち"), t)
    t = re.sub(r"(^|[^0-9}])(\d+)\{日\|にち\}(に|は|の|です|（)", lambda m: m.group(1) + m.group(2) + "{日|%s}" % TANGGAL.get(m.group(2), "にち") + m.group(3) if m.group(3) != "の" or m.group(2) != "1" else m.group(0), t)
    return t

def furi(t):
    if not isinstance(t, str):
        return t
    if not KANJI.search(RUBY.sub("", t)):
        return fix(t)
    out, last = [], 0
    for m in RUBY.finditer(t):
        out.append(furi_line(t[last:m.start()])); out.append(m.group(0)); last = m.end()
    out.append(furi_line(t[last:]))
    return fix("".join(out))

def furi_line(s):
    # per baris & per spasi supaya spasi/baris baru tidak hilang
    return "\n".join(" ".join(furi_plain(x) for x in ln.split(" ")) for ln in s.split("\n"))

TOK = re.compile(r"\{[^|{}]+\|[^{}]+\}|.", re.S)
def polos(t):
    return RUBY.sub(lambda m: m.group(0)[1:m.group(0).index("|")], t)

def rapikan_baris(jp, idt):
    """Data lama: kata terakhir tiap baris terulang di awal baris berikutnya. Pakai teks 'id' (JP polos) sebagai acuan."""
    if "\n" not in jp or not isinstance(idt, str): return jp
    A, B = jp.split("\n"), idt.split("\n")
    if len(A) != len(B): return jp
    out = []
    for a, b in zip(A, B):
        tk = TOK.findall(a)
        k = next((k for k in range(0, min(9, len(tk) + 1)) if polos("".join(tk[k:])) == b), 0)
        tk = tk[k:]
        out.append("".join(tk))
    return "\n".join(out)

def walk(o, n):
    if isinstance(o, dict):
        for k, v in o.items():
            if k == "jp" and isinstance(v, str):
                nv = furi(rapikan_baris(v, o.get("id")))
                if nv != v: o[k] = nv; n[0] += 1
            else:
                walk(v, n)
    elif isinstance(o, list):
        for v in o: walk(v, n)

for slug in sys.argv[1:]:
    p = R / slug / "quiz.json"
    raw = p.read_text(encoding="utf-8")
    q = json.loads(raw); n = [0]
    walk(q, n)
    p.write_text(json.dumps(q, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(slug, "teks diberi furigana:", n[0])
