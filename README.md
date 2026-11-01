# Forme

Experimental React buttons, interactive shaders, and ASCII components for designers building distinctive websites.

Live preview: https://forme.vercel.app

## Develop and verify

Use Node.js 24+ and npm.

```sh
npm ci
npm run dev
npm test
npm run build
```

The Vite build creates refreshable static entries for all public pages, generates the public registry, and checks Studio source distribution boundaries. CI runs tests and the production build.

## Signal, the first drop

| Category | Free components               | Studio previews |
| -------- | ----------------------------- | --------------- |
| Buttons  | Prism button, Magnetic button | Shutter button  |
| Shaders  | Silk field, Dither terrain    | Orbital field   |
| ASCII    | ASCII orbit, ASCII reveal     | Signal text     |

The previous portfolio collection remains as unused source. It is excluded from the active catalog, runtime imports, documentation source, and public registry.

Studio previews run compiled browser code. Editable TypeScript is excluded from public registry payloads and raw-source documentation; this is distribution control, not DRM. Purchasing and customer downloads are not open yet.

## Install a free component

In a React project with shadcn and import aliases configured:

```sh
npx shadcn@latest add https://forme.vercel.app/r/prism-button.json
npx shadcn@latest add https://forme.vercel.app/r/silk-shader.json
```

The CLI follows your configured components alias and installs scoped CSS beside the TypeScript. Shaders share `shader-canvas.tsx` and `shader-canvas.css`; the registry includes both. Magnetic button installs Motion. Other current pieces use React and native browser APIs. Demo fonts and photographs are not installed.

The public registry builder reads the private root `registry.json`, omits Studio items, and removes stale generated payloads. Free documentation uses an explicit raw-source allowlist.

## Pages and behavior

- `/` — shader hero and interactive library
- `/components/` — search, category and access filters, sort, bookmarks, live previews
- `/bookmarks/` — saved components, persisted in this browser
- `/collections/` — Signal categories and next-drop status
- `/collections/buttons/`, `/collections/shaders/`, `/collections/ascii/` — filtered category libraries
- `/collections/next/` — coming soon, with no promised release date
- `/studio/` — the three Studio previews
- `/docs/` — usage, customization, accessibility, registry, and individual component playgrounds

Dark mode is the initial theme; the explicit choice persists across pages. Header search supports Cmd/Ctrl+K. Shaders support pointer movement, color and speed controls, a WebGL fallback, context restoration, reduced motion, and rendering suspension offscreen or in hidden tabs. ASCII orbit includes pause. ASCII reveal supports mouse, keyboard and touch. Source tabs include every file required by the selected free component.

`src/App.tsx` owns pages, `src/Library.tsx` browsing, `src/library-state.ts` filtering/bookmarks, `src/Docs.tsx` playgrounds and guides, and `src/registry/` installable components. No new runtime dependency was added for this revision.

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
