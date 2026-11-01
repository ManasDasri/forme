# Forme

A motion component studio for independent designers and ambitious studios.

**Editorial** is the first launch: twelve coordinated React components, a live gallery, editable previews, and dedicated usage documentation. **Object** and **Kinetic** have separate concept previews clearly marked coming soon. The site includes light and dark themes with persisted preference.

## Develop

Requires Node.js 22.12+ or 24+ and npm.

```sh
npm ci
npm run dev
```

Open the printed URL, normally http://localhost:5173.

```sh
npm test
npm run build
npm run preview
```

The production build type-checks, generates the free-preview registry, builds the app, creates refreshable static entry documents for all 21 subpages, and verifies Studio distribution boundaries. Output is `dist/` and can be served by a plain static host without history fallback rules.

## Pages

- `/` — interactive introduction, specimen switcher, drag interaction, and live motion playground
- `/collections/` — Editorial, Object, and Kinetic
- `/collections/editorial/` — twelve live demos; search, category and access filters; gallery density control
- `/collections/object/` and `/collections/kinetic/` — coming-soon concepts, with no invented release dates
- `/studio/` — planned paid edition with three working composition previews
- `/docs/` — installation, imports, and first-use guide
- `/docs/theming/`, `/docs/accessibility/`, `/docs/registry/` — detailed guides
- `/docs/<component-slug>/` — interactive workbench, usage, props, and free-preview source

## Release structure

| Free preview — nine pieces | Planned Studio edition — three compositions |
| -------------------------- | ------------------------------------------- |
| Editorial hero             | Scroll story                                |
| Project index              | Perspective layout                          |
| Image reveal               | Image accordion                             |
| Full-screen menu           |                                             |
| Expanding gallery          |                                             |
| Rolling link               |                                             |
| Magnetic button            |                                             |
| Focus cursor               |                                             |
| Type switcher              |                                             |

Studio source is excluded from `public/r/`, `public/registry.json`, and raw documentation imports. Its compiled implementation necessarily runs in the browser to provide live previews; this is not DRM. No checkout, customer authentication, or entitlement service is simulated. These must be implemented before selling downloads.

Free-preview designation describes the planned launch tier. The repository remains private and commercial licensing must be finalized before public release; see LICENSE. The split is provisional and easy to change in `src/catalog.ts`, `registry.json`, and the raw-source exclusion list in `src/Docs.tsx`.

## Install from the local registry

Run `npm run build` after changing component source, then keep `npm run dev` running. In another React project configured for shadcn:

```sh
npx shadcn@latest add http://localhost:5173/r/magnetic-button.json
```

The registry installs TypeScript and scoped CSS together. Target placeholders follow the consumer's configured components alias. Motion is installed where needed; rolling link uses CSS alone. Showcase fonts and photographs are not distributed with components.

```tsx
import { MagneticButton } from "@/components/forme/magnetic-button";

<MagneticButton onClick={() => console.log("Connect your action")}>
  Start a conversation
</MagneticButton>;
```

The current hosted v1 preview is private. This enhancement is prepared on `enhance-editorial` and is not deployed until requested. On public launch, replace localhost in the documentation commands with the public registry origin.

## Theme and accessibility

The initial theme follows the operating system. The header toggle saves an explicit choice in localStorage; a small initialization script avoids a flash of the other theme. Native form controls use the matching color scheme. Storage failures do not prevent theme switching.

Animations respect reduced motion. Controls use native buttons, links, and dialog behavior. The cursor lens is local to one image and preserves the native pointer; keyboard and touch can pin a centered lens. Pointer attraction switches off on touch. The scroll story includes chapter buttons as an alternative to scrolling.

## Structure

- `src/App.tsx` — pages and native navigation
- `src/ui.tsx` — shared navigation, theme switch, footer
- `src/Docs.tsx` — guides and component workbench
- `src/Demo.tsx` — showcase examples using the actual registry components
- `src/catalog.ts` — component descriptions, tiers, usage examples, props
- `src/registry/` — component TypeScript and scoped CSS
- `registry.json` — full private source manifest, including Studio metadata
- `scripts/build-registry.mjs` — generates nine public payloads and removes stale payloads
- `scripts/build-pages.mjs` — creates static entry documents for subpages
- `scripts/registry.test.mjs` and `scripts/verify-build.mjs` — source fidelity, static pages, Studio exclusion

## Before commercial launch

Finalize licensing and pricing; connect payments, authenticated downloads, and customer entitlements; run broader browser and assistive-technology checks; select a public domain and registry origin. Forme remains a working name pending trademark and domain checks.

## Credits and rights

Original source: Copyright © 2026 ManasDasri. All rights reserved. Third-party dependencies, fonts, and photography retain their own licenses. See [LICENSE](LICENSE), [CREDITS.md](CREDITS.md), and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). All demo studios and brands are fictional.
