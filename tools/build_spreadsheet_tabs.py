import openpyxl, json, copy, sys
from openpyxl.styles import Font, Alignment, PatternFill
SRC = sys.argv[1]; OUT = sys.argv[2]
wb = openpyxl.load_workbook(SRC)
hits = json.load(open('hits.json'))
DROP = {"53883255", "54470603", "41171009"}
rw = {}
for l in open('routes_raw.txt', encoding='utf-8'):
    i, n, km, m, loc = [x.strip() for x in l.split('|')]
    rw[i] = dict(name=n, km=float(km), m=int(m), loc=loc)
others = {"54015314", "52603103", "54475136", "56591687", "27901331", "26824564"}
page = [("57185682","Dénia Via Verde - Orange Groves & Montgó"),("57624090","Las Marinas Seafront, Dénia"),("57623070","Dionis-Arenal-Xàbia (Jávea) Old Town"),
("57186311","Pego Marshes & Rice Fields"),("57186574","Xaló (Jalón) Valley Amble"),("57186739","Pedreguer-Beniarbeig-La Xara loop"),
("57186096","Moraira to Calp"),("57187246","Syncrosfera-Gata de Gorgos-Alcalalí loop"),("57187621","Benissa-Calp-Fustera Loop"),("57192783","Benitatxell–Moraira–Teulada Headland"),
("57193001","Xaló Valley Wine Villages"),("57193152","Syncrosfera, Orba & Benigembla Countryside Loop"),("57193257","Oliva Nova, Monte Pego & the Girona River loop"),("57193361","Montgó Loop"),
("57197070","Coll de Rates from La Sella"),("57197266","Sierra de Bernia Loop"),("57197372","Vall de Gallinera — The Valley of a Thousand Cherry Trees"),("57197495","Guadalest — The Eagle's Nest - from Altea"),
("57197762","Castell de Castells & Tàrbena Loop from Parcent"),("57197981","Forna and Sagra from Oliva Nova"),("57198231","Vall d'Ebo from Oliva Nova"),
("57200784","Port de la Carrasqueta from Benilloba"),("57225212","Port de Tudons from Guadalest"),("57225318","Xixona, Alcoy, Xorret de Catí loop"),("57225401","Port de Benifallim from Guadalest, out and back"),
("57225552","Guadalest, Castell de Castells and Confrides loop"),("57225664","Vall de Gallinera and Vall d'Ebo loop"),("57258948","Oliva Nova-Tavernes-Barx loop"),
("52603103","Gran Fondo Alberto Contador"),("54475136","Aitana Tour"),("56591687","Gran Fondo Nucía"),("27901331","La Gamba"),("26824564","Coll de Rates and Port de Bernia loop"),
("57623397","Dionis-Granadella-Dénia-Calp-Puig de la Llorença"),("57623294","VIVOOD-Calp-Vall d'Ebo-Tollos"),("57623211","VIVOOD-Port de Tudons-Coll de Rates"),
("57214536","Vuelta a España 2021, stage 7"),("57214012","Vuelta a España 2023, stage 8"),("54015314","Vuelta a España 2026, stage 9")]
tiers = ["Short & Easy"]*6 + ["Leisurely Explorer"]*8 + ["Valleys & Villages"]*7 + ["Mountain Passes & Panoramas"]*7 + ["Real Stretches & Race Routes"]*11
web = {i: (n, t) for (i, n), t in zip(page, tiers)}
web_stats = {"57225401": (63, 1475)}  # page figures that differ from Ride with GPS

# ---- old sheet data (notes, used-in, names) keyed by route id
br = wb['Bike routes']
old = {}
for r in range(6, br.max_row + 1):
    link = br.cell(r, 7).value
    if not link: continue
    i = str(link).rstrip('/').split('/')[-1]
    old[i] = dict(name=br.cell(r, 2).value, note=br.cell(r, 6).value, used=br.cell(r, 8).value)
used = {k: v['used'] for k, v in old.items() if v['used']}

