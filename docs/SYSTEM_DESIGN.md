# Job Tracker — System Design

## 1. Goals and Constraints

**Goal:** A single-user job application tracker that feels production-quality — fast, accessible, real-time, with sensible failure modes.

**Constraints:**

- Single full-stack engineer, ~2 weeks of build time
- No backend service to operate — managed Postgres only
- Must run free-tier-friendly (Vercel + Supabase)
- Must be portfolio-credible: visible architecture, tests, a11y, performance

**Non-goals:**

- Multi-tenant collaboration
- Server-side rendering / SEO beyond the marketing surface
- Mobile app

---

## 2. High-Level Architecture

```
┌─────────────────────────┐        ┌─────────────────────────────┐
│   Browser (Vercel CDN)  │        │          Supabase           │
│                         │        │                             │
│  React 19 + Vite SPA    │  HTTPS │  PostgreSQL (RLS)           │
│  ┌───────────────────┐  │ ◀────▶ │  Auth (JWT)                 │
│  │ TanStack Query    │  │        │  Realtime (WebSocket)       │
│  │ Zustand (UI)      │  │        │                             │
│  └───────────────────┘  │        └─────────────────────────────┘
└─────────────────────────┘
```

The SPA is statically hosted on Vercel. All data and auth go to Supabase. There is **no application server** of our own — Supabase's PostgREST + Auth + Realtime services replace it. Authorization is enforced in the database via Row-Level Security, not in client code.

---

## 3. Data Model

Three tables, all owned by `auth.users.id`:

### `applications`

| Column         | Type                | Notes                                         |
| -------------- | ------------------- | --------------------------------------------- |
| `id`           | uuid PK             | Generated                                     |
| `user_id`      | uuid FK             | `auth.users.id`; RLS scope                    |
| `company`      | text NOT NULL       |                                               |
| `role`         | text NOT NULL       |                                               |
| `status`       | enum                | applied / phone_screen / interview / offer / rejected / withdrawn |
| `salary_min`   | int                 |                                               |
| `salary_max`   | int                 |                                               |
| `location`     | text                |                                               |
| `url`          | text                |                                               |
| `notes`        | text                |                                               |
| `applied_date` | date                | Default `current_date`                        |
| `created_at`   | timestamptz         | Default `now()`                               |
| `updated_at`   | timestamptz         | Trigger-updated on row change                 |

### `contacts`

Foreign key to `applications(id)` with `ON DELETE CASCADE`. Fields: `name` (required), `email`, `role`, `company`, `linkedin_url`.

### `activities`

Foreign key to `applications(id)` with `ON DELETE CASCADE`. `type` enum (`applied | email | call | interview | offer | rejection | follow_up | note`), `description`, `date`.

### Indexes

- `applications(user_id, applied_date DESC)` — feeds the default list query
- `applications(user_id, status)` — for Kanban groupings and analytics
- `activities(application_id, date DESC)` — for the detail panel timeline

### Row-Level Security

Each table has identical policies for SELECT/INSERT/UPDATE/DELETE: `auth.uid() = user_id`. There is no path to read another user's row even with a leaked anon key.

---

## 4. Frontend Architecture

### State management

| Concern                                | Tool              | Why                                                  |
| -------------------------------------- | ----------------- | ---------------------------------------------------- |
| Sidebar open, view mode, filters, sort | Zustand           | UI-only, never serialized to the server              |
| Auth session                           | `useAuth` hook    | Wraps `supabase.auth.onAuthStateChange`              |
| Applications / activities / contacts   | TanStack Query    | Caching, dedup, optimistic mutations, invalidations  |
| Form state                             | `react-hook-form` | Uncontrolled inputs, fewer re-renders                |
| Form validation                        | `zod`             | Single schema → types + error messages               |

**Rule:** if the data came from Supabase, it lives in TanStack Query. Zustand is never used as a server cache.

### Query keys

```
['applications']
['application', id]
['activities', applicationId]
['contacts']
['contacts', applicationId]
```

Flat, hierarchical, easy to invalidate by prefix.

### Optimistic update pattern

Implemented in every mutation hook (`useCreateApplication`, `useUpdateApplication`, `useDeleteApplication`):

```
onMutate:
  cancelQueries(['applications'])
  snapshot = queryClient.getQueryData(['applications'])
  queryClient.setQueryData(['applications'], applyChange)
  return { snapshot }

onError(_, __, { snapshot }):
  queryClient.setQueryData(['applications'], snapshot)
  toast.error(...)

onSettled:
  invalidateQueries(['applications'])
```

This makes the UI feel instant while still self-healing if the server rejects the write.

