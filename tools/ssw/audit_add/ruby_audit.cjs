const fs=require("fs");
const A=JSON.parse(fs.readFileSync("data/ssw/kamus.json","utf8")),E=JSON.parse(fs.readFileSync("data/ssw/kamus-en.json","utf8"));
const GEND="うくぐすつぬぶむる";
const get=k=>{const x=A[k];if(x)return{k,r:x[0],a:x[1]};const y=E[k];return y?{k,r:y[0],a:y[1],en:1}:null;};
function look(base,rd,ok){for(let n=ok.length;n>=0;n--){const h=get(base+ok.slice(0,n));if(h)return h;}
 for(const e of GEND){const h=get(base+e);if(h&&h.r&&(rd+ok).startsWith(h.r.slice(0,-1)))return h;}
 if(ok){const h=get(base+ok[0]+"る");if(h&&h.r&&(rd+ok).startsWith(h.r.slice(0,-1)))return h;}return null;}
const texts=(o,a=[])=>{if(typeof o==="string")a.push(o);else if(Array.isArray(o))o.forEach(x=>texts(x,a));else if(o&&typeof o==="object")Object.values(o).forEach(x=>texts(x,a));return a;};
const slugs=process.argv.slice(2);const out={};
for(const slug of slugs){
 const dir="data/ssw/"+slug+"/";const idx=JSON.parse(fs.readFileSync(dir+"index.json","utf8"));
 const vj=JSON.parse(fs.readFileSync(dir+"vocab.json","utf8"));const V=vj.items||vj;
 const have=new Set(V.map(v=>v.kata));const rb=new Set();V.forEach(v=>(Array.isArray(v.rb)?v.rb:[]).forEach(k=>rb.add(k)));
 const res=new Map();
 for(const b of idx.bab){const d=JSON.parse(fs.readFileSync(dir+b.file,"utf8"));
  for(const s of d.bab.subs){
   const raw=texts({f:s.full&&s.full.jp,s:s.summary&&s.summary.jp,t:s.title&&s.title.jp}).join("\n");
   const plain=raw.replace(/\{([^|{}]+)\|[^{}]+\}/g,"$1");
   const kats=V.filter(v=>v.kata&&(v.kata.length>=2||/^[\u4e00-\u9fff]$/.test(v.kata))&&plain.includes(v.kata)).map(v=>v.kata);
   for(const m of raw.matchAll(/\{([^|{}]+)\|([^{}]+)\}([\u3041-\u3096]{0,6})/g)){
    const [_,base,rd,ok]=m;if(!/[\u4e00-\u9fff]/.test(base))continue;
    if(rb.has(base+"|"+rd))continue;
    if(kats.some(k=>k.includes(base)))continue;
    const h=look(base,rd,ok);
    const key=h?h.k:base+(ok?"":"");
    if(have.has(key))continue;
    const e=res.get(key)||{kata:key,kana:h?h.r:rd,arti:h?h.a:"",st:h?(h.en?"en":"id"):"none",subs:new Set(),n:0};
    e.subs.add(s.id);e.n++;res.set(key,e);}
  }}
 out[slug]=[...res.values()].map(e=>({...e,subs:[...e.subs]}));
 const c=out[slug];console.log(slug.padEnd(22),"baru",c.length,"id",c.filter(x=>x.st==="id").length,"en",c.filter(x=>x.st==="en").length,"none",c.filter(x=>x.st==="none").length);
}
fs.writeFileSync("tools/ssw/audit_add/ruby_candidates.json",JSON.stringify(out));
