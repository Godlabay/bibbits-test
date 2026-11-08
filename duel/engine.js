// Bibbits Duel v11 — 6 tours, choix simultanés, ligne qui persiste, synergies.
(function(root,f){if(typeof module==='object')module.exports=f();else root.Duel=f();})(this,function(){
const HEROES={
  brok:{fr:'Brok',en:'Brok',el:'Braise',c:'#ff683e'},
  sylve:{fr:'Sylve',en:'Sylve',el:'Sève',c:'#9edc63'},
  marea:{fr:'Maréa',en:'Marea',el:'Eau',c:'#51cfff'},
  petrol:{fr:'Pétrol',en:'Petrol',el:'Étincelle',c:'#f5e564'},
  granit:{fr:'Granit',en:'Granit',el:'Roc',c:'#e4b35b'},
  zephyr:{fr:'Zéphyr',en:'Zephyr',el:'Souffle',c:'#9aeafa'},
  krom:{fr:'Krom',en:'Krom',el:'Givre',c:'#b1c9e7'},
  aurel:{fr:'Aurel',en:'Aurel',el:'Aube',c:'#ffe6a4'},
  lune:{fr:'Lune',en:'Lune',el:'Lune',c:'#bea4ff'},
  nyx:{fr:'Nyx',en:'Nyx',el:'Ombre',c:'#f664a4'}
};
// fx: duo N (self +N if an ally is in the line), aura N (other allies +N),
// lien EL N (self +N if that element is allied), gel N (each enemy −N),
// clan N (self +N per other ally of the same element).
const RAW=[
  ['brok','Coup de marteau','Hammer blow',1,2,null],
  ['brok','Enclume','Anvil',1,1,['gel',1]],
  ['brok','Forge ardente','Burning forge',2,3,['duo',2]],
  ['brok','Braises','Embers',2,2,['clan',2]],
  ['brok','Choc sismique','Seismic shock',3,5,null],
  ['brok','Enchaînement','Chain strike',3,3,['aura',2]],
  ['brok','Frappe en fusion','Fusion strike',4,5,['lien','Roc',3]],
  ['brok','Marteau titan','Titan hammer',5,8,['duo',1]],
  ['sylve','Flèche de ronce','Briar shot',1,2,null],
  ['sylve','Sève vive','Living sap',1,0,['aura',1]],
  ['sylve','Tir double','Twin shot',2,3,['duo',1]],
  ['sylve','Racines','Roots',2,2,['lien','Eau',3]],
  ['sylve','Flèche perçante','Piercing shot',3,5,null],
  ['sylve','Floraison','Bloom',3,3,['aura',1]],
  ['sylve','Volée d\'épines','Thorn volley',4,7,['clan',2]],
  ['sylve','Arbre-mère','Mother tree',5,6,['aura',2]],
  ['marea','Onde','Wavelet',1,2,null],
  ['marea','Bulle','Bubble',1,1,['aura',1]],
  ['marea','Vague','Wave',2,3,['duo',2]],
  ['marea','Écume','Sea foam',2,2,['lien','Braise',3]],
  ['marea','Marée','Tide',3,5,null],
  ['marea','Courant','Current',3,4,['aura',1]],
  ['marea','Geyser','Geyser',4,6,null],
  ['marea','Raz-de-marée','Tidal wave',5,8,['duo',1]],
  ['petrol','Pétard','Firecracker',1,2,['clan',1]],
  ['petrol','Mèche','Short fuse',1,2,null],
  ['petrol','Bombe collante','Sticky bomb',2,3,['duo',1]],
  ['petrol','Barricade','Barricade',2,1,['gel',1]],
  ['petrol','Grenade','Grenade',3,5,null],
  ['petrol','Atelier','Workshop',3,2,['lien','Braise',3]],
  ['petrol','Baril explosif','Powder keg',4,7,['duo',2]],
  ['petrol','Feu d\'artifice','Fireworks',5,7,['aura',1]],
  ['granit','Coup de bouclier','Shield bash',1,2,null],
  ['granit','Provocation','Challenge',1,2,['gel',1]],
  ['granit','Peau d\'épines','Thorn hide',2,3,['duo',1]],
  ['granit','Charge','Charge',2,4,null],
  ['granit','Rempart','Bulwark',3,2,['aura',2]],
  ['granit','Éboulement','Rockslide',3,5,null],
  ['granit','Montagne vivante','Living mountain',4,6,['gel',1]],
  ['granit','Séisme','Quake',5,9,['lien','Braise',2]],
  ['zephyr','Étincelle','Spark',1,2,null],
  ['zephyr','Pas éclair','Flash step',1,1,['duo',2]],
  ['zephyr','Riposte','Riposte',2,3,['gel',1]],
  ['zephyr','Décharge','Discharge',2,3,['lien','Eau',2]],
  ['zephyr','Arc électrique','Electric arc',3,5,null],
  ['zephyr','Fente fulgurante','Lightning lunge',3,4,['duo',2]],
  ['zephyr','Tonnerre','Thunder',4,6,null],
  ['zephyr','Tempête','Storm',5,7,['aura',1]],
  ['krom','Griffe glacée','Icy claw',1,2,null],
  ['krom','Souffle froid','Cold breath',1,1,['gel',1]],
  ['krom','Fourrure','Thick fur',2,3,['duo',1]],
  ['krom','Morsure gelée','Frozen bite',2,3,['clan',1]],
  ['krom','Blizzard','Blizzard',3,4,['gel',1]],
  ['krom','Rugissement','Roar',3,3,['aura',1]],
  ['krom','Avalanche','Avalanche',4,8,null],
  ['krom','Hiver éternel','Endless winter',5,8,['lien','Roc',2]],
  ['aurel','Coup de masse','Mace blow',1,2,null],
  ['aurel','Lueur','Gleam',1,1,['aura',1]],
  ['aurel','Bouclier d\'aube','Dawn shield',2,2,['lien','Sève',3]],
  ['aurel','Châtiment','Chastise',2,4,null],
  ['aurel','Lanterne','Blessed lantern',3,3,['aura',1]],
  ['aurel','Frappe sacrée','Holy strike',3,5,['duo',1]],
  ['aurel','Aube nouvelle','New dawn',4,6,['aura',1]],
  ['aurel','Jugement doré','Golden judgment',5,9,null],
  ['lune','Lame lunaire','Moon blade',1,2,['duo',1]],
  ['lune','Esquive','Sidestep',1,1,['gel',1]],
  ['lune','Aiguise-lames','Whetstone',2,3,['aura',1]],
  ['lune','Double entaille','Double cut',2,3,null],
  ['lune','Dague perfide','Sly dagger',3,5,null],
  ['lune','Danse des lames','Blade dance',3,4,['clan',2]],
  ['lune','Croissant fendu','Split crescent',4,6,['duo',1]],
  ['lune','Éclipse','Eclipse',5,7,['lien','Ombre',2]],
  ['nyx','Griffe d\'ombre','Shadow claw',1,2,null],
  ['nyx','Aile protectrice','Sheltering wing',1,0,['aura',2]],
  ['nyx','Morsure','Bite',2,3,['duo',1]],
  ['nyx','Écailles','Scales',2,2,['gel',1]],
  ['nyx','Souffle nocturne','Night breath',3,5,null],
  ['nyx','Couvée','Brood',3,2,['lien','Lune',3]],
  ['nyx','Vol plané','Glide',4,6,['duo',2]],
  ['nyx','Souffle du néant','Void breath',5,9,null]
];
const CARDS=RAW.map(r=>{
  const h=HEROES[r[0]];
  const cost=r[3];
  return {id:r[0]+':'+r[1],hero:r[0],fr:r[1],en:r[2],cost,pow:r[4],fx:r[5],el:h.el,c:h.c,
    rarity:cost>=4?3:cost===3?2:1};
});
const byId={};CARDS.forEach(c=>{byId[c.id]=c;});
const MAXC={1:3,2:2,3:1};
const TURNS=6;
function shuffle(a,r){for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function rarityOf(c){return c.rarity;}
function fxText(c,lang){
  const fx=c.fx; if(!fx) return lang==='en'?'Strike':'Frappe';
  const en=lang==='en';
  if(fx[0]==='duo') return (en?'+'+fx[1]+' with an ally':'+'+fx[1]+' avec un allié');
  if(fx[0]==='aura') return (en?'Previous +'+fx[1]:'Carte d\'avant +'+fx[1]);
  if(fx[0]==='lien') return (en?'+'+fx[2]+' with '+fx[1]:'+'+fx[2]+' avec '+fx[1]);
  if(fx[0]==='gel') return (en?'−'+fx[1]+' on strongest foe':'−'+fx[1]+' sur le plus fort');
  if(fx[0]==='clan') return (en?'+'+fx[1]+' if another '+c.el:'+'+fx[1]+' si autre '+c.el);
  return '';
}
// Final power of each card in a line. Mutates nothing.
function powers(line,foes){
  const p=line.map(c=>c.pow);
  line.forEach((c,i)=>{
    const fx=c.fx; if(!fx) return;
    const allies=line.filter((_,j)=>j!==i);
    if(fx[0]==='duo'&&allies.length) p[i]+=fx[1];
    if(fx[0]==='lien'&&allies.some(a=>a.el===fx[1])) p[i]+=fx[2];
    if(fx[0]==='clan'&&allies.some(a=>a.el===c.el)) p[i]+=fx[1];
    if(fx[0]==='aura'&&i>0) p[i-1]+=fx[1];
  });
  let gel=(foes||[]).reduce((s,c)=>s+(c.fx&&c.fx[0]==='gel'?c.fx[1]:0),0);
  while(gel>0&&p.length){let k=0;for(let i=1;i<p.length;i++)if(p[i]>p[k])k=i;if(p[k]<=0)break;p[k]--;gel--;}
  return p.map(n=>Math.max(0,n));
}
function total(line,foes){return powers(line,foes).reduce((s,n)=>s+n,0);}
function starter(heroes){
  const pool=CARDS.filter(c=>heroes.includes(c.hero));
  const take=(pred,n)=>pool.filter(pred).slice(0,n);
  const deck=[].concat(take(c=>c.cost===1,4),take(c=>c.cost===2,4),take(c=>c.cost===3,2),take(c=>c.cost===4,1),take(c=>c.cost===5,1));
  return deck.slice(0,12).map(c=>Object.assign({uid:c.id+'#'+Math.random().toString(36).slice(2,7)},c));
}
function freshSide(heroes,rng){
  const deck=shuffle(starter(heroes).map(c=>Object.assign({},c)),rng);
  const hand=deck.splice(0,4);
  return {heroes,deck,hand,line:[],played:null};
}
function create(mine,opp,rng){
  rng=rng||Math.random;
  let uid=1; const stamp=arr=>arr.map(c=>Object.assign({},c,{uid:uid++}));
  const mk=heroes=>{
    const base=starter(heroes);
    const deck=shuffle(base.map(c=>Object.assign({},c)),rng);
    deck.forEach(c=>{c.uid=uid++;});
    return {heroes,deck,hand:deck.splice(0,4),line:[]};
  };
  return {turn:1,over:false,winner:null,rng,you:mk(mine),foe:mk(opp),last:null};
}
function energy(g){return g.turn;}
function legal(side,en){return side.hand.filter(c=>c.cost<=en);}
function score(g){return [total(g.you.line,g.foe.line),total(g.foe.line,g.you.line)];}
// One-step lookahead on the visible line. Does not read the opponent's hand.
function aiChoose(g,seat){
  const me=seat==='you'?g.you:g.foe, foe=seat==='you'?g.foe:g.you;
  const opts=legal(me,energy(g));
  let best=null,bv=-1e9;
  const consider=card=>{
    const my=me.line.concat(card?[card]:[]);
    const s=total(my,foe.line)-total(foe.line,my);
    const waste=card?0:-2; // passing spends the turn
    const v=s+waste+(card?card.pow*0.05:0)+g.rng()*0.35;
    if(v>bv){bv=v;best=card||null;}
  };
  consider(null);
  opts.forEach(consider);
  return best;
}
function commit(g,yourCard,foeCard){
  const play=(side,card)=>{
    if(!card) return null;
    const i=side.hand.findIndex(c=>c.uid===card.uid);
    if(i<0||card.cost>energy(g)) return null;
    side.hand.splice(i,1);
    side.line.push(card);
    return card;
  };
  const a=play(g.you,yourCard), b=play(g.foe,foeCard);
  if(g.you.deck.length) g.you.hand.push(g.you.deck.shift());
  if(g.foe.deck.length) g.foe.hand.push(g.foe.deck.shift());
  const sc=score(g);
  g.last={you:a,foe:b,score:sc.slice(),turn:g.turn};
  if(g.turn>=TURNS){g.over=true;g.winner=sc[0]>sc[1]?0:sc[1]>sc[0]?1:-1;}
  else g.turn++;
  return g.last;
}
function playTurn(g,yourCard){
  const foe=aiChoose(g,'foe');
  return commit(g,yourCard,foe);
}
// Build a legal custom deck: ids with counts, heroes length 2.
function validateDeck(heroes,counts){
  const err=[];
  if(!heroes||heroes.length!==2) err.push('heroes');
  let n=0;
  Object.keys(counts||{}).forEach(id=>{
    const c=byId[id]; if(!c||heroes.indexOf(c.hero)<0){err.push(id);return;}
    const k=counts[id]|0; if(k<0||k>MAXC[c.rarity]) err.push(id);
    n+=k;
  });
  if(n!==12) err.push('size');
  return err;
}
function deckFromCounts(heroes,counts,rng){
  const list=[];
  Object.keys(counts).forEach(id=>{
    const c=byId[id]; const k=counts[id]|0;
    for(let i=0;i<k;i++) list.push(Object.assign({},c));
  });
  return list;
}
function sim(N,rng){
  rng=rng||Math.random;
  const keys=Object.keys(HEROES), w={},n={}; let draws=0; keys.forEach(k=>{w[k]=0;n[k]=0;});
  let rounds=0;
  for(let i=0;i<N;i++){
    const pick=()=>keys[(rng()*keys.length)|0];
    let a=[pick(),pick()]; if(a[0]===a[1]) a[1]=keys[(keys.indexOf(a[0])+1)%keys.length];
    let b=[pick(),pick()]; if(b[0]===b[1]) b[1]=keys[(keys.indexOf(b[0])+3)%keys.length];
    const g=create(a,b,rng);
    while(!g.over){const mine=aiChoose(g,'you'); playTurn(g,mine);} 
    rounds+=TURNS;
    if(g.winner<0){draws++;continue;}
    const W=g.winner===0?a:b, L=g.winner===0?b:a;
    new Set(W).forEach(k=>{w[k]++;n[k]++;});
    new Set(L).forEach(k=>{n[k]++;});
  }
  return {N,draws,rates:keys.map(k=>({k,wr:n[k]?(100*w[k]/n[k]):0,n:n[k]}))};
}
return {HEROES,CARDS,byId,MAXC,TURNS,fxText,powers,total,starter,create,energy,legal,score,aiChoose,commit,playTurn,validateDeck,deckFromCounts,sim,rarityOf};
});