# Mirava names: website name if featured; otherwise the existing sheet name (days tabs use them); otherwise Ride with GPS name
def mname(i):
    if i in web: return web[i][0]
    if i in old and old[i]['name']: return old[i]['name']
    return rw[i]['name'].replace(' - ', ' – ')
names = {i: mname(i) for i in rw}
names["57185812"] = "Dénia Las Marinas from El Verger (older version)"
names["57185961"] = "Jávea Old Town to Arenal (older version)"
from collections import Counter
dup = [n for n, k in Counter(names.values()).items() if k > 1]
assert not dup, dup

newnote = {
 "57185961": "Older version of the Xàbia ride, starting in Xàbia old town; replaced on the website by the Dionis version.",
 "57185812": "Older version of the Las Marinas ride, starting near El Verger; replaced on the website by the Marriott La Sella version.",
 "57624090": "Starts and ends at Marriott La Sella. Mostly flat seafront; the page suggests it for the first morning.",
 "57623070": "Starts and ends at Dionís Hotel Boutique; beachfront, then up to the cobbled old town.",
 "57259395": "Starts and ends at Oliva Nova; via Dénia, Jávea and La Xara. Not on the website.",
 "57259447": "Starts and ends at Oliva Nova; over Monte Pego, then Pedreguer, Jávea and Dénia. Not on the website.",
 "57623397": "Starts and ends at Dionís. Granadella cove, coast to Dénia, Calp, then the climb of Cumbre del Sol (Puig de la Llorença). Replaces the older Cumbre del Sol loop from Dénia (route by another rider).",
 "57623294": "Starts and ends at VIVOOD (Guadalest). Replaces the older Guadalest and Vall d'Ebo loop (route by another rider).",
 "57623211": "Starts and ends at VIVOOD. Tudons first, then Coll de Rates. Replaces the older Tudons and Coll de Rates route from Calp (route by another rider).",
}
fix_note = {
 "57693886": "Starts at Syncrosfera, ends at Montesanco. Via Pedreguer, Xaló, Parcent, Coll de Rates, Alcalalí and Xaló (light lunch at Bistro Selene), Benissa and Teulada. The Ride with GPS route now includes the optional climb to the watchtower above the col (53.6 km, 1,235 m); without it about 48.8 km and 955 m.",
 "57380279": "Starts at Syncrosfera, ends at Montesanco (Camí Abiar Alta 23, about 216 m altitude, so the finish climbs). On Ride with GPS now named 'Syncrosfera-Coll de Rates-Sierra de Bèrnia-Montesanco': Coll de Rates, then the Port de Bèrnia.",
 "57225401": "Starts in Guadalest (VIVOOD). Ride with GPS shows 67.4 km and 1,454 m; the website says 63 km and 1,475 m.",
}
# order: website routes first in page order, then other routes by distance
order = [i for i, _ in page] + sorted([i for i in rw if i not in web], key=lambda i: rw[i]['km'])

# ---- rewrite Bike routes
note_font = copy.copy(br['B3'].font); hdr_font = copy.copy(br.cell(5, 2).font); hdr_fill = copy.copy(br.cell(5, 2).fill); hdr_al = copy.copy(br.cell(5, 2).alignment)
body_font = copy.copy(br.cell(6, 2).font); body_al = copy.copy(br.cell(6, 6).alignment); link_font = copy.copy(br.cell(6, 7).font)
for m in list(br.merged_cells.ranges): br.unmerge_cells(str(m))
for row in br.iter_rows(min_row=3, max_row=max(br.max_row, 120)):
    for c in row: c.value = None; c.font = copy.copy(body_font); c.fill = PatternFill(); c.hyperlink = None
br['B3'] = ("All routes in Olaf's Ride with GPS account (checked 2 Nov 2026), plus the race routes by other riders that the website links to. "
            "Distance and climbing are from Ride with GPS. 'Section on website' is the heading the route sits under on www.mirava.travel/bike-routes; "
            "'Not on website' = Olaf's own routes, used in the itineraries or kept as alternatives.")
