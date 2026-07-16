# Upsailor Labs Website — Project Documentation

## 1. Overview

A single-page marketing/landing site for **Upsailor Labs** (a software consulting company based in Dubai, UAE). Built with the **Lovable.dev** platform (AI-assisted app builder — note the `lovable-tagger` dev plugin and `lovable-uploads` asset folder), using a standard **Vite + React + TypeScript + shadcn/ui + Tailwind CSS** stack, with **Supabase** used solely as a backend for a contact-form Edge Function.

- **Package name**: `vite_react_shadcn_ts` (default Lovable scaffold name, unchanged)
- **Type**: Client-side rendered SPA, one real page (landing page) + a 404 fallback
- **Purpose**: Marketing site — pitches services, showcases case studies/testimonials, and captures leads via a contact form

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Build tool | Vite 5 (`@vitejs/plugin-react-swc`) |
| Language | TypeScript 5 |
| UI framework | React 18 |
| Routing | react-router-dom v6 |
| Styling | Tailwind CSS 3 + `tailwindcss-animate` + CSS variables for theming |
| Component library | shadcn/ui (Radix UI primitives + `class-variance-authority`) |
| Data/server state | `@tanstack/react-query` (installed, provider wired in `App.tsx`, not yet used by the landing page) |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers` (installed for future use; the current contact form uses plain React state) |
| Backend | Supabase (JS client) — only used to invoke one Edge Function |
| Email delivery | Resend API, called from a Supabase Edge Function |
| Testing | Vitest + `@testing-library/react` + jsdom |
| Linting | ESLint 9 (flat config) + typescript-eslint |
| Package manager | npm (`package-lock.json`) and/or Bun (`bun.lockb` present) |

## 3. Project Structure

```
├── index.html                     Vite entry HTML
├── src/
│   ├── main.tsx                   React root bootstrap
│   ├── App.tsx                    App shell: providers + router
│   ├── App.css, index.css         Global styles & Tailwind/CSS variables (design tokens)
│   ├── pages/
│   │   ├── Index.tsx              "/" route → renders LandingPage
│   │   ├── LandingPage.tsx        The entire one-page site (all sections in one file)
│   │   └── NotFound.tsx           catch-all "*" route (404)
│   ├── components/
│   │   ├── NavLink.tsx            react-router NavLink wrapper supporting active/pending classNames
│   │   └── ui/                    shadcn/ui component primitives (~40 files: button, dialog, form, sidebar, etc.)
│   ├── hooks/
│   │   ├── use-mobile.tsx         Media-query hook for responsive breakpoints
│   │   └── use-toast.ts           Toast state hook (used by shadcn toaster)
│   ├── integrations/supabase/
│   │   ├── client.ts              Supabase client instance (auto-generated, uses Vite env vars)
│   │   └── types.ts               Auto-generated DB types (currently an EMPTY schema — no tables/views defined)
│   ├── lib/utils.ts                `cn()` helper (clsx + tailwind-merge)
│   ├── assets/                    Logo + client logos (echave, estaon, manulife, stay22, telus, toursbylocals)
│   └── test/
│       ├── setup.ts               Vitest/jsdom + testing-library setup
│       └── example.test.ts        Placeholder test
├── supabase/
│   ├── config.toml                Supabase project config (project_id, function JWT settings)
│   └── functions/send-contact-email/index.ts   Deno Edge Function: sends contact form via Resend
├── public/                        Static assets (favicon, robots.txt, lovable-uploads/)
├── components.json                shadcn/ui CLI config (aliases, style, baseColor)
├── tailwind.config.ts             Design tokens: colors (HSL CSS vars), fonts, shadows, keyframes
├── vite.config.ts                 Dev server (port 8080), `@` alias → `src/`, lovable-tagger in dev mode
├── vitest.config.ts               Test runner config (jsdom, `@` alias)
├── eslint.config.js               Flat ESLint config
└── .env                           VITE_SUPABASE_PROJECT_ID / URL / PUBLISHABLE_KEY
```

## 4. Application Flow

1. `main.tsx` mounts `<App />` into `#root`.
2. `App.tsx` wires up global providers, in order: `QueryClientProvider` → `TooltipProvider` → toaster components (`Toaster`, `Sonner`) → `BrowserRouter`.
3. Routes:
   - `/` → `Index` → `LandingPage`
   - `*` → `NotFound`
