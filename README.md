# statewise

Interactive field guide to the 50 United States.

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
import { states, regions } from './src/data.js';

const texas = states.find((s) => s.abbr === 'TX');
// { id: '48', name: 'Texas', abbr: 'TX', capital: 'Austin', region: 'Southwest', nickname: 'Lone Star State', year: 1845 }
```

All 50 state records are bundled statically with capitals, nicknames, admission years, and regions. Map geometry uses Albers composite projection via `us-atlas`.

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
```

- `public/llms.txt` — LLM-friendly documentation and guide
- `public/app.json` — machine-readable capabilities and data links
- `public/states.json` — all 50 state records in plain JSON
- `public/sitemap.xml` — canonical app URL

## Video generation

```bash
cd videos/statewise
npm run render -- --quality high --fps 30 --workers 2 --output renders/statewise-narrated.mp4
```

Renders the narrated demo video using HyperFrames and local Pocket TTS audio.

## License

MIT © [Hemanth.HM](https://h3manth.com)
