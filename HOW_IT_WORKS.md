# How This Project Works

A plain-language walkthrough of the Upsailor Labs website — what it's built with, how the pieces fit together, and what happens when someone visits the site or fills out the contact form.

> Looking for a dense technical reference instead? See `DOCUMENTATION.md`. This file is the "explain it to me like I'm new here" version.

---

## 1. What this actually is

One marketing web page. Not a multi-page site, not an app with a database — a single scrolling page (hero, services, work, testimonials, values, process, FAQ, contact form, footer) built to pitch Upsailor Labs and capture leads through the contact form. The only moving backend part is: **contact form → sends an email**.

It was originally scaffolded by [Lovable.dev](https://lovable.dev) (an AI app builder), which is why you'll see a `lovable-tagger` dev dependency and a `lovable-uploads` folder — cosmetic leftovers from that origin, not something you need to touch.

---

## 2. The building blocks, and why each one is there

| Tool | What it is | Why it's here |
|---|---|---|
| **Vite** | A fast dev server + build tool | Turns your TypeScript/React code into something a browser can run, with instant reload while you code |
| **React** | A UI library | Lets the page be built from reusable components (`Header`, `Hero`, `Contact`, etc.) instead of one giant HTML file |
| **TypeScript** | JavaScript with types | Catches typos and mismatched data shapes before you even run the code |
| **Tailwind CSS** | Utility-class styling | Styling is done with classes like `flex gap-4 text-white` directly in the markup, instead of separate CSS files |
| **shadcn/ui** | A component toolkit (buttons, dialogs, forms...) | Pre-built, accessible UI pieces (built on Radix UI) that you copy into your own codebase and can freely edit |
| **react-router-dom** | Client-side routing | Technically wired up, but this site is one page — it's really just handling the 404 fallback |
| **Supabase** | Backend-as-a-service | Used here for exactly one thing: hosting a server-side function (see below). No database tables exist in this project |
| **Resend** | Transactional email API | Actually sends the "someone filled out the contact form" email |

**Important nuance:** `react-query`, `react-hook-form`, `zod`, and most of the shadcn/ui components in `src/components/ui/` are installed but not used yet. They're standard scaffolding from the Lovable/shadcn template — safe to ignore unless you're about to build something that needs them (e.g. a more complex form with validation).

---

## 3. The site, as a story

1. A browser loads `index.html`.
2. That file loads `src/main.tsx`, which mounts the React app into the page.
3. `src/App.tsx` wraps everything in a few providers (data-fetching, tooltips, toast notifications, routing) and decides: is the URL `/`? Show the landing page. Anything else? Show a 404.
4. `src/pages/LandingPage.tsx` — the entire page — renders top to bottom: `Header → Hero → ClientsCarousel → Services → Work → Testimonials → Values → Process → FAQ → Contact → FinalCTA → Footer`.
5. Clicking a nav link ("Services", "Work", etc.) doesn't navigate anywhere — it smooth-scrolls to a section on the same page (`#services`, `#work`, ...).

All the content — service descriptions, case studies, testimonials, FAQ text — lives as plain data arrays near the top of `LandingPage.tsx` (`SERVICES`, `CASES`, `TESTIMONIALS`, `FAQS`, etc.). **To change the words on the site, you're almost always editing one of those arrays**, not hunting through JSX markup.

---

## 4. The one real backend flow: the contact form

This is the part worth understanding well, because it's the only place this "static" site talks to a server.

```
 Visitor's browser                Supabase Edge Function              Resend
┌───────────────────┐            ┌─────────────────────────┐       ┌──────────┐
│  Contact form      │  invoke    │ send-contact-email       │  POST │  Sends   │
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

Step by step:

1. **The form** (`Contact` component in `LandingPage.tsx`) holds `name`, `company`, `email`, `message` in plain React `useState` — no form library involved despite `react-hook-form`/`zod` being installed.
2. **On submit**, the browser calls `supabase.functions.invoke("send-contact-email", { body: form })`. This uses the Supabase client (`src/integrations/supabase/client.ts`), authenticated with the public `VITE_SUPABASE_PUBLISHABLE_KEY` — a key that's *meant* to be visible in browser code, unlike a database password.
3. **Supabase routes the request** to the Edge Function living at `supabase/functions/send-contact-email/index.ts`. This is a small Deno (JavaScript/TypeScript runtime) script that runs on Supabase's infrastructure, not in the browser.
4. **The function**:
   - Handles the CORS preflight browsers send automatically (`OPTIONS` requests)
   - Checks that `name`, `email`, and `message` were actually provided, and that the email looks like an email
   - Calls Resend's API (`https://api.resend.com/emails`) with an API key it reads from its own environment (`Deno.env.get("RESEND_API_KEY")`) — this key is **never** shipped to the browser, which is exactly why it lives here instead of in `.env`
   - Sends the notification to `contact@upsailorlabs.com`, with `reply_to` set to whatever email the visitor typed in, so replying goes straight to them
5. **The response** (success or error JSON) flows back to the browser, and the form shows a success state or an error message.

Why split it this way instead of calling Resend directly from the browser? Because that would mean shipping your Resend API key inside the JavaScript bundle, where literally anyone visiting the site could copy it out of devtools and start sending email as you. The Edge Function exists specifically to keep that key server-side.

---

## 5. Two kinds of secrets, two different homes

This project has two categories of configuration, and mixing them up is the most common way to break something (or leak something):

| | Lives in | Visible to the browser? | Example |
|---|---|---|---|
| **Public config** | `.env` at the project root, prefixed `VITE_` | **Yes** — Vite bakes these into the JS bundle | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` |
| **Server secret** | Supabase Edge Function secrets (set via `supabase secrets set` or the dashboard) | **No** — only readable inside the function at runtime | `RESEND_API_KEY` |

Rule of thumb: if a value grants write access, costs money per use, or should never be public, it does **not** belong in `.env` — it belongs in Supabase's function secrets, the same way `RESEND_API_KEY` does.

---

## 6. Folder map, with plain-English notes

```
src/
├── main.tsx              Boots React into the page
├── App.tsx                Sets up providers + the two routes (/ and 404)
├── pages/
│   ├── Index.tsx           Just renders <LandingPage />
│   ├── LandingPage.tsx     The whole site: content data + every section component
│   └── NotFound.tsx        404 page
├── components/
│   ├── NavLink.tsx          Small router-aware link wrapper
│   └── ui/                  shadcn/ui primitives (buttons, dialogs, etc.) — a component library, not page content
├── hooks/
│   ├── use-mobile.tsx        "Is the viewport mobile-sized?" hook
│   └── use-toast.ts          Powers the little toast/notification popups
├── integrations/supabase/
│   ├── client.ts              Creates the Supabase client using the public env vars
│   └── types.ts               Auto-generated DB types — empty, because there are no tables
├── lib/utils.ts               `cn()` helper for merging Tailwind classes
├── assets/                    Logo images
└── test/                      Vitest setup (mostly placeholder tests today)

supabase/
├── config.toml                 Tells Supabase which project this repo is linked to
└── functions/send-contact-email/index.ts    The email-sending function described above
```

---

## 7. Running it locally

```bash
npm install       # or bun install — bun.lockb is present too
npm run dev       # starts Vite on http://localhost:8080
```

That's enough to browse the whole site. The contact form's *submission* only fully works end-to-end once the linked Supabase project has:
- The `send-contact-email` function deployed (`supabase functions deploy send-contact-email`)
- A `RESEND_API_KEY` secret set (`supabase secrets set RESEND_API_KEY=...`)

Other useful scripts:

| Command | Does what |
|---|---|
| `npm run build` | Production build (outputs static files ready to host anywhere) |
| `npm run lint` | Runs ESLint |
| `npm run test` | Runs the Vitest test suite once |
| `npm run preview` | Serves the production build locally, to sanity-check before deploying |

---

## 8. If you're new to a couple of these concepts

- **"Edge Function"** — just a small server-side function, deployed close to users geographically for low latency. Functionally, think of it as a tiny API endpoint you don't have to run a whole server for.
- **Anon / publishable key** — a Supabase API key that's *designed* to be public. It identifies which project you're talking to; it doesn't grant broad access on its own (access rules are enforced separately). Safe to commit to a public `.env` in spirit, though this repo's `.env` is still gitignored as general hygiene.
- **CORS preflight (`OPTIONS` request)** — before a browser sends certain cross-origin requests, it first asks the server "are you okay receiving this?" via an automatic `OPTIONS` request. The Edge Function has to answer that or the real request never gets sent — that's what the `OPTIONS` handling at the top of `index.ts` is for.
