// Bibbits Duel — moteur (navigateur + node)
(function(root){
const H=(nom,f,el,hp,role,cartes,ult)=>({nom,el,hp,role,img:'img/heroes/'+f+'.webp',cartes,ult});
const BIBBITS={
 sylve:H('Sylve','ronceline','Sève',34,'Archère-soigneuse',[
  ['Flèche de ronce','Sève',{dmg:3},1],['Sève vive','Sève',{heal:4},1],['Tir double','Sève',{dmg:2,hits:2},2],['Racines','Sève',{block:3,heal:2},2],
  ['Flèche perçante','Sève',{direct:4},3],['Floraison','Sève',{healAll:4},3],['Volée d\'épines','Sève',{dmg:3,hits:2,heal:2},4],['Arbre-mère','Sève',{healAll:6,block:3},5]],
  ['Ultime : Pluie de ronces','Sève',{dmg:3,hits:3,healAll:4}]),
 marea:H('Maréa','lamecume','Eau',32,'Soigneuse des marées',[
  ['Onde apaisante','Eau',{heal:4},1],['Bulle','Eau',{block:5},1],['Vague','Eau',{dmg:3},2],['Écume dorée','Eau',{heal:3,power:2},2],
  ['Marée montante','Eau',{dmg:4,heal:3},3],['Jet d\'écume','Eau',{direct:4},3],['Grand geyser','Eau',{dmg:5,heal:3},4],['Source sacrée','Eau',{healAll:5,block:3,dmg:2},5]],
  ['Ultime : Raz-de-marée','Eau',{healAll:6,dmg:6}]),
 brok:H('Brok','atrefeu','Braise',38,'Guerrier au marteau de lave',[
  ['Coup de marteau','Braise',{dmg:3},1],['Enclume levée','Braise',{block:5},1],['Forge ardente','Braise',{power:3,block:1},2],['Braises','Braise',{direct:3},2],
  ['Choc sismique','Braise',{dmg:5,block:3},3],['Peau de lave','Braise',{block:5,heal:3},3],['Frappe en fusion','Braise',{dmg:7},4],['Marteau titan','Braise',{dmg:8,block:3},5]],
  ['Ultime : Marteau-volcan','Braise',{dmg:10,block:5}]),
 petrol:H('Pétrol','tisonnet','Braise',45,'Ingénieur artificier',[
  ['Pétard','Braise',{dmg:2,splash:1},1],['Mèche courte','Braise',{direct:2},1],['Bombe collante','Braise',{dmg:3,shred:1},2],['Barricade','Braise',{block:4},2],
  ['Grenade','Braise',{dmg:4,splash:2},3],['Atelier','Braise',{power:3,block:2},3],['Baril explosif','Braise',{dmg:5,splash:3,shred:1},4],['Grand feu d\'artifice','Braise',{dmg:4,splash:4,direct:2},5]],
  ['Ultime : Méga-bombe','Braise',{dmg:7,splash:5,shred:1}]),
 granit:H('Granit','caillouteux','Roc',43,'Tank de pierre',[
  ['Coup de bouclier','Roc',{dmg:2,block:2},1],['Mur de pierre','Roc',{block:6},1],['Peau d\'épines','Roc',{block:3,thorns:2},2],['Charge','Roc',{dmg:4},2],
  ['Rempart','Roc',{shieldAll:4},3],['Éboulement','Roc',{dmg:5,block:2},3],['Montagne vivante','Roc',{block:8,thorns:3},4],['Séisme','Roc',{dmg:6,splash:3,block:3},5]],
  ['Ultime : Cœur de granit','Roc',{shieldAll:8,thorns:4,dmg:5}]),
 zephyr:H('Zéphyr','petardeau','Foudre',38,'Duelliste de la foudre',[
  ['Étincelle','Foudre',{dmg:3},1],['Pas éclair','Foudre',{block:3,power:1},1],['Riposte','Foudre',{dmg:2,hits:2},2],['Décharge','Foudre',{direct:3},2],
  ['Arc électrique','Foudre',{dmg:3,splash:2},3],['Fente fulgurante','Foudre',{dmg:2,hits:3},3],['Tonnerre','Foudre',{dmg:6,direct:1},4],['Tempête','Foudre',{dmg:3,hits:3,splash:2},5]],
  ['Ultime : Jugement céleste','Foudre',{dmg:4,hits:3,direct:3}]),
 krom:H('Krom','frimousson','Givre',46,'Bête de givre',[
  ['Griffe glacée','Givre',{dmg:3},1],['Souffle froid','Givre',{chill:2,block:2},1],['Fourrure épaisse','Givre',{block:5},2],['Morsure gelée','Givre',{dmg:3,chill:2},2],
  ['Blizzard','Givre',{dmg:3,splash:2,chill:1},3],['Rugissement','Givre',{chill:3,power:2},3],['Avalanche','Givre',{dmg:6,chill:2},4],['Hiver éternel','Givre',{dmg:5,chill:4,block:3},5]],
  ['Ultime : Zéro absolu','Givre',{dmg:6,chill:6,block:4}]),
 aurel:H('Aurel','lumignon','Aube',31,'Paladin à la lanterne',[
  ['Coup de masse','Aube',{dmg:3},1],['Lueur','Aube',{heal:3,block:1},1],['Bouclier d\'aube','Aube',{block:4,heal:1},2],['Châtiment','Aube',{dmg:3,direct:1},2],
  ['Lanterne bénie','Aube',{shieldAll:3,heal:2},3],['Frappe sacrée','Aube',{dmg:5,heal:2},3],['Aube nouvelle','Aube',{healAll:4,shieldAll:2},4],['Jugement doré','Aube',{dmg:6,heal:3,block:2},5]],
  ['Ultime : Soleil levant','Aube',{dmg:6,healAll:5,shieldAll:3}]),
 lune:H('Lune','ninnelune','Crépuscule',38,'Lièvre des ombres, lames',[
  ['Lame lunaire','Crépuscule',{dmg:3},1],['Esquive','Crépuscule',{block:4},1],['Aiguise-lames','Crépuscule',{power:3,dmg:1},2],['Double entaille','Crépuscule',{dmg:2,hits:2},2],
  ['Dague perfide','Crépuscule',{direct:4},3],['Danse des lames','Crépuscule',{dmg:2,hits:3,drain:1},3],['Croissant fendu','Crépuscule',{dmg:6,drain:1},4],['Éclipse tranchante','Crépuscule',{dmg:3,hits:3,block:2},5]],
  ['Ultime : Nuit des mille lames','Crépuscule',{dmg:3,hits:4,drain:1}]),
 nyx:H('Nyx','veillombre','Crépuscule',47,'Dragonne protectrice',[
  ['Griffe d\'ombre','Crépuscule',{dmg:3},1],['Aile protectrice','Crépuscule',{shieldAll:3},1],['Morsure','Crépuscule',{dmg:3,drain:1},2],['Écailles','Crépuscule',{block:4,thorns:1},2],
  ['Souffle nocturne','Crépuscule',{dmg:3,splash:2},3],['Couvée','Crépuscule',{shieldAll:4,heal:2},3],['Vol plané','Crépuscule',{dmg:5,shieldAll:2},4],['Souffle du néant','Crépuscule',{dmg:5,splash:3,drain:1},5]],
  ['Ultime : Ailes de la nuit','Crépuscule',{shieldAll:6,dmg:6,splash:3}])
};
const COMBOS=[['Eau','Braise','Vapeur',{dmg:2}],['Braise','Foudre','Surcharge',{dmg:2}],['Foudre','Eau','Électrocution',{direct:2}],['Givre','Roc','Gel fracturé',{dmg:3}],
 ['Sève','Roc','Racines profondes',{block:3}],['Sève','Eau','Rosée',{heal:2}],['Givre','Foudre','Orage glacé',{dmg:2}],['Aube','Crépuscule','Éclipse',{direct:1,heal:1}],
 ['Crépuscule','Aube','Aurore',{heal:2,block:1}],['Roc','Braise','Magma',{dmg:2}],['Eau','Givre','Verglas',{chill:2}],['Braise','Sève','Cendres fertiles',{heal:2}]];
let EVEIL_MAX=12, MAX_ROUNDS=60, FATIGUE=18; const MANA0=2,MANA_CAP=8;
function shuffle(a,rng){for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
let uid=0;
function mk(b,c,extra){return Object.assign({id:++uid,b,nom:c[0],el:c[1],fx:c[2],cout:c[3]||0},extra||{});}
function newGame(teamA,teamB,rng){rng=rng||Math.random;
 const sides=[teamA,teamB].map(team=>{
  const t=team.map(k=>{const d=BIBBITS[k];return{k,nom:d.nom,img:d.img,hp:d.hp,max:d.hp,block:0,power:0,eveil:0,ult:false};});
  let res=[];team.forEach((k,i)=>BIBBITS[k].cartes.forEach(c=>res.push(mk(i,c))));shuffle(res,rng);
  const st=[];for(const c of res.filter(c=>c.cout===1).slice(0,2)){st.push(c);res.splice(res.indexOf(c),1);}return{team:t,reserve:res,combat:st,lastEl:null,fane:1,played:null,mana:0,maxMana:MANA0-1};});
 return{sides,round:0,over:false,winner:null,log:[],rng};}
function fxText(f){const p=[];if(f.dmg)p.push((f.hits?f.hits+'× ':'')+f.dmg+' dégâts');if(f.direct)p.push(f.direct+' dégâts directs');if(f.block)p.push('+'+f.block+' bloc');if(f.heal)p.push('soin '+f.heal);if(f.healAll)p.push('soin équipe '+f.healAll);if(f.power)p.push('+'+f.power+' puissance');if(f.shieldAll)p.push('+'+f.shieldAll+' bloc équipe');if(f.thorns)p.push('épines '+f.thorns);if(f.chill)p.push('gel '+f.chill);if(f.splash)p.push(f.splash+' à l\'autre ennemi');if(f.shred)p.push('brise le bloc');if(f.drain)p.push('vol de vie');if(f.fane)p.push('Fané : '+f.fane+' dégâts à son propre camp');return p.join(', ');}
function lowest(team){const a=team.filter(x=>x.hp>0);return a.sort((x,y)=>x.hp/x.max-y.hp/y.max)[0]||team[0];}
function hurt(g,s,target,n,pierce){if(n<=0)return 0;const b0=target.block;let d=n;if(!pierce){const ab=Math.min(target.block,d);target.block-=ab;d-=ab;}target.hp=Math.max(0,target.hp-d);ev(g,{t:'dmg',s,i:g.sides[s].team.indexOf(target),n:d,blocked:pierce?0:b0-target.block,hp:target.hp,eveil:Math.min(EVEIL_MAX,target.eveil+(target.ult?0:d))});
 if(d>0&&!target.ult){target.eveil=Math.min(EVEIL_MAX,target.eveil+d);if(target.eveil>=EVEIL_MAX){target.ult=true;const bi=g.sides[s].team.indexOf(target);g.sides[s].combat.unshift(mk(bi,BIBBITS[target.k].ult,{ultime:true}));ev(g,{t:'ult',s,i:bi,nom:BIBBITS[target.k].ult[0]});g.log.push('✨ '+target.nom+' s\'éveille ! Son Ultime est inséré en tête du paquet de combat.');}}
 return d;}
function playRound(g){if(g.over)return;g.round++;g.log.push('— Manche '+g.round+' —');g.ev=[];
 const flips=g.sides.map(S=>{const c=S.combat.shift();S.played=c;return c;});
 const act=[0,1].map(s=>{const c=flips[s],S=g.sides[s];let fx=Object.assign({},c.fx),combo=null;
  if(S.lastEl&&!c.fane)for(const k of COMBOS)if(k[0]===S.lastEl&&k[1]===c.el){combo=k[2];for(const x in k[3])fx[x]=(fx[x]||0)+k[3][x];break;}
  if(!c.fane)S.lastEl=c.el;
  const who=c.fane?lowest(S.team):S.team[c.b];
  g.log.push((s===0?'Toi':'IA')+' : '+(c.fane?'carte Fané !':who.nom+' joue « '+c.nom+' » ('+c.el+')')+(combo?' — COMBO '+combo+' !':''));
  ev(g,{t:'flip',s,c,combo,i:S.team.indexOf(who)});return{s,c,fx,who};});
 // phase 1 : défense / soins / puissance
 act.forEach(({s,c,fx,who})=>{const T=g.sides[s].team;if(c.fane)return;
  if(fx.shieldAll)T.forEach(t=>{if(t.hp>0){t.block+=fx.shieldAll;ev(g,{t:'block',s,i:T.indexOf(t),n:fx.shieldAll});}});if(fx.thorns){who.thorns=(who.thorns||0)+fx.thorns;}if(fx.chill){const tg=act[1-s].who;tg.chill=(tg.chill||0)+fx.chill;ev(g,{t:'chill',s:1-s,i:g.sides[1-s].team.indexOf(tg),n:fx.chill});}if(fx.block){who.block+=fx.block;ev(g,{t:'block',s,i:T.indexOf(who),n:fx.block});}if(fx.power){who.power+=fx.power;ev(g,{t:'power',s,i:T.indexOf(who),n:fx.power});}
  if(fx.heal){const t=lowest(T);t.hp=Math.min(t.max,t.hp+fx.heal);ev(g,{t:'heal',s,i:T.indexOf(t),n:fx.heal,hp:t.hp});g.log.push('  '+t.nom+' récupère '+fx.heal+' PV');}
  if(fx.healAll)T.forEach(t=>{if(t.hp>0)t.hp=Math.min(t.max,t.hp+fx.healAll);ev(g,{t:'heal',s,i:T.indexOf(t),n:fx.healAll,hp:t.hp});});});
 // phase 2 : attaques (cible : Bibbit adverse actif)
 const tie=g.round%2?0:1;const ord=act.slice().sort((x,y)=>((x.c.cout||0)-(y.c.cout||0))||((x.s===tie)?-1:1));const first=true;g.log.push((ord[0].c.cout||0)<(ord[1].c.cout||0)?'  ⚡ Initiative : la carte la moins chère frappe en premier.':'  ⚡ Initiative (égalité) : '+(tie===0?'toi':'l\'IA')+' frappe en premier cette manche.');
 ord.forEach(({s,c,fx,who},k)=>{if(first&&k===1&&g.sides[s].team.some(t=>t.hp<=0)){g.log.push('  '+who.nom+' est trop lent…');return;}const o=1-s,tgt=act[o].who;
  if(c.fane){const d=hurt(g,s,who,c.fx.fane,true);g.log.push('  La corruption Fané blesse '+who.nom+' ('+d+')');return;}
  if(fx.dmg||fx.direct)ev(g,{t:'lunge',s,i:g.sides[s].team.indexOf(who),o,ti:g.sides[o].team.indexOf(tgt),el:c.el});if(fx.dmg){if(fx.shred){tgt.block=0;}const hits=fx.hits||1;let tot=0;const base=Math.max(0,fx.dmg+who.power-(who.chill||0));who.chill=0;for(let i=0;i<hits;i++){tot+=hurt(g,o,tgt,base);if(tgt.thorns&&base>0)hurt(g,s,who,tgt.thorns,true);}if(fx.drain&&tot>0){const h=Math.min(who.max-who.hp,Math.ceil(tot*fx.drain/2));if(h>0){who.hp+=h;ev(g,{t:'heal',s,i:g.sides[s].team.indexOf(who),n:h,hp:who.hp});}}g.log.push('  '+who.nom+' inflige '+tot+' à '+tgt.nom+(who.power?' (puissance +'+who.power+')':''));who.power=0;}
  if(fx.splash){const ot=g.sides[o].team.find(t=>t!==tgt&&t.hp>0);if(ot)hurt(g,o,ot,fx.splash,false);}if(fx.direct){const d=hurt(g,o,tgt,fx.direct,true);g.log.push('  '+d+' dégâts directs à '+tgt.nom);}});
 if(g.round>=FATIGUE){const n=Math.ceil((g.round-FATIGUE+1)/2);g.log.push('  🌫 La Brume du Fané s\'épaissit : '+n+' dégât(s) aux Bibbits actifs.');ev(g,{t:'brume',n});for(const {s,who} of ord){if(g.sides.some(S=>S.team.some(t=>t.hp<=0)))break;const T=g.sides[s].team;hurt(g,s,who.hp>0?who:lowest(T),n,true);}}
 // fin de manche : la carte retourne sous le paquet (sauf Fané)
 act.forEach(({s,c})=>{if(!c.fane)g.sides[s].combat.push(c);});
 g.sides.forEach(S=>S.team.forEach(t=>{t.block=Math.floor(t.block/2);t.thorns=0;}));
 const ko=g.sides.map(S=>S.team.some(t=>t.hp<=0));
 if(ko[0]||ko[1]){g.over=true;g.winner=ko[0]&&ko[1]?'nul':ko[1]?0:1;g.log.push(g.winner==='nul'?'Double KO : match nul !':g.winner===0?'🏆 Victoire !':'💀 Défaite…');}
 else if(g.round>=MAX_ROUNDS){g.over=true;g.winner='nul';g.log.push('Limite de manches : match nul.');}}
function ev(g,e){(g.ev=g.ev||[]).push(e);}
function draw3(g,s){const S=g.sides[s];S.maxMana=Math.min(MANA_CAP,S.maxMana+1);S.mana=Math.min(MANA_CAP+2,S.maxMana+(S.saved?1:0));S.saved=false;return S.reserve.splice(0,3);}
function commit(g,s,offer,pick,pos,faneOpp){const S=g.sides[s];if(pick==null||pick<0||!offer[pick]||offer[pick].cout>S.mana){S.saved=true;S.reserve.push(...offer.splice(0));if(offer.length===0)g.log.push((s===0?'Tu passes':'L\'IA passe')+' ton achat (+1 mana au prochain tour).');}else if(offer.length){S.mana-=offer[pick].cout;const c=offer.splice(pick,1)[0];S.combat.splice(Math.max(0,Math.min(pos,S.combat.length)),0,c);S.reserve.push(...offer);}
 if(faneOpp&&S.fane>0){S.fane=0;const O=g.sides[1-s];O.combat.splice(Math.floor(g.rng()*(O.combat.length+1)),0,mk(null,['Fané','Fané',{fane:3}],{fane:true}));g.log.push((s===0?'Tu glisses':'L\'IA glisse')+' une carte Fané dans le paquet adverse !');}}
function aiChoose(g,s,offer){const S=g.sides[s],T=S.team;
 const hurtMost=T.reduce((a,t)=>Math.min(a,t.hp/t.max),1);
 let best=-1,bs=-1e9;offer.forEach((c,i)=>{if(c.cout>S.mana)return;const f=c.fx;let v=(f.dmg||0)*(f.hits||1)+(f.splash||0)*0.8+(f.chill||0)*0.9+(f.thorns||0)*0.8+(f.shieldAll||0)*1.4+(f.drain?2:0)+(f.direct||0)*1.3+(f.block||0)*0.8+(f.power||0)*1.2+((f.heal||0)+(f.healAll||0)*2)*(hurtMost<0.6?1.5:0.4)+g.rng();if(T[c.b].hp<=0)v-=5;if(v>bs){bs=v;best=i;}});
 const pos=hurtMost<0.5?0:Math.floor(g.rng()*(S.combat.length+1));
 return{pick:best,pos,fane:S.fane>0&&g.round>=3&&g.rng()<0.3};}
const API={BIBBITS,COMBOS,get EVEIL_MAX(){return EVEIL_MAX},MANA_CAP,newGame,playRound,draw3,commit,aiChoose,fxText,shuffle};
if(typeof module!=='undefined')module.exports=API;else root.Duel=API;
})(this);
