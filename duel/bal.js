// node bal.js [N] [json overrides de Duel.P] — simulation IA contre IA
const D=require('./engine.js');const N=+process.argv[2]||4000;Object.assign(D.P,JSON.parse(process.argv[3]||'{}'));
const K=Object.keys(D.BIBBITS),w={},n={};K.forEach(k=>{w[k]=0;n[k]=0});let R=[],S=[],draws=0;
for(let i=0;i<N;i++){const A=[K[i%10],K[(Math.random()*10)|0]],B=[K[(Math.random()*10)|0],K[(Math.random()*10)|0]];const g=D.newGame(A,B);let slots=0;
 while(!g.over&&g.round<40){D.startPlanning(g);if(g.round>0){D.aiPlan(g,0);D.aiPlan(g,1);}else g.sides.forEach((S,s)=>D.aiPlan(g,s));slots+=Math.max(g.sides[0].line.length,g.sides[1].line.length);D.playRound(g);}
 R.push(g.round);S.push(slots);if(!g.over){draws++;continue;}const W=[A,B][g.winner],L=[A,B][1-g.winner];new Set(W).forEach(k=>{w[k]++;n[k]++});new Set(L).forEach(k=>n[k]++);}
R.sort((a,b)=>a-b);console.log('max',R[R.length-1]);S.sort((a,b)=>a-b);const av=a=>(a.reduce((x,y)=>x+y,0)/a.length).toFixed(1);
console.log('manches moy',av(R),'méd',R[N>>1],'p10',R[N/10|0],'p90',R[N*.9|0],'| emplacements moy',av(S),'| nuls',(100*draws/N).toFixed(2)+'%');
console.log(K.map(k=>k+' '+(100*w[k]/n[k]).toFixed(1)).join('  '));
