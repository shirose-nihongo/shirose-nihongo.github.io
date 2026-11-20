// Gabungkan tambahan kosakata hasil audit ke data/ssw/<slug>/vocab.json (idempoten: lewati kata yang sudah ada).
// Pakai: node tools/ssw/audit_add/merge.cjs   (dari root repo)
const fs=require("fs"),path=require("path");
const A="tools/ssw/audit_add/";
const MAP=Object.fromEntries(fs.readdirSync(A).filter(f=>f.endsWith(".txt")).map(f=>[f.slice(0,-4),[f.slice(0,-4)]]));
const H={"あ":"a","い":"i","う":"u","え":"e","お":"o","か":"ka","き":"ki","く":"ku","け":"ke","こ":"ko","さ":"sa","し":"shi","す":"su","せ":"se","そ":"so","た":"ta","ち":"chi","つ":"tsu","て":"te","と":"to","な":"na","に":"ni","ぬ":"nu","ね":"ne","の":"no","は":"ha","ひ":"hi","ふ":"fu","へ":"he","ほ":"ho","ま":"ma","み":"mi","む":"mu","め":"me","も":"mo","や":"ya","ゆ":"yu","よ":"yo","ら":"ra","り":"ri","る":"ru","れ":"re","ろ":"ro","わ":"wa","を":"o","ん":"n","が":"ga","ぎ":"gi","ぐ":"gu","げ":"ge","ご":"go","ざ":"za","じ":"ji","ず":"zu","ぜ":"ze","ぞ":"zo","だ":"da","ぢ":"ji","づ":"zu","で":"de","ど":"do","ば":"ba","び":"bi","ぶ":"bu","べ":"be","ぼ":"bo","ぱ":"pa","ぴ":"pi","ぷ":"pu","ぺ":"pe","ぽ":"po","ぁ":"a","ぃ":"i","ぅ":"u","ぇ":"e","ぉ":"o"};
const Y={"ゃ":"a","ゅ":"u","ょ":"o"};
function romaji(kana){
  let s=kana.replace(/[\u30a1-\u30f6]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60)),o="";
  for(let i=0;i<s.length;i++){const c=s[i];
    if(c==="っ"){const n=H[s[i+1]]||"";o+=n? (n[0]==="c"?"t":n[0]) :"";continue;}
    if(c==="ー"){const l=o.slice(-1);o+=l;continue;}
    const n=s[i+1];
    if(n&&Y[n]&&H[c]){const b=H[c];const base=b.endsWith("i")?b.slice(0,-1):b;const y=b==="shi"||b==="chi"||b==="ji"?base:base+"y";o+=y+Y[n];i++;continue;}
    o+=H[c]||c;}
  return o.replace(/nn?(?=[aiueoy])/g,m=>m);
}
const texts=(o,a=[])=>{if(typeof o==="string")a.push(o);else if(Array.isArray(o))o.forEach(x=>texts(x,a));else if(o&&typeof o==="object")Object.values(o).forEach(x=>texts(x,a));return a;};
const plainJp=s=>s.replace(/\{([^|{}]+)\|[^{}]+\}/g,"$1");
let total=0;
for(const [file,slugs] of Object.entries(MAP)){
  const rows=fs.readFileSync(A+file+".txt","utf8").split(/\r?\n/).filter(Boolean).map(l=>l.split("|"));
  for(const slug of slugs){
    const dir="data/ssw/"+slug+"/";const idx=JSON.parse(fs.readFileSync(dir+"index.json","utf8"));
    const vj=JSON.parse(fs.readFileSync(dir+"vocab.json","utf8"));const items=vj.items||vj;
    const subText={};
    for(const b of idx.bab){const d=JSON.parse(fs.readFileSync(dir+b.file,"utf8"));for(const s of d.bab.subs)subText[s.id]=plainJp(texts({f:s.full,s:s.summary,t:s.title}).join("\n"));}
    const have=new Set(items.map(v=>v.kata));
    const pref=items[0].id.replace(/\d+$/,""),pad=items[0].id.match(/\d+$/)[0].length;
    let next=Math.max(...items.map(v=>parseInt(String(v.id).replace(/\D/g,""),10)||0))+1;
    let add=0,skipDup=0;const miss=[];
    for(const [kata,kana,arti,cat,from,subsStr] of rows){
      if(have.has(kata)){skipDup++;continue;}
      let subs=subsStr?subsStr.split(","):null;
      if(!subs){const key=(from||kata).replace(/[・]/g,"");subs=Object.keys(subText).filter(id=>subText[id].includes(key));}
      subs=subs.filter(id=>id in subText||subsStr);
      if(!subs.length){miss.push(kata);continue;}
      const bab="bab"+subs[0].match(/^[a-z]+(\d+)s/)[1];
      const cat2=cat||(()=>{const m={};items.filter(v=>(v.src||[]).includes(subs[0])&&v.cat).forEach(v=>m[v.cat]=(m[v.cat]||0)+1);const e=Object.entries(m).sort((a,b)=>b[1]-a[1])[0];return e?e[0]:"Umum";})();items.push({id:pref+String(next).padStart(pad,"0"),kata,kana,romaji:romaji(kana),arti,cat:cat2,bab,src:subs,audit:true,sumber:"audit materi Shirose"});
      have.add(kata);next++;add++;
    }
    const rawv=fs.readFileSync(dir+"vocab.json","utf8");const ind=(rawv.match(/^\{\n( +)"/)||[,""])[1].length;let o=JSON.stringify(vj.items?{...vj,items}:{items},null,ind||undefined);if(rawv.endsWith("\n"))o+="\n";fs.writeFileSync(dir+"vocab.json",o);
    total+=add;console.log(slug,"tambah",add,"sudah ada",skipDup,"tanpa sumber",miss.join(" ")||"-","total",items.length);
  }
}
console.log("TOTAL",total);
