/* Snippets run in the browser (logged in to ridewithgps.com, on a ridewithgps.com page).
   They return text/JSON that is then saved and processed with the Python tools. */

/* 1. List every route in the account (the list page is virtualised: scroll and collect).
      Open https://ridewithgps.com/routes first. */
const sc=[...document.querySelectorAll('*')].find(e=>e.scrollHeight>e.clientHeight+50 && getComputedStyle(e).overflowY.match(/auto|scroll/));
sc.scrollTop=0; await new Promise(r=>setTimeout(r,800)); const m=new Map();
for(let i=0;i<80;i++){ document.querySelectorAll('a[href*="/routes/"]').forEach(a=>{const id=(a.getAttribute('href').match(/routes\/(\d+)/)||[])[1]; if(id&&!m.has(id)) m.set(id,(a.closest('li,tr')||a.parentElement).innerText.replace(/\n+/g,' · '));});
  sc.scrollTop+=sc.clientHeight*0.7; await new Promise(r=>setTimeout(r,400)); if(sc.scrollTop+sc.clientHeight>=sc.scrollHeight-2&&i>2) break; }
[...m].map(([k,v])=>k+' :: '+v).join('\n');

/* 2. Details + simplified, polyline-encoded track (one point every 300 m) for a list of route ids. */
const d=(a,b,c,e)=>{const t=Math.PI/180,x=(e-b)*t*Math.cos((a+c)/2*t),y=(c-a)*t;return 6371*Math.hypot(x,y)};
function enc(pts){let o='',pl=0,pn=0;const e=v=>{v=v<0?~(v<<1):(v<<1);let s='';while(v>=0x20){s+=String.fromCharCode((0x20|(v&0x1f))+63);v>>=5;}return s+String.fromCharCode(v+63)};for(const [la,lo] of pts){const a=Math.round(la*1e5),b=Math.round(lo*1e5);o+=e(a-pl)+e(b-pn);pl=a;pn=b;}return o}
async function routeInfo(id){ const j=await fetch(`/routes/${id}.json`).then(r=>r.json()); const r=j.route||j; const tp=r.track_points;
  const o=[[tp[0].y,tp[0].x]]; let last=o[0]; for(const p of tp){ if(d(last[0],last[1],p.y,p.x)>=0.3){o.push([p.y,p.x]);last=[p.y,p.x];}} o.push([tp.at(-1).y,tp.at(-1).x]);
  return {id,name:r.name,km:+(r.distance/1000).toFixed(1),m:Math.round(r.elevation_gain),loc:r.locality,enc:enc(o)}; }
/* e.g.  JSON.stringify(await routeInfo('57200589')) */

/* 3. Which side a route climbs a pass from: nearest track point to the summit, then the climbing
      (sum of rises, and net height difference) over the 6 km before it. Summit list: see climb_sides.py. */
async function climbSides(id,S){ const j=await fetch(`/routes/${id}.json`).then(r=>r.json()); const tp=(j.route||j).track_points;
  const cum=[0]; for(let i=1;i<tp.length;i++) cum.push(cum[i-1]+d(tp[i-1].y,tp[i-1].x,tp[i].y,tp[i].x)); const out=[];
  for(const [n,[la,lo]] of Object.entries(S)){ const ds=tp.map(p=>d(la,lo,p.y,p.x)); const idx=[];
    for(let i=0;i<tp.length;i++){ if(ds[i]<0.6){ if(!idx.length||cum[i]-cum[idx.at(-1)]>3) idx.push(i); else if(ds[i]<ds[idx.at(-1)]) idx[idx.length-1]=i; } }
    for(const i of idx){ let b=i; while(b>0&&cum[i]-cum[b]<6) b--; let g=0; for(let t=b+1;t<=i;t++){const de=(tp[t].e||0)-(tp[t-1].e||0); if(de>0) g+=de;}
      out.push([id,n,+cum[i].toFixed(1),Math.round(tp[i].e-tp[b].e),Math.round(g),tp[b].y.toFixed(4),tp[b].x.toFixed(4)]); } }
  return out; }
