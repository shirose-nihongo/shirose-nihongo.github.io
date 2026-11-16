/* Tema SHIROSE: ungu (bawaan) + 4 cuaca. Disimpan di localStorage 'shirose-theme'. */
(function(){
  var KEY="shirose-theme";
  /* [id, ikon, nama, warna-bar, level-minimal]. Level = level karakter (XP). Guru/admin bebas. */
  var TH=[["putih","🤍","Putih (bawaan)","#f4f0ff",1],["mono","⚫","Monokrom","#111111",1],["ungu","🟣","Ungu","#161b36",1],["cerah","☀️","Cerah","#12345f",15],["hujan","🌧️","Hujan","#1c2733",20],["salju","❄️","Salju / Dingin","#243a52",40],["panas","🌊","Musim Panas","#0b3b5c",50],["badai","⛈️","Badai","#1a1a24",50],["gugur","🍁","Gugur","#2d1a14",75],["semi","🌸","Semi","#2e1f4a",75]];
  var DEF="putih", OWNED={};  /* OWNED: tema dari gacha (id tanpa awalan theme_) → terbuka tanpa syarat level */
  function myLevel(){var s=window.__SHIROSE_STATE||{};if(window.SHIROSE_THEME_FREE)return 999;return (s.gami&&s.gami.level_karakter)||1}
  function locked(t){if(OWNED[t])return false;for(var i=0;i<TH.length;i++)if(TH[i][0]===t)return myLevel()<TH[i][4];return false}
  function raw(){try{var v=localStorage.getItem(KEY);return TH.some(function(t){return t[0]===v})?v:DEF}catch(e){return DEF}}
  /* tema efektif: kalau pilihan tersimpan masih terkunci (level kurang & belum punya dari gacha) → kembali ke bawaan */
  function get(){var v=raw();return locked(v)?DEF:v}

  /* ===== Pemandangan siluet (diburamkan, menyatu dengan latar) ===== */
  function pole(x,h,c){return '<g fill="'+c+'"><rect x="'+(x-3)+'" y="'+(300-h)+'" width="6" height="'+h+'"/><rect x="'+(x-34)+'" y="'+(300-h+16)+'" width="68" height="5"/><rect x="'+(x-24)+'" y="'+(300-h+44)+'" width="48" height="4"/></g>'}
  function wires(xs,h,c){var s='',y=300-h+18,i;for(i=0;i<xs.length-1;i++){[-30,0,30].forEach(function(o){s+='<path d="M'+(xs[i]+o)+' '+(y+(o?26:0)*0)+' Q'+((xs[i]+xs[i+1])/2+o)+' '+(y+55)+' '+(xs[i+1]+o)+' '+y+'" />'})}return '<g fill="none" stroke="'+c+'" stroke-width="1.6">'+s+'</g>'}
  function house(x,w,h,c,roof,win){return '<g><rect x="'+x+'" y="'+(300-h)+'" width="'+w+'" height="'+h+'" fill="'+c+'"/><path d="M'+(x-14)+' '+(300-h)+' L'+(x+w/2)+' '+(300-h-46)+' L'+(x+w+14)+' '+(300-h)+' Z" fill="'+roof+'"/>'+(win?'<rect x="'+(x+w*.3)+'" y="'+(300-h*.6)+'" width="'+w*.18+'" height="'+h*.22+'" fill="'+win+'"/><rect x="'+(x+w*.62)+'" y="'+(300-h*.6)+'" width="'+w*.18+'" height="'+h*.22+'" fill="'+win+'"/>':'')+'</g>'}
  function sak(x,s,c,t){var o='<g><path d="M'+x+' 300 q-4 -'+(60*s)+' 6 -'+(100*s)+' M'+x+' '+(300-60*s)+' q-30 -20 -50 -'+(34*s)+' M'+x+' '+(300-70*s)+' q30 -20 54 -'+(40*s)+'" stroke="'+t+'" stroke-width="'+(7*s)+'" fill="none" stroke-linecap="round"/>';[[0,-112,46],[-48,-92,38],[50,-100,40],[-22,-140,34],[26,-138,36],[-70,-70,28],[72,-72,30]].forEach(function(p){o+='<circle cx="'+(x+p[0]*s)+'" cy="'+(300+p[1]*s)+'" r="'+(p[2]*s)+'" fill="'+c+'"/>'});return o+'</g>'}
  function torii(x,s,c){return '<g fill="'+c+'"><rect x="'+(x-46*s)+'" y="'+(300-110*s)+'" width="'+(10*s)+'" height="'+(110*s)+'"/><rect x="'+(x+36*s)+'" y="'+(300-110*s)+'" width="'+(10*s)+'" height="'+(110*s)+'"/><path d="M'+(x-64*s)+' '+(300-112*s)+' Q'+x+' '+(300-100*s)+' '+(x+64*s)+' '+(300-112*s)+' L'+(x+70*s)+' '+(300-126*s)+' Q'+x+' '+(300-112*s)+' '+(x-70*s)+' '+(300-126*s)+' Z"/><rect x="'+(x-52*s)+'" y="'+(300-92*s)+'" width="'+(104*s)+'" height="'+(8*s)+'"/></g>'}
  function pagoda(x,s,w,r){var o='<g><rect x="'+(x-8*s)+'" y="'+(300-210*s)+'" width="'+(16*s)+'" height="'+(26*s)+'" fill="'+r+'"/>';for(var i=0;i<4;i++){var y=300-(30+i*48)*s,hw=(70-i*10)*s;o+='<rect x="'+(x-hw*.62)+'" y="'+(y-30*s)+'" width="'+(hw*1.24)+'" height="'+(30*s)+'" fill="'+w+'"/><path d="M'+(x-hw-14*s)+' '+(y-26*s)+' Q'+(x-hw*.4)+' '+(y-30*s)+' '+x+' '+(y-48*s)+' Q'+(x+hw*.4)+' '+(y-30*s)+' '+(x+hw+14*s)+' '+(y-26*s)+' Z" fill="'+r+'"/>'}return o+'</g>'}
  function pine(x,s,c){return '<path fill="'+c+'" d="M'+x+' '+(300-150*s)+' l'+(34*s)+' '+(60*s)+' h-'+(18*s)+' l'+(38*s)+' '+(56*s)+' h-'+(24*s)+' l'+(30*s)+' '+(34*s)+' h-'+(120*s)+' l'+(30*s)+' -'+(34*s)+' h-'+(24*s)+' l'+(38*s)+' -'+(56*s)+' h-'+(18*s)+' z"/>'}
  function maple(x,s,c,t){var o='<g><path d="M'+x+' 300 q-3 -'+(70*s)+' 4 -'+(110*s)+'" stroke="'+t+'" stroke-width="'+(8*s)+'" fill="none" stroke-linecap="round"/>';[[0,-120,50],[-46,-96,38],[48,-100,40],[-20,-150,34],[28,-146,34]].forEach(function(p,i){o+='<circle cx="'+(x+p[0]*s)+'" cy="'+(300+p[1]*s)+'" r="'+(p[2]*s)+'" fill="'+(i%2?c[1]:c[0])+'"/>'});return o+'</g>'}
  function fuji(x,s,c,cap){return '<path d="M'+(x-260*s)+' 300 L'+x+' '+(300-190*s)+' L'+(x+260*s)+' 300 Z" fill="'+c+'"/><path d="M'+(x-62*s)+' '+(300-146*s)+' L'+x+' '+(300-190*s)+' L'+(x+62*s)+' '+(300-146*s)+' L'+(x+34*s)+' '+(300-136*s)+' L'+x+' '+(300-150*s)+' L'+(x-30*s)+' '+(300-134*s)+' Z" fill="'+cap+'"/>'}
  function city(c,glow){var o='<g fill="'+c+'">',x=0,hs=[90,140,110,170,100,130,80,150];for(var i=0;i<16;i++){var h=hs[i%8],w=60+(i*17%40);o+='<rect x="'+x+'" y="'+(300-h)+'" width="'+w+'" height="'+h+'"/>';if(glow&&i%3==0)o+='<rect x="'+(x+10)+'" y="'+(300-h+16)+'" width="10" height="14" fill="'+glow+'"/>';x+=w+8}return o+'</g>'}
  function scene(t){
    var S='',c;
    if(t!=="badai")return "";
    if(t==="hujan"){c="#070d13";S=house(60,110,70,"#0c141b","#05090d","#ffcf6b")+pole(250,230,c)+pole(620,250,c)+pole(990,225,c)+wires([250,620,990],230,c)+house(400,120,86,"#0c141b","#05090d","#ffcf6b")+house(780,130,76,"#0c141b","#05090d","#ffcf6b")+house(1060,100,92,"#0c141b","#05090d")}
    else if(t==="badai"){c="#05050a";S=city("#0a0a14","#ffd60a")+pole(180,240,c)+pole(560,260,c)+pole(940,235,c)+wires([180,560,940],240,c)}
    else if(t==="salju"){S=pine(90,1.1,"#10243a")+house(240,150,80,"#1a3550","#e8f4ff","#ffd27a")+pine(520,.9,"#10243a")+house(640,170,90,"#1a3550","#e8f4ff","#ffd27a")+pine(980,1.2,"#10243a")+pine(1100,.8,"#10243a")}
    else if(t==="gugur"){S=maple(120,1.2,["#e0523a","#f08a24"],"#2a1209")+torii(340,1.1,"#c0291f")+pagoda(640,1.1,"#2a1209","#6b1d12")+maple(900,1.3,["#f08a24","#d6451f"],"#2a1209")+torii(1090,.8,"#c0291f")}
    else if(t==="semi"){S=fuji(940,1.3,"#6c5bb0","#fbe3f1")+sak(120,1.3,"#ff9fcb","#3a2347")+pagoda(430,1.15,"#35204f","#8a2a4a")+torii(640,1,"#e0443a")+sak(830,1.1,"#ffb3d6","#3a2347")+sak(1080,1.4,"#ff9fcb","#3a2347")}
    else if(t==="cerah"){S=fuji(300,1.2,"#2f6fb4","#ffffff")+house(560,130,70,"#173f6e","#0f2c52","#ffe08a")+pine(780,1,"#14553f")+house(900,120,80,"#173f6e","#0f2c52","#ffe08a")+pine(1100,1.1,"#14553f")}
    return S?'<svg class="scene" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">'+S+'</svg>':"";
  }
  function layer(t){
    var w=document.getElementById("wx");
    if(!w){w=document.createElement("div");w.id="wx";document.body.insertBefore(w,document.body.firstChild)}
    if(!animTheme()){w.innerHTML=scene(t);return}
    var h=scene(t),i,r=function(a,b){return a+Math.random()*(b-a)};
    if(t==="hujan"||t==="badai"){for(i=0;i<(t==="badai"?55:40);i++)h+='<i class="drop" style="left:'+r(0,100).toFixed(1)+'%;animation-duration:'+r(.7,1.3).toFixed(2)+'s;animation-delay:-'+r(0,2).toFixed(2)+'s;opacity:'+r(.35,.8).toFixed(2)+'"></i>'}
    if(t==="badai")h+='<i class="flash"></i>';
    if(t==="salju"){for(i=0;i<36;i++){var s=r(3,7).toFixed(1);h+='<i class="flake" style="left:'+r(0,100).toFixed(1)+'%;width:'+s+'px;height:'+s+'px;animation-duration:'+r(7,14).toFixed(1)+'s;animation-delay:-'+r(0,12).toFixed(1)+'s"></i>'}}
    if(t==="gugur"||t==="semi"){var ch=t==="gugur"?["🍁","🍂"]:["🌸","🌸"];for(i=0;i<22;i++)h+='<i class="leaf" style="left:'+r(0,100).toFixed(1)+'%;font-size:'+r(14,26).toFixed(0)+'px;animation-duration:'+r(8,15).toFixed(1)+'s;animation-delay:-'+r(0,14).toFixed(1)+'s;opacity:.85">'+ch[i%2]+'</i>'}
        if(t==="cerah")h+='<i class="sun"></i>';
    w.innerHTML=h;
  }
  function apply(t){
    document.documentElement.setAttribute("data-theme",t);
    var m=document.querySelector('meta[name="theme-color"]');if(m){for(var i=0;i<TH.length;i++)if(TH[i][0]===t)m.setAttribute("content",TH[i][3])}
    cfClear();layer(t);cfSoon();
    var mn=document.getElementById("th-menu");if(mn)[].forEach.call(mn.querySelectorAll("button"),function(b){b.classList.toggle("on",b.dataset.t===t)});
  }
  /* Animasi dipisah: KARAKTER (SMIL senjata/sayap/aura) dan TEMA (hujan, salju, daun, dll).
     localStorage: 'shirose-anim-char' & 'shirose-anim-theme' ('0' = mati). Kunci lama 'shirose-anim' jadi nilai awal keduanya. */
  function flag(k){try{var v=localStorage.getItem("shirose-anim-"+k);if(v===null)v=localStorage.getItem("shirose-anim");return v!=="0"}catch(e){return true}}
  function animChar(){return flag("char")}
  function animTheme(){return flag("theme")}
  function applyAnim(){
    var c=animChar(),t=animTheme(),H=document.documentElement;
    H.setAttribute("data-anim-char",c?"on":"off");H.setAttribute("data-anim-theme",t?"on":"off");
    var bc=document.getElementById("th-anim-c"),bt=document.getElementById("th-anim-t");
    if(bc)bc.innerHTML=c?"🧍 Animasi karakter: <b>ON</b>":"🧍 Animasi karakter: <b>OFF</b>";
    if(bt)bt.innerHTML=t?"🌦️ Animasi tema: <b>ON</b>":"🌦️ Animasi tema: <b>OFF</b>";
  }
  function setAnim(k,on){
    try{localStorage.setItem("shirose-anim-"+k,on?"1":"0")}catch(e){}
    applyAnim();
    if(k==="char"){if(on)unfreeze();else freeze();try{if(typeof window.route==="function")window.route(location.hash.slice(1)||"home")}catch(e){}}
    else layer(get());
  }
  /* Karakter OFF: bekukan animasi SMIL di pose awal (item tetap tampil, tidak bergerak) */
  var frT=0;
  function freeze(){
    if(animChar())return;
    [].forEach.call(document.querySelectorAll("svg"),function(v){try{v.pauseAnimations();v.setCurrentTime(0)}catch(e){}});
  }
  function freezeSoon(){if(animChar())return;clearTimeout(frT);frT=setTimeout(freeze,60)}
  try{new MutationObserver(freezeSoon).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
  function unfreeze(){[].forEach.call(document.querySelectorAll("svg"),function(v){try{v.unpauseAnimations()}catch(e){}})}
  window.SHIROSE_ANIM={char:animChar,theme:animTheme,set:setAnim};
  /* ===== Font Jepang (dipilih di samping "Ganti tema"). Disimpan di localStorage 'shirose-jpfont' ===== */
  var FK="shirose-jpfont";
  /* [id, nama, keterangan, font-family contoh] */
  var FN=[["mincho","Mincho (bawaan)","さ・き menyambung","'Shippori Mincho B1','Noto Serif JP',serif"],["kyokasho","Kyokasho (buku pelajaran)","さ・き terpisah","'Klee One','Noto Serif JP',serif"],["gothic","Gothic","さ・き terpisah","'Zen Kaku Gothic New','Noto Sans JP',sans-serif"],["maru","Maru (bulat)","さ・き terpisah","'Zen Maru Gothic','Noto Sans JP',sans-serif"],["pena","Tulisan pena","さ・き terpisah","'Zen Kurenaido','Noto Sans JP',sans-serif"]];
  function fget(){try{var v=localStorage.getItem(FK);return FN.some(function(f){return f[0]===v})?v:"mincho"}catch(e){return "mincho"}}
  function fapply(f){
    document.documentElement.setAttribute("data-jpfont",f);
    var mn=document.getElementById("fn-menu");if(mn)[].forEach.call(mn.querySelectorAll("button"),function(b){b.classList.toggle("on",b.dataset.f===f)});
  }
  function fset(f){try{localStorage.setItem(FK,f)}catch(e){}fapply(f)}
  fapply(fget());
  window.SHIROSE_JPFONT={get:fget,set:fset,list:FN};
  /* ===== Keterbacaan: tema Putih = teks hitam penuh, tema Monokrom = teks putih penuh =====
     Memindai teks yang kontrasnya rendah (atau abu-abu) terhadap latar efektifnya, lalu dipaksa hitam/putih. */
  var cfSet=[],cfT=0;
  function rgba(c){var m=/rgba?\(([^)]+)\)/.exec(c||"");if(!m)return null;var a=m[1].split(/[ ,\/]+/).filter(Boolean).map(parseFloat);return{r:a[0],g:a[1],b:a[2],a:a.length>3?a[3]:1}}
  function lum(c){function f(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}return .2126*f(c.r)+.7152*f(c.g)+.0722*f(c.b)}
  function ratio(a,b){var x=lum(a),y=lum(b);if(x<y){var t=x;x=y;y=t}return(x+.05)/(y+.05)}
  function effBg(el,def){
    for(var n=el;n&&n.nodeType===1;n=n.parentElement){
      var cs=getComputedStyle(n),c=rgba(cs.backgroundColor);
      if(c&&c.a>=.6)return c;
      if(n===document.body||n===document.documentElement)return def;
      if(cs.backgroundImage&&cs.backgroundImage!=="none")return null; /* gradasi/gambar: lewati */
    }
    return def;
  }
  function cfClear(){cfSet.forEach(function(e){try{e.style.removeProperty("color");e.__cf=0}catch(x){}});cfSet=[]}
  function cfRun(){
    var t=document.documentElement.getAttribute("data-theme");if(t!=="putih"&&t!=="mono"){if(cfSet.length)cfClear();return}
    var light=t==="putih",def=light?{r:255,g:255,b:255}:{r:20,g:20,b:20};
    var root=document.getElementById("app");if(!root)return;
    var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),seen=[],n;
    while((n=w.nextNode())){if(/\S/.test(n.nodeValue)){var e=n.parentElement;if(e&&seen.indexOf(e)<0&&!e.__cf)seen.push(e)}}
    seen.forEach(function(e){
      if(/^(SCRIPT|STYLE|SVG|TEXT|TSPAN)$/i.test(e.tagName)||e.closest("svg"))return;
      var cs=getComputedStyle(e);if(cs.visibility==="hidden"||cs.display==="none")return;
      var fg=rgba(cs.color),bg=effBg(e,def);if(!fg||!bg)return;
      var r=ratio(fg,bg),gray=Math.max(fg.r,fg.g,fg.b)-Math.min(fg.r,fg.g,fg.b)<45,bgLight=lum(bg)>.4,want=bgLight?"#000":"#fff";
      var need=r<4.5||(gray&&((bgLight&&lum(fg)>.02)||(!bgLight&&lum(fg)<.9)));
      /* tema Putih: abu-abu di latar terang → hitam; tema Mono: abu-abu di latar gelap → putih */
      if(need&&(r<4.5||(light===bgLight))){e.style.setProperty("color",want,"important");e.__cf=1;cfSet.push(e)}
    });
  }
  function cfSoon(){clearTimeout(cfT);cfT=setTimeout(cfRun,220)}
  try{new MutationObserver(cfSoon).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
  function set(t){try{localStorage.setItem(KEY,t)}catch(e){}apply(t)}
  function setOwned(ids){OWNED={};(ids||[]).forEach(function(i){if(/^theme_/.test(i))OWNED[i.slice(6)]=1});apply(get())}
  window.SHIROSE_THEME={set:set,get:get,locked:locked,list:TH,setOwned:setOwned,preview:preview,closePreview:closePreview,refresh:function(){apply(get())}};
  /* Pratinjau tema yang belum terbuka (tidak disimpan; hilang saat ditutup/muat ulang) */
  function clearPrev(){var p=document.getElementById("th-prev");if(p)p.remove();var o=document.getElementById("th-lock");if(o)o.remove();document.documentElement.classList.remove("th-previewing")}
  function preview(t){
    var x=TH.filter(function(q){return q[0]===t})[0];if(!x)return;
    apply(t);clearPrev();
    /* Kunci layar: selama pratinjau tidak ada yang bisa diklik kecuali tombol Batalkan */
    var o=document.createElement("div");o.id="th-lock";
    ["click","mousedown","touchstart","contextmenu"].forEach(function(ev){o.addEventListener(ev,function(e){e.preventDefault();e.stopPropagation()},true)});
    document.body.appendChild(o);document.documentElement.classList.add("th-previewing");
    var p=document.createElement("div");p.id="th-prev";
    p.innerHTML='<span>👀 Pratinjau <b>'+x[2]+'</b> · 🔒 Lv '+x[4]+'</span><button class="pv-x" onclick="SHIROSE_THEME.closePreview()">✕ Batalkan pratinjau</button>';
    document.body.appendChild(p);
  }
  window.addEventListener("hashchange",function(){clearPrev();apply(get())});
  function closePreview(){clearPrev();apply(get())}
  function sosmedTop(){
    var tr=document.querySelector(".topbar-right");if(!tr||document.getElementById("tb-sm"))return;
    var ig=document.querySelector("#sosmed .sm-ig"),tt=document.querySelector("#sosmed .sm-tt");if(!ig||!tt)return;
    var w=document.createElement("span");w.className="tb-sm";w.id="tb-sm";
    [[ig,""],[tt,"tt"]].forEach(function(p){var a=document.createElement("a");a.href=p[0].href;a.target="_blank";a.rel="noopener";a.className=p[1];a.setAttribute("aria-label",p[0].getAttribute("aria-label")||"");var sv=p[0].querySelector("svg");if(sv){var c=sv.cloneNode(true);c.removeAttribute("style");c.removeAttribute("class");c.setAttribute("fill","#fff");a.appendChild(c)}w.appendChild(a)});
    tr.insertBefore(w,tr.firstChild);
  }
  function init(){
    applyAnim();apply(get());sosmedTop();
    var tr=document.querySelector(".topbar-right");
    if(tr&&!document.getElementById("th-menu")){
      var d=document.createElement("div");d.className="th-wrap";
      d.innerHTML='<button class="th-btn" id="th-btn" title="Ganti tema" aria-label="Ganti tema">🎨 <span class="th-txt">Ganti tema</span></button><div class="th-menu" id="th-menu">'+TH.map(function(t){return '<button data-t="'+t[0]+'">'+t[1]+' '+t[2]+'<small class="th-lk"></small></button>'}).join("")+'<button data-anim="char" id="th-anim-c" class="th-anim"></button><button data-anim="theme" id="th-anim-t" class="th-anim"></button></div>';
      tr.insertBefore(d,tr.firstChild);
      d.querySelector("#th-btn").onclick=function(e){e.stopPropagation();document.getElementById("th-menu").classList.toggle("open")};
      function mark(){[].forEach.call(document.querySelectorAll("#th-menu button"),function(b){var L=locked(b.dataset.t),m=TH.filter(function(t){return t[0]===b.dataset.t})[0][4];b.classList.toggle("lock",L);b.querySelector(".th-lk").textContent=L?"🔒 Lv "+m:""})}
      d.querySelector("#th-btn").addEventListener("click",mark);
      d.querySelector("#th-menu").onclick=function(e){var b=e.target.closest("button");if(b&&b.dataset.anim){var kk=b.dataset.anim;setAnim(kk,!(kk==="char"?animChar():animTheme()));return}if(b){if(locked(b.dataset.t)){preview(b.dataset.t);document.getElementById("th-menu").classList.remove("open");return}clearPrev();set(b.dataset.t);document.getElementById("th-menu").classList.remove("open")}};
      document.addEventListener("click",function(){var m=document.getElementById("th-menu");if(m)m.classList.remove("open")});
      applyAnim();apply(get());
    }
    if(tr&&!document.getElementById("fn-menu")){
      var f=document.createElement("div");f.className="th-wrap";
      f.innerHTML='<button class="th-btn" id="fn-btn" title="Ganti font Jepang" aria-label="Ganti font Jepang">あ <span class="th-txt">Font</span></button><div class="th-menu fn-menu" id="fn-menu">'+FN.map(function(x){return '<button data-f="'+x[0]+'"><span class="fn-s" style="font-family:'+x[3]+'">さきあ</span><span class="fn-n">'+x[1]+'<small>'+x[2]+'</small></span></button>'}).join("")+'</div>';
      var anchor=document.querySelector(".th-wrap");
      tr.insertBefore(f,anchor?anchor.nextSibling:tr.firstChild);
      f.querySelector("#fn-btn").onclick=function(e){e.stopPropagation();var t=document.getElementById("th-menu");if(t)t.classList.remove("open");document.getElementById("fn-menu").classList.toggle("open")};
      f.querySelector("#fn-menu").onclick=function(e){var b=e.target.closest("button");if(b){fset(b.dataset.f);document.getElementById("fn-menu").classList.remove("open")}};
      document.addEventListener("click",function(){var m=document.getElementById("fn-menu");if(m)m.classList.remove("open")});
      var tb=document.getElementById("th-btn");if(tb)tb.addEventListener("click",function(){document.getElementById("fn-menu").classList.remove("open")},true);
      fapply(fget());
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
