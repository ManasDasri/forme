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

46 components across ten categories, all free.

| Category | Components |
| -------- | ---------- |
| Buttons | Lens, Plasma, Hold to confirm, Scramble, Prism, Magnetic, Shutter |
| Shaders | Horizon, Liquid chrome, Aurora, Silk field, Dither terrain, Singularity, Caustic glass |
| ASCII | ASCII globe, ASCII tide, Decode text, ASCII orbit, ASCII reveal, ASCII black hole, ASCII surface |
| HUD | Telemetry card, Radar sweep, Oscilloscope, Orbit gauge |
| Surfaces | Eclipse hero, Spotlight card, Beam card, Accordion, Marquee, Image compare |
| Inputs | Command palette, Glow input, Segmented switch, Signal slider, OTP input, Copy button |
| Loaders | Orbit loader, Shimmer text, Progress beam |
| Navigation | Dock, Animated tabs |
| Feedback | Toast, Tooltip |
| Text | Text reveal, Number ticker |

Run `node scripts/generate-registry.mjs` after adding or removing a component.

## The edge: verifiable quality

- **Trait badges are tests.** Each component's badges (reduced motion, keyboard, pauses offscreen, pause control, WebGL fallback, zero deps) live in `src/catalog.ts`. `scripts/traits.test.mjs` reads the installed files and fails if a claimed behavior has no evidence in source, or if any render loop lacks an offscreen pause.
- **Measured size.** `scripts/build-registry.mjs` gzips every file the CLI would copy and writes `src/sizes.json`; the site shows those numbers.

## Install a free component

In a React project with shadcn and import aliases configured:

```sh
npx shadcn@latest add https://forme.vercel.app/r/lens-button.json
npx shadcn@latest add https://forme.vercel.app/r/horizon-shader.json
```

Shaders share `shader-canvas.tsx` and `.css`; Scramble button includes `ascii-decode`. Magnetic button installs Motion. Everything else uses React and browser APIs only.

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

All components are published for free through the public registry, but a license has not been chosen yet: `LICENSE` still reserves all rights. Choose and publish one before promoting the library.

Copyright © 2026 ManasDasri. All rights reserved. Third-party assets retain their licenses. See [LICENSE](LICENSE), [CREDITS.md](CREDITS.md), and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
