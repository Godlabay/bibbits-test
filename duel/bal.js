const fs=require('fs');const cfg=JSON.parse(process.argv[2]);let src=fs.readFileSync(__dirname+'/engine.js','utf8');
for(const k in cfg)src=src.split(k).join(cfg[k]);fs.writeFileSync('/tmp/eng_test.js',src);delete require.cache['/tmp/eng_test.js'];
const D=require('/tmp/eng_test.js');const K=Object.keys(D.BIBBITS);const st={};K.forEach(k=>st[k]={w:0,n:0});let r=[],dr=0;const N=+process.argv[3]||6000;
for(let n=0;n<N;n++){const p=()=>K[Math.random()*K.length|0];const A=[p(),p()],B=[p(),p()];const g=D.newGame(A,B);
 while(!g.over){D.playRound(g);if(g.over)break;for(const s of[0,1]){const o=D.draw3(g,s),a=D.aiChoose(g,s,o);D.commit(g,s,o,a.pick,a.pos,a.fane)}}
 r.push(g.round);if(g.winner==='nul')dr++;[A,B].forEach((T,s)=>new Set(T).forEach(k=>{if(g.winner==='nul')return;st[k].n++;if(g.winner===s)st[k].w++;}));}
r.sort((a,b)=>a-b);console.log('avg',(r.reduce((a,b)=>a+b)/N).toFixed(1),'med',r[N/2|0],'>30',(100*r.filter(x=>x>30).length/N).toFixed(1)+'%','draw',(100*dr/N).toFixed(1)+'%');
console.log(K.map(k=>k+' '+(100*st[k].w/st[k].n).toFixed(0)).join(' | '));
