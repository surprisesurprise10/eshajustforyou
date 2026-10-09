(function(){'use strict';
/* ===== SETTINGS ===== */
var TZ='Asia/Karachi';
var DEADLINE=Date.parse('2026-10-10T00:00:00+05:00'); /* 12:00:00 AM PKT, Oct 10, 2026 (PKT = UTC+5, no DST) */
var ALLOW_TEST_PARAMS=false; /* set true ONLY for testing (?unlock=1 or ?countdown=20), then back to false */
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var deadline=DEADLINE,forceOpen=false;
if(ALLOW_TEST_PARAMS){var q=new URLSearchParams(location.search);
  if(q.get('unlock')==='1')forceOpen=true;
  if(q.get('countdown'))deadline=Date.now()+Number(q.get('countdown'))*1000;}

/* ===== TRUSTED TIME: ask the web server for its clock, then keep time with performance.now ===== */
var base=Date.now(),t0=performance.now();
function now(){return base+(performance.now()-t0)}
function sync(){
  if(location.protocol.indexOf('http')!==0)return;
  var s=Date.now();
  fetch(location.pathname+'?t='+s,{method:'HEAD',cache:'no-store'}).then(function(r){
    var d=Date.parse(r.headers.get('Date'));
    if(!isNaN(d)){base=d+(Date.now()-s)/2;t0=performance.now();}
  }).catch(function(){});
}
sync();setInterval(sync,60000);

/* ===== BACKGROUND DECOR ===== */
var fx=$('#fx');
function r(a,b){return a+Math.random()*(b-a)}
(function(){var n=window.innerWidth<600?14:24,h=['💗','💖','💕','🌸','✨','💞'],i,e;
  for(i=0;i<n;i++){e=document.createElement('span');e.className='fl';e.textContent=h[i%h.length];
    e.style.cssText='--x:'+r(0,96)+'vw;--s:'+r(14,34)+'px;--t:'+r(9,18)+'s;--d:'+r(-18,0)+'s;--dx:'+r(-60,60)+'px';fx.appendChild(e);}
  for(i=0;i<40;i++){e=document.createElement('i');e.className='star';
    e.style.cssText='--x:'+r(0,100)+'%;--y:'+r(0,100)+'%;--s:'+r(2,4)+'px;--d:'+r(0,3)+'s';fx.appendChild(e);}})();

function burst(x,y,n){
  if(reduce)n=Math.min(n,8);var em=['💗','💖','💕','✨','🌸'],i,e;
  for(i=0;i<n;i++){e=document.createElement('span');e.className='burst';e.textContent=em[i%em.length];
    e.style.cssText='left:'+x+'px;top:'+y+'px;font-size:'+r(16,34)+'px;--bx:'+r(-180,180)+'px;--by:'+r(-260,-40)+'px';
    document.body.appendChild(e);(function(el){setTimeout(function(){el.remove()},1900)})(e);}
}
function toast(msg){var t=document.createElement('div');t.className='toast';t.textContent=msg;t.setAttribute('role','status');document.body.appendChild(t);setTimeout(function(){t.remove()},4500)}

/* ===== COUNTDOWN / LOCK ===== */
var unlocked=false,lock=$('#lock'),uni=$('#universe');
function pad(n){return String(n).padStart(2,'0')}
function tick(){
  if(unlocked)return;
  var left=forceOpen?0:deadline-now();
  if(left<=0){unlock(false);return;}
  var s=Math.floor(left/1000);
  $('#cd-d').textContent=pad(Math.floor(s/86400));$('#cd-h').textContent=pad(Math.floor(s%86400/3600));
  $('#cd-m').textContent=pad(Math.floor(s%3600/60));$('#cd-s').textContent=pad(s%60);
}
var wasHidden=lock.hidden;
function unlock(){
  if(unlocked)return;unlocked=true;
  var late=now()-deadline>5000||forceOpen; /* opened long after midnight: skip the long show */
  uni.hidden=false;uni.classList.add('show');
  if(!late&&!reduce){for(var i=0;i<6;i++)setTimeout(function(){burst(r(60,innerWidth-60),innerHeight*.7,14)},i*300);}
  lock.classList.add('out');
  setTimeout(function(){lock.hidden=true;lock.style.display='none';document.body.style.overflow='';},late||reduce?50:1500);
  initGallery();watchFades();clock();
}

/* ===== PAKISTAN CLOCK ===== */
var fmt=new Intl.DateTimeFormat('en-GB',{timeZone:TZ,weekday:'long',day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
function clock(){var el=$('#pkClock');function u(){el.textContent='🕛 '+fmt.format(new Date(now()))+' (Pakistan time)'}u();setInterval(u,1000)}

/* ===== MEDIA: fallbacks, lightbox, videos ===== */
function fixImg(img){if(img.dataset.fixed)return;img.dataset.fixed=1;var f=img.closest('figure'),ph=document.createElement('div');
  ph.className='ph';ph.setAttribute('role','img');ph.setAttribute('aria-label','Photo placeholder');ph.textContent='💗';
  ph.style.setProperty('--ar',f&&f.style.getPropertyValue('--ar')||'3/4');img.replaceWith(ph)}
var photos=[],cur=0;
function initGallery(){
  $$('img.zoom').forEach(function(img){
    img.addEventListener('error',function(){fixImg(img)});
    if(img.complete&&img.naturalWidth===0&&img.getAttribute('loading')!=='lazy')fixImg(img);
    img.addEventListener('click',function(){open(img)});
  });
  var seen={};photos=$$('#gallery img.zoom');
  $$('video').forEach(function(v){
    var src=v.querySelector('source');
    if(src)src.addEventListener('error',function(){var c=v.closest('.vcard');c.classList.add('bad');c.querySelector('p').textContent='This video could not be played. Please re-save it as MP4 (H.264 + AAC).'});
    v.addEventListener('play',function(){$$('video').forEach(function(o){if(o!==v)o.pause()})});
  });
}
var lb=$('#lightbox'),lbi=$('#lbImg'),lbc=$('#lbCap'),lastFocus;
function show(i){cur=(i+photos.length)%photos.length;var im=photos[cur];lbi.src=im.currentSrc||im.src;lbi.alt=im.alt;var c=im.closest('figure').querySelector('figcaption');lbc.textContent=c?c.textContent:''}
function open(img){var idx=photos.indexOf(img);if(idx<0){photos.push(img);idx=photos.length-1}lastFocus=document.activeElement;show(idx);lb.hidden=false;$('#lbClose').focus()}
function close(){lb.hidden=true;if(lastFocus)lastFocus.focus()}
$('#lbClose').onclick=close;$('#lbPrev').onclick=function(){show(cur-1)};$('#lbNext').onclick=function(){show(cur+1)};
lb.addEventListener('click',function(e){if(e.target===lb)close()});
document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});

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
var mb=$('#musicBtn'),au=$('#bgMusic'),noMusic=function(){mb.textContent='Music: Off 🎵';mb.setAttribute('aria-pressed','false');toast('No music yet. Add your own file as audio/music.mp3 to enable it.')};
au.querySelector('source').addEventListener('error',noMusic);
mb.onclick=function(){
  if(!au.paused){au.pause();mb.textContent='Music: Off 🎵';mb.setAttribute('aria-pressed','false');return}
  var p=au.play();if(p&&p.then)p.then(function(){mb.textContent='Music: On 🎶';mb.setAttribute('aria-pressed','true')}).catch(function(){});
};
/* ===== START (after everything above is defined) ===== */
document.body.style.overflow='hidden';
tick();setInterval(tick,1000);
document.addEventListener('visibilitychange',tick);
})();
