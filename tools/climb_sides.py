import json, math
rows=json.load(open('passes.json'))
def dist(a,b):
    x=(b[1]-a[1])*math.radians(1)*math.cos(math.radians((a[0]+b[0])/2)); y=(b[0]-a[0])*math.radians(1); return 6371*math.hypot(x,y)
SIDES={
 "Coll de Rates":[("From Parcent – the classic north side",(38.7400,-0.0700)),("From Tàrbena – the short south side",(38.7040,-0.1075))],
 "Port de Tudons":[("From Alcoleja – north side",(38.6796,-0.3351)),("From Penàguila – north-west side",(38.6750,-0.3591)),("From Sella and Relleu – the long south side",(38.6290,-0.3080))],
 "Port de la Carrasqueta":[("From Xixona – the classic south side",(38.5741,-0.5086)),("From Alcoy – north side",(38.6510,-0.4751))],
 "Port de Benifallim":[("From Benifallim and Penàguila – north side",(38.6700,-0.3932)),("From Torremanzanas – south side",(38.6003,-0.4280))],
 "Port de Confrides":[("From Guadalest – east side",(38.6872,-0.2555)),("From Ares and Penàguila – west side",(38.6880,-0.3420))],
 "Cumbre del Sol (Puig de la Llorença)":[("From Benitatxell – north side",(38.7500,0.1500)),("From Moraira – south side",(38.7051,0.1361))],
 "Port de Bèrnia":[("From Xaló – north-west side",(38.6954,-0.0500)),("From Benissa – east side",(38.6864,-0.0021))],
 "Tàrbena":[("From Bolulla – south side",(38.6764,-0.1110)),("From Coll de Rates – north side",(38.7170,-0.0760)),("From Castell de Castells – west side",(38.7181,-0.1505))],
 "Vall d'Ebo":[("From Pego – the Vuelta side",(38.8181,-0.1212)),("From Vall d'Alcalà – west side",(38.8057,-0.2179))],
 "Port de Tollos":[("From Vall d'Ebo – north side",(38.7930,-0.2650))],
 "Xorret de Catí":[("From Castalla – north side",(38.5602,-0.6624))],
}
NOCHECK={"Port de Bèrnia"}  # the mirador is not the top, so climbing can't be measured there
SUM={"Coll de Rates":(38.7241,-0.0601),"Port de Tudons":(38.6503,-0.3246),"Port de la Carrasqueta":(38.6041,-0.4859),"Port de Benifallim":(38.6428,-0.4040),"Port de Confrides":(38.6973,-0.2991),"Xorret de Catí":(38.5185,-0.6754),"Port de Bèrnia":(38.6698,-0.0273),"Cumbre del Sol (Puig de la Llorença)":(38.7156,0.1578),"Port de Tollos":(38.7630,-0.2681),"Tàrbena":(38.6936,-0.0989),"Vall d'Ebo":(38.8063,-0.1601)}
out={}  # pass -> route -> list of (label, climbed, net, gain)
for rid,pas,km,net,gain,la,lo,ele,back,fla,flo in rows:
    if pas not in SIDES: continue
    a=(float(la),float(lo))
    if dist(a,SUM[pas])<1.5: continue   # detour (e.g. watchtower) – not an approach
    lab=min(SIDES[pas],key=lambda s:dist(a,s[1]))[0]
    net=int(net); gain=int(gain)
    climbed = True if pas in NOCHECK else (gain>=120 and net>=40) or (pas=="Vall d'Ebo" and gain>=200)
    out.setdefault(pas,{}).setdefault(rid,[])
    if not any(x[0]==lab for x in out[pas][rid]): out[pas][rid].append((lab,climbed,net,gain))
json.dump(out,open('climbsides.json','w'),ensure_ascii=False,indent=0)
for p,v in out.items():
    print('==',p)
    for rid,l in v.items(): print('  ',rid,l)
