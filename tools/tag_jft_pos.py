"""Isi kolom `pos` (KB/KK/KSい/KSな) untuk kosakata JFT (ir0/ir1/ir2) supaya filter kategori hafalan bisa dipakai.
Sumber: (1) tag yang sudah ada di kosakata JLPT N5–N1 untuk kata yang sama, (2) penanda di kata (［1］ → KK, （な） → KSな), (3) aturan bentuk kata.
Jalankan: python3 tools/tag_jft_pos.py [--apply]"""
import json, re, sys, collections
APPLY = "--apply" in sys.argv
def norm(k):
    k = re.sub(r'[（(][^）)]*[）)]', '', k); k = re.sub(r'［[^］]*］', '', k)
    k = k.replace('〜', '').replace('　', '').replace(' ', '')
    return k.split('／')[0].strip()
ref = {}
for lv in ['n5', 'n4', 'n3', 'n2', 'n1']:
    for e in json.load(open(f'data/kosakata-{lv}.json')):
        p = e.get('pos') or []
        n = norm(e['kata'])
        if p and (n not in ref): ref[n] = p
PREF = re.compile(r'^(me|mem|men|meng|meny|ber|ter|di|per|ke|pe)\w+', re.I)
BARE = set('makan minum pergi datang pulang tidur bangun lihat melihat dengar baca tulis beli tahu ada tinggal naik turun pakai ambil buat taruh letak buka tutup masuk keluar jual beri kasih bawa pinjam hilang lupa ingat mulai selesai berhenti tunggu bantu kerja belajar ajar pakai cuci mandi duduk berdiri jalan lari terbang cari pilih simpan buang bersih rapi hubungi telepon kirim terima tanya jawab bicara katakan ucap kata panggil kenal suka ingin mau bisa boleh harus perlu pikir rasa kira sebut'.split())
def verbish(a):
    w = re.split(r'[ ;,/(]', a.strip().lower())[0]
    return bool(PREF.match(w)) or w in BARE
EXPR = re.compile(r'(ください|ます$|です|ませ|ですか|か？|？|！|ね$|よ$|ましょう|ございます|お願い|いたし|なさい|ない$|てください|〜が|〜を|〜に|〜で|〜は)')
out = {}; stat = collections.Counter(); unsure = []
for f in ['ir0', 'ir1', 'ir2']:
    d = json.load(open(f'data/kosakata-{f}.json')); out[f] = d
    for e in d:
        k = e['kata']; n = norm(k); a = e['arti']; first = k.split('／')[0]
        pos = None
        if n in ref: pos = ref[n]
        elif re.search(r'（な）|\(な\)', k): pos = ['KSな']
        elif re.search(r'［\d］', k) or re.search(r'[ぁ-んァ-ン一-龥]+(する|します)(［\d］)?(／.*)?$', k) and not re.search(r'お願い|ください', k) and n.endswith(('する','します')) and len(n) <= 6 and verbish(a): pos = ['KK']
        elif re.search(r'(／|^)[ぁ-んァ-ン一-龥]*(る|う|く|ぐ|す|つ|ぬ|ぶ|む)(／[ぁ-んァ-ン一-龥]*ます)?$', first) and re.search(r'ます', k) and verbish(a): pos = ['KK']
        elif re.fullmatch(r'[ぁ-んー一-龥]*(る|う|く|ぐ|す|つ|ぬ|ぶ|む)', n) and not n.endswith('い') and verbish(a) and not re.search(r'[〜？！]', k): pos = ['KK']
        elif n and n.endswith('い') and not re.search(r'[〜お]', k[:1]) and len(n) >= 2 and re.fullmatch(r'[ぁ-ん一-龥ー]+', n) and not EXPR.search(k) and not verbish(a) and a.split()[0].lower() not in ('tidak',) and len(a.split()) <= 3 and 'ae' not in a: pos = ['KSい?']
        if pos is None and not EXPR.search(k) and not re.search(r'[〜？！。、]|[0-9０-９]', k) and re.fullmatch(r'[ぁ-んァ-ンー一-龥々・A-Za-z]+', n) and len(a) < 45 and not a.endswith(('.', '!', '?')) and not re.match(r'^(Tolong|Silakan|Saya|Apakah|Ayo|Mari)', a): pos = ['KB?']
        e['_p'] = pos
        stat[(f, tuple(pos) if pos else None)] += 1
        if pos and pos[0].endswith('?'): unsure.append((f, k, a, pos[0]))
for k, v in sorted(stat.items(), key=lambda x: str(x)): print(k, v)
print(len(ref), 'ref;', len(unsure), 'tidak pasti')
json.dump(unsure, open('/tmp/pos_unsure.json', 'w'), ensure_ascii=False)
if APPLY:
    FIX = json.load(open('tools/jft_pos_fix.json', encoding='utf8'))
    for f, d in out.items():
        s = open(f'data/kosakata-{f}.json', encoding='utf8').read()
        kw = dict(indent=1 if f == 'ir0' else 0, ensure_ascii=False); nl = s.endswith('\n')
        for e in d:
            p = e.pop('_p'); key = e['kata']
            if key in FIX: p = FIX[key]
            if p: p = [x.rstrip('?') for x in p]
            e['pos'] = p or []
        open(f'data/kosakata-{f}.json', 'w', encoding='utf8').write(json.dumps(d, **kw) + ('\n' if nl else ''))
