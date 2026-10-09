(function(){'use strict';
/* ===== SETTINGS ===== */
var PW_HASH=5407969084737646; /* hash of the password, so it is not written in plain text */
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

function hash(s){var a=0xdeadbeef,b=0x41c6ce57,i,c;
  for(i=0;i<s.length;i++){c=s.charCodeAt(i);a=Math.imul(a^c,2654435761);b=Math.imul(b^c,1597334677)}
  a=Math.imul(a^(a>>>16),2246822507)^Math.imul(b^(b>>>13),3266489909);
  b=Math.imul(b^(b>>>16),2246822507)^Math.imul(a^(a>>>13),3266489909);
  return 4294967296*(2097151&b)+(a>>>0)}
function norm(v){return v.replace(/\s+/g,'').toUpperCase()}

/* ===== BACKGROUND: floating pink hearts, petals and stars ===== */
var fx=$('#fx');
function r(a,b){return a+Math.random()*(b-a)}
(function(){var small=window.innerWidth<600,n=small?26:46,h=['💗','💖','💕','💞','🌸','💓','🩷','✨'],i,e;
  for(i=0;i<n;i++){e=document.createElement('span');e.className='fl'+(i%7===0?' big':'');e.textContent=h[i%h.length];
    e.style.cssText='--x:'+r(0,96)+'vw;--s:'+(i%7===0?r(34,56):r(14,34))+'px;--t:'+r(9,18)+'s;--d:'+r(-18,0)+'s;--dx:'+r(-70,70)+'px';fx.appendChild(e);}
  for(i=0;i<(small?8:14);i++){e=document.createElement('span');e.className='petal';e.textContent='🌸';
    e.style.cssText='--x:'+r(0,96)+'vw;--s:'+r(14,24)+'px;--t:'+r(11,20)+'s;--d:'+r(-20,0)+'s;--dx:'+r(-90,90)+'px';fx.appendChild(e);}
  for(i=0;i<40;i++){e=document.createElement('i');e.className='star';
    e.style.cssText='--x:'+r(0,100)+'%;--y:'+r(0,100)+'%;--s:'+r(2,4)+'px;--d:'+r(0,3)+'s';fx.appendChild(e);}})();

function burst(x,y,n){
  if(reduce)n=Math.min(n,8);var em=['💗','💖','💕','✨','🌸'],i,e;
  for(i=0;i<n;i++){e=document.createElement('span');e.className='burst';e.textContent=em[i%em.length];
    e.style.cssText='left:'+x+'px;top:'+y+'px;font-size:'+r(16,34)+'px;--bx:'+r(-180,180)+'px;--by:'+r(-260,-40)+'px';
    document.body.appendChild(e);(function(el){setTimeout(function(){el.remove()},1900)})(e);}
}
function toast(msg){var t=document.createElement('div');t.className='toast';t.textContent=msg;t.setAttribute('role','status');document.body.appendChild(t);setTimeout(function(){t.remove()},4500)}

/* ===== MEDIA PATHS: try the usual folders so files load wherever they were uploaded ===== */
var IMG_DIRS=['','images/','img/','photos/'],VID_DIRS=['','videos/','images/','video/'];
function altPaths(url,dirs){var name=url.split('/').pop(),out=[];dirs.forEach(function(d){var u=d+name;if(u!==url&&out.indexOf(u)<0)out.push(u)});return out}
function guardMedia(){
  $$('img').forEach(function(img){
    var s=img.getAttribute('src');if(!s||img.id==='lbImg')return;
    var alts=altPaths(s,IMG_DIRS);
    img.addEventListener('error',function(){if(alts.length)img.src=alts.shift();else fixImg(img)});
    if(img.complete&&img.naturalWidth===0&&img.getAttribute('loading')!=='lazy')img.dispatchEvent(new Event('error'));
  });
  $$('video').forEach(function(v){
    var src=v.querySelector('source'),p=v.getAttribute('poster');
    if(p){(function chk(u,rest){var t=new Image();t.onload=function(){v.poster=u};t.onerror=function(){if(rest.length)chk(rest.shift(),rest)};t.src=u})(p,altPaths(p,IMG_DIRS))}
    if(src){var alts=altPaths(src.getAttribute('src'),VID_DIRS),failed=false;
      v.setAttribute('preload','metadata');
      function giveUp(){if(failed)return;failed=true;var c=v.closest('.vcard'),pp=c.querySelector('p'),name=(src.getAttribute('src')||'').split('/').pop();c.classList.add('bad');pp.textContent='This video could not be played.';
        if(window.fetch)fetch(name,{method:'HEAD'}).then(function(r){pp.textContent=r.ok?'Found, but cannot be played. Re-save as MP4 (H.264 + AAC).':'File '+name+' is missing. Please upload it next to index.html.'}).catch(function(){})}
      function tryNext(){
        if(alts.length){src.src=alts.shift();v.load()} /* only reloads, never auto-plays */
        else giveUp()}
      src.addEventListener('error',tryNext);
      v.addEventListener('error',function(){if(v.error&&v.error.code===3)giveUp();else tryNext()}); /* code 3 = file found but cannot be decoded */
      v.addEventListener('loadedmetadata',function(){failed=false;var c=v.closest('.vcard');c.classList.remove('bad')});
    }
  });
}

/* ===== MUSIC: starts by itself right after the correct password (no button) ===== */
var au=$('#bgMusic'),MUSIC=['music.mp3','audio/music.mp3','images/music.mp3','audio/Music.mp3','Music.mp3'],mi=0,wantMusic=false,armed=false,resume=false;
au.volume=.7;
function armTap(){if(armed)return;armed=true;['pointerdown','touchstart','keydown'].forEach(function(ev){document.addEventListener(ev,function f(){document.removeEventListener(ev,f);armed=false;if(wantMusic&&au.paused)playMusic()},{once:true})})}
function playMusic(){wantMusic=true;
  (function go(){if(au.getAttribute('src')!==MUSIC[mi])au.src=MUSIC[mi];
    var p=au.play();
    if(p&&p.catch)p.catch(function(err){
      if(err&&err.name==='NotAllowedError'){armTap();return}
      if(mi<MUSIC.length-1){mi++;go()}else if(window.console)console.warn('Music file not found: upload music.mp3')})})()}

/* ===== BIRTHDAY WISHES rotating on the password page ===== */
var WISHES=['May you live a long, happy and healthy life 💗','Wishing you endless smiles and a heart full of peace 🌸','May every dream you carry come true, Esha ✨','May Allah bless you with happiness, success and love always 🤲','Stay as beautiful and kind as you are, today and forever 💖','May your life be filled with laughter, light and beautiful surprises 🎀','Many, many happy returns of the day, my Esha 🎂','May this new year of your life be your best one yet 🌙'],wi=0,wl=$('#wishLine');
setInterval(function(){wi=(wi+1)%WISHES.length;wl.classList.add('swap');setTimeout(function(){wl.textContent=WISHES[wi];wl.classList.remove('swap')},500)},4500);

/* ===== PASSWORD GATE ===== */
var unlocked=false,lock=$('#lock'),uni=$('#universe'),gate=$('#gate'),pw=$('#pw'),msg=$('#pwMsg'),tries=0;
document.body.style.overflow='hidden';
guardMedia();
gate.addEventListener('submit',function(e){
  e.preventDefault();
  if(hash(norm(pw.value))===PW_HASH){
    msg.classList.remove('err');msg.textContent='Welcome, my Esha 💗';
    gate.classList.add('ok');$('#lockIcon').textContent='🔓';
    playMusic(); /* started by this tap, so the browser allows it */
    setTimeout(unlock,700);
  }else{
    tries++;msg.classList.add('err');
    msg.textContent=tries>2?'Not quite, my love. Think of the day you were born 🌸':'That is not the password. Try again 💗';
    gate.classList.remove('shake');void gate.offsetWidth;gate.classList.add('shake');
    pw.select();
  }
});
setTimeout(function(){try{pw.focus({preventScroll:true})}catch(e){}},300);

function unlock(){
  if(unlocked)return;unlocked=true;
  uni.hidden=false;uni.classList.add('show');window.scrollTo(0,0);
  if(!reduce){for(var i=0;i<6;i++)setTimeout(function(){burst(r(60,innerWidth-60),innerHeight*.7,14)},i*300);}
  lock.classList.add('out');
  setTimeout(function(){lock.hidden=true;lock.style.display='none';document.body.style.overflow='';pw.value='';},reduce?50:1500);
  initGallery();watchFades();loadWishes();
}

/* ===== MEDIA: fallbacks, lightbox, videos ===== */
function fixImg(img){if(img.dataset.fixed)return;img.dataset.fixed=1;var f=img.closest('figure'),ph=document.createElement('div');
  ph.className='ph';ph.setAttribute('role','img');ph.setAttribute('aria-label','Photo placeholder');ph.textContent='💗';
  ph.style.setProperty('--ar',f&&f.style.getPropertyValue('--ar')||'3/4');img.replaceWith(ph)}
var photos=[],cur=0;
function initGallery(){
  $$('img.zoom').forEach(function(img){
    img.addEventListener('click',function(){open(img)});
  });
  photos=$$('img.zoom');
  $$('video').forEach(function(v){
    v.addEventListener('play',function(){$$('video').forEach(function(o){if(o!==v)o.pause()});if(!au.paused){au.pause();resume=true}});
    function back(){if(resume&&!$$('video').some(function(x){return !x.paused&&!x.ended})){resume=false;au.play().catch(function(){})}}
    v.addEventListener('pause',back);v.addEventListener('ended',back);
  });
}
var lb=$('#lightbox'),lbi=$('#lbImg'),lbc=$('#lbCap'),lastFocus;
function show(i){cur=(i+photos.length)%photos.length;var im=photos[cur];lbi.src=im.currentSrc||im.src;lbi.alt=im.alt;var c=im.closest('figure').querySelector('figcaption');lbc.textContent=c?c.textContent:''}
function open(img){var idx=photos.indexOf(img);if(idx<0){photos.push(img);idx=photos.length-1}lastFocus=document.activeElement;show(idx);lb.hidden=false;$('#lbClose').focus()}
function close(){lb.hidden=true;if(lastFocus)lastFocus.focus()}
$('#lbClose').onclick=close;$('#lbPrev').onclick=function(){show(cur-1)};$('#lbNext').onclick=function(){show(cur+1)};
lb.addEventListener('click',function(e){if(e.target===lb)close()});
document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});

