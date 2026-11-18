import json,random
random.seed(11)
def vq(it,pool):
    ds=[p['arti'] for p in pool if p['arti']!=it['arti'] and it['arti'] not in p['arti']]
    ds=list(dict.fromkeys(ds)); d=random.sample(ds,3)
    a=random.randrange(4); o=d[:]; o.insert(a,it['arti'])
    k=it['kata']; kn=it['kana']
    lab=f'「{k}」（{kn}）' if kn and kn!=k else f'「{k}」'
    return {'q':{'id':f'Apa arti {lab}?','jp':f'{lab}の{{意味|いみ}}は？'},
      'opts':[{'id':x,'jp':x} for x in o],'a':a,
      'exp':{'id':f'{k} ({kn}) = {it["arti"]}. Sumber: daftar kosakata subbab ini.','jp':f'{k}（{kn}）＝ {it["arti"]}'}}
def mc(q,ok,wr,ex):
    a=random.randrange(4); o=wr[:]; o.insert(a,ok)
    return {'q':{'id':q},'opts':[{'id':x} for x in o],'a':a,'exp':{'id':ex}}
KAIGO_MANUAL={
'j3s2':[
("Pada catatan kondisi pengguna, 自立 berarti…","mandiri (bisa sendiri)",["perlu bantuan penuh","sakit parah","pengawasan"],"自立 = mandiri; 介護が必要 = perlu bantuan."),
("見守り berarti…","pengawasan (mengawasi tanpa membantu langsung)",["membersihkan badan","menyuapi","memindahkan ke kursi roda"],"見守り = pengawasan."),
("「介護が必要」berarti…","perlu bantuan perawat",["bisa melakukan sendiri","tidak mau makan","sedang libur"],"介護が必要 = perlu bantuan perawat."),
("Kata waktu pada catatan seperti 夜は・いつも・ときどき menunjukkan…","seberapa sering / kapan hal itu terjadi",["siapa yang menulis catatan","nama penyakit","tempat tinggal pengguna"],"Perhatikan kata waktu untuk memahami kebiasaan pengguna."),
("Saat membaca catatan (記録) yang memakai jam, yang harus dilakukan adalah…","Mencocokkan jam dengan kejadiannya",["Mengabaikan jam","Menebak dari judul","Hanya membaca kalimat terakhir"],"Catatan memakai jam; cocokkan jam dengan kejadian."),
],
'j3s3':[
("Sebelum merawat pengguna, hal yang selalu dilakukan adalah…","声かけ (menyapa/memberi tahu lebih dulu)",["Langsung memindahkan tanpa bicara","Menunggu pengguna tertidur","Meminta keluarga yang melakukan"],"Sebelum merawat selalu 声かけ."),
("声かけ berarti…","menyapa / memberi tahu sebelum bertindak",["mencuci pakaian","mengukur tekanan darah","menyiapkan menu"],"声かけ = menyapa/memberi tahu."),
("Saat kursi roda berhenti, yang harus dilakukan adalah…","Memasang rem",["Melepaskan pegangan","Membiarkan roda bebas","Mengangkat sandaran kaki"],"Kursi roda berhenti → selalu rem."),
("Urutan yang benar saat terjadi kebakaran adalah…","Beri tahu sekitar → bel darurat → telepon 119 → evakuasi",["Telepon 110 → makan → tidur","Evakuasi sendiri tanpa memberi tahu","Matikan lampu → tunggu"],"Kebakaran: beri tahu sekitar, bel darurat, 119, evakuasi."),
("Nomor telepon untuk kebakaran/ambulans di Jepang adalah…","119",["110","117","171"],"119 = pemadam kebakaran / ambulans."),
],
'j3s4':[
("面会のみなさまへ ditujukan kepada…","para pengunjung (yang menjenguk)",["para staf dapur","para dokter","para pengguna layanan saja"],"面会 = kunjungan/menjenguk."),
("ご家族のみなさまへ ditujukan kepada…","keluarga pengguna",["tetangga","petugas bank","pelamar kerja"],"ご家族 = keluarga."),
("主食 adalah…","makanan pokok (nasi, roti, dsb.)",["lauk","minuman","pencuci mulut"],"主食 = makanan pokok."),
("副食 adalah…","lauk (pendamping makanan pokok)",["makanan pokok","obat","bumbu dapur"],"副食 = lauk."),
("Pada pengumuman acara, hal yang perlu diperhatikan adalah…","tanggal, tempat, dan penanggung jawab (担当者)",["warna kertas","jumlah huruf","nama percetakan"],"Perhatikan tanggal, tempat, dan 担当者."),
("担当者 berarti…","orang yang bertanggung jawab",["pengguna layanan","pengunjung","pemilik gedung"],"担当者 = penanggung jawab."),
],
'j3s5':[
("日勤 berarti…","shift siang",["shift malam","libur","cuti sakit"],"日勤 = shift siang."),
("夜勤 berarti…","shift malam",["shift siang","rapat","pelatihan"],"夜勤 = shift malam."),
("Isi laporan kecelakaan yang benar adalah…","日時・場所・内容・原因・対応 (waktu, tempat, isi, sebab, penanganan)",["Nama makanan, harga, merek, warna, ukuran","Hanya nama pelapor","Hanya hari cuaca"],"Laporan kecelakaan: 日時・場所・内容・原因・対応."),
("申し送り adalah…","serah terima informasi antar-shift",["daftar belanja","pesan ucapan terima kasih","tagihan listrik"],"申し送り = serah terima antar shift."),
("Pada serah terima (申し送り), perhatikan…","jam dan siapa yang menjemput/mengantar",["warna seragam","merek sepatu","musim"],"Perhatikan jam dan siapa yang menjemput/mengantar."),
]}
FOOD_REF={'j1s6':'bab1','j2s6':'bab2','j3s7':'bab3','j3s8':'bab3'}
def title_of(slug,sid):
    for n in (1,2,3):
        b=json.load(open(f'data/ssw/{slug}/bab{n}.json'));bb=b.get('bab',b)
        for s in bb['subs']:
            if s['id']==sid: return s['title']
