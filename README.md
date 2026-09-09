# Statewise

An interactive field guide to the 50 United States, built with React and Vite.

[Open Statewise](https://h3manth.com/fun/statewise/)

![Statewise social preview](public/og-image.png)


https://github.com/user-attachments/assets/ea135d1d-25fb-4970-87e5-50ad838fb826


## Run locally

```sh
npm install
npm run dev
```

Open http://127.0.0.1:5173/fun/statewise/. Use `npm run build` for a production build and `npm run preview` to preview it.

## Features

- Interactive SVG map with Alaska and Hawaii insets, small-state shortcuts, labels, zoom, and region filters
- Search by state name, abbreviation, or capital
- State capitals, nicknames, admission years, and learned-state bookmarks
- Location, capital, and nickname quizzes with immediate feedback
- Progress saved in this browser using localStorage
- Responsive layouts, keyboard controls, and reduced-motion support

The five regions are learning groups, not the four official Census regions. Geographic geometry is bundled from us-atlas (Albers projection). The California photo uses Unsplash; typography uses Google Fonts. Those visual resources need an internet connection. Core state data and map geometry are bundled with the app.

## Browser smoke checks

With the development server running, run `npm test`. The test uses local Google Chrome on macOS; set `CHROME_PATH` to a different Chrome executable when needed. It verifies responsive widths, the map, search, region filters, quizzes, and persisted progress.

## Metadata and agent discovery

The static HTML includes canonical, Open Graph, Twitter Card, and WebApplication JSON-LD metadata. The social preview is a 1200×630 PNG. SVG/PNG favicons, an Apple touch icon, and a web manifest are included.

- `public/llms.txt`: human-readable and agent-readable app guide, linked with `rel="describedby"`
- `public/app.json`: machine-readable capabilities and data links
- `public/states.json`: all 50 state records, without requiring JavaScript
- `public/sitemap.xml`: canonical app URL

These make the app easier to discover and read; they do not guarantee search indexing or agent support. No MCP server or backend API is advertised.

## Visual assets

Run the asset-generation script in `scripts/generate-assets.mjs` to regenerate the social image and app icons. Set `CHROME_PATH` to use a different Chrome executable.

## Deployment

Vite builds for `/fun/statewise/`. Run `npm run build`, then copy the contents of `dist/` (including `.htaccess`) to `~/public_html/fun/statewise/` on the hosting server. Statewise is served directly by Apache; it needs no PM2 process or proxy configuration. Preview with `npm run preview` and open `/fun/statewise/` under the preview URL. The app does not require a Node server in production.

## Geographic data attribution

Map geometry is distributed with us-atlas, copyright 2013–2019 Michael Bostock. Its permission notice is included in `public/US-ATLAS-LICENSE.txt` and the deployed files.

## Narrated demo

[Watch the 41-second Statewise demo](https://h3manth.com/fun/statewise/statewise-narrated.mp4).

The HyperFrames source is in `videos/statewise/`, with captured app screens, captions, and Hemanth narration generated locally using Pocket TTS. Personal voice-conditioning files are not included.

To render the checked-in composition:

```sh
cd videos/statewise
npm run render -- --quality high --fps 30 --workers 2 --output renders/statewise-narrated.mp4
```

The published copy is `public/statewise-narrated.mp4`.
