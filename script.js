/* ================================================================
   EDIT ME — the easy settings for GitHub
   ================================================================ */
const CONFIG = {
  nameA: "",
  nameB: "Esha",
  tagline: "Under every moon and a million stars, my heart still finds its way to you.",
  // Date you got together, like "2025-02-14". Leave "" to hide the counter.
  togetherSince: "",
  // Free NASA key for the birthday sky photo. DEMO_KEY works but is rate limited.
  // Get your own free key at https://api.nasa.gov and paste it here.
  nasaKey: "DEMO_KEY"
};

/* ================================================================
   Helpers
   ================================================================ */
const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2,"0");
const fmt = n => Math.floor(n).toLocaleString("en-US");
const norm = s => s.toLowerCase().replace(/[^a-z\u0600-\u06ff]/g,"");
function hash(str){let h=2166136261;for(const c of str){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0)}
const WEEKDAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];

/* ---------- config -> page ---------- */
$("tagline").textContent=CONFIG.tagline;
$("footName").textContent=[CONFIG.nameA,CONFIG.nameB].filter(Boolean).join(" ♥ ")+(CONFIG.nameA&&CONFIG.nameB?"":" ♥");
document.title="A Piece of the Moon 🌙";

if(CONFIG.togetherSince){
  const since=new Date(CONFIG.togetherSince+"T00:00:00");
  const tick=()=>{
    const d=Math.floor((Date.now()-since)/864e5);
    $("together").textContent="Loving each other for "+fmt(d)+" days and counting";
  };
  tick(); setInterval(tick,60000);
}

/* ================================================================
   Starfield, shooting stars
   ================================================================ */
(function(){
  const cv=$("stars"),ctx=cv.getContext("2d");
  const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
  let W,H,stars=[],shoot=[];
  function resize(){
    const dpr=Math.min(devicePixelRatio||1,2);
    W=innerWidth;H=innerHeight;
    cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    const count=Math.round(W*H/5200);
    stars=Array.from({length:count},()=>({
      x:Math.random()*W,y:Math.random()*H,
      r:Math.random()*1.4+.2,
      p:Math.random()*Math.PI*2,
      s:Math.random()*.02+.005,
      c:["#ffffff","#dcd6ff","#ffd9ea","#fff3c4"][Math.floor(Math.random()*4)]
    }));
  }
  function frame(){
    ctx.clearRect(0,0,W,H);
    for(const s of stars){
      s.p+=reduce?0:s.s;
      const a=.45+.55*Math.abs(Math.sin(s.p));
      ctx.globalAlpha=a;ctx.fillStyle=s.c;
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,6.283);ctx.fill();
      if(s.r>1.1){ctx.globalAlpha=a*.25;ctx.beginPath();ctx.arc(s.x,s.y,s.r*3,0,6.283);ctx.fill()}
    }
    if(!reduce && Math.random()<.004 && shoot.length<2){
      shoot.push({x:Math.random()*W*.8+W*.2,y:Math.random()*H*.4,vx:-(6+Math.random()*4),vy:3+Math.random()*2,l:1});
    }
    for(let i=shoot.length-1;i>=0;i--){
      const m=shoot[i];
      const g=ctx.createLinearGradient(m.x,m.y,m.x-m.vx*10,m.y-m.vy*10);
      g.addColorStop(0,"rgba(255,255,255,"+m.l+")");g.addColorStop(1,"rgba(255,255,255,0)");
      ctx.globalAlpha=1;ctx.strokeStyle=g;ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(m.x,m.y);ctx.lineTo(m.x-m.vx*10,m.y-m.vy*10);ctx.stroke();
      m.x+=m.vx;m.y+=m.vy;m.l-=.012;
      if(m.l<=0)shoot.splice(i,1);
    }
    ctx.globalAlpha=1;
    requestAnimationFrame(frame);
  }
  addEventListener("resize",resize);resize();frame();
})();

/* click/tap anywhere: a little heart floats up */
document.addEventListener("pointerdown",e=>{
  if(e.target.closest("input,button,.falling,.card,.fstar,a"))return;
  const h=document.createElement("div");
  h.className="floaty";h.textContent=["♥","✦","♡","★"][Math.floor(Math.random()*4)];
  h.style.left=e.clientX-8+"px";h.style.top=e.clientY-8+"px";h.style.fontSize=(14+Math.random()*14)+"px";
  document.body.appendChild(h);setTimeout(()=>h.remove(),1800);
});

