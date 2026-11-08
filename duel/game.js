/* Bibbits Duel — 1v1 autobattler. Shop, fusion, automatic combat, Supabase matchmaking. */
(function(){
const ART='../shots/final_art/';
const SB_URL='https://lqapqculclmfiudrnelc.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxYXBxY3VsY2xtZml1ZHJuZWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjExMDEsImV4cCI6MjEwOTYzNzEwMX0.cSOZmhyn6hBDDSnt3F3drrfZl8IOChndnv2veE0-qPc';
const HEROES=[
  {id:'petrol',name:'Pétrol',atk:3,hp:4,cost:3,tier:1,el:'#f5e564'},
  {id:'sylve',name:'Sylve',atk:4,hp:5,cost:3,tier:1,el:'#9edc63'},
  {id:'marea',name:'Maréa',atk:2,hp:6,cost:3,tier:1,el:'#51cfff'},
  {id:'zephyr',name:'Zéphyr',atk:5,hp:3,cost:3,tier:1,el:'#9aeafa'},
  {id:'granit',name:'Granit',atk:3,hp:8,cost:4,tier:2,el:'#e4b35b',taunt:true},
  {id:'aurel',name:'Aurel',atk:4,hp:6,cost:4,tier:2,el:'#ffe6a4'},
  {id:'lune',name:'Lune',atk:5,hp:5,cost:4,tier:2,el:'#c9a0ff'},
  {id:'brok',name:'Brok',atk:4,hp:5,cost:4,tier:2,el:'#ff683e'},
  {id:'krom',name:'Krom',atk:6,hp:9,cost:5,tier:3,el:'#9ec9ff'},
  {id:'nyx',name:'Nyx',atk:5,hp:6,cost:5,tier:3,el:'#f664a4'}
];
const byId={};HEROES.forEach(h=>byId[h.id]=h);
const TIERS=['','Essentiel','Relief','Éveil','Chromatique','Solaire','Prisme'];
const TH=[0,2,5,9,14,20];
const $=s=>document.querySelector(s);
const view=()=>document.getElementById('view');
let uidN=1;
const uid=()=>'u'+(uidN++);
function load(){try{return JSON.parse(localStorage.bb12||'{}')}catch(e){return{}}}
function saveP(){localStorage.bb12=JSON.stringify(P)}
let P=Object.assign({hero:'brok',wins:0,skin:false,xp:{},boosts:1,id:''},load());
if(!P.id){P.id=crypto.randomUUID();saveP()}
let sb=null;
try{sb=window.supabase.createClient(SB_URL,SB_KEY)}catch(e){sb=null}
let M=null, chan=null, poll=null, clock=null, drag=null, busy=false;

function tierOf(id){const x=P.xp[id]||0;let t=1;for(let i=1;i<TH.length;i++)if(x>=TH[i])t=i+1;return t}
function income(r){return Math.min(10,2+r)}
function heroDmg(round,survivors){return Math.max(1,Math.min(8,round+survivors))}
function pool(round){return HEROES.filter(h=>h.tier<=(round>=4?3:round>=2?2:1))}
function rollShop(round,rng){
  const bag=pool(round);
  const out=[];
  for(let i=0;i<5;i++) out.push(bag[Math.floor(rng()*(bag.length))]||bag[0]);
  return out;
}
function makeUnit(h,golden){
  const atk=golden?h.atk+3:h.atk, hp=golden?h.hp+4:h.hp;
  return {uid:uid(),id:h.id,name:h.name,atk,hp,max:hp,cost:h.cost,el:h.el,taunt:!!h.taunt,golden:!!golden};
}
function emptyBoard(){return [null,null,null,null,null,null]}
function freshState(round){
  const rng=Math.random;
  return {gold:income(round||1),board:emptyBoard(),shop:rollShop(round||1,rng),freeze:false};
}
function canPlace(board,h){
  const copies=board.filter(u=>u&&u.id===h.id&&!u.golden);
  if(copies.length>=2) return true;
  return board.some(u=>!u);
}
function buy(st,index){
  const h=st.shop[index];
  if(!h||st.gold<h.cost) return false;
  const copies=st.board.map((u,i)=>u&&u.id===h.id&&!u.golden?i:-1).filter(i=>i>=0);
  if(copies.length>=2){
    st.gold-=h.cost;
    st.board[copies[0]]=makeUnit(h,true);
    st.board[copies[1]]=null;
    st.shop[index]=null;
    return true;
  }
  const slot=st.board.findIndex(u=>!u);
  if(slot<0) return false;
  st.gold-=h.cost;
  st.board[slot]=makeUnit(h,false);
  st.shop[index]=null;
  return true;
}
function sell(st,i){
  const u=st.board[i]; if(!u) return;
  st.gold+=u.golden?2:1;
  st.board[i]=null;
}
function reroll(st,round){
  if(st.gold<1) return;
  st.gold-=1; st.freeze=false; st.shop=rollShop(round,Math.random);
}
function living(arr){return arr.map((u,i)=>u&&u.hp>0?{u,i}:null).filter(Boolean)}
function pickTarget(enemies,myIndex){
  const live=living(enemies); if(!live.length) return null;
  const ta=live.filter(x=>x.u.taunt);
  const pool=ta.length?ta:live;
  pool.sort((a,b)=>Math.abs(a.i-myIndex)-Math.abs(b.i-myIndex)||a.i-b.i);
  return pool[0].i;
}
function fight(you,foe){
  const A=you.map(u=>u?Object.assign({},u):null);
  const B=foe.map(u=>u?Object.assign({},u):null);
  const log=[];
  const swing=(side,arr,other)=>{
    arr.forEach((u,i)=>{
      if(!u||u.hp<=0) return;
      if(!living(other).length) return;
      const ti=pickTarget(other,i);
      const t=other[ti];
      const before=t.hp;
      t.hp=Math.max(0,t.hp-u.atk);
      log.push({attackId:log.length,side,from:i,to:ti,dmg:u.atk,srcName:u.name,tgtName:t.name,hpBefore:before,hpAfter:t.hp,max:t.max||t.hp,dead:t.hp<=0});
    });
  };
  let guard=0;
  while(living(A).length&&living(B).length&&guard++<12){
    swing('you',A,B);
    if(!living(B).length) break;
    swing('foe',B,A);
  }
  return {log,a:living(A).length,b:living(B).length};
}

function cardHTML(h,opt){
  opt=opt||{};
  const name=(opt.name||h.name||'').toUpperCase();
  const golden=opt.golden;
  return `<div class="ucard${golden?' gold':''}${opt.sel?' sel':''}${opt.dead?' dead':''}" ${opt.id?'id="'+opt.id+'"':''} data-k="${opt.k||''}" data-i="${opt.i!=null?opt.i:''}" style="--el:${golden?'#ffe08a':(h.el||'#e6c56a')}">
    <img class="art" alt="" src="${ART}${(h.id||h)}.png">
    ${golden?'<div class="tag">FUSION OR</div>':''}
    ${h.taunt&&!opt.hide?'<div class="tag taunt">PROVOC</div>':''}
    <div class="nm">${name}</div>
    <div class="badge atk">${opt.atk!=null?opt.atk:h.atk}</div>
    <div class="badge hp" data-hp>${opt.hp!=null?opt.hp:h.hp}</div>
  </div>`;
}
function slotHTML(u,i){
  if(!u) return `<div class="slot" data-slot="${i}"><div class="empty" data-slot="${i}"><span>+</span>EMPLACEMENT</div></div>`;
  return `<div class="slot" data-slot="${i}">${cardHTML(u,{i,k:'team',golden:u.golden,atk:u.atk,hp:u.hp,name:u.name})}</div>`;
}
function hpBlock(label,name,hero,hp,barId){
  const pct=Math.max(0,Math.min(100,hp/15*100));
  const id=barId?` id="${barId}"`:'' ;
  const nid=barId?` id="${barId}n"`:'';
  return `<div class="who"><img class="avatar" alt="" src="${ART}${hero}.png"><div class="meta"><div class="kicker">${label}</div><div class="nm">${name}</div><div class="bar"><i${id} style="width:${pct}%"></i></div></div><div class="hpnum"${nid}><span>${Math.max(0,hp)}</span><small>/15 PV</small></div></div>`;
}
function applySkin(){document.body.classList.toggle('skin-ink',!!(P.skin&&P.wins>=2))}

function screenMenu(){
  view().innerHTML=`<div class="menu">
    <div class="top"><span></span><div class="brand">BIBBITS</div><span class="live">MENU</span></div>
    <h1>DUEL</h1><div class="sub">1 CONTRE 1 · BATAILLE AUTO</div>
    <div class="tiny" style="text-align:center">Ton héros</div>
    <div class="heroes">${HEROES.map(h=>`<button class="hpick${P.hero===h.id?' on':''}" data-h="${h.id}"><img alt="" src="${ART}${h.id}.png"><span>${h.name}</span></button>`).join('')}</div>
    <div class="stack">
      <button class="ready" id="play">JOUER<small>Matchmaking en direct · un bot si personne n'est là</small></button>
      <button class="ghost" id="col">COLLECTION</button>
      <button class="ghost" id="boost">BOOSTER · ${P.boosts||0}</button>
      ${P.wins>=2?`<button class="ghost" id="skin">${P.skin?'PEAU ENCRE & OR · ÉQUIPÉE':'ÉQUIPER ENCRE & OR'}</button>`:`<p class="tiny" style="text-align:center">Peau Encre & or après 2 victoires (${P.wins}/2)</p>`}
    </div></div>`;
  view().querySelectorAll('.hpick').forEach(b=>b.onclick=()=>{P.hero=b.dataset.h;saveP();screenMenu()});
  $('#play').onclick=()=>startSearch();
  $('#col').onclick=()=>screenCollection();
  $('#boost').onclick=()=>P.boosts>0?screenBoost():screenCollection();
  const sk=$('#skin'); if(sk) sk.onclick=()=>{P.skin=!P.skin;saveP();applySkin();screenMenu()};
}

let searchTimer=null;
async function startSearch(){
  view().innerHTML=`<div class="search"><div class="orb">✧</div><div class="kicker" style="letter-spacing:.2em;color:var(--gold)">BIBBITS</div><h1 style="font-size:32px">RECHERCHE</h1><p class="tiny">Un adversaire, ou un bot dans un instant.</p><button class="ghost" id="cancel" style="max-width:200px">ANNULER</button></div>`;
  $('#cancel').onclick=()=>{cleanupSearch();screenMenu()};
  const me=HEROES.find(h=>h.id===P.hero)||HEROES[0];
  if(!sb){setTimeout(()=>startBot(me),800);return}
  const t0=Date.now();
  const tick=async()=>{
    if(!document.getElementById('cancel')) return;
    try{
      const {data,error}=await sb.rpc('duel_touch',{p:P.id,n:me.name});
      if(error) throw error;
      if(data&&data.room){cleanupSearch();return enterRoom(data.room,data.you)}
    }catch(e){/* fall through to bot */}
    if(Date.now()-t0>4000){cleanupSearch();try{await sb.rpc('duel_leave',{p:P.id})}catch(e){} startBot(me);return}
    searchTimer=setTimeout(tick,700);
  };
  tick();
}
function cleanupSearch(){clearTimeout(searchTimer);searchTimer=null}

function startBot(me){
  const others=HEROES.filter(h=>h.id!==me.id);
  const opp=others[(Math.random()*others.length)|0];
  const round=1;
  M={bot:true,you:'p1',phase:'shop',round,hp1:15,hp2:15,ends:Date.now()+20000,
    me:freshState(round),foe:freshState(round),hero:me.id,oppHero:opp.id,oppName:opp.name,ready:false,foeReady:false,combat:null};
  botAct();
  setTimeout(()=>{if(M&&M.bot&&M.phase==='shop'){M.foeReady=true;renderShop()}},2500);
  renderShop();
  startClock();
}
function botAct(){
  const st=M.foe, r=M.round, guard={n:0};
  const once=()=>{
    const opts=st.shop.map((h,i)=>h&&h.cost<=st.gold&&canPlace(st.board,h)?{h,i}:null).filter(Boolean);
    if(opts.length){
      opts.sort((a,b)=>(b.h.atk+b.h.hp)-(a.h.atk+a.h.hp));
      buy(st,opts[0].i); return true;
    }
    if(st.gold>=1 && st.board.filter(Boolean).length<5 && guard.n++<2){reroll(st,r);return true}
    return false;
  };
  let n=0; while(n++<8 && once()){}
  const t=st.board.findIndex(u=>u&&u.taunt);
  if(t>0){const x=st.board[0];st.board[0]=st.board[t];st.board[t]=x}
}

async function enterRoom(id,you){
  const {data,error}=await sb.from('duel_rooms').select('*').eq('id',id).single();
  if(error||!data){startBot(HEROES.find(h=>h.id===P.hero));return}
  M={bot:false,you,room:id,row:data,phase:data.phase,round:data.round,hp1:data.p1_hp,hp2:data.p2_hp,
    ends:new Date(data.shop_ends).getTime(),me:freshState(data.round),foe:freshState(data.round),
    hero:P.hero,oppHero:'nyx',oppName:you==='p1'?data.p2_name:data.p1_name,ready:false};
  M.me.hero=P.hero;
  await push(false);
  if(chan) sb.removeChannel(chan);
  chan=sb.channel('room-'+id).on('postgres_changes',{event:'*',schema:'public',table:'duel_rooms',filter:'id=eq.'+id},payload=>{
    if(payload.new) onRoom(payload.new);
  }).subscribe();
  poll=setInterval(async()=>{
    const {data}=await sb.from('duel_rooms').select('*').eq('id',id).single();
    if(data) onRoom(data);
  },1000);
  renderShop();
  startClock();
}
function onRoom(row){
  if(!M||M.bot||M.room!==row.id) return;
  const prev=M.phase, prevHp1=M.hp1, prevHp2=M.hp2;
  M.row=row; M.phase=row.phase; M.round=row.round; M.hp1=row.p1_hp; M.hp2=row.p2_hp;
  M.ends=new Date(row.shop_ends).getTime();
  M.oppName=M.you==='p1'?row.p2_name:row.p1_name;
  const fo=M.you==='p1'?row.p2_state:row.p1_state;
  if(fo&&fo.board) M.foe=fo;
  if(row.phase==='combat'&&prev!=='combat'&&row.combat){M.hpShown={p1:prevHp1,p2:prevHp2};M.combat=row.combat;playCombat()}
  else if(row.phase==='result'&&prev!=='result') showResult(row.winner);
  else if(row.phase==='shop'&&prev==='combat'){nextLocalShop();renderShop()}
  else if(row.phase==='shop') renderShop();
}
function myHp(){return M.you==='p1'?M.hp1:M.hp2}
function oppHp(){return M.you==='p1'?M.hp2:M.hp1}
async function push(ready){
  if(!M||M.bot){M.ready=!!ready;return}
  M.ready=!!ready;
  const st={gold:M.me.gold,board:M.me.board,shop:M.me.shop,freeze:M.me.freeze,hero:P.hero};
  await sb.rpc('duel_sync',{rid:M.room,p:P.id,st,rdy:!!ready});
}
function startClock(){
  clearInterval(clock);
  clock=setInterval(()=>{
    if(!M||M.phase!=='shop') return;
    const left=Math.max(0,M.ends-Date.now());
    const el=document.getElementById('time');
    if(el) el.textContent=fmt(left);
    if(left<=0 && !busy) goCombat();
  },200);
}
function fmt(ms){const s=Math.ceil(ms/1000);return '00:'+String(s).padStart(2,'0')}
function stopNet(){clearInterval(clock);clearInterval(poll);poll=null;if(chan&&sb){sb.removeChannel(chan);chan=null}}

function renderShop(){
  if(!M) return;
  const left=Math.max(0,M.ends-Date.now());
  const foeReady=M.bot?M.foeReady:(M.row&&(M.you==='p1'?M.row.p2_ready:M.row.p1_ready));
  view().innerHTML=`<div class="top"><button class="iconbtn" id="back">‹</button><div class="brand">BIBBITS</div><div class="live">${M.bot?'CONTRE UN BOT':'PVP · EN DIRECT'}</div></div>
    ${hpBlock(M.bot?'BOT':'ADVERSAIRE',M.oppName,M.oppHero,oppHp(),'oppbar')}
    <div class="roundrow"><div class="plaque"><div class="k">MANCHE ${String(M.round).padStart(2,'0')}</div><div class="v">RECRUTEMENT</div></div>
      <div class="plaque" style="text-align:right"><div class="k">FIN DANS</div><div class="v" id="time">${fmt(left)}</div></div></div>
    <div class="shop-scroll">
    <div class="sec"><span>LE MARCHÉ</span><b>GLISSEZ UNE RECRUE</b></div>
    <div class="market">${M.me.shop.map((h,i)=>h?`<div class="offer"><div data-shop="${i}">${cardHTML(h,{k:'shop',i})}</div><div class="price"><i class="coin"></i>${h.cost}</div></div>`:`<div class="offer"></div>`).join('')}</div>
    <div class="actions">
      <div class="pill goldbox"><i class="coin"></i> ${M.me.gold}</div>
      <button class="pill" id="reroll">RELANCER <b>1</b></button>
      <button class="pill" id="freeze">${M.me.freeze?'GELÉ':'GELER'} <b>0</b></button>
    </div>
    <div class="sec"><span>VOTRE ÉQUIPE</span><b>${M.me.board.filter(Boolean).length} / 6 · GLISSEZ POUR PLACER</b></div>
    <div class="teamgrid">${M.me.board.map((u,i)=>slotHTML(u,i)).join('')}</div>
    <div class="note"><div class="mark">III</div><div><b>3 EXEMPLAIRES → FUSION OR</b><div class="tiny">Même recrue. Puissance supérieure.</div></div></div>
    </div>
    <div class="dock">
    <div class="sell" id="sell" data-sell="1">VENDRE · GLISSEZ ICI · 1 PIÈCE</div>
    ${hpBlock('VOTRE HÉROS',byId[P.hero].name,P.hero,myHp(),'mybar')}
    <button class="ready" id="ready" ${M.ready?'disabled':''}>PRÊT<small>${foeReady?'Adversaire prêt · ':' '}Combat dès que les deux sont prêts.</small></button>
    </div>`;
  $('#back').onclick=()=>{combatToken++; if(confirm('Quitter le match ?')){stopNet();M=null;screenMenu()}};
  $('#reroll').onclick=()=>{if(reroll(M.me,M.round)){push(false);renderShop()}};
  $('#freeze').onclick=()=>{M.me.freeze=!M.me.freeze;push(false);renderShop()};
  $('#ready').onclick=()=>goCombat();
  bindBoard();
  if(M.flash==='merge') fuseShow();
  else if(M.flash==='buy'){const el=document.querySelector('.teamgrid .ucard'); if(el) el.classList.add('pop')}
  else if(M.flash==='sell') floatTip('+'+M.sellN, document.getElementById('sell'));
  M.flash=null;
  kick();
}
function bindBoard(){
  view().querySelectorAll('[data-shop]').forEach(el=>{
    el.onpointerdown=e=>beginDrag(e,'shop',+el.dataset.shop);
  });
  view().querySelectorAll('.ucard[data-k="team"]').forEach(el=>{
    el.onpointerdown=e=>beginDrag(e,'team',+el.dataset.i);
  });
}
function beginDrag(e,kind,index){
  drag={kind,index,x:e.clientX,y:e.clientY,moved:false};
  const move=ev=>{if(drag&&Math.hypot(ev.clientX-drag.x,ev.clientY-drag.y)>10) drag.moved=true};
  const up=ev=>{
    window.removeEventListener('pointermove',move);
    window.removeEventListener('pointerup',up);
    if(!drag||!M) return;
    const el=document.elementFromPoint(ev.clientX,ev.clientY);
    const slot=el&&el.closest('[data-slot]');
    const sell=el&&el.closest('[data-sell]');
    if(drag.kind==='shop'){
      if(!drag.moved||slot) tryBuy(drag.index,slot?+slot.dataset.slot:null);
    }else if(drag.kind==='team'){
      if(sell){sellUnit(drag.index)}
      else if(slot){swap(+drag.index,+slot.dataset.slot)}
      else if(!drag.moved){M.sel=M.sel===drag.index?null:drag.index;renderShop()}
    }
    drag=null;
  };
  window.addEventListener('pointermove',move);
  window.addEventListener('pointerup',up);
}
function tryBuy(shopIndex,slot){
  const h=M.me.shop[shopIndex];
  if(!h) return;
  if(M.me.gold<h.cost){flash('#reroll');return}
  if(slot!=null&&!M.me.board[slot]){
    const copies=M.me.board.filter(u=>u&&u.id===h.id&&!u.golden).length;
    if(copies<2){
      M.me.gold-=h.cost; M.me.board[slot]=makeUnit(h,false); M.me.shop[shopIndex]=null;
      M.flash='buy'; push(false); renderShop(); return;
    }
  }
  const willMerge=M.me.board.filter(u=>u&&u.id===h.id&&!u.golden).length>=2;
  if(!buy(M.me,shopIndex)) return;
  M.flash=willMerge?'merge':'buy';
  push(false); renderShop();
}
function sellUnit(i){
  const u=M.me.board[i]; if(!u) return;
  const gain=u.golden?2:1;
  sell(M.me,i); if(M.sel===i) M.sel=null;
  M.flash='sell'; M.sellN=gain;
  push(false); renderShop();
}
function swap(a,b){if(a===b)return;const t=M.me.board[a];M.me.board[a]=M.me.board[b];M.me.board[b]=t;push(false);renderShop()}
function flash(sel){const n=$(sel);if(n){n.animate([{transform:'translateX(-3px)'},{transform:'translateX(3px)'},{transform:'none'}],{duration:220})}}

async function goCombat(){
  if(!M||M.phase!=='shop'||busy) return;
  if(M.bot){
    M.ready=true;
    if(!M.foeReady){M.foeReady=true}
    resolveLocal();
    return;
  }
  await push(true);
  const both=M.row&&((M.you==='p1'?M.row.p2_ready:M.row.p1_ready));
  const timeup=Date.now()>=M.ends-200;
  if(M.you==='p1'&&(both||timeup)) await hostBegin();
  else if(timeup&&M.you==='p2') setTimeout(()=>hostBegin(),400);
}
async function hostBegin(){
  if(!M||M.bot) return;
  const {data}=await sb.from('duel_rooms').select('*').eq('id',M.room).single();
  if(!data||data.phase!=='shop'){if(data)onRoom(data);return}
  const mine=data.p1===P.id?data.p1_state:data.p2_state;
  const theirs=data.p1===P.id?data.p2_state:data.p1_state;
  const youBoard=((mine&&mine.board)||M.me.board||[]).filter(Boolean);
  const foeBoard=((theirs&&theirs.board)||[]).filter(Boolean);
  const sim=fight(youBoard,foeBoard);
  const dYou=sim.b>0?heroDmg(data.round,sim.b):0;
  const dFoe=sim.a>0?heroDmg(data.round,sim.a):0;
  let hp1=data.p1_hp, hp2=data.p2_hp;
  if(M.you==='p1'){hp1-=dYou;hp2-=dFoe}else{hp2-=dYou;hp1-=dFoe}
  const win=hp1<=0&&hp2<=0?'draw':hp1<=0?'p2':hp2<=0?'p1':null;
  const log={you:youBoard,foe:foeBoard,steps:sim.log,dYou,dFoe,youSide:M.you,aliveYou:sim.a,aliveFoe:sim.b};
  await sb.rpc('duel_begin',{rid:M.room,p:P.id,log,hp1,hp2,win});
}
function resolveLocal(){
  const sim=fight(M.me.board.filter(Boolean),M.foe.board.filter(Boolean));
  const dYou=sim.b>0?heroDmg(M.round,sim.b):0;
  const dFoe=sim.a>0?heroDmg(M.round,sim.a):0;
  M.hpShown={p1:M.hp1,p2:M.hp2};
  M.hp1-=dYou; M.hp2-=dFoe;
  M.phase='combat';
  M.combat={you:M.me.board.filter(Boolean),foe:M.foe.board.filter(Boolean),steps:sim.log,dYou,dFoe,youSide:'p1',aliveYou:sim.a,aliveFoe:sim.b};
  playCombat();
}

let spd=+(localStorage.bbSpd||1), combatToken=0;
const reduceMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function shownMine(){if(!M.hpShown) return myHp(); return M.you==='p1'?M.hpShown.p1:M.hpShown.p2}
function shownOpp(){if(!M.hpShown) return oppHp(); return M.you==='p1'?M.hpShown.p2:M.hpShown.p1}
function kick(){const v=view(); v.classList.remove('in'); void v.offsetWidth; v.classList.add('in')}
function fuseShow(){const n=document.createElement('div'); n.className='fuse'; n.innerHTML='<b>FUSION OR</b>'; view().appendChild(n); setTimeout(()=>n.remove(),900)}
function floatTip(text,el){if(!el) return; const r=el.getBoundingClientRect(); const f=document.createElement('div'); f.className='float tip'; f.textContent=text; f.style.left=(r.left+r.width/2)+'px'; f.style.top=r.top+'px'; document.body.appendChild(f); f.animate([{opacity:1,transform:'translate(-50%,0)'},{opacity:0,transform:'translate(-50%,-28px)'}],{duration:700}).onfinish=()=>f.remove()}
function playCombat(){
  if(!M||!M.combat||busy) return;
  busy=true;
  const token=++combatToken;
  const c=M.combat;
  const writer=c.youSide||'p1';
  const mine=M.bot||M.you===writer?c.you:c.foe;
  const opp=mine===c.you?c.foe:c.you;
  const burst=Math.max(1,(c.steps||[]).length/18);
  const slot=(u,i,side)=>`<div class="cslot" data-i="${i}">${u?cardHTML(u,{golden:u.golden,atk:u.atk,hp:u.hp,name:u.name,id:(side==='you'?'y':'f')+i}):''}</div>`;
  view().innerHTML=`<div class="top"><button class="iconbtn" id="back">‹</button><div class="brand">BIBBITS</div><div class="live">${M.bot?'CONTRE UN BOT':'PVP · EN DIRECT'}</div></div>
    ${hpBlock(M.bot?'BOT':'ADVERSAIRE',M.oppName,M.oppHero,shownOpp(),'oppbar')}
    <div class="roundrow"><div class="plaque"><div class="k">MANCHE ${String(M.round).padStart(2,'0')}</div><div class="v">COMBAT</div></div>
      <button class="spd${spd===2?' on':''}" id="spd">${spd}×</button></div>
    <div class="arena" id="arena">
      <div class="sec"><span>ÉQUIPE ADVERSE</span><b>${burst>1?'RYTHME ACCÉLÉRÉ':''}</b></div>
      <div class="crow" id="crowf">${(opp||[]).map((u,i)=>slot(u,i,'foe')).join('')||'<div class="tiny">—</div>'}</div>
      <div class="cap" id="cap">Une attaque à la fois</div>
      <div class="sec"><span>VOTRE ÉQUIPE</span></div>
      <div class="crow" id="crowy">${(mine||[]).map((u,i)=>slot(u,i,'you')).join('')||'<div class="tiny">—</div>'}</div>
      <svg class="bolts" id="bolts"><defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#f0d48a"/></marker></defs></svg>
    </div>
    <div class="footer-note"><div class="anton">UNE ATTAQUE À LA FOIS</div><div class="tiny">Le héros ne perd des PV qu'à la fin de la manche.</div></div>`;
  $('#spd').onclick=()=>{spd=spd===2?1:2; localStorage.bbSpd=spd; $('#spd').textContent=spd+'×'; $('#spd').classList.toggle('on',spd===2)};
  $('#back').onclick=()=>{combatToken++; busy=false; if(confirm('Quitter le match ?')){stopNet();M=null;screenMenu()}};
  const steps=(c.steps||[]).map(s=>{
    if(!M.bot&&M.you!==writer) return Object.assign({},s,{side:s.side==='you'?'foe':'you'});
    return s;
  });
  (async()=>{
    for(const s of steps){
      if(token!==combatToken) return;
      await runAttack(s,token,burst);
      if(window.__HOLD) return;
    }
    if(token!==combatToken||window.__HOLD) return;
    await resolveRound(c,token);
  })();
}
function easeOut(p){return 1-Math.pow(1-Math.max(0,Math.min(1,p)),3)}
function stagePoint(el){
  const stage=document.getElementById('arena').getBoundingClientRect();
  const r=el.getBoundingClientRect();
  return {x:r.left+r.width/2-stage.left,y:r.top+r.height/2-stage.top,r};
}
function runAttack(s,token){
  return new Promise(resolve=>{
    const a=document.getElementById((s.side==='you'?'y':'f')+s.from);
    const b=document.getElementById((s.side==='you'?'f':'y')+s.to);
    const cap=document.getElementById('cap');
    const svg=document.getElementById('bolts');
    const arena=document.getElementById('arena');
    if(!a||!b||!arena){resolve();return}
    const reduce=reduceMotion();
    if(cap) cap.textContent=s.srcName+' attaque '+s.tgtName;
    a.classList.add('actor'); b.classList.add('target');
    const A0=a.getBoundingClientRect(), B0=b.getBoundingClientRect();
    const dx=(B0.left+B0.width/2)-(A0.left+A0.width/2);
    const dy=(B0.top+B0.height/2)-(A0.top+A0.height/2);
    const dist=Math.hypot(dx,dy)||1;
    const reach=Math.max(24,dist-B0.height*0.46);
    const rot=Math.max(-7,Math.min(7,dx*0.12));
    const maxHp=s.max||Math.max(s.hpBefore,1);
    let t=0,last=performance.now(),applied=false,num=null,rail=null;
    function dead(){if(token!==combatToken){cleanup();resolve();return true}return false}
    function showArrow(){
      if(!svg) return;
      const p1=stagePoint(a), p2=stagePoint(b);
      const mx=(p1.x+p2.x)/2+(s.side==='you'?-16:16);
      const my=(p1.y+p2.y)/2;
      svg.innerHTML='<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#f0d48a"/></marker></defs><path d="M '+p1.x+' '+p1.y+' Q '+mx+' '+my+' '+p2.x+' '+p2.y+'" fill="none" stroke="#f0d48a" stroke-width="2.5" marker-end="url(#ah)"/>';
    }
    function impact(){
      applied=true;
      if(svg) svg.innerHTML='';
      const badge=b.querySelector('[data-hp]');
      if(badge) badge.textContent=s.hpAfter;
      const br=b.getBoundingClientRect(), stg=arena.getBoundingClientRect();
      const flash=document.createElement('div'); flash.className='impact';
      flash.style.left=(br.left+br.width/2-stg.left-28)+'px';
      flash.style.top=(br.top+6-stg.top)+'px';
      arena.appendChild(flash);
      setTimeout(()=>flash.remove(),70);
      num=document.createElement('div'); num.className='float'; num.textContent='−'+s.dmg;
      num.style.left=(br.left+br.width/2)+'px'; num.style.top=(br.top+6)+'px';
      document.body.appendChild(num);
      rail=document.createElement('div'); rail.className='hrail'; rail.innerHTML='<i></i>';
      if(b.parentElement) b.parentElement.appendChild(rail);
      const bar=rail.querySelector('i');
      bar.style.transition='width .18s ease-out';
      bar.style.width=(100*s.hpBefore/maxHp)+'%';
      requestAnimationFrame(()=>{bar.style.width=(100*Math.max(0,s.hpAfter)/maxHp)+'%'});
      b.style.transform='translateY('+(s.side==='you'?6:-6)+'px)';
    }
    function cleanup(){
      a.classList.remove('actor'); b.classList.remove('target');
      a.style.transform=''; a.style.zIndex='';
      if(s.dead){b.style.visibility='hidden'; b.style.opacity='0'; if(rail) rail.remove()}
      else {b.style.transform=''; if(rail) rail.remove()}
      if(num) num.remove();
      if(svg) svg.innerHTML='';
    }
    function draw(tt){
      if(tt<120){
        const p=easeOut(tt/120);
        a.style.transform='translateY('+(-8*p)+'px) scale('+(1+0.03*p)+')';
        a.style.zIndex=8;
        showArrow();
      }else if(tt<300 && !reduce){
        const p=easeOut((tt-120)/180);
        a.style.transform='translate('+(dx/dist*reach*p)+'px,'+(dy/dist*reach*p)+'px) rotate('+(rot*p)+'deg) scale(1.03)';
        a.style.zIndex=8;
        if(tt<275) showArrow(); else if(svg) svg.innerHTML='';
      }
      if(tt>=300 && !applied) impact();
      if(num && tt>=300){
        const p=Math.min(1,(tt-300)/200);
        num.style.transform='translate(-50%,'+(-35*easeOut(p))+'px)';
        num.style.opacity=String(1-p);
      }
      if(!s.dead && tt>440) b.style.transform='';
      if(s.dead && tt>=480){
        const p=Math.min(1,(tt-480)/160);
        b.style.opacity=String(1-p);
        b.style.filter='grayscale(1)';
        b.style.transform='translateY('+(12*p)+'px) scale('+(1-0.04*p)+')';
        if(cap && p>0.12) cap.textContent=s.tgtName+' éliminée';
      }
      if(tt>=480 && !reduce){
        const back=1-easeOut(Math.min(1,(tt-480)/280));
        a.style.transform='translate('+(dx/dist*reach*back)+'px,'+(dy/dist*reach*back)+'px) rotate('+(rot*back)+'deg) scale('+(1+0.03*back)+')';
        a.style.zIndex=back>0.04?'8':'';
      }else if(reduce && tt>=300){
        a.style.transform='';
      }
      if(tt>=760){a.style.transform=''; a.style.zIndex=''}
    }
    function step(now){
      if(token!==combatToken){cleanup(); resolve(); return}
      const dt=Math.min(40,now-last); last=now;
      const burst=(M&&M.combat&&M.combat.steps&&M.combat.steps.length>18)?M.combat.steps.length/18:1;
      if(!(window.__HOLD&&t>=200)) t+=dt*spd*burst;
      const tt=reduce?(t<120?t:300+Math.max(0,t-120)):t;
      draw(tt);
      if(window.__HOLD&&tt>=210) return;
      if(tt>=800){cleanup(); resolve(); return}
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

async function resolveRound(c,token){
  if(token!==combatToken||!M) return;
  const writer=c.youSide||'p1';
  const mineSide=M.bot||M.you===writer;
  const dmgMe=mineSide?c.dYou:c.dFoe;
  const dmgThem=mineSide?c.dFoe:c.dYou;
  const mineAlive=mineSide?c.aliveYou:c.aliveFoe;
  const oppAlive=mineSide?c.aliveFoe:c.aliveYou;
  const cap=document.getElementById('cap');
  let msg='Manche égale';
  if((oppAlive||0)>0 && !(mineAlive>0)) msg='Manche perdue · '+(oppAlive||0)+' survivants · −'+(dmgMe||0)+' PV';
  else if((mineAlive||0)>0 && !(oppAlive>0)) msg='Manche gagnée · '+(mineAlive||0)+' survivants · −'+(dmgThem||0)+' PV';
  else if(dmgMe||dmgThem) msg='Les deux équipes tiennent';
  if(cap) cap.textContent=msg;
  await waitMs(650);
  if(token!==combatToken) return;
  const my=document.getElementById('mybar'), op=document.getElementById('oppbar');
  const myn=document.getElementById('mybarn'), opn=document.getElementById('oppbarn');
  if(my) my.style.width=Math.max(0,myHp()/15*100)+'%';
  if(op) op.style.width=Math.max(0,oppHp()/15*100)+'%';
  if(myn) myn.querySelector('span').textContent=Math.max(0,myHp());
  if(opn) opn.querySelector('span').textContent=Math.max(0,oppHp());
  await waitMs(500);
  if(token!==combatToken||window.__HOLD) return;
  finishCombat(c);
}
function waitMs(ms){
  return new Promise(res=>{
    let left=ms, last=performance.now();
    function frame(now){
      if(!M) return res();
      const dt=Math.min(40,now-last); last=now;
      left-=dt*spd;
      if(left<=0) res(); else requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}

function finishCombat(c){
  const dYou=M.bot?c.dYou:(M.you===(c.youSide||'p1')?c.dYou:c.dFoe);
  setTimeout(async()=>{
    busy=false;
    if(M.bot){
      if(M.hp1<=0||M.hp2<=0) return showResult(M.hp1===M.hp2?'draw':M.hp1>M.hp2?'p1':'p2');
      nextLocalShop(); renderShop(); startClock();
    }else{
      const {data}=await sb.rpc('duel_advance',{rid:M.room,p:P.id});
      if(data&&data.phase==='result') showResult(data.winner);
      else if(data&&data.phase) onRoom(data);
    }
  },700);
}
function nextLocalShop(){
  M.round+=1; M.phase='shop'; M.ready=false; M.foeReady=false; M.ends=Date.now()+20000;
  const grant=s=>{s.gold=Math.min(20,s.gold+income(M.round)); if(!s.freeze) s.shop=rollShop(M.round,Math.random); else s.freeze=false};
  grant(M.me); grant(M.foe); botAct();
  setTimeout(()=>{if(M&&M.bot&&M.phase==='shop'){M.foeReady=true;renderShop()}},2000);
}
function showResult(winner){
  stopNet();
  const win=M&&((M.you==='p1'&&winner==='p1')||(M.you==='p2'&&winner==='p2'));
  const draw=winner==='draw';
  if(win){P.wins=(P.wins||0)+1;P.boosts=(P.boosts||0)+1;P.xp[P.hero]=(P.xp[P.hero]||0)+3}
  else if(!draw){P.xp[P.hero]=(P.xp[P.hero]||0)+1}
  saveP();
  view().innerHTML=`<div class="result"><div class="top"><span></span><div class="brand">BIBBITS</div><span class="live">RÉSULTAT</span></div>
    <h1>${draw?'ÉGALITÉ':win?'VICTOIRE':'DÉFAITE'}</h1>
    <p class="tiny">Manche ${M?M.round:''} · ${myHp()} PV contre ${oppHp()} PV</p>
    <div style="display:flex;justify-content:center;margin:16px 0">${cardHTML(byId[P.hero],{w:160})}</div>
    <p>Cadre ${TIERS[tierOf(P.hero)]}</p>
    <div style="margin-top:auto;display:flex;flex-direction:column;gap:8px">
      ${win?'<button class="ready" id="open">OUVRIR LE BOOSTER</button>':''}
      <button class="ghost" id="again">REJOUER</button>
      <button class="ghost" id="home">ACCUEIL</button>
    </div></div>`;
  const o=$('#open'); if(o) o.onclick=()=>{M=null;screenBoost()};
  $('#again').onclick=()=>{M=null;startSearch()};
  $('#home').onclick=()=>{M=null;screenMenu()};
}

function screenCollection(){
  view().innerHTML=`<div class="menu"><div class="top"><button class="iconbtn" id="back">‹</button><div class="brand">BIBBITS</div><span class="live">COLLECTION</span></div>
    <div class="tiny">Cadres : ${TIERS.slice(1).join(' · ')}</div>
    <div class="scroll tiergrid" id="grid"></div></div>`;
  $('#back').onclick=screenMenu;
  kick();
  const g=$('#grid');
  g.innerHTML=HEROES.map(h=>`<button data-h="${h.id}" style="background:none;border:0;color:inherit">${cardHTML(h,{name:h.name})}<div class="tiny">${TIERS[tierOf(h.id)]}</div></button>`).join('');
  g.querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>showHero(b.dataset.h));
}
function showHero(id){
  const h=byId[id];
  view().innerHTML=`<div class="menu"><div class="top"><button class="iconbtn" id="back">‹</button><div class="brand">${h.name.toUpperCase()}</div><span class="live">${TIERS[tierOf(id)]}</span></div>
    <div class="scroll" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding-top:8px">
      ${[1,2,3,4,5,6].map(t=>`<div><div class="tcard t${t}" style="border-color:${t===4?h.el:'inherit'}"><img alt="" src="${ART}${id}.png"><span>${TIERS[t]}</span></div></div>`).join('')}
    </div>
    <p class="tiny">Le cadre du héros monte avec les duels. Prisme est le dernier, le plus rare.</p></div>`;
  $('#back').onclick=screenCollection;
}
function screenBoost(){
  if(!P.boosts){screenMenu();return}
  const hero=HEROES[(Math.random()*HEROES.length)|0];
  view().innerHTML=`<div class="menu" style="align-items:center"><div class="top" style="width:100%"><button class="iconbtn" id="back">‹</button><div class="brand">BOOSTER</div><span></span></div>
    <div class="pack" id="pk"><img alt="" src="${ART}${hero.id}.png"><div class="band"></div></div>
    <button class="ready" id="open">OUVRIR</button></div>`;
  $('#back').onclick=screenMenu;
  const open=()=>{
    P.boosts--; P.xp[hero.id]=(P.xp[hero.id]||0)+2; saveP();
    view().innerHTML=`<div class="menu" style="align-items:center;text-align:center"><div class="brand">BIBBITS</div>
      <h2 style="margin:12px 0">RECRUE</h2>
      <div style="width:200px">${cardHTML(hero)}</div>
      <p>Cadre ${TIERS[tierOf(hero.id)]}</p>
      <button class="ready" id="ok">RANGER</button></div>`;
    $('#ok').onclick=screenMenu;
  };
  $('#pk').onclick=open; $('#open').onclick=open;
}

applySkin();
screenMenu();

window.__shot=function(name){
  if(name==='menu') return screenMenu();
  if(name==='collection') return screenCollection();
  if(name==='boost'){P.boosts=1;return screenBoost()}
  const me=byId.brok;
  M={bot:true,you:'p1',phase:'shop',round:4,hp1:14,hp2:12,ends:Date.now()+17000,
    hero:'brok',oppHero:'nyx',oppName:'OmbreLune',ready:false,foeReady:true,
    me:{gold:8,freeze:false,shop:[byId.petrol,byId.sylve,byId.marea,byId.granit,byId.zephyr],
      board:[makeUnit(byId.brok,true),makeUnit(byId.sylve,false),makeUnit(byId.marea,false),makeUnit(byId.petrol,false),null,null]},
    foe:{gold:5,board:[makeUnit(byId.lune,false),makeUnit(byId.nyx,false),makeUnit(byId.krom,false),makeUnit(byId.granit,false),null,null],shop:[]}};
  if(name==='shop') return renderShop();
  if(name==='combat'){
    M.combat={you:M.me.board.filter(Boolean),foe:M.foe.board.filter(Boolean),steps:[{side:'you',from:0,to:1,dmg:7,dead:false,srcName:'Brok',tgtName:'Nyx',hpBefore:6,hpAfter:0,max:6}],dYou:0,dFoe:4,youSide:'p1',aliveYou:4,aliveFoe:3};
    M.phase='combat';
    window.__HOLD=true;
    playCombat();
  }
};
})();
