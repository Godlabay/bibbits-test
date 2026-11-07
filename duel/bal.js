// node bal.js [N] [json overrides de Duel.P] [--trace]
// Simule des duels IA contre IA. Les échanges coûtent : 2 gratuits, puis 1 mana.
const args=process.argv.slice(2).filter(a=>a!=='--trace');
const trace=process.argv.includes('--trace');
const D=require('./engine.js');const N=+args[0]||4000;Object.assign(D.P,JSON.parse(args[1]||'{}'));
const K=Object.keys(D.BIBBITS),w={},n={};K.forEach(k=>{w[k]=0;n[k]=0});let R=[],S=[],draws=0,swapU=0,swapP=0,rounds=0;
function checkSide(S){if((S.mana||0)<0)throw new Error('mana négative');
 const used=S.swapUsed||0,paid=S.swapPaid||0;
 if(paid!==Math.max(0,used-D.P.SWAP_FREE))throw new Error('échanges payants incohérents '+used+'/'+paid);
 if(paid*D.P.SWAP_COST>20)throw new Error('trop d\'échanges payants');}
for(let i=0;i<N;i++){const A=[K[i%10],K[(Math.random()*10)|0]],B=[K[(Math.random()*10)|0],K[(Math.random()*10)|0]];const g=D.newGame(A,B);let slots=0;
 while(!g.over&&g.round<40){D.startPlanning(g);D.aiPlan(g,0);D.aiPlan(g,1);g.sides.forEach(checkSide);
  g.sides.forEach(S=>{swapU+=S.swapUsed||0;swapP+=S.swapPaid||0;});rounds++;
  slots+=Math.max(g.sides[0].line.length,g.sides[1].line.length);D.playRound(g);}
 R.push(g.round);S.push(slots);if(!g.over){draws++;continue;}const W=[A,B][g.winner],L=[A,B][1-g.winner];new Set(W).forEach(k=>{w[k]++;n[k]++});new Set(L).forEach(k=>n[k]++);}
R.sort((a,b)=>a-b);console.log('max',R[R.length-1]);S.sort((a,b)=>a-b);const av=a=>(a.reduce((x,y)=>x+y,0)/a.length).toFixed(1);
console.log('manches moy',av(R),'méd',R[N>>1],'p10',R[N/10|0],'p90',R[N*.9|0],'| emplacements moy',av(S),'| nuls',(100*draws/N).toFixed(2)+'%');
console.log('échanges / manche (2 camps)',(swapU/rounds).toFixed(2),'dont payants',(swapP/rounds).toFixed(2));
console.log(K.map(k=>k+' '+(100*w[k]/n[k]).toFixed(1)).join('  '));
// Règle des échanges, hors partie : 6 cartes inversées, 1 mana → 2 gratuits + 1 payant.
function selfCheck(){const g=D.newGame(['lune','zephyr'],['nyx','aurel'],()=>0.2);D.startPlanning(g);const S=g.sides[0];
 while(S.line.length<6&&S.reserve.length)S.line.push(S.reserve.pop());
 const orig=S.line.slice(),ideal=orig.slice().reverse(),need=D.cycleSwaps(orig,ideal);
 if(need!==3)throw new Error('cycleSwaps reverse6 = '+need);
 const run=(mana,reserve)=>{S.line=orig.slice();S.mana=mana;return D.reorderBudget(S,ideal,reserve);};
 run(0,0);if(S.swapUsed!==2||S.swapPaid!==0||S.mana!==0)throw new Error('budget 0 mana '+S.swapUsed+'/'+S.swapPaid);
 if(!S.line.some((c,i)=>c!==ideal[i]))throw new Error('0 mana ne doit pas tout réordonner');
 run(1,0);if(S.swapUsed!==3||S.swapPaid!==1||S.mana!==0)throw new Error('budget 1 mana '+S.swapUsed+'/'+S.swapPaid+' m'+S.mana);
 if(S.line.some((c,i)=>c!==ideal[i]))throw new Error('ordre incomplet avec 1 mana');
 run(3,2);if(S.mana!==2||S.swapPaid!==1||S.line.some((c,i)=>c!==ideal[i]))throw new Error('réserve mana achat '+S.mana+'/'+S.swapPaid);
 console.log('selfcheck échanges OK (besoin',need+', gratuits 2, extra 1 mana)');}
selfCheck();
if(trace){const g=D.newGame(['granit','brok'],['krom','zephyr']);let guard=0;
 while(!g.over&&g.round<40&&guard++<45){D.startPlanning(g);D.aiPlan(g,0);D.aiPlan(g,1);g.sides.forEach(checkSide);
  g.sides.forEach((S,s)=>console.log('R'+(g.round+1),'camp'+s,'mana',S.mana,'éch',(S.swapUsed||0)+'/'+(S.swapPaid||0),'ligne',S.line.map(c=>c.nom).join(' · ')));
  D.playRound(g);if(!Array.isArray(g.ev))throw new Error('events');g.ev.forEach(e=>{if(!e.t)throw new Error('event sans type');});}
 console.log(g.log.join('\n'));console.log('FIN gagnant',g.winner,'manches',g.round,'over',g.over,'events dernière manche',g.ev.length);
 if(!g.over){console.error('partie non terminée');process.exit(1);}}