/* ================================================================
   Zodiac & birth facts
   ================================================================ */
const ZODIAC=[
 {n:"Capricorn",s:"♑",el:"Earth",from:[12,22],t:"Steady and devoted, you build love the way mountains are built: slowly, patiently, and to last. You show you care by showing up, again and again."},
 {n:"Aquarius",s:"♒",el:"Air",from:[1,20],t:"You love with an open mind and a rare, original heart. Your partner is never bored, and always feels free to be fully themselves."},
 {n:"Pisces",s:"♓",el:"Water",from:[2,19],t:"A dreamer who feels everything. Your love is poetry in motion: gentle, deep, and impossible to forget."},
 {n:"Aries",s:"♈",el:"Fire",from:[3,21],t:"Bold and warm, you fall fast and love fiercely. When you choose someone, you choose them with your whole chest."},
 {n:"Taurus",s:"♉",el:"Earth",from:[4,20],t:"Loyal, sensual and calm. You turn ordinary days into something cozy and sacred, and you never let go of the ones you love."},
 {n:"Gemini",s:"♊",el:"Air",from:[5,21],t:"Curious and playful, you flirt with words and make your partner laugh until the stars blink. Conversation is your love language."},
 {n:"Cancer",s:"♋",el:"Water",from:[6,21],t:"Ruled by the Moon itself. You love tenderly, remember everything that matters, and make any place feel like home."},
 {n:"Leo",s:"♌",el:"Fire",from:[7,23],t:"Radiant and generous, you love like a sunrise. You light up every room and make your partner feel like the only star in it."},
 {n:"Virgo",s:"♍",el:"Earth",from:[8,23],t:"Thoughtful and caring in the smallest details. You love through quiet acts that say, I noticed you."},
 {n:"Libra",s:"♎",el:"Air",from:[9,23],t:"Graceful and romantic, you were born for partnership. You search for balance and beauty, and you bring both to love."},
 {n:"Scorpio",s:"♏",el:"Water",from:[10,23],t:"Intense, magnetic and deeply faithful. You do not love halfway: when you give your heart, it is forever."},
 {n:"Sagittarius",s:"♐",el:"Fire",from:[11,22],t:"Adventurous and honest, you make love feel like a road trip under open skies. Your partner grows beside you."}
];
function zodiacOf(m,d){
  const order=ZODIAC.slice().sort((a,b)=>(a.from[0]*100+a.from[1])-(b.from[0]*100+b.from[1]));
  let pick=order[order.length-1]; // before Jan 20 -> Capricorn (wraps)
  const v=m*100+d;
  for(const z of order){ if(v>=z.from[0]*100+z.from[1]) pick=z; }
  if(v<120) pick=ZODIAC[0];
  return pick;
}
const CHINESE=["Monkey","Rooster","Dog","Pig","Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat"];
const BIRTHSTONE=["Garnet","Amethyst","Aquamarine","Diamond","Emerald","Pearl","Ruby","Peridot","Sapphire","Opal","Topaz","Turquoise"];
const BIRTHFLOWER=["Carnation","Violet","Daffodil","Daisy","Lily of the valley","Rose","Larkspur","Gladiolus","Aster","Marigold","Chrysanthemum","Holly"];
const WEEKDAY_TEXT={
  0:"Sunday’s child glows with warmth and brings light to whoever they love.",
  1:"Monday’s child is fair of face, tender, and ruled by the Moon.",
  2:"Tuesday’s child is full of grace and quietly brave in love.",
  3:"Wednesday’s child feels deeply and carries a lot of love inside.",
  4:"Thursday’s child has far to go, and a heart that always finds its way home.",
  5:"Friday’s child is loving and giving, the romantic of the week.",
  6:"Saturday’s child works hard for love and keeps it shining."
};
const LIFEPATH={
  1:"a natural leader who loves with courage",2:"a gentle peacemaker, made for partnership",3:"a joyful soul who loves with laughter and words",
  4:"a faithful builder of lasting love",5:"a free spirit who keeps love exciting",6:"the caretaker of the heart, devoted to home and family",
  7:"a deep thinker who loves with soul and mystery",8:"a powerful heart that loves with strength",9:"a compassionate romantic with love for the whole world",
  11:"a luminous, intuitive heart, a master number of love",22:"a master builder of dreams for two",33:"a master of unconditional love"
};
function lifePath(y,m,d){
  const red=n=>{while(n>9&&n!==11&&n!==22&&n!==33){n=String(n).split("").reduce((a,c)=>a+ +c,0)}return n};
  return red(red(y)+red(m)+red(d));
}

