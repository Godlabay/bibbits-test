const D=require('./engine.js');const ks=Object.keys(D.BIBBITS);let r={0:0,1:0,nul:0},rounds=0;
for(let n=0;n<2000;n++){const p=()=>ks[Math.floor(Math.random()*3)];const g=D.newGame([p(),p()],[p(),p()]);
 while(!g.over){D.playRound(g);if(g.over)break;for(const s of [0,1]){const o=D.draw3(g,s);const a=D.aiChoose(g,s,o);D.commit(g,s,o,a.pick,a.pos,a.fane);}
 g.sides.forEach(S=>{const tot=S.combat.length+S.reserve.length;if(tot<2)throw 'cards lost';});}
 r[g.winner]++;rounds+=g.round;}
console.log(r,'moy manches',rounds/2000);
