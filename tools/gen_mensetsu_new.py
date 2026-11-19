"""Bangun bank soal MENSETSU untuk bidang SSW baru dengan struktur sama seperti 8 bidang lama (62 soal, 9 kategori).
Sumber: tools/mensetsu_new/{key}.py (soal khusus bidang) + soal umum disalin dari agriculture.json.
Jalankan: python3 tools/gen_mensetsu_new.py  → data/mensetsu/{key}.json + index.json. Furigana: tools/gen_mensetsu_furi_dict.py"""
import json,glob,importlib.util,os,sys
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
M=f'{R}/data/mensetsu'
AG=json.load(open(f'{M}/agriculture.json'))
SLOT={s['i'].split('-',1)[1]:s for s in AG['soal']}
KAT=AG['kategori']
M_DEF={'jiko':'Melihat apakah kandidat bisa memperkenalkan diri dengan sopan dan jelas.','shibou':'Menggali motivasi dan alasan yang tulus untuk bidang ini.','shigoto':'Memeriksa pemahaman dasar dan kesiapan kandidat terhadap pekerjaan.','seikatsu':'Melihat kesiapan hidup di Jepang.','mokuhyou':'Melihat tujuan jangka panjang yang realistis.','taiou':'Menilai sikap dan respons kandidat di tempat kerja.','tim':'Menilai kerja sama dan komunikasi dalam tim.','anzen':'Menilai kesadaran keselamatan dan kebersihan.','saigo':'Memberi kesempatan bertanya; menilai antusiasme.'}
C_DEF={'jiko':'Suara jelas, sopan, nama-asal-usia-motivasi singkat.','shibou':'Jujur dan spesifik; hubungkan dengan bidang ini, bukan hanya gaji.','shigoto':'Jawab singkat dan jujur; tidak perlu jargon teknis.','seikatsu':'Tunjukkan sikap terbuka dan siap beradaptasi.','mokuhyou':'Sebut target konkret dan realistis.','taiou':'Kata kunci: 報告・連絡・相談, jujur, dan utamakan keselamatan.','tim':'Tunjukkan kerja sama, bertanya, dan berterima kasih.','anzen':'Sebut APD/aturan keselamatan dan lapor bila ada bahaya.','saigo':'Siapkan satu pertanyaan sopan tentang pekerjaan.'}
def build(key,meta,spec):
    T={'bidang':key,'nama':meta['nama'],'jp':meta['jp'],'emoji':meta['emoji']}
    out=[]
    name=meta['jp']; co=meta['co']
    # soal umum (salin dari agriculture) + versi generik yang diberi nama bidang
    GEN=spec.get('generik',{})
    for slot,s in SLOT.items():
        n={'i':f'{key}-{slot}','k':s['k'],'l':s['l']}
        if slot in spec['soal']:
            ja,idn,aj,ai,v=spec['soal'][slot][:5]; extra=spec['soal'][slot][5:] 
            n.update(ja=ja,id=idn,v=[list(x) for x in v],m=(extra[0] if extra else M_DEF[s['k']]),aj=aj,ai=ai,c=(extra[1] if len(extra)>1 else C_DEF[s['k']]))
        elif slot in GENERIK:
            g=GENERIK[slot]; 
            n.update(ja=g[0].format(co=co,jp=name),id=g[1].format(jp=name,nama=meta['nama']),v=[list(x) for x in g[4]],m=M_DEF[s['k']],aj=g[2].format(co=co,jp=name,kerja=spec['kerja']),ai=g[3].format(jp=name,nama=meta['nama'],kerja_id=spec['kerja_id']),c=C_DEF[s['k']])
        else:
            for k in ('ja','id','v','m','aj','ai','c','jf','ajf'):
                if k in s: n[k]=s[k]
        n['b']=key
        out.append(n)
    T['kategori']=KAT; T['soal']=out
    return T
