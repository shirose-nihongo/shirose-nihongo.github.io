// Masukkan katakana di teks materi ke vocab.json (jadi bisa diketuk + masuk hafalan) dan ke katakana.json (Pustaka).
// Pakai: node tools/ssw/audit_add/kata_audit.cjs <slug...> && node tools/ssw/audit_add/merge_kata.cjs
const fs=require("fs");
const src=fs.readFileSync("tools/ssw/audit_add/merge.cjs","utf8");
const romaji=new Function("H","Y",src.match(/function romaji[\s\S]*?\n}\n/)[0]+";return romaji;")(...(()=>{const m=src.match(/const H=(\{[^;]*\});\s*const Y=(\{[^;]*\});/);return [JSON.parse(m[1]),JSON.parse(m[2])];})());
const MAN=new Map(fs.readFileSync("tools/ssw/audit_add/kata_manual.txt","utf8").split(/\r?\n/).filter(Boolean).map(l=>{const [k,r,...a]=l.split("|");return [k,{r,a:a.join("|")}];}));
const cand=JSON.parse(fs.readFileSync("tools/ssw/audit_add/kata_candidates.json","utf8"));
const clean=a=>[...new Set(String(a).split(/\s*;\s*/).map(x=>x.trim()).filter(Boolean))].slice(0,3).join("; ");
let total=0;
for(const [slug,list] of Object.entries(cand)){
  const p="data/ssw/"+slug+"/vocab.json";const raw=fs.readFileSync(p,"utf8");const indent=(raw.match(/^\{\n( +)"/)||[,""])[1].length;const j=JSON.parse(raw);const items=j.items||j;
  const have=new Set(items.map(v=>v.kata));const pref=items[0].id.replace(/\d+$/,""),pad=items[0].id.match(/\d+$/)[0].length;
  let next=Math.max(...items.map(v=>parseInt(String(v.id).replace(/\D/g,""),10)||0))+1,add=0;const ktAdd=[];
  for(const e of list){
    let a=e.arti,r=e.kana;if(e.src==="none"){const m=MAN.get(e.kata);if(!m)continue;a=m.a;r=m.r;}
    if(e.src==="en")continue;if(!a||have.has(e.kata))continue;
    const sub=e.subs[0];const m={};items.filter(x=>!x.audit&&(x.src||[]).includes(sub)&&x.cat).forEach(x=>m[x.cat]=(m[x.cat]||0)+1);const c=Object.entries(m).sort((x,y)=>y[1]-x[1])[0];
    items.push({id:pref+String(next).padStart(pad,"0"),kata:e.kata,kana:r,romaji:romaji(r),arti:clean(a),cat:c?c[0]:"Umum",bab:"bab"+sub.match(/^[a-z]+(\d+)s/)[1],src:e.subs,audit:true,sumber:"katakana materi (ketuk) · audit lanjutan"});
    have.add(e.kata);next++;add++;ktAdd.push({id:"kt-"+e.kata,k:e.kata,r,a:clean(a),dari:"materi",n:e.n});
  }
  let out=JSON.stringify(j.items?j:{items},null,indent||undefined);if(raw.endsWith("\n"))out+="\n";fs.writeFileSync(p,out);
  // Pustaka katakana.json
  const kp="data/ssw/"+slug+"/katakana.json";let kj={items:[]},kind=1;if(fs.existsSync(kp)){const kr=fs.readFileSync(kp,"utf8");kind=(kr.match(/^\{\n( +)"/)||[,"  "])[1].length;kj=JSON.parse(kr);if(Array.isArray(kj))kj={items:kj};}
  const kh=new Set(kj.items.map(x=>x.k));let kadd=0;for(const x of ktAdd)if(!kh.has(x.k)){kj.items.push(x);kadd++;}
  if(kadd||!fs.existsSync(kp))fs.writeFileSync(kp,JSON.stringify(kj,null,kind));
  total+=add;console.log(slug.padEnd(22),"vocab +"+add,"katakana.json +"+kadd);
}
console.log("TOTAL",total);