4. `LandingPage.tsx` is a self-contained, single-file page composed of local sub-components (not extracted to `components/`): `Header`, `Hero`, `ClientsCarousel`, `Services`, `Work`, `Testimonials`, `Values`, `Process`, `FAQ`, `Contact`, `FinalCTA`, `Footer`. All content (nav links, services, case studies, testimonials, values, process steps, FAQs) is defined as static data arrays at the top of the file.
5. Navigation is anchor-based smooth-scrolling to section IDs (`#services`, `#work`, `#testimonials`, `#values`, `#process`, `#faq`, `#contact`) — there are no separate routed pages besides the 404.

## 5. Contact Form → Email Pipeline

1. User fills out the form in the `Contact` section of `LandingPage.tsx` (name, company, email, message — plain `useState`, no schema validation beyond `required`/`type=email` HTML attributes).
2. On submit, the client calls `supabase.functions.invoke("send-contact-email", { body: form })`.
3. The Supabase Edge Function `supabase/functions/send-contact-email/index.ts` (Deno runtime):
   - Handles CORS preflight (`OPTIONS`)
   - Validates required fields (`name`, `email`, `message`) and email format via regex
   - Calls the **Resend** API (`https://api.resend.com/emails`) using `RESEND_API_KEY` from the function's environment
   - Sends the lead notification to `contact@upsailorlabs.com`, with `reply_to` set to the submitter's email
   - Returns JSON success/error responses
4. `supabase/config.toml` sets `verify_jwt = false` for this function — it's intentionally public/unauthenticated (needed since anonymous website visitors call it).

**Note**: The Supabase database schema (`src/integrations/supabase/types.ts`) is currently empty — no tables, views, or enums are defined. Supabase is used here purely as a function-invocation gateway, not for data storage.

## 6. Styling & Design System

- Tailwind is configured with `darkMode: ["class"]` and a full theming layer via CSS custom properties (defined in `src/index.css`, consumed in `tailwind.config.ts`): `background`, `foreground`, `primary`, `secondary`, `accent` (+ `dim`/`glow`/`light`/`subtle` variants), `surface-1/2/3`, `card`, `popover`, `sidebar-*`, etc.
- Custom fonts: `Space Grotesk` (display), `Inter` (body), `JetBrains Mono` (mono).
- Custom shadows (`glow`, `card`), keyframe animations (`accordion-down/up`, `float`), and background gradients are defined as Tailwind extensions.
- `components.json` configures the shadcn/ui CLI: default style, slate base color, CSS variables enabled, path aliases (`@/components`, `@/lib`, `@/hooks`, `@/components/ui`).
- `src/lib/utils.ts` exports `cn()`, the standard shadcn helper combining `clsx` + `tailwind-merge`.

## 7. Environment Variables

Defined in `.env` (not committed values shown — names only):

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID |

Server-side (Edge Function only, not in this repo's `.env`): `RESEND_API_KEY` — must be configured as a Supabase Edge Function secret.

## 8. Scripts

| Command | Effect |
|---|---|
| `npm run dev` | Start Vite dev server on port 8080 |
| `npm run build` | Production build |
| `npm run build:dev` | Build in development mode |
| `npm run lint` | ESLint over the project |
| `npm run preview` | Preview a production build locally |
| `npm run test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |

## 9. Testing

- Vitest + jsdom + Testing Library are fully configured (`vitest.config.ts`, `src/test/setup.ts`) but the only existing test is a placeholder (`src/test/example.test.ts`). There is currently no real test coverage for `LandingPage`, `NavLink`, hooks, or the Edge Function.

## 10. Notable Observations / Potential Follow-ups

- **Lovable-managed project**: `README.md` and `vite-tagger` indicate this repo is synced with Lovable.dev — edits made there auto-commit here, and vice versa. `README.md` still contains an unfilled `REPLACE_WITH_PROJECT_ID` placeholder in the Lovable project URLs.
- **Installed but unused**: `react-query`, `react-hook-form`, `zod`, `@hookform/resolvers`, and most shadcn/ui components (`sidebar`, `carousel`, `command`, `chart`, `calendar`, etc.) are present as dependencies but not referenced by `LandingPage.tsx`, which uses plain state and hand-rolled markup instead. They're likely scaffolding leftover from the Lovable/shadcn template.
- **Empty Supabase schema**: no database tables exist yet — Supabase is only a function gateway today.
- **No client-side validation library used on the contact form** despite `zod`/`react-hook-form` being installed — validation is HTML-native plus a server-side regex/required-field check.
- **Nested duplicate `<p>` tag** in `Footer` (`src/pages/LandingPage.tsx`, footer address line) — cosmetic/markup nit, not functional.
- **Single-file page**: `LandingPage.tsx` is ~850 lines containing all content data + all section components. Fine for a marketing page but a candidate for splitting into `components/sections/*` if the page grows further.
