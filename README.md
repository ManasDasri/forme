# Forme

A motion component studio for independent designers and ambitious studios.

The first release is **Editorial**: six coordinated React components with interactive previews, editable demo text, TypeScript source, CSS, usage documentation, and a shadcn-compatible registry.

## Develop

Requires Node.js 22.12+ or 24+ and npm.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite, normally http://localhost:5173.

```sh
npm test
npm run build
npm run preview
```

The build type-checks the application, regenerates the registry, and produces a static site in `dist/`.

## Components

| Component | Interaction |
| --- | --- |
| Editorial hero | Coordinated type and image entrance |
| Project index | Pointer, keyboard, and touch selection with image preview |
| Image reveal | Toggle an image's mask with click, tap, Enter, or Space |
| Full-screen menu | Native modal navigation with focus trapping and Escape |
| Expanding gallery | Selectable image panels |
| Rolling link | Animated label on hover and keyboard focus |

Source lives in `src/registry/`. Every component imports its own scoped stylesheet and respects reduced motion. Components with JavaScript animation depend on `motion`; the rolling link uses CSS alone. Fonts and example images belong to the showcase, not the distributed component files.

## Install from the development registry

Run `npm run build` once to generate the JSON, then `npm run dev`. In an existing React project configured for shadcn:

```sh
npx shadcn@latest add http://localhost:5173/r/editorial-hero.json
```

The registry uses `@components/forme/` target placeholders, so files follow the consumer project's `components.json` alias. TypeScript and CSS are installed together. Choose any slug from `registry.json`.

```tsx
import { EditorialHero } from '@/components/forme/editorial-hero'

<EditorialHero
  brand="Your studio"
  title="Room to feel."
  subtitle="Spaces for a slower kind of living."
  image="/your-image.jpg"
  alt="A sunlit interior with natural materials"
/>
```

Use a current shadcn CLI supporting registry target placeholders. To publish the registry, deploy `dist/` to a public static host and replace the local URL with your public origin. The current Sites preview and GitHub repository are private; unauthenticated hosted CLI installation is intentionally unavailable until public launch.

## Project structure

- `src/App.tsx` — gallery, filters, search, documentation dialogs
- `src/catalog.ts` — component descriptions and usage examples
- `src/registry/` — the exact components rendered in previews and distributed by the registry
- `registry.json` — registry source manifest
- `scripts/build-registry.mjs` — generates `public/r/*.json`
- `scripts/registry.test.mjs` — verifies registry source fidelity and portability
- `public/images/` — local example photography

## Release status

Development preview. Checkout, customer accounts, paid entitlements, final commercial licensing, and directory submissions are not implemented. No payment or signup flow is simulated. Forme is a working name; trademark and domain availability have not been verified.

Before commercial launch: test with agency customers, settle licensing and pricing, connect a payment and entitlement provider, run broader browser/accessibility checks, and publish the intended free registry publicly.

## Credits

Demo photography is sourced from Unsplash, with source IDs recorded in [CREDITS.md](CREDITS.md). Demo studios and brands are fictional. DM Sans and Space Grotesk are self-hosted via Fontsource under their bundled OFL licenses. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Rights

Copyright © 2026 ManasDasri. All rights reserved. This private development repository does not grant a public or commercial redistribution license. Third-party assets and dependencies retain their own licenses. See [LICENSE](LICENSE).
