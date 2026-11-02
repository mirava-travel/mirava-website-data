# How the bike routes page is maintained

Written 2 Nov 2026 so that any future Claude chat (or person) can pick this up without the original conversation.

## Where things live

| What | Where |
|---|---|
| Master data (routes, highlights, climb sides, itineraries) | `Mirava_itineraries.xlsx` in OneDrive › Work › Mirava › Mirava Operations – tabs **Bike routes**, **Cycling attractions**, **Climb sides**, **Bikes & Bites days**. Old versions go to the Archive subfolder. |
| GPS routes | Olaf's Ride with GPS account (routes are public). Six race routes on the page belong to other riders. |
| Website data | `bike-routes-data.json` in this repository |
| Website code | `bike-routes.js` in this repository – cards, highlights map, "All routes" heading, hotel favorites |
| Delivery | GitHub Pages: `https://mirava-travel.github.io/mirava-website-data/` – live about 10 minutes after a push. (jsDelivr was tried first and served stale files; don't go back to it.) |
| Squarespace | Page /bike-routes/en. Code block 1 (after the intro): `<div id="mv-fyr"></div><script src="https://mirava-travel.github.io/mirava-website-data/bike-routes.js"></script>`. Code block 2 (after "Real Stretches & Race Routes"): `<div id="mv-fav"></div>`. The route list itself is ordinary Squarespace list sections, edited by hand. |

## Structure of `bike-routes-data.json`

- `routes` – keyed by Ride with GPS id: `n` name (must equal the route title on the page, so "On this page" links work), `s` section on the page or "Not on website", `km`, `m` (climbing).
- `tracks` – id → polyline-encoded track, one point every ~300 m.
- `hl` – highlights: `t` type (Famous climbs, Local climbs, Great views, Beautiful nature, Villages wine and culture, Architecture, Cycling cafés and restaurants), `n` name, `w` description, `r` route ids, `la`/`lo` marker position (null = not on the map).
- `sides` – climb name → route id → list of [side label, climbs it (true) / passes over (false)].
- `favorites` – the "From the hotel door" section: groups per hotel, each item = route id + text.
- `land` – old coastline outline from the mock-up (no longer used by the live map).

## Adding or changing a route

1. Olaf makes the route public on Ride with GPS and gives the link (or asks to check the whole account).
2. In a browser logged in to Ride with GPS, run the snippets in `tools/browser_snippets.js`: route details + encoded track, and climb sides for any pass it crosses.
3. Match highlights: a route passes a highlight if its track comes within the radius used in `tools/highlight_hits.json` (300 m for passes, 100–700 m for villages, 350 m for cafés; Peñón de Ifach 1.6 km, Montgó 1 km). Climbs only count as "climbs it" if the route gains ≥120 m in the 6 km before the top (Vall d'Ebo: ≥200 m of climbing).
4. Update the spreadsheet tabs (archive the old file first). `tools/build_spreadsheet_tabs.py` rebuilds Bike routes, Cycling attractions and Climb sides from these inputs; it keeps the route names the Bikes & Bites days tab uses.
5. Update `bike-routes-data.json` (route, track, highlight lists, sides; `favorites` if it's a hotel ride). Push. Check the live page after ~10 minutes.
6. If the route is new on the page, Olaf adds it to the right Squarespace list section with the same title as `n`.

## Decisions so far

- Flat = ≤10 m climbing per km (≤80 km); rolling = 10–15 m/km (≤60 km). Computed in the script.
- Two older Ride with GPS routes are hidden (Jávea Old Town to Arenal, Dénia Las Marinas from El Verger).
- Syncrosfera → Bodega Montesanco one-way rides are kept out of the page (they only work with a lift back); they stay in the itineraries.
- Port de Bèrnia is measured at the mirador, which is not the top, so both sides count as climbs.
- Map tiles: OpenStreetMap, shown greyscale and faded so the routes stand out (CARTO now needs an API key).
- Texts are English only so far; Norwegian and Spanish versions still to do.