# soal bertemplat (butuh nama bidang). {kerja}=frasa kerja dalam bahasa Jepang, {kerja_id}= terjemah
GENERIK={
 'jiko-01':('自己紹介をお願いします。','Tolong perkenalkan diri Anda.','はじめまして。アリと申します。インドネシアのジャワ島から来ました。二十四歳です。{jp}の仕事に興味があって、日本で働きたいと思っています。一生懸命がんばりますので、よろしくお願いします。','Perkenalkan, nama saya Ali. Saya dari pulau Jawa, Indonesia. Usia saya 24 tahun. Saya tertarik pada pekerjaan di bidang {nama} dan ingin bekerja di Jepang. Saya akan berusaha sungguh-sungguh, mohon bantuannya.',[('自己紹介','perkenalan diri'),('〜と申します','nama saya (sopan)'),('よろしくお願いします','mohon bantuannya')]),
 'shibou-03':('なぜ当社に応募しましたか。','Mengapa Anda melamar ke perusahaan kami?','御社は、{kerja}と聞きました。丁寧に指導してもらえると思って、応募しました。','Saya dengar perusahaan Anda {kerja_id}. Saya pikir saya akan dibimbing dengan baik, jadi saya melamar.',[('応募する','melamar'),('御社','perusahaan Anda'),('指導','bimbingan')]),
 'mokuhyou-01':('将来の目標は何ですか。','Apa tujuan Anda di masa depan?','{jp}の仕事の技術をしっかり身につけて、仕事に自信を持てる人になりたいです。そして、将来は家族を支えたいです。','Saya ingin menguasai keterampilan di bidang {nama} dan menjadi orang yang percaya diri dalam bekerja. Lalu di masa depan saya ingin menopang keluarga.',[('目標','tujuan'),('身につける','menguasai'),('家族を支える','menopang keluarga')]),
 'saigo-03':('仕事の前に、どんな服や持ち物を用意したらいいですか。','Pakaian dan barang apa yang sebaiknya saya siapkan sebelum bekerja?','はい、仕事の前に、どんな服や靴、持ち物を準備したらいいか、教えてください。','Ya, tolong beri tahu pakaian, sepatu, dan barang apa yang sebaiknya saya siapkan sebelum bekerja.',[('持ち物','barang bawaan'),('準備する','menyiapkan'),('服','pakaian')]),
 'taiou-01':('先輩や上司から注意されたら、どうしますか。','Apa yang Anda lakukan kalau ditegur senior atau atasan?','素直に聞いて、「はい、わかりました」と言います。やり方をメモして、次から気をつけます。','Saya mendengarkan dengan terbuka dan berkata "Ya, saya mengerti". Saya mencatat caranya dan lebih berhati-hati berikutnya.',[('注意される','ditegur'),('素直','terbuka'),('メモ','catatan')]),
 'taiou-05':('体調が悪いときは、どうしますか。','Apa yang Anda lakukan kalau kondisi badan buruk?','無理をしないで、すぐに上司に連絡します。体調が悪いまま作業すると、事故やミスにつながるからです。','Saya tidak memaksakan diri dan segera menghubungi atasan. Bekerja dalam kondisi buruk bisa menyebabkan kecelakaan atau kesalahan.',[('体調','kondisi badan'),('無理','memaksakan'),('連絡','menghubungi')]),
 'taiou-07':('日本人の同僚と、うまく話せなかったらどうしますか。','Apa yang Anda lakukan kalau tidak bisa berbicara lancar dengan rekan kerja orang Jepang?','もう一度ゆっくり話してもらうようにお願いします。わからなかった言葉は、メモして勉強します。','Saya minta mereka mengulang lebih pelan. Kata yang tidak saya pahami saya catat dan pelajari.',[('うまく','dengan baik'),('もう一度','sekali lagi'),('ゆっくり','pelan-pelan')]),
 'taiou-10':('機械や道具を壊してしまったら、どうしますか。','Apa yang Anda lakukan kalau merusak mesin atau alat?','すぐに作業を止めて、正直に責任者に報告します。隠さないで、謝って、どうすればいいか聞きます。','Saya segera menghentikan pekerjaan dan melapor jujur kepada penanggung jawab. Saya tidak menyembunyikannya, meminta maaf, dan bertanya apa yang harus dilakukan.',[('壊す','merusak'),('正直に','dengan jujur'),('報告','melapor')]),
}
if __name__=='__main__':
    idx=json.load(open(f'{M}/index.json'))
    keep=[b for b in idx['bidang']]
    for p in sorted(glob.glob(f'{R}/tools/mensetsu_new/*.py')):
        sp=importlib.util.spec_from_file_location('m',p); mod=importlib.util.module_from_spec(sp); sp.loader.exec_module(mod)
        key=os.path.basename(p)[:-3]; T=build(key,mod.META,mod.SPEC)
        json.dump(T,open(f'{M}/{key}.json','w',encoding='utf8'),ensure_ascii=False,indent=1)
        from collections import Counter
        e={'bidang':key,'nama':T['nama'],'jp':T['jp'],'emoji':T['emoji'],'jumlah':len(T['soal']),'per_kategori':dict(Counter(s['k'] for s in T['soal']))}
        keep=[b for b in keep if b['bidang']!=key]+[e]; print(key,len(T['soal']))
    idx['bidang']=keep; json.dump(idx,open(f'{M}/index.json','w',encoding='utf8'),ensure_ascii=False)
