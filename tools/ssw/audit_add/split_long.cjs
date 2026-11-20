// Pecah kata kanji panjang (>=4 kanji) jadi kata-kata kecil. Bagian yang belum ada di vocab ditambahkan; kata panjang diberi field "bagian": [id,...].
const fs=require("fs");
const src=fs.readFileSync("tools/ssw/audit_add/merge.cjs","utf8");
const romaji=new Function("H","Y",src.match(/function romaji[\s\S]*?\n}\n/)[0]+";return romaji;")(...(()=>{const m=src.match(/const H=(\{[^;]*\});\s*const Y=(\{[^;]*\});/);return [JSON.parse(m[1]),JSON.parse(m[2])];})());
const A=JSON.parse(fs.readFileSync("data/ssw/kamus.json","utf8")),E=JSON.parse(fs.readFileSync("data/ssw/kamus-en.json","utf8"));
const EN=new Map(fs.readFileSync("tools/ssw/audit_add/en_id.txt","utf8").split(/\r?\n/).filter(Boolean).map(l=>{const i=l.indexOf("|");return [l.slice(0,i),l.slice(i+1)];}));
const KJ=/[\u4e00-\u9fff]/g;const isK=s=>/^[\u4e00-\u9fff]+$/.test(s);
const clean=a=>[...new Set(String(a).split(/\s*;\s*/).map(x=>x.trim()).filter(Boolean))].slice(0,2).join("; ");
let total=0,tl=0;
for(const slug of process.argv.slice(2)){
  const p="data/ssw/"+slug+"/vocab.json";const raw=fs.readFileSync(p,"utf8");const indent=(raw.match(/^\{\n( +)"/)||[,""])[1].length;const j=JSON.parse(raw);const items=j.items||j;
  const byK=new Map();for(const v of items)if(!byK.has(v.kata))byK.set(v.kata,v);
  const pref=items[0].id.replace(/\d+$/,""),pad=items[0].id.match(/\d+$/)[0].length;
  let next=Math.max(...items.map(v=>parseInt(String(v.id).replace(/\D/g,""),10)||0))+1,add=0,split=0;
  // info bagian: {k,r,a} dari vocab sektor > kamus indonesia > terjemahan manual
  const info=(w)=>{const v=byK.get(w);if(v&&v.arti)return{k:w,r:v.kana,a:v.arti,have:true};const x=A[w];if(x)return{k:w,r:x[0],a:clean(x[1])};if(EN.has(w)&&E[w])return{k:w,r:E[w][0],a:EN.get(w)};return null;};
  const segment=(w)=>{const n=[...w];const L=n.length;const best=Array(L+1).fill(null);best[0]={c:0,p:[]};
    for(let i=0;i<L;i++){if(!best[i])continue;for(let j=i+1;j<=L;j++){const s=n.slice(i,j).join("");if(s===w)continue;const inf=info(s);if(!inf)continue;const c=best[i].c+1+(j-i===1?1.5:0)+(inf.have?0:0.2);if(!best[j]||c<best[j].c)best[j]={c,p:[...best[i].p,inf]};}}
    return best[L]?best[L].p:null;};
  for(const v of items.slice()){
    if(v.bagian||!isK(v.kata)||(v.kata.match(KJ)||[]).length<4)continue;
    const parts=segment(v.kata);if(!parts||parts.length<2)continue;
    const ids=[];
    for(const pt of parts){let e=byK.get(pt.k);if(!e){e={id:pref+String(next).padStart(pad,"0"),kata:pt.k,kana:pt.r,romaji:romaji(pt.r),arti:pt.a,cat:v.cat||"Umum",bab:v.bab,src:v.src||[],audit:true,sumber:"bagian dari kata panjang"};items.push(e);byK.set(pt.k,e);next++;add++;}ids.push(e.id);}
    v.bagian=ids;v.pecah=ids.map(i=>{const e=items.find(x=>x.id===i);return e.kata+" ("+String(e.arti).split(/;s*/)[0]+")";}).join(" + ");split++;
  }
  let out=JSON.stringify(j.items?j:{items},null,indent||undefined);if(raw.endsWith("\n"))out+="\n";fs.writeFileSync(p,out);total+=add;tl+=split;
  console.log(slug.padEnd(22),"kata panjang dipecah",split,"kata bagian baru",add,"total",items.length);
}
console.log("TOTAL dipecah",tl,"bagian baru",total);
