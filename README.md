# statewise

Interactive field guide to the 50 United States and India's 36 states and union territories.

```bash
npm install
```

## Quick start

```bash
npm run dev
```

`npm run dev` starts the local dev server at `http://127.0.0.1:5173/fun/statewise/`. `npm run build` compiles for production. `npm test` runs browser smoke tests.

## Demo

https://github.com/user-attachments/assets/ea135d1d-25fb-4970-87e5-50ad838fb826

Live version hosted at [h3manth.com/fun/statewise](https://h3manth.com/fun/statewise/).

## State data

```js
import { states as usStates } from './src/data.js';
import { states as inStates } from './src/india-data.js';

const texas = usStates.find((s) => s.abbr === 'TX');
const karnataka = inStates.find((s) => s.abbr === 'KA');
```

All state records are bundled statically with capitals, nicknames, formation years, and regions. Map geometry uses composite Albers for the US and Mercator paths for India.

## Smoke tests

```bash
npm test
```

Verifies SVG map rendering, responsive viewports (320px–1440px), search, region filters, quizzes, and localStorage persistence against headless Chrome.

## Agent discovery

```bash
curl -s https://h3manth.com/fun/statewise/llms.txt
curl -s https://h3manth.com/fun/statewise/app.json
curl -s https://h3manth.com/fun/statewise/states.json
curl -s https://h3manth.com/fun/statewise/india-states.json
```

- `public/llms.txt` — LLM-friendly documentation and guide
- `public/app.json` — machine-readable capabilities and data links
- `public/states.json` — all 50 US state records in plain JSON
- `public/india-states.json` — all 36 Indian states and union territories in plain JSON
- `public/sitemap.xml` — canonical app URL

## Video generation

```bash
cd videos/statewise
npm run render -- --quality high --fps 30 --workers 2 --output renders/statewise-narrated.mp4
```

Renders the narrated demo video using HyperFrames and local Pocket TTS audio.

## License

MIT © [Hemanth.HM](https://h3manth.com)