br['B3'].font = note_font; br['B3'].alignment = Alignment(wrap_text=True, vertical='top'); br.merge_cells('B3:K3'); br.row_dimensions[3].height = 45
H = ["Route (Mirava name)", "Section on website", "Distance (km)", "Climbing (m)", "Start / notes", "Link", "Used in Bikes & Bites", "Name on Ride with GPS", "Route by", "Route ID"]
for j, h in enumerate(H, start=2):
    c = br.cell(5, j, h); c.font = hdr_font; c.fill = hdr_fill; c.alignment = hdr_al
r = 6
for i in order:
    R = rw[i]
    note = fix_note.get(i) or newnote.get(i) or (old.get(i, {}).get('note')) or f"Starts in {R['loc']}."
    vals = [names[i], web[i][1] if i in web else ("Hidden – older version" if i in ("57185961", "57185812") else "Not on website"), R['km'], R['m'], note,
            f"https://ridewithgps.com/routes/{i}", used.get(i), R['name'], "Other rider" if i in others else "Olaf", int(i)]
    for j, v in enumerate(vals, start=2):
        c = br.cell(r, j, v); c.alignment = Alignment(wrap_text=True, vertical='top')
    br.cell(r, 7).hyperlink = f"https://ridewithgps.com/routes/{i}"; br.cell(r, 7).font = link_font
    if i not in web: 
        for j in range(2, 12): br.cell(r, j).font = Font(name=body_font.name, size=body_font.sz, color="555555")
        br.cell(r, 7).font = link_font
    r += 1
last_route_row = r - 1
for col, w in zip("BCDEFGHIJK", [46, 26, 11, 11, 60, 40, 22, 44, 12, 11]):
    br.column_dimensions[col].width = w
br.freeze_panes = "C6"

# ---- day tabs: new names + longer lookup range
days = wb['Bikes & Bites days']
ren = {"Xaló–Jesús Pobre–Gata de Gorgos": names["57187246"], "Guadalest – The Eagle's Nest, from Altea": names["57197495"]}
for row in days.iter_rows():
    for c in row:
        if isinstance(c.value, str):
            if c.value in ren: c.value = ren[c.value]
            elif c.value.startswith('=') and "'Bike routes'!" in c.value:
                c.value = c.value.replace("$6:$D$61", "$6:$D$120").replace("$6:$E$61", "$6:$E$120").replace("$6:$B$61", "$6:$B$120")
allnames = set(names.values())
for rr in (7, 21, 35):
    for cc in range(3, 11):
        v = days.cell(rr, cc).value
        if v and v not in allnames: print("DAY ROUTE NOT FOUND", rr, cc, v)

# ---- programs (for x columns)
PROG = {"Balanced": {"57380800", "57693886", "57697622", "57381460"},
        "Enthusiast": {"57697456", "57380279", "57381385", "57389376", "57389460"},
        "Bon-Vivant": {"57380183", "57187246", "57197495", "57389460"}}
