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

`npm test` runs the registry, library, and trait tests. `npm run build` generates the public registry and measured sizes, type-checks, builds, writes refreshable static entries, and verifies that no Studio source reached the bundle.

## Signal, the first drop

25 components across four channels. 19 free, 6 Studio.

| Channel | Free | Studio |
| ------- | ---- | ------ |
| Buttons | Lens, Plasma, Hold to confirm, Scramble, Prism, Magnetic | Shutter |
| Shaders | Horizon, Liquid chrome, Warp field, Silk field, Dither terrain | Singularity, Caustic glass |
| ASCII | ASCII globe, Glyph rain, Decode text, ASCII orbit, ASCII reveal | ASCII tunnel, ASCII surface |
| HUD | Telemetry card, Radar sweep, Oscilloscope | Holo card |

## The edge: verifiable quality

- **Trait badges are tests.** Each component's badges (reduced motion, keyboard, pauses offscreen, pause control, WebGL fallback, zero deps) live in `src/catalog.ts`. `scripts/traits.test.mjs` reads the installed files and fails if a claimed behavior has no evidence in source, or if any render loop lacks an offscreen pause.
- **Measured size.** `scripts/build-registry.mjs` gzips every file the CLI would copy and writes `src/sizes.json`; the site shows those numbers.
- **Studio source never ships.** Studio components live in `studio/`, outside `src/`. The site shows recordings made by `npm run capture` (deterministic: a fake clock steps 1/30 s per frame and CSS animations are seeked to it). `scripts/verify-build.mjs` checks that distinctive Studio string literals, GLSL, and CSS selectors are absent from the built JS and CSS.

## Install a free component

In a React project with shadcn and import aliases configured:

```sh
npx shadcn@latest add https://forme.vercel.app/r/lens-button.json
npx shadcn@latest add https://forme.vercel.app/r/horizon-shader.json
```

Shaders share `shader-canvas.tsx` and `.css`; Scramble button includes `ascii-decode`. Magnetic button installs Motion. Everything else uses React and browser APIs only.

## Re-recording Studio previews

Requires ffmpeg and Playwright's Chromium (`npx playwright-core install chromium`).

```sh
npm run capture                 # all Studio pieces
npm run capture -- holo-card    # one piece
```

Outputs `public/studio/<slug>.mp4` and a poster `.jpg`.

## Layout

`src/App.tsx` pages, `src/Library.tsx` browsing, `src/Docs.tsx` playgrounds and guides (including `/docs/quality/`), `src/catalog.ts` metadata and traits, `src/registry/` free components, `studio/` paid components and the private capture page.

## Deploy

The linked Vercel project is `forme`. Machine-local linking and authentication are ignored by Git.

```sh
vercel deploy --prod --yes
vercel alias set <deployment-url> forme.vercel.app
```

Repeat the alias step after each CLI deployment. The project permits anonymous access so visitors and the shadcn CLI can use the preview and registry. Repository visibility remains private. `.vercelignore` excludes environment files, browser artifacts, Git, and research notes from uploads.

## Commercial release

Pricing, commercial terms, payments, and authenticated customer downloads are planned for the paid launch. Validate the offer with prospective studio buyers and test the assembled components across target browsers and assistive technology before that launch. Free describes source availability in this preview; the private pre-release repository does not grant commercial licensing.

Copyright © 2026 ManasDasri. All rights reserved. Third-party assets retain their licenses. See [LICENSE](LICENSE), [CREDITS.md](CREDITS.md), and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
