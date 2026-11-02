/* Mirava \u2013 "Find your ride" cards and highlights map for www.mirava.travel/bike-routes
   Data: bike-routes-data.json in this repository (generated from the Mirava itineraries spreadsheet).
   Usage in Squarespace (code block):  <div id="mv-fyr"></div><script src="https://cdn.jsdelivr.net/gh/mirava-travel/mirava-website-data@main/bike-routes.js"></script> */
(function(){
  var root=document.getElementById('mv-fyr'); if(!root||root.dataset.ready) return; root.dataset.ready='1';
  var BASE='https://cdn.jsdelivr.net/gh/mirava-travel/mirava-website-data@main/';
  var st=document.createElement('style'); st.textContent="\n/* Layout: the Mirava page itself \u2013 yellow page, white cards, dark-green type. Question cards on top, map + detail panel below. */\n#mv-fyr{\n  --page:#FAF1AC; --ink:#003B2A; --green:#499F68; --mint:#EAF5EE; --card:#FFFFFF; --muted:#4F6B60; --line:#D9D08A;\n  --sea:#DCEBEA; --land:#F7F3E3; --route:#9DB8A9;\n  --c-climb:#B8532F; --c-view:#2F6E9E; --c-nature:#3F8F5C; --c-village:#7E4F93; --c-arch:#8A6A35; --c-cafe:#003B2A;\n  --f-body:\"Inter\",system-ui,-apple-system,\"Segoe UI\",sans-serif;\n  --f-label:\"Inconsolata\",ui-monospace,\"SFMono-Regular\",Menlo,monospace;\n  color-scheme:light;\n}\n#mv-fyr a{color:var(--ink)}\n#mv-fyr header.top{padding-block:28px 8px}\n#mv-fyr .eyebrow{font-family:var(--f-label);font-size:14px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin:0 0 6px}\n#mv-fyr h1.mv-h1{font-weight:400;font-size:clamp(26px,3.4vw,34px);line-height:1.2;margin:0 0 10px;text-wrap:balance}\n#mv-fyr h2{font-weight:400;font-size:clamp(22px,2.6vw,28px);margin:0 0 8px;text-wrap:balance}\n#mv-fyr h3{font-weight:500;font-size:19px;margin:0;text-wrap:balance}\n#mv-fyr .lede{max-width:66ch;margin:0;font-size:18px}\n#mv-fyr hr.rule{border:0;height:2px;background:var(--green);margin:28px 0}\n\n/* question cards */\n#mv-fyr .qgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;margin-top:18px}\n#mv-fyr .q{background:var(--card);border-radius:10px;padding:18px 18px 16px;display:flex;flex-direction:column;gap:10px;min-width:0;border:2px solid transparent;transition:border-color .15s}\n#mv-fyr .q.on{border-color:var(--green)}\n#mv-fyr .q .qh{display:flex;align-items:center;gap:10px}\n#mv-fyr .q .dot{width:28px;height:28px;border-radius:50%;flex:none;display:grid;place-items:center}\n#mv-fyr .q .dot svg{width:16px;height:16px}\n#mv-fyr .q p{margin:0;font-size:15px;color:var(--muted)}\n#mv-fyr .chips{display:flex;flex-wrap:wrap;gap:6px}\n#mv-fyr .chip{font-family:var(--f-label);font-size:14px;line-height:1.2;border:1px solid #C9D9CF;background:var(--mint);color:var(--ink);border-radius:999px;padding:5px 10px;cursor:pointer;text-align:left}\n#mv-fyr .chip:hover,#mv-fyr .chip:focus-visible{border-color:var(--ink);outline:none}\n#mv-fyr .chip.sel{background:var(--ink);color:#fff;border-color:var(--ink)}\n#mv-fyr .chip b{font-weight:600;opacity:.65;margin-left:4px}\n#mv-fyr .q .show{margin-top:auto;align-self:flex-start;font-family:var(--f-label);font-size:14px;background:none;border:0;border-bottom:1.5px solid var(--green);padding:2px 0;cursor:pointer;color:var(--ink)}\n#mv-fyr .season{background:var(--mint);border-radius:10px;padding:14px 18px;margin-top:16px;display:flex;flex-wrap:wrap;gap:6px 18px;align-items:baseline;font-size:15px}\n#mv-fyr .season strong{font-weight:500}\n\n/* map + panel */\n#mv-fyr .mapzone{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:16px;margin-top:18px;align-items:start}\n@media (max-width:860px){#mv-fyr .mapzone{grid-template-columns:1fr}}\n#mv-fyr .mapcard{background:var(--card);border-radius:10px;padding:10px;min-width:0}\n#mv-fyr .filters{display:flex;flex-wrap:wrap;gap:6px;padding:4px 4px 10px}\n#mv-fyr .filters .chip{display:inline-flex;align-items:center;gap:6px}\n#mv-fyr .filters .sw{width:10px;height:10px;border-radius:50%;display:inline-block}\n#mv-fyr #mv-map{height:560px;border-radius:6px;background:var(--sea)}\n@media (max-width:600px){#mv-fyr #mv-map{height:430px}}\n#mv-fyr .legend{font-family:var(--f-label);font-size:13px;color:var(--muted);padding:8px 4px 2px;display:flex;flex-wrap:wrap;gap:4px 16px}\n#mv-fyr .panel{background:var(--card);border-radius:10px;padding:18px;min-width:0;max-height:640px;overflow:auto}\n#mv-fyr .panel .kicker{font-family:var(--f-label);font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}\n#mv-fyr .panel h3{font-size:21px;margin:4px 0 6px}\n#mv-fyr .panel p{margin:0 0 12px;font-size:15px}\n#mv-fyr .rlist{list-style:none;margin:0 0 14px;padding:0;display:flex;flex-direction:column;gap:2px}\n#mv-fyr .rlist li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:baseline;padding:7px 8px;border-radius:6px;cursor:pointer}\n#mv-fyr .rlist li:hover,#mv-fyr .rlist li.hot{background:var(--mint)}\n#mv-fyr .rlist .rn{font-size:15px;font-weight:400;min-width:0}\n#mv-fyr .rlist .rs{font-family:var(--f-label);font-size:13px;color:var(--muted);white-space:nowrap;font-variant-numeric:tabular-nums}\n#mv-fyr .rlist .sec{display:block;font-family:var(--f-label);font-size:12px;color:var(--muted)}\n#mv-fyr .rlist a{font-family:var(--f-label);font-size:13px}\n#mv-fyr .sub{font-family:var(--f-label);font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin:10px 0 4px}\n#mv-fyr .hlchips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}\n#mv-fyr .side{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:500;margin:12px 0 2px}\n#mv-fyr .side b{font-family:var(--f-label);font-weight:500;color:var(--muted)}\n#mv-fyr .sw2{width:18px;height:4px;border-radius:2px;flex:none}\n#mv-fyr .empty{color:var(--muted);font-size:15px}\n#mv-fyr .note{font-size:14px;color:var(--muted);margin-top:14px;max-width:80ch}\n\n/* leaflet bits */\n#mv-fyr .leaflet-container{font-family:var(--f-body);background:var(--sea)}\n#mv-fyr .town{font-family:var(--f-label);font-size:12px;color:#5d6f66;white-space:nowrap;text-shadow:0 0 3px var(--land),0 0 3px var(--land)}\n#mv-fyr .hotel{width:12px;height:12px;background:var(--page);border:2px solid var(--ink);border-radius:2px}\n#mv-fyr .pin{width:26px;height:26px;border-radius:50%;border:2px solid #fff;display:grid;place-items:center;box-shadow:0 1px 3px rgba(0,0,0,.35);cursor:pointer}\n#mv-fyr .pin svg{width:14px;height:14px}\n#mv-fyr .pin.sel{transform:scale(1.25);box-shadow:0 0 0 3px var(--ink)}\n#mv-fyr .leaflet-tooltip{font-family:var(--f-label);font-size:13px}\n@media (prefers-reduced-motion:reduce){*{transition:none!important}}\n\n#mv-fyr{font-family:var(--f-body);font-weight:300;color:var(--ink);line-height:1.55}\n#mv-fyr *,#mv-fyr *::before,#mv-fyr *::after{box-sizing:border-box}\n#mv-fyr button{font:inherit}\n#mv-fyr .chip,#mv-fyr .q .show{font-family:var(--f-label)}\n#mv-fyr .leaflet-control-attribution{font-family:var(--f-label);font-size:11px}\n#mv-fyr .mv-loading{font-family:var(--f-label);color:var(--muted);padding:20px 0}\n"; document.head.appendChild(st);
  if(!document.querySelector('link[href*="leaflet@1.9.4"],link[href*="leaflet/1.9.4"]')){var lk=document.createElement('link');lk.rel='stylesheet';lk.href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';document.head.appendChild(lk);}
  root.innerHTML="\n\n<div>\n  \n\n  <header class=\"top\">\n    <p class=\"eyebrow\">Find your ride</p>\n    <h2 class=\"mv-h1\" style=\"font-size:clamp(26px,3.4vw,34px);line-height:1.2;margin:0 0 10px\">What are you looking for on the bike?</h2>\n    <p class=\"lede\">Pick what matters to you and we'll show you which routes take you there: the famous climbs, the best views, flat roads by the sea or a village caf\u00e9 halfway round.</p>\n  </header>\n\n  <section class=\"qgrid\" id=\"mv-qgrid\" aria-label=\"Route categories\"></section>\n\n  <div class=\"season\" id=\"mv-season\"></div>\n\n  <hr class=\"rule\">\n\n  <section>\n    <p class=\"eyebrow\">Highlights map</p>\n    <h2>Every highlight, and the routes that pass it</h2>\n    <p class=\"lede\" style=\"font-size:16px\">Tap a marker to see which routes pass it. For the climbs, the routes are grouped by the side they climb from. Tap any road on the map to see every route that passes that spot. Routes not shown on this page are linked to Ride with GPS.</p>\n    <div class=\"mapzone\">\n      <div class=\"mapcard\">\n        <div class=\"filters\" id=\"mv-filters\" role=\"group\" aria-label=\"Show on map\"></div>\n        <div id=\"mv-map\" role=\"application\" aria-label=\"Map of cycling highlights\"></div>\n        <div class=\"legend\"><span>\u25a0 Mirava hotels</span><span>\u2014 all routes</span><span style=\"color:var(--ink)\">\u2501 selected routes</span></div>\n      </div>\n      <aside class=\"panel\" id=\"mv-panel\" aria-live=\"polite\"></aside>\n    </div>\n  </section>\n</div>\n\n";
  function loadLeaflet(cb){ if(window.L) return cb(); var s=document.createElement('script'); s.src='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'; s.onload=cb; document.head.appendChild(s); }
  loadLeaflet(function(){
    fetch(BASE+'bike-routes-data.json').then(function(r){return r.json()}).then(run)
      .catch(function(){ var p=document.getElementById('mv-panel'); if(p) p.textContent='The map could not be loaded. Please try again later.'; });
  });
  function run(D){


const ICON = {
  climb:'<path d="M1 14 L6 5 L9 10 L11 7 L15 14 Z" fill="#fff"/>',
  view:'<path d="M1 8 C4 3 12 3 15 8 C12 13 4 13 1 8 Z" fill="none" stroke="#fff" stroke-width="1.6"/><circle cx="8" cy="8" r="2.3" fill="#fff"/>',
  nature:'<path d="M3 13 C3 6 8 2 14 2 C14 9 10 13 3 13 Z" fill="#fff"/><path d="M3 13 L9 7" stroke="currentColor" stroke-width="1.2"/>',
  village:'<path d="M2 8 L8 3 L14 8 V14 H2 Z" fill="#fff"/><rect x="6.5" y="9.5" width="3" height="4.5" fill="currentColor"/>',
  arch:'<path d="M3 14 V5 L4.5 3 L6 5 V7 H10 V5 L11.5 3 L13 5 V14 H10 V11 A2 2 0 0 0 6 11 V14 Z" fill="#fff"/>',
  cafe:'<path d="M2 5 H12 V9 A4 4 0 0 1 8 13 H6 A4 4 0 0 1 2 9 Z" fill="#fff"/><path d="M12 6 H13.5 A1.8 1.8 0 0 1 13.5 9.6 H12" fill="none" stroke="#fff" stroke-width="1.4"/>',
  route:'<path d="M2 12 C5 2 9 14 14 4" fill="none" stroke="#fff" stroke-width="2"/>',
  pro:'<path d="M3 2 V14 M3 2 H13 L11 5 L13 8 H3" fill="none" stroke="#fff" stroke-width="1.6"/>'
};
const KIND = {
  "Famous climbs":"climb","Local climbs":"climb","Great views":"view","Beautiful nature":"nature",
  "Villages, wine and culture":"village","Architecture":"arch","Cycling caf\u00e9s and restaurants":"cafe"
};
const COLOR = {climb:'var(--c-climb)',view:'var(--c-view)',nature:'var(--c-nature)',village:'var(--c-village)',arch:'var(--c-arch)',cafe:'var(--c-cafe)',route:'var(--green)',pro:'var(--ink)'};
const HEX = {climb:'#B8532F',view:'#2F6E9E',nature:'#3F8F5C',village:'#7E4F93',arch:'#8A6A35',cafe:'#003B2A'};

const R = D.routes;
const isWeb = id => R[id] && R[id].s !== 'Not on website';
const rate = id => R[id].m / R[id].km;
D.hl.forEach((h,i)=>{h.id=i; h.k=KIND[h.t]; h.r.sort((a,b)=> (isWeb(b)-isWeb(a)) || R[a].km-R[b].km);});
const byName = n => D.hl.find(h=>h.n===n);
/* routes that actually climb a pass (from the side analysis); others only pass over it */
const climbers = h => { const s=D.sides[h.n]; if(!s) return h.r; return h.r.filter(id=>!s[id] || s[id].some(x=>x[1])); };
const cnt = h => climbers(h).length;
const SIDE_COL = ['#003B2A','#2F6E9E','#B8532F','#7E4F93'];

const flat = Object.keys(R).filter(id=>rate(id)<=10 && R[id].km<=80).sort((a,b)=>(isWeb(b)-isWeb(a))||R[a].km-R[b].km);
const rolling = Object.keys(R).filter(id=>rate(id)>10 && rate(id)<=15 && R[id].km<=60).sort((a,b)=>(isWeb(b)-isWeb(a))||R[a].km-R[b].km);
const pros = Object.keys(R).filter(id=>/Vuelta|Gran Fondo|Aitana Tour|La Gamba/.test(R[id].n));

const CLIMB_ORDER = ['Coll de Rates','Xorret de Cat\u00ed','Vall d\'Ebo','Port de Tudons','Port de la Carrasqueta','Port de Confrides','Port de Benifallim','Port de B\u00e8rnia','Cumbre del Sol (Puig de la Lloren\u00e7a)','T\u00e0rbena','Port de Tollos'];
const CARDS = [
  {k:'climb', q:'Looking for an iconic climb?', p:'Coll de Rates, Xorret de Cat\u00ed, Vall d\'Ebo and the passes the pros train on in winter.', types:['Famous climbs','Local climbs'], order:CLIMB_ORDER, max:11},
  {k:'route', q:'Looking for rolling terrain?', p:'10\u201315 m of climbing per km: short ups and downs through vineyards and orange groves, no long climbs.', routes:rolling},
  {k:'route', q:'Looking for flat roads?', p:'Under 10 m of climbing per km: rice fields, the old railway path and the seafront.', routes:flat},
  {k:'view', q:'Looking for the best views?', p:'The Pe\u00f1\u00f3n de Ifach, Montg\u00f3, Guadalest\'s reservoir and the sea from Cumbre del Sol.', types:['Great views']},
  {k:'nature', q:'Looking for valleys and nature?', p:'Quiet valleys, almond and cherry terraces, wetlands with herons, and flamingos in Calp.', types:['Beautiful nature']},
  {k:'village', q:'Looking to stop in beautiful villages?', p:'Hilltop old towns, wine villages, castles and craft workshops along the way.', types:['Villages, wine and culture','Architecture']},
  {k:'cafe', q:'Looking for a good coffee stop?', p:'The cyclists\' caf\u00e9s of the Xal\u00f3 valley and the restaurant at the top of Coll de Rates.', types:['Cycling caf\u00e9s and restaurants']},
  {k:'pro', q:'Looking to ride like the pros?', p:'Vuelta a Espa\u00f1a stages and the region\'s gran fondos, on the same roads.', routes:pros}
];

const svg = k => `<svg viewBox="0 0 16 16" style="color:${HEX[k]||'#003B2A'}" aria-hidden="true">${ICON[k]}</svg>`;
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const rwg = id => `https://ridewithgps.com/routes/${id}`;
const fmt = n => Math.round(n).toLocaleString('en-US');

/* ---------- cards ---------- */
const qgrid = document.getElementById('mv-qgrid');
CARDS.forEach((c,ci)=>{
  const el = document.createElement('article'); el.className='q'; el.id='q'+ci;
  let chips='';
  if(c.types){
    const all = D.hl.filter(h=>c.types.includes(h.t));
    const rank = h => c.order ? (c.order.indexOf(h.n)<0 ? 99 : c.order.indexOf(h.n)) : 0;
    all.sort((a,b)=> rank(a)-rank(b) || cnt(b)-cnt(a));
    const max = c.max || 9;
    all.slice(0,max).forEach(h=>chips+=`<button class="chip" data-h="${h.id}">${esc(h.n)}<b>${cnt(h)}</b></button>`);
    if(all.length>max) chips+=`<button class="chip" data-card="${ci}">+ ${all.length-max} more</button>`;
  } else {
    c.routes.slice(0,8).forEach(id=>chips+=`<button class="chip" data-r="${id}">${esc(R[id].n)}<b>${fmt(R[id].km)} km</b></button>`);
    if(c.routes.length>8) chips+=`<button class="chip" data-card="${ci}">+ ${c.routes.length-8} more</button>`;
  }
  el.innerHTML = `<div class="qh"><span class="dot" style="background:${COLOR[c.k]}">${svg(c.k)}</span><h3>${esc(c.q)}</h3></div>
    <p>${esc(c.p)}</p><div class="chips">${chips}</div>
    <button class="show" data-card="${ci}">Show on the map</button>`;
  qgrid.appendChild(el);
});
document.getElementById('mv-season').innerHTML =
  `<strong>In season:</strong><span>Almond blossom in the Xal\u00f3 valley and over the Port de B\u00e8rnia, February.</span><span>Cherry blossom in the Vall de Gallinera, late March and April.</span>`;

/* ---------- map ---------- */
const map = L.map('mv-map',{zoomControl:true,attributionControl:true,minZoom:8.5,maxZoom:14,zoomSnap:.25,maxBounds:[[38.30,-0.95],[39.15,0.45]],maxBoundsViscosity:1});
const HOME=[[38.49,-0.70],[38.98,0.24]];
map.fitBounds(HOME,{padding:[6,6]});
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{subdomains:'abcd',maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'}).addTo(map);

function decode(str){let i=0,lat=0,lng=0,out=[];while(i<str.length){let b,s=0,r=0;do{b=str.charCodeAt(i++)-63;r|=(b&31)<<s;s+=5}while(b>=32);lat+=(r&1?~(r>>1):r>>1);s=0;r=0;do{b=str.charCodeAt(i++)-63;r|=(b&31)<<s;s+=5}while(b>=32);lng+=(r&1?~(r>>1):r>>1);out.push([lat/1e5,lng/1e5])}return out}
const lines = {};
const baseLayer = L.layerGroup().addTo(map);
Object.keys(D.tracks).forEach(id=>{
  const pts = decode(D.tracks[id]);
  lines[id] = {pts, base:L.polyline(pts,{color:'#9DB8A9',weight:1.5,opacity:.8,interactive:false}).addTo(baseLayer)};
});
const hotLayer = L.layerGroup().addTo(map);

[['Syncrosfera',38.8110,0.0374],['Marriott La Sella',38.8090,0.0737],['Oliva Nova Beach & Golf',38.8995,-0.0605],['Dion\u00eds Hotel Boutique',38.7554,0.1860],['VIVOOD Landscape Hotel',38.6793,-0.2041]]
 .forEach(([n,la,lo])=>L.marker([la,lo],{icon:L.divIcon({className:'',html:'<div class="hotel"></div>',iconSize:[12,12],iconAnchor:[6,6]})}).bindTooltip(n).addTo(map));

const markers = {};
const pinLayer = L.layerGroup().addTo(map);
const seen = {};
D.hl.forEach(h=>{
  if(h.la==null) return;
  const key = h.la+','+h.lo; const n = (seen[key]=(seen[key]||0)+1)-1; // nudge markers sharing a point
  const pos=[h.la + n*0.006, h.lo + n*0.008];
  const m = L.marker(pos,{icon:L.divIcon({className:'',html:`<div class="pin" style="background:${HEX[h.k]}">${svg(h.k)}</div>`,iconSize:[26,26],iconAnchor:[13,13]}),keyboard:true,title:h.n})
    .bindTooltip(h.n,{direction:'top',offset:[0,-12]}).on('click',()=>showHL(h.id,true));
  m.h=h; markers[h.id]=m;
});

/* filters */
const FILTERS=[['all','All highlights'],['climb','Climbs'],['view','Views'],['nature','Nature'],['village','Villages'],['arch','Architecture'],['cafe','Caf\u00e9s']];
let active='all';
const fbox=document.getElementById('mv-filters');
fbox.innerHTML = FILTERS.map(([k,l])=>`<button class="chip${k===active?' sel':''}" data-f="${k}">${k!=='all'?`<span class="sw" style="background:${HEX[k]}"></span>`:''}${l}</button>`).join('');
function setFilter(k){
  active=k; fbox.querySelectorAll('.chip').forEach(b=>b.classList.toggle('sel',b.dataset.f===k));
  pinLayer.clearLayers();
  Object.values(markers).forEach(m=>{ if(k==='all'||m.h.k===k) pinLayer.addLayer(m); });
}
fbox.addEventListener('click',e=>{const b=e.target.closest('[data-f]'); if(b) setFilter(b.dataset.f);});
setFilter('all');

/* ---------- selection ---------- */
const panel=document.getElementById('mv-panel');
function drawRoutes(ids,focus){
  hotLayer.clearLayers();
  const bounds=[];
  ids.forEach(id=>{ if(!lines[id]) return;
    const hot = focus===id;
    L.polyline(lines[id].pts,{color: hot?'#003B2A':'#499F68',weight: hot?5:3,opacity: hot?1:.85,interactive:false}).addTo(hotLayer);
    bounds.push(...lines[id].pts);
  });
  return bounds;
}
function routeItem(id){
  const r=R[id];
  return `<li data-r="${id}"><span class="rn">${esc(r.n)}<span class="sec">${isWeb(id)?esc(r.s):'Mirava route \u00b7 Ride with GPS'}</span></span>
    <span class="rs">${r.km.toFixed(0)} km \u00b7 ${fmt(r.m)} m<br><a href="${rwg(id)}" target="_blank" rel="noopener">See route \u2197</a></span></li>`;
}
function routeList(ids){
  const web=ids.filter(isWeb), other=ids.filter(id=>!isWeb(id));
  let h='';
  if(web.length) h+=`<div class="sub">On this page (${web.length})</div><ul class="rlist">${web.map(routeItem).join('')}</ul>`;
  if(other.length) h+=`<div class="sub">More Mirava routes (${other.length})</div><ul class="rlist">${other.map(routeItem).join('')}</ul>`;
  return h || '<p class="empty">No routes yet.</p>';
}
function selPin(id){ Object.values(markers).forEach(m=>{const el=m.getElement(); if(el) el.firstChild.classList.toggle('sel',m.h.id===id);}); }
function sideGroups(h){
  const s=D.sides[h.n]; if(!s) return null;
  const groups={}, order=[], over=[], unknown=[];
  h.r.forEach(id=>{
    const l=s[id];
    if(!l){ unknown.push(id); return; }
    const up=l.filter(x=>x[1]);
    if(!up.length){ over.push(id); return; }
    up.forEach(([lab])=>{ if(!groups[lab]){groups[lab]=[];order.push(lab);} if(!groups[lab].includes(id)) groups[lab].push(id); });
  });
  order.sort((a,b)=>groups[b].length-groups[a].length);
  return {groups,order,over,unknown};
}
function showHL(id,fromMap){
  const h=D.hl[id]; const g=sideGroups(h);
  let body='', b;
  if(g){
    body=`<div class="sub">Climbed from ${g.order.length} side${g.order.length===1?'':'s'}</div>`;
    g.order.forEach((lab,i)=>{ body+=`<div class="side"><span class="sw2" style="background:${SIDE_COL[i%4]}"></span>${esc(lab)} <b>${g.groups[lab].length}</b></div><ul class="rlist">${g.groups[lab].map(routeItem).join('')}</ul>`; });
    if(g.over.length) body+=`<div class="side"><span class="sw2" style="background:#9DB8A9"></span>Passes over it without climbing it <b>${g.over.length}</b></div><ul class="rlist">${g.over.map(routeItem).join('')}</ul>`;
    if(g.unknown.length) body+=`<div class="side"><span class="sw2" style="background:#C9C2A0"></span>Side not measured yet <b>${g.unknown.length}</b></div><ul class="rlist">${g.unknown.map(routeItem).join('')}</ul>`;
    hotLayer.clearLayers(); b=[];
    const draw=(ids,col,w)=>ids.forEach(rid=>{ if(!lines[rid]) return; L.polyline(lines[rid].pts,{color:col,weight:w,opacity:.9,interactive:false}).addTo(hotLayer); b.push(...lines[rid].pts); });
    draw(g.over,'#9DB8A9',2.5); draw(g.unknown,'#C9C2A0',2.5);
    g.order.slice().reverse().forEach(lab=>draw(g.groups[lab],SIDE_COL[g.order.indexOf(lab)%4],3.5));
  } else {
    body=`<div class="sub">${h.r.length} route${h.r.length===1?'':'s'} pass${h.r.length===1?'es':''} here</div>${routeList(h.r)}`;
    b=drawRoutes(h.r);
  }
  panel.innerHTML=`<div class="kicker" style="color:${HEX[h.k]}">${esc(h.t)}</div><h3>${esc(h.n)}</h3><p>${esc(h.w)}</p>${body}`;
  if(h.la!=null){ if(active!=='all'&&active!==h.k) setFilter(h.k); selPin(id); }
  if(!fromMap && b.length) map.fitBounds(b,{padding:[20,20],maxZoom:12});
  if(!fromMap) document.getElementById('mv-map').scrollIntoView({behavior:'smooth',block:'center'});
}
function showRoute(id){
  const r=R[id]; const hs=D.hl.filter(h=>h.r.includes(id));
  panel.innerHTML=`<div class="kicker">${isWeb(id)?esc(r.s):'Mirava route'}</div><h3>${esc(r.n)}</h3>
    <p>${r.km.toFixed(1)} km \u00b7 ${fmt(r.m)} m climbing \u00b7 ${rate(id).toFixed(0)} m per km \u00b7 <a href="${rwg(id)}" target="_blank" rel="noopener">See route on Ride with GPS \u2197</a></p>
    <div class="sub">Highlights on this route (${hs.length})</div>
    <div class="hlchips">${hs.map(h=>{const s=D.sides[h.n]&&D.sides[h.n][id]; const up=s?s.filter(x=>x[1]).map(x=>x[0].split(' \u2013 ')[0].toLowerCase()):[]; const tag=s?(up.length?' \u00b7 '+up.join(', '):' \u00b7 passes over'):''; return `<button class="chip" data-h="${h.id}" style="border-color:${HEX[h.k]}">${esc(h.n)}${esc(tag)}</button>`;}).join('')||'<span class="empty">None recorded yet.</span>'}</div>`;
  const b=drawRoutes([id],id); selPin(-1);
  if(b.length) map.fitBounds(b,{padding:[20,20],maxZoom:12});
}
function showCard(ci){
  const c=CARDS[ci];
  root.querySelectorAll('.q').forEach((q,i)=>q.classList.toggle('on',i===ci));
  if(c.types){
    const hs=D.hl.filter(h=>c.types.includes(h.t));
    setFilter(hs[0].k);
    const ids=[...new Set(hs.flatMap(h=>h.r))];
    panel.innerHTML=`<div class="kicker" style="color:${HEX[c.k]}">${esc(c.q)}</div><h3>${hs.length} highlights</h3>
      <div class="hlchips">${hs.sort((a,b)=>cnt(b)-cnt(a)).map(h=>`<button class="chip" data-h="${h.id}">${esc(h.n)}<b>${cnt(h)}</b></button>`).join('')}</div>
      <p class="empty">Pick a highlight to see its routes.</p>`;
    const b=drawRoutes([]); selPin(-1);
    const pts=hs.filter(h=>h.la!=null).map(h=>[h.la,h.lo]); if(pts.length) map.fitBounds(pts,{padding:[30,30],maxZoom:11});
  } else {
    setFilter('all');
    panel.innerHTML=`<div class="kicker">${esc(c.q)}</div><h3>${c.routes.length} routes</h3><p>${esc(c.p)}</p>${routeList(c.routes)}`;
    const b=drawRoutes(c.routes); selPin(-1); if(b.length) map.fitBounds(b,{padding:[20,20]});
  }
  document.getElementById('mv-map').scrollIntoView({behavior:'smooth',block:'center'});
}
document.addEventListener('click',e=>{
  const h=e.target.closest('[data-h]'); if(h){ showHL(+h.dataset.h,false); return; }
  const c=e.target.closest('[data-card]'); if(c){ showCard(+c.dataset.card); return; }
  if(e.target.closest('a')) return;
  const r=e.target.closest('[data-r]'); if(r){
    if(r.tagName==='LI'){ panel.querySelectorAll('li').forEach(li=>li.classList.toggle('hot',li===r)); const ids=[...panel.querySelectorAll('li[data-r]')].map(li=>li.dataset.r); drawRoutes(ids,r.dataset.r); }
    else { showRoute(r.dataset.r); document.getElementById('mv-map').scrollIntoView({behavior:'smooth',block:'center'}); }
  }
});

/* ---------- click on a road: which routes pass this spot ---------- */
const spotLayer = L.layerGroup().addTo(map);
function segDist(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy;let u=l?((p.x-a.x)*dx+(p.y-a.y)*dy)/l:0;u=Math.max(0,Math.min(1,u));return Math.hypot(p.x-(a.x+u*dx),p.y-(a.y+u*dy));}
function routesAt(latlng,tolPx){
  const p=map.latLngToLayerPoint(latlng), hits=[];
  for(const id in lines){ if(!R[id]) continue;
    const pts=lines[id].pts; let best=1e9;
    for(let i=1;i<pts.length;i++){ const a=pts[i-1],c=pts[i];
      if(Math.abs(a[0]-latlng.lat)>0.05&&Math.abs(c[0]-latlng.lat)>0.05) continue;
      const d=segDist(p,map.latLngToLayerPoint(a),map.latLngToLayerPoint(c)); if(d<best) best=d; }
    if(best<=tolPx) hits.push(id);
  }
  return hits;
}
map.on('click',e=>{
  const ids=routesAt(e.latlng,10);
  if(!ids.length) return;
  ids.sort((a,b)=>(isWeb(b)-isWeb(a))||R[a].km-R[b].km);
  spotLayer.clearLayers();
  L.circleMarker(e.latlng,{radius:7,color:'#003B2A',weight:2,fillColor:'#FAF1AC',fillOpacity:1,interactive:false}).addTo(spotLayer);
  const near=D.hl.filter(h=>h.la!=null && map.distance(e.latlng,[h.la,h.lo])<1500).sort((a,b)=>map.distance(e.latlng,[a.la,a.lo])-map.distance(e.latlng,[b.la,b.lo]));
  panel.innerHTML=`<div class="kicker">This spot on the map</div><h3>${ids.length} route${ids.length===1?'':'s'} pass${ids.length===1?'es':''} here</h3>
    ${near.length?`<div class="sub">Highlights nearby</div><div class="hlchips">${near.map(h=>`<button class="chip" data-h="${h.id}" style="border-color:${HEX[h.k]}">${esc(h.n)}</button>`).join('')}</div>`:''}
    ${routeList(ids)}`;
  drawRoutes(ids); selPin(-1);
});
document.addEventListener('click',e=>{ if(e.target.closest('[data-h],[data-card],.chip[data-r]')) spotLayer.clearLayers(); });

/* opening state: Coll de Rates selected, like a visitor who just tapped it */
showHL(byName('Coll de Rates').id,true);
map.fitBounds(HOME,{padding:[6,6]});

  }
})();
