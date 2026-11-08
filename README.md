# Forme

Components for interfaces that feel alive: shaders, ASCII, live instruments, and buttons for React. Source you install and own, with accessibility behavior that is checked against the code in CI.

Live preview: https://forme.vercel.app

## Develop and verify

Use Node.js 24+ and npm.

```sh
npm ci
npm run dev
npm test
npm run build
```

`npm test` runs the registry, library, and trait tests. `npm run build` generates the public registry and measured sizes, type-checks, builds, writes refreshable static entries.

## Signal, the first drop

53 components across ten categories, all free.

| Category | Components |
| -------- | ---------- |
| Buttons | Lens, Plasma, Hold to confirm, Scramble, Prism, Magnetic, Shutter |
| Shaders | Horizon, Mesh gradient, Light rays, Aurora, Silk field, Dither terrain, Caustic glass, Contours |
| ASCII | ASCII banner, ASCII tide, ASCII reveal, ASCII black hole, ASCII planet |
| HUD | Telemetry card, Radar sweep, Oscilloscope |
| Surfaces | Eclipse hero, Spotlight card, Beam card, Dot grid, Accordion, Marquee, Image compare |
| Inputs | Command palette, Glow input, Segmented switch, Signal slider, OTP input, Copy button |
| Loaders | Orbit loader, Infinity loader, Spinner, Typing dots, Equalizer, Skeleton, Shimmer text, Progress beam |
| Navigation | Dock, Glass nav, Animated tabs |
| Feedback | Toast, Tooltip |
| Text | Word rotator, Text reveal, Number ticker, Gradient text |

Run `node scripts/generate-registry.mjs` after adding or removing a component, and add a sample render for it in `scripts/smoke/fixtures.tsx` (a test fails until you do).

## Install smoke test

`.github/workflows/install-smoke.yml` runs on every pull request and push to `main`. It builds the registry, creates fresh Next.js and Vite apps, installs every component with the real shadcn CLI, builds both in strict TypeScript, and renders every component in Chromium. It fails on install, type, build, page, or console errors, or if a component renders nothing. To run it locally:

```sh
npm run build
npm install --no-save playwright@1.64.0 && npx playwright install chromium
npx vite preview --port 4173 &
node scripts/smoke/run.mjs http://127.0.0.1:4173
```

## The edge: verifiable quality

- **Trait badges are tests.** Each component's badges (reduced motion, keyboard, pauses offscreen, pause control, WebGL fallback, zero deps) live in `src/catalog.ts`. `scripts/traits.test.mjs` reads the installed files and fails if a claimed behavior has no evidence in source, or if any render loop lacks an offscreen pause.
- **Measured size.** `scripts/build-registry.mjs` gzips every file the CLI would copy and writes `src/sizes.json`; the site shows those numbers.

## Install a free component

In a React project with shadcn and import aliases configured:

```sh
npx shadcn@latest add https://forme.vercel.app/r/lens-button.json
npx shadcn@latest add https://forme.vercel.app/r/horizon-shader.json
```

Shaders share `shader-canvas.tsx` and `.css`; Scramble button includes its shared `ascii-decode` helper. Magnetic button installs Motion. Everything else uses React and browser APIs only.

## Layout

`src/App.tsx` pages, `src/Library.tsx` browsing, `src/Docs.tsx` playgrounds and guides (including `/docs/quality/`), `src/catalog.ts` metadata and traits, `src/registry/` components.

## Deploy

The linked Vercel project is `forme`. Machine-local linking and authentication are ignored by Git.

```sh
vercel deploy --prod --yes
vercel alias set <deployment-url> forme.vercel.app
```

Repeat the alias step after each CLI deployment. The project permits anonymous access so visitors and the shadcn CLI can use the preview and registry. Repository visibility remains private. `.vercelignore` excludes environment files, browser artifacts, Git, and research notes from uploads.

## License

[MIT](LICENSE). Use, change, and ship the components in personal and commercial projects; keep the copyright notice. Third-party assets keep their own licenses: the Unsplash photos used in previews (not included in installs) and the Instrument Sans font. See [CREDITS.md](CREDITS.md) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
