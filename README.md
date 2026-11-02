# Mirava website data

Public data files used by www.mirava.travel. Only content that is already shown on the website belongs here: no prices, contracts or customer data.

| File | Used by | What it holds |
|---|---|---|
| `bike-routes-data.json` | /bike-routes (highlights map and "Find your ride" cards) | Routes from Ride with GPS (name, section on the page, distance, climbing, simplified track), cycling highlights with the routes that pass them, and which side each climb is ridden from |
| `bike-routes.js` | /bike-routes | The "Find your ride" cards and the highlights map (Leaflet, OpenStreetMap street map, toned down). Reads `bike-routes-data.json`. |

The data is generated from the Mirava itineraries spreadsheet (tabs Bike routes, Cycling attractions and Climb sides) and the GPS tracks on Ride with GPS. Update the spreadsheet first, then regenerate the file.

## Squarespace code block (bike routes page)

```html
<div id="mv-fyr"></div>
<script src="https://mirava-travel.github.io/mirava-website-data/bike-routes.js"></script>
```

Files are served by GitHub Pages (Settings → Pages → Deploy from branch `main`, folder `/`). Changes are live within about 10 minutes of a push.
