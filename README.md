# Job Tracker

A production-quality job application tracking dashboard, built as a portfolio piece to demonstrate modern React engineering — architecture, testing, accessibility, and performance.

**Live:** https://job-tracker-flax-ten.vercel.app

---

## Highlights

- **React 19 + TypeScript (strict)** on Vite 8, deployed to Vercel
- **Supabase** PostgreSQL with Row-Level Security, Auth, and Realtime
- **TanStack Query** for server state with optimistic updates; **Zustand** for UI-only state
- **Kanban + Table views** with drag-and-drop via `@dnd-kit` (the modern successor to `react-beautiful-dnd`)
- **Analytics dashboard** with Recharts (status breakdown, application timeline, funnel)
- **Form layer** with `react-hook-form` + `zod` for type-safe validation
- **Accessibility:** axe-tested, keyboard-navigable, semantic landmarks
- **Performance:** code-split vendor chunks, lazy-loaded routes
- **Tested** with Vitest + React Testing Library + `vitest-axe`

### Lighthouse (production, Desktop)

| Metric          | Score   |
| --------------- | ------- |
| Performance     | 100     |
| Accessibility   | 98 / 92 |
| Best Practices  | 96–100  |
| SEO             | 100     |

LCP < 1s · TBT 0ms · CLS 0 · Initial JS ≈ 220 kB gzipped on `/applications`.

---

## Tech Stack

| Layer            | Choice                                  | Why                                                 |
| ---------------- | --------------------------------------- | --------------------------------------------------- |
| Framework        | React 19 + TypeScript 6 (strict)        | Concurrent rendering, latest hooks                  |
| Build            | Vite 8                                  | Fast dev server, predictable Rollup output          |
| Styling          | Tailwind CSS 4 + shadcn/ui (radix-nova) | Utility-first; Radix primitives for a11y            |
| Client state     | Zustand                                 | Tiny, no Provider boilerplate                       |
| Server state     | TanStack Query                          | Caching, dedup, optimistic updates                  |
| Backend          | Supabase                                | Postgres + RLS + Auth + Realtime in one             |
| Routing          | react-router-dom 7                      | Lazy-loaded routes                                  |
| Drag & drop      | @dnd-kit                                | Accessible, modern (not deprecated)                 |
| Forms            | react-hook-form + zod                   | Uncontrolled inputs + schema validation             |
| Charts           | Recharts                                | Composable, accessible SVG charts                   |
| Tests            | Vitest + RTL + vitest-axe               | Unit/integration + a11y assertions                  |
| Package manager  | pnpm                                    | Disk-efficient, strict peer deps                    |

---

## Features

- Email/password auth with session persistence and protected routes
- Create, edit, delete applications with optimistic UI
- Drag applications between status columns (Kanban) — status persists to Supabase
- Slide-out detail panel with activity timeline and contacts
- Filter, sort, search across applications; switch between Kanban / Table views
- Realtime sync — open two tabs and watch changes propagate
- Analytics: status distribution, weekly application trend, conversion funnel
- Fully responsive with collapsible sidebar and mobile nav

---

## Architecture

See [`docs/SYSTEM_DESIGN.md`](./docs/SYSTEM_DESIGN.md) for the full write-up.

Short version:

- **State split.** Server data lives in TanStack Query; UI state lives in Zustand. They never mix.
- **Hooks-first data layer.** Components never call Supabase directly — every query/mutation has a dedicated hook in `src/hooks/`.
- **Optimistic mutations.** Create/update/delete cancel in-flight queries, snapshot the previous cache, apply the change, and roll back on error.
- **Realtime as cache invalidation.** A single subscription listens for changes and calls `queryClient.invalidateQueries` instead of patching the cache manually.
- **Bundle strategy.** Manual `manualChunks` in `vite.config.ts` splits React, Supabase, Query, Recharts, dnd-kit, and the forms stack into long-lived vendor chunks.

---

## Project Structure

```
src/
├── components/   # Feature components grouped by domain
│   ├── ui/       # shadcn primitives (do not edit by hand)
│   ├── layout/   # AppLayout, Sidebar, Header, MobileNav
│   ├── kanban/   # Board, columns, cards, DnD context
│   ├── applications/
│   ├── analytics/
│   ├── activity/
│   └── auth/
├── hooks/        # All data fetching + mutations + auth
├── stores/       # Zustand UI store
├── lib/          # supabase client, utils, constants
├── types/        # Hand-written + generated DB types
├── pages/        # Route components
├── test/         # Vitest setup
├── App.tsx       # Routes
└── main.tsx      # Providers (QueryClient, Router, Toaster)
```

---

## Getting Started

```bash
pnpm install
cp .env.example .env       # then fill in Supabase URL + anon key
pnpm dev                   # http://localhost:5173
```

### Scripts

| Command              | Description                            |
| -------------------- | -------------------------------------- |
| `pnpm dev`           | Start dev server                       |
| `pnpm build`         | Type-check + production build          |
| `pnpm preview`       | Preview production build locally       |
| `pnpm lint`          | ESLint                                 |
| `pnpm test`          | Vitest in watch mode                   |
| `pnpm test:run`      | Vitest single run                      |
| `pnpm test:coverage` | Coverage report (v8)                   |

### Environment

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

The Supabase schema (tables, RLS, triggers, realtime publication) is documented in [`docs/SYSTEM_DESIGN.md`](./docs/SYSTEM_DESIGN.md).

---

## Deployment

- Vercel watches the `master` branch — push to `master` triggers a production deploy
- Feature work flows through PRs into `master`
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` live in Vercel project settings
- The Vercel domain is whitelisted in Supabase Auth → URL Configuration

---

## What I Learned

A few decisions worth calling out:

- **Splitting client and server state by tool, not by file.** Mixing both into one store muddies cache invalidation. Keeping TanStack Query as the only source of truth for server data made optimistic updates straightforward.
- **Realtime ≠ live editing.** Realtime events here just invalidate queries. Trying to patch the cache from event payloads duplicated logic and was easy to get wrong.
- **`@dnd-kit` over `react-beautiful-dnd`.** The latter is deprecated and not maintained for React 19; `@dnd-kit` is also more accessible by default.
- **`react-hook-form` + `zod` resolver.** Uncontrolled inputs avoid re-renders on every keystroke; zod gives one source of truth for shape + messages.

---

## License

MIT