/* ===== GUESTBOOK: wishes for Esha ===== */
var FB={project:'',key:''}; /* paste your Firebase projectId and apiKey here (see setup steps) */
var online=!!(FB.project&&FB.key),LS='esha-wishes',lastPost=0;
var fbBase='https://firestore.googleapis.com/v1/projects/'+FB.project+'/databases/(default)/documents';
var wForm=$('#wishForm'),wName=$('#wName'),wMsg=$('#wMsg'),wStat=$('#wStatus'),wList=$('#wishList'),wSend=$('#wSend');
function lsGet(){try{return JSON.parse(localStorage.getItem(LS)||'[]')}catch(e){return[]}}
function renderWishes(list){
  wList.textContent='';
  if(!list.length){var p=document.createElement('p');p.className='center tiny';p.textContent='No wishes yet. Be the first to write one for Esha 💗';wList.appendChild(p);return}
  list.forEach(function(w,i){
    var c=document.createElement('article');c.className='wcard w'+(i%4);
    var h=document.createElement('header'),n=document.createElement('b'),d=document.createElement('time'),m=document.createElement('p');
    n.textContent='💗 '+w.name;d.textContent=new Date(w.ts).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});m.textContent=w.message;
    h.appendChild(n);h.appendChild(d);c.appendChild(h);c.appendChild(m);wList.appendChild(c)});
}
function loadWishes(){
  if(!online){renderWishes(lsGet());return}
  fetch(fbBase+':runQuery?key='+encodeURIComponent(FB.key),{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({structuredQuery:{from:[{collectionId:'wishes'}],orderBy:[{field:{fieldPath:'ts'},direction:'DESCENDING'}],limit:100}})})
  .then(function(r){if(!r.ok)throw 0;return r.json()})
  .then(function(a){renderWishes(a.filter(function(x){return x.document}).map(function(x){var f=x.document.fields;
    return{name:f.name.stringValue,message:f.message.stringValue,ts:Number(f.ts.integerValue)}}))})
  .catch(function(){wList.textContent='';var p=document.createElement('p');p.className='center tiny';p.textContent='Could not load the wishes right now. Please try again later.';wList.appendChild(p)});
}
function saveWish(w){
  if(!online){var l=lsGet();l.unshift(w);try{localStorage.setItem(LS,JSON.stringify(l.slice(0,100)))}catch(e){}return Promise.resolve()}
  return fetch(fbBase+'/wishes?key='+encodeURIComponent(FB.key),{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({fields:{name:{stringValue:w.name},message:{stringValue:w.message},ts:{integerValue:String(w.ts)}}})})
  .then(function(r){if(!r.ok)throw 0});
}
wMsg.addEventListener('input',function(){$('#wCount').textContent=wMsg.value.length+' / 500'});
wForm.addEventListener('submit',function(e){
  e.preventDefault();
  var msg=wMsg.value.trim(),name=wName.value.trim()||'A friend';
  if(!msg){wStat.textContent='Please write a little wish first 💗';return}
  if(Date.now()-lastPost<15000){wStat.textContent='Please wait a few seconds before sending another wish.';return}
  wSend.disabled=true;wStat.textContent='Sending your wish...';
  saveWish({name:name.slice(0,40),message:msg.slice(0,500),ts:Date.now()}).then(function(){
    lastPost=Date.now();wMsg.value='';$('#wCount').textContent='0 / 500';wStat.textContent='Thank you! Your wish for Esha has been added 💗';
    var rc=wSend.getBoundingClientRect();burst(rc.left+rc.width/2,rc.top,18);loadWishes();
  }).catch(function(){wStat.textContent='Sorry, your wish could not be sent. Please try again.'}).then(function(){wSend.disabled=false});
});

