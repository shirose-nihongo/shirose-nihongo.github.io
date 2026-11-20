// Audit kedua: SEMUA kata yang bisa diketuk (ruby) di materi JP, termasuk kanji tunggal, kata gabungan (dipecah lewat kamus), dan yang artinya hanya ada versi Inggris.
// Hasil: tools/ssw/audit_add/ruby2_<slug>.json  (st: id | en | none)
const fs=require("fs");
const A=JSON.parse(fs.readFileSync("data/ssw/kamus.json","utf8")),E=JSON.parse(fs.readFileSync("data/ssw/kamus-en.json","utf8"));
const GEND="うくぐすつぬぶむる";
const get=k=>{const x=A[k];if(x)return{k,r:x[0],a:x[1],st:"id"};const y=E[k];return y?{k,r:y[0],a:y[1],st:"en"}:null;};
function look(base,rd,ok){for(let n=ok.length;n>=0;n--){const h=get(base+ok.slice(0,n));if(h)return h;}
 for(const e of GEND){const h=get(base+e);if(h&&h.r&&(rd+ok).startsWith(h.r.slice(0,-1)))return h;}
 if(ok){const h=get(base+ok[0]+"る");if(h&&h.r&&(rd+ok).startsWith(h.r.slice(0,-1)))return h;}return null;}
function seg(base){const out=[];let i=0;while(i<base.length){let f=null;for(let j=base.length;j>i;j--){const h=get(base.slice(i,j));if(h&&/[\u4e00-\u9fff]/.test(h.k)){f=h;i=j;break;}}if(!f){i++;continue;}out.push(f);}return out;}
const texts=(o,a=[])=>{if(typeof o==="string")a.push(o);else if(Array.isArray(o))o.forEach(x=>texts(x,a));else if(o&&typeof o==="object")Object.values(o).forEach(x=>texts(x,a));return a;};
const slugs=process.argv.slice(2);
for(const slug of slugs){
 const dir="data/ssw/"+slug+"/";const idx=JSON.parse(fs.readFileSync(dir+"index.json","utf8"));
 const vj=JSON.parse(fs.readFileSync(dir+"vocab.json","utf8"));const V=vj.items||vj;
 const have=new Set(V.map(v=>v.kata));const rb=new Set();V.forEach(v=>(Array.isArray(v.rb)?v.rb:[]).forEach(k=>rb.add(k)));
 const res=new Map();const add=(h,sub,frag)=>{if(have.has(h.k))return;const e=res.get(h.k)||{kata:h.k,kana:h.r,arti:h.a,st:h.st,subs:new Set(),frag:!!frag};e.subs.add(sub);res.set(h.k,e);};
 for(const b of idx.bab){const d=JSON.parse(fs.readFileSync(dir+b.file,"utf8"));
  for(const s of d.bab.subs){
   const raw=texts({f:s.full&&s.full.jp,s:s.summary&&s.summary.jp,t:s.title&&s.title.jp}).join("\n");
   const plain=raw.replace(/\{([^|{}]+)\|[^{}]+\}/g,"$1");
   const kats=V.filter(v=>v.kata&&v.kata.length>=2&&plain.includes(v.kata)).map(v=>v.kata);
   for(const m of raw.matchAll(/\{([^|{}]+)\|([^{}]+)\}([\u3041-\u3096]{0,6})/g)){
    const [_,base,rd,ok]=m;if(!/[\u4e00-\u9fff]/.test(base))continue;
    if(rb.has(base+"|"+rd))continue;
    if(base.length>1&&kats.some(k=>k.includes(base)))continue;
    const h=look(base,rd,ok);
    if(h){add(h,s.id);continue;}
    for(const p of seg(base))add(p,s.id,true);
   }}}
 const arr=[...res.values()].map(e=>({...e,subs:[...e.subs]}));
 fs.writeFileSync("tools/ssw/audit_add/ruby2_"+slug+".json",JSON.stringify(arr));
 console.log(slug.padEnd(22),"baru",arr.length,"id",arr.filter(x=>x.st==="id").length,"en",arr.filter(x=>x.st==="en").length);
}