def H_(k): return [i for i in hits[k] if i not in DROP]
U = lambda *ls: sorted(set().union(*[set(x) for x in ls]))
A = []  # type, name, what, ids, lat, lon, how
GPS = "GPS"; DESC = "Description"
A += [
 ("Famous climbs","Coll de Rates","One of the Marina Alta's most celebrated passes: switchbacks through orchard country from Parcent, with an optional extra climb to the old watchtower above the col (very steep last ramps).",H_("rates"),38.7241,-0.0601,GPS),
 ("Famous climbs","Vall d'Ebo","The climb from Pego into the remote, almond-terraced Vall d'Ebo, one of the least-visited valleys.",H_("ebo"),38.8063,-0.1601,GPS),
 ("Famous climbs","Port de Tudons","A Vuelta pass, quieter and less photographed than Coll de Rates but just as hard on the legs.",H_("tudons"),38.6503,-0.3246,GPS),
 ("Famous climbs","Port de la Carrasqueta","Long, patient climb where professional teams have built winter fitness for decades.",H_("carras"),38.6041,-0.4859,GPS),
 ("Famous climbs","Port de Benifallim","Steady climb through cherry and almond groves with Aitana and Puigcampana ahead, and one of the region's best descents.",H_("benif"),38.6428,-0.4040,GPS),
 ("Famous climbs","Port de Confrides","A proper mountain pass above Guadalest on the road to Alcoy.",H_("confr"),38.6973,-0.2991,GPS),
 ("Famous climbs","Xorret de Catí","Category-one Vuelta wall averaging over 11%, with ramps above 20%.",H_("xorret")+["57225318"],38.5185,-0.6754,GPS),
 ("Famous climbs","Port de Bèrnia","The climb over the shoulder of the Sierra de Bernia between Xaló and Benissa, best when the almonds blossom in February.",H_("bernia"),38.6698,-0.0273,GPS),
 ("Famous climbs","Cumbre del Sol (Puig de la Llorença)","A genuine climb from Benitatxell to the top of Puig de la Llorença, with a very nice view from the summit.",H_("llorenca"),38.7156,0.1578,GPS),
 ("Famous climbs","Tàrbena","A proper climb on the quiet side of the Marina Alta interior.",H_("tarbena"),38.6936,-0.0989,GPS),
 ("Famous climbs","Port de Tollos","A Vuelta pass (2023 and 2026), short and steep with ramps over 15%.",H_("tollos"),38.7630,-0.2681,GPS),
 ("Famous climbs","Coll de la Font / El Miserat","The second climb that turns the Vall d'Ebo ride into a full mountain circuit.",["57198231","54015314"],None,None,DESC),
 ("Famous climbs","Aitana","The highest paved point in the province, with some of the widest views on the coast (the last 6.6 km to the summit are normally closed to cyclists).",["57200589","56591687","54015314"],None,None,DESC),
 ("Famous climbs","Sa Creueta","One of the four defining passes of the Aitana Tour.",["54475136"],None,None,DESC),
 ("Famous climbs","Port de la Llacuna and Balcón de Alicante","The opening climb and the summit finish of the 2021 Vuelta stage.",["57214536"],None,None,DESC),
 ("Local climbs","Fustera","The climb from the coast around Cala del Baladrar up to Fustera, with the Peñón de Ifach behind you.",["57187621","57697622","57381385","57389460"],38.655,0.083,DESC),
 ("Local climbs","Monte Pego","A short climb from the rice fields of Pego toward el Ràfol d'Almúnia.",["57193257","57225664","57389376","57381460","57259447"],None,None,DESC),
 ("Great views","Peñón de Ifach","The limestone giant that appears early and guides you along the coast to Calp.",H_("ifach"),38.6340,0.0740,GPS),
 ("Great views","Montgó massif","The limestone mountain that watches over Dénia and Xàbia.",U(H_("montgo"),["57185682","57187246"]),38.8061,0.1426,GPS),
 ("Great views","Guadalest castle and turquoise reservoir","The castle and reservoir at the top of the climb, or the start of the loop.",H_("guadalest"),38.6733,-0.1980,GPS),
 ("Great views","Summit view from Puig de la Llorença","A very nice view over the coast from the top of the Cumbre del Sol climb.",H_("llorenca"),38.7156,0.1578,GPS),
 ("Great views","Granadella cove","Cliffs, pine and turquoise water on the descent to the hidden cove.",H_("granadella"),38.7330,0.1975,GPS),
 ("Great views","Moraira harbour and Benitatxell headland","Sea glimpses over rolling farmland, then the calm of Moraira harbour.",H_("moraira"),38.6880,0.1370,GPS),
 ("Great views","Altea old town and blue-domed skyline","The hilltop old town, crowned by its blue-domed church.",H_("altea"),38.5990,-0.0518,GPS),
 ("Great views","Vall de Pop from the ridge road","Vineyards and villages below the quiet ridge road between Pedreguer and Alcalalí (about 310 m).",["57187246","57389460","57697456"],None,None,DESC),
 ("Great views","Aitana and Puigcampana skyline","The big mountains rising ahead or behind on the Benifallim and Tudons routes.",["57225401","57225212","56591687"],None,None,DESC),
 ("Great views","View back over Dénia and over Jávea bay","Dénia's harbour and castle behind you as the road climbs the shoulder of Montgó, then Jávea bay opening up below.",["57380183"],None,None,DESC),
 ("Great views","Sea views from Benissa","Views back to the sea from one of the coast's hill towns.",["57187621"],None,None,DESC),
 ("Great views","Seafront promenades","Beach terraces and promenades for the easy coastal rides.",["57624090","57185812","57623070","57185961","57258948"],None,None,DESC),
 ("Beautiful nature","Vall de Gallinera, Valley of a Thousand Cherry Trees","Eight villages on one quiet road; cherry blossom in late March and April.",H_("gallinera"),38.8350,-0.2300,GPS),
 ("Beautiful nature","Pego marshes, rice fields and wetland birds","Rice paddies, reed beds and herons: a side of Spain few visitors see.",U(H_("marsh"),["57197981","57381460","57389376"]),38.875,-0.060,GPS),
 ("Beautiful nature","Xaló valley vineyards and almond terraces","Vineyards on one side, almond and olive terraces on the other; almond blossom in February.",U(H_("xalo"),H_("murla"),["57187246","57389460","57381385","57697456","57197070","57192783"]),38.7400,-0.0125,GPS),
 ("Beautiful nature","Orange groves","Citrus country scenting the air along quiet farm roads.",["57185682","57186739","57193361","57380800","57193257","57197981","57380183","57259395","57259447"],None,None,DESC),
 ("Beautiful nature","Dénia Via Verde greenway","An old railway line turned quiet green path, with no traffic.",["57185682"],None,None,DESC),
 ("Beautiful nature","Pine forest and almond terraces of Castell de Castells","A village apart from time, ringed by pine and almond.",H_("castell"),38.7253,-0.1925,GPS),
 ("Beautiful nature","Orba orchard lanes","Orchard-lined lanes inland of Pedreguer.",H_("orba"),38.7800,-0.0620,GPS),
 ("Beautiful nature","Cherry and almond groves of Benifallim","Blossom-and-fruit terraces on the Benifallim climbs.",["57225401","57200784"],None,None,DESC),
 ("Beautiful nature","Loquat orchards of Callosa d'en Sarrià","Terraces of loquat (níspero) trees, often under white netting; the fruit ripens in spring.",H_("callosa"),38.650,-0.122,GPS),
 ("Beautiful nature","Fonts de l'Algar waterfalls","Waterfalls and turquoise pools on the river Algar, a short detour from Callosa d'en Sarrià.",["57197495"],38.6605,-0.0949,DESC),
 ("Beautiful nature","Calp salt lake and flamingos","A lagoon in the middle of Calp where flamingos often feed.",H_("salines"),38.6438,0.0650,GPS),
 ("Beautiful nature","Girona river","Tracing the river through Benimeli, Beniarbeig, Pedreguer and El Verger.",["57193257"],None,None,DESC),
 ("Villages, wine and culture","Guadalest","The 'Eagle's Nest': castle village on a rock above the reservoir.",H_("guadalest"),38.6733,-0.1980,GPS),
 ("Villages, wine and culture","Xaló valley wine villages","Alcalalí, Benigembla, Murla, Llíber and Xaló: quiet villages with church bells.",U(H_("alcalali"),H_("murla"),H_("benigembla"),H_("xalo")),38.7516,-0.0424,GPS),
 ("Villages, wine and culture","Xaló wine cooperative","The village wine cooperative, with tastings of local muscatel and red wines.",U(H_("xalo"),["57187246"]),38.7400,-0.0125,GPS),
 ("Villages, wine and culture","Wine tasting at Bodega Montesanco","Wine tasting with dinner at Bodega Montesanco in Teulada, where the Syncrosfera to Montesanco rides finish.",H_("montesanco"),38.7384,0.1102,GPS),
 ("Villages, wine and culture","Gata de Gorgos","Wicker and esparto worked by hand for generations, and Spanish guitars still made; workshops to browse.",H_("gata"),38.7745,0.0855,GPS),
 ("Villages, wine and culture","Benissa old town","Narrow streets and a cathedral-sized church; lunch and coffee in the old square.",H_("benissa"),38.7152,0.0504,GPS),
 ("Villages, wine and culture","Xàbia (Jávea) old town","Cobbled old town leading to the seafront.",H_("xabia"),38.7893,0.1661,GPS),
 ("Villages, wine and culture","Castell de Castells","A remote mountain village, a real discovery.",H_("castell"),38.7253,-0.1925,GPS),
 ("Villages, wine and culture","Xixona and Alcoy","Xixona is famous for turrón; Alcoy's mountains shaped generations of local climbers.",H_("xixona"),38.5410,-0.5070,GPS),
 ("Architecture","Dénia castle","The castle on the hill above Dénia's harbour, looking out over the town and the sea.",H_("denia"),38.8410,0.1060,GPS),
 ("Architecture","Xàbia's fortress church","The Gothic church of Sant Bartomeu, built like a fortress, in the heart of the old town.",H_("xabia"),38.7893,0.1661,GPS),
 ("Architecture","Alcalalí medieval tower","A medieval defensive tower in the village square of Alcalalí.",H_("alcalali"),38.7516,-0.0424,GPS),
 ("Architecture","Riu-raus","Arcaded farm buildings where muscatel grapes were dried into raisins, typical of the Marina Alta countryside.",["57380183","57187246"],None,None,DESC),
 ("Architecture","Fountain with 221 spouts in Polop","The Font dels Xorrets in Polop's old town.",H_("polop"),38.6226,-0.1318,GPS),
 ("Cycling cafés and restaurants","Velosol Cycling Bar, Xaló","Cycling bar in Xaló (Carrer Església 14): coffee, crêpes, tortilla, bike shop and mechanic. Closed Sunday and Monday.",H_("velosol"),38.7400,-0.0125,GPS),
 ("Cycling cafés and restaurants","Musette Café, Alcalalí","Small cyclists' café on Plaça Mosquera 2, popular before and after Coll de Rates: coffee and homemade cake. Closed weekends.",H_("musette"),38.7516,-0.0424,GPS),
 ("Cycling cafés and restaurants","Alta Bike, Alcalalí","Bike rental at Av de la Sénia 14, Alcalalí, opening its own cyclists' café (expected late November / December 2026); delivers bikes to hotels.",H_("alta"),38.7509,-0.0397,GPS),
 ("Cycling cafés and restaurants","Restaurant Coll de Rates","The classic stop at the top of Coll de Rates: terrace with views over the Xaló valley to the sea; apple strudel and hot chocolate are favourites. Closed Monday.",H_("rates"),38.7241,-0.0601,GPS),
 ("Cycling cafés and restaurants","Blanca Bikes Base Camp Café, Parcent","Café and bike rental at the foot of Coll de Rates (Av de Dénia 15, Parcent), with views of the climb. Open daily.",H_("blanca"),38.7437,-0.0663,GPS),
]
# ---- rewrite Cycling attractions
ca = wb['Cycling attractions']
cnote = copy.copy(ca['B3'].font); hf = copy.copy(ca.cell(5, 2).font); hfi = copy.copy(ca.cell(5, 2).fill); hal = copy.copy(ca.cell(5, 2).alignment)
bf = copy.copy(ca.cell(6, 2).font)
for m in list(ca.merged_cells.ranges): ca.unmerge_cells(str(m))
for row in ca.iter_rows(min_row=3, max_row=max(ca.max_row, 120)):
    for c in row: c.value = None; c.font = copy.copy(bf); c.fill = PatternFill()
