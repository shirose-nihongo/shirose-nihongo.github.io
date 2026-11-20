// Tahap 2: masukkan SEMUA kata yang bisa diketuk di materi JP (hasil ruby_audit2.cjs):
//  - st=id  : arti Indonesia dari kamus (kanji tunggal ikut, dengan koreksi di OVR)
//  - st=en  : hanya bila ada terjemahan di en_id.txt (kanji tunggal berglos Inggris dibuang: hampir semuanya salah konteks)
const fs=require("fs");
const src=fs.readFileSync("tools/ssw/audit_add/merge.cjs","utf8");
const romaji=new Function("H","Y",src.match(/function romaji[\s\S]*?\n}\n/)[0]+";return romaji;")(...(()=>{const m=src.match(/const H=(\{[^;]*\});\s*const Y=(\{[^;]*\});/);return [JSON.parse(m[1]),JSON.parse(m[2])];})());
const EN=new Map(fs.readFileSync("tools/ssw/audit_add/en_id.txt","utf8").split(/\r?\n/).filter(Boolean).map(l=>{const i=l.indexOf("|");return [l.slice(0,i),l.slice(i+1)];}));
const OVR={水:"air",持:"memegang; membawa",使:"menggunakan",長:"panjang; kepala/pemimpin",飲:"minum",吸:"menghisap",変:"aneh; berubah",終:"akhir; selesai",動:"bergerak",用:"keperluan; kegunaan",回:"kali; putaran",割:"bagian; rasio",先:"ujung; depan; sebelumnya",平:"datar; rata",薬:"obat",顔:"wajah",日:"hari; matahari",話:"pembicaraan; bercerita",出:"keluar",方:"cara; arah; pihak",急:"mendadak; darurat",具:"alat; perkakas",表:"permukaan; tabel; depan",次:"berikutnya",列:"barisan",段:"tingkat; anak tangga"};
const cleanArti=a=>[...new Set(String(a).split(/\s*;\s*/).map(x=>x.trim()).filter(Boolean))].slice(0,3).join("; ");
let total=0;
for(const f of fs.readdirSync("tools/ssw/audit_add").filter(f=>f.startsWith("ruby2_")&&f.endsWith(".json"))){
  const slug=f.slice(6,-5);const list=JSON.parse(fs.readFileSync("tools/ssw/audit_add/"+f,"utf8"));
  const p="data/ssw/"+slug+"/vocab.json";const raw=fs.readFileSync(p,"utf8");const indent=(raw.match(/^\{\n( +)"/)||[,""])[1].length;const j=JSON.parse(raw);const items=j.items||j;
  const have=new Set(items.map(v=>v.kata));const pref=items[0].id.replace(/\d+$/,""),pad=items[0].id.match(/\d+$/)[0].length;
  let next=Math.max(...items.map(v=>parseInt(String(v.id).replace(/\D/g,""),10)||0))+1,add=0;
  for(const e of list){
    if(have.has(e.kata)||!/[\u4e00-\u9fff]/.test(e.kata))continue;
    const single=[...e.kata].length===1;let arti;
    if(e.st==="id")arti=single&&OVR[e.kata]?OVR[e.kata]:cleanArti(e.arti);
    else{if(single||!EN.has(e.kata))continue;arti=EN.get(e.kata);}
    if(!arti||/unsur kata/.test(arti))continue;
    const sub=e.subs[0];const m={};items.filter(x=>!x.audit&&(x.src||[]).includes(sub)&&x.cat).forEach(x=>m[x.cat]=(m[x.cat]||0)+1);const c=Object.entries(m).sort((a,b)=>b[1]-a[1])[0];
    items.push({id:pref+String(next).padStart(pad,"0"),kata:e.kata,kana:e.kana,romaji:romaji(e.kana),arti,cat:c?c[0]:"Umum",bab:"bab"+sub.match(/^[a-z]+(\d+)s/)[1],src:e.subs,audit:true,sumber:"kata materi (ketuk) · audit lanjutan"});
    have.add(e.kata);next++;add++;
  }
  let out=JSON.stringify(j.items?j:{items},null,indent||undefined);if(raw.endsWith("\n"))out+="\n";fs.writeFileSync(p,out);total+=add;
  console.log(slug.padEnd(22),"tambah",add,"total",items.length);
}
console.log("TOTAL",total);