### Realtime as cache invalidation

`useRealtimeSubscription` opens one WebSocket subscription per signed-in user. When a row changes in `applications` or `activities`, the handler calls `queryClient.invalidateQueries(...)` for the affected key. We deliberately **do not** patch the cache from the event payload — invalidation is dumber, safer, and avoids a class of bugs around partial payloads and out-of-order events.

### Routing and code splitting

`App.tsx` defines flat routes. The dashboard route is lazy-loaded with `React.lazy` so the analytics + Recharts cost is not in the initial bundle. `vite.config.ts` further splits vendor code into long-lived chunks:

```
react-vendor  React, ReactDOM, React Router
supabase      @supabase/supabase-js
query         @tanstack/react-query
charts        Recharts
dnd           @dnd-kit/* family
forms         react-hook-form, @hookform/resolvers, zod
```

Net effect: on `/applications`, the user downloads ~220 kB gzipped and never re-downloads the React or Supabase chunks across deploys that don't touch them.

---

## 5. Auth Flow

1. User signs up with email + password → Supabase issues a JWT
2. JWT is stored by `@supabase/supabase-js` in `localStorage`
3. `useAuth` subscribes to `onAuthStateChange` and exposes `session` to the app
4. `ProtectedRoute` redirects to `/login` when `session === null`
5. PostgREST receives the JWT on every request; RLS uses `auth.uid()` to filter rows
6. Sign-out clears the session and invalidates the TanStack Query cache

There is no separate "user profile" table — `auth.users.id` is the only identity we need.

---

## 6. Failure Modes and How We Handle Them

| Failure                                | Handling                                                                       |
| -------------------------------------- | ------------------------------------------------------------------------------ |
| Network drops mid-mutation             | Optimistic update rolls back; toast surfaces the error                         |
| Realtime socket disconnects            | TanStack Query's `staleTime` + window-focus refetch refills missed data        |
| User opens app in two tabs             | Realtime invalidation keeps both caches in sync                                |
| JWT expires                            | Supabase client refreshes silently; `onAuthStateChange` updates `session`      |
| Stale optimistic data after RLS reject | `onSettled` invalidate refetches the canonical server state                    |
| Slow query on first load               | Suspense-friendly skeletons; route is lazy-loaded so the shell renders first   |

---

## 7. Performance

- **Initial bundle:** ~220 kB gzipped on `/applications`, split across six vendor chunks
- **LCP:** under 1s in production
- **TBT / CLS:** 0
- **Lighthouse Perf:** 100 (Desktop)

Levers used: route-level `React.lazy`, manual `manualChunks`, Tailwind's purged CSS, Geist variable font with `font-display: swap`, no client-side image processing.

---

## 8. Accessibility

- Semantic landmarks (`<header>`, `<nav>`, `<main>`) in `AppLayout`
- All interactive elements reachable by keyboard; visible focus rings preserved
- `@dnd-kit` ships keyboard sensors — drag is operable without a mouse
- Forms use `<Label htmlFor>` and aria-describedby for errors
- `vitest-axe` runs in CI for the rendered Login and Applications pages
- Lighthouse a11y: 98 on Login, 92 on Applications (kanban scoring quirk; manually verified)

---

## 9. Testing Strategy

- **Unit / integration:** Vitest + React Testing Library, hitting the component tree, not implementation details
- **Hook tests:** `renderHook` for query/mutation hooks with a `QueryClientProvider` wrapper
- **Accessibility:** `vitest-axe` smoke tests on rendered pages
- **Coverage:** v8 provider, excluding `src/components/ui/` (shadcn-managed) and types

We do not unit-test the Supabase client — its contract is integration-tested through the hooks.

---

## 10. Trade-offs and What I'd Do Next

**Picked Supabase over a custom backend.** It eliminates an entire service, but locks us into PostgREST conventions and Supabase-managed Auth. For a portfolio tracker that's the right call.

**Single user, no sharing.** Adding "share this application with my mentor" would require a join table and policy rewrite, not a schema redesign.

**No SSR.** The app is gated by auth, so SEO and time-to-first-byte don't matter the way they would for a public surface. If marketing pages ever land, they'd move to a separate Next.js or Astro project.

**Optimistic updates are hand-rolled per mutation.** If the surface grew, I'd extract a generic `useOptimisticMutation` helper. Today, three mutations isn't enough to justify the abstraction.

**Next steps if I kept building:**

- Resume + cover letter attachments (Supabase Storage)
- Email-to-application ingestion (Supabase Edge Function listening to a Gmail forwarder)
- Calendar integration for interview reminders
- An "insights" view that benchmarks response rate against the 7-day average
