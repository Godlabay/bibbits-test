// Bibbits Duel — moteur (navigateur + node)
(function(root){
const BIBBITS={
 atrefeu:{nom:'Âtrefeu',el:'Feu',hp:48,img:'img/atrefeu.jpg',role:'Tank / marteau',
  cartes:[['Coup de marteau','Feu',{dmg:3},1],['Coup de marteau','Feu',{dmg:3},1],['Enclume levée','Feu',{block:5},1],['Forge ardente','Feu',{power:3,block:1},2],['Braises','Feu',{direct:3},2],['Choc sismique','Feu',{dmg:5,block:3},3],['Peau de lave','Feu',{block:5,heal:3},3],['Marteau titan','Feu',{dmg:8,block:3},5]],
  ult:['Ultime : Marteau-volcan','Feu',{dmg:10,block:5}]},
 ninnelune:{nom:'Ninnelune',el:'Mauve',hp:32,img:'img/ninnelune.jpg',role:'DPS rapide / lames',
  cartes:[['Lame lunaire','Mauve',{dmg:3},1],['Esquive lunaire','Mauve',{block:4,heal:1},1],['Pas d\'ombre','Mauve',{block:3,power:2},2],['Aiguise-lames','Mauve',{power:3,dmg:1},2],['Double entaille','Mauve',{dmg:3,hits:2},3],['Dague perfide','Mauve',{direct:5},3],['Croissant fendu','Mauve',{dmg:6},4],['Éclipse tranchante','Mauve',{dmg:3,hits:3,block:2},5]],
  ult:['Ultime : Nuit des mille lames','Mauve',{dmg:3,hits:4}]},
 lamecume:{nom:'Lamécume',el:'Eau',hp:38,img:'img/lamecume.jpg',role:'Soigneuse',
  cartes:[['Onde apaisante','Or',{heal:4},1],['Bulle protectrice','Eau',{block:5,heal:1},1],['Vague','Eau',{dmg:3},1],['Bénédiction dorée','Or',{heal:3,power:2},2],['Jet d\'écume','Eau',{direct:3},2],['Marée montante','Eau',{dmg:4,heal:3},3],['Grand geyser','Eau',{dmg:5,heal:3},4],['Source sacrée','Or',{healAll:5,block:3,dmg:2},5]],
  ult:['Ultime : Grande marée dorée','Or',{healAll:6,dmg:5}]}
};
// combos : élément précédent -> élément courant
const COMBOS=[['Eau','Feu','Vapeur',{dmg:2}],['Eau','Mauve','Brume',{dmg:2}],['Feu','Mauve','Braise vive',{direct:1}],['Mauve','Eau','Ressac',{heal:2}],['Or','Feu','Éclat sacré',{block:2}],['Or','Mauve','Éclat sacré',{block:2}],['Feu','Or','Flamme pure',{heal:1,block:1}]];
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
function fxText(f){const p=[];if(f.dmg)p.push((f.hits?f.hits+'× ':'')+f.dmg+' dégâts');if(f.direct)p.push(f.direct+' dégâts directs');if(f.block)p.push('+'+f.block+' bloc');if(f.heal)p.push('soin '+f.heal);if(f.healAll)p.push('soin équipe '+f.healAll);if(f.power)p.push('+'+f.power+' puissance');if(f.fane)p.push('Fané : '+f.fane+' dégâts à son propre camp');return p.join(', ');}
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
  if(fx.block){who.block+=fx.block;ev(g,{t:'block',s,i:T.indexOf(who),n:fx.block});}if(fx.power){who.power+=fx.power;ev(g,{t:'power',s,i:T.indexOf(who),n:fx.power});}
  if(fx.heal){const t=lowest(T);t.hp=Math.min(t.max,t.hp+fx.heal);ev(g,{t:'heal',s,i:T.indexOf(t),n:fx.heal,hp:t.hp});g.log.push('  '+t.nom+' récupère '+fx.heal+' PV');}
  if(fx.healAll)T.forEach(t=>{if(t.hp>0)t.hp=Math.min(t.max,t.hp+fx.healAll);ev(g,{t:'heal',s,i:T.indexOf(t),n:fx.healAll,hp:t.hp});});});
 // phase 2 : attaques (cible : Bibbit adverse actif)
 const tie=g.round%2?0:1;const ord=act.slice().sort((x,y)=>((x.c.cout||0)-(y.c.cout||0))||((x.s===tie)?-1:1));const first=true;g.log.push((ord[0].c.cout||0)<(ord[1].c.cout||0)?'  ⚡ Initiative : la carte la moins chère frappe en premier.':'  ⚡ Initiative (égalité) : '+(tie===0?'toi':'l\'IA')+' frappe en premier cette manche.');
 ord.forEach(({s,c,fx,who},k)=>{if(first&&k===1&&g.sides[s].team.some(t=>t.hp<=0)){g.log.push('  '+who.nom+' est trop lent…');return;}const o=1-s,tgt=act[o].who;
  if(c.fane){const d=hurt(g,s,who,c.fx.fane,true);g.log.push('  La corruption Fané blesse '+who.nom+' ('+d+')');return;}
  if(fx.dmg||fx.direct)ev(g,{t:'lunge',s,i:g.sides[s].team.indexOf(who),o,ti:g.sides[o].team.indexOf(tgt),el:c.el});if(fx.dmg){const hits=fx.hits||1;let tot=0;const base=fx.dmg+who.power;for(let i=0;i<hits;i++)tot+=hurt(g,o,tgt,base);g.log.push('  '+who.nom+' inflige '+tot+' à '+tgt.nom+(who.power?' (puissance +'+who.power+')':''));who.power=0;}
  if(fx.direct){const d=hurt(g,o,tgt,fx.direct,true);g.log.push('  '+d+' dégâts directs à '+tgt.nom);}});
 if(g.round>=FATIGUE){const n=Math.ceil((g.round-FATIGUE+1)/2);g.log.push('  🌫 La Brume du Fané s\'épaissit : '+n+' dégât(s) aux Bibbits actifs.');ev(g,{t:'brume',n});for(const {s,who} of ord){if(g.sides.some(S=>S.team.some(t=>t.hp<=0)))break;const T=g.sides[s].team;hurt(g,s,who.hp>0?who:lowest(T),n,true);}}
 // fin de manche : la carte retourne sous le paquet (sauf Fané)
 act.forEach(({s,c})=>{if(!c.fane)g.sides[s].combat.push(c);});
 g.sides.forEach(S=>S.team.forEach(t=>t.block=Math.floor(t.block/2)));
 const ko=g.sides.map(S=>S.team.some(t=>t.hp<=0));
 if(ko[0]||ko[1]){g.over=true;g.winner=ko[0]&&ko[1]?'nul':ko[1]?0:1;g.log.push(g.winner==='nul'?'Double KO : match nul !':g.winner===0?'🏆 Victoire !':'💀 Défaite…');}
 else if(g.round>=MAX_ROUNDS){g.over=true;g.winner='nul';g.log.push('Limite de manches : match nul.');}}
