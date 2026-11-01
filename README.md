# Forme

An independent interaction studio for developers building distinctive client websites.

Editorial is the first release. This revision centers the five strongest initial pieces and adds four project-presentation interactions. Object and Kinetic remain coming-soon releases with photography-led studies rather than placeholder graphics.

## Develop and verify

Requires Node.js 22.12+ or newer and npm.

```sh
npm ci
npm run dev
npm test
npm run build
```

`dist/` contains a static site with refreshable entry documents for all 18 subpages. The build verifies page entries and Studio distribution boundaries. The Vercel configuration builds this directory directly.

## The active collection

| Free preview — six pieces | Planned Studio edition — three compositions |
| --- | --- |
| Project index | Case-study stage |
| Form & structure gallery | Project reel |
| Focus cursor | Preview navigation |
| Magnetic button | |
| Image reveal | |
| Image compare | |

Previous experiments remain in source history and in unused component files; they are excluded from the active catalog, public registry, documentation raw imports, and runtime demo imports.

Studio demos run compiled client code. Editable TypeScript and CSS are excluded from public registry payloads and raw-source documentation; this is source distribution control, not DRM. Purchasing and authenticated customer downloads are not yet implemented.

## Install a free piece

Use the current public site origin, or run Forme locally and use its printed URL:

```sh
npx shadcn@latest add http://localhost:5173/r/image-compare.json
```

The CLI uses the consumer's configured components alias and installs TypeScript and scoped CSS together. Motion is installed where required. Image compare uses native range input and CSS without an animation dependency. Fonts and demo photos are not distributed with components.

## Pages

- `/` — full-width working project index, selected interactions, Studio preview, and release studies
- `/collections/` — the release series
- `/collections/editorial/` — live component library, filters, search, tier separation
- `/collections/object/`, `/collections/kinetic/` — forthcoming directions
- `/studio/` — complete project-presentation previews
- `/docs/` — installation and usage
- `/docs/theming/`, `/docs/accessibility/`, `/docs/registry/` — implementation guides
- `/docs/<slug>/` — interactive workbench, usage, props, and free source

Light and dark themes follow system preference initially, with an explicit choice remembered locally. Pointer, keyboard, touch, and reduced-motion behavior are part of the component implementations.

## Implementation

`src/App.tsx` contains the pages, `src/ui.tsx` the shared navigation/theme controls, `src/Docs.tsx` the documentation, `src/Demo.tsx` the real component examples, and `src/catalog.ts` the active catalog. Exact source lives in `src/registry/`.

`registry.json` is the private source manifest. The registry builder emits only free pieces and removes stale generated payloads. Public docs use an explicit source allowlist. Tests check source fidelity and the production build checks the Studio boundary.

[Product direction and research](docs/product-direction.md) records the evidence, hypotheses, and visual decisions behind this revision. Buyer willingness to pay has not been validated.

## Deploy

The Vercel project is `forme`. Authentication and project linking are machine-local and ignored by Git.

```sh
vercel deploy --prod
```

`vercel.json` sets Vite, the build command, static output, and clean paths. `.vercelignore` excludes local environment files, browser artifacts, Git, and research files from uploads. Do not publish the repository or customer source as part of a static deploy.

## Before commercial launch

Finalize commercial terms and pricing; connect payments and authenticated downloads; conduct broader browser and assistive-technology testing; validate the offer with studio buyers. Free-preview designation describes the planned launch tier. Commercial licensing is not granted by this private pre-release repository.

Original source: Copyright © 2026 ManasDasri. All rights reserved. Third-party assets retain their licenses. See [LICENSE](LICENSE), [CREDITS.md](CREDITS.md), and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Example brands and projects are fictional.