/* ================================================================
   Moon phase (calculated, no network needed)
   ================================================================ */
const SYN=29.530588853;
function moonAge(date){
  const jd=date.getTime()/86400000+2440587.5;
  let age=(jd-2451550.1)%SYN; if(age<0)age+=SYN; return age;
}
function phaseName(p){
  if(p<.03||p>.97)return "New moon";
  if(p<.22)return "Waxing crescent";
  if(p<.28)return "First quarter";
  if(p<.47)return "Waxing gibbous";
  if(p<.53)return "Full moon";
  if(p<.72)return "Waning gibbous";
  if(p<.78)return "Last quarter";
  return "Waning crescent";
}
function drawMoon(svg,p){
  const r=90,cx=100,cy=100,k=Math.cos(2*Math.PI*p),rx=(r*Math.abs(k)).toFixed(2);
  let path;
  if(p<.5){ path=`M ${cx} ${cy-r} A ${r} ${r} 0 0 1 ${cx} ${cy+r} A ${rx} ${r} 0 0 ${k>0?0:1} ${cx} ${cy-r} Z`; }
  else    { path=`M ${cx} ${cy-r} A ${r} ${r} 0 0 0 ${cx} ${cy+r} A ${rx} ${r} 0 0 ${k<0?0:1} ${cx} ${cy-r} Z`; }
  svg.innerHTML=`
    <defs><radialGradient id="mg" cx="40%" cy="35%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c9c4e8"/></radialGradient></defs>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#0d0a1c" stroke="rgba(236,233,255,.25)" stroke-width="1.5"/>
    <path d="${path}" fill="url(#mg)"/>`;
}

/* ================================================================
   Love matcher
   ================================================================ */
const ELEMENT_OK={Fire:"Air",Air:"Fire",Earth:"Water",Water:"Earth"};
function dobParts(v){ if(!v)return null; const [y,m,d]=v.split("-").map(Number); return {y,m,d}; }
function isEshaMatch(a,b){
  const x=norm(a),y=norm(b);
  return /esha/.test(x)||/esha/.test(y);
}
function verdictFor(p){
  if(p>=100)return "Written in the stars. Forever.";
  if(p>=90)return "A once-in-a-lifetime match";
  if(p>=80)return "Soulmates in the making";
  if(p>=70)return "A beautiful, growing love";
  if(p>=60)return "Sweet chemistry, worth nurturing";
  return "Opposites who can learn to orbit";
}
function calcMatch(n1,n2,d1,d2){
  if(isEshaMatch(n1,n2)) return {pct:100,special:true,parts:[100,100,100,100],text:"The moon has never seen two hearts fit so perfectly. Every star in the sky leans in to watch the two of you. This one is 100%, now and always."};
  const key=[norm(n1),norm(n2)].sort().join("|");
  const h=hash(key);
  let pct=54+(h%38); // 54..91
  let extra="";
  const a=dobParts(d1),b=dobParts(d2);
  if(a&&b){
    const za=zodiacOf(a.m,a.d),zb=zodiacOf(b.m,b.d);
    if(za.n===zb.n){pct+=6;extra=`You are both ${za.n}, so you understand each other without words. `}
    else if(za.el===zb.el){pct+=5;extra=`${za.n} and ${zb.n} share the ${za.el} element, a natural harmony. `}
    else if(ELEMENT_OK[za.el]===zb.el){pct+=4;extra=`${za.n} (${za.el}) and ${zb.n} (${zb.el}) feed each other’s flame. `}
    else {pct+=1;extra=`${za.n} and ${zb.n} are different elements, which means a love full of surprises. `}
    const la=lifePath(a.y,a.m,a.d),lb=lifePath(b.y,b.m,b.d);
    if(la===lb){pct+=3;extra+="Your life path numbers match too. "}
    else if((la+lb)%9===0||Math.abs(la-lb)===1){pct+=2}
  } else { extra="Add both birth dates for a deeper reading. " }
  pct=Math.min(99,pct);
  const mk=s=>Math.max(40,Math.min(99,pct-12+(hash(key+s)%25)));
  const text=extra+(pct>=80?"The stars lean close when you two are together.":pct>=65?"There is real warmth here. Give it time and a little moonlight.":"Every great love story starts with a spark. Yours just needs some tending.");
  return {pct,special:false,parts:[mk("h"),mk("m"),mk("s"),mk("p")],text};
}
$("matchBtn").addEventListener("click",()=>{
  const n1=$("m_name1").value.trim(),n2=$("m_name2").value.trim();
  if(!n1||!n2){ $("m_name"+(n1?2:1)).focus(); return; }
  const r=calcMatch(n1,n2,$("m_dob1").value,$("m_dob2").value);
  const res=$("result");res.classList.remove("show");void res.offsetWidth;res.classList.add("show");
  $("ringBar").style.strokeDashoffset=326.7;
  $("verdict").textContent=verdictFor(r.pct);
  $("reading").textContent=r.text;
  const labels=["Heart","Mind","Soul","Passion"];
  $("meters").innerHTML=labels.map((l,i)=>`<div class="meter">${l}<div><i data-w="${r.parts[i]}"></i></div></div>`).join("");
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    $("ringBar").style.strokeDashoffset=326.7*(1-r.pct/100);
    document.querySelectorAll("#meters i").forEach(el=>el.style.width=el.dataset.w+"%");
  }));
  let c=0;const step=Math.max(1,Math.round(r.pct/60));
  const t=setInterval(()=>{c=Math.min(r.pct,c+step);$("pct").textContent=c+"%";if(c>=r.pct)clearInterval(t)},22);
  if(r.special) burst();
  res.scrollIntoView({behavior:"smooth",block:"center"});
});
function burst(){
  for(let i=0;i<26;i++){
    const h=document.createElement("div");h.className="floaty";
    h.textContent=["♥","💖","✦","💗"][i%4];
    h.style.left=(20+Math.random()*60)+"vw";h.style.top=(55+Math.random()*30)+"vh";
    h.style.fontSize=(18+Math.random()*22)+"px";h.style.animationDelay=(Math.random()*.6)+"s";
    document.body.appendChild(h);setTimeout(()=>h.remove(),2600);
  }
}

