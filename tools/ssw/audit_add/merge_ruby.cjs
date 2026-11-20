// Masukkan kata "yang bisa diketuk di materi tapi belum di kosakata" (hasil ruby_audit.cjs) ke vocab.json.
// Pakai: node tools/ssw/audit_add/ruby_audit.cjs <slug...> && node tools/ssw/audit_add/merge_ruby.cjs [--en]
const fs=require("fs");
const src=fs.readFileSync("tools/ssw/audit_add/merge.cjs","utf8");
const romaji=new Function("H","Y",src.match(/function romaji[\s\S]*?\n}\n/)[0]+";return romaji;")(...(()=>{const m=src.match(/const H=(\{[^;]*\});\s*const Y=(\{[^;]*\});/);return [JSON.parse(m[1]),JSON.parse(m[2])];})());
const cand=JSON.parse(fs.readFileSync("tools/ssw/audit_add/ruby_candidates.json","utf8"));
const withEn=process.argv.includes("--en");
const cleanArti=a=>{const p=[...new Set(String(a).split(/\s*;\s*/).map(x=>x.trim()).filter(Boolean))].slice(0,3);return p.join("; ");};
let total=0;
for(const [slug,list] of Object.entries(cand)){
  const p="data/ssw/"+slug+"/vocab.json";const raw=fs.readFileSync(p,"utf8");const indent=(raw.match(/^\{\n( +)"/)||[,""])[1].length;const j=JSON.parse(raw);const items=j.items||j;
  const have=new Set(items.map(v=>v.kata));
  const pref=items[0].id.replace(/\d+$/,""),pad=items[0].id.match(/\d+$/)[0].length;
  let next=Math.max(...items.map(v=>parseInt(String(v.id).replace(/\D/g,""),10)||0))+1,add=0;
  for(const e of list){
    if(e.st==="none"||(e.st==="en"&&!withEn))continue;
    if(e.kata.length<2||have.has(e.kata)||!e.arti)continue;
    if(!/[\u4e00-\u9fff]/.test(e.kata))continue;
    const sub=e.subs[0];const m={};items.filter(x=>!x.audit&&(x.src||[]).includes(sub)&&x.cat).forEach(x=>m[x.cat]=(m[x.cat]||0)+1);const c=Object.entries(m).sort((a,b)=>b[1]-a[1])[0];
    items.push({id:pref+String(next).padStart(pad,"0"),kata:e.kata,kana:e.kana,romaji:romaji(e.kana),arti:cleanArti(e.arti),cat:c?c[0]:"Umum",bab:"bab"+sub.match(/^[a-z]+(\d+)s/)[1],src:e.subs,audit:true,sumber:"kata materi (ketuk) · kamus Shirose"+(e.st==="en"?" (EN)":"")});
    have.add(e.kata);next++;add++;
  }
  let out=JSON.stringify(j.items?j:{items},null,indent||undefined);if(raw.endsWith("\n"))out+="\n";fs.writeFileSync(p,out);total+=add;
  console.log(slug.padEnd(22),"tambah",add,"total",items.length);
}
console.log("TOTAL",total);
