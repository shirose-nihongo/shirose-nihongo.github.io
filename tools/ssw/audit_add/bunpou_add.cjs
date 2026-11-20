// Tambah pola bunpou yang muncul di teks materi tapi belum ada di bunpou.json sektor (jadi bisa diketuk + ada di hafalan Bunpou).
const fs=require("fs");
const EXCL=new Set(["g-sou","g-demo","g-to-cond","g-nara","g-masude","g-sae","g-uede","g-tai","g-shi","g-temiru","g-youda"]);
const extra=JSON.parse(fs.readFileSync("tools/ssw/audit_add/bunpou_extra.json","utf8")).filter(x=>!EXCL.has(x[0])).map(([id,pola,rx,arti,cara,contoh,arti_contoh])=>({id,pola,rx,arti,cara,contoh,arti_contoh,contoh_dari:"umum"}));
const master=new Map();
for(const d of fs.readdirSync("data/ssw")){const p="data/ssw/"+d+"/bunpou.json";if(!fs.existsSync(p))continue;for(const it of JSON.parse(fs.readFileSync(p,"utf8")).items)if(!master.has(it.pola))master.set(it.pola,it);}
for(const it of extra)if(!master.has(it.pola))master.set(it.pola,it);
const texts=(o,a=[])=>{if(typeof o==="string")a.push(o);else if(Array.isArray(o))o.forEach(x=>texts(x,a));else if(o&&typeof o==="object")Object.values(o).forEach(x=>texts(x,a));return a;};
const S=process.argv.slice(2);
for(const s of S){const d="data/ssw/"+s+"/";const idx=JSON.parse(fs.readFileSync(d+"index.json","utf8"));
 let raw="";for(const b of idx.bab){const bd=JSON.parse(fs.readFileSync(d+b.file,"utf8"));for(const sb of bd.bab.subs)raw+=texts({f:sb.full&&sb.full.jp,s:sb.summary&&sb.summary.jp}).join("\n")+"\n";}
 if(raw.replace(/[^\u3040-\u30ff\u4e00-\u9fff]/g,"").length<300){console.log(s.padEnd(22),"tak ada teks JP, lewati");continue;}
 const plain=raw.replace(/\{([^|{}]+)\|[^{}]+\}/g,"$1");const sents=raw.split(/[。\n]/);
 const bp=d+"bunpou.json";const had=fs.existsSync(bp);const braw=had?fs.readFileSync(bp,"utf8"):"";const ind=had?(braw.match(/^\{\n( +)"/)||[,"  "])[1].length:1;const bj=had?JSON.parse(braw):{items:[]};
 const hasP=new Set(bj.items.map(x=>x.pola));const hasId=new Set(bj.items.map(x=>x.id));let add=0;
 for(const it of master.values()){if(hasP.has(it.pola))continue;let re;try{re=new RegExp(it.rx,"g");}catch(e){continue;}
  const hits=[...plain.matchAll(re)];if(hits.length<2)continue;
  let cm="";for(const sn of sents){const pl=sn.replace(/\{([^|{}]+)\|[^{}]+\}/g,"$1");re.lastIndex=0;if(re.test(pl)&&pl.length<70&&pl.length>8){cm=sn.trim();break;}}
  const n={...it,jml:hits.length};if(cm)n.contoh_materi=cm;if(hasId.has(n.id))n.id=n.id+"-"+s;
  bj.items.push(n);hasP.add(n.pola);hasId.add(n.id);add++;}
 bj.items.sort((a,b)=>(b.jml||0)-(a.jml||0));
 fs.writeFileSync(bp,JSON.stringify(bj,null,ind));
 if(!idx.bunpou){idx.bunpou="bunpou.json";const ir=fs.readFileSync(d+"index.json","utf8");const ii=(ir.match(/^\{\n( +)"/)||[,"  "])[1].length;fs.writeFileSync(d+"index.json",JSON.stringify(idx,null,ii)+(ir.endsWith("\n")?"\n":""));}
 console.log(s.padEnd(22),"bunpou",had?"ada":"BARU","tambah",add,"total",bj.items.length);}
