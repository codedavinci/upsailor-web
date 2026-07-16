# Upsailor Labs Website

A single-page marketing/landing site for **Upsailor Labs** (a software consulting company based in Dubai, UAE). Built with **Vite + React + TypeScript + shadcn/ui + Tailwind CSS**, with **Supabase** used solely to host a contact-form Edge Function that sends email via **Resend**.

- **Type**: Client-side rendered SPA — one real page (the landing page) + a 404 fallback
- **Purpose**: Pitches services, showcases case studies/testimonials, and captures leads via a contact form
- **Origin**: Scaffolded with [Lovable.dev](https://lovable.dev) (an AI app builder) — hence the `lovable-tagger` dev dependency and `lovable-uploads` asset folder

---

## Tech stack

| Layer | Technology | Why it's here |
|---|---|---|
| Build tool | Vite 5 (`@vitejs/plugin-react-swc`) | Fast dev server + production bundler |
| Language | TypeScript 5 | Catches type mismatches before runtime |
| UI framework | React 18 | Component-based UI |
| Routing | react-router-dom v6 | Wired up, but this site is one page — mostly handles the 404 fallback |
| Styling | Tailwind CSS 3 + `tailwindcss-animate` + CSS variables | Utility-class styling, theming via design tokens |
| Component library | shadcn/ui (Radix UI primitives + `class-variance-authority`) | Pre-built, accessible UI pieces you own and can edit directly |
| Data/server state | `@tanstack/react-query` | Installed, provider wired in `App.tsx`, not yet used by the landing page |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers` | Installed for future use — the current contact form uses plain React state |
| Backend | Supabase (JS client) | Only used to invoke one Edge Function; no database tables exist |
| Email delivery | Resend API | Called from the Supabase Edge Function, not from the browser |
| Testing | Vitest + `@testing-library/react` + jsdom | Configured; minimal test coverage today |
| Linting | ESLint 9 (flat config) + typescript-eslint | |
| Package manager | npm (`package-lock.json`) and/or Bun (`bun.lockb`) | Either works |

**Installed but unused today**: `react-query`, `react-hook-form`, `zod`, `@hookform/resolvers`, and most `src/components/ui/*` primitives (`sidebar`, `carousel`, `command`, `chart`, `calendar`, etc.) are scaffolding leftover from the Lovable/shadcn template — safe to ignore until a feature actually needs them.

---

## Getting started

```bash
npm install       # or bun install — bun.lockb is present too
npm run dev       # starts Vite on http://localhost:8080
```

That's enough to browse the whole site locally. The contact form's *submission* only works end-to-end once the linked Supabase project has:
- The `send-contact-email` function deployed: `supabase functions deploy send-contact-email`
- A `RESEND_API_KEY` secret set: `supabase secrets set RESEND_API_KEY=...`

### Available scripts

| Command | Effect |
|---|---|
| `npm run dev` | Start Vite dev server on port 8080 |
| `npm run build` | Production build |
| `npm run build:dev` | Build in development mode |
| `npm run lint` | ESLint over the project |
| `npm run preview` | Preview a production build locally |
| `npm run test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |

---

## How the site works

1. `index.html` loads `src/main.tsx`, which mounts `<App />` into `#root`.
2. `src/App.tsx` wraps everything in providers — `QueryClientProvider` → `TooltipProvider` → toast components (`Toaster`, `Sonner`) → `BrowserRouter` — and defines two routes: `/` → `Index` (renders `LandingPage`), and `*` → `NotFound`.
3. `src/pages/LandingPage.tsx` is the entire site: a self-contained file rendering `Header → Hero → ClientsCarousel → Services → Work → Testimonials → Values → Process → FAQ → Contact → FinalCTA → Footer`, in order.
4. Nav links don't navigate anywhere — clicking "Services", "Work", etc. smooth-scrolls to a section on the same page (`#services`, `#work`, `#testimonials`, `#values`, `#process`, `#faq`, `#contact`).

All page copy — service descriptions, case studies, testimonials, FAQ text — lives as static data arrays near the top of `LandingPage.tsx` (`SERVICES`, `CASES`, `TESTIMONIALS`, `FAQS`, etc.). **To change the words on the site, you're almost always editing one of those arrays**, not hunting through JSX markup.

### Project structure

```
├── index.html                     Vite entry HTML
├── src/
│   ├── main.tsx                   React root bootstrap
│   ├── App.tsx                    App shell: providers + router
│   ├── App.css, index.css         Global styles & Tailwind/CSS variables (design tokens)
│   ├── pages/
│   │   ├── Index.tsx               "/" route → renders LandingPage
│   │   ├── LandingPage.tsx         The entire one-page site (content data + every section component)
│   │   └── NotFound.tsx            catch-all "*" route (404)
│   ├── components/
│   │   ├── NavLink.tsx             react-router NavLink wrapper supporting active/pending classNames
│   │   └── ui/                     shadcn/ui component primitives (~40 files: button, dialog, form, sidebar, etc.)
│   ├── hooks/
│   │   ├── use-mobile.tsx          Media-query hook for responsive breakpoints
│   │   └── use-toast.ts            Toast state hook (used by shadcn toaster)
│   ├── integrations/supabase/
│   │   ├── client.ts               Supabase client instance (auto-generated, uses Vite env vars)
│   │   └── types.ts                Auto-generated DB types (currently an EMPTY schema — no tables/views defined)
│   ├── lib/utils.ts                `cn()` helper (clsx + tailwind-merge)
│   ├── assets/                     Logo + client logos (echave, estaon, manulife, stay22, telus, toursbylocals)
│   └── test/
│       ├── setup.ts                Vitest/jsdom + testing-library setup
│       └── example.test.ts         Placeholder test
├── supabase/
│   ├── config.toml                 Supabase project config (project_id, function JWT settings)
│   └── functions/send-contact-email/index.ts   Deno Edge Function: sends contact form via Resend
├── public/                         Static assets (favicon, robots.txt, lovable-uploads/)
├── components.json                 shadcn/ui CLI config (aliases, style, baseColor)
├── tailwind.config.ts              Design tokens: colors (HSL CSS vars), fonts, shadows, keyframes
├── vite.config.ts                  Dev server (port 8080), `@` alias → `src/`, lovable-tagger in dev mode
├── vitest.config.ts                Test runner config (jsdom, `@` alias)
├── eslint.config.js                Flat ESLint config
└── .env                            VITE_SUPABASE_PROJECT_ID / URL / PUBLISHABLE_KEY (gitignored)
```

---

## The contact form → email pipeline

This is the only part of the "static" site that talks to a server, and the only backend flow worth understanding well.

```
 Visitor's browser                Supabase Edge Function              Resend
┌───────────────────┐            ┌─────────────────────────┐       ┌──────────┐
│  Contact form      │  invoke    │ send-contact-email        │  POST │  Sends   │
│  (name, email,     │ ─────────▶ │ (Deno function, runs      │ ────▶ │  the     │
│  company, message) │            │  on Supabase's servers)   │       │  email   │
└───────────────────┘            └─────────────────────────┘       └──────────┘
                                          │
                                          ▼
                                  reads RESEND_API_KEY
                                  from its own secret
                                  environment (never
                                  sent to the browser)
```

1. **The form** (`Contact` component in `LandingPage.tsx`) holds `name`, `company`, `email`, `message` in plain React `useState` — no form library involved despite `react-hook-form`/`zod` being installed. Validation beyond `required`/`type=email` HTML attributes happens server-side.
2. **On submit**, the browser calls `supabase.functions.invoke("send-contact-email", { body: form })` via the Supabase client (`src/integrations/supabase/client.ts`), authenticated with the public `VITE_SUPABASE_PUBLISHABLE_KEY` — a key that's *meant* to be visible in browser code.
3. **Supabase routes the request** to the Edge Function at `supabase/functions/send-contact-email/index.ts` — a small Deno script running on Supabase's infrastructure, not in the browser.
4. **The function**:
   - Handles the CORS preflight browsers send automatically (`OPTIONS` requests)
   - Validates that `name`, `email`, and `message` were provided, and that the email looks valid via regex
   - Calls Resend's API (`https://api.resend.com/emails`) using an API key read from its own environment (`Deno.env.get("RESEND_API_KEY")`) — never shipped to the browser
   - Sends the lead notification to `contact@upsailorlabs.com`, with `reply_to` set to the submitter's email so replying goes straight to them
   - Returns a JSON success/error response
5. `supabase/config.toml` sets `verify_jwt = false` for this function — intentional, since anonymous website visitors need to call it without being logged in.

Why not call Resend directly from the browser? Because that would mean shipping the Resend API key inside the JS bundle, where anyone could copy it from devtools and send email as you. The Edge Function exists specifically to keep that key server-side.

**Note**: `src/integrations/supabase/types.ts` is currently an empty schema — Supabase is used here purely as a function-invocation gateway, not for data storage.

---

## Environment variables & secrets

This project has two categories of configuration — mixing them up is the most common way to break something or leak something:

| | Lives in | Visible to the browser? | Example |
|---|---|---|---|
| **Public config** | `.env` at the project root, prefixed `VITE_` | **Yes** — Vite bakes these into the JS bundle | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` |
| **Server secret** | Supabase Edge Function secrets (`supabase secrets set` or the dashboard) | **No** — only readable inside the function at runtime | `RESEND_API_KEY` |

Rule of thumb: if a value grants write access, costs money per use, or should never be public, it does **not** belong in `.env` — it belongs in Supabase's function secrets, the same way `RESEND_API_KEY` does.

---

## Styling & design system

- Tailwind is configured with `darkMode: ["class"]` and a full theming layer via CSS custom properties (defined in `src/index.css`, consumed in `tailwind.config.ts`): `background`, `foreground`, `primary`, `secondary`, `accent` (+ `dim`/`glow`/`light`/`subtle` variants), `surface-1/2/3`, `card`, `popover`, `sidebar-*`, etc.
- Custom fonts: `Space Grotesk` (display), `Inter` (body), `JetBrains Mono` (mono).
- Custom shadows (`glow`, `card`), keyframe animations (`accordion-down/up`, `float`), and background gradients are defined as Tailwind extensions.
- `components.json` configures the shadcn/ui CLI: default style, slate base color, CSS variables enabled, path aliases (`@/components`, `@/lib`, `@/hooks`, `@/components/ui`).
- `src/lib/utils.ts` exports `cn()`, the standard shadcn helper combining `clsx` + `tailwind-merge`.

---

## Testing

Vitest + jsdom + Testing Library are fully configured (`vitest.config.ts`, `src/test/setup.ts`), but the only existing test is a placeholder (`src/test/example.test.ts`). There is currently no real test coverage for `LandingPage`, `NavLink`, hooks, or the Edge Function.

---

## Editing this project

- **Use Lovable**: this repo is synced with [Lovable.dev](https://lovable.dev) — edits made there auto-commit here, and vice versa.
- **Use your own IDE**: clone the repo, `npm install`, `npm run dev`, then push changes as usual.
- **Edit directly on GitHub**: use the pencil icon on any file, or open a Codespace from the "Code" → "Codespaces" tab.
- **Deploy**: open the project in Lovable and use Share → Publish, or build (`npm run build`) and host the static output anywhere.

---

## Glossary (for anyone newer to these tools)

- **Edge Function** — a small server-side function, deployed close to users geographically for low latency. Functionally, a tiny API endpoint you don't need to run a whole server for.
- **Anon / publishable key** — a Supabase API key *designed* to be public. It identifies which project you're talking to; it doesn't grant broad access on its own (access rules are enforced separately).
- **CORS preflight (`OPTIONS` request)** — before certain cross-origin requests, browsers first ask the server "are you okay receiving this?" via an automatic `OPTIONS` request. The Edge Function has to answer that or the real request never gets sent.

---

## Notable observations / potential follow-ups

- `react-query`, `react-hook-form`, `zod`, `@hookform/resolvers`, and most unused shadcn/ui components are present as dependencies but not referenced by `LandingPage.tsx` — likely scaffolding leftover from the Lovable/shadcn template.
- No client-side validation library is used on the contact form despite `zod`/`react-hook-form` being installed — validation is HTML-native plus a server-side regex/required-field check.
- `LandingPage.tsx` is ~850 lines containing all content data + all section components. Fine for a marketing page, but a candidate for splitting into `components/sections/*` if the page grows further.
