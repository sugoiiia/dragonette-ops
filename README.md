# Dragonette Ops

A single-page satellite operations dashboard mockup for a hyperspectral Earth observation startup. Portfolio piece — all data is simulated.

## What it demonstrates

- **Constellation status bar** — live countdown to next ground station pass, per-satellite status dots, today's capture and downlink metrics.
- **World map** — six satellites (Dragonette-1 through -6) animated along sinusoidal ground tracks at 180x speed. Fifteen imaging targets scattered globally, colour-coded by status. Click any marker for details.
- **Imaging request queue** — sortable table of active and completed imaging requests with priority badges and deadline dates.
- **Hyperspectral pixel viewer** — a false-colour tile overlaid with an 8x8 pixel grid. Hover or click any cell to display its full spectral reflectance curve (400-2500 nm) and a plain-language description. Five terrain types: vegetation, water, bare soil, urban/built, and snow/ice.

## Tech stack

- Vite + React 19
- Tailwind CSS v4 via @tailwindcss/vite
- react-leaflet v5 + CartoDB dark_matter tiles
- Recharts for the spectral chart
- Lucide React for icons

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:5173. Designed for 1440px+ screens.

## Project structure

```
src/
  data/
    satellites.js   -- 6 satellite records with orbital parameters
    targets.js      -- 15 imaging targets with coordinates and metadata
    spectra.js      -- 5 reference spectral curves with real-world reflectance values
  components/
    TopBar.jsx
    WorldMap.jsx
    RequestQueue.jsx
    HyperspectralViewer.jsx
```