/* ===== INTERACTIONS ===== */
function watchFades(){var els=$$('.fade');if(!('IntersectionObserver'in window)){els.forEach(function(e){e.classList.add('in')});return}
  var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.2});
  els.forEach(function(e,i){e.style.transitionDelay=i*.4+'s';io.observe(e)})}
$$('[data-scroll]').forEach(function(b){b.addEventListener('click',function(){$(b.dataset.scroll).scrollIntoView({behavior:reduce?'auto':'smooth'})})});
$('#loveBtn').onclick=function(e){var b=e.currentTarget.getBoundingClientRect();burst(b.left+b.width/2,b.top,26)};
$('#surpriseBtn').onclick=function(e){var s=$('#secret');s.hidden=!s.hidden;e.currentTarget.setAttribute('aria-expanded',String(!s.hidden));if(!s.hidden)burst(innerWidth/2,innerHeight/2,18)};
var taps=0;$('#tapHeart').onclick=function(e){var b=e.currentTarget;taps++;b.classList.add('pop');setTimeout(function(){b.classList.remove('pop')},350);
  b.style.fontSize=Math.min(2.6+taps*.15,6)+'rem';$('#tapCount').textContent='Tapped '+taps+' time'+(taps>1?'s':'')+' 💞';var rc=b.getBoundingClientRect();burst(rc.left+rc.width/2,rc.top,5)};
$('#wishHeart').onclick=function(e){var rc=e.currentTarget.getBoundingClientRect();burst(rc.left+rc.width/2,rc.top+rc.height/2,16)};
$('#toTop').onclick=function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})};
})();
