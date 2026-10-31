// Bibbits — Duel v7 : toute la ligne de combat rejoue à chaque manche, emplacement par emplacement.
(function(root,f){if(typeof module==='object')module.exports=f();else root.Duel=f();})(this,function(){
const H=(nom,f,el,hp,role,cartes,ult)=>({nom,el,hp,role,img:'img/heroes/'+f+'.webp',cartes,ult});
const BIBBITS={
 sylve:H('Sylve','ronceline','Sève',29,'Soigneuse · Relais',[
  ['Flèche de ronce',{dmg:3},1],['Sève vive',{heal:3},1],['Tir double',{dmg:2,hits:2},2],['Racines',{ally:4,heal:2},2],
  ['Flèche perçante',{pierce:5},3],['Floraison',{healAll:3},3],['Volée d\'épines',{dmg:3,hits:2,relais:2},4],['Arbre-mère',{healAll:4,shieldAll:3},5]],
  ['Pluie de ronces',{dmg:3,hits:3,healAll:5}]),
 marea:H('Maréa','lamecume','Eau',27,'Soutien · Élan',[
  ['Onde apaisante',{heal:4},1],['Bulle',{ally:5},1],['Vague',{dmg:3,relais:2},2],['Écume dorée',{elan:4,heal:2},2],
  ['Marée montante',{dmg:4,heal:3},3],['Courant porteur',{elan:6,ally:3},3],['Grand geyser',{dmg:5,splash:2},4],['Source sacrée',{healAll:5,shieldAll:4},5]],
  ['Raz-de-marée',{dmg:6,splash:4,healAll:5}]),
 brok:H('Brok','atrefeu','Braise',34,'Cogneur · gros coups',[
  ['Coup de marteau',{dmg:4},1],['Enclume levée',{block:5},1],['Forge ardente',{elan:3,block:2},2],['Braises',{pierce:3},2],
  ['Choc sismique',{dmg:5,block:3},3],['Enchaînement',{dmg:5,relais:3},3],['Frappe en fusion',{dmg:8},4],['Marteau titan',{dmg:10,block:3},5]],
  ['Marteau-volcan',{dmg:14,block:6}]),
 petrol:H('Pétrol','tisonnet','Braise',50,'Artificier · zone',[
  ['Pétard',{dmg:3,splash:2},1],['Mèche courte',{pierce:2},1],['Bombe collante',{dmg:3,splash:2},2],['Barricade',{block:3,ally:3},2],
  ['Grenade',{dmg:4,splash:3},3],['Atelier',{elan:4,block:3},3],['Baril explosif',{dmg:5,splash:4},4],['Feu d\'artifice',{dmg:4,hits:2,splash:4},5]],
  ['Méga-bombe',{dmg:8,splash:8}]),
 granit:H('Granit','caillouteux','Roc',35,'Tank · Provocation',[
  ['Coup de bouclier',{dmg:2,block:3},1],['Provocation',{guard:1,block:4},1],['Peau d\'épines',{block:3,thorns:1},2],['Charge',{dmg:5},2],
  ['Rempart',{shieldAll:4,guard:1},3],['Éboulement',{dmg:5,block:3},3],['Montagne vivante',{guard:1,block:7,thorns:2},4],['Séisme',{dmg:6,splash:4},5]],
  ['Cœur de granit',{guard:1,shieldAll:10,thorns:4}]),
 zephyr:H('Zéphyr','petardeau','Foudre',29,'Duelliste · Relais',[
  ['Étincelle',{dmg:3},1],['Pas éclair',{block:3,elan:2},1],['Riposte',{dmg:2,hits:2},2],['Décharge',{pierce:3,relais:2},2],
  ['Arc électrique',{dmg:3,splash:3},3],['Fente fulgurante',{dmg:2,hits:3},3],['Tonnerre',{dmg:6,relais:4},4],['Tempête',{dmg:3,hits:3,splash:3},5]],
  ['Jugement céleste',{dmg:4,hits:4,pierce:4}]),
 krom:H('Krom','frimousson','Givre',38,'Bête de givre · Gel',[
  ['Griffe glacée',{dmg:3},1],['Souffle froid',{chill:3,block:2},1],['Fourrure épaisse',{block:5,guard:1},2],['Morsure gelée',{dmg:3,chill:3},2],
  ['Blizzard',{dmg:3,splash:3,chill:2},3],['Rugissement',{chill:5,elan:3},3],['Avalanche',{dmg:7,chill:3},4],['Hiver éternel',{dmg:5,chill:6,guard:1,block:4},5]],
  ['Zéro absolu',{dmg:8,chill:10,block:6}]),
 aurel:H('Aurel','lumignon','Aube',40,'Paladin · protège son allié',[
  ['Coup de masse',{dmg:3},1],['Lueur',{heal:3,ally:2},1],['Bouclier d\'aube',{ally:5,guard:1},2],['Châtiment',{dmg:3,pierce:2},2],
  ['Lanterne bénie',{shieldAll:3,heal:3},3],['Frappe sacrée',{dmg:5,heal:3},3],['Aube nouvelle',{healAll:4,shieldAll:3},4],['Jugement doré',{dmg:7,heal:3,guard:1},5]],
  ['Soleil levant',{dmg:6,healAll:6,shieldAll:4}]),
 lune:H('Lune','ninnelune','Crépuscule',33,'Assassine · Relais',[
  ['Lame lunaire',{dmg:3,relais:2},1],['Esquive',{block:4},1],['Aiguise-lames',{elan:4,dmg:1},2],['Double entaille',{dmg:2,hits:2,relais:2},2],
  ['Dague perfide',{pierce:5},3],['Danse des lames',{dmg:2,hits:3,drain:1},3],['Croissant fendu',{dmg:6,relais:4},4],['Éclipse tranchante',{dmg:3,hits:4},5]],
  ['Nuit des mille lames',{dmg:3,hits:5,drain:1}]),
 nyx:H('Nyx','veillombre','Crépuscule',59,'Dragonne · garde du corps',[
  ['Griffe d\'ombre',{dmg:3},1],['Aile protectrice',{ally:5,guard:1},1],['Morsure',{dmg:3,drain:1},2],['Écailles',{block:4,thorns:2},2],
  ['Souffle nocturne',{dmg:3,splash:3},3],['Couvée',{shieldAll:4,heal:3},3],['Vol plané',{dmg:5,ally:4},4],['Souffle du néant',{dmg:5,splash:4,drain:1},5]],
  ['Ailes de la nuit',{guard:1,shieldAll:8,dmg:6,splash:4}])
};
const COMBOS=[['Eau','Braise','Vapeur',{dmg:2}],['Braise','Foudre','Surcharge',{dmg:3}],['Foudre','Eau','Électrocution',{pierce:2}],['Givre','Roc','Gel fracturé',{dmg:3}],
 ['Sève','Roc','Racines profondes',{block:3}],['Sève','Eau','Rosée',{heal:3}],['Givre','Foudre','Orage glacé',{dmg:2}],['Aube','Crépuscule','Éclipse',{pierce:2}],
 ['Roc','Braise','Magma',{dmg:3}],['Eau','Givre','Verglas',{chill:2}],['Braise','Sève','Cendres fertiles',{heal:3}],['Aube','Sève','Lumière vive',{heal:3}],
 ['Crépuscule','Givre','Nuit glaciale',{chill:2}],['Roc','Aube','Rempart sacré',{block:3}],['Foudre','Crépuscule','Orage noir',{dmg:2}]];
const P={BK:4,HPX:1.3,ULT:15,BRUME:7,MANA0:2,MANA_CAP:9};
let uid=0;
const mk=(b,el,c,ex)=>Object.assign({id:++uid,b,el,nom:c[0],fx:c[1],cout:c[2]||0},ex||{});
function shuffle(a,r){for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function newGame(A,B,rng){rng=rng||Math.random;
 const sides=[A,B].map(team=>{const t=team.map(k=>{const d=BIBBITS[k],hp=Math.round(d.hp*P.HPX);return{k,nom:d.nom,el:d.el,img:d.img,hp,max:hp,block:0,guard:0,thorns:0,ult:0,ultDone:false};});
  let res=[];team.forEach((k,i)=>BIBBITS[k].cartes.forEach(c=>res.push(mk(i,BIBBITS[k].el,c))));shuffle(res,rng);
  const line=[0,1].map(i=>{const c=res.find(c=>c.b===i&&c.cout===1);res.splice(res.indexOf(c),1);return c;});
  return{team:t,line,reserve:res,lastLine:[],mana:0,saved:0,offer:[],elan:0,chill:0,prev:null};});
 return{sides,round:0,over:false,winner:null,log:[],ev:[],rng};}
// ---- planification ----
function startPlanning(g){g.sides.forEach(S=>{S.mana=Math.min(P.MANA_CAP,P.MANA0+g.round)+S.saved;S.saved=0;S.offer=S.reserve.slice(0,3);});}
function buy(g,s,idx,pos){const S=g.sides[s];S.offer.forEach(c=>S.reserve.splice(S.reserve.indexOf(c),1));
 let c=null;if(idx>=0&&S.offer[idx]&&S.offer[idx].cout<=S.mana){c=S.offer[idx];S.mana-=c.cout;S.line.splice(Math.max(0,Math.min(pos,S.line.length)),0,c);}else S.saved=1;
 S.offer.forEach(x=>{if(x!==c)S.reserve.push(x);});S.offer=[];return c;}
const val=f=>(f.dmg||0)*(f.hits||1)+(f.pierce||0)*1.2+(f.splash||0)*.8+(f.block||0)*.7+(f.ally||0)*.8+(f.shieldAll||0)*1.4+(f.heal||0)*.9+(f.healAll||0)*1.7+(f.elan||0)*.8+(f.chill||0)*.8+(f.guard?2:0)+(f.thorns||0)*1.2+(f.relais||0)*.6+(f.drain?2:0);
const atk=f=>(f.dmg||0)*(f.hits||1)+(f.pierce||0)+(f.splash||0);
const def=f=>(f.block||0)+(f.ally||0)+(f.shieldAll||0)*2+(f.guard?4:0)+(f.chill||0)+(f.thorns||0);
// IA : contre la ligne adverse révélée (défense en face des grosses attaques), puis achète la meilleure carte abordable.
function aiPlan(g,s){const S=g.sides[s],O=g.sides[1-s],foe=O.lastLine.length?O.lastLine:O.line;
 const L=S.line.slice().sort((a,b)=>def(b.fx)-def(a.fx));const slots=[...Array(L.length).keys()].sort((a,b)=>atk((foe[b]||{fx:{}}).fx)-atk((foe[a]||{fx:{}}).fx));
 const nd=L.filter(c=>def(c.fx)>atk(c.fx)).length,out=Array(L.length);slots.slice(0,nd).forEach((sl,k)=>out[sl]=L[k]);let r=L.slice(nd);for(let i=0;i<out.length;i++)if(!out[i])out[i]=r.shift();
 // relais : essaye d'alterner les deux Bibbits
 S.line=out;let best=-1,bv=-1;S.offer.forEach((c,i)=>{if(c.cout<=S.mana){const v=val(c.fx)/(1+c.cout*.15);if(v>bv){bv=v;best=i;}}});
 if(best>=0&&S.offer[best].cout<S.mana-0&&S.offer.some(c=>c.cout===S.mana+1)&&g.rng()<.3)best=-1;
 const c=S.offer[best];let pos=S.line.length;if(c){if(def(c.fx)>atk(c.fx)){const sl=slots.find(x=>x<=S.line.length&&def((S.line[x]||{fx:{}}).fx)<def(c.fx));pos=sl==null?S.line.length:sl;}else{for(let i=0;i<=S.line.length;i++){const p=S.line[i-1];if(p&&p.b!==c.b&&(c.fx.relais||g.rng()<.4)){pos=i;break;}}}}
 buy(g,s,best,pos);}
// ---- combat ----
const ev=(g,e)=>g.ev.push(e),alive=T=>T.filter(t=>t.hp>0);
function checkEnd(g){for(let s=0;s<2;s++)if(!alive(g.sides[s].team).length){g.over=true;g.winner=1-s;g.log.push(s===1?'🏆 Victoire !':'💀 Défaite…');ev(g,{t:'end',w:1-s});return true;}return false;}
function hurt(g,s,tg,n,pierce,src){if(n<=0||tg.hp<=0)return 0;const T=g.sides[s].team;let ab=0;if(!pierce){ab=Math.min(tg.block,n);tg.block-=ab;}const d=Math.min(tg.hp,n-ab);tg.hp-=d;
 if(!tg.ultDone)tg.ult=Math.min(P.ULT,tg.ult+d);ev(g,{t:'dmg',s,i:T.indexOf(tg),n:d,blocked:ab,hp:tg.hp,block:tg.block,ult:tg.ult,pierce:!!pierce,src});if(tg.hp<=0){ev(g,{t:'ko',s,i:T.indexOf(tg)});g.log.push('  ☠ '+tg.nom+' est K.-O.');}return d;}
function target(O,oppCard){const A=alive(O.team);if(!A.length)return null;const gd=A.find(t=>t.guard);if(gd)return gd;if(oppCard&&O.team[oppCard.b].hp>0)return O.team[oppCard.b];return A.sort((a,b)=>a.hp/a.max-b.hp/b.max)[0];}
function play(g,s,c,opp){const S=g.sides[s],O=g.sides[1-s],T=S.team,me=T[c.b];
 if(me.hp<=0){ev(g,{t:'fizzle',s,c});g.log.push('  '+c.nom+' ne joue pas ('+me.nom+' est K.-O.)');S.prev=c;return;}
 const fx=Object.assign({},c.fx),tags=[];const ally=S.prev&&S.prev.b!==c.b&&T[S.prev.b].hp>0&&S.prev.el!==undefined;
 if(ally){if(fx.relais){fx.dmg=(fx.dmg||0)+fx.relais;tags.push('Relais +'+fx.relais);}
  if(S.prev.el!==c.el)for(const k of COMBOS)if((k[0]===S.prev.el&&k[1]===c.el)||(k[1]===S.prev.el&&k[0]===c.el)){for(const x in k[3])fx[x]=(fx[x]||0)+k[3][x];tags.push('Combo '+k[2]);break;}}
 if(fx.relais&&!ally)delete fx.relais;
 if(S.elan&&(fx.dmg||fx.pierce)){if(fx.dmg)fx.dmg+=S.elan;else fx.pierce+=S.elan;tags.push('Élan +'+S.elan);ev(g,{t:'elanUse',s});S.elan=0;}
 if(S.chill&&(fx.dmg||fx.pierce)){const k=S.chill;if(fx.dmg)fx.dmg=Math.max(0,fx.dmg-k);else fx.pierce=Math.max(0,fx.pierce-k);tags.push('Gelé −'+k);ev(g,{t:'chillUse',s});S.chill=0;}
 ev(g,{t:'play',s,c,i:c.b,tags,fx});g.log.push((s===0?'Toi':'IA')+' · '+me.nom+' : « '+c.nom+' »'+(tags.length?' ['+tags.join(', ')+']':''));
 const mate=T.find((t,j)=>j!==c.b&&t.hp>0)||me;
 if(fx.guard){me.guard=1;ev(g,{t:'guard',s,i:c.b});}
 if(fx.block){me.block+=fx.block;ev(g,{t:'block',s,i:c.b,n:fx.block,v:me.block});}
 if(fx.ally){mate.block+=fx.ally;ev(g,{t:'block',s,i:T.indexOf(mate),n:fx.ally,v:mate.block,from:c.b});}
 if(fx.shieldAll)alive(T).forEach(t=>{t.block+=fx.shieldAll;ev(g,{t:'block',s,i:T.indexOf(t),n:fx.shieldAll,v:t.block});});
 if(fx.thorns){me.thorns+=fx.thorns;ev(g,{t:'thorns',s,i:c.b,n:fx.thorns});}
 const heal=(t,n)=>{const h=Math.min(n,t.max-t.hp);t.hp+=h;ev(g,{t:'heal',s,i:T.indexOf(t),n:h,hp:t.hp});};
 if(fx.heal)heal(alive(T).sort((a,b)=>a.hp/a.max-b.hp/b.max)[0],fx.heal);
 if(fx.healAll)alive(T).forEach(t=>heal(t,fx.healAll));
 if(fx.elan){S.elan+=fx.elan;ev(g,{t:'elan',s,n:S.elan});}
 if(fx.chill){O.chill+=fx.chill;ev(g,{t:'chill',s:1-s,n:O.chill});}
 const hit=(n,pierce)=>{const tg=target(O,opp);if(!tg)return;ev(g,{t:'lunge',s,i:c.b,ts:1-s,ti:O.team.indexOf(tg)});const d=hurt(g,1-s,tg,n,pierce,c.b);if(fx.drain&&d>0)heal(me,Math.ceil(d/2));if(tg.thorns&&me.hp>0)hurt(g,s,me,tg.thorns,true);return tg;};
 let last=null;for(let h=0;h<(fx.hits||(fx.dmg?1:0));h++){last=hit(fx.dmg,false)||last;if(g.over||checkEnd(g))return;}
 if(fx.pierce){last=hit(fx.pierce,true)||last;if(checkEnd(g))return;}
 if(fx.splash){const tg=alive(O.team).find(t=>t!==last)||null;if(tg){hurt(g,1-s,tg,fx.splash,false,c.b);if(checkEnd(g))return;}}
 S.prev=c;}
function playRound(g){if(g.over)return;g.round++;g.ev=[];g.log.push('— Manche '+g.round+' —');
 g.sides.forEach(S=>{S.prev=null;S.lastLine=S.line.slice();});ev(g,{t:'round',r:g.round});
 const n=Math.max(g.sides[0].line.length,g.sides[1].line.length);
 for(let i=0;i<n&&!g.over;i++){const c=g.sides.map(S=>S.line[i]||null);ev(g,{t:'slot',i,c});
  let ord=[0,1].filter(s=>c[s]);if(ord.length===2){const d=c[0].cout-c[1].cout;ord=d<0?[0,1]:d>0?[1,0]:((g.round+i)%2?[0,1]:[1,0]);}
  for(const s of ord){if(g.over)break;play(g,s,c[s],c[1-s]);}ev(g,{t:'slotEnd',i});}
 if(!g.over&&g.round>=P.BRUME){const n=P.BK*(g.round-P.BRUME+1);ev(g,{t:'brume',n});g.log.push('☁ Brume du Fané : '+n+' dégâts perçants à chaque Bibbit.');
  for(const s of (g.round%2?[0,1]:[1,0]))for(const t of alive(g.sides[s].team)){hurt(g,s,t,n,true);if(checkEnd(g))break;}}
 // fin de manche : boucliers, provocation, élan, gel s'effacent ; l'Ultime chargé entre en tête de ligne ; les Ultimes joués partent.
 g.sides.forEach((S,s)=>{S.line=S.line.filter(c=>!c.ultime);S.elan=0;S.chill=0;S.team.forEach((t,i)=>{t.block=0;t.guard=0;t.thorns=0;
  if(!g.over&&t.hp>0&&!t.ultDone&&t.ult>=P.ULT){t.ultDone=true;const u=BIBBITS[t.k].ult;S.line.unshift(mk(i,t.el,[u[0],u[1],0],{ultime:true}));ev(g,{t:'ult',s,i,nom:u[0]});g.log.push('✨ '+t.nom+' : Ultime « '+u[0]+' » prêt pour la prochaine manche !');}});});
 ev(g,{t:'roundEnd'});}
function fxText(f){const p=[];if(f.dmg)p.push('Attaque '+(f.hits?f.hits+' × ':'')+f.dmg);if(f.pierce)p.push('Perce '+f.pierce+' (ignore le bouclier)');if(f.splash)p.push('Éclat '+f.splash+' sur l\'autre ennemi');
 if(f.block)p.push('Bouclier '+f.block+' sur soi');if(f.ally)p.push('Protège l\'allié : bouclier '+f.ally);if(f.shieldAll)p.push('Bouclier '+f.shieldAll+' à toute l\'équipe');if(f.guard)p.push('Provocation : attire toutes les attaques ennemies jusqu\'à la fin de la manche');
 if(f.thorns)p.push('Épines '+f.thorns+' : renvoie '+f.thorns+' à chaque coup reçu');if(f.heal)p.push('Soin '+f.heal+' à l\'allié le plus blessé');if(f.healAll)p.push('Soin '+f.healAll+' à toute l\'équipe');
 if(f.elan)p.push('Élan '+f.elan+' : +'+f.elan+' à la prochaine attaque alliée');if(f.chill)p.push('Gel '+f.chill+' : −'+f.chill+' à la prochaine attaque ennemie');if(f.relais)p.push('Relais +'+f.relais+' si la carte d\'avant vient de ton allié');if(f.drain)p.push('Vol de vie : se soigne de la moitié des dégâts');return p.join(' · ');}
return{BIBBITS,COMBOS,P,newGame,startPlanning,buy,aiPlan,playRound,fxText,shuffle,val,atk,def};});
