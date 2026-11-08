// node bal.js [N] — IA contre IA, 6 tours, ligne partagée.
const D=require('./engine.js');
const N=+process.argv[2]||3000;
const t=Date.now();
const r=D.sim(N);
r.rates.sort((a,b)=>b.wr-a.wr);
console.log('parties',N,'nulles',(100*r.draws/N).toFixed(2)+'%','en',((Date.now()-t)/1000).toFixed(2)+'s');
console.log(r.rates.map(x=>x.k+' '+x.wr.toFixed(1)).join('  '));
// Une partie complète, pour vérifier qu'aucune manche ne jette.
const g=D.create(['brok','granit'],['lune','nyx']);
const log=[];
while(!g.over){
  const mine=D.aiChoose(g,'you');
  const step=D.playTurn(g,mine);
  log.push('T'+step.turn+' '+(step.you?step.you.fr:'—')+' vs '+(step.foe?step.foe.fr:'—')+' → '+step.score.join('-'));
}
console.log(log.join('\n'));
console.log('FIN',g.winner,D.score(g).join('-'),'cartes',g.you.line.length,g.foe.line.length);
if(!g.over||g.you.line.length+g.foe.line.length<2){console.error('partie incomplète');process.exit(1);}
const bad=r.rates.filter(x=>x.wr<42||x.wr>58);
if(bad.length){console.error('hors fenêtre',bad.map(x=>x.k+' '+x.wr.toFixed(1)).join(', '));process.exit(2);}
console.log('équilibre OK');
