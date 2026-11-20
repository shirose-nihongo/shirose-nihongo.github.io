// Audit katakana: semua kata katakana di teks materi (JP + ID) yang belum ada di vocab. Arti dicari dari katakana.json/vocab sektor lain dan kamus.
const fs=require("fs");
const A=JSON.parse(fs.readFileSync("data/ssw/kamus.json","utf8")),E=JSON.parse(fs.readFileSync("data/ssw/kamus-en.json","utf8"));
const texts=(o,a=[])=>{if(typeof o==="string")a.push(o);else if(Array.isArray(o))o.forEach(x=>texts(x,a));else if(o&&typeof o==="object")Object.values(o).forEach(x=>texts(x,a));return a;};
const ALL=fs.readdirSync("data/ssw").filter(d=>fs.existsSync("data/ssw/"+d+"/vocab.json"));
const known=new Map();// katakana -> {a,r}
for(const d of ALL){try{const v=JSON.parse(fs.readFileSync("data/ssw/"+d+"/vocab.json","utf8"));for(const it of (v.items||v))if(/^[\u30a1-\u30f6ー]+$/.test(it.kata)&&it.arti&&!known.has(it.kata))known.set(it.kata,{a:it.arti,r:it.kana});}catch(e){}
 try{const k=JSON.parse(fs.readFileSync("data/ssw/"+d+"/katakana.json","utf8"));for(const it of (k.items||k))if(it.a&&!known.has(it.k))known.set(it.k,{a:it.a,r:it.r});}catch(e){}}
const S=process.argv.slice(2);const out={};
for(const s of S){const d="data/ssw/"+s+"/";const idx=JSON.parse(fs.readFileSync(d+"index.json","utf8"));const V=JSON.parse(fs.readFileSync(d+"vocab.json","utf8")).items;const have=new Set(V.map(v=>v.kata));
 const kt=new Map();
 for(const b of idx.bab){const bd=JSON.parse(fs.readFileSync(d+b.file,"utf8"));for(const sb of bd.bab.subs){const t=texts({f:sb.full,s:sb.summary}).join("\n").replace(/\{([^|{}]+)\|[^{}]+\}/g,"$1");
  for(const m of t.matchAll(/[\u30a1-\u30f6ー]{3,}/g)){let k=m[0];const e=kt.get(k)||{n:0,subs:new Set()};e.n++;e.subs.add(sb.id);kt.set(k,e);}}}
 const res=[];for(const [k,e] of kt){if(have.has(k))continue;if(/^ー|^[ッー]/.test(k))continue;
  let a=known.get(k)?.a,r=known.get(k)?.r,src=known.has(k)?"known":"";if(!a){const x=A[k];if(x){a=x[1];r=x[0];src="id";}else{const y=E[k];if(y){a=y[1];r=y[0];src="en";}}}
  res.push({kata:k,kana:r||"",arti:a||"",src:src||"none",n:e.n,subs:[...e.subs]});}
 out[s]=res;console.log(s.padEnd(22),"belum",res.length,"known",res.filter(x=>x.src==="known").length,"id",res.filter(x=>x.src==="id").length,"en",res.filter(x=>x.src==="en").length,"none",res.filter(x=>x.src==="none").length);}
fs.writeFileSync("tools/ssw/audit_add/kata_candidates.json",JSON.stringify(out));
