/* Bibbits Duel v11 — écrans. */
(function(){
const D=window.Duel;
const ART='../shots/final_art/';
const TH=[0,40,100,190,320,500];
const TIERS=['','Essentiel','Relief','Éveil','Chromatique','Solaire','Prisme'];
const $=s=>document.querySelector(s);
const app=$('#app'), view=$('#view');
const I18N={
fr:{
  splashSub:'Six tours. Deux lignes. Une révélation.', tap:'Toucher pour entrer',
  homeK:'Encre, or et alliances', homeT:'Ton prochain duel.', play:'Jouer un duel',
  playNote:'6 tours · choix simultanés · la ligne reste en jeu',
  daily:'Trois duels', dailyN:'Joue à ton rythme. Chaque victoire ouvre un booster.',
  ghost:'Défi fantôme', ghostN:'Un adversaire piloté ici, sur ton téléphone.',
  enter:'Entrer', col:'Collection', decks:'Decks', home:'Accueil', boosts:'Boosters', settings:'Réglages',
  lvl:'Niveau', xpLeft:'Encore {n} XP pour le cadre suivant.', maxed:'Cadre Prisme débloqué.',
  pick:'Choisis ton duo', pickN:'Deux héros. Un deck de 12 cartes est préparé.',
  search:'Chercher un adversaire', need2:'Choisis deux héros.',
  mm:'Recherche d\'un adversaire', found:'Adversaire trouvé',
  turn:'Tour', energy:'Énergie', you:'Toi', foe:'Adversaire', hand:'Ta main',
  yourLine:'Ta ligne', foeLine:'Ligne adverse', hidden:'Choix cachés',
  playBtn:'Révéler', passBtn:'Passer le tour', hint:'Touche une carte, puis le bouton.',
  expensive:'Pas assez d\'énergie', empty:'Aucune carte jouable',
  reveal:'Révélation', combo:'Synergie',
  win:'Victoire', lose:'Défaite', draw:'Égalité',
  mvp:'Carte du duel', reward:'Récompense', open:'Ouvrir le booster', again:'Rejouer', homeBtn:'Accueil',
  xpGain:'+{n} XP',
  packK:'Booster', packT:'Une carte à la fois.', openPack:'Ouvrir', next:'Carte suivante', done:'Ranger',
  common:'Commune', rare:'Rare', elite:'Élite', foil:'Finition prisme',
  colT:'Tes cadres', tierOf:'Cadre', locked:'Verrouillé', owned:'Dans la collection', none:'Pas encore de cartes.',
  deckT:'Constructeur', deckN:'12 cartes. Communes ×3, rares ×2, élites ×1.', save:'Enregistrer le deck', saved:'Deck enregistré.',
  badDeck:'Le deck doit contenir 12 cartes, dans les limites.', useDeck:'Utiliser ce deck', auto:'Deck automatique',
  setT:'Réglages', lang:'Langue', sound:'Sons', skin:'Peau Encre & or', skinLock:'Se gagne après 2 victoires.',
  skinOn:'Équipée', tut:'Revoir le tutoriel',
  t1:'Chaque tour, l\'énergie monte. Joue une carte dont le coût tient dans l\'énergie.',
  t2:'Ton adversaire choisit en même temps. Rien n\'est visible avant la révélation.',
  t3:'Les cartes restent dans la ligne. Les synergies se lisent sous le nom.',
  ok:'Compris', skip:'Passer',
  concede:'Abandonner'
},
en:{
  splashSub:'Six turns. Two lines. One reveal.', tap:'Tap to enter',
  homeK:'Ink, gold and alliances', homeT:'Your next duel.', play:'Play a duel',
  playNote:'6 turns · simultaneous picks · the line stays',
  daily:'Three duels', dailyN:'Play at your pace. Each win opens a booster.',
  ghost:'Ghost challenge', ghostN:'An opponent running here, on your phone.',
  enter:'Enter', col:'Collection', decks:'Decks', home:'Home', boosts:'Boosters', settings:'Settings',
  lvl:'Level', xpLeft:'{n} XP until the next frame.', maxed:'Prism frame unlocked.',
  pick:'Choose your duo', pickN:'Two heroes. A 12-card deck is prepared.',
  search:'Find an opponent', need2:'Pick two heroes.',
  mm:'Searching for an opponent', found:'Opponent found',
  turn:'Turn', energy:'Energy', you:'You', foe:'Opponent', hand:'Your hand',
  yourLine:'Your line', foeLine:'Enemy line', hidden:'Hidden picks',
  playBtn:'Reveal', passBtn:'Pass the turn', hint:'Tap a card, then the button.',
  expensive:'Not enough energy', empty:'No playable card',
  reveal:'Reveal', combo:'Synergy',
  win:'Victory', lose:'Defeat', draw:'Draw',
  mvp:'Card of the duel', reward:'Reward', open:'Open the booster', again:'Play again', homeBtn:'Home',
  xpGain:'+{n} XP',
  packK:'Booster', packT:'One card at a time.', openPack:'Open', next:'Next card', done:'Stow',
  common:'Common', rare:'Rare', elite:'Elite', foil:'Prism finish',
  colT:'Your frames', tierOf:'Frame', locked:'Locked', owned:'In the collection', none:'No cards yet.',
  deckT:'Builder', deckN:'12 cards. Commons ×3, rares ×2, elites ×1.', save:'Save deck', saved:'Deck saved.',
  badDeck:'The deck needs 12 cards, within the copy limits.', useDeck:'Use this deck', auto:'Automatic deck',
  setT:'Settings', lang:'Language', sound:'Sound', skin:'Ink & gold skin', skinLock:'Earned after 2 wins.',
  skinOn:'Equipped', tut:'Replay the tutorial',
  t1:'Each turn, energy rises. Play one card whose cost fits the energy.',
  t2:'Your opponent picks at the same time. Nothing shows before the reveal.',
  t3:'Cards stay in the line. Synergies are written under the name.',
  ok:'Got it', skip:'Skip',
  concede:'Concede'
}};
const load=()=>{try{return JSON.parse(localStorage.bb11||'{}')}catch(e){return{}}};
const save=s=>{localStorage.bb11=JSON.stringify(s)};
let S=Object.assign({lang:'fr',mute:false,skin:false,xp:{},col:{},wins:0,tut:false,deck:null,duels:0},load());
function persist(){save({lang:S.lang,mute:S.mute,skin:S.skin,xp:S.xp,col:S.col,wins:S.wins,tut:S.tut,deck:S.deck,duels:S.duels})}
const L=k=>I18N[S.lang][k]||k;
const lvl=xp=>{let t=1;for(let i=1;i<TH.length;i++)if(xp>=TH[i])t=i+1;return t};
const tierOf=h=>lvl(S.xp[h]||0);
const nm=c=>S.lang==='en'?c.en:c.fr;
const heroName=h=>S.lang==='en'?D.HEROES[h].en:D.HEROES[h].fr;
function cardHTML(c,opt){
  opt=opt||{};
  const t=opt.tier||tierOf(c.hero);
  const w=opt.w||108;
  if(opt.back) return `<div class="card back" style="--w:${w}px"><div class="mark">✧</div></div>`;
  const foil=opt.foil?'<i class="ribbon">PRISME</i>':'';
  const pow=opt.pow!=null?opt.pow:c.pow;
  return `<article class="card t${t}${opt.on?' on':''}${opt.bad?' bad':''}${opt.flip?' flip':''}${opt.bump?' bump':''}" data-uid="${c.uid||c.id}" style="--c:${c.c};--w:${w}px">
    <div class="window"><img class="art" alt="" src="${ART}${c.hero}.png"><div class="glow"></div><div class="shade"></div><div class="foil"></div><div class="particles"></div></div>
    <img class="lift" alt="" src="${ART}${c.hero}_cutout.png"><div class="edge"></div><div class="ornaments"></div>
    <div class="element">${D.HEROES[c.hero].el}</div><div class="name">${nm(c)}</div><div class="fxline">${D.fxText(c,S.lang)}</div>
    <div class="stat cost">${c.cost}</div><div class="stat power">${pow}</div>${foil}</article>`;
}
function applySkin(){document.body.classList.toggle('skin-ink',!!(S.skin&&S.wins>=2));}
function go(name,extra){S.screen=name;S.extra=extra||null;render();applySkin();}
function nav(active){
  return `<div class="nav"><button data-go="home">${active==='home'?'<b>'+L('home')+'</b>':L('home')}</button>
    <button data-go="decks">${active==='decks'?'<b>'+L('decks')+'</b>':L('decks')}</button>
    <button data-go="collection">${active==='collection'?'<b>'+L('col')+'</b>':L('col')}</button>
    <button data-go="settings">${active==='settings'?'<b>'+L('settings')+'</b>':L('settings')}</button></div>`;
}
function xpBlock(){
  const sum=Object.values(S.xp).reduce((a,b)=>a+b,0);
  const t=lvl(sum), cur=TH[t-1]||0, next=TH[t];
  const pct=next?Math.round((sum-cur)/(next-cur)*100):100;
  const left=next?L('xpLeft').replace('{n}',next-sum):L('maxed');
  return `<div class="tiny">${L('lvl')} ${t}${next?' · '+sum+' / '+next+' XP':''}</div><div class="bar"><i style="width:${pct}%"></i></div><div class="tiny">${left}</div>`;
}
function render(){
  const n=S.screen;
  if(n==='splash') return splash();
  if(n==='home') return home();
  if(n==='play') return play();
  if(n==='mm') return mm();
  if(n==='board') return board();
  if(n==='result') return result();
  if(n==='boost') return boost();
  if(n==='collection') return collection();
  if(n==='decks') return decks();
  if(n==='settings') return settings();
}
function splash(){
  view.innerHTML=`<div class="screen splash"><img class="bg" alt="" src="${ART}brok.png"><div class="veil"></div>
    <div class="copy"><div class="eyebrow">BIBBITS</div><h1>DUEL</h1><p class="dim">${L('splashSub')}</p><p style="margin-top:18px;color:var(--gold)">${L('tap')}</p></div></div>`;
  view.querySelector('.screen').onclick=()=>go('home');
}
function home(){
  const duo=(S.deck&&S.deck.heroes)||['brok','sylve','nyx'];
  const show=duo.slice(0,3);
  while(show.length<3) show.push(['lune','granit','marea'][show.length]);
  view.innerHTML=`<div class="screen"><div class="row"><h2 class="cinzel">BIBBITS <span style="color:var(--gold)">DUEL</span></h2><span class="pill">${L('col')} · ${Object.keys(S.col).length}</span></div>
    <div class="grow"><div style="text-align:center;padding-top:12px"><div class="eyebrow">${L('homeK')}</div><h1 style="font-size:28px;margin-top:6px">${L('homeT')}</h1></div>
    <div class="fan">${show.map((h,i)=>cardHTML(D.CARDS.find(c=>c.hero===h),{w:i===1?132:100,on:i===1})).join('')}</div>
    <button class="btn" id="play">${L('play')}</button><p class="tiny" style="text-align:center;margin:8px 0 12px">${L('playNote')}</p>
    <div class="panel"><div class="row"><b>${L('daily')}</b><span class="pill">${S.duels%3}/3</span></div><p class="tiny">${L('dailyN')}</p></div>
    <div style="height:10px"></div><div class="panel">${xpBlock()}</div>
    <div class="steps" style="margin-top:12px">${TIERS.slice(1).map((t,i)=>`<div class="step">${t}</div>`).join('')}</div>
    </div>${nav('home')}</div>`;
  $('#play').onclick=()=>go('play');
  bindNav();
}
let pick=[];
function play(){
  pick=pick.length===2?pick:[];
  const keys=Object.keys(D.HEROES);
  view.innerHTML=`<div class="screen"><div class="row"><button class="pill" id="back">${L('home')}</button><span class="eyebrow">${L('pick')}</span></div>
    <p class="tiny">${L('pickN')}</p><div class="grow hero-grid">${keys.map(h=>{
      const H=D.HEROES[h], on=pick.includes(h);
      return `<button class="hero-opt${on?' on':''}" data-h="${h}" style="--c:${H.c}"><img alt="" src="${ART}${h}.png"><div><b>${heroName(h)}</b><small>${H.el} · ${L('tierOf')} ${tierOf(h)}</small></div></button>`;
    }).join('')}</div>
    <button class="btn" id="go" ${pick.length===2?'':'disabled'}>${L('search')}</button></div>`;
  $('#back').onclick=()=>go('home');
  view.querySelectorAll('.hero-opt').forEach(b=>b.onclick=()=>{
    const h=b.dataset.h;
    if(pick.includes(h)) pick=pick.filter(x=>x!==h);
    else if(pick.length<2) pick.push(h);
    else pick=[pick[1],h];
    play();
  });
  const g=$('#go'); if(g) g.onclick=()=>{ if(pick.length===2) startMM(pick.slice()); };
}
let mmHeroes=null, mmOpp=null;
function startMM(heroes){
  mmHeroes=heroes;
  const keys=Object.keys(D.HEROES).filter(k=>!heroes.includes(k));
  mmOpp=[keys[(Math.random()*keys.length)|0]];
  let k2=keys[(Math.random()*keys.length)|0]; if(k2===mmOpp[0]) k2=keys[(keys.indexOf(k2)+1)%keys.length];
  mmOpp.push(k2);
  go('mm');
  setTimeout(()=>{ const el=$('#mmstate'); if(el){el.querySelector('h1').textContent=L('found'); el.querySelector('.tiny').textContent=mmOpp.map(heroName).join(' · ');} },900);
  setTimeout(()=>beginMatch(),1700);
}
function mm(){
  view.innerHTML=`<div class="screen mm" id="mmstate"><div class="orb">✧</div><div class="eyebrow">BIBBITS</div><h1>${L('mm')}</h1><p class="tiny">${mmHeroes.map(heroName).join(' · ')}</p></div>`;
}
let G=null, sel=null, tutStep=0, showTut=false;
function beginMatch(){
  const custom=S.deck&&S.deck.heroes&&S.deck.heroes.slice().sort().join()===mmHeroes.slice().sort().join()&&!D.validateDeck(S.deck.heroes,S.deck.counts).length;
  G=D.create(mmHeroes,mmOpp);
  if(custom){
    // rebuild sides with the saved counts for the player only
    const list=[]; Object.keys(S.deck.counts).forEach(id=>{const c=D.byId[id]; for(let i=0;i<(S.deck.counts[id]|0);i++) list.push(Object.assign({},c));});
    for(let i=list.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[list[i],list[j]]=[list[j],list[i]];}
    let u=1; list.forEach(c=>c.uid='p'+u++);
    G.you.deck=list; G.you.hand=G.you.deck.splice(0,4); G.you.line=[];
  }
  sel=null; showTut=!S.tut; tutStep=0;
  go('board');
}
function board(){
  if(!G){go('home');return;}
  const en=D.energy(G), sc=D.score(G);
  const youP=D.powers(G.you.line,G.foe.line), foeP=D.powers(G.foe.line,G.you.line);
  const hand=G.you.hand.map(c=>cardHTML(c,{w:78,on:sel&&sel.uid===c.uid,bad:c.cost>en})).join('')||`<p class="tiny">${L('empty')}</p>`;
  view.innerHTML=`<div class="screen" style="padding-bottom:8px">
    <div class="row"><h2 class="cinzel" style="font-size:16px">BIBBITS <span style="color:var(--gold)">DUEL</span></h2><span class="pill">${L('turn')} ${Math.min(G.turn,6)} / 6</span></div>
    <div class="row" style="margin-top:6px"><b>${L('foeLine')}</b><span class="pill">${L('hidden')}</span></div>
    <div class="line" id="foe">${G.foe.line.map((c,i)=>cardHTML(c,{w:108,pow:foeP[i],tier:1})).join('')||'<span class="tiny">—</span>'}</div>
    <div class="row"><span class="lane-score">${sc[1]}</span><div style="text-align:center"><div class="eyebrow">${L('energy')} ${en}</div><div class="tiny">${G.turn>6?L('reveal'):L('hint')}</div></div><span class="lane-score" style="color:var(--gold)">${sc[0]}</span></div>
    <div id="toast"></div>
    <div class="row"><b>${L('yourLine')}</b><span class="tiny">${L('you')}</span></div>
    <div class="line" id="you">${G.you.line.map((c,i)=>cardHTML(c,{w:108,pow:youP[i]})).join('')||'<span class="tiny">—</span>'}</div>
    <div class="tiny" style="margin:2px 0">${L('hand')}</div>
    <div class="hand" id="hand">${hand}</div>
    <button class="btn" id="act">${sel?L('playBtn'):L('passBtn')}</button>
    <button class="tiny" id="give" style="background:none;border:0;color:var(--dim);margin-top:4px">${L('concede')}</button>
    ${showTut?tut():''}
  </div>`;
  view.querySelectorAll('#hand .card').forEach(el=>{
    el.onclick=()=>{
      const c=G.you.hand.find(x=>x.uid===el.dataset.uid);
      if(!c) return;
      if(c.cost>en){el.classList.add('shake'); toast(L('expensive')); setTimeout(()=>el.classList.remove('shake'),300); return;}
      sel=sel&&sel.uid===c.uid?null:c; board();
    };
  });
  $('#act').onclick=()=>doTurn();
  $('#give').onclick=()=>{G.over=true;G.winner=1;finish();};
  if(showTut){
    $('#tok').onclick=()=>{tutStep++; if(tutStep>2){showTut=false;S.tut=true;persist();} board();};
    $('#tsk').onclick=()=>{showTut=false;S.tut=true;persist();board();};
  }
  bindHolo();
}
function tut(){
  const txt=[L('t1'),L('t2'),L('t3')][tutStep]||L('t3');
  return `<div class="overlay"><div class="panel"><div class="eyebrow">${tutStep+1} / 3</div><p>${txt}</p></div>
    <div class="row"><button class="btn ghost" id="tsk" style="width:40%">${L('skip')}</button><button class="btn" id="tok">${L('ok')}</button></div></div>`;
}
function toast(html){const t=$('#toast'); if(t){t.className='toast'; t.innerHTML=html; setTimeout(()=>{if(t)t.innerHTML='';},1100);}}
function tone(f,d,type,v){if(S.mute)return;try{const AC=tone.ac||(tone.ac=new (window.AudioContext||window.webkitAudioContext)());const o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(v||.08,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);o.connect(g).connect(AC.destination);o.start();o.stop(AC.currentTime+d);}catch(e){}}
function doTurn(){
  if(!G||G.over||showTut) return;
  const card=sel;
  sel=null;
  const beforeY=G.you.line.length, beforeF=G.foe.line.length;
  const step=D.playTurn(G,card);
  tone(520,.12,'triangle',.1);
  document.body.classList.add('hit'); setTimeout(()=>document.body.classList.remove('hit'),280);
  board();
  const yc=$('#you'), fc=$('#foe');
  if(yc) [...yc.children].slice(beforeY).forEach(n=>n.classList.add('flip'));
  if(fc) [...fc.children].slice(beforeF).forEach(n=>n.classList.add('flip'));
  const bits=[];
  if(step.you&&step.you.fx) bits.push(nm(step.you)+' · '+D.fxText(step.you,S.lang));
  if(step.foe&&step.foe.fx) bits.push(nm(step.foe)+' · '+D.fxText(step.foe,S.lang));
  if(bits.length) toast(`<div class="eyebrow">${L('reveal')}</div>${bits.join('<br>')}`);
  if(G.over) setTimeout(finish,700);
}
function finish(){
  S.duels=(S.duels||0)+1;
  const win=G.winner===0;
  const gain=win?36:14;
  G.you.heroes.forEach(h=>{S.xp[h]=(S.xp[h]||0)+gain;});
  if(win) S.wins=(S.wins||0)+1;
  // mvp
  const pw=D.powers(G.you.line,G.foe.line);
  let mvp=G.you.line[0], best=-1;
  G.you.line.forEach((c,i)=>{if(pw[i]>best){best=pw[i];mvp=c;}});
  S.mvp=mvp; S.gain=gain; S.lastWin=win; S.score=D.score(G);
  persist();
  go('result');
}
function result(){
  const win=S.lastWin, sc=S.score||[0,0];
  const title=G&&G.winner<0?L('draw'):win?L('win'):L('lose');
  const mvp=S.mvp;
  view.innerHTML=`<div class="screen"><div class="row"><span class="eyebrow">${L('turn')} 6 / 6</span><span class="pill">${win?L('reward'):''}</span></div>
    <div style="text-align:center;padding:8px 0"><h1 style="font-size:36px;color:${win?'var(--gold)':'#e8eef8'}">${title}</h1>
    <div class="lane-score">${sc[0]} <span class="tiny">${S.lang==='en'?'to':'contre'}</span> ${sc[1]}</div></div>
    <div class="fan">${mvp?cardHTML(mvp,{w:168,pow:D.powers(G.you.line,G.foe.line)[G.you.line.indexOf(mvp)]||mvp.pow,bump:true}):''}</div>
    <p class="tiny" style="text-align:center">${mvp?L('mvp')+' · '+nm(mvp):''}</p>
    <div class="panel">${G.you.heroes.map(h=>`<div class="row"><b>${heroName(h)}</b><span>${L('xpGain').replace('{n}',S.gain)} · ${L('tierOf')} ${tierOf(h)} ${TIERS[tierOf(h)]}</span></div><div class="bar"><i style="width:${barPct(h)}%"></i></div>`).join('')}</div>
    <div style="flex:1"></div>
    ${win?'<button class="btn" id="pack">'+L('open')+'</button>':'<button class="btn" id="home">'+L('again')+'</button>'}
    <button class="btn ghost" id="home2" style="margin-top:8px">${L('homeBtn')}</button></div>`;
  const p=$('#pack'); if(p) p.onclick=()=>openBoost(G.you.heroes[(Math.random()*2)|0]);
  const h=$('#home'); if(h) h.onclick=()=>go('play');
  $('#home2').onclick=()=>go('home');
}
function barPct(h){const x=S.xp[h]||0,t=lvl(x),cur=TH[t-1]||0,next=TH[t];return next?Math.round((x-cur)/(next-cur)*100):100}
let pack=null, packI=0;
function openBoost(hero){
  const pool=D.CARDS.filter(c=>c.hero===hero);
  const roll=()=>{
    const bag=[1,1,1,2,3];
    const r=bag[(Math.random()*bag.length)|0];
    const sub=pool.filter(c=>c.rarity===r);
    const c=sub[(Math.random()*sub.length)|0]||pool[0];
    const foil=Math.random()<(r===3?0.16:r===2?0.1:0.05);
    return {c,foil,r};
  };
  // 3 commons weighted, then rare, then elite chance — 5 cards
  pack=[];
  for(let i=0;i<3;i++){const sub=pool.filter(c=>c.rarity===1); const c=sub[(Math.random()*sub.length)|0]; pack.push({c,foil:Math.random()<.06,r:1});}
  pack.push({c:pool.filter(c=>c.rarity===2)[(Math.random()*pool.filter(c=>c.rarity===2).length)|0],foil:Math.random()<.1,r:2});
  const elite=Math.random()<.45;
  const rr=elite?3:2; const sub=pool.filter(c=>c.rarity===rr);
  pack.push({c:sub[(Math.random()*sub.length)|0],foil:Math.random()<(elite?0.18:0.1),r:rr});
  pack.forEach(p=>{const id=p.c.id; const rec=S.col[id]||{n:0,foil:0}; rec.n++; if(p.foil) rec.foil++; S.col[id]=rec;});
  persist();
  packI=-1;
  go('boost',hero);
}
function boost(){
  const hero=S.extra;
  if(packI<0){
    view.innerHTML=`<div class="screen" style="text-align:center"><div class="eyebrow">${L('packK')}</div><h1>${heroName(hero)}</h1>
      <div class="pack" id="pk"><img alt="" src="${ART}${hero}.png"><div class="band"></div><div class="seal">✦</div></div>
      <button class="btn" id="op">${L('openPack')}</button></div>`;
    const open=()=>{tone(180,.3,'sine',.12); $('#pk').classList.add('pop'); setTimeout(()=>{packI=0;boost();},520);};
    $('#pk').onclick=open; $('#op').onclick=open;
    return;
  }
  const p=pack[packI];
  const label=p.r===3?L('elite'):p.r===2?L('rare'):L('common');
  view.innerHTML=`<div class="screen" style="text-align:center"><div class="eyebrow">${L('packK')} · ${heroName(hero)}</div>
    <h2>${label}${p.foil?' · '+L('foil'):''}</h2><p class="tiny">${packI+1} / ${pack.length}</p>
    <div class="fan" style="flex:1;align-items:center;min-height:0">${cardHTML(p.c,{w:210,foil:p.foil,tier:p.foil?6:p.r===3?5:p.r===2?4:2,flip:true})}</div>
    <div class="hand" style="justify-content:center">${pack.map((q,i)=>i===packI?`<span class="pill">${i+1}</span>`:i<packI?cardHTML(q.c,{w:52,tier:q.r===3?5:2}):'<div class="card back" style="--w:52px"><div class="mark">✧</div></div>').join('')}</div>
    ${p.r>=2?'<div class="flash"></div>':''}
    <div style="flex:1"></div>
    <button class="btn" id="nx">${packI<pack.length-1?L('next'):L('done')}</button></div>`;
  if(p.r>=2) tone(p.r===3?330:520,.4,'triangle',.1);
  $('#nx').onclick=()=>{ if(packI<pack.length-1){packI++; boost();} else go('collection'); };
  bindHolo();
}
function collection(){
  const keys=Object.keys(D.HEROES);
  const h=S.focus||'brok';
  view.innerHTML=`<div class="screen"><div class="row"><h2>${L('colT')}</h2><span class="pill">${heroName(h)}</span></div>
    <div class="hscroll">${keys.map(k=>`<button class="pill" data-h="${k}" style="border-color:${k===h?D.HEROES[k].c:'#ffffff22'}">${heroName(k)}</button>`).join('')}</div>
    <div class="tiergrid">${[1,2,3,4,5,6].map(t=>{
      const c=D.CARDS.find(x=>x.hero===h);
      const locked=tierOf(h)<t;
      return `<div class="${locked?'lock':''}" style="text-align:center">${cardHTML(c,{w:108,tier:t})}<div class="tiny" style="margin-top:6px">${t} · ${TIERS[t]}</div></div>`;
    }).join('')}</div>
    <div class="grow">${ownedList(h)}</div>${nav('collection')}</div>`;
  view.querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>{S.focus=b.dataset.h;collection();});
  bindNav(); bindHolo();
}
function ownedList(h){
  const cards=D.CARDS.filter(c=>c.hero===h);
  return cards.map(c=>{
    const rec=S.col[c.id];
    return `<div class="row" style="padding:6px 0;border-bottom:1px solid #ffffff10"><span>${nm(c)} <span class="tiny">· ${c.cost}</span></span><span class="tiny">${rec?('×'+rec.n+(rec.foil?' ✦':'')):'—'}</span></div>`;
  }).join('')||`<p class="tiny">${L('none')}</p>`;
}
let draftHeroes=[], draft={};
function decks(){
  if(!draftHeroes.length) draftHeroes=(S.deck&&S.deck.heroes)?S.deck.heroes.slice():[];
  const keys=Object.keys(D.HEROES);
  const list=draftHeroes.length===2?D.CARDS.filter(c=>draftHeroes.includes(c.hero)):[];
  const n=Object.values(draft).reduce((s,v)=>s+(v|0),0);
  view.innerHTML=`<div class="screen"><div class="row"><h2>${L('deckT')}</h2><span class="pill">${n}/12</span></div>
    <p class="tiny">${L('deckN')}</p>
    <div class="hscroll">${keys.map(h=>`<button class="pill" data-h="${h}" style="${draftHeroes.includes(h)?'border-color:'+D.HEROES[h].c+';color:var(--gold)':''}">${heroName(h)}</button>`).join('')}</div>
    <div class="grow">${list.map(c=>{
      const k=draft[c.id]|0, max=D.MAXC[c.rarity];
      return `<div class="row" style="padding:5px 0"><span>${nm(c)} <span class="tiny">${c.cost} · ${c.rarity===3?L('elite'):c.rarity===2?L('rare'):L('common')}</span></span>
        <span><button class="pill" data-m="${c.id}">−</button> ${k}/${max} <button class="pill" data-p="${c.id}">+</button></span></div>`;
    }).join('')}</div>
    <button class="btn" id="sv">${L('save')}</button><p class="tiny" id="msg" style="text-align:center"></p>${nav('decks')}</div>`;
  view.querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>{
    const h=b.dataset.h;
    if(draftHeroes.includes(h)) draftHeroes=draftHeroes.filter(x=>x!==h);
    else if(draftHeroes.length<2) draftHeroes.push(h);
    else draftHeroes=[draftHeroes[1],h];
    draft={}; decks();
  });
  view.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{const id=b.dataset.m; draft[id]=Math.max(0,(draft[id]|0)-1); decks();});
  view.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.p, c=D.byId[id];
    if((draft[id]|0)>=D.MAXC[c.rarity]) return;
    if(Object.values(draft).reduce((s,v)=>s+(v|0),0)>=12) return;
    draft[id]=(draft[id]|0)+1; decks();
  });
  $('#sv').onclick=()=>{
    const err=D.validateDeck(draftHeroes,draft);
    const msg=$('#msg');
    if(err.length){msg.textContent=L('badDeck');return;}
    S.deck={heroes:draftHeroes.slice(),counts:Object.assign({},draft)};
    persist(); msg.textContent=L('saved');
  };
  bindNav();
}
function settings(){
  const skinOk=S.wins>=2;
  view.innerHTML=`<div class="screen"><h2>${L('setT')}</h2><div class="grow" style="padding-top:12px">
    <div class="panel row"><b>${L('lang')}</b><button class="pill" id="lg">${S.lang==='fr'?'Français':'English'}</button></div>
    <div style="height:8px"></div>
    <div class="panel row"><b>${L('sound')}</b><button class="pill" id="so">${S.mute?(S.lang==='en'?'Off':'Coupé'):(S.lang==='en'?'On':'Activé')}</button></div>
    <div style="height:8px"></div>
    <div class="panel"><div class="row"><b>${L('skin')}</b><button class="pill" id="sk" ${skinOk?'': 'disabled'}>${S.skin&&skinOk?L('skinOn'):skinOk?(S.lang==='en'?'Equip':'Équiper'):L('locked')}</button></div>
      <p class="tiny">${skinOk?L('skin'):L('skinLock')} · ${S.wins} ${S.lang==='en'?'wins':'victoires'}</p></div>
    <div style="height:8px"></div>
    <button class="btn ghost" id="tu">${L('tut')}</button>
    <div class="panel" style="margin-top:12px"><b>Bibbits Duel</b><p class="tiny">${S.lang==='en'
      ?'Six turns, two lines, one reveal. Frames unlock with each hero: Essentiel, Relief, Éveil, Chromatique, Solaire, then Prisme.'
      :'Six tours, deux lignes, une révélation. Les cadres se débloquent avec chaque héros : Essentiel, Relief, Éveil, Chromatique, Solaire, puis Prisme.'}</p></div>
    </div>${nav('settings')}</div>`;
  $('#lg').onclick=()=>{S.lang=S.lang==='fr'?'en':'fr'; document.documentElement.lang=S.lang==='fr'?'fr':'en'; persist(); settings();};
  $('#so').onclick=()=>{S.mute=!S.mute; persist(); settings();};
  const sk=$('#sk'); if(sk&&skinOk) sk.onclick=()=>{S.skin=!S.skin; persist(); applySkin(); settings();};
  $('#tu').onclick=()=>{S.tut=false; persist(); go('play');};
  bindNav();
}
function bindNav(){view.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));}
function bindHolo(){
  view.querySelectorAll('.card.t6').forEach(el=>{
    el.addEventListener('pointermove',e=>{
      const r=el.getBoundingClientRect();
      el.classList.add('tilt');
      el.style.setProperty('--hx',((e.clientX-r.left)/r.width*100)+'%');
      el.style.setProperty('--hy',((e.clientY-r.top)/r.height*100)+'%');
    });
  });
}
document.documentElement.lang=S.lang==='fr'?'fr':'en';
applySkin();
go('splash');
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});