ca['B3'] = ("Highlights checked against the GPS tracks of all routes in Olaf's Ride with GPS account (2 Nov 2026): 'GPS' = the route passes within a few hundred metres "
            "(cafés: within 350 m, i.e. through the village). 'Description' = taken from the route descriptions and names, not measured. "
            "Featured = on the bike routes page; other = Olaf's own routes. Lat/Lon are for the planned highlight map. An x marks highlights on the routes each Bikes & Bites program rides.")
ca['B3'].font = cnote; ca['B3'].alignment = Alignment(wrap_text=True, vertical='top'); ca.merge_cells('B3:M3'); ca.row_dimensions[3].height = 60
H2 = ["Type", "Highlight", "What it is", "Featured routes on the website", "Other Ride with GPS routes", "Number of routes", "Balanced", "Enthusiast", "Bon-Vivant", "Lat", "Lon", "Checked by"]
for j, h in enumerate(H2, start=2):
    c = ca.cell(5, j, h); c.font = hf; c.fill = hfi; c.alignment = hal
pos = {i: k for k, i in enumerate(order)}
r = 6
for typ, nm, what, ids, la, lo, how in A:
    ids = sorted({i for i in ids if i in rw}, key=lambda i: pos[i])
    feat = "; ".join(names[i] for i in ids if i in web)
    oth = "; ".join(names[i] for i in ids if i not in web)
    vals = [typ, nm, what, feat, oth, len(ids)] + ["x" if PROG[p] & set(ids) else None for p in PROG] + [la, lo, how]
    for j, v in enumerate(vals, start=2):
        c = ca.cell(r, j, v); c.alignment = Alignment(wrap_text=True, vertical='top')
    r += 1