function ev(g,e){(g.ev=g.ev||[]).push(e);}
function draw3(g,s){const S=g.sides[s];S.maxMana=Math.min(MANA_CAP,S.maxMana+1);S.mana=Math.min(MANA_CAP+2,S.maxMana+(S.saved?1:0));S.saved=false;return S.reserve.splice(0,3);}
function commit(g,s,offer,pick,pos,faneOpp){const S=g.sides[s];if(pick==null||pick<0||!offer[pick]||offer[pick].cout>S.mana){S.saved=true;S.reserve.push(...offer.splice(0));if(offer.length===0)g.log.push((s===0?'Tu passes':'L\'IA passe')+' ton achat (+1 mana au prochain tour).');}else if(offer.length){S.mana-=offer[pick].cout;const c=offer.splice(pick,1)[0];S.combat.splice(Math.max(0,Math.min(pos,S.combat.length)),0,c);S.reserve.push(...offer);}
 if(faneOpp&&S.fane>0){S.fane=0;const O=g.sides[1-s];O.combat.splice(Math.floor(g.rng()*(O.combat.length+1)),0,mk(null,['Fané','Fané',{fane:3}],{fane:true}));g.log.push((s===0?'Tu glisses':'L\'IA glisse')+' une carte Fané dans le paquet adverse !');}}
function aiChoose(g,s,offer){const S=g.sides[s],T=S.team;
 const hurtMost=T.reduce((a,t)=>Math.min(a,t.hp/t.max),1);
 let best=-1,bs=-1e9;offer.forEach((c,i)=>{if(c.cout>S.mana)return;const f=c.fx;let v=(f.dmg||0)*(f.hits||1)+(f.direct||0)*1.3+(f.block||0)*0.8+(f.power||0)*1.2+((f.heal||0)+(f.healAll||0)*2)*(hurtMost<0.6?1.5:0.4)+g.rng();if(T[c.b].hp<=0)v-=5;if(v>bs){bs=v;best=i;}});
 const pos=hurtMost<0.5?0:Math.floor(g.rng()*(S.combat.length+1));
 return{pick:best,pos,fane:S.fane>0&&g.round>=3&&g.rng()<0.3};}
const API={BIBBITS,COMBOS,get EVEIL_MAX(){return EVEIL_MAX},MANA_CAP,newGame,playRound,draw3,commit,aiChoose,fxText,shuffle};
if(typeof module!=='undefined')module.exports=API;else root.Duel=API;
})(this);