/* ================================================================
   Birth sky: live age, moon, horoscope, events, sky photo
   ================================================================ */
let ageTimer=null;
function startClock(birth,bd){
  clearInterval(ageTimer);
  const upd=()=>{
    const now=new Date(),ms=now-birth;
    if(ms<0){["years","days","hours","mins","secs"].forEach(k=>$("c_"+k).textContent="0");return}
    let y=now.getFullYear()-birth.getFullYear();
    const ann=new Date(now.getFullYear(),birth.getMonth(),birth.getDate(),birth.getHours(),birth.getMinutes());
    if(now<ann)y--;
    $("c_years").textContent=y;
    $("c_days").textContent=fmt(ms/864e5);
    $("c_hours").textContent=fmt(ms/36e5);
    $("c_mins").textContent=fmt(ms/6e4);
    $("c_secs").textContent=fmt(ms/1000);
    let next=new Date(now.getFullYear(),birth.getMonth(),birth.getDate());
    if(next<=new Date(now.getFullYear(),now.getMonth(),now.getDate())&&!(next.toDateString()===now.toDateString())) next=new Date(now.getFullYear()+1,birth.getMonth(),birth.getDate());
    const days=Math.ceil((next-now)/864e5);
    $("nextBday").textContent=next.toDateString()===now.toDateString()?"Happy birthday! The stars are celebrating with you tonight.":"Next birthday in "+days+" day"+(days===1?"":"s")+".";
  };
  upd();ageTimer=setInterval(upd,1000);
}
async function loadEvents(m,d,y){
  const list=$("evList");
  list.innerHTML="<li>Looking through the stars…</li>";
  try{
    const res=await fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${pad(m)}/${pad(d)}`);
    if(!res.ok)throw new Error("bad");
    const data=await res.json();
    const mine=(data.events||[]).filter(e=>e.year===y).concat((data.births||[]).filter(e=>e.year===y));
    const births=(data.births||[]).slice().sort(()=>Math.random()-.5);
    let html="";
    if(mine.length){
      $("evTitle").textContent="What happened on your exact birthday";
      html+=mine.slice(0,4).map(e=>`<li><em>${e.year}</em> ${esc(e.text)}</li>`).join("");
    } else {
      $("evTitle").textContent="On this day through history";
      const ev=(data.events||[]).slice().sort(()=>Math.random()-.5).slice(0,4);
      html+=`<li>Nothing famous was recorded on ${MONTHS[m-1]} ${d}, ${y}, so you were the main event that day. Here is what else happened on ${MONTHS[m-1]} ${d} through history:</li>`;
      html+=ev.map(e=>`<li><em>${e.year}</em> ${esc(e.text)}</li>`).join("");
    }
    if(births.length){
      html+=`<li>You share a birthday with ${births.slice(0,3).map(b=>esc(b.text.split(",")[0])+" ("+b.year+")").join(", ")}.</li>`;
    }
    list.innerHTML=html||"<li>The history books are quiet that day. It belongs to you.</li>";
  }catch(e){
    $("evTitle").textContent="The world that day";
    list.innerHTML="<li>Could not reach the history archive. Open the site on GitHub Pages or with an internet connection to see what happened on your birthday.</li>";
  }
}
async function loadSkyPhoto(y,m,d){
  const fig=$("skyPhoto");fig.hidden=true;
  const date=`${y}-${pad(m)}-${pad(d)}`;
  if(new Date(date)<new Date("1995-06-16"))return; // NASA photo of the day starts here
  try{
    const res=await fetch(`https://api.nasa.gov/planetary/apod?api_key=${CONFIG.nasaKey}&date=${date}`);
    if(!res.ok)throw new Error("bad");
    const j=await res.json();
    if(j.media_type!=="image")return;
    $("skyImg").src=j.url;$("skyImg").alt=j.title;
    $("skyCap").textContent="NASA’s picture of the day on your birthday: "+j.title+(j.copyright?" © "+j.copyright.replace(/\s+/g," ").trim():"");
    fig.hidden=false;
  }catch(e){}
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

$("birthBtn").addEventListener("click",()=>{
  const v=$("b_date").value;
  if(!v){$("b_date").focus();return}
  const {y,m,d}=dobParts(v);
  const t=$("b_time").value||"";
  const birth=new Date(`${v}T${t||"00:00"}:00`);
  const name=$("b_name").value.trim();
  const z=zodiacOf(m,d);

  $("sky").classList.add("show");

  startClock(birth);

  // moon at birth: use time if given, else noon local
  const moonDate=new Date(`${v}T${t||"12:00"}:00`);
  const age=moonAge(moonDate),p=age/SYN;
  drawMoon($("phaseMoon"),p);
  const illum=Math.round((1-Math.cos(2*Math.PI*p))/2*100);
  $("phaseName").textContent=phaseName(p);
  $("phaseInfo").textContent=`${name?name+", the":"The"} moon was ${illum}% lit on the night you were born, about ${age.toFixed(1)} days into its cycle.`;

  $("zName").textContent=`${z.s} ${z.n}`;
  $("zText").textContent=(name?name+", ":"")+z.t;
  const wd=new Date(y,m-1,d).getDay();
  const lp=lifePath(y,m,d);
  $("facts").innerHTML=[
    ["Born on",`${WEEKDAYS[wd]}, ${MONTHS[m-1]} ${d}, ${y}`],
    ["Element",z.el],
    ["Weekday",WEEKDAY_TEXT[wd]],
    ["Life path",`${lp}, ${LIFEPATH[lp]}`],
    ["Chinese sign",`${CHINESE[y%12]}`],
    ["Birthstone",BIRTHSTONE[m-1]],
    ["Birth flower",BIRTHFLOWER[m-1]]
  ].map(([k,val])=>`<li><b>${k}</b><span>${esc(val)}</span></li>`).join("");

  loadSkyPhoto(y,m,d);
  loadEvents(m,d,y);
  try{localStorage.setItem("birth",JSON.stringify({n:name,d:v,t:t}))}catch(e){}
  $("sky").scrollIntoView({behavior:"smooth",block:"start"});
});
try{
  const sv=JSON.parse(localStorage.getItem("birth")||"null");
  if(sv){$("b_name").value=sv.n||"";$("b_date").value=sv.d||"";$("b_time").value=sv.t||""}
}catch(e){}

/* ================================================================
   Game 1: Catch the hearts
   ================================================================ */
(function(){
  const arena=$("arena"),ov=$("hOverlay");
  let score=0,time=30,spawn=null,clock=null,running=false,best=0;
  try{best=+localStorage.getItem("heartBest")||0}catch(e){}
  $("hBest").textContent=best;
  function end(){
    running=false;clearInterval(spawn);clearInterval(clock);
    arena.querySelectorAll(".falling").forEach(n=>n.remove());
    if(score>best){best=score;try{localStorage.setItem("heartBest",best)}catch(e){}$("hBest").textContent=best}
    ov.style.display="grid";
    ov.innerHTML=`<div><p style="font-size:1.6rem">You caught ${score} love points!</p><p class="small" style="margin:.4rem 0 1rem">${score>=40?"Your heart is full of stars.":score>=20?"Beautiful. Esha would be proud.":"Try again, love is worth catching."}</p><button class="btn" id="hStart2" type="button">Play again</button></div>`;
    $("hStart2").onclick=start;
  }
  function pop(x,y,txt){
    const p=document.createElement("div");p.className="pop";p.textContent=txt;
    p.style.left=x+"px";p.style.top=y+"px";arena.appendChild(p);setTimeout(()=>p.remove(),700);
  }
  function add(){
    const roll=Math.random();
    const kind=roll<.12?"star":roll<.24?"broken":"heart";
    const b=document.createElement("button");b.type="button";b.className="falling";
    b.textContent=kind==="star"?"⭐":kind==="broken"?"💔":["💖","💗","💕","❤️"][Math.floor(Math.random()*4)];
    b.setAttribute("aria-label",kind);
    const size=26+Math.random()*20;
    b.style.fontSize=size+"px";
    b.style.left=Math.random()*(arena.clientWidth-size-6)+"px";
    b.style.animationDuration=(2.4+Math.random()*2)+"s";
    b.addEventListener("pointerdown",e=>{
      e.preventDefault();
      if(!running)return;
      const val=kind==="star"?5:kind==="broken"?-3:1;
      score=Math.max(0,score+val);$("hScore").textContent=score;
      const r=arena.getBoundingClientRect();
      pop(e.clientX-r.left,e.clientY-r.top,(val>0?"+":"")+val);
      b.remove();
    });
    b.addEventListener("animationend",()=>b.remove());
    arena.appendChild(b);
  }
  function start(){
    score=0;time=30;running=true;
    $("hScore").textContent=0;$("hTime").textContent=30;
    ov.style.display="none";
    spawn=setInterval(add,520);
    clock=setInterval(()=>{time--;$("hTime").textContent=time;if(time<=0)end()},1000);
  }
  $("hStart").onclick=start;
})();

/* ================================================================
   Game 2: Memory of hearts
   ================================================================ */
(function(){
  const icons=["💖","🌙","⭐","🌹","💌","🦋","💍","🔮"];
  const box=$("memory");
  let first=null,lock=false,moves=0,pairs=0;
  function build(){
    box.innerHTML="";moves=0;pairs=0;first=null;lock=false;
    $("mMoves").textContent=0;$("mPairs").textContent=0;
    const deck=icons.concat(icons).sort(()=>Math.random()-.5);
    deck.forEach(ic=>{
      const c=document.createElement("button");c.type="button";c.className="card";
      c.dataset.i=ic;c.textContent=ic;c.setAttribute("aria-label","Hidden card");
      c.addEventListener("click",()=>flip(c));
      box.appendChild(c);
    });
  }
  function flip(c){
    if(lock||c.classList.contains("open")||c.classList.contains("done"))return;
    c.classList.add("open");
    if(!first){first=c;return}
    moves++;$("mMoves").textContent=moves;
    if(first.dataset.i===c.dataset.i){
      first.classList.replace("open","done");c.classList.replace("open","done");
      first=null;pairs++;$("mPairs").textContent=pairs;
      if(pairs===8)setTimeout(()=>{burst();alert("You matched every heart in "+moves+" moves. Love wins!")},300);
    } else {
      lock=true;
      setTimeout(()=>{first.classList.remove("open");c.classList.remove("open");first=null;lock=false},800);
    }
  }
  $("mReset").onclick=build;build();
})();

/* ================================================================
   Game 3: Wish on a star
   ================================================================ */
(function(){
  const msgs=[
    "Someone out there thinks of you every time the moon comes out.",
    "Your next year holds more laughter than you can count.",
    "Love is already walking toward you, or sitting right beside you.",
    "You are somebody’s favorite notification.",
    "Make a wish. The universe has been waiting for you to ask.",
    "Even the brightest star would borrow your smile.",
    "Tonight, the sky is on your side.",
    "A small surprise full of love is coming your way."
  ];
  const wrap=$("fstars");
  for(let i=0;i<5;i++){
    const b=document.createElement("button");b.type="button";b.className="fstar";b.textContent="✨";
    b.setAttribute("aria-label","Wish star "+(i+1));
    b.onclick=()=>{
      $("fortune").textContent=msgs[Math.floor(Math.random()*msgs.length)];
      b.classList.add("used");setTimeout(()=>b.classList.remove("used"),1500);
    };
    wrap.appendChild(b);
  }
})();