def run(slug,targets,manual=None):
    v=json.load(open(f'data/ssw/{slug}/vocab.json'))['items']
    q=json.load(open(f'data/ssw/{slug}/quiz.json'))
    clean=lambda i:i['arti'] and len(i['arti'])<40 and len(i['kata'])<24
    allv=[i for i in v if clean(i)]
    for sid,bab in targets:
        have=[x for x in q['bab'][bab] if x['id']==sid+'-q']
        if have: continue
        t=title_of(slug,sid)
        if manual and sid in manual:
            items=[mc(a,b,c,d) for a,b,c,d in manual[sid]]
            for it in items: it['q']['jp']='{正|ただ}しいものを{選|えら}んでください。'
        else:
            pool=[i for i in allv if sid in i['src']]
            if len(pool)<8:
                extra=[i for i in allv if i['bab']==bab and i not in pool]
                random.shuffle(extra); pool+=extra[:8-len(pool)]
            random.shuffle(pool)
            items=[vq(i,allv) for i in pool[:8]]
        q['bab'][bab].append({'id':sid+'-q','sub':sid,'title':{'id':'Latihan: '+t['id'],'jp':t['jp']},'items':items})
        print(slug,sid,len(items))
    json.dump(q,open(f'data/ssw/{slug}/quiz.json','w'),ensure_ascii=False,indent=1)
run('kaigo-jp',[('j1s1','bab1'),('j1s2','bab1'),('j1s3','bab1'),('j3s2','bab3'),('j3s3','bab3'),('j3s4','bab3'),('j3s5','bab3')],KAIGO_MANUAL)
run('food-service-jp',[(k,b) for k,b in FOOD_REF.items()])