for col, w in zip("BCDEFGHIJKLM", [20, 30, 50, 60, 55, 9, 10, 11, 11, 9, 9, 11]):
    ca.column_dimensions[col].width = w
ca.freeze_panes = "D6"
# ---- Climb sides tab
cs = json.load(open('climbsides.json'))
if 'Climb sides' in wb.sheetnames: del wb['Climb sides']
ws = wb.create_sheet('Climb sides', index=wb.sheetnames.index('Cycling attractions') + 1)
ws['B2'] = 'Climb sides'; ws['B2'].font = copy.copy(wb['Cycling attractions']['B2'].font)
ws['B3'] = ("Which side each route takes the climbs from, measured on the Ride with GPS tracks (2 Nov 2026). 'Climbs it' = the route gains at least 120 m "
            "in the 6 km before the top (Vall d'Ebo: at least 200 m of climbing, as the village lies below the pass). 'Passes over' = the route crosses it without climbing that side, "
            "usually coming down. Port de Bèrnia is measured at the mirador, which is not the top, so both sides count as climbs.")
ws['B3'].font = cnote; ws['B3'].alignment = Alignment(wrap_text=True, vertical='top'); ws.merge_cells('B3:H3'); ws.row_dimensions[3].height = 60
for j, h in enumerate(["Climb", "Side", "Route", "Climbs it?", "Climbing in the last 6 km (m)", "Height difference over the last 6 km (m)", "On website"], start=2):
    c = ws.cell(5, j, h); c.font = hf; c.fill = hfi; c.alignment = hal
r = 6
for pas, routes_ in cs.items():
    for rid, lst in routes_.items():
        if rid not in rw: continue
        for lab, climbed, net, gain in lst:
            for j, v in enumerate([pas, lab, names[rid], "Climbs it" if climbed else "Passes over", gain, net, "Yes" if rid in web else "No"], start=2):
                c = ws.cell(r, j, v); c.alignment = Alignment(wrap_text=True, vertical='top')
            r += 1
for col, w in zip("BCDEFGH", [30, 42, 52, 13, 14, 16, 10]):
    ws.column_dimensions[col].width = w
ws.freeze_panes = "C6"
wb.save(OUT)
print("routes", last_route_row - 5, "highlights", len(A))