// Poses for visual QA. Not used in normal play.
window.__shot=function(name){
  S.tut=true; S.wins=3; S.skin=name==='ink';
  ['brok','sylve','marea','petrol','granit','zephyr','krom','aurel','lune','nyx'].forEach((h,i)=>{S.xp[h]=[500,40,100,190,320,500,500,190,100,40][i];});
  D.CARDS.filter(c=>c.hero==='brok').forEach(c=>{S.col[c.id]={n:c.rarity,foil:c.rarity===3?1:0};});
  applySkin(); persist();
  if(name==='splash') return go('splash');
  if(name==='home'||name==='ink') return go('home');
  if(name==='play'){pick=['brok','sylve']; return play();}
  if(name==='mm'){mmHeroes=['brok','granit']; mmOpp=['lune','nyx']; return go('mm');}
  if(name==='decks'){draftHeroes=['brok','granit']; draft={}; D.CARDS.filter(c=>draftHeroes.includes(c.hero)&&c.cost<=2).slice(0,8).forEach(c=>draft[c.id]=1); return decks();}
  if(name==='collection'){S.focus='brok'; return collection();}
  if(name==='settings') return settings();
  if(name==='board'||name==='reveal'||name==='tutorial'){
    G=D.create(['brok','granit'],['lune','nyx'],()=>0.2);
    // play two scripted turns so the board is alive
    const a=G.you.hand.find(c=>c.cost<=1), b=D.aiChoose(G,'foe');
    D.commit(G,a,b);
    sel=G.you.hand.find(c=>c.cost<=D.energy(G))||null;
    showTut=name==='tutorial'; tutStep=0; S.tut=name!=='tutorial';
    board();
    if(name==='reveal'){const you=sel; doTurn();}
    return;
  }
  if(name==='victory'||name==='defeat'){
    G=D.create(['brok','sylve'],['nyx','marea'],()=>0.3);
    while(!G.over) D.playTurn(G,D.aiChoose(G,'you'));
    if(name==='victory') G.winner=0; else G.winner=1;
    S.lastWin=G.winner===0; S.gain=S.lastWin?36:14; S.score=D.score(G);
    const pw=D.powers(G.you.line,G.foe.line); let mvp=G.you.line[0],best=-1;
    G.you.line.forEach((c,i)=>{if(pw[i]>best){best=pw[i];mvp=c;}}); S.mvp=mvp;
    return result();
  }
  if(name==='boost'){
    pack=D.CARDS.filter(c=>c.hero==='brok').slice(0,5).map((c,i)=>({c,foil:i===4,r:c.rarity}));
    packI=4; S.extra='brok'; return boost();
  }
};
})();
